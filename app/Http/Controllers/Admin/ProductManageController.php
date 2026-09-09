<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\H2hProduct;
use App\Models\Product;
use App\Models\ProductItem;
use App\Models\SubCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductManageController extends Controller
{
    /**
     * Display parent products list and category filters.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $categoryId = $request->input('category_id');
        $subCategoryId = $request->input('sub_category_id');
        $status = $request->input('status');

        $query = Product::with(['category', 'subCategory', 'items']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        if ($categoryId && $categoryId !== 'all') {
            $query->where('category_id', $categoryId);
        }

        if ($subCategoryId && $subCategoryId !== 'all') {
            $query->where('sub_category_id', $subCategoryId);
        }

        if ($status && $status !== 'all') {
            $isActive = $status === 'active';
            $query->where('is_active', $isActive);
        }

        $products = $query->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        $categories = Category::with('subCategories')->orderBy('sort_order')->get();
        $h2hSkus = H2hProduct::select('buyer_sku_code', 'product_name', 'category', 'brand', 'retail_price', 'h2h_price', 'status', 'desc', 'start_cut_off', 'end_cut_off')
            ->orderBy('brand')
            ->orderBy('h2h_price')
            ->get();

        return Inertia::render('Admin/Products/Manage', [
            'products' => $products,
            'categories' => $categories,
            'h2hSkus' => $h2hSkus,
            'filters' => [
                'search' => $search ?? '',
                'category_id' => $categoryId ?? 'all',
                'sub_category_id' => $subCategoryId ?? 'all',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    /**
     * Store a newly created parent product.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'name' => 'required|string|max:150',
            'slug' => 'nullable|string|max:180|unique:products,slug',
            'brand' => 'nullable|string|max:100',
            'thumbnail' => 'nullable|string|max:255',
            'banner' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'input_type' => 'required|string|in:single_id,id_only,id_zone,game_user_zone,phone,server_select,game_user_server',
            'input_label' => 'nullable|string|max:100',
            'input_placeholder' => 'nullable|string|max:150',
            'has_zone_id' => 'nullable|boolean',
            'zone_label' => 'nullable|string|max:100',
            'zone_placeholder' => 'nullable|string|max:150',
            'server_options' => 'nullable|array',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        // Validate subcategory belongs to selected category if provided
        if (! empty($validated['sub_category_id'])) {
            $subCategory = SubCategory::find($validated['sub_category_id']);
            if (! $subCategory || $subCategory->category_id != $validated['category_id']) {
                $validated['sub_category_id'] = null;
            }
        } else {
            $validated['sub_category_id'] = null;
        }

        if (empty($validated['slug'])) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $count = 1;
            while (Product::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$count}";
                $count++;
            }
            $validated['slug'] = $slug;
        }

        $validated['input_label'] = $validated['input_label'] ?? 'User ID';
        $validated['input_placeholder'] = $validated['input_placeholder'] ?? 'Masukkan User ID';
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['has_zone_id'] = $validated['has_zone_id'] ?? false;

        $product = Product::create($validated);

        return back()->with('success', "Produk '{$product->name}' berhasil ditambahkan.");
    }

    /**
     * Update the specified parent product.
     */
    public function update(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'sub_category_id' => 'nullable|exists:sub_categories,id',
            'name' => 'required|string|max:150',
            'slug' => 'required|string|max:180|unique:products,slug,'.$product->id,
            'brand' => 'nullable|string|max:100',
            'thumbnail' => 'nullable|string|max:255',
            'banner' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'input_type' => 'required|string|in:single_id,id_only,id_zone,game_user_zone,phone,server_select,game_user_server',
            'input_label' => 'required|string|max:100',
            'input_placeholder' => 'required|string|max:150',
            'has_zone_id' => 'nullable|boolean',
            'zone_label' => 'nullable|string|max:100',
            'zone_placeholder' => 'nullable|string|max:150',
            'server_options' => 'nullable|array',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        if (! empty($validated['sub_category_id'])) {
            $subCategory = SubCategory::find($validated['sub_category_id']);
            if (! $subCategory || $subCategory->category_id != $validated['category_id']) {
                $validated['sub_category_id'] = null;
            }
        } else {
            $validated['sub_category_id'] = null;
        }

        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;
        $validated['has_zone_id'] = $validated['has_zone_id'] ?? false;

        $product->update($validated);

        return back()->with('success', "Produk '{$product->name}' berhasil diperbarui.");
    }

    /**
     * Remove the specified parent product.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $name = $product->name;
        $product->delete();

        return back()->with('success', "Produk '{$name}' dan seluruh item di dalamnya berhasil dihapus.");
    }

    /**
     * Store a child item under a parent product.
     */
    public function storeItem(Request $request, Product $product): RedirectResponse
    {
        $validated = $request->validate([
            'buyer_sku_code' => 'nullable|string|max:100',
            'name' => 'required|string|max:200',
            'category_group' => 'nullable|string|max:100',
            'h2h_price' => 'nullable|integer|min:0',
            'profit_type' => 'required|in:fixed,percent',
            'profit_value' => 'nullable|integer|min:0',
            'price' => 'nullable|integer|min:0',
            'status' => 'nullable|string|in:AVAILABLE,MAINTENANCE,EMPTY',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $h2hProduct = null;
        if (! empty($validated['buyer_sku_code'])) {
            $h2hProduct = H2hProduct::where('buyer_sku_code', $validated['buyer_sku_code'])->first();
        }

        $h2hPrice = $validated['h2h_price'] ?? ($h2hProduct ? $h2hProduct->h2h_price : 0);
        $profitType = $validated['profit_type'];
        $profitValue = (int) ($validated['profit_value'] ?? 0);

        // Calculate selling price
        if (isset($validated['price']) && $validated['price'] > 0 && $profitValue === 0) {
            $price = (int) $validated['price'];
        } else {
            $itemHelper = new ProductItem;
            $price = $itemHelper->computePrice($h2hPrice, $profitType, $profitValue);
        }

        $product->items()->create([
            'buyer_sku_code' => $validated['buyer_sku_code'] ?? null,
            'name' => $validated['name'],
            'category_group' => $validated['category_group'] ?? 'Umum',
            'h2h_price' => $h2hPrice,
            'price' => $price,
            'profit_type' => $profitType,
            'profit_value' => $profitValue,
            'status' => $validated['status'] ?? ($h2hProduct ? $h2hProduct->status : 'AVAILABLE'),
            'start_cut_off' => $h2hProduct ? $h2hProduct->start_cut_off : null,
            'end_cut_off' => $h2hProduct ? $h2hProduct->end_cut_off : null,
            'desc' => $h2hProduct ? $h2hProduct->desc : null,
            'unlimited_stock' => $h2hProduct ? $h2hProduct->unlimited_stock : true,
            'stock' => $h2hProduct ? $h2hProduct->stock : 0,
            'multi' => $h2hProduct ? $h2hProduct->multi : false,
            'sort_order' => $validated['sort_order'] ?? 0,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return back()->with('success', "Item '{$validated['name']}' berhasil ditambahkan ke produk.");
    }

    /**
     * Update a child item.
     */
    public function updateItem(Request $request, ProductItem $item): RedirectResponse
    {
        $validated = $request->validate([
            'buyer_sku_code' => 'nullable|string|max:100',
            'name' => 'required|string|max:200',
            'category_group' => 'nullable|string|max:100',
            'h2h_price' => 'nullable|integer|min:0',
            'profit_type' => 'required|in:fixed,percent',
            'profit_value' => 'nullable|integer|min:0',
            'price' => 'nullable|integer|min:0',
            'status' => 'nullable|string|in:AVAILABLE,MAINTENANCE,EMPTY',
            'sort_order' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $h2hPrice = isset($validated['h2h_price']) ? (int) $validated['h2h_price'] : $item->h2h_price;
        $profitType = $validated['profit_type'];
        $profitValue = (int) ($validated['profit_value'] ?? 0);

        if (isset($validated['price']) && $validated['price'] > 0 && $profitValue === 0) {
            $price = (int) $validated['price'];
        } else {
            $price = $item->computePrice($h2hPrice, $profitType, $profitValue);
        }

        $item->update([
            'buyer_sku_code' => $validated['buyer_sku_code'] ?? $item->buyer_sku_code,
            'name' => $validated['name'],
            'category_group' => $validated['category_group'] ?? $item->category_group,
            'h2h_price' => $h2hPrice,
            'price' => $price,
            'profit_type' => $profitType,
            'profit_value' => $profitValue,
            'status' => $validated['status'] ?? $item->status,
            'sort_order' => $validated['sort_order'] ?? $item->sort_order,
            'is_active' => $validated['is_active'] ?? $item->is_active,
        ]);

        return back()->with('success', "Item '{$item->name}' berhasil diperbarui.");
    }

    /**
     * Remove a child item.
     */
    public function destroyItem(ProductItem $item): RedirectResponse
    {
        $name = $item->name;
        $item->delete();

        return back()->with('success', "Item '{$name}' berhasil dihapus.");
    }
}
