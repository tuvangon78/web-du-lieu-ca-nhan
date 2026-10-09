import React, { useState } from 'react';
import {
  Trash2,
  RotateCcw,
  CheckCircle2,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Video,
  Infinity as InfinityIcon,
  Search,
  CheckSquare,
  Square,
  ShieldCheck
} from 'lucide-react';
import { FileItem, FileType } from '../types';
import { formatBytes, formatDate } from '../services/api';

interface TrashViewProps {
  trashFiles: FileItem[];
  onRestore: (file: FileItem) => void;
  onDeletePermanently: (file: FileItem) => void;
  onBatchRestore?: (files: FileItem[]) => void;
  onBatchDeletePermanently?: (files: FileItem[]) => void;
  onEmptyTrash: () => void;
}

export const TrashView: React.FC<TrashViewProps> = ({
  trashFiles,
  onRestore,
  onDeletePermanently,
  onBatchRestore,
  onBatchDeletePermanently,
  onEmptyTrash,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'word': return <FileText className="w-5 h-5 text-blue-600" />;
      case 'excel': return <FileSpreadsheet className="w-5 h-5 text-emerald-600" />;
      case 'image': return <ImageIcon className="w-5 h-5 text-cyan-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const filteredTrashFiles = trashFiles.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.folderName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected =
    filteredTrashFiles.length > 0 &&
    filteredTrashFiles.every((f) => selectedIds.includes(f.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTrashFiles.map((f) => f.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchRestoreClick = () => {
    const selectedFiles = trashFiles.filter((f) => selectedIds.includes(f.id));
    if (onBatchRestore && selectedFiles.length > 0) {
      onBatchRestore(selectedFiles);
      setSelectedIds([]);
    }
  };

  const handleBatchDeleteClick = () => {
    const selectedFiles = trashFiles.filter((f) => selectedIds.includes(f.id));
    if (onBatchDeletePermanently && selectedFiles.length > 0) {
      onBatchDeletePermanently(selectedFiles);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              10
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Thùng rác
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <InfinityIcon className="w-3 h-3 text-emerald-600" />
              Lưu vô thời hạn
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tài liệu được bảo quản an toàn không giới hạn thời gian. Thầy có thể khôi phục lại hoặc xóa vĩnh viễn bất kỳ lúc nào.
          </p>
        </div>

        {trashFiles.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={onEmptyTrash}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
              title="Xóa sạch toàn bộ tài liệu trong thùng rác"
            >
              <Trash2 className="w-4 h-4" />
              <span>Dọn sạch thùng rác</span>
            </button>
          </div>
        )}
      </div>

      {/* Action bar and Search when files exist */}
      {trashFiles.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs">
          {/* Multi-selection Toolbar */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition px-2 py-1 rounded-lg hover:bg-slate-50"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-blue-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>{isAllSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}</span>
            </button>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <span className="text-xs font-bold text-blue-600">
                  Đã chọn: {selectedIds.length} tệp
                </span>
                <button
                  onClick={handleBatchRestoreClick}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition border border-blue-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục</span>
                </button>
                <button
                  onClick={handleBatchDeleteClick}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-xs transition border border-red-200 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa vĩnh viễn</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm tài liệu trong thùng rác..."
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Trash Items Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-blue-100 overflow-hidden">
        {trashFiles.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Thùng rác hiện đang trống</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không có tài liệu nào bị xóa. Kho dữ liệu của Thầy Gọn đang được bảo quản gọn gàng và an toàn.
            </p>
          </div>
        ) : filteredTrashFiles.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs">
            Không tìm thấy tài liệu phù hợp với từ khóa "{searchTerm}" trong thùng rác.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-3.5 px-3 w-10 text-center">
                    <button onClick={toggleSelectAll} className="p-1 hover:text-blue-600">
                      {isAllSelected ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">Tên tài liệu</th>
                  <th className="py-3.5 px-4">Thư mục gốc</th>
                  <th className="py-3.5 px-4">Dung lượng</th>
                  <th className="py-3.5 px-4">Ngày xóa</th>
                  <th className="py-3.5 px-4">Trạng thái lưu trữ</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredTrashFiles.map((file) => {
                  const isChecked = selectedIds.includes(file.id);
                  return (
                    <tr
                      key={file.id}
                      className={`transition ${isChecked ? 'bg-blue-50/50' : 'hover:bg-red-50/20'}`}
                    >
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => toggleSelectOne(file.id)}
                          className="p-1 hover:text-blue-600 transition"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 opacity-70">
                            {getFileIcon(file.type)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-800 line-through opacity-80 block truncate max-w-xs sm:max-w-md">
                              {file.name}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Loại: {file.type.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-medium">
                        {file.folderName}
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {formatBytes(file.sizeBytes)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {file.deletedAt ? formatDate(file.deletedAt) : 'Gần đây'}
                      </td>

                      {/* Infinite retention status badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Lưu vô thời hạn • Xóa tùy ý</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onRestore(file)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition border border-blue-200"
                            title="Khôi phục tài liệu về thư mục cũ"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Khôi phục</span>
                          </button>
                          <button
                            onClick={() => onDeletePermanently(file)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-xs transition border border-red-200"
                            title="Xóa vĩnh viễn tệp này ngay lập tức"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Xóa hẳn</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
