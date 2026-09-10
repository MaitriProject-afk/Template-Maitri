<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductItem;
use App\Models\SiteSetting;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class H2hWebhookTest extends TestCase
{
    use RefreshDatabase;

    protected string $apiKey = 'TEST_KEY_123';

    protected string $apiSecret = 'TEST_SECRET_456';

    protected Transaction $transaction;

    protected function setUp(): void
    {
        parent::setUp();

        SiteSetting::setSettings([
            'h2h_api_key' => $this->apiKey,
            'h2h_api_secret' => $this->apiSecret,
        ]);

        $category = Category::create([
            'name' => 'Games',
            'slug' => 'games',
            'is_active' => true,
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Mobile Legends',
            'slug' => 'mobile-legends',
            'is_active' => true,
        ]);

        $item = ProductItem::create([
            'product_id' => $product->id,
            'buyer_sku_code' => 'ML-86',
            'name' => '86 Diamonds',
            'h2h_price' => 20000,
            'price' => 22000,
            'status' => 'AVAILABLE',
            'is_active' => true,
        ]);

        $this->transaction = Transaction::create([
            'invoice_code' => 'INV-TEST-9901',
            'maitri_invoice' => 'TRX-TEST-001',
            'product_id' => $product->id,
            'product_item_id' => $item->id,
            'buyer_sku_code' => 'ML-86',
            'product_name' => 'Mobile Legends - 86 Diamonds',
            'customer_no' => '12345678 (2001)',
            'h2h_price' => 20000,
            'reseller_price' => 22000,
            'admin_fee' => 165,
            'total_payment' => 22165,
            'commission_amount' => 2000,
            'payment_status' => 'UNPAID',
            'topup_status' => 'WAITING_PAYMENT',
        ]);
    }

    public function test_webhook_rejects_invalid_signature(): void
    {
        $payload = [
            'event' => 'payment.success',
            'reseller_ref_id' => $this->transaction->invoice_code,
            'maitri_invoice' => 'TRX-TEST-001',
            'payment_status' => 'PAID',
            'message' => 'Pembayaran berhasil diverifikasi.',
        ];

        $response = $this->postJson(route('api.h2h.callback'), $payload, [
            'X-Maitri-Signature' => 'INVALID_SIGNATURE_HEX',
            'X-Maitri-Event' => 'payment.success',
        ]);

        $response->assertStatus(401);
        $response->assertJson([
            'status' => 'error',
            'message' => 'Unauthorized: Invalid Signature',
        ]);
    }

    public function test_webhook_handles_payment_success_event(): void
    {
        $payload = [
            'event' => 'payment.success',
            'reseller_ref_id' => $this->transaction->invoice_code,
            'maitri_invoice' => 'TRX-TEST-001',
            'payment_status' => 'PAID',
            'message' => 'Pembayaran berhasil diverifikasi. Pesanan sedang diteruskan ke sistem pengisian.',
            'timestamp' => now()->toIso8601String(),
        ];

        // Formula: hash_hmac('sha256', reseller_ref_id . api_key, api_secret)
        $signature = hash_hmac('sha256', $this->transaction->invoice_code.$this->apiKey, $this->apiSecret);

        $response = $this->postJson(route('api.h2h.callback'), $payload, [
            'X-Maitri-Signature' => $signature,
            'X-Maitri-Event' => 'payment.success',
        ]);

        $response->assertOk();
        $response->assertJson(['status' => 'ok']);

        $this->transaction->refresh();
        $this->assertEquals('PAID', $this->transaction->payment_status);
        $this->assertEquals('PROCESSING', $this->transaction->topup_status);
        $this->assertEquals('Pembayaran berhasil diverifikasi. Pesanan sedang diteruskan ke sistem pengisian.', $this->transaction->payment_message);
        $this->assertNotNull($this->transaction->paid_at);
    }

    public function test_webhook_handles_payment_expired_event(): void
    {
        $payload = [
            'event' => 'payment.expired',
            'reseller_ref_id' => $this->transaction->invoice_code,
            'maitri_invoice' => 'TRX-TEST-001',
            'payment_status' => 'EXPIRED',
            'message' => 'Waktu pembayaran telah kadaluarsa atau dibatalkan oleh Payment Gateway.',
            'timestamp' => now()->toIso8601String(),
        ];

        $signature = hash_hmac('sha256', $this->transaction->invoice_code.$this->apiKey, $this->apiSecret);

        $response = $this->postJson(route('api.h2h.callback'), $payload, [
            'X-Maitri-Signature' => $signature,
            'X-Maitri-Event' => 'payment.expired',
        ]);

        $response->assertOk();
        $response->assertJson(['status' => 'ok']);

        $this->transaction->refresh();
        $this->assertEquals('EXPIRED', $this->transaction->payment_status);
        $this->assertTrue($this->transaction->isExpired());
        $this->assertEquals('Waktu pembayaran telah kadaluarsa atau dibatalkan oleh Payment Gateway.', $this->transaction->payment_message);
    }

    public function test_webhook_handles_topup_completed_success(): void
    {
        $payload = [
            'event' => 'topup.completed',
            'reseller_ref_id' => $this->transaction->invoice_code,
            'maitri_invoice' => 'TRX-TEST-001',
            'status' => 'SUCCESS',
            'sn' => 'SN-ML-102938481928401',
            'completed_at' => now()->toIso8601String(),
            'message' => 'Topup 86 Diamonds Mobile Legends berhasil diproses oleh Maitri Provider System',
        ];

        $signature = hash_hmac('sha256', $this->transaction->invoice_code.$this->apiKey, $this->apiSecret);

        $response = $this->postJson(route('api.h2h.callback'), $payload, [
            'X-Maitri-Signature' => $signature,
            'X-Maitri-Event' => 'topup.completed',
        ]);

        $response->assertOk();
        $response->assertJson(['status' => 'ok']);

        $this->transaction->refresh();
        $this->assertEquals('SUCCESS', $this->transaction->topup_status);
        $this->assertEquals('SN-ML-102938481928401', $this->transaction->sn);
        $this->assertEquals('Topup 86 Diamonds Mobile Legends berhasil diproses oleh Maitri Provider System', $this->transaction->topup_message);
        $this->assertNotNull($this->transaction->completed_at);
        $this->assertTrue($this->transaction->isTopupCompleted());
    }

    public function test_webhook_handles_topup_completed_failed(): void
    {
        $payload = [
            'event' => 'topup.completed',
            'reseller_ref_id' => $this->transaction->invoice_code,
            'maitri_invoice' => 'TRX-TEST-001',
            'status' => 'FAILED',
            'sn' => null,
            'completed_at' => now()->toIso8601String(),
            'message' => 'Nomor tujuan salah atau Produk sedang dalam pemeliharaan sistem (Maintenance)',
        ];

        $signature = hash_hmac('sha256', $this->transaction->invoice_code.$this->apiKey, $this->apiSecret);

        $response = $this->postJson(route('api.h2h.callback'), $payload, [
            'X-Maitri-Signature' => $signature,
            'X-Maitri-Event' => 'topup.completed',
        ]);

        $response->assertOk();
        $response->assertJson(['status' => 'ok']);

        $this->transaction->refresh();
        $this->assertEquals('FAILED', $this->transaction->topup_status);
        $this->assertNull($this->transaction->sn);
        $this->assertEquals('Nomor tujuan salah atau Produk sedang dalam pemeliharaan sistem (Maintenance)', $this->transaction->topup_message);
        $this->assertTrue($this->transaction->isTopupFailed());
    }
}
