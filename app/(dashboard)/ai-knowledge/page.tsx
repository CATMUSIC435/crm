"use client"
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  BrainCircuit, BookOpen, FileText, UploadCloud, 
  Search, Send, FileSpreadsheet, CheckCircle2, 
  RefreshCw, Bot, User, AlertCircle, FileArchive, Layers,
  Sparkles, Copy, Check, Share2, FileDown, ExternalLink,
  ShieldCheck, HelpCircle, Filter, Database, Cpu, Zap,
  Clock, ArrowRight, Trash2, Eye, MessageSquare, X
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { KnowledgeFile, AIChatMessage } from '@/types'

const getFileIcon = (type: string) => {
  switch (type) {
    case 'policy': return <FileText className="h-5 w-5 text-red-500" />
    case 'brochure': return <FileText className="h-5 w-5 text-indigo-500" />
    case 'price': return <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
    case 'law': return <BookOpen className="h-5 w-5 text-blue-500" />
    case 'faq': return <HelpCircle className="h-5 w-5 text-amber-500" />
    case 'planning': return <FileArchive className="h-5 w-5 text-orange-500" />
    default: return <FileText className="h-5 w-5 text-slate-500" />
  }
}

const getCategoryLabel = (type: string) => {
  switch (type) {
    case 'policy': return 'Chính sách bán hàng'
    case 'brochure': return 'Brochure giới thiệu'
    case 'price': return 'Bảng giá niêm yết'
    case 'law': return 'Pháp lý & Luật ĐĐ'
    case 'faq': return 'Hỏi đáp nghiệp vụ'
    case 'planning': return 'Quy hoạch 1/500'
    default: return 'Tài liệu khác'
  }
}

// Markdown Formatter for Assistant Responses
const renderMessageContent = (content: string) => {
  return content.split('\n').map((line, i) => {
    if (!line.trim()) return <div key={i} className="h-2"></div>
    
    // Markdown Table
    if (line.startsWith('|')) {
      const cells = line.split('|').filter(c => c.trim().length > 0)
      if (line.includes('---')) return null;
      return (
        <div key={i} className="grid grid-cols-3 gap-2 py-1.5 px-3 bg-slate-50 dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 text-xs my-0.5 font-mono">
          {cells.map((cell, idx) => (
            <span key={idx} className={idx === 0 ? "font-bold text-slate-800 dark:text-slate-200" : "text-slate-600 dark:text-slate-400"}>
              {cell.trim()}
            </span>
          ))}
        </div>
      )
    }

    // Bullet points
    if (line.startsWith('- ')) {
      return (
        <li 
          key={i} 
          className="ml-4 list-disc text-slate-700 dark:text-slate-300 text-xs sm:text-sm my-0.5 leading-relaxed" 
          dangerouslySetInnerHTML={{
            __html: line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-600 dark:text-indigo-400 font-bold">$1</strong>')
          }}
        />
      )
    }

    // Paragraph
    return (
      <p 
        key={i} 
        className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm my-1 leading-relaxed" 
        dangerouslySetInnerHTML={{
          __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-600 dark:text-indigo-400 font-bold">$1</strong>')
        }}
      />
    )
  })
}

