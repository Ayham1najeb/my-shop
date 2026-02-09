<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::middleware(['throttle:6,1'])->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);
    Route::post('/profile/password', [AuthController::class, 'updatePassword']);
    
    // Email Verification
    Route::post('/email/verify', [AuthController::class, 'verifyEmail']);
    Route::post('/email/resend', [AuthController::class, 'resendCode']);
    
    // Wishlist Routes
    Route::get('/wishlist', [App\Http\Controllers\Api\WishlistController::class, 'index']);
    Route::post('/wishlist/toggle', [App\Http\Controllers\Api\WishlistController::class, 'toggle']);
    Route::post('/wishlist/sync', [App\Http\Controllers\Api\WishlistController::class, 'sync']);

    // Reviews (Protected: Submit)
    Route::post('/reviews', [App\Http\Controllers\Api\ReviewController::class, 'store']);

    // Address Routes
    Route::get('/addresses', [App\Http\Controllers\Api\AddressController::class, 'index']);
    Route::post('/addresses', [App\Http\Controllers\Api\AddressController::class, 'store']);
    Route::put('/addresses/{id}', [App\Http\Controllers\Api\AddressController::class, 'update']);
    Route::delete('/addresses/{id}', [App\Http\Controllers\Api\AddressController::class, 'destroy']);

    // Order Routes
    Route::get('/orders', [App\Http\Controllers\Api\OrderController::class, 'index']);
    Route::get('/orders/{id}', [App\Http\Controllers\Api\OrderController::class, 'show']);
    Route::post('/orders', [App\Http\Controllers\Api\OrderController::class, 'store']);
    Route::post('/checkout', [App\Http\Controllers\Api\OrderController::class, 'store']); // Alias for frontend

    // Notification Routes
    Route::get('/notifications', [App\Http\Controllers\Api\NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [App\Http\Controllers\Api\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [App\Http\Controllers\Api\NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [App\Http\Controllers\Api\NotificationController::class, 'destroy']);

    // Admin Routes
    Route::prefix('admin')->group(function () {
        Route::get('/stats', [App\Http\Controllers\Api\Admin\StatsController::class, 'index']);
        
        Route::get('/products/form-data', [App\Http\Controllers\Api\Admin\ProductController::class, 'getFormData']);
        Route::apiResource('products', App\Http\Controllers\Api\Admin\ProductController::class);

        Route::get('/users', [App\Http\Controllers\Api\Admin\UserController::class, 'index']);
        Route::delete('/users/{id}', [App\Http\Controllers\Api\Admin\UserController::class, 'destroy']);
        Route::post('/users/{id}/ban', [App\Http\Controllers\Api\Admin\UserController::class, 'toggleBan']);

        // Admin Reviews
        Route::get('/reviews', [App\Http\Controllers\Api\Admin\ReviewController::class, 'index']);
        Route::post('/reviews/{id}/status', [App\Http\Controllers\Api\Admin\ReviewController::class, 'updateStatus']);

        // Admin Orders
        Route::get('/orders', [App\Http\Controllers\Api\Admin\OrderController::class, 'index']);
        Route::put('/orders/{id}/status', [App\Http\Controllers\Api\Admin\OrderController::class, 'updateStatus']);
    });
});

// Public Products
Route::get('/products', [App\Http\Controllers\Api\ProductController::class, 'index']);
Route::get('/products/{id}', [App\Http\Controllers\Api\ProductController::class, 'show']);

// Public Reviews (View)
Route::get('/products/{id}/reviews', [App\Http\Controllers\Api\ReviewController::class, 'index']);
