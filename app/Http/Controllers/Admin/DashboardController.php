<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CarListing;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'total' => CarListing::count(),
                'pending' => CarListing::where('status', 'pending')->count(),
                'approved' => CarListing::where('status', 'approved')->count(),
                'rejected' => CarListing::where('status', 'rejected')->count(),
            ],
            'recentListings' => CarListing::latest()->take(5)->get(),
        ]);
    }
}
