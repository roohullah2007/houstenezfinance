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
                'total' => CarListing::submitted()->count(),
                'pending' => CarListing::submitted()->where('status', 'pending')->count(),
                'approved' => CarListing::submitted()->where('status', 'approved')->count(),
                'rejected' => CarListing::submitted()->where('status', 'rejected')->count(),
            ],
            'recentListings' => CarListing::submitted()->latest()->take(5)->get(),
        ]);
    }
}
