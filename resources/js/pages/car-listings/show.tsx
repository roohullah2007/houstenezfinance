import { Head, Link, useForm } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { CaptchaField } from '@/components/captcha-field';
import {
    ChevronLeft,
    ChevronRight,
    Car,
    Calendar,
    Gauge,
    Palette,
    Cog,
    Hash,
    MapPin,
    Mail,
    Phone,
    Facebook,
    Twitter,
    Instagram,
    Send,
    CheckCircle2,
    Youtube,
    Check,
    Minus,
    FileText,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';

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
    exterior_color: string;
    interior_color: string;
    drive: string;
    vin: string | null;
    features: string | null;
    transmission: string;
    vehicle_type: string;
    description: string | null;
    video_url: string | null;
    images: string[] | null;
    main_image_index: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    created_at: string;
}

interface Props {
    listing: CarListing;
    availableFeatures?: string[];
}

export default function ShowCarListing({ listing, availableFeatures = [] }: Props) {
    const [selectedImage, setSelectedImage] = useState(listing.main_image_index ?? 0);
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        message: `I'm interested in the ${listing.year} ${listing.make} ${listing.model}. Please contact me.`,
        captcha_token: '',
        captcha_answer: '',
        website: '',
    });

    function handleInquirySubmit(e: FormEvent) {
        e.preventDefault();
        post(`/car-listings/${listing.id}/inquiry`, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
            },
        });
    }

    function getYouTubeEmbedId(url: string | null): string | null {
        if (!url) return null;
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/,
        ];
        for (const p of patterns) {
            const m = url.match(p);
            if (m) return m[1];
        }
        return null;
    }
    function getVimeoEmbedId(url: string | null): string | null {
        if (!url) return null;
        const m = url.match(/(?:vimeo\.com\/(?:video\/|channels\/[^/]+\/|groups\/[^/]+\/videos\/)?|player\.vimeo\.com\/video\/)(\d+)/);
        return m ? m[1] : null;
    }
    const videoId = getYouTubeEmbedId(listing.video_url);
    const vimeoId = getVimeoEmbedId(listing.video_url);

    const details = [
        { icon: Calendar, label: 'Year', value: listing.year },
        { icon: Car, label: 'Make', value: listing.make },
        { icon: Car, label: 'Model', value: listing.model },
        { icon: Cog, label: 'Type', value: listing.vehicle_type },
        { icon: Gauge, label: 'Miles', value: `${Number(listing.miles).toLocaleString()} mi` },
        { icon: Cog, label: 'Transmission', value: listing.transmission },
        { icon: Cog, label: 'Drive', value: listing.drive },
        { icon: Palette, label: 'Exterior', value: listing.exterior_color },
        { icon: Palette, label: 'Interior', value: listing.interior_color },
        { icon: Hash, label: 'VIN', value: listing.vin || 'N/A' },
    ];

    const nextImage = () => {
        if (!listing.images) return;
        setSelectedImage((prev) => (prev + 1) % listing.images!.length);
    };
    const prevImage = () => {
        if (!listing.images) return;
        setSelectedImage((prev) => (prev - 1 + listing.images!.length) % listing.images!.length);
    };

    return (
        <>
            <Head title={`${listing.title} — Houston EZ Finance`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-white font-sans text-slate-900">
                {/* Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <PublicHeader />
                </div>

                {/* Content */}
                <div className="mx-auto max-w-[1408px] px-4 py-10 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-gray-900">Home</Link>
                        <span>/</span>
                        <Link href="/car-listings" className="hover:text-gray-900">Car Listings</Link>
                        <span>/</span>
                        <span className="truncate text-gray-900">{listing.title}</span>
                    </nav>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left — Images */}
                        <div className="lg:col-span-2">
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                <div className="relative aspect-[16/10] w-full bg-gray-100">
                                    {listing.images && listing.images.length > 0 ? (
                                        <>
                                            <img src={`/storage/${listing.images[selectedImage]}`} alt={listing.title} className="h-full w-full object-cover" />
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
                                            <Car className="h-16 w-16 text-gray-300" />
                                        </div>
                                    )}
                                </div>
                                {listing.images && listing.images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto border-t border-gray-200 p-3">
                                        {listing.images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImage(i)}
                                                className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                                    selectedImage === i ? 'border-[#F26B5E]' : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                            >
                                                <img src={`/storage/${img}`} alt="" className="h-full w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Vehicle Details — moved above description */}
                            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">Vehicle Details</h3>
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

                            {/* Video */}
                            {listing.video_url && (
                                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                                        <Youtube className="h-5 w-5" style={{ color: ACCENT }} />
                                        Video
                                    </h3>
                                    {videoId ? (
                                        <div className="aspect-video w-full overflow-hidden rounded-xl">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${videoId}`}
                                                title="Vehicle video"
                                                className="h-full w-full"
                                                frameBorder={0}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : vimeoId ? (
                                        <div className="aspect-video w-full overflow-hidden rounded-xl">
                                            <iframe
                                                src={`https://player.vimeo.com/video/${vimeoId}`}
                                                title="Vehicle video"
                                                className="h-full w-full"
                                                frameBorder={0}
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                                            <video src={listing.video_url} controls className="h-full w-full" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Description */}
                            {listing.description && (
                                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Description</h3>
                                    <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{listing.description}</p>
                                </div>
                            )}

                            {/* Features — show full catalog, with check/uncheck per feature */}
                            {(availableFeatures.length > 0 || listing.features) && (() => {
                                const selected = new Set(
                                    (listing.features ?? '')
                                        .split(',')
                                        .map((s) => s.trim())
                                        .filter(Boolean),
                                );
                                const rows = availableFeatures.length > 0 ? availableFeatures : Array.from(selected);
                                // If there are custom-typed features not in the catalog, append them so nothing is lost.
                                const catalogSet = new Set(availableFeatures);
                                const extras = Array.from(selected).filter((f) => !catalogSet.has(f));
                                const allRows = [...rows, ...extras];
                                const selectedCount = selected.size;

                                return (
                                    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                        <div className="mb-4 flex items-baseline justify-between">
                                            <h3 className="text-lg font-semibold text-gray-900">Features</h3>
                                            <span className="text-xs font-medium text-gray-500">
                                                {selectedCount} of {allRows.length}
                                            </span>
                                        </div>
                                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                            {allRows.map((feature) => {
                                                const has = selected.has(feature);
                                                return (
                                                    <div
                                                        key={feature}
                                                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm ${
                                                            has
                                                                ? 'border-[#F26B5E]/30 bg-[#F26B5E]/5 text-gray-900'
                                                                : 'border-gray-100 bg-white text-gray-400'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                                                                has ? 'bg-[#F26B5E] text-white' : 'bg-gray-100 text-gray-300'
                                                            }`}
                                                        >
                                                            {has ? <Check className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                                                        </span>
                                                        <span className={has ? 'font-medium' : ''}>{feature}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>

                        {/* Right — Price, Details, Contact */}
                        <div className="space-y-6">
                            {/* Price */}
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h1 className="text-xl font-bold text-gray-900">{listing.title}</h1>
                                <p className="mt-1 text-sm text-gray-500">{listing.year} {listing.make} {listing.model}</p>
                                <p className="mt-4 text-4xl font-bold" style={{ color: ACCENT }}>
                                    ${Number(listing.price).toLocaleString()}
                                </p>
                                <p className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                                    <MapPin className="h-4 w-4" />
                                    {listing.city}, {listing.state}
                                </p>
                            </div>

                            {/* Apply for Financing */}
                            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#0b1020] p-6 text-center shadow-sm">
                                <h3 className="flex items-center justify-center gap-2 text-lg font-semibold text-white">
                                    <FileText className="h-5 w-5" />
                                    Apply for Financing
                                </h3>
                                <Link
                                    href={`/finance-application?listing=${listing.id}`}
                                    className="mt-4 inline-flex w-full items-center justify-center rounded-md border-2 bg-white px-6 py-3 text-base font-bold uppercase tracking-wide transition hover:bg-[#F26B5E] hover:text-white"
                                    style={{ color: ACCENT, borderColor: ACCENT }}
                                >
                                    Apply Now!
                                </Link>
                            </div>

                            {/* Contact the Owner — inquiry form */}
                            <div className="rounded-2xl border-2 p-6" style={{ borderColor: ACCENT, backgroundColor: `${ACCENT}08` }}>
                                <h3 className="text-lg font-semibold text-gray-900">Contact the Owner</h3>
                                <p className="mt-1 text-sm text-gray-500">Interested in this vehicle? Send us a message and we'll get back to you.</p>

                                {submitted ? (
                                    <div className="mt-5 flex flex-col items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-6 text-center">
                                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                                        <div>
                                            <p className="font-semibold text-green-800">Message Sent!</p>
                                            <p className="mt-1 text-sm text-green-600">We'll contact you shortly.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSubmitted(false)}
                                            className="mt-2 text-xs font-medium text-green-700 underline hover:text-green-800"
                                        >
                                            Send another inquiry
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleInquirySubmit} className="mt-5 space-y-3">
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
                                                type="email"
                                                placeholder="Your Email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20"
                                            />
                                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <input
                                                type="tel"
                                                placeholder="Phone Number (optional)"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20"
                                            />
                                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
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

                {/* Legal Disclaimer */}
                <div className="mx-auto max-w-[1408px] px-4 pb-10 sm:px-6 lg:px-8">
                    <p className="mx-auto max-w-5xl text-center text-[11px] leading-relaxed text-gray-500">
                        All Prices Listed are Cash Prices. Information deemed reliable but not Guaranteed. Subject to change without notice. All advertised prices exclude government fees and taxes, any finance charges, any dealer document preparation charge, and any emission testing charge. The price for listed vehicles as equipped does not include charges such as: License, Title, Registration Fees, State or Local Taxes, Dealer Prep, Smog Fees. DEALER makes no representations, expressed or implied, to any actual or prospective purchaser or owner of this vehicle as to the existence, ownership, accuracy, description or condition of the listed vehicle's equipment, accessories, price, specials or any warranties. Any and all differences must be addressed prior to the sale of this vehicle.
                    </p>
                </div>

                {/* Footer */}
                <footer className="bg-[#0b1020] text-white">
                    <div className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <img src="/images/housten-logo-1.png" alt="Houston EZ Finance" className="h-14 w-auto" />
                                <p className="mt-4 text-sm leading-relaxed text-white/60">Your trusted marketplace for quality vehicles and hassle-free auto financing in Houston and beyond.</p>
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
                                    {['About Us', 'Car Listings', 'Categories', 'Locations', 'Dealers', 'Blog', 'Contact'].map((l) => (
                                        <li key={l}><a href="#" className="transition hover:text-[#F26B5E]">{l}</a></li>
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
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Categories</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['Sedan', 'SUV', 'Coupe', 'Convertible', 'Truck'].map((c) => (
                                        <li key={c}><a href="#" className="transition hover:text-[#F26B5E]">{c}</a></li>
                                    ))}
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
