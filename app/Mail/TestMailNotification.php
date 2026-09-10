<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestMailNotification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @param  array<string, mixed>  $mailerConfig
     */
    public function __construct(
        public string $recipientEmail,
        public array $mailerConfig = []
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $fromName = config('mail.from.name') ?? 'Maitri Project';

        return new Envelope(
            subject: "[Uji Coba Mailer] Konfirmasi Konfigurasi SMTP - {$fromName}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.test',
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
