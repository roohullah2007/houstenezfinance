<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CarListingController extends Controller
{
    public function create()
    {
        return Inertia::render('sell-your-car');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'state' => 'required|string|max:100',
            'city' => 'required|string|max:100',
            'make' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'year' => 'required|integer|min:1900|max:2030',
            'price' => 'required|numeric|min:0',
            'miles' => 'required|integer|min:0',
            'exterior_color' => 'required|string|max:50',
            'interior_color' => 'required|string|max:50',
            'drive' => 'required|string|max:50',
            'vin' => 'nullable|string|max:17',
            'features' => 'nullable|string',
            'transmission' => 'required|string|max:50',
            'vehicle_type' => 'required|string|max:50',
            'description' => 'nullable|string',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'images.*' => 'image|max:5120',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('car-listings', 'public');
            }
        }

        $validated['images'] = $imagePaths;
        $validated['user_id'] = $request->user()?->id;
        $validated['status'] = 'pending';

        CarListing::create($validated);

        return redirect()->route('sell-your-car')->with('success', 'Your listing has been submitted for review!');
    }
}
