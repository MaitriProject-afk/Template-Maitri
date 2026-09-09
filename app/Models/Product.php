<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'sub_category_id',
        'name',
        'slug',
        'brand',
        'thumbnail',
        'description',
        'input_type',
        'input_label',
        'input_placeholder',
        'has_zone_id',
        'zone_label',
        'zone_placeholder',
        'server_options',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'category_id' => 'integer',
        'sub_category_id' => 'integer',
        'has_zone_id' => 'boolean',
        'server_options' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subCategory(): BelongsTo
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(ProductItem::class)->orderBy('price', 'asc');
    }

    public function activeItems(): HasMany
    {
        return $this->hasMany(ProductItem::class)->where('is_active', true)->orderBy('price', 'asc');
    }
}
