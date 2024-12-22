<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FilePondController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MPESATransactionController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('auth', [UserController::class, 'auth']);

Route::apiResources([
    "products" => ProductController::class,
	"cart" => CartController::class,
    "orders" => OrderController::class,
    "invoices" => InvoiceController::class,
    "mpesa-transactions" => MPESATransactionController::class,
    "payments" => PaymentController::class,
    "users" => UserController::class,
    'notifications' => NotificationController::class,
]);

/*
 * Dashboard
 */
Route::get("dashboard/{id}", [DashboardController::class, "index"]);
Route::get("dashboard/properties/{id}", [DashboardController::class, "properties"]);

// Kopokopo STK Push
Route::post("stk-push", [MPESATransactionController::class, 'stkPush']);
Route::post("kopokopo-initiate-transfer", [KopokopoTransferController::class, 'initiateTransfer']);

/*
 * Filepond Controller
 */
Route::prefix('filepond')->group(function () {
    Route::controller(FilePondController::class)->group(function () {
        // User
        Route::post('avatar/{id}', 'updateAvatar');
        Route::post('national-id/{id}', 'updateNationalID');

        // Material
        Route::post("materials", "storeMaterial");
        Route::delete("materials/{id}", "destoryMaterial");

        // Attachment
        Route::post("discussion-forums", "storeAttachment");
        Route::delete("discussion-forums/{id}", "destoryAttachment");

        // Submission
        Route::post("submissions/{sessionId}/{unitId}/{week}/{userId}/{type}", "storeSubmission");
    });
});

// Broadcast Routes
Broadcast::routes(['middleware' => ['auth:sanctum']]);
