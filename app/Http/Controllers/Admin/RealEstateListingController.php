<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RealEstateListing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RealEstateListingController extends Controller
{
    public function index(Request $request)
    {
        $query = RealEstateListing::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

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

        return Inertia::render('dashboard/real-estate-listings', [
            'listings' => $query->paginate(15)->withQueryString(),
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/real-estate-listings/create');
    }

    public function store(Request $request)
    {
        $validated = $this->validated($request);

        $imagePaths = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('real-estate-listings', 'public');
            }
        }

        $validated['images'] = $imagePaths;
        $validated['main_image_index'] = (int) ($validated['main_image_index'] ?? 0);
        $validated['features'] = $this->normalizeFeatures($request->input('features'));

        RealEstateListing::create($validated);

        return redirect()->route('admin.real-estate-listings.index')->with('success', 'Property listing created.');
    }

    public function show(RealEstateListing $realEstateListing)
    {
        return Inertia::render('dashboard/real-estate-listings/show', [
            'listing' => $realEstateListing,
        ]);
    }

    public function edit(RealEstateListing $realEstateListing)
    {
        return Inertia::render('dashboard/real-estate-listings/edit', [
            'listing' => $realEstateListing,
        ]);
    }

    public function update(Request $request, RealEstateListing $realEstateListing)
    {
        $validated = $this->validated($request);

        if ($request->hasFile('images')) {
            if ($realEstateListing->images) {
                foreach ($realEstateListing->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
            $imagePaths = [];
            foreach ($request->file('images') as $image) {
                $imagePaths[] = $image->store('real-estate-listings', 'public');
            }
            $validated['images'] = $imagePaths;
        } else {
            unset($validated['images']);
        }

        $validated['main_image_index'] = (int) ($validated['main_image_index'] ?? 0);
        $validated['features'] = $this->normalizeFeatures($request->input('features'));

        $realEstateListing->update($validated);

        return redirect()->route('admin.real-estate-listings.show', $realEstateListing)->with('success', 'Listing updated.');
    }

    public function destroy(RealEstateListing $realEstateListing)
    {
        if ($realEstateListing->images) {
            foreach ($realEstateListing->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }
        $realEstateListing->delete();

        return redirect()->route('admin.real-estate-listings.index')->with('success', 'Listing deleted.');
    }

    public function markSold(RealEstateListing $realEstateListing)
    {
        $realEstateListing->update(['status' => 'sold']);
        return back()->with('success', 'Listing marked as sold.');
    }

    public function markActive(RealEstateListing $realEstateListing)
    {
        $realEstateListing->update(['status' => 'active']);
        return back()->with('success', 'Listing is now active.');
    }

    protected function validated(Request $request): array
    {
        return $request->validate([
            'title' => 'required|string|max:255',
            'developer' => 'nullable|string|max:255',
            'property_type' => 'required|string|max:100',
            'listing_type' => 'required|in:sale,rent',
            'price' => 'required|numeric|min:0',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'zip' => 'required|string|max:10',
            'subdivision' => 'nullable|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'bedrooms' => 'required|integer|min:0|max:20',
            'full_bathrooms' => 'required|integer|min:0|max:20',
            'half_bathrooms' => 'nullable|integer|min:0|max:20',
            'square_feet' => 'nullable|integer|min:0',
            'lot_size' => 'nullable|integer|min:0',
            'year_built' => 'nullable|integer|min:1800|max:2030',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,active,sold',
            'main_image_index' => 'nullable|integer|min:0',
            'images.*' => 'image|max:5120',
        ]);
    }

    protected function normalizeFeatures(mixed $features): array
    {
        if (is_string($features)) {
            $decoded = json_decode($features, true);
            return is_array($decoded) ? array_values(array_filter($decoded, 'is_string')) : [];
        }

        if (is_array($features)) {
            return array_values(array_filter($features, 'is_string'));
        }

        return [];
    }
}
