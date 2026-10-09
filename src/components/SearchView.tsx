import React, { useState } from 'react';
import {
  Search,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Video,
  Download,
  Eye,
  Filter,
  Share2,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { FileItem, FileType } from '../types';
import { formatBytes, formatDate } from '../services/api';

interface SearchViewProps {
  files: FileItem[];
  initialQuery?: string;
  onOpenFile: (file: FileItem) => void;
  onDownloadFile: (file: FileItem) => void;
  onShareFile: (file: FileItem) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({
  files,
  initialQuery = '',
  onOpenFile,
  onDownloadFile,
  onShareFile,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name' | 'size'>('newest');

  const filterChips = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pdf', label: 'PDF', icon: FileText, color: 'text-red-500' },
    { id: 'word', label: 'Word', icon: FileText, color: 'text-blue-600' },
    { id: 'excel', label: 'Excel', icon: FileSpreadsheet, color: 'text-emerald-600' },
    { id: 'powerpoint', label: 'PowerPoint', icon: Presentation, color: 'text-amber-500' },
    { id: 'image', label: 'Hình ảnh', icon: ImageIcon, color: 'text-cyan-500' },
    { id: 'video', label: 'Video', icon: Video, color: 'text-purple-600' },
  ];

  const filtered = files.filter((f) => {
    if (f.isDeleted) return false;
    if (selectedType !== 'all' && f.type !== selectedType) return false;

    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.folderName.toLowerCase().includes(q) ||
      f.description?.toLowerCase().includes(q) ||
      f.tags?.some((t) => t.toLowerCase().includes(q)) ||
      f.contentSnippet?.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'size') return b.sizeBytes - a.sizeBytes;
    return 0;
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
      {/* Search Header Bar (Screen 6 Top) */}
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-blue-100 space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            6
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Tìm kiếm tài liệu
          </h2>
        </div>

        {/* Big Search Input with Blue Button */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập tên giáo án, từ khóa, Thông tư 27, môn học, lớp 1C..."
              className="w-full bg-slate-50 text-slate-800 text-sm pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-inner transition"
              autoFocus
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => {}}
            className="px-6 py-3 bg-[#0866E8] hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-md transition flex items-center gap-2 flex-shrink-0"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Tìm kiếm</span>
          </button>
        </div>

        {/* Filter Chips Bar (Screen 6 Filter row) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Lọc theo:
          </span>

          {filterChips.map((chip) => {
            const Icon = chip.icon;
            const isSelected = selectedType === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedType(chip.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                  isSelected
                    ? 'bg-[#0866E8] text-white border-blue-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {Icon && <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : chip.color}`} />}
                <span>{chip.label}</span>
              </button>
            );
          })}

          {/* Sort Dropdown */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden md:inline">Sắp xếp:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-none text-slate-700"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="name">Tên A – Z</option>
              <option value="size">Dung lượng giảm dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 px-1">
        <span className="font-bold text-slate-800">
          Tìm thấy <span className="text-blue-600 font-black">{sorted.length}</span> kết quả
          {query && <span> cho từ khóa "<span className="italic text-slate-900">{query}</span>"</span>}
        </span>
      </div>

      {/* Results Table (Screen 6 Results Grid) */}
      <div className="bg-white rounded-2xl shadow-xs border border-blue-100 overflow-hidden">
        {sorted.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Search className="w-10 h-10 mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600">Không tìm thấy tài liệu phù hợp</p>
            <p className="text-xs">Thử tìm kiếm với từ khóa khác như "Toán", "Giáo án", "Thông tư" hoặc xóa bộ lọc.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-3 px-4">Tên tài liệu</th>
                  <th className="py-3 px-4">Loại</th>
                  <th className="py-3 px-4">Dung lượng</th>
                  <th className="py-3 px-4">Ngày tải lên</th>
                  <th className="py-3 px-4">Thư mục</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sorted.map((file) => (
                  <tr key={file.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-shrink-0 cursor-pointer"
                          onClick={() => onOpenFile(file)}
                        >
                          {getFileIcon(file.type)}
                        </div>
                        <div className="min-w-0">
                          <div
                            onClick={() => onOpenFile(file)}
                            className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer truncate max-w-xs sm:max-w-md"
                            title={file.name}
                          >
                            {file.name}
                          </div>
                          {file.contentSnippet && (
                            <div className="text-[11px] text-slate-400 truncate max-w-sm">
                              {file.contentSnippet}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getFileBadgeColor(file.type)}`}>
                        {file.type}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-600">
                      {formatBytes(file.sizeBytes)}
                    </td>

                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(file.createdAt)}
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {file.folderName}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onOpenFile(file)}
                          className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                          title="Xem trước"
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
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
