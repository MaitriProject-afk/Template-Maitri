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
        Schema::create('password_reset_codes', function (Blueprint $table) {
            $table->id();
            $table->string('email')->index();
            $table->string('code'); // Hashed 6-digit OTP
            $table->string('reset_token')->nullable()->unique(); // One-time token after OTP verified
            $table->unsignedTinyInteger('attempts')->default(0); // Max 5 attempts
            $table->timestamp('expires_at'); // OTP expiration (15 mins)
            $table->timestamp('reset_token_expires_at')->nullable(); // Reset token expiration (15 mins)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('password_reset_codes');
    }
};
