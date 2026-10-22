import { FormSettings } from '../types/formData';
import { COMPANY_NAME, COMPANY_EMAIL, PRIVACY_EMAIL, COMPANY_PHONE, FORM_VERSION, PODA_BRANDS } from './constants';

export const DEFAULT_KETENTUAN_POINTS = [
  'Pendaftaran dilakukan oleh pemilik usaha, pengurus yang berwenang, atau pihak yang memperoleh kuasa yang sah.',
  'Pemohon wajib memberikan informasi usaha yang benar dan dokumen pendukung yang dapat diverifikasi.',
  'Satu pendaftaran berlaku untuk satu lokasi toko fisik dan paling banyak satu akun toko online.',
  'Apabila memiliki beberapa cabang atau akun toko online, pemohon wajib melakukan pendaftaran tambahan.',
  'Seluruh permohonan akan melalui proses pemeriksaan perusahaan.',
  'Pengisian formulir tidak otomatis memberikan status atau hak sebagai reseller.',
  'Surat Penunjukan Reseller hanya diterbitkan kepada pemohon yang disetujui perusahaan.',
  'Surat hanya berlaku untuk identitas toko, merek, dan saluran penjualan yang tercantum dalam surat.',
];

export const DEFAULT_PERNYATAAN_POIN = [
  'Saya adalah pemilik usaha, pengurus yang berwenang, atau pihak yang sah diberi kuasa untuk mewakili usaha yang didaftarkan.',
  'Seluruh informasi dan dokumen yang disampaikan dalam permohonan ini adalah benar dan dapat dipertanggungjawabkan.',
  'Saya telah membaca, memahami, dan menyetujui Ketentuan Reseller yang tercantum dalam permohonan pendaftaran.',
  'Saya memahami bahwa pengajuan ini tidak otomatis memberikan hak atau status sebagai reseller sampai diterbitkannya persetujuan tertulis oleh perusahaan.',
  'Saya bersedia mengikuti proses pemeriksaan dan mempertanggungjawabkan informasi maupun tindakan saya sesuai ketentuan hukum yang berlaku.',
];

export const DEFAULT_FORM_SETTINGS: FormSettings = {
  companyName: COMPANY_NAME,
  companyEmail: COMPANY_EMAIL,
  privacyEmail: PRIVACY_EMAIL,
  companyPhone: COMPANY_PHONE,
  formVersion: FORM_VERSION,
  productBrands: [...PODA_BRANDS],
  ketentuanPoin: [...DEFAULT_KETENTUAN_POINTS],
  pernyataanAkhirPoin: [...DEFAULT_PERNYATAAN_POIN],
  announcementBanner: {
    enabled: true,
    text: 'Pendaftaran Reseller Resmi PT. PODA E-LIQUID COMPANY Periode 2026 telah dibuka. Pastikan data usaha dan dokumen pendukung sesuai.',
    type: 'info',
  },
  adminPin: 'admin123',
  pages: {
    'page-1': {
      title: 'FORMULIR PENDAFTARAN RESELLER RESMI',
      subtitle: 'Tujuan dan ketentuan umum permohonan reseller resmi PT. PODA E-LIQUID COMPANY.',
      helpText: 'Pahami seluruh persyaratan sebelum melanjutkan ke pengisian identitas.',
      enabled: true,
    },
    'page-2': {
      title: 'IDENTITAS PEMOHON',
      subtitle: 'Silakan mengisi informasi pihak yang mengajukan pendaftaran ini.',
      helpText: 'Informasi kontak aktif sangat diperlukan untuk proses verifikasi.',
      enabled: true,
    },
    'page-3': {
      title: 'IDENTITAS USAHA',
      subtitle: 'Isi sesuai identitas usaha dan dokumen legalitas yang berlaku.',
      helpText: 'Pastikan NIB 13 digit dan alamat terdaftar sesuai OSS.',
      enabled: true,
    },
    'page-4': {
      title: 'JENIS SALURAN PENJUALAN',
      subtitle: 'Pilih jenis saluran penjualan yang akan didaftarkan.',
      helpText: 'Sistem akan secara dinamis membuka formulir toko fisik atau online.',
      enabled: true,
    },
    'page-5A': {
      title: 'INFORMASI TOKO FISIK',
      subtitle: 'Khusus untuk pemohon yang mendaftarkan gerai/outlet fisik.',
      helpText: 'Sertakan tautan Google Maps dan konfirmasi kepatuhan zonasi.',
      enabled: true,
    },
    'page-5B': {
      title: 'INFORMASI TOKO ONLINE',
      subtitle: 'Khusus untuk pemohon yang mendaftarkan toko online.',
      helpText: 'Sertakan tautan profil toko marketplace dan status verifikasi usia.',
      enabled: true,
    },
    'page-5C': {
      title: 'INFORMASI TOKO FISIK DAN ONLINE',
      subtitle: 'Lengkapi data gerai fisik serta toko online Anda.',
      helpText: 'Kedua bagian wajib diisi untuk verifikasi ganda.',
      enabled: true,
    },
    'page-6': {
      title: 'INFORMASI PRODUK DAN DISTRIBUTOR',
      subtitle: 'Tentukan merek produk yang diajukan dan sumber pembelian.',
      helpText: 'Pilih minimal satu lini merek resmi PT. PODA E-LIQUID COMPANY.',
      enabled: true,
    },
    'page-7': {
      title: 'DOKUMEN PENDUKUNG',
      subtitle: 'Unggah bukti verifikasi identitas, keberadaan toko, dan legalitas.',
      helpText: 'Format didukung: PDF, JPG, PNG hingga 10MB.',
      enabled: true,
    },
    'page-8': {
      title: 'KETENTUAN RESELLER DAN PRIVASI',
      subtitle: 'Harap membaca seluruh ketentuan dan kebijakan privasi.',
      helpText: 'Persetujuan resmi diperlukan sebelum pengiriman formulir.',
      enabled: true,
    },
    'page-9': {
      title: 'PERNYATAAN DAN KONFIRMASI PEMOHON',
      subtitle: 'Pernyataan akhir sebelum pengiriman formulir pendaftaran.',
      helpText: 'Pastikan data telah benar sebelum menekan tombol Kirim.',
      enabled: true,
    },
  },
};
