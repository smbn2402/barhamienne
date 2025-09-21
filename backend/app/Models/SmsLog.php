<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class SmsLog extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'phone',
        'text',
        'sender_name',
        'message_id',
        'scheduled_at',
        'status_id',
        'status_description',
        'reservation_id',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}
