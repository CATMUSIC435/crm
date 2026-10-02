"use client"

import React, { useState, useMemo } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { 
  CheckCircle2, CircleDashed, TrendingUp, DollarSign, Users, Briefcase, 
  Phone, Mail, Calendar, ArrowRight, Target, Clock, Sparkles, MapPin,
  Send, Copy, Flame, Building2, Layers, CheckSquare, Plus, Star,
  Award, ShieldCheck, Check, UserPlus, ExternalLink, Zap
} from "lucide-react"
import { useStore } from '@/store/useStore'
import Link from 'next/link'

// Weekly performance chart data
const PERFORMANCE_DATA_WEEK = [
  { name: 'T.Hai', kpi: 2500, actual: 3200, calls: 24, viewings: 2 },
  { name: 'T.Ba', kpi: 2500, actual: 1800, calls: 30, viewings: 1 },
  { name: 'T.Tư', kpi: 2500, actual: 4100, calls: 22, viewings: 3 },
  { name: 'T.Năm', kpi: 2500, actual: 2900, calls: 28, viewings: 2 },
  { name: 'T.Sáu', kpi: 2500, actual: 5400, calls: 35, viewings: 4 },
  { name: 'T.Bảy', kpi: 3500, actual: 12500, calls: 42, viewings: 8 },
  { name: 'Chủ Nhật', kpi: 3500, actual: 7600, calls: 18, viewings: 5 },
]

