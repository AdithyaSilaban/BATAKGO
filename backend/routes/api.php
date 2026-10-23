<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\OpenCulturalApiController;

/*
|--------------------------------------------------------------------------
| BATAKGO RESTful API Routes
|--------------------------------------------------------------------------
| Sesuai tema lomba UINIC 8.0:
| "Engineering Interconnected Web Solutions to Empower Digital Ecosystems"
*/

// Health Check Endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'service' => 'BATAKGO REST API',
        'version' => '1.0.0',
        'database' => 'MySQL 8.0 (Laragon)',
        'framework' => 'Laravel 13',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// 1. Authentication Endpoints
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// 2. User Learning Progress & Gamification (Protected)
Route::middleware('auth:sanctum')->prefix('progress')->group(function () {
    Route::get('/', [ProgressController::class, 'getProgress']);
    Route::post('/sync', [ProgressController::class, 'syncProgress']);
    Route::post('/refill-hearts', [ProgressController::class, 'refillHearts']);
});

// 3. Multi-User Live Leaderboard (Public / Authenticated)
Route::get('/leaderboard', [LeaderboardController::class, 'index']);

// 4. Open Cultural Knowledge API (Interoperability Ecosystem)
Route::prefix('v1/open')->group(function () {
    Route::get('/dictionary', [OpenCulturalApiController::class, 'dictionary']);
    Route::get('/partuturan', [OpenCulturalApiController::class, 'calculatePartuturan']);
    Route::get('/aksara', [OpenCulturalApiController::class, 'transliterateAksara']);
});
