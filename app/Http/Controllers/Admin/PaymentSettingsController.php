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
        $clientId = SiteSetting::get('paypal_client_id', '');
        $clientSecretSet = (bool) SiteSetting::get('paypal_client_secret');
        $listingFee = (float) SiteSetting::get('listing_fee', 0);

        return Inertia::render('dashboard/payment-settings', [
            'settings' => [
                'paypal_environment' => SiteSetting::get('paypal_environment', 'sandbox'),
                'paypal_client_id' => $clientId,
                'paypal_client_secret_set' => $clientSecretSet,
                'listing_fee' => $listingFee,
                'currency' => SiteSetting::get('currency', 'usd'),
                'payment_active' => $listingFee > 0 && ! empty($clientId) && $clientSecretSet,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'paypal_environment' => 'required|in:sandbox,live',
            'paypal_client_id' => 'nullable|string|max:255',
            'paypal_client_secret' => 'nullable|string|max:255',
            'listing_fee' => 'required|numeric|min:0|max:99999',
            'currency' => 'required|string|size:3',
        ]);

        SiteSetting::set('paypal_environment', $validated['paypal_environment']);
        SiteSetting::set('paypal_client_id', $validated['paypal_client_id'] ?? '');
        if (! empty($validated['paypal_client_secret'])) {
            SiteSetting::set('paypal_client_secret', $validated['paypal_client_secret'], encrypt: true);
        }
        SiteSetting::set('listing_fee', (string) $validated['listing_fee']);
        SiteSetting::set('currency', strtolower($validated['currency']));

        return redirect()->route('admin.payment-settings.edit')->with('success', 'Payment settings saved.');
    }
}
