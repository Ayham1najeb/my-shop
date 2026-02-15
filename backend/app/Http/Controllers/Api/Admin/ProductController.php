<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Color;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Size;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    // Get Helper Data for Form (Categories, Brands, Colors, Sizes)
    public function getFormData()
    {
        return response()->json([
            'categories' => Category::all(),
            'brands' => Brand::all(),
            'colors' => Color::all(),
            'sizes' => Size::all(),
        ]);
    }

    public function index()
    {
        $products = Product::with(['category', 'brand', 'mainImage'])->latest()->paginate(50);
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $input = $request->all();

        // Fix: FormData sends variants as string, we need to decode it for validation
        if (isset($input['variants']) && is_string($input['variants'])) {
            $input['variants'] = json_decode($input['variants'], true);
        }

        // 1. Validation
        $validator = Validator::make($input, [
            'title_en' => 'required|string',
            'title_ar' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'variants' => 'array', // Now this will pass
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5048'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            // 2. Create Product
            $productData = $request->only([
                'title_en', 'title_ar', 'description_en', 'description_ar',
                'price', 'category_id', 'brand_id', 'is_active', 'is_featured'
            ]);
            
            // Ensure is_active is true by default if not present
            if (!isset($productData['is_active'])) {
                $productData['is_active'] = 1;
            }

            $product = Product::create($productData);

            // 3. Handle Variants
            // Expected format: [{color_id: 1, size_id: 2, stock: 10, price_adj: 0}, ...]
            $variants = is_string($request->variants) ? json_decode($request->variants, true) : $request->variants;
            
            if (!empty($variants)) {
                foreach ($variants as $variantData) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'color_id' => !empty($variantData['color_id']) ? $variantData['color_id'] : null,
                        'size_id' => !empty($variantData['size_id']) ? $variantData['size_id'] : null,
                        'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                        'price_adjustment' => $variantData['price_adjustment'] ?? 0,
                        'sku' => $variantData['sku'] ?? uniqid($product->id . '-'),
                    ]);
                }
            } else {
                // Create default variant if none provided
                ProductVariant::create([
                    'product_id' => $product->id,
                    'stock_quantity' => 0,
                    'sku' => uniqid($product->id . '-DEF-'),
                ]);
            }

            // 4. Handle Images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $imageFile) {
                    $path = $imageFile->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'is_main' => $index === 0 // First image is main
                    ]);
                }
            } else {
                // If no images uploaded but we want a placeholder or just no image
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Product created successfully',
                'data' => $product->load('variants', 'images')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $product = Product::with(['variants', 'images'])->findOrFail($id);
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $input = $request->all();

        if (isset($input['variants']) && is_string($input['variants'])) {
            $input['variants'] = json_decode($input['variants'], true);
        }

        $validator = Validator::make($input, [
            'title_en' => 'required|string',
            'title_ar' => 'required|string',
            'price' => 'required|numeric',
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'nullable|exists:brands,id',
            'variants' => 'array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5048'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $product->update($request->only([
                'title_en', 'title_ar', 'description_en', 'description_ar',
                'price', 'category_id', 'brand_id', 'is_active', 'is_featured'
            ]));

            // Update Variants
            $variants = is_string($request->variants) ? json_decode($request->variants, true) : $request->variants;
            
            if (!empty($variants)) {
                // Delete existing variants and recreate
                $product->variants()->delete();
                foreach ($variants as $variantData) {
                    ProductVariant::create([
                        'product_id' => $product->id,
                        'color_id' => !empty($variantData['color_id']) ? $variantData['color_id'] : null,
                        'size_id' => !empty($variantData['size_id']) ? $variantData['size_id'] : null,
                        'stock_quantity' => $variantData['stock_quantity'] ?? 0,
                        'price_adjustment' => $variantData['price_adjustment'] ?? 0,
                        'sku' => $variantData['sku'] ?? uniqid($product->id . '-'),
                    ]);
                }
            }

            // Handle New Images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $imageFile) {
                    $path = $imageFile->store('products', 'public');
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_path' => $path,
                        'is_main' => false
                    ]);
                }
            }

            // Handle Image Deletion
            if ($request->has('deleted_images')) {
                $deletedIds = is_string($request->deleted_images) ? json_decode($request->deleted_images, true) : $request->deleted_images;
                if (!empty($deletedIds)) {
                    $imagesToDelete = ProductImage::whereIn('id', $deletedIds)->where('product_id', $product->id)->get();
                    foreach ($imagesToDelete as $img) {
                        Storage::disk('public')->delete($img->image_path);
                        $img->delete();
                    }
                }
            }

            // Ensure there is always a main image if any images exist
            $remainingImages = $product->images()->get();
            if ($remainingImages->count() > 0 && !$remainingImages->where('is_main', true)->first()) {
                $firstImage = $remainingImages->first();
                $firstImage->is_main = true;
                $firstImage->save();
            }

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Product updated successfully',
                'data' => $product->load('variants', 'images')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            DB::beginTransaction();
            $product = Product::with('images')->findOrFail($id);

            // Delete files from storage
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }

            $product->delete();
            DB::commit();

            return response()->json(['status' => 'success', 'message' => 'Product deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
