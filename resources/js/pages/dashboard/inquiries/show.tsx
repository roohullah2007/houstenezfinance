import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Trash2,
    Mail,
    Phone,
    Clock,
    User,
    Car,
    CheckCircle2,
    MessageSquare,
    X,
} from 'lucide-react';

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
        price: string;
        images: string[] | null;
        main_image_index: number;
    } | null;
}

interface Props {
    inquiry: Inquiry;
}

const STATUS_STYLES = {
    new: 'bg-blue-100 text-blue-700 border-blue-200',
    contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    closed: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function ShowInquiry({ inquiry }: Props) {
    const listing = inquiry.car_listing;
    const mainImg = listing?.images && listing.images.length > 0
        ? listing.images[listing.main_image_index ?? 0] ?? listing.images[0]
        : null;

    function updateStatus(status: 'new' | 'contacted' | 'closed') {
        router.patch(`/admin/inquiries/${inquiry.id}/status`, { status });
    }

    function handleDelete() {
        if (confirm('Delete this inquiry?')) {
            router.delete(`/admin/inquiries/${inquiry.id}`);
        }
    }

    return (
        <>
            <Head title={`Inquiry from ${inquiry.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Top bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/inquiries" className="rounded-lg border border-gray-300 p-2 transition hover:bg-gray-100">
                            <ArrowLeft className="h-4 w-4 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Inquiry from {inquiry.name}</h1>
                            <p className="text-sm text-gray-500">
                                {new Date(inquiry.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${STATUS_STYLES[inquiry.status]}`}>
                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                        {inquiry.status !== 'contacted' && (
                            <button onClick={() => updateStatus('contacted')} className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600">
                                <CheckCircle2 className="h-4 w-4" />
                                Mark Contacted
                            </button>
                        )}
                        {inquiry.status !== 'closed' && (
                            <button onClick={() => updateStatus('closed')} className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700">
                                <X className="h-4 w-4" />
                                Close
                            </button>
                        )}
                        <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Message */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="mb-4 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-900">Message</h3>
                            </div>
                            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{inquiry.message}</p>
                        </div>

                        {/* Related listing */}
                        {listing && (
                            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
                                <h3 className="mb-4 text-lg font-semibold text-gray-900">About This Listing</h3>
                                <Link href={`/admin/car-listings/${listing.id}`} className="flex items-center gap-4 rounded-lg border border-gray-100 p-3 transition hover:bg-gray-50">
                                    <div className="flex h-20 w-28 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                                        {mainImg ? (
                                            <img src={`/storage/${mainImg}`} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <Car className="h-8 w-8 text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{listing.title}</p>
                                        <p className="text-sm text-gray-500">{listing.year} {listing.make} {listing.model}</p>
                                        <p className="mt-1 text-lg font-bold" style={{ color: '#F26B5E' }}>
                                            ${Number(listing.price).toLocaleString()}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sender details */}
                    <div>
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Buyer Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-white" style={{ backgroundColor: '#F26B5E' }}>
                                        <User className="h-5 w-5" />
                                    </div>
                                    <p className="font-medium text-gray-900">{inquiry.name}</p>
                                </div>
                                <a href={`mailto:${inquiry.email}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    {inquiry.email}
                                </a>
                                {inquiry.phone && (
                                    <a href={`tel:${inquiry.phone}`} className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        {inquiry.phone}
                                    </a>
                                )}
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    {new Date(inquiry.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="mt-6 space-y-2 border-t border-gray-100 pt-4">
                                <a
                                    href={`mailto:${inquiry.email}`}
                                    className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                                    style={{ backgroundColor: '#F26B5E' }}
                                >
                                    <Mail className="h-4 w-4" />
                                    Reply by Email
                                </a>
                                {inquiry.phone && (
                                    <a
                                        href={`tel:${inquiry.phone}`}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Call Buyer
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ShowInquiry.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Inquiries', href: '/admin/inquiries' },
        { title: 'View Inquiry', href: '#' },
    ],
};
