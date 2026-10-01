"use client"

import React, { use, useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  MapPin, Tag, Sparkles, Percent, CalendarClock, Scale, 
  Image as ImageIcon, Video, Plane, Box, Glasses, MonitorPlay,
  Layers, Map, Grip, LayoutDashboard, Component,
  FileText, Landmark, HelpCircle, FileCheck, Download,
  Brain, Target, TrendingUp, LineChart as LineChartIcon, AlertTriangle,
  CheckCircle2, Share2, Copy, Anchor, Trees, Waves, ShieldCheck, 
  GraduationCap, HeartPulse, Building2, BedDouble, Bath, Clock, CheckSquare, LockKeyhole
} from "lucide-react"
import { InteractiveFloorPlan } from "@/components/ui/interactive-floor-plan"
import Link from "next/link"
import { useStore } from "@/store/useStore"
import { InventoryItem } from "@/types"

function formatCurrency(amount: number) {
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
    case "Trống":
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none font-semibold">Trống</Badge>
    case "Booking":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none font-semibold">Booking</Badge>
    case "Đã bán":
      return <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-none font-semibold">Đã bán</Badge>
    case "Đang khóa":
      return <Badge className="bg-slate-200 text-slate-800 hover:bg-slate-300 border-none font-semibold">Đang khóa</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { projects, inventory } = useStore()
  const [activeTab, setActiveTab] = useState('overview')
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  
  // Find project by ID
  const project = projects.find(p => p.id === resolvedParams.id)

  // Units belonging to this project
  const projectUnits = useMemo(() => {
    if (!project) return []
    return inventory.filter(item => item.projectId === project.id)
  }, [inventory, project])

  if (!project) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center">
        <Building2 className="h-16 w-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy dự án</h2>
        <p className="text-sm text-muted-foreground mt-1">Dự án này có thể đã bị xóa hoặc đường dẫn không hợp lệ.</p>
        <Link href="/projects" className="mt-4">
          <Button variant="outline">Quay lại Kho Dự Án</Button>
        </Link>
      </div>
    )
  }

  // Fallback AI Analysis Data if not provided in the store
  const aiData = project.aiAnalysis || {
    summary: `Dự án ${project.name} là một trong những điểm sáng của thị trường khu vực ${project.location}. Với quy mô ${project.totalUnits.toLocaleString()} sản phẩm, dự án đang thu hút sự quan tâm lớn từ giới đầu tư tinh hoa.`,
    usps: ["Vị trí đắc địa", "Tiện ích đẳng cấp", "Thiết kế hiện đại", "Tiềm năng tăng giá vượt trội"],
    rating: "BUY",
    confidence: 88,
    paybackPeriod: "7.5 Năm",
    capitalGain: "+12 - 15% / năm",
    keyDrivers: [
      "Hạ tầng giao thông trọng điểm xung quanh đang hoàn thiện thần tốc.",
      "Nhu cầu ở thực và thuê lưu trú cao cấp tăng trưởng mạnh.",
      "Chính sách bán hàng và ân hạn nợ gốc đặc biệt ưu đãi."
    ],
    marketAverage: 85,
    macroForecast: "Thị trường đang trong chu kỳ phục hồi mạnh mẽ, mặt bằng giá dự kiến tiếp tục tăng trưởng ổn định trong 2-3 năm tới.",
    risks: [
      { title: "Rủi ro thanh khoản ngắn hạn", desc: "Cần thời gian từ 1-2 năm để hạ tầng xung quanh hoàn thiện đồng bộ." }
    ]
  };

  const handleDownloadSalesKit = (fileName: string) => {
    setToastMsg(`Đang tải xuống tài liệu: ${fileName}...`)
    setTimeout(() => {
      setToastMsg(`Đã tải xuống thành công tài liệu: ${fileName}`)
      setTimeout(() => setToastMsg(null), 3000)
    }, 1200)
  }

  const handleCopyProjectLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setToastMsg("Đã sao chép liên kết dự án vào Clipboard!")
    setTimeout(() => setToastMsg(null), 3000)
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

      {/* Header Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border shadow-md bg-slate-900">
        <div className="h-64 md:h-80 overflow-hidden relative">
          <img 
            src={project.thumbnail || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"} 
            alt={project.name}
            className="w-full h-full object-cover opacity-90 scale-100 hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20"></div>
          
          {/* Header Top Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-black/40 text-white border-white/20 backdrop-blur-md hover:bg-black/60"
              onClick={handleCopyProjectLink}
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Chia Sẻ
            </Button>
            <Button 
              size="sm" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
              onClick={() => handleDownloadSalesKit(`SalesKit_${project.name}.zip`)}
            >
              <Download className="h-3.5 w-3.5 mr-1.5" /> Tải Trọn Bộ Sales Kit
            </Button>
          </div>

          {/* Header Content */}
          <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <Badge className={`${project.status === 'Đang mở bán' ? 'bg-emerald-500' : project.status === 'Sắp mở bán' ? 'bg-amber-500' : 'bg-blue-600'} text-white border-none shadow-sm font-semibold`}>
                {project.status}
              </Badge>
              <Badge variant="outline" className="text-white border-white/40 bg-black/30 backdrop-blur-md">
                {project.type}
              </Badge>
              {project.developer && (
                <Badge variant="outline" className="text-amber-300 border-amber-300/40 bg-black/30 backdrop-blur-md font-semibold">
                  Chủ đầu tư: {project.developer}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-md">
              {project.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-slate-200">
              <span className="flex items-center gap-1.5 drop-shadow">
                <MapPin className="h-4 w-4 text-rose-400" /> {project.location}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-white drop-shadow">
                <Tag className="h-4 w-4 text-emerald-400" /> Doanh thu dự kiến: {formatCurrency(project.targetRevenue || project.revenue)}
              </span>
              <span className="flex items-center gap-1.5 drop-shadow text-amber-300">
                <CalendarClock className="h-4 w-4" /> Bàn giao: {project.handoverDate || 'Đang cập nhật'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="bg-slate-100 p-1.5 rounded-xl h-auto flex w-max min-w-full md:grid md:w-full md:grid-cols-6 gap-1">
            <TabsTrigger value="overview" className="rounded-lg font-semibold py-2">
              Tổng Quan
            </TabsTrigger>
            <TabsTrigger value="inventory" className="rounded-lg font-semibold py-2 flex items-center gap-1.5 text-indigo-700 data-[state=active]:bg-indigo-600 data-[state=active]:text-white">
              <Building2 className="h-4 w-4" /> Bảng Hàng ({projectUnits.length})
            </TabsTrigger>
            <TabsTrigger value="media" className="rounded-lg font-semibold py-2">
              Sa Bàn & Media
            </TabsTrigger>
            <TabsTrigger value="layout" className="rounded-lg font-semibold py-2">
              Mặt Bằng 2D/3D
            </TabsTrigger>
            <TabsTrigger value="saleskit" className="rounded-lg font-semibold py-2">
              Tài Liệu Sales Kit
            </TabsTrigger>
            <TabsTrigger value="ai-investment" className="rounded-lg font-semibold py-2 flex items-center gap-1.5 text-purple-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Brain className="h-4 w-4" /> AI Đánh Giá
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ================= TAB 1: TỔNG QUAN ================= */}
        <TabsContent value="overview" className="space-y-6 mt-4 outline-none">
          
          {/* AI Project Summary */}
          <Card className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 border-indigo-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-800">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Tổng Quan & Điểm Nhấn Độc Quyền (AI Project Summary)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-700">
                {aiData.summary}
              </p>
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-indigo-100">
                {aiData.usps.map((usp, idx) => (
                  <Badge key={idx} variant="secondary" className="bg-indigo-100/80 text-indigo-800 border-none font-semibold px-2.5 py-1">
                    ✓ {usp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Metrics */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Percent className="h-4 w-4 text-indigo-600" /> Chính Sách Bán Hàng Nổi Bật
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-extrabold text-base text-slate-900">Chiết khấu thanh toán sớm đến 10%</p>
                <p className="text-xs text-muted-foreground mt-1">Ân hạn nợ gốc và hỗ trợ lãi suất 0% trong 24 tháng.</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-blue-600" /> Tiến Độ Dự Án
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-extrabold text-base text-blue-700">
                  Đã bán: {project.soldUnits.toLocaleString()} / {project.totalUnits.toLocaleString()} căn
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Mở bán: {project.launchDate || 'Đang cập nhật'} • Bàn giao: {project.handoverDate || 'Đang cập nhật'}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm sm:col-span-2 lg:col-span-1 bg-slate-50/70 border">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-600" /> Hiệu Suất Bán Hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                  <span className="font-black text-2xl text-slate-900">
                    {Math.round((project.soldUnits / project.totalUnits) * 100)}%
                  </span>
                  <span className="text-xs text-muted-foreground mb-1">Tỷ lệ lấp đầy rổ hàng</span>
                </div>
                <Progress value={(project.soldUnits / project.totalUnits) * 100} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Master Amenities Grid (Hệ Sinh Thái Tiện Ích) */}
          <Card className="shadow-sm">
            <CardHeader className="border-b bg-slate-50/50 pb-3">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Trees className="h-5 w-5 text-emerald-600" />
                Hệ Sinh Thái Tiện Ích Đẳng Cấp 5 Sao
              </CardTitle>
              <CardDescription>Các tiện ích biểu tượng phục vụ cư dân thượng lưu và khách du lịch quốc tế.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="p-4 rounded-xl border bg-slate-50/80 flex flex-col items-center text-center gap-2 hover:border-indigo-300 transition-colors">
                  <Anchor className="h-7 w-7 text-blue-600" />
                  <span className="font-bold text-xs text-slate-900">Bến Du Thuyền Marina</span>
                  <span className="text-[11px] text-muted-foreground">Tiêu chuẩn quốc tế</span>
                </div>
                <div className="p-4 rounded-xl border bg-slate-50/80 flex flex-col items-center text-center gap-2 hover:border-indigo-300 transition-colors">
                  <Waves className="h-7 w-7 text-cyan-600" />
                  <span className="font-bold text-xs text-slate-900">Hồ Bơi Vô Cực</span>
                  <span className="text-[11px] text-muted-foreground">Tràn bờ view toàn cảnh</span>
                </div>
                <div className="p-4 rounded-xl border bg-slate-50/80 flex flex-col items-center text-center gap-2 hover:border-indigo-300 transition-colors">
                  <Trees className="h-7 w-7 text-emerald-600" />
                  <span className="font-bold text-xs text-slate-900">Công Viên Ven Sông</span>
                  <span className="text-[11px] text-muted-foreground">Quy mô đến 36ha</span>
                </div>
                <div className="p-4 rounded-xl border bg-slate-50/80 flex flex-col items-center text-center gap-2 hover:border-indigo-300 transition-colors">
                  <ShieldCheck className="h-7 w-7 text-indigo-600" />
                  <span className="font-bold text-xs text-slate-900">An Ninh 4 Lớp</span>
                  <span className="text-[11px] text-muted-foreground">Camera AI 24/7</span>
                </div>
                <div className="p-4 rounded-xl border bg-slate-50/80 flex flex-col items-center text-center gap-2 hover:border-indigo-300 transition-colors">
                  <GraduationCap className="h-7 w-7 text-purple-600" />
                  <span className="font-bold text-xs text-slate-900">Trường Liên Cấp</span>
                  <span className="text-[11px] text-muted-foreground">Hệ Cambridge chuẩn</span>
                </div>
                <div className="p-4 rounded-xl border bg-slate-50/80 flex flex-col items-center text-center gap-2 hover:border-indigo-300 transition-colors">
                  <HeartPulse className="h-7 w-7 text-rose-600" />
                  <span className="font-bold text-xs text-slate-900">Bệnh Viện Quốc Tế</span>
                  <span className="text-[11px] text-muted-foreground">Hợp tác Vinmec / FV</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* ================= TAB 2: BẢNG HÀNG DỰ ÁN ================= */}
        <TabsContent value="inventory" className="space-y-4 mt-4 outline-none">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Bảng Hàng Khả Dụng Thuộc Dự Án: {project.name}
                </CardTitle>
                <CardDescription>
                  Tổng hợp {projectUnits.length} căn hộ & biệt thự mẫu của dự án này đang kết nối trực tiếp trong rổ hàng CRM.
                </CardDescription>
              </div>
              <Link href={`/inventory?project=${project.id}`}>
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  Mở Rổ Hàng Trực Quan (Live Matrix)
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {projectUnits.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Hiện chưa có căn hộ nào của dự án này được đưa vào rổ hàng mẫu.
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="w-[120px]">Mã Căn</TableHead>
                        <TableHead>Tòa / Phân Khu</TableHead>
                        <TableHead>Loại BĐS</TableHead>
                        <TableHead>Diện Tích</TableHead>
                        <TableHead>Bố Trí Phòng</TableHead>
                        <TableHead>Hướng & View</TableHead>
                        <TableHead>Giá Niêm Yết</TableHead>
                        <TableHead>Trạng Thái</TableHead>
                        <TableHead className="text-right">Hành Động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectUnits.map(unit => (
                        <TableRow key={unit.id} className="hover:bg-slate-50/80">
                          <TableCell className="font-extrabold text-indigo-600">
                            {unit.code}
                          </TableCell>
                          <TableCell className="text-xs">
                            <span className="font-medium text-slate-800">{unit.tower}</span>
                            <div className="text-muted-foreground">Tầng {unit.floor}</div>
                          </TableCell>
                          <TableCell className="text-xs font-medium">{unit.type}</TableCell>
                          <TableCell className="text-xs font-semibold">{unit.area} m²</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {unit.bedrooms} PN • {unit.bathrooms} WC
                          </TableCell>
                          <TableCell className="text-xs">
                            <div>{unit.direction || '—'}</div>
                            <div className="text-muted-foreground truncate max-w-[130px]">{unit.view || '—'}</div>
                          </TableCell>
                          <TableCell className="font-bold text-xs text-slate-900">
                            {formatCurrency(unit.price)}
                          </TableCell>
                          <TableCell>{getStatusBadge(unit.status)}</TableCell>
                          <TableCell className="text-right">
                            <Link href={`/inventory?project=${project.id}`}>
                              <Button size="sm" variant="outline" className="h-7 text-xs font-semibold">
                                Giữ Chỗ / Chi Tiết
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= TAB 3: SA BÀN & MEDIA ================= */}
        <TabsContent value="media" className="space-y-4 mt-4 outline-none">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="flex flex-col items-center justify-center p-5 gap-2 cursor-pointer hover:bg-slate-50 transition-colors border-dashed" onClick={() => handleDownloadSalesKit("Bộ ảnh chụp thực tế dự án (150 Ảnh HD)")}>
              <ImageIcon className="h-7 w-7 text-blue-500" />
              <span className="font-semibold text-xs text-center">Bộ Ảnh HD (150)</span>
            </Card>

            <Card className="flex flex-col items-center justify-center p-5 gap-2 cursor-pointer hover:bg-slate-50 transition-colors border-dashed" onClick={() => handleDownloadSalesKit("Video 4K giới thiệu dự án")}>
              <Video className="h-7 w-7 text-rose-500" />
              <span className="font-semibold text-xs text-center">Video TVC 4K</span>
            </Card>

            <Card className="flex flex-col items-center justify-center p-5 gap-2 cursor-pointer hover:bg-slate-50 transition-colors border-dashed bg-blue-50/50" onClick={() => setToastMsg("Đang kích hoạt chế độ xem Flycam toàn cảnh...")}>
              <Plane className="h-7 w-7 text-blue-600" />
              <span className="font-semibold text-xs text-center text-blue-700">Flycam 360°</span>
            </Card>

            <Link href="/panorama" className="block">
              <Card className="flex flex-col items-center justify-center p-5 gap-2 cursor-pointer hover:bg-purple-50 transition-colors border-dashed bg-purple-50/50 h-full">
                <Glasses className="h-7 w-7 text-purple-600" />
                <span className="font-semibold text-xs text-center text-purple-700">Tour Căn Hộ VR 360</span>
              </Card>
            </Link>

            <Card className="flex flex-col items-center justify-center p-5 gap-2 cursor-pointer hover:bg-slate-50 transition-colors border-dashed" onClick={() => setToastMsg("Đang tải sa bàn 3D tòa nhà...")}>
              <Box className="h-7 w-7 text-amber-500" />
              <span className="font-semibold text-xs text-center">Sa Bàn 3D</span>
            </Card>

            <Card className="flex flex-col items-center justify-center p-5 gap-2 cursor-pointer hover:bg-slate-50 transition-colors border-dashed" onClick={() => setToastMsg("Đang chuẩn bị clip TVC quảng cáo...")}>
              <MonitorPlay className="h-7 w-7 text-emerald-500" />
              <span className="font-semibold text-xs text-center">TVC Quảng Cáo</span>
            </Card>
          </div>
          
          <Card className="overflow-hidden border shadow-sm bg-slate-950 text-white">
            <div className="h-[420px] flex items-center justify-center flex-col gap-4 text-center p-6 relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <Plane className="h-16 w-16 text-indigo-400 animate-pulse" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-1">Trình Xem Sa Bàn Số 360° & Tour Căn Hộ Ảo</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Khám phá toàn bộ khuôn viên đại dự án {project.name}, góc nhìn trực diện từ trên cao và thiết kế nội thất căn hộ mẫu.
                </p>
              </div>
              <div className="flex gap-2 relative z-10 mt-2">
                <Link href="/panorama">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                    <Glasses className="h-4 w-4 mr-2" /> Mở Tour VR 360 Căn Hộ Mẫu
                  </Button>
                </Link>
                <Button variant="outline" className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700" onClick={() => setToastMsg("Đang hiển thị sa bàn số toàn màn hình...")}>
                  Xem Sa Bàn Toàn Màn Hình
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ================= TAB 4: MẶT BẰNG ================= */}
        <TabsContent value="layout" className="space-y-4 mt-4 outline-none">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="flex flex-col items-center justify-center p-3.5 gap-1.5 cursor-pointer hover:border-indigo-600 border-indigo-200 bg-indigo-50/30 transition-colors">
              <Map className="h-5 w-5 text-indigo-600" />
              <span className="font-semibold text-xs">Mặt Bằng Tổng Thể (Masterplan)</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-3.5 gap-1.5 cursor-pointer hover:border-primary transition-colors">
              <LayoutDashboard className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-xs">Sơ Đồ Tiện Ích (Siteplan)</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-3.5 gap-1.5 cursor-pointer hover:border-primary transition-colors">
              <Grip className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-xs">Phân Khu & Tháp</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-3.5 gap-1.5 cursor-pointer hover:border-primary transition-colors">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-xs">Mặt Bằng Tầng Điển Hình</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-3.5 gap-1.5 cursor-pointer hover:border-primary transition-colors">
              <Component className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium text-xs">Thiết Kế Căn Hộ</span>
            </Card>
          </div>

          <Card className="p-4 border shadow-sm bg-white">
            <InteractiveFloorPlan />
          </Card>
        </TabsContent>

        {/* ================= TAB 5: SALES KIT ================= */}
        <TabsContent value="saleskit" className="space-y-4 mt-4 outline-none">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm hover:border-indigo-200 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" /> Brochure Giới Thiệu Dự Án
                </CardTitle>
                <CardDescription>Bản catalogue giới thiệu phối cảnh, tiện ích và vị trí chiến lược.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-2 border-t">
                <span className="text-xs text-muted-foreground font-medium">PDF • 18 MB</span>
                <Button size="sm" variant="secondary" onClick={() => handleDownloadSalesKit(`Brochure_${project.name}.pdf`)}>
                  <Download className="h-3.5 w-3.5 mr-1.5"/> Tải về
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:border-indigo-200 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-emerald-500" /> CSBH & Gói Vay Ngân Hàng
                </CardTitle>
                <CardDescription>Bảng phân bổ tiến độ thanh toán và gói ưu đãi lãi suất 0%.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-2 border-t">
                <span className="text-xs text-muted-foreground font-medium">PDF • 2.5 MB</span>
                <Button size="sm" variant="secondary" onClick={() => handleDownloadSalesKit(`Chinh_Sach_Ban_Hang_${project.name}.pdf`)}>
                  <Download className="h-3.5 w-3.5 mr-1.5"/> Tải về
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:border-indigo-200 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="h-5 w-5 text-amber-500" /> Bộ Hồ Sơ Pháp Lý Dự Án
                </CardTitle>
                <CardDescription>Phê duyệt 1/500, Giấy phép xây dựng và chấp thuận mở bán.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-2 border-t">
                <span className="text-xs text-muted-foreground font-medium">Zip • 45 MB</span>
                <Button size="sm" variant="secondary" onClick={() => handleDownloadSalesKit(`Phap_Ly_${project.name}.zip`)}>
                  <Download className="h-3.5 w-3.5 mr-1.5"/> Tải về
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:border-indigo-200 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-500" /> Cẩm Nang Q&A Cho Sale
                </CardTitle>
                <CardDescription>50 câu hỏi phản bác khách hàng thường gặp và phương án trả lời.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-2 border-t">
                <span className="text-xs text-muted-foreground font-medium">Word • 1.2 MB</span>
                <Button size="sm" variant="secondary" onClick={() => handleDownloadSalesKit(`QA_Handbook_${project.name}.docx`)}>
                  <Download className="h-3.5 w-3.5 mr-1.5"/> Tải về
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:border-indigo-200 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-rose-500" /> Hợp Đồng Mua Bán Mẫu
                </CardTitle>
                <CardDescription>Mẫu HĐMB chuẩn bộ xây dựng đã được pháp chế duyệt.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center pt-2 border-t">
                <span className="text-xs text-muted-foreground font-medium">PDF • 5.1 MB</span>
                <Button size="sm" variant="secondary" onClick={() => handleDownloadSalesKit(`HDMB_Mau_${project.name}.pdf`)}>
                  <Download className="h-3.5 w-3.5 mr-1.5"/> Tải về
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ================= TAB 6: AI INVESTMENT ================= */}
        <TabsContent value="ai-investment" className="space-y-4 mt-4 outline-none">
          <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-purple-950 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2">
                <Sparkles className="h-7 w-7 text-amber-400" /> AI Đánh Giá Khả Thi Đầu Tư
              </h2>
              <p className="text-indigo-200 text-sm mt-2 max-w-xl">
                Báo cáo tự động tổng hợp từ dữ liệu biến động giá thứ cấp, quy hoạch hạ tầng và mô hình dòng tiền độc quyền cho <strong>{project.name}</strong>.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center flex-shrink-0 min-w-[220px]">
              <div className="text-xs text-indigo-200 uppercase tracking-wider font-semibold mb-1">Xếp Hạng Khuyến Nghị</div>
              <div className={`text-3xl font-black drop-shadow-md ${aiData.rating === 'STRONG BUY' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {aiData.rating}
              </div>
              <div className="text-xs font-bold mt-1 text-amber-300">Độ tin cậy: {aiData.confidence}/100</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Payback */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" /> Thời Gian Thu Hồi Vốn (Payback Period)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-blue-600 mb-1">{aiData.paybackPeriod}</div>
                <p className="text-xs text-muted-foreground mb-3">Ước tính dựa trên giá trị BĐS và dòng tiền cho thuê kỳ vọng hàng năm.</p>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="flex justify-between text-[11px] mt-1.5 font-medium text-muted-foreground">
                  <span>Giai đoạn vào cọc</span>
                  <span>Nhận bàn giao</span>
                  <span>Hoàn vốn</span>
                </div>
              </CardContent>
            </Card>

            {/* Capital Gain */}
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" /> Tỷ Suất Tăng Giá Kỳ Vọng (Capital Gain)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-emerald-600 mb-1">{aiData.capitalGain}</div>
                <p className="text-xs text-muted-foreground">Động lực tăng trưởng chính (Key Catalysts):</p>
                <ul className="mt-2.5 space-y-1.5 text-xs text-slate-700 font-medium">
                  {aiData.keyDrivers.map((driver, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price Comparison */}
            <Card className="md:col-span-1 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="h-5 w-5 text-amber-500" /> Định Giá So Với Khu Vực
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3.5 mt-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800">Dự án này</span>
                      <span className="font-extrabold text-indigo-600">~ {Math.round(aiData.marketAverage * 0.92)} Tr/m²</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Trung bình khu vực</span>
                      <span className="font-bold text-slate-600">{aiData.marketAverage} Tr/m²</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-slate-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <p className="text-xs text-emerald-600 font-semibold pt-1">
                    ✓ Thấp hơn mặt bằng chung 8%. Dư địa tăng giá rất tốt khi bàn giao.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Macro Forecast */}
            <Card className="md:col-span-2 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <LineChartIcon className="h-5 w-5 text-purple-600" /> Phân Tích Chu Kỳ Vĩ Mô
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-purple-50/60 p-4 rounded-xl border border-purple-100">
                  <p className="text-xs leading-relaxed text-slate-800">
                    {aiData.macroForecast}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Warning */}
          <div className="border border-rose-200 bg-rose-50/40 rounded-2xl p-5 mt-2">
            <h3 className="text-rose-700 font-bold flex items-center gap-2 text-base mb-3">
              <AlertTriangle className="h-5 w-5" /> Đánh Giá Rủi Ro & Khuyến Nghị (Risk Management)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiData.risks.map((risk, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl shadow-sm border border-rose-100">
                  <h4 className="font-bold text-xs text-slate-900">{idx + 1}. {risk.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{risk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
