import { Head, Link } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { CheckCircle2, Home, Car } from 'lucide-react';

const ACCENT = '#F26B5E';

export default function ThankYou() {
    return (
        <>
            <Head title="Thank You — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <PublicHeader />
                </div>

                <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full shadow-lg" style={{ backgroundColor: ACCENT }}>
                        <CheckCircle2 className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Your listing has been submitted!
                    </h1>
                    <p className="mt-4 text-base text-gray-600">
                        Thanks — we've received your submission and will review it shortly. You'll hear from us within 24 hours.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-200 transition hover:ring-gray-300"
                        >
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Link>
                        <Link
                            href="/car-listings"
                            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
                            style={{ backgroundColor: ACCENT }}
                        >
                            <Car className="h-4 w-4" />
                            Browse Listings
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
