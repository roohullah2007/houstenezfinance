import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2, Mail, Phone, Clock, User } from 'lucide-react';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    subject: string;
    message: string;
    read: boolean;
    created_at: string;
}

interface Props {
    message: ContactMessage;
}

export default function ShowContactMessage({ message }: Props) {
    function handleDelete() {
        if (confirm('Delete this message?')) {
            router.delete(`/admin/contact-messages/${message.id}`);
        }
    }

    return (
        <>
            <Head title={`Message: ${message.subject}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/contact-messages" className="rounded-lg border border-gray-300 p-2 transition hover:bg-gray-100">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">{message.subject}</h1>
                            <p className="text-sm text-gray-500">Received {new Date(message.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                    <button onClick={handleDelete} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700">
                        <Trash2 className="h-4 w-4" /> Delete
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Message</h3>
                            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{message.message}</p>
                        </div>
                    </div>
                    <div>
                        <div className="rounded-xl border border-gray-200 bg-white p-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Sender Details</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <User className="h-4 w-4 text-gray-400" />
                                    {message.name}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <a href={`mailto:${message.email}`} className="hover:text-blue-600">{message.email}</a>
                                </div>
                                {message.phone && (
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <a href={`tel:${message.phone}`} className="hover:text-blue-600">{message.phone}</a>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Clock className="h-4 w-4 text-gray-400" />
                                    {new Date(message.created_at).toLocaleDateString('en-US')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ShowContactMessage.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Contact Messages', href: '/admin/contact-messages' },
        { title: 'View Message', href: '#' },
    ],
};
