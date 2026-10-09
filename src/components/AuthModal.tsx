import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  LogIn,
  KeyRound,
  User,
  School,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Users,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { UserProfile, UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'register' | 'login';
  onAuthSuccess: (user: UserProfile, message: string) => void;
  currentUser: UserProfile;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'register',
  onAuthSuccess,
  currentUser,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [showAccountsList, setShowAccountsList] = useState(false);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states - Registration
  const [regUsername, setRegUsername] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regSchool, setRegSchool] = useState('Trường Tiểu học Phường An Xuyên');
  const [regTitle, setRegTitle] = useState('Giáo viên tiểu học');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Form states - Login
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sync mode with initialMode prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      loadAccounts();
    }
  }, [isOpen, initialMode]);

  const loadAccounts = async () => {
    try {
      const list = await api.getAccounts();
      setAccounts(list);
    } catch {
      // Ignore background fetch error
    }
  };

  if (!isOpen) return null;

  // Password strength helper
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Quá ngắn (ít nhất 6 ký tự)', color: 'bg-red-500' };
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);
    if (pass.length >= 8 && hasNum && hasSpecial) {
      return { score: 3, label: 'Mạnh và an toàn', color: 'bg-emerald-500' };
    }
    if (pass.length >= 6 && (hasNum || hasSpecial)) {
      return { score: 2, label: 'Độ bảo mật tốt', color: 'bg-amber-500' };
    }
    return { score: 2, label: 'Trung bình', color: 'bg-blue-500' };
  };

  const strength = getPasswordStrength(regPassword);

  // Handle Register Submit
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    const cleanUsername = regUsername.trim().toLowerCase();
    if (!cleanUsername) {
      setError('Vui lòng nhập tên đăng nhập.');
      return;
    }
    if (cleanUsername.length < 3) {
      setError('Tên đăng nhập phải có tối thiểu 3 ký tự.');
      return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      setError('Tên đăng nhập chỉ được chứa chữ không dấu, số, dấu chấm (.) hoặc gạch dưới (_). Không chứa khoảng trắng.');
      return;
    }
    if (!regFullName.trim()) {
      setError('Vui lòng nhập Họ và tên.');
      return;
    }
    if (!regPassword) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Mật khẩu phải có từ 6 ký tự trở lên.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng nhập lại!');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        username: cleanUsername,
        password: regPassword,
        fullName: regFullName.trim(),
        school: regSchool.trim(),
        title: regTitle.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
      });

      // Clear fields
      setRegUsername('');
      setRegFullName('');
      setRegPassword('');
      setRegConfirmPassword('');
      setRegEmail('');
      setRegPhone('');

      onAuthSuccess(res.user, res.message || 'Đăng ký tài khoản thành công!');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Đăng ký tài khoản không thành công. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login Submit
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginUsername.trim()) {
      setError('Vui lòng nhập tên đăng nhập.');
      return;
    }
    if (!loginPassword) {
      setError('Vui lòng nhập mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.login({
        username: loginUsername.trim().toLowerCase(),
        password: loginPassword,
      });

      setLoginUsername('');
      setLoginPassword('');

      onAuthSuccess(res.user, res.message || 'Đăng nhập thành công!');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại!');
    } finally {
      setLoading(false);
    }
  };

  // Switch to an account directly
  const handleSwitchToAccount = async (account: UserAccount) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.switchAccount({ username: account.username });
      onAuthSuccess(res.user, `Đã chuyển sang tài khoản ${account.fullName}`);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Không thể chuyển tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#064AA8] via-[#0866E8] to-blue-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              {mode === 'register' ? (
                <UserPlus className="w-5 h-5 text-amber-300" />
              ) : (
                <LogIn className="w-5 h-5 text-cyan-300" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                {mode === 'register' ? 'Đăng Ký Tài Khoản Mới' : 'Đăng Nhập Hệ Thống'}
              </h2>
              <p className="text-xs text-blue-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Kho Dữ Liệu Cá Nhân – Lưu trữ an toàn & đồng bộ đám mây
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 p-1">
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); setShowAccountsList(false); }}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              mode === 'register' && !showAccountsList
                ? 'bg-white text-[#0866E8] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-[#0866E8]" />
            <span>Đăng ký tài khoản</span>
            <span className="text-[10px] bg-blue-100 text-[#0866E8] px-1.5 py-0.2 rounded-full font-bold">Mới</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setShowAccountsList(false); }}
            className={`flex-1 py-2.5 px-4 text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition ${
              mode === 'login' && !showAccountsList
                ? 'bg-white text-[#0866E8] shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4 text-slate-600" />
            <span>Đăng nhập</span>
          </button>

          <button
            type="button"
            onClick={() => { setShowAccountsList(!showAccountsList); setError(null); }}
            className={`py-2.5 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition ${
              showAccountsList
                ? 'bg-blue-100 text-[#0866E8]'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Xem danh sách tài khoản đã tạo"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tài khoản ({accounts.length})</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="flex-1 font-medium">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {showAccountsList ? (
            /* Accounts List Sub-view */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Tài khoản đã đăng ký trên hệ thống
                </span>
                <span className="text-xs text-blue-600 font-medium">Tổng: {accounts.length}</span>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {accounts.map((acc) => {
                  const isCurrent = currentUser?.username === acc.username;
                  return (
                    <div
                      key={acc.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                        isCurrent
                          ? 'border-blue-300 bg-blue-50/70'
                          : 'border-slate-200 hover:border-blue-200 bg-white hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={acc.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256'}
                          alt={acc.fullName}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-slate-900">{acc.fullName}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">
                                Đang dùng
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-blue-700">@{acc.username}</span>
                            <span>•</span>
                            <span>{acc.title || 'Giáo viên'}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{acc.school}</div>
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          type="button"
                          onClick={() => handleSwitchToAccount(acc)}
                          disabled={loading}
                          className="px-3 py-1.5 rounded-lg bg-[#0866E8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition"
                        >
                          <span>Chọn</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAccountsList(false)}
                  className="text-xs text-[#0866E8] hover:underline font-semibold"
                >
                  ← Quay lại màn hình đăng ký / đăng nhập
                </button>
              </div>
            </div>
          ) : mode === 'register' ? (
            /* ============================================================ */
            /* REGISTRATION FORM                                            */
            /* ============================================================ */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200/60 text-xs text-blue-900 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#0866E8] shrink-0" />
                <span>
                  Đăng ký tài khoản giáo viên mới để lưu trữ, soạn giáo án và quản lý hồ sơ lớp học riêng của bạn.
                </span>
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                    @
                  </div>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="ví dụ: cogaomaiphuong, tranvanan_1c..."
                    required
                    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Chữ cái thường không dấu, số, dấu chấm (.) hoặc gạch dưới (_). Tối thiểu 3 ký tự.
                </p>
              </div>

              {/* Full Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên Thầy/Cô <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Ví dụ: Cô Nguyễn Thị Mai"
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                  />
                </div>
              </div>

              {/* Password & Confirm Password Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự"
                      required
                      minLength={6}
                      className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Nhập lại mật khẩu"
                      required
                      minLength={6}
                      className={`w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl border focus:outline-none focus:ring-2 font-medium ${
                        regConfirmPassword && regConfirmPassword === regPassword
                          ? 'border-emerald-400 focus:ring-emerald-500'
                          : 'border-slate-300 focus:ring-[#0866E8]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password strength indicator */}
              {regPassword && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                    <span className="font-semibold text-slate-700">{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                    <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                  </div>
                </div>
              )}

              {/* School and Title Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trường học / Đơn vị</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <School className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={regSchool}
                      onChange={(e) => setRegSchool(e.target.value)}
                      placeholder="Trường Tiểu học Phường An Xuyên"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chức vụ / Chuyên môn</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={regTitle}
                      onChange={(e) => setRegTitle(e.target.value)}
                      placeholder="Giáo viên chủ nhiệm lớp 1"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Phone (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email liên hệ (tùy chọn)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="giaovien@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại (tùy chọn)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0918 xxx xxx"
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#064AA8] to-[#0866E8] hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    <span>Hoàn tất đăng ký & Kích hoạt tài khoản</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-xs text-slate-500">Đã có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-xs font-bold text-[#0866E8] hover:underline"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </form>
          ) : (
            /* ============================================================ */
            /* LOGIN FORM                                                   */
            /* ============================================================ */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between">
                <div>
                  <span className="font-bold">Tài khoản chính của Thầy Gọn:</span>
                  <div className="mt-0.5 font-mono text-[11px] text-amber-800">
                    Tên đăng nhập: <strong className="text-blue-700">tuvangon</strong> | MK: <strong className="text-blue-700">thaygon2026</strong>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLoginUsername('tuvangon');
                    setLoginPassword('thaygon2026');
                  }}
                  className="px-2.5 py-1 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-900 text-[11px] font-bold transition"
                >
                  Điền nhanh
                </button>
              </div>

              {/* Login Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs font-bold">
                    @
                  </div>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="tuvangon, cogaomaiphuong..."
                    required
                    className="w-full pl-8 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                  />
                </div>
              </div>

              {/* Login Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    required
                    className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#064AA8] to-[#0866E8] hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4 text-cyan-300" />
                    <span>Đăng nhập vào kho dữ liệu</span>
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-500">Chưa có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-xs font-bold text-[#0866E8] hover:underline"
                >
                  Đăng ký tài khoản mới ngay
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Bottom Security Notice */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dữ liệu được lưu trữ an toàn & đồng bộ đám mây</span>
          </div>
          <span className="text-[10px] text-slate-400">An Xuyên, Cà Mau</span>
        </div>
      </div>
    </div>
  );
};
