<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\ProductSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CronSyncController extends Controller
{
    /**
     * Handle automated product synchronization via Cron Job request.
     */
    public function syncProducts(Request $request, ProductSyncService $syncService): JsonResponse
    {
        $settings = SiteSetting::getSettings();
        $configuredToken = $settings['cron_sync_token'] ?? null;

        // Support token either via query param ?token=... or header X-Cron-Token: ... or Bearer token
        $providedToken = $request->query('token')
            ?? $request->header('X-Cron-Token')
            ?? $request->bearerToken();

        if (empty($configuredToken) || empty($providedToken) || ! hash_equals((string) $configuredToken, (string) $providedToken)) {
            return response()->json([
                'success' => false,
                'status' => 'UNAUTHORIZED',
                'message' => 'Unauthorized: Token cron job tidak valid atau belum diatur.',
            ], 403);
        }

        $result = $syncService->sync('CRON', $request->ip());

        $httpStatus = $result['success'] ? 200 : ($result['status'] === 'RATE_LIMITED' ? 429 : 500);

        return response()->json([
            'success' => $result['success'],
            'status' => $result['status'],
            'message' => $result['message'],
            'data' => [
                'total_items' => $result['total_items'],
                'items_added' => $result['items_added'],
                'items_updated' => $result['items_updated'],
                'duration_seconds' => $result['duration_seconds'],
                'synced_at' => now()->toIso8601String(),
            ],
        ], $httpStatus);
    }
}
