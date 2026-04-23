<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CarListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'state',
        'city',
        'make',
        'model',
        'year',
        'price',
        'miles',
        'exterior_color',
        'interior_color',
        'drive',
        'vin',
        'features',
        'transmission',
        'vehicle_type',
        'description',
        'video_url',
        'images',
        'main_image_index',
        'first_name',
        'last_name',
        'email',
        'phone',
        'status',
        'payment_token',
        'payment_status',
        'stripe_payment_intent_id',
        'payment_amount',
        'paid_at',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'price' => 'decimal:2',
            'year' => 'integer',
            'miles' => 'integer',
            'main_image_index' => 'integer',
            'payment_amount' => 'decimal:2',
            'paid_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(ListingInquiry::class);
    }
}
