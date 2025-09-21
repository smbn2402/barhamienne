<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Bus extends BaseModel
{
    use HasFactory;

    protected $fillable = ['libelle', 'capacite', 'caravane_id'];

    protected $hidden = ['caravane_id', 'updated_at', 'created_at'];

    public function caravane()
    {
        return $this->belongsTo(Caravane::class);
    }

    public function places()
    {
        return $this->hasMany(Place::class);
    }

    public static function boot()
    {
        parent::boot();
        static::created(function ($bus) {
            for ($i = 1; $i <= 57; $i++) {
                Place::create([
                    'bus_id' => $bus->id,
                    'numero' => $i,
                    'occupee' => false,
                ]);
            }
        });
    }
}
