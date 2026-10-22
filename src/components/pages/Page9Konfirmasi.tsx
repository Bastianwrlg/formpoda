import React from 'react';
import { ArrowLeft, Send, AlertCircle, FileCheck, ShieldAlert } from 'lucide-react';
import { ResellerFormData } from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';

interface Page9KonfirmasiProps {
  formData: ResellerFormData;
  updateFormData: (updates: Partial<ResellerFormData>) => void;
  errors: ValidationErrors;
  onSubmit: () => void;
  onPrev: () => void;
  isSubmitting: boolean;
  settings?: any;
}

export const Page9Konfirmasi: React.FC<Page9KonfirmasiProps> = ({
  formData,
  updateFormData,
  errors,
  onSubmit,
  onPrev,
  isSubmitting,
  settings,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
          <span>Halaman 9 dari 9</span>
          <span>·</span>
          <span>Tahap Terakhir</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
          {settings?.pages?.['page-9']?.title || 'PERNYATAAN DAN KONFIRMASI PEMOHON'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-9']?.subtitle ||
            'Pernyataan akhir sebelum pengiriman formulir pendaftaran reseller.'}
        </p>
        {settings?.pages?.['page-9']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-9'].helpText}</span>
          </div>
        )}
      </div>

      {/* Pernyataan 5 Poin (Clean Light Theme) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs sm:text-sm uppercase tracking-wide pb-2 border-b border-slate-100">
          <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0" />
          <span>Pernyataan Akhir Sebelum Pengiriman Formulir</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Saya yang mengajukan permohonan ini menyatakan dengan sungguh-sungguh bahwa:
        </p>

        <ol className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-slate-700">
          <li className="flex items-start gap-2.5 sm:gap-3">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <span className="leading-snug">
              Saya adalah pemilik usaha, pengurus yang berwenang, atau pihak yang sah diberi kuasa untuk mewakili usaha yang didaftarkan.
            </span>
          </li>
          <li className="flex items-start gap-2.5 sm:gap-3">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <span className="leading-snug">
              Seluruh informasi dan dokumen yang disampaikan dalam permohonan ini adalah benar dan dapat dipertanggungjawabkan.
            </span>
          </li>
          <li className="flex items-start gap-2.5 sm:gap-3">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <span className="leading-snug">
              Saya telah membaca, memahami, dan menyetujui Ketentuan Reseller yang tercantum dalam permohonan pendaftaran.
            </span>
          </li>
          <li className="flex items-start gap-2.5 sm:gap-3">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <span className="leading-snug">
              Saya memahami bahwa pengajuan ini tidak otomatis memberikan hak atau status sebagai reseller sampai diterbitkannya persetujuan tertulis oleh perusahaan.
            </span>
          </li>
          <li className="flex items-start gap-2.5 sm:gap-3">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              5
            </span>
            <span className="leading-snug">
              Saya bersedia mengikuti proses pemeriksaan dan mempertanggungjawabkan informasi maupun tindakan saya sesuai ketentuan hukum yang berlaku.
            </span>
          </li>
        </ol>
      </div>

      {/* Konfirmasi Akhir Fields */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
          Konfirmasi Akhir Pemohon
        </h3>

        {/* 44 */}
        <div>
          <label htmlFor="q44_nama_pernyataan" className="block text-xs sm:text-sm font-semibold text-slate-800">
            44. Nama Lengkap Pihak yang Memberikan Pernyataan <span className="text-rose-600">*</span>
          </label>
          <p className="text-[11px] sm:text-xs text-slate-500 mb-1.5">
            Isi nama lengkap pemohon yang memiliki kewenangan untuk mengajukan permohonan ini.
          </p>
          <input
            id="q44_nama_pernyataan"
            type="text"
            value={formData.q44_nama_pernyataan}
            onChange={(e) => updateFormData({ q44_nama_pernyataan: e.target.value })}
            placeholder="Contoh: Budi Santoso"
            className={`w-full px-3.5 py-3 rounded-xl border text-base sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors min-h-[44px] ${
              errors.q44_nama_pernyataan
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q44_nama_pernyataan && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.q44_nama_pernyataan}
            </p>
          )}
        </div>

        {/* 45 */}
        <label
          className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
            formData.q45_pernyataan_kebenaran
              ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <input
            type="checkbox"
            checked={formData.q45_pernyataan_kebenaran}
            onChange={(e) => updateFormData({ q45_pernyataan_kebenaran: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 shrink-0"
          />
          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-900 block">
              45. Pernyataan Kebenaran dan Kewenangan <span className="text-rose-600">*</span>
            </span>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              Saya menyatakan bahwa saya memiliki kewenangan yang sah untuk mengajukan permohonan ini, seluruh informasi yang saya berikan benar, dan saya memahami akibat hukum dari pernyataan yang tidak benar.
            </p>
          </div>
        </label>
        {errors.q45_pernyataan_kebenaran && (
          <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.q45_pernyataan_kebenaran}
          </p>
        )}

        {/* 46 */}
        <label
          className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-all ${
            formData.q46_persetujuan_verifikasi
              ? 'border-amber-500 bg-amber-50/50 shadow-2xs'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <input
            type="checkbox"
            checked={formData.q46_persetujuan_verifikasi}
            onChange={(e) => updateFormData({ q46_persetujuan_verifikasi: e.target.checked })}
            className="w-4 h-4 mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500 shrink-0"
          />
          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-900 block">
              46. Persetujuan Konfirmasi dan Verifikasi Lanjutan <span className="text-rose-600">*</span>
            </span>
            <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
              Saya bersedia menerima konfirmasi melalui kontak yang didaftarkan, memberikan bukti kewenangan tambahan apabila diperlukan, dan memahami bahwa permohonan belum disetujui sebelum proses verifikasi perusahaan selesai.
            </p>
          </div>
        </label>
        {errors.q46_persetujuan_verifikasi && (
          <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.q46_persetujuan_verifikasi}
          </p>
        )}

        {/* Konfirmasi Sebelum Pengiriman Banner */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 sm:p-4 text-xs text-amber-950 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-amber-950 font-bold mb-0.5">KONFIRMASI SEBELUM PENGIRIMAN</strong>
            <span className="text-slate-700 text-[11px] sm:text-xs leading-relaxed">
              Pastikan seluruh informasi telah diisi dengan benar. Data akan tersimpan secara otomatis dan permanen di database PT. PODA E-LIQUID COMPANY. Perusahaan dapat menolak permohonan apabila terdapat dokumen yang tidak sah atau informasi yang tidak dapat diverifikasi.
            </span>
          </div>
        </div>
      </div>

      {/* Navigation & Submit Action */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-5 py-3 min-h-[46px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-2xs cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-7 py-3.5 min-h-[48px] bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-60"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Menyimpan ke Database...' : 'KIRIM PENDAFTARAN'}</span>
        </button>
      </div>
    </div>
  );
};
