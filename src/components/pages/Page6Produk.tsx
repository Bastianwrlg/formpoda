import React from 'react';
import { ArrowLeft, ArrowRight, Package, AlertCircle, Sparkles } from 'lucide-react';
import { ResellerFormData, SumberPembelian, SediaBukti } from '../../types/formData';
import { ValidationErrors } from '../../utils/validation';
import { PODA_BRANDS, COMPANY_NAME } from '../../utils/constants';

interface Page6ProdukProps {
  formData: ResellerFormData;
  updateFormData: (updates: Partial<ResellerFormData>) => void;
  errors: ValidationErrors;
  onNext: () => void;
  onPrev: () => void;
  settings?: any;
}

const SUMBER_PEMBELIAN_OPTIONS: SumberPembelian[] = [
  'Distributor',
  'Pembelian langsung dari perusahaan',
  'Belum pernah melakukan pembelian',
];

export const Page6Produk: React.FC<Page6ProdukProps> = ({
  formData,
  updateFormData,
  errors,
  onNext,
  onPrev,
  settings,
}) => {
  const brandList: string[] =
    settings?.productBrands && settings.productBrands.length > 0 ? settings.productBrands : PODA_BRANDS;
  const companyName = settings?.companyName || COMPANY_NAME;

  const handleToggleBrand = (brand: string) => {
    const current = formData.q31_merek_produk || [];
    if (current.includes(brand)) {
      updateFormData({ q31_merek_produk: current.filter((b) => b !== brand) });
    } else {
      updateFormData({ q31_merek_produk: [...current, brand] });
    }
  };

  const handleSumberChange = (sumber: SumberPembelian) => {
    const updates: Partial<ResellerFormData> = { q32_sumber_pembelian: sumber };
    if (sumber === 'Pembelian langsung dari perusahaan') {
      updates.q33_nama_distributor = companyName;
    } else if (sumber === 'Belum pernah melakukan pembelian') {
      updates.q33_nama_distributor = 'Belum ada';
    }
    updateFormData(updates);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
          <span>Halaman 6 dari 9</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Package className="w-6 h-6 text-amber-600" />
          {settings?.pages?.['page-6']?.title || 'INFORMASI PRODUK DAN DISTRIBUTOR'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          {settings?.pages?.['page-6']?.subtitle || (
            <>
              Bagian ini digunakan untuk mengetahui merek produk yang ingin didaftarkan serta sumber pembelian produk
              dari jaringan resmi <strong className="text-slate-900">{companyName}</strong>.
            </>
          )}
        </p>
        {settings?.pages?.['page-6']?.helpText && (
          <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2">
            <span className="font-bold">💡 Petunjuk:</span>
            <span>{settings.pages['page-6'].helpText}</span>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* 31. Merek Produk */}
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <label className="block text-sm font-semibold text-slate-800">
              31. Merek Produk yang Dimohonkan Penunjukan <span className="text-rose-600">*</span>
            </label>
            <span className="text-xs text-slate-500">Pilih satu atau lebih</span>
          </div>
          <p className="text-xs text-slate-500 mb-2.5">
            Pilih varian atau lini produk {companyName} yang ingin Anda pasarkan secara resmi.
          </p>

          <div className="space-y-2">
            {brandList.map((brand) => {
              const isChecked = formData.q31_merek_produk?.includes(brand);
              return (
                <label
                  key={brand}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleBrand(brand)}
                    className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <div className="text-sm font-medium text-slate-800 flex items-center gap-2">
                    <span>{brand}</span>
                  </div>
                </label>
              );
            })}
          </div>

          {errors.q31_merek_produk && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-2 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q31_merek_produk}
            </p>
          )}

          <div className="mt-2 p-2.5 bg-slate-50 rounded-lg text-xs text-slate-500 border border-slate-200/70">
            <strong>Catatan untuk Admin & Pemohon:</strong> Hanya cantumkan merek yang benar-benar dapat diberikan
            otorisasinya oleh perusahaan.
          </div>
        </div>

        {/* 32. Sumber Pembelian Produk */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            32. Sumber Pembelian Produk <span className="text-rose-600">*</span>
          </label>
          <div className="space-y-2">
            {SUMBER_PEMBELIAN_OPTIONS.map((opt) => (
              <label
                key={opt}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  formData.q32_sumber_pembelian === opt
                    ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q32_sumber_pembelian"
                  checked={formData.q32_sumber_pembelian === opt}
                  onChange={() => handleSumberChange(opt)}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm font-medium text-slate-800">{opt}</span>
              </label>
            ))}
          </div>
          {errors.q32_sumber_pembelian && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q32_sumber_pembelian}
            </p>
          )}
        </div>

        {/* 33 & 34 Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label htmlFor="q33_nama_distributor" className="block text-sm font-semibold text-slate-800">
              33. Nama Distributor/Pemasok <span className="text-rose-600">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-1.5">
              Jika beli langsung isi nama perusahaan. Jika belum pernah beli, isi "Belum ada".
            </p>
            <input
              id="q33_nama_distributor"
              type="text"
              value={formData.q33_nama_distributor}
              onChange={(e) => updateFormData({ q33_nama_distributor: e.target.value })}
              placeholder="Nama distributor resmi"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                errors.q33_nama_distributor
                  ? 'border-rose-400 focus:ring-rose-200'
                  : 'border-slate-300 focus:border-amber-500 focus:ring-amber-100'
              }`}
            />
            {errors.q33_nama_distributor && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.q33_nama_distributor}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="q34_kota_distributor" className="block text-sm font-semibold text-slate-800">
              34. Kota Distributor/Pemasok <span className="text-xs font-normal text-slate-500">(Opsional)</span>
            </label>
            <p className="text-xs text-slate-500 mb-1.5">Kota domisili distributor penyedia produk.</p>
            <input
              id="q34_kota_distributor"
              type="text"
              value={formData.q34_kota_distributor}
              onChange={(e) => updateFormData({ q34_kota_distributor: e.target.value })}
              placeholder="Contoh: Jakarta / Surabaya"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:border-amber-500 focus:ring-amber-100 transition-colors"
            />
          </div>
        </div>

        {/* 35. Bersedia Menunjukkan Bukti */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-2">
            35. Apakah Anda Bersedia Menunjukkan Bukti Pembelian Produk untuk Keperluan Verifikasi?{' '}
            <span className="text-rose-600">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {(['Ya, bersedia', 'Tidak bersedia'] as SediaBukti[]).map((val) => (
              <label
                key={val}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  formData.q35_sedia_bukti_pembelian === val
                    ? 'border-amber-500 bg-amber-50/50 text-slate-900 font-semibold'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="q35_sedia_bukti_pembelian"
                  checked={formData.q35_sedia_bukti_pembelian === val}
                  onChange={() => updateFormData({ q35_sedia_bukti_pembelian: val })}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span className="text-sm">{val}</span>
              </label>
            ))}
          </div>
          {errors.q35_sedia_bukti_pembelian && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.q35_sedia_bukti_pembelian}
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
          <span>Berikutnya</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    </div>
  );
};
