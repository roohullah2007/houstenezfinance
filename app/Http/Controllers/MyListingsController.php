<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyListingsController extends Controller
{
    public function index(Request $request)
    {
        $listings = CarListing::where('user_id', $request->user()->id)
            ->latest()
            ->get([
                'id', 'title', 'year', 'make', 'model', 'vehicle_type', 'price',
                'city', 'state', 'images', 'main_image_index', 'status',
                'payment_status', 'payment_amount', 'created_at',
            ]);

        return Inertia::render('my-listings', [
            'listings' => $listings,
        ]);
    }
}
