import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, X, Star } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';

const ACCENT = '#F26B5E';

const PROPERTY_TYPES = ['Single Family', 'Townhouse', 'Condo', 'Multi-Family', 'Apartment', 'Land', 'Commercial', 'Other'];
const US_STATES = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
    'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
    'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
    'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
    'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
    'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];
const PROPERTY_FEATURES = [
    'Central AC', 'Central Heat', 'Fireplace', 'Swimming Pool', 'Hot Tub',
    'Garage', 'Covered Patio', 'Deck', 'Balcony', 'Walk-In Closet',
    'Hardwood Floors', 'Carpet', 'Tile Floors', 'Granite Countertops',
    'Stainless Steel Appliances', 'Updated Kitchen', 'Updated Bathroom',
    'Security System', 'Sprinkler System', 'Fenced Yard', 'Mature Trees',
    'Mountain View', 'Lakefront', 'Waterfront', 'Golf Course', 'Guest Quarters',
];

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const selectClass = 'w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

interface Listing {
    id: number;
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
}

interface Props {
    listing: Listing;
}

export default function EditRealEstateListing({ listing }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [existingImages] = useState<string[]>(listing.images || []);
    const [replaceImages, setReplaceImages] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: listing.title,
        developer: listing.developer || '',
        property_type: listing.property_type,
        listing_type: listing.listing_type,
        price: listing.price,
        address: listing.address,
        city: listing.city,
        state: listing.state,
        zip: listing.zip,
        subdivision: listing.subdivision || '',
        latitude: listing.latitude || '',
        longitude: listing.longitude || '',
        bedrooms: String(listing.bedrooms),
        full_bathrooms: String(listing.full_bathrooms),
        half_bathrooms: String(listing.half_bathrooms ?? 0),
        square_feet: listing.square_feet ? String(listing.square_feet) : '',
        lot_size: listing.lot_size ? String(listing.lot_size) : '',
        year_built: listing.year_built ? String(listing.year_built) : '',
        description: listing.description || '',
        features: listing.features || [],
        status: listing.status,
        main_image_index: listing.main_image_index ?? 0,
        images: [] as File[],
    });

    function handleFiles(files: File[]) {
        if (files.length === 0) return;
        if (data.images.length + files.length > 50) { alert('Max 50 images.'); return; }
        const oversized = files.filter((f) => f.size > 30 * 1024 * 1024);
        if (oversized.length > 0) { alert('Max 30MB per image.'); return; }
        const imgs = files.filter((f) => f.type.startsWith('image/'));
        setData('images', [...data.images, ...imgs]);
        setNewPreviews((prev) => [...prev, ...imgs.map((f) => URL.createObjectURL(f))]);
        if (!replaceImages) {
            setData('main_image_index', 0);
            setReplaceImages(true);
        }
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        handleFiles(Array.from(e.target.files || []));
        e.target.value = '';
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragOver(false);
        handleFiles(Array.from(e.dataTransfer.files));
    }

    function removeNewImage(index: number) {
        setData('images', data.images.filter((_, i) => i !== index));
        URL.revokeObjectURL(newPreviews[index]);
        setNewPreviews((prev) => prev.filter((_, i) => i !== index));
        if (data.main_image_index === index) setData('main_image_index', 0);
        else if (data.main_image_index > index) setData('main_image_index', data.main_image_index - 1);
    }

    function toggleFeature(feature: string) {
        setData('features', data.features.includes(feature)
            ? data.features.filter((f) => f !== feature)
            : [...data.features, feature]);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(`/admin/real-estate-listings/${listing.id}`, { forceFormData: true });
    }

    return (
        <>
            <Head title={`Edit: ${listing.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Link href={`/admin/real-estate-listings/${listing.id}`} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100">
                        <ArrowLeft className="h-4 w-4 text-gray-600" />
                    </Link>
                    <h1 className="text-xl font-semibold text-gray-900">Edit Property Listing</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Basic Information</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className={labelClass}>Property Title *</label>
                                <input type="text" className={inputClass} value={data.title} onChange={(e) => setData('title', e.target.value)} />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Developer / Builder</label>
                                <input type="text" className={inputClass} value={data.developer} onChange={(e) => setData('developer', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Property Type *</label>
                                <select className={selectClass} value={data.property_type} onChange={(e) => setData('property_type', e.target.value)}>
                                    <option value="">Select Type</option>
                                    {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                                {errors.property_type && <p className="mt-1 text-xs text-red-500">{errors.property_type}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Listing Type *</label>
                                <select className={selectClass} value={data.listing_type} onChange={(e) => setData('listing_type', e.target.value as 'sale' | 'rent')}>
                                    <option value="sale">For Sale</option>
                                    <option value="rent">For Rent</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>Listing Price *</label>
                                <input type="number" min={0} step={1000} className={inputClass} value={data.price} onChange={(e) => setData('price', e.target.value)} />
                                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Status</label>
                                <select className={selectClass} value={data.status} onChange={(e) => setData('status', e.target.value as 'pending' | 'active' | 'sold')}>
                                    <option value="active">Active (live on site)</option>
                                    <option value="pending">Pending (hidden)</option>
                                    <option value="sold">Sold</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Location</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className={labelClass}>Street Address *</label>
                                <input type="text" className={inputClass} value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>City *</label>
                                <input type="text" className={inputClass} value={data.city} onChange={(e) => setData('city', e.target.value)} />
                                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>State *</label>
                                <select className={selectClass} value={data.state} onChange={(e) => setData('state', e.target.value)}>
                                    <option value="">Select State</option>
                                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>ZIP Code *</label>
                                <input type="text" className={inputClass} value={data.zip} onChange={(e) => setData('zip', e.target.value)} />
                                {errors.zip && <p className="mt-1 text-xs text-red-500">{errors.zip}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Subdivision</label>
                                <input type="text" className={inputClass} value={data.subdivision} onChange={(e) => setData('subdivision', e.target.value)} />
                            </div>
                            <div className="sm:col-span-2 lg:col-span-3">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className={labelClass}>Latitude</label>
                                        <input type="text" className={inputClass} value={data.latitude} onChange={(e) => setData('latitude', e.target.value)} />
                                        {errors.latitude && <p className="mt-1 text-xs text-red-500">{errors.latitude}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Longitude</label>
                                        <input type="text" className={inputClass} value={data.longitude} onChange={(e) => setData('longitude', e.target.value)} />
                                        {errors.longitude && <p className="mt-1 text-xs text-red-500">{errors.longitude}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Property Details</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className={labelClass}>Bedrooms *</label>
                                <input type="number" min={0} max={20} className={inputClass} value={data.bedrooms} onChange={(e) => setData('bedrooms', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Full Bathrooms *</label>
                                <input type="number" min={0} max={20} className={inputClass} value={data.full_bathrooms} onChange={(e) => setData('full_bathrooms', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Half Bathrooms</label>
                                <input type="number" min={0} max={20} className={inputClass} value={data.half_bathrooms} onChange={(e) => setData('half_bathrooms', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Square Feet *</label>
                                <input type="number" min={0} className={inputClass} value={data.square_feet} onChange={(e) => setData('square_feet', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Lot Size (Sq Ft)</label>
                                <input type="number" min={0} className={inputClass} value={data.lot_size} onChange={(e) => setData('lot_size', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Year Built</label>
                                <input type="number" min={1800} max={2030} className={inputClass} value={data.year_built} onChange={(e) => setData('year_built', e.target.value)} />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Description</h2>
                        <label className={labelClass}>Property Description *</label>
                        <textarea className={`${inputClass} min-h-[160px] resize-y`} value={data.description} onChange={(e) => setData('description', e.target.value)} rows={8} />
                    </section>

                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <h2 className="mb-4 text-base font-semibold text-gray-900">Property Features</h2>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {PROPERTY_FEATURES.map((feature) => {
                                const active = data.features.includes(feature);
                                return (
                                    <label key={feature} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${active ? 'border-[#F26B5E] bg-[#F26B5E]/5 text-gray-900' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                                        <input type="checkbox" checked={active} onChange={() => toggleFeature(feature)} className="h-4 w-4 rounded border-gray-300 accent-[#F26B5E] focus:ring-2 focus:ring-[#F26B5E]/20" />
                                        {feature}
                                    </label>
                                );
                            })}
                        </div>
                    </section>

                    <section className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-semibold text-gray-900">Photos</h2>
                        </div>

                        {existingImages.length > 0 && !replaceImages && (
                            <div className="mb-4">
                                <p className="mb-2 text-sm text-gray-500">Current images ({existingImages.length})</p>
                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                                    {existingImages.map((img, i) => {
                                        const isMain = data.main_image_index === i;
                                        return (
                                            <div key={i} className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${isMain ? 'border-[#F26B5E]' : 'border-gray-200'}`}>
                                                <img src={`/storage/${img}`} alt="" className="h-full w-full object-cover" />
                                                {isMain && <div className="absolute top-1 left-1 rounded-full bg-[#F26B5E] px-2 py-0.5 text-[10px] font-semibold text-white">MAIN</div>}
                                                <button
                                                    type="button"
                                                    onClick={() => setData('main_image_index', i)}
                                                    className={`absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full ${isMain ? 'bg-[#F26B5E] text-white' : 'bg-white/90 text-gray-600 opacity-0 transition group-hover:opacity-100'}`}
                                                    title="Set as main image"
                                                >
                                                    <Star className="h-3 w-3" fill={isMain ? 'currentColor' : 'none'} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="mt-2 text-xs text-gray-400">Upload new images below to replace these.</p>
                            </div>
                        )}

                        {newPreviews.length > 0 && (
                            <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                                {newPreviews.map((src, i) => {
                                    const isMain = replaceImages && data.main_image_index === i;
                                    return (
                                        <div key={i} className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${isMain ? 'border-[#F26B5E]' : 'border-gray-200'}`}>
                                            <img src={src} alt="" className="h-full w-full object-cover" />
                                            {isMain && <div className="absolute top-1 left-1 rounded-full bg-[#F26B5E] px-2 py-0.5 text-[10px] font-semibold text-white">MAIN</div>}
                                            <button
                                                type="button"
                                                onClick={() => setData('main_image_index', i)}
                                                className={`absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full ${isMain ? 'bg-[#F26B5E] text-white' : 'bg-white/90 text-gray-600 opacity-0 transition group-hover:opacity-100'}`}
                                                title="Set as main image"
                                            >
                                                <Star className="h-3 w-3" fill={isMain ? 'currentColor' : 'none'} />
                                            </button>
                                            <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${dragOver ? 'border-[#F26B5E] bg-[#F26B5E]/5' : 'border-gray-300 bg-gray-50 hover:border-[#F26B5E] hover:bg-[#F26B5E]/5'}`}
                        >
                            <Upload className="mb-2 h-8 w-8 text-gray-400" />
                            <p className="text-sm font-medium text-gray-700">Drag &amp; drop new photos to replace existing</p>
                            <p className="mt-1 text-xs text-gray-500">JPG, PNG, GIF, WebP, or HEIC — max 30MB each</p>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleInput} />
                    </section>

                    <div className="flex justify-end gap-3">
                        <Link href={`/admin/real-estate-listings/${listing.id}`} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                        <button type="submit" disabled={processing} className="rounded-lg px-5 py-2.5 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditRealEstateListing.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Real Estate Listings', href: '/admin/real-estate-listings' },
        { title: 'Edit', href: '#' },
    ],
};
