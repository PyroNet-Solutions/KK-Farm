import { Head, router, usePage } from '@inertiajs/react';
import { Check, Clock } from 'lucide-react';
import { useMemo } from 'react';
import Chart, { axis } from '../components/Chart';
import { Button, Chip, cx, Note, PageHeader, Panel } from '../components/ui';
import type { SharedProps } from '../types';

type Group = { id: number; name: string; criteria: string; ration: Array<{ item: string; kg: number }>; head: number; planStatus: string; approvedBy: string | null; approvedOn: string | null; today: Record<string, { status: string; by: string }> };
type Props = { groups: Group[]; compliance: Array<{ day: string; done: number; total: number }> };

export default function Feeding({ groups, compliance }: Props) {
    const { auth } = usePage<SharedProps>().props;
    const canApprove = auth?.gates.includes('approve_feeding_plan');

    const chart = useMemo(() => ({
        tooltip: { trigger: 'axis', valueFormatter: (v: number) => `${v}%` },
        xAxis: axis.category(compliance.map((c) => new Date(c.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))),
        yAxis: { ...axis.value((v) => `${v}%`), min: 0, max: 100 },
        series: [{ type: 'bar', barMaxWidth: 26, data: compliance.map((c) => Math.round((c.done / Math.max(1, c.total)) * 100)), itemStyle: { color: '#1f9a96', borderRadius: [3, 3, 0, 0] } }],
    }), [compliance]);

    const log = (groupId: number, session: string, status: string) => router.post('/feeding/log', { group_id: groupId, session, status }, { preserveScroll: true });

    return (
        <>
            <Head title="Feeding & Nutrition" />
            <PageHeader title="Feeding & nutrition" description="Group feeding, with plans approved by a veterinarian before they take effect." />
            <div className="mb-4"><Note>Groups, rations and quantities here are demo placeholders. The real ones come from the farm visit and need professional review.</Note></div>

            <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                {groups.map((g) => {
                    const approved = g.planStatus === 'approved';
                    return (
                        <Panel key={g.id} title={g.name} description={`${g.head} goats · ${g.criteria}`} actions={approved ? <Chip className="bg-ok-100 text-ok-700">Approved</Chip> : <Chip className="bg-watch-100 text-watch-700">Awaiting vet</Chip>}>
                            <ul className="mb-3 space-y-1 text-sm">
                                {g.ration.map((r) => <li key={r.item} className="flex justify-between gap-2 border-b border-rule pb-1 last:border-0"><span>{r.item}</span><span className="font-semibold">{r.kg} kg per head</span></li>)}
                            </ul>
                            {approved ? (
                                <>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['morning', 'evening'].map((session) => {
                                            const entry = g.today[session];
                                            return (
                                                <button
                                                    key={session}
                                                    type="button"
                                                    onClick={() => log(g.id, session, entry?.status === 'done' ? 'partial' : 'done')}
                                                    className={cx('flex min-h-14 flex-col items-start justify-center rounded-tile border px-3 text-left text-sm transition-colors', entry?.status === 'done' ? 'border-ok-700/40 bg-ok-100 text-ok-700' : entry ? 'border-watch-400 bg-watch-100 text-watch-700' : 'border-rule-strong hover:bg-cobalt-100')}
                                                >
                                                    <span className="flex items-center gap-1.5 font-semibold capitalize">{entry?.status === 'done' ? <Check size={15} aria-hidden /> : <Clock size={15} aria-hidden />}{session}</span>
                                                    <span className="text-xs">{entry ? (entry.status === 'done' ? 'Fed' : 'Partly fed') : 'Tap when fed'}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p className="mt-2 text-sm text-ink-faint">Approved by {g.approvedBy}, {g.approvedOn}</p>
                                </>
                            ) : canApprove ? (
                                <Button className="w-full" onClick={() => router.post(`/feeding/groups/${g.id}/approve`, {}, { preserveScroll: true })}>Approve this plan</Button>
                            ) : (
                                <p className="text-sm text-ink-soft">This plan takes effect after a veterinarian approves it.</p>
                            )}
                        </Panel>
                    );
                })}
            </div>

            <Panel title="Feeding completed, last 14 days" className="mt-4"><Chart option={chart} label="Daily feeding completion" height={200} /></Panel>
        </>
    );
}
