<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $products = $this->orderProducts->map(function ($orderProduct) {
            return [
                "id" => $orderProduct->product->id,
                "name" => $orderProduct->product->name,
                "price" => $orderProduct->product->price,
                "quantity" => $orderProduct->quantity,
            ];
        });

        return [
            "id" => $this->id,
            "code" => $this->code,
            "status" => $this->status,
            "amount" => $this->amount,
            "userName" => $this->user->name,
            "products" => $this->products,
            "updatedAt" => $this->updated_at,
            "createdAt" => $this->created_at,
        ];
    }
}
