<?php

namespace Database\Seeders;

use App\Models\RealEstateListing;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class RealEstateListingSeeder extends Seeder
{
    public function run(): void
    {
        $defaultFeatures = ['Central AC', 'Central Heat', 'Hardwood Floors', 'Updated Kitchen', 'Fenced Yard'];

        $items = [
            [
                'title' => 'Spacious Family Home in Katy',
                'property_type' => 'Single Family',
                'listing_type' => 'sale',
                'price' => 425000,
                'address' => '1823 Prairie View Drive',
                'city' => 'Katy',
                'state' => 'Texas',
                'zip' => '77494',
                'subdivision' => 'Cinco Ranch',
                'bedrooms' => 4, 'full_bathrooms' => 2, 'half_bathrooms' => 1,
                'square_feet' => 2450, 'lot_size' => 7200, 'year_built' => 2015,
                'description' => "Bright, open floor plan with an updated kitchen and plenty of natural light. Walking distance to award-winning schools and neighborhood parks.\n\nFeatures include granite countertops, stainless steel appliances, and a spacious backyard perfect for entertaining.",
                'features' => array_merge($defaultFeatures, ['Granite Countertops', 'Stainless Steel Appliances', 'Covered Patio', 'Walk-In Closet']),
                'photo' => '1564013799919-ab600027ffc6',
                'latitude' => 29.7858, 'longitude' => -95.8245,
            ],
            [
                'title' => 'Modern Townhouse in Sugar Land',
                'property_type' => 'Townhouse',
                'listing_type' => 'sale',
                'price' => 329000,
                'address' => '542 Greenway Plaza',
                'city' => 'Sugar Land',
                'state' => 'Texas',
                'zip' => '77478',
                'subdivision' => 'Greatwood',
                'bedrooms' => 3, 'full_bathrooms' => 2, 'half_bathrooms' => 1,
                'square_feet' => 1850, 'lot_size' => 2500, 'year_built' => 2019,
                'description' => 'Gated community townhouse with a two-car garage and private courtyard. Easy commute to the Energy Corridor.',
                'features' => array_merge($defaultFeatures, ['Garage', 'Tile Floors', 'Balcony']),
                'photo' => '1605146769289-440113cc3d00',
                'latitude' => 29.6196, 'longitude' => -95.6349,
            ],
            [
                'title' => 'Luxury Home in The Woodlands',
                'property_type' => 'Single Family',
                'listing_type' => 'sale',
                'price' => 875000,
                'address' => '8102 Sterling Oak Way',
                'city' => 'The Woodlands',
                'state' => 'Texas',
                'zip' => '77381',
                'subdivision' => 'Grogan\'s Forest',
                'bedrooms' => 5, 'full_bathrooms' => 3, 'half_bathrooms' => 1,
                'square_feet' => 3850, 'lot_size' => 9800, 'year_built' => 2017,
                'description' => "Custom home on a wooded lot with a heated pool, hot tub, and outdoor kitchen. Chef's kitchen with a large island, gas range, and butler's pantry.",
                'features' => array_merge($defaultFeatures, ['Swimming Pool', 'Hot Tub', 'Garage', 'Fireplace', 'Mature Trees', 'Security System', 'Updated Bathroom']),
                'photo' => '1512917774080-9991f1c4c750',
                'latitude' => 30.1656, 'longitude' => -95.4615,
            ],
            [
                'title' => 'Cozy Starter Home in Pearland',
                'property_type' => 'Single Family',
                'listing_type' => 'sale',
                'price' => 269000,
                'address' => '3316 Magnolia Lane',
                'city' => 'Pearland',
                'state' => 'Texas',
                'zip' => '77581',
                'subdivision' => 'Silverlake',
                'bedrooms' => 3, 'full_bathrooms' => 2, 'half_bathrooms' => 0,
                'square_feet' => 1620, 'lot_size' => 6500, 'year_built' => 2005,
                'description' => 'Well-maintained single story with a fenced backyard. Great for first-time homebuyers or investors.',
                'features' => array_merge($defaultFeatures, ['Carpet', 'Tile Floors', 'Garage']),
                'photo' => '1570129477492-45c003edd2be',
                'latitude' => 29.5635, 'longitude' => -95.2860,
            ],
            [
                'title' => 'Downtown Condo with Skyline View',
                'property_type' => 'Condo',
                'listing_type' => 'rent',
                'price' => 2650,
                'address' => '1415 Louisiana Street #2204',
                'city' => 'Houston',
                'state' => 'Texas',
                'zip' => '77002',
                'subdivision' => 'Downtown',
                'bedrooms' => 2, 'full_bathrooms' => 2, 'half_bathrooms' => 0,
                'square_feet' => 1300, 'lot_size' => null, 'year_built' => 2020,
                'description' => 'Luxury high-rise condo with floor-to-ceiling windows and a private balcony overlooking downtown. Building includes pool, gym, and concierge.',
                'features' => ['Central AC', 'Central Heat', 'Hardwood Floors', 'Balcony', 'Swimming Pool', 'Security System', 'Updated Kitchen', 'Updated Bathroom', 'Stainless Steel Appliances'],
                'photo' => '1568605114967-8130f3a36994',
                'latitude' => 29.7604, 'longitude' => -95.3698,
            ],
            [
                'title' => 'Ranch Style Home in Cypress',
                'property_type' => 'Single Family',
                'listing_type' => 'sale',
                'price' => 385000,
                'address' => '14206 Windmill Ridge',
                'city' => 'Cypress',
                'state' => 'Texas',
                'zip' => '77429',
                'subdivision' => 'Bridgeland',
                'bedrooms' => 4, 'full_bathrooms' => 3, 'half_bathrooms' => 0,
                'square_feet' => 2780, 'lot_size' => 8100, 'year_built' => 2012,
                'description' => 'Single-story ranch home on a corner lot with mature trees. Open kitchen with island and breakfast bar.',
                'features' => array_merge($defaultFeatures, ['Mature Trees', 'Sprinkler System', 'Covered Patio', 'Garage']),
                'photo' => '1613977257363-707ba9348227',
                'latitude' => 29.9691, 'longitude' => -95.6913,
            ],
        ];

        foreach ($items as $item) {
            $image = "real-estate-highlights/{$item['photo']}.jpg";
            // Only keep image if it actually exists on disk
            $images = Storage::disk('public')->exists($image) ? [$image] : [];

            RealEstateListing::updateOrCreate(
                ['title' => $item['title']],
                [
                    'developer' => null,
                    'property_type' => $item['property_type'],
                    'listing_type' => $item['listing_type'],
                    'price' => $item['price'],
                    'address' => $item['address'],
                    'city' => $item['city'],
                    'state' => $item['state'],
                    'zip' => $item['zip'],
                    'subdivision' => $item['subdivision'],
                    'latitude' => $item['latitude'],
                    'longitude' => $item['longitude'],
                    'bedrooms' => $item['bedrooms'],
                    'full_bathrooms' => $item['full_bathrooms'],
                    'half_bathrooms' => $item['half_bathrooms'],
                    'square_feet' => $item['square_feet'],
                    'lot_size' => $item['lot_size'],
                    'year_built' => $item['year_built'],
                    'description' => $item['description'],
                    'features' => $item['features'],
                    'images' => $images,
                    'main_image_index' => 0,
                    'status' => 'active',
                ]
            );
        }

        $this->command->info('Real estate listings seeded: ' . RealEstateListing::count());
    }
}
