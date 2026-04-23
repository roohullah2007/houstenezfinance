<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('car_listings', function (Blueprint $table) {
            $table->string('payment_token', 64)->nullable()->unique()->after('status');
            $table->enum('payment_status', ['not_required', 'pending', 'paid', 'failed'])->default('not_required')->after('payment_token');
            $table->string('stripe_payment_intent_id')->nullable()->after('payment_status');
            $table->decimal('payment_amount', 10, 2)->nullable()->after('stripe_payment_intent_id');
            $table->timestamp('paid_at')->nullable()->after('payment_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('car_listings', function (Blueprint $table) {
            $table->dropColumn(['payment_token', 'payment_status', 'stripe_payment_intent_id', 'payment_amount', 'paid_at']);
        });
    }
};
