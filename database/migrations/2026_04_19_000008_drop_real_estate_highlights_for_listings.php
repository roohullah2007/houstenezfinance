<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('real_estate_highlights');
    }

    public function down(): void
    {
        // Intentionally empty — highlights superseded by full listings schema.
    }
};
