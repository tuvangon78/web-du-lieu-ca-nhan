import { FolderItem, FileItem, UserProfile, ActivityLog } from '../types';

export const initialUser: UserProfile = {
  id: 'user-tuvangon',
  fullName: 'Từ Văn Gọn',
  title: 'Giáo viên tiểu học',
  school: 'Trường Tiểu học Phường An Xuyên',
  district: 'Thành phố Cà Mau',
  province: 'Tỉnh Cà Mau',
  email: 'tuvangon@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=256',
  phone: '0918 234 567',
  storagePlan: 'Gói Giáo Viên Đám Mây VIP',
  storageLimitGB: 100,
  twoFactorEnabled: true,
  language: 'vi',
  theme: 'light',
};

export const initialFolders: FolderItem[] = [
  {
    id: 'f-01',
    code: '01',
    name: '01. GIÁO DỤC',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-28T14:30:00Z',
    description: 'Chủ trương, thông tư, quyết định của Bộ GD&ĐT và Sở GD&ĐT Cà Mau',
    color: '#0866E8'
  },
  {
    id: 'f-02',
    code: '02',
    name: '02. LỚP 1C',
    createdAt: '2026-09-02T09:15:00Z',
    updatedAt: '2026-09-27T16:20:00Z',
    description: 'Hồ sơ chủ nhiệm lớp 1C, danh sách học sinh, ban đại diện phụ huynh',
    color: '#16B875'
  },
  {
    id: 'f-03',
    code: '03',
    name: '03. AI',
    createdAt: '2026-09-03T10:00:00Z',
    updatedAt: '2026-09-26T11:45:00Z',
    description: 'Tài liệu nghiên cứu và ứng dụng Trí tuệ Nhân tạo trong dạy học tiểu học',
    color: '#8257E5'
  },
  {
    id: 'f-04',
    code: '04',
    name: '04. HÌNH ẢNH',
    createdAt: '2026-09-04T07:30:00Z',
    updatedAt: '2026-09-25T17:10:00Z',
    description: 'Hình ảnh hoạt động trải nghiệm, hội thi, sinh hoạt chuyên môn',
    color: '#FF9F1C'
  },
  {
    id: 'f-05',
    code: '05',
    name: '05. VIDEO',
    createdAt: '2026-09-05T08:45:00Z',
    updatedAt: '2026-09-24T15:00:00Z',
    description: 'Video tiết dạy mẫu, bài giảng minh họa, tư liệu dạy học',
    color: '#F04444'
  },
  {
    id: 'f-06',
    code: '06',
    name: '06. WORD',
    createdAt: '2026-09-06T13:00:00Z',
    updatedAt: '2026-09-23T09:30:00Z',
    description: 'Tất cả giáo án, biên bản, kế hoạch dạy học định dạng Word (.docx)',
    color: '#0866E8'
  },
  {
    id: 'f-07',
    code: '07',
    name: '07. EXCEL',
    createdAt: '2026-09-07T14:15:00Z',
    updatedAt: '2026-09-22T10:20:00Z',
    description: 'Bảng theo dõi điểm số, đánh giá học sinh, thống kê chuyên cần',
    color: '#16B875'
  },
  {
    id: 'f-08',
    code: '08',
    name: '08. PDF',
    createdAt: '2026-09-08T08:20:00Z',
    updatedAt: '2026-09-21T16:50:00Z',
    description: 'Văn bản quy phạm pháp luật, tài liệu tập huấn đã chuẩn hóa định dạng PDF',
    color: '#F04444'
  },
  {
    id: 'f-09',
    code: '09',
    name: '09. CÁ NHÂN',
    createdAt: '2026-09-09T10:30:00Z',
    updatedAt: '2026-09-20T11:10:00Z',
    description: 'Hồ sơ lý lịch, văn bằng chứng chỉ, giải thưởng thi đua cá nhân Thầy Gọn',
    color: '#8257E5'
  },
  {
    id: 'f-10',
    code: '10',
    name: '10. POWERPOINT',
    createdAt: '2026-09-10T11:00:00Z',
    updatedAt: '2026-09-19T14:00:00Z',
    description: 'Bài giảng trình chiếu điện tử tương tác các môn học',
    color: '#FF9F1C'
  },
  {
    id: 'f-11',
    code: '11',
    name: '11. GIÁO ÁN',
    createdAt: '2026-09-11T13:40:00Z',
    updatedAt: '2026-09-28T09:00:00Z',
    description: 'Kế hoạch bài dạy (Giáo án) môn Toán, Tiếng Việt, Đạo đức, Tự nhiên Xã hội',
    color: '#0866E8'
  },
  {
    id: 'f-12',
    code: '12',
    name: '12. TÀI LIỆU KHÁC',
    createdAt: '2026-09-12T15:00:00Z',
    updatedAt: '2026-09-18T16:30:00Z',
    description: 'Phần mềm tiện ích, font chữ tiểu học, tài liệu tham khảo phong phú',
    color: '#64748B'
  }
];

