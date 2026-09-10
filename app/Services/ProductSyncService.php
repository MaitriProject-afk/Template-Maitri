<?php

namespace App\Services;

use App\Models\H2hProduct;
use App\Models\ProductItem;
use App\Models\ProductSyncLog;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;

class ProductSyncService
{
    /**
     * Execute products synchronization from Maitri Project H2H API.
     *
     * @param  string  $triggeredBy  ('MANUAL', 'CRON', 'CLI')
     * @return array{
     *     success: bool,
     *     status: string,
     *     message: string,
     *     total_items: int,
     *     items_added: int,
     *     items_updated: int,
     *     duration_seconds: float,
     *     log: ProductSyncLog
     * }
     */
    public function sync(string $triggeredBy = 'MANUAL', ?string $ipAddress = null): array
    {
        $startTime = microtime(true);
        $settings = SiteSetting::getSettings();

        if (empty($settings['h2h_api_key'])) {
            $duration = round(microtime(true) - $startTime, 2);
            $message = 'Gagal: Kredensial API Key H2H belum diisi di Pengaturan Toko.';

            $log = ProductSyncLog::create([
                'status' => 'FAILED',
                'triggered_by' => $triggeredBy,
                'total_items' => 0,
                'items_added' => 0,
                'items_updated' => 0,
                'message' => $message,
                'duration_seconds' => $duration,
                'ip_address' => $ipAddress,
            ]);

            return [
                'success' => false,
                'status' => 'FAILED',
                'message' => $message,
                'total_items' => 0,
                'items_added' => 0,
                'items_updated' => 0,
                'duration_seconds' => $duration,
                'log' => $log,
            ];
        }

        $baseUrl = rtrim($settings['h2h_api_url'] ?? 'https://maitriproject.my.id/api/v1/h2h', '/');
        $endpoint = str_contains($baseUrl, '/api/v1/h2h')
            ? $baseUrl.'/products'
            : $baseUrl.'/api/v1/h2h/products';

        try {
            $response = Http::withoutVerifying()
                ->withHeaders([
                    'X-Maitri-API-Key' => $settings['h2h_api_key'],
                    'Accept' => 'application/json',
                ])
                ->timeout(20)
                ->get($endpoint);

            $duration = round(microtime(true) - $startTime, 2);

            // Handle 429 Rate Limiting specifically
            if ($response->status() === 429) {
                $message = 'Gateway Maitri merespon 429 Too Many Requests. Data produk di-cache selama 5 menit (maks. 1 request per 5 menit). Mohon tunggu beberapa saat sebelum sinkronisasi kembali.';

                $log = ProductSyncLog::create([
                    'status' => 'RATE_LIMITED',
                    'triggered_by' => $triggeredBy,
                    'total_items' => 0,
                    'items_added' => 0,
                    'items_updated' => 0,
                    'message' => $message,
                    'duration_seconds' => $duration,
                    'ip_address' => $ipAddress,
                ]);

                return [
                    'success' => false,
                    'status' => 'RATE_LIMITED',
                    'message' => $message,
                    'total_items' => 0,
                    'items_added' => 0,
                    'items_updated' => 0,
                    'duration_seconds' => $duration,
                    'log' => $log,
                ];
            }

            if (! $response->successful()) {
                $errorDetail = $response->json('message')
                    ?? $response->json('error')
                    ?? ('HTTP '.$response->status().' - '.$response->reason());

                $message = 'Koneksi Ditolak Server Maitri: '.$errorDetail;

                $log = ProductSyncLog::create([
                    'status' => 'FAILED',
                    'triggered_by' => $triggeredBy,
                    'total_items' => 0,
                    'items_added' => 0,
                    'items_updated' => 0,
                    'message' => $message,
                    'duration_seconds' => $duration,
                    'ip_address' => $ipAddress,
                ]);

                return [
                    'success' => false,
                    'status' => 'FAILED',
                    'message' => $message,
                    'total_items' => 0,
                    'items_added' => 0,
                    'items_updated' => 0,
                    'duration_seconds' => $duration,
                    'log' => $log,
                ];
            }

            $payload = $response->json();
            $items = $payload['data'] ?? [];

            if (! is_array($items) || empty($items)) {
                $message = 'Sinkronisasi selesai: Tidak ada produk aktif yang diterima dari server Maitri.';

                $log = ProductSyncLog::create([
                    'status' => 'SUCCESS',
                    'triggered_by' => $triggeredBy,
                    'total_items' => 0,
                    'items_added' => 0,
                    'items_updated' => 0,
                    'message' => $message,
                    'duration_seconds' => $duration,
                    'ip_address' => $ipAddress,
                ]);

                return [
                    'success' => true,
                    'status' => 'SUCCESS',
                    'message' => $message,
                    'total_items' => 0,
                    'items_added' => 0,
                    'items_updated' => 0,
                    'duration_seconds' => $duration,
                    'log' => $log,
                ];
            }

            $existingSkus = H2hProduct::pluck('buyer_sku_code')->flip();
            $now = now();
            $records = [];
            $addedCount = 0;
            $updatedCount = 0;

            foreach ($items as $item) {
                if (empty($item['buyer_sku_code'])) {
                    continue;
                }

                $sku = (string) $item['buyer_sku_code'];

                if (isset($existingSkus[$sku])) {
                    $updatedCount++;
                } else {
                    $addedCount++;
                }

                $records[] = [
                    'buyer_sku_code' => $sku,
                    'product_name' => (string) ($item['product_name'] ?? $sku),
                    'category' => (string) ($item['category'] ?? 'Games'),
                    'brand' => (string) ($item['brand'] ?? 'UMUM'),
                    'type' => (string) ($item['type'] ?? 'Umum'),
                    'retail_price' => (int) ($item['retail_price'] ?? 0),
                    'h2h_price' => (int) ($item['h2h_price'] ?? 0),
                    'status' => (string) ($item['status'] ?? 'AVAILABLE'),
                    'start_cut_off' => ! empty($item['start_cut_off']) ? (string) $item['start_cut_off'] : null,
                    'end_cut_off' => ! empty($item['end_cut_off']) ? (string) $item['end_cut_off'] : null,
                    'desc' => ! empty($item['desc']) ? (string) $item['desc'] : null,
                    'unlimited_stock' => (bool) ($item['unlimited_stock'] ?? true),
                    'stock' => (int) ($item['stock'] ?? 0),
                    'multi' => (bool) ($item['multi'] ?? false),
                    'is_active' => true,
                    'synced_at' => $now,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }

            if (! empty($records)) {
                // Batch upsert in chunks of 200 items into h2h_products table
                foreach (array_chunk($records, 200) as $chunk) {
                    H2hProduct::upsert(
                        $chunk,
                        ['buyer_sku_code'],
                        [
                            'product_name',
                            'category',
                            'brand',
                            'type',
                            'retail_price',
                            'h2h_price',
                            'status',
                            'start_cut_off',
                            'end_cut_off',
                            'desc',
                            'unlimited_stock',
                            'stock',
                            'multi',
                            'is_active',
                            'synced_at',
                            'updated_at',
                        ]
                    );
                }

                $skuMap = collect($records)->keyBy('buyer_sku_code');
                $incomingSkus = $skuMap->keys()->all();

                // 1. Tangani produk yang TIDAK ADA lagi di respon provider (misal dihapus dari Maitri)
                // Ubah statusnya menjadi EMPTY / tidak tersedia dan nonaktifkan agar aman dari transaksi gagal
                $missingH2hQuery = H2hProduct::whereNotIn('buyer_sku_code', $incomingSkus);
                $missingCount = (clone $missingH2hQuery)->where(function ($q) {
                    $q->where('is_active', true)->orWhere('status', '!=', 'EMPTY');
                })->count();

                if ($missingCount > 0) {
                    $missingH2hQuery->update([
                        'status' => 'EMPTY',
                        'is_active' => false,
                        'updated_at' => $now,
                    ]);

                    // Otomatis nonaktifkan juga item produk di katalog toko
                    ProductItem::whereNotIn('buyer_sku_code', $incomingSkus)
                        ->whereNotNull('buyer_sku_code')
                        ->where('buyer_sku_code', '!=', '')
                        ->update([
                            'status' => 'EMPTY',
                            'is_active' => false,
                        ]);
                }

                // 2. Update ProductItem yang aktif / masuk dalam sync respon provider
                // Jika produk ini sebelumnya sempat dinonaktifkan lalu ada kembali di Maitri, otomatis diaktifkan kembali!
                $itemsToUpdate = ProductItem::whereIn('buyer_sku_code', $incomingSkus)->get();

                foreach ($itemsToUpdate as $productItem) {
                    $raw = $skuMap->get($productItem->buyer_sku_code);
                    if ($raw) {
                        $newH2hPrice = $raw['h2h_price'];
                        $productItem->h2h_price = $newH2hPrice;
                        $productItem->status = $raw['status'];
                        $productItem->is_active = true; // Aktifkan kembali jika ada di respon sync
                        $productItem->start_cut_off = $raw['start_cut_off'];
                        $productItem->end_cut_off = $raw['end_cut_off'];
                        $productItem->desc = $raw['desc'];
                        $productItem->unlimited_stock = $raw['unlimited_stock'];
                        $productItem->stock = $raw['stock'];
                        $productItem->multi = $raw['multi'];

                        // Selalu sinkronkan keuntungan dengan margin maitri yang ditetapkan (retail_price - h2h_price)
                        $maitriMargin = max(0, (int) $raw['retail_price'] - (int) $newH2hPrice);
                        $productItem->profit_type = 'fixed';
                        $productItem->profit_value = $maitriMargin;
                        $productItem->price = (int) $raw['retail_price'];

                        $productItem->save();
                    }
                }
            }

            $totalCount = count($records);
            $message = "Berhasil mensinkronkan {$totalCount} produk ({$addedCount} produk baru ditambahkan, {$updatedCount} produk diperbarui).";
            if (isset($missingCount) && $missingCount > 0) {
                $message .= " Sebanyak {$missingCount} produk tidak lagi ditemukan di provider dan otomatis dinonaktifkan (EMPTY).";
            }

            $log = ProductSyncLog::create([
                'status' => 'SUCCESS',
                'triggered_by' => $triggeredBy,
                'total_items' => $totalCount,
                'items_added' => $addedCount,
                'items_updated' => $updatedCount,
                'message' => $message,
                'duration_seconds' => $duration,
                'ip_address' => $ipAddress,
            ]);

            return [
                'success' => true,
                'status' => 'SUCCESS',
                'message' => $message,
                'total_items' => $totalCount,
                'items_added' => $addedCount,
                'items_updated' => $updatedCount,
                'duration_seconds' => $duration,
                'log' => $log,
            ];
        } catch (\Throwable $e) {
            $duration = round(microtime(true) - $startTime, 2);
            $message = 'Terjadi Kesalahan Sistem: '.$e->getMessage();

            $log = ProductSyncLog::create([
                'status' => 'FAILED',
                'triggered_by' => $triggeredBy,
                'total_items' => 0,
                'items_added' => 0,
                'items_updated' => 0,
                'message' => $message,
                'duration_seconds' => $duration,
                'ip_address' => $ipAddress,
            ]);

            return [
                'success' => false,
                'status' => 'FAILED',
                'message' => $message,
                'total_items' => 0,
                'items_added' => 0,
                'items_updated' => 0,
                'duration_seconds' => $duration,
                'log' => $log,
            ];
        }
    }
}
