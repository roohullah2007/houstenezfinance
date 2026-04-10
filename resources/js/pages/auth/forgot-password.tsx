import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

const ACCENT = '#F26B5E';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="space-y-6">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="email@example.com"
                                    className="rounded-lg border-gray-300 px-4 py-3 text-sm transition focus:border-[#F26B5E] focus:ring-[#F26B5E]/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="my-6">
                                <button
                                    type="submit"
                                    className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
                                    style={{ backgroundColor: ACCENT }}
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <LoaderCircle className="h-4 w-4 animate-spin" />
                                    )}
                                    Email password reset link
                                </button>
                            </div>
                        </>
                    )}
                </Form>

                <div className="space-x-1 text-center text-sm text-gray-500">
                    <span>Or, return to</span>
                    <Link
                        href={login()}
                        className="font-semibold transition hover:underline"
                        style={{ color: ACCENT }}
                    >
                        log in
                    </Link>
                </div>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};
