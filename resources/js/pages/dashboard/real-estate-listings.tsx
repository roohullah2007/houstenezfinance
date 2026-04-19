import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Eye,
    Trash2,
    Home,
    Filter,
    Plus,
    Pencil,
    CheckCircle2,
    Tag,
} from 'lucide-react';
import { useState } from 'react';

const ACCENT = '#F26B5E';

interface Listing {
    id: number;
    slug: string;
    title: string;
    property_type: string;
    listing_type: 'sale' | 'rent';
    price: string;
    city: string;
    state: string;
    bedrooms: number;
    full_bathrooms: number;
    square_feet: number | null;
    status: 'pending' | 'active' | 'sold';
    images: string[] | null;
    main_image_index: number;
    created_at: string;
}

interface PaginatedListings {
    data: Listing[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    listings: PaginatedListings;
    filters: { status?: string; search?: string };
}

const STATUS_STYLES = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    active: 'bg-green-100 text-green-800 border-green-200',
    sold: 'bg-gray-200 text-gray-700 border-gray-300',
};

export default function RealEstateListings({ listings, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    function applyFilters(overrides: Record<string, string> = {}) {
        const params: Record<string, string> = {
            search,
            status: statusFilter,
            ...overrides,
        };
        Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
        router.get('/admin/real-estate-listings', params, { preserveState: true, replace: true });
    }

    function handleDelete(id: number, title: string) {
        if (confirm(`Delete "${title}"? This cannot be undone.`)) {
            router.delete(`/admin/real-estate-listings/${id}`);
        }
    }

    function handleMarkSold(id: number) {
        if (confirm('Mark this listing as sold?')) {
            router.patch(`/admin/real-estate-listings/${id}/sold`);
        }
    }

    function handleMarkActive(id: number) {
        router.patch(`/admin/real-estate-listings/${id}/active`);
    }

    return (
        <>
            <Head title="Real Estate Listings" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Real Estate Listings</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Manage all property listings — {listings.total} total
                        </p>
                    </div>
                    <Link
                        href="/admin/real-estate-listings/create"
                        className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:brightness-110"
                        style={{ backgroundColor: ACCENT }}
                    >
                        <Plus className="h-4 w-4" />
                        Create Listing
                    </Link>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, city, address, subdivision..."
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
                            <option value="active">Active</option>
                            <option value="sold">Sold</option>
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

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Property</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Specs</th>
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
                                            <Home className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-3 text-sm text-gray-500">No listings yet</p>
                                            <Link href="/admin/real-estate-listings/create" className="mt-4 inline-block text-sm font-medium text-[#F26B5E] hover:underline">
                                                Create your first listing →
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    listings.data.map((l) => (
                                        <tr key={l.id} className="transition hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                                        {l.images && l.images.length > 0 ? (
                                                            <img
                                                                src={`/storage/${l.images[l.main_image_index ?? 0] ?? l.images[0]}`}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <Home className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{l.title}</p>
                                                        <p className="text-xs text-gray-500 capitalize">
                                                            {l.property_type} · For {l.listing_type}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">
                                                ${Number(l.price).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {l.bedrooms}BD · {l.full_bathrooms}BA
                                                {l.square_feet ? ` · ${l.square_feet.toLocaleString()} sqft` : ''}
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {l.city}, {l.state}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[l.status]}`}>
                                                    {l.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(l.created_at).toLocaleDateString('en-US')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/real-estate-listings/${l.id}`}
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                                                        title="View"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/real-estate-listings/${l.id}/edit`}
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-orange-600"
                                                        title="Edit"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                    {l.status === 'active' ? (
                                                        <button
                                                            onClick={() => handleMarkSold(l.id)}
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                                            title="Mark as Sold"
                                                        >
                                                            <Tag className="h-4 w-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleMarkActive(l.id)}
                                                            className="rounded-lg p-2 text-gray-500 transition hover:bg-green-50 hover:text-green-600"
                                                            title="Mark Active"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(l.id, l.title)}
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

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

RealEstateListings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Real Estate Listings', href: '/admin/real-estate-listings' },
    ],
};
