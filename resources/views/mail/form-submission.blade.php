<x-mail::message>
# New {{ $formType }}

{{ $summary }}

<x-mail::table>
| Field | Detail |
| :--- | :--- |
@foreach ($fields as $label => $value)
| {{ $label }} | {{ $value === null || $value === '' ? '—' : $value }} |
@endforeach
</x-mail::table>

This notification was sent automatically from the Houston EZ Finance website.
</x-mail::message>
