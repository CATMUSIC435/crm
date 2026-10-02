"use client"

import React, { useState, useMemo } from 'react'
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  ComposedChart, Line
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { 
  Building2, BadgeDollarSign, Wallet, FileText, Package, Megaphone, 
  BrainCircuit, ArrowUpRight, ArrowDownRight, Sparkles, ShieldCheck, 
  TrendingUp, Download, Check, AlertTriangle, Layers, FileSpreadsheet, 
  Activity, BarChart3, Compass, Scale, CheckCircle2, ChevronRight, 
  Eye, Award, Landmark, Clock, ExternalLink, PenTool, Lock
} from "lucide-react"
import { useStore } from '@/store/useStore'
import { Project } from '@/types'
import Link from 'next/link'

// Corporate scope configurations
interface ScopeData {
  id: string
  name: string
  subtitle: string
  gdv: number // Tỷ VNĐ
  realizedRevenue: number // Tỷ VNĐ
  projectedCashFlow: number // Tỷ VNĐ
  absorptionRate: number // %
  grossMargin: number // %
  activeProjectsCount: number
}

const CORPORATE_SCOPES: Record<string, ScopeData> = {
  'scope-group': {
    id: 'scope-group',
    name: 'Toàn Tập Đoàn (Novaland Group - 5 Đại Dự Án)',
    subtitle: 'Hội đồng Quản trị & Ban Tổng Giám Đốc điều hành tập trung',
    gdv: 102000,
    realizedRevenue: 52300,
    projectedCashFlow: 8450,
    absorptionRate: 74.8,
    grossMargin: 28.6,
    activeProjectsCount: 5
  },
  'scope-satellite': {
    id: 'scope-satellite',
    name: 'Khối Đô Thị Vệ Tinh (Aqua City & NovaWorld Phan Thiet)',
    subtitle: 'Đại đô thị sinh thái ven sông & tổ hợp du lịch nghỉ dưỡng biển',
    gdv: 55000,
    realizedRevenue: 28500,
    projectedCashFlow: 4600,
    absorptionRate: 71.5,
    grossMargin: 30.2,
    activeProjectsCount: 2
  },
  'scope-urban': {
    id: 'scope-urban',
    name: 'Khối Bất Động Sản Trung Tâm (Grand Manhattan & The Global City)',
    subtitle: 'Quỹ đất vàng Quận 1 & Trung tâm thương mại quốc tế mới',
    gdv: 47000,
    realizedRevenue: 23800,
    projectedCashFlow: 3850,
    absorptionRate: 78.4,
    grossMargin: 26.8,
    activeProjectsCount: 2
  }
}

// 8-Month Cashflow & Inflow/Outflow/Net Trend
const CASHFLOW_PROJECTION_DATA = [
  { month: 'T1/26', inflow: 1450, outflow: 980, net: 470, type: 'actual' },
  { month: 'T2/26', inflow: 1680, outflow: 1050, net: 630, type: 'actual' },
  { month: 'T3/26', inflow: 1820, outflow: 1120, net: 700, type: 'actual' },
  { month: 'T4/26', inflow: 2150, outflow: 1350, net: 800, type: 'actual' },
  { month: 'T5/26', inflow: 2480, outflow: 1480, net: 1000, type: 'actual' },
  { month: 'T6/26', inflow: 2750, outflow: 1620, net: 1130, type: 'actual' },
  { month: 'T7/26 (HT)', inflow: 3100, outflow: 1800, net: 1300, type: 'actual' },
  { month: 'T8/26 (DB)', inflow: 3450, outflow: 1950, net: 1500, type: 'forecast' },
  { month: 'T9/26 (DB)', inflow: 3900, outflow: 2100, net: 1800, type: 'forecast' },
  { month: 'T10/26 (DB)', inflow: 4500, outflow: 2350, net: 2150, type: 'forecast' },
]

// Product Segment Distribution
const SEGMENT_CONTRIBUTION = [
  { name: 'Biệt Thự Nghỉ Dưỡng & Ven Sông', value: 42, color: '#0ea5e9', amount: '21,966 Tỷ' },
  { name: 'Nhà Phố Thương Mại (Shophouse)', value: 31, color: '#6366f1', amount: '16,213 Tỷ' },
  { name: 'Căn Hộ Hạng Sang & Penthouse', value: 27, color: '#f59e0b', amount: '14,121 Tỷ' },
]

// Board Directives & Resolutions
interface BoardResolution {
  id: string
  code: string
  title: string
  date: string
  category: 'Chính sách giá' | 'Mở bán mới' | 'Bảo lãnh tín dụng' | 'Thâu tóm M&A'
  status: 'Đã ban hành' | 'Chờ ký số' | 'Hiệu lực toàn sàn'
  signer: string
  summary: string
}

