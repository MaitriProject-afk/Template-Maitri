<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\H2hProductController;
use App\Http\Controllers\Admin\ProductManageController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicCatalogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Catalog & Landing
Route::get('/', [PublicCatalogController::class, 'welcome'])->name('home');
Route::get('/katalog', [PublicCatalogController::class, 'catalog'])->name('katalog');
Route::get('/catalog', function () {
    return redirect()->route('katalog');
});

Route::get('/product/{slug}', [PublicCatalogController::class, 'detail'])->name('product.detail');
Route::get('/produk/{slug}', function (string $slug) {
    return redirect()->route('product.detail', ['slug' => $slug]);
});
Route::post('/order/validate', [PublicCatalogController::class, 'validateOrder'])->name('order.validate');
Route::post('/order/track', [OrderController::class, 'track'])->name('order.track');
Route::get('/api/products/search', [PublicCatalogController::class, 'searchApi'])->name('api.products.search');

// Checkout & Invoice Routes
Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');
Route::get('/invoice/{invoice_code}', [OrderController::class, 'show'])->name('invoice.show');
Route::get('/invoice/{invoice_code}/status', [OrderController::class, 'status'])->name('invoice.status');

Route::get('/style-guide', function () {
    return Inertia::render('StyleGuide');
})->name('style-guide');

Route::get('/dev/style-guide', function () {
    return redirect()->route('style-guide');
});

Route::get('/dashboard', function () {
    return redirect()->route('user.profile');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/user/profile', function (Request $request) {
        $transactions = $request->user()->transactions()
            ->with(['product:id,name,slug,thumbnail', 'productItem:id,name'])
            ->latest()
            ->paginate(10);

        return Inertia::render('User/Profile', [
            'transactions' => $transactions,
        ]);
    })->name('user.profile');

    Route::post('/user/profile/update-phone', function (Request $request) {
        $request->validate(['phone' => 'nullable|string|max:30']);
        $request->user()->update(['phone' => $request->phone]);

        return back()->with('success', 'Nomor telepon berhasil diperbarui.');
    })->name('user.profile.phone');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Admin Routes (Strictly protected with 'admin' role middleware)
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('admin.index');
    Route::post('/refresh-h2h-profile', [DashboardController::class, 'refreshH2hProfile'])->name('admin.refresh-h2h-profile');

    // Data Transaksi
    Route::get('/transactions', [TransactionController::class, 'index'])->name('admin.transactions.index');
    Route::post('/transactions/{transaction}/sync-status', [TransactionController::class, 'syncStatus'])->name('admin.transactions.sync-status');
    Route::post('/transactions/{transaction}/mark-refunded', [TransactionController::class, 'markRefunded'])->name('admin.transactions.mark-refunded');

    Route::get('/settings', [SettingController::class, 'index'])->name('admin.settings');
    Route::post('/settings', [SettingController::class, 'update'])->name('admin.settings.update');
    Route::post('/settings/reset', [SettingController::class, 'reset'])->name('admin.settings.reset');
    Route::post('/settings/test-h2h', [SettingController::class, 'testH2h'])->name('admin.settings.test-h2h');

    // Category & Subcategory Management
    Route::get('/categories', [CategoryController::class, 'index'])->name('admin.categories.index');
    Route::post('/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');

    Route::post('/subcategories', [CategoryController::class, 'storeSubCategory'])->name('admin.subcategories.store');
    Route::put('/subcategories/{subCategory}', [CategoryController::class, 'updateSubCategory'])->name('admin.subcategories.update');
    Route::delete('/subcategories/{subCategory}', [CategoryController::class, 'destroySubCategory'])->name('admin.subcategories.destroy');

    // Parent Product & Product Item Management
    Route::get('/products', [ProductManageController::class, 'index'])->name('admin.products.index');
    Route::post('/products', [ProductManageController::class, 'store'])->name('admin.products.store');
    Route::get('/products/{product}/edit', [ProductManageController::class, 'edit'])->name('admin.products.edit');
    Route::get('/products/{product}', [ProductManageController::class, 'edit']);
    Route::put('/products/{product}', [ProductManageController::class, 'update'])->name('admin.products.update');
    Route::delete('/products/{product}', [ProductManageController::class, 'destroy'])->name('admin.products.destroy');

    // Child Product Items CRUD
    Route::post('/products/{product}/items', [ProductManageController::class, 'storeItem'])->name('admin.products.items.store');
    Route::put('/products/items/{item}', [ProductManageController::class, 'updateItem'])->name('admin.products.items.update');
    Route::delete('/products/items/{item}', [ProductManageController::class, 'destroyItem'])->name('admin.products.items.destroy');
    Route::put('/products/{product}/items/{item}', [ProductManageController::class, 'updateItem']);
    Route::delete('/products/{product}/items/{item}', [ProductManageController::class, 'destroyItem']);

    // Raw H2H SKUs & Sync Catalog
    Route::get('/h2h-products', [H2hProductController::class, 'index'])->name('admin.h2h.index');
    Route::post('/h2h-products/sync', [H2hProductController::class, 'sync'])->name('admin.h2h.sync');
    Route::post('/products/sync', [H2hProductController::class, 'sync'])->name('admin.products.sync'); // Alias for backward compatibility
});

require __DIR__.'/auth.php';
