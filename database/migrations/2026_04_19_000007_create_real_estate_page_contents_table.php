<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('real_estate_page_contents', function (Blueprint $table) {
            $table->id();
            $table->string('heading');
            $table->text('body')->nullable();
            $table->timestamps();
        });

        DB::table('real_estate_page_contents')->insert([
            'heading' => 'Houston First-Time Home Buying Assistance Programs & Grants',
            'body' => 'Explore programs, grants, and financing options available for first-time home buyers in the Houston area. Contact us below for personalized guidance.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('real_estate_page_contents');
    }
};
