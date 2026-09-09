<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSyncLog extends Model
{
    protected $fillable = [
        'status',
        'triggered_by',
        'total_items',
        'items_added',
        'items_updated',
        'message',
        'duration_seconds',
        'ip_address',
    ];

    protected $casts = [
        'total_items' => 'integer',
        'items_added' => 'integer',
        'items_updated' => 'integer',
        'duration_seconds' => 'float',
    ];
}
