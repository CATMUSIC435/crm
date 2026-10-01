"use client"

import React, { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, Filter, Lock, CheckCircle2, Clock, CheckSquare, 
  LayoutGrid, List, BedDouble, Bath, ArrowUpRight, LockKeyhole, 
  Sparkles, Building2, Check, Plus, Download, Copy, Share2, 
  Compass, Eye, ShieldCheck, DollarSign, Calculator, RotateCcw, 
  Home, UserCheck, Tag, FileSpreadsheet
} from "lucide-react"
import { useStore } from "@/store/useStore"
import { InventoryItem } from "@/types"

function getStatusBadge(status: string) {
  switch (status) {
    case "Trống":
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none flex items-center gap-1 w-max font-semibold"><CheckCircle2 className="h-3 w-3"/> Trống</Badge>
    case "Booking":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none flex items-center gap-1 w-max font-semibold"><Clock className="h-3 w-3"/> Booking</Badge>
    case "Đã bán":
      return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-none flex items-center gap-1 w-max font-semibold"><CheckSquare className="h-3 w-3"/> Đã bán</Badge>
    case "Đang khóa":
      return <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-300 border-none flex items-center gap-1 w-max font-semibold"><LockKeyhole className="h-3 w-3"/> Đang khóa</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Trống": return "bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-600"
    case "Booking": return "bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-500"
    case "Đã bán": return "bg-rose-500 border-rose-600 text-white opacity-85 hover:bg-rose-600"
    case "Đang khóa": return "bg-slate-400 border-slate-500 text-white hover:bg-slate-500"
    default: return "bg-gray-200"
  }
}

