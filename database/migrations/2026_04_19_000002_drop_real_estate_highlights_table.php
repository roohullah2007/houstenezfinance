<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('real_estate_highlights');
    }

    public function down(): void
    {
        Schema::create('real_estate_highlights', function (Blueprint $table) {
            $table->id();
            $table->string('community');
            $table->string('image');
            $table->unsignedInteger('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->index(['is_active', 'display_order']);
        });
    }
};
