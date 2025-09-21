<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Trajet extends BaseModel
{
    use HasFactory;

    protected $fillable = ['libelle', 'libelle_wolof', 'prix'];

    protected $hidden = ['updated_at', 'created_at'];

    public function departs()
    {
        return $this->hasMany(Depart::class);
    }

    public function arrivees()
    {
        return $this->hasMany(Arrivee::class);
    }

    public function caravanes()
    {
        return $this->hasMany(Caravane::class);
    }
}
