<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedingLog extends Model
{
    protected $guarded = [];

    protected $casts = ['fed_on' => 'date'];
}
