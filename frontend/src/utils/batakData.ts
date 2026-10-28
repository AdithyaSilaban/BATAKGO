/**
 * BATAKGO Learning Content & Vocabulary Engine
 * Dialect: Batak Toba (with cross-dialect Karo/Mandailing cultural notes)
 */

export interface Question {
  id: string;
  type: 'multiple_choice' | 'listening' | 'sentence_builder' | 'match_pairs' | 'pronunciation';
  prompt: string;
  batakText?: string;
  phonetic?: string;
  syllables?: string[];
  audioSpeed?: number;
  translation: string;
  options?: string[];
  correctAnswer: string | string[];
  wordBank?: string[];
  pairs?: { batak: string; indonesian: string }[];
  culturalTip?: string;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  xpReward: number;
  iconName: string;
  questions: Question[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  batakTitle: string;
  description: string;
  bannerColor: string;
  themeColor: string;
  lessons: Lesson[];
}

export interface VocabItem {
  id: string;
  batak: string;
  indonesian: string;
  category: 'sapaan' | 'keluarga' | 'angka' | 'makanan' | 'kata_kerja' | 'budaya' | 'sifat';
  phonetic: string;
  syllables: string[];
  exampleBatak: string;
  exampleIndonesian: string;
  audioNote?: string;
}

export const VOCABULARY_LIST: VocabItem[] = [
  {
    id: 'horas',
    batak: 'Horas',
    indonesian: 'Halo / Salam sejahtera / Selamat',
    category: 'sapaan',
    phonetic: 'ho-ras',
    syllables: ['Ho', 'ras'],
    exampleBatak: 'Horas ma di hita saluhutna!',
    exampleIndonesian: 'Salam sejahtera bagi kita sekalian!'
  },
  {
    id: 'mauliate',
    batak: 'Mauliate',
    indonesian: 'Terima kasih',
    category: 'sapaan',
    phonetic: 'mau-li-a-te',
    syllables: ['Mau', 'li', 'a', 'te'],
    exampleBatak: 'Mauliate godang, lae!',
    exampleIndonesian: 'Terima kasih banyak, kawan!'
  },
  {
    id: 'songon_dia',
    batak: 'Songon dia kabar?',
    indonesian: 'Bagaimana kabarmu?',
    category: 'sapaan',
    phonetic: 'so-ngon di-a ka-bar',
    syllables: ['So', 'ngon', 'di', 'a', 'ka', 'bar'],
    exampleBatak: 'Songon dia kabar muna nuaeng?',
    exampleIndonesian: 'Bagaimana kabar kalian sekarang?'
  },
  {
    id: 'hipas',
    batak: 'Hipas / Sehat do',
    indonesian: 'Sehat-sehat saja',
    category: 'sapaan',
    phonetic: 'hi-pas / se-hat do',
    syllables: ['Hi', 'pas', 'do', 'au'],
    exampleBatak: 'Hipas do au, mauliate.',
    exampleIndonesian: 'Aku sehat saja, terima kasih.'
  },
  {
    id: 'amang',
    batak: 'Amang',
    indonesian: 'Ayah / Bapak',
    category: 'keluarga',
    phonetic: 'a-mang',
    syllables: ['A', 'mang'],
    exampleBatak: 'Marlas ni roha do amang.',
    exampleIndonesian: 'Ayah sangat bergembira.'
  },
  {
    id: 'inang',
    batak: 'Inang',
    indonesian: 'Ibu / Mama',
    category: 'keluarga',
    phonetic: 'i-nang',
    syllables: ['I', 'nang'],
    exampleBatak: 'Holong roha ni inang tu hita.',
    exampleIndonesian: 'Kasih sayang ibu kepada kita.'
  },
  {
    id: 'ito',
    batak: 'Ito / Iboto',
    indonesian: 'Saudara perempuan / sapaan sopan pria ke wanita',
    category: 'keluarga',
    phonetic: 'i-to',
    syllables: ['I', 'to'],
    exampleBatak: 'Tudia ho ito na uli?',
    exampleIndonesian: 'Mau ke mana kamu saudari yang cantik?'
  },
  {
    id: 'lae',
    batak: 'Lae',
    indonesian: 'Ipar laki-laki / Sapaan akrab sesama pria Batak',
    category: 'keluarga',
    phonetic: 'la-e',
    syllables: ['La', 'e'],
    exampleBatak: 'Horas lae, mangan hita jolo!',
    exampleIndonesian: 'Halo sahabat, ayo kita makan dulu!'
  },
  {
    id: 'tulang',
    batak: 'Tulang',
    indonesian: 'Paman (saudara laki-laki ibu)',
    category: 'keluarga',
    phonetic: 'tu-lang',
    syllables: ['Tu', 'lang'],
    exampleBatak: 'Ro do tulang mamboan pasu-pasu.',
    exampleIndonesian: 'Paman datang membawa berkat.'
  },
  {
    id: 'mangan',
    batak: 'Mangan',
    indonesian: 'Makan',
    category: 'kata_kerja',
    phonetic: 'ma-ngan',
    syllables: ['Ma', 'ngan'],
    exampleBatak: 'Nga mangan ho, ito?',
    exampleIndonesian: 'Sudah makankah kamu, saudari?'
  },
  {
    id: 'inum',
    batak: 'Minum',
    indonesian: 'Minum',
    category: 'kata_kerja',
    phonetic: 'mi-num',
    syllables: ['Mi', 'num'],
    exampleBatak: 'Minum aek na ngali hita.',
    exampleIndonesian: 'Mari kita minum air sejuk.'
  },
  {
    id: 'modom',
    batak: 'Modom',
    indonesian: 'Tidur',
    category: 'kata_kerja',
    phonetic: 'mo-dom',
    syllables: ['Mo', 'dom'],
    exampleBatak: 'Nunga borngin, laho modom ma au.',
    exampleIndonesian: 'Sudah malam, aku mau tidur.'
  },
  {
    id: 'marsiajar',
    batak: 'Marsiajar',
    indonesian: 'Belajar',
    category: 'kata_kerja',
    phonetic: 'mar-si-a-jar',
    syllables: ['Mar', 'si', 'a', 'jar'],
    exampleBatak: 'Marsiajar hata Batak hita dohot BATAKGO.',
    exampleIndonesian: 'Kita belajar bahasa Batak bersama BATAKGO.'
  },
  {
    id: 'sada',
    batak: 'Sada',
    indonesian: 'Satu (1)',
    category: 'angka',
    phonetic: 'sa-da',
    syllables: ['Sa', 'da'],
    exampleBatak: 'Sada roha hita.',
    exampleIndonesian: 'Kita sehati sejiwa.'
  },
  {
    id: 'dua',
    batak: 'Dua',
    indonesian: 'Dua (2)',
    category: 'angka',
    phonetic: 'du-a',
    syllables: ['Du', 'a'],
    exampleBatak: 'Dua halak ro tu jabu.',
    exampleIndonesian: 'Dua orang datang ke rumah.'
  },
  {
    id: 'tolu',
    batak: 'Tolu',
    indonesian: 'Tiga (3)',
    category: 'angka',
    phonetic: 'to-lu',
    syllables: ['To', 'lu'],
    exampleBatak: 'Dalihan Na Tolu falsafah Batak.',
    exampleIndonesian: 'Dalihan Na Tolu falsafah hidup Batak.'
  },
  {
    id: 'opat',
    batak: 'Opat',
    indonesian: 'Empat (4)',
    category: 'angka',
    phonetic: 'o-pat',
    syllables: ['O', 'pat'],
    exampleBatak: 'Opat sundut hami dison.',
    exampleIndonesian: 'Sudah empat generasi kami di sini.'
  },
  {
    id: 'lima',
    batak: 'Lima',
    indonesian: 'Lima (5)',
    category: 'angka',
    phonetic: 'li-ma',
    syllables: ['Li', 'ma'],
    exampleBatak: 'Lima boru na uli.',
    exampleIndonesian: 'Lima anak perempuan yang cantik.'
  },
  {
    id: 'sampulu',
    batak: 'Sampulu',
    indonesian: 'Sepuluh (10)',
    category: 'angka',
    phonetic: 'sam-pu-lu',
    syllables: ['Sam', 'pu', 'lu'],
    exampleBatak: 'Sampulu ari nai pesta.',
    exampleIndonesian: 'Sepuluh hari lagi pesta adat.'
  },
  {
    id: 'ulos',
    batak: 'Ulos',
    indonesian: 'Kain tenun tradisional Batak lambang kehangatan dan doa restu',
    category: 'budaya',
    phonetic: 'u-los',
    syllables: ['U', 'los'],
    exampleBatak: 'Mangulosi pengantin dohot Ulos Ragidup.',
    exampleIndonesian: 'Menyematkan kain ulos Ragidup kepada kedua mempelai.'
  },
  {
    id: 'sigalegale',
    batak: 'Sigale-gale',
    indonesian: 'Patung kayu Batak legendaris yang dapat menari tortor',
    category: 'budaya',
    phonetic: 'si-ga-le ga-le',
    syllables: ['Si', 'ga', 'le', 'ga', 'le'],
    exampleBatak: 'Sigale-gale manortor di Samosir.',
    exampleIndonesian: 'Sigale-gale menari tortor di pulau Samosir.'
  },
  {
    id: 'tabo',
    batak: 'Tabo',
    indonesian: 'Enak / Lezat',
    category: 'sifat',
    phonetic: 'ta-bo',
    syllables: ['Ta', 'bo'],
    exampleBatak: 'Mansai tabo dekke naniura on!',
    exampleIndonesian: 'Sangat enak ikan mas naniura ini!'
  },
  {
    id: 'uli',
    batak: 'Uli',
    indonesian: 'Indah / Cantik / Bagus',
    category: 'sifat',
    phonetic: 'u-li',
    syllables: ['U', 'li'],
    exampleBatak: 'Tung mansai uli Tao Toba.',
    exampleIndonesian: 'Sungguh sangat indah Danau Toba.'
  }
];

export const UNITS: Unit[] = [
  {
    id: 'unit-1',
    number: 1,
    title: 'Salam, Sapaan & Kata Dasar',
    batakTitle: 'Horas & Sapaan Na Parjolo',
    description: 'Pelajari ucapan salam khas Batak, terima kasih, menanyakan kabar, dan sapaan harian.',
    bannerColor: 'bg-gradient-to-r from-red-600 to-amber-600',
    themeColor: '#DC2626',
    lessons: [
      {
        id: 'u1-l1',
        unitId: 'unit-1',
        title: 'Horas & Mauliate',
        description: 'Mengenal kata paling sakral dan penting dalam pergaulan Batak.',
        xpReward: 15,
        iconName: 'Sparkles',
        questions: [
          {
            id: 'q1',
            type: 'multiple_choice',
            prompt: 'Apa arti kata salam Batak yang paling terkenal "Horas"?',
            batakText: 'Horas',
            phonetic: 'ho-ras',
            syllables: ['Ho', 'ras'],
            translation: 'Halo / Salam Sejahtera / Selamat',
            options: ['Selamat tinggal', 'Halo / Salam sejahtera / Selamat', 'Sampai jumpa besok', 'Berapa harganya?'],
            correctAnswer: 'Halo / Salam sejahtera / Selamat',
            culturalTip: 'Kata "Horas" bukan hanya sekadar halo, tetapi bermakna doa berkat, kesehatan, dan keselamatan jiwa raga.'
          },
          {
            id: 'q2',
            type: 'listening',
            prompt: 'Dengarkan pelafalan audio penutur asli berikut dan pilih artinya:',
            batakText: 'Mauliate',
            phonetic: 'mau-li-a-te',
            syllables: ['Mau', 'li', 'a', 'te'],
            translation: 'Terima kasih',
            options: ['Terima kasih', 'Sama-sama', 'Minta maaf', 'Silakan masuk'],
            correctAnswer: 'Terima kasih',
            culturalTip: 'Jika ingin mengucapkan terima kasih banyak, ucapkan "Mauliate godang!".'
          },
          {
            id: 'q3',
            type: 'sentence_builder',
            prompt: 'Susun kata-kata berikut menjadi kalimat: "Salam sejahtera bagi kita sekalian!"',
            translation: 'Salam sejahtera bagi kita sekalian!',
            correctAnswer: ['Horas', 'ma', 'di', 'hita', 'saluhutna'],
            wordBank: ['Horas', 'ma', 'di', 'hita', 'saluhutna', 'tabo', 'lae', 'amang'],
            culturalTip: '"Hita saluhutna" berarti kita semua/sekalian.'
          },
          {
            id: 'q4',
            type: 'match_pairs',
            prompt: 'Cocokkan kosakata Batak dengan arti bahasa Indonesianya yang tepat:',
            translation: 'Latihan Mencocokkan Pasangan',
            correctAnswer: 'matched',
            pairs: [
              { batak: 'Horas', indonesian: 'Salam sejahtera' },
              { batak: 'Mauliate', indonesian: 'Terima kasih' },
              { batak: 'Hipas', indonesian: 'Sehat' },
              { batak: 'Au', indonesian: 'Saya / Aku' }
            ]
          },
          {
            id: 'q5',
            type: 'pronunciation',
            prompt: 'Latihan Pelafalan: Ucapkan kata "Horas" dengan lantang dan mantap!',
            batakText: 'Horas',
            phonetic: 'ho-ras',
            syllables: ['Ho', 'ras'],
            translation: 'Halo / Salam sejahtera',
            correctAnswer: 'Horas',
            culturalTip: 'Lafalkan "ho" dengan vokal bulat dan "ras" dengan getaran r yang tegas dan tuntas.'
          }
        ]
      },
      {
        id: 'u1-l2',
        unitId: 'unit-1',
        title: 'Menanyakan Kabar & Keadaan',
        description: 'Tanya kabar lawan bicara dengan ramah dan sopan.',
        xpReward: 15,
        iconName: 'MessageSquare',
        questions: [
          {
            id: 'q6',
            type: 'multiple_choice',
            prompt: 'Bagaimana cara menanyakan "Bagaimana kabarmu?" dalam bahasa Batak Toba?',
            batakText: 'Songon dia kabar?',
            phonetic: 'so-ngon di-a ka-bar',
            syllables: ['So', 'ngon', 'di', 'a', 'ka', 'bar'],
            translation: 'Bagaimana kabar?',
            options: ['Songon dia kabar?', 'Tudia ho laho?', 'Piga hepengmu?', 'Nga mangan ho?'],
            correctAnswer: 'Songon dia kabar?',
            culturalTip: '"Songon dia" berarti bagaimana atau seperti apa.'
          },
          {
            id: 'q7',
            type: 'listening',
            prompt: 'Dengarkan audio respon berikut: "Hipas do au". Apa artinya?',
            batakText: 'Hipas do au',
            phonetic: 'hi-pas do au',
            syllables: ['Hi', 'pas', 'do', 'au'],
            translation: 'Aku sehat saja',
            options: ['Aku sedang lapar', 'Aku sehat saja', 'Aku mau pergi', 'Aku lelah sekali'],
            correctAnswer: 'Aku sehat saja',
            culturalTip: 'Kata "hipas" menandakan kondisi jasmani dan rohani yang bugar dan segar.'
          },
          {
            id: 'q8',
            type: 'sentence_builder',
            prompt: 'Susun kalimat Batak untuk: "Aku sehat, terima kasih"',
            translation: 'Aku sehat, terima kasih',
            correctAnswer: ['Hipas', 'do', 'au', 'mauliate'],
            wordBank: ['Hipas', 'do', 'au', 'mauliate', 'ito', 'borngin', 'modom'],
            culturalTip: 'Struktur bahasa Batak sering menempatkan predikat keadaan di awal kalimat.'
          },
          {
            id: 'q9',
            type: 'pronunciation',
            prompt: 'Latihan Pelafalan: Ucapkan "Mauliate godang" (Terima kasih banyak)!',
            batakText: 'Mauliate godang',
            phonetic: 'mau-li-a-te go-dang',
            syllables: ['Mau', 'li', 'a', 'te', 'go', 'dang'],
            translation: 'Terima kasih banyak',
            correctAnswer: 'Mauliate godang',
            culturalTip: '"Godang" artinya banyak atau besar. Lafalkan "mau-li-a-te go-dang" dengan irama mengalir.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit-2',
    number: 2,
    title: 'Partuturan & Kekerabatan Batak',
    batakTitle: 'Partuturan Dalihan Na Tolu',
    description: 'Pahami cara memanggil kerabat: Lae, Ito, Tulang, Nantulang, dan prinsip Dalihan Na Tolu.',
    bannerColor: 'bg-gradient-to-r from-stone-800 to-red-900',
    themeColor: '#7F1D1D',
    lessons: [
      {
        id: 'u2-l1',
        unitId: 'unit-2',
        title: 'Lae & Ito: Panggilan Sebaya',
        description: 'Panggilan sehari-hari yang mempererat tali persaudaraan orang Batak.',
        xpReward: 20,
        iconName: 'Users',
        questions: [
          {
            id: 'q10',
            type: 'multiple_choice',
            prompt: 'Seorang pria Batak menyapa kawan wanitanya atau saudara perempuannya dengan panggilan apa?',
            batakText: 'Ito',
            phonetic: 'i-to',
            syllables: ['I', 'to'],
            translation: 'Panggilan respek saudara perempuan',
            options: ['Ito / Iboto', 'Lae', 'Tulang', 'Amangboru'],
            correctAnswer: 'Ito / Iboto',
            culturalTip: '"Ito" atau "Iboto" adalah panggilan kehormatan dan perlindungan pria Batak kepada saudara atau kawan perempuannya.'
          },
          {
            id: 'q11',
            type: 'multiple_choice',
            prompt: 'Sesama pria Batak yang berbeda marga dan seumuran biasanya saling menyapa dengan sebutan?',
            batakText: 'Lae',
            phonetic: 'la-e',
            syllables: ['La', 'e'],
            translation: 'Panggilan persaudaraan sesama pria',
            options: ['Lae', 'Eda', 'Inang', 'Namboru'],
            correctAnswer: 'Lae',
            culturalTip: '"Horas Lae!" adalah sapaan paling akrab dan penuh kehangatan saat dua pria Batak berjumpa di mana pun.'
          },
          {
            id: 'q12',
            type: 'sentence_builder',
            prompt: 'Susun kalimat: "Halo kawan, ayo kita makan dulu!"',
            translation: 'Halo kawan, ayo kita makan dulu!',
            correctAnswer: ['Horas', 'lae', 'mangan', 'hita', 'jolo'],
            wordBank: ['Horas', 'lae', 'mangan', 'hita', 'jolo', 'modom', 'borngin', 'sada'],
            culturalTip: '"Jolo" artinya dulu atau sebentar.'
          },
          {
            id: 'q13',
            type: 'pronunciation',
            prompt: 'Latihan Pelafalan: Ucapkan "Horas Lae, mangan hita!"',
            batakText: 'Horas Lae, mangan hita',
            phonetic: 'ho-ras la-e ma-ngan hi-ta',
            syllables: ['Ho', 'ras', 'La', 'e', 'ma', 'ngan', 'hi', 'ta'],
            translation: 'Halo kawan, mari kita makan!',
            correctAnswer: 'Horas Lae mangan hita',
            culturalTip: 'Ucapkan dengan nada hangat dan ramah seperti mengajak kawan akrab.'
          }
        ]
      },
      {
        id: 'u2-l2',
        unitId: 'unit-2',
        title: 'Tulang & Dalihan Na Tolu',
        description: 'Mengenal posisi terhormat Tulang (pihak hula-hula pemberi berkat).',
        xpReward: 20,
        iconName: 'Crown',
        questions: [
          {
            id: 'q14',
            type: 'multiple_choice',
            prompt: 'Saudara kandung laki-laki dari Ibu kita dipanggil dengan sebutan?',
            batakText: 'Tulang',
            phonetic: 'tu-lang',
            syllables: ['Tu', 'lang'],
            translation: 'Paman dari pihak Ibu',
            options: ['Tulang', 'Amangtua', 'Amangboru', 'Ompung'],
            correctAnswer: 'Tulang',
            culturalTip: 'Dalam adat Batak, Tulang berada pada posisi Hula-hula ("Mata ni ari binsar" / matahari terbit pemberi doa restu).'
          },
          {
            id: 'q15',
            type: 'match_pairs',
            prompt: 'Pasangkan panggilan Batak dengan pihak kerabatnya:',
            translation: 'Latihan Pasangan Partuturan',
            correctAnswer: 'matched',
            pairs: [
              { batak: 'Tulang', indonesian: 'Saudara laki-laki Ibu' },
              { batak: 'Namboru', indonesian: 'Saudara perempuan Ayah' },
              { batak: 'Amang', indonesian: 'Ayah / Bapak' },
              { batak: 'Inang', indonesian: 'Ibu / Mama' }
            ]
          },
          {
            id: 'q16',
            type: 'sentence_builder',
            prompt: 'Susun kalimat filosofi Batak: "Hormat kepada Hula-hula"',
            translation: 'Hormat kepada Hula-hula',
            correctAnswer: ['Somba', 'marhula-hula'],
            wordBank: ['Somba', 'marhula-hula', 'elek', 'manat', 'marboru', 'dongan'],
            culturalTip: 'Dalihan Na Tolu: Somba marhula-hula, Elek marboru, Manat mardongan tubu.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit-3',
    number: 3,
    title: 'Angka & Alam Tao Toba',
    batakTitle: 'Bilangan & Tao Toba Na Uli',
    description: 'Belajar berhitung 1 hingga 10 dan mendeskripsikan keindahan alam Danau Toba.',
    bannerColor: 'bg-gradient-to-r from-blue-700 to-teal-700',
    themeColor: '#0D9488',
    lessons: [
      {
        id: 'u3-l1',
        unitId: 'unit-3',
        title: 'Berhitung 1 sampai 5',
        description: 'Kuasai angka dasar Batak: Sada, Dua, Tolu, Opat, Lima.',
        xpReward: 15,
        iconName: 'Hash',
        questions: [
          {
            id: 'q17',
            type: 'multiple_choice',
            prompt: 'Apa bahasa Batak untuk angka "Tiga (3)"?',
            batakText: 'Tolu',
            phonetic: 'to-lu',
            syllables: ['To', 'lu'],
            translation: 'Tiga',
            options: ['Tolu', 'Sada', 'Opat', 'Sampulu'],
            correctAnswer: 'Tolu',
            culturalTip: 'Angka tiga (Tolu) sangat sakral dalam filsafat Batak Dalihan Na Tolu (Tiga tungku pembakaran).'
          },
          {
            id: 'q18',
            type: 'match_pairs',
            prompt: 'Cocokkan angka Batak dengan nominalnya:',
            translation: 'Angka Batak 1 - 4',
            correctAnswer: 'matched',
            pairs: [
              { batak: 'Sada', indonesian: '1 (Satu)' },
              { batak: 'Dua', indonesian: '2 (Dua)' },
              { batak: 'Tolu', indonesian: '3 (Tiga)' },
              { batak: 'Opat', indonesian: '4 (Empat)' }
            ]
          },
          {
            id: 'q19',
            type: 'sentence_builder',
            prompt: 'Susun kalimat: "Tung mansai uli Tao Toba" (Sungguh sangat indah Danau Toba)',
            translation: 'Sungguh sangat indah Danau Toba',
            correctAnswer: ['Tung', 'mansai', 'uli', 'Tao', 'Toba'],
            wordBank: ['Tung', 'mansai', 'uli', 'Tao', 'Toba', 'dekke', 'tabo', 'lae'],
            culturalTip: '"Tao" berarti Danau, "Uli" berarti Indah atau Cantik.'
          },
          {
            id: 'q20',
            type: 'pronunciation',
            prompt: 'Latihan Pelafalan: Ucapkan "Tung mansai uli Tao Toba"',
            batakText: 'Tung mansai uli Tao Toba',
            phonetic: 'tung man-sai u-li ta-o to-ba',
            syllables: ['Tung', 'man', 'sai', 'u', 'li', 'Ta', 'o', 'To', 'ba'],
            translation: 'Sungguh sangat indah Danau Toba',
            correctAnswer: 'Tung mansai uli Tao Toba',
            culturalTip: 'Lafalkan "u-li" dengan lembut dan "Ta-o To-ba" dengan vokal terbuka.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit-4',
    number: 4,
    title: 'Aktivitas Harian & Kuliner Khas',
    batakTitle: 'Ulaon Sadari & Sipanganon Batak',
    description: 'Kosakata makan, minum, tidur, serta kuliner khas Batak seperti Dekke Naniura.',
    bannerColor: 'bg-gradient-to-r from-emerald-700 to-green-900',
    themeColor: '#059669',
    lessons: [
      {
        id: 'u4-l1',
        unitId: 'unit-4',
        title: 'Mangan, Minum & Tabo',
        description: 'Bercakap-cakap seputar makanan dan rasa lezat masakan Batak.',
        xpReward: 20,
        iconName: 'Utensils',
        questions: [
          {
            id: 'q21',
            type: 'multiple_choice',
            prompt: 'Apa arti kata sifat Batak "Tabo"?',
            batakText: 'Tabo',
            phonetic: 'ta-bo',
            syllables: ['Ta', 'bo'],
            translation: 'Enak / Lezat',
            options: ['Enak / Lezat', 'Pahit', 'Panas', 'Manis sekali'],
            correctAnswer: 'Enak / Lezat',
            culturalTip: 'Bila menikmati masakan yang lezat, katakan "Mansai tabo!" (Sangat enak!).'
          },
          {
            id: 'q22',
            type: 'listening',
            prompt: 'Dengarkan kalimat: "Nga mangan ho, ito?". Apa artinya?',
            batakText: 'Nga mangan ho, ito?',
            phonetic: 'nga ma-ngan ho i-to',
            syllables: ['Nga', 'ma', 'ngan', 'ho', 'i', 'to'],
            translation: 'Sudah makankah kamu, saudari?',
            options: ['Sudah makankah kamu, saudari?', 'Kapan kamu pulang?', 'Berapa saudaramu?', 'Mau masak apa hari ini?'],
            correctAnswer: 'Sudah makankah kamu, saudari?',
            culturalTip: 'Di tanah Batak, menanyakan sudah makan atau belum adalah tanda perhatian dan keramahtamahan tertinggi.'
          },
          {
            id: 'q23',
            type: 'sentence_builder',
            prompt: 'Susun kalimat: "Ikan mas naniura ini sangat enak!"',
            translation: 'Ikan mas naniura ini sangat enak!',
            correctAnswer: ['Mansai', 'tabo', 'dekke', 'naniura', 'on'],
            wordBank: ['Mansai', 'tabo', 'dekke', 'naniura', 'on', 'aek', 'modom', 'horbo'],
            culturalTip: 'Dekke Naniura adalah sashimi khas Batak yang dimatangkan alami dengan asam jungga dan rempah andaliman.'
          }
        ]
      }
    ]
  },
  {
    id: 'unit-5',
    number: 5,
    title: 'Umpasa & Filosofi Sigale-gale',
    batakTitle: 'Umpasa & Budaya Sigale-gale',
    description: 'Selami peribahasa Batak (Umpasa), makna sakral Ulos, dan legenda patung Sigale-gale.',
    bannerColor: 'bg-gradient-to-r from-purple-800 to-indigo-900',
    themeColor: '#7C3AED',
    lessons: [
      {
        id: 'u5-l1',
        unitId: 'unit-5',
        title: 'Legenda Sigale-gale & Tortor',
        description: 'Mengenal asal-usul maskot kita, Sigale-gale yang dibalut Ulos tradisional.',
        xpReward: 25,
        iconName: 'Sparkles',
        questions: [
          {
            id: 'q24',
            type: 'multiple_choice',
            prompt: 'Apakah Sigale-gale dalam warisan tradisi Batak Samosir?',
            batakText: 'Sigale-gale',
            phonetic: 'si-ga-le ga-le',
            syllables: ['Si', 'ga', 'le', 'ga', 'le'],
            translation: 'Patung kayu Batak penari tortor berbusana adat',
            options: [
              'Patung kayu tradisional Batak yang dapat menari tortor diringi gordang',
              'Alat musik petik dari bambu',
              'Jenis senjata perang kuno Batak',
              'Perahu lesung di Danau Toba'
            ],
            correctAnswer: 'Patung kayu tradisional Batak yang dapat menari tortor diringi gordang',
            culturalTip: 'Sigale-gale dibuat oleh Raja Rahat untuk mengenang putranya, Manggale. Dilengkapi tali tersembunyi yang digerakkan sesuai irama gondang.'
          },
          {
            id: 'q25',
            type: 'sentence_builder',
            prompt: 'Susun pepatah Batak: "Sada roha hita saluhutna" (Kita semua sehati sejiwa)',
            translation: 'Kita semua sehati sejiwa',
            correctAnswer: ['Sada', 'roha', 'hita', 'saluhutna'],
            wordBank: ['Sada', 'roha', 'hita', 'saluhutna', 'tabo', 'lae', 'tulang'],
            culturalTip: '"Sada roha" berarti satu hati atau kompak bersatu.'
          }
        ]
      }
    ]
  }
];

export const DAILY_QUESTS = [
  { id: 'dq1', title: 'Raih 30 XP hari ini', target: 30, current: 0, rewardXP: 10, icon: 'Zap' },
  { id: 'dq2', title: 'Selesaikan 2 Latihan Pelafalan Suara', target: 2, current: 0, rewardXP: 15, icon: 'Mic' },
  { id: 'dq3', title: 'Coba Terjemahkan Aksara Batak', target: 1, current: 0, rewardXP: 10, icon: 'BookOpen' }
];

export const LEADERBOARD_USERS = [
  { rank: 1, name: 'Baringin Siregar', xp: 480, badge: 'Datu Sakti', avatar: '🦁', streak: 14 },
  { rank: 2, name: 'Tiurma Simanjuntak', xp: 435, badge: 'Parhata Adat', avatar: '🌺', streak: 11 },
  { rank: 3, name: 'Togar Nainggolan', xp: 390, badge: 'Pande Ulos', avatar: '🦅', streak: 9 },
  { rank: 4, name: 'Gale (Kamu)', xp: 210, badge: 'Parsiajar Burju', avatar: '👑', isUser: true, streak: 3 },
  { rank: 5, name: 'Melda Hutapea', xp: 195, badge: 'Penutur Asli', avatar: '🌸', streak: 4 },
  { rank: 6, name: 'Ronal Pasaribu', xp: 160, badge: 'Panortor', avatar: '🥁', streak: 2 }
];
