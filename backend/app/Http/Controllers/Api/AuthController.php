<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\CurriculumService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'marga' => 'nullable|string|max:50',
            'avatar' => 'nullable|string|max:10',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'marga' => $validated['marga'] ?? null,
            'avatar' => $validated['avatar'] ?? '🧒',
            'xp' => 0,
            'streak' => 1,
            'hearts' => 5,
            'max_hearts' => 5,
            'completed_lessons' => [],
            'unlocked_units' => ['unit-1'],
            'unlocked_ulos' => [],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Pendaftaran akun BATAKGO berhasil!',
            'token' => $token,
            'user' => $this->formatUser($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Kombinasi email atau kata sandi tidak cocok.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Horas! Selamat datang kembali di BATAKGO.',
            'token' => $token,
            'user' => $this->formatUser($user),
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user' => $this->formatUser($request->user()),
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil keluar sesi.',
        ]);
    }

    /**
     * Format user output with canonical kebab-case IDs.
     */
    private function formatUser(User $user): array
    {
        $unlockedUnits = CurriculumService::normalizeIds($user->unlocked_units ?? ['unit-1']);
        if (empty($unlockedUnits)) {
            $unlockedUnits = ['unit-1'];
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'marga' => $user->marga,
            'avatar' => $user->avatar,
            'xp' => (int) $user->xp,
            'streak' => (int) $user->streak,
            'hearts' => (int) $user->hearts,
            'max_hearts' => (int) $user->max_hearts,
            'completed_lessons' => CurriculumService::normalizeIds($user->completed_lessons ?? []),
            'unlocked_units' => $unlockedUnits,
            'unlocked_ulos' => CurriculumService::normalizeIds($user->unlocked_ulos ?? []),
            'created_at' => $user->created_at?->toIso8601String(),
        ];
    }
}
