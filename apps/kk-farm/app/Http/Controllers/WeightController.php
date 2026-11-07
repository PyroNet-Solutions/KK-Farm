<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\WeightRecord;
use App\Support\Farm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WeightController extends Controller
{
    public function index(): Response
    {
        $goats = Animal::active()->with(['breed', 'pen', 'latestWeight', 'photos', 'weights'])->orderBy('farm_number')->get()->map(function (Animal $a): array {
            $weights = $a->weights;

            return $a->card() + [
                'adg' => Farm::adg($weights),
                'previous' => $weights->count() > 1 ? $weights[$weights->count() - 2]->weight_kg : null,
                'weighedOn' => $weights->last()?->measured_on->format('j M'),
                'daysAgo' => $weights->last() ? (int) $weights->last()->measured_on->diffInDays(now()) : null,
            ];
        });

        return Inertia::render('Weights', [
            'goats' => $goats,
            'byBreed' => DB::table('weight_records')->join('animals', 'animals.id', '=', 'weight_records.animal_id')->join('breeds', 'breeds.id', '=', 'animals.breed_id')
                ->where('measured_on', '>=', now()->subMonths(6)->startOfMonth())->groupByRaw("breeds.name, to_char(measured_on, 'YYYY-MM')")
                ->selectRaw("breeds.name as breed, to_char(measured_on, 'YYYY-MM') as month, round(avg(weight_kg)::numeric, 1)::float as kg")->orderBy('month')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate(['animal_id' => ['required', 'exists:animals,id'], 'weight_kg' => ['required', 'numeric', 'min:0.5', 'max:200'], 'measured_on' => ['nullable', 'date', 'before_or_equal:today']]);

        $animal = Animal::findOrFail($data['animal_id']);
        abort_unless($animal->status === 'active', 422, 'This goat is no longer on the farm.');
        WeightRecord::create(['animal_id' => $animal->id, 'weight_kg' => $data['weight_kg'], 'measured_on' => $data['measured_on'] ?? now()->toDateString(), 'measured_by' => $request->user()->name]);
        Farm::event($animal, 'weight', "Weighed {$data['weight_kg']} kg", $request->user()->name);
        Farm::log($request->user(), "Weighed {$animal->farm_number} at {$data['weight_kg']} kg", "/goats/{$animal->id}");

        return back()->with('success', "Weight saved for {$animal->farm_number}.");
    }
}
