import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Eye,
    CheckCircle2,
    XCircle,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Car,
    Clock,
    Filter,
    Plus,
    Pencil,
} from 'lucide-react';
import { useState } from 'react';

interface CarListing {
    id: number;
    title: string;
    make: string;
    model: string;
    year: number;
    price: string;
    miles: number;
    status: 'pending' | 'approved' | 'rejected';
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    created_at: string;
    images: string[] | null;
    main_image_index: number;
    vehicle_type: string;
    state: string;
    city: string;
}

interface PaginatedListings {
    data: CarListing[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    listings: PaginatedListings;
    filters: { status?: string; search?: string };
}

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
};

const STATUS_ICONS = {
    pending: Clock,
    approved: CheckCircle2,
    rejected: XCircle,
};

export default function CarListings({ listings, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    function applyFilters(overrides: Record<string, string> = {}) {
        const params: Record<string, string> = {
            search,
            status: statusFilter,
            ...overrides,
        };
        Object.keys(params).forEach((k) => {
            if (!params[k]) delete params[k];
        });
        router.get('/admin/car-listings', params, { preserveState: true, replace: true });
    }

    function handleApprove(id: number) {
        if (confirm('Approve this listing?')) {
            router.patch(`/admin/car-listings/${id}/approve`);
        }
    }

    function handleReject(id: number) {
        if (confirm('Reject this listing?')) {
            router.patch(`/admin/car-listings/${id}/reject`);
        }
    }

    function handleDelete(id: number) {
        if (confirm('Are you sure you want to delete this listing? This cannot be undone.')) {
            router.delete(`/admin/car-listings/${id}`);
        }
    }

    const pendingCount = listings.data.filter((l) => l.status === 'pending').length;

    return (
        <>
            <Head title="Manage Car Listings" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Car Listings</h1>
                        <p className="text-sm text-gray-500">
                            Manage all vehicle listings — {listings.total} total
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {pendingCount > 0 && (
                            <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800">
                                <Clock className="h-4 w-4" />
                                {pendingCount} pending
                            </div>
                        )}
                        <Link
                            href="/admin/car-listings/create"
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:brightness-110"
                            style={{ backgroundColor: '#F26B5E' }}
                        >
                            <Plus className="h-4 w-4" />
                            Add Listing
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, make, model, VIN, seller..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                applyFilters({ status: e.target.value });
                            }}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <button
                            onClick={() => applyFilters()}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                        >
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Vehicle</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Seller</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {listings.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center">
                                            <Car className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-3 text-sm text-gray-500">No listings found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    listings.data.map((listing) => {
                                        const StatusIcon = STATUS_ICONS[listing.status];
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
                                                                {listing.year} {listing.make} {listing.model} &bull; {listing.vehicle_type}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-gray-900">
                                                    ${Number(listing.price).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-gray-900">{listing.first_name} {listing.last_name}</p>
                                                    <p className="text-xs text-gray-500">{listing.email}</p>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {listing.city}, {listing.state}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[listing.status]}`}>
                                                        <StatusIcon className="h-3 w-3" />
                                                        {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(listing.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link
                                                            href={`/admin/car-listings/${listing.id}`}
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                                                            title="View"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/admin/car-listings/${listing.id}/edit`}
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-orange-600"
                                                            title="Edit"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                        {listing.status !== 'approved' && (
                                                            <button
                                                                onClick={() => handleApprove(listing.id)}
                                                                className="rounded-lg p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
                                                                title="Approve"
                                                            >
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        {listing.status !== 'rejected' && (
                                                            <button
                                                                onClick={() => handleReject(listing.id)}
                                                                className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                                title="Reject"
                                                            >
                                                                <XCircle className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(listing.id)}
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {listings.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-500">
                                Page {listings.current_page} of {listings.last_page} ({listings.total} listings)
                            </p>
                            <div className="flex gap-1">
                                {listings.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        className={`rounded-lg px-3 py-1.5 text-sm transition ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                  ? 'text-gray-600 hover:bg-gray-100'
                                                  : 'cursor-not-allowed text-gray-300'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

CarListings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Car Listings', href: '/admin/car-listings' },
    ],
};
