import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Trash2,
    Pencil,
    Car,
    Calendar,
    Gauge,
    Palette,
    Cog,
    Hash,
    MapPin,
    User,
    Mail,
    Phone,
    Clock,
    DollarSign,
} from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';

type ActionKind = 'approve' | 'reject' | 'delete';

interface CarListing {
    id: number;
    title: string;
    state: string;
    city: string;
    make: string;
    model: string;
    year: number;
    price: string;
    miles: number;
    exterior_color: string;
    interior_color: string;
    drive: string;
    vin: string | null;
    features: string | null;
    transmission: string;
    vehicle_type: string;
    description: string | null;
    images: string[] | null;
    main_image_index: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}

interface Props {
    listing: CarListing;
}

const STATUS_STYLES = {
    pending: { bg: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Pending Review' },
    approved: { bg: 'bg-green-100 text-green-800 border-green-300', label: 'Approved' },
    rejected: { bg: 'bg-red-100 text-red-800 border-red-300', label: 'Rejected' },
};

export default function ShowCarListing({ listing }: Props) {
    const [selectedImage, setSelectedImage] = useState(listing.main_image_index ?? 0);
    const [pending, setPending] = useState<ActionKind | null>(null);
    const [processing, setProcessing] = useState(false);
    const status = STATUS_STYLES[listing.status];

    function handleApprove() {
        setPending('approve');
    }

    function handleReject() {
        setPending('reject');
    }

    function handleDelete() {
        setPending('delete');
    }

    function runPending() {
        if (!pending) return;
        setProcessing(true);
        const done = () => {
            setProcessing(false);
            setPending(null);
        };
        if (pending === 'approve') {
            router.patch(`/admin/car-listings/${listing.id}/approve`, {}, { onFinish: done });
        } else if (pending === 'reject') {
            router.patch(`/admin/car-listings/${listing.id}/reject`, {}, { onFinish: done });
        } else {
            router.delete(`/admin/car-listings/${listing.id}`, { onFinish: done });
        }
    }

    const details = [
        { icon: Calendar, label: 'Year', value: listing.year },
        { icon: Car, label: 'Make', value: listing.make },
        { icon: Car, label: 'Model', value: listing.model },
        { icon: Cog, label: 'Type', value: listing.vehicle_type },
        { icon: Gauge, label: 'Miles', value: `${Number(listing.miles).toLocaleString()} mi` },
        { icon: Cog, label: 'Transmission', value: listing.transmission },
        { icon: Cog, label: 'Drive', value: listing.drive },
        { icon: Palette, label: 'Exterior', value: listing.exterior_color },
        { icon: Palette, label: 'Interior', value: listing.interior_color },
        { icon: Hash, label: 'VIN', value: listing.vin || 'N/A' },
    ];

    return (
        <>
            <Head title={`${listing.title} — Admin`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Top Bar */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/car-listings"
                            className="rounded-lg border border-gray-300 p-2 transition hover:bg-gray-100"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-gray-900">{listing.title}</h1>
                            <p className="text-sm text-gray-500">
                                Listed {new Date(listing.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${status.bg}`}>
                            {status.label}
                        </span>
                        <Link
                            href={`/admin/car-listings/${listing.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Link>
                        {listing.status !== 'approved' && (
                            <button
                                onClick={handleApprove}
                                className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Approve
                            </button>
                        )}
                        {listing.status !== 'rejected' && (
                            <button
                                onClick={handleReject}
                                className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject
                            </button>
                        )}
                        <button
                            onClick={handleDelete}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column — Images & Description */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        {/* Image Gallery */}
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <div className="aspect-[16/10] w-full bg-gray-100">
                                {listing.images && listing.images.length > 0 ? (
                                    <img
                                        src={`/storage/${listing.images[selectedImage]}`}
                                        alt={listing.title}
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <Car className="h-16 w-16 text-gray-300" />
                                        <p className="ml-3 text-gray-400">No images uploaded</p>
                                    </div>
                                )}
                            </div>
                            {listing.images && listing.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto border-t border-gray-200 p-3">
                                    {listing.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImage(i)}
                                            className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${
                                                selectedImage === i
                                                    ? 'border-blue-500'
                                                    : 'border-transparent opacity-60 hover:opacity-100'
                                            }`}
                                        >
                                            <img src={`/storage/${img}`} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {listing.description && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Description</h3>
                                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{listing.description}</p>
                            </div>
                        )}

                        {/* Features */}
                        {listing.features && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {listing.features.split(',').map((f, i) => (
                                        <span
                                            key={i}
                                            className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                                        >
                                            {f.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column — Details & Seller Info */}
                    <div className="flex flex-col gap-6">
                        {/* Price Card */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-6 w-6 text-green-600" />
                                <span className="text-3xl font-bold text-gray-900">
                                    ${Number(listing.price).toLocaleString()}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{listing.city}, {listing.state}</p>
                        </div>

                        {/* Vehicle Details */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Vehicle Details</h3>
                            <div className="space-y-3">
                                {details.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <d.icon className="h-4 w-4" />
                                            {d.label}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{d.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Seller Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {listing.first_name} {listing.last_name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <a href={`mailto:${listing.email}`} className="hover:text-blue-600">{listing.email}</a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone className="h-4 w-4 text-gray-400" />
                                    <a href={`tel:${listing.phone}`} className="hover:text-blue-600">{listing.phone}</a>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <MapPin className="h-4 w-4 text-gray-400" />
                                    {listing.city}, {listing.state}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    Submitted {new Date(listing.created_at).toLocaleDateString('en-US')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={pending !== null}
                onOpenChange={(o) => !o && !processing && setPending(null)}
                loading={processing}
                tone={pending === 'approve' ? 'success' : 'danger'}
                title={
                    pending === 'approve'
                        ? 'Approve this listing?'
                        : pending === 'reject'
                            ? 'Reject this listing?'
                            : 'Delete this listing?'
                }
                description={
                    pending === 'approve'
                        ? "It will become visible to buyers on the public car listings page."
                        : pending === 'reject'
                            ? 'It will be marked rejected and hidden from the public site. You can restore it later by editing the status.'
                            : 'This permanently removes the listing and its images. This action cannot be undone.'
                }
                confirmLabel={pending === 'approve' ? 'Approve' : pending === 'reject' ? 'Reject' : 'Delete'}
                onConfirm={runPending}
            />
        </>
    );
}

ShowCarListing.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Car Listings', href: '/admin/car-listings' },
        { title: 'Listing Details', href: '#' },
    ],
};
