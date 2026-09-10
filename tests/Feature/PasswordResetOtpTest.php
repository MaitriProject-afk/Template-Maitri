<?php

namespace Tests\Feature;

use App\Mail\ResetPasswordOtpNotification;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class PasswordResetOtpTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('send-reset-otp:ip:127.0.0.1');
        RateLimiter::clear('verify-reset-otp:ip:127.0.0.1');
    }

    public function test_forgot_password_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_otp_code_is_sent_when_user_exists(): void
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'member@example.com',
            'name' => 'John Member',
        ]);

        $response = $this->post('/forgot-password', [
            'email' => 'member@example.com',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('reset_step', 2);
        $response->assertSessionHas('reset_email', 'member@example.com');

        Mail::assertSent(ResetPasswordOtpNotification::class, function ($mail) {
            return $mail->hasTo('member@example.com');
        });

        $this->assertDatabaseHas('password_reset_codes', [
            'email' => 'member@example.com',
        ]);
    }

    public function test_valid_otp_code_issues_reset_token(): void
    {
        $user = User::factory()->create([
            'email' => 'member@example.com',
        ]);

        $otp = PasswordResetCode::generateCode('member@example.com');

        $response = $this->post('/forgot-password/verify-code', [
            'email' => 'member@example.com',
            'code' => $otp,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('reset_step', 3);
        $response->assertSessionHas('reset_token');

        $token = session('reset_token');
        $this->assertNotEmpty($token);

        $valid = PasswordResetCode::findValidResetToken('member@example.com', $token);
        $this->assertNotNull($valid);
    }

    public function test_invalid_otp_code_fails_and_increments_attempts(): void
    {
        User::factory()->create([
            'email' => 'member@example.com',
        ]);

        PasswordResetCode::generateCode('member@example.com');

        $response = $this->post('/forgot-password/verify-code', [
            'email' => 'member@example.com',
            'code' => '999999',
        ]);

        $response->assertSessionHasErrors('code');

        $record = PasswordResetCode::where('email', 'member@example.com')->first();
        $this->assertEquals(1, $record->attempts);
    }

    public function test_otp_is_destroyed_after_5_failed_attempts(): void
    {
        User::factory()->create([
            'email' => 'member@example.com',
        ]);

        PasswordResetCode::generateCode('member@example.com');

        for ($i = 0; $i < 5; $i++) {
            $this->post('/forgot-password/verify-code', [
                'email' => 'member@example.com',
                'code' => '000000',
            ]);
        }

        $this->assertDatabaseMissing('password_reset_codes', [
            'email' => 'member@example.com',
        ]);
    }

    public function test_expired_otp_code_is_rejected(): void
    {
        User::factory()->create([
            'email' => 'member@example.com',
        ]);

        PasswordResetCode::create([
            'email' => 'member@example.com',
            'code' => Hash::make('123456'),
            'attempts' => 0,
            'expires_at' => now()->subMinute(),
        ]);

        $response = $this->post('/forgot-password/verify-code', [
            'email' => 'member@example.com',
            'code' => '123456',
        ]);

        $response->assertSessionHasErrors('code');
    }

    public function test_user_can_reset_password_with_valid_token(): void
    {
        $user = User::factory()->create([
            'email' => 'member@example.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        $otp = PasswordResetCode::generateCode('member@example.com');
        $verifyResult = PasswordResetCode::verifyCode('member@example.com', $otp);
        $token = $verifyResult['reset_token'];

        $response = $this->post('/reset-password', [
            'email' => 'member@example.com',
            'token' => $token,
            'password' => 'NewSecurePassword123!',
            'password_confirmation' => 'NewSecurePassword123!',
        ]);

        $response->assertRedirect('/login');

        $user->refresh();
        $this->assertTrue(Hash::check('NewSecurePassword123!', $user->password));

        // Token should be consumed
        $this->assertDatabaseMissing('password_reset_codes', [
            'email' => 'member@example.com',
        ]);
    }

    public function test_user_cannot_reset_password_with_fake_token(): void
    {
        $user = User::factory()->create([
            'email' => 'member@example.com',
            'password' => Hash::make('oldpassword123'),
        ]);

        $response = $this->post('/reset-password', [
            'email' => 'member@example.com',
            'token' => 'invalid_or_forged_token_xyz',
            'password' => 'NewSecurePassword123!',
            'password_confirmation' => 'NewSecurePassword123!',
        ]);

        $response->assertSessionHasErrors('email');

        $user->refresh();
        $this->assertTrue(Hash::check('oldpassword123', $user->password));
    }
}
