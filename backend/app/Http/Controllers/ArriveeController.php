<?php

namespace App\Http\Controllers;

use App\Models\Arrivee;
use Illuminate\Http\Request;
use App\Models\Caravane;

class ArriveeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $arrivee = Arrivee::with(['trajet'])->get();
        return response()->json($arrivee, 200);
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
            'libelle' => 'required|string|unique:arrivees,libelle',
            'trajet_id' => 'required|exists:trajets,id',
            'order' => 'nullable|integer',
        ]);

        $arrivee = Arrivee::create($validatedData);
        return response()->json($arrivee, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Arrivee $arrivee)
    {
        $arrivee = $arrivee->load(['trajet']);
        return response()->json($arrivee, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Arrivee $arrivee)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Arrivee $arrivee)
    {
        $validatedData = $request->validate([
            'libelle' => 'sometimes|required|string|unique:arrivees,libelle,' . $arrivee->id,
            'trajet_id' => 'sometimes|required|exists:trajets,id',
            'order' => 'nullable|integer',
        ]);

        $arrivee->update($validatedData);
        return response()->json($arrivee);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Arrivee $arrivee)
    {
        $arrivee->delete();
        return response()->json(['message' => 'Point d\'arrivée supprimé avec succès'], 204);
    }

    /**
     * Récupérer les arrivées par trajet.
     */
    public function getArriveesByTrajet($trajetId)
    {
        // Récupérer les arrivées filtrées par trajet_id
        $arrivees = Arrivee::with(['trajet'])->where('trajet_id', $trajetId)->get();

        // Retourner les arrivées en réponse JSON
        return response()->json($arrivees, 200);
    }

    public function getArriveesByCaravane($caravane_id)
    {
        // Récupérer la caravane
        $caravane = Caravane::find($caravane_id);

        if (!$caravane) {
            return response()->json(['message' => 'Caravane non trouvée'], 404);
        }

        // Récupération des Arrivees correspondant au trajet et moment de la caravane
        $arrivees = Arrivee::orderBy('order', 'asc')->where('trajet_id', $caravane->trajet_id)->get();

        return response()->json($arrivees, 200);
    }
}
