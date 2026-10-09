import React, { useState } from 'react';
import {
  Folder,
  FolderPlus,
  Upload,
  Search,
  MoreVertical,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  ChevronRight,
  HardDrive,
  FileText
} from 'lucide-react';
import { FolderItem, FileItem } from '../types';
import { formatBytes, formatDate } from '../services/api';

interface FolderViewProps {
  folders: FolderItem[];
  files: FileItem[];
  onSelectFolder: (folder: FolderItem) => void;
  onCreateFolder: (name: string, description?: string, color?: string) => void;
  onUpdateFolder: (id: string, name: string) => void;
  onDeleteFolder: (id: string) => void;
  onOpenUpload: (folderId?: string) => void;
}

export const FolderView: React.FC<FolderViewProps> = ({
  folders,
  files,
  onSelectFolder,
  onCreateFolder,
  onUpdateFolder,
  onDeleteFolder,
  onOpenUpload,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // Calculate file counts and size per folder
  const folderStats = folders.map((f) => {
    const folderFiles = files.filter((file) => file.folderId === f.id && !file.isDeleted);
    const totalBytes = folderFiles.reduce((acc, curr) => acc + curr.sizeBytes, 0);
    return {
      ...f,
      fileCount: folderFiles.length,
      totalBytes,
    };
  });

  const filteredFolders = folderStats.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    onCreateFolder(newFolderName.trim(), newFolderDesc.trim());
    setNewFolderName('');
    setNewFolderDesc('');
    setShowCreateModal(false);
  };

  const handleEditSubmit = (id: string) => {
    if (!editingName.trim()) return;
    onUpdateFolder(id, editingName.trim());
    setEditingFolderId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              2
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Quản lý thư mục
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Hệ thống thư mục giáo án và dữ liệu giảng dạy của Thầy Từ Văn Gọn
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0866E8] text-white hover:bg-blue-700 font-semibold text-xs shadow-md transition"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Tạo thư mục</span>
          </button>
          <button
            onClick={() => onOpenUpload()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold text-xs shadow-md transition"
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

      {/* Search Input for Folders */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm kiếm thư mục theo tên hoặc mô tả..."
          className="w-full bg-white text-slate-800 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Content: List Mode (as in Screen 2) */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl shadow-xs border border-blue-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-semibold border-b border-slate-100 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-12 text-center">STT</th>
                  <th className="py-3.5 px-4">Tên thư mục</th>
                  <th className="py-3.5 px-4">Số tệp</th>
                  <th className="py-3.5 px-4">Dung lượng</th>
                  <th className="py-3.5 px-4">Ngày sửa đổi</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredFolders.map((folder, index) => {
                  const isEditing = editingFolderId === folder.id;
                  return (
                    <tr
                      key={folder.id}
                      className="hover:bg-blue-50/40 transition group"
                    >
                      {/* STT */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400 text-xs">
                        {index + 1}
                      </td>

                      {/* Folder Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            onClick={() => onSelectFolder(folder)}
                            className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition transform group-hover:scale-105"
                            style={{ backgroundColor: `${folder.color || '#0866E8'}15`, color: folder.color || '#0866E8' }}
                          >
                            <Folder className="w-5 h-5 fill-current" />
                          </div>

                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  className="px-2 py-1 border border-blue-400 rounded-lg text-xs font-semibold focus:outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleEditSubmit(folder.id)}
                                  className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-semibold"
                                >
                                  Lưu
                                </button>
                                <button
                                  onClick={() => setEditingFolderId(null)}
                                  className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs"
                                >
                                  Hủy
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => onSelectFolder(folder)}
                                className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer text-sm truncate"
                              >
                                {folder.name}
                              </div>
                            )}
                            {folder.description && (
                              <div className="text-[11px] text-slate-400 truncate max-w-md">
                                {folder.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* File Count */}
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        {folder.fileCount} tệp
                      </td>

                      {/* Size */}
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        {formatBytes(folder.totalBytes)}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {formatDate(folder.updatedAt)}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                          <button
                            onClick={() => onSelectFolder(folder)}
                            className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition"
                            title="Mở thư mục"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingFolderId(folder.id);
                              setEditingName(folder.name);
                            }}
                            className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 transition"
                            title="Đổi tên"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteFolder(folder.id)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition"
                            title="Xóa thư mục"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFolders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white p-4 rounded-2xl shadow-xs border border-blue-100 hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
              onClick={() => onSelectFolder(folder)}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition group-hover:scale-105"
                  style={{ backgroundColor: `${folder.color || '#0866E8'}18`, color: folder.color || '#0866E8' }}
                >
                  <Folder className="w-6 h-6 fill-current" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">
                    {folder.fileCount} tệp
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {formatBytes(folder.totalBytes)}
                  </span>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 group-hover:text-blue-600 text-sm truncate">
                {folder.name}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[32px]">
                {folder.description || 'Không có mô tả'}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Cập nhật: {formatDate(folder.updatedAt)}</span>
                <ChevronRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-blue-600" />
              Tạo thư mục mới
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Nhập tên thư mục mới để phân loại tài liệu cho Thầy Gọn
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên thư mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ví dụ: ĐỀ KIỂM TRA HỌC KỲ I"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mô tả ngắn
                </label>
                <textarea
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  placeholder="Ghi chú nội dung chính của thư mục..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm disabled:opacity-50"
                >
                  Tạo thư mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
