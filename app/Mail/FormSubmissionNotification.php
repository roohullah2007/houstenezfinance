<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class FormSubmissionNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $formType,
        public string $summary,
        public array $fields,
        public ?string $replyToEmail = null,
    ) {}

    public function envelope(): Envelope
    {
        $replyTo = [];

        if ($this->replyToEmail && filter_var($this->replyToEmail, FILTER_VALIDATE_EMAIL)) {
            $replyTo[] = new Address($this->replyToEmail);
        }

        return new Envelope(
            subject: "New {$this->formType}: {$this->summary}",
            replyTo: $replyTo,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.form-submission',
            with: [
                'formType' => $this->formType,
                'fields' => $this->fields,
                'summary' => $this->summary,
            ],
        );
    }
}
