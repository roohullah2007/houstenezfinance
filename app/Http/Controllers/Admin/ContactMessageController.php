<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactMessageController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard/contact-messages', [
            'messages' => ContactMessage::latest()->paginate(15),
        ]);
    }

    public function show(ContactMessage $contactMessage)
    {
        $contactMessage->update(['read' => true]);

        return Inertia::render('dashboard/contact-messages/show', [
            'message' => $contactMessage,
        ]);
    }

    public function destroy(ContactMessage $contactMessage)
    {
        $contactMessage->delete();

        return redirect()->route('admin.contact-messages.index')->with('success', 'Message deleted.');
    }
}
