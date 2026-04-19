<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RealEstatePageContent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RealEstatePageContentController extends Controller
{
    public function edit()
    {
        return Inertia::render('dashboard/real-estate-content', [
            'content' => RealEstatePageContent::singleton(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'heading' => 'required|string|max:255',
            'body' => 'nullable|string|max:10000',
            'secondary_heading' => 'nullable|string|max:255',
            'secondary_body' => 'nullable|string|max:10000',
        ]);

        $content = RealEstatePageContent::singleton();
        $content->update($validated);

        return redirect()->route('admin.real-estate-content.edit')->with('success', 'Content updated.');
    }
}
