<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OwnerDashboardController;
use App\Http\Controllers\OrdersController;
use App\Http\Controllers\AssignController;

use App\Http\Controllers\ProduksiDashboardController;
use App\Http\Controllers\ProduksiTaskController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::get('/dashboard', function () {
    $user = Auth::user();

    if ($user->role === 'owner') {
        return redirect()->route('owner.dashboard');
    }

    if ($user->role === 'produksi') {
        return redirect()->route('produksi.dashboard');
    }
    abort(403);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/owner/dashboard', [OwnerDashboardController::class, 'index'])
        ->name('owner.dashboard');

    Route::get('/owner/orders', [OrdersController::class, 'index'])
        ->name('owner.orders');
    Route::post('/owner/orders/store', [OrdersController::class, 'store'])
        ->name('owner.orders.store');
    Route::post('/owner/orders/{id}/update', [OrdersController::class, 'update'])
        ->name('owner.orders.update');
    Route::post('/owner/orders/{id}/delete', [OrdersController::class, 'delete'])
        ->name('owner.orders.delete');

    Route::get('/owner/assign', [AssignController::class, 'index'])
        ->name('owner.assign');
    Route::post('/owner/assign', [AssignController::class, 'assign'])
        ->name('owner.assign.assign');

    Route::get('/produksi/dashboard', [ProduksiDashboardController::class, 'index'])
        ->name('produksi.dashboard');

    Route::get('/produksi/task', [ProduksiTaskController::class, 'index'])
        ->name('produksi.task');
    Route::post('/produksi/update', [ProduksiTaskController::class, 'update'])
        ->name('produksi.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/logout', function () {
    Auth::logout();

    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect('login');
});

require __DIR__ . '/auth.php';
