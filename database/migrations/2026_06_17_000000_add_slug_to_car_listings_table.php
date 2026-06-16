<?php

use App\Models\CarListing;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('car_listings', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('title');
        });

        // Backfill slugs for existing rows, guaranteeing uniqueness the same way
        // the model does (base slug, then -2, -3, ... on collision).
        $used = [];

        CarListing::query()->orderBy('id')->each(function (CarListing $listing) use (&$used) {
            $base = Str::slug(trim("{$listing->year} {$listing->make} {$listing->model} {$listing->title}")) ?: 'listing';
            $slug = $base;
            $i = 2;

            while (isset($used[$slug])) {
                $slug = "{$base}-{$i}";
                $i++;
            }

            $used[$slug] = true;

            $listing->slug = $slug;
            $listing->saveQuietly();
        });
    }

    public function down(): void
    {
        Schema::table('car_listings', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
