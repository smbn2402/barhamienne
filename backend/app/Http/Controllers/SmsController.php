<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SendTextService;

class SmsController extends Controller
{
    protected $smsService;

    public function __construct(SendTextService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function send(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'required|string',
            'message' => 'required|string',
            'type' => 'nullable|in:normal,flash',
            'scheduled_at' => 'nullable|date',
        ]);

        $response = $this->smsService->sendSMS(
            $validated['phone'],
            $validated['message'],
            $validated['type'] ?? 'normal',
            $validated['scheduled_at'] ?? null
        );

        return response()->json($response);
    }

    public function sendBulk(Request $request)
    {
        $validated = $request->validate([
            'campaign_name' => 'required|string',
            'campaign_lines' => 'required|array',
            'campaign_lines.*.phone' => 'required|string',
            'campaign_lines.*.text' => 'required|string',
            'sms_type' => 'nullable|in:normal,flash',
            'scheduled_at' => 'nullable|date',
        ]);

        $response = $this->smsService->sendBulkSMS(
            $validated['campaign_lines'],
            $validated['campaign_name'],
            $validated['sms_type'] ?? 'normal',
            $validated['scheduled_at'] ?? null
        );

        return response()->json($response);
    }

    public function balance()
    {
        $balance = $this->smsService->getBalance();

        return response()->json($balance ?? ['error' => true, 'message' => 'Unable to retrieve balance']);
    }

    public function statistics()
    {
        $stats = $this->smsService->getStatistics();

        return response()->json($stats);
    }
}
