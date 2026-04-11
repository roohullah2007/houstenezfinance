import { Head, Link, useForm } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import {
    Car,
    Upload,
    X,
    MapPin,
    Phone,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    ChevronRight,
    ImagePlus,
    CheckCircle2,
    DollarSign,
    Shield,
} from 'lucide-react';
import { type FormEvent, useRef, useState } from 'react';

const ACCENT = '#F26B5E';

const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Car Listings', href: '/car-listings' },
    { label: 'Categories', href: '/categories' },
    { label: 'Locations', href: '/locations' },
    { label: 'Dealers', href: '/dealers' },
    { label: 'Sell Your Car', href: '/sell-your-car' },
    { label: 'Contact', href: '/contact' },
];

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

const MODELS_BY_MAKE: Record<string, string[]> = {
    'Toyota': ['Camry','Corolla','RAV4','Highlander','Tacoma','Tundra','4Runner','Prius','Sienna','Avalon'],
    'Honda': ['Civic','Accord','CR-V','Pilot','HR-V','Odyssey','Ridgeline','Fit','Passport'],
    'Ford': ['F-150','Mustang','Explorer','Escape','Edge','Bronco','Ranger','Expedition','Maverick'],
    'Chevrolet': ['Silverado','Malibu','Equinox','Tahoe','Camaro','Traverse','Colorado','Blazer','Suburban'],
    'BMW': ['3 Series','5 Series','X3','X5','7 Series','X1','4 Series','X7','M3','M5'],
    'Mercedes-Benz': ['C-Class','E-Class','GLC','GLE','S-Class','A-Class','CLA','GLA','AMG GT'],
    'Nissan': ['Altima','Sentra','Rogue','Pathfinder','Murano','Frontier','Titan','Maxima','Kicks'],
    'Hyundai': ['Elantra','Sonata','Tucson','Santa Fe','Kona','Palisade','Venue','Ioniq'],
    'Kia': ['Forte','K5','Sportage','Telluride','Seltos','Sorento','Soul','Carnival','Stinger'],
    'Jeep': ['Wrangler','Grand Cherokee','Cherokee','Compass','Gladiator','Renegade'],
    'Dodge': ['Charger','Challenger','Durango','Hornet'],
    'Ram': ['1500','2500','3500'],
    'Tesla': ['Model 3','Model Y','Model S','Model X','Cybertruck'],
    'Audi': ['A4','A6','Q5','Q7','A3','Q3','e-tron','A5','RS5'],
    'Lexus': ['RX','ES','NX','IS','GX','UX','LC','LS'],
    'Subaru': ['Outback','Forester','Crosstrek','Impreza','WRX','Ascent','Legacy','BRZ'],
    'Volkswagen': ['Jetta','Tiguan','Atlas','Golf','ID.4','Taos','Passat'],
    'Mazda': ['CX-5','Mazda3','CX-50','CX-9','MX-5 Miata','CX-30'],
};

const YEARS = Array.from({ length: 30 }, (_, i) => 2026 - i);

const TRANSMISSIONS = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'];

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible', 'Hatchback', 'Van', 'Wagon', 'Crossover'];

