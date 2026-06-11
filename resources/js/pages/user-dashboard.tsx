import { Head, Link, usePage } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { Car, CheckCircle2, Clock, Plus, Settings, XCircle } from 'lucide-react';

const ACCENT = '#F26B5E';

interface Listing {
    id: number;
    title: string;
    year: number;
    make: string;
    model: string;
    price: number;
    status: string;
    payment_status: string | null;
    payment_amount: number | null;
    created_at: string;
}

interface Props {
    listings: Listing[];
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
        approved: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle2 },
        pending: { bg: 'bg-amber-100', text: 'text-amber-700', icon: Clock },
        rejected: { bg: 'bg-red-100', text: 'text-red-700', icon: XCircle },
    };
    const s = styles[status] || styles.pending;
    const Icon = s.icon;
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text}`}>
            <Icon className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default function UserDashboard({ listings }: Props) {
    const { auth } = usePage().props;
    const user = (auth as { user?: { name?: string } })?.user;

    return (
        <>
            <Head title="My Dashboard" />
            <div className="min-h-screen bg-gray-50">
                <PublicHeader />

                <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
                    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                                Welcome{user?.name ? `, ${user.name}` : ''}
                            </h1>
                            <p className="mt-1 text-sm text-gray-500">Manage your car listings and account.</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/settings/profile"
                                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                <Settings className="h-4 w-4" />
                                Account Settings
                            </Link>
                            <Link
                                href="/sell-your-car"
                                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110"
                                style={{ backgroundColor: ACCENT }}
                            >
                                <Plus className="h-4 w-4" />
                                Sell Your Car
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-200 px-6 py-4">
                            <h2 className="flex items-center gap-2 text-base font-semibold text-gray-900">
                                <Car className="h-5 w-5" style={{ color: ACCENT }} />
                                My Listings
                            </h2>
                        </div>

                        {listings.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <Car className="mx-auto h-10 w-10 text-gray-300" />
                                <p className="mt-3 text-sm font-medium text-gray-900">No listings yet</p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Submit your first vehicle and it will show up here.
                                </p>
                                <Link
                                    href="/sell-your-car"
                                    className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    <Plus className="h-4 w-4" />
                                    List Your Car
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
                                            <th className="px-6 py-3 font-medium">Vehicle</th>
                                            <th className="px-6 py-3 font-medium">Price</th>
                                            <th className="px-6 py-3 font-medium">Status</th>
                                            <th className="px-6 py-3 font-medium">Submitted</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listings.map((listing) => (
                                            <tr key={listing.id} className="border-b border-gray-100 last:border-0">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-900">{listing.title}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {listing.year} {listing.make} {listing.model}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    ${Number(listing.price).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <StatusBadge status={listing.status} />
                                                    {listing.payment_status === 'pending' && listing.payment_amount ? (
                                                        <p className="mt-1 text-xs text-amber-600">Listing fee unpaid</p>
                                                    ) : null}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {new Date(listing.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
