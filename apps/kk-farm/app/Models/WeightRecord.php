<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeightRecord extends Model
{
    protected $guarded = [];

    protected $casts = ['measured_on' => 'date', 'weight_kg' => 'float'];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }
}
