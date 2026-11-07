import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Button, Chip, cx, Empty, Field, GoatLabel, HealthChip, PageHeader, Panel, Stat, StatRow, Tabs } from '../components/ui';
import type { Health as HealthState, Option, SharedProps } from '../types';

type Row = { id: number; goatId: string; number: string; name: string | null; coat: string; sex: 'male' | 'female'; health: HealthState; kind: string; title: string; notes: string | null; severity: string | null; by: string; role: string; on: string; next: string | null; overdue?: boolean };
type Props = { open: Row[]; care: Row[]; recent: Row[]; counts: Record<string, number>; goats: Option[] };

const asGoat = (r: Row) => ({ id: r.goatId, number: r.number, name: r.name, coat: r.coat, sex: r.sex });
const label = (o: Option) => `${o.farm_number}${o.name ? ` · ${o.name}` : ''}`;

export default function Health({ open, care, recent, counts, goats }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const isVet = auth?.gates.includes('clinical');
    const [tab, setTab] = useState('open');

    return (
        <>
            <Head title="Veterinary & Health" />
            <PageHeader title="Veterinary & health" description={isVet ? 'You can examine, diagnose and treat. Every record carries your name.' : 'You can report a concern. Diagnosis and treatment are recorded by a veterinarian only.'} />
            <StatRow>
                <Stat label="Open cases" value={counts.open} />
                <Stat label="Critical" value={counts.critical} tone={counts.critical ? 'alert' : undefined} />
                <Stat label="In treatment" value={counts.treatment} />
                <Stat label="On watch" value={counts.watch} />
                <Stat label="Care overdue" value={counts.overdue} tone={counts.overdue ? 'alert' : undefined} />
            </StatRow>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_23rem]">
                <div>
                    <Tabs value={tab} onChange={setTab} tabs={[{ id: 'open', label: 'Open cases', count: open.length }, { id: 'care', label: 'Preventive care', count: care.length }, { id: 'recent', label: 'Closed recently', count: recent.length }]} />
                    {tab === 'open' ? (
                        <Panel flush>
                            {open.length ? (
                                <ul className="divide-y divide-rule">
                                    {open.map((r) => (
                                        <li key={r.id} className="flex flex-wrap items-center gap-3 px-4 py-2.5">
                                            <div className="w-44 min-w-0"><GoatLabel goat={asGoat(r)} /></div>
                                            <div className="min-w-44 flex-1">
                                                <p className="font-semibold text-cobalt-900">{r.title}</p>
                                                <p className="text-sm text-ink-soft first-letter:uppercase">{r.kind} · {r.on} · {r.by}{r.next ? ` · follow-up ${r.next}` : ''}</p>
                                            </div>
                                            <HealthChip health={r.health} />
                                            {isVet ? <Button variant="secondary" onClick={() => router.post(`/health/records/${r.id}/close`, {}, { preserveScroll: true })}>Close case</Button> : null}
                                        </li>
                                    ))}
                                </ul>
                            ) : <Empty title="No open cases" />}
                        </Panel>
                    ) : null}
                    {tab === 'care' ? (
                        <Panel flush>
                            {care.length ? (
                                <ul className="divide-y divide-rule">
                                    {care.map((r) => (
                                        <li key={r.id} className="flex items-center justify-between gap-3 px-4 py-2">
                                            <GoatLabel goat={asGoat(r)} size={34} />
                                            <div className="text-right text-sm"><div className="font-medium">{r.title}</div><div className={cx(r.overdue ? 'font-semibold text-crit-700' : 'text-ink-soft')}>{r.overdue ? `Overdue since ${r.next}` : `Due ${r.next}`}</div></div>
                                        </li>
                                    ))}
                                </ul>
                            ) : <Empty title="Nothing due in the next three weeks" />}
                        </Panel>
                    ) : null}
                    {tab === 'recent' ? (
                        <Panel flush>
                            {recent.length ? <ul className="divide-y divide-rule">{recent.map((r) => <li key={r.id} className="px-4 py-2 text-sm"><Link href={`/goats/${r.goatId}`} className="font-semibold text-cobalt-800 hover:underline">{r.number}</Link> {r.title} <span className="text-ink-soft">· {r.on} · {r.by}</span></li>)}</ul> : <Empty title="No closed cases yet">Closed cases appear here.</Empty>}
                        </Panel>
                    ) : null}
                </div>

                <div className="space-y-4">
                    <ObservationForm goats={goats} />
                    {isVet ? <ClinicalForm goats={goats} /> : (
                        <Panel>
                            <p className="flex items-start gap-2 text-sm text-ink-soft"><ShieldCheck size={17} aria-hidden className="mt-0.5 shrink-0 text-cobalt-600" />Clinical forms appear for veterinarians. This is also enforced on the server, so no other role can submit them.</p>
                        </Panel>
                    )}
                </div>
            </div>
        </>
    );
}