const BOARD_RESOLUTIONS_DATA: BoardResolution[] = [
  {
    id: 'res-1',
    code: 'NQ-BOD-2026-08',
    title: 'Phê duyệt mở bán 250 căn Shophouse phân khu Soho (The Global City đợt 2)',
    date: '01/07/2026',
    category: 'Mở bán mới',
    status: 'Hiệu lực toàn sàn',
    signer: 'Bùi Thành Nhơn (Chủ tịch HĐQT)',
    summary: 'Chấp thuận mở bán đợt 2 với giá trần 38 Tỷ/căn, chính sách chiết khấu thanh toán sớm 10% và hỗ trợ lãi suất 0% trong 24 tháng qua Techcombank.'
  },
  {
    id: 'res-2',
    code: 'NQ-BOD-2026-07',
    title: 'Hợp tác bảo lãnh tài trợ tín dụng 5,000 Tỷ VNĐ cùng Ngân hàng TMCP Quân Đội (MBBank)',
    date: '24/06/2026',
    category: 'Bảo lãnh tín dụng',
    status: 'Đã ban hành',
    signer: 'Nguyễn Ngọc Huyên (Tổng Giám Đốc)',
    summary: 'Ký kết hợp đồng tín dụng tài trợ gói vay mua nhà The Grand Manhattan Quận 1, ân hạn nợ gốc 24 tháng và tỷ lệ tài trợ tối đa 75% giá trị HĐMB.'
  },
  {
    id: 'res-3',
    code: 'NQ-BOD-2026-06',
    title: 'Quy chế phân quyền phê duyệt chiết khấu ngoại giao cho Giám đốc Sàn (+1% - 3%)',
    date: '15/06/2026',
    category: 'Chính sách giá',
    status: 'Hiệu lực toàn sàn',
    signer: 'Bùi Thành Nhơn (Chủ tịch HĐQT)',
    summary: 'Ủy quyền cho Giám đốc Sàn quyết định chiết khấu ngoại giao tối đa +1.5% đối với giỏ hàng biệt thự và +1.0% đối với căn hộ khi khách hàng thanh toán đúng hạn.'
  },
  {
    id: 'res-4',
    code: 'NQ-BOD-2026-05',
    title: 'Nghị quyết thành lập Trung tâm Giao dịch Quốc tế tại Novaland Gallery 65 Nguyễn Du',
    date: '02/06/2026',
    category: 'Thâu tóm M&A',
    status: 'Đã ban hành',
    signer: 'Nguyễn Ngọc Huyên (Tổng Giám Đốc)',
    summary: 'Đầu tư hoàn thiện sa bàn tương tác thực tế ảo 3D và không gian tiếp đón khách VIP phục vụ nhà đầu tư nước ngoài (Hàn Quốc, Singapore, Đài Loan).'
  }
]

