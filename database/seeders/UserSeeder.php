<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $alDoesntExist = User::where('email', 'alphaxardgacuuru47@gmail.com')
            ->doesntExist();

        $gacuuruDoesntExist = User::where('email', 'gacuuruwakarenge@gmail.com')
            ->doesntExist();

        $cikuDoesntExist = User::where('email', 'cikumuhandi@gmail.com')
            ->doesntExist();

        if ($alDoesntExist) {
            User::factory()->al()->create();
        }

        if ($gacuuruDoesntExist) {
            User::factory()->gacuuru()->create();
        }

        if ($cikuDoesntExist) {
            User::factory()->ciku()->create();
        }

        User::factory()->count(10)->create();
    }
}
