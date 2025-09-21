<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Models\Client;
use App\Models\DepartMoment;
use App\Models\Caravane;
use App\Services\SendTextService;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Services\SmsNotificationService;

Carbon::setLocale('fr');

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reservation = Reservation::with(['client', 'caravane', 'paiements', 'departMoment.moment', 'departMoment.depart', 'arrivee']);
        return response()->json($reservation, 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, SmsNotificationService $smsNotifier)
    {
        $validatedData = $request->validate([
            'statut' => 'required|in:EN_ATTENTE,CONFIRMEE,ANNULEE',
            'client.prenom' => 'required|string|min:2',
            'client.nom' => 'required|string|min:2',
            'client.tel' => 'required|string|regex:/^([0-9]{9})$/',
            'caravane.id' => 'required|exists:caravanes,id',
            'departMoment.id' => 'required|exists:depart_moments,id',
            'arrivee.id' => 'required|exists:arrivees,id'
        ]);

        // Vérifier si le client existe avec son téléphone
        $client = Client::where('tel', $validatedData['client']['tel'])->first();

        // Si le client n'existe pas, on le crée
        if (!$client) {
            $client = Client::create([
                'prenom' => $validatedData['client']['prenom'],
                'nom' => $validatedData['client']['nom'],
                'tel' => $validatedData['client']['tel'],
            ]);
        }

        // Vérifier si une réservation existe déjà pour ce client et cette caravane
        $existingReservation = Reservation::where('client_id', $client->id)
            ->where('caravane_id', $validatedData['caravane']['id'])
            // ->whereDate('date', now()->toDateString())
            ->first();

        if ($existingReservation) {
            $lastPaiement = $existingReservation->paiements()->latest()->first();

            if ($lastPaiement) {
                if ($lastPaiement->statut === 'SUCCESS') {
                    return response()->json([
                        'message' => 'Vous avez déjà une réservation confirmée avec un paiement réussi.',
                    ], 409);
                } else {
                    return response()->json([
                        'message' => 'Réservation existante, mais le paiement n\'a pas été confirmé.',
                        'reservation_id' => $existingReservation->id,
                        'paiement_statut' => $lastPaiement->statut,
                    ], 409);
                }
            }

            return response()->json([
                'message' => 'Vous avez déjà une réservation pour cette caravane.',
                'reservation_id' => $existingReservation->id,
                'paiement_statut' => null,
            ], 409);
        }

        // Créer la réservation
        $reservation = new Reservation([
            'date' => now(),
            'statut' => $validatedData['statut'],
            'nombre_personnes' => 1,
            'client_id' => $client->id, // Utiliser l'ID du client existant ou nouvellement créé
            'caravane_id' => $validatedData['caravane']['id'],
            'depart_moment_id' => $validatedData['departMoment']['id'],
            'arrivee_id' => $request->input('arrivee.id'),
        ]);

        $reservation->save();

        $reservation->load(['client', 'caravane']);

        $departMoment = DepartMoment::where('id', $reservation->depart_moment_id)->with(['depart', 'moment'])->first();

        if ($validatedData['statut'] === 'CONFIRMEE') {
            try {
                $smsNotifier->sendConfirmationReservation($reservation, $departMoment);
                return response()->json([
                    'message' => 'Réservation créée et SMS envoyé',
                    'data' => $reservation,
                ], 201);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Réservation créée mais erreur SMS',
                    'error' => $e->getMessage(),
                ], 500);
            }
        }

        return response()->json([
            'message' => 'Réservation créée avec succès',
            'data' => $reservation,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reservation $reservation)
    {
        $reservation = $reservation->load(['client', 'caravane.trajet', 'caravane.moment', 'paiements', 'departMoment.moment', 'departMoment.depart', 'arrivee']);
        return response()->json($reservation, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Reservation $reservation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reservation $reservation, SmsNotificationService $smsNotifier)
    {
        $validatedData = $request->validate([
            'date' => 'sometimes|required|date',
            'statut' => 'sometimes|required|in:EN_ATTENTE,CONFIRMEE,ANNULEE',
            'client.prenom' => 'sometimes|required|string|min:2',
            'client.nom' => 'sometimes|required|string|min:2',
            'client.tel' => 'sometimes|required|string|regex:/^([0-9]{9})$/',
            'caravane.id' => 'sometimes|required|exists:caravanes,id',
            'departMoment.id' => 'sometimes|required|exists:depart_moments,id',
            'arrivee.id' => 'sometimes|required|exists:arrivees,id'
        ]);

        // Vérifier si le client doit être mis à jour
        // if (isset($validatedData['client'])) {
        //     // Trouver le client actuel de la réservation
        //     $client = $reservation->client;

        //     if ($client) {
        //         $client->update([
        //             'prenom' => $validatedData['client']['prenom'],
        //             'nom' => $validatedData['client']['nom'],
        //             'tel' => $validatedData['client']['tel'],
        //         ]);
        //     }
        // }

        // Mettre à jour la réservation
        $reservation->update([
            'date' => $validatedData['date'] ?? $reservation->date,
            'statut' => $validatedData['statut'] ?? $reservation->statut,
            'depart_moment_id' => $validatedData['departMoment']['id'] ?? $reservation->depart_moment_id,
            'arrivee_id' => $validatedData['arrivee']['id']
        ]);

        $reservation->load(['client', 'caravane']);

        $departMoment = DepartMoment::where('id', $reservation->depart_moment_id)->with(['depart', 'moment'])->first();

        if ($validatedData['statut'] === 'CONFIRMEE') {
            try {
                $smsNotifier->sendConfirmationReservation($reservation, $departMoment);
                return response()->json([
                    'message' => 'Réservation créée et SMS envoyé',
                    'data' => $reservation,
                ], 201);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Réservation créée mais erreur SMS',
                    'error' => $e->getMessage(),
                ], 500);
            }
        }

        return response()->json([
            'message' => 'Réservation mise à jour avec succès',
            'data' => $reservation
        ]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(['message' => 'Réservation supprimée avec succès'], 204);
    }

    /**
     * Récupérer les réservations par caravane.
     */
    public function getReservationsByCaravane($caravaneId)
    {
        $reservations = Reservation::with(['client', 'caravane', 'paiements', 'departMoment.moment', 'departMoment.depart', 'arrivee'])
            ->where('caravane_id', $caravaneId)
            ->get();

        return response()->json($reservations, 200);
    }

    public function statistiquesParCaravane($caravaneId)
    {
        $total = Reservation::where('caravane_id', $caravaneId)->count();
        $confirmees = Reservation::where('caravane_id', $caravaneId)
            ->where('statut', 'CONFIRMEE')
            ->count();
        $enAttente = Reservation::where('caravane_id', $caravaneId)
            ->where('statut', 'EN_ATTENTE')
            ->count();

        return response()->json([
            'total' => $total,
            'confirmees' => $confirmees,
            'en_attente' => $enAttente,
        ]);
    }

    public function getStatistiques()
    {
        $total = Reservation::count();

        $validees = Reservation::where('statut', 'CONFIRMEE')->count();

        $duJour = Reservation::whereDate('created_at', now()->toDateString())->count();

        $annulees = Reservation::where('statut', 'ANNULEE')->count();

        return response()->json([
            'total_reservations' => $total,
            'reservations_validees' => $validees,
            'reservations_du_jour' => $duJour,
            'reservations_annulees' => $annulees,
        ]);
    }

    public function getReservationsParMois(Request $request)
    {
        $annee = $request->input('annee', now()->year); // par défaut année en cours

        $reservations = DB::table('reservations')
            ->selectRaw('MONTH(created_at) as mois, COUNT(*) as total')
            ->whereYear('created_at', $annee)
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy('mois')
            ->get();

        // Formatage pour s'assurer qu'on retourne 12 mois (même si 0 réservation pour certains)
        $statistiques = [];
        for ($mois = 1; $mois <= 12; $mois++) {
            $moisData = $reservations->firstWhere('mois', $mois);
            $statistiques[] = [
                'mois' => $mois,
                'total' => $moisData ? $moisData->total : 0
            ];
        }

        return response()->json([
            'annee' => (int) $annee,
            'reservations_par_mois' => $statistiques
        ]);
    }

    public function getReservationsParStatutParMois(Request $request)
    {
        $annee = $request->input('annee', now()->year);

        $resultats = \App\Models\Reservation::selectRaw('
        MONTH(created_at) as mois,
        SUM(CASE WHEN statut = "CONFIRMEE" THEN 1 ELSE 0 END) as validees,
        SUM(CASE WHEN statut = "ANNULEE" THEN 1 ELSE 0 END) as annulees,
        SUM(CASE WHEN statut = "EN_ATTENTE" THEN 1 ELSE 0 END) as attentes
    ')
            ->whereYear('created_at', $annee)
            ->groupByRaw('MONTH(created_at)')
            ->orderBy('mois')
            ->get();

        // On s'assure que tous les mois sont présents
        $moisData = [];
        for ($mois = 1; $mois <= 12; $mois++) {
            $stats = $resultats->firstWhere('mois', $mois);
            $moisData[] = [
                'mois' => $mois,
                'validées' => $stats?->validees ?? 0,
                'annulées' => $stats?->annulees ?? 0,
                'en_attente' => $stats?->attentes ?? 0
            ];
        }

        return response()->json([
            'annee' => (int)$annee,
            'donnees' => $moisData
        ]);
    }



    public function sendMessages(Request $request, SendTextService $sendTextService)
    {
        $request->validate([
            'reservations' => 'required|array',
            'message' => 'required|string',
        ]);

        $campaignLines = [];

        foreach ($request->reservations as $reservation) {
            $campaignLines[] = [
                'phone' => '221' . $reservation['client']['tel'],
                'text' => $request->message,
            ];
        }

        $response = $sendTextService->sendBulkSMS($campaignLines, 'Campagne Réservations');

        return response()->json($response);
    }

    public function sendBulkMessage(Request $request, SendTextService $sendTextService)
    {
        $request->validate([
            'message' => 'required|string',
            'reservations' => 'required|array',
        ]);

        $campaignLines = [];

        foreach ($request->reservations as $reservationData) {
            $phone = $reservationData['client']['tel'] ?? null;
            if ($phone) {
                $campaignLines[] = [
                    'phone' => '221' . $phone,
                    'text' => $request->message,
                ];
            }
        }

        $response = $sendTextService->sendBulkSMS($campaignLines, 'Campagne réservations');

        return response()->json($response, 200, [], JSON_UNESCAPED_UNICODE);
    }
}
