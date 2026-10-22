import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { AdminPortal } from './components/AdminPortal';
import { Page1Info } from './components/pages/Page1Info';
import { Page2Pemohon } from './components/pages/Page2Pemohon';
import { Page3Usaha } from './components/pages/Page3Usaha';
import { Page4Saluran } from './components/pages/Page4Saluran';
import { Page5AFisik } from './components/pages/Page5AFisik';
import { Page5BOnline } from './components/pages/Page5BOnline';
import { Page5CFisikOnline } from './components/pages/Page5CFisikOnline';
import { Page6Produk } from './components/pages/Page6Produk';
import { Page7Dokumen } from './components/pages/Page7Dokumen';
import { Page8Ketentuan } from './components/pages/Page8Ketentuan';
import { Page9Konfirmasi } from './components/pages/Page9Konfirmasi';
import { PageSuccess } from './components/pages/PageSuccess';
import { ResellerFormData, ResellerSubmission, StepKey, FormSettings } from './types/formData';
import { INITIAL_FORM_DATA, COMPANY_NAME } from './utils/constants';
import { DEFAULT_FORM_SETTINGS } from './utils/defaultSettings';
import { validateStep, getNextStep, getPreviousStep, ValidationErrors } from './utils/validation';
import { dataService } from './services/dataService';
import { AlertCircle, History, RotateCcw, Megaphone, CheckCircle2 } from 'lucide-react';
import { AdminLoginModal } from './components/AdminLoginModal';

const DRAFT_TOKEN_KEY = 'poda_reseller_draft_token';
const LOCAL_STORAGE_KEY = 'poda_reseller_form_backup';

