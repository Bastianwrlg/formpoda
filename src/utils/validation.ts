import { ResellerFormData, StepKey } from '../types/formData';

export interface ValidationErrors {
  [field: string]: string;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
}

export function getNextStep(currentStep: StepKey, saluran: string): StepKey {
  switch (currentStep) {
    case 'page-1':
      return 'page-2';
    case 'page-2':
      return 'page-3';
    case 'page-3':
      return 'page-4';
    case 'page-4':
      if (saluran === 'Toko Fisik Saja') return 'page-5A';
      if (saluran === 'Toko Online Saja') return 'page-5B';
      if (saluran === 'Toko Fisik dan Toko Online') return 'page-5C';
      return 'page-5A';
    case 'page-5A':
    case 'page-5B':
    case 'page-5C':
      return 'page-6';
    case 'page-6':
      return 'page-7';
    case 'page-7':
      return 'page-8';
    case 'page-8':
      return 'page-9';
    case 'page-9':
      return 'success';
    default:
      return 'page-1';
  }
}

export function getPreviousStep(currentStep: StepKey, saluran: string): StepKey {
  switch (currentStep) {
    case 'page-2':
      return 'page-1';
    case 'page-3':
      return 'page-2';
    case 'page-4':
      return 'page-3';
    case 'page-5A':
    case 'page-5B':
    case 'page-5C':
      return 'page-4';
    case 'page-6':
      if (saluran === 'Toko Fisik Saja') return 'page-5A';
      if (saluran === 'Toko Online Saja') return 'page-5B';
      if (saluran === 'Toko Fisik dan Toko Online') return 'page-5C';
      return 'page-4';
    case 'page-7':
      return 'page-6';
    case 'page-8':
      return 'page-7';
    case 'page-9':
      return 'page-8';
    default:
      return 'page-1';
  }
}

