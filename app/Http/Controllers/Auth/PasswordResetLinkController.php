<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordOtpNotification;
use App\Models\PasswordResetCode;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
            'sessionEmail' => session('reset_email'),
            'sessionStep' => session('reset_step', 1),
            'sessionToken' => session('reset_token'),
        ]);
    }

    /**
     * Handle sending a 6-digit OTP verification code to the user's email.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $ipThrottleKey = 'send-reset-otp:ip:'.$request->ip();
        $emailThrottleKey = 'send-reset-otp:email:'.strtolower($request->email);

        if (RateLimiter::tooManyAttempts($ipThrottleKey, 5) || RateLimiter::tooManyAttempts($emailThrottleKey, 5)) {
            $seconds = max(
                RateLimiter::availableIn($ipThrottleKey),
                RateLimiter::availableIn($emailThrottleKey)
            );

            throw ValidationException::withMessages([
                'email' => "Terlalu banyak permintaan reset kata sandi. Silakan tunggu {$seconds} detik lagi sebelum mencoba kembali.",
            ]);
        }

        RateLimiter::hit($ipThrottleKey, 600); // 10 minutes window
        RateLimiter::hit($emailThrottleKey, 600);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $otp = PasswordResetCode::generateCode($user->email);

            SiteSetting::applyMailConfig();

            try {
                Mail::to($user->email)->send(new ResetPasswordOtpNotification(
                    userName: $user->name,
                    otpCode: $otp,
                    expiresInMinutes: 15
                ));
            } catch (\Throwable $e) {
                // If mail driver fails, notify user gracefully
                report($e);
            }
        }

        // Store persistent session state so validation errors in step 2 won't kick user back to step 1
        session([
            'reset_email' => $request->email,
            'reset_step' => 2,
        ]);
        session()->forget('reset_token');

        return back()
            ->with('status', 'Jika alamat email terdaftar, kode verifikasi 6-digit telah dikirimkan ke kotak masuk Anda.')
            ->with('reset_email', $request->email)
            ->with('reset_step', 2);
    }

    /**
     * Verify the 6-digit OTP code submitted by the user.
     *
     * @throws ValidationException
     */
    public function verifyCode(Request $request): RedirectResponse
    {
        // Maintain step 2 in session in case of validation failure
        session([
            'reset_email' => $request->email,
            'reset_step' => 2,
        ]);

        $request->validate([
            'email' => 'required|email|max:255',
            'code' => 'required|string|size:6',
        ]);

        $throttleKey = 'verify-reset-otp:ip:'.$request->ip();
        if (RateLimiter::tooManyAttempts($throttleKey, 15)) {
            throw ValidationException::withMessages([
                'code' => 'Terlalu banyak percobaan verifikasi yang gagal dari perangkat ini. Harap tunggu beberapa menit.',
            ]);
        }

        RateLimiter::hit($throttleKey, 300);

        $result = PasswordResetCode::verifyCode($request->email, $request->code);

        if (! $result['valid']) {
            throw ValidationException::withMessages([
                'code' => $result['message'] ?? 'Kode verifikasi tidak sesuai.',
            ]);
        }

        // Successfully verified -> Advance to Step 3 in session
        session([
            'reset_email' => $request->email,
            'reset_token' => $result['reset_token'],
            'reset_step' => 3,
        ]);

        return back()
            ->with('status', 'Kode verifikasi berhasil dikonfirmasi! Silakan buat kata sandi baru Anda.')
            ->with('reset_email', $request->email)
            ->with('reset_token', $result['reset_token'])
            ->with('reset_step', 3);
    }

    /**
     * Resend the 6-digit OTP code to the email.
     */
    public function resendCode(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email|max:255',
        ]);

        $resendCooldownKey = 'resend-reset-otp:'.strtolower($request->email);
        if (RateLimiter::tooManyAttempts($resendCooldownKey, 1)) {
            $seconds = RateLimiter::availableIn($resendCooldownKey);
            throw ValidationException::withMessages([
                'code' => "Mohon tunggu {$seconds} detik lagi sebelum meminta kirim ulang kode.",
            ]);
        }

        RateLimiter::hit($resendCooldownKey, 60); // 60 seconds cooldown

        return $this->store($request);
    }

    /**
     * Reset the reset password session back to step 1.
     */
    public function restart(): RedirectResponse
    {
        session()->forget(['reset_step', 'reset_token']);

        return redirect()->route('password.request');
    }
}
