<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CarListingController extends Controller
{
    public function index(Request $request)
    {
        $query = CarListing::query()->where('status', 'approved')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('make', 'like', "%{$search}%")
                  ->orWhere('model', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%")
                  ->orWhere('state', 'like', "%{$search}%");
            });
        }

        if ($request->filled('vehicle_type')) {
            $query->where('vehicle_type', $request->vehicle_type);
        }

        if ($request->filled('make')) {
            $query->where('make', $request->make);
        }

        if ($request->filled('model')) {
            $query->where('model', $request->model);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', (float) $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', (float) $request->max_price);
        }

        if ($request->filled('min_year')) {
            $query->where('year', '>=', (int) $request->min_year);
        }

        if ($request->filled('max_year')) {
            $query->where('year', '<=', (int) $request->max_year);
        }

        if ($request->filled('transmission')) {
            $query->where('transmission', $request->transmission);
        }

        // Build filter metadata for dropdown population
        $approved = CarListing::where('status', 'approved');
        $yearBounds = (clone $approved)->selectRaw('MIN(year) as min, MAX(year) as max')->first();

        $makesWithModels = (clone $approved)
            ->select('make', 'model')
            ->distinct()
            ->orderBy('make')
            ->orderBy('model')
            ->get()
            ->groupBy('make')
            ->map(fn ($rows) => $rows->pluck('model')->unique()->values()->all())
            ->toArray();

        return Inertia::render('car-listings', [
            'listings' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only([
                'search', 'vehicle_type', 'make', 'model',
                'min_price', 'max_price', 'min_year', 'max_year', 'transmission',
            ]),
            'filterMeta' => [
                'priceMin' => 0,
                'priceMax' => 2000000,
                'yearMin' => (int) ($yearBounds->min ?? 2000),
                'yearMax' => (int) ($yearBounds->max ?? 2026),
                'makes' => $makesWithModels,
            ],
        ]);
    }

    public function show(CarListing $carListing)
    {
        if ($carListing->status !== 'approved') {
            abort(404);
        }

        return Inertia::render('car-listings/show', [
            'listing' => $carListing,
        ]);
    }

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
        $validated['main_image_index'] = 0;
        $validated['user_id'] = $request->user()?->id;
        $validated['status'] = 'pending';

        CarListing::create($validated);

        return redirect()->route('sell-your-car')->with('success', 'Your listing has been submitted for review!');
    }
}
