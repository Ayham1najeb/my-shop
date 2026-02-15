<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = \App\Models\User::where('role', 'customer')->get();
        $products = \App\Models\Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        foreach ($products as $product) {
            // Add 0-5 reviews per product
            $reviewCount = rand(0, 5);
            for ($i = 0; $i < $reviewCount; $i++) {
                $rating = rand(3, 5); // Mostly good reviews
                $user = $users->random();

                \App\Models\Review::create([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                    'rating' => $rating,
                    'comment' => "This is a dummy review for {$product->title_en}. Great product!",
                    'status' => 'approved',
                    'created_at' => \Carbon\Carbon::now()->subDays(rand(1, 60)),
                    'updated_at' => \Carbon\Carbon::now()
                ]);
            }
        }
    }
}
