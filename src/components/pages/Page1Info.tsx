import React from 'react';
import { ArrowRight, ShieldCheck, Mail, Info, FileCheck2 } from 'lucide-react';
import { COMPANY_NAME, COMPANY_EMAIL, FORM_VERSION } from '../../utils/constants';
import { FormSettings } from '../../types/formData';

interface Page1InfoProps {
  onNext: () => void;
  settings?: FormSettings;
}

export const Page1Info: React.FC<Page1InfoProps> = ({ onNext, settings }) => {
  const companyName = settings?.companyName || COMPANY_NAME;
  const companyEmail = settings?.companyEmail || COMPANY_EMAIL;
  const formVersion = settings?.formVersion || FORM_VERSION;
  const pageTitle = settings?.pages?.['page-1']?.title || 'FORMULIR PENDAFTARAN RESELLER RESMI';
  const pageSubtitle = settings?.pages?.['page-1']?.subtitle;
  const ketentuanList = settings?.ketentuanPoin || [
    'Pendaftaran dilakukan oleh pemilik usaha, pengurus yang berwenang, atau pihak yang memperoleh kuasa yang sah.',
    'Pemohon wajib memberikan informasi usaha yang benar dan dokumen pendukung yang dapat diverifikasi.',
    'Satu pendaftaran berlaku untuk satu lokasi toko fisik dan paling banyak satu akun toko online.',
    'Apabila memiliki beberapa cabang atau akun toko online, pemohon wajib melakukan pendaftaran tambahan.',
    'Seluruh permohonan akan melalui proses pemeriksaan perusahaan.',
    'Pengisian formulir tidak otomatis memberikan status atau hak sebagai reseller.',
    'Surat Penunjukan Reseller hanya diterbitkan kepada pemohon yang disetujui perusahaan.',
    'Surat hanya berlaku untuk identitas toko, merek, dan saluran penjualan yang tercantum dalam surat.',
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner / Document Header in Crisp Light Theme */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex items-center gap-2 text-amber-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-2">
          <span>Versi Formulir: {formVersion}</span>
          <span>·</span>
          <span>Halaman 1</span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-950 mb-2">
          {pageTitle}
        </h1>
        <p className="text-slate-700 text-xs sm:text-sm sm:leading-relaxed max-w-2xl">
          {pageSubtitle || (
            <>
              Selamat datang di layanan pendaftaran reseller resmi <strong className="text-slate-950 font-bold">{companyName}</strong>.
              Formulir ini diperuntukkan bagi pemilik toko fisik dan/atau toko online yang ingin mengajukan
              Surat Penunjukan Reseller atas produk yang mereknya dikelola atau diotorisasi oleh perusahaan.
            </>
          )}
        </p>
      </div>

      {/* Ketentuan Pendaftaran (Poin 1 - 8) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2.5 pb-3 sm:pb-4 border-b border-slate-100 mb-4 sm:mb-5">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wide">
              Ketentuan Pendaftaran
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Pahami 8 butir syarat sebelum pengisian</p>
          </div>
        </div>

        <ol className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-slate-700">
          {ketentuanList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 sm:gap-3">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-slate-800 text-[11px] sm:text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-snug sm:leading-normal">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Informasi Penting */}
      <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 sm:p-5 space-y-2.5">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>INFORMASI PENTING</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Surat Penunjukan Reseller merupakan dokumen otorisasi terbatas dari perusahaan dan bukan izin usaha,
          izin penjualan produk yang dibatasi peraturan, maupun jaminan penerimaan oleh marketplace.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600 pt-2 border-t border-amber-200/60">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Email Layanan: <strong className="text-slate-900">{companyEmail}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Data dilindungi kepatuhan privasi resmi</span>
          </div>
        </div>
      </div>

      {/* Navigation action - full width on mobile for easy tap */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full sm:w-auto sm:ml-auto flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <span>Mulai Pendaftaran (Berikutnya)</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
