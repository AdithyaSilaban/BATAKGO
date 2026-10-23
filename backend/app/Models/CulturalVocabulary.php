<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CulturalVocabulary extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'batak',
        'indonesian',
        'category',
        'phonetic',
        'syllables',
        'example_batak',
        'example_indonesian',
        'audio_note',
    ];

    protected function casts(): array
    {
        return [
            'syllables' => 'array',
        ];
    }
}

