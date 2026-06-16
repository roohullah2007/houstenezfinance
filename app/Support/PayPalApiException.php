<?php

namespace App\Support;

class PayPalApiException extends \RuntimeException
{
    /**
     * @param  array<string, mixed>  $body  Decoded JSON body of the PayPal error response.
     */
    public function __construct(
        public readonly int $status,
        public readonly array $body,
        string $message,
    ) {
        parent::__construct($message);
    }

    /**
     * The first detail issue code from a v2 API error (e.g. INSTRUMENT_DECLINED),
     * or the OAuth error code (e.g. invalid_client).
     */
    public function issue(): ?string
    {
        return $this->body['details'][0]['issue']
            ?? $this->body['error']
            ?? null;
    }

    public function isInstrumentDeclined(): bool
    {
        return $this->issue() === 'INSTRUMENT_DECLINED';
    }

    public function isCredentialError(): bool
    {
        return $this->status === 401 || $this->issue() === 'invalid_client';
    }
}
