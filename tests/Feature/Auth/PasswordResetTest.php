<?php

namespace Tests\Feature\Auth;

use App\Mail\ResetPasswordOtpNotification;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_screen_can_be_rendered(): void
    {
        $response = $this->get('/forgot-password');

        $response->assertStatus(200);
    }

    public function test_reset_password_link_can_be_requested(): void
    {
        Mail::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Mail::assertSent(ResetPasswordOtpNotification::class, function ($mail) use ($user) {
            return $mail->hasTo($user->email);
        });
    }

    public function test_reset_password_screen_can_be_rendered(): void
    {
        $user = User::factory()->create();

        $otp = PasswordResetCode::generateCode($user->email);
        $result = PasswordResetCode::verifyCode($user->email, $otp);

        $response = $this->get('/reset-password?token='.$result['reset_token'].'&email='.$user->email);

        $response->assertStatus(200);
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        $user = User::factory()->create();

        $otp = PasswordResetCode::generateCode($user->email);
        $result = PasswordResetCode::verifyCode($user->email, $otp);

        $response = $this->post('/reset-password', [
            'token' => $result['reset_token'],
            'email' => $user->email,
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('login'));
    }
}
