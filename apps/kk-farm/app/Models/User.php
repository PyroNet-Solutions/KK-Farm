<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    protected $guarded = [];

    protected $hidden = ['password', 'remember_token'];

    public function canModule(string $module): bool
    {
        return in_array($this->role, config("kkfarm.modules.$module", []), true);
    }

    public function passes(string $gate): bool
    {
        return in_array($this->role, config("kkfarm.gates.$gate", []), true);
    }

    public function roleLabel(): string
    {
        return config("kkfarm.roles.$this->role", $this->role);
    }
}
