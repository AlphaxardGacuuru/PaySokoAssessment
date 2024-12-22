<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $productId = $this->id;

        $inCart = Cache::get("cart")
        	?->contains(function ($product) use ($productId) {
            	return $product->id == $productId;
        	});

        return [
            "id" => $this->id,
            "thumbnail" => $this->thumbnail,
            "name" => $this->name,
            "description" => $this->description,
            "price" => number_format($this->price),
            "sales" => $this->sales,
            "inCart" => $inCart,
            "updatedAt" => $this->updated_at,
            "createdAt" => $this->created_at,
        ];
    }
}
