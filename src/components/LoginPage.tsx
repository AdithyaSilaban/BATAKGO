import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, LogIn, UserPlus, Sparkles, ShieldCheck, Heart, Zap, ArrowRight } from 'lucide-react';
import { registerApi, loginApi, AuthUser, setStoredUser } from '../utils/apiClient';
import { GorgaShield, GorgaBorder } from './GorgaEmblem';
import { Mascot } from './Mascot';

interface LoginPageProps {
  onAuthSuccess: (user: AuthUser) => void;
}

const POPULAR_MARGA = [
  'Simanjuntak', 'Siregar', 'Hutabarat', 'Nainggolan', 'Sitorus',
  'Panjaitan', 'Sinaga', 'Pasaribu', 'Manurung', 'Nababan',
  'Lumbantobing', 'Sitompul', 'Silalahi', 'Harahap', 'Ginting'
];

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [marga, setMarga] = useState(POPULAR_MARGA[0]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isRegister) {
        const res = await registerApi({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          marga,
          avatar: name.trim().charAt(0).toUpperCase() || 'B',
        });

        if (res && res.user) {
          onAuthSuccess(res.user);
        } else {
          setErrorMsg('Pendaftaran gagal. Periksa kembali email atau koneksi database MySQL.');
        }
      } else {
        const res = await loginApi({
          email: email.trim().toLowerCase(),
          password,
        });

        if (res && res.user) {
          onAuthSuccess(res.user);
        } else {
          setErrorMsg('Email atau kata sandi tidak cocok. Anda juga dapat menggunakan Akun Demo di bawah.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan sistem saat menghubungi backend.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login for Judges / Testers
  const fillDemoAccount = () => {
    setIsRegister(false);
    setEmail('tigor@batakgo.id');
    setPassword('password123');
    setErrorMsg(null);
  };

  // Instant Guest Mode Entry
  const handleGuestEntry = () => {
    const guestUser: AuthUser = {
      id: 'guest-' + Date.now().toString(36),
      name: 'Parsiajar Tamu',
      email: 'tamu@batakgo.id',
      marga: 'Siregar',
      avatar: 'P',
      xp: 0,
      streak: 1,
      hearts: 5,
      max_hearts: 5,
      completed_lessons: [],
      unlocked_units: ['unit-1'],
      unlocked_ulos: []
    };
    setStoredUser(guestUser);
    onAuthSuccess(guestUser);
  };

  return (
    <div className="min-h-screen bg-[#18181B] text-stone-100 flex flex-col justify-between relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Sacred Cultural Ribbon */}
      <GorgaBorder />

      {/* Radiant Background Ambiance */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-900/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Grid Wrapper */}
      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Hero & Cultural Welcome Branding (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Branding Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-700/50 text-red-300 text-xs font-black tracking-wide uppercase shadow-sm">
              <Sparkles size={14} className="text-amber-400" />
              <span>Platform Edukasi Budaya Batak Toba</span>
            </div>

            {/* Title & Crest */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <GorgaShield size={68} className="drop-shadow-[0_8px_16px_rgba(153,27,27,0.4)] shrink-0" />
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                  BATAK<span className="text-[#EF4444]">GO</span>
                </h1>
                <p className="text-base sm:text-lg text-stone-300 font-bold mt-1.5">
                  Parsiajaran Hata Batak Interaktif
                </p>
              </div>
            </div>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Selamat datang di BATAKGO! Masuk atau daftar akun terlebih dahulu untuk menyimpan perolehan <strong className="text-amber-400 font-extrabold">Gordang XP</strong>, memelihara nyawa <strong className="text-red-400 font-extrabold">Tondi</strong>, dan menenun <strong className="text-stone-100 font-extrabold">Koleksi Ulos</strong> bersama maskot Sigale-gale.
            </p>

            {/* Mascot Greeting Box */}
            <div className="bg-stone-900/90 border-2 border-stone-800 rounded-3xl p-4 sm:p-5 flex items-center gap-4 max-w-lg mx-auto lg:mx-0 shadow-lg text-left">
              <Mascot
                mood="happy"
                size="md"
                speech="Horas! Pature roham tu parsiajaran hata Batak!"
                showStatusLabel={false}
              />
              <div className="flex-1">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                  Poda Ni Sigale-gale
                </span>
                <p className="text-xs sm:text-sm font-semibold text-stone-200 mt-0.5">
                  &ldquo;Unang mandele, marsiajar ma hita marhite roha na las!&rdquo; (Jangan ragu, mari kita belajar dengan hati yang gembira!)
                </p>
              </div>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto lg:mx-0 pt-2 text-left">
              <div className="bg-stone-900/70 border border-stone-800 p-2.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                  <Zap size={14} /> 5 Unit Belajar
                </div>
                <span className="text-[11px] text-stone-400 block mt-0.5">Jalur Kuis Gamifikasi</span>
              </div>
              <div className="bg-stone-900/70 border border-stone-800 p-2.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                  <Heart size={14} /> Nyawa Tondi
                </div>
                <span className="text-[11px] text-stone-400 block mt-0.5">Audio Ogung & Gordang</span>
              </div>
              <div className="bg-stone-900/70 border border-stone-800 p-2.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                  <ShieldCheck size={14} /> Dalihan Na Tolu
                </div>
                <span className="text-[11px] text-stone-400 block mt-0.5">Kalkulator Partuturan</span>
              </div>
              <div className="bg-stone-900/70 border border-stone-800 p-2.5 rounded-2xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Sparkles size={14} /> Surat Batak
                </div>
                <span className="text-[11px] text-stone-400 block mt-0.5">Unicode ISO 15924</span>
              </div>
            </div>
          </div>

          {/* Right Login / Register Card (5 Cols) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-stone-800 relative overflow-hidden">
              
              {/* Card Top Border Ribbon */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#991B1B] via-[#F59E0B] to-[#18181B]"></div>

              {/* Mode Toggle Tabs */}
              <div className="flex bg-stone-100 p-1 rounded-2xl mb-6 border border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    !isRegister
                      ? 'bg-[#991B1B] text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <LogIn size={15} />
                  <span>Masuk Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-xl font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isRegister
                      ? 'bg-[#991B1B] text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <UserPlus size={15} />
                  <span>Daftar Baru</span>
                </button>
              </div>

              {/* Welcome text */}
              <div className="mb-5">
                <h2 className="text-xl font-black text-stone-900 tracking-tight">
                  {isRegister ? 'Daftar Akun Parsiajar' : 'Selamat Datang Kembali'}
                </h2>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  {isRegister
                    ? 'Buat akun untuk menyimpan kemajuan belajar dan membuka Ulos.'
                    : 'Masuk dengan email Anda untuk melanjutkan pembelajaran.'}
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 text-xs font-bold rounded-xl animate-in fade-in duration-200">
                  {errorMsg}
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {isRegister && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <UserIcon size={16} className="text-stone-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Contoh: Baringin Siregar"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-stone-300 focus:border-[#991B1B] focus:outline-none text-sm font-semibold transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Marga Batak
                      </label>
                      <select
                        value={marga}
                        onChange={e => setMarga(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border-2 border-stone-300 focus:border-[#991B1B] focus:outline-none text-sm font-semibold bg-white transition cursor-pointer"
                      >
                        {POPULAR_MARGA.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-stone-300 focus:border-[#991B1B] focus:outline-none text-sm font-semibold transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock size={16} className="text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-stone-300 focus:border-[#991B1B] focus:outline-none text-sm font-semibold transition"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3 rounded-2xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-extrabold text-sm shadow-[0_4px_0_0_#7F1D1D] active:translate-y-0.5 active:shadow-none transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-spin text-sm">Sedang memproses...</span>
                  ) : isRegister ? (
                    <>
                      <UserPlus size={18} />
                      <span>Daftar & Mulai Belajar</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      <span>Masuk ke BATAKGO</span>
                    </>
                  )}
                </button>
              </form>

              {/* Demo Account & Guest Fast-Track Buttons */}
              <div className="mt-5 pt-4 border-t border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-semibold">Uji Coba Cepat:</span>
                  <button
                    type="button"
                    onClick={fillDemoAccount}
                    className="text-[#991B1B] hover:text-[#7F1D1D] font-extrabold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Isi Akun Demo (Tigor)</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleGuestEntry}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Mulai Langsung sebagai Tamu</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Clean Bottom Copyright Ribbon */}
      <footer className="relative z-10 py-4 text-center text-xs text-stone-500 border-t border-stone-800/80 bg-stone-900/60 backdrop-blur-sm">
        <p className="font-semibold">
          BATAKGO • Web Development Competition UINIC 8.0 (2026) • HMPS Informatika UIN Sunan Kalijaga
        </p>
      </footer>
    </div>
  );
};
