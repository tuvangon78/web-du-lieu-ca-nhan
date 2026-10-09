import React from 'react';
import {
  Home,
  FileText,
  Folder,
  Share2,
  Star,
  Trash2,
  Bot,
  BarChart3,
  Settings,
  HardDrive,
  Upload,
  Sparkles
} from 'lucide-react';
import { StorageStats } from '../types';
import { formatBytes } from '../services/api';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  stats?: StorageStats;
  onOpenUpload: () => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  stats,
  onOpenUpload,
  isOpen,
  onCloseMobile,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Trang chủ', icon: Home },
    { id: 'my-documents', label: 'Tài liệu của tôi', icon: FileText },
    { id: 'folders', label: 'Thư mục', icon: Folder },
    { id: 'shares', label: 'Chia sẻ', icon: Share2 },
    { id: 'favorites', label: 'Yêu thích', icon: Star },
    { id: 'trash', label: 'Thùng rác', icon: Trash2 },
    { id: 'ai-assistant', label: 'AI trợ lý', icon: Bot, isSpecial: true },
    { id: 'stats', label: 'Thống kê', icon: BarChart3 },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const usedBytes = stats?.usedBytes || 38.6 * 1024 * 1024 * 1024;
  const totalBytes = stats?.totalBytes || 100 * 1024 * 1024 * 1024;
  const percentUsed = Math.min(100, Math.round((usedBytes / totalBytes) * 100));

  const handleSelect = (id: string) => {
    onNavigate(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 z-30 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 lg:top-[85px] left-0 h-screen lg:h-[calc(100vh-85px)] z-40 w-64 bg-[#064AA8] text-white flex flex-col justify-between shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation Top Section */}
        <div className="p-3">
          {/* Quick Upload Button */}
          <button
            onClick={() => {
              onOpenUpload();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-[#0866E8] hover:from-blue-600 hover:to-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition transform active:scale-98 border border-blue-400/30"
          >
            <Upload className="w-4 h-4" />
            <span>Tải lên tài liệu mới</span>
          </button>

          {/* Menu items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-[#0866E8] text-white shadow-md font-semibold ring-1 ring-blue-300/40 translate-x-1'
                      : 'text-blue-100/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : item.isSpecial ? 'text-amber-300' : 'text-blue-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.isSpecial && (
                    <span className="flex items-center gap-1 text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-amber-300/30">
                      <Sparkles className="w-2.5 h-2.5" />
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Storage Overview Card */}
        <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-[#0866E8]/40 to-blue-900/60 border border-blue-400/20 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-blue-100 mb-2">
            <span className="flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-cyan-300" />
              Dung lượng lưu trữ
            </span>
            <span className="font-bold text-white">{percentUsed}%</span>
          </div>

          <div className="w-full bg-blue-950/60 rounded-full h-2 mb-2 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentUsed}%` }}
            />
          </div>

          <div className="text-[11px] text-blue-200 flex justify-between">
            <span>Đã dùng {formatBytes(usedBytes)}</span>
            <span>/ {formatBytes(totalBytes)}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
