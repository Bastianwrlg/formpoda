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

function writeJSON<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
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

  // Real-time Server-Sent Events (SSE) synchronization endpoint
  app.get('/api/sync/events', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    // Register active client
    sseClients.add(res);

    // Initial greeting
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', timestamp: new Date().toISOString() })}\n\n`);

    // Keepalive ping every 25 seconds
    const interval = setInterval(() => {
      try {
        res.write(`data: ${JSON.stringify({ type: 'PING' })}\n\n`);
      } catch {
        clearInterval(interval);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(interval);
      sseClients.delete(res);
    });
  });

  // API Routes
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'PT. PODA E-LIQUID COMPANY Reseller Registration API',
      time: new Date().toISOString(),
      activeRealtimeClients: sseClients.size,
    });
  });

  // Form Settings Endpoints
  app.get('/api/form-settings', (_req: Request, res: Response) => {
    const settings = readJSON<FormSettings>(SETTINGS_FILE, DEFAULT_FORM_SETTINGS);
    res.json(settings);
  });

  app.post('/api/form-settings', (req: Request, res: Response) => {
    const newSettings = req.body as FormSettings;
    if (!newSettings || !newSettings.companyName) {
      return res.status(400).json({ error: 'Pengaturan formulir tidak valid' });
    }

    newSettings.updatedAt = new Date().toISOString();
    writeJSON(SETTINGS_FILE, newSettings);

    // Broadcast change to all users currently filling the form or viewing admin!
    broadcastRealtime({
      type: 'SETTINGS_UPDATED',
      payload: newSettings,
    });

    res.json({ success: true, settings: newSettings });
  });

  // Get all submissions
  app.get('/api/submissions', (_req: Request, res: Response) => {
    const list = readJSON<ResellerSubmission[]>(SUBMISSIONS_FILE, []);
    // sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
  });

  // Submit new reseller registration
  app.post('/api/submissions', (req: Request, res: Response) => {
    const formData = req.body as ResellerFormData;
    if (!formData) {
      return res.status(400).json({ error: 'Payload data formulir kosong' });
    }

    const submissions = readJSON<ResellerSubmission[]>(SUBMISSIONS_FILE, []);
    const evaluation = evaluateApplication(formData);

    const date = new Date();
    const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
    const nextSeq = String(submissions.length + 1).padStart(4, '0');
    const registrationNumber = `PODA-RES-${yearMonth}-${nextSeq}`;

    let initialStatus: SubmissionStatus = 'menunggu_verifikasi';
    if (evaluation.rekomendasi === 'Dapat diajukan untuk persetujuan') {
      initialStatus = 'dapat_disetujui';
    } else if (evaluation.rekomendasi === 'Tahan permohonan') {
      initialStatus = 'tahan_permohonan';
    } else if (evaluation.rekomendasi === 'Tolak otorisasi untuk lokasi atau platform tersebut') {
      initialStatus = 'ditolak';
    }

    // Sanitize document fields to prevent multi-megabyte bloat in JSON storage
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
      if (doc && doc.dataUrl && doc.dataUrl.length > 100000) {
        delete doc.dataUrl;
      }
    });

    const newSubmission: ResellerSubmission = {
      id: `poda-sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      registrationNumber,
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
      status: initialStatus,
      rekomendasiSistem: evaluation.rekomendasi,
      alasanRekomendasi: evaluation.alasan,
      data: formData,
    };

    submissions.push(newSubmission);
    writeJSON(SUBMISSIONS_FILE, submissions);

    // If draft token was present in body, we can clear that draft
    if ((req.body as any).draftToken) {
      const drafts = readJSON<Record<string, any>>(DRAFTS_FILE, {});
      delete drafts[(req.body as any).draftToken];
      writeJSON(DRAFTS_FILE, drafts);
    }

    // Broadcast new submission in real-time to all connected sales/admin screens!
    broadcastRealtime({
      type: 'SUBMISSION_CREATED',
      payload: newSubmission,
    });

    res.status(201).json({
      success: true,
      submission: newSubmission,
      message: 'Pendaftaran reseller berhasil disimpan ke database PT. PODA E-LIQUID COMPANY.',
    });
  });

  // Auto-save draft
  app.post('/api/draft', (req: Request, res: Response) => {
    const { token, data, step } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Token draft diperlukan' });
    }

    const drafts = readJSON<Record<string, any>>(DRAFTS_FILE, {});
    drafts[token] = {
      token,
      data,
      step,
      savedAt: new Date().toISOString(),
    };
    writeJSON(DRAFTS_FILE, drafts);

    // Broadcast draft save
    broadcastRealtime({
      type: 'DRAFT_SAVED',
      payload: { token, savedAt: drafts[token].savedAt },
    });

    res.json({ success: true, savedAt: drafts[token].savedAt });
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

  // Update submission status by admin / sales
  app.patch('/api/submissions/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, catatanAdmin, adminName } = req.body;

    const submissions = readJSON<ResellerSubmission[]>(SUBMISSIONS_FILE, []);
    const index = submissions.findIndex((s) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Data pendaftaran tidak ditemukan' });
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
    writeJSON(SUBMISSIONS_FILE, submissions);

    // Broadcast update in real-time to all connected users
    broadcastRealtime({
      type: 'SUBMISSION_UPDATED',
      payload: current,
    });

    res.json({ success: true, submission: current });
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
