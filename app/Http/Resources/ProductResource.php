<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

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
        return [
			"id" => $this->id,
			"thumbnail" => $this->thumbnail,
			"name" => $this->name,
			"description" => $this->description,
			"price" => number_format($this->price),
			"sales" => $this->sales,
			"updatedAt" => $this->updated_at,
			"createdAt" => $this->created_at,
		];
    }
}
