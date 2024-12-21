<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $channels = ["Bank", "Mpesa"];

        return [
            "invoice_id" => "invoiceId",
            // "user_id" => "userId",
            "amount" => "amount",
            "transaction_reference" => fake()->regexify('[A-Z0-9]{10}'),
            "channel" => $channels[rand(0, 1)],
            "paid_on" => "paidOn",
        ];
    }
}
