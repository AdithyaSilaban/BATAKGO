/**
 * Aksara Batak (Surat Batak - Surat Toba) Transliteration Engine
 * Compliant with Unicode Standard ISO 15924 (Range: U+1BC0 to U+1BFF)
 * 
 * Includes:
 * - Ina ni Surat (Root Consonants & Independent Vowels)
 * - Anak ni Surat (Diacritics: Hatadingan, Ulu, Haborotan, Siala Hanapi, Haminsaran, Hajoringan, Pangolat)
 */

export interface AksaraChar {
  latin: string;
  batakUnicode: string;
  description: string;
}

// 1. Ina ni Surat (Induk Huruf Batak Toba)
export const INA_NI_SURAT: Record<string, string> = {
  a: '\u1BC0',   // ᯀ A (Independent Vowel)
  ha: '\u1BC2',  // ᯂ HA / KA
  ka: '\u1BC2',  // ᯂ KA
  ba: '\u1BC5',  // ᯅ BA
  pa: '\u1BC7',  // ᯇ PA
  na: '\u1BC9',  // ᯉ NA
  wa: '\u1BCB',  // ᯋ WA
  ga: '\u1BCE',  // ᯎ GA
  ja: '\u1BD0',  // ᯐ JA
  da: '\u1BD1',  // ᯑ DA
  ra: '\u1BD2',  // ᯒ RA
  ma: '\u1BD4',  // ᯔ MA
  ta: '\u1BD6',  // ᯖ TA (Southern / Toba)
  sa: '\u1BD8',  // ᯘ SA
  ya: '\u1BDB',  // ᯛ YA
  nga: '\u1BDD', // ᯝ NGA
  la: '\u1BDE',  // ᯞ LA
  nya: '\u1BE0', // ᯠ NYA
  ca: '\u1BE1',  // ᯡ CA
  i: '\u1BE4',   // ᯤ I (Independent Vowel)
  u: '\u1BE5',   // ᯥ U (Independent Vowel)
};

// 2. Anak ni Surat (Diakritik / Tanda Vokal & Konsonan Akhir Batak Toba)
export const ANAK_NI_SURAT = {
  e: '\u1BE7',        // ᯧ Hatadingan (vokal -e)
  i: '\u1BEA',        // ᯪ Ulu (vokal -i)
  o: '\u1BEC',        // ᯬ Siala Hanapi (vokal -o)
  u: '\u1BEE',        // ᯮ Haborotan (vokal -u)
  ng: '\u1BF0',       // ᯰ Haminsaran (konsonan akhir -ng)
  h: '\u1BF2',        // ᯲ Hajoringan (konsonan akhir -h)
  pangolat: '\u1BF3', // ᯳ Pangolat (matikan vokal inherent -a)
  binduGodang: '\u1BFD', // ᯽ Bindu Na Pulung / Godang
  binduMetder: '\u1BFC', // ᯼ Bindu Na Metder
};

// Consonant code mapping (prefix)
const CONSONANT_MAP: Record<string, string> = {
  ng: '\u1BDD',
  ny: '\u1BE0',
  h: '\u1BC2',
  k: '\u1BC2',
  b: '\u1BC5',
  p: '\u1BC7',
  n: '\u1BC9',
  w: '\u1BCB',
  g: '\u1BCE',
  j: '\u1BD0',
  d: '\u1BD1',
  r: '\u1BD2',
  m: '\u1BD4',
  t: '\u1BD6',
  s: '\u1BD8',
  y: '\u1BDB',
  l: '\u1BDE',
  c: '\u1BE1',
};

// Vowel diacritic mapping
const VOWEL_DIACRITICS: Record<string, string> = {
  e: ANAK_NI_SURAT.e,
  i: ANAK_NI_SURAT.i,
  o: ANAK_NI_SURAT.o,
  u: ANAK_NI_SURAT.u,
};

// Independent vowels at start of syllable or word
const INDEPENDENT_VOWELS: Record<string, string> = {
  a: INA_NI_SURAT.a,
  i: INA_NI_SURAT.i,
  u: INA_NI_SURAT.u,
  e: INA_NI_SURAT.a + ANAK_NI_SURAT.e,
  o: INA_NI_SURAT.a + ANAK_NI_SURAT.o,
};

/**
 * Converts Latin Batak word into authentic Unicode Surat Batak Toba
 */
export function transliterateWord(word: string): string {
  if (!word) return '';
  const lower = word.toLowerCase();
  let result = '';
  let i = 0;
  const len = lower.length;

  while (i < len) {
    const ch = lower[i];

    // Non-alphabet passthrough (e.g. hyphen, digits)
    if (!/[a-z]/.test(ch)) {
      result += ch;
      i++;
      continue;
    }

    // 1. Check for 2-letter consonant clusters (ng, ny)
    let consonant = '';
    let consLen = 0;
    if (i + 1 < len) {
      const two = lower.slice(i, i + 2);
      if (two === 'ng' || two === 'ny') {
        consonant = two;
        consLen = 2;
      }
    }

    // If not multi-letter, check single consonant
    if (!consonant && CONSONANT_MAP[ch]) {
      consonant = ch;
      consLen = 1;
    }

    if (consonant) {
      // Consonant found
      const baseChar = CONSONANT_MAP[consonant];
      const afterCons = lower[i + consLen];

      if (afterCons && 'aeiou'.includes(afterCons)) {
        // Consonant + Vowel
        result += baseChar;
        if (afterCons !== 'a') {
          result += VOWEL_DIACRITICS[afterCons] || '';
        }
        i += consLen + 1;
      } else {
        // Consonant followed by another consonant or end of word (Dead Consonant)
        if (consonant === 'ng') {
          // Special Haminsaran diacritic for final -ng
          result += ANAK_NI_SURAT.ng;
        } else if (consonant === 'h') {
          // Special Hajoringan diacritic for final -h
          result += ANAK_NI_SURAT.h;
        } else {
          // Standalone consonant killed with Pangolat
          result += baseChar + ANAK_NI_SURAT.pangolat;
        }
        i += consLen;
      }
    } else if ('aeiou'.includes(ch)) {
      // Standalone vowel (syllable initial)
      result += INDEPENDENT_VOWELS[ch] || ch;
      i++;
    } else {
      result += ch;
      i++;
    }
  }

  return result;
}

/**
 * Converts Latin Batak text into authentic Unicode Surat Batak Toba
 */
export function latinToAksaraBatak(text: string): string {
  if (!text) return '';
  const words = text.split(/(\s+|[.,!?;:])/);
  return words
    .map(w => {
      if (!w) return '';
      if (/^\s+$/.test(w)) return w;
      if (w === '.' || w === '!' || w === '?') return ' ' + ANAK_NI_SURAT.binduGodang + ' ';
      if (w === ',' || w === ';') return ' ' + ANAK_NI_SURAT.binduMetder + ' ';
      return transliterateWord(w);
    })
    .join('');
}
