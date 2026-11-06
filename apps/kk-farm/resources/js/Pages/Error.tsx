import { Head, Link } from '@inertiajs/react';
import { Button } from '../components/ui';

export default function ErrorPage({ status }: { status: number }) {
    const forbidden = status === 403;
    return (
        <div className="mx-auto max-w-md py-16 text-center">
            <Head title={forbidden ? 'No access' : 'Not found'} />
            <h1 className="text-2xl font-bold text-cobalt-900">{forbidden ? 'Your role cannot open this' : 'This page does not exist'}</h1>
            <p className="mt-2 text-ink-soft">{forbidden ? 'Access is checked on the server for every request. Switch role from the top bar to compare what each person can see.' : 'Check the address, or go back to the dashboard.'}</p>
            <Link href="/" className="mt-5 inline-block"><Button>Back to dashboard</Button></Link>
        </div>
    );
}
