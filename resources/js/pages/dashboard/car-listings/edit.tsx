import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, X, Star } from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';

const ACCENT = '#F26B5E';

const US_STATES = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
    'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
    'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
    'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
    'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
    'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
    'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];
const MAKES = [
    'Acura','Audi','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ford','GMC',
    'Honda','Hyundai','Infiniti','Jaguar','Jeep','Kia','Land Rover','Lexus','Lincoln',
    'Mazda','Mercedes-Benz','Mitsubishi','Nissan','Porsche','Ram','Subaru','Tesla',
    'Toyota','Volkswagen','Volvo',
];
const YEARS = Array.from({ length: 30 }, (_, i) => 2026 - i);
const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'];
const VEHICLE_TYPES = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Van', 'Wagon', 'Crossover'];
const DRIVES = ['FWD', 'RWD', 'AWD', '4WD'];

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const selectClass = 'w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

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
    video_url: string | null;
    images: string[] | null;
    main_image_index: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: 'pending' | 'approved' | 'rejected';
}

interface Props {
    listing: CarListing;
}

export default function EditCarListing({ listing }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newPreviews, setNewPreviews] = useState<string[]>([]);
    const [existingImages] = useState<string[]>(listing.images || []);
    const [replaceImages, setReplaceImages] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: listing.title,
        state: listing.state,
        city: listing.city,
        make: listing.make,
        model: listing.model,
        year: String(listing.year),
        price: listing.price,
        miles: String(listing.miles),
        exterior_color: listing.exterior_color,
        interior_color: listing.interior_color,
        drive: listing.drive,
        vin: listing.vin || '',
        features: listing.features || '',
        transmission: listing.transmission,
        vehicle_type: listing.vehicle_type,
        description: listing.description || '',
        video_url: listing.video_url || '',
        first_name: listing.first_name,
        last_name: listing.last_name,
        email: listing.email,
        phone: listing.phone,
        status: listing.status,
        main_image_index: listing.main_image_index ?? 0,
        images: [] as File[],
    });

    function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (data.images.length + files.length > 12) { alert('Max 12 images.'); return; }
        const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);
        if (oversized.length > 0) { alert('Max 5MB per image.'); return; }
        setData('images', [...data.images, ...files]);
        setNewPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
        if (!replaceImages) {
            setData('main_image_index', 0);
            setReplaceImages(true);
        }
    }

    function removeNewImage(index: number) {
        setData('images', data.images.filter((_, i) => i !== index));
        URL.revokeObjectURL(newPreviews[index]);
        setNewPreviews((prev) => prev.filter((_, i) => i !== index));
        if (data.main_image_index === index) {
            setData('main_image_index', 0);
        } else if (data.main_image_index > index) {
            setData('main_image_index', data.main_image_index - 1);
        }
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(`/admin/car-listings/${listing.id}`, { forceFormData: true });
    }

    return (
        <>
            <Head title={`Edit: ${listing.title}`} />

            <div className="mb-6 flex items-center gap-3">
                <Link href={`/admin/car-listings/${listing.id}`} className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100">
                    <ArrowLeft className="h-4 w-4 text-gray-600" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Edit Listing</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Info */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-base font-semibold text-gray-900">Vehicle Information</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className={labelClass}>Listing Title</label>
                            <input type="text" className={inputClass} value={data.title} onChange={(e) => setData('title', e.target.value)} />
                            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>State</label>
                            <select className={selectClass} value={data.state} onChange={(e) => setData('state', e.target.value)}>
                                <option value="">Select State</option>
                                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>City</label>
                            <input type="text" className={inputClass} value={data.city} onChange={(e) => setData('city', e.target.value)} />
                            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Make</label>
                            <input
                                type="text"
                                className={inputClass}
                                placeholder="e.g. Toyota, Lamborghini"
                                list="make-suggestions-edit"
                                value={data.make}
                                onChange={(e) => setData('make', e.target.value)}
                            />
                            <datalist id="make-suggestions-edit">
                                {MAKES.map((m) => <option key={m} value={m} />)}
                            </datalist>
                            {errors.make && <p className="mt-1 text-xs text-red-500">{errors.make}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Model</label>
                            <input type="text" className={inputClass} value={data.model} onChange={(e) => setData('model', e.target.value)} />
                            {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Year</label>
                            <select className={selectClass} value={data.year} onChange={(e) => setData('year', e.target.value)}>
                                <option value="">Select Year</option>
                                {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                            </select>
                            {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Price</label>
                            <input type="number" className={inputClass} value={data.price} onChange={(e) => setData('price', e.target.value)} />
                            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Miles</label>
                            <input type="number" className={inputClass} value={data.miles} onChange={(e) => setData('miles', e.target.value)} />
                            {errors.miles && <p className="mt-1 text-xs text-red-500">{errors.miles}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Exterior Color</label>
                            <input type="text" className={inputClass} value={data.exterior_color} onChange={(e) => setData('exterior_color', e.target.value)} />
                            {errors.exterior_color && <p className="mt-1 text-xs text-red-500">{errors.exterior_color}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Interior Color</label>
                            <input type="text" className={inputClass} value={data.interior_color} onChange={(e) => setData('interior_color', e.target.value)} />
                            {errors.interior_color && <p className="mt-1 text-xs text-red-500">{errors.interior_color}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Drive</label>
                            <select className={selectClass} value={data.drive} onChange={(e) => setData('drive', e.target.value)}>
                                <option value="">Select Drive</option>
                                {DRIVES.map((d) => <option key={d} value={d}>{d}</option>)}
                            </select>
                            {errors.drive && <p className="mt-1 text-xs text-red-500">{errors.drive}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>VIN</label>
                            <input type="text" className={inputClass} maxLength={17} value={data.vin} onChange={(e) => setData('vin', e.target.value)} />
                        </div>
                        <div>
                            <label className={labelClass}>Transmission</label>
                            <select className={selectClass} value={data.transmission} onChange={(e) => setData('transmission', e.target.value)}>
                                <option value="">Select Transmission</option>
                                {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {errors.transmission && <p className="mt-1 text-xs text-red-500">{errors.transmission}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Vehicle Type</label>
                            <select className={selectClass} value={data.vehicle_type} onChange={(e) => setData('vehicle_type', e.target.value)}>
                                <option value="">Select Type</option>
                                {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            {errors.vehicle_type && <p className="mt-1 text-xs text-red-500">{errors.vehicle_type}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Status</label>
                            <select className={selectClass} value={data.status} onChange={(e) => setData('status', e.target.value as 'pending' | 'approved' | 'rejected')}>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className={labelClass}>Features</label>
                            <input type="text" className={inputClass} placeholder="Separate with commas" value={data.features} onChange={(e) => setData('features', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className={labelClass}>Description</label>
                            <textarea className={`${inputClass} min-h-[100px] resize-y`} value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className={labelClass}>YouTube Video URL (optional)</label>
                            <input type="url" className={inputClass} placeholder="https://www.youtube.com/watch?v=..." value={data.video_url} onChange={(e) => setData('video_url', e.target.value)} />
                            {errors.video_url && <p className="mt-1 text-xs text-red-500">{errors.video_url}</p>}
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold text-gray-900">Images</h2>
                        <p className="text-xs text-gray-500">Click the star to set main image</p>
                    </div>

                    {/* Existing images */}
                    {existingImages.length > 0 && !replaceImages && (
                        <div className="mb-4">
                            <p className="mb-2 text-sm text-gray-500">Current images ({existingImages.length})</p>
                            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                                {existingImages.map((img, i) => {
                                    const isMain = data.main_image_index === i;
                                    return (
                                        <div key={i} className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${isMain ? 'border-[#F26B5E]' : 'border-gray-200'}`}>
                                            <img src={`/storage/${img}`} alt="" className="h-full w-full object-cover" />
                                            {isMain && (
                                                <div className="absolute top-1 left-1 rounded-full bg-[#F26B5E] px-2 py-0.5 text-[10px] font-semibold text-white">
                                                    MAIN
                                                </div>
                                            )}
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

                    {/* New image uploads */}
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                        {newPreviews.map((src, i) => {
                            const isMain = replaceImages && data.main_image_index === i;
                            return (
                                <div key={i} className={`group relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${isMain ? 'border-[#F26B5E]' : 'border-gray-200'}`}>
                                    <img src={src} alt="" className="h-full w-full object-cover" />
                                    {isMain && (
                                        <div className="absolute top-1 left-1 rounded-full bg-[#F26B5E] px-2 py-0.5 text-[10px] font-semibold text-white">
                                            MAIN
                                        </div>
                                    )}
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
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-[#F26B5E] hover:bg-[#F26B5E]/5">
                            <Upload className="mb-1 h-5 w-5 text-gray-400" />
                            <span className="text-xs text-gray-500">Upload</span>
                        </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                </div>

                {/* Seller Info */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-base font-semibold text-gray-900">Seller Information</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>First Name</label>
                            <input type="text" className={inputClass} value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                            {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Last Name</label>
                            <input type="text" className={inputClass} value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input type="tel" className={inputClass} value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link href={`/admin/car-listings/${listing.id}`} className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={processing} className="rounded-lg px-5 py-2.5 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </>
    );
}

EditCarListing.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Car Listings', href: '/admin/car-listings' },
        { title: 'Edit', href: '#' },
    ],
};
