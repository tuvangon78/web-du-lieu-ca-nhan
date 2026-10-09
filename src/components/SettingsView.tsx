import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  KeyRound,
  HardDrive,
  Globe,
  Sun,
  Moon,
  Smartphone,
  Laptop,
  CheckCircle2,
  Clock,
  Activity,
  Save,
  School,
  Database,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  Table,
  Layers,
  AlertCircle
} from 'lucide-react';
import { UserProfile, ActivityLog } from '../types';
import { formatDateTime, api } from '../services/api';
import { SUPABASE_SQL_SCHEMA } from '../lib/supabase';

interface SettingsViewProps {
  user: UserProfile;
  activityLogs: ActivityLog[];
  onUpdateUser: (updates: Partial<UserProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  activityLogs,
  onUpdateUser,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [title, setTitle] = useState(user.title);
  const [school, setSchool] = useState(user.school);
  const [phone, setPhone] = useState(user.phone);
  const [twoFactor, setTwoFactor] = useState(user.twoFactorEnabled);
  const [language, setLanguage] = useState(user.language);
  const [theme, setTheme] = useState<'light' | 'dark'>(user.theme || 'light');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Supabase states
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseSyncing, setSupabaseSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    connected: boolean;
    projectUrl: string;
    hasTables: {
      files: boolean;
      folders: boolean;
      activity_logs: boolean;
      user_profile: boolean;
    };
    details: string;
  }>({
    connected: true,
    projectUrl: 'https://pirmwzflxvlxvjqlhbhw.supabase.co',
    hasTables: {
      files: false,
      folders: false,
      activity_logs: false,
      user_profile: false,
    },
    details: 'Đang kết nối tới máy chủ Supabase...',
  });