export default function App() {
  const [currentView, setCurrentView] = useState<'form' | 'admin'>('form');
  const [currentStep, setCurrentStep] = useState<StepKey>('page-1');
  const [formData, setFormData] = useState<ResellerFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<ResellerSubmission | null>(null);
  const [draftDetected, setDraftDetected] = useState(false);
  const [submissions, setSubmissions] = useState<ResellerSubmission[]>([]);
  const [settings, setSettings] = useState<FormSettings>(DEFAULT_FORM_SETTINGS);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('poda_admin_logged_in') === 'true';
    }
    return false;
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [adminToast, setAdminToast] = useState<string | null>(null);

  const draftTokenRef = useRef<string>('');
  const saveTimeoutRef = useRef<any>(null);

  // Initialize draft token, load data from dataService and setup real-time listeners
  useEffect(() => {
    let token = localStorage.getItem(DRAFT_TOKEN_KEY);
    if (!token) {
      token = 'draft-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
      localStorage.setItem(DRAFT_TOKEN_KEY, token);
    }
    draftTokenRef.current = token;

    // Check if there is local draft backup
    const localBackup = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localBackup) {
      try {
        const parsed = JSON.parse(localBackup);
        if (parsed.data && (parsed.data.q1_nama_pemohon || parsed.data.q8_nama_toko)) {
          setDraftDetected(true);
        }
      } catch (e) {
        console.error('Failed to parse local draft:', e);
      }
    }

    // Load initial submissions & settings
    dataService.fetchSubmissions().then(setSubmissions);
    dataService.fetchFormSettings().then(setSettings);

    // Setup real-time subscribers
    const unsubSubmissions = dataService.onSubmissions((newSubs) => {
      setSubmissions(newSubs);
    });

    const unsubSettings = dataService.onSettings((newSettings) => {
      setSettings(newSettings);
    });

    const unsubConnection = dataService.onConnection((connected) => {
      setIsRealtimeConnected(connected);
    });

    return () => {
      unsubSubmissions();
      unsubSettings();
      unsubConnection();
    };
  }, []);

  // Save to database automatically
  const saveDraftToDatabase = useCallback(
    async (dataToSave: ResellerFormData, stepToSave: StepKey) => {
      if (!draftTokenRef.current || stepToSave === 'success') return;

      setIsSaving(true);
      try {
        const savedTime = await dataService.saveDraft(draftTokenRef.current, dataToSave, stepToSave);
        setLastSavedAt(savedTime);
      } catch (err) {
        console.warn('Auto-save error handled:', err);
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  // Trigger auto-save debounce on user input
  const updateFormData = (updates: Partial<ResellerFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updates };

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        saveDraftToDatabase(next, currentStep);
      }, 700);

      return next;
    });

    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const copy = { ...prev };
      updatedKeys.forEach((key) => delete copy[key]);
      return copy;
    });
  };

  const handleNextStep = () => {
    const stepErrors = validateStep(currentStep, formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setErrors({});
    const next = getNextStep(currentStep, formData.q15_saluran_penjualan);
    setCurrentStep(next);
    saveDraftToDatabase(formData, next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setErrors({});
    const prev = getPreviousStep(currentStep, formData.q15_saluran_penjualan);
    setCurrentStep(prev);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToStep = (step: StepKey) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Final Registration to Database
  const handleSubmit = async () => {
    const stepErrors = validateStep('page-9', formData);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await dataService.saveSubmission(formData, draftTokenRef.current);
      setLastSubmission(result);
      
      // Proactively reload all submissions so admin menu immediately contains this new record
      setSubmissions((prev) => [result, ...prev.filter((s) => s.id !== result.id)]);
      dataService.fetchSubmissions().then((refreshedList) => {
        setSubmissions(refreshedList);
      });
      
      setCurrentStep('success');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setDraftDetected(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setSubmitError(err.message || 'Terjadi kesalahan saat pengiriman pendaftaran. Silakan periksa koneksi dan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin Access & Authentication Handlers
  const handleSwitchView = (view: 'form' | 'admin') => {
    if (view === 'admin') {
      dataService.fetchSubmissions().then((subs) => setSubmissions(subs));
      if (isAdminLoggedIn) {
        setCurrentView('admin');
      } else {
        setShowAdminLoginModal(true);
      }
    } else {
      setCurrentView('form');
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setShowAdminLoginModal(false);
    dataService.fetchSubmissions().then((subs) => setSubmissions(subs));
    setCurrentView('admin');
    setAdminToast('Login berhasil. Selamat datang di Panel Admin PT. PODA.');
    setTimeout(() => setAdminToast(null), 3500);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('poda_admin_logged_in');
    }
    setCurrentView('form');
    setAdminToast('Anda telah keluar dari sesi Admin.');
    setTimeout(() => setAdminToast(null), 3500);
  };

  // Restore Draft
  const handleRestoreDraft = async () => {
    try {
      const fullDraft = await dataService.getDraft(draftTokenRef.current);
      if (fullDraft && fullDraft.data) {
        setFormData(fullDraft.data);
        if (fullDraft.step && fullDraft.step !== 'success') {
          setCurrentStep(fullDraft.step);
        }
        setLastSavedAt(fullDraft.savedAt || new Date().toISOString());
        setDraftDetected(false);
        return;
      }
    } catch (e) {
      console.warn('Could not restore from IndexedDB:', e);
    }

    const localBackup = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localBackup) {
      try {
        const parsed = JSON.parse(localBackup);
        if (parsed.data) {
          setFormData(parsed.data);
          if (parsed.step && parsed.step !== 'success') {
            setCurrentStep(parsed.step);
          }
          setLastSavedAt(parsed.savedAt || new Date().toISOString());
        }
      } catch (e) {
        console.error(e);
      }
    }
    setDraftDetected(false);
  };

  // Discard Draft & Start Fresh
  const handleDiscardDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const newToken = 'draft-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
    localStorage.setItem(DRAFT_TOKEN_KEY, newToken);
    draftTokenRef.current = newToken;
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep('page-1');
    setDraftDetected(false);
  };

  const handleNewRegistration = () => {
    const newToken = 'draft-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
    localStorage.setItem(DRAFT_TOKEN_KEY, newToken);
    draftTokenRef.current = newToken;
    setFormData(INITIAL_FORM_DATA);
    setLastSubmission(null);
    setCurrentStep('page-1');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pendingCount = submissions.filter((s) => s.status === 'menunggu_verifikasi').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-amber-200 selection:text-slate-900">
      {/* Header */}
      <Header
        currentView={currentView}
        onSwitchView={handleSwitchView}
        isSaving={isSaving}
        lastSavedAt={lastSavedAt}
        pendingCount={pendingCount}
        companyName={settings.companyName || COMPANY_NAME}
        isRealtimeConnected={isRealtimeConnected}
      />

      {/* Step Progress Bar (Only visible in Form View and before success) */}
      {currentView === 'form' && currentStep !== 'success' && (
        <StepProgressBar
          currentStep={currentStep}
          saluran={formData.q15_saluran_penjualan}
          onNavigateToStep={handleNavigateToStep}
        />
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Real-time Global Announcement Banner configured by Admin */}
        {currentView === 'form' &&
          settings.announcementBanner?.enabled &&
          settings.announcementBanner?.text && (
            <div
              className={`mb-4 sm:mb-6 p-3.5 sm:p-4 rounded-2xl border text-xs sm:text-sm flex items-start gap-3 shadow-2xs ${
                settings.announcementBanner.type === 'warning'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : settings.announcementBanner.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-blue-50 border-blue-200 text-blue-950'
              }`}
            >
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block text-[11px] sm:text-xs uppercase tracking-wider mb-0.5">
                  Pengumuman Resmi {settings.companyName}:
                </span>
                <span className="leading-relaxed">{settings.announcementBanner.text}</span>
              </div>
            </div>
          )}

        {/* Draft Recovery Notification Banner */}
        {currentView === 'form' && draftDetected && currentStep === 'page-1' && (
          <div className="mb-6 bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3">
              <History className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Ditemukan Draft Pengisian Sebelumnya
                </h3>
                <p className="text-xs text-amber-900/80 mt-0.5">
                  Anda memiliki sesi formulir yang tersimpan otomatis di database browser. Ingin melanjutkan pengisian?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Mulai Baru
              </button>
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-600 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Lanjutkan Draft
              </button>
            </div>
          </div>
        )}

        {/* Submit Error Notice if any */}
        {submitError && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-300 rounded-2xl text-xs sm:text-sm text-rose-900 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div className="flex-1">
              <strong>Gagal Mengirim:</strong> {submitError}
            </div>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="text-xs font-bold text-rose-700 hover:text-rose-900"
            >
              Tutup
            </button>
          </div>
        )}

        {/* View Switching: Form View vs Admin Portal */}
        {currentView === 'admin' ? (
          <AdminPortal
            onBackToForm={() => setCurrentView('form')}
            submissions={submissions}
            onRefreshSubmissions={() => dataService.fetchSubmissions().then(setSubmissions)}
            settings={settings}
            onSaveSettings={async (newSettings) => {
              const ok = await dataService.saveFormSettings(newSettings);
              if (ok) setSettings(newSettings);
              return ok;
            }}
            onResetSettings={async () => {
              await dataService.saveFormSettings(DEFAULT_FORM_SETTINGS);
              setSettings(DEFAULT_FORM_SETTINGS);
            }}
            isRealtimeConnected={isRealtimeConnected}
            onLogout={handleAdminLogout}
          />
        ) : (
          <div>
            {currentStep === 'page-1' && (
              <Page1Info onNext={handleNextStep} settings={settings} />
            )}

            {currentStep === 'page-2' && (
              <Page2Pemohon
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                settings={settings}
              />
            )}

            {currentStep === 'page-3' && (
              <Page3Usaha
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                settings={settings}
              />
            )}

            {currentStep === 'page-4' && (
              <Page4Saluran
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                settings={settings}
              />
            )}

            {currentStep === 'page-5A' && (
              <Page5AFisik
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                settings={settings}
              />
            )}

            {currentStep === 'page-5B' && (
              <Page5BOnline
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                settings={settings}
              />
            )}

            {currentStep === 'page-5C' && (
              <Page5CFisikOnline
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                settings={settings}
              />
            )}

            {currentStep === 'page-6' && (
              <Page6Produk
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                settings={settings}
              />
            )}

            {currentStep === 'page-7' && (
              <Page7Dokumen
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                settings={settings}
              />
            )}

            {currentStep === 'page-8' && (
              <Page8Ketentuan
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onNext={handleNextStep}
                onPrev={handlePrevStep}
                settings={settings}
              />
            )}

            {currentStep === 'page-9' && (
              <Page9Konfirmasi
                formData={formData}
                updateFormData={updateFormData}
                errors={errors}
                onSubmit={handleSubmit}
                onPrev={handlePrevStep}
                isSubmitting={isSubmitting}
                settings={settings}
              />
            )}

            {currentStep === 'success' && lastSubmission && (
              <PageSuccess
                submission={lastSubmission}
                onNewRegistration={handleNewRegistration}
                onGoToAdmin={() => handleSwitchView('admin')}
              />
            )}
          </div>
        )}
      </main>

      {/* Admin Login Modal (user: admin, password: podaliquid123) */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        onLoginSuccess={handleAdminLoginSuccess}
        companyName={settings.companyName || COMPANY_NAME}
      />

      {/* Toast Notification */}
      {adminToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{adminToast}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 <strong>{settings.companyName || COMPANY_NAME}</strong> · Hak Cipta Dilindungi Undang-Undang
          </span>
          <div className="flex items-center gap-3 text-slate-400">
            <span>Sistem Verifikasi Reseller Terpadu</span>
            <span>·</span>
            <span>{settings.formVersion || 'Versi 1.0 (Oktober 2026)'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
