<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Reservation;
use App\Models\DepartMoment;
use App\Services\SmsNotificationService;

class OrangeMoneyController extends Controller
{
    private function getAccessToken()
    {
        $clientId = config('services.om.client_id');
        $clientSecret = config('services.om.client_secret');

        $response = Http::timeout(30)->withBasicAuth($clientId, $clientSecret)
            ->asForm()
            ->post(config('services.om.base_url') . '/oauth/v1/token', [
                'grant_type' => 'client_credentials',
            ]);

        return $response->json()['access_token'] ?? null;
    }

    public function generatePayment(Request $request)
    {
        $validatedData = $request->validate([
            'montant' => 'required|numeric|min:100',
            'reservation_id' => 'required|exists:reservations,id',
        ]);

        $token = $this->getAccessToken();

        if (!$token) {
            return response()->json(['error' => 'Token not generated'], 500);
        }

        $response = Http::withToken($token)->post(config('services.om.base_url') . '/api/eWallet/v4/qrcode', [
            'amount' => [
                'unit' => 'XOF',
                'value' => $validatedData['montant'],
            ],
            'callbackCancelUrl' => 'https://barhamienne-transport.com/checkout-error?reservation_id=' . $validatedData['reservation_id'],
            'callbackSuccessUrl' => 'https://barhamienne-transport.com/checkout-success?reservation_id=' . $validatedData['reservation_id'],
            'code' => config('services.om.merchant_key'),
            'metadata' => [
                'reservation_id' => $validatedData['reservation_id'],
            ],
            'name' => 'Barhamienne Transport',
            'validity' => 86400
        ]);

        if (!$response->ok()) {
            Log::error('Erreur API OM', [
                'status' => $response->status(),
                'body' => $response->body(),
                'json' => $response->json(),
            ]);

            return response()->json([
                'error' => 'Erreur OM',
                'status' => $response->status(),
                'response' => $response->json()
            ], 500);
        }

        $reservation = Reservation::findOrFail($validatedData['reservation_id']);

        $paiement = $reservation->paiements()->create([
            'date' => now(),
            'montant' => $validatedData['montant'],
            'methode' => 'ORANGE_MONEY',
            'statut' => 'EN_ATTENTE',
        ]);

        return response()->json([
            'paiement' => $paiement,
            'reservation' => $reservation->load('paiements'),
            'orange_response' => $response->json(), // contient probablement le QR code ou deeplink
        ]);
    }

    public function callback(Request $request, SmsNotificationService $notificationService)
    {
        Log::info('Callback Orange reçu', $request->all());

        $reservationId = $request->input('metadata.reservation_id');

        if (!$reservationId) {
            return response()->json(['message' => 'ID de réservation manquant'], 400);
        }

        $reservation = Reservation::find($reservationId);
        if (!$reservation) {
            return response()->json(['message' => 'Réservation non trouvée'], 404);
        }

        // Récupère le dernier paiement créé pour cette réservation
        $paiement = $reservation->paiements()->latest()->first();
        if (!$paiement) {
            return response()->json(['message' => 'Paiement non trouvé'], 404);
        }

        $statut = $request->input('status') === 'SUCCESS' ? 'CONFIRMEE' : 'ECHOUEE';

        $paiement->update(['statut' => $statut, 'updated_at' => now()]);
        $reservation->update(['statut' => $statut, 'updated_at' => now()]);

        $departMoment = DepartMoment::where('id', $reservation->depart_moment_id)->with(['depart', 'moment'])->first();

        $notificationService->sendConfirmationReservation($reservation, $departMoment);

        return response()->json([
            'message' => 'Paiement mis à jour',
            'statut' => $statut,
        ], 200);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'callbackUrl' => 'required|url',
        ]);

        $token = $this->getAccessToken();

        if (!$token) {
            return response()->json(['error' => 'Échec de génération du token OM'], 500);
        }

        $payload = [
            'apiKey' => config('services.om.api_key'),
            'callbackUrl' => $validated['callbackUrl'], // URL dynamique depuis Angular
            'code' => config('services.om.merchant_key'),
            'name' => 'Barhamienne Transport',
        ];

        $response = Http::withToken($token)
            ->withHeaders([
                'Accept' => 'application/json',
            ])
            ->post(config('services.om.base_url') . '/api/notification/v1/merchantcallback', $payload);

        if ($response->successful()) {
            return response()->json(['message' => 'Webhook enregistré avec succès.']);
        }

        return response()->json([
            'error' => 'Erreur OM',
            'status' => $response->status(),
            'response' => $response->json(),
        ], 500);
    }

    public function getCallback()
    {
        $token = $this->getAccessToken();

        if (!$token) {
            return response()->json(['error' => 'Token non obtenu'], 500);
        }

        $response = Http::timeout(30)->withToken($token)
            ->withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->get(config('services.om.base_url') . '/api/notification/v1/merchantcallback', [
                'code' => config('services.om.merchant_key'),
                'page' => 0,
                'size' => 20,
            ]);

        if ($response->successful()) {
            return response()->json($response->json());
        }

        return response()->json([
            'error' => 'Impossible de récupérer les callbacks',
            'status' => $response->status(),
            'response' => $response->json(),
        ], 500);
    }

    // https://barhamienne-transport/payments/om/webhook
}
