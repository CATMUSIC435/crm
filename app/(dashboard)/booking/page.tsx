"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { 
  CheckCircle2, Clock, ChevronRight, Check, User, Users, Briefcase, 
  CreditCard, UserCircle2, XCircle, AlertTriangle, Paperclip, Filter, Search,
  Download, Plus, Building2, Phone, Mail, FileText, ArrowRight,
  ShieldCheck, HelpCircle, Layers, Coins, Calendar, RefreshCw, Send,
  FileCheck2, CheckSquare, Sparkles, AlertCircle
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { BookingTicket } from '@/types'

// Define the steps in the workflow
const COLUMNS = [
  { id: 'sale', label: '1. Khởi Tạo (Sale)', icon: User, color: 'border-slate-300', bg: 'bg-slate-100', text: 'text-slate-700', badgeBg: 'bg-slate-200 text-slate-800' },
  { id: 'manager', label: '2. Quản Lý Duyệt', icon: Users, color: 'border-blue-300', bg: 'bg-blue-100', text: 'text-blue-700', badgeBg: 'bg-blue-200 text-blue-800' },
  { id: 'director', label: '3. GĐ Khối Duyệt', icon: Briefcase, color: 'border-purple-300', bg: 'bg-purple-100', text: 'text-purple-700', badgeBg: 'bg-purple-200 text-purple-800' },
  { id: 'payment', label: '4. Chờ Kế Toán', icon: CreditCard, color: 'border-amber-300', bg: 'bg-amber-100', text: 'text-amber-700', badgeBg: 'bg-amber-200 text-amber-800' },
  { id: 'done', label: '5. Đã Khóa Căn', icon: CheckCircle2, color: 'border-emerald-400', bg: 'bg-emerald-100', text: 'text-emerald-700', badgeBg: 'bg-emerald-200 text-emerald-800' },
]

