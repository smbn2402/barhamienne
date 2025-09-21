<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Arrivee extends BaseModel
{
    use HasFactory;

    protected $fillable = ['libelle', 'est_principale', 'trajet_id', 'order'];

    protected $hidden = ['trajet_id', 'updated_at', 'created_at'];

    public function trajet()
    {
        return $this->belongsTo(Trajet::class);
    }
}
