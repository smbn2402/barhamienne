<?php

namespace App\Http\Controllers;

use App\Models\Yobante;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class YobanteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $yobante = Yobante::with(['caravane.trajet', 'caravane.moment', 'departMoment.moment', 'departMoment.depart'])->get();
        return response()->json($yobante, 200);
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
    // public function store(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'prenomExp' => 'required|string|max:255',
    //         'nomExp' => 'required|string|max:255',
    //         'telExp' => 'required|string|max:25',
    //         'typeColis' => 'required|string|max:255',
    //         'caravane.id' => 'required|exists:caravanes,id',
    //         'departMoment.id' => 'required|exists:depart_moments,id',
    //         'retrait' => 'required|string|max:255',
    //         'prenomDest' => 'required|string|max:255',
    //         'nomDest' => 'required|string|max:255',
    //         'telDest' => 'required|string|max:25',
    //     ]);

    //     $yobante = new Yobante([
    //         'prenom_exp' => $validatedData['prenomExp'],
    //         'nom_exp' => $validatedData['nomExp'],
    //         'tel_exp' => $validatedData['telExp'],
    //         'type_colis' => $validatedData['typeColis'],
    //         'caravane_id' => $validatedData['caravane']['id'],
    //         'depart_moment_id' => $validatedData['departMoment']['id'],
    //         'retrait' => $validatedData['retrait'],
    //         'prenom_dest' => $validatedData['prenomDest'],
    //         'nom_dest' => $validatedData['nomDest'],
    //         'tel_dest' => $validatedData['telDest'],
    //     ]);

    //     $yobante->save();

    //     return response()->json($yobante, 201);
    // }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'prenomExp' => 'required|string|max:255',
            'nomExp' => 'required|string|max:255',
            'telExp' => 'required|string|max:25',
            'typeColis' => 'required|string|max:255',
            'caravane' => 'required|exists:caravanes,id',
            'departMoment' => 'required|exists:depart_moments,id',
            'retrait' => 'required|string|max:255',
            'prenomDest' => 'required|string|max:255',
            'nomDest' => 'required|string|max:255',
            'telDest' => 'required|string|max:25',
        ]);

        $yobante = new Yobante([
            'prenom_exp' => $validatedData['prenomExp'],
            'nom_exp' => $validatedData['nomExp'],
            'tel_exp' => $validatedData['telExp'],
            'type_colis' => $validatedData['typeColis'],
            'caravane_id' => $validatedData['caravane'],
            'depart_moment_id' => $validatedData['departMoment'],
            'retrait' => $validatedData['retrait'],
            'prenom_dest' => $validatedData['prenomDest'],
            'nom_dest' => $validatedData['nomDest'],
            'tel_dest' => $validatedData['telDest'],
        ]);

        $yobante->save();

        return response()->json($yobante, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Yobante $yobante)
    {
        return response()->json($yobante, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Yobante $yobante)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, Yobante $yobante)
    // {
    //     $validatedData = $request->validate([
    //         'prenomExp' => 'sometimes|required|string|max:255',
    //         'nomExp' => 'sometimes|required|string|max:255',
    //         'telExp' => 'sometimes|required|string|max:25',
    //         'typeColis' => 'sometimes|required|string|max:255',
    //         'caravane.id' => 'sometimes|required|exists:caravanes,id',
    //         'departMoment.id' => 'sometimes|required|exists:depart_moments,id',
    //         'retrait' => 'sometimes|required|string|max:255',
    //         'prenomDest' => 'sometimes|required|string|max:255',
    //         'nomDest' => 'sometimes|required|string|max:255',
    //         'telDest' => 'sometimes|required|string|max:25',
    //     ]);

    //     $yobante->update([
    //         'prenom_exp' => $validatedData['prenomExp'],
    //         'nom_exp' => $validatedData['nomExp'],
    //         'tel_exp' => $validatedData['telExp'],
    //         'type_colis' => $validatedData['typeColis'],
    //         'caravane_id' => $validatedData['caravane']['id'],
    //         'depart_moment_id' => $validatedData['departMoment']['id'],
    //         'retrait' => $validatedData['retrait'],
    //         'prenom_dest' => $validatedData['prenomDest'],
    //         'nom_dest' => $validatedData['nomDest'],
    //         'tel_dest' => $validatedData['telDest'],
    //     ]);

    //     return response()->json($yobante, 200);
    // }

    public function update(Request $request, Yobante $yobante)
    {
        $validatedData = $request->validate([
            'prenomExp' => 'sometimes|required|string|max:255',
            'nomExp' => 'sometimes|required|string|max:255',
            'telExp' => 'sometimes|required|string|max:25',
            'typeColis' => 'sometimes|required|string|max:255',
            'caravane' => 'sometimes|required|exists:caravanes,id',
            'departMoment' => 'sometimes|required|exists:depart_moments,id',
            'retrait' => 'sometimes|required|string|max:255',
            'prenomDest' => 'sometimes|required|string|max:255',
            'nomDest' => 'sometimes|required|string|max:255',
            'telDest' => 'sometimes|required|string|max:25',
        ]);

        $yobante->update([
            'prenom_exp' => $validatedData['prenomExp'],
            'nom_exp' => $validatedData['nomExp'],
            'tel_exp' => $validatedData['telExp'],
            'type_colis' => $validatedData['typeColis'],
            'caravane_id' => $validatedData['caravane'],
            'depart_moment_id' => $validatedData['departMoment'],
            'retrait' => $validatedData['retrait'],
            'prenom_dest' => $validatedData['prenomDest'],
            'nom_dest' => $validatedData['nomDest'],
            'tel_dest' => $validatedData['telDest'],
        ]);

        return response()->json($yobante, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Yobante $yobante)
    {
        $yobante->delete();

        return response()->json(['message' => 'Yobanté supprimé avec succès'], 200);
    }

    /**
     * Récupérer les yobantés par caravane.
     */
    public function getYobantesByCaravane($caravane_id)
    {
        $yobantes = Yobante::with(['caravane.trajet', 'caravane.moment', 'departMoment.moment', 'departMoment.depart'])
            ->where('caravane_id', $caravane_id)
            ->get();

        return response()->json($yobantes, 200);
    }

    public function getStatistiques()
    {
        $total = Yobante::count();

        // $validees = Yobante::where('statut', 'CONFIRMEE')->count();

        // $duJour = Yobante::whereDate('created_at', now()->toDateString())->count();

        // $annulees = Yobante::where('statut', 'ANNULEE')->count();

        return response()->json([
            'total_yobantes' => $total
        ]);
    }
}
