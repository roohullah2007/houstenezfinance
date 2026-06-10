<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\FormSubmissionNotification;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class EmailSettingsController extends Controller
{
    public function edit()
    {
        return Inertia::render('dashboard/email-settings', [
            'settings' => [
                'notification_email' => (string) SiteSetting::get('notification_email', config('mail.notify_to')),
                'from_address' => (string) config('mail.from.address'),
                'from_name' => (string) config('mail.from.name'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'notification_email' => 'required|email|max:255',
        ]);

        SiteSetting::set('notification_email', $validated['notification_email']);

        return redirect()->route('admin.email-settings.edit')->with('success', 'Email settings saved.');
    }

    public function sendTest()
    {
        $recipient = (string) SiteSetting::get('notification_email', config('mail.notify_to'));

        if (empty($recipient)) {
            return response()->json([
                'ok' => false,
                'message' => 'Save a notification email address before sending a test.',
            ]);
        }

        try {
            Mail::to($recipient)->send(new FormSubmissionNotification(
                'Test Email',
                'Admin email settings test',
                [
                    'Sent To' => $recipient,
                    'Sent At' => now()->format('M j, Y g:i A T'),
                    'Status' => 'If you are reading this, notifications are working.',
                ],
            ));

            return response()->json([
                'ok' => true,
                'message' => "Test email sent to {$recipient}. Check the inbox (and spam folder).",
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'ok' => false,
                'message' => 'Could not send the test email: '.$e->getMessage(),
            ]);
        }
    }
}
