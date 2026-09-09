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
        Schema::create('product_sync_logs', function (Blueprint $table) {
            $table->id();
            $table->string('status', 30)->default('SUCCESS')->index();
            $table->string('triggered_by', 30)->default('MANUAL')->index();
            $table->unsignedInteger('total_items')->default(0);
            $table->unsignedInteger('items_added')->default(0);
            $table->unsignedInteger('items_updated')->default(0);
            $table->text('message')->nullable();
            $table->decimal('duration_seconds', 6, 2)->default(0);
            $table->string('ip_address', 50)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_sync_logs');
    }
};
