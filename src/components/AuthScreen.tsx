import React, { useState, useEffect } from 'react';
import {
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
  BookOpen,
  Cloud,
  FolderLock,
  Bot,
  Zap,
  Check
} from 'lucide-react';
import { api } from '../services/api';
import { UserProfile, UserAccount } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile, message: string) => void;
  defaultUsername?: string;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  defaultUsername = '',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'accounts'>('login');
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginUsername, setLoginUsername] = useState(defaultUsername || 'tuvangon');
  const [loginPassword, setLoginPassword] = useState('thaygon2026');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
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

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const list = await api.getAccounts();
      setAccounts(list);
    } catch {
      // background fetch
    }
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length < 6) return { score: 1, label: 'Quá ngắn (ít nhất 6 ký tự)', color: 'bg-red-500' };
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);
    if (pass.length >= 8 && hasNum && hasSpecial) {
      return { score: 3, label: 'Mạnh và an toàn', color: 'bg-emerald-500' };
    }
    if (pass.length >= 6 && (hasNum || hasSpecial)) {
      return { score: 2, label: 'Bảo mật tốt', color: 'bg-amber-500' };
    }
    return { score: 2, label: 'Trung bình', color: 'bg-blue-500' };
  };

  const strength = getPasswordStrength(regPassword);

  // Submit Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = loginUsername.trim().toLowerCase();
    if (!cleanUsername) {
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
        username: cleanUsername,
        password: loginPassword,
      });

      onLoginSuccess(res.user, res.message || 'Đăng nhập thành công!');
    } catch (err: any) {
      setError(err?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập hoặc mật khẩu!');
    } finally {
      setLoading(false);
    }
  };

  // Submit Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanUsername = regUsername.trim().toLowerCase();
    if (!cleanUsername) {
      setError('Vui lòng nhập tên đăng nhập.');
      return;
    }
    if (cleanUsername.length < 3) {
      setError('Tên đăng nhập phải có ít nhất 3 ký tự.');
      return;
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      setError('Tên đăng nhập chỉ được chứa chữ không dấu, số, dấu chấm (.) hoặc gạch dưới (_), không khoảng trắng.');
      return;
    }
    if (!regFullName.trim()) {
      setError('Vui lòng nhập Họ và tên.');
      return;
    }
    if (!regPassword || regPassword.length < 6) {
      setError('Mật khẩu phải có từ 6 ký tự trở lên.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!');
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

      onLoginSuccess(res.user, res.message || 'Đăng ký tài khoản mới thành công!');
    } catch (err: any) {
      setError(err?.message || 'Đăng ký tài khoản thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Switch or Quick Login with account
  const handleSelectAccount = async (account: UserAccount) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.switchAccount({ username: account.username });
      onLoginSuccess(res.user, `Chào mừng Thầy/Cô ${account.fullName}!`);
    } catch (err: any) {
      setError(err?.message || 'Không thể đăng nhập vào tài khoản này.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04285E] via-[#064AA8] to-[#0866E8] flex flex-col justify-between text-white selection:bg-blue-500 selection:text-white">
      {/* Top Navigation / Brand Banner */}
      <header className="px-4 py-3 sm:px-8 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
            <Cloud className="w-5 h-5 text-cyan-300" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-2">
              Kho Dữ Liệu Cá Nhân – Thầy Gọn
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold">
                Đám Mây Bảo Mật
              </span>
            </h1>
            <p className="text-[11px] text-blue-200 hidden sm:block">
              Trường Tiểu học Phường An Xuyên, Thành phố Cà Mau, Tỉnh Cà Mau
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="hidden md:inline-flex items-center gap-1.5 text-amber-300 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Dữ liệu hôm nay – Giá trị ngày mai
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-white/10 text-blue-100 text-[11px] border border-white/15">
            Phiên bản 2026
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-md bg-white text-slate-800">
          
          {/* Left Hero Column: Teacher Info & Value Propositions */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#064AA8] to-[#0866E8] text-white p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Background decorative circles */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              {/* Teacher Avatar and School Title */}
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256"
                  alt="Thầy Từ Văn Gọn"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg ring-2 ring-blue-300/40"
                />
                <div>
                  <h3 className="font-bold text-base text-white">Thầy Từ Văn Gọn</h3>
                  <p className="text-xs text-blue-200">Giáo viên tiểu học</p>
                  <p className="text-[11px] text-amber-300 font-medium mt-0.5">Trường TH Phường An Xuyên</p>
                </div>
              </div>

              {/* System Overview */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 text-xs text-blue-100 border border-white/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Xác thực & Bảo mật tài khoản cá nhân</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                  Cổng Đăng Nhập & Đăng Ký Hệ Thống Lưu Trữ
                </h2>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Vui lòng đăng nhập hoặc tạo tài khoản giáo viên mới để truy cập 12 thư mục hồ sơ, giáo án điện tử, bài giảng và trợ lý AI lớp 1C.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2.5 text-xs text-blue-100 pt-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-cyan-300">
                    <Cloud className="w-3.5 h-3.5" />
                  </div>
                  <span>Lưu trữ 100 GB dung lượng đám mây tốc độ cao</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-300">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <span>Trợ lý AI hỗ trợ soạn giáo án & Thông tư 27</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-emerald-300">
                    <FolderLock className="w-3.5 h-3.5" />
                  </div>
                  <span>Phân quyền thư mục riêng tư và an toàn tuyệt đối</span>
                </div>
              </div>
            </div>

            {/* Bottom Quick Test Credentials */}
            <div className="relative z-10 pt-6 mt-6 border-t border-white/15 text-xs">
              <div className="p-3 rounded-xl bg-white/10 border border-white/15 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200">Tài khoản chính Thầy Gọn:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername('tuvangon');
                      setLoginPassword('thaygon2026');
                      setActiveTab('login');
                      setError(null);
                    }}
                    className="px-2 py-0.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-[10px] transition"
                  >
                    Điền nhanh
                  </button>
                </div>
                <div className="font-mono text-[11px] text-blue-100 flex items-center justify-between">
                  <span>Tên: <strong className="text-white">tuvangon</strong></span>
                  <span>MK: <strong className="text-white">thaygon2026</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column: Login / Register / Accounts Tabs */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
            <div>
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-200 bg-slate-50 p-1 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(null); }}
                  className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'login'
                      ? 'bg-white text-[#0866E8] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng nhập</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setError(null); }}
                  className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                    activeTab === 'register'
                      ? 'bg-white text-[#0866E8] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span>Đăng ký tài khoản</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-bold">Mới</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setActiveTab('accounts'); setError(null); }}
                  className={`py-2.5 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition ${
                    activeTab === 'accounts'
                      ? 'bg-white text-[#0866E8] shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Danh sách tài khoản hệ thống"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">({accounts.length})</span>
                </button>
              </div>

              {/* Error Message Box */}
              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="flex-1 font-medium">{error}</span>
                </div>
              )}

              {/* Tab 1: LOGIN FORM */}
              {activeTab === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-800">Đăng nhập vào kho dữ liệu</h3>
                    <p className="text-xs text-slate-500">
                      Nhập tên đăng nhập và mật khẩu được cấp hoặc đã đăng ký của bạn.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
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

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-slate-700">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => setError('Để cấp lại mật khẩu, vui lòng liên hệ quản trị viên hoặc sử dụng tài khoản tuvangon.')}>
                        Quên mật khẩu?
                      </span>
                    </div>
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
                        className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#064AA8] to-[#0866E8] hover:from-blue-700 hover:to-blue-800 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Đăng nhập vào kho dữ liệu</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <div className="pt-3 text-center">
                    <span className="text-xs text-slate-500">Chưa có tài khoản? </span>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('register'); setError(null); }}
                      className="text-xs font-bold text-[#0866E8] hover:underline"
                    >
                      Bấm vào đây để đăng ký mới
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 2: REGISTRATION FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold text-slate-800">Đăng ký tài khoản mới</h3>
                    <p className="text-xs text-slate-500">
                      Tạo tài khoản giáo viên riêng với tên đăng nhập và mật khẩu cá nhân.
                    </p>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                        @
                      </div>
                      <input
                        type="text"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        placeholder="ví dụ: cogaomaiphuong, tranvanan_1c..."
                        required
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Tối thiểu 3 ký tự (chữ cái, số, dấu chấm . hoặc gạch dưới _)
                    </span>
                  </div>

                  {/* Full Name */}
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
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Mật khẩu <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Tối thiểu 6 ký tự"
                          required
                          minLength={6}
                          className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] focus:border-transparent font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Xác nhận MK <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <KeyRound className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type={showRegConfirmPassword ? 'text' : 'password'}
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu"
                          required
                          minLength={6}
                          className={`w-full pl-8 pr-8 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 font-medium ${
                            regConfirmPassword && regConfirmPassword === regPassword
                              ? 'border-emerald-400 focus:ring-emerald-500'
                              : 'border-slate-300 focus:ring-[#0866E8]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                        >
                          {showRegConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Meter */}
                  {regPassword && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-500">Độ mạnh mật khẩu:</span>
                        <span className="font-semibold text-slate-700">{strength.label}</span>
                      </div>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                        <div className={`h-full flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                      </div>
                    </div>
                  )}

                  {/* School & Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Trường học / Đơn vị</label>
                      <input
                        type="text"
                        value={regSchool}
                        onChange={(e) => setRegSchool(e.target.value)}
                        placeholder="Trường Tiểu học Phường An Xuyên"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Chức vụ / Chuyên môn</label>
                      <input
                        type="text"
                        value={regTitle}
                        onChange={(e) => setRegTitle(e.target.value)}
                        placeholder="Giáo viên chủ nhiệm lớp 1"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] font-medium"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email liên hệ (tùy chọn)</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="giaovien@gmail.com"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại (tùy chọn)</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0918 xxx xxx"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0866E8] font-medium"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition transform active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 text-white" />
                        <span>Hoàn tất đăng ký & Vào kho dữ liệu</span>
                      </>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <span className="text-xs text-slate-500">Đã có tài khoản? </span>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('login'); setError(null); }}
                      className="text-xs font-bold text-[#0866E8] hover:underline"
                    >
                      Đăng nhập ngay
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 3: SYSTEM ACCOUNTS LIST */}
              {activeTab === 'accounts' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Tài khoản trên hệ thống ({accounts.length})
                    </span>
                    <button
                      type="button"
                      onClick={loadAccounts}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Làm mới
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                    {accounts.map((acc) => (
                      <div
                        key={acc.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={acc.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256'}
                            alt={acc.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                              {acc.fullName}
                            </div>
                            <div className="text-[11px] text-blue-600 font-mono">
                              @{acc.username} • {acc.title || 'Giáo viên'}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              {acc.school}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectAccount(acc)}
                          disabled={loading}
                          className="px-3 py-1.5 rounded-lg bg-[#0866E8] hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 transition shrink-0"
                        >
                          <span>Chọn</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setActiveTab('login')}
                      className="text-xs text-[#0866E8] font-bold hover:underline"
                    >
                      ← Quay lại màn hình đăng nhập
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Security Info */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Dữ liệu được mã hóa & lưu trữ an toàn
              </span>
              <span>An Xuyên, Cà Mau</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Notice */}
      <footer className="px-4 py-3 text-center text-xs text-blue-200/80 border-t border-white/10">
        Kho Dữ Liệu Cá Nhân – Hệ thống quản lý tài liệu & soạn giảng điện tử của Thầy Từ Văn Gọn
      </footer>
    </div>
  );
};
