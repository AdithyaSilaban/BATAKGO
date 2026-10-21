/**
 * Sistem Partuturan Batak (Dalihan Na Tolu Kinship System)
 * 
 * Dalihan Na Tolu:
 * 1. Somba Marhula-hula (Hormat kepada pihak keluarga pemberi istri)
 * 2. Elek Marboru (Mengayomi dan menyayangi pihak perempuan penerima istri)
 * 3. Manat Mardongan Tubu (Hati-hati dan saling menghormati saudara semarga)
 */

export interface TuturRule {
  id: string;
  relation: string;
  batakTerm: string;
  counterTerm: string;
  dalihanCategory: 'Hula-hula' | 'Dongan Tubu' | 'Boru' | 'Umum';
  description: string;
  example: string;
}

export const PARTUTURAN_RULES: TuturRule[] = [
  {
    id: 'tulang',
    relation: 'Saudara laki-laki dari Ibu',
    batakTerm: 'Tulang',
    counterTerm: 'Bere',
    dalihanCategory: 'Hula-hula',
    description: 'Pihak hula-hula yang paling dihormati. Saudara kandung laki-laki dari ibumu dipanggil Tulang.',
    example: 'Ibuku boru Simanjuntak, adik laki-lakinya kupanggil Tulang. Beliau memanggilku Bere.'
  },
  {
    id: 'nantulang',
    relation: 'Istri dari Tulang',
    batakTerm: 'Nantulang',
    counterTerm: 'Bere',
    dalihanCategory: 'Hula-hula',
    description: 'Istri dari Tulang. Posisi terhormat dalam adat Batak.',
    example: 'Istri dari Tulang dipanggil Nantulang.'
  },
  {
    id: 'amangboru',
    relation: 'Suami dari saudara perempuan Ayah',
    batakTerm: 'Amangboru',
    counterTerm: 'Ibebere / Bere',
    dalihanCategory: 'Boru',
    description: 'Suami dari Namboru (saudara perempuan ayah). Tergolong pihak boru bagi keluarga ayahmu.',
    example: 'Adik perempuan ayahku menikah dengan marga Siregar. Suaminya kupanggil Amangboru.'
  },
  {
    id: 'namboru',
    relation: 'Saudara perempuan dari Ayah',
    batakTerm: 'Namboru',
    counterTerm: 'Ibebere / Bere',
    dalihanCategory: 'Boru',
    description: 'Saudara kandung perempuan dari ayahmu. Sangat disayangi dan dihormati.',
    example: 'Kakak atau adik perempuan dari ayah adalah Namboru kita.'
  },
  {
    id: 'ito',
    relation: 'Saudara perempuan bagi laki-laki (atau saudara laki-laki bagi perempuan)',
    batakTerm: 'Ito / Iboto',
    counterTerm: 'Ito / Iboto',
    dalihanCategory: 'Dongan Tubu',
    description: 'Panggilan respek saling menyapa antara pria dan wanita sebaya bermarga sama atau dalam pertemanan Batak yang saling menghormati.',
    example: 'Seorang pria Batak memanggil saudara perempuannya atau wanita sebaya dengan panggilan Ito.'
  },
  {
    id: 'lae',
    relation: 'Laki-laki ke saudara laki-laki istri, atau anak laki-laki dari Namboru',
    batakTerm: 'Lae',
    counterTerm: 'Lae',
    dalihanCategory: 'Umum',
    description: 'Sapaan persaudaraan akrab antar pria Batak yang berbeda marga dan berpotensi saling berkerabat.',
    example: 'Anak laki-laki dari namboru atau tulang sebaya dipanggil Lae. "Horas, Lae!"'
  },
  {
    id: 'eda',
    relation: 'Wanita ke saudara perempuan suaminya, atau istri dari saudara laki-lakinya',
    batakTerm: 'Eda',
    counterTerm: 'Eda',
    dalihanCategory: 'Boru',
    description: 'Panggilan akrab antar sesama wanita yang saling berbesan atau ipar perempuan.',
    example: 'Dua orang wanita yang salah satunya menikah dengan saudara laki-laki yang lain saling memanggil Eda.'
  },
  {
    id: 'amangtua_uda',
    relation: 'Abang kandung dari Ayah / Adik laki-laki dari Ayah',
    batakTerm: 'Amangtua (Abang) / Amanguda (Adik)',
    counterTerm: 'Anak / Boru',
    dalihanCategory: 'Dongan Tubu',
    description: 'Saudara laki-laki ayah satu marga. Yang lebih tua dari ayah dipanggil Amangtua, yang lebih muda dipanggil Amanguda.',
    example: 'Abang kandung ayah dipanggil Amangtua, istrinya Inangtua.'
  },
  {
    id: 'ompu',
    relation: 'Kakek atau Nenek',
    batakTerm: 'Ompung Doli (Kakek) / Ompung Boru (Nenek)',
    counterTerm: 'Pahompu (Cucu)',
    dalihanCategory: 'Dongan Tubu',
    description: 'Generasi kakek dan nenek yang sangat dihormati dan dituakan.',
    example: 'Ompung doli nami mansai burju (Kakek kami sangat baik hati).'
  }
];

export function findPartuturan(query: string): TuturRule[] {
  if (!query) return PARTUTURAN_RULES;
  const q = query.toLowerCase();
  return PARTUTURAN_RULES.filter(
    r =>
      r.relation.toLowerCase().includes(q) ||
      r.batakTerm.toLowerCase().includes(q) ||
      r.counterTerm.toLowerCase().includes(q) ||
      r.dalihanCategory.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
  );
}
