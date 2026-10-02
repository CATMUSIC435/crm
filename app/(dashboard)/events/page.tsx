"use client"
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  CalendarRange, Ticket, QrCode, ScanLine, Users, MapPin, 
  Clock, CheckCircle2, MonitorPlay, Presentation, Target, 
  UserCheck, Plus, Search, Filter, PhoneCall, Sparkles, 
  Printer, Share2, Download, X, Check, AlertTriangle, 
  Crown, Gift, Armchair, ChevronRight, RefreshCw, Send
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { EventItem, CheckinLog } from '@/types'

// Mock Guest Model for Seating & E-Tickets
interface EventGuest {
  id: string
  eventId: string
  ticketCode: string
  customerName: string
  phone: string
  email: string
  rank: 'VVIP' | 'VIP' | 'Tiêu Chuẩn'
  table: string
  seat: string
  status: 'Đã check-in' | 'Chưa đến' | 'Hủy tham dự'
  checkinTime?: string
  assignedAgent: string
  specialNotes?: string
  gift?: string
}

const INITIAL_GUESTS: EventGuest[] = [
  {
    id: 'g1',
    eventId: 'e1',
    ticketCode: 'VVIP-888',
    customerName: 'Nguyễn Văn Tuấn',
    phone: '0901 234 567',
    email: 'tuan.nguyen@investor.vn',
    rank: 'VVIP',
    table: 'Bàn VVIP 01',
    seat: 'Ghế A-01',
    status: 'Đã check-in',
    checkinTime: '08:15',
    assignedAgent: 'Lê Hoàng Anh',
    specialNotes: 'Nhà đầu tư thân thiết sở hữu 3 căn Florida. Uống trà Oolong không đường.',
    gift: 'Bộ Rượu Vang Pháp Grand Cru & Voucher 500Tr'
  },
  {
    id: 'g2',
    eventId: 'e1',
    ticketCode: 'VIP-999',
    customerName: 'Trần Thị Bích Ngọc',
    phone: '0912 345 678',
    email: 'bichngoc.tran@vietcapital.vn',
    rank: 'VIP',
    table: 'Bàn VIP 02',
    seat: 'Ghế B-04',
    status: 'Đã check-in',
    checkinTime: '08:24',
    assignedAgent: 'Nguyễn Mai',
    specialNotes: 'Đang giữ chỗ căn Shophouse River Park. Cần tư vấn thêm gói vay MBBank.',
    gift: 'Hộp Trà Thượng Hạng & Voucher 200Tr'
  },
  {
    id: 'g3',
    eventId: 'e1',
    ticketCode: 'VIP-102',
    customerName: 'Phạm Minh Tuấn',
    phone: '0912 987 654',
    email: 'minhtuan.pham@saigonres.com',
    rank: 'VVIP',
    table: 'Bàn VVIP 01',
    seat: 'Ghế A-02',
    status: 'Chưa đến',
    assignedAgent: 'Thanh Hà',
    specialNotes: 'Chủ tịch tập đoàn BĐS Sài Gòn, đi cùng trợ lý.',
    gift: 'Bộ Rượu Vang Pháp Grand Cru & Voucher 500Tr'
  },
  {
    id: 'g4',
    eventId: 'e1',
    ticketCode: 'VIP-205',
    customerName: 'Hoàng Thị Thảo',
    phone: '0945 678 123',
    email: 'thaonhi.hoang@gmail.com',
    rank: 'VIP',
    table: 'Bàn VIP 03',
    seat: 'Ghế C-01',
    status: 'Đã check-in',
    checkinTime: '08:40',
    assignedAgent: 'Tuấn Tú',
    specialNotes: 'Quan tâm phân khu Đảo Phượng Hoàng Aqua City.',
    gift: 'Hộp Trà Thượng Hạng & Voucher 200Tr'
  },
  {
    id: 'g5',
    eventId: 'e1',
    ticketCode: 'STD-405',
    customerName: 'Đặng Quốc Huy',
    phone: '0977 889 900',
    email: 'huy.dang@greenland.vn',
    rank: 'Tiêu Chuẩn',
    table: 'Bàn Standard 05',
    seat: 'Ghế E-03',
    status: 'Chưa đến',
    assignedAgent: 'Minh Anh',
    specialNotes: 'Khách đăng ký qua form Facebook Ads xem sa bàn 3D.',
    gift: 'Mũ & Sổ Tay Bút Ký Novaland'
  },
  {
    id: 'g6',
    eventId: 'e1',
    ticketCode: 'VIP-308',
    customerName: 'Vũ Thu Trang',
    phone: '0966 554 433',
    email: 'trang.vu@fashionvn.com',
    rank: 'VIP',
    table: 'Bàn VIP 02',
    seat: 'Ghế B-05',
    status: 'Chưa đến',
    assignedAgent: 'Lê Hoàng Anh',
    specialNotes: 'Đã cọc căn 1PN Suite. Đến tham dự nhận quà tri ân mở bán.',
    gift: 'Hộp Trà Thượng Hạng & Voucher 200Tr'
  },
]

