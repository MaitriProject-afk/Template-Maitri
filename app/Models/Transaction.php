<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_code',
        'maitri_invoice',
        'user_id',
        'product_id',
        'product_item_id',
        'buyer_sku_code',
        'product_name',
        'customer_no',
        'customer_whatsapp',
        'h2h_price',
        'reseller_price',
        'admin_fee',
        'total_payment',
        'commission_amount',
        'service',
        'qr_content',
        'checkout_url',
        'payment_status',
        'topup_status',
        'sn',
        'payment_message',
        'topup_message',
        'expired_at',
        'paid_at',
        'completed_at',
        'raw_checkout_response',
        'webhook_logs',
    ];

    protected $casts = [
        'h2h_price' => 'integer',
        'reseller_price' => 'integer',
        'admin_fee' => 'integer',
        'total_payment' => 'integer',
        'commission_amount' => 'integer',
        'expired_at' => 'datetime',
        'paid_at' => 'datetime',
        'completed_at' => 'datetime',
        'raw_checkout_response' => 'array',
        'webhook_logs' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function productItem(): BelongsTo
    {
        return $this->belongsTo(ProductItem::class);
    }

    /**
     * Check if payment is already expired.
     */
    public function isExpired(): bool
    {
        if ($this->payment_status === 'EXPIRED') {
            return true;
        }

        if ($this->payment_status === 'UNPAID' && $this->expired_at && Carbon::now()->greaterThanOrEqualTo($this->expired_at)) {
            return true;
        }

        return false;
    }

    public function isPaid(): bool
    {
        return in_array($this->payment_status, ['PAID', 'SETTLED', 'SUCCESS']);
    }

    public function isTopupCompleted(): bool
    {
        return $this->topup_status === 'SUCCESS';
    }

    public function isTopupFailed(): bool
    {
        return $this->topup_status === 'FAILED';
    }

    public function getFormattedTotalPaymentAttribute(): string
    {
        return 'Rp '.number_format($this->total_payment, 0, ',', '.');
    }

    public function getFormattedResellerPriceAttribute(): string
    {
        return 'Rp '.number_format($this->reseller_price, 0, ',', '.');
    }

    public function getFormattedAdminFeeAttribute(): string
    {
        return 'Rp '.number_format($this->admin_fee, 0, ',', '.');
    }
}