function ObservationForm({ goats }: { goats: Option[] }) {
    const form = useForm({ animal_id: String(goats[0]?.id ?? ''), title: '', severity: 'low', notes: '' });
    return (
        <Panel title="Report a concern">
            <form onSubmit={(e) => { e.preventDefault(); form.post('/health/observations', { preserveScroll: true, onSuccess: () => form.reset('title', 'notes') }); }} className="space-y-3">
                <Field label="Goat" error={form.errors.animal_id}><select className="field" value={form.data.animal_id} onChange={(e) => form.setData('animal_id', e.target.value)}>{goats.map((g) => <option key={g.id} value={g.id}>{label(g)}</option>)}</select></Field>
                <Field label="What did you notice?" error={form.errors.title}><input className="field" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} /></Field>
                <Field label="How serious?"><select className="field" value={form.data.severity} onChange={(e) => form.setData('severity', e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></Field>
                <Button type="submit" className="w-full" disabled={form.processing}>Send to vet</Button>
            </form>
        </Panel>
    );
}

function ClinicalForm({ goats }: { goats: Option[] }) {
    const form = useForm({ animal_id: String(goats[0]?.id ?? ''), kind: 'examination', title: '', notes: '', next_due_on: '', health_status: '' });
    return (
        <Panel title="Veterinary record" description="Veterinarians only">
            <form onSubmit={(e) => { e.preventDefault(); form.post('/health/clinical', { preserveScroll: true, onSuccess: () => form.reset('title', 'notes', 'next_due_on') }); }} className="space-y-3">
                <Field label="Goat"><select className="field" value={form.data.animal_id} onChange={(e) => form.setData('animal_id', e.target.value)}>{goats.map((g) => <option key={g.id} value={g.id}>{label(g)}</option>)}</select></Field>
                <Field label="Type"><select className="field" value={form.data.kind} onChange={(e) => form.setData('kind', e.target.value)}><option value="examination">Examination</option><option value="treatment">Treatment</option><option value="vaccination">Vaccination</option><option value="deworming">Deworming</option></select></Field>
                <Field label="Finding or product" error={form.errors.title}><input className="field" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} /></Field>
                <Field label="Notes"><textarea rows={2} className="field" value={form.data.notes} onChange={(e) => form.setData('notes', e.target.value)} /></Field>
                <Field label="Follow-up or next due" error={form.errors.next_due_on}><input type="date" className="field" value={form.data.next_due_on} onChange={(e) => form.setData('next_due_on', e.target.value)} /></Field>
                <Field label="Set health status"><select className="field" value={form.data.health_status} onChange={(e) => form.setData('health_status', e.target.value)}><option value="">Leave unchanged</option><option value="healthy">Healthy</option><option value="watch">Watch</option><option value="treatment">In treatment</option><option value="critical">Critical</option></select></Field>
                <Button type="submit" className="w-full" disabled={form.processing}>Save record</Button>
                <Chip className="bg-cobalt-100 text-cobalt-800">AI never writes clinical records</Chip>
            </form>
        </Panel>
    );
}
