import { Head, Link } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import {
    Star,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
} from 'lucide-react';

const ACCENT = '#F26B5E';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Car Listings', href: '/car-listings' },
    { label: 'Categories', href: '/categories' },
    { label: 'Locations', href: '/locations' },
    { label: 'Dealers', href: '/dealers' },
    { label: 'Sell Your Car', href: '/sell-your-car' },
    { label: 'Contact', href: '/contact' },
];

const stats = [
    { number: '150+', label: 'Verified Dealers' },
    { number: '10,000+', label: 'Vehicles Listed' },
    { number: '4.9', label: 'Avg Rating' },
    { number: '25', label: 'Years Combined Experience' },
];

const dealers = [
    { name: 'Houston Premium Motors', initials: 'HP', color: '#1e3a8a', rating: 5, location: 'Houston, TX', listings: 148, phone: '(713) 555-0148' },
    { name: 'Elite Auto Gallery', initials: 'EA', color: '#7c2d12', rating: 5, location: 'Sugar Land, TX', listings: 112, phone: '(281) 555-0112' },
    { name: 'Luxury Drive Houston', initials: 'LD', color: '#065f46', rating: 5, location: 'Katy, TX', listings: 96, phone: '(832) 555-0096' },
    { name: 'Prestige Motor Cars', initials: 'PM', color: '#4c1d95', rating: 5, location: 'The Woodlands, TX', listings: 84, phone: '(936) 555-0084' },
    { name: 'Texas Truck Center', initials: 'TT', color: '#b45309', rating: 5, location: 'Pasadena, TX', listings: 203, phone: '(713) 555-0203' },
    { name: 'Lexus of Houston', initials: 'LH', color: '#0f172a', rating: 5, location: 'Pearland, TX', listings: 127, phone: '(281) 555-0127' },
];

export default function Dealers() {
    return (
        <>
            <Head title="Dealers — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-white font-sans text-slate-900">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div
                        className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full opacity-30 blur-3xl"
                        style={{ background: ACCENT }}
                    />
                    <PublicHeader />

                    <section className="relative z-10 mx-auto max-w-[1408px] px-4 pt-10 pb-16 sm:px-6 lg:px-8">
                        <p className="text-sm text-white/60">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white">Dealers</span>
                        </p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Trusted Dealer Network</h1>
                        <p className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg">
                            Shop with confidence from our verified dealer partners across Houston.
                        </p>
                    </section>
                </div>

                <main>
                    {/* Stats */}
                    <section className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    style={{ backgroundColor: '#ffffff' }}
                                    className="rounded-2xl border border-gray-200 p-6 text-center shadow-sm"
                                >
                                    <p className="text-4xl font-bold sm:text-5xl" style={{ color: ACCENT }}>
                                        {s.number}
                                    </p>
                                    <p className="mt-2 text-sm font-medium text-slate-600">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Featured Dealers */}
                    <section className="bg-slate-50 py-16">
                        <div className="mx-auto max-w-[1408px] px-4 sm:px-6 lg:px-8">
                            <div className="mb-10">
                                <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                    Featured
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Featured Dealers</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {dealers.map((d) => (
                                    <div
                                        key={d.name}
                                        style={{ backgroundColor: '#ffffff' }}
                                        className="rounded-2xl border border-gray-200 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="flex h-16 w-16 items-center justify-center rounded-xl text-lg font-bold text-white"
                                                style={{ backgroundColor: d.color }}
                                            >
                                                {d.initials}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-slate-900">{d.name}</h3>
                                                <div className="mt-1 flex items-center gap-0.5">
                                                    {[...Array(d.rating)].map((_, i) => (
                                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 space-y-2 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                                                <span>{d.location}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 shrink-0" style={{ color: ACCENT }} />
                                                <span>{d.phone}</span>
                                            </div>
                                            <p className="pt-1 text-sm font-semibold text-slate-700">
                                                {d.listings} listings available
                                            </p>
                                        </div>
                                        <a
                                            href="/car-listings"
                                            className="mt-5 flex h-11 items-center justify-center rounded-full text-sm font-semibold text-white shadow-md transition hover:brightness-110"
                                            style={{ backgroundColor: ACCENT }}
                                        >
                                            View Inventory
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Become a Dealer CTA */}
                    <section className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1020] via-[#1a1f3a] to-[#0b1020] p-10 text-white sm:p-14">
                            <div
                                className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
                                style={{ background: ACCENT }}
                            />
                            <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Become a Dealer</h2>
                                    <p className="mt-3 max-w-xl text-white/70">
                                        Join our network of verified dealers and connect with thousands of qualified buyers across Texas.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="h-12 rounded-full px-8 font-semibold text-white shadow-xl hover:brightness-110"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-[#0b1020] text-white">
                    <div className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <img src="/images/housten-logo-1.png" alt="Houston EZ Finance" className="h-14 w-auto" />
                                <p className="mt-4 text-sm leading-relaxed text-white/60">
                                    Your trusted marketplace for quality vehicles and hassle-free auto financing in Houston and beyond.
                                </p>
                                <div className="mt-5 flex items-center gap-3">
                                    {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#F26B5E]"
                                        >
                                            <Icon className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['About Us', 'Car Listings', 'Dealers', 'Blog', 'Contact'].map((l) => (
                                        <li key={l}>
                                            <a href="#" className="transition hover:text-[#F26B5E]">{l}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Categories</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['Sedan', 'SUV', 'Coupe', 'Convertible', 'Truck'].map((c) => (
                                        <li key={c}>
                                            <a href="#" className="transition hover:text-[#F26B5E]">{c}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Contact</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    <li className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                        3505 S Dairy Ashford Rd # 115 717, Houston, TX 77082
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 shrink-0" />
                                        832-322-2354
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 shrink-0" />
                                        houstonezfinance@gmail.com
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="my-10 h-px bg-white/10" />
                        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/50 sm:flex-row">
                            <p>© {new Date().getFullYear()} Houston EZ Finance. All rights reserved.</p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-white">Privacy Policy</a>
                                <a href="#" className="hover:text-white">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
