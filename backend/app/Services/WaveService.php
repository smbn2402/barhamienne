<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WaveService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.wave.base_url');
        $this->apiKey = config('services.wave.api_key');
    }

    public function initPayment($amount, $phone, $currency = 'XOF')
    {
        $response = Http::withToken($this->apiKey)
            ->post($this->baseUrl . 'payments', [
                'amount' => $amount,
                'currency' => $currency,
                'customer' => [
                    'phone_number' => $phone,
                ],
                'callback_url' => route('wave.callback'),
            ]);

        return $response->json();
    }

    public function verifyPayment($paymentId)
    {
        $response = Http::withToken($this->apiKey)
            ->get($this->baseUrl . 'payments/' . $paymentId);

        return $response->json();
    }
}
