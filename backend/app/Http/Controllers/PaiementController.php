<?php

namespace App\Http\Controllers;

use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class PaiementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $paiement = Paiement::all();
        return response()->json($paiement, 200);
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
            'date' => 'required|date',
            'montant' => 'required|numeric',
            'methode' => 'required|string|max:255',
        ]);

        $paiement = Paiement::create($validatedData);
        return response()->json($paiement, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Paiement $paiement)
    {
        return response()->json($paiement, 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Paiement $paiement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Paiement $paiement)
    {
        $validatedData = $request->validate([
            'date' => 'sometimes|required|date',
            'montant' => 'sometimes|required|numeric',
            'methode' => 'sometimes|required|string|max:255',
        ]);

        $paiement->update($validatedData);
        return response()->json($paiement);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Paiement $paiement)
    {
        $paiement->delete();
        return response()->json(['message' => 'Paiement supprimé avec succès'], 204);
    }

    public function payerAvecWave(Request $request)
    {
        $validatedData = $request->validate([
            'montant' => 'required',
            'reservation_id' => 'required'
        ]);

        # Specify your API KEY
        $api_key = env('WAVE_API_KEY');

        $checkout_params = [
            "amount" => $validatedData['montant'],
            "reservation_id" => $validatedData['reservation_id'],
            "currency" => "XOF",
            "error_url" => "https://e-transport.site/checkout-error?reservation_id=" . $validatedData['reservation_id'],
            "success_url" => "https://e-transport.site/checkout-success?reservation_id=" . $validatedData['reservation_id'],
        ];


        # Define the request options
        $curlOptions = [
            CURLOPT_URL => "https://api.wave.com/v1/checkout/sessions",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 5,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($checkout_params),
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer {$api_key}",
                "Content-Type: application/json"
            ],
        ];

        # Execute the request and get a response
        $curl = curl_init();
        curl_setopt_array($curl, $curlOptions);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);

        if ($err) {
            echo "cURL Error #:" . $err;
        } else {
            # You can now decode the response and use the checkout session. Happy coding ;)
            $checkout_session = json_decode($response);
            //dd($checkout_session);

            // Paiement::create([
            //     "amount" => $checkout_session->amount,
            //     "checkout_status" => $checkout_session->checkout_status,
            //     "client_reference" => $checkout_session->client_reference,
            //     "payment_status" => $checkout_session->payment_status,
            //     "when_completed" => $checkout_session->when_completed,
            //     "when_created" => $checkout_session->when_created,
            //     "when_expires" => $checkout_session->when_expires,
            //     "last_payment_error" => $checkout_session->last_payment_error,
            //     "wave_launch_url" => $checkout_session->wave_launch_url
            // ]);

            # You can redirect the user by using the 'wave_launch_url' field.
            $wave_launch_url = $checkout_session->wave_launch_url;
            return Redirect::to($wave_launch_url);
            //header('Location: $wave_launch_url');
            //exit;
        }
    }
}
