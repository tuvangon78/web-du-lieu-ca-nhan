import React from 'react';
import {
  FileText,
  HardDrive,
  Image as ImageIcon,
  Video,
  FileSpreadsheet,
  Presentation,
  Download,
  Share2,
  Eye,
  MoreVertical,
  ArrowUpRight,
  Sparkles,
  Layers,
  Star
} from 'lucide-react';
import { FileItem, StorageStats, FileType } from '../types';
import { formatBytes, formatDate } from '../services/api';

interface DashboardViewProps {
  stats: StorageStats;
  recentFiles: FileItem[];
  onOpenFile: (file: FileItem) => void;
  onDownloadFile: (file: FileItem) => void;
  onShareFile: (file: FileItem) => void;
  onToggleFavorite: (file: FileItem) => void;
  onNavigate: (view: string) => void;
  onOpenUpload: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentFiles,
  onOpenFile,
  onDownloadFile,
  onShareFile,
  onToggleFavorite,
  onNavigate,
  onOpenUpload,
}) => {
  const usedGB = (stats.usedBytes / (1024 * 1024 * 1024)).toFixed(1);
  const totalGB = (stats.totalBytes / (1024 * 1024 * 1024)).toFixed(0);
  const percentUsed = Math.min(100, Math.round((stats.usedBytes / stats.totalBytes) * 100));

  const getFileBadgeColor = (type: FileType) => {
    switch (type) {
      case 'pdf': return 'bg-red-50 text-red-600 border-red-200';
      case 'word': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'excel': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'powerpoint': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'image': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      case 'video': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'zip': return 'bg-orange-50 text-orange-600 border-orange-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
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
    <div className="space-y-6">
      {/* Title Header with Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              1
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Trang chủ – Tổng quan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bảng điều khiển lưu trữ đám mây của Thầy Từ Văn Gọn – Trường TH Phường An Xuyên, Cà Mau
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-xs transition border border-amber-200 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Hỏi Trợ lý AI</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0866E8] text-white hover:bg-blue-700 font-semibold text-xs shadow-md transition"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Tải lên tệp</span>
          </button>
        </div>
      </div>

      {/* Top 7 Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {/* Card 1: Tổng số tài liệu */}
        <div 
          onClick={() => onNavigate('my-documents')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-blue-50 hover:border-blue-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500">Tổng số tài liệu</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-800">
            {stats.totalFiles.toLocaleString('vi-VN')}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5">tài liệu lưu trữ</div>
        </div>

        {/* Card 2: Dung lượng đã dùng */}
        <div 
          onClick={() => onNavigate('stats')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-emerald-50 hover:border-emerald-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500">Dung lượng đã dùng</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-800">
            {usedGB} GB
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">/ {totalGB} GB ({percentUsed}%)</div>
        </div>

        {/* Card 3: Hình ảnh */}
        <div 
          onClick={() => onNavigate('my-documents')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-cyan-50 hover:border-cyan-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500">Hình ảnh</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 group-hover:scale-110 transition">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-800">
            {stats.typeCounts.image || 320}
          </div>
          <div className="text-[11px] text-cyan-600 font-semibold mt-0.5">tài liệu ảnh</div>
        </div>

        {/* Card 4: Video */}
        <div 
          onClick={() => onNavigate('my-documents')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-purple-50 hover:border-purple-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500">Video</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-800">
            {stats.typeCounts.video || 125}
          </div>
          <div className="text-[11px] text-purple-600 font-semibold mt-0.5">tiết dạy video</div>
        </div>

        {/* Card 5: PDF */}
        <div 
          onClick={() => onNavigate('my-documents')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-red-50 hover:border-red-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500">PDF</span>
            <div className="p-2 rounded-xl bg-red-50 text-red-600 group-hover:scale-110 transition">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-800">
            {stats.typeCounts.pdf || 456}
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-0.5">văn bản PDF</div>
        </div>

        {/* Card 6: Word */}
        <div 
          onClick={() => onNavigate('my-documents')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-blue-50 hover:border-blue-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500">Word</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition font-black text-xs">
              W
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-800">
            {stats.typeCounts.word || 215}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-0.5">giáo án Word</div>
        </div>

        {/* Card 7: Excel */}
        <div 
          onClick={() => onNavigate('my-documents')}
          className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-emerald-50 hover:border-emerald-300 transition-all cursor-pointer group hover:shadow-md"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-500">Excel</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition font-black text-xs">
              X
            </div>
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-800">
            {stats.typeCounts.excel || 86}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">bảng tính Excel</div>
        </div>
      </div>

      {/* Middle Row: Donut Chart of File Types & Storage Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Tỷ lệ loại tài liệu (Donut Chart) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-xs border border-blue-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Tỷ lệ các loại tài liệu
            </h3>
            <span className="text-xs text-slate-400">Dữ liệu phân loại thời gian thực</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* SVG Donut Graphic */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* SVG Conic Segments with stroke-dasharray */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F04444" strokeWidth="18" strokeDasharray="86 238" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#0866E8" strokeWidth="18" strokeDasharray="40 238" strokeDashoffset="-86" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#16B875" strokeWidth="18" strokeDasharray="17 238" strokeDashoffset="-126" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#FF9F1C" strokeWidth="18" strokeDasharray="14 238" strokeDashoffset="-143" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#00B4D8" strokeWidth="18" strokeDasharray="60 238" strokeDashoffset="-157" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8257E5" strokeWidth="18" strokeDasharray="24 238" strokeDashoffset="-217" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-black text-slate-800">100%</span>
                <span className="text-[10px] text-slate-500 font-medium uppercase">Kho lưu trữ</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F04444]"></span>
                <span className="font-semibold text-slate-800">PDF (36%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0866E8]"></span>
                <span className="font-semibold text-slate-800">Word (17%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#16B875]"></span>
                <span className="font-semibold text-slate-800">Excel (7%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF9F1C]"></span>
                <span className="font-semibold text-slate-800">PowerPoint (6%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#00B4D8]"></span>
                <span className="font-semibold text-slate-800">Hình ảnh (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8257E5]"></span>
                <span className="font-semibold text-slate-800">Video (10%)</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <span className="w-3 h-3 rounded-full bg-slate-400"></span>
                <span className="font-semibold text-slate-800">Khác & Nén (5%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dung lượng lưu trữ (Progress + Quota) */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-blue-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-600" />
                Dung lượng lưu trữ
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                VIP Plan
              </span>
            </div>

            <div className="text-center py-3">
              <div className="text-3xl font-black text-slate-800">
                {usedGB} <span className="text-lg font-medium text-slate-500">/ {totalGB} GB</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Đã dùng {usedGB} GB ({percentUsed}%)
              </p>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 shadow-inner mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
                style={{ width: `${percentUsed}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 mt-3 font-medium">
              <span>Đang sử dụng: {usedGB} GB</span>
              <span className="text-emerald-600 font-bold">Còn trống: {(Number(totalGB) - Number(usedGB)).toFixed(1)} GB</span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('stats')}
              className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Xem chi tiết phân tích lưu trữ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Tài liệu gần đây (Recent Files Table) */}
      <div className="bg-white rounded-2xl shadow-xs border border-blue-100 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Tài liệu gần đây</h3>
            <p className="text-xs text-slate-500">Các giáo án và tài liệu được tải lên hoặc cập nhật gần nhất</p>
          </div>
          <button
            onClick={() => onNavigate('my-documents')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
          >
            <span>Xem tất cả</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 text-slate-500 text-[11px] font-semibold border-b border-slate-100 uppercase tracking-wider">
                <th className="py-3 px-4">Tên tài liệu</th>
                <th className="py-3 px-4">Loại</th>
                <th className="py-3 px-4">Dung lượng</th>
                <th className="py-3 px-4">Thư mục</th>
                <th className="py-3 px-4">Ngày tải lên</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentFiles.slice(0, 6).map((file) => (
                <tr key={file.id} className="hover:bg-blue-50/40 transition">
                  {/* File Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 cursor-pointer" onClick={() => onOpenFile(file)}>
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0">
                        <div
                          onClick={() => onOpenFile(file)}
                          className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer truncate max-w-xs sm:max-w-md"
                          title={file.name}
                        >
                          {file.name}
                        </div>
                        {file.versions?.length > 1 && (
                          <span className="inline-block mt-0.5 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold">
                            {file.versions[0].versionLabel}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* File Type Badge */}
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${getFileBadgeColor(file.type)}`}>
                      {file.type}
                    </span>
                  </td>

                  {/* Size */}
                  <td className="py-3 px-4 font-medium text-slate-600">
                    {formatBytes(file.sizeBytes)}
                  </td>

                  {/* Folder */}
                  <td className="py-3 px-4 text-slate-500 font-medium">
                    {file.folderName}
                  </td>

                  {/* Upload Date */}
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(file.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onOpenFile(file)}
                        className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDownloadFile(file)}
                        className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition"
                        title="Tải xuống"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onShareFile(file)}
                        className="p-1.5 rounded-lg hover:bg-purple-100 text-purple-600 transition"
                        title="Chia sẻ"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleFavorite(file)}
                        className={`p-1.5 rounded-lg transition ${
                          file.isFavorite ? 'text-amber-500 hover:bg-amber-100' : 'text-slate-400 hover:bg-slate-100'
                        }`}
                        title="Yêu thích"
                      >
                        <Star className={`w-4 h-4 ${file.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
