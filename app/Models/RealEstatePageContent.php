<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RealEstatePageContent extends Model
{
    protected $fillable = [
        'heading',
        'body',
        'secondary_heading',
        'secondary_body',
    ];

    public static function singleton(): self
    {
        return static::query()->firstOrCreate(
            ['id' => 1],
            [
                'heading' => 'Houston First-Time Home Buying Assistance Programs & Grants',
                'body' => 'Explore programs, grants, and financing options available for first-time home buyers in the Houston area. Contact us below for personalized guidance.',
                'secondary_heading' => null,
                'secondary_body' => null,
            ]
        );
    }
}
