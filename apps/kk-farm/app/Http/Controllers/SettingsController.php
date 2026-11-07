<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\Breed;
use App\Support\Farm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Settings', [
            'breeds' => Breed::orderBy('name')->get()->map(fn (Breed $b) => ['id' => $b->id, 'name' => $b->name, 'gestation' => $b->default_gestation_days, 'goats' => Animal::active()->where('breed_id', $b->id)->count()]),
            'matrix' => config('kkfarm.modules'),
            'gates' => config('kkfarm.gates'),
            'environment' => ['php' => PHP_VERSION, 'laravel' => app()->version(), 'database' => 'PostgreSQL '.explode(' ', \Illuminate\Support\Facades\DB::selectOne('show server_version')->server_version)[0]],
        ]);
    }

    public function addBreed(Request $request): RedirectResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:60', 'unique:breeds,name']]);

        Breed::create($data + ['default_gestation_days' => config('kkfarm.demo_gestation_days')]);
        Farm::log($request->user(), "Added breed {$data['name']}", '/settings');

        return back()->with('success', 'Breed added.');
    }
}
