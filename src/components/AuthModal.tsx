import React, { useState } from 'react';
import { X, User as UserIcon, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { registerApi, loginApi, AuthUser } from '../utils/apiClient';
import { GorgaShield, GorgaBorder } from './GorgaEmblem';

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden relative">
        <GorgaBorder />

        {/* Modal Header */}
        <div className="bg-[#18181B] p-6 text-white text-center relative border-b border-stone-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="flex justify-center mb-2">
            <GorgaShield size={44} />
          </div>

          <h2 className="text-xl font-extrabold tracking-tight">
            {isRegister ? 'Daftar Akun BATAKGO' : 'Masuk ke BATAKGO'}
          </h2>
          <p className="text-stone-400 text-xs mt-1">
            {isRegister
              ? 'Simpan progres belajar, raih Gordang XP, dan panjat papan juara!'
              : 'Lanjutkan perjalanan belajar bahasa Batak bersama Sigale-gale'}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl p-3">
              {errorMsg}
            </div>
          )}

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <UserIcon size={15} className="text-stone-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Contoh: Ucok Tampubolon"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#991B1B] focus:outline-none text-sm font-medium"
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
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:border-[#991B1B] focus:outline-none text-sm font-medium bg-white"
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
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="text-stone-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#991B1B] focus:outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock size={15} className="text-stone-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#991B1B] focus:outline-none text-sm font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 rounded-xl bg-[#991B1B] hover:bg-[#7F1D1D] text-white font-bold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-spin text-sm">Sedang memproses...</span>
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
              className="text-xs text-[#991B1B] hover:text-[#7F1D1D] font-semibold hover:underline cursor-pointer"
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
