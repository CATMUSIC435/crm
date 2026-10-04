"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { 
  Building, MapPin, Tag, Search, Filter, LayoutGrid, List, Eye, 
  Plus, FileSpreadsheet, RotateCcw, CheckCircle2, ArrowUpRight, 
  ExternalLink, Layers, DollarSign, Calendar
} from "lucide-react"
import Link from "next/link"
import { useStore } from "@/store/useStore"
import { Project } from "@/types"
import { useProjectsQuery } from "@/hooks/api/use-projects-query"
import { useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { queryKeys } from "@/hooks/api/query-keys"

function formatCurrency(amount: number | undefined) {
  if (!amount) return '0 VNĐ'
  if (amount >= 1e12) {
    return `${(amount / 1e12).toFixed(1)} Nghìn Tỷ VNĐ`
  }
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} Tỷ VNĐ`
  }
  return `${(amount / 1e6).toLocaleString()} Tr VNĐ`
}

function getStatusBadge(status: string) {
  switch (status) {
    case "Đang mở bán":
      return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none font-semibold">Đang mở bán</Badge>
    case "Sắp mở bán":
      return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none font-semibold">Sắp mở bán</Badge>
    case "Đã bàn giao":
      return <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none font-semibold">Đã bàn giao</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const { projects, addProject } = useStore()
  const { data: remoteProjects } = useProjectsQuery()
  const projectList = remoteProjects && remoteProjects.length > 0 ? remoteProjects : projects

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [developerFilter, setDeveloperFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false)

  // New Project Form State
  const [newProject, setNewProject] = useState({
    name: '',
    location: '',
    developer: 'Novaland',
    type: 'Căn hộ cao cấp' as const,
    totalUnits: 1000,
    soldUnits: 0,
    targetRevenue: 5000000000000,
    status: 'Đang mở bán' as const,
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    launchDate: '2025-06-01',
    handoverDate: '2027-12-31'
  })

  // Has active filters
  const hasActiveFilters = searchTerm.trim() !== '' || statusFilter !== 'all' || developerFilter !== 'all' || typeFilter !== 'all'

  const handleResetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDeveloperFilter('all')
    setTypeFilter('all')
  }

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projectList.filter(p => {
      const term = searchTerm.toLowerCase().trim()
      const matchesSearch = !term || 
        p.name.toLowerCase().includes(term) || 
        p.location.toLowerCase().includes(term) ||
        (p.developer || '').toLowerCase().includes(term)
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'selling' && p.status === 'Đang mở bán') ||
        (statusFilter === 'upcoming' && p.status === 'Sắp mở bán') ||
        (statusFilter === 'done' && p.status === 'Đã bàn giao')

      const matchesDeveloper = developerFilter === 'all' ||
        (developerFilter === 'novaland' && p.developer?.toLowerCase().includes('novaland')) ||
        (developerFilter === 'vingroup' && p.developer?.toLowerCase().includes('vingroup')) ||
        (developerFilter === 'masterise' && p.developer?.toLowerCase().includes('masterise'))

      const matchesType = typeFilter === 'all' ||
        (typeFilter === 'apartment' && p.type.toLowerCase().includes('căn hộ')) ||
        (typeFilter === 'villa' && p.type.toLowerCase().includes('biệt thự')) ||
        (typeFilter === 'shophouse' && p.type.toLowerCase().includes('thương mại'))

      return matchesSearch && matchesStatus && matchesDeveloper && matchesType
    })
  }, [projectList, searchTerm, statusFilter, developerFilter, typeFilter])

  // KPI Calculations
  const totalProjects = projectList.length
  const sellingCount = projectList.filter(p => p.status === 'Đang mở bán').length
  const upcomingCount = projectList.filter(p => p.status === 'Sắp mở bán').length
  const doneCount = projectList.filter(p => p.status === 'Đã bàn giao').length
  const totalTargetRevenue = projectList.reduce((sum, p) => sum + (p.targetRevenue || p.revenue || 0), 0)

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Mã Dự Án", "Tên Dự Án", "Chủ Đầu Tư", "Vị Trí", "Phân Loại", "Tổng Số Căn", "Đã Bán", "Tỷ Lệ Bán (%)", "Doanh Thu Dự Kiến (VNĐ)", "Trạng Thái"]
    const rows = filteredProjects.map(p => [
      p.id,
      p.name,
      p.developer || '',
      p.location,
      p.type,
      p.totalUnits,
      p.soldUnits,
      `${Math.round((p.soldUnits / p.totalUnits) * 100)}%`,
      p.targetRevenue || p.revenue || 0,
      p.status
    ])

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `Danh_Sach_Du_An_NovaCRM_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setToastMsg("Đã xuất danh mục dự án thành file Excel/CSV thành công!")
    setTimeout(() => setToastMsg(null), 3000)
  }

  // Create Project Submit
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProject.name.trim() || !newProject.location.trim()) return

    const projectName = newProject.name.trim()
    const projectLocation = newProject.location.trim()

    try {
      await apiClient.request('/projects', {
        method: 'POST',
        body: JSON.stringify({
          name: projectName,
          code: `DA-${Date.now().toString().slice(-4)}`,
          location: projectLocation,
          developer: newProject.developer || 'Novaland',
          type: newProject.type || 'Căn hộ cao cấp',
          totalUnits: Number(newProject.totalUnits) || 1000,
          targetRevenue: Number(newProject.targetRevenue) || 5000000000000,
        }),
      })
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    } catch (err: any) {
      console.warn('Backend API create project fallback:', err?.message)
    }

    addProject({
      name: projectName,
      location: projectLocation,
      developer: newProject.developer,
      type: newProject.type,
      totalUnits: Number(newProject.totalUnits),
      soldUnits: Number(newProject.soldUnits),
      targetRevenue: Number(newProject.targetRevenue),
      revenue: Number(newProject.targetRevenue) * 0.4,
      status: newProject.status,
      thumbnail: newProject.thumbnail,
      launchDate: newProject.launchDate,
      handoverDate: newProject.handoverDate
    })

    setIsAddProjectOpen(false)
    setToastMsg(`Đã khởi tạo thành công đại dự án "${projectName}"!`)
    setNewProject({
      name: '',
      location: '',
      developer: 'Novaland',
      type: 'Căn hộ cao cấp',
      totalUnits: 1000,
      soldUnits: 0,
      targetRevenue: 5000000000000,
      status: 'Đang mở bán',
      thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      launchDate: '2025-06-01',
      handoverDate: '2027-12-31'
    })
    setTimeout(() => setToastMsg(null), 3500)
  }

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
              <Building className="h-8 w-8 text-indigo-600" /> Danh Mục Đại Dự Án
            </h1>
            <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 font-bold border-none px-3 py-1">
              Portfolio
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Quản trị rổ hàng tổng thể các đại đô thị BĐS, theo dõi tiến độ thi công và hiệu suất bán hàng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            variant="outline" 
            onClick={handleExportCSV}
            className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 text-slate-700"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Xuất Danh Mục (CSV)
          </Button>

          <Button 
            onClick={() => setIsAddProjectOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Thêm Dự Án Mới
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-indigo-50/70 to-white border-indigo-100 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" /> Tổng Doanh Thu Kỳ Vọng
            </span>
            <div>
              <div className="text-2xl font-black text-indigo-950">{formatCurrency(totalTargetRevenue)}</div>
              <p className="text-[11px] text-indigo-600/80 mt-1 font-medium">Toàn bộ 5 đại dự án</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Tổng Quy Mô
            </span>
            <div>
              <div className="text-2xl font-black text-slate-900">{totalProjects} <span className="text-xs font-normal text-muted-foreground">Đại dự án</span></div>
              <p className="text-[11px] text-muted-foreground mt-1">Đang quản lý trên CRM</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/40 border-emerald-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Đang Mở Bán
            </span>
            <div>
              <div className="text-2xl font-black text-emerald-700">{sellingCount} <span className="text-xs font-normal text-emerald-600">dự án</span></div>
              <p className="text-[11px] text-emerald-700/80 mt-1">Sẵn sàng nhận booking</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50/40 border-amber-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-amber-600" /> Sắp Mở Bán
            </span>
            <div>
              <div className="text-2xl font-black text-amber-700">{upcomingCount} <span className="text-xs font-normal text-amber-600">dự án</span></div>
              <p className="text-[11px] text-amber-700/80 mt-1">Đang chạy truyền thông pre-launch</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50/40 border-blue-200/80 shadow-sm">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5 text-blue-600" /> Đã Bàn Giao
            </span>
            <div>
              <div className="text-2xl font-black text-blue-700">{doneCount} <span className="text-xs font-normal text-blue-600">dự án</span></div>
              <p className="text-[11px] text-blue-700/80 mt-1">Giao dịch thứ cấp & khai thác</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        
        {/* Filter Bar */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Tìm dự án, vị trí, chủ đầu tư..." 
                  className="pl-9 h-9 text-xs" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Tình trạng" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Tình trạng</SelectItem>
                  <SelectItem value="selling">🟢 Đang mở bán</SelectItem>
                  <SelectItem value="upcoming">🟡 Sắp mở bán</SelectItem>
                  <SelectItem value="done">🔵 Đã bàn giao</SelectItem>
                </SelectContent>
              </Select>

              {/* Developer Filter */}
              <Select value={developerFilter} onValueChange={(val) => setDeveloperFilter(val || "all")}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Chủ đầu tư" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Chủ đầu tư</SelectItem>
                  <SelectItem value="novaland">Novaland</SelectItem>
                  <SelectItem value="vingroup">Vingroup</SelectItem>
                  <SelectItem value="masterise">Masterise Homes</SelectItem>
                </SelectContent>
              </Select>

              {/* Property Type Filter */}
              <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val || "all")}>
                <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Loại hình BĐS" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Loại hình</SelectItem>
                  <SelectItem value="apartment">Căn hộ cao cấp</SelectItem>
                  <SelectItem value="villa">Biệt thự nghỉ dưỡng</SelectItem>
                  <SelectItem value="shophouse">Nhà phố thương mại</SelectItem>
                </SelectContent>
              </Select>

            </div>

            {/* Filter Footer */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Tìm thấy <strong>{filteredProjects.length}</strong> / {projects.length} dự án phù hợp</span>
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

              <TabsList className="bg-muted p-1 rounded-lg">
                <TabsTrigger value="grid" className="h-7 px-3 text-xs gap-1.5"><LayoutGrid className="h-3.5 w-3.5" /> Lưới thẻ</TabsTrigger>
                <TabsTrigger value="list" className="h-7 px-3 text-xs gap-1.5"><List className="h-3.5 w-3.5" /> Bảng chi tiết</TabsTrigger>
              </TabsList>
            </div>
          </CardContent>
        </Card>

        {/* 1. GRID VIEW (CARD MATRIX) */}
        <TabsContent value="grid" className="outline-none mt-0">
          {filteredProjects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center">
                <Building className="h-12 w-12 text-slate-300 mb-3" />
                <p className="font-semibold text-slate-700">Không tìm thấy dự án nào</p>
                <p className="text-xs text-slate-500 mt-1">Vui lòng điều chỉnh lại bộ lọc tìm kiếm.</p>
                <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4">
                  Xóa bộ lọc
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const soldRate = Math.round((project.soldUnits / project.totalUnits) * 100)
                return (
                  <Card key={project.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow flex flex-col group">
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      <img 
                        src={project.thumbnail || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"} 
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        {getStatusBadge(project.status)}
                        {project.developer && (
                          <Badge variant="outline" className="bg-black/40 text-white backdrop-blur-md border-white/30 text-xs">
                            {project.developer}
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary" className="bg-white/90 text-slate-800 backdrop-blur-sm text-xs shadow-sm">
                          {project.type}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/projects/${project.id}`}>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {project.name}
                          </h3>
                        </Link>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 line-clamp-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" /> {project.location}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-4 space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Tỷ lệ bán hàng:</span>
                            <span className="font-bold text-slate-800">{soldRate}% ({project.soldUnits}/{project.totalUnits} căn)</span>
                          </div>
                          <Progress value={soldRate} className="h-2" />
                        </div>

                        {/* Financial Stats */}
                        <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block">Doanh thu mục tiêu</span>
                            <span className="font-bold text-indigo-700">{formatCurrency(project.targetRevenue || project.revenue)}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-muted-foreground block">Bàn giao dự kiến</span>
                            <span className="font-medium text-slate-700">{project.handoverDate || 'Đang cập nhật'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-5 pt-3 border-t flex gap-2">
                        <Link href={`/projects/${project.id}`} className="flex-1">
                          <Button variant="outline" className="w-full h-8 text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200">
                            <Eye className="h-3.5 w-3.5 mr-1.5" /> Chi Tiết Dự Án
                          </Button>
                        </Link>
                        <Link href={`/inventory?project=${project.id}`}>
                          <Button size="sm" className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                            <Layers className="h-3.5 w-3.5 mr-1" /> Rổ Hàng
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* 2. TABLE VIEW */}
        <TabsContent value="list" className="outline-none mt-0">
          <Card className="shadow-sm">
            <div className="overflow-x-auto w-full pb-2">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80">
                    <TableHead className="w-[80px]">Hình Ảnh</TableHead>
                    <TableHead>Tên Dự Án</TableHead>
                    <TableHead>Chủ Đầu Tư</TableHead>
                    <TableHead>Vị Trí</TableHead>
                    <TableHead>Phân Loại</TableHead>
                    <TableHead>Số Căn</TableHead>
                    <TableHead className="w-[180px]">Tiến Độ Bán Hàng</TableHead>
                    <TableHead>Doanh Thu Dự Kiến</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                        Không tìm thấy dự án nào phù hợp với bộ lọc.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProjects.map((project) => {
                      const soldRate = Math.round((project.soldUnits / project.totalUnits) * 100)
                      return (
                        <TableRow key={project.id} className="hover:bg-slate-50/80">
                          <TableCell>
                            <img 
                              src={project.thumbnail || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&q=80"} 
                              alt={project.name}
                              className="w-12 h-10 object-cover rounded-md"
                            />
                          </TableCell>
                          <TableCell>
                            <Link href={`/projects/${project.id}`} className="font-bold text-indigo-600 hover:underline">
                              {project.name}
                            </Link>
                            <div className="text-xs text-muted-foreground">Mã: {project.id}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-medium bg-slate-50">
                              {project.developer || 'Novaland'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={project.location}>
                            {project.location}
                          </TableCell>
                          <TableCell className="text-xs font-medium">{project.type}</TableCell>
                          <TableCell className="text-xs font-semibold">{project.totalUnits.toLocaleString()} căn</TableCell>
                          <TableCell>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-bold text-slate-800">{soldRate}%</span>
                              <span className="text-muted-foreground">{project.soldUnits} căn</span>
                            </div>
                            <Progress value={soldRate} className="h-1.5" />
                          </TableCell>
                          <TableCell className="font-bold text-xs text-indigo-700">
                            {formatCurrency(project.targetRevenue || project.revenue)}
                          </TableCell>
                          <TableCell>{getStatusBadge(project.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1.5">
                              <Link href={`/projects/${project.id}`}>
                                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold">
                                  <Eye className="h-3.5 w-3.5 mr-1" /> Chi Tiết
                                </Button>
                              </Link>
                              <Link href={`/inventory?project=${project.id}`}>
                                <Button size="sm" className="h-8 text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold">
                                  Rổ Hàng
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
        </TabsContent>
      </Tabs>

      {/* CREATE NEW PROJECT MODAL */}
      <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleCreateProject}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-bold text-indigo-900">
                <Plus className="h-5 w-5 text-indigo-600" />
                Khởi Tạo Đại Dự Án Mới
              </DialogTitle>
              <DialogDescription>
                Nhập thông số tổng thể để đưa dự án vào danh mục quản trị và rổ hàng bán chéo.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-3.5 py-4 text-sm">
              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên dự án (*)</label>
                <Input 
                  placeholder="Ví dụ: Masteri Centre Point" 
                  value={newProject.name} 
                  onChange={e => setNewProject({ ...newProject, name: e.target.value })} 
                  required 
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ / Vị trí (*)</label>
                <Input 
                  placeholder="Ví dụ: Khu đô thị Tây Hồ Tây, Hà Nội" 
                  value={newProject.location} 
                  onChange={e => setNewProject({ ...newProject, location: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Chủ đầu tư</label>
                <Select value={newProject.developer} onValueChange={(val) => setNewProject({ ...newProject, developer: val || 'Novaland' })}>
                  <SelectTrigger><SelectValue placeholder="Chủ đầu tư" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Novaland">Novaland</SelectItem>
                    <SelectItem value="Vingroup">Vingroup</SelectItem>
                    <SelectItem value="Masterise Homes">Masterise Homes</SelectItem>
                    <SelectItem value="Sun Group">Sun Group</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phân loại BĐS</label>
                <Select value={newProject.type} onValueChange={(val) => setNewProject({ ...newProject, type: (val as any) || 'Căn hộ cao cấp' })}>
                  <SelectTrigger><SelectValue placeholder="Loại BĐS" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Căn hộ cao cấp">Căn hộ cao cấp</SelectItem>
                    <SelectItem value="Biệt thự nghỉ dưỡng">Biệt thự nghỉ dưỡng</SelectItem>
                    <SelectItem value="Nhà phố thương mại">Nhà phố thương mại</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tổng quy mô sản phẩm (căn)</label>
                <Input 
                  type="number" 
                  min={10} 
                  value={newProject.totalUnits} 
                  onChange={e => setNewProject({ ...newProject, totalUnits: Number(e.target.value) })} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Doanh thu mục tiêu (VNĐ)</label>
                <Input 
                  type="number" 
                  step={100000000000} 
                  value={newProject.targetRevenue} 
                  onChange={e => setNewProject({ ...newProject, targetRevenue: Number(e.target.value) })} 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tình trạng mở bán</label>
                <Select value={newProject.status} onValueChange={(val) => setNewProject({ ...newProject, status: (val as any) || 'Đang mở bán' })}>
                  <SelectTrigger><SelectValue placeholder="Tình trạng" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang mở bán">Đang mở bán</SelectItem>
                    <SelectItem value="Sắp mở bán">Sắp mở bán</SelectItem>
                    <SelectItem value="Đã bàn giao">Đã bàn giao</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ngày bàn giao dự kiến</label>
                <Input 
                  type="date" 
                  value={newProject.handoverDate} 
                  onChange={e => setNewProject({ ...newProject, handoverDate: e.target.value })} 
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold text-slate-700 block mb-1">Ảnh đại diện (URL Thumbnail)</label>
                <Input 
                  value={newProject.thumbnail} 
                  onChange={e => setNewProject({ ...newProject, thumbnail: e.target.value })} 
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsAddProjectOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Tạo Dự Án
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
