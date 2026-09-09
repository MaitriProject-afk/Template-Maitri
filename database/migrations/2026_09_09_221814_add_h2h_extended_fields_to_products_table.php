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
        Schema::table('products', function (Blueprint $table) {
            $table->string('start_cut_off', 10)->nullable()->after('status');
            $table->string('end_cut_off', 10)->nullable()->after('start_cut_off');
            $table->text('desc')->nullable()->after('end_cut_off');
            $table->boolean('unlimited_stock')->default(true)->after('desc');
            $table->integer('stock')->default(0)->after('unlimited_stock');
            $table->boolean('multi')->default(false)->after('stock');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'start_cut_off',
                'end_cut_off',
                'desc',
                'unlimited_stock',
                'stock',
                'multi',
            ]);
        });
    }
};
