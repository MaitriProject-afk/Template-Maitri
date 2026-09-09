<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display the site settings and theme customization page.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Settings', [
            'settings' => SiteSetting::getSettings(),
            'presets' => SiteSetting::PRESETS,
            'callbackUrl' => url('/api/h2h/callback'),
        ]);
    }

    /**
     * Update the site settings and color theme.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'site_name' => 'required|string|max:100',
            'site_tagline' => 'nullable|string|max:150',
            'brand_logo_text_prefix' => 'required|string|max:30',
            'brand_logo_text_suffix' => 'required|string|max:30',
            'site_description' => 'nullable|string|max:500',
            'contact_email' => 'nullable|email|max:100',
            'contact_whatsapp' => 'nullable|string|max:30',
            'footer_copyright' => 'nullable|string|max:200',
            'theme_preset' => 'nullable|string|max:30',
            'color_primary' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'color_primary_hover' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'color_accent' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'color_subtle' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'color_navy' => ['required', 'string', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'h2h_api_url' => 'nullable|url|max:255',
            'h2h_api_key' => 'nullable|string|max:255',
            'h2h_api_secret' => 'nullable|string|max:255',
        ]);

        SiteSetting::setSettings($validated);

        return back()->with('success', 'Pengaturan website dan kredensial API H2H berhasil disimpan.');
    }

    /**
     * Reset settings to original template defaults.
     */
    public function reset(): RedirectResponse
    {
        SiteSetting::resetToDefault();

        return back()->with('success', 'Pengaturan website berhasil dikembalikan ke bawaan template.');
    }

    /**
     * Test connection to Maitri H2H API provider.
     */
    public function testH2h(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'h2h_api_url' => 'required|url',
            'h2h_api_key' => 'required|string',
        ]);

        try {
            $baseUrl = rtrim($validated['h2h_api_url'], '/');
            $endpoint = str_contains($baseUrl, '/api/v1/h2h')
                ? $baseUrl.'/profile'
                : $baseUrl.'/api/v1/h2h/profile';

            $response = Http::withoutVerifying()
                ->withHeaders([
                    'X-Maitri-API-Key' => $validated['h2h_api_key'],
                    'Accept' => 'application/json',
                ])->timeout(10)->get($endpoint);

            if ($response->successful()) {
                $payload = $response->json();
                $data = $payload['data'] ?? $payload;

                $balance = $data['commission_balance'] ?? $data['balance'] ?? 0;
                $formattedBalance = $data['formatted_balance'] ?? ('Rp '.number_format((float) $balance, 0, ',', '.'));

                return response()->json([
                    'success' => true,
                    'message' => 'Koneksi Berhasil! Terhubung ke Server H2H Maitri Project.',
                    'profile' => [
                        'reseller_name' => $data['reseller_name'] ?? $data['name'] ?? '-',
                        'name' => $data['reseller_name'] ?? $data['name'] ?? '-',
                        'email' => $data['email'] ?? '-',
                        'phone' => $data['phone'] ?? '-',
                        'status' => $data['status'] ?? 'ACTIVE',
                        'commission_balance' => $balance,
                        'balance' => $balance,
                        'formatted_balance' => $formattedBalance,
                    ],
                ]);
            }

            $errorMessage = $response->json('message')
                ?? $response->json('error')
                ?? ('HTTP '.$response->status().' - '.$response->reason());

            return response()->json([
                'success' => false,
                'message' => 'Koneksi Ditolak: '.$errorMessage,
            ], 400);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal Menghubungi Server: '.$e->getMessage(),
            ], 500);
        }
    }
}
