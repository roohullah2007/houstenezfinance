<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use App\Models\ListingInquiry;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    public function store(Request $request, CarListing $carListing)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:2000',
        ]);

        $carListing->inquiries()->create([
            ...$validated,
            'status' => 'new',
        ]);

        return back()->with('success', 'Your message has been sent! We will contact you shortly.');
    }
}
