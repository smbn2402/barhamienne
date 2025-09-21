<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Yobante extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'prenom_exp',
        'nom_exp',
        'tel_exp',
        'type_colis',
        'caravane_id',
        'depart_moment_id',
        'retrait',
        'prenom_dest',
        'nom_dest',
        'tel_dest',
    ];

    protected $hidden = ['caravane_id', 'depart_moment_id', 'updated_at', 'created_at'];

    // Relation avec le point de départ
    public function departMoment()
    {
        return $this->belongsTo(DepartMoment::class);
    }

    public function caravane()
    {
        return $this->belongsTo(Caravane::class);
    }
}
