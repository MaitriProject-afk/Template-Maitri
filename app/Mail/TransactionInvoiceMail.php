<?php

namespace App\Mail;

use App\Models\SiteSetting;
use App\Models\Transaction;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TransactionInvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Transaction $transaction,
        public string $type = 'success'
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $settings = SiteSetting::getSettings();
        $siteName = $settings['site_name'] ?? config('mail.from.name', 'Maitri Project');

        if ($this->type === 'success') {
            $subject = "[INVOICE RESMI] Pesanan #{$this->transaction->invoice_code} Berhasil Diproses - {$siteName}";
        } else {
            $subject = "[PENTING] Kendala Pesanan #{$this->transaction->invoice_code} - Layanan Bantuan - {$siteName}";
        }

        return new Envelope(
            subject: $subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $settings = SiteSetting::getSettings();
        $siteName = $settings['site_name'] ?? config('mail.from.name', 'Maitri Project');
        $adminWhatsapp = $settings['contact_whatsapp'] ?? '081234567890';

        // Format whatsapp number into international format without symbols
        $waClean = preg_replace('/[^0-9]/', '', (string) $adminWhatsapp);
        if (str_starts_with($waClean, '0')) {
            $waClean = '62'.substr($waClean, 1);
        }

        $complaintMessage = "Halo Admin {$siteName}, saya ingin melaporkan kendala pesanan:\n".
            "- No Invoice: {$this->transaction->invoice_code}\n".
            "- Produk: {$this->transaction->product_name}\n".
            "- Target Tujuan: {$this->transaction->customer_no}\n".
            "- Total Bayar: {$this->transaction->formatted_total_payment}\n".
            "- Status Pengisian: GAGAL\n".
            '- Keterangan Error: '.($this->transaction->topup_message ?: 'Pengisian gagal diproses oleh sistem provider')."\n\n".
            'Mohon bantuannya ya admin. Terima kasih!';

        $waChatUrl = 'https://wa.me/'.$waClean.'?text='.rawurlencode($complaintMessage);
        $invoiceUrl = route('invoice.show', ['invoice_code' => $this->transaction->invoice_code]);

        $viewName = $this->type === 'success' ? 'emails.invoice-success' : 'emails.invoice-failed';

        return new Content(
            view: $viewName,
            with: [
                'transaction' => $this->transaction,
                'siteSettings' => $settings,
                'siteName' => $siteName,
                'adminWhatsapp' => $adminWhatsapp,
                'waClean' => $waClean,
                'waChatUrl' => $waChatUrl,
                'invoiceUrl' => $invoiceUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
