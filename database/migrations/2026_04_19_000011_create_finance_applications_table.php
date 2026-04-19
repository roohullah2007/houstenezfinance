<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('finance_applications', function (Blueprint $table) {
            $table->id();

            // Applicant
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('email');
            $table->string('phone');
            $table->string('alt_phone')->nullable();
            $table->text('date_of_birth');
            $table->text('ssn');
            $table->text('license_number');
            $table->string('license_state', 2);
            $table->enum('marital_status', ['single','married','divorced','widowed','separated'])->default('single');

            // Current residence
            $table->string('current_address');
            $table->string('current_city');
            $table->string('current_state', 2);
            $table->string('current_zip', 10);
            $table->unsignedSmallInteger('current_years_at_address')->default(0);
            $table->unsignedSmallInteger('current_months_at_address')->default(0);
            $table->enum('housing_status', ['own','rent','other'])->default('rent');
            $table->decimal('monthly_housing_payment', 10, 2)->nullable();

            // Previous residence (optional)
            $table->string('previous_address')->nullable();
            $table->string('previous_city')->nullable();
            $table->string('previous_state', 2)->nullable();
            $table->string('previous_zip', 10)->nullable();

            // Current employment
            $table->string('employer_name')->nullable();
            $table->string('job_title')->nullable();
            $table->string('employer_phone')->nullable();
            $table->unsignedSmallInteger('years_employed')->default(0);
            $table->unsignedSmallInteger('months_employed')->default(0);
            $table->decimal('monthly_income', 12, 2)->nullable();
            $table->decimal('other_monthly_income', 12, 2)->nullable();
            $table->string('other_income_source')->nullable();

            // Previous employment (optional)
            $table->string('previous_employer_name')->nullable();
            $table->string('previous_job_title')->nullable();

            // Co-applicant (optional)
            $table->boolean('has_co_applicant')->default(false);
            $table->string('co_first_name')->nullable();
            $table->string('co_last_name')->nullable();
            $table->string('co_email')->nullable();
            $table->string('co_phone')->nullable();
            $table->text('co_date_of_birth')->nullable();
            $table->text('co_ssn')->nullable();
            $table->string('co_relationship')->nullable();
            $table->string('co_employer_name')->nullable();
            $table->decimal('co_monthly_income', 12, 2)->nullable();

            // Vehicle
            $table->string('vehicle_of_interest')->nullable();
            $table->decimal('down_payment', 12, 2)->nullable();
            $table->string('trade_in_vehicle')->nullable();

            // References
            $table->string('reference1_name')->nullable();
            $table->string('reference1_phone')->nullable();
            $table->string('reference1_relationship')->nullable();
            $table->string('reference2_name')->nullable();
            $table->string('reference2_phone')->nullable();
            $table->string('reference2_relationship')->nullable();

            // Consent / meta
            $table->boolean('credit_check_authorized')->default(false);
            $table->string('submitter_ip', 45)->nullable();
            $table->enum('status', ['new','reviewing','approved','declined'])->default('new');
            $table->text('admin_notes')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index('email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finance_applications');
    }
};
