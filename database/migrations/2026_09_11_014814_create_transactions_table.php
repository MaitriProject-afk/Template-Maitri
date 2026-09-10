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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_code', 100)->unique();
            $table->string('maitri_invoice', 100)->nullable()->index();
            $table->foreignId('user_id')->nullable()->nullOnDelete();
            $table->foreignId('product_id')->nullable()->nullOnDelete();
            $table->foreignId('product_item_id')->nullable()->nullOnDelete();
            $table->string('buyer_sku_code', 100);
            $table->string('product_name', 255);
            $table->string('customer_no', 255);
            $table->string('customer_whatsapp', 50)->nullable();
            $table->unsignedInteger('h2h_price')->default(0);
            $table->unsignedInteger('reseller_price')->default(0);
            $table->unsignedInteger('admin_fee')->default(0);
            $table->unsignedInteger('total_payment')->default(0);
            $table->unsignedInteger('commission_amount')->default(0);
            $table->string('service', 20)->default('11');
            $table->text('qr_content')->nullable();
            $table->text('checkout_url')->nullable();
            $table->string('payment_status', 50)->default('UNPAID')->index();
            $table->string('topup_status', 50)->default('WAITING_PAYMENT')->index();
            $table->string('sn', 255)->nullable();
            $table->text('payment_message')->nullable();
            $table->text('topup_message')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->json('raw_checkout_response')->nullable();
            $table->json('webhook_logs')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
