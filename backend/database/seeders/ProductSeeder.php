<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $response = Http::get('https://fakestoreapi.com/products');
        
        if ($response->failed()) {
            $this->command->error('Failed to fetch data from FakeStoreAPI');
            return;
        }

        $products = $response->json();

        foreach ($products as $apiProduct) {
            // 1. Create or Find Category
            $category = Category::firstOrCreate(
                ['name_en' => $apiProduct['category']],
                [
                    'name_ar' => $apiProduct['category'], // Just use English name for now
                    'image' => null
                ]
            );

            // 2. Create Product (Force ID to match)
            $product = Product::updateOrCreate(
                ['id' => $apiProduct['id']], 
                [
                    'title_en' => $apiProduct['title'],
                    'title_ar' => $apiProduct['title'], // Placeholder
                    'description_en' => $apiProduct['description'],
                    'description_ar' => $apiProduct['description'], // Placeholder
                    'price' => $apiProduct['price'],
                    'category_id' => $category->id,
                    'is_active' => true,
                    'is_featured' => $apiProduct['rating']['rate'] > 4.5
                ]
            );

            // 3. Add Image
            ProductImage::updateOrCreate(
                ['product_id' => $product->id],
                [
                    'image_path' => $apiProduct['image'],
                    'is_main' => true
                ]
            );

            $this->command->info("Synced Product ID: {$product->id}");
        }

        $this->command->info('All products synced successfully!');
    }
}
