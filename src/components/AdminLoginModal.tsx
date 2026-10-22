import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, KeyRound, Sparkles } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  companyName?: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  companyName = 'PT. PODA E-LIQUID COMPANY',
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const usernameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      // Auto focus on open
      setTimeout(() => {
        usernameInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanUser || !cleanPass) {
      setErrorMessage('Silakan isi username dan password admin.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials requested by user: admin / podaliquid123
      if (cleanUser === 'admin' && cleanPass === 'podaliquid123') {
        setIsLoading(false);
        // Persist session
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('poda_admin_logged_in', 'true');
        }
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMessage('Username atau kata sandi tidak valid. Gunakan user: admin dan password: podaliquid123');
      }
    }, 250);
  };

  const handleQuickFill = () => {
    setUsername('admin');
    setPassword('podaliquid123');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-6 sm:p-7 text-white text-center relative">
          <div className="w-14 h-14 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20 font-black text-xl">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
            Akses Terbatas Administrator
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
            Login Menu Admin
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {companyName} · Portal Manajemen Reseller & Evaluasi
          </p>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Official Credentials Hint Box */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-3 sm:p-3.5 text-xs text-amber-950">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                <KeyRound className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-950">Kredensial Akses Admin:</div>
                  <div className="mt-1 font-mono text-[11px] space-y-0.5">
                    <div>
                      User: <strong className="text-slate-900 bg-amber-100 px-1 py-0.2 rounded font-bold">admin</strong>
                    </div>
                    <div>
                      Password: <strong className="text-slate-900 bg-amber-100 px-1 py-0.2 rounded font-bold">podaliquid123</strong>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1.5 rounded-lg shadow-2xs transition-all cursor-pointer shrink-0"
                title="Isi otomatis username dan password"
              >
                <Sparkles className="w-3 h-3" />
                <span>Isi Cepat</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Username Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  ref={usernameInputRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="podaliquid123"
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/3 order-2 sm:order-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[42px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-2/3 order-1 sm:order-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[42px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Masuk ke Panel Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-2.5 text-center text-[11px] text-slate-500">
          Sesi diamankan dengan otentikasi internal PT. PODA
        </div>
      </div>
    </div>
  );
};
