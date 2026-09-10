<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\H2hProduct;
use App\Models\Product;
use App\Models\ProductItem;
use App\Models\SubCategory;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PublicCatalogController extends Controller
{
    /**
     * Display landing homepage with active categories and products.
     */
    public function welcome(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'slug', 'icon']);

        $products = Product::with(['category:id,name,slug', 'subCategory:id,name,slug', 'activeItems'])
            ->where('is_active', true)
            ->inRandomOrder()
            ->take(10)
            ->get()
            ->map(function ($prod) {
                $minPrice = $prod->activeItems->min('price') ?? 0;

                return [
                    'id' => $prod->id,
                    'name' => $prod->name,
                    'slug' => $prod->slug,
                    'category' => $prod->category?->slug ?? 'all',
                    'category_name' => $prod->category?->name ?? 'Umum',
                    'sub_category' => $prod->subCategory?->slug,
                    'sub_category_name' => $prod->subCategory?->name,
                    'brand' => $prod->brand ?? $prod->name,
                    'thumbnail' => $prod->thumbnail,
                    'tagline' => $prod->description ? Str::limit(strip_tags($prod->description), 60) : 'Proses 1-3 detik otomatis',
                    'min_price' => $minPrice,
                    'formatted_min_price' => 'Rp '.number_format($minPrice, 0, ',', '.'),
                    'items_count' => $prod->activeItems->count(),
                ];
            });

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'categories' => $categories,
            'products' => $products,
        ]);
    }

    /**
     * Display full catalog with category & subcategory filters.
     */
    public function catalog(Request $request): Response
    {
        $categories = Category::with(['subCategories' => function ($q) {
            $q->where('is_active', true)->orderBy('name', 'asc');
        }])
            ->where('is_active', true)
            ->orderBy('name', 'asc')
            ->get();

        $subCategories = SubCategory::where('is_active', true)
            ->orderBy('name', 'asc')
            ->get(['id', 'category_id', 'name', 'slug']);

        $products = Product::with(['category:id,name,slug', 'subCategory:id,name,slug', 'activeItems'])
            ->where('is_active', true)
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($prod) {
                $minPrice = $prod->activeItems->min('price') ?? 0;

                return [
                    'id' => $prod->id,
                    'name' => $prod->name,
                    'slug' => $prod->slug,
                    'category_id' => $prod->category_id,
                    'category' => $prod->category?->slug ?? 'all',
                    'category_name' => $prod->category?->name ?? 'Umum',
                    'sub_category_id' => $prod->sub_category_id,
                    'sub_category' => $prod->subCategory?->slug,
                    'sub_category_name' => $prod->subCategory?->name,
                    'brand' => $prod->brand ?? $prod->name,
                    'thumbnail' => $prod->thumbnail,
                    'tagline' => $prod->description ? Str::limit(strip_tags($prod->description), 60) : 'Proses 1-3 detik otomatis',
                    'min_price' => $minPrice,
                    'formatted_min_price' => 'Rp '.number_format($minPrice, 0, ',', '.'),
                    'items_count' => $prod->activeItems->count(),
                ];
            });

        return Inertia::render('Catalog', [
            'categories' => $categories,
            'subCategories' => $subCategories,
            'products' => $products,
        ]);
    }

    /**
     * Display dynamic product detail page by slug.
     */
    public function detail(string $slug): Response
    {
        $product = Product::with([
            'category:id,name,slug',
            'subCategory:id,name,slug',
            'items', // Load all items so inactive / cut-off / disrupted items remain visible as disabled
        ])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Extract unique groups/tabs for denominations
        $groupNames = $product->items
            ->pluck('category_group')
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        if (empty($groupNames)) {
            $groupNames = ['Semua'];
        } else {
            array_unshift($groupNames, 'Semua');
        }

        $items = $product->items->map(function ($item) {
            $isCutOff = $item->isCutOff();
            $canPurchase = $item->canPurchase();
            $disabledReason = $item->getDisabledReason();

            $badge = null;
            $badgeType = 'default';

            if ($isCutOff) {
                $start = ProductItem::normalizeTime($item->start_cut_off) ?? $item->start_cut_off;
                $end = ProductItem::normalizeTime($item->end_cut_off) ?? $item->end_cut_off;
                $badge = "Cut Off ({$start} - {$end} WIB)";
                $badgeType = 'cutoff';
            } elseif (! $item->is_active || $item->status !== 'AVAILABLE') {
                $badge = 'Sedang Gangguan';
                $badgeType = 'danger';
            } elseif (! $item->unlimited_stock && $item->stock <= 0) {
                $badge = 'Stok Habis';
                $badgeType = 'warning';
            }

            return [
                'id' => $item->id,
                'buyer_sku_code' => $item->buyer_sku_code,
                'name' => $item->name,
                'category' => $item->category_group ?? 'Semua',
                'category_group' => $item->category_group ?? 'Semua',
                'price' => $item->price,
                'formatted_price' => 'Rp '.number_format($item->price, 0, ',', '.'),
                'h2h_price' => $item->h2h_price,
                'status' => $item->status,
                'is_active' => (bool) $item->is_active,
                'desc' => $item->desc,
                'start_cut_off' => $item->start_cut_off,
                'end_cut_off' => $item->end_cut_off,
                'is_cut_off' => $isCutOff,
                'can_purchase' => $canPurchase,
                'is_available' => $canPurchase,
                'disabled_reason' => $disabledReason,
                'badge' => $badge,
                'badge_type' => $badgeType,
            ];
        });

        $productPayload = [
            'id' => $product->id,
            'name' => $product->name,
            'fullName' => $product->name,
            'slug' => $product->slug,
            'brand' => $product->brand,
            'category' => $product->category?->name ?? 'Layanan',
            'category_slug' => $product->category?->slug,
            'sub_category' => $product->subCategory?->name,
            'sub_category_slug' => $product->subCategory?->slug,
            'publisher' => $product->brand ?? ($product->category?->name ?? 'Maitri Official'),
            'thumbnail' => $product->thumbnail,
            'badge' => '⚡ Proses 1-3 Detik',
            'inputType' => $product->input_type,
            'inputLabel' => $product->input_label,
            'inputPlaceholder' => $product->input_placeholder,
            'hasZoneId' => $product->has_zone_id,
            'zoneLabel' => $product->zone_label ?? 'Zone ID',
            'zonePlaceholder' => $product->zone_placeholder ?? 'Cth: 2019',
            'serverOptions' => $product->server_options,
            'description' => $product->description ?? "⚡ Layanan Top Up {$product->name} Otomatis 24 Jam Nonstop.\nProses instan 1-3 detik langsung terkirim dan bergaransi resmi.",
            'categories' => $groupNames,
            'items' => $items,
        ];

        return Inertia::render('Product/Detail', [
            'slug' => $slug,
            'product' => $productPayload,
        ]);
    }

    /**
     * Strictly validate order selection on backend (guards against cut-off, inactive, and disrupted H2H items).
     */
    public function validateOrder(Request $request)
    {
        $request->validate([
            'item_id' => 'required|integer',
            'target_input' => 'required|string',
        ]);

        $item = ProductItem::with('product')->find($request->item_id);

        if (! $item) {
            return response()->json([
                'success' => false,
                'message' => 'Item produk yang dipilih tidak ditemukan dalam sistem.',
            ], 404);
        }

        if (! $item->product || ! $item->product->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Layanan produk ini sedang tidak aktif atau dinonaktifkan.',
            ], 422);
        }

        if (! $item->canPurchase()) {
            return response()->json([
                'success' => false,
                'message' => $item->getDisabledReason() ?? 'Produk tidak dapat dipesan saat ini.',
            ], 422);
        }

        // Periksa apakah item terhubung dengan SKU provider dan apakah provider aktif
        if ($item->buyer_sku_code) {
            $h2h = H2hProduct::where('buyer_sku_code', $item->buyer_sku_code)->first();
            if (! $h2h || ! $h2h->is_active || $h2h->status !== 'AVAILABLE') {
                return response()->json([
                    'success' => false,
                    'message' => 'Produk ini sedang mengalami gangguan dari provider pusat dan tidak dapat diproses saat ini.',
                ], 422);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Item produk valid dan siap diproses.',
            'item' => [
                'id' => $item->id,
                'name' => $item->name,
                'price' => $item->price,
                'formatted_price' => $item->formatted_price,
            ],
        ]);
    }

    /**
     * Search products for live mobile search modal / quick search.
     */
    public function searchApi(Request $request): JsonResponse
    {
        $q = trim($request->input('q', ''));

        $query = Product::with(['category:id,name,slug', 'activeItems'])
            ->where('is_active', true);

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('brand', 'like', "%{$q}%");
            });
        }

        $products = $query->take(20)->get()->map(function ($prod) {
            $minPrice = $prod->activeItems->min('price') ?? 0;

            return [
                'id' => $prod->id,
                'name' => $prod->name,
                'slug' => $prod->slug,
                'category' => $prod->category?->name ?? 'Semua',
                'brand' => $prod->brand ?? $prod->name,
                'thumbnail' => $prod->thumbnail,
                'tagline' => $prod->description ? Str::limit(strip_tags($prod->description), 50) : 'Proses 1-3 detik otomatis',
                'min_price' => $minPrice,
                'formatted_min_price' => 'Rp '.number_format($minPrice, 0, ',', '.'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $products,
        ]);
    }
}
