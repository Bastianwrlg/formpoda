import React from 'react';
import { CheckCircle2, Printer, PlusCircle, LayoutDashboard, ShieldCheck, Download, Store, Globe, MapPin } from 'lucide-react';
import { ResellerSubmission } from '../../types/formData';
import { COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE } from '../../utils/constants';

interface PageSuccessProps {
  submission: ResellerSubmission;
  onNewRegistration: () => void;
  onGoToAdmin: () => void;
}

export const PageSuccess: React.FC<PageSuccessProps> = ({
  submission,
  onNewRegistration,
  onGoToAdmin,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(submission.createdAt).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6">
      {/* Official Receipt Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Top Header */}
        <div className="text-center pb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
            Database PT. PODA E-LIQUID COMPANY
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
            PENDAFTARAN BERHASIL DIKIRIM
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-lg mx-auto">
            Terima kasih. Permohonan pendaftaran reseller Anda telah berhasil disimpan ke database perusahaan
            dan sedang dalam antrean proses verifikasi resmi.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-slate-900 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-mono font-bold tracking-wide shadow-2xs">
              <span className="text-slate-600">Nomor Registrasi:</span>
              <span className="text-amber-800 font-extrabold">{submission.registrationNumber}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Data Langsung Tersimpan di Menu Admin</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="py-6 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="space-y-1">
            <span className="text-slate-500">Nama Pemohon:</span>
            <p className="font-semibold text-slate-900">{submission.data.q1_nama_pemohon}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500">Nama Toko / Nama Dagang:</span>
            <p className="font-semibold text-slate-900">{submission.data.q8_nama_toko}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500">Nomor Induk Berusaha (NIB):</span>
            <p className="font-semibold text-slate-900 font-mono">{submission.data.q11_nib}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500">Saluran Penjualan:</span>
            <p className="font-semibold text-slate-900">{submission.data.q15_saluran_penjualan}</p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500">Kota / Provinsi:</span>
            <p className="font-semibold text-slate-900">
              {submission.data.q13_kota_kabupaten}, {submission.data.q14_provinsi}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-slate-500">Waktu Pengajuan:</span>
            <p className="font-semibold text-slate-900">{formattedDate}</p>
          </div>
        </div>

        {/* Selected Brands */}
        <div className="py-4 border-b border-slate-100">
          <span className="text-xs text-slate-500 block mb-2">Merek Produk yang Diajukan:</span>
          <div className="flex flex-wrap gap-1.5">
            {submission.data.q31_merek_produk?.map((brand) => (
              <span
                key={brand}
                className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg text-xs font-medium"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Notice of Verification */}
        <div className="mt-6 bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2 leading-relaxed">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Ketentuan Pasca-Pengiriman Formulir:</span>
          </div>
          <p>• Pengiriman formulir bukan merupakan persetujuan penunjukan reseller.</p>
          <p>
            • Apabila diperlukan, petugas verifikasi PT. PODA E-LIQUID COMPANY akan menghubungi pemohon atau
            pemilik/pengurus usaha melalui nomor WhatsApp (<strong>{submission.data.q3_whatsapp_pemohon}</strong>)
            atau email yang didaftarkan.
          </p>
          <p>
            • <strong>Surat Penunjukan Reseller</strong> hanya diterbitkan apabila seluruh permohonan telah diverifikasi
            dan disetujui secara tertulis oleh perusahaan.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 border-t border-slate-100 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Cetak Tanda Terima</span>
          </button>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              type="button"
              onClick={onNewRegistration}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-600" />
              <span>Daftarkan Toko Lain</span>
            </button>

            <button
              type="button"
              onClick={onGoToAdmin}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Lihat di Portal Admin/Sales</span>
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400 font-medium">
          {COMPANY_NAME} · Layanan Otorisasi Reseller Resmi Indonesia
        </div>
      </div>
    </div>
  );
};
