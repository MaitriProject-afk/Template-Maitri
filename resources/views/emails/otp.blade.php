<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode Verifikasi Reset Kata Sandi - {{ config('mail.from.name', 'Maitri Project') }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 540px; background-color: #ffffff; border: 2px solid #0f172a; border-radius: 16px; box-shadow: 4px 4px 0px #0f172a; overflow: hidden;" cellspacing="0" cellpadding="0">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2563eb; padding: 24px 28px; text-align: center; border-bottom: 2px solid #0f172a;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase;">
                                {{ config('mail.from.name', 'Maitri Project') }}
                            </h1>
                            <p style="margin: 6px 0 0 0; color: #dbeafe; font-size: 13px; font-weight: 600;">
                                Permintaan Reset Kata Sandi Akun
                            </p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 32px 28px;">
                            <p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 700; color: #0f172a;">
                                Halo, {{ $userName }}!
                            </p>
                            <p style="margin: 0 0 24px 0; font-size: 13px; line-height: 1.6; color: #475569;">
                                Kami menerima permintaan untuk mereset kata sandi akun Anda. Gunakan kode verifikasi (OTP) acak berikut untuk mengonfirmasi identitas Anda:
                            </p>

                            <!-- OTP Box -->
                            <div style="background-color: #f8fafc; border: 2px dashed #0f172a; border-radius: 12px; padding: 20px 16px; margin-bottom: 24px; text-align: center;">
                                <span style="display: block; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px;">
                                    KODE VERIFIKASI RAHASIA
                                </span>
                                <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #2563eb; text-indent: 8px;">
                                    {{ $otpCode }}
                                </div>
                                <span style="display: inline-block; margin-top: 10px; font-size: 11px; font-weight: 700; color: #dc2626; background-color: #fee2e2; padding: 4px 10px; border-radius: 6px; border: 1px solid #f87171;">
                                    ⏱️ Berlaku selama {{ $expiresInMinutes }} menit
                                </span>
                            </div>

                            <!-- Security Warning -->
                            <div style="background-color: #fffbeb; border: 1.5px solid #f59e0b; border-radius: 10px; padding: 14px 16px; margin-bottom: 24px;">
                                <table cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="28" valign="top" style="font-size: 18px; line-height: 1;">🛡️</td>
                                        <td style="font-size: 12px; line-height: 1.5; color: #92400e;">
                                            <strong>Peringatan Keamanan:</strong> Jangan pernah memberikan kode ini kepada siapa pun, termasuk pihak yang mengaku sebagai Customer Service kami. Kami tidak pernah meminta kode OTP Anda.
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b;">
                                Jika Anda tidak merasa melakukan permintaan ini, akun Anda tetap aman dan Anda dapat mengabaikan email ini.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 18px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                            &copy; {{ date('Y') }} {{ config('mail.from.name', 'Maitri Project') }}. Pesan otomatis, mohon tidak membalas email ini.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
