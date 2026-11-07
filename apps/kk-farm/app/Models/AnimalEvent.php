<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnimalEvent extends Model
{
    protected $guarded = [];

    protected $casts = ['occurred_at' => 'datetime'];
}
