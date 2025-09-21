<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ArriveeMoment extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'arrivee_id',
        'moment_id',
        'heure_arrivee'
    ];

    protected $hidden = ['arrivee_id', 'moment_id', 'updated_at', 'created_at'];

    public function arrivee()
    {
        return $this->belongsTo(Arrivee::class);
    }

    public function moment()
    {
        return $this->belongsTo(Moment::class);
    }
}
