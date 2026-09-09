<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductSyncLog;
use App\Models\SiteSetting;
use App\Services\ProductSyncService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display synchronized products list, sync stats, and execution logs.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $brand = $request->input('brand');
        $status = $request->input('status');

        $query = Product::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhere('buyer_sku_code', 'like', "%{$search}%");
            });
        }

        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }

        if ($brand && $brand !== 'all') {
            $query->where('brand', $brand);
        }

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $products = $query->orderBy('brand')
            ->orderBy('retail_price')
            ->paginate(25)
            ->withQueryString();

        $settings = SiteSetting::getSettings();
        $cronToken = $settings['cron_sync_token'] ?? 'maitri_sync_cron_key_sec99';
        $cronUrl = url("/api/cron/sync-products?token={$cronToken}");

        $stats = [
            'total_products' => Product::count(),
            'available_products' => Product::where('status', 'AVAILABLE')->count(),
            'total_brands' => Product::distinct('brand')->count('brand'),
            'last_synced_at' => Product::max('synced_at'),
        ];

        $categories = Product::distinct()->orderBy('category')->pluck('category');
        $brands = Product::distinct()->orderBy('brand')->pluck('brand');
        $recentLogs = ProductSyncLog::latest()->take(30)->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'all',
                'brand' => $brand ?? 'all',
                'status' => $status ?? 'all',
            ],
            'stats' => $stats,
            'categories' => $categories,
            'brands' => $brands,
            'logs' => $recentLogs,
            'cronInfo' => [
                'url' => $cronUrl,
                'token' => $cronToken,
                'curlCommand' => "curl -X GET \"{$cronUrl}\"",
            ],
            'h2hConfigured' => ! empty($settings['h2h_api_key']),
        ]);
    }

    /**
     * Trigger manual synchronization from admin UI.
     */
    public function sync(Request $request, ProductSyncService $syncService): RedirectResponse
    {
        $result = $syncService->sync('MANUAL', $request->ip());

        if ($result['success']) {
            return back()->with('success', $result['message']);
        }

        if ($result['status'] === 'RATE_LIMITED') {
            return back()->with('warning', $result['message']);
        }

        return back()->with('error', $result['message']);
    }
}
