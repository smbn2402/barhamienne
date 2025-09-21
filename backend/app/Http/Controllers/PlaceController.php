<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $place = Place::with(['buses'])->get();
        return response()->json($place, 200);
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
            'bus_id' => 'required|exists:buses,id',
            'numero' => 'required|integer|min:1',
            'occupee' => 'sometimes|boolean',
        ]);

        $place = Place::create($validatedData);
        return response()->json($place, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Place $place)
    {
        $place = $place->load(['buses']);
        return response()->json($place, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Place $place)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Place $place)
    {
        $validatedData = $request->validate([
            'bus_id' => 'sometimes|required|exists:buses,id',
            'numero' => 'sometimes|required|integer|min:1',
            'occupee' => 'sometimes|boolean',
        ]);

        $place->update($validatedData);
        return response()->json($place);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Place $place)
    {
        $place->delete();
        return response()->json(['message' => 'Place supprimée avec succès'], 204);
    }
}
