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

    public function test_user_can_register_and_receive_token()
    {
        $email = 'unit_test_' . time() . '@batakgo.id';
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Ucok Test',
            'email' => $email,
            'password' => 'secret123',
            'marga' => 'Pangaribuan',
            'avatar' => '🤠',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => ['id', 'name', 'marga', 'email', 'xp', 'hearts'],
            ]);
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

    public function test_open_cultural_api_aksara()
    {
        $response = $this->getJson('/api/v1/open/aksara?text=horas');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'latin_text',
                'aksara_batak',
            ]);
    }
}

