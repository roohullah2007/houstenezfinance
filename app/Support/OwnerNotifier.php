<?php

namespace App\Support;

use App\Mail\FormSubmissionNotification;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class OwnerNotifier
{
    public static function send(string $formType, string $summary, array $fields, ?string $replyTo = null): void
    {
        try {
            $recipient = SiteSetting::get('notification_email') ?: config('mail.notify_to');

            Mail::to($recipient)
                ->send(new FormSubmissionNotification($formType, $summary, $fields, $replyTo));
        } catch (\Throwable $e) {
            Log::warning('Owner notification failed: '.$e->getMessage());
        }
    }
}
