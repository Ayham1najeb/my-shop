<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Notification;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $orders = auth()->user()->orders()
            ->with(['items'])
            ->latest()
            ->get();
            
        return response()->json($orders);
    }

    public function show($id)
    {
        $order = auth()->user()->orders()
            ->with(['items.product', 'items.product.images']) // Reload product details for images
            ->where('id', $id)
            ->firstOrFail();
            
        return response()->json($order);
    }

    public function store(Request $request)
    {
        $request->validate([
            'address_id' => 'required|exists:addresses,id',
            'payment_method' => 'required|in:cod,card',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $user = auth()->user();
        $address = $user->addresses()->findOrFail($request->address_id);

        $subtotal = 0;
        $orderItemsData = [];

        // 1. Calculate Totals & Prepare Items
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            
            if (!$product) {
                continue; // Skip or throw error
            }

            // CRITICAL SECURITY: Always fetch price from DB, NEVER trust the frontend price
            $price = $product->price;
            $total = $price * $item['quantity'];
            $subtotal += $total;

            $orderItemsData[] = [
                'product_id' => $product->id,
                'product_name' => $product->title_en,
                'color' => $item['color'] ?? null,
                'size' => $item['size'] ?? null,
                'quantity' => $item['quantity'],
                'price' => $price,
                'total' => $total,
            ];
        }

        $tax = 0; // 0 for now
        $shipping = 10.00; // Fixed shipping for now
        $discount = 0;
        $grandTotal = $subtotal + $tax + $shipping - $discount;

        // 2. Create Order
        $order = Order::create([
            'user_id' => $user->id,
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'payment_method' => $request->payment_method,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping_cost' => $shipping,
            'discount' => $discount,
            'total' => $grandTotal,
            // Snapshot address
            'shipping_address_json' => $address->toArray(),
            'billing_address_json' => $address->toArray(),
        ]);

        // 3. Create Items
        foreach ($orderItemsData as $data) {
            $order->items()->create($data);
        }

        // Create Notification
        Notification::create([
            'user_id' => $user->id,
            'title' => 'تم استلام طلبك',
            'message' => "شكراً لك! لقد تم استلام طلبك رقم #{$order->order_number} بنجاح وهو قيد المراجعة الآن.",
            'type' => 'success',
            'is_read' => false
        ]);

        return response()->json([
            'message' => 'Order placed successfully',
            'order_id' => $order->id,
            'order_number' => $order->order_number
        ], 201);
    }
}
