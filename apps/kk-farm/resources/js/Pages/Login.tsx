import { Head, router, usePage } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import GoatPortrait from '../components/GoatPortrait';
import type { SharedProps } from '../types';

const SCOPE: Record<string, string> = {
    ceo: 'Everything: herd, finance, settings',
    manager: 'Daily operations, no finance',
    vet: 'Clinical records and approvals',
    caretaker: 'Scan, weigh, observe, report',
    feeding: "Today's feeding and tasks",
    cleaning: 'Cleaning tasks and sheds',
    finance: 'Expenses, income, reports',
};

const COATS = ['black', 'spotted', 'brown', 'boer', 'tan', 'white'];

export default function Login() {
    const { roles } = usePage<SharedProps>().props;
    const tiles = useMemo(() => Array.from({ length: 48 }, (_, i) => ({ number: `DEMO-${i * 7 + 3}`, coat: COATS[(i * 5) % COATS.length], sex: i % 3 ? 'female' : 'male' })), []);

    return (
        <div className="grid min-h-dvh lg:grid-cols-[1fr_30rem]">
            <Head title="Sign in" />
            <div className="relative hidden overflow-hidden bg-cobalt-900 lg:block" aria-hidden>
                <div className="grid h-full grid-cols-8 content-center gap-2 p-8 opacity-90">
                    {tiles.map((t) => (
                        <GoatPortrait key={t.number} number={t.number} coat={t.coat} sex={t.sex} size={84} className="h-auto w-full" />
                    ))}
                </div>
            </div>
            <main className="flex flex-col justify-center bg-tile px-6 py-10 sm:px-10">
                <div className="mb-7">
                    <h1 className="text-3xl font-bold tracking-tight text-cobalt-900">KK Farm</h1>
                    <p className="mt-1 text-ink-soft">Every goat, one permanent record.</p>
                </div>
                <h2 className="font-semibold text-ink">Choose a role to explore</h2>
                <p className="mb-3 text-sm text-ink-soft">Local preview with simulated sign-in and synthetic data. No passwords are used here.</p>
                <div className="divide-y divide-rule rounded-tile border border-rule">
                    {Object.entries(roles).map(([role, label]) => (
                        <button key={role} type="button" onClick={() => router.post('/login', { role })} className="group flex min-h-14 w-full items-center justify-between gap-3 px-3.5 py-2 text-left transition-colors hover:bg-cobalt-100">
                            <span className="min-w-0">
                                <span className="block font-semibold text-cobalt-900">{label}</span>
                                <span className="block truncate text-sm text-ink-soft">{SCOPE[role]}</span>
                            </span>
                            <ArrowRight size={17} aria-hidden className="shrink-0 text-turq-700 transition-transform group-hover:translate-x-0.5" />
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}