  const checkStatus = async () => {
    setSupabaseLoading(true);
    try {
      const res = await api.getSupabaseStatus();
      setSupabaseStatus(res);
    } catch (err: any) {
      console.warn('Supabase status error:', err);
    } finally {
      setSupabaseLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSyncToSupabase = async () => {
    setSupabaseSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await api.syncToSupabase();
      setSyncFeedback({ type: 'success', message: res.message });
      await checkStatus();
    } catch (err: any) {
      setSyncFeedback({
        type: 'error',
        message: err.message || 'Chưa thể đồng bộ. Vui lòng chạy mã SQL trên Supabase trước.',
      });
    } finally {
      setSupabaseSyncing(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      fullName,
      title,
      school,
      phone,
      twoFactorEnabled: twoFactor,
      language,
      theme,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              11
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Cài đặt & Bảo mật
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Quản lý tài khoản cá nhân, cơ chế bảo mật hai lớp và nhật ký bảo an của Thầy Từ Văn Gọn
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Đã lưu cài đặt thành công!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Teacher Profile Form */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xs border border-blue-100 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-16 h-16 rounded-full object-cover border-4 border-blue-100 shadow-md ring-2 ring-blue-500/20"
            />
            <div>
              <h3 className="text-lg font-bold text-slate-900">{user.fullName}</h3>
              <p className="text-xs text-blue-600 font-semibold">{user.title} – {user.school}</p>
              <p className="text-xs text-slate-400">{user.province}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              Thông tin cá nhân
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên giáo viên
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chức danh / Nghề nghiệp
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trường công tác
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email tài khoản
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-xs sm:text-sm cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Email dùng để đăng nhập và nhận thông báo lưu trữ.</span>
              </div>
            </div>

            {/* Language & Theme (Screen 11) */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ngôn ngữ hiển thị
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="vi">Tiếng Việt (Mặc định)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Giao diện
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      theme === 'light'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                        : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Sáng</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      theme === 'dark'
                        ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs'
                        : 'border-slate-300 text-slate-600'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Tối</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#0866E8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security Status, Devices & Activity Logs */}
        <div className="space-y-6">
          {/* Security Box (Screen 11 Right) */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-blue-100 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Bảo mật tài khoản
            </h4>

            {/* 2FA Toggle */}
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-xs block">
                  Xác thực 2 bước (2FA)
                </span>
                <span className="text-[11px] text-slate-500">
                  Mã OTP gửi đến điện thoại 0918***567
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* Change password button */}
            <button
              onClick={() => alert('Chức năng đổi mật khẩu đã gửi liên kết xác nhận về email của Thầy Gọn.')}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Đổi mật khẩu tài khoản</span>
            </button>

            {/* Active Sessions */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Thiết bị đang đăng nhập:
              </span>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Windows 11 – Chrome</span>
                      <span className="text-[10px] text-emerald-600 font-medium">Thiết bị hiện tại (Cà Mau)</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Đang hoạt động</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="font-semibold text-slate-800 block">iPhone 15 – Safari</span>
                      <span className="text-[10px] text-slate-500">Đăng nhập 2 giờ trước</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400">Trực tuyến</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Audit Log */}
          <div className="bg-white p-5 rounded-2xl shadow-xs border border-blue-100 space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Nhật ký hoạt động bảo an
            </h4>

            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{log.action}</span>
                    <span className="text-[10px] text-slate-400">{formatDateTime(log.timestamp)}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{log.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Cloud Database Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-emerald-100 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Cơ sở dữ liệu Supabase Cloud
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  PostgreSQL
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Lưu trữ đám mây phân tán, đồng bộ trực tiếp tài liệu và phân quyền an toàn cho Thầy Gọn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={checkStatus}
              disabled={supabaseLoading}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              title="Kiểm tra lại trạng thái kết nối"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${supabaseLoading ? 'animate-spin' : ''}`} />
              <span>Kiểm tra</span>
            </button>
            <a
              href="https://supabase.com/dashboard/project/pirmwzflxvlxvjqlhbhw"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <span>Supabase Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Connection status box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-800">
                Dự án Supabase: <span className="font-mono text-emerald-700 font-semibold">{supabaseStatus.projectUrl}</span>
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500">
              Khóa API: <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200">sb_publishable_...</span>
            </span>
          </div>

          {/* Table readiness indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200/60">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-700">folders</span>
              </div>
              {supabaseStatus.hasTables.folders ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Sẵn sàng</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Chưa tạo</span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-slate-700">files</span>
              </div>
              {supabaseStatus.hasTables.files ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Sẵn sàng</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Chưa tạo</span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-semibold text-slate-700">activity_logs</span>
              </div>
              {supabaseStatus.hasTables.activity_logs ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Sẵn sàng</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Chưa tạo</span>
              )}
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-semibold text-slate-700">user_profile</span>
              </div>
              {supabaseStatus.hasTables.user_profile ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">Sẵn sàng</span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">Chưa tạo</span>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {syncFeedback && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in ${
              syncFeedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {syncFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <span>{syncFeedback.message}</span>
            </div>
            <button
              onClick={() => setSyncFeedback(null)}
              className="text-slate-400 hover:text-slate-600 text-xs px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* SQL Script Guide Box */}
        <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                Mã lệnh SQL tạo bảng trên Supabase (Khởi tạo 1 lần)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Vào <strong>Supabase Dashboard → SQL Editor → New query</strong>, dán mã bên dưới rồi nhấn <strong>RUN</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySql}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                {copiedSql ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Đã sao chép SQL!' : 'Sao chép mã SQL'}</span>
              </button>

              <button
                onClick={() => setShowSqlModal(!showSqlModal)}
                className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold transition"
              >
                {showSqlModal ? 'Thu gọn' : 'Xem mã SQL'}
              </button>
            </div>
          </div>

          {showSqlModal && (
            <div className="mt-3 relative">
              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-64 leading-relaxed border border-slate-800">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          )}

          {/* Sync Actions */}
          <div className="pt-3 border-t border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-600">
              Sau khi đã chạy mã SQL trên Supabase, bấm nút dưới đây để đẩy toàn bộ 12 thư mục sư phạm và tài liệu lên đám mây:
            </span>
            <button
              onClick={handleSyncToSupabase}
              disabled={supabaseSyncing}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition disabled:opacity-50 whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${supabaseSyncing ? 'animate-spin' : ''}`} />
              <span>{supabaseSyncing ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu lên Supabase'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
