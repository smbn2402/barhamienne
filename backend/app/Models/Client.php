<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends BaseModel
{
    use HasFactory;

    protected $fillable = ['prenom', 'nom', 'tel', 'email'];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
