<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use App\Models\RealEstateListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MyListingsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $type = $request->query('type', 'cars');
        if (! in_array($type, ['cars', 'properties'], true)) {
            $type = 'cars';
        }

        $carCount = CarListing::where('user_id', $user->id)->count();
        $propertyCount = RealEstateListing::where('user_id', $user->id)->count();

        $cars = $type === 'cars'
            ? CarListing::where('user_id', $user->id)
                ->latest()
                ->get([
                    'id', 'title', 'year', 'make', 'model', 'vehicle_type', 'price',
                    'city', 'state', 'images', 'main_image_index', 'status',
                    'payment_status', 'payment_amount', 'created_at',
                ])
            : collect();

        $properties = $type === 'properties'
            ? RealEstateListing::where('user_id', $user->id)
                ->latest()
                ->get([
                    'id', 'title', 'slug', 'property_type', 'listing_type', 'price',
                    'city', 'state', 'bedrooms', 'images', 'main_image_index',
                    'status', 'created_at',
                ])
            : collect();

        return Inertia::render('my-listings', [
            'type' => $type,
            'counts' => [
                'cars' => $carCount,
                'properties' => $propertyCount,
            ],
            'cars' => $cars,
            'properties' => $properties,
        ]);
    }
}
