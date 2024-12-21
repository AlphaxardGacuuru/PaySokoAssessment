<?php

namespace App\Http\Services;

use App\Http\Resources\MPESATransactionResource;
use App\Models\MPESATransaction;
use App\Models\User;
use Kopokopo\SDK\K2;

class MPESATransactionService extends Service
{
    /*
     * Show All Card Transactions
     */
    public function index($request)
    {
        $mpesaTransactions = MPESATransaction::orderBy("id", "DESC")->paginate(20);

        $sum = MPESATransaction::sum("amount");

        // Check if total is request
        if ($request->total) {
            return ["data" => number_format($sum)];
        } else {
            return MPESATransactionResource::collection($mpesaTransactions);
        }
    }

    /*
     * Store MPESA Transaction
     */
    public function store($request)
    {
        // Shorten attributes
        $attributes = $request->data['attributes'];
        // Shorten event
        $event = $attributes['event'];
        // Shorten resource
        $resource = $event['resource'];

        // Get username
        $betterPhone = substr_replace($resource['sender_phone_number'], '0', 0, -9);

        $user = User::where('phone', $betterPhone)->first();

        $mpesaTransaction = new MPESATransaction;
        $mpesaTransaction->kopokopo_id = $request->data['id'];
        $mpesaTransaction->type = $request->data['type'];
        $mpesaTransaction->initiation_time = $attributes['initiation_time'];
        $mpesaTransaction->status = $attributes['status'];
        $mpesaTransaction->event_type = $event['type'];
        $mpesaTransaction->resource_id = $resource['id'];
        $mpesaTransaction->reference = $resource['reference'];
        $mpesaTransaction->origination_time = $resource['origination_time'];
        $mpesaTransaction->sender_phone_number = $resource['sender_phone_number'];
        $mpesaTransaction->amount = round($resource['amount'], 0);
        $mpesaTransaction->currency = $resource['currency'];
        $mpesaTransaction->till_number = $resource['till_number'];
        $mpesaTransaction->system = $resource['system'];
        $mpesaTransaction->resource_status = $resource['status'];
        $mpesaTransaction->sender_first_name = $resource['sender_first_name'];
        $mpesaTransaction->sender_middle_name = $resource['sender_middle_name'];
        $mpesaTransaction->sender_last_name = $resource['sender_last_name'];
        $mpesaTransaction->user_id = $user->id;
        $saved = $mpesaTransaction->save();

        $message = "Transaction Saved successfully";

        return [$saved, $message, $mpesaTransaction, $user];
    }

    /**
     * Send STK Push to Kopokopo.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function stkPush($request)
    {
        // Get phone in better format
        // $betterPhone = substr_replace(auth('sanctum')->user()->phone, '+254', 0, -9);
        $betterPhone = substr_replace("0700364446", '+254', 0, -9);

        // Get first and last name
        $parts = explode(" ", auth('sanctum')->user()->name);

        $lastname = array_pop($parts);

        $firstname = implode(" ", $parts);

        $K2 = new K2($this->options());

        // Get one of the services
        $tokens = $K2->TokenService();

        // Use the service
        $result = $tokens->getToken();

        if ($result['status'] == 'success') {
            $data = $result['data'];
            // echo "My access token is: " . $data['accessToken'] . " It expires in: " . $data['expiresIn'] . "<br>";
        }

        // STKPush
        $stk = $K2->StkService();
        $response = $stk->initiateIncomingPayment([
            'paymentChannel' => 'M-PESA STK Push',
            'tillNumber' => 'K433842',
            'firstName' => $firstname,
            'lastName' => $lastname,
            'phoneNumber' => $betterPhone,
            'amount' => $request->input('amount'),
            'currency' => 'KES',
            'email' => auth('sanctum')->user()->email,
            // 'callbackUrl' => 'https://pay.black.co.ke/api/kopokopo',
            'callbackUrl' => 'http://localhost:8004/api/mpesa-transactions',
            'accessToken' => $data['accessToken'],
        ]);

        if ($response['status'] == 'success') {
            $data = $result['data'];
            // echo "The resource location is: " . json_encode($response['location']);
            // => 'https://sandbox.kopokopo.com/api/v1/incoming_payments/247b1bd8-f5a0-4b71-a898-f62f67b8ae1c'
            return response(["message" => "Request sent to your phone"], 200);
        } else {
            return response(["message" => $response], 400);
        }
    }

	/*
	* Kopokopo Environment Variables
	*/ 
	public static function options()
	{
        return  [
            'clientId' => env('KOPOKOPO_CLIENT_ID_SANDBOX'),
            // 'clientId' => env('KOPOKOPO_CLIENT_ID'),
            'clientSecret' => env('KOPOKOPO_CLIENT_SECRET_SANDBOX'),
            // 'clientSecret' => env('KOPOKOPO_CLIENT_SECRET'),
            'apiKey' => env('KOPOKOPO_API_KEY_SANDBOX'),
            // 'apiKey' => env('KOPOKOPO_API_KEY'),
            'baseUrl' => env('KOPOKOPO_BASE_URL_SANDBOX'),
            // 'baseUrl' => env('KOPOKOPO_BASE_URL'),
        ];
	}
}
