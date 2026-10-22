import React from 'react';
import { ShieldCheck, Cloud, RefreshCw, LayoutDashboard, FileText, Wifi } from 'lucide-react';
import { COMPANY_NAME } from '../utils/constants';

interface HeaderProps {
  currentView: 'form' | 'admin';
  onSwitchView: (view: 'form' | 'admin') => void;
  isSaving: boolean;
  lastSavedAt: string | null;
  pendingCount?: number;
  companyName?: string;
  isRealtimeConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSwitchView,
  isSaving,
  lastSavedAt,
  pendingCount = 0,
  companyName = COMPANY_NAME,
  isRealtimeConnected = true,
}) => {
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center font-extrabold text-slate-950 text-base sm:text-lg shadow-sm shadow-amber-500/20 shrink-0">
            P
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 truncate">
              <span className="font-extrabold text-xs sm:text-base tracking-tight text-slate-900 truncate">
                {companyName}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0 inline" />
              <span className="truncate">Portal Pendaftaran & Verifikasi Resmi</span>
            </div>
          </div>
        </div>

        {/* Right side controls: Auto-save status + Realtime sync badge + View switcher */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Real-time DB Auto-Save indicator */}
          {currentView === 'form' && (
            <div
              title={
                isSaving
                  ? 'Menyimpan perubahan ke database otomatis...'
                  : `Tersimpan di database ${lastSavedAt ? `(${formatTime(lastSavedAt)})` : ''}`
              }
              className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200/80 px-2 sm:px-2.5 py-1.5 rounded-lg shadow-2xs"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
                  <span className="hidden md:inline text-amber-700">Menyimpan...</span>
                </>
              ) : (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Cloud className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden lg:inline text-slate-700">
                    Otomatis Tersimpan {lastSavedAt ? `(${formatTime(lastSavedAt)})` : ''}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Realtime Live Sync indicator */}
          <div
            title={isRealtimeConnected ? 'Sinkronisasi real-time multi-user aktif' : 'Mode offline / sinkronisasi berkala'}
            className="hidden sm:flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 sm:px-2.5 py-1 rounded-full"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <span className="hidden md:inline">{isRealtimeConnected ? 'Live Sync Aktif' : 'Sync Lokal'}</span>
          </div>

          {/* Interactive Navigation Switcher */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 text-xs font-medium">
            <button
              onClick={() => onSwitchView('form')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer ${
                currentView === 'form'
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[11px] sm:text-xs">Form</span>
            </button>
            <button
              onClick={() => onSwitchView('admin')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-slate-700" />
              <span className="text-[11px] sm:text-xs">Admin</span>
              {pendingCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
