import { Link, usePage } from '@inertiajs/react';
import {
    Car,
    LayoutGrid,
    Mail,
    Home,
    Bell,
    ChevronDown,
    LogOut,
    Shield,
    Menu,
    X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { AppLayoutProps } from '@/types';

const ACCENT = '#F26B5E';

const navItems = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Car Listings', href: '/admin/car-listings', icon: Car },
    { title: 'Contact Messages', href: '/admin/contact-messages', icon: Mail },
];

function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const currentPath = usePage().url;
    const { auth } = usePage().props;
    const user = (auth as { user?: { name?: string; email?: string } })?.user;

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] transform transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
                        <Link href="/admin/dashboard" className="flex items-center gap-2">
                            <Shield className="w-8 h-8" style={{ color: ACCENT }} />
                            <span className="text-white font-bold text-lg">Admin Panel</span>
                        </Link>
                        <button className="lg:hidden text-gray-400 hover:text-white" onClick={onClose}>
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const active = currentPath.startsWith(item.href);
                            return (
                                <Link
                                    key={item.title}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        active
                                            ? 'text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                                    style={active ? { backgroundColor: ACCENT } : undefined}
                                    onClick={onClose}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                                style={{ backgroundColor: ACCENT }}
                            >
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </aside>
        </>
    );
}

function AdminHeader({
    title,
    onMenuToggle,
}: {
    title: string;
    onMenuToggle: () => void;
}) {
    const { auth } = usePage().props;
    const user = (auth as { user?: { name?: string } })?.user;

    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                        onClick={onMenuToggle}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        <Home className="w-4 h-4" />
                        View Site
                    </Link>
                    <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                        <Bell className="w-5 h-5" />
                        <span
                            className="absolute top-1 right-1 w-2 h-2 rounded-full"
                            style={{ backgroundColor: ACCENT }}
                        />
                    </button>
                    <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                            style={{ backgroundColor: ACCENT }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                </div>
            </div>
        </header>
    );
}

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Derive page title from last breadcrumb
    const pageTitle = breadcrumbs.length > 0
        ? breadcrumbs[breadcrumbs.length - 1].title
        : 'Dashboard';

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="lg:pl-64">
                <AdminHeader
                    title={pageTitle}
                    onMenuToggle={() => setSidebarOpen(true)}
                />
                <main className="p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
