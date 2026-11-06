<?php

namespace App\Http\Controllers;

use App\Models\FeedingGroup;
use App\Models\FeedingLog;
use App\Support\Farm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FeedingController extends Controller
{
    public function index(): Response
    {
        $today = now()->toDateString();
        $logs = FeedingLog::where('fed_on', $today)->get()->groupBy('feeding_group_id');

        return Inertia::render('Feeding', [
            'groups' => FeedingGroup::withCount(['animals' => fn ($q) => $q->active()])->orderBy('id')->get()->map(fn (FeedingGroup $g) => [
                'id' => $g->id, 'name' => $g->name, 'criteria' => $g->criteria, 'ration' => $g->ration, 'head' => $g->animals_count,
                'planStatus' => $g->plan_status, 'approvedBy' => $g->approved_by, 'approvedOn' => $g->approved_at?->format('j M Y'),
                'today' => ($logs[$g->id] ?? collect())->mapWithKeys(fn (FeedingLog $l) => [$l->session => ['status' => $l->status, 'by' => $l->fed_by]]),
            ]),
            'compliance' => FeedingLog::where('fed_on', '>=', now()->subDays(13)->toDateString())->selectRaw("to_char(fed_on, 'YYYY-MM-DD') as day, count(*) filter (where status = 'done') as done, count(*) as total")->groupBy('day')->orderBy('day')->get(),
        ]);
    }

    public function log(Request $request): RedirectResponse
    {
        $data = $request->validate(['group_id' => ['required', 'exists:feeding_groups,id'], 'session' => ['required', Rule::in(['morning', 'evening'])], 'status' => ['required', Rule::in(['done', 'partial', 'missed'])]]);

        $group = FeedingGroup::findOrFail($data['group_id']);
        abort_unless($group->plan_status === 'approved', 422, 'This plan is waiting for veterinary approval.');
        FeedingLog::updateOrCreate(
            ['feeding_group_id' => $group->id, 'fed_on' => now()->toDateString(), 'session' => $data['session']],
            ['status' => $data['status'], 'fed_by' => $request->user()->name],
        );
        Farm::log($request->user(), "Confirmed {$data['session']} feed for {$group->name}: {$data['status']}", '/feeding');

        return back()->with('success', "{$group->name}: {$data['session']} feed recorded.");
    }

    public function approve(Request $request, FeedingGroup $group): RedirectResponse
    {
        abort_unless($request->user()->passes('approve_feeding_plan'), 403, 'Only an authorised veterinarian approves a feeding plan.');
        $group->update(['plan_status' => 'approved', 'approved_by' => $request->user()->name, 'approved_at' => now()]);
        Farm::log($request->user(), "Approved the feeding plan for {$group->name}", '/feeding');

        return back()->with('success', 'Feeding plan approved.');
    }
}
