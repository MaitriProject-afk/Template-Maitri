<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class SiteSetting extends Model
{
    protected $fillable = [
        'site_name',
        'site_tagline',
        'brand_logo_text_prefix',
        'brand_logo_text_suffix',
        'site_description',
        'contact_email',
        'contact_whatsapp',
        'footer_copyright',
        'theme_preset',
        'color_primary',
        'color_primary_hover',
        'color_accent',
        'color_subtle',
        'color_navy',
        'h2h_api_url',
        'h2h_api_key',
        'h2h_api_secret',
    ];

    public const DEFAULT_SETTINGS = [
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
        'h2h_api_url' => 'https://maitriproject.my.id/api/v1/h2h',
        'h2h_api_key' => null,
        'h2h_api_secret' => null,
    ];

    public const PRESETS = [
        'blue' => [
            'name' => 'Maitri Royal Blue (Bawaan)',
            'color_primary' => '#2563eb',
            'color_primary_hover' => '#1d4ed8',
            'color_accent' => '#38bdf8',
            'color_subtle' => '#e0f2fe',
            'color_navy' => '#1e40af',
        ],
        'emerald' => [
            'name' => 'Emerald Gaming',
            'color_primary' => '#059669',
            'color_primary_hover' => '#047857',
            'color_accent' => '#34d399',
            'color_subtle' => '#d1fae5',
            'color_navy' => '#065f46',
        ],
        'violet' => [
            'name' => 'Cyberpunk Violet',
            'color_primary' => '#7c3aed',
            'color_primary_hover' => '#6d28d9',
            'color_accent' => '#c084fc',
            'color_subtle' => '#f3e8ff',
            'color_navy' => '#5b21b6',
        ],
        'sunset' => [
            'name' => 'Sunset Orange',
            'color_primary' => '#ea580c',
            'color_primary_hover' => '#c2410c',
            'color_accent' => '#fb923c',
            'color_subtle' => '#ffedd5',
            'color_navy' => '#9a3412',
        ],
        'crimson' => [
            'name' => 'Crimson Red',
            'color_primary' => '#dc2626',
            'color_primary_hover' => '#b91c1c',
            'color_accent' => '#f87171',
            'color_subtle' => '#fee2e2',
            'color_navy' => '#991b1b',
        ],
    ];

    /**
     * Get site settings as an array with caching.
     *
     * @return array<string, mixed>
     */
    public static function getSettings(): array
    {
        return Cache::rememberForever('site_settings', function () {
            try {
                if (! Schema::hasTable('site_settings')) {
                    return static::DEFAULT_SETTINGS;
                }

                $setting = static::query()->first();
                if (! $setting) {
                    return static::DEFAULT_SETTINGS;
                }

                return array_merge(static::DEFAULT_SETTINGS, array_filter($setting->toArray(), fn ($v) => ! is_null($v)));
            } catch (\Throwable) {
                return static::DEFAULT_SETTINGS;
            }
        });
    }

    /**
     * Update settings and invalidate cache.
     *
     * @param  array<string, mixed>  $attributes
     */
    public static function setSettings(array $attributes): static
    {
        $setting = static::query()->first() ?? new static;
        $setting->fill($attributes);
        $setting->save();

        Cache::forget('site_settings');

        return $setting;
    }

    /**
     * Reset to template defaults.
     */
    public static function resetToDefault(): static
    {
        return static::setSettings(static::DEFAULT_SETTINGS);
    }
}
