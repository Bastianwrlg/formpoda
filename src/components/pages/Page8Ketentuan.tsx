import React from 'react';
import { ArrowLeft, ArrowRight, Shield, Lock, AlertCircle, Mail, CheckCircle } from 'lucide-react';
import { ResellerFormData } from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';
import { COMPANY_NAME, PRIVACY_EMAIL } from '../../utils/constants';

interface Page8KetentuanProps {
  formData: ResellerFormData;
  updateFormData: (updates: Partial<ResellerFormData>) => void;
  errors: ValidationErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: any;
}

export const Page8Ketentuan: React.FC<Page8KetentuanProps> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  const companyName = settings?.companyName || COMPANY_NAME;
  const privacyEmail = settings?.privacyEmail || PRIVACY_EMAIL;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
          <span>Halaman 8 dari 9</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-amber-600" />
          {settings?.pages?.['page-8']?.title || 'KETENTUAN RESELLER DAN PRIVASI'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-8']?.subtitle ||
            `Harap membaca seluruh ketentuan dan pemberitahuan privasi berikut sebelum melanjutkan pendaftaran reseller resmi ${companyName}.`}
        </p>
        {settings?.pages?.['page-8']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-8'].helpText}</span>
          </div>
        )}
      </div>

      {/* 10 Ketentuan Reseller Scroll Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          Ketentuan Reseller Resmi {companyName}
        </h3>

        <div className="max-h-80 overflow-y-auto space-y-4 pr-2 text-xs sm:text-sm text-slate-700 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
          <div>
            <h4 className="font-bold text-slate-900">1. Kebenaran Informasi</h4>
            <p className="mt-0.5 text-slate-600">
              Pemohon wajib memberikan informasi dan dokumen yang benar, serta memiliki kewenangan yang sah untuk mendaftarkan usaha.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900">2. Keaslian Produk</h4>
            <p className="mt-0.5 text-slate-600">
              Reseller wajib menjual produk asli yang diperoleh melalui sumber yang sah dan dapat ditelusuri.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900">3. Kepatuhan Hukum</h4>
            <p className="mt-0.5 text-slate-600">
              Reseller wajib mematuhi peraturan perundang-undangan yang berlaku, termasuk perizinan usaha, ketentuan lokasi penjualan, larangan penjualan kepada pihak yang dilarang oleh peraturan, dan ketentuan penjualan melalui sistem elektronik.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900">4. Batas Kewenangan</h4>
            <p className="mt-0.5 text-slate-600">
              Status reseller bersifat non-eksklusif dan tidak memberikan hak untuk bertindak sebagai distributor utama, agen tunggal, perwakilan perusahaan, atau Official Store.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900">5. Penggunaan Surat Penunjukan</h4>
            <p className="mt-0.5 text-slate-600">
              Surat hanya berlaku untuk toko, lokasi, akun online, dan merek yang tercantum dalam surat. Reseller dilarang memindahtangankan, mengubah, memperjualbelikan, atau menggunakan surat untuk memberikan otorisasi kepada pihak lain.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900">6. Penggunaan Merek</h4>
            <p className="mt-0.5 text-slate-600">
              Reseller hanya diperkenankan menggunakan nama dan identitas merek sesuai ruang lingkup otorisasi yang diberikan, tanpa memperoleh hak kepemilikan atas merek tersebut.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900">7. Tanggung Jawab Operasional</h4>
            <p className="mt-0.5 text-slate-600">
              Reseller bertanggung jawab atas kegiatan usaha dan tindakan atau kelalaiannya sendiri sesuai ketentuan hukum yang berlaku. Penunjukan tidak mengalihkan kewajiban hukum yang secara langsung menjadi tanggung jawab produsen.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900">8. Hak Perusahaan</h4>
            <p className="mt-0.5 text-slate-600">
              Perusahaan berhak melakukan verifikasi, meminta kelengkapan dokumen, menolak pengajuan, atau mencabut penunjukan apabila ditemukan pelanggaran, penyalahgunaan, atau ketidaksesuaian informasi.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900">9. Perubahan Informasi</h4>
            <p className="mt-0.5 text-slate-600">
              Reseller wajib memberitahukan perusahaan apabila terdapat perubahan pemilik usaha, alamat toko, akun online, atau informasi penting lainnya.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900">10. Status Permohonan</h4>
            <p className="mt-0.5 text-slate-600">
              Pengiriman formulir ini tidak otomatis memberikan status reseller. Penunjukan hanya berlaku setelah perusahaan menerbitkan Surat Penunjukan Reseller.
            </p>
          </div>
        </div>

        {/* 42. Checkbox Ketentuan Reseller */}
        <label
          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            formData.q42_persetujuan_ketentuan
              ? 'border-amber-500 bg-amber-50/50 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <input
            type="checkbox"
            checked={formData.q42_persetujuan_ketentuan}
            onChange={(e) => updateFormData({ q42_persetujuan_ketentuan: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-slate-900">
              42. Konfirmasi Pemahaman Ketentuan Reseller <span className="text-rose-600">*</span>
            </span>
            <p className="text-xs text-slate-600">
              Saya telah membaca, memahami, dan menyetujui Ketentuan Reseller sebagaimana tercantum di atas.
            </p>
          </div>
        </label>
        {errors.q42_persetujuan_ketentuan && (
          <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.q42_persetujuan_ketentuan}
          </p>
        )}
      </div>

      {/* Pemberitahuan Privasi */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600" />
          Pemberitahuan Privasi & Pemrosesan Data
        </h3>

        <div className="text-xs sm:text-sm text-slate-600 bg-slate-50/60 p-4 rounded-xl border border-slate-200 space-y-2 leading-relaxed">
          <p>
            <strong className="text-slate-800">{COMPANY_NAME}</strong> bertindak sebagai pengendali data pribadi yang dikumpulkan melalui formulir ini.
            Data meliputi identitas pemohon, informasi kontak, identitas usaha, alamat toko, informasi akun online, serta dokumen pendukung yang diperlukan.
          </p>
          <p>
            Data diproses untuk keperluan verifikasi identitas dan kewenangan, pemeriksaan legalitas usaha, evaluasi permohonan, penerbitan surat, pengawasan penunjukan, serta penyelesaian pengaduan dan pemenuhan kewajiban hukum.
          </p>
          <p>
            Data dapat diakses oleh petugas perusahaan yang berwenang dan penyedia sistem yang diperlukan untuk melaksanakan tujuan tersebut. Pemohon dapat mengajukan permintaan mengenai hak data pribadi melalui email resmi:{' '}
            <strong className="text-slate-900">{PRIVACY_EMAIL}</strong>.
          </p>
        </div>

        {/* 43. Checkbox Privasi */}
        <label
          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            formData.q43_persetujuan_privasi
              ? 'border-amber-500 bg-amber-50/50 shadow-xs'
              : 'border-slate-200 hover:border-slate-300 bg-white'
          }`}
        >
          <input
            type="checkbox"
            checked={formData.q43_persetujuan_privasi}
            onChange={(e) => updateFormData({ q43_persetujuan_privasi: e.target.checked })}
            className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <div className="space-y-0.5">
            <span className="text-sm font-semibold text-slate-900">
              43. Konfirmasi Pemberitahuan Privasi <span className="text-rose-600">*</span>
            </span>
            <p className="text-xs text-slate-600">
              Saya telah membaca dan memahami Pemberitahuan Privasi, termasuk tujuan pemrosesan data dan informasi mengenai hak saya.
            </p>
          </div>
        </label>
        {errors.q43_persetujuan_privasi && (
          <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.q43_persetujuan_privasi}
          </p>
        )}
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
