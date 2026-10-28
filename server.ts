import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  marga?: string;
  avatar?: string;
  xp: number;
  streak: number;
  hearts: number;
  max_hearts: number;
  completed_lessons: string[];
  unlocked_units: string[];
  unlocked_ulos: string[];
}

interface VocabItem {
  id: number | string;
  slug: string;
  batak: string;
  indonesian: string;
  category: string;
  phonetic: string;
  syllables: string[];
  example_batak: string;
  example_indonesian: string;
  audio_note?: string;
}

// In-Memory Database initialized with BatakSeeder data
const users: User[] = [
  {
    id: 1,
    name: 'Tigor Simanjuntak',
    email: 'tigor@batakgo.id',
    password: 'password123',
    marga: 'Simanjuntak',
    avatar: '🤠',
    xp: 1450,
    streak: 14,
    hearts: 5,
    max_hearts: 5,
    completed_lessons: ['u1_l1', 'u1_l2', 'u1_l3', 'u2_l1'],
    unlocked_units: ['unit_1', 'unit_2'],
    unlocked_ulos: ['ulos_ragidup', 'ulos_ragi_hotang'],
  },
  {
    id: 2,
    name: 'Tiurma Siregar',
    email: 'tiurma@batakgo.id',
    password: 'password123',
    marga: 'Siregar',
    avatar: '👩‍🦰',
    xp: 1280,
    streak: 9,
    hearts: 4,
    max_hearts: 5,
    completed_lessons: ['u1_l1', 'u1_l2', 'u1_l3'],
    unlocked_units: ['unit_1', 'unit_2'],
    unlocked_ulos: ['ulos_ragi_hotang'],
  },
  {
    id: 3,
    name: 'Poltak Nainggolan',
    email: 'poltak@batakgo.id',
    password: 'password123',
    marga: 'Nainggolan',
    avatar: '🧑‍🎓',
    xp: 1120,
    streak: 7,
    hearts: 5,
    max_hearts: 5,
    completed_lessons: ['u1_l1', 'u1_l2'],
    unlocked_units: ['unit_1'],
    unlocked_ulos: ['ulos_mangiring'],
  },
  {
    id: 4,
    name: 'Butet Hutabarat',
    email: 'butet@batakgo.id',
    password: 'password123',
    marga: 'Hutabarat',
    avatar: '👧',
    xp: 950,
    streak: 5,
    hearts: 3,
    max_hearts: 5,
    completed_lessons: ['u1_l1'],
    unlocked_units: ['unit_1'],
    unlocked_ulos: ['ulos_mangiring'],
  },
  {
    id: 5,
    name: 'Bona Sitorus',
    email: 'bona@batakgo.id',
    password: 'password123',
    marga: 'Sitorus',
    avatar: '🧑‍🌾',
    xp: 780,
    streak: 4,
    hearts: 5,
    max_hearts: 5,
    completed_lessons: ['u1_l1'],
    unlocked_units: ['unit_1'],
    unlocked_ulos: [],
  },
];

let nextUserId = 6;
const tokenToUserId = new Map<string, number>();

// Seed initial active token for Tigor
tokenToUserId.set('token_demo_tigor', 1);

