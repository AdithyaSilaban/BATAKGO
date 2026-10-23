<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function index(Request $request)
    {
        $currentUserId = $request->user('sanctum')?->id;

        $leaderboard = User::select('id', 'name', 'marga', 'avatar', 'xp', 'streak')
            ->orderBy('xp', 'desc')
            ->take(30)
            ->get()
            ->map(function ($user, $index) use ($currentUserId) {
                return [
                    'rank' => $index + 1,
                    'id' => $user->id,
                    'name' => $user->name . ($user->marga ? ' ' . $user->marga : ''),
                    'avatar' => $user->avatar ?: '🧒',
                    'xp' => (int) $user->xp,
                    'streak' => (int) $user->streak,
                    'isCurrentUser' => $currentUserId && $user->id === $currentUserId,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $leaderboard,
            'total_learners' => User::count(),
        ]);
    }
}