export function validateStep(step: StepKey, data: ResellerFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (step === 'page-2') {
    if (!data.q1_nama_pemohon.trim()) {
      errors.q1_nama_pemohon = 'Nama lengkap pemohon wajib diisi';
    }
    if (!data.q2_hubungan_pemohon) {
      errors.q2_hubungan_pemohon = 'Pilih hubungan pemohon dengan usaha';
    }
    if (!data.q3_whatsapp_pemohon.trim()) {
      errors.q3_whatsapp_pemohon = 'Nomor WhatsApp pemohon wajib diisi';
    } else if (!validatePhone(data.q3_whatsapp_pemohon)) {
      errors.q3_whatsapp_pemohon = 'Nomor WhatsApp tidak valid (minimal 9 digit)';
    }
    if (!data.q4_email_pemohon.trim()) {
      errors.q4_email_pemohon = 'Email pemohon wajib diisi';
    } else if (!validateEmail(data.q4_email_pemohon)) {
      errors.q4_email_pemohon = 'Format email tidak valid';
    }
    if (!data.q5_nama_pemilik.trim()) {
      errors.q5_nama_pemilik = 'Nama pemilik/pengurus wajib diisi';
    }
    if (!data.q6_whatsapp_pemilik.trim()) {
      errors.q6_whatsapp_pemilik = 'Nomor WhatsApp pemilik/pengurus wajib diisi';
    } else if (!validatePhone(data.q6_whatsapp_pemilik)) {
      errors.q6_whatsapp_pemilik = 'Nomor WhatsApp tidak valid (minimal 9 digit)';
    }
    if (!data.q7_email_pemilik.trim()) {
      errors.q7_email_pemilik = 'Email pemilik/pengurus wajib diisi';
    } else if (!validateEmail(data.q7_email_pemilik)) {
      errors.q7_email_pemilik = 'Format email tidak valid';
    }
  }

  if (step === 'page-3') {
    if (!data.q8_nama_toko.trim()) {
      errors.q8_nama_toko = 'Nama toko atau nama dagang wajib diisi';
    }
    if (!data.q9_bentuk_usaha) {
      errors.q9_bentuk_usaha = 'Pilih bentuk usaha Anda';
    }
    if (!data.q10_nama_pemilik_usaha.trim()) {
      errors.q10_nama_pemilik_usaha = 'Nama pemilik usaha / badan usaha wajib diisi';
    }
    if (!data.q11_nib.trim()) {
      errors.q11_nib = 'Nomor Induk Berusaha (NIB) wajib diisi';
    } else if (data.q11_nib.replace(/\D/g, '').length < 9) {
      errors.q11_nib = 'NIB minimal terdiri dari 9-13 digit angka';
    }
    if (!data.q12_alamat_usaha.trim()) {
      errors.q12_alamat_usaha = 'Alamat usaha terdaftar wajib diisi';
    }
    if (!data.q13_kota_kabupaten.trim()) {
      errors.q13_kota_kabupaten = 'Kota/Kabupaten wajib diisi';
    }
    if (!data.q14_provinsi.trim()) {
      errors.q14_provinsi = 'Provinsi wajib dipilih';
    }
  }

  if (step === 'page-4') {
    if (!data.q15_saluran_penjualan) {
      errors.q15_saluran_penjualan = 'Pilih jenis saluran penjualan yang didaftarkan';
    }
  }

  if (step === 'page-5A') {
    if (!data.q16a_nama_toko_fisik.trim()) errors.q16a_nama_toko_fisik = 'Nama toko fisik wajib diisi';
    if (!data.q17a_alamat_toko_fisik.trim()) errors.q17a_alamat_toko_fisik = 'Alamat lokasi fisik wajib diisi';
    if (!data.q18a_maps_toko_fisik.trim()) {
      errors.q18a_maps_toko_fisik = 'Link Google Maps toko fisik wajib diisi';
    }
    if (!data.q19a_penanggung_jawab_fisik.trim()) {
      errors.q19a_penanggung_jawab_fisik = 'Nama penanggung jawab operasional wajib diisi';
    }
    if (!data.q20a_whatsapp_toko_fisik.trim()) {
      errors.q20a_whatsapp_toko_fisik = 'Nomor WhatsApp toko wajib diisi';
    }
    if (!data.q21a_status_operasional_fisik) {
      errors.q21a_status_operasional_fisik = 'Pilih status operasional toko saat ini';
    }
    if (!data.q22a_kepatuhan_lokasi_fisik) {
      errors.q22a_kepatuhan_lokasi_fisik = 'Pernyataan kepatuhan lokasi wajib dijawab';
    }
  }

  if (step === 'page-5B') {
    if (!data.q16b_nama_toko_online.trim()) errors.q16b_nama_toko_online = 'Nama toko online wajib diisi';
    if (!data.q17b_platform_online) errors.q17b_platform_online = 'Pilih platform atau marketplace online';
    if (!data.q18b_link_online.trim()) errors.q18b_link_online = 'Link/URL toko online wajib diisi';
    if (!data.q20b_nama_pemilik_seller.trim()) errors.q20b_nama_pemilik_seller = 'Nama pemilik akun seller wajib diisi';
    if (!data.q21b_status_operasional_online) errors.q21b_status_operasional_online = 'Pilih status operasional toko online';
    if (!data.q22b_kepatuhan_platform_online) errors.q22b_kepatuhan_platform_online = 'Konfirmasi kebijakan platform wajib dijawab';
    if (!data.q23b_verifikasi_usia_online) errors.q23b_verifikasi_usia_online = 'Konfirmasi verifikasi usia pembeli wajib dijawab';
  }

  if (step === 'page-5C') {
    // Fisik
    if (!data.q16c_nama_toko_fisik.trim()) errors.q16c_nama_toko_fisik = 'Nama toko fisik wajib diisi';
    if (!data.q17c_alamat_toko_fisik.trim()) errors.q17c_alamat_toko_fisik = 'Alamat toko fisik wajib diisi';
    if (!data.q18c_maps_toko_fisik.trim()) errors.q18c_maps_toko_fisik = 'Link Google Maps toko fisik wajib diisi';
    if (!data.q19c_penanggung_jawab_fisik.trim()) errors.q19c_penanggung_jawab_fisik = 'Nama penanggung jawab fisik wajib diisi';
    if (!data.q20c_whatsapp_toko_fisik.trim()) errors.q20c_whatsapp_toko_fisik = 'Nomor WhatsApp toko wajib diisi';
    if (!data.q21c_status_operasional_fisik) errors.q21c_status_operasional_fisik = 'Status operasional toko fisik wajib dipilih';
    if (!data.q22c_kepatuhan_lokasi_fisik) errors.q22c_kepatuhan_lokasi_fisik = 'Kepatuhan lokasi rokok elektronik wajib dijawab';
    // Online
    if (!data.q23c_nama_toko_online.trim()) errors.q23c_nama_toko_online = 'Nama toko online wajib diisi';
    if (!data.q24c_platform_online) errors.q24c_platform_online = 'Pilih platform atau marketplace penjualan';
    if (!data.q25c_link_online.trim()) errors.q25c_link_online = 'Link/URL toko online wajib diisi';
    if (!data.q27c_nama_pemilik_seller.trim()) errors.q27c_nama_pemilik_seller = 'Nama pemilik akun seller wajib diisi';
    if (!data.q28c_status_operasional_online) errors.q28c_status_operasional_online = 'Status aktif toko online wajib dipilih';
    if (!data.q29c_kepatuhan_platform_online) errors.q29c_kepatuhan_platform_online = 'Kebijakan platform wajib dijawab';
    if (!data.q30c_verifikasi_usia_online) errors.q30c_verifikasi_usia_online = 'Verifikasi usia online wajib dijawab';
  }

  if (step === 'page-6') {
    if (!data.q31_merek_produk || data.q31_merek_produk.length === 0) {
      errors.q31_merek_produk = 'Pilih minimal satu merek produk PT. PODA E-LIQUID COMPANY';
    }
    if (!data.q32_sumber_pembelian) {
      errors.q32_sumber_pembelian = 'Pilih sumber pembelian produk';
    }
    if (!data.q33_nama_distributor.trim()) {
      errors.q33_nama_distributor = 'Nama distributor/pemasok wajib diisi (isi "Belum ada" jika belum pernah)';
    }
    if (!data.q35_sedia_bukti_pembelian) {
      errors.q35_sedia_bukti_pembelian = 'Kesediaan menunjukkan bukti verifikasi wajib dijawab';
    }
  }

  if (step === 'page-7') {
    if (!data.q36_dokumen_nib) {
      errors.q36_dokumen_nib = 'Dokumen NIB wajib diunggah (PDF / JPG / PNG)';
    }
    const isFisik = data.q15_saluran_penjualan === 'Toko Fisik Saja' || data.q15_saluran_penjualan === 'Toko Fisik dan Toko Online';
    if (isFisik && !data.q37_foto_depan_toko) {
      errors.q37_foto_depan_toko = 'Foto bagian depan toko fisik wajib diunggah';
    }
    const isOnline = data.q15_saluran_penjualan === 'Toko Online Saja' || data.q15_saluran_penjualan === 'Toko Fisik dan Toko Online';
    if (isOnline && !data.q38_screenshot_toko_online) {
      errors.q38_screenshot_toko_online = 'Screenshot profil toko online wajib diunggah';
    }
    if (data.q32_sumber_pembelian !== 'Belum pernah melakukan pembelian' && !data.q39_bukti_pembelian) {
      errors.q39_bukti_pembelian = 'Bukti pembelian produk wajib diunggah (Faktur/Invoice/Nota)';
    }
    if (data.q2_hubungan_pemohon === 'Penerima kuasa dari pemilik atau pengurus yang berwenang' && !data.q40_surat_kuasa) {
      errors.q40_surat_kuasa = 'Surat Kuasa wajib diunggah untuk pendaftaran oleh penerima kuasa';
    }
  }

  if (step === 'page-8') {
    if (!data.q42_persetujuan_ketentuan) {
      errors.q42_persetujuan_ketentuan = 'Anda harus membaca dan menyetujui Ketentuan Reseller';
    }
    if (!data.q43_persetujuan_privasi) {
      errors.q43_persetujuan_privasi = 'Anda harus membaca dan menyetujui Pemberitahuan Privasi';
    }
  }

  if (step === 'page-9') {
    if (!data.q44_nama_pernyataan.trim()) {
      errors.q44_nama_pernyataan = 'Nama lengkap pihak yang memberikan pernyataan wajib diisi';
    }
    if (!data.q45_pernyataan_kebenaran) {
      errors.q45_pernyataan_kebenaran = 'Pernyataan kebenaran data dan kewenangan wajib dicentang';
    }
    if (!data.q46_persetujuan_verifikasi) {
      errors.q46_persetujuan_verifikasi = 'Persetujuan konfirmasi dan verifikasi lanjutan wajib dicentang';
    }
  }

  return errors;
}
