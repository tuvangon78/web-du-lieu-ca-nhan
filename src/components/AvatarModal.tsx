import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  Image as ImageIcon,
  Link as LinkIcon,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../types';

interface AvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveAvatar: (newAvatarUrl: string, file?: File) => Promise<void>;
}

// Curated pedagogical avatars for primary teachers and educators
const PRESET_AVATARS = [
  {
    id: 'original-thaygon',
    label: 'Thầy Từ Văn Gọn (Ảnh thực tế)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=350',
    category: 'Thực tế',
  },
  {
    id: 'teacher-male-formal',
    label: 'Thầy giáo sơ mi lịch sự',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=350',
    category: 'Sư phạm nam',
  },
  {
    id: 'teacher-male-friendly',
    label: 'Thầy giáo trẻ trung, thân thiện',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=350',
    category: 'Sư phạm nam',
  },
  {
    id: 'teacher-male-glasses',
    label: 'Thầy giáo trí thức, hiện đại',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=350',
    category: 'Sư phạm nam',
  },
  {
    id: 'teacher-male-smile',
    label: 'Thầy giáo phong thái rạng rỡ',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=350',
    category: 'Sư phạm nam',
  },
  {
    id: 'teacher-female-formal',
    label: 'Cô giáo mẫu mực, duyên dáng',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=350',
    category: 'Sư phạm nữ',
  },
  {
    id: 'teacher-female-gentle',
    label: 'Cô giáo hiền hòa, thanh lịch',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=350',
    category: 'Sư phạm nữ',
  },
  {
    id: 'teacher-female-young',
    label: 'Cô giáo năng động, tận tâm',
    url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=350',
    category: 'Sư phạm nữ',
  },
  {
    id: 'teacher-illustration-3d',
    label: 'Avatar 3D Sư phạm hiện đại',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=350',
    category: 'Minh họa 3D',
  },
];

export const AvatarModal: React.FC<AvatarModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'url'>('upload');
  const [previewUrl, setPreviewUrl] = useState<string>(currentUser.avatarUrl);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP, GIF, SVG)!');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Dung lượng ảnh tối đa cho phép là 15 MB. Vui lòng chọn ảnh nhỏ hơn!');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Apply URL
  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) {
      setErrorMsg('Vui lòng nhập đường dẫn liên kết hình ảnh!');
      return;
    }
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('data:image')) {
      setErrorMsg('Đường dẫn phải bắt đầu bằng https:// hoặc http://');
      return;
    }
    setSelectedFile(null);
    setPreviewUrl(cleanUrl);
  };

  // Choose preset from gallery
  const handleSelectPreset = (url: string) => {
    setErrorMsg(null);
    setSelectedFile(null);
    setPreviewUrl(url);
  };

  // Reset to initial original avatar
  const handleReset = () => {
    setErrorMsg(null);
    setSelectedFile(null);
    setPreviewUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=350');
  };

  // Save changes
  const handleSave = async () => {
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onSaveAvatar(previewUrl, selectedFile || undefined);
      onClose();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Có lỗi xảy ra khi cập nhật ảnh đại diện. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 flex flex-col my-auto max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#0866E8] via-blue-700 to-[#064AA8] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Thay Đổi Ảnh Đại Diện Trang Web
              </h3>
              <p className="text-xs text-blue-100 opacity-90">
                Hiển thị trên thanh tiêu đề trang chủ và hồ sơ Thầy {currentUser.fullName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition disabled:opacity-50"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Header Banner Real-Time Preview Simulation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold px-1">
              <span className="flex items-center gap-1.5 text-blue-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Xem trước ảnh đại diện trên thanh tiêu đề trang web:
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Trực quan thời gian thực</span>
            </div>

            {/* Simulated Header Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0866E8] to-[#0a52bd] p-3 sm:p-4 text-white shadow-md border border-blue-400/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={previewUrl}
                    alt={currentUser.fullName}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-full object-cover border-2 sm:border-[3px] border-white shadow-md ring-2 ring-blue-300/50"
                    onError={(e) => {
                      // Fallback if image URL fails to load
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256';
                    }}
                  />
                  <span
                    className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#0866E8] shadow-xs"
                    title="Đang trực tuyến"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-black tracking-wide uppercase text-white truncate drop-shadow-xs">
                    {currentUser.fullName}
                  </div>
                  <div className="text-xs text-blue-100 font-normal truncate opacity-95">
                    {currentUser.title} – {currentUser.school}
                  </div>
                  <div className="text-[11px] text-blue-200 truncate">
                    {currentUser.province}
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-end shrink-0 text-right">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/15 text-white border border-white/25 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  Đã xác thực
                </span>
                <span className="text-[10px] text-blue-200 mt-1">Cà Mau, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('upload')}
              className={`pb-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'upload'
                  ? 'border-[#0866E8] text-[#0866E8]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Tải ảnh từ máy tính/điện thoại</span>
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`pb-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'gallery'
                  ? 'border-[#0866E8] text-[#0866E8]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Bộ sưu tập mẫu</span>
            </button>

            <button
              onClick={() => setActiveTab('url')}
              className={`pb-2.5 px-3 sm:px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'url'
                  ? 'border-[#0866E8] text-[#0866E8]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Dán liên kết ảnh (URL)</span>
            </button>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD FILE */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
                  dragOver
                    ? 'border-[#0866E8] bg-blue-50/70 scale-[0.99]'
                    : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/70'
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-100/70 text-[#0866E8] flex items-center justify-center shadow-xs">
                  <Upload className="w-7 h-7" />
                </div>

                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Nhấp để chọn ảnh hoặc kéo thả ảnh vào đây
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Hỗ trợ các định dạng ảnh: PNG, JPG, JPEG, WEBP, GIF (Dung lượng tối đa: 15 MB)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#0866E8] hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition"
                >
                  Chọn tệp ảnh từ thiết bị
                </button>
              </div>

              {selectedFile && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={previewUrl}
                      alt="Selected preview"
                      className="w-10 h-10 rounded-full object-cover border border-emerald-300"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 truncate max-w-xs">
                        {selectedFile.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Tệp ảnh sẵn sàng cập nhật
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                    Đã tải lên
                  </span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRESET GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Chọn một trong các mẫu ảnh chân dung sư phạm chuẩn hóa bên dưới. Bấm vào ảnh để áp dụng ngay:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-1">
                {PRESET_AVATARS.map((item) => {
                  const isSelected = previewUrl === item.url;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectPreset(item.url)}
                      className={`relative p-2.5 rounded-2xl border text-left transition flex items-center gap-3 ${
                        isSelected
                          ? 'border-[#0866E8] bg-blue-50/80 ring-2 ring-blue-500/30 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-800 truncate leading-tight">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                          {item.category}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#0866E8] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: IMAGE URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Đường dẫn hình ảnh trực tuyến (Image URL)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... hoặc link ảnh bất kỳ"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0866E8]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-[#0866E8] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition whitespace-nowrap"
                  >
                    Xem trước
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Mẹo: Thầy/Cô có thể dán đường dẫn ảnh công khai từ Google Photos, Drive, Zalo, Facebook hoặc bất kỳ trang web nào.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Khôi phục ảnh gốc</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-bold text-xs transition disabled:opacity-50"
            >
              Hủy
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#0866E8] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Đang lưu ảnh...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Lưu ảnh đại diện</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
