<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class WishlistController extends Controller
{
    // Get User Wishlist
    public function index(Request $request)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)
            ->with('product') // Assuming Product model exists
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $wishlist
        ]);
    }

    // Toggle Wishlist (Add/Remove)
    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id'
        ]);

        $user = $request->user();
        $product_id = $request->product_id;

        $exists = Wishlist::where('user_id', $user->id)
            ->where('product_id', $product_id)
            ->first();

        if ($exists) {
            $exists->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Removed from wishlist',
                'action' => 'removed'
            ]);
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $product_id
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Added to wishlist',
                'action' => 'added'
            ]);
        }
    }
    // Sync Local Wishlist with Database
    public function sync(Request $request)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id'
        ]);

        $user = $request->user();
        $product_ids = $request->product_ids;

        foreach ($product_ids as $id) {
            Wishlist::firstOrCreate([
                'user_id' => $user->id,
                'product_id' => $id
            ]);
        }

        // Return updated wishlist
        $wishlist = Wishlist::where('user_id', $user->id)
            ->with('product')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Wishlist synced',
            'data' => $wishlist
        ]);
    }
}
