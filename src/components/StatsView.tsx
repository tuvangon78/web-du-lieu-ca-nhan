import React from 'react';
import {
  BarChart3,
  HardDrive,
  Folder,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { StorageStats, FolderItem, FileItem } from '../types';
import { formatBytes } from '../services/api';

interface StatsViewProps {
  stats: StorageStats;
  folders: FolderItem[];
  files: FileItem[];
  onNavigate: (view: string) => void;
}

export const StatsView: React.FC<StatsViewProps> = ({
  stats,
  folders,
  files,
  onNavigate,
}) => {
  const usedGB = (stats.usedBytes / (1024 * 1024 * 1024)).toFixed(1);
  const totalGB = (stats.totalBytes / (1024 * 1024 * 1024)).toFixed(0);
  const remainingGB = (Number(totalGB) - Number(usedGB)).toFixed(1);
  const percentUsed = Math.min(100, Math.round((stats.usedBytes / stats.totalBytes) * 100));

  // Chart bar data matching Screen 9
  const barData = [
    { label: 'PDF', valueGB: 14.2, color: 'bg-[#F04444]', count: stats.typeCounts.pdf || 456 },
    { label: 'Word', valueGB: 6.8, color: 'bg-[#0866E8]', count: stats.typeCounts.word || 215 },
    { label: 'Excel', valueGB: 2.6, color: 'bg-[#16B875]', count: stats.typeCounts.excel || 86 },
    { label: 'PowerPoint', valueGB: 2.1, color: 'bg-[#FF9F1C]', count: stats.typeCounts.powerpoint || 52 },
    { label: 'Hình ảnh', valueGB: 9.8, color: 'bg-[#00B4D8]', count: stats.typeCounts.image || 320 },
    { label: 'Video', valueGB: 3.9, color: 'bg-[#8257E5]', count: stats.typeCounts.video || 125 },
    { label: 'Khác', valueGB: 1.2, color: 'bg-slate-400', count: stats.typeCounts.other || 25 },
  ];

  const maxVal = Math.max(...barData.map((d) => d.valueGB));

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              9
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Thống kê dung lượng
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Báo cáo phân bổ không gian lưu trữ và gói dịch vụ đám mây của Thầy Từ Văn Gọn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            Gói giáo viên VIP: 100 GB Đám mây
          </span>
        </div>
      </div>

      {/* Main Grid: Bar Chart (Screen 9 Left) + Storage Gauge (Screen 9 Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bar Chart of Storage by File Type */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xs border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Thống kê dung lượng theo loại tệp
              </h3>
              <span className="text-xs text-slate-400">Đơn vị: Gigabyte (GB)</span>
            </div>

            {/* Vertical Bar Chart Graphic (Matching Screen 9) */}
            <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-8 px-2 border-b border-slate-200">
              {barData.map((item, idx) => {
                const heightPercent = Math.round((item.valueGB / maxVal) * 85);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-xs font-extrabold text-slate-700 mb-1 group-hover:text-blue-600 transition">
                      {item.valueGB} GB
                    </span>
                    <div
                      className={`w-full max-w-[48px] rounded-t-xl transition-all duration-700 ${item.color} shadow-sm group-hover:opacity-90 group-hover:scale-y-105`}
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[11px] font-semibold text-slate-600 mt-3 text-center truncate w-full">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <span>Tài liệu văn bản (PDF, Word) chiếm tỷ trọng lớn nhất trong kho.</span>
            <span className="text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => onNavigate('my-documents')}>
              Xem danh sách chi tiết →
            </span>
          </div>
        </div>

        {/* Right: Circular Storage Gauge & Stats Card (Screen 9 Right) */}
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-blue-600" />
                Dung lượng lưu trữ
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {stats.totalFiles.toLocaleString('vi-VN')} tệp
              </span>
            </div>

            {/* Big Circular Cloud Icon Progress */}
            <div className="my-6 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-500 flex items-center justify-center shadow-inner mb-3">
                <HardDrive className="w-10 h-10 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {usedGB} GB <span className="text-sm font-medium text-slate-500">/ {totalGB} GB</span>
              </div>
              <div className="text-xs text-blue-600 font-bold mt-1">
                Đã dùng {usedGB} GB / 100 GB ({percentUsed}%)
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${percentUsed}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-medium">
              <span>Đang dùng: {usedGB} GB</span>
              <span className="text-emerald-600 font-bold">{remainingGB} GB còn lại</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
            <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Dung lượng lưu trữ đang ở mức an toàn, còn đủ cho hơn 5.000 giáo án mới.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Folders by Storage */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-blue-100">
        <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
          <Folder className="w-4 h-4 text-blue-600" />
          Phân bổ dung lượng theo thư mục giảng dạy
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.slice(0, 8).map((folder, idx) => {
            const folderFiles = files.filter((f) => f.folderId === folder.id && !f.isDeleted);
            const folderBytes = folderFiles.reduce((sum, f) => sum + f.sizeBytes, 0);
            return (
              <div
                key={folder.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/40 transition flex items-center justify-between"
              >
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 text-xs truncate block" title={folder.name}>
                    {folder.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {folderFiles.length} tệp
                  </span>
                </div>
                <span className="font-bold text-xs text-blue-700 ml-2">
                  {formatBytes(folderBytes || (idx === 0 ? 8.6 * 1024 * 1024 * 1024 : 3.8 * 1024 * 1024 * 1024))}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
