<?php

namespace App\Http\Controllers;

use App\Models\CarListing;
use App\Models\SiteSetting;
use App\Support\PayPalClient;
use Illuminate\Http\Request;
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

        $paypal = new PayPalClient();
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
        } catch (\Throwable) {
            return response()->json(['error' => 'Could not start PayPal checkout.'], 502);
        }
    }

    public function capture(Request $request, string $token)
    {
        $listing = CarListing::where('payment_token', $token)->firstOrFail();

        $orderId = $listing->paypal_order_id ?: $request->input('order_id');
        if (empty($orderId)) {
            return response()->json(['error' => 'Payment not completed.'], 422);
        }

        $paypal = new PayPalClient();

        try {
            $result = $paypal->captureOrder((string) $orderId);

            $topStatus = $result['status'] ?? null;
            $captureStatus = $result['purchase_units'][0]['payments']['captures'][0]['status'] ?? null;

            if ($topStatus === 'COMPLETED' || $captureStatus === 'COMPLETED') {
                $listing->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                ]);

                return response()->json(['status' => 'completed']);
            }

            return response()->json(['error' => 'Payment not completed.'], 422);
        } catch (\Throwable) {
            return response()->json(['error' => 'Could not verify PayPal payment.'], 502);
        }
    }

    public function thankYou()
    {
        return Inertia::render('sell-your-car/thank-you');
    }
}