const DRIVES = ['FWD', 'RWD', 'AWD', '4WD'];

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const selectClass = 'w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 transition focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function SellYourCar() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
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
        images: [] as File[],
    });

    const availableModels = data.make ? (MODELS_BY_MAKE[data.make] || []) : [];

    function handleImages(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        const totalImages = data.images.length + files.length;
        if (totalImages > 12) {
            alert('You may upload up to 12 images.');
            return;
        }
        const oversized = files.filter((f) => f.size > 5 * 1024 * 1024);
        if (oversized.length > 0) {
            alert('Each image must be no larger than 5MB.');
            return;
        }
        const newImages = [...data.images, ...files];
        setData('images', newImages);

        const newPreviews = files.map((f) => URL.createObjectURL(f));
        setPreviewImages((prev) => [...prev, ...newPreviews]);
    }

    function removeImage(index: number) {
        const newImages = data.images.filter((_, i) => i !== index);
        setData('images', newImages);
        URL.revokeObjectURL(previewImages[index]);
        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/sell-your-car', {
            forceFormData: true,
            onSuccess: () => {
                setSubmitted(true);
                reset();
                setPreviewImages([]);
            },
        });
    }

    return (
        <>
            <Head title="Sell Your Car — Houston EZ Finance">
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
                {/* Hero Header */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div
                        className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
                        style={{ background: ACCENT }}
                    />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />

                    <PublicHeader />

                    {/* Breadcrumb & Title */}
                    <div className="relative z-10 mx-auto max-w-[1408px] px-4 pb-12 pt-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="text-white">Sell Your Car</span>
                        </div>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Sell Your Car</h1>
                        <p className="mt-2 text-lg text-white/70">List your vehicle and reach thousands of buyers</p>
                    </div>
                </div>

                {/* Pricing Banner */}
                <div className="border-b border-[#F26B5E]/20 bg-gradient-to-r from-[#F26B5E]/10 via-[#F26B5E]/5 to-[#F26B5E]/10">
                    <div className="mx-auto flex max-w-[1408px] flex-col items-center gap-4 px-4 py-8 text-center sm:px-6 lg:flex-row lg:px-8 lg:text-left">
                        <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-[#F26B5E]/20">
                            <DollarSign className="h-7 w-7 text-[#F26B5E]" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">
                                JUST $0.99 FOR 4 WEEKS <span className="text-sm font-normal text-gray-500">(REG PRICE $4.99)</span>
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                SELL YOUR CAR THE QUICKEST AND EASY WAY! ONLINE AT HOUSTONEZFINANCE.COM
                            </p>
                            <p className="mt-2 text-xs leading-relaxed text-gray-500">
                                We charge a small fee of $0.99 to keep the Spammers out and serious Sellers and Buyers in.
                                Why sell your car on Houstonezfinance.com? Your car listing will be seen by hundreds to thousands
                                of customers looking to finance a car and in most cases will opt out to search for a cash car,
                                if the price is right. Houstonezfinance.com has sellers with cars in almost every price range
                                and that's where your posting comes in.
                            </p>
                        </div>
                        <div className="flex flex-col items-center rounded-xl border-2 border-[#F26B5E] bg-white px-6 py-4 shadow-lg">
                            <span className="text-3xl font-bold text-[#F26B5E]">$0.99</span>
                            <span className="text-xs font-medium uppercase text-gray-500">4 Weeks</span>
                        </div>
                    </div>
                </div>

                {/* Success Message */}
                {submitted && (
                    <div className="mx-auto mt-8 max-w-[1408px] px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-6 py-4">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-800">Listing Submitted Successfully!</p>
                                <p className="text-sm text-green-600">Your listing is pending review and will be published once approved by our team.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="mx-auto max-w-[1408px] px-4 py-10 sm:px-6 lg:px-8">
                    <div className="space-y-8">

                        {/* Vehicle Information */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F26B5E]/10">
                                    <Car className="h-5 w-5 text-[#F26B5E]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Your Vehicle Information</h2>
                                    <p className="text-sm text-gray-500">Tell us about the car you're selling</p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                {/* Listing Title - full width */}
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <label className={labelClass}>Your listing title</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="Enter listing title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                                </div>

                                {/* State */}
                                <div>
                                    <label className={labelClass}>Your State</label>
                                    <select
                                        className={selectClass}
                                        value={data.state}
                                        onChange={(e) => setData('state', e.target.value)}
                                    >
                                        <option value="">Select State</option>
                                        {US_STATES.map((s) => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state}</p>}
                                </div>

                                {/* City */}
                                <div>
                                    <label className={labelClass}>City</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder={data.state ? 'Enter your city' : 'Select State First'}
                                        disabled={!data.state}
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                    />
                                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                                </div>

                                {/* Make */}
                                <div>
                                    <label className={labelClass}>Make</label>
                                    <select
                                        className={selectClass}
                                        value={data.make}
                                        onChange={(e) => {
                                            setData('make', e.target.value);
                                            setData('model', '');
                                        }}
                                    >
                                        <option value="">Select Make</option>
                                        {MAKES.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    {errors.make && <p className="mt-1 text-xs text-red-500">{errors.make}</p>}
                                </div>

                                {/* Model */}
                                <div>
                                    <label className={labelClass}>Model</label>
                                    <select
                                        className={selectClass}
                                        value={data.model}
                                        onChange={(e) => setData('model', e.target.value)}
                                        disabled={!data.make}
                                    >
                                        <option value="">{data.make ? 'Select Model' : 'Select Make First'}</option>
                                        {availableModels.map((m) => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                    {errors.model && <p className="mt-1 text-xs text-red-500">{errors.model}</p>}
                                </div>

                                {/* Year */}
                                <div>
                                    <label className={labelClass}>Year</label>
                                    <select
                                        className={selectClass}
                                        value={data.year}
                                        onChange={(e) => setData('year', e.target.value)}
                                    >
                                        <option value="">Select Year</option>
                                        {YEARS.map((y) => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                    {errors.year && <p className="mt-1 text-xs text-red-500">{errors.year}</p>}
                                </div>

                                {/* Price */}
                                <div>
                                    <label className={labelClass}>Price</label>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        placeholder="Enter vehicle price"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                    />
                                    {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                                </div>

                                {/* Miles */}
                                <div>
                                    <label className={labelClass}>Miles</label>
                                    <input
                                        type="number"
                                        className={inputClass}
                                        placeholder="Enter vehicle miles"
                                        value={data.miles}
                                        onChange={(e) => setData('miles', e.target.value)}
                                    />
                                    {errors.miles && <p className="mt-1 text-xs text-red-500">{errors.miles}</p>}
                                </div>

                                {/* Exterior Color */}
                                <div>
                                    <label className={labelClass}>Exterior</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="Enter exterior color"
                                        value={data.exterior_color}
                                        onChange={(e) => setData('exterior_color', e.target.value)}
                                    />
                                    {errors.exterior_color && <p className="mt-1 text-xs text-red-500">{errors.exterior_color}</p>}
                                </div>

                                {/* Interior Color */}
                                <div>
                                    <label className={labelClass}>Interior</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="Enter interior color"
                                        value={data.interior_color}
                                        onChange={(e) => setData('interior_color', e.target.value)}
                                    />
                                    {errors.interior_color && <p className="mt-1 text-xs text-red-500">{errors.interior_color}</p>}
                                </div>

                                {/* Drive */}
                                <div>
                                    <label className={labelClass}>Drive</label>
                                    <select
                                        className={selectClass}
                                        value={data.drive}
                                        onChange={(e) => setData('drive', e.target.value)}
                                    >
                                        <option value="">Select Drive</option>
                                        {DRIVES.map((d) => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                    {errors.drive && <p className="mt-1 text-xs text-red-500">{errors.drive}</p>}
                                </div>

                                {/* VIN */}
                                <div>
                                    <label className={labelClass}>VIN</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="Enter VIN number"
                                        maxLength={17}
                                        value={data.vin}
                                        onChange={(e) => setData('vin', e.target.value)}
                                    />
                                    {errors.vin && <p className="mt-1 text-xs text-red-500">{errors.vin}</p>}
                                </div>

                                {/* Features - full width */}
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <label className={labelClass}>Features</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="Separate with commas (feature1, feature2, etc)"
                                        value={data.features}
                                        onChange={(e) => setData('features', e.target.value)}
                                    />
                                    {errors.features && <p className="mt-1 text-xs text-red-500">{errors.features}</p>}
                                </div>

                                {/* Transmission */}
                                <div>
                                    <label className={labelClass}>Transmission</label>
                                    <select
                                        className={selectClass}
                                        value={data.transmission}
                                        onChange={(e) => setData('transmission', e.target.value)}
                                    >
                                        <option value="">Select Transmission</option>
                                        {TRANSMISSIONS.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    {errors.transmission && <p className="mt-1 text-xs text-red-500">{errors.transmission}</p>}
                                </div>

                                {/* Vehicle Type */}
                                <div>
                                    <label className={labelClass}>Vehicle Type</label>
                                    <select
                                        className={selectClass}
                                        value={data.vehicle_type}
                                        onChange={(e) => setData('vehicle_type', e.target.value)}
                                    >
                                        <option value="">Select Type</option>
                                        {VEHICLE_TYPES.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                    {errors.vehicle_type && <p className="mt-1 text-xs text-red-500">{errors.vehicle_type}</p>}
                                </div>

                                {/* Description - full width */}
                                <div className="sm:col-span-2 lg:col-span-3">
                                    <label className={labelClass}>Description</label>
                                    <textarea
                                        className={`${inputClass} min-h-[120px] resize-y`}
                                        placeholder="Enter vehicle listing description."
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={5}
                                    />
                                    {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F26B5E]/10">
                                    <ImagePlus className="h-5 w-5 text-[#F26B5E]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Image Gallery</h2>
                                    <p className="text-sm text-gray-500">
                                        Upload up to 12 images (max 5MB each). We recommend full resolution for best results.
                                    </p>
                                </div>
                            </div>

                            {/* Image Previews */}
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                {previewImages.map((src, i) => (
                                    <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200">
                                        <img src={src} alt="" className="h-full w-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}

                                {previewImages.length < 12 && (
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-[#F26B5E] hover:bg-[#F26B5E]/5"
                                    >
                                        <Upload className="mb-2 h-6 w-6 text-gray-400" />
                                        <span className="text-xs font-medium text-gray-500">Add Photos</span>
                                        <span className="text-[10px] text-gray-400">{previewImages.length}/12</span>
                                    </button>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImages}
                            />
                            {errors['images.0' as keyof typeof errors] && (
                                <p className="mt-2 text-xs text-red-500">Please upload valid images (max 5MB each).</p>
                            )}
                        </div>

                        {/* Personal Information */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F26B5E]/10">
                                    <Shield className="h-5 w-5 text-[#F26B5E]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                                    <p className="text-sm text-gray-500">How buyers can reach you</p>
                                </div>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>First name</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="Enter your first name"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                    />
                                    {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Last name</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="Enter your last name"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                    />
                                    {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Email</label>
                                    <input
                                        type="email"
                                        className={inputClass}
                                        placeholder="Enter your e-mail"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Phone number</label>
                                    <input
                                        type="tel"
                                        className={inputClass}
                                        placeholder="Enter your phone number"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:justify-between sm:p-8">
                            <div className="text-center sm:text-left">
                                <p className="text-sm font-medium text-gray-900">Ready to list your vehicle?</p>
                                <p className="text-xs text-gray-500">Your listing will be reviewed and published within 24 hours.</p>
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
                                style={{ backgroundColor: ACCENT }}
                            >
                                {processing ? 'Submitting...' : 'Submit Listing — $0.99'}
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <footer className="bg-[#0b1020] text-white">
                    <div className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <img src="/images/housten-logo.svg" alt="Houston EZ Finance" className="h-14 w-auto" />
                                <p className="mt-4 text-sm leading-relaxed text-white/60">
                                    Your trusted marketplace for quality vehicles and hassle-free auto financing in Houston and beyond.
                                </p>
                                <div className="mt-5 flex items-center gap-3">
                                    {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                        <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#F26B5E]">
                                            <Icon className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['About Us', 'Car Listings', 'Dealers', 'Blog', 'Contact'].map((l) => (
                                        <li key={l}><a href="#" className="transition hover:text-[#F26B5E]">{l}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Categories</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['Sedan', 'SUV', 'Coupe', 'Convertible', 'Truck'].map((c) => (
                                        <li key={c}><a href="#" className="transition hover:text-[#F26B5E]">{c}</a></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Contact</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />1234 Main St, Houston, TX 77002</li>
                                    <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />(713) 555-0123</li>
                                    <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" />hello@houstonezfinance.com</li>
                                </ul>
                            </div>
                        </div>

                        <div className="my-10 h-px bg-white/10" />

                        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/50 sm:flex-row">
                            <p>&copy; {new Date().getFullYear()} Houston EZ Finance. All rights reserved.</p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-white">Privacy Policy</a>
                                <a href="#" className="hover:text-white">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
