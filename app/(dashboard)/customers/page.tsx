"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Users, UserPlus, Search, Filter, PhoneCall, Mail, DollarSign, 
  Award, CheckCircle2, RotateCcw, FileSpreadsheet, Eye, 
  ArrowUpRight, ShieldCheck, HeartHandshake, Phone, Briefcase
} from "lucide-react"
import Link from "next/link"
import { useStore } from "@/store/useStore"
import { Customer } from "@/types"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable, DataTableColumnHeader } from "@/components/ui/data-table"
import { useDataTable } from "@/hooks/table/use-data-table"
import { useCustomersQuery } from "@/hooks/api/use-customers-query"
import { useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/hooks/api/query-keys"

function getBadgeVariant(rank: string) {
  switch (rank) {
    case 'VVIP': 
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none font-bold">VVIP Kim Cương</Badge>
    case 'VIP': 
      return <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white border-none font-semibold">VIP Bạch Kim</Badge>
    case 'Tiềm Năng': 
      return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white border-none font-medium">Tiềm Năng</Badge>
    case 'Mới': 
      return <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-medium">Khách Mới</Badge>
    default: 
      return <Badge variant="outline">{rank}</Badge>
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Đã giao dịch':
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Đã giao dịch</Badge>
    case 'Đang tư vấn':
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Đang tư vấn</Badge>
    case 'Đang chăm sóc':
      return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Đang chăm sóc</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function formatCurrency(amount: number) {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} Tỷ VNĐ`
  }
  if (amount >= 1e6) {
    return `${(amount / 1e6).toLocaleString()} Tr VNĐ`
  }
  return '0 VNĐ'
}

export default function CustomerListPage() {
  const queryClient = useQueryClient()
  const { customers, addCustomer, makeCall } = useStore()
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('Tất cả')
  const [statusFilter, setStatusFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // TanStack Query for background fresh cache & API optimization
  const { data: remoteCustomers, isLoading } = useCustomersQuery({ rank: activeTab, search: searchTerm })
  const customerList = remoteCustomers && remoteCustomers.length > 0 ? remoteCustomers : customers
  
  // Modal State
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    rank: 'VIP' as const,
    revenue: 0,
    assignedTo: 'Lê Hoàng Anh',
    status: 'Đang tư vấn' as const
  })

  // List of distinct agents
  const agents = useMemo(() => {
    return Array.from(new Set(customerList.map(c => c.assignedTo).filter(Boolean)))
  }, [customerList])

  // Count by Rank
  const getCount = (rank: string) => {
    if (rank === "Tất cả") return customerList.length
    return customerList.filter(c => c.rank === rank).length
  }

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customerList.filter(c => {
      // Tab Rank Filter
      if (activeTab !== 'Tất cả' && c.rank !== activeTab) return false

      // Search Filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase().trim()
        const matchesName = c.name.toLowerCase().includes(term)
        const matchesCode = c.code.toLowerCase().includes(term)
        const matchesPhone = c.phone.includes(term)
        const matchesEmail = c.email.toLowerCase().includes(term)
        const matchesAgent = (c.assignedTo || '').toLowerCase().includes(term)
        if (!matchesName && !matchesCode && !matchesPhone && !matchesEmail && !matchesAgent) return false
      }

      // Status Filter
      if (statusFilter !== 'all' && c.status !== statusFilter) return false

      // Agent Filter
      if (agentFilter !== 'all' && c.assignedTo !== agentFilter) return false

      return true
    })
  }, [customerList, activeTab, searchTerm, statusFilter, agentFilter])

  // Active filters check
  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'all' || agentFilter !== 'all' || activeTab !== 'Tất cả'

  const handleResetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setAgentFilter('all')
    setActiveTab('Tất cả')
  }

  // Quick Call Simulation
  const handleQuickCall = (c: Customer) => {
    makeCall(c.phone)
    setToastMsg(`Đang khởi tạo cuộc gọi VoIP đến ${c.name} (${c.phone})...`)
    setTimeout(() => {
      setToastMsg(`Cuộc gọi đã hoàn tất và được tự động ghi âm vào lịch sử!`)
      setTimeout(() => setToastMsg(null), 3000)
    }, 2000)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Mã KH", "Họ Tên", "Số Điện Thoại", "Email", "Phân Hạng", "Tổng Doanh Thu (VNĐ)", "Chuyên Viên Phụ Trách", "Trạng Thái", "Ngày Tạo"]
    const rows = filteredCustomers.map(c => [
      c.code,
      c.name,
      c.phone,
      c.email,
      c.rank,
      c.revenue,
      c.assignedTo,
      c.status,
      c.createdAt
    ])

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `Danh_Sach_Khach_Hang_NovaCRM_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setToastMsg("Đã xuất danh sách khách hàng ra file Excel/CSV thành công!")
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Add Customer Submit
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustomer.name.trim() || !newCustomer.phone.trim()) return

    const customerName = newCustomer.name.trim()
    const customerPhone = newCustomer.phone.trim()
    const customerEmail = newCustomer.email.trim() || `khach.${Date.now()}@novacrm.vn`

    try {
      await apiClient.request('/customers', {
        method: 'POST',
        body: JSON.stringify({
          fullName: customerName,
          phone: customerPhone,
          email: customerEmail,
          rank: newCustomer.rank === 'VVIP' ? 'DIAMOND_VVIP' : newCustomer.rank === 'VIP' ? 'PLATINUM' : 'GOLD',
        }),
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.customers.all })
    } catch (err: any) {
      console.warn('Backend API create customer fallback:', err?.message)
    }

    addCustomer({
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      rank: newCustomer.rank,
      revenue: Number(newCustomer.revenue),
      assignedTo: newCustomer.assignedTo,
      status: newCustomer.status
    })

    setIsAddCustomerOpen(false)
    setToastMsg(`Đã tạo thành công hồ sơ khách hàng "${customerName}"!`)
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      rank: 'VIP',
      revenue: 0,
      assignedTo: 'Lê Hoàng Anh',
      status: 'Đang tư vấn'
    })
    setTimeout(() => setToastMsg(null), 3500)
  }

  // KPI Numbers
  const totalRevenue = customerList.reduce((sum, c) => sum + c.revenue, 0)
  const vipCount = customerList.filter(c => c.rank === 'VVIP' || c.rank === 'VIP').length
  const transactedCount = customerList.filter(c => c.status === 'Đã giao dịch').length
  const activeCount = customerList.filter(c => c.status !== 'Đã giao dịch').length

  // TanStack Table Column Definitions
  const columns = useMemo<ColumnDef<Customer>[]>(() => [
    {
      accessorKey: 'code',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Mã KH" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs font-bold text-slate-500">
          {row.original.code}
        </span>
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Khách Hàng" />,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${c.id}`} />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                {c.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/customers/${c.id}`} className="font-bold text-slate-900 hover:text-indigo-600 hover:underline">
                {c.name}
              </Link>
              <div className="text-[11px] text-muted-foreground">Gia nhập: {c.createdAt}</div>
            </div>
          </div>
        );
      },
    },
    {
      id: 'contact',
      header: 'Liên Hệ',
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div>
            <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
              <Phone className="h-3 w-3 text-slate-400" /> {c.phone}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3 w-3 text-slate-400" /> {c.email}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'rank',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Phân Hạng" />,
      cell: ({ row }) => getBadgeVariant(row.original.rank),
    },
    {
      accessorKey: 'revenue',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Doanh Thu Tích Lũy" />,
      cell: ({ row }) => (
        <div className="font-bold text-xs text-indigo-700">
          {row.original.revenue > 0 ? formatCurrency(row.original.revenue) : 'Chưa giao dịch'}
        </div>
      ),
    },
    {
      accessorKey: 'assignedTo',
      header: 'Chuyên Viên Phụ Trách',
      cell: ({ row }) => (
        <div className="text-xs font-medium text-slate-700 flex items-center gap-1">
          <Briefcase className="h-3 w-3 text-slate-400" /> {row.original.assignedTo}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng Thái" />,
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Hành Động</div>,
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="flex justify-end items-center gap-1.5">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              title="Gọi điện ngay"
              onClick={() => handleQuickCall(c)}
            >
              <PhoneCall className="h-4 w-4" />
            </Button>
            <Link href={`/customers/${c.id}`}>
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600">
                <Eye className="h-3.5 w-3.5 mr-1" /> CRM 360°
              </Button>
            </Link>
          </div>
        );
      },
    },
  ], []);

  const { table } = useDataTable({
    columns,
    data: filteredCustomers,
    initialPageSize: 10,
  });

  return (
    <div className="flex flex-col gap-6">

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-indigo-600" /> Quản Lý Khách Hàng 360°
            </h1>
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 font-bold border-none px-3 py-1">
              Investor Hub
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Danh bạ nhà đầu tư bất động sản, phân loại khẩu vị đầu tư và quản trị hồ sơ định danh CCCD.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 text-slate-700"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Xuất Excel / CSV
          </Button>

          <Button 
            onClick={() => setIsAddCustomerOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm"
          >
            <UserPlus className="h-4 w-4" /> Thêm Khách Hàng Mới
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50/70 to-white border-indigo-100 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> Doanh Thu Tích Lũy
            </span>
            <div>
              <div className="text-2xl font-black text-indigo-950">{formatCurrency(totalRevenue)}</div>
              <p className="text-[11px] text-indigo-600/80 mt-1 font-medium">Toàn bộ khách hàng</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-slate-500" /> Tổng Số Khách
            </span>
            <div>
              <div className="text-2xl font-black text-slate-900">{customers.length} <span className="text-xs font-normal text-muted-foreground">nhà đầu tư</span></div>
              <p className="text-[11px] text-muted-foreground mt-1">Được lưu trữ trên hệ thống</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/40 border-amber-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-amber-600" /> Khách VVIP & VIP
            </span>
            <div>
              <div className="text-2xl font-black text-amber-700">{vipCount} <span className="text-xs font-normal text-amber-600">khách</span></div>
              <p className="text-[11px] text-amber-700/80 mt-1">Chiếm {Math.round((vipCount / customers.length) * 100)}% tổng số lượng</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/40 border-emerald-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Đã Giao Dịch
            </span>
            <div>
              <div className="text-2xl font-black text-emerald-700">{transactedCount} <span className="text-xs font-normal text-emerald-600">khách</span></div>
              <p className="text-[11px] text-emerald-700/80 mt-1">Đã ký HĐMB hoặc đặt cọc</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/40 border-blue-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <HeartHandshake className="h-3.5 w-3.5 text-blue-600" /> Đang Chăm Sóc
            </span>
            <div>
              <div className="text-2xl font-black text-blue-700">{activeCount} <span className="text-xs font-normal text-blue-600">khách</span></div>
              <p className="text-[11px] text-blue-700/80 mt-1">Đang tìm hiểu dự án</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs by Rank & Filter Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-4">
          
          {/* Tabs List */}
          <div className="flex overflow-x-auto pb-2 scrollbar-hide border-b">
            <div className="flex gap-2">
              {["Tất cả", "VVIP", "VIP", "Tiềm Năng", "Mới"].map((rank) => (
                <Button
                  key={rank}
                  variant={activeTab === rank ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab(rank)}
                  className={`rounded-full h-8 text-xs font-semibold gap-1.5 ${
                    activeTab === rank 
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white" 
                      : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {rank}
                  <Badge 
                    variant="secondary" 
                    className={`text-[10px] px-1.5 py-0 h-4 ${
                      activeTab === rank ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {getCount(rank)}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Inline Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Tìm tên, SĐT, email, mã KH..." 
                className="pl-9 h-9 text-xs" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Trạng thái chăm sóc" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả Trạng thái</SelectItem>
                <SelectItem value="Đã giao dịch">🟢 Đã giao dịch</SelectItem>
                <SelectItem value="Đang tư vấn">🔵 Đang tư vấn</SelectItem>
                <SelectItem value="Đang chăm sóc">🟡 Đang chăm sóc</SelectItem>
              </SelectContent>
            </Select>

            {/* Agent Filter */}
            <Select value={agentFilter} onValueChange={(val) => setAgentFilter(val || "all")}>
              <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Chuyên viên phụ trách" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả Chuyên viên</SelectItem>
                {agents.map(agent => (
                  <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filter Footer */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Đang hiển thị <strong>{filteredCustomers.length}</strong> / {customers.length} khách hàng</span>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleResetFilters}
                  className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2"
                >
                  <RotateCcw className="h-3 w-3 mr-1" /> Đặt lại bộ lọc
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Data Table powered by TanStack Table & TanStack Query */}
      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="Không tìm thấy khách hàng nào phù hợp với bộ lọc."
      />

      {/* CREATE NEW CUSTOMER MODAL */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleCreateCustomer}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-bold text-indigo-900">
                <UserPlus className="h-5 w-5 text-indigo-600" />
                Thêm Hồ Sơ Khách Hàng Mới
              </DialogTitle>
              <DialogDescription>
                Nhập thông tin định danh và phân loại khẩu vị đầu tư của khách hàng.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3.5 py-4 text-sm">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên (*)</label>
                <Input 
                  placeholder="Ví dụ: Nguyễn Thế Cường" 
                  value={newCustomer.name} 
                  onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại (*)</label>
                <Input 
                  placeholder="0901234567" 
                  value={newCustomer.phone} 
                  onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email</label>
                <Input 
                  type="email" 
                  placeholder="khachhang@gmail.com" 
                  value={newCustomer.email} 
                  onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phân hạng VIP</label>
                <Select value={newCustomer.rank} onValueChange={(val) => setNewCustomer({ ...newCustomer, rank: (val as any) || 'VIP' })}>
                  <SelectTrigger><SelectValue placeholder="Phân hạng" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VVIP">VVIP Kim Cương</SelectItem>
                    <SelectItem value="VIP">VIP Bạch Kim</SelectItem>
                    <SelectItem value="Tiềm Năng">Tiềm Năng</SelectItem>
                    <SelectItem value="Mới">Khách Mới</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chuyên viên phụ trách</label>
                <Select value={newCustomer.assignedTo} onValueChange={(val) => setNewCustomer({ ...newCustomer, assignedTo: val || 'Lê Hoàng Anh' })}>
                  <SelectTrigger><SelectValue placeholder="Chuyên viên" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lê Hoàng Anh">Lê Hoàng Anh</SelectItem>
                    <SelectItem value="Thanh Hà">Thanh Hà</SelectItem>
                    <SelectItem value="Tuấn Tú">Tuấn Tú</SelectItem>
                    <SelectItem value="Minh Anh">Minh Anh</SelectItem>
                    <SelectItem value="Nguyễn Mai">Nguyễn Mai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Trạng thái chăm sóc</label>
                <Select value={newCustomer.status} onValueChange={(val) => setNewCustomer({ ...newCustomer, status: (val as any) || 'Đang tư vấn' })}>
                  <SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang tư vấn">Đang tư vấn</SelectItem>
                    <SelectItem value="Đang chăm sóc">Đang chăm sóc</SelectItem>
                    <SelectItem value="Đã giao dịch">Đã giao dịch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Doanh thu ban đầu (VNĐ)</label>
                <Input 
                  type="number" 
                  step={1000000000} 
                  value={newCustomer.revenue} 
                  onChange={e => setNewCustomer({ ...newCustomer, revenue: Number(e.target.value) })} 
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsAddCustomerOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Tạo Khách Hàng
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
