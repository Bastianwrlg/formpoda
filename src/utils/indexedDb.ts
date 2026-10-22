import { ResellerSubmission, ResellerFormData, UploadedDoc } from '../types/formData';

const DB_NAME = 'poda_reseller_db_v1';
const STORE_SUBMISSIONS = 'submissions';
const STORE_DRAFTS = 'drafts';

// Safe localStorage setItem wrapper that never throws QuotaExceededError
export function safeSetLocalStorage(key: string, value: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`[Storage] localStorage.setItem failed for key "${key}". Attempting cleanup...`, error);
    try {
      // Clear out old drafts or oversized submission backups to recover space
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith('poda_reseller_draft_') || k === 'poda_reseller_form_backup')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // Retry once after pruning drafts
      localStorage.setItem(key, value);
      return true;
    } catch (retryError) {
      console.warn(`[Storage] Failed second attempt for "${key}". Storage quota fully reached.`, retryError);
      return false;
    }
  }
}

/**
 * Strips heavy base64 dataUrl properties from documents for localStorage caching,
 * keeping complete metadata (fileName, fileSize, fileType, uploadedAt).
 * The full files with dataUrl are preserved in IndexedDB and backend.
 */
export function sanitizeSubmissionForLocalStorage(sub: ResellerSubmission): ResellerSubmission {
  if (!sub || !sub.data) return sub;
  const newData: ResellerFormData = { ...sub.data };
  const docFields: (keyof ResellerFormData)[] = [
    'q36_dokumen_nib',
    'q37_foto_depan_toko',
    'q38_screenshot_toko_online',
    'q39_bukti_pembelian',
    'q40_surat_kuasa',
    'q41_dokumen_pengurus',
  ];

  docFields.forEach((field) => {
    const doc = (newData as any)[field] as UploadedDoc | null;
    if (doc && doc.dataUrl) {
      (newData as any)[field] = {
        fileName: doc.fileName,
        fileSize: doc.fileSize,
        fileType: doc.fileType,
        uploadedAt: doc.uploadedAt,
      } as UploadedDoc;
    }
  });

  return {
    ...sub,
    data: newData,
  };
}

export function sanitizeSubmissionsListForLocalStorage(list: ResellerSubmission[]): ResellerSubmission[] {
  return list.map(sanitizeSubmissionForLocalStorage);
}

// Cleanup any existing bloated entries in localStorage on app startup
export function cleanBloatedLocalStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem('poda_reseller_submissions_db');
    if (raw) {
      if (raw.includes('data:image/') || raw.length > 50000) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const sanitized = sanitizeSubmissionsListForLocalStorage(parsed);
            safeSetLocalStorage('poda_reseller_submissions_db', JSON.stringify(sanitized));
            console.log('[Storage] Cleaned and sanitized bloated localStorage submissions.');
            return;
          }
        } catch {}
        try {
          localStorage.removeItem('poda_reseller_submissions_db');
        } catch {}
      }
    }
  } catch (e) {
    console.warn('[Storage] Clean bloated localStorage failed, resetting key safely:', e);
    try {
      localStorage.removeItem('poda_reseller_submissions_db');
    } catch {}
  }
}

// Open IndexedDB instance
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_SUBMISSIONS)) {
        db.createObjectStore(STORE_SUBMISSIONS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) {
        db.createObjectStore(STORE_DRAFTS, { keyPath: 'token' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save submission into IndexedDB (supports large documents without quota limits)
export async function idbSaveSubmission(submission: ResellerSubmission): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SUBMISSIONS, 'readwrite');
      const store = tx.objectStore(STORE_SUBMISSIONS);
      const req = store.put(submission);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IDB] Save submission error:', err);
  }
}

// Save bulk submissions into IndexedDB
export async function idbSaveAllSubmissions(submissions: ResellerSubmission[]): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SUBMISSIONS, 'readwrite');
      const store = tx.objectStore(STORE_SUBMISSIONS);
      submissions.forEach((sub) => store.put(sub));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('[IDB] Save all submissions error:', err);
  }
}

// Retrieve all submissions from IndexedDB
export async function idbGetAllSubmissions(): Promise<ResellerSubmission[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SUBMISSIONS, 'readonly');
      const store = tx.objectStore(STORE_SUBMISSIONS);
      const req = store.getAll();
      req.onsuccess = () => {
        const results = (req.result || []) as ResellerSubmission[];
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(results);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IDB] Get all submissions error:', err);
    return [];
  }
}

// Retrieve single submission by ID
export async function idbGetSubmission(id: string): Promise<ResellerSubmission | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_SUBMISSIONS, 'readonly');
      const store = tx.objectStore(STORE_SUBMISSIONS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IDB] Get submission error:', err);
    return null;
  }
}

// Save draft into IndexedDB
export async function idbSaveDraft(token: string, payload: any): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, 'readwrite');
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.put({ token, ...payload });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IDB] Save draft error:', err);
  }
}

// Get draft from IndexedDB
export async function idbGetDraft(token: string): Promise<any | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_DRAFTS, 'readonly');
      const store = tx.objectStore(STORE_DRAFTS);
      const req = store.get(token);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('[IDB] Get draft error:', err);
    return null;
  }
}
