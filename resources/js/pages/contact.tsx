import { Head, Link, useForm } from '@inertiajs/react';
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
    Clock,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';

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

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        captcha_token: '',
        captcha_answer: '',
        website: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                setSubmitted(true);
                reset();
            },
        });
    }

    return (
        <>
            <Head title="Contact Us — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-white font-sans text-slate-900">
                {/* Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />

                    <PublicHeader />

                    <div className="relative z-10 mx-auto max-w-[1408px] px-4 pb-12 pt-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="text-white">Contact Us</span>
                        </div>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
                        <p className="mt-2 text-lg text-white/70">We'd love to hear from you. Get in touch with us.</p>
                    </div>
                </div>

                {/* Content */}
                <section className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-3">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Get In Touch</h2>
                                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                    Have a question about buying, selling, or financing a car? Reach out and our team will get back to you within 24 hours.
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
                                <div className="flex items-start gap-4">
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                                        <Clock className="h-5 w-5" style={{ color: ACCENT }} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">Business Hours</h3>
                                        <p className="mt-1 text-sm text-gray-500">Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 4:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            {submitted && (
                                <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-6 py-4">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-green-800">Message Sent!</p>
                                        <p className="text-sm text-green-600">We'll get back to you within 24 hours.</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <h2 className="mb-6 text-xl font-bold text-gray-900">Send us a message</h2>
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
                                        <input type="tel" className={inputClass} placeholder="Your phone number" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Subject</label>
                                        <input type="text" className={inputClass} placeholder="How can we help?" value={data.subject} onChange={(e) => setData('subject', e.target.value)} />
                                        {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Message</label>
                                        <textarea className={`${inputClass} min-h-[150px] resize-y`} placeholder="Tell us more about your inquiry..." value={data.message} onChange={(e) => setData('message', e.target.value)} rows={6} />
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
                                            {processing ? 'Sending...' : 'Send Message'}
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
                                <p className="mt-4 text-sm leading-relaxed text-white/60">Your trusted marketplace for quality vehicles and hassle-free auto financing in Houston and beyond.</p>
                                <div className="mt-5 flex items-center gap-3">
                                    {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                        <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#F26B5E]"><Icon className="h-4 w-4" /></a>
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
