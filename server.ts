import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { evaluateApplication } from './src/utils/evaluation';
import { ResellerSubmission, ResellerFormData, SubmissionStatus, FormSettings } from './src/types/formData';
import { DEFAULT_FORM_SETTINGS } from './src/utils/defaultSettings';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const DRAFTS_FILE = path.join(DATA_DIR, 'drafts.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Concurrency control: AsyncMutex ensures sequential read-modify-write operations
// so simultaneous submissions from multiple users never overwrite each other
class AsyncMutex {
  private queue: Promise<void> = Promise.resolve();

  async runExclusive<T>(fn: () => Promise<T> | T): Promise<T> {
    const result = this.queue.then(async () => {
      return await fn();
    });
    // Ensure the queue always proceeds even if fn throws
    this.queue = result.then(
      () => {},
      () => {}
    );
    return result;
  }
}

const submissionMutex = new AsyncMutex();
const settingsMutex = new AsyncMutex();
const draftsMutex = new AsyncMutex();

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

// Atomic write ensures no file corruption or partial reads during concurrent operations
function atomicWriteJSON<T>(filePath: string, data: T): void {
  const dir = path.dirname(filePath);
  const tempPath = path.join(
    dir,
    `.${path.basename(filePath)}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 7)}`
  );
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error(`Error atomically writing ${filePath}:`, err);
    try {
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch {}
    // Fallback direct write
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (directErr) {
      console.error(`Direct write fallback failed for ${filePath}:`, directErr);
    }
  }
}

function writeJSON<T>(filePath: string, data: T): void {
  atomicWriteJSON(filePath, data);
}

// Active Server-Sent Events (SSE) connections for real-time synchronization
const sseClients = new Set<Response>();

function broadcastRealtime(event: { type: string; payload: any }) {
  const data = `data: ${JSON.stringify(event)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(data);
    } catch {
      sseClients.delete(client);
    }
  });
}

// Initial sample submissions for sales team demo if empty
function initializeDatabase() {
  const existing = readJSON<ResellerSubmission[]>(SUBMISSIONS_FILE, []);
  if (existing.length === 0) {
    const sampleData: ResellerSubmission[] = [
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
    writeJSON(SUBMISSIONS_FILE, sampleData);
  }

  // Ensure default form settings exist
  const existingSettings = readJSON<FormSettings | null>(SETTINGS_FILE, null);
  if (!existingSettings) {
    writeJSON(SETTINGS_FILE, DEFAULT_FORM_SETTINGS);
  }
}

initializeDatabase();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // JSON payload parser for base64 file attachments
  app.use(express.json({ limit: '40mb' }));
  app.use(express.urlencoded({ extended: true, limit: '40mb' }));

  // Enable CORS for multi-origin requests (e.g. Netlify frontend communicating with backend)
  app.use((req: Request, res: Response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Real-time Server-Sent Events (SSE) synchronization endpoint
  app.get('/api/sync/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders?.();

    // Register active client
    sseClients.add(res);

    // Initial greeting
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    // Keepalive ping every 20 seconds
    const interval = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ type: 'PING' })}\n\n`);
      } catch {
        clearInterval(interval);
      }
    }, 20000);

    req.on('close', () => {
      clearInterval(interval);
      sseClients.delete(res);
    });
  });

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    const list = readJSON<ResellerSubmission[]>(SUBMISSIONS_FILE, []);
    res.json({
      status: 'ok',
      service: 'PT. PODA E-LIQUID COMPANY Reseller Registration API',
      time: new Date().toISOString(),
      activeRealtimeClients: sseClients.size,
      totalSubmissions: list.length,
    });
  });

  // Form Settings Endpoints
  app.get('/api/form-settings', (_req: Request, res: Response) => {
    const settings = readJSON<FormSettings>(SETTINGS_FILE, DEFAULT_FORM_SETTINGS);
    res.json(settings);
  });

  app.post('/api/form-settings', async (req: Request, res: Response) => {
    const newSettings = req.body as FormSettings;
    if (!newSettings || !newSettings.companyName) {
      return res.status(400).json({ error: 'Pengaturan formulir tidak valid' });
    }

    try {
      await settingsMutex.runExclusive(() => {
        newSettings.updatedAt = new Date().toISOString();
        writeJSON(SETTINGS_FILE, newSettings);

        broadcastRealtime({
          type: 'SETTINGS_UPDATED',
          payload: newSettings,
        });
      });

      res.json({ success: true, settings: newSettings });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal memperbarui pengaturan: ' + (err.message || String(err)) });
    }
  });

  // Get all submissions
  app.get('/api/submissions', (_req: Request, res: Response) => {
    const list = readJSON<ResellerSubmission[]>(SUBMISSIONS_FILE, []);
    // sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
  });

  // Submit new reseller registration with concurrency lock
  app.post('/api/submissions', async (req: Request, res: Response) => {
    const formData = req.body as ResellerFormData;
    if (!formData) {
      return res.status(400).json({ error: 'Payload data formulir kosong' });
    }

    try {
      const newSubmission = await submissionMutex.runExclusive(async () => {
        const submissions = readJSON<ResellerSubmission[]>(SUBMISSIONS_FILE, []);
        const evaluation = evaluateApplication(formData);

        const date = new Date();
        const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

        // Find highest existing sequence for the current month to prevent duplicate registration numbers
        let maxSeq = 0;
        submissions.forEach((s) => {
          if (s.registrationNumber && s.registrationNumber.startsWith(`PODA-RES-${yearMonth}-`)) {
            const parts = s.registrationNumber.split('-');
            const seq = parseInt(parts[parts.length - 1], 10);
            if (!isNaN(seq) && seq > maxSeq) {
              maxSeq = seq;
            }
          }
        });

        const nextSeqNum = Math.max(maxSeq + 1, submissions.length + 1);
        const nextSeq = String(nextSeqNum).padStart(4, '0');
        const registrationNumber = `PODA-RES-${yearMonth}-${nextSeq}`;

        let initialStatus: SubmissionStatus = 'menunggu_verifikasi';
        if (evaluation.rekomendasi === 'Dapat diajukan untuk persetujuan') {
          initialStatus = 'dapat_disetujui';
        } else if (evaluation.rekomendasi === 'Tahan permohonan') {
          initialStatus = 'tahan_permohonan';
        } else if (evaluation.rekomendasi === 'Tolak otorisasi untuk lokasi atau platform tersebut') {
          initialStatus = 'ditolak';
        }

        // Sanitize document fields: keep compressed images (under 500KB)
        // Only strip oversized uncompressed blobs (> 600KB) to prevent storage bloat
        const docFields = [
          'q36_dokumen_nib',
          'q37_foto_depan_toko',
          'q38_screenshot_toko_online',
          'q39_bukti_pembelian',
          'q40_surat_kuasa',
          'q41_dokumen_pengurus',
        ];
        docFields.forEach((field) => {
          const doc = (formData as any)[field];
          if (doc && doc.dataUrl && doc.dataUrl.length > 600000) {
            delete doc.dataUrl;
          }
        });

        const submissionItem: ResellerSubmission = {
          id: `poda-sub-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
          registrationNumber,
          createdAt: date.toISOString(),
          updatedAt: date.toISOString(),
          status: initialStatus,
          rekomendasiSistem: evaluation.rekomendasi,
          alasanRekomendasi: evaluation.alasan,
          data: formData,
        };

        // Insert newest submission at the beginning
        submissions.unshift(submissionItem);
        atomicWriteJSON(SUBMISSIONS_FILE, submissions);

        // If draft token was present in body, clear that draft
        if ((req.body as any).draftToken) {
          const drafts = readJSON<Record<string, any>>(DRAFTS_FILE, {});
          delete drafts[(req.body as any).draftToken];
          atomicWriteJSON(DRAFTS_FILE, drafts);
        }

        // Broadcast new submission in real-time to all connected sales/admin screens!
        broadcastRealtime({
          type: 'SUBMISSION_CREATED',
          payload: submissionItem,
        });

        return submissionItem;
      });

      res.status(201).json({
        success: true,
        submission: newSubmission,
        message: 'Pendaftaran reseller berhasil disimpan ke database PT. PODA E-LIQUID COMPANY.',
      });
    } catch (err: any) {
      console.error('Submission processing error:', err);
      res.status(500).json({
        error: 'Terjadi kesalahan sistem saat menyimpan pendaftaran: ' + (err.message || String(err)),
      });
    }
  });

  // Auto-save draft with draftsMutex
  app.post('/api/draft', async (req: Request, res: Response) => {
    const { token, data, step } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token draft diperlukan' });
    }

    try {
      const savedAt = await draftsMutex.runExclusive(() => {
        const drafts = readJSON<Record<string, any>>(DRAFTS_FILE, {});
        const time = new Date().toISOString();
        drafts[token] = {
          token,
          data,
          step,
          savedAt: time,
        };
        atomicWriteJSON(DRAFTS_FILE, drafts);

        broadcastRealtime({
          type: 'DRAFT_SAVED',
          payload: { token, savedAt: time },
        });

        return time;
      });

      res.json({ success: true, savedAt });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal menyimpan draft: ' + (err.message || String(err)) });
    }
  });

  // Retrieve saved draft
  app.get('/api/draft/:token', (req: Request, res: Response) => {
    const { token } = req.params;
    const drafts = readJSON<Record<string, any>>(DRAFTS_FILE, {});
    const draft = drafts[token];
    if (!draft) {
      return res.status(404).json({ error: 'Draft tidak ditemukan' });
    }
    res.json(draft);
  });

  // Update submission status with submissionMutex
  app.patch('/api/submissions/:id/status', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, catatanAdmin, adminName } = req.body;

    try {
      const updatedSub = await submissionMutex.runExclusive(() => {
        const submissions = readJSON<ResellerSubmission[]>(SUBMISSIONS_FILE, []);
        const index = submissions.findIndex((s) => s.id === id);

        if (index === -1) {
          return null;
        }

        const current = submissions[index];
        current.status = status || current.status;
        if (catatanAdmin !== undefined) current.catatanAdmin = catatanAdmin;
        current.updatedAt = new Date().toISOString();

        if (status === 'disetujui' && !current.nomorSuratPenunjukan) {
          const year = new Date().getFullYear();
          const month = String(new Date().getMonth() + 1).padStart(2, '0');
          const letterSeq = String(index + 1).padStart(3, '0');
          current.nomorSuratPenunjukan = `SPR/PODA/${year}/${month}/${letterSeq}`;
          current.tanggalDisetujui = new Date().toISOString();
          current.disetujuiOleh = adminName || 'Tim Legal & Otorisasi PT. PODA E-LIQUID COMPANY';
        }

        submissions[index] = current;
        atomicWriteJSON(SUBMISSIONS_FILE, submissions);

        broadcastRealtime({
          type: 'SUBMISSION_UPDATED',
          payload: current,
        });

        return current;
      });

      if (!updatedSub) {
        return res.status(404).json({ error: 'Data pendaftaran tidak ditemukan' });
      }

      res.json({ success: true, submission: updatedSub });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal memperbarui status: ' + (err.message || String(err)) });
    }
  });

  // Get statistics for dashboard
  app.get('/api/stats', (_req: Request, res: Response) => {
    const list = readJSON<ResellerSubmission[]>(SUBMISSIONS_FILE, []);
    const stats = {
      total: list.length,
      menunggu: list.filter((s) => s.status === 'menunggu_verifikasi').length,
      dapatDisetujui: list.filter((s) => s.status === 'dapat_disetujui').length,
      disetujui: list.filter((s) => s.status === 'disetujui').length,
      tahan: list.filter((s) => s.status === 'tahan_permohonan').length,
      perluDokumen: list.filter((s) => s.status === 'perlu_dokumen_tambahan').length,
      ditolak: list.filter((s) => s.status === 'ditolak').length,
      channelStats: {
        fisik: list.filter((s) => s.data.q15_saluran_penjualan === 'Toko Fisik Saja').length,
        online: list.filter((s) => s.data.q15_saluran_penjualan === 'Toko Online Saja').length,
        keduanya: list.filter((s) => s.data.q15_saluran_penjualan === 'Toko Fisik dan Toko Online').length,
      },
    };
    res.json(stats);
  });

  // Mount Vite dev server in non-production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PT. PODA E-LIQUID COMPANY] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
