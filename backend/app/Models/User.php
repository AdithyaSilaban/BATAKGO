<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'marga',
        'avatar',
        'xp',
        'streak',
        'hearts',
        'max_hearts',
        'completed_lessons',
        'unlocked_units',
        'unlocked_ulos',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'completed_lessons' => 'array',
            'unlocked_units' => 'array',
            'unlocked_ulos' => 'array',
            'xp' => 'integer',
            'streak' => 'integer',
            'hearts' => 'integer',
            'max_hearts' => 'integer',
        ];
    }
}
