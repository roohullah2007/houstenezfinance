<x-mail::message>
# Welcome, {{ $name }}!

Thanks for creating an account with **Houston EZ Finance**. Your account is ready to go.

You can now sign in to browse vehicles, list your car, and manage your submissions.

<x-mail::button :url="$loginUrl">
Sign In
</x-mail::button>

If you didn't create this account, you can safely ignore this email.

Thanks,<br>
Houston EZ Finance
</x-mail::message>
