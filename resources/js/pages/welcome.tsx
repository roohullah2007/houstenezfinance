import { Head, Link } from '@inertiajs/react';
import {
    Car,
    Bus,
    Caravan,
    CarFront,
    Star,
    Search,
    Fuel,
    Gauge,
    Settings2,
    ShieldCheck,
    BadgeDollarSign,
    BadgeCheck,
    Headphones,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    ChevronRight,
    Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

const quickCategories = ['Sedans', 'Convertibles', 'Pickups', 'Coupe', 'SUVs'];

const bodyTypes = [
    { name: 'Sedan', offers: 128, Icon: Car },
    { name: 'SUVs', offers: 96, Icon: CarFront },
    { name: 'Coupe', offers: 54, Icon: Car },
    { name: 'Convertibles', offers: 32, Icon: Caravan },
    { name: 'MPV', offers: 47, Icon: Bus },
];

const featuredListings = [
    {
        title: '2023 Tesla Model S Plaid',
        price: '$89,990',
        mileage: '12,400',
        fuel: 'Electric',
        trans: 'Automatic',
        body: 'Sedan',
        location: 'Houston, TX 77002',
        dealer: 'Houston Premium Motors',
        posted: '2 days ago',
        tag: 'Featured',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80&auto=format&fit=crop',
    },
    {
        title: '2022 BMW M4 Competition',
        price: '$74,500',
        mileage: '18,220',
        fuel: 'Gasoline',
        trans: 'Automatic',
        body: 'Coupe',
        location: 'Sugar Land, TX 77479',
        dealer: 'Elite Auto Gallery',
        posted: '5 days ago',
        tag: 'New',
        image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80&auto=format&fit=crop',
    },
    {
        title: '2021 Mercedes-Benz GLE 450',
        price: '$62,300',
        mileage: '24,100',
        fuel: 'Hybrid',
        trans: 'Automatic',
        body: 'SUV',
        location: 'Katy, TX 77494',
        dealer: 'Luxury Drive Houston',
        posted: '1 week ago',
        tag: 'Hot',
        image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80&auto=format&fit=crop',
    },
    {
        title: '2023 Audi RS7 Sportback',
        price: '$118,750',
        mileage: '6,900',
        fuel: 'Gasoline',
        trans: 'Automatic',
        body: 'Sedan',
        location: 'The Woodlands, TX',
        dealer: 'Prestige Motor Cars',
        posted: '3 days ago',
        tag: 'Featured',
        image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80&auto=format&fit=crop',
    },
    {
        title: '2022 Ford F-150 Raptor',
        price: '$71,200',
        mileage: '15,540',
        fuel: 'Gasoline',
        trans: 'Automatic',
        body: 'Truck',
        location: 'Pasadena, TX 77503',
        dealer: 'Texas Truck Center',
        posted: '6 days ago',
        tag: 'Certified',
        image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80&auto=format&fit=crop',
    },
    {
        title: '2023 Lexus LX 600',
        price: '$102,400',
        mileage: '9,800',
        fuel: 'Gasoline',
        trans: 'Automatic',
        body: 'SUV',
        location: 'Pearland, TX 77584',
        dealer: 'Lexus of Houston',
        posted: '4 days ago',
        tag: 'New',
        image: 'https://images.unsplash.com/photo-1606152421802-db97b2c7a11b?w=800&q=80&auto=format&fit=crop',
    },
];

const whyChoose = [
    {
        Icon: ShieldCheck,
        title: 'Trusted Dealers',
        desc: 'Work only with verified and top-rated dealerships across the country.',
    },
    {
        Icon: BadgeDollarSign,
        title: 'Easy Financing',
        desc: 'Flexible auto loans and in-house financing tailored to your budget.',
    },
    {
        Icon: BadgeCheck,
        title: 'Verified Listings',
        desc: 'Every vehicle is inspected and verified before it hits the marketplace.',
    },
    {
        Icon: Headphones,
        title: '24/7 Support',
        desc: 'Our specialists are here around the clock to help you find the right car.',
    },
];

const brands = ['Toyota', 'Honda', 'BMW', 'Mercedes', 'Ford', 'Tesla', 'Audi', 'Lexus'];

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    void canRegister;

    return (
        <>
            <Head title="Houston EZ Finance — Find Your Dream Car">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white font-sans text-slate-900">
                {/* Hero wrapper with dark background */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    {/* Decorative glow */}
                    <div
                        className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
                        style={{ background: ACCENT }}
                    />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />

                    {/* Header / Nav */}
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

                            <div className="flex items-center gap-3">
                                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/20 sm:flex">
                                    <span className="text-sm font-semibold text-white">HZ</span>
                                </div>
                                <Link href="/sell-your-car">
                                    <button
                                        type="button"
                                        className="rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg hover:brightness-110"
                                        style={{ backgroundColor: ACCENT }}
                                    >
                                        Sell Car
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </header>

                    {/* Hero content */}
                    <section className="relative z-10 mx-auto max-w-[1408px] px-4 pt-10 pb-40 sm:px-6 lg:px-8 lg:pt-20 lg:pb-56">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div>
                                <Badge
                                    className="mb-5 border-white/20 bg-white/10 text-white backdrop-blur"
                                    variant="outline"
                                >
                                    #1 Auto Marketplace in Houston
                                </Badge>
                                <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                                    Find your dream car,
                                    <br />
                                    <span style={{ color: ACCENT }}>in a few minutes</span>
                                </h1>
                                <p className="mt-5 max-w-xl text-base text-white/70 sm:text-lg">
                                    Browse thousands of verified listings from trusted dealers and
                                    private sellers. Finance, inspect, and drive away with
                                    confidence.
                                </p>

                                <div className="mt-6 flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                            />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold">4.9</span>
                                    <span className="text-sm text-white/60">
                                        Google Rating · 2,400+ reviews
                                    </span>
                                </div>
                            </div>

                            {/* Car illustration */}
                            <div className="relative hidden lg:block">
                                <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-[#F26B5E]/30 to-transparent blur-3xl" />
                                <svg
                                    viewBox="0 0 600 300"
                                    className="w-full drop-shadow-2xl"
                                    fill="none"
                                >
                                    <defs>
                                        <linearGradient
                                            id="carBody"
                                            x1="0"
                                            y1="0"
                                            x2="1"
                                            y2="1"
                                        >
                                            <stop offset="0%" stopColor="#F26B5E" />
                                            <stop offset="100%" stopColor="#b83d32" />
                                        </linearGradient>
                                        <linearGradient
                                            id="carGlass"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop offset="0%" stopColor="#1e293b" />
                                            <stop offset="100%" stopColor="#0f172a" />
                                        </linearGradient>
                                    </defs>
                                    {/* Shadow */}
                                    <ellipse
                                        cx="300"
                                        cy="260"
                                        rx="240"
                                        ry="12"
                                        fill="#000"
                                        opacity="0.35"
                                    />
                                    {/* Body */}
                                    <path
                                        d="M70 200 Q 90 150 150 140 L 220 100 Q 260 85 320 85 L 400 85 Q 440 90 470 130 L 520 150 Q 545 160 545 200 L 545 215 Q 545 225 530 225 L 470 225 Q 460 255 430 255 Q 400 255 390 225 L 210 225 Q 200 255 170 255 Q 140 255 130 225 L 85 225 Q 70 225 70 215 Z"
                                        fill="url(#carBody)"
                                    />
                                    {/* Windows */}
                                    <path
                                        d="M200 140 L 245 105 Q 270 95 305 95 L 380 95 Q 410 100 435 135 L 440 145 Z"
                                        fill="url(#carGlass)"
                                        opacity="0.9"
                                    />
                                    <path
                                        d="M305 100 L 305 145 L 440 145 L 435 135 Q 410 100 380 100 Z"
                                        fill="url(#carGlass)"
                                        opacity="0.7"
                                    />
                                    {/* Door line */}
                                    <line
                                        x1="310"
                                        y1="100"
                                        x2="310"
                                        y2="220"
                                        stroke="#000"
                                        strokeOpacity="0.2"
                                        strokeWidth="2"
                                    />
                                    {/* Wheels */}
                                    <circle cx="170" cy="230" r="34" fill="#0f172a" />
                                    <circle cx="170" cy="230" r="22" fill="#334155" />
                                    <circle cx="170" cy="230" r="8" fill="#64748b" />
                                    <circle cx="430" cy="230" r="34" fill="#0f172a" />
                                    <circle cx="430" cy="230" r="22" fill="#334155" />
                                    <circle cx="430" cy="230" r="8" fill="#64748b" />
                                    {/* Headlight */}
                                    <path
                                        d="M530 180 L 545 195 L 545 205 L 520 200 Z"
                                        fill="#fde68a"
                                    />
                                </svg>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Floating search card (overlaps hero) */}
                <section className="relative z-20 mx-auto -mt-32 max-w-6xl px-4 sm:px-6 lg:-mt-40 lg:px-8">
                    <Card style={{ backgroundColor: '#ffffff' }} className="rounded-xl border-0 text-slate-900 shadow-2xl">
                        <CardContent className="p-6 sm:p-8">
                            <div className="mb-5 flex items-center gap-2">
                                <Search className="h-5 w-5" style={{ color: ACCENT }} />
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Search from thousands of cars
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {[
                                    {
                                        ph: 'Any Make',
                                        opts: ['Toyota', 'BMW', 'Ford', 'Tesla'],
                                    },
                                    {
                                        ph: 'Any Model',
                                        opts: ['Model S', 'X5', 'Corolla', 'F-150'],
                                    },
                                    {
                                        ph: 'Condition',
                                        opts: ['New', 'Used', 'Certified Pre-Owned'],
                                    },
                                    {
                                        ph: 'Transmission',
                                        opts: ['Automatic', 'Manual', 'CVT'],
                                    },
                                    {
                                        ph: 'Body Type',
                                        opts: ['Sedan', 'SUV', 'Coupe', 'Convertible'],
                                    },
                                    {
                                        ph: 'Location',
                                        opts: ['Houston', 'Dallas', 'Austin', 'San Antonio'],
                                    },
                                ].map((f) => (
                                    <Select key={f.ph}>
                                        <SelectTrigger
                                            style={{ backgroundColor: '#ffffff' }}
                                            className="!h-12 w-full rounded-full border border-gray-200 px-5 text-[14px] font-medium text-slate-700 shadow-none transition hover:border-slate-300 focus:border-slate-400 focus:ring-0 data-[placeholder]:text-slate-500"
                                        >
                                            <SelectValue placeholder={f.ph} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {f.opts.map((o) => (
                                                <SelectItem key={o} value={o.toLowerCase()}>
                                                    {o}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ))}
                            </div>

                            <div className="mt-6 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <a
                                    href="#"
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                                >
                                    + More Filters
                                </a>
                                <Button
                                    asChild
                                    className="h-12 w-full rounded-md px-8 font-semibold text-white shadow-md hover:brightness-110 sm:w-auto"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    <Link href="/car-listings">
                                        <Search className="mr-2 h-4 w-4" />
                                        SEARCH LISTING
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick category chips */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                        <span className="text-sm text-slate-500">Quick search:</span>
                        {quickCategories.map((c) => (
                            <a
                                key={c}
                                href="#"
                                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-[#F26B5E] hover:text-[#F26B5E]"
                            >
                                {c}
                            </a>
                        ))}
                    </div>
                </section>

                <main>
                    {/* Popular body types */}
                    <section id="categories" className="mx-auto max-w-[1408px] px-4 py-20 sm:px-6 lg:px-8">
                        <div className="mb-10 text-center">
                            <p className="text-sm font-semibold tracking-wider text-[#F26B5E] uppercase">
                                Browse Categories
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                Popular car body types
                            </h2>
                            <p className="mt-3 text-slate-600">
                                Explore cars by the body style you love the most.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
                            {bodyTypes.map(({ name, offers, Icon }) => (
                                <Card
                                    key={name}
                                    style={{ backgroundColor: '#f1f5f9' }}
                                    className="group cursor-pointer rounded-xl border border-slate-200 text-slate-900 transition-all hover:-translate-y-1 hover:border-[#F26B5E] hover:shadow-xl"
                                >
                                    <CardContent className="flex flex-col items-center p-6 text-center">
                                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm transition group-hover:bg-[#F26B5E]/10">
                                            <Icon
                                                className="h-8 w-8 text-slate-700 transition group-hover:text-[#F26B5E]"
                                            />
                                        </div>
                                        <h3 className="font-semibold text-slate-900">{name}</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {offers} offers
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Featured Listings */}
                    <section id="listings" className="bg-slate-50 py-20">
                        <div className="mx-auto max-w-[1408px] px-4 sm:px-6 lg:px-8">
                            <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                                <div>
                                    <p className="text-sm font-semibold tracking-wider text-[#F26B5E] uppercase">
                                        Featured
                                    </p>
                                    <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                        Latest featured listings
                                    </h2>
                                </div>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#F26B5E] hover:underline"
                                >
                                    View all listings <ChevronRight className="h-4 w-4" />
                                </a>
                            </div>

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {featuredListings.map((car) => (
                                    <a
                                        key={car.title}
                                        href="#"
                                        style={{ backgroundColor: '#ffffff' }}
                                        className="group block overflow-hidden rounded-2xl border border-gray-200 text-slate-900 shadow-sm transition-shadow hover:shadow-xl"
                                    >
                                        <div className="relative" style={{ height: 210 }}>
                                            <img
                                                src={car.image}
                                                alt={car.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                            <div
                                                className="absolute top-3 left-3 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                                                style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                                            >
                                                {car.posted}
                                            </div>
                                            <div
                                                className="absolute top-3 right-14 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                                                style={{ backgroundColor: ACCENT }}
                                            >
                                                {car.tag}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => e.preventDefault()}
                                                className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-black/40"
                                                style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
                                                aria-label="Save"
                                            >
                                                <Heart className="h-[18px] w-[18px]" />
                                            </button>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="truncate text-base font-semibold text-slate-900">
                                                    {car.title}
                                                </h3>
                                                <p
                                                    className="shrink-0 text-xl font-bold"
                                                    style={{ color: ACCENT }}
                                                >
                                                    {car.price}
                                                </p>
                                            </div>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <Gauge className="h-3.5 w-3.5" />
                                                    <span className="font-semibold text-gray-700">
                                                        {car.mileage}
                                                    </span>
                                                    mi
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="flex items-center gap-1">
                                                    <Fuel className="h-3.5 w-3.5" />
                                                    {car.fuel}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span className="flex items-center gap-1">
                                                    <Settings2 className="h-3.5 w-3.5" />
                                                    {car.trans}
                                                </span>
                                                <span className="text-gray-300">|</span>
                                                <span>{car.body}</span>
                                            </div>
                                            <div className="mt-1.5 flex items-center gap-1 truncate text-[13px] text-gray-500">
                                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                                <span className="truncate">{car.location}</span>
                                            </div>
                                            <p className="mt-1 truncate text-[11px] text-gray-400">
                                                {car.dealer}
                                            </p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Why Choose Us */}
                    <section className="mx-auto max-w-[1408px] px-4 py-20 sm:px-6 lg:px-8">
                        <div className="mb-12 text-center">
                            <p className="text-sm font-semibold tracking-wider text-[#F26B5E] uppercase">
                                Why Choose Us
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                                The smart way to buy & sell cars
                            </h2>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {whyChoose.map(({ Icon, title, desc }) => (
                                <div
                                    key={title}
                                    className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div
                                        className="flex h-14 w-14 items-center justify-center rounded-xl"
                                        style={{ backgroundColor: `${ACCENT}1A` }}
                                    >
                                        <Icon className="h-7 w-7" style={{ color: ACCENT }} />
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold text-slate-900">
                                        {title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        {desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Brands */}
                    <section className="border-y border-slate-200 bg-slate-50 py-12">
                        <div className="mx-auto max-w-[1408px] px-4 sm:px-6 lg:px-8">
                            <p className="mb-8 text-center text-sm font-semibold tracking-wider text-slate-500 uppercase">
                                Browse by Brand
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
                                {brands.map((b) => (
                                    <a
                                        key={b}
                                        href="#"
                                        className="text-xl font-bold tracking-tight text-slate-400 transition hover:text-[#F26B5E] sm:text-2xl"
                                    >
                                        {b}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* CTA Banner */}
                    <section className="mx-auto max-w-[1408px] px-4 py-20 sm:px-6 lg:px-8">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0b1020] via-[#1a1f3a] to-[#0b1020] p-10 text-white sm:p-14">
                            <div
                                className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full opacity-30 blur-3xl"
                                style={{ background: ACCENT }}
                            />
                            <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                                        Ready to sell your car?
                                    </h2>
                                    <p className="mt-3 max-w-xl text-white/70">
                                        List your vehicle in minutes and reach thousands of
                                        qualified buyers across Texas.
                                    </p>
                                </div>
                                <Button
                                    className="h-12 rounded-full px-8 font-semibold text-white shadow-xl hover:brightness-110"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    List Your Car Now
                                </Button>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
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

                        <Separator className="my-10 bg-white/10" />

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

