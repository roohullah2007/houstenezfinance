import { Head, Link, router } from '@inertiajs/react';
import { Building2, Car, CheckCircle2, Clock, Plus, XCircle } from 'lucide-react';

const ACCENT = '#F26B5E';

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    sold: 'bg-blue-100 text-blue-800 border-blue-200',
};

const STATUS_ICONS: Record<string, typeof Clock> = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
    active: CheckCircle2,
    sold: CheckCircle2,
};

interface CarItem {
    id: number;
    title: string;
    year: number;
    make: string;
    model: string;
    vehicle_type: string;
    price: number | string;
    city: string;
    state: string;
    images: string[] | null;
    main_image_index: number | null;
    status: string;
    payment_status: string | null;
    payment_amount: number | null;
    created_at: string;
}

interface PropertyItem {
    id: number;
    title: string;
    slug: string;
    property_type: string;
    listing_type: string;
    price: number | string;
    city: string | null;
    state: string | null;
    bedrooms: number | null;
    images: string[] | null;
    main_image_index: number | null;
    status: string;
    created_at: string;
}

interface Props {
    type: 'cars' | 'properties';
    counts: { cars: number; properties: number };
    cars: CarItem[];
    properties: PropertyItem[];
}

function StatusBadge({ status }: { status: string }) {
    const Icon = STATUS_ICONS[status] || Clock;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] || STATUS_COLORS.pending}`}
        >
            <Icon className="h-3 w-3" />
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

function Thumb({ images, mainIndex, fallback: Fallback }: { images: string[] | null; mainIndex: number | null; fallback: typeof Car }) {
    return (
        <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
            {images && images.length > 0 ? (
                <img
                    src={`/storage/${images[mainIndex ?? 0] ?? images[0]}`}
                    alt=""
                    className="h-full w-full object-cover"
                />
            ) : (
                <Fallback className="h-5 w-5 text-gray-400" />
            )}
        </div>
    );
}

export default function MyListings({ type, counts, cars, properties }: Props) {
    function switchTab(next: 'cars' | 'properties') {
        if (next !== type) {
            router.get('/my-listings', { type: next }, { preserveState: false });
        }
    }

    const tabs = [
        { key: 'cars' as const, label: 'My Car Listings', count: counts.cars, icon: Car },
        { key: 'properties' as const, label: 'My Property Listings', count: counts.properties, icon: Building2 },
    ];

    return (
        <>
            <Head title="My Listings" />

            <div className="flex h-full flex-1 flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Listings</h1>
                        <p className="mt-1 text-sm text-gray-500">All the cars and properties you have listed.</p>
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

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => {
                        const active = type === tab.key;
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => switchTab(tab.key)}
                                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                                    active
                                        ? 'border-transparent text-white'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                                style={active ? { backgroundColor: ACCENT } : undefined}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                        active ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {type === 'cars' ? (
                        cars.length === 0 ? (
                            <div className="px-6 py-12 text-center">
                                <Car className="mx-auto h-10 w-10 text-gray-300" />
                                <p className="mt-3 text-sm font-medium text-gray-900">No car listings yet</p>
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
                                        {cars.map((listing) => (
                                            <tr key={listing.id} className="transition hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <Thumb images={listing.images} mainIndex={listing.main_image_index} fallback={Car} />
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
                                                    <StatusBadge status={listing.status} />
                                                    {listing.payment_status === 'pending' && listing.payment_amount ? (
                                                        <p className="mt-1 text-xs text-amber-600">Listing fee unpaid</p>
                                                    ) : null}
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(listing.created_at).toLocaleDateString('en-US')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : properties.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Building2 className="mx-auto h-10 w-10 text-gray-300" />
                            <p className="mt-3 text-sm font-medium text-gray-900">No property listings yet</p>
                            <p className="mt-1 text-sm text-gray-500">
                                Property listings added for your account will show up here.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 bg-gray-50">
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Property</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {properties.map((listing) => (
                                        <tr key={listing.id} className="transition hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <Thumb images={listing.images} mainIndex={listing.main_image_index} fallback={Building2} />
                                                    <div>
                                                        <Link
                                                            href={`/real-estate/${listing.slug}`}
                                                            className="font-medium text-gray-900 hover:underline"
                                                        >
                                                            {listing.title}
                                                        </Link>
                                                        <p className="text-xs text-gray-500">
                                                            {listing.property_type} • {listing.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                                                            {listing.bedrooms ? ` • ${listing.bedrooms} bd` : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">
                                                ${Number(listing.price).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {[listing.city, listing.state].filter(Boolean).join(', ') || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={listing.status} />
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(listing.created_at).toLocaleDateString('en-US')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

MyListings.layout = {
    breadcrumbs: [
        { title: 'My Dashboard', href: '/dashboard' },
        { title: 'My Listings', href: '/my-listings' },
    ],
};
