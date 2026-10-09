import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Search,
  Home,
  FileText,
  PlusCircle,
  Bot,
  MoreHorizontal,
  HardDrive,
  FileSpreadsheet,
  Image as ImageIcon,
  Video,
  Presentation,
  ArrowLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { FileItem, FolderItem, StorageStats, UserProfile } from '../types';
import { formatBytes } from '../services/api';

interface MobileDevicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  stats: StorageStats;
  files: FileItem[];
  folders: FolderItem[];
  onOpenFile: (file: FileItem) => void;
  onOpenUpload: () => void;
}

export const MobileDevicePreviewModal: React.FC<MobileDevicePreviewModalProps> = ({
  isOpen,
  onClose,
  user,
  stats,
  files,
  folders,
  onOpenFile,
  onOpenUpload,
}) => {
  const [mobileTab, setMobileTab] = useState<'home' | 'docs' | 'ai' | 'folders'>('home');
  const [mobileSearch, setMobileSearch] = useState('');

  if (!isOpen) return null;

  const usedGB = (stats.usedBytes / (1024 * 1024 * 1024)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
      <div className="flex flex-col items-center max-w-lg w-full animate-in fade-in zoom-in-95 my-auto">
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between text-white mb-3 px-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
              12
            </span>
            <span className="font-bold text-sm">Xem trên điện thoại – Giao diện di động</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smartphone Device Frame (Screen 12) */}
        <div className="relative w-[360px] h-[720px] bg-slate-900 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700 ring-4 ring-slate-800/50 flex flex-col overflow-hidden">
          {/* Phone Speaker & Dynamic Island */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 mr-2"></div>
            <div className="w-2 h-2 rounded-full bg-blue-900"></div>
          </div>

          {/* Smartphone Screen Viewport */}
          <div className="w-full h-full bg-[#F4F8FC] rounded-[38px] overflow-hidden flex flex-col text-slate-800 pt-7 relative select-none">
            {/* Mobile Header Bar */}
            <div className="bg-[#0866E8] text-white px-4 pt-3 pb-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full border border-white"
                  />
                  <div>
                    <h4 className="font-extrabold text-xs leading-tight">Kho dữ liệu Thầy Gọn</h4>
                    <span className="text-[10px] text-blue-100 opacity-90">Trường TH P. An Xuyên</span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              </div>

              {/* Mobile Quick Search Input */}
              <div className="relative mt-3">
                <input
                  type="text"
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  placeholder="Tìm kiếm tài liệu, giáo án..."
                  className="w-full bg-white text-slate-800 text-[11px] pl-8 pr-3 py-1.5 rounded-full placeholder-slate-400 focus:outline-none shadow-xs"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Mobile Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
              {mobileTab === 'home' && (
                <>
                  {/* Two Stats Pill Badges (Screen 12) */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2.5 rounded-2xl border border-blue-100 shadow-2xs flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-black text-sm text-slate-900">{stats.totalFiles}</div>
                        <div className="text-[10px] text-slate-400 font-medium">Tài liệu</div>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-2xl border border-emerald-100 shadow-2xs flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                        <HardDrive className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-black text-sm text-slate-900">{usedGB} GB</div>
                        <div className="text-[10px] text-emerald-600 font-medium">Đã dùng</div>
                      </div>
                    </div>
                  </div>

                  {/* Six Category Icons Row (Screen 12) */}
                  <div className="bg-white p-3 rounded-2xl border border-blue-100 shadow-2xs">
                    <span className="font-bold text-[11px] text-slate-700 block mb-2">Loại tệp</span>
                    <div className="grid grid-cols-6 gap-1 text-center">
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs mb-1">
                          PDF
                        </div>
                        <span className="text-[9px] text-slate-600 font-medium">PDF</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs mb-1">
                          W
                        </div>
                        <span className="text-[9px] text-slate-600 font-medium">Word</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs mb-1">
                          X
                        </div>
                        <span className="text-[9px] text-slate-600 font-medium">Excel</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-1">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] text-slate-600 font-medium">Ảnh</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-1">
                          <Video className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] text-slate-600 font-medium">Video</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs mb-1">
                          •••
                        </div>
                        <span className="text-[9px] text-slate-600 font-medium">Khác</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Files on Mobile */}
                  <div className="bg-white p-3 rounded-2xl border border-blue-100 shadow-2xs space-y-2">
                    <span className="font-bold text-[11px] text-slate-700 block">Tài liệu gần đây</span>
                    {files.slice(0, 4).map((f) => (
                      <div
                        key={f.id}
                        onClick={() => onOpenFile(f)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-bold text-[11px] text-slate-800 truncate block">
                            {f.name}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {f.folderName} • {formatBytes(f.sizeBytes)}
                          </span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {mobileTab === 'docs' && (
                <div className="space-y-2">
                  <span className="font-bold text-xs text-slate-800 block">Tất cả tài liệu</span>
                  {files.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => onOpenFile(f)}
                      className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer"
                    >
                      <div className="min-w-0">
                        <span className="font-bold text-[11px] text-slate-900 block truncate">{f.name}</span>
                        <span className="text-[9px] text-slate-500">{formatBytes(f.sizeBytes)}</span>
                      </div>
                      <span className="text-[9px] font-bold uppercase text-blue-600 px-1.5 py-0.5 rounded bg-blue-50">
                        {f.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {mobileTab === 'ai' && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-3 rounded-2xl shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Trợ lý AI Thầy Gọn</span>
                    </div>
                    <p className="text-[10px] text-blue-100 mt-1">
                      Hỏi nhanh mọi điều về giáo án và Thông tư 27 ngay trên điện thoại.
                    </p>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
                    <strong>Hỏi đáp mẫu:</strong>
                    <p className="mt-1 text-slate-500">"Tìm giáo án môn Toán tuần 5 lớp 1C"</p>
                    <button
                      onClick={() => alert('Mở trợ lý AI phiên bản đầy đủ ở màn hình chính!')}
                      className="mt-2 w-full py-1.5 bg-blue-600 text-white rounded-xl font-bold text-[10px]"
                    >
                      Mở cửa sổ trò chuyện AI
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Smartphone Navigation Bar (Screen 12 Bottom) */}
            <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around text-slate-500 shadow-md">
              <button
                onClick={() => setMobileTab('home')}
                className={`flex flex-col items-center gap-0.5 ${mobileTab === 'home' ? 'text-blue-600 font-bold' : ''}`}
              >
                <Home className="w-4 h-4" />
                <span className="text-[9px]">Trang chủ</span>
              </button>

              <button
                onClick={() => setMobileTab('docs')}
                className={`flex flex-col items-center gap-0.5 ${mobileTab === 'docs' ? 'text-blue-600 font-bold' : ''}`}
              >
                <FileText className="w-4 h-4" />
                <span className="text-[9px]">Tài liệu</span>
              </button>

              {/* Center Upload Button */}
              <button
                onClick={onOpenUpload}
                className="w-9 h-9 rounded-full bg-[#0866E8] text-white flex items-center justify-center shadow-md -mt-3 ring-2 ring-white"
              >
                <PlusCircle className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileTab('ai')}
                className={`flex flex-col items-center gap-0.5 ${mobileTab === 'ai' ? 'text-blue-600 font-bold' : ''}`}
              >
                <Bot className="w-4 h-4" />
                <span className="text-[9px]">AI</span>
              </button>

              <button
                onClick={onClose}
                className="flex flex-col items-center gap-0.5 text-slate-500"
              >
                <MoreHorizontal className="w-4 h-4" />
                <span className="text-[9px]">Thêm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
