<?php

use App\Models\Order;
use App\Models\User;
use App\Models\Visit;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "--- Debugging Stats ---\n";

// 1. Check Orders and Items
$totalOrders = Order::count();
$orderItemsCount = DB::table('order_items')->count();
echo "Total Orders: $totalOrders\n";
echo "Total Order Items: $orderItemsCount\n";

if ($orderItemsCount > 0) {
    echo "Sample Order Item:\n";
    print_r(DB::table('order_items')->first());
}

// 2. Check Top Selling Query
echo "\n--- Top Products Query Result ---\n";
$topProducts = DB::table('order_items')
    ->select('product_name as name', DB::raw('SUM(quantity) as sales'))
    ->groupBy('name')
    ->orderByDesc('sales')
    ->limit(5)
    ->get();
    
if ($topProducts->isEmpty()) {
    echo "Top Products Collection is EMPTY.\n";
} else {
    print_r($topProducts->toArray());
}

// 3. Check Visits
echo "\n--- Visits ---\n";
$totalVisits = Visit::count();
$todayVisits = Visit::whereDate('visit_date', Carbon::today())->count();
$monthVisits = Visit::whereMonth('visit_date', Carbon::now()->month)->count();

echo "Total Visits in DB: $totalVisits\n";
echo "Visits Today (" . Carbon::today()->format('Y-m-d') . "): $todayVisits\n";
echo "Visits This Month: $monthVisits\n";

if ($totalVisits > 0) {
    echo "Sample Visit:\n";
    print_r(Visit::first());
}
