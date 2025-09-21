<?php

namespace App\Services;

use Mediumart\Orange\SMS\SMS;
use Mediumart\Orange\SMS\Http\SMSClient;
use Illuminate\Support\Facades\Log;
use App\Models\SmsLog;

class OrangeSmsService
{
    protected $client;

    public function __construct()
    {
        $clientId = config('services.orange_sms.client_id');
        $clientSecret = config('services.orange_sms.client_secret');

        $this->client = SMSClient::getInstance($clientId, $clientSecret);
    }

    public function sendSMS(string $phone, string $message): array
    {
        try {
            $sms = new SMS($this->client);

            $response = $sms->to('221' . $phone)
                ->from(config('services.orange.sender_name', '+221778864621'))
                ->message($message)
                ->send();

            return ['success' => true, 'response' => $response];
        } catch (\Exception $e) {
            Log::error('Erreur envoi SMS Orange : ' . $e->getMessage());

            return ['error' => true, 'message' => $e->getMessage()];
        }
    }
}
