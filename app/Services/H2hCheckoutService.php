<?php

namespace App\Services;

use App\Models\SiteSetting;
use App\Models\Transaction;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class H2hCheckoutService
{
    /**
     * Create H2H Checkout request to Maitri Project API.
     *
     * @return array{
     *     success: bool,
     *     message: string,
     *     transaction: ?Transaction,
     *     data?: array
     * }
     */
    public function createCheckout(Transaction $transaction): array
    {
        $settings = SiteSetting::getSettings();
        $apiKey = $settings['h2h_api_key'] ?? '';
        $apiSecret = $settings['h2h_api_secret'] ?? '';

        if (empty($apiKey) || empty($apiSecret)) {
            return [
                'success' => false,
                'message' => 'Kredensial API H2H (API Key atau API Secret) belum diatur di Pengaturan Toko.',
                'transaction' => $transaction,
            ];
        }

        $baseUrl = rtrim($settings['h2h_api_url'] ?? 'https://maitriproject.my.id/api/v1/h2h', '/');
        $endpoint = $baseUrl.'/checkout';

        // Formula HMAC-SHA256: hash_hmac('sha256', reseller_ref_id . api_key, api_secret)
        $signature = hash_hmac('sha256', $transaction->invoice_code.$apiKey, $apiSecret);

        $payload = [
            'reseller_ref_id' => $transaction->invoice_code,
            'buyer_sku_code' => $transaction->buyer_sku_code,
            'customer_no' => $transaction->customer_no,
            'reseller_price' => (int) $transaction->reseller_price,
            'service' => $transaction->service ?: '11',
        ];

        try {
            $response = Http::timeout(30)
                ->withHeaders([
                    'X-Maitri-API-Key' => $apiKey,
                    'X-Maitri-Signature' => $signature,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ])
                ->post($endpoint, $payload);

            $result = $response->json();

            if (! $response->successful() || ! ($result['success'] ?? false)) {
                $errorMessage = $result['message'] ?? 'Terjadi kesalahan saat memproses checkout ke provider H2H.';

                Log::error('H2H Checkout Error Response', [
                    'invoice' => $transaction->invoice_code,
                    'status' => $response->status(),
                    'response' => $result,
                ]);

                return [
                    'success' => false,
                    'message' => $errorMessage,
                    'transaction' => $transaction,
                ];
            }

            $data = $result['data'] ?? [];

            // Update Transaction with H2H details
            $transaction->update([
                'maitri_invoice' => $data['maitri_invoice'] ?? null,
                'h2h_price' => $data['h2h_price'] ?? $transaction->h2h_price,
                'admin_fee' => $data['admin_fee'] ?? 0,
                'total_payment' => $data['total_payment'] ?? ($transaction->reseller_price + ($data['admin_fee'] ?? 0)),
                'commission_amount' => $data['commission_amount'] ?? ($transaction->reseller_price - ($data['h2h_price'] ?? $transaction->h2h_price)),
                'qr_content' => $data['qr_content'] ?? null,
                'checkout_url' => $data['checkout_url'] ?? null,
                'payment_status' => $data['payment_status'] ?? 'UNPAID',
                'topup_status' => $data['topup_status'] ?? 'WAITING_PAYMENT',
                'expired_at' => ! empty($data['expired_at']) ? Carbon::parse($data['expired_at']) : Carbon::now()->addMinutes(30),
                'raw_checkout_response' => $result,
            ]);

            return [
                'success' => true,
                'message' => $result['message'] ?? 'Invoice & QRIS H2H berhasil dibuat.',
                'transaction' => $transaction->fresh(),
                'data' => $data,
            ];
        } catch (Exception $e) {
            Log::error('H2H Checkout Exception', [
                'invoice' => $transaction->invoice_code,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'Koneksi ke gateway H2H gagal: '.$e->getMessage(),
                'transaction' => $transaction,
            ];
        }
    }

    /**
     * Check transaction status directly from H2H API.
     */
    public function checkStatus(string $invoiceCode): array
    {
        $settings = SiteSetting::getSettings();
        $apiKey = $settings['h2h_api_key'] ?? '';
        $apiSecret = $settings['h2h_api_secret'] ?? '';

        if (empty($apiKey) || empty($apiSecret)) {
            return [
                'success' => false,
                'message' => 'Kredensial API H2H belum diatur.',
            ];
        }

        $baseUrl = rtrim($settings['h2h_api_url'] ?? 'https://maitriproject.my.id/api/v1/h2h', '/');
        $endpoint = $baseUrl.'/status/'.urlencode($invoiceCode);
        $signature = hash_hmac('sha256', $invoiceCode.$apiKey, $apiSecret);

        try {
            $response = Http::timeout(15)
                ->withHeaders([
                    'X-Maitri-API-Key' => $apiKey,
                    'X-Maitri-Signature' => $signature,
                    'Accept' => 'application/json',
                ])
                ->get($endpoint);

            return $response->json() ?? [];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Synchronize a transaction with live provider status and send invoice email if completed.
     */
    public function syncTransactionStatus(Transaction $transaction): Transaction
    {
        // If already in a final state, return as is
        if ($transaction->isTopupCompleted() || $transaction->isTopupFailed() || $transaction->isExpired()) {
            return $transaction;
        }

        $statusResponse = $this->checkStatus($transaction->invoice_code);

        if (! empty($statusResponse['success']) || ! empty($statusResponse['data'])) {
            $data = $statusResponse['data'] ?? $statusResponse;

            $updateData = [];

            if (! empty($data['payment_status'])) {
                $paymentStatus = strtoupper($data['payment_status']);
                $updateData['payment_status'] = $paymentStatus;
                if (in_array($paymentStatus, ['PAID', 'SETTLED', 'SUCCESS']) && ! $transaction->paid_at) {
                    $updateData['paid_at'] = Carbon::now();
                }
            }

            if (! empty($data['topup_status'])) {
                $topupStatus = strtoupper($data['topup_status']);
                $updateData['topup_status'] = $topupStatus;
                if (($topupStatus === 'SUCCESS' || $topupStatus === 'FAILED') && ! $transaction->completed_at) {
                    $updateData['completed_at'] = Carbon::now();
                }
            }

            if (! empty($data['sn'])) {
                $updateData['sn'] = $data['sn'];
            }

            if (! empty($data['message'])) {
                $updateData['topup_message'] = $data['message'];
            }

            if (! empty($data['maitri_invoice'])) {
                $updateData['maitri_invoice'] = $data['maitri_invoice'];
            }

            if (! empty($updateData)) {
                $transaction->update($updateData);
            }

            // Otomatis kirim email invoice (sukses / gagal) jika transaksi telah lunas & berstatus final
            $fresh = $transaction->fresh();
            $fresh->sendInvoiceEmail();

            return $fresh;
        }

        return $transaction;
    }

    /**
     * Get H2H Reseller profile and balance from Maitri API.
     */
    public function getProfile(): array
    {
        $settings = SiteSetting::getSettings();
        $apiKey = $settings['h2h_api_key'] ?? '';

        if (empty($apiKey)) {
            return [
                'success' => false,
                'message' => 'Kredensial API H2H belum diatur di Pengaturan Toko.',
            ];
        }

        $baseUrl = rtrim($settings['h2h_api_url'] ?? 'https://maitriproject.my.id/api/v1/h2h', '/');
        $endpoint = str_contains($baseUrl, '/api/v1/h2h')
            ? $baseUrl.'/profile'
            : $baseUrl.'/api/v1/h2h/profile';

        try {
            $response = Http::withoutVerifying()
                ->withHeaders([
                    'X-Maitri-API-Key' => $apiKey,
                    'Accept' => 'application/json',
                ])
                ->timeout(8)
                ->get($endpoint);

            if ($response->successful()) {
                $payload = $response->json();
                $data = $payload['data'] ?? $payload;

                $balance = $data['commission_balance'] ?? $data['balance'] ?? 0;
                $formattedBalance = $data['formatted_balance'] ?? ('Rp '.number_format((float) $balance, 0, ',', '.'));

                return [
                    'success' => true,
                    'message' => 'Berhasil terhubung ke server H2H.',
                    'profile' => [
                        'reseller_name' => $data['reseller_name'] ?? $data['name'] ?? 'Maitri Reseller',
                        'name' => $data['reseller_name'] ?? $data['name'] ?? 'Maitri Reseller',
                        'email' => $data['email'] ?? '-',
                        'phone' => $data['phone'] ?? '-',
                        'status' => $data['status'] ?? 'ACTIVE',
                        'balance' => $balance,
                        'formatted_balance' => $formattedBalance,
                    ],
                ];
            }

            return [
                'success' => false,
                'message' => $response->json('message') ?? 'Gagal mengambil data profil provider.',
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }
}
