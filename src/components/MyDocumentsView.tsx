import React, { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Video,
  Download,
  Share2,
  Eye,
  Star,
  Trash2,
  Folder,
  LayoutGrid,
  List,
  Upload,
  FolderPlus,
  ChevronRight,
  Filter,
  History,
  Tag
} from 'lucide-react';
import { FileItem, FolderItem, FileType } from '../types';
import { formatBytes, formatDate } from '../services/api';

interface MyDocumentsViewProps {
  files: FileItem[];
  folders: FolderItem[];
  currentFolderId?: string;
  onSelectFolder: (folder: FolderItem | null) => void;
  onOpenFile: (file: FileItem) => void;
  onDownloadFile: (file: FileItem) => void;
  onShareFile: (file: FileItem) => void;
  onOpenVersions: (file: FileItem) => void;
  onToggleFavorite: (file: FileItem) => void;
  onMoveToTrash: (file: FileItem) => void;
  onOpenUpload: (folderId?: string) => void;
}

export const MyDocumentsView: React.FC<MyDocumentsViewProps> = ({
  files,
  folders,
  currentFolderId,
  onSelectFolder,
  onOpenFile,
  onDownloadFile,
  onShareFile,
  onOpenVersions,
  onToggleFavorite,
  onMoveToTrash,
  onOpenUpload,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const activeFolder = folders.find((f) => f.id === currentFolderId);

  const displayedFiles = files.filter((f) => {
    if (f.isDeleted) return false;
    if (currentFolderId && f.folderId !== currentFolderId) return false;
    if (filterType !== 'all' && f.type !== filterType) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.description?.toLowerCase().includes(q) ||
        f.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getFileBadgeColor = (type: FileType) => {
    switch (type) {
      case 'pdf': return 'bg-red-50 text-red-600 border-red-200';
      case 'word': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'excel': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'powerpoint': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'image': return 'bg-cyan-50 text-cyan-600 border-cyan-200';
      case 'video': return 'bg-purple-50 text-purple-600 border-purple-200';
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
      {/* Top Header & Breadcrumb */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <span
              onClick={() => onSelectFolder(null)}
              className="hover:text-blue-600 cursor-pointer font-medium"
            >
              Tất cả tài liệu
            </span>
            {activeFolder && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-800">{activeFolder.name}</span>
              </>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            {activeFolder ? activeFolder.name : 'Tất cả tài liệu của tôi'}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenUpload(currentFolderId)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0866E8] text-white hover:bg-blue-700 font-semibold text-xs shadow-md transition"
          >
            <Upload className="w-4 h-4" />
            <span>Tải lên tệp</span>
          </button>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="Xem danh sách"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
              title="Xem dạng lưới"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Lọc tài liệu theo tên, từ khóa..."
          className="flex-1 bg-white text-slate-800 text-xs sm:text-sm px-4 py-2.5 rounded-2xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />

        {/* Quick Type Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'word', label: 'Word' },
            { id: 'pdf', label: 'PDF' },
            { id: 'excel', label: 'Excel' },
            { id: 'powerpoint', label: 'PPT' },
            { id: 'image', label: 'Ảnh' },
            { id: 'video', label: 'Video' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                filterType === item.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content: List or Grid */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl shadow-xs border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tên tài liệu</th>
                  <th className="py-3.5 px-4">Loại</th>
                  <th className="py-3.5 px-4">Dung lượng</th>
                  <th className="py-3.5 px-4">Thư mục</th>
                  <th className="py-3.5 px-4">Ngày tải lên</th>
                  <th className="py-3.5 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {displayedFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-blue-50/40 transition group">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-shrink-0 cursor-pointer"
                          onClick={() => onOpenFile(file)}
                        >
                          {getFileIcon(file.type)}
                        </div>
                        <div className="min-w-0">
                          <span
                            onClick={() => onOpenFile(file)}
                            className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer truncate block max-w-xs sm:max-w-md"
                            title={file.name}
                          >
                            {file.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            {file.versions?.length > 1 && (
                              <span
                                onClick={() => onOpenVersions(file)}
                                className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-bold cursor-pointer hover:bg-blue-200"
                              >
                                {file.versions[0].versionLabel}
                              </span>
                            )}
                            {file.share?.isShared && (
                              <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-0.5">
                                <Share2 className="w-2.5 h-2.5" /> Đã chia sẻ
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getFileBadgeColor(file.type)}`}>
                        {file.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {formatBytes(file.sizeBytes)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-medium">
                      {file.folderName}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(file.createdAt)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
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
                          onClick={() => onOpenVersions(file)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition"
                          title="Lịch sử phiên bản"
                        >
                          <History className="w-4 h-4" />
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
                        <button
                          onClick={() => onMoveToTrash(file)}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition"
                          title="Chuyển vào thùng rác"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {displayedFiles.map((file) => (
            <div
              key={file.id}
              className="bg-white p-4 rounded-2xl shadow-xs border border-blue-100 hover:border-blue-300 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="cursor-pointer"
                    onClick={() => onOpenFile(file)}
                  >
                    {getFileIcon(file.type)}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(file)}
                      className={`p-1 rounded-lg ${
                        file.isFavorite ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${file.isFavorite ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <h4
                  onClick={() => onOpenFile(file)}
                  className="font-bold text-slate-900 group-hover:text-blue-600 text-xs sm:text-sm line-clamp-2 cursor-pointer"
                  title={file.name}
                >
                  {file.name}
                </h4>

                <p className="text-[11px] text-slate-400 mt-1 truncate">
                  {file.folderName}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{formatBytes(file.sizeBytes)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenFile(file)}
                    className="p-1 hover:text-blue-600"
                    title="Xem"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDownloadFile(file)}
                    className="p-1 hover:text-emerald-600"
                    title="Tải về"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onShareFile(file)}
                    className="p-1 hover:text-purple-600"
                    title="Chia sẻ"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
