import React, { useState } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Layers,
  Sparkles,
  Shield,
  Building,
  HelpCircle,
  AlertCircle,
  FileText,
  Megaphone,
  KeyRound,
  Eye,
} from 'lucide-react';
import { FormSettings, PageCustomization } from '../types/formData';
import { DEFAULT_FORM_SETTINGS } from '../utils/defaultSettings';

interface FormSettingsEditorProps {
  settings: FormSettings;
  onSaveSettings: (newSettings: FormSettings) => Promise<boolean>;
  onResetSettings: () => void;
}

const PAGE_KEYS = [
  { key: 'page-1', label: 'Hal 1: Informasi Pendaftaran' },
  { key: 'page-2', label: 'Hal 2: Identitas Pemohon' },
  { key: 'page-3', label: 'Hal 3: Identitas Usaha' },
  { key: 'page-4', label: 'Hal 4: Saluran Penjualan' },
  { key: 'page-5A', label: 'Hal 5A: Toko Fisik' },
  { key: 'page-5B', label: 'Hal 5B: Toko Online' },
  { key: 'page-5C', label: 'Hal 5C: Toko Fisik & Online' },
  { key: 'page-6', label: 'Hal 6: Produk & Distributor' },
  { key: 'page-7', label: 'Hal 7: Dokumen Pendukung' },
  { key: 'page-8', label: 'Hal 8: Ketentuan & Privasi' },
  { key: 'page-9', label: 'Hal 9: Pernyataan & Konfirmasi' },
];