const vocabularies: VocabItem[] = [
  {
    id: 1,
    slug: 'horas',
    batak: 'Horas',
    indonesian: 'Halo / Salam sejahtera / Selamat',
    category: 'sapaan',
    phonetic: 'ho-ras',
    syllables: ['Ho', 'ras'],
    example_batak: 'Horas ma di hita saluhutna!',
    example_indonesian: 'Salam sejahtera bagi kita sekalian!',
    audio_note: 'Diucapkan dengan nada tegas dan hangat',
  },
  {
    id: 2,
    slug: 'mauliate',
    batak: 'Mauliate',
    indonesian: 'Terima kasih',
    category: 'sapaan',
    phonetic: 'mau-li-a-te',
    syllables: ['Mau', 'li', 'a', 'te'],
    example_batak: 'Mauliate godang, lae!',
    example_indonesian: 'Terima kasih banyak, kawan!',
    audio_note: 'Dapat ditambah godang untuk sangat berterima kasih',
  },
  {
    id: 3,
    slug: 'songon_dia',
    batak: 'Songon dia kabar?',
    indonesian: 'Bagaimana kabarmu?',
    category: 'sapaan',
    phonetic: 'so-ngon di-a ka-bar',
    syllables: ['So', 'ngon', 'di', 'a', 'ka', 'bar'],
    example_batak: 'Songon dia kabar muna nuaeng?',
    example_indonesian: 'Bagaimana kabar kalian sekarang?',
    audio_note: 'Pertanyaan kabar santai sehari-hari',
  },
  {
    id: 4,
    slug: 'hipas',
    batak: 'Hipas / Sehat do',
    indonesian: 'Sehat-sehat saja',
    category: 'sapaan',
    phonetic: 'hi-pas / se-hat do',
    syllables: ['Hi', 'pas', 'do', 'au'],
    example_batak: 'Hipas do au, mauliate.',
    example_indonesian: 'Aku sehat saja, terima kasih.',
    audio_note: 'Jawaban standar saat ditanya kabar',
  },
  {
    id: 5,
    slug: 'amang',
    batak: 'Amang',
    indonesian: 'Ayah / Bapak',
    category: 'keluarga',
    phonetic: 'a-mang',
    syllables: ['A', 'mang'],
    example_batak: 'Nunga mulak amang sian ladang.',
    example_indonesian: 'Ayah sudah pulang dari ladang.',
    audio_note: 'Panggilan hormat untuk ayah kandung atau bapak tua/muda',
  },
  {
    id: 6,
    slug: 'inang',
    batak: 'Inang',
    indonesian: 'Ibu / Mama',
    category: 'keluarga',
    phonetic: 'i-nang',
    syllables: ['I', 'nang'],
    example_batak: 'Inang parade sipanganon.',
    example_indonesian: 'Ibu menyiapkan makanan.',
    audio_note: 'Panggilan hormat penuh kasih sayang untuk ibu',
  },
  {
    id: 7,
    slug: 'tulang',
    batak: 'Tulang',
    indonesian: 'Paman (Saudara laki-laki ibu)',
    category: 'keluarga',
    phonetic: 'tu-lang',
    syllables: ['Tu', 'lang'],
    example_batak: 'Tulang ro sian huta.',
    example_indonesian: 'Paman datang dari kampung.',
    audio_note: 'Kunci utama dalam sistem kekerabatan Dalihan Na Tolu',
  },
  {
    id: 8,
    slug: 'nantulang',
    batak: 'Nantulang',
    indonesian: 'Bibi (Istri dari saudara laki-laki ibu)',
    category: 'keluarga',
    phonetic: 'nan-tu-lang',
    syllables: ['Nan', 'tu', 'lang'],
    example_batak: 'Nantulang mangalehon ulos.',
    example_indonesian: 'Bibi memberikan kain ulos.',
    audio_note: 'Pasangan dari Tulang',
  },
  {
    id: 9,
    slug: 'sada',
    batak: 'Sada',
    indonesian: 'Satu (1)',
    category: 'angka',
    phonetic: 'sa-da',
    syllables: ['Sa', 'da'],
    example_batak: 'Sada huta.',
    example_indonesian: 'Satu kampung.',
    audio_note: 'Angka dasar',
  },
  {
    id: 10,
    slug: 'dua',
    batak: 'Dua',
    indonesian: 'Dua (2)',
    category: 'angka',
    phonetic: 'du-a',
    syllables: ['Du', 'a'],
    example_batak: 'Dua boru.',
    example_indonesian: 'Dua anak perempuan.',
    audio_note: 'Angka dasar',
  },
  {
    id: 11,
    slug: 'tolu',
    batak: 'Tolu',
    indonesian: 'Tiga (3)',
    category: 'angka',
    phonetic: 'to-lu',
    syllables: ['To', 'lu'],
    example_batak: 'Dalihan Na Tolu.',
    example_indonesian: 'Tungku nan tiga (falsafah hidup Batak).',
    audio_note: 'Sangat sakral dalam filosofi Batak',
  },
];

function sanitizeUser(user: User) {
  const { password, ...safeUser } = user;
  return safeUser;
}

function getAuthUser(req: Request): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  const userId = tokenToUserId.get(token);
  if (!userId) return null;
  return users.find((u) => u.id === userId) || null;
}

