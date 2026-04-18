import { Link } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const ACCENT = '#F26B5E';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Car Listings', href: '/car-listings' },
    { label: 'Real Estate', href: '/real-estate' },
    { label: 'Categories', href: '/categories' },
    { label: 'Locations', href: '/locations' },
    { label: 'Dealers', href: '/dealers' },
    { label: 'Sell Your Car', href: '/sell-your-car' },
    { label: 'Contact', href: '/contact' },
];

interface PublicHeaderProps {
    logoClassName?: string;
    headerClassName?: string;
}

export function PublicHeader({ logoClassName, headerClassName }: PublicHeaderProps = {}) {
    const [menuOpen, setMenuOpen] = useState(false);

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
                <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
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
                    <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20 md:flex">
                        <span className="text-sm font-semibold text-white">HZ</span>
                    </div>
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
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setMenuOpen(false)}
                    />
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
