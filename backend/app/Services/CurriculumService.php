<?php

namespace App\Services;

class CurriculumService
{
    /**
     * Canonical Lesson Registry
     * ID format: kebab-case (e.g., 'u1-l1')
     */
    public const LESSONS = [
        'u1-l1' => [
            'id' => 'u1-l1',
            'unit_id' => 'unit-1',
            'title' => 'Horas & Mauliate',
            'xp_reward' => 15,
        ],
        'u1-l2' => [
            'id' => 'u1-l2',
            'unit_id' => 'unit-1',
            'title' => 'Menanyakan Kabar & Keadaan',
            'xp_reward' => 15,
        ],
        'u2-l1' => [
            'id' => 'u2-l1',
            'unit_id' => 'unit-2',
            'title' => 'Lae & Ito: Panggilan Sebaya',
            'xp_reward' => 20,
        ],
        'u2-l2' => [
            'id' => 'u2-l2',
            'unit_id' => 'unit-2',
            'title' => 'Tulang & Dalihan Na Tolu',
            'xp_reward' => 20,
        ],
        'u3-l1' => [
            'id' => 'u3-l1',
            'unit_id' => 'unit-3',
            'title' => 'Berhitung 1 sampai 5',
            'xp_reward' => 15,
        ],
        'u4-l1' => [
            'id' => 'u4-l1',
            'unit_id' => 'unit-4',
            'title' => 'Mangan, Minum & Tabo',
            'xp_reward' => 20,
        ],
        'u5-l1' => [
            'id' => 'u5-l1',
            'unit_id' => 'unit-5',
            'title' => 'Legenda Sigale-gale & Tortor',
            'xp_reward' => 25,
        ],
    ];

    /**
     * Canonical Unit Registry
     * ID format: kebab-case (e.g., 'unit-1')
     */
    public const UNITS = [
        'unit-1' => [
            'id' => 'unit-1',
            'number' => 1,
            'title' => 'Salam, Sapaan & Kata Dasar',
            'lessons' => ['u1-l1', 'u1-l2'],
            'next_unit' => 'unit-2',
            'ulos_reward' => 'ulos-mangiring',
        ],
        'unit-2' => [
            'id' => 'unit-2',
            'number' => 2,
            'title' => 'Partuturan & Kekerabatan Batak',
            'lessons' => ['u2-l1', 'u2-l2'],
            'next_unit' => 'unit-3',
            'ulos_reward' => 'ulos-ragidup',
        ],
        'unit-3' => [
            'id' => 'unit-3',
            'number' => 3,
            'title' => 'Angka & Alam Tao Toba',
            'lessons' => ['u3-l1'],
            'next_unit' => 'unit-4',
            'ulos_reward' => 'ulos-ragi-hotang',
        ],
        'unit-4' => [
            'id' => 'unit-4',
            'number' => 4,
            'title' => 'Aktivitas Harian & Kuliner Khas',
            'lessons' => ['u4-l1'],
            'next_unit' => 'unit-5',
            'ulos_reward' => 'ulos-sadum',
        ],
        'unit-5' => [
            'id' => 'unit-5',
            'number' => 5,
            'title' => 'Umpasa & Filosofi Sigale-gale',
            'lessons' => ['u5-l1'],
            'next_unit' => null,
            'ulos_reward' => 'ulos-sibolang',
        ],
    ];

    /**
     * Normalize an ID to canonical kebab-case format.
     * Converts underscores to hyphens (e.g. 'u1_l1' -> 'u1-l1', 'unit_1' -> 'unit-1').
     */
    public static function normalizeId(?string $id): ?string
    {
        if ($id === null) return null;
        $trimmed = trim($id);
        if ($trimmed === '') return null;
        return strtolower(str_replace('_', '-', $trimmed));
    }

    /**
     * Normalize an array of IDs to canonical kebab-case format.
     */
    public static function normalizeIds(array $ids): array
    {
        $normalized = [];
        foreach ($ids as $id) {
            $norm = self::normalizeId($id);
            if ($norm && !in_array($norm, $normalized, true)) {
                $normalized[] = $norm;
            }
        }
        return $normalized;
    }

    /**
     * Check if a lesson ID is valid in the curriculum.
     */
    public static function isValidLesson(string $lessonId): bool
    {
        $canonical = self::normalizeId($lessonId);
        return isset(self::LESSONS[$canonical]);
    }

    /**
     * Check if a unit ID is valid in the curriculum.
     */
    public static function isValidUnit(string $unitId): bool
    {
        $canonical = self::normalizeId($unitId);
        return isset(self::UNITS[$canonical]);
    }

    /**
     * Get official XP reward for a lesson.
     */
    public static function getLessonXp(string $lessonId): int
    {
        $canonical = self::normalizeId($lessonId);
        return self::LESSONS[$canonical]['xp_reward'] ?? 0;
    }

    /**
     * Check if all lessons in the unit of the given lesson are completed.
     * If so, returns the next unit ID to unlock, or null.
     */
    public static function checkNextUnitUnlock(string $lessonId, array $completedLessons): ?string
    {
        $canonicalLesson = self::normalizeId($lessonId);
        $lessonMeta = self::LESSONS[$canonicalLesson] ?? null;
        if (!$lessonMeta) return null;

        $unitId = $lessonMeta['unit_id'];
        $unitMeta = self::UNITS[$unitId] ?? null;
        if (!$unitMeta) return null;

        $normalizedCompleted = self::normalizeIds($completedLessons);
        $allDone = true;
        foreach ($unitMeta['lessons'] as $reqLesson) {
            if (!in_array($reqLesson, $normalizedCompleted, true)) {
                $allDone = false;
                break;
            }
        }

        if ($allDone && !empty($unitMeta['next_unit'])) {
            return $unitMeta['next_unit'];
        }

        return null;
    }

    /**
     * Get Ulos reward for completing a unit, if any.
     */
    public static function getUlosReward(string $unitId): ?string
    {
        $canonical = self::normalizeId($unitId);
        return self::UNITS[$canonical]['ulos_reward'] ?? null;
    }
}
