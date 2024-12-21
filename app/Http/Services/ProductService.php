<?php

namespace App\Http\Services;

use App\Http\Resources\ProductResource;
use App\Models\Product;

class ProductService extends Service
{
    /*
     * Fetch All Products
     */
    public function index($request)
    {
        $productsQuery = new Product;

        $productsQuery = $this->search($productsQuery, $request);

        $products = $productsQuery
            ->orderBy("id", "DESC")
            ->paginate(20);

        return ProductResource::collection($products);
    }

    /*
     * Fetch Product
     */
    public function show($id)
    {
        $product = Product::find($id);

        return new ProductResource($product);
    }

    /*
     * Save Product
     */
    public function store($request)
    {
        $product = new Product;
        $product->name = $request->name;
        $product->description = $request->description;
        $product->price = $request->price;

        $saved = $product->save();

        return [$saved, "Product created successfully", $product];
    }

    /*
     * Update Product
     */
    public function update($request, $id)
    {
        $product = Product::find($id);

        if ($request->filled("name")) {
            $product->name = $request->name;
        }

        if ($request->filled("description")) {
            $product->description = $request->description;
        }

        if ($request->filled("price")) {
            $product->price = $request->price;
        }

        $saved = $product->save();

        return [$saved, "Product updated", $product];
    }

    /*
     * Destroy Product
     */
    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        $deleted = $product->delete();

        $this->updateInvoice($product->invoice_id);

        return [$deleted, "Product deleted successfully", $product];
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        if ($request->filled("name")) {
            $query = $query->where("name", "LIKE", "%{$request->name}%");
        }

        return $query;
    }
}
