"use client"
import React, { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Gift, Link as LinkIcon, QrCode, Copy, Users, 
  CheckCircle, Wallet, Trophy, Plane, Smartphone, 
  Medal, ArrowRight, Share2, Plus, Download, Search, 
  Filter, AlertCircle, Building2, Check, ExternalLink, 
  Calendar, Phone, Mail, ChevronRight, FileText, 
  Banknote, ShieldCheck, Sparkles, TrendingUp, Award,
  CheckCheck, Clock, Send
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { ReferralLead, CommissionPayout } from '@/types'

const PERFORMANCE_DATA = [
  { name: 'Tuần 1', click: 400, deal: 0 },
  { name: 'Tuần 2', click: 800, deal: 1 },
  { name: 'Tuần 3', click: 600, deal: 1 },
  { name: 'Tuần 4', click: 650, deal: 3 },
  { name: 'Tuần 5 (HT)', click: 920, deal: 2 },
]

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Nguyễn Tuấn Tú', code: 'TUANTU99', deals: 5, commission: 410000000, tier: 'Diamond Partner', avatar: 'TT' },
  { rank: 2, name: 'Lê Thị Mai Lan', code: 'LANMAI88', deals: 4, commission: 320000000, tier: 'Platinum Partner', avatar: 'ML' },
  { rank: 3, name: 'Trần Quang Huy', code: 'HUYTRAN07', deals: 3, commission: 265000000, tier: 'Gold Partner', avatar: 'QH' },
  { rank: 4, name: 'Phạm Bích Thảo', code: 'THAOPB92', deals: 2, commission: 170000000, tier: 'Gold Partner', avatar: 'BT' },
  { rank: 5, name: 'Đỗ Quốc Hùng', code: 'HUNGDO66', deals: 2, commission: 145000000, tier: 'Silver Partner', avatar: 'QH' },
]

