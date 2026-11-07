<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RfidTag extends Model
{
    protected $guarded = [];

    public function assignments()
    {
        return $this->hasMany(RfidAssignment::class);
    }

    public function openAssignment()
    {
        return $this->hasOne(RfidAssignment::class)->whereNull('valid_to');
    }
}
