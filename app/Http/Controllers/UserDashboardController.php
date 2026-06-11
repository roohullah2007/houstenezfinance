<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserDashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        $base = CarListing::where('user_id', $user->id);

        $stats = [
            'total' => (clone $base)->count(),
            'approved' => (clone $base)->where('status', 'approved')->count(),
            'pending' => (clone $base)->where('status', 'pending')->count(),
            'rejected' => (clone $base)->where('status', 'rejected')->count(),
        ];

        $listings = (clone $base)
            ->latest()
            ->get([
                'id', 'title', 'year', 'make', 'model', 'vehicle_type', 'price',
                'city', 'state', 'images', 'main_image_index', 'status',
                'payment_status', 'payment_amount', 'created_at',
            ]);

        return Inertia::render('user-dashboard', [
            'stats' => $stats,
            'listings' => $listings,
        ]);
    }
}
