<?php

namespace App\Http\Controllers;

use App\Models\Animal;
use App\Models\HealthRecord;
use App\Support\Farm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class HealthController extends Controller
{
    public function index(): Response
    {
        $row = fn (HealthRecord $r) => [
            'id' => $r->id, 'goatId' => $r->animal_id, 'number' => $r->animal->farm_number, 'name' => $r->animal->name, 'coat' => $r->animal->coat, 'sex' => $r->animal->sex,
            'health' => $r->animal->health_status, 'kind' => $r->kind, 'title' => $r->title, 'notes' => $r->notes, 'severity' => $r->severity, 'by' => $r->recorded_by, 'role' => $r->recorded_role,
            'on' => $r->occurred_on->format('j M Y'), 'next' => $r->next_due_on?->format('j M Y'),
        ];
        $care = HealthRecord::with('animal')->whereIn('kind', ['vaccination', 'deworming'])->whereBetween('next_due_on', [now()->subDays(60), now()->addDays(21)])
            ->whereHas('animal', fn ($q) => $q->active())->orderBy('next_due_on')->limit(14)->get();

        return Inertia::render('Health', [
            'open' => HealthRecord::with('animal')->where('status', 'open')->orderByRaw("case severity when 'high' then 0 when 'medium' then 1 else 2 end")->orderByDesc('occurred_on')->get()->map($row),
            'care' => $care->map(fn (HealthRecord $r) => $row($r) + ['overdue' => $r->next_due_on->isPast()]),
            'recent' => HealthRecord::with('animal')->whereIn('kind', ['examination', 'treatment', 'observation'])->where('status', 'closed')->latest()->limit(10)->get()->map($row),
            'counts' => [
                'open' => HealthRecord::where('status', 'open')->count(),
                'critical' => Animal::active()->where('health_status', 'critical')->count(),
                'treatment' => Animal::active()->where('health_status', 'treatment')->count(),
                'watch' => Animal::active()->where('health_status', 'watch')->count(),
                'overdue' => HealthRecord::whereIn('kind', ['vaccination', 'deworming'])->where('next_due_on', '<', now())->whereHas('animal', fn ($q) => $q->active())->distinct('animal_id')->count('animal_id'),
            ],
            'goats' => Animal::active()->orderBy('farm_number')->get(['id', 'farm_number', 'name']),
        ]);
    }

    public function observe(Request $request): RedirectResponse
    {
        $data = $request->validate(['animal_id' => ['required', 'exists:animals,id'], 'title' => ['required', 'string', 'max:120'], 'severity' => ['required', Rule::in(['low', 'medium', 'high'])], 'notes' => ['nullable', 'string', 'max:500']]);

        $animal = Animal::findOrFail($data['animal_id']);
        DB::transaction(function () use ($animal, $data, $request): void {
            HealthRecord::create($data + ['kind' => 'observation', 'occurred_on' => now(), 'recorded_by' => $request->user()->name, 'recorded_role' => $request->user()->roleLabel(), 'status' => 'open']);
            if ($animal->health_status === 'healthy') {
                $animal->update(['health_status' => 'watch']);
            }
            Farm::event($animal, 'health', "Concern reported: {$data['title']}", $request->user()->name);
        });
        Farm::log($request->user(), "Reported a concern for {$animal->farm_number}", "/goats/{$animal->id}");

        return back()->with('success', 'Concern reported. A veterinarian will see it on the health board.');
    }

    /** Examinations, diagnoses and treatments are written by a veterinarian only. No override exists. */
    public function clinical(Request $request): RedirectResponse
    {
        abort_unless($request->user()->passes('clinical'), 403, 'Only a veterinarian can record clinical findings.');
        $data = $request->validate([
            'animal_id' => ['required', 'exists:animals,id'], 'kind' => ['required', Rule::in(['examination', 'treatment', 'vaccination', 'deworming'])],
            'title' => ['required', 'string', 'max:120'], 'notes' => ['nullable', 'string', 'max:500'], 'next_due_on' => ['nullable', 'date', 'after_or_equal:today'],
            'health_status' => ['nullable', Rule::in(['healthy', 'watch', 'treatment', 'critical'])],
        ]);

        $animal = Animal::findOrFail($data['animal_id']);
        DB::transaction(function () use ($animal, $data, $request): void {
            $routine = in_array($data['kind'], ['vaccination', 'deworming'], true);
            HealthRecord::create(collect($data)->except('health_status')->all() + ['occurred_on' => now(), 'recorded_by' => $request->user()->name, 'recorded_role' => 'Veterinarian', 'status' => $routine ? 'closed' : 'open', 'severity' => $routine ? null : 'medium']);
            if (! empty($data['health_status'])) {
                $animal->update(['health_status' => $data['health_status']]);
            }
            Farm::event($animal, 'health', ucfirst($data['kind']).": {$data['title']}", $request->user()->name);
        });
        Farm::log($request->user(), ucfirst($data['kind'])." recorded for {$animal->farm_number}", "/goats/{$animal->id}");

        return back()->with('success', 'Veterinary record saved.');
    }

    public function close(Request $request, HealthRecord $record): RedirectResponse
    {
        abort_unless($request->user()->passes('clinical'), 403, 'Only a veterinarian can close a case.');

        DB::transaction(function () use ($record, $request): void {
            $record->update(['status' => 'closed']);
            if (! HealthRecord::where('animal_id', $record->animal_id)->where('status', 'open')->exists()) {
                $record->animal->update(['health_status' => 'healthy']);
            }
            Farm::event($record->animal, 'health', "Case closed: {$record->title}", $request->user()->name);
        });
        Farm::log($request->user(), "Closed a health case for {$record->animal->farm_number}", "/goats/{$record->animal_id}");

        return back()->with('success', 'Case closed.');
    }
}
