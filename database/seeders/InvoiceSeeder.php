<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\UserProperty;
use App\Models\UserUnit;
use App\Models\WaterReading;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Get the current month
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        // Loop from the current month back to January
        for ($month = $currentMonth; $month >= 1; $month--) {
            // Set the current date to the first day of the month
            $date = Carbon::create(null, $month, 1);

            // Get the start and end of the month
            $endOfMonth = $date->endOfMonth();

            // Fetch the user units for the current month
            $userUnits = UserUnit::where("vacated_at", "<=", $endOfMonth)
                ->orWhereNull("vacated_at")
                ->get();

            foreach ($userUnits as $key => $userUnit) {
                $staffId = UserProperty::where("property_id", $userUnit->unit->property_id)
                    ->get()
                    ->random()
                    ->id;

                $this->createRentInvoices($userUnit, $date, $staffId, $key, $month, $currentYear);
                $this->createWaterInvoices($userUnit, $date, $staffId, $key, $month, $currentYear);
                $this->createServiceChargeInvoices($userUnit, $date, $staffId, $key, $month, $currentYear);
            }
        }
    }

    public function createRentInvoices($userUnit, $date, $staffId, $key, $month, $currentYear)
    {
        $amount = $userUnit->unit->rent;

        Invoice::factory()
            ->hasPayments(1, function (array $attributes, Invoice $invoice) use ($userUnit, $date, $staffId, $amount) {
                return [
                    "amount" => $amount,
                    "paid_on" => $date,
                    "created_by" => $staffId,
                ];
            })
            ->create([
                "user_unit_id" => $userUnit->id,
                "type" => "rent",
                "amount" => $amount,
                "balance" => $key < 10 ? $amount : 0,
                "paid" => $key < 10 ? 0 : $amount,
                "month" => $month,
                "year" => $currentYear,
                "created_by" => $staffId,
            ]);
    }

    public function createWaterInvoices($userUnit, $date, $staffId, $key, $month, $currentYear)
    {
        // Get Water Bill
        $amount = WaterReading::where("user_unit_id", $userUnit->id)
            ->where("month", $month)
            ->where("year", $currentYear)
            ->first()
            ->bill;

        Invoice::factory()
            ->hasPayments(1, function (array $attributes, Invoice $invoice) use ($userUnit, $date, $staffId, $amount) {
                return [
                    "amount" => $amount,
                    "paid_on" => $date,
                    "created_by" => $staffId,
                ];
            })
            ->create([
                "user_unit_id" => $userUnit->id,
                "type" => "water",
                "amount" => $amount,
                "balance" => $key < 10 ? $amount : 0,
                "paid" => $key < 10 ? 0 : $amount,
                "month" => $month,
                "year" => $currentYear,
                "created_by" => $staffId,
            ]);
    }

    public function createServiceChargeInvoices($userUnit, $date, $staffId, $key, $month, $currentYear)
    {
        $amount = $userUnit
            ->unit
            ->property
            ->service_charge;

        Invoice::factory()
            ->hasPayments(1, function (array $attributes, Invoice $invoice) use ($userUnit, $date, $staffId, $amount) {
                return [
                    "amount" => $amount,
                    "paid_on" => $date,
                    "created_by" => $staffId,
                ];
            })
            ->create([
                "user_unit_id" => $userUnit->id,
                "type" => "service_charge",
                "amount" => $amount,
                "balance" => $key < 10 ? $amount : 0,
                "paid" => $key < 10 ? 0 : $amount,
                "month" => $month,
                "year" => $currentYear,
                "created_by" => $staffId,
            ]);
    }
}
