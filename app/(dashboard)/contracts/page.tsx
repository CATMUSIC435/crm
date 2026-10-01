"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { 
  FileSignature, Download, Printer, Search, Filter, 
  CheckCircle2, Clock, Landmark, User, FileText, ChevronRight, Eye,
  Building2, Plus, Sparkles, Receipt, ShieldCheck, ArrowUpRight,
  CreditCard, AlertCircle
} from 'lucide-react'
import { useStore } from "@/store/useStore"
import Link from 'next/link'
import { Contract } from '@/types'

function getStatusBadge(status: string) {
  switch (status) {
    case "Đã ký":
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none flex items-center gap-1 w-max font-semibold"><CheckCircle2 className="h-3 w-3 text-emerald-600"/> Đã ký chính thức</Badge>
    case "Chờ duyệt":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none flex items-center gap-1 w-max font-semibold"><Clock className="h-3 w-3 text-amber-600"/> Chờ phê duyệt</Badge>
    case "Hủy":
    case "Đã thanh lý":
      return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none flex items-center gap-1 w-max font-medium">Đã thanh lý</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getTypeBadge(type: string | undefined) {
  if (!type) return null
  switch (type) {
    case "Hợp đồng mua bán":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none font-medium">{type}</Badge>
    case "Hợp đồng đặt cọc":
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-none font-medium">{type}</Badge>
    case "Thỏa thuận giữ chỗ":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none font-medium">{type}</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

function formatCurrency(amount: number) {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} Tỷ`
  }
  return `${(amount / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} Triệu`
}

export default function ContractPage() {
  const { contracts, customers, projects, inventory, addContract } = useStore()
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [projectFilter, setProjectFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [bankFilter, setBankFilter] = useState('all')
  const [progressFilter, setProgressFilter] = useState('all')

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Modal new contract state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newContractForm, setNewContractForm] = useState({
    customerId: '',
    projectId: '',
    inventoryId: '',
    value: 0,
    type: 'Hợp đồng mua bán' as Contract['type'],
    bankSupport: 'Vietcombank',
    loanAmount: 0,
    signer: 'Trần Văn Sếp (Tổng Giám Đốc)',
    witnessAgent: 'Lê Hoàng Anh',
    paymentProgress: 15
  })

  // Helpers to lookup names
  const getCustomer = (id: string) => customers.find(c => c.id === id)
  const getProject = (id: string) => projects.find(p => p.id === id)
  const getUnit = (id: string) => inventory.find(i => i.id === id)

  // KPIs
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0)
  const totalPaid = contracts.reduce((sum, c) => sum + ((c.value * (c.paymentProgress || 0)) / 100), 0)
  const totalRemaining = totalValue - totalPaid
  const signedCount = contracts.filter(c => c.status === 'Đã ký').length
  const pendingCount = contracts.filter(c => c.status === 'Chờ duyệt').length
  const totalLoanSupport = contracts.reduce((sum, c) => sum + (c.loanAmount || 0), 0)
  const recoveryRate = totalValue > 0 ? Math.round((totalPaid / totalValue) * 100) : 0

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const cust = getCustomer(c.customerId)
      const proj = getProject(c.projectId)
      const un = getUnit(c.inventoryId)

      const customerName = (cust?.name || '').toLowerCase()
      const customerPhone = (cust?.phone || '').toLowerCase()
      const unitCode = (un?.code || '').toLowerCase()
      const contractCode = c.code.toLowerCase()
      const projectName = (proj?.name || '').toLowerCase()
      const term = searchTerm.toLowerCase().trim()

      const matchesSearch = !term || 
        customerName.includes(term) || 
        customerPhone.includes(term) ||
        unitCode.includes(term) || 
        contractCode.includes(term) ||
        projectName.includes(term)
        
      const matchesProject = projectFilter === 'all' || c.projectId === projectFilter
      const matchesType = typeFilter === 'all' || (c.type && c.type.toLowerCase().includes(typeFilter.toLowerCase()))
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'signed' && c.status === 'Đã ký') || 
        (statusFilter === 'pending' && c.status === 'Chờ duyệt')
      const matchesBank = bankFilter === 'all' || 
        (bankFilter === 'none' ? (!c.bankSupport || c.bankSupport.includes('Không vay')) : (c.bankSupport && c.bankSupport.toLowerCase().includes(bankFilter.toLowerCase())))
      
      let matchesProgress = true
      const prog = c.paymentProgress || 0
      if (progressFilter === 'low') matchesProgress = prog < 30
      else if (progressFilter === 'mid') matchesProgress = prog >= 30 && prog < 70
      else if (progressFilter === 'high') matchesProgress = prog >= 70 && prog < 100
      else if (progressFilter === 'completed') matchesProgress = prog === 100

      return matchesSearch && matchesProject && matchesType && matchesStatus && matchesBank && matchesProgress
    })
  }, [contracts, customers, projects, inventory, searchTerm, projectFilter, typeFilter, statusFilter, bankFilter, progressFilter])

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Mã HĐ', 'Khách Hàng', 'Số Điện Thoại', 'Dự Án', 'Mã Căn', 
      'Loại HĐ', 'Tổng Giá Trị (VNĐ)', 'Tiến Độ Thu (%)', 'Đã Thu (VNĐ)', 
      'Còn Lại (VNĐ)', 'Ngân Hàng Vay', 'Số Tiền Vay (VNĐ)', 'Người Đại Diện Ký', 'Trạng Thái', 'Ngày Ký'
    ]

    const rows = filteredContracts.map(c => {
      const cust = getCustomer(c.customerId)
      const proj = getProject(c.projectId)
      const un = getUnit(c.inventoryId)
      const paid = (c.value * (c.paymentProgress || 0)) / 100
      const remaining = c.value - paid

      return [
        c.code,
        `"${cust?.name || c.customerId}"`,
        `"${cust?.phone || ''}"`,
        `"${proj?.name || c.projectId}"`,
        un?.code || c.inventoryId,
        `"${c.type || ''}"`,
        c.value,
        c.paymentProgress || 0,
        paid,
        remaining,
        `"${c.bankSupport || 'Không vay'}"`,
        c.loanAmount || 0,
        `"${c.signer || ''}"`,
        `"${c.status}"`,
        c.date
      ]
    })

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Bao_Cao_Hop_Dong_NovaCRM_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showToast('📥 Đã xuất thành công danh sách Hợp Đồng ra file CSV UTF-8!')
  }

  // Handle Project Selection for New Contract
  const handleSelectProjectForNewContract = (projectId: string) => {
    setNewContractForm(prev => ({
      ...prev,
      projectId,
      inventoryId: '',
      value: 0
    }))
  }

  // Handle Unit Selection for New Contract
  const handleSelectUnitForNewContract = (inventoryId: string) => {
    const un = inventory.find(i => i.id === inventoryId)
    if (un) {
      setNewContractForm(prev => ({
        ...prev,
        inventoryId: un.id,
        value: un.price
      }))
    }
  }

  // Handle Create Contract Submit
  const handleCreateContractSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContractForm.customerId || !newContractForm.projectId || !newContractForm.inventoryId) {
      alert('Vui lòng chọn đầy đủ Khách hàng, Dự án và Mã căn hộ!')
      return
    }

    addContract({
      customerId: newContractForm.customerId,
      projectId: newContractForm.projectId,
      inventoryId: newContractForm.inventoryId,
      value: Number(newContractForm.value) || 10000000000,
      type: newContractForm.type,
      status: 'Chờ duyệt',
      paymentProgress: newContractForm.paymentProgress,
      bankSupport: newContractForm.bankSupport,
      loanAmount: Number(newContractForm.loanAmount) || 0,
      signer: newContractForm.signer,
      witnessAgent: newContractForm.witnessAgent
    })

    setIsCreateModalOpen(false)
    showToast('🎉 Đã lập hợp đồng mới thành công! Hồ sơ đã được chuyển sang trạng thái "Chờ duyệt".')
  }

  // Units available for new contract
  const availableUnitsForContract = inventory.filter(i => {
    if (!newContractForm.projectId) return false
    return i.projectId === newContractForm.projectId && (i.status === 'Trống' || i.status === 'Booking')
  })

  return (
    <div className="flex flex-col gap-6 -m-4 sm:-m-8 p-4 sm:p-8 bg-slate-50/60 dark:bg-slate-950 min-h-screen">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-200 dark:shadow-none">
            <FileSignature className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">
              Quản Lý Hợp Đồng & Pháp Lý (Contracts)
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Theo dõi toàn bộ vòng đời pháp lý, dòng tiền thực thu và tiến độ thanh toán theo giai đoạn xây dựng.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button 
            variant="outline" 
            className="text-xs h-9 bg-slate-50 hover:bg-slate-100"
            onClick={() => {
              setSearchTerm('')
              setProjectFilter('all')
              setTypeFilter('all')
              setStatusFilter('all')
              setBankFilter('all')
              setProgressFilter('all')
            }}
          >
            <Filter className="h-3.5 w-3.5 mr-1.5 text-slate-500" /> Xóa bộ lọc
          </Button>

          <Button 
            variant="outline" 
            className="text-xs h-9 bg-white hover:bg-slate-50 border-slate-300 font-semibold text-slate-700"
            onClick={handleExportCSV}
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-blue-600" /> Xuất Báo Cáo (CSV)
          </Button>

          <Button 
            className="text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-100"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" /> + Lập Hợp Đồng Mới
          </Button>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        
        {/* KPI 1: Tổng Doanh Số Ký Kết */}
        <Card className="bg-white dark:bg-slate-900 shadow-sm border-slate-200/80 hover:shadow transition-shadow">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Landmark className="h-3.5 w-3.5 text-blue-600" /> Tổng doanh số ký kết
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-blue-900 dark:text-blue-200">{formatCurrency(totalValue)}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">{contracts.length} hợp đồng phát sinh</p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Dòng Tiền Đã Thu Về */}
        <Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Thực thu đã vào tài khoản
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{formatCurrency(totalPaid)}</div>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={recoveryRate} className="h-1.5 bg-emerald-200/60" />
                <span className="text-[11px] font-bold text-emerald-700 shrink-0">{recoveryRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Công Nợ Phải Thu */}
        <Card className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5 text-amber-600" /> Công nợ thu theo tiến độ
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-amber-700 dark:text-amber-300">{formatCurrency(totalRemaining)}</div>
              <p className="text-[11px] text-amber-700/80 mt-0.5">Theo đợt cất nóc & bàn giao</p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Tình Trạng Hợp Đồng */}
        <Card className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
              <FileSignature className="h-3.5 w-3.5 text-purple-600" /> Tình trạng pháp lý
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-purple-700 dark:text-purple-300">
                {signedCount} <span className="text-xs font-normal text-purple-600">đã ký</span> • {pendingCount} <span className="text-xs text-amber-600 font-normal">chờ duyệt</span>
              </div>
              <p className="text-[11px] text-purple-700/80 mt-0.5">Đã công chứng & phát hành</p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 5: Tín Dụng Ngân Hàng */}
        <Card className="bg-sky-50/50 dark:bg-sky-950/20 border-sky-200/80 shadow-sm col-span-2 sm:col-span-1">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-sky-600" /> Hỗ trợ vay ngân hàng
            </span>
            <div className="mt-2">
              <div className="text-2xl font-black text-sky-700 dark:text-sky-300">{formatCurrency(totalLoanSupport)}</div>
              <p className="text-[11px] text-sky-700/80 mt-0.5">Bảo lãnh: VCB, MB, TCB</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
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

            {/* Filter 2: Type */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Loại Hợp Đồng</label>
              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Loại HĐ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Loại HĐ</SelectItem>
                  <SelectItem value="mua bán">Hợp đồng mua bán</SelectItem>
                  <SelectItem value="đặt cọc">Hợp đồng đặt cọc</SelectItem>
                  <SelectItem value="giữ chỗ">Thỏa thuận giữ chỗ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter 3: Status */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Trạng thái</label>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Trạng thái</SelectItem>
                  <SelectItem value="signed">Đã ký</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter 4: Bank */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Ngân hàng hỗ trợ</label>
              <Select value={bankFilter} onValueChange={(val) => setBankFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Ngân hàng" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả ngân hàng</SelectItem>
                  <SelectItem value="vietcombank">Vietcombank</SelectItem>
                  <SelectItem value="techcombank">Techcombank</SelectItem>
                  <SelectItem value="mb bank">MB Bank</SelectItem>
                  <SelectItem value="vietinbank">VietinBank</SelectItem>
                  <SelectItem value="none">Không vay (Vốn tự có)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter 5: Progress */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Tiến độ thanh toán</label>
              <Select value={progressFilter} onValueChange={(val) => setProgressFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Tiến độ" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả tiến độ</SelectItem>
                  <SelectItem value="low">Mới ký cọc (&lt; 30%)</SelectItem>
                  <SelectItem value="mid">Đang thi công (30% - 70%)</SelectItem>
                  <SelectItem value="high">Sắp bàn giao (&gt; 70%)</SelectItem>
                  <SelectItem value="completed">Đã tất toán (100%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter 6: Search */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  type="text" 
                  placeholder="Mã HĐ, Khách hàng, Căn..." 
                  className="pl-8 h-9 text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card className="shadow-sm border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[140px] font-bold text-xs">Mã Hợp Đồng</TableHead>
                <TableHead className="min-w-[190px] font-bold text-xs">Bên Mua (Khách Hàng)</TableHead>
                <TableHead className="min-w-[190px] font-bold text-xs">Bất Động Sản</TableHead>
                <TableHead className="min-w-[180px] font-bold text-xs">Loại HĐ & Pháp Lý</TableHead>
                <TableHead className="min-w-[210px] font-bold text-xs">Giá Trị & Tiến Độ Thu</TableHead>
                <TableHead className="min-w-[150px] font-bold text-xs">Trạng Thái</TableHead>
                <TableHead className="text-right font-bold text-xs w-[120px]">Thao Tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-slate-500 text-xs">
                    Không tìm thấy hợp đồng nào phù hợp với bộ lọc hiện tại.
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract) => {
                  const cust = getCustomer(contract.customerId)
                  const proj = getProject(contract.projectId)
                  const un = getUnit(contract.inventoryId)
                  const paid = (contract.value * (contract.paymentProgress || 0)) / 100

                  return (
                    <TableRow key={contract.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      
                      {/* Cột 1: Mã HĐ & Ngày ký */}
                      <TableCell>
                        <Link href={`/contracts/${contract.id}`} className="font-mono font-bold text-sm text-blue-600 hover:underline block">
                          {contract.code}
                        </Link>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {contract.date}
                        </div>
                      </TableCell>

                      {/* Cột 2: Khách hàng */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <Link href={`/customers/${contract.customerId}`} className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600">
                              {cust?.name || contract.customerId}
                            </Link>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>{cust?.phone}</span>
                              {cust?.rank && (
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  cust.rank === 'VVIP' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {cust.rank}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Cột 3: Sản phẩm BĐS */}
                      <TableCell>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{proj?.name}</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                          <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[11px]">
                            {un?.code}
                          </span>
                          <span className="text-slate-500">• {un?.type}</span>
                        </div>
                      </TableCell>

                      {/* Cột 4: Loại HĐ & Ngân hàng */}
                      <TableCell>
                        <div className="mb-1.5">{getTypeBadge(contract.type)}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Landmark className="h-3 w-3 text-slate-400" />
                          <span>Ngân hàng: <strong className="text-slate-700 dark:text-slate-300">{contract.bankSupport || 'Vốn tự có'}</strong></span>
                        </div>
                        {contract.loanAmount ? (
                          <div className="text-[10px] text-blue-600 mt-0.5">Vay: {formatCurrency(contract.loanAmount)}</div>
                        ) : null}
                      </TableCell>

                      {/* Cột 5: Giá trị & Tiến độ thanh toán */}
                      <TableCell>
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="font-bold text-blue-700 dark:text-blue-300 text-sm">
                            {formatCurrency(contract.value)}
                          </span>
                          <span className="font-bold text-emerald-600">
                            {contract.paymentProgress || 0}%
                          </span>
                        </div>
                        <Progress value={contract.paymentProgress || 0} className="h-2 bg-slate-100 dark:bg-slate-800" />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                          <span>Đã thu: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(paid)}</strong></span>
                          <span>Còn lại: {formatCurrency(contract.value - paid)}</span>
                        </div>
                      </TableCell>

                      {/* Cột 6: Trạng thái */}
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>

                      {/* Cột 7: Thao tác */}
                      <TableCell className="text-right">
                        <div className="flex justify-end items-center gap-1.5">
                          <Link href={`/contracts/${contract.id}`}>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-blue-600" title="Xem chi tiết hợp đồng">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/contracts/${contract.id}`}>
                            <Button size="sm" className="h-7 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 border-none font-semibold">
                              Chi tiết <ChevronRight className="h-3 w-3 ml-0.5" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>

                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* ========================================================= */}
      {/* MODAL: LẬP HỢP ĐỒNG BẤT ĐỘNG SẢN MỚI                       */}
      {/* ========================================================= */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileSignature className="h-5 w-5 text-blue-600" />
              Lập Hồ Sơ Hợp Đồng Mua Bán / Đặt Cọc Mới
            </DialogTitle>
            <p className="text-xs text-slate-500">
              Khởi tạo hợp đồng mới từ rổ hàng bất động sản và tự động sinh phụ lục tiến độ thanh toán theo quy định chủ đầu tư.
            </p>
          </DialogHeader>

          <form onSubmit={handleCreateContractSubmit} className="space-y-4 py-2">
            
            {/* Khách hàng */}
            <div className="p-3 bg-slate-50 rounded-xl border space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                1. Bên mua (Khách Hàng) (*)
              </label>
              <Select 
                value={newContractForm.customerId} 
                onValueChange={(val) => setNewContractForm({ ...newContractForm, customerId: val || '' })}
              >
                <SelectTrigger className="text-xs h-9"><SelectValue placeholder="Chọn khách hàng đứng tên hợp đồng" /></SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} - SĐT: {c.phone} ({c.rank})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Bất động sản */}
            <div className="p-3 bg-slate-50 rounded-xl border space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                2. Sản phẩm bất động sản chuyển nhượng (*)
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Dự án</label>
                  <Select 
                    value={newContractForm.projectId} 
                    onValueChange={(val) => handleSelectProjectForNewContract(val || '')}
                  >
                    <SelectTrigger className="text-xs h-9"><SelectValue placeholder="Chọn dự án" /></SelectTrigger>
                    <SelectContent>
                      {projects.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Mã căn hộ</label>
                  <Select 
                    value={newContractForm.inventoryId} 
                    onValueChange={(val) => handleSelectUnitForNewContract(val || '')}
                    disabled={!newContractForm.projectId}
                  >
                    <SelectTrigger className="text-xs h-9">
                      <SelectValue placeholder={newContractForm.projectId ? "Chọn căn khả dụng" : "Vui lòng chọn dự án trước"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUnitsForContract.map(u => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.code} - {u.type} ({formatCurrency(u.price)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newContractForm.value > 0 && (
                <div className="flex justify-between items-center text-xs bg-blue-50 p-2.5 rounded-lg border border-blue-100">
                  <span className="text-blue-800 font-medium">Giá bán niêm yết CĐT:</span>
                  <span className="font-bold text-blue-700 text-sm">{formatCurrency(newContractForm.value)}</span>
                </div>
              )}
            </div>

            {/* Loại HĐ & Pháp lý */}
            <div className="p-3 bg-slate-50 rounded-xl border space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                3. Điều khoản hợp đồng & Phương thức thanh toán
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Loại Hợp Đồng</label>
                  <Select 
                    value={newContractForm.type} 
                    onValueChange={(val) => setNewContractForm({ ...newContractForm, type: val as any })}
                  >
                    <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hợp đồng mua bán">Hợp đồng mua bán chính thức (HĐMB)</SelectItem>
                      <SelectItem value="Hợp đồng đặt cọc">Hợp đồng đặt cọc (HĐĐC)</SelectItem>
                      <SelectItem value="Thỏa thuận giữ chỗ">Thỏa thuận giữ chỗ thiện chí (TTGC)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Ngân hàng tài trợ cho vay</label>
                  <Select 
                    value={newContractForm.bankSupport} 
                    onValueChange={(val) => setNewContractForm({ ...newContractForm, bankSupport: val || 'Không vay' })}
                  >
                    <SelectTrigger className="text-xs h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vietcombank">Vietcombank (Bảo lãnh chính)</SelectItem>
                      <SelectItem value="MB Bank">MB Bank (Hỗ trợ 0% 24 tháng)</SelectItem>
                      <SelectItem value="Techcombank">Techcombank</SelectItem>
                      <SelectItem value="VietinBank">VietinBank</SelectItem>
                      <SelectItem value="Không vay">Không vay (Thanh toán vốn tự có)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Giá trị hợp đồng thực tế (VNĐ)</label>
                <Input 
                  type="number"
                  step={100000000}
                  value={newContractForm.value}
                  onChange={e => setNewContractForm({ ...newContractForm, value: Number(e.target.value) })}
                  className="h-9 text-xs font-bold"
                />
              </div>
            </div>

            {/* Nhân sự ký kết */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Đại diện ký Bên A</label>
                <Input 
                  value={newContractForm.signer}
                  onChange={e => setNewContractForm({ ...newContractForm, signer: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Chuyên viên Sale phụ trách</label>
                <Select 
                  value={newContractForm.witnessAgent} 
                  onValueChange={(val) => setNewContractForm({ ...newContractForm, witnessAgent: val || 'Lê Hoàng Anh' })}
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
            </div>

            <DialogFooter className="pt-3 border-t">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Xác Nhận Tạo Hợp Đồng Mới
              </Button>
            </DialogFooter>

          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
