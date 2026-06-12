<?php

namespace App\Support;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Http;

class PayPalClient
{
    protected string $environment;

    protected string $clientId;

    protected string $clientSecret;

    public function __construct()
    {
        $this->environment = (string) SiteSetting::get('paypal_environment', 'sandbox');
        $this->clientId = (string) SiteSetting::get('paypal_client_id', '');
        $this->clientSecret = (string) SiteSetting::get('paypal_client_secret', '');
    }

    public function isConfigured(): bool
    {
        return $this->clientId !== '' && $this->clientSecret !== '';
    }

    public function apiBase(): string
    {
        return $this->environment === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    public function accessToken(): string
    {
        $response = Http::asForm()
            ->withBasicAuth($this->clientId, $this->clientSecret)
            ->post("{$this->apiBase()}/v1/oauth2/token", [
                'grant_type' => 'client_credentials',
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException('Unable to obtain PayPal access token: HTTP '.$response->status().' '.substr($response->body(), 0, 300));
        }

        $token = $response->json('access_token');

        if (empty($token)) {
            throw new \RuntimeException('PayPal access token missing from response.');
        }

        return (string) $token;
    }

    public function createOrder(float $amount, string $currency, string $description, string $customId): array
    {
        $response = Http::withToken($this->accessToken())
            ->withHeaders(['Prefer' => 'return=representation'])
            ->acceptJson()
            ->post("{$this->apiBase()}/v2/checkout/orders", [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'custom_id' => $customId,
                        'description' => $description,
                        'amount' => [
                            'currency_code' => strtoupper($currency),
                            'value' => number_format($amount, 2, '.', ''),
                        ],
                    ],
                ],
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException('Unable to create PayPal order: HTTP '.$response->status().' '.substr($response->body(), 0, 500));
        }

        $order = $response->json();

        if (empty($order['id'])) {
            throw new \RuntimeException('PayPal order id missing from response.');
        }

        return $order;
    }

    public function captureOrder(string $orderId): array
    {
        // return=representation guarantees the response includes
        // purchase_units[].payments.captures[] used for verification.
        $response = Http::withToken($this->accessToken())
            ->withHeaders(['Content-Type' => 'application/json', 'Prefer' => 'return=representation'])
            ->acceptJson()
            ->post("{$this->apiBase()}/v2/checkout/orders/{$orderId}/capture");

        if (! $response->successful()) {
            throw new \RuntimeException('Unable to capture PayPal order: HTTP '.$response->status().' '.substr($response->body(), 0, 500));
        }

        return $response->json();
    }
}
