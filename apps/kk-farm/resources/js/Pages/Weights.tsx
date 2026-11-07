import { Head, useForm } from '@inertiajs/react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import Chart, { axis } from '../components/Chart';
import { Button, cx, Empty, Field, GoatLabel, monthLabel, PageHeader, Panel, Stat, StatRow } from '../components/ui';
import type { GoatCard } from '../types';

type Row = GoatCard & { adg: number | null; previous: number | null; weighedOn: string | null; daysAgo: number | null };
type Props = { goats: Row[]; byBreed: Array<{ breed: string; month: string; kg: number }> };

export default function Weights({ goats, byBreed }: Props) {
    const [query, setQuery] = useState('');
    const [view, setView] = useState('all');
    const form = useForm({ animal_id: goats[0]?.id ?? '', weight_kg: '' });

    const losing = goats.filter((g) => (g.adg ?? 0) < 0);
    const stale = goats.filter((g) => (g.daysAgo ?? 0) > 45);
    const withAdg = goats.filter((g) => g.adg !== null);
    const averageAdg = withAdg.length ? Math.round(withAdg.reduce((sum, g) => sum + (g.adg ?? 0), 0) / withAdg.length) : 0;

    const rows = useMemo(() => {
        const q = query.toLowerCase();
        const pool = view === 'losing' ? losing : view === 'stale' ? stale : goats;
        return pool.filter((g) => !q || g.number.toLowerCase().includes(q) || g.name?.toLowerCase().includes(q));
    }, [goats, query, view]);

    const chart = useMemo(() => {
        const months = [...new Set(byBreed.map((r) => r.month))];
        const breeds = [...new Set(byBreed.map((r) => r.breed))];
        return {
            tooltip: { trigger: 'axis', valueFormatter: (v: number) => (v ? `${v} kg` : '—') },
            legend: { bottom: 0, itemWidth: 12, itemHeight: 8, type: 'scroll' },
            grid: { left: 8, right: 12, top: 14, bottom: 32, containLabel: true },
            xAxis: axis.category(months.map(monthLabel)),
            yAxis: { ...axis.value((v) => `${v} kg`), scale: true },
            series: breeds.map((breed) => ({ name: breed, type: 'line', smooth: true, symbolSize: 5, data: months.map((m) => byBreed.find((r) => r.breed === breed && r.month === m)?.kg ?? null) })),
        };
    }, [byBreed]);

    return (
        <>
            <Head title="Weight & Growth" />
            <PageHeader title="Weight & growth" description="Average daily gain is calculated between the two latest weighings." />
            <StatRow>
                <Stat label="Average daily gain" value={`${averageAdg} g`} note={`${withAdg.length} goats with two weighings`} />
                <Stat label="Losing weight" value={losing.length} tone={losing.length ? 'alert' : undefined} note="Since last weighing" />
                <Stat label="Not weighed in 45 days" value={stale.length} />
            </StatRow>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
                <Panel flush title="All goats" actions={
                    <div className="flex flex-wrap gap-2">
                        <select aria-label="Show" className="field w-auto" value={view} onChange={(e) => setView(e.target.value)}><option value="all">All goats</option><option value="losing">Losing weight</option><option value="stale">Not weighed recently</option></select>
                        <input aria-label="Find goat" placeholder="Find goat" className="field w-40" value={query} onChange={(e) => setQuery(e.target.value)} />
                    </div>
                }>
                    {rows.length ? (
                        <div className="max-h-[62vh] overflow-auto">
                            <table className="data-table min-w-[560px]">
                                <thead><tr><th>Goat</th><th>Latest</th><th>Daily gain</th><th>Weighed</th></tr></thead>
                                <tbody>
                                    {rows.map((g) => (
                                        <tr key={g.id}>
                                            <td><GoatLabel goat={g} size={34} /></td>
                                            <td className="font-semibold whitespace-nowrap">{g.weight ? `${g.weight} kg` : '—'}</td>
                                            <td className={cx('whitespace-nowrap', (g.adg ?? 0) < 0 ? 'font-semibold text-crit-700' : 'text-ok-700')}>
                                                {g.adg === null ? '—' : <span className="inline-flex items-center gap-1">{g.adg < 0 ? <ArrowDownRight size={14} aria-hidden /> : <ArrowUpRight size={14} aria-hidden />}{g.adg} g/day</span>}
                                            </td>
                                            <td className="text-ink-soft">{g.weighedOn}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : <Empty title="No goats in this view" />}
                </Panel>

                <div className="space-y-4">
                    <Panel title="Record a weight">
                        <form onSubmit={(e) => { e.preventDefault(); form.post('/weights', { preserveScroll: true, onSuccess: () => form.reset('weight_kg') }); }} className="space-y-3">
                            <Field label="Goat" error={form.errors.animal_id}><select className="field" value={form.data.animal_id} onChange={(e) => form.setData('animal_id', e.target.value)}>{goats.map((g) => <option key={g.id} value={g.id}>{g.number}{g.name ? ` · ${g.name}` : ''}</option>)}</select></Field>
                            <Field label="Weight (kg)" error={form.errors.weight_kg}><input inputMode="decimal" className="field" value={form.data.weight_kg} onChange={(e) => form.setData('weight_kg', e.target.value)} /></Field>
                            <Button type="submit" className="w-full" disabled={form.processing}>Save weight</Button>
                        </form>
                    </Panel>
                    <Panel title="Average weight by breed"><Chart option={chart} label="Average weight by breed and month" height={270} /></Panel>
                </div>
            </div>
        </>
    );
}
