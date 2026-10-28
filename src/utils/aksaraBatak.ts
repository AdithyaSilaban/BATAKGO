/**
 * Aksara Batak (Surat Batak - Surat Toba) Transliteration Engine
 * Unicode range: U+1BC0 to U+1BFF (Batak script)
 * 
 * Includes:
 * - Ina ni Surat (Induk Huruf)
 * - Anak ni Surat (Diakritik / Tanda Bunyi: Hatadingan, Haborotan, Siala Hanapi, Haminsaran, Pangolat)
 */

export interface AksaraChar {
  latin: string;
  batakUnicode: string;
  description: string;
}

// Ina ni Surat (Root Consonants and Standalone Vowels in Batak Toba)
export const INA_NI_SURAT: Record<string, string> = {
  a: '\u1BC0',  // ᯀ A
  ba: '\u1BD1', // ᯑ BA
  ca: '\u1BD0', // ᯐ CA (rare, usually represented as sa or ja)
  da: '\u1BD5', // ᯕ DA
  e: '\u1BC2',  // ᯂ E
  ga: '\u1BCB', // ᯋ GA
  ha: '\u1BCA', // ᯊ HA / KA
  ka: '\u1BCA', // ᯊ HA
  i: '\u1BC3',  // ᯃ I
  ja: '\u1BD8', // ᯘ JA
  la: '\u1BD3', // ᯓ LA
  ma: '\u1BD6', // ᯖ MA
  na: '\u1BCC', // ᯌ NA
  nga: '\u1BCF',// ᯏ NGA
  nya: '\u1BCD',// ᯍ NYA
  o: '\u1BC4',  // ᯄ O
  pa: '\u1BCE', // ᯎ PA
  ra: '\u1BD2', // ᯒ RA
  sa: '\u1BD9', // ᯙ SA
  ta: '\u1BD4', // ᯔ TA
  u: '\u1BC1',  // ᯁ U
  wa: '\u1BDA', // ᯚ WA
  ya: '\u1BD7', // ᯗ YA
};

// Anak ni Surat (Diacritics for Batak Toba)
export const ANAK_NI_SURAT = {
  e: '\u1BE7',    // ᯧ Hatadingan (-e)
  i: '\u1BE8',    // ᯨ Haluan / Ulu (-i)
  u: '\u1BE9',    // ᯩ Haborotan (-u)
  o: '\u1BEA',    // ᯪ Siala Hanapi (-o)
  ng: '\u1BEE',   // ᯮ Haminsaran (final -ng)
  pangolat: '\u1BEF', // ᯯ Pangolat (virama / matikan vokal a)
  binduGodang: '\u1BFA', // ᯺ Bindu Godang (tanda awal/akhir bab)
  binduJudul: '\u1BFB',  // ᯻ Bindu Judul
};

/**
 * Converts Latin Batak text into authentic Unicode Surat Batak
 */
export function latinToAksaraBatak(text: string): string {
  if (!text) return '';
  const cleaned = text.toLowerCase().trim();
  let result = '';
  let i = 0;

  while (i < cleaned.length) {
    const ch = cleaned[i];

    // Handle spaces and punctuation
    if (ch === ' ') {
      result += ' ';
      i++;
      continue;
    }
    if (ch === '.' || ch === '!' || ch === '?') {
      result += ' ' + ANAK_NI_SURAT.binduGodang + ' ';
      i++;
      continue;
    }
    if (ch === ',') {
      result += ' \u1BF8 ';
      i++;
      continue;
    }

    // Check 3-letter combinations (e.g. 'nga', 'nya')
    const three = cleaned.slice(i, i + 3);
    const two = cleaned.slice(i, i + 2);

    if (two === 'ng') {
      // Is it followed by a vowel?
      const nextVowel = cleaned[i + 2];
      if (nextVowel && 'aeiou'.includes(nextVowel)) {
        // syllabic 'nga', 'nge', 'ngi', 'ngo', 'ngu'
        result += INA_NI_SURAT.nga;
        if (nextVowel === 'e') result += ANAK_NI_SURAT.e;
        else if (nextVowel === 'i') result += ANAK_NI_SURAT.i;
        else if (nextVowel === 'u') result += ANAK_NI_SURAT.u;
        else if (nextVowel === 'o') result += ANAK_NI_SURAT.o;
        i += 3;
        continue;
      } else {
        // final ng diacritic
        result += ANAK_NI_SURAT.ng;
        i += 2;
        continue;
      }
    }

    if (two === 'ny' && 'aeiou'.includes(cleaned[i + 2] || '')) {
      const nextVowel = cleaned[i + 2];
      result += INA_NI_SURAT.nya;
      if (nextVowel === 'e') result += ANAK_NI_SURAT.e;
      else if (nextVowel === 'i') result += ANAK_NI_SURAT.i;
      else if (nextVowel === 'u') result += ANAK_NI_SURAT.u;
      else if (nextVowel === 'o') result += ANAK_NI_SURAT.o;
      i += 3;
      continue;
    }

    // Standalone vowels at the beginning of a word or after another vowel
    if ('aeiou'.includes(ch)) {
      result += INA_NI_SURAT[ch] || ch;
      i++;
      continue;
    }

    // Consonant + Vowel or Consonant alone
    const nextChar = cleaned[i + 1];
    const consonantKey = ch + 'a';
    const baseChar = INA_NI_SURAT[consonantKey];

    if (baseChar) {
      if (nextChar && 'aeiou'.includes(nextChar)) {
        result += baseChar;
        if (nextChar === 'e') result += ANAK_NI_SURAT.e;
        else if (nextChar === 'i') result += ANAK_NI_SURAT.i;
        else if (nextChar === 'u') result += ANAK_NI_SURAT.u;
        else if (nextChar === 'o') result += ANAK_NI_SURAT.o;
        // if nextChar === 'a', baseChar inherently includes 'a' sound!
        i += 2;
      } else {
        // Consonant with no vowel following (killed with pangolat)
        result += baseChar + ANAK_NI_SURAT.pangolat;
        i++;
      }
    } else {
      // Unrecognized character
      result += ch;
      i++;
    }
  }

  return result;
}
