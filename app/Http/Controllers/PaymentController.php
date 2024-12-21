<?php

namespace App\Http\Controllers;

use App\Http\Services\PaymentService;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(protected PaymentService $service)
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
        $this->validate($request, [
            "invoiceId" => "required|string",
            "userId" => "nullable|integer",
            "channel" => "nullable|string",
            "amount" => "required|string|min:1",
            "transactionReference" => "nullable|string",
            "paidOn" => "required|string",
        ]);

        [$saved, $message, $payment] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $payment,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return $this->service->show($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "userId" => "nullable|integer",
            "channel" => "nullable|string",
            "amount" => "nullable|string|min:1",
            "transactionReference" => "nullable|string",
            "paidOn" => "nullable|string",
        ]);

        [$saved, $message, $payment] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $payment,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $payment] = $this->service->destroy($id);

		return response([
			"status" => $deleted,
			"message" => $message,
			"data" => $payment,
		], 200);
    }

    /*
     * Get Water Readings by Property ID
     */
    public function byPropertyId(Request $request, $id)
    {
        return $this->service->byPropertyId($request, $id);
    }
}
