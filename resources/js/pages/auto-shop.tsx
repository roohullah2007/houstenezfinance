import { Head, Link } from '@inertiajs/react';
import {
    Wrench,
    Package,
    Sparkles,
    CircleDot,
    ArrowRight,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const ACCENT = '#F26B5E';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Car Listings', href: '/car-listings' },
    { label: 'Categories', href: '/categories' },
    { label: 'Locations', href: '/locations' },
    { label: 'Dealers', href: '/dealers' },
    { label: 'Auto Shop', href: '/auto-shop' },
];

const IMG = [
    'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606152421802-db97b2c7a11b?w=800&q=80&auto=format&fit=crop',
];

const services = [
    { title: 'Maintenance & Repair', desc: 'Expert mechanics and full-service repair for any make.', Icon: Wrench },
    { title: 'Parts & Accessories', desc: 'Genuine OEM and aftermarket parts at great prices.', Icon: Package },
    { title: 'Detailing', desc: 'Interior and exterior detailing to keep your car showroom fresh.', Icon: Sparkles },
    { title: 'Tires & Wheels', desc: 'All major brands, balancing, alignment, and installation.', Icon: CircleDot },
];

const products = [
    { name: 'All-Weather Floor Mats', price: '$89', image: IMG[0] },
    { name: 'LED Headlight Kit', price: '$149', image: IMG[1] },
    { name: 'Premium Engine Oil 5W-30', price: '$42', image: IMG[2] },
    { name: 'Ceramic Brake Pads', price: '$129', image: IMG[3] },
    { name: 'Performance Air Filter', price: '$59', image: IMG[4] },
    { name: 'Car Cover XL', price: '$99', image: IMG[5] },
    { name: 'Dashboard Camera', price: '$189', image: IMG[0] },
    { name: 'Tire Pressure Monitor', price: '$79', image: IMG[1] },
];

export default function AutoShop() {
    return (
        <>
            <Head title="Auto Shop — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-white font-sans text-slate-900">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div
                        className="pointer-events-none absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full opacity-30 blur-3xl"
                        style={{ background: ACCENT }}
                    />
                    <header className="relative z-20">
                        <div className="mx-auto flex h-20 max-w-[1408px] items-center justify-between px-4 sm:px-6 lg:px-8">
                            <Link href="/" className="flex items-center gap-2">
                                <img
                                    src="/images/housten-logo-1.png"
                                    alt="Houston EZ Finance"
                                    className="h-14 w-40 object-contain sm:h-16 sm:w-48"
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

                    <section className="relative z-10 mx-auto max-w-[1408px] px-4 pt-10 pb-16 sm:px-6 lg:px-8">
                        <p className="text-sm text-white/60">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white">Auto Shop</span>
                        </p>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Auto Shop & Services</h1>
                        <p className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg">
                            Parts, accessories, maintenance, and expert services for your vehicle.
                        </p>
                    </section>
                </div>

                <main>
                    {/* Service Categories */}
                    <section className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mb-10">
                            <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                Services
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {services.map(({ title, desc, Icon }) => (
                                <div
                                    key={title}
                                    style={{ backgroundColor: '#ffffff' }}
                                    className="rounded-2xl border border-gray-200 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#F26B5E] hover:shadow-xl"
                                >
                                    <div
                                        className="flex h-14 w-14 items-center justify-center rounded-xl"
                                        style={{ backgroundColor: `${ACCENT}1A` }}
                                    >
                                        <Icon className="h-7 w-7" style={{ color: ACCENT }} />
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
                                    <a
                                        href="#"
                                        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold"
                                        style={{ color: ACCENT }}
                                    >
                                        Explore <ArrowRight className="h-4 w-4" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Featured Products */}
                    <section className="bg-slate-50 py-16">
                        <div className="mx-auto max-w-[1408px] px-4 sm:px-6 lg:px-8">
                            <div className="mb-10">
                                <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                    Shop
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Featured Products</h2>
                            </div>
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                {products.map((p) => (
                                    <div
                                        key={p.name}
                                        style={{ backgroundColor: '#ffffff' }}
                                        className="group block overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-xl"
                                    >
                                        <div className="h-44 overflow-hidden">
                                            <img
                                                src={p.image}
                                                alt={p.name}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="truncate text-sm font-semibold text-slate-900">{p.name}</h3>
                                            <p className="mt-1 text-xl font-bold" style={{ color: ACCENT }}>
                                                {p.price}
                                            </p>
                                            <button
                                                type="button"
                                                className="mt-4 h-10 w-full rounded-full text-sm font-semibold text-white shadow-md transition hover:brightness-110"
                                                style={{ backgroundColor: ACCENT }}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Book a Service */}
                    <section className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="mb-10">
                            <p className="text-sm font-semibold tracking-wider uppercase" style={{ color: ACCENT }}>
                                Booking
                            </p>
                            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Book a Service</h2>
                        </div>
                        <div
                            style={{ backgroundColor: '#ffffff' }}
                            className="grid overflow-hidden rounded-2xl border border-gray-200 shadow-sm lg:grid-cols-2"
                        >
                            <div className="h-64 lg:h-auto">
                                <img
                                    src={IMG[2]}
                                    alt="Service"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="p-8 sm:p-10">
                                <h3 className="text-2xl font-bold text-slate-900">Schedule Your Appointment</h3>
                                <p className="mt-2 text-sm text-slate-600">
                                    Pick a service type and date — we'll confirm within the hour.
                                </p>
                                <div className="mt-6 space-y-4">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                            Service Type
                                        </label>
                                        <select
                                            style={{ backgroundColor: '#ffffff' }}
                                            className="h-11 w-full rounded-full border border-gray-200 px-5 text-sm text-slate-700 shadow-none focus:border-slate-400 focus:outline-none"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select service</option>
                                            <option value="oil">Oil Change</option>
                                            <option value="brake">Brake Service</option>
                                            <option value="tire">Tire Rotation</option>
                                            <option value="detail">Full Detail</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-600 uppercase">
                                            Preferred Date
                                        </label>
                                        <Input
                                            type="date"
                                            style={{ backgroundColor: '#ffffff' }}
                                            className="h-11 rounded-full border-gray-200 px-5 text-sm text-slate-700 shadow-none focus-visible:ring-0"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="h-12 w-full rounded-full text-sm font-semibold text-white shadow-md transition hover:brightness-110"
                                        style={{ backgroundColor: ACCENT }}
                                    >
                                        Book Now
                                    </button>
                                </div>
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
                                    {['About Us', 'Car Listings', 'Categories', 'Locations', 'Dealers', 'Blog', 'Contact'].map((l) => (
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
