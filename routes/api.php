<?php

use App\Http\Controllers\Api\CronSyncController;
use App\Http\Controllers\Api\H2hWebhookController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::match(['get', 'post'], '/cron/sync-products', [CronSyncController::class, 'syncProducts'])
    ->name('api.cron.sync-products');

// Maitri H2H Webhook Callback Listener
Route::post('/h2h/callback', [H2hWebhookController::class, 'handle'])
    ->name('api.h2h.callback');
Route::post('/v1/h2h/callback', [H2hWebhookController::class, 'handle']);
