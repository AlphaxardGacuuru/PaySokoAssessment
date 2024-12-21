<?php

namespace App\Http\Services;

use App\Http\Resources\PaymentResource;
use App\Models\CreditNote;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class PaymentService extends Service
{
    /*
     * Display the specified resource.
     */
    public function show($id)
    {
        $payment = Payment::findOrFail($id);

        return new PaymentResource($payment);
    }

    /*
     * Store a newly created resource in storage.
     */
    public function store($request)
    {
        $payment = new Payment;
        $payment->invoice_id = $request->invoiceId;
        $payment->user_id = $request->userId;
        $payment->amount = $request->amount;
        $payment->transaction_reference = $request->transactionReference;
        $payment->channel = $request->channel;
        $payment->paid_on = $request->paidOn;
        $payment->created_by = $this->id;

        $saved = DB::transaction(function () use ($payment) {
            $saved = $payment->save();

            $this->updateInvoice($payment->invoice_id);

            return $saved;
        });

        $message = "Payment added successfully";

        return [$saved, $message, $payment];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($request, $id)
    {
        $payment = Payment::findOrFail($id);

        if ($request->filled("amount")) {
            $payment->amount = $request->input("amount");
        }

        if ($request->filled("transactionReference")) {
            $payment->transaction_reference = $request->input("transactionReference");
        }

        if ($request->filled("channel")) {
            $payment->channel = $request->input("channel");
        }

        if ($request->filled("paidOn")) {
            $payment->paid_on = $request->input("paidOn");
        }

        $saved = DB::transaction(function () use ($payment) {
            $saved = $payment->save();

            $this->updateInvoice($payment->invoice_id);

            return $saved;
        });

        $message = "Payment updated successfully";

        return [$saved, $message, $payment];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);

        $deleted = DB::transaction(function () use ($payment) {
            $deleted = $payment->delete();

            $this->updateInvoice($payment->invoice_id);

            return $deleted;
        });

        $message = "Payment deleted successfully";

        return [$deleted, $message, $payment];
    }

    /*
     * Get Invoices by Property ID
     */
    public function byPropertyId($request, $id)
    {
        $ids = explode(",", $id);

        $paymentsQuery = Payment::whereHas("invoice.userUnit.unit.property", function ($query) use ($ids) {
            $query->whereIn("id", $ids);
        });

        $paymentsQuery = $this->search($paymentsQuery, $request);

        $sum = $paymentsQuery->sum("amount");

        $payments = $paymentsQuery
            ->orderBy("id", "DESC")
            ->paginate(20);

        return PaymentResource::collection($payments)
            ->additional(["sum" => number_format($sum)]);
    }

    /*
     * Handle Search
     */
    public function search($query, $request)
    {
        $tenant = $request->input("tenant");

        if ($request->filled("tenant")) {
            $query = $query
                ->whereHas("invoice.userUnit.user", function ($query) use ($tenant) {
                    $query->where("name", "LIKE", "%" . $tenant . "%");
                });
        }

        $unit = $request->input("unit");

        if ($request->filled("unit")) {
            $query = $query
                ->whereHas("invoice.userUnit.unit", function ($query) use ($unit) {
                    $query->where("name", "LIKE", "%" . $unit . "%");
                });
        }

        $propertyId = $request->input("propertyId");

        if ($request->filled("propertyId")) {
            $query = $query->whereHas("invoice.userUnit.unit.property", function ($query) use ($propertyId) {
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
