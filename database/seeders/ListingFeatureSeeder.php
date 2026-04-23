<?php

namespace Database\Seeders;

use App\Models\ListingFeature;
use Illuminate\Database\Seeder;

class ListingFeatureSeeder extends Seeder
{
    public function run(): void
    {
        $features = [
            'Leather Seats',
            'Heated Seats',
            'Cooled / Ventilated Seats',
            'Power Seats',
            'Memory Seats',
            'Sunroof / Moonroof',
            'Panoramic Roof',
            'Navigation System',
            'Backup Camera',
            'Blind Spot Monitor',
            'Lane Departure Warning',
            'Adaptive Cruise Control',
            'Parking Sensors',
            '360 Camera',
            'Bluetooth',
            'Apple CarPlay',
            'Android Auto',
            'Premium Sound System',
            'Keyless Entry',
            'Push Button Start',
            'Remote Start',
            'Third Row Seating',
            'Tow Package',
            'Alloy Wheels',
            'LED Headlights',
            'Fog Lights',
            'Roof Rack',
            'Running Boards',
            'Heated Steering Wheel',
            'Power Liftgate',
            'Automatic Climate Control',
            'Dual-Zone Climate',
            'Rain Sensing Wipers',
            'Power Windows',
            'Power Locks',
        ];

        foreach ($features as $i => $name) {
            ListingFeature::updateOrCreate(
                ['name' => $name],
                ['sort_order' => $i * 10, 'is_active' => true]
            );
        }

        $this->command->info('Listing features seeded: ' . ListingFeature::count());
    }
}
