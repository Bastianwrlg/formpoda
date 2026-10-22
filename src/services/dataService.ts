import { ResellerSubmission, ResellerFormData, SubmissionStatus, FormSettings, StepKey } from '../types/formData';
import { DEFAULT_FORM_SETTINGS } from '../utils/defaultSettings';
import { evaluateApplication } from '../utils/evaluation';
import {
  safeSetLocalStorage,
  sanitizeSubmissionForLocalStorage,
  sanitizeSubmissionsListForLocalStorage,
  cleanBloatedLocalStorage,
  idbSaveSubmission,
  idbSaveAllSubmissions,
  idbGetAllSubmissions,
  idbSaveDraft,
  idbGetDraft,
} from '../utils/indexedDb';

const SUBMISSIONS_STORAGE_KEY = 'poda_reseller_submissions_db';
const SETTINGS_STORAGE_KEY = 'poda_reseller_settings_db';
const DRAFT_STORAGE_PREFIX = 'poda_reseller_draft_';

// Initial mock submissions for offline / Netlify static hosting
const INITIAL_OFFLINE_SUBMISSIONS: ResellerSubmission[] = [
  {
    id: 'poda-sub-1',
    registrationNumber: 'PODA-RES-202610-0001',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'dapat_disetujui',
    rekomendasiSistem: 'Dapat diajukan untuk persetujuan',
    alasanRekomendasi:
      'Identitas usaha dan pemilik sesuai, dokumen NIB lengkap, dan kanal toko fisik telah memenuhi regulasi zonasi rokok elektronik.',
    catatanAdmin: 'Verifikasi kelengkapan berkas NIB dan lokasi toko telah sesuai.',
    data: {
      q1_nama_pemohon: 'Hendro Wijaya',
      q2_hubungan_pemohon: 'Pemilik usaha perseorangan',
      q3_whatsapp_pemohon: '081234567890',
      q4_email_pemohon: 'hendro.vape@gmail.com',
      q5_nama_pemilik: 'Hendro Wijaya',
      q6_whatsapp_pemilik: '081234567890',
      q7_email_pemilik: 'hendro.vape@gmail.com',
      pemilik_sama_dengan_pemohon: true,
      q8_nama_toko: 'Poda Cloud Vape Store Kemang',
      q9_bentuk_usaha: 'Usaha perseorangan',
      q10_nama_pemilik_usaha: 'Hendro Wijaya',
      q11_nib: '1289004523190',
      q12_alamat_usaha: 'Jl. Kemang Raya No. 42B, Mampang Prapatan',
      q13_kota_kabupaten: 'Jakarta Selatan',
      q14_provinsi: 'DKI Jakarta',
      q15_saluran_penjualan: 'Toko Fisik Saja',
      q16a_nama_toko_fisik: 'Poda Cloud Vape Store Kemang',
      q17a_alamat_toko_fisik: 'Jl. Kemang Raya No. 42B, Mampang Prapatan, Jakarta Selatan',
      q18a_maps_toko_fisik: 'https://maps.google.com/?q=Poda+Cloud+Kemang',
      q19a_penanggung_jawab_fisik: 'Hendro Wijaya',
      q20a_whatsapp_toko_fisik: '081234567890',
      q21a_status_operasional_fisik: 'Sudah beroperasi',
      q22a_kepatuhan_lokasi_fisik: 'Ya',
      q16b_nama_toko_online: '',
      q17b_platform_online: '',
      q18b_link_online: '',
      q19b_seller_id_online: '',
      q20b_nama_pemilik_seller: '',
      q21b_status_operasional_online: '',
      q22b_kepatuhan_platform_online: '',
      q23b_verifikasi_usia_online: '',
      q16c_nama_toko_fisik: '',
      q17c_alamat_toko_fisik: '',
      q18c_maps_toko_fisik: '',
      q19c_penanggung_jawab_fisik: '',
      q20c_whatsapp_toko_fisik: '',
      q21c_status_operasional_fisik: '',
      q22c_kepatuhan_lokasi_fisik: '',
      q23c_nama_toko_online: '',
      q24c_platform_online: '',
      q25c_link_online: '',
      q26c_seller_id_online: '',
      q27c_nama_pemilik_seller: '',
      q28c_status_operasional_online: '',
      q29c_kepatuhan_platform_online: '',
      q30c_verifikasi_usia_online: '',
      q31_merek_produk: [
        'PODA Signature Series (Freebase 60ml & Salt 30ml)',
        'PODA Ice Blast & Fruits (Fresh & Menthol Series)',
      ],
      q32_sumber_pembelian: 'Distributor',
      q33_nama_distributor: 'CV. Vapor Distribusi Nusantara',
      q34_kota_distributor: 'Jakarta Barat',
      q35_sedia_bukti_pembelian: 'Ya, bersedia',
      q36_dokumen_nib: {
        fileName: 'NIB_Poda_Cloud_Vape.pdf',
        fileSize: 420000,
        fileType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
      },
      q37_foto_depan_toko: {
        fileName: 'depan_toko_kemang.jpg',
        fileSize: 850000,
        fileType: 'image/jpeg',
        uploadedAt: new Date().toISOString(),
      },
      q38_screenshot_toko_online: null,
      q39_bukti_pembelian: {
        fileName: 'Invoice_Distributor_VDN.pdf',
        fileSize: 310000,
        fileType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
      },
      q40_surat_kuasa: null,
      q41_dokumen_pengurus: null,
      q42_persetujuan_ketentuan: true,
      q43_persetujuan_privasi: true,
      q44_nama_pernyataan: 'Hendro Wijaya',
      q45_pernyataan_kebenaran: true,
      q46_persetujuan_verifikasi: true,
    },
  },
];

