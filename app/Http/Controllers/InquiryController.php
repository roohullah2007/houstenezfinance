<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use App\Models\ListingInquiry;
use App\Support\OwnerNotifier;
use App\Support\SpamProtection;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class InquiryController extends Controller
{
    public function store(Request $request, CarListing $carListing)
    {
        if (filled($request->input('website'))) {
            return back()->with('success', 'Your message has been sent! We will contact you shortly.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:2000',
            'captcha_token' => 'required|string',
            'captcha_answer' => 'required|string',
        ]);

        if (! SpamProtection::verify($validated['captcha_token'], $validated['captcha_answer'])) {
            throw ValidationException::withMessages([
                'captcha_answer' => 'Incorrect answer. Please try again.',
            ]);
        }

        $carListing->inquiries()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'message' => $validated['message'],
            'status' => 'new',
        ]);

        $vehicle = trim("{$carListing->year} {$carListing->make} {$carListing->model}");

        OwnerNotifier::send(
            'Vehicle Inquiry',
            "{$validated['name']} — {$vehicle}",
            [
                'Name' => $validated['name'],
                'Email' => $validated['email'],
                'Phone' => $validated['phone'] ?? null,
                'Vehicle' => trim("{$vehicle} ({$carListing->title})"),
                'Message' => $validated['message'],
            ],
            $validated['email'],
        );

        return back()->with('success', 'Your message has been sent! We will contact you shortly.');
    }
}
