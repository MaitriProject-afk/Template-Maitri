<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uji Coba Mailer - {{ config('app.name') }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border: 2px solid #0f172a; border-radius: 12px; box-shadow: 4px 4px 0px #0f172a; overflow: hidden;" cellspacing="0" cellpadding="0">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2563eb; padding: 24px; text-align: center; border-bottom: 2px solid #0f172a;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">
                                {{ config('mail.from.name', 'Maitri Project') }}
                            </h1>
                            <p style="margin: 6px 0 0 0; color: #dbeafe; font-size: 13px; font-weight: 500;">
                                Verifikasi & Pengujian Layanan Email (SMTP)
                            </p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 32px 28px;">
                            <div style="background-color: #ecfdf5; border: 1.5px solid #10b981; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
                                <span style="display: inline-block; font-size: 28px; margin-bottom: 6px;">&#9989;</span>
                                <h2 style="margin: 0; color: #065f46; font-size: 17px; font-weight: 700;">Konfigurasi Mailer Berhasil!</h2>
                                <p style="margin: 6px 0 0 0; color: #047857; font-size: 13px;">
                                    Email ini adalah bukti bahwa pengaturan SMTP / Mailer pada Dashboard Admin Anda telah berfungsi dengan normal.
                                </p>
                            </div>

                            <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #334155;">
                                Halo Admin, sistem berhasil mengirimkan pesan uji coba ke alamat email: <strong>{{ $recipientEmail }}</strong>.
                            </p>

                            <!-- Configuration Details -->
                            <div style="background-color: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; font-weight: 700;">
                                    Detail Pengujian Mailer:
                                </h3>
                                <table width="100%" cellspacing="0" cellpadding="4" style="font-size: 13px; color: #1e293b;">
                                    <tr>
                                        <td width="38%" style="color: #64748b; font-weight: 600;">Driver / Mailer:</td>
                                        <td style="font-family: monospace; font-weight: 700; color: #2563eb;">{{ strtoupper($mailerConfig['mailer'] ?? 'SMTP') }}</td>
                                    </tr>
                                    @if(($mailerConfig['mailer'] ?? '') !== 'log')
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600;">Host:</td>
                                        <td style="font-family: monospace;">{{ $mailerConfig['host'] ?? '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600;">Port:</td>
                                        <td style="font-family: monospace;">{{ $mailerConfig['port'] ?? '-' }}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600;">Enkripsi / Scheme:</td>
                                        <td style="font-family: monospace;">{{ $mailerConfig['scheme'] ?? '-' }}</td>
                                    </tr>
                                    @endif
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600;">Pengirim (From):</td>
                                        <td>{{ $mailerConfig['from'] ?? config('mail.from.address') }}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600;">Waktu Pengujian:</td>
                                        <td>{{ now()->translatedFormat('d F Y, H:i:s') }} WIB</td>
                                    </tr>
                                </table>
                            </div>

                            <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748b;">
                                Konfigurasi ini siap digunakan untuk fitur otomatisasi notifikasi seperti bukti transaksi, invoice sukses, token OTP, atau reset password.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8fafc; padding: 18px 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8;">
                            &copy; {{ date('Y') }} {{ config('mail.from.name', 'Maitri Project') }}. Pesan otomatis dari Sistem Administrator.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
