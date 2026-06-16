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
            $body = $response->json() ?? [];

            // invalid_client means the client ID/secret are wrong for this
            // environment — e.g. sandbox credentials with paypal_environment=live.
            $message = ($body['error'] ?? null) === 'invalid_client'
                ? "PayPal rejected the API credentials (invalid_client): the client ID/secret do not belong to the configured '{$this->environment}' environment."
                : 'Unable to obtain PayPal access token: HTTP '.$response->status().' '.substr($response->body(), 0, 300);

            throw new PayPalApiException($response->status(), $body, $message);
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
            throw new PayPalApiException(
                $response->status(),
                $response->json() ?? [],
                'Unable to create PayPal order: HTTP '.$response->status().' '.substr($response->body(), 0, 500),
            );
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
        // The capture endpoint takes no parameters, but declaring a JSON
        // content-type with an empty body makes PayPal reject it as
        // MALFORMED_REQUEST_JSON — so send a well-formed empty object.
        $response = Http::withToken($this->accessToken())
            ->withHeaders(['Prefer' => 'return=representation'])
            ->acceptJson()
            ->withBody('{}', 'application/json')
            ->post("{$this->apiBase()}/v2/checkout/orders/{$orderId}/capture");

        if (! $response->successful()) {
            $body = $response->json() ?? [];

            // Idempotency: a retried capture of an already-captured order is a
            // success — fetch the order so the caller can verify the capture.
            if (($body['details'][0]['issue'] ?? null) === 'ORDER_ALREADY_CAPTURED') {
                return $this->getOrder($orderId);
            }

            throw new PayPalApiException(
                $response->status(),
                $body,
                'Unable to capture PayPal order: HTTP '.$response->status().' '.substr($response->body(), 0, 500),
            );
        }

        return $response->json();
    }

    public function getOrder(string $orderId): array
    {
        $response = Http::withToken($this->accessToken())
            ->acceptJson()
            ->get("{$this->apiBase()}/v2/checkout/orders/{$orderId}");

        if (! $response->successful()) {
            throw new PayPalApiException(
                $response->status(),
                $response->json() ?? [],
                'Unable to fetch PayPal order: HTTP '.$response->status().' '.substr($response->body(), 0, 500),
            );
        }

        return $response->json();
    }
}
