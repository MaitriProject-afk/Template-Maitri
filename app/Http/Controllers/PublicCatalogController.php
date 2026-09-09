<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug', 'icon']);

        $products = Product::with(['category:id,name,slug', 'subCategory:id,name,slug', 'activeItems'])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->take(20)
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
                    'banner' => $prod->banner,
                    'tagline' => $prod->description ? substr(strip_tags($prod->description), 0, 60).'...' : 'Proses 1-3 detik otomatis',
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
            $q->where('is_active', true)->orderBy('sort_order');
        }])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $subCategories = SubCategory::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'category_id', 'name', 'slug']);

        $products = Product::with(['category:id,name,slug', 'subCategory:id,name,slug', 'activeItems'])
            ->where('is_active', true)
            ->orderBy('sort_order')
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
                    'banner' => $prod->banner,
                    'tagline' => $prod->description ? substr(strip_tags($prod->description), 0, 60).'...' : 'Proses 1-3 detik otomatis',
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
            'activeItems',
        ])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Extract unique groups/tabs for denominations
        $groupNames = $product->activeItems
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

        $items = $product->activeItems->map(function ($item) {
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
                'desc' => $item->desc,
                'start_cut_off' => $item->start_cut_off,
                'end_cut_off' => $item->end_cut_off,
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
            'banner' => $product->banner,
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
}
