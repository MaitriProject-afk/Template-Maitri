<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Rename existing flat products table to h2h_products if needed
        if (Schema::hasTable('products') && ! Schema::hasTable('h2h_products')) {
            Schema::rename('products', 'h2h_products');
        } elseif (! Schema::hasTable('h2h_products')) {
            Schema::create('h2h_products', function (Blueprint $table) {
                $table->id();
                $table->string('buyer_sku_code', 100)->unique();
                $table->string('product_name', 255);
                $table->string('category', 100)->index();
                $table->string('brand', 100)->index();
                $table->string('type', 100)->nullable();
                $table->unsignedInteger('retail_price')->default(0);
                $table->unsignedInteger('h2h_price')->default(0);
                $table->string('status', 50)->default('AVAILABLE');
                $table->string('start_cut_off', 10)->nullable();
                $table->string('end_cut_off', 10)->nullable();
                $table->text('desc')->nullable();
                $table->boolean('unlimited_stock')->default(true);
                $table->integer('stock')->default(0);
                $table->boolean('multi')->default(false);
                $table->boolean('is_active')->default(true);
                $table->timestamp('synced_at')->nullable();
                $table->timestamps();
            });
        }

        // 2. Categories Table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('slug', 120)->unique();
            $table->string('icon', 100)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Sub Categories Table
        Schema::create('sub_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('name', 100);
            $table->string('slug', 120)->unique();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 4. Products Table (Parent Game / Service)
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->foreignId('sub_category_id')->nullable()->constrained('sub_categories')->nullOnDelete();
            $table->string('name', 150);
            $table->string('slug', 180)->unique();
            $table->string('brand', 100)->nullable();
            $table->index('brand', 'parent_products_brand_index');
            $table->string('thumbnail', 255)->nullable();
            $table->string('banner', 255)->nullable();
            $table->text('description')->nullable();
            $table->string('input_type', 50)->default('id_zone'); // 'single_id', 'id_zone', 'phone', 'server_select'
            $table->string('input_label', 100)->default('User ID');
            $table->string('input_placeholder', 150)->default('Masukkan User ID');
            $table->boolean('has_zone_id')->default(false);
            $table->string('zone_label', 100)->nullable()->default('Zone ID');
            $table->string('zone_placeholder', 150)->nullable()->default('Zone ID');
            $table->json('server_options')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Product Items Table (Denominations / SKU Items under Product)
        Schema::create('product_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->string('buyer_sku_code', 100)->nullable()->index();
            $table->string('name', 200);
            $table->string('category_group', 100)->nullable();
            $table->unsignedInteger('h2h_price')->default(0);
            $table->unsignedInteger('price')->default(0);
            $table->string('profit_type', 20)->default('fixed'); // 'fixed' or 'percent'
            $table->unsignedInteger('profit_value')->default(0);
            $table->string('status', 50)->default('AVAILABLE');
            $table->string('start_cut_off', 10)->nullable();
            $table->string('end_cut_off', 10)->nullable();
            $table->text('desc')->nullable();
            $table->boolean('unlimited_stock')->default(true);
            $table->integer('stock')->default(0);
            $table->boolean('multi')->default(false);
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_items');
        Schema::dropIfExists('products');
        Schema::dropIfExists('sub_categories');
        Schema::dropIfExists('categories');

        if (Schema::hasTable('h2h_products') && ! Schema::hasTable('products')) {
            Schema::rename('h2h_products', 'products');
        }
    }
};
