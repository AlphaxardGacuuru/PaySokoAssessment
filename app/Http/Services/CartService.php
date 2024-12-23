<?php

namespace App\Http\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class CartService extends Service
{
    /*
     * Get Cart Items
     */
    public function index()
    {
        $cart = Cache::get('cart', collect());

        $cart = $cart
			->filter(fn ($product) => $product->userId == $this->id)
			->values();

        return $cart;
    }

    /*
     * Store Cart
     */
    public function store($request)
    {
        $cart = Cache::get("cart") ?? collect([]);

        $product = Product::find($request->productId);

        // Add User ID to the product
        $product->userId = $this->id;

        $cart->push($product);

        $saved = Cache::put("cart", $cart);

        return [$saved, $product->name . " added to cart successfully", $cart];
    }

    /*
     * Delete Cart Item
     */
    public function destroy($productId)
    {
        $cart = Cache::get("cart");

        $cart = $cart->filter(function ($product) use ($productId) {
            return $product->id != $productId && $product->userId == $this->id;
        });

        $saved = Cache::put("cart", $cart);

        return [$saved, "Product removed from cart successfully", $cart];
    }
}
