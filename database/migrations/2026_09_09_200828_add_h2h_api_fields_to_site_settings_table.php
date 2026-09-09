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
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('h2h_api_url')->default('https://maitriproject.my.id/api/v1/h2h')->after('color_navy');
            $table->string('h2h_api_key')->nullable()->after('h2h_api_url');
            $table->string('h2h_api_secret')->nullable()->after('h2h_api_key');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn(['h2h_api_url', 'h2h_api_key', 'h2h_api_secret']);
        });
    }
};
