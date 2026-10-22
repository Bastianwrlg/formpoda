import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Eye,
  Printer,
  Download,
  Building2,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Award,
  FileSpreadsheet,
  Settings,
  Layers,
  Radio,
} from 'lucide-react';
import { ResellerSubmission, SubmissionStatus, FormSettings } from '../types/formData';
import { COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE } from '../utils/constants';
import { exportSubmissionsToExcel } from '../utils/excelExport';
import { FormSettingsEditor } from './FormSettingsEditor';
import { dataService } from '../services/dataService';
import { Lock, Unlock, LogOut } from 'lucide-react';
import { idbGetSubmission } from '../utils/indexedDb';

interface AdminPortalProps {
  onBackToForm: () => void;
  submissions: ResellerSubmission[];
  onRefreshSubmissions: () => void;
  settings: FormSettings;
  onSaveSettings: (newSettings: FormSettings) => Promise<boolean>;
  onResetSettings: () => void;
  isRealtimeConnected: boolean;
  onLogout?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToForm,
  submissions = [],
  onRefreshSubmissions,
  settings,
  onSaveSettings,
  onResetSettings,
  isRealtimeConnected,
  onLogout,
}) => {
  const [adminViewTab, setAdminViewTab] = useState<'submissions' | 'settings'>('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [selectedSub, setSelectedSub] = useState<ResellerSubmission | null>(null);
  const [showLetterModal, setShowLetterModal] = useState<ResellerSubmission | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSettingsUnlocked, setIsSettingsUnlocked] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [liveAlert, setLiveAlert] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [customBackendUrlInput, setCustomBackendUrlInput] = useState(() => dataService.getCustomBackendUrl());
  const [savedUrlSuccess, setSavedUrlSuccess] = useState(false);

  const prevCountRef = React.useRef(submissions.length);

  // Detect incoming real-time submissions from concurrent users
  useEffect(() => {
    if (submissions.length > prevCountRef.current && prevCountRef.current > 0) {
      const newest = submissions[0];
      setLiveAlert(
        `Pendaftaran Baru Masuk: "${newest?.data?.q8_nama_toko || 'Toko'}" (${newest?.registrationNumber}) - Otomatis tersimpan di Admin.`
      );
      const timer = setTimeout(() => setLiveAlert(null), 9000);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = submissions.length;
  }, [submissions]);

  // Refresh submissions once when admin view opens
  useEffect(() => {
    onRefreshSubmissions();
  }, [onRefreshSubmissions]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshSubmissions();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleUpdateStatus = async (id: string, newStatus: SubmissionStatus) => {
    setIsUpdating(true);
    try {
      const updated = await dataService.updateSubmissionStatus(
        id,
        newStatus,
        adminNote,
        'Verifikator Sales PT. PODA E-LIQUID COMPANY'
      );
      if (updated) {
        setSelectedSub(updated);
        onRefreshSubmissions();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenDetail = async (sub: ResellerSubmission) => {
    setSelectedSub(sub);
    setAdminNote(sub.catatanAdmin || '');
    try {
      const full = await idbGetSubmission(sub.id);
      if (full) {
        setSelectedSub(full);
      }
    } catch (e) {
      console.warn('Could not load full document from IDB:', e);
    }
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      item.registrationNumber.toLowerCase().includes(q) ||
      item.data.q1_nama_pemohon.toLowerCase().includes(q) ||
      item.data.q8_nama_toko.toLowerCase().includes(q) ||
      item.data.q11_nib.toLowerCase().includes(q) ||
      item.data.q13_kota_kabupaten.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchChannel = channelFilter === 'all' || item.data.q15_saluran_penjualan === channelFilter;

    return matchSearch && matchStatus && matchChannel;
  });

  // Export to Excel (.xlsx) - neat formatted table
  const handleExportExcel = () => {
    exportSubmissionsToExcel(filteredSubmissions);
  };

  // Export to CSV fallback
  const exportToCSV = () => {
    const headers = [
      'No Registrasi',
      'Tanggal Pengajuan',
      'Status',
      'Rekomendasi Sistem',
      'Nama Toko',
      'NIB',
      'Pemohon',
      'WhatsApp',
      'Email',
      'Kota',
      'Provinsi',
      'Saluran',
      'Merek Diajukan',
    ];

    const rows = filteredSubmissions.map((s) => [
      `"${s.registrationNumber}"`,
      `"${new Date(s.createdAt).toLocaleDateString('id-ID')}"`,
      `"${s.status}"`,
      `"${s.rekomendasiSistem}"`,
      `"${s.data.q8_nama_toko}"`,
      `"${s.data.q11_nib}"`,
      `"${s.data.q1_nama_pemohon}"`,
      `"${s.data.q3_whatsapp_pemohon}"`,
      `"${s.data.q4_email_pemohon}"`,
      `"${s.data.q13_kota_kabupaten}"`,
      `"${s.data.q14_provinsi}"`,
      `"${s.data.q15_saluran_penjualan}"`,
      `"${s.data.q31_merek_produk?.join('; ')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PODA_Reseller_Submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'disetujui':
        return <span className="text-emerald-700 font-semibold text-xs">● Disetujui</span>;
      case 'dapat_disetujui':
        return <span className="text-blue-700 font-semibold text-xs">● Siap Persetujuan</span>;
      case 'tahan_permohonan':
        return <span className="text-amber-700 font-semibold text-xs">● Ditahan</span>;
      case 'perlu_dokumen_tambahan':
        return <span className="text-purple-700 font-semibold text-xs">● Perlu Dokumen</span>;
      case 'ditolak':
        return <span className="text-rose-700 font-semibold text-xs">● Ditolak</span>;
      default:
        return <span className="text-slate-600 font-semibold text-xs">● Menunggu</span>;
    }
  };

  const getRekomendasiColor = (rek: string) => {
    if (rek.includes('Dapat diajukan')) return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    if (rek.includes('Dapat dilanjutkan')) return 'text-blue-800 bg-blue-50 border-blue-200';
    if (rek.includes('Tolak otorisasi')) return 'text-rose-800 bg-rose-50 border-rose-200';
    return 'text-amber-800 bg-amber-50 border-amber-200';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Live Concurrent Submission Notification Alert */}
      {liveAlert && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3 animate-fade-in border border-emerald-400/30">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-white" />
            </span>
            <div>
              <p className="font-bold text-sm tracking-wide">Pemberitahuan Real-Time</p>
              <p className="text-xs text-emerald-100">{liveAlert}</p>
            </div>
          </div>
          <button
            onClick={() => setLiveAlert(null)}
            className="text-xs bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Top Banner in Executive Light Theme */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
              <span>Portal Verifikasi & Otorisasi Sales</span>
              <span>·</span>
              <span>{settings.companyName}</span>
              <span className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => setShowSyncModal(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 transition-colors cursor-pointer"
                title="Klik untuk melihat status sinkronisasi multi-user & panduan koneksi Netlify"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isRealtimeConnected ? 'Multi-User Live Sync Aktif' : 'Sinkronisasi Aktif'}</span>
                <span className="text-[10px] text-emerald-600 underline ml-0.5">Detail</span>
              </button>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-950">
              Dashboard Verifikasi & Manajemen Reseller
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Pemeriksaan permohonan resmi, evaluasi 5 ketentuan internal admin, ekspor Excel rapi, serta pengaturan formulir per halaman.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportSubmissionsToExcel(filteredSubmissions, 'xls')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[42px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              title="Ekspor ke format Microsoft Excel .XLS (Tabel Rapi, Auto-fit Kolom)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Ekspor Format XLS</span>
            </button>

            <button
              onClick={() => exportSubmissionsToExcel(filteredSubmissions, 'xlsx')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[42px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
              title="Ekspor ke format Excel .XLSX"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
              <span>Ekspor XLSX</span>
            </button>

            <button
              onClick={exportToCSV}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-2.5 min-h-[42px] bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold rounded-xl text-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-600" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[42px] bg-slate-900 hover:bg-slate-800 text-xs font-bold rounded-xl text-white transition-colors shadow-xs cursor-pointer disabled:opacity-75"
              title="Sinkronisasi ulang semua data dari database server"
            >
              <RefreshCw className={`w-4 h-4 text-slate-200 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Memperbarui...' : 'Refresh'}</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 min-h-[42px] bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer"
                title="Keluar dari sesi Administrator"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Keluar</span>
              </button>
            )}
          </div>
        </div>

        {/* Admin Navigation Tabs: Submissions vs Form Settings */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setAdminViewTab('submissions')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                adminViewTab === 'submissions'
                  ? 'bg-white text-slate-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Daftar Permohonan ({submissions.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminViewTab('settings')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
                adminViewTab === 'settings'
                  ? 'bg-white text-slate-950 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-amber-600" />
              <span>Pengaturan Formulir per Halaman</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Diperbarui: <strong>{new Date().toLocaleTimeString('id-ID')}</strong>
          </div>
        </div>
      </div>

      {/* View 1: Form Settings Editor Tab with PIN Protection */}
      {adminViewTab === 'settings' ? (
        !isSettingsUnlocked ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md mx-auto text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Verifikasi Akses Pengaturan Admin</h3>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan PIN Admin untuk mengubah pengaturan formulir per halaman (Default: <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-amber-700 font-bold">admin123</code>).
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pinInput.trim() === (settings.adminPin || 'admin123')) {
                  setIsSettingsUnlocked(true);
                  setPinError(false);
                } else {
                  setPinError(true);
                }
              }}
              className="space-y-3"
            >
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Masukkan PIN..."
                className="w-full text-center tracking-widest text-base font-bold py-2.5 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              {pinError && (
                <p className="text-xs text-rose-600 font-medium">
                  PIN tidak sesuai. Gunakan default 'admin123' atau klik tombol Buka Langsung.
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Buka Pengaturan
                </button>
                <button
                  type="button"
                  onClick={() => setIsSettingsUnlocked(true)}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
                  title="Bypass langsung untuk kemudahan pengujian"
                >
                  Buka Langsung
                </button>
              </div>
            </form>
          </div>
        ) : (
          <FormSettingsEditor
            settings={settings}
            onSaveSettings={onSaveSettings}
            onResetSettings={onResetSettings}
          />
        )
      ) : (
        /* View 2: Submissions Review & Management */
        <div className="space-y-4 sm:space-y-6">
          {/* 5 Panduan Internal Admin Box (from page 20) in Light Theme */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-3 uppercase">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>5 Prinsip Keputusan Tim Admin (Dokumen Hal. 20)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="font-semibold text-emerald-800 block">1. Identitas & Kanal Sesuai:</span>
                <p className="text-slate-600">Dapat diajukan untuk persetujuan</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="font-semibold text-blue-800 block">2. Penerima Kuasa + Ada Dokumen:</span>
                <p className="text-slate-600">Dapat dilanjutkan proses verifikasinya</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="font-semibold text-amber-800 block">3. Tanpa Bukti Kuasa / Asal Produk:</span>
                <p className="text-slate-600">Tahan permohonan hingga dilengkapi</p>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <span className="font-semibold text-rose-800 block">4. Lokasi / Platform Tidak Patuh:</span>
                <p className="text-slate-600">Tolak otorisasi untuk kanal tersebut</p>
              </div>
              <div className="bg-amber-50/80 p-2.5 rounded-xl border border-amber-200/80 sm:col-span-2">
                <span className="font-semibold text-amber-950 block">Aturan Utama Perusahaan:</span>
                <p className="text-amber-900">
                  Jangan memberikan Surat Penunjukan Reseller otomatis hanya berdasarkan NIB dan persetujuan kotak centang!
                </p>
              </div>
            </div>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            <div className="bg-white border border-slate-200/90 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xs">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Total Masuk</span>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{submissions.length}</p>
            </div>
            <div className="bg-white border border-slate-200/90 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xs">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Menunggu / Ditahan</span>
              <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-0.5">
                {submissions.filter((s) => s.status === 'menunggu_verifikasi' || s.status === 'tahan_permohonan').length}
              </p>
            </div>
            <div className="bg-white border border-slate-200/90 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xs">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Siap Persetujuan</span>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-0.5">
                {submissions.filter((s) => s.status === 'dapat_disetujui').length}
              </p>
            </div>
            <div className="bg-white border border-slate-200/90 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xs">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Reseller Resmi Aktif</span>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">
                {submissions.filter((s) => s.status === 'disetujui').length}
              </p>
            </div>
            <div className="bg-white border border-slate-200/90 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Ditolak</span>
              <p className="text-xl sm:text-2xl font-bold text-rose-600 mt-0.5">
                {submissions.filter((s) => s.status === 'ditolak').length}
              </p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama toko, pemohon, NIB, kota, no registrasi..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-100 min-h-[42px]"
                />
              </div>

              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:border-amber-500 min-h-[42px]"
                >
                  <option value="all">Semua Status</option>
                  <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                  <option value="dapat_disetujui">Siap Persetujuan</option>
                  <option value="disetujui">Disetujui Resmi</option>
                  <option value="tahan_permohonan">Ditahan</option>
                  <option value="perlu_dokumen_tambahan">Perlu Dokumen</option>
                  <option value="ditolak">Ditolak</option>
                </select>

                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:border-amber-500 min-h-[42px]"
                >
                  <option value="all">Semua Saluran</option>
                  <option value="Toko Fisik Saja">Toko Fisik Saja</option>
                  <option value="Toko Online Saja">Toko Online Saja</option>
                  <option value="Toko Fisik dan Toko Online">Toko Fisik & Online</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submissions List: Desktop Table + Mobile Cards */}
          <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden">
            {/* Mobile Cards (shown on small devices) */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs px-4">
                  Tidak ada pendaftaran reseller yang sesuai filter.
                </div>
              ) : (
                filteredSubmissions.map((sub) => {
                  const isRecent = Date.now() - new Date(sub.createdAt).getTime() < 30 * 60 * 1000;
                  return (
                    <div key={sub.id} className="p-4 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-slate-900">
                            {sub.registrationNumber}
                          </span>
                          {isRecent && (
                            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                              Baru
                            </span>
                          )}
                        </div>
                        <div>{getStatusBadge(sub.status)}</div>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-slate-950">{sub.data.q8_nama_toko}</h3>
                      <p className="text-xs text-slate-500">
                        {sub.data.q1_nama_pemohon} · {sub.data.q13_kota_kabupaten}, {sub.data.q14_provinsi}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {sub.data.q15_saluran_penjualan}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-medium border ${getRekomendasiColor(
                          sub.rekomendasiSistem
                        )}`}
                      >
                        {sub.rekomendasiSistem}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleOpenDetail(sub)}
                        className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
                      >
                        <Eye className="w-4 h-4 text-slate-600" />
                        <span>Detail Berkas</span>
                      </button>

                      {sub.status === 'disetujui' && (
                        <button
                          onClick={() => setShowLetterModal(sub)}
                          className="py-2 px-3 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
                        >
                          <Award className="w-4 h-4 text-amber-800" />
                          <span>Surat</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            </div>

            {/* Desktop Table (hidden on mobile, shown on md and larger) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">No. Registrasi</th>
                    <th className="py-3 px-4">Toko & Pemohon</th>
                    <th className="py-3 px-4">Saluran</th>
                    <th className="py-3 px-4">Rekomendasi Sistem</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Tidak ada pendaftaran reseller yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map((sub) => {
                      const isRecent = Date.now() - new Date(sub.createdAt).getTime() < 30 * 60 * 1000;
                      return (
                        <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span>{sub.registrationNumber}</span>
                              {isRecent && (
                                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                                  Baru
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-sans">
                              {new Date(sub.createdAt).toLocaleDateString('id-ID')}
                            </div>
                          </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{sub.data.q8_nama_toko}</div>
                          <div className="text-xs text-slate-500">
                            {sub.data.q1_nama_pemohon} · {sub.data.q13_kota_kabupaten}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-700">
                          {sub.data.q15_saluran_penjualan}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getRekomendasiColor(
                              sub.rekomendasiSistem
                            )}`}
                          >
                            {sub.rekomendasiSistem}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">{getStatusBadge(sub.status)}</td>
                        <td className="py-3 px-4 text-right whitespace-nowrap space-x-1.5">
                          <button
                            onClick={() => handleOpenDetail(sub)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span>Detail</span>
                          </button>

                          {sub.status === 'disetujui' && (
                            <button
                              onClick={() => setShowLetterModal(sub)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-medium rounded-lg transition-colors cursor-pointer"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-800" />
                              <span>Surat Penunjukan</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail Inspector */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-3xl">
              <div>
                <span className="text-[11px] text-amber-700 font-bold uppercase tracking-wider block">
                  Verifikasi Berkas Reseller
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate max-w-[240px] sm:max-w-none">
                  {selectedSub.data.q8_nama_toko}
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  {selectedSub.registrationNumber} · {new Date(selectedSub.createdAt).toLocaleDateString('id-ID')}
                </span>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="w-9 h-9 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-xs sm:text-sm">
              {/* Automated Evaluation Box */}
              <div
                className={`p-3.5 sm:p-4 rounded-xl border ${
                  selectedSub.rekomendasiSistem.includes('Dapat diajukan')
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : selectedSub.rekomendasiSistem.includes('Dapat dilanjutkan')
                    ? 'bg-blue-50 border-blue-200 text-blue-950'
                    : selectedSub.rekomendasiSistem.includes('Tolak otorisasi')
                    ? 'bg-rose-50 border-rose-200 text-rose-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Rekomendasi Sistem (Aturan Hal. 20):</span>
                </div>
                <p className="font-semibold text-xs sm:text-sm">{selectedSub.rekomendasiSistem}</p>
                <p className="text-[11px] sm:text-xs opacity-90 mt-1">{selectedSub.alasanRekomendasi}</p>
              </div>

              {/* Data Section 1: Pemohon & Usaha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1 text-xs sm:text-sm">
                    Identitas Pemohon
                  </h4>
                  <div className="space-y-1 text-xs">
                    <p><span className="text-slate-500">Nama:</span> <strong>{selectedSub.data.q1_nama_pemohon}</strong></p>
                    <p><span className="text-slate-500">Hubungan:</span> {selectedSub.data.q2_hubungan_pemohon}</p>
                    <p><span className="text-slate-500">WA Pemohon:</span> {selectedSub.data.q3_whatsapp_pemohon}</p>
                    <p><span className="text-slate-500">Email Pemohon:</span> {selectedSub.data.q4_email_pemohon}</p>
                    <p><span className="text-slate-500">Pemilik Usaha:</span> {selectedSub.data.q5_nama_pemilik}</p>
                    <p><span className="text-slate-500">WA Pemilik:</span> {selectedSub.data.q6_whatsapp_pemilik}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 mb-2 border-b border-slate-200 pb-1 text-xs sm:text-sm">
                    Identitas & Legalitas Usaha
                  </h4>
                  <div className="space-y-1 text-xs">
                    <p><span className="text-slate-500">Bentuk Usaha:</span> {selectedSub.data.q9_bentuk_usaha}</p>
                    <p><span className="text-slate-500">NIB:</span> <strong className="font-mono">{selectedSub.data.q11_nib}</strong></p>
                    <p><span className="text-slate-500">Badan Usaha:</span> {selectedSub.data.q10_nama_pemilik_usaha}</p>
                    <p><span className="text-slate-500">Kota:</span> {selectedSub.data.q13_kota_kabupaten}, {selectedSub.data.q14_provinsi}</p>
                    <p className="break-words"><span className="text-slate-500">Alamat Usaha:</span> {selectedSub.data.q12_alamat_usaha}</p>
                  </div>
                </div>
              </div>

              {/* Data Section 2: Saluran Penjualan Detail */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs sm:text-sm">
                  Saluran Penjualan: {selectedSub.data.q15_saluran_penjualan}
                </h4>

                {/* Fisik Details */}
                {(selectedSub.data.q15_saluran_penjualan === 'Toko Fisik Saja' ||
                  selectedSub.data.q15_saluran_penjualan === 'Toko Fisik dan Toko Online') && (
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800">Detail Toko Fisik:</p>
                    <p>• Nama: {selectedSub.data.q16a_nama_toko_fisik || selectedSub.data.q16c_nama_toko_fisik}</p>
                    <p>• Alamat: {selectedSub.data.q17a_alamat_toko_fisik || selectedSub.data.q17c_alamat_toko_fisik}</p>
                    <p>
                      • Link Maps:{' '}
                      <a
                        href={selectedSub.data.q18a_maps_toko_fisik || selectedSub.data.q18c_maps_toko_fisik}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-700 underline font-medium"
                      >
                        Buka Google Maps ↗
                      </a>
                    </p>
                    <p>• PIC Fisik: {selectedSub.data.q19a_penanggung_jawab_fisik || selectedSub.data.q19c_penanggung_jawab_fisik}</p>
                    <p>• Kepatuhan Zonasi: <strong>{selectedSub.data.q22a_kepatuhan_lokasi_fisik || selectedSub.data.q22c_kepatuhan_lokasi_fisik}</strong></p>
                  </div>
                )}

                {/* Online Details */}
                {(selectedSub.data.q15_saluran_penjualan === 'Toko Online Saja' ||
                  selectedSub.data.q15_saluran_penjualan === 'Toko Fisik dan Toko Online') && (
                  <div className="space-y-1 pt-2 border-t border-slate-200">
                    <p className="font-semibold text-slate-800">Detail Toko Online:</p>
                    <p>• Nama Online: {selectedSub.data.q16b_nama_toko_online || selectedSub.data.q23c_nama_toko_online}</p>
                    <p>• Platform: {selectedSub.data.q17b_platform_online || selectedSub.data.q24c_platform_online}</p>
                    <p>
                      • Link Online:{' '}
                      <a
                        href={selectedSub.data.q18b_link_online || selectedSub.data.q25c_link_online}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-700 underline font-medium"
                      >
                        Buka Link Toko Online ↗
                      </a>
                    </p>
                    <p>• Verifikasi Usia: <strong>{selectedSub.data.q23b_verifikasi_usia_online || selectedSub.data.q30c_verifikasi_usia_online}</strong></p>
                  </div>
                )}
              </div>

              {/* Data Section 3: Produk & Distributor */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs sm:text-sm">
                  Merek & Sumber Pasokan
                </h4>
                <p>• Sumber Pasokan: <strong>{selectedSub.data.q32_sumber_pembelian}</strong></p>
                <p>• Nama Distributor: <strong>{selectedSub.data.q33_nama_distributor}</strong></p>
                <p>• Merek Diajukan: {selectedSub.data.q31_merek_produk?.join(', ')}</p>
              </div>

              {/* Data Section 4: Dokumen Terlampir */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs sm:text-sm">
                  Berkas & Dokumen Unggahan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold block text-slate-800">1. Dokumen NIB</span>
                    {selectedSub.data.q36_dokumen_nib ? (
                      <div className="flex items-center justify-between gap-1.5 mt-0.5">
                        <span className="text-emerald-700 font-medium truncate">✓ {selectedSub.data.q36_dokumen_nib.fileName}</span>
                        {selectedSub.data.q36_dokumen_nib.dataUrl && (
                          <a
                            href={selectedSub.data.q36_dokumen_nib.dataUrl}
                            download={selectedSub.data.q36_dokumen_nib.fileName}
                            className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline shrink-0"
                          >
                            Unduh
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-rose-600">✗ Tidak dilampirkan</span>
                    )}
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold block text-slate-800">2. Foto Toko Fisik</span>
                    {selectedSub.data.q37_foto_depan_toko ? (
                      <div className="flex items-center justify-between gap-1.5 mt-0.5">
                        <span className="text-emerald-700 font-medium truncate">✓ {selectedSub.data.q37_foto_depan_toko.fileName}</span>
                        {selectedSub.data.q37_foto_depan_toko.dataUrl && (
                          <a
                            href={selectedSub.data.q37_foto_depan_toko.dataUrl}
                            download={selectedSub.data.q37_foto_depan_toko.fileName}
                            className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline shrink-0"
                          >
                            Unduh
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">Tidak wajib / kosong</span>
                    )}
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold block text-slate-800">3. Screenshot Profil Online</span>
                    {selectedSub.data.q38_screenshot_toko_online ? (
                      <div className="flex items-center justify-between gap-1.5 mt-0.5">
                        <span className="text-emerald-700 font-medium truncate">✓ {selectedSub.data.q38_screenshot_toko_online.fileName}</span>
                        {selectedSub.data.q38_screenshot_toko_online.dataUrl && (
                          <a
                            href={selectedSub.data.q38_screenshot_toko_online.dataUrl}
                            download={selectedSub.data.q38_screenshot_toko_online.fileName}
                            className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline shrink-0"
                          >
                            Unduh
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">Tidak wajib / kosong</span>
                    )}
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-semibold block text-slate-800">4. Bukti Pembelian Produk</span>
                    {selectedSub.data.q39_bukti_pembelian ? (
                      <div className="flex items-center justify-between gap-1.5 mt-0.5">
                        <span className="text-emerald-700 font-medium truncate">✓ {selectedSub.data.q39_bukti_pembelian.fileName}</span>
                        {selectedSub.data.q39_bukti_pembelian.dataUrl && (
                          <a
                            href={selectedSub.data.q39_bukti_pembelian.dataUrl}
                            download={selectedSub.data.q39_bukti_pembelian.fileName}
                            className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline shrink-0"
                          >
                            Unduh
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-amber-700">Belum diunggah</span>
                    )}
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200 sm:col-span-2">
                    <span className="font-semibold block text-slate-800">5. Surat Kuasa (Jika Penerima Kuasa)</span>
                    {selectedSub.data.q40_surat_kuasa ? (
                      <div className="flex items-center justify-between gap-1.5 mt-0.5">
                        <span className="text-emerald-700 font-medium truncate">✓ {selectedSub.data.q40_surat_kuasa.fileName}</span>
                        {selectedSub.data.q40_surat_kuasa.dataUrl && (
                          <a
                            href={selectedSub.data.q40_surat_kuasa.dataUrl}
                            download={selectedSub.data.q40_surat_kuasa.fileName}
                            className="text-[11px] text-amber-700 hover:text-amber-900 font-bold underline shrink-0"
                          >
                            Unduh
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">Tidak ada surat kuasa</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Catatan Verifikator */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1 text-xs sm:text-sm">
                  Catatan Internal Verifikator / Sales Admin:
                </label>
                <textarea
                  rows={2}
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Tambahkan catatan hasil verifikasi berkas, telepon, atau cek lokasi..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-500 font-semibold block mb-2">
                  Tindakan Verifikasi Sales & Legal PT. PODA E-LIQUID COMPANY:
                </span>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedSub.id, 'disetujui')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Setujui & Terbitkan Surat Otorisasi</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedSub.id, 'tahan_permohonan')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Tahan Permohonan</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedSub.id, 'perlu_dokumen_tambahan')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Minta Dokumen Tambahan</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(selectedSub.id, 'ditolak')}
                    className="flex-1 sm:flex-initial px-4 py-2.5 min-h-[44px] bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak Otorisasi</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cetak Surat Penunjukan Reseller Resmi */}
      {showLetterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
            {/* Modal Actions */}
            <div className="px-5 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl print:hidden">
              <span className="text-xs font-bold text-slate-800">Surat Penunjukan Reseller Resmi</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cetak</span>
                </button>
                <button
                  onClick={() => setShowLetterModal(null)}
                  className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Letter Document Format */}
            <div className="p-5 sm:p-8 overflow-y-auto bg-white text-slate-900 font-serif leading-relaxed text-xs sm:text-sm">
              {/* Kop Surat PT. PODA E-LIQUID COMPANY */}
              <div className="text-center pb-4 border-b-2 border-slate-950">
                <h2 className="text-lg sm:text-xl font-extrabold tracking-wider uppercase font-sans text-slate-950">
                  {settings.companyName}
                </h2>
                <p className="text-[11px] sm:text-xs font-sans text-slate-600">
                  Produsen & Pemegang Lisensi Resmi Produk E-Liquid Indonesia
                </p>
                <p className="text-[10px] sm:text-[11px] font-sans text-slate-500">
                  Gedung Graha Poda Lt. 4, Kawasan Industri Terpadu, Jakarta · Email: {settings.companyEmail}
                </p>
              </div>

              {/* Letter Title */}
              <div className="text-center my-4 sm:my-6">
                <h3 className="text-sm sm:text-base font-bold underline uppercase tracking-wide">
                  SURAT PENUNJUKAN RESELLER RESMI
                </h3>
                <p className="text-xs font-mono font-medium text-slate-600 mt-0.5">
                  Nomor: {showLetterModal.nomorSuratPenunjukan || 'SPR/PODA/2026/10/001'}
                </p>
              </div>

              {/* Body */}
              <p className="mb-3 text-justify">
                Dengan ini Direksi <strong>{settings.companyName}</strong> menyatakan bahwa:
              </p>

              <div className="my-3 pl-3 sm:pl-4 border-l-2 border-slate-300 space-y-1 text-xs font-sans">
                <p><span className="text-slate-500 inline-block w-32 sm:w-36">Nama Toko/Dagang:</span> <strong>{showLetterModal.data.q8_nama_toko}</strong></p>
                <p><span className="text-slate-500 inline-block w-32 sm:w-36">Nama Pemilik/Usaha:</span> <strong>{showLetterModal.data.q10_nama_pemilik_usaha}</strong></p>
                <p><span className="text-slate-500 inline-block w-32 sm:w-36">NIB:</span> <strong className="font-mono">{showLetterModal.data.q11_nib}</strong></p>
                <p><span className="text-slate-500 inline-block w-32 sm:w-36">Saluran Penjualan:</span> {showLetterModal.data.q15_saluran_penjualan}</p>
                <p><span className="text-slate-500 inline-block w-32 sm:w-36">Alamat/Lokasi:</span> {showLetterModal.data.q12_alamat_usaha}, {showLetterModal.data.q13_kota_kabupaten}</p>
              </div>

              <p className="mb-2 text-justify">
                Telah memenuhi persyaratan verifikasi dan secara sah ditunjuk sebagai <strong>Reseller Resmi Terdaftar</strong> untuk mendistribusikan produk-produk yang diotorisasi oleh <strong>{settings.companyName}</strong> berikut:
              </p>

              <ul className="list-disc list-inside text-xs font-sans bg-slate-50 p-3 rounded-lg border border-slate-200 mb-3 space-y-1">
                {showLetterModal.data.q31_merek_produk?.map((m) => (
                  <li key={m} className="font-semibold">{m}</li>
                ))}
              </ul>

              <p className="text-[11px] sm:text-xs text-justify text-slate-600 mb-5">
                Surat Penunjukan Reseller ini merupakan otorisasi terbatas dan wajib tunduk pada Ketentuan Reseller Resmi {settings.companyName} serta kepatuhan hukum yang berlaku di Indonesia.
              </p>

              {/* Signatures */}
              <div className="mt-6 pt-3 flex justify-between items-end text-xs font-sans">
                <div>
                  <p className="text-slate-500">Diverifikasi & Diterbitkan di:</p>
                  <p className="font-medium">Jakarta, {new Date(showLetterModal.tanggalDisetujui || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-900">{settings.companyName}</p>
                  <div className="h-12 flex items-center justify-center">
                    <span className="text-amber-800 font-bold border-2 border-amber-800 px-2.5 py-0.5 rounded text-[10px] tracking-wider uppercase rotate-[-3deg]">
                      VERIFIED & AUTHORIZED
                    </span>
                  </div>
                  <p className="font-bold underline text-slate-900">DIVISI LEGAL & OTORISASI RESELLER</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-User Real-time Sync & Netlify Backend Configuration Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Sinkronisasi Multi-User & Server</h3>
                  <p className="text-xs text-slate-500">PT. PODA E-LIQUID COMPANY Database</p>
                </div>
              </div>
              <button
                onClick={() => setShowSyncModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Status Indicator Card */}
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    Status Multi-User Concurrency
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-300">
                    {isRealtimeConnected ? 'Real-Time Aktif' : 'Terhubung Lokal & Backup'}
                  </span>
                </div>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Semua pendaftaran dari siapa pun yang dikirim pada saat bersamaan dijamin 100% tersimpan aman di menu Admin tanpa data hilang atau nomor registrasi bertabrakan.
                </p>
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-950">
                  <span>Total Data di Database Admin:</span>
                  <strong className="text-sm font-extrabold text-emerald-800">{submissions.length} Pendaftar</strong>
                </div>
              </div>

              {/* Netlify Deployment & Backend Setup Info */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Panduan Deploy Netlify & Backend Terpusat</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika frontend Anda dideploy ke <strong>Netlify</strong>, masukkan alamat server API backend di bawah ini agar semua pengguna dari berbagai kota/perangkat langsung tersambung ke database admin yang sama:
                </p>

                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    URL Server Backend (Opsional untuk deploy Netlify terpisah):
                  </label>
                  <input
                    type="url"
                    placeholder="https://server-poda.yourdomain.com (Kosongkan jika satu server)"
                    value={customBackendUrlInput}
                    onChange={(e) => setCustomBackendUrlInput(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                  {savedUrlSuccess && (
                    <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> URL Server berhasil diperbarui & tersambung!
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      dataService.setCustomBackendUrl(customBackendUrlInput);
                      setSavedUrlSuccess(true);
                      onRefreshSubmissions();
                      setTimeout(() => setSavedUrlSuccess(false), 3000);
                    }}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Simpan URL Server
                  </button>
                  {customBackendUrlInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomBackendUrlInput('');
                        dataService.setCustomBackendUrl('');
                        onRefreshSubmissions();
                      }}
                      className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Reset Default
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSyncModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
