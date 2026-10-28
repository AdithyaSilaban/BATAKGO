# 🧣 BATAKGO • Parsiajaran Hata Batak Interaktif

> **Karya Kompetisi Web Development Competition UINIC 8.0 (2026)**  
> **Tema:** *"Engineering Interconnected Web Solutions to Empower Digital Ecosystems"*  
> **Subtema SDGs:** Pendidikan Bermutu (SDG 4) & Pelestarian Sosial Budaya Nusantara.

---

## 📖 Tentang BATAKGO
**BATAKGO** adalah platform edukasi interaktif berbasis web yang memadukan metode gamifikasi modern ala *Duolingo* dengan kekayaan warisan budaya Batak (Batak Toba). Bersama maskot legendaris **Gale (Sigale-gale)** berbalut kain Ulos tradisional, BATAKGO menghadirkan pengalaman belajar bahasa daerah yang adiktif, inklusif, dan berteknologi tinggi.

Platform ini tidak hanya melayani pembelajaran bagi pengguna akhir (*B2C*), melainkan dirancang sebagai **Interconnected Cultural Hub** yang menyediakan **Open RESTful API** bagi ekosistem digital nasional yang ingin mengintegrasikan leksikon bahasa Batak, transliterasi Surat Batak, dan kalkulasi kekerabatan *Dalihan Na Tolu*.

---

## 🌟 Fitur Unggulan

1. **🎮 Gamified Learning Path (Duolingo-style)**
   - Jalur belajar terstruktur (*Units & Lessons*) dengan pohon progres interaktif.
   - Sistem nyawa tradisional **Tondi** (5 nyawa yang dapat dipulihkan).
   - Akumulasi skor **Gordang XP** dan api semangat **Streak Harian**.
   - Efek suara instrumen tradisional Batak (Ogung & Gordang) berbasis *Web Audio API*.

2. **🤝 Interlocking Kinship Engine (Partuturan Dalihan Na Tolu)**
   - Kalkulator sapaan kekerabatan otomatis antar sesama orang Batak berdasarkan jenis kelamin dan hubungan darah.

3. **📜 Surat Batak Transliteration Engine**
   - Konversi teks alfabet Latin ke Aksara Batak (Unicode U+1BC0–U+1BFF) secara instan sesuai kaidah ortografi tradisional.

4. **🏆 Live Multi-User Leaderboard (MySQL Relational Database)**
   - Papan skor mingguan terhubung langsung ke basis data relasional MySQL via backend Laravel 13, memperingkatkan pembelajar di seluruh nusantara secara *real-time*.

5. **🧣 Galeri Koleksi Ulos Tradisional**
   - Ensiklopedia interaktif Ulos (Ulos Ragidup, Ragi Hotang, Mangiring, dll.) yang terbuka seiring capaian belajar siswa.

6. **🌐 BATAKGO Open Cultural Knowledge API (Interconnected Web Solution)**
   - Penyedia API publik terbuka untuk pertukaran data budaya dalam ekosistem digital:
     - `GET /api/v1/open/dictionary`: Kamus leksikon Batak-Indonesia terbuka.
     - `GET /api/v1/open/partuturan`: API kalkulasi panggilan kekerabatan adat.
     - `GET /api/v1/open/aksara`: API transliterasi Aksara Batak terbuka.

---

## 🏗️ Arsitektur Sistem

BATAKGO dibangun dengan arsitektur **Decoupled Client-Server (REST API)** yang mengutamakan skalabilitas, modularitas, dan keamanan:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND CLIENT (SPA)                           │
│     React 19 • Vite • TypeScript • Tailwind CSS • Lucide Icons         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON (RESTful)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BACKEND API GATEWAY & LOGIC                        │
│            Laravel 13 Framework • Sanctum Token Auth                   │
│      • Validasi Input Terproteksi (XSS & SQL Injection Defense)        │
│      • Open Cultural Knowledge API Engine                              │
│      • Manajemen Relasional Progres & Leaderboard                      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Eloquent ORM / PDO
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     BASIS DATA RELASIONAL (RDBMS)                      │
│                         MySQL 8.0 (Laragon)                            │
│           (users, cultural_vocabularies, progress_history)             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

### Prasyarat:
- **PHP >= 8.2** (Sudah tersedia di Laragon)
- **Composer** (Sudah tersedia di Laragon)
- **Node.js >= 18** & **npm**
- **MySQL Database Server** (Aktifkan di Laragon via tombol *"Start All"*)

---

### Langkah 1: Menjalankan Backend Laravel API

1. Buka terminal di folder backend:
   ```bash
   cd backend
   ```
2. Pastikan file konfigurasi `.env` menggunakan database MySQL Laragon:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=batakgo_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```
3. Jalankan migrasi dan seeding data awal:
   ```bash
   php artisan migrate --seed
   ```
4. Jalankan server Laravel backend (Port 8000):
   ```bash
   php artisan serve
   ```
   *Backend API siap melayani di: `http://127.0.0.1:8000`*

---

### Langkah 2: Menjalankan Frontend React

1. Buka terminal baru di root folder proyek:
   ```bash
   npm run dev
   ```
2. Buka browser di tautan:
   ```
   http://localhost:3000
   ```

---

## 🧪 Pengujian Otomatis (Automated Testing)

Backend BATAKGO dilengkapi dengan suite pengujian otomatis (Feature Tests) yang mencakup seluruh endpoint krusial:

```bash
cd backend
php artisan test --filter=BatakGoApiTest
```

**Hasil Pengujian:**
```
✓ test_api_health_check
✓ test_user_can_register_and_receive_token
✓ test_leaderboard_endpoint
✓ test_open_cultural_api_dictionary
✓ test_open_cultural_api_partuturan
✓ test_open_cultural_api_aksara

Tests:    6 passed (27 assertions)
Duration: 0.83s
```

---

## 📜 Lisensi & Hak Cipta
Hak cipta proyek sepenuhnya milik Tim Pengembang BATAKGO © 2026 untuk keikutsertaan dalam **UIN Informatic Competition (UINIC) 8.0**, HMPS Informatika Universitas Islam Negeri Sunan Kalijaga Yogyakarta.
*Horas ma di hita saluhutna!*
