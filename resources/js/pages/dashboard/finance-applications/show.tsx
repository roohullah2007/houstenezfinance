import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Trash2,
    Eye,
    EyeOff,
    User,
    Home,
    Briefcase,
    Users,
    Car,
    Phone,
    Shield,
    Save,
} from 'lucide-react';
import { type FormEvent } from 'react';

const ACCENT = '#F26B5E';

interface Application {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    phone: string;
    alt_phone: string | null;
    date_of_birth: string;
    ssn: string;
    license_number: string;
    license_state: string;
    marital_status: string;

    current_address: string;
    current_city: string;
    current_state: string;
    current_zip: string;
    current_years_at_address: number;
    current_months_at_address: number;
    housing_status: string;
    monthly_housing_payment: string | null;

    previous_address: string | null;
    previous_city: string | null;
    previous_state: string | null;
    previous_zip: string | null;

    employer_name: string | null;
    job_title: string | null;
    employer_phone: string | null;
    years_employed: number;
    months_employed: number;
    monthly_income: string | null;
    other_monthly_income: string | null;
    other_income_source: string | null;
    previous_employer_name: string | null;
    previous_job_title: string | null;

    has_co_applicant: boolean;
    co_first_name: string | null;
    co_last_name: string | null;
    co_email: string | null;
    co_phone: string | null;
    co_date_of_birth: string | null;
    co_ssn: string | null;
    co_relationship: string | null;
    co_employer_name: string | null;
    co_monthly_income: string | null;

    vehicle_of_interest: string | null;
    down_payment: string | null;
    trade_in_vehicle: string | null;

    reference1_name: string | null;
    reference1_phone: string | null;
    reference1_relationship: string | null;
    reference2_name: string | null;
    reference2_phone: string | null;
    reference2_relationship: string | null;

    credit_check_authorized: boolean;
    submitter_ip: string | null;
    status: 'new' | 'reviewing' | 'approved' | 'declined';
    admin_notes: string | null;
    created_at: string;
}

interface Props {
    application: Application;
    revealed: boolean;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0">
            <span className="text-sm text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-900">{value ?? '—'}</span>
        </div>
    );
}

