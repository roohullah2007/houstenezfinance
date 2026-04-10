import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

const ACCENT = '#F26B5E';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Reset password" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="rounded-lg border-gray-300 px-4 py-3 text-sm"
                                readOnly
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="Password"
                                className="rounded-lg border-gray-300 px-4 py-3 text-sm transition focus:border-[#F26B5E] focus:ring-[#F26B5E]/20"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                                Confirm password
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Confirm password"
                                className="rounded-lg border-gray-300 px-4 py-3 text-sm transition focus:border-[#F26B5E] focus:ring-[#F26B5E]/20"
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <button
                            type="submit"
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
                            style={{ backgroundColor: ACCENT }}
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            Reset password
                        </button>
                    </div>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below',
};
