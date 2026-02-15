<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{

    public function index()
    {
        $reviews = Review::with(['user:id,name', 'product:id,title_en,title_ar'])
                        ->orderBy('created_at', 'desc')
                        ->get();
        return response()->json(['status' => 200, 'reviews' => $reviews]);
    }

    public function updateStatus(Request $request, $id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['status' => 404, 'message' => 'Review not found'], 404);
        }

        $review->status = $request->status; // 'approved' or 'rejected'
        $review->save();

        return response()->json(['status' => 200, 'message' => 'Review status updated']);
    }

    public function destroy($id)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['status' => 404, 'message' => 'Review not found'], 404);
        }
        $review->delete();
        return response()->json(['status' => 200, 'message' => 'Review deleted successfully']);
    }
}
