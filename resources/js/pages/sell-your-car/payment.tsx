import { Head, router } from '@inertiajs/react';
import { PublicHeader } from '@/components/public-header';
import { useEffect, useRef, useState } from 'react';
import { Lock, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

const ACCENT = '#F26B5E';

declare global {
    interface Window {
        paypal?: any;
    }
}

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
    paypal_client_id: string;
    paypal_environment: string;
    amount: number;
    currency: string;
    listing: Listing;
}

function csrfToken(): string {
    return (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content || '';
}

const fetchHeaders = () => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': csrfToken(),
});

export default function SellYourCarPayment({ token, paypal_client_id, amount, currency, listing }: Props) {
    const buttonsRef = useRef<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        function renderButtons() {
            if (cancelled || !window.paypal || !buttonsRef.current) return;
            buttonsRef.current.innerHTML = '';

            window.paypal
                .Buttons({
                    createOrder: async () => {
                        const res = await fetch(`/sell-your-car/payment/${token}/order`, {
                            method: 'POST',
                            credentials: 'same-origin',
                            headers: fetchHeaders(),
                        });
                        if (!res.ok) {
                            const detail = await res.text();
                            // Surface the server's error detail so the real cause is
                            // visible in the console even though the SDK swallows it.
                            console.error(`createOrder failed: HTTP ${res.status}`, detail);
                            let message = 'Could not start PayPal checkout.';
                            try {
                                message = JSON.parse(detail).error || message;
                            } catch {
                                // non-JSON body (e.g. an HTML error page) — keep default
                            }
                            throw new Error(message);
                        }
                        const data = await res.json();
                        return data.id;
                    },
                    onApprove: async (_data: any, actions: any) => {
                        try {
                            const res = await fetch(`/sell-your-car/payment/${token}/capture`, {
                                method: 'POST',
                                credentials: 'same-origin',
                                headers: fetchHeaders(),
                            });
                            const data = await res.json();
                            if (res.ok && data.status === 'completed') {
                                router.visit('/sell-your-car/thank-you');
                            } else if (data.code === 'INSTRUMENT_DECLINED') {
                                // PayPal-recommended recovery: reopen the popup so the
                                // buyer can pick a different funding source.
                                setError(data.error || 'Your payment method was declined. Please try a different way to pay.');

                                return actions.restart();
                            } else {
                                setError(data.error || 'Payment could not be verified.');
                            }
                        } catch {
                            setError('Payment could not be verified. Please try again.');
                        }
                    },
                    onError: (err: any) => {
                        // The PayPal SDK normally swallows the underlying error.
                        // Log the full object so the real cause is visible in the
                        // browser console (DevTools) even without server access.
                        console.error('PayPal onError:', err);
                        const detail = err?.message || (typeof err === 'string' ? err : '');
                        setError(
                            detail
                                ? `Something went wrong with PayPal: ${detail}`
                                : 'Something went wrong with PayPal. Please try again.',
                        );
                    },
                })
                .render(buttonsRef.current)
                .then(() => {
                    if (!cancelled) setReady(true);
                })
                .catch(() => {
                    if (!cancelled) setError('Could not load PayPal checkout.');
                });
        }

        if (window.paypal) {
            renderButtons();
            return () => {
                cancelled = true;
            };
        }

        const src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypal_client_id)}&currency=${encodeURIComponent(currency)}&intent=capture`;
        let script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;

        if (!script) {
            script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = () => renderButtons();
            script.onerror = () => {
                if (!cancelled) setError('Could not load PayPal. Please check your connection and try again.');
            };
            document.body.appendChild(script);
        } else {
            script.addEventListener('load', renderButtons);
        }

        return () => {
            cancelled = true;
            script?.removeEventListener('load', renderButtons);
        };
    }, [token, paypal_client_id, currency]);

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
                                        <p className="text-xs text-gray-500">Powered by PayPal — SSL encrypted</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                {!ready && !error && (
                                    <div className="flex items-center justify-center py-16">
                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#F26B5E]" />
                                    </div>
                                )}

                                <div ref={buttonsRef} className={ready ? 'block' : 'hidden'} />

                                {ready && (
                                    <p className="mt-4 text-center text-xs text-gray-500">
                                        Secured by PayPal — pay with your PayPal balance or any major card.
                                    </p>
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
                                            <p className="mt-1">Payments are processed by PayPal. Your financial details are never stored on our servers.</p>
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
