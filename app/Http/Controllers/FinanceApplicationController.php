<?php

namespace App\Http\Controllers;

use App\Models\FinanceApplication;
use App\Support\OwnerNotifier;
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

        $fullName = trim("{$validated['first_name']} {$validated['last_name']}");
        $middleName = $validated['middle_name'] ?? null;
        if ($middleName) {
            $fullName = trim("{$validated['first_name']} {$middleName} {$validated['last_name']}");
        }

        OwnerNotifier::send(
            'Finance Application',
            $fullName,
            [
                // Applicant
                'Name' => $fullName,
                'Email' => $validated['email'],
                'Phone' => $validated['phone'],
                'Alternate Phone' => $validated['alt_phone'] ?? null,
                'Date of Birth' => $validated['date_of_birth'] ?? null,
                'SSN' => $validated['ssn'] ?? null,
                'Driver License #' => $validated['license_number'] ?? null,
                'License State' => $validated['license_state'] ?? null,
                'Marital Status' => $validated['marital_status'] ?? null,

                // Current residence
                'Current Address' => trim(($validated['current_address'] ?? '').', '.($validated['current_city'] ?? '').', '.($validated['current_state'] ?? '').' '.($validated['current_zip'] ?? ''), ', '),
                'Time at Current Address' => trim(($validated['current_years_at_address'] ?? 0).' yr '.($validated['current_months_at_address'] ?? 0).' mo'),
                'Housing Status' => $validated['housing_status'] ?? null,
                'Monthly Housing Payment' => $validated['monthly_housing_payment'] ?? null,

                // Previous residence
                'Previous Address' => trim(($validated['previous_address'] ?? '').', '.($validated['previous_city'] ?? '').', '.($validated['previous_state'] ?? '').' '.($validated['previous_zip'] ?? ''), ', '),

                // Employment
                'Employer' => $validated['employer_name'] ?? null,
                'Job Title' => $validated['job_title'] ?? null,
                'Employer Phone' => $validated['employer_phone'] ?? null,
                'Time Employed' => trim(($validated['years_employed'] ?? 0).' yr '.($validated['months_employed'] ?? 0).' mo'),
                'Monthly Income' => $validated['monthly_income'] ?? null,
                'Other Monthly Income' => $validated['other_monthly_income'] ?? null,
                'Other Income Source' => $validated['other_income_source'] ?? null,
                'Previous Employer' => $validated['previous_employer_name'] ?? null,
                'Previous Job Title' => $validated['previous_job_title'] ?? null,

                // Co-applicant
                'Has Co-Applicant' => $validated['has_co_applicant'] ? 'Yes' : 'No',
                'Co-Applicant Name' => trim(($validated['co_first_name'] ?? '').' '.($validated['co_last_name'] ?? '')),
                'Co-Applicant Relationship' => $validated['co_relationship'] ?? null,
                'Co-Applicant Email' => $validated['co_email'] ?? null,
                'Co-Applicant Phone' => $validated['co_phone'] ?? null,
                'Co-Applicant Date of Birth' => $validated['co_date_of_birth'] ?? null,
                'Co-Applicant SSN' => $validated['co_ssn'] ?? null,
                'Co-Applicant Employer' => $validated['co_employer_name'] ?? null,
                'Co-Applicant Monthly Income' => $validated['co_monthly_income'] ?? null,

                // Vehicle
                'Vehicle of Interest' => $validated['vehicle_of_interest'] ?? null,
                'Down Payment' => $validated['down_payment'] ?? null,
                'Trade-In Vehicle' => $validated['trade_in_vehicle'] ?? null,

                'Credit Check Authorized' => $validated['credit_check_authorized'] ? 'Yes' : 'No',
            ],
            $validated['email'],
        );

        return redirect()->route('finance-application')->with('success', 'Application submitted. We will review and contact you shortly.');
    }
}
