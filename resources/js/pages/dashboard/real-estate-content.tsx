import { Head, useForm } from '@inertiajs/react';
import { FileText, Save } from 'lucide-react';
import { type FormEvent } from 'react';

const ACCENT = '#F26B5E';

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';
const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

interface Content {
    id: number;
    heading: string;
    body: string | null;
    secondary_heading: string | null;
    secondary_body: string | null;
}

interface Props {
    content: Content;
}

export default function RealEstateContent({ content }: Props) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        heading: content.heading,
        body: content.body ?? '',
        secondary_heading: content.secondary_heading ?? '',
        secondary_body: content.secondary_body ?? '',
    });

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        put('/admin/real-estate-content');
    }

    return (
        <>
            <Head title="Real Estate Page Content" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}15` }}>
                        <FileText className="h-5 w-5" style={{ color: ACCENT }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Real Estate Page Content</h1>
                        <p className="mt-0.5 text-sm text-gray-500">
                            Editable content blocks shown on the public /real-estate page, above the contact form.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-baseline justify-between">
                            <h2 className="text-base font-semibold text-gray-900">Block 1 — Programs &amp; Grants</h2>
                            <span className="text-xs text-gray-500">Shown first</span>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Heading</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    value={data.heading}
                                    onChange={(e) => setData('heading', e.target.value)}
                                />
                                {errors.heading && <p className="mt-1 text-xs text-red-500">{errors.heading}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Body (optional)</label>
                                <textarea
                                    className={`${inputClass} min-h-[160px] resize-y`}
                                    placeholder="Add any details or program information you want to show on the page..."
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    rows={7}
                                />
                                <p className="mt-1 text-xs text-gray-500">Plain text. Line breaks are preserved.</p>
                                {errors.body && <p className="mt-1 text-xs text-red-500">{errors.body}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-baseline justify-between">
                            <h2 className="text-base font-semibold text-gray-900">Block 2 — Dealer / Finance Network</h2>
                            <span className="text-xs text-gray-500">Shown second</span>
                        </div>
                        <div className="space-y-5">
                            <div>
                                <label className={labelClass}>Heading</label>
                                <input
                                    type="text"
                                    className={inputClass}
                                    placeholder="e.g., Trusted Dealer Network"
                                    value={data.secondary_heading}
                                    onChange={(e) => setData('secondary_heading', e.target.value)}
                                />
                                {errors.secondary_heading && <p className="mt-1 text-xs text-red-500">{errors.secondary_heading}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Body (optional)</label>
                                <textarea
                                    className={`${inputClass} min-h-[160px] resize-y`}
                                    placeholder="Describe your dealer network, in-house financing options, etc."
                                    value={data.secondary_body}
                                    onChange={(e) => setData('secondary_body', e.target.value)}
                                    rows={7}
                                />
                                <p className="mt-1 text-xs text-gray-500">Leave both fields blank to hide this block.</p>
                                {errors.secondary_body && <p className="mt-1 text-xs text-red-500">{errors.secondary_body}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {recentlySuccessful && (
                            <p className="text-sm font-medium text-green-600">Saved.</p>
                        )}
                        <div className="ml-auto">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white hover:brightness-110 disabled:opacity-50"
                                style={{ backgroundColor: ACCENT }}
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

RealEstateContent.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Real Estate Content', href: '/admin/real-estate-content' },
    ],
};
