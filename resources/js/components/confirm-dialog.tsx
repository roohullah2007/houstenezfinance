import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

type ConfirmTone = 'default' | 'success' | 'danger';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: ConfirmTone;
    loading?: boolean;
    onConfirm: () => void;
}

const TONE_CLASSES: Record<ConfirmTone, { ring: string; button: string; iconWrap: string; icon: string }> = {
    default: {
        ring: 'ring-gray-200',
        button: 'bg-[#F26B5E] hover:brightness-110',
        iconWrap: 'bg-[#F26B5E]/10',
        icon: 'text-[#F26B5E]',
    },
    success: {
        ring: 'ring-green-100',
        button: 'bg-green-600 hover:bg-green-700',
        iconWrap: 'bg-green-100',
        icon: 'text-green-600',
    },
    danger: {
        ring: 'ring-red-100',
        button: 'bg-red-600 hover:bg-red-700',
        iconWrap: 'bg-red-100',
        icon: 'text-red-600',
    },
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    tone = 'default',
    loading = false,
    onConfirm,
}: ConfirmDialogProps) {
    const t = TONE_CLASSES[tone];
    const Icon = tone === 'danger' ? AlertCircle : tone === 'success' ? CheckCircle2 : AlertCircle;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mb-3 flex items-start gap-4">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${t.iconWrap}`}>
                            <Icon className={`h-5 w-5 ${t.icon}`} />
                        </div>
                        <div className="flex-1">
                            <DialogTitle className="text-base font-semibold text-gray-900">{title}</DialogTitle>
                            {description && (
                                <DialogDescription className="mt-1.5 text-sm leading-relaxed text-gray-500">
                                    {description}
                                </DialogDescription>
                            )}
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-2">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:opacity-60 ${t.button}`}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {confirmLabel}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