function Section({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-2">
                <Icon className="h-5 w-5 text-gray-400" />
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default function ShowFinanceApplication({ application, revealed }: Props) {
    const { data, setData, patch, processing, recentlySuccessful } = useForm({
        status: application.status,
        admin_notes: application.admin_notes ?? '',
    });

    function handleStatusSubmit(e: FormEvent) {
        e.preventDefault();
        patch(`/admin/finance-applications/${application.id}/status`, { preserveScroll: true });
    }

    function handleDelete() {
        if (confirm('Delete this application? This cannot be undone.')) {
            router.delete(`/admin/finance-applications/${application.id}`);
        }
    }

    function toggleReveal() {
        const next = !revealed;
        if (next) {
            if (!confirm('Revealing sensitive data (SSN, DOB, DL). This access may be logged for compliance. Continue?')) return;
        }
        router.get(`/admin/finance-applications/${application.id}`, { reveal: next ? 1 : 0 }, { preserveScroll: true });
    }

    const money = (v: string | null) => v ? `$${Number(v).toLocaleString()}` : '—';

    return (
        <>
            <Head title={`Application — ${application.first_name} ${application.last_name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/finance-applications" className="rounded-lg border border-gray-300 p-2 hover:bg-gray-100">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{application.first_name} {application.middle_name ?? ''} {application.last_name}</h1>
                            <p className="text-sm text-gray-500">
                                Submitted {new Date(application.created_at).toLocaleString('en-US')}
                                {application.submitter_ip && <span className="ml-2 text-xs">· IP {application.submitter_ip}</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={toggleReveal}
                            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${revealed ? 'bg-gray-900 text-white hover:bg-black' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                        >
                            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            {revealed ? 'Hide Sensitive' : 'Reveal Sensitive Info'}
                        </button>
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
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <Section icon={User} title="Applicant">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Row label="Full Name" value={`${application.first_name} ${application.middle_name ?? ''} ${application.last_name}`} />
                                <Row label="Email" value={<a href={`mailto:${application.email}`} className="hover:text-blue-600">{application.email}</a>} />
                                <Row label="Phone" value={<a href={`tel:${application.phone}`} className="hover:text-blue-600">{application.phone}</a>} />
                                {application.alt_phone && <Row label="Alt Phone" value={application.alt_phone} />}
                                <Row label="Marital Status" value={<span className="capitalize">{application.marital_status}</span>} />
                                <Row label="Date of Birth" value={<span className={revealed ? '' : 'text-gray-400 italic'}>{application.date_of_birth}</span>} />
                                <Row label="SSN" value={<span className="font-mono">{application.ssn}</span>} />
                                <Row label="Driver License" value={<span className={revealed ? 'font-mono' : 'text-gray-400 italic'}>{application.license_number}</span>} />
                                <Row label="License State" value={application.license_state} />
                            </div>
                        </Section>

                        <Section icon={Home} title="Residence">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Row label="Address" value={`${application.current_address}, ${application.current_city}, ${application.current_state} ${application.current_zip}`} />
                                <Row label="Time at Address" value={`${application.current_years_at_address}y ${application.current_months_at_address}m`} />
                                <Row label="Housing" value={<span className="capitalize">{application.housing_status}</span>} />
                                <Row label="Monthly Payment" value={money(application.monthly_housing_payment)} />
                                {application.previous_address && (
                                    <Row label="Previous Address" value={`${application.previous_address}, ${application.previous_city ?? ''}, ${application.previous_state ?? ''} ${application.previous_zip ?? ''}`} />
                                )}
                            </div>
                        </Section>

                        <Section icon={Briefcase} title="Employment">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Row label="Employer" value={application.employer_name} />
                                <Row label="Job Title" value={application.job_title} />
                                <Row label="Employer Phone" value={application.employer_phone} />
                                <Row label="Time Employed" value={`${application.years_employed}y ${application.months_employed}m`} />
                                <Row label="Monthly Income" value={money(application.monthly_income)} />
                                <Row label="Other Income" value={application.other_monthly_income ? `${money(application.other_monthly_income)} (${application.other_income_source ?? '—'})` : '—'} />
                                {application.previous_employer_name && <Row label="Previous Employer" value={`${application.previous_employer_name} — ${application.previous_job_title ?? ''}`} />}
                            </div>
                        </Section>

                        {application.has_co_applicant && (
                            <Section icon={Users} title="Co-Applicant">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Row label="Name" value={`${application.co_first_name ?? ''} ${application.co_last_name ?? ''}`.trim() || '—'} />
                                    <Row label="Relationship" value={application.co_relationship} />
                                    <Row label="Email" value={application.co_email} />
                                    <Row label="Phone" value={application.co_phone} />
                                    <Row label="Date of Birth" value={<span className={revealed ? '' : 'text-gray-400 italic'}>{application.co_date_of_birth}</span>} />
                                    <Row label="SSN" value={<span className="font-mono">{application.co_ssn}</span>} />
                                    <Row label="Employer" value={application.co_employer_name} />
                                    <Row label="Monthly Income" value={money(application.co_monthly_income)} />
                                </div>
                            </Section>
                        )}

                        <Section icon={Car} title="Vehicle Interest">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Row label="Vehicle of Interest" value={application.vehicle_of_interest} />
                                <Row label="Down Payment" value={money(application.down_payment)} />
                                <Row label="Trade-In" value={application.trade_in_vehicle} />
                            </div>
                        </Section>

                        <Section icon={Phone} title="References">
                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Reference 1</p>
                                    <Row label="Name" value={application.reference1_name} />
                                    <Row label="Phone" value={application.reference1_phone} />
                                    <Row label="Relationship" value={application.reference1_relationship} />
                                </div>
                                <div>
                                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Reference 2</p>
                                    <Row label="Name" value={application.reference2_name} />
                                    <Row label="Phone" value={application.reference2_phone} />
                                    <Row label="Relationship" value={application.reference2_relationship} />
                                </div>
                            </div>
                        </Section>

                        <Section icon={Shield} title="Consent">
                            <Row label="Credit Check Authorized" value={application.credit_check_authorized ? 'Yes' : 'No'} />
                        </Section>
                    </div>

                    {/* Sidebar — status + notes */}
                    <div className="space-y-6">
                        <form onSubmit={handleStatusSubmit} className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="text-base font-semibold text-gray-900">Review Status</h3>
                            <div className="mt-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as Application['status'])}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20"
                                >
                                    <option value="new">New</option>
                                    <option value="reviewing">Reviewing</option>
                                    <option value="approved">Approved</option>
                                    <option value="declined">Declined</option>
                                </select>
                            </div>
                            <div className="mt-4">
                                <label className="mb-1 block text-sm font-medium text-gray-700">Admin Notes</label>
                                <textarea
                                    rows={6}
                                    value={data.admin_notes}
                                    onChange={(e) => setData('admin_notes', e.target.value)}
                                    placeholder="Internal notes (not visible to applicant)..."
                                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20"
                                />
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                                {recentlySuccessful && <p className="text-xs font-medium text-green-600">Saved.</p>}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="ml-auto inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50"
                                    style={{ backgroundColor: ACCENT }}
                                >
                                    <Save className="h-4 w-4" />
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

ShowFinanceApplication.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Finance Applications', href: '/admin/finance-applications' },
        { title: 'Application Details', href: '#' },
    ],
};
