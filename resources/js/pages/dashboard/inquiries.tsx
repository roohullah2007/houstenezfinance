import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Eye,
    Trash2,
    MessageSquare,
    Car,
    Filter,
    Mail,
    Phone,
} from 'lucide-react';
import { useState } from 'react';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    status: 'new' | 'contacted' | 'closed';
    created_at: string;
    car_listing: {
        id: number;
        title: string;
        make: string;
        model: string;
        year: number;
        images: string[] | null;
        main_image_index: number;
    } | null;
}

interface PaginatedInquiries {
    data: Inquiry[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    inquiries: PaginatedInquiries;
    filters: { status?: string; search?: string };
}

const STATUS_STYLES = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function Inquiries({ inquiries, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    function applyFilters(overrides: Record<string, string> = {}) {
        const params: Record<string, string> = { search, status: statusFilter, ...overrides };
        Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
        router.get('/admin/inquiries', params, { preserveState: true, replace: true });
    }

    function handleDelete(id: number) {
        if (confirm('Delete this inquiry?')) {
            router.delete(`/admin/inquiries/${id}`);
        }
    }

    const newCount = inquiries.data.filter((i) => i.status === 'new').length;

    return (
        <>
            <Head title="Inquiries" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Inquiries</h1>
                        <p className="text-sm text-gray-500">Manage buyer inquiries — {inquiries.total} total</p>
                    </div>
                    {newCount > 0 && (
                        <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-800">
                            <MessageSquare className="h-4 w-4" />
                            {newCount} new
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, message..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-[#F26B5E] focus:outline-none focus:ring-1 focus:ring-[#F26B5E]"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 focus:border-[#F26B5E] focus:outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                        </select>
                        <button
                            onClick={() => applyFilters()}
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
                            style={{ backgroundColor: '#F26B5E' }}
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
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Listing</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Buyer</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Contact</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {inquiries.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-12 text-center">
                                            <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-3 text-sm text-gray-500">No inquiries yet</p>
                                        </td>
                                    </tr>
                                ) : (
                                    inquiries.data.map((inquiry) => {
                                        const listing = inquiry.car_listing;
                                        const mainImg = listing?.images && listing.images.length > 0
                                            ? listing.images[listing.main_image_index ?? 0] ?? listing.images[0]
                                            : null;
                                        return (
                                            <tr key={inquiry.id} className={`transition hover:bg-gray-50 ${inquiry.status === 'new' ? 'bg-blue-50/30' : ''}`}>
                                                <td className="px-4 py-3">
                                                    {listing ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                                                {mainImg ? (
                                                                    <img src={`/storage/${mainImg}`} alt="" className="h-full w-full object-cover" />
                                                                ) : (
                                                                    <Car className="h-4 w-4 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{listing.title}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {listing.year} {listing.make} {listing.model}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 italic">Deleted listing</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className={`${inquiry.status === 'new' ? 'font-semibold' : ''} text-gray-900`}>{inquiry.name}</p>
                                                    <p className="max-w-xs truncate text-xs text-gray-500">{inquiry.message}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600">
                                                        <Mail className="h-3 w-3" />
                                                        {inquiry.email}
                                                    </a>
                                                    {inquiry.phone && (
                                                        <a href={`tel:${inquiry.phone}`} className="mt-0.5 flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600">
                                                            <Phone className="h-3 w-3" />
                                                            {inquiry.phone}
                                                        </a>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[inquiry.status]}`}>
                                                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {new Date(inquiry.created_at).toLocaleDateString('en-US')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={`/admin/inquiries/${inquiry.id}`} className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600" title="View">
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <button onClick={() => handleDelete(inquiry.id)} className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600" title="Delete">
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

                    {inquiries.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-500">Page {inquiries.current_page} of {inquiries.last_page} ({inquiries.total} total)</p>
                            <div className="flex gap-1">
                                {inquiries.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        className={`rounded-lg px-3 py-1.5 text-sm transition ${
                                            link.active
                                                ? 'text-white'
                                                : link.url ? 'text-gray-600 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'
                                        }`}
                                        style={link.active ? { backgroundColor: '#F26B5E' } : undefined}
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

Inquiries.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Inquiries', href: '/admin/inquiries' },
    ],
};
