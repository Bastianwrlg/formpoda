import { ResellerFormData } from '../types/formData';

export const COMPANY_NAME = 'PT. PODA E-LIQUID COMPANY';
export const COMPANY_EMAIL = 'sales@podaeliquid.com';
export const PRIVACY_EMAIL = 'privacy@podaeliquid.com';
export const COMPANY_PHONE = '+62 811-9876-5432';
export const FORM_VERSION = '1.0 — Oktober 2026';

export const INDONESIA_PROVINCES = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Kepulauan Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bangka Belitung',
  'Bengkulu',
  'Lampung',
  'DKI Jakarta',
  'Jawa Barat',
  'Banten',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Gorontalo',
  'Sulawesi Tengah',
  'Sulawesi Barat',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
  'Papua Tengah',
  'Papua Pegunungan',
  'Papua Selatan',
  'Papua Barat Daya',
];

export const PODA_BRANDS = [
  'PODA Signature Series (Freebase 60ml & Salt 30ml)',
  'PODA Artisan Dessert Series (Creamy Flavors)',
  'PODA Ice Blast & Fruits (Fresh & Menthol Series)',
  'PODA Pods Friendly 30ml Series',
  'Merek Lain yang Dikelola PT. PODA E-LIQUID COMPANY',
];

export const INITIAL_FORM_DATA: ResellerFormData = {
  // Page 2: Identitas Pemohon
  q1_nama_pemohon: '',
  q2_hubungan_pemohon: '',
  q3_whatsapp_pemohon: '',
  q4_email_pemohon: '',
  q5_nama_pemilik: '',
  q6_whatsapp_pemilik: '',
  q7_email_pemilik: '',
  pemilik_sama_dengan_pemohon: false,

  // Page 3: Identitas Usaha
  q8_nama_toko: '',
  q9_bentuk_usaha: '',
  q10_nama_pemilik_usaha: '',
  q11_nib: '',
  q12_alamat_usaha: '',
  q13_kota_kabupaten: '',
  q14_provinsi: '',

  // Page 4: Jenis Saluran Penjualan
  q15_saluran_penjualan: '',

  // Page 5A: Toko Fisik Saja
  q16a_nama_toko_fisik: '',
  q17a_alamat_toko_fisik: '',
  q18a_maps_toko_fisik: '',
  q19a_penanggung_jawab_fisik: '',
  q20a_whatsapp_toko_fisik: '',
  q21a_status_operasional_fisik: '',
  q22a_kepatuhan_lokasi_fisik: '',

  // Page 5B: Toko Online Saja
  q16b_nama_toko_online: '',
  q17b_platform_online: '',
  q18b_link_online: '',
  q19b_seller_id_online: '',
  q20b_nama_pemilik_seller: '',
  q21b_status_operasional_online: '',
  q22b_kepatuhan_platform_online: '',
  q23b_verifikasi_usia_online: '',

  // Page 5C: Toko Fisik dan Toko Online
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

  // Page 6: Informasi Produk dan Distributor
  q31_merek_produk: [],
  q32_sumber_pembelian: '',
  q33_nama_distributor: '',
  q34_kota_distributor: '',
  q35_sedia_bukti_pembelian: '',

  // Page 7: Upload Dokumen
  q36_dokumen_nib: null,
  q37_foto_depan_toko: null,
  q38_screenshot_toko_online: null,
  q39_bukti_pembelian: null,
  q40_surat_kuasa: null,
  q41_dokumen_pengurus: null,

  // Page 8: Ketentuan Reseller dan Privasi
  q42_persetujuan_ketentuan: false,
  q43_persetujuan_privasi: false,

  // Page 9: Pernyataan dan Konfirmasi Pemohon
  q44_nama_pernyataan: '',
  q45_pernyataan_kebenaran: false,
  q46_persetujuan_verifikasi: false,
};

export const STEP_CONFIGS = [
  { key: 'page-1', num: 1, title: 'Informasi Pendaftaran', subtitle: 'Tujuan dan ketentuan umum permohonan' },
  { key: 'page-2', num: 2, title: 'Identitas Pemohon', subtitle: 'Identitas pihak yang mengajukan pendaftaran' },
  { key: 'page-3', num: 3, title: 'Identitas Usaha', subtitle: 'Legalitas usaha dan NIB terdaftar' },
  { key: 'page-4', num: 4, title: 'Jenis Saluran Penjualan', subtitle: 'Penentuan jalur fisik, online, atau keduanya' },
  { key: 'page-5A', num: 5, title: 'Informasi Toko Fisik', subtitle: 'Khusus pemohon toko fisik' },
  { key: 'page-5B', num: 5, title: 'Informasi Toko Online', subtitle: 'Khusus pemohon toko online' },
  { key: 'page-5C', num: 5, title: 'Informasi Toko Fisik & Online', subtitle: 'Untuk pemohon dengan kedua saluran' },
  { key: 'page-6', num: 6, title: 'Informasi Produk & Distributor', subtitle: 'Merek produk & sumber pembelian' },
  { key: 'page-7', num: 7, title: 'Dokumen Pendukung', subtitle: 'Unggah bukti verifikasi dan legalitas' },
  { key: 'page-8', num: 8, title: 'Ketentuan Reseller & Privasi', subtitle: 'Pemberitahuan resmi dan persyaratan' },
  { key: 'page-9', num: 9, title: 'Pernyataan & Konfirmasi', subtitle: 'Persetujuan akhir sebelum pengiriman' },
];