export default function AgentDashboard() {
  const { 
    contracts, customers, inventory, bookingTickets, projects,
    addCustomer, makeCall 
  } = useStore()

  // Selected agent switcher state (default: Lê Hoàng Anh)
  const [selectedAgent, setSelectedAgent] = useState('Lê Hoàng Anh')
  const [selectedTab, setSelectedTab] = useState('day')

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Modals state
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false)
  const [isPriceListModalOpen, setIsPriceListModalOpen] = useState(false)
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)

  // Quick Sales Kit Form state
  const [quoteProject, setQuoteProject] = useState('p2') // Aqua City default
  const [quoteUnit, setQuoteUnit] = useState('AQC-12A.01')
  const [quoteCustomerName, setQuoteCustomerName] = useState('Anh Tuấn')

  // New Lead Form state
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    rank: 'Tiềm Năng' as const,
    interest: 'Biệt thự Aqua City'
  })

  // Checklist tasks state
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Gọi điện cho anh Nguyễn Văn Tuấn (VVIP)', desc: 'Cập nhật tiến độ cất nóc Biệt thự Florida Aqua City', phone: '0901234567', time: '09:30 AM', done: true, priority: 'high' },
    { id: 2, title: 'Đón chị Vũ Thu Trang xem sa bàn & nhà mẫu', desc: 'Hẹn lúc 14:30 tại Novaland Gallery (Sa bàn 3D)', phone: '0966554433', time: '14:30 PM', done: false, priority: 'urgent' },
    { id: 3, title: 'Bổ sung bản sao CCCD 2 mặt cho phiếu cọc', desc: 'Khách hàng hoàn tất chứng từ phiếu BK-1001', phone: '0901234567', time: '16:00 PM', done: false, priority: 'high' },
    { id: 4, title: 'Gửi bảng tính dòng tiền ngân hàng MB Bank 0%', desc: 'Phương án ân hạn 24 tháng cho khách Đặng Quốc Huy', phone: '0977889900', time: '17:30 PM', done: false, priority: 'normal' },
  ])

  // Toggle task completion
  const handleToggleTask = (taskId: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextState = !t.done
        showToast(nextState ? `✅ Đã đánh dấu hoàn thành: "${t.title}"` : `↩️ Đã chuyển lại trạng thái chưa hoàn thành.`)
        return { ...t, done: nextState }
      }
      return t
    }))
  }

  // Filter dynamic metrics for current agent
  const agentContracts = useMemo(() => {
    return contracts.filter(c => c.witnessAgent === selectedAgent || c.signer?.includes(selectedAgent))
  }, [contracts, selectedAgent])

  const agentCustomers = useMemo(() => {
    return customers.filter(c => c.assignedTo === selectedAgent)
  }, [customers, selectedAgent])

  const agentBookings = useMemo(() => {
    return (bookingTickets || []).filter(b => b.agent === selectedAgent)
  }, [bookingTickets, selectedAgent])

  // KPIs
  const monthlyTarget = 15000000000 // 15 Tỷ
  const actualRevenue = agentContracts.reduce((sum, c) => sum + c.value, 0) || 37500000000 // Fallback realistic
  const displayRevenue = selectedAgent === 'Lê Hoàng Anh' ? 37500000000 : 12500000000
  const completionRate = Math.min(100, Math.round((displayRevenue / monthlyTarget) * 100))
  const estimatedCommission = displayRevenue * 0.03 // 3%
  const activeBookingsCount = agentBookings.length || 2
  const activeCustomersCount = agentCustomers.length || 3

  // Hot Leads Radar list
  const hotLeads = [
    { id: 'c1', name: 'Nguyễn Văn Tuấn', phone: '0901234567', interest: 'Aqua City - Biệt thự đơn lập', score: 98, status: 'Nóng 🔥', tag: 'VVIP', note: 'Đã cọc 100Tr, chuẩn bị giải ngân 70%' },
    { id: 'c7', name: 'Vũ Thu Trang', phone: '0966554433', interest: 'The Grand Manhattan - Căn 3PN', score: 92, status: 'Nóng 🔥', tag: 'VIP', note: 'Hẹn xem nhà mẫu chiều nay 14:30' },
    { id: 'c3', name: 'Lê Hoàng Cường', phone: '0987654321', interest: 'Vinhomes Grand Park - Studio', score: 88, status: 'Ấm ⚡', tag: 'Tiềm Năng', note: 'Quan tâm gói vay 0% lãi suất' },
    { id: 'c8', name: 'Ngô Đức Thắng', phone: '0933221144', interest: 'Aqua City - Biệt thự ven sông', score: 85, status: 'Ấm ⚡', tag: 'Mới', note: 'Đang cân nhắc phương án thanh toán 95%' },
  ]

  // Hot Flash Units from Inventory
  const hotUnits = inventory.filter(i => i.status === 'Trống' || i.status === 'Booking').slice(0, 3)

  // Handle VoIP Quick Call
  const handleQuickCall = (leadName: string, phone: string) => {
    makeCall(phone)
    showToast(`📞 Đang thực hiện cuộc gọi VoIP tự động tới ${leadName} (${phone})...`)
  }

  // Handle Copy Zalo Sales Kit
  const handleCopyZaloMessage = (text: string) => {
    navigator.clipboard.writeText(text)
    showToast('📋 Đã sao chép nội dung báo giá vào bộ nhớ tạm! Bạn có thể dán vào Zalo gửi khách.')
  }

  // Handle Create Lead
  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLead.name || !newLead.phone) {
      alert('Vui lòng nhập tên và số điện thoại!')
      return
    }

    addCustomer({
      name: newLead.name,
      phone: newLead.phone,
      email: newLead.email || 'lead.moi@novacrm.vn',
      rank: newLead.rank,
      revenue: 0,
      assignedTo: selectedAgent,
      status: 'Đang tư vấn'
    })

    setIsAddLeadModalOpen(false)
    showToast(`🎉 Đã thêm thành công khách hàng mới "${newLead.name}" vào danh bạ phụ trách!`)
    setNewLead({ name: '', phone: '', email: '', rank: 'Tiềm Năng', interest: 'Biệt thự Aqua City' })
  }

  // Handle GPS Checkin
  const handleConfirmCheckin = () => {
    setIsCheckinModalOpen(false)
    showToast('📍 Điểm danh thành công! Tọa độ GPS: Novaland Gallery - 218 Cô Giang, Quận 1 (Thời gian: 08:30 AM).')
  }

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 1e9) {
      return `${(val / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 1 })} Tỷ`
    }
    return `${(val / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} Tr`
  }

  return (
    <div className="flex flex-col gap-6 -m-4 sm:-m-8 p-4 sm:p-8 bg-slate-50/60 dark:bg-slate-950 min-h-screen">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header Profile & Command Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-indigo-200 ring-4 ring-indigo-50 dark:ring-slate-800 shrink-0">
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" />
            <AvatarFallback className="bg-indigo-600 text-white font-bold text-lg">HA</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                Xin chào, {selectedAgent} 👋
              </h1>
              <Badge className="bg-amber-100 text-amber-800 border-none font-bold text-xs flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-amber-600" /> Top 1 Sàn Quận 1
              </Badge>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-50 text-xs font-semibold">
                Sẵn sàng đón khách 🟢
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <span>Chuyên Viên Tư Vấn Cấp Cao • Phòng Kinh Doanh 1</span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">Tỷ lệ chốt deal: 26.8%</span>
            </p>
          </div>
        </div>

        {/* Action Controls & Agent Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          
          {/* Agent Switcher */}
          <div className="w-[180px]">
            <Select value={selectedAgent} onValueChange={(val) => setSelectedAgent(val || 'Lê Hoàng Anh')}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 border-slate-200"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Lê Hoàng Anh">Lê Hoàng Anh (Senior)</SelectItem>
                <SelectItem value="Tuấn Tú">Tuấn Tú (Sales Rep)</SelectItem>
                <SelectItem value="Thanh Hà">Thanh Hà (VVIP Sales)</SelectItem>
                <SelectItem value="Minh Anh">Minh Anh (Sales Rep)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant="outline" 
            className="text-xs h-9 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
            onClick={() => setIsCheckinModalOpen(true)}
          >
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-indigo-600" /> Điểm Danh GPS
          </Button>

          <Button 
            variant="outline" 
            className="text-xs h-9 bg-white border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
            onClick={() => setIsPriceListModalOpen(true)}
          >
            <Send className="h-3.5 w-3.5 mr-1.5 text-blue-600" /> Báo Giá Nhanh
          </Button>

          <Button 
            className="text-xs h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-100"
            onClick={() => setIsAddLeadModalOpen(true)}
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" /> + Thêm Lead Mới
          </Button>
        </div>
      </div>

      {/* Tabs & Period Filter */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <TabsList className="bg-white dark:bg-slate-900 border p-1 rounded-xl shadow-xs">
            <TabsTrigger value="day" className="text-xs font-semibold px-4">Hôm Nay (Daily Focus)</TabsTrigger>
            <TabsTrigger value="week" className="text-xs font-semibold px-4">Tuần Này (Pipeline)</TabsTrigger>
            <TabsTrigger value="month" className="text-xs font-semibold px-4">Tháng Này (KPI Quota)</TabsTrigger>
          </TabsList>

          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-slate-400" /> Cập nhật tự động thời gian thực từ ERP
          </div>
        </div>

        <TabsContent value={selectedTab} className="space-y-6 m-0">
          
          {/* 5 KPI Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            
            {/* KPI 1: Doanh số thực tế vs Chỉ tiêu */}
            <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200/80 hover:shadow transition-shadow">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-indigo-600" /> Doanh số thực đạt
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-indigo-900 dark:text-indigo-200">
                    {formatCurrency(displayRevenue)}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Progress value={completionRate} className="h-1.5 bg-indigo-100" />
                    <span className="text-[10px] font-bold text-indigo-700 shrink-0">{completionRate}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Chỉ tiêu: {formatCurrency(monthlyTarget)}</p>
                </div>
              </CardContent>
            </Card>

            {/* KPI 2: Hoa hồng ước tính */}
            <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Hoa hồng tạm tính
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                    {formatCurrency(estimatedCommission)}
                  </div>
                  <p className="text-[11px] text-emerald-700/80 mt-1">Tỷ lệ net: 3.0% doanh số</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Đã tạm ứng: 350 Tr VNĐ</p>
                </div>
              </CardContent>
            </Card>

            {/* KPI 3: Booking đang giữ chỗ */}
            <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-amber-600" /> Booking đang giữ chỗ
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-amber-700 dark:text-amber-300">
                    {activeBookingsCount} <span className="text-xs font-normal text-amber-600">căn</span>
                  </div>
                  <p className="text-[11px] text-amber-700/80 mt-1">Trong hạn đếm ngược SLA</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Phiếu: BK-1001, BK-1005</p>
                </div>
              </CardContent>
            </Card>

            {/* KPI 4: Khách hàng phụ trách */}
            <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/80 shadow-sm">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-600" /> Khách hàng phụ trách
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-blue-700 dark:text-blue-300">
                    {activeCustomersCount} <span className="text-xs font-normal text-blue-600">khách</span>
                  </div>
                  <p className="text-[11px] text-blue-700/80 mt-1">2 VVIP • 1 VIP kim cương</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Sức mua dự kiến: &gt; 50 Tỷ</p>
                </div>
              </CardContent>
            </Card>

            {/* KPI 5: Tỷ lệ chuyển đổi deal */}
            <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/80 shadow-sm col-span-2 sm:col-span-1">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5 text-purple-600" /> Tỷ lệ chốt cọc
                </span>
                <div className="mt-2">
                  <div className="text-2xl font-black text-purple-700 dark:text-purple-300">26.8%</div>
                  <p className="text-[11px] text-purple-700/80 mt-1">Vượt 8.3% so với sàn</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Rank #1 Sàn Giao Dịch Q1</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* CỘT TRÁI (8 / 12) */}
            <div className="xl:col-span-8 space-y-6">
              
              {/* Widget 1: Biểu đồ Tiến Độ Tuần */}
              <Card className="shadow-sm border-slate-200/80">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-indigo-600" /> Doanh Số Bán Hàng Tuần Này (Triệu VNĐ)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      So sánh giữa doanh số thực tế đã chốt cọc so với chỉ tiêu KPI theo từng ngày.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-indigo-700 border-indigo-200 bg-indigo-50 text-[11px]">
                    Đạt 138% Target Tuần
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PERFORMANCE_DATA_WEEK} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip 
                          formatter={(value: any) => [`${value.toLocaleString()} Tr VNĐ`, '']}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                        <Bar dataKey="kpi" name="Chỉ Tiêu KPI" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={22} />
                        <Bar dataKey="actual" name="Doanh Số Thực Thu" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={22} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Widget 2: Hot Leads Radar (Khách Hàng Nóng Cần Chăm Sóc Gấp) */}
              <Card className="shadow-sm border-slate-200/80 overflow-hidden">
                <CardHeader className="pb-3 border-b bg-slate-50/70 dark:bg-slate-900 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-rose-500 animate-pulse" /> Hot Leads Radar - Khách Hàng Nóng Ưu Tiên
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Được xếp hạng tự động bởi AI CRM dựa trên điểm tương tác & tần suất mở bảng giá.
                    </p>
                  </div>
                  <Link href="/customers">
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700">
                      Xem danh bạ 360° <ArrowRight className="h-3.5 w-3.5 ml-1"/>
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {hotLeads.map((lead) => (
                      <div key={lead.id} className="p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200">
                            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xs">
                              {lead.name.substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-slate-100">{lead.name}</span>
                              <Badge className={`border-none text-[10px] font-bold py-0.2 ${
                                lead.tag === 'VVIP' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {lead.tag}
                              </Badge>
                              <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                                {lead.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Quan tâm: <strong className="text-slate-700 dark:text-slate-300">{lead.interest}</strong></p>
                            <p className="text-[11px] text-slate-400 italic mt-0.5">{lead.note}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <div className="text-center hidden md:block">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Điểm Nhiệt AI</span>
                            <span className="font-black text-indigo-600 text-sm">{lead.score}/100</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                              onClick={() => handleQuickCall(lead.name, lead.phone)}
                            >
                              <Phone className="h-3.5 w-3.5 mr-1" /> Gọi VoIP
                            </Button>

                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                              onClick={() => handleCopyZaloMessage(`Dạ em chào ${lead.name}, em Hoàng Anh bên Novaland gửi anh bảng tính thanh toán chi tiết căn hộ hôm trước anh quan tâm ạ!`)}
                            >
                              <Send className="h-3.5 w-3.5 mr-1" /> Zalo
                            </Button>

                            <Link href={`/customers/${lead.id}`}>
                              <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400 hover:text-indigo-600" title="Xem hồ sơ 360°">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Widget 3: Giỏ Hàng Nóng Vừa Mở Bán (Flash Inventory Radar) */}
              <Card className="shadow-sm border-slate-200/80">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-500 fill-amber-500" /> Giỏ Hàng Nóng Vừa Bung Mở Bán (Flash Deal)
                    </CardTitle>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Các căn hoa hậu view đẹp vừa được nhả ra rổ hàng chung với chính sách chiết khấu tốt.
                    </p>
                  </div>
                  <Link href="/inventory">
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700">
                      Rổ Hàng Toàn Dự Án <ArrowRight className="h-3.5 w-3.5 ml-1"/>
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {hotUnits.map((u) => (
                      <div key={u.id} className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 rounded-xl space-y-2 hover:border-indigo-300 transition-all">
                        <div className="flex justify-between items-start">
                          <span className="font-mono font-bold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                            {u.code}
                          </span>
                          <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300 bg-emerald-50">
                            {u.status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{u.type}</p>
                          <p className="text-[11px] text-slate-500">{u.area} m² • Hướng {u.direction || 'Đông Nam'}</p>
                        </div>
                        <div className="pt-1 border-t flex justify-between items-center text-xs">
                          <span className="font-black text-indigo-600 text-sm">{formatCurrency(u.price)}</span>
                          <Link href="/booking">
                            <Button size="sm" className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                              Booking
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* CỘT PHẢI (4 / 12) */}
            <div className="xl:col-span-4 space-y-6">
              
              {/* Widget 4: Việc Cần Làm Hôm Nay (Checklist tương tác) */}
              <Card className="shadow-sm border-indigo-200 bg-indigo-50/20 dark:bg-slate-900">
                <CardHeader className="pb-3 border-b bg-white dark:bg-slate-900 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                    <CheckSquare className="h-4 w-4 text-indigo-600"/> Nhiệm Vụ Hôm Nay ({tasks.filter(t => t.done).length}/{tasks.length})
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs text-indigo-600 hover:bg-indigo-50"
                    onClick={() => {
                      const newT = { id: Date.now(), title: 'Follow-up thêm khách hàng mới', desc: 'Ghi chú tác nghiệp buổi chiều', phone: '0901234567', time: '18:00 PM', done: false, priority: 'normal' }
                      setTasks([...tasks, newT])
                      showToast('📝 Đã thêm nhiệm vụ mới vào danh sách hôm nay!')
                    }}
                  >
                    + Thêm việc
                  </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-2.5">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      onClick={() => handleToggleTask(task.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        task.done ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 hover:border-indigo-300 shadow-xs'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {task.done ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <CircleDashed className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold ${task.done ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'}`}>
                          {task.title}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{task.desc}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px]">
                          <span className="text-slate-400 flex items-center gap-0.5"><Clock className="h-3 w-3"/> {task.time}</span>
                          {task.priority === 'urgent' && (
                            <span className="text-rose-600 font-bold bg-rose-50 px-1.5 rounded">Khẩn cấp</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Widget 5: Lịch Trình Tác Nghiệp Hôm Nay */}
              <Card className="shadow-sm border-slate-200/80">
                <CardHeader className="pb-3 border-b bg-slate-50 dark:bg-slate-900">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Calendar className="h-4 w-4 text-blue-600" /> Lịch Trình Tác Nghiệp (Timeline)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex items-start gap-3 border-l-2 border-indigo-500 pl-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100 w-[55px] shrink-0">08:30</div>
                    <div>
                      <strong className="block text-slate-800 dark:text-slate-200">Điểm danh & Họp giao ban sàn</strong>
                      <span className="text-slate-500 text-[11px]">Phòng họp 301 - Phổ biến chính sách chiết khấu 14%</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-l-2 border-emerald-500 pl-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100 w-[55px] shrink-0">10:00</div>
                    <div>
                      <strong className="block text-slate-800 dark:text-slate-200">Telesale 15 khách hàng VVIP</strong>
                      <span className="text-slate-500 text-[11px]">Danh sách khách cũ đầu tư NovaWorld</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-l-2 border-amber-500 pl-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100 w-[55px] shrink-0">14:30</div>
                    <div>
                      <strong className="block text-slate-800 dark:text-slate-200">Đón khách xem sa bàn 3D</strong>
                      <span className="text-slate-500 text-[11px]">Khách hàng: Chị Vũ Thu Trang (Sa bàn Aqua City)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-l-2 border-purple-500 pl-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100 w-[55px] shrink-0">16:30</div>
                    <div>
                      <strong className="block text-slate-800 dark:text-slate-200">Nộp hồ sơ cọc về Kế toán</strong>
                      <span className="text-slate-500 text-[11px]">Đối soát UNC 100Tr cho phiếu cọc BK-1001</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Widget 6: Cẩm Nang Bán Hàng Nhanh (Sales Tips AI) */}
              <Card className="shadow-sm border-amber-200 bg-amber-50/30 dark:bg-amber-950/20 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                  <Sparkles className="h-4 w-4 text-amber-600" /> Trợ Lý AI Gợi Ý Chốt Deal
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  "Với khách hàng anh <strong>Nguyễn Văn Tuấn</strong>, khi đề cập chiết khấu thanh toán 95% hãy nhấn mạnh ưu đãi tặng thêm gói hoàn thiện nội thất <strong>300 triệu</strong> chỉ áp dụng trong tuần này!"
                </p>
                <div className="pt-2 border-t border-amber-200/60 flex justify-between items-center text-[11px]">
                  <span className="text-amber-800 font-semibold">Tài liệu: CSBH_Aqua_T7.pdf</span>
                  <Link href="/ai-knowledge" className="text-indigo-600 font-bold hover:underline">
                    Hỏi Trợ Lý AI &rarr;
                  </Link>
                </div>
              </Card>

            </div>

          </div>

        </TabsContent>
      </Tabs>

      {/* ========================================================= */}
      {/* MODAL 1: ĐIỂM DANH GPS CHECK-IN                          */}
      {/* ========================================================= */}
      <Dialog open={isCheckinModalOpen} onOpenChange={setIsCheckinModalOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600">
              <MapPin className="h-5 w-5" />
              Điểm Danh Tác Nghiệp (GPS Check-in)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Chuyên viên:</span>
                <strong className="text-slate-900">{selectedAgent}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Địa điểm trực sàn:</span>
                <span className="font-semibold text-indigo-700">Novaland Gallery (218 Cô Giang, Q.1)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tọa độ GPS:</span>
                <span className="font-mono text-slate-700">10.7626° N, 106.6952° E</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trạng thái định vị:</span>
                <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px]">Trong bán kính hợp lệ (15m)</Badge>
              </div>
            </div>

            <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center">
              <CameraIcon className="h-8 w-8 text-slate-400 mx-auto mb-1.5" />
              <p className="font-semibold text-slate-700">Chụp ảnh xác thực khuôn mặt (FaceID)</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Hệ thống AI đối soát sinh trắc học với ảnh thẻ nhân viên</p>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsCheckinModalOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold" onClick={handleConfirmCheckin}>
              Xác Nhận Check-in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: GỬI BÁO GIÁ & SALES KIT NHANH QUA ZALO           */}
      {/* ========================================================= */}
      <Dialog open={isPriceListModalOpen} onOpenChange={setIsPriceListModalOpen}>
        <DialogContent className="sm:max-w-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-blue-600">
              <Send className="h-5 w-5" />
              Tạo Lời Nhắn Báo Giá Nhanh (Zalo / SMS)
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dự án</label>
                <Select value={quoteProject} onValueChange={(val) => setQuoteProject(val || 'p2')}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên khách hàng</label>
                <Input 
                  value={quoteCustomerName} 
                  onChange={e => setQuoteCustomerName(e.target.value)} 
                  className="h-9 text-xs" 
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mã căn hộ chào bán</label>
              <Input 
                value={quoteUnit} 
                onChange={e => setQuoteUnit(e.target.value)} 
                className="h-9 text-xs font-bold" 
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nội dung tin nhắn mẫu tạo tự động:</label>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border text-slate-700 dark:text-slate-300 font-mono text-[11px] leading-relaxed">
                Dạ em chào {quoteCustomerName}, em {selectedAgent} bên Novaland gửi anh thông tin căn {quoteUnit} thuộc dự án {projects.find(p => p.id === quoteProject)?.name || 'Aqua City'}.
                <br /><br />
                - Diện tích: 160m² ven sông<br />
                - Chiết khấu thanh toán sớm: 14% + Tặng 300Tr nội thất<br />
                - Link xem trải nghiệm thực tế ảo VR360: https://novacrm.vn/vr360/aqua-city
                <br /><br />
                Anh xem qua có gì em hỗ trợ book xe đưa anh đi trải nghiệm sa bàn nhé!
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsPriceListModalOpen(false)}>
              Đóng
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
              onClick={() => {
                handleCopyZaloMessage(`Dạ em chào ${quoteCustomerName}, em ${selectedAgent} bên Novaland gửi anh thông tin căn ${quoteUnit} thuộc dự án ${projects.find(p => p.id === quoteProject)?.name || 'Aqua City'}. Chiết khấu 14% + Tặng 300Tr nội thất. Link VR360: https://novacrm.vn/vr360/aqua-city`)
                setIsPriceListModalOpen(false)
              }}
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Sao Chép Tin Nhắn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 3: THÊM LEAD MỚI NHANH                             */}
      {/* ========================================================= */}
      <Dialog open={isAddLeadModalOpen} onOpenChange={setIsAddLeadModalOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600">
              <UserPlus className="h-5 w-5" />
              Thêm Khách Hàng Tiềm Năng Mới
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateLeadSubmit} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Họ và tên khách hàng (*)</label>
              <Input 
                placeholder="VD: Trần Văn Mạnh"
                value={newLead.name}
                onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                required
                className="h-9 text-xs" 
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Số điện thoại (*)</label>
              <Input 
                placeholder="VD: 0988123456"
                value={newLead.phone}
                onChange={e => setNewLead({ ...newLead, phone: e.target.value })}
                required
                className="h-9 text-xs" 
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phân loại phân hạng</label>
              <Select 
                value={newLead.rank} 
                onValueChange={(val) => setNewLead({ ...newLead, rank: val as any })}
              >
                <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="VVIP">VVIP Kim Cương (&gt; 20 Tỷ)</SelectItem>
                  <SelectItem value="VIP">VIP Bạch Kim (&gt; 8 Tỷ)</SelectItem>
                  <SelectItem value="Tiềm Năng">Khách Tiềm Năng</SelectItem>
                  <SelectItem value="Mới">Khách Mới Đăng Ký</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nhu cầu / Dự án quan tâm</label>
              <Input 
                placeholder="VD: Biệt thự biển NovaWorld Phan Thiết"
                value={newLead.interest}
                onChange={e => setNewLead({ ...newLead, interest: e.target.value })}
                className="h-9 text-xs" 
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddLeadModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Lưu Khách Hàng
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}
