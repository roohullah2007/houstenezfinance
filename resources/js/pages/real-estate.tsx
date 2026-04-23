import { Head, Link, router, useForm } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { CaptchaField } from '@/components/captcha-field';
import {
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    ChevronRight,
    Send,
    CheckCircle2,
    Home,
    Search,
    Heart,
    Maximize2,
    Info,
    Key,
    DollarSign,
    Building2,
    ShieldCheck,
    Sparkles,
    Award,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';

const ACCENT = '#F26B5E';
const CARD_ACCENT = '#A41E34';

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

interface Listing {
    id: number;
    slug: string;
    title: string;
    listing_type: 'sale' | 'rent';
    status: 'pending' | 'active' | 'sold';
    price: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    bedrooms: number;
    full_bathrooms: number;
    half_bathrooms: number;
    square_feet: number | null;
    images: string[] | null;
    main_image_index: number;
}

interface Paginated {
    data: Listing[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Content {
    heading: string;
    body: string | null;
    secondary_heading: string | null;
    secondary_body: string | null;
}

interface Props {
    listings: Paginated;
    filters: { search?: string };
    content: Content;
}

function formatBathrooms(full: number, half: number): string {
    if (half > 0) return `${full}.5`;
    return String(full);
}

export default function RealEstate({ listings, filters, content }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [submitted, setSubmitted] = useState(false);

    function applySearch() {
        const params: Record<string, string> = {};
        if (search) params.search = search;
        router.get('/real-estate', params, { preserveState: true, replace: true });
    }

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        message: '',
        captcha_token: '',
        captcha_answer: '',
        website: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/real-estate', {
            onSuccess: () => {
                setSubmitted(true);
                reset();
            },
        });
    }

    return (
        <>
            <Head title="Real Estate — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
                {/* Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />
                    <PublicHeader />
                    <div className="relative z-10 mx-auto max-w-[1408px] px-4 pb-12 pt-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="text-white">Real Estate</span>
                        </div>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Houston Homes & Communities</h1>
                        <p className="mt-3 max-w-2xl text-lg text-white/70">
                            Browse homes across Houston and nearby communities. See one you like? Scroll down to send us a message.
                        </p>

                        {/* Search */}
                        <div className="mt-6 flex max-w-xl items-center gap-2 rounded-full bg-white p-1.5 shadow-lg">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search by city, address, property type..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                                    className="w-full rounded-full border-none bg-transparent px-4 py-2 pl-11 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={applySearch}
                                className="rounded-full px-5 py-2 text-sm font-semibold text-white hover:brightness-110"
                                style={{ backgroundColor: ACCENT }}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                {/* Listings Grid */}
                <section className="mx-auto max-w-[1408px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
                    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <span className="h-0.5 w-8" style={{ backgroundColor: ACCENT }} />
                                <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: ACCENT }}>
                                    Available Now
                                </p>
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                                Featured Properties
                            </h2>
                        </div>
                        <p className="text-sm text-slate-500">
                            {listings.total} {listings.total === 1 ? 'result' : 'results'}
                        </p>
                    </div>

                    {listings.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white p-16 text-center">
                            <Home className="h-12 w-12 text-gray-300" />
                            <p className="mt-4 text-sm font-medium text-gray-700">
                                {filters.search ? 'No properties match your search' : 'No properties listed yet'}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {filters.search ? 'Try a different search term.' : 'Check back soon for new listings.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {listings.data.map((l) => {
                                const mainImg = l.images && l.images.length > 0
                                    ? l.images[l.main_image_index ?? 0] ?? l.images[0]
                                    : null;
                                const bath = formatBathrooms(l.full_bathrooms, l.half_bathrooms);
                                const isSold = l.status === 'sold';
                                const badgeLabel = isSold ? 'SOLD' : (l.listing_type === 'sale' ? 'FOR SALE' : 'FOR RENT');
                                const badgeBg = isSold ? '#6B7280' : CARD_ACCENT;

                                return (
                                    <Link
                                        key={l.id}
                                        href={`/real-estate/${l.slug}`}
                                        className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
                                    >
                                        <div className="relative h-[180px] overflow-hidden">
                                            {mainImg ? (
                                                <img
                                                    src={`/storage/${mainImg}`}
                                                    alt={l.title}
                                                    loading="lazy"
                                                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                                    <Home className="h-10 w-10 text-gray-300" />
                                                </div>
                                            )}
                                            <div
                                                className="absolute top-4 right-4 rounded-full px-3 py-1.5 text-xs font-semibold text-white"
                                                style={{ backgroundColor: badgeBg }}
                                            >
                                                {badgeLabel}
                                            </div>
                                            <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                <span className="rounded-lg bg-white/90 p-2" title="View details">
                                                    <Maximize2 className="h-4 w-4 text-gray-800" />
                                                </span>
                                                <span className="rounded-lg bg-white/90 p-2" title="Details">
                                                    <Info className="h-4 w-4 text-gray-800" />
                                                </span>
                                                <span className="rounded-lg bg-white/90 p-2" title="Favorite">
                                                    <Heart className="h-4 w-4 text-[#413936]" />
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col px-4 pt-3 pb-4">
                                            <div className="mb-2 border-b border-gray-200 pb-2">
                                                <span className="text-base font-bold text-[#293056]">
                                                    ${Number(l.price).toLocaleString()}
                                                    {l.listing_type === 'rent' && <span className="text-xs font-medium text-[#293056]/60">/mo</span>}
                                                </span>
                                            </div>
                                            <div className="mb-2 border-b border-gray-200 pb-2">
                                                <p className="line-clamp-1 text-sm font-semibold text-[#293056]">{l.title}</p>
                                            </div>
                                            <div className="mb-2 border-b border-gray-200 pb-2">
                                                <p className="line-clamp-2 text-sm text-[#293056]">
                                                    {l.address}, {l.city}, {l.state} {l.zip}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-[#293056]">
                                                    {l.bedrooms}BD | {bath}BA{l.square_feet ? ` | ${l.square_feet.toLocaleString()} sq ft` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

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
                                        link.active ? 'text-white' : link.url ? 'border border-gray-200 bg-white text-slate-700 hover:border-slate-300' : 'cursor-not-allowed text-gray-300'
                                    }`}
                                    style={link.active ? { backgroundColor: ACCENT } : undefined}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Unified Intro + Contact Form */}
                <section id="contact" className="relative overflow-hidden bg-white py-20 sm:py-24">
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                    <div className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full opacity-[0.09] blur-3xl" style={{ background: ACCENT }} />
                    <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.055)_1px,transparent_0)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

                    <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center gap-3">
                            <span className="h-px w-10" style={{ backgroundColor: ACCENT }} />
                            <p className="text-xs font-semibold tracking-[0.22em] uppercase" style={{ color: ACCENT }}>
                                Your Home Buying Partner
                            </p>
                            <span className="h-px w-10" style={{ backgroundColor: ACCENT }} />
                        </div>

                        <h2 className="mt-6 text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                            We Make Homeownership a{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10" style={{ color: ACCENT }}>Simple and EZ</span>
                                <span className="absolute inset-x-0 bottom-1.5 h-3 -z-0 rounded" style={{ backgroundColor: `${ACCENT}22` }} />
                            </span>{' '}
                            Process!
                        </h2>

                        <p className="mx-auto mt-6 max-w-3xl text-center text-base leading-relaxed text-gray-600 sm:text-lg">
                            From First Time Home Buyers Programs, Down Payment Assistance and First Time Buyer Grants, we do our best to make your Home Buying Experience <span className="font-semibold text-gray-900">EZ and Stress Free</span>!
                        </p>

                        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                { Icon: Key, title: 'First-Time Buyer Programs', body: 'Special pathways for first-time homeowners' },
                                { Icon: DollarSign, title: 'Down Payment Assistance', body: 'Grants that help you close the gap' },
                                { Icon: Award, title: 'First-Time Buyer Grants', body: 'Real money toward your new home' },
                                { Icon: Building2, title: 'In-House Financing', body: 'Often more affordable than a bank loan' },
                            ].map(({ Icon, title, body }) => (
                                <div key={title} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl">
                                    <div className="pointer-events-none absolute inset-x-0 -top-16 h-16 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60" style={{ background: ACCENT }} />
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl transition duration-300 group-hover:scale-110" style={{ backgroundColor: `${ACCENT}15` }}>
                                        <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                                    </div>
                                    <p className="mt-5 text-base font-semibold text-gray-900">{title}</p>
                                    <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{body}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm sm:p-7">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${ACCENT}15` }}>
                                        <MapPin className="h-4 w-4" style={{ color: ACCENT }} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gray-500">Proudly Serving</p>
                                        <p className="text-sm text-gray-700">Houston &amp; surrounding counties</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:justify-end">
                                    {['Houston', 'Harris County', 'Fort Bend County', 'Cypress', 'Katy', '& More'].map((area) => (
                                        <span key={area} className="rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2-col: eligibility + form */}
                        <div className="mt-6 grid gap-6 lg:grid-cols-5">
                            <div className="flex flex-col gap-6 lg:col-span-2">
                                <div className="overflow-hidden rounded-2xl border p-6 shadow-sm sm:p-7" style={{ borderColor: `${ACCENT}30`, backgroundColor: `${ACCENT}08` }}>
                                    <div className="flex flex-col gap-5">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-md" style={{ backgroundColor: ACCENT }}>
                                            <ShieldCheck className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: ACCENT }}>
                                                Special Assistance Available
                                            </p>
                                            <p className="mt-2 text-base leading-relaxed text-gray-700">
                                                <span className="font-semibold text-gray-900">Government, VA or State Employees</span> — there are many assistance programs that just opened up that you may qualify for! We are your <span className="font-semibold text-gray-900">first stop before you hire a Realtor</span>. Let our Licensed professionals and New Home Builders make the process EZ!
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] p-6 text-white shadow-lg sm:p-7">
                                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl" style={{ background: ACCENT }} />
                                    <div className="relative flex items-start gap-3">
                                        <Sparkles className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACCENT }} />
                                        <div>
                                            <p className="text-base font-semibold">You may be eligible for more than you thought!</p>
                                            <p className="mt-1.5 text-sm text-white/70">Simply fill out the contact us form to get the process started!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-3">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
                                    <div className="mb-6">
                                        <p className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: ACCENT }}>
                                            Get in Touch
                                        </p>
                                        <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                            Interested? Send us a message
                                        </h3>
                                        <p className="mt-2 text-base text-gray-500">
                                            Tell us which home or community caught your eye and we'll follow up with more details.
                                        </p>
                                    </div>

                                    {submitted && (
                                        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-6 py-4">
                                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                                            <div>
                                                <p className="font-semibold text-green-800">Message Sent!</p>
                                                <p className="text-sm text-green-600">We'll reach out within 24 hours.</p>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label className={labelClass}>Your Name</label>
                                                <input type="text" className={inputClass} placeholder="John Doe" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className={labelClass}>Phone Number</label>
                                                <input type="tel" className={inputClass} placeholder="832-322-2354" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className={labelClass}>Email Address</label>
                                                <input type="email" className={inputClass} placeholder="john@example.com" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className={labelClass}>Comment / Message</label>
                                                <textarea className={`${inputClass} min-h-[150px] resize-y`} placeholder="Tell us which home or community you're interested in..." value={data.message} onChange={(e) => setData('message', e.target.value)} rows={6} />
                                                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                                            </div>
                                            <div className="sm:col-span-2">
                                                <CaptchaField data={data} setData={setData} errors={errors} />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 disabled:opacity-50 sm:w-auto"
                                                    style={{ backgroundColor: ACCENT }}
                                                >
                                                    {processing ? 'Sending...' : 'Send Message'}
                                                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#0b1020] text-white">
                    <div className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <img src="/images/housten-logo-1.png" alt="Houston EZ Finance" className="h-14 w-auto" />
                                <p className="mt-4 text-sm leading-relaxed text-white/60">Your trusted marketplace for quality vehicles, real estate, and hassle-free financing in Houston and beyond.</p>
                                <div className="mt-5 flex items-center gap-3">
                                    {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                        <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#F26B5E]"><Icon className="h-4 w-4" /></a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    <li><Link href="/car-listings" className="transition hover:text-[#F26B5E]">Car Listings</Link></li>
                                    <li><Link href="/real-estate" className="transition hover:text-[#F26B5E]">Real Estate</Link></li>
                                    <li><Link href="/sell-your-car" className="transition hover:text-[#F26B5E]">Sell Your Car</Link></li>
                                    <li><Link href="/categories" className="transition hover:text-[#F26B5E]">Categories</Link></li>
                                    <li><Link href="/locations" className="transition hover:text-[#F26B5E]">Locations</Link></li>
                                    <li><Link href="/dealers" className="transition hover:text-[#F26B5E]">Dealers</Link></li>
                                    <li><Link href="/contact" className="transition hover:text-[#F26B5E]">Contact</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Categories</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['Sedan', 'SUV', 'Coupe', 'Convertible', 'Truck'].map((c) => (
                                        <li key={c}><Link href="/car-listings" className="transition hover:text-[#F26B5E]">{c}</Link></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Contact</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />3505 S Dairy Ashford Rd # 115 717, Houston, TX 77082</li>
                                    <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />832-322-2354</li>
                                    <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" />houstonezfinance@gmail.com</li>
                                </ul>
                            </div>
                        </div>
                        <div className="my-10 h-px bg-white/10" />
                        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/50 sm:flex-row">
                            <p>&copy; {new Date().getFullYear()} Houston EZ Finance. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
