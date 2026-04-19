<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\RealEstateListing;
use App\Models\RealEstatePageContent;
use App\Support\SpamProtection;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class RealEstateController extends Controller
{
    public function index(Request $request)
    {
        $query = RealEstateListing::query()
            ->whereIn('status', ['active', 'sold'])
            ->orderByRaw("CASE WHEN status = 'active' THEN 0 ELSE 1 END")
            ->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('property_type', 'like', "%{$search}%")
                    ->orWhere('subdivision', 'like', "%{$search}%");
            });
        }

        return Inertia::render('real-estate', [
            'listings' => $query->paginate(12)->withQueryString(),
            'filters' => $request->only(['search']),
            'content' => RealEstatePageContent::singleton()->only(['heading', 'body', 'secondary_heading', 'secondary_body']),
        ]);
    }

    public function show(RealEstateListing $realEstateListing)
    {
        if ($realEstateListing->status === 'pending') {
            abort(404);
        }

        return Inertia::render('real-estate/show', [
            'listing' => $realEstateListing,
        ]);
    }

    public function store(Request $request)
    {
        if (filled($request->input('website'))) {
            return redirect()->route('real-estate')->with('success', 'Thanks! We will contact you shortly.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
            'captcha_token' => 'required|string',
            'captcha_answer' => 'required|string',
        ]);

        if (! SpamProtection::verify($validated['captcha_token'], $validated['captcha_answer'])) {
            throw ValidationException::withMessages([
                'captcha_answer' => 'Incorrect answer. Please try again.',
            ]);
        }

        ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'subject' => 'Real Estate Inquiry',
            'message' => $validated['message'],
        ]);

        return redirect()->route('real-estate')->with('success', 'Thanks! We will contact you shortly.');
    }

    public function storeInquiry(Request $request, RealEstateListing $realEstateListing)
    {
        if (filled($request->input('website'))) {
            return back()->with('success', 'Your message has been sent!');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:5000',
            'captcha_token' => 'required|string',
            'captcha_answer' => 'required|string',
        ]);

        if (! SpamProtection::verify($validated['captcha_token'], $validated['captcha_answer'])) {
            throw ValidationException::withMessages([
                'captcha_answer' => 'Incorrect answer. Please try again.',
            ]);
        }

        ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'subject' => "Property Inquiry: {$realEstateListing->title}",
            'message' => $validated['message'] . "\n\n— Property: {$realEstateListing->title} ({$realEstateListing->address}, {$realEstateListing->city})",
        ]);

        return back()->with('success', 'Your message has been sent! We will contact you shortly.');
    }
}
