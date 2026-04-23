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
        return Inertia::render('dashboard/payment-settings', [
            'settings' => [
                'stripe_enabled' => (bool) SiteSetting::get('stripe_enabled', false),
                'stripe_test_mode' => (bool) SiteSetting::get('stripe_test_mode', true),
                'stripe_publishable_key' => SiteSetting::get('stripe_publishable_key', ''),
                'stripe_secret_key_set' => (bool) SiteSetting::get('stripe_secret_key'),
                'listing_fee' => (float) SiteSetting::get('listing_fee', 0),
                'currency' => SiteSetting::get('currency', 'usd'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'stripe_enabled' => 'boolean',
            'stripe_test_mode' => 'boolean',
            'stripe_publishable_key' => 'nullable|string|max:255',
            'stripe_secret_key' => 'nullable|string|max:255',
            'listing_fee' => 'required|numeric|min:0|max:99999',
            'currency' => 'required|string|size:3',
        ]);

        SiteSetting::set('stripe_enabled', $validated['stripe_enabled'] ? '1' : '0');
        SiteSetting::set('stripe_test_mode', $validated['stripe_test_mode'] ? '1' : '0');
        SiteSetting::set('stripe_publishable_key', $validated['stripe_publishable_key'] ?? '');
        if (! empty($validated['stripe_secret_key'])) {
            SiteSetting::set('stripe_secret_key', $validated['stripe_secret_key'], encrypt: true);
        }
        SiteSetting::set('listing_fee', (string) $validated['listing_fee']);
        SiteSetting::set('currency', strtolower($validated['currency']));

        return redirect()->route('admin.payment-settings.edit')->with('success', 'Payment settings saved.');
    }
}
