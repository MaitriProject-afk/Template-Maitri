<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class H2hWebhookController extends Controller
{
    /**
     * Handle incoming 2-stage Webhook Callbacks from Maitri Project H2H.
     */
    public function handle(Request $request): JsonResponse
    {
        $receivedSignature = $request->header('X-Maitri-Signature') ?? '';
        $receivedEvent = $request->header('X-Maitri-Event') ?? '';
        $payload = $request->all();

        Log::info('Maitri H2H Webhook Received', [
            'event' => $receivedEvent,
            'signature' => $receivedSignature,
            'payload' => $payload,
        ]);

        if (empty($payload) || empty($payload['reseller_ref_id'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid JSON payload: missing reseller_ref_id',
            ], 400);
        }

        $refId = $payload['reseller_ref_id'];

        // Retrieve API credentials
        $settings = SiteSetting::getSettings();
        $apiKey = $settings['h2h_api_key'] ?? '';
        $apiSecret = $settings['h2h_api_secret'] ?? '';

        // Calculate expected HMAC-SHA256: hash_hmac('sha256', reseller_ref_id . api_key, api_secret)
        $expectedSignature = hash_hmac('sha256', $refId.$apiKey, $apiSecret);

        if (! hash_equals($expectedSignature, $receivedSignature)) {
            Log::warning('Maitri H2H Webhook Signature Mismatch', [
                'expected' => $expectedSignature,
                'received' => $receivedSignature,
                'ref_id' => $refId,
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized: Invalid Signature',
            ], 401);
        }

        $transaction = Transaction::where('invoice_code', $refId)->first();

        if (! $transaction) {
            Log::warning('Maitri H2H Webhook: Transaction not found', ['ref_id' => $refId]);

            return response()->json([
                'status' => 'error',
                'message' => 'Transaction not found in local system',
            ], 404);
        }

        // Determine event type
        $event = $receivedEvent ?: ($payload['event'] ?? '');
        $message = $payload['message'] ?? '';
        $timestamp = ! empty($payload['timestamp']) ? Carbon::parse($payload['timestamp']) : Carbon::now();

        $logs = $transaction->webhook_logs ?? [];
        $logs[] = [
            'event' => $event,
            'received_at' => Carbon::now()->toIso8601String(),
            'payload' => $payload,
        ];

        switch ($event) {
            case 'payment.success':
                // Tahap 1: Customer melunasi pembayaran QRIS
                $transaction->update([
                    'payment_status' => 'PAID',
                    'topup_status' => 'PROCESSING',
                    'payment_message' => $message ?: 'Pembayaran berhasil diverifikasi. Pesanan sedang diteruskan ke sistem pengisian.',
                    'paid_at' => $timestamp,
                    'maitri_invoice' => $payload['maitri_invoice'] ?? $transaction->maitri_invoice,
                    'webhook_logs' => $logs,
                ]);
                break;

            case 'payment.expired':
                // Tahap 1 Alternate: Waktu QRIS habis atau dibatalkan
                $transaction->update([
                    'payment_status' => 'EXPIRED',
                    'payment_message' => $message ?: 'Waktu pembayaran telah kadaluarsa atau dibatalkan oleh Payment Gateway.',
                    'webhook_logs' => $logs,
                ]);
                break;

            case 'topup.completed':
            case 'topup.failed':
                // Tahap 2: Hasil akhir pengisian dari provider
                $status = strtoupper($payload['status'] ?? ($event === 'topup.completed' ? 'SUCCESS' : 'FAILED'));
                $completedAt = ! empty($payload['completed_at']) ? Carbon::parse($payload['completed_at']) : Carbon::now();

                if ($status === 'SUCCESS') {
                    $transaction->update([
                        'topup_status' => 'SUCCESS',
                        'sn' => $payload['sn'] ?? null,
                        'topup_message' => $message ?: 'Pesanan topup telah berhasil diproses oleh provider.',
                        'completed_at' => $completedAt,
                        'webhook_logs' => $logs,
                    ]);
                } else {
                    $transaction->update([
                        'topup_status' => 'FAILED',
                        'topup_message' => $message ?: 'Pengisian gagal dari pihak provider sistem.',
                        'completed_at' => $completedAt,
                        'webhook_logs' => $logs,
                    ]);
                }

                // Otomatis kirim email invoice (sukses / gagal) jika transaksi telah lunas
                $transaction->fresh()->sendInvoiceEmail();
                break;

            default:
                Log::info('Maitri H2H Webhook: Unhandled event', ['event' => $event]);
                $transaction->update([
                    'webhook_logs' => $logs,
                ]);
                break;
        }

        return response()->json([
            'status' => 'ok',
        ]);
    }
}
