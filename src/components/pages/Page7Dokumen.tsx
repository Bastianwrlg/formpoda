import React from 'react';
import { ArrowLeft, ArrowRight, FileUp, AlertCircle, Info, ShieldCheck } from 'lucide-react';
import { ResellerFormData } from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';
import { FileUploadField } from '../FileUploadField';

interface Page7DokumenProps {
  formData: ResellerFormData;
  updateFormData: (updates: Partial<ResellerFormData>) => void;
  errors: ValidationErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: any;
}

export const Page7Dokumen: React.FC<Page7DokumenProps> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  const isFisik =
    formData.q15_saluran_penjualan === 'Toko Fisik Saja' ||
    formData.q15_saluran_penjualan === 'Toko Fisik dan Toko Online';

  const isOnline =
    formData.q15_saluran_penjualan === 'Toko Online Saja' ||
    formData.q15_saluran_penjualan === 'Toko Fisik dan Toko Online';

  const hasPurchased = formData.q32_sumber_pembelian !== 'Belum pernah melakukan pembelian';

  const isPowerOfAttorney =
    formData.q2_hubungan_pemohon === 'Penerima kuasa dari pemilik atau pengurus yang berwenang';

  const isCompany =
    formData.q9_bentuk_usaha === 'Perseroan Terbatas (PT)' ||
    formData.q9_bentuk_usaha === 'Persekutuan Komanditer (CV)' ||
    formData.q9_bentuk_usaha === 'Koperasi';

  const companyName = settings?.companyName || 'PT. PODA E-LIQUID COMPANY';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
          <span>Halaman 7 dari 9</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FileUp className="w-6 h-6 text-amber-600" />
          {settings?.pages?.['page-7']?.title || 'DOKUMEN PENDUKUNG'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-7']?.subtitle ||
            `Unggah dokumen yang diperlukan untuk memverifikasi identitas usaha, keberadaan toko, sumber produk, serta kewenangan pemohon. Dokumen hanya digunakan untuk keperluan pendaftaran dan verifikasi resmi reseller ${companyName}.`}
        </p>
        {settings?.pages?.['page-7']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-7'].helpText}</span>
          </div>
        )}
      </div>

      {/* Upload Fields Container */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Q36: NIB (Wajib) */}
        <FileUploadField
          label="36. Dokumen Nomor Induk Berusaha (NIB)"
          fieldId="q36_dokumen_nib"
          required
          doc={formData.q36_dokumen_nib}
          onChange={(doc) => updateFormData({ q36_dokumen_nib: doc })}
          error={errors.q36_dokumen_nib}
          helpText="Format PDF/JPG/PNG. Dokumen izin resmi NIB yang diterbitkan oleh OSS."
        />

        {/* Q37: Foto Bagian Depan Toko Fisik (Kondisional) */}
        {isFisik && (
          <div className="pt-3 border-t border-slate-100">
            <FileUploadField
              label="37. Foto Bagian Depan Toko Fisik"
              fieldId="q37_foto_depan_toko"
              required
              conditionalNote="Wajib untuk Toko Fisik"
              doc={formData.q37_foto_depan_toko}
              onChange={(doc) => updateFormData({ q37_foto_depan_toko: doc })}
              error={errors.q37_foto_depan_toko}
              helpText="Pastikan papan nama toko dan fasad depan outlet terlihat jelas dan terbaca."
            />
          </div>
        )}

        {/* Q38: Screenshot Profil Toko Online (Kondisional) */}
        {isOnline && (
          <div className="pt-3 border-t border-slate-100">
            <FileUploadField
              label="38. Screenshot Profil Toko Online"
              fieldId="q38_screenshot_toko_online"
              required
              conditionalNote="Wajib untuk Toko Online"
              doc={formData.q38_screenshot_toko_online}
              onChange={(doc) => updateFormData({ q38_screenshot_toko_online: doc })}
              error={errors.q38_screenshot_toko_online}
              helpText="Screenshot harus memperlihatkan nama toko, logo akun, dan identitas seller / URL toko."
            />
          </div>
        )}

        {/* Q39: Bukti Pembelian Produk (Kondisional) */}
        <div className="pt-3 border-t border-slate-100">
          <FileUploadField
            label="39. Bukti Pembelian Produk"
            fieldId="q39_bukti_pembelian"
            required={hasPurchased}
            conditionalNote={hasPurchased ? 'Wajib (Karena menyatakan pernah membeli produk)' : 'Opsional'}
            doc={formData.q39_bukti_pembelian}
            onChange={(doc) => updateFormData({ q39_bukti_pembelian: doc })}
            error={errors.q39_bukti_pembelian}
            helpText="Dokumen yang diterima: Invoice pembelian, Faktur pembelian, Nota resmi, atau Bukti transfer ke distributor yang dapat diverifikasi. Info harga boleh disensor/ditutup."
          />
        </div>

        {/* Q40: Surat Kuasa atau Bukti Kewenangan (Kondisional) */}
        {isPowerOfAttorney && (
          <div className="pt-3 border-t border-slate-100">
            <FileUploadField
              label="40. Surat Kuasa atau Bukti Kewenangan"
              fieldId="q40_surat_kuasa"
              required
              conditionalNote="Wajib bagi Penerima Kuasa"
              doc={formData.q40_surat_kuasa}
              onChange={(doc) => updateFormData({ q40_surat_kuasa: doc })}
              error={errors.q40_surat_kuasa}
              helpText="Surat kuasa bermaterai dari pemilik/pengurus berwenang yang memberikan mandat pendaftaran reseller."
            />
          </div>
        )}

        {/* Q41: Dokumen Pendukung Kewenangan Pengurus (Kondisional) */}
        {isCompany && (
          <div className="pt-3 border-t border-slate-100">
            <FileUploadField
              label="41. Dokumen Pendukung Kewenangan Pengurus"
              fieldId="q41_dokumen_pengurus"
              required={false}
              conditionalNote="Opsional / Badan Usaha"
              doc={formData.q41_dokumen_pengurus}
              onChange={(doc) => updateFormData({ q41_dokumen_pengurus: doc })}
              helpText="Untuk pemohon badan usaha (PT/CV), lampirkan akta notaris/SK Kemenkumham bila diperlukan untuk mempercepat verifikasi."
            />
          </div>
        )}

        {/* Catatan Panduan Internal */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-900 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>CATATAN PERSYARATAN DOKUMEN:</span>
          </div>
          <p>
            • Perusahaan dapat meminta kelengkapan dokumen tambahan yang relevan apabila informasi dalam permohonan belum dapat diverifikasi.
          </p>
          <p>
            • <strong>Tidak diperlukan upload KTP</strong> untuk seluruh pemohon pada tahap awal.
          </p>
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
