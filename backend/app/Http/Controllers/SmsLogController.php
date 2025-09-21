<?php

namespace App\Http\Controllers;

use App\Models\SmsLog;
use Illuminate\Http\Request;

class SmsLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sms = SmsLog::orderBy('created_at', 'desc') // les plus récents en premier
            ->take(300)
            ->get();

        return response()->json($sms, 200);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SmsLog $smsLog)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SmsLog $smsLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SmsLog $smsLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SmsLog $smsLog)
    {
        //
    }
}
