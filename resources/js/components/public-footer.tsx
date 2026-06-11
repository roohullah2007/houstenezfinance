import { Link } from '@inertiajs/react';
import { Mail, MapPin, Phone } from 'lucide-react';

const QUICK_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Car Listings', href: '/car-listings' },
    { label: 'Real Estate', href: '/real-estate' },
    { label: 'Sell Your Car', href: '/sell-your-car' },
    { label: 'Financing', href: '/finance-application' },
    { label: 'Contact', href: '/contact' },
];

const BROWSE_LINKS = [
    { label: 'Categories', href: '/categories' },
    { label: 'Locations', href: '/locations' },
    { label: 'Dealers', href: '/dealers' },
    { label: 'Sedan', href: '/car-listings?vehicle_type=Sedan' },
    { label: 'SUV', href: '/car-listings?vehicle_type=SUV' },
    { label: 'Truck', href: '/car-listings?vehicle_type=Truck' },
    { label: 'Coupe', href: '/car-listings?vehicle_type=Coupe' },
];

export default function PublicFooter() {
    return (
        <footer className="bg-[#0b1020] text-white">
            <div className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <img src="/images/housten-logo-1.png" alt="Houston EZ Finance" className="h-14 w-auto" />
                        <p className="mt-4 text-sm leading-relaxed text-white/60">
                            Your trusted marketplace for quality vehicles, real estate, and hassle-free financing in Houston and beyond.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h4>
                        <ul className="mt-5 space-y-3 text-sm text-white/60">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition hover:text-[#F26B5E]">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold tracking-wider uppercase">Browse</h4>
                        <ul className="mt-5 space-y-3 text-sm text-white/60">
                            {BROWSE_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="transition hover:text-[#F26B5E]">
                                        {link.label}
                                    </Link>
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
                    <p>&copy; {new Date().getFullYear()} Houston EZ Finance. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
