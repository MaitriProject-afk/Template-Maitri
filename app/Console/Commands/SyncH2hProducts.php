<?php

namespace App\Console\Commands;

use App\Services\ProductSyncService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('h2h:sync-products {--triggered-by=CLI : Trigger source (CLI, CRON, MANUAL)}')]
#[Description('Sinkronkan katalog produk dan harga grosir terbaru dari server H2H Maitri Project')]
class SyncH2hProducts extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(ProductSyncService $syncService): int
    {
        $this->info('Memulai sinkronisasi produk dari Maitri Project...');

        $triggeredBy = (string) ($this->option('triggered-by') ?: 'CLI');
        $result = $syncService->sync($triggeredBy, '127.0.0.1');

        if ($result['success']) {
            $this->info($result['message']);
            $this->table(
                ['Total Item', 'Item Baru', 'Item Diperbarui', 'Durasi (detik)'],
                [[$result['total_items'], $result['items_added'], $result['items_updated'], $result['duration_seconds']]]
            );

            return self::SUCCESS;
        }

        if ($result['status'] === 'RATE_LIMITED') {
            $this->warn($result['message']);

            return self::FAILURE;
        }

        $this->error($result['message']);

        return self::FAILURE;
    }
}
