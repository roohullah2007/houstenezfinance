<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'images',
        'first_name',
        'last_name',
        'email',
        'phone',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'price' => 'decimal:2',
            'year' => 'integer',
            'miles' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
