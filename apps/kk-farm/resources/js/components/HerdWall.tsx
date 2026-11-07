import { Link } from '@inertiajs/react';
import { useState } from 'react';
import GoatPortrait from './GoatPortrait';
import { cx, HEALTH } from './ui';
import type { Health } from '../types';

export type WallGoat = { id: string; number: string; name: string | null; sex: string; coat: string; health: Health; repro: string | null };
export type WallPen = { id: number; name: string; purpose: string; capacity: number | null; goats: WallGoat[] };

const FRAME: Record<Health, string> = { healthy: 'ring-cobalt-200', watch: 'ring-watch-400', treatment: 'ring-treat-400', critical: 'ring-crit-500' };

const FILTERS: Array<{ id: string; label: string; swatch: string; test: (g: WallGoat) => boolean }> = [
    { id: 'all', label: 'All', swatch: 'bg-cobalt-200', test: () => true },
    { id: 'watch', label: 'Watch', swatch: 'bg-watch-400', test: (g) => g.health === 'watch' },
    { id: 'treatment', label: 'In treatment', swatch: 'bg-treat-400', test: (g) => g.health === 'treatment' },
    { id: 'critical', label: 'Critical', swatch: 'bg-crit-500', test: (g) => g.health === 'critical' },
    { id: 'pregnant', label: 'Pregnant', swatch: 'bg-manganese-600', test: (g) => g.repro === 'pregnant' },
    { id: 'lactating', label: 'Lactating', swatch: 'bg-turq-600', test: (g) => g.repro === 'lactating' },
];

/** Every goat as a tile. Tiles hold their place: filters dim, they never reorder, so the wall stays a map of the herd. */
export default function HerdWall({ pens, size = 36 }: { pens: WallPen[]; size?: number }) {
    const [filter, setFilter] = useState('all');
    const [hovered, setHovered] = useState<WallGoat | null>(null);
    const active = FILTERS.find((f) => f.id === filter) ?? FILTERS[0];
    const goats = pens.flatMap((p) => p.goats);

    return (
        <div>
            <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Highlight goats">
                {FILTERS.map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        aria-pressed={filter === f.id}
                        onClick={() => setFilter(f.id)}
                        className={cx(
                            'inline-flex min-h-9 items-center gap-1.5 rounded-[4px] border px-2.5 text-sm font-medium transition-colors',
                            filter === f.id ? 'border-cobalt-700 bg-cobalt-100 text-cobalt-900' : 'border-rule bg-tile text-ink-soft hover:border-rule-strong',
                        )}
                    >
                        <span className={cx('size-2.5 rounded-[2px]', f.swatch)} aria-hidden />
                        {f.label}
                        <span className="text-ink-faint">{goats.filter(f.test).length}</span>
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {pens.filter((p) => p.goats.length).map((pen) => (
                    <div key={pen.id} className="grid gap-x-3 gap-y-1 sm:grid-cols-[7.5rem_1fr]">
                        <div className="text-sm leading-tight">
                            <div className="font-semibold text-cobalt-900">{pen.name}</div>
                            <div className="text-ink-soft">{pen.purpose} · {pen.goats.length}</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {pen.goats.map((goat) => {
                                const on = active.test(goat);
                                return (
                                    <Link
                                        key={goat.id}
                                        href={`/goats/${goat.id}`}
                                        aria-label={`${goat.number}${goat.name ? `, ${goat.name}` : ''}, ${HEALTH[goat.health].label}`}
                                        onMouseEnter={() => setHovered(goat)}
                                        onFocus={() => setHovered(goat)}
                                        className={cx(
                                            'relative block rounded-[6px] ring-2 transition-[opacity,transform] duration-200 ease-out hover:z-10 hover:scale-125 focus-visible:z-10 focus-visible:scale-125',
                                            FRAME[goat.health],
                                            !on && 'opacity-[0.16]',
                                        )}
                                    >
                                        <GoatPortrait number={goat.number} coat={goat.coat} sex={goat.sex} size={size} />
                                        {goat.repro ? <span className={cx('absolute -top-1 -right-1 size-2.5 rounded-full ring-2 ring-tile', goat.repro === 'pregnant' ? 'bg-manganese-600' : 'bg-turq-600')} aria-hidden /> : null}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-3 min-h-6 border-t border-rule pt-2 text-sm text-ink-soft" aria-live="polite">
                {hovered ? (
                    <>
                        <span className="font-semibold text-cobalt-900">{hovered.number}</span>
                        {hovered.name ? ` · ${hovered.name}` : ''} · {HEALTH[hovered.health].label}
                        {hovered.repro ? ` · ${hovered.repro}` : ''}
                    </>
                ) : (
                    'Each tile is one goat. Select a tile to open its full record.'
                )}
            </p>
        </div>
    );
}
