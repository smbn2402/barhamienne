<?php

namespace App\Http\Controllers;

use App\Models\DepartMoment;
use App\Models\Caravane;
use Illuminate\Http\Request;

class DepartMomentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $depart_moments = DepartMoment::with(['depart.trajet', 'moment'])->get();
        return response()->json($depart_moments, 200);
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
        $validatedData = $request->validate([
            'depart.id' => 'required|exists:departs,id',
            'moment.id' => 'required|exists:moments,id',
            'heureDepart' => 'required|date_format:H:i',
        ]);

        $existingDepartMoment = DepartMoment::where('depart_id', $validatedData['depart']['id'])
            ->where('moment_id', $validatedData['moment']['id'])
            ->first();

        if ($existingDepartMoment) {
            return response()->json([
                'message' => 'Ce point de départ a déjà une heure associée pour ce moment.',
            ], 409); // Conflict
        }

        return DepartMoment::create([
            'depart_id' => $validatedData['depart']['id'],
            'moment_id' => $validatedData['moment']['id'],
            'heure_depart' => $validatedData['heureDepart'],
        ]);

        return response()->json([
            'message' => 'Heure de départ créée avec succès',
            'data' => $reservation,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(DepartMoment $departMoment)
    {
        return DepartMoment::with(['depart', 'moment'])->findOrFail($departMoment->id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DepartMoment $departMoment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DepartMoment $departMoment)
    {
        $request->validate([
            'depart.id' => 'required|exists:departs,id',
            'moment.id' => 'required|exists:moments,id',
            'heureDepart' => 'required|date_format:H:i',
        ]);

        $departMoment->update([
            'depart_id' => $request->input('depart.id'),
            'moment_id' => $request->input('moment.id'),
            'heure_depart' => $request->input('heureDepart'),
        ]);

        return $departMoment;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DepartMoment $departMoment)
    {
        return $departMoment->delete();
    }

    /**
     * Récupérer les moments par depart.
     */
    public function getMomentsByDepart($depart_id)
    {
        // Récupérer les moments filtrés par depart_id
        $moments = DepartMoment::with(['depart.trajet', 'moment'])->where('depart_id', $depart_id)->get();

        // Vérifier si des moments ont été trouvés
        if ($moments->isEmpty()) {
            return response()->json(['message' => 'Aucun moment trouvé pour ce depart'], 404);
        }

        // Retourner les moments en réponse JSON
        return response()->json($moments, 200);
    }

    /**
     * Récupérer les DepartMoment par trajet.
     */
    public function getDepartMomentsByTrajet($trajet_id)
    {
        // Récupérer les DepartMoment dont le Depart est lié au Trajet spécifié
        $departMoments = DepartMoment::whereHas('depart', function ($query) use ($trajet_id) {
            $query->where('trajet_id', $trajet_id);
        })->with(['depart.trajet', 'moment'])->get()->sortBy(function ($item) {
            return $item->depart->order ?? 0;
        })
            ->values(); // pour réindexer proprement;

        return response()->json($departMoments, 200);
    }

    /**
     * Récupérer les DepartMoment par trajet et moment.
     */
    public function getDepartMomentsByTrajetAndMoment($trajet_id, $moment_id)
    {
        $departMoments = DepartMoment::whereHas('depart', function ($query) use ($trajet_id) {
            $query->where('trajet_id', $trajet_id);
        })
            ->where('moment_id', $moment_id)
            ->with(['depart.trajet', 'moment'])
            ->get()
            ->sortBy(fn($item) => $item->depart->order ?? 0)
            ->values(); // pour réindexer proprement;

        return response()->json($departMoments, 200);
    }

    public function getDepartMomentsByCaravane($caravane_id)
    {
        // Récupérer la caravane
        $caravane = Caravane::find($caravane_id);

        if (!$caravane) {
            return response()->json(['message' => 'Caravane non trouvée'], 404);
        }

        // Récupération des DepartMoments correspondant au trajet et moment de la caravane
        $departMoments = DepartMoment::whereHas('depart', function ($query) use ($caravane) {
            $query->where('trajet_id', $caravane->trajet_id);
        })
            ->where('moment_id', $caravane->moment_id)
            ->with(['depart.trajet', 'moment'])
            ->get()
            ->sortBy(fn($item) => $item->depart->order ?? 0)
            ->values(); // pour réindexer proprement;

        return response()->json($departMoments, 200);
    }

    public function getDepartMomentsPrincipaleByCaravane($caravane_id)
    {
        // Récupérer la caravane
        $caravane = Caravane::find($caravane_id);

        if (!$caravane) {
            return response()->json(['message' => 'Caravane non trouvée'], 404);
        }

        // Récupération des DepartMoments correspondant au trajet et moment de la caravane
        $departMoment = DepartMoment::whereHas('depart', function ($query) use ($caravane) {
            $query->where('trajet_id', $caravane->trajet_id)->where('est_principale', 1);
        })
            ->where('moment_id', $caravane->moment_id)
            ->with(['depart.trajet', 'moment'])
            ->first();

        return response()->json($departMoment, 200);
    }
}
