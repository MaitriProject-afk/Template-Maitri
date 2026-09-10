<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

#[Signature('maitri:import-legacy {--database=maitri_laravel4 : Nama database sumber legacy}')]
#[Description('Impor dan sesuaikan kategori, subkategori, produk, dan item produk dari database legacy maitri_laravel4')]
class ImportLegacyMaitriData extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $sourceDb = $this->option('database') ?: 'maitri_laravel4';

        $this->info("Memulai migrasi & penyesuaian data dari database: {$sourceDb}...");

        // 1. Verifikasi database sumber
        $dbExists = DB::select("SHOW DATABASES LIKE '{$sourceDb}'");
        if (empty($dbExists)) {
            $this->error("Database '{$sourceDb}' tidak ditemukan di server MySQL lokal!");

            return Command::FAILURE;
        }

        $now = Carbon::now();
        $currentDb = config('database.connections.mysql.database');

        // Pre-cache h2h products dari template maitri saat ini
        $h2hProducts = collect(DB::select("SELECT * FROM {$currentDb}.h2h_products"))
            ->keyBy('buyer_sku_code');

        $this->info("Total data SKU di tabel h2h_products saat ini: {$h2hProducts->count()} SKU.");

        // 2. Kosongkan tabel tujuan agar integritas ID 100% presisi
        $this->info('Mengosongkan data lama di tabel categories, sub_categories, products, product_items...');
        Schema::disableForeignKeyConstraints();
        DB::table('product_items')->truncate();
        DB::table('products')->truncate();
        DB::table('sub_categories')->truncate();
        DB::table('categories')->truncate();
        Schema::enableForeignKeyConstraints();

        // 3. Impor Kategori
        $this->info('Mengimpor Kategori...');
        $legacyCategories = DB::select("SELECT * FROM {$sourceDb}.categories ORDER BY name ASC");
        $categoriesData = [];
        foreach ($legacyCategories as $c) {
            $categoriesData[] = [
                'id' => $c->id,
                'name' => $c->name,
                'slug' => $c->slug,
                'icon' => $c->icon ?? '🎮',
                'sort_order' => $c->sort_order ?? 0,
                'is_active' => 1,
                'created_at' => $c->created_at ?? $now,
                'updated_at' => $c->updated_at ?? $now,
            ];
        }
        DB::table('categories')->insert($categoriesData);
        $this->line('  ✓ '.count($categoriesData).' Kategori berhasil diimpor.');

        // 4. Impor Sub Kategori
        $this->info('Mengimpor Sub Kategori...');
        $legacySubCategories = DB::select("SELECT * FROM {$sourceDb}.sub_categories ORDER BY name ASC");
        $subCategoriesData = [];
        foreach ($legacySubCategories as $sc) {
            $subCategoriesData[] = [
                'id' => $sc->id,
                'category_id' => $sc->category_id,
                'name' => $sc->name,
                'slug' => $sc->slug,
                'sort_order' => $sc->sort_order ?? 0,
                'is_active' => 1,
                'created_at' => $sc->created_at ?? $now,
                'updated_at' => $sc->updated_at ?? $now,
            ];
        }
        DB::table('sub_categories')->insert($subCategoriesData);
        $this->line('  ✓ '.count($subCategoriesData).' Sub Kategori berhasil diimpor.');

        // 5. Filter dan Siapkan Item Produk yang VALID di H2H Maitri
        $this->info('Memfilter Item Produk yang memiliki SKU aktif di hasil sinkronisasi H2H Maitri...');
        $legacyItems = DB::select("SELECT * FROM {$sourceDb}.product_items ORDER BY selling_price ASC");
        $itemsData = [];
        $validProductIds = [];
        $skippedCount = 0;

        foreach ($legacyItems as $item) {
            $sku = $item->digiflazz_sku;
            $h2hMatch = $sku ? $h2hProducts->get($sku) : null;

            // ATURAN: Jika SKU tidak ada di data sinkronisasi H2H, JANGAN DIINPUT!
            if (! $h2hMatch) {
                $skippedCount++;

                continue;
            }

            $h2hPrice = (int) $h2hMatch->h2h_price;
            $retailPrice = (int) $h2hMatch->retail_price;
            // Keuntungan diset sama seperti margin Maitri yang sudah ditetapkan (retail_price - h2h_price)
            $maitriMargin = max(0, $retailPrice - $h2hPrice);

            $validProductIds[$item->product_id] = true;

            $itemsData[] = [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'buyer_sku_code' => $sku,
                'name' => $item->name,
                'category_group' => $item->category ?: 'Umum',
                'h2h_price' => $h2hPrice,
                'price' => $retailPrice > 0 ? $retailPrice : ($h2hPrice + $maitriMargin),
                'profit_type' => 'fixed',
                'profit_value' => $maitriMargin,
                'status' => $h2hMatch->status ?: 'AVAILABLE',
                'start_cut_off' => $h2hMatch->start_cut_off ?? null,
                'end_cut_off' => $h2hMatch->end_cut_off ?? null,
                'desc' => $h2hMatch->desc ?? null,
                'unlimited_stock' => (int) ($h2hMatch->unlimited_stock ?? 1),
                'stock' => (int) ($h2hMatch->stock ?? 0),
                'multi' => (int) ($h2hMatch->multi ?? 0),
                'sort_order' => $item->sort_order ?? 0,
                'is_active' => (int) ($h2hMatch->is_active && $item->is_active),
                'created_at' => $item->created_at ?? $now,
                'updated_at' => $item->updated_at ?? $now,
            ];
        }

        // 6. Impor Produk
        $this->info('Mengimpor Produk...');
        $legacyProducts = DB::select("SELECT * FROM {$sourceDb}.products ORDER BY name ASC");
        $productsData = [];
        foreach ($legacyProducts as $p) {
            // Bersihkan format newline pada deskripsi (rn -> newline)
            $cleanDescription = null;
            if (! empty($p->description)) {
                $cleanDescription = str_replace(["\r\n", 'rnrn', 'rn'], ["\n", "\n\n", "\n"], $p->description);
                $cleanDescription = trim($cleanDescription);
            }

            // Aturan formulir target pelanggan:
            // Games: single_id, label: 'User ID', placeholder: 'Masukkan User ID'
            // Non Game: phone/akun, label: 'target tujuan', placeholder: 'Target'
            $isGame = ((int) $p->category_id === 6);
            $inputType = $isGame ? 'single_id' : 'phone';
            $inputLabel = $isGame ? 'User ID' : 'target tujuan';
            $inputPlaceholder = $isGame ? 'Masukkan User ID' : 'Target';

            // Produk hanya aktif jika memiliki setidaknya 1 item yang valid di H2H
            $hasH2hItems = isset($validProductIds[$p->id]);
            $isActive = $hasH2hItems && (bool) ($p->is_active ?? 1);

            $productsData[] = [
                'id' => $p->id,
                'category_id' => $p->category_id,
                'sub_category_id' => $p->sub_category_id,
                'name' => $p->name,
                'slug' => $p->slug,
                'brand' => $p->brand ?? $p->name,
                'thumbnail' => null, // Sesuai instruksi: logo/thumbnail tidak dicopy
                'description' => $cleanDescription,
                'input_type' => $inputType,
                'input_label' => $inputLabel,
                'input_placeholder' => $inputPlaceholder,
                'has_zone_id' => 0,
                'zone_label' => null,
                'zone_placeholder' => null,
                'server_options' => null,
                'sort_order' => $p->sort_order ?? 0,
                'is_active' => $isActive ? 1 : 0,
                'created_at' => $p->created_at ?? $now,
                'updated_at' => $p->updated_at ?? $now,
            ];
        }

        // Insert products in chunks
        foreach (array_chunk($productsData, 50) as $chunk) {
            DB::table('products')->insert($chunk);
        }
        $this->line('  ✓ '.count($productsData).' Produk berhasil diimpor.');

        // 7. Insert items in chunks
        foreach (array_chunk($itemsData, 100) as $chunk) {
            DB::table('product_items')->insert($chunk);
        }
        $this->line('  ✓ '.count($itemsData)." Item Produk berhasil diimpor (dilewati {$skippedCount} item yang tidak terdaftar di H2H).");

        $this->newLine();
        $this->info('✅ Sukses! Seluruh data kategori ('.count($categoriesData).'), subkategori ('.count($subCategoriesData).'), produk ('.count($productsData).'), dan item ('.count($itemsData).') telah disinkronkan murni dengan H2H Maitri.');

        return Command::SUCCESS;
    }
}
