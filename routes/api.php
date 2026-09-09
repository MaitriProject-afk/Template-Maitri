<?php

use App\Http\Controllers\Api\CronSyncController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::match(['get', 'post'], '/cron/sync-products', [CronSyncController::class, 'syncProducts'])
    ->name('api.cron.sync-products');
