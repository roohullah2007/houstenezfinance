import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, X } from 'lucide-react';
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

export default function CreateCarListing() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        state: '',
        city: '',
        make: '',
        model: '',
        year: '',
        price: '',
        miles: '',
        exterior_color: '',
        interior_color: '',
        drive: '',
        vin: '',
        features: '',
        transmission: '',
        vehicle_type: '',
        description: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'approved',
        images: [] as File[],
    });

    function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        if (data.images.length + files.length > 12) { alert('Max 12 images.'); return; }
        const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);
        if (oversized.length > 0) { alert('Max 5MB per image.'); return; }
        setData('images', [...data.images, ...files]);
        setPreviewImages((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    }

    function removeImage(index: number) {
        setData('images', data.images.filter((_, i) => i !== index));
        URL.revokeObjectURL(previewImages[index]);
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/admin/car-listings', { forceFormData: true });
    }

    return (
        <>
            <Head title="Create Listing" />

            <div className="mb-6 flex items-center gap-3">
                <Link href="/admin/car-listings" className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100">
                    <ArrowLeft className="h-4 w-4 text-gray-600" />
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Create New Listing</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Info */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-base font-semibold text-gray-900">Vehicle Information</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className={labelClass}>Listing Title</label>
                            <input type="text" className={inputClass} placeholder="Enter listing title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
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
                            <input type="text" className={inputClass} placeholder="Enter city" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Make</label>
                            <select className={selectClass} value={data.make} onChange={(e) => { setData('make', e.target.value); setData('model', ''); }}>
                                <option value="">Select Make</option>
                                {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                            {errors.make && <p className="mt-1 text-xs text-red-500">{errors.make}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Model</label>
                            <input type="text" className={inputClass} placeholder="Enter model" value={data.model} onChange={(e) => setData('model', e.target.value)} />
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
                            <input type="number" className={inputClass} placeholder="Enter price" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                            {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Miles</label>
                            <input type="number" className={inputClass} placeholder="Enter miles" value={data.miles} onChange={(e) => setData('miles', e.target.value)} />
                            {errors.miles && <p className="mt-1 text-xs text-red-500">{errors.miles}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Exterior Color</label>
                            <input type="text" className={inputClass} placeholder="Enter exterior color" value={data.exterior_color} onChange={(e) => setData('exterior_color', e.target.value)} />
                            {errors.exterior_color && <p className="mt-1 text-xs text-red-500">{errors.exterior_color}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Interior Color</label>
                            <input type="text" className={inputClass} placeholder="Enter interior color" value={data.interior_color} onChange={(e) => setData('interior_color', e.target.value)} />
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
                            <input type="text" className={inputClass} placeholder="Enter VIN" maxLength={17} value={data.vin} onChange={(e) => setData('vin', e.target.value)} />
                            {errors.vin && <p className="mt-1 text-xs text-red-500">{errors.vin}</p>}
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
                            <select className={selectClass} value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className={labelClass}>Features</label>
                            <input type="text" className={inputClass} placeholder="Separate with commas (feature1, feature2)" value={data.features} onChange={(e) => setData('features', e.target.value)} />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                            <label className={labelClass}>Description</label>
                            <textarea className={`${inputClass} min-h-[100px] resize-y`} placeholder="Enter description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} />
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-base font-semibold text-gray-900">Images (up to 12, max 5MB each)</h2>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                        {previewImages.map((src, i) => (
                            <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-gray-200">
                                <img src={src} alt="" className="h-full w-full object-cover" />
                                <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                        {previewImages.length < 12 && (
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex aspect-[4/3] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-[#F26B5E] hover:bg-[#F26B5E]/5">
                                <Upload className="mb-1 h-5 w-5 text-gray-400" />
                                <span className="text-xs text-gray-500">{previewImages.length}/12</span>
                            </button>
                        )}
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImages} />
                </div>

                {/* Seller Info */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-base font-semibold text-gray-900">Seller Information</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>First Name</label>
                            <input type="text" className={inputClass} placeholder="First name" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                            {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Last Name</label>
                            <input type="text" className={inputClass} placeholder="Last name" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                            {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Email</label>
                            <input type="email" className={inputClass} placeholder="Email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Phone</label>
                            <input type="tel" className={inputClass} placeholder="Phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <Link href="/admin/car-listings" className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</Link>
                    <button type="submit" disabled={processing} className="rounded-lg px-5 py-2.5 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50" style={{ backgroundColor: ACCENT }}>
                        {processing ? 'Creating...' : 'Create Listing'}
                    </button>
                </div>
            </form>
        </>
    );
}

CreateCarListing.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Car Listings', href: '/admin/car-listings' },
        { title: 'Create', href: '/admin/car-listings/create' },
    ],
};
