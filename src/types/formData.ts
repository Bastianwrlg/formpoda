export type HubunganPemohon =
  | 'Pemilik usaha perseorangan'
  | 'Direktur/pengurus badan usaha yang berwenang'
  | 'Penerima kuasa dari pemilik atau pengurus yang berwenang';

export type BentukUsaha =
  | 'Usaha perseorangan'
  | 'Perseroan Terbatas (PT)'
  | 'Persekutuan Komanditer (CV)'
  | 'Koperasi'
  | 'Bentuk usaha lainnya';

export type SaluranPenjualan =
  | 'Toko Fisik Saja'
  | 'Toko Online Saja'
  | 'Toko Fisik dan Toko Online';

export type MarketplacePlatform =
  | 'Shopee'
  | 'Tokopedia'
  | 'TikTok Shop'
  | 'Lazada'
  | 'Website toko sendiri'
  | 'Platform lainnya';

export type StatusOperasional = 'Sudah beroperasi' | 'Belum beroperasi';
export type StatusOperasionalOnline = 'Sudah aktif' | 'Belum aktif';
export type JawabanKepatuhan = 'Ya' | 'Tidak' | 'Belum dapat memastikan';
export type JawabanPlatform =
  | 'Ya, berdasarkan ketentuan platform yang berlaku'
  | 'Tidak'
  | 'Belum dapat memastikan';

export type SumberPembelian =
  | 'Distributor'
  | 'Pembelian langsung dari perusahaan'
  | 'Belum pernah melakukan pembelian';

export type SediaBukti = 'Ya, bersedia' | 'Tidak bersedia';

export interface UploadedDoc {
  fileName: string;
  fileSize: number;
  fileType: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface ResellerFormData {
  // Page 2: Identitas Pemohon
  q1_nama_pemohon: string;
  q2_hubungan_pemohon: HubunganPemohon | '';
  q3_whatsapp_pemohon: string;
  q4_email_pemohon: string;
  q5_nama_pemilik: string;
  q6_whatsapp_pemilik: string;
  q7_email_pemilik: string;
  pemilik_sama_dengan_pemohon?: boolean;

  // Page 3: Identitas Usaha
  q8_nama_toko: string;
  q9_bentuk_usaha: BentukUsaha | '';
  q10_nama_pemilik_usaha: string;
  q11_nib: string;
  q12_alamat_usaha: string;
  q13_kota_kabupaten: string;
  q14_provinsi: string;

  // Page 4: Jenis Saluran Penjualan
  q15_saluran_penjualan: SaluranPenjualan | '';

  // Page 5A: Toko Fisik Saja
  q16a_nama_toko_fisik: string;
  q17a_alamat_toko_fisik: string;
  q18a_maps_toko_fisik: string;
  q19a_penanggung_jawab_fisik: string;
  q20a_whatsapp_toko_fisik: string;
  q21a_status_operasional_fisik: StatusOperasional | '';
  q22a_kepatuhan_lokasi_fisik: JawabanKepatuhan | '';

  // Page 5B: Toko Online Saja
  q16b_nama_toko_online: string;
  q17b_platform_online: MarketplacePlatform | '';
  q18b_link_online: string;
  q19b_seller_id_online: string;
  q20b_nama_pemilik_seller: string;
  q21b_status_operasional_online: StatusOperasionalOnline | '';
  q22b_kepatuhan_platform_online: JawabanPlatform | '';
  q23b_verifikasi_usia_online: JawabanKepatuhan | '';

  // Page 5C: Toko Fisik dan Toko Online
  // Fisik:
  q16c_nama_toko_fisik: string;
  q17c_alamat_toko_fisik: string;
  q18c_maps_toko_fisik: string;
  q19c_penanggung_jawab_fisik: string;
  q20c_whatsapp_toko_fisik: string;
  q21c_status_operasional_fisik: StatusOperasional | '';
  q22c_kepatuhan_lokasi_fisik: JawabanKepatuhan | '';
  // Online:
  q23c_nama_toko_online: string;
  q24c_platform_online: MarketplacePlatform | '';
  q25c_link_online: string;
  q26c_seller_id_online: string;
  q27c_nama_pemilik_seller: string;
  q28c_status_operasional_online: StatusOperasionalOnline | '';
  q29c_kepatuhan_platform_online: JawabanPlatform | '';
  q30c_verifikasi_usia_online: JawabanKepatuhan | '';

  // Page 6: Informasi Produk dan Distributor
  q31_merek_produk: string[];
  q32_sumber_pembelian: SumberPembelian | '';
  q33_nama_distributor: string;
  q34_kota_distributor: string;
  q35_sedia_bukti_pembelian: SediaBukti | '';

  // Page 7: Upload Dokumen
  q36_dokumen_nib: UploadedDoc | null;
  q37_foto_depan_toko: UploadedDoc | null;
  q38_screenshot_toko_online: UploadedDoc | null;
  q39_bukti_pembelian: UploadedDoc | null;
  q40_surat_kuasa: UploadedDoc | null;
  q41_dokumen_pengurus: UploadedDoc | null;

  // Page 8: Ketentuan Reseller dan Privasi
  q42_persetujuan_ketentuan: boolean;
  q43_persetujuan_privasi: boolean;

  // Page 9: Pernyataan dan Konfirmasi Pemohon
  q44_nama_pernyataan: string;
  q45_pernyataan_kebenaran: boolean;
  q46_persetujuan_verifikasi: boolean;
}

export type SubmissionStatus =
  | 'menunggu_verifikasi'
  | 'dapat_disetujui'
  | 'disetujui'
  | 'tahan_permohonan'
  | 'perlu_dokumen_tambahan'
  | 'ditolak';

export type RekomendasiSistem =
  | 'Dapat diajukan untuk persetujuan'
  | 'Dapat dilanjutkan'
  | 'Tahan permohonan'
  | 'Tolak otorisasi untuk lokasi atau platform tersebut';

export interface ResellerSubmission {
  id: string;
  registrationNumber: string; // e.g. PODA-RES-202610-0012
  createdAt: string;
  updatedAt: string;
  status: SubmissionStatus;
  rekomendasiSistem: RekomendasiSistem;
  alasanRekomendasi: string;
  catatanAdmin?: string;
  nomorSuratPenunjukan?: string;
  tanggalDisetujui?: string;
  disetujuiOleh?: string;
  data: ResellerFormData;
}

export type StepKey =
  | 'page-1'
  | 'page-2'
  | 'page-3'
  | 'page-4'
  | 'page-5A'
  | 'page-5B'
  | 'page-5C'
  | 'page-6'
  | 'page-7'
  | 'page-8'
  | 'page-9'
  | 'success';

export interface PageCustomization {
  title: string;
  subtitle: string;
  helpText?: string;
  enabled?: boolean;
}

export interface AnnouncementBanner {
  enabled: boolean;
  text: string;
  type: 'info' | 'warning' | 'success';
}

export interface FormSettings {
  companyName: string;
  companyEmail: string;
  privacyEmail: string;
  companyPhone: string;
  formVersion: string;
  productBrands: string[];
  ketentuanPoin: string[];
  pernyataanAkhirPoin: string[];
  pages: Record<string, PageCustomization>;
  announcementBanner?: AnnouncementBanner;
  adminPin?: string;
  updatedAt?: string;
  updatedBy?: string;
}

