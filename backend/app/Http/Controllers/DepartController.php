<?php

namespace App\Http\Controllers;

use App\Models\Depart;
use Illuminate\Http\Request;

class DepartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $depart = Depart::with(['trajet'])->get();
        return response()->json($depart, 200);
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
            'libelle' => 'required|string|unique:departs,libelle',
            'trajet.id' => 'required|exists:trajets,id'
        ]);

        $lastOrder = Depart::where('trajet_id', $validatedData['trajet']['id'])->max('order');
        $validatedData['order'] = $lastOrder !== null ? $lastOrder + 1 : 1;

        $depart = Depart::create([
            'libelle' => $validatedData['libelle'],
            'trajet_id' => $validatedData['trajet']['id'],
            'order' => $validatedData['order']
        ]);
        return response()->json($depart, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Depart $depart)
    {
        $depart = $depart->load(['trajet'])->get();
        return response()->json($depart, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Depart $depart)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Depart $depart)
    {
        $depart = Depart::findOrFail($depart->id);
        $validatedData = $request->validate([
            'libelle' => 'sometimes|required|string|unique:departs,libelle,' . $depart->id,
            'trajet.id' => 'sometimes|required|exists:trajets,id',
        ]);

        $depart->update([
            'libelle' => $validatedData['libelle'] ?? $depart->libelle,
            'trajet_id' => $validatedData['trajet']['id'] ?? $depart->trajet_id,
        ]);
        return response()->json($depart);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Depart $depart)
    {
        $depart->delete();
        return response()->json(['message' => 'Point de depart supprimé avec succès'], 204);
    }

    /**
     * Récupérer les départs par trajet.
     */
    public function getDepartsByTrajet($trajetId)
    {
        // Récupérer les départs filtrés par trajet_id
        $departs = Depart::with(['trajet'])
            ->where('trajet_id', $trajetId)->get()
            ->sortBy(fn($item) => $item->order ?? 0)
            ->values();

        // Vérifier si des départs ont été trouvés
        if ($departs->isEmpty()) {
            return response()->json(['message' => 'Aucun départ trouvé pour ce trajet'], 404);
        }

        // Retourner les départs en réponse JSON
        return response()->json($departs, 200);
    }

    public function updateOrder(Request $request)
    {
        foreach ($request->all() as $item) {
            Depart::where('id', $item['depart_id'])->update([
                'order' => $item['new_order'],
            ]);
        }

        return response()->json(['message' => 'Ordre mis à jour avec succès'], 200);
    }
}
