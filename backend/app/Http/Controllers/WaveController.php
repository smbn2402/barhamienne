<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use App\Models\Paiement;
use App\Models\Reservation;

class WaveController extends Controller
{
    public function generatePayment(Request $request)
    {
        $validatedData = $request->validate([
            'montant' => 'required|numeric|min:100',
            'reservation_id' => 'required'
        ]);

        $api_key = env('WAVE_API_KEY');

        $checkout_params = [
            "amount" => $validatedData['montant'],
            "client_reference" => $validatedData['reservation_id'],
            "currency" => "XOF",
            "error_url" => "https://barhamienne-transport.com/checkout-error?reservation_id=" . $validatedData['reservation_id'],
            "success_url" => "https://barhamienne-transport.com/checkout-success?reservation_id=" . $validatedData['reservation_id'],
        ];

        $curlOptions = [
            CURLOPT_URL => "https://api.wave.com/v1/checkout/sessions",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($checkout_params),
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$api_key}",
                "Content-Type: application/json"
            ],
        ];

        $curl = curl_init();
        curl_setopt_array($curl, $curlOptions);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            Log::error('Erreur API Wave', ['error' => $err]);
            return response()->json(['error' => 'Erreur lors de la communication avec Wave.'], 500);
        } else {
            $checkout_session = json_decode($response);

            if (isset($checkout_session->wave_launch_url)) {
                $paiement = Paiement::create([
                    'date' => now(),
                    'montant' => $validatedData['montant'],
                    'methode' => 'WAVE',
                ]);

                $reservation = Reservation::find($validatedData['reservation_id']);
                if (!$reservation) {
                    return response()->json(['message' => 'Reservation non trouvée'], 404);
                }
                $reservation->paiement_id = $paiement->id;
                $reservation->save();

                return response()->json([
                    'paiement' => $paiement,
                    'reservation' => $reservation,
                    'wave_response' => $checkout_session
                ]);
            } else {
                Log::error('Réponse inattendue de Wave', ['response' => $checkout_session]);
                return response()->json(['error' => 'Réponse inattendue de l’API Wave.'], 500);
            }
        }
    }

    public function callback(Request $request)
    {
        Log::info('Callback Wave reçu', $request->all());


        // Cette clé vous est remise par un représentant Wave lors de notre inscription
        // l'URL de votre webhook. (Ceci est différent de la clé API)
        $wave_webhook_secret = env('WAVE_WEBHOOK_TEST_SECRET');
        //dd($_SERVER['HTTP_WAVE_SIGNATURE']);
        // # Cet en-tête est envoyé par Wave dans chaque requête POST du webhook.
        // (L'en-tête HTTP simple est 'Wave-Signature')
        $wave_signature = $_SERVER['HTTP_WAVE_SIGNATURE'];

        // Le corps de la requête, sous forme de chaîne simple, pas encore analysé en JSON :
        $webhook_body = file_get_contents('php://input');

        $webhook_json = $this->webhook_verify_signature_and_decode($wave_webhook_secret, $wave_signature, $webhook_body);

        // Vous pouvez maintenant utiliser les données du webhook pour traiter la demande :
        $webhook_type = $webhook_json->type;
        $webhook_data = $webhook_json->data;

        $reservationId = $webhook_data->client_reference;

        if ($reservationId) {
            $reservation = Reservation::find($reservationId);
            if ($reservation && $reservation->paiement) {
                $statut = $request->input('status') === 'SUCCESS' ? 'CONFIRMEE' : 'ECHOUEE';
                $reservation->paiement->update(['statut' => $statut, 'updated_at' => now()]);
                $reservation->update(['statut' => $statut, 'updated_at' => now()]);
                return response()->json(['message' => 'Paiement mis à jour', 'statut' => $statut], 200);
            }
        }

        return response()->json(['message' => 'Réservation ou paiement non trouvé'], 404);
    }

    public function webhook_verify_signature_and_decode($wave_webhook_secret, $wave_signature, $webhook_body)
    {
        // Décommentez var_dump si vous avez besoin de déboguer les 3 valeurs d'entrée:
        // var_dump($wave_webhook_secret, $wave_signature, $webhook_body);

        $parts = explode(",", $wave_signature);
        $timestamp = explode("=", $parts[0])[1];

        $signatures = array();
        foreach (array_slice($parts, 1) as $signature) {
            $signatures[] = explode("=", $signature)[1];
        }

        $computed_hmac = hash_hmac("sha256", $timestamp . $webhook_body, $wave_webhook_secret);
        $valid = in_array($computed_hmac, $signatures);

        if ($valid) {
            # La demande est valide, vous pouvez continuer en utilisant le contenu décodé.
            return json_decode($webhook_body);
        } else {
            die("Invalid webhook signature.");
        }
    }
}