function formatCurrency(amount: number) {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} Tỷ`
  }
  return `${(amount / 1e6).toLocaleString()} Tr`
}

export default function InventoryPage() {
  const { inventory, projects, customers, updateInventoryStatus, addInventoryItem } = useStore()
  
  // Filter States
  const [projectFilter, setProjectFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [bedroomFilter, setBedroomFilter] = useState('all')
  const [priceRangeFilter, setPriceRangeFilter] = useState('all')
  const [searchCode, setSearchCode] = useState('')

  // Batch Selection State
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([])

  // Modal States
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [bookingCustomer, setBookingCustomer] = useState('')
  const [bookingNote, setBookingNote] = useState('')

  // New Unit Form State
  const [newUnit, setNewUnit] = useState({
    code: '',
    projectId: projects[0]?.id || 'p1',
    tower: 'Tháp A',
    floor: 1,
    type: 'Căn hộ cao cấp',
    price: 5000000000,
    area: 75,
    bedrooms: 2,
    bathrooms: 2,
    direction: 'Đông Nam',
    view: 'Công viên nội khu',
    handoverStandard: 'Full nội thất' as const,
    discountPolicy: 'Chiết khấu 3% thanh toán sớm'
  })

  const getProjectName = (projectId: string) => {
    return projects.find(p => p.id === projectId)?.name || 'Dự án'
  }

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return null
    return customers.find(c => c.id === customerId)?.name || customerId
  }

  // Active filters count
  const hasActiveFilters = projectFilter !== 'all' || statusFilter !== 'all' || 
    typeFilter !== 'all' || bedroomFilter !== 'all' || priceRangeFilter !== 'all' || searchCode.trim() !== ''

  const handleResetFilters = () => {
    setProjectFilter('all')
    setStatusFilter('all')
    setTypeFilter('all')
    setBedroomFilter('all')
    setPriceRangeFilter('all')
    setSearchCode('')
  }

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      // Project Filter
      if (projectFilter !== 'all' && item.projectId !== projectFilter) return false
      
      // Status Filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'available' && item.status !== 'Trống') return false
        if (statusFilter === 'booking' && item.status !== 'Booking') return false
        if (statusFilter === 'sold' && item.status !== 'Đã bán') return false
        if (statusFilter === 'locked' && item.status !== 'Đang khóa') return false
      }

      // Property Type Filter
      if (typeFilter !== 'all') {
        const itemType = item.type.toLowerCase()
        if (typeFilter === 'apartment' && !itemType.includes('căn hộ') && !itemType.includes('sky villa')) return false
        if (typeFilter === 'villa' && !itemType.includes('biệt thự') && !itemType.includes('dinh thự')) return false
        if (typeFilter === 'shophouse' && !itemType.includes('shophouse') && !itemType.includes('thương mại')) return false
        if (typeFilter === 'townhouse' && !itemType.includes('nhà phố')) return false
      }

      // Bedroom Filter
      if (bedroomFilter !== 'all') {
        const br = item.bedrooms || 0
        if (bedroomFilter === '1' && br !== 1) return false
        if (bedroomFilter === '2' && br !== 2) return false
        if (bedroomFilter === '3' && br !== 3) return false
        if (bedroomFilter === '4+' && br < 4) return false
      }

      // Price Range Filter
      if (priceRangeFilter !== 'all') {
        if (priceRangeFilter === 'under10' && item.price >= 10e9) return false
        if (priceRangeFilter === '10to20' && (item.price < 10e9 || item.price > 20e9)) return false
        if (priceRangeFilter === '20to30' && (item.price < 20e9 || item.price > 30e9)) return false
        if (priceRangeFilter === 'above30' && item.price <= 30e9) return false
      }

      // Search Code / Keywords
      if (searchCode.trim()) {
        const query = searchCode.toLowerCase().trim()
        const matchesCode = item.code.toLowerCase().includes(query)
        const matchesType = item.type.toLowerCase().includes(query)
        const matchesView = (item.view || '').toLowerCase().includes(query)
        const matchesDirection = (item.direction || '').toLowerCase().includes(query)
        if (!matchesCode && !matchesType && !matchesView && !matchesDirection) return false
      }

      return true
    })
  }, [inventory, projectFilter, statusFilter, typeFilter, bedroomFilter, priceRangeFilter, searchCode])

  // KPI Calculations
  const totalValueRemaining = filteredInventory
    .filter(i => i.status !== 'Đã bán')
    .reduce((sum, item) => sum + item.price, 0)

  const availableCount = filteredInventory.filter(i => i.status === 'Trống').length
  const bookingCount = filteredInventory.filter(i => i.status === 'Booking').length
  const soldCount = filteredInventory.filter(i => i.status === 'Đã bán').length
  const lockedCount = filteredInventory.filter(i => i.status === 'Đang khóa').length
  
  // Absorption Rate
  const totalUnits = filteredInventory.length
  const absorptionRate = totalUnits > 0 ? Math.round(((soldCount + bookingCount) / totalUnits) * 100) : 0

  // Group inventory cho Grid View theo Tháp và Tầng
  const groupedInventory = useMemo(() => {
    return filteredInventory.reduce((acc, item) => {
      const tower = item.tower || 'Phân khu mở'
      const floor = item.floor || 1
      if (!acc[tower]) acc[tower] = {}
      if (!acc[tower][floor]) acc[tower][floor] = []
      acc[tower][floor].push(item)
      return acc
    }, {} as Record<string, Record<number, typeof inventory>>)
  }, [filteredInventory])

  // Handlers
  const handleOpenBookingModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setBookingCustomer(customers[0]?.id || '')
    setIsBookingModalOpen(true)
  }

  const handleConfirmBooking = () => {
    if (!selectedItem) return
    updateInventoryStatus(selectedItem.id, 'Booking', bookingCustomer)
    setSelectedItem({ ...selectedItem, status: 'Booking', customerId: bookingCustomer })
    setIsBookingModalOpen(false)
    setActionSuccess(`Đã giữ chỗ thành công căn ${selectedItem.code} cho khách hàng ${getCustomerName(bookingCustomer)}!`)
    setTimeout(() => setActionSuccess(null), 3500)
  }

  const handleReleaseUnit = (item: InventoryItem) => {
    updateInventoryStatus(item.id, 'Trống', undefined)
    setSelectedItem({ ...item, status: 'Trống', customerId: undefined })
    setActionSuccess(`Đã hủy giữ chỗ căn ${item.code}. Căn hiện ở trạng thái Trống và sẵn sàng giao dịch!`)
    setTimeout(() => setActionSuccess(null), 3000)
  }

  const handleToggleLock = (item: InventoryItem) => {
    const newStatus = item.status === 'Đang khóa' ? 'Trống' : 'Đang khóa'
    updateInventoryStatus(item.id, newStatus)
    setSelectedItem({ ...item, status: newStatus })
    setActionSuccess(`Đã cập nhật trạng thái căn ${item.code} sang "${newStatus}"!`)
    setTimeout(() => setActionSuccess(null), 3000)
  }

  // Batch Lock / Release
  const handleBatchLock = () => {
    if (selectedUnitIds.length === 0) return
    selectedUnitIds.forEach(id => updateInventoryStatus(id, 'Đang khóa'))
    setActionSuccess(`Đã khóa thành công ${selectedUnitIds.length} căn hộ được chọn!`)
    setSelectedUnitIds([])
    setTimeout(() => setActionSuccess(null), 3000)
  }

  const handleBatchRelease = () => {
    if (selectedUnitIds.length === 0) return
    selectedUnitIds.forEach(id => updateInventoryStatus(id, 'Trống'))
    setActionSuccess(`Đã mở bán lại ${selectedUnitIds.length} căn hộ về trạng thái Trống!`)
    setSelectedUnitIds([])
    setTimeout(() => setActionSuccess(null), 3000)
  }

  const toggleSelectAll = () => {
    if (selectedUnitIds.length === filteredInventory.length) {
      setSelectedUnitIds([])
    } else {
      setSelectedUnitIds(filteredInventory.map(i => i.id))
    }
  }

  const toggleSelectUnit = (id: string) => {
    setSelectedUnitIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Mã Căn", "Dự Án", "Tòa/Khu", "Tầng", "Loại BĐS", "Diện Tích (m2)", "Giá Bán (VNĐ)", "Phòng Ngủ", "Phòng Tắm", "Hướng", "Tầm Nhìn", "Trạng Thái"]
    const rows = filteredInventory.map(i => [
      i.code,
      getProjectName(i.projectId),
      i.tower || '',
      i.floor || 1,
      i.type,
      i.area,
      i.price,
      i.bedrooms || 0,
      i.bathrooms || 0,
      i.direction || '',
      i.view || '',
      i.status
    ])

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `Bang_Hang_NovaCRM_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setActionSuccess("Đã xuất danh sách rổ hàng thành file Excel/CSV thành công!")
    setTimeout(() => setActionSuccess(null), 3000)
  }

  // Create Unit Submit
  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUnit.code.trim()) return

    addInventoryItem({
      code: newUnit.code.trim(),
      projectId: newUnit.projectId,
      tower: newUnit.tower,
      floor: Number(newUnit.floor),
      type: newUnit.type,
      price: Number(newUnit.price),
      area: Number(newUnit.area),
      bedrooms: Number(newUnit.bedrooms),
      bathrooms: Number(newUnit.bathrooms),
      direction: newUnit.direction,
      view: newUnit.view,
      handoverStandard: newUnit.handoverStandard,
      status: 'Trống',
      discountPolicy: newUnit.discountPolicy
    })

    setIsAddUnitOpen(false)
    setActionSuccess(`Đã tạo thành công căn hộ mới ${newUnit.code}!`)
    setNewUnit({
      code: '',
      projectId: projects[0]?.id || 'p1',
      tower: 'Tháp A',
      floor: 1,
      type: 'Căn hộ cao cấp',
      price: 5000000000,
      area: 75,
      bedrooms: 2,
      bathrooms: 2,
      direction: 'Đông Nam',
      view: 'Công viên nội khu',
      handoverStandard: 'Full nội thất',
      discountPolicy: 'Chiết khấu 3% thanh toán sớm'
    })
    setTimeout(() => setActionSuccess(null), 3500)
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Toast Feedback */}
      {actionSuccess && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Rổ Hàng Bất Động Sản</h1>
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 font-bold border-none px-3 py-1">
              Live Matrix
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản trị bảng hàng thời gian thực, giám sát tiến độ giữ chỗ và mở khóa giỏ hàng đa phân khu.
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
            onClick={() => setIsAddUnitOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Thêm Căn Mới
          </Button>
        </div>
      </div>

      {/* KPI Cards & Absorption Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Value */}
        <Card className="bg-gradient-to-br from-indigo-50/70 to-white border-indigo-100 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> Giá trị rổ hàng còn lại
            </span>
            <div>
              <div className="text-2xl font-black text-indigo-950">{formatCurrency(totalValueRemaining)}</div>
              <p className="text-[11px] text-indigo-600/80 mt-1 font-medium">Chưa bao gồm các căn đã bán</p>
            </div>
          </CardContent>
        </Card>

        {/* Absorption Rate */}
        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tỷ lệ hấp thụ</span>
              <span className="text-xs font-bold text-slate-700">{absorptionRate}%</span>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">{soldCount + bookingCount} / {totalUnits}</div>
              <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${absorptionRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Units */}
        <Card className="bg-emerald-50/40 border-emerald-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Sẵn sàng bán (Trống)
            </span>
            <div>
              <div className="text-2xl font-black text-emerald-700">{availableCount} <span className="text-xs font-normal text-emerald-600">căn</span></div>
              <p className="text-[11px] text-emerald-700/80 mt-1">Đang mở bán trên toàn hệ thống</p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Units */}
        <Card className="bg-amber-50/40 border-amber-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-600" /> Đang giữ chỗ (Booking)
            </span>
            <div>
              <div className="text-2xl font-black text-amber-700">{bookingCount} <span className="text-xs font-normal text-amber-600">căn</span></div>
              <p className="text-[11px] text-amber-700/80 mt-1">Đang trong thời hạn vào cọc</p>
            </div>
          </CardContent>
        </Card>

        {/* Sold / Locked Units */}
        <Card className="bg-rose-50/40 border-rose-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-rose-600" /> Đã bán & Khóa
            </span>
            <div>
              <div className="text-2xl font-black text-rose-700">{soldCount} <span className="text-xs text-rose-600 font-normal">đã bán</span> • {lockedCount} <span className="text-xs text-slate-500 font-normal">khóa</span></div>
              <p className="text-[11px] text-rose-700/80 mt-1">Không khả dụng giao dịch</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Multi-Dimensional Filter Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            
            {/* 1. Project */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 mb-1 block">Dự án</label>
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

            {/* 2. Status */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 mb-1 block">Trạng thái</label>
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Tất cả trạng thái" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="available">🟢 Trống (Available)</SelectItem>
                  <SelectItem value="booking">🟡 Đang Booking</SelectItem>
                  <SelectItem value="sold">🔴 Đã bán (Sold)</SelectItem>
                  <SelectItem value="locked">⚪ Đang khóa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Property Type */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 mb-1 block">Loại Bất Động Sản</label>
              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Tất cả loại hình" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại hình</SelectItem>
                  <SelectItem value="apartment">Căn hộ / Sky Villa</SelectItem>
                  <SelectItem value="villa">Biệt thự / Dinh thự</SelectItem>
                  <SelectItem value="shophouse">Shophouse thương mại</SelectItem>
                  <SelectItem value="townhouse">Nhà phố liên kế</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Bedrooms */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 mb-1 block">Số phòng ngủ</label>
              <Select value={bedroomFilter} onValueChange={(val) => setBedroomFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Tất cả PN" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả PN</SelectItem>
                  <SelectItem value="1">1 Phòng ngủ</SelectItem>
                  <SelectItem value="2">2 Phòng ngủ</SelectItem>
                  <SelectItem value="3">3 Phòng ngủ</SelectItem>
                  <SelectItem value="4+">4+ Phòng ngủ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 5. Price Range */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 mb-1 block">Khoảng giá</label>
              <Select value={priceRangeFilter} onValueChange={(val) => setPriceRangeFilter(val || "all")}>
                <SelectTrigger className="w-full h-9 text-xs"><SelectValue placeholder="Tất cả mức giá" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả mức giá</SelectItem>
                  <SelectItem value="under10">&lt; 10 Tỷ VNĐ</SelectItem>
                  <SelectItem value="10to20">10 - 20 Tỷ VNĐ</SelectItem>
                  <SelectItem value="20to30">20 - 30 Tỷ VNĐ</SelectItem>
                  <SelectItem value="above30">&gt; 30 Tỷ VNĐ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 6. Search Bar */}
            <div>
              <label className="text-[11px] font-bold uppercase text-slate-500 mb-1 block">Tìm nhanh mã căn</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Mã căn, view, hướng..." 
                  className="pl-8 h-9 text-xs" 
                  value={searchCode}
                  onChange={e => setSearchCode(e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* Filter Footer Info */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Đang hiển thị <strong>{filteredInventory.length}</strong> / {inventory.length} căn hộ</span>
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

            {/* Legend */}
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Trống</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Booking</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Đã bán</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Đang khóa</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Batch Operations Bar (When items are selected) */}
      {selectedUnitIds.length > 0 && (
        <div className="bg-indigo-950 text-white p-3.5 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Đã chọn <strong>{selectedUnitIds.length}</strong> căn hộ trong danh sách</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-8 border-slate-700 bg-slate-800 text-white hover:bg-slate-700" onClick={handleBatchLock}>
              <Lock className="h-3.5 w-3.5 mr-1" /> Khóa Hàng Loạt
            </Button>
            <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleBatchRelease}>
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Mở Bán Trở Lại
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-slate-300 hover:text-white" onClick={() => setSelectedUnitIds([])}>
              Bỏ chọn
            </Button>
          </div>
        </div>
      )}

      {/* Main Content Tabs (Grid vs Table) */}
      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList className="bg-muted p-1 rounded-xl">
            <TabsTrigger value="grid" className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg">
              <LayoutGrid className="h-4 w-4"/> Sơ Đồ Phân Lô (Grid Matrix)
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2 px-4 py-2 font-medium rounded-lg">
              <List className="h-4 w-4"/> Danh Sách Chi Tiết (Table View)
            </TabsTrigger>
          </TabsList>
        </div>

        {/* 1. VIEW LƯỚI (GRID MAP MATRIX) */}
        <TabsContent value="grid" className="space-y-6 outline-none mt-0">
          {Object.keys(groupedInventory).length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                <Home className="h-12 w-12 text-slate-300 mb-3" />
                <p className="font-semibold text-slate-700">Không tìm thấy căn hộ nào phù hợp</p>
                <p className="text-xs text-slate-500 mt-1">Vui lòng điều chỉnh lại bộ lọc dự án hoặc khoảng giá để xem thêm căn.</p>
                <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4">
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          ) : (
            Object.entries(groupedInventory).map(([tower, floors]) => (
              <Card key={tower} className="overflow-hidden shadow-sm border border-slate-200">
                <CardHeader className="bg-slate-50/80 pb-3 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                      {tower}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {Object.values(floors).flat().length} sản phẩm
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {Object.entries(floors)
                      .sort(([a], [b]) => Number(b) - Number(a))
                      .map(([floor, items]) => (
                        <div key={floor} className="flex flex-col sm:flex-row border-b last:border-0 hover:bg-slate-50/30 transition-colors">
                          <div className="w-full sm:w-24 bg-slate-50/60 flex sm:flex-col items-center justify-between sm:justify-center font-bold text-slate-600 border-b sm:border-b-0 sm:border-r p-3 shrink-0">
                            <span className="text-[10px] uppercase tracking-wider text-slate-400">Tầng</span>
                            <span className="text-lg font-black text-slate-800">{floor}</span>
                          </div>
                          
                          <div className="p-4 flex-1 overflow-x-auto">
                            <div className="flex gap-3 min-w-max">
                              {items.map(item => (
                                <div 
                                  key={item.id} 
                                  onClick={() => setSelectedItem(item)}
                                  className={`
                                    relative p-3.5 rounded-xl border-2 min-w-[155px] cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all
                                    ${getStatusColor(item.status)}
                                  `}
                                >
                                  <div className="flex justify-between items-start mb-1.5">
                                    <span className="font-extrabold text-sm tracking-tight drop-shadow-sm">{item.code}</span>
                                    {item.status === 'Đã bán' ? (
                                      <Lock className="h-3.5 w-3.5 text-white/80" />
                                    ) : item.status === 'Booking' ? (
                                      <Clock className="h-3.5 w-3.5 text-amber-950/80" />
                                    ) : null}
                                  </div>

                                  <div className="text-[11px] opacity-90 font-medium truncate max-w-[130px]" title={item.type}>
                                    {item.type}
                                  </div>

                                  <div className="flex items-center gap-2 text-[10px] opacity-90 mt-1.5 mb-2.5">
                                    <span className="flex items-center gap-0.5"><BedDouble className="h-3 w-3"/> {item.bedrooms || '-'}</span>
                                    <span className="flex items-center gap-0.5"><Bath className="h-3 w-3"/> {item.bathrooms || '-'}</span>
                                    <span>{item.area} m²</span>
                                  </div>

                                  <div className="flex justify-between items-center pt-1 border-t border-black/10">
                                    <span className="font-black text-xs drop-shadow-sm">
                                      {formatCurrency(item.price)}
                                    </span>
                                    <span className="text-[9px] uppercase tracking-wider opacity-80">
                                      {item.direction ? item.direction.split(' ')[0] : ''}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* 2. VIEW BẢNG (TABLE LIST VIEW) */}
        <TabsContent value="list" className="outline-none mt-0">
          <Card className="shadow-sm">
            <div className="overflow-x-auto w-full pb-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    <TableHead className="w-12 text-center">
                      <Checkbox 
                        checked={selectedUnitIds.length === filteredInventory.length && filteredInventory.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[120px]">Mã Căn</TableHead>
                    <TableHead>Dự Án / Phân Khu</TableHead>
                    <TableHead>Loại BĐS</TableHead>
                    <TableHead>Thông Số</TableHead>
                    <TableHead>Hướng & View</TableHead>
                    <TableHead>Giá Niêm Yết</TableHead>
                    <TableHead>Chính Sách Ưu Đãi</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                        Không tìm thấy căn hộ nào phù hợp với bộ lọc.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInventory.map((item) => (
                      <TableRow key={item.id} className="hover:bg-slate-50/80 cursor-pointer" onClick={() => setSelectedItem(item)}>
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedUnitIds.includes(item.id)}
                            onCheckedChange={() => toggleSelectUnit(item.id)}
                          />
                        </TableCell>
                        <TableCell className="font-extrabold text-indigo-600">
                          {item.code}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-slate-800">{getProjectName(item.projectId)}</div>
                          <div className="text-xs text-muted-foreground">{item.tower} • Tầng {item.floor}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-medium bg-slate-50">{item.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-semibold">{item.area} m²</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                            <span>{item.bedrooms} PN</span> • <span>{item.bathrooms} WC</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{item.direction || '—'}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[130px]">{item.view || '—'}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-slate-900">{formatCurrency(item.price)}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">~ {Math.round(item.price / item.area / 1e6)} Tr/m²</div>
                        </TableCell>
                        <TableCell>
                          {item.discountPolicy ? (
                            <div className="text-xs text-indigo-700 bg-indigo-50/80 px-2 py-1 rounded border border-indigo-100/80 max-w-[160px] truncate" title={item.discountPolicy}>
                              <Sparkles className="h-3 w-3 inline mr-1 text-indigo-500" />
                              {item.discountPolicy}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Theo chính sách chuẩn</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                            {item.status === 'Trống' ? (
                              <Button 
                                size="sm" 
                                className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                                onClick={() => handleOpenBookingModal(item)}
                              >
                                Giữ chỗ
                              </Button>
                            ) : item.status === 'Booking' ? (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 text-xs border-amber-300 text-amber-800 hover:bg-amber-50"
                                onClick={() => setSelectedItem(item)}
                              >
                                Xem cọc
                              </Button>
                            ) : (
                              <Button size="sm" variant="ghost" className="h-8 text-xs text-slate-400" onClick={() => setSelectedItem(item)}>
                                Chi tiết
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* UNIT DETAIL DIALOG */}
      <Dialog open={selectedItem !== null && !isBookingModalOpen} onOpenChange={() => { setSelectedItem(null); setActionSuccess(null); }}>
        <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pb-2 border-b">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono text-base px-3 py-1 font-bold border-indigo-200 text-indigo-700 bg-indigo-50/50">
                  {selectedItem?.code}
                </Badge>
                <span className="text-xs text-muted-foreground">• {selectedItem?.type}</span>
              </div>
              {selectedItem && getStatusBadge(selectedItem.status)}
            </div>
            
            <DialogTitle className="text-xl mt-3 flex items-center gap-2 font-bold text-slate-900">
              <Building2 className="h-5 w-5 text-indigo-600 shrink-0" />
              {selectedItem && getProjectName(selectedItem.projectId)}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.tower} • Tầng {selectedItem?.floor} • Tiêu chuẩn bàn giao: <strong>{selectedItem?.handoverStandard || 'Full nội thất'}</strong>
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-2">
              
              {/* Thông số kỹ thuật */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="text-xs text-muted-foreground block">Diện tích thông thủy</span>
                  <span className="font-extrabold text-base text-slate-900">{selectedItem.area} m²</span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="text-xs text-muted-foreground block">Đơn giá / m²</span>
                  <span className="font-extrabold text-base text-slate-900">~ {Math.round(selectedItem.price / selectedItem.area / 1e6)} Tr</span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="text-xs text-muted-foreground block">Bố trí phòng</span>
                  <span className="font-bold text-slate-800">{selectedItem.bedrooms || 0} PN • {selectedItem.bathrooms || 0} WC</span>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="text-xs text-muted-foreground block">Hướng ban công</span>
                  <span className="font-bold text-slate-800">{selectedItem.direction || 'Đông Nam'}</span>
                </div>
              </div>

              {/* Tầm view & Vị trí */}
              <div className="p-3.5 bg-slate-50 border rounded-xl text-sm flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Tầm nhìn cảnh quan (View)</span>
                  <span className="font-bold text-slate-800">{selectedItem.view || 'View nội khu xanh mát'}</span>
                </div>
                <Compass className="h-7 w-7 text-indigo-400 opacity-60" />
              </div>

              {/* Sơ đồ căn hộ 2D Mini Schematic */}
              <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">Bố trí mặt bằng kiến trúc</span>
                  <Badge variant="outline" className="text-[10px] text-indigo-300 border-indigo-700">Tỷ lệ 1:50</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3">
                  <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
                    <span className="text-[10px] text-indigo-200 block">Phòng khách</span>
                    <span className="font-bold">~ 28 m²</span>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
                    <span className="text-[10px] text-indigo-200 block">Phòng ngủ Master</span>
                    <span className="font-bold">~ 20 m²</span>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
                    <span className="text-[10px] text-indigo-200 block">Ban công & Logia</span>
                    <span className="font-bold">~ 6.5 m²</span>
                  </div>
                </div>
              </div>

              {/* Chính sách ưu đãi bán hàng */}
              {selectedItem.discountPolicy && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Chính sách ưu đãi đang áp dụng:</strong>
                    <p className="mt-0.5">{selectedItem.discountPolicy}</p>
                  </div>
                </div>
              )}

              {/* Thông tin Booking nếu đã có người giữ chỗ */}
              {selectedItem.status === 'Booking' && (
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-amber-900">
                    <UserCheck className="h-4 w-4 text-amber-700" />
                    <span>Thông tin giữ chỗ hiện tại:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                    <div>Khách hàng: <strong>{getCustomerName(selectedItem.customerId) || 'Khách VIP'}</strong></div>
                    <div>Chuyên viên giữ chỗ: <strong>{selectedItem.holdingAgent || 'Lê Hoàng Anh'}</strong></div>
                    {selectedItem.bookingExpiresAt && (
                      <div className="col-span-2 text-rose-600 font-semibold">
                        Hạn chót nộp cọc: {selectedItem.bookingExpiresAt}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tổng giá niêm yết */}
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-indigo-700 font-semibold block uppercase tracking-wider">Tổng giá niêm yết (Gồm VAT & KPBT)</span>
                  <div className="font-black text-2xl text-indigo-950 mt-0.5">{formatCurrency(selectedItem.price)} VNĐ</div>
                </div>
                <div className="text-right text-xs text-indigo-800">
                  <span>Vốn tự có (30%): <strong>{formatCurrency(selectedItem.price * 0.3)}</strong></span>
                  <div className="mt-0.5">Vay 70% góp ~ {Math.round(selectedItem.price * 0.7 * 0.0075 / 1e6)} Tr/tháng</div>
                </div>
              </div>

            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0 pt-2 border-t">
            {selectedItem?.status === 'Trống' && (
              <Button 
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold" 
                onClick={() => handleOpenBookingModal(selectedItem)}
              >
                <Clock className="h-4 w-4 mr-2" /> Giữ Chỗ Căn Này (Booking)
              </Button>
            )}

            {selectedItem?.status === 'Booking' && (
              <Button 
                variant="outline" 
                className="border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold" 
                onClick={() => handleReleaseUnit(selectedItem)}
              >
                Hủy Giữ Chỗ (Mở lại Trống)
              </Button>
            )}

            {selectedItem && selectedItem.status !== 'Đã bán' && (
              <Button variant="outline" onClick={() => handleToggleLock(selectedItem)}>
                {selectedItem.status === 'Đang khóa' ? 'Mở Khóa Căn' : 'Khóa Căn Nội Bộ'}
              </Button>
            )}

            <Button 
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(`Căn hộ ${selectedItem?.code} - Dự án ${selectedItem && getProjectName(selectedItem.projectId)} - Giá: ${selectedItem && formatCurrency(selectedItem.price)} VNĐ`)
                setActionSuccess(`Đã sao chép thông tin căn ${selectedItem?.code} vào clipboard!`)
                setTimeout(() => setActionSuccess(null), 2500)
              }}
            >
              <Copy className="h-4 w-4 mr-1.5" /> Sao Chép Thông Tin
            </Button>

            <Button variant="ghost" onClick={() => { setSelectedItem(null); setActionSuccess(null); }}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* BOOKING MODAL (FORM CHỌN KHÁCH HÀNG & GHI CHÚ CỌC) */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-amber-800">
              <Clock className="h-5 w-5 text-amber-600" />
              Xác Nhận Giữ Chỗ Căn {selectedItem?.code}
            </DialogTitle>
            <DialogDescription>
              Phiếu giữ chỗ sẽ được gửi lên hệ thống và chuyển trạng thái căn sang <strong>Booking</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3 text-sm">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Chọn Khách Hàng</label>
              <Select value={bookingCustomer} onValueChange={(val) => setBookingCustomer(val || customers[0]?.id || '')}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Chọn khách hàng" /></SelectTrigger>
                <SelectContent>
                  {customers.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.code} - {c.rank})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Số tiền cọc dự kiến (VNĐ)</label>
              <Input 
                defaultValue="100.000.000" 
                className="font-bold text-indigo-700" 
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">Tiền cọc tối thiểu theo quy định CĐT là 100 Triệu VNĐ.</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Ghi chú hoặc cam kết tiến độ</label>
              <Input 
                placeholder="Ví dụ: Khách cam kết bổ sung đủ cọc trong 24 giờ tới..." 
                value={bookingNote}
                onChange={e => setBookingNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={() => setIsBookingModalOpen(false)}>Hủy</Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold" onClick={handleConfirmBooking}>
              Xác Nhận Giữ Chỗ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE NEW UNIT MODAL */}
      <Dialog open={isAddUnitOpen} onOpenChange={setIsAddUnitOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleCreateUnit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-bold text-indigo-900">
                <Plus className="h-5 w-5 text-indigo-600" />
                Thêm Căn Hộ Mới Vào Rổ Hàng
              </DialogTitle>
              <DialogDescription>
                Nhập thông số căn hộ để thêm vào sơ đồ phân lô và bảng hàng mở bán.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3.5 py-4 text-sm">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700 block mb-1">Dự án</label>
                <Select value={newUnit.projectId} onValueChange={(val) => setNewUnit({ ...newUnit, projectId: val || 'p1' })}>
                  <SelectTrigger><SelectValue placeholder="Chọn dự án" /></SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-slate-700 block mb-1">Mã căn hộ (*)</label>
                <Input 
                  placeholder="Ví dụ: AQC-18B.02" 
                  value={newUnit.code} 
                  onChange={e => setNewUnit({ ...newUnit, code: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tòa / Phân khu</label>
                <Input 
                  value={newUnit.tower} 
                  onChange={e => setNewUnit({ ...newUnit, tower: e.target.value })} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tầng</label>
                <Input 
                  type="number" 
                  min={1} 
                  max={50} 
                  value={newUnit.floor} 
                  onChange={e => setNewUnit({ ...newUnit, floor: Number(e.target.value) })} 
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Loại Bất Động Sản</label>
                <Select value={newUnit.type} onValueChange={(val) => setNewUnit({ ...newUnit, type: val || 'Căn hộ cao cấp' })}>
                  <SelectTrigger><SelectValue placeholder="Loại BĐS" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Căn hộ cao cấp">Căn hộ cao cấp</SelectItem>
                    <SelectItem value="Căn hộ Sky Villa">Căn hộ Sky Villa</SelectItem>
                    <SelectItem value="Biệt thự biển đơn lập">Biệt thự biển đơn lập</SelectItem>
                    <SelectItem value="Biệt thự ven sông">Biệt thự ven sông</SelectItem>
                    <SelectItem value="Shophouse thương mại">Shophouse thương mại</SelectItem>
                    <SelectItem value="Nhà phố liên kế">Nhà phố liên kế</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Giá bán niêm yết (VNĐ)</label>
                <Input 
                  type="number" 
                  step={100000000} 
                  value={newUnit.price} 
                  onChange={e => setNewUnit({ ...newUnit, price: Number(e.target.value) })} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Diện tích (m²)</label>
                <Input 
                  type="number" 
                  value={newUnit.area} 
                  onChange={e => setNewUnit({ ...newUnit, area: Number(e.target.value) })} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Số phòng ngủ</label>
                <Input 
                  type="number" 
                  min={1} 
                  max={10} 
                  value={newUnit.bedrooms} 
                  onChange={e => setNewUnit({ ...newUnit, bedrooms: Number(e.target.value) })} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Số phòng tắm</label>
                <Input 
                  type="number" 
                  min={1} 
                  max={10} 
                  value={newUnit.bathrooms} 
                  onChange={e => setNewUnit({ ...newUnit, bathrooms: Number(e.target.value) })} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hướng nhà</label>
                <Input 
                  value={newUnit.direction} 
                  onChange={e => setNewUnit({ ...newUnit, direction: e.target.value })} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tầm nhìn (View)</label>
                <Input 
                  value={newUnit.view} 
                  onChange={e => setNewUnit({ ...newUnit, view: e.target.value })} 
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Chính sách ưu đãi</label>
                <Input 
                  value={newUnit.discountPolicy} 
                  onChange={e => setNewUnit({ ...newUnit, discountPolicy: e.target.value })} 
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsAddUnitOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Tạo Căn Mới
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
