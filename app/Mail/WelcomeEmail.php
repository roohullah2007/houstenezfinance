<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Welcome to Houston EZ Finance',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.welcome',
            with: [
                'name' => $this->user->name,
                'loginUrl' => route('login'),
            ],
        );
    }
}
