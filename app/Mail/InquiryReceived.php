<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InquiryReceived extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $sellerName,
        public string $vehicle,
        public string $inquirerName,
        public string $inquirerEmail,
        public ?string $inquirerPhone,
        public string $inquiryMessage,
    ) {}

    public function envelope(): Envelope
    {
        $replyTo = [];

        if (filter_var($this->inquirerEmail, FILTER_VALIDATE_EMAIL)) {
            $replyTo[] = new Address($this->inquirerEmail, $this->inquirerName);
        }

        return new Envelope(
            subject: "New inquiry about your {$this->vehicle}",
            replyTo: $replyTo,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.inquiry-received',
            with: [
                'sellerName' => $this->sellerName,
                'vehicle' => $this->vehicle,
                'inquirerName' => $this->inquirerName,
                'inquirerEmail' => $this->inquirerEmail,
                'inquirerPhone' => $this->inquirerPhone,
                'inquiryMessage' => $this->inquiryMessage,
            ],
        );
    }
}
