@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
<img src="{{ config('mail.logo_url') }}" alt="{{ config('app.name') }}" style="width: 220px; height: auto; max-width: 100%;">
</a>
</td>
</tr>
