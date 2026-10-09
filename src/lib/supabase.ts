import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 
  import.meta.env?.VITE_SUPABASE_URL || 'https://pirmwzflxvlxvjqlhbhw.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TI9S6FVP-Vq_exOBAlFgyw_C60fz5mC';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- KHO DỮ LIỆU CÁ NHÂN – THẦY TỪ VĂN GỌN (TRƯỜNG TH PHƯỜNG AN XUYÊN)
-- SCRIPT TẠO BẢNG CƠ SỞ DỮ LIỆU SUPABASE
-- Hãy dán toàn bộ đoạn mã này vào Supabase -> SQL Editor rồi bấm RUN
-- ========================================================

-- 1. BẢNG THƯ MỤC (FOLDERS)
CREATE TABLE IF NOT EXISTS public.folders (
    id TEXT PRIMARY KEY,
    code TEXT,
    name TEXT NOT NULL,
    color TEXT,
    description TEXT,
    parent_id TEXT,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 2. BẢNG TÀI LIỆU / TẬP TIN (FILES)
CREATE TABLE IF NOT EXISTS public.files (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    folder_id TEXT REFERENCES public.folders(id) ON DELETE SET NULL,
    folder_name TEXT,
    type TEXT,
    extension TEXT,
    mime_type TEXT,
    size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    owner TEXT,
    description TEXT,
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    deleted_at TIMESTAMPTZ,
    storage_path TEXT,
    content_snippet TEXT,
    raw_content TEXT,
    versions JSONB DEFAULT '[]'::jsonb,
    share JSONB DEFAULT '{"isShared": false, "shareType": "private", "permission": "view", "sharedWithEmails": []}'::jsonb
);

-- 3. BẢNG NHẬT KÝ HOẠT ĐỘNG (ACTIVITY_LOGS)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id TEXT PRIMARY KEY,
    action TEXT NOT NULL,
    detail TEXT,
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    ip_address TEXT,
    icon_type TEXT
);

-- 4. BẢNG HỒ SƠ GIÁO VIÊN (USER_PROFILE)
CREATE TABLE IF NOT EXISTS public.user_profile (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    title TEXT,
    school TEXT,
    district TEXT,
    province TEXT,
    email TEXT,
    avatar_url TEXT,
    phone TEXT,
    storage_plan TEXT,
    storage_limit_gb INTEGER DEFAULT 100,
    two_factor_enabled BOOLEAN DEFAULT true,
    language TEXT DEFAULT 'vi',
    theme TEXT DEFAULT 'light',
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 5. THIẾT LẬP BẢO MẬT ROW LEVEL SECURITY (RLS) CHO PHÉP TRUY CẬP HỢP LỆ
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách (Policies) cho phép đọc/ghi qua Anon Key của ứng dụng Thầy Gọn
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Cho phép truy cập toàn quyền folders" ON public.folders;
    CREATE POLICY "Cho phép truy cập toàn quyền folders" ON public.folders FOR ALL TO anon USING (true) WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Cho phép truy cập toàn quyền files" ON public.files;
    CREATE POLICY "Cho phép truy cập toàn quyền files" ON public.files FOR ALL TO anon USING (true) WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Cho phép truy cập toàn quyền activity_logs" ON public.activity_logs;
    CREATE POLICY "Cho phép truy cập toàn quyền activity_logs" ON public.activity_logs FOR ALL TO anon USING (true) WITH CHECK (true);
    
    DROP POLICY IF EXISTS "Cho phép truy cập toàn quyền user_profile" ON public.user_profile;
    CREATE POLICY "Cho phép truy cập toàn quyền user_profile" ON public.user_profile FOR ALL TO anon USING (true) WITH CHECK (true);
END $$;
`;

export interface SupabaseStatus {
  connected: boolean;
  projectUrl: string;
  hasTables: {
    files: boolean;
    folders: boolean;
    activity_logs: boolean;
    user_profile: boolean;
  };
  details: string;
}

export async function checkSupabaseStatus(): Promise<SupabaseStatus> {
  const status: SupabaseStatus = {
    connected: false,
    projectUrl: SUPABASE_URL,
    hasTables: {
      files: false,
      folders: false,
      activity_logs: false,
      user_profile: false,
    },
    details: 'Đang kiểm tra kết nối...',
  };

  try {
    // 1. Check folders table
    const { error: foldersErr } = await supabase.from('folders').select('id').limit(1);
    status.hasTables.folders = !foldersErr;

    // 2. Check files table
    const { error: filesErr } = await supabase.from('files').select('id').limit(1);
    status.hasTables.files = !filesErr;

    // 3. Check activity_logs table
    const { error: logsErr } = await supabase.from('activity_logs').select('id').limit(1);
    status.hasTables.activity_logs = !logsErr;

    // 4. Check user_profile table
    const { error: userErr } = await supabase.from('user_profile').select('id').limit(1);
    status.hasTables.user_profile = !userErr;

    status.connected = true;

    if (status.hasTables.files && status.hasTables.folders) {
      status.details = 'Đã kết nối thành công và các bảng dữ liệu đã sẵn sàng trên Supabase.';
    } else {
      status.details = 'Đã kết nối với dự án Supabase, nhưng các bảng dữ liệu (tables) chưa được tạo. Hãy chạy mã SQL trong mục Cài đặt.';
    }
  } catch (err: any) {
    status.connected = false;
    status.details = `Không thể kết nối Supabase: ${err?.message || 'Lỗi không xác định'}`;
  }

  return status;
}
