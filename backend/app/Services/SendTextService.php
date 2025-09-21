<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use App\Models\SmsLog;

class SendTextService
{
    public function sendSMS(string $phone, string $message, string $type = 'normal', ?string $scheduledAt = null): array
    {
        $payload = [
            'sender_name' => config('services.sendtext.sender_name'),
            'sms_type' => $type,
            'phone' => '221' . $phone,
            'text' => $message,
        ];

        if ($scheduledAt) {
            $payload['scheduled_at'] = $scheduledAt;
        }

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'SNT-API-KEY' => config('services.sendtext.key'),
                'SNT-API-SECRET' => config('services.sendtext.secret'),
            ])->post(config('services.sendtext.url'), $payload);

            $data = $response->json();

            // ✅ Log du SMS envoyé
            // $this->logSms($data);

            return $data;
        } catch (\Exception $e) {
            // Tu peux logguer aussi les erreurs si tu veux
            // SmsLog::create([
            //     'phone' => $phone,
            //     'sender_name' => env('SENDTEXT_SENDER'),
            //     'text' => $message,
            //     'status_id' => 0,
            //     'status_description' => $e->getMessage(),
            // ]);

            return ['error' => true, 'message' => $e->getMessage()];
        }
    }

    public function sendBulkSMS(array $campaignLines, string $campaignName, string $smsType = 'normal', ?string $scheduledAt = null): array
    {
        $payload = [
            'sender_name' => config('services.sendtext.sender_name'),
            'sms_type' => $smsType,
            'campaign_name' => $campaignName,
            'campaign_lines' => $campaignLines,
        ];

        if ($scheduledAt) {
            $payload['scheduled_at'] = $scheduledAt;
        }

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'SNT-API-KEY' => config('services.sendtext.key'),
                'SNT-API-SECRET' => config('services.sendtext.secret'),
            ])->post(config('services.sendtext.bulk_url'), $payload);

            $data = $response->json();

            // ✅ Enregistrement de chaque message
            // if (isset($data['campaignLines'])) {
            //     foreach ($data['campaignLines'] as $line) {
            //         $this->logSms($line);
            //     }
            // }

            return $data;
        } catch (\Exception $e) {
            return ['error' => true, 'message' => $e->getMessage()];
        }
    }

    public function getBalance(): ?array
    {
        try {
            $response = Http::timeout(15)->withHeaders([
                'Content-Type' => 'application/json',
                'SNT-API-KEY' => config('services.sendtext.key'),
                'SNT-API-SECRET' => config('services.sendtext.secret'),
            ])->get(config('services.sendtext.balance_url'));

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'error' => true,
                'status' => $response->status(),
                'message' => 'Non-successful response',
            ];
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage(),
            ];
        }
    }



    private function logSms(array $data): void
    {
        SmsLog::create([
            'phone' => $data['phone'] ?? null,
            'sender_name' => $data['senderName'] ?? config('services.sendtext.sender_name'),
            'text' => $data['text'] ?? '',
            'message_id' => $data['messageId'] ?? null,
            'scheduled_at' => $data['scheduledAt'] ?? null,
            'sendtext_sms_count' => $data['sendtextSmsCount'] ?? 0,
            'status_id' => $data['statusId'] ?? 0,
            'status_description' => $data['statusDescription'] ?? 'Aucune réponse',
        ]);
    }

    public function getStatistics(): ?array
    {
        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'SNT-API-KEY' => config('services.sendtext.key'),
                'SNT-API-SECRET' => config('services.sendtext.secret'),
            ])->get(config('services.sendtext.statistics_url'));

            if ($response->successful()) {
                return $response->json(); // Tableau de statistiques
            }

            return ['error' => true, 'message' => 'Request failed', 'code' => $response->status()];
        } catch (\Exception $e) {
            return ['error' => true, 'message' => $e->getMessage()];
        }
    }
}
