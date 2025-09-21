<?php

namespace App\Http\Controllers;

use App\Models\Bus;
use Illuminate\Http\Request;

class BusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bus = Bus::with(['caravane'])->get();
        return response()->json($bus, 200);
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
            'libelle' => 'required|string|max:255',
            'capacite' => 'required|integer|min:1',
            'caravane_id' => 'required|exists:caravanes,id',
        ]);

        $bus = Bus::create($validatedData);
        return response()->json($bus, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Bus $bus)
    {
        $bus = $bus->load(['caravane']);
        return response()->json($bus, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bus $bus)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bus $bus)
    {
        $validatedData = $request->validate([
            'libelle' => 'sometimes|required|string|max:255',
            'capacite' => 'sometimes|required|integer|min:1',
            'caravane_id' => 'sometimes|required|exists:caravanes,id',
        ]);

        $bus->update($validatedData);
        return response()->json($bus);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bus $bus)
    {
        $bus->delete();
        return response()->json(['message' => 'Bus supprimé avec succès'], 204);
    }
}
