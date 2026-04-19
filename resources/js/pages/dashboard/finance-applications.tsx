import { Head, Link, router } from '@inertiajs/react';
import {
    Search,
    Eye,
    Trash2,
    Filter,
    Clock,
    CheckCircle2,
    XCircle,
    FileText,
} from 'lucide-react';
import { useState } from 'react';

const ACCENT = '#F26B5E';

interface AppRow {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    current_city: string;
    current_state: string;
    monthly_income: string | null;
    status: 'new' | 'reviewing' | 'approved' | 'declined';
    created_at: string;
    vehicle_of_interest: string | null;
}

interface Paginated {
    data: AppRow[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    applications: Paginated;
    filters: { status?: string; search?: string };
    counts: { new: number; reviewing: number; approved: number; declined: number };
}

const STATUS_STYLES = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    reviewing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    approved: 'bg-green-100 text-green-800 border-green-200',
    declined: 'bg-red-100 text-red-800 border-red-200',
};

export default function FinanceApplications({ applications, filters, counts }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    function applyFilters(overrides: Record<string, string> = {}) {
        const params: Record<string, string> = { search, status: statusFilter, ...overrides };
        Object.keys(params).forEach((k) => { if (!params[k]) delete params[k]; });
        router.get('/admin/finance-applications', params, { preserveState: true, replace: true });
    }

    function handleDelete(id: number, name: string) {
        if (confirm(`Delete application for ${name}? This cannot be undone.`)) {
            router.delete(`/admin/finance-applications/${id}`);
        }
    }

    return (
        <>
            <Head title="Finance Applications" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Finance Applications</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Review credit applications — {applications.total} total
                        </p>
                    </div>
                </div>

                {/* Status cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                        { key: 'new', label: 'New', value: counts.new, icon: Clock, color: 'text-blue-600 bg-blue-100' },
                        { key: 'reviewing', label: 'Reviewing', value: counts.reviewing, icon: FileText, color: 'text-yellow-600 bg-yellow-100' },
                        { key: 'approved', label: 'Approved', value: counts.approved, icon: CheckCircle2, color: 'text-green-600 bg-green-100' },
                        { key: 'declined', label: 'Declined', value: counts.declined, icon: XCircle, color: 'text-red-600 bg-red-100' },
                    ].map((c) => (
                        <button
                            key={c.key}
                            type="button"
                            onClick={() => { setStatusFilter(c.key); applyFilters({ status: c.key }); }}
                            className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-left transition hover:shadow-sm ${statusFilter === c.key ? 'border-[#F26B5E]' : 'border-gray-200'}`}
                        >
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.color}`}>
                                <c.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-gray-900">{c.value}</p>
                                <p className="text-xs text-gray-500">{c.label}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, city..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">All Status</option>
                            <option value="new">New</option>
                            <option value="reviewing">Reviewing</option>
                            <option value="approved">Approved</option>
                            <option value="declined">Declined</option>
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
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Applicant</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Contact</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Location</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Income / mo</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Vehicle</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Submitted</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {applications.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center">
                                            <FileText className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-3 text-sm text-gray-500">No finance applications yet</p>
                                        </td>
                                    </tr>
                                ) : (
                                    applications.data.map((a) => (
                                        <tr key={a.id} className="transition hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{a.first_name} {a.last_name}</td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-900">{a.email}</p>
                                                <p className="text-xs text-gray-500">{a.phone}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{a.current_city}, {a.current_state}</td>
                                            <td className="px-4 py-3 text-gray-600">{a.monthly_income ? `$${Number(a.monthly_income).toLocaleString()}` : '—'}</td>
                                            <td className="px-4 py-3 max-w-[180px] truncate text-gray-600">{a.vehicle_of_interest || '—'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[a.status]}`}>
                                                    {a.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">{new Date(a.created_at).toLocaleDateString('en-US')}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/finance-applications/${a.id}`}
                                                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600"
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(a.id, `${a.first_name} ${a.last_name}`)}
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

                    {applications.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-500">
                                Page {applications.current_page} of {applications.last_page} ({applications.total} applications)
                            </p>
                            <div className="flex gap-1">
                                {applications.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        className={`rounded-lg px-3 py-1.5 text-sm transition ${
                                            link.active ? 'bg-blue-600 text-white' : link.url ? 'text-gray-600 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'
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

FinanceApplications.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Finance Applications', href: '/admin/finance-applications' },
    ],
};
