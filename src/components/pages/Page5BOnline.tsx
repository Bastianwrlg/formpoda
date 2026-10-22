import React from 'react';
import { ArrowLeft, ArrowRight, Globe, AlertCircle, Info } from 'lucide-react';
import {
  ResellerFormData,
  MarketplacePlatform,
  StatusOperasionalOnline,
  JawabanPlatform,
  JawabanKepatuhan,
} from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';

interface Page5BOnlineProps {
  formData: ResellerFormData;
  updateFormData: (updates: Partial<ResellerFormData>) => void;
  errors: ValidationErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: any;
}

const MARKETPLACE_OPTIONS: MarketplacePlatform[] = [
  'Shopee',
  'Tokopedia',
  'TikTok Shop',
  'Lazada',
  'Website toko sendiri',
  'Platform lainnya',
];

export const Page5BOnline: React.FC<Page5BOnlineProps> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
          <span>Halaman 5B</span>
          <span>·</span>
          <span>Khusus Toko Online</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Globe className="w-6 h-6 text-amber-600" />
          {settings?.pages?.['page-5B']?.title || 'INFORMASI TOKO ONLINE'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-5B']?.subtitle ||
            'Halaman ini hanya ditampilkan kepada pemohon yang memilih Toko Online Saja.'}
        </p>
        {settings?.pages?.['page-5B']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-5B'].helpText}</span>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* 16B */}
        <div>
          <label htmlFor="q16b_nama_toko_online" className="block text-sm font-semibold text-slate-800">
            16B. Nama Toko Online <span className="text-rose-600">*</span>
          </label>
          <input
            id="q16b_nama_toko_online"
            type="text"
            value={formData.q16b_nama_toko_online}
            onChange={(e) => updateFormData({ q16b_nama_toko_online: e.target.value })}
            placeholder="Contoh: Official Vape Online Store"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q16b_nama_toko_online
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q16b_nama_toko_online && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q16b_nama_toko_online}
            </p>
          )}
        </div>

        {/* 17B */}
        <div>
          <label htmlFor="q17b_platform_online" className="block text-sm font-semibold text-slate-800">
            17B. Marketplace atau Platform Penjualan <span className="text-rose-600">*</span>
          </label>
          <select
            id="q17b_platform_online"
            value={formData.q17b_platform_online}
            onChange={(e) => updateFormData({ q17b_platform_online: e.target.value as MarketplacePlatform })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 transition-colors ${
              errors.q17b_platform_online
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          >
            <option value="">-- Pilih Marketplace / Platform --</option>
            {MARKETPLACE_OPTIONS.map((plat) => (
              <option key={plat} value={plat}>
                {plat}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              Catatan: Daftar ini hanya untuk mengidentifikasi platform yang digunakan. Pencantuman platform bukan berarti
              perusahaan menyatakan bahwa platform tersebut memperbolehkan penjualan rokok elektronik.
            </span>
          </p>
          {errors.q17b_platform_online && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q17b_platform_online}
            </p>
          )}
        </div>

        {/* 18B & 19B */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="q18b_link_online" className="block text-sm font-semibold text-slate-800">
              18B. Link/URL Toko Online <span className="text-rose-600">*</span>
            </label>
            <input
              id="q18b_link_online"
              type="text"
              value={formData.q18b_link_online}
              onChange={(e) => updateFormData({ q18b_link_online: e.target.value })}
              placeholder="https://shopee.co.id/namatoko"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q18b_link_online
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q18b_link_online && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q18b_link_online}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="q19b_seller_id_online" className="block text-sm font-semibold text-slate-800">
              19B. Seller ID atau Identitas Akun <span className="text-xs font-normal text-slate-500">(Opsional)</span>
            </label>
            <input
              id="q19b_seller_id_online"
              type="text"
              value={formData.q19b_seller_id_online}
              onChange={(e) => updateFormData({ q19b_seller_id_online: e.target.value })}
              placeholder="Username seller / ID Toko"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-100 transition-colors"
            />
          </div>
        </div>

        {/* 20B */}
        <div>
          <label htmlFor="q20b_nama_pemilik_seller" className="block text-sm font-semibold text-slate-800">
            20B. Nama Pemilik Akun Seller <span className="text-rose-600">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-1.5">
            Isi nama pihak atau badan usaha yang terdaftar sebagai pemilik akun penjual.
          </p>
          <input
            id="q20b_nama_pemilik_seller"
            type="text"
            value={formData.q20b_nama_pemilik_seller}
            onChange={(e) => updateFormData({ q20b_nama_pemilik_seller: e.target.value })}
            placeholder="Nama resmi pemilik akun"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q20b_nama_pemilik_seller
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q20b_nama_pemilik_seller && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q20b_nama_pemilik_seller}
            </p>
          )}
        </div>

        {/* 21B */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            21B. Apakah Akun Toko Sudah Aktif Berjualan? <span className="text-rose-600">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {(['Sudah aktif', 'Belum aktif'] as StatusOperasionalOnline[]).map((val) => (
              <label
                key={val}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  formData.q21b_status_operasional_online === val
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q21b_status_operasional_online"
                  checked={formData.q21b_status_operasional_online === val}
                  onChange={() => updateFormData({ q21b_status_operasional_online: val })}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm">{val}</span>
              </label>
            ))}
          </div>
          {errors.q21b_status_operasional_online && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q21b_status_operasional_online}
            </p>
          )}
        </div>

        {/* 22B */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            22B. Apakah Platform yang Digunakan Memperbolehkan Penjualan Produk Rokok Elektronik yang Didaftarkan?{' '}
            <span className="text-rose-600">*</span>
          </label>
          <div className="space-y-2">
            {(
              [
                'Ya, berdasarkan ketentuan platform yang berlaku',
                'Tidak',
                'Belum dapat memastikan',
              ] as JawabanPlatform[]
            ).map((val) => (
              <label
                key={val}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.q22b_kepatuhan_platform_online === val
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q22b_kepatuhan_platform_online"
                  checked={formData.q22b_kepatuhan_platform_online === val}
                  onChange={() => updateFormData({ q22b_kepatuhan_platform_online: val })}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-slate-800">{val}</span>
              </label>
            ))}
          </div>
          {errors.q22b_kepatuhan_platform_online && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q22b_kepatuhan_platform_online}
            </p>
          )}
        </div>

        {/* 23B */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            23B. Apakah Sistem Penjualan Online Memiliki Verifikasi Usia Pembeli Sesuai Ketentuan yang Berlaku?{' '}
            <span className="text-rose-600">*</span>
          </label>
          <div className="space-y-2">
            {(['Ya', 'Tidak', 'Belum dapat memastikan'] as JawabanKepatuhan[]).map((val) => (
              <label
                key={val}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.q23b_verifikasi_usia_online === val
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q23b_verifikasi_usia_online"
                  checked={formData.q23b_verifikasi_usia_online === val}
                  onChange={() => updateFormData({ q23b_verifikasi_usia_online: val })}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-slate-800">{val}</span>
              </label>
            ))}
          </div>
          {errors.q23b_verifikasi_usia_online && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q23b_verifikasi_usia_online}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <span>Lanjut ke Halaman 6</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
