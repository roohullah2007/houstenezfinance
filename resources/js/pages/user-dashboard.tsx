import { Head, Link } from '@inertiajs/react';
import { Car, CheckCircle2, Clock, Plus, XCircle } from 'lucide-react';

const ACCENT = '#F26B5E';

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_ICONS: Record<string, typeof Clock> = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
};

interface Listing {
    id: number;
    title: string;
    year: number;
    make: string;
    model: string;
    vehicle_type: string;
    price: number;
    city: string;
    state: string;
    images: string[] | null;
    main_image_index: number | null;
    status: string;
    payment_status: string | null;
    payment_amount: number | null;
    payment_token: string | null;
    created_at: string;
}

interface Props {
    stats: {
        total: number;
        approved: number;
        pending: number;
        rejected: number;
    };
    listings: Listing[];
}

export default function UserDashboard({ stats, listings }: Props) {
    const statCards = [
        { label: 'Total Listings', value: stats.total, icon: Car, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
        { label: 'Approved', value: stats.approved, icon: CheckCircle2, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
        { label: 'Pending Review', value: stats.pending, icon: Clock, iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
        { label: 'Rejected', value: stats.rejected, icon: XCircle, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    ];

    return (
        <>
            <Head title="My Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-500">Track the status of your car listings.</p>
                    </div>
                    <Link
                        href="/sell-your-car"
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                        style={{ backgroundColor: ACCENT }}
                    >
                        <Plus className="h-4 w-4" />
                        Sell Your Car
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconBg}`}>
                                    <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                    <p className="text-xs font-medium text-gray-500">{card.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                        <h2 className="text-base font-semibold text-gray-900">My Listings</h2>
                    </div>

                    {listings.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Car className="mx-auto h-10 w-10 text-gray-300" />
                            <p className="mt-3 text-sm font-medium text-gray-900">No listings yet</p>
                            <p className="mt-1 text-sm text-gray-500">Submit your first vehicle and it will show up here.</p>
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
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Vehicle</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {listings.map((listing) => {
                                        const StatusIcon = STATUS_ICONS[listing.status] || Clock;
                                        return (
                                            <tr key={listing.id} className="transition hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                                            {listing.images && listing.images.length > 0 ? (
                                                                <img
                                                                    src={`/storage/${listing.images[listing.main_image_index ?? 0] ?? listing.images[0]}`}
                                                                    alt=""
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Car className="h-5 w-5 text-gray-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{listing.title}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {listing.year} {listing.make} {listing.model} • {listing.vehicle_type}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-gray-900">
                                                    ${Number(listing.price).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {listing.city}, {listing.state}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status] || STATUS_COLORS.pending}`}
                                                    >
                                                        <StatusIcon className="h-3 w-3" />
                                                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                                    </span>
                                                    {listing.payment_status === 'pending' && listing.payment_token ? (
                                                        <Link
                                                            href={`/sell-your-car/payment/${listing.payment_token}`}
                                                            className="mt-1 block text-xs font-semibold text-amber-600 underline hover:text-amber-700"
                                                        >
                                                            Listing fee unpaid — complete payment
                                                        </Link>
                                                    ) : null}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(listing.created_at).toLocaleDateString('en-US')}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

UserDashboard.layout = {
    breadcrumbs: [{ title: 'My Dashboard', href: '/dashboard' }],
};
