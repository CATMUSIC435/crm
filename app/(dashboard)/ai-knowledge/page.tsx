"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  BrainCircuit, BookOpen, FileText, UploadCloud, 
  Search, Send, FileSpreadsheet, CheckCircle2, 
  RefreshCw, Bot, User, AlertCircle, FileArchive, Layers
} from 'lucide-react'

// Mock Data cho Knowledge Base Files
const KNOWLEDGE_FILES = [
  { id: 1, name: 'Chinh_Sach_Ban_Hang_Aqua_T7.pdf', type: 'policy', icon: <FileText className="h-5 w-5 text-red-500" />, status: 'learned', size: '2.4 MB', date: 'Hôm nay' },
  { id: 2, name: 'Brochure_Du_An_AquaCity_2026.pdf', type: 'brochure', icon: <FileText className="h-5 w-5 text-red-500" />, status: 'learned', size: '15.1 MB', date: 'Hôm qua' },
  { id: 3, name: 'Bang_Gia_Tham_Khao_PhanKhu2.xlsx', type: 'price', icon: <FileSpreadsheet className="h-5 w-5 text-green-600" />, status: 'learned', size: '1.1 MB', date: '15/07' },
  { id: 4, name: 'Luat_Kinh_Doanh_BDS_SuaDoi.pdf', type: 'law', icon: <BookOpen className="h-5 w-5 text-blue-500" />, status: 'learning', size: '5.2 MB', date: 'Vừa tải lên' },
  { id: 5, name: 'FAQ_Cau_Hoi_Thuong_Gap_Cho_Sale.docx', type: 'faq', icon: <FileText className="h-5 w-5 text-blue-600" />, status: 'learned', size: '0.8 MB', date: '10/07' },
  { id: 6, name: 'Quy_Hoach_1_500_Dong_Nai.zip', type: 'planning', icon: <FileArchive className="h-5 w-5 text-orange-500" />, status: 'error', size: '120 MB', date: '05/07' },
]

