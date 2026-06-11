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

        $listings = CarListing::where('user_id', $user->id)
            ->latest()
            ->get([
                'id', 'title', 'year', 'make', 'model', 'price', 'status',
                'payment_status', 'payment_amount', 'created_at',
            ]);

        return Inertia::render('user-dashboard', [
            'listings' => $listings,
        ]);
    }
}
