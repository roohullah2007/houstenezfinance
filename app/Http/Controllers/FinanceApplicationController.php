<?php

namespace App\Http\Controllers;

use App\Models\FinanceApplication;
use App\Support\SpamProtection;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class FinanceApplicationController extends Controller
{
    public function create()
    {
        return Inertia::render('finance-application');
    }

    public function store(Request $request)
    {
        if (filled($request->input('website'))) {
            return redirect()->route('finance-application')->with('success', 'Application submitted. We will contact you shortly.');
        }

        $validated = $request->validate([
            // Applicant
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:30',
            'alt_phone' => 'nullable|string|max:30',
            'date_of_birth' => 'required|string|max:20',
            'ssn' => 'required|string|max:20',
            'license_number' => 'required|string|max:30',
            'license_state' => 'required|string|size:2',
            'marital_status' => 'required|in:single,married,divorced,widowed,separated',

            // Current residence
            'current_address' => 'required|string|max:255',
            'current_city' => 'required|string|max:100',
            'current_state' => 'required|string|size:2',
            'current_zip' => 'required|string|max:10',
            'current_years_at_address' => 'required|integer|min:0|max:99',
            'current_months_at_address' => 'required|integer|min:0|max:11',
            'housing_status' => 'required|in:own,rent,other',
            'monthly_housing_payment' => 'nullable|numeric|min:0',

            // Previous residence
            'previous_address' => 'nullable|string|max:255',
            'previous_city' => 'nullable|string|max:100',
            'previous_state' => 'nullable|string|size:2',
            'previous_zip' => 'nullable|string|max:10',

            // Employment
            'employer_name' => 'nullable|string|max:255',
            'job_title' => 'nullable|string|max:255',
            'employer_phone' => 'nullable|string|max:30',
            'years_employed' => 'required|integer|min:0|max:99',
            'months_employed' => 'required|integer|min:0|max:11',
            'monthly_income' => 'nullable|numeric|min:0',
            'other_monthly_income' => 'nullable|numeric|min:0',
            'other_income_source' => 'nullable|string|max:255',
            'previous_employer_name' => 'nullable|string|max:255',
            'previous_job_title' => 'nullable|string|max:255',

            // Co-applicant
            'has_co_applicant' => 'nullable|boolean',
            'co_first_name' => 'nullable|string|max:100',
            'co_last_name' => 'nullable|string|max:100',
            'co_email' => 'nullable|email|max:255',
            'co_phone' => 'nullable|string|max:30',
            'co_date_of_birth' => 'nullable|string|max:20',
            'co_ssn' => 'nullable|string|max:20',
            'co_relationship' => 'nullable|string|max:100',
            'co_employer_name' => 'nullable|string|max:255',
            'co_monthly_income' => 'nullable|numeric|min:0',

            // Vehicle
            'vehicle_of_interest' => 'nullable|string|max:255',
            'down_payment' => 'nullable|numeric|min:0',
            'trade_in_vehicle' => 'nullable|string|max:255',

            // References
            'reference1_name' => 'nullable|string|max:255',
            'reference1_phone' => 'nullable|string|max:30',
            'reference1_relationship' => 'nullable|string|max:100',
            'reference2_name' => 'nullable|string|max:255',
            'reference2_phone' => 'nullable|string|max:30',
            'reference2_relationship' => 'nullable|string|max:100',

            'credit_check_authorized' => 'accepted',
            'captcha_token' => 'required|string',
            'captcha_answer' => 'required|string',
        ]);

        if (! SpamProtection::verify($validated['captcha_token'], $validated['captcha_answer'])) {
            throw ValidationException::withMessages([
                'captcha_answer' => 'Incorrect answer. Please try again.',
            ]);
        }

        unset($validated['captcha_token'], $validated['captcha_answer']);

        $validated['has_co_applicant'] = filter_var($validated['has_co_applicant'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $validated['credit_check_authorized'] = filter_var($validated['credit_check_authorized'] ?? false, FILTER_VALIDATE_BOOLEAN);
        $validated['submitter_ip'] = $request->ip();
        $validated['status'] = 'new';

        FinanceApplication::create($validated);

        return redirect()->route('finance-application')->with('success', 'Application submitted. We will review and contact you shortly.');
    }
}
