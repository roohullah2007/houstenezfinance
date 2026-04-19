import { Head, Link, router } from '@inertiajs/react';
import {
    ArrowLeft,
    Pencil,
    Trash2,
    Home,
    Bed,
    Bath,
    Ruler,
    Calendar,
    Tag,
    MapPin,
    Building,
    DollarSign,
    CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';

interface Listing {
    id: number;
    slug: string;
    title: string;
    developer: string | null;
    property_type: string;
    listing_type: 'sale' | 'rent';
    price: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    subdivision: string | null;
    latitude: string | null;
    longitude: string | null;
    bedrooms: number;
    full_bathrooms: number;
    half_bathrooms: number;
    square_feet: number | null;
    lot_size: number | null;
    year_built: number | null;
    description: string | null;
    features: string[] | null;
    images: string[] | null;
    main_image_index: number;
    status: 'pending' | 'active' | 'sold';
    created_at: string;
}

interface Props {
    listing: Listing;
}

const STATUS_STYLES = {
    pending: { bg: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Pending' },
    active: { bg: 'bg-green-100 text-green-800 border-green-300', label: 'Active' },
    sold: { bg: 'bg-gray-200 text-gray-700 border-gray-300', label: 'Sold' },
};

export default function ShowRealEstateListing({ listing }: Props) {
    const [selectedImage, setSelectedImage] = useState(listing.main_image_index ?? 0);
    const status = STATUS_STYLES[listing.status];

    function handleDelete() {
        if (confirm('Delete this listing? This cannot be undone.')) {
            router.delete(`/admin/real-estate-listings/${listing.id}`);
        }
    }

    function handleMarkSold() {
        if (confirm('Mark this listing as sold?')) {
            router.patch(`/admin/real-estate-listings/${listing.id}/sold`);
        }
    }

    function handleMarkActive() {
        router.patch(`/admin/real-estate-listings/${listing.id}/active`);
    }

    const specs = [
        { icon: Bed, label: 'Bedrooms', value: listing.bedrooms },
        { icon: Bath, label: 'Bathrooms', value: listing.half_bathrooms > 0 ? `${listing.full_bathrooms}.${listing.half_bathrooms > 0 ? '5' : '0'}` : listing.full_bathrooms },
        ...(listing.square_feet ? [{ icon: Ruler, label: 'Square Feet', value: `${listing.square_feet.toLocaleString()} sqft` }] : []),
        ...(listing.lot_size ? [{ icon: Ruler, label: 'Lot Size', value: `${listing.lot_size.toLocaleString()} sqft` }] : []),
        ...(listing.year_built ? [{ icon: Calendar, label: 'Year Built', value: listing.year_built }] : []),
        { icon: Tag, label: 'Property Type', value: listing.property_type },
        { icon: Tag, label: 'Listing Type', value: listing.listing_type === 'sale' ? 'For Sale' : 'For Rent' },
        ...(listing.developer ? [{ icon: Building, label: 'Developer', value: listing.developer }] : []),
    ];

    return (
        <>
            <Head title={`${listing.title} — Admin`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/real-estate-listings" className="rounded-lg border border-gray-300 p-2 transition hover:bg-gray-100">
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
                            href={`/real-estate/${listing.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            View Public
                        </Link>
                        <Link
                            href={`/admin/real-estate-listings/${listing.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
                        >
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Link>
                        {listing.status === 'active' ? (
                            <button onClick={handleMarkSold} className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600">
                                <Tag className="h-4 w-4" />
                                Mark Sold
                            </button>
                        ) : (
                            <button onClick={handleMarkActive} className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">
                                <CheckCircle2 className="h-4 w-4" />
                                Mark Active
                            </button>
                        )}
                        <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                            <div className="aspect-[16/10] w-full bg-gray-100">
                                {listing.images && listing.images.length > 0 ? (
                                    <img src={`/storage/${listing.images[selectedImage]}`} alt={listing.title} className="h-full w-full object-contain" />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <Home className="h-16 w-16 text-gray-300" />
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
                                            className={`h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition ${selectedImage === i ? 'border-blue-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        >
                                            <img src={`/storage/${img}`} alt="" className="h-full w-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {listing.description && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Description</h3>
                                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{listing.description}</p>
                            </div>
                        )}

                        {listing.features && listing.features.length > 0 && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">Features</h3>
                                <div className="flex flex-wrap gap-2">
                                    {listing.features.map((f) => (
                                        <span key={f} className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-6 w-6 text-green-600" />
                                <span className="text-3xl font-bold text-gray-900">
                                    ${Number(listing.price).toLocaleString()}
                                    {listing.listing_type === 'rent' && <span className="text-lg font-medium text-gray-500">/mo</span>}
                                </span>
                            </div>
                            <p className="mt-2 flex items-start gap-1 text-sm text-gray-500">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>
                                    {listing.address}<br />
                                    {listing.city}, {listing.state} {listing.zip}
                                    {listing.subdivision && <><br />{listing.subdivision}</>}
                                </span>
                            </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Property Specs</h3>
                            <div className="space-y-3">
                                {specs.map((s, i) => (
                                    <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <s.icon className="h-4 w-4" />
                                            {s.label}
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">{s.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {(listing.latitude && listing.longitude) && (
                            <div className="rounded-xl border border-gray-200 bg-white p-6">
                                <h3 className="mb-2 text-lg font-semibold text-gray-900">Map Location</h3>
                                <p className="text-sm text-gray-500">
                                    {listing.latitude}, {listing.longitude}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ShowRealEstateListing.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Real Estate Listings', href: '/admin/real-estate-listings' },
        { title: 'Listing Details', href: '#' },
    ],
};
