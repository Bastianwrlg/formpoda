import React, { useRef, useEffect } from 'react';
import { StepKey, SaluranPenjualan } from '../types/formData';
import { Check, ChevronRight } from 'lucide-react';

interface StepProgressBarProps {
  currentStep: StepKey;
  saluran: SaluranPenjualan | '';
  onNavigateToStep?: (step: StepKey) => void;
}

interface StepItem {
  key: StepKey;
  displayNumber: string;
  label: string;
  fullTitle: string;
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStep,
  saluran,
  onNavigateToStep,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Determine dynamic step 5 key and label
  let step5Key: StepKey = 'page-5A';
  let step5Label = 'Toko Fisik';
  let step5Title = 'Informasi Toko Fisik';

  if (saluran === 'Toko Online Saja') {
    step5Key = 'page-5B';
    step5Label = 'Toko Online';
    step5Title = 'Informasi Toko Online';
  } else if (saluran === 'Toko Fisik dan Toko Online') {
    step5Key = 'page-5C';
    step5Label = 'Fisik & Online';
    step5Title = 'Informasi Toko Fisik & Online';
  }

  const steps: StepItem[] = [
    { key: 'page-1', displayNumber: '1', label: 'Info', fullTitle: 'Informasi Pendaftaran' },
    { key: 'page-2', displayNumber: '2', label: 'Pemohon', fullTitle: 'Identitas Pemohon' },
    { key: 'page-3', displayNumber: '3', label: 'Usaha', fullTitle: 'Identitas Usaha' },
    { key: 'page-4', displayNumber: '4', label: 'Saluran', fullTitle: 'Jenis Saluran Penjualan' },
    {
      key: step5Key,
      displayNumber: saluran === 'Toko Online Saja' ? '5B' : saluran === 'Toko Fisik dan Toko Online' ? '5C' : '5A',
      label: step5Label,
      fullTitle: step5Title,
    },
    { key: 'page-6', displayNumber: '6', label: 'Produk', fullTitle: 'Informasi Produk & Distributor' },
    { key: 'page-7', displayNumber: '7', label: 'Dokumen', fullTitle: 'Dokumen Pendukung' },
    { key: 'page-8', displayNumber: '8', label: 'Ketentuan', fullTitle: 'Ketentuan & Privasi' },
    { key: 'page-9', displayNumber: '9', label: 'Konfirmasi', fullTitle: 'Pernyataan & Konfirmasi' },
  ];

  const getStepIndex = (key: StepKey): number => {
    if (key === 'page-1') return 0;
    if (key === 'page-2') return 1;
    if (key === 'page-3') return 2;
    if (key === 'page-4') return 3;
    if (key === 'page-5A' || key === 'page-5B' || key === 'page-5C') return 4;
    if (key === 'page-6') return 5;
    if (key === 'page-7') return 6;
    if (key === 'page-8') return 7;
    if (key === 'page-9') return 8;
    return 9; // success
  };

  const currentIndex = getStepIndex(currentStep);
  const activeStep = steps[Math.min(currentIndex, steps.length - 1)];
  const progressPercent = Math.min(100, Math.round(((currentIndex + 1) / steps.length) * 100));

  // Auto-scroll the active step into view on mobile
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        const container = scrollContainerRef.current;
        const scrollLeft = activeEl.offsetLeft - container.offsetWidth / 2 + activeEl.offsetWidth / 2;
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [currentIndex]);

  return (
    <div className="bg-white border-b border-slate-200/90 py-2.5 sm:py-3.5 px-3 sm:px-6 shadow-2xs">
      <div className="max-w-4xl mx-auto">
        {/* Progress summary for mobile & desktop */}
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-medium">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-[11px] sm:text-xs font-bold text-amber-600 uppercase tracking-wide">
              Hal {currentIndex + 1} dari {steps.length}
            </span>
            <span className="text-slate-300">·</span>
            <strong className="text-slate-900 truncate text-xs sm:text-sm font-bold">
              {activeStep?.fullTitle}
            </strong>
          </div>
          <span className="text-xs font-bold text-slate-800 shrink-0 ml-2">{progressPercent}%</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2.5">
          <div
            className="bg-amber-500 h-full transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Badges Navigation with touch scroll */}
        <div
          ref={scrollContainerRef}
          className="flex items-center justify-start sm:justify-between overflow-x-auto no-scrollbar pb-1 gap-2 sm:gap-1 scroll-smooth"
        >
          {steps.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isClickable = isCompleted && onNavigateToStep;

            return (
              <button
                key={step.key}
                type="button"
                data-active={isCurrent ? 'true' : 'false'}
                disabled={!isClickable}
                onClick={() => isClickable && onNavigateToStep(step.key)}
                className={`flex flex-col items-center min-w-[54px] sm:min-w-[60px] text-center shrink-0 transition-all ${
                  !isClickable ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-3 ring-amber-100 shadow-xs scale-105'
                      : isCompleted
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-slate-100 text-slate-400 border border-slate-200/70'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.displayNumber}
                </div>
                <span
                  className={`text-[10px] mt-1 font-medium truncate max-w-[62px] ${
                    isCurrent ? 'text-amber-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
