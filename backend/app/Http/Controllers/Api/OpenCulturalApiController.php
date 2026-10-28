<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CulturalVocabulary;
use Illuminate\Http\Request;

class OpenCulturalApiController extends Controller
{
    /**
     * Open Cultural Dictionary API
     * Mengizinkan platform pihak ketiga mengakses leksikon budaya & bahasa Batak.
     */
    public function dictionary(Request $request)
    {
        $query = $request->query('q');
        $category = $request->query('category');

        $vocabQuery = CulturalVocabulary::query();

        if ($query) {
            $vocabQuery->where(function ($q) use ($query) {
                $q->where('batak', 'LIKE', "%{$query}%")
                  ->orWhere('indonesian', 'LIKE', "%{$query}%")
                  ->orWhere('example_batak', 'LIKE', "%{$query}%");
            });
        }

        if ($category && $category !== 'all') {
            $vocabQuery->where('category', $category);
        }

        $results = $vocabQuery->get();

        return response()->json([
            'status' => 'success',
            'api_version' => 'v1.0',
            'standard' => 'Batak Toba Cultural Lexicon',
            'interoperability' => 'Open Batak Knowledge Initiative',
            'count' => $results->count(),
            'data' => $results,
        ]);
    }

    /**
     * Open Partuturan Calculator API
     * Menghitung sapaan kekerabatan adat Batak (Dalihan Na Tolu).
     */
    public function calculatePartuturan(Request $request)
    {
        $myGender = $request->query('my_gender', 'male'); // 'male' | 'female'
        $relation = $request->query('relation', 'saudara_laki_ibu'); 

        $rules = [
            'male' => [
                'saudara_laki' => ['term' => 'Anggi / Haha', 'meaning' => 'Saudara kandung laki-laki'],
                'saudara_perempuan' => ['term' => 'Ibotoku', 'meaning' => 'Saudara kandung perempuan (saling menghormati)'],
                'saudara_laki_ibu' => ['term' => 'Tulang', 'meaning' => 'Paman dari pihak ibu (posisi terhormat Hula-hula)'],
                'istri_saudara_laki_ibu' => ['term' => 'Nantulang', 'meaning' => 'Bibi / Istri dari paman Tulang'],
                'saudara_perempuan_ayah' => ['term' => 'Namboru', 'meaning' => 'Bibi dari pihak ayah'],
                'teman_sebaya' => ['term' => 'Lae', 'meaning' => 'Panggilan akrab antar pria sebaya'],
            ],
            'female' => [
                'saudara_laki' => ['term' => 'Ibotoku', 'meaning' => 'Saudara kandung laki-laki'],
                'saudara_perempuan' => ['term' => 'Anggi / Haha', 'meaning' => 'Saudara kandung perempuan'],
                'saudara_laki_ibu' => ['term' => 'Tulang', 'meaning' => 'Paman dari pihak ibu'],
                'istri_saudara_laki_ibu' => ['term' => 'Nantulang', 'meaning' => 'Bibi / Istri dari Tulang'],
                'saudara_perempuan_ayah' => ['term' => 'Namboru', 'meaning' => 'Bibi dari pihak ayah'],
                'teman_sebaya' => ['term' => 'Ito / Eda', 'meaning' => 'Panggilan akrab antar sesama perempuan'],
            ],
        ];

        $genderRules = $rules[$myGender] ?? $rules['male'];
        $result = $genderRules[$relation] ?? [
            'term' => 'Dongan Sabutuha / Lae',
            'meaning' => 'Kerabat terdekat dalam falsafah Dalihan Na Tolu'
        ];

        return response()->json([
            'status' => 'success',
            'api_version' => 'v1.0',
            'query' => [
                'my_gender' => $myGender,
                'relation' => $relation,
            ],
            'partuturan' => $result['term'],
            'explanation' => $result['meaning'],
            'philosophical_pillar' => 'Dalihan Na Tolu (Somba Marhula-hula, Manat Mardongan Tubu, Elek Marboru)',
        ]);
    }

    /**
     * Open Aksara Batak Transliteration API
     * Mengonversi teks alfabet Latin menjadi representasi Surat Batak Toba sesuai standar Unicode ISO 15924.
     */
    public function transliterateAksara(Request $request)
    {
        $text = $request->query('text', 'Horas');
        $output = $this->convertLatinToAksara($text);

        return response()->json([
            'status' => 'success',
            'api_version' => 'v1.0',
            'latin_text' => $text,
            'aksara_batak' => $output,
            'unicode_range' => 'U+1BC0..U+1BFF (Batak Script Standard ISO 15924)',
        ]);
    }

