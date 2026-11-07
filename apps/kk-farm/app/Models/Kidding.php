<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kidding extends Model
{
    protected $guarded = [];

    protected $casts = ['kidded_on' => 'date'];

    public function dam()
    {
        return $this->belongsTo(Animal::class, 'dam_id');
    }
}
