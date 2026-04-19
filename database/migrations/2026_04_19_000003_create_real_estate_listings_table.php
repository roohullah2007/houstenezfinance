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
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->enum('listing_type', ['sale', 'rent'])->default('sale');
            $table->string('property_type');
            $table->string('state');
            $table->string('community');
            $table->string('address')->nullable();
            $table->decimal('price', 12, 2);
            $table->unsignedTinyInteger('bedrooms')->default(0);
            $table->decimal('bathrooms', 3, 1)->default(0);
            $table->unsignedInteger('square_feet')->nullable();
            $table->string('lot_size')->nullable();
            $table->unsignedSmallInteger('year_built')->nullable();
            $table->text('features')->nullable();
            $table->text('description')->nullable();
            $table->string('video_url', 500)->nullable();
            $table->json('images')->nullable();
            $table->unsignedInteger('main_image_index')->default(0);
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();

            $table->index(['status', 'listing_type']);
            $table->index('property_type');
            $table->index('community');
            $table->index('price');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('real_estate_listings');
    }
};
