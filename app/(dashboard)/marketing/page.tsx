"use client"
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  Megaphone, MessageSquare, Mail, Share2, Search, MonitorPlay, 
  LayoutTemplate, Copy, Link2, QrCode, Target, RefreshCcw, Code, 
  Smartphone, Download, Plus, CheckCircle2, TrendingUp, Users, 
  Filter, Play, Pause, AlertTriangle, ArrowRight, PhoneCall, 
  Clock, ShieldAlert, Zap, BarChart3, PieChart as PieChartIcon, 
  Activity, Check, ExternalLink, SlidersHorizontal, Sparkles, X, Eye
} from 'lucide-react'
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts'
import { useStore } from '@/store/useStore'
import { Campaign, Customer } from '@/types'
import Link from 'next/link'

// Model for Live Leads from Ads
interface InboundLead {
  id: string
  campaignId: string
  campaignName: string
  customerName: string
  phone: string
  email: string
  platform: 'Facebook' | 'Google' | 'TikTok' | 'Zalo'
  projectInterested: string
  assignedAgent: string
  status: 'Mới' | 'Đã gọi' | 'Hẹn xem sa bàn' | 'Đã cọc' | 'Không nghe máy'
  inflowTime: string
  slaRemainingMinutes: number
  notes?: string
}

const INITIAL_INBOUND_LEADS: InboundLead[] = [
  {
    id: 'LD-8821',
    campaignId: 'c1',
    campaignName: 'Lead Gen - Grand Manhattan (T12)',
    customerName: 'Hoàng Minh Quân',
    phone: '0908 123 456',
    email: 'quan.hoang@vietcorp.vn',
    platform: 'Facebook',
    projectInterested: 'The Grand Manhattan (Căn 2PN)',
    assignedAgent: 'Lê Hoàng Anh',
    status: 'Mới',
    inflowTime: '4 phút trước',
    slaRemainingMinutes: 11,
    notes: 'Quan tâm chính sách 0% lãi suất CĐT, yêu cầu gửi brochure qua Zalo trước 11h trưa.'
  },
  {
    id: 'LD-8820',
    campaignId: 'c2',
    campaignName: 'Search Ads - Aqua City',
    customerName: 'Trịnh Thanh Mai',
    phone: '0919 778 990',
    email: 'mai.trinh@dragoncapital.com',
    platform: 'Google',
    projectInterested: 'Aqua City (Biệt thự River Park)',
    assignedAgent: 'Nguyễn Mai',
    status: 'Đã gọi',
    inflowTime: '18 phút trước',
    slaRemainingMinutes: 0,
    notes: 'Đã liên hệ, khách đồng ý hẹn đến sa bàn Aqua City vào 10:00 sáng Thứ 7 này.'
  },
  {
    id: 'LD-8819',
    campaignId: 'c3',
    campaignName: 'Video Review - NovaWorld Phan Thiết',
    customerName: 'Đặng Quốc Huy',
    phone: '0977 889 900',
    email: 'huy.dang@greenland.vn',
    platform: 'TikTok',
    projectInterested: 'NovaWorld Phan Thiet (Shophouse biển)',
    assignedAgent: 'Thanh Hà',
    status: 'Mới',
    inflowTime: '8 phút trước',
    slaRemainingMinutes: 7,
    notes: 'Xem video review trên TikTok bấm vào link bio để lại SĐT, hỏi về căn góc Florida.'
  },
  {
    id: 'LD-8818',
    campaignId: 'c4',
    campaignName: 'ZNS Chăm sóc Khách Cũ Tái Đầu Tư',
    customerName: 'Phạm Hồng Thái',
    phone: '0933 445 566',
    email: 'thai.pham@phuclong.com.vn',
    platform: 'Zalo',
    projectInterested: 'The Global City (Shophouse Soho)',
    assignedAgent: 'Trần Khoa',
    status: 'Hẹn xem sa bàn',
    inflowTime: '42 phút trước',
    slaRemainingMinutes: 0,
    notes: 'Khách hàng cũ từng mua căn The Grand Manhattan, muốn mua thêm shophouse thương mại.'
  },
  {
    id: 'LD-8817',
    campaignId: 'c1',
    campaignName: 'Lead Gen - Grand Manhattan (T12)',
    customerName: 'Vũ Thị Minh Thư',
    phone: '0982 667 889',
    email: 'minhthu.vu@vinhomes.vn',
    platform: 'Facebook',
    projectInterested: 'The Grand Manhattan (Penthouse)',
    assignedAgent: 'Tuấn Tú',
    status: 'Mới',
    inflowTime: '13 phút trước',
    slaRemainingMinutes: 2,
    notes: 'Sắp hết hạn SLA 15 phút! Cần liên hệ ngay kẻo hệ thống tự động thu hồi phân bổ cho sale khác.'
  },
  {
    id: 'LD-8816',
    campaignId: 'c2',
    campaignName: 'Search Ads - Aqua City',
    customerName: 'Bùi Anh Tuấn',
    phone: '0944 556 778',
    email: 'tuan.bui@fpt.com.vn',
    platform: 'Google',
    projectInterested: 'Aqua City (Nhà phố Đảo Phượng Hoàng)',
    assignedAgent: 'Lê Hoàng Anh',
    status: 'Đã cọc',
    inflowTime: 'Hôm qua',
    slaRemainingMinutes: 0,
    notes: 'Đã chốt giữ chỗ căn AQC-12A.01 thành công trong ngày mở bán trực tuyến.'
  }
]

// 7-day CPL & Lead trend data for Recharts
const PERFORMANCE_7DAYS = [
  { date: '26/09', leads: 42, spent: 4800000, cpl: 114285 },
  { date: '27/09', leads: 58, spent: 6200000, cpl: 106896 },
  { date: '28/09', leads: 64, spent: 7100000, cpl: 110937 },
  { date: '29/09', leads: 82, spent: 8500000, cpl: 103658 },
  { date: '30/09', leads: 75, spent: 7900000, cpl: 105333 },
  { date: '01/10', leads: 91, spent: 9800000, cpl: 107692 },
  { date: '02/10', leads: 91, spent: 9600000, cpl: 105494 },
]

// Platform budget distribution data
const PLATFORM_METRICS = [
  { name: 'Facebook Ads', spent: 22500000, leads: 185, cpl: 121621, color: '#1877F2' },
  { name: 'Google Search', spent: 28000000, leads: 110, cpl: 254545, color: '#EA4335' },
  { name: 'TikTok Ads', spent: 15000000, leads: 320, cpl: 46875, color: '#000000' },
  { name: 'Zalo OA / ZNS', spent: 1200000, leads: 28, cpl: 42857, color: '#0068FF' },
]

