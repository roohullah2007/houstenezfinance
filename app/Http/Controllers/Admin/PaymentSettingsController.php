<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentSettingsController extends Controller
{
    public function edit()
    {
        $publishableKey = SiteSetting::get('stripe_publishable_key', '');
        $secretKeySet = (bool) SiteSetting::get('stripe_secret_key');
        $listingFee = (float) SiteSetting::get('listing_fee', 0);

        return Inertia::render('dashboard/payment-settings', [
            'settings' => [
                'stripe_test_mode' => (bool) SiteSetting::get('stripe_test_mode', true),
                'stripe_publishable_key' => $publishableKey,
                'stripe_secret_key_set' => $secretKeySet,
                'listing_fee' => $listingFee,
                'currency' => SiteSetting::get('currency', 'usd'),
                'payment_active' => $listingFee > 0 && ! empty($publishableKey) && $secretKeySet,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'stripe_test_mode' => 'boolean',
            'stripe_publishable_key' => 'nullable|string|max:255',
            'stripe_secret_key' => 'nullable|string|max:255',
            'listing_fee' => 'required|numeric|min:0|max:99999',
            'currency' => 'required|string|size:3',
        ]);

        SiteSetting::set('stripe_test_mode', $validated['stripe_test_mode'] ? '1' : '0');
        SiteSetting::set('stripe_publishable_key', $validated['stripe_publishable_key'] ?? '');
        if (! empty($validated['stripe_secret_key'])) {
            SiteSetting::set('stripe_secret_key', $validated['stripe_secret_key'], encrypt: true);
        }
        SiteSetting::set('listing_fee', (string) $validated['listing_fee']);
        SiteSetting::set('currency', strtolower($validated['currency']));

        // Keep legacy stripe_enabled in sync for backward compatibility.
        $secretKeySet = (bool) SiteSetting::get('stripe_secret_key');
        $active = ((float) $validated['listing_fee']) > 0
            && ! empty($validated['stripe_publishable_key'] ?? null)
            && $secretKeySet;
        SiteSetting::set('stripe_enabled', $active ? '1' : '0');

        return redirect()->route('admin.payment-settings.edit')->with('success', 'Payment settings saved.');
    }
}
