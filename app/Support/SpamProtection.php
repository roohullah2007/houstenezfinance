<?php

namespace App\Support;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class SpamProtection
{
    public static function challenge(): array
    {
        $a = random_int(2, 9);
        $b = random_int(2, 9);
        $token = (string) Str::uuid();

        Cache::put(self::cacheKey($token), (string) ($a + $b), now()->addMinutes(30));

        return [
            'token' => $token,
            'question' => "What is {$a} + {$b}?",
        ];
    }

    public static function verify(?string $token, ?string $answer): bool
    {
        if (! $token || ! $answer) {
            return false;
        }

        $expected = Cache::pull(self::cacheKey($token));

        return $expected !== null && trim($answer) === $expected;
    }

    protected static function cacheKey(string $token): string
    {
        return "spam_captcha:{$token}";
    }
}
