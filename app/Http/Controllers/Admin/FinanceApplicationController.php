<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FinanceApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinanceApplicationController extends Controller
{
    public function index(Request $request)
    {
        $query = FinanceApplication::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('current_city', 'like', "%{$search}%");
            });
        }

        $paginated = $query->paginate(20)->withQueryString();

        // Scrub sensitive fields from the list view.
        $paginated->getCollection()->transform(function (FinanceApplication $app) {
            return [
                'id' => $app->id,
                'first_name' => $app->first_name,
                'last_name' => $app->last_name,
                'email' => $app->email,
                'phone' => $app->phone,
                'current_city' => $app->current_city,
                'current_state' => $app->current_state,
                'monthly_income' => $app->monthly_income,
                'status' => $app->status,
                'created_at' => $app->created_at,
                'vehicle_of_interest' => $app->vehicle_of_interest,
            ];
        });

        return Inertia::render('dashboard/finance-applications', [
            'applications' => $paginated,
            'filters' => $request->only(['status', 'search']),
            'counts' => [
                'new' => FinanceApplication::where('status', 'new')->count(),
                'reviewing' => FinanceApplication::where('status', 'reviewing')->count(),
                'approved' => FinanceApplication::where('status', 'approved')->count(),
                'declined' => FinanceApplication::where('status', 'declined')->count(),
            ],
        ]);
    }

    public function show(Request $request, FinanceApplication $financeApplication)
    {
        $reveal = $request->boolean('reveal');

        $payload = $financeApplication->toArray();
        if (! $reveal) {
            $payload['ssn'] = $financeApplication->maskedSsn();
            $payload['license_number'] = 'REDACTED';
            $payload['date_of_birth'] = 'REDACTED';
            if ($financeApplication->has_co_applicant) {
                $payload['co_ssn'] = '••••';
                $payload['co_date_of_birth'] = 'REDACTED';
            }
        }

        return Inertia::render('dashboard/finance-applications/show', [
            'application' => $payload,
            'revealed' => $reveal,
        ]);
    }

    public function updateStatus(Request $request, FinanceApplication $financeApplication)
    {
        $validated = $request->validate([
            'status' => 'required|in:new,reviewing,approved,declined',
            'admin_notes' => 'nullable|string|max:5000',
        ]);

        $financeApplication->update($validated);

        return back()->with('success', 'Application updated.');
    }

    public function destroy(FinanceApplication $financeApplication)
    {
        $financeApplication->delete();
        return redirect()->route('admin.finance-applications.index')->with('success', 'Application deleted.');
    }
}
