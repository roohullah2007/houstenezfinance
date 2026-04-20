import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { CaptchaField } from '@/components/captcha-field';
import {
    User,
    Home,
    Briefcase,
    Users,
    Car,
    Phone,
    Shield,
    MapPin,
    Mail,
    Facebook,
    Twitter,
    Instagram,
    ChevronRight,
    CheckCircle2,
    Lock,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';

const ACCENT = '#F26B5E';

const US_STATES = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const selectClass = 'w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

function Section({ icon: Icon, title, subtitle, children }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                    <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
                </div>
            </div>
            {children}
        </section>
    );
}

export default function FinanceApplication() {
    const [submitted, setSubmitted] = useState(false);
    const { flash } = usePage<{ flash?: { success?: string } }>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        // Applicant
        first_name: '', middle_name: '', last_name: '',
        email: '', phone: '', alt_phone: '',
        date_of_birth: '', ssn: '',
        license_number: '', license_state: 'TX',
        marital_status: 'single',

        // Residence
        current_address: '', current_city: '', current_state: 'TX', current_zip: '',
        current_years_at_address: '0', current_months_at_address: '0',
        housing_status: 'rent', monthly_housing_payment: '',

        previous_address: '', previous_city: '', previous_state: '', previous_zip: '',

        // Employment
        employer_name: '', job_title: '', employer_phone: '',
        years_employed: '0', months_employed: '0',
        monthly_income: '', other_monthly_income: '', other_income_source: '',
        previous_employer_name: '', previous_job_title: '',

        // Co-applicant
        has_co_applicant: false,
        co_first_name: '', co_last_name: '', co_email: '', co_phone: '',
        co_date_of_birth: '', co_ssn: '',
        co_relationship: '', co_employer_name: '', co_monthly_income: '',

        // Vehicle
        vehicle_of_interest: '', down_payment: '', trade_in_vehicle: '',

        // References
        reference1_name: '', reference1_phone: '', reference1_relationship: '',
        reference2_name: '', reference2_phone: '', reference2_relationship: '',

        credit_check_authorized: false,
        captcha_token: '', captcha_answer: '', website: '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post('/finance-application', {
            onSuccess: () => {
                setSubmitted(true);
                reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
        });
    }

    return (
        <>
            <Head title="Finance Application — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
                {/* Hero */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-3xl" />
                    <PublicHeader />
                    <div className="relative z-10 mx-auto max-w-[1408px] px-4 pb-12 pt-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2 text-sm text-white/60">
                            <Link href="/" className="hover:text-white">Home</Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="text-white">Finance Application</span>
                        </div>
                        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Online Finance Application</h1>
                        <p className="mt-3 max-w-2xl text-lg text-white/70">
                            Fill out the application below and our team will review your information. All credit considered — bad credit, no credit, bankruptcy.
                        </p>
                    </div>
                </div>

                {(submitted || flash?.success) && (
                    <div className="mx-auto mt-8 max-w-[1100px] px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-6 py-4">
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                            <div>
                                <p className="font-semibold text-green-800">Application Submitted</p>
                                <p className="text-sm text-green-600">{flash?.success ?? 'We will review your application and contact you shortly.'}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Privacy Notice */}
                <div className="mx-auto mt-8 max-w-[1100px] px-4 sm:px-6 lg:px-8">
                    <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 px-5 py-4">
                        <Lock className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                        <div>
                            <p className="text-sm font-semibold text-blue-900">Your information is secure</p>
                            <p className="mt-0.5 text-xs text-blue-800/80">
                                We encrypt sensitive fields (SSN, driver license, date of birth) and only our authorized staff can access them. We'll never share your data with unauthorized third parties.
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mx-auto max-w-[1100px] space-y-6 px-4 py-8 sm:px-6 lg:px-8">

                    {/* Applicant Info */}
                    <Section icon={User} title="Applicant Information" subtitle="Tell us about yourself">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className={labelClass}>First Name *</label>
                                <input type="text" className={inputClass} value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                                {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Middle Name</label>
                                <input type="text" className={inputClass} value={data.middle_name} onChange={(e) => setData('middle_name', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Last Name *</label>
                                <input type="text" className={inputClass} value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                                {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Email *</label>
                                <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Phone *</label>
                                <input type="tel" className={inputClass} value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Alternate Phone</label>
                                <input type="tel" className={inputClass} value={data.alt_phone} onChange={(e) => setData('alt_phone', e.target.value)} />
                            </div>

                            <div>
                                <label className={labelClass}>Date of Birth * <Lock className="ml-1 inline h-3 w-3 text-gray-400" /></label>
                                <input type="date" className={inputClass} value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} />
                                {errors.date_of_birth && <p className="mt-1 text-xs text-red-500">{errors.date_of_birth}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Social Security Number * <Lock className="ml-1 inline h-3 w-3 text-gray-400" /></label>
                                <input type="text" inputMode="numeric" placeholder="XXX-XX-XXXX" className={inputClass} value={data.ssn} onChange={(e) => setData('ssn', e.target.value)} />
                                {errors.ssn && <p className="mt-1 text-xs text-red-500">{errors.ssn}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Marital Status *</label>
                                <select className={selectClass} value={data.marital_status} onChange={(e) => setData('marital_status', e.target.value)}>
                                    <option value="single">Single</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                    <option value="separated">Separated</option>
                                </select>
                            </div>

                            <div className="sm:col-span-2">
                                <label className={labelClass}>Driver License Number * <Lock className="ml-1 inline h-3 w-3 text-gray-400" /></label>
                                <input type="text" className={inputClass} value={data.license_number} onChange={(e) => setData('license_number', e.target.value)} />
                                {errors.license_number && <p className="mt-1 text-xs text-red-500">{errors.license_number}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>License State *</label>
                                <select className={selectClass} value={data.license_state} onChange={(e) => setData('license_state', e.target.value)}>
                                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </Section>

                    {/* Residence */}
                    <Section icon={Home} title="Residence" subtitle="Where do you currently live?">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className={labelClass}>Street Address *</label>
                                <input type="text" className={inputClass} value={data.current_address} onChange={(e) => setData('current_address', e.target.value)} />
                                {errors.current_address && <p className="mt-1 text-xs text-red-500">{errors.current_address}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>City *</label>
                                <input type="text" className={inputClass} value={data.current_city} onChange={(e) => setData('current_city', e.target.value)} />
                                {errors.current_city && <p className="mt-1 text-xs text-red-500">{errors.current_city}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>State *</label>
                                <select className={selectClass} value={data.current_state} onChange={(e) => setData('current_state', e.target.value)}>
                                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>ZIP *</label>
                                <input type="text" className={inputClass} value={data.current_zip} onChange={(e) => setData('current_zip', e.target.value)} />
                                {errors.current_zip && <p className="mt-1 text-xs text-red-500">{errors.current_zip}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Years at Address *</label>
                                <input type="number" min={0} className={inputClass} value={data.current_years_at_address} onChange={(e) => setData('current_years_at_address', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Months *</label>
                                <input type="number" min={0} max={11} className={inputClass} value={data.current_months_at_address} onChange={(e) => setData('current_months_at_address', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Housing *</label>
                                <select className={selectClass} value={data.housing_status} onChange={(e) => setData('housing_status', e.target.value)}>
                                    <option value="own">Own</option>
                                    <option value="rent">Rent</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Monthly Rent / Mortgage Payment ($)</label>
                                <input type="number" min={0} step={10} className={inputClass} value={data.monthly_housing_payment} onChange={(e) => setData('monthly_housing_payment', e.target.value)} />
                            </div>
                        </div>

                        <p className="mt-5 text-xs font-medium text-gray-600">If you've lived at your current address less than 2 years, please include previous address.</p>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className={labelClass}>Previous Address</label>
                                <input type="text" className={inputClass} value={data.previous_address} onChange={(e) => setData('previous_address', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>City</label>
                                <input type="text" className={inputClass} value={data.previous_city} onChange={(e) => setData('previous_city', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>State</label>
                                <select className={selectClass} value={data.previous_state} onChange={(e) => setData('previous_state', e.target.value)}>
                                    <option value="">Select</option>
                                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>ZIP</label>
                                <input type="text" className={inputClass} value={data.previous_zip} onChange={(e) => setData('previous_zip', e.target.value)} />
                            </div>
                        </div>
                    </Section>

                    {/* Employment */}
                    <Section icon={Briefcase} title="Employment" subtitle="Where do you work?">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className={labelClass}>Employer Name</label>
                                <input type="text" className={inputClass} value={data.employer_name} onChange={(e) => setData('employer_name', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Job Title</label>
                                <input type="text" className={inputClass} value={data.job_title} onChange={(e) => setData('job_title', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Employer Phone</label>
                                <input type="tel" className={inputClass} value={data.employer_phone} onChange={(e) => setData('employer_phone', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Years Employed *</label>
                                <input type="number" min={0} className={inputClass} value={data.years_employed} onChange={(e) => setData('years_employed', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Months *</label>
                                <input type="number" min={0} max={11} className={inputClass} value={data.months_employed} onChange={(e) => setData('months_employed', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Gross Monthly Income ($)</label>
                                <input type="number" min={0} step={100} className={inputClass} value={data.monthly_income} onChange={(e) => setData('monthly_income', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Other Monthly Income ($)</label>
                                <input type="number" min={0} step={100} className={inputClass} value={data.other_monthly_income} onChange={(e) => setData('other_monthly_income', e.target.value)} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Source of Other Income</label>
                                <input type="text" className={inputClass} placeholder="e.g. Child support, Social Security, Self-employment" value={data.other_income_source} onChange={(e) => setData('other_income_source', e.target.value)} />
                            </div>
                        </div>

                        <p className="mt-5 text-xs font-medium text-gray-600">If you've worked at your current job less than 2 years, please include previous employer.</p>
                        <div className="mt-3 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>Previous Employer</label>
                                <input type="text" className={inputClass} value={data.previous_employer_name} onChange={(e) => setData('previous_employer_name', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Previous Job Title</label>
                                <input type="text" className={inputClass} value={data.previous_job_title} onChange={(e) => setData('previous_job_title', e.target.value)} />
                            </div>
                        </div>
                    </Section>

                    {/* Co-Applicant */}
                    <Section icon={Users} title="Co-Applicant (optional)" subtitle="Add a co-applicant to strengthen your application">
                        <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                checked={data.has_co_applicant}
                                onChange={(e) => setData('has_co_applicant', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 accent-[#F26B5E] focus:ring-2 focus:ring-[#F26B5E]/20"
                            />
                            I'm applying with a co-applicant
                        </label>

                        {data.has_co_applicant && (
                            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className={labelClass}>Co First Name</label>
                                    <input type="text" className={inputClass} value={data.co_first_name} onChange={(e) => setData('co_first_name', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Co Last Name</label>
                                    <input type="text" className={inputClass} value={data.co_last_name} onChange={(e) => setData('co_last_name', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Relationship</label>
                                    <input type="text" className={inputClass} placeholder="Spouse, parent, etc." value={data.co_relationship} onChange={(e) => setData('co_relationship', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Co Email</label>
                                    <input type="email" className={inputClass} value={data.co_email} onChange={(e) => setData('co_email', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Co Phone</label>
                                    <input type="tel" className={inputClass} value={data.co_phone} onChange={(e) => setData('co_phone', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Co Date of Birth <Lock className="ml-1 inline h-3 w-3 text-gray-400" /></label>
                                    <input type="date" className={inputClass} value={data.co_date_of_birth} onChange={(e) => setData('co_date_of_birth', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Co SSN <Lock className="ml-1 inline h-3 w-3 text-gray-400" /></label>
                                    <input type="text" placeholder="XXX-XX-XXXX" className={inputClass} value={data.co_ssn} onChange={(e) => setData('co_ssn', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Co Employer</label>
                                    <input type="text" className={inputClass} value={data.co_employer_name} onChange={(e) => setData('co_employer_name', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Co Monthly Income ($)</label>
                                    <input type="number" min={0} step={100} className={inputClass} value={data.co_monthly_income} onChange={(e) => setData('co_monthly_income', e.target.value)} />
                                </div>
                            </div>
                        )}
                    </Section>

                    {/* Vehicle */}
                    <Section icon={Car} title="Vehicle Interest" subtitle="What are you looking to finance?">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="sm:col-span-2 lg:col-span-3">
                                <label className={labelClass}>Vehicle of Interest</label>
                                <input type="text" placeholder="e.g. 2020 Toyota Camry (from listings) or any car" className={inputClass} value={data.vehicle_of_interest} onChange={(e) => setData('vehicle_of_interest', e.target.value)} />
                            </div>
                            <div>
                                <label className={labelClass}>Down Payment ($)</label>
                                <input type="number" min={0} step={100} className={inputClass} value={data.down_payment} onChange={(e) => setData('down_payment', e.target.value)} />
                            </div>
                            <div className="sm:col-span-2">
                                <label className={labelClass}>Trade-In Vehicle (year/make/model)</label>
                                <input type="text" className={inputClass} value={data.trade_in_vehicle} onChange={(e) => setData('trade_in_vehicle', e.target.value)} />
                            </div>
                        </div>
                    </Section>

                    {/* References */}
                    <Section icon={Phone} title="References" subtitle="Two personal references (not family)">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-gray-700">Reference 1</p>
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input type="text" className={inputClass} value={data.reference1_name} onChange={(e) => setData('reference1_name', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Phone</label>
                                    <input type="tel" className={inputClass} value={data.reference1_phone} onChange={(e) => setData('reference1_phone', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Relationship</label>
                                    <input type="text" placeholder="e.g. Coworker, Friend" className={inputClass} value={data.reference1_relationship} onChange={(e) => setData('reference1_relationship', e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="text-sm font-semibold text-gray-700">Reference 2</p>
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input type="text" className={inputClass} value={data.reference2_name} onChange={(e) => setData('reference2_name', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Phone</label>
                                    <input type="tel" className={inputClass} value={data.reference2_phone} onChange={(e) => setData('reference2_phone', e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Relationship</label>
                                    <input type="text" className={inputClass} value={data.reference2_relationship} onChange={(e) => setData('reference2_relationship', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Authorization */}
                    <Section icon={Shield} title="Authorization" subtitle="Review and sign">
                        <label className="flex cursor-pointer items-start gap-3">
                            <input
                                type="checkbox"
                                checked={data.credit_check_authorized}
                                onChange={(e) => setData('credit_check_authorized', e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-[#F26B5E] focus:ring-2 focus:ring-[#F26B5E]/20"
                            />
                            <span className="text-sm text-gray-700">
                                I authorize Houston EZ Finance and its dealer partners to obtain my consumer credit report and verify the information I've provided above. I certify all information is true and complete to the best of my knowledge. *
                            </span>
                        </label>
                        {errors.credit_check_authorized && <p className="mt-2 text-xs text-red-500">You must authorize the credit check to submit.</p>}

                        <div className="mt-6">
                            <CaptchaField data={data} setData={setData} errors={errors} />
                        </div>

                        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
                            <p className="text-xs text-gray-500">
                                By submitting, you agree to our privacy policy.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
                                style={{ backgroundColor: ACCENT }}
                            >
                                {processing ? 'Submitting...' : 'Submit Application'}
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </Section>
                </form>

                {/* Footer */}
                <footer className="bg-[#0b1020] text-white">
                    <div className="mx-auto max-w-[1408px] px-4 py-16 sm:px-6 lg:px-8">
                        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
                            <div>
                                <img src="/images/housten-logo-1.png" alt="Houston EZ Finance" className="h-14 w-auto" />
                                <p className="mt-4 text-sm leading-relaxed text-white/60">Your trusted marketplace for quality vehicles, real estate, and hassle-free financing in Houston and beyond.</p>
                                <div className="mt-5 flex items-center gap-3">
                                    {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                        <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-[#F26B5E]"><Icon className="h-4 w-4" /></a>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Quick Links</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    <li><Link href="/car-listings" className="transition hover:text-[#F26B5E]">Car Listings</Link></li>
                                    <li><Link href="/real-estate" className="transition hover:text-[#F26B5E]">Real Estate</Link></li>
                                    <li><Link href="/finance-application" className="transition hover:text-[#F26B5E]">Finance Application</Link></li>
                                    <li><Link href="/sell-your-car" className="transition hover:text-[#F26B5E]">Sell Your Car</Link></li>
                                    <li><Link href="/categories" className="transition hover:text-[#F26B5E]">Categories</Link></li>
                                    <li><Link href="/locations" className="transition hover:text-[#F26B5E]">Locations</Link></li>
                                    <li><Link href="/dealers" className="transition hover:text-[#F26B5E]">Dealers</Link></li>
                                    <li><Link href="/contact" className="transition hover:text-[#F26B5E]">Contact</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Services</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    {['Auto Financing', 'Bad Credit Loans', 'First-Time Buyers', 'Trade-ins', 'In House Financing'].map((c) => (
                                        <li key={c}>{c}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold tracking-wider uppercase">Contact</h4>
                                <ul className="mt-5 space-y-3 text-sm text-white/60">
                                    <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />3505 S Dairy Ashford Rd # 115 717, Houston, TX 77082</li>
                                    <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />832-322-2354</li>
                                    <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" />houstonezfinance@gmail.com</li>
                                </ul>
                            </div>
                        </div>
                        <div className="my-10 h-px bg-white/10" />
                        <div className="flex flex-col items-center justify-between gap-4 text-sm text-white/50 sm:flex-row">
                            <p>&copy; {new Date().getFullYear()} Houston EZ Finance. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
