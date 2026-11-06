<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\Pen;
use App\Models\Shed;
use App\Support\Farm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ShedController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Sheds', [
            'sheds' => Shed::with(['pens' => fn ($q) => $q->orderBy('name'), 'pens.animals' => fn ($q) => $q->active()->orderBy('farm_number')])->orderBy('code')->get()->map(fn (Shed $s) => [
                'id' => $s->id, 'code' => $s->code, 'name' => $s->name, 'status' => $s->status,
                'pens' => $s->pens->map(fn (Pen $p) => [
                    'id' => $p->id, 'name' => $p->name, 'purpose' => $p->purpose, 'capacity' => $p->capacity, 'count' => $p->animals->count(),
                    'goats' => $p->animals->map(fn (Animal $a) => ['id' => $a->id, 'number' => $a->farm_number, 'name' => $a->name, 'coat' => $a->coat, 'sex' => $a->sex, 'health' => $a->health_status, 'repro' => $a->repro_state]),
                ]),
            ]),
            'recent' => DB::table('animal_events')->join('animals', 'animals.id', '=', 'animal_events.animal_id')->where('type', 'move')->orderByDesc('occurred_at')->limit(8)
                ->get(['animal_events.id', 'animals.id as goat_id', 'animals.farm_number as number', 'summary', 'occurred_at', 'recorded_by']),
        ]);
    }

    public function transfer(Request $request): RedirectResponse
    {
        $data = $request->validate(['animal_id' => ['required', 'exists:animals,id'], 'pen_id' => ['required', 'exists:pens,id']]);

        $animal = Animal::with('pen')->findOrFail($data['animal_id']);
        abort_unless($animal->status === 'active', 422, 'This goat is no longer on the farm.');
        $pen = Pen::findOrFail($data['pen_id']);
        if ($animal->pen_id === $pen->id) {
            return back()->with('success', "{$animal->farm_number} is already in {$pen->name}.");
        }

        DB::transaction(function () use ($animal, $pen, $request): void {
            $from = $animal->pen?->name ?? 'no pen';
            $animal->update(['pen_id' => $pen->id]);
            Farm::event($animal, 'move', "Moved from $from to {$pen->name}", $request->user()->name);
        });
        Farm::log($request->user(), "Moved {$animal->farm_number} to {$pen->name}", "/goats/{$animal->id}");

        return back()->with('success', "{$animal->farm_number} moved to {$pen->name}.");
    }
}
