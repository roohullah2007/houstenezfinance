<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('real_estate_page_contents', function (Blueprint $table) {
            $table->string('secondary_heading')->nullable()->after('body');
            $table->text('secondary_body')->nullable()->after('secondary_heading');
        });

        DB::table('real_estate_page_contents')->where('id', 1)->update([
            'secondary_heading' => 'Trusted Dealer Network',
            'secondary_body' => 'Shop with confidence from our verified dealer partners across Houston. Browse Listings Available for True In House Financing along with complete transparency for Buyers with Credit Problems or No Credit.',
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::table('real_estate_page_contents', function (Blueprint $table) {
            $table->dropColumn(['secondary_heading', 'secondary_body']);
        });
    }
};
