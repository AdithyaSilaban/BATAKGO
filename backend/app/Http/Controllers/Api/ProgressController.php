<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    public function getProgress(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status' => 'success',
            'data' => [
                'xp' => $user->xp,
                'streak' => $user->streak,
                'hearts' => $user->hearts,
                'maxHearts' => $user->max_hearts,
                'completedLessons' => $user->completed_lessons ?? [],
                'unlockedUnits' => $user->unlocked_units ?? ['unit_1'],
                'unlockedUlos' => $user->unlocked_ulos ?? [],
            ],
        ]);
    }

    public function syncProgress(Request $request)
    {
        $validated = $request->validate([
            'xpEarned' => 'required|integer|min:0',
            'lessonId' => 'nullable|string',
            'unlockedUnitId' => 'nullable|string',
            'heartsRemaining' => 'required|integer|min:0|max:10',
            'unlockedUlosId' => 'nullable|string',
        ]);

        $user = $request->user();

        // 1. Update XP & Hearts
        $user->xp += $validated['xpEarned'];
        $user->hearts = $validated['heartsRemaining'];

        // 2. Add completed lesson
        if (!empty($validated['lessonId'])) {
            $completed = $user->completed_lessons ?? [];
            if (!in_array($validated['lessonId'], $completed)) {
                $completed[] = $validated['lessonId'];
                $user->completed_lessons = $completed;
            }
        }

        // 3. Unlock unit if provided
        if (!empty($validated['unlockedUnitId'])) {
            $unlockedUnits = $user->unlocked_units ?? ['unit_1'];
            if (!in_array($validated['unlockedUnitId'], $unlockedUnits)) {
                $unlockedUnits[] = $validated['unlockedUnitId'];
                $user->unlocked_units = $unlockedUnits;
            }
        }

        // 4. Unlock ulos if provided
        if (!empty($validated['unlockedUlosId'])) {
            $unlockedUlos = $user->unlocked_ulos ?? [];
            if (!in_array($validated['unlockedUlosId'], $unlockedUlos)) {
                $unlockedUlos[] = $validated['unlockedUlosId'];
                $user->unlocked_ulos = $unlockedUlos;
            }
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Progres belajar berhasil disinkronkan ke database MySQL.',
            'data' => [
                'xp' => $user->xp,
                'streak' => $user->streak,
                'hearts' => $user->hearts,
                'maxHearts' => $user->max_hearts,
                'completedLessons' => $user->completed_lessons,
                'unlockedUnits' => $user->unlocked_units,
                'unlockedUlos' => $user->unlocked_ulos,
            ],
        ]);
    }

    public function refillHearts(Request $request)
    {
        $user = $request->user();
        $user->hearts = $user->max_hearts;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Tondi (nyawa) berhasil dipulihkan!',
            'hearts' => $user->hearts,
        ]);
    }
}

