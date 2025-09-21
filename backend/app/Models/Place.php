<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Place extends BaseModel
{
    use HasFactory;

    protected $fillable = ['bus_id', 'numero', 'occupee'];

    protected $hidden = ['bus_id', 'updated_at', 'created_at'];

    public function bus()
    {
        return $this->belongsTo(Bus::class);
    }
}
