import { Head, router } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Lock, CheckCircle2, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

const ACCENT = '#F26B5E';

interface Listing {
    title: string;
    year: number;
    make: string;
    model: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface Props {
    token: string;
    publishable_key: string;
    amount: number;
    currency: string;
    listing: Listing;
}

function PaymentForm({ token, amount, currency }: { token: string; amount: number; currency: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!stripe || !elements) return;

        setSubmitting(true);
        setError(null);

        const { error: submitError } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/sell-your-car/payment/${token}/confirm`,
            },
        });

        if (submitError) {
            setError(submitError.message || 'Payment could not be processed.');
            setSubmitting(false);
        }
    }

    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
                <PaymentElement options={{ layout: 'tabs' }} />
            </div>

            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                    <p>{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
                style={{ backgroundColor: ACCENT }}
            >
                <Lock className="h-4 w-4" />
                {submitting ? 'Processing…' : `Pay ${formatted}`}
            </button>

            <p className="text-center text-xs text-gray-500">
                Secured by Stripe — card details never touch our servers.
            </p>
        </form>
    );
}

export default function SellYourCarPayment({ token, publishable_key, amount, currency, listing }: Props) {
    const [stripePromise] = useState<Promise<Stripe | null>>(() => loadStripe(publishable_key));
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        fetch(`/sell-your-car/payment/${token}/intent`, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content || '',
            },
            signal: controller.signal,
        })
            .then(async (r) => {
                if (!r.ok) throw new Error((await r.json()).error || 'Could not start payment.');
                return r.json();
            })
            .then((data) => setClientSecret(data.client_secret))
            .catch((err) => {
                if (err.name !== 'AbortError') setLoadError(err.message);
            });
        return () => controller.abort();
    }, [token]);

    const appearance = useMemo(
        () => ({
            theme: 'stripe' as const,
            variables: {
                colorPrimary: ACCENT,
                colorBackground: '#ffffff',
                colorText: '#0f172a',
                borderRadius: '8px',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            },
        }),
        [],
    );

    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amount);

    return (
        <>
            <Head title="Complete Payment — Houston EZ Finance">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>

            <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#0b1020] via-[#111834] to-[#0b1020] text-white">
                    <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl" style={{ background: ACCENT }} />
                    <PublicHeader />
                    <div className="relative z-10 mx-auto max-w-5xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
                        <button
                            type="button"
                            onClick={() => router.visit('/sell-your-car')}
                            className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Sell Your Car
                        </button>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Complete Your Listing Payment</h1>
                        <p className="mt-2 max-w-2xl text-white/70">
                            A quick last step — pay the listing fee and we'll review your submission.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="grid gap-6 lg:grid-cols-5">
                        <div className="lg:col-span-3">
                            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `${ACCENT}15` }}>
                                        <Lock className="h-5 w-5" style={{ color: ACCENT }} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Payment Details</h2>
                                        <p className="text-xs text-gray-500">Powered by Stripe — SSL encrypted</p>
                                    </div>
                                </div>

                                {loadError && (
                                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                        <p>{loadError}</p>
                                    </div>
                                )}

                                {!clientSecret && !loadError && (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#F26B5E]" />
                                    </div>
                                )}

                                {clientSecret && (
                                    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                                        <PaymentForm token={token} amount={amount} currency={currency} />
                                    </Elements>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="sticky top-6 space-y-4">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-500">Your Listing</h3>
                                    <p className="mt-3 text-base font-semibold text-gray-900">{listing.year} {listing.make} {listing.model}</p>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{listing.title}</p>
                                    <div className="mt-4 border-t border-gray-100 pt-4 text-sm text-gray-600">
                                        <p>{listing.first_name} {listing.last_name}</p>
                                        <p className="text-gray-500">{listing.email}</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-500">Order Summary</h3>
                                    <div className="mt-4 flex items-baseline justify-between border-b border-gray-100 pb-3 text-sm">
                                        <span className="text-gray-600">Listing fee</span>
                                        <span className="font-medium text-gray-900">{formatted}</span>
                                    </div>
                                    <div className="mt-3 flex items-baseline justify-between">
                                        <span className="text-base font-semibold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-gray-900">{formatted}</span>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" style={{ color: ACCENT }} />
                                        <div className="text-xs leading-relaxed text-gray-600">
                                            <p className="font-semibold text-gray-900">Secure Checkout</p>
                                            <p className="mt-1">Card details are handled by Stripe and never stored on our servers.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
