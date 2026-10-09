import React from 'react';
import {
  Trash2,
  RotateCcw,
  AlertTriangle,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Video,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { FileItem, FileType } from '../types';
import { formatBytes, formatDate } from '../services/api';

interface TrashViewProps {
  trashFiles: FileItem[];
  onRestore: (file: FileItem) => void;
  onDeletePermanently: (file: FileItem) => void;
  onEmptyTrash: () => void;
}

export const TrashView: React.FC<TrashViewProps> = ({
  trashFiles,
  onRestore,
  onDeletePermanently,
  onEmptyTrash,
}) => {
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
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Các tài liệu đã xóa sẽ được lưu giữ an toàn trong 30 ngày trước khi bị xóa vĩnh viễn
          </p>
        </div>

        {trashFiles.length > 0 && (
          <button
            onClick={onEmptyTrash}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Dọn sạch thùng rác</span>
          </button>
        )}
      </div>

      {/* Trash Items Table (Screen 10) */}
      <div className="bg-white rounded-2xl shadow-xs border border-blue-100 overflow-hidden">
        {trashFiles.length === 0 ? (
          <div className="p-16 text-center text-slate-400 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">Thùng rác hiện đang trống</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Không có tài liệu nào bị xóa. Kho dữ liệu của Thầy Gọn đang được bảo quản gọn gàng và nguyên vẹn.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tên tài liệu</th>
                  <th className="py-3.5 px-4">Thư mục gốc</th>
                  <th className="py-3.5 px-4">Dung lượng</th>
                  <th className="py-3.5 px-4">Ngày xóa</th>
                  <th className="py-3.5 px-4">Thời gian lưu còn lại</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {trashFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-red-50/30 transition">
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

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        <Clock className="w-3 h-3 text-amber-500" />
                        Còn 29 ngày
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onRestore(file)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition border border-blue-200"
                          title="Khôi phục tài liệu"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Khôi phục</span>
                        </button>
                        <button
                          onClick={() => onDeletePermanently(file)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold text-xs transition border border-red-200"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Xóa hẳn</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
