import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Search,
  BookOpen,
  HelpCircle,
  Lightbulb,
  PenTool,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  User
} from 'lucide-react';
import { AiChatMessage, FileItem, FileType } from '../types';
import { api } from '../services/api';

interface AiAssistantViewProps {
  onOpenFileById: (fileId: string) => void;
  files: FileItem[];
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  onOpenFileById,
  files,
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'user',
      content: 'Tìm cho tôi các tài liệu liên quan đến đánh giá học sinh lớp 1.',
      timestamp: '14:20',
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      content: `Dạ em chào Thầy Từ Văn Gọn! Em đã rà soát kho dữ liệu và tìm thấy các tài liệu quy chuẩn liên quan đến việc đánh giá học sinh lớp 1C theo Thông tư 27 của Bộ GD&ĐT:

1. **Thông tư 27.pdf**: Quy định chi tiết các tiêu chí đánh giá thường xuyên bằng nhận xét, không áp lực điểm số.
2. **Hướng dẫn đánh giá học sinh tiểu học.docx**: Hướng dẫn cụ thể phương pháp nhận xét môn Toán và Tiếng Việt.
3. **Mẫu nhận xét học sinh lớp 1.docx**: 100+ lời nhận xét mẫu về phẩm chất và năng lực.
4. **Kế hoạch đánh giá học sinh lớp 1.pdf**: Kế hoạch kiểm tra định kỳ học kỳ I tại Trường Tiểu học Phường An Xuyên.

Thầy có thể bấm vào tài liệu bên dưới để mở đọc ngay hoặc yêu cầu em trích xuất lời nhận xét cụ thể cho học sinh nào ạ!`,
      timestamp: '14:21',
      citations: [
        { fileId: 'file-03', fileName: 'Thông tư 27.pdf', fileType: 'pdf' },
        { fileId: 'file-07', fileName: 'Hướng dẫn đánh giá học sinh tiểu học.docx', fileType: 'word' },
        { fileId: 'file-08', fileName: 'Mẫu nhận xét học sinh lớp 1.docx', fileType: 'word' },
        { fileId: 'file-09', fileName: 'Kế hoạch đánh giá học sinh lớp 1.pdf', fileType: 'pdf' },
      ],
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActionPrompts = [
    { label: '🔍 Tìm tài liệu', prompt: 'Tìm tất cả tài liệu giáo án Toán lớp 1 trong kho' },
    { label: '📊 Phân tích tài liệu', prompt: 'Phân tích ma trận đề kiểm tra môn Toán theo 3 mức độ' },
    { label: '📑 Tóm tắt nội dung', prompt: 'Tóm tắt các điểm cốt lõi trong Thông tư 27/2020/TT-BGDĐT' },
    { label: '💡 Hỏi đáp tài liệu', prompt: 'Quy định khen thưởng học sinh tiểu học cuối năm cần điều kiện gì?' },
    { label: '🏷️ Gợi ý tài liệu', prompt: 'Gợi ý các hoạt động khởi động vui nhộn cho tiết học vần an - at' },
    { label: '✍️ Hỗ trợ viết nhận xét', prompt: 'Soạn 5 lời nhận xét khen ngợi học sinh lớp 1C học toán tiến bộ' },
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: AiChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await api.aiChat(text);
      const assistantMsg: AiChatMessage = {
        id: 'msg-res-' + Date.now(),
        sender: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'assistant',
          content: 'Dạ thưa Thầy, hệ thống AI đang gặp chút gián đoạn kết nối. Thầy vui lòng thử lại câu hỏi trong giây lát ạ.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              7
            </span>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                Trợ lý AI của Thầy Gọn
              </h2>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 pl-9">
            Hỏi đáp, tóm tắt, tìm kiếm thông minh và phân tích sư phạm trực tiếp trên kho tài liệu cá nhân
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Gemini 3.8 Flash Sẵn sàng
          </span>
        </div>
      </div>

      {/* Main Grid: Quick Prompts Pill Sidebar (Screen 7 Top/Left) + Chat Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Action Prompts Column */}
        <div className="lg:col-span-1 bg-white p-4 rounded-2xl shadow-xs border border-blue-100 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Chức năng AI gợi ý
            </h3>

            <div className="space-y-2">
              {quickActionPrompts.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(action.prompt)}
                  className="w-full text-left p-2.5 rounded-xl border border-blue-100 bg-blue-50/30 hover:bg-blue-100/70 hover:border-blue-300 text-xs font-medium text-slate-700 transition flex items-center justify-between group"
                >
                  <span className="group-hover:text-blue-700">{action.label}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-blue-500 font-bold">→</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
            <span className="text-[11px] font-bold text-blue-900 block">Quyền riêng tư kho dữ liệu:</span>
            <p className="text-[11px] text-blue-800/80 mt-1 leading-relaxed">
              Dữ liệu của Thầy Gọn được bảo vệ riêng tư. AI chỉ trích xuất thông tin cần thiết khi nhận được yêu cầu.
            </p>
          </div>
        </div>

        {/* Right Chat Canvas Column (Matching Screen 7) */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-xs border border-blue-100 flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages Scroll Area */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 bg-[#F8FAFC]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-xs ${
                      isUser
                        ? 'bg-blue-600'
                        : 'bg-gradient-to-tr from-blue-700 to-indigo-600'
                    }`}
                  >
                    {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#0866E8] text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.content}
                    </div>

                    {/* Citations Box (Screen 7 clickable file citations) */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2">
                        <div className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          Tài liệu nguồn trong kho Thầy Gọn (Bấm để xem ngay):
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cite, cIdx) => (
                            <button
                              key={cIdx}
                              onClick={() => onOpenFileById(cite.fileId)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-semibold text-xs flex items-center gap-1.5 transition shadow-2xs hover:shadow-xs group"
                              title={`Mở xem ${cite.fileName}`}
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition" />
                              <span className="truncate max-w-[200px]">{cite.fileName}</span>
                              <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div
                      className={`text-[10px] mt-2 text-right ${
                        isUser ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-slate-500 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>Trợ lý AI đang tra cứu và tổng hợp tài liệu của Thầy Gọn...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar (Screen 7 Bottom) */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi của Thầy (ví dụ: Tìm giáo án Toán 1, tóm tắt Thông tư 27...)"
                className="flex-1 bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputPrompt.trim() || isLoading}
                className="p-3 rounded-2xl bg-[#0866E8] hover:bg-blue-700 disabled:opacity-40 text-white font-bold transition shadow-md flex items-center justify-center"
                title="Gửi câu hỏi"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
