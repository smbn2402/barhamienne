<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class Caravane extends BaseModel
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['libelle', 'date', 'prix', 'est_publiee', 'est_ouverte', 'tel_agent', 'trajet_id', 'moment_id'];


    protected $hidden = ['trajet_id', 'moment_id', 'updated_at', 'created_at'];

    public static function boot()
    {
        parent::boot();

        static::restoring(function ($caravane) {
            // Custom logic during restore if needed
        });
    }

    public function trajet()
    {
        return $this->belongsTo(Trajet::class);
    }

    public function moment()
    {
        return $this->belongsTo(Moment::class);
    }

    public function buses()
    {
        return $this->hasMany(Bus::class);
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function yobantes()
    {
        return $this->hasMany(Yobante::class);
    }
}
