<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Add CORS headers to response
     */
    private function addCorsHeaders(JsonResponse $response): JsonResponse
    {
        return $response->withHeaders([
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
        ]);
    }

    /**
     * Display a listing of the categories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Category::query();

        // Filter by display status
        if ($request->has('display')) {
            $query->where('display', $request->input('display'));
        }

        $categories = $query->orderBy('sortid')->get();

        // Transform display field to boolean and format response
        $items = $categories->map(function ($category) {
            $category->display = (bool) $category->display;
            return $category;
        });

        $response = [
            'items' => $items,
            'total' => $items->count()
        ];

        return $this->addCorsHeaders(response()->json($response));
    }

    /**
     * Store a newly created category in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'slug' => 'required|string|max:255|unique:categories,slug',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'sortid' => 'nullable|integer|min:0',
            'display' => 'nullable|integer|in:0,1',
        ]);

        // Set default values
        $validatedData['sortid'] = $validatedData['sortid'] ?? 0;
        $validatedData['display'] = $validatedData['display'] ?? 1;

        $category = Category::create($validatedData);

        return $this->addCorsHeaders(response()->json($category, 201));
    }

    /**
     * Display the specified category.
     */
    public function show(int $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->addCorsHeaders(response()->json([
                'error' => 'Category not found',
                'message' => 'The requested category could not be found'
            ], 404));
        }

        return $this->addCorsHeaders(response()->json($category));
    }

    /**
     * Update the specified category in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->addCorsHeaders(response()->json([
                'error' => 'Category not found',
                'message' => 'The requested category could not be found'
            ], 404));
        }

        $validatedData = $request->validate([
            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'slug')->ignore($category->id),
            ],
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:255',
            'sortid' => 'nullable|integer|min:0',
            'display' => 'nullable|integer|in:0,1',
        ]);

        $category->update($validatedData);

        return $this->addCorsHeaders(response()->json($category));
    }

    /**
     * Remove the specified category from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->addCorsHeaders(response()->json([
                'error' => 'Category not found',
                'message' => 'The requested category could not be found'
            ], 404));
        }

        $category->delete();

        return $this->addCorsHeaders(response()->json(null, 204));
    }
}
