import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Video,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  ChevronLeft,
  ChevronRight,
  History,
  Tag,
  Folder,
  Calendar,
  HardDrive,
  User,
  Star,
  Info,
  Trash2
} from 'lucide-react';
import { FileItem } from '../types';
import { formatBytes, formatDate } from '../services/api';

interface FilePreviewModalProps {
  file: FileItem | null;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onOpenVersions: (file: FileItem) => void;
  onToggleFavorite: (file: FileItem) => void;
  onDelete?: (file: FileItem) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  file,
  onClose,
  onDownload,
  onShare,
  onOpenVersions,
  onToggleFavorite,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showMetadata, setShowMetadata] = useState(true);

  if (!file) return null;

  const totalPages = file.type === 'pdf' ? 36 : file.type === 'powerpoint' ? 12 : 5;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(200, z + 20));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(60, z - 20));

  const getFileIcon = () => {
    switch (file.type) {
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
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-slate-100 rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col border border-slate-300 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Header Bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-xs">
          {/* File Name & Icon */}
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs flex-shrink-0">
              4
            </span>
            <div className="p-2 rounded-xl bg-slate-100 flex-shrink-0">
              {getFileIcon()}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate" title={file.name}>
                {file.name}
              </h3>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>{file.folderName}</span>
                <span>•</span>
                <span>{formatBytes(file.sizeBytes)}</span>
                {file.versions?.length > 1 && (
                  <>
                    <span>•</span>
                    <span className="text-blue-600 font-bold">{file.versions[0].versionLabel}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => onDownload(file)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#0866E8] hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Tải xuống</span>
            </button>

            <button
              onClick={() => onShare(file)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold transition"
            >
              <Share2 className="w-4 h-4 text-purple-600" />
              <span className="hidden sm:inline">Chia sẻ</span>
            </button>

            <button
              onClick={() => onOpenVersions(file)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              title="Quản lý lịch sử phiên bản"
            >
              <History className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Phiên bản</span>
            </button>

            <button
              onClick={() => onToggleFavorite(file)}
              className={`p-2 rounded-xl transition ${
                file.isFavorite ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title="Yêu thích"
            >
              <Star className={`w-4 h-4 ${file.isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            {onDelete && (
              <button
                onClick={() => {
                  onClose();
                  onDelete(file);
                }}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition"
                title="Chuyển vào thùng rác"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setShowMetadata(!showMetadata)}
              className={`p-2 rounded-xl transition hidden lg:block ${
                showMetadata ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-100'
              }`}
              title="Thông tin chi tiết"
            >
              <Info className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition"
              title="Đóng xem trước"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar for Document Reader */}
        <div className="bg-slate-200/80 px-4 py-2 border-b border-slate-300 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            {/* Page navigation */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-white text-slate-600 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium bg-white px-2.5 py-0.5 rounded border border-slate-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-white text-slate-600 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-300">
              <button onClick={handleZoomOut} className="p-0.5 hover:text-blue-600">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-bold text-slate-700 min-w-[35px] text-center">
                {zoomLevel}%
              </span>
              <button onClick={handleZoomIn} className="p-0.5 hover:text-blue-600">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setZoomLevel(100)}
              className="p-1.5 rounded hover:bg-white text-slate-600"
              title="Khôi phục kích thước chuẩn"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Content Area: Left Thumbnails + Middle Canvas + Right Metadata */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Thumbnails (for PDF / PPT) */}
          {(file.type === 'pdf' || file.type === 'powerpoint') && (
            <div className="hidden md:flex flex-col w-36 bg-slate-100 border-r border-slate-300 p-3 overflow-y-auto space-y-3">
              {[1, 2, 3, 4, 5].map((pageNum) => (
                <div
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`p-2 rounded-xl border text-center cursor-pointer transition ${
                    currentPage === pageNum
                      ? 'border-blue-600 bg-blue-50/80 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="aspect-[3/4] bg-slate-50 border border-slate-200 rounded p-1 text-[7px] text-slate-400 flex flex-col justify-between overflow-hidden">
                    <div className="h-1 bg-slate-300 rounded w-3/4 mb-1"></div>
                    <div className="h-0.5 bg-slate-200 rounded w-full my-0.5"></div>
                    <div className="h-0.5 bg-slate-200 rounded w-5/6 my-0.5"></div>
                    <div className="h-0.5 bg-slate-200 rounded w-full my-0.5"></div>
                    <div className="h-1 bg-blue-200 rounded w-1/2 mt-auto"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 mt-1 block">
                    Trang {pageNum}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Middle Document Viewer Canvas */}
          <div className="flex-1 bg-slate-300/40 p-4 sm:p-6 overflow-auto flex justify-center items-start">
            <div
              className="bg-white shadow-xl rounded-xl transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center',
                width: file.type === 'excel' ? '95%' : '800px',
                minHeight: '900px',
              }}
            >
              {/* Type 1: PDF Viewer Rendering */}
              {file.type === 'pdf' && (
                <div className="p-8 sm:p-12 text-slate-800 leading-relaxed font-serif">
                  <div className="text-center border-b pb-6 mb-6">
                    <div className="text-xs uppercase font-sans font-bold text-slate-600">
                      BỘ GIÁO DỤC VÀ ĐÀO TẠO
                    </div>
                    <div className="text-xs text-slate-500 font-sans mt-0.5">
                      Số: 27/2020/TT-BGDĐT
                    </div>
                    <div className="mt-4 text-lg sm:text-xl font-bold uppercase tracking-wide text-slate-900 font-sans">
                      QUY ĐỊNH ĐÁNH GIÁ HỌC SINH TIỂU HỌC
                    </div>
                    <div className="text-xs text-slate-500 italic mt-1 font-sans">
                      (Ban hành kèm theo Thông tư số 27/2020/TT-BGDĐT ngày 04 tháng 9 năm 2020 của Bộ trưởng Bộ GD&ĐT)
                    </div>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="font-bold text-center uppercase tracking-wide font-sans text-slate-900">
                      Chương I: NHỮNG QUY ĐỊNH CHUNG
                    </div>
                    <div>
                      <span className="font-bold">Điều 1. Phạm vi điều chỉnh và đối tượng áp dụng:</span>
                      <p className="mt-1 text-slate-700 pl-4">
                        1. Quy định này quy định về đánh giá học sinh tiểu học, bao gồm: đánh giá quá trình học tập, sự tiến bộ và kết quả học tập của học sinh; đánh giá sự hình thành và phát triển phẩm chất, năng lực của học sinh tiểu học; hồ sơ đánh giá và sử dụng kết quả đánh giá.
                      </p>
                      <p className="mt-1 text-slate-700 pl-4">
                        2. Quy định này áp dụng đối với các trường tiểu học, trường phổ thông có nhiều cấp học có cấp tiểu học, trường chuyên biệt và các cơ sở giáo dục khác thực hiện chương trình giáo dục phổ thông cấp tiểu học.
                      </p>
                    </div>

                    <div>
                      <span className="font-bold">Điều 5. Mục đích đánh giá:</span>
                      <p className="mt-1 text-slate-700 pl-4">
                        Cung cấp thông tin chính xác, kịp thời, xác định được thành tích học tập, rèn luyện theo mức độ đáp ứng yêu cầu cần đạt của chương trình giáo dục phổ thông cấp tiểu học và sự tiến bộ của học sinh để hướng dẫn hoạt động học tập, điều chỉnh các hoạt động dạy học nhằm nâng cao chất lượng giáo dục.
                      </p>
                    </div>

                    <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-200 font-sans text-xs not-italic text-blue-900">
                      <strong>Ghi chú chuyên môn của Thầy Từ Văn Gọn:</strong>
                      <p className="mt-1">
                        Áp dụng triệt để nguyên tắc đánh giá vì sự tiến bộ của học sinh lớp 1C tại Trường Tiểu học Phường An Xuyên. Chú trọng động viên, khen ngợi học sinh hoàn thành bài học, không tạo áp lực điểm số.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Type 2: Word Lesson Plan Viewer */}
              {file.type === 'word' && (
                <div className="p-8 sm:p-12 text-slate-800 leading-relaxed font-sans text-xs sm:text-sm">
                  <div className="border-b pb-4 mb-6">
                    <div className="text-xs uppercase font-bold text-slate-600">
                      TRƯỜNG TIỂU HỌC PHƯỜNG AN XUYÊN – TP CÀ MAU
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-0.5">
                      GIÁO VIÊN: TỪ VĂN GỌN – LỚP 1C
                    </div>
                    <div className="mt-4 text-xl font-bold uppercase text-blue-700">
                      {file.name.replace('.docx', '')}
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed space-y-2">
                    {file.rawContent || file.contentSnippet}
                  </div>
                </div>
              )}

              {/* Type 3: Excel Table Viewer */}
              {file.type === 'excel' && (
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="font-bold text-slate-900 text-base">{file.name}</h4>
                    <p className="text-xs text-slate-500">Xem trước bảng tính trực tiếp</p>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-emerald-600 text-white font-bold">
                        <tr>
                          <th className="p-2.5 border-r border-emerald-500">STT</th>
                          <th className="p-2.5 border-r border-emerald-500">Mã HS</th>
                          <th className="p-2.5 border-r border-emerald-500">Họ và tên</th>
                          <th className="p-2.5 border-r border-emerald-500">Ngày sinh</th>
                          <th className="p-2.5 border-r border-emerald-500">Giới tính</th>
                          <th className="p-2.5 border-r border-emerald-500">Phụ huynh</th>
                          <th className="p-2.5 border-r border-emerald-500">Số điện thoại</th>
                          <th className="p-2.5">Địa chỉ tại An Xuyên</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {[
                          { stt: 1, id: 'HS01', name: 'Nguyễn Hoàng An', dob: '12/03/2020', gender: 'Nam', parent: 'Nguyễn Văn Hùng', phone: '0913.882.123', addr: 'Khóm 3, P. An Xuyên' },
                          { stt: 2, id: 'HS02', name: 'Trần Bảo Anh', dob: '05/06/2020', gender: 'Nữ', parent: 'Trần Văn Tuấn', phone: '0944.221.789', addr: 'Ấp Tân Hiệp, P. An Xuyên' },
                          { stt: 3, id: 'HS03', name: 'Lê Minh Cường', dob: '22/01/2020', gender: 'Nam', parent: 'Lê Thành Đạt', phone: '0907.551.442', addr: 'Khóm 1, P. An Xuyên' },
                          { stt: 4, id: 'HS04', name: 'Phạm Quỳnh Chi', dob: '14/09/2020', gender: 'Nữ', parent: 'Phạm Văn Long', phone: '0989.112.334', addr: 'Khóm 2, P. An Xuyên' },
                          { stt: 5, id: 'HS05', name: 'Đỗ Gia Huy', dob: '30/11/2020', gender: 'Nam', parent: 'Đỗ Minh Trí', phone: '0918.447.889', addr: 'P. Tân Thành, TP Cà Mau' },
                          { stt: 6, id: 'HS06', name: 'Huỳnh Ngọc Mai', dob: '18/07/2020', gender: 'Nữ', parent: 'Huỳnh Văn Phát', phone: '0939.667.120', addr: 'Khóm 4, P. An Xuyên' },
                          { stt: 7, id: 'HS07', name: 'Võ Minh Khôi', dob: '09/04/2020', gender: 'Nam', parent: 'Võ Văn Bình', phone: '0948.334.556', addr: 'Ấp Cây Trâm, P. An Xuyên' },
                        ].map((row) => (
                          <tr key={row.stt} className="hover:bg-emerald-50/50">
                            <td className="p-2.5 font-bold text-center border-r">{row.stt}</td>
                            <td className="p-2.5 font-medium border-r text-slate-500">{row.id}</td>
                            <td className="p-2.5 font-bold border-r text-slate-800">{row.name}</td>
                            <td className="p-2.5 border-r">{row.dob}</td>
                            <td className="p-2.5 border-r">{row.gender}</td>
                            <td className="p-2.5 border-r">{row.parent}</td>
                            <td className="p-2.5 border-r font-mono text-blue-600">{row.phone}</td>
                            <td className="p-2.5">{row.addr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Type 4: PowerPoint Slide Viewer */}
              {file.type === 'powerpoint' && (
                <div className="p-8 bg-gradient-to-br from-amber-500 to-orange-600 text-white min-h-[500px] rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold opacity-80">
                      BÀI GIẢNG ĐIỆN TỬ LỚP 1C
                    </div>
                    <div className="text-2xl sm:text-3xl font-black mt-4">
                      {file.name.replace('.pptx', '')}
                    </div>
                    <div className="text-sm mt-2 opacity-90">
                      Chủ đề: Học vần an – at | Giáo viên: Thầy Từ Văn Gọn
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 my-6">
                    <div className="text-lg font-bold">Slide {currentPage}: Khám phá vần mới</div>
                    <div className="text-sm mt-2 whitespace-pre-wrap leading-relaxed">
                      {file.contentSnippet}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs opacity-90 border-t border-white/20 pt-3">
                    <span>Trường Tiểu học Phường An Xuyên – TP Cà Mau</span>
                    <span>Năm học 2026 – 2027</span>
                  </div>
                </div>
              )}

              {/* Type 5: Video Player */}
              {file.type === 'video' && (
                <div className="p-6">
                  <div className="aspect-video bg-black rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <video
                      controls
                      className="w-full h-full object-cover"
                      poster="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=800"
                    >
                      <source src="/api/files/stream" type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ phát video.
                    </video>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-bold text-slate-800 text-sm">{file.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">{file.description}</p>
                  </div>
                </div>
              )}

              {/* Type 6: Image / Other */}
              {file.type === 'image' && (
                <div className="p-6 flex flex-col items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800"
                    alt={file.name}
                    className="max-h-[600px] rounded-xl shadow-lg object-contain"
                  />
                  <p className="text-xs text-slate-500 mt-3">{file.name}</p>
                </div>
              )}

              {file.type === 'zip' && (
                <div className="p-10 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                    <HardDrive className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg">{file.name}</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">{file.description}</p>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs whitespace-pre-wrap max-w-lg mx-auto">
                    {file.rawContent}
                  </div>
                  <button
                    onClick={() => onDownload(file)}
                    className="px-6 py-2.5 rounded-full bg-[#0866E8] text-white font-bold text-xs"
                  >
                    Tải về tệp nén ({formatBytes(file.sizeBytes)})
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Metadata Panel */}
          {showMetadata && (
            <div className="w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto space-y-5 hidden lg:block">
              <div>
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-3">
                  Thông tin tài liệu
                </h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium block">Tên tệp</span>
                    <span className="text-slate-800 font-semibold break-words">{file.name}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Định dạng</span>
                    <span className="text-slate-800 font-semibold uppercase">{file.extension} ({file.type})</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Dung lượng</span>
                    <span className="text-slate-800 font-semibold">{formatBytes(file.sizeBytes)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Thư mục lưu trữ</span>
                    <span className="text-blue-600 font-semibold flex items-center gap-1">
                      <Folder className="w-3.5 h-3.5" />
                      {file.folderName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Chủ sở hữu</span>
                    <span className="text-slate-800 font-semibold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {file.owner}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium block">Ngày tải lên</span>
                    <span className="text-slate-800 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(file.createdAt)}
                    </span>
                  </div>

                  {file.tags && file.tags.length > 0 && (
                    <div>
                      <span className="text-slate-400 font-medium block mb-1">Từ khóa</span>
                      <div className="flex flex-wrap gap-1">
                        {file.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[10px] font-semibold flex items-center gap-1"
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {file.description && (
                    <div>
                      <span className="text-slate-400 font-medium block mb-0.5">Mô tả</span>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        {file.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Version Count Link */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={() => onOpenVersions(file)}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center justify-between transition"
                >
                  <span className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Lịch sử phiên bản ({file.versions?.length || 1})
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
