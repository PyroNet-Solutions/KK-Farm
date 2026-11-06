<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pen extends Model
{
    protected $guarded = [];

    public function shed()
    {
        return $this->belongsTo(Shed::class);
    }

    public function animals()
    {
        return $this->hasMany(Animal::class);
    }
}
