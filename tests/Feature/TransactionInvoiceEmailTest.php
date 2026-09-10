<?php

namespace Tests\Feature;

use App\Mail\TransactionInvoiceMail;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductItem;
use App\Models\SiteSetting;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class TransactionInvoiceEmailTest extends TestCase
{
    use RefreshDatabase;

    protected string $apiKey = 'TEST_KEY_123';

    protected string $apiSecret = 'TEST_SECRET_456';

    protected Product $product;

    protected ProductItem $item;

    protected function setUp(): void
    {
        parent::setUp();

        SiteSetting::setSettings([
            'h2h_api_key' => $this->apiKey,
            'h2h_api_secret' => $this->apiSecret,
            'contact_whatsapp' => '081234567890',
            'site_name' => 'Maitri Top Up Test',
        ]);

        $category = Category::create([
            'name' => 'Games',
            'slug' => 'games',
            'is_active' => true,
        ]);

        $this->product = Product::create([
            'category_id' => $category->id,
            'name' => 'Mobile Legends',
            'slug' => 'mobile-legends',
            'is_active' => true,
        ]);

        $this->item = ProductItem::create([
            'product_id' => $this->product->id,
            'buyer_sku_code' => 'ML-86',
            'name' => '86 Diamonds',
            'h2h_price' => 20000,
            'price' => 22000,
            'status' => 'AVAILABLE',
            'is_active' => true,
        ]);
    }

    public function test_send_invoice_email_success_condition(): void
    {
        Mail::fake();

        $transaction = Transaction::create([
            'invoice_code' => 'INV-TEST-SUCCESS-01',
            'product_id' => $this->product->id,
            'product_item_id' => $this->item->id,
            'buyer_sku_code' => 'ML-86',
            'product_name' => 'Mobile Legends - 86 Diamonds',
            'customer_no' => '12345678 (2001)',
            'customer_whatsapp' => '081234567890',
            'customer_email' => 'buyer@example.com',
            'h2h_price' => 20000,
            'reseller_price' => 22000,
            'admin_fee' => 0,
            'total_payment' => 22000,
            'payment_status' => 'PAID',
            'topup_status' => 'SUCCESS',
            'sn' => 'SN-MLBB-987654321',
            'completed_at' => Carbon::now(),
        ]);

        $result = $transaction->sendInvoiceEmail();

        $this->assertTrue($result);
        $this->assertNotNull($transaction->fresh()->invoice_email_sent_at);

        Mail::assertSent(TransactionInvoiceMail::class, function (TransactionInvoiceMail $mail) use ($transaction) {
            $this->assertEquals('success', $mail->type);
            $this->assertEquals('buyer@example.com', $transaction->getRecipientEmail());
            $this->assertStringContainsString('INV-TEST-SUCCESS-01', $mail->envelope()->subject);
            $this->assertStringContainsString('[INVOICE RESMI]', $mail->envelope()->subject);
            $this->assertEquals('emails.invoice-success', $mail->content()->view);

            return $mail->hasTo('buyer@example.com');
        });
    }

    public function test_send_invoice_email_failed_condition_with_whatsapp_button(): void
    {
        Mail::fake();

        SiteSetting::setSettings([
            'contact_whatsapp' => '087799887766',
        ]);

        $transaction = Transaction::create([
            'invoice_code' => 'INV-TEST-FAILED-02',
            'product_id' => $this->product->id,
            'product_item_id' => $this->item->id,
            'buyer_sku_code' => 'ML-86',
            'product_name' => 'Mobile Legends - 86 Diamonds',
            'customer_no' => '12345678 (2001)',
            'customer_whatsapp' => '081234567890',
            'customer_email' => 'buyer_failed@example.com',
            'h2h_price' => 20000,
            'reseller_price' => 22000,
            'admin_fee' => 0,
            'total_payment' => 22000,
            'payment_status' => 'PAID',
            'topup_status' => 'FAILED',
            'topup_message' => 'User ID Akun Game Tidak Ditemukan',
            'completed_at' => Carbon::now(),
        ]);

        $result = $transaction->sendInvoiceEmail();

        $this->assertTrue($result);
        $this->assertNotNull($transaction->fresh()->invoice_email_sent_at);

        Mail::assertSent(TransactionInvoiceMail::class, function (TransactionInvoiceMail $mail) {
            $this->assertEquals('failed', $mail->type);
            $this->assertStringContainsString('INV-TEST-FAILED-02', $mail->envelope()->subject);
            $this->assertStringContainsString('[PENTING]', $mail->envelope()->subject);
            $this->assertEquals('emails.invoice-failed', $mail->content()->view);

            $viewData = $mail->content()->with;
            $this->assertEquals('087799887766', $viewData['adminWhatsapp']);
            $this->assertEquals('6287799887766', $viewData['waClean']);
            $this->assertStringContainsString('https://wa.me/6287799887766', $viewData['waChatUrl']);
            $this->assertStringContainsString('INV-TEST-FAILED-02', $viewData['waChatUrl']);

            return $mail->hasTo('buyer_failed@example.com');
        });
    }

    public function test_send_invoice_email_will_not_send_if_unpaid(): void
    {
        Mail::fake();

        $transaction = Transaction::create([
            'invoice_code' => 'INV-TEST-UNPAID',
            'product_id' => $this->product->id,
            'product_item_id' => $this->item->id,
            'buyer_sku_code' => 'ML-86',
            'product_name' => 'Mobile Legends - 86 Diamonds',
            'customer_no' => '12345678 (2001)',
            'customer_email' => 'unpaid@example.com',
            'total_payment' => 22000,
            'payment_status' => 'UNPAID',
            'topup_status' => 'WAITING_PAYMENT',
        ]);

        $result = $transaction->sendInvoiceEmail();

        $this->assertFalse($result);
        Mail::assertNothingSent();
    }

    public function test_webhook_topup_completed_triggers_invoice_email_automatically(): void
    {
        Mail::fake();

        $transaction = Transaction::create([
            'invoice_code' => 'INV-WEBHOOK-EMAIL-01',
            'maitri_invoice' => 'TRX-WB-01',
            'product_id' => $this->product->id,
            'product_item_id' => $this->item->id,
            'buyer_sku_code' => 'ML-86',
            'product_name' => 'Mobile Legends - 86 Diamonds',
            'customer_no' => '12345678 (2001)',
            'customer_email' => 'webhook_buyer@example.com',
            'h2h_price' => 20000,
            'reseller_price' => 22000,
            'admin_fee' => 0,
            'total_payment' => 22000,
            'payment_status' => 'PAID', // Already paid
            'topup_status' => 'PROCESSING',
        ]);

        $payload = [
            'event' => 'topup.completed',
            'reseller_ref_id' => $transaction->invoice_code,
            'maitri_invoice' => 'TRX-WB-01',
            'status' => 'SUCCESS',
            'sn' => 'SN-AUTO-WEBHOOK-99',
            'message' => 'Pengisian berhasil dilakukan.',
            'completed_at' => now()->toIso8601String(),
        ];

        $signature = hash_hmac('sha256', $transaction->invoice_code.$this->apiKey, $this->apiSecret);

        $response = $this->postJson(route('api.h2h.callback'), $payload, [
            'X-Maitri-Signature' => $signature,
            'X-Maitri-Event' => 'topup.completed',
        ]);

        $response->assertStatus(200);

        Mail::assertSent(TransactionInvoiceMail::class, function (TransactionInvoiceMail $mail) {
            return $mail->type === 'success' && $mail->hasTo('webhook_buyer@example.com');
        });
    }

    public function test_admin_can_resend_invoice_email(): void
    {
        Mail::fake();

        $admin = User::factory()->create([
            'role' => 'admin',
        ]);

        $transaction = Transaction::create([
            'invoice_code' => 'INV-RESEND-01',
            'product_id' => $this->product->id,
            'product_item_id' => $this->item->id,
            'buyer_sku_code' => 'ML-86',
            'product_name' => 'Mobile Legends - 86 Diamonds',
            'customer_no' => '12345678 (2001)',
            'customer_email' => 'resend_buyer@example.com',
            'h2h_price' => 20000,
            'reseller_price' => 22000,
            'admin_fee' => 0,
            'total_payment' => 22000,
            'payment_status' => 'PAID',
            'topup_status' => 'SUCCESS',
            'sn' => 'SN-RESEND-11',
            'completed_at' => now(),
        ]);

        $response = $this->actingAs($admin)
            ->post(route('admin.transactions.resend-email', $transaction));

        $response->assertRedirect();
        Mail::assertSent(TransactionInvoiceMail::class);
    }
}
