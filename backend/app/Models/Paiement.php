<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Paiement extends BaseModel
{
    use HasFactory;

    protected $fillable = ['date', 'montant', 'methode', 'statut', 'reservation_id'];

    protected $hidden = ['reservation_id'];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
