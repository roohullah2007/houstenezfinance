import { Head } from '@inertiajs/react';
import { Mail, MessageSquare, Phone } from 'lucide-react';

const ACCENT = '#F26B5E';

interface Inquiry {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    created_at: string;
    car_listing: {
        id: number;
        title: string;
        year: number;
        make: string;
        model: string;
    } | null;
}

interface Props {
    inquiries: Inquiry[];
}

export default function MyInquiries({ inquiries }: Props) {
    return (
        <>
            <Head title="My Inquiries" />

            <div className="flex h-full flex-1 flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Inquiries</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Messages from buyers interested in your listings. Reply directly via email or phone.
                    </p>
                </div>

                {inquiries.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
                        <MessageSquare className="mx-auto h-10 w-10 text-gray-300" />
                        <p className="mt-3 text-sm font-medium text-gray-900">No inquiries yet</p>
                        <p className="mt-1 text-sm text-gray-500">
                            When buyers ask about your listings, their messages will show up here and be emailed to you.
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {inquiries.map((inquiry) => (
                            <div key={inquiry.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                        <p className="font-semibold text-gray-900">{inquiry.name}</p>
                                        <p className="text-xs text-gray-500">
                                            About:{' '}
                                            <span className="font-medium text-gray-700">
                                                {inquiry.car_listing
                                                    ? `${inquiry.car_listing.year} ${inquiry.car_listing.make} ${inquiry.car_listing.model} — ${inquiry.car_listing.title}`
                                                    : 'Listing removed'}
                                            </span>
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {new Date(inquiry.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>

                                <p className="mt-3 whitespace-pre-line rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                                    {inquiry.message}
                                </p>

                                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                    <a
                                        href={`mailto:${inquiry.email}`}
                                        className="inline-flex items-center gap-1.5 font-medium hover:underline"
                                        style={{ color: ACCENT }}
                                    >
                                        <Mail className="h-4 w-4" />
                                        {inquiry.email}
                                    </a>
                                    {inquiry.phone && (
                                        <a
                                            href={`tel:${inquiry.phone}`}
                                            className="inline-flex items-center gap-1.5 font-medium text-gray-600 hover:underline"
                                        >
                                            <Phone className="h-4 w-4" />
                                            {inquiry.phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

MyInquiries.layout = {
    breadcrumbs: [
        { title: 'My Dashboard', href: '/dashboard' },
        { title: 'My Inquiries', href: '/my-inquiries' },
    ],
};
