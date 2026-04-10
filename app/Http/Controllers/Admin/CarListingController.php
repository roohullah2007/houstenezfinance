<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CarListingController extends Controller
{
    public function index(Request $request)
    {
        $query = CarListing::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('vin', 'like', "%{$search}%")
                  ->orWhere('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return Inertia::render('dashboard/car-listings', [
            'listings' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/car-listings/create');
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
            'status' => 'required|in:pending,approved,rejected',
            'images.*' => 'image|max:5120',
        ]);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('car-listings', 'public');
            }
        }

        $validated['images'] = $imagePaths;
        $validated['user_id'] = $request->user()->id;

        CarListing::create($validated);

        return redirect()->route('admin.car-listings.index')->with('success', 'Listing created successfully.');
    }

    public function show(CarListing $carListing)
    {
        return Inertia::render('dashboard/car-listings/show', [
            'listing' => $carListing,
        ]);
    }

    public function edit(CarListing $carListing)
    {
        return Inertia::render('dashboard/car-listings/edit', [
            'listing' => $carListing,
        ]);
    }

    public function update(Request $request, CarListing $carListing)
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
            'status' => 'required|in:pending,approved,rejected',
            'images.*' => 'image|max:5120',
        ]);

        if ($request->hasFile('images')) {
            // Delete old images
            if ($carListing->images) {
                foreach ($carListing->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('car-listings', 'public');
            }
            $validated['images'] = $imagePaths;
        } else {
            unset($validated['images']);
        }

        $carListing->update($validated);

        return redirect()->route('admin.car-listings.show', $carListing)->with('success', 'Listing updated.');
    }

    public function approve(CarListing $carListing)
    {
        $carListing->update(['status' => 'approved']);
        return back()->with('success', 'Listing approved successfully.');
    }

    public function reject(CarListing $carListing)
    {
        $carListing->update(['status' => 'rejected']);
        return back()->with('success', 'Listing rejected.');
    }

    public function destroy(CarListing $carListing)
    {
        if ($carListing->images) {
            foreach ($carListing->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }
        $carListing->delete();
        return redirect()->route('admin.car-listings.index')->with('success', 'Listing deleted.');
    }
}
