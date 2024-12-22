<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'code' => 'O-' . $this->faker->unique()->numerify('###'),
            'user_id' => User::factory(), // Generates a user associated with the order
            'amount' => $this->faker->numberBetween(100, 10000), // Random amount
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