    /**
     * Syllable-aware Latin to Surat Batak Toba Transliteration
     */
    private function convertLatinToAksara(string $text): string
    {
        if (trim($text) === '') return '';

        // Consonant map (Ina ni Surat)
        $consonants = [
            'ng' => "\xE1\xAF\x9D", // U+1BDD ᯝ
            'ny' => "\xE1\xAF\xA0", // U+1BE0 ᯠ
            'h'  => "\xE1\xAF\x82", // U+1BC2 ᯂ
            'k'  => "\xE1\xAF\x82", // U+1BC2 ᯂ
            'b'  => "\xE1\xAF\x85", // U+1BC5 ᯅ
            'p'  => "\xE1\xAF\x87", // U+1BC7 ᯇ
            'n'  => "\xE1\xAF\x89", // U+1BC9 ᯉ
            'w'  => "\xE1\xAF\x8B", // U+1BCB ᯋ
            'g'  => "\xE1\xAF\x8E", // U+1BCE ᯎ
            'j'  => "\xE1\xAF\x90", // U+1BD0 ᯐ
            'd'  => "\xE1\xAF\x91", // U+1BD1 ᯑ
            'r'  => "\xE1\xAF\x92", // U+1BD2 ᯒ
            'm'  => "\xE1\xAF\x94", // U+1BD4 ᯔ
            't'  => "\xE1\xAF\x96", // U+1BD6 ᯖ
            's'  => "\xE1\xAF\x98", // U+1BD8 ᯘ
            'y'  => "\xE1\xAF\x9B", // U+1BDB ᯛ
            'l'  => "\xE1\xAF\x9E", // U+1BDE ᯞ
            'c'  => "\xE1\xAF\xA1", // U+1BE1 ᯡ
        ];

        // Vowel signs (Anak ni Surat)
        $vowelSigns = [
            'e' => "\xE1\xAF\xA7", // U+1BE7 ᯧ
            'i' => "\xE1\xAF\xAA", // U+1BEA ᯪ
            'o' => "\xE1\xAF\xAC", // U+1BEC ᯬ
            'u' => "\xE1\xAF\xAE", // U+1BEE ᯮ
        ];

        // Independent vowels
        $indepVowels = [
            'a' => "\xE1\xAF\x80", // U+1BC0 ᯀ
            'i' => "\xE1\xAF\xA4", // U+1BE4 ᯤ
            'u' => "\xE1\xAF\xA5", // U+1BE5 ᯥ
            'e' => "\xE1\xAF\x80\xE1\xAF\xA7", // ᯀᯧ
            'o' => "\xE1\xAF\x80\xE1\xAF\xAC", // ᯀᯬ
        ];

        $pangolat = "\xE1\xAF\xB3";   // U+1BF3 ᯳ (matikan vokal)
        $haminsaran = "\xE1\xAF\xB0"; // U+1BF0 ᯰ (final -ng)
        $hajoringan = "\xE1\xAF\xB2"; // U+1BF2 ᯲ (final -h)
        $binduGodang = "\xE1\xAF\xBD"; // U+1BFD ᯽

        $lower = strtolower(trim($text));
        $len = strlen($lower);
        $result = '';
        $i = 0;

        while ($i < $len) {
            $ch = $lower[$i];

            if ($ch === ' ') {
                $result .= ' ';
                $i++;
                continue;
            }

            if ($ch === '.' || $ch === '!' || $ch === '?') {
                $result .= ' ' . $binduGodang . ' ';
                $i++;
                continue;
            }

            if (!preg_match('/[a-z]/', $ch)) {
                $result .= $ch;
                $i++;
                continue;
            }

            // Check 2-char consonant
            $consonant = null;
            $consLen = 0;
            if ($i + 1 < $len) {
                $two = substr($lower, $i, 2);
                if ($two === 'ng' || $two === 'ny') {
                    $consonant = $two;
                    $consLen = 2;
                }
            }

            if (!$consonant && isset($consonants[$ch])) {
                $consonant = $ch;
                $consLen = 1;
            }

            if ($consonant) {
                $baseChar = $consonants[$consonant];
                $nextCh = ($i + $consLen < $len) ? $lower[$i + $consLen] : null;

                if ($nextCh && in_array($nextCh, ['a', 'e', 'i', 'o', 'u'], true)) {
                    $result .= $baseChar;
                    if ($nextCh !== 'a') {
                        $result .= $vowelSigns[$nextCh] ?? '';
                    }
                    $i += $consLen + 1;
                } else {
                    // Dead consonant
                    if ($consonant === 'ng') {
                        $result .= $haminsaran;
                    } elseif ($consonant === 'h') {
                        $result .= $hajoringan;
                    } else {
                        $result .= $baseChar . $pangolat;
                    }
                    $i += $consLen;
                }
            } elseif (in_array($ch, ['a', 'e', 'i', 'o', 'u'], true)) {
                $result .= $indepVowels[$ch] ?? $ch;
                $i++;
            } else {
                $result .= $ch;
                $i++;
            }
        }

        return $result;
    }
}
