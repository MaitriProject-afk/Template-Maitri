<?php

use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/katalog', function () {
    return Inertia::render('Catalog');
})->name('katalog');

Route::get('/catalog', function () {
    return redirect()->route('katalog');
});

Route::get('/product/{slug}', function (string $slug) {
    return Inertia::render('Product/Detail', [
        'slug' => $slug,
    ]);
})->name('product.detail');

Route::get('/produk/{slug}', function (string $slug) {
    return redirect()->route('product.detail', ['slug' => $slug]);
});

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
    Route::get('/user/profile', function () {
        return Inertia::render('User/Profile');
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

// Admin Route (Protected strictly with 'admin' middleware: 403 for regular users)
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Admin/Index');
    })->name('admin.index');

    Route::get('/settings', [SettingController::class, 'index'])->name('admin.settings');
    Route::post('/settings', [SettingController::class, 'update'])->name('admin.settings.update');
    Route::post('/settings/reset', [SettingController::class, 'reset'])->name('admin.settings.reset');
    Route::post('/settings/test-h2h', [SettingController::class, 'testH2h'])->name('admin.settings.test-h2h');
});

require __DIR__.'/auth.php';