// Landing page mock templates
const LANDING_TEMPLATES = [
  { 
    id: 1, 
    name: 'The Grand Manhattan - Biểu Tượng Quận 1', 
    tag: 'Căn hộ Hạng Sang', 
    cvr: '2.8%', 
    views: '5.200',
    color: 'from-amber-600 to-amber-900',
    headline: 'ĐẶC QUYỀN SỐNG THƯỢNG LƯU TRUNG TÂM QUẬN 1',
    sub: 'Tặng kỳ nghỉ dưỡng 5 sao Avani & Gói nội thất 1.2 Tỷ',
    project: 'The Grand Manhattan'
  },
  { 
    id: 2, 
    name: 'Aqua City - Đô Thị Sinh Thái Đảo Phượng Hoàng', 
    tag: 'Nhà Phố / Biệt Thự', 
    cvr: '3.4%', 
    views: '15.400',
    color: 'from-emerald-600 to-teal-900',
    headline: 'SỐNG XANH CHUẨN NGHỈ DƯỠNG BÊN SÔNG ĐỒNG NAI',
    sub: 'Hỗ trợ lãi suất 0% trong 24 tháng, Vốn tự có chỉ 30%',
    project: 'Aqua City'
  },
  { 
    id: 3, 
    name: 'NovaWorld Phan Thiết - Thành Phố Biển 1000ha', 
    tag: 'Biệt Thự Biển', 
    cvr: '4.1%', 
    views: '22.000',
    color: 'from-cyan-600 to-blue-900',
    headline: 'THIÊN ĐƯỜNG NGHỈ DƯỠNG & SÂN GOLF PGA 36 HỐ',
    sub: 'Cam kết thuê lại 60 Triệu/tháng + Tặng thẻ Golf trọn đời',
    project: 'NovaWorld Phan Thiet'
  },
  { 
    id: 4, 
    name: 'The Global City - Downtown Mới TP.HCM', 
    tag: 'Shophouse Thương Mại', 
    cvr: '2.4%', 
    views: '8.900',
    color: 'from-indigo-600 to-slate-900',
    headline: 'TÂM ĐIỂM GIAO THƯƠNG ĐẲNG CẤP QUỐC TẾ TẠI AN PHÚ',
    sub: 'Thiết kế bởi Foster + Partners, Nhận nhà kinh doanh ngay',
    project: 'The Global City'
  },
]

