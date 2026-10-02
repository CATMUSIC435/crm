"use client"
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Crown, Gem, Award, Gift, Clock, Star, 
  ArrowRight, ShieldCheck, Ticket, Plane, 
  Sofa, Coffee, CheckCircle2, QrCode, Sparkles,
  Plus, Search, Filter, Download, UserCheck, ChevronRight,
  Copy, Check, ExternalLink, Calendar, AlertCircle, PhoneCall,
  Zap, Building2, Wallet, Users, Compass, ChevronDown, CheckCheck
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Voucher, LoyaltyTransaction } from '@/types'

export default function LoyaltyPage() {
  const { 
    customers, 
    vouchers, 
    myVouchers, 
    loyaltyTransactions, 
    loyaltyPoints, 
    redeemVoucher,
    earnLoyaltyPoints,
    addVoucher,
    setLoyaltyPoints,
    contracts 
  } = useStore()

  // Selected customer switcher
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || 'c1')
  const currentCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0]

  // Filter & Search states
  const [voucherCategory, setVoucherCategory] = useState<string>('all')
  const [voucherSearch, setVoucherSearch] = useState<string>('')
  const [historyFilter, setHistoryFilter] = useState<'all' | 'earn' | 'redeem'>('all')
  const [historySearch, setHistorySearch] = useState<string>('')

  // Modals state
  const [showEarnModal, setShowEarnModal] = useState<boolean>(false)
  const [showAddVoucherModal, setShowAddVoucherModal] = useState<boolean>(false)
  const [showCardDetailModal, setShowCardDetailModal] = useState<boolean>(false)
  const [redeemedVoucherPopup, setRedeemedVoucherPopup] = useState<{ voucher: Voucher; code: string } | null>(null)
  const [activeWalletVoucher, setActiveWalletVoucher] = useState<{ voucher: Voucher; code: string } | null>(null)

  // Simulation form state
  const [earnForm, setEarnForm] = useState({
    contractId: '',
    customAmount: '5000000000', // 5 tỷ VNĐ default
    ratePercent: '0.1', // 0.1% = 50,000 pts
    description: 'Tích điểm ký HĐMB biệt thự đảo Aqua City',
    referenceCode: 'TX-AQM-2026'
  })

  // Add voucher form state
  const [newVoucherForm, setNewVoucherForm] = useState({
    title: '',
    points: 50000,
    category: 'Nghỉ dưỡng',
    iconName: 'Plane',
    description: '',
    stock: 20,
    expiryDate: '2026-12-31'
  })

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ message, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Calculate Tier
  let tier = 'Silver'
  let nextTier = 'Gold'
  let tierIcon = <Star className="h-4 w-4 text-slate-400" />
  let nextTierPoints = 100000
  let cardGradient = 'from-slate-700 via-slate-600 to-slate-800 border-slate-500'
  let tierColor = 'text-slate-300'

  if (loyaltyPoints >= 500000) {
    tier = 'Signature'
    nextTier = 'Tối Đa'
    tierIcon = <Crown className="h-4 w-4 text-amber-400" />
    nextTierPoints = loyaltyPoints
    cardGradient = 'from-neutral-950 via-amber-950 to-neutral-900 border-amber-500/60 shadow-amber-900/30'
    tierColor = 'text-amber-400'
  } else if (loyaltyPoints >= 200000) {
    tier = 'Diamond'
    nextTier = 'Signature'
    tierIcon = <Gem className="h-4 w-4 text-cyan-400" />
    nextTierPoints = 500000
    cardGradient = 'from-slate-950 via-cyan-950 to-slate-900 border-cyan-500/50 shadow-cyan-950/40'
    tierColor = 'text-cyan-400'
  } else if (loyaltyPoints >= 100000) {
    tier = 'Gold'
    nextTier = 'Diamond'
    tierIcon = <Award className="h-4 w-4 text-amber-400" />
    nextTierPoints = 200000
    cardGradient = 'from-amber-800 via-yellow-700 to-neutral-900 border-yellow-500/60 shadow-yellow-950/30'
    tierColor = 'text-yellow-400'
  } else {
    tier = 'Silver'
    nextTier = 'Gold'
    tierIcon = <Star className="h-4 w-4 text-slate-300" />
    nextTierPoints = 100000
    cardGradient = 'from-slate-700 via-slate-600 to-slate-800 border-slate-400/50 shadow-slate-900/30'
    tierColor = 'text-slate-200'
  }

  const progressPct = tier === 'Signature' ? 100 : Math.min((loyaltyPoints / nextTierPoints) * 100, 100)
  const ptsNeeded = Math.max(nextTierPoints - loyaltyPoints, 0)

  // KPI calculations
  const totalEarnedPoints = useMemo(() => {
    return loyaltyTransactions
      .filter(t => t.type === 'earn')
      .reduce((acc, cur) => acc + cur.points, 0)
  }, [loyaltyTransactions])

  const totalRedeemedPoints = useMemo(() => {
    return loyaltyTransactions
      .filter(t => t.type === 'redeem')
      .reduce((acc, cur) => acc + cur.points, 0)
  }, [loyaltyTransactions])

  // Map icon names to components
  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'Plane': return <Plane className={className} />
      case 'Sofa': return <Sofa className={className} />
      case 'Coffee': return <Coffee className={className} />
      case 'ShieldCheck': return <ShieldCheck className={className} />
      case 'Award': return <Award className={className} />
      case 'Ticket': return <Ticket className={className} />
      case 'Sparkles': return <Sparkles className={className} />
      default: return <Gift className={className} />
    }
  }

  // Handle Voucher Redemption
  const handleRedeem = (voucher: Voucher) => {
    if (loyaltyPoints < voucher.points) {
      showToast(`Bạn chưa đủ điểm! Cần thêm ${(voucher.points - loyaltyPoints).toLocaleString()} PTS.`, 'error')
      return
    }
    redeemVoucher(voucher.id)
    const code = `${voucher.codePrefix || 'VIP'}-${Math.floor(100000 + Math.random() * 900000)}`
    setRedeemedVoucherPopup({ voucher, code })
    showToast(`Đổi quà thành công: ${voucher.title}! Điểm còn lại: ${(loyaltyPoints - voucher.points).toLocaleString()} PTS.`, 'success')
  }

  // Handle Simulate Earn Points
  const handleSimulateEarn = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(earnForm.customAmount) || 0
    const rate = parseFloat(earnForm.ratePercent) || 0.1
    const calculatedPoints = Math.round((amount * rate) / 100)

    if (calculatedPoints <= 0) {
      showToast('Vui lòng nhập giá trị giao dịch hợp lệ!', 'error')
      return
    }

    earnLoyaltyPoints(
      calculatedPoints,
      earnForm.description || `Tích lũy từ giao dịch BĐS ${amount.toLocaleString()} VNĐ`,
      earnForm.referenceCode || `TX-${Math.floor(100000 + Math.random() * 900000)}`,
      currentCustomer.id,
      currentCustomer.name
    )

    setShowEarnModal(false)
    showToast(`Đã tích lũy thành công +${calculatedPoints.toLocaleString()} NovaPoints cho ${currentCustomer.name}!`, 'success')
  }

  // Handle Add New Voucher
  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newVoucherForm.title.trim()) {
      showToast('Vui lòng nhập tiêu đề quà tặng!', 'error')
      return
    }

    const newV: Voucher = {
      id: `v${Date.now()}`,
      title: newVoucherForm.title,
      points: Number(newVoucherForm.points) || 10000,
      iconName: newVoucherForm.iconName,
      color: 'bg-indigo-50 border-indigo-200',
      category: newVoucherForm.category,
      description: newVoucherForm.description || 'Đặc quyền chăm sóc khách hàng VIP dành cho hội viên NovaLoyalty.',
      expiryDate: newVoucherForm.expiryDate,
      stock: Number(newVoucherForm.stock) || 10,
      codePrefix: 'NOVA-VIP'
    }

    addVoucher(newV)
    setShowAddVoucherModal(false)
    setNewVoucherForm({
      title: '',
      points: 50000,
      category: 'Nghỉ dưỡng',
      iconName: 'Plane',
      description: '',
      stock: 20,
      expiryDate: '2026-12-31'
    })
    showToast(`Đã bổ sung voucher mới: "${newV.title}" vào danh mục quà tặng!`, 'success')
  }

  // Handle Switch Customer Profile
  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId)
    const targetCust = customers.find(c => c.id === customerId)
    if (!targetCust) return

    // Dynamic points adjustment based on selected customer profile simulation
    if (customerId === 'c1') {
      setLoyaltyPoints(650000) // Signature
      showToast(`Đã chuyển sang tài khoản VVIP Signature: ${targetCust.name} (650,000 PTS)`, 'info')
    } else if (customerId === 'c2') {
      setLoyaltyPoints(245000) // Diamond
      showToast(`Đã chuyển sang tài khoản VIP Diamond: ${targetCust.name} (245,000 PTS)`, 'info')
    } else if (customerId === 'c4') {
      setLoyaltyPoints(135000) // Gold
      showToast(`Đã chuyển sang tài khoản VIP Gold: ${targetCust.name} (135,000 PTS)`, 'info')
    } else {
      setLoyaltyPoints(45000) // Silver
      showToast(`Đã chuyển sang tài khoản Hội viên Silver: ${targetCust.name} (45,000 PTS)`, 'info')
    }
  }

  // Copy code to clipboard
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    showToast(`Đã sao chép mã ưu đãi: ${code}`, 'info')
    setTimeout(() => setCopiedCode(null), 2500)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã Giao Dịch', 'Tiêu Đề', 'Khách Hàng', 'Ngày', 'Loại', 'Số Điểm', 'Mã Tham Chiếu', 'Trạng Thái']
    const rows = loyaltyTransactions.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.customerName || currentCustomer.name}"`,
      t.date,
      t.type === 'earn' ? 'Tích điểm (+)' : 'Tiêu điểm (-)',
      t.points,
      t.referenceCode || 'N/A',
      t.status || 'Thành công'
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `NovaLoyalty_SaoKe_${currentCustomer.name}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất file sao kê lịch sử điểm NovaLoyalty thành công (UTF-8 CSV)!', 'success')
  }

  // Filtered Vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers.filter(v => {
      const matchCat = voucherCategory === 'all' || v.category === voucherCategory
      const matchSearch = !voucherSearch || v.title.toLowerCase().includes(voucherSearch.toLowerCase()) || (v.description && v.description.toLowerCase().includes(voucherSearch.toLowerCase()))
      return matchCat && matchSearch
    })
  }, [vouchers, voucherCategory, voucherSearch])

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return loyaltyTransactions.filter(t => {
      const matchType = historyFilter === 'all' || t.type === historyFilter
      const matchSearch = !historySearch || t.title.toLowerCase().includes(historySearch.toLowerCase()) || (t.referenceCode && t.referenceCode.toLowerCase().includes(historySearch.toLowerCase()))
      return matchType && matchSearch
    })
  }, [loyaltyTransactions, historyFilter, historySearch])

  // Categories list
  const categories = ['all', 'Nghỉ dưỡng', 'Nội thất', 'Hàng không', 'Chiết khấu BĐS', 'Golf & Thể thao', 'Sức khỏe', 'Giải trí']

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4 border ${
          toastMessage.type === 'error' ? 'bg-rose-600 border-rose-500 shadow-rose-900/30' :
          toastMessage.type === 'info' ? 'bg-sky-600 border-sky-500 shadow-sky-900/30' :
          'bg-emerald-600 border-emerald-500 shadow-emerald-900/30'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> :
           toastMessage.type === 'info' ? <Sparkles className="h-5 w-5 shrink-0" /> :
           <CheckCircle2 className="h-5 w-5 shrink-0" />}
          <span>{toastMessage.message}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs font-semibold px-2.5 py-0.5">
              NovaLoyalty Elite v3.0
            </Badge>
            <span className="text-xs text-muted-foreground">• Real-time Loyalty & Rewards Ledger</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5 text-slate-900">
            <Crown className="h-8 w-8 text-amber-500 fill-amber-400" />
            Đặc Quyền Hội Viên & Loyalty BĐS
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Quản lý xếp hạng thành viên 4 tầng (Silver, Gold, Diamond, Signature), cơ chế tích lũy điểm từ hợp đồng mua bán và quy đổi quà tặng nghỉ dưỡng, du thuyền, chiết khấu.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          <Button 
            onClick={() => setShowEarnModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Tích Điểm Giao Dịch (+)
          </Button>

          <Button 
            variant="outline"
            onClick={() => setShowAddVoucherModal(true)}
            className="font-semibold text-sm border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Plus className="h-4 w-4 text-indigo-600" />
            Thêm Quà Tặng
          </Button>

          <Button 
            variant="outline"
            onClick={handleExportCSV}
            className="font-semibold text-sm border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Download className="h-4 w-4 text-slate-600" />
            Xuất Sao Kê (CSV)
          </Button>
        </div>
      </div>

      {/* Customer Switcher Bar */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-bold text-sm">
            {currentCustomer.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Hồ sơ khách hàng đang xem:</span>
              <Badge className="bg-amber-400/20 text-amber-300 border-amber-400/30 text-[11px] font-bold">
                {tier} Member
              </Badge>
            </div>
            <div className="text-base font-bold text-slate-100 flex items-center gap-2 mt-0.5">
              <span>{currentCustomer.name}</span>
              <span className="text-xs font-normal text-slate-400">({currentCustomer.phone})</span>
            </div>
          </div>
        </div>

        {/* Switch Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-slate-300 font-medium whitespace-nowrap">Đổi tài khoản:</span>
          <select 
            value={selectedCustomerId}
            onChange={(e) => handleSelectCustomer(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400/50 cursor-pointer"
          >
            {customers.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.phone}
              </option>
            ))}
          </select>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleSelectCustomer(selectedCustomerId)}
            className="text-xs text-amber-400 hover:text-amber-300 hover:bg-slate-800"
          >
            Làm mới điểm
          </Button>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Điểm Khả Dụng</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                {loyaltyPoints.toLocaleString()} <span className="text-xs font-bold text-amber-600">PTS</span>
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Có thể quy đổi quà ngay
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Sparkles className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Hạng Hội Viên</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
                <span>{tier}</span>
                {tierIcon}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {tier === 'Signature' ? 'Đã đạt hạng thẻ cao nhất' : `Cần +${ptsNeeded.toLocaleString()} PTS lên ${nextTier}`}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Crown className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng Tích Lũy Lũy Kế</p>
              <h3 className="text-2xl md:text-3xl font-black text-emerald-600 mt-1">
                +{totalEarnedPoints.toLocaleString()} <span className="text-xs font-bold text-emerald-700">PTS</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Từ các giao dịch mua BĐS & Ref
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Building2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Voucher Đã Đổi</p>
              <h3 className="text-2xl md:text-3xl font-black text-purple-600 mt-1">
                {myVouchers.length} <span className="text-xs font-bold text-purple-700">Voucher</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Đã tiêu: {totalRedeemedPoints.toLocaleString()} PTS
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Ticket className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: DIGITAL VIP CARD & TIER PROGRESSION */}
        <div className="xl:col-span-5 space-y-6">
           
           {/* Digital Membership Card (Dynamic Tier Graphic) */}
           <div className="relative group">
              <div 
                onClick={() => setShowCardDetailModal(true)}
                className={`w-full aspect-[1.58/1] rounded-3xl p-6 md:p-8 text-white shadow-2xl overflow-hidden relative cursor-pointer transition-all duration-500 hover:scale-[1.02] border bg-gradient-to-tr ${cardGradient}`}
              >
                 {/* Shiny Shimmer Effects */}
                 <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-amber-400/20 to-transparent rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>
                 <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/30 pointer-events-none"></div>
                 
                 {/* Card Content */}
                 <div className="relative z-10 flex flex-col justify-between h-full">
                    
                    {/* Top Row: Brand & Tier Badge */}
                    <div className="flex justify-between items-start">
                       <div>
                         <div className="text-xl md:text-2xl font-black tracking-widest text-slate-100 flex items-center gap-1.5">
                           NOVA<span className="text-amber-400">LOYALTY</span>
                         </div>
                         <div className="text-[10px] uppercase tracking-[0.35em] text-slate-300 font-semibold mt-0.5">
                           Real Estate Privileges Club
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-1.5 bg-black/50 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-md shadow-inner">
                         {tierIcon}
                         <span className="text-xs font-bold uppercase tracking-wider text-white">{tier}</span>
                       </div>
                    </div>

                    {/* Middle Row: Microchip Graphic & Points */}
                    <div className="mt-auto mb-3">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className="w-10 h-7 rounded-md bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 border border-yellow-200/50 shadow-sm flex items-center justify-center">
                             <div className="w-8 h-5 border border-amber-700/30 rounded grid grid-cols-2 gap-1 p-0.5">
                               <div className="border-r border-b border-amber-700/30"></div>
                               <div className="border-b border-amber-700/30"></div>
                             </div>
                           </div>
                           <span className="text-[10px] text-slate-300 font-mono tracking-widest uppercase">Contactless VIP</span>
                         </div>
                         <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">Điểm Tích Lũy</span>
                       </div>

                       <div className="flex items-baseline justify-between mt-1">
                          <span className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300">
                             {loyaltyPoints.toLocaleString()}
                          </span>
                          <span className="text-base text-amber-200 font-extrabold">PTS</span>
                       </div>
                    </div>

                    {/* Bottom Row: Name, ID, QR icon */}
                    <div className="flex justify-between items-end border-t border-white/10 pt-3">
                       <div>
                         <div className="text-sm md:text-base font-bold tracking-wider text-slate-100 uppercase">
                           {currentCustomer.name}
                         </div>
                         <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-2">
                           <span>ID: NVL-8899-2026-VIP</span>
                           <span>•</span>
                           <span className="text-emerald-400">Active</span>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg border border-white/20 transition-colors">
                         <QrCode className="h-5 w-5 text-slate-200" />
                         <span className="text-[11px] font-bold text-slate-200 hidden sm:inline">Mở QR Pass</span>
                       </div>
                    </div>

                 </div>
              </div>
           </div>

           {/* Tier Progression Card */}
           <Card className="shadow-sm border border-slate-200">
             <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      Tiến Độ Thăng Hạng Thẻ
                    </CardTitle>
                    {tier !== 'Signature' ? (
                      <CardDescription className="text-xs mt-1">
                        Hạng hiện tại: <strong className="text-slate-800">{tier}</strong> ➔ Hạng kế tiếp: <strong className="text-indigo-600 font-bold">{nextTier}</strong>
                      </CardDescription>
                    ) : (
                      <CardDescription className="text-xs text-amber-600 font-semibold mt-1">
                        Hạng cao cấp nhất trong hệ thống NovaLoyalty
                      </CardDescription>
                    )}
                  </div>
                  {tier !== 'Signature' && (
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-slate-800">{loyaltyPoints.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground"> / {nextTierPoints.toLocaleString()} PTS</span>
                    </div>
                  )}
                </div>
             </CardHeader>
             
             <CardContent className="space-y-4">
                {/* Progress bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative shadow-inner border border-slate-200">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-600 rounded-full transition-all duration-1000" 
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>

                {tier !== 'Signature' ? (
                  <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100 text-xs text-indigo-950 font-medium flex items-start gap-2.5">
                    <Sparkles className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      Chỉ cần tích lũy thêm <strong className="text-indigo-700 font-bold">{ptsNeeded.toLocaleString()} Điểm</strong> để nâng hạng <strong className="text-indigo-700 font-bold">{nextTier}</strong>!
                      <p className="text-[11px] text-indigo-600/90 mt-0.5">Nhận ngay đặc quyền chiết khấu thêm 1.5% - 2.5% cho giao dịch BĐS kế tiếp.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950 font-medium flex items-start gap-2.5">
                    <Crown className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      Chúc mừng bạn là thành viên <strong className="text-amber-800">Signature Elite</strong>! Bạn đang sở hữu toàn bộ đặc quyền tối thượng của tập đoàn: Xe limousine đón tiễn, du thuyền riêng và quản gia tài sản 24/7.
                    </div>
                  </div>
                )}

                {/* Quick Privileges for Current Tier */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                    Đặc quyền hiện có của hạng {tier}:
                  </div>
                  <ul className="text-xs space-y-2 text-slate-600 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{tier === 'Signature' ? 'Chiết khấu mua thêm BĐS: 3.5%' : tier === 'Diamond' ? 'Chiết khấu mua thêm BĐS: 2.5%' : tier === 'Gold' ? 'Chiết khấu mua thêm BĐS: 1.5%' : 'Chiết khấu mua thêm BĐS: 1.0%'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{tier === 'Signature' ? 'Phòng chờ sân bay quốc tế không giới hạn' : tier === 'Diamond' ? '10 lượt phòng chờ thương gia/năm' : tier === 'Gold' ? '2 lượt phòng chờ thương gia/năm' : 'Tích điểm 0.1% mọi giao dịch'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{tier === 'Signature' ? 'Tặng tiệc du thuyền Aqua Marina & Golf PGA miễn phí' : tier === 'Diamond' ? 'Tặng 2 chuyến du thuyền sông Đồng Nai/năm' : tier === 'Gold' ? 'Giảm 30% green fee sân Golf PGA' : 'Tham dự sự kiện mở bán VIP'}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Ưu tiên chọn căn giỏ hàng ngoại giao phân khu hot</span>
                    </li>
                  </ul>
                </div>

                {/* Quick Concierge button */}
                <div className="pt-2">
                  <Button 
                    variant="outline"
                    onClick={() => showToast('Đang kết nối tổng đài Quản gia VIP 24/7 (Hotline: 1800 6868)...', 'info')}
                    className="w-full text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 h-9"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-amber-600" />
                    Gọi Trợ Lý Quản Gia VIP 24/7
                  </Button>
                </div>
             </CardContent>
           </Card>

        </div>

        {/* RIGHT COLUMN: 4 TABS INTERFACE */}
        <div className="xl:col-span-7">
           
           <Tabs defaultValue="catalog" className="w-full">
             <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1.5 mb-6 bg-slate-100 rounded-xl gap-1">
               <TabsTrigger value="catalog" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
                 <Gift className="h-4 w-4 text-amber-500"/> Cửa Hàng Quà Tặng
               </TabsTrigger>
               <TabsTrigger value="my-vouchers" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
                 <Ticket className="h-4 w-4 text-blue-500"/> Túi Quà Đã Đổi 
                 {myVouchers.length > 0 && (
                   <Badge className="ml-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] px-1.5 py-0">
                     {myVouchers.length}
                   </Badge>
                 )}
               </TabsTrigger>
               <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
                 <Clock className="h-4 w-4 text-emerald-600"/> Lịch Sử Điểm
               </TabsTrigger>
               <TabsTrigger value="privilege-matrix" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
                 <Award className="h-4 w-4 text-purple-600"/> So Sánh Hạng Thẻ
               </TabsTrigger>
             </TabsList>

             {/* 1. CATALOG TAB */}
             <TabsContent value="catalog" className="space-y-5">
                
                {/* Search & Category Filter */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Tìm kiếm quà tặng (nghỉ dưỡng, du thuyền, chiết khấu, golf...)" 
                        value={voucherSearch}
                        onChange={(e) => setVoucherSearch(e.target.value)}
                        className="pl-9 text-xs h-9"
                      />
                    </div>
                    {voucherSearch && (
                      <Button size="sm" variant="ghost" onClick={() => setVoucherSearch('')} className="text-xs h-9">
                        Xóa tìm kiếm
                      </Button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setVoucherCategory(cat)}
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors ${
                          voucherCategory === cat 
                            ? 'bg-slate-900 text-white shadow-sm' 
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat === 'all' ? 'Tất Cả Danh Mục' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voucher Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {filteredVouchers.map(v => {
                     const isAffordable = loyaltyPoints >= v.points
                     const shortfall = Math.max(v.points - loyaltyPoints, 0)
                     
                     return (
                       <Card 
                         key={v.id} 
                         className={`shadow-sm overflow-hidden border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between group relative bg-white`}
                       >
                          <CardContent className="p-5 flex-1 flex flex-col justify-between">
                             <div>
                               {/* Card Header Top */}
                               <div className="flex justify-between items-start mb-3">
                                 <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
                                    {renderIcon(v.iconName, "h-6 w-6 text-amber-600")}
                                 </div>
                                 <Badge variant="outline" className="text-[11px] font-bold bg-slate-50 text-slate-600 border-slate-200">
                                   {v.category || 'Đặc quyền'}
                                 </Badge>
                               </div>

                               <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug mb-1.5 min-h-[44px]">
                                 {v.title}
                               </h3>

                               <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                                 {v.description || 'Ưu đãi dành riêng cho hội viên có điểm tích lũy trong hệ sinh thái bất động sản.'}
                               </p>
                             </div>

                             {/* Bottom Bar: Points & CTA */}
                             <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                               <div>
                                 <span className="text-[10px] text-slate-400 font-bold uppercase block">Điểm quy đổi</span>
                                 <div className="text-lg font-black text-amber-600">
                                   {v.points.toLocaleString()} <span className="text-xs font-bold text-amber-700">PTS</span>
                                 </div>
                               </div>

                               <Button 
                                 size="sm" 
                                 disabled={!isAffordable}
                                 onClick={() => handleRedeem(v)}
                                 className={`h-9 px-4 text-xs font-bold rounded-xl transition-all shadow-sm ${
                                   !isAffordable 
                                     ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' 
                                     : 'bg-slate-900 hover:bg-slate-800 text-white hover:scale-105'
                                 }`}
                               >
                                 {!isAffordable ? `Thiếu ${shortfall.toLocaleString()} PTS` : 'Đổi Quà Ngay'}
                               </Button>
                             </div>
                          </CardContent>
                       </Card>
                     )
                   })}
                </div>

                {filteredVouchers.length === 0 && (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                    <Gift className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <h4 className="font-bold text-slate-700 text-sm">Không tìm thấy quà tặng phù hợp</h4>
                    <p className="text-xs text-slate-500 mt-1">Hãy thử xóa bộ lọc tìm kiếm hoặc danh mục.</p>
                  </div>
                )}

             </TabsContent>

             {/* 2. MY VOUCHERS TAB */}
             <TabsContent value="my-vouchers" className="space-y-4">
                {myVouchers.length === 0 ? (
                  <Card className="shadow-sm border-dashed border-2 border-slate-200 bg-white">
                    <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                       <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 ring-8 ring-slate-100">
                         <Ticket className="h-8 w-8 text-slate-400" />
                       </div>
                       <h3 className="font-bold text-slate-800 text-base mb-1">Túi Quà Tặng Đang Trống</h3>
                       <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                         Bạn chưa đổi voucher nào. Hãy chọn quà tặng từ Cửa hàng bằng số điểm <strong className="text-amber-600">{loyaltyPoints.toLocaleString()} PTS</strong> đang sở hữu!
                       </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
                      <span>Bạn đang sở hữu {myVouchers.length} voucher đặc quyền:</span>
                      <span className="text-emerald-600 font-bold">Tất cả đều có hiệu lực</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {myVouchers.map((v, i) => {
                        const code = `${v.codePrefix || 'VIP'}-${990000 + i * 137}`
                        return (
                          <div 
                            key={i} 
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 shadow-sm bg-white hover:border-indigo-200 transition-all"
                          >
                             <div className="flex items-center gap-3.5">
                               <div className="h-12 w-12 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                                 {renderIcon(v.iconName, "h-6 w-6")}
                               </div>
                               <div>
                                 <h4 className="font-bold text-slate-900 text-sm">{v.title}</h4>
                                 <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                   <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                     {code}
                                   </span>
                                   <span>•</span>
                                   <span>Hạn dùng: {v.expiryDate || '31/12/2026'}</span>
                                 </div>
                               </div>
                             </div>

                             <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                               <Button 
                                 size="sm"
                                 variant="outline"
                                 onClick={() => handleCopy(code)}
                                 className="text-xs h-8 px-3 font-semibold border-slate-200 hover:bg-slate-50"
                               >
                                 {copiedCode === code ? <Check className="h-3.5 w-3.5 text-emerald-600 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1 text-slate-500" />}
                                 {copiedCode === code ? 'Đã chép' : 'Sao chép'}
                               </Button>

                               <Button 
                                 size="sm"
                                 onClick={() => setActiveWalletVoucher({ voucher: v, code })}
                                 className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-8 px-4 rounded-lg shadow-sm flex items-center gap-1.5"
                               >
                                 <QrCode className="h-3.5 w-3.5" />
                                 Mở Mã QR
                               </Button>
                             </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
             </TabsContent>

             {/* 3. HISTORY TAB */}
             <TabsContent value="history" className="space-y-4">
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="p-4 md:p-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <CardTitle className="text-base font-bold text-slate-900">Sổ Nhật Ký Tích & Tiêu Điểm</CardTitle>
                        <CardDescription className="text-xs">Kiểm toán biến động điểm NovaPoints thời gian thực</CardDescription>
                      </div>

                      {/* Filters */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="flex rounded-lg border border-slate-200 p-0.5 bg-white text-xs">
                          <button
                            onClick={() => setHistoryFilter('all')}
                            className={`px-2.5 py-1 rounded font-semibold transition-colors ${historyFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            Tất cả
                          </button>
                          <button
                            onClick={() => setHistoryFilter('earn')}
                            className={`px-2.5 py-1 rounded font-semibold transition-colors ${historyFilter === 'earn' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            Tích (+)
                          </button>
                          <button
                            onClick={() => setHistoryFilter('redeem')}
                            className={`px-2.5 py-1 rounded font-semibold transition-colors ${historyFilter === 'redeem' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}
                          >
                            Tiêu (-)
                          </button>
                        </div>

                        <div className="relative">
                          <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                          <Input 
                            placeholder="Mã GD / Tiêu đề..." 
                            value={historySearch}
                            onChange={(e) => setHistorySearch(e.target.value)}
                            className="pl-8 text-xs h-7 w-36 md:w-44"
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                       {filteredTransactions.map(t => (
                         <div key={t.id} className="p-4 md:p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3.5">
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${
                                t.type === 'earn' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                                  : 'bg-rose-50 text-rose-600 border-rose-200'
                              }`}>
                                {t.type === 'earn' ? <CheckCircle2 className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-slate-900 leading-snug">{t.title}</div>
                                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                  <span>{t.date}</span>
                                  <span>•</span>
                                  <span className="font-mono text-slate-600 font-semibold">{t.referenceCode || t.id}</span>
                                  <span>•</span>
                                  <Badge variant="outline" className={`text-[10px] py-0 px-1.5 font-bold ${
                                    t.type === 'earn' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-slate-700 bg-slate-50 border-slate-200'
                                  }`}>
                                    {t.status || (t.type === 'earn' ? 'Đã duyệt' : 'Thành công')}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            <div className={`font-black text-base md:text-lg text-right shrink-0 ${t.type === 'earn' ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {t.type === 'earn' ? '+' : '-'}{t.points.toLocaleString()} <span className="text-xs font-bold">PTS</span>
                            </div>
                         </div>
                       ))}

                       {filteredTransactions.length === 0 && (
                         <div className="p-8 text-center text-slate-500 text-xs">
                           Không có giao dịch nào thỏa điều kiện tìm kiếm.
                         </div>
                       )}
                    </div>
                  </CardContent>
                </Card>
             </TabsContent>

             {/* 4. PRIVILEGE MATRIX TAB */}
             <TabsContent value="privilege-matrix" className="space-y-4">
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-500" />
                      Bảng So Sánh Quyền Lợi 4 Hạng Thẻ NovaLoyalty
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Chi tiết mức phân hạng thành viên dựa trên giá trị giao dịch tích lũy và số dư NovaPoints
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse min-w-[620px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                          <th className="p-3.5">Hạng Mục Đặc Quyền</th>
                          <th className="p-3.5 text-center text-slate-600">Silver (0 - 99k)</th>
                          <th className="p-3.5 text-center text-amber-700 bg-amber-50/50">Gold (100k - 199k)</th>
                          <th className="p-3.5 text-center text-cyan-700 bg-cyan-50/50">Diamond (200k - 499k)</th>
                          <th className="p-3.5 text-center text-amber-950 bg-amber-100/50">Signature (500k+)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                        <tr className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-800">Chiết khấu mua thêm BĐS</td>
                          <td className="p-3.5 text-center">1.0%</td>
                          <td className="p-3.5 text-center font-bold text-amber-700 bg-amber-50/20">1.5%</td>
                          <td className="p-3.5 text-center font-bold text-cyan-700 bg-cyan-50/20">2.5%</td>
                          <td className="p-3.5 text-center font-black text-amber-900 bg-amber-100/30">3.5%</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-800">Ưu tiên giỏ hàng ngoại giao</td>
                          <td className="p-3.5 text-center text-slate-400">Tiêu chuẩn</td>
                          <td className="p-3.5 text-center bg-amber-50/20">Ưu tiên 24h</td>
                          <td className="p-3.5 text-center font-bold text-cyan-700 bg-cyan-50/20">Ưu tiên 48h</td>
                          <td className="p-3.5 text-center font-bold text-amber-900 bg-amber-100/30">Suất VIP đặc quyền</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-800">Phòng chờ thương gia sân bay</td>
                          <td className="p-3.5 text-center text-slate-400">-</td>
                          <td className="p-3.5 text-center bg-amber-50/20">2 vé/năm</td>
                          <td className="p-3.5 text-center font-bold text-cyan-700 bg-cyan-50/20">10 vé/năm</td>
                          <td className="p-3.5 text-center font-black text-emerald-600 bg-amber-100/30">Không giới hạn</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-800">Du thuyền Aqua Marina</td>
                          <td className="p-3.5 text-center text-slate-400">Giá niêm yết</td>
                          <td className="p-3.5 text-center bg-amber-50/20">Giảm 20%</td>
                          <td className="p-3.5 text-center font-bold text-cyan-700 bg-cyan-50/20">2 chuyến VIP/năm</td>
                          <td className="p-3.5 text-center font-black text-amber-900 bg-amber-100/30">Tiệc riêng VIP trọn gói</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-800">Sân Golf PGA 36 Hố</td>
                          <td className="p-3.5 text-center text-slate-400">Giá niêm yết</td>
                          <td className="p-3.5 text-center bg-amber-50/20">Giảm 30% green fee</td>
                          <td className="p-3.5 text-center font-bold text-cyan-700 bg-cyan-50/20">Miễn phí 12 buổi</td>
                          <td className="p-3.5 text-center font-black text-amber-900 bg-amber-100/30">Miễn phí trọn năm + Caddie</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-800">Xe Limousine đưa đón sân bay</td>
                          <td className="p-3.5 text-center text-slate-400">-</td>
                          <td className="p-3.5 text-center bg-amber-50/20">1 chuyến/năm</td>
                          <td className="p-3.5 text-center font-bold text-cyan-700 bg-cyan-50/20">6 chuyến/năm</td>
                          <td className="p-3.5 text-center font-black text-amber-900 bg-amber-100/30">Theo yêu cầu 24/7</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-800">Quản gia Concierge phục vụ riêng</td>
                          <td className="p-3.5 text-center text-slate-400">Hotline chung</td>
                          <td className="p-3.5 text-center bg-amber-50/20">Tổng đài ưu tiên</td>
                          <td className="p-3.5 text-center font-bold text-cyan-700 bg-cyan-50/20">Quản gia riêng</td>
                          <td className="p-3.5 text-center font-black text-amber-900 bg-amber-100/30">Giám đốc quản gia 24/7</td>
                        </tr>
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
             </TabsContent>

           </Tabs>
        </div>

      </div>

      {/* ================= MODAL 1: GIẢ LẬP TÍCH ĐIỂM GIAO DỊCH BĐS ================= */}
      {showEarnModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  Giả Lập Tích Điểm Giao Dịch BĐS
                </h3>
                <p className="text-xs text-slate-400 mt-1">Cộng NovaPoints cho hợp đồng cọc / ký mua bán thành công</p>
              </div>
              <button 
                onClick={() => setShowEarnModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSimulateEarn} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Khách Hàng Thụ Hưởng
                </label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{currentCustomer.name}</div>
                    <div className="text-xs text-slate-500">{currentCustomer.phone} • Hạng {tier}</div>
                  </div>
                  <Badge className="bg-slate-900 text-white text-[11px] font-bold">
                    {loyaltyPoints.toLocaleString()} PTS
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Giá Trị Giao Dịch (VNĐ)
                </label>
                <Input 
                  type="number"
                  value={earnForm.customAmount}
                  onChange={(e) => setEarnForm({ ...earnForm, customAmount: e.target.value })}
                  placeholder="Ví dụ: 5000000000"
                  className="font-mono text-sm font-bold"
                  required
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Tương đương: <strong>{(Number(earnForm.customAmount) || 0).toLocaleString()} VNĐ</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Tỷ Lệ Tích Điểm (%)
                  </label>
                  <select 
                    value={earnForm.ratePercent}
                    onChange={(e) => setEarnForm({ ...earnForm, ratePercent: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                  >
                    <option value="0.05">0.05% (Tiêu chuẩn)</option>
                    <option value="0.1">0.1% (Hội viên VIP)</option>
                    <option value="0.2">0.2% (Chiến dịch X2 Điểm)</option>
                    <option value="0.5">0.5% (Sự kiện Mở Bán)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Mã Tham Chiếu
                  </label>
                  <Input 
                    value={earnForm.referenceCode}
                    onChange={(e) => setEarnForm({ ...earnForm, referenceCode: e.target.value })}
                    className="font-mono text-xs font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Diễn Giải Giao Dịch
                </label>
                <Input 
                  value={earnForm.description}
                  onChange={(e) => setEarnForm({ ...earnForm, description: e.target.value })}
                  placeholder="Ví dụ: Tích điểm ký HĐMB Biệt thự Aqua City"
                  className="text-xs"
                />
              </div>

              {/* Point preview calculation */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-900">
                <span className="text-xs font-medium">Số điểm dự kiến cộng:</span>
                <span className="text-xl font-black text-emerald-700">
                  +{Math.round(((Number(earnForm.customAmount) || 0) * (Number(earnForm.ratePercent) || 0.1)) / 100).toLocaleString()} PTS
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEarnModal(false)}
                  className="text-xs font-semibold"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Xác Nhận Tích Điểm Ngay
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: THÊM VOUCHER MỚI ================= */}
      {showAddVoucherModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus className="h-5 w-5 text-amber-400" />
                  Thêm Quà Tặng Mới Vào Catalog
                </h3>
                <p className="text-xs text-slate-400 mt-1">Cấu hình voucher và điểm quy đổi cho hội viên</p>
              </div>
              <button 
                onClick={() => setShowAddVoucherModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Tên Quà Tặng / Đặc Quyền
                </label>
                <Input 
                  value={newVoucherForm.title}
                  onChange={(e) => setNewVoucherForm({ ...newVoucherForm, title: e.target.value })}
                  placeholder="Ví dụ: Đêm tiệc rượu vang thượng đỉnh tại Aqua Marina"
                  className="text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Điểm Quy Đổi (PTS)
                  </label>
                  <Input 
                    type="number"
                    value={newVoucherForm.points}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, points: Number(e.target.value) })}
                    className="font-mono text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Danh Mục
                  </label>
                  <select 
                    value={newVoucherForm.category}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, category: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                  >
                    <option value="Nghỉ dưỡng">Nghỉ dưỡng</option>
                    <option value="Nội thất">Nội thất</option>
                    <option value="Hàng không">Hàng không</option>
                    <option value="Chiết khấu BĐS">Chiết khấu BĐS</option>
                    <option value="Golf & Thể thao">Golf & Thể thao</option>
                    <option value="Sức khỏe">Sức khỏe</option>
                    <option value="Giải trí">Giải trí</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Mô Tả & Điều Khoản Áp Dụng
                </label>
                <textarea 
                  value={newVoucherForm.description}
                  onChange={(e) => setNewVoucherForm({ ...newVoucherForm, description: e.target.value })}
                  placeholder="Chi tiết dịch vụ bao gồm, hạn mức số lượng, cách thức kích hoạt..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-xs min-h-[75px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Số Lượng Phát Hành
                  </label>
                  <Input 
                    type="number"
                    value={newVoucherForm.stock}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, stock: Number(e.target.value) })}
                    className="font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Hạn Sử Dụng
                  </label>
                  <Input 
                    type="date"
                    value={newVoucherForm.expiryDate}
                    onChange={(e) => setNewVoucherForm({ ...newVoucherForm, expiryDate: e.target.value })}
                    className="text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddVoucherModal(false)}
                  className="text-xs font-semibold"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md"
                >
                  Tạo Quà Tặng Ngay
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: DIGITAL VIP PASS & QR CODE MODAL ================= */}
      {showCardDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-700 overflow-hidden relative">
            <div className="p-6 text-center space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-widest">
                  <Crown className="h-4 w-4" /> NovaLoyalty Digital Pass
                </div>
                <button 
                  onClick={() => setShowCardDetailModal(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-5 rounded-2xl shadow-xl mx-auto w-48 h-48 flex flex-col items-center justify-center">
                <QrCode className="h-36 w-36 text-slate-950" />
                <span className="text-[10px] text-slate-500 font-mono mt-1">Quét mã tại quầy lễ tân</span>
              </div>

              <div>
                <h4 className="text-lg font-black uppercase tracking-wider text-slate-100">{currentCustomer.name}</h4>
                <p className="text-xs font-mono text-slate-400 mt-0.5">Mã Thẻ: NVL-8899-2026-VIP</p>
                <div className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold mt-2">
                  {tierIcon}
                  <span>Hội Viên Hạng {tier}</span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 text-xs text-slate-300 flex justify-between items-center">
                <span>Số dư điểm:</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{loyaltyPoints.toLocaleString()} PTS</span>
              </div>

              <div className="space-y-2 pt-2">
                <Button 
                  onClick={() => {
                    showToast('Đã mô phỏng liên kết thẻ vào Apple Wallet / Google Wallet!', 'success')
                    setShowCardDetailModal(false)
                  }}
                  className="w-full bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs h-10 rounded-xl flex items-center justify-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  Thêm Vào Apple / Google Wallet
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => setShowCardDetailModal(false)}
                  className="w-full text-slate-400 hover:text-white text-xs h-8"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: POPUP ĐỔI VOUCHER THÀNH CÔNG ================= */}
      {redeemedVoucherPopup && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4">
            <div className="h-14 w-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 ring-8 ring-emerald-50">
              <CheckCheck className="h-8 w-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">Đổi Quà Thành Công!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Bạn đã sử dụng <strong>{redeemedVoucherPopup.voucher.points.toLocaleString()} PTS</strong> để đổi:
              </p>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-bold text-sm mt-3">
                {redeemedVoucherPopup.voucher.title}
              </div>
            </div>

            {/* Generated E-code */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Mã E-Voucher Của Bạn
              </span>
              <div className="text-xl font-mono font-black text-indigo-700 tracking-wider">
                {redeemedVoucherPopup.code}
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => handleCopy(redeemedVoucherPopup.code)}
                className="text-xs text-indigo-600 hover:text-indigo-800 mt-1 h-7"
              >
                <Copy className="h-3.5 w-3.5 mr-1" />
                Sao Chép Mã Ưu Đãi
              </Button>
            </div>

            <div className="text-xs text-slate-400">
              Voucher đã được lưu vào tab <strong>Túi Quà Đã Đổi</strong>. Xuất trình mã này cho lễ tân để sử dụng dịch vụ.
            </div>

            <Button 
              onClick={() => setRedeemedVoucherPopup(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 rounded-xl"
            >
              Hoàn Tất & Xem Túi Đồ
            </Button>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: POPUP MỞ MÃ QR TRONG VÍ ================= */}
      {activeWalletVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">E-Voucher Kích Hoạt</span>
              <button onClick={() => setActiveWalletVoucher(null)} className="text-slate-400 hover:text-slate-800">✕</button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block">
              <QrCode className="h-44 w-44 text-slate-900 mx-auto" />
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-sm">{activeWalletVoucher.voucher.title}</h4>
              <div className="font-mono text-base font-black text-indigo-700 mt-1">
                {activeWalletVoucher.code}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Hạn dùng: {activeWalletVoucher.voucher.expiryDate || '31/12/2026'} • Khách: {currentCustomer.name}
              </p>
            </div>

            <Button 
              onClick={() => {
                showToast(`Đã xác thực voucher ${activeWalletVoucher.code} thành công tại hệ thống!`, 'success')
                setActiveWalletVoucher(null)
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-10 rounded-xl"
            >
              <Check className="h-4 w-4 mr-1" />
              Xác Nhận Đã Dùng Tại Quầy
            </Button>
          </div>
        </div>
      )}

    </div>
  )
}
