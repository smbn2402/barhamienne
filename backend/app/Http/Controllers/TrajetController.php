<?php

namespace App\Http\Controllers;

use App\Models\Trajet;
use Illuminate\Http\Request;

class TrajetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trajet = Trajet::all();
        return response()->json($trajet, 200);
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
            'libelle' => 'required|string|unique:trajets,libelle',
            'libelleWolof' => 'required|string',
            'prix'=> 'required|integer',
        ]);

        $trajet = Trajet::create([
            'libelle'=> $validatedData['libelle'],
            'libelle_wolof' => $validatedData['libelleWolof'],
            'prix' => $validatedData['prix'],
        ]);
        return response()->json($trajet, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Trajet $trajet)
    {
        return response()->json($trajet, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trajet $trajet)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trajet $trajet)
    {
        $validatedData = $request->validate([
            'libelle' => 'sometimes|required|string|unique:trajets,libelle,' . $trajet->id,
            'libelleWolof' => 'sometimes|required|string',
            'prix'=> 'sometimes|required|integer',
        ]);

        $trajet->update([
            'libelle'=> $validatedData['libelle'],
            'libelle_wolof' => $validatedData['libelleWolof'],
            'prix' => $validatedData['prix'],
        ]);
        return response()->json($trajet);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trajet $trajet)
    {
        $trajet->delete();
        return response()->json(['message' => 'Trajet supprimé avec succès'], 204);
    }
}
