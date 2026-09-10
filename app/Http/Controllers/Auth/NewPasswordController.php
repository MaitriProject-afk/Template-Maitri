<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\PasswordResetCode;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NewPasswordController extends Controller
{
    /**
     * Display the password reset view.
     */
    public function create(Request $request): Response|RedirectResponse
    {
        $email = $request->query('email', session('reset_email'));
        $token = $request->query('token', $request->route('token') ?? session('reset_token'));

        if (! $email || ! $token || ! PasswordResetCode::findValidResetToken($email, $token)) {
            return redirect()->route('password.request')
                ->withErrors(['email' => 'Sesi reset kata sandi tidak valid atau telah kedaluwarsa. Silakan ajukan kode verifikasi baru.']);
        }

        return Inertia::render('Auth/ResetPassword', [
            'email' => $email,
            'token' => $token,
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $validRecord = PasswordResetCode::findValidResetToken($request->email, $request->token);

        if (! $validRecord) {
            throw ValidationException::withMessages([
                'email' => 'Sesi reset kata sandi tidak valid atau telah kedaluwarsa. Silakan ajukan kode verifikasi baru.',
            ]);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'Pengguna dengan email tersebut tidak ditemukan.',
            ]);
        }

        $user->forceFill([
            'password' => Hash::make($request->password),
            'remember_token' => Str::random(60),
        ])->save();

        PasswordResetCode::consumeResetToken($request->email, $request->token);

        session()->forget(['reset_email', 'reset_token', 'reset_step']);

        event(new PasswordReset($user));

        return redirect()->route('login')->with('status', 'Kata sandi akun Anda berhasil diperbarui! Silakan masuk dengan kata sandi baru.');
    }
}
