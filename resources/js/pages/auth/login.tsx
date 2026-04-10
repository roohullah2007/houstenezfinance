import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

const ACCENT = '#F26B5E';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="rounded-lg border-gray-300 px-4 py-3 text-sm transition focus:border-[#F26B5E] focus:ring-[#F26B5E]/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            className="ml-auto text-sm font-medium transition hover:text-[#F26B5E]"
                                            style={{ color: ACCENT }}
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Password"
                                    className="rounded-lg border-gray-300 px-4 py-3 text-sm transition focus:border-[#F26B5E] focus:ring-[#F26B5E]/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-sm text-gray-600">Remember me</Label>
                            </div>

                            <button
                                type="submit"
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
                                style={{ backgroundColor: ACCENT }}
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link
                                    href={register()}
                                    className="font-semibold transition hover:underline"
                                    style={{ color: ACCENT }}
                                    tabIndex={5}
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};