export async function createServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'BATAKGO REST API',
      version: '1.0.0',
      database: 'In-Memory Store (Node.js)',
      framework: 'Express 4',
      timestamp: new Date().toISOString(),
    });
  });

  // Auth: Register
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password, marga, avatar } = req.body;
    if (!name || !email || !password) {
      return res.status(422).json({
        status: 'error',
        message: 'Nama, email, dan kata sandi wajib diisi.',
      });
    }

    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(422).json({
        status: 'error',
        message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
      });
    }

    const newUser: User = {
      id: nextUserId++,
      name,
      email,
      password,
      marga: marga || undefined,
      avatar: avatar || '🧒',
      xp: 0,
      streak: 1,
      hearts: 5,
      max_hearts: 5,
      completed_lessons: [],
      unlocked_units: ['unit_1'],
      unlocked_ulos: [],
    };
    users.push(newUser);

    const token = `btk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    tokenToUserId.set(token, newUser.id);

    return res.status(201).json({
      status: 'success',
      message: 'Pendaftaran akun BATAKGO berhasil!',
      token,
      user: sanitizeUser(newUser),
    });
  });

  // Auth: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        status: 'error',
        message: 'Email dan kata sandi wajib diisi.',
      });
    }

    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && (!u.password || u.password === password)
    );

    if (!user) {
      return res.status(422).json({
        status: 'error',
        message: 'Kombinasi email atau kata sandi tidak cocok.',
      });
    }

    const token = `btk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    tokenToUserId.set(token, user.id);

    return res.json({
      status: 'success',
      message: 'Horas! Selamat datang kembali di BATAKGO.',
      token,
      user: sanitizeUser(user),
    });
  });

  // Auth: Current User (Me)
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthenticated.',
      });
    }
    return res.json({
      status: 'success',
      user: sanitizeUser(user),
    });
  });

  // Auth: Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      tokenToUserId.delete(token);
    }
    return res.json({
      status: 'success',
      message: 'Berhasil keluar sesi.',
    });
  });

  // Progress: Get
  app.get('/api/progress', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (user) {
      return res.json({
        status: 'success',
        data: {
          xp: user.xp,
          streak: user.streak,
          hearts: user.hearts,
          maxHearts: user.max_hearts,
          completedLessons: user.completed_lessons,
          unlockedUnits: user.unlocked_units,
          unlockedUlos: user.unlocked_ulos,
        },
      });
    }
    return res.json({
      status: 'success',
      data: {
        xp: 0,
        streak: 1,
        hearts: 5,
        maxHearts: 5,
        completedLessons: [],
        unlockedUnits: ['unit_1'],
        unlockedUlos: [],
      },
    });
  });

  // Progress: Sync
  app.post('/api/progress/sync', (req: Request, res: Response) => {
    const { xpEarned = 0, lessonId, unlockedUnitId, heartsRemaining = 5, unlockedUlosId } = req.body;
    const user = getAuthUser(req);

    if (user) {
      user.xp += Number(xpEarned) || 0;
      user.hearts = Math.max(0, Math.min(user.max_hearts, Number(heartsRemaining)));

      if (lessonId && !user.completed_lessons.includes(lessonId)) {
        user.completed_lessons.push(lessonId);
      }
      if (unlockedUnitId && !user.unlocked_units.includes(unlockedUnitId)) {
        user.unlocked_units.push(unlockedUnitId);
      }
      if (unlockedUlosId && !user.unlocked_ulos.includes(unlockedUlosId)) {
        user.unlocked_ulos.push(unlockedUlosId);
      }

      return res.json({
        status: 'success',
        message: 'Progres belajar berhasil disinkronkan.',
        data: {
          xp: user.xp,
          streak: user.streak,
          hearts: user.hearts,
          maxHearts: user.max_hearts,
          completedLessons: user.completed_lessons,
          unlockedUnits: user.unlocked_units,
          unlockedUlos: user.unlocked_ulos,
        },
      });
    }

    return res.json({
      status: 'success',
      message: 'Progres tamu disimpan secara lokal.',
      data: {
        xpEarned,
        lessonId,
        unlockedUnitId,
        heartsRemaining,
        unlockedUlosId,
      },
    });
  });

  // Progress: Refill Hearts
  app.post('/api/progress/refill-hearts', (req: Request, res: Response) => {
    const user = getAuthUser(req);
    if (user) {
      user.hearts = user.max_hearts;
      return res.json({
        status: 'success',
        message: 'Tondi (nyawa) berhasil dipulihkan!',
        hearts: user.hearts,
      });
    }
    return res.json({
      status: 'success',
      message: 'Tondi (nyawa) berhasil dipulihkan!',
      hearts: 5,
    });
  });

  // Leaderboard
  app.get('/api/leaderboard', (req: Request, res: Response) => {
    const currentUser = getAuthUser(req);
    const sorted = [...users].sort((a, b) => b.xp - a.xp);

    const leaderboard = sorted.slice(0, 30).map((u, index) => {
      const displayName = u.marga && !u.name.toLowerCase().includes(u.marga.toLowerCase())
        ? `${u.name} ${u.marga}`
        : u.name;
      return {
        rank: index + 1,
        id: u.id,
        name: displayName,
        avatar: u.avatar || '🧒',
        xp: u.xp,
        streak: u.streak,
        isCurrentUser: currentUser ? u.id === currentUser.id : false,
      };
    });

    return res.json({
      status: 'success',
      data: leaderboard,
      total_learners: users.length,
    });
  });

  // Open Cultural API: Dictionary
  app.get('/api/v1/open/dictionary', (req: Request, res: Response) => {
    const q = typeof req.query.q === 'string' ? req.query.q.toLowerCase() : '';
    const category = typeof req.query.category === 'string' ? req.query.category : 'all';

    let filtered = vocabularies;
    if (q) {
      filtered = filtered.filter(
        (v) =>
          v.batak.toLowerCase().includes(q) ||
          v.indonesian.toLowerCase().includes(q) ||
          v.example_batak.toLowerCase().includes(q)
      );
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((v) => v.category === category);
    }

    return res.json({
      status: 'success',
      api_version: 'v1.0',
      standard: 'Batak Toba Cultural Lexicon',
      interoperability: 'Open Batak Knowledge Initiative',
      count: filtered.length,
      data: filtered,
    });
  });

  // Open Cultural API: Partuturan
  app.get('/api/v1/open/partuturan', (req: Request, res: Response) => {
    const myGender = (req.query.my_gender as string) || 'male';
    const relation = (req.query.relation as string) || 'iboto';

    const rules: Record<string, Record<string, { term: string; meaning: string }>> = {
      male: {
        saudara_laki: { term: 'Anggi / Haha', meaning: 'Saudara kandung laki-laki' },
        saudara_perempuan: { term: 'Ibotoku', meaning: 'Saudara kandung perempuan (saling menghormati)' },
        saudara_laki_ibu: { term: 'Tulang', meaning: 'Paman dari pihak ibu (posisi terhormat Hula-hula)' },
        istri_saudara_laki_ibu: { term: 'Nantulang', meaning: 'Bibi / Istri dari paman Tulang' },
        saudara_perempuan_ayah: { term: 'Namboru', meaning: 'Bibi dari pihak ayah' },
        teman_sebaya: { term: 'Lae', meaning: 'Panggilan akrab antar pria sebaya' },
      },
      female: {
        saudara_laki: { term: 'Ibotoku', meaning: 'Saudara kandung laki-laki' },
        saudara_perempuan: { term: 'Anggi / Haha', meaning: 'Saudara kandung perempuan' },
        saudara_laki_ibu: { term: 'Tulang', meaning: 'Paman dari pihak ibu' },
        istri_saudara_laki_ibu: { term: 'Nantulang', meaning: 'Bibi / Istri dari Tulang' },
        saudara_perempuan_ayah: { term: 'Namboru', meaning: 'Bibi dari pihak ayah' },
        teman_sebaya: { term: 'Ito / Eda', meaning: 'Panggilan akrab antar sesama perempuan' },
      },
    };

    const genderRules = rules[myGender] || rules.male;
    const result = genderRules[relation] || {
      term: 'Dongan Sabutuha / Lae',
      meaning: 'Kerabat terdekat dalam falsafah Dalihan Na Tolu',
    };

    return res.json({
      status: 'success',
      api_version: 'v1.0',
      query: {
        my_gender: myGender,
        relation,
      },
      partuturan: result.term,
      explanation: result.meaning,
      philosophical_pillar: 'Dalihan Na Tolu (Somba Marhula-hula, Manat Mardongan Tubu, Elek Marboru)',
    });
  });

  // Open Cultural API: Aksara Batak Transliteration
  app.get('/api/v1/open/aksara', (req: Request, res: Response) => {
    const text = (req.query.text as string) || 'Horas';
    const charMap: Record<string, string> = {
      a: 'ᯀ',
      b: 'ᯅ',
      c: 'ᯡ',
      d: 'ᯑ',
      e: 'ᯀᯩ',
      g: 'ᯎ',
      h: 'ᯂ',
      i: 'ᯤ',
      j: 'ᯐ',
      k: 'ᯂ',
      l: 'ᯞ',
      m: 'ᯔ',
      n: 'ᯉ',
      o: 'ᯀᯬ',
      p: 'ᯇ',
      r: 'ᯒ',
      s: 'ᯘ',
      t: 'ᯖ',
      u: 'ᯥ',
      w: 'ᯋ',
      y: 'ᯛ',
      ng: 'ᯝ',
    };

    const lower = text.trim().toLowerCase();
    let output = '';
    let i = 0;
    while (i < lower.length) {
      if (i + 1 < lower.length && lower.substring(i, i + 2) === 'ng') {
        output += charMap.ng;
        i += 2;
        continue;
      }
      const ch = lower[i];
      if (charMap[ch]) {
        output += charMap[ch];
      } else if (ch === ' ') {
        output += ' ';
      } else {
        output += ch;
      }
      i++;
    }

    return res.json({
      status: 'success',
      api_version: 'v1.0',
      latin_text: text,
      aksara_batak: output,
      unicode_range: 'U+1BC0..U+1BFF (Batak Script Standard ISO 15924)',
    });
  });

  // Vite middleware in dev or static files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BATAKGO] Full-stack server running at http://0.0.0.0:${PORT} (${isProduction ? 'prod' : 'dev'})`);
  });

  return app;
}

createServer();
