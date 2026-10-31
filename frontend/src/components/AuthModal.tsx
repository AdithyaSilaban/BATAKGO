import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { registerApi, loginApi, AuthUser } from '../utils/apiClient';
import { PitaTenun } from './GorgaEmblem';

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
    <div className="fixed inset-0 z-50 bg-[#1E1A17]/70 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="card-batak bg-[#F4EDE0] max-w-md w-full relative overflow-hidden my-auto shadow-xl">
        <PitaTenun />

        {/* Modal Header */}
        <div className="bg-[#1E1A17] p-4 sm:p-6 text-[#F4EDE0] text-center relative border-b-[1.5px] border-[#1E1A17]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="absolute top-3.5 right-3.5 text-[#F4EDE0]/70 hover:text-[#F4EDE0] p-1.5 rounded-[4px] border border-transparent hover:border-[#F4EDE0]/40 transition cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex justify-center mb-1.5 sm:mb-2">
            <img
              src="/assets/logo.png"
              alt="Logo BatakGO"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain mx-auto drop-shadow-sm"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <h2 className="text-lg sm:text-xl font-heading font-bold tracking-tight text-[#F4EDE0]">
            {isRegister ? 'Daftar Akun BATAKGO' : 'Masuk ke BATAKGO'}
          </h2>
          <p className="text-[#F4EDE0]/75 text-xs mt-1 font-body">
            {isRegister
              ? 'Simpan progres belajar, raih Gordang XP, dan panjat papan juara!'
              : 'Lanjutkan perjalanan belajar bahasa Batak bersama Sigale-gale'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-[#EADBCE] border-b-[1.5px] border-[#1E1A17]">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
              !isRegister
                ? 'bg-[#F4EDE0] text-[#1E1A17] border-b-2 border-[#A62B1F]'
                : 'text-[#1E1A17]/60 hover:text-[#1E1A17]'
            }`}
          >
            <LogIn size={14} /> Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2.5 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition ${
              isRegister
                ? 'bg-[#F4EDE0] text-[#1E1A17] border-b-2 border-[#A62B1F]'
                : 'text-[#1E1A17]/60 hover:text-[#1E1A17]'
            }`}
          >
            <UserPlus size={14} /> Daftar Baru
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5">
          {errorMsg && (
            <div className="p-3 bg-[#F5E2DF] border border-[#A62B1F] text-[#A62B1F] text-xs font-bold rounded-[4px]">
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
                  <UserIcon size={16} className="text-[#1E1A17]/50 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Tigor Siregar"
                    className="w-full pl-9 pr-3 py-2 bg-[#FAF6EE] rounded-[4px] border-[1.5px] border-[#1E1A17] text-base sm:text-sm font-semibold"
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
                  className="w-full px-3 py-2 bg-[#FAF6EE] rounded-[4px] border-[1.5px] border-[#1E1A17] text-base sm:text-sm font-semibold cursor-pointer"
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
              <Mail size={16} className="text-[#1E1A17]/50 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 bg-[#FAF6EE] rounded-[4px] border-[1.5px] border-[#1E1A17] text-base sm:text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1E1A17] uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock size={16} className="text-[#1E1A17]/50 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#FAF6EE] rounded-[4px] border-[1.5px] border-[#1E1A17] text-base sm:text-sm font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-indigo w-full py-3 text-sm font-bold mt-2 min-h-[46px]"
          >
            {loading ? 'Memproses...' : isRegister ? 'Daftar Akun' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
};
