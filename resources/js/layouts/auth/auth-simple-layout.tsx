import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const ACCENT = '#F26B5E';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh font-sans">
            {/* Left — Branding Panel */}
            <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] lg:flex lg:flex-col lg:items-center lg:justify-center">
                {/* Decorative glows */}
                <div
                    className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
                    style={{ background: ACCENT }}
                />
                <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative z-10 flex flex-col items-center px-12 text-center">
                    <Link href={home()}>
                        <img
                            src="/images/housten-logo.svg"
                            alt="Houston EZ Finance"
                            className="h-28 w-72 object-contain"
                        />
                    </Link>
                    <p className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
                        Your trusted marketplace for quality vehicles and hassle-free auto financing in Houston and beyond.
                    </p>
                    <div className="mt-10 flex items-center gap-6 text-sm text-white/50">
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">500+</span>
                            <span>Vehicles Listed</span>
                        </div>
                        <div className="h-8 w-px bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">200+</span>
                            <span>Trusted Dealers</span>
                        </div>
                        <div className="h-8 w-px bg-white/20" />
                        <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-white">50+</span>
                            <span>Cities Covered</span>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="absolute bottom-6 text-xs text-white/30">
                    &copy; {new Date().getFullYear()} Houston EZ Finance. All rights reserved.
                </div>
            </div>

            {/* Right — Form Panel */}
            <div className="flex w-full flex-col items-center justify-center bg-white px-6 py-12 text-gray-900 lg:w-1/2">
                {/* Mobile logo */}
                <div className="mb-8 lg:hidden">
                    <Link href={home()}>
                        <img
                            src="/images/housten-logo-black.svg"
                            alt="Houston EZ Finance"
                            className="h-20 w-52 object-contain"
                        />
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                        <p className="mt-2 text-sm text-gray-500">{description}</p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
