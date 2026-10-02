"use client"

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ClipboardCheck, Smile, Star, Target, Activity, 
  ThumbsUp, MessageSquare, Send, Link2, Eye, 
  BarChart2, Flame, Meh, Frown, Sparkles, Plus,
  MessageCircleQuestion, QrCode, Download, Search, 
  Filter, CheckCircle2, AlertTriangle, Clock, PhoneCall, 
  Smartphone, Share2, RefreshCw, Copy, Check, ExternalLink, 
  ShieldAlert, Award, Zap, Settings2, TrendingUp, UserCheck,
  HeartHandshake, ChevronRight, HelpCircle
} from 'lucide-react'
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell 
} from 'recharts'
import { useStore } from '@/store/useStore'
import { Review, SurveyCampaign } from '@/types'

export default function SurveysPage() {
  const { reviews, surveyCampaigns, projects, customers, addReview, resolveComplaint, addSurveyCampaign, toggleSurveyCampaignStatus } = useStore()

  // Tab State
  const [activeTab, setActiveTab] = useState("overview")

  // Filter States for Live Feed
  const [searchQuery, setSearchQuery] = useState("")
  const [channelFilter, setChannelFilter] = useState("all")
  const [sentimentFilter, setSentimentFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Modal States
  const [showSimModal, setShowSimModal] = useState(false)
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Review | null>(null)
  const [selectedCampaignReport, setSelectedCampaignReport] = useState<SurveyCampaign | null>(null)

  // Simulator Form State
  const [simName, setSimName] = useState("Nguyễn Hoàng Nam")
  const [simPhone, setSimPhone] = useState("0918889999")
  const [simProject, setSimProject] = useState("The Grand Manhattan")
  const [simChannel, setSimChannel] = useState("Post-Sale Form")
  const [simRating, setSimRating] = useState(5)
  const [simNps, setSimNps] = useState(10)
  const [simCes, setSimCes] = useState(7)
  const [simText, setSimText] = useState("Dịch vụ tư vấn chuyên nghiệp, thủ tục ký quỹ và cọc diễn ra thuận lợi!")

  // Complaint Resolution Form State
  const [resolutionStaff, setResolutionStaff] = useState("Trần Minh Quân")
  const [resolutionNotes, setResolutionNotes] = useState("")

  // Create Campaign Form State
  const [newCampName, setNewCampName] = useState("")
  const [newCampTrigger, setNewCampTrigger] = useState("Tự động gửi Zalo ZNS sau 2h tham quan Showroom")
  const [newCampChannel, setNewCampChannel] = useState("Zalo ZNS")
  const [newCampTarget, setNewCampTarget] = useState("Khách tham quan sa bàn")
  const [newCampReward, setNewCampReward] = useState("300")

  // Interactive Mobile Builder Form State
  const [builderProject, setBuilderProject] = useState("The Grand Manhattan")
  const [builderNps, setBuilderNps] = useState(9)
  const [builderCsat, setBuilderCsat] = useState(5)
  const [builderCes, setBuilderCes] = useState(6)
  const [builderName, setBuilderName] = useState("")
  const [builderPhone, setBuilderPhone] = useState("")
  const [builderComment, setBuilderComment] = useState("")
  const [builderSubmitted, setBuilderSubmitted] = useState(false)

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Live Metrics Calculations
  const totalReviews = reviews.length || 1

  // CSAT = % of reviews with rating >= 4
  const satisfiedReviews = reviews.filter(r => r.rating >= 4).length
  const csat = Math.round((satisfiedReviews / totalReviews) * 100)

  // NPS: 9-10 (or 5 star) = Promoter, 7-8 (or 4 star) = Passive, 0-6 (or 1-3 star) = Detractor
  const promoters = reviews.filter(r => (r.npsScore && r.npsScore >= 9) || r.rating === 5).length
  const passives = reviews.filter(r => (r.npsScore && (r.npsScore === 7 || r.npsScore === 8)) || r.rating === 4).length
  const detractors = reviews.filter(r => (r.npsScore && r.npsScore <= 6) || r.rating <= 3).length

  const pctPromoters = Math.round((promoters / totalReviews) * 100)
  const pctPassives = Math.round((passives / totalReviews) * 100)
  const pctDetractors = Math.round((detractors / totalReviews) * 100)
  const nps = pctPromoters - pctDetractors

  // Avg Rating
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)

  // Customer Effort Score (CES average out of 7.0)
  const avgCes = (reviews.reduce((acc, r) => acc + (r.cesScore || (r.rating >= 4 ? 6 : 3)), 0) / totalReviews).toFixed(1)

  // Pending complaints count
  const pendingComplaints = reviews.filter(r => r.sentiment === 'negative' && r.resolutionStatus === 'pending').length

  // Filtered Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchSearch = 
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.projectName && r.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.phone && r.phone.includes(searchQuery))
      
      const matchChannel = channelFilter === 'all' || r.channel === channelFilter || r.source === channelFilter
      const matchSentiment = sentimentFilter === 'all' || r.sentiment === sentimentFilter
      const matchRating = ratingFilter === 'all' || r.rating === parseInt(ratingFilter)
      const matchStatus = statusFilter === 'all' || r.resolutionStatus === statusFilter

      return matchSearch && matchChannel && matchSentiment && matchRating && matchStatus
    })
  }, [reviews, searchQuery, channelFilter, sentimentFilter, ratingFilter, statusFilter])

  // Trend Data for 6-Month Chart
  const trendData = [
    { month: 'T2/2026', csat: 85, nps: 45, responses: 110 },
    { month: 'T3/2026', csat: 87, nps: 49, responses: 142 },
    { month: 'T4/2026', csat: 90, nps: 54, responses: 185 },
    { month: 'T5/2026', csat: 88, nps: 51, responses: 160 },
    { month: 'T6/2026', csat: 91, nps: 56, responses: 220 },
    { month: 'T7/2026 (Nay)', csat: csat, nps: nps, responses: reviews.length * 28 },
  ]

  // Channel Breakdown
  const channelData = [
    { name: 'Zalo ZNS', count: reviews.filter(r => (r.channel || r.source).includes('Zalo')).length, fill: '#0068ff' },
    { name: 'Post-Sale Form', count: reviews.filter(r => (r.channel || r.source).includes('Post-Sale')).length, fill: '#6366f1' },
    { name: 'Google Review', count: reviews.filter(r => (r.channel || r.source).includes('Google')).length, fill: '#ea4335' },
    { name: 'Showroom Kiosk', count: reviews.filter(r => (r.channel || r.source).includes('Kiosk')).length, fill: '#f59e0b' },
    { name: 'SMS Link', count: reviews.filter(r => (r.channel || r.source).includes('SMS')).length, fill: '#10b981' },
  ]

  // Handle Simulation Submission
  const handleSimulateSubmit = () => {
    if (!simText.trim()) {
      showToast("Vui lòng nhập nội dung đánh giá!")
      return
    }

    addReview({
      customerId: `c-guest-${Date.now()}`,
      customerName: simName || 'Khách Vãng Lai',
      phone: simPhone,
      projectName: simProject,
      channel: simChannel,
      rating: simRating,
      source: simChannel,
      text: simText,
      npsScore: simNps,
      cesScore: simCes
    })

    setShowSimModal(false)
    setSimText("")
    showToast(`Đã thêm đánh giá từ ${simName}. Các chỉ số NPS & CSAT đã được tính toán lại ngay lập tức!`)
  }

  // Handle Mobile Builder Live Test Submission
  const handleBuilderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!builderName.trim() || !builderComment.trim()) {
      showToast("Vui lòng nhập Họ tên và Nội dung góp ý!")
      return
    }

    addReview({
      customerId: `c-builder-${Date.now()}`,
      customerName: builderName,
      phone: builderPhone || '0901234567',
      projectName: builderProject,
      channel: 'Post-Sale Form',
      rating: builderCsat,
      source: 'Mobile Survey Webform',
      text: builderComment,
      npsScore: builderNps,
      cesScore: builderCes
    })

    setBuilderSubmitted(true)
    showToast(`Cảm ơn Quý khách ${builderName}! Bạn đã nhận được +200 Điểm Thưởng Khách Hàng Thân Thiết.`)
  }

  const handleResetBuilder = () => {
    setBuilderSubmitted(false)
    setBuilderName("")
    setBuilderPhone("")
    setBuilderComment("")
    setBuilderNps(9)
    setBuilderCsat(5)
    setBuilderCes(6)
  }

  // Handle Complaint Resolution
  const handleResolveComplaint = () => {
    if (!selectedComplaint) return
    resolveComplaint(
      selectedComplaint.id,
      resolutionNotes || "Đã liên hệ trực tiếp xin lỗi và đưa ra giải pháp bồi thường/khắc phục thỏa đáng.",
      resolutionStaff
    )
    showToast(`Khiếu nại của khách hàng ${selectedComplaint.customerName} đã được đánh dấu Đã Xử Lý.`)
    setSelectedComplaint(null)
    setResolutionNotes("")
  }

  // Handle Create Survey Campaign
  const handleCreateCampaign = () => {
    if (!newCampName.trim()) {
      showToast("Vui lòng nhập Tên chiến dịch khảo sát!")
      return
    }

    addSurveyCampaign({
      name: newCampName,
      trigger: newCampTrigger,
      channel: newCampChannel,
      targetAudience: newCampTarget,
      rewardPoints: parseInt(newCampReward) || 200,
      status: 'active'
    })

    setShowCreateCampaignModal(false)
    setNewCampName("")
    showToast(`Chiến dịch khảo sát "${newCampName}" đã được kích hoạt thành công!`)
  }

  // Export CSV Function (UTF-8 BOM)
  const handleExportCSV = () => {
    const headers = ["ID", "Khách Hàng", "Số Điện Thoại", "Dự Án", "Kênh Thu Thập", "Số Sao (CSAT)", "Điểm NPS", "Điểm CES", "Cảm Xúc AI", "Trạng Thái Xử Lý", "Nhân Viên Phụ Trách", "Ngày Gửi", "Nội Dung Đánh Giá", "Ghi Chú Khắc Phục"]
    const rows = reviews.map(r => [
      `"${r.id}"`,
      `"${r.customerName.replace(/"/g, '""')}"`,
      `"${r.phone || 'N/A'}"`,
      `"${(r.projectName || 'Tất cả').replace(/"/g, '""')}"`,
      `"${r.channel || r.source}"`,
      r.rating,
      r.npsScore || (r.rating === 5 ? 10 : r.rating * 2),
      r.cesScore || 6,
      `"${r.sentiment === 'positive' ? 'Tích cực' : r.sentiment === 'negative' ? 'Tiêu cực' : 'Trung tính'}"`,
      `"${r.resolutionStatus === 'resolved' ? 'Đã xử lý' : r.resolutionStatus === 'pending' ? 'Chờ xử lý' : 'Đã leo thang'}"`,
      `"${r.assignedStaff || 'Chưa phân bổ'}"`,
      `"${r.date}"`,
      `"${r.text.replace(/"/g, '""')}"`,
      `"${(r.resolutionNotes || '').replace(/"/g, '""')}"`
    ])

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(row => row.join(","))].join("\r\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `Bao_Cao_Khao_Sat_NPS_CSAT_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Đã tải xuống file CSV báo cáo khảo sát trải nghiệm khách hàng!")
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

      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-600">
              <ClipboardCheck className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Khảo Sát & Đo Lường Trải Nghiệm Khách Hàng (CX)
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Đo lường thời gian thực chỉ số NPS, CSAT, CES và phân loại cảm xúc đa kênh bằng AI NLP.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
          >
            <Download className="h-4 w-4 mr-1.5 text-slate-500" /> Xuất Báo Cáo CSV
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowQrModal(true)}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
          >
            <QrCode className="h-4 w-4 mr-1.5 text-indigo-600" /> QR Khảo Sát Kiosk
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSimModal(true)}
            className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold"
          >
            <MessageCircleQuestion className="h-4 w-4 mr-1.5" /> Giả Lập Review
          </Button>

          <Button 
            size="sm"
            onClick={() => setShowCreateCampaignModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Tạo Chiến Dịch Mới
          </Button>
        </div>
      </div>

      {/* TOP STRATEGY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* 1. NPS Card */}
        <Card className={`shadow-sm relative overflow-hidden transition-all border ${nps >= 50 ? 'border-emerald-200 bg-emerald-50/20' : nps >= 20 ? 'border-blue-200 bg-blue-50/20' : 'border-rose-200 bg-rose-50/20'}`}>
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <Target className="w-28 h-28 -mt-2 -mr-2 text-slate-800" />
          </div>
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chỉ Số NPS Tự Động</span>
              <Badge className={nps >= 50 ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-100' : 'bg-blue-100 text-blue-800'}>
                {nps >= 50 ? 'Xuất Sắc' : nps >= 20 ? 'Tốt' : 'Cần Chú Ý'}
              </Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-black ${nps >= 50 ? 'text-emerald-600' : nps >= 20 ? 'text-blue-600' : 'text-rose-600'}`}>
                {nps > 0 ? `+${nps}` : nps}
              </span>
              <span className="text-xs font-semibold text-slate-500">(-100 đến +100)</span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span className="text-emerald-600">Promoters: {pctPromoters}%</span>
                <span className="text-slate-500">Passives: {pctPassives}%</span>
                <span className="text-rose-600">Detractors: {pctDetractors}%</span>
              </div>
              <div className="flex h-2.5 w-full rounded-full overflow-hidden bg-slate-200 shadow-inner">
                <div style={{ width: `${pctPromoters}%` }} className="bg-emerald-500 transition-all duration-500" title={`Promoters: ${pctPromoters}%`} />
                <div style={{ width: `${pctPassives}%` }} className="bg-slate-400 transition-all duration-500" title={`Passives: ${pctPassives}%`} />
                <div style={{ width: `${pctDetractors}%` }} className="bg-rose-500 transition-all duration-500" title={`Detractors: ${pctDetractors}%`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. CSAT Card */}
        <Card className={`shadow-sm relative overflow-hidden transition-all border ${csat >= 85 ? 'border-blue-200 bg-blue-50/20' : 'border-amber-200 bg-amber-50/20'}`}>
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <Smile className="w-28 h-28 -mt-2 -mr-2 text-blue-600" />
          </div>
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Hài Lòng CSAT</span>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">Mục tiêu 85%</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-blue-700">{csat}%</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +4.2% MoM
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-3 font-medium">
              Có <strong className="text-slate-900">{satisfiedReviews}/{totalReviews}</strong> đánh giá tích cực (4-5 sao).
            </p>
          </CardContent>
        </Card>

        {/* 3. Avg Rating Card */}
        <Card className="shadow-sm relative overflow-hidden border border-amber-200 bg-amber-50/20">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <Star className="w-28 h-28 -mt-2 -mr-2 text-amber-500 fill-amber-500" />
          </div>
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đánh Giá Trung Bình</span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">
                5 Sao Scale
              </Badge>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-amber-600">{avgRating}</span>
              <span className="text-base font-bold text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-2.5">
              {[1, 2, 3, 4, 5].map(star => (
                <Star 
                  key={star} 
                  className={`h-4 w-4 ${star <= Math.round(parseFloat(avgRating)) ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-100'}`} 
                />
              ))}
              <span className="text-xs font-bold text-slate-600 ml-1.5">({reviews.length} đánh giá)</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. CES & Complaints Card */}
        <Card className={`shadow-sm relative overflow-hidden border ${pendingComplaints > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-indigo-200 bg-indigo-50/20'}`}>
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
            <ShieldAlert className="w-28 h-28 -mt-2 -mr-2 text-indigo-600" />
          </div>
          <CardContent className="p-5 relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thủ Tục Tiện Lợi (CES)</span>
              {pendingComplaints > 0 ? (
                <Badge variant="destructive" className="animate-pulse text-[11px]">
                  {pendingComplaints} Cảnh Báo
                </Badge>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">An Toàn</Badge>
              )}
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-indigo-700">{avgCes}</span>
              <span className="text-base font-bold text-slate-400">/ 7.0</span>
            </div>
            <p className="text-xs text-slate-600 mt-3 font-medium">
              Độ thuận tiện thủ tục cọc & vay vốn được khách chấm ở mức Rất Dễ Dàng.
            </p>
          </CardContent>
        </Card>

      </div>

      {/* MAIN NAVIGATION TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <TabsTrigger value="overview" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <BarChart2 className="h-4 w-4 text-blue-600" /> Tổng Quan NPS & AI
          </TabsTrigger>
          <TabsTrigger value="reviews" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2 relative">
            <MessageSquare className="h-4 w-4 text-amber-500" /> Sổ Phản Hồi Đa Kênh
            {pendingComplaints > 0 && (
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping ml-1" />
            )}
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <Send className="h-4 w-4 text-emerald-600" /> Chiến Dịch Tự Động
          </TabsTrigger>
          <TabsTrigger value="builder" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <Smartphone className="h-4 w-4 text-purple-600" /> Trình Tạo & Xem Form
          </TabsTrigger>
        </TabsList>

        {/* ========================================================
            TAB 1: TỔNG QUAN NPS & AI SENTIMENT ANALYZER
        ======================================================== */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* NPS Gauge & Breakdown - 7 cols */}
            <Card className="lg:col-span-7 shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base md:text-lg font-bold text-slate-800">
                      Phân Rã Cơ Cấu Net Promoter Score (NPS)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      Tỷ lệ phần trăm khách hàng sẵn sàng giới thiệu dự án cho đối tác và người thân.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-white border-blue-200 text-blue-700 font-bold">
                    Tiêu Chuẩn Bain & Company
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-around gap-2 mb-8">
                  {/* Promoters */}
                  <div className="text-center group p-3 rounded-2xl transition-all hover:bg-emerald-50">
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 border-2 border-emerald-300 shadow-sm group-hover:scale-105 transition-transform">
                      <Smile className="h-9 w-9 md:h-10 md:w-10 text-emerald-600" />
                    </div>
                    <div className="font-black text-2xl md:text-3xl text-emerald-600">{pctPromoters}%</div>
                    <div className="text-[11px] font-bold text-slate-600 uppercase mt-1">Ủng Hộ (Promoters)</div>
                    <div className="text-[10px] text-slate-400 font-medium">9-10 Điểm / 5 Sao</div>
                  </div>

                  <div className="text-3xl font-black text-slate-300">-</div>

                  {/* Passives */}
                  <div className="text-center group p-3 rounded-2xl transition-all hover:bg-slate-50">
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 border-2 border-slate-300 shadow-sm group-hover:scale-105 transition-transform">
                      <Meh className="h-9 w-9 md:h-10 md:w-10 text-slate-500" />
                    </div>
                    <div className="font-black text-2xl md:text-3xl text-slate-600">{pctPassives}%</div>
                    <div className="text-[11px] font-bold text-slate-600 uppercase mt-1">Thụ Động (Passives)</div>
                    <div className="text-[10px] text-slate-400 font-medium">7-8 Điểm / 4 Sao</div>
                  </div>

                  <div className="text-3xl font-black text-slate-300">-</div>

                  {/* Detractors */}
                  <div className="text-center group p-3 rounded-2xl transition-all hover:bg-rose-50">
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-2 border-2 border-rose-300 shadow-sm group-hover:scale-105 transition-transform">
                      <Frown className="h-9 w-9 md:h-10 md:w-10 text-rose-600" />
                    </div>
                    <div className="font-black text-2xl md:text-3xl text-rose-600">{pctDetractors}%</div>
                    <div className="text-[11px] font-bold text-slate-600 uppercase mt-1">Chê Bai (Detractors)</div>
                    <div className="text-[10px] text-slate-400 font-medium">0-6 Điểm / 1-3 Sao</div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-blue-900 text-base flex items-center gap-1.5">
                      <Award className="h-5 w-5 text-blue-600" /> Điểm NPS Doanh Nghiệp = {nps > 0 ? `+${nps}` : nps}
                    </div>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Công thức chuẩn: <strong className="font-bold">% Promoters ({pctPromoters}%) - % Detractors ({pctDetractors}%)</strong>
                    </p>
                  </div>
                  <Badge className={`px-4 py-1.5 text-xs font-bold ${nps >= 50 ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {nps >= 50 ? 'HẠNG XUẤT SẮC' : 'ĐẠT CHUẨN NGÀNH'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights & NLP Sentiment - 5 cols */}
            <Card className="lg:col-span-5 shadow-sm bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border-0">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="text-base md:text-lg font-bold flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5 text-amber-400" /> Phân Tích Cảm Xúc AI (NLP Insights)
                </CardTitle>
                <CardDescription className="text-xs text-indigo-200">
                  Tự động quét và phân loại từ khóa trong {totalReviews} phản hồi khách hàng gần nhất.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <ThumbsUp className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-300 uppercase">Điểm Mạnh Nổi Trội</span>
                    <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed">
                      Chuyên viên tư vấn được khen ngợi nhiều nhất với từ khóa <strong className="text-white">"nhiệt tình"</strong>, <strong className="text-white">"thủ tục nhanh gọn"</strong>, và <strong className="text-white">"VR sống động"</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl border border-white/10">
                  <Activity className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-300 uppercase">Điểm Cần Khắc Phục</span>
                    <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed">
                      Khách hàng phản ánh hạ tầng xung quanh một số dự án như <strong className="text-white">"đường Hương Lộ 2 đang làm"</strong> và <strong className="text-white">"phí giữ xe ô tô"</strong>.
                    </p>
                  </div>
                </div>

                <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${pendingComplaints > 0 ? 'bg-rose-500/20 border-rose-500/40 text-rose-100' : 'bg-white/10 border-white/10 text-indigo-100'}`}>
                  <ShieldAlert className={`h-5 w-5 shrink-0 mt-0.5 ${pendingComplaints > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`} />
                  <div>
                    <span className="text-xs font-bold uppercase text-white">Cảnh Báo Dịch Vụ Khách Hàng (SLA 24h)</span>
                    <p className="text-xs mt-0.5 leading-relaxed">
                      {pendingComplaints > 0 ? (
                        <>Hiện có <strong className="text-rose-300 underline font-bold">{pendingComplaints} phản hồi tiêu cực</strong> chưa được xử lý. Yêu cầu đội CSKH phản hồi trước 18:00!</>
                      ) : (
                        <>Toàn bộ phản hồi tiêu cực đã được giải quyết xong, không có nguy cơ leo thang tranh chấp.</>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Trendline & Channel Distribution Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 6-Month CSAT / NPS Trend - 8 cols */}
            <Card className="lg:col-span-8 shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800">
                      Xu Hướng Điểm Số NPS & CSAT Theo Thời Gian (6 Tháng)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      So sánh tỷ lệ hài lòng dịch vụ qua các giai đoạn mở bán và bàn giao.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-blue-600">
                      <span className="h-3 w-3 rounded-full bg-blue-500 inline-block" /> CSAT (%)
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-600">
                      <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" /> Điểm NPS
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCsat" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorNps" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderRadius: '10px', color: '#fff', border: 'none', fontSize: '12px' }}
                        formatter={(val: any, name: any) => [name === 'csat' ? `${val}%` : `+${val} Điểm`, name === 'csat' ? 'CSAT Hài Lòng' : 'Chỉ Số NPS']}
                      />
                      <Area type="monotone" dataKey="csat" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCsat)" />
                      <Area type="monotone" dataKey="nps" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNps)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Response by Channel - 4 cols */}
            <Card className="lg:col-span-4 shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <CardTitle className="text-base font-bold text-slate-800">
                  Nguồn Kênh Thu Thập Đánh Giá
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Tỷ trọng phản hồi thu được theo từng kênh tiếp cận.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[210px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={channelData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                      <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold">Kênh hoạt động hiệu quả nhất:</span>
                  <Badge className="bg-blue-100 text-blue-800 font-bold border-blue-200">Zalo ZNS (46%)</Badge>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* AI NLP Keyword Cloud */}
          <Card className="shadow-sm border border-slate-200">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" /> Bản Đồ Cụm Từ Khóa Khách Hàng Nhắc Đến Nhiều Nhất (NLP Word Cloud)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold border border-emerald-300 shadow-sm">
                  Tư vấn nhiệt tình (48 lần) ⭐
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold border border-emerald-300 shadow-sm">
                  Thủ tục cọc nhanh gọn (36 lần)
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  Sa bàn ảo 3D đẹp (31 lần)
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  Duyệt vay Vietcombank siêu tốc (24 lần)
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                  Đường vào Hương Lộ 2 đang thi công (12 lần)
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                  Phí đỗ xe ô tô hầm cao (8 lần)
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-300">
                  Hotline bận máy giờ trưa (7 lần) ⚠️
                </span>
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                  Bảo hành nẹp cửa chậm (5 lần)
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  Nhạc nước Global City đỉnh (18 lần)
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================
            TAB 2: SỔ PHẢN HỒI ĐA KÊNH & LIVE FEED
        ======================================================== */}
        <TabsContent value="reviews" className="space-y-5 mt-6">
          
          {/* Filters Bar */}
          <Card className="shadow-sm border border-slate-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
                {/* Search */}
                <div className="md:col-span-4 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Tìm theo tên khách, dự án, SĐT, nội dung..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 text-sm"
                  />
                </div>

                {/* Channel Filter */}
                <div className="md:col-span-2">
                  <select 
                    value={channelFilter}
                    onChange={e => setChannelFilter(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Kênh: Tất cả</option>
                    <option value="Zalo ZNS">Zalo ZNS</option>
                    <option value="Post-Sale Form">Post-Sale Form</option>
                    <option value="Google Review">Google Review</option>
                    <option value="Showroom Kiosk">Showroom Kiosk</option>
                    <option value="SMS Link">SMS Link</option>
                  </select>
                </div>

                {/* Sentiment Filter */}
                <div className="md:col-span-2">
                  <select 
                    value={sentimentFilter}
                    onChange={e => setSentimentFilter(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Cảm xúc: Tất cả</option>
                    <option value="positive">Tích cực (Khen)</option>
                    <option value="neutral">Trung tính (Góp ý)</option>
                    <option value="negative">Tiêu cực (Khiếu nại)</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div className="md:col-span-2">
                  <select 
                    value={ratingFilter}
                    onChange={e => setRatingFilter(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Số sao: Tất cả</option>
                    <option value="5">5 Sao ⭐⭐⭐⭐⭐</option>
                    <option value="4">4 Sao ⭐⭐⭐⭐</option>
                    <option value="3">3 Sao ⭐⭐⭐</option>
                    <option value="2">2 Sao ⭐⭐</option>
                    <option value="1">1 Sao ⭐</option>
                  </select>
                </div>

                {/* Resolution Status Filter */}
                <div className="md:col-span-2">
                  <select 
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Xử lý: Tất cả</option>
                    <option value="pending">Chờ xử lý (Pending)</option>
                    <option value="resolved">Đã giải quyết</option>
                    <option value="escalated">Đã leo thang cấp quản lý</option>
                  </select>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <Card className="shadow-sm border border-slate-200">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-800">
                  Danh Sách Đánh Giá & Phản Hồi ({filteredReviews.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Dữ liệu được đồng bộ hóa tức thì từ các điểm chạm tiếp xúc khách hàng.
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSimModal(true)}
                className="font-bold text-xs text-indigo-700 border-indigo-200 bg-indigo-50 hover:bg-indigo-100"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Thêm Đánh Giá
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <p className="font-semibold text-sm">Không tìm thấy phản hồi nào khớp với bộ lọc.</p>
                  <Button 
                    variant="link" 
                    onClick={() => { setSearchQuery(""); setChannelFilter("all"); setSentimentFilter("all"); setRatingFilter("all"); setStatusFilter("all"); }}
                    className="text-xs text-blue-600 font-bold"
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-slate-100">
                  {filteredReviews.map((r) => {
                    const isNegative = r.sentiment === 'negative'
                    const isPositive = r.sentiment === 'positive'
                    const isPending = r.resolutionStatus === 'pending'

                    return (
                      <div key={r.id} className="p-5 md:p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row gap-4 items-start justify-between">
                        <div className="flex gap-4 items-start flex-1">
                          <Avatar className="h-11 w-11 mt-1 border-2 border-white shadow-sm ring-1 ring-slate-100 shrink-0">
                            <AvatarFallback className={`font-bold text-sm ${isNegative ? 'bg-rose-100 text-rose-700' : isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                              {r.customerName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-slate-900 text-base">{r.customerName}</span>
                              {r.phone && (
                                <span className="text-xs text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                                  {r.phone}
                                </span>
                              )}
                              {r.projectName && (
                                <Badge variant="secondary" className="text-xs font-semibold bg-slate-100 text-slate-700">
                                  {r.projectName}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-600 bg-white">
                                {r.channel || r.source}
                              </Badge>
                              <span className="text-xs text-slate-400 ml-auto font-medium">{r.date}</span>
                            </div>

                            {/* Stars & Sentiment Badge */}
                            <div className="flex items-center gap-3">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star 
                                    key={star} 
                                    className={`h-4 w-4 ${star <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-100'}`} 
                                  />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-slate-700">{r.rating}.0 / 5.0</span>

                              <Badge className={`text-[10px] font-bold ${isPositive ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : isNegative ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                                {isPositive ? 'Tích Cực' : isNegative ? 'Tiêu Cực (Cảnh Báo)' : 'Trung Tính'}
                              </Badge>

                              {r.npsScore && (
                                <span className="text-[11px] font-bold text-slate-500">
                                  NPS: <strong className="text-slate-800">{r.npsScore}/10</strong>
                                </span>
                              )}
                            </div>

                            {/* Quote Text */}
                            <div className={`p-3.5 rounded-xl text-sm font-medium border leading-relaxed ${isNegative ? 'bg-rose-50/60 border-rose-200 text-rose-950' : isPositive ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                              "{r.text}"
                            </div>

                            {/* Resolution Note if resolved */}
                            {r.resolutionNotes && (
                              <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                  <strong className="font-bold">Phương án giải quyết ({r.assignedStaff || 'CSKH'}):</strong> {r.resolutionNotes}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex md:flex-col items-end gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-0 border-slate-100">
                          {isNegative && isPending && (
                            <Button 
                              size="sm" 
                              onClick={() => { setSelectedComplaint(r); setResolutionNotes(""); }}
                              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-8 shadow-sm"
                            >
                              <ShieldAlert className="h-3.5 w-3.5 mr-1" /> Xử Lý Khiếu Nại (SLA 24h)
                            </Button>
                          )}

                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => showToast(`Đã gửi mẫu tin nhắn Zalo/SMS cảm ơn & hỗ trợ đến khách hàng ${r.customerName} (${r.phone || '0901234567'})`)}
                            className="text-xs font-semibold text-slate-700 hover:bg-slate-100 h-8"
                          >
                            <PhoneCall className="h-3.5 w-3.5 mr-1 text-slate-500" /> Phản Hồi Nhanh
                          </Button>

                          {r.resolutionStatus === 'resolved' && (
                            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                              ✓ Đã Giải Quyết
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================
            TAB 3: CHIẾN DỊCH TỰ ĐỘNG HÓA KHẢO SÁT
        ======================================================== */}
        <TabsContent value="campaigns" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Chiến Dịch Khảo Sát Tự Động Theo Kịch Bản (Trigger-based)</h2>
              <p className="text-xs text-slate-500">Hệ thống tự động kích hoạt Zalo ZNS / SMS / App sau khi phát sinh sự kiện trong hành trình khách hàng.</p>
            </div>
            <Button 
              onClick={() => setShowCreateCampaignModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 shadow-sm"
            >
              <Plus className="h-4 w-4 mr-1" /> Tạo Chiến Dịch Tự Động
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {surveyCampaigns.map((c) => {
              const isActive = c.status !== 'paused'

              return (
                <Card key={c.id} className="shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between">
                  <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-5">
                    <div className="flex justify-between items-start gap-2">
                      <Badge className={isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold' : 'bg-slate-200 text-slate-700 font-bold'}>
                        {isActive ? '● Đang Chạy Tự Động' : '❚❚ Tạm Dừng'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-bold bg-white text-indigo-700 border-indigo-200">
                        {c.channel || 'Zalo ZNS'}
                      </Badge>
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 mt-2 line-clamp-2">
                      {c.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-5 space-y-4 flex-1">
                    <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                      <Flame className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Kích hoạt:</strong> {c.trigger}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-2 border-t border-b border-slate-100">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Số Phản Hồi</div>
                        <div className="text-xl font-black text-indigo-600">{c.responses}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Tỷ Lệ Hoàn Thành</div>
                        <div className="text-xl font-black text-slate-800">{c.conversion}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Điểm thưởng:</span>
                      <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-bold">
                        +{c.rewardPoints || 200} Điểm Loyalty
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>CSAT đạt được:</span>
                      <strong className="text-emerald-600 font-bold">{c.csatScore || 92}% Hài lòng</strong>
                    </div>
                  </CardContent>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(c.formUrl || `https://crm.proptech.vn/s/${c.id}`)
                        showToast(`Đã copy link form khảo sát: ${c.formUrl || `https://crm.proptech.vn/s/${c.id}`}`)
                      }}
                      className="flex-1 font-bold text-xs text-slate-700 border-slate-300 hover:bg-slate-100"
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy Link
                    </Button>

                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedCampaignReport(c)}
                      className="flex-1 font-bold text-xs text-blue-700 border-blue-200 bg-blue-50 hover:bg-blue-100"
                    >
                      <BarChart2 className="h-3.5 w-3.5 mr-1" /> Báo Cáo
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        toggleSurveyCampaignStatus(c.id)
                        showToast(`Đã ${isActive ? 'tạm dừng' : 'kích hoạt lại'} chiến dịch "${c.name}"`)
                      }}
                      className="px-2 text-slate-500 hover:text-slate-800 text-xs"
                      title={isActive ? "Tạm dừng" : "Bật lại"}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* ========================================================
            TAB 4: TRÌNH THIẾT KẾ & XEM TRƯỚC FORM KHẢO SÁT MOBILE
        ======================================================== */}
        <TabsContent value="builder" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Settings Left Side - 5 cols */}
            <div className="lg:col-span-5 space-y-5">
              <Card className="shadow-sm border border-slate-200">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                  <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-indigo-600" /> Cấu Hình Form Khảo Sát Khách Hàng
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Tùy biến câu hỏi và cơ chế cộng điểm thưởng Loyalty khi khách hoàn tất form.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Dự án áp dụng khảo sát</Label>
                    <select 
                      value={builderProject}
                      onChange={e => setBuilderProject(e.target.value)}
                      className="w-full mt-1.5 h-10 px-3 text-sm rounded-md border border-slate-200 bg-white font-medium"
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700">Điểm thưởng Loyalty trao tặng</Label>
                    <Input defaultValue="200" type="number" className="mt-1.5 h-10" />
                    <p className="text-[11px] text-slate-500 mt-1">Cộng tự động vào Ví Loyalty của khách sau khi bấm Gửi.</p>
                  </div>

                  <div>
                    <Label className="text-xs font-bold text-slate-700">Kênh kích hoạt khảo sát</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <Button variant="outline" size="sm" className="bg-blue-50 text-blue-700 border-blue-300 font-bold text-xs justify-start">
                        <Check className="h-3.5 w-3.5 mr-1" /> Zalo ZNS
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-200 font-medium text-xs justify-start">
                        SMS Brandname
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-200 font-medium text-xs justify-start">
                        Email Tự Động
                      </Button>
                      <Button variant="outline" size="sm" className="bg-white text-slate-700 border-slate-200 font-medium text-xs justify-start">
                        Kiosk Sa Bàn (QR)
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <Zap className="h-4 w-4 text-emerald-600" /> Tự Động Hóa Kích Hoạt (Webhook)
                    </span>
                    <p className="text-xs text-emerald-700 leading-relaxed">
                      Khi khách hàng được đổi trạng thái thành <strong>"Check-in Sự Kiện"</strong> hoặc <strong>"Đã Cọc"</strong> trong CRM, link khảo sát bên phải sẽ tự động gửi đi.
                    </p>
                  </div>

                  <Button 
                    onClick={() => {
                      showToast("Đã lưu thiết lập cấu hình form khảo sát thành công!")
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 text-sm"
                  >
                    Lưu Cấu Hình Form
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Live Interactive Smartphone Mockup - 7 cols */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="w-full max-w-[390px] bg-slate-900 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-950">
                
                {/* Phone Speaker & Camera Notch */}
                <div className="h-5 w-full flex justify-center items-center mb-1">
                  <div className="h-3.5 w-28 bg-slate-950 rounded-full flex items-center justify-end pr-2.5">
                    <span className="h-2 w-2 rounded-full bg-slate-800" />
                  </div>
                </div>

                {/* Smartphone Screen Canvas */}
                <div className="bg-white rounded-[32px] overflow-hidden min-h-[640px] flex flex-col justify-between border border-slate-100">
                  
                  {/* Screen Header */}
                  <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 text-center relative">
                    <Badge className="bg-white/20 text-white border-none text-[10px] mb-1 font-bold">
                      {builderProject}
                    </Badge>
                    <h3 className="text-base font-bold">Khảo Sát Ý Kiến Khách Hàng</h3>
                    <p className="text-[11px] text-blue-100 mt-0.5">Nhận ngay +200 Điểm Thưởng khi hoàn tất form</p>
                  </div>

                  {/* Screen Content Body */}
                  <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[500px]">
                    {builderSubmitted ? (
                      <div className="text-center py-12 space-y-4">
                        <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 border-2 border-emerald-300">
                          <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900">Gửi Khảo Sát Thành Công!</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Cảm ơn Quý khách <strong className="text-slate-800">{builderName}</strong>. 
                            Ý kiến của bạn đã được ghi nhận vào hệ thống CRM và các chỉ số CSAT/NPS đã được cập nhật.
                          </p>
                        </div>
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-bold">
                          🎉 Đã cộng +200 Điểm Thưởng vào SĐT {builderPhone || '0901234567'}
                        </div>
                        <Button 
                          onClick={handleResetBuilder} 
                          variant="outline" 
                          size="sm" 
                          className="font-bold text-xs"
                        >
                          Điền Form Mới (Thử Lại)
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleBuilderSubmit} className="space-y-4 text-left">
                        {/* Question 1: NPS Scale 0-10 */}
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-800">
                            1. Anh/Chị sẵn sàng giới thiệu dự án cho người thân? (NPS 0-10)
                          </Label>
                          <div className="grid grid-cols-6 gap-1 pt-1">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                              <button
                                type="button"
                                key={val}
                                onClick={() => setBuilderNps(val)}
                                className={`h-8 rounded-md text-xs font-bold transition-all ${builderNps === val ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                              >
                                {val}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 px-0.5">
                            <span>0: Chắc chắn không</span>
                            <span>10: Chắc chắn có</span>
                          </div>
                        </div>

                        {/* Question 2: CSAT 5-Stars */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <Label className="text-xs font-bold text-slate-800">
                            2. Mức độ hài lòng chung về chuyên viên tư vấn (CSAT)?
                          </Label>
                          <div className="flex justify-center gap-2 py-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                onClick={() => setBuilderCsat(star)}
                                className={`h-7 w-7 cursor-pointer transition-transform hover:scale-110 ${star <= builderCsat ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-100'}`}
                              />
                            ))}
                          </div>
                          <div className="text-center text-[10px] font-bold text-slate-500">
                            {builderCsat === 5 ? '⭐⭐⭐⭐⭐ Rất Hài Lòng' : builderCsat === 4 ? '⭐⭐⭐⭐ Hài Lòng' : builderCsat === 3 ? '⭐⭐⭐ Bình Thường' : '⭐ Chưa Hài Lòng'}
                          </div>
                        </div>

                        {/* Question 3: CES 1-7 */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                          <Label className="text-xs font-bold text-slate-800">
                            3. Thủ tục đặt cọc và thanh toán có dễ dàng không? (CES)
                          </Label>
                          <div className="grid grid-cols-7 gap-1 pt-1">
                            {[1, 2, 3, 4, 5, 6, 7].map(score => (
                              <button
                                type="button"
                                key={score}
                                onClick={() => setBuilderCes(score)}
                                className={`h-7 rounded text-xs font-bold ${builderCes === score ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
                              >
                                {score}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-[9px] font-bold text-slate-400">
                            <span>1: Rất khó</span>
                            <span>7: Rất dễ</span>
                          </div>
                        </div>

                        {/* Customer Inputs */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <div>
                            <Input 
                              placeholder="Họ và tên Quý khách *"
                              value={builderName}
                              onChange={e => setBuilderName(e.target.value)}
                              className="h-8 text-xs bg-slate-50"
                              required
                            />
                          </div>
                          <div>
                            <Input 
                              placeholder="Số điện thoại nhận quà tặng"
                              value={builderPhone}
                              onChange={e => setBuilderPhone(e.target.value)}
                              className="h-8 text-xs bg-slate-50"
                            />
                          </div>
                          <div>
                            <Textarea 
                              placeholder="Quý khách có đóng góp ý kiến gì thêm cho Ban Quản Lý dự án không? *"
                              value={builderComment}
                              onChange={e => setBuilderComment(e.target.value)}
                              rows={3}
                              className="text-xs bg-slate-50"
                              required
                            />
                          </div>
                        </div>

                        <Button 
                          type="submit"
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold h-10 text-xs shadow-md"
                        >
                          Gửi Phản Hồi & Nhận +200 Điểm
                        </Button>
                      </form>
                    )}
                  </div>

                  {/* Phone Screen Footer */}
                  <div className="p-2 text-center text-[10px] text-slate-400 bg-slate-50 border-t border-slate-100 font-medium">
                    Bản quyền thuộc Hệ Thống BĐS Luxury CRM • 2026
                  </div>
                </div>

                {/* Home Indicator Bar */}
                <div className="h-4 flex justify-center items-center pt-1">
                  <div className="h-1 w-28 bg-slate-700 rounded-full" />
                </div>

              </div>
            </div>

          </div>
        </TabsContent>

      </Tabs>

      {/* ========================================================
          MODAL 1: GIẢ LẬP ĐÁNH GIÁ REVIEW TRỰC TIẾP
      ======================================================== */}
      <Dialog open={showSimModal} onOpenChange={setShowSimModal}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MessageCircleQuestion className="h-5 w-5 text-indigo-600" /> Giả Lập Đánh Giá Khách Hàng (Live Recalculation)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Nhập đánh giá giả định để kiểm tra thuật toán tính toán lại NPS, CSAT và kích hoạt cảnh báo đỏ của AI Sentiment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-700">Tên khách hàng</Label>
                <Input value={simName} onChange={e => setSimName(e.target.value)} className="mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-700">Số điện thoại</Label>
                <Input value={simPhone} onChange={e => setSimPhone(e.target.value)} className="mt-1 h-9 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-700">Dự án quan tâm</Label>
                <select 
                  value={simProject} 
                  onChange={e => setSimProject(e.target.value)}
                  className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-700">Kênh gửi đánh giá</Label>
                <select 
                  value={simChannel} 
                  onChange={e => setSimChannel(e.target.value)}
                  className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
                >
                  <option value="Post-Sale Form">Post-Sale Form</option>
                  <option value="Zalo ZNS">Zalo ZNS</option>
                  <option value="Google Review">Google Review</option>
                  <option value="Showroom Kiosk">Showroom Kiosk</option>
                  <option value="SMS Link">SMS Link</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Chấm điểm sao (CSAT 1-5)</Label>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    onClick={() => {
                      setSimRating(star)
                      if (star === 5) setSimNps(10)
                      else if (star === 4) setSimNps(8)
                      else if (star === 3) setSimNps(5)
                      else setSimNps(2)
                    }}
                    className={`h-7 w-7 cursor-pointer transition-colors ${star <= simRating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-100'}`}
                  />
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {simRating === 5 ? 'Xuất Sắc (5⭐)' : simRating === 4 ? 'Hài Lòng (4⭐)' : simRating <= 2 ? 'Kém (Cảnh báo đỏ)' : 'Trung Bình'}
                </span>
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Nội dung đánh giá</Label>
              <Textarea 
                value={simText} 
                onChange={e => setSimText(e.target.value)}
                placeholder="Nhập nội dung khách khen hoặc chê..."
                rows={3}
                className="mt-1 text-sm"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setShowSimModal(false)}>Hủy</Button>
            <Button size="sm" onClick={handleSimulateSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Gửi Đánh Giá Ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 2: TẠO CHIẾN DỊCH KHẢO SÁT MỚI
      ======================================================== */}
      <Dialog open={showCreateCampaignModal} onOpenChange={setShowCreateCampaignModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-emerald-600" /> Tạo Chiến Dịch Khảo Sát Tự Động
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Thiết lập kịch bản gửi tin nhắn khảo sát tự động theo hành vi khách hàng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3">
            <div>
              <Label className="text-xs font-bold text-slate-700">Tên chiến dịch *</Label>
              <Input 
                value={newCampName} 
                onChange={e => setNewCampName(e.target.value)}
                placeholder="Ví dụ: Khảo sát dịch vụ sau bàn giao chìa khóa"
                className="mt-1 h-9 text-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Kênh gửi tin</Label>
              <select 
                value={newCampChannel}
                onChange={e => setNewCampChannel(e.target.value)}
                className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="Zalo ZNS">Zalo ZNS (Tỷ lệ mở 92%)</option>
                <option value="SMS Brandname">SMS Brandname</option>
                <option value="Email Automation">Email Automation</option>
                <option value="App CSKH Push">App CSKH Push Notification</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Kịch bản kích hoạt (Trigger Logic)</Label>
              <select 
                value={newCampTrigger}
                onChange={e => setNewCampTrigger(e.target.value)}
                className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="Tự động gửi Zalo ZNS sau khi Check-in Sự Kiện 1 giờ">Sau Check-in Sự Kiện 1 giờ</option>
                <option value="Tự động gửi Email & SMS ngay sau khi Ký Thỏa Thuận Đặt Cọc">Ngay sau khi Ký Hợp Đồng Cọc</option>
                <option value="Gửi Zalo ZNS sau khi Ngân hàng giải ngân đợt 1">Sau khi Giải Ngân Vay Ngân Hàng</option>
                <option value="Kích hoạt trên App Cư Dân sau khi nhận Bàn Giao Chìa Khóa">Khi hoàn tất Bàn Giao Căn Hộ</option>
                <option value="Gửi định kỳ ngày 15 tháng 6 và tháng 12 hàng năm">Khảo sát định kỳ cư dân 6 tháng</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-slate-700">Đối tượng mục tiêu</Label>
                <Input 
                  value={newCampTarget}
                  onChange={e => setNewCampTarget(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-slate-700">Điểm thưởng (Loyalty)</Label>
                <Input 
                  type="number"
                  value={newCampReward}
                  onChange={e => setNewCampReward(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setShowCreateCampaignModal(false)}>Hủy</Button>
            <Button size="sm" onClick={handleCreateCampaign} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Kích Hoạt Chiến Dịch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 3: XỬ LÝ KHIẾU NẠI RED ALERT (SLA 24H)
      ======================================================== */}
      <Dialog open={!!selectedComplaint} onOpenChange={(open) => !open && setSelectedComplaint(null)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-rose-700 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" /> Xử Lý Khiếu Nại Khách Hàng (SLA 24h)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Quy trình phản hồi và đưa ra biện pháp khắc phục sự cố dịch vụ để bảo vệ uy tín thương hiệu.
            </DialogDescription>
          </DialogHeader>

          {selectedComplaint && (
            <div className="space-y-4 pt-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-rose-900">{selectedComplaint.customerName} ({selectedComplaint.phone || '0987654321'})</span>
                  <Badge variant="destructive" className="text-[10px]">Đánh giá {selectedComplaint.rating} ⭐</Badge>
                </div>
                <p className="text-xs text-rose-950 font-medium italic">
                  "{selectedComplaint.text}"
                </p>
                <div className="text-[10px] text-rose-700 font-semibold pt-1">
                  Dự án: {selectedComplaint.projectName || 'Tất cả'} • Kênh: {selectedComplaint.channel || selectedComplaint.source}
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Chuyên viên phụ trách xử lý</Label>
                <Input 
                  value={resolutionStaff}
                  onChange={e => setResolutionStaff(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Kế hoạch khắc phục & Nội dung phản hồi khách hàng *</Label>
                <Textarea 
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="Ghi nhận phương án xử lý: đã gọi xin lỗi, tặng voucher tri ân, điều đốc công sửa lỗi..."
                  rows={4}
                  className="mt-1 text-xs"
                />
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setSelectedComplaint(null)}>Hủy</Button>
            <Button size="sm" onClick={handleResolveComplaint} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Xác Nhận Đã Giải Quyết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 4: BÁO CÁO CHI TIẾT CHIẾN DỊCH KHẢO SÁT
      ======================================================== */}
      <Dialog open={!!selectedCampaignReport} onOpenChange={(open) => !open && setSelectedCampaignReport(null)}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-600" /> Báo Cáo Hiệu Quả Chiến Dịch Khảo Sát
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Chi tiết lượng gửi, tỷ lệ mở và điểm số thu về từ chiến dịch.
            </DialogDescription>
          </DialogHeader>

          {selectedCampaignReport && (
            <div className="space-y-4 pt-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="font-bold text-sm text-slate-900">{selectedCampaignReport.name}</h4>
                <p className="text-xs text-slate-500 mt-1">Kích hoạt: {selectedCampaignReport.trigger}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                  <div className="text-[10px] uppercase font-bold text-blue-700">Tổng Phản Hồi</div>
                  <div className="text-2xl font-black text-blue-900 mt-0.5">{selectedCampaignReport.responses}</div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <div className="text-[10px] uppercase font-bold text-emerald-700">Tỷ Lệ Điền Form</div>
                  <div className="text-2xl font-black text-emerald-900 mt-0.5">{selectedCampaignReport.conversion}</div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                  <div className="text-[10px] uppercase font-bold text-amber-700">CSAT Chiến Dịch</div>
                  <div className="text-2xl font-black text-amber-900 mt-0.5">{selectedCampaignReport.csatScore || 92}%</div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Kênh phân phối:</span>
                  <strong className="text-slate-800 font-bold">{selectedCampaignReport.channel || 'Zalo ZNS'}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Đối tượng khảo sát:</span>
                  <strong className="text-slate-800 font-bold">{selectedCampaignReport.targetAudience || 'Khách tham quan'}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span>Điểm thưởng trao tặng:</span>
                  <strong className="text-amber-600 font-bold">+{selectedCampaignReport.rewardPoints || 200} Loyalty Pts</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Link khảo sát công khai:</span>
                  <span className="font-mono text-[11px] text-blue-600 underline">
                    {selectedCampaignReport.formUrl || `https://crm.proptech.vn/s/${selectedCampaignReport.id}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t pt-3">
            <Button size="sm" onClick={() => setSelectedCampaignReport(null)} className="w-full">
              Đóng Báo Cáo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 5: QR STANDEE KHẢO SÁT KIOSK TẠI QUẦY SA BÀN
      ======================================================== */}
      <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
        <DialogContent className="max-w-sm bg-white text-center">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5 text-indigo-600" /> QR Code Standee Showroom
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Đặt tại quầy lễ tân hoặc bàn tiếp khách để khách quét mã đánh giá tức thì bằng điện thoại.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 flex flex-col items-center">
            {/* Mock QR SVG Box */}
            <div className="p-4 bg-white border-4 border-slate-900 rounded-2xl shadow-md">
              <div className="w-48 h-48 bg-slate-900 p-2 rounded-lg flex flex-col justify-between items-center text-white">
                <div className="flex justify-between w-full">
                  <div className="w-12 h-12 bg-white rounded border-2 border-slate-900" />
                  <div className="w-12 h-12 bg-white rounded border-2 border-slate-900" />
                </div>
                <div className="text-[10px] font-bold tracking-widest text-center">
                  SCAN TO SURVEY
                  <div className="text-[8px] text-slate-300 font-mono">crm.proptech.vn/s/kiosk</div>
                </div>
                <div className="flex justify-between w-full">
                  <div className="w-12 h-12 bg-white rounded border-2 border-slate-900" />
                  <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-slate-900 font-black text-xs">
                    5★
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 max-w-[260px] font-medium leading-relaxed">
              Khách hàng quét mã QR sẽ tự động mở form mobile và được tích ngay <strong>+200 Điểm Thưởng</strong> vào ví.
            </p>
          </div>

          <DialogFooter className="border-t pt-3 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                navigator.clipboard?.writeText("https://crm.proptech.vn/s/kiosk")
                showToast("Đã copy URL Standee: https://crm.proptech.vn/s/kiosk")
              }}
              className="flex-1 font-bold text-xs"
            >
              <Copy className="h-3.5 w-3.5 mr-1" /> Copy Link
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                showToast("Đã gửi lệnh in Standee A5 tới máy in quầy lễ tân Showroom!")
                setShowQrModal(false)
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1" /> Tải File In A5
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
