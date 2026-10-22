import React, { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { UploadedDoc } from '../types/formData';
import { processAndCompressFile } from '../utils/fileCompressor';

interface FileUploadFieldProps {
  label: string;
  fieldId: string;
  doc: UploadedDoc | null;
  onChange: (doc: UploadedDoc | null) => void;
  error?: string;
  required?: boolean;
  conditionalNote?: string;
  helpText?: string;
  accept?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  fieldId,
  doc,
  onChange,
  error,
  required = false,
  conditionalNote,
  helpText,
  accept = '.pdf,image/png,image/jpeg,image/webp',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setProcessError('Ukuran file maksimal adalah 15 MB.');
      return;
    }

    setProcessError(null);
    setIsProcessing(true);

    try {
      // Optimizes images automatically down to efficient web size (~100-250KB)
      const processed = await processAndCompressFile(file);
      onChange({
        fileName: processed.fileName,
        fileSize: processed.fileSize,
        fileType: processed.fileType,
        dataUrl: processed.dataUrl,
        uploadedAt: processed.uploadedAt,
      });
    } catch (err: any) {
      console.error('File process error:', err);
      setProcessError('Gagal memproses berkas. Pastikan format sesuai.');
    } finally {
      setIsProcessing(false);
      // Reset input element value so re-selecting same file triggers change
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={fieldId} className="block text-sm font-semibold text-slate-800">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
        {conditionalNote && (
          <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {conditionalNote}
          </span>
        )}
      </div>

      {helpText && <p className="text-xs text-slate-500">{helpText}</p>}

      {!doc ? (
        <div
          onClick={() => !isProcessing && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors duration-150 flex flex-col items-center justify-center gap-2 group ${
            error || processError
              ? 'border-rose-300 bg-rose-50/50 hover:bg-rose-50'
              : 'border-slate-300 hover:border-slate-500 bg-slate-50/60 hover:bg-slate-50'
          } ${isProcessing ? 'opacity-70 pointer-events-none' : ''}`}
        >
          <input
            ref={inputRef}
            id={fieldId}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isProcessing}
          />
          <div className="w-10 h-10 rounded-full bg-slate-200/80 group-hover:bg-slate-300/80 flex items-center justify-center text-slate-600 transition-colors">
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin text-amber-600" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-slate-800">
              {isProcessing
                ? 'Mengompresi dan menyiapkan dokumen...'
                : 'Klik untuk unggah atau seret file ke sini'}
            </span>
            <p className="text-xs text-slate-500 mt-0.5">
              Format: PDF, JPG, PNG (Otomatis dioptimasi tanpa mengurangi keterbacaan)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              {doc.fileType.includes('pdf') ? (
                <FileText className="w-5 h-5 text-emerald-800" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{doc.fileName}</p>
              <p className="text-xs text-slate-500">
                {formatSize(doc.fileSize)}{' '}
                <span className="text-emerald-600 font-medium ml-1">· Siap diunggah</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onChange(null)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Hapus file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {(error || processError) && (
        <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error || processError}
        </p>
      )}
    </div>
  );
};