export default function AIKnowledgePage() {
  const { knowledgeFiles, aiChatHistory, addKnowledgeFile, updateKnowledgeFileStatus, addAIChatMessage } = useStore()
  const customers = useStore(state => state.customers)
  const projects = useStore(state => state.projects)

  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>('ALL')
  const [activeFileCategory, setActiveFileCategory] = useState<string>('ALL')
  const [fileSearchQuery, setFileSearchQuery] = useState('')
  
  // Interactive Modals
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [citationModalOpen, setCitationModalOpen] = useState(false)
  const [selectedCitation, setSelectedCitation] = useState<any>(null)
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [memoSuccessToast, setMemoSuccessToast] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  // Upload Form State
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState<KnowledgeFile['type']>('policy')
  const [newFileProject, setNewFileProject] = useState('p2')

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiChatHistory, isTyping])

  // Quick Prompt Templates
  const quickPrompts = [
    { label: "So sánh chính sách", query: "So sánh chính sách thanh toán Aqua City và The Global City" },
    { label: "Tính dòng tiền vay", query: "Tính dòng tiền vay ngân hàng cho căn Shophouse 12 tỷ tại Aqua City" },
    { label: "Pháp lý Grand Manhattan", query: "Căn hộ Grand Manhattan có được cấp sổ hồng sở hữu lâu dài không?" },
    { label: "Tiềm năng NovaWorld", query: "Phân tích tiềm năng tăng giá NovaWorld Phan Thiết khi cao tốc Dầu Giây thông xe" },
    { label: "Chiết khấu 95%", query: "Chính sách chiết khấu thanh toán sớm 95% áp dụng mức bao nhiêu?" }
  ]

  // Filtered knowledge files
  const filteredFiles = useMemo(() => {
    return knowledgeFiles.filter(file => {
      const matchSearch = file.name.toLowerCase().includes(fileSearchQuery.toLowerCase())
      const matchCategory = activeFileCategory === 'ALL' || file.type === activeFileCategory
      return matchSearch && matchCategory
    })
  }, [knowledgeFiles, fileSearchQuery, activeFileCategory])

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputText
    if (!textToSend.trim() || isTyping) return
    
    // 1. Add User Message
    addAIChatMessage({
      role: 'user',
      content: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    
    const userText = textToSend.toLowerCase()
    if (!customText) setInputText('')
    setIsTyping(true)

    // 2. Advanced Real Estate RAG Processing Simulation
    setTimeout(() => {
      let aiResponse = ''
      let citations: string[] = []

      if (userText.includes('so sánh') && (userText.includes('aqua') || userText.includes('global'))) {
        aiResponse = `Dựa trên tài liệu CSBH chính thức của **Aqua City** và **The Global City** quý 3/2026:

| Tiêu Chí So Sánh | Aqua City (Đồng Nai) | The Global City (Thủ Đức) |
| :--- | :--- | :--- |
| **Loại hình chủ đạo** | Nhà phố, Biệt thự sinh thái | Shophouse SOHO, Căn hộ hạng sang |
| **Giá trung bình** | 65 - 90 Tr/m² | 120 - 180 Tr/m² |
| **Tiến độ thanh toán** | 3 - 5 năm (Đợt 1 chỉ 10%) | 2 - 3 năm (Hỗ trợ 0% LS 24 tháng) |
| **Chính sách vay** | MB/VPBank ân hạn 24 tháng | Techcombank/VietinBank ân hạn 24T |
| **Chiết khấu max** | Lên đến **14% + 300Tr nội thất** | Tối đa **10% khi thanh toán sớm** |

- **Khuyến nghị tư vấn**: Khách mua để ở sinh thái và tích sản an toàn nên chọn Aqua City; khách cần kinh doanh thương mại dòng tiền cao tại lõi TP. Thủ Đức nên chọn The Global City.`
        citations = ['Chinh_Sach_Ban_Hang_Aqua_T7.pdf', 'Brochure_TheGlobalCity_Masterise.pdf']

      } else if (userText.includes('vay') || userText.includes('12 tỷ') || userText.includes('dòng tiền')) {
        aiResponse = `Bảng tính phương án tài chính mẫu cho **Căn Shophouse 12.000.000.000 VNĐ**:

- **Vốn tự có (30%)**: **3.600.000.000 VNĐ** (Thanh toán làm 3 đợt trong 6 tháng).
- **Ngân hàng giải ngân (70%)**: **8.400.000.000 VNĐ** (Thời hạn vay 25 năm).
- **Chính sách ưu đãi CĐT**:
  - Hỗ trợ lãi suất **0% trong 24 tháng** kể từ ngày giải ngân đầu tiên.
  - Ân hạn nợ gốc toàn phần trong **24 tháng**.
  - Miễn phí trả nợ trước hạn trong thời gian hỗ trợ lãi suất.
- **Dòng tiền sau ưu đãi (Năm thứ 3)**:
  - Lãi suất ước tính: **9.5%/năm**.
  - Gốc trả hàng tháng: ~28.000.000 VNĐ.
  - Lãi trả hàng tháng cao nhất: ~66.500.000 VNĐ.
  - Tổng số tiền trả hàng tháng: **~94.500.000 VNĐ** (Giảm dần theo dư nợ thực tế).

- **Gợi ý**: Với shophouse cho thuê dự kiến 45 - 55 Tr/tháng, khách hàng chỉ cần bù thêm ~40 Tr/tháng từ năm thứ 3.`
        citations = ['Chinh_Sach_Ban_Hang_Aqua_T7.pdf', 'Bang_Gia_Tham_Khao_PhanKhu2.xlsx']

      } else if (userText.includes('grand manhattan') || userText.includes('sổ hồng') || userText.includes('lâu dài')) {
        aiResponse = `Về tính pháp lý và thời hạn sở hữu của dự án **The Grand Manhattan (Quận 1)**:

- **Hình thức sở hữu**:
  - Đối với công dân Việt Nam: **Sở hữu lâu dài (Sổ hồng vĩnh viễn)**.
  - Đối với người nước ngoài: **50 năm** theo quy định tại Luật Nhà ở hiện hành (được gia hạn theo luật định).
- **Hồ sơ pháp lý hoàn chỉnh**:
  - Quyết định phê duyệt 1/500: **Số 4125/QĐ-UBND**.
  - Giấy phép xây dựng số **08/GPXD** do Sở Xây Dựng TP.HCM cấp.
  - Văn bản đủ điều kiện bán nhà ở hình thành trong tương lai số **1254/SXD-QLN**.
- **Cam kết bàn giao**: Dự kiến bàn giao quý 2/2026 kèm gói nội thất chuẩn 5 sao khách sạn Avani.`
        citations = ['Luat_Kinh_Doanh_BDS_SuaDoi.pdf', 'Quy_Hoach_1_500_Dong_Nai.zip']

      } else if (userText.includes('novaworld') || userText.includes('tiềm năng') || userText.includes('cao tốc')) {
        aiResponse = `Phân tích tiềm năng sinh lời của **NovaWorld Phan Thiet** theo dữ liệu RAG:

- **Hạ tầng đòn bẩy đột phá**:
  - Cao tốc Dầu Giây - Phan Thiết đã thông xe, rút ngắn thời gian di chuyển từ TP.HCM còn **1 giờ 45 phút**.
  - Sân bay Phan Thiết đang thi công hoàn thiện đường cất hạ cánh.
- **Công suất khai thác du lịch**:
  - Tổ hợp Bikini Beach 16ha đón bình quân **15.000 - 25.000 lượt khách/cuối tuần**.
  - Sân Golf PGA 36 hố độc quyền tổ chức các giải đấu quốc tế.
- **Biên độ tăng giá ước tính**:
  - Tỷ suất sinh lời vốn (Capital Gain): **+18 - 25%/năm** trong giai đoạn 2026 - 2028.
  - Tỷ suất lợi nhuận cho thuê biệt thự biển (Rental Yield): **8.5 - 11%/năm** thông qua đơn vị vận hành quốc tế.`
        citations = ['Brochure_Du_An_AquaCity_2026.pdf', 'FAQ_Cau_Hoi_Thuong_Gap_Cho_Sale.docx']

      } else if (userText.includes('chiết khấu') || userText.includes('95%')) {
        aiResponse = `Tổng hợp chính sách chiết khấu thanh toán sớm **95%** đang có hiệu lực:

- **Chiết khấu thanh toán sớm 95%**: Giảm trực tiếp **12.0%** vào giá bán chưa VAT.
- **Ưu đãi Booking sớm (Early Bird)**: Chiết khấu thêm **2.0%**.
- **Chính sách khách hàng thân thiết (Novalty / VIP)**: Chiết khấu thêm **1.0% - 3.0%** tùy hạng thẻ Silver/Gold/Diamond.
- **Gói quà tặng nội thất**: Trừ trực tiếp **300.000.000 VNĐ** vào hợp đồng.

**Ví dụ thực tế**: Căn trị giá 10 tỷ VNĐ thanh toán 95% sẽ được trừ trực tiếp ~**1.4 tỷ VNĐ**, giá thực trả chỉ còn ~**8.3 tỷ VNĐ**.`
        citations = ['Chinh_Sach_Ban_Hang_Aqua_T7.pdf', 'FAQ_Cau_Hoi_Thuong_Gap_Cho_Sale.docx']

      } else {
        aiResponse = `Cảm ơn bạn đã truy vấn trợ lý AI. Dựa trên tài liệu hệ thống đã học (${knowledgeFiles.length} tài liệu):

- Yêu cầu của bạn về "${textToSend}" đã được tra cứu qua vector embeddings.
- Hệ thống ghi nhận các phân khu hiện hữu đang có tỷ lệ hấp thụ trên **85%**.
- Để có bảng báo giá chi tiết và phương án dòng tiền cá nhân hóa theo từng mã căn, bạn có thể nhập thêm mã căn (VD: \`NVW-01.01\` hoặc \`AQC-02.05\`).`
        citations = ['FAQ_Cau_Hoi_Thuong_Gap_Cho_Sale.docx']
      }

      addAIChatMessage({
        role: 'ai',
        content: aiResponse,
        citations,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
      setIsTyping(false)
    }, 1200)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  const handleUploadFileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFileName.trim()) return

    const newId = Date.now()
    addKnowledgeFile({
      id: newId,
      name: newFileName.endsWith('.pdf') ? newFileName : `${newFileName}.pdf`,
      type: newFileType,
      status: 'learning',
      size: `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      date: 'Vừa tải lên'
    })

    setUploadModalOpen(false)
    setNewFileName('')

    // Simulate Vector Embedding indexing
    setTimeout(() => {
      updateKnowledgeFileStatus(newId, 'learned')
    }, 2500)
  }

  const handleCopyText = (text: string, id: number) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  const handleOpenCitation = (cite: string) => {
    setSelectedCitation({
      name: cite,
      pages: 'Trang 12 - 16 / 48',
      similarity: '96.8% (Cosine Distance: 0.032)',
      extractedSnippet: `Căn cứ theo Quyết định số 3671/QĐ-UBND và văn bản chấp thuận chủ trương đầu tư, chủ đầu tư cam kết bảo lãnh tiến độ và ban hành chính sách hỗ trợ lãi suất tối đa 24 tháng cho khách hàng ký hợp đồng trong đợt mở bán này.`
    })
    setCitationModalOpen(true)
  }

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      
      {/* 1. Header with Strategic AI Metrics */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <BrainCircuit className="h-6 w-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Trợ Lý AI Chuyên Sâu BĐS & Kho Tri Thức RAG
            </h1>
            <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs">
              RAG Copilot Active
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hỏi đáp chính sách bán hàng, bảng tính dòng tiền ngân hàng, thẩm định pháp lý 1/500 và so sánh dự án có trích dẫn nguồn chuẩn xác.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setExportModalOpen(true)}
            className="flex-1 sm:flex-initial border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 hover:bg-indigo-50 font-semibold gap-1.5"
          >
            <FileDown className="h-4 w-4" />
            Xuất Biên Bản Tư Vấn
          </Button>

          <Button 
            size="sm"
            onClick={() => setUploadModalOpen(true)}
            className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-sm"
          >
            <UploadCloud className="h-4 w-4" />
            Nạp Tài Liệu Tri Thức
          </Button>
        </div>
      </div>

      {/* 2. Top 4 High-Tech AI RAG KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Vector Embeddings</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">12.450 Chunks</div>
            <p className="text-xs text-indigo-600 flex items-center gap-1 font-medium">
              <Database className="h-3.5 w-3.5" /> pgvector / HNSW Indexed
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-2xl">
            <Cpu className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Độ Tin Cậy Dữ Liệu</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">98.6% Chuẩn Xác</div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              Không sinh ảo giác (Hallucination Safe)
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-2xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trích Dẫn Nguồn</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">100% Nguồn Gốc</div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
              Liên kết số trang & văn bản pháp lý
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-2xl">
            <BookOpen className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tốc Độ Phản Hồi</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">&lt; 1.2 Giây</div>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
              Hybrid Keyword + Semantic Search
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-2xl">
            <Zap className="h-6 w-6" />
          </div>
        </Card>
      </div>

      {/* 3. Main Workspace: Knowledge Base Explorer (Left 4 cols) & AI Copilot Chat (Right 8 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 flex-1 min-h-[640px]">
        
        {/* CỘT TRÁI: KHO DỮ LIỆU NGUỒN (4/12) */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <Card className="shadow-xs flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden min-h-[550px]">
            
            {/* Knowledge Header */}
            <CardHeader className="p-4 pb-3 border-b bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
              <div className="flex justify-between items-center mb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  <Database className="h-4 w-4 text-indigo-600" />
                  Kho Tri Thức (Knowledge Base)
                </CardTitle>
                <Badge variant="secondary" className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-mono">
                  {knowledgeFiles.length} Tài Liệu
                </Badge>
              </div>

              {/* Search in Knowledge Base */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Tìm tài liệu, thông tư, CSBH..." 
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800" 
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { id: 'ALL', label: 'Tất cả' },
                  { id: 'policy', label: 'CSBH' },
                  { id: 'price', label: 'Bảng giá' },
                  { id: 'law', label: 'Pháp lý' },
                  { id: 'planning', label: '1/500' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveFileCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      activeFileCategory === cat.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </CardHeader>
            
            {/* File List Area */}
            <CardContent className="p-0 overflow-y-auto flex-1 max-h-[500px] divide-y divide-slate-100 dark:divide-slate-800">
              {filteredFiles.map(file => (
                <div key={file.id} className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 group">
                  <div className="h-9 w-9 bg-slate-100 dark:bg-slate-800 rounded-xl border flex items-center justify-center shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors" title={file.name}>
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">{getCategoryLabel(file.type)}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                      <span>•</span>
                      <span>{file.date}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    {file.status === 'learned' && (
                      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] py-0 px-1.5 flex items-center gap-1">
                        <CheckCircle2 className="h-2.5 w-2.5"/> Đã Nhúng
                      </Badge>
                    )}
                    {file.status === 'learning' && (
                      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 text-[10px] py-0 px-1.5 flex items-center gap-1">
                        <RefreshCw className="h-2.5 w-2.5 animate-spin"/> Đang Học
                      </Badge>
                    )}
                    {file.status === 'error' && (
                      <Badge variant="destructive" className="text-[10px] py-0 px-1.5 flex items-center gap-1">
                        <AlertCircle className="h-2.5 w-2.5"/> Lỗi Parse
                      </Badge>
                    )}
                  </div>
                </div>
              ))}

              {filteredFiles.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Không tìm thấy tài liệu phù hợp trong kho tri thức.
                </div>
              )}
            </CardContent>
            
            {/* Quick Upload Action Footer */}
            <div className="p-3 border-t bg-slate-50 dark:bg-slate-900/50 shrink-0 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Đồng bộ tự động định kỳ 6 giờ/lần</span>
              <button 
                onClick={() => setUploadModalOpen(true)}
                className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-[11px] flex items-center gap-1"
              >
                + Thêm tài liệu
              </button>
            </div>
          </Card>
        </div>

        {/* CỘT PHẢI: AI COPILOT CHAT WORKSPACE (8/12) */}
        <div className="xl:col-span-8 flex flex-col">
          <Card className="shadow-md flex-1 flex flex-col bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl overflow-hidden min-h-[580px]">
            
            {/* Chat Workspace Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                  <Bot className="h-6 w-6 text-indigo-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base leading-tight">NovaCopilot BĐS</h2>
                    <Badge className="bg-emerald-500 text-white text-[10px] py-0 px-1.5">v3.5 RAG</Badge>
                  </div>
                  <p className="text-xs text-indigo-200 mt-0.5 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Đã nạp {knowledgeFiles.filter(f => f.status === 'learned').length} tài liệu • Trực tuyến 24/7
                  </p>
                </div>
              </div>

              {/* Mode / Reset Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    if (confirm("Làm mới đoạn hội thoại tư vấn?")) {
                      window.location.reload()
                    }
                  }}
                  className="text-indigo-200 hover:text-white hover:bg-white/10 text-xs h-8 gap-1"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Làm mới Chat
                </Button>
              </div>
            </div>

            {/* Chat Messages Display Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40 dark:bg-slate-950/40 max-h-[500px]">
              
              <div className="flex justify-center mb-4">
                <Badge variant="outline" className="bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 px-3 py-1 text-[11px]">
                  Phiên tư vấn hôm nay • Tự động mã hóa bảo mật E2EE
                </Badge>
              </div>

              {aiChatHistory.map(msg => (
                <div key={msg.id}>
                  {msg.role === 'user' ? (
                    <div className="flex gap-3 flex-row-reverse animate-in slide-in-from-right-2">
                      <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-indigo-600 text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-xs max-w-[85%] sm:max-w-[75%] shadow-sm text-xs sm:text-sm leading-relaxed">
                        {msg.content}
                        <div className="text-[10px] text-indigo-200 text-right mt-1.5">{msg.time}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3 animate-in slide-in-from-left-2">
                      <div className="h-8 w-8 bg-slate-900 dark:bg-indigo-950 border border-indigo-400/40 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-1">
                        <Bot className="h-4 w-4 text-indigo-400" />
                      </div>
                      
                      <div className="flex flex-col gap-2 max-w-[92%] sm:max-w-[85%]">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl rounded-tl-xs shadow-xs text-xs sm:text-sm leading-relaxed">
                          {renderMessageContent(msg.content)}
                          
                          {/* Action Toolbar on AI Message */}
                          <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                            <div className="text-slate-400 flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-indigo-500" />
                              <span>AI RAG Verified</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleCopyText(msg.content, msg.id)}
                                className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                                <span>{copiedId === msg.id ? 'Đã chép' : 'Sao chép'}</span>
                              </button>
                              
                              <button
                                onClick={() => alert("Đã chuẩn bị nội dung câu trả lời để gửi qua Zalo cho khách hàng!")}
                                className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Share2 className="h-3 w-3" />
                                <span>Gửi Zalo</span>
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        {/* Citations Block (Trích dẫn tài liệu nguồn) */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                              <BookOpen className="h-3 w-3" /> Trích dẫn:
                            </span>
                            {msg.citations.map((cite, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleOpenCitation(cite)}
                                className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-medium hover:bg-indigo-100 flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <FileText className="h-3 w-3" />
                                <span className="truncate max-w-[180px]">{cite}</span>
                              </button>
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
                <div className="flex gap-3 animate-in fade-in-50">
                  <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl rounded-tl-xs shadow-xs flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600 animate-spin" />
                    <span className="text-xs text-slate-500">Đang quét vector tri thức & trích dẫn văn bản...</span>
                    <div className="flex gap-1 ml-1">
                      <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                      <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Gợi ý câu hỏi:</span>
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.query)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-2xs whitespace-nowrap cursor-pointer transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
              <div className="relative flex items-center">
                <Input 
                  placeholder="Hỏi AI về chính sách chiết khấu, tiến độ thanh toán, pháp lý 1/500, ngân hàng vay..." 
                  className="pl-4 pr-24 py-5 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500 rounded-xl text-xs sm:text-sm"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                />
                
                <div className="absolute right-1.5 flex items-center gap-1">
                  <Button 
                    size="sm"
                    className={`h-8 px-3 rounded-lg font-bold text-xs ${
                      inputText.trim().length > 0 && !isTyping 
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                    onClick={() => handleSendMessage()}
                    disabled={isTyping || !inputText.trim()}
                  >
                    <Send className="h-3.5 w-3.5 mr-1" />
                    Gửi
                  </Button>
                </div>
              </div>
            </div>

          </Card>
        </div>

      </div>

      {/* 4. MODAL 1: Tải Lên & Nhúng Tri Thức Mới */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-200">
            <div className="p-4 sm:p-5 border-b flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Nạp Tài Liệu Vào Kho Tri Thức RAG</h3>
                  <p className="text-xs text-slate-500">Tự động phân tách Chunks và nhúng Embeddings</p>
                </div>
              </div>
              <button onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUploadFileSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Tên tài liệu / Văn bản:</label>
                <Input 
                  placeholder="VD: Chinh_Sach_Ban_Hang_Vinhomes_Q3_2026.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  required
                  className="text-xs h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Phân loại tài liệu:</label>
                  <select 
                    value={newFileType} 
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs"
                  >
                    <option value="policy">Chính sách bán hàng (CSBH)</option>
                    <option value="price">Bảng giá niêm yết (Price)</option>
                    <option value="law">Pháp lý & Quyết định 1/500</option>
                    <option value="brochure">Brochure sản phẩm</option>
                    <option value="faq">Bộ câu hỏi nghiệp vụ FAQ</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Dự án liên kết:</label>
                  <select 
                    value={newFileProject} 
                    onChange={(e) => setNewFileProject(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag Drop Mockup */}
              <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-indigo-50/30 dark:bg-indigo-950/20">
                <UploadCloud className="h-8 w-8 text-indigo-600 mb-2" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">Kéo thả tệp PDF, DOCX, XLSX vào đây</span>
                <span className="text-[11px] text-slate-400 mt-0.5">Dung lượng tối đa 50MB mỗi tệp • Hỗ trợ bóc tách OCR tự động</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setUploadModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Xác Nhận & Vectorize
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL 2: Trích Xuất Chi Tiết Tài Liệu Nguồn (Citation Inspector) */}
      {citationModalOpen && selectedCitation && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-200">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs">{selectedCitation.name}</h3>
                  <p className="text-[11px] text-slate-500">Đối chiếu trích dẫn nguồn RAG</p>
                </div>
              </div>
              <button onClick={() => setCitationModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                  <span className="text-slate-400 block text-[10px]">Vị trí trang</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedCitation.pages}</span>
                </div>
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border">
                  <span className="text-slate-400 block text-[10px]">Độ tương đồng ngữ nghĩa</span>
                  <span className="font-bold text-emerald-600">{selectedCitation.similarity}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold block text-[11px]">Đoạn văn trích xuất nguyên gốc:</span>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                  "{selectedCitation.extractedSnippet}"
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  size="sm"
                  onClick={() => setCitationModalOpen(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL 3: Xuất Biên Bản Tư Vấn Khách Hàng */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-200">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileDown className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Xuất Báo Cáo Tư Vấn (PDF / DOCX)</h3>
              </div>
              <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Khách hàng nhận báo cáo:</label>
                <select className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs">
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone}) - {c.rank}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-slate-600 dark:text-slate-300 space-y-1 text-[11px]">
                <div className="font-bold text-indigo-700 dark:text-indigo-400">Báo cáo bao gồm:</div>
                <div>• Toàn bộ lịch sử giải đáp chính sách bán hàng và chiết khấu.</div>
                <div>• Bảng đối chiếu tiến độ thanh toán & phương án tài chính ngân hàng.</div>
                <div>• Trích lục pháp lý 1/500 và chữ ký số điện tử của chuyên viên.</div>
              </div>

              {memoSuccessToast && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Đã tạo file Báo Cáo Tư Vấn PDF thành công!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExportModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    setMemoSuccessToast(true)
                    setTimeout(() => {
                      setMemoSuccessToast(false)
                      setExportModalOpen(false)
                    }, 1500)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Tải Về PDF Có Mộc
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
