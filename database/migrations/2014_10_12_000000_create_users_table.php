<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable()->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->string('password');
            $table->string('phone')->nullable()->unique();
            $table->string('avatar')->default('avatars/male-avatar.png');
            $table->string('gender')->nullable();
            $table->string('account_type')->nullable();
            $table->string('location')->nullable();
            $table->string('kra_pin')->nullable();
            $table->string('id_number')->nullable();
            $table->string('national_id_file')->nullable();
			$table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
