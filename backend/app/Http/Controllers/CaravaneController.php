<?php

namespace App\Http\Controllers;

use App\Models\Caravane;
use Illuminate\Http\Request;

class CaravaneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $caravanes = Caravane::orderBy('date', 'asc')->with(['trajet', 'moment'])->get();
        return response()->json($caravanes, 200);
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
            'libelle' => 'required|string',
            'date' => 'required|date',
            'prix' => 'required|integer|min:0',
            'estPubliee' => 'required|boolean',
            'estOuverte' => 'required|boolean',
            'telAgent' => 'required|string|max:255',
            'trajet.id' => 'required|exists:trajets,id',
            'moment.id' => 'required|exists:moments,id',
        ]);

        $caravane = new Caravane([
            'libelle' => $validatedData['libelle'],
            'date' => $validatedData['date'],
            'prix' => $validatedData['prix'],
            'est_publiee' => $validatedData['estPubliee'],
            'est_ouverte' => $validatedData['estOuverte'],
            'tel_agent' => $validatedData['telAgent'],
            'trajet_id' => $validatedData['trajet']['id'],
            'moment_id' => $validatedData['moment']['id'],
        ]);

        $caravane->save();
        $caravane = Caravane::with(['trajet', 'moment'])->findOrFail($caravane->id);
        return response()->json([
            'message' => 'Caravane créée avec succès',
            'data' => $caravane,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Caravane $caravane)
    {
        $caravane = $caravane->load(['trajet', 'moment']);
        return response()->json($caravane, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Caravane $caravane)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Caravane $caravane)
    {
        $validatedData = $request->validate([
            'libelle' => 'sometimes|required|string',
            'date' => 'required|date',
            'prix' => 'required|integer|min:0',
            'estPubliee' => 'required|boolean',
            'estOuverte' => 'required|boolean',
            'telAgent' => 'required|string|max:255',
            'trajet.id' => 'sometimes|required|exists:trajets,id',
            'moment.id' => 'sometimes|required|exists:moments,id',
        ]);

        $caravane->update([
            'libelle' => $validatedData['libelle'],
            'date' => $validatedData['date'],
            'prix' => $validatedData['prix'],
            'est_publiee' => $validatedData['estPubliee'],
            'est_ouverte' => $validatedData['estOuverte'],
            'tel_agent' => $validatedData['telAgent'],
            'trajet_id' => $validatedData['trajet']['id'],
            'moment_id' => $validatedData['moment']['id'],
        ]);

        return response()->json([
            'message' => 'Caravane mise à jour avec succès',
            'data' => $caravane
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Caravane $caravane)
    {
        $caravane->delete();
        return response()->json(['message' => 'Caravane supprimée avec succès'], 204);
    }

    /**
     * Affiche les caravanes associées à un trajet donné.
     */
    public function getCaravanesByTrajet($trajetId)
    {
        $caravanes = Caravane::orderBy('date', 'asc')->with(['trajet', 'moment'])
            ->where('trajet_id', $trajetId)
            ->get();

        return response()->json($caravanes, 200);
    }

    /**
     * Affiche les caravanes associées à un trajet et un moment donnés.
     */
    public function getCaravanesByTrajetAndMoment($trajetId, $momentId)
    {
        $caravanes = Caravane::orderBy('date', 'asc')->with(['trajet', 'moment'])
            ->where('trajet_id', $trajetId)
            ->where('moment_id', $momentId)
            ->get();

        return response()->json($caravanes, 200);
    }

    public function getStatistiquesCaravanes()
    {
        $caravanes = Caravane::orderBy('date', 'asc')->with(['trajet', 'moment'])->withCount(['reservations', 'yobantes'])->get();

        return response()->json($caravanes);
    }
}
