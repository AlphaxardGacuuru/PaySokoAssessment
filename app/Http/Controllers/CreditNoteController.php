<?php

namespace App\Http\Controllers;

use App\Http\Services\CreditNoteService;
use Illuminate\Http\Request;

class CreditNoteController extends Controller
{
    public function __construct(protected CreditNoteService $service)
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
            "invoiceId" => "required|integer",
            "description" => "required|string",
            "amount" => "required|integer",
        ]);

        [$saved, $message, $creditNotes] = $this->service->store($request);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $creditNotes,
        ], 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\CreditNote  $creditNote
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
     * @param  \App\Models\CreditNote  $creditNote
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            "description" => "nullable|string",
            "amount" => "nullable|integer",
        ]);

        [$saved, $message, $creditNotes] = $this->service->update($request, $id);

        return response([
            "status" => $saved,
            "message" => $message,
            "data" => $creditNotes,
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\CreditNote  $creditNote
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        [$deleted, $message, $creditNote] = $this->service->destroy($id);

        return response([
            "status" => $deleted,
            "message" => $message,
            "data" => $creditNote,
        ], 200);
    }

    /*
     * Get CreditNotes by Property ID
     */
    public function byPropertyId(Request $request, $id)
    {
        return $this->service->byPropertyId($request, $id);
    }
}
