<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetCode extends Model
{
    protected $fillable = [
        'email',
        'code',
        'reset_token',
        'attempts',
        'expires_at',
        'reset_token_expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'reset_token_expires_at' => 'datetime',
        'attempts' => 'integer',
    ];

    /**
     * Generate a new 6-digit OTP code for the given email, deleting previous codes.
     */
    public static function generateCode(string $email): string
    {
        static::where('email', $email)->delete();

        $plainOtp = (string) random_int(100000, 999999);

        static::create([
            'email' => $email,
            'code' => Hash::make($plainOtp),
            'attempts' => 0,
            'expires_at' => now()->addMinutes(15),
        ]);

        return $plainOtp;
    }

    /**
     * Verify the 6-digit OTP code with anti-bruteforce protection (max 5 attempts).
     *
     * @return array{valid: bool, reset_token?: string, message?: string}
     */
    public static function verifyCode(string $email, string $inputCode): array
    {
        $record = static::where('email', $email)
            ->where('expires_at', '>', now())
            ->first();

        if (! $record) {
            return [
                'valid' => false,
                'message' => 'Kode verifikasi tidak ditemukan atau telah kedaluwarsa. Silakan minta kode baru.',
            ];
        }

        if ($record->attempts >= 5) {
            $record->delete();

            return [
                'valid' => false,
                'message' => 'Batas percobaan verifikasi telah habis. Silakan ajukan kode baru demi keamanan.',
            ];
        }

        if (Hash::check(trim($inputCode), $record->code)) {
            $resetToken = Str::random(64);

            $record->update([
                'code' => 'USED',
                'reset_token' => $resetToken,
                'reset_token_expires_at' => now()->addMinutes(15),
            ]);

            return [
                'valid' => true,
                'reset_token' => $resetToken,
            ];
        }

        $record->increment('attempts');
        $remaining = 5 - $record->attempts;

        if ($remaining <= 0) {
            $record->delete();

            return [
                'valid' => false,
                'message' => 'Kode salah 5 kali berturut-turut. Kode telah dihanguskan demi keamanan akun. Silakan minta kode baru.',
            ];
        }

        return [
            'valid' => false,
            'message' => "Kode verifikasi tidak sesuai. Sisa kesempatan: {$remaining} kali.",
        ];
    }

    /**
     * Find a valid, unexpired one-time reset token.
     */
    public static function findValidResetToken(string $email, string $token): ?static
    {
        return static::where('email', $email)
            ->where('reset_token', $token)
            ->where('reset_token_expires_at', '>', now())
            ->first();
    }

    /**
     * Invalidate and consume the reset token once used.
     */
    public static function consumeResetToken(string $email, string $token): void
    {
        static::where('email', $email)
            ->where('reset_token', $token)
            ->delete();
    }
}