export default function AIKnowledgePage() {
  const [inputText, setInputText] = useState('')

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-indigo-600" />
            Trợ Lý AI & Kho Tri Thức (RAG)
          </h1>
          <p className="text-muted-foreground mt-1">Chatbot nội bộ tự động đọc và trả lời câu hỏi dựa trên tài liệu dự án của công ty.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
           <UploadCloud className="h-4 w-4 mr-2" /> Tải Lên Tài Liệu
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* CỘT TRÁI: KHO TÀI LIỆU (4/12) */}
        <div className="xl:col-span-4 flex flex-col gap-4 min-h-0">
           <Card className="shadow-sm flex-1 flex flex-col min-h-0 border-slate-200">
             <CardHeader className="pb-3 border-b shrink-0 bg-slate-50/50">
               <CardTitle className="text-lg flex justify-between items-center">
                 <span>Nguồn Dữ Liệu (Knowledge Base)</span>
                 <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">6 Tài Liệu</Badge>
               </CardTitle>
               <div className="relative mt-2">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Tìm kiếm tài liệu..." className="pl-9 bg-white" />
               </div>
             </CardHeader>
             
             <CardContent className="p-0 overflow-y-auto flex-1">
                <div className="divide-y">
                   {KNOWLEDGE_FILES.map(file => (
                     <div key={file.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                        <div className="h-10 w-10 bg-white rounded-lg border shadow-sm flex items-center justify-center shrink-0">
                          {file.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-slate-800 truncate mb-1" title={file.name}>{file.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                             <span>{file.size}</span>
                             <span>•</span>
                             <span>{file.date}</span>
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          {file.status === 'learned' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Đã Học</Badge>}
                          {file.status === 'learning' && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin"/> Đang Xử Lý</Badge>}
                          {file.status === 'error' && <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Lỗi Parse</Badge>}
                        </div>
                     </div>
                   ))}
                </div>
             </CardContent>
             
             <div className="p-4 border-t bg-slate-50 shrink-0 text-center">
                <p className="text-xs text-muted-foreground">AI tự động cập nhật kiến thức mỗi khi có tài liệu mới.</p>
             </div>
           </Card>
        </div>

        {/* CỘT PHẢI: AI CHAT (8/12) */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
           <Card className="shadow-lg flex-1 flex flex-col min-h-0 border-indigo-100">
              
              {/* Chat Header */}
              <div className="p-4 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white rounded-t-xl shrink-0 flex justify-between items-center shadow-md z-10">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                       <Bot className="h-6 w-6 text-white" />
                    </div>
                    <div>
                       <h2 className="font-bold text-lg leading-tight">NovaCopilot</h2>
                       <p className="text-xs text-indigo-200 flex items-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                          Đang trực tuyến (Đã nạp 6 tài liệu)
                       </p>
                    </div>
                 </div>
                 <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white" size="icon">
                    <RefreshCw className="h-4 w-4" />
                 </Button>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
                 
                 {/* Greeting */}
                 <div className="flex justify-center mb-8">
                    <Badge variant="outline" className="bg-white text-slate-500 border-slate-200 px-4 py-1 text-xs">Hôm nay</Badge>
                 </div>

                 {/* User Message */}
                 <div className="flex gap-4 flex-row-reverse">
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                       <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm text-sm leading-relaxed">
                       Khách hàng mua căn 3PN Aqua City, nếu thanh toán nhanh 95% trong đợt này thì được chiết khấu tổng cộng bao nhiêu trợ lý ơi?
                    </div>
                 </div>

                 {/* AI Message */}
                 <div className="flex gap-4">
                    <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1">
                       <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col gap-2 max-w-[85%]">
                       <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-sm shadow-sm text-sm leading-relaxed text-slate-700">
                          <p className="mb-3">Chào bạn, dựa trên các tài liệu hiện hành, đối với căn hộ 3 Phòng ngủ tại Aqua City khi khách hàng chọn phương thức thanh toán nhanh 95%, mức chiết khấu được áp dụng như sau:</p>
                          <ul className="list-disc pl-5 space-y-2 mb-4 font-medium text-slate-800">
                             <li>Chiết khấu thanh toán nhanh 95%: <span className="text-green-600 font-bold">12%</span> trực tiếp vào giá bán.</li>
                             <li>Ưu đãi Booking sớm (Trong tháng 7): <span className="text-green-600 font-bold">2%</span></li>
                             <li>Gói quà tặng nội thất (Quy đổi): Trừ <span className="text-green-600 font-bold">300 triệu VNĐ</span>.</li>
                          </ul>
                          <p><strong>Tổng cộng:</strong> Khách hàng sẽ được chiết khấu <strong className="text-indigo-600">14%</strong> tổng giá trị căn hộ và trừ thêm <strong className="text-indigo-600">300 triệu VNĐ</strong>.</p>
                       </div>
                       
                       {/* Citations (Trích dẫn nguồn) */}
                       <div className="flex flex-wrap gap-2 mt-1">
                          <div className="text-xs font-medium text-slate-500 mr-1 flex items-center">Nguồn:</div>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100 cursor-pointer flex items-center gap-1">
                             <FileText className="h-3 w-3" /> Chinh_Sach_Ban_Hang_Aqua_T7.pdf (Trang 12)
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer flex items-center gap-1">
                             <FileText className="h-3 w-3" /> FAQ_Cau_Hoi_Thuong_Gap.docx
                          </Badge>
                       </div>
                    </div>
                 </div>

                 {/* AI Typing Indicator (Mock) */}
                 <div className="flex gap-4 opacity-50">
                    <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                       <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                       <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
                       <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                       <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                 </div>

              </div>

              {/* Chat Input Area */}
              <div className="p-4 bg-white border-t shrink-0 rounded-b-xl">
                 <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="shrink-0 text-slate-400 hover:text-indigo-600 border-none">
                       <Layers className="h-5 w-5" />
                    </Button>
                    <div className="relative flex-1">
                      <Input 
                        placeholder="Hỏi AI về chính sách, giá cả, pháp lý dự án..." 
                        className="pl-4 pr-12 py-6 bg-slate-50 border-slate-300 focus-visible:ring-indigo-500 rounded-xl w-full"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                      />
                      <Button 
                        size="icon" 
                        className={`absolute right-1.5 top-1.5 h-9 w-9 rounded-lg ${inputText.length > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400'}`}
                      >
                        <Send className="h-4 w-4 ml-0.5" />
                      </Button>
                    </div>
                 </div>
                 <div className="flex justify-center mt-2 gap-4 text-[11px] text-slate-400">
                    <span>💡 Gợi ý: "Pháp lý dự án Aqua đến đâu rồi?"</span>
                    <span>"Bảng giá các căn đang mở bán?"</span>
                 </div>
              </div>

           </Card>
        </div>

      </div>
    </div>
  )
}
