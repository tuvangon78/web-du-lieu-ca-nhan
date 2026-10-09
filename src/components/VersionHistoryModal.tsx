import React, { useState, useRef } from 'react';
import {
  X,
  History,
  Upload,
  Download,
  RotateCcw,
  CheckCircle,
  FileText,
  Calendar,
  User,
  HardDrive
} from 'lucide-react';
import { FileItem, FileVersion } from '../types';
import { api, formatBytes, formatDate, formatDateTime } from '../services/api';

interface VersionHistoryModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onVersionUploaded: (updatedFile: FileItem) => void;
  onDownloadFile: (file: FileItem) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  file,
  isOpen,
  onClose,
  onVersionUploaded,
  onDownloadFile,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [versionNotes, setVersionNotes] = useState('');
  const [selectedVersionFile, setSelectedVersionFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !file) return null;

  const versions: FileVersion[] = file.versions && file.versions.length > 0
    ? file.versions
    : [
        {
          id: 'v1-' + file.id,
          versionNumber: 1,
          versionLabel: 'v1',
          fileName: file.name,
          sizeBytes: file.sizeBytes,
          uploadedAt: file.createdAt,
          uploadedBy: file.owner,
          notes: 'Phiên bản gốc ban đầu',
          storagePath: file.storagePath,
        },
      ];

  const handleUploadNewVersion = async () => {
    if (!selectedVersionFile) return;
    setIsUploading(true);
    try {
      const updated = await api.uploadNewVersion(
        file.id,
        selectedVersionFile,
        versionNotes || `Cập nhật phiên bản mới bởi ${file.owner}`
      );
      onVersionUploaded(updated);
      setSelectedVersionFile(null);
      setVersionNotes('');
    } catch (err: any) {
      alert(err.message || 'Lỗi tải lên phiên bản mới');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        {/* Header */}
        <div className="bg-[#0866E8] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
              5
            </span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Quản lý phiên bản</h3>
              <p className="text-xs text-blue-100">Lịch sử thay đổi và lưu trữ các bản sửa đổi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Overview Card (Screen 5 Top Card) */}
          <div className="bg-blue-50/50 rounded-2xl p-4 sm:p-5 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs flex-shrink-0">
                W
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base" title={file.name}>
                  {file.name}
                </h4>
                <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span>Kích thước: <strong>{formatBytes(file.sizeBytes)}</strong></span>
                  <span>•</span>
                  <span>Ngày tải lên: {formatDate(file.createdAt)}</span>
                  <span>•</span>
                  <span>Thư mục: {file.folderName}</span>
                  <span>•</span>
                  <span>Số phiên bản: <strong className="text-blue-700">{versions.length}</strong></span>
                </div>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0866E8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex-shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>Tải phiên bản mới</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedVersionFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </div>

          {/* New Version Upload Drawer */}
          {selectedVersionFile && (
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">
                  Tệp đã chọn: {selectedVersionFile.name} ({formatBytes(selectedVersionFile.size)})
                </span>
                <button
                  onClick={() => setSelectedVersionFile(null)}
                  className="text-xs text-amber-700 hover:text-red-600"
                >
                  Hủy
                </button>
              </div>
              <input
                type="text"
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                placeholder="Ghi chú nội dung thay đổi của phiên bản mới này..."
                className="w-full px-3 py-2 bg-white rounded-xl border border-amber-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleUploadNewVersion}
                  disabled={isUploading}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {isUploading ? 'Đang lưu...' : 'Xác nhận tải lên v' + (versions.length + 1)}
                </button>
              </div>
            </div>
          )}

          {/* Version History Table (Matching Screen 5) */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <History className="w-4 h-4 text-blue-600" />
              Lịch sử phiên bản
            </h4>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-semibold border-b border-slate-200 uppercase tracking-wider">
                    <th className="py-3 px-4">Phiên bản</th>
                    <th className="py-3 px-4">Ngày cập nhật</th>
                    <th className="py-3 px-4">Kích thước</th>
                    <th className="py-3 px-4">Người cập nhật</th>
                    <th className="py-3 px-4 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {versions.map((ver, idx) => (
                    <tr
                      key={ver.id || idx}
                      className={`hover:bg-blue-50/40 transition ${
                        idx === 0 ? 'bg-blue-50/20 font-medium' : ''
                      }`}
                    >
                      {/* Version Label */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-black ${
                              idx === 0
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {ver.versionLabel || `v${ver.versionNumber}`}
                          </span>
                          {idx === 0 && (
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Hiện tại
                            </span>
                          )}
                        </div>
                        {ver.notes && (
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                            {ver.notes}
                          </div>
                        )}
                      </td>

                      {/* Updated Date */}
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {formatDateTime(ver.uploadedAt)}
                      </td>

                      {/* Size */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {formatBytes(ver.sizeBytes)}
                      </td>

                      {/* Modifier */}
                      <td className="py-3.5 px-4 text-slate-700">
                        {ver.uploadedBy || 'Từ Văn Gọn'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onDownloadFile(file)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                            title="Tải phiên bản này"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
