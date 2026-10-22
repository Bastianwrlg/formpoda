import React from 'react';
import { ArrowLeft, ArrowRight, Building, AlertCircle } from 'lucide-react';
import { ResellerFormData, BentukUsaha } from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';
import { INDONESIA_PROVINCES } from '../../utils/constants';

interface Page3UsahaProps {
  formData: ResellerFormData;
  updateFormData: (updates: Partial<ResellerFormData>) => void;
  errors: ValidationErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: any;
}

const BENTUK_USAHA_OPTIONS: BentukUsaha[] = [
  'Usaha perseorangan',
  'Perseroan Terbatas (PT)',
  'Persekutuan Komanditer (CV)',
  'Koperasi',
  'Bentuk usaha lainnya',
];

export const Page3Usaha: React.FC<Page3UsahaProps> = ({
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
          <span>Halaman 3 dari 9</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {settings?.pages?.['page-3']?.title || 'IDENTITAS USAHA'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-3']?.subtitle ||
            `Isi sesuai identitas usaha dan dokumen legalitas yang berlaku. Informasi ini akan digunakan untuk pemeriksaan identitas dan legalitas usaha Anda oleh ${settings?.companyName || 'PT. PODA E-LIQUID COMPANY'}.`}
        </p>
        {settings?.pages?.['page-3']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-3'].helpText}</span>
          </div>
        )}
      </div>

      {/* Form Questions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Q8 */}
        <div>
          <label htmlFor="q8_nama_toko" className="block text-sm font-semibold text-slate-800">
            8. Nama Toko atau Nama Dagang <span className="text-rose-600">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-1.5">Contoh: ABC Vape Store / Poda Cloud Lounge</p>
          <input
            id="q8_nama_toko"
            type="text"
            value={formData.q8_nama_toko}
            onChange={(e) => updateFormData({ q8_nama_toko: e.target.value })}
            placeholder="ABC Vape Store"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q8_nama_toko
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q8_nama_toko && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q8_nama_toko}
            </p>
          )}
        </div>

        {/* Q9 */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            9. Bentuk Usaha <span className="text-rose-600">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
            {BENTUK_USAHA_OPTIONS.map((bentuk) => (
              <label
                key={bentuk}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.q9_bentuk_usaha === bentuk
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q9_bentuk_usaha"
                  checked={formData.q9_bentuk_usaha === bentuk}
                  onChange={() => updateFormData({ q9_bentuk_usaha: bentuk })}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-slate-800">{bentuk}</span>
              </label>
            ))}
          </div>
          {errors.q9_bentuk_usaha && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q9_bentuk_usaha}
            </p>
          )}
        </div>

        {/* Q10 & Q11 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="q10_nama_pemilik_usaha" className="block text-sm font-semibold text-slate-800">
              10. Nama Pemilik Usaha/Badan Usaha <span className="text-rose-600">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-1.5">
              Untuk usaha perseorangan, isi nama pemilik. Untuk badan usaha, isi nama sesuai dokumen legalitas.
            </p>
            <input
              id="q10_nama_pemilik_usaha"
              type="text"
              value={formData.q10_nama_pemilik_usaha}
              onChange={(e) => updateFormData({ q10_nama_pemilik_usaha: e.target.value })}
              placeholder="Nama pemilik atau PT/CV"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q10_nama_pemilik_usaha
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q10_nama_pemilik_usaha && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q10_nama_pemilik_usaha}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="q11_nib" className="block text-sm font-semibold text-slate-800">
              11. Nomor Induk Berusaha (NIB) <span className="text-rose-600">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-1.5">Isi 13 digit nomor sesuai dokumen NIB usaha.</p>
            <input
              id="q11_nib"
              type="text"
              maxLength={20}
              value={formData.q11_nib}
              onChange={(e) => updateFormData({ q11_nib: e.target.value })}
              placeholder="Contoh: 1234567890123"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q11_nib
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q11_nib && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q11_nib}
              </p>
            )}
          </div>
        </div>

        {/* Q12 */}
        <div>
          <label htmlFor="q12_alamat_usaha" className="block text-sm font-semibold text-slate-800">
            12. Alamat Usaha Terdaftar <span className="text-rose-600">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-1.5">
            Isi alamat usaha sesuai dokumen legalitas atau alamat usaha yang tercatat secara resmi.
          </p>
          <textarea
            id="q12_alamat_usaha"
            rows={3}
            value={formData.q12_alamat_usaha}
            onChange={(e) => updateFormData({ q12_alamat_usaha: e.target.value })}
            placeholder="Jalan, Nomor, RT/RW, Kelurahan, Kecamatan"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q12_alamat_usaha
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q12_alamat_usaha && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q12_alamat_usaha}
            </p>
          )}
        </div>

        {/* Q13 & Q14 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="q13_kota_kabupaten" className="block text-sm font-semibold text-slate-800">
              13. Kota/Kabupaten <span className="text-rose-600">*</span>
            </label>
            <input
              id="q13_kota_kabupaten"
              type="text"
              value={formData.q13_kota_kabupaten}
              onChange={(e) => updateFormData({ q13_kota_kabupaten: e.target.value })}
              placeholder="Contoh: Jakarta Selatan / Surabaya"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q13_kota_kabupaten
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q13_kota_kabupaten && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q13_kota_kabupaten}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="q14_provinsi" className="block text-sm font-semibold text-slate-800">
              14. Provinsi <span className="text-rose-600">*</span>
            </label>
            <select
              id="q14_provinsi"
              value={formData.q14_provinsi}
              onChange={(e) => updateFormData({ q14_provinsi: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 transition-colors ${
                errors.q14_provinsi
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            >
              <option value="">-- Pilih Provinsi --</option>
              {INDONESIA_PROVINCES.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
            {errors.q14_provinsi && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q14_provinsi}
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
          <span>Berikutnya</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
