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
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('site_name')->default('Maitri Project');
            $table->string('site_tagline')->default('Top Up Game & PPOB Murah, Cepat & Legal');
            $table->string('brand_logo_text_prefix')->default('MAITRI');
            $table->string('brand_logo_text_suffix')->default('TOPUP');
            $table->text('site_description')->nullable();
            $table->string('contact_email')->default('support@maitriproject.my.id');
            $table->string('contact_whatsapp')->default('081234567890');
            $table->string('footer_copyright')->default('Maitri Project. All rights reserved.');
            $table->string('theme_preset')->default('blue');
            $table->string('color_primary')->default('#2563eb');
            $table->string('color_primary_hover')->default('#1d4ed8');
            $table->string('color_accent')->default('#38bdf8');
            $table->string('color_subtle')->default('#e0f2fe');
            $table->string('color_navy')->default('#1e40af');
            $table->timestamps();
        });

        // Insert initial default settings row
        DB::table('site_settings')->insert([
            'site_name' => 'Maitri Project',
            'site_tagline' => 'Top Up Game & PPOB Murah, Cepat & Legal',
            'brand_logo_text_prefix' => 'MAITRI',
            'brand_logo_text_suffix' => 'TOPUP',
            'site_description' => 'Layanan top up game online & PPOB tercepat, termurah, dan 100% legal di Indonesia dengan gaya sketchbook modern.',
            'contact_email' => 'support@maitriproject.my.id',
            'contact_whatsapp' => '081234567890',
            'footer_copyright' => 'Maitri Project. All rights reserved.',
            'theme_preset' => 'blue',
            'color_primary' => '#2563eb',
            'color_primary_hover' => '#1d4ed8',
            'color_accent' => '#38bdf8',
            'color_subtle' => '#e0f2fe',
            'color_navy' => '#1e40af',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
