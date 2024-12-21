<?php

namespace Database\Factories;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $email = fake()->unique()->safeEmail();

        $gender = ["male", "female"];

        return [
            'name' => fake()->name(),
            'email' => $email,
            'email_verified_at' => now(),
            'password' => Hash::make($email),
            'remember_token' => Str::random(10),
            'phone' => fake()->phoneNumber(),
            'avatar' => 'avatars/male-avatar.png',
            'gender' => $gender[rand(0, 1)],
			'account_type' => 'staff',
			'kra_pin' => "A" . rand(100000, 999999),
			'id_number' => rand(10000000, 99999999),
            'created_at' => Carbon::now()->subDay(rand(3, 12)),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return static
     */
    public function unverified()
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Add Brian Account
     *
     * @return static
     */
    public function brian()
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'Brian',
            'email' => 'brian@marcusmiles.co.ke',
            'email_verified_at' => now(),
            'avatar' => 'avatars/male-avatar.png',
            'phone' => '0722641161',
            'password' => Hash::make('brian@marcusmiles.co.ke'),
            'remember_token' => Str::random(10),
            'gender' => 'male',
        ]);
    }

    /**
     * Add Gacuuru Account
     *
     * @return static
     */
    public function gacuuru()
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'Gacuuru Wa Karenge',
            'email' => 'gacuuruwakarenge@gmail.com',
            'email_verified_at' => now(),
            'avatar' => 'avatars/male-avatar.png',
            'phone' => '0722777990',
            'password' => Hash::make('gacuuruwakarenge@gmail.com'),
            'remember_token' => Str::random(10),
            'gender' => 'male',
        ]);
    }

    /**
     * Add Ciku Account
     *
     * @return static
     */
    public function ciku()
    {
        return $this->state(fn(array $attributes) => [
            'name' => 'Wanjiku Muhandi',
            'email' => 'cikumuhandi@gmail.com',
            'email_verified_at' => now(),
            'avatar' => 'avatars/male-avatar.png',
            'phone' => '0721721357',
            'password' => Hash::make('cikumuhandi@gmail.com'),
            'remember_token' => Str::random(10),
            'gender' => 'female',
        ]);
    }
}
