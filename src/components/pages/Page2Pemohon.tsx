import React from 'react';
import { ArrowLeft, ArrowRight, UserCheck, CheckSquare, AlertCircle } from 'lucide-react';
import { ResellerFormData, HubunganPemohon } from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';

interface Page2PemohonProps {
  formData: ResellerFormData;
  updateFormData: (updates: Partial<ResellerFormData>) => void;
  errors: ValidationErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: any;
}

const HUBUNGAN_OPTIONS: HubunganPemohon[] = [
  'Pemilik usaha perseorangan',
  'Direktur/pengurus badan usaha yang berwenang',
  'Penerima kuasa dari pemilik atau pengurus yang berwenang',
];

export const Page2Pemohon: React.FC<Page2PemohonProps> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  const handleSameAsApplicant = (checked: boolean) => {
    if (checked) {
      updateFormData({
        pemilik_sama_dengan_pemohon: true,
        q5_nama_pemilik: formData.q1_nama_pemohon,
        q6_whatsapp_pemilik: formData.q3_whatsapp_pemohon,
        q7_email_pemilik: formData.q4_email_pemohon,
      });
    } else {
      updateFormData({ pemilik_sama_dengan_pemohon: false });
    }
  };

  const handleApplicantNameChange = (val: string) => {
    if (formData.pemilik_sama_dengan_pemohon) {
      updateFormData({ q1_nama_pemohon: val, q5_nama_pemilik: val });
    } else {
      updateFormData({ q1_nama_pemohon: val });
    }
  };

  const handleApplicantWaChange = (val: string) => {
    if (formData.pemilik_sama_dengan_pemohon) {
      updateFormData({ q3_whatsapp_pemohon: val, q6_whatsapp_pemilik: val });
    } else {
      updateFormData({ q3_whatsapp_pemohon: val });
    }
  };

  const handleApplicantEmailChange = (val: string) => {
    if (formData.pemilik_sama_dengan_pemohon) {
      updateFormData({ q4_email_pemohon: val, q7_email_pemilik: val });
    } else {
      updateFormData({ q4_email_pemohon: val });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
          <span>Halaman 2 dari 9</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {settings?.pages?.['page-2']?.title || 'IDENTITAS PEMOHON'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-2']?.subtitle ||
            'Silakan mengisi informasi pihak yang mengajukan pendaftaran ini. Apabila Anda membantu pemilik usaha melakukan pendaftaran, Anda harus memiliki kewenangan yang sah untuk mengajukan permohonan dan memberikan informasi kontak pemilik atau pengurus yang berwenang untuk keperluan konfirmasi.'}
        </p>
        {settings?.pages?.['page-2']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-2'].helpText}</span>
          </div>
        )}
      </div>

      {/* Form Questions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Q1 */}
        <div>
          <label htmlFor="q1_nama_pemohon" className="block text-sm font-semibold text-slate-800">
            1. Nama Lengkap Pemohon <span className="text-rose-600">*</span>
          </label>
          <p className="text-xs text-slate-500 mb-1.5">Isi nama lengkap sesuai identitas resmi.</p>
          <input
            id="q1_nama_pemohon"
            type="text"
            value={formData.q1_nama_pemohon}
            onChange={(e) => handleApplicantNameChange(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
              errors.q1_nama_pemohon
                ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
            }`}
          />
          {errors.q1_nama_pemohon && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q1_nama_pemohon}
            </p>
          )}
        </div>

        {/* Q2 */}
        <div>
          <label className="block text-sm font-semibold text-slate-800 mb-1">
            2. Hubungan Pemohon dengan Usaha <span className="text-rose-600">*</span>
          </label>
          <div className="space-y-2.5 mt-2">
            {HUBUNGAN_OPTIONS.map((opt) => (
              <label
                key={opt}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.q2_hubungan_pemohon === opt
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q2_hubungan_pemohon"
                  checked={formData.q2_hubungan_pemohon === opt}
                  onChange={() => updateFormData({ q2_hubungan_pemohon: opt })}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-slate-800">{opt}</span>
              </label>
            ))}
          </div>
          {errors.q2_hubungan_pemohon && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q2_hubungan_pemohon}
            </p>
          )}
        </div>

        {/* Q3 & Q4 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="q3_whatsapp_pemohon" className="block text-sm font-semibold text-slate-800">
              3. Nomor WhatsApp Pemohon <span className="text-rose-600">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-1.5">Gunakan nomor WhatsApp aktif untuk proses verifikasi.</p>
            <input
              id="q3_whatsapp_pemohon"
              type="tel"
              value={formData.q3_whatsapp_pemohon}
              onChange={(e) => handleApplicantWaChange(e.target.value)}
              placeholder="081234567890"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q3_whatsapp_pemohon
                  ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q3_whatsapp_pemohon && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q3_whatsapp_pemohon}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="q4_email_pemohon" className="block text-sm font-semibold text-slate-800">
              4. Alamat Email Pemohon <span className="text-rose-600">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-1.5">Untuk notifikasi status verifikasi resmi.</p>
            <input
              id="q4_email_pemohon"
              type="email"
              value={formData.q4_email_pemohon}
              onChange={(e) => handleApplicantEmailChange(e.target.value)}
              placeholder="budi@email.com"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q4_email_pemohon
                  ? 'border-rose-400 focus:ring-rose-200'
                : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q4_email_pemohon && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q4_email_pemohon}
              </p>
            )}
          </div>
        </div>

        {/* Section Divider & Quick Autofill */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold text-slate-800">
                Informasi Pemilik Usaha / Pengurus yang Berwenang
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={!!formData.pemilik_sama_dengan_pemohon}
                onChange={(e) => handleSameAsApplicant(e.target.checked)}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Sama dengan data pemohon di atas</span>
            </label>
          </div>

          {/* Q5 */}
          <div className="mb-4">
            <label htmlFor="q5_nama_pemilik" className="block text-sm font-semibold text-slate-800">
              5. Nama Pemilik Usaha atau Pengurus yang Berwenang <span className="text-rose-600">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-1.5">
              Isi nama pihak yang mempunyai kewenangan atas usaha. Apabila Anda merupakan pihak tersebut, isi dengan nama sendiri.
            </p>
            <input
              id="q5_nama_pemilik"
              type="text"
              value={formData.q5_nama_pemilik}
              onChange={(e) => updateFormData({ q5_nama_pemilik: e.target.value })}
              placeholder="Contoh: Budi Santoso"
              disabled={formData.pemilik_sama_dengan_pemohon}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                formData.pemilik_sama_dengan_pemohon ? 'bg-slate-100 text-slate-600' : ''
              } ${
                errors.q5_nama_pemilik
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q5_nama_pemilik && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q5_nama_pemilik}
              </p>
            )}
          </div>

          {/* Q6 & Q7 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="q6_whatsapp_pemilik" className="block text-sm font-semibold text-slate-800">
                6. Nomor WhatsApp Pemilik/Pengurus yang Berwenang <span className="text-rose-600">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-1.5">
                Nomor ini akan digunakan untuk konfirmasi kewenangan. Nomor boleh sama dengan nomor pemohon.
              </p>
              <input
                id="q6_whatsapp_pemilik"
                type="tel"
                value={formData.q6_whatsapp_pemilik}
                onChange={(e) => updateFormData({ q6_whatsapp_pemilik: e.target.value })}
                placeholder="081234567890"
                disabled={formData.pemilik_sama_dengan_pemohon}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  formData.pemilik_sama_dengan_pemohon ? 'bg-slate-100 text-slate-600' : ''
                } ${
                  errors.q6_whatsapp_pemilik
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
                }`}
              />
              {errors.q6_whatsapp_pemilik && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.q6_whatsapp_pemilik}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="q7_email_pemilik" className="block text-sm font-semibold text-slate-800">
                7. Email Pemilik/Pengurus yang Berwenang <span className="text-rose-600">*</span>
              </label>
              <p className="text-xs text-slate-500 mb-1.5">Email resmi pemilik atau pengurus usaha.</p>
              <input
                id="q7_email_pemilik"
                type="email"
                value={formData.q7_email_pemilik}
                onChange={(e) => updateFormData({ q7_email_pemilik: e.target.value })}
                placeholder="pemilik@toko.com"
                disabled={formData.pemilik_sama_dengan_pemohon}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  formData.pemilik_sama_dengan_pemohon ? 'bg-slate-100 text-slate-600' : ''
                } ${
                  errors.q7_email_pemilik
                    ? 'border-rose-400 focus:ring-rose-200'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
                }`}
              />
              {errors.q7_email_pemilik && (
                <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.q7_email_pemilik}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
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
