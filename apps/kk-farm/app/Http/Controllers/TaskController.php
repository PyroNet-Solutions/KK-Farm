<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Pen;
use App\Models\Task;
use App\Support\Farm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Tasks', [
            'tasks' => Task::with(['employee', 'pen'])->where('due_on', '>=', now()->subDay()->toDateString())->orderByRaw("case priority when 'high' then 0 else 1 end")->orderBy('id')->get()->map(fn (Task $t) => [
                'id' => $t->id, 'title' => $t->title, 'type' => $t->type, 'priority' => $t->priority, 'status' => $t->status, 'pen' => $t->pen?->name,
                'employee' => $t->employee?->name, 'code' => $t->employee?->code, 'due' => $t->due_on->format('j M'), 'completedBy' => $t->completed_by, 'completedAt' => $t->completed_at?->format('g:i A'),
            ]),
            'employees' => Employee::orderBy('code')->get(['id', 'code', 'name']),
            'pens' => Pen::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless(in_array($request->user()->role, ['ceo', 'manager', 'vet'], true), 403, 'Your role cannot assign tasks.');
        $data = $request->validate(['title' => ['required', 'string', 'max:120'], 'type' => ['required', Rule::in(['feeding', 'cleaning', 'observation', 'weighing', 'other'])], 'employee_id' => ['required', 'exists:employees,id'], 'pen_id' => ['nullable', 'exists:pens,id'], 'priority' => ['required', Rule::in(['normal', 'high'])]]);

        Task::create($data + ['due_on' => now()->toDateString()]);
        Farm::log($request->user(), "Assigned the task: {$data['title']}", '/tasks');

        return back()->with('success', 'Task assigned.');
    }

    public function toggle(Request $request, Task $task): RedirectResponse
    {
        $done = $task->status !== 'done';
        $task->update(['status' => $done ? 'done' : 'open', 'completed_at' => $done ? now() : null, 'completed_by' => $done ? $request->user()->name : null]);
        if ($done) {
            Farm::log($request->user(), "Completed: {$task->title}", '/tasks');
        }

        return back();
    }
}
