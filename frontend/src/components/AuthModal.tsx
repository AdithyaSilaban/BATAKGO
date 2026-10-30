import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { registerApi, loginApi, AuthUser } from '../utils/apiClient';
import { GorgaShield, PitaTenun } from './GorgaEmblem';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: AuthUser) => void;
}

const POPULAR_MARGA = [
  'Simanjuntak', 'Siregar', 'Hutabarat', 'Nainggolan', 'Sitorus',
  'Panjaitan', 'Sinaga', 'Pasaribu', 'Manurung', 'Nababan',
  'Lumbantobing', 'Sitompul', 'Silalahi', 'Harahap', 'Ginting'
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [marga, setMarga] = useState(POPULAR_MARGA[0]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isRegister) {
        const res = await registerApi({
          name,
          email,
          password,
          marga,
          avatar: name.trim().charAt(0).toUpperCase() || 'B',
        });

        if (res && res.user) {
          onAuthSuccess(res.user);
          onClose();
        } else {
          setErrorMsg('Pendaftaran gagal. Periksa kembali email atau koneksi database MySQL.');
        }
      } else {
        const res = await loginApi({ email, password });
        if (res && res.user) {
          onAuthSuccess(res.user);
          onClose();
        } else {
          setErrorMsg('Email atau kata sandi tidak cocok, atau server backend sedang offline.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1A17]/70 flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="card-batak bg-[#F4EDE0] max-w-md w-full relative overflow-hidden">
        <PitaTenun />

        {/* Modal Header */}
        <div className="bg-[#1E1A17] p-6 text-[#F4EDE0] text-center relative border-b-[1.5px] border-[#1E1A17]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-4 right-4 text-[#F4EDE0]/70 hover:text-[#F4EDE0] p-1.5 rounded-[4px] border border-transparent hover:border-[#F4EDE0]/40 transition cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex justify-center mb-2">
            <img
              src="/assets/logo.png"
              alt="Logo BatakGO"
              className="w-14 h-14 object-contain mx-auto drop-shadow-sm"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <h2 className="text-xl font-heading font-bold tracking-tight text-[#F4EDE0]">
            {isRegister ? 'Daftar Akun BATAKGO' : 'Masuk ke BATAKGO'}
          </h2>
          <p className="text-[#F4EDE0]/75 text-xs mt-1 font-body">
            {isRegister
              ? 'Simpan progres belajar, raih Gordang XP, dan panjat papan juara!'
              : 'Lanjutkan perjalanan belajar bahasa Batak bersama Sigale-gale'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="bg-[#F5E2DF] border-[1.5px] border-[#A62B1F] text-[#A62B1F] text-xs font-semibold rounded-[4px] p-3">
              {errorMsg}
            </div>
          )}

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon size={15} className="text-[#1E1A17]/50 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Ucok Tampubolon"
                    className="w-full pl-9 pr-4 py-2.5 rounded-[4px] border-[1.5px] border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] focus:border-[#23365A] focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1">
                  Marga Batak
                </label>
                <select
                  value={marga}
                  onChange={e => setMarga(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[4px] border-[1.5px] border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] focus:border-[#23365A] focus:outline-none text-sm font-medium"
                >
                  {POPULAR_MARGA.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1">
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="text-[#1E1A17]/50 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-[4px] border-[1.5px] border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] focus:border-[#23365A] focus:outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock size={15} className="text-[#1E1A17]/50 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-4 py-2.5 rounded-[4px] border-[1.5px] border-[#1E1A17] bg-[#F4EDE0] text-[#1E1A17] focus:border-[#23365A] focus:outline-none text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-indigo w-full mt-2 py-3 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="text-sm">Sedang memproses...</span>
            ) : isRegister ? (
              <>
                <UserPlus size={16} />
                <span>Buat Akun Sekarang</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Masuk Akun</span>
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg(null);
              }}
              className="text-xs text-[#23365A] hover:text-[#162238] font-bold underline cursor-pointer"
            >
              {isRegister
                ? 'Sudah punya akun? Masuk di sini'
                : 'Belum punya akun? Daftar gratis sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
