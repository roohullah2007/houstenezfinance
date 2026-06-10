<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use App\Models\SiteSetting;
use App\Support\PayPalClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SellYourCarPaymentController extends Controller
{
    public function show(string $token)
    {
        $listing = CarListing::where('payment_token', $token)
            ->where('payment_status', 'pending')
            ->firstOrFail();

        $clientId = SiteSetting::get('paypal_client_id');
        if (empty($clientId)) {
            abort(503, 'Payment is not configured.');
        }

        return Inertia::render('sell-your-car/payment', [
            'token' => $token,
            'paypal_client_id' => $clientId,
            'paypal_environment' => (string) SiteSetting::get('paypal_environment', 'sandbox'),
            'amount' => (float) $listing->payment_amount,
            'currency' => strtoupper((string) SiteSetting::get('currency', 'usd')),
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

    public function createOrder(Request $request, string $token)
    {
        $listing = CarListing::where('payment_token', $token)
            ->where('payment_status', 'pending')
            ->firstOrFail();

        $paypal = new PayPalClient;
        if (! $paypal->isConfigured()) {
            return response()->json(['error' => 'PayPal is not configured.'], 503);
        }

        try {
            $currency = (string) SiteSetting::get('currency', 'usd');
            $order = $paypal->createOrder(
                (float) $listing->payment_amount,
                $currency,
                "Listing fee: {$listing->year} {$listing->make} {$listing->model}",
                (string) $listing->id,
            );

            $listing->update(['paypal_order_id' => $order['id']]);

            return response()->json(['id' => $order['id']]);
        } catch (\Throwable $e) {
            Log::error('PayPal createOrder failed for listing '.$listing->id.': '.$e->getMessage());

            return response()->json(['error' => 'Could not start PayPal checkout.'], 502);
        }
    }

    public function capture(Request $request, string $token)
    {
        $listing = CarListing::where('payment_token', $token)->firstOrFail();

        // Idempotency: never re-capture an already-paid listing.
        if ($listing->payment_status === 'paid') {
            return response()->json(['status' => 'completed']);
        }

        $paypal = new PayPalClient;
        if (! $paypal->isConfigured()) {
            return response()->json(['error' => 'PayPal is not configured.'], 503);
        }

        // Only ever capture the order we created server-side for this listing.
        $orderId = $listing->paypal_order_id;
        if (empty($orderId)) {
            return response()->json(['error' => 'No PayPal order to capture.'], 422);
        }

        try {
            $result = $paypal->captureOrder((string) $orderId);

            $capture = $result['purchase_units'][0]['payments']['captures'][0] ?? [];
            $captureStatus = $capture['status'] ?? null;
            $capturedAmount = $capture['amount']['value'] ?? null;
            // PayPal echoes custom_id on the capture object, not the purchase unit.
            $customId = $capture['custom_id'] ?? null;

            $expectedAmount = number_format((float) $listing->payment_amount, 2, '.', '');

            // The capture must be COMPLETED, for the exact fee, on this listing's order.
            $isValid = $captureStatus === 'COMPLETED'
                && $capturedAmount === $expectedAmount
                && (string) $customId === (string) $listing->id;

            if ($isValid) {
                $listing->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                ]);

                return response()->json(['status' => 'completed']);
            }

            Log::warning('PayPal capture not valid for listing '.$listing->id.': status='.$captureStatus.', amount='.$capturedAmount.', expected='.$expectedAmount.', custom_id='.$customId);

            return response()->json(['error' => 'Payment not completed.'], 422);
        } catch (\Throwable $e) {
            Log::error('PayPal capture failed for listing '.$listing->id.': '.$e->getMessage());

            return response()->json(['error' => 'Could not verify PayPal payment.'], 502);
        }
    }

    public function thankYou()
    {
        return Inertia::render('sell-your-car/thank-you');
    }
}
