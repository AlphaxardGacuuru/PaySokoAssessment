<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
			"thumbnail" => "products/" . rand(1, 5) . ".jpg",
            'name' => fake()->name(),
            "description" => fake()->realTextBetween($minNbChars = 160, $maxNbChars = 200, $indexSize = 2),
			"price" => fake()->randomFloat($nbMaxDecimals = 2, $min = 100, $max = 1000) * 100,
			"inventory" => fake()->randomNumber($nbDigits = 2),
        ];
    }
}
