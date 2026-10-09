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

  // Fetch data on load
  const loadData = async () => {
    try {
      const [statsRes, filesRes, foldersRes, logsRes] = await Promise.all([
        api.getStats().catch(() => null),
        api.getFiles({ isDeleted: false }).catch(() => null),
        api.getFolders().catch(() => null),
        api.getActivityLogs().catch(() => []),
      ]);

      if (statsRes) {
        setStats(statsRes.stats);
        if (statsRes.user) setUser(statsRes.user);
      }
      if (filesRes && filesRes.length > 0) {
        setFiles(filesRes);
      }
      if (foldersRes && foldersRes.length > 0) {
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
      alert('Tài liệu đã được mở hoặc chuyển vị trí.');
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

  const handleMoveToTrash = async (file: FileItem) => {
    if (confirm(`Thầy có chắc chắn muốn chuyển "${file.name}" vào thùng rác không?`)) {
      try {
        await api.moveToTrash(file.id);
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
        loadData();
      } catch (err: any) {
        alert(err.message || 'Lỗi chuyển thùng rác');
      }
    }
  };

  const handleRestoreFromTrash = async (file: FileItem) => {
    try {
      const restored = await api.restoreFromTrash(file.id);
      setFiles((prev) => [...prev, restored]);
      loadData();
      alert(`Đã khôi phục tài liệu "${file.name}" về thư mục ${file.folderName}`);
    } catch (err: any) {
      alert(err.message || 'Lỗi khôi phục');
    }
  };

  const handleDeletePermanently = async (file: FileItem) => {
    if (confirm(`CẢNH BÁO: Thao tác này sẽ xóa vĩnh viễn tệp "${file.name}". Không thể khôi phục!`)) {
      try {
        await api.deletePermanently(file.id);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Lỗi xóa vĩnh viễn');
      }
    }
  };

  const handleEmptyTrash = async () => {
    if (confirm('Thầy có chắc chắn muốn dọn sạch toàn bộ thùng rác không?')) {
      try {
        await api.emptyTrash();
        loadData();
        alert('Đã dọn sạch thùng rác thành công.');
      } catch (err: any) {
        alert(err.message || 'Lỗi làm trống thùng rác');
      }
    }
  };

  const handleCreateFolder = async (name: string, description?: string, color?: string) => {
    try {
      const newFolder = await api.createFolder(name, description, color);
      setFolders((prev) => [...prev, newFolder]);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi tạo thư mục');
    }
  };

  const handleUpdateFolder = async (id: string, name: string) => {
    try {
      const updated = await api.updateFolder(id, { name });
      setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
      loadData();
    } catch (err: any) {
      alert(err.message || 'Lỗi cập nhật thư mục');
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (confirm('Xóa thư mục này? Các tài liệu bên trong sẽ được tự động chuyển sang thư mục an toàn.')) {
      try {
        await api.deleteFolder(id);
        setFolders((prev) => prev.filter((f) => f.id !== id));
        loadData();
      } catch (err: any) {
        alert(err.message || 'Lỗi xóa thư mục');
      }
    }
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

      case 'trash': {
        const trashItems = files.filter((f) => f.isDeleted);
        return (
          <TrashView
            trashFiles={trashItems}
            onRestore={handleRestoreFromTrash}
            onDeletePermanently={handleDeletePermanently}
            onEmptyTrash={handleEmptyTrash}
          />
        );
      }

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
    </div>
  );
}
