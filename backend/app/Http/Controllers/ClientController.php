<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $client =  Client::all();
        return response()->json($client, 200);
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
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'tel' => 'required|string|unique:clients,tel',
            'email' => '',
        ]);

        $client = Client::create($validatedData);
        return response()->json($client, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        return response()->json($client, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $validatedData = $request->validate([
            'prenom' => 'sometimes|required|string|max:255',
            'nom' => 'sometimes|required|string|max:255',
            'tel' => 'sometimes|required|string|unique:clients,tel,' . $client->id,
            'email' => 'sometimes|required|email|unique:clients,email,' . $client->id,
        ]);

        $client->update($validatedData);
        return response()->json($client, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(['message' => 'Client supprimé avec succès'], 204);
    }

    public function getStatistiquesClients()
    {
        $clients = Client::count();
        return response()->json($clients);
    }
}
