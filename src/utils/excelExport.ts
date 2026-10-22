import * as XLSX from 'xlsx';
import { ResellerSubmission } from '../types/formData';
import { COMPANY_NAME, PODA_BRANDS } from './constants';

export type ExcelFormat = 'xlsx' | 'xls';

export function exportSubmissionsToExcel(
  submissions: ResellerSubmission[],
  format: ExcelFormat = 'xlsx'
): void {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // 1. Data Sheet: Flattened submissions with neat, well-structured headers
  const rows = submissions.map((sub, index) => {
    // Format phone numbers with leading quote or zero preservation
    const waPemohon = sub.data.q3_whatsapp_pemohon ? String(sub.data.q3_whatsapp_pemohon) : '-';
    const waPemilik = sub.data.q6_whatsapp_pemilik ? String(sub.data.q6_whatsapp_pemilik) : '-';
    const nib = sub.data.q11_nib ? String(sub.data.q11_nib) : '-';

    // Format sales channel details
    let detailFisik = '-';
    if (sub.data.q16a_nama_toko_fisik || sub.data.q16c_nama_toko_fisik) {
      const nama = sub.data.q16a_nama_toko_fisik || sub.data.q16c_nama_toko_fisik;
      const alamat = sub.data.q17a_alamat_toko_fisik || sub.data.q17c_alamat_toko_fisik || '';
      detailFisik = `${nama} - ${alamat}`;
    }

    let detailOnline = '-';
    if (sub.data.q16b_nama_toko_online || sub.data.q23c_nama_toko_online) {
      const nama = sub.data.q16b_nama_toko_online || sub.data.q23c_nama_toko_online;
      const platform = sub.data.q17b_platform_online || sub.data.q24c_platform_online || 'Online';
      detailOnline = `${nama} (${platform})`;
    }

    const createdDate = new Date(sub.createdAt);
    const dateFormatted = !isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString('id-ID', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : '-';

    const timeFormatted = !isNaN(createdDate.getTime())
      ? createdDate.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }) + ' WIB'
      : '-';

    return {
      'No': index + 1,
      'No. Registrasi': sub.registrationNumber || '-',
      'Tanggal Pengajuan': dateFormatted,
      'Waktu Pengajuan': timeFormatted,
      'Status Verifikasi': formatStatusLabel(sub.status),
      'Rekomendasi Sistem (Hal 20)': sub.rekomendasiSistem || 'Perlu Evaluasi',
      'Nama Toko / Usaha': sub.data.q8_nama_toko || '-',
      'Bentuk Usaha': sub.data.q9_bentuk_usaha || '-',
      'Nomor Induk Berusaha (NIB)': nib,
      'Nama Pemilik': sub.data.q10_nama_pemilik_usaha || '-',
      'Nama Pemohon': sub.data.q1_nama_pemohon || '-',
      'Hubungan Pemohon': sub.data.q2_hubungan_pemohon || '-',
      'WhatsApp Pemohon': waPemohon,
      'Email Pemohon': sub.data.q4_email_pemohon || '-',
      'WhatsApp Pemilik': waPemilik,
      'Email Pemilik': sub.data.q7_email_pemilik || '-',
      'Kota / Kabupaten Usaha': sub.data.q13_kota_kabupaten || '-',
      'Provinsi Usaha': sub.data.q14_provinsi || '-',
      'Alamat Lengkap Usaha': sub.data.q12_alamat_usaha || '-',
      'Saluran Penjualan': sub.data.q15_saluran_penjualan || '-',
      'Nama Toko Fisik': sub.data.q16a_nama_toko_fisik || sub.data.q16c_nama_toko_fisik || '-',
      'Alamat Toko Fisik': sub.data.q17a_alamat_toko_fisik || sub.data.q17c_alamat_toko_fisik || '-',
      'Tautan Google Maps Fisik': sub.data.q18a_maps_toko_fisik || sub.data.q18c_maps_toko_fisik || '-',
      'Status Operasional Fisik': sub.data.q21a_status_operasional_fisik || sub.data.q21c_status_operasional_fisik || '-',
      'Nama Toko Online': sub.data.q16b_nama_toko_online || sub.data.q23c_nama_toko_online || '-',
      'Platform Marketplace': sub.data.q17b_platform_online || sub.data.q24c_platform_online || '-',
      'Tautan Profil Online': sub.data.q18b_link_online || sub.data.q25c_link_online || '-',
      'Merek Produk PODA': Array.isArray(sub.data.q31_merek_produk) ? sub.data.q31_merek_produk.join('; ') : '-',
      'Sumber Pembelian': sub.data.q32_sumber_pembelian || '-',
      'Nama Distributor': sub.data.q33_nama_distributor || '-',
      'Kota Distributor': sub.data.q34_kota_distributor || '-',
      'Surat Penunjukan Reseller': sub.nomorSuratPenunjukan || 'Belum Terbit',
      'Tanggal Disetujui': sub.tanggalDisetujui ? new Date(sub.tanggalDisetujui).toLocaleDateString('id-ID') : '-',
      'Catatan Tim Verifikasi': sub.catatanAdmin || '-',
    };
  });

  const wsData = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ 'Keterangan': 'Belum ada data pendaftaran reseller.' }]);

  // Generous column widths so the table is readable, neat, and not cramped
  const colWidths = [
    { wch: 6 },  // No
    { wch: 24 }, // No Registrasi
    { wch: 18 }, // Tanggal Pengajuan
    { wch: 16 }, // Waktu Pengajuan
    { wch: 22 }, // Status Verifikasi
    { wch: 32 }, // Rekomendasi Sistem
    { wch: 28 }, // Nama Toko / Usaha
    { wch: 24 }, // Bentuk Usaha
    { wch: 22 }, // NIB
    { wch: 24 }, // Nama Pemilik
    { wch: 24 }, // Nama Pemohon
    { wch: 28 }, // Hubungan Pemohon
    { wch: 18 }, // WA Pemohon
    { wch: 28 }, // Email Pemohon
    { wch: 18 }, // WA Pemilik
    { wch: 28 }, // Email Pemilik
    { wch: 22 }, // Kota Usaha
    { wch: 18 }, // Provinsi Usaha
    { wch: 38 }, // Alamat Usaha
    { wch: 26 }, // Saluran Penjualan
    { wch: 28 }, // Nama Toko Fisik
    { wch: 38 }, // Alamat Toko Fisik
    { wch: 35 }, // Maps
    { wch: 22 }, // Status Fisik
    { wch: 26 }, // Nama Toko Online
    { wch: 22 }, // Platform
    { wch: 35 }, // Link Online
    { wch: 42 }, // Merek Produk
    { wch: 22 }, // Sumber Pembelian
    { wch: 28 }, // Distributor
    { wch: 20 }, // Kota Distributor
    { wch: 26 }, // Surat Penunjukan
    { wch: 18 }, // Tanggal Disetujui
    { wch: 36 }, // Catatan Verifikasi
  ];
  wsData['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(wb, wsData, 'Data Pendaftaran Reseller');

  // 2. Summary Sheet: Executive KPI and status breakdown
  const summaryRows = [
    { 'Parameter / Indikator': 'Nama Perusahaan', 'Keterangan / Nilai': COMPANY_NAME },
    { 'Parameter / Indikator': 'Tanggal Laporan Dibuat', 'Keterangan / Nilai': new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
    { 'Parameter / Indikator': 'Waktu Ekspor', 'Keterangan / Nilai': new Date().toLocaleTimeString('id-ID') + ' WIB' },
    { 'Parameter / Indikator': '-------------------------', 'Keterangan / Nilai': '-------------------------' },
    { 'Parameter / Indikator': 'TOTAL PENDAFTARAN MASUK', 'Keterangan / Nilai': submissions.length },
    { 'Parameter / Indikator': 'Jumlah Disetujui Resmi', 'Keterangan / Nilai': submissions.filter((s) => s.status === 'disetujui').length },
    { 'Parameter / Indikator': 'Jumlah Siap Disetujui', 'Keterangan / Nilai': submissions.filter((s) => s.status === 'dapat_disetujui').length },
    { 'Parameter / Indikator': 'Jumlah Menunggu Verifikasi', 'Keterangan / Nilai': submissions.filter((s) => s.status === 'menunggu_verifikasi').length },
    { 'Parameter / Indikator': 'Jumlah Ditahan (Pemeriksaan Lanjut)', 'Keterangan / Nilai': submissions.filter((s) => s.status === 'tahan_permohonan').length },
    { 'Parameter / Indikator': 'Jumlah Perlu Dokumen Tambahan', 'Keterangan / Nilai': submissions.filter((s) => s.status === 'perlu_dokumen_tambahan').length },
    { 'Parameter / Indikator': 'Jumlah Ditolak', 'Keterangan / Nilai': submissions.filter((s) => s.status === 'ditolak').length },
    { 'Parameter / Indikator': '-------------------------', 'Keterangan / Nilai': '-------------------------' },
    { 'Parameter / Indikator': 'Kanal: Toko Fisik Saja', 'Keterangan / Nilai': submissions.filter((s) => s.data.q15_saluran_penjualan === 'Toko Fisik Saja').length },
    { 'Parameter / Indikator': 'Kanal: Toko Online Saja', 'Keterangan / Nilai': submissions.filter((s) => s.data.q15_saluran_penjualan === 'Toko Online Saja').length },
    { 'Parameter / Indikator': 'Kanal: Toko Fisik & Online', 'Keterangan / Nilai': submissions.filter((s) => s.data.q15_saluran_penjualan === 'Toko Fisik dan Toko Online').length },
  ];
  const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
  wsSummary['!cols'] = [{ wch: 38 }, { wch: 45 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Eksekutif & KPI');

  // 3. Catalog Sheet: Official Brands
  const catalogRows = PODA_BRANDS.map((brand, i) => ({
    'No': i + 1,
    'Merek Resmi PT. PODA E-LIQUID COMPANY': brand,
    'Kategori Produk': brand.includes('Salt') ? 'Salt Nicotine' : brand.includes('Freebase') ? 'Freebase Liquid' : 'E-Liquid Premium',
    'Status Distribusi': 'Aktif & Otorisasi Resmi',
  }));
  const wsCatalog = XLSX.utils.json_to_sheet(catalogRows);
  wsCatalog['!cols'] = [{ wch: 6 }, { wch: 45 }, { wch: 24 }, { wch: 28 }];
  XLSX.utils.book_append_sheet(wb, wsCatalog, 'Katalog Merek Resmi');

  // Choose file extension and write format
  const dateStr = new Date().toISOString().slice(0, 10);
  const ext = format === 'xls' ? 'xls' : 'xlsx';
  const fileName = `PT_PODA_Database_Reseller_${dateStr}.${ext}`;

  if (format === 'xls') {
    // Generate .xls (BIFF8 compatible Excel format)
    XLSX.writeFile(wb, fileName, { bookType: 'biff8' });
  } else {
    // Generate .xlsx (Standard OpenXML format)
    XLSX.writeFile(wb, fileName, { bookType: 'xlsx' });
  }
}

function formatStatusLabel(status: string): string {
  switch (status) {
    case 'disetujui':
      return 'Disetujui Resmi (SK Terbit)';
    case 'dapat_disetujui':
      return 'Siap Disetujui';
    case 'tahan_permohonan':
      return 'Ditahan (Perlu Verifikasi)';
    case 'perlu_dokumen_tambahan':
      return 'Perlu Dokumen Tambahan';
    case 'ditolak':
      return 'Ditolak';
    default:
      return 'Menunggu Verifikasi Sales';
  }
}
