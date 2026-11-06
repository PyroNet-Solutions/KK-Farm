import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import GoatPortrait from '../components/GoatPortrait';
import { Button, Chip, cx, Field, Note, PageHeader, Panel } from '../components/ui';
import type { Health } from '../types';

type Goat = { id: string; number: string; name: string | null; coat: string; sex: string; health: Health; repro: string | null };
type Pen = { id: number; name: string; purpose: string; capacity: number | null; count: number; goats: Goat[] };
type Shed = { id: number; code: string; name: string; status: string; pens: Pen[] };
type Props = { sheds: Shed[]; recent: Array<{ id: number; goat_id: string; number: string; summary: string; recorded_by: string }> };

export default function Sheds({ sheds, recent }: Props) {
    const active = sheds.filter((s) => s.status === 'active');
    const planned = sheds.filter((s) => s.status === 'planned');
    const pens = active.flatMap((s) => s.pens);
    const goats = pens.flatMap((p) => p.goats);
    const [selected, setSelected] = useState<number | null>(pens[0]?.id ?? null);
    const pen = pens.find((p) => p.id === selected);
    const form = useForm({ animal_id: goats[0]?.id ?? '', pen_id: String(pens[0]?.id ?? '') });

    return (
        <>
            <Head title="Sheds" />
            <PageHeader title="Sheds" description={`${active.length} shed in use, ${planned.length} planned, ${goats.length} goats housed.`} />
            <div className="mb-4"><Note>This pen layout is a demo placeholder. The real shed layout and capacity come from the farm visit.</Note></div>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="space-y-4">
                    {active.map((shed) => (
                        <Panel key={shed.id} title={shed.name} description={shed.code}>
                            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                                {shed.pens.map((p) => {
                                    const fill = p.capacity ? Math.min(100, Math.round((p.count / p.capacity) * 100)) : 0;
                                    return (
                                        <button key={p.id} type="button" aria-pressed={selected === p.id} onClick={() => setSelected(p.id)} className={cx('rounded-tile border p-3 text-left transition-colors', selected === p.id ? 'border-cobalt-700 bg-cobalt-100' : 'border-rule hover:border-rule-strong')}>
                                            <div className="flex items-baseline justify-between gap-2"><span className="font-semibold text-cobalt-900">{p.name}</span><span className="text-sm text-ink-soft">{p.count}{p.capacity ? ` of ${p.capacity}` : ''}</span></div>
                                            <div className="text-sm text-ink-soft">{p.purpose}</div>
                                            <div className="mt-2 h-1.5 overflow-hidden rounded-sm bg-rule" role="progressbar" aria-valuenow={fill} aria-valuemin={0} aria-valuemax={100} aria-label={`${p.name} occupancy`}><div className={cx('h-full', fill > 90 ? 'bg-treat-400' : 'bg-turq-600')} style={{ width: `${fill}%` }} /></div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Panel>
                    ))}

                    {pen ? (
                        <Panel title={`${pen.name}: ${pen.purpose}`} description={`${pen.count} goats`}>
                            <div className="flex flex-wrap gap-2">
                                {pen.goats.map((g) => (
                                    <Link key={g.id} href={`/goats/${g.id}`} className="flex w-40 items-center gap-2 rounded-tile border border-rule p-1.5 hover:border-turq-600">
                                        <GoatPortrait number={g.number} coat={g.coat} sex={g.sex} size={32} />
                                        <span className="min-w-0 truncate text-sm font-medium">{g.name ?? g.number}</span>
                                    </Link>
                                ))}
                            </div>
                        </Panel>
                    ) : null}

                    <Panel title="Planned sheds">
                        <div className="flex flex-wrap gap-2">
                            {planned.map((s) => <Chip key={s.id} className="bg-cobalt-100 px-2.5 py-1.5 text-sm text-cobalt-800">{s.name}</Chip>)}
                        </div>
                    </Panel>
                </div>

                <div className="space-y-4">
                    <Panel title="Move a goat">
                        <form onSubmit={(e) => { e.preventDefault(); form.post('/sheds/transfer', { preserveScroll: true }); }} className="space-y-3">
                            <Field label="Goat" error={form.errors.animal_id}><select className="field" value={form.data.animal_id} onChange={(e) => form.setData('animal_id', e.target.value)}>{goats.map((g) => <option key={g.id} value={g.id}>{g.number}{g.name ? ` · ${g.name}` : ''}</option>)}</select></Field>
                            <Field label="To pen" error={form.errors.pen_id}><select className="field" value={form.data.pen_id} onChange={(e) => form.setData('pen_id', e.target.value)}>{pens.map((p) => <option key={p.id} value={p.id}>{p.name}: {p.purpose}</option>)}</select></Field>
                            <Button type="submit" className="w-full" disabled={form.processing}>Move goat</Button>
                        </form>
                    </Panel>
                    <Panel title="Recent moves" flush>
                        {recent.length ? <ul className="divide-y divide-rule text-sm">{recent.map((r) => <li key={r.id} className="px-4 py-2"><Link href={`/goats/${r.goat_id}`} className="font-semibold text-cobalt-800 hover:underline">{r.number}</Link> {r.summary}<div className="text-ink-faint">{r.recorded_by}</div></li>)}</ul> : <p className="p-4 text-sm text-ink-soft">Moves you make appear here and on each goat's lifecycle.</p>}
                    </Panel>
                </div>
            </div>
        </>
    );
}
