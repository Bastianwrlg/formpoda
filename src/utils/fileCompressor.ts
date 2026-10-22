/**
 * Utility to compress images on the client side before uploading / storing.
 * This prevents browser localStorage / IndexedDB quota explosions,
 * and speeds up submission times significantly.
 */

export interface ProcessedFile {
  fileName: string;
  fileSize: number;
  fileType: string;
  dataUrl: string;
  uploadedAt: string;
}

export async function processAndCompressFile(file: File): Promise<ProcessedFile> {
  const isImage = file.type.startsWith('image/');

  if (isImage) {
    try {
      const compressedDataUrl = await compressImage(file, 1200, 1200, 0.75);
      // Calculate approximate size of compressed base64
      const approxBytes = Math.round((compressedDataUrl.length * 3) / 4);
      return {
        fileName: file.name,
        fileSize: approxBytes,
        fileType: 'image/jpeg',
        dataUrl: compressedDataUrl,
        uploadedAt: new Date().toISOString(),
      };
    } catch (e) {
      console.warn('Image compression fallback to direct read:', e);
    }
  }

  // Non-image (e.g. PDF) or fallback
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/octet-stream',
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString(),
      });
    };
    reader.onerror = () => reject(new Error('Gagal membaca berkas'));
    reader.readAsDataURL(file);
  });
}

function compressImage(
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      let width = img.width;
      let height = img.height;

      // Scale down while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          maxHeight = Math.round(maxHeight);
          height = Math.round((img.height * width) / img.width);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Draw with smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as compressed JPEG
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal memuat gambar untuk kompresi'));
    };

    img.src = url;
  });
}
