<?php

use App\Http\Controllers\Admin\CarListingController as AdminCarListingController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FinanceApplicationController as AdminFinanceApplicationController;
use App\Http\Controllers\Admin\InquiryController as AdminInquiryController;
use App\Http\Controllers\Admin\RealEstateListingController as AdminRealEstateListingController;
use App\Http\Controllers\Admin\RealEstatePageContentController as AdminRealEstatePageContentController;
use App\Http\Controllers\CarListingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FinanceApplicationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InquiryController;
use App\Http\Controllers\RealEstateController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/car-listings', [CarListingController::class, 'index'])->name('car-listings');
Route::get('/car-listings/suggestions', [CarListingController::class, 'suggestions'])->name('car-listings.suggestions');
Route::get('/car-listings/{carListing}', [CarListingController::class, 'show'])->name('car-listings.show');
Route::post('/car-listings/{carListing}/inquiry', [InquiryController::class, 'store'])->name('car-listings.inquiry');
Route::inertia('/categories', 'categories')->name('categories');
Route::inertia('/locations', 'locations')->name('locations');
Route::inertia('/dealers', 'dealers')->name('dealers');

Route::get('/sell-your-car', [CarListingController::class, 'create'])->name('sell-your-car');
Route::post('/sell-your-car', [CarListingController::class, 'store'])->name('sell-your-car.store');

Route::get('/contact', [ContactController::class, 'create'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/finance-application', [FinanceApplicationController::class, 'create'])->name('finance-application');
Route::post('/finance-application', [FinanceApplicationController::class, 'store'])->name('finance-application.store');

Route::get('/real-estate', [RealEstateController::class, 'index'])->name('real-estate');
Route::post('/real-estate', [RealEstateController::class, 'store'])->name('real-estate.store');
Route::get('/real-estate/{realEstateListing:slug}', [RealEstateController::class, 'show'])->name('real-estate.show');
Route::post('/real-estate/{realEstateListing:slug}/inquiry', [RealEstateController::class, 'storeInquiry'])->name('real-estate.inquiry');

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

    Route::get('real-estate-listings', [AdminRealEstateListingController::class, 'index'])->name('real-estate-listings.index');
    Route::get('real-estate-listings/create', [AdminRealEstateListingController::class, 'create'])->name('real-estate-listings.create');
    Route::post('real-estate-listings', [AdminRealEstateListingController::class, 'store'])->name('real-estate-listings.store');
    Route::get('real-estate-listings/{realEstateListing}', [AdminRealEstateListingController::class, 'show'])->name('real-estate-listings.show');
    Route::get('real-estate-listings/{realEstateListing}/edit', [AdminRealEstateListingController::class, 'edit'])->name('real-estate-listings.edit');
    Route::put('real-estate-listings/{realEstateListing}', [AdminRealEstateListingController::class, 'update'])->name('real-estate-listings.update');
    Route::patch('real-estate-listings/{realEstateListing}/sold', [AdminRealEstateListingController::class, 'markSold'])->name('real-estate-listings.mark-sold');
    Route::patch('real-estate-listings/{realEstateListing}/active', [AdminRealEstateListingController::class, 'markActive'])->name('real-estate-listings.mark-active');
    Route::delete('real-estate-listings/{realEstateListing}', [AdminRealEstateListingController::class, 'destroy'])->name('real-estate-listings.destroy');

    Route::get('real-estate-content', [AdminRealEstatePageContentController::class, 'edit'])->name('real-estate-content.edit');
    Route::put('real-estate-content', [AdminRealEstatePageContentController::class, 'update'])->name('real-estate-content.update');

    Route::get('finance-applications', [AdminFinanceApplicationController::class, 'index'])->name('finance-applications.index');
    Route::get('finance-applications/{financeApplication}', [AdminFinanceApplicationController::class, 'show'])->name('finance-applications.show');
    Route::patch('finance-applications/{financeApplication}/status', [AdminFinanceApplicationController::class, 'updateStatus'])->name('finance-applications.update-status');
    Route::delete('finance-applications/{financeApplication}', [AdminFinanceApplicationController::class, 'destroy'])->name('finance-applications.destroy');

    Route::get('contact-messages', [ContactMessageController::class, 'index'])->name('contact-messages.index');
    Route::get('contact-messages/{contactMessage}', [ContactMessageController::class, 'show'])->name('contact-messages.show');
    Route::delete('contact-messages/{contactMessage}', [ContactMessageController::class, 'destroy'])->name('contact-messages.destroy');
    Route::get('inquiries', [AdminInquiryController::class, 'index'])->name('inquiries.index');
    Route::get('inquiries/{inquiry}', [AdminInquiryController::class, 'show'])->name('inquiries.show');
    Route::patch('inquiries/{inquiry}/status', [AdminInquiryController::class, 'updateStatus'])->name('inquiries.update-status');
    Route::delete('inquiries/{inquiry}', [AdminInquiryController::class, 'destroy'])->name('inquiries.destroy');
});

require __DIR__.'/settings.php';
