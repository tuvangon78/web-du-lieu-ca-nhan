import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { FolderView } from './components/FolderView';
import { MyDocumentsView } from './components/MyDocumentsView';
import { SearchView } from './components/SearchView';
import { AiAssistantView } from './components/AiAssistantView';
import { StatsView } from './components/StatsView';
import { TrashView } from './components/TrashView';
import { SettingsView } from './components/SettingsView';
import { FilePreviewModal } from './components/FilePreviewModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { ShareModal } from './components/ShareModal';
import { UploadModal } from './components/UploadModal';
import { MobileDevicePreviewModal } from './components/MobileDevicePreviewModal';
import { ConfirmModal } from './components/ConfirmModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { api } from './services/api';
import { FileItem, FolderItem, StorageStats, UserProfile, ActivityLog } from './types';
import { initialFiles, initialFolders, initialUser } from './data/initialData';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);

  // Data state
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [trashFiles, setTrashFiles] = useState<FileItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<StorageStats>({
    usedBytes: 38.6 * 1024 * 1024 * 1024,
    totalBytes: 100 * 1024 * 1024 * 1024,
    totalFiles: 1256,
    totalFolders: 12,
    typeCounts: { pdf: 456, word: 215, excel: 86, powerpoint: 52, image: 320, video: 125, zip: 15, text: 10, other: 15 },
    typeBytes: { pdf: 14.2e9, word: 6.8e9, excel: 2.6e9, powerpoint: 2.1e9, image: 9.8e9, video: 3.9e9, zip: 1.5e9, text: 0.2e9, other: 1.2e9 },
  });

  // Modals state
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<FileItem | null>(null);
  const [selectedFileForVersions, setSelectedFileForVersions] = useState<FileItem | null>(null);
  const [selectedFileForShare, setSelectedFileForShare] = useState<FileItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [uploadTargetFolderId, setUploadTargetFolderId] = useState<string | undefined>(undefined);

  // Toast notification state (replaces window.alert)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  // Confirmation Modal state (replaces window.confirm)
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const closeConfirm = () => {
    setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Fetch data on load
  const loadData = async () => {
    try {
      const [statsRes, filesRes, trashRes, foldersRes, logsRes] = await Promise.all([
        api.getStats().catch(() => null),
        api.getFiles({ isDeleted: false }).catch(() => null),
        api.getFiles({ isDeleted: true }).catch(() => null),
        api.getFolders().catch(() => null),
        api.getActivityLogs().catch(() => []),
      ]);

      if (statsRes) {
        setStats(statsRes.stats);
        if (statsRes.user) setUser(statsRes.user);
      }
      if (Array.isArray(filesRes)) {
        setFiles(filesRes);
      }
      if (Array.isArray(trashRes)) {
        setTrashFiles(trashRes);
      }
      if (Array.isArray(foldersRes)) {
        setFolders(foldersRes);
      }
      if (logsRes) {
        setActivityLogs(logsRes);
      }
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleOpenFile = (file: FileItem) => {
    setSelectedFileForPreview(file);
  };

  const handleOpenFileById = (fileId: string) => {
    const target = files.find((f) => f.id === fileId);
    if (target) {
      setSelectedFileForPreview(target);
    } else {
      showToast('Tài liệu đã được mở hoặc chuyển vị trí.', 'info');
    }
  };

  const handleDownloadFile = (file: FileItem) => {
    window.open(`/api/files/${file.id}/download`, '_blank');
  };

  const handleShareFile = (file: FileItem) => {
    setSelectedFileForShare(file);
  };

  const handleOpenVersions = (file: FileItem) => {
    setSelectedFileForVersions(file);
  };

  const handleToggleFavorite = async (file: FileItem) => {
    try {
      const updated = await api.toggleFavorite(file.id, file.isFavorite);
      setFiles((prev) => prev.map((f) => (f.id === file.id ? updated : f)));
      if (selectedFileForPreview?.id === file.id) {
        setSelectedFileForPreview(updated);
      }
    } catch {
      // optimistic fallback
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, isFavorite: !f.isFavorite } : f))
      );
    }
  };

  const handleMoveToTrash = (file: FileItem) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Chuyển vào thùng rác',
      message: 'Tài liệu sẽ được chuyển vào Thùng rác. Thầy có thể khôi phục lại bất kỳ lúc nào.',
      itemName: file.name,
      confirmLabel: 'Chuyển vào thùng rác',
      cancelLabel: 'Giữ lại',
      isDestructive: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          await api.moveToTrash(file.id);
          setFiles((prev) => prev.filter((f) => f.id !== file.id));
          setTrashFiles((prev) => [{ ...file, isDeleted: true, deletedAt: new Date().toISOString() }, ...prev]);
          await loadData();
          showToast(`Đã chuyển "${file.name}" vào thùng rác thành công.`, 'success');
        } catch (err: any) {
          showToast(err.message || 'Lỗi chuyển thùng rác', 'error');
        }
      },
    });
  };

  const handleRestoreFromTrash = async (file: FileItem) => {
    try {
      const restored = await api.restoreFromTrash(file.id);
      setTrashFiles((prev) => prev.filter((f) => f.id !== file.id));
      setFiles((prev) => [restored, ...prev]);
      await loadData();
      showToast(`Đã khôi phục tài liệu "${file.name}" về thư mục ${file.folderName}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi khôi phục tài liệu', 'error');
    }
  };

  const handleDeletePermanently = (file: FileItem) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Xóa vĩnh viễn tài liệu',
      message: 'CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn tài liệu khỏi hệ thống và không thể khôi phục lại!',
      itemName: file.name,
      confirmLabel: 'Xóa vĩnh viễn',
      cancelLabel: 'Hủy bỏ',
      isDestructive: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          await api.deletePermanently(file.id);
          setTrashFiles((prev) => prev.filter((f) => f.id !== file.id));
          await loadData();
          showToast(`Đã xóa vĩnh viễn tài liệu "${file.name}".`, 'success');
        } catch (err: any) {
          showToast(err.message || 'Lỗi xóa vĩnh viễn', 'error');
        }
      },
    });
  };

  const handleEmptyTrash = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Dọn sạch thùng rác',
      message: 'CẢNH BÁO: Toàn bộ tài liệu trong thùng rác sẽ bị xóa vĩnh viễn. Thầy có chắc chắn muốn làm trống thùng rác?',
      confirmLabel: 'Dọn sạch thùng rác',
      cancelLabel: 'Hủy bỏ',
      isDestructive: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          await api.emptyTrash();
          setTrashFiles([]);
          await loadData();
          showToast('Đã dọn sạch thùng rác thành công.', 'success');
        } catch (err: any) {
          showToast(err.message || 'Lỗi làm trống thùng rác', 'error');
        }
      },
    });
  };

  const handleBatchRestore = (selectedFiles: FileItem[]) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Khôi phục tài liệu đã chọn',
      message: `Thầy có chắc chắn muốn khôi phục ${selectedFiles.length} tài liệu về các thư mục gốc không?`,
      confirmLabel: 'Khôi phục ngay',
      cancelLabel: 'Hủy bỏ',
      isDestructive: false,
      onConfirm: async () => {
        closeConfirm();
        try {
          const ids = selectedFiles.map((f) => f.id);
          await api.batchRestoreFromTrash(ids);
          setTrashFiles((prev) => prev.filter((f) => !ids.includes(f.id)));
          setFiles((prev) => [...selectedFiles.map((f) => ({ ...f, isDeleted: false, deletedAt: undefined })), ...prev]);
          await loadData();
          showToast(`Đã khôi phục thành công ${selectedFiles.length} tài liệu.`, 'success');
        } catch (err: any) {
          showToast(err.message || 'Lỗi khôi phục tài liệu', 'error');
        }
      },
    });
  };

  const handleBatchDeletePermanently = (selectedFiles: FileItem[]) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Xóa vĩnh viễn các tài liệu đã chọn',
      message: `CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn ${selectedFiles.length} tài liệu đã chọn khỏi thùng rác và không thể khôi phục!`,
      itemName: `${selectedFiles.length} tài liệu được chọn`,
      confirmLabel: 'Xóa vĩnh viễn',
      cancelLabel: 'Hủy bỏ',
      isDestructive: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          const ids = selectedFiles.map((f) => f.id);
          await api.batchDeletePermanently(ids);
          setTrashFiles((prev) => prev.filter((f) => !ids.includes(f.id)));
          await loadData();
          showToast(`Đã xóa vĩnh viễn ${selectedFiles.length} tài liệu khỏi thùng rác.`, 'success');
        } catch (err: any) {
          showToast(err.message || 'Lỗi xóa tài liệu', 'error');
        }
      },
    });
  };

  const handleCreateFolder = async (name: string, description?: string, color?: string) => {
    try {
      const newFolder = await api.createFolder(name, description, color);
      setFolders((prev) => [...prev, newFolder]);
      await loadData();
      showToast(`Đã tạo thư mục "${newFolder.name}" thành công.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi tạo thư mục', 'error');
    }
  };

  const handleUpdateFolder = async (id: string, name: string) => {
    try {
      const updated = await api.updateFolder(id, { name });
      setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
      await loadData();
      showToast(`Đã cập nhật thư mục "${updated.name}" thành công.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Lỗi cập nhật thư mục', 'error');
    }
  };

  const handleDeleteFolder = (id: string) => {
    const targetFolder = folders.find((f) => f.id === id);
    setConfirmConfig({
      isOpen: true,
      title: 'Xóa thư mục',
      message: 'Các tài liệu bên trong thư mục này sẽ được tự động chuyển sang thư mục an toàn.',
      itemName: targetFolder?.name,
      confirmLabel: 'Xóa thư mục',
      cancelLabel: 'Hủy bỏ',
      isDestructive: true,
      onConfirm: async () => {
        closeConfirm();
        try {
          await api.deleteFolder(id);
          setFolders((prev) => prev.filter((f) => f.id !== id));
          await loadData();
          showToast(`Đã xóa thư mục "${targetFolder?.name || ''}".`, 'success');
        } catch (err: any) {
          showToast(err.message || 'Lỗi xóa thư mục', 'error');
        }
      },
    });
  };

  const handleUploadSuccess = (newUploaded: FileItem[]) => {
    setFiles((prev) => [...newUploaded, ...prev]);
    loadData();
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setCurrentView('search');
  };

  // Render view router
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardView
            stats={stats}
            recentFiles={files.filter((f) => !f.isDeleted)}
            onOpenFile={handleOpenFile}
            onDownloadFile={handleDownloadFile}
            onShareFile={handleShareFile}
            onToggleFavorite={handleToggleFavorite}
            onNavigate={(v) => setCurrentView(v)}
            onOpenUpload={() => {
              setUploadTargetFolderId(undefined);
              setIsUploadOpen(true);
            }}
          />
        );

      case 'folders':
        return (
          <FolderView
            folders={folders}
            files={files}
            onSelectFolder={(f) => {
              setCurrentFolderId(f.id);
              setCurrentView('my-documents');
            }}
            onCreateFolder={handleCreateFolder}
            onUpdateFolder={handleUpdateFolder}
            onDeleteFolder={handleDeleteFolder}
            onOpenUpload={(folderId) => {
              setUploadTargetFolderId(folderId);
              setIsUploadOpen(true);
            }}
          />
        );

      case 'my-documents':
        return (
          <MyDocumentsView
            files={files}
            folders={folders}
            currentFolderId={currentFolderId}
            onSelectFolder={(f) => setCurrentFolderId(f ? f.id : undefined)}
            onOpenFile={handleOpenFile}
            onDownloadFile={handleDownloadFile}
            onShareFile={handleShareFile}
            onOpenVersions={handleOpenVersions}
            onToggleFavorite={handleToggleFavorite}
            onMoveToTrash={handleMoveToTrash}
            onOpenUpload={(folderId) => {
              setUploadTargetFolderId(folderId || currentFolderId);
              setIsUploadOpen(true);
            }}
          />
        );

      case 'shares':
        return (
          <MyDocumentsView
            files={files.filter((f) => f.share?.isShared)}
            folders={folders}
            onSelectFolder={() => {}}
            onOpenFile={handleOpenFile}
            onDownloadFile={handleDownloadFile}
            onShareFile={handleShareFile}
            onOpenVersions={handleOpenVersions}
            onToggleFavorite={handleToggleFavorite}
            onMoveToTrash={handleMoveToTrash}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        );

      case 'favorites':
        return (
          <MyDocumentsView
            files={files.filter((f) => f.isFavorite && !f.isDeleted)}
            folders={folders}
            onSelectFolder={() => {}}
            onOpenFile={handleOpenFile}
            onDownloadFile={handleDownloadFile}
            onShareFile={handleShareFile}
            onOpenVersions={handleOpenVersions}
            onToggleFavorite={handleToggleFavorite}
            onMoveToTrash={handleMoveToTrash}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        );

      case 'search':
        return (
          <SearchView
            files={files}
            initialQuery={searchQuery}
            onOpenFile={handleOpenFile}
            onDownloadFile={handleDownloadFile}
            onShareFile={handleShareFile}
          />
        );

      case 'ai-assistant':
        return (
          <AiAssistantView
            onOpenFileById={handleOpenFileById}
            files={files}
          />
        );

      case 'stats':
        return (
          <StatsView
            stats={stats}
            folders={folders}
            files={files}
            onNavigate={(v) => setCurrentView(v)}
          />
        );

      case 'trash':
        return (
          <TrashView
            trashFiles={trashFiles}
            onRestore={handleRestoreFromTrash}
            onDeletePermanently={handleDeletePermanently}
            onBatchRestore={handleBatchRestore}
            onBatchDeletePermanently={handleBatchDeletePermanently}
            onEmptyTrash={handleEmptyTrash}
          />
        );

      case 'settings':
        return (
          <SettingsView
            user={user}
            activityLogs={activityLogs}
            onUpdateUser={async (updates) => {
              const updated = await api.updateUser(updates);
              setUser(updated);
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FC] text-slate-800">
      {/* 1. Header (Matching reference top bar & details) */}
      <Header
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onNavigate={setCurrentView}
        onOpenMobilePreview={() => setIsMobilePreviewOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* 2. Main Workspace Layout: Sidebar + Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'my-documents') setCurrentFolderId(undefined);
            setCurrentView(view);
          }}
          stats={stats}
          onOpenUpload={() => {
            setUploadTargetFolderId(currentFolderId);
            setIsUploadOpen(true);
          }}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          trashCount={trashFiles.length}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* 3. Global Interactive Modals */}

      {/* Screen 4: Xem chi tiết tài liệu Modal */}
      <FilePreviewModal
        file={selectedFileForPreview}
        onClose={() => setSelectedFileForPreview(null)}
        onDownload={handleDownloadFile}
        onShare={handleShareFile}
        onOpenVersions={handleOpenVersions}
        onToggleFavorite={handleToggleFavorite}
        onDelete={handleMoveToTrash}
      />

      {/* Screen 5: Quản lý phiên bản Modal */}
      <VersionHistoryModal
        file={selectedFileForVersions}
        isOpen={Boolean(selectedFileForVersions)}
        onClose={() => setSelectedFileForVersions(null)}
        onVersionUploaded={(updated) => {
          setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
          setSelectedFileForVersions(updated);
          loadData();
        }}
        onDownloadFile={handleDownloadFile}
      />

      {/* Screen 8: Chia sẻ tài liệu Modal */}
      <ShareModal
        file={selectedFileForShare}
        isOpen={Boolean(selectedFileForShare)}
        onClose={() => setSelectedFileForShare(null)}
        onShareUpdated={(updated) => {
          setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
          setSelectedFileForShare(updated);
        }}
      />

      {/* Screen 3: Tải lên tài liệu Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        folders={folders}
        defaultFolderId={uploadTargetFolderId}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* Screen 12: Xem trên điện thoại Modal */}
      <MobileDevicePreviewModal
        isOpen={isMobilePreviewOpen}
        onClose={() => setIsMobilePreviewOpen(false)}
        user={user}
        stats={stats}
        files={files.filter((f) => !f.isDeleted)}
        folders={folders}
        onOpenFile={handleOpenFile}
        onOpenUpload={() => {
          setIsMobilePreviewOpen(false);
          setIsUploadOpen(true);
        }}
      />

      {/* Confirmation Modal (Iframe-safe custom dialog) */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        itemName={confirmConfig.itemName}
        confirmLabel={confirmConfig.confirmLabel}
        cancelLabel={confirmConfig.cancelLabel}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={confirmConfig.onConfirm}
        onCancel={closeConfirm}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 ${
            toast.type === 'success'
              ? 'bg-slate-900 text-white border-slate-800'
              : toast.type === 'error'
              ? 'bg-red-600 text-white border-red-500'
              : 'bg-blue-600 text-white border-blue-500'
          }`}>
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-200" />
              ) : (
                <Info className="w-5 h-5 text-blue-200" />
              )}
            </div>
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-white/60 hover:text-white transition p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
