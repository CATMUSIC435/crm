"use client"
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { ListingCardData } from '@/types'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Hash, Plus, MessageCircle, MoreVertical, 
  Phone, Video, Paperclip, Mic, Smile, Send, 
  FileText, Download, VideoOff, MicOff, Maximize, Share2,
  CheckCheck, Check, Image as ImageIcon, Building2, ExternalLink,
  X, ChevronRight, Filter, Sparkles, Clock, Bot, Zap, Users,
  PhoneCall, ArrowUpRight, Tag, ShieldAlert, FileSpreadsheet,
  AlertCircle, Calendar, UserPlus, Bookmark, Eye, CheckCircle2,
  MessageSquare, Radio, HelpCircle, Layers, Copy, Trash2
} from 'lucide-react'

// Mẫu tin nhắn nhanh CSKH BĐS
const QUICK_TEMPLATES = [
  {
    id: 'tmpl-1',
    category: 'greeting',
    categoryName: 'Lời chào mở đầu',
    title: 'Chào đón khách quan tâm Zalo OA',
    content: 'Dạ em chào Quý khách! Em là chuyên viên tư vấn cao cấp phụ trách dự án. Rất hân hạnh được hỗ trợ Quý khách thông tin bảng giá và chính sách ưu đãi mới nhất hôm nay ạ!'
  },
  {
    id: 'tmpl-2',
    category: 'quote',
    categoryName: 'Báo giá & Chiết khấu',
    title: 'Gửi bảng tính chiết khấu 14%',
    content: 'Dạ em xin gửi Quý khách bảng tính dòng tiền chi tiết kèm chính sách chiết khấu 14% thanh toán nhanh. Đợt này CĐT đang hỗ trợ thêm gói quà tặng nội thất trị giá 300 triệu đồng ạ.'
  },
  {
    id: 'tmpl-3',
    category: 'appointment',
    categoryName: 'Hẹn xem sa bàn',
    title: 'Mời trải nghiệm sa bàn cuối tuần',
    content: 'Thứ Bảy này lúc 09:00 sáng bên em có tổ chức buổi trải nghiệm sa bàn thực tế và tham quan nhà mẫu tại Novaland Gallery. Em xin phép đón Quý khách tại sảnh VIP nhé ạ!'
  },
  {
    id: 'tmpl-4',
    category: 'bank',
    categoryName: 'Tài khoản nộp cọc CĐT',
    title: 'Số tài khoản phong tỏa CĐT Novaland',
    content: 'Thông tin tài khoản nhận cọc CĐT Novaland:\n- Ngân hàng: Vietcombank - CN TP.HCM\n- Số TK: 0071009988776\n- Chủ TK: CONG TY CO PHAN TAP DOAN DAU TU DIA OC NOVA\n- Nội dung: [Họ tên] [SĐT] Dat coc can [Mã căn]'
  },
  {
    id: 'tmpl-5',
    category: 'bank',
    categoryName: 'Chính sách vay ưu đãi 0%',
    title: 'Gói vay 0% lãi suất 24 tháng',
    content: 'Chính sách vay ngân hàng bảo lãnh Vietcombank / MBBank:\n- Hỗ trợ vay tối đa 70% giá trị hợp đồng.\n- Lãi suất 0% và ân hạn nợ gốc trong 24 tháng.\n- Miễn phí trả nợ trước hạn từ năm thứ 3.'
  },
  {
    id: 'tmpl-6',
    category: 'reengage',
    categoryName: 'Tái kích hoạt khách',
    title: 'Cập nhật giỏ hàng độc quyền mới unlock',
    content: 'Dạ anh/chị ơi, giỏ hàng ngoại giao vừa unlock 2 căn view sông cực đẹp đúng tầm tài chính của mình với mức giá rất tốt. Em xin gửi thông tin chi tiết qua để anh/chị tham khảo trước nhé ạ!'
  }
];

// Danh sách sản phẩm BĐS mẫu để đính kèm
const MOCK_LISTINGS: ListingCardData[] = [
  {
    id: 'lst-1',
    code: 'AQC-PH-102',
    projectName: 'Aqua City - Đảo Phượng Hoàng',
    price: '14.500.000.000 VNĐ',
    area: '220 m²',
    bedrooms: 4,
    bathrooms: 4,
    status: 'Còn trống',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    direction: 'Đông Nam view sông Đồng Nai',
    commission: 'Hoa hồng 3.0% (435 Triệu)'
  },
  {
    id: 'lst-2',
    code: 'TGM-15.01',
    projectName: 'The Grand Manhattan - Quận 1',
    price: '15.200.000.000 VNĐ',
    area: '89 m²',
    bedrooms: 2,
    bathrooms: 2,
    status: 'Đang giữ chỗ',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
    direction: 'Đông Bắc view công viên 23/9',
    commission: 'Hoa hồng 2.5% (380 Triệu)'
  },
  {
    id: 'lst-3',
    code: 'NVW-FL-205',
    projectName: 'NovaWorld Phan Thiet - Florida',
    price: '8.200.000.000 VNĐ',
    area: '120 m²',
    bedrooms: 3,
    bathrooms: 3,
    status: 'Còn trống',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&auto=format&fit=crop&q=80',
    direction: 'Nam view biển & công viên Bikini Beach',
    commission: 'Hoa hồng 3.5% (287 Triệu)'
  },
  {
    id: 'lst-4',
    code: 'BE1-12.08',
    projectName: 'The Beverly - Vinhomes Grand Park',
    price: '3.350.000.000 VNĐ',
    area: '72 m²',
    bedrooms: 2,
    bathrooms: 2,
    status: 'Còn trống',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    direction: 'Tây Nam view đại công viên 36ha',
    commission: 'Hoa hồng 2.0% (67 Triệu)'
  }
];

