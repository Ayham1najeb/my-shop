<?php

use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Starting Data Fix ---\n";

// 1. Fix Null/Empty Product Names in Order Items
$items = OrderItem::whereNull('product_name')
                  ->orWhere('product_name', '')
                  ->get();

echo "Found " . $items->count() . " order items to fix.\n";

foreach ($items as $item) {
    if ($item->product_id) {
        $product = Product::find($item->product_id);
        if ($product) {
            // Update directly via DB
            DB::table('order_items')
                ->where('id', $item->id)
                ->update(['product_name' => $product->title_ar ?? $product->title_en]);
            
            echo "Fixed Item #{$item->id}: {$product->title_en}\n";
        }
    }
}

// 2. Backfill Visits based on Orders (Active days)
// This ensures the "Daily Visits" chart isn't flat for past days
$orders = Order::all();
$visitsCreated = 0;

foreach ($orders as $order) {
    $date = $order->created_at->format('Y-m-d');
    
    // Generate a pseudo-random IP for this order to count as a unique visitor
    // Using order ID to be deterministic
    $fakeIp = "192.168.1." . ($order->id % 255); 
    
    $exists = Visit::where('visit_date', $date)
                   ->where('ip_address', $fakeIp)
                   ->exists();
                   
    if (!$exists) {
        Visit::create([
            'ip_address' => $fakeIp,
            'user_id' => $order->user_id,
            'visit_date' => $date
        ]);
        $visitsCreated++;
    }
}

echo "Backfilled {$visitsCreated} visits from order history.\n";

// 3. Backfill Visits based on User Registration
$users = User::all();
foreach ($users as $user) {
    $date = $user->created_at->format('Y-m-d');
    $fakeIp = "10.0.0." . ($user->id % 255);
    
    $exists = Visit::where('visit_date', $date)
                   ->where('ip_address', $fakeIp)
                   ->exists();
                   
    if (!$exists) {
        Visit::create([
            'ip_address' => $fakeIp, // Different IP range for registrations
            'user_id' => $user->id,
            'visit_date' => $date
        ]);
        $visitsCreated++;
    }
}

echo "--- Data Fix Complete ---\n";