export default function DirectorDashboard() {
  const { contracts, inventory, projects, bookingTickets } = useStore()

  // Scope & period state
  const [selectedScopeId, setSelectedScopeId] = useState<string>('scope-group')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('ytd')

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Modals state
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false)
  const [launchProject, setLaunchProject] = useState('p5')
  const [launchPhaseName, setLaunchPhaseName] = useState('Phân khu Soho Giai Đoạn 2')
  const [launchUnitsCount, setLaunchUnitsCount] = useState('250')
  const [launchPriceRange, setLaunchPriceRange] = useState('32 - 45 Tỷ VNĐ')
  const [launchBank, setLaunchBank] = useState('Techcombank')

  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [pricingProject, setPricingProject] = useState('p2')
  const [pricingAdjustment, setPricingAdjustment] = useState('+5%')
  const [pricingMaxDiscount, setPricingMaxDiscount] = useState('3.0%')
  const [pricingGraceMonths, setPricingGraceMonths] = useState('24')

  const [selectedProjectForBriefing, setSelectedProjectForBriefing] = useState<Project | null>(null)
  const [isSignResolutionModalOpen, setIsSignResolutionModalOpen] = useState(false)
  const [resolutionToSign, setResolutionToSign] = useState<BoardResolution | null>(null)
  const [digitalOtp, setDigitalOtp] = useState('')

  // Active corporate scope
  const currentScope = CORPORATE_SCOPES[selectedScopeId] || CORPORATE_SCOPES['scope-group']

  // Dynamically calculate project metrics
  const projectsData = useMemo(() => {
    return projects.map((p) => {
      const sold = p.soldUnits || 0
      const total = p.totalUnits || 1
      const rate = ((sold / total) * 100).toFixed(1)
      const revenueBillions = Math.round(p.revenue / 1000000000)
      const targetBillions = Math.round((p.targetRevenue || p.revenue * 1.2) / 1000000000)
      const remainingUnits = total - sold

      let legalStatus = 'Đã có GPXD & Đang hoàn thiện HĐMB'
      let irr = '18.5%'
      if (p.id === 'p1') {
        legalStatus = 'Quy hoạch 1/500 & Sổ hồng từng căn'
        irr = '21.4%'
      } else if (p.id === 'p2') {
        legalStatus = 'Đã bàn giao giai đoạn 1, cấp sổ đỏ'
        irr = '19.8%'
      } else if (p.id === 'p3') {
        legalStatus = 'Hoàn thành phần móng, chuẩn bị cất nóc'
        irr = '24.2%'
      } else if (p.id === 'p4') {
        legalStatus = 'Đã có sổ hồng vĩnh viễn'
        irr = '16.5%'
      } else if (p.id === 'p5') {
        legalStatus = 'Phê duyệt 1/500 Foster+Partners'
        irr = '26.8%'
      }

      return {
        ...p,
        sold,
        total,
        rate: Number(rate),
        revenueBillions,
        targetBillions,
        remainingUnits,
        legalStatus,
        irr
      }
    })
  }, [projects])

  // Handlers
  const handleConfirmLaunch = () => {
    setIsLaunchModalOpen(false)
    showToast(`Nghị quyết HĐQT mở bán ${launchPhaseName} (${launchUnitsCount} căn) đã ban hành thành công!`)
  }

  const handleConfirmPricingAdjustment = () => {
    const proj = projects.find(p => p.id === pricingProject)
    setIsPricingModalOpen(false)
    showToast(`Đã ban hành quyết định điều chỉnh giá ${pricingAdjustment} và hạn mức chiết khấu ${pricingMaxDiscount} cho ${proj?.name || 'dự án'}!`)
  }

  const handleSignResolution = () => {
    if (!digitalOtp || digitalOtp.length < 4) {
      showToast('Vui lòng nhập mã xác thực OTP ký số gồm 6 chữ số!')
      return
    }
    setIsSignResolutionModalOpen(false)
    setDigitalOtp('')
    showToast(`Đã ký số điện tử thành công nghị quyết ${resolutionToSign?.code}! Văn bản có hiệu lực ngay lập tức.`)
    setResolutionToSign(null)
  }

  const handleExportBoardCSV = () => {
    const headers = ['Mã Dự Án,Tên Dự Án,Vị Trí,Phân Khúc,Tổng Căn,Đã Bán,Tỷ Lệ Hấp Thụ (%),Doanh Thu Lũy Kế (Tỷ VNĐ),Căn Tồn Kho,Tỷ Suất IRR,Tình Trạng Pháp Lý']
    const rows = projectsData.map(p => 
      `"${p.id}","${p.name}","${p.location}","${p.type}",${p.total},${p.sold},${p.rate}%,${p.revenueBillions},${p.remainingUnits},"${p.irr}","${p.legalStatus}"`
    )
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Bao_Cao_BOD_Tai_Chinh_Danh_Muc_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất Báo Cáo Tài Chính Danh Mục HĐQT (.CSV) thành công!')
  }

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2 pb-16">
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION WITH CORPORATE SCOPE SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-6 rounded-2xl shadow-2xl border border-purple-900/40">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1 font-semibold text-xs tracking-wider uppercase">
              <Landmark className="h-3.5 w-3.5 mr-1 text-purple-400 inline" /> Ban Tổng Giám Đốc & HĐQT
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-700 bg-slate-800/40 text-xs">
              <Building2 className="h-3 w-3 mr-1 inline text-blue-400" /> {currentScope.activeProjectsCount} Đại dự án trọng điểm
            </Badge>
            <Badge variant="outline" className="text-emerald-300 border-emerald-500/30 bg-emerald-500/10 text-xs">
              <ShieldCheck className="h-3 w-3 mr-1 inline text-emerald-400" /> Xếp Hạng Tín Nhiệm: AAA
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Trung Tâm Chỉ Huy Chiến Lược C-Level & Ban Lãnh Đạo
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl">
            {currentScope.name} • {currentScope.subtitle} • Chu kỳ kiểm soát tài chính tập trung.
          </p>
        </div>

        {/* CONTROLS & STRATEGIC BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Corporate Scope Switcher */}
          <div className="w-[260px]">
            <Select 
              value={selectedScopeId} 
              onValueChange={(val) => setSelectedScopeId(val || 'scope-group')}
            >
              <SelectTrigger className="bg-slate-900/90 border-purple-800/60 text-white text-xs h-9 font-medium">
                <Compass className="h-3.5 w-3.5 mr-1.5 text-purple-400 shrink-0" />
                <SelectValue placeholder="Chọn Khối Quản Lý" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="scope-group">Toàn Tập Đoàn (5 Đại Dự Án)</SelectItem>
                <SelectItem value="scope-satellite">Khối Đô Thị Vệ Tinh (Đồng Nai & Bình Thuận)</SelectItem>
                <SelectItem value="scope-urban">Khối BĐS Trung Tâm (Q1 & Thủ Đức)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Switcher */}
          <div className="w-[140px]">
            <Select 
              value={selectedPeriod} 
              onValueChange={(val) => setSelectedPeriod(val || 'ytd')}
            >
              <SelectTrigger className="bg-slate-900/90 border-slate-700 text-white text-xs h-9 font-medium">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-400 shrink-0" />
                <SelectValue placeholder="Chọn chu kỳ" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="ytd">Năm 2026 (YTD)</SelectItem>
                <SelectItem value="q3">Quý 3/2026</SelectItem>
                <SelectItem value="target27">Kế Hoạch 2027</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Strategic Action Modals */}
          <Button 
            onClick={() => setIsLaunchModalOpen(true)}
            size="sm" 
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold h-9 shadow-md"
          >
            <Megaphone className="h-3.5 w-3.5 mr-1.5" /> Nghị Quyết Mở Bán
          </Button>

          <Button 
            onClick={() => setIsPricingModalOpen(true)}
            size="sm" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-9 shadow-md"
          >
            <Scale className="h-3.5 w-3.5 mr-1.5" /> Khung Giá & CK
          </Button>

          <Button 
            onClick={handleExportBoardCSV}
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs h-9"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Báo Cáo BOD
          </Button>
        </div>
      </div>

      {/* 5 C-LEVEL STRATEGIC FINANCIAL KPI CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1: Gross Development Value (GDV) */}
        <Card className="shadow-sm border-purple-200/80 bg-gradient-to-br from-purple-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-purple-950 uppercase tracking-wider">
              Tổng GDV Danh Mục
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Landmark className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {currentScope.gdv.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-600">Tỷ ₫</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Quy mô quỹ đất:</span>
                <span className="font-bold text-purple-800">1,850 ha</span>
              </div>
              <Progress value={85} className="h-2 bg-purple-100" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              <ArrowUpRight className="h-3 w-3 mr-0.5 text-emerald-600 shrink-0" />
              Tài sản bảo đảm an toàn nợ trái phiếu
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Realized Revenue */}
        <Card className="shadow-sm border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-blue-950 uppercase tracking-wider">
              Doanh Thu Đã Thu Lũy Kế
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <BadgeDollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {currentScope.realizedRevenue.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-600">Tỷ ₫</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Tỷ lệ hiện thực hóa GDV:</span>
                <span className="font-bold text-blue-800">
                  {((currentScope.realizedRevenue / currentScope.gdv) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={(currentScope.realizedRevenue / currentScope.gdv) * 100} 
                className="h-2 bg-blue-100" 
              />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              <ArrowUpRight className="h-3 w-3 mr-0.5 text-emerald-600 shrink-0" />
              +24.5% so với cùng kỳ năm 2025
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Projected Cash Flow Q4 */}
        <Card className="shadow-sm border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Dòng Tiền Thu Quý Tới
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-emerald-700">
              +{currentScope.projectedCashFlow.toLocaleString('vi-VN')} <span className="text-sm font-normal text-slate-600">Tỷ ₫</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hạn mức giải ngân bảo lãnh:</span>
                <span className="font-bold text-emerald-800">6,500 Tỷ ₫</span>
              </div>
              <Progress value={78} className="h-2 bg-emerald-100" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              <ShieldCheck className="h-3 w-3 mr-1 text-emerald-600 shrink-0" />
              Hệ số thanh khoản nhanh Quick Ratio: 1.85x
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Portfolio Absorption Rate */}
        <Card className="shadow-sm border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              Tỷ Lệ Hấp Thụ Giỏ Hàng
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {currentScope.absorptionRate}%
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Đã bán thành công:</span>
                <span className="font-bold text-amber-900">64,700 / 86,500 căn</span>
              </div>
              <Progress value={currentScope.absorptionRate} className="h-2 bg-amber-100" />
            </div>
            <p className="text-[11px] text-slate-600 pt-0.5 flex items-center">
              <Clock className="h-3 w-3 mr-1 text-amber-600 inline" />
              Tốc độ hấp thụ bình quân: ~450 căn/tháng
            </p>
          </CardContent>
        </Card>

        {/* KPI 5: Gross Margin & EBITDA */}
        <Card className="shadow-sm border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
              Biên Lợi Nhuận Gộp
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-800">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-indigo-700">
              {currentScope.grossMargin}%
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">EBITDA lũy kế năm:</span>
                <span className="font-bold text-indigo-800">14,800 Tỷ ₫</span>
              </div>
              <Progress value={currentScope.grossMargin * 2.8} className="h-2 bg-indigo-100" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              <ArrowUpRight className="h-3 w-3 mr-0.5 text-emerald-600 shrink-0" />
              Tỷ suất ROE dự kiến đạt 22.4%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS SECTION: CASHFLOW BALANCE & SEGMENT DISTRIBUTION */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* CASHFLOW FORECAST & BALANCE CHART (4 Cols) */}
        <Card className="lg:col-span-4 shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-emerald-600" />
                  Dự Báo Cân Đối Dòng Tiền Thu - Chi & Thặng Dư Thuần
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Dòng tiền thực thu, thực chi thi công xây dựng & dự báo AI 3 tháng tới (Đơn vị: Tỷ VNĐ)
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 self-start sm:self-auto">
                <BrainCircuit className="h-3 w-3 mr-1 inline" /> AI Cashflow v4.2
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={CASHFLOW_PROJECTION_DATA}
                  margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" T" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any, name: any) => [
                      `${Number(value).toLocaleString('vi-VN')} Tỷ VNĐ`,
                      name === 'inflow' ? 'Dòng Tiền Thực Thu' : name === 'outflow' ? 'Chi Phí Thi Công & Vận Hành' : 'Dòng Tiền Thuần (Net)'
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
                    formatter={(val) => val === 'inflow' ? 'Dòng Tiền Thu' : val === 'outflow' ? 'Dòng Tiền Chi' : 'Thặng Dư Thuần (Net Cashflow)'}
                  />
                  <Bar dataKey="inflow" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  <Line type="monotone" dataKey="net" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <span className="text-slate-500 block">Tổng Thu Dự Kiến Quý 3:</span>
                <b className="text-emerald-800 text-sm font-black">+11,450 Tỷ ₫</b>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100">
                <span className="text-slate-500 block">Ngân Sách Giải Ngân Xây Dựng:</span>
                <b className="text-rose-800 text-sm font-black">-6,400 Tỷ ₫</b>
              </div>
              <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100">
                <span className="text-slate-500 block">Thặng Dư Ròng Dự Kiến:</span>
                <b className="text-indigo-800 text-sm font-black">+5,050 Tỷ ₫</b>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* REVENUE STRUCTURE BY SEGMENT PIE (3 Cols) */}
        <Card className="lg:col-span-3 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-purple-600" />
                  Cơ Cấu Doanh Thu Theo Phân Khúc
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Tỷ trọng đóng góp dòng tiền theo loại hình sản phẩm
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs text-purple-700 border-purple-200 bg-purple-50">
                3 Phân Khúc
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-4">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={SEGMENT_CONTRIBUTION} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={55} 
                    outerRadius={80} 
                    paddingAngle={3} 
                    dataKey="value"
                  >
                    {SEGMENT_CONTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                    formatter={(value: any) => [`${value}%`, 'Tỷ trọng đóng góp']} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 pt-2 border-t text-xs">
              {SEGMENT_CONTRIBUTION.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 truncate">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-700 font-medium truncate" title={item.name}>{item.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900">{item.value}%</span>
                    <span className="text-[10px] text-slate-500 ml-1.5 font-mono">({item.amount})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PROJECT PORTFOLIO HEALTH & FINANCIAL OVERVIEW TABLE */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Sức Khỏe Tài Chính & Tỷ Lệ Hấp Thụ 5 Đại Dự Án
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Tổng hợp số lượng sản phẩm, doanh thu tích lũy, tiến độ pháp lý và tỷ suất hoàn vốn nội bộ (IRR)
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={handleExportBoardCSV}
                variant="outline" 
                size="sm" 
                className="text-xs h-8 text-slate-700 border-slate-300 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5 mr-1" /> Xuất File Thẩm Định (.CSV)
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="text-xs font-bold text-slate-700">Dự Án / Chủ Đầu Tư</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700">Phân Khúc / Địa Điểm</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 text-center">Tổng Căn</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 text-center">Đã Bán</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700">Tiến Độ Hấp Thụ</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700">Doanh Thu Lũy Kế</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700">Căn Tồn Kho</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 text-center">Tỷ Suất IRR</TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectsData.map((project) => (
                  <TableRow key={project.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Project Name */}
                    <TableCell>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                          {project.name}
                        </div>
                        <span className="text-xs text-slate-500">CĐT: {project.developer}</span>
                      </div>
                    </TableCell>

                    {/* Type & Location */}
                    <TableCell>
                      <div className="text-xs">
                        <span className="font-medium text-slate-800 block">{project.type}</span>
                        <span className="text-slate-500">{project.location}</span>
                      </div>
                    </TableCell>

                    {/* Total Units */}
                    <TableCell className="text-center font-mono text-xs font-bold text-slate-700">
                      {project.total.toLocaleString('vi-VN')}
                    </TableCell>

                    {/* Sold Units */}
                    <TableCell className="text-center font-mono text-xs font-bold text-emerald-700">
                      {project.sold.toLocaleString('vi-VN')}
                    </TableCell>

                    {/* Absorption Rate */}
                    <TableCell>
                      <div className="space-y-1 w-32">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900">{project.rate}%</span>
                          <span className="text-[10px] text-slate-500">
                            {project.rate >= 80 ? 'Hấp thụ tốt' : 'Đang mở bán'}
                          </span>
                        </div>
                        <Progress 
                          value={project.rate} 
                          className={`h-1.5 ${project.rate >= 80 ? 'bg-emerald-100' : 'bg-slate-100'}`} 
                        />
                      </div>
                    </TableCell>

                    {/* Revenue */}
                    <TableCell>
                      <Badge className="bg-purple-50 text-purple-900 border-purple-200 font-mono font-bold text-xs">
                        {project.revenueBillions.toLocaleString('vi-VN')} Tỷ ₫
                      </Badge>
                    </TableCell>

                    {/* Remaining */}
                    <TableCell className="font-mono text-xs text-amber-800 font-semibold">
                      {project.remainingUnits.toLocaleString('vi-VN')} căn
                    </TableCell>

                    {/* IRR */}
                    <TableCell className="text-center">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs">
                        {project.irr}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          onClick={() => setSelectedProjectForBriefing(project)}
                          size="sm" 
                          variant="ghost" 
                          className="text-xs h-7 text-indigo-700 hover:bg-indigo-50 px-2"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Thẩm Định AI
                        </Button>
                        <Link href={`/projects/${project.id}`}>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-xs h-7 text-slate-700 border-slate-200 hover:bg-slate-100 px-2"
                          >
                            Chi Tiết
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="p-3 bg-slate-50/70 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Dữ liệu tiến độ thi công và bán hàng được đồng bộ tự động từ hệ thống lõi ERP và Nhà thầu chính Hòa Bình / Ricons.</span>
          <Link href="/projects" className="text-purple-700 font-bold hover:underline flex items-center">
            Mở Danh Mục Dự Án Toàn Tập Đoàn <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </Link>
        </CardFooter>
      </Card>

      {/* BOARD RESOLUTIONS & DIRECTIVES WIDGET */}
      <Card className="shadow-md border-purple-200/90 bg-gradient-to-b from-purple-50/20 via-white to-white">
        <CardHeader className="border-b bg-purple-50/40 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-900 text-white font-bold text-xs uppercase px-2 py-0.5">
                  Pháp Lý & Điều Hành
                </Badge>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-purple-700" />
                  Sổ Nghị Quyết & Quyết Định Cấp Chiến Lược Của HĐQT
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-600 mt-1">
                Các nghị quyết mở bán phân khu, phê duyệt bảo lãnh ngân hàng và quy chế trần chiết khấu đã được Ban Lãnh Đạo thông qua.
              </CardDescription>
            </div>

            <Button 
              onClick={() => setIsLaunchModalOpen(true)}
              size="sm" 
              className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold h-8"
            >
              <PenTool className="h-3.5 w-3.5 mr-1.5" /> Ban Hành Quyết Định Mới
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {BOARD_RESOLUTIONS_DATA.map((res) => (
              <div 
                key={res.id} 
                className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-slate-900 text-white font-mono text-xs px-2 py-0.5">
                      {res.code}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs font-semibold">
                      {res.category}
                    </Badge>
                    <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1 inline" /> {res.status}
                    </Badge>
                    <span className="text-slate-400 text-xs">Ngày ký: {res.date}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                    {res.summary}
                  </p>

                  <div className="text-xs text-slate-500 pt-0.5">
                    Người ký ban hành: <b className="text-purple-900 font-semibold">{res.signer}</b>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Button 
                    onClick={() => {
                      setResolutionToSign(res)
                      setIsSignResolutionModalOpen(true)
                    }}
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 text-purple-700 border-purple-200 hover:bg-purple-50"
                  >
                    <Lock className="h-3.5 w-3.5 mr-1" /> Xác Thực Ký Số
                  </Button>
                  <Button 
                    onClick={() => showToast(`Đang mở bản scan PDF có dấu đỏ cho ${res.code}...`)}
                    size="sm" 
                    variant="outline" 
                    className="text-xs h-8 text-slate-700 border-slate-300 hover:bg-slate-100"
                  >
                    <FileText className="h-3.5 w-3.5 mr-1" /> Xem Bản Scan Dấu Đỏ
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-3 bg-slate-50/70 border-t flex items-center justify-between text-xs text-slate-500">
          <span>Mọi văn bản nghị quyết đều được mã hóa chuỗi khối (Blockchain Notarization) đảm bảo tính toàn vẹn pháp lý.</span>
          <span className="font-semibold text-purple-800">Cơ chế chữ ký số bảo mật Token PKI-CA</span>
        </CardFooter>
      </Card>

      {/* MODAL 1: BAN HÀNH NGHỊ QUYẾT MỞ BÁN PHÂN KHU MỚI */}
      <Dialog open={isLaunchModalOpen} onOpenChange={setIsLaunchModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-950 text-lg font-bold">
              <Megaphone className="h-5 w-5 text-purple-600" />
              Nghị Quyết Ban Hành Mở Bán Phân Khu Mới
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Quyết định chính thức của HĐQT về kế hoạch đưa rổ hàng mới ra thị trường và khung chính sách bán hàng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Dự Án Trọng Điểm</label>
              <Select value={launchProject} onValueChange={(val) => setLaunchProject(val || 'p5')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn dự án" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name} ({p.location})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tên Phân Khu Chào Bán</label>
              <Input 
                value={launchPhaseName}
                onChange={(e) => setLaunchPhaseName(e.target.value)}
                className="text-xs h-9 font-semibold"
                placeholder="Ví dụ: Phân khu Đảo Phượng Hoàng Giai Đoạn 3"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Số Lượng Căn Mở Bán</label>
                <Input 
                  type="number"
                  value={launchUnitsCount}
                  onChange={(e) => setLaunchUnitsCount(e.target.value)}
                  className="text-xs h-9"
                  placeholder="250"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khung Giá Dự Kiến</label>
                <Input 
                  value={launchPriceRange}
                  onChange={(e) => setLaunchPriceRange(e.target.value)}
                  className="text-xs h-9"
                  placeholder="32 - 45 Tỷ VNĐ"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Ngân Hàng Tài Trợ Gói Vay Mua Nhà</label>
              <Select value={launchBank} onValueChange={(val) => setLaunchBank(val || 'Techcombank')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn ngân hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Techcombank">Techcombank (Gói vay 70%, ân hạn 24 tháng)</SelectItem>
                  <SelectItem value="MBBank">MBBank (Gói vay 75%, lãi suất 0% 18 tháng)</SelectItem>
                  <SelectItem value="Vietcombank">Vietcombank (Bảo lãnh tiến độ dự án)</SelectItem>
                  <SelectItem value="VietinBank">VietinBank (Gói tài trợ vốn đối ứng)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs text-purple-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-700" /> Xác nhận của Ban Kiểm Soát Pháp Lý:
              </div>
              <p className="text-[11px] text-purple-800">
                Phân khu đã hoàn tất nghiệm thu phần móng và đủ điều kiện ký Thỏa Thuận Ký Quỹ theo Luật Kinh Doanh BĐS hiện hành.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsLaunchModalOpen(false)} className="text-xs">
              Hủy Bỏ
            </Button>
            <Button size="sm" onClick={handleConfirmLaunch} className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold">
              <Check className="h-3.5 w-3.5 mr-1" /> Ký Ban Hành Nghị Quyết Mở Bán
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ĐIỀU CHỈNH KHUNG GIÁ & CHIẾT KHẤU TOÀN SÀN */}
      <Dialog open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-950 text-lg font-bold">
              <Scale className="h-5 w-5 text-indigo-600" />
              Điều Chỉnh Khung Giá & Chính Sách Chiết Khấu Ngoại Giao
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Thiết lập trần chiết khấu phân quyền cho cấp Giám đốc sàn và chính sách hỗ trợ lãi suất ngân hàng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Dự Án Áp Dụng</label>
              <Select value={pricingProject} onValueChange={(val) => setPricingProject(val || 'p2')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn dự án" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Biên Độ Điều Chỉnh Giá</label>
                <Select value={pricingAdjustment} onValueChange={(val) => setPricingAdjustment(val || '+5%')}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Chọn biên độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+3%">Tăng +3% (Giai đoạn cất nóc)</SelectItem>
                    <SelectItem value="+5%">Tăng +5% (Cột mốc hạ tầng)</SelectItem>
                    <SelectItem value="+8%">Tăng +8% (Trước bàn giao)</SelectItem>
                    <SelectItem value="Giữ nguyên">Giữ nguyên giá niêm yết hiện tại</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hạn Mức CK Tối Đa Sàn</label>
                <Select value={pricingMaxDiscount} onValueChange={(val) => setPricingMaxDiscount(val || '3.0%')}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Chọn mức trần" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5%">Tối đa +1.5% (Tiêu chuẩn)</SelectItem>
                    <SelectItem value="3.0%">Tối đa +3.0% (Khách hàng VVIP)</SelectItem>
                    <SelectItem value="5.0%">Tối đa +5.0% (Thanh toán 95% sớm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Thời Gian Ân Hạn Nợ Gốc & Lãi Suất 0%</label>
              <div className="relative">
                <Input 
                  type="number"
                  value={pricingGraceMonths}
                  onChange={(e) => setPricingGraceMonths(e.target.value)}
                  className="text-xs h-9 pr-16 font-bold"
                  placeholder="24"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Tháng</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsPricingModalOpen(false)} className="text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleConfirmPricingAdjustment} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
              <Check className="h-3.5 w-3.5 mr-1" /> Áp Dụng Khung Giá Mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: THẨM ĐỊNH CHI TIẾT AI RATING DỰ ÁN CHO BAN LÃNH ĐẠO */}
      {selectedProjectForBriefing && (
        <Dialog open={!!selectedProjectForBriefing} onOpenChange={(open) => !open && setSelectedProjectForBriefing(null)}>
          <DialogContent className="sm:max-w-[620px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-900 text-white text-xs font-bold">
                  Báo Cáo Thẩm Định HĐQT
                </Badge>
                <DialogTitle className="text-base font-bold text-slate-900">
                  {selectedProjectForBriefing.name}
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-slate-600">
                Phân tích rủi ro kinh tế vĩ mô, khả năng sinh lời và khuyến nghị của Trợ lý AI C-Level.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Primary Stats */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                <div>
                  <span className="text-slate-500 block">Xếp hạng đầu tư:</span>
                  <b className="text-purple-800 text-sm font-black">
                    {selectedProjectForBriefing.aiAnalysis?.rating || 'STRONG BUY'}
                  </b>
                </div>
                <div>
                  <span className="text-slate-500 block">Độ tin cậy mô hình:</span>
                  <b className="text-emerald-700 text-sm font-black">
                    {selectedProjectForBriefing.aiAnalysis?.confidence || 92}%
                  </b>
                </div>
                <div>
                  <span className="text-slate-500 block">Thời gian hoàn vốn:</span>
                  <b className="text-indigo-800 text-sm font-black">
                    {selectedProjectForBriefing.aiAnalysis?.paybackPeriod || '8.5 Năm'}
                  </b>
                </div>
              </div>

              {/* AI Summary */}
              {selectedProjectForBriefing.aiAnalysis?.summary && (
                <div className="p-3 bg-slate-50 rounded-lg border text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 block">Tóm lược vị thế thị trường:</span>
                  <p className="leading-relaxed">{selectedProjectForBriefing.aiAnalysis.summary}</p>
                </div>
              )}

              {/* Key Drivers */}
              {selectedProjectForBriefing.aiAnalysis?.keyDrivers && (
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800 block">Động lực tăng trưởng cốt lõi:</span>
                  <div className="space-y-1">
                    {selectedProjectForBriefing.aiAnalysis.keyDrivers.map((driver, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-700">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{driver}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Macro Forecast */}
              {selectedProjectForBriefing.aiAnalysis?.macroForecast && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950 space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" /> Nhận định chu kỳ vĩ mô:
                  </span>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    {selectedProjectForBriefing.aiAnalysis.macroForecast}
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" size="sm" onClick={() => setSelectedProjectForBriefing(null)} className="text-xs">
                Đóng
              </Button>
              <Link href={`/projects/${selectedProjectForBriefing.id}`}>
                <Button size="sm" className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold">
                  <ExternalLink className="h-3.5 w-3.5 mr-1" /> Mở Chi Tiết Dự Án Đầy Đủ
                </Button>
              </Link>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL 4: XÁC THỰC KÝ SỐ ĐIỆN TỬ NGHỊ QUYẾT BOD */}
      {resolutionToSign && (
        <Dialog open={isSignResolutionModalOpen} onOpenChange={setIsSignResolutionModalOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-purple-950 text-base font-bold">
                <Lock className="h-5 w-5 text-purple-700" />
                Xác Thực Chữ Ký Số C-Level (Digital Signature)
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                Xác nhận phê duyệt văn bản <b>{resolutionToSign.code}</b> với chứng thư số của Tổng Giám Đốc.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="p-3 bg-slate-50 rounded-lg border text-xs space-y-1">
                <div><b>Văn bản:</b> {resolutionToSign.title}</div>
                <div><b>Thẩm quyền ký:</b> {resolutionToSign.signer}</div>
                <div><b>Hệ thống chứng thực:</b> VNPT SmartCA / Viettel-CA</div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Nhập mã PIN xác thực chữ ký số (OTP 6 số):</label>
                <Input 
                  type="password"
                  maxLength={6}
                  value={digitalOtp}
                  onChange={(e) => setDigitalOtp(e.target.value)}
                  className="text-center font-mono text-lg tracking-widest h-10 font-bold"
                  placeholder="••••••"
                />
                <p className="text-[10px] text-slate-500 text-center">Gợi ý kiểm thử: Nhập bất kỳ 6 số (ví dụ: 123456)</p>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" size="sm" onClick={() => setIsSignResolutionModalOpen(false)} className="text-xs">
                Hủy
              </Button>
              <Button size="sm" onClick={handleSignResolution} className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold">
                <PenTool className="h-3.5 w-3.5 mr-1" /> Ký Số & Ban Hành
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
