<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HealthRecord extends Model
{
    protected $guarded = [];

    protected $casts = ['occurred_on' => 'date', 'next_due_on' => 'date'];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }
}
