import React, { useState } from 'react';
import {
  X,
  Share2,
  Mail,
  Link,
  Copy,
  Lock,
  Clock,
  Check,
  Shield,
  FileText
} from 'lucide-react';
import { FileItem } from '../types';
import { api } from '../services/api';

interface ShareModalProps {
  file: FileItem | null;
  isOpen: boolean;
  onClose: () => void;
  onShareUpdated: (updatedFile: FileItem) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  file,
  isOpen,
  onClose,
  onShareUpdated,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [permission, setPermission] = useState<'view' | 'download' | 'edit'>('view');
  const [linkType, setLinkType] = useState('Chỉ người có liên kết');
  const [isCopied, setIsCopied] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [expiresDays, setExpiresDays] = useState('7');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen || !file) return null;

  const currentShareLink = file.share?.shareLink || `https://ais-dev.cloud/share/thaygon-${file.id.substring(0, 8)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentShareLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendEmailShare = async () => {
    if (!emailInput.trim()) return;
    setIsSaving(true);
    try {
      const currentEmails = file.share?.sharedWithEmails || [];
      const updated = await api.shareFile(file.id, {
        shareType: 'restricted',
        permission,
        sharedWithEmails: [...currentEmails, emailInput.trim()],
        expiresDays: Number(expiresDays),
        passwordProtected: hasPassword,
      });
      onShareUpdated(updated);
      setEmailInput('');
      alert(`Đã gửi quyền truy cập tới ${emailInput.trim()}`);
    } catch (err: any) {
      alert(err.message || 'Lỗi chia sẻ');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateShareLink = async () => {
    setIsSaving(true);
    try {
      const updated = await api.shareFile(file.id, {
        shareType: 'public_link',
        permission,
        expiresDays: Number(expiresDays),
        passwordProtected: hasPassword,
      });
      onShareUpdated(updated);
      handleCopyLink();
    } catch (err: any) {
      alert(err.message || 'Lỗi tạo liên kết');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-blue-100 overflow-hidden animate-in fade-in zoom-in-95 my-auto">
        {/* Header (Screen 8 Top) */}
        <div className="bg-[#0866E8] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-sm flex-shrink-0">
              8
            </span>
            <div className="min-w-0">
              <h3 className="font-extrabold text-base truncate">
                Chia sẻ: {file.name}
              </h3>
              <p className="text-xs text-blue-100">Cấu hình phân quyền và liên kết truy cập an toàn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Chia sẻ cho người khác */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              Chia sẻ cho người khác
            </h4>

            <div className="flex gap-2">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Nhập email người nhận (ví dụ: hieutruong@camau.edu.vn)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="view">Người xem</option>
                <option value="download">Người tải xuống</option>
                <option value="edit">Người chỉnh sửa</option>
              </select>

              <button
                onClick={handleSendEmailShare}
                disabled={!emailInput.trim() || isSaving}
                className="px-5 py-2.5 rounded-xl bg-[#0866E8] hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                Gửi
              </button>
            </div>

            {/* Already shared emails */}
            {file.share?.sharedWithEmails && file.share.sharedWithEmails.length > 0 && (
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
                <span className="font-bold text-slate-600 text-[11px] block">Đã cấp quyền cho:</span>
                {file.share.sharedWithEmails.map((email, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700">
                    <span>{email}</span>
                    <span className="text-[10px] text-blue-600 font-bold uppercase">{file.share.permission}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Tạo liên kết chia sẻ (Screen 8 Center) */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Link className="w-4 h-4 text-blue-600" />
              Tạo liên kết chia sẻ
            </h4>

            <div className="flex gap-2">
              <select
                value={linkType}
                onChange={(e) => setLinkType(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="Chỉ người có liên kết">Chỉ người có liên kết</option>
                <option value="Công khai trên Internet">Bất kỳ ai có liên kết (Công khai)</option>
              </select>

              <button
                onClick={handleCreateShareLink}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
              >
                Tạo liên kết
              </button>
            </div>

            {/* Generated Link Box */}
            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
              <input
                type="text"
                readOnly
                value={currentShareLink}
                className="flex-1 bg-transparent text-xs text-blue-800 font-mono px-2 outline-none select-all truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-[#0866E8] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs flex-shrink-0"
              >
                {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Đã chép' : 'Sao chép'}</span>
              </button>
            </div>
          </div>

          {/* Password Protection & Expiration (Screen 8 Bottom Options) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 text-xs">
            {/* Password Protection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPassword}
                  onChange={(e) => setHasPassword(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Đặt mật khẩu cho liên kết
                </span>
              </label>

              {hasPassword && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mã bảo vệ..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>

            {/* Expiration */}
            <div className="space-y-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Thời hạn liên kết
              </span>

              <select
                value={expiresDays}
                onChange={(e) => setExpiresDays(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="1">24 giờ (1 ngày)</option>
                <option value="7">7 ngày</option>
                <option value="30">30 ngày</option>
                <option value="0">Không bao giờ hết hạn</option>
              </select>
            </div>
          </div>

          {/* Footer Close */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
