import { Head, Link, router } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import {
    Search,
    Car,
    ChevronLeft,
    ChevronRight,
    Facebook,
    Twitter,
    Instagram,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react';
import { useState } from 'react';

const ACCENT = '#F26B5E';

interface CarListing {
    id: number;
    title: string;
    state: string;
    city: string;
    make: string;
    model: string;
    year: number;
    price: string;
    miles: number;
    transmission: string;
    vehicle_type: string;
    images: string[] | null;
    main_image_index: number;
    created_at: string;
}

interface PaginatedListings {
    data: CarListing[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    listings: PaginatedListings;
    filters: { search?: string; vehicle_type?: string };
}

function timeAgo(date: string): string {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
}

export default function CarListings({ listings, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [vehicleType, setVehicleType] = useState(filters.vehicle_type || '');

    function applyFilters() {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        if (vehicleType) params.vehicle_type = vehicleType;
        router.get('/car-listings', params, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Car Listings — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />

                    <PublicHeader />

                    <div className="relative z-10 mx-auto max-w-[1408px] px-4 pb-12 pt-4 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Car Listings</h1>
                        <p className="mt-2 text-lg text-white/70">Browse {listings.total} {listings.total === 1 ? 'vehicle' : 'vehicles'} available now</p>

                        {/* Search & Filter */}
                        <div className="mt-6 flex flex-col gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur sm:flex-row sm:items-center">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                                <input
                                    type="text"
                                    placeholder="Search by title, make, model, city..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                                    className="w-full rounded-lg border border-white/20 bg-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/50 backdrop-blur focus:border-[#F26B5E] focus:outline-none"
                                />
                            </div>
                            <select
                                value={vehicleType}
                                onChange={(e) => setVehicleType(e.target.value)}
                                className="rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white backdrop-blur focus:border-[#F26B5E] focus:outline-none"
                            >
                                <option value="" className="text-gray-900">All Types</option>
                                {['Sedan','SUV','Truck','Coupe','Convertible','Hatchback','Van','Wagon','Crossover'].map((t) => (
                                    <option key={t} value={t} className="text-gray-900">{t}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={applyFilters}
                                className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:brightness-110"
                                style={{ backgroundColor: ACCENT }}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Listings Grid */}
                <div className="mx-auto max-w-[1408px] px-4 py-10 sm:px-6 lg:px-8">
                    {listings.data.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                            <Car className="mx-auto h-16 w-16 text-gray-300" />
                            <h3 className="mt-4 text-lg font-semibold text-gray-900">No listings found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {filters.search || filters.vehicle_type
                                    ? 'Try adjusting your search or filters.'
                                    : 'Check back soon for new vehicle listings.'}
                            </p>
                            <Link
                                href="/sell-your-car"
                                className="mt-6 inline-flex items-center rounded-full px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                                style={{ backgroundColor: ACCENT }}
                            >
                                List Your Car
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {listings.data.map((car) => {
                                    const mainImg = car.images && car.images.length > 0
                                        ? car.images[car.main_image_index ?? 0] ?? car.images[0]
                                        : null;
                                    return (
                                        <Link
                                            key={car.id}
                                            href={`/car-listings/${car.id}`}
                                            className="group block overflow-hidden rounded-xl border border-gray-200 bg-white text-slate-900 transition-shadow hover:shadow-lg"
                                        >
                                            <div className="relative" style={{ height: 180 }}>
                                                {mainImg ? (
                                                    <img
                                                        src={`/storage/${mainImg}`}
                                                        alt={car.title}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                        <Car className="h-10 w-10 text-gray-300" />
                                                    </div>
                                                )}
                                                <div className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
                                                    {timeAgo(car.created_at)}
                                                </div>
                                            </div>
                                            <div className="p-3">
                                                <h3 className="truncate text-sm font-semibold text-slate-900">{car.title}</h3>
                                                <p className="mt-1 text-lg font-bold" style={{ color: ACCENT }}>
                                                    ${Number(car.price).toLocaleString()}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12px] text-gray-500">
                                                    <span><strong className="text-gray-700">{Number(car.miles).toLocaleString()}</strong> mi</span>
                                                    <span className="text-gray-300">|</span>
                                                    <span><strong className="text-gray-700">{car.transmission}</strong></span>
                                                    <span className="text-gray-300">|</span>
                                                    <span>{car.vehicle_type}</span>
                                                </div>
                                                <p className="mt-1 truncate text-[12px] text-gray-500">
                                                    {car.city}, {car.state}
                                                </p>
                                                <p className="mt-1 text-[11px] text-gray-400">
                                                    {car.year} {car.make} {car.model}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            {listings.last_page > 1 && (
                                <div className="mt-10 flex items-center justify-center gap-2">
                                    {listings.links.map((link, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-[13px] font-semibold transition ${
                                                link.active
                                                    ? 'text-white'
                                                    : link.url
                                                        ? 'border border-gray-200 bg-white text-slate-700 hover:border-slate-300'
                                                        : 'cursor-not-allowed text-gray-300'
                                            }`}
                                            style={link.active ? { backgroundColor: ACCENT } : undefined}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
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
                                        <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#F26B5E]">
                                            <Icon className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['About Us', 'Car Listings', 'Dealers', 'Blog', 'Contact'].map((l) => (
                                        <li key={l}><a href="#" className="transition hover:text-[#F26B5E]">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Categories</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['Sedan', 'SUV', 'Coupe', 'Convertible', 'Truck'].map((c) => (
                                        <li key={c}><a href="#" className="transition hover:text-[#F26B5E]">{c}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Contact</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />1234 Main St, Houston, TX 77002</li>
                                    <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />(713) 555-0123</li>
                                    <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" />hello@houstonezfinance.com</li>
                                </ul>
                            </div>
                        </div>
                        <div className="my-10 h-px bg-white/10" />
                        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/50 sm:flex-row">
                            <p>&copy; {new Date().getFullYear()} Houston EZ Finance. All rights reserved.</p>
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
