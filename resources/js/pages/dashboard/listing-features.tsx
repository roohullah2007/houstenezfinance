import { Head, router, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Plus, Trash2, Tag, Eye, EyeOff } from 'lucide-react';
import { useState, type FormEvent } from 'react';

interface Feature {
    id: number;
    name: string;
    sort_order: number;
    is_active: boolean;
}

interface Props {
    features: Feature[];
}

const inputClass = 'w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20';

export default function ListingFeatures({ features }: Props) {
    const flash = (usePage().props as { flash?: { success?: string } }).flash;
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });

    function handleAdd(e: FormEvent) {
        e.preventDefault();
        post('/admin/listing-features', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    function toggleActive(feature: Feature) {
        router.put(
            `/admin/listing-features/${feature.id}`,
            { is_active: !feature.is_active },
            { preserveScroll: true },
        );
    }

    function startEditing(feature: Feature) {
        setEditingId(feature.id);
        setEditingName(feature.name);
    }

    function saveEdit(id: number) {
        router.put(
            `/admin/listing-features/${id}`,
            { name: editingName },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingId(null);
                    setEditingName('');
                },
            },
        );
    }

    function deleteFeature(id: number) {
        if (!confirm('Delete this feature? Existing listings that use it will keep the value as plain text.')) return;
        router.delete(`/admin/listing-features/${id}`, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Listing Features" />

            <div className="flex h-full flex-1 flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Listing Features</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            These are the feature checkboxes sellers see on the Sell Your Car form.
                            Add, edit, hide, or delete them here — changes appear on the form immediately.
                        </p>
                    </div>
                </div>

                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <p className="text-sm font-medium text-green-800">{flash.success}</p>
                    </div>
                )}

                <form onSubmit={handleAdd} className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F26B5E]/10">
                            <Plus className="h-5 w-5 text-[#F26B5E]" />
                        </div>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g., Panoramic Sunroof"
                            className={inputClass}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing || !data.name.trim()}
                        className="inline-flex items-center gap-2 rounded-full bg-[#F26B5E] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-50"
                    >
                        <Plus className="h-4 w-4" />
                        Add Feature
                    </button>
                </form>
                {errors.name && <p className="-mt-3 text-xs text-red-500">{errors.name}</p>}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <Tag className="h-4 w-4" />
                            {features.length} feature{features.length === 1 ? '' : 's'}
                        </div>
                        <p className="text-xs text-gray-500">Active features appear on the Sell Your Car form.</p>
                    </div>

                    <ul className="divide-y divide-gray-100">
                        {features.length === 0 && (
                            <li className="px-5 py-10 text-center text-sm text-gray-500">
                                No features yet — add one above.
                            </li>
                        )}
                        {features.map((f) => (
                            <li key={f.id} className="flex items-center gap-3 px-5 py-3">
                                <div className="flex-1">
                                    {editingId === f.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                autoFocus
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEdit(f.id);
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                className={inputClass}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => saveEdit(f.id)}
                                                className="rounded-lg bg-[#F26B5E] px-3 py-2 text-xs font-semibold text-white"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingId(null)}
                                                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => startEditing(f)}
                                            className="text-left text-sm font-medium text-gray-900 hover:text-[#F26B5E]"
                                        >
                                            {f.name}
                                            {!f.is_active && (
                                                <span className="ml-2 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
                                                    Hidden
                                                </span>
                                            )}
                                        </button>
                                    )}
                                </div>
                                {editingId !== f.id && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => toggleActive(f)}
                                            title={f.is_active ? 'Hide from form' : 'Show on form'}
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                                        >
                                            {f.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteFeature(f.id)}
                                            title="Delete"
                                            className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

ListingFeatures.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Listing Features', href: '/admin/listing-features' },
    ],
};
