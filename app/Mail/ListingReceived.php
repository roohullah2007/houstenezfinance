<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ListingReceived extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  string  $sellerName  Full name of the seller.
     * @param  string  $vehicle  Human-readable vehicle, e.g. "2019 Toyota Camry".
     * @param  bool  $paymentRequired  Whether a listing fee is still due.
     */
    public function __construct(
        public string $sellerName,
        public string $vehicle,
        public string $title,
        public bool $paymentRequired = false,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "We received your car listing: {$this->vehicle}",
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.listing-received',
            with: [
                'sellerName' => $this->sellerName,
                'vehicle' => $this->vehicle,
                'title' => $this->title,
                'paymentRequired' => $this->paymentRequired,
            ],
        );
    }
}
