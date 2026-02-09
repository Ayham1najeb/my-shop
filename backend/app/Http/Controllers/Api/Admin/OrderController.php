<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Notification;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['user', 'items'])->latest();

        if ($request->status && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $orders = $query->paginate(20);

        return response()->json($orders);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled,refunded',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        // Trigger Notification
        $statusLabels = [
            'pending' => ['ar' => 'قيد الانتظار', 'en' => 'Pending'],
            'processing' => ['ar' => 'قيد التنفيذ', 'en' => 'Processing'],
            'shipped' => ['ar' => 'تم الشحن', 'en' => 'Shipped'],
            'delivered' => ['ar' => 'تم التوصيل', 'en' => 'Delivered'],
            'cancelled' => ['ar' => 'تم الإلغاء', 'en' => 'Cancelled'],
            'refunded' => ['ar' => 'تم الاسترجاع', 'en' => 'Refunded'],
        ];

        $statusLabelAr = $statusLabels[$request->status]['ar'];
        
        Notification::create([
            'user_id' => $order->user_id,
            'title' => 'تحديث حالة الطلب',
            'message' => "تم تغيير حالة طلبك رقم #{$order->order_number} إلى: {$statusLabelAr}",
            'type' => $request->status === 'delivered' ? 'success' : ($request->status === 'cancelled' ? 'error' : 'info'),
            'is_read' => false
        ]);

        return response()->json(['message' => 'Order status updated', 'order' => $order]);
    }
}
