<?php

namespace App\Http\Controllers;

use App\Models\ListingInquiry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyInquiriesController extends Controller
{
    public function index(Request $request)
    {
        $inquiries = ListingInquiry::whereHas('carListing', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })
            ->with('carListing:id,title,year,make,model')
            ->latest()
            ->get(['id', 'car_listing_id', 'name', 'email', 'phone', 'message', 'created_at']);

        return Inertia::render('my-inquiries', [
            'inquiries' => $inquiries,
        ]);
    }
}
