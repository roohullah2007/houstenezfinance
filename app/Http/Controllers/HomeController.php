<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index()
    {
        // Count approved listings grouped by vehicle_type
        $categoryCounts = CarListing::query()
            ->where('status', 'approved')
            ->selectRaw('vehicle_type, COUNT(*) as total')
            ->groupBy('vehicle_type')
            ->pluck('total', 'vehicle_type')
            ->toArray();

        // Ordered list of categories to show — always render these 5 even if count is 0
        $categories = [
            ['name' => 'Sedan',      'vehicle_type' => 'Sedan',       'icon' => 'Car'],
            ['name' => 'SUVs',       'vehicle_type' => 'SUV',         'icon' => 'CarFront'],
            ['name' => 'Coupe',      'vehicle_type' => 'Coupe',       'icon' => 'Car'],
            ['name' => 'Convertibles','vehicle_type' => 'Convertible','icon' => 'Caravan'],
            ['name' => 'Trucks',     'vehicle_type' => 'Truck',       'icon' => 'Bus'],
        ];

        $categories = array_map(function ($cat) use ($categoryCounts) {
            $cat['offers'] = $categoryCounts[$cat['vehicle_type']] ?? 0;
            return $cat;
        }, $categories);

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'categories' => $categories,
            'featuredListings' => CarListing::where('status', 'approved')
                ->latest()
                ->take(8)
                ->get(),
        ]);
    }
}
