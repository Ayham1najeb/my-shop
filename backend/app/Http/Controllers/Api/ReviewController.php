<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{

    public function index($productId)
    {
        $reviews = Review::where('product_id', $productId)
                        ->where('status', 'approved')
                        ->with('user:id,name,profile_image') // Only get necessary user info
                        ->orderBy('created_at', 'desc')
                        ->get();
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 400, 'errors' => $validator->errors()], 400);
        }

        // Profanity Check
        $badWords = ['badword', 'offensive', 'شتيمة', 'سيء جدا', 'احمق', 'stupid', 'idiot']; // Add more as needed
        foreach ($badWords as $word) {
            if (str_contains(strtolower($request->comment), $word)) {
                return response()->json(['status' => 400, 'message' => 'Review contains inappropriate language and cannot be published.'], 400);
            }
        }

        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'status' => 'approved' // Auto-approve
        ]);

        // critical: Load user data so frontend can display it immediately without refresh
        $review->load('user:id,name,profile_image');

        return response()->json(['status' => 200, 'message' => 'Review published successfully!', 'data' => $review]);
    }
}
