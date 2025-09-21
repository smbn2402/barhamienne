<?php

use Illuminate\Support\Facades\Route;
use App\Services\InfobipSdkService;
use App\Services\SendTextService;
use App\Http\Controllers\WaveWebhookController;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

Route::get('/test-sms', function (InfobipSdkService $smsService) {
    $smsService->sendSms('+221778864621', 'Test SMS Laravel avec SDK Infobip');

    return 'SMS envoyé';
});

Route::get('/send-text', function (SendTextService $smsService) {
    $smsService->sendSms('221768350441', 'Test SMS Laravel avec sendText');

    return 'SMS envoyé';
});

Route::get('/test/details/{reference}', [WaveWebhookController::class, 'getReservationDetails']);

require __DIR__.'/auth.php';
