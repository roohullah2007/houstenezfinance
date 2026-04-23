<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ListingFeature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ListingFeatureController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/listing-features', [
            'features' => ListingFeature::ordered()->get(['id', 'name', 'sort_order', 'is_active']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:listing_features,name',
        ]);

        $nextOrder = ((int) ListingFeature::max('sort_order')) + 10;
        ListingFeature::create([
            'name' => trim($validated['name']),
            'sort_order' => $nextOrder,
            'is_active' => true,
        ]);

        return redirect()->route('admin.listing-features.index')->with('success', 'Feature added.');
    }

    public function update(Request $request, ListingFeature $listingFeature)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:100|unique:listing_features,name,' . $listingFeature->id,
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $listingFeature->update($validated);

        return redirect()->route('admin.listing-features.index')->with('success', 'Feature updated.');
    }

    public function destroy(ListingFeature $listingFeature)
    {
        $listingFeature->delete();
        return redirect()->route('admin.listing-features.index')->with('success', 'Feature deleted.');
    }
}
