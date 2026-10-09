import React, { useState } from 'react';
import { 
  Cloud, 
  Search, 
  Bell, 
  Settings as SettingsIcon, 
  User, 
  LogOut, 
  ShieldCheck, 
  Smartphone,
  Menu,
  X,
  Sparkles,
  Database
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (query: string) => void;
  onNavigate: (view: string) => void;
  onOpenMobilePreview: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onNavigate,
  onOpenMobilePreview,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Phiên bản mới', desc: 'Đã lưu v4 cho Giáo án Toán lớp 1 - Tuần 5', time: '10 phút trước' },
    { id: 2, title: 'Chia sẻ tài liệu', desc: 'Liên kết chia sẻ Thông tư 27.pdf đang hoạt động', time: '1 giờ trước' },
    { id: 3, title: 'Bảo mật tài khoản', desc: 'Xác thực 2 bước 2FA đang bảo vệ kho dữ liệu', time: 'Hôm nay' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0866E8] text-white shadow-md transition-all">
      {/* Top Banner Bar */}
      <div className="bg-[#064AA8] px-4 py-1 text-xs flex justify-between items-center text-blue-100 border-b border-blue-500/20">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Đám mây lưu trữ an toàn • Trường Tiểu học Phường An Xuyên, TP Cà Mau</span>
          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-medium">
            ⚡ Supabase Cloud
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-amber-200 font-medium">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Dữ liệu hôm nay – Giá trị ngày mai
          </span>
          <button 
            onClick={onOpenMobilePreview}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-700/60 hover:bg-blue-600 text-white transition text-xs"
            title="Mở giả lập giao diện điện thoại"
          >
            <Smartphone className="w-3 h-3 text-cyan-300" />
            <span>Xem trên điện thoại</span>
          </button>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Branding & Teacher Details */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg bg-blue-700/50 hover:bg-blue-600 transition"
            aria-label="Toggle Menu"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Teacher Photo & Details */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-blue-300/40"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0866E8]"></span>
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-extrabold tracking-wide uppercase text-white leading-tight">
                {user.fullName}
              </div>
              <div className="text-[11px] text-blue-100 font-normal leading-tight opacity-95">
                {user.title} – {user.school}
              </div>
              <div className="text-[10px] text-blue-200">
                {user.province}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Main Portal Name & Slogan */}
        <div className="hidden xl:flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg lg:text-xl font-black tracking-wide text-white drop-shadow-sm uppercase">
              KHO DỮ LIỆU CÁ NHÂN – THẦY GỌN
            </h1>
          </div>
          <p className="text-xs text-blue-100 font-medium tracking-normal mt-0.5">
            Lưu trữ – Tìm kiếm – Quản lý – An toàn – Mọi lúc mọi nơi
          </p>
        </div>

        {/* Right: Search, Notifications & User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Bar */}
          <div className="relative hidden md:block w-52 lg:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tìm kiếm tài liệu, thư mục..."
              className="w-full bg-white/95 text-slate-800 text-xs sm:text-sm pl-9 pr-9 py-2 rounded-full placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:bg-white shadow-inner transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => onSearchSubmit(searchQuery)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-[#0866E8] text-white hover:bg-blue-700 transition"
              >
                <Search className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-blue-700/60 hover:bg-blue-600 transition focus:outline-none"
              title="Thông báo hệ thống"
            >
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-[11px] font-bold flex items-center justify-center border-2 border-[#0866E8]">
                {notifications.length}
              </span>
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-sm text-slate-800">Thông báo mới</span>
                  <span className="text-xs text-blue-600 cursor-pointer hover:underline">Đã đọc tất cả</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div key={item.id} className="p-3 hover:bg-blue-50/50 transition cursor-pointer">
                      <div className="text-xs font-semibold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{item.desc}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Shortcut */}
          <button
            onClick={() => onNavigate('settings')}
            className="p-2 rounded-full bg-blue-700/60 hover:bg-blue-600 transition focus:outline-none hidden sm:flex"
            title="Cài đặt hệ thống"
          >
            <SettingsIcon className="w-5 h-5 text-white" />
          </button>

          {/* User Account Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-blue-700/80 hover:bg-blue-600 border border-blue-400/30 transition text-xs font-medium text-white"
            >
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="hidden sm:inline font-semibold">{user.fullName}</span>
              <span className="text-[10px] opacity-80">▼</span>
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50">
                <div className="px-4 py-3 border-b border-slate-100 bg-blue-50/40">
                  <div className="font-bold text-slate-900 text-sm">{user.fullName}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                  <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Đã xác thực 2 bước (2FA)
                  </div>
                </div>
                <div className="py-1 text-xs">
                  <button
                    onClick={() => { onNavigate('settings'); setShowUserDropdown(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2 text-slate-700"
                  >
                    <User className="w-4 h-4 text-blue-600" />
                    Hồ sơ cá nhân & Bảo mật
                  </button>
                  <button
                    onClick={() => { onNavigate('settings'); setShowUserDropdown(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-emerald-50 flex items-center gap-2 text-emerald-700 font-semibold"
                  >
                    <Database className="w-4 h-4 text-emerald-600" />
                    Cơ sở dữ liệu Supabase
                  </button>
                  <button
                    onClick={() => { onOpenMobilePreview(); setShowUserDropdown(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center gap-2 text-slate-700"
                  >
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    Chế độ xem điện thoại
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <button
                    onClick={() => { setShowUserDropdown(false); }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center gap-2 text-xs font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất an toàn
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
