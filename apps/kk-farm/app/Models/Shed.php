<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shed extends Model
{
    protected $guarded = [];

    public function pens()
    {
        return $this->hasMany(Pen::class);
    }
}
