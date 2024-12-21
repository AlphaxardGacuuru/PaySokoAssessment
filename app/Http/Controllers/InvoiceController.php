<?php

namespace App\Http\Controllers;

use App\Http\Services\InvoiceService;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __construct(protected InvoiceService $service)
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
        $this->validate($request, [
            "userUnitIds" => "required|array",
            "type" => "required|string",
            "month" => "required|integer|min:1",
            "year" => "required|integer",
        ]);

        [$saved, $message, $invoices] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $invoices,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Invoice  $invoice
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
     * @param  \App\Models\Invoice  $invoice
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "userUnitIds" => "nullable|array",
            "type" => "nullable|string",
            "month" => "nullable|integer",
            "year" => "nullable|integer",
        ]);

        [$saved, $message, $invoices] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $invoices,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Invoice  $invoice
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $invoice] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $invoice,
        ], 200);
    }

    /*
     * Get Invoices by Property ID
     */
    public function byPropertyId(Request $request, $id)
    {
        return $this->service->byPropertyId($request, $id);
    }
}
