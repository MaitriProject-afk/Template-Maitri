<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'buyer_sku_code',
        'product_name',
        'category',
        'brand',
        'type',
        'retail_price',
        'h2h_price',
        'status',
        'is_active',
        'synced_at',
    ];

    protected $casts = [
        'retail_price' => 'integer',
        'h2h_price' => 'integer',
        'is_active' => 'boolean',
        'synced_at' => 'datetime',
    ];

    protected $appends = [
        'profit_margin',
        'formatted_retail_price',
        'formatted_h2h_price',
        'formatted_profit_margin',
    ];

    public function getProfitMarginAttribute(): int
    {
        return max(0, $this->retail_price - $this->h2h_price);
    }

    public function getFormattedRetailPriceAttribute(): string
    {
        return 'Rp '.number_format($this->retail_price, 0, ',', '.');
    }

    public function getFormattedH2hPriceAttribute(): string
    {
        return 'Rp '.number_format($this->h2h_price, 0, ',', '.');
    }

    public function getFormattedProfitMarginAttribute(): string
    {
        return 'Rp '.number_format($this->profit_margin, 0, ',', '.');
    }
}
