<?php

namespace App\Http\Services;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderProduct;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class OrderService extends Service
{
    /*
     * Fetch All Orders
     */
    public function index()
    {
        $orders = Order::with("products")
            ->orderBy("id", "DESC")
            ->paginate(20);

        return OrderResource::collection($orders);
    }

    /*
     * Fetch Order
     */
    public function show($id)
    {
        $order = Order::find($id);

        return new OrderResource($order);
    }

    /*
     * Store Order
     */
    public function store($request)
    {
        $orderNumber = Order::count() + 1;
        $paddedOrderNumber = str_pad($orderNumber, 3, '0', STR_PAD_LEFT);

        $code = "O-" . $paddedOrderNumber;

        $products = Cache::get("cart");

    // Handle an empty cart
    if (is_null($products) || $products->isEmpty()) {
        return [false, 'Cart is empty. Cannot create an order.', null];
    }

        $order = new Order;
        $order->code = $code;
        $order->user_id = $this->id;
        $order->amount = $products->sum("price");

        $saved = DB::transaction(function () use ($order, $products) {
			$saved = $order->save();

            foreach ($products as $product) {
                $orderProduct = new OrderProduct;
                $orderProduct->order_id = $order->id;
                $orderProduct->product_id = $product->id;
                $orderProduct->save();

                // Decrement product inventory
                $product->decrement("inventory");
            }

            Cache::forget("cart");

			return $saved;
        });

        $message = "Order " . $order->code . " created successfully";

        return [$saved, $message, $order];
    }

    /*
     * Delete Order
     */
    public function destroy($id)
    {
        $order = Order::findOrFail($id);

        $saved = $order->delete();

        $message = "Order " . $order->code . " cancelled successfully";

        return [$saved, $message, $order];
    }
}
