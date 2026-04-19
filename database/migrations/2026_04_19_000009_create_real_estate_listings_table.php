<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('real_estate_listings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('developer')->nullable();
            $table->string('property_type');
            $table->enum('listing_type', ['sale', 'rent'])->default('sale');
            $table->decimal('price', 12, 2);
            $table->string('address');
            $table->string('city');
            $table->string('state');
            $table->string('zip', 10);
            $table->string('subdivision')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->unsignedTinyInteger('bedrooms')->default(0);
            $table->unsignedTinyInteger('full_bathrooms')->default(0);
            $table->unsignedTinyInteger('half_bathrooms')->default(0);
            $table->unsignedInteger('square_feet')->nullable();
            $table->unsignedInteger('lot_size')->nullable();
            $table->unsignedSmallInteger('year_built')->nullable();
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->json('images')->nullable();
            $table->unsignedInteger('main_image_index')->default(0);
            $table->enum('status', ['pending', 'active', 'sold'])->default('active');
            $table->timestamps();

            $table->index(['status', 'listing_type']);
            $table->index('property_type');
            $table->index('city');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('real_estate_listings');
    }
};