export const FormSettingsEditor: React.FC<FormSettingsEditorProps> = ({
  settings,
  onSaveSettings,
  onResetSettings,
}) => {
  const [localSettings, setLocalSettings] = useState<FormSettings>(settings);
  const [activeTab, setActiveTab] = useState<'pages' | 'brands' | 'company' | 'terms' | 'banner'>('pages');
  const [selectedPageKey, setSelectedPageKey] = useState<string>('page-1');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newBrandInput, setNewBrandInput] = useState('');
  const [newKetentuanInput, setNewKetentuanInput] = useState('');

  // Keep in sync if prop changes
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handlePageFieldChange = (pageKey: string, field: keyof PageCustomization, value: any) => {
    setLocalSettings((prev) => {
      const currentPage = prev.pages[pageKey] || {
        title: '',
        subtitle: '',
        helpText: '',
        enabled: true,
      };
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [pageKey]: {
            ...currentPage,
            [field]: value,
          },
        },
      };
    });
  };

  const handleAddBrand = () => {
    if (!newBrandInput.trim()) return;
    setLocalSettings((prev) => ({
      ...prev,
      productBrands: [...prev.productBrands, newBrandInput.trim()],
    }));
    setNewBrandInput('');
  };

  const handleRemoveBrand = (index: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      productBrands: prev.productBrands.filter((_, i) => i !== index),
    }));
  };

  const handleAddKetentuan = () => {
    if (!newKetentuanInput.trim()) return;
    setLocalSettings((prev) => ({
      ...prev,
      ketentuanPoin: [...prev.ketentuanPoin, newKetentuanInput.trim()],
    }));
    setNewKetentuanInput('');
  };

  const handleRemoveKetentuan = (index: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      ketentuanPoin: prev.ketentuanPoin.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    const ok = await onSaveSettings(localSettings);
    setIsSaving(false);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const activePageConfig = localSettings.pages[selectedPageKey] || {
    title: '',
    subtitle: '',
    helpText: '',
    enabled: true,
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-xs overflow-hidden">
      {/* Editor Header */}
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4 text-amber-600" />
            <span>Kustomisasi Formulir Reseller</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Pengaturan Formulir per Halaman & Identitas
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin dapat mengatur judul, petunjuk tiap halaman, merek produk, ketentuan, dan banner pengumuman secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={onResetSettings}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[38px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            title="Kembalikan ke settingan standar dokumen"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Standar</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[38px] bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mx-4 sm:mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Berhasil disimpan!</strong> Perubahan formulir telah diperbarui ke database dan langsung tersinkronisasi ke seluruh layar pemohon secara real-time.
          </span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="px-4 sm:px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto no-scrollbar text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('pages')}
          className={`px-3 py-2 border-b-2 font-bold cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'pages'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Setting per Halaman (1 s.d. 9)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('brands')}
          className={`px-3 py-2 border-b-2 font-bold cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'brands'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Daftar Merek Produk ({localSettings.productBrands.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('terms')}
          className={`px-3 py-2 border-b-2 font-bold cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'terms'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Ketentuan & Persyaratan ({localSettings.ketentuanPoin.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('banner')}
          className={`px-3 py-2 border-b-2 font-bold cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'banner'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Banner & Akses Admin
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('company')}
          className={`px-3 py-2 border-b-2 font-bold cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'company'
              ? 'border-amber-500 text-amber-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Profil Perusahaan
        </button>
      </div>

      {/* Tab 1: Pages Editor */}
      {activeTab === 'pages' && (
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left page selector column */}
          <div className="md:col-span-4 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Pilih Halaman Formulir:
            </span>
            <div className="flex md:flex-col overflow-x-auto gap-1 pb-2 md:pb-0">
              {PAGE_KEYS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedPageKey(item.key)}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 md:shrink md:w-full ${
                    selectedPageKey === item.key
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right form editor for the selected page */}
          <div className="md:col-span-8 space-y-4">
            <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-900 text-sm">
                  Konfigurasi: {PAGE_KEYS.find((p) => p.key === selectedPageKey)?.label}
                </span>
                <span className="text-[11px] font-mono text-slate-500">{selectedPageKey}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Judul Utama Halaman
                </label>
                <input
                  type="text"
                  value={activePageConfig.title}
                  onChange={(e) => handlePageFieldChange(selectedPageKey, 'title', e.target.value)}
                  placeholder="Judul halaman..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Deskripsi / Subtitle Halaman
                </label>
                <textarea
                  rows={2}
                  value={activePageConfig.subtitle}
                  onChange={(e) => handlePageFieldChange(selectedPageKey, 'subtitle', e.target.value)}
                  placeholder="Penjelasan tujuan halaman..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Petunjuk Khusus Pemohon (Help Text / Tips)
                </label>
                <textarea
                  rows={2}
                  value={activePageConfig.helpText || ''}
                  onChange={(e) => handlePageFieldChange(selectedPageKey, 'helpText', e.target.value)}
                  placeholder="Petunjuk khusus pengisian untuk membantu pemohon..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
                />
              </div>
            </div>

            {/* Live Preview Box */}
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/80">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Pratinjau Tampilan Pemohon ({selectedPageKey})</span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                  {activePageConfig.title || 'Judul Halaman'}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activePageConfig.subtitle || 'Deskripsi halaman...'}
                </p>
                {activePageConfig.helpText && (
                  <div className="mt-2 text-[11px] text-amber-900 bg-amber-50 border border-amber-200 p-2 rounded-lg flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>{activePageConfig.helpText}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Brands Editor */}
      {activeTab === 'brands' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Lini Merek Produk Resmi {localSettings.companyName}
              </h3>
              <p className="text-xs text-slate-500">
                Merek-merek ini akan muncul sebagai pilihan kotak centang di Halaman 6 untuk pemohon reseller.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newBrandInput}
              onChange={(e) => setNewBrandInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddBrand()}
              placeholder="Contoh: PODA Special Salt Series (30ml)..."
              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddBrand}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Tambah Merek</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {localSettings.productBrands.map((brand, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
              >
                <span className="font-medium text-slate-900">{brand}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBrand(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Hapus merek"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Terms & Conditions */}
      {activeTab === 'terms' && (
        <div className="p-4 sm:p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Butir Ketentuan Pendaftaran & Otorisasi Reseller
            </h3>
            <p className="text-xs text-slate-500">
              Poin ketentuan ini ditampilkan pada Halaman 1 dan Halaman 8 formulir pendaftaran.
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newKetentuanInput}
              onChange={(e) => setNewKetentuanInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKetentuan()}
              placeholder="Tambahkan butir ketentuan baru..."
              className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddKetentuan}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Tambah Poin</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {localSettings.ketentuanPoin.map((poin, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="flex-1 text-slate-800 leading-relaxed">{poin}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveKetentuan(idx)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Hapus butir ketentuan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Announcement Banner & Access PIN */}
      {activeTab === 'banner' && (
        <div className="p-4 sm:p-6 space-y-6 max-w-2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Banner Pengumuman Real-time untuk Seluruh Pemohon
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Banner ini akan muncul di bagian paling atas formulir pada seluruh perangkat pemohon secara langsung.
            </p>

            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="bannerEnabled"
                checked={localSettings.announcementBanner?.enabled ?? true}
                onChange={(e) =>
                  setLocalSettings((p) => ({
                    ...p,
                    announcementBanner: {
                      enabled: e.target.checked,
                      text: p.announcementBanner?.text || '',
                      type: p.announcementBanner?.type || 'info',
                    },
                  }))
                }
                className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
              />
              <label htmlFor="bannerEnabled" className="text-xs font-semibold text-slate-800 cursor-pointer">
                Aktifkan Banner Pengumuman di Atas Formulir
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Isi Teks Pengumuman
              </label>
              <textarea
                rows={3}
                value={localSettings.announcementBanner?.text || ''}
                onChange={(e) =>
                  setLocalSettings((p) => ({
                    ...p,
                    announcementBanner: {
                      enabled: p.announcementBanner?.enabled ?? true,
                      text: e.target.value,
                      type: p.announcementBanner?.type || 'info',
                    },
                  }))
                }
                placeholder="Tulis pengumuman resmi..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Tipe Warna Banner
              </label>
              <div className="flex gap-3">
                {(['info', 'warning', 'success'] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="radio"
                      name="bannerType"
                      value={type}
                      checked={(localSettings.announcementBanner?.type || 'info') === type}
                      onChange={() =>
                        setLocalSettings((p) => ({
                          ...p,
                          announcementBanner: {
                            enabled: p.announcementBanner?.enabled ?? true,
                            text: p.announcementBanner?.text || '',
                            type,
                          },
                        }))
                      }
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="capitalize">{type === 'info' ? 'Info (Biru)' : type === 'warning' ? 'Perhatian (Kuning)' : 'Sukses (Hijau)'}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Admin PIN */}
          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                PIN Akses Pengaturan Admin
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              PIN ini digunakan untuk membuka kunci portal pengaturan admin agar terlindung dari akses umum.
            </p>
            <div className="max-w-xs">
              <input
                type="text"
                value={localSettings.adminPin || 'admin123'}
                onChange={(e) => setLocalSettings((p) => ({ ...p, adminPin: e.target.value }))}
                placeholder="PIN Admin..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500 font-mono tracking-wider"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Company Profile */}
      {activeTab === 'company' && (
        <div className="p-4 sm:p-6 space-y-4 max-w-2xl">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Identitas & Kontak Resmi Perusahaan
            </h3>
            <p className="text-xs text-slate-500">
              Digunakan pada kop surat, formulir pendaftaran, dan Surat Penunjukan Reseller resmi.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Nama Resmi Perusahaan
            </label>
            <input
              type="text"
              value={localSettings.companyName}
              onChange={(e) => setLocalSettings((p) => ({ ...p, companyName: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Email Layanan Reseller
              </label>
              <input
                type="email"
                value={localSettings.companyEmail}
                onChange={(e) => setLocalSettings((p) => ({ ...p, companyEmail: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Email Privasi / Legal
              </label>
              <input
                type="email"
                value={localSettings.privacyEmail}
                onChange={(e) => setLocalSettings((p) => ({ ...p, privacyEmail: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Nomor Telepon / WhatsApp CS
              </label>
              <input
                type="text"
                value={localSettings.companyPhone}
                onChange={(e) => setLocalSettings((p) => ({ ...p, companyPhone: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Versi Dokumen Formulir
              </label>
              <input
                type="text"
                value={localSettings.formVersion}
                onChange={(e) => setLocalSettings((p) => ({ ...p, formVersion: e.target.value }))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:border-amber-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
