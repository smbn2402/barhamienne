<?php

namespace App\Services;

use App\Models\Reservation;
use App\Models\DepartMoment;
use App\Models\SmsLog;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

Carbon::setLocale('fr');

class SmsNotificationService
{
    protected SendTextService $sendText;
    protected OrangeSmsService $orange;

    public function __construct(SendTextService $sendText, OrangeSmsService $orange)
    {
        $this->sendText = $sendText;
        $this->orange = $orange;
    }

    public function sendConfirmationReservation(Reservation $reservation, DepartMoment $departMoment)
    {
        $client = $reservation->client;
        $caravane = $reservation->caravane;

        $dateFormatted = Carbon::parse($caravane->date)->translatedFormat('l d F');
        $heure = $departMoment->heure_depart ?? '[heure inconnue]';
        $lieu = $departMoment->depart->libelle ?? '[lieu inconnu]';

        $message = "Bonjour {$client->prenom} {$client->nom},\n";
        $message .= "Merci d’avoir choisi BARHAMIENNE TRANSPORT.\n\n";
        $message .= "Votre réservation est bien confirmée\n";
        $message .= "Départ : {$dateFormatted} à {$heure}\n";
        $message .= "Lieu : {$lieu}\n\n";
        $message .= "Merci de vous présenter 10min à l’avance.\n\n";
        $message .= "BARHAMIENNE TRANSPORT : Sécurité Confort Proximité…";

        try {
            $response = $this->sendText->sendSMS($client->tel, $message);

            // Logger dans SmsLog
            $response['reservation_id'] = $reservation->id;
            $this->logSms($response);

            return $response;
        } catch (\Exception $e) {
            Log::error('Erreur SMS : ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Envoie un SMS via le canal spécifié
     */
    public function send(string $phone, string $message, string $channel = 'sendtext'): array
    {
        return match ($channel) {
            'sendtext' => $this->sendText->sendSMS($phone, $message),
            'orange' => $this->orange->sendSMS($phone, $message),
            default => ['error' => true, 'message' => 'Canal SMS non supporté']
        };
    }

    /**
     * Envoie une campagne SMS groupée (via SendText uniquement pour l’instant)
     */
    public function sendBulk(array $campaignLines, string $name = 'Campagne Réservation'): array
    {
        return $this->sendText->sendBulkSMS($campaignLines, $name);
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
            'reservation_id' => $data['reservation_id'] ?? null,
        ]);
    }

    // Utilisation dans un contrôleur
    // public function envoyerNotification(
    //     Request $request,
    //     SmsNotificationService $notificationService
    // ) {
    //     $notificationService->send(
    //         $request->tel,
    //         $request->message,
    //         $request->canal ?? 'sendtext' // ou 'orange'
    //     );
    // }
}
