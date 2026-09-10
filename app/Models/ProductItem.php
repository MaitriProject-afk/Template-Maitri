<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductItem extends Model
{
    protected $fillable = [
        'product_id',
        'buyer_sku_code',
        'name',
        'category_group',
        'h2h_price',
        'price',
        'profit_type',
        'profit_value',
        'status',
        'start_cut_off',
        'end_cut_off',
        'desc',
        'unlimited_stock',
        'stock',
        'multi',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'h2h_price' => 'integer',
        'price' => 'integer',
        'profit_value' => 'integer',
        'unlimited_stock' => 'boolean',
        'stock' => 'integer',
        'multi' => 'boolean',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    protected $appends = [
        'formatted_price',
        'formatted_h2h_price',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getFormattedPriceAttribute(): string
    {
        return 'Rp '.number_format($this->price, 0, ',', '.');
    }

    public function getFormattedH2hPriceAttribute(): string
    {
        return 'Rp '.number_format($this->h2h_price, 0, ',', '.');
    }

    /**
     * Compute final selling price from H2H price and profit settings.
     */
    public function computePrice(int $h2hPrice, string $profitType, int $profitValue): int
    {
        if ($profitType === 'percent') {
            return (int) round($h2hPrice + ($h2hPrice * ($profitValue / 100)));
        }

        return $h2hPrice + $profitValue;
    }

    /**
     * Normalize time string into HH:MM (24-hour format).
     */
    public static function normalizeTime(?string $time): ?string
    {
        if (empty($time) || trim($time) === '' || trim($time) === '0:0' || trim($time) === '00:00') {
            return null;
        }

        $timestamp = strtotime(trim($time));
        if ($timestamp === false) {
            return null;
        }

        return date('H:i', $timestamp);
    }

    /**
     * Check if the product item is currently in cut-off hours (WIB / Asia/Jakarta).
     */
    public function isCutOff(?Carbon $now = null): bool
    {
        $start = self::normalizeTime($this->start_cut_off);
        $end = self::normalizeTime($this->end_cut_off);

        if (! $start || ! $end || $start === $end) {
            return false;
        }

        $now = $now ?? now('Asia/Jakarta');
        $current = $now->format('H:i');

        if ($start < $end) {
            return $current >= $start && $current <= $end;
        }

        return $current >= $start || $current <= $end;
    }

    /**
     * Check if the product item can be purchased.
     */
    public function canPurchase(): bool
    {
        if (! $this->is_active || $this->status !== 'AVAILABLE') {
            return false;
        }

        if ($this->isCutOff()) {
            return false;
        }

        if (! $this->unlimited_stock && $this->stock <= 0) {
            return false;
        }

        return true;
    }

    /**
     * Get user-friendly reason why the product item cannot be purchased.
     */
    public function getDisabledReason(): ?string
    {
        if ($this->isCutOff()) {
            $start = self::normalizeTime($this->start_cut_off) ?? $this->start_cut_off;
            $end = self::normalizeTime($this->end_cut_off) ?? $this->end_cut_off;

            return "Produk sedang dalam jam cut-off dari pukul {$start} hingga {$end} WIB.";
        }

        if (! $this->is_active || $this->status !== 'AVAILABLE') {
            return 'Produk sedang mengalami gangguan atau tidak tersedia di server provider.';
        }

        if (! $this->unlimited_stock && $this->stock <= 0) {
            return 'Stok produk ini sedang habis.';
        }

        return null;
    }
}
