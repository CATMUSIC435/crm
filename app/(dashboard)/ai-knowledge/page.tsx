"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  BrainCircuit, BookOpen, FileText, UploadCloud, 
  Search, Send, FileSpreadsheet, CheckCircle2, 
  RefreshCw, Bot, User, AlertCircle, FileArchive, Layers
} from 'lucide-react'
import { useStore } from '@/store/useStore'

const getFileIcon = (type: string) => {
  switch (type) {
    case 'policy': return <FileText className="h-5 w-5 text-red-500" />
    case 'brochure': return <FileText className="h-5 w-5 text-red-500" />
    case 'price': return <FileSpreadsheet className="h-5 w-5 text-green-600" />
    case 'law': return <BookOpen className="h-5 w-5 text-blue-500" />
    case 'faq': return <FileText className="h-5 w-5 text-blue-600" />
    case 'planning': return <FileArchive className="h-5 w-5 text-orange-500" />
    default: return <FileText className="h-5 w-5 text-slate-500" />
  }
}

const renderMessageContent = (content: string) => {
   return content.split('\n').map((line, i) => {
      if (!line.trim()) return null;
      if (line.startsWith('- ')) {
         return <li key={i} className="ml-4 list-disc" dangerouslySetInnerHTML={{__html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-700">$1</strong>')}}></li>
      }
      return <p key={i} className={i !== 0 ? "mt-2" : ""} dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-700">$1</strong>')}}></p>
   })
}

export default function AIKnowledgePage() {
  const { knowledgeFiles, aiChatHistory, addKnowledgeFile, updateKnowledgeFileStatus, addAIChatMessage } = useStore()
  
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiChatHistory, isTyping])

  const handleSendMessage = () => {
    if (!inputText.trim() || isTyping) return
    
    // 1. Add User Message
    addAIChatMessage({
      role: 'user',
      content: inputText,
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    })
    
    const userText = inputText.toLowerCase()
    setInputText('')
    setIsTyping(true)

    // 2. Simulate AI Thinking & Responding
    setTimeout(() => {
       let aiResponse = ''
       let citations: string[] = []

       if (userText.includes('pháp lý') || userText.includes('aqua')) {
          aiResponse = 'Dựa trên tài liệu "Luat_Kinh_Doanh_BDS_SuaDoi.pdf" và quy hoạch hiện tại:\n\n- Dự án Aqua City đã hoàn thiện **100%** thủ tục pháp lý 1/500.\n- Sẵn sàng ký HĐMB cho các phân khu đã mở bán.\n\nKhách hàng có thể hoàn toàn yên tâm về tiến độ cấp sổ.'
          citations = ['Luat_Kinh_Doanh_BDS_SuaDoi.pdf', 'Quy_Hoach_1_500_Dong_Nai.zip']
       } else if (userText.includes('giá') || userText.includes('bảng giá')) {
          aiResponse = 'Cập nhật theo Bảng giá mới nhất:\n\n- Phân khu 2 (Nhà phố 6x20m): Giá từ **8.5 tỷ - 9.2 tỷ**.\n- Biệt thự song lập: Giá từ **14 tỷ - 16 tỷ**.\n\nLưu ý giá trên chưa bao gồm VAT và các chương trình chiết khấu thanh toán nhanh.'
          citations = ['Bang_Gia_Tham_Khao_PhanKhu2.xlsx']
       } else {
          aiResponse = 'Cảm ơn bạn đã đặt câu hỏi. Dựa trên kho dữ liệu hiện tại, AI đang tổng hợp thông tin để đưa ra chiến lược tốt nhất. Bạn có thể cung cấp thêm chi tiết về nhu cầu của khách hàng được không?'
       }

       addAIChatMessage({
          role: 'ai',
          content: aiResponse,
          citations,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
       })
       setIsTyping(false)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleUploadFile = () => {
    const newId = Date.now()
    addKnowledgeFile({
      id: newId,
      name: `Quy_Trinh_Cham_Soc_Khach_VIP_${newId.toString().slice(-4)}.pdf`,
      type: 'policy',
      status: 'learning',
      size: '3.5 MB',
      date: 'Vừa tải lên'
    })

    // Simulate AI Learning
    setTimeout(() => {
      updateKnowledgeFileStatus(newId, 'learned')
    }, 3000)
  }

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
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleUploadFile}>
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
                 <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">{knowledgeFiles.length} Tài Liệu</Badge>
               </CardTitle>
               <div className="relative mt-2">
                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Tìm kiếm tài liệu..." className="pl-9 bg-white" />
               </div>
             </CardHeader>
             
             <CardContent className="p-0 overflow-y-auto flex-1">
                <div className="divide-y">
                   {knowledgeFiles.map(file => (
                     <div key={file.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                        <div className="h-10 w-10 bg-white rounded-lg border shadow-sm flex items-center justify-center shrink-0">
                          {getFileIcon(file.type)}
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
                   {knowledgeFiles.length === 0 && (
                     <div className="p-8 text-center text-slate-500 text-sm">
                       Chưa có tài liệu nào.
                     </div>
                   )}
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
                          Đang trực tuyến (Đã nạp {knowledgeFiles.filter(f => f.status === 'learned').length} tài liệu)
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

                 {aiChatHistory.map(msg => (
                   <div key={msg.id}>
                     {msg.role === 'user' ? (
                       <div className="flex gap-4 flex-row-reverse">
                          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                             <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm text-sm leading-relaxed">
                             {msg.content}
                          </div>
                       </div>
                     ) : (
                       <div className="flex gap-4 mt-6">
                          <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-1">
                             <Bot className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex flex-col gap-2 max-w-[85%]">
                             <div className="bg-white border border-slate-200 p-5 rounded-2xl rounded-tl-sm shadow-sm text-sm leading-relaxed text-slate-700">
                                {renderMessageContent(msg.content)}
                             </div>
                             
                             {/* Citations (Trích dẫn nguồn) */}
                             {msg.citations && msg.citations.length > 0 && (
                               <div className="flex flex-wrap gap-2 mt-1">
                                  <div className="text-xs font-medium text-slate-500 mr-1 flex items-center">Nguồn:</div>
                                  {msg.citations.map((cite, idx) => (
                                    <Badge key={idx} variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 cursor-pointer flex items-center gap-1">
                                       <FileText className="h-3 w-3" /> {cite}
                                    </Badge>
                                  ))}
                               </div>
                             )}
                          </div>
                       </div>
                     )}
                   </div>
                 ))}

                 {/* AI Typing Indicator */}
                 {isTyping && (
                   <div className="flex gap-4 opacity-50 mt-6">
                      <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                         <Bot className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                         <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
                         <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                         <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                      </div>
                   </div>
                 )}
                 <div ref={chatEndRef} />
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
                        onKeyDown={handleKeyDown}
                        disabled={isTyping}
                      />
                      <Button 
                        size="icon" 
                        className={`absolute right-1.5 top-1.5 h-9 w-9 rounded-lg ${inputText.length > 0 && !isTyping ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        onClick={handleSendMessage}
                        disabled={isTyping || inputText.length === 0}
                      >
                        <Send className="h-4 w-4 ml-0.5" />
                      </Button>
                    </div>
                 </div>
                 <div className="flex justify-center mt-2 gap-4 text-[11px] text-slate-400">
                    <span className="cursor-pointer hover:text-indigo-500" onClick={() => setInputText('Pháp lý dự án Aqua đến đâu rồi?')}>💡 Gợi ý: "Pháp lý dự án Aqua đến đâu rồi?"</span>
                    <span className="cursor-pointer hover:text-indigo-500" onClick={() => setInputText('Bảng giá các căn đang mở bán?')}>"Bảng giá các căn đang mở bán?"</span>
                 </div>
              </div>

           </Card>
        </div>

      </div>
    </div>
  )
}
