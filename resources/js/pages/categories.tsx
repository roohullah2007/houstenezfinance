import { Head, Link } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import {
    Car,
    Bus,
    Caravan,
    CarFront,
    Truck,
    Fuel,
    Leaf,
    Zap,
    Droplet,
    DollarSign,
    Facebook,
    Twitter,
    Instagram,
    Phone,
    Mail,
    MapPin,
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

const bodyTypes = [
    { name: 'Sedan', offers: 128, Icon: Car },
    { name: 'SUVs', offers: 96, Icon: CarFront },
    { name: 'Coupe', offers: 54, Icon: Car },
    { name: 'Convertibles', offers: 32, Icon: Caravan },
    { name: 'MPV', offers: 47, Icon: Bus },
    { name: 'Truck', offers: 78, Icon: Truck },
    { name: 'Wagon', offers: 22, Icon: Car },
    { name: 'Crossover', offers: 63, Icon: CarFront },
];

const priceRanges = [
    { label: 'Under $10K', range: '$0 – $10,000', count: 214, href: '/car-listings?max_price=10000' },
    { label: '$10K – $15K', range: '$10,000 – $15,000', count: 387, href: '/car-listings?min_price=10000&max_price=15000' },
    { label: '$20K – $30K', range: '$20,000 – $30,000', count: 256, href: '/car-listings?min_price=20000&max_price=30000' },
    { label: '$40K+', range: '$40,000 & Up', count: 142, href: '/car-listings?min_price=40000' },
];

const fuelTypes = [
    { name: 'Gasoline', count: 612, Icon: Fuel },
    { name: 'Hybrid', count: 184, Icon: Leaf },
    { name: 'Electric', count: 97, Icon: Zap },
    { name: 'Diesel', count: 56, Icon: Droplet },
];

const brands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Ford', 'Tesla', 'Audi', 'Lexus', 'Porsche', 'Chevrolet'];

export default function Categories() {
    return (
        <>
            <Head title="Browse Categories — Houston EZ Finance">
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
                            <span className="text-white">Categories</span>
                        </p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Browse Categories</h1>
                        <p className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg">
                            Find the perfect car by body style, price range, or fuel type.
                        </p>
                    </section>
                </div>

                <main>
                    {/* Body Type */}
                    <section className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mb-10">
                            <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                Body Type
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Shop by Body Type</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {bodyTypes.map(({ name, offers, Icon }) => (
                                <a
                                    key={name}
                                    href="/car-listings"
                                    style={{ backgroundColor: '#ffffff' }}
                                    className="group block rounded-2xl border border-gray-200 p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-[#F26B5E] hover:shadow-xl"
                                >
                                    <div
                                        className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full transition group-hover:scale-110"
                                        style={{ backgroundColor: `${ACCENT}1A` }}
                                    >
                                        <Icon className="h-8 w-8" style={{ color: ACCENT }} />
                                    </div>
                                    <h3 className="font-semibold text-slate-900">{name}</h3>
                                    <p className="mt-1 text-sm text-slate-500">{offers} offers</p>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Price Range */}
                    <section className="bg-slate-50 py-16">
                        <div className="mx-auto max-w-[1408px] px-4 sm:px-6 lg:px-8">
                            <div className="mb-10">
                                <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                    Price
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Shop by Price Range</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {priceRanges.map((p) => (
                                    <a
                                        key={p.label}
                                        href={p.href}
                                        style={{ backgroundColor: '#ffffff' }}
                                        className="group block rounded-2xl border border-gray-200 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#F26B5E] hover:shadow-xl"
                                    >
                                        <div
                                            className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
                                            style={{ backgroundColor: `${ACCENT}1A` }}
                                        >
                                            <DollarSign className="h-7 w-7" style={{ color: ACCENT }} />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">{p.label}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{p.range}</p>
                                        <p className="mt-3 text-sm font-semibold" style={{ color: ACCENT }}>
                                            {p.count} vehicles
                                        </p>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Fuel Type */}
                    <section className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mb-10">
                            <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                Fuel
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Shop by Fuel Type</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {fuelTypes.map(({ name, count, Icon }) => (
                                <a
                                    key={name}
                                    href="/car-listings"
                                    style={{ backgroundColor: '#ffffff' }}
                                    className="group block rounded-2xl border border-gray-200 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#F26B5E] hover:shadow-xl"
                                >
                                    <div
                                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl"
                                        style={{ backgroundColor: `${ACCENT}1A` }}
                                    >
                                        <Icon className="h-7 w-7" style={{ color: ACCENT }} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                                    <p className="mt-2 text-sm text-slate-500">{count} vehicles available</p>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* Popular Brands */}
                    <section className="bg-slate-50 py-16">
                        <div className="mx-auto max-w-[1408px] px-4 sm:px-6 lg:px-8">
                            <div className="mb-10">
                                <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                    Brands
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Popular Brands</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {brands.map((b) => (
                                    <a
                                        key={b}
                                        href="/car-listings"
                                        style={{ backgroundColor: '#ffffff' }}
                                        className="block rounded-2xl border border-gray-200 px-6 py-6 text-center text-lg font-bold tracking-tight text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-[#F26B5E] hover:text-[#F26B5E] hover:shadow-xl"
                                    >
                                        {b}
                                    </a>
                                ))}
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
