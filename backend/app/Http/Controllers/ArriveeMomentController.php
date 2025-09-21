<?php

namespace App\Http\Controllers;

use App\Models\ArriveeMoment;
use App\Models\Caravane;
use Illuminate\Http\Request;

class ArriveeMomentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $arrivee_moments = ArriveeMoment::with(['arrivee.trajet', 'moment'])->get();
        return response()->json($arrivee_moments, 200);
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
    public function store(Request $request)
    {
        $request->validate([
            'arrivee_id' => 'required|exists:arrivees,id',
            'moment_id' => 'required|exists:moments,id',
            'heure_arrivee' => 'required|date_format:H:i',
        ]);

        return ArriveeMoment::create($request->all());
    }

    /**
     * Display the specified resource.
     */
    public function show(ArriveeMoment $arriveeMoment)
    {
        return ArriveeMoment::with(['arrivee', 'moment'])->findOrFail($arriveeMoment->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ArriveeMoment $arriveeMoment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ArriveeMoment $arriveeMoment)
    {
        $request->validate([
            'heure_arrivee' => 'required|date_format:H:i',
        ]);

        $arriveeMoment = ArriveeMoment::findOrFail($arriveeMoment->id);
        $arriveeMoment->update($request->all());

        return $arriveeMoment;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ArriveeMoment $arriveeMoment)
    {
        return $arriveeMoment->delete();
    }

    /**
     * Récupérer les moments par arrivee.
     */
    public function getMomentsByArrivee($arrivee_id)
    {
        // Récupérer les moments filtrés par arrivee_id
        $moments = ArriveeMoment::with(['arrivee.trajet', 'moment'])->where('arrivee_id', $arrivee_id)->get();

        // Vérifier si des moments ont été trouvés
        if ($moments->isEmpty()) {
            return response()->json(['message' => 'Aucun moment trouvé pour ce arrivee'], 404);
        }

        // Retourner les moments en réponse JSON
        return response()->json($moments, 200);
    }

    /**
     * Récupérer les ArriveeMoment par trajet.
     */
    public function getArriveeMomentsByTrajet($trajet_id)
    {
        // Récupérer les ArriveeMoment dont le Arrivee est lié au Trajet spécifié
        $arriveeMoments = ArriveeMoment::whereHas('arrivee', function ($query) use ($trajet_id) {
            $query->where('trajet_id', $trajet_id);
        })->with(['arrivee.trajet', 'moment'])->get();

        if ($arriveeMoments->isEmpty()) {
            return response()->json(['message' => 'Aucun ArriveeMoment trouvé pour ce trajet'], 404);
        }

        return response()->json($arriveeMoments, 200);
    }

    /**
     * Récupérer les ArriveeMoment par trajet et moment.
     */
    public function getArriveeMomentsByTrajetAndMoment($trajet_id, $moment_id)
    {
        $arriveeMoments = ArriveeMoment::whereHas('arrivee', function ($query) use ($trajet_id) {
            $query->where('trajet_id', $trajet_id);
        })
            ->where('moment_id', $moment_id)
            ->with(['arrivee.trajet', 'moment'])
            ->get();

        if ($arriveeMoments->isEmpty()) {
            return response()->json(['message' => 'Aucun ArriveeMoment trouvé pour ce trajet et ce moment'], 404);
        }

        return response()->json($arriveeMoments, 200);
    }

    public function getArriveeMomentsByCaravane($caravane_id)
    {
        // Récupérer la caravane
        $caravane = Caravane::find($caravane_id);

        if (!$caravane) {
            return response()->json(['message' => 'Caravane non trouvée'], 404);
        }

        // Récupération des ArriveeMoments correspondant au trajet et moment de la caravane
        $arriveeMoments = ArriveeMoment::whereHas('arrivee', function ($query) use ($caravane) {
            $query->where('trajet_id', $caravane->trajet_id);
        })
            ->where('moment_id', $caravane->moment_id)
            ->with(['arrivee.trajet', 'moment'])
            ->get();

        if ($arriveeMoments->isEmpty()) {
            return response()->json(['message' => 'Aucun ArriveeMoment trouvé pour cette caravane'], 404);
        }

        return response()->json($arriveeMoments, 200);
    }

    public function getArriveeMomentsPrincipaleByCaravane($caravane_id)
    {
        // Récupérer la caravane
        $caravane = Caravane::find($caravane_id);

        if (!$caravane) {
            return response()->json(['message' => 'Caravane non trouvée'], 404);
        }

        // Récupération des ArriveeMoments correspondant au trajet et moment de la caravane
        $arriveeMoment = ArriveeMoment::whereHas('arrivee', function ($query) use ($caravane) {
            $query->where('trajet_id', $caravane->trajet_id)->where('est_principale', 1);
        })
            ->where('moment_id', $caravane->moment_id)
            ->with(['arrivee.trajet', 'moment'])
            ->first();

        if (!$arriveeMoment) {
            return response()->json(['message' => 'Aucun ArriveeMoment trouvé pour cette caravane'], 404);
        }

        return response()->json($arriveeMoment, 200);
    }
}
