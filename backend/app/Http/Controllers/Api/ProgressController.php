<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CurriculumService;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    /**
     * Get user learning progress with canonical IDs.
     */
    public function getProgress(Request $request)
    {
        $user = $request->user();

        // Normalize legacy IDs stored in MySQL
        $completedLessons = CurriculumService::normalizeIds($user->completed_lessons ?? []);
        $unlockedUnits = CurriculumService::normalizeIds($user->unlocked_units ?? ['unit-1']);
        if (empty($unlockedUnits)) {
            $unlockedUnits = ['unit-1'];
        }
        $unlockedUlos = CurriculumService::normalizeIds($user->unlocked_ulos ?? []);

        return response()->json([
            'status' => 'success',
            'data' => [
                'xp' => (int) $user->xp,
                'streak' => (int) $user->streak,
                'hearts' => (int) $user->hearts,
                'maxHearts' => (int) $user->max_hearts,
                'completedLessons' => $completedLessons,
                'unlockedUnits' => $unlockedUnits,
                'unlockedUlos' => $unlockedUlos,
            ],
        ]);
    }

    /**
     * Securely sync learning progress.
     * Prevents duplicate XP farming and validates canonical lesson existence.
     */
    public function syncProgress(Request $request)
    {
        $validated = $request->validate([
            'lessonId' => 'nullable|string|max:50',
            'xpEarned' => 'nullable|integer|min:0',
            'unlockedUnitId' => 'nullable|string|max:50',
            'heartsRemaining' => 'required|integer|min:0|max:10',
            'unlockedUlosId' => 'nullable|string|max:50',
        ]);

        $user = $request->user();

        // 1. Normalize existing arrays
        $completedLessons = CurriculumService::normalizeIds($user->completed_lessons ?? []);
        $unlockedUnits = CurriculumService::normalizeIds($user->unlocked_units ?? ['unit-1']);
        if (empty($unlockedUnits)) {
            $unlockedUnits = ['unit-1'];
        }
        $unlockedUlos = CurriculumService::normalizeIds($user->unlocked_ulos ?? []);

        $xpAwarded = 0;
        $isFirstCompletion = false;
        $message = 'Progres belajar berhasil disinkronkan.';
        $rawLessonId = $validated['lessonId'] ?? null;

        // 2. Process Lesson Completion
        if ($rawLessonId) {
            $lessonId = CurriculumService::normalizeId($rawLessonId);

            if (!CurriculumService::isValidLesson($lessonId)) {
                return response()->json([
                    'status' => 'error',
                    'message' => "ID pelajaran '{$rawLessonId}' tidak valid atau tidak terdaftar dalam kurikulum BATAKGO.",
                ], 422);
            }

            // Check if already completed (Anti-Farming Security Guard)
            if (in_array($lessonId, $completedLessons, true)) {
                // Already completed: award 0 XP for duplicate completion
                $xpAwarded = 0;
                $isFirstCompletion = false;
                $message = "Pelajaran '{$lessonId}' telah tuntas sebelumnya. Tidak ada penambahan XP ganda.";
            } else {
                // First time completion: award canonical XP calculated on server
                $isFirstCompletion = true;
                $completedLessons[] = $lessonId;
                $user->completed_lessons = $completedLessons;

                $canonicalXp = CurriculumService::getLessonXp($lessonId);
                $xpAwarded = $canonicalXp;
                $user->xp += $xpAwarded;

                $message = "Selamat! Pelajaran '{$lessonId}' selesai. +{$xpAwarded} Gordang XP berhasil ditambahkan!";

                // 3. Automated Server-side Unit Progression Check
                $nextUnit = CurriculumService::checkNextUnitUnlock($lessonId, $completedLessons);
                if ($nextUnit && !in_array($nextUnit, $unlockedUnits, true)) {
                    $unlockedUnits[] = $nextUnit;
                    $user->unlocked_units = $unlockedUnits;
                    $message .= " Unit baru '{$nextUnit}' kini terbuka!";
                }

                // Check Ulos cultural reward for completing a unit
                $lessonMeta = CurriculumService::LESSONS[$lessonId] ?? null;
                if ($lessonMeta) {
                    $unitReward = CurriculumService::getUlosReward($lessonMeta['unit_id']);
                    if ($nextUnit && $unitReward && !in_array($unitReward, $unlockedUlos, true)) {
                        $unlockedUlos[] = $unitReward;
                        $user->unlocked_ulos = $unlockedUlos;
                    }
                }
            }
        }

        // 4. Update Hearts (clamped to max_hearts)
        $user->hearts = max(0, min((int) $user->max_hearts, (int) $validated['heartsRemaining']));

        // 5. Explicit unit unlock if client supplied a valid one
        if (!empty($validated['unlockedUnitId'])) {
            $clientUnit = CurriculumService::normalizeId($validated['unlockedUnitId']);
            if (CurriculumService::isValidUnit($clientUnit) && !in_array($clientUnit, $unlockedUnits, true)) {
                $unlockedUnits[] = $clientUnit;
                $user->unlocked_units = $unlockedUnits;
            }
        }

        // 6. Explicit ulos unlock if client supplied one
        if (!empty($validated['unlockedUlosId'])) {
            $clientUlos = CurriculumService::normalizeId($validated['unlockedUlosId']);
            if ($clientUlos && !in_array($clientUlos, $unlockedUlos, true)) {
                $unlockedUlos[] = $clientUlos;
                $user->unlocked_ulos = $unlockedUlos;
            }
        }

        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'xp_awarded' => $xpAwarded,
            'is_first_completion' => $isFirstCompletion,
            'data' => [
                'xp' => (int) $user->xp,
                'streak' => (int) $user->streak,
                'hearts' => (int) $user->hearts,
                'maxHearts' => (int) $user->max_hearts,
                'completedLessons' => $user->completed_lessons,
                'unlockedUnits' => $user->unlocked_units,
                'unlockedUlos' => $user->unlocked_ulos,
            ],
        ]);
    }

    /**
     * Refill hearts to maximum.
     */
    public function refillHearts(Request $request)
    {
        $user = $request->user();
        $user->hearts = $user->max_hearts;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Tondi (nyawa) berhasil dipulihkan penuh!',
            'hearts' => (int) $user->hearts,
        ]);
    }
}
