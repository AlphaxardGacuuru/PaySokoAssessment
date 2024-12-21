<?php

namespace App\Http\Services;

use App\Http\Resources\CreditNoteResource;
use App\Models\CreditNote;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class CreditNoteService extends Service
{
    /*
     * Fetch All Credit Notes
     */
    public function index($request)
    {
        $creditNotesQuery = new CreditNote;

        $creditNotesQuery = $this->search($creditNotesQuery, $request);

        $creditNotes = $creditNotesQuery
            ->orderBy("id", "DESC")
            ->paginate(20);

        return CreditNoteResource::collection($creditNotes);
    }

    /*
     * Fetch Credit Note
     */
    public function show($id)
    {
        $creditNote = CreditNote::find($id);

        return new CreditNoteResource($creditNote);
    }

    /*
     * Save Credit Note
     */
    public function store($request)
    {
        $creditNote = new CreditNote();
        $creditNote->invoice_id = $request->invoiceId;
        $creditNote->description = $request->description;
        $creditNote->amount = $request->amount;
        $creditNote->created_by = $this->id;

        $saved = DB::transaction(function () use ($creditNote) {
            $saved = $creditNote->save();

            $this->updateInvoice($creditNote->invoice_id);

            return $saved;
        });

        return [$saved, "Credit Note created successfully", $creditNote];
    }

    /*
     * Update Credit Note
     */
    public function update($request, $id)
    {
        $creditNote = CreditNote::find($id);

        if ($request->filled("amount")) {
            $creditNote->amount = $request->amount;
        }

        if ($request->filled("description")) {
            $creditNote->description = $request->description;
        }

        $saved = DB::transaction(function () use ($creditNote) {
            $saved = $creditNote->save();

            $this->updateInvoice($creditNote->invoice_id);

            return $saved;
        });

        return [$saved, "Credit Note updated", $creditNote];
    }

    /*
     * Destroy Credit Note
     */
    public function destroy($id)
    {
        $creditNote = CreditNote::findOrFail($id);

        $deleted = DB::transaction(function () use ($creditNote) {
            $deleted = $creditNote->delete();

            $this->updateInvoice($creditNote->invoice_id);

            return $deleted;
        });

        return [$deleted, "Credit Note deleted successfully", $creditNote];
    }

    /*
     * Get Credit Notes by Property ID
     */
    public function byPropertyId($request, $id)
    {
        $ids = explode(",", $id);

        $creditNotesQuery = CreditNote::whereHas("invoice.userUnit.unit.property", function ($query) use ($ids) {
            $query->whereIn("id", $ids);
        });

        $creditNotesQuery = $this->search($creditNotesQuery, $request);

        $sum = $creditNotesQuery->sum("amount");

        $creditNotes = $creditNotesQuery
            ->orderBy("id", "DESC")
            ->paginate(20);

        return CreditNoteResource::collection($creditNotes)
            ->additional([
                "sum" => number_format($sum),
            ]);
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        $tenant = $request->input("tenant");

        if ($request->filled("tenant")) {
            $query = $query
                ->whereHas("userUnit.user", function ($query) use ($tenant) {
                    $query->where("name", "LIKE", "%" . $tenant . "%");
                });
        }

        $unit = $request->input("unit");

        if ($request->filled("unit")) {
            $query = $query
                ->whereHas("userUnit.unit", function ($query) use ($unit) {
                    $query->where("name", "LIKE", "%" . $unit . "%");
                });
        }

        $type = $request->input("type");

        if ($request->filled("type")) {
            $query = $query->where("type", $type);
        }

        $propertyId = $request->input("propertyId");

        if ($request->filled("propertyId")) {
            $query = $query->whereHas("userUnit.unit.property", function ($query) use ($propertyId) {
                $query->where("id", $propertyId);
            });
        }

        $startMonth = $request->input("startMonth");
        $endMonth = $request->input("endMonth");
        $startYear = $request->input("startYear");
        $endYear = $request->input("endYear");

        if ($request->filled("startMonth")) {
            $query = $query->where("month", ">=", $startMonth);
        }

        if ($request->filled("endMonth")) {
            $query = $query->where("month", "<=", $endMonth);
        }

        if ($request->filled("startYear")) {
            $query = $query->where("year", ">=", $startYear);
        }

        if ($request->filled("endYear")) {
            $query = $query->where("year", "<=", $endYear);
        }

        return $query;
    }

    /*
     * Handle Invoice Update
     */
    public function updateInvoice($invoiceId)
    {
        $paid = Payment::where("invoice_id", $invoiceId)
            ->sum("amount");

        $credit = CreditNote::where("invoice_id", $invoiceId)
            ->sum("amount");

        $paid = $paid + $credit;

        $invoice = Invoice::find($invoiceId);

        $balance = $invoice->amount - $paid;

        // Check if paid is enough
        if ($paid == 0) {
            $status = "not_paid";
        } else if ($paid < $invoice->amount) {
            $status = "partially_paid";
        } else if ($paid == $invoice->amount) {
            $status = "paid";
        } else {
            $status = "over_paid";
        }

        $invoice->paid = $paid;
        $invoice->balance = $balance;
        $invoice->status = $status;

        return $invoice->save();
    }
}
