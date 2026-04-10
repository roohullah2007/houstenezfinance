<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('state');
            $table->string('city');
            $table->string('make');
            $table->string('model');
            $table->unsignedSmallInteger('year');
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('miles');
            $table->string('exterior_color');
            $table->string('interior_color');
            $table->string('drive');
            $table->string('vin')->nullable();
            $table->text('features')->nullable();
            $table->string('transmission');
            $table->string('vehicle_type');
            $table->text('description')->nullable();
            $table->json('images')->nullable();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone');
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('car_listings');
    }
};
