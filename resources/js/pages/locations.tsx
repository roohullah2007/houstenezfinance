import { Head, Link } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import {
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

const CITY_IMG = [
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606152421802-db97b2c7a11b?w=800&q=80&auto=format&fit=crop',
];

const featuredCities = [
    { name: 'Houston', count: 842, image: CITY_IMG[0] },
    { name: 'Sugar Land', count: 214, image: CITY_IMG[1] },
    { name: 'Katy', count: 186, image: CITY_IMG[2] },
    { name: 'The Woodlands', count: 152, image: CITY_IMG[3] },
    { name: 'Pearland', count: 128, image: CITY_IMG[4] },
    { name: 'Pasadena', count: 94, image: CITY_IMG[5] },
];

const texasCities = [
    'Spring', 'Humble', 'Friendswood', 'League City', 'Cypress',
    'Tomball', 'Conroe', 'Galveston', 'Richmond', 'Missouri City',
    'Baytown', 'Channelview', 'Stafford', 'Bellaire', 'Kingwood',
];

export default function Locations() {
    return (
        <>
            <Head title="Locations — Houston EZ Finance">
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
                            <span className="text-white">Locations</span>
                        </p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Find Cars Near You</h1>
                        <p className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg">
                            Browse vehicles available across Houston, Texas and surrounding areas.
                        </p>
                    </section>
                </div>

                <main>
                    {/* Featured Cities */}
                    <section className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mb-10">
                            <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                Featured Cities
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Top Locations</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredCities.map((city) => (
                                <a
                                    key={city.name}
                                    href="/car-listings"
                                    className="group relative block h-64 overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-xl"
                                >
                                    <img
                                        src={city.image}
                                        alt={city.name}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                    <div className="absolute bottom-0 left-0 p-6 text-white">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" style={{ color: ACCENT }} />
                                            <h3 className="text-2xl font-bold">{city.name}</h3>
                                        </div>
                                        <p className="mt-1 text-sm text-white/80">{city.count} cars available</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>

                    {/* All Cities */}
                    <section className="bg-slate-50 py-16">
                        <div className="mx-auto max-w-[1408px] px-4 sm:px-6 lg:px-8">
                            <div className="mb-10">
                                <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                    All Cities
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">All Texas Cities</h2>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {texasCities.map((c) => (
                                    <a
                                        key={c}
                                        href="/car-listings"
                                        style={{ backgroundColor: '#ffffff' }}
                                        className="block rounded-xl border border-gray-200 px-5 py-4 text-center text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-[#F26B5E] hover:text-[#F26B5E] hover:shadow-md"
                                    >
                                        {c}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Map Placeholder */}
                    <section className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mb-10">
                            <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                Map
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Explore the Area</h2>
                        </div>
                        <div className="flex h-96 items-center justify-center rounded-2xl border border-gray-200 bg-slate-100">
                            <div className="text-center">
                                <MapPin className="mx-auto h-16 w-16" style={{ color: ACCENT }} />
                                <p className="mt-4 text-lg font-semibold text-slate-600">Interactive Map Coming Soon</p>
                            </div>
                        </div>
                    </section>

                    {/* CTA Banner */}
                    <section className="mx-auto max-w-[1408px] px-4 pb-20 sm:px-6 lg:px-8">
                        <div
                            className="relative overflow-hidden rounded-3xl p-10 text-white sm:p-14"
                            style={{ background: `linear-gradient(135deg, ${ACCENT}, #b83d32)` }}
                        >
                            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                        Can't find your city?
                                    </h2>
                                    <p className="mt-3 max-w-xl text-white/90">
                                        Contact us and we'll help you locate a vehicle in your area.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="h-12 rounded-full bg-white px-8 font-semibold shadow-xl hover:brightness-95"
                                    style={{ color: ACCENT }}
                                >
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="bg-[#0b1020] text-white">
                    <div className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <img src="/images/housten-logo.svg" alt="Houston EZ Finance" className="h-14 w-auto" />
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
                                        1234 Main St, Houston, TX 77002
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 shrink-0" />
                                        (713) 555-0123
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 shrink-0" />
                                        hello@houstonezfinance.com
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
