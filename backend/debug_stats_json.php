<?php

use App\Models\Order;
use App\Models\Visit;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$result = [
    'total_orders' => Order::count(),
    'daily_visits' => Visit::whereDate('visit_date', Carbon::today())->count(),
    'all_visits' => Visit::count(),
    'top_products' => DB::table('order_items')
        ->select('product_name as name', DB::raw('SUM(quantity) as sales'))
        ->groupBy('name')
        ->orderByDesc('sales')
        ->limit(5)
        ->get()
];

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
