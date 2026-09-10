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
}
