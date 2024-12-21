<?php

namespace App\Http\Services;

class Service
{
    public $id;

    public function __construct()
    {
        // Current User ID
        $auth = auth('sanctum')->user();

        $this->id = $auth ? $auth->id : 0;
    }
}
