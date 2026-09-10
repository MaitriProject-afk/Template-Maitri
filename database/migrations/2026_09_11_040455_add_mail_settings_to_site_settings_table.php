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
        Schema::table('site_settings', function (Blueprint $table) {
            $table->string('mail_mailer')->nullable()->default('smtp')->after('cron_sync_token');
            $table->string('mail_host')->nullable()->after('mail_mailer');
            $table->integer('mail_port')->nullable()->default(587)->after('mail_host');
            $table->string('mail_username')->nullable()->after('mail_port');
            $table->text('mail_password')->nullable()->after('mail_username');
            $table->string('mail_scheme')->nullable()->default('tls')->after('mail_password');
            $table->string('mail_from_address')->nullable()->after('mail_scheme');
            $table->string('mail_from_name')->nullable()->after('mail_from_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_settings', function (Blueprint $table) {
            $table->dropColumn([
                'mail_mailer',
                'mail_host',
                'mail_port',
                'mail_username',
                'mail_password',
                'mail_scheme',
                'mail_from_address',
                'mail_from_name',
            ]);
        });
    }
};