class DataService {
  private broadcastChannel: BroadcastChannel | null = null;
  private sseEventSource: EventSource | null = null;
  private reconnectTimeout: any = null;
  private pollingInterval: any = null;
  private isConnected: boolean = false;
  private listeners: {
    submissions: Array<(subs: ResellerSubmission[]) => void>;
    settings: Array<(settings: FormSettings) => void>;
    connection: Array<(connected: boolean) => void>;
  } = {
    submissions: [],
    settings: [],
    connection: [],
  };

  constructor() {
    cleanBloatedLocalStorage();
    this.initBroadcastChannel();
    this.initStorageEventListener();
    this.initSSE();
    this.startBackgroundSync();
  }

  // Resolves backend API URL (supports custom URL or Vite env var for Netlify deployments)
  public getApiUrl(endpoint: string): string {
    let base = '';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('poda_api_backend_url');
      if (stored && stored.trim()) {
        base = stored.trim().replace(/\/$/, '');
      }
    }
    if (!base && typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) {
      base = String((import.meta as any).env.VITE_API_BASE_URL).trim().replace(/\/$/, '');
    }
    return `${base}${endpoint}`;
  }

  public setCustomBackendUrl(url: string) {
    if (typeof window !== 'undefined') {
      if (url && url.trim()) {
        localStorage.setItem('poda_api_backend_url', url.trim().replace(/\/$/, ''));
      } else {
        localStorage.removeItem('poda_api_backend_url');
      }
      // Reconnect SSE with new backend URL
      this.initSSE();
      this.fetchSubmissions().then((subs) => this.notifySubmissionsListeners(subs));
    }
  }

  public getCustomBackendUrl(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('poda_api_backend_url') || (import.meta as any).env?.VITE_API_BASE_URL || '';
    }
    return '';
  }

  // Cross-Tab instant sync using BroadcastChannel
  private initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('poda_realtime_sync_channel');
        this.broadcastChannel.onmessage = (event) => {
          const { type, payload } = event.data || {};
          if (type === 'SUBMISSIONS_UPDATED') {
            this.notifySubmissionsListeners(payload);
          } else if (type === 'SETTINGS_UPDATED') {
            this.notifySettingsListeners(payload);
          }
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported or restricted:', e);
      }
    }
  }

  // Secondary Cross-Tab fallback using window storage event
  private initStorageEventListener() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === SUBMISSIONS_STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifySubmissionsListeners(parsed);
          } catch {}
        } else if (e.key === SETTINGS_STORAGE_KEY && e.newValue) {
          try {
            const parsed = JSON.parse(e.newValue);
            this.notifySettingsListeners(parsed);
          } catch {}
        }
      });
    }
  }

  // Server-Sent Events (SSE) for server-side real-time multi-user sync
  public initSSE() {
    if (typeof window === 'undefined' || !('EventSource' in window)) return;

    try {
      if (this.sseEventSource) {
        this.sseEventSource.close();
        this.sseEventSource = null;
      }

      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }

      const sseUrl = this.getApiUrl('/api/sync/events');
      const es = new EventSource(sseUrl);
      this.sseEventSource = es;

      es.onopen = () => {
        this.isConnected = true;
        this.notifyConnectionListeners(true);
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (
            data.type === 'NEW_SUBMISSION' ||
            data.type === 'SUBMISSION_CREATED' ||
            data.type === 'STATUS_UPDATED' ||
            data.type === 'SUBMISSION_UPDATED'
          ) {
            // Immediate fresh fetch from server
            this.fetchSubmissions().then((subs) => {
              this.notifySubmissionsListeners(subs);
            });
          } else if (data.type === 'SETTINGS_UPDATED') {
            if (data.payload) {
              this.notifySettingsListeners(data.payload);
            } else {
              this.fetchFormSettings().then((s) => this.notifySettingsListeners(s));
            }
          }
        } catch (err) {
          console.error('Error handling SSE message:', err);
        }
      };

      es.onerror = () => {
        this.isConnected = false;
        this.notifyConnectionListeners(false);
        try {
          es.close();
        } catch {}
        this.sseEventSource = null;

        // Auto-reconnect with exponential backoff
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.initSSE();
          }, 3500);
        }
      };
    } catch {
      this.isConnected = false;
      this.notifyConnectionListeners(false);
    }
  }

  // Gentle background synchronization to guarantee concurrent submissions are caught across devices
  private startBackgroundSync() {
    if (typeof window === 'undefined') return;
    if (this.pollingInterval) clearInterval(this.pollingInterval);

    this.pollingInterval = setInterval(async () => {
      // Only poll if document is visible to save battery and network
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        try {
          const subs = await this.fetchSubmissions();
          if (subs && subs.length > 0) {
            this.notifySubmissionsListeners(subs);
          }
        } catch {}
      }
    }, 12000);
  }

  private broadcastLocalChange(type: 'SUBMISSIONS_UPDATED' | 'SETTINGS_UPDATED', payload: any) {
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage({ type, payload });
      } catch {}
    }
  }

  // Subscriptions
  public onSubmissions(cb: (subs: ResellerSubmission[]) => void) {
    this.listeners.submissions.push(cb);
    return () => {
      this.listeners.submissions = this.listeners.submissions.filter((c) => c !== cb);
    };
  }

  public onSettings(cb: (settings: FormSettings) => void) {
    this.listeners.settings.push(cb);
    return () => {
      this.listeners.settings = this.listeners.settings.filter((c) => c !== cb);
    };
  }

  public onConnection(cb: (connected: boolean) => void) {
    this.listeners.connection.push(cb);
    return () => {
      this.listeners.connection = this.listeners.connection.filter((c) => c !== cb);
    };
  }

  private notifySubmissionsListeners(subs: ResellerSubmission[]) {
    this.listeners.submissions.forEach((cb) => {
      try {
        cb(subs);
      } catch (e) {
        console.error(e);
      }
    });
  }

  private notifySettingsListeners(settings: FormSettings) {
    this.listeners.settings.forEach((cb) => {
      try {
        cb(settings);
      } catch (e) {
        console.error(e);
      }
    });
  }

  private notifyConnectionListeners(connected: boolean) {
    this.listeners.connection.forEach((cb) => {
      try {
        cb(connected);
      } catch (e) {
        console.error(e);
      }
    });
  }

  // --- Submissions CRUD with Dual-Layer Persistence (Server + IndexedDB + safe localStorage) ---
  public async fetchSubmissions(): Promise<ResellerSubmission[]> {
    try {
      const url = this.getApiUrl('/api/submissions');
      const res = await fetch(url);
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (Array.isArray(data)) {
            // Store full data in IndexedDB (handles hundreds of MBs safely)
            await idbSaveAllSubmissions(data);

            // Store sanitized light version in localStorage (strips heavy dataUrl)
            const sanitized = sanitizeSubmissionsListForLocalStorage(data);
            safeSetLocalStorage(SUBMISSIONS_STORAGE_KEY, JSON.stringify(sanitized));

            return data;
          }
        }
      }
    } catch {
      // Server offline or static Netlify hosting
    }

    // Try IndexedDB first (contains complete documents)
    try {
      const idbList = await idbGetAllSubmissions();
      if (idbList && idbList.length > 0) {
        return idbList;
      }
    } catch (e) {
      console.warn('IDB fetch fallback:', e);
    }

    // Secondary fallback: localStorage
    const local = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {}
    }

    // Default seed
    const initialSanitized = sanitizeSubmissionsListForLocalStorage(INITIAL_OFFLINE_SUBMISSIONS);
    safeSetLocalStorage(SUBMISSIONS_STORAGE_KEY, JSON.stringify(initialSanitized));
    await idbSaveAllSubmissions(INITIAL_OFFLINE_SUBMISSIONS);
    return INITIAL_OFFLINE_SUBMISSIONS;
  }

  public async saveSubmission(
    formData: ResellerFormData,
    draftToken?: string
  ): Promise<ResellerSubmission> {
    const payload = { ...formData, draftToken };

    // 1. Try sending to backend server if available
    try {
      const url = this.getApiUrl('/api/submissions');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const result = await res.json();
          const serverSubmission: ResellerSubmission = result.submission;

          // Save full submission to IndexedDB (no quota limit)
          await idbSaveSubmission(serverSubmission);

          // Update local mirror safely without quota crash
          const currentList = await this.fetchSubmissions();
          const updatedList = [serverSubmission, ...currentList.filter((s) => s.id !== serverSubmission.id)];

          // Strip heavy base64 strings before saving to localStorage to prevent QuotaExceededError
          const sanitized = sanitizeSubmissionsListForLocalStorage(updatedList);
          safeSetLocalStorage(SUBMISSIONS_STORAGE_KEY, JSON.stringify(sanitized));

          this.broadcastLocalChange('SUBMISSIONS_UPDATED', updatedList);
          this.notifySubmissionsListeners(updatedList);

          return serverSubmission;
        }
      }
    } catch (e) {
      console.warn('Network submission fallback to client-side storage:', e);
    }

    // 2. Client-side creation for static Netlify or offline mode
    const evaluation = evaluateApplication(formData);
    const existing = await this.fetchSubmissions();
    const count = existing.length + 1;
    const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '');
    const regNum = `PODA-RES-${yearMonth}-${String(count).padStart(4, '0')}`;

    const newSubmission: ResellerSubmission = {
      id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      registrationNumber: regNum,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: evaluation.rekomendasi === 'Dapat diajukan untuk persetujuan' ? 'dapat_disetujui' : 'menunggu_verifikasi',
      rekomendasiSistem: evaluation.rekomendasi,
      alasanRekomendasi: evaluation.alasan,
      data: formData,
    };

    // Save full document to IndexedDB (supports unlimited storage)
    await idbSaveSubmission(newSubmission);

    // Save sanitized list to localStorage (never exceeds 5MB quota)
    const updated = [newSubmission, ...existing];
    const sanitized = sanitizeSubmissionsListForLocalStorage(updated);
    safeSetLocalStorage(SUBMISSIONS_STORAGE_KEY, JSON.stringify(sanitized));

    this.broadcastLocalChange('SUBMISSIONS_UPDATED', updated);
    this.notifySubmissionsListeners(updated);

    return newSubmission;
  }

  public async updateSubmissionStatus(
    id: string,
    status: SubmissionStatus,
    catatanAdmin?: string,
    adminName?: string,
    nomorSuratPenunjukan?: string
  ): Promise<ResellerSubmission | null> {
    try {
      const url = this.getApiUrl(`/api/submissions/${id}/status`);
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          catatanAdmin,
          adminName: adminName || 'Verifikator Sales PT. PODA E-LIQUID COMPANY',
          nomorSuratPenunjukan,
        }),
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const result = await res.json();
          const updatedSub: ResellerSubmission = result.submission;
          await idbSaveSubmission(updatedSub);
          const subs = await this.fetchSubmissions();
          this.broadcastLocalChange('SUBMISSIONS_UPDATED', subs);
          this.notifySubmissionsListeners(subs);
          return updatedSub;
        }
      }
    } catch {
      // Fallback
    }

    // Local update
    const list = await this.fetchSubmissions();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return null;

    const sub = list[idx];
    sub.status = status;
    sub.updatedAt = new Date().toISOString();
    if (catatanAdmin !== undefined) sub.catatanAdmin = catatanAdmin;
    if (status === 'disetujui') {
      sub.tanggalDisetujui = new Date().toISOString();
      sub.disetujuiOleh = adminName || 'Direktur Sales PT. PODA E-LIQUID COMPANY';
      sub.nomorSuratPenunjukan =
        nomorSuratPenunjukan ||
        sub.nomorSuratPenunjukan ||
        `SK/PODA-RES/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}`;
    }

    list[idx] = sub;
    await idbSaveSubmission(sub);

    const sanitized = sanitizeSubmissionsListForLocalStorage(list);
    safeSetLocalStorage(SUBMISSIONS_STORAGE_KEY, JSON.stringify(sanitized));

    this.broadcastLocalChange('SUBMISSIONS_UPDATED', list);
    this.notifySubmissionsListeners(list);
    return sub;
  }

  // --- Form Settings with Realtime Broadcast ---
  public async fetchFormSettings(): Promise<FormSettings> {
    try {
      const url = this.getApiUrl('/api/form-settings');
      const res = await fetch(url);
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.companyName) {
            safeSetLocalStorage(SETTINGS_STORAGE_KEY, JSON.stringify(data));
            return data;
          }
        }
      }
    } catch {
      // Fallback
    }

    const local = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }

    safeSetLocalStorage(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_FORM_SETTINGS));
    return DEFAULT_FORM_SETTINGS;
  }

  public async saveFormSettings(settings: FormSettings): Promise<boolean> {
    settings.updatedAt = new Date().toISOString();

    try {
      const url = this.getApiUrl('/api/form-settings');
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
    } catch {
      // Fallback
    }

    safeSetLocalStorage(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    this.broadcastLocalChange('SETTINGS_UPDATED', settings);
    this.notifySettingsListeners(settings);

    return true;
  }

  // --- Auto-Save Drafts with Quota-Proofing ---
  public async saveDraft(token: string, data: ResellerFormData, step: StepKey): Promise<string> {
    const payload = {
      token,
      data,
      step,
      savedAt: new Date().toISOString(),
    };

    // Save full draft in IndexedDB (no quota issues)
    await idbSaveDraft(token, payload);

    // Save sanitized backup in localStorage without heavy files
    const sanitizedSubmissionLike = sanitizeSubmissionForLocalStorage({
      id: token,
      registrationNumber: '',
      createdAt: '',
      updatedAt: '',
      status: 'menunggu_verifikasi',
      rekomendasiSistem: 'Dapat dilanjutkan',
      alasanRekomendasi: '',
      data,
    });

    const lightPayload = {
      token,
      data: sanitizedSubmissionLike.data,
      step,
      savedAt: payload.savedAt,
    };

    safeSetLocalStorage(DRAFT_STORAGE_PREFIX + token, JSON.stringify(lightPayload));
    safeSetLocalStorage('poda_reseller_form_backup', JSON.stringify(lightPayload));

    try {
      const url = this.getApiUrl('/api/draft');
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await res.json();
          return json.savedAt || payload.savedAt;
        }
      }
    } catch {
      // Fallback
    }

    return payload.savedAt;
  }

  public async getDraft(token: string): Promise<any | null> {
    // Check IndexedDB first for full draft
    const idbDraft = await idbGetDraft(token);
    if (idbDraft) return idbDraft;

    // Fallback to localStorage
    const local = localStorage.getItem(DRAFT_STORAGE_PREFIX + token);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return null;
  }
}

export const dataService = new DataService();
