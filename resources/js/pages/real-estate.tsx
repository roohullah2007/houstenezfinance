import { Head, Link, useForm } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { CaptchaField } from '@/components/captcha-field';
import {
    Home,
    Building2,
    Key,
    Landmark,
    TrendingUp,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    ChevronRight,
    Send,
    CheckCircle2,
    ShieldCheck,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';

const ACCENT = '#F26B5E';

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const selectClass = 'w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

const INQUIRY_TYPES = [
    'Buying a Home',
    'Selling a Home',
    'Renting',
    'Investment Property',
    'Commercial Property',
    'General Question',
];

const services = [
    {
        icon: Home,
        title: 'Home Buying',
        description: 'Find your dream home with our expert agents guiding you every step of the way.',
    },
    {
        icon: Key,
        title: 'Home Selling',
        description: 'Get top dollar for your property with our proven marketing strategies.',
    },
    {
        icon: Building2,
        title: 'Rentals',
        description: 'Quality rental properties in prime Houston locations for every budget.',
    },
    {
        icon: TrendingUp,
        title: 'Investment Properties',
        description: 'Build wealth through real estate with our investment specialists.',
    },
    {
        icon: Landmark,
        title: 'Commercial Real Estate',
        description: 'Office, retail, and industrial spaces for your business needs.',
    },
    {
        icon: ShieldCheck,
        title: 'Financing Assistance',
        description: 'We connect you with trusted lenders to make home ownership a reality.',
    },
];

export default function RealEstate() {
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        inquiry_type: '',
        property_interest: '',
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

            <div className="min-h-screen bg-white font-sans text-slate-900">
                {/* Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />

                    <PublicHeader />

                    <div className="relative z-10 mx-auto max-w-[1408px] px-4 pb-16 pt-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="text-white">Real Estate</span>
                        </div>
                        <div className="mt-3 max-w-3xl">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Houston Real Estate Made Easy</h1>
                            <p className="mt-4 text-lg text-white/70">
                                Whether you're buying your first home, selling a property, or exploring investment opportunities,
                                our team has you covered across Houston and beyond.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <a href="#contact" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110" style={{ backgroundColor: ACCENT }}>
                                    Get in Touch
                                    <ChevronRight className="h-4 w-4" />
                                </a>
                                <a href="#services" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                                    Our Services
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services */}
                <section id="services" className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What We Offer</h2>
                        <p className="mt-3 text-base text-gray-500">
                            From first-time homebuyers to seasoned investors, we deliver personalized real estate solutions.
                        </p>
                    </div>
                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((s) => (
                            <div key={s.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `${ACCENT}15` }}>
                                    <s.icon className="h-6 w-6" style={{ color: ACCENT }} />
                                </div>
                                <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-500">{s.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Why choose us */}
                <section className="bg-gray-50 py-16">
                    <div className="mx-auto max-w-[1408px] px-4 sm:px-6 lg:px-8">
                        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Houston EZ Finance?</h2>
                                <p className="mt-4 text-base text-gray-500">
                                    We combine deep local knowledge with financing expertise to simplify every real estate transaction.
                                </p>
                                <ul className="mt-6 space-y-4">
                                    {[
                                        'Trusted local agents who know every Houston neighborhood.',
                                        'Financing guidance from our in-house specialists.',
                                        'Transparent pricing with no hidden fees.',
                                        'Fast, responsive service — we reply within 24 hours.',
                                    ].map((point) => (
                                        <li key={point} className="flex items-start gap-3">
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0" style={{ color: ACCENT }} />
                                            <span className="text-sm text-gray-700">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Properties Sold', value: '500+' },
                                    { label: 'Happy Families', value: '1,200+' },
                                    { label: 'Years Experience', value: '15+' },
                                    { label: 'Customer Rating', value: '4.9/5' },
                                ].map((stat) => (
                                    <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                                        <p className="text-3xl font-bold" style={{ color: ACCENT }}>{stat.value}</p>
                                        <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Form */}
                <section id="contact" className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-3">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Let's Talk Real Estate</h2>
                                <p className="mt-3 text-base text-gray-500">
                                    Tell us about your goals and we'll connect you with the right specialist.
                                </p>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                                        <MapPin className="h-5 w-5" style={{ color: ACCENT }} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">Our Office</h3>
                                        <p className="mt-1 text-sm text-gray-500">3505 S Dairy Ashford Rd # 115 717, Houston, TX 77082</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                                        <Phone className="h-5 w-5" style={{ color: ACCENT }} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">Phone</h3>
                                        <p className="mt-1 text-sm text-gray-500">832-322-2354</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                                        <Mail className="h-5 w-5" style={{ color: ACCENT }} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">Email</h3>
                                        <p className="mt-1 text-sm text-gray-500">houstonezfinance@gmail.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            {submitted && (
                                <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-6 py-4">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-green-800">Inquiry Received!</p>
                                        <p className="text-sm text-green-600">A real estate specialist will reach out within 24 hours.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <h3 className="mb-6 text-xl font-bold text-gray-900">Real Estate Inquiry</h3>
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>Your Name</label>
                                        <input type="text" className={inputClass} placeholder="John Doe" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Email Address</label>
                                        <input type="email" className={inputClass} placeholder="john@example.com" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Phone Number</label>
                                        <input type="tel" className={inputClass} placeholder="832-322-2354" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>I'm Interested In</label>
                                        <select className={selectClass} value={data.inquiry_type} onChange={(e) => setData('inquiry_type', e.target.value)}>
                                            <option value="">Select an option</option>
                                            {INQUIRY_TYPES.map((t) => (
                                                <option key={t} value={t}>{t}</option>
                                            ))}
                                        </select>
                                        {errors.inquiry_type && <p className="mt-1 text-xs text-red-500">{errors.inquiry_type}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Property / Area of Interest (optional)</label>
                                        <input type="text" className={inputClass} placeholder="e.g. 3-bedroom home in Katy, TX" value={data.property_interest} onChange={(e) => setData('property_interest', e.target.value)} />
                                        {errors.property_interest && <p className="mt-1 text-xs text-red-500">{errors.property_interest}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Message</label>
                                        <textarea className={`${inputClass} min-h-[150px] resize-y`} placeholder="Tell us about what you're looking for..." value={data.message} onChange={(e) => setData('message', e.target.value)} rows={6} />
                                        {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <CaptchaField data={data} setData={setData} errors={errors} />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
                                            style={{ backgroundColor: ACCENT }}
                                        >
                                            {processing ? 'Sending...' : 'Send Inquiry'}
                                            <Send className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </form>
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
                                    {['About Us', 'Car Listings', 'Real Estate', 'Dealers', 'Contact'].map((l) => (
                                        <li key={l}><a href="#" className="transition hover:text-[#F26B5E]">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Services</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['Home Buying', 'Home Selling', 'Rentals', 'Investment', 'Commercial'].map((c) => (
                                        <li key={c}><a href="#" className="transition hover:text-[#F26B5E]">{c}</a></li>
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
