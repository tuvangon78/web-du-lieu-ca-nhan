import { FileItem, FolderItem, StorageStats, UserProfile, ActivityLog, FileType, UserAccount, RegisterPayload, LoginPayload } from '../types';

export const api = {
  // Fetch stats and user
  async getStats(): Promise<{ stats: StorageStats; user: UserProfile }> {
    const res = await fetch('/api/stats');
    if (!res.ok) throw new Error('Không thể lấy thống kê');
    const data = await res.json();
    return { stats: data.stats, user: data.user };
  },

  // Fetch files
  async getFiles(params?: {
    folderId?: string;
    isFavorite?: boolean;
    type?: string;
    isDeleted?: boolean;
    search?: string;
  }): Promise<FileItem[]> {
    const url = new URL('/api/files', window.location.origin);
    if (params) {
      if (params.folderId) url.searchParams.append('folderId', params.folderId);
      if (params.isFavorite) url.searchParams.append('isFavorite', 'true');
      if (params.type) url.searchParams.append('type', params.type);
      if (params.isDeleted) url.searchParams.append('isDeleted', 'true');
      if (params.search) url.searchParams.append('search', params.search);
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Không thể tải danh sách tài liệu');
    const data = await res.json();
    return data.files;
  },

  // Get file by ID
  async getFile(id: string): Promise<FileItem> {
    const res = await fetch(`/api/files/${id}`);
    if (!res.ok) throw new Error('Tài liệu không tồn tại');
    const data = await res.json();
    return data.file;
  },

  // Upload files
  async uploadFiles(files: File[], folderId: string, onProgress?: (percent: number) => void): Promise<FileItem[]> {
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));
    formData.append('folderId', folderId);

    // Using XMLHttpRequest for upload progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/files/upload');

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.files);
          } catch (err) {
            reject(new Error('Lỗi phân tích phản hồi'));
          }
        } else {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.message || `Tải lên thất bại: ${xhr.statusText}`));
          } catch {
            reject(new Error(`Tải lên thất bại: ${xhr.statusText} (${xhr.status})`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Mất kết nối mạng khi tải tệp'));
      xhr.send(formData);
    });
  },

  // Upload single file with automatic chunking (6MB chunks) to seamlessly support files > 30MB through Cloud Run proxies
  async uploadSingleFile(
    file: File,
    folderId: string,
    onProgress?: (percent: number) => void
  ): Promise<FileItem> {
    const CHUNK_SIZE = 6 * 1024 * 1024; // 6 MB safe chunk size
    if (file.size <= CHUNK_SIZE) {
      const res = await this.uploadFiles([file], folderId, onProgress);
      return res[0];
    }

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = 'chunk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    let finalFileItem: FileItem | null = null;

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunkBlob = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunkBlob, file.name);
      formData.append('uploadId', uploadId);
      formData.append('chunkIndex', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileName', file.name);
      formData.append('folderId', folderId);
      formData.append('totalSizeBytes', file.size.toString());

      let attempts = 0;
      let success = false;
      let lastErrMessage = '';

      while (!success && attempts < 3) {
        attempts++;
        try {
          const res = await fetch('/api/files/upload/chunk', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) {
            const errJson = await res.json().catch(() => ({}));
            throw new Error(errJson.message || `Lỗi tải phân đoạn ${chunkIndex + 1}/${totalChunks} (HTTP ${res.status})`);
          }

          const data = await res.json();
          if (data.completed && data.file) {
            finalFileItem = data.file;
          }
          success = true;
        } catch (err: any) {
          lastErrMessage = err?.message || 'Lỗi mạng khi tải phân đoạn';
          if (attempts >= 3) {
            throw new Error(lastErrMessage);
          }
          await new Promise((r) => setTimeout(r, 800));
        }
      }

      if (onProgress) {
        const percent = Math.min(99, Math.round(((chunkIndex + 1) / totalChunks) * 100));
        onProgress(percent);
      }
    }

    if (!finalFileItem) {
      throw new Error('Không thể hoàn tất ghép nối tệp sau khi tải lên');
    }

    if (onProgress) onProgress(100);
    return finalFileItem;
  },

  // Upload new version for a file
  async uploadNewVersion(fileId: string, file: File, notes: string): Promise<FileItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('notes', notes);

    const res = await fetch(`/api/files/${fileId}/versions`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Không thể tải lên phiên bản mới');
    const data = await res.json();
    return data.file;
  },

  // Update file metadata
  async updateFile(id: string, updates: Partial<FileItem>): Promise<FileItem> {
    const res = await fetch(`/api/files/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Không thể cập nhật tệp');
    const data = await res.json();
    return data.file;
  },

  // Toggle favorite
  async toggleFavorite(id: string, currentState: boolean): Promise<FileItem> {
    return this.updateFile(id, { isFavorite: !currentState });
  },

  // Move to trash
  async moveToTrash(id: string): Promise<FileItem> {
    const res = await fetch(`/api/files/${id}/trash`, { method: 'POST' });
    if (!res.ok) throw new Error('Không thể chuyển vào thùng rác');
    const data = await res.json();
    return data.file;
  },

  // Restore from trash
  async restoreFromTrash(id: string): Promise<FileItem> {
    const res = await fetch(`/api/files/${id}/restore`, { method: 'POST' });
    if (!res.ok) throw new Error('Không thể khôi phục tài liệu');
    const data = await res.json();
    return data.file;
  },

  // Permanent delete
  async deletePermanently(id: string): Promise<void> {
    const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Không thể xóa vĩnh viễn tài liệu');
  },

  // Batch permanent delete
  async batchDeletePermanently(ids: string[]): Promise<number> {
    const res = await fetch('/api/files/trash/batch-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Không thể xóa các tài liệu đã chọn');
    const data = await res.json();
    return data.count;
  },

  // Batch restore from trash
  async batchRestoreFromTrash(ids: string[]): Promise<number> {
    const res = await fetch('/api/files/trash/batch-restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) throw new Error('Không thể khôi phục các tài liệu đã chọn');
    const data = await res.json();
    return data.count;
  },

  // Empty trash
  async emptyTrash(): Promise<number> {
    const res = await fetch('/api/files/trash/empty', { method: 'POST' });
    if (!res.ok) throw new Error('Không thể làm trống thùng rác');
    const data = await res.json();
    return data.count;
  },

  // Share file
  async shareFile(id: string, config: {
    shareType: string;
    permission: string;
    sharedWithEmails?: string[];
    expiresDays?: number;
    passwordProtected?: boolean;
  }): Promise<FileItem> {
    const res = await fetch(`/api/files/${id}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Không thể cập nhật quyền chia sẻ');
    const data = await res.json();
    return data.file;
  },

  // Get folders
  async getFolders(): Promise<FolderItem[]> {
    const res = await fetch('/api/folders');
    if (!res.ok) throw new Error('Không thể tải thư mục');
    const data = await res.json();
    return data.folders;
  },

  // Create folder
  async createFolder(name: string, description?: string, color?: string): Promise<FolderItem> {
    const res = await fetch('/api/folders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, color }),
    });
    if (!res.ok) throw new Error('Không thể tạo thư mục');
    const data = await res.json();
    return data.folder;
  },

  // Update folder
  async updateFolder(id: string, updates: Partial<FolderItem>): Promise<FolderItem> {
    const res = await fetch(`/api/folders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Không thể cập nhật thư mục');
    const data = await res.json();
    return data.folder;
  },

  // Delete folder
  async deleteFolder(id: string): Promise<void> {
    const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Không thể xóa thư mục');
  },

  // Get activity logs
  async getActivityLogs(): Promise<ActivityLog[]> {
    const res = await fetch('/api/activity-logs');
    if (!res.ok) throw new Error('Không thể tải lịch sử hoạt động');
    const data = await res.json();
    return data.logs;
  },

  // AI Chat
  async aiChat(prompt: string): Promise<{
    reply: string;
    citations?: { fileId: string; fileName: string; fileType: FileType }[];
  }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) throw new Error('Trợ lý AI gặp sự cố phản hồi');
    const data = await res.json();
    return { reply: data.reply, citations: data.citations };
  },

  // Update User Profile
  async updateUser(updates: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Không thể cập nhật thông tin cá nhân');
    const data = await res.json();
    return data.user;
  },

  // Upload or update website profile avatar
  async updateAvatar(fileOrUrl: File | string): Promise<{ success: boolean; avatarUrl: string; user: UserProfile; message?: string }> {
    if (typeof fileOrUrl === 'string') {
      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: fileOrUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Không thể cập nhật ảnh đại diện');
      }
      return data;
    } else {
      const formData = new FormData();
      formData.append('avatar', fileOrUrl);
      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Không thể tải ảnh đại diện lên');
      }
      return data;
    }
  },

  // Auth: Register new account
  async register(payload: RegisterPayload): Promise<{ success: boolean; message: string; user: UserProfile }> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Đăng ký tài khoản không thành công');
    }
    return data;
  },

  // Auth: Login with username & password
  async login(payload: LoginPayload): Promise<{ success: boolean; message: string; user: UserProfile }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Đăng nhập không thành công');
    }
    return data;
  },

  // Auth: Get registered accounts
  async getAccounts(): Promise<UserAccount[]> {
    const res = await fetch('/api/auth/accounts');
    if (!res.ok) throw new Error('Không thể lấy danh sách tài khoản');
    const data = await res.json();
    return data.accounts || [];
  },

  // Auth: Switch account
  async switchAccount(params: { username?: string; accountId?: string }): Promise<{ success: boolean; message: string; user: UserProfile }> {
    const res = await fetch('/api/auth/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Không thể chuyển đổi tài khoản');
    }
    return data;
  },

  // Auth: Logout
  async logout(): Promise<void> {
    await fetch('/api/auth/logout', { method: 'POST' });
  },

  // Get Supabase Status
  async getSupabaseStatus(): Promise<{
    connected: boolean;
    projectUrl: string;
    hasTables: {
      files: boolean;
      folders: boolean;
      activity_logs: boolean;
      user_profile: boolean;
    };
    details: string;
    sqlScript?: string;
  }> {
    const res = await fetch('/api/supabase/status');
    if (!res.ok) throw new Error('Không thể kiểm tra kết nối Supabase');
    return res.json();
  },

  // Sync / Seed data to Supabase
  async syncToSupabase(): Promise<{
    success: boolean;
    message: string;
    counts?: { folders: number; files: number };
  }> {
    const res = await fetch('/api/supabase/sync', { method: 'POST' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Không thể đồng bộ dữ liệu lên Supabase');
    }
    return res.json();
  },
};

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const d = new Date(dateString);
    const date = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    const time = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    return `${date} ${time}`;
  } catch {
    return dateString;
  }
}
