<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Size;
use Illuminate\Database\Seeder;

class AppSeeder extends Seeder
{
    public function run(): void
    {
        // Sizes
        $sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'];
        foreach ($sizes as $s) Size::firstOrCreate(['name' => $s]);

        // Colors
        $colors = [
            ['name_en' => 'Red', 'name_ar' => 'أحمر', 'hex_code' => '#ef4444'],
            ['name_en' => 'Blue', 'name_ar' => 'أزرق', 'hex_code' => '#3b82f6'],
            ['name_en' => 'Green', 'name_ar' => 'أخضر', 'hex_code' => '#22c55e'],
            ['name_en' => 'Black', 'name_ar' => 'أسود', 'hex_code' => '#000000'],
            ['name_en' => 'White', 'name_ar' => 'أبيض', 'hex_code' => '#ffffff'],
            ['name_en' => 'Yellow', 'name_ar' => 'أصفر', 'hex_code' => '#eab308'],
        ];
        foreach ($colors as $c) Color::firstOrCreate(['hex_code' => $c['hex_code']], $c);

        // Categories
        $categories = [
            ['name_en' => 'Men', 'name_ar' => 'رجال'],
            ['name_en' => 'Women', 'name_ar' => 'نساء'],
            ['name_en' => 'Kids', 'name_ar' => 'أطفال'],
            ['name_en' => 'Accessories', 'name_ar' => 'إكسسوارات'],
        ];
        foreach ($categories as $cat) Category::firstOrCreate(['name_en' => $cat['name_en']], $cat);

        // Brands
        $brands = ['Nike', 'Adidas', 'Puma', 'Zara', 'H&M'];
        foreach ($brands as $b) Brand::firstOrCreate(['name' => $b]);

        // Default Admin User
        \App\Models\User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Admin User',
                'password' => \Illuminate\Support\Facades\Hash::make('password'),
                'role' => 'admin',
                'phone' => '1234567890'
            ]
        );
    }
}
