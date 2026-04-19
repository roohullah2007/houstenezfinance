<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinanceApplication extends Model
{
    protected $fillable = [
        'first_name','middle_name','last_name','email','phone','alt_phone',
        'date_of_birth','ssn','license_number','license_state','marital_status',
        'current_address','current_city','current_state','current_zip',
        'current_years_at_address','current_months_at_address',
        'housing_status','monthly_housing_payment',
        'previous_address','previous_city','previous_state','previous_zip',
        'employer_name','job_title','employer_phone',
        'years_employed','months_employed',
        'monthly_income','other_monthly_income','other_income_source',
        'previous_employer_name','previous_job_title',
        'has_co_applicant','co_first_name','co_last_name','co_email','co_phone',
        'co_date_of_birth','co_ssn','co_relationship',
        'co_employer_name','co_monthly_income',
        'vehicle_of_interest','down_payment','trade_in_vehicle',
        'reference1_name','reference1_phone','reference1_relationship',
        'reference2_name','reference2_phone','reference2_relationship',
        'credit_check_authorized','submitter_ip','status','admin_notes',
    ];

    protected function casts(): array
    {
        return [
            // Sensitive PII — encrypted at rest via Laravel's APP_KEY.
            'date_of_birth' => 'encrypted',
            'ssn' => 'encrypted',
            'license_number' => 'encrypted',
            'co_date_of_birth' => 'encrypted',
            'co_ssn' => 'encrypted',

            'has_co_applicant' => 'boolean',
            'credit_check_authorized' => 'boolean',
            'monthly_housing_payment' => 'decimal:2',
            'monthly_income' => 'decimal:2',
            'other_monthly_income' => 'decimal:2',
            'co_monthly_income' => 'decimal:2',
            'down_payment' => 'decimal:2',
        ];
    }

    public function maskedSsn(): string
    {
        $s = $this->ssn ?? '';
        $digits = preg_replace('/\D/', '', $s);
        if (strlen($digits) < 4) return '••••';
        return 'XXX-XX-' . substr($digits, -4);
    }

    public function fullName(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}
