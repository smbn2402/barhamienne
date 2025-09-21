<?php

namespace App\Http\Controllers;

use App\Models\Moment;
use Illuminate\Http\Request;

class MomentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $moment = Moment::all();
        return response()->json($moment, 200);
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
            'libelle' => 'required|string|unique:moments,libelle',
        ]);

        $moment = Moment::create($validatedData);
        return response()->json($moment, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Moment $moment)
    {
        return response()->json($moment, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Moment $moment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Moment $moment)
    {
        $validatedData = $request->validate([
            'libelle' => 'sometimes|required|string|unique:moments,libelle,' . $moment->id,
        ]);

        $moment->update($validatedData);
        return response()->json($moment);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Moment $moment)
    {
       $moment->delete();
        return response()->json(['message' => 'Moment supprimé avec succès'], 204);
    }
}
