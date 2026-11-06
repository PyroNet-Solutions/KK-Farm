import { createInertiaApp } from '@inertiajs/react';
import { MotionConfig } from 'motion/react';
import type { ComponentType, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import AppShell from './components/AppShell';

type PageModule = { default: ComponentType & { layout?: unknown } };

const pages = import.meta.glob<PageModule>('./Pages/**/*.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} · KK Farm` : 'KK Farm'),
    resolve: async (name) => {
        const page = await pages[`./Pages/${name}.tsx`]();
        if (name !== 'Login' && page.default.layout === undefined) {
            page.default.layout = (content: ReactNode) => <AppShell>{content}</AppShell>;
        }
        return page as never;
    },
    setup({ el, App, props }) {
        createRoot(el as HTMLElement).render(
            <MotionConfig reducedMotion="user">
                <App {...props} />
            </MotionConfig>,
        );
    },
    progress: { color: '#33c3bd', delay: 120 },
});
