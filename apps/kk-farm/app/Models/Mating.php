<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mating extends Model
{
    protected $guarded = [];

    protected $casts = ['mated_on' => 'date', 'expected_kidding_on' => 'date'];

    public function dam()
    {
        return $this->belongsTo(Animal::class, 'dam_id');
    }

    public function sire()
    {
        return $this->belongsTo(Animal::class, 'sire_id');
    }
}
