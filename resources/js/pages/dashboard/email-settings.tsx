import { Head, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Mail, Send, XCircle } from 'lucide-react';
import { type FormEvent, useState } from 'react';

interface Settings {
    notification_email: string;
    from_address: string;
    from_name: string;
}

interface Props {
    settings: Settings;
}

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1.5 block text-sm font-medium text-gray-700';

export default function EmailSettings({ settings }: Props) {
    const flash = (usePage().props as { flash?: { success?: string } }).flash;

    const [sending, setSending] = useState(false);
    const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

    const { data, setData, put, processing, errors } = useForm({
        notification_email: settings.notification_email || '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put('/admin/email-settings', { preserveScroll: true });
    }

    async function handleSendTest() {
        setSending(true);
        setTestResult(null);
        try {
            const res = await fetch('/admin/email-settings/test', {
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
            setTestResult({ ok: false, message: 'Could not reach the server to send the test email.' });
        } finally {
            setSending(false);
        }
    }

    return (
        <>
            <Head title="Email Settings" />

            <div className="flex h-full flex-1 flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Email Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Choose where admin notifications are delivered — new car listings, contact messages, vehicle
                        inquiries, finance applications, and real estate inquiries.
                    </p>
                </div>

                {flash?.success && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-medium text-green-800">{flash.success}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-2">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F26B5E]/10">
                                    <Mail className="h-5 w-5 text-[#F26B5E]" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">Admin Notification Email</h2>
                                    <p className="text-xs text-gray-500">
                                        Every form submitted on the website sends a notification to this address.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Notification Email</label>
                                <input
                                    type="email"
                                    className={inputClass}
                                    placeholder="you@example.com"
                                    value={data.notification_email}
                                    onChange={(e) => setData('notification_email', e.target.value)}
                                />
                                {errors.notification_email && (
                                    <p className="mt-1 text-xs text-red-500">{errors.notification_email}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    Form submissions set the visitor's email as the reply-to, so you can reply directly
                                    from your inbox.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-base font-semibold text-gray-900">Sender Identity</h2>
                            <p className="mt-1 text-xs text-gray-500">
                                Outgoing emails are sent from this address. It is set by the server configuration and
                                must stay on the verified sending domain.
                            </p>

                            <div className="mt-5 space-y-4 text-sm">
                                <div>
                                    <p className="text-xs font-medium text-gray-500">From name</p>
                                    <p className="mt-0.5 font-medium text-gray-900">{settings.from_name || '—'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-500">From address</p>
                                    <p className="mt-0.5 break-all font-medium text-gray-900">{settings.from_address || '—'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                onClick={handleSendTest}
                                disabled={sending}
                                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                            >
                                <Send className="h-4 w-4" />
                                {sending ? 'Sending…' : 'Send Test Email'}
                            </button>
                            <p className="text-xs text-gray-500">Sends a test to the saved address. Save your changes first.</p>
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

EmailSettings.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Email Settings', href: '/admin/email-settings' },
    ],
};
