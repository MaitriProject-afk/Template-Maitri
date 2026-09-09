<?php

namespace Tests\Feature;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AdminSettingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_settings_page(): void
    {
        $response = $this->get('/admin/settings');
        $response->assertRedirect('/login');
    }

    public function test_regular_user_cannot_access_admin_settings_and_gets_403(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/admin/settings');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_settings_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/settings');
        $response->assertStatus(200);
    }

    public function test_admin_can_update_site_settings_and_colors(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/settings', [
            'site_name' => 'Garuda TopUp',
            'site_tagline' => 'Pusat Top Up Game Tercepat',
            'brand_logo_text_prefix' => 'GARUDA',
            'brand_logo_text_suffix' => 'GAME',
            'site_description' => 'Deskripsi toko game kustom.',
            'contact_email' => 'cs@garudagame.id',
            'contact_whatsapp' => '089876543210',
            'footer_copyright' => 'Garuda Game Official. All rights reserved.',
            'theme_preset' => 'emerald',
            'color_primary' => '#059669',
            'color_primary_hover' => '#047857',
            'color_accent' => '#34d399',
            'color_subtle' => '#d1fae5',
            'color_navy' => '#065f46',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Garuda TopUp', SiteSetting::getSettings()['site_name']);
        $this->assertEquals('#059669', SiteSetting::getSettings()['color_primary']);
        $this->assertEquals('GARUDA', SiteSetting::getSettings()['brand_logo_text_prefix']);
    }

    public function test_admin_can_reset_site_settings(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        // First modify
        SiteSetting::setSettings(['site_name' => 'Custom Store', 'color_primary' => '#112233']);
        $this->assertEquals('Custom Store', SiteSetting::getSettings()['site_name']);

        // Now reset
        $response = $this->actingAs($admin)->post('/admin/settings/reset');
        $response->assertRedirect();

        $this->assertEquals('Maitri Project', SiteSetting::getSettings()['site_name']);
        $this->assertEquals('#2563eb', SiteSetting::getSettings()['color_primary']);
    }

    public function test_admin_can_update_h2h_api_credentials(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/settings', [
            'site_name' => 'Maitri Project',
            'brand_logo_text_prefix' => 'MAITRI',
            'brand_logo_text_suffix' => 'PROJECT',
            'color_primary' => '#2563eb',
            'color_primary_hover' => '#1d4ed8',
            'color_accent' => '#60a5fa',
            'color_subtle' => '#dbeafe',
            'color_navy' => '#1e3a8a',
            'h2h_api_url' => 'https://maitriproject.my.id/api/v1/h2h',
            'h2h_api_key' => 'test_api_key_12345',
            'h2h_api_secret' => 'test_api_secret_67890',
        ]);

        $response->assertRedirect();
        $settings = SiteSetting::getSettings();
        $this->assertEquals('https://maitriproject.my.id/api/v1/h2h', $settings['h2h_api_url']);
        $this->assertEquals('test_api_key_12345', $settings['h2h_api_key']);
        $this->assertEquals('test_api_secret_67890', $settings['h2h_api_secret']);
    }

    public function test_admin_can_test_h2h_connection(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        Http::fake([
            'https://maitriproject.my.id/api/v1/h2h/profile' => Http::response([
                'success' => true,
                'data' => [
                    'name' => 'Demo Reseller',
                    'email' => 'reseller@demo.com',
                    'balance' => 750000,
                ],
            ], 200),
        ]);

        $response = $this->actingAs($admin)->postJson('/admin/settings/test-h2h', [
            'h2h_api_url' => 'https://maitriproject.my.id/api/v1/h2h',
            'h2h_api_key' => 'valid_key_xyz',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'message' => 'Koneksi Berhasil! Terhubung ke Server H2H Maitri Project.',
            'profile' => [
                'name' => 'Demo Reseller',
                'balance' => 750000,
            ],
        ]);
    }
}
