<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class DepartMoment extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'depart_id',
        'moment_id',
        'heure_depart',
    ];

    protected $hidden = ['depart_id', 'moment_id', 'updated_at', 'created_at'];

    public function depart()
    {
        return $this->belongsTo(Depart::class);
    }

    public function moment()
    {
        return $this->belongsTo(Moment::class);
    }
}
