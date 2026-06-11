import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, CreditCard, Lock, AlertTriangle, XCircle } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface Settings {
    paypal_environment: string;
    paypal_client_id: string;
    paypal_client_secret_set: boolean;
    paypal_client_secret_unreadable?: boolean;
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

    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        paypal_environment: settings.paypal_environment || 'sandbox',
        paypal_client_id: settings.paypal_client_id || '',
        paypal_client_secret: '',
        listing_fee: settings.listing_fee || 0,
        currency: settings.currency || 'usd',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put('/admin/payment-settings', {
            preserveScroll: true,
            onSuccess: () => setData('paypal_client_secret', ''),
        });
    }

    async function handleTest() {
        setTesting(true);
        setTestResult(null);
        try {
            const res = await fetch('/admin/payment-settings/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content || '',
                },
            });
            const data = await res.json();
            setTestResult({ ok: !!data.ok, message: data.message || 'Unexpected response.' });
        } catch {
            setTestResult({ ok: false, message: 'Could not reach the server to run the test.' });
        } finally {
            setTesting(false);
        }
    }

    return (
        <>
            <Head title="Payment Settings" />

            <div className="flex h-full flex-1 flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Payment Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Configure PayPal to collect a listing fee when private sellers submit the Sell Your Car form.
                    </p>
                </div>

                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-medium text-green-800">{flash.success}</p>
                    </div>
                )}

                {settings.paypal_client_secret_unreadable && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                        <div>
                            <p className="font-semibold">Your saved PayPal Client Secret can no longer be read.</p>
                            <p className="mt-1">
                                It was saved under a different application key (this happens when the server's APP_KEY
                                changes). Payments are disabled until you re-enter the Client Secret below and click
                                Save, then use Test Connection to confirm.
                            </p>
                        </div>
                    </div>
                )}

                {settings.payment_active ? (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                        <div>
                            <p className="font-semibold">Payments are active.</p>
                            <p className="mt-1">
                                Private sellers will be charged the listing fee via PayPal after submitting the Sell Your Car form.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                        <div>
                            <p className="font-semibold">Payments are not active.</p>
                            <p className="mt-1">
                                To start charging, make sure the listing fee is above $0 and both the PayPal Client ID and Client Secret below are saved.
                            </p>
                        </div>
                    </div>
                )}

                <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                    <Lock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                    <div>
                        <p className="font-semibold">Secure by Design</p>
                        <p className="mt-1">
                            Buyers complete payment on PayPal's hosted checkout. Card and PayPal credentials never touch this
                            server or database. Every payment is verified server-side before a listing is marked paid.
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
                                    <h2 className="text-base font-semibold text-gray-900">PayPal</h2>
                                    <p className="text-xs text-gray-500">
                                        Create REST API credentials in your <a href="https://developer.paypal.com/dashboard/applications" target="_blank" rel="noreferrer" className="text-[#F26B5E] underline">PayPal Developer Dashboard</a> and copy the Client ID and Secret.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className={labelClass}>Environment</label>
                                    <select
                                        className={inputClass}
                                        value={data.paypal_environment}
                                        onChange={(e) => setData('paypal_environment', e.target.value)}
                                    >
                                        <option value="sandbox">Sandbox (testing)</option>
                                        <option value="live">Live (real payments)</option>
                                    </select>
                                    {errors.paypal_environment && <p className="mt-1 text-xs text-red-500">{errors.paypal_environment}</p>}
                                    <p className="mt-1 text-xs text-gray-500">Use Sandbox credentials while testing, then switch to Live.</p>
                                </div>

                                <div>
                                    <label className={labelClass}>Client ID</label>
                                    <input
                                        type="text"
                                        className={inputClass}
                                        placeholder="AeA1QI...client-id"
                                        value={data.paypal_client_id}
                                        onChange={(e) => setData('paypal_client_id', e.target.value)}
                                    />
                                    {errors.paypal_client_id && <p className="mt-1 text-xs text-red-500">{errors.paypal_client_id}</p>}
                                    <p className="mt-1 text-xs text-gray-500">Safe to expose — sent to the browser to load PayPal checkout.</p>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Client Secret
                                        {settings.paypal_client_secret_set && (
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
                                        placeholder={settings.paypal_client_secret_set ? '••••••••••••  (leave blank to keep existing)' : 'ENa1Q...client-secret'}
                                        value={data.paypal_client_secret}
                                        onChange={(e) => setData('paypal_client_secret', e.target.value)}
                                    />
                                    {errors.paypal_client_secret && <p className="mt-1 text-xs text-red-500">{errors.paypal_client_secret}</p>}
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

                    {data.paypal_environment === 'live' && settings.payment_active && (
                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                            <p>
                                <span className="font-semibold">Live mode is on.</span> Real payments will be captured. Test your flow with Sandbox credentials first.
                            </p>
                        </div>
                    )}

                    {testResult && (
                        testResult.ok ? (
                            <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3">
                                <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
                                <p className="text-sm font-medium text-green-800">{testResult.message}</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-3">
                                <XCircle className="h-5 w-5 shrink-0 text-red-600" />
                                <p className="text-sm font-medium text-red-800">{testResult.message}</p>
                            </div>
                        )
                    )}

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col items-start gap-1">
                            <button
                                type="button"
                                onClick={handleTest}
                                disabled={testing}
                                className="rounded-full border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                {testing ? 'Testing…' : 'Test Connection'}
                            </button>
                            <p className="text-xs text-gray-500">Tests the saved credentials. Save your changes first.</p>
                        </div>
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
