<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
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

        foreach ($users as $user) {
            // Create 1-5 orders per user
            $orderCount = rand(1, 5);
            for ($i = 0; $i < $orderCount; $i++) {
                $status = ['delivered', 'processing', 'pending'][rand(0, 2)];
                $date = \Carbon\Carbon::now()->subDays(rand(0, 30)); 

                // Use DB facade to bypass strict model validation if any
                $orderId = DB::table('orders')->insertGetId([
                    'order_number' => 'ORD-' . strtoupper(uniqid()),
                    'user_id' => $user->id,
                    'status' => $status,
                    'subtotal' => 0, 
                    'shipping_cost' => 0,
                    'total' => 0, 
                    'payment_method' => 'cod',
                    'payment_status' => $status === 'delivered' ? 'paid' : 'unpaid',
                    'shipping_address_json' => json_encode([
                        'first_name' => $user->name,
                        'address' => 'Dummy Address',
                        'city' => 'Riyadh',
                        'phone' => '0500000000'
                    ]),
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);

                // Add 1-3 items to order
                $total = 0;
                $itemCount = rand(1, 3);
                for ($j = 0; $j < $itemCount; $j++) {
                    $product = $products->random();
                    $qty = rand(1, 2);
                    $price = $product->price;

                    DB::table('order_items')->insert([
                        'order_id' => $orderId,
                        'product_id' => $product->id,
                        'product_name' => $product->title_ar ?? $product->title_en,
                        'price' => $price,
                        'quantity' => $qty,
                        'total' => $price * $qty,
                        'created_at' => $date,
                        'updated_at' => $date
                    ]);
                    $total += $price * $qty;
                }

                // Update total
                DB::table('orders')->where('id', $orderId)->update([
                    'subtotal' => $total,
                    'total' => $total
                ]);
            }
        }
    }
}
