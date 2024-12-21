<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CreditNoteResource extends JsonResource
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
            "tenantName" => $this->invoice->userUnit->user->name,
            "unitName" => $this->invoice->userUnit->unit->name,
            "invoiceId" => $this->invoice_id,
            "type" => $this->invoice->type,
            "description" => $this->description,
            "amount" => number_format($this->amount),
            "createdBy" => $this->createdBy,
            "updatedAt" => $this->updated_at,
            "createdAt" => $this->created_at,
        ];
    }
}
