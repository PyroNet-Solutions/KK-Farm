<?php

namespace App\Http\Controllers;

use App\Models\LedgerEntry;
use App\Support\Farm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/** Ledger entries are append-only: a correction is a reversing entry, never an edit. */
class FinanceController extends Controller
{
    public function index(Request $request): Response
    {
        $yearStart = now()->subMonths(11)->startOfMonth();
        $monthStart = now()->startOfMonth();
        $sum = fn (string $direction, $from) => (float) LedgerEntry::where('direction', $direction)->where('occurred_on', '>=', $from)->sum('amount');

        return Inertia::render('Finance', [
            'summary' => [
                'monthIn' => $sum('in', $monthStart), 'monthOut' => $sum('out', $monthStart),
                'yearIn' => $sum('in', $yearStart), 'yearOut' => $sum('out', $yearStart),
            ],
            'monthly' => LedgerEntry::where('occurred_on', '>=', $yearStart)
                ->selectRaw("to_char(occurred_on, 'YYYY-MM') as month, sum(case when direction = 'in' then amount else 0 end)::float as income, sum(case when direction = 'out' then amount else 0 end)::float as spend")
                ->groupBy('month')->orderBy('month')->get(),
            'categories' => LedgerEntry::where('direction', 'out')->where('occurred_on', '>=', $yearStart)->groupBy('category')
                ->select('category as name', DB::raw('sum(amount)::float as value'))->orderByDesc('value')->get(),
            'entries' => LedgerEntry::with('reversal')->orderByDesc('occurred_on')->orderByDesc('id')->limit(60)->get()->map(fn (LedgerEntry $e) => [
                'id' => $e->id, 'direction' => $e->direction, 'category' => $e->category, 'amount' => $e->amount, 'on' => $e->occurred_on->format('j M Y'), 'counterparty' => $e->counterparty,
                'description' => $e->description, 'by' => $e->recorded_by, 'reversed' => (bool) $e->reversal, 'isReversal' => (bool) $e->reverses_id,
            ]),
            'categoryOptions' => ['Feed', 'Medicine', 'Veterinary', 'Salaries', 'Utilities', 'Maintenance', 'Animal purchase', 'Animal sale', 'Manure and other', 'Other'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate(['direction' => ['required', Rule::in(['in', 'out'])], 'category' => ['required', 'string', 'max:40'], 'amount' => ['required', 'numeric', 'min:1', 'max:100000000'], 'counterparty' => ['nullable', 'string', 'max:80'], 'description' => ['nullable', 'string', 'max:200'], 'occurred_on' => ['required', 'date', 'before_or_equal:today']]);

        LedgerEntry::create($data + ['recorded_by' => $request->user()->name, 'shed_id' => 1]);
        Farm::log($request->user(), "Recorded PKR {$data['amount']} ({$data['category']})", '/finance', 'finance');

        return back()->with('success', 'Entry recorded.');
    }

    public function reverse(Request $request, LedgerEntry $entry): RedirectResponse
    {
        abort_if($entry->reversal()->exists() || $entry->reverses_id, 422, 'This entry cannot be reversed again.');

        LedgerEntry::create([
            'direction' => $entry->direction === 'in' ? 'out' : 'in', 'category' => $entry->category, 'amount' => $entry->amount, 'occurred_on' => now(),
            'counterparty' => $entry->counterparty, 'description' => "Reversal of entry #{$entry->id}", 'shed_id' => $entry->shed_id, 'animal_id' => $entry->animal_id,
            'reverses_id' => $entry->id, 'recorded_by' => $request->user()->name,
        ]);
        Farm::log($request->user(), "Reversed ledger entry #{$entry->id}", '/finance', 'finance');

        return back()->with('success', 'Reversing entry added. The original stays on record.');
    }
}
