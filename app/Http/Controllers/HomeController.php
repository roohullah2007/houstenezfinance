<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index()
    {
        $approved = CarListing::where('status', 'approved');

        // Count approved listings grouped by vehicle_type
        $categoryCounts = (clone $approved)
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

        // Makes with models for hero search form
        $makesWithModels = (clone $approved)
            ->select('make', 'model')
            ->distinct()
            ->orderBy('make')
            ->orderBy('model')
            ->get()
            ->groupBy('make')
            ->map(fn ($rows) => $rows->pluck('model')->unique()->values()->all())
            ->toArray();

        // Distinct cities for Location dropdown
        $cities = (clone $approved)
            ->select('city', 'state')
            ->distinct()
            ->orderBy('city')
            ->get()
            ->map(fn ($r) => ['city' => $r->city, 'state' => $r->state, 'label' => "{$r->city}, {$r->state}"])
            ->values()
            ->toArray();

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'categories' => $categories,
            'searchOptions' => [
                'makes' => $makesWithModels,
                'cities' => $cities,
                'bodyTypes' => ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Van', 'Wagon', 'Crossover'],
                'transmissions' => ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'],
            ],
            'featuredListings' => (clone $approved)
                ->latest()
                ->take(8)
                ->get(),
        ]);
    }
}
