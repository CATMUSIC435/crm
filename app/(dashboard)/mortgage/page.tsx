"use client"
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Calculator, Landmark, Building, Calendar, PiggyBank, CircleDollarSign, 
  Info, ArrowRight, CheckCircle2, TrendingUp, Percent, ShieldCheck, 
  Download, Share2, FileDown, FileText, ChevronRight, X, Sparkles, 
  AlertTriangle, Wallet, CreditCard, BarChart4, Copy, Check, Eye,
  Trash2, RefreshCw, Layers, Clock, FileSpreadsheet, Send, SlidersHorizontal,
  ExternalLink, HelpCircle, CheckCheck
} from 'lucide-react'
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { useStore } from '@/store/useStore'
import { MortgageSimulation } from '@/types'
import Link from 'next/link'

interface PartnerBank {
  id: string
  name: string
  shortName: string
  logo: string
  badgeColor: string
  promoRate: number
  postPromoRate: number
  promoPeriodMonths: number
  maxLoanPercent: number
  maxTermYears: number
  gracePeriodMonths: number
  prepaymentPenalty: string
  appraisalTimeHours: number
  features: string[]
  description: string
}

const PARTNER_BANKS: PartnerBank[] = [
  {
    id: 'mbb',
    name: 'Ngân hàng TMCP Quân Đội (MBBank)',
    shortName: 'MBBank',
    logo: 'MB',
    badgeColor: 'bg-blue-600',
    promoRate: 0.0,
    postPromoRate: 9.2,
    promoPeriodMonths: 24,
    maxLoanPercent: 75,
    maxTermYears: 25,
    gracePeriodMonths: 24,
    prepaymentPenalty: 'Miễn phí sau năm thứ 3 (Năm 1: 1.5%, Năm 2: 1.0%, Năm 3: 0.5%)',
    appraisalTimeHours: 4,
    features: ['Hỗ trợ 0% lãi suất 24 tháng', 'Ân hạn nợ gốc 24 tháng', 'Duyệt hồ sơ siêu tốc 4 giờ'],
    description: 'Đối tác chiến lược toàn diện cho đại đô thị Aqua City, cam kết giải ngân bảo lãnh nhanh chóng.'
  },
  {
    id: 'vpb',
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)',
    shortName: 'VPBank',
    logo: 'VPB',
    badgeColor: 'bg-emerald-600',
    promoRate: 0.0,
    postPromoRate: 8.9,
    promoPeriodMonths: 18,
    maxLoanPercent: 80,
    maxTermYears: 30,
    gracePeriodMonths: 18,
    prepaymentPenalty: '1.0% trong 2 năm đầu, miễn phí từ năm thứ 4',
    appraisalTimeHours: 8,
    features: ['Cho vay lên đến 80% giá trị', 'Thời hạn vay kéo dài 30 năm', 'Chứng minh thu nhập linh hoạt'],
    description: 'Tỷ lệ giải ngân cao nhất thị trường lên đến 80%, chấp nhận nguồn thu kinh doanh tự do.'
  },
  {
    id: 'tcb',
    name: 'Ngân hàng TMCP Kỹ Thương (Techcombank)',
    shortName: 'Techcombank',
    logo: 'TCB',
    badgeColor: 'bg-red-600',
    promoRate: 7.5,
    postPromoRate: 9.5,
    promoPeriodMonths: 36,
    maxLoanPercent: 70,
    maxTermYears: 25,
    gracePeriodMonths: 12,
    prepaymentPenalty: 'Miễn phí từ năm thứ 4 (Năm 1-2: 1.5%, Năm 3: 0.5%)',
    appraisalTimeHours: 6,
    features: ['Cố định lãi suất 7.5% trong 3 năm', 'Bảo lãnh tiến độ dự án Masterise', 'Thủ tục online qua App'],
    description: 'Gói lãi suất cố định 3 năm an tâm tuyệt đối, quy trình thẩm định số hóa phê duyệt tức thì.'
  },
  {
    id: 'vcb',
    name: 'Ngân hàng TMCP Ngoại Thương (Vietcombank)',
    shortName: 'Vietcombank',
    logo: 'VCB',
    badgeColor: 'bg-green-700',
    promoRate: 6.5,
    postPromoRate: 8.5,
    promoPeriodMonths: 24,
    maxLoanPercent: 70,
    maxTermYears: 20,
    gracePeriodMonths: 12,
    prepaymentPenalty: '0.5% trong 3 năm đầu, miễn phí từ năm thứ 4',
    appraisalTimeHours: 24,
    features: ['Lãi suất sau ưu đãi thấp nhất thị trường (8.5%)', 'Biên độ thả nổi chỉ 2.8%', 'Thương hiệu quốc doanh uy tín'],
    description: 'Thương hiệu Big 4 an toàn tuyệt đối, biên độ lãi suất thả nổi thấp nhất thị trường tài chính.'
  }
]

