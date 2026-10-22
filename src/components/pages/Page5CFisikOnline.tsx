import React from 'react';
import { ArrowLeft, ArrowRight, Store, Globe, MapPin, AlertCircle, Info } from 'lucide-react';
import {
  ResellerFormData,
  MarketplacePlatform,
  StatusOperasional,
  StatusOperasionalOnline,
  JawabanKepatuhan,
  JawabanPlatform,
} from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';

interface Page5CFisikOnlineProps {
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

export const Page5CFisikOnline: React.FC<Page5CFisikOnlineProps> = ({
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
          <span>Halaman 5C</span>
          <span>·</span>
          <span>Toko Fisik & Online</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {settings?.pages?.['page-5C']?.title || 'INFORMASI TOKO FISIK DAN TOKO ONLINE'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-5C']?.subtitle ||
            'Hanya ditampilkan apabila pemohon memilih Toko Fisik dan Toko Online. Harap melengkapi data outlet fisik serta akun penjualan online Anda di bawah ini.'}
        </p>
        {settings?.pages?.['page-5C']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-5C'].helpText}</span>
          </div>
        )}
      </div>

      {/* Bagian A: Informasi Toko Fisik */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Store className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            A. INFORMASI TOKO FISIK
          </h3>
        </div>

        {/* 16C */}
        <div>
          <label htmlFor="q16c_nama_toko_fisik" className="block text-sm font-semibold text-slate-800">
            16C. Nama Toko Fisik <span className="text-rose-600">*</span>
          </label>
          <input
            id="q16c_nama_toko_fisik"
            type="text"
            value={formData.q16c_nama_toko_fisik}
            onChange={(e) => updateFormData({ q16c_nama_toko_fisik: e.target.value })}
            placeholder="Nama gerai toko fisik"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q16c_nama_toko_fisik
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q16c_nama_toko_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q16c_nama_toko_fisik}
            </p>
          )}
        </div>

        {/* 17C */}
        <div>
          <label htmlFor="q17c_alamat_toko_fisik" className="block text-sm font-semibold text-slate-800">
            17C. Alamat Lengkap Toko Fisik <span className="text-rose-600">*</span>
          </label>
          <textarea
            id="q17c_alamat_toko_fisik"
            rows={3}
            value={formData.q17c_alamat_toko_fisik}
            onChange={(e) => updateFormData({ q17c_alamat_toko_fisik: e.target.value })}
            placeholder="Alamat toko fisik terinci"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q17c_alamat_toko_fisik
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q17c_alamat_toko_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q17c_alamat_toko_fisik}
            </p>
          )}
        </div>

        {/* 18C */}
        <div>
          <label htmlFor="q18c_maps_toko_fisik" className="block text-sm font-semibold text-slate-800">
            18C. Link Lokasi Google Maps <span className="text-rose-600">*</span>
          </label>
          <div className="relative">
            <input
              id="q18c_maps_toko_fisik"
              type="text"
              value={formData.q18c_maps_toko_fisik}
              onChange={(e) => updateFormData({ q18c_maps_toko_fisik: e.target.value })}
              placeholder="https://maps.app.goo.gl/..."
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q18c_maps_toko_fisik
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          {errors.q18c_maps_toko_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q18c_maps_toko_fisik}
            </p>
          )}
        </div>

        {/* 19C & 20C */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="q19c_penanggung_jawab_fisik" className="block text-sm font-semibold text-slate-800">
              19C. Nama Penanggung Jawab Operasional <span className="text-rose-600">*</span>
            </label>
            <input
              id="q19c_penanggung_jawab_fisik"
              type="text"
              value={formData.q19c_penanggung_jawab_fisik}
              onChange={(e) => updateFormData({ q19c_penanggung_jawab_fisik: e.target.value })}
              placeholder="Nama penanggung jawab outlet"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q19c_penanggung_jawab_fisik
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q19c_penanggung_jawab_fisik && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q19c_penanggung_jawab_fisik}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="q20c_whatsapp_toko_fisik" className="block text-sm font-semibold text-slate-800">
              20C. Nomor WhatsApp Toko <span className="text-rose-600">*</span>
            </label>
            <input
              id="q20c_whatsapp_toko_fisik"
              type="tel"
              value={formData.q20c_whatsapp_toko_fisik}
              onChange={(e) => updateFormData({ q20c_whatsapp_toko_fisik: e.target.value })}
              placeholder="081234567890"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q20c_whatsapp_toko_fisik
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q20c_whatsapp_toko_fisik && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q20c_whatsapp_toko_fisik}
              </p>
            )}
          </div>
        </div>

        {/* 21C */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            21C. Status Operasional Toko Fisik <span className="text-rose-600">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {(['Sudah beroperasi', 'Belum beroperasi'] as StatusOperasional[]).map((val) => (
              <label
                key={val}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  formData.q21c_status_operasional_fisik === val
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q21c_status_operasional_fisik"
                  checked={formData.q21c_status_operasional_fisik === val}
                  onChange={() => updateFormData({ q21c_status_operasional_fisik: val })}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm">{val}</span>
              </label>
            ))}
          </div>
          {errors.q21c_status_operasional_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q21c_status_operasional_fisik}
            </p>
          )}
        </div>

        {/* 22C */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            22C. Apakah Lokasi Memenuhi Ketentuan Penjualan Rokok Elektronik? <span className="text-rose-600">*</span>
          </label>
          <div className="space-y-2">
            {(['Ya', 'Tidak', 'Belum dapat memastikan'] as JawabanKepatuhan[]).map((val) => (
              <label
                key={val}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.q22c_kepatuhan_lokasi_fisik === val
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q22c_kepatuhan_lokasi_fisik"
                  checked={formData.q22c_kepatuhan_lokasi_fisik === val}
                  onChange={() => updateFormData({ q22c_kepatuhan_lokasi_fisik: val })}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-slate-800">{val}</span>
              </label>
            ))}
          </div>
          {errors.q22c_kepatuhan_lokasi_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q22c_kepatuhan_lokasi_fisik}
            </p>
          )}
        </div>
      </div>

      {/* Bagian B: Informasi Toko Online */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Globe className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            B. INFORMASI TOKO ONLINE
          </h3>
        </div>

        {/* 23C */}
        <div>
          <label htmlFor="q23c_nama_toko_online" className="block text-sm font-semibold text-slate-800">
            23C. Nama Toko Online <span className="text-rose-600">*</span>
          </label>
          <input
            id="q23c_nama_toko_online"
            type="text"
            value={formData.q23c_nama_toko_online}
            onChange={(e) => updateFormData({ q23c_nama_toko_online: e.target.value })}
            placeholder="Nama toko di marketplace"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q23c_nama_toko_online
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q23c_nama_toko_online && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q23c_nama_toko_online}
            </p>
          )}
        </div>

        {/* 24C */}
        <div>
          <label htmlFor="q24c_platform_online" className="block text-sm font-semibold text-slate-800">
            24C. Marketplace atau Platform Penjualan <span className="text-rose-600">*</span>
          </label>
          <select
            id="q24c_platform_online"
            value={formData.q24c_platform_online}
            onChange={(e) => updateFormData({ q24c_platform_online: e.target.value as MarketplacePlatform })}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 transition-colors ${
              errors.q24c_platform_online
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
          {errors.q24c_platform_online && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q24c_platform_online}
            </p>
          )}
        </div>

        {/* 25C & 26C */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="q25c_link_online" className="block text-sm font-semibold text-slate-800">
              25C. Link/URL Toko Online <span className="text-rose-600">*</span>
            </label>
            <input
              id="q25c_link_online"
              type="text"
              value={formData.q25c_link_online}
              onChange={(e) => updateFormData({ q25c_link_online: e.target.value })}
              placeholder="https://..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q25c_link_online
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q25c_link_online && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q25c_link_online}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="q26c_seller_id_online" className="block text-sm font-semibold text-slate-800">
              26C. Seller ID <span className="text-xs font-normal text-slate-500">(Opsional)</span>
            </label>
            <input
              id="q26c_seller_id_online"
              type="text"
              value={formData.q26c_seller_id_online}
              onChange={(e) => updateFormData({ q26c_seller_id_online: e.target.value })}
              placeholder="ID Akun Penjual"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-100 transition-colors"
            />
          </div>
        </div>

        {/* 27C */}
        <div>
          <label htmlFor="q27c_nama_pemilik_seller" className="block text-sm font-semibold text-slate-800">
            27C. Nama Pemilik Akun Seller <span className="text-rose-600">*</span>
          </label>
          <input
            id="q27c_nama_pemilik_seller"
            type="text"
            value={formData.q27c_nama_pemilik_seller}
            onChange={(e) => updateFormData({ q27c_nama_pemilik_seller: e.target.value })}
            placeholder="Nama resmi pemilik akun toko online"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q27c_nama_pemilik_seller
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q27c_nama_pemilik_seller && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q27c_nama_pemilik_seller}
            </p>
          )}
        </div>

        {/* 28C */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            28C. Status Operasional Toko Online <span className="text-rose-600">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {(['Sudah aktif', 'Belum aktif'] as StatusOperasionalOnline[]).map((val) => (
              <label
                key={val}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  formData.q28c_status_operasional_online === val
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q28c_status_operasional_online"
                  checked={formData.q28c_status_operasional_online === val}
                  onChange={() => updateFormData({ q28c_status_operasional_online: val })}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm">{val}</span>
              </label>
            ))}
          </div>
          {errors.q28c_status_operasional_online && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q28c_status_operasional_online}
            </p>
          )}
        </div>

        {/* 29C & 30C */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              29C. Apakah Platform Memperbolehkan Penjualan Produk Rokok Elektronik yang Didaftarkan?{' '}
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
                    formData.q29c_kepatuhan_platform_online === val
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="q29c_kepatuhan_platform_online"
                    checked={formData.q29c_kepatuhan_platform_online === val}
                    onChange={() => updateFormData({ q29c_kepatuhan_platform_online: val })}
                    className="mt-0.5 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-slate-800">{val}</span>
                </label>
              ))}
            </div>
            {errors.q29c_kepatuhan_platform_online && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q29c_kepatuhan_platform_online}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              30C. Apakah Sistem Penjualan Online Memiliki Verifikasi Usia Sesuai Ketentuan yang Berlaku?{' '}
              <span className="text-rose-600">*</span>
            </label>
            <div className="space-y-2">
              {(['Ya', 'Tidak', 'Belum dapat memastikan'] as JawabanKepatuhan[]).map((val) => (
                <label
                  key={val}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.q30c_verifikasi_usia_online === val
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="q30c_verifikasi_usia_online"
                    checked={formData.q30c_verifikasi_usia_online === val}
                    onChange={() => updateFormData({ q30c_verifikasi_usia_online: val })}
                    className="mt-0.5 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-slate-800">{val}</span>
                </label>
              ))}
            </div>
            {errors.q30c_verifikasi_usia_online && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q30c_verifikasi_usia_online}
              </p>
            )}
          </div>
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
