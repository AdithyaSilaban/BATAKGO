<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Database\Seeders\BatakSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BatakGoApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(BatakSeeder::class);
    }

    public function test_api_health_check()
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'healthy',
                'service' => 'BATAKGO REST API',
            ]);
    }

    public function test_user_can_register_and_receive_canonical_data()
    {
        $email = 'ucok_' . uniqid() . '@batakgo.id';
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Ucok Pangaribuan',
            'email' => $email,
            'password' => 'secret123',
            'marga' => 'Pangaribuan',
            'avatar' => '🤠',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => [
                    'id',
                    'name',
                    'marga',
                    'email',
                    'xp',
                    'hearts',
                    'unlocked_units',
                    'completed_lessons',
                ],
            ]);

        $userData = $response->json('user');
        $this->assertContains('unit-1', $userData['unlocked_units'], 'Registered user must have canonical unit-1 unlocked');
    }

    public function test_login_with_valid_and_invalid_credentials()
    {
        // Valid login
        $response = $this->postJson('/api/auth/login', [
            'email' => 'tigor@batakgo.id',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['status', 'token', 'user']);

        // Invalid login
        $badResponse = $this->postJson('/api/auth/login', [
            'email' => 'tigor@batakgo.id',
            'password' => 'wrong_password',
        ]);

        $badResponse->assertStatus(422);
    }

    public function test_auth_me_protected_endpoint()
    {
        $user = User::where('email', 'tigor@batakgo.id')->first();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->getJson('/api/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'email' => 'tigor@batakgo.id',
                    'name' => 'Tigor Simanjuntak',
                ],
            ]);
    }

    public function test_sync_progress_awards_canonical_xp_on_first_completion()
    {
        $user = User::factory()->create([
            'xp' => 100,
            'hearts' => 5,
            'completed_lessons' => [],
            'unlocked_units' => ['unit-1'],
        ]);
        $token = $user->createToken('test_token')->plainTextToken;

        // Lesson u1-l1 awards 15 XP canonically
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/api/progress/sync', [
            'lessonId' => 'u1-l1',
            'heartsRemaining' => 4,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'xp_awarded' => 15,
                'is_first_completion' => true,
            ]);

        $user->refresh();
        $this->assertEquals(115, $user->xp, 'User XP must increase by canonical 15 XP');
        $this->assertContains('u1-l1', $user->completed_lessons);
        $this->assertEquals(4, $user->hearts);
    }

    public function test_sync_progress_prevents_duplicate_xp_farming()
    {
        $user = User::factory()->create([
            'xp' => 100,
            'hearts' => 5,
            'completed_lessons' => ['u1-l1'],
            'unlocked_units' => ['unit-1'],
        ]);
        $token = $user->createToken('test_token')->plainTextToken;

        // Re-completing u1-l1 should award 0 XP
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/api/progress/sync', [
            'lessonId' => 'u1-l1',
            'heartsRemaining' => 5,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'xp_awarded' => 0,
                'is_first_completion' => false,
            ]);

        $user->refresh();
        $this->assertEquals(100, $user->xp, 'User XP must NOT increase for already completed lesson');
    }

    public function test_sync_progress_rejects_invalid_lesson_id()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/api/progress/sync', [
            'lessonId' => 'invalid_hacked_lesson_999',
            'heartsRemaining' => 5,
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'status' => 'error',
            ]);
    }

    public function test_automatic_unit_unlocking_when_all_unit_lessons_completed()
    {
        $user = User::factory()->create([
            'completed_lessons' => ['u1-l1'],
            'unlocked_units' => ['unit-1'],
        ]);
        $token = $user->createToken('test_token')->plainTextToken;

        // Completing u1-l2 finishes unit-1, should automatically unlock unit-2
        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/api/progress/sync', [
            'lessonId' => 'u1-l2',
            'heartsRemaining' => 5,
        ]);

        $response->assertStatus(200);

        $user->refresh();
        $this->assertContains('unit-2', $user->unlocked_units, 'Unit-2 must be unlocked after finishing all unit-1 lessons');
    }

    public function test_refill_hearts_endpoint()
    {
        $user = User::factory()->create(['hearts' => 1, 'max_hearts' => 5]);
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeaders([
            'Authorization' => "Bearer {$token}",
        ])->postJson('/api/progress/refill-hearts');

        $response->assertStatus(200)
            ->assertJson(['status' => 'success', 'hearts' => 5]);

        $user->refresh();
        $this->assertEquals(5, $user->hearts);
    }

    public function test_leaderboard_endpoint()
    {
        $response = $this->getJson('/api/leaderboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data',
                'total_learners',
            ]);
    }

    public function test_open_cultural_api_dictionary()
    {
        $response = $this->getJson('/api/v1/open/dictionary?q=horas');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'api_version',
                'interoperability',
                'data',
            ]);
    }

    public function test_open_cultural_api_partuturan()
    {
        $response = $this->getJson('/api/v1/open/partuturan?my_gender=male&relation=saudara_laki_ibu');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'partuturan' => 'Tulang',
            ]);
    }

    public function test_open_cultural_api_aksara_accurate_unicode()
    {
        $response = $this->getJson('/api/v1/open/aksara?text=horas');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'latin_text' => 'horas',
                'aksara_batak' => "\xE1\xAF\x82\xE1\xAF\xAC\xE1\xAF\x92\xE1\xAF\x98\xE1\xAF\xB3", // ᯂᯬᯒᯘ᯳
            ]);
    }
}
