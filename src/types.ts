export type FileType = 'pdf' | 'word' | 'excel' | 'powerpoint' | 'image' | 'video' | 'zip' | 'text' | 'other';

export interface FileVersion {
  id: string;
  versionNumber: number; // e.g. 1, 2, 3, 4
  versionLabel: string; // e.g. "v1", "v2"
  fileName: string;
  sizeBytes: number;
  uploadedAt: string;
  uploadedBy: string;
  notes?: string;
  storagePath: string;
}

export interface ShareConfig {
  isShared: boolean;
  shareType: 'private' | 'restricted' | 'public_link';
  permission: 'view' | 'download' | 'edit';
  sharedWithEmails: string[];
  shareLink?: string;
  expiresAt?: string;
  passwordProtected?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  folderId: string;
  folderName: string;
  type: FileType;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  updatedAt: string;
  owner: string;
  description?: string;
  tags?: string[];
  isFavorite: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  storagePath: string;
  contentSnippet?: string; // Extracted text for search & AI
  rawContent?: string;     // Text or structured content for preview
  versions: FileVersion[];
  share: ShareConfig;
}

export interface FolderItem {
  id: string;
  name: string;
  code: string;
  color?: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean;
  description?: string;
}

export interface StorageStats {
  usedBytes: number;
  totalBytes: number;
  totalFiles: number;
  totalFolders: number;
  typeCounts: {
    pdf: number;
    word: number;
    excel: number;
    powerpoint: number;
    image: number;
    video: number;
    zip: number;
    text: number;
    other: number;
  };
  typeBytes: {
    pdf: number;
    word: number;
    excel: number;
    powerpoint: number;
    image: number;
    video: number;
    zip: number;
    text: number;
    other: number;
  };
}

export interface UserProfile {
  id: string;
  fullName: string;
  title: string;
  school: string;
  district: string;
  province: string;
  email: string;
  avatarUrl: string;
  phone: string;
  storagePlan: string;
  storageLimitGB: number;
  twoFactorEnabled: boolean;
  language: string;
  theme: 'light' | 'dark';
}

export interface ActivityLog {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  ipAddress: string;
  iconType: 'upload' | 'download' | 'delete' | 'share' | 'login';
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: {
    fileId: string;
    fileName: string;
    fileType: FileType;
  }[];
}
