import { Head, Link, router } from '@inertiajs/react';
import { Eye, Trash2, Mail, MailOpen, Clock } from 'lucide-react';

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

interface PaginatedMessages {
    data: ContactMessage[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    messages: PaginatedMessages;
}

export default function ContactMessages({ messages }: Props) {
    function handleDelete(id: number) {
        if (confirm('Delete this message?')) {
            router.delete(`/admin/contact-messages/${id}`);
        }
    }

    return (
        <>
            <Head title="Contact Messages" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Contact Messages</h1>
                    <p className="text-sm text-gray-500">{messages.total} messages received</p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">From</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Subject</th>
                                    <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                                    <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {messages.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-12 text-center">
                                            <Mail className="mx-auto h-12 w-12 text-gray-300" />
                                            <p className="mt-3 text-sm text-gray-500">No messages yet</p>
                                        </td>
                                    </tr>
                                ) : (
                                    messages.data.map((msg) => (
                                        <tr key={msg.id} className={`transition hover:bg-gray-50 ${!msg.read ? 'bg-blue-50/40' : ''}`}>
                                            <td className="px-4 py-3">
                                                {msg.read ? (
                                                    <MailOpen className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <Mail className="h-4 w-4 text-blue-500" />
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className={`${!msg.read ? 'font-semibold' : ''} text-gray-900`}>{msg.name}</p>
                                                <p className="text-xs text-gray-500">{msg.email}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className={`${!msg.read ? 'font-semibold' : ''} text-gray-900`}>{msg.subject}</p>
                                                <p className="max-w-xs truncate text-xs text-gray-500">{msg.message}</p>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {new Date(msg.created_at).toLocaleDateString('en-US')}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/admin/contact-messages/${msg.id}`} className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-blue-600">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(msg.id)} className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {messages.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
                            <p className="text-sm text-gray-500">Page {messages.current_page} of {messages.last_page}</p>
                            <div className="flex gap-1">
                                {messages.links.map((link, i) => (
                                    <button
                                        key={i}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                        className={`rounded-lg px-3 py-1.5 text-sm transition ${link.active ? 'bg-blue-600 text-white' : link.url ? 'text-gray-600 hover:bg-gray-100' : 'cursor-not-allowed text-gray-300'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

ContactMessages.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Contact Messages', href: '/admin/contact-messages' },
    ],
};
