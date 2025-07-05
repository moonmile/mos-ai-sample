<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderProduct;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::query();

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return response()->json($orders);
    }

    /**
     * Store a newly created order in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'total_price' => 'required|numeric|min:0',
            'total_quantity' => 'required|integer|min:1',
            'status' => 'nullable|integer|min:0',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Set default values
        $validatedData['status'] = $validatedData['status'] ?? 0;

        // Generate order number
        $order_number = date('md') . sprintf('%04d', rand(0, 9999));

        DB::beginTransaction();

        try {
            // Create order
            $order = Order::create([
                'order_number' => $orderNumber,
                'total_price' => $validatedData['total_price'],
                'total_quantity' => $validatedData['total_quantity'],
                'status' => $validatedData['status'],
            ]);

            // Create order products
            foreach ($validatedData['items'] as $item) {
                OrderProduct::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                ]);
            }

            DB::commit();

            return response()->json($order, 201);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'error' => 'Order creation failed',
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Display the specified order.
     */
    public function show(int $id): JsonResponse
    {
        $order = Order::with('orderProducts')->find($id);

        if (!$order) {
            return response()->json([
                'error' => 'Order not found',
                'message' => 'The requested order could not be found'
            ], 404);
        }

        return response()->json($order);
    }

    /**
     * Update the specified order in storage.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'error' => 'Order not found',
                'message' => 'The requested order could not be found'
            ], 404);
        }

        $validatedData = $request->validate([
            'order_number' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('orders', 'order_number')->ignore($order->id),
            ],
            'total_price' => 'sometimes|required|numeric|min:0',
            'total_quantity' => 'sometimes|required|integer|min:1',
            'status' => 'nullable|integer|min:0',
        ]);

        $order->update($validatedData);

        return response()->json($order);
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(int $id): JsonResponse
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'error' => 'Order not found',
                'message' => 'The requested order could not be found'
            ], 404);
        }

        DB::beginTransaction();

        try {
            // Delete associated order products
            $order->orderProducts()->delete();

            // Delete order
            $order->delete();

            DB::commit();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'error' => 'Order deletion failed',
                'message' => 'Failed to delete order: ' . $e->getMessage()
            ], 400);
        }
    }
}
