<?php

namespace App\Http\Controllers;

use App\Http\Services\MPESATransactionService;
use App\Models\MPESATransaction;
use Illuminate\Http\Request;

class MPESATransactionController extends Controller
{
    public function __construct(protected MPESATransactionService $service)
    {
        //
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        return $this->service->index($request);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        [$saved, $message, $mpesaTransaction] = $this->service->store($request);

        return response([
            "status" => $saved ? "success" : "failed",
            "message" => $message,
            "data" => $mpesaTransaction,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\MPESATransaction  $mPESATransaction
     * @return \Illuminate\Http\Response
     */
    public function show(MPESATransaction $mPESATransaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\MPESATransaction  $mPESATransaction
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, MPESATransaction $mPESATransaction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\MPESATransaction  $mPESATransaction
     * @return \Illuminate\Http\Response
     */
    public function destroy(MPESATransaction $mPESATransaction)
    {
        //
    }

    /**
     * Send STK Push to Kopokopo.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function stkPush(Request $request)
    {
        return $this->service->stkPush($request);
    }
}
