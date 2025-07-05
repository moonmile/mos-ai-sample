<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with('category');

        // Filter by category_id
        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // Filter by display status
        if ($request->has('display')) {
            $query->where('display', $request->input('display'));
        }

        $products = $query->orderBy('sortid')->get();

        // Transform display field to boolean and format response
        $transformedProducts = $products->map(function ($product) {
            $productArray = $product->toArray();
            if (isset($productArray['category'])) {
                $productArray['category']['display'] = (bool) $productArray['category']['display'];
            }
            return $productArray;
        });

        return response()->json([
            'items' => $transformedProducts,
            'total' => $transformedProducts->count()
        ]);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'category_id' => 'nullable|integer|exists:categories,id',
            'slug' => 'required|string|max:255|unique:products,slug',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'sortid' => 'nullable|integer|min:0',
            'display' => 'nullable|integer|in:0,1',
        ]);

        // Set default values
        $validatedData['sortid'] = $validatedData['sortid'] ?? 0;
        $validatedData['display'] = $validatedData['display'] ?? 1;

        $product = Product::create($validatedData);

        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json([
                'error' => 'Product not found',
                'message' => 'The requested product could not be found'
            ], 404);
        }

        return response()->json($product);
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'error' => 'Product not found',
                'message' => 'The requested product could not be found'
            ], 404);
        }

        $validatedData = $request->validate([
            'category_id' => 'nullable|integer|exists:categories,id',
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'slug')->ignore($product->id),
            ],
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'price' => 'sometimes|required|numeric|min:0',
            'sortid' => 'nullable|integer|min:0',
            'display' => 'nullable|integer|in:0,1',
        ]);

        $product->update($validatedData);

        return response()->json($product);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'error' => 'Product not found',
                'message' => 'The requested product could not be found'
            ], 404);
        }

        $product->delete();

        return response()->json(null, 204);
    }

    /**
     * Get products by category slug.
     */
    public function getBySlug(string $category_slug, Request $request): JsonResponse
    {
        // Find category by slug
        $category = \App\Models\Category::where('slug', $category_slug)->first();

        if (!$category) {
            return response()->json([
                'error' => 'Category not found',
                'message' => 'The requested category could not be found'
            ], 404);
        }

        $query = Product::with('category')->where('category_id', $category->id);

        // Filter by display status
        if ($request->has('display')) {
            $query->where('display', $request->input('display'));
        }

        $products = $query->orderBy('sortid')->get();

        // Transform display field to boolean and format response
        $transformedProducts = $products->map(function ($product) {
            $productArray = $product->toArray();
            if (isset($productArray['category'])) {
                $productArray['category']['display'] = (bool) $productArray['category']['display'];
            }
            return $productArray;
        });

        return response()->json([
            'items' => $transformedProducts,
            'total' => $transformedProducts->count(),
            'category' => [
                'id' => $category->id,
                'slug' => $category->slug,
                'title' => $category->title,
                'description' => $category->description,
                'image' => $category->image,
                'sortid' => $category->sortid,
                'display' => (bool) $category->display,
                'created_at' => $category->created_at,
                'updated_at' => $category->updated_at,
                'deleted_at' => $category->deleted_at,
            ]
        ]);
    }
}
