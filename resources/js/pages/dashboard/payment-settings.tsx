import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, CreditCard, Lock, AlertTriangle, XCircle } from 'lucide-react';
import { type FormEvent } from 'react';

interface Settings {
    stripe_test_mode: boolean;
    stripe_publishable_key: string;
    stripe_secret_key_set: boolean;
    listing_fee: number;
    currency: string;
    payment_active: boolean;
}

interface Props {
    settings: Settings;
}

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function PaymentSettings({ settings }: Props) {
    const flash = (usePage().props as { flash?: { success?: string } }).flash;

    const { data, setData, put, processing, errors } = useForm({
        stripe_test_mode: settings.stripe_test_mode,
        stripe_publishable_key: settings.stripe_publishable_key || '',
        stripe_secret_key: '',
        listing_fee: settings.listing_fee || 0,
        currency: settings.currency || 'usd',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put('/admin/payment-settings', {
            preserveScroll: true,
            onSuccess: () => setData('stripe_secret_key', ''),
        });
    }

    return (
        <>
            <Head title="Payment Settings" />

            <div className="flex h-full flex-1 flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payment Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Configure Stripe to collect a listing fee when private sellers submit the Sell Your Car form.
                    </p>
                </div>

                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-medium text-green-800">{flash.success}</p>
                    </div>
                )}

                {settings.payment_active ? (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                        <div>
                            <p className="font-semibold">Payments are active.</p>
                            <p className="mt-1">
                                Private sellers will be charged the listing fee via Stripe after submitting the Sell Your Car form.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        <div>
                            <p className="font-semibold">Payments are not active.</p>
                            <p className="mt-1">
                                To start charging, make sure the listing fee is above $0 and both Stripe keys below are saved.
                            </p>
                        </div>
                    </div>
                )}

                <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                        <p className="font-semibold">PCI-Compliant by Design</p>
                        <p className="mt-1">
                            Card numbers are entered into a Stripe-hosted field and never touch this server or database.
                            You only need to complete Stripe's one-page SAQ A self-assessment.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F26B5E]/10">
                                    <CreditCard className="h-5 w-5 text-[#F26B5E]" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Stripe</h2>
                                    <p className="text-xs text-gray-500">
                                        Create an account at <a href="https://dashboard.stripe.com/register" target="_blank" rel="noreferrer" className="text-[#F26B5E] underline">dashboard.stripe.com</a> and copy your API keys.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <label className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
                                    <input
                                        type="checkbox"
                                        checked={data.stripe_test_mode}
                                        onChange={(e) => setData('stripe_test_mode', e.target.checked)}
                                        className="h-4 w-4 accent-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/40"
                                    />
                                    <span className="text-sm text-gray-700">
                                        Test mode (use <code className="rounded bg-gray-100 px-1">pk_test_…</code> / <code className="rounded bg-gray-100 px-1">sk_test_…</code> keys)
                                    </span>
                                </label>

                                <div>
                                    <label className={labelClass}>Publishable Key</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder={data.stripe_test_mode ? 'pk_test_...' : 'pk_live_...'}
                                        value={data.stripe_publishable_key}
                                        onChange={(e) => setData('stripe_publishable_key', e.target.value)}
                                    />
                                    {errors.stripe_publishable_key && <p className="mt-1 text-xs text-red-500">{errors.stripe_publishable_key}</p>}
                                    <p className="mt-1 text-xs text-gray-500">Safe to expose — sent to the browser.</p>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Secret Key
                                        {settings.stripe_secret_key_set && (
                                            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Saved
                                            </span>
                                        )}
                                    </label>
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        className={inputClass}
                                        placeholder={settings.stripe_secret_key_set ? '••••••••••••  (leave blank to keep existing)' : (data.stripe_test_mode ? 'sk_test_...' : 'sk_live_...')}
                                        value={data.stripe_secret_key}
                                        onChange={(e) => setData('stripe_secret_key', e.target.value)}
                                    />
                                    {errors.stripe_secret_key && <p className="mt-1 text-xs text-red-500">{errors.stripe_secret_key}</p>}
                                    <p className="mt-1 text-xs text-gray-500">Stored encrypted on the server. Never displayed back.</p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-base font-semibold text-gray-900">Listing Fee</h2>
                            <p className="mt-1 text-xs text-gray-500">Charged when a private seller submits the Sell Your Car form. Set to $0 to skip the payment step.</p>

                            <div className="mt-5 space-y-5">
                                <div>
                                    <label className={labelClass}>Amount</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-3 flex items-center text-sm text-gray-500">$</span>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className={`${inputClass} pl-7`}
                                            value={data.listing_fee}
                                            onChange={(e) => setData('listing_fee', parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    {errors.listing_fee && <p className="mt-1 text-xs text-red-500">{errors.listing_fee}</p>}
                                </div>
                                <div>
                                    <label className={labelClass}>Currency</label>
                                    <select
                                        className={inputClass}
                                        value={data.currency}
                                        onChange={(e) => setData('currency', e.target.value)}
                                    >
                                        <option value="usd">USD ($)</option>
                                        <option value="cad">CAD (C$)</option>
                                        <option value="eur">EUR (€)</option>
                                        <option value="gbp">GBP (£)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!data.stripe_test_mode && settings.payment_active && (
                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <p>
                                <span className="font-semibold">Live mode is on.</span> Real cards will be charged. Test your flow in test mode first.
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-full bg-[#F26B5E] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-50"
                        >
                            {processing ? 'Saving…' : 'Save Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

PaymentSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Payment Settings', href: '/admin/payment-settings' },
    ],
};
