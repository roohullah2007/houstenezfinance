<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Support\SpamProtection;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RealEstateController extends Controller
{
    public function index()
    {
        return Inertia::render('real-estate');
    }

    public function store(Request $request)
    {
        if (filled($request->input('website'))) {
            return redirect()->route('real-estate')->with('success', 'Thanks! A real estate specialist will reach out shortly.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'inquiry_type' => 'required|string|max:100',
            'property_interest' => 'nullable|string|max:255',
            'message' => 'required|string',
            'captcha_token' => 'required|string',
            'captcha_answer' => 'required|string',
        ]);

        if (! SpamProtection::verify($validated['captcha_token'], $validated['captcha_answer'])) {
            throw ValidationException::withMessages([
                'captcha_answer' => 'Incorrect answer. Please try again.',
            ]);
        }

        $subjectParts = ['Real Estate — ' . $validated['inquiry_type']];
        if (! empty($validated['property_interest'])) {
            $subjectParts[] = $validated['property_interest'];
        }

        ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => implode(' — ', $subjectParts),
            'message' => $validated['message'],
        ]);

        return redirect()->route('real-estate')->with('success', 'Thanks! A real estate specialist will reach out shortly.');
    }
}
