<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Support\SpamProtection;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function create()
    {
        return Inertia::render('contact');
    }

    public function store(Request $request)
    {
        if (filled($request->input('website'))) {
            return redirect()->route('contact')->with('success', 'Your message has been sent! We will get back to you soon.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'captcha_token' => 'required|string',
            'captcha_answer' => 'required|string',
        ]);

        if (! SpamProtection::verify($validated['captcha_token'], $validated['captcha_answer'])) {
            throw ValidationException::withMessages([
                'captcha_answer' => 'Incorrect answer. Please try again.',
            ]);
        }

        ContactMessage::create(collect($validated)->only([
            'name', 'email', 'phone', 'subject', 'message',
        ])->all());

        return redirect()->route('contact')->with('success', 'Your message has been sent! We will get back to you soon.');
    }
}
