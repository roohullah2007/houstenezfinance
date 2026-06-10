<x-mail::message>
# New sign-in detected

Hi {{ $name }},

We noticed a new sign-in to your **Houston EZ Finance** account.

<x-mail::table>
| Detail | Value |
| :--- | :--- |
| Time | {{ $time ?: '—' }} |
| IP address | {{ $ip ?: '—' }} |
| Device / browser | {{ $userAgent ?: '—' }} |
</x-mail::table>

If this was you, no action is needed. If you don't recognize this activity, please reset your password right away.

Thanks,<br>
Houston EZ Finance
</x-mail::message>
