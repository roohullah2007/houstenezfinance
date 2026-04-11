<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingInquiry extends Model
{
    protected $fillable = [
        'car_listing_id',
        'name',
        'email',
        'phone',
        'message',
        'status',
    ];

    public function carListing(): BelongsTo
    {
        return $this->belongsTo(CarListing::class);
    }
}
