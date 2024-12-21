<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $types = ["rent", "water", "service_charge"];

        return [
            "user_unit_id" => "userUnitId",
            "type" => "rent",
            "amount" => "amount",
            "balance" => "amount",
            "month" => "month",
            "year" => "year",
            "created_by" => "this->id",
        ];
    }
}
