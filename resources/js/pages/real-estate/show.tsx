import { Head, Link, useForm } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { CaptchaField } from '@/components/captcha-field';
import { MortgageCalculator } from '@/components/mortgage-calculator';
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Bed,
    Bath,
    Ruler,
    Calendar,
    Tag,
    MapPin,
    Mail,
    Phone,
    Facebook,
    Twitter,
    Instagram,
    Send,
    CheckCircle2,
    Building2,
    TreePine,
    Check,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';

const ACCENT = '#F26B5E';
const CARD_ACCENT = '#A41E34';

interface Listing {
    id: number;
    slug: string;
    title: string;
    developer: string | null;
    property_type: string;
    listing_type: 'sale' | 'rent';
    status: 'pending' | 'active' | 'sold';
    price: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    subdivision: string | null;
    latitude: string | null;
    longitude: string | null;
    bedrooms: number;
    full_bathrooms: number;
    half_bathrooms: number;
    square_feet: number | null;
    lot_size: number | null;
    year_built: number | null;
    description: string | null;
    features: string[] | null;
    images: string[] | null;
    main_image_index: number;
    created_at: string;
}

interface Props {
    listing: Listing;
}

function formatBathrooms(full: number, half: number): string {
    if (half > 0) return `${full}.5`;
    return String(full);
}

