"use client"
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts'
import { 
  Wallet, TrendingUp, DollarSign, Percent, ArrowUpRight, ArrowDownRight, Briefcase, 
  Building, Landmark, Calendar, ShieldCheck, FileText, CheckCircle2, AlertTriangle, 
  Download, ExternalLink, RefreshCw, X, Plus, Filter, Search, Share2, Layers, 
  QrCode, CreditCard, ChevronRight, Eye, Trash2, Sparkles, Check, Copy, Clock, 
  ArrowRight, FileSpreadsheet, Send, Home, SlidersHorizontal, UserCheck, PieChart as PieChartIcon
} from "lucide-react"
import { useStore } from '@/store/useStore'
import { PortfolioProperty, PortfolioMilestone } from '@/types'

const HISTORICAL_ASSET_GROWTH = [
  { year: '2021', value: 37.5, invested: 37.5 },
  { year: '2022', value: 46.2, invested: 42.0 },
  { year: '2023', value: 68.5, invested: 62.5 },
  { year: '2024', value: 95.0, invested: 84.5 },
  { year: '2025', value: 128.5, invested: 104.5 },
  { year: '2026 (Hiện tại)', value: 159.8, invested: 129.5 },
]

const CASHFLOW_BAR_DATA = [
  { quarter: 'Q1/2025', grossRent: 820, netRent: 738, taxAndOps: 82 },
  { quarter: 'Q2/2025', grossRent: 880, netRent: 792, taxAndOps: 88 },
  { quarter: 'Q3/2025', grossRent: 940, netRent: 846, taxAndOps: 94 },
  { quarter: 'Q4/2025', grossRent: 1020, netRent: 918, taxAndOps: 102 },
  { quarter: 'Q1/2026', grossRent: 1120, netRent: 1008, taxAndOps: 112 },
  { quarter: 'Q2/2026 (Dự kiến)', grossRent: 1250, netRent: 1125, taxAndOps: 125 },
]

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']