export default function MarketingPage() {
  const { campaigns, projects, addCampaign, updateCampaignStatus, addLeadToCampaign, addCustomer } = useStore()
  
  // Tab control
  const [activeTab, setActiveTab] = useState('campaigns')

  // Search & Filter for Campaigns
  const [searchQuery, setSearchQuery] = useState('')
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Live Inbound Leads State
  const [inboundLeads, setInboundLeads] = useState<InboundLead[]>(INITIAL_INBOUND_LEADS)
  const [leadSearch, setLeadSearch] = useState('')
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('all')

  // UTM Generator States
  const [utmUrl, setUtmUrl] = useState("https://novacrm.vn/landing/grand-manhattan")
  const [utmSource, setUtmSource] = useState("facebook")
  const [utmMedium, setUtmMedium] = useState("cpc")
  const [utmCampaignName, setUtmCampaignName] = useState("grand_manhattan_q4_2026")
  const [utmContent, setUtmContent] = useState("video_review_avani_hotel")
  const [copiedUtm, setCopiedUtm] = useState(false)

  // Tracking Pixels state
  const [pixels, setPixels] = useState([
    { id: 'px1', name: 'Meta Pixel ID (Facebook)', code: '883920194829104', status: 'Active', latency: '38ms' },
    { id: 'px2', name: 'Google Tag Manager (GTM)', code: 'GTM-NOVA2026-X9', status: 'Active', latency: '42ms' },
    { id: 'px3', name: 'TikTok Pixel Events API', code: 'TT-8839210-VN', status: 'Active', latency: '45ms' },
    { id: 'px4', name: 'Zalo Mini App / ZNS Webhook', code: 'ZNS-TOKEN-9941', status: 'Active', latency: '29ms' },
  ])

  // Modals
  const [isNewCampaignOpen, setIsNewCampaignOpen] = useState(false)
  const [isSimulateLeadOpen, setIsSimulateLeadOpen] = useState(false)
  const [isRoutingRulesOpen, setIsRoutingRulesOpen] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<typeof LANDING_TEMPLATES[0] | null>(null)
  const [reassignLeadTarget, setReassignLeadTarget] = useState<InboundLead | null>(null)
  const [selectedAgentForReassign, setSelectedAgentForReassign] = useState('Nguyễn Mai')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // New Campaign Form State
  const [newCampName, setNewCampName] = useState('')
  const [newCampPlatform, setNewCampPlatform] = useState<Campaign['platform']>('Facebook')
  const [newCampBudget, setNewCampBudget] = useState(30000000)
  const [newCampTargetCPL, setNewCampTargetCPL] = useState(150000)
  const [newCampProject, setNewCampProject] = useState('p3')
  const [newCampRouting, setNewCampRouting] = useState<'round_robin' | 'top_seller' | 'by_project'>('top_seller')
  const [newCampTeam, setNewCampTeam] = useState('Team Luxury Alpha')

  // Simulate Lead Form State
  const [simLeadName, setSimLeadName] = useState('Trần Đăng Khoa')
  const [simLeadPhone, setSimLeadPhone] = useState('0909 556 789')
  const [simLeadCampaignId, setSimLeadCampaignId] = useState('c1')
  const [simLeadNote, setSimLeadNote] = useState('Đăng ký qua Form Facebook Ads xem biệt thự mẫu cuối tuần.')

  // Routing Rules Configuration State
  const [routingAlgorithm, setRoutingAlgorithm] = useState<'round_robin' | 'top_seller' | 'by_project'>('top_seller')
  const [slaMinutes, setSlaMinutes] = useState(15)
  const [autoReassignEnabled, setAutoReassignEnabled] = useState(true)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
  }

  // Computed UTM Url
  const generatedUtmUrl = useMemo(() => {
    return `${utmUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaignName}&utm_content=${utmContent}`
  }, [utmUrl, utmSource, utmMedium, utmCampaignName, utmContent])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedUtm(true)
    showToast('✅ Đã sao chép đường link UTM vào clipboard!')
    setTimeout(() => setCopiedUtm(false), 2500)
  }

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.platform.toLowerCase().includes(searchQuery.toLowerCase())
      const matchPlatform = platformFilter === 'all' || c.platform === platformFilter
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchPlatform && matchStatus
    })
  }, [campaigns, searchQuery, platformFilter, statusFilter])

  // Filter inbound leads
  const filteredLeads = useMemo(() => {
    return inboundLeads.filter(l => {
      const matchSearch = l.customerName.toLowerCase().includes(leadSearch.toLowerCase()) || 
                          l.phone.includes(leadSearch) ||
                          l.projectInterested.toLowerCase().includes(leadSearch.toLowerCase())
      const matchStatus = leadStatusFilter === 'all' || l.status === leadStatusFilter
      return matchSearch && matchStatus
    })
  }, [inboundLeads, leadSearch, leadStatusFilter])

  // Total KPIs
  const totalSpent = useMemo(() => campaigns.reduce((acc, c) => acc + c.spent, 0), [campaigns])
  const totalBudget = useMemo(() => campaigns.reduce((acc, c) => acc + c.budget, 0), [campaigns])
  const totalLeads = useMemo(() => campaigns.reduce((acc, c) => acc + c.leads, 0), [campaigns])
  const avgCPL = useMemo(() => totalLeads > 0 ? Math.round(totalSpent / totalLeads) : 0, [totalSpent, totalLeads])

  // Handler: Create Campaign
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCampName.trim()) {
      alert('Vui lòng nhập tên chiến dịch')
      return
    }

    addCampaign({
      name: newCampName,
      platform: newCampPlatform,
      budget: Number(newCampBudget),
      spent: 0,
      leads: 0,
      clicks: 0,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      targetCPL: Number(newCampTargetCPL),
      projectId: newCampProject,
      routingRule: newCampRouting,
      assignedTeam: newCampTeam
    })

    setIsNewCampaignOpen(false)
    setNewCampName('')
    showToast(`🚀 Đã khởi tạo thành công chiến dịch "${newCampName}" và kích hoạt thuật toán phân bổ lead!`)
  }

  // Handler: Toggle Campaign Status
  const handleToggleStatus = (camp: Campaign) => {
    const nextStatus = camp.status === 'Active' ? 'Paused' : 'Active'
    updateCampaignStatus(camp.id, nextStatus)
    showToast(`Đã ${nextStatus === 'Active' ? 'KÍCH HOẠT' : 'TẠM DỪNG'} chiến dịch "${camp.name}".`)
  }

  // Handler: Simulate Inbound Lead
  const handleSimulateLead = (e: React.FormEvent) => {
    e.preventDefault()
    const targetCamp = campaigns.find(c => c.id === simLeadCampaignId) || campaigns[0]
    
    // Auto-pick agent according to rule
    const availableAgents = ['Lê Hoàng Anh', 'Nguyễn Mai', 'Thanh Hà', 'Trần Khoa', 'Tuấn Tú']
    const assignedAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)]

    const newLeadId = `LD-${Math.floor(Math.random() * 9000) + 1000}`
    const newLead: InboundLead = {
      id: newLeadId,
      campaignId: targetCamp.id,
      campaignName: targetCamp.name,
      customerName: simLeadName,
      phone: simLeadPhone,
      email: `${simLeadName.toLowerCase().replace(/\s+/g, '')}@investor.vn`,
      platform: (targetCamp.platform === 'Email' ? 'Facebook' : targetCamp.platform) as any,
      projectInterested: targetCamp.name.includes('Grand Manhattan') ? 'The Grand Manhattan Q1' : 
                         targetCamp.name.includes('Aqua') ? 'Aqua City Đảo Phượng Hoàng' : 'NovaWorld Phan Thiet',
      assignedAgent,
      status: 'Mới',
      inflowTime: 'Vừa xong',
      slaRemainingMinutes: slaMinutes,
      notes: simLeadNote
    }

    // Add to leads list
    setInboundLeads([newLead, ...inboundLeads])

    // Update campaign stats
    addLeadToCampaign(targetCamp.id, 1)

    // Also auto-create a Customer in CRM with tag
    addCustomer({
      name: simLeadName,
      phone: simLeadPhone,
      email: newLead.email,
      rank: 'Tiềm Năng',
      revenue: 0,
      assignedTo: assignedAgent,
      status: 'Đang tư vấn'
    })

    setIsSimulateLeadOpen(false)
    showToast(`⚡ LEAD NÓNG VỪA ĐỔ VỀ: ${simLeadName} (${simLeadPhone}) ➔ Phân bổ tự động cho chuyên viên ${assignedAgent}!`)
  }

  // Handler: Reassign Lead
  const handleReassignLead = () => {
    if (!reassignLeadTarget) return
    setInboundLeads(prev => prev.map(l => {
      if (l.id === reassignLeadTarget.id) {
        return {
          ...l,
          assignedAgent: selectedAgentForReassign,
          slaRemainingMinutes: slaMinutes,
          notes: `${l.notes || ''} [Điều chuyển cho ${selectedAgentForReassign} lúc ${new Date().toLocaleTimeString()}]`
        }
      }
      return l
    }))
    showToast(`Đã điều chuyển Lead ${reassignLeadTarget.customerName} sang chuyên viên ${selectedAgentForReassign}.`)
    setReassignLeadTarget(null)
  }

  // Handler: Save Routing Rules
  const handleSaveRoutingRules = () => {
    setIsRoutingRulesOpen(false)
    showToast(`Đã lưu cấu hình: Phân bổ ${routingAlgorithm.toUpperCase()}, SLA ${slaMinutes} phút, Tự động thu hồi ${autoReassignEnabled ? 'BẬT' : 'TẮT'}.`)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Mã Chiến Dịch", "Tên Chiến Dịch", "Kênh Quảng Cáo", "Trạng Thái", "Ngân Sách (VND)", "Đã Chi Tiêu (VND)", "Clicks", "Leads", "CPL Thực Tế (VND)", "CPL Mục Tiêu (VND)", "Ngày Bắt Đầu"]
    const rows = campaigns.map(c => [
      c.id,
      `"${c.name}"`,
      c.platform,
      c.status,
      c.budget,
      c.spent,
      c.clicks,
      c.leads,
      c.leads > 0 ? Math.round(c.spent / c.leads) : 0,
      c.targetCPL || 0,
      c.startDate
    ])
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `BaoCao_Marketing_NovaCRM_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('📥 Đã xuất báo cáo chiến dịch Marketing định dạng CSV chuẩn UTF-8.')
  }

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <Zap className="h-5 w-5 text-amber-400 shrink-0 animate-bounce" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Điều Hành */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800 text-white">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center gap-1.5">
              <Megaphone className="h-3.5 w-3.5" /> Omnichannel Marketing Automation
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-semibold text-xs">
              Smart Lead Routing Active
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Quản Trị Chiến Dịch Marketing & Phân Bổ Lead
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Tự động hóa quảng cáo đa kênh Facebook, Google, TikTok, Zalo; tối ưu chi phí CPL; đo lường phễu chuyển đổi và phân bổ Lead nóng tức thì cho chuyên viên kinh doanh.
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button 
            onClick={() => setIsSimulateLeadOpen(true)}
            variant="outline"
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 font-bold text-xs md:text-sm h-10 px-4"
          >
            <Sparkles className="mr-2 h-4 w-4 text-amber-400" /> Giả Lập Bắn Lead
          </Button>

          <Button 
            onClick={() => setIsRoutingRulesOpen(true)}
            variant="outline"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-bold text-xs md:text-sm h-10 px-4"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4 text-indigo-400" /> Cấu Hình Chia Lead
          </Button>

          <Button 
            onClick={handleExportCSV}
            variant="outline"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-bold text-xs md:text-sm h-10 px-3.5"
            title="Xuất Báo Cáo CSV"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button 
            onClick={() => setIsNewCampaignOpen(true)}
            className="bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs md:text-sm h-10 px-5 shadow-lg shadow-pink-600/25"
          >
            <Plus className="mr-1.5 h-5 w-5" /> Tạo Chiến Dịch Mới
          </Button>
        </div>
      </div>

      {/* 4 Thẻ KPI Chiến Lược */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Ngân Sách Tiếp Thị</span>
              <span className="p-2 rounded-lg bg-pink-50 text-pink-600"><Megaphone className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-slate-900">{formatCurrency(totalSpent)}</div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Đã tiêu: {((totalSpent / (totalBudget || 1)) * 100).toFixed(1)}%</span>
              <span className="font-semibold text-slate-700">Tổng: {formatCurrency(totalBudget)}</span>
            </div>
            <Progress value={(totalSpent / (totalBudget || 1)) * 100} className="h-1.5 mt-2 bg-pink-100 [&>div]:bg-pink-600" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Tổng Leads Thu Về</span>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Users className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-emerald-600">{totalLeads.toLocaleString()} Leads</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5"/> +18.4% tuần này
              </span>
              <span className="text-slate-500">Từ 4 nền tảng</span>
            </div>
            <div className="h-1.5 mt-2 rounded-full bg-emerald-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Chi Phí / Lead (CPL TB)</span>
              <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Target className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-indigo-600">{formatCurrency(avgCPL)}</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold">-34.2% so với trần 180k</span>
              <span className="text-slate-500">Benchmark ngành BĐS</span>
            </div>
            <div className="h-1.5 mt-2 rounded-full bg-indigo-100 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Tỷ Lệ Chuyển Đổi Booking</span>
              <span className="p-2 rounded-lg bg-amber-50 text-amber-600"><CheckCircle2 className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-amber-600">8.34%</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">42 Booking thành công</span>
              <span className="text-indigo-600 font-bold">18 HĐMB Đã Ký</span>
            </div>
            <div className="h-1.5 mt-2 rounded-full bg-amber-100 overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '83%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Điều Hướng Chính */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto md:h-12 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="campaigns" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Activity className="h-4 w-4 mr-2 text-pink-600" /> Hiệu Suất Chiến Dịch
          </TabsTrigger>
          <TabsTrigger value="lead-routing" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="h-4 w-4 mr-2 text-indigo-600" /> Sổ Leads & Chia Lead (Live)
          </TabsTrigger>
          <TabsTrigger value="tracking" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Link2 className="h-4 w-4 mr-2 text-blue-600" /> UTM, QR Code & Pixels
          </TabsTrigger>
          <TabsTrigger value="builders" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <LayoutTemplate className="h-4 w-4 mr-2 text-amber-600" /> Mẫu Landing Page BĐS
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: HIỆU SUẤT CHIẾN DỊCH & PHỄU CHUYỂN ĐỔI */}
        <TabsContent value="campaigns" className="space-y-6">
          
          {/* Bộ Lọc & Tìm Kiếm Chiến Dịch */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-1 items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm chiến dịch, từ khóa, nền tảng..."
                  className="pl-9 bg-slate-50 border-slate-200"
                />
              </div>

              {/* Lọc Nền Tảng */}
              <select
                value={platformFilter}
                onChange={e => setPlatformFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tất cả Nền tảng</option>
                <option value="Facebook">Facebook Ads</option>
                <option value="Google">Google Search</option>
                <option value="TikTok">TikTok Ads</option>
                <option value="Zalo">Zalo OA</option>
              </select>

              {/* Lọc Trạng Thái */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">Tất cả Trạng thái</option>
                <option value="Active">Đang chạy (Active)</option>
                <option value="Paused">Tạm dừng (Paused)</option>
                <option value="Completed">Hoàn tất (Completed)</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
              <span>Hiển thị: <strong>{filteredCampaigns.length}</strong> / {campaigns.length} chiến dịch</span>
              {(searchQuery || platformFilter !== 'all' || statusFilter !== 'all') && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { setSearchQuery(''); setPlatformFilter('all'); setStatusFilter('all'); }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 p-0 h-auto font-bold"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          {/* Lưới Danh Sách Chiến Dịch */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredCampaigns.map(camp => {
              const percentSpent = Math.min(100, (camp.spent / camp.budget) * 100)
              const isOverBudget = percentSpent >= 90
              const cplActual = camp.leads > 0 ? Math.round(camp.spent / camp.leads) : 0
              const targetCpl = camp.targetCPL || 200000

              let PlatformIcon = Share2
              let badgeColor = "bg-blue-100 text-blue-700 border-blue-200"
              if (camp.platform === 'Google') { PlatformIcon = Search; badgeColor = "bg-red-100 text-red-700 border-red-200" }
              if (camp.platform === 'TikTok') { PlatformIcon = MonitorPlay; badgeColor = "bg-slate-100 text-slate-900 border-slate-300" }
              if (camp.platform === 'Zalo') { PlatformIcon = MessageSquare; badgeColor = "bg-sky-100 text-sky-700 border-sky-200" }

              return (
                <Card key={camp.id} className="overflow-hidden shadow-sm border-slate-200 hover:border-indigo-300 transition-all">
                  <CardHeader className="pb-3 border-b bg-slate-50/70">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center border shadow-xs ${badgeColor}`}>
                          <PlatformIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base font-bold text-slate-900 leading-snug">{camp.name}</CardTitle>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>Bắt đầu: {camp.startDate}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{camp.assignedTeam || 'Team Kinh Doanh'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Trạng Thái & Nút Bật/Tắt */}
                      <div className="flex items-center gap-2">
                        <Badge className={camp.status === 'Active' ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-500 text-white'}>
                          {camp.status === 'Active' ? 'Đang chạy' : 'Tạm dừng'}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleToggleStatus(camp)}
                          className={`h-8 px-2.5 font-bold text-xs ${camp.status === 'Active' ? 'text-amber-600 hover:bg-amber-50 border-amber-200' : 'text-emerald-600 hover:bg-emerald-50 border-emerald-200'}`}
                          title={camp.status === 'Active' ? 'Tạm dừng chiến dịch' : 'Kích hoạt chiến dịch'}
                        >
                          {camp.status === 'Active' ? <><Pause className="h-3.5 w-3.5 mr-1" /> Dừng</> : <><Play className="h-3.5 w-3.5 mr-1" /> Chạy</>}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4 space-y-4">
                    {/* Tiến độ ngân sách */}
                    <div>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-600">Tiến độ chi tiêu ngân sách</span>
                        <span className={isOverBudget ? "text-red-600 font-bold" : "text-slate-800"}>
                          {percentSpent.toFixed(1)}% ({formatCurrency(camp.spent)} / {formatCurrency(camp.budget)})
                        </span>
                      </div>
                      <Progress 
                        value={percentSpent} 
                        className={`h-2.5 ${isOverBudget ? 'bg-red-100 [&>div]:bg-red-500' : 'bg-slate-100 [&>div]:bg-indigo-600'}`} 
                      />
                    </div>

                    {/* 4 Chỉ Số Vận Hành Nhỏ */}
                    <div className="grid grid-cols-4 gap-2 text-center bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div>
                        <div className="text-[11px] text-muted-foreground font-semibold mb-0.5">Clicks</div>
                        <div className="font-black text-slate-800 text-sm">{camp.clicks.toLocaleString()}</div>
                      </div>
                      <div className="border-l border-slate-200">
                        <div className="text-[11px] text-muted-foreground font-semibold mb-0.5">Leads Form</div>
                        <div className="font-black text-emerald-600 text-sm">{camp.leads}</div>
                      </div>
                      <div className="border-l border-slate-200">
                        <div className="text-[11px] text-muted-foreground font-semibold mb-0.5">CPL Thực Tế</div>
                        <div className="font-bold text-indigo-600 text-sm">{formatCurrency(cplActual)}</div>
                      </div>
                      <div className="border-l border-slate-200">
                        <div className="text-[11px] text-muted-foreground font-semibold mb-0.5">CPL Trần</div>
                        <div className="font-semibold text-slate-600 text-sm">{formatCurrency(targetCpl)}</div>
                      </div>
                    </div>

                    {/* Thao tác nhanh cho chiến dịch */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span>Chia Lead: <strong className="text-slate-700">{camp.routingRule === 'top_seller' ? 'Top Seller' : 'Round-Robin'}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSimLeadCampaignId(camp.id)
                            setIsSimulateLeadOpen(true)
                          }}
                          className="h-8 text-xs text-indigo-600 hover:bg-indigo-50 font-bold"
                        >
                          + Bắn Lead Test
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setUtmCampaignName(camp.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'))
                            setUtmSource(camp.platform.toLowerCase())
                            setActiveTab('tracking')
                            showToast(`Đã nạp thông số chiến dịch "${camp.name}" vào trình tạo UTM.`)
                          }}
                          className="h-8 text-xs text-slate-700 font-bold"
                        >
                          <Link2 className="h-3.5 w-3.5 mr-1" /> Lấy Link UTM
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Phân Tích Đồ Thị & Phễu Chuyển Đổi */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
            
            {/* Biểu Đồ 7 Ngày: Xu Hướng CPL & Lead Volume */}
            <Card className="lg:col-span-2 shadow-sm border-slate-200">
              <CardHeader className="pb-2 border-b bg-slate-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base font-bold flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      Hiệu Suất Leads & Chi Phí CPL (7 Ngày Gần Nhất)
                    </CardTitle>
                    <CardDescription className="text-xs">Theo dõi số lượng Lead đổ về theo ngày và mức độ ổn định của chi phí CPL.</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200">
                    CPL TB: 107.800 VNĐ
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={PERFORMANCE_7DAYS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                        </linearGradient>
                        <linearGradient id="colorCpl" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748B' }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748B' }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(val) => `${val/1000}k`} />
                      <RechartsTooltip 
                        formatter={(val: any, name: any) => {
                          if (name === 'Leads') return [`${val} Leads`, 'Số Leads Thu Về']
                          return [formatCurrency(Number(val)), 'Chi Phí / Lead (CPL)']
                        }}
                      />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="leads" name="Leads" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                      <Area yAxisId="right" type="monotone" dataKey="cpl" name="CPL (VNĐ)" stroke="#6366F1" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorCpl)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Cơ Cấu Chi Tiêu & Leads Theo Kênh */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2 border-b bg-slate-50">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-pink-600" />
                  Cơ Cấu Kênh Quảng Cáo
                </CardTitle>
                <CardDescription className="text-xs">Phân bổ ngân sách theo 4 nền tảng trọng điểm.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {PLATFORM_METRICS.map((plat, idx) => {
                  const percent = ((plat.spent / totalSpent) * 100).toFixed(1)
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: plat.color }}></span>
                          {plat.name}
                        </span>
                        <span className="text-slate-800">{percent}% ({formatCurrency(plat.spent)})</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: plat.color }}></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>{plat.leads} Leads thu về</span>
                        <span>CPL: {formatCurrency(plat.cpl)}</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Phễu Chuyển Đổi Đa Tầng (End-to-End Funnel) */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b bg-slate-50">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-600" />
                    Phễu Chuyển Đổi Tiếp Thị Đến Doanh Thu BĐS (Conversion Funnel)
                  </CardTitle>
                  <CardDescription className="text-xs">Tỷ lệ rơi rụng qua 6 nấc: Tiếp cận ➔ Clicks ➔ Form Leads ➔ Qualified ➔ Booking ➔ Hợp Đồng Cọc.</CardDescription>
                </div>
                <Badge className="bg-indigo-600 text-white font-bold text-xs">
                  Tổng Doanh Thu Quy Đổi: 248.5 Tỷ VNĐ
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                {[
                  { step: '1. Impressions', count: '145.000', rate: '100%', sub: 'Hiển thị QC', color: 'bg-slate-100 border-slate-300 text-slate-800' },
                  { step: '2. Link Clicks', count: '13.150', rate: '9.06% CTR', sub: 'Truy cập LP', color: 'bg-blue-50 border-blue-200 text-blue-800' },
                  { step: '3. Leads Form', count: '503', rate: '3.82% CVR', sub: 'Để lại SĐT', color: 'bg-purple-50 border-purple-200 text-purple-800' },
                  { step: '4. Qualified Leads', count: '186', rate: '36.9%', sub: 'Có nhu cầu thực', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                  { step: '5. Giữ Chỗ (Booking)', count: '42', rate: '22.5%', sub: 'Nộp cọc thiện chí', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                  { step: '6. HĐMB / Cọc Đứt', count: '18', rate: '42.8%', sub: 'Chốt thành công', color: 'bg-indigo-600 border-indigo-700 text-white' }
                ].map((st, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex flex-col justify-between ${st.color} relative group`}>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider opacity-80 mb-1">{st.step}</div>
                      <div className="text-xl font-black">{st.count}</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-black/10">
                      <div className="text-xs font-bold">{st.rate}</div>
                      <div className="text-[10px] opacity-75">{st.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: SỔ LEADS NÓNG & SMART LEAD ROUTING */}
        <TabsContent value="lead-routing" className="space-y-6">
          
          {/* Banner Quy Tắc Phân Bổ Tự Động */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-5 rounded-2xl border border-indigo-800 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400 animate-pulse" />
                <h3 className="font-bold text-base text-white">Hệ Thống Phân Bổ Lead Tự Động (Smart Lead Routing)</h3>
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px]">Đang hoạt động</Badge>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Đang áp dụng thuật toán <strong>{routingAlgorithm === 'top_seller' ? 'Ưu Tiên Top Seller (Weighted)' : routingAlgorithm === 'round_robin' ? 'Xoay Vòng Đều (Round-Robin)' : 'Theo Dự Án'}</strong>.
                Cam kết SLA phản hồi: <strong>{slaMinutes} Phút</strong>. Nếu sale không gọi trong thời gian này, hệ thống sẽ tự động thu hồi và đẩy cho sale kế tiếp.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setIsRoutingRulesOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs h-9"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" /> Điều Chỉnh Thuật Toán
              </Button>
              <Button 
                onClick={() => setIsSimulateLeadOpen(true)}
                variant="outline"
                className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/30 font-bold text-xs h-9"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-400" /> Bắn Lead Thử
              </Button>
            </div>
          </div>

          {/* Bộ Lọc Sổ Leads Nóng */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  value={leadSearch}
                  onChange={e => setLeadSearch(e.target.value)}
                  placeholder="Tìm theo tên khách, SĐT, dự án..."
                  className="pl-9 bg-slate-50 border-slate-200"
                />
              </div>
              <select
                value={leadStatusFilter}
                onChange={e => setLeadStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 outline-none"
              >
                <option value="all">Tất cả Trạng thái Lead</option>
                <option value="Mới">Mới Đổ Về</option>
                <option value="Đã gọi">Đã Gọi Điện</option>
                <option value="Hẹn xem sa bàn">Hẹn Xem Sa Bàn</option>
                <option value="Đã cọc">Đã Chốt Cọc</option>
              </select>
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              Tổng số Lead đang theo dõi: <strong>{filteredLeads.length}</strong>
            </div>
          </div>

          {/* Bảng Danh Sách Leads Nóng */}
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-bold text-xs">Mã Lead & Khách Hàng</TableHead>
                  <TableHead className="font-bold text-xs">Nguồn & Chiến Dịch</TableHead>
                  <TableHead className="font-bold text-xs">Dự Án Quan Tâm</TableHead>
                  <TableHead className="font-bold text-xs">Chuyên Viên Trực</TableHead>
                  <TableHead className="font-bold text-xs">SLA Phản Hồi</TableHead>
                  <TableHead className="font-bold text-xs">Trạng Thái</TableHead>
                  <TableHead className="font-bold text-xs text-right">Thao Tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => {
                  const isExpiring = lead.slaRemainingMinutes > 0 && lead.slaRemainingMinutes <= 5
                  const isExpired = lead.slaRemainingMinutes === 0 && lead.status === 'Mới'

                  return (
                    <TableRow key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <TableCell>
                        <div className="font-bold text-slate-900 text-sm">{lead.customerName}</div>
                        <div className="text-xs font-mono text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{lead.phone}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-400">{lead.id}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="text-[10px] uppercase font-bold py-0">
                            {lead.platform}
                          </Badge>
                          <span className="text-xs text-slate-600 truncate max-w-[160px]" title={lead.campaignName}>
                            {lead.campaignName}
                          </span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{lead.inflowTime}</div>
                      </TableCell>

                      <TableCell>
                        <div className="text-xs font-semibold text-slate-800">{lead.projectInterested}</div>
                        {lead.notes && (
                          <div className="text-[11px] text-slate-500 italic truncate max-w-[220px]" title={lead.notes}>
                            &ldquo;{lead.notes}&rdquo;
                          </div>
                        )}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                            {lead.assignedAgent.split(' ').pop()?.[0]}
                          </div>
                          <span className="text-xs font-medium text-slate-800">{lead.assignedAgent}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        {lead.status === 'Mới' ? (
                          lead.slaRemainingMinutes > 0 ? (
                            <Badge className={`text-xs font-bold ${isExpiring ? 'bg-amber-500 text-white animate-pulse' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                              <Clock className="h-3 w-3 mr-1" /> Còn {lead.slaRemainingMinutes} phút
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500 text-white text-xs font-bold animate-bounce">
                              <AlertTriangle className="h-3 w-3 mr-1" /> Quá hạn SLA!
                            </Badge>
                          )
                        ) : (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Đúng SLA
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge className={
                          lead.status === 'Mới' ? 'bg-blue-600 text-white' :
                          lead.status === 'Đã gọi' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          lead.status === 'Hẹn xem sa bàn' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          lead.status === 'Đã cọc' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 text-slate-700'
                        }>
                          {lead.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              showToast(`📞 Đang kết nối tổng đài gọi cho khách ${lead.customerName} (${lead.phone})...`)
                              // Mark lead as called
                              setInboundLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: 'Đã gọi' } : l))
                            }}
                            className="h-8 px-2.5 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-bold"
                            title="Gọi điện ngay"
                          >
                            <PhoneCall className="h-3.5 w-3.5 mr-1" /> Gọi
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setReassignLeadTarget(lead)
                            }}
                            className="h-8 px-2.5 text-xs text-indigo-600 hover:bg-indigo-50 font-bold"
                            title="Chuyển chuyên viên khác"
                          >
                            <RefreshCcw className="h-3.5 w-3.5 mr-1" /> Đổi Sale
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 3: TRÌNH TẠO UTM & TRACKING PIXELS */}
        <TabsContent value="tracking" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Live UTM Builder */}
            <Card className="shadow-md border-indigo-100">
              <CardHeader className="pb-4 bg-indigo-50/40 border-b">
                <CardTitle className="flex items-center gap-2 text-lg text-indigo-900 font-bold">
                  <Link2 className="h-5 w-5 text-indigo-600" /> Trình Tạo Link UTM Động (Live Generator)
                </CardTitle>
                <CardDescription className="text-xs">
                  Gắn mã UTM chuẩn xác để Google Analytics và CRM nhận diện nguồn khách hàng, chiến dịch và quảng cáo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-5">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Link Đích (Target URL)</Label>
                  <Input 
                    value={utmUrl} 
                    onChange={e => setUtmUrl(e.target.value)} 
                    placeholder="https://novacrm.vn/landing/grand-manhattan" 
                    className="font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 uppercase">Nguồn (utm_source)</Label>
                    <select
                      value={utmSource}
                      onChange={e => setUtmSource(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                    >
                      <option value="facebook">facebook</option>
                      <option value="google">google</option>
                      <option value="tiktok">tiktok</option>
                      <option value="zalo">zalo</option>
                      <option value="email">email</option>
                      <option value="offline_standee">offline_standee</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 uppercase">Phương tiện (utm_medium)</Label>
                    <select
                      value={utmMedium}
                      onChange={e => setUtmMedium(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                    >
                      <option value="cpc">cpc (Quảng cáo click)</option>
                      <option value="lead_form">lead_form (Form trực tiếp)</option>
                      <option value="cpm">cpm (Hiển thị banner)</option>
                      <option value="qr_code">qr_code (Quét mã)</option>
                      <option value="zns">zns (Zalo Notification)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 uppercase">Tên chiến dịch (utm_campaign)</Label>
                    <Input 
                      value={utmCampaignName} 
                      onChange={e => setUtmCampaignName(e.target.value)} 
                      placeholder="grand_manhattan_q4_2026" 
                      className="text-sm font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 uppercase">Nội dung mẫu QC (utm_content)</Label>
                    <Input 
                      value={utmContent} 
                      onChange={e => setUtmContent(e.target.value)} 
                      placeholder="video_review_avani_hotel" 
                      className="text-sm font-mono"
                    />
                  </div>
                </div>

                {/* Kết quả Link sinh ra */}
                <div className="p-4 bg-indigo-50/80 rounded-xl border border-indigo-100 mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold text-indigo-900 uppercase">Đường Link Chiến Dịch Hoàn Chỉnh</Label>
                    <Badge variant="outline" className="text-[10px] bg-white text-indigo-700 border-indigo-200 font-mono">
                      Live Preview
                    </Badge>
                  </div>
                  <div className="p-3 bg-white border border-indigo-200 rounded-lg text-xs font-mono text-indigo-800 break-all select-all leading-relaxed shadow-inner">
                    {generatedUtmUrl}
                  </div>
                  <Button 
                    onClick={() => copyToClipboard(generatedUtmUrl)} 
                    className={`w-full font-bold h-10 mt-2 ${copiedUtm ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                  >
                    {copiedUtm ? <><Check className="h-4 w-4 mr-2" /> Đã Sao Chép Link</> : <><Copy className="h-4 w-4 mr-2" /> Sao Chép Đường Link Này</>}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* QR Code & Tracking Pixels Hub */}
            <div className="flex flex-col gap-6">
              
              {/* QR Code Tự Động Theo UTM */}
              <Card className="shadow-md border-slate-200">
                <CardHeader className="pb-3 border-b bg-slate-50">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <QrCode className="h-5 w-5 text-indigo-600" /> Mã QR Standee & Tờ Rơi Tự Động
                  </CardTitle>
                  <CardDescription className="text-xs">Mã QR mã hóa trực tiếp đường link UTM ở cột bên trái.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col sm:flex-row items-center gap-5">
                  <div className="h-32 w-32 border-2 border-indigo-100 rounded-2xl p-2.5 bg-white shadow-xs shrink-0 flex items-center justify-center relative group">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
                      <path fill="currentColor" d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h10v10H40zM50 10h10v10H50zM40 20h20v10H40zM30 40h10v20H30zM40 50h20v10H40zM70 40h10v10H70zM80 50h20v10H80zM90 60h10v20H90zM70 80h20v20H70zM40 80h10v20H40zM50 70h20v10H50z" />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2 text-left">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Quét mã này tại sự kiện mở bán hoặc in lên Standee. Khách hàng quét mã sẽ tự động được ghi nhận vào nguồn <strong>{utmSource}</strong> / <strong>{utmMedium}</strong>.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <Button 
                        size="sm"
                        onClick={() => showToast('📥 Đã tải file ảnh QR Code Standee độ phân giải cao 300 DPI.')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9"
                      >
                        <Download className="h-3.5 w-3.5 mr-1.5" /> Tải Mã QR (PNG)
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => showToast('🖨️ Đã gửi lệnh in Standee mẫu khổ 60x160cm đến máy in nội bộ.')}
                        className="text-xs font-bold h-9"
                      >
                        In Standee Sự Kiện
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pixel & Conversion API Config */}
              <Card className="shadow-md border-slate-200">
                <CardHeader className="pb-3 border-b bg-slate-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
                      <Code className="h-5 w-5 text-pink-600" /> Cấu Hình Tracking Pixels & CAPI
                    </CardTitle>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                      100% Server Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  {pixels.map(px => (
                    <div key={px.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div>
                        <div className="font-bold text-xs text-slate-800">{px.name}</div>
                        <div className="font-mono text-xs text-slate-500 mt-0.5">{px.code}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                          Active • {px.latency}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => showToast(`Ping test pixel ${px.name}: 200 OK, Latency ${px.latency}.`)}
                          className="h-7 px-2 text-xs text-indigo-600 hover:bg-indigo-50 font-bold"
                        >
                          Ping Test
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: MẪU LANDING PAGE BẤT ĐỘNG SẢN */}
        <TabsContent value="builders" className="space-y-6">
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-pink-50 p-5 rounded-2xl border border-indigo-100">
            <div>
              <h2 className="text-base md:text-lg font-black text-indigo-950 flex items-center gap-2">
                <LayoutTemplate className="h-5 w-5 text-indigo-600" /> Thư Viện Landing Page Bất Động Sản Chuyển Đổi Cao
              </h2>
              <p className="text-xs md:text-sm text-indigo-800 mt-1">
                Các mẫu Landing Page tối ưu hóa theo tiêu chuẩn dự án Novaland, tích hợp sẵn Form bóc tách dữ liệu và mã Tracking Pixel.
              </p>
            </div>
            <Button 
              onClick={() => showToast('✨ Khởi tạo trình soạn thảo Landing Page tùy biến (Drag-and-Drop Editor).')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-10 px-4 shrink-0"
            >
              + Tạo Trang Mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {LANDING_TEMPLATES.map(tpl => (
              <Card key={tpl.id} className="overflow-hidden group border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  <div className={`h-48 bg-gradient-to-br ${tpl.color} p-6 relative flex flex-col justify-between text-white overflow-hidden`}>
                    <div className="flex justify-between items-start z-10">
                      <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 text-[10px] uppercase font-bold">
                        {tpl.tag}
                      </Badge>
                      <Badge className="bg-emerald-500 text-white font-black text-[10px]">
                        CVR: {tpl.cvr}
                      </Badge>
                    </div>

                    <div className="z-10">
                      <div className="text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1">{tpl.project}</div>
                      <div className="text-sm font-black line-clamp-2 leading-snug">{tpl.headline}</div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20">
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        onClick={() => setPreviewTemplate(tpl)}
                        className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> Xem Thử
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setNewCampName(`Chiến Dịch LP - ${tpl.name}`)
                          setIsNewCampaignOpen(true)
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                      >
                        Dùng Mẫu
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{tpl.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tpl.sub}</p>
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <span>Lượt truy cập: <strong>{tpl.views}</strong></span>
                      <span className="text-indigo-600 font-bold">Chuẩn Mobile PWA</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL 1: TẠO CHIẾN DỊCH MARKETING MỚI */}
      <Dialog open={isNewCampaignOpen} onOpenChange={setIsNewCampaignOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-600" /> Tạo Chiến Dịch Marketing Mới
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Cấu hình ngân sách, nền tảng quảng cáo và liên kết trực tiếp với dự án trong hệ thống CRM.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateCampaign} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Tên Chiến Dịch Quảng Cáo *</Label>
              <Input 
                value={newCampName} 
                onChange={e => setNewCampName(e.target.value)} 
                placeholder="Ví dụ: Lead Gen - The Grand Manhattan (Q4/2026)" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Nền Tảng Quảng Cáo</Label>
                <select
                  value={newCampPlatform}
                  onChange={e => setNewCampPlatform(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  <option value="Facebook">Facebook Ads</option>
                  <option value="Google">Google Search</option>
                  <option value="TikTok">TikTok Ads</option>
                  <option value="Zalo">Zalo OA / ZNS</option>
                  <option value="Email">Email Marketing</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Dự Án BĐS Trọng Điểm</Label>
                <select
                  value={newCampProject}
                  onChange={e => setNewCampProject(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Tổng Ngân Sách Dự Kiến (VNĐ)</Label>
                <Input 
                  type="number" 
                  value={newCampBudget} 
                  onChange={e => setNewCampBudget(Number(e.target.value))} 
                  step="5000000"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Mục Tiêu CPL Trần (VNĐ/Lead)</Label>
                <Input 
                  type="number" 
                  value={newCampTargetCPL} 
                  onChange={e => setNewCampTargetCPL(Number(e.target.value))} 
                  step="10000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Thuật Toán Chia Lead</Label>
                <select
                  value={newCampRouting}
                  onChange={e => setNewCampRouting(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  <option value="top_seller">Ưu Tiên Top Seller (50/30/20)</option>
                  <option value="round_robin">Xoay Vòng Đều (Round-Robin)</option>
                  <option value="by_project">Chuyên Viên Chuyên Trách Dự Án</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Đội Ngũ Tiếp Nhận</Label>
                <Input 
                  value={newCampTeam} 
                  onChange={e => setNewCampTeam(e.target.value)} 
                  placeholder="Team Luxury Alpha"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsNewCampaignOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Khởi Tạo Chiến Dịch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CẤU HÌNH PHÂN BỔ LEAD TỰ ĐỘNG (SMART ROUTING) */}
      <Dialog open={isRoutingRulesOpen} onOpenChange={setIsRoutingRulesOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-indigo-600" /> Cấu Hình Smart Lead Routing Engine
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Thiết lập quy tắc phân bổ khách hàng tiềm năng đổ về từ các kênh quảng cáo và cam kết thời gian phản hồi SLA.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700 uppercase">Chọn Thuật Toán Phân Bổ Chủ Đạo</Label>
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  { id: 'top_seller', title: '1. Ưu Tiên Top Seller (Hiệu Suất Cao)', desc: 'Phân bổ 50% leads cho Top 3 Seller có doanh số cao nhất tháng, 30% cho Senior, 20% cho Junior.' },
                  { id: 'round_robin', title: '2. Xoay Vòng Đều (Round-Robin 1:1)', desc: 'Chia đều tuần tự từng lead cho tất cả chuyên viên đang trực ca trực tuyến.' },
                  { id: 'by_project', title: '3. Chuyên Viên Chuyên Trách Dự Án', desc: 'Chỉ chia lead cho các sale đã vượt qua kỳ thi sát hạch chứng chỉ bán hàng của dự án đó.' }
                ].map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => setRoutingAlgorithm(item.id as any)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      routingAlgorithm === item.id 
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-xs' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      {routingAlgorithm === item.id && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                    </div>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Thời Gian SLA Thu Hồi Lead</Label>
                <select
                  value={slaMinutes}
                  onChange={e => setSlaMinutes(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  <option value={10}>10 Phút (Gắt gao - Hot Leads)</option>
                  <option value={15}>15 Phút (Chuẩn khuyến nghị)</option>
                  <option value={30}>30 Phút (Nới lỏng ngoài giờ)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Cơ Chế Re-assign Tự Động</Label>
                <select
                  value={autoReassignEnabled ? 'true' : 'false'}
                  onChange={e => setAutoReassignEnabled(e.target.value === 'true')}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  <option value="true">BẬT (Tự thu hồi & bắn sale khác)</option>
                  <option value="false">TẮT (Chỉ gửi cảnh báo Notification)</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setIsRoutingRulesOpen(false)}>Đóng</Button>
            <Button onClick={handleSaveRoutingRules} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Lưu Cấu Hình
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: GIẢ LẬP BẮN LEAD KHÁCH HÀNG (TEST INFLOW) */}
      <Dialog open={isSimulateLeadOpen} onOpenChange={setIsSimulateLeadOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" /> Giả Lập Khách Hàng Điền Form Quảng Cáo
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Mô phỏng hành vi khách hàng submit form Facebook/Google Ads. Hệ thống sẽ tự động bóc tách và kích hoạt Smart Routing.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSimulateLead} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Họ Tên Khách Hàng Mẫu *</Label>
              <Input 
                value={simLeadName} 
                onChange={e => setSimLeadName(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Số Điện Thoại Khách Hàng *</Label>
              <Input 
                value={simLeadPhone} 
                onChange={e => setSimLeadPhone(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Chiến Dịch Nguồn</Label>
              <select
                value={simLeadCampaignId}
                onChange={e => setSimLeadCampaignId(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
              >
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.platform})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Ghi Chú Nhu Cầu</Label>
              <Input 
                value={simLeadNote} 
                onChange={e => setSimLeadNote(e.target.value)} 
              />
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsSimulateLeadOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                ⚡ Bắn Lead Ngay
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: CHUYỂN GIAO LEAD (RE-ASSIGN) */}
      <Dialog open={reassignLeadTarget !== null} onOpenChange={() => setReassignLeadTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RefreshCcw className="h-5 w-5 text-indigo-600" /> Điều Chuyển Lead Cho Chuyên Viên Khác
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Lead: <strong>{reassignLeadTarget?.customerName}</strong> ({reassignLeadTarget?.phone})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <Label className="text-xs font-bold text-slate-700 uppercase">Chọn Chuyên Viên Nhận Lead Mới</Label>
            <select
              value={selectedAgentForReassign}
              onChange={e => setSelectedAgentForReassign(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
            >
              <option value="Nguyễn Mai">Nguyễn Mai (Senior - Tỷ lệ chốt 28%)</option>
              <option value="Lê Hoàng Anh">Lê Hoàng Anh (Top Seller - Tỷ lệ chốt 35%)</option>
              <option value="Thanh Hà">Thanh Hà (Chuyên viên Grand Manhattan)</option>
              <option value="Trần Khoa">Trần Khoa (Trưởng phòng KD)</option>
              <option value="Tuấn Tú">Tuấn Tú (Chuyên viên Aqua City)</option>
            </select>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button variant="outline" onClick={() => setReassignLeadTarget(null)}>Hủy</Button>
            <Button onClick={handleReassignLead} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Xác Nhận Chuyển Giao
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: XEM TRƯỚC LANDING PAGE MOBILE MOCKUP */}
      <Dialog open={previewTemplate !== null} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b bg-slate-50 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-base font-bold">{previewTemplate?.name}</DialogTitle>
              <DialogDescription className="text-xs">Mô phỏng hiển thị trên màn hình iPhone 16 Pro.</DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex-1 bg-slate-900/90 p-8 flex items-center justify-center overflow-y-auto">
            {/* Phone Frame */}
            <div className="w-[360px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-4 border-slate-800 relative">
              {/* Dynamic Island */}
              <div className="w-24 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-slate-800 mr-2"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-blue-900/40"></div>
              </div>

              {/* Screen Body */}
              <div className="bg-white rounded-[32px] overflow-hidden text-slate-900 min-h-[520px]">
                <div className={`p-6 text-white bg-gradient-to-br ${previewTemplate?.color || 'from-indigo-600 to-slate-900'}`}>
                  <Badge className="bg-white/20 text-white text-[10px] mb-2">{previewTemplate?.project}</Badge>
                  <h3 className="font-black text-lg leading-tight mb-2">{previewTemplate?.headline}</h3>
                  <p className="text-xs text-white/90">{previewTemplate?.sub}</p>
                </div>

                <div className="p-5 space-y-3">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">Đăng ký nhận bảng giá đợt 1</div>
                  <Input placeholder="Họ và tên của bạn *" className="h-9 text-xs" defaultValue="Nguyễn Văn Tuấn" />
                  <Input placeholder="Số điện thoại Zalo *" className="h-9 text-xs" defaultValue="0901 234 567" />
                  <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-black text-xs h-10 shadow-md">
                    NHẬN TRỌN BỘ SALES KIT & BẢNG GIÁ
                  </Button>
                  <p className="text-[10px] text-slate-400 text-center">Cam kết bảo mật thông tin 100%.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-slate-50">
            <Button variant="outline" onClick={() => setPreviewTemplate(null)}>Đóng</Button>
            <Button 
              onClick={() => {
                const tpl = previewTemplate
                setPreviewTemplate(null)
                if (tpl) {
                  setNewCampName(`Chiến Dịch - ${tpl.name}`)
                  setIsNewCampaignOpen(true)
                }
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              Sử Dụng Mẫu Này Cho Chiến Dịch Mới
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
