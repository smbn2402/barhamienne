<?php

namespace App\Models;

class ContactMessage extends BaseModel
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'subject',
        'message',
    ];
}
