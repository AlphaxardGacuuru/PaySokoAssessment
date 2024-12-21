<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Services\DashboardService;

class DashboardController extends Controller
{
    public function __construct(protected DashboardService $service)
    {
        //
    }

    /*
     * Get Dashboard Data
     */
    public function index($propertyIds)
    {
        $propertyIds = explode(",", $propertyIds);

        $data = $this->service->index($propertyIds);

        return response(["data" => $data], 200);
    }

    /*
     * Get Property Data by ID
     */
    public function properties($propertyIds)
    {
        $propertyIds = explode(",", $propertyIds);

        $data = $this->service->properties($propertyIds);

        return response(["data" => $data], 200);
    }
}
