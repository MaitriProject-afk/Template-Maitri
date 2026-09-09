<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AdminProductSyncTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_products(): void
    {
        $response = $this->get('/admin/products');
        $response->assertRedirect('/login');
    }

    public function test_regular_user_cannot_access_admin_products_and_gets_403(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/admin/products');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_products_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/products');
        $response->assertStatus(200);
    }

    public function test_admin_can_trigger_manual_product_sync(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SiteSetting::setSettings([
            'h2h_api_key' => 'test_valid_api_key_123',
            'h2h_api_url' => 'https://maitriproject.my.id/api/v1/h2h',
        ]);

        Http::fake([
            'https://maitriproject.my.id/api/v1/h2h/products' => Http::response([
                'success' => true,
                'total_items' => 2,
                'data' => [
                    [
                        'buyer_sku_code' => 'ML-86',
                        'product_name' => 'Mobile Legends - 86 Diamonds',
                        'category' => 'Games',
                        'brand' => 'MOBILE LEGENDS',
                        'type' => 'Umum',
                        'retail_price' => 22000,
                        'h2h_price' => 20125,
                        'status' => 'AVAILABLE',
                        'start_cut_off' => '23:45',
                        'end_cut_off' => '00:15',
                        'desc' => 'Masukkan User ID & Zone ID. Contoh: 12345678 (2019).',
                        'unlimited_stock' => true,
                        'stock' => 0,
                        'multi' => true,
                    ],
                    [
                        'buyer_sku_code' => 'FF-140',
                        'product_name' => 'Free Fire - 140 Diamonds',
                        'category' => 'Games',
                        'brand' => 'FREE FIRE',
                        'type' => 'Umum',
                        'retail_price' => 19500,
                        'h2h_price' => 18200,
                        'status' => 'AVAILABLE',
                        'start_cut_off' => null,
                        'end_cut_off' => null,
                        'desc' => null,
                        'unlimited_stock' => true,
                        'stock' => 100,
                        'multi' => false,
                    ],
                ],
            ], 200),
        ]);

        $response = $this->actingAs($admin)->post('/admin/products/sync');
        $response->assertRedirect();

        $this->assertDatabaseCount('products', 2);
        $this->assertDatabaseHas('products', [
            'buyer_sku_code' => 'ML-86',
            'product_name' => 'Mobile Legends - 86 Diamonds',
            'retail_price' => 22000,
            'h2h_price' => 20125,
            'start_cut_off' => '23:45',
            'end_cut_off' => '00:15',
            'desc' => 'Masukkan User ID & Zone ID. Contoh: 12345678 (2019).',
            'unlimited_stock' => true,
            'multi' => true,
        ]);

        $this->assertDatabaseHas('product_sync_logs', [
            'status' => 'SUCCESS',
            'triggered_by' => 'MANUAL',
            'total_items' => 2,
        ]);
    }

    public function test_cron_endpoint_syncs_products_with_valid_token(): void
    {
        SiteSetting::setSettings([
            'h2h_api_key' => 'test_valid_api_key_123',
            'h2h_api_url' => 'https://maitriproject.my.id/api/v1/h2h',
            'cron_sync_token' => 'secure_secret_cron_token_abc',
        ]);

        Http::fake([
            'https://maitriproject.my.id/api/v1/h2h/products' => Http::response([
                'success' => true,
                'total_items' => 1,
                'data' => [
                    [
                        'buyer_sku_code' => 'PUBG-60',
                        'product_name' => 'PUBG Mobile - 60 UC',
                        'category' => 'Games',
                        'brand' => 'PUBG MOBILE',
                        'type' => 'Umum',
                        'retail_price' => 15000,
                        'h2h_price' => 14000,
                        'status' => 'AVAILABLE',
                    ],
                ],
            ], 200),
        ]);

        $response = $this->getJson('/api/cron/sync-products?token=secure_secret_cron_token_abc');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'status' => 'SUCCESS',
            'data' => [
                'total_items' => 1,
            ],
        ]);

        $this->assertDatabaseHas('product_sync_logs', [
            'status' => 'SUCCESS',
            'triggered_by' => 'CRON',
            'total_items' => 1,
        ]);
    }

    public function test_cron_endpoint_rejects_invalid_token(): void
    {
        SiteSetting::setSettings([
            'cron_sync_token' => 'correct_token',
        ]);

        $response = $this->getJson('/api/cron/sync-products?token=wrong_token');
        $response->assertStatus(403);
        $response->assertJson([
            'success' => false,
            'status' => 'UNAUTHORIZED',
        ]);
    }

    public function test_sync_handles_429_rate_limit_gracefully(): void
    {
        SiteSetting::setSettings([
            'h2h_api_key' => 'test_valid_api_key_123',
            'h2h_api_url' => 'https://maitriproject.my.id/api/v1/h2h',
            'cron_sync_token' => 'cron_token_123',
        ]);

        Http::fake([
            'https://maitriproject.my.id/api/v1/h2h/products' => Http::response([
                'success' => false,
                'message' => 'Too Many Requests (Rate limit: 1 request per 5 minutes)',
            ], 429),
        ]);

        $response = $this->getJson('/api/cron/sync-products?token=cron_token_123');

        $response->assertStatus(429);
        $response->assertJson([
            'success' => false,
            'status' => 'RATE_LIMITED',
        ]);

        $this->assertDatabaseHas('product_sync_logs', [
            'status' => 'RATE_LIMITED',
            'triggered_by' => 'CRON',
        ]);
    }
}
