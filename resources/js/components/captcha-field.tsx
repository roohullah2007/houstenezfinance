import { usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

interface CaptchaData {
    captcha_token: string;
    captcha_answer: string;
    website: string;
}

interface Props<T extends CaptchaData> {
    data: T;
    setData: <K extends keyof T>(key: K, value: T[K]) => void;
    errors: Partial<Record<keyof T, string>>;
}

export function CaptchaField<T extends CaptchaData>({ data, setData, errors }: Props<T>) {
    const { captcha } = usePage<{ captcha: { token: string; question: string } }>().props;

    useEffect(() => {
        if (captcha?.token && data.captcha_token !== captcha.token) {
            setData('captcha_token' as keyof T, captcha.token as T[keyof T]);
        }
    }, [captcha?.token]);

    return (
        <>
            {/* Honeypot — bots fill it, humans don't see it */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
                <label>
                    Leave this field empty
                    <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={data.website}
                        onChange={(e) => setData('website' as keyof T, e.target.value as T[keyof T])}
                    />
                </label>
            </div>

            <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
                    <ShieldCheck className="h-4 w-4 text-[#F26B5E]" />
                    {captcha?.question ?? 'Verify you are human'}
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="Your answer"
                    value={data.captcha_answer}
                    onChange={(e) => setData('captcha_answer' as keyof T, e.target.value as T[keyof T])}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-[#F26B5E] focus:outline-none focus:ring-2 focus:ring-[#F26B5E]/20"
                />
                {errors.captcha_answer && <p className="mt-1 text-xs text-red-500">{String(errors.captcha_answer)}</p>}
            </div>
        </>
    );
}
