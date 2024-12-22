<?php

namespace Database\Seeders;

use App\Models\Order;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create 10 orders, each with 3 associated products
        Order::factory()
            ->count(10)
            ->hasProducts(3) // Requires you to define a `products` relationship in the Order factory
            ->create();
    }
}
