<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['category', 'brand', 'mainImage', 'variants.color'])
            ->withCount(['reviews' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->withAvg(['reviews' => function ($query) {
                $query->where('status', 'approved');
            }], 'rating')
            ->where('is_active', true)
            ->latest() // Ensure newest products appear first
            ->get();

        // Transform to match frontend expectation
        $data = $products->map(function ($product) {
            $imageUrl = null;
            if ($product->mainImage) {
                $path = $product->mainImage->image_path;
                $imageUrl = filter_var($path, FILTER_VALIDATE_URL) ? $path : asset('storage/' . $path);
            }

            // Extract unique colors
            $colors = $product->variants->map(function ($v) {
                return $v->color;
            })->filter()->unique('id')->values()->map(function ($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name_en, // or name_ar depending on need, or both
                    'hex' => $c->hex_code
                ];
            });

            return [
                'id' => $product->id,
                'title' => $product->title_en,
                'title_ar' => $product->title_ar,
                'price' => $product->price,
                'description' => $product->description_en,
                'description_ar' => $product->description_ar,
                'category' => $product->category ? $product->category->name_en : 'Uncategorized',
                'image' => $imageUrl,
                'colors' => $colors, // Add colors here
                'rating' => [
                    'rate' => round($product->reviews_avg_rating, 1) ?? 0,
                    'count' => $product->reviews_count ?? 0
                ]
            ];
        });

        return response()->json($data);
    }

    public function show($id)
    {
        $product = Product::with(['category', 'brand', 'mainImage', 'images', 'variants.color', 'variants.size'])
            ->withCount(['reviews' => function ($query) {
                $query->where('status', 'approved');
            }])
            ->withAvg(['reviews' => function ($query) {
                $query->where('status', 'approved');
            }], 'rating')
            ->where('is_active', true)
            ->findOrFail($id);

        $imageUrl = null;
        if ($product->mainImage) {
            $path = $product->mainImage->image_path;
            $imageUrl = filter_var($path, FILTER_VALIDATE_URL) ? $path : asset('storage/' . $path);
        }

        return response()->json([
            'id' => $product->id,
            'title' => $product->title_en,
            'title_ar' => $product->title_ar,
            'price' => $product->price,
            'description' => $product->description_en,
            'description_ar' => $product->description_ar,
            'category' => $product->category ? $product->category->name_en : 'Uncategorized',
            'image' => $imageUrl,
            'images' => $product->images->map(function($img) {
                 return filter_var($img->image_path, FILTER_VALIDATE_URL) ? $img->image_path : asset('storage/' . $img->image_path);
            }),
            'variants' => $product->variants->map(function($v) {
                return [
                    'id' => $v->id, // variant id
                    'color' => $v->color, // Full color object
                    'size' => $v->size,   // Full size object
                    'stock' => $v->stock_quantity,
                    'price_adj' => $v->price_adjustment
                ];
            }),
            'rating' => [
                'rate' => round($product->reviews_avg_rating, 1) ?? 0,
                'count' => $product->reviews_count ?? 0
            ]
        ]);
    }
}
