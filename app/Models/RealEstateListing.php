<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class RealEstateListing extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'developer',
        'property_type',
        'listing_type',
        'price',
        'address',
        'city',
        'state',
        'zip',
        'subdivision',
        'latitude',
        'longitude',
        'bedrooms',
        'full_bathrooms',
        'half_bathrooms',
        'square_feet',
        'lot_size',
        'year_built',
        'description',
        'features',
        'images',
        'main_image_index',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'features' => 'array',
            'images' => 'array',
            'price' => 'decimal:2',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'bedrooms' => 'integer',
            'full_bathrooms' => 'integer',
            'half_bathrooms' => 'integer',
            'square_feet' => 'integer',
            'lot_size' => 'integer',
            'year_built' => 'integer',
            'main_image_index' => 'integer',
        ];
    }

    public static function boot(): void
    {
        parent::boot();

        static::saving(function (self $listing) {
            if (empty($listing->slug) || $listing->isDirty('title')) {
                $listing->slug = static::uniqueSlug($listing->title, $listing->id);
            }
        });
    }

    protected static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'listing';
        $slug = $base;
        $i = 2;

        while (static::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    public function getBathroomsDisplayAttribute(): string
    {
        if ($this->half_bathrooms > 0) {
            return "{$this->full_bathrooms}.5";
        }
        return (string) $this->full_bathrooms;
    }

    public function getMainImageAttribute(): ?string
    {
        $images = $this->images ?? [];
        if (empty($images)) {
            return null;
        }
        return $images[$this->main_image_index] ?? $images[0] ?? null;
    }
}
