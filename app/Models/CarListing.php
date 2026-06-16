<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class CarListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
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
        'paypal_order_id',
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

    public static function boot(): void
    {
        parent::boot();

        static::saving(function (self $listing) {
            if (empty($listing->slug)) {
                $listing->slug = static::uniqueSlug($listing->slugSource(), $listing->id);
            }
        });
    }

    protected function slugSource(): string
    {
        return trim("{$this->year} {$this->make} {$this->model} {$this->title}");
    }

    protected static function uniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $base = Str::slug($source) ?: 'listing';
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(ListingInquiry::class);
    }

    /**
     * Listings that count as submitted: free listings, or paid ones.
     * Listings still awaiting their listing-fee payment are excluded.
     */
    public function scopeSubmitted($query)
    {
        return $query->whereIn('payment_status', ['not_required', 'paid']);
    }
}
