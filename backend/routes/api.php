<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\MomentController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\TrajetController;
use App\Http\Controllers\CaravaneController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ArriveeController;
use App\Http\Controllers\ArriveeMomentController;
use App\Http\Controllers\DepartController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\YobanteController;
use App\Http\Controllers\DepartMomentController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\SmsLogController;
use App\Http\Controllers\SmsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\OrangeMoneyController;
use App\Http\Controllers\WaveController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    $user = $request->user()->load('roles:id,name'); // Charge les rôles avec juste id et name

    return response()->json([
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'roles' => $user->roles->map(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
            ];
        }),
    ]);
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('caravanes/statistiques', [CaravaneController::class, 'getStatistiquesCaravanes']);
});

/*
|--------------------------------------------------------------------------
| 🚀 Routes publiques
|--------------------------------------------------------------------------
*/
Route::prefix('clients')->group(function () {
    Route::post('/', [ClientController::class, 'store']);
    Route::get('/statistiques', [ClientController::class, 'getStatistiquesClients']);
});
Route::prefix('moments')->group(function () {
    Route::get('/', [MomentController::class, 'index']);
    Route::get('/{moment}', [MomentController::class, 'show']);
});
Route::post('paiements', [PaiementController::class, 'store']);
Route::prefix('trajets')->group(function () {
    Route::get('/', [TrajetController::class, 'index']);
    Route::get('/{trajet}', [TrajetController::class, 'show']);
});
Route::prefix('caravanes')->group(function () {
    Route::get('/', [CaravaneController::class, 'index']);
    Route::get('/{caravane}', [CaravaneController::class, 'show']);
    Route::get('/trajet/{trajetId}', [CaravaneController::class, 'getCaravanesByTrajet']);
    Route::get('/trajet/{trajetId}/moment/{momentId}', [CaravaneController::class, 'getCaravanesByTrajetAndMoment']);
});
Route::prefix('buses')->group(function () {
    Route::get('/', [BusController::class, 'index']);
    Route::get('/{bus}', [BusController::class, 'show']);
});
Route::prefix('places')->group(function () {
    Route::get('/', [PlaceController::class, 'index']);
    Route::get('/{place}', [PlaceController::class, 'show']);
});
Route::prefix('arrivees')->group(function () {
    Route::get('/', [ArriveeController::class, 'index']);
    Route::get('/{arrivee}', [ArriveeController::class, 'show']);
    Route::get('/trajet/{trajetId}', [ArriveeController::class, 'getArriveesByTrajet']);
    Route::get('/caravane/{caravaneId}', [ArriveeController::class, 'getArriveesByCaravane']);
});
Route::prefix('departs')->group(function () {
    Route::get('/', [DepartController::class, 'index']);
    Route::get('/{depart}', [DepartController::class, 'show']);
    Route::get('/trajet/{trajetId}', [DepartController::class, 'getDepartsByTrajet']);
});
Route::prefix('reservations')->group(function () {
    Route::post('/', [ReservationController::class, 'store']);
    Route::get('/statistiques', [ReservationController::class, 'getStatistiques']);
    Route::get('/statistiques-par-mois', [ReservationController::class, 'getReservationsParMois']);
    Route::get('/statistiques-statut-par-mois', [ReservationController::class, 'getReservationsParStatutParMois']);
    Route::get('/{reservation}', [ReservationController::class, 'show']);
});
Route::prefix('yobantes')->group(function () {
    Route::post('/', [YobanteController::class, 'store']);
    Route::get('/statistiques', [YobanteController::class, 'getStatistiques']);
});
Route::prefix('depart-moments')->group(function () {
    Route::get('/', [DepartMomentController::class, 'index']);
    Route::get('/{departMoment}', [DepartMomentController::class, 'show']);
    Route::get('/moments/{departId}', [DepartMomentController::class, 'getMomentsByDepart']);
    Route::get('/trajet/{trajetId}', [DepartMomentController::class, 'getDepartMomentsByTrajet']);
    Route::get('/trajet/{trajetId}/moment/{momentId}', [DepartMomentController::class, 'getDepartMomentsByTrajetAndMoment']);
    Route::get('/caravane/{caravaneId}', [DepartMomentController::class, 'getDepartMomentsByCaravane']);
    Route::get('/principale/caravane/{caravaneId}', [DepartMomentController::class, 'getDepartMomentsPrincipaleByCaravane']);
});
Route::prefix('arrivee-moments')->group(function () {
    Route::get('/', [ArriveeMomentController::class, 'index']);
    Route::get('/{arriveeMoment}', [ArriveeMomentController::class, 'show']);
    Route::get('/trajet/{trajetId}/moment/{momentId}', [ArriveeMomentController::class, 'getArriveeMomentsByTrajetAndMoment']);
    Route::get('/principale/caravane/{caravaneId}', [ArriveeMomentController::class, 'getArriveeMomentsPrincipaleByCaravane']);
});
Route::post('contact-messages', [ContactMessageController::class, 'store']);
Route::post('sms-logs', [SmsLogController::class, 'store']);

