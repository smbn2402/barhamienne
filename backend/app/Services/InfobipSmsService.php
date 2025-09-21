<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class InfobipSmsService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected string $sender;

    public function __construct()
    {
        $this->baseUrl = config('services.infobip.base_url');
        $this->apiKey = config('services.infobip.api_key');
        $this->sender = config('services.infobip.sender');
    }

    public function sendSms(string $to, string $message): bool
    {
        $response = Http::withHeaders([
            'Authorization' => $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->post("{$this->baseUrl}/sms/2/text/advanced", [
            'messages' => [[
                'from' => $this->sender,
                'destinations' => [[ 'to' => $to ]],
                'text' => $message,
            ]]
        ]);

        return $response->successful();
    }
}
