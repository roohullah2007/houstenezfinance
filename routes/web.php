<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::inertia('/car-listings', 'car-listings')->name('car-listings');
Route::inertia('/categories', 'categories')->name('categories');
Route::inertia('/locations', 'locations')->name('locations');
Route::inertia('/dealers', 'dealers')->name('dealers');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
