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
        if (Schema::hasColumn('products', 'banner')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('banner');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('products', 'banner')) {
            Schema::table('products', function (Blueprint $table) {
                $table->string('banner', 255)->nullable()->after('thumbnail');
            });
        }
    }
};
