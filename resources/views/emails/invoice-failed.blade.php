<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemberitahuan Kendala Pesanan #{{ $transaction->invoice_code }} - {{ $siteName }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border: 2.5px solid #0f172a; border-radius: 20px; box-shadow: 5px 5px 0px #0f172a; overflow: hidden;" cellspacing="0" cellpadding="0">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #dc2626; padding: 26px 30px; text-align: center; border-bottom: 2.5px solid #0f172a;">
                            <span style="display: inline-block; background-color: #fee2e2; color: #991b1b; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px; border: 1.5px solid #991b1b; margin-bottom: 8px;">
                                PEMBERITAHUAN PENTING
                            </span>
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase;">
                                {{ $siteName }}
                            </h1>
                            <p style="margin: 4px 0 0 0; color: #fecaca; font-size: 12px; font-weight: 600;">
                                Layanan Bantuan & Konfirmasi Pengisian Pesanan
                            </p>
                        </td>
                    </tr>

                    <!-- Status Banner (FAILED AFTER PAYMENT) -->
                    <tr>
                        <td style="padding: 24px 30px 10px 30px;">
                            <div style="background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 14px; padding: 18px 20px; text-align: center; box-shadow: 3px 3px 0px #ef4444;">
                                <span style="display: inline-block; font-size: 26px; margin-bottom: 4px;">⚠️</span>
                                <h2 style="margin: 0; color: #991b1b; font-size: 17px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
                                    PENGISIAN TOP-UP GAGAL
                                </h2>
                                <p style="margin: 6px 0 0 0; color: #b91c1c; font-size: 13px; font-weight: 600; line-height: 1.5;">
                                    Pembayaran Anda sebesar <strong>{{ $transaction->formatted_total_payment }}</strong> telah berhasil diverifikasi, namun sistem provider mengalami kendala saat memproses produk ke akun target.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Body / Details -->
                    <tr>
                        <td style="padding: 16px 30px 30px 30px;">
                            
                            <!-- Detail Kegagalan / Error Box -->
                            <div style="background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 14px; padding: 14px 18px; margin-bottom: 22px;">
                                <table width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td width="30" valign="top" style="font-size: 20px; line-height: 1;">ℹ️</td>
                                        <td style="font-size: 13px; color: #92400e; line-height: 1.5;">
                                            <strong>Keterangan Kendala Sistem:</strong><br>
                                            <span style="font-family: 'Courier New', Courier, monospace; font-size: 12px; font-weight: 700; color: #b45309; display: inline-block; margin-top: 4px;">
                                                "{{ $transaction->topup_message ?: 'Pengisian gagal diproses oleh server provider atau nomor tujuan tidak valid.' }}"
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Refund Guarantee Assurance Box -->
                            <div style="background-color: #f0fdf4; border: 2px solid #16a34a; border-radius: 14px; padding: 14px 18px; margin-bottom: 22px;">
                                <table width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td width="30" valign="top" style="font-size: 20px; line-height: 1;">🛡️</td>
                                        <td style="font-size: 12px; color: #166534; line-height: 1.5;">
                                            <strong>Dana Anda 100% Aman & Bergaransi:</strong><br>
                                            Jangan khawatir, uang yang telah Anda bayarkan tidak hilang. Tim Admin kami siap memproses pengembalian dana (refund) penuh ke rekening/e-wallet Anda atau membantu pengecekan pengisian ulang manual.
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Order Details Table -->
                            <div style="background-color: #ffffff; border: 2px solid #0f172a; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
                                <div style="background-color: #f1f5f9; padding: 10px 16px; border-bottom: 2px solid #0f172a; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a;">
                                    📋 Detail Pesanan yang Perlu Bantuan
                                </div>
                                <table width="100%" cellspacing="0" cellpadding="12" style="font-size: 13px; border-collapse: collapse;">
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; width: 40%; border-bottom: 1px solid #e2e8f0;">Nomor Invoice</td>
                                        <td style="color: #2563eb; font-weight: 900; font-family: 'Courier New', Courier, monospace; border-bottom: 1px solid #e2e8f0;">
                                            #{{ $transaction->invoice_code }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Nama Produk</td>
                                        <td style="color: #0f172a; font-weight: 800; border-bottom: 1px solid #e2e8f0;">
                                            {{ $transaction->product_name }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Target / No Tujuan</td>
                                        <td style="color: #0f172a; font-weight: 900; font-family: 'Courier New', Courier, monospace; border-bottom: 1px solid #e2e8f0;">
                                            {{ $transaction->customer_no }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Status Pembayaran</td>
                                        <td style="color: #059669; font-weight: 900; border-bottom: 1px solid #e2e8f0;">
                                            SUDAH DIBAYAR (LUNAS)
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Total Dana Masuk</td>
                                        <td style="color: #0f172a; font-weight: 900; font-size: 15px; border-bottom: 1px solid #e2e8f0;">
                                            {{ $transaction->formatted_total_payment }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600;">Status Pengisian</td>
                                        <td style="color: #dc2626; font-weight: 900;">
                                            GAGAL DIPROSES
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- WhatsApp Action Button (Dynamic following site_settings.contact_whatsapp) -->
                            <div style="text-align: center; margin-bottom: 16px;">
                                <a href="{{ $waChatUrl }}" target="_blank" style="display: inline-block; background-color: #22c55e; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; padding: 15px 32px; border-radius: 12px; border: 2.5px solid #0f172a; box-shadow: 4px 4px 0px #0f172a;">
                                    💬 Hubungi Admin via WhatsApp
                                </a>
                                <p style="margin: 8px 0 0 0; font-size: 11px; font-weight: 700; color: #475569;">
                                    Nomor CS Resmi: <strong>{{ $adminWhatsapp }}</strong> (Pesan komplain otomatis terisi)
                                </p>
                            </div>

                            <!-- Secondary Button: Check Online Invoice -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <a href="{{ $invoiceUrl }}" target="_blank" style="display: inline-block; color: #475569; text-decoration: underline; font-size: 12px; font-weight: 700;">
                                    Lihat Status di Halaman Invoice Online &rarr;
                                </a>
                            </div>

                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b; text-align: center;">
                                Silakan hubungi admin kami untuk klaim refund cepat atau bantuan pengecekan nomor tujuan Anda.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 2px solid #0f172a; font-size: 11px; color: #64748b; line-height: 1.5;">
                            <div><strong>{{ $siteName }}</strong> — Layanan Dukungan Pelanggan Resmi</div>
                            <div style="margin-top: 4px;">WhatsApp: <strong>{{ $adminWhatsapp }}</strong> | Email: <strong>{{ $siteSettings['contact_email'] ?? 'support@maitriproject.my.id' }}</strong></div>
                            <div style="margin-top: 8px; color: #94a3b8;">&copy; {{ date('Y') }} {{ $siteName }}. All rights reserved.</div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
