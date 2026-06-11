<x-mail::message>
# You have a new inquiry

Hi {{ $sellerName }},

Someone is interested in your **{{ $vehicle }}** listed on Houston EZ Finance.

<x-mail::table>
| Detail | Value |
| :--- | :--- |
| Name | {{ $inquirerName }} |
| Email | {{ $inquirerEmail }} |
| Phone | {{ $inquirerPhone ?: '—' }} |
</x-mail::table>

**Message:**

{{ $inquiryMessage }}

You can reply directly to this email to get in touch with them.

Thanks,<br>
Houston EZ Finance
</x-mail::message>
