<?php

namespace Tests\Unit;

use App\Http\Services\OrderService;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    protected $orderService;

    public function setUp(): void
    {
        parent::setUp();
        $this->orderService = new OrderService();
    }

    /** @test */
    public function it_can_fetch_all_orders()
    {
        // Create some orders with products
        Order::factory()->count(5)->hasProducts(3)->create();

        $response = $this->orderService->index();

        $this->assertCount(5, $response);
    }

    /** @test */
    public function it_can_fetch_a_single_order()
    {
        $order = Order::factory()->create();

        $response = $this->orderService->show($order->id);

        $this->assertEquals($order->id, $response->id);
    }

    /** @test */
    public function it_can_store_an_order()
    {
        // Create a user and authenticate with Sanctum
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum'); // Authenticate the user using Sanctum

        // Mock products and save them to the "cart" cache
        $products = Product::factory()->count(3)->create([
            'price' => 1000,
            'inventory' => 10,
        ]);
        Cache::put('cart', $products);

        // Call the store method on OrderService
        $orderService = app(\App\Http\Services\OrderService::class);

        $request = new \Illuminate\Http\Request();
        $response = $orderService->store($request);

        [$saved, $message, $order] = $response;

        // Assertions
        $this->assertTrue($saved); // Ensure the order was saved successfully
        $this->assertEquals(3, $order->products()->count()); // Ensure all products were linked to the order
        $this->assertEquals(3000, $order->amount); // Ensure the order amount is correct
        $this->assertEquals($user->id, $order->user_id); // Ensure the order is linked to the logged-in user

        // Assert that the inventory for each product was decremented
        foreach ($products as $product) {
            $this->assertEquals(9, $product->fresh()->inventory);
        }

        // Assert that the cart was cleared from the cache
        $this->assertNull(Cache::get('cart'));

        // Assert that the success message is correct
        $this->assertEquals("Order {$order->code} created successfully", $message);
    }

    /** @test */
    public function it_can_delete_an_order()
    {
        $order = Order::factory()->create();

        [$saved, $message, $deletedOrder] = $this->orderService->destroy($order->id);

        $this->assertTrue($saved);
        $this->assertEquals($order->id, $deletedOrder->id);
        $this->assertDatabaseMissing('orders', ['id' => $order->id]);
    }

    /** @test */
    public function it_handles_empty_cart_when_storing_order()
    {
        // Create a user and authenticate with Sanctum
        $user = User::factory()->create();
        $this->actingAs($user, 'sanctum'); // Authenticate the user using Sanctum

        Cache::put('cart', collect([]));

        $request = new \Illuminate\Http\Request();

        [$saved, $message, $order] = $this->orderService->store($request);

        $this->assertFalse($saved); // Order should not be saved
        $this->assertNull($order); // No order created
    }

    /** @test */
    public function it_throws_an_exception_if_product_inventory_is_insufficient()
    {
        $this->expectException(\Exception::class);

        // Create mock products with no inventory
        $products = Product::factory()->count(3)->create(['price' => 100, 'inventory' => 0]);
        Cache::put('cart', $products);

        $request = new \Illuminate\Http\Request();

        $this->orderService->store($request);
    }
}
