<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\H2hProduct;
use App\Models\Product;
use App\Models\ProductItem;
use App\Models\SiteSetting;
use App\Models\Transaction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class H2hCheckoutTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        SiteSetting::setSettings([
            'h2h_api_key' => 'TEST_KEY_123',
            'h2h_api_secret' => 'TEST_SECRET_456',
            'h2h_api_url' => 'https://maitriproject.my.id/api/v1/h2h',
        ]);
    }

    public function test_can_checkout_product_via_qris_and_redirect_to_invoice(): void
    {
        $category = Category::create([
            'name' => 'Games',
            'slug' => 'games',
            'is_active' => true,
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Mobile Legends',
            'slug' => 'mobile-legends',
            'input_type' => 'id_zone',
            'input_label' => 'User ID',
            'has_zone_id' => true,
            'is_active' => true,
        ]);

        H2hProduct::create([
            'buyer_sku_code' => 'ML-86',
            'product_name' => 'Mobile Legends - 86 Diamonds',
            'category' => 'Games',
            'brand' => 'MOBILE LEGENDS',
            'type' => 'Umum',
            'seller_name' => 'Maitri Provider',
            'price' => 20000,
            'buyer_product_status' => true,
            'seller_product_status' => true,
            'unlimited_stock' => true,
            'stock' => 999,
            'multi' => true,
            'status' => 'AVAILABLE',
            'is_active' => true,
        ]);

        $item = ProductItem::create([
            'product_id' => $product->id,
            'buyer_sku_code' => 'ML-86',
            'name' => '86 Diamonds',
            'h2h_price' => 20000,
            'price' => 22000,
            'profit_type' => 'fixed',
            'profit_value' => 2000,
            'status' => 'AVAILABLE',
            'is_active' => true,
        ]);

        // Fake H2H API response
        Http::fake([
            'https://maitriproject.my.id/api/v1/h2h/checkout' => Http::response([
                'success' => true,
                'message' => 'H2H Invoice & QRIS generated successfully.',
                'data' => [
                    'reseller_ref_id' => 'INV-TEST-001',
                    'maitri_invoice' => 'TRX-20260911-ABC123',
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
                    'qr_content' => '00020101021226670016COM.PAYDISINI.WWW01189360089800000001',
                    'checkout_url' => 'https://paydisini.co.id/v2/checkout/20260911ABC123',
                    'expired_at' => now()->addMinutes(30)->toIso8601String(),
                ],
            ], 200),
        ]);

        $response = $this->post(route('checkout.store'), [
            'item_id' => $item->id,
            'target_input' => '12345678',
            'zone_id' => '2001',
            'whatsapp' => '08123456789',
            'email' => 'customer@gmail.com',
            'payment_method' => 'qris',
        ]);

        $this->assertDatabaseCount('transactions', 1);
        $transaction = Transaction::first();

        $this->assertNotNull($transaction);
        $this->assertEquals('ML-86', $transaction->buyer_sku_code);
        $this->assertEquals('12345678 (2001)', $transaction->customer_no);
        $this->assertEquals('customer@gmail.com', $transaction->customer_email);
        $this->assertEquals(22000, $transaction->reseller_price);
        $this->assertEquals(165, $transaction->admin_fee);
        $this->assertEquals(22165, $transaction->total_payment);
        $this->assertEquals('TRX-20260911-ABC123', $transaction->maitri_invoice);
        $this->assertEquals('UNPAID', $transaction->payment_status);
        $this->assertEquals('WAITING_PAYMENT', $transaction->topup_status);
        $this->assertStringContainsString('0002010102122667', $transaction->qr_content);

        // Assert redirect to invoice
        $response->assertRedirect(route('invoice.show', ['invoice_code' => $transaction->invoice_code]));

        // Test accessing invoice page
        $invoicePage = $this->get(route('invoice.show', ['invoice_code' => $transaction->invoice_code]));
        $invoicePage->assertOk();

        // Test polling status endpoint
        $statusEndpoint = $this->get(route('invoice.status', ['invoice_code' => $transaction->invoice_code]));
        $statusEndpoint->assertOk();
        $statusEndpoint->assertJson([
            'success' => true,
            'invoice_code' => $transaction->invoice_code,
            'payment_status' => 'UNPAID',
            'is_paid' => false,
        ]);
    }

    public function test_checkout_requires_whatsapp_and_email(): void
    {
        $category = Category::create([
            'name' => 'Games',
            'slug' => 'games-validation',
            'is_active' => true,
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Mobile Legends Val',
            'slug' => 'mobile-legends-val',
            'input_type' => 'id_zone',
            'input_label' => 'User ID',
            'has_zone_id' => true,
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

        // Attempt checkout without whatsapp and email
        $response = $this->post(route('checkout.store'), [
            'item_id' => $item->id,
            'target_input' => '12345678',
            'payment_method' => 'qris',
        ]);

        $response->assertSessionHasErrors(['whatsapp', 'email']);

        // Attempt checkout with invalid email
        $invalidEmailResponse = $this->post(route('checkout.store'), [
            'item_id' => $item->id,
            'target_input' => '12345678',
            'whatsapp' => '08123456789',
            'email' => 'bukan-email',
            'payment_method' => 'qris',
        ]);

        $invalidEmailResponse->assertSessionHasErrors(['email']);
    }
}
