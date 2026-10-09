import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Video,
  X,
  CheckCircle,
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  Folder
} from 'lucide-react';
import { FolderItem, FileItem, FileType } from '../types';
import { api, formatBytes } from '../services/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderItem[];
  defaultFolderId?: string;
  onUploadSuccess: (newFiles: FileItem[]) => void;
}

interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  type: FileType;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'paused' | 'error';
  errorMessage?: string;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  folders,
  defaultFolderId,
  onUploadSuccess,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState(defaultFolderId || (folders[0]?.id || 'f-01'));
  const [activeTab, setActiveTab] = useState<'files' | 'folder'>('files');
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const getFileType = (name: string): FileType => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'excel';
    if (['ppt', 'pptx'].includes(ext)) return 'powerpoint';
    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) return 'image';
    if (['mp4', 'mov', 'avi'].includes(ext)) return 'video';
    if (['zip', 'rar', '7z'].includes(ext)) return 'zip';
    return 'other';
  };

  const addFilesToQueue = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const newItems: UploadQueueItem[] = Array.from(fileList).map((file) => ({
      id: 'upload-' + Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      sizeBytes: file.size,
      type: getFileType(file.name),
      progress: 0,
      status: 'pending',
    }));

    setQueue((prev) => [...prev, ...newItems]);
    // Automatically trigger uploading
    processQueue(newItems);
  };

  const processQueue = async (itemsToUpload: UploadQueueItem[]) => {
    for (const item of itemsToUpload) {
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 10 } : q))
      );

      try {
        // Upload via real server API with progress
        const uploaded = await api.uploadFiles([item.file], selectedFolderId, (percent) => {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: percent } : q))
          );
        });

        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, progress: 100, status: 'completed' } : q))
        );
        onUploadSuccess(uploaded);
      } catch (err: any) {
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? { ...q, status: 'error', errorMessage: err.message || 'Lỗi tải lên' }
              : q
          )
        );
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const cancelItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'word': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'excel': return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'powerpoint': return <Presentation className="w-5 h-5 text-amber-500" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-cyan-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-blue-100 overflow-hidden my-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0866E8] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">Tải lên tài liệu</h3>
              <p className="text-xs text-blue-100">Lưu trữ tệp đám mây cá nhân an toàn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Tabs: Tải lên tệp / Tải lên thư mục */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('files')}
                className={`text-sm font-bold pb-2 border-b-2 transition ${
                  activeTab === 'files'
                    ? 'border-[#0866E8] text-[#0866E8]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Tải lên tệp
              </button>
              <button
                onClick={() => setActiveTab('folder')}
                className={`text-sm font-bold pb-2 border-b-2 transition ${
                  activeTab === 'folder'
                    ? 'border-[#0866E8] text-[#0866E8]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Tải lên thư mục
              </button>
            </div>

            {/* Target Folder Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Lưu vào:</span>
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="text-xs font-semibold bg-blue-50 text-blue-900 border border-blue-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Big Drag & Drop Zone (Matching Screen 3) */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center transition-all ${
              isDragging
                ? 'border-[#0866E8] bg-blue-50/80 scale-[1.01]'
                : 'border-blue-200 bg-blue-50/20 hover:border-blue-400 hover:bg-blue-50/40'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-[#0866E8] mb-3 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <h4 className="text-base sm:text-lg font-bold text-slate-800">
              Kéo thả tệp vào đây
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              hoặc nhấn nút bên dưới để chọn tệp từ máy tính
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => addFilesToQueue(e.target.files)}
              multiple
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-6 py-2.5 rounded-full bg-[#0866E8] hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
            >
              <span>Chọn tệp từ máy tính</span>
            </button>

            <p className="text-[11px] text-slate-400 mt-4 max-w-md">
              Hỗ trợ: PDF, Word, Excel, PowerPoint, Ảnh, Video, ZIP, TXT,...<br />
              Dung lượng tối đa mỗi tệp: <strong>2 GB</strong>
            </p>
          </div>

          {/* Upload Queue List (Screen 3 Bottom Part) */}
          {queue.length > 0 && (
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Danh sách tệp đang tải lên ({queue.length})
                </span>
                <button
                  onClick={clearQueue}
                  className="text-xs font-bold text-red-500 hover:text-red-700 transition"
                >
                  Hủy tất cả
                </button>
              </div>

              <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3 text-xs"
                  >
                    <div className="flex-shrink-0">{getFileIcon(item.type)}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-800 truncate" title={item.name}>
                          {item.name}
                        </span>
                        <span className="text-slate-400 text-[11px] ml-2">
                          {formatBytes(item.sizeBytes)}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.status === 'completed'
                              ? 'bg-emerald-500'
                              : item.status === 'error'
                              ? 'bg-red-500'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-bold text-slate-600 text-[11px] min-w-[36px] text-right">
                        {item.progress}%
                      </span>
                      {item.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : item.status === 'error' ? (
                        <span title={item.errorMessage}>
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        </span>
                      ) : (
                        <button
                          onClick={() => cancelItem(item.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Close / Done Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              Đóng cửa sổ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
