<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Moment extends BaseModel
{
    use HasFactory;

    protected $fillable = ['libelle'];

    protected $hidden = ['updated_at', 'created_at'];

    public function caravanes()
    {
        return $this->hasMany(Caravane::class);
    }

    public function departs()
    {
        return $this->belongsToMany(Depart::class, 'depart_moment')
            ->withPivot('heure_depart')
            ->withTimestamps();
    }
}
