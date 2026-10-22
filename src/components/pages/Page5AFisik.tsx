import React from 'react';
import { ArrowLeft, ArrowRight, MapPin, Store, AlertCircle } from 'lucide-react';
import { ResellerFormData, StatusOperasional, JawabanKepatuhan } from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';

interface Page5AFisikProps {
  formData: ResellerFormData;
  updateFormData: (updates: Partial<ResellerFormData>) => void;
  errors: ValidationErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: any;
}

export const Page5AFisik: React.FC<Page5AFisikProps> = ({
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
          <span>Halaman 5A</span>
          <span>·</span>
          <span>Khusus Toko Fisik</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Store className="w-6 h-6 text-amber-600" />
          {settings?.pages?.['page-5A']?.title || 'INFORMASI TOKO FISIK'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-5A']?.subtitle ||
            'Halaman ini khusus diisi oleh pemohon yang mendaftarkan lokasi toko fisik / offline store.'}
        </p>
        {settings?.pages?.['page-5A']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-5A'].helpText}</span>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* 16A */}
        <div>
          <label htmlFor="q16a_nama_toko_fisik" className="block text-sm font-semibold text-slate-800">
            16A. Nama Toko Fisik <span className="text-rose-600">*</span>
          </label>
          <input
            id="q16a_nama_toko_fisik"
            type="text"
            value={formData.q16a_nama_toko_fisik}
            onChange={(e) => updateFormData({ q16a_nama_toko_fisik: e.target.value })}
            placeholder="Contoh: Vape Store Kemang Branch"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q16a_nama_toko_fisik
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q16a_nama_toko_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q16a_nama_toko_fisik}
            </p>
          )}
        </div>

        {/* 17A */}
        <div>
          <label htmlFor="q17a_alamat_toko_fisik" className="block text-sm font-semibold text-slate-800">
            17A. Alamat Lengkap Lokasi Toko <span className="text-rose-600">*</span>
          </label>
          <textarea
            id="q17a_alamat_toko_fisik"
            rows={3}
            value={formData.q17a_alamat_toko_fisik}
            onChange={(e) => updateFormData({ q17a_alamat_toko_fisik: e.target.value })}
            placeholder="Alamat gerai/outlet fisik lengkap beserta patokan jalan"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q17a_alamat_toko_fisik
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q17a_alamat_toko_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q17a_alamat_toko_fisik}
            </p>
          )}
        </div>

        {/* 18A */}
        <div>
          <label htmlFor="q18a_maps_toko_fisik" className="block text-sm font-semibold text-slate-800">
            18A. Link Lokasi Google Maps <span className="text-rose-600">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-1.5">Tempelkan tautan lokasi toko yang benar.</p>
          <div className="relative">
            <input
              id="q18a_maps_toko_fisik"
              type="text"
              value={formData.q18a_maps_toko_fisik}
              onChange={(e) => updateFormData({ q18a_maps_toko_fisik: e.target.value })}
              placeholder="https://maps.app.goo.gl/..."
              className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q18a_maps_toko_fisik
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          {errors.q18a_maps_toko_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q18a_maps_toko_fisik}
            </p>
          )}
        </div>

        {/* 19A & 20A */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="q19a_penanggung_jawab_fisik" className="block text-sm font-semibold text-slate-800">
              19A. Nama Penanggung Jawab Operasional Toko <span className="text-rose-600">*</span>
            </label>
            <input
              id="q19a_penanggung_jawab_fisik"
              type="text"
              value={formData.q19a_penanggung_jawab_fisik}
              onChange={(e) => updateFormData({ q19a_penanggung_jawab_fisik: e.target.value })}
              placeholder="Nama Store Manager / Kepala Toko"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q19a_penanggung_jawab_fisik
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q19a_penanggung_jawab_fisik && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q19a_penanggung_jawab_fisik}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="q20a_whatsapp_toko_fisik" className="block text-sm font-semibold text-slate-800">
              20A. Nomor WhatsApp Toko <span className="text-rose-600">*</span>
            </label>
            <input
              id="q20a_whatsapp_toko_fisik"
              type="tel"
              value={formData.q20a_whatsapp_toko_fisik}
              onChange={(e) => updateFormData({ q20a_whatsapp_toko_fisik: e.target.value })}
              placeholder="081234567890"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q20a_whatsapp_toko_fisik
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q20a_whatsapp_toko_fisik && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q20a_whatsapp_toko_fisik}
              </p>
            )}
          </div>
        </div>

        {/* 21A */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            21A. Apakah Toko Saat Ini Sudah Beroperasi? <span className="text-rose-600">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {(['Sudah beroperasi', 'Belum beroperasi'] as StatusOperasional[]).map((val) => (
              <label
                key={val}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  formData.q21a_status_operasional_fisik === val
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q21a_status_operasional_fisik"
                  checked={formData.q21a_status_operasional_fisik === val}
                  onChange={() => updateFormData({ q21a_status_operasional_fisik: val })}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm">{val}</span>
              </label>
            ))}
          </div>
          {errors.q21a_status_operasional_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q21a_status_operasional_fisik}
            </p>
          )}
        </div>

        {/* 22A */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            22A. Apakah Lokasi Toko Memenuhi Ketentuan Penjualan Rokok Elektronik yang Berlaku?{' '}
            <span className="text-rose-600">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Petunjuk: Jawaban akan diperiksa kembali oleh perusahaan, termasuk ketentuan jarak lokasi toko dari
            satuan pendidikan dan tempat bermain anak.
          </p>
          <div className="space-y-2">
            {(['Ya', 'Tidak', 'Belum dapat memastikan'] as JawabanKepatuhan[]).map((val) => (
              <label
                key={val}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.q22a_kepatuhan_lokasi_fisik === val
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q22a_kepatuhan_lokasi_fisik"
                  checked={formData.q22a_kepatuhan_lokasi_fisik === val}
                  onChange={() => updateFormData({ q22a_kepatuhan_lokasi_fisik: val })}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-slate-800">{val}</span>
              </label>
            ))}
          </div>
          {errors.q22a_kepatuhan_lokasi_fisik && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q22a_kepatuhan_lokasi_fisik}
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
