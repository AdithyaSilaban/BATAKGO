import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  LogIn,
  UserPlus,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Heart,
  Users,
  Languages
} from 'lucide-react';
import { registerApi, loginApi, AuthUser, setStoredUser } from '../utils/apiClient';
import { GorgaShield, PitaTenun } from './GorgaEmblem';
import { Mascot } from './Mascot';

interface LoginPageProps {
  onAuthSuccess: (user: AuthUser) => void;
}

const POPULAR_MARGA = [
  'Simanjuntak', 'Siregar', 'Hutabarat', 'Nainggolan', 'Sitorus',
  'Panjaitan', 'Sinaga', 'Pasaribu', 'Manurung', 'Nababan',
  'Lumbantobing', 'Sitompul', 'Silalahi', 'Harahap', 'Ginting',
  'Tampubolon', 'Pangaribuan', 'Simatupang', 'Situmeang', 'Marpaung'
];

const AVATAR_OPTIONS = [
  { id: '🧒', label: 'Tigor' },
  { id: '👧', label: 'Butet' },
  { id: '🧑‍🎓', label: 'Parsiajar' },
  { id: '👴', label: 'Ompung' },
  { id: '🧣', label: 'Pardondon' },
  { id: '👑', label: 'Raja Adat' },
];

export const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [marga, setMarga] = useState(POPULAR_MARGA[0]);
  const [customMarga, setCustomMarga] = useState('');
  const [isCustomMarga, setIsCustomMarga] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0].id);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const effectiveMarga = isCustomMarga ? customMarga.trim() : marga;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (isRegister) {
      if (name.trim().length < 2) {
        setErrorMsg('Nama lengkap minimal 2 karakter.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Kata sandi minimal 6 karakter demi keamanan akun.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerApi({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          marga: effectiveMarga || undefined,
          avatar: selectedAvatar,
        });

        if (res && res.user) {
          setSuccessMsg(`Pendaftaran berhasil! Horas, ${res.user.name}!`);
          setTimeout(() => {
            onAuthSuccess(res.user);
          }, 800);
        } else {
          setErrorMsg(
            'Pendaftaran gagal. Periksa kembali email atau pastikan backend Laravel aktif di port 8000.'
          );
        }
      } else {
        const res = await loginApi({
          email: email.trim().toLowerCase(),
          password,
        });

        if (res && res.user) {
          setSuccessMsg(`Login berhasil! Horas, ${res.user.name}!`);
          setTimeout(() => {
            onAuthSuccess(res.user);
          }, 600);
        } else {
          setErrorMsg(
            'Email atau kata sandi tidak cocok. Silakan periksa kembali atau gunakan tombol "Isi Akun Demo".'
          );
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
      id: 999999,
      name: 'Parsiajar Tamu',
      email: 'tamu@batakgo.id',
      marga: 'Siregar',
      avatar: '🧒',
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
    <div className="min-h-screen bg-[#F4EDE0] text-[#1E1A17] flex flex-col justify-between font-body">
      {/* Pembatas Section: Pita 3 Garis (Arang, Secang, Kapur) setinggi 6px */}
      <PitaTenun />

      {/* Main Grid Wrapper */}
      <div className="max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          
          {/* Left Hero (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] text-[#1E1A17] text-xs font-bold uppercase tracking-wider">
              <span>Platform Edukasi Budaya Batak Toba</span>
            </div>

            {/* Title & Crest */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <img
                src="/assets/logo.png"
                alt="Logo BatakGO"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-sm"
                style={{ imageRendering: 'pixelated' }}
              />
              <div>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E1A17] leading-none">
                  BATAK<span className="text-[#A62B1F]">GO</span>
                </h1>
                <p className="text-base sm:text-lg text-[#433D38] font-bold mt-1.5 font-body">
                  Parsiajaran Hata Batak Interaktif & Open Cultural API
                </p>
              </div>
            </div>

            <p className="text-[#1E1A17] text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
              Selamat datang di BATAKGO. Masuk ke akun Anda atau daftar sebagai pembelajar baru untuk mencatat perolehan poin Gordang XP, memelihara nyawa Tondi, dan mengumpulkan koleksi kain tenun Ulos.
            </p>

            {/* Mascot Greeting Box (Papan Datar Bergaris Arang) */}
            <div className="bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] rounded-[4px] p-4 sm:p-5 flex items-center gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <Mascot
                mood="happy"
                size="md"
                
                showStatusLabel={false}
              />
              <div className="flex-1">
                <span className="text-xs font-bold text-[#A62B1F] uppercase tracking-wider block">
                  Poda Ni Sigale-gale
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#1E1A17] mt-0.5 leading-snug">
                  &ldquo;Unang mandele, marsiajar ma hita marhite roha na las!&rdquo; (Jangan ragu, mari belajar dengan hati yang gembira!)
                </p>
              </div>
            </div>

            {/* Feature Highlights Grid (Permukaan Datar Garis Arang 1.5px, Tanpa Bayangan) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-xl mx-auto lg:mx-0 pt-2 text-left">
              <div className="bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] p-2.5 rounded-[4px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1A17]">
                  <BookOpen size={14} className="text-[#23365A]" /> 5 Unit Belajar
                </div>
                <span className="text-[11px] text-[#433D38] block mt-0.5">Jalur Kuis Interaktif</span>
              </div>
              <div className="bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] p-2.5 rounded-[4px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1A17]">
                  <Heart size={14} className="text-[#A62B1F]" /> Nyawa Tondi
                </div>
                <span className="text-[11px] text-[#433D38] block mt-0.5">Audio Ogung & Gordang</span>
              </div>
              <div className="bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] p-2.5 rounded-[4px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1A17]">
                  <Users size={14} className="text-[#23365A]" /> Partuturan
                </div>
                <span className="text-[11px] text-[#433D38] block mt-0.5">Dalihan Na Tolu</span>
              </div>
              <div className="bg-[#FAF6EE] border-[1.5px] border-[#1E1A17] p-2.5 rounded-[4px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1A17]">
                  <Languages size={14} className="text-[#A62B1F]" /> Surat Batak
                </div>
                <span className="text-[11px] text-[#433D38] block mt-0.5">Transliterasi Unicode</span>
              </div>
            </div>
          </div>

          {/* Right Login / Register Card (5 Cols) */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-[#FAF6EE] text-[#1E1A17] rounded-[4px] p-6 sm:p-8 border-[1.5px] border-[#1E1A17] relative">
              
              {/* Card Top Strip (Pita Tenun 3 Garis) */}
              <div className="absolute top-0 left-0 right-0 h-[4px] bg-[#A62B1F]"></div>

              {/* Mode Toggle Tabs */}
              <div className="flex bg-[#E8DFC8] p-1 rounded-[4px] mb-6 border-[1.5px] border-[#1E1A17]">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-[2px] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    !isRegister
                      ? 'bg-[#23365A] text-[#F4EDE0]'
                      : 'text-[#1E1A17] hover:bg-[#F4EDE0]'
                  }`}
                >
                  <LogIn size={14} />
                  <span>Masuk Akun</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className={`flex-1 py-2 rounded-[2px] font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    isRegister
                      ? 'bg-[#23365A] text-[#F4EDE0]'
                      : 'text-[#1E1A17] hover:bg-[#F4EDE0]'
                  }`}
                >
                  <UserPlus size={14} />
                  <span>Daftar Baru</span>
                </button>
              </div>

              {/* Heading */}
              <div className="mb-5">
                <h2 className="font-heading text-2xl font-bold text-[#1E1A17] tracking-tight">
                  {isRegister ? 'Daftar Akun Parsiajar' : 'Masuk ke BATAKGO'}
                </h2>
                <p className="text-xs text-[#433D38] mt-1 font-semibold">
                  {isRegister
                    ? 'Buat akun untuk menyimpan kemajuan belajar dan membuka Ulos.'
                    : 'Masuk dengan email Anda untuk melanjutkan pembelajaran.'}
                </p>
              </div>

              {/* Error Message (Ikon + Teks) */}
              {errorMsg && (
                <div className="mb-4 p-3 bg-[#F5EAE8] border-[1.5px] border-[#A62B1F] text-[#A62B1F] text-xs font-bold rounded-[4px] flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message (Ikon + Teks) */}
              {successMsg && (
                <div className="mb-4 p-3 bg-[#FAF6EE] border-[1.5px] border-[#23365A] text-[#23365A] text-xs font-bold rounded-[4px] flex items-start gap-2">
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {isRegister && (
                  <>
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <UserIcon size={16} className="text-[#433D38] absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="Contoh: Tigor Siregar"
                          className="w-full pl-9 pr-3 py-2 bg-[#F4EDE0] rounded-[4px] border-[1.5px] border-[#1E1A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23365A] text-sm font-semibold text-[#1E1A17]"
                        />
                      </div>
                    </div>

                    {/* Marga Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider">
                          Marga Batak
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsCustomMarga(!isCustomMarga)}
                          className="text-[11px] font-bold text-[#23365A] hover:underline cursor-pointer"
                        >
                          {isCustomMarga ? 'Pilih dari Daftar' : '+ Marga Lainnya'}
                        </button>
                      </div>

                      {isCustomMarga ? (
                        <input
                          type="text"
                          value={customMarga}
                          onChange={e => setCustomMarga(e.target.value)}
                          placeholder="Ketik marga Anda"
                          className="w-full px-3 py-2 bg-[#F4EDE0] rounded-[4px] border-[1.5px] border-[#1E1A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23365A] text-sm font-semibold text-[#1E1A17]"
                        />
                      ) : (
                        <select
                          value={marga}
                          onChange={e => setMarga(e.target.value)}
                          className="w-full px-3 py-2 bg-[#F4EDE0] rounded-[4px] border-[1.5px] border-[#1E1A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23365A] text-sm font-semibold text-[#1E1A17] cursor-pointer"
                        >
                          {POPULAR_MARGA.map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Avatar Picker */}
                    <div>
                      <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1.5">
                        Pilih Avatar Karakter
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {AVATAR_OPTIONS.map(av => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => setSelectedAvatar(av.id)}
                            className={`p-1.5 rounded-[4px] text-lg flex flex-col items-center justify-center cursor-pointer border-[1.5px] ${
                              selectedAvatar === av.id
                                ? 'bg-[#E8DFC8] border-[#A62B1F]'
                                : 'bg-[#F4EDE0] border-[#1E1A17] hover:bg-[#E8DFC8]'
                            }`}
                            title={av.label}
                          >
                            <span>{av.id}</span>
                            <span className="text-[9px] font-bold text-[#1E1A17] mt-0.5 truncate w-full text-center">
                              {av.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="text-[#433D38] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      className="w-full pl-9 pr-3 py-2 bg-[#F4EDE0] rounded-[4px] border-[1.5px] border-[#1E1A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23365A] text-sm font-semibold text-[#1E1A17]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock size={16} className="text-[#433D38] absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={isRegister ? 'Minimal 6 karakter' : 'Masukkan kata sandi'}
                      className="w-full pl-9 pr-9 py-2 bg-[#F4EDE0] rounded-[4px] border-[1.5px] border-[#1E1A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23365A] text-sm font-semibold text-[#1E1A17]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#433D38] hover:text-[#1E1A17] cursor-pointer"
                      title={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password (Register Only) */}
                {isRegister && (
                  <div>
                    <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1">
                      Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                      <Lock size={16} className="text-[#433D38] absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Ketik ulang kata sandi"
                        className="w-full pl-9 pr-3 py-2 bg-[#F4EDE0] rounded-[4px] border-[1.5px] border-[#1E1A17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#23365A] text-sm font-semibold text-[#1E1A17]"
                      />
                    </div>
                  </div>
                )}

                {/* Submit Action (Tombol Indigo: Radius 4px, Tepi Bawah 3px Lebih Gelap, Geser 3px saat Ditekan) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-indigo w-full mt-2 py-3 text-sm"
                >
                  {loading ? (
                    <span>Menghubungkan ke server...</span>
                  ) : isRegister ? (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      <span>Daftar & Mulai Belajar</span>
                    </>
                  ) : (
                    <>
                      <LogIn size={16} className="mr-2" />
                      <span>Masuk ke BATAKGO</span>
                    </>
                  )}
                </button>
              </form>

              {/* Fast-Track Actions */}
              <div className="mt-5 pt-4 border-t-[1.5px] border-[#1E1A17] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#433D38] font-bold">Uji Coba Cepat:</span>
                  <button
                    type="button"
                    onClick={fillDemoAccount}
                    className="text-[#23365A] hover:text-[#A62B1F] font-bold underline cursor-pointer"
                  >
                    Isi Akun Demo (Tigor)
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleGuestEntry}
                  className="btn-outline-arang w-full py-2 px-3 text-xs"
                >
                  <span>Mulai Langsung sebagai Tamu (Explore Mode)</span>
                  <ArrowRight size={13} className="ml-1.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Clean Bottom Bar */}
      <footer className="py-4 text-center text-xs text-[#433D38] border-t-[1.5px] border-[#1E1A17] bg-[#E8DFC8]">
        <p className="font-semibold">
          BATAKGO • By kelompok Himatop
        </p>
      </footer>
    </div>
  );
};
