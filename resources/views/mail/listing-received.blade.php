<x-mail::message>
# We received your listing

Hi {{ $sellerName }},

Thanks for submitting your vehicle to **Houston EZ Finance**. Here's what we got:

<x-mail::table>
| Detail | Value |
| :--- | :--- |
| Vehicle | {{ $vehicle }} |
| Listing title | {{ $title }} |
| Status | Pending review |
</x-mail::table>

@if ($paymentRequired)
Your listing requires a listing fee before it goes live. Please complete the payment from the page shown after submission to finish publishing your listing.
@else
Our team will review your listing shortly. We'll be in touch if we need anything else.
@endif

Thanks,<br>
Houston EZ Finance
</x-mail::message>
