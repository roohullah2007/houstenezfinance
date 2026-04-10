import { Head, Link } from '@inertiajs/react';
import {
    Search,
    Tag,
    Car,
    Calendar,
    CarFront,
    SlidersHorizontal,
    ChevronDown,
    Bookmark,
    Heart,
    Map,
    LayoutGrid,
    ChevronLeft,
    ChevronRight,
    Facebook,
    Twitter,
    Instagram,
    Phone,
    Mail,
    MapPin,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const ACCENT = '#F26B5E';

const IMG = [
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606152421802-db97b2c7a11b?w=800&q=80&auto=format&fit=crop',
];

type Listing = {
    title: string;
    price: string;
    mileage: string;
    trans: 'Auto' | 'Manual';
    fuel: string;
    body: string;
    address: string;
    stock: string;
    dealer: string;
    posted: string;
    tag: 'Certified' | 'Reduced' | 'Featured' | null;
    image: string;
};

const listings: Listing[] = [
    { title: '2023 Tesla Model S Plaid', price: '$89,990', mileage: '12,400', trans: 'Auto', fuel: 'Electric', body: 'Sedan', address: '1230 Main St, Houston, TX 77002', stock: 'Stock #HZ1048', dealer: 'Houston Premium Motors', posted: '2 days ago', tag: 'Featured', image: IMG[0] },
    { title: '2022 BMW M4 Competition', price: '$74,500', mileage: '18,220', trans: 'Auto', fuel: 'Gasoline', body: 'Coupe', address: '880 Oak Ave, Sugar Land, TX 77479', stock: 'Stock #HZ1049', dealer: 'Elite Auto Gallery', posted: '5 days ago', tag: 'Certified', image: IMG[1] },
    { title: '2021 Mercedes-Benz GLE 450', price: '$62,300', mileage: '24,100', trans: 'Auto', fuel: 'Hybrid', body: 'SUV', address: '215 Cinco Ranch, Katy, TX 77494', stock: 'Stock #HZ1050', dealer: 'Luxury Drive Houston', posted: '1 week ago', tag: 'Reduced', image: IMG[2] },
    { title: '2023 Audi RS7 Sportback', price: '$118,750', mileage: '6,900', trans: 'Auto', fuel: 'Gasoline', body: 'Sedan', address: '90 Grogan Mill, The Woodlands, TX', stock: 'Stock #HZ1051', dealer: 'Prestige Motor Cars', posted: '3 days ago', tag: 'Featured', image: IMG[3] },
    { title: '2022 Ford F-150 Raptor', price: '$71,200', mileage: '15,540', trans: 'Auto', fuel: 'Gasoline', body: 'Truck', address: '450 Red Bluff, Pasadena, TX 77503', stock: 'Stock #HZ1052', dealer: 'Texas Truck Center', posted: '6 days ago', tag: 'Certified', image: IMG[4] },
    { title: '2023 Lexus LX 600', price: '$102,400', mileage: '9,800', trans: 'Auto', fuel: 'Gasoline', body: 'SUV', address: '33 Shadow Creek, Pearland, TX 77584', stock: 'Stock #HZ1053', dealer: 'Lexus of Houston', posted: '4 days ago', tag: null, image: IMG[5] },
    { title: '2022 Toyota Camry XSE', price: '$32,980', mileage: '21,300', trans: 'Auto', fuel: 'Hybrid', body: 'Sedan', address: '1102 Westheimer Rd, Houston, TX 77006', stock: 'Stock #HZ1054', dealer: 'Gulf Coast Toyota', posted: '1 day ago', tag: 'Reduced', image: IMG[0] },
    { title: '2021 Honda Civic Si', price: '$24,500', mileage: '28,760', trans: 'Manual', fuel: 'Gasoline', body: 'Sedan', address: '77 Gessner Rd, Houston, TX 77024', stock: 'Stock #HZ1055', dealer: 'Bayou City Honda', posted: '3 weeks ago', tag: null, image: IMG[1] },
    { title: '2023 Porsche 911 Carrera', price: '$139,900', mileage: '3,450', trans: 'Auto', fuel: 'Gasoline', body: 'Coupe', address: '5 Memorial Dr, Houston, TX 77007', stock: 'Stock #HZ1056', dealer: 'Momentum Porsche', posted: '6 hours ago', tag: 'Featured', image: IMG[2] },
    { title: '2020 Jeep Wrangler Rubicon', price: '$41,750', mileage: '34,210', trans: 'Manual', fuel: 'Gasoline', body: 'SUV', address: '2200 Spring Cypress, Spring, TX', stock: 'Stock #HZ1057', dealer: 'Lone Star Jeep', posted: '2 weeks ago', tag: 'Certified', image: IMG[3] },
    { title: '2022 Chevrolet Corvette Stingray', price: '$82,300', mileage: '7,800', trans: 'Auto', fuel: 'Gasoline', body: 'Coupe', address: '415 Kirby Dr, Houston, TX 77098', stock: 'Stock #HZ1058', dealer: 'Classic Chevy Houston', posted: '4 days ago', tag: 'Featured', image: IMG[4] },
    { title: '2023 Hyundai Ioniq 5 Limited', price: '$48,200', mileage: '5,600', trans: 'Auto', fuel: 'Electric', body: 'Crossover', address: '9900 Katy Fwy, Houston, TX 77055', stock: 'Stock #HZ1059', dealer: 'EV Motors Texas', posted: '1 week ago', tag: null, image: IMG[5] },
    { title: '2021 Range Rover Sport HSE', price: '$68,990', mileage: '22,480', trans: 'Auto', fuel: 'Gasoline', body: 'SUV', address: '700 Post Oak Blvd, Houston, TX 77056', stock: 'Stock #HZ1060', dealer: 'Land Rover Galleria', posted: '5 days ago', tag: 'Reduced', image: IMG[0] },
    { title: '2022 Nissan GT-R Premium', price: '$124,500', mileage: '8,120', trans: 'Auto', fuel: 'Gasoline', body: 'Coupe', address: '1500 Westpark Dr, Houston, TX 77005', stock: 'Stock #HZ1061', dealer: 'Apex Imports', posted: '1 day ago', tag: 'Featured', image: IMG[1] },
    { title: '2023 Subaru Outback Wilderness', price: '$38,450', mileage: '11,900', trans: 'Auto', fuel: 'Gasoline', body: 'Wagon', address: '3340 FM 1960, Humble, TX 77338', stock: 'Stock #HZ1062', dealer: 'Gillman Subaru North', posted: '2 days ago', tag: 'Certified', image: IMG[2] },
];

const topNav = [
    { label: 'Browse', active: true },
    { label: 'Research', active: false },
    { label: 'Compare', active: false },
    { label: 'Market Trends', active: false },
    { label: 'Value Estimate', active: false },
    { label: 'Services', active: false, caret: true },
];

const statusTabs = [
    { label: 'FOR SALE', active: true },
    { label: 'FOR FINANCE', active: false },
    { label: 'SOLD', active: false },
    { label: 'RESERVED', active: false },
];

const quickChips = ['Virtual Tour', '360° View', 'Dealer Certified'];

export default function CarListings() {
    return (
        <>
            <Head title="Car Listings — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
                {/* Top bar — dark hero-style header matching homepage */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div
                        className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full opacity-30 blur-3xl"
                        style={{ background: ACCENT }}
                    />
                    <header className="relative z-20">
                        <div className="mx-auto flex h-20 max-w-[1408px] items-center justify-between px-4 sm:px-6 lg:px-8">
                            <Link href="/" className="flex items-center gap-2">
                                <img
                                    src="/images/housten-logo.svg"
                                    alt="Houston EZ Finance"
                                    className="h-20 w-52 object-contain sm:h-24 sm:w-60 lg:h-28 lg:w-72"
                                />
                            </Link>
                            <nav className="hidden items-center gap-8 lg:flex">
                                {[
                                    { label: 'Home', href: '/' },
                                    { label: 'Car Listings', href: '/car-listings' },
                                    { label: 'Categories', href: '/categories' },
                                    { label: 'Locations', href: '/locations' },
                                    { label: 'Dealers', href: '/dealers' },
                                ].map((link) =>
                                    link.href.startsWith('/') ? (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className="text-sm font-medium text-white/80 transition hover:text-white"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <a
                                            key={link.label}
                                            href={link.href}
                                            className="text-sm font-medium text-white/80 transition hover:text-white"
                                        >
                                            {link.label}
                                        </a>
                                    ),
                                )}
                            </nav>
                            <div className="flex items-center gap-3">
                                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20 sm:flex">
                                    <span className="text-sm font-semibold text-white">HZ</span>
                                </div>
                                <button
                                    type="button"
                                    className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-110"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    Sell Car
                                </button>
                            </div>
                        </div>
                    </header>
                </div>

                {/* Filter toolbar */}
                <div className="border-b border-gray-200 bg-white">
                    <div className="mx-auto flex min-h-[60px] max-w-[1408px] flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative flex h-9 w-[260px] items-center">
                                <Search className="absolute left-3 h-4 w-4 text-slate-500" />
                                <Input
                                    style={{ backgroundColor: '#ffffff' }}
                                    placeholder="Search make, model, city"
                                    className="h-9 rounded-full border-gray-200 pl-9 text-[13px] text-slate-700 shadow-none placeholder:text-slate-500 focus-visible:ring-0"
                                />
                            </div>
                            <button
                                type="button"
                                className="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[13px] text-slate-700 hover:border-slate-300"
                            >
                                <Tag className="h-4 w-4" />
                                Price
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            <button
                                type="button"
                                className="hidden h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[13px] text-slate-700 hover:border-slate-300 lg:flex"
                            >
                                <Car className="h-4 w-4" />
                                Make & Model
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            <button
                                type="button"
                                className="hidden h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[13px] text-slate-700 hover:border-slate-300 lg:flex"
                            >
                                <Calendar className="h-4 w-4" />
                                Year
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            <button
                                type="button"
                                className="hidden h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[13px] text-slate-700 hover:border-slate-300 lg:flex"
                            >
                                <CarFront className="h-4 w-4" />
                                Body Type
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            <button
                                type="button"
                                className="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 text-[13px] text-slate-700 hover:border-slate-300"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-full border border-gray-200 bg-white p-0.5">
                                <button
                                    type="button"
                                    className="flex h-8 items-center gap-1.5 rounded-full bg-black px-3 text-[12px] font-semibold text-white"
                                >
                                    <Map className="h-3.5 w-3.5" />
                                    Map
                                </button>
                                <button
                                    type="button"
                                    className="flex h-8 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold text-slate-700"
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                    List
                                </button>
                            </div>
                            <button
                                type="button"
                                className="flex h-9 items-center gap-1.5 rounded-full bg-black px-4 text-[12px] font-bold tracking-wider text-white hover:bg-slate-800"
                            >
                                <Bookmark className="h-3.5 w-3.5" />
                                SAVE SEARCH
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section header */}
                <div className="mx-auto max-w-[1408px] px-4 py-5 sm:px-6 lg:px-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">All Listings</h2>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {statusTabs.map((tab) => (
                                    <button
                                        key={tab.label}
                                        type="button"
                                        className={`rounded-md px-3 py-1.5 text-[11px] font-bold tracking-wider ${
                                            tab.active
                                                ? 'bg-black text-white'
                                                : 'bg-white text-slate-600 hover:bg-slate-100'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-4">
                                {quickChips.map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        className="flex items-center gap-1.5 text-[12px] text-slate-600 hover:text-slate-900"
                                    >
                                        <span className="inline-block h-3 w-3 rounded-full border border-slate-400" />
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-1 sm:items-end">
                            <button
                                type="button"
                                className="flex items-center gap-1 text-[13px] text-slate-700 hover:text-slate-900"
                            >
                                Sort: <span className="font-semibold">Recommended</span>
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            <p className="text-[12px] text-slate-500">1,248 results</p>
                        </div>
                    </div>
                </div>

                {/* Results grid */}
                <div className="mx-auto max-w-[1408px] px-4 pb-10 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {listings.map((car) => (
                            <a
                                key={car.stock}
                                href="#"
                                style={{ backgroundColor: '#ffffff' }}
                                className="group block overflow-hidden rounded-xl border border-gray-200 text-slate-900 transition-shadow hover:shadow-lg"
                            >
                                <div className="relative" style={{ height: 150 }}>
                                    <img
                                        src={car.image}
                                        alt={car.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <div
                                        className="absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                                    >
                                        {car.posted}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={(e) => e.preventDefault()}
                                        className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full text-white hover:bg-black/50"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                                        aria-label="Save"
                                    >
                                        <Heart className="h-3.5 w-3.5" />
                                    </button>
                                    {car.tag && (
                                        <div
                                            className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                                            style={{
                                                backgroundColor:
                                                    car.tag === 'Reduced'
                                                        ? ACCENT
                                                        : car.tag === 'Featured'
                                                          ? '#0f172a'
                                                          : '#16a34a',
                                            }}
                                        >
                                            {car.tag === 'Reduced' ? 'Reduced Price' : car.tag}
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="text-lg font-bold text-slate-900">{car.price}</p>
                                    <div className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12px] text-gray-500">
                                        <span>
                                            <strong className="text-gray-700">{car.mileage}</strong> mi
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span>
                                            <strong className="text-gray-700">{car.trans}</strong>
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span>
                                            <strong className="text-gray-700">{car.fuel}</strong>
                                        </span>
                                        <span className="text-gray-300">|</span>
                                        <span>{car.body}</span>
                                    </div>
                                    <p className="mt-1 truncate text-[12px] text-gray-500">{car.address}</p>
                                    <p className="mt-1 text-[11px] text-gray-400">{car.stock}</p>
                                    <p className="truncate text-[11px] text-gray-400">{car.dealer}</p>
                                </div>
                            </a>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-10 flex items-center justify-center gap-2">
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-700 hover:border-slate-300"
                            aria-label="Previous"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        {[1, 2, 3].map((n) => (
                            <button
                                key={n}
                                type="button"
                                className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold"
                                style={
                                    n === 1
                                        ? { backgroundColor: ACCENT, color: '#ffffff' }
                                        : { backgroundColor: '#ffffff', color: '#334155', border: '1px solid #e5e7eb' }
                                }
                            >
                                {n}
                            </button>
                        ))}
                        <span className="px-1 text-slate-500">…</span>
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-[13px] font-semibold text-slate-700 hover:border-slate-300"
                        >
                            25
                        </button>
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-700 hover:border-slate-300"
                            aria-label="Next"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Footer (duplicated from welcome.tsx) */}
                <footer className="bg-[#0b1020] text-white">
                    <div className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <img
                                    src="/images/housten-logo.svg"
                                    alt="Houston EZ Finance"
                                    className="h-14 w-auto"
                                />
                                <p className="mt-4 text-sm leading-relaxed text-white/60">
                                    Your trusted marketplace for quality vehicles and hassle-free
                                    auto financing in Houston and beyond.
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
                                <h4 className="text-sm font-semibold tracking-wider uppercase">
                                    Quick Links
                                </h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['About Us', 'Car Listings', 'Dealers', 'Blog', 'Contact'].map(
                                        (l) => (
                                            <li key={l}>
                                                <a
                                                    href="#"
                                                    className="transition hover:text-[#F26B5E]"
                                                >
                                                    {l}
                                                </a>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">
                                    Categories
                                </h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['Sedan', 'SUV', 'Coupe', 'Convertible', 'Truck'].map((c) => (
                                        <li key={c}>
                                            <a
                                                href="#"
                                                className="transition hover:text-[#F26B5E]"
                                            >
                                                {c}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">
                                    Contact
                                </h4>
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
                                <a href="#" className="hover:text-white">
                                    Privacy Policy
                                </a>
                                <a href="#" className="hover:text-white">
                                    Terms of Service
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

CarListings.layout = null;
