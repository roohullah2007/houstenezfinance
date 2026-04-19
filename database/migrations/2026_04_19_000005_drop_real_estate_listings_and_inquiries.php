<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('real_estate_inquiries');
        Schema::dropIfExists('real_estate_listings');
    }

    public function down(): void
    {
        // Intentionally empty — old schema superseded by simpler highlights + content system.
    }
};
