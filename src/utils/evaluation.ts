import { ResellerFormData, RekomendasiSistem } from '../types/formData';

export interface EvaluationResult {
  rekomendasi: RekomendasiSistem;
  alasan: string;
  detailChecks: {
    label: string;
    passed: boolean;
    note: string;
  }[];
}

export function evaluateApplication(data: ResellerFormData): EvaluationResult {
  const isOwner =
    data.q2_hubungan_pemohon === 'Pemilik usaha perseorangan' ||
    data.q2_hubungan_pemohon === 'Direktur/pengurus badan usaha yang berwenang';
  const isAuthorized =
    data.q2_hubungan_pemohon === 'Penerima kuasa dari pemilik atau pengurus yang berwenang';
  const hasPowerOfAttorney = !!data.q40_surat_kuasa;

  // Check compliance of channels
  const isFisik =
    data.q15_saluran_penjualan === 'Toko Fisik Saja' ||
    data.q15_saluran_penjualan === 'Toko Fisik dan Toko Online';
  const isOnline =
    data.q15_saluran_penjualan === 'Toko Online Saja' ||
    data.q15_saluran_penjualan === 'Toko Fisik dan Toko Online';

  const fisikCompliant =
    !isFisik ||
    (data.q15_saluran_penjualan === 'Toko Fisik Saja'
      ? data.q22a_kepatuhan_lokasi_fisik === 'Ya'
      : data.q22c_kepatuhan_lokasi_fisik === 'Ya');

  const onlineCompliant =
    !isOnline ||
    (data.q15_saluran_penjualan === 'Toko Online Saja'
      ? data.q22b_kepatuhan_platform_online === 'Ya, berdasarkan ketentuan platform yang berlaku' &&
        data.q23b_verifikasi_usia_online === 'Ya'
      : data.q29c_kepatuhan_platform_online === 'Ya, berdasarkan ketentuan platform yang berlaku' &&
        data.q30c_verifikasi_usia_online === 'Ya');

  const channelsCompliant = fisikCompliant && onlineCompliant;

  // Product trace origin
  const productTraceable =
    data.q32_sumber_pembelian === 'Distributor' ||
    data.q32_sumber_pembelian === 'Pembelian langsung dari perusahaan';
  const hasProofOfPurchase = !!data.q39_bukti_pembelian;
  const productVerifiable = productTraceable && (hasProofOfPurchase || data.q35_sedia_bukti_pembelian === 'Ya, bersedia');

  // Documents
  const hasNIB = !!data.q36_dokumen_nib;

  const detailChecks = [
    {
      label: 'Kesesuaian Identitas & Legalitas Usaha (NIB)',
      passed: hasNIB && !!data.q11_nib,
      note: hasNIB ? 'NIB terunggah dan valid' : 'Dokumen NIB belum lengkap',
    },
    {
      label: 'Kewenangan Pemohon & Surat Kuasa',
      passed: isOwner || (isAuthorized && hasPowerOfAttorney),
      note: isOwner
        ? 'Pemohon adalah pemilik/pengurus berwenang langsung'
        : hasPowerOfAttorney
        ? 'Penerima kuasa dengan dokumen surat kuasa terlampir'
        : 'Penerima kuasa tanpa dokumen surat kuasa yang sah',
    },
    {
      label: 'Ketertelusuran Asal Produk & Bukti Pembelian',
      passed: productVerifiable,
      note:
        data.q32_sumber_pembelian === 'Belum pernah melakukan pembelian'
          ? 'Pemohon belum pernah membeli produk resmi'
          : hasProofOfPurchase
          ? 'Bukti transaksi pembelian terunggah'
          : 'Menyatakan bersedia menunjukkan bukti saat verifikasi lapangan',
    },
    {
      label: 'Kepatuhan Regulasi Saluran Penjualan & Verifikasi Usia',
      passed: channelsCompliant,
      note: channelsCompliant
        ? 'Memenuhi ketentuan zonasi rokok elektronik dan verifikasi usia'
        : 'Lokasi atau platform penjualan berpotensi melanggar ketentuan',
    },
  ];

  // 5 internal decisions from page 20:
  // Rule 5: Lokasi atau platform penjualan tidak memenuhi ketentuan
  if (!channelsCompliant) {
    return {
      rekomendasi: 'Tolak otorisasi untuk lokasi atau platform tersebut',
      alasan:
        'Lokasi toko fisik atau platform penjualan online tidak memenuhi ketentuan hukum penjualan rokok elektronik (misal: zonasi sekolah/tempat bermain anak atau ketiadaan verifikasi usia).',
      detailChecks,
    };
  }

  // Rule 3: Pengisi bukan pemilik dan tidak mempunyai bukti kewenangan
  if (isAuthorized && !hasPowerOfAttorney) {
    return {
      rekomendasi: 'Tahan permohonan',
      alasan:
        'Pengisi formulir bertindak sebagai penerima kuasa namun belum melampirkan Surat Kuasa sah dari pemilik/pengurus.',
      detailChecks,
    };
  }

  // Rule 4: Produk tidak dapat ditelusuri asal pembeliannya
  if (data.q32_sumber_pembelian === 'Belum pernah melakukan pembelian' && !hasProofOfPurchase) {
    return {
      rekomendasi: 'Tahan permohonan',
      alasan:
        'Asal pembelian produk belum dapat ditelusuri atau pemohon belum pernah membeli dari jalur resmi.',
      detailChecks,
    };
  }

  // Rule 2: Pengisi bukan pemilik tetapi memiliki kuasa yang dapat diverifikasi
  if (isAuthorized && hasPowerOfAttorney && channelsCompliant && productVerifiable && hasNIB) {
    return {
      rekomendasi: 'Dapat dilanjutkan',
      alasan:
        'Pendaftaran diajukan oleh kuasa dengan dokumen pendukung yang dapat diverifikasi.',
      detailChecks,
    };
  }

  // Rule 1: Identitas usaha dan pemilik sesuai, dokumen lengkap, kanal memenuhi ketentuan
  if (isOwner && channelsCompliant && productVerifiable && hasNIB) {
    return {
      rekomendasi: 'Dapat diajukan untuk persetujuan',
      alasan:
        'Identitas usaha dan pemilik sesuai, dokumen legalitas lengkap, dan kanal penjualan memenuhi semua ketentuan.',
      detailChecks,
    };
  }

  return {
    rekomendasi: 'Tahan permohonan',
    alasan: 'Masih memerlukan kelengkapan data pendukung sebelum dapat disetujui.',
    detailChecks,
  };
}
