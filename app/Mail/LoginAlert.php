<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginAlert extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public User $user,
        public ?string $ip = null,
        public ?string $userAgent = null,
        public ?string $time = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New sign-in to your Houston EZ Finance account',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.login-alert',
            with: [
                'name' => $this->user->name,
                'ip' => $this->ip,
                'userAgent' => $this->userAgent,
                'time' => $this->time,
            ],
        );
    }
}
