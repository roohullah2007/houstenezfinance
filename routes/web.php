<?php

use App\Http\Controllers\Admin\CarListingController as AdminCarListingController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\CarListingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\InquiryController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::get('/car-listings', [CarListingController::class, 'index'])->name('car-listings');
Route::get('/car-listings/{carListing}', [CarListingController::class, 'show'])->name('car-listings.show');
Route::post('/car-listings/{carListing}/inquiry', [InquiryController::class, 'store'])->name('car-listings.inquiry');
Route::inertia('/categories', 'categories')->name('categories');
Route::inertia('/locations', 'locations')->name('locations');
Route::inertia('/dealers', 'dealers')->name('dealers');

Route::get('/sell-your-car', [CarListingController::class, 'create'])->name('sell-your-car');
Route::post('/sell-your-car', [CarListingController::class, 'store'])->name('sell-your-car.store');

Route::get('/contact', [ContactController::class, 'create'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('car-listings', [AdminCarListingController::class, 'index'])->name('car-listings.index');
    Route::get('car-listings/create', [AdminCarListingController::class, 'create'])->name('car-listings.create');
    Route::post('car-listings', [AdminCarListingController::class, 'store'])->name('car-listings.store');
    Route::get('car-listings/{carListing}', [AdminCarListingController::class, 'show'])->name('car-listings.show');
    Route::get('car-listings/{carListing}/edit', [AdminCarListingController::class, 'edit'])->name('car-listings.edit');
    Route::put('car-listings/{carListing}', [AdminCarListingController::class, 'update'])->name('car-listings.update');
    Route::patch('car-listings/{carListing}/approve', [AdminCarListingController::class, 'approve'])->name('car-listings.approve');
    Route::patch('car-listings/{carListing}/reject', [AdminCarListingController::class, 'reject'])->name('car-listings.reject');
    Route::delete('car-listings/{carListing}', [AdminCarListingController::class, 'destroy'])->name('car-listings.destroy');
    Route::get('contact-messages', [ContactMessageController::class, 'index'])->name('contact-messages.index');
    Route::get('contact-messages/{contactMessage}', [ContactMessageController::class, 'show'])->name('contact-messages.show');
    Route::delete('contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy'])->name('contact-messages.destroy');
    Route::get('inquiries', [AdminInquiryController::class, 'index'])->name('inquiries.index');
    Route::get('inquiries/{inquiry}', [AdminInquiryController::class, 'show'])->name('inquiries.show');
    Route::patch('inquiries/{inquiry}/status', [AdminInquiryController::class, 'updateStatus'])->name('inquiries.update-status');
    Route::delete('inquiries/{inquiry}', [AdminInquiryController::class, 'destroy'])->name('inquiries.destroy');
});

require __DIR__.'/settings.php';
