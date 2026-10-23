<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\CulturalVocabulary;
use Illuminate\Support\Facades\Hash;

class BatakSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed dummy leaderboard users in MySQL
        $users = [
            [
                'name' => 'Tigor Simanjuntak',
                'email' => 'tigor@batakgo.id',
                'marga' => 'Simanjuntak',
                'avatar' => '🤠',
                'password' => Hash::make('password123'),
                'xp' => 1450,
                'streak' => 14,
                'hearts' => 5,
                'completed_lessons' => ['u1_l1', 'u1_l2', 'u1_l3', 'u2_l1'],
                'unlocked_units' => ['unit_1', 'unit_2'],
                'unlocked_ulos' => ['ulos_ragidup', 'ulos_ragi_hotang'],
            ],
            [
                'name' => 'Tiurma Siregar',
                'email' => 'tiurma@batakgo.id',
                'marga' => 'Siregar',
                'avatar' => '👩‍🦰',
                'password' => Hash::make('password123'),
                'xp' => 1280,
                'streak' => 9,
                'hearts' => 4,
                'completed_lessons' => ['u1_l1', 'u1_l2', 'u1_l3'],
                'unlocked_units' => ['unit_1', 'unit_2'],
                'unlocked_ulos' => ['ulos_ragi_hotang'],
            ],
            [
                'name' => 'Poltak Nainggolan',
                'email' => 'poltak@batakgo.id',
                'marga' => 'Nainggolan',
                'avatar' => '🧑‍🎓',
                'password' => Hash::make('password123'),
                'xp' => 1120,
                'streak' => 7,
                'hearts' => 5,
                'completed_lessons' => ['u1_l1', 'u1_l2'],
                'unlocked_units' => ['unit_1'],
                'unlocked_ulos' => ['ulos_mangiring'],
            ],
            [
                'name' => 'Butet Hutabarat',
                'email' => 'butet@batakgo.id',
                'marga' => 'Hutabarat',
                'avatar' => '👧',
                'password' => Hash::make('password123'),
                'xp' => 950,
                'streak' => 5,
                'hearts' => 3,
                'completed_lessons' => ['u1_l1'],
                'unlocked_units' => ['unit_1'],
                'unlocked_ulos' => ['ulos_mangiring'],
            ],
            [
                'name' => 'Bona Sitorus',
                'email' => 'bona@batakgo.id',
                'marga' => 'Sitorus',
                'avatar' => '🧑‍🌾',
                'password' => Hash::make('password123'),
                'xp' => 780,
                'streak' => 4,
                'hearts' => 5,
                'completed_lessons' => ['u1_l1'],
                'unlocked_units' => ['unit_1'],
                'unlocked_ulos' => [],
            ],
        ];

        foreach ($users as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        // 2. Seed Cultural Vocabulary
        $vocabularies = [
            [
                'slug' => 'horas',
                'batak' => 'Horas',
                'indonesian' => 'Halo / Salam sejahtera / Selamat',
                'category' => 'sapaan',
                'phonetic' => 'ho-ras',
                'syllables' => ['Ho', 'ras'],
                'example_batak' => 'Horas ma di hita saluhutna!',
                'example_indonesian' => 'Salam sejahtera bagi kita sekalian!',
                'audio_note' => 'Diucapkan dengan nada tegas dan hangat'
            ],
            [
                'slug' => 'mauliate',
                'batak' => 'Mauliate',
                'indonesian' => 'Terima kasih',
                'category' => 'sapaan',
                'phonetic' => 'mau-li-a-te',
                'syllables' => ['Mau', 'li', 'a', 'te'],
                'example_batak' => 'Mauliate godang, lae!',
                'example_indonesian' => 'Terima kasih banyak, kawan!',
                'audio_note' => 'Dapat ditambah godang untuk sangat berterima kasih'
            ],
            [
                'slug' => 'songon_dia',
                'batak' => 'Songon dia kabar?',
                'indonesian' => 'Bagaimana kabarmu?',
                'category' => 'sapaan',
                'phonetic' => 'so-ngon di-a ka-bar',
                'syllables' => ['So', 'ngon', 'di', 'a', 'ka', 'bar'],
                'example_batak' => 'Songon dia kabar muna nuaeng?',
                'example_indonesian' => 'Bagaimana kabar kalian sekarang?',
                'audio_note' => 'Pertanyaan kabar santai sehari-hari'
            ],
            [
                'slug' => 'hipas',
                'batak' => 'Hipas / Sehat do',
                'indonesian' => 'Sehat-sehat saja',
                'category' => 'sapaan',
                'phonetic' => 'hi-pas / se-hat do',
                'syllables' => ['Hi', 'pas', 'do', 'au'],
                'example_batak' => 'Hipas do au, mauliate.',
                'example_indonesian' => 'Aku sehat saja, terima kasih.',
                'audio_note' => 'Jawaban standar saat ditanya kabar'
            ],
            [
                'slug' => 'amang',
                'batak' => 'Amang',
                'indonesian' => 'Ayah / Bapak',
                'category' => 'keluarga',
                'phonetic' => 'a-mang',
                'syllables' => ['A', 'mang'],
                'example_batak' => 'Nunga mulak amang sian ladang.',
                'example_indonesian' => 'Ayah sudah pulang dari ladang.',
                'audio_note' => 'Panggilan hormat untuk ayah kandung atau bapak tua/muda'
            ],
            [
                'slug' => 'inang',
                'batak' => 'Inang',
                'indonesian' => 'Ibu / Mama',
                'category' => 'keluarga',
                'phonetic' => 'i-nang',
                'syllables' => ['I', 'nang'],
                'example_batak' => 'Inang parade sipanganon.',
                'example_indonesian' => 'Ibu menyiapkan makanan.',
                'audio_note' => 'Panggilan hormat penuh kasih sayang untuk ibu'
            ],
            [
                'slug' => 'tulang',
                'batak' => 'Tulang',
                'indonesian' => 'Paman (Saudara laki-laki ibu)',
                'category' => 'keluarga',
                'phonetic' => 'tu-lang',
                'syllables' => ['Tu', 'lang'],
                'example_batak' => 'Tulang ro sian huta.',
                'example_indonesian' => 'Paman datang dari kampung.',
                'audio_note' => 'Kunci utama dalam sistem kekerabatan Dalihan Na Tolu'
            ],
            [
                'slug' => 'nantulang',
                'batak' => 'Nantulang',
                'indonesian' => 'Bibi (Istri dari saudara laki-laki ibu)',
                'category' => 'keluarga',
                'phonetic' => 'nan-tu-lang',
                'syllables' => ['Nan', 'tu', 'lang'],
                'example_batak' => 'Nantulang mangalehon ulos.',
                'example_indonesian' => 'Bibi memberikan kain ulos.',
                'audio_note' => 'Pasangan dari Tulang'
            ],
            [
                'slug' => 'sada',
                'batak' => 'Sada',
                'indonesian' => 'Satu (1)',
                'category' => 'angka',
                'phonetic' => 'sa-da',
                'syllables' => ['Sa', 'da'],
                'example_batak' => 'Sada huta.',
                'example_indonesian' => 'Satu kampung.',
                'audio_note' => 'Angka dasar'
            ],
            [
                'slug' => 'dua',
                'batak' => 'Dua',
                'indonesian' => 'Dua (2)',
                'category' => 'angka',
                'phonetic' => 'du-a',
                'syllables' => ['Du', 'a'],
                'example_batak' => 'Dua boru.',
                'example_indonesian' => 'Dua anak perempuan.',
                'audio_note' => 'Angka dasar'
            ],
            [
                'slug' => 'tolu',
                'batak' => 'Tolu',
                'indonesian' => 'Tiga (3)',
                'category' => 'angka',
                'phonetic' => 'to-lu',
                'syllables' => ['To', 'lu'],
                'example_batak' => 'Dalihan Na Tolu.',
                'example_indonesian' => 'Tungku nan tiga (falsafah hidup Batak).',
                'audio_note' => 'Sangat sakral dalam filosofi Batak'
            ],
        ];

        foreach ($vocabularies as $vocab) {
            CulturalVocabulary::updateOrCreate(
                ['slug' => $vocab['slug']],
                $vocab
            );
        }
    }
}

