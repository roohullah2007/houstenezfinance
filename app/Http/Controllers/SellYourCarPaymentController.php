<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\StripeClient;

class SellYourCarPaymentController extends Controller
{
    public function show(string $token)
    {
        $listing = CarListing::where('payment_token', $token)
            ->where('payment_status', 'pending')
            ->firstOrFail();

        $publishableKey = SiteSetting::get('stripe_publishable_key');
        if (empty($publishableKey)) {
            abort(503, 'Payment is not configured.');
        }

        return Inertia::render('sell-your-car/payment', [
            'token' => $token,
            'publishable_key' => $publishableKey,
            'amount' => (float) $listing->payment_amount,
            'currency' => strtolower((string) SiteSetting::get('currency', 'usd')),
            'listing' => [
                'title' => $listing->title,
                'year' => $listing->year,
                'make' => $listing->make,
                'model' => $listing->model,
                'first_name' => $listing->first_name,
                'last_name' => $listing->last_name,
                'email' => $listing->email,
            ],
        ]);
    }

    public function createIntent(Request $request, string $token)
    {
        $listing = CarListing::where('payment_token', $token)
            ->where('payment_status', 'pending')
            ->firstOrFail();

        $secret = SiteSetting::get('stripe_secret_key');
        if (empty($secret)) {
            return response()->json(['error' => 'Stripe is not configured.'], 503);
        }

        $stripe = new StripeClient($secret);
        $currency = strtolower((string) SiteSetting::get('currency', 'usd'));
        $amountCents = (int) round(((float) $listing->payment_amount) * 100);

        if ($listing->stripe_payment_intent_id) {
            try {
                $intent = $stripe->paymentIntents->retrieve($listing->stripe_payment_intent_id);
                if (in_array($intent->status, ['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing'], true)) {
                    return response()->json(['client_secret' => $intent->client_secret]);
                }
            } catch (\Throwable) {
            }
        }

        $intent = $stripe->paymentIntents->create([
            'amount' => $amountCents,
            'currency' => $currency,
            'description' => "Listing fee: {$listing->year} {$listing->make} {$listing->model}",
            'receipt_email' => $listing->email,
            'metadata' => [
                'car_listing_id' => $listing->id,
                'payment_token' => $token,
            ],
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        $listing->update([
            'stripe_payment_intent_id' => $intent->id,
        ]);

        return response()->json(['client_secret' => $intent->client_secret]);
    }

    public function confirm(Request $request, string $token)
    {
        $listing = CarListing::where('payment_token', $token)->firstOrFail();

        $secret = SiteSetting::get('stripe_secret_key');
        if (empty($secret) || empty($listing->stripe_payment_intent_id)) {
            return redirect()->route('sell-your-car.payment', ['token' => $token])
                ->withErrors(['payment' => 'Payment could not be verified.']);
        }

        $stripe = new StripeClient($secret);
        $intent = $stripe->paymentIntents->retrieve($listing->stripe_payment_intent_id);

        if ($intent->status === 'succeeded') {
            $listing->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
            ]);
            return redirect()->route('sell-your-car.thank-you');
        }

        return redirect()->route('sell-your-car.payment', ['token' => $token])
            ->withErrors(['payment' => 'Payment not complete. Status: ' . $intent->status]);
    }

    public function thankYou()
    {
        return Inertia::render('sell-your-car/thank-you');
    }
}