export default function ChatPage() {
  const { 
    chatChannels, 
    chatDMs, 
    chatMessages, 
    sendMessage, 
    addChatChannel, 
    markThreadRead, 
    simulateCustomerReply,
    addTask 
  } = useStore()

  // State quản lý luồng hội thoại
  const [activeThreadId, setActiveThreadId] = useState<string>(chatChannels[0]?.id || 'c1')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'channel' | 'internal' | 'zalo'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [message, setMessage] = useState('')
  const [showRightPanel, setShowRightPanel] = useState(true)
  const [userStatus, setUserStatus] = useState<'online' | 'busy' | 'away'>('online')

  // Modals
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isVideoCamOff, setIsVideoCamOff] = useState(false)
  
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false)
  const [newChannelData, setNewChannelData] = useState({
    name: '',
    description: '',
    category: 'project' as 'project' | 'department' | 'management',
    topic: ''
  })

  const [showAttachListingModal, setShowAttachListingModal] = useState(false)
  const [listingSearch, setListingSearch] = useState('')

  const [showQuickTemplatesModal, setShowQuickTemplatesModal] = useState(false)
  const [templateCategory, setTemplateCategory] = useState<string>('all')

  const [showForwardTaskModal, setShowForwardTaskModal] = useState(false)
  const [forwardTaskForm, setForwardTaskForm] = useState({
    title: '',
    assignee: 'Lê Hoàng Anh',
    priority: 'high' as 'low' | 'medium' | 'high',
    due: 'Hôm nay 17:00',
    notes: ''
  })

  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false)
  const [aiBotEnabled, setAiBotEnabled] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Trigger Toast Notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Active channel / DM objects
  const activeChannel = chatChannels.find(c => c.id === activeThreadId)
  const activeDM = chatDMs.find(d => d.id === activeThreadId)
  const isCustomerZalo = activeDM?.type === 'zalo' || activeDM?.type === 'livechat'

  // Filter messages by active thread
  const currentMessages = useMemo(() => {
    return chatMessages.filter(m => m.threadId === activeThreadId)
  }, [chatMessages, activeThreadId])

  // Count unread
  const totalUnreadChannels = chatChannels.reduce((sum, c) => sum + (c.unread || 0), 0)
  const totalUnreadDMs = chatDMs.reduce((sum, d) => sum + (d.unread || 0), 0)
  const totalUnread = totalUnreadChannels + totalUnreadDMs

  // Auto-scroll when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages, activeThreadId])

  // Mark active thread as read
  useEffect(() => {
    if (activeThreadId) {
      markThreadRead(activeThreadId)
    }
  }, [activeThreadId, markThreadRead])

  // Send text message
  const handleSend = () => {
    if (!message.trim() || !activeThreadId) return
    sendMessage(activeThreadId, message.trim())
    setMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Quick Action: Send listing card
  const handleSendListing = (listing: ListingCardData) => {
    sendMessage(activeThreadId, `[Sản Phẩm Đính Kèm] ${listing.code} - ${listing.projectName}`, {
      msgType: 'listing',
      listing
    })
    setShowAttachListingModal(false)
    triggerToast(`Đã đính kèm căn ${listing.code} vào đoạn hội thoại!`)
  }

  // Quick Action: Send template message
  const handleApplyTemplate = (tmplContent: string, directSend: boolean = false) => {
    if (directSend) {
      sendMessage(activeThreadId, tmplContent, { msgType: 'text' })
      triggerToast('Đã gửi mẫu tin nhắn phản hồi nhanh!')
    } else {
      setMessage(tmplContent)
      triggerToast('Đã chèn nội dung mẫu vào ô soạn thảo!')
    }
    setShowQuickTemplatesModal(false)
  }

  // Quick Action: Attach File simulation
  const handleSimulateAttachFile = () => {
    const fileList = [
      { name: 'Bang_Tinh_Lai_Vay_AquaCity_T7.pdf', size: '2.1 MB' },
      { name: 'Mat_Bang_Can_Ho_2PN_TGM.png', size: '3.8 MB' },
      { name: 'Chinh_Sach_Ban_Hang_Novaworld_2026.pdf', size: '1.4 MB' }
    ]
    const chosen = fileList[Math.floor(Math.random() * fileList.length)]
    sendMessage(activeThreadId, `Đã gửi tài liệu: ${chosen.name}`, {
      isFile: true,
      fileName: chosen.name,
      fileSize: chosen.size,
      msgType: 'file'
    })
    triggerToast(`Đã tải lên và gửi tệp ${chosen.name}!`)
  }

  // Quick Action: Send Voice Note simulation
  const handleSendVoiceNote = () => {
    sendMessage(activeThreadId, '🎙️ Tin nhắn thoại ghi âm (0:38 giây) - [Bấm để nghe phát]', {
      msgType: 'text'
    })
    triggerToast('Đã gửi tin nhắn thoại!')
  }

  // Quick Action: Insert Emoji
  const handleInsertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji)
  }

  // Trigger Simulated Customer / Colleague Reply
  const handleTriggerReply = () => {
    simulateCustomerReply(activeThreadId)
    triggerToast('⚡ Phản hồi giả lập vừa được gửi vào hội thoại!')
  }

  // Create Channel Submit
  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChannelData.name.trim()) return
    addChatChannel(newChannelData)
    setShowCreateChannelModal(false)
    setNewChannelData({ name: '', description: '', category: 'project', topic: '' })
    triggerToast(`Đã khởi tạo kênh thảo luận mới thành công!`)
  }

  // Create Task from chat
  const handleCreateTaskFromChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forwardTaskForm.title.trim()) return
    addTask(forwardTaskForm.title, forwardTaskForm.assignee)
    setShowForwardTaskModal(false)
    triggerToast(`Đã tạo nhiệm vụ "${forwardTaskForm.title}" và gán cho ${forwardTaskForm.assignee}!`)
  }

  // Export CSV
  const handleExportCSV = () => {
    const threadMsgs = chatMessages.filter(m => m.threadId === activeThreadId)
    const threadTitle = activeChannel ? activeChannel.name : (activeDM?.name || 'chat_transcript')
    
    const headers = ['ID', 'Thời Gian', 'Người Gửi', 'Loại Tin', 'Nội Dung', 'Trạng Thái']
    const rows = threadMsgs.map(m => [
      `"${m.id}"`,
      `"${m.time}"`,
      `"${m.senderName}"`,
      `"${m.msgType || (m.isFile ? 'file' : 'text')}"`,
      `"${m.text.replace(/"/g, '""')}"`,
      `"${m.isRead ? 'Đã xem' : 'Chưa xem'}"`
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Lich_Su_Hoi_Thoai_${threadTitle}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    triggerToast('Đã xuất lịch sử hội thoại chuẩn UTF-8 BOM thành công!')
  }

  // Filtered thread list
  const filteredChannels = useMemo(() => {
    return chatChannels.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
      if (!matchSearch) return false
      if (categoryFilter === 'all') return true
      if (categoryFilter === 'channel') return true
      return false
    })
  }, [chatChannels, searchQuery, categoryFilter])

  const filteredDMs = useMemo(() => {
    return chatDMs.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.lastMessage && d.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (d.phone && d.phone.includes(searchQuery))
      if (!matchSearch) return false

      if (categoryFilter === 'all') return true
      if (categoryFilter === 'internal') return d.type === 'internal'
      if (categoryFilter === 'zalo') return d.type === 'zalo' || d.type === 'livechat'
      return false
    })
  }, [chatDMs, searchQuery, categoryFilter])

  return (
    <div className="space-y-4">
      
      {/* TOAST NOTIFICATION FLOATING */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <Button variant="ghost" size="icon" onClick={() => setToastMessage(null)} className="h-6 w-6 text-slate-400 hover:text-white ml-2">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* HEADER & EXECUTIVE STRATEGY COCKPIT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 rounded-2xl text-white shadow-lg border border-indigo-800/40">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-indigo-600/30 border border-indigo-500/40 rounded-xl backdrop-blur-md">
              <MessageCircle className="h-6 w-6 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Kênh Trò Chuyện & Zalo OA</h1>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs px-2.5 py-0.5 font-bold">
              Omnichannel Real-Time
            </Badge>
          </div>
          <p className="text-sm text-indigo-200/80">
            Trung tâm tương tác đa kênh: Thảo luận nội bộ dự án, phối hợp liên phòng ban và chăm sóc khách hàng VIP qua Zalo OA.
          </p>
        </div>

        {/* Header Action Tools */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Switcher */}
          <div className="flex items-center bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span className={`w-2.5 h-2.5 rounded-full mr-2 ${userStatus === 'online' ? 'bg-emerald-400 animate-pulse' : userStatus === 'busy' ? 'bg-amber-400' : 'bg-slate-400'}`} />
            <select 
              value={userStatus} 
              onChange={(e) => {
                setUserStatus(e.target.value as any)
                triggerToast(`Đã chuyển trạng thái sang: ${e.target.value === 'online' ? 'Trực tuyến' : e.target.value === 'busy' ? 'Bận tiếp khách' : 'Ngoại tuyến'}`)
              }}
              className="bg-transparent text-white outline-none cursor-pointer text-xs font-bold"
            >
              <option value="online" className="bg-slate-900">🟢 Trực tuyến</option>
              <option value="busy" className="bg-slate-900">🟡 Bận tiếp khách</option>
              <option value="away" className="bg-slate-900">⚪ Ngoại tuyến</option>
            </select>
          </div>

          <Button 
            onClick={() => setShowQuickTemplatesModal(true)}
            variant="outline" 
            className="border-indigo-400/40 bg-indigo-950/50 hover:bg-indigo-900 text-indigo-200 text-xs font-bold h-9"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-amber-400" />
            Mẫu Tin Nhanh
          </Button>

          <Button 
            onClick={() => setShowCreateChannelModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-9 shadow-md shadow-indigo-600/30"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            + Kênh Mới
          </Button>

          <Button 
            onClick={handleExportCSV}
            variant="ghost" 
            className="text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold h-9"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* 4 STRATEGY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tin Chưa Đọc</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 flex items-baseline gap-2">
              {totalUnread}
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ({totalUnreadChannels} kênh, {totalUnreadDMs} DM)
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Ưu tiên xử lý khách Zalo OA nóng</p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Radio className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tốc Độ Phản Hồi (FRT)</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 flex items-baseline gap-2">
              1.8 Phút
              <span className="text-xs font-bold text-emerald-600">SLA &lt; 3p</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Tăng tốc độ chốt deal 34%</p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Khách Đang Chat Zalo</span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1 flex items-baseline gap-2">
              14 Khách
              <span className="text-xs font-semibold text-blue-600">4 VIP Diamond</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Đang theo sát căn hộ & biệt thự</p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-xl text-blue-600 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Giải Quyết Đầu Tiên (FCR)</span>
            <div className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1 flex items-baseline gap-2">
              89.2%
              <span className="text-xs font-bold text-emerald-600">+5.4%</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">Kịch bản báo giá & sa bàn tức thì</p>
          </div>
          <div className="p-3 bg-violet-50 dark:bg-violet-950/60 rounded-xl text-violet-600 dark:text-violet-400">
            <Zap className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* MAIN CHAT APPLICATION CONTAINER */}
      <div className="flex h-[calc(100vh-16rem)] min-h-[600px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm bg-background">
        
        {/* ======================================================== */}
        {/* CỘT 1: DANH SÁCH LUỒNG HỘI THOẠI (LEFT SIDEBAR) */}
        {/* ======================================================== */}
        <div className="w-80 md:w-88 bg-slate-50/70 dark:bg-slate-950/70 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0">
          
          {/* Search Box */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tin nhắn, khách, mã căn..." 
                className="pl-9 h-9 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 no-scrollbar">
              <Button 
                size="sm"
                onClick={() => setCategoryFilter('all')}
                variant={categoryFilter === 'all' ? 'default' : 'ghost'}
                className={`h-7 px-2.5 text-[11px] rounded-lg font-bold ${categoryFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200/60'}`}
              >
                Tất cả
              </Button>
              <Button 
                size="sm"
                onClick={() => setCategoryFilter('channel')}
                variant={categoryFilter === 'channel' ? 'default' : 'ghost'}
                className={`h-7 px-2.5 text-[11px] rounded-lg font-bold ${categoryFilter === 'channel' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200/60'}`}
              >
                # Kênh ({chatChannels.length})
              </Button>
              <Button 
                size="sm"
                onClick={() => setCategoryFilter('zalo')}
                variant={categoryFilter === 'zalo' ? 'default' : 'ghost'}
                className={`h-7 px-2.5 text-[11px] rounded-lg font-bold ${categoryFilter === 'zalo' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200/60'}`}
              >
                Zalo OA ({chatDMs.filter(d => d.type === 'zalo').length})
              </Button>
              <Button 
                size="sm"
                onClick={() => setCategoryFilter('internal')}
                variant={categoryFilter === 'internal' ? 'default' : 'ghost'}
                className={`h-7 px-2.5 text-[11px] rounded-lg font-bold ${categoryFilter === 'internal' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-200/60'}`}
              >
                Đồng nghiệp
              </Button>
            </div>
          </div>

          {/* Thread List Scrollable */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-4">
            
            {/* NHÓM 1: KÊNH DỰ ÁN & PHÒNG BAN */}
            {(categoryFilter === 'all' || categoryFilter === 'channel') && filteredChannels.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Hash className="h-3.5 w-3.5 text-indigo-500" /> Kênh Thảo Luận Dự Án
                  </span>
                  <Button 
                    onClick={() => setShowCreateChannelModal(true)} 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 text-slate-500 hover:text-indigo-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {filteredChannels.map(ch => {
                    const isSelected = activeThreadId === ch.id
                    return (
                      <div 
                        key={ch.id} 
                        onClick={() => setActiveThreadId(ch.id)}
                        className={`group flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' 
                            : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'}`}>
                          <Hash className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate">#{ch.name}</span>
                            {ch.unread > 0 && (
                              <Badge className={`${isSelected ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'} text-[10px] h-4 px-1.5 font-bold`}>
                                {ch.unread}
                              </Badge>
                            )}
                          </div>
                          <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-muted-foreground'}`}>
                            {ch.topic || ch.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* NHÓM 2: KHÁCH HÀNG ZALO OA & LIVECHAT */}
            {(categoryFilter === 'all' || categoryFilter === 'zalo') && (
              <div>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-blue-500" /> Khách Hàng Zalo OA
                  </span>
                  <Badge className="bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                    Webhook Live
                  </Badge>
                </div>
                <div className="space-y-1">
                  {filteredDMs.filter(d => d.type === 'zalo' || d.type === 'livechat').map(dm => {
                    const isSelected = activeThreadId === dm.id
                    return (
                      <div 
                        key={dm.id} 
                        onClick={() => setActiveThreadId(dm.id)}
                        className={`group flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold' 
                            : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="relative shrink-0 mt-0.5">
                          <Avatar className="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-700">
                            <AvatarFallback className={`${isSelected ? 'bg-white text-blue-700' : 'bg-blue-100 text-blue-800'} text-xs font-bold rounded-xl`}>
                              {dm.avatar}
                            </AvatarFallback>
                          </Avatar>
                          {dm.online && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="text-xs font-bold truncate">{dm.name}</span>
                            </div>
                            <span className={`text-[10px] font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                              {dm.lastTime || 'Vừa xong'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Badge className={`text-[9px] px-1 py-0 h-3.5 border-none font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/70 dark:text-blue-300'
                            }`}>
                              {dm.type === 'zalo' ? 'Zalo OA' : 'LiveChat'}
                            </Badge>
                            {dm.projectName && (
                              <span className={`text-[10px] truncate ${isSelected ? 'text-blue-100' : 'text-slate-500 font-medium'}`}>
                                • {dm.projectName}
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] truncate mt-1 ${isSelected ? 'text-blue-100' : 'text-muted-foreground'}`}>
                            {dm.lastMessage || 'Chưa có tin nhắn'}
                          </p>
                        </div>
                        {dm.unread && dm.unread > 0 ? (
                          <Badge className={`${isSelected ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'} text-[10px] h-4 px-1.5 font-bold self-center`}>
                            {dm.unread}
                          </Badge>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* NHÓM 3: ĐỒNG NGHIỆP NỘI BỘ (DM) */}
            {(categoryFilter === 'all' || categoryFilter === 'internal') && (
              <div>
                <div className="flex items-center justify-between px-2 mb-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-emerald-500" /> Đồng Nghiệp (Nội Bộ)
                  </span>
                </div>
                <div className="space-y-1">
                  {filteredDMs.filter(d => d.type === 'internal').map(dm => {
                    const isSelected = activeThreadId === dm.id
                    return (
                      <div 
                        key={dm.id} 
                        onClick={() => setActiveThreadId(dm.id)}
                        className={`group flex items-start gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold' 
                            : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        <div className="relative shrink-0 mt-0.5">
                          <Avatar className="h-9 w-9 rounded-xl">
                            <AvatarFallback className={`${isSelected ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'} text-xs font-bold rounded-xl`}>
                              {dm.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 ${
                            dm.online ? 'bg-emerald-500' : 'bg-slate-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold truncate">{dm.name}</span>
                            <span className={`text-[10px] font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                              {dm.lastTime || 'Hôm nay'}
                            </span>
                          </div>
                          <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                            {dm.role}
                          </p>
                          <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-muted-foreground'}`}>
                            {dm.lastMessage || 'Chưa có tin nhắn'}
                          </p>
                        </div>
                        {dm.unread && dm.unread > 0 ? (
                          <Badge className={`${isSelected ? 'bg-white text-indigo-700' : 'bg-indigo-600 text-white'} text-[10px] h-4 px-1.5 font-bold self-center`}>
                            {dm.unread}
                          </Badge>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ======================================================== */}
        {/* CỘT 2: KHUNG CHAT TRUNG TÂM (MAIN CONVERSATION VIEW) */}
        {/* ======================================================== */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative min-w-0">
          
          {/* TOP THREAD HEADER */}
          <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-4 md:px-6 flex-shrink-0 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0">
              {activeChannel ? (
                <div className="p-2.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Hash className="h-5 w-5" />
                </div>
              ) : (
                <div className="relative">
                  <Avatar className="h-10 w-10 rounded-xl">
                    <AvatarFallback className="bg-blue-600 text-white font-bold rounded-xl">
                      {activeDM?.avatar || 'DM'}
                    </AvatarFallback>
                  </Avatar>
                  {activeDM?.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                  )}
                </div>
              )}
              
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm md:text-base truncate">
                    {activeChannel ? `#${activeChannel.name}` : activeDM?.name}
                  </h3>
                  {isCustomerZalo && (
                    <Badge className="bg-blue-600 text-white text-[10px] font-bold h-4 px-1.5">
                      Zalo Official Account
                    </Badge>
                  )}
                  {activeDM?.leadScore && (
                    <Badge className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold h-4 px-1.5">
                      Điểm Nóng: {activeDM.leadScore}/100
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground truncate">
                  {activeChannel ? (
                    <span>{activeChannel.membersCount || 12} thành viên • {activeChannel.topic || activeChannel.description}</span>
                  ) : isCustomerZalo ? (
                    <span>SĐT: <strong className="text-slate-700 dark:text-slate-300">{activeDM?.phone}</strong> • Quan tâm: <strong className="text-indigo-600">{activeDM?.projectName}</strong></span>
                  ) : (
                    <span>{activeDM?.role || 'Đồng nghiệp'} • {activeDM?.online ? 'Đang hoạt động' : 'Ngoại tuyến'}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Header Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Softphone VoIP call trigger */}
              <Button 
                onClick={() => {
                  const targetName = activeDM?.name || activeChannel?.name
                  triggerToast(`Đang kết nối cuộc gọi VoIP Softphone tới ${targetName}...`)
                }}
                variant="ghost" 
                size="icon" 
                title="Gọi điện VoIP Softphone"
                className="text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900 rounded-xl h-9 w-9"
              >
                <PhoneCall className="h-4 w-4" />
              </Button>

              {/* Video Call Conference trigger */}
              <Button 
                onClick={() => setShowVideoCall(true)}
                variant="ghost" 
                size="icon" 
                title="Hội nghị Video Call"
                className="text-pink-600 bg-pink-50 hover:bg-pink-100 dark:bg-pink-950/50 dark:hover:bg-pink-900 rounded-xl h-9 w-9"
              >
                <Video className="h-4 w-4" />
              </Button>

              {/* Simulate response button */}
              <Button 
                onClick={handleTriggerReply}
                variant="ghost" 
                size="sm"
                title="Giả lập đối phương phản hồi ngay lập tức"
                className="hidden sm:flex text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-xs font-bold h-9 px-2.5 rounded-xl"
              >
                <Zap className="h-3.5 w-3.5 mr-1 text-amber-500 fill-amber-500" />
                Mô Phỏng Trả Lời
              </Button>

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

              {/* Toggle Right Inspector Panel */}
              <Button 
                onClick={() => setShowRightPanel(prev => !prev)}
                variant={showRightPanel ? 'secondary' : 'ghost'} 
                size="icon" 
                title={showRightPanel ? "Đóng bảng chi tiết" : "Mở bảng chi tiết CRM"}
                className="rounded-xl h-9 w-9 text-slate-600 dark:text-slate-300"
              >
                <Layers className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/40 dark:bg-slate-900/20">
            
            {/* Date divider */}
            <div className="flex items-center justify-center my-2">
              <span className="text-[11px] font-bold text-slate-400 bg-slate-200/70 dark:bg-slate-800 px-3 py-1 rounded-full shadow-2xs">
                Hôm nay, 20 Tháng 7, 2026
              </span>
            </div>

            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 pb-16">
                <MessageCircle className="h-12 w-12 mb-3 text-slate-300 dark:text-slate-700" />
                <p className="font-bold text-base text-slate-600 dark:text-slate-400">Chưa có tin nhắn nào trong luồng này</p>
                <p className="text-xs text-muted-foreground mt-1">Gửi thông tin chào mời hoặc đính kèm sản phẩm BĐS để bắt đầu!</p>
              </div>
            ) : (
              currentMessages.map(msg => {
                const isMe = msg.senderId === 'me'
                const isSystem = msg.msgType === 'system' || msg.senderId === 'system'

                if (isSystem) {
                  return (
                    <div key={msg.id} className="flex justify-center my-3">
                      <div className="flex items-center gap-2 bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 px-4 py-1.5 rounded-full text-xs text-indigo-700 dark:text-indigo-300 font-medium shadow-2xs">
                        <Bot className="h-3.5 w-3.5 text-indigo-500" />
                        <span>{msg.text}</span>
                        <span className="text-[10px] text-muted-foreground ml-1">({msg.time})</span>
                      </div>
                    </div>
                  )
                }

                return (
                  <div key={msg.id} className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                    
                    {/* Avatar */}
                    <Avatar className="h-9 w-9 rounded-xl shadow-2xs shrink-0 mt-0.5">
                      <AvatarFallback className={`text-xs font-bold rounded-xl ${
                        isMe 
                          ? 'bg-indigo-600 text-white' 
                          : msg.senderId === 'customer'
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {isMe ? 'ME' : msg.senderAvatar || 'KH'}
                      </AvatarFallback>
                    </Avatar>

                    {/* Bubble Container */}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      
                      {/* Name & Time */}
                      <div className={`flex items-baseline gap-2 mb-1 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{msg.senderName}</span>
                        <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                      </div>

                      {/* Content by Type */}
                      {msg.msgType === 'listing' && msg.listing ? (
                        /* REAL ESTATE LISTING CARD BUBBLE */
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-md max-w-sm">
                          <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                            <img 
                              src={msg.listing.image} 
                              alt={msg.listing.code}
                              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" 
                            />
                            <Badge className="absolute top-2.5 left-2.5 bg-emerald-500 text-white font-bold text-[10px] shadow-sm">
                              {msg.listing.status}
                            </Badge>
                            <Badge className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md text-white font-bold text-[10px]">
                              {msg.listing.code}
                            </Badge>
                          </div>
                          <div className="p-3.5 space-y-2">
                            <div>
                              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                                {msg.listing.projectName}
                              </h4>
                              <div className="text-base font-black text-rose-600 dark:text-rose-400 mt-0.5">
                                {msg.listing.price}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                              <div>📐 Diện tích: <strong>{msg.listing.area}</strong></div>
                              <div>🛏️ Kết cấu: <strong>{msg.listing.bedrooms}PN • {msg.listing.bathrooms}WC</strong></div>
                              <div className="col-span-2 text-[11px] text-muted-foreground truncate">
                                🧭 Hướng: {msg.listing.direction || 'Đông Nam'}
                              </div>
                            </div>

                            {msg.listing.commission && (
                              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-2 rounded-lg text-xs text-amber-800 dark:text-amber-300 font-semibold flex items-center justify-between">
                                <span>Ưu đãi áp dụng:</span>
                                <span className="font-bold">{msg.listing.commission}</span>
                              </div>
                            )}

                            <div className="flex gap-2 pt-1">
                              <Button 
                                size="sm" 
                                onClick={() => {
                                  triggerToast(`Đã lưu căn ${msg.listing?.code} vào giỏ hàng tư vấn cho khách!`)
                                }}
                                className="flex-1 h-8 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
                              >
                                Giữ Chỗ Căn Này
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  triggerToast(`Đã sao chép liên kết 360 VR căn ${msg.listing?.code}!`)
                                }}
                                className="h-8 px-2.5 text-xs font-bold"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : msg.isFile ? (
                        /* FILE ATTACHMENT BUBBLE */
                        <div className={`p-3 rounded-2xl shadow-xs border ${
                          isMe 
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 rounded-tr-xs' 
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-tl-xs'
                        } max-w-sm`}>
                          <div className="flex items-center gap-3 bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="p-2.5 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-lg">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-xs truncate text-slate-800 dark:text-slate-200">
                                {msg.fileName}
                              </div>
                              <div className="text-[10px] text-muted-foreground">{msg.fileSize || '1.8 MB'} • Đã ký số CĐT</div>
                            </div>
                            <Button 
                              onClick={() => triggerToast(`Đang tải xuống tệp ${msg.fileName}...`)}
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-500 hover:text-indigo-600"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                          {msg.text && (
                            <p className="mt-2 text-xs font-medium text-slate-700 dark:text-slate-300 px-1">
                              {msg.text}
                            </p>
                          )}
                        </div>
                      ) : (
                        /* STANDARD TEXT BUBBLE */
                        <div className={`p-3.5 rounded-2xl text-xs md:text-sm font-medium shadow-xs leading-relaxed ${
                          isMe 
                            ? 'bg-indigo-600 text-white rounded-tr-xs shadow-indigo-600/10' 
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                        }`}>
                          <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                      )}

                      {/* Read receipts for 'me' */}
                      {isMe && (
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-medium">
                          <CheckCheck className="h-3.5 w-3.5 text-indigo-500" />
                          <span>Đã nhận & xem</span>
                        </div>
                      )}

                    </div>
                  </div>
                )
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK SUGGESTION CHIPS BAR (CSKH 1-Touch Suggestions) */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500" /> Gợi ý nhanh:
            </span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleApplyTemplate('Dạ em xin gửi bảng giá và chính sách chiết khấu 14% thanh toán nhanh ạ!', true)}
              className="h-6 text-[11px] font-medium rounded-full bg-white dark:bg-slate-800 hover:border-indigo-400 shrink-0"
            >
              📄 Gửi Bảng Giá 14%
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleApplyTemplate('Thứ Bảy này 09:00 sáng em mời anh/chị ghé xem sa bàn Novaland Gallery nhé ạ!', true)}
              className="h-6 text-[11px] font-medium rounded-full bg-white dark:bg-slate-800 hover:border-indigo-400 shrink-0"
            >
              🏢 Hẹn Xem Sa Bàn Thứ 7
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleApplyTemplate('Số TK Vietcombank CĐT Novaland: 0071009988776 - Nội dung: Dat coc can...', true)}
              className="h-6 text-[11px] font-medium rounded-full bg-white dark:bg-slate-800 hover:border-indigo-400 shrink-0"
            >
              💳 Số TK Nhận Cọc CĐT
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowAttachListingModal(true)}
              className="h-6 text-[11px] font-medium rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 shrink-0 font-bold"
            >
              🏡 Đính Kèm Căn Hộ
            </Button>
          </div>

          {/* CHAT INPUT AREA */}
          <div className="p-3.5 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/70 dark:bg-slate-900/50 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all overflow-hidden shadow-xs">
              
              <textarea 
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Nhắn tin tới ${activeChannel ? '#' + activeChannel.name : activeDM?.name || 'cuộc trò chuyện'}... (Enter để gửi, Shift+Enter xuống dòng)`}
                className="w-full bg-transparent p-3 outline-none resize-none text-xs md:text-sm font-medium placeholder:text-slate-400"
              />

              {/* Action Toolbar */}
              <div className="flex justify-between items-center px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  
                  {/* Button Attach BĐS */}
                  <Button 
                    onClick={() => setShowAttachListingModal(true)}
                    variant="ghost" 
                    size="sm" 
                    title="Đính kèm căn hộ từ giỏ hàng"
                    className="h-7 px-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950"
                  >
                    <Building2 className="h-3.5 w-3.5 mr-1" />
                    Căn Hộ
                  </Button>

                  {/* Button Quick Templates */}
                  <Button 
                    onClick={() => setShowQuickTemplatesModal(true)}
                    variant="ghost" 
                    size="sm" 
                    title="Thư viện kịch bản phản hồi mẫu"
                    className="h-7 px-2 text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950"
                  >
                    <Sparkles className="h-3.5 w-3.5 mr-1" />
                    Mẫu
                  </Button>

                  {/* Button Attach File */}
                  <Button 
                    onClick={handleSimulateAttachFile}
                    variant="ghost" 
                    size="icon" 
                    title="Đính kèm tệp PDF/Brochure"
                    className="h-7 w-7 text-slate-500 hover:text-indigo-600"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>

                  {/* Button Voice Memo */}
                  <Button 
                    onClick={handleSendVoiceNote}
                    variant="ghost" 
                    size="icon" 
                    title="Ghi âm tin nhắn thoại"
                    className="h-7 w-7 text-slate-500 hover:text-indigo-600"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>

                  {/* Quick Emojis */}
                  <div className="hidden sm:flex items-center gap-0.5 ml-1 border-l pl-2 border-slate-200 dark:border-slate-800">
                    {['🔥', '🏠', '🤝', '💰'].map(em => (
                      <button 
                        key={em}
                        onClick={() => handleInsertEmoji(em)}
                        className="hover:scale-125 transition-transform text-sm px-1 py-0.5"
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className={`h-8 px-4 rounded-lg font-bold text-xs transition-all ${
                      message.trim() 
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Gửi <Send className="h-3 w-3 ml-1.5" />
                  </Button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* CỘT 3: BẢNG CHI TIẾT THÔNG TIN (RIGHT INSPECTOR PANEL) */}
        {/* ======================================================== */}
        {showRightPanel && (
          <div className="hidden lg:flex w-72 xl:w-80 bg-slate-50/70 dark:bg-slate-950/70 border-l border-slate-200 dark:border-slate-800 flex-col flex-shrink-0 overflow-y-auto p-4 space-y-4">
            
            {/* Header Right Panel */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                {activeChannel ? 'Thông Tin Kênh' : isCustomerZalo ? 'Hồ Sơ Khách Zalo' : 'Thông Tin Đồng Nghiệp'}
              </h4>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowRightPanel(false)}
                className="h-6 w-6 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* CASE 1: KÊNH DỰ ÁN */}
            {activeChannel && (
              <div className="space-y-4">
                <div className="text-center p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center font-bold text-xl mb-2">
                    #
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">#{activeChannel.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{activeChannel.description}</p>
                </div>

                {/* Pinned Info */}
                {activeChannel.pinnedMsg && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <Bookmark className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      Thông Báo Đã Ghim
                    </div>
                    <p className="text-xs text-amber-900 dark:text-amber-200">
                      {activeChannel.pinnedMsg}
                    </p>
                  </div>
                )}

                {/* Members list */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Thành Viên ({activeChannel.membersCount || 12})
                    </span>
                    <Button 
                      onClick={() => triggerToast('Đã mở hộp thoại mời thêm chuyên viên vào kênh!')}
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] text-indigo-600 font-bold"
                    >
                      + Mời thêm
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { name: 'Lê Hoàng Anh (Bạn)', role: 'Trưởng nhóm Sale', status: 'Online' },
                      { name: 'Thanh Hà', role: 'Marketing Lead', status: 'Online' },
                      { name: 'Tuấn Tú', role: 'Pháp chế & HĐ', status: 'Online' },
                      { name: 'Minh Anh', role: 'Admin Sàn', status: 'Offline' },
                      { name: 'Giám Đốc Hùng', role: 'BOD Approval', status: 'Offline' }
                    ].map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7 rounded-lg">
                            <AvatarFallback className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800">
                              {m.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs font-bold leading-none">{m.name}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{m.role}</div>
                          </div>
                        </div>
                        <span className={`w-2 h-2 rounded-full ${m.status === 'Online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel Shared Files */}
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                    Tài Liệu Đã Chia Sẻ
                  </span>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { name: 'Bao_Gia_AquaCity_T7.pdf', size: '2.4 MB' },
                      { name: 'Chinh_Sach_Vay_VCB.pdf', size: '1.9 MB' }
                    ].map((f, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                          <span className="truncate text-xs">{f.name}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">{f.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CASE 2: KHÁCH HÀNG ZALO OA (360 CRM PROFILE GLANCE) */}
            {activeDM && isCustomerZalo && (
              <div className="space-y-4">
                {/* Profile Card */}
                <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Avatar className="h-14 w-14 rounded-2xl mx-auto mb-2 border-2 border-blue-500">
                    <AvatarFallback className="bg-blue-600 text-white font-bold text-base rounded-2xl">
                      {activeDM.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{activeDM.name}</h3>
                  <Badge className="mt-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                    {activeDM.role || 'Khách hàng VIP'}
                  </Badge>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-left">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Số điện thoại:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{activeDM.phone || '0903 123 456'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dự án quan tâm:</span>
                      <strong className="text-indigo-600">{activeDM.projectName || 'Aqua City'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tầm tài chính:</span>
                      <strong>{activeDM.budget || '12 - 15 Tỷ'}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Điểm nhiệt AI:</span>
                      <strong className="text-rose-600">{activeDM.leadScore || 95}/100 🔥</strong>
                    </div>
                  </div>
                </div>

                {/* CRM Quick Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    onClick={() => setShowCustomerDrawer(true)}
                    className="w-full h-8 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    Hồ Sơ 360° Đầy Đủ
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setForwardTaskForm({
                        title: `Tư vấn căn hộ & sa bàn cho ${activeDM.name}`,
                        assignee: 'Lê Hoàng Anh',
                        priority: 'high',
                        due: 'Thứ 7 09:00',
                        notes: `Khách quan tâm ${activeDM.projectName}, tài chính ${activeDM.budget}`
                      })
                      setShowForwardTaskModal(true)
                    }}
                    variant="outline" 
                    className="w-full h-8 text-xs font-bold"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-indigo-600" />
                    Chuyển Thành Task CRM
                  </Button>
                </div>

                {/* AI Bot Auto-reply Switcher */}
                <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold">
                      <Bot className="h-4 w-4 text-indigo-600" />
                      <span>Trợ Lý AI Zalo OA</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={aiBotEnabled} 
                      onChange={(e) => {
                        setAiBotEnabled(e.target.checked)
                        triggerToast(`Trợ lý AI tự động phản hồi Zalo OA: ${e.target.checked ? 'Đã bật' : 'Đã tắt'}`)
                      }}
                      className="cursor-pointer h-4 w-4 accent-indigo-600 rounded" 
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Tự động nhận diện nhu cầu căn hộ và phản hồi bảng giá ngoài giờ hành chính.
                  </p>
                </div>
              </div>
            )}

            {/* CASE 3: ĐỒNG NGHIỆP NỘI BỘ */}
            {activeDM && !isCustomerZalo && (
              <div className="space-y-4">
                <div className="text-center p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                  <Avatar className="h-14 w-14 rounded-2xl mx-auto mb-2">
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-base rounded-2xl">
                      {activeDM.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{activeDM.name}</h3>
                  <Badge className="mt-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                    {activeDM.role}
                  </Badge>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-left">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Máy lẻ nội bộ:</span>
                      <strong>Ext 102</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <strong className={activeDM.online ? 'text-emerald-600' : 'text-slate-400'}>
                        {activeDM.online ? 'Đang trực tuyến' : 'Ngoại tuyến'}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Nhiệm vụ:</span>
                      <span>{activeDM.statusBadge || 'Tác nghiệp'}</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowVideoCall(true)}
                  className="w-full h-8 text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white"
                >
                  <Video className="h-3.5 w-3.5 mr-1.5" />
                  Gọi Video Nội Bộ
                </Button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 5 MODALS TÁC NGHIỆP HOÀN TOÀN TƯƠNG TÁC (ZERO DEAD BUTTONS) */}
      {/* ======================================================== */}

      {/* MODAL 1: TẠO KÊNH THẢO LUẬN MỚI */}
      {showCreateChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-base">Tạo Kênh Thảo Luận Mới</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateChannelModal(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleCreateChannel} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tên Kênh (Ví dụ: du-an-the-global-city)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-bold text-slate-400">#</span>
                  <Input 
                    required
                    value={newChannelData.name}
                    onChange={(e) => setNewChannelData({ ...newChannelData, name: e.target.value })}
                    placeholder="ten-kenh-viet-lien-khong-dau" 
                    className="pl-7 h-9 text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phân Loại Kênh</label>
                <select 
                  value={newChannelData.category}
                  onChange={(e) => setNewChannelData({ ...newChannelData, category: e.target.value as any })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium"
                >
                  <option value="project">Dự Án Mở Bán (Aqua City, NovaWorld...)</option>
                  <option value="department">Phòng Ban (Team Sale, Pháp Lý, Kế Toán...)</option>
                  <option value="management">Ban Giám Đốc (Phê duyệt cấp cao)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Chủ Đề Trọng Tâm (Topic)</label>
                <Input 
                  value={newChannelData.topic}
                  onChange={(e) => setNewChannelData({ ...newChannelData, topic: e.target.value })}
                  placeholder="Ví dụ: Phân phối đợt 2 phân khu Biệt thự ven sông" 
                  className="h-9 text-xs" 
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mô Tả Kênh</label>
                <textarea 
                  rows={2}
                  value={newChannelData.description}
                  onChange={(e) => setNewChannelData({ ...newChannelData, description: e.target.value })}
                  placeholder="Mô tả mục tiêu hoạt động của kênh thảo luận..." 
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs outline-none focus:border-indigo-500" 
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateChannelModal(false)}>
                  Hủy Bỏ
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                  Khởi Tạo Kênh
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ĐÍNH KÈM CĂN HỘ / SẢN PHẨM BĐS */}
      {showAttachListingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-base">Chọn Căn Hộ Đính Kèm Vào Khung Chat</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowAttachListingModal(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={listingSearch}
                  onChange={(e) => setListingSearch(e.target.value)}
                  placeholder="Tìm theo mã căn (AQC, TGM...), dự án, phân khu..." 
                  className="pl-9 h-9 text-xs bg-white dark:bg-slate-950" 
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {MOCK_LISTINGS.filter(l => 
                l.code.toLowerCase().includes(listingSearch.toLowerCase()) ||
                l.projectName.toLowerCase().includes(listingSearch.toLowerCase())
              ).map(listing => (
                <div 
                  key={listing.id} 
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500 transition-all bg-white dark:bg-slate-950 flex flex-col justify-between"
                >
                  <div className="relative h-28 w-full bg-slate-100">
                    <img src={listing.image} alt={listing.code} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold">
                      {listing.status}
                    </Badge>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold">
                      {listing.code}
                    </Badge>
                  </div>
                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs truncate">{listing.projectName}</h4>
                      <div className="text-sm font-black text-rose-600">{listing.price}</div>
                      <div className="text-[11px] text-muted-foreground">
                        {listing.area} • {listing.bedrooms}PN • {listing.direction}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleSendListing(listing)}
                      className="w-full mt-2 h-7 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Đính Kèm Vào Chat
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: THƯ VIỆN MẪU TIN NHẮN CSKH */}
      {showQuickTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-base">Thư Viện Mẫu Tin Nhắn Nhanh CSKH</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowQuickTemplatesModal(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Category tabs */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'greeting', label: 'Lời chào' },
                { id: 'quote', label: 'Báo giá & Cọc' },
                { id: 'appointment', label: 'Hẹn sa bàn' },
                { id: 'bank', label: 'Ngân hàng & STK' }
              ].map(cat => (
                <Button 
                  key={cat.id}
                  size="sm"
                  variant={templateCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setTemplateCategory(cat.id)}
                  className={`h-7 text-xs font-semibold rounded-lg ${templateCategory === cat.id ? 'bg-amber-500 hover:bg-amber-600 text-white' : ''}`}
                >
                  {cat.label}
                </Button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {QUICK_TEMPLATES.filter(t => templateCategory === 'all' || t.category === templateCategory).map(tmpl => (
                <div key={tmpl.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 bg-white dark:bg-slate-950 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{tmpl.title}</span>
                    <Badge variant="outline" className="text-[10px]">{tmpl.categoryName}</Badge>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed">
                    {tmpl.content}
                  </p>
                  <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleApplyTemplate(tmpl.content, false)}
                      className="h-7 text-xs font-semibold"
                    >
                      Chèn Vào Soạn Thảo
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleApplyTemplate(tmpl.content, true)}
                      className="h-7 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white"
                    >
                      <Send className="h-3 w-3 mr-1" /> Gửi Ngay
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: GIAO VIỆC / TẠO TASK CRM TỪ ĐOẠN CHAT */}
      {showForwardTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-base">Chuyển Tiếp Tin Nhắn Thành Task CRM</h3>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowForwardTaskModal(false)} className="h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateTaskFromChat} className="p-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tiêu Đề Nhiệm Vụ</label>
                <Input 
                  required
                  value={forwardTaskForm.title}
                  onChange={(e) => setForwardTaskForm({ ...forwardTaskForm, title: e.target.value })}
                  placeholder="Ví dụ: Đón khách xem sa bàn Novaland Gallery..." 
                  className="h-9 text-xs" 
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Người Phụ Trách</label>
                <select 
                  value={forwardTaskForm.assignee}
                  onChange={(e) => setForwardTaskForm({ ...forwardTaskForm, assignee: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium"
                >
                  <option value="Lê Hoàng Anh">Lê Hoàng Anh (Bạn)</option>
                  <option value="Thanh Hà">Thanh Hà (Marketing)</option>
                  <option value="Tuấn Tú">Tuấn Tú (Pháp lý)</option>
                  <option value="Minh Anh">Minh Anh (Admin Sàn)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mức Độ Ưu Tiên</label>
                  <select 
                    value={forwardTaskForm.priority}
                    onChange={(e) => setForwardTaskForm({ ...forwardTaskForm, priority: e.target.value as any })}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium"
                  >
                    <option value="high">🔥 Rất Gấp (SLA 2h)</option>
                    <option value="medium">⚡ Bình Thường</option>
                    <option value="low">☕ Thấp</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Hạn Hoàn Thành</label>
                  <Input 
                    value={forwardTaskForm.due}
                    onChange={(e) => setForwardTaskForm({ ...forwardTaskForm, due: e.target.value })}
                    className="h-9 text-xs" 
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ghi Chú Nhu Cầu</label>
                <textarea 
                  rows={2}
                  value={forwardTaskForm.notes}
                  onChange={(e) => setForwardTaskForm({ ...forwardTaskForm, notes: e.target.value })}
                  placeholder="Ghi chú thêm về khách hoặc căn hộ..." 
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForwardTaskModal(false)}>
                  Hủy Bỏ
                </Button>
                <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                  Khởi Tạo Nhiệm Vụ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: HỒ SƠ KHÁCH HÀNG ZALO OA 360° ĐẦY ĐỦ */}
      {showCustomerDrawer && activeDM && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border-2 border-white/50">
                  <AvatarFallback className="bg-blue-600 text-white font-bold">{activeDM.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-base">{activeDM.name}</h3>
                  <p className="text-xs text-blue-200">{activeDM.role || 'Khách hàng VIP Diamond'} • Zalo Official Account</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCustomerDrawer(false)} className="text-white hover:bg-white/20 h-7 w-7">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-muted-foreground block">Số Điện Thoại:</span>
                  <strong className="text-sm text-slate-800 dark:text-slate-200">{activeDM.phone || '0903 123 456'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Nguồn Tiếp Cận:</span>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Zalo OA - Facebook Ads</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block">Dự Án Quan Tâm:</span>
                  <strong className="text-indigo-600">{activeDM.projectName || 'Aqua City'}</strong>
                </div>
                <div>
                  <span className="text-muted-foreground block">Khoảng Ngân Sách:</span>
                  <strong className="text-rose-600">{activeDM.budget || '12 - 15 Tỷ'}</strong>
                </div>
              </div>

              {/* Funnel Progress */}
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-2">Tiến Độ Phễu Bán Hàng</span>
                <div className="flex items-center gap-2">
                  {['Tiếp cận OA', 'Hẹn sa bàn', 'Giữ chỗ cọc', 'Ký HĐMB'].map((step, idx) => (
                    <div key={idx} className="flex-1 text-center">
                      <div className={`h-2 rounded-full mb-1 ${idx <= 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
                      <span className={`text-[10px] font-semibold ${idx <= 1 ? 'text-emerald-600' : 'text-slate-400'}`}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Ghi Chú Đàm Phán Chuyên Sâu</span>
                <p className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border text-slate-700 dark:text-slate-300 leading-relaxed">
                  Khách mua căn biệt thự để nghỉ dưỡng cuối tuần cho gia đình 3 thế hệ. Quan tâm đặc biệt tới tiện ích bến du thuyền 5 sao và trường quốc tế liên cấp tại Đảo Phượng Hoàng. Cần phương án thanh toán linh hoạt 18 tháng.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button 
                  onClick={() => {
                    setShowCustomerDrawer(false)
                    triggerToast(`Đã tạo lịch hẹn đón ${activeDM.name} xem sa bàn!`)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  Xác Nhận Lịch Hẹn Sa Bàn
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: MOCK VIDEO CALL POPUP NÂNG CẤP */}
      {showVideoCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
          <div className="relative w-full max-w-4xl aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col justify-between">
            
            {/* Top Bar Call */}
            <div className="relative z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-3 text-white">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                <span className="font-bold text-sm">
                  Đang gọi hội nghị: {activeDM ? activeDM.name : activeChannel?.name || 'Phòng Họp Trực Tuyến'}
                </span>
                <span className="text-xs text-slate-400 font-mono">03:45</span>
              </div>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <Maximize className="h-4 w-4 mr-1.5" /> Toàn màn hình
              </Button>
            </div>

            {/* Main Stage Video */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
              <div className="text-center">
                <Avatar className="h-36 w-36 border-4 border-indigo-500/60 shadow-2xl mx-auto mb-3">
                  <AvatarFallback className="bg-indigo-600 text-white text-4xl font-bold">
                    {activeDM ? activeDM.avatar : 'TEAM'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-white font-bold text-lg">
                  {activeDM ? activeDM.name : activeChannel?.name}
                </div>
                <p className="text-xs text-indigo-300 mt-1">Đường truyền bảo mật cấp ngân hàng WebRTC P2P</p>
              </div>
            </div>

            {/* Picture in Picture (Self Video) */}
            <div className="absolute top-16 right-6 w-44 h-28 bg-slate-900 rounded-xl border-2 border-indigo-400/50 overflow-hidden shadow-xl flex items-center justify-center">
              {isVideoCamOff ? (
                <div className="text-slate-500 text-xs font-bold flex flex-col items-center">
                  <VideoOff className="h-6 w-6 mb-1 text-slate-600" />
                  Camera Tắt
                </div>
              ) : (
                <div className="relative w-full h-full bg-slate-800 flex items-center justify-center">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-indigo-600 text-white font-bold">ME</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-2 left-2 text-[10px] text-white bg-black/60 px-1.5 py-0.5 rounded">Bạn</span>
                </div>
              )}
            </div>

            {/* Control Bar (Bottom) */}
            <div className="relative z-10 flex justify-center items-center pb-6">
              <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700/60 shadow-xl">
                <Button 
                  onClick={() => setIsVideoMuted(!isVideoMuted)}
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-11 w-11 ${isVideoMuted ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 text-white border-slate-600'}`}
                >
                  {isVideoMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button 
                  onClick={() => setIsVideoCamOff(!isVideoCamOff)}
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full h-11 w-11 ${isVideoCamOff ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800 text-white border-slate-600'}`}
                >
                  {isVideoCamOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
                <Button 
                  onClick={() => triggerToast('Đã bắt đầu chia sẻ màn hình sa bàn 360 VR!')}
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-11 w-11 bg-slate-800 text-white border-slate-600"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => setShowVideoCall(false)}
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full h-13 w-13 bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/40"
                >
                  <Phone className="h-6 w-6 rotate-[135deg]" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
