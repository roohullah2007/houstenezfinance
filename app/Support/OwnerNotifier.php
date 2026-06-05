<?php

namespace App\Support;

use App\Mail\FormSubmissionNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OwnerNotifier
{
    public static function send(string $formType, string $summary, array $fields, ?string $replyTo = null): void
    {
        try {
            Mail::to(config('mail.notify_to'))
                ->send(new FormSubmissionNotification($formType, $summary, $fields, $replyTo));
        } catch (\Throwable $e) {
            Log::warning('Owner notification failed: '.$e->getMessage());
        }
    }
}
