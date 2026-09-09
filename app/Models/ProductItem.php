<?php

namespace App\Models;

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
}
