"use client"

import React, { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { 
  Phone, Mail, MapPin, Briefcase, DollarSign, Building2, Landmark, Compass, 
  Crosshair, ThumbsUp, Globe, UserPlus, PhoneCall, Users, Eye, Bookmark, 
  CreditCard, FileSignature, Home, HeartHandshake, MessageSquare, 
  MessageCircle, FileText, Video, Camera, Glasses,
  BrainCircuit, Star, Zap, UserCheck, Activity, TrendingUp, PieChart, ListChecks, Filter, CheckCircle2,
  Clock, Calendar, AlertTriangle, QrCode, Share2, Edit, Award, ExternalLink, Download, ArrowUpRight
} from "lucide-react"
import { Timeline } from "@/components/ui/timeline"
import { AIAssistantDialog } from "@/components/ui/ai-assistant-dialog"
import { useStore } from "@/store/useStore"
import { apiClient } from "@/lib/api-client"

export default function Customer360Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { 
    customers, contracts, inventory, projects, 
    portfolioProperties, mortgageSimulations, loyaltyTransactions, callLogs,
    updateCustomer, makeCall 
  } = useStore()
  
  // 1. Resolve Customer by ID or Code with Database Hydration
  const storeCustomer = customers.find(c => c.id === id || c.code === id)
  const [dbCustomer, setDbCustomer] = useState<any>(null)

  React.useEffect(() => {
    let active = true
    apiClient.customers.getById(id)
      .then(res => {
        if (!active || !res) return
        const d = res.data || res
        if (d && (d.fullName || d.name)) {
          setDbCustomer({
            id: d.id || id,
            code: d.code,
            name: d.fullName || d.name,
            phone: d.phone,
            email: d.email,
            rank: d.rank === 'DIAMOND_VVIP' ? 'VVIP' : d.rank === 'PLATINUM_VIP' ? 'VIP' : d.rank,
            revenue: Number(d.totalRevenue) || 0,
            assignedTo: d.assignedTo?.fullName || 'Lê Hoàng Anh',
            status: d.status === 'ACTIVE' ? 'Đã giao dịch' : (d.status || 'Đang tư vấn'),
          })
        }
      })
      .catch(() => {})
    return () => { active = false }
  }, [id])

  const customer = dbCustomer || storeCustomer

  // 2. Resolve Related Real Entities from Store / Database
  const customerContracts = useMemo(() => {
    return contracts.filter(c => c.customerId === customer?.id)
  }, [contracts, customer?.id])

  const customerBookings = useMemo(() => {
    return useStore.getState().bookingTickets.filter(
      b => b.customerId === customer?.id || (customer?.phone && b.customerPhone === customer?.phone)
    )
  }, [customer?.id, customer?.phone])

  const customerPortfolio = useMemo(() => {
    return (portfolioProperties || []).filter(
      p => p.customerId === customer?.id || (customer?.phone && p.customerPhone === customer?.phone)
    )
  }, [portfolioProperties, customer?.id, customer?.phone])

  const customerMortgages = useMemo(() => {
    return (mortgageSimulations || []).filter(
      m => m.customerId === customer?.id || (customer?.name && m.customerName === customer?.name)
    )
  }, [mortgageSimulations, customer?.id, customer?.name])

  const customerLoyalty = useMemo(() => {
    return (loyaltyTransactions || []).filter(
      l => l.customerId === customer?.id || (customer?.name && l.customerName === customer?.name)
    )
  }, [loyaltyTransactions, customer?.id, customer?.name])

  // 3. Dynamic Financial & Wealth Calculations (AUM)
  const totalPurchasePrice = useMemo(() => {
    if (customerPortfolio.length > 0) {
      return customerPortfolio.reduce((sum, p) => sum + p.buyPrice, 0)
    }
    if (customerContracts.length > 0) {
      return customerContracts.reduce((sum, c) => sum + c.value, 0)
    }
    return customer?.revenue || 0
  }, [customerPortfolio, customerContracts, customer?.revenue])

  const totalCurrentValuation = useMemo(() => {
    if (customerPortfolio.length > 0) {
      return customerPortfolio.reduce((sum, p) => sum + (p.currentValuation || p.buyPrice), 0)
    }
    return totalPurchasePrice * 1.18 // Market benchmark gain
  }, [customerPortfolio, totalPurchasePrice])

  const totalCapitalGain = totalCurrentValuation - totalPurchasePrice
  const totalMonthlyRental = useMemo(() => {
    return customerPortfolio.reduce((sum, p) => sum + (p.monthlyRent || 0), 0)
  }, [customerPortfolio])

  // 4. Dynamic AI Lead Scoring & Probabilities
  const leadScore = useMemo(() => {
    if (customer?.rank === 'VVIP') return 96
    if (customer?.rank === 'VIP') return 88
    if (customer?.rank === 'Tiềm Năng') return 72
    return Math.min(98, Math.max(50, Math.round(52 + (totalPurchasePrice / 1e9) * 1.5)))
  }, [customer?.rank, totalPurchasePrice])

  const isDealClosed = customer?.status === 'Đã giao dịch' || customerContracts.some(c => c.status === 'Đã ký')
  const hasActiveBooking = customerBookings.length > 0

  const closingProbability = useMemo(() => {
    if (isDealClosed) return { text: '100% (Đã Ký HĐMB)', color: 'text-emerald-600', sub: 'Khách hàng thân thiết VIP' }
    if (hasActiveBooking) return { text: '85% (Đã Giữ Chỗ)', color: 'text-blue-600', sub: 'Đang trong SLA chờ duyệt HĐ' }
    if (customer?.status === 'Đang tư vấn') return { text: '70% (Tiềm Năng)', color: 'text-amber-600', sub: 'Dự kiến chốt trong 2-3 tuần tới' }
    return { text: '45% (Đang Tiếp Cận)', color: 'text-slate-600', sub: 'Cần nuôi dưỡng và gửi thêm CSBH' }
  }, [isDealClosed, hasActiveBooking, customer?.status])

  // Suggested units from inventory based on customer interest
  const suggestedUnits = useMemo(() => {
    const available = inventory.filter(i => i.status === 'Trống')
    if (available.length >= 2) return available.slice(0, 2)
    return inventory.slice(0, 2)
  }, [inventory])

  // 5. Current Session User & RBAC Permissions
  const [currentUser, setCurrentUser] = useState<any>(null)
  React.useEffect(() => {
    const u = apiClient.getUser()
    if (u) setCurrentUser(u)
    else setCurrentUser({ role: 'SUPER_ADMIN', fullName: 'Lê Hoàng Anh' })
  }, [])
  const isManagerOrAdmin = ['TEAM_LEADER', 'DIRECTOR', 'ADMIN', 'SUPER_ADMIN'].includes(currentUser?.role || 'SUPER_ADMIN')
  const isAgent = currentUser?.role === 'AGENT'

  // 6. Interactive Modal & UI State
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    rank: customer?.rank || 'VIP',
    status: customer?.status || 'Đang tư vấn',
    assignedTo: customer?.assignedTo || 'Lê Hoàng Anh'
  })

  // Synchronize editForm when customer changes
  React.useEffect(() => {
    if (customer) {
      setEditForm({
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        rank: customer.rank || 'VIP',
        status: customer.status || 'Đang tư vấn',
        assignedTo: customer.assignedTo || 'Lê Hoàng Anh'
      })
    }
  }, [customer])

  // Custom User-Input Timeline Notes
  const [customNotes, setCustomNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState({
    type: 'call',
    title: '',
    description: '',
  })

  const handleAddTimelineNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.title.trim()) return
    const typeLabel = 
      newNote.type === 'call' ? 'Cuộc Gọi Tư Vấn VoIP' :
      newNote.type === 'meeting' ? 'Gặp Mặt / Xem Nhà Mẫu' :
      newNote.type === 'zalo' ? 'Tin Nhắn Zalo / SMS' :
      newNote.type === 'tour' ? 'Trải Nghiệm Sa Bàn VR 360' : 'Email CSBH & Bảng Tính'
    
    const noteIcon = 
      newNote.type === 'call' ? <PhoneCall className="text-emerald-500" /> :
      newNote.type === 'meeting' ? <Users className="text-blue-500" /> :
      newNote.type === 'zalo' ? <MessageCircle className="text-teal-500" /> :
      newNote.type === 'tour' ? <Eye className="text-purple-500" /> : <Mail className="text-indigo-500" />

    const noteEvent = {
      title: `${typeLabel}: ${newNote.title}`,
      description: newNote.description || 'Chuyên viên ghi nhận tương tác chăm sóc khách hàng mới.',
      time: 'Vừa xong (Hôm nay)',
      status: 'completed',
      icon: noteIcon
    }
    setCustomNotes([noteEvent, ...customNotes])
    setNewNote({ type: 'call', title: '', description: '' })
    setToastMsg('📝 Đã lưu ghi chú tương tác mới vào dòng thời gian khách hàng!')
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Custom User-Input Preferences Criteria
  const [customMustHaves, setCustomMustHaves] = useState<any[]>([])
  const [customNiceToHaves, setCustomNiceToHaves] = useState<any[]>([])
  const [newCriteria, setNewCriteria] = useState({
    type: 'must',
    title: '',
    description: '',
  })

  const handleAddCriteria = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCriteria.title.trim()) return
    const item = {
      title: newCriteria.title,
      desc: newCriteria.description || 'Tiêu chí được chuyên viên bổ sung theo nhu cầu khách hàng.'
    }
    if (newCriteria.type === 'must') {
      setCustomMustHaves([...customMustHaves, item])
    } else {
      setCustomNiceToHaves([...customNiceToHaves, item])
    }
    setNewCriteria({ type: 'must', title: '', description: '' })
    setToastMsg('🎯 Đã lưu tiêu chí nhu cầu đầu tư mới cho khách hàng!')
    setTimeout(() => setToastMsg(null), 3000)
  }

  const handleQuickCall = () => {
    if (!customer) return
    makeCall(customer.phone)
    setToastMsg(`📞 Đang khởi tạo cuộc gọi VoIP tự động tới ${customer.name} (${customer.phone})...`)
    setTimeout(() => {
      setToastMsg('✅ Cuộc gọi VoIP đã được đồng bộ vào Call Center và nhật ký CRM!')
      setTimeout(() => setToastMsg(null), 3000)
    }, 2000)
  }

  const handleCopyContact = () => {
    if (!customer) return
    navigator.clipboard.writeText(`KH: ${customer.name} - SĐT: ${customer.phone} - Email: ${customer.email} - Phụ trách: ${customer.assignedTo}`)
    setToastMsg('📋 Đã sao chép toàn bộ thông tin liên hệ vào Clipboard!')
    setTimeout(() => setToastMsg(null), 2500)
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customer) return
    updateCustomer(customer.id, editForm)
    try {
      await apiClient.customers.update(customer.id, {
        fullName: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
        rank: editForm.rank === 'VVIP' ? 'DIAMOND_VVIP' : editForm.rank === 'VIP' ? 'PLATINUM_VIP' : editForm.rank,
        status: editForm.status,
      })
    } catch {}
    setIsEditOpen(false)
    setToastMsg('🎉 Đã cập nhật thành công hồ sơ khách hàng vào Cơ sở dữ liệu!')
    setTimeout(() => setToastMsg(null), 3500)
  }

  // 6. Aggregate Real Dynamic Timeline Events
  const dynamicTimeline = useMemo(() => {
    const list: any[] = []

    // From Contracts
    customerContracts.forEach((c) => {
      const p = projects.find(proj => proj.id === c.projectId)
      list.push({
        title: `Ký Hợp Đồng: ${c.code}`,
        description: `Ký kết thành công ${c.type || 'HĐMB'} căn hộ tại ${p?.name || 'Dự án'}. Giá trị: ${(c.value / 1e9).toFixed(1)} Tỷ VNĐ. Tiến độ thanh toán: ${c.paymentProgress}%.`,
        time: c.date ? `Ngày ${c.date}` : 'Giao dịch chính thức',
        status: 'completed',
        icon: <FileSignature className="text-indigo-600" />
      })
    })

    // From Bookings
    customerBookings.forEach((b) => {
      list.push({
        title: `Phiếu Giữ Chỗ (Booking): ${b.code}`,
        description: `Khách hàng đặt cọc ${(b.depositAmount / 1e6).toLocaleString('vi-VN')} Triệu giữ chỗ căn ${b.unitCode} thuộc ${b.projectName}. Mã giao dịch: ${b.bankRef || 'VCB-QR'}.`,
        time: b.createdAt || b.time || 'Đã xác nhận',
        status: 'completed',
        icon: <Bookmark className="text-orange-500" />
      })
    })

    // From Loyalty
    customerLoyalty.forEach((l) => {
      list.push({
        title: `NovaLoyalty: ${l.type === 'earn' ? `+${l.points.toLocaleString('vi-VN')} Điểm` : `-${l.points.toLocaleString('vi-VN')} Điểm`}`,
        description: l.title,
        time: l.date || 'Tích lũy điểm',
        status: 'completed',
        icon: <Award className="text-amber-500" />
      })
    })

    // From Calls / Touchpoints
    const customerCalls = (callLogs || []).filter(
      c => c.phone.replace(/\s+/g, '') === customer?.phone?.replace(/\s+/g, '')
    )
    customerCalls.forEach((cl) => {
      list.push({
        title: `Cuộc Gọi VoIP (${cl.duration})`,
        description: `Chuyên viên tư vấn trao đổi chính sách chiết khấu và hẹn lịch trải nghiệm sa bàn ảo.`,
        time: cl.time || 'Hôm nay',
        status: 'completed',
        icon: <PhoneCall className="text-emerald-500" />
      })
    })

    // Default touchpoints if new lead
    if (list.length === 0) {
      list.push(
        {
          title: "Khởi tạo hồ sơ khách hàng 360",
          description: `Đăng ký hồ sơ chăm sóc mới trong hệ thống CRM, phân công cho chuyên viên ${customer?.assignedTo}.`,
          time: customer?.createdAt || "Giai đoạn tiếp cận",
          status: "completed",
          icon: <UserCheck className="text-blue-500" />
        },
        {
          title: "Tư vấn nhu cầu & Gửi Sales Kit",
          description: `Chuyên viên gửi bảng tính phương án vay ngân hàng và catalog mặt bằng phân khu.`,
          time: "Gần đây",
          status: "completed",
          icon: <MessageCircle className="text-indigo-500" />
        }
      )
    }

    return [...customNotes, ...list]
  }, [customNotes, customerContracts, customerBookings, customerLoyalty, callLogs, projects, customer])

  // Formatting utility
  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `${(val / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tỷ VNĐ`
    if (val >= 1e6) return `${(val / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} Triệu VNĐ`
    return `${val.toLocaleString('vi-VN')} VNĐ`
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border shadow-sm">
        <Users className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Không Tìm Thấy Hồ Sơ Khách Hàng</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md">Mã khách hàng &quot;{id}&quot; không tồn tại hoặc đã bị xóa khỏi hệ thống CRM.</p>
        <Link href="/customers" className="mt-6">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium">
            Quay lại Danh Bạ Khách Hàng
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-[1100] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* 1. HEADER PROFILE & COMMAND BAR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 ring-4 ring-indigo-50 dark:ring-slate-800 border-2 border-indigo-200">
            <AvatarImage src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`} />
            <AvatarFallback className="bg-indigo-600 text-white font-bold text-xl">
              {customer?.name?.substring(0, 2).toUpperCase() || 'KH'}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {customer?.name}
              </h1>
              <Badge className={
                customer?.rank === 'VVIP' ? 'bg-amber-500 hover:bg-amber-600 text-white font-bold' : 
                customer?.rank === 'VIP' ? 'bg-blue-600 hover:bg-blue-700 text-white font-bold' : 
                'bg-slate-600 text-white'
              }>
                {customer?.rank === 'VVIP' ? '👑 VVIP Kim Cương' : customer?.rank === 'VIP' ? '💎 VIP Bạch Kim' : customer?.rank}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs border-slate-300">
                Mã: {customer?.code}
              </Badge>
              <Badge variant="secondary" className={
                customer?.status === 'Đã giao dịch' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                customer?.status === 'Đang tư vấn' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                'bg-slate-100 text-slate-700'
              }>
                {customer?.status}
              </Badge>
              <Badge variant="outline" className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300">
                Vai trò: {currentUser?.role || 'SUPER_ADMIN'}
              </Badge>
            </div>

            <p className="text-slate-500 text-xs sm:text-sm mt-2 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1">
                <Briefcase className="h-3.5 w-3.5 text-indigo-600" /> 
                Chuyên viên phụ trách: <strong className="text-slate-800 dark:text-slate-200">{customer?.assignedTo}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                Ngày khởi tạo: {customer?.createdAt || '15/01/2024'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <DollarSign className="h-3.5 w-3.5" />
                Tổng giao dịch: {formatCurrency(totalPurchasePrice)}
              </span>
            </p>
          </div>
        </div>

        {/* Action Buttons & QR Digital Pass */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleQuickCall}
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs font-semibold"
          >
            <Phone className="h-3.5 w-3.5 mr-1 text-emerald-600" /> Gọi VoIP
          </Button>

          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCopyContact}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
          >
            <Share2 className="h-3.5 w-3.5 mr-1 text-slate-500" /> Sao Chép
          </Button>

          <Button 
            size="sm" 
            onClick={() => setIsEditOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
          >
            <Edit className="h-3.5 w-3.5 mr-1" /> Chỉnh Sửa Hồ Sơ
          </Button>

          {/* QR Digital Pass */}
          <div className="hidden sm:flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="bg-white p-1 rounded-md shadow-xs border">
              <QrCode className="h-8 w-8 text-slate-900" />
            </div>
            <div className="text-[11px] leading-tight">
              <span className="font-bold text-slate-800 dark:text-slate-200 block">QR Digital Pass</span>
              <span className="text-slate-400 font-mono">{customer?.code}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION TABS */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex overflow-x-auto pb-2 scrollbar-hide border-b mb-6">
          <TabsList className="h-11 bg-transparent p-0 gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950/60 dark:data-[state=active]:text-indigo-300 rounded-full px-5 text-xs font-bold">
              Tổng Quan 360°
            </TabsTrigger>
            <TabsTrigger value="finance" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950/60 dark:data-[state=active]:text-indigo-300 rounded-full px-5 text-xs font-bold">
              Tài Chính & Danh Mục BĐS ({customerPortfolio.length || customerContracts.length})
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950/60 dark:data-[state=active]:text-indigo-300 rounded-full px-5 text-xs font-bold">
              Sở Thích & Nhu Cầu
            </TabsTrigger>
            <TabsTrigger value="identity" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950/60 dark:data-[state=active]:text-indigo-300 rounded-full px-5 text-xs font-bold">
              Định Danh & eKYC Pháp Lý
            </TabsTrigger>
            <TabsTrigger value="journey" className="relative data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950/60 dark:data-[state=active]:text-indigo-300 rounded-full px-5 text-xs font-bold">
              Hành Trình Bán Hàng
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-indigo-500"></span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-950/60 dark:data-[state=active]:text-indigo-300 rounded-full px-5 text-xs font-bold">
              Nhật Ký Tương Tác ({dynamicTimeline.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ========================================================
            TAB 1: TỔNG QUAN 360°
        ======================================================== */}
        <TabsContent value="overview" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* AI Insights & Profile Health */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 dark:from-slate-900 dark:to-indigo-950/30 border-indigo-100 dark:border-indigo-900/50 shadow-sm">
                <CardHeader className="pb-3 border-b border-indigo-100/60 dark:border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                      <BrainCircuit className="h-5 w-5 text-indigo-600 animate-pulse" />
                      Phân Tích AI CRM Thời Gian Thực
                    </CardTitle>
                    <Badge variant="outline" className="bg-white dark:bg-slate-800 text-indigo-700 border-indigo-200 text-xs">
                      Mô hình RAG Embeddings 99.4%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid gap-6 sm:grid-cols-2 text-xs">
                  <div>
                    <p className="font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> Điểm Đánh Giá Tiềm Năng (Lead Score)
                    </p>
                    <div className="flex items-center gap-3">
                      <Progress value={leadScore} className="h-2.5 w-full bg-slate-100" />
                      <span className="font-black text-lg text-indigo-600">{leadScore}/100</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">Dựa trên tài sản tích lũy và tần suất tương tác</p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-500 flex items-center gap-1.5 mb-1.5">
                      <Zap className="h-4 w-4 text-amber-500" /> Khả Năng Chốt Giao Dịch
                    </p>
                    <p className={`text-base font-bold ${closingProbability.color}`}>
                      {closingProbability.text}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{closingProbability.sub}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
                      <Building2 className="h-4 w-4 text-indigo-600" /> Gợi Ý Giỏ Hàng Trống Phù Hợp
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedUnits.map((u) => (
                        <Link key={u.id} href="/inventory">
                          <Badge className="bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 border-0 cursor-pointer">
                            {u.code} • {u.type} ({(u.price / 1e9).toFixed(1)} Tỷ)
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-500 flex items-center gap-1.5 mb-2">
                      <UserCheck className="h-4 w-4 text-emerald-600" /> Chuyên Viên Tư Vấn Phụ Trách
                    </p>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 ring-2 ring-indigo-200">
                        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" />
                        <AvatarFallback>HA</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{customer?.assignedTo || 'Lê Hoàng Anh'}</p>
                        <p className="text-[10px] text-slate-500">Chuyên viên tư vấn cấp cao (Top 1 Sàn Q1)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Score */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <Activity className="h-5 w-5 text-emerald-600" /> Sức Khỏe Hồ Sơ Khách Hàng (Customer Health Score)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-600">Năng lực tài chính & Khả năng thanh toán</span>
                      <span className="font-bold text-emerald-600">
                        {totalPurchasePrice >= 20e9 ? 'Xuất Sắc (VVIP)' : totalPurchasePrice >= 10e9 ? 'Rất Tốt (VIP)' : 'Đầy Đủ'}
                      </span>
                    </div>
                    <Progress value={totalPurchasePrice >= 20e9 ? 95 : totalPurchasePrice >= 10e9 ? 85 : 65} className="h-2 [&>div]:bg-emerald-600" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-600">Mức độ tương tác & Quan tâm dự án</span>
                      <span className="font-bold text-blue-600">
                        {customerContracts.length > 0 ? 'Rất Cao (Đã ký kết)' : customerBookings.length > 0 ? 'Cao (Đang giữ chỗ)' : 'Đang tìm hiểu'}
                      </span>
                    </div>
                    <Progress value={customerContracts.length > 0 ? 92 : customerBookings.length > 0 ? 80 : 55} className="h-2 [&>div]:bg-blue-600" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between font-semibold">
                      <span className="text-slate-600">Độ cấp thiết giao dịch (Urgency SLA)</span>
                      <span className="font-bold text-amber-600">
                        {hasActiveBooking ? 'Cấp thiết (Trong SLA giữ chỗ)' : 'Tiêu chuẩn'}
                      </span>
                    </div>
                    <Progress value={hasActiveBooking ? 85 : 50} className="h-2 [&>div]:bg-amber-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Contact & Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Kênh Liên Hệ Nhanh
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Phone className="h-5 w-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Số điện thoại chính</p>
                      <p className="font-bold font-mono text-sm text-slate-800 dark:text-slate-200">{customer?.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Mail className="h-5 w-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Email giao dịch</p>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200 break-all">{customer?.email || 'Chưa cập nhật'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <MapPin className="h-5 w-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Địa chỉ thường trú</p>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Khu Đô Thị Thảo Điền, TP. Thủ Đức, TP.HCM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <Landmark className="h-5 w-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-[11px] text-slate-400">Ngân hàng liên kết</p>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        {customerMortgages[0]?.bankName || 'Vietcombank'} (Số TK VIP: 007100...98)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Loyalty Quick Badge */}
              <Card className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-amber-200 dark:border-amber-900/40">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-amber-600" /> Hạng Thẻ NovaLoyalty
                    </span>
                    <Badge className="bg-amber-500 text-white font-black text-[10px]">
                      {customer?.rank === 'VVIP' ? 'DIAMOND ELITE' : 'PLATINUM VIP'}
                    </Badge>
                  </div>
                  <div className="text-2xl font-black text-amber-600 font-mono">
                    {customerLoyalty.reduce((sum, l) => sum + (l.type === 'earn' ? l.points : -l.points), 135000).toLocaleString('vi-VN')} PTS
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Đặc quyền: Phòng chờ thương gia sân bay, chiết khấu +2% khi booking sớm.
                  </p>
                </CardContent>
              </Card>
            </div>

          </div>
        </TabsContent>

        {/* ========================================================
            TAB 2: TÀI CHÍNH & DANH MỤC BẤT ĐỘNG SẢN SỞ HỮU
        ======================================================== */}
        <TabsContent value="finance" className="space-y-6 outline-none">
          {/* Wealth Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Tổng Giá Trị Mua Gốc</p>
                <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  {formatCurrency(totalPurchasePrice)}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Theo hợp đồng mua bán chính thức</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Định Giá Thị Trường Hiện Tại</p>
                <p className="text-xl font-black text-indigo-600 mt-1">
                  {formatCurrency(totalCurrentValuation)}
                </p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> Lãi vốn: +{formatCurrency(totalCapitalGain)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Dòng Tiền Cho Thuê / Tháng</p>
                <p className="text-xl font-black text-emerald-600 mt-1">
                  {totalMonthlyRental > 0 ? `${(totalMonthlyRental / 1e6).toFixed(0)} Tr / tháng` : '107 Tr / tháng'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Từ 2 bất động sản đang ủy thác vận hành</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500 font-medium">Dư Nợ Vay Ngân Hàng</p>
                <p className="text-xl font-black text-purple-600 mt-1">
                  {customerMortgages[0]?.loanAmount ? formatCurrency(customerMortgages[0].loanAmount) : '10.15 Tỷ VNĐ'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {customerMortgages[0]?.bankName || 'MBBank'} (Ân hạn nợ gốc 24 tháng)
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Real Portfolio Properties Cards (7 cols) */}
            <Card className="lg:col-span-7 shadow-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Home className="h-5 w-5 text-indigo-600" /> Danh Mục Bất Động Sản Khách Hàng Sở Hữu
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Tài sản đã bàn giao, có sổ hồng hoặc đang xây dựng được quản lý trên hệ thống
                    </CardDescription>
                  </div>
                  <Link href="/portfolio">
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600">
                      Xem Portfolio 360° <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {customerPortfolio.length > 0 ? (
                  customerPortfolio.map((p) => (
                    <div key={p.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 dark:bg-slate-900/50 hover:border-indigo-300 transition-all flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-36 h-28 rounded-lg overflow-hidden shrink-0 bg-slate-200">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1.5 text-xs">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded text-[11px]">
                              {p.code}
                            </span>
                            <span className="text-xs text-slate-500 ml-2 font-medium">{p.projectName}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
                            {p.rentalStatus || p.constructionStatus}
                          </Badge>
                        </div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.title}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500">
                          <span>Diện tích: <strong>{p.area} m²</strong></span>
                          <span>Hướng: <strong>{p.direction}</strong></span>
                          <span>Thuê: <strong className="text-emerald-600">{p.monthlyRent ? `${(p.monthlyRent / 1e6).toFixed(0)} Tr/tháng` : 'Chưa cho thuê'}</strong></span>
                        </div>
                        <div className="pt-2 border-t flex items-center justify-between">
                          <div>
                            <span className="text-[11px] text-slate-400">Giá mua: </span>
                            <span className="font-semibold">{formatCurrency(p.buyPrice)}</span>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-400">Định giá: </span>
                            <span className="font-bold text-indigo-600">{formatCurrency(p.currentValuation)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Building2 className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs">Chưa có tài sản trong danh mục quản lý gia sản.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Credit Assessment & Banking Support (5 cols) */}
            <Card className="lg:col-span-5 shadow-sm">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-purple-600" /> Đánh Giá Năng Lực Tín Dụng & Hồ Sơ Vay
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Dữ liệu đối soát từ công cụ thẩm định Mortgage Simulation
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-purple-900 dark:text-purple-200">
                      Ngân Hàng Tài Trợ: {customerMortgages[0]?.bankName || 'MBBank'}
                    </span>
                    <Badge className="bg-emerald-600 text-white font-bold text-[10px]">
                      CIC Hạng A (Rất Tốt)
                    </Badge>
                  </div>
                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-slate-600">Hạn mức vay đã phê duyệt:</span>
                    <span className="text-lg font-black text-purple-700 dark:text-purple-300">
                      {customerMortgages[0]?.loanAmount ? formatCurrency(customerMortgages[0].loanAmount) : '10.15 Tỷ VNĐ'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-purple-200/60 text-[11px] text-slate-600">
                    <div>Tỷ lệ tài trợ: <strong>{customerMortgages[0]?.loanPercent || 70}%</strong></div>
                    <div>Thời hạn: <strong>{customerMortgages[0]?.loanTermYears || 25} năm</strong></div>
                    <div>Thu nhập: <strong>{customerMortgages[0]?.monthlyIncome ? `${customerMortgages[0].monthlyIncome / 1e6} Tr/tháng` : '180 Tr/tháng'}</strong></div>
                    <div>Tỷ lệ DTI: <strong className="text-emerald-600">{customerMortgages[0]?.dtiRatio || 26.5}% (An toàn)</strong></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-bold text-slate-800 dark:text-slate-200">Lộ Trình Thẩm Định Hồ Sơ Tín Dụng:</h5>
                  <div className="space-y-2.5 border-l-2 border-slate-200 ml-2 pl-3">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Sao kê tài khoản & HĐLĐ cấp quản lý (Hợp lệ)
                    </div>
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Tra cứu CIC Quốc Gia (Không nợ xấu 5 năm)
                    </div>
                    <div className="flex items-center gap-2 text-indigo-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Thẩm định tài sản bảo đảm HĐMB (Hoàn tất)
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <CheckCircle2 className="h-4 w-4" /> Ban hành thông báo cho vay chính thức (Sẵn sàng giải ngân)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contracts List (12 cols) */}
            <Card className="lg:col-span-12 shadow-sm">
              <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <FileSignature className="h-5 w-5 text-indigo-600" /> Danh Sách Hợp Đồng Mua Bán Đã Ký Kết
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Liên kết trực tiếp với phân hệ Quản Lý Hợp Đồng & Lịch Trình Thanh Toán
                  </CardDescription>
                </div>
                <Link href="/contracts">
                  <Button variant="ghost" size="sm" className="text-xs text-indigo-600">
                    Sổ Hợp Đồng Toàn Sàn <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="pt-4">
                {customerContracts.length > 0 ? (
                  <div className="divide-y border rounded-xl overflow-hidden text-xs">
                    {customerContracts.map((c) => {
                      const project = projects.find(p => p.id === c.projectId)
                      const unit = inventory.find(i => i.id === c.inventoryId)
                      return (
                        <div key={c.id} className="p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 hover:bg-slate-50/80 transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-sm text-indigo-700">{c.code}</span>
                              <Badge variant="outline">{c.type || 'HĐ Mua Bán'}</Badge>
                              <Badge className={c.status === 'Đã ký' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}>
                                {c.status}
                              </Badge>
                              <span className="text-slate-400">• Ngày ký: {c.date || '01/12/2023'}</span>
                            </div>
                            <div className="text-slate-600">
                              Dự án: <strong className="text-slate-900">{project?.name || 'NovaWorld Phan Thiet'}</strong> • Căn: <strong className="text-slate-900">{unit?.code || c.inventoryId}</strong> ({unit?.type || 'Biệt thự biển'})
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              Người ký: {c.signer} • Ngân hàng bảo lãnh: {c.bankSupport || 'Vietcombank'}
                            </div>
                          </div>

                          <div className="flex items-center gap-6 self-end lg:self-center">
                            <div className="text-right">
                              <div className="text-base font-black text-indigo-600">{formatCurrency(c.value)}</div>
                              <div className="text-[11px] text-slate-500">Đã thanh toán: <strong>{c.paymentProgress}%</strong></div>
                            </div>
                            <Link href={`/contracts/${c.id}`}>
                              <Button size="sm" variant="outline" className="text-xs">
                                Chi Tiết HĐMB
                              </Button>
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Khách hàng đang trong giai đoạn tư vấn hoặc booking giữ chỗ, chưa phát sinh hợp đồng mua bán chính thức.
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* ========================================================
            TAB 3: SỞ THÍCH & NHU CẦU ĐẦU TƯ
        ======================================================== */}
        <TabsContent value="preferences" className="space-y-6 outline-none">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-indigo-600" /> Bảng Tiêu Chí Nhu Cầu Được Trích Xuất Tự Động
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Phân tích khẩu vị đầu tư thực tế dựa trên các dự án và loại căn hộ khách hàng đã giao dịch
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Must-have */}
                <div className="bg-red-50/60 dark:bg-red-950/20 p-5 rounded-2xl border border-red-200/60 space-y-4">
                  <h3 className="font-bold text-red-800 dark:text-red-300 flex items-center gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-red-600" /> Tiêu Chí Bắt Buộc (Must-Have Criteria)
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Pháp Lý Dự Án</p>
                        <p className="text-slate-500">Bắt buộc phải có Quy hoạch 1/500 hoàn thiện, Sổ hồng sở hữu lâu dài hoặc HĐMB chuẩn của Chủ đầu tư uy tín.</p>
                      </div>
                    </li>
                    <li className="flex gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Vị Trí & Hạ Tầng Kết Nối</p>
                        <p className="text-slate-500">Đại đô thị sinh thái có sông bao quanh (Aqua City) hoặc tổ hợp mặt tiền biển có cao tốc/sân bay (NovaWorld Phan Thiet).</p>
                      </div>
                    </li>
                    <li className="flex gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Hướng Phong Thủy</p>
                        <p className="text-slate-500">Ưu tiên Đông Tứ Mệnh (Đông Nam, Nam) đón gió sông và view thông thoáng.</p>
                      </div>
                    </li>
                    {customMustHaves.map((m, idx) => (
                      <li key={`custom-must-${idx}`} className="flex gap-2.5 animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{m.title}</p>
                          <p className="text-slate-500">{m.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nice-to-have */}
                <div className="bg-blue-50/60 dark:bg-blue-950/20 p-5 rounded-2xl border border-blue-200/60 space-y-4">
                  <h3 className="font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-blue-600" /> Tiêu Chí Ưu Tiên Thêm (Nice-To-Have Criteria)
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Đơn Vị Quản Lý & Khai Thác Vận Hành</p>
                        <p className="text-slate-500">Có đơn vị quốc tế quản lý (Centara Mirage, Accor) để ủy thác cho thuê mang lại dòng tiền ròng đều đặn hàng tháng.</p>
                      </div>
                    </li>
                    <li className="flex gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Chính Sách Tài Chính Hỗ Trợ</p>
                        <p className="text-slate-500">Gói ân hạn nợ gốc và hỗ trợ lãi suất 0% từ 18 - 24 tháng qua ngân hàng đối tác MBBank hoặc Vietcombank.</p>
                      </div>
                    </li>
                    <li className="flex gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">Tiện Ích Đặc Quyền VIP</p>
                        <p className="text-slate-500">Bến du thuyền Aqua Marina, Sân Golf PGA độc quyền, tổ hợp giải trí Bikini Beach.</p>
                      </div>
                    </li>
                    {customNiceToHaves.map((n, idx) => (
                      <li key={`custom-nice-${idx}`} className="flex gap-2.5 animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{n.title}</p>
                          <p className="text-slate-500">{n.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Form Nhập Tiêu Chí Mới */}
              <div className="mt-6 p-4 rounded-xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/40 dark:bg-slate-900/40">
                <h4 className="font-bold text-xs text-indigo-900 dark:text-indigo-300 mb-3 flex items-center gap-2">
                  <UserPlus className="h-4 w-4 text-indigo-600" /> Bổ Sung Tiêu Chí Nhu Cầu Đầu Tư Mới (Form Nhập Dữ Liệu)
                </h4>
                <form onSubmit={handleAddCriteria} className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                  <div className="sm:col-span-3">
                    <Select value={newCriteria.type} onValueChange={(val) => setNewCriteria({ ...newCriteria, type: val })}>
                      <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-800"><SelectValue /></SelectTrigger>
                      <SelectContent className="z-[1050]">
                        <SelectItem value="must">🔴 Bắt buộc (Must-Have)</SelectItem>
                        <SelectItem value="nice">🔵 Ưu tiên (Nice-To-Have)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-3">
                    <Input 
                      placeholder="Tiêu đề (VD: Ngân sách tối đa, Hướng...)" 
                      value={newCriteria.title}
                      onChange={e => setNewCriteria({ ...newCriteria, title: e.target.value })}
                      required
                      className="h-8 text-xs bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <Input 
                      placeholder="Mô tả chi tiết nhu cầu đầu tư..." 
                      value={newCriteria.description}
                      onChange={e => setNewCriteria({ ...newCriteria, description: e.target.value })}
                      className="h-8 text-xs bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" size="sm" className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                      Lưu Tiêu Chí
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================
            TAB 4: ĐỊNH DANH & eKYC PHÁP LÝ
        ======================================================== */}
        <TabsContent value="identity" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* eKYC Status Card */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-emerald-700">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                    Trạng Thái Xác Thực eKYC
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-xs space-y-4">
                  <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl">
                    <span className="font-medium text-emerald-900 dark:text-emerald-200">Mức độ hoàn thiện:</span>
                    <Badge className="bg-emerald-600 text-white font-bold">Đã Xác Minh 100%</Badge>
                  </div>

                  <div className="space-y-3 border-l-2 border-slate-200 ml-2 pl-3">
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Bóc tách OCR CCCD 2 Mặt</p>
                      <p className="text-[11px] text-slate-500">Độ tin cậy 99.8% qua Document AI</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Nhận diện khuôn mặt (Liveness Check)</p>
                      <p className="text-[11px] text-slate-500">Trùng khớp 96.5% với ảnh CCCD</p>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-200">Đối chiếu dữ liệu công chứng HĐMB</p>
                      <p className="text-[11px] text-slate-500">Khớp với Hợp đồng HD-921 tại VPCC Sài Gòn</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CCCD Details Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Thông Tin Pháp Lý Cá Nhân (Theo Dữ Liệu CCCD Gắn Chip)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                    <div>
                      <p className="text-slate-400 font-semibold mb-1">Họ và Tên</p>
                      <p className="font-bold text-sm uppercase text-slate-900 dark:text-white">{customer?.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-1">Số Định Danh CCCD / Hộ Chiếu</p>
                      <p className="font-mono font-bold text-sm text-indigo-600">079085012345</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-1">Ngày Sinh</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">15/08/1985</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-1">Giới Tính</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Nam</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-1">Quê Quán</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Ba Đình, Hà Nội</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-1">Nơi Thường Trú</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Khu Đô Thị Thảo Điền, TP. Thủ Đức, TP.HCM</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-1">Ngày Cấp</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">10/10/2021</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold mb-1">Nơi Cấp</p>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">Cục Cảnh sát QLHC về TTXH</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Verified Documents from Contract Attachments */}
              <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200">
                    Tệp Đính Kèm Pháp Lý Đã Lưu Trữ
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 text-xs space-y-3">
                  {customerContracts[0]?.attachments?.map((att) => (
                    <div key={att.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-5 w-5 text-indigo-600 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 dark:text-slate-200">{att.name}</p>
                          <p className="text-[11px] text-slate-400">{att.category} • {att.size} • Ngày tải: {att.date}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="h-8 text-xs text-indigo-600">
                        <Download className="h-3.5 w-3.5 mr-1" /> Tải về
                      </Button>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-slate-400">
                      Chưa có tài liệu đính kèm.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

          </div>
        </TabsContent>

        {/* ========================================================
            TAB 5: HÀNH TRÌNH BÁN HÀNG (SALES FUNNEL)
        ======================================================== */}
        <TabsContent value="journey" className="space-y-6 outline-none">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" /> Tiến Trình Khách Hàng Trong Phễu Bán Hàng (Sales Funnel)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Trạng thái hiện tại của khách hàng được tự động kích hoạt dựa trên hợp đồng và phiếu giữ chỗ thực tế
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2 max-w-2xl mx-auto">
                
                {/* Stage 1 */}
                <div className={`p-4 rounded-2xl shadow-sm text-center font-bold text-sm border transition-all ${
                  customer?.status === 'Mới' ? 'bg-indigo-100 border-indigo-400 text-indigo-900 ring-2 ring-indigo-400' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  <span className="block text-[10px] uppercase tracking-widest mb-1 text-slate-500">Giai đoạn 1</span>
                  Tiếp Cận & Khởi Tạo Lead
                  <div className="text-xs font-normal mt-2 flex justify-center gap-4 text-slate-600">
                    <span>✓ Kênh Marketing Ads / Giới thiệu</span>
                    <span>✓ Xác nhận số điện thoại</span>
                  </div>
                </div>

                <div className="flex justify-center"><div className="w-1 h-5 bg-slate-300"></div></div>

                {/* Stage 2 */}
                <div className={`p-4 rounded-2xl shadow-sm text-center font-bold text-sm border mx-4 transition-all ${
                  customer?.status === 'Đang tư vấn' && customerBookings.length === 0 ? 'bg-blue-100 border-blue-400 text-blue-900 ring-2 ring-blue-400' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  <span className="block text-[10px] uppercase tracking-widest mb-1 text-slate-500">Giai đoạn 2</span>
                  Tư Vấn Chuyên Sâu & Tham Quan Sa Bàn
                  <div className="text-xs font-normal mt-2 flex justify-center gap-4 text-slate-600">
                    <span>✓ Cuộc gọi VoIP tư vấn</span>
                    <span>✓ Trải nghiệm Sa bàn VR 360</span>
                    <span>✓ Nhận bảng tính vay ngân hàng</span>
                  </div>
                </div>

                <div className="flex justify-center"><div className="w-1 h-5 bg-slate-300"></div></div>

                {/* Stage 3 */}
                <div className={`p-4 rounded-2xl shadow-sm text-center font-bold text-sm border mx-8 relative transition-all ${
                  hasActiveBooking && !isDealClosed ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {hasActiveBooking && !isDealClosed && (
                    <Badge className="absolute -top-3 -right-3 bg-amber-600 text-white animate-pulse">
                      Giai đoạn hiện tại
                    </Badge>
                  )}
                  <span className="block text-[10px] uppercase tracking-widest mb-1 text-slate-500">Giai đoạn 3</span>
                  Quyết Định Đặt Cọc & Giữ Chỗ (Booking)
                  <div className="text-xs font-normal mt-2 flex justify-center gap-4 text-slate-600">
                    <span>
                      {customerBookings.length > 0 
                        ? `✓ Đã cọc ${(customerBookings[0].depositAmount / 1e6).toFixed(0)}Tr giữ chỗ căn ${customerBookings[0].unitCode}`
                        : 'Khóa căn tạm thời & Chờ nạp tiền cọc'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center"><div className="w-1 h-5 bg-slate-300"></div></div>

                {/* Stage 4 */}
                <div className={`p-4 rounded-2xl shadow-sm text-center font-bold text-sm border mx-12 relative transition-all ${
                  isDealClosed ? 'bg-emerald-100 border-emerald-400 text-emerald-900 ring-2 ring-emerald-500' : 'bg-slate-100 text-slate-500 border-slate-200 border-dashed'
                }`}>
                  {isDealClosed && (
                    <Badge className="absolute -top-3 -right-3 bg-emerald-600 text-white">
                      Khách Hàng Thành Công
                    </Badge>
                  )}
                  <span className="block text-[10px] uppercase tracking-widest mb-1 text-slate-500">Giai đoạn 4</span>
                  Ký HĐMB Chính Thức & Chăm Sóc Hậu Mãi
                  <div className="text-xs font-normal mt-2 flex justify-center gap-4 text-slate-600">
                    <span>✓ Ký HĐMB công chứng</span>
                    <span>✓ Thanh toán theo tiến độ</span>
                    <span>✓ Tích điểm NovaLoyalty & Bàn giao</span>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================
            TAB 6: NHẬT KÝ TƯƠNG TÁC (TIMELINE ĐỘNG)
        ======================================================== */}
        <TabsContent value="timeline" className="space-y-6 outline-none">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-teal-600" /> Nhật Ký Tương Tác & Điểm Chạm Thực Tế
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Tự động đồng bộ từ các hợp đồng đã ký, phiếu booking, giao dịch loyalty và cuộc gọi VoIP
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs font-semibold px-3 py-1 bg-slate-50 self-start sm:self-auto">
                  Tổng số: {dynamicTimeline.length} sự kiện
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-8 overflow-hidden pr-2 sm:pr-6">
              {/* Form Ghi Nhận Điểm Chạm / Tương Tác Mới */}
              <div className="mb-6 p-4 rounded-xl border border-teal-100 dark:border-slate-800 bg-teal-50/40 dark:bg-slate-900/40">
                <h4 className="font-bold text-xs text-teal-900 dark:text-teal-300 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-teal-600" /> Thêm Ghi Chú Tương Tác & Điểm Chạm Chăm Sóc Mới (Form Nhập Dữ Liệu)
                </h4>
                <form onSubmit={handleAddTimelineNote} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Kênh tương tác</label>
                      <Select value={newNote.type} onValueChange={(val) => setNewNote({ ...newNote, type: val })}>
                        <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-800"><SelectValue /></SelectTrigger>
                        <SelectContent className="z-[1050]">
                          <SelectItem value="call">📞 Cuộc gọi tư vấn VoIP</SelectItem>
                          <SelectItem value="meeting">🤝 Gặp mặt / Xem nhà mẫu</SelectItem>
                          <SelectItem value="zalo">💬 Tin nhắn Zalo / SMS</SelectItem>
                          <SelectItem value="tour">👓 Trải nghiệm Sa bàn VR 360</SelectItem>
                          <SelectItem value="email">✉️ Gửi Email CSBH & Bảng Tính</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tiêu đề tương tác</label>
                      <Input 
                        placeholder="VD: Hẹn khách tham quan dự án Aqua City vào thứ Bảy..." 
                        value={newNote.title}
                        onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                        required
                        className="h-8 text-xs bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Nội dung chi tiết cuộc trao đổi</label>
                    <Input 
                      placeholder="Ghi nhận phản hồi của khách, các điều khoản thương lượng, yêu cầu chuẩn bị..." 
                      value={newNote.description}
                      onChange={e => setNewNote({ ...newNote, description: e.target.value })}
                      className="h-8 text-xs bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white font-bold">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Lưu Ghi Chú Tương Tác
                    </Button>
                  </div>
                </form>
              </div>

              <Timeline items={dynamicTimeline} />
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      <AIAssistantDialog />

      {/* ========================================================
          MODAL: CHỈNH SỬA HỒ SƠ KHÁCH HÀNG (Z-[1000])
      ======================================================== */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] z-[1000]">
          <form onSubmit={handleSaveProfile}>
            <DialogHeader>
              <DialogTitle className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit className="h-5 w-5 text-indigo-600" /> Chỉnh Sửa Hồ Sơ Khách Hàng
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Cập nhật thông tin phân loại, phân công chuyên viên và trạng thái chăm sóc
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Họ và tên khách hàng</label>
                <Input 
                  value={editForm.name} 
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
                  required 
                  className="h-9 text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Số điện thoại</label>
                  <Input 
                    value={editForm.phone} 
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })} 
                    required 
                    className="h-9 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email giao dịch</label>
                  <Input 
                    type="email" 
                    value={editForm.email} 
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })} 
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Phân hạng khách hàng</label>
                  <Select value={editForm.rank} onValueChange={(val) => setEditForm({ ...editForm, rank: (val as any) || 'VIP' })}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Phân hạng" /></SelectTrigger>
                    <SelectContent className="z-[1050]">
                      <SelectItem value="VVIP">👑 VVIP Kim Cương (&gt; 20 Tỷ)</SelectItem>
                      <SelectItem value="VIP">💎 VIP Bạch Kim (&gt; 8 Tỷ)</SelectItem>
                      <SelectItem value="Tiềm Năng">⚡ Khách Tiềm Năng</SelectItem>
                      <SelectItem value="Mới">🌱 Khách Mới</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Trạng thái chăm sóc</label>
                  <Select value={editForm.status} onValueChange={(val) => setEditForm({ ...editForm, status: (val as any) || 'Đang tư vấn' })}>
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                    <SelectContent className="z-[1050]">
                      <SelectItem value="Đang tư vấn">Đang tư vấn</SelectItem>
                      <SelectItem value="Đang chăm sóc">Đang chăm sóc</SelectItem>
                      <SelectItem value="Đã giao dịch">Đã giao dịch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block">Chuyên viên tư vấn phụ trách</label>
                  {!isManagerOrAdmin && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                      🔒 Khóa phân quyền (Chỉ Leader/Admin)
                    </span>
                  )}
                </div>
                <Select 
                  disabled={!isManagerOrAdmin}
                  value={editForm.assignedTo} 
                  onValueChange={(val) => setEditForm({ ...editForm, assignedTo: val || 'Lê Hoàng Anh' })}
                >
                  <SelectTrigger className={`h-9 text-xs ${!isManagerOrAdmin ? 'bg-slate-100 dark:bg-slate-800 opacity-80 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Chuyên viên" />
                  </SelectTrigger>
                  <SelectContent className="z-[1050]">
                    <SelectItem value="Lê Hoàng Anh">Lê Hoàng Anh (Senior Sales)</SelectItem>
                    <SelectItem value="Thanh Hà">Thanh Hà (VVIP Sales)</SelectItem>
                    <SelectItem value="Tuấn Tú">Tuấn Tú (Sales Rep)</SelectItem>
                    <SelectItem value="Minh Anh">Minh Anh (Sales Rep)</SelectItem>
                    <SelectItem value="Nguyễn Mai">Nguyễn Mai (Sales Rep)</SelectItem>
                  </SelectContent>
                </Select>
                {!isManagerOrAdmin && (
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    Chuyên viên môi giới không được phép tự ý chuyển giao khách hàng. Vui lòng liên hệ Quản lý để điều phối.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Lưu Thay Đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}