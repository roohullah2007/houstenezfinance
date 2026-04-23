<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;

class SiteSetting extends Model
{
    protected $fillable = ['key', 'value', 'is_encrypted'];

    protected function casts(): array
    {
        return [
            'is_encrypted' => 'boolean',
        ];
    }

    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::rememberForever("site_setting:{$key}", function () use ($key, $default) {
            $row = static::where('key', $key)->first();
            if (! $row) {
                return $default;
            }
            if ($row->is_encrypted && $row->value) {
                try {
                    return Crypt::decryptString($row->value);
                } catch (\Throwable) {
                    return $default;
                }
            }
            return $row->value ?? $default;
        });
    }

    public static function set(string $key, mixed $value, bool $encrypt = false): void
    {
        $stored = $encrypt && $value !== null && $value !== ''
            ? Crypt::encryptString((string) $value)
            : $value;

        static::updateOrCreate(
            ['key' => $key],
            ['value' => $stored, 'is_encrypted' => $encrypt]
        );

        Cache::forget("site_setting:{$key}");
    }

    public static function forget(string $key): void
    {
        static::where('key', $key)->delete();
        Cache::forget("site_setting:{$key}");
    }
}
