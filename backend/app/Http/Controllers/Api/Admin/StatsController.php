<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Visit;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StatsController extends Controller
{
    public function index()
    {
        // 1. KPI Stats - Real Data
        $totalUsers = User::where('role', 'customer')->count();
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalRevenue = Order::sum('total');
        
        $aov = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;
        
        // 1.1 Visitor Stats
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        
        $dailyVisits = Visit::whereDate('visit_date', $today)->count();
        $yesterdayVisits = Visit::whereDate('visit_date', $yesterday)->count();
        
        // Count unique IPs for total and monthly stats for better accuracy
        $totalVisits = Visit::distinct('ip_address')->count();
        $monthlyVisits = Visit::whereMonth('visit_date', Carbon::now()->month)
            ->distinct('ip_address')
            ->count();

        // 1.2 Comparison Stats (Orders & Revenue)
        $todayOrders = Order::whereDate('created_at', $today)->count();
        $yesterdayOrders = Order::whereDate('created_at', $yesterday)->count();
        
        $todayRevenue = Order::whereDate('created_at', $today)->sum('total');
        $yesterdayRevenue = Order::whereDate('created_at', $yesterday)->sum('total');
        
        // Calculate Growth Percentages (avoid division by zero)
        $visitsGrowth = $yesterdayVisits > 0 ? (($dailyVisits - $yesterdayVisits) / $yesterdayVisits) * 100 : 100;
        $ordersGrowth = $yesterdayOrders > 0 ? (($todayOrders - $yesterdayOrders) / $yesterdayOrders) * 100 : 100;

        // 2. Sales Chart Data (Last 7 Days) - Real
        $salesData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dayName = $date->locale('ar')->dayName;
            $sales = Order::whereDate('created_at', $date->format('Y-m-d'))->sum('total');
            $salesData[] = ['name' => $dayName, 'sales' => (float)$sales];
        }

        // 3. Order Status Distribution - Real
        // Define all possible statuses to ensure colors match even if count is 0
        $statuses = ['delivered', 'processing', 'shipped', 'cancelled', 'pending'];
        $statusColors = [
            'delivered' => '#10b981',
            'processing' => '#f59e0b',
            'shipped' => '#3b82f6',
            'cancelled' => '#ef4444',
            'pending' => '#8b5cf6'
        ];
        
        $dbStatusCounts = Order::select('status', \Illuminate\Support\Facades\DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $orderStatus = [];
        foreach ($statuses as $status) {
            $count = $dbStatusCounts[$status] ?? 0;
            $percentage = $totalOrders > 0 ? round(($count / $totalOrders) * 100) : 0;
            
            // Only add if relevant or to keep chart valid (at least show empty if needed)
            // Ideally passing all helps the legend
            $orderStatus[] = [
                'name' => ucfirst($status),
                'value' => $percentage,
                'count' => $count,
                'color' => $statusColors[$status] ?? '#94a3b8'
            ];
        }

        // 4. Top Selling Products (Real Data from Order Items)
        $topProducts = \Illuminate\Support\Facades\DB::table('order_items')
            ->select('product_name as name', \Illuminate\Support\Facades\DB::raw('SUM(quantity) as sales'))
            ->groupBy('name')
            ->orderByDesc('sales')
            ->limit(5)
            ->get();

        // 5. Recent Activity (Real: Orders + New Users)
        $recentOrders = Order::with('user')->latest()->take(5)->get()->map(function($order) {
            return [
                'id' => $order->id,
                'type' => 'order',
                'user' => $order->shipping_address_json['first_name'] ?? 'Guest',
                'item' => 'طلب جديد #' . $order->order_number,
                'amount' => '$' . number_format($order->total, 2),
                'status' => $order->status,
                'time' => $order->created_at->diffForHumans()
            ];
        });

        $recentUsers = User::where('role', 'customer')->latest()->take(3)->get()->map(function($user) {
            return [
                'id' => $user->id,
                'type' => 'user',
                'user' => $user->name,
                'item' => 'تسجيل جديد',
                'amount' => '-',
                'status' => 'new',
                'time' => $user->created_at->diffForHumans()
            ];
        });
        
        $recentActivities = $recentOrders->merge($recentUsers)->sortByDesc('time')->values()->take(8);

        return response()->json([
            'total_users' => $totalUsers,
            'total_products' => $totalProducts,
            'total_orders' => $totalOrders,
            'total_revenue' => number_format($totalRevenue, 2),
            'aov' => $aov,
            'daily_visits' => $dailyVisits,
            'monthly_visits' => $monthlyVisits,
            'sales_data' => $salesData,
            'order_status' => $orderStatus,
            'top_selling_products' => $topProducts,
            'recent_activities' => $recentActivities,
            // New Comparison Data
            'today_orders' => $todayOrders,
            'yesterday_orders' => $yesterdayOrders,
            'yesterday_visits' => $yesterdayVisits,
            'visits_growth' => round($visitsGrowth, 1),
            'orders_growth' => round($ordersGrowth, 1)
        ]);
    }
}