export default function ReferralPage() {
  const { 
    projects, 
    referralLeads, 
    commissionPayouts, 
    addReferralLead, 
    updateReferralLeadStatus, 
    requestCommissionPayout 
  } = useStore()

  // State filters
  const [dealSearch, setDealSearch] = useState('')
  const [dealStatusFilter, setDealStatusFilter] = useState<string>('all')
  const [payStatusFilter, setPayStatusFilter] = useState<string>('all')
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<string>('all')

  // Modals state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [selectedDealModal, setSelectedDealModal] = useState<ReferralLead | null>(null)
  const [selectedPayoutReceipt, setSelectedPayoutReceipt] = useState<CommissionPayout | null>(null)
  const [selectedShareProject, setSelectedShareProject] = useState<string>('p2') // Aqua City default

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ message, type })
    setTimeout(() => setToastMsg(null), 3500)
  }

  // Affiliate info
  const affiliateCode = 'TUANTU99'
  const affiliateLink = `https://crm.novaland.com/ref/${affiliateCode}`

  // Add lead form state
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    projectId: 'p2',
    dealValue: '5000000000',
    notes: 'Khách hàng quan tâm phân khu biệt thự ven sông'
  })

  // Withdraw form state
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '100000000',
    bankName: 'Vietcombank',
    accountNumber: '0071001234567',
    accountHolder: 'NGUYEN TUAN TU',
    note: 'Rút hoa hồng đợt chốt căn Aqua City & The Beverly'
  })

  // Financial calculations
  const totalCommissionGenerated = useMemo(() => {
    return referralLeads.reduce((acc, lead) => acc + lead.commissionAmount, 0)
  }, [referralLeads])

  const totalCommissionPaid = useMemo(() => {
    return commissionPayouts
      .filter(p => p.status === 'Đã chi trả')
      .reduce((acc, p) => acc + p.amount, 0)
  }, [commissionPayouts])

  const availableBalance = useMemo(() => {
    const earnedPaid = referralLeads
      .filter(l => l.payStatus === 'Đã thanh toán')
      .reduce((acc, l) => acc + l.commissionAmount, 0)
    return Math.max(earnedPaid - totalCommissionPaid, 0)
  }, [referralLeads, totalCommissionPaid])

  const pendingDisbursement = useMemo(() => {
    return referralLeads
      .filter(l => l.payStatus === 'Chờ giải ngân')
      .reduce((acc, l) => acc + l.commissionAmount, 0)
  }, [referralLeads])

  const successfulDealsCount = useMemo(() => {
    return referralLeads.filter(l => l.status === 'Đã đặt cọc' || l.status === 'Đã giải ngân').length
  }, [referralLeads])

  const conversionRate = useMemo(() => {
    if (referralLeads.length === 0) return 0
    return Math.round((successfulDealsCount / referralLeads.length) * 100)
  }, [referralLeads, successfulDealsCount])

  // Handle Copy Link
  const handleCopyLink = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy)
    setCopiedLink(true)
    showToast(`Đã sao chép link tiếp thị: ${textToCopy}`, 'info')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  // Handle Copy Snippet
  const handleCopySnippet = (snippet: string, label: string) => {
    navigator.clipboard.writeText(snippet)
    setCopiedCode(label)
    showToast(`Đã sao chép nội dung truyền thông ${label}!`, 'info')
    setTimeout(() => setCopiedCode(null), 2500)
  }

  // Handle Submit New Referral Lead
  const handleAddLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeadForm.name.trim() || !newLeadForm.phone.trim()) {
      showToast('Vui lòng nhập họ tên và số điện thoại khách hàng!', 'error')
      return
    }

    const matchedProj = projects.find(p => p.id === newLeadForm.projectId) || projects[0]
    const dealVal = parseFloat(newLeadForm.dealValue) || 5000000000
    const commRate = matchedProj.id === 'p5' ? 1.2 : 1.5 // 1.2% for shophouse, 1.5% for villas
    const commAmt = Math.round((dealVal * commRate) / 100)

    addReferralLead({
      name: newLeadForm.name,
      phone: newLeadForm.phone,
      email: newLeadForm.email || `${newLeadForm.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      date: new Date().toISOString().split('T')[0],
      status: 'Đang tư vấn',
      projectId: matchedProj.id,
      projectName: matchedProj.name,
      propertyCode: `${matchedProj.id.toUpperCase()}-VIP`,
      dealValue: dealVal,
      commissionRate: commRate,
      commissionAmount: commAmt,
      payStatus: 'Chưa phát sinh',
      affiliateCode,
      assignedAgent: 'Tuấn Tú (CTV)',
      notes: newLeadForm.notes
    })

    setShowAddLeadModal(false)
    setNewLeadForm({
      name: '',
      phone: '',
      email: '',
      projectId: 'p2',
      dealValue: '5000000000',
      notes: 'Khách hàng quan tâm phân khu biệt thự ven sông'
    })
    showToast(`Đã gửi giới thiệu khách hàng ${newLeadForm.name} thành công vào hệ thống CRM!`, 'success')
  }

  // Handle Submit Withdrawal
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(withdrawForm.amount) || 0
    if (amount <= 0) {
      showToast('Vui lòng nhập số tiền rút hợp lệ!', 'error')
      return
    }
    if (amount > availableBalance && availableBalance > 0) {
      showToast(`Số dư khả dụng hiện tại là ${availableBalance.toLocaleString()} VNĐ!`, 'error')
      return
    }

    requestCommissionPayout(
      amount,
      withdrawForm.bankName,
      withdrawForm.accountNumber,
      withdrawForm.accountHolder,
      withdrawForm.note
    )

    setShowWithdrawModal(false)
    showToast(`Lệnh rút ${amount.toLocaleString()} VNĐ đã được gửi đến Phòng Kế Toán thẩm định & giải ngân!`, 'success')
  }

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã Deal', 'Khách Hàng', 'SĐT', 'Dự Án', 'Mã Căn', 'Giá Trị Hợp Đồng (VNĐ)', 'Tỷ Lệ (%)', 'Hoa Hồng (VNĐ)', 'Trạng Thái Deal', 'Trạng Thái Thanh Toán', 'Ngày Giới Thiệu']
    const rows = referralLeads.map(l => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      l.phone,
      `"${l.projectName.replace(/"/g, '""')}"`,
      l.propertyCode || 'N/A',
      l.dealValue,
      `${l.commissionRate}%`,
      l.commissionAmount,
      l.status,
      l.payStatus,
      l.date
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `NovaAffiliate_Deals_${affiliateCode}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất báo cáo mạng lưới CTV & hoa hồng thành công (UTF-8 CSV)!', 'success')
  }

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return referralLeads.filter(lead => {
      const matchSearch = !dealSearch || 
        lead.name.toLowerCase().includes(dealSearch.toLowerCase()) || 
        lead.phone.includes(dealSearch) || 
        (lead.propertyCode && lead.propertyCode.toLowerCase().includes(dealSearch.toLowerCase()))
      
      const matchDealStatus = dealStatusFilter === 'all' || lead.status === dealStatusFilter
      const matchPayStatus = payStatusFilter === 'all' || lead.payStatus === payStatusFilter
      const matchProj = selectedProjectFilter === 'all' || lead.projectId === selectedProjectFilter

      return matchSearch && matchDealStatus && matchPayStatus && matchProj
    })
  }, [referralLeads, dealSearch, dealStatusFilter, payStatusFilter, selectedProjectFilter])

  // Get current active share project
  const currentShareProj = projects.find(p => p.id === selectedShareProject) || projects[0]
  const projectReferralUrl = `${affiliateLink}?p=${currentShareProj?.id || 'project'}&src=zalo`

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4 border ${
          toastMsg.type === 'error' ? 'bg-rose-600 border-rose-500 shadow-rose-900/30' :
          toastMsg.type === 'info' ? 'bg-sky-600 border-sky-500 shadow-sky-900/30' :
          'bg-emerald-600 border-emerald-500 shadow-emerald-900/30'
        }`}>
          {toastMsg.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> :
           toastMsg.type === 'info' ? <Sparkles className="h-5 w-5 shrink-0" /> :
           <CheckCircle className="h-5 w-5 shrink-0" />}
          <span>{toastMsg.message}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300 text-xs font-semibold px-2.5 py-0.5">
              NovaPartner Affiliate Network v3.0
            </Badge>
            <span className="text-xs text-muted-foreground">• Mạng Lưới CTV & Đại Lý BĐS Cấp 1</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5 text-slate-900">
            <Gift className="h-8 w-8 text-fuchsia-600 fill-fuchsia-100" />
            Giới Thiệu Khách Hàng & Hoa Hồng BĐS
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Cổng quản trị cộng tác viên chuyên nghiệp: Cấp link tiếp thị định danh, theo dõi hành trình chuyển đổi Lead, rút hoa hồng tự động và đường đua thưởng nóng du lịch/hiện vật.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          <Button 
            onClick={() => setShowAddLeadModal(true)}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold text-sm shadow-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Giới Thiệu Khách Mới
          </Button>

          <Button 
            onClick={() => setShowWithdrawModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm flex items-center gap-2"
          >
            <Banknote className="h-4 w-4" />
            Yêu Cầu Rút Tiền
          </Button>

          <Button 
            variant="outline"
            onClick={handleExportCSV}
            className="font-semibold text-sm border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Download className="h-4 w-4 text-slate-600" />
            Xuất Báo Cáo (CSV)
          </Button>
        </div>
      </div>

      {/* 4 Strategy KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng Hoa Hồng Tích Lũy</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                {(totalCommissionGenerated / 1000000).toFixed(1)} <span className="text-xs font-bold text-fuchsia-600">Triệu VNĐ</span>
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Đã trả: {(totalCommissionPaid / 1000000).toFixed(0)}Tr • Chờ duyệt: {(pendingDisbursement / 1000000).toFixed(0)}Tr
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-fuchsia-50 border border-fuchsia-100 flex items-center justify-center text-fuchsia-600">
              <Wallet className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Khách Hàng Đã Giới Thiệu</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
                <span>{referralLeads.length}</span>
                <span className="text-xs font-bold text-slate-500">Khách Hàng</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {successfulDealsCount} deal đã chốt cọc / giải ngân
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tỷ Lệ Chốt Thành Công</p>
              <h3 className="text-2xl md:text-3xl font-black text-emerald-600 mt-1">
                {conversionRate}%
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Cao gấp 3.5 lần so với kênh tự do
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Cấp Bậc Đối Tác</p>
              <h3 className="text-xl md:text-2xl font-black text-amber-600 mt-1 flex items-center gap-1.5">
                <span>Diamond Partner</span>
                <Award className="h-5 w-5 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Hoa hồng cố định 1.5% + Thưởng nóng
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Trophy className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: AFFILIATE TOOLKIT & METRICS (4/12) */}
        <div className="xl:col-span-4 space-y-6">
           
           {/* Affiliate Partner Card */}
           <Card className="shadow-lg border-fuchsia-200 relative overflow-hidden bg-white">
             <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <QrCode className="h-36 w-36 -mr-8 -mt-8 text-fuchsia-600" />
             </div>
             
             <CardContent className="p-5 md:p-6 relative z-10 space-y-4">
                <div className="flex justify-between items-center">
                  <Badge className="bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 font-bold text-xs px-2.5 py-1">
                    Mã CTV: {affiliateCode}
                  </Badge>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5" /> Hoạt động
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">Link Giới Thiệu Định Danh</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gắn cookie lưu vết 90 ngày. Mọi khách hàng điền form hoặc liên hệ qua link đều tự động tính hoa hồng 1.5% cho bạn.
                  </p>
                </div>
                
                {/* Input & Copy */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                      readOnly 
                      value={affiliateLink} 
                      className="pl-9 bg-slate-50 border-slate-200 font-mono text-xs text-slate-800 h-9 font-bold" 
                    />
                  </div>
                  <Button 
                    onClick={() => handleCopyLink(affiliateLink)} 
                    className={`h-9 px-3 transition-colors ${
                      copiedLink ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-fuchsia-600 hover:bg-fuchsia-700'
                    } text-white font-bold text-xs`}
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Quick Share Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Button 
                    variant="outline" 
                    className="border-slate-200 text-xs font-semibold hover:bg-slate-50 h-8"
                    onClick={() => {
                      showToast('Đang tạo và tải mã QR định danh PNG chuẩn in ấn...', 'info')
                    }}
                  >
                    <QrCode className="h-3.5 w-3.5 mr-1.5 text-slate-600" /> Tải QR PNG
                  </Button>

                  <Button 
                    variant="outline" 
                    className="border-slate-200 text-xs font-semibold hover:bg-slate-50 h-8"
                    onClick={() => {
                      showToast('Đang kết nối ứng dụng Zalo để chia sẻ bảng giá dự án...', 'info')
                    }}
                  >
                    <Share2 className="h-3.5 w-3.5 mr-1.5 text-blue-600" /> Share Zalo VIP
                  </Button>
                </div>
             </CardContent>
           </Card>

           {/* Wallet Available Balance Card */}
           <Card className="shadow-lg bg-gradient-to-tr from-slate-900 via-fuchsia-950 to-slate-900 text-white border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
              
              <CardContent className="p-5 md:p-6 relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-fuchsia-200 text-xs font-bold uppercase tracking-wider">
                    <Wallet className="h-4 w-4 text-fuchsia-400" />
                    <span>Ví Hoa Hồng Khả Dụng</span>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px]">
                    Rút ngay 24/7
                  </Badge>
                </div>

                <div>
                  <div className="text-3xl md:text-4xl font-black tracking-tight text-white">
                    {availableBalance.toLocaleString()} <span className="text-lg font-bold text-fuchsia-300">VNĐ</span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 flex items-center justify-between">
                    <span>Đang chờ giải ngân:</span>
                    <strong className="text-amber-300">{pendingDisbursement.toLocaleString()} VNĐ</strong>
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs text-slate-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <span className="font-bold text-white">Vietcombank - CN Tân Định</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Số tài khoản:</span>
                    <span className="font-mono font-bold text-amber-300">0071 0012 34567</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs h-10 rounded-xl shadow-lg" 
                  onClick={() => setShowWithdrawModal(true)}
                >
                  <Banknote className="h-4 w-4 mr-2 text-emerald-600" />
                  Rút Hoa Hồng Về Tài Khoản
                </Button>
              </CardContent>
           </Card>

           {/* AreaChart: Traffic & Deals */}
           <Card className="shadow-sm border border-slate-200">
             <CardHeader className="pb-2">
               <div className="flex items-center justify-between">
                 <div>
                   <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
                     Tăng Trưởng Lượt Click & Chốt Deal
                   </CardTitle>
                   <CardDescription className="text-xs mt-0.5">
                     Thống kê traffic qua 5 tuần gần nhất
                   </CardDescription>
                 </div>
                 <Badge variant="outline" className="text-[10px] text-fuchsia-700 bg-fuchsia-50 border-fuchsia-200">
                   Tháng 7/2026
                 </Badge>
               </div>
             </CardHeader>
             <CardContent className="pt-2">
               <div className="h-56 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="clickGrad" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4}/>
                         <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="dealGrad" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                         <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                     <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                     <YAxis yAxisId="left" stroke="#d946ef" fontSize={11} tickLine={false} />
                     <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={11} tickLine={false} />
                     <Tooltip 
                       formatter={(value: any, name: any) => [
                         value, 
                         name === 'click' ? 'Lượt Click Link' : 'Giao Dịch Chốt'
                       ]}
                       contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '12px' }}
                     />
                     <Area yAxisId="left" type="monotone" dataKey="click" stroke="#d946ef" strokeWidth={2} fillOpacity={1} fill="url(#clickGrad)" />
                     <Area yAxisId="right" type="monotone" dataKey="deal" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#dealGrad)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-slate-100 text-xs">
                 <span className="flex items-center gap-1.5 text-fuchsia-600 font-semibold">
                   <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 inline-block"></span> Lượt Click (Trục trái)
                 </span>
                 <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                   <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Deal Chốt (Trục phải)
                 </span>
               </div>
             </CardContent>
           </Card>

        </div>

        {/* RIGHT COLUMN: 4 TABS INTERFACE (8/12) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
           
           {/* Gamification Sales Race Banner */}
           <Card className="shadow-sm border-amber-200 bg-gradient-to-br from-amber-50/70 via-orange-50/60 to-yellow-50/70">
             <CardContent className="p-5 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="font-extrabold text-amber-950 text-base flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500 fill-amber-400" /> 
                      Đường Đua Doanh Số Tri Ân Đối Tác (Tháng 7/2026)
                    </h3>
                    <p className="text-xs text-amber-800/90 mt-0.5">
                      Chính sách thưởng nóng hiện vật độc quyền cho các deal phát sinh cọc trong tháng.
                    </p>
                  </div>
                  <Badge className="bg-amber-500 text-white font-bold text-xs px-3 py-1">
                    Đã đạt: {successfulDealsCount} Deal
                  </Badge>
                </div>
                
                {/* Visual Milestones */}
                <div className="relative pt-6 pb-2 px-2">
                  <div className="absolute top-[36px] left-6 right-6 h-2 bg-amber-200 rounded-full"></div>
                  <div 
                    className="absolute top-[36px] left-6 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 shadow-sm" 
                    style={{ width: `${Math.min((successfulDealsCount / 8) * 100, 100)}%` }}
                  ></div>
                  
                  <div className="relative grid grid-cols-4 gap-2">
                     
                     {/* Mốc 1: 1 Deal */}
                     <div className="flex flex-col items-center text-center">
                        <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center z-10 shadow-md ring-4 ring-amber-50">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                        <div className="font-bold text-xs text-amber-950 mt-1.5">1 Khách</div>
                        <div className="text-[11px] text-amber-700 font-medium">Voucher 5 Tr</div>
                     </div>

                     {/* Mốc 2: 3 Deals */}
                     <div className="flex flex-col items-center text-center">
                        <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center z-10 shadow-md ring-4 ring-amber-50">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                        <div className="font-bold text-xs text-amber-950 mt-1.5">3 Khách</div>
                        <div className="text-[11px] text-amber-700 font-medium">iPhone 16 Pro</div>
                     </div>

                     {/* Mốc 3: 5 Deals */}
                     <div className="flex flex-col items-center text-center">
                        <div className="h-9 w-9 rounded-full bg-amber-500 text-white flex items-center justify-center z-10 shadow-md ring-4 ring-amber-50">
                          <Check className="h-4 w-4 stroke-[3]" />
                        </div>
                        <div className="font-bold text-xs text-amber-950 mt-1.5">5 Khách</div>
                        <div className="text-[11px] text-amber-700 font-medium">Tour Maldives</div>
                     </div>

                     {/* Mốc 4: 8 Deals (Target) */}
                     <div className="flex flex-col items-center text-center">
                        <div className="h-9 w-9 rounded-full bg-white border-2 border-amber-400 text-amber-500 flex items-center justify-center z-10 shadow-sm">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="font-bold text-xs text-amber-950 mt-1.5">8 Khách</div>
                        <div className="text-[11px] text-amber-700 font-bold">1 Cây Vàng SJC</div>
                     </div>

                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded-xl bg-amber-100/70 border border-amber-200/80 text-xs text-amber-900 font-medium flex items-center justify-between">
                  <span>Chúc mừng bạn đã mở khóa <strong>Tour Maldives 5 Sao</strong>! Chỉ cần thêm <strong>3 deal</strong> nữa để rinh <strong>01 Cây Vàng SJC 9999</strong>!</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => showToast('Đã gửi thông tin đăng ký nhận thưởng Tour Maldives đến Ban Giám Đốc!', 'success')}
                    className="text-xs h-7 bg-white text-amber-800 border-amber-300 font-bold hover:bg-amber-50"
                  >
                    Nhận Thưởng Ngay
                  </Button>
                </div>
             </CardContent>
           </Card>

           {/* Tabs System */}
           <Tabs defaultValue="deals" className="w-full">
             <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1.5 mb-6 bg-slate-100 rounded-xl gap-1">
               <TabsTrigger value="deals" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
                 <Users className="h-4 w-4 text-fuchsia-600"/> Sổ Deal Giới Thiệu
               </TabsTrigger>
               <TabsTrigger value="toolkit" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
                 <LinkIcon className="h-4 w-4 text-blue-600"/> Bộ Link & QR Dự Án
               </TabsTrigger>
               <TabsTrigger value="payouts" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
                 <Wallet className="h-4 w-4 text-emerald-600"/> Lịch Sử Rút Hoa Hồng
               </TabsTrigger>
               <TabsTrigger value="leaderboard" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
                 <Trophy className="h-4 w-4 text-amber-600"/> Bảng Vàng CTV
               </TabsTrigger>
             </TabsList>

             {/* 1. DEALS TAB */}
             <TabsContent value="deals" className="space-y-4">
                
                {/* Search & Filter Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Tìm kiếm khách hàng, số điện thoại, mã căn hộ..." 
                        value={dealSearch}
                        onChange={(e) => setDealSearch(e.target.value)}
                        className="pl-9 text-xs h-9"
                      />
                    </div>
                    {dealSearch && (
                      <Button size="sm" variant="ghost" onClick={() => setDealSearch('')} className="text-xs h-9">
                        Xóa tìm
                      </Button>
                    )}
                  </div>

                  {/* Dropdown Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Dự Án</label>
                      <select 
                        value={selectedProjectFilter}
                        onChange={(e) => setSelectedProjectFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                      >
                        <option value="all">Tất cả dự án</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Trạng Thái Deal</label>
                      <select 
                        value={dealStatusFilter}
                        onChange={(e) => setDealStatusFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                      >
                        <option value="all">Mọi trạng thái deal</option>
                        <option value="Đã giải ngân">Đã giải ngân</option>
                        <option value="Đã đặt cọc">Đã đặt cọc</option>
                        <option value="Đang tư vấn">Đang tư vấn</option>
                        <option value="Hủy giao dịch">Hủy giao dịch</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Thanh Toán Hoa Hồng</label>
                      <select 
                        value={payStatusFilter}
                        onChange={(e) => setPayStatusFilter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                      >
                        <option value="all">Mọi trạng thái tiền</option>
                        <option value="Đã thanh toán">Đã thanh toán</option>
                        <option value="Chờ giải ngân">Chờ giải ngân</option>
                        <option value="Chưa phát sinh">Chưa phát sinh</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Table View */}
                <Card className="shadow-sm border border-slate-200 bg-white overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow className="text-xs">
                          <TableHead className="font-bold">Khách Hàng</TableHead>
                          <TableHead className="font-bold">Dự Án / Mã Căn</TableHead>
                          <TableHead className="font-bold text-right">Giá Trị Deal</TableHead>
                          <TableHead className="font-bold text-right">Hoa Hồng (VNĐ)</TableHead>
                          <TableHead className="font-bold">Trạng Thái Deal</TableHead>
                          <TableHead className="font-bold">Thanh Toán</TableHead>
                          <TableHead className="font-bold text-center">Thao Tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-xs font-medium">
                        {filteredLeads.map((row) => (
                          <TableRow key={row.id} className="hover:bg-slate-50/80 transition-colors">
                            <TableCell>
                              <div className="font-bold text-slate-900">{row.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">{row.phone}</div>
                            </TableCell>

                            <TableCell>
                              <div className="font-semibold text-slate-800">{row.projectName}</div>
                              <div className="text-[11px] text-indigo-600 font-mono">{row.propertyCode || 'Đang chọn căn'}</div>
                            </TableCell>

                            <TableCell className="text-right font-mono font-bold text-slate-700">
                              {(row.dealValue / 1000000000).toFixed(2)} Tỷ
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="font-mono font-extrabold text-fuchsia-700">
                                {row.commissionAmount.toLocaleString()}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">({row.commissionRate}%)</div>
                            </TableCell>

                            <TableCell>
                              <Badge variant="outline" className={`text-[10px] font-bold ${
                                row.status === 'Đã giải ngân' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                row.status === 'Đã đặt cọc' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                row.status === 'Đang tư vấn' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                'bg-slate-50 text-slate-600 border-slate-200'
                              }`}>
                                {row.status}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              {row.payStatus === 'Đã thanh toán' && (
                                <Badge className="bg-emerald-600 text-white text-[10px] font-semibold">
                                  <Check className="h-3 w-3 mr-1" /> Đã chi trả
                                </Badge>
                              )}
                              {row.payStatus === 'Chờ giải ngân' && (
                                <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-[10px] font-semibold">
                                  <Clock className="h-3 w-3 mr-1" /> Chờ ngân hàng
                                </Badge>
                              )}
                              {row.payStatus === 'Chưa phát sinh' && (
                                <span className="text-[11px] text-slate-400">Chưa phát sinh</span>
                              )}
                            </TableCell>

                            <TableCell className="text-center">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setSelectedDealModal(row)}
                                className="text-xs h-7 px-2.5 font-bold border-slate-200 text-slate-700 hover:bg-slate-100"
                              >
                                Chi Tiết
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}

                        {filteredLeads.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                              Không có deal nào thỏa mãn điều kiện lọc.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </Card>

             </TabsContent>

             {/* 2. TOOLKIT & PROJECT LINKS TAB */}
             <TabsContent value="toolkit" className="space-y-4">
                
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-blue-600" />
                      Trình Sinh Link Tiếp Thị & Mã QR Theo Từng Dự Án
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Tạo liên kết chuyên biệt cho từng đại dự án để chia sẻ trực tiếp với nhóm khách hàng mục tiêu
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-5 space-y-6">
                    {/* Project Selector Pills */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        1. Chọn Dự Án Cần Quảng Bá
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {projects.slice(0, 4).map(p => (
                          <button
                            key={p.id}
                            onClick={() => setSelectedShareProject(p.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              selectedShareProject === p.id 
                                ? 'bg-fuchsia-50/80 border-fuchsia-300 ring-2 ring-fuchsia-400/30' 
                                : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <div className="font-bold text-xs text-slate-900 line-clamp-1">{p.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{p.location}</div>
                            <div className="text-[10px] font-bold text-fuchsia-600 mt-1">Hoa hồng 1.5%</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Resulting URL & QR */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                          <QrCode className="h-28 w-28 text-slate-900" />
                          <div className="text-[10px] text-slate-400 text-center font-mono mt-1">Quét bằng Zalo</div>
                        </div>

                        <div className="flex-1 space-y-2 w-full">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Link Giới Thiệu Riêng Biệt ({currentShareProj.name}):</span>
                            <Badge className="bg-blue-100 text-blue-800 text-[10px]">UTM Tagged</Badge>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Input 
                              readOnly 
                              value={projectReferralUrl}
                              className="font-mono text-xs bg-white border-slate-200 font-bold"
                            />
                            <Button 
                              size="sm"
                              onClick={() => handleCopyLink(projectReferralUrl)}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0"
                            >
                              Sao Chép Link
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => showToast('Đang tải bộ Brochure PDF & Mặt bằng căn hộ dự án...', 'info')}
                              className="text-xs h-8 border-slate-300"
                            >
                              <FileText className="h-3.5 w-3.5 mr-1 text-slate-500" /> Tải Brochure Bán Hàng
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => showToast('Đang tải file nén Media Kit (Video 4K, Flycam tiến độ)...', 'info')}
                              className="text-xs h-8 border-slate-300"
                            >
                              <Download className="h-3.5 w-3.5 mr-1 text-slate-500" /> Tải Video Flycam 4K
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pre-written Copywriting Templates */}
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                        2. Mẫu Tin Nhắn Tư Vấn Giàu Cảm Xúc (Dành Cho Zalo / Messenger)
                      </label>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
                        <div className="font-semibold text-slate-900">
                          🌟 CƠ HỘI SỞ HỮU BIỆT THỰ VEN SÔNG ĐẲNG CẤP TẠI {currentShareProj.name.toUpperCase()}
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                          Dạ chào Anh/Chị, em xin phép gửi thông tin phân khu mới ra mắt với chính sách ân hạn gốc & lãi 0% trong 24 tháng. Đặt cọc sớm tặng ngay gói nội thất cao cấp 500 triệu và đặc quyền du thuyền riêng.
                        </p>
                        <p className="font-mono text-indigo-600 font-bold">
                          👉 Xem bảng giá chi tiết & rổ hàng ngoại giao: {projectReferralUrl}
                        </p>
                        <div className="pt-2 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleCopySnippet(`🌟 CƠ HỘI SỞ HỮU BĐS ĐẲNG CẤP TẠI ${currentShareProj.name.toUpperCase()}\n\nDạ chào Anh/Chị, em xin phép gửi thông tin phân khu mới với chính sách hỗ trợ lãi suất 0% trong 24 tháng. Xem bảng giá chi tiết tại: ${projectReferralUrl}`, 'Bài đăng')}
                            className="text-xs text-fuchsia-600 hover:text-fuchsia-800 font-bold h-7"
                          >
                            <Copy className="h-3.5 w-3.5 mr-1" /> Sao Chép Toàn Bộ Đoạn Văn
                          </Button>
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>

             </TabsContent>

             {/* 3. PAYOUTS TAB */}
             <TabsContent value="payouts" className="space-y-4">
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">Lịch Sử Chi Trả Hoa Hồng Thực Nhận</CardTitle>
                      <CardDescription className="text-xs">Theo dõi dòng tiền thanh toán và biên bản đối soát chuyển khoản ngân hàng</CardDescription>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => setShowWithdrawModal(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      + Yêu Cầu Rút Tiền
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-slate-50 text-xs">
                        <TableRow>
                          <TableHead className="font-bold">Mã Giao Dịch</TableHead>
                          <TableHead className="font-bold">Số Tiền (VNĐ)</TableHead>
                          <TableHead className="font-bold">Tài Khoản Thụ Hưởng</TableHead>
                          <TableHead className="font-bold">Ngày Yêu Cầu</TableHead>
                          <TableHead className="font-bold">Trạng Thái</TableHead>
                          <TableHead className="font-bold text-center">Biên Lai UNC</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="text-xs font-medium">
                        {commissionPayouts.map(p => (
                          <TableRow key={p.id} className="hover:bg-slate-50">
                            <TableCell className="font-mono font-bold text-slate-800">{p.referenceCode}</TableCell>
                            <TableCell className="font-mono font-black text-emerald-600 text-sm">
                              {p.amount.toLocaleString()} VNĐ
                            </TableCell>
                            <TableCell>
                              <div className="font-semibold text-slate-800">{p.bankName}</div>
                              <div className="text-[11px] font-mono text-slate-500">{p.accountNumber} - {p.accountHolder}</div>
                            </TableCell>
                            <TableCell>{p.date}</TableCell>
                            <TableCell>
                              <Badge className={`text-[10px] font-bold ${
                                p.status === 'Đã chi trả' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                                'bg-amber-100 text-amber-800 border-amber-200'
                              }`}>
                                {p.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => setSelectedPayoutReceipt(p)}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold h-7"
                              >
                                Xem UNC
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
             </TabsContent>

             {/* 4. LEADERBOARD TAB */}
             <TabsContent value="leaderboard" className="space-y-4">
                <Card className="shadow-sm border border-slate-200 bg-white">
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      Bảng Xếp Hạng Top Cộng Tác Viên Xuất Sắc (Tháng 7/2026)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Vinh danh các đối tác có doanh số chốt cọc ấn tượng nhất trong tháng
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {LEADERBOARD_DATA.map((item) => (
                        <div key={item.rank} className={`p-4 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          item.code === affiliateCode ? 'bg-fuchsia-50/40' : ''
                        }`}>
                          <div className="flex items-center gap-3.5">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                              item.rank === 1 ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-100' :
                              item.rank === 2 ? 'bg-slate-300 text-slate-800' :
                              item.rank === 3 ? 'bg-amber-700 text-white' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {item.rank}
                            </div>
                            
                            <div className="h-10 w-10 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {item.avatar}
                            </div>

                            <div>
                              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                                <span>{item.name}</span>
                                {item.code === affiliateCode && (
                                  <Badge className="bg-fuchsia-600 text-white text-[10px] px-1.5 py-0">Bạn</Badge>
                                )}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5">
                                Mã: <span className="font-mono font-bold text-slate-700">{item.code}</span> • <span className="text-indigo-600 font-semibold">{item.tier}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm md:text-base font-black text-emerald-600 font-mono">
                              {item.commission.toLocaleString()} VNĐ
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              Đã chốt: <strong className="text-slate-800">{item.deals} Deal</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
             </TabsContent>

           </Tabs>
        </div>

      </div>

      {/* ================= MODAL 1: GIỚI THIỆU KHÁCH HÀNG MỚI ================= */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus className="h-5 w-5 text-fuchsia-400" />
                  Đăng Ký Khách Hàng Giới Thiệu Mới
                </h3>
                <p className="text-xs text-slate-400 mt-1">Thông tin sẽ được ghi nhận vào CRM và gắn mã CTV {affiliateCode}</p>
              </div>
              <button 
                onClick={() => setShowAddLeadModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLeadSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Họ Tên Khách Hàng *
                  </label>
                  <Input 
                    value={newLeadForm.name}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                    placeholder="Ví dụ: Nguyễn Hoàng Nam"
                    className="text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Số Điện Thoại *
                  </label>
                  <Input 
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="Ví dụ: 0909 888 999"
                    className="font-mono text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Email Khách Hàng (Tùy chọn)
                </label>
                <Input 
                  type="email"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  placeholder="nam.nguyen@company.com"
                  className="text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Dự Án Quan Tâm
                  </label>
                  <select 
                    value={newLeadForm.projectId}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, projectId: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Giá Trị Dự Kiến (VNĐ)
                  </label>
                  <Input 
                    type="number"
                    value={newLeadForm.dealValue}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, dealValue: e.target.value })}
                    className="font-mono text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Ghi Chú Nhu Cầu & Thời Gian Tiện Liên Hệ
                </label>
                <textarea 
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="Khách cần căn 3PN view hồ bơi, hẹn gọi lại sau 17h chiều..."
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs min-h-[60px]"
                />
              </div>

              <div className="p-3 bg-fuchsia-50 rounded-xl border border-fuchsia-200 flex justify-between items-center text-xs text-fuchsia-900">
                <span>Hoa hồng dự kiến khi chốt cọc:</span>
                <span className="font-mono font-black text-fuchsia-700 text-sm">
                  {Math.round(((parseFloat(newLeadForm.dealValue) || 5000000000) * 1.5) / 100).toLocaleString()} VNĐ (1.5%)
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddLeadModal(false)}
                  className="text-xs font-semibold"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md"
                >
                  Xác Nhận Giới Thiệu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: YÊU CẦU RÚT TIỀN HOA HỒNG ================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-emerald-400" />
                  Yêu Cầu Rút Tiền Hoa Hồng
                </h3>
                <p className="text-xs text-slate-400 mt-1">Giải ngân nhanh qua hệ thống Napas 24/7 sau khi duyệt</p>
              </div>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-4">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between items-center text-xs text-emerald-900">
                <span>Số dư khả dụng có thể rút ngay:</span>
                <span className="font-mono font-black text-emerald-700 text-base">
                  {availableBalance.toLocaleString()} VNĐ
                </span>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Số Tiền Yêu Cầu Rút (VNĐ) *
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setWithdrawForm({ ...withdrawForm, amount: availableBalance.toString() })}
                    className="text-xs text-indigo-600 hover:underline font-bold"
                  >
                    Rút toàn bộ
                  </button>
                </div>
                <Input 
                  type="number"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  className="font-mono text-sm font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Ngân Hàng Nhận
                  </label>
                  <select 
                    value={withdrawForm.bankName}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                  >
                    <option value="Vietcombank">Vietcombank</option>
                    <option value="Techcombank">Techcombank</option>
                    <option value="MBBank">MBBank</option>
                    <option value="VPBank">VPBank</option>
                    <option value="BIDV">BIDV</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Số Tài Khoản
                  </label>
                  <Input 
                    value={withdrawForm.accountNumber}
                    onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                    className="font-mono text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Tên Chủ Tài Khoản (In hoa không dấu)
                </label>
                <Input 
                  value={withdrawForm.accountHolder}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountHolder: e.target.value.toUpperCase() })}
                  className="font-mono text-xs font-bold uppercase"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Ghi Chú Rút Tiền
                </label>
                <Input 
                  value={withdrawForm.note}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, note: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowWithdrawModal(false)}
                  className="text-xs font-semibold"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                >
                  Gửi Lệnh Rút Tiền
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CHI TIẾT DEAL BĐS ================= */}
      {selectedDealModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  Hồ Sơ Chi Tiết Deal Giới Thiệu
                </h3>
                <p className="text-xs text-slate-400 mt-1">Mã Deal: {selectedDealModal.id} • CTV: {selectedDealModal.affiliateCode}</p>
              </div>
              <button 
                onClick={() => setSelectedDealModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Khách Hàng:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedDealModal.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Số điện thoại:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedDealModal.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Dự án & Căn hộ:</span>
                  <span className="font-semibold text-indigo-700">{selectedDealModal.projectName} ({selectedDealModal.propertyCode || 'Chưa chốt'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Giá trị hợp đồng:</span>
                  <span className="font-mono font-bold text-slate-900">{(selectedDealModal.dealValue / 1000000000).toFixed(2)} Tỷ VNĐ</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-slate-500 font-semibold">Hoa hồng CTV ({selectedDealModal.commissionRate}%):</span>
                  <span className="font-mono font-black text-fuchsia-600 text-sm">{selectedDealModal.commissionAmount.toLocaleString()} VNĐ</span>
                </div>
              </div>

              {/* Progress Milestones of Deal */}
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-2">Tiến Độ Giải Ngân Hoa Hồng:</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900">
                    <span className="font-semibold">Đợt 1 (30% khi ký Hợp đồng cọc):</span>
                    <span className="font-mono font-bold">{Math.round(selectedDealModal.commissionAmount * 0.3).toLocaleString()} VNĐ</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700">
                    <span className="font-semibold">Đợt 2 (70% khi Ngân hàng giải ngân / Ký HĐMB):</span>
                    <span className="font-mono font-bold">{Math.round(selectedDealModal.commissionAmount * 0.7).toLocaleString()} VNĐ</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Ghi chú tác nghiệp:</span>
                <p className="p-2.5 bg-slate-50 rounded-lg text-slate-600 leading-relaxed">
                  {selectedDealModal.notes || 'Khách hàng có thiện chí cao, đang làm việc với chuyên viên thẩm định pháp lý.'}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDealModal(null)}
                  className="text-xs"
                >
                  Đóng
                </Button>
                <Button 
                  onClick={() => {
                    showToast(`Đã gửi thông báo nhắc nhở chuyên viên hỗ trợ deal cho ${selectedDealModal.name}!`, 'info')
                    setSelectedDealModal(null)
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  Hối Thúc Tiến Độ CSKH
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: BIÊN LAI ỦY NHIỆM CHI UNC ================= */}
      {selectedPayoutReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            <div className="p-6 text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCheck className="h-6 w-6" />
              </div>

              <div>
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-bold">
                  Giao dịch chuyển khoản thành công
                </Badge>
                <h3 className="text-xl font-black mt-2 font-mono text-slate-900">
                  {selectedPayoutReceipt.amount.toLocaleString()} VNĐ
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Số UNC: {selectedPayoutReceipt.referenceCode}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng phát lệnh:</span>
                  <span className="font-bold text-slate-900">Vietcombank TP.HCM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Đơn vị chi trả:</span>
                  <span className="font-bold text-slate-900">TẬP ĐOÀN NOVALAND</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Người thụ hưởng:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedPayoutReceipt.accountHolder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tài khoản nhận:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedPayoutReceipt.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngày giờ phát lệnh:</span>
                  <span className="font-mono text-slate-700">{selectedPayoutReceipt.date} 14:28:10</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-slate-500">Nội dung:</span>
                  <span className="font-medium text-slate-800 text-right max-w-[200px] truncate">{selectedPayoutReceipt.note || 'Chi tra hoa hong CTV'}</span>
                </div>
              </div>

              <Button 
                onClick={() => setSelectedPayoutReceipt(null)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 rounded-xl"
              >
                Đóng Biên Lai
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