export default function BookingWorkflowPage() {
  const { 
    customers, projects, inventory, bookingTickets,
    addBookingTicket, updateBookingTicketStatus, rejectBookingTicket, extendBookingSLA
  } = useStore()

  // Filters state
  const [projectFilter, setProjectFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<BookingTicket | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [ticketToReject, setTicketToReject] = useState<string | null>(null)

  // New Booking Form State
  const [newBooking, setNewBooking] = useState({
    customerId: '',
    customerName: '',
    customerPhone: '',
    projectId: '',
    unitId: '',
    unitCode: '',
    price: 0,
    depositAmount: 100000000,
    type: 'Giữ chỗ có hoàn lại' as BookingTicket['type'],
    priority: 'normal' as BookingTicket['priority'],
    paymentMethod: 'Chuyển khoản' as BookingTicket['paymentMethod'],
    agent: 'Lê Hoàng Anh',
    notes: 'Khách hàng chuyển khoản giữ chỗ qua QR Code Vietcombank'
  })

  // List of active tickets from store
  const tickets: BookingTicket[] = bookingTickets || []

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesProject = projectFilter === 'all' || 
        t.projectId === projectFilter || 
        t.projectName.toLowerCase().includes(projectFilter.toLowerCase())
      
      const matchesAgent = agentFilter === 'all' || 
        t.agent.toLowerCase().includes(agentFilter.toLowerCase())
      
      const matchesType = typeFilter === 'all' || t.type === typeFilter
      
      const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q || 
        t.id.toLowerCase().includes(q) ||
        t.customerName.toLowerCase().includes(q) || 
        (t.customerPhone && t.customerPhone.includes(q)) ||
        t.unitCode.toLowerCase().includes(q) ||
        t.projectName.toLowerCase().includes(q)

      return matchesProject && matchesAgent && matchesType && matchesPriority && matchesSearch
    })
  }, [tickets, projectFilter, agentFilter, typeFilter, priorityFilter, searchQuery])

  // KPIs
  const totalCount = tickets.length
  const waitingApprovalCount = tickets.filter(t => t.status === 'manager' || t.status === 'director').length
  const waitingPaymentCount = tickets.filter(t => t.status === 'payment').length
  const doneCount = tickets.filter(t => t.status === 'done').length
  const totalDepositAmount = tickets.reduce((sum, t) => sum + (t.depositAmount || 0), 0)

  // Format currency
  const formatCurrency = (val: number) => {
    if (val >= 1000000000) {
      return `${(val / 1000000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} Tỷ`
    }
    return `${(val / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} Triệu`
  }

  // Handle advance ticket step
  const handleApprove = (ticketId: string, currentStatus: string) => {
    const currentIndex = COLUMNS.findIndex(col => col.id === currentStatus)
    if (currentIndex < COLUMNS.length - 1) {
      const nextStep = COLUMNS[currentIndex + 1]
      const nextStatus = nextStep.id as BookingTicket['status']
      
      updateBookingTicketStatus(ticketId, nextStatus, `Chuyển duyệt sang bước ${nextStep.label}`, 'Quản trị viên')
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(prev => prev ? { ...prev, status: nextStatus } : null)
      }
      
      if (nextStatus === 'done') {
        showToast(`🎉 Chúc mừng! Phiếu ${ticketId} đã hoàn tất đặt cọc và chính thức khóa căn thành công!`)
      } else {
        showToast(`✅ Đã chuyển thành công phiếu ${ticketId} sang bước "${nextStep.label}".`)
      }
    }
  }

  // Open Reject Dialog
  const handleOpenReject = (ticketId: string) => {
    setTicketToReject(ticketId)
    setRejectReason('')
    setIsRejectDialogOpen(true)
  }

  // Confirm Reject
  const handleConfirmReject = () => {
    if (!ticketToReject) return
    rejectBookingTicket(ticketToReject, rejectReason || 'Hồ sơ chưa đạt yêu cầu, trả về Sale hoàn thiện bổ sung', 'Quản lý phê duyệt')
    setIsRejectDialogOpen(false)
    if (selectedTicket && selectedTicket.id === ticketToReject) {
      setSelectedTicket(prev => prev ? { ...prev, status: 'sale' } : null)
    }
    showToast(`⚠️ Phiếu ${ticketToReject} đã bị từ chối và trả về bước Khởi Tạo (Sale).`)
    setTicketToReject(null)
  }

  // Handle SLA Extension
  const handleExtendSLA = (ticketId: string, minutes: number = 30) => {
    extendBookingSLA(ticketId, minutes, 'Khách hàng xin thêm thời gian thu xếp tài chính')
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(prev => prev ? { 
        ...prev, 
        remainingMinutes: (prev.remainingMinutes || 30) + minutes,
        expiresAt: `Gia hạn +${minutes}p (${(prev.remainingMinutes || 30) + minutes} phút còn lại)`
      } : null)
    }
    showToast(`⏱️ Đã gia hạn thêm ${minutes} phút SLA cho phiếu ${ticketId}.`)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Mã Booking', 'Khách Hàng', 'Số Điện Thoại', 'Dự Án', 'Mã Căn', 
      'Giá Trị BĐS (VNĐ)', 'Tiền Giữ Chỗ (VNĐ)', 'Trạng Thái', 'Loại Booking', 
      'Mức Ưu Tiên', 'PT Thanh Toán', 'Sale Phụ Trách', 'Hạn Giữ Chỗ'
    ]

    const statusMap: Record<string, string> = {
      sale: '1. Khởi Tạo (Sale)',
      manager: '2. Quản Lý Duyệt',
      director: '3. GĐ Khối Duyệt',
      payment: '4. Chờ Kế Toán',
      done: '5. Đã Khóa Căn'
    }

    const rows = filteredTickets.map(t => [
      t.id,
      `"${t.customerName}"`,
      `"${t.customerPhone || ''}"`,
      `"${t.projectName}"`,
      t.unitCode,
      t.price,
      t.depositAmount,
      statusMap[t.status] || t.status,
      `"${t.type}"`,
      t.priority === 'urgent' ? 'Quá hạn SLA' : t.priority === 'high' ? 'Gấp' : 'Bình thường',
      `"${t.paymentMethod}"`,
      `"${t.agent}"`,
      `"${t.expiresAt}"`
    ])

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Danh_Sach_Booking_NovaCRM_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('📥 Đã xuất thành công danh sách Booking ra file CSV UTF-8!')
  }

  // Handle Project Change in Add Form
  const handleSelectProjectForNewBooking = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId)
    setNewBooking(prev => ({
      ...prev,
      projectId,
      unitId: '',
      unitCode: '',
      price: 0
    }))
  }

  // Handle Unit Selection in Add Form
  const handleSelectUnitForNewBooking = (unitId: string) => {
    const unit = inventory.find(i => i.id === unitId)
    if (unit) {
      setNewBooking(prev => ({
        ...prev,
        unitId: unit.id,
        unitCode: unit.code,
        price: unit.price
      }))
    }
  }

  // Handle Customer Selection in Add Form
  const handleSelectCustomerForNewBooking = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId)
    if (cust) {
      setNewBooking(prev => ({
        ...prev,
        customerId: cust.id,
        customerName: cust.name,
        customerPhone: cust.phone
      }))
    }
  }

  // Submit New Booking
  const handleCreateBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBooking.customerId || !newBooking.projectId || !newBooking.unitId) {
      alert('Vui lòng chọn đầy đủ Khách hàng, Dự án và Mã căn hộ!')
      return
    }

    const proj = projects.find(p => p.id === newBooking.projectId)
    const cust = customers.find(c => c.id === newBooking.customerId)

    addBookingTicket({
      customerId: newBooking.customerId,
      customerName: newBooking.customerName || cust?.name || 'Khách Hàng Mới',
      customerPhone: newBooking.customerPhone || cust?.phone || '0900000000',
      customerEmail: cust?.email || '',
      projectId: newBooking.projectId,
      projectName: proj?.name || 'Dự án Nova',
      unitId: newBooking.unitId,
      unitCode: newBooking.unitCode,
      price: newBooking.price,
      depositAmount: Number(newBooking.depositAmount) || 100000000,
      status: 'sale',
      type: newBooking.type,
      priority: newBooking.priority,
      paymentMethod: newBooking.paymentMethod,
      docs: '3/4',
      agent: newBooking.agent,
      time: 'Vừa xong',
      expiresAt: 'Còn 60 phút',
      remainingMinutes: 60,
      bankRef: `VCB-${Math.floor(100000000 + Math.random() * 900000000)}`,
      notes: newBooking.notes
    })

    setIsAddModalOpen(false)
    showToast(`🎉 Đã khởi tạo thành công phiếu booking cho căn ${newBooking.unitCode}!`)
    
    // Reset form
    setNewBooking({
      customerId: '',
      customerName: '',
      customerPhone: '',
      projectId: '',
      unitId: '',
      unitCode: '',
      price: 0,
      depositAmount: 100000000,
      type: 'Giữ chỗ có hoàn lại',
      priority: 'normal',
      paymentMethod: 'Chuyển khoản',
      agent: 'Lê Hoàng Anh',
      notes: 'Khách hàng chuyển khoản giữ chỗ qua QR Code Vietcombank'
    })
  }

  // Priority Badge Helper
  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') {
      return (
        <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none text-[11px] font-semibold py-0.5">
          <AlertTriangle className="h-3 w-3 mr-1 animate-pulse text-rose-600"/> SLA: Quá Hạn
        </Badge>
      )
    }
    if (priority === 'high') {
      return (
        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none text-[11px] font-semibold py-0.5">
          <Clock className="h-3 w-3 mr-1 text-amber-700"/> Xử Lý Gấp (30p)
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="text-slate-500 border-slate-200 text-[11px] py-0.5 font-normal">
        <Clock className="h-3 w-3 mr-1 text-slate-400"/> Tiêu chuẩn
      </Badge>
    )
  }

  // Type Badge Helper
  const getTypeBadge = (type: string) => {
    if (type.includes('Ký HĐ')) {
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-none text-[11px]">{type}</Badge>
    }
    if (type.includes('không hoàn lại')) {
      return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-none text-[11px]">{type}</Badge>
    }
    return <Badge className="bg-sky-100 text-sky-800 hover:bg-sky-200 border-none text-[11px]">{type}</Badge>
  }

  // Available units for new booking modal based on selected project
  const availableUnits = inventory.filter(i => {
    if (!newBooking.projectId) return false
    return i.projectId === newBooking.projectId && (i.status === 'Trống' || i.status === 'Booking')
  })

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] gap-5 -m-4 sm:-m-8 p-4 sm:p-8 bg-slate-50/60 dark:bg-slate-950">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-200 dark:shadow-none">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
                Quy Trình Giữ Chỗ & Đặt Cọc (Booking Workflow)
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Hệ thống số hóa 5 bước phê duyệt cọc, kiểm soát chứng từ chuyển khoản và đếm ngược thời gian SLA khóa căn.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button 
            variant="outline" 
            className="text-xs h-9 bg-slate-50 hover:bg-slate-100" 
            onClick={() => { 
              setProjectFilter('all'); 
              setAgentFilter('all'); 
              setTypeFilter('all'); 
              setPriorityFilter('all');
              setSearchQuery(''); 
            }}
          >
            <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-500"/> Xóa bộ lọc
          </Button>

          <Button 
            variant="outline" 
            className="text-xs h-9 bg-white hover:bg-slate-50 border-slate-300 font-semibold text-slate-700"
            onClick={handleExportCSV}
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-indigo-600"/> Xuất CSV
          </Button>

          <Button 
            className="text-xs h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-100"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1.5"/> + Tạo Yêu Cầu Booking Mới
          </Button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* KPI 1: Tổng yêu cầu */}
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200/80 hover:shadow transition-shadow">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-600" /> Tổng hồ sơ booking
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{totalCount} <span className="text-xs font-normal text-slate-500">phiếu</span></div>
              <p className="text-[11px] text-slate-500 mt-0.5">Toàn bộ chiến dịch</p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Chờ Quản lý & GĐ */}
        <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-purple-600" /> Chờ cấp duyệt
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-purple-700 dark:text-purple-300">{waitingApprovalCount} <span className="text-xs font-normal text-purple-600">phiếu</span></div>
              <p className="text-[11px] text-purple-700/80 mt-0.5">Quản lý sàn & GĐ khối</p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Chờ Kế toán */}
        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-amber-600" /> Chờ xác nhận tiền
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300">{waitingPaymentCount} <span className="text-xs font-normal text-amber-600">phiếu</span></div>
              <p className="text-[11px] text-amber-700/80 mt-0.5">Khớp sao kê Vietcombank</p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Đã Hoàn tất */}
        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Đã khóa căn
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{doneCount} <span className="text-xs font-normal text-emerald-600">căn</span></div>
              <p className="text-[11px] text-emerald-700/80 mt-0.5">Đã xuất Phiếu cọc chính thức</p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 5: Tổng giá trị giữ chỗ */}
        <Card className="bg-sky-50/50 dark:bg-sky-950/20 border-sky-200/80 shadow-sm col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-sky-600" /> Giá trị tiền cọc
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-sky-700 dark:text-sky-300">{formatCurrency(totalDepositAmount)}</div>
              <p className="text-[11px] text-sky-700/80 mt-0.5">Tài khoản ký quỹ an toàn</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-3.5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* Filter 1: Project */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Dự án</label>
              <Select value={projectFilter} onValueChange={(val) => setProjectFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Tất cả dự án" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả dự án</SelectItem>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter 2: Agent */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Nhân viên Sale</label>
              <Select value={agentFilter} onValueChange={(val) => setAgentFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Tất cả Sale" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả nhân viên Sale</SelectItem>
                  <SelectItem value="lê hoàng anh">Lê Hoàng Anh</SelectItem>
                  <SelectItem value="nguyễn mai">Nguyễn Mai</SelectItem>
                  <SelectItem value="thanh hà">Thanh Hà</SelectItem>
                  <SelectItem value="tuấn tú">Tuấn Tú</SelectItem>
                  <SelectItem value="trần khoa">Trần Khoa</SelectItem>
                  <SelectItem value="minh anh">Minh Anh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter 3: Type */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Loại Booking</label>
              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Tất cả loại" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại booking</SelectItem>
                  <SelectItem value="Giữ chỗ có hoàn lại">Giữ chỗ có hoàn lại</SelectItem>
                  <SelectItem value="Giữ chỗ không hoàn lại">Giữ chỗ không hoàn lại</SelectItem>
                  <SelectItem value="Ký HĐ Cọc">Ký HĐ Cọc chính thức</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter 4: Priority */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Mức độ ưu tiên / SLA</label>
              <Select value={priorityFilter} onValueChange={(val) => setPriorityFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Tất cả ưu tiên" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả mức ưu tiên</SelectItem>
                  <SelectItem value="normal">Tiêu chuẩn</SelectItem>
                  <SelectItem value="high">Cần xử lý gấp (SLA 30p)</SelectItem>
                  <SelectItem value="urgent">Quá hạn SLA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter 5: Instant Search */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Tìm kiếm tức thì</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="text" 
                  placeholder="Mã phiếu, khách hàng, mã căn..." 
                  className="pl-8 h-9 text-xs" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-[1550px] items-start">
          {COLUMNS.map((column, index) => {
            const columnTickets = filteredTickets.filter(t => t.status === column.id)
            const isLast = index === COLUMNS.length - 1

            return (
              <div key={column.id} className="flex-1 flex flex-col w-[310px] max-w-[340px] shrink-0 bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-2.5 shadow-xs">
                
                {/* Column Header */}
                <div className={`p-3 rounded-xl border ${column.bg} ${column.color} flex items-center justify-between mb-3 shadow-xs`}>
                  <div className={`flex items-center gap-2 font-bold text-sm ${column.text}`}>
                    <column.icon className="h-4 w-4" />
                    <span>{column.label}</span>
                  </div>
                  <Badge className={`font-bold text-xs ${column.badgeBg} border-none`}>
                    {columnTickets.length}
                  </Badge>
                </div>
                
                {/* Column Body / Cards List */}
                <div className="flex flex-col gap-3 min-h-[500px]">
                  {columnTickets.length === 0 ? (
                    <div className="text-center py-12 px-4 text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/50 dark:bg-slate-900/30">
                      Chưa có yêu cầu nào trong bước này
                    </div>
                  ) : (
                    columnTickets.map((ticket) => (
                      <Card 
                        key={ticket.id} 
                        className={`shadow-xs hover:shadow-md transition-all duration-200 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 ${
                          ticket.priority === 'urgent' ? 'ring-2 ring-rose-400/80 border-rose-300' : ''
                        }`}
                      >
                        <CardContent className="p-3.5 flex flex-col gap-3">
                          
                          {/* Card Header */}
                          <div className="flex justify-between items-start gap-1.5 flex-wrap">
                            <div className="flex items-center gap-1.5">
                              <span 
                                onClick={() => setSelectedTicket(ticket)}
                                className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded cursor-pointer hover:underline"
                              >
                                {ticket.id}
                              </span>
                              {getTypeBadge(ticket.type)}
                            </div>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {ticket.time}
                            </span>
                          </div>

                          {/* Priority & SLA Warning */}
                          <div className="flex items-center justify-between">
                            {getPriorityBadge(ticket.priority)}
                            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                              SLA: {ticket.expiresAt}
                            </span>
                          </div>

                          {/* Customer & Unit Details */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h3 
                                onClick={() => setSelectedTicket(ticket)}
                                className="font-bold text-sm text-slate-800 dark:text-slate-100 hover:text-indigo-600 cursor-pointer"
                              >
                                {ticket.customerName}
                              </h3>
                              <span className="text-xs font-medium text-slate-500">{ticket.customerPhone}</span>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800/70 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-medium">Dự án:</span>
                                <span className="font-bold text-indigo-700 dark:text-indigo-400">{ticket.projectName}</span>
                              </div>
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-500 font-medium">Mã căn:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">{ticket.unitCode}</span>
                              </div>
                              <div className="flex justify-between text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700">
                                <span className="text-slate-500 font-medium">Tiền giữ chỗ:</span>
                                <span className="font-black text-emerald-600 text-xs">{formatCurrency(ticket.depositAmount)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Meta: Docs & Payment Method */}
                          <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
                            <div className="flex items-center gap-1">
                              <Paperclip className="h-3 w-3 text-slate-400" />
                              <span>Hồ sơ: <strong className="text-slate-700 dark:text-slate-300">{ticket.docs}</strong></span>
                            </div>
                            <div className="flex items-center gap-1 font-medium">
                              <CreditCard className="h-3 w-3 text-slate-400" />
                              <span>{ticket.paymentMethod}</span>
                            </div>
                          </div>

                          {/* Footer Actions on Card */}
                          <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2.5 mt-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <UserCircle2 className="h-4 w-4 text-slate-400" />
                              <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] truncate max-w-[90px]">{ticket.agent}</span>
                            </div>
                            
                            <div className="flex items-center gap-1.5">
                              {/* View detail trigger */}
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 px-2 text-xs text-slate-600 hover:text-indigo-600"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                Chi tiết
                              </Button>

                              {/* Reject button (available if not in first column and not done) */}
                              {!isLast && column.id !== 'sale' && (
                                <Button 
                                  size="icon" 
                                  variant="outline"
                                  className="h-7 w-7 text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                                  title="Từ chối trả về Sale"
                                  onClick={() => handleOpenReject(ticket.id)}
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                </Button>
                              )}

                              {/* Approve Button */}
                              {!isLast && (
                                <Button 
                                  size="sm" 
                                  className="h-7 px-2.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-xs"
                                  onClick={() => handleApprove(ticket.id, ticket.status)}
                                >
                                  {column.id === 'payment' ? 'Khớp Tiền' : 'Duyệt'} 
                                  <ChevronRight className="h-3 w-3 ml-0.5" />
                                </Button>
                              )}

                              {/* Done Badge */}
                              {isLast && (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[11px] py-1">
                                  <Check className="h-3 w-3 mr-1"/> Đã xong
                                </Badge>
                              )}
                            </div>
                          </div>

                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

              </div>
            )
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: TẠO YÊU CẦU BOOKING MỚI                          */}
      {/* ========================================================= */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-600" />
              Khởi Tạo Phiếu Giữ Chỗ / Booking Mới
            </DialogTitle>
            <p className="text-xs text-slate-500">
              Điền thông tin khách hàng, chọn dự án và mã căn để tạo lệnh giữ chỗ có SLA theo thời gian thực.
            </p>
          </DialogHeader>

          <form onSubmit={handleCreateBookingSubmit} className="space-y-4 py-2">
            
            {/* Step 1: Chọn Khách hàng */}
            <div className="p-3 bg-slate-50 rounded-xl border space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                1. Thông tin khách hàng (*)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Chọn từ danh bạ CRM</label>
                  <Select 
                    value={newBooking.customerId} 
                    onValueChange={(val) => handleSelectCustomerForNewBooking(val || '')}
                  >
                    <SelectTrigger className="text-xs h-9"><SelectValue placeholder="Chọn khách hàng" /></SelectTrigger>
                    <SelectContent>
                      {customers.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} - {c.phone} ({c.rank})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Số điện thoại liên hệ</label>
                  <Input 
                    value={newBooking.customerPhone} 
                    placeholder="VD: 0901234567" 
                    className="h-9 text-xs"
                    onChange={e => setNewBooking({ ...newBooking, customerPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Chọn Dự án & Mã căn */}
            <div className="p-3 bg-slate-50 rounded-xl border space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                2. Bất động sản chỉ định (*)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dự án</label>
                  <Select 
                    value={newBooking.projectId} 
                    onValueChange={(val) => handleSelectProjectForNewBooking(val || '')}
                  >
                    <SelectTrigger className="text-xs h-9"><SelectValue placeholder="Chọn dự án mở bán" /></SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mã căn hộ / Shophouse</label>
                  <Select 
                    value={newBooking.unitId} 
                    onValueChange={(val) => handleSelectUnitForNewBooking(val || '')}
                    disabled={!newBooking.projectId}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder={newBooking.projectId ? "Chọn mã căn khả dụng" : "Vui lòng chọn dự án trước"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUnits.map(u => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.code} - {u.type} ({formatCurrency(u.price)}) [{u.status}]
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newBooking.price > 0 && (
                <div className="flex justify-between items-center text-xs bg-indigo-50 p-2.5 rounded-lg border border-indigo-100">
                  <span className="text-indigo-800 font-medium">Giá niêm yết căn hộ:</span>
                  <span className="font-bold text-indigo-700 text-sm">{formatCurrency(newBooking.price)}</span>
                </div>
              )}
            </div>

            {/* Step 3: Tài chính & Tiền cọc */}
            <div className="p-3 bg-slate-50 rounded-xl border space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                3. Quy chế đặt cọc & Thanh toán
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Loại Booking</label>
                  <Select 
                    value={newBooking.type} 
                    onValueChange={(val) => setNewBooking({ ...newBooking, type: val as any })}
                  >
                    <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Giữ chỗ có hoàn lại">Giữ chỗ có hoàn lại (Refundable)</SelectItem>
                      <SelectItem value="Giữ chỗ không hoàn lại">Giữ chỗ không hoàn lại (Ưu tiên 1)</SelectItem>
                      <SelectItem value="Ký HĐ Cọc">Ký Hợp Đồng Cọc chính thức</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phương thức thanh toán</label>
                  <Select 
                    value={newBooking.paymentMethod} 
                    onValueChange={(val) => setNewBooking({ ...newBooking, paymentMethod: val as any })}
                  >
                    <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Chuyển khoản">Chuyển khoản QR Ngân hàng (Vietcombank)</SelectItem>
                      <SelectItem value="Thẻ tín dụng">Cà thẻ POS Sacombank tại quầy</SelectItem>
                      <SelectItem value="Tiền mặt">Nộp tiền mặt tại thủ quỹ Novaland</SelectItem>
                      <SelectItem value="Ví điện tử">Ví điện tử MoMo / ZaloPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Số tiền cọc giữ chỗ (VNĐ)</label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    step={10000000}
                    value={newBooking.depositAmount}
                    onChange={e => setNewBooking({ ...newBooking, depositAmount: Number(e.target.value) })}
                    className="h-9 text-xs font-bold"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs h-9 shrink-0" 
                    onClick={() => setNewBooking({ ...newBooking, depositAmount: 100000000 })}
                  >
                    100 Triệu
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs h-9 shrink-0" 
                    onClick={() => setNewBooking({ ...newBooking, depositAmount: 200000000 })}
                  >
                    200 Triệu
                  </Button>
                </div>
              </div>
            </div>

            {/* Step 4: Nhân sự & SLA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Sale tư vấn phụ trách</label>
                <Select 
                  value={newBooking.agent} 
                  onValueChange={(val) => setNewBooking({ ...newBooking, agent: val || 'Lê Hoàng Anh' })}
                >
                  <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lê Hoàng Anh">Lê Hoàng Anh</SelectItem>
                    <SelectItem value="Nguyễn Mai">Nguyễn Mai</SelectItem>
                    <SelectItem value="Thanh Hà">Thanh Hà</SelectItem>
                    <SelectItem value="Tuấn Tú">Tuấn Tú</SelectItem>
                    <SelectItem value="Trần Khoa">Trần Khoa</SelectItem>
                    <SelectItem value="Minh Anh">Minh Anh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mức độ ưu tiên duyệt</label>
                <Select 
                  value={newBooking.priority} 
                  onValueChange={(val) => setNewBooking({ ...newBooking, priority: val as any })}
                >
                  <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Tiêu chuẩn (SLA 60 phút)</SelectItem>
                    <SelectItem value="high">Cần duyệt gấp (SLA 30 phút)</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp (SLA 15 phút)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">Ghi chú & Chứng từ đính kèm</label>
              <Input 
                value={newBooking.notes} 
                onChange={e => setNewBooking({ ...newBooking, notes: e.target.value })} 
                placeholder="VD: Khách đã chuyển khoản 100tr, đính kèm UNC..." 
                className="h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Xác Nhận Tạo Phiếu Booking
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: CHI TIẾT PHIẾU BOOKING & PHÊ DUYỆT HỒ SƠ        */}
      {/* ========================================================= */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-3xl max-h-[92vh] overflow-y-auto p-6">
            <DialogHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-sm font-bold text-indigo-700 border-indigo-300 bg-indigo-50">
                    {selectedTicket.id}
                  </Badge>
                  {getTypeBadge(selectedTicket.type)}
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <span className="text-xs text-slate-400">Khởi tạo: {selectedTicket.createdAt}</span>
              </div>
              <DialogTitle className="text-xl font-black text-slate-900 mt-2">
                Chi Tiết Phiếu Giữ Chỗ Bất Động Sản
              </DialogTitle>
            </DialogHeader>

            {/* Stepper Progress */}
            <div className="my-2 bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Tiến trình phê duyệt (5 giai đoạn)
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {COLUMNS.map((col, idx) => {
                  const currentIdx = COLUMNS.findIndex(c => c.id === selectedTicket.status)
                  const isPassed = currentIdx > idx
                  const isCurrent = currentIdx === idx

                  return (
                    <div key={col.id} className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                        isPassed ? 'bg-emerald-500 text-white' : 
                        isCurrent ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' : 
                        'bg-slate-200 text-slate-500'
                      }`}>
                        {isPassed ? <Check className="h-3.5 w-3.5" /> : idx + 1}
                      </div>
                      <span className={`text-[10px] leading-tight ${
                        isCurrent ? 'font-bold text-indigo-600' : 'text-slate-500'
                      }`}>
                        {col.label.split('. ')[1]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 2-Column Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Column Left: Khách hàng & Căn hộ */}
              <div className="space-y-3">
                {/* Khách hàng */}
                <div className="p-3 bg-white dark:bg-slate-800 border rounded-xl space-y-1.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-indigo-600">
                    <User className="h-3.5 w-3.5" /> Thông tin khách hàng
                  </h4>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Họ và tên</span>
                      <strong className="text-slate-800 dark:text-slate-100 text-xs">{selectedTicket.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Số điện thoại</span>
                      <strong className="text-slate-800 dark:text-slate-100 text-xs">{selectedTicket.customerPhone || '0901234567'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Email</span>
                      <span className="text-slate-600 text-xs">{selectedTicket.customerEmail || 'khachhang@novacrm.vn'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Sale tư vấn</span>
                      <span className="font-semibold text-slate-800 text-xs">{selectedTicket.agent}</span>
                    </div>
                  </div>
                </div>

                {/* Bất động sản */}
                <div className="p-3 bg-white dark:bg-slate-800 border rounded-xl space-y-1.5">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-indigo-600">
                    <Building2 className="h-3.5 w-3.5" /> Thông tin căn hộ & Dự án
                  </h4>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Dự án</span>
                      <strong className="text-indigo-600 text-xs">{selectedTicket.projectName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Mã căn</span>
                      <strong className="text-slate-900 dark:text-slate-50 text-xs">{selectedTicket.unitCode}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block text-[10px]">Giá niêm yết CĐT</span>
                      <strong className="text-slate-900 dark:text-slate-50 text-sm">{formatCurrency(selectedTicket.price)}</strong>
                    </div>
                  </div>
                </div>

                {/* Simulated Payment Receipt (Ủy Nhiệm Chi) */}
                <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-900 dark:text-amber-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck2 className="h-4 w-4 text-amber-600" /> Chứng từ thanh toán (UNC)
                    </span>
                    <Badge className="bg-amber-200 text-amber-900 border-none text-[10px]">ĐÃ XÁC THỰC</Badge>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-amber-200 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã giao dịch:</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{selectedTicket.bankRef || 'VCB-99823101'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số tiền nộp cọc:</span>
                      <span className="font-black text-emerald-600 text-xs">{formatCurrency(selectedTicket.depositAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Hình thức nộp:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedTicket.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Đơn vị thụ hưởng:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">TẬP ĐOÀN ĐẦU TƯ ĐỊA ỐC NOVALAND</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Column Right: SLA, Audit History & Actions */}
              <div className="space-y-3">
                
                {/* SLA Box */}
                <div className="p-3 bg-white dark:bg-slate-800 border rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-600" /> Thời gian giữ chỗ (SLA)
                    </span>
                    <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                      {selectedTicket.expiresAt}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Nếu quá thời hạn SLA mà không có xác nhận nộp cọc, căn hộ sẽ tự động trả về kho hàng trống.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full text-xs h-8 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100 border-indigo-200"
                    onClick={() => handleExtendSLA(selectedTicket.id, 30)}
                  >
                    <RefreshCw className="h-3.5 w-3.5 mr-1.5"/> Gia hạn thêm 30 phút SLA
                  </Button>
                </div>

                {/* Audit Log / Lịch sử duyệt */}
                <div className="p-3 bg-white dark:bg-slate-800 border rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-600" /> Nhật ký phê duyệt hồ sơ
                  </h4>
                  <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                    {selectedTicket.approvalHistory && selectedTicket.approvalHistory.length > 0 ? (
                      selectedTicket.approvalHistory.map((h, i) => (
                        <div key={i} className="text-[11px] p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border space-y-0.5">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{h.actor}</span>
                            <span className="text-[10px] text-slate-400">{h.timestamp}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-400 text-[11px]">{h.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 text-[11px] italic">Chưa có lịch sử thay đổi bổ sung.</div>
                    )}
                  </div>
                </div>

                {/* Notes box */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Ghi chú từ Sale:</span>
                  <p className="text-slate-700 dark:text-slate-300 text-xs italic">{selectedTicket.notes || 'Không có ghi chú thêm.'}</p>
                </div>

              </div>

            </div>

            {/* Modal Footer with Workflow Actions */}
            <DialogFooter className="pt-3 border-t flex flex-wrap justify-between items-center gap-2">
              <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                Đóng
              </Button>

              <div className="flex items-center gap-2">
                {selectedTicket.status !== 'sale' && selectedTicket.status !== 'done' && (
                  <Button 
                    variant="outline" 
                    className="text-rose-600 border-rose-200 hover:bg-rose-50"
                    onClick={() => {
                      const id = selectedTicket.id
                      setSelectedTicket(null)
                      handleOpenReject(id)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1.5"/> Từ chối & Trả về Sale
                  </Button>
                )}

                {selectedTicket.status !== 'done' ? (
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    onClick={() => {
                      const id = selectedTicket.id
                      const st = selectedTicket.status
                      handleApprove(id, st)
                    }}
                  >
                    {selectedTicket.status === 'payment' ? 'Khớp Tiền & Khóa Căn' : 'Phê Duyệt & Chuyển Bước'}
                    <ChevronRight className="h-4 w-4 ml-1.5" />
                  </Button>
                ) : (
                  <Badge className="bg-emerald-600 text-white text-xs px-3 py-1.5">
                    <Check className="h-4 w-4 mr-1.5"/> Hồ sơ đã hoàn tất đặt cọc
                  </Badge>
                )}
              </div>
            </DialogFooter>

          </DialogContent>
        </Dialog>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DIALOG TỪ CHỐI DUYỆT (REJECT DIALOG)             */}
      {/* ========================================================= */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-rose-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Xác Nhận Từ Chối & Trả Về Sale
            </DialogTitle>
            <p className="text-xs text-slate-500">
              Nhập lý do từ chối để nhân viên Sale nhận thông báo và điều chỉnh hồ sơ.
            </p>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <label className="text-xs font-semibold text-slate-700 block">Lý do từ chối (*)</label>
            <Input 
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="VD: Thiếu ảnh CCCD 2 mặt, số tiền UNC không khớp..."
              className="text-xs"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white font-bold" onClick={handleConfirmReject}>
              Xác Nhận Từ Chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
