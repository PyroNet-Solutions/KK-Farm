<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $guarded = [];

    protected $casts = ['due_on' => 'date', 'completed_at' => 'datetime'];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function pen()
    {
        return $this->belongsTo(Pen::class);
    }
}
