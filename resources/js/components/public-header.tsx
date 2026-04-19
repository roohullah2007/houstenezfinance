import { Link, router, usePage } from '@inertiajs/react';
import { LayoutGrid, LogIn, LogOut, Menu, Settings, User as UserIcon, X } from 'lucide-react';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { logout } from '@/routes';
import { edit as profileEdit } from '@/routes/profile';
import type { User } from '@/types';

const ACCENT = '#F26B5E';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Car Listings', href: '/car-listings' },
    { label: 'Real Estate', href: '/real-estate' },
    { label: 'Categories', href: '/categories' },
    { label: 'Locations', href: '/locations' },
    { label: 'Dealers', href: '/dealers' },
    { label: 'Sell Your Car', href: '/sell-your-car' },
    { label: 'Finance Application', href: '/finance-application' },
    { label: 'Contact', href: '/contact' },
];

interface PublicHeaderProps {
    logoClassName?: string;
    headerClassName?: string;
}

function getInitial(name: string): string {
    const trimmed = name?.trim();
    if (!trimmed) return '?';
    return trimmed.charAt(0).toUpperCase();
}

export function PublicHeader({ logoClassName, headerClassName }: PublicHeaderProps = {}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { auth } = usePage<{ auth: { user: User | null } }>().props;
    const user = auth?.user ?? null;

    return (
        <header className="relative z-20">
            <div className={`mx-auto flex max-w-[1408px] items-center justify-between px-4 sm:px-6 lg:px-8 ${headerClassName ?? 'h-20'}`}>
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/images/housten-logo-1.png"
                        alt="Houston EZ Finance"
                        className={logoClassName ?? 'h-14 w-36 object-contain sm:h-20 sm:w-52 md:h-24 md:w-60 lg:h-28 lg:w-72'}
                    />
                </Link>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-5 xl:flex xl:gap-6 2xl:gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-white/80 transition hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="hidden items-center justify-center rounded-full ring-2 ring-white/20 transition hover:ring-white/40 focus:outline-none focus:ring-white/60 md:flex"
                                    aria-label="Open user menu"
                                >
                                    <Avatar className="h-10 w-10">
                                        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                                        <AvatarFallback className="bg-white/10 text-sm font-semibold text-white">
                                            {getInitial(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="min-w-60">
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-9 w-9">
                                            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                                            <AvatarFallback className="bg-neutral-200 text-neutral-900">
                                                {getInitial(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left leading-tight">
                                            <span className="truncate font-medium">{user.name}</span>
                                            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem asChild>
                                        <Link href="/admin/dashboard" className="block w-full cursor-pointer">
                                            <LayoutGrid className="mr-2" />
                                            Dashboard
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={profileEdit()} prefetch className="block w-full cursor-pointer">
                                            <Settings className="mr-2" />
                                            Settings
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={logout()}
                                        as="button"
                                        onClick={() => router.flushAll()}
                                        className="block w-full cursor-pointer"
                                    >
                                        <LogOut className="mr-2" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            href="/login"
                            className="hidden items-center gap-1.5 rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-white/10 md:inline-flex"
                        >
                            <LogIn className="h-4 w-4" />
                            Sign In
                        </Link>
                    )}

                    <Link href="/sell-your-car" className="hidden sm:block">
                        <button
                            type="button"
                            className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-110"
                            style={{ backgroundColor: ACCENT }}
                        >
                            Sell Car
                        </button>
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        type="button"
                        onClick={() => setMenuOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 xl:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 xl:hidden">
                    <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
                    <div className="absolute right-0 top-0 flex h-full w-72 max-w-[80vw] flex-col bg-[#0b1020] shadow-2xl">
                        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
                            <span className="text-sm font-semibold uppercase tracking-wider text-white/60">Menu</span>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg text-white hover:bg-white/10"
                                aria-label="Close menu"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {user && (
                            <div className="border-b border-white/10 px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
                                        <AvatarFallback className="bg-white/10 text-sm font-semibold text-white">
                                            {getInitial(user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-white">{user.name}</p>
                                        <p className="truncate text-xs text-white/50">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <nav className="flex-1 overflow-y-auto p-4">
                            <ul className="space-y-1">
                                {navLinks.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setMenuOpen(false)}
                                            className="block rounded-lg px-4 py-3 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}

                                {user ? (
                                    <>
                                        <li className="mt-3 border-t border-white/10 pt-3">
                                            <Link
                                                href="/admin/dashboard"
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                                            >
                                                <LayoutGrid className="h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={profileEdit()}
                                                onClick={() => setMenuOpen(false)}
                                                className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                                            >
                                                <Settings className="h-4 w-4" />
                                                Settings
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={logout()}
                                                as="button"
                                                onClick={() => { setMenuOpen(false); router.flushAll(); }}
                                                className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-left text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Log out
                                            </Link>
                                        </li>
                                    </>
                                ) : (
                                    <li className="mt-3 border-t border-white/10 pt-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                                        >
                                            <UserIcon className="h-4 w-4" />
                                            Sign In
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </nav>
                        <div className="border-t border-white/10 p-4">
                            <Link href="/sell-your-car" onClick={() => setMenuOpen(false)}>
                                <button
                                    type="button"
                                    className="w-full rounded-full py-3 text-sm font-semibold text-white shadow-lg hover:brightness-110"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    Sell Your Car
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
