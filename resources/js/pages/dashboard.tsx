import { Head, Link } from '@inertiajs/react';
import {
    Car,
    Clock,
    CheckCircle2,
    XCircle,
    Eye,
    ArrowRight,
} from 'lucide-react';

interface CarListing {
    id: number;
    title: string;
    make: string;
    model: string;
    year: number;
    price: string;
    status: 'pending' | 'approved' | 'rejected';
    first_name: string;
    last_name: string;
    created_at: string;
    images: string[] | null;
    main_image_index: number;
}

interface Props {
    stats: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    recentListings: CarListing[];
}

const ACCENT = '#F26B5E';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
};

export default function Dashboard({ stats, recentListings }: Props) {
    const statCards = [
        { label: 'Total Listings', value: stats.total, color: 'bg-blue-500', href: '/admin/car-listings' },
        { label: 'Active Listings', value: stats.approved, color: 'bg-green-500', href: '/admin/car-listings?status=approved' },
        { label: 'Pending Approval', value: stats.pending, color: 'bg-yellow-500', href: '/admin/car-listings?status=pending' },
        { label: 'Rejected', value: stats.rejected, color: 'bg-red-500', href: '/admin/car-listings?status=rejected' },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                            <div className={`${card.color} p-3 rounded-lg`}>
                                {card.label === 'Total Listings' && <Car className="w-6 h-6 text-white" />}
                                {card.label === 'Active Listings' && <CheckCircle2 className="w-6 h-6 text-white" />}
                                {card.label === 'Pending Approval' && <Clock className="w-6 h-6 text-white" />}
                                {card.label === 'Rejected' && <XCircle className="w-6 h-6 text-white" />}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Recent Listings */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Listings</h2>
                    <Link
                        href="/admin/car-listings"
                        className="text-sm hover:underline flex items-center gap-1"
                        style={{ color: ACCENT }}
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {recentListings.length === 0 ? (
                    <div className="p-5 text-center text-gray-500">No listings yet</div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {recentListings.map((listing) => (
                            <div key={listing.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900 truncate">{listing.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {listing.first_name} {listing.last_name} &bull;{' '}
                                            {new Date(listing.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-semibold" style={{ color: ACCENT }}>
                                            ${Number(listing.price).toLocaleString()}
                                        </span>
                                        <span className={`px-2 py-1 text-xs rounded-full ${STATUS_COLORS[listing.status]}`}>
                                            {listing.status}
                                        </span>
                                        <Link
                                            href={`/admin/car-listings/${listing.id}`}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
    ],
};