export const initialFiles: FileItem[] = [
  {
    id: 'file-01',
    name: 'Giáo án Toán lớp 1 - Tuần 5.docx',
    folderId: 'f-11',
    folderName: '11. GIÁO ÁN',
    type: 'word',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: 2516582, // 2.4 MB
    createdAt: '2026-09-28T08:15:00Z',
    updatedAt: '2026-09-28T14:30:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Kế hoạch bài dạy môn Toán lớp 1: Phép cộng trong phạm vi 10 (tiết 1, 2, 3), các số 6, 7, 8, 9, 10. Đạt chuẩn chương trình GDPT 2018.',
    tags: ['Toán 1', 'Giáo án', 'Tuần 5', 'Phép cộng phạm vi 10'],
    isFavorite: true,
    isDeleted: false,
    storagePath: '/uploads/giao_an_toan_1_tuan_5.docx',
    contentSnippet: `BỘ GIÁO DỤC VÀ ĐÀO TẠO - TRƯỜNG TIỂU HỌC PHƯỜNG AN XUYÊN - TP CÀ MAU\nKẾ HOẠCH BÀI DẠY (GIÁO ÁN) LỚP 1C\nMôn: Toán - Tuần 5 - Tiết 19, 20\nBài học: Phép cộng trong phạm vi 10 (tiết 1)\nGiáo viên thực hiện: Thầy Từ Văn Gọn\n\nI. YÊU CẦU CẦN ĐẠT:\n1. Năng lực toán học:\n- Nhận biết được ý nghĩa của phép cộng thông qua các thao tác "gộp lại" trên đồ vật trực quan.\n- Thực hiện đúng các phép tính cộng trong phạm vi 10: 2+3=5, 4+2=6, 5+5=10...\n- Vận dụng vào giải các bài toán thực tế đơn giản.\n2. Phẩm chất: Chăm chỉ, tích cực hợp tác nhóm, tự tin trình bày kết quả.\n\nII. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:\n- Giáo viên: Bộ que tính, hình ảnh que kem, quả táo trên màn chiếu điện tử.\n- Học sinh: Bảng con, que tính, bộ đồ dùng học Toán 1.`,
    rawContent: `KẾ HOẠCH BÀI DẠY (GIÁO ÁN)\nTRƯỜNG TIỂU HỌC PHƯỜNG AN XUYÊN - TP CÀ MAU\nGiáo viên: Từ Văn Gọn\nLớp: 1C\n\nTUẦN 5 - BÀI HỌC: PHÉP CỘNG TRONG PHẠM VI 10\n\n1. KHỞI ĐỘNG (5 phút):\n- Trò chơi "Truyền điện" đếm số từ 1 đến 10.\n- Giáo viên tạo hứng thú cho học sinh lớp 1C bằng bài hát "Tập đếm".\n\n2. HÌNH THÀNH KIẾN THỨC MỚI (15 phút):\n- Hoạt động 1: Thao tác trên đồ vật thật.\nThầy Gọn cầm 3 que tính tay trái, 2 que tính tay phải. Gộp lại có tất cả 5 que tính.\nTa viết: 3 + 2 = 5 (Đọc là: Ba cộng hai bằng năm).\n- Hoạt động 2: Sử dụng sơ đồ tranh minh họa trên màn chiếu.\n3 chú chim đang đậu trên cành, 1 chú chim bay tới: 3 + 1 = 4.\n\n3. THỰC HÀNH VẬN DỤNG (12 phút):\n- Bài tập 1: Điền số thích hợp vào ô trống.\n- Bài tập 2: Quan sát tranh và viết phép tính tương ứng.\n\n4. CỦNG CỐ - DẶN DÒ (3 phút):\n- Khen ngợi học sinh lớp 1C học tập sôi nổi.\n- Về nhà tìm 3 tình huống phép cộng quanh gia đình.`,
    versions: [
      {
        id: 'ver-01-4',
        versionNumber: 4,
        versionLabel: 'v4',
        fileName: 'Giáo án Toán lớp 1 - Tuần 5.docx',
        sizeBytes: 2516582,
        uploadedAt: '2026-09-28T14:30:00Z',
        uploadedBy: 'Từ Văn Gọn',
        notes: 'Bổ sung các câu hỏi phân hóa cho học sinh còn lúng túng phép cộng',
        storagePath: '/uploads/giao_an_toan_1_tuan_5_v4.docx'
      },
      {
        id: 'ver-01-3',
        versionNumber: 3,
        versionLabel: 'v3',
        fileName: 'Giáo án Toán lớp 1 - Tuần 5 (bản sửa tiết 2).docx',
        sizeBytes: 2202009,
        uploadedAt: '2026-09-25T10:15:00Z',
        uploadedBy: 'Từ Văn Gọn',
        notes: 'Điều chỉnh thời gian hoạt động thực hành nhóm',
        storagePath: '/uploads/giao_an_toan_1_tuan_5_v3.docx'
      },
      {
        id: 'ver-01-2',
        versionNumber: 2,
        versionLabel: 'v2',
        fileName: 'Giáo án Toán lớp 1 - Tuần 5 (dự thảo 2).docx',
        sizeBytes: 1887436,
        uploadedAt: '2026-09-20T16:00:00Z',
        uploadedBy: 'Từ Văn Gọn',
        notes: 'Thêm hoạt động trò chơi khởi động',
        storagePath: '/uploads/giao_an_toan_1_tuan_5_v2.docx'
      },
      {
        id: 'ver-01-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Giáo án Toán lớp 1 - Tuần 5 (khởi tạo).docx',
        sizeBytes: 1677721,
        uploadedAt: '2026-09-15T08:00:00Z',
        uploadedBy: 'Từ Văn Gọn',
        notes: 'Bản thảo ban đầu theo khung bài dạy 2345',
        storagePath: '/uploads/giao_an_toan_1_tuan_5_v1.docx'
      }
    ],
    share: {
      isShared: true,
      shareType: 'public_link',
      permission: 'view',
      sharedWithEmails: ['tieuhocto1@gmail.com'],
      shareLink: 'https://ais-dev.cloud/share/toan1-tuan5-gon',
      expiresAt: '2026-10-28T23:59:59Z',
      passwordProtected: false
    }
  },
  {
    id: 'file-02',
    name: 'Bài giảng điện tử Tiếng Việt.pptx',
    folderId: 'f-10',
    folderName: '10. POWERPOINT',
    type: 'powerpoint',
    extension: 'pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    sizeBytes: 13107200, // 12.5 MB
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-27T15:20:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Slide trình chiếu bài học vần: am, ap, an, at cho học sinh lớp 1. Có âm thanh phát âm mẫu, tranh ảnh minh họa sống động.',
    tags: ['Tiếng Việt 1', 'Slide', 'Bài giảng điện tử', 'Học vần'],
    isFavorite: true,
    isDeleted: false,
    storagePath: '/uploads/bai_giang_tieng_viet.pptx',
    contentSnippet: `Slide 1: Trường Tiểu học Phường An Xuyên - Tiếng Việt Lớp 1C - Bài 24: Vần an - at\nSlide 2: Khởi động cùng bài hát "Bé ngoan"\nSlide 3: Khám phá vần mới: con ngan, bãi cát, bàn tay, bát sen\nSlide 4: Hướng dẫn viết bảng con: an, at, lan can, hạt cát\nSlide 5: Đọc câu ứng dụng: "Bé Nga ngoan ngoãn chăm chỉ"\nSlide 6: Trò chơi hái hoa dân chủ - Thầy Từ Văn Gọn`,
    rawContent: `SLIDE 1: TRƯỜNG TIỂU HỌC PHƯỜNG AN XUYÊN\nMÔN: TIẾNG VIỆT 1 - BỘ SÁCH KẾT NỐI TRI THỨC\nGiáo viên: Thầy Từ Văn Gọn\nChủ đề: Bé và gia đình - Bài: an, at\n\nSLIDE 2: KHÁM PHÁ VẦN MỚI\n- Vần 'an': gồm âm 'a' đứng trước, âm 'n' đứng sau. (a - n - an)\n- Từ khóa: BÀN HỌC, ĐÀN BƯỚM, HOA LAN\n- Vần 'at': gồm âm 'a' đứng trước, âm 't' đứng sau. (a - t - at)\n- Từ khóa: BÃI CÁT, HẠT THÓC, BÁT ĐĨA\n\nSLIDE 3: LUYỆN ĐỌC TỪ NGỮ ỨNG DỤNG\n- Con ngan, khăn rằn, cây bàng\n- Rửa bát, quạt mát, múa hát\n\nSLIDE 4: TẬP ĐỌC ĐOẠN VĂN\n"Mẹ đưa bé Lan ra biển. Bãi cát vàng mịn màng. Đàn chim hải âu chao lượn..."\n\nSLIDE 5: TRÒ CHƠI Ô CHỮ KỲ DIỆU\nThưởng sao chăm ngoan cho học sinh lớp 1C!`,
    versions: [
      {
        id: 'ver-02-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Bài giảng điện tử Tiếng Việt.pptx',
        sizeBytes: 13107200,
        uploadedAt: '2026-09-27T10:00:00Z',
        uploadedBy: 'Từ Văn Gọn',
        notes: 'Bản trình chiếu chính thức có chèn âm thanh đọc mẫu chuẩn',
        storagePath: '/uploads/bai_giang_tieng_viet.pptx'
      }
    ],
    share: {
      isShared: false,
      shareType: 'private',
      permission: 'view',
      sharedWithEmails: []
    }
  },
  {
    id: 'file-03',
    name: 'Thông tư 27.pdf',
    folderId: 'f-08',
    folderName: '08. PDF',
    type: 'pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    sizeBytes: 3984588, // 3.8 MB
    createdAt: '2026-09-26T09:00:00Z',
    updatedAt: '2026-09-26T09:00:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Thông tư số 27/2020/TT-BGDĐT ban hành Quy định đánh giá học sinh tiểu học. Áp dụng cho chương trình giáo dục phổ thông 2018.',
    tags: ['Thông tư 27', 'Quy định', 'Đánh giá học sinh tiểu học', 'Bộ GD&ĐT'],
    isFavorite: true,
    isDeleted: false,
    storagePath: '/uploads/thong_tu_27.pdf',
    contentSnippet: `BỘ GIÁO DỤC VÀ ĐÀO TẠO\nSố: 27/2020/TT-BGDĐT\nCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\nHà Nội, ngày 04 tháng 9 năm 2020\n\nTHÔNG TƯ BAN HÀNH QUY ĐỊNH ĐÁNH GIÁ HỌC SINH TIỂU HỌC\nChương I: NHỮNG QUY ĐỊNH CHUNG\nĐiều 1: Phạm vi điều chỉnh và đối tượng áp dụng\n1. Thông tư này ban hành Quy định đánh giá học sinh tiểu học, bao gồm: đánh giá quá trình học tập, sự tiến bộ và kết quả học tập của học sinh; đánh giá sự hình thành và phát triển phẩm chất, năng lực của học sinh; hồ sơ đánh giá và sử dụng kết quả đánh giá.\n2. Quy định này áp dụng đối với trường tiểu học, trường phổ thông có nhiều cấp học có cấp tiểu học...\n\nĐiều 5: Mục đích đánh giá\nCung cấp thông tin chính xác, kịp thời, xác định được thành tích học tập, rèn luyện theo mức độ đáp ứng yêu cầu cần đạt của chương trình giáo dục phổ thông cấp tiểu học và sự tiến bộ của học sinh để hướng dẫn hoạt động học tập, điều chỉnh các hoạt động dạy học nhằm nâng cao chất lượng giáo dục.`,
    rawContent: `BỘ GIÁO DỤC VÀ ĐÀO TẠO\nSố: 27/2020/TT-BGDĐT\n\nQUY ĐỊNH ĐÁNH GIÁ HỌC SINH TIỂU HỌC\n\nCHƯƠNG I: NHỮNG QUY ĐỊNH CHUNG\n- Đánh giá học sinh tiểu học là quá trình thu thập, xử lý thông tin thông qua các hoạt động quan sát, theo dõi, trao đổi, kiểm tra, nhận xét quá trình học tập, rèn luyện của học sinh.\n- Đánh giá thường xuyên bằng nhận xét, đánh giá định kỳ bằng điểm số kết hợp với nhận xét.\n- Đánh giá vì sự tiến bộ của học sinh; coi trọng việc động viên, khuyến khích sự cố gắng trong học tập, rèn luyện.\n\nCHƯƠNG II: ĐÁNH GIÁ ĐỊNH KỲ VÀ THƯỜNG XUYÊN\n- Đánh giá nội dung học tập các môn học: Hoàn thành tốt (T), Hoàn thành (H), Chưa hoàn thành (C).\n- Đánh giá sự hình thành và phát triển từng phẩm chất chủ yếu: Yêu nước, nhân ái, chăm chỉ, trung thực, trách nhiệm.\n- Đánh giá sự hình thành và phát triển từng năng lực cốt lõi: Tự chủ và tự học, giao tiếp và hợp tác, giải quyết vấn đề và sáng tạo.`,
    versions: [
      {
        id: 'ver-03-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Thông tư 27.pdf',
        sizeBytes: 3984588,
        uploadedAt: '2026-09-26T09:00:00Z',
        uploadedBy: 'Từ Văn Gọn',
        notes: 'Văn bản gốc từ Cổng thông tin điện tử Bộ Giáo dục và Đào tạo',
        storagePath: '/uploads/thong_tu_27.pdf'
      }
    ],
    share: {
      isShared: true,
      shareType: 'public_link',
      permission: 'view',
      sharedWithEmails: [],
      shareLink: 'https://ais-dev.cloud/share/thongtu27-bgd',
      expiresAt: '2027-01-01T00:00:00Z'
    }
  },
  {
    id: 'file-04',
    name: 'Hình ảnh hoạt động lớp 1C.zip',
    folderId: 'f-04',
    folderName: '04. HÌNH ẢNH',
    type: 'zip',
    extension: 'zip',
    mimeType: 'application/zip',
    sizeBytes: 26843545, // 25.6 MB
    createdAt: '2026-09-25T11:20:00Z',
    updatedAt: '2026-09-25T11:20:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Kho hình ảnh ngày tựu trường, lễ khai giảng và các hoạt động vẽ tranh, trải nghiệm làm lồng đèn Trung thu năm 2026 của học sinh lớp 1C.',
    tags: ['Lớp 1C', 'Hình ảnh', 'Khai giảng', 'Ngoại khóa'],
    isFavorite: false,
    isDeleted: false,
    storagePath: '/uploads/hoat_dong_lop_1c.zip',
    contentSnippet: `Nén 45 bức ảnh chất lượng cao (JPG, PNG) của lớp 1C Trường Tiểu học Phường An Xuyên:\n- KhaiGiang_1C_01.jpg đến KhaiGiang_1C_15.jpg\n- TrungThu_LamLongDen_01.jpg đến TrungThu_LamLongDen_20.jpg\n- SinhHoatLop_DocSach_01.jpg đến 10.jpg`,
    rawContent: `DANH SÁCH TỆP TRONG FILE NÉN HÌNH ẢNH LỚP 1C:\n1. KhaiGiang_1C_ChupTapThe.jpg (4.2 MB)\n2. ThietBiDayHoc_CoTro.jpg (3.8 MB)\n3. HoatDong_VuiTrungThu_2026.jpg (5.1 MB)\n4. BuoiDocSach_ThuVienXanh.jpg (3.9 MB)\n5. TraoThuong_HoaDiemMuoi.jpg (4.4 MB)`,
    versions: [
      {
        id: 'ver-04-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Hình ảnh hoạt động lớp 1C.zip',
        sizeBytes: 26843545,
        uploadedAt: '2026-09-25T11:20:00Z',
        uploadedBy: 'Từ Văn Gọn',
        storagePath: '/uploads/hoat_dong_lop_1c.zip'
      }
    ],
    share: {
      isShared: false,
      shareType: 'private',
      permission: 'view',
      sharedWithEmails: []
    }
  },
  {
    id: 'file-05',
    name: 'Danh sách học sinh lớp 1C.xlsx',
    folderId: 'f-02',
    folderName: '02. LỚP 1C',
    type: 'excel',
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    sizeBytes: 1258291, // 1.2 MB
    createdAt: '2026-09-24T14:45:00Z',
    updatedAt: '2026-09-24T14:45:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Bảng theo dõi thông tin nhân khẩu, học bạ, số điện thoại phụ huynh và tình trạng tiêm chủng của 32 học sinh lớp 1C niên khóa 2026-2027.',
    tags: ['Danh sách học sinh', 'Lớp 1C', 'Chủ nhiệm', 'Hồ sơ lớp'],
    isFavorite: true,
    isDeleted: false,
    storagePath: '/uploads/danh_sach_hoc_sinh_1c.xlsx',
    contentSnippet: `DANH SÁCH HỌC SINH LỚP 1C - TRƯỜNG TIỂU HỌC PHƯỜNG AN XUYÊN - TP CÀ MAU\nGiáo viên chủ nhiệm: Từ Văn Gọn\nTổng số học sinh: 32 em (Nam: 17, Nữ: 15)\n1. Nguyễn Hoàng An - 12/03/2020 - Nam - Khóm 3, Phường An Xuyên\n2. Trần Bảo Anh - 05/06/2020 - Nữ - Ấp Tân Hiệp, Xã An Xuyên\n3. Lê Minh Cường - 22/01/2020 - Nam - Khóm 1, Phường An Xuyên\n4. Phạm Quỳnh Chi - 14/09/2020 - Nữ - Phường An Xuyên, TP Cà Mau\n5. Đỗ Gia Huy - 30/11/2020 - Nam - Phường Tân Thành, Cà Mau`,
    rawContent: `BẢNG TÍNH EXCEL: DANH SÁCH VÀ THÔNG TIN PHỤ HUYNH LỚP 1C (32 HỌC SINH)\nSTT | Mã HS | Họ và tên | Ngày sinh | Giới tính | Họ tên cha/mẹ | Số điện thoại | Địa chỉ cư trú\n1 | HS01 | Nguyễn Hoàng An | 12/03/2020 | Nam | Nguyễn Văn Hùng | 0913.882.123 | Khóm 3, P. An Xuyên\n2 | HS02 | Trần Bảo Anh | 05/06/2020 | Nữ | Trần Văn Tuấn | 0944.221.789 | Ấp Tân Hiệp, P. An Xuyên\n3 | HS03 | Lê Minh Cường | 22/01/2020 | Nam | Lê Thành Đạt | 0907.551.442 | Khóm 1, P. An Xuyên\n4 | HS04 | Phạm Quỳnh Chi | 14/09/2020 | Nữ | Phạm Văn Long | 0989.112.334 | Khóm 2, P. An Xuyên\n5 | HS05 | Đỗ Gia Huy | 30/11/2020 | Nam | Đỗ Minh Trí | 0918.447.889 | P. Tân Thành, TP Cà Mau\n6 | HS06 | Huỳnh Ngọc Mai | 18/07/2020 | Nữ | Huỳnh Văn Phát | 0939.667.120 | Khóm 4, P. An Xuyên\n7 | HS07 | Võ Minh Khôi | 09/04/2020 | Nam | Võ Văn Bình | 0948.334.556 | Ấp Cây Trâm, P. An Xuyên\n8 | HS08 | Nguyễn Thảo Vy | 25/10/2020 | Nữ | Nguyễn Văn Nam | 0919.223.887 | Khóm 3, P. An Xuyên`,
    versions: [
      {
        id: 'ver-05-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Danh sách học sinh lớp 1C.xlsx',
        sizeBytes: 1258291,
        uploadedAt: '2026-09-24T14:45:00Z',
        uploadedBy: 'Từ Văn Gọn',
        storagePath: '/uploads/danh_sach_hoc_sinh_1c.xlsx'
      }
    ],
    share: {
      isShared: false,
      shareType: 'private',
      permission: 'view',
      sharedWithEmails: []
    }
  },
  {
    id: 'file-06',
    name: 'Ma trận đề kiểm tra Toán 1.xlsx',
    folderId: 'f-07',
    folderName: '07. EXCEL',
    type: 'excel',
    extension: 'xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    sizeBytes: 1258291, // 1.2 MB
    createdAt: '2026-09-10T09:20:00Z',
    updatedAt: '2026-09-10T09:20:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Bảng ma trận và bản đặc tả đề kiểm tra định kỳ môn Toán lớp 1 theo 3 mức độ nhận thức (Mức 1, Mức 2, Mức 3) theo Thông tư 27.',
    tags: ['Ma trận đề', 'Toán 1', 'Kiểm tra', 'Đề thi'],
    isFavorite: false,
    isDeleted: false,
    storagePath: '/uploads/ma_tran_de_toan_1.xlsx',
    contentSnippet: `MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ MÔN TOÁN LỚP 1\nTheo Thông tư số 27/2020/TT-BGDĐT\nMạch kiến thức: Số và phép tính (chiếm 70%), Hình học và đo lường (20%), Một số yếu tố thống kê và xác suất (10%)\nMức 1 (Nhận biết): 50% (5 điểm)\nMức 2 (Thông hiểu): 30% (3 điểm)\nMức 3 (Vận dụng): 20% (2 điểm)`,
    rawContent: `MA TRẬN ĐỀ THI MÔN TOÁN 1:\n- Mức 1: Đếm số, so sánh hai số bé hơn 10 (TN: 4 câu, TL: 1 câu)\n- Mức 2: Thực hiện phép cộng không nhớ trong phạm vi 10, đo độ dài bằng gang tay (TN: 2 câu, TL: 2 câu)\n- Mức 3: Giải bài toán có lời văn một bước tính dạng gộp thêm đồ vật (TL: 1 câu)`,
    versions: [
      {
        id: 'ver-06-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Ma trận đề kiểm tra Toán 1.xlsx',
        sizeBytes: 1258291,
        uploadedAt: '2026-09-10T09:20:00Z',
        uploadedBy: 'Từ Văn Gọn',
        storagePath: '/uploads/ma_tran_de_toan_1.xlsx'
      }
    ],
    share: {
      isShared: false,
      shareType: 'private',
      permission: 'view',
      sharedWithEmails: []
    }
  },
  {
    id: 'file-07',
    name: 'Hướng dẫn đánh giá học sinh tiểu học.docx',
    folderId: 'f-01',
    folderName: '01. GIÁO DỤC',
    type: 'word',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: 2202009, // 2.1 MB
    createdAt: '2026-09-22T08:00:00Z',
    updatedAt: '2026-09-22T08:00:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Tài liệu hướng dẫn cụ thể cách ghi nhận xét học bạ, nhận xét vở học sinh lớp 1 theo Thông tư 27 không gây áp lực cho phụ huynh và học sinh.',
    tags: ['Hướng dẫn', 'Thông tư 27', 'Đánh giá học sinh'],
    isFavorite: false,
    isDeleted: false,
    storagePath: '/uploads/huong_dan_danh_gia.docx',
    contentSnippet: `HƯỚNG DẪN THỰC HIỆN ĐÁNH GIÁ HỌC SINH TIỂU HỌC\nTrường Tiểu học Phường An Xuyên - Tổ chuyên môn Khối 1\n1. Đánh giá thường xuyên môn Tiếng Việt và Toán:\n- Không cho điểm số hàng ngày, sử dụng lời nhận xét mang tính khích lệ, chỉ ra biện pháp khắc phục cụ thể.\n- Ví dụ nhận xét chữ viết: "Chữ viết đúng độ cao con chữ, em chú ý khoảng cách giữa các chữ khoảng một con chữ o."\n- Ví dụ nhận xét Toán: "Em tính toán nhanh và chính xác phép cộng, cần viết số 8 cẩn thận hơn."`,
    rawContent: `HƯỚNG DẪN VIẾT NHẬN XÉT HỌC SINH LỚP 1:\n- Lời nhận xét cần chân thành, cụ thể, không rập khuôn.\n- Nêu rõ điểm mạnh trước, sau đó nêu điểm cần cố gắng.\n- Tránh nhận xét chung chung như "Cần cố gắng" mà phải viết: "Cần rèn thêm kỹ năng cộng nhẩm nhanh hơn".`,
    versions: [
      {
        id: 'ver-07-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Hướng dẫn đánh giá học sinh tiểu học.docx',
        sizeBytes: 2202009,
        uploadedAt: '2026-09-22T08:00:00Z',
        uploadedBy: 'Từ Văn Gọn',
        storagePath: '/uploads/huong_dan_danh_gia.docx'
      }
    ],
    share: {
      isShared: true,
      shareType: 'restricted',
      permission: 'view',
      sharedWithEmails: ['phamthicam@gmail.com', 'nguyenvantung@gmail.com']
    }
  },
  {
    id: 'file-08',
    name: 'Mẫu nhận xét học sinh lớp 1.docx',
    folderId: 'f-02',
    folderName: '02. LỚP 1C',
    type: 'word',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: 1572864, // 1.5 MB
    createdAt: '2026-09-18T15:30:00Z',
    updatedAt: '2026-09-18T15:30:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Bộ sưu tập 100+ câu nhận xét đánh giá thường xuyên và định kỳ cho học sinh lớp 1 theo từng mức độ Hoàn thành tốt, Hoàn thành và Chưa hoàn thành.',
    tags: ['Mẫu nhận xét', 'Lớp 1', 'Học bạ', 'Nhận xét môn học'],
    isFavorite: true,
    isDeleted: false,
    storagePath: '/uploads/mau_nhan_xet_lop1.docx',
    contentSnippet: `TỔNG HỢP MẪU NHẬN XÉT HỌC BẠ VÀ SỔ THEO DÕI ĐÁNH GIÁ LỚP 1\nThầy giáo: Từ Văn Gọn biên soạn\n\n1. Môn Tiếng Việt:\n- Mức T (Hoàn thành tốt): Đọc to, rõ ràng, lưu loát; phát âm chuẩn các âm vần khó; viết chữ đúng độ cao và đều nét; có vốn từ phong phú.\n- Mức H (Hoàn thành): Đọc được các âm vần và câu văn ngắn; viết đúng mẫu chữ; cần rèn thêm tốc độ đọc.\n- Mức C: Còn nhầm lẫn âm dấu thanh, cần thầy cô và phụ huynh kiên nhẫn hướng dẫn thêm.\n\n2. Môn Toán:\n- Mức T: Nắm chắc các số đến 10; tính nhẩm nhanh và chính xác; thích thú giải bài toán vui.\n- Mức H: Đếm số và so sánh thành thạo; thực hiện được phép tính cộng trừ đơn giản.`,
    rawContent: `MẪU NHẬN XÉT PHẨM CHẤT VÀ NĂNG LỰC:\n- Chăm chỉ: Đi học chuyên cần, tích cực giơ tay phát biểu, giữ gìn sách vở cẩn thận.\n- Nhân ái: Hòa đồng, biết yêu thương giúp đỡ bạn bè, vâng lời thầy cô.\n- Trung thực: Thật thà, dũng cảm nhận lỗi khi làm rơi đồ dùng của bạn.\n- Trách nhiệm: Thực hiện tốt nội quy lớp học, hoàn thành việc trực nhật bàn ghế sạch sẽ.`,
    versions: [
      {
        id: 'ver-08-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Mẫu nhận xét học sinh lớp 1.docx',
        sizeBytes: 1572864,
        uploadedAt: '2026-09-18T15:30:00Z',
        uploadedBy: 'Từ Văn Gọn',
        storagePath: '/uploads/mau_nhan_xet_lop1.docx'
      }
    ],
    share: {
      isShared: false,
      shareType: 'private',
      permission: 'view',
      sharedWithEmails: []
    }
  },
  {
    id: 'file-09',
    name: 'Kế hoạch đánh giá học sinh lớp 1.pdf',
    folderId: 'f-08',
    folderName: '08. PDF',
    type: 'pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    sizeBytes: 2411724, // 2.3 MB
    createdAt: '2026-09-14T08:30:00Z',
    updatedAt: '2026-09-14T08:30:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Kế hoạch tổ chức đánh giá học sinh lớp 1 học kỳ I năm học 2026-2027 của Trường Tiểu học Phường An Xuyên.',
    tags: ['Kế hoạch', 'Kiểm tra định kỳ', 'Tiểu học An Xuyên'],
    isFavorite: false,
    isDeleted: false,
    storagePath: '/uploads/ke_hoach_danh_gia_lop1.pdf',
    contentSnippet: `ỦY BAN NHÂN DÂN THÀNH PHỐ CÀ MAU\nTRƯỜNG TIỂU HỌC PHƯỜNG AN XUYÊN\nKẾ HOẠCH ĐÁNH GIÁ ĐỊNH KỲ HỌC SINH LỚP 1 NĂM HỌC 2026 - 2027\n\n1. Thời gian kiểm tra cuối học kỳ I: Từ ngày 28/12/2026 đến 31/12/2026.\n2. Môn thi: Toán (thời gian làm bài 40 phút), Tiếng Việt (Đọc thành tiếng, Đọc hiểu và Viết - 50 phút).\n3. Phân công ra đề và coi thi chéo giữa các lớp 1A, 1B, 1C.`,
    rawContent: `KẾ HOẠCH CHI TIẾT TỔNG KẾT ĐÁNH GIÁ:\n- Báo cáo kết quả về Ban giám hiệu trước ngày 05/01/2027.\n- Họp phụ huynh thông báo kết quả và tư vấn hỗ trợ học sinh tại gia đình.`,
    versions: [
      {
        id: 'ver-09-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Kế hoạch đánh giá học sinh lớp 1.pdf',
        sizeBytes: 2411724,
        uploadedAt: '2026-09-14T08:30:00Z',
        uploadedBy: 'Từ Văn Gọn',
        storagePath: '/uploads/ke_hoach_danh_gia_lop1.pdf'
      }
    ],
    share: {
      isShared: false,
      shareType: 'private',
      permission: 'view',
      sharedWithEmails: []
    }
  },
  {
    id: 'file-10',
    name: 'Ứng dụng AI trong soạn giáo án tiểu học.pdf',
    folderId: 'f-03',
    folderName: '03. AI',
    type: 'pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    sizeBytes: 4299161, // 4.1 MB
    createdAt: '2026-09-26T11:00:00Z',
    updatedAt: '2026-09-26T11:00:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Chuyên đề nghiên cứu sư phạm: Khai thác Trí tuệ nhân tạo (Gemini AI) trong việc tạo trò chơi học tập và hình ảnh trực quan cho học sinh lớp 1.',
    tags: ['AI', 'Sư phạm số', 'Gemini AI', 'Giáo án điện tử', 'Thầy Gọn'],
    isFavorite: true,
    isDeleted: false,
    storagePath: '/uploads/ai_trong_day_hoc.pdf',
    contentSnippet: `BÁO CÁO KINH NGHIỆM SƯ PHẠM\nỨNG DỤNG TRÍ TUỆ NHÂN TẠO TRONG XÂY DỰNG HỌC LIỆU SỐ BẬC TIỂU HỌC\nTác giả: Thầy giáo Từ Văn Gọn - Trường Tiểu học Phường An Xuyên, TP Cà Mau\n\n1. Đặt vấn đề: Học sinh tiểu học cần trực quan sinh động. Việc tạo tranh ảnh, câu đố và bài tập phân hóa tốn nhiều thời gian của giáo viên.\n2. Giải pháp: Sử dụng mô hình ngôn ngữ lớn (Gemini) để:\n- Thiết kế kịch bản trò chơi khởi động tiết học.\n- Tạo đề toán có cốt truyện gần gũi với vùng sông nước miền Tây Cà Mau (rừng đước, con tôm, chiếc xuồng).\n- Soạn lời nhận xét học sinh cá nhân hóa, ân cần và giàu cảm xúc.`,
    rawContent: `NỘI DUNG CHUYÊN ĐỀ:\n- Cách viết câu lệnh (prompt) hiệu quả cho giáo viên tiểu học.\n- Kết hợp công cụ AI với sách giáo khoa hiện hành.\n- Đảm bảo tính sư phạm và an toàn thông tin của học sinh.`,
    versions: [
      {
        id: 'ver-10-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Ứng dụng AI trong soạn giáo án tiểu học.pdf',
        sizeBytes: 4299161,
        uploadedAt: '2026-09-26T11:00:00Z',
        uploadedBy: 'Từ Văn Gọn',
        storagePath: '/uploads/ai_trong_day_hoc.pdf'
      }
    ],
    share: {
      isShared: true,
      shareType: 'public_link',
      permission: 'view',
      sharedWithEmails: [],
      shareLink: 'https://ais-dev.cloud/share/ai-tieu-hoc-thay-gon'
    }
  },
  {
    id: 'file-11',
    name: 'Video tiết dạy mẫu môn Tiếng Việt 1.mp4',
    folderId: 'f-05',
    folderName: '05. VIDEO',
    type: 'video',
    extension: 'mp4',
    mimeType: 'video/mp4',
    sizeBytes: 471859200, // 450 MB
    createdAt: '2026-09-24T15:00:00Z',
    updatedAt: '2026-09-24T15:00:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Video ghi lại toàn bộ tiết dạy thao giảng môn Tiếng Việt lớp 1C - Bài học vần. Đạt giải Nhất giáo viên dạy giỏi cấp trường.',
    tags: ['Video', 'Tiết dạy mẫu', 'Thao giảng', 'Giáo viên dạy giỏi'],
    isFavorite: true,
    isDeleted: false,
    storagePath: '/uploads/video_tiet_day_lop1.mp4',
    contentSnippet: `Ghi hình độ phân giải 1080p, thời lượng 35 phút. Tiết dạy minh họa phương pháp dạy học lấy học sinh làm trung tâm, kết hợp màn hình tương tác và đồ dùng dạy học tự làm.`,
    rawContent: `THÔNG TIN VIDEO THAO GIẢNG:\n- Thời lượng: 35 phút 20 giây\n- Giáo viên thực hiện: Từ Văn Gọn\n- Lớp thực hiện: 1C, Trường Tiểu học Phường An Xuyên\n- Đánh giá của Ban giám khảo: Tiết dạy sáng tạo, học sinh hoạt động sôi nổi, nắm chắc bài học.`,
    versions: [
      {
        id: 'ver-11-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Video tiết dạy mẫu môn Tiếng Việt 1.mp4',
        sizeBytes: 471859200,
        uploadedAt: '2026-09-24T15:00:00Z',
        uploadedBy: 'Từ Văn Gọn',
        storagePath: '/uploads/video_tiet_day_lop1.mp4'
      }
    ],
    share: {
      isShared: false,
      shareType: 'private',
      permission: 'view',
      sharedWithEmails: []
    }
  },
  {
    id: 'file-12',
    name: 'Báo cáo công tác tháng 8.pdf',
    folderId: 'f-08',
    folderName: '08. PDF',
    type: 'pdf',
    extension: 'pdf',
    mimeType: 'application/pdf',
    sizeBytes: 1887436, // 1.8 MB
    createdAt: '2026-08-30T10:00:00Z',
    updatedAt: '2026-08-30T10:00:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Báo cáo tổng kết công tác chuẩn bị năm học mới và tập huấn sách giáo khoa lớp 1 tháng 8 năm 2026.',
    tags: ['Báo cáo', 'Tháng 8', 'Tập huấn'],
    isFavorite: false,
    isDeleted: false,
    storagePath: '/uploads/bao_cao_thang_8.pdf',
    contentSnippet: `BÁO CÁO CÔNG TÁC THÁNG 8 NĂM 2026\nTổ chuyên môn Khối 1 - Trường Tiểu học Phường An Xuyên\n1. Tham gia đầy đủ các lớp tập huấn SGK mới do Sở GD&ĐT Cà Mau tổ chức.\n2. Vệ sinh trường lớp, trang trí phòng học thân thiện cho học sinh lớp 1C.\n3. Hoàn tất việc rà soát danh sách học sinh vào lớp 1 trên địa bàn Phường An Xuyên.`,
    rawContent: `KẾT QUẢ THÁNG 8:\n- 100% giáo viên khối 1 hoàn thành bài thu hoạch tập huấn.\n- Phòng học lớp 1C khang trang, đầy đủ bảng từ, bàn ghế đúng quy cách.`,
    versions: [
      {
        id: 'ver-12-1',
        versionNumber: 1,
        versionLabel: 'v1',
        fileName: 'Báo cáo công tác tháng 8.pdf',
        sizeBytes: 1887436,
        uploadedAt: '2026-08-30T10:00:00Z',
        uploadedBy: 'Từ Văn Gọn',
        storagePath: '/uploads/bao_cao_thang_8.pdf'
      }
    ],
    share: {
      isShared: false,
      shareType: 'private',
      permission: 'view',
      sharedWithEmails: []
    }
  },
  // In trash file for Trash screen (Screen 10 in mockup)
  {
    id: 'file-trash-01',
    name: 'Bản nháp kế hoạch tuần 3 cũ.docx',
    folderId: 'f-06',
    folderName: '06. WORD',
    type: 'word',
    extension: 'docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    sizeBytes: 1048576, // 1.0 MB
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-09-20T11:00:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Bản thảo cũ đã thay thế bằng bản hoàn chỉnh tuần 3.',
    isFavorite: false,
    isDeleted: true,
    deletedAt: '2026-09-27T10:15:00Z',
    storagePath: '/uploads/ban_nhap_tuan_3.docx',
    versions: [],
    share: { isShared: false, shareType: 'private', permission: 'view', sharedWithEmails: [] }
  },
  {
    id: 'file-trash-02',
    name: 'Ảnh chụp bảng kiểm tra nháp.jpg',
    folderId: 'f-04',
    folderName: '04. HÌNH ẢNH',
    type: 'image',
    extension: 'jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 3145728, // 3.0 MB
    createdAt: '2026-09-12T14:00:00Z',
    updatedAt: '2026-09-22T09:30:00Z',
    owner: 'Từ Văn Gọn',
    description: 'Ảnh nháp mờ không cần thiết giữ lại.',
    isFavorite: false,
    isDeleted: true,
    deletedAt: '2026-09-26T15:45:00Z',
    storagePath: '/uploads/anh_nhap.jpg',
    versions: [],
    share: { isShared: false, shareType: 'private', permission: 'view', sharedWithEmails: [] }
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    action: 'Cập nhật phiên bản',
    detail: 'Đã tải lên v4 cho Giáo án Toán lớp 1 - Tuần 5.docx',
    timestamp: '2026-09-28T14:30:00Z',
    ipAddress: '113.185.42.10 (Cà Mau, VN)',
    iconType: 'upload'
  },
  {
    id: 'log-2',
    action: 'Tải lên tài liệu',
    detail: 'Đã tải lên Bài giảng điện tử Tiếng Việt.pptx (12.5 MB)',
    timestamp: '2026-09-27T10:00:00Z',
    ipAddress: '113.185.42.10 (Cà Mau, VN)',
    iconType: 'upload'
  },
  {
    id: 'log-3',
    action: 'Chia sẻ liên kết',
    detail: 'Đã tạo liên kết chia sẻ công khai cho Thông tư 27.pdf',
    timestamp: '2026-09-26T09:15:00Z',
    ipAddress: '113.185.42.10 (Cà Mau, VN)',
    iconType: 'share'
  },
  {
    id: 'log-4',
    action: 'Đăng nhập an toàn',
    detail: 'Đăng nhập thành công từ Chrome trên Windows 11 (Xác thực 2 bước 2FA hợp lệ)',
    timestamp: '2026-09-28T07:45:00Z',
    ipAddress: '113.185.42.10 (Cà Mau, VN)',
    iconType: 'login'
  }
];
