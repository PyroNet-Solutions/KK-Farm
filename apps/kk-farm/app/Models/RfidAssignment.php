<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfidAssignment extends Model
{
    protected $guarded = [];

    protected $casts = ['valid_from' => 'datetime', 'valid_to' => 'datetime'];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }

    public function tag()
    {
        return $this->belongsTo(RfidTag::class, 'rfid_tag_id');
    }
}