// Banquet tables configuration
const BANQUET_TABLES = [
  { id: 't1', name: 'Bàn VVIP 01', type: 'VVIP', seats: 10, occupied: 8, location: 'Trung Tâm Sân Khấu' },
  { id: 't2', name: 'Bàn VIP 02', type: 'VIP', seats: 10, occupied: 9, location: 'Cánh Phải Sân Khấu' },
  { id: 't3', name: 'Bàn VIP 03', type: 'VIP', seats: 10, occupied: 7, location: 'Cánh Trái Sân Khấu' },
  { id: 't4', name: 'Bàn VIP 04', type: 'VIP', seats: 10, occupied: 10, location: 'Khu Vực VIP B' },
  { id: 't5', name: 'Bàn Standard 05', type: 'Standard', seats: 10, occupied: 6, location: 'Khu Vực Phổ Thông 1' },
  { id: 't6', name: 'Bàn Standard 06', type: 'Standard', seats: 10, occupied: 5, location: 'Khu Vực Phổ Thông 2' },
]

export default function EventsPage() {
  const { events, checkinLogs, addCheckin, addEvent, customers } = useStore()
  
  // Tab control
  const [activeTab, setActiveTab] = useState('scanner')

  // Selected event for inspection & scanning
  const [selectedEventId, setSelectedEventId] = useState<string>('e1')
  const currentEvent = useMemo(() => events.find(e => e.id === selectedEventId) || events[0], [events, selectedEventId])

  // Scanner state
  const [scanCode, setScanCode] = useState("")
  const [scanFlash, setScanFlash] = useState(false)
  const [welcomeGuest, setWelcomeGuest] = useState<EventGuest | null>(null)

  // Guests List State
  const [guestList, setGuestList] = useState<EventGuest[]>(INITIAL_GUESTS)
  const [guestSearch, setGuestSearch] = useState('')
  const [rankFilter, setRankFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // Modals State
  const [isNewEventOpen, setIsNewEventOpen] = useState(false)
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false)
  const [previewTicketGuest, setPreviewTicketGuest] = useState<EventGuest | null>(null)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // New Event Form State
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState('Open House')
  const [newDate, setNewDate] = useState('Thứ 7, 15/08/2026')
  const [newTime, setNewTime] = useState('08:30 - 12:00')
  const [newLocation, setNewLocation] = useState('Khách sạn The Reverie Saigon, Quận 1')
  const [newCapacity, setNewCapacity] = useState(300)
  const [newImage, setNewImage] = useState('bg-indigo-600')

  // New Guest Form State
  const [newGuestName, setNewGuestName] = useState('')
  const [newGuestPhone, setNewGuestPhone] = useState('')
  const [newGuestEmail, setNewGuestEmail] = useState('')
  const [newGuestRank, setNewGuestRank] = useState<'VVIP' | 'VIP' | 'Tiêu Chuẩn'>('VIP')
  const [newGuestTable, setNewGuestTable] = useState('Bàn VIP 02')
  const [newGuestSeat, setNewGuestSeat] = useState('Ghế B-08')
  const [newGuestAgent, setNewGuestAgent] = useState('Lê Hoàng Anh')

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Calculations
  const totalEvents = events.length
  const totalRegistered = useMemo(() => events.reduce((sum, e) => sum + e.registered, 0), [events])
  const totalCheckedIn = useMemo(() => events.reduce((sum, e) => sum + e.checkedIn, 0), [events])
  const avgCheckinRate = totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0

  // Filtered Guest List
  const filteredGuests = useMemo(() => {
    return guestList.filter(g => {
      const matchSearch = g.customerName.toLowerCase().includes(guestSearch.toLowerCase().trim()) ||
                          g.phone.includes(guestSearch) ||
                          g.ticketCode.toLowerCase().includes(guestSearch.toLowerCase().trim())
      const matchRank = rankFilter === 'all' || g.rank === rankFilter
      const matchStatus = statusFilter === 'all' || g.status === statusFilter
      return matchSearch && matchRank && matchStatus
    })
  }, [guestList, guestSearch, rankFilter, statusFilter])

  // Scan & Check-in Handler
  const executeCheckin = (codeOrName: string) => {
    const query = codeOrName.trim().toUpperCase()
    if (!query) return

    // Find in guest list
    const matchedGuest = guestList.find(g => 
      g.ticketCode.toUpperCase() === query || 
      g.customerName.toUpperCase().includes(query) ||
      g.phone.includes(query)
    )

    const isVip = matchedGuest ? (matchedGuest.rank === 'VVIP' || matchedGuest.rank === 'VIP') : query.startsWith('VIP')
    const guestName = matchedGuest ? matchedGuest.customerName : (codeOrName.includes('-') ? (isVip ? 'Khách Hàng VIP' : 'Khách Mời') : codeOrName)
    const table = matchedGuest ? matchedGuest.table : (isVip ? 'Bàn VVIP 01' : 'Bàn Standard 05')
    const seat = matchedGuest ? matchedGuest.seat : 'Ghế A-01'
    const agent = matchedGuest ? matchedGuest.assignedAgent : 'Lê Hoàng Anh'

    // Update Zustand Store
    addCheckin(selectedEventId, matchedGuest ? matchedGuest.ticketCode : query, guestName, isVip, table, seat, agent)

    // Update local guest list status
    if (matchedGuest) {
      setGuestList(prev => prev.map(g => g.id === matchedGuest.id ? { 
        ...g, 
        status: 'Đã check-in', 
        checkinTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      } : g))
    }

    // Set Welcome info
    const welcomeInfo: EventGuest = matchedGuest || {
      id: `temp_${Date.now()}`,
      eventId: selectedEventId,
      ticketCode: query,
      customerName: guestName,
      phone: '0901 *** ***',
      email: 'investor@novacrm.vn',
      rank: isVip ? 'VVIP' : 'Tiêu Chuẩn',
      table,
      seat,
      status: 'Đã check-in',
      checkinTime: 'Vừa xong',
      assignedAgent: agent,
      specialNotes: 'Khách hàng check-in trực tiếp tại quầy lễ tân.',
      gift: isVip ? 'Bộ Rượu Vang Pháp Grand Cru & Voucher 500Tr' : 'Mũ & Sổ Tay Bút Ký'
    }

    setWelcomeGuest(welcomeInfo)
    setIsWelcomeModalOpen(true)

    // Visual Flash on Camera
    setScanFlash(true)
    setTimeout(() => setScanFlash(false), 1500)
    setScanCode("")
    showToast(`🎉 CHECK-IN THÀNH CÔNG: Chào mừng ${guestName} (${welcomeInfo.table} - ${welcomeInfo.seat})!`)
  }

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCheckin(scanCode)
  }

  // Create Event Handler
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    addEvent({
      title: newTitle,
      type: newType,
      date: newDate,
      time: newTime,
      location: newLocation,
      capacity: Number(newCapacity),
      registered: Math.round(Number(newCapacity) * 0.8),
      checkedIn: 0,
      image: newImage,
      iconName: newType === 'Webinar' ? 'MonitorPlay' : newType === 'Workshop' ? 'Users' : 'Presentation',
      tablesCount: Math.ceil(Number(newCapacity) / 10)
    })

    setIsNewEventOpen(false)
    setNewTitle('')
    showToast(`🎊 Đã khởi tạo thành công sự kiện "${newTitle}"!`)
  }

  // Add Guest Handler
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGuestName.trim() || !newGuestPhone.trim()) return

    const newTicket = `${newGuestRank === 'VVIP' ? 'VVIP' : newGuestRank === 'VIP' ? 'VIP' : 'STD'}-${Math.floor(Math.random() * 900) + 100}`
    const newGuest: EventGuest = {
      id: `g_${Date.now()}`,
      eventId: selectedEventId,
      ticketCode: newTicket,
      customerName: newGuestName,
      phone: newGuestPhone,
      email: newGuestEmail || `${newGuestPhone}@novacrm.vn`,
      rank: newGuestRank,
      table: newGuestTable,
      seat: newGuestSeat,
      status: 'Chưa đến',
      assignedAgent: newGuestAgent,
      specialNotes: 'Khách mời bổ sung danh sách VIP.',
      gift: newGuestRank === 'VVIP' ? 'Bộ Rượu Vang Pháp Grand Cru & Voucher 500Tr' : 
            newGuestRank === 'VIP' ? 'Hộp Trà Thượng Hạng & Voucher 200Tr' : 'Mũ & Bút Ký Novaland'
    }

    setGuestList([newGuest, ...guestList])
    setIsAddGuestOpen(false)
    setNewGuestName('')
    setNewGuestPhone('')
    showToast(`Đã cấp vé điện tử ${newTicket} cho khách mời ${newGuestName} (${newGuestTable})!`)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Mã Vé", "Họ Tên Khách Mời", "Số Điện Thoại", "Hạng Vé", "Bàn Tiệc", "Số Ghế", "Trạng Thái", "Giờ Check-in", "Chuyên Viên Đón Tiếp"]
    const rows = guestList.map(g => [
      g.ticketCode,
      `"${g.customerName}"`,
      g.phone,
      g.rank,
      g.table,
      g.seat,
      g.status,
      g.checkinTime || 'Chưa điểm danh',
      `"${g.assignedAgent}"`
    ])
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `DiemDanh_SuKien_${selectedEventId}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('📥 Đã tải xuống file CSV danh sách điểm danh và phân bổ bàn tiệc.')
  }

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0 animate-bounce" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Điều Hành */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800 text-white">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <CalendarRange className="h-3.5 w-3.5" /> Event Management & QR Check-in Station
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-bold">
              Live Fast-Checkin Active
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Sự Kiện Mở Bán & Trạm Quét Mã QR Khách VIP
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Quản trị sự kiện mở bán tập trung tại trung tâm hội nghị, sơ đồ bàn tiệc, số ghế ngồi, quét vé QR thời gian thực và tự động kích hoạt quy trình đón tiếp VVIP.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button 
            onClick={() => setIsAddGuestOpen(true)}
            variant="outline"
            className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30 font-bold text-xs md:text-sm h-10 px-4"
          >
            <Plus className="mr-2 h-4 w-4 text-indigo-400" /> Thêm Khách Mời
          </Button>

          <Button 
            onClick={handleExportCSV}
            variant="outline"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-bold text-xs md:text-sm h-10 px-3.5"
            title="Xuất Danh Sách Điểm Danh CSV"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button 
            onClick={() => setIsNewEventOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs md:text-sm h-10 px-5 shadow-lg shadow-indigo-600/25"
          >
            <Ticket className="mr-1.5 h-5 w-5" /> Tạo Sự Kiện Mới
          </Button>
        </div>
      </div>

      {/* 4 Thẻ KPI Chiến Lược */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Sự Kiện Đang Chạy</span>
              <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><CalendarRange className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-slate-900">{totalEvents} Sự Kiện</div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Đang chọn: <strong>{currentEvent?.title.substring(0, 18)}...</strong></span>
            </div>
            <Progress value={100} className="h-1.5 mt-2 bg-slate-100 [&>div]:bg-indigo-600" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Khách Mời Đăng Ký</span>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Users className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-emerald-600">{totalRegistered.toLocaleString()} Khách</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold">{guestList.length} Khách trong danh bạ</span>
              <span className="text-slate-500">Sức chứa 2.650</span>
            </div>
            <div className="h-1.5 mt-2 rounded-full bg-emerald-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Tỷ Lệ Check-in (Show-up)</span>
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600"><CheckCircle2 className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-blue-600">{avgCheckinRate}%</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold">{totalCheckedIn.toLocaleString()} Khách đã tới</span>
              <span className="text-slate-500">Vượt mục tiêu 80%</span>
            </div>
            <Progress value={avgCheckinRate} className="h-1.5 mt-2 bg-blue-100 [&>div]:bg-blue-600" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Khách Hàng VVIP Đã Đón</span>
              <span className="p-2 rounded-lg bg-amber-50 text-amber-600"><Crown className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-amber-600">
              {checkinLogs.filter(l => l.status === 'VIP').length} / {guestList.filter(g => g.rank === 'VVIP' || g.rank === 'VIP').length} VVIP
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold">100% Đón tiếp nghi thức</span>
              <span className="text-indigo-600 font-bold">Quà vang & VIP badge</span>
            </div>
            <div className="h-1.5 mt-2 rounded-full bg-amber-100 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Điều Hướng */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto md:h-12 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="scanner" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 relative">
            <ScanLine className="h-4 w-4 text-emerald-600"/> Trạm Quét QR Trực Tiếp
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </TabsTrigger>
          <TabsTrigger value="guests" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-600"/> Danh Sách Khách & Thẻ Vé
          </TabsTrigger>
          <TabsTrigger value="seating" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
            <Armchair className="h-4 w-4 text-amber-600"/> Sơ Đồ Bàn Tiệc & Ghế
          </TabsTrigger>
          <TabsTrigger value="events" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2">
            <CalendarRange className="h-4 w-4 text-purple-600"/> Danh Mục Sự Kiện
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: TRẠM QUÉT QR CHECK-IN TRỰC TIẾP */}
        <TabsContent value="scanner" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[660px]">
            
            {/* Camera Viewfinder (8 Cols) */}
            <Card className="xl:col-span-8 shadow-2xl border-slate-800 bg-slate-950 overflow-hidden relative flex flex-col rounded-2xl">
              
              {/* Camera Header */}
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10 relative">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                  <span className="text-white font-mono font-bold tracking-widest text-xs md:text-sm">LIVE OPTICAL SCANNER (60 FPS)</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Sự kiện:</span>
                  <Badge className="bg-indigo-600 text-white font-bold text-xs">
                    {currentEvent?.title}
                  </Badge>
                </div>
              </div>

              {/* Viewfinder Main Stage */}
              <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
                {/* Dark Backdrop */}
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs"></div>
                
                {/* Laser Scanning Flash Effect */}
                <div className={`absolute inset-0 bg-emerald-500 transition-opacity duration-300 z-50 pointer-events-none mix-blend-overlay ${scanFlash ? 'opacity-60' : 'opacity-0'}`}></div>

                {/* Laser Focus Box */}
                <div className={`relative z-10 w-72 h-72 md:w-80 md:h-80 border-2 ${scanFlash ? 'border-emerald-400' : 'border-emerald-500/40'} rounded-3xl overflow-hidden shadow-[0_0_0_4000px_rgba(2,6,23,0.85)] transition-all`}>
                  {/* Glowing corners */}
                  <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl"></div>

                  {/* Animated Laser Beam */}
                  <div className={`w-full h-1 bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,1)] absolute left-0 animate-[scan_2.2s_ease-in-out_infinite] ${scanFlash ? 'hidden' : 'block'}`}></div>

                  {/* Target Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 text-white">
                    {scanFlash ? <CheckCircle2 className="w-24 h-24 text-emerald-400 animate-ping" /> : <QrCode className="w-24 h-24" />}
                  </div>
                </div>

                {/* Instructions Bar */}
                <div className="absolute bottom-6 left-0 right-0 text-center z-10">
                  <p className="text-white font-mono text-xs tracking-wider bg-black/70 inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-2xl">
                    <Target className="h-4 w-4 text-emerald-400 animate-spin" /> HƯỚNG MÃ QR VÉ VÀO KHUNG QUÉT HOẶC CHỌN MẪU BÊN DƯỚI
                  </p>
                </div>
              </div>

              {/* Quick Sample Test Bar */}
              <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-2 overflow-x-auto text-xs z-10">
                <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Quét Nhanh Mẫu:
                </span>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {[
                    { code: 'VVIP-888', name: 'Nguyễn Văn Tuấn (VVIP 01)' },
                    { code: 'VIP-999', name: 'Trần Thị Bích Ngọc (VIP 02)' },
                    { code: 'VIP-102', name: 'Phạm Minh Tuấn (VVIP 01)' },
                    { code: 'STD-405', name: 'Đặng Quốc Huy (Bàn 05)' }
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => executeCheckin(sample.code)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-mono text-xs whitespace-nowrap transition-colors"
                    >
                      {sample.code} • {sample.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Input Form */}
              <div className="p-4 md:p-5 bg-slate-900 border-t border-slate-800 z-10 relative">
                <form onSubmit={handleScanSubmit} className="flex gap-3">
                  <Input 
                    value={scanCode}
                    onChange={(e) => setScanCode(e.target.value)}
                    placeholder="Hoặc nhập thủ công mã vé / tên khách (VD: VVIP-888, VIP-102, Nguyễn Văn Tuấn)..." 
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 text-sm md:text-base font-mono" 
                  />
                  <Button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-7 h-12 font-bold shadow-lg shadow-emerald-600/30 text-xs md:text-sm shrink-0"
                  >
                    <Check className="h-4 w-4 mr-1.5" /> Xác Nhận Quét
                  </Button>
                </form>
              </div>
            </Card>

            {/* Lịch Sử Đón Khách Realtime (4 Cols) */}
            <Card className="xl:col-span-4 shadow-xl flex flex-col h-full border-slate-200 overflow-hidden rounded-2xl bg-white">
              <CardHeader className="p-4 md:p-5 border-b bg-gradient-to-r from-slate-50 to-white">
                <CardTitle className="text-base font-bold flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-900">
                      <UserCheck className="h-5 w-5 text-indigo-600"/> Lịch Sử Đón Khách Live
                    </span>
                    <Badge className="bg-emerald-100 text-emerald-800 font-black border-none text-xs">
                      {checkinLogs.length} Lượt
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span>Tiến độ sự kiện</span>
                    <span className="font-bold text-slate-800">{currentEvent?.checkedIn} / {currentEvent?.registered} Khách</span>
                  </div>
                  <Progress value={((currentEvent?.checkedIn || 1) / (currentEvent?.registered || 1)) * 100} className="h-1.5 mt-1 bg-slate-100 [&>div]:bg-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto bg-slate-50/40">
                <div className="divide-y divide-slate-100">
                  {checkinLogs.map((log, index) => {
                    const isVip = log.status === 'VIP'
                    return (
                      <div 
                        key={log.id} 
                        className={`p-4 transition-all duration-300 flex justify-between items-center bg-white ${
                          index === 0 && scanFlash ? 'bg-emerald-50 border-l-4 border-emerald-500' : 'hover:bg-slate-50 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 shadow-xs ring-1 ${
                            isVip ? 'bg-amber-100 text-amber-700 ring-amber-200' : 'bg-slate-100 text-slate-600 ring-slate-200'
                          }`}>
                            {isVip ? <Crown className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              {log.name}
                              {isVip && (
                                <Badge className="bg-amber-500 text-white text-[9px] px-1.5 py-0 font-black uppercase">
                                  VVIP
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                              <span className="font-mono font-semibold text-indigo-600">{log.ticket}</span>
                              <span>•</span>
                              <span>{log.tableNumber || 'Bàn VVIP 01'}</span>
                              <span>•</span>
                              <span className="text-[11px]">{log.seatNumber || 'A-01'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-bold text-emerald-600">{log.time}</div>
                          {log.giftReceived && (
                            <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-0.5 justify-end mt-0.5">
                              <Gift className="h-3 w-3" /> Đã nhận quà
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* CSS Animation cho tia laser */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes scan {
              0% { top: 0%; opacity: 0; }
              15% { opacity: 1; }
              85% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
          `}} />
        </TabsContent>

        {/* TAB 2: DANH SÁCH KHÁCH MỜI & THẺ VÉ ĐIỆN TỬ */}
        <TabsContent value="guests" className="space-y-6">
          
          {/* Bộ lọc khách mời */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  value={guestSearch}
                  onChange={e => setGuestSearch(e.target.value)}
                  placeholder="Tìm tên khách, SĐT, mã vé..."
                  className="pl-9 bg-slate-50 border-slate-200 text-sm"
                />
              </div>

              <select
                value={rankFilter}
                onChange={e => setRankFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">Tất cả Hạng vé</option>
                <option value="VVIP">Hạng VVIP</option>
                <option value="VIP">Hạng VIP</option>
                <option value="Tiêu Chuẩn">Tiêu Chuẩn</option>
              </select>

              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none"
              >
                <option value="all">Tất cả Trạng thái</option>
                <option value="Đã check-in">Đã Check-in</option>
                <option value="Chưa đến">Chưa Đến</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-semibold flex items-center gap-3">
              <span>Đang hiển thị: <strong>{filteredGuests.length}</strong> / {guestList.length} khách</span>
              <Button 
                onClick={() => setIsAddGuestOpen(true)}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Thêm Khách Mới
              </Button>
            </div>
          </div>

          {/* Bảng Danh Sách Khách Mời */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-xs">Mã Vé & Khách Mời</TableHead>
                  <TableHead className="font-bold text-xs">Hạng Vé</TableHead>
                  <TableHead className="font-bold text-xs">Vị Trí Ngồi</TableHead>
                  <TableHead className="font-bold text-xs">Chuyên Viên Đón</TableHead>
                  <TableHead className="font-bold text-xs">Trạng Thái</TableHead>
                  <TableHead className="font-bold text-xs">Quà Tặng Tri Ân</TableHead>
                  <TableHead className="font-bold text-xs text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.map((guest) => {
                  const isCheckedIn = guest.status === 'Đã check-in'
                  return (
                    <TableRow key={guest.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell>
                        <div className="font-bold text-slate-900 text-sm">{guest.customerName}</div>
                        <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-bold text-indigo-600">{guest.ticketCode}</span>
                          <span>•</span>
                          <span>{guest.phone}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={
                          guest.rank === 'VVIP' ? 'bg-amber-500 text-white font-black text-[10px]' :
                          guest.rank === 'VIP' ? 'bg-indigo-100 text-indigo-800 border-indigo-200 text-[10px] font-bold' :
                          'bg-slate-100 text-slate-700 border-slate-200 text-[10px]'
                        }>
                          {guest.rank}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs font-bold text-slate-800">{guest.table}</div>
                        <div className="text-[11px] text-slate-500">{guest.seat}</div>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs font-medium text-slate-700">{guest.assignedAgent}</span>
                      </TableCell>

                      <TableCell>
                        {isCheckedIn ? (
                          <div>
                            <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-bold">
                              Đã Check-in
                            </Badge>
                            <span className="block text-[10px] text-slate-400 mt-0.5">{guest.checkinTime}</span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-slate-500 text-[10px]">
                            Chưa đến
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-slate-600 line-clamp-1 max-w-[200px]" title={guest.gift}>
                          {guest.gift || 'Bộ quà tặng sự kiện'}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isCheckedIn && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => executeCheckin(guest.ticketCode)}
                              className="h-8 px-2.5 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-bold"
                            >
                              Check-in
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setPreviewTicketGuest(guest)}
                            className="h-8 px-2.5 text-xs text-indigo-600 border-indigo-200 hover:bg-indigo-50 font-bold"
                          >
                            <QrCode className="h-3.5 w-3.5 mr-1" /> Xem Vé
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 3: SƠ ĐỒ BÀN TIỆC & GHẾ NGỒI */}
        <TabsContent value="seating" className="space-y-6">
          <div className="flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200">
            <div>
              <h2 className="text-base md:text-lg font-black text-amber-950 flex items-center gap-2">
                <Armchair className="h-5 w-5 text-amber-600" /> Sơ Đồ Bàn Tiệc Khán Phòng Grand Castiglione (Ballroom)
              </h2>
              <p className="text-xs md:text-sm text-amber-800 mt-1">
                Phân bổ vị trí ngồi danh dự cho khách hàng VVIP, bàn ký cọc độc quyền và bàn đại biểu ban lãnh đạo tập đoàn.
              </p>
            </div>
            <Button 
              onClick={() => showToast('Đang đồng bộ sơ đồ chỗ ngồi với máy in thẻ đeo lễ tân.')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-10 px-4 shrink-0"
            >
              In Sơ Đồ Bàn Tiệc
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BANQUET_TABLES.map(table => {
              const isVvip = table.type === 'VVIP'
              const isVip = table.type === 'VIP'

              return (
                <Card key={table.id} className={`overflow-hidden border transition-all ${
                  isVvip ? 'border-amber-300 ring-2 ring-amber-100 shadow-md bg-amber-50/20' : 
                  isVip ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200'
                }`}>
                  <CardHeader className="p-4 border-b bg-white flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {table.name}
                        {isVvip && <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />}
                      </CardTitle>
                      <CardDescription className="text-xs">{table.location}</CardDescription>
                    </div>
                    <Badge className={
                      isVvip ? 'bg-amber-500 text-white font-black text-[10px]' :
                      isVip ? 'bg-indigo-600 text-white font-bold text-[10px]' : 'bg-slate-200 text-slate-700 text-[10px]'
                    }>
                      {table.type}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-5 space-y-4">
                    
                    {/* Visual Round Table representation */}
                    <div className="flex flex-col items-center justify-center py-2">
                      <div className="w-28 h-28 rounded-full border-4 border-dashed border-slate-300 flex items-center justify-center bg-white shadow-inner relative">
                        <span className="text-xs font-bold text-slate-700 text-center leading-tight">
                          {table.occupied} / {table.seats}<br/><span className="text-[10px] text-slate-400 font-normal">Đã Check-in</span>
                        </span>
                        
                        {/* 10 Seats surrounding table */}
                        {[...Array(table.seats)].map((_, i) => {
                          const angle = (i / table.seats) * (2 * Math.PI)
                          const x = 50 + 44 * Math.cos(angle)
                          const y = 50 + 44 * Math.sin(angle)
                          const isOccupied = i < table.occupied

                          return (
                            <div
                              key={i}
                              style={{ left: `${x}%`, top: `${y}%` }}
                              title={`Ghế ${i+1}: ${isOccupied ? 'Đã có khách' : 'Còn trống'}`}
                              className={`absolute w-4 h-4 -ml-2 -mt-2 rounded-full border flex items-center justify-center text-[8px] font-bold transition-all ${
                                isOccupied ? 'bg-emerald-500 border-emerald-600 text-white' : 'bg-slate-200 border-slate-300 text-slate-500'
                              }`}
                            >
                              {i + 1}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Tiến độ có mặt:</span>
                        <span className="font-bold text-slate-900">{Math.round((table.occupied / table.seats) * 100)}%</span>
                      </div>
                      <Progress value={(table.occupied / table.seats) * 100} className="h-1.5 bg-slate-100 [&>div]:bg-emerald-500" />
                    </div>

                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setGuestSearch(table.name)
                        setActiveTab('guests')
                        showToast(`Lọc danh sách khách mời tại ${table.name}.`)
                      }}
                      className="w-full text-xs font-bold h-8 border-slate-200 text-slate-700"
                    >
                      Xem Danh Sách Khách Tại Bàn →
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* TAB 4: DANH MỤC SỰ KIỆN */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => {
              const checkinPct = Math.round((event.checkedIn / event.registered) * 100)
              const isSelected = selectedEventId === event.id

              return (
                <Card key={event.id} className={`shadow-sm border transition-all overflow-hidden flex flex-col group ${
                  isSelected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-slate-200'
                }`}>
                  <div className={`h-28 ${event.image} relative flex items-center justify-center text-white`}>
                    <div className="flex flex-col items-center z-10">
                      <Badge className="bg-white/20 text-white backdrop-blur-md border border-white/30 text-[10px] font-bold mb-1">
                        {event.type}
                      </Badge>
                      <h4 className="text-sm font-black px-4 text-center line-clamp-1">{event.title}</h4>
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col justify-between bg-white space-y-4">
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg font-medium">
                        <Clock className="h-4 w-4 text-indigo-500 shrink-0" /> {event.date} • {event.time}
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg font-medium">
                        <MapPin className="h-4 w-4 text-rose-500 shrink-0" /> {event.location}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="text-slate-500 font-semibold">Tỷ lệ Check-in:</span>
                        <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-xs">{checkinPct}%</Badge>
                      </div>
                      <Progress value={checkinPct} className="h-2 bg-slate-100 [&>div]:bg-emerald-500" />
                      <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                        <span>Đã đón: {event.checkedIn} khách</span>
                        <span>Đăng ký: {event.registered}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => showToast(`Cài đặt cấu hình cho sự kiện ${event.title}.`)}
                        className="flex-1 text-xs font-bold"
                      >
                        Cài Đặt
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setSelectedEventId(event.id)
                          setActiveTab('scanner')
                          showToast(`Đã nạp sự kiện "${event.title}" vào trạm quét mã QR!`)
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                      >
                        Mở Trạm Quét
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

      </Tabs>

      {/* MODAL 1: TẠO SỰ KIỆN MỚI */}
      <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Ticket className="h-5 w-5 text-indigo-600" /> Khởi Tạo Sự Kiện Mở Bán Mới
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Nhập thông tin sự kiện để thiết lập khán phòng, số bàn tiệc và phát hành vé mời điện tử.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateEvent} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Tên Sự Kiện *</Label>
              <Input 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                placeholder="Ví dụ: Lễ Ra Mắt Phân Khu River Park - Aqua City" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Loại Hình Sự Kiện</Label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  <option value="Open House">Open House (Mở Bán Tập Trung)</option>
                  <option value="VIP Gala Dinner">VIP Gala Dinner (Tri Ân Khách VIP)</option>
                  <option value="Webinar">Webinar (Livestream Trực Tuyến)</option>
                  <option value="Workshop">Workshop (Tư Vấn Chuyên Sâu)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Sức Chứa Khán Phòng (Khách)</Label>
                <Input 
                  type="number" 
                  value={newCapacity} 
                  onChange={e => setNewCapacity(Number(e.target.value))} 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Ngày Tổ Chức</Label>
                <Input 
                  value={newDate} 
                  onChange={e => setNewDate(e.target.value)} 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Thời Gian Bắt Đầu</Label>
                <Input 
                  value={newTime} 
                  onChange={e => setNewTime(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Địa Điểm Tổ Chức</Label>
              <Input 
                value={newLocation} 
                onChange={e => setNewLocation(e.target.value)} 
              />
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsNewEventOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Tạo Sự Kiện
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: THÊM KHÁCH MỜI MỚI */}
      <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-600" /> Thêm Khách Mời & Cấp Vé QR
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Cấp thẻ vé mời điện tử, phân bổ bàn tiệc và cử chuyên viên đón tiếp riêng.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddGuest} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Chọn Từ Danh Bạ CRM Hoặc Nhập Mới</Label>
              <select
                onChange={e => {
                  const cust = customers.find(c => c.id === e.target.value)
                  if (cust) {
                    setNewGuestName(cust.name)
                    setNewGuestPhone(cust.phone)
                    setNewGuestEmail(cust.email)
                    setNewGuestRank(cust.rank === 'VVIP' ? 'VVIP' : cust.rank === 'VIP' ? 'VIP' : 'Tiêu Chuẩn')
                  }
                }}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium outline-none"
              >
                <option value="">-- Chọn khách hàng trong CRM --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.phone}) - {c.rank}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Họ Tên Khách Mời *</Label>
                <Input 
                  value={newGuestName} 
                  onChange={e => setNewGuestName(e.target.value)} 
                  placeholder="Nguyễn Văn A" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Số Điện Thoại Zalo *</Label>
                <Input 
                  value={newGuestPhone} 
                  onChange={e => setNewGuestPhone(e.target.value)} 
                  placeholder="0901 234 567" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Hạng Vé</Label>
                <select
                  value={newGuestRank}
                  onChange={e => setNewGuestRank(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  <option value="VVIP">Hạng VVIP</option>
                  <option value="VIP">Hạng VIP</option>
                  <option value="Tiêu Chuẩn">Tiêu Chuẩn</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Bàn Tiệc</Label>
                <select
                  value={newGuestTable}
                  onChange={e => setNewGuestTable(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  <option value="Bàn VVIP 01">Bàn VVIP 01</option>
                  <option value="Bàn VIP 02">Bàn VIP 02</option>
                  <option value="Bàn VIP 03">Bàn VIP 03</option>
                  <option value="Bàn Standard 05">Bàn Standard 05</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Số Ghế</Label>
                <Input 
                  value={newGuestSeat} 
                  onChange={e => setNewGuestSeat(e.target.value)} 
                  placeholder="Ghế A-01" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Chuyên Viên Đón Tiếp</Label>
              <Input 
                value={newGuestAgent} 
                onChange={e => setNewGuestAgent(e.target.value)} 
              />
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAddGuestOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Cấp Vé & Lưu Khách
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: XEM THẺ VÉ ĐIỆN TỬ DÁT VÀNG (LUXURY E-TICKET) */}
      <Dialog open={previewTicketGuest !== null} onOpenChange={() => setPreviewTicketGuest(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden bg-slate-950 border-amber-500/40 text-white">
          <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-amber-500/30 text-center relative overflow-hidden">
            <div className="absolute top-2 right-2">
              <Badge className="bg-amber-500 text-slate-950 font-black text-xs">
                {previewTicketGuest?.rank} PASS
              </Badge>
            </div>
            <Crown className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <div className="text-xs uppercase font-bold tracking-widest text-amber-400/80">NOVA REAL ESTATE INVITATION</div>
            <h3 className="text-lg font-black tracking-wide text-white mt-1">LỄ MỞ BÁN ĐẠI ĐÔ THỊ 2026</h3>
            <p className="text-xs text-slate-400 mt-1">{currentEvent?.location}</p>
          </div>

          <div className="p-6 space-y-5 bg-slate-950">
            {/* QR Code Centerpiece */}
            <div className="bg-white p-4 rounded-2xl w-48 h-48 mx-auto shadow-2xl flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                <path fill="currentColor" d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h10v10H40zM50 10h10v10H50zM40 20h20v10H40zM30 40h10v20H30zM40 50h20v10H40zM70 40h10v10H70zM80 50h20v10H80zM90 60h10v20H90zM70 80h20v20H70zM40 80h10v20H40zM50 70h20v10H50z" />
              </svg>
            </div>

            <div className="text-center">
              <div className="text-xs text-slate-400 font-mono">MÃ CHECK-IN</div>
              <div className="text-2xl font-black font-mono tracking-wider text-amber-400 mt-0.5">
                {previewTicketGuest?.ticketCode}
              </div>
            </div>

            {/* Guest Details Matrix */}
            <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Khách mời:</span>
                <span className="font-bold text-white text-sm">{previewTicketGuest?.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Số điện thoại:</span>
                <span className="font-mono text-slate-200">{previewTicketGuest?.phone}</span>
              </div>
              <div className="border-t border-slate-800 pt-2">
                <span className="text-slate-400 block">Bàn tiệc danh dự:</span>
                <span className="font-bold text-amber-400 text-sm">{previewTicketGuest?.table}</span>
              </div>
              <div className="border-t border-slate-800 pt-2">
                <span className="text-slate-400 block">Số ghế ngồi:</span>
                <span className="font-bold text-white text-sm">{previewTicketGuest?.seat}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => showToast(`📲 Đã gửi tin nhắn vé mời điện tử và mã QR đến Zalo ${previewTicketGuest?.customerName}!`)}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs h-10 shadow-lg"
              >
                <Send className="h-3.5 w-3.5 mr-1.5" /> Gửi Zalo VIP
              </Button>
              <Button 
                onClick={() => showToast('📥 Đã tải file thẻ vé mời điện tử PDF độ phân giải cao.')}
                variant="outline" 
                className="bg-slate-900 border-slate-700 text-white font-bold text-xs h-10"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" /> Tải PDF
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: POP-UP ĐÓN TIẾP KHÁCH VVIP THÀNH CÔNG */}
      <Dialog open={isWelcomeModalOpen} onOpenChange={setIsWelcomeModalOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden bg-white border-2 border-emerald-500 shadow-2xl">
          <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-center relative">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-white animate-bounce" />
            <Badge className="bg-amber-400 text-slate-950 font-black text-xs mb-1">
              {welcomeGuest?.rank} CHECK-IN CONFIRMED
            </Badge>
            <h2 className="text-xl md:text-2xl font-black">
              CHÀO MỪNG QUÝ KHÁCH: {welcomeGuest?.customerName}
            </h2>
            <p className="text-xs text-emerald-100 mt-1">Đã hoàn tất thủ tục điểm danh tại cổng danh dự.</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Vị Trí Bàn Tiệc:</span>
                <span className="text-base font-black text-indigo-700">{welcomeGuest?.table}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-semibold block">Số Ghế Ngồi:</span>
                <span className="text-base font-black text-slate-900">{welcomeGuest?.seat}</span>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <span className="text-xs text-slate-500 font-semibold block">Chuyên Viên Đón:</span>
                <span className="text-xs font-bold text-slate-800">{welcomeGuest?.assignedAgent}</span>
              </div>
              <div className="border-t border-slate-200 pt-2">
                <span className="text-xs text-slate-500 font-semibold block">Mã Vé:</span>
                <span className="text-xs font-mono font-bold text-slate-800">{welcomeGuest?.ticketCode}</span>
              </div>
            </div>

            {/* Special Gift Section */}
            {welcomeGuest?.gift && (
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                <Gift className="h-6 w-6 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-amber-900 block">Đặc Quyền Quà Tặng Tri Ân:</span>
                  <span className="text-amber-800 font-medium">{welcomeGuest.gift}</span>
                </div>
              </div>
            )}

            <DialogFooter className="pt-2 flex gap-2">
              <Button 
                onClick={() => {
                  showToast(`🖨️ Đang in thẻ đeo VIP Badge cho ${welcomeGuest?.customerName}...`)
                  setIsWelcomeModalOpen(false)
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10"
              >
                <Printer className="h-4 w-4 mr-1.5" /> In Thẻ Đeo Tức Thì
              </Button>
              <Button 
                onClick={() => setIsWelcomeModalOpen(false)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10"
              >
                Dẫn Khách Vào Bàn
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
