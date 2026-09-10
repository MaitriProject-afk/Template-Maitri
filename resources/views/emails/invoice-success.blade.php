<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice Resmi #{{ $transaction->invoice_code }} - {{ $siteName }}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border: 2.5px solid #0f172a; border-radius: 20px; box-shadow: 5px 5px 0px #0f172a; overflow: hidden;" cellspacing="0" cellpadding="0">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #2563eb; padding: 26px 30px; text-align: center; border-bottom: 2.5px solid #0f172a;">
                            <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px; border: 1.5px solid #1e40af; margin-bottom: 8px;">
                                INVOICE RESMI DIGITAL
                            </span>
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: 0.5px; text-transform: uppercase;">
                                {{ $siteName }}
                            </h1>
                            <p style="margin: 4px 0 0 0; color: #e0f2fe; font-size: 12px; font-weight: 600;">
                                {{ $siteSettings['site_tagline'] ?? 'Top Up Game & PPOB Terpercaya' }}
                            </p>
                        </td>
                    </tr>

                    <!-- Status Banner (SUCCESS) -->
                    <tr>
                        <td style="padding: 24px 30px 10px 30px;">
                            <div style="background-color: #ecfdf5; border: 2px solid #059669; border-radius: 14px; padding: 18px 20px; text-align: center; box-shadow: 3px 3px 0px #059669;">
                                <span style="display: inline-block; font-size: 24px; margin-bottom: 4px;">✅</span>
                                <h2 style="margin: 0; color: #065f46; font-size: 17px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">
                                    TRANSAKSI BERHASIL DIPROSES
                                </h2>
                                <p style="margin: 4px 0 0 0; color: #047857; font-size: 12px; font-weight: 600; line-height: 1.5;">
                                    Pembayaran Anda telah lunas dan pengisian produk sukses dikirimkan ke akun target Anda.
                                </p>
                            </div>
                        </td>
                    </tr>

                    <!-- Body / Transaction Details -->
                    <tr>
                        <td style="padding: 20px 30px 30px 30px;">
                            
                            <!-- Invoice Meta Box -->
                            <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 22px;">
                                <tr>
                                    <td valign="top" style="width: 50%;">
                                        <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Nomor Invoice</span>
                                        <span style="font-family: 'Courier New', Courier, monospace; font-size: 15px; font-weight: 900; color: #2563eb;">
                                            #{{ $transaction->invoice_code }}
                                        </span>
                                    </td>
                                    <td valign="top" align="right" style="width: 50%;">
                                        <span style="display: block; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Waktu Transaksi</span>
                                        <span style="font-size: 13px; font-weight: 700; color: #0f172a;">
                                            {{ $transaction->created_at?->translatedFormat('d M Y, H:i') }} WIB
                                        </span>
                                    </td>
                                </tr>
                            </table>

                            <!-- Product Information Table -->
                            <div style="background-color: #f8fafc; border: 2px solid #0f172a; border-radius: 14px; overflow: hidden; margin-bottom: 22px;">
                                <div style="background-color: #f1f5f9; padding: 10px 16px; border-bottom: 2px solid #0f172a; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a;">
                                    📦 Detail Item & Target Pengisian
                                </div>
                                <table width="100%" cellspacing="0" cellpadding="12" style="font-size: 13px; border-collapse: collapse;">
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; width: 40%; border-bottom: 1px solid #e2e8f0;">Nama Produk</td>
                                        <td style="color: #0f172a; font-weight: 800; border-bottom: 1px solid #e2e8f0;">
                                            {{ $transaction->product_name }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Target / No Pelanggan</td>
                                        <td style="color: #0f172a; font-weight: 900; font-family: 'Courier New', Courier, monospace; border-bottom: 1px solid #e2e8f0;">
                                            {{ $transaction->customer_no }}
                                        </td>
                                    </tr>
                                    @if($transaction->sn)
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">No Seri / SN Provider</td>
                                        <td style="color: #059669; font-weight: 900; font-family: 'Courier New', Courier, monospace; border-bottom: 1px solid #e2e8f0; word-break: break-all;">
                                            {{ $transaction->sn }}
                                        </td>
                                    </tr>
                                    @endif
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600;">Status Pengisian</td>
                                        <td style="color: #059669; font-weight: 900;">
                                            BERHASIL (SUKSES)
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Payment Breakdown Table -->
                            <div style="background-color: #ffffff; border: 2px solid #0f172a; border-radius: 14px; overflow: hidden; margin-bottom: 26px;">
                                <div style="background-color: #f1f5f9; padding: 10px 16px; border-bottom: 2px solid #0f172a; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #0f172a;">
                                    💰 Rincian Pembayaran
                                </div>
                                <table width="100%" cellspacing="0" cellpadding="12" style="font-size: 13px; border-collapse: collapse;">
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Harga Produk</td>
                                        <td align="right" style="color: #0f172a; font-weight: 700; border-bottom: 1px solid #e2e8f0;">
                                            {{ $transaction->formatted_reseller_price }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-weight: 600; border-bottom: 1px solid #e2e8f0;">Biaya Layanan / Admin</td>
                                        <td align="right" style="color: #0f172a; font-weight: 700; border-bottom: 1px solid #e2e8f0;">
                                            {{ $transaction->formatted_admin_fee }}
                                        </td>
                                    </tr>
                                    <tr style="background-color: #f8fafc;">
                                        <td style="color: #0f172a; font-size: 14px; font-weight: 900; text-transform: uppercase;">Total Pembayaran</td>
                                        <td align="right" style="color: #2563eb; font-size: 16px; font-weight: 900;">
                                            {{ $transaction->formatted_total_payment }}
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Action Button -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <a href="{{ $invoiceUrl }}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; padding: 14px 28px; border-radius: 12px; border: 2px solid #0f172a; box-shadow: 4px 4px 0px #0f172a;">
                                    🔍 Buka Invoice Online
                                </a>
                            </div>

                            <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #64748b; text-align: center;">
                                Simpan bukti email ini sebagai tanda terima transaksi resmi Anda. Terima kasih telah mempercayai <strong>{{ $siteName }}</strong>!
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 2px solid #0f172a; font-size: 11px; color: #64748b; line-height: 1.5;">
                            <div><strong>{{ $siteName }}</strong> — {{ $siteSettings['site_description'] ?? 'Layanan Top Up Game & PPOB' }}</div>
                            <div style="margin-top: 4px;">WhatsApp CS: <strong>{{ $adminWhatsapp }}</strong> | Email: <strong>{{ $siteSettings['contact_email'] ?? 'support@maitriproject.my.id' }}</strong></div>
                            <div style="margin-top: 8px; color: #94a3b8;">&copy; {{ date('Y') }} {{ $siteName }}. All rights reserved.</div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
