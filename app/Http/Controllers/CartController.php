<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Redis;

class CartController extends Controller
{
	public function __construct(protected CartService $service)
	{
		//
	}
	
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        // Redis::set("name", "Alphaxard");

        // $data = Redis::get("name");

        $cart = $this->service->index();

		return response([
			"status" => "Success",
			"message" => $cart->count(),
			"data" => $cart,
		]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
		[$saved, $message, $cart] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $cart,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\cr  $cr
     * @return \Illuminate\Http\Response
     */
    public function show(cr $cr)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\cr  $cr
     * @return \Illuminate\Http\Response
     */
    public function edit(cr $cr)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\cr  $cr
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, cr $cr)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\cr  $cr
     * @return \Illuminate\Http\Response
     */
    public function destroy($productId)
    {
        $this->service->destroy($productId);
    }
}
