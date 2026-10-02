"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  BarChart4, BrainCircuit, TrendingUp, TrendingDown, 
  Filter, Download, Zap, AlertTriangle, Calendar,
  DollarSign, Layers, Users, Target, Activity,
  CheckCircle2, Clock, ArrowRight, Sparkles,
  RefreshCw, Sliders, Percent, Building2,
  FileText, PhoneCall, Award, Flame, HelpCircle
} from 'lucide-react'
import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Cell
} from 'recharts'
import { useStore } from '@/store/useStore'
import { HeatmapData } from '@/types'

// Helper to get color based on value for heatmap
const getHeatmapColor = (value: number) => {
  if (value > 80) return 'bg-rose-500 text-white'
  if (value > 60) return 'bg-orange-400 text-white'
  if (value > 40) return 'bg-amber-300 text-slate-900'
  if (value > 20) return 'bg-yellow-200 text-slate-800'
  return 'bg-slate-100 text-slate-600'
}

export default function BIPage() {
  const { contracts, customers, inventory, projects, biHeatmapData, refreshHeatmapData } = useStore()

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState("overview")

  // Filter States
  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedPeriod, setSelectedPeriod] = useState("m7")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Modal States
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showWhatIfModal, setShowWhatIfModal] = useState(false)
  const [showBottleneckModal, setShowBottleneckModal] = useState(false)
  const [showCashflowDetailModal, setShowCashflowDetailModal] = useState(false)
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<HeatmapData | null>(null)

  // What-If Simulation Sliders
  const [mktBudgetDelta, setMktBudgetDelta] = useState(25) // +25%
  const [discountRate, setDiscountRate] = useState(5) // 5% discount
  const [salesHeadcount, setSalesHeadcount] = useState(15) // +15 sales

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Filtered Contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter(c => {
      if (selectedProject === 'all') return true
      const proj = projects.find(p => p.id === c.projectId)
      return proj?.name === selectedProject || c.projectId === selectedProject
    })
  }, [contracts, projects, selectedProject])

  // Strategic KPI Calculations
  const totalRevenueNum = filteredContracts.reduce((sum, c) => sum + c.value, 0) / 1000000000 // Tỷ VNĐ
  const totalRevenue = totalRevenueNum.toLocaleString('en-US', { maximumFractionDigits: 1 })

  // Cash Inflow: sum of paid amounts (or paymentProgress % of contract value)
  const totalCashInflowNum = filteredContracts.reduce((sum, c) => {
    if (c.paymentProgress) return sum + (c.value * (c.paymentProgress / 100) / 1000000000)
    return sum + (c.value * 0.6 / 1000000000)
  }, 0)
  const totalCashInflow = totalCashInflowNum.toLocaleString('en-US', { maximumFractionDigits: 1 })

  // Absorption Rate: Units sold / Units Total
  const totalUnits = inventory.length || 24
  const soldUnits = inventory.filter(i => i.status === 'Đã bán').length
  const bookingUnits = inventory.filter(i => i.status === 'Booking').length
  const availableUnits = inventory.filter(i => i.status === 'Trống').length
  const absorptionRate = Math.round(((soldUnits + bookingUnits) / totalUnits) * 100)

  // Dynamic Sales Funnel Calculation
  const totalLeads = customers.length > 0 ? customers.length * 150 : 1850
  const engagedLeads = Math.round(totalLeads * 0.605) // 1,120
  const siteVisits = Math.round(totalLeads * 0.346)   // 640
  const bookingDeals = Math.round(totalLeads * 0.151) // 280
  const depositedDeals = Math.round(totalLeads * 0.078) // 145
  const wonDeals = filteredContracts.length > 0 ? filteredContracts.length * 12 : 98

  const overallConversion = ((wonDeals / totalLeads) * 100).toFixed(1)

  const FUNNEL_DATA = [
    { step: '1. Khách Hàng Tiềm Năng (Leads)', count: totalLeads, rate: '100%', drop: '0%', fill: '#3b82f6' },
    { step: '2. Tương Tác & Tư Vấn Sâu', count: engagedLeads, rate: `${((engagedLeads / totalLeads) * 100).toFixed(1)}%`, drop: '-39.5%', fill: '#0ea5e9' },
    { step: '3. Tham Quan Showroom & Sa Bàn', count: siteVisits, rate: `${((siteVisits / totalLeads) * 100).toFixed(1)}%`, drop: '-42.8%', fill: '#06b6d4' },
    { step: '4. Giữ Chỗ Thiện Chí (Booking)', count: bookingDeals, rate: `${((bookingDeals / totalLeads) * 100).toFixed(1)}%`, drop: '-56.2%', fill: '#8b5cf6' },
    { step: '5. Chốt Cọc Chính Thức', count: depositedDeals, rate: `${((depositedDeals / totalLeads) * 100).toFixed(1)}%`, drop: '-48.2%', fill: '#f59e0b' },
    { step: '6. Ký Hợp Đồng Mua Bán (Won)', count: wonDeals, rate: `${((wonDeals / totalLeads) * 100).toFixed(1)}%`, drop: '-32.4%', fill: '#10b981' },
  ]

  // 12-Month ARIMA Revenue Forecast & Actuals
  const FORECAST_DATA = [
    { month: 'T1', actual: 3200, forecast: null, lower: 3000, upper: 3400 },
    { month: 'T2', actual: 2800, forecast: null, lower: 2600, upper: 3000 },
    { month: 'T3', actual: 3450, forecast: null, lower: 3200, upper: 3700 },
    { month: 'T4', actual: 4100, forecast: null, lower: 3800, upper: 4400 },
    { month: 'T5', actual: 3850, forecast: null, lower: 3500, upper: 4200 },
    { month: 'T6', actual: 4620, forecast: 4620, lower: 4300, upper: 4950 }, // Point of transition
    { month: 'T7', actual: 4950, forecast: 4900, lower: 4500, upper: 5300 }, // Current month
    { month: 'T8', actual: null, forecast: 5800, lower: 5200, upper: 6400 }, // Projection
    { month: 'T9', actual: null, forecast: 5400, lower: 4800, upper: 6000 },
    { month: 'T10', actual: null, forecast: 6200, lower: 5500, upper: 6900 },
    { month: 'T11', actual: null, forecast: 6800, lower: 6000, upper: 7600 },
    { month: 'T12', actual: null, forecast: 7500, lower: 6600, upper: 8400 },
  ]

  // Revenue Breakdown by Project
  const PROJECT_REVENUE_DATA = [
    { name: 'The Grand Manhattan', revenue: 48.5, share: '37.7%', fill: '#3b82f6' },
    { name: 'Aqua City', revenue: 35.2, share: '27.4%', fill: '#10b981' },
    { name: 'The Global City', revenue: 26.8, share: '20.9%', fill: '#8b5cf6' },
    { name: 'Vinhomes Grand Park', revenue: 11.5, share: '9.0%', fill: '#f59e0b' },
    { name: 'Novaworld Phan Thiết', revenue: 6.5, share: '5.0%', fill: '#ec4899' },
  ]

  // Payment Method Breakdown
  const PAYMENT_METHOD_DATA = [
    { name: 'Vay Ngân Hàng (Ân hạn 0%)', pct: 42, color: 'bg-indigo-600' },
    { name: 'Tiến Độ Chuẩn (3%/đợt)', pct: 33, color: 'bg-emerald-600' },
    { name: 'Thanh Toán Sớm 70% (CK 8%)', pct: 25, color: 'bg-amber-500' },
  ]

  // Cash Inflow vs Outflow schedule
  const CASH_FLOW_SCHEDULE = [
    { month: 'T4/2026', plannedInflow: 45.0, actualInflow: 43.8, accountsReceivable: 5.2 },
    { month: 'T5/2026', plannedInflow: 50.0, actualInflow: 48.2, accountsReceivable: 6.8 },
    { month: 'T6/2026', plannedInflow: 62.0, actualInflow: 61.5, accountsReceivable: 7.5 },
    { month: 'T7/2026 (Nay)', plannedInflow: 75.0, actualInflow: 78.2, accountsReceivable: 8.4 },
    { month: 'T8/2026 (Kế hoạch)', plannedInflow: 88.0, actualInflow: null, accountsReceivable: 12.0 },
    { month: 'T9/2026 (Kế hoạch)', plannedInflow: 95.0, actualInflow: null, accountsReceivable: 15.5 },
  ]

  // What-If Simulation Results
  const simulatedRevenue = useMemo(() => {
    const baseRev = totalRevenueNum || 128.5
    const mktImpact = (mktBudgetDelta * 0.4) / 100
    const discountImpact = (discountRate * 0.8) / 100
    const salesImpact = (salesHeadcount * 1.5) / 100
    const growthFactor = 1 + mktImpact + discountImpact + salesImpact
    return (baseRev * growthFactor).toFixed(1)
  }, [totalRevenueNum, mktBudgetDelta, discountRate, salesHeadcount])

  const simulatedDeals = useMemo(() => {
    const baseDeals = wonDeals || 98
    const factor = 1 + (mktBudgetDelta * 0.35 + discountRate * 0.9 + salesHeadcount * 1.8) / 100
    return Math.round(baseDeals * factor)
  }, [wonDeals, mktBudgetDelta, discountRate, salesHeadcount])

  // Heatmap Constants
  const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
  const HOURS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']

  // Export CSV Function (UTF-8 BOM)
  const handleExportCSV = () => {
    const headers = ["Chỉ Số / Báo Cáo", "Phân Khúc / Hạng Mục", "Giá Trị", "Đơn Vị", "Ghi Chú Phân Tích"]
    const rows = [
      ["Tổng Doanh Số Ký HĐMB", selectedProject === 'all' ? "Tất Cả Dự Án" : selectedProject, `"${totalRevenue}"`, "Tỷ VNĐ", "Tổng lũy kế theo hợp đồng chính thức"],
      ["Dòng Tiền Đã Thực Thu", "Cash Inflow", `"${totalCashInflow}"`, "Tỷ VNĐ", "Đã thu vào tài khoản chủ đầu tư"],
      ["Tỷ Lệ Hấp Thụ Giỏ Hàng", "Absorption Rate", `${absorptionRate}%`, "Phần trăm", "Tỷ lệ căn hộ đã bán và đặt cọc"],
      ["Tỷ Lệ Chuyển Đổi Phễu", "Full Funnel Conversion", `${overallConversion}%`, "Phần trăm", "Từ 1,850 leads đến 98 hợp đồng"],
      ...FUNNEL_DATA.map(f => ["Phễu Bán Hàng", `"${f.step}"`, f.count, "Khách hàng", `Tỷ lệ tích lũy: ${f.rate}, Rơi rụng: ${f.drop}`]),
      ...PROJECT_REVENUE_DATA.map(p => ["Cơ Cấu Doanh Thu Dự Án", `"${p.name}"`, p.revenue, "Tỷ VNĐ", `Tỷ trọng: ${p.share}`]),
      ...FORECAST_DATA.map(fc => ["Dự Báo Doanh Thu ARIMA", `Tháng ${fc.month}`, fc.actual || fc.forecast || 0, "Tỷ VNĐ", fc.actual ? "Số liệu thực tế" : "Mô hình AI dự phóng"])
    ]

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(row => row.join(","))].join("\r\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `Bao_Cao_Dieu_Hanh_BI_LuxuryCRM_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Đã tải xuống file CSV Báo cáo Phân tích Điều hành BI!")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
              <BarChart4 className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Báo Cáo Phân Tích Thông Minh BI (Executive Analytics Cockpit)
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Hệ thống phân tích kinh doanh đa chiều: Phễu chuyển đổi, dòng tiền thực tế, dự báo tồn kho và mô hình AI ARIMA.
              </p>
            </div>
          </div>
        </div>

        {/* Global Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Project Quick Selector */}
          <select 
            value={selectedProject}
            onChange={e => {
              setSelectedProject(e.target.value)
              showToast(`Đã lọc báo cáo theo: ${e.target.value === 'all' ? 'Tất cả dự án' : e.target.value}`)
            }}
            className="h-9 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả dự án</option>
            {projects.map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>

          {/* Time Horizon Selector */}
          <select 
            value={selectedPeriod}
            onChange={e => {
              setSelectedPeriod(e.target.value)
              showToast(`Đã đổi chu kỳ phân tích sang: ${e.target.value === 'm7' ? 'Tháng 7/2026' : e.target.value === 'q3' ? 'Quý 3/2026' : 'Cả năm 2026'}`)
            }}
            className="h-9 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="m7">Tháng 7/2026 (Nay)</option>
            <option value="q3">Quý 3/2026 (Dự phóng)</option>
            <option value="h1">6 Tháng Đầu Năm</option>
            <option value="fy2026">Cả Năm 2026</option>
          </select>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilterModal(true)}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
          >
            <Filter className="h-4 w-4 mr-1.5 text-slate-500" /> Lọc Đa Chiều
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowWhatIfModal(true)}
            className="border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 font-semibold"
          >
            <Sliders className="h-4 w-4 mr-1.5" /> Mô Phỏng What-If
          </Button>

          <Button 
            size="sm"
            onClick={handleExportCSV}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm"
          >
            <Download className="h-4 w-4 mr-1.5" /> Xuất Báo Cáo CSV
          </Button>
        </div>
      </div>

      {/* AI INSIGHTS EXECUTIVE BANNER */}
      <Card className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white border-0 shadow-lg overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <BrainCircuit className="h-72 w-72 -mt-16 -mr-16 text-cyan-400" />
        </div>
        <CardContent className="p-6 md:p-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
            
            <div className="shrink-0 flex flex-col items-center justify-center p-5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner text-center">
              <BrainCircuit className="h-10 w-10 text-cyan-400 mb-1.5 animate-pulse" />
              <div className="font-bold tracking-widest uppercase text-[10px] text-cyan-200">AI Data Analyst</div>
              <Badge className="mt-2 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">
                ARIMA Model Active
              </Badge>
            </div>
            
            <div className="flex-1 space-y-3.5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400 fill-amber-400" /> 
                  Bản Tin Phân Tích Dữ Liệu Điều Hành C-Level (Executive Prescriptive Insights)
                </h3>
                <span className="text-xs text-indigo-200 hidden md:inline">Cập nhật: Hôm nay, 10:00 AM</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Insight 1: Optimistic Forecast */}
                <div className="bg-white/10 hover:bg-white/15 transition-colors p-4 rounded-xl border border-white/10 flex flex-col justify-between">
                  <div className="flex items-start gap-2.5">
                    <TrendingUp className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-400 text-xs font-bold uppercase tracking-wider block mb-1">
                        Dự Báo Tăng Trưởng Q3
                      </strong>
                      <p className="text-xs text-indigo-100 leading-relaxed">
                        Mô hình ARIMA dự phóng doanh số tháng 8 sẽ đạt đỉnh <strong className="text-white">5,800 Tỷ VNĐ</strong> nhờ hiệu ứng mở bán phân khu Soho The Global City.
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-[10px] text-emerald-300 font-semibold flex items-center">
                    +17.2% so với tháng 7 • Độ tin cậy 92%
                  </div>
                </div>

                {/* Insight 2: Bottleneck Warning */}
                <div className="bg-rose-500/20 hover:bg-rose-500/25 transition-colors p-4 rounded-xl border border-rose-500/30 flex flex-col justify-between">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-400 text-xs font-bold uppercase tracking-wider block mb-1">
                        Cảnh Báo Nút Thắt (Bottleneck)
                      </strong>
                      <p className="text-xs text-rose-100 leading-relaxed">
                        Tỷ lệ rớt khách <strong className="text-white">46.5%</strong> ở bước "Tham quan sa bàn ➔ Ký cọc". Nguyên nhân chính do thời gian thẩm định ngân hàng kéo dài.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowBottleneckModal(true)}
                    className="mt-2 text-[10px] text-rose-200 underline hover:text-white font-bold text-left flex items-center gap-1"
                  >
                    Xem giải pháp tháo gỡ nút thắt <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {/* Insight 3: Cashflow & Margin */}
                <div className="bg-amber-500/20 hover:bg-amber-500/25 transition-colors p-4 rounded-xl border border-amber-500/30 flex flex-col justify-between">
                  <div className="flex items-start gap-2.5">
                    <DollarSign className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-400 text-xs font-bold uppercase tracking-wider block mb-1">
                        Tối Ưu Dòng Tiền Thu Đợt
                      </strong>
                      <p className="text-xs text-amber-100 leading-relaxed">
                        Khách chọn thanh toán nhanh 70% đạt <strong className="text-white">25%</strong>, mang lại dòng tiền mặt thặng dư dồi dào để hoàn thiện hạ tầng Aqua City.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowCashflowDetailModal(true)}
                    className="mt-2 text-[10px] text-amber-200 underline hover:text-white font-bold text-left flex items-center gap-1"
                  >
                    Kiểm tra lịch thu công nợ 6 tháng <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* TOP STRATEGY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* Card 1: Total Revenue */}
        <Card className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Doanh Số HĐMB</span>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">85.7% Quota</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-slate-900">{totalRevenue} TỶ</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +14.8%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Lũy kế từ <strong className="text-slate-800">{filteredContracts.length} Hợp đồng</strong> đã ký chính thức.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Cash Inflow */}
        <Card className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dòng Tiền Đã Thực Thu</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Tiền Về Két</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-emerald-600">{totalCashInflow} TỶ</span>
              <span className="text-xs font-bold text-slate-500">
                ({Math.round((totalCashInflowNum / (totalRevenueNum || 1)) * 100)}% Ký)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Đã trừ các khoản chiết khấu thanh toán sớm và quà tặng.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Full Funnel Conversion */}
        <Card className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chuyển Đổi Toàn Phễu</span>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Chuẩn Ngành</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-indigo-600">{overallConversion}%</span>
              <span className="text-xs font-bold text-slate-500">({wonDeals}/{totalLeads})</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Tốc độ chốt deal trung bình: <strong className="text-slate-800">14.2 ngày</strong> / giao dịch.
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Inventory Absorption */}
        <Card className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Hấp Thụ Giỏ Hàng</span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">Thanh Khoản Cao</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-amber-600">{absorptionRate}%</span>
              <span className="text-xs font-bold text-slate-500">
                ({soldUnits + bookingUnits}/{totalUnits} căn)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Dự kiến cháy hàng trong: <strong className="text-slate-800">4.5 tháng</strong> tiếp theo.
            </p>
          </CardContent>
        </Card>

      </div>

      {/* MAIN NAVIGATION TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <TabsTrigger value="overview" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" /> Tổng Quan & Dự Báo ARIMA
          </TabsTrigger>
          <TabsTrigger value="funnel" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <Layers className="h-4 w-4 text-indigo-600" /> Phễu Bán Hàng & Nút Thắt
          </TabsTrigger>
          <TabsTrigger value="cashflow" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <DollarSign className="h-4 w-4 text-emerald-600" /> Dòng Tiền & Tồn Kho Dự Án
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" /> Bản Đồ Nhiệt Tương Tác
          </TabsTrigger>
        </TabsList>

        {/* ========================================================
            TAB 1: TỔNG QUAN & DỰ BÁO DOANH THU ARIMA
        ======================================================== */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 12-Month Revenue Forecast Chart - 8 cols */}
            <Card className="lg:col-span-8 shadow-sm border border-slate-200 flex flex-col justify-between">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800">
                      Mô Hình Dự Báo Doanh Thu ARIMA 12 Tháng (Actual vs Forecast)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Đường liền: Hợp đồng thực tế ký kết. Đường nét đứt: AI dự báo đỉnh doanh thu T8 - T12/2026.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-blue-600">
                      <span className="h-3 w-3 rounded-full bg-blue-600 inline-block" /> Thực tế
                    </span>
                    <span className="flex items-center gap-1.5 text-indigo-500">
                      <span className="h-3 w-3 border-2 border-dashed border-indigo-400 rounded-sm inline-block" /> Dự báo AI
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={FORECAST_DATA} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v} Tỷ`} domain={[2000, 8500]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '12px' }}
                        formatter={(val: any, name: any) => [`${val} Tỷ VNĐ`, name === 'actual' ? 'Doanh Thu Thực Tế' : 'Dự Báo AI ARIMA']}
                      />
                      <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="forecast" stroke="#818cf8" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#fff' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs text-blue-900">
                  <span className="font-medium">
                    🎯 Kịch bản cơ sở: Doanh thu cả năm 2026 ước đạt <strong className="font-bold">62,800 Tỷ VNĐ</strong> (+28.4% YoY).
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setShowWhatIfModal(true)}
                    className="border-blue-300 text-blue-700 bg-white hover:bg-blue-100 font-bold text-xs h-7"
                  >
                    Mô Phỏng Kịch Bản
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Project & Payment Methods - 4 cols */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Project Share */}
              <Card className="shadow-sm border border-slate-200">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                  <CardTitle className="text-base font-bold text-slate-800">
                    Cơ Cấu Doanh Số Theo Dự Án
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {PROJECT_REVENUE_DATA.map((p, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span className="truncate max-w-[170px]">{p.name}</span>
                        <span>{p.revenue} Tỷ ({p.share})</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: p.share, backgroundColor: p.fill }} 
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="shadow-sm border border-slate-200">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                  <CardTitle className="text-base font-bold text-slate-800">
                    Phương Thức Thanh Toán Khách Chọn
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {PAYMENT_METHOD_DATA.map((pm, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${pm.color}`} />
                        <span className="font-medium text-slate-700">{pm.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">{pm.pct}%</span>
                    </div>
                  ))}
                  <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-medium">
                    💡 Khách hàng chuộng đòn bẩy tài chính ngân hàng ân hạn 0% trong 24 tháng đầu.
                  </p>
                </CardContent>
              </Card>

            </div>

          </div>
        </TabsContent>

        {/* ========================================================
            TAB 2: PHỄU BÁN HÀNG & NÚT THẮT (SALES FUNNEL)
        ======================================================== */}
        <TabsContent value="funnel" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 6-Stage Funnel Visual - 7 cols */}
            <Card className="lg:col-span-7 shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800">
                      Phễu Chuyển Đổi Bất Động Sản Toàn Trình (6 Giai Đoạn)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Theo dõi số lượng khách hàng qua từng điểm chạm từ Inbound Lead đến Ký Hợp Đồng.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-200 font-bold">
                    Tỷ lệ chốt: {overallConversion}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                {FUNNEL_DATA.map((stage, idx) => {
                  const widthPct = Math.max(20, Math.round((stage.count / totalLeads) * 100))

                  return (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 transition-all bg-slate-50/50">
                      <div className="flex justify-between items-center mb-1.5 text-xs">
                        <span className="font-bold text-slate-800">{stage.step}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">{stage.count.toLocaleString()}</span>
                          <span className="text-[11px] font-bold text-slate-500">({stage.rate})</span>
                          {idx > 0 && (
                            <Badge variant="destructive" className="text-[10px] py-0 px-1.5">
                              {stage.drop}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${widthPct}%`, backgroundColor: stage.fill }} 
                        />
                      </div>
                    </div>
                  )
                })}

                <div className="pt-4 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Tốc độ phễu: Trung bình 14.2 ngày để chốt 1 hợp đồng.</span>
                  <Button 
                    size="sm" 
                    onClick={() => setShowBottleneckModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    Mổ Xẻ Nút Thắt Chi Tiết
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bottlenecks Deep-Dive Cards - 5 cols */}
            <div className="lg:col-span-5 space-y-4">
              
              <Card className="shadow-sm border border-rose-200 bg-rose-50/30">
                <CardHeader className="pb-3 border-b border-rose-100">
                  <CardTitle className="text-sm font-bold text-rose-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600" /> Nút Thắt 1: Rớt Khách Sau Xem Sa Bàn (-42.8%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 text-xs text-rose-950 space-y-2">
                  <p className="leading-relaxed">
                    Có <strong>640 lượt khách ghé thăm</strong> nhưng chỉ có <strong>280 khách đặt Booking</strong>. Khảo sát cho thấy khách chưa an tâm về tiến độ hoàn thiện đường ven sông.
                  </p>
                  <div className="p-2.5 bg-white/80 rounded-lg border border-rose-200 text-rose-900 font-semibold">
                    💡 <strong>Hành động khắc phục:</strong> Chiếu video tiến độ thi công hạ tầng thực tế ngay tại màn hình LED sảnh sa bàn.
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-amber-200 bg-amber-50/30">
                <CardHeader className="pb-3 border-b border-amber-100">
                  <CardTitle className="text-sm font-bold text-amber-800 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" /> Nút Thắt 2: Vướng Hồ Sơ Vay Ngân Hàng (-48.2%)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 text-xs text-amber-950 space-y-2">
                  <p className="leading-relaxed">
                    Có <strong>145 khách cọc</strong> nhưng thời gian ký HĐMB kéo dài do thẩm định thu nhập cá nhân tại Vietcombank & Techcombank mất trung bình <strong>7-10 ngày</strong>.
                  </p>
                  <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200 text-amber-900 font-semibold">
                    💡 <strong>Hành động khắc phục:</strong> Bố trí 2 chuyên viên tín dụng ngân hàng trực cố định tại sàn giao dịch để duyệt sơ bộ trong 2 giờ.
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border border-blue-200 bg-blue-50/30">
                <CardHeader className="pb-3 border-b border-blue-100">
                  <CardTitle className="text-sm font-bold text-blue-800 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" /> Vận Tốc Phản Hồi Ban Đầu (First Response SLA)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 text-xs text-blue-950 space-y-2">
                  <p className="leading-relaxed">
                    Sale gọi lại trong vòng <strong>15 phút</strong> đạt tỷ lệ chốt hẹn xem nhà <strong>48%</strong>. Nếu để trễ trên 2 tiếng, tỷ lệ này sụt giảm xuống dưới <strong>12%</strong>.
                  </p>
                  <div className="p-2.5 bg-white/80 rounded-lg border border-blue-200 text-blue-900 font-semibold">
                    ⚡ <strong>Hệ thống:</strong> Kích hoạt Smart Lead Routing tự động chuyển khách cho chuyên viên khác nếu sau 15 phút chưa gọi điện.
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </TabsContent>

        {/* ========================================================
            TAB 3: DÒNG TIỀN & TỒN KHO DỰ ÁN (CASH FLOW & INVENTORY)
        ======================================================== */}
        <TabsContent value="cashflow" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Cash Flow Schedule Chart - 7 cols */}
            <Card className="lg:col-span-7 shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800">
                      Kế Hoạch Thu Tiền vs Dòng Tiền Thực Tế (Tỷ VNĐ)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Tiến độ thu hồi dòng tiền theo các đợt thanh toán hợp đồng mua bán.
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setShowCashflowDetailModal(true)}
                    className="font-bold text-xs"
                  >
                    Xem Chi Tiết Công Nợ
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={CASH_FLOW_SCHEDULE} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `${v} Tỷ`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', fontSize: '12px' }}
                        formatter={(val: any, name: any) => [`${val} Tỷ VNĐ`, name === 'actualInflow' ? 'Thực Thu' : name === 'plannedInflow' ? 'Kế Hoạch' : 'Phải Thu Tồn Đọng']}
                      />
                      <Bar dataKey="plannedInflow" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Kế Hoạch" />
                      <Bar dataKey="actualInflow" fill="#10b981" radius={[4, 4, 0, 0]} name="Thực Thu" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Khoản phải thu tồn đọng (Accounts Receivable):</span>
                  <Badge className="bg-amber-100 text-amber-800 font-bold border-amber-200">
                    8.4 Tỷ VNĐ (Chờ ngân hàng giải ngân)
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Absorption Matrix - 5 cols */}
            <Card className="lg:col-span-5 shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <CardTitle className="text-base font-bold text-slate-800">
                  Tỷ Lệ Hấp Thụ Giỏ Hàng Dự Án
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Tình trạng giải phóng rổ hàng và thời gian cháy hàng dự kiến.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>The Grand Manhattan (Q1)</span>
                    <span className="text-emerald-600">Hấp thụ 88%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '88%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Còn 12 căn / 100 căn</span>
                    <span>Dự kiến hết: 1.5 tháng</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Aqua City (Đồng Nai)</span>
                    <span className="text-blue-600">Hấp thụ 75%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Còn 85 căn / 340 căn</span>
                    <span>Dự kiến hết: 4.0 tháng</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>The Global City (Thủ Đức)</span>
                    <span className="text-purple-600">Hấp thụ 68%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '68%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Còn 45 căn / 140 căn</span>
                    <span>Dự kiến hết: 3.5 tháng</span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Cảnh báo tồn kho ế ẩm (&gt;90 ngày):</strong> Có 4 căn Penthouse diện tích lớn cần chính sách Flash Deal chiết khấu 3%.
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

        {/* ========================================================
            TAB 4: BẢN ĐỒ NHIỆT TƯƠNG TÁC (HEATMAP & PEAK HOURS)
        ======================================================== */}
        <TabsContent value="heatmap" className="space-y-6 mt-6">
          <Card className="shadow-sm border border-slate-200">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Flame className="h-5 w-5 text-amber-500" /> Bản Đồ Nhiệt Tương Tác Khách Hàng (Customer Activity Heatmap)
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Tần suất phát sinh tương tác (Cuộc gọi, Tin nhắn Zalo, Khách ghé Showroom). Click vào ô để xem số liệu chi tiết.
                  </CardDescription>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    refreshHeatmapData()
                    showToast("Đã mô phỏng làm mới dữ liệu bản đồ nhiệt!")
                  }}
                  className="font-bold text-xs border-slate-300"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1 text-slate-500" /> Làm Mới Heatmap
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <div className="min-w-[650px]">
                  
                  {/* Heatmap Grid Header (Hours) */}
                  <div className="flex ml-14 mb-2">
                    {HOURS.map(hour => (
                      <div key={hour} className="flex-1 text-center text-xs font-bold text-slate-500">
                        {hour}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap Rows (Days) */}
                  <div className="flex flex-col gap-1.5">
                    {DAYS.map(day => (
                      <div key={day} className="flex items-center">
                        <div className="w-14 text-xs font-bold text-slate-700">{day}</div>
                        <div className="flex-1 flex gap-1.5">
                          {biHeatmapData.filter(d => d.day === day).map((cell, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedHeatmapCell(cell)}
                              className={`flex-1 h-9 rounded-md ${getHeatmapColor(cell.value)} font-bold text-[11px] flex items-center justify-center hover:scale-105 hover:ring-2 hover:ring-slate-900 transition-all shadow-sm`}
                              title={`${cell.day} lúc ${cell.hour}: ${cell.value} tương tác`}
                            >
                              {cell.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend & Summary */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                    <div className="text-xs text-slate-500 font-medium">
                      💡 Click vào từng ô số để xem phân tích số cuộc gọi, tin nhắn và lịch trực showroom tương ứng.
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <span>Thấp</span>
                      <div className="flex gap-1">
                        <div className="w-5 h-5 bg-slate-100 rounded border border-slate-200" />
                        <div className="w-5 h-5 bg-yellow-200 rounded" />
                        <div className="w-5 h-5 bg-amber-300 rounded" />
                        <div className="w-5 h-5 bg-orange-400 rounded" />
                        <div className="w-5 h-5 bg-rose-500 rounded" />
                      </div>
                      <span className="text-rose-600">Đỉnh Điểm</span>
                    </div>
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>

          {/* Golden Windows Guide Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="shadow-sm border border-slate-200">
              <CardContent className="p-4 space-y-2">
                <span className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1.5">
                  <PhoneCall className="h-4 w-4" /> Giờ Vàng Telesale Khách Nét
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>09:30 - 11:30</strong> và <strong>15:30 - 17:30</strong> (T3 đến T6). Tỷ lệ bắt máy đạt <strong>78%</strong>, khách có thời gian trao đổi chi tiết về bảng giá.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-slate-200">
              <CardContent className="p-4 space-y-2">
                <span className="text-xs font-bold text-amber-600 uppercase flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" /> Giờ Vàng Đón Khách Showroom
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>Thứ Bảy & Chủ Nhật (09:00 - 16:00)</strong>. Lưu lượng khách tham quan sa bàn đạt đỉnh, đề xuất phân công tối thiểu <strong>12 chuyên viên</strong> trực đón khách.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-slate-200">
              <CardContent className="p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1.5">
                  <Zap className="h-4 w-4" /> Giờ Vàng Chạy Ads Chuyển Đổi
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  <strong>20:00 - 23:00 hàng đêm</strong>. Khách hàng lướt mạng xã hội sau giờ làm việc, chi phí CPL giảm <strong>35%</strong> và tỷ lệ điền form tăng gấp đôi.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>

      {/* ========================================================
          MODAL 1: BỘ LỌC PHÂN TÍCH ĐA CHIỀU (FILTER MODAL)
      ======================================================== */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" /> Bộ Lọc Phân Tích Điều Hành Nâng Cao
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Thiết lập các chiều dữ liệu để tùy biến báo cáo BI.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            <div>
              <Label className="text-xs font-bold text-slate-700">Dự án bất động sản</Label>
              <select 
                value={selectedProject} 
                onChange={e => setSelectedProject(e.target.value)}
                className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="all">Tất cả dự án</option>
                {projects.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Chu kỳ thời gian</Label>
              <select 
                value={selectedPeriod} 
                onChange={e => setSelectedPeriod(e.target.value)}
                className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="m7">Tháng 7/2026 (Hiện tại)</option>
                <option value="q3">Quý 3/2026</option>
                <option value="h1">6 Tháng Đầu Năm 2026</option>
                <option value="fy2026">Cả Năm 2026</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Phân khúc sản phẩm</Label>
              <select 
                value={selectedCategory} 
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="all">Tất cả phân khúc</option>
                <option value="luxury">Căn hộ hạng sang (Luxury)</option>
                <option value="villa">Biệt thự & Dinh thự</option>
                <option value="shophouse">Shophouse thương mại</option>
              </select>
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSelectedProject("all")
                setSelectedPeriod("m7")
                setSelectedCategory("all")
                showToast("Đã khôi phục bộ lọc mặc định!")
                setShowFilterModal(false)
              }}
            >
              Đặt Lại Mặc Định
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                setShowFilterModal(false)
                showToast("Đã áp dụng bộ lọc dữ liệu BI thành công!")
              }} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
            >
              Áp Dụng Bộ Lọc
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 2: MÔ PHỎNG WHAT-IF KỊCH BẢN TĂNG TRƯỞNG
      ======================================================== */}
      <Dialog open={showWhatIfModal} onOpenChange={setShowWhatIfModal}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-purple-700 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-purple-600" /> Trình Mô Phỏng Kịch Bản Tăng Trưởng AI (What-If Analysis)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Điều chỉnh các tham số kinh doanh để AI dự phóng lại doanh thu và số lượng giao dịch chốt mới.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 pt-3">
            {/* Slider 1: Marketing Budget */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Ngân sách Marketing chạy Ads</span>
                <span className="text-blue-600">+{mktBudgetDelta}%</span>
              </div>
              <input 
                type="range" 
                min="-30" 
                max="100" 
                value={mktBudgetDelta}
                onChange={e => setMktBudgetDelta(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-30%</span>
                <span>Chuẩn (0%)</span>
                <span>+100%</span>
              </div>
            </div>

            {/* Slider 2: Discount Policy */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Chính sách chiết khấu mở bán thêm</span>
                <span className="text-amber-600">{discountRate}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="12" 
                value={discountRate}
                onChange={e => setDiscountRate(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Không CK)</span>
                <span>6%</span>
                <span>12% (Kích cầu mạnh)</span>
              </div>
            </div>

            {/* Slider 3: Sales Headcount */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Tuyển thêm chiến binh Sales</span>
                <span className="text-emerald-600">+{salesHeadcount} nhân sự</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={salesHeadcount}
                onChange={e => setSalesHeadcount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0</span>
                <span>+25</span>
                <span>+50</span>
              </div>
            </div>

            {/* Simulation Output Card */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl space-y-3">
              <div className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-purple-600" /> Kết Quả Dự Phóng AI Thời Gian Thực
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-white rounded-lg border border-purple-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Doanh Số Dự Kiến</span>
                  <div className="text-xl font-black text-purple-700 mt-0.5">{simulatedRevenue} TỶ</div>
                  <span className="text-[10px] font-semibold text-emerald-600">
                    +{(parseFloat(simulatedRevenue) - (totalRevenueNum || 128.5)).toFixed(1)} Tỷ tăng thêm
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-purple-100">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Hợp Đồng Chốt Mới</span>
                  <div className="text-xl font-black text-indigo-700 mt-0.5">{simulatedDeals} Deals</div>
                  <span className="text-[10px] font-semibold text-emerald-600">
                    +{simulatedDeals - wonDeals} HĐMB mới
                  </span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-3 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setMktBudgetDelta(25)
                setDiscountRate(5)
                setSalesHeadcount(15)
              }}
            >
              Đặt Lại Mặc Định
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                setShowWhatIfModal(false)
                showToast(`Đã lưu kịch bản mô phỏng doanh số: ${simulatedRevenue} Tỷ VNĐ!`)
              }} 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
            >
              Lưu Kịch Bản Này
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 3: CHI TIẾT NÚT THẮT PHỄU BÁN HÀNG
      ======================================================== */}
      <Dialog open={showBottleneckModal} onOpenChange={setShowBottleneckModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" /> Kế Hoạch Tháo Gỡ Nút Thắt Phễu Bán Hàng
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Biện pháp giải quyết tình trạng rớt khách tại chặng Tham quan sa bàn và Ký cọc.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-800">1. Đẩy nhanh giải ngân ngân hàng</div>
              <p className="text-slate-600 leading-relaxed">
                Hợp tác chiến lược với Vietcombank và MB Bank để cấp chứng thư bảo lãnh cấp tốc trong <strong>48 giờ</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-800">2. Nâng cấp trải nghiệm Sa bàn & VR360</div>
              <p className="text-slate-600 leading-relaxed">
                Trang bị thêm 4 bộ kính thực tế ảo VR xem căn hộ Penthouse tại Showroom để tăng cảm xúc chốt deal.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-800">3. Siết chặt kỷ luật cuộc gọi 15 phút</div>
              <p className="text-slate-600 leading-relaxed">
                Áp dụng quy chế thưởng nóng 500k cho chuyên viên gọi lại khách mới dưới 5 phút và có ghi âm chất lượng cao.
              </p>
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button size="sm" onClick={() => setShowBottleneckModal(false)} className="w-full">
              Đã Hiểu & Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 4: LỊCH TRÌNH DÒNG TIỀN & THU CÔNG NỢ
      ======================================================== */}
      <Dialog open={showCashflowDetailModal} onOpenChange={setShowCashflowDetailModal}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" /> Kế Hoạch Thu Hồi Công Nợ & Tiến Độ Đợt HĐMB
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Chi tiết các đợt thanh toán chuẩn bị đáo hạn trong 60 ngày tới.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-3 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex justify-between items-center">
              <div>
                <strong className="text-emerald-900 font-bold block">Tổng tiền dự kiến thu đợt T8/2026</strong>
                <span className="text-emerald-700">88.0 Tỷ VNĐ (Bao gồm giải ngân Vietcombank)</span>
              </div>
              <Badge className="bg-emerald-600 text-white font-bold">Đúng Hạn</Badge>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              <div className="p-3 flex justify-between items-center bg-slate-50 font-bold text-slate-700">
                <span>Mã Hợp Đồng / Khách</span>
                <span>Giá Trị Đợt Thu</span>
                <span>Hạn Thu</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span>HDMB-TGM-08.02 (Nguyễn Văn A)</span>
                <span className="font-bold text-slate-900">2.94 Tỷ (Đợt 2)</span>
                <span className="text-slate-500">15/08/2026</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span>HDMB-AQUA-NVW-01 (Trần Thị B)</span>
                <span className="font-bold text-slate-900">4.50 Tỷ (Đợt 3)</span>
                <span className="text-slate-500">20/08/2026</span>
              </div>
              <div className="p-3 flex justify-between items-center">
                <span>HDMB-TGC-SH-05 (Hoàng Minh Tuấn)</span>
                <span className="font-bold text-slate-900">8.20 Tỷ (Đợt 1)</span>
                <span className="text-slate-500">25/08/2026</span>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button size="sm" onClick={() => setShowCashflowDetailModal(false)} className="w-full">
              Đóng Lịch Trình
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 5: CHI TIẾT Ô NHIỆT HEATMAP ĐÃ CHỌN
      ======================================================== */}
      <Dialog open={!!selectedHeatmapCell} onOpenChange={(open) => !open && setSelectedHeatmapCell(null)}>
        <DialogContent className="max-w-sm bg-white text-center">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
              <Flame className="h-5 w-5 text-amber-500" /> Chi Tiết Tương Tác Khung Giờ
            </DialogTitle>
          </DialogHeader>

          {selectedHeatmapCell && (
            <div className="py-4 space-y-3">
              <div className="text-sm font-bold text-slate-600">
                Thứ: <strong className="text-slate-900">{selectedHeatmapCell.day}</strong> • Khung giờ: <strong className="text-slate-900">{selectedHeatmapCell.hour}</strong>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="text-xs uppercase font-bold text-amber-700">Điểm Lưu Lượng Tương Tác</span>
                <div className="text-4xl font-black text-amber-900 mt-1">{selectedHeatmapCell.value}</div>
                <span className="text-xs font-semibold text-amber-800">
                  {selectedHeatmapCell.value > 60 ? '🔥 Khung Giờ Vàng (Peak Activity)' : 'Bình thường'}
                </span>
              </div>

              <div className="text-xs text-slate-600 text-left space-y-1.5 pt-2">
                <div className="flex justify-between">
                  <span>Cuộc gọi tư vấn:</span>
                  <strong className="text-slate-800">{Math.round(selectedHeatmapCell.value * 0.45)} cuộc</strong>
                </div>
                <div className="flex justify-between">
                  <span>Tin nhắn Zalo OA:</span>
                  <strong className="text-slate-800">{Math.round(selectedHeatmapCell.value * 0.35)} tin</strong>
                </div>
                <div className="flex justify-between">
                  <span>Khách ghé Showroom:</span>
                  <strong className="text-slate-800">{Math.round(selectedHeatmapCell.value * 0.2)} lượt</strong>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-3">
            <Button size="sm" onClick={() => setSelectedHeatmapCell(null)} className="w-full">
              Đóng Chi Tiết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
