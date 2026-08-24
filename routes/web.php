<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SubscriberController;

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery');
Route::get('/donate', [HomeController::class, 'donate'])->name('donate');
Route::get('/events/{slug}', [HomeController::class, 'showEvent'])->name('events.show');

// Secret Admin Portal Routes (Only /surprise)
Route::get('/surprise', [AdminController::class, 'index'])->name('admin.dashboard');
Route::post('/surprise/login', [AdminController::class, 'login'])->name('admin.login');
Route::post('/surprise/logout', [AdminController::class, 'logout'])->name('admin.logout');

// REST and Async APIs
Route::prefix('api')->group(function () {
    // Events
    Route::get('/events', function () {
        return response()->json(\App\Models\Event::orderBy('event_date', 'desc')->get());
    });
    Route::post('/events', [AdminController::class, 'storeEvent']);
    Route::put('/events/{id}', [AdminController::class, 'updateEvent']);
    Route::delete('/events/{id}', [AdminController::class, 'deleteEvent']);

    // Team
    Route::get('/team', function () {
        return response()->json(\App\Models\TeamMember::orderBy('order', 'asc')->get());
    });
    Route::post('/team', [AdminController::class, 'storeTeam']);
    Route::put('/team/{id}', [AdminController::class, 'updateTeam']);
    Route::delete('/team/{id}', [AdminController::class, 'deleteTeam']);

    // Gallery
    Route::get('/gallery', function () {
        return response()->json(\App\Models\GalleryImage::orderBy('created_at', 'desc')->get());
    });
    Route::post('/gallery', [AdminController::class, 'storeGallery']);
    Route::delete('/gallery/{id}', [AdminController::class, 'deleteGallery']);

    // Settings
    Route::get('/settings/{key}', function ($key) {
        return response()->json(\App\Models\SiteSetting::get($key, []));
    });
    Route::post('/settings/{key}', [AdminController::class, 'saveSettings']);

    // Subscribers
    Route::get('/subscribers', function () {
        return response()->json(\App\Models\Subscriber::orderBy('created_at', 'desc')->get());
    });
    Route::post('/subscribers', [SubscriberController::class, 'subscribe']);
    Route::delete('/subscribers/{id}', function ($id) {
        \App\Models\Subscriber::destroy($id);
        return response()->json(['success' => true]);
    });

    // Upload
    Route::post('/upload', [AdminController::class, 'upload']);
    Route::post('/admin/login', [AdminController::class, 'login']);
});
