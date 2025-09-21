<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\Paiement;
use Illuminate\Support\Carbon;
use App\Services\SendTextService;

class WaveWebhookController extends Controller
{
    protected $smsService;

    public function __construct(SendTextService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function webhook()
    {
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

        Paiement::where('client_reference', $webhook_data->client_reference)->update([
            "amount" => $webhook_data->amount,
            "checkout_status" => $webhook_data->checkout_status,
            //"client_reference" => $webhook_data->client_reference,
            "payment_status" => $webhook_data->payment_status,
            "when_completed" => $webhook_data->when_completed,
            //"when_created" => $webhook_data->when_created,
            //"when_expires" => $webhook_data->when_expires,
            //"last_payment_error" => $webhook_data->last_payment_error,
        ]);

        // $client = SMSClient::getInstance(env('CLIENT_ID'), env('CLIENT_SECRET'));
        // $sms = new OrangeSms($client);

        // $balance = $sms->balance('SEN');
        // $status = $balance[0]['status'];
        // $availableUnits = $balance[0]['availableUnits'];

        /*if ($availableUnits <= 10) {
            $this->sendMessageRecharge($availableUnits, $sms);
        }*/

        if ($webhook_type == 'checkout.session.completed') {
            if ($webhook_data->payment_status == 'succeeded') {
                $client = $this->getReservationDetails($webhook_data->client_reference);
                if ($client[0]->trajets_id == 3) {
                    $chaise = $this->getPlace($webhook_data->client_reference);
                    Reservation::where('reference', $webhook_data->client_reference)->update([
                        'effectuee' => true,
                        'chaise' => $chaise,
                    ]);
                } else {
                    Reservation::where('reference', $webhook_data->client_reference)->update([
                        'effectuee' => true,
                        //'chaise' => $this->getPlace($webhook_data->client_reference)
                    ]);
                }
                $this->sendMessageValidate($webhook_data->client_reference);
            } elseif ($webhook_data->payment_status == 'processing') {
                $this->sendMessageProcessing($webhook_data->client_reference);
            } elseif ($webhook_data->payment_status == 'cancelled') {
                $this->sendMessageCancelled($webhook_data->client_reference, $webhook_data->wave_launch_url);
            }
        } else {
            $this->sendMessageProcessing($webhook_data->client_reference);
        }
        //return response()->json('ok');
        return response('Webhook received', 200);
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

    protected function sendMessageValidate($reference)
    {
        $current_time = date('H');
        $dest = $this->getReservationDetails($reference);

        $greeting = $current_time <= 18 && $current_time >= 6 ? "Bonjour" : "Bonsoir";
        $message = "{$greeting} {$dest->client->prenom} {$dest->client->nom},\n\n" .
            "Votre réservation a été validée pour le voyage du " . $this->dateCaravane($dest->caravane->date) . '. ' .
            ($dest->chaise ? "Vous occuperez la place {$dest->chaise}. " : '') .
            "Rendez-vous {$dest->departMoment->depart->libelle}\n\n" .
            "NB : Le billet n'est pas remboursable !\n\n!!! E-Transport, vite fait, bien fait !!!";

        $this->smsService->sendSMS($dest->client->tel, $message);
    }



    protected function sendMessageError($reference)
    {
        $current_time = date('H');
        $dest = $this->getReservationDetails($reference);

        $greeting = $current_time <= 18 && $current_time >= 6 ? "Bonjour" : "Bonsoir";
        $message = "{$greeting} {$dest->client->prenom} {$dest->client->nom},\n\n" .
            "Une erreur est survenue lors de votre paiement. Votre réservation n'a pas été validée.\n\n" .
            "Merci de réessayer plus tard.\n\n!!! E-Transport, vite fait, bien fait !!!";

        $this->smsService->sendSMS($dest->client->tel, $message);
    }

    protected function sendMessageProcessing($reference)
    {
        $current_time = date('H');
        $dest = $this->getReservationDetails($reference);

        $greeting = $current_time <= 18 && $current_time >= 6 ? "Bonjour" : "Bonsoir";
        $message = "{$greeting} {$dest->client->prenom} {$dest->client->nom},\n\n" .
            "Votre paiement est en cours de traitement. Vous recevrez une confirmation dès validation.\n\n" .
            "!!! E-Transport, vite fait, bien fait !!!";

        $this->smsService->sendSMS($dest->client->tel, $message);
    }

    protected function sendMessageCancelled($reference, $wave_launch_url)
    {
        $current_time = date('H');
        $dest = $this->getReservationDetails($reference);

        $greeting = $current_time <= 18 && $current_time >= 6 ? "Bonjour" : "Bonsoir";
        $message = "{$greeting} {$dest->client->prenom} {$dest->client->nom},\n\n" .
            "Votre réservation est enregistrée pour le voyage {$this->dateCaravane($dest->caravane->date)}. Veillez cliquer sur ce lien {$wave_launch_url} pour effectuer le paiement afin de valider votre réservation.\n\n" .
            "NB : le lien expire dans 24h. \n\n" .
            "!!! E-Transport, vite fait, bien fait !!!";

        $this->smsService->sendSMS($dest->client->tel, $message);
    }

    public function getReservationDetails($reference)
    {
        return Reservation::with(['client', 'caravane', 'paiement', 'departMoment.moment', 'departMoment.depart', 'arrivee'])
            ->where('id', $reference)
            ->first();
    }

    public function getPlace($client_reference)
    {
        $caravane_id = Reservation::where('reference', $client_reference)->pluck('caravane_id')->first();

        $count = Reservation::where('caravane_id', $caravane_id)
            ->where('statut', 'CONFIRMEE')
            ->whereNotNull('chaise')
            ->count();

        $last_chaise = Reservation::where('caravane_id', $caravane_id)
            ->where('statut', 'CONFIRMEE')
            ->whereNotNull('chaise')
            ->latest()
            ->value('chaise');

        if ($count % 55 == 0 && $count != 0) {
            $chaise = "1";
        } else {
            $chaise = intval($last_chaise) + 1;
        }

        return $chaise;
    }


    public function dateCaravane($date)
    {
        Carbon::setLocale('fr');
        setlocale(LC_TIME, 'fr', 'fr_FR', 'fr_FR.ISO8859-1');
        return Carbon::parse($date)->formatLocalized('%A %d %B');
    }
}
