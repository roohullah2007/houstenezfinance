import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
            case name === 'car-listings':
            case name === 'car-listings/show':
            case name === 'categories':
            case name === 'locations':
            case name === 'dealers':
            case name === 'sell-your-car':
            case name === 'sell-your-car/payment':
            case name === 'sell-your-car/thank-you':
            case name === 'contact':
            case name === 'real-estate':
            case name === 'real-estate/show':
            case name === 'finance-application':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Unregister any lingering service workers and clear Cache Storage.
// Prevents leftover service workers from earlier dev projects on 127.0.0.1
// from intercepting fetches and causing ERR_CONNECTION_REFUSED errors.
// Safe: this app does not ship its own service worker.
if (typeof window !== 'undefined') {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .getRegistrations()
            .then((regs) => regs.forEach((r) => r.unregister()))
            .catch(() => {});
    }
    if ('caches' in window) {
        caches
            .keys()
            .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
            .catch(() => {});
    }
}