export default function ShowRealEstate({ listing }: Props) {
    const [selectedImage, setSelectedImage] = useState(listing.main_image_index ?? 0);
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        message: `I'm interested in "${listing.title}" at ${listing.address}, ${listing.city}. Please contact me with more information.`,
        captcha_token: '',
        captcha_answer: '',
        website: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(`/real-estate/${listing.slug}/inquiry`, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
            },
        });
    }

    const bath = formatBathrooms(listing.full_bathrooms, listing.half_bathrooms);
    const isSold = listing.status === 'sold';
    const badgeLabel = isSold ? 'SOLD' : (listing.listing_type === 'sale' ? 'FOR SALE' : 'FOR RENT');
    const badgeBg = isSold ? '#6B7280' : CARD_ACCENT;

    const details = [
        { icon: Bed, label: 'Bedrooms', value: listing.bedrooms },
        { icon: Bath, label: 'Bathrooms', value: bath },
        ...(listing.square_feet ? [{ icon: Ruler, label: 'Square Feet', value: `${Number(listing.square_feet).toLocaleString()} sqft` }] : []),
        ...(listing.lot_size ? [{ icon: TreePine, label: 'Lot Size', value: `${Number(listing.lot_size).toLocaleString()} sqft` }] : []),
        ...(listing.year_built ? [{ icon: Calendar, label: 'Year Built', value: listing.year_built }] : []),
        { icon: Tag, label: 'Property Type', value: listing.property_type },
        ...(listing.developer ? [{ icon: Building2, label: 'Developer', value: listing.developer }] : []),
    ];

    const nextImage = () => {
        if (!listing.images) return;
        setSelectedImage((prev) => (prev + 1) % listing.images!.length);
    };
    const prevImage = () => {
        if (!listing.images) return;
        setSelectedImage((prev) => (prev - 1 + listing.images!.length) % listing.images!.length);
    };

    const hasCoords = listing.latitude && listing.longitude;
    const mapEmbedUrl = hasCoords
        ? `https://www.google.com/maps?q=${listing.latitude},${listing.longitude}&hl=en&z=15&output=embed`
        : `https://www.google.com/maps?q=${encodeURIComponent(`${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`)}&hl=en&z=15&output=embed`;

    return (
        <>
            <Head title={`${listing.title} — Houston EZ Finance`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-white font-sans text-slate-900">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <PublicHeader />
                </div>

                <div className="mx-auto max-w-[1408px] px-4 py-10 sm:px-6 lg:px-8">
                    <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-gray-900">Home</Link>
                        <span>/</span>
                        <Link href="/real-estate" className="hover:text-gray-900">Real Estate</Link>
                        <span>/</span>
                        <span className="truncate text-gray-900">{listing.title}</span>
                    </nav>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left — main content */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="relative aspect-[16/10] w-full bg-gray-100">
                                    {listing.images && listing.images.length > 0 ? (
                                        <>
                                            <img src={`/storage/${listing.images[selectedImage]}`} alt={listing.title} className="h-full w-full object-cover" />
                                            <div
                                                className="absolute top-4 right-4 rounded-full px-3 py-1.5 text-xs font-semibold text-white shadow"
                                                style={{ backgroundColor: badgeBg }}
                                            >
                                                {badgeLabel}
                                            </div>
                                            {listing.images.length > 1 && (
                                                <>
                                                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </button>
                                                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                                                        <ChevronRight className="h-5 w-5" />
                                                    </button>
                                                    <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                                                        {selectedImage + 1} / {listing.images.length}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <Home className="h-16 w-16 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                {listing.images && listing.images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto border-t border-gray-200 p-3">
                                        {listing.images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImage(i)}
                                                className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${selectedImage === i ? 'border-[#F26B5E]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                            >
                                                <img src={`/storage/${img}`} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Property Details</h3>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {details.map((d, i) => (
                                        <div key={i} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <d.icon className="h-4 w-4" />
                                                {d.label}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-900">{d.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {listing.description && (
                                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Description</h3>
                                    <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{listing.description}</p>
                                </div>
                            )}

                            {listing.features && listing.features.length > 0 && (
                                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Features</h3>
                                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {listing.features.map((f) => (
                                            <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                                                <Check className="h-4 w-4 flex-shrink-0" style={{ color: ACCENT }} />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {listing.listing_type === 'sale' && (
                                <div className="mt-6">
                                    <MortgageCalculator initialPrice={Number(listing.price)} />
                                </div>
                            )}

                            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="p-6 pb-0">
                                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {listing.address}, {listing.city}, {listing.state} {listing.zip}
                                    </p>
                                </div>
                                <div className="mt-4 aspect-[16/9] w-full bg-gray-100">
                                    <iframe
                                        src={mapEmbedUrl}
                                        title="Property location"
                                        className="h-full w-full"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right — price + inquiry */}
                        <div className="space-y-6">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: badgeBg }}>
                                        {badgeLabel}
                                    </span>
                                </div>
                                <h1 className="mt-3 text-xl font-bold text-gray-900">{listing.title}</h1>
                                <p className="mt-1 text-sm text-gray-500 capitalize">{listing.property_type}</p>
                                <p className="mt-4 text-4xl font-bold" style={{ color: ACCENT }}>
                                    ${Number(listing.price).toLocaleString()}
                                    {listing.listing_type === 'rent' && <span className="text-lg font-medium text-gray-500">/mo</span>}
                                </p>
                                <p className="mt-2 flex items-start gap-1 text-sm text-gray-500">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>
                                        {listing.address}<br />
                                        {listing.city}, {listing.state} {listing.zip}
                                    </span>
                                </p>
                                <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-4 text-sm text-gray-700">
                                    <span>{listing.bedrooms}BD</span>
                                    <span className="text-gray-300">|</span>
                                    <span>{bath}BA</span>
                                    {listing.square_feet && (
                                        <>
                                            <span className="text-gray-300">|</span>
                                            <span>{Number(listing.square_feet).toLocaleString()} sqft</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-2xl border-2 p-6" style={{ borderColor: ACCENT, backgroundColor: `${ACCENT}08` }}>
                                <h3 className="text-lg font-semibold text-gray-900">Interested? Contact Us</h3>
                                <p className="mt-1 text-sm text-gray-500">Send a message and we'll get back to you with more details.</p>

                                {submitted ? (
                                    <div className="mt-5 flex flex-col items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-6 text-center">
                                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                                        <div>
                                            <p className="font-semibold text-green-800">Message Sent!</p>
                                            <p className="mt-1 text-sm text-green-600">We'll contact you shortly.</p>
                                        </div>
                                        <button type="button" onClick={() => setSubmitted(false)} className="mt-2 text-xs font-medium text-green-700 underline hover:text-green-800">
                                            Send another inquiry
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20"
                                            />
                                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                placeholder="Phone Number"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20"
                                            />
                                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="email"
                                                placeholder="Your Email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20"
                                            />
                                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <textarea
                                                placeholder="Your Message"
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                rows={4}
                                                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20"
                                            />
                                            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                                        </div>
                                        <CaptchaField data={data} setData={setData} errors={errors} />
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-50"
                                            style={{ backgroundColor: ACCENT }}
                                        >
                                            {processing ? 'Sending...' : (
                                                <>
                                                    <Send className="h-4 w-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

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
