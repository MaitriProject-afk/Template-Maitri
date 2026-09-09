<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class H2hProduct extends Model
{
    protected $table = 'h2h_products';

    protected $fillable = [
        'buyer_sku_code',
        'product_name',
        'category',
        'brand',
        'type',
        'retail_price',
        'h2h_price',
        'status',
        'start_cut_off',
        'end_cut_off',
        'desc',
        'unlimited_stock',
        'stock',
        'multi',
        'is_active',
        'synced_at',
    ];

    protected $casts = [
        'retail_price' => 'integer',
        'h2h_price' => 'integer',
        'unlimited_stock' => 'boolean',
        'stock' => 'integer',
        'multi' => 'boolean',
        'is_active' => 'boolean',
        'synced_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_retail_price',
        'formatted_h2h_price',
    ];

    public function getFormattedRetailPriceAttribute(): string
    {
        return 'Rp '.number_format($this->retail_price, 0, ',', '.');
    }

    public function getFormattedH2hPriceAttribute(): string
    {
        return 'Rp '.number_format($this->h2h_price, 0, ',', '.');
    }
}