export default function MortgagePage() {
  const inventory = useStore(state => state.inventory)
  const customers = useStore(state => state.customers)
  const savedMortgageSimulations = useStore(state => state.savedMortgageSimulations)
  const saveMortgageSimulation = useStore(state => state.saveMortgageSimulation)
  const deleteMortgageSimulation = useStore(state => state.deleteMortgageSimulation)

  const availableInventory = inventory.filter(i => i.status === 'Trống' || i.status === 'Booking')

  // Selected Unit & Parameters
  const [selectedItemId, setSelectedItemId] = useState<string>('')
  const [propertyValue, setPropertyValue] = useState<number>(18500000000) // 18.5 Tỷ VNĐ default
  const [loanPercent, setLoanPercent] = useState<number>(70)
  const [loanTermYears, setLoanTermYears] = useState<number>(25)
  const [selectedBank, setSelectedBank] = useState<PartnerBank>(PARTNER_BANKS[0])
  const [repaymentMethod, setRepaymentMethod] = useState<'reducing' | 'linear'>('reducing')
  const [enableGracePeriod, setEnableGracePeriod] = useState<boolean>(true)
  const [monthlyIncome, setMonthlyIncome] = useState<number>(180000000) // Thu nhập 180Tr/tháng
  
  // Rental & Investment Analysis State
  const [estimatedMonthlyRent, setEstimatedMonthlyRent] = useState<number>(55000000) // 55Tr/tháng
  const [occupancyRate, setOccupancyRate] = useState<number>(85) // 85%
  const [annualCapitalGrowth, setAnnualCapitalGrowth] = useState<number>(15) // +15%/năm

  // Active view tab
  const [activeTab, setActiveTab] = useState<'amortization' | 'investment' | 'saved_plans'>('amortization')

  // Modals state
  const [exportModalOpen, setExportModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [showFullAmortizationModal, setShowFullAmortizationModal] = useState(false)
  const [showBankCompareModal, setShowBankCompareModal] = useState(false)
  const [showPrepaymentModal, setShowPrepaymentModal] = useState(false)

  // Filter state for Full Amortization Modal
  const [filterScheduleYear, setFilterScheduleYear] = useState<string>('all')

  // Prepayment Simulator state
  const [prepayYear, setPrepayYear] = useState<number>(3)

  // Save Modal Form State
  const [selectedCustomerIdForSave, setSelectedCustomerIdForSave] = useState<string>(customers[0]?.id || '')
  const [customPlanNote, setCustomPlanNote] = useState<string>('Gói vay tối ưu 70% nhận nhà kinh doanh')

  // Zalo template state
  const [zaloTemplate, setZaloTemplate] = useState<'compact' | 'cashflow' | 'roi'>('compact')

  // Toast Feedbacks
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // Handle inventory selection
  const handleSelectProperty = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelectedItemId(id)
    if (id) {
      const item = availableInventory.find(i => i.id === id)
      if (item) {
        setPropertyValue(item.price)
        // Heuristic rental estimate ~ 0.3% - 0.4% property value per month
        const estRent = Math.round((item.price * 0.0035) / 1000000) * 1000000
        setEstimatedMonthlyRent(estRent)
        showToast(`Đã đồng bộ giá niêm yết căn [${item.code}] - ${formatVND(item.price)}`)
      }
    }
  }

  // Financial Calculations
  const loanAmount = (propertyValue * loanPercent) / 100
  const equityAmount = propertyValue - loanAmount
  const totalMonths = loanTermYears * 12
  const graceMonths = enableGracePeriod ? selectedBank.gracePeriodMonths : 0

  // Amortization Schedule Calculation
  const schedule = useMemo(() => {
    const results = []
    let remainingPrincipal = loanAmount

    // Months left for principal repayment after grace period
    const principalPayingMonths = totalMonths - graceMonths

    for (let month = 1; month <= totalMonths; month++) {
      const isGrace = month <= graceMonths
      
      // Determine active interest rate for current month
      const isPromoPeriod = month <= selectedBank.promoPeriodMonths
      const currentAnnualRate = isPromoPeriod ? selectedBank.promoRate : selectedBank.postPromoRate
      const monthlyRate = (currentAnnualRate / 100) / 12

      // Monthly Interest
      const interest = remainingPrincipal * monthlyRate

      // Monthly Principal
      let principal = 0
      if (!isGrace && principalPayingMonths > 0) {
        if (repaymentMethod === 'reducing') {
          principal = loanAmount / principalPayingMonths
        } else {
          // Equal installment formula (Niên Kim Cố Định PMT)
          const pmt = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, principalPayingMonths)) / 
                      (Math.pow(1 + monthlyRate, principalPayingMonths) - 1)
          principal = Math.max(0, pmt - interest)
        }
      }

      // Clamp principal to remaining
      principal = Math.min(principal, remainingPrincipal)
      const totalPayment = principal + interest
      remainingPrincipal = Math.max(0, remainingPrincipal - principal)

      results.push({
        month,
        year: Math.ceil(month / 12),
        isGrace,
        interestRate: currentAnnualRate,
        principal,
        interest,
        totalPayment,
        remainingPrincipal
      })
    }

    return results
  }, [loanAmount, totalMonths, graceMonths, selectedBank, repaymentMethod, enableGracePeriod])

  // Summary Metrics
  const totalInterestPaid = useMemo(() => {
    return schedule.reduce((sum, item) => sum + item.interest, 0)
  }, [schedule])

  // First month payment after grace period (highest monthly stress)
  const firstPayingMonthPayment = useMemo(() => {
    const firstPay = schedule.find(s => !s.isGrace)
    return firstPay?.totalPayment || schedule[0]?.totalPayment || 0
  }, [schedule])

  // Debt-to-Income (DTI) Ratio
  const dtiRatio = useMemo(() => {
    if (monthlyIncome <= 0) return 0
    return ((firstPayingMonthPayment / monthlyIncome) * 100).toFixed(1)
  }, [firstPayingMonthPayment, monthlyIncome])

  // Investment Analysis
  const annualGrossRental = (estimatedMonthlyRent * 12 * occupancyRate) / 100
  const annualOperatingExpenses = annualGrossRental * 0.10 // 10% management & maintenance
  const annualNetRental = annualGrossRental - annualOperatingExpenses
  const netRentalYield = ((annualNetRental / propertyValue) * 100).toFixed(2)
  const totalAnnualReturn = (Number(netRentalYield) + annualCapitalGrowth).toFixed(1)
  const paybackPeriodYears = (propertyValue / (annualNetRental + (propertyValue * (annualCapitalGrowth / 100)))).toFixed(1)

  // Chart Data: Yearly aggregated debt and payments
  const chartData = useMemo(() => {
    const yearly = []
    for (let yr = 1; yr <= loanTermYears; yr++) {
      const yearMonths = schedule.filter(s => s.year === yr)
      const endYearState = yearMonths[yearMonths.length - 1]
      const yearInterest = yearMonths.reduce((sum, s) => sum + s.interest, 0)
      const yearPrincipal = yearMonths.reduce((sum, s) => sum + s.principal, 0)

      yearly.push({
        year: `Năm ${yr}`,
        remaining: Math.round((endYearState?.remainingPrincipal || 0) / 1e6),
        principalPaid: Math.round(yearPrincipal / 1e6),
        interestPaid: Math.round(yearInterest / 1e6),
        totalAnnualPayment: Math.round((yearPrincipal + yearInterest) / 1e6)
      })
    }
    return yearly
  }, [schedule, loanTermYears])

  // Format currency
  const formatVND = (value: number) => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)} Tỷ VNĐ`
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)} Triệu VNĐ`
    return `${Math.round(value).toLocaleString('vi-VN')} VNĐ`
  }

  // Prepayment Simulator Calculations
  const prepaymentAnalysis = useMemo(() => {
    const targetMonth = prepayYear * 12
    const stateAtTarget = schedule.find(s => s.month === targetMonth) || schedule[schedule.length - 1]
    const remainingPrincipalAtTarget = stateAtTarget ? stateAtTarget.remainingPrincipal : 0

    // Penalty rate logic based on partner bank
    let penaltyRate = 0
    if (prepayYear === 1) penaltyRate = 1.5
    else if (prepayYear === 2) penaltyRate = 1.0
    else if (prepayYear === 3) penaltyRate = 0.5
    else penaltyRate = 0.0

    // Specific bank override
    if (selectedBank.id === 'vpb' && prepayYear <= 2) penaltyRate = 1.0
    if (selectedBank.id === 'tcb' && prepayYear >= 4) penaltyRate = 0.0
    if (selectedBank.id === 'vcb' && prepayYear <= 3) penaltyRate = 0.5

    const penaltyFee = (remainingPrincipalAtTarget * penaltyRate) / 100
    const totalPayoffRequired = remainingPrincipalAtTarget + penaltyFee

    // Interest paid until target month
    const interestPaidSoFar = schedule
      .filter(s => s.month <= targetMonth)
      .reduce((sum, s) => sum + s.interest, 0)

    // Interest saved by prepaying instead of carrying loan to full term
    const interestSaved = Math.max(0, totalInterestPaid - interestPaidSoFar)

    return {
      targetMonth,
      remainingPrincipalAtTarget,
      penaltyRate,
      penaltyFee,
      totalPayoffRequired,
      interestPaidSoFar,
      interestSaved
    }
  }, [prepayYear, schedule, selectedBank, totalInterestPaid])

  // Export full schedule to UTF-8 BOM CSV
  const handleExportCSV = () => {
    const headers = [
      'Kỳ Tháng',
      'Năm',
      'Chính Sách Lãi Suất',
      'Lãi Suất Áp Dụng (%/Năm)',
      'Tiền Gốc Phải Trả (VNĐ)',
      'Tiền Lãi Phải Trả (VNĐ)',
      'Tổng Thanh Toán / Tháng (VNĐ)',
      'Dư Nợ Gốc Còn Lại (VNĐ)'
    ]

    const rows = schedule.map(s => [
      `Tháng ${s.month}`,
      `Năm ${s.year}`,
      s.isGrace ? 'Ân hạn 0% LS CĐT' : 'Lãi suất thương mại',
      `${s.interestRate}%`,
      Math.round(s.principal),
      Math.round(s.interest),
      Math.round(s.totalPayment),
      Math.round(s.remainingPrincipal)
    ])

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `Lich_Khau_Hao_${selectedBank.shortName}_${loanTermYears}Nam_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã tải xuống bảng khấu hao đầy đủ (UTF-8 BOM CSV)!')
  }

  // Handle Save Plan to Store
  const handleConfirmSaveSimulation = () => {
    const customer = customers.find(c => c.id === selectedCustomerIdForSave)
    const propCode = selectedItemId ? availableInventory.find(i => i.id === selectedItemId)?.code : 'CĂN-TÙY-CHỌN'
    
    saveMortgageSimulation({
      customerId: selectedCustomerIdForSave,
      customerName: customer ? customer.name : 'Khách Hàng VIP',
      propertyCode: propCode,
      propertyValue,
      loanPercent,
      loanAmount,
      loanTermYears,
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      repaymentMethod,
      enableGracePeriod,
      graceMonths,
      monthlyIncome,
      dtiRatio: Number(dtiRatio),
      totalInterest: totalInterestPaid,
      firstMonthlyPayment: firstPayingMonthPayment,
      notes: customPlanNote
    })

    const token = typeof window !== 'undefined' ? localStorage.getItem('nova_auth_token') || '' : ''
    fetch('/backend-api/mortgage/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify({
        customerId: selectedCustomerIdForSave,
        propertyPrice: propertyValue,
        loanPercent,
        loanTermMonths: loanTermYears * 12,
        annualInterestRate: selectedBank.promoRate || selectedBank.postPromoRate,
        gracePeriodMonths: graceMonths,
        monthlyIncome,
        calculationMethod: repaymentMethod === 'reducing' ? 'DECREASING' : 'ANNUITY'
      })
    }).catch(() => {})

    setExportModalOpen(false)
    showToast(`Đã lưu phương án tài chính cho khách hàng ${customer ? customer.name : 'VIP'}!`)
  }

  // Load a saved plan into the calculator
  const handleLoadSimulation = (sim: MortgageSimulation) => {
    setPropertyValue(sim.propertyValue)
    setLoanPercent(sim.loanPercent)
    setLoanTermYears(sim.loanTermYears)
    const bank = PARTNER_BANKS.find(b => b.id === sim.bankId) || PARTNER_BANKS[0]
    setSelectedBank(bank)
    setRepaymentMethod(sim.repaymentMethod)
    setEnableGracePeriod(sim.enableGracePeriod)
    setMonthlyIncome(sim.monthlyIncome)
    
    if (sim.propertyCode) {
      const match = availableInventory.find(i => i.code === sim.propertyCode)
      if (match) setSelectedItemId(match.id)
    }

    setActiveTab('amortization')
    showToast(`Đã tải lại phương án [${sim.id}] của ${sim.customerName || 'Khách hàng'}`)
  }

  // Filtered schedule for full amortization modal
  const filteredSchedule = useMemo(() => {
    if (filterScheduleYear === 'all') return schedule
    const yr = Number(filterScheduleYear)
    return schedule.filter(s => s.year === yr)
  }, [schedule, filterScheduleYear])

  // Generate Zalo Text content based on template
  const zaloShareContent = useMemo(() => {
    const propCode = selectedItemId ? availableInventory.find(i => i.id === selectedItemId)?.code : 'Sản Phẩm Đẳng Cấp'
    if (zaloTemplate === 'compact') {
      return `[KÍNH GỬI QUÝ KHÁCH HÀNG VIP - PHƯƠNG ÁN TÀI CHÍNH TỐI ƯU]
-----------------------------------------
• Dự án / Căn hộ: ${propCode}
• Giá trị niêm yết: ${formatVND(propertyValue)}
• Vốn tự có chuẩn bị (30%): ${formatVND(equityAmount)}
• Ngân hàng giải ngân: ${selectedBank.shortName} (${loanPercent}% - ${loanTermYears} năm)
• ĐẶC QUYỀN CĐT: 0% Lãi suất & Ân hạn gốc ${graceMonths} tháng
• Trả hàng tháng sau ân hạn: ~${formatVND(firstPayingMonthPayment)}/tháng
-----------------------------------------
Dự kiến bàn giao quý 4/2026, hỗ trợ hồ sơ thủ tục phê duyệt trong 4 giờ.`
    }

    if (zaloTemplate === 'cashflow') {
      return `[BẢNG TÍNH ĐÒN BẨY & DÒNG TIỀN CHO THUÊ BÙ ĐẮP LÃI VAY]
-----------------------------------------
• Tài sản đầu tư: ${propCode} (${formatVND(propertyValue)})
• Vốn ban đầu (30%): ${formatVND(equityAmount)}
• Giá thuê ước tính: ${formatVND(estimatedMonthlyRent)}/tháng (~${netRentalYield}%/năm)
• 24 Tháng đầu: Lãi 0đ + Gốc 0đ => Thu về ${formatVND(annualNetRental * 2)} dòng tiền ròng!
• Từ năm thứ 3: Tiền thuê bù đắp hơn 60% nghĩa vụ trả nợ ngân hàng.
• Tỷ lệ nợ/thu nhập (DTI): ${dtiRatio}% (Ngưỡng an toàn tuyệt đối).`
    }

    return `[PHÂN TÍCH TỔNG LỢI NHUẬN ĐẦU TƯ TÍCH SẢN BĐS 5 NĂM]
-----------------------------------------
• Bất động sản: ${propCode} (${formatVND(propertyValue)})
• Tăng giá vốn dự kiến: +${annualCapitalGrowth}%/năm
• Tỷ suất cho thuê ròng: ${netRentalYield}%/năm
• TỔNG SINH LỜI TRUNG BÌNH: +${totalAnnualReturn}%/NĂM
• Thời gian hoàn vốn: ~${paybackPeriodYears} năm
• Đối tác bảo lãnh: ${selectedBank.name} (Phí trả nợ trước hạn: ${selectedBank.prepaymentPenalty})`
  }, [
    zaloTemplate, selectedItemId, availableInventory, propertyValue, equityAmount, 
    selectedBank, loanPercent, loanTermYears, graceMonths, firstPayingMonthPayment,
    estimatedMonthlyRent, netRentalYield, annualNetRental, dtiRatio, annualCapitalGrowth,
    totalAnnualReturn, paybackPeriodYears
  ])

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      
      {/* 1. Header with Strategic Finance Metrics & Zero Dead Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Calculator className="h-6 w-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Bảng Tính Lãi Vay & Dòng Tiền Đầu Tư BĐS
            </h1>
            <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
              4 Ngân Hàng 0% LS CĐT
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Mô phỏng khấu hao dư nợ giảm dần, chính sách ân hạn 24 tháng, DTI, tất toán trước hạn và dòng tiền cho thuê (Rental Yield).
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowBankCompareModal(true)}
            className="flex-1 sm:flex-initial border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold gap-1.5 cursor-pointer"
          >
            <Landmark className="h-4 w-4 text-indigo-600" />
            So Sánh 4 Ngân Hàng
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPrepaymentModal(true)}
            className="flex-1 sm:flex-initial border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold gap-1.5 cursor-pointer"
          >
            <PiggyBank className="h-4 w-4 text-amber-600" />
            Trả Nợ Trước Hạn
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShareModalOpen(true)}
            className="flex-1 sm:flex-initial border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 hover:bg-indigo-50 font-semibold gap-1.5 cursor-pointer"
          >
            <Share2 className="h-4 w-4" />
            Tư Vấn Zalo VIP
          </Button>

          <Button 
            size="sm"
            onClick={() => setExportModalOpen(true)}
            className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5 shadow-sm cursor-pointer"
          >
            <FileDown className="h-4 w-4" />
            Lưu / Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Macro Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gói Vay Ưu Đãi CĐT</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {enableGracePeriod ? `${selectedBank.promoRate}% Lãi Suất` : `${selectedBank.postPromoRate}% Thả Nổi`}
            </div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> 
              {enableGracePeriod ? `Ân hạn gốc ${graceMonths} tháng` : 'Trả gốc từ tháng đầu'}
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-2xl">
            <CreditCard className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tỷ Suất Cho Thuê Ròng</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{netRentalYield}% / Năm</div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              Giá thuê: {formatVND(estimatedMonthlyRent)}/tháng
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-2xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tổng Sinh Lời Hàng Năm</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">+{totalAnnualReturn}% / Năm</div>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
              Dòng tiền thuê + Tăng giá vốn
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-2xl">
            <CircleDollarSign className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Thời Gian Hoàn Vốn</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{paybackPeriodYears} Năm</div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
              Hoàn vốn tích sản an toàn
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-2xl">
            <Calendar className="h-6 w-6" />
          </div>
        </Card>
      </div>

      {/* 3. Main Workspace: Inputs & Bank Selection (Left 5 cols) vs Analysis Charts/Tables (Right 7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        
        {/* LEFT COLUMN: PARAMETERS & BANK SELECTION (5/12) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Card 1: Realtime Inventory Integration */}
          <Card className="shadow-xs border border-indigo-100 dark:border-indigo-900/50 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
            <CardHeader className="bg-indigo-50/60 dark:bg-indigo-950/40 p-4 border-b">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-indigo-900 dark:text-indigo-200">
                <span className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-indigo-600" />
                  Liên Kết Rổ Hàng Realtime
                </span>
                <Badge variant="outline" className="text-[10px] bg-white dark:bg-slate-900 text-indigo-600 border-indigo-200">
                  {availableInventory.length} Căn khả dụng
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Chọn sản phẩm mở bán để tự động đồng bộ giá niêm yết
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <select 
                value={selectedItemId}
                onChange={handleSelectProperty}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">-- Chọn Căn Hộ Mở Bán Trong Rổ Hàng --</option>
                {availableInventory.map(item => (
                  <option key={item.id} value={item.id}>
                    [{item.code}] {item.type} - {formatVND(item.price)}
                  </option>
                ))}
              </select>

              {selectedItemId ? (
                <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Căn được chọn:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {availableInventory.find(i => i.id === selectedItemId)?.code} - {availableInventory.find(i => i.id === selectedItemId)?.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Giá niêm yết:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{formatVND(propertyValue)}</span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">
                  * Hoặc kéo thanh trượt bên dưới để tự điều chỉnh giá trị bất động sản theo nhu cầu.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 2: Loan Parameters & Method Switcher */}
          <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900">
            <CardHeader className="p-4 pb-2 border-b bg-slate-50/50 dark:bg-slate-900/50">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-indigo-600" />
                  Thông Số Khoản Vay Ngân Hàng
                </span>
                <span className="text-xs text-slate-400 font-normal">Thời hạn tối đa 30 năm</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4 text-xs">
              
              {/* Repayment Method Switcher */}
              <div className="space-y-1.5">
                <Label className="text-slate-600 dark:text-slate-300 font-semibold text-xs">Phương Thức Tính Nợ:</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRepaymentMethod('reducing')
                      showToast('Đã chọn: Dư nợ giảm dần (Tiền lãi giảm theo từng tháng)')
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border text-xs cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                      repaymentMethod === 'reducing'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Dư Nợ Giảm Dần</span>
                    <span className="text-[10px] opacity-80 font-normal">Gốc cố định + Lãi giảm dần</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRepaymentMethod('linear')
                      showToast('Đã chọn: Niên kim cố định (Số tiền trả đều mỗi tháng)')
                    }}
                    className={`py-2 px-3 rounded-xl font-bold border text-xs cursor-pointer transition-all text-center flex flex-col items-center justify-center ${
                      repaymentMethod === 'linear'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>Niên Kim Cố Định (PMT)</span>
                    <span className="text-[10px] opacity-80 font-normal">Trả đều đặn cả gốc và lãi</span>
                  </button>
                </div>
              </div>

              {/* Property Value Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Giá Trị Bất Động Sản:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{formatVND(propertyValue)}</span>
                </div>
                <Input 
                  type="range" min={3000000000} max={50000000000} step={500000000}
                  value={propertyValue} 
                  onChange={e => { setPropertyValue(Number(e.target.value)); setSelectedItemId("") }}
                  className="accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              {/* Loan Percentage */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Tỷ Lệ Vay Vốn (%):</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{loanPercent}% ({formatVND(loanAmount)})</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[50, 70, 75, 80].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setLoanPercent(pct)}
                      className={`py-1.5 rounded-lg font-bold border text-xs cursor-pointer transition-all ${
                        loanPercent === pct 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Loan Term Years */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Thời Hạn Vay Vốn:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{loanTermYears} Năm ({totalMonths} Tháng)</span>
                </div>
                <Input 
                  type="range" min={5} max={30} step={1}
                  value={loanTermYears} 
                  onChange={e => setLoanTermYears(Number(e.target.value))}
                  className="accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5 Năm</span>
                  <span>15 Năm</span>
                  <span>25 Năm</span>
                  <span>30 Năm</span>
                </div>
              </div>

              {/* Developer Promotion: 0% Interest & Grace Period */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-600" />
                    <span className="font-bold text-emerald-900 dark:text-emerald-200">Chính Sách 0% Lãi Suất CĐT</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={enableGracePeriod} 
                    onChange={e => {
                      setEnableGracePeriod(e.target.checked)
                      showToast(e.target.checked ? 'Đã kích hoạt ưu đãi 0% lãi suất CĐT' : 'Đã tắt ưu đãi 0% CĐT')
                    }}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {enableGracePeriod 
                    ? `Áp dụng 0% lãi suất và ân hạn nợ gốc ${selectedBank.gracePeriodMonths} tháng đầu tiên theo chương trình CĐT.` 
                    : 'Bắt đầu trả gốc và lãi ngay từ tháng đầu tiên.'}
                </p>
              </div>

              {/* Customer Monthly Income for DTI */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Thu Nhập Hàng Tháng Của Khách:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatVND(monthlyIncome)}</span>
                </div>
                <Input 
                  type="range" min={50000000} max={500000000} step={10000000}
                  value={monthlyIncome} 
                  onChange={e => setMonthlyIncome(Number(e.target.value))}
                  className="accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Partner Banks Selection */}
          <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="p-4 pb-2 border-b bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Landmark className="h-4 w-4 text-indigo-600" />
                4 Ngân Hàng Đối Tác Chiến Lược
              </CardTitle>
              <button
                onClick={() => setShowBankCompareModal(true)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                So sánh chi tiết &rarr;
              </button>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
              {PARTNER_BANKS.map(bank => {
                const isSelected = selectedBank.id === bank.id
                return (
                  <div 
                    key={bank.id}
                    onClick={() => {
                      setSelectedBank(bank)
                      showToast(`Đã chọn đối tác vay: ${bank.shortName}`)
                    }}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-xs ${bank.badgeColor}`}>
                        {bank.logo}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          {bank.shortName}
                          {isSelected && <Badge className="text-[9px] py-0 px-1 bg-indigo-600 text-white">Đang chọn</Badge>}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{bank.features[0]}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono font-bold text-xs ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {bank.promoRate > 0 ? `${bank.promoRate}%` : '0.0%'} (Ưu đãi)
                      </div>
                      <div className="text-[10px] text-slate-400">Thả nổi: {bank.postPromoRate}%</div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: FINANCIAL ANALYSIS & INVESTMENT PERFORMANCE (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* 4 Highlight Stress-Test Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border shadow-xs">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Vốn Tự Có (Cần Có)</span>
              <div className="text-base font-black text-slate-900 dark:text-white mt-0.5">{formatVND(equityAmount)}</div>
              <span className="text-[10px] text-slate-500">{100 - loanPercent}% giá trị BĐS</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border shadow-xs">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Trả Tháng Cao Nhất</span>
              <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{formatVND(firstPayingMonthPayment)}</div>
              <span className="text-[10px] text-indigo-500">Sau ân hạn {graceMonths} tháng</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border shadow-xs">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Tổng Tiền Lãi Vay</span>
              <div className="text-base font-black text-red-600 dark:text-red-400 mt-0.5">{formatVND(totalInterestPaid)}</div>
              <span className="text-[10px] text-slate-500">Suốt {loanTermYears} năm vay</span>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border shadow-xs">
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">Chỉ Số DTI (Debt/Income)</span>
              <div className="text-base font-black text-emerald-600 mt-0.5">{dtiRatio}%</div>
              <span className="text-[10px] text-emerald-700 font-semibold">An toàn tài chính (&lt; 40%)</span>
            </div>
          </div>

          {/* Analysis View Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('amortization')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'amortization' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border hover:border-indigo-400'
              }`}
            >
              <BarChart4 className="h-3.5 w-3.5" />
              Lịch Trả Nợ & Biểu Đồ Dư Nợ ({loanTermYears} Năm)
            </button>

            <button
              onClick={() => setActiveTab('investment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'investment' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border hover:border-emerald-400'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Hiệu Quả Đầu Tư & Cho Thuê (Rental Yield + ROI)
            </button>

            <button
              onClick={() => setActiveTab('saved_plans')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeTab === 'saved_plans' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border hover:border-purple-400'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Hồ Sơ Vay Đã Lưu ({savedMortgageSimulations.length})
            </button>
          </div>

          {/* TAB 1: AMORTIZATION SCHEDULE & DEBT CHART */}
          {activeTab === 'amortization' && (
            <div className="space-y-4">
              {/* Amortization Chart */}
              <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-slate-900">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white">Mô Phỏng Tiến Trình Giảm Dư Nợ Gốc</h3>
                    <p className="text-[11px] text-slate-500">Dư nợ gốc giảm dần theo từng năm (Đơn vị: Triệu VNĐ)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] text-indigo-600 border-indigo-200">
                      {repaymentMethod === 'reducing' ? 'Dư Nợ Giảm Dần' : 'Niên Kim Cố Định'}
                    </Badge>
                  </div>
                </div>

                <div className="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="debtGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} tickFormatter={v => `${v} Tr`} />
                      <RechartsTooltip 
                        formatter={(val: any) => [`${Number(val).toLocaleString()} Triệu VNĐ`, '']}
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', color: '#fff', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="remaining" name="Dư Nợ Gốc Còn Lại" stroke="#6366f1" strokeWidth={2} fill="url(#debtGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Amortization Table */}
              <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                <div className="p-4 pb-2 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-900/50">
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white">Lịch Trả Nợ Chi Tiết (12 Tháng Đầu Tiên)</h3>
                    <span className="text-[10px] text-slate-500">Đã áp dụng ân hạn {graceMonths} tháng theo {selectedBank.shortName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setShowFullAmortizationModal(true)}
                      className="text-xs font-semibold h-8 text-indigo-600 border-indigo-200 hover:bg-indigo-50 cursor-pointer"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Xem Toàn Bộ {totalMonths} Tháng
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleExportCSV}
                      className="text-xs font-semibold h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50 cursor-pointer"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
                      Tải File CSV
                    </Button>
                  </div>
                </div>
                
                <div className="overflow-x-auto max-h-[300px]">
                  <Table className="text-xs">
                    <TableHeader className="bg-slate-50 dark:bg-slate-800/60 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="w-16">Tháng</TableHead>
                        <TableHead className="text-right">Tiền Gốc</TableHead>
                        <TableHead className="text-right">Tiền Lãi</TableHead>
                        <TableHead className="text-right font-bold text-indigo-600 dark:text-indigo-400">Tổng Trả / Tháng</TableHead>
                        <TableHead className="text-right">Dư Nợ Gốc</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {schedule.slice(0, 12).map((item) => (
                        <TableRow key={item.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <TableCell className="font-bold text-center">
                            {item.month} {item.isGrace && <Badge className="text-[9px] py-0 px-1 bg-emerald-600 text-white ml-1">0% LS</Badge>}
                          </TableCell>
                          <TableCell className="text-right">{formatVND(item.principal)}</TableCell>
                          <TableCell className="text-right text-red-500">{formatVND(item.interest)}</TableCell>
                          <TableCell className="text-right font-bold text-indigo-600 dark:text-indigo-400">{formatVND(item.totalPayment)}</TableCell>
                          <TableCell className="text-right text-slate-500 font-mono">{formatVND(item.remainingPrincipal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 2: INVESTMENT EFFICIENCY & RENTAL YIELD */}
          {activeTab === 'investment' && (
            <div className="space-y-4">
              <Card className="shadow-xs border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-200/60 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      Mô Hình Hiệu Quả Đầu Tư & Tích Sản
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Ước tính dòng tiền cho thuê và tăng trưởng giá trị tài sản</p>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs">ROI +{totalAnnualReturn}%/Năm</Badge>
                </div>

                {/* Investment Input Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-xl border">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Giá Thuê Ước Tính/Tháng:</span>
                      <span className="font-bold text-emerald-600 text-sm">{formatVND(estimatedMonthlyRent)}</span>
                    </div>
                    <Input 
                      type="range" min={15000000} max={150000000} step={5000000}
                      value={estimatedMonthlyRent} 
                      onChange={e => setEstimatedMonthlyRent(Number(e.target.value))}
                      className="accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-xl border">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-semibold">Tăng Giá Vốn Dự Kiến (%/Năm):</span>
                      <span className="font-bold text-purple-600 text-sm">+{annualCapitalGrowth}% / Năm</span>
                    </div>
                    <Input 
                      type="range" min={5} max={30} step={1}
                      value={annualCapitalGrowth} 
                      onChange={e => setAnnualCapitalGrowth(Number(e.target.value))}
                      className="accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Investment Metrics Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                    <span className="text-slate-400 block text-[10px]">Doanh Thu Thuê Ròng/Năm</span>
                    <span className="font-black text-slate-800 dark:text-slate-100 text-sm mt-0.5">{formatVND(annualNetRental)}</span>
                    <span className="text-[10px] text-slate-500">Đã trừ 10% chi phí QL</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                    <span className="text-slate-400 block text-[10px]">Tỷ Suất Rental Yield</span>
                    <span className="font-black text-emerald-600 text-sm mt-0.5">{netRentalYield}% / Năm</span>
                    <span className="text-[10px] text-emerald-700">Cao hơn lãi suất tiết kiệm</span>
                  </div>

                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border">
                    <span className="text-slate-400 block text-[10px]">Lợi Nhuận Vốn Hàng Năm</span>
                    <span className="font-black text-purple-600 text-sm mt-0.5">+{formatVND(propertyValue * (annualCapitalGrowth / 100))}</span>
                    <span className="text-[10px] text-purple-700">Tích sản gia tăng giá trị</span>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border text-xs space-y-1">
                  <div className="font-bold text-slate-800 dark:text-slate-200">Đánh giá đòn bẩy tài chính từ AI:</div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Trong 24 tháng đầu, khách hàng được ân hạn 0% lãi suất. Tiền thuê thu về <b>{formatVND(annualNetRental * 2)}</b> trong 2 năm sẽ là dòng tiền thặng dư 100%. Từ năm thứ 3, tiền thuê hàng tháng ({formatVND(estimatedMonthlyRent)}) sẽ bù đắp hơn <b>60%</b> tiền trả nợ ngân hàng.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* TAB 3: SAVED PLANS & PROPOSALS */}
          {activeTab === 'saved_plans' && (
            <div className="space-y-4">
              <Card className="shadow-xs border border-purple-200 dark:border-purple-900/60 rounded-2xl p-5 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-purple-600" />
                      Danh Sách Phương Án Tài Chính Đã Lưu ({savedMortgageSimulations.length})
                    </h3>
                    <p className="text-xs text-slate-500">Nhấp vào phương án để tải lại toàn bộ thông số vào bảng tính</p>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setExportModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs cursor-pointer"
                  >
                    + Lưu Phương Án Hiện Tại
                  </Button>
                </div>

                {savedMortgageSimulations.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <p>Chưa có phương án vay nào được lưu.</p>
                    <p className="text-xs">Hãy tính toán và bấm "Lưu / Xuất Báo Cáo" để lưu trữ hồ sơ khách hàng.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedMortgageSimulations.map((sim) => (
                      <div 
                        key={sim.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-purple-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-purple-600 text-white font-mono text-[10px]">{sim.id}</Badge>
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {sim.customerName || 'Khách Hàng VIP'}
                            </span>
                            <span className="text-[11px] text-slate-500">[{sim.propertyCode || 'BĐS Tự Chọn'}]</span>
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap gap-x-3 gap-y-1">
                            <span>Giá: <b>{formatVND(sim.propertyValue)}</b></span>
                            <span>Vay: <b>{sim.loanPercent}% ({formatVND(sim.loanAmount)})</b></span>
                            <span>Ngân hàng: <b>{sim.bankName}</b></span>
                            <span>Trả tháng: <b>{formatVND(sim.firstMonthlyPayment)}</b></span>
                          </div>
                          {sim.notes && (
                            <div className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                              📝 {sim.notes}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-400">
                            Ngày tạo: {sim.createdAt}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoadSimulation(sim)}
                            className="text-xs font-semibold text-purple-600 border-purple-200 hover:bg-purple-50 cursor-pointer"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" />
                            Áp Dụng Lại
                          </Button>
                          <Button 
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              deleteMortgageSimulation(sim.id)
                              showToast(`Đã xóa phương án ${sim.id}`)
                            }}
                            className="text-slate-400 hover:text-red-600 p-2 cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[700] p-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* 4. MODAL 1: BẢNG KHẤU HAO CHI TIẾT TOÀN BỘ CHU KỲ (360 THÁNG) */}
      {showFullAmortizationModal && (
        <div 
          onClick={() => setShowFullAmortizationModal(false)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Bảng Khấu Hao Toàn Bộ Chu Kỳ Vay ({schedule.length} Tháng / {loanTermYears} Năm)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ngân hàng {selectedBank.shortName} • Gói {loanPercent}% ({formatVND(loanAmount)}) • {repaymentMethod === 'reducing' ? 'Dư nợ giảm dần' : 'Niên kim cố định'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowFullAmortizationModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter toolbar inside modal */}
            <div className="p-3 border-b bg-slate-50/50 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600 dark:text-slate-300">Lọc theo năm:</span>
                <select 
                  value={filterScheduleYear} 
                  onChange={e => setFilterScheduleYear(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold cursor-pointer"
                >
                  <option value="all">Toàn bộ {loanTermYears} năm ({schedule.length} tháng)</option>
                  {Array.from({ length: loanTermYears }, (_, i) => i + 1).map(yr => (
                    <option key={yr} value={yr}>Năm thứ {yr}</option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400">Hiển thị: {filteredSchedule.length} kỳ thanh toán</span>
              </div>

              <Button 
                size="sm"
                onClick={handleExportCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-1.5 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Tải Xuất File Excel / CSV (UTF-8 BOM)
              </Button>
            </div>

            {/* Schedule Table Container */}
            <div className="overflow-y-auto p-4 flex-1">
              <Table className="text-xs">
                <TableHeader className="bg-slate-50 dark:bg-slate-800/80 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-16">Kỳ Tháng</TableHead>
                    <TableHead className="w-20">Năm</TableHead>
                    <TableHead className="w-28">Chính Sách</TableHead>
                    <TableHead className="text-right">Tiền Gốc</TableHead>
                    <TableHead className="text-right">Tiền Lãi</TableHead>
                    <TableHead className="text-right font-bold text-indigo-600 dark:text-indigo-400">Tổng Trả/Tháng</TableHead>
                    <TableHead className="text-right">Dư Nợ Còn Lại</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedule.map((item) => (
                    <TableRow key={item.month} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <TableCell className="font-bold text-center">Tháng {item.month}</TableCell>
                      <TableCell className="text-center text-slate-500">Năm {item.year}</TableCell>
                      <TableCell>
                        {item.isGrace ? (
                          <Badge className="bg-emerald-600 text-white text-[9px] py-0 px-1">0% Ân hạn CĐT</Badge>
                        ) : (
                          <span className="text-[10px] text-slate-500">LS {item.interestRate}%/năm</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-mono">{formatVND(item.principal)}</TableCell>
                      <TableCell className="text-right font-mono text-red-500">{formatVND(item.interest)}</TableCell>
                      <TableCell className="text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {formatVND(item.totalPayment)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-slate-500">{formatVND(item.remainingPrincipal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="p-3 border-t bg-slate-50 dark:bg-slate-900 flex justify-between items-center text-xs">
              <span className="text-slate-500">Tổng tiền gốc: <b>{formatVND(loanAmount)}</b> • Tổng lãi: <b>{formatVND(totalInterestPaid)}</b></span>
              <Button size="sm" variant="outline" onClick={() => setShowFullAmortizationModal(false)} className="cursor-pointer">
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL 2: BẢNG SO SÁNH CHUYÊN SÂU 4 NGÂN HÀNG ĐỐI TÁC */}
      {showBankCompareModal && (
        <div 
          onClick={() => setShowBankCompareModal(false)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Ma Trận So Sánh 4 Ngân Hàng Đối Tác Chiến Lược
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Đối chiếu 8 tiêu chí cốt lõi: Lãi suất, ân hạn, tỷ lệ vay, thời hạn và phí phạt
                  </p>
                </div>
              </div>
              <button onClick={() => setShowBankCompareModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-x-auto p-4 flex-1">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow className="bg-slate-50 dark:bg-slate-800/60">
                    <TableHead className="w-40 font-bold">Tiêu Chí So Sánh</TableHead>
                    {PARTNER_BANKS.map(bank => (
                      <TableHead key={bank.id} className="text-center font-bold">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`px-2 py-0.5 rounded text-white text-[10px] ${bank.badgeColor}`}>
                            {bank.shortName}
                          </span>
                          {selectedBank.id === bank.id && (
                            <Badge className="bg-indigo-600 text-white text-[9px] py-0 px-1">Đang chọn</Badge>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y">
                  <TableRow>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">Lãi Suất Ưu Đãi CĐT</TableCell>
                    {PARTNER_BANKS.map(bank => (
                      <TableCell key={bank.id} className="text-center font-bold text-emerald-600">
                        {bank.promoRate === 0 ? '0.0% / Năm' : `${bank.promoRate}% / Năm`}
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">Thời Gian Ưu Đãi</TableCell>
                    {PARTNER_BANKS.map(bank => (
                      <TableCell key={bank.id} className="text-center font-medium">
                        {bank.promoPeriodMonths} Tháng
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">Lãi Suất Sau Ưu Đãi (Thả Nổi)</TableCell>
                    {PARTNER_BANKS.map(bank => (
                      <TableCell key={bank.id} className="text-center font-mono font-bold text-indigo-600">
                        {bank.postPromoRate}% / Năm
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">Ân Hạn Nợ Gốc</TableCell>
                    {PARTNER_BANKS.map(bank => (
                      <TableCell key={bank.id} className="text-center font-medium text-emerald-700 dark:text-emerald-400">
                        {bank.gracePeriodMonths} Tháng
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">Tỷ Lệ Vay Tối Đa</TableCell>
                    {PARTNER_BANKS.map(bank => (
                      <TableCell key={bank.id} className="text-center font-bold">
                        {bank.maxLoanPercent}% Giá trị BĐS
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">Thời Hạn Vay Tối Đa</TableCell>
                    {PARTNER_BANKS.map(bank => (
                      <TableCell key={bank.id} className="text-center font-medium">
                        {bank.maxTermYears} Năm
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">Phí Phạt Trả Nợ Trước Hạn</TableCell>
                    {PARTNER_BANKS.map(bank => (
                      <TableCell key={bank.id} className="text-center text-[11px] text-slate-600 dark:text-slate-400">
                        {bank.prepaymentPenalty}
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">Thời Gian Thẩm Định Phê Duyệt</TableCell>
                    {PARTNER_BANKS.map(bank => (
                      <TableCell key={bank.id} className="text-center font-bold text-amber-600">
                        {bank.appraisalTimeHours} Giờ
                      </TableCell>
                    ))}
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-semibold text-slate-700 dark:text-slate-300">Hành Động</TableCell>
                    {PARTNER_BANKS.map(bank => (
                      <TableCell key={bank.id} className="text-center">
                        <Button 
                          size="sm"
                          variant={selectedBank.id === bank.id ? "default" : "outline"}
                          onClick={() => {
                            setSelectedBank(bank)
                            setShowBankCompareModal(false)
                            showToast(`Đã áp dụng gói vay ngân hàng ${bank.shortName}`)
                          }}
                          className={`text-xs font-semibold cursor-pointer ${
                            selectedBank.id === bank.id ? 'bg-indigo-600 text-white' : 'text-slate-700'
                          }`}
                        >
                          {selectedBank.id === bank.id ? 'Đang Dùng' : 'Chọn Gói Này'}
                        </Button>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="p-3 border-t bg-slate-50 dark:bg-slate-900 flex justify-end">
              <Button size="sm" variant="outline" onClick={() => setShowBankCompareModal(false)} className="cursor-pointer">
                Đóng Bảng So Sánh
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL 3: MÔ PHỎNG TRẢ NỢ TRƯỚC HẠN & PHÍ PHẠT (PREPAYMENT SIMULATOR) */}
      {showPrepaymentModal && (
        <div 
          onClick={() => setShowPrepaymentModal(false)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <PiggyBank className="h-5 w-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Mô Phỏng Trả Nợ Trước Hạn & Phí Phạt Tất Toán
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ngân hàng {selectedBank.shortName} • Biểu phí phạt thực tế
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPrepaymentModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Thời Điểm Dự Kiến Tất Toán Khoản Vay:</span>
                  <span className="font-bold text-amber-600 text-sm">Sau {prepayYear} Năm ({prepayYear * 12} Tháng)</span>
                </div>
                <Input 
                  type="range" min={1} max={Math.min(10, loanTermYears)} step={1}
                  value={prepayYear} 
                  onChange={e => setPrepayYear(Number(e.target.value))}
                  className="accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Năm 1</span>
                  <span>Năm 3</span>
                  <span>Năm 5</span>
                  <span>Năm {Math.min(10, loanTermYears)}</span>
                </div>
              </div>

              {/* Breakdown Result Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                  <span className="text-slate-400 block text-[10px]">Dư Nợ Gốc Lúc Tất Toán</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {formatVND(prepaymentAnalysis.remainingPrincipalAtTarget)}
                  </span>
                  <span className="text-[10px] text-slate-500">Tháng thứ {prepaymentAnalysis.targetMonth}</span>
                </div>

                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
                  <span className="text-amber-700 dark:text-amber-400 block text-[10px]">Phí Phạt Tất Toán ({prepaymentAnalysis.penaltyRate}%)</span>
                  <span className="font-bold text-amber-600 text-sm mt-0.5">
                    {formatVND(prepaymentAnalysis.penaltyFee)}
                  </span>
                  <span className="text-[10px] text-amber-700">Theo quy định ngân hàng</span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200 text-xs">
                    Số Tiền Lãi Tiết Kiệm Được So Với Vay Đủ Kỳ:
                  </span>
                  <span className="font-black text-emerald-600 text-base">
                    +{formatVND(prepaymentAnalysis.interestSaved)}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  Bằng cách tất toán sau {prepayYear} năm, khách hàng chỉ phải trả thêm <b>{formatVND(prepaymentAnalysis.penaltyFee)}</b> phí phạt, nhưng tiết kiệm được tới <b>{formatVND(prepaymentAnalysis.interestSaved)}</b> tiền lãi của {loanTermYears - prepayYear} năm còn lại.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border flex justify-between items-center text-xs">
                <span className="text-slate-500">Tổng Tiền Cần Chuẩn Bị Để Tất Toán:</span>
                <span className="font-black text-slate-900 dark:text-white text-sm">
                  {formatVND(prepaymentAnalysis.totalPayoffRequired)}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button 
                  size="sm"
                  onClick={() => setShowPrepaymentModal(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
                >
                  Xác Nhận & Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL 4: LƯU & XUẤT BÁO CÁO KẾ HOẠCH TÀI CHÍNH (PDF) */}
      {exportModalOpen && (
        <div 
          onClick={() => setExportModalOpen(false)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-200"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileDown className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Lưu & Xuất Báo Cáo Kế Hoạch Tài Chính</h3>
              </div>
              <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Khách hàng nhận phương án:</label>
                <select 
                  value={selectedCustomerIdForSave}
                  onChange={e => setSelectedCustomerIdForSave(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold cursor-pointer"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone}) - Hạng {c.rank}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Ghi chú phương án / Chiến lược:</label>
                <Input 
                  value={customPlanNote} 
                  onChange={e => setCustomPlanNote(e.target.value)}
                  className="text-xs h-9 bg-white dark:bg-slate-950"
                  placeholder="Nhập ghi chú cho khách..."
                />
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Giá trị BĐS:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatVND(propertyValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng liên kết:</span>
                  <span className="font-bold text-indigo-600">{selectedBank.shortName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vay vốn & Thời hạn:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{loanPercent}% ({loanTermYears} năm)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ưu đãi 0% LS & Ân hạn:</span>
                  <span className="font-bold text-emerald-600">{graceMonths} tháng</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trả tháng cao nhất:</span>
                  <span className="font-bold text-indigo-600">{formatVND(firstPayingMonthPayment)}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setExportModalOpen(false)}
                  className="cursor-pointer"
                >
                  Hủy
                </Button>
                <Button 
                  size="sm"
                  onClick={handleConfirmSaveSimulation}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  Lưu Vào Hồ Sơ Khách Hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL 5: GỬI PHƯƠNG ÁN QUA ZALO VIP (1-CHẠM) */}
      {shareModalOpen && (
        <div 
          onClick={() => setShareModalOpen(false)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-200"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Gửi Phương Án Vay Qua Zalo VIP (1-Chạm)</h3>
              </div>
              <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Template selector */}
              <div className="space-y-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Chọn phong cách tư vấn:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setZaloTemplate('compact')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      zaloTemplate === 'compact' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Tóm Tắt Nhanh
                  </button>
                  <button
                    type="button"
                    onClick={() => setZaloTemplate('cashflow')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      zaloTemplate === 'cashflow' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Dòng Tiền Bù Lãi
                  </button>
                  <button
                    type="button"
                    onClick={() => setZaloTemplate('roi')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      zaloTemplate === 'roi' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Phân Tích ROI
                  </button>
                </div>
              </div>

              {/* Message Preview Box */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-[220px] overflow-y-auto">
                {zaloShareContent}
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t">
                <a 
                  href="https://chat.zalo.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Mở ứng dụng Zalo Web
                </a>

                <Button 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(zaloShareContent)
                    showToast('Đã sao chép nội dung tin nhắn Zalo vào bộ nhớ tạm!')
                    setTimeout(() => setShareModalOpen(false), 1200)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-1.5 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" /> Sao Chép Để Gửi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
