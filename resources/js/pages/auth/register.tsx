import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

const ACCENT = '#F26B5E';

export default function Register() {
    return (
        <>
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className="rounded-lg border-gray-300 px-4 py-3 text-sm transition focus:border-[#F26B5E] focus:ring-[#F26B5E]/20"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="rounded-lg border-gray-300 px-4 py-3 text-sm transition focus:border-[#F26B5E] focus:ring-[#F26B5E]/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
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
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    className="rounded-lg border-gray-300 px-4 py-3 text-sm transition focus:border-[#F26B5E] focus:ring-[#F26B5E]/20"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <button
                                type="submit"
                                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
                                style={{ backgroundColor: ACCENT }}
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing && <Spinner />}
                                Create account
                            </button>
                        </div>

                        <div className="text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link
                                href={login()}
                                className="font-semibold transition hover:underline"
                                style={{ color: ACCENT }}
                                tabIndex={6}
                            >
                                Log in
                            </Link>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};
