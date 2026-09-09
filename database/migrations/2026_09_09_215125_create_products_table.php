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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('buyer_sku_code', 100)->unique();
            $table->string('product_name', 255);
            $table->string('category', 100)->index();
            $table->string('brand', 100)->index();
            $table->string('type', 100)->nullable();
            $table->unsignedInteger('retail_price')->default(0);
            $table->unsignedInteger('h2h_price')->default(0);
            $table->string('status', 50)->default('AVAILABLE');
            $table->boolean('is_active')->default(true);
            $table->timestamp('synced_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
