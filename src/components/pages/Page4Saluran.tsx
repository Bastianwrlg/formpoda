import React from 'react';
import { ArrowLeft, ArrowRight, Store, Globe, ArrowRightCircle, AlertCircle } from 'lucide-react';
import { ResellerFormData, SaluranPenjualan } from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';

interface Page4SaluranProps {
  formData: ResellerFormData;
  updateFormData: (updates: Partial<ResellerFormData>) => void;
  errors: ValidationErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: any;
}

const SALURAN_OPTIONS: {
  key: SaluranPenjualan;
  label: string;
  desc: string;
  targetPage: string;
}[] = [
  {
    key: 'Toko Fisik Saja',
    label: 'Toko Fisik Saja',
    desc: 'Hanya memiliki outlet fisik / vape store offline.',
    targetPage: 'Lanjut ke HALAMAN 5A (Informasi Toko Fisik)',
  },
  {
    key: 'Toko Online Saja',
    label: 'Toko Online Saja',
    desc: 'Hanya berjualan di marketplace (Shopee, Tokopedia, TikTok Shop, dll) atau website.',
    targetPage: 'Lanjut ke HALAMAN 5B (Informasi Toko Online)',
  },
  {
    key: 'Toko Fisik dan Toko Online',
    label: 'Toko Fisik dan Toko Online',
    desc: 'Memiliki gerai fisik sekaligus saluran penjualan online.',
    targetPage: 'Lanjut ke HALAMAN 5C (Informasi Toko Fisik & Online)',
  },
];

export const Page4Saluran: React.FC<Page4SaluranProps> = ({
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
          <span>Halaman 4 dari 9</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {settings?.pages?.['page-4']?.title || 'JENIS SALURAN PENJUALAN'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-4']?.subtitle ||
            `Pilih jenis saluran penjualan yang akan didaftarkan untuk memperoleh Surat Penunjukan Reseller dari ${settings?.companyName || 'PT. PODA E-LIQUID COMPANY'}. Sistem akan secara otomatis mengarahkan formulir ke halaman spesifik yang sesuai.`}
        </p>
        {settings?.pages?.['page-4']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-4'].helpText}</span>
          </div>
        )}
      </div>

      {/* Options Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <label className="block text-sm font-semibold text-slate-800">
          15. Jenis Saluran Penjualan <span className="text-rose-600">*</span>
        </label>

        <div className="space-y-3 pt-1">
          {SALURAN_OPTIONS.map((item) => {
            const isSelected = formData.q15_saluran_penjualan === item.key;
            return (
              <div
                key={item.key}
                onClick={() => updateFormData({ q15_saluran_penjualan: item.key })}
                className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <input
                      type="radio"
                      name="q15_saluran_penjualan"
                      checked={isSelected}
                      onChange={() => updateFormData({ q15_saluran_penjualan: item.key })}
                      className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      {item.key === 'Toko Fisik Saja' && <Store className="w-4 h-4 text-slate-700" />}
                      {item.key === 'Toko Online Saja' && <Globe className="w-4 h-4 text-slate-700" />}
                      {item.key === 'Toko Fisik dan Toko Online' && (
                        <div className="flex items-center gap-1 text-slate-700">
                          <Store className="w-4 h-4" />
                          <span>+</span>
                          <Globe className="w-4 h-4" />
                        </div>
                      )}
                      <h3 className="text-base font-bold text-slate-900">{item.label}</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600">{item.desc}</p>
                    <div className="flex items-center gap-1.5 text-xs text-amber-800 font-semibold pt-1">
                      <ArrowRightCircle className="w-3.5 h-3.5" />
                      <span>{item.targetPage}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {errors.q15_saluran_penjualan && (
          <p className="text-xs text-rose-600 flex items-center gap-1 mt-2 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            {errors.q15_saluran_penjualan}
          </p>
        )}
      </div>

      {/* Information Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 space-y-1">
        <p className="font-semibold text-slate-800">Pengaturan Sistem Percabangan Halaman:</p>
        <p>• Toko Fisik Saja → Lanjut ke HALAMAN 5A</p>
        <p>• Toko Online Saja → Lanjut ke HALAMAN 5B</p>
        <p>• Toko Fisik dan Toko Online → Lanjut ke HALAMAN 5C</p>
        <p className="pt-1 text-slate-500">
          Setelah halaman yang sesuai selesai diisi, seluruh pemohon akan diarahkan ke HALAMAN 6 (Informasi Produk dan Distributor).
        </p>
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
