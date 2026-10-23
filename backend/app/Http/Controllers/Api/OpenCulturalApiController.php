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
        $relation = $request->query('relation', 'iboto'); 

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
     * Mengonversi teks alfabet Latin menjadi representasi Surat Batak.
     */
    public function transliterateAksara(Request $request)
    {
        $text = $request->query('text', 'Horas');

        // Simple mapping table for Surat Batak Toba (Unicode U+1BC0 - U+1BFF)
        $charMap = [
            'a' => 'ᯀ', 'b' => 'ᯅ', 'c' => 'ᯡ', 'd' => 'ᯑ', 'e' => 'ᯀᯩ',
            'g' => 'ᯎ', 'h' => 'ᯂ', 'i' => 'ᯤ', 'j' => 'ᯐ', 'k' => 'ᯂ',
            'l' => 'ᯞ', 'm' => 'ᯔ', 'n' => 'ᯉ', 'o' => 'ᯀᯬ', 'p' => 'ᯇ',
            'r' => 'ᯒ', 's' => 'ᯘ', 't' => 'ᯖ', 'u' => 'ᯥ', 'w' => 'ᯋ',
            'y' => 'ᯛ', 'ng' => 'ᯝ',
        ];

        $lower = strtolower(trim($text));
        $output = '';
        $i = 0;
        $len = strlen($lower);

        while ($i < $len) {
            if ($i + 1 < $len && substr($lower, $i, 2) === 'ng') {
                $output .= $charMap['ng'];
                $i += 2;
                continue;
            }
            $ch = $lower[$i];
            if (isset($charMap[$ch])) {
                $output .= $charMap[$ch];
            } else if ($ch === ' ') {
                $output .= ' ';
            } else {
                $output .= $ch;
            }
            $i++;
        }

        return response()->json([
            'status' => 'success',
            'api_version' => 'v1.0',
            'latin_text' => $text,
            'aksara_batak' => $output,
            'unicode_range' => 'U+1BC0..U+1BFF (Batak Script Standard ISO 15924)',
        ]);
    }
}