export default function PortfolioPage() {
  const customers = useStore(state => state.customers)
  const projects = useStore(state => state.projects)
  const portfolioProperties = useStore(state => state.portfolioProperties)
  const addPortfolioProperty = useStore(state => state.addPortfolioProperty)
  const updatePortfolioProperty = useStore(state => state.updatePortfolioProperty)
  const deletePortfolioProperty = useStore(state => state.deletePortfolioProperty)
  const payPortfolioMilestone = useStore(state => state.payPortfolioMilestone)

  // Filters & States
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'milestones' | 'rebalancing'>('overview')

  // Modals state
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<PortfolioProperty | null>(null)
  const [selectedMilestoneForPayment, setSelectedMilestoneForPayment] = useState<{ property: PortfolioProperty; milestone: PortfolioMilestone } | null>(null)
  const [showExitModal, setShowExitModal] = useState<boolean>(false)
  const [showAddPropertyModal, setShowAddPropertyModal] = useState<boolean>(false)
  const [showWealthReportModal, setShowWealthReportModal] = useState<boolean>(false)

  // Exit Simulator State
  const [exitTargetPropertyId, setExitTargetPropertyId] = useState<string>('')
  const [exitSellingPrice, setExitSellingPrice] = useState<number>(42000000000)

  // New Property Form State
  const [newPropCustomerId, setNewPropCustomerId] = useState<string>(customers[0]?.id || 'c1')
  const [newPropCode, setNewPropCode] = useState<string>('AQC-PH-202')
  const [newPropTitle, setNewPropTitle] = useState<string>('Biệt Thự Đảo Phượng Hoàng Phoenix South')
  const [newPropProject, setNewPropProject] = useState<string>('Aqua City')
  const [newPropType, setNewPropType] = useState<string>('Biệt thự song lập')
  const [newPropArea, setNewPropArea] = useState<number>(180)
  const [newPropBuyPrice, setNewPropBuyPrice] = useState<number>(16500000000)
  const [newPropCurrentVal, setNewPropCurrentVal] = useState<number>(19800000000)
  const [newPropRent, setNewPropRent] = useState<number>(45000000)

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return portfolioProperties.filter(prop => {
      const matchCustomer = selectedCustomerId === 'all' || prop.customerId === selectedCustomerId
      const matchSearch = searchQuery === '' || 
        prop.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCustomer && matchSearch
    })
  }, [portfolioProperties, selectedCustomerId, searchQuery])

  // Macro Portfolio Calculations
  const totalInvestment = useMemo(() => {
    return filteredProperties.reduce((sum, p) => sum + p.buyPrice, 0)
  }, [filteredProperties])

  const totalCurrentValuation = useMemo(() => {
    return filteredProperties.reduce((sum, p) => sum + p.currentValuation, 0)
  }, [filteredProperties])

  const totalCapitalGain = totalCurrentValuation - totalInvestment
  const totalCapitalGainPercent = totalInvestment > 0 ? ((totalCapitalGain / totalInvestment) * 100).toFixed(1) : '0.0'

  const totalAnnualNetRental = useMemo(() => {
    return filteredProperties.reduce((sum, p) => sum + (p.annualNetRental || 0), 0)
  }, [filteredProperties])

  const weightedRentalYield = totalInvestment > 0 ? ((totalAnnualNetRental / totalInvestment) * 100).toFixed(2) : '0.0'
  const overallPortfolioIRR = (Number(totalCapitalGainPercent) / 3 + Number(weightedRentalYield)).toFixed(1)

  // Asset allocation pie data
  const assetAllocationData = useMemo(() => {
    const map = new Map<string, number>()
    filteredProperties.forEach(p => {
      const current = map.get(p.propertyType) || 0
      map.set(p.propertyType, current + p.currentValuation)
    })
    return Array.from(map.entries()).map(([name, val]) => ({
      name,
      value: Math.round(val / 1e9 * 10) / 10
    }))
  }, [filteredProperties])

  // Upcoming Milestones List
  const upcomingMilestones = useMemo(() => {
    const list: { property: PortfolioProperty; milestone: PortfolioMilestone }[] = []
    filteredProperties.forEach(p => {
      if (p.nextMilestone) {
        list.push({ property: p, milestone: p.nextMilestone })
      }
    })
    return list
  }, [filteredProperties])

  // Format currency
  const formatVND = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)} Tỷ VNĐ`
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)} Triệu VNĐ`
    return `${Math.round(value).toLocaleString('vi-VN')} VNĐ`
  }

  // Pre-fill exit simulation target
  const activeExitProperty = useMemo(() => {
    if (!exitTargetPropertyId && filteredProperties.length > 0) {
      return filteredProperties[0]
    }
    return filteredProperties.find(p => p.id === exitTargetPropertyId) || filteredProperties[0]
  }, [exitTargetPropertyId, filteredProperties])

  // Calculations for Exit Simulation
  const exitAnalysis = useMemo(() => {
    if (!activeExitProperty) return null
    const originalBuy = activeExitProperty.buyPrice
    const sellPrice = exitSellingPrice
    const grossCapitalGain = sellPrice - originalBuy
    const pitTax2Pct = sellPrice * 0.02 // 2% PIT
    const brokerageFee1_5Pct = sellPrice * 0.015 // 1.5% commission
    const notaryAndAdmin = 15000000 // 15Tr
    const totalExitCosts = pitTax2Pct + brokerageFee1_5Pct + notaryAndAdmin
    const netProfit = grossCapitalGain - totalExitCosts
    const netROI = originalBuy > 0 ? ((netProfit / originalBuy) * 100).toFixed(1) : '0'

    return {
      originalBuy,
      sellPrice,
      grossCapitalGain,
      pitTax2Pct,
      brokerageFee1_5Pct,
      totalExitCosts,
      netProfit,
      netROI
    }
  }, [activeExitProperty, exitSellingPrice])

  // UTF-8 BOM CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Mã Căn',
      'Tên Bất Động Sản',
      'Dự Án',
      'Chủ Sở Hữu VIP',
      'Số Điện Thoại',
      'Loại Hình',
      'Diện Tích (m2)',
      'Giá Mua Vào (VNĐ)',
      'Định Giá Hiện Tại (VNĐ)',
      'Lãi Vốn Tạm Tính (VNĐ)',
      'Tiền Thuê Tháng (VNĐ)',
      'Doanh Thu Thuê Ròng/Năm (VNĐ)',
      'Tiến Độ Thi Công (%)',
      'Tình Trạng Pháp Lý',
      'Khuyến Nghị AI'
    ]

    const rows = filteredProperties.map(p => [
      p.code,
      `"${p.title.replace(/"/g, '""')}"`,
      p.projectName,
      p.customerName,
      p.customerPhone,
      p.propertyType,
      p.area,
      p.buyPrice,
      p.currentValuation,
      p.currentValuation - p.buyPrice,
      p.monthlyRent,
      p.annualNetRental,
      `${p.constructionProgress}%`,
      p.legalStatus,
      p.aiRecommendation
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `So_Tay_Gia_San_VIP_${selectedCustomerId}_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã tải xuống sổ tay gia sản khách hàng VIP (UTF-8 BOM CSV)!')
  }

  // Handle Add New Property
  const handleCreateProperty = () => {
    const cust = customers.find(c => c.id === newPropCustomerId)
    addPortfolioProperty({
      code: newPropCode,
      title: newPropTitle,
      projectName: newPropProject,
      projectId: 'p2',
      customerId: newPropCustomerId,
      customerName: cust ? cust.name : 'Khách Hàng VIP',
      customerPhone: cust ? cust.phone : '0901234567',
      propertyType: newPropType,
      area: newPropArea,
      bedrooms: 4,
      bathrooms: 4,
      direction: 'Đông Nam',
      view: 'Công viên & Kênh cảnh quan',
      buyPrice: newPropBuyPrice,
      currentValuation: newPropCurrentVal,
      purchaseDate: new Date().toISOString().slice(0, 10),
      handoverDate: '2026-12-31',
      constructionProgress: 80,
      constructionStatus: 'Đang xây thô',
      rentalStatus: 'Chờ nhận nhà',
      monthlyRent: newPropRent,
      annualNetRental: (newPropRent * 12 * 0.9),
      contractCode: `HD-${Math.floor(100 + Math.random() * 900)}`,
      legalStatus: 'HĐMB công chứng',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      aiRecommendation: 'Tiếp tục giữ tích sản',
      aiScore: 91
    })

    setShowAddPropertyModal(false)
    showToast(`Đã thêm thành công căn hộ [${newPropCode}] vào danh mục VIP!`)
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      
      {/* 1. Header with VIP Mode & Multi-Customer Filter */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="p-2 bg-amber-50 dark:bg-amber-950/60 rounded-xl text-amber-600 dark:text-amber-400">
              <Landmark className="h-6 w-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Quản Lý Gia Sản & Danh Mục BĐS VIP (Wealth Management)
            </h1>
            <Badge className="bg-amber-600/10 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold uppercase tracking-wider">
              VIP Private Banking Tier
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sổ tay tài sản số hóa dành riêng cho nhà đầu tư tinh hoa: Theo dõi định giá thị trường, IRR, tiến độ xây dựng, lịch đóng tiền và kịch bản tái cơ cấu.
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowExitModal(true)}
            className="flex-1 sm:flex-initial border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300 hover:bg-amber-50 font-semibold gap-1.5 cursor-pointer"
          >
            <TrendingUp className="h-4 w-4" />
            Mô Phỏng Chốt Lời
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowWealthReportModal(true)}
            className="flex-1 sm:flex-initial border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-semibold gap-1.5 cursor-pointer"
          >
            <FileText className="h-4 w-4 text-indigo-600" />
            Báo Cáo Gia Sản VIP
          </Button>

          <Button 
            size="sm"
            onClick={() => setShowAddPropertyModal(true)}
            className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Thêm Bất Động Sản
          </Button>
        </div>
      </div>

      {/* 2. VIP Investor Selector & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 shrink-0">
            <UserCheck className="h-4 w-4 text-indigo-600" />
            <span>Chủ Sở Hữu Danh Mục:</span>
          </div>

          <select
            value={selectedCustomerId}
            onChange={e => {
              setSelectedCustomerId(e.target.value)
              const selectedC = customers.find(c => c.id === e.target.value)
              showToast(e.target.value === 'all' ? 'Đang xem toàn bộ danh mục tài sản VIP' : `Đã chuyển sang sổ tay gia sản của: ${selectedC?.name}`)
            }}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">-- Toàn Bộ Nhà Đầu Tư VIP ({portfolioProperties.length} BĐS) --</option>
            {customers.map(c => {
              const count = portfolioProperties.filter(p => p.customerId === c.id).length
              if (count === 0 && c.rank !== 'VVIP') return null
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.rank}) - {count} Bất động sản
                </option>
              )
            })}
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="relative flex-1 sm:w-64">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <Input 
              placeholder="Tìm theo mã căn, dự án, tên..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-950"
            />
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            className="h-9 text-xs font-semibold border-emerald-200 text-emerald-700 hover:bg-emerald-50 shrink-0 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1 text-emerald-600" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* 3. Top 4 Macro Wealth & Capital Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 bg-gradient-to-br from-indigo-900 to-indigo-800 text-white border-none shadow-md rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-indigo-200 font-semibold">Tổng Vốn Đầu Tư Gốc</span>
            <Wallet className="h-5 w-5 text-indigo-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">{formatVND(totalInvestment)}</div>
          <p className="text-xs text-indigo-200 mt-2 flex items-center gap-1 font-medium">
            <Building className="h-3.5 w-3.5" /> {filteredProperties.length} Bất động sản đang sở hữu
          </p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-emerald-800 to-emerald-700 text-white border-none shadow-md rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-emerald-200 font-semibold">Định Giá Thị Trường Hiện Tại</span>
            <TrendingUp className="h-5 w-5 text-emerald-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">{formatVND(totalCurrentValuation)}</div>
          <p className="text-xs text-emerald-100 mt-2 flex items-center gap-1 font-bold">
            <ArrowUpRight className="h-4 w-4" /> +{totalCapitalGainPercent}% (+{formatVND(totalCapitalGain)} Lãi vốn)
          </p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-amber-800 to-amber-700 text-white border-none shadow-md rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-amber-200 font-semibold">Dòng Tiền Thuê Ròng (Năm)</span>
            <DollarSign className="h-5 w-5 text-amber-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">{formatVND(totalAnnualNetRental)}</div>
          <p className="text-xs text-amber-200 mt-2 flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5" /> Tỷ suất Rental Yield: <b>{weightedRentalYield}% / Năm</b>
          </p>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-purple-900 to-purple-800 text-white border-none shadow-md rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-purple-200 font-semibold">Tỷ Suất Sinh Lời Danh Mục (IRR)</span>
            <Percent className="h-5 w-5 text-purple-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black">+{overallPortfolioIRR}% / Năm</div>
          <p className="text-xs text-purple-200 mt-2 flex items-center gap-1 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Lãi vốn 3 năm + Dòng tiền khai thác
          </p>
        </Card>
      </div>

      {/* 4. Interactive Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'overview' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border hover:border-indigo-400'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Tổng Quan Danh Mục & Tăng Trưởng Tài Sản
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'properties' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border hover:border-indigo-400'
          }`}
        >
          <Building className="h-3.5 w-3.5" />
          Sổ Tay Bất Động Sản Sở Hữu ({filteredProperties.length})
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'milestones' 
              ? 'bg-amber-600 text-white shadow-md' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border hover:border-amber-400'
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          Lịch Đóng Tiền Đợt Tới ({upcomingMilestones.length})
        </button>

        <button
          onClick={() => setActiveTab('rebalancing')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'rebalancing' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border hover:border-emerald-400'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Chiến Lược Tái Cơ Cấu & Thoát Hàng AI
        </button>
      </div>

      {/* TAB 1: ASSET ALLOCATION & GROWTH */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Asset Value Growth Area Chart (8/12) */}
            <Card className="lg:col-span-8 shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5">
              <CardHeader className="p-0 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                      Tiến Trình Tích Sản & Gia Tăng Giá Trị Thị Trường (2021 - 2026)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      So sánh tổng vốn tích lũy (Invested) và giá trị định giá độc lập (Market Valuation) qua từng năm (Đơn vị: Tỷ VNĐ)
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-300">
                    Lãi Vốn: +{totalCapitalGainPercent}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={HISTORICAL_ASSET_GROWTH} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={v => `${v} Tỷ`} />
                      <RechartsTooltip 
                        formatter={(val: any) => [`${Number(val).toFixed(1)} Tỷ VNĐ`, '']}
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="value" name="Định Giá Thị Trường" stroke="#10b981" strokeWidth={2} fill="url(#valGrad)" />
                      <Area type="monotone" dataKey="invested" name="Vốn Mua Vào" stroke="#6366f1" strokeWidth={2} fill="url(#invGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Asset Allocation Breakdown (4/12) */}
            <Card className="lg:col-span-4 shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5 flex flex-col justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
                  <PieChartIcon className="h-5 w-5 text-indigo-600" />
                  Cơ Cấu Danh Mục Tài Sản
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mb-4">
                  Phân bổ theo loại hình bất động sản
                </CardDescription>

                <div className="h-[200px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={assetAllocationData}
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {assetAllocationData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val: any) => [`${val} Tỷ VNĐ`, 'Định giá']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t text-xs">
                {assetAllocationData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span className="text-slate-600 dark:text-slate-300 font-medium">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{item.value} Tỷ</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Quarterly Cashflow Chart & Diagnostic Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Quarterly Rental Cashflow (7/12) */}
            <Card className="lg:col-span-7 shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 p-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-amber-600" />
                    Dòng Tiền Thuê Ròng Theo Quý (Cash Flow Trends)
                  </h3>
                  <p className="text-xs text-slate-500">Đơn vị: Triệu VNĐ / Quý (Sau khi trừ 10% chi phí bảo trì & quản lý)</p>
                </div>
                <Badge className="bg-amber-600 text-white font-mono text-xs">+{formatVND(totalAnnualNetRental)}/Năm</Badge>
              </div>

              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CASHFLOW_BAR_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                    <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={v => `${v}Tr`} />
                    <RechartsTooltip 
                      formatter={(val: any) => [`${Number(val).toLocaleString()} Triệu VNĐ`, '']}
                      contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                    />
                    <Legend />
                    <Bar dataKey="netRent" name="Thuê Ròng Thực Nhận" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="taxAndOps" name="Chi Phí QL & Bảo Trì" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* AI Health Score & Advisor Recommendations (5/12) */}
            <Card className="lg:col-span-5 shadow-xs border border-indigo-200 dark:border-indigo-900/60 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-indigo-200/60">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-bold text-sm text-indigo-950 dark:text-indigo-200">
                      Đánh Giá Sức Khỏe Gia Sản (AI Diagnostic)
                    </h3>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-black text-xs">Điểm: 93/100 (TỐI ƯU)</Badge>
                </div>

                <div className="space-y-3 mt-4 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      Thanh Khoản & An Toàn Pháp Lý: Tuyệt Vời
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      100% tài sản đều có hợp đồng mua bán công chứng hoặc đã ra sổ hồng. Không có tài sản vướng tranh chấp hoặc thanh tra.
                    </p>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/40 space-y-1">
                    <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      Tiềm Năng Hạ Tầng Bùng Nổ 2026:
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      Các tài sản tại Aqua City và The Global City hưởng lợi kép khi Vành Đai 3 thông xe quý 4/2026 và Sân bay Quốc tế Long Thành cất cánh chuyến đầu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <Button 
                  size="sm"
                  onClick={() => setActiveTab('rebalancing')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs gap-1 cursor-pointer"
                >
                  Xem Kịch Bản Tái Cơ Cấu &rarr;
                </Button>
              </div>
            </Card>

          </div>
        </div>
      )}

      {/* TAB 2: PROPERTY PORTFOLIO CARDS */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-semibold">
              Hiển thị {filteredProperties.length} bất động sản thuộc danh mục
            </span>
            <Button 
              size="sm" 
              onClick={() => setShowAddPropertyModal(true)}
              className="bg-indigo-600 text-white text-xs font-bold gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Thêm Căn Mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProperties.map(property => {
              const gain = property.currentValuation - property.buyPrice
              const gainPct = ((gain / property.buyPrice) * 100).toFixed(1)
              return (
                <Card 
                  key={property.id} 
                  className="overflow-hidden shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image Banner */}
                    <div className="relative h-44 w-full bg-slate-200 overflow-hidden">
                      <img 
                        src={property.image} 
                        alt={property.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                      <div className="absolute top-3 left-3 flex gap-1.5">
                        <Badge className="bg-slate-900/80 backdrop-blur-xs text-white font-mono text-xs">
                          {property.code}
                        </Badge>
                        <Badge className="bg-indigo-600 text-white text-[10px]">
                          {property.propertyType}
                        </Badge>
                      </div>

                      <div className="absolute top-3 right-3">
                        <Badge className={`text-xs font-semibold ${
                          property.constructionStatus === 'Đã có sổ hồng' ? 'bg-emerald-600 text-white' :
                          property.constructionStatus === 'Đã bàn giao' ? 'bg-blue-600 text-white' :
                          'bg-amber-600 text-white'
                        }`}>
                          {property.constructionStatus}
                        </Badge>
                      </div>

                      <div className="absolute bottom-2 left-3 right-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[11px] flex justify-between items-center">
                        <span>Chủ sở hữu: <b>{property.customerName}</b></span>
                        <span className="font-mono text-amber-300">HĐ: {property.contractCode}</span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-4 space-y-3 text-xs">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{property.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{property.projectName} • {property.area} m² • Hướng {property.direction}</p>
                      </div>

                      {/* Pricing Comparison */}
                      <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
                        <div className="flex justify-between items-center text-slate-500 text-[11px]">
                          <span>Giá Mua Vào:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{formatVND(property.buyPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Định Giá Hiện Tại:</span>
                          <span className="font-black text-emerald-600 text-sm">{formatVND(property.currentValuation)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-emerald-700 dark:text-emerald-400 font-bold pt-1 border-t border-dashed">
                          <span>Lãi vốn tích lũy:</span>
                          <span>+{formatVND(gain)} (+{gainPct}%)</span>
                        </div>
                      </div>

                      {/* Construction Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-slate-500">Tiến độ xây dựng:</span>
                          <span className="font-bold text-indigo-600">{property.constructionProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all" 
                            style={{ width: `${property.constructionProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Rental Status */}
                      <div className="flex items-center justify-between text-[11px] p-2 bg-amber-50/60 dark:bg-amber-950/30 rounded-lg border border-amber-200/60">
                        <span className="text-amber-800 dark:text-amber-300 font-medium">Khai thác cho thuê:</span>
                        <span className="font-bold text-amber-700 dark:text-amber-300">
                          {property.monthlyRent > 0 ? `${formatVND(property.monthlyRent)}/tháng` : 'Chờ bàn giao'}
                        </span>
                      </div>

                      {/* AI Recommendation Banner */}
                      <div className="flex items-center gap-1.5 text-[11px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 p-2 rounded-lg border border-purple-200 dark:border-purple-900/50">
                        <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                        <span className="font-medium">AI Rating: <b>{property.aiRecommendation}</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="p-4 pt-0 border-t flex items-center justify-between gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedPropertyForDetail(property)}
                      className="flex-1 text-xs font-semibold h-8 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Chi Tiết Pháp Lý
                    </Button>

                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setExitTargetPropertyId(property.id)
                        setExitSellingPrice(property.currentValuation)
                        setShowExitModal(true)
                      }}
                      className="text-xs font-semibold text-amber-700 border-amber-200 hover:bg-amber-50 h-8 cursor-pointer"
                    >
                      Chốt Lời
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT MILESTONES SCHEDULE */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          <Card className="shadow-xs border border-amber-200 dark:border-amber-900/60 rounded-2xl p-5 bg-white dark:bg-slate-900 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  Lịch Đóng Tiền Đợt Kế Tiếp Theo Tiến Độ HĐMB
                </h3>
                <p className="text-xs text-slate-500">
                  Cảnh báo nhắc nợ đợt thanh toán sắp tới, bảo lãnh ngân hàng và hỗ trợ tạo VietQR 1-chạm
                </p>
              </div>
              <Badge className="bg-amber-600 text-white font-mono text-xs">{upcomingMilestones.length} Đợt sắp tới</Badge>
            </div>

            {upcomingMilestones.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Tất cả các bất động sản trong danh mục đã hoàn tất thanh toán 100%.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingMilestones.map(({ property, milestone }, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-amber-400 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-amber-600 text-white font-mono text-[10px]">{property.code}</Badge>
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{property.projectName}</span>
                        <span className="text-[11px] text-slate-500">({property.customerName})</span>
                        <Badge variant="outline" className={`text-[10px] ${
                          milestone.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}>
                          {milestone.status === 'paid' ? 'Đã Thanh Toán' : 'Đến Hạn Đóng'}
                        </Badge>
                      </div>

                      <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {milestone.batch}
                      </div>

                      <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Hạn đóng: <b className="text-slate-800 dark:text-slate-200">{milestone.dueDate}</b></span>
                        <span>Tỷ lệ: <b>{milestone.percentage}% HĐMB</b></span>
                        <span>Số tiền: <b className="text-red-600 dark:text-red-400 text-xs">{formatVND(milestone.amount)}</b></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {milestone.status === 'paid' ? (
                        <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Đã hoàn tất
                        </div>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => setSelectedMilestoneForPayment({ property, milestone })}
                          className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-1.5 cursor-pointer"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          Thanh Toán / Lấy VietQR
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 4: AI REBALANCING & EXIT STRATEGY */}
      {activeTab === 'rebalancing' && (
        <div className="space-y-5">
          <Card className="shadow-xs border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/60 pb-3">
              <div>
                <h3 className="font-bold text-sm text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  Chiến Lược Tái Cơ Cấu & Tối Ưu Hóa Dòng Tiền (AI Wealth Rebalancer)
                </h3>
                <p className="text-xs text-slate-500">
                  Hệ thống AI phân tích chu kỳ tăng giá, thời điểm chốt lời lý tưởng và khuyến nghị đảo dòng tiền sang các đại dự án tiềm năng cao
                </p>
              </div>
              <Button 
                size="sm"
                onClick={() => setShowExitModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                Mô Phỏng Chốt Lời Ngay
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <Badge className="bg-emerald-600 text-white text-[10px]">Đề Xuất 1: Chốt Lời Đỉnh Điểm</Badge>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Chốt lời căn Sky Villa Manhattan [TGM-28.01] khi nhận nhà Q4/2026
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  Giá mua ban đầu 32.0 Tỷ, định giá thị trường hiện tại 39.5 Tỷ (+23.4%). Khi nhận nhà bàn giao full nội thất, giá thứ cấp dự kiến đạt <b>42.0 Tỷ</b>. Bán tại thời điểm này sẽ thu về <b>+8.5 Tỷ lợi nhuận ròng</b>.
                </p>
                <div className="text-[11px] text-emerald-700 font-bold">
                  Hành động tiếp theo: Đảo dòng tiền 42 Tỷ sang 2 căn Shophouse The Global City để khai thác F&B 120Tr/tháng.
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                <Badge className="bg-indigo-600 text-white text-[10px]">Đề Xuất 2: Tăng Tỷ Suất Cho Thuê</Badge>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Tái đàm phán hợp đồng thuê Biệt thự biển NovaWorld [NVW-01.01]
                </h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                  Hợp đồng ủy thác hiện tại 65Tr/tháng với Centara Mirage sẽ hết hạn vào 2027. Đề xuất chuyển đổi sang mô hình <b>Luxury Airbnb / Homestay tự quản lý</b> để nâng dòng tiền ròng lên <b>90Tr/tháng</b> (+38%).
                </p>
                <div className="text-[11px] text-indigo-700 font-bold">
                  Tỷ suất Rental Yield sẽ tăng từ 2.8% lên 4.3%/năm.
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[700] p-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* 5. MODAL 1: CHI TIẾT THẺ CĂN HỘ & PHÁP LÝ SỐ HÓA */}
      {selectedPropertyForDetail && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Hồ Sơ Pháp Lý & Thẻ Căn Hộ: [{selectedPropertyForDetail.code}]
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedPropertyForDetail.projectName} • Chủ sở hữu: {selectedPropertyForDetail.customerName}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedPropertyForDetail(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-slate-500">Tên bất động sản:</span>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">{selectedPropertyForDetail.title}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-500">Tình trạng pháp lý:</span>
                  <div className="font-bold text-emerald-600">{selectedPropertyForDetail.legalStatus}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border grid grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Diện tích</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPropertyForDetail.area} m²</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Hướng view</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPropertyForDetail.view}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Số phòng</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedPropertyForDetail.bedrooms} PN / {selectedPropertyForDetail.bathrooms} WC</span>
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">Giá mua vào HĐMB</span>
                  <span className="font-bold text-indigo-900 dark:text-indigo-200 text-sm">{formatVND(selectedPropertyForDetail.buyPrice)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Định giá thị trường hôm nay</span>
                  <span className="font-bold text-emerald-600 text-sm">{formatVND(selectedPropertyForDetail.currentValuation)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">Tài Liệu Pháp Lý Số Hóa Liên Kết:</div>
                <div className="space-y-1.5">
                  <div className="p-2.5 bg-white dark:bg-slate-900 border rounded-lg flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <FileText className="h-4 w-4 text-red-500" />
                      BanScan_HDMB_{selectedPropertyForDetail.contractCode}_CongChung.pdf (6.4 MB)
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => showToast('Đang tải bản scan HĐMB có dấu mộc công chứng...')}
                      className="text-indigo-600 h-7 text-xs font-semibold cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" /> Tải về
                    </Button>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-slate-900 border rounded-lg flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      BienBanNghiemThu_ChatLuongXayDung.pdf (3.2 MB)
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => showToast('Đang tải biên bản nghiệm thu kỹ thuật...')}
                      className="text-indigo-600 h-7 text-xs font-semibold cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" /> Tải về
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button 
                  size="sm" 
                  onClick={() => setSelectedPropertyForDetail(null)} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
                >
                  Đóng Hồ Sơ
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL 2: THÔNG BÁO ĐÓNG TIỀN & VIETQR 1-CHẠM */}
      {selectedMilestoneForPayment && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Thanh Toán & Mã VietQR Đóng Tiền Đợt Kế Tiếp</h3>
              </div>
              <button onClick={() => setSelectedMilestoneForPayment(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 space-y-1">
                <div className="font-bold text-amber-900 dark:text-amber-200 text-xs">
                  {selectedMilestoneForPayment.milestone.batch}
                </div>
                <div className="text-[11px] text-amber-800 dark:text-amber-300">
                  Căn hộ: <b>{selectedMilestoneForPayment.property.code}</b> ({selectedMilestoneForPayment.property.projectName})
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-amber-900 dark:text-amber-100 pt-1">
                  <span>Số tiền phải đóng:</span>
                  <span className="text-red-600 font-mono text-base">{formatVND(selectedMilestoneForPayment.milestone.amount)}</span>
                </div>
              </div>

              {/* VietQR Display Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border flex items-center justify-center">
                  <div className="w-full h-full border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center text-indigo-700">
                    <QrCode className="h-16 w-16" />
                    <span className="text-[9px] font-mono mt-1 font-bold">VietQR NAPAS 247</span>
                  </div>
                </div>

                <div className="space-y-1 w-full text-left font-mono text-[11px] bg-white dark:bg-slate-900 p-3 rounded-xl border">
                  <div>Ngân hàng: <b>{selectedMilestoneForPayment.milestone.accountBank}</b></div>
                  <div>Số tài khoản: <b>{selectedMilestoneForPayment.milestone.accountNumber}</b></div>
                  <div>Chủ tài khoản: <b>{selectedMilestoneForPayment.milestone.accountName}</b></div>
                  <div className="text-indigo-600 font-bold">Nội dung: {selectedMilestoneForPayment.milestone.transferSyntax}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedMilestoneForPayment.milestone.transferSyntax)
                    showToast('Đã sao chép cú pháp chuyển khoản vào bộ nhớ tạm!')
                  }}
                  className="gap-1 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" /> Sao Chép Cú Pháp
                </Button>

                <Button 
                  size="sm"
                  onClick={() => {
                    payPortfolioMilestone(selectedMilestoneForPayment.property.id)
                    setSelectedMilestoneForPayment(null)
                    showToast(`Đã ghi nhận thanh toán thành công đợt đóng tiền cho căn [${selectedMilestoneForPayment.property.code}]!`)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  Xác Nhận Đã Chuyển Khoản
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL 3: MÔ PHỎNG CHỐT LỜI / THOÁT HÀNG BĐS (EXIT SIMULATOR) */}
      {showExitModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Mô Phỏng Chốt Lời & Thoát Hàng Bất Động Sản (Exit Strategy)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Tính toán thuế TNCN 2%, phí môi giới 1.5% và Lợi Nhuận Ròng thực tế
                  </p>
                </div>
              </div>
              <button onClick={() => setShowExitModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Chọn bất động sản muốn thanh lý chốt lời:</Label>
                <select
                  value={exitTargetPropertyId || (filteredProperties[0]?.id || '')}
                  onChange={e => {
                    setExitTargetPropertyId(e.target.value)
                    const p = filteredProperties.find(item => item.id === e.target.value)
                    if (p) setExitSellingPrice(p.currentValuation)
                  }}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold cursor-pointer"
                >
                  {filteredProperties.map(p => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.title} - Mua: {formatVND(p.buyPrice)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selling Price Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Giá Bán Mục Tiêu:</span>
                  <span className="font-black text-amber-600 text-sm">{formatVND(exitSellingPrice)}</span>
                </div>
                <Input 
                  type="range" 
                  min={Math.round((activeExitProperty?.buyPrice || 10000000000) * 0.9)} 
                  max={Math.round((activeExitProperty?.buyPrice || 10000000000) * 1.6)} 
                  step={500000000}
                  value={exitSellingPrice} 
                  onChange={e => setExitSellingPrice(Number(e.target.value))}
                  className="accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Analysis Result Box */}
              {exitAnalysis && (
                <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Giá mua vào ban đầu:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{formatVND(exitAnalysis.originalBuy)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lãi vốn gộp (Gross Gain):</span>
                    <span className="font-bold text-slate-900 dark:text-white">+{formatVND(exitAnalysis.grossCapitalGain)}</span>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <span>Thuế TNCN chuyển nhượng (2%):</span>
                    <span>-{formatVND(exitAnalysis.pitTax2Pct)}</span>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <span>Phí hoa hồng môi giới (1.5%):</span>
                    <span>-{formatVND(exitAnalysis.brokerageFee1_5Pct)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t font-black text-sm">
                    <span className="text-emerald-700 dark:text-emerald-400">LỢI NHUẬN RÒNG BỎ TÚI (NET):</span>
                    <span className="text-emerald-600 text-base">+{formatVND(exitAnalysis.netProfit)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-indigo-600 font-bold">
                    <span>Tỷ suất lợi nhuận ròng trên vốn (Net ROI):</span>
                    <span>+{exitAnalysis.netROI}%</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button 
                  size="sm"
                  onClick={() => {
                    setShowExitModal(false)
                    showToast(`Đã lưu kế hoạch chốt lời căn [${activeExitProperty?.code}] giá ${formatVND(exitSellingPrice)}!`)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Lưu Phương Án Chốt Lời
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL 4: THÊM BẤT ĐỘNG SẢN VÀO DANH MỤC VIP */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Thêm Bất Động Sản Vào Sổ Tay Gia Sản</h3>
              </div>
              <button onClick={() => setShowAddPropertyModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Chủ sở hữu VIP:</Label>
                <select
                  value={newPropCustomerId}
                  onChange={e => setNewPropCustomerId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold cursor-pointer"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.rank})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Mã căn:</Label>
                  <Input 
                    value={newPropCode} 
                    onChange={e => setNewPropCode(e.target.value)} 
                    className="h-9 text-xs" 
                    placeholder="VD: AQC-15C.02" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Dự án:</Label>
                  <select
                    value={newPropProject}
                    onChange={e => setNewPropProject(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Tên hiển thị:</Label>
                <Input 
                  value={newPropTitle} 
                  onChange={e => setNewPropTitle(e.target.value)} 
                  className="h-9 text-xs" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Giá mua vào (VNĐ):</Label>
                  <Input 
                    type="number"
                    value={newPropBuyPrice} 
                    onChange={e => setNewPropBuyPrice(Number(e.target.value))} 
                    className="h-9 text-xs" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Định giá hiện tại (VNĐ):</Label>
                  <Input 
                    type="number"
                    value={newPropCurrentVal} 
                    onChange={e => setNewPropCurrentVal(Number(e.target.value))} 
                    className="h-9 text-xs" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Diện tích (m2):</Label>
                  <Input 
                    type="number"
                    value={newPropArea} 
                    onChange={e => setNewPropArea(Number(e.target.value))} 
                    className="h-9 text-xs" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Giá thuê ước tính/tháng:</Label>
                  <Input 
                    type="number"
                    value={newPropRent} 
                    onChange={e => setNewPropRent(Number(e.target.value))} 
                    className="h-9 text-xs" 
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowAddPropertyModal(false)} className="cursor-pointer">
                  Hủy
                </Button>
                <Button 
                  size="sm"
                  onClick={handleCreateProperty}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Lưu Vào Sổ Tay Tài Sản
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL 5: XUẤT BÁO CÁO THẨM ĐỊNH GIA SẢN VIP (PDF MEMO) */}
      {showWealthReportModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Báo Cáo Thẩm Định Gia Sản Khách Hàng VIP (PDF)</h3>
              </div>
              <button onClick={() => setShowWealthReportModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">BÁO CÁO WEALTH MANAGEMENT</span>
                  <Badge className="bg-amber-600 text-white text-[10px]">PRIVATE TIER</Badge>
                </div>
                <div className="text-[11px] text-slate-500">
                  Phân tích danh mục: {selectedCustomerId === 'all' ? 'Toàn Bộ Khách Hàng VIP' : customers.find(c => c.id === selectedCustomerId)?.name}
                </div>
                <div className="space-y-1 pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tổng số tài sản:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{filteredProperties.length} Căn hộ/Biệt thự</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tổng vốn tích lũy:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatVND(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Định giá thị trường:</span>
                    <span className="font-bold text-emerald-600">{formatVND(totalCurrentValuation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lãi vốn tích lũy:</span>
                    <span className="font-bold text-emerald-600">+{formatVND(totalCapitalGain)} (+{totalCapitalGainPercent}%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dòng tiền cho thuê/năm:</span>
                    <span className="font-bold text-amber-600">+{formatVND(totalAnnualNetRental)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowWealthReportModal(false)} className="cursor-pointer">
                  Đóng
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    setShowWealthReportModal(false)
                    showToast('Đã tải xuống file Báo Cáo Thẩm Định Gia Sản VIP (PDF có dấu mộc)!')
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Tải Về PDF Có Dấu Mộc
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