/*
|--------------------------------------------------------------------------
| Routes paiement
|--------------------------------------------------------------------------
*/

Route::prefix('payments')->group(function () {
    Route::post('/om', [OrangeMoneyController::class, 'generatePayment']);
    Route::post('/om/webhook', [OrangeMoneyController::class, 'callback']);
    Route::post('/wave', [WaveController::class, 'generatePayment']);
    Route::post('/wave/webhook', [WaveController::class, 'callback']);
});

/*
|--------------------------------------------------------------------------
| 🔐 Routes protégées par middleware
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('clients', ClientController::class)->except(['store']);
    Route::apiResource('moments', MomentController::class)->except(['index', 'show']);
    Route::apiResource('paiements', PaiementController::class)->except(['store']);
    Route::apiResource('trajets', TrajetController::class)->except(['index', 'show']);

    Route::apiResource('caravanes', CaravaneController::class)->except(['index', 'show']);
    Route::apiResource('buses', BusController::class)->except(['index', 'show']);
    Route::apiResource('places', PlaceController::class)->except(['index', 'show']);
    Route::apiResource('arrivees', ArriveeController::class)->except(['index', 'show']);
    Route::post('arrivees/update-order', [DepartController::class, 'updateOrder']);
    Route::apiResource('departs', DepartController::class)->except(['index', 'show']);
    Route::post('departs/update-order', [DepartController::class, 'updateOrder']);
    Route::apiResource('reservations', ReservationController::class)->except(['store', 'show']);
    Route::get('reservations/caravanes/{caravaneId}', [ReservationController::class, 'getReservationsByCaravane']);
    Route::post('reservations/send-messages', [ReservationController::class, 'sendMessages']);
    Route::post('reservations/send-bulk-message', [ReservationController::class, 'sendBulkMessage']);
    Route::get('reservations/statistiques/caravane/{id}', [ReservationController::class, 'statistiquesParCaravane']);
    Route::apiResource('yobantes', YobanteController::class)->except(['store']);
    Route::get('yobantes/caravane/{caravane_id}', [YobanteController::class, 'getYobantesByCaravane']);
    Route::apiResource('depart-moments', DepartMomentController::class)->except(['index', 'show']);
    Route::apiResource('arrivee-moments', ArriveeMomentController::class)->except(['index', 'show']);
    Route::apiResource('contact-messages', ContactMessageController::class)->except(['store']);
    Route::apiResource('sms-logs', SmsLogController::class)->except(['store']);
    Route::prefix('sms')->group(function () {
        Route::post('/send', [SmsController::class, 'send']);
        Route::post('/send-bulk', [SmsController::class, 'sendBulk']);
        Route::get('/balance', [SmsController::class, 'balance']);
        Route::get('/statistics', [SmsController::class, 'statistics']);
    });
});

Route::middleware(['auth:sanctum', 'role:super-admin'])->group(function () {
    Route::prefix('utilisateurs')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
        Route::get('/roles', [UserController::class, 'roles']);
        Route::post('/send-reset-password-link', [UserController::class, 'sendResetPasswordLink']);
    });

    Route::prefix('webhooks')->group(function () {
        Route::post('/om', [OrangeMoneyController::class, 'register']);
        Route::get('/om', [OrangeMoneyController::class, 'getCallback']);
    });
});
