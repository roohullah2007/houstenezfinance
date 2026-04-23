import { Link, usePage } from '@inertiajs/react';
import {
    Car,
    LayoutGrid,
    Mail,
    Home,
    Building2,
    FileText,
    Bell,
    ChevronDown,
    LogOut,
    Shield,
    Menu,
    X,
    MessageSquare,
    ClipboardList,
    CreditCard,
    ExternalLink,
    User as UserIcon,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { AppLayoutProps } from '@/types';

const ACCENT = '#F26B5E';

const navItems = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
    { title: 'Car Listings', href: '/admin/car-listings', icon: Car },
    { title: 'Real Estate', href: '/admin/real-estate-listings', icon: Building2 },
    { title: 'Real Estate Content', href: '/admin/real-estate-content', icon: FileText },
    { title: 'Finance Applications', href: '/admin/finance-applications', icon: ClipboardList },
    { title: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
    { title: 'Contact Messages', href: '/admin/contact-messages', icon: Mail },
    { title: 'Payment Settings', href: '/admin/payment-settings', icon: CreditCard },
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
    const user = (auth as { user?: { name?: string; email?: string } })?.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        function handleEsc(e: KeyboardEvent) {
            if (e.key === 'Escape') setMenuOpen(false);
        }
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [menuOpen]);

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
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            onClick={() => setMenuOpen((v) => !v)}
                            className="flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100"
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                style={{ backgroundColor: ACCENT }}
                            >
                                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {menuOpen && (
                            <div
                                role="menu"
                                className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5"
                            >
                                <div className="border-b border-gray-100 px-4 py-3">
                                    <p className="truncate text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
                                    <p className="truncate text-xs text-gray-500">{user?.email || ''}</p>
                                </div>
                                <div className="py-1">
                                    <Link
                                        href="/settings/profile"
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setMenuOpen(false)}
                                        role="menuitem"
                                    >
                                        <UserIcon className="h-4 w-4 text-gray-500" />
                                        Profile
                                    </Link>
                                    <Link
                                        href="/admin/payment-settings"
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setMenuOpen(false)}
                                        role="menuitem"
                                    >
                                        <CreditCard className="h-4 w-4 text-gray-500" />
                                        Payment Settings
                                    </Link>
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setMenuOpen(false)}
                                        role="menuitem"
                                    >
                                        <ExternalLink className="h-4 w-4 text-gray-500" />
                                        View Site
                                    </Link>
                                </div>
                                <div className="border-t border-gray-100 py-1">
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                        onClick={() => setMenuOpen(false)}
                                        role="menuitem"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Sign Out
                                    </Link>
                                </div>
                            </div>
                        )}
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
