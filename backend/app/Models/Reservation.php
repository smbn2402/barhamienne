<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['date', 'statut', 'nombre_personnes', 'client_id', 'caravane_id', 'depart_moment_id', 'arrivee_id', 'chaise'];

    protected $hidden = ['client_id', 'caravane_id', 'depart_moment_id', 'arrivee_id', 'updated_at', 'created_at'];

    public static function boot()
    {
        parent::boot();

        static::restoring(function ($reservation) {
            // Custom logic during restore if needed
        });
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function caravane()
    {
        return $this->belongsTo(Caravane::class);
    }

    public function departMoment()
    {
        return $this->belongsTo(DepartMoment::class);
    }

    public function arrivee()
    {
        return $this->belongsTo(Arrivee::class);
    }

    public function paiements()
    {
        return $this->hasMany(related: Paiement::class);
    }

    public function smsLogs()
    {
        return $this->hasMany(SmsLog::class);
    }


    // public function place()
    // {
    //     return $this->belongsTo(Place::class);
    // }
}
