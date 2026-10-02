"use client"

import React, { useState, useMemo } from 'react'
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { 
  BarChart3, Users, Target, Activity, TrendingUp, DollarSign, Award, 
  ArrowUpRight, ArrowDownRight, CheckCircle2, AlertTriangle, Clock, 
  Filter, Download, ShieldCheck, UserCheck, Flame, Building2, Check,
  XCircle, Send, Plus, ChevronRight, Eye, RefreshCw, Sparkles, Phone,
  FileSpreadsheet, Layers, Share2, AlertCircle, HelpCircle, Gift
} from "lucide-react"
import { useStore } from '@/store/useStore'
import { BookingTicket } from '@/types'
import Link from 'next/link'

// Floor data structures
interface TeamPerformance {
  id: string
  name: string
  leader: string
  leaderAvatar: string
  membersCount: number
  target: number
  actual: number
  deals: number
  conversionRate: number
  commission: number
  status: 'surpassed' | 'on_track' | 'behind'
}

interface FloorConfig {
  id: string
  name: string
  address: string
  director: string
  staffCount: number
  targetRevenue: number
  actualRevenue: number
  dealsCount: number
  teams: TeamPerformance[]
}

const FLOOR_CONFIGS: Record<string, FloorConfig> = {
  'floor-q1': {
    id: 'floor-q1',
    name: 'Sàn Hội Sở Q1 (Novaland Gallery)',
    address: 'Số 65 Nguyễn Du, P. Bến Nghé, Quận 1, TP.HCM',
    director: 'Trần Khoa (GĐ Sàn)',
    staffCount: 28,
    targetRevenue: 150000000000,
    actualRevenue: 128500000000,
    dealsCount: 18,
    teams: [
      {
        id: 'team-diamond',
        name: 'Team Diamond Alpha',
        leader: 'Trần Khoa',
        leaderAvatar: 'TK',
        membersCount: 8,
        target: 45000000000,
        actual: 48500000000,
        deals: 7,
        conversionRate: 25.2,
        commission: 1455000000,
        status: 'surpassed'
      },
      {
        id: 'team-platinum',
        name: 'Team Platinum Stars',
        leader: 'Lê Nam',
        leaderAvatar: 'LN',
        membersCount: 7,
        target: 40000000000,
        actual: 34200000000,
        deals: 5,
        conversionRate: 19.5,
        commission: 1026000000,
        status: 'on_track'
      },
      {
        id: 'team-gold',
        name: 'Team Golden Hunters',
        leader: 'Minh Hùng',
        leaderAvatar: 'MH',
        membersCount: 7,
        target: 35000000000,
        actual: 31800000000,
        deals: 4,
        conversionRate: 18.0,
        commission: 954000000,
        status: 'on_track'
      },
      {
        id: 'team-elite',
        name: 'Team Elite VIP Club',
        leader: 'Bảo Trâm',
        leaderAvatar: 'BT',
        membersCount: 6,
        target: 30000000000,
        actual: 14000000000,
        deals: 2,
        conversionRate: 12.2,
        commission: 420000000,
        status: 'behind'
      }
    ]
  },
  'floor-thuduc': {
    id: 'floor-thuduc',
    name: 'Sàn Giao Dịch Thủ Đức (Masterise Hub)',
    address: 'Đỗ Xuân Hợp, P. An Phú, TP. Thủ Đức',
    director: 'Lê Nam (TPKD Khối Đông)',
    staffCount: 18,
    targetRevenue: 110000000000,
    actualRevenue: 94200000000,
    dealsCount: 14,
    teams: [
      {
        id: 'team-td1',
        name: 'Team Đông Sài Gòn',
        leader: 'Ngô Thanh',
        leaderAvatar: 'NT',
        membersCount: 9,
        target: 60000000000,
        actual: 56000000000,
        deals: 8,
        conversionRate: 21.0,
        commission: 1680000000,
        status: 'on_track'
      },
      {
        id: 'team-td2',
        name: 'Team Căn Hộ Cao Cấp',
        leader: 'Vũ Đức',
        leaderAvatar: 'VD',
        membersCount: 9,
        target: 50000000000,
        actual: 38200000000,
        deals: 6,
        conversionRate: 17.5,
        commission: 1146000000,
        status: 'behind'
      }
    ]
  },
  'floor-dongnai': {
    id: 'floor-dongnai',
    name: 'Sàn Vệ Tinh Aqua City Đồng Nai',
    address: 'Khu Đô Thị Sinh Thái Aqua City, Long Hưng, Biên Hòa',
    director: 'Minh Hùng (Giám Đốc Chi Nhánh)',
    staffCount: 22,
    targetRevenue: 90000000000,
    actualRevenue: 82000000000,
    dealsCount: 11,
    teams: [
      {
        id: 'team-dn1',
        name: 'Team Đảo Phượng Hoàng',
        leader: 'Hoàng Long',
        leaderAvatar: 'HL',
        membersCount: 11,
        target: 50000000000,
        actual: 49500000000,
        deals: 7,
        conversionRate: 23.5,
        commission: 1485000000,
        status: 'on_track'
      },
      {
        id: 'team-dn2',
        name: 'Team River Park',
        leader: 'Thái An',
        leaderAvatar: 'TA',
        membersCount: 11,
        target: 40000000000,
        actual: 32500000000,
        deals: 4,
        conversionRate: 16.8,
        commission: 975000000,
        status: 'on_track'
      }
    ]
  }
}

// Monthly trend data
const MONTHLY_REVENUE_TREND = [
  { month: 'T1', target: 80, actual: 75, deals: 10 },
  { month: 'T2', target: 85, actual: 82, deals: 11 },
  { month: 'T3', target: 95, actual: 98, deals: 14 },
  { month: 'T4', target: 110, actual: 115, deals: 15 },
  { month: 'T5', target: 125, actual: 132, deals: 17 },
  { month: 'T6', target: 135, actual: 140, deals: 19 },
  { month: 'T7 (HT)', target: 150, actual: 128.5, deals: 18 },
]

// Project distribution
const PROJECT_CONTRIBUTION = [
  { name: 'The Global City', value: 36, color: '#6366f1', amount: '46.2 Tỷ' },
  { name: 'Aqua City', value: 32, color: '#0ea5e9', amount: '41.1 Tỷ' },
  { name: 'NovaWorld Phan Thiet', value: 20, color: '#f59e0b', amount: '25.7 Tỷ' },
  { name: 'The Grand Manhattan', value: 12, color: '#10b981', amount: '15.5 Tỷ' },
]

// Sales agents leaderboard
interface AgentLeaderboardItem {
  id: string
  name: string
  team: string
  avatar: string
  rank: number
  revenue: number // VNĐ
  deals: number
  conversionRate: number
  commission: number
  targetPercent: number
  trend: 'up' | 'down' | 'same'
  badgeTitle: string
}

const AGENT_LEADERBOARD_DATA: AgentLeaderboardItem[] = [
  {
    id: 'ag-1',
    name: 'Lê Hoàng Anh',
    team: 'Team Diamond Alpha',
    avatar: 'LHA',
    rank: 1,
    revenue: 45500000000,
    deals: 6,
    conversionRate: 28.5,
    commission: 1365000000,
    targetPercent: 151.6,
    trend: 'up',
    badgeTitle: 'Top Performer Sàn 👑'
  },
  {
    id: 'ag-2',
    name: 'Thanh Hà',
    team: 'Team Elite VIP Club',
    avatar: 'TH',
    rank: 2,
    revenue: 35000000000,
    deals: 4,
    conversionRate: 24.2,
    commission: 1050000000,
    targetPercent: 140.0,
    trend: 'up',
    badgeTitle: 'Vua Chốt Biệt Thự 🥈'
  },
  {
    id: 'ag-3',
    name: 'Tuấn Tú',
    team: 'Team Platinum Stars',
    avatar: 'TT',
    rank: 3,
    revenue: 28400000000,
    deals: 4,
    conversionRate: 19.8,
    commission: 852000000,
    targetPercent: 113.6,
    trend: 'down',
    badgeTitle: 'Chiến Binh Bền Bỉ 🥉'
  },
  {
    id: 'ag-4',
    name: 'Nguyễn Mai',
    team: 'Team Diamond Alpha',
    avatar: 'NM',
    rank: 4,
    revenue: 18500000000,
    deals: 3,
    conversionRate: 16.5,
    commission: 555000000,
    targetPercent: 92.5,
    trend: 'up',
    badgeTitle: 'Chuyên Gia Căn Hộ'
  },
  {
    id: 'ag-5',
    name: 'Minh Anh',
    team: 'Team Golden Hunters',
    avatar: 'MA',
    rank: 5,
    revenue: 12000000000,
    deals: 2,
    conversionRate: 14.0,
    commission: 360000000,
    targetPercent: 80.0,
    trend: 'up',
    badgeTitle: 'Rookie Xuất Sắc'
  },
  {
    id: 'ag-6',
    name: 'Đặng Tuấn Kiệt',
    team: 'Team Platinum Stars',
    avatar: 'TK',
    rank: 6,
    revenue: 8500000000,
    deals: 1,
    conversionRate: 11.2,
    commission: 255000000,
    targetPercent: 70.8,
    trend: 'down',
    badgeTitle: 'Chuyên Viên Shophouse'
  }
]

export default function ManagerDashboard() {
  const { 
    contracts, customers, inventory, bookingTickets, projects,
    updateBookingTicketStatus, rejectBookingTicket, extendBookingSLA 
  } = useStore()

  // Selected floor & period
  const [selectedFloorId, setSelectedFloorId] = useState<string>('floor-q1')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [approvalFilter, setApprovalFilter] = useState<string>('all')
  const [leaderboardTab, setLeaderboardTab] = useState<'agents' | 'teams'>('agents')

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Modals state
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false)
  const [quotaTargetTeam, setQuotaTargetTeam] = useState('team-diamond')
  const [quotaProject, setQuotaProject] = useState('p5')
  const [quotaUnitsCount, setQuotaUnitsCount] = useState('6')
  const [quotaRevenueTarget, setQuotaRevenueTarget] = useState('50')

  const [isLeadDispatchModalOpen, setIsLeadDispatchModalOpen] = useState(false)
  const [leadDispatchMode, setLeadDispatchMode] = useState('round_robin')
  const [selectedAgentsForLead, setSelectedAgentsForLead] = useState<string[]>([
    'Lê Hoàng Anh', 'Thanh Hà', 'Tuấn Tú', 'Nguyễn Mai'
  ])

  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false)
  const [rewardAgentName, setRewardAgentName] = useState('Lê Hoàng Anh')
  const [rewardType, setRewardType] = useState('cash_5m')
  const [rewardNote, setRewardNote] = useState('Thưởng nóng thành tích chốt Shophouse Soho 36 Tỷ vượt chỉ tiêu tháng.')

  // Ticket viewing modal
  const [selectedTicket, setSelectedTicket] = useState<BookingTicket | null>(null)

  // Reject dialog
  const [rejectTicketId, setRejectTicketId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('Hồ sơ tài chính chưa đủ điều kiện cam kết thanh toán')

  // Active floor configuration
  const currentFloor = FLOOR_CONFIGS[selectedFloorId] || FLOOR_CONFIGS['floor-q1']

  // Pending approval tickets from Store
  const pendingApprovals = useMemo(() => {
    return bookingTickets.filter(t => {
      if (approvalFilter === 'manager') return t.status === 'manager'
      if (approvalFilter === 'director') return t.status === 'director'
      if (approvalFilter === 'urgent') return t.priority === 'urgent'
      // All pending manager/director/payment
      return t.status === 'manager' || t.status === 'director' || t.priority === 'urgent'
    })
  }, [bookingTickets, approvalFilter])

  // Manager stats calculation
  const totalLockedInventory = useMemo(() => {
    return inventory.filter(i => i.status === 'Booking' || i.status === 'Đang khóa').length
  }, [inventory])

  const totalBookingValue = useMemo(() => {
    return bookingTickets.reduce((sum, t) => sum + (t.price || 0), 0)
  }, [bookingTickets])

  // Handlers
  const handleApproveTicket = (ticket: BookingTicket) => {
    let nextStatus: 'director' | 'payment' | 'contract' = 'director'
    let actionNote = 'Trưởng phòng kinh doanh đã phê duyệt hồ sơ và chuyển tiếp lên Giám đốc khối.'
    
    if (ticket.status === 'director') {
      nextStatus = 'payment'
      actionNote = 'Giám đốc sàn đã phê duyệt hồ sơ và lệnh giữ căn độc quyền.'
    } else if (ticket.status === 'manager') {
      nextStatus = 'director'
      actionNote = 'Trưởng phòng kinh doanh đã phê duyệt hồ sơ và chuyển tiếp lên Giám đốc khối.'
    }

    updateBookingTicketStatus(ticket.id, nextStatus, actionNote, currentFloor.director)
    showToast(`Đã phê duyệt hồ sơ ${ticket.code} (${ticket.customerName}) thành công!`)
    if (selectedTicket?.id === ticket.id) {
      setSelectedTicket(null)
    }
  }

  const handleOpenReject = (ticketId: string) => {
    setRejectTicketId(ticketId)
  }

  const handleConfirmReject = () => {
    if (!rejectTicketId) return
    rejectBookingTicket(rejectTicketId, rejectReason, currentFloor.director)
    showToast(`Đã từ chối hồ sơ ${rejectTicketId}. Lý do: ${rejectReason}`)
    setRejectTicketId(null)
    if (selectedTicket?.id === rejectTicketId) {
      setSelectedTicket(null)
    }
  }

  const handleExtendSLA = (ticketId: string, minutes: number = 30) => {
    extendBookingSLA(ticketId, minutes, 'Trưởng phòng duyệt gia hạn thời gian thu xếp tài chính theo đề xuất của Sale')
    showToast(`Đã gia hạn thêm +${minutes} phút SLA cho hồ sơ ${ticketId}!`)
  }

  const handleSaveQuotaAllocation = () => {
    const teamObj = currentFloor.teams.find(t => t.id === quotaTargetTeam)
    const teamName = teamObj ? teamObj.name : 'Nhóm kinh doanh'
    setIsQuotaModalOpen(false)
    showToast(`Đã phân bổ ${quotaUnitsCount} căn độc quyền và chỉ tiêu ${quotaRevenueTarget} Tỷ cho ${teamName} thành công!`)
  }

  const handleExecuteLeadDispatch = () => {
    setIsLeadDispatchModalOpen(false)
    showToast(`Đã kích hoạt chia 12 Lead nóng theo cơ chế ${leadDispatchMode === 'round_robin' ? 'Xoay Vòng Round-Robin' : 'Năng Lực'} cho ${selectedAgentsForLead.length} nhân sự!`)
  }

  const handleGrantReward = () => {
    setIsRewardModalOpen(false)
    showToast(`Đã ban hành quyết định khen thưởng nóng tới chiến binh ${rewardAgentName}!`)
  }

  const handleExportCSV = () => {
    // Generate CSV data with UTF-8 BOM
    const headers = ['Hạng,Chiến Binh,Nhóm,Doanh Số (Tỷ VNĐ),Số Deal,Tỷ Lệ Chốt (%),Hoa Hồng (VNĐ),Đạt KPI (%)']
    const rows = AGENT_LEADERBOARD_DATA.map(a => 
      `${a.rank},"${a.name}","${a.team}",${(a.revenue / 1000000000).toFixed(1)},${a.deals},${a.conversionRate}%,"${a.commission.toLocaleString('vi-VN')} VNĐ",${a.targetPercent}%`
    )
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Bao_Cao_Doanh_So_${selectedFloorId}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất file báo cáo hiệu suất sàn (CSV) thành công!')
  }

  // Format currency helpers
  const formatBillion = (num: number) => {
    return (num / 1000000000).toFixed(1) + ' Tỷ'
  }

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2 pb-16">
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="h-8 w-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION WITH CONTEXT SWITCHER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-3 py-1 font-semibold text-xs tracking-wider uppercase">
              <ShieldCheck className="h-3.5 w-3.5 mr-1 text-indigo-400 inline" /> Trung Tâm Điều Hành Sàn
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-700 bg-slate-800/40 text-xs">
              <Users className="h-3 w-3 mr-1 inline text-blue-400" /> {currentFloor.staffCount} Nhân sự kinh doanh
            </Badge>
            <Badge variant="outline" className="text-emerald-300 border-emerald-500/30 bg-emerald-500/10 text-xs">
              <Activity className="h-3 w-3 mr-1 inline text-emerald-400" /> Live Synchronized
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Bàn Quản Lý Trưởng Phòng & Giám Đốc Sàn
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            {currentFloor.name} • {currentFloor.address} • Phụ trách: <span className="text-amber-400 font-semibold">{currentFloor.director}</span>
          </p>
        </div>

        {/* CONTROLS & ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Floor Switcher */}
          <div className="w-[230px]">
            <Select 
              value={selectedFloorId} 
              onValueChange={(val) => setSelectedFloorId(val || 'floor-q1')}
            >
              <SelectTrigger className="bg-slate-800/90 border-slate-700 text-white text-xs h-9 font-medium">
                <Building2 className="h-3.5 w-3.5 mr-1.5 text-indigo-400 shrink-0" />
                <SelectValue placeholder="Chọn Sàn Giao Dịch" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="floor-q1">Sàn Hội Sở Q1 (Novaland Gallery)</SelectItem>
                <SelectItem value="floor-thuduc">Sàn Thủ Đức (Masterise Hub)</SelectItem>
                <SelectItem value="floor-dongnai">Sàn Aqua City Đồng Nai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Timeframe Filter */}
          <div className="w-[140px]">
            <Select 
              value={selectedPeriod} 
              onValueChange={(val) => setSelectedPeriod(val || 'month')}
            >
              <SelectTrigger className="bg-slate-800/90 border-slate-700 text-white text-xs h-9 font-medium">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-400 shrink-0" />
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="month">Tháng 7/2026</SelectItem>
                <SelectItem value="quarter">Quý 3/2026</SelectItem>
                <SelectItem value="year">Năm 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Modals */}
          <Button 
            onClick={() => setIsQuotaModalOpen(true)}
            size="sm" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-9 shadow-md"
          >
            <Layers className="h-3.5 w-3.5 mr-1.5" /> Phân Bổ Quota
          </Button>

          <Button 
            onClick={() => setIsLeadDispatchModalOpen(true)}
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold h-9 shadow-md"
          >
            <Share2 className="h-3.5 w-3.5 mr-1.5" /> Chia Lead Nóng
          </Button>

          <Button 
            onClick={handleExportCSV}
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs h-9"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* 5 TOP STRATEGIC KPI CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1: Doanh Thu Toàn Sàn */}
        <Card className="shadow-sm border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Doanh Số Sàn Thực Đạt
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {formatBillion(currentFloor.actualRevenue)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Chỉ tiêu: {formatBillion(currentFloor.targetRevenue)}</span>
                <span className="font-bold text-blue-700">
                  {((currentFloor.actualRevenue / currentFloor.targetRevenue) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={(currentFloor.actualRevenue / currentFloor.targetRevenue) * 100} 
                className="h-2 bg-blue-100" 
              />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              <ArrowUpRight className="h-3 w-3 mr-0.5 text-emerald-600 shrink-0" />
              +14.2% so với cùng kỳ tháng trước
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Deals & Tỷ Lệ Chốt */}
        <Card className="shadow-sm border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Deals Cọc & Tỷ Lệ Chốt
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {currentFloor.dealsCount} <span className="text-sm font-normal text-slate-600">giao dịch</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Tỷ lệ chốt Lead-to-Deal:</span>
                <span className="font-bold text-indigo-700">21.4%</span>
              </div>
              <Progress value={21.4 * 3} className="h-2 bg-indigo-100" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              <ArrowUpRight className="h-3 w-3 mr-0.5 text-emerald-600 shrink-0" />
              Vượt 3.2% so với benchmark toàn cty
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Giỏ Hàng Đang Booking / Khóa Giữ Căn */}
        <Card className="shadow-sm border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Giỏ Hàng Giữ Chỗ / Khóa
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Flame className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {totalLockedInventory} <span className="text-sm font-normal text-slate-600">căn</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Giá trị giữ chỗ tạm tính:</span>
                <span className="font-bold text-amber-800">{formatBillion(totalBookingValue)}</span>
              </div>
              <Progress value={65} className="h-2 bg-amber-100" />
            </div>
            <p className="text-[11px] text-slate-600 pt-0.5 flex items-center">
              <Clock className="h-3 w-3 mr-1 text-amber-600 inline" />
              SLA giữ chỗ trung bình: 60 - 120 phút
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Hoa Hồng & Quỹ Thưởng Sàn */}
        <Card className="shadow-sm border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Tổng Hoa Hồng Phân Bổ
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Award className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {formatBillion(currentFloor.actualRevenue * 0.03)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Quỹ thưởng nóng tích lũy:</span>
                <span className="font-bold text-emerald-700">240 Triệu</span>
              </div>
              <Progress value={85} className="h-2 bg-emerald-100" />
            </div>
            <p className="text-[11px] text-slate-600 pt-0.5 flex items-center justify-between">
              <span>Trích 3% Net doanh số</span>
              <button 
                onClick={() => setIsRewardModalOpen(true)}
                className="text-emerald-700 font-bold hover:underline flex items-center"
              >
                <Gift className="h-3 w-3 mr-0.5" /> Thưởng nóng
              </button>
            </p>
          </CardContent>
        </Card>

        {/* KPI 5: Hồ Sơ Chờ Phê Duyệt Cấp Quản Lý */}
        <Card className="shadow-sm border-rose-200/80 bg-gradient-to-br from-rose-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Hồ Sơ Chờ Duyệt (Pending)
            </CardTitle>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-800">
              <AlertCircle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-rose-700 flex items-center gap-2">
              {pendingApprovals.length} <span className="text-sm font-normal text-slate-600">yêu cầu</span>
              {pendingApprovals.length > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hồ sơ SLA khẩn cấp:</span>
                <span className="font-bold text-rose-600">
                  {pendingApprovals.filter(t => t.priority === 'urgent').length} hồ sơ
                </span>
              </div>
              <Progress value={pendingApprovals.length * 20} className="h-2 bg-rose-100" />
            </div>
            <p className="text-[11px] text-rose-700 font-medium pt-0.5">
              Thời gian duyệt TB: ~8.5 phút
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS SECTION: TEAM COMPARISON & PROJECT STRUCTURE */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        {/* TEAM PERFORMANCE COMPARISON CHART (5 Cols) */}
        <Card className="lg:col-span-4 shadow-sm border-slate-200">
          <CardHeader className="pb-3 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-600" />
                  Hiệu Suất Thực Đạt vs Chỉ Tiêu 4 Đội Kinh Doanh
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  So sánh doanh thu bán hàng thực tế so với quota được giao (Đơn vị: Tỷ VNĐ)
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-semibold bg-indigo-50 text-indigo-700 border-indigo-200 self-start sm:self-auto">
                {currentFloor.name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={currentFloor.teams.map(t => ({
                    name: t.name.replace('Team ', ''),
                    target: t.target / 1000000000,
                    actual: t.actual / 1000000000,
                    deals: t.deals,
                    rate: t.conversionRate
                  }))}
                  margin={{ top: 20, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" T" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    formatter={(value: any, name: any) => [
                      `${Number(value).toFixed(1)} Tỷ VNĐ`,
                      name === 'actual' ? 'Doanh Thu Thực Thu' : 'Chỉ Tiêu Quota'
                    ]}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} 
                    formatter={(val) => val === 'actual' ? 'Doanh Thu Thực Thu' : 'Chỉ Tiêu Giao'}
                  />
                  <Bar dataKey="target" fill="#cbd5e1" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="actual" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Team Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t">
              {currentFloor.teams.map((team) => {
                const percent = ((team.actual / team.target) * 100).toFixed(0)
                const isOver = team.actual >= team.target
                return (
                  <div key={team.id} className="p-2.5 rounded-lg border bg-slate-50/50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate" title={team.name}>
                        {team.name}
                      </span>
                      <Badge className={`text-[10px] px-1.5 py-0 ${isOver ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-200 text-slate-700'}`}>
                        {percent}%
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 flex items-center justify-between">
                      <span>Đạt: <b className="text-slate-900">{formatBillion(team.actual)}</b></span>
                      <span>{team.deals} deal</span>
                    </div>
                    <Progress value={Math.min(100, Number(percent))} className="h-1.5 bg-slate-200" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* PROJECT REVENUE CONTRIBUTION PIE (3 Cols) */}
        <Card className="lg:col-span-3 shadow-sm border-slate-200 flex flex-col">
          <CardHeader className="pb-2 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-emerald-600" />
                  Cơ Cấu Doanh Thu Dự Án
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Tỷ trọng đóng góp doanh số theo dự án mở bán
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs text-emerald-700 border-emerald-200 bg-emerald-50">
                Top 4 Dự Án
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-between pt-4">
            <div className="h-[210px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={PROJECT_CONTRIBUTION} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={55} 
                    outerRadius={80} 
                    paddingAngle={3} 
                    dataKey="value"
                  >
                    {PROJECT_CONTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                    formatter={(value: any) => [`${value}%`, 'Tỷ trọng']} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
              {PROJECT_CONTRIBUTION.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2 truncate">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-slate-700 font-medium truncate" title={item.name}>{item.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900">{item.value}%</span>
                    <span className="text-[10px] text-slate-500 block">({item.amount})</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QUICK APPROVAL QUEUE WIDGET (HOT OPERATIONAL DESK) */}
      <Card className="shadow-md border-amber-200/90 bg-gradient-to-b from-amber-50/20 via-white to-white">
        <CardHeader className="border-b bg-amber-50/40 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-amber-500 text-white font-bold text-xs uppercase px-2 py-0.5">
                  Cần Xử Lý Ngay
                </Badge>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-600" />
                  Hộp Phê Duyệt Nhanh Cấp Quản Lý (Manager Approval Desk)
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-slate-600 mt-1">
                Thẩm định giữ căn độc quyền, duyệt đề xuất chiết khấu ngoại giao (+1% - 3%) và gia hạn thời gian thanh toán SLA.
              </CardDescription>
            </div>

            {/* Approval Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-amber-200">
              <Button 
                onClick={() => setApprovalFilter('all')} 
                variant={approvalFilter === 'all' ? 'default' : 'ghost'}
                size="sm"
                className={`text-xs h-7 ${approvalFilter === 'all' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'text-slate-600'}`}
              >
                Tất cả ({bookingTickets.filter(t => t.status === 'manager' || t.status === 'director' || t.priority === 'urgent').length})
              </Button>
              <Button 
                onClick={() => setApprovalFilter('manager')} 
                variant={approvalFilter === 'manager' ? 'default' : 'ghost'}
                size="sm"
                className={`text-xs h-7 ${approvalFilter === 'manager' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'text-slate-600'}`}
              >
                Chờ Quản Lý ({bookingTickets.filter(t => t.status === 'manager').length})
              </Button>
              <Button 
                onClick={() => setApprovalFilter('director')} 
                variant={approvalFilter === 'director' ? 'default' : 'ghost'}
                size="sm"
                className={`text-xs h-7 ${approvalFilter === 'director' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'text-slate-600'}`}
              >
                Chờ GĐ Khối ({bookingTickets.filter(t => t.status === 'director').length})
              </Button>
              <Button 
                onClick={() => setApprovalFilter('urgent')} 
                variant={approvalFilter === 'urgent' ? 'default' : 'ghost'}
                size="sm"
                className={`text-xs h-7 ${approvalFilter === 'urgent' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'text-slate-600'}`}
              >
                Gấp SLA 🔥
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {pendingApprovals.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
              <div className="font-semibold text-slate-700 text-sm">Tuyệt vời! Không còn hồ sơ tồn đọng nào cần phê duyệt</div>
              <p className="text-xs text-slate-400">Tất cả yêu cầu giữ chỗ và chiết khấu đã được thẩm định đúng hạn SLA.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingApprovals.map((ticket) => {
                const isUrgent = ticket.priority === 'urgent' || (ticket.remainingMinutes !== undefined && ticket.remainingMinutes < 30)
                return (
                  <div 
                    key={ticket.id} 
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Ticket Primary Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-slate-900 text-white font-mono text-xs px-2 py-0.5">
                          {ticket.code}
                        </Badge>
                        <Badge className={`text-xs font-semibold ${
                          ticket.status === 'manager' 
                            ? 'bg-blue-100 text-blue-800 border-blue-200' 
                            : ticket.status === 'director'
                            ? 'bg-purple-100 text-purple-800 border-purple-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {ticket.status === 'manager' ? 'Trình Cấp Quản Lý' : ticket.status === 'director' ? 'Trình GĐ Khối' : 'Chờ Kế Toán'}
                        </Badge>
                        <Badge variant="outline" className="text-slate-600 bg-white border-slate-200 text-xs">
                          {ticket.projectName} • Căn <b className="text-slate-900 ml-1">{ticket.unitCode}</b>
                        </Badge>
                        {isUrgent && (
                          <Badge className="bg-rose-500 text-white font-bold text-[10px] animate-pulse">
                            Hạn SLA: {ticket.expiresAt}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-800">
                        <span className="font-bold text-slate-900">{ticket.customerName}</span>
                        <span className="text-slate-500 text-xs flex items-center">
                          <Phone className="h-3 w-3 mr-1" /> {ticket.customerPhone}
                        </span>
                        <span className="text-slate-700 text-xs">
                          Giá niêm yết: <b className="text-slate-900">{formatBillion(ticket.price)}</b>
                        </span>
                        <span className="text-slate-700 text-xs">
                          Tiền cọc: <b className="text-emerald-700">{formatBillion(ticket.depositAmount)}</b>
                        </span>
                        <span className="text-slate-500 text-xs">
                          Sale phụ trách: <b className="text-indigo-600">{ticket.agent}</b>
                        </span>
                      </div>

                      {/* Request reason / Notes */}
                      {ticket.notes && (
                        <div className="text-xs text-amber-800 bg-amber-50/80 border border-amber-200/60 rounded-md p-2 max-w-3xl flex items-start gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span><b className="font-semibold">Nội dung đề xuất:</b> {ticket.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <Button 
                        onClick={() => setSelectedTicket(ticket)}
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8 text-slate-700 border-slate-300 hover:bg-slate-100"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> Chi Tiết
                      </Button>

                      <Button 
                        onClick={() => handleExtendSLA(ticket.id, 30)}
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8 text-amber-700 border-amber-300 hover:bg-amber-50"
                        title="Gia hạn thêm 30 phút giữ căn"
                      >
                        <Clock className="h-3.5 w-3.5 mr-1" /> +30p SLA
                      </Button>

                      <Button 
                        onClick={() => handleOpenReject(ticket.id)}
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8 text-rose-700 border-rose-300 hover:bg-rose-50"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" /> Từ Chối
                      </Button>

                      <Button 
                        onClick={() => handleApproveTicket(ticket)}
                        size="sm" 
                        className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                      >
                        <Check className="h-3.5 w-3.5 mr-1 stroke-[3]" /> 
                        {ticket.status === 'director' ? 'Phê Duyệt Lệnh Khóa Căn' : 'Duyệt Chuyển Tiếp GĐ'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="p-3 bg-slate-50/70 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <span>Hệ thống tự động kích hoạt hủy lệnh giữ căn khi quá hạn SLA mà không có phê duyệt gia hạn.</span>
          <Link href="/booking" className="text-indigo-600 font-bold hover:underline flex items-center">
            Mở Kanban Giữ Chỗ & Đặt Cọc Toàn Bộ <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </Link>
        </CardFooter>
      </Card>

      {/* LEADERBOARD & PERFORMANCE TABLE */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="border-b pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                Bảng Xếp Hạng Thi Đua & Hiệu Suất Chiến Binh
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Dữ liệu thời gian thực được tổng hợp dựa trên hợp đồng cọc và HĐMB có hiệu lực trong tháng
              </CardDescription>
            </div>

            {/* Leaderboard Tabs Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <Button 
                onClick={() => setLeaderboardTab('agents')} 
                variant={leaderboardTab === 'agents' ? 'default' : 'ghost'}
                size="sm"
                className={`text-xs h-7 font-semibold ${leaderboardTab === 'agents' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              >
                <Users className="h-3.5 w-3.5 mr-1 text-indigo-600" /> Chiến Binh Xuất Sắc
              </Button>
              <Button 
                onClick={() => setLeaderboardTab('teams')} 
                variant={leaderboardTab === 'teams' ? 'default' : 'ghost'}
                size="sm"
                className={`text-xs h-7 font-semibold ${leaderboardTab === 'teams' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
              >
                <Building2 className="h-3.5 w-3.5 mr-1 text-amber-600" /> Bảng Thi Đua 4 Nhóm
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {leaderboardTab === 'agents' ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="w-16 text-center text-xs font-bold text-slate-700">Hạng</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Chiến Binh (Sales Agent)</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Đội Nhóm</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Doanh Số Thực Đạt</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 text-center">Số Deal</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Tỷ Lệ Chốt</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Hoa Hồng Tích Lũy</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">% KPI</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 text-right">Tác Nghiệp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {AGENT_LEADERBOARD_DATA.map((agent) => (
                    <TableRow key={agent.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Rank Icon */}
                      <TableCell className="text-center font-bold">
                        {agent.rank === 1 ? (
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 text-amber-700 text-sm font-black border border-amber-300 shadow-xs">
                            👑 1
                          </span>
                        ) : agent.rank === 2 ? (
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-slate-200 text-slate-700 text-sm font-black border border-slate-300">
                            🥈 2
                          </span>
                        ) : agent.rank === 3 ? (
                          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-50 text-amber-800 text-sm font-black border border-amber-200">
                            🥉 3
                          </span>
                        ) : (
                          <span className="text-slate-500 font-bold text-sm">{agent.rank}</span>
                        )}
                      </TableCell>

                      {/* Agent Info */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-indigo-100 shadow-xs">
                            <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">
                              {agent.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              {agent.name}
                              {agent.rank <= 3 && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] px-1 py-0">
                                  {agent.badgeTitle}
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">ID: {agent.id}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Team */}
                      <TableCell className="text-xs text-slate-700 font-medium">
                        {agent.team}
                      </TableCell>

                      {/* Revenue */}
                      <TableCell>
                        <Badge className="bg-indigo-50 text-indigo-800 border-indigo-200 font-mono font-bold text-xs">
                          {formatBillion(agent.revenue)}
                        </Badge>
                      </TableCell>

                      {/* Deals */}
                      <TableCell className="text-center font-bold text-slate-800 text-xs">
                        {agent.deals} căn
                      </TableCell>

                      {/* Conversion Rate */}
                      <TableCell>
                        <div className="space-y-1">
                          <span className="text-xs font-semibold text-slate-800">{agent.conversionRate}%</span>
                          <Progress value={agent.conversionRate * 3} className="h-1.5 w-16 bg-slate-100" />
                        </div>
                      </TableCell>

                      {/* Commission */}
                      <TableCell className="font-mono text-xs font-bold text-emerald-700">
                        {agent.commission.toLocaleString('vi-VN')} đ
                      </TableCell>

                      {/* KPI Percentage */}
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Badge className={`text-xs font-bold ${
                            agent.targetPercent >= 100 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {agent.targetPercent}%
                          </Badge>
                          {agent.trend === 'up' ? (
                            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5 text-rose-500" />
                          )}
                        </div>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            onClick={() => {
                              setRewardAgentName(agent.name)
                              setIsRewardModalOpen(true)
                            }}
                            size="sm" 
                            variant="ghost" 
                            className="text-xs h-7 text-amber-700 hover:bg-amber-50 px-2"
                            title="Khen thưởng nóng"
                          >
                            <Gift className="h-3.5 w-3.5 mr-1" /> Thưởng
                          </Button>
                          <Link href="/agent">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-7 text-indigo-700 border-indigo-200 hover:bg-indigo-50 px-2"
                            >
                              Giao Lead
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead className="text-xs font-bold text-slate-700">Nhóm Kinh Doanh</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Trưởng Nhóm</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 text-center">Quân Số</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Chỉ Tiêu Quota</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Thực Đạt</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 text-center">Số Deal</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Tỷ Lệ Hoàn Thành</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700">Tổng Hoa Hồng Đội</TableHead>
                    <TableHead className="text-xs font-bold text-slate-700 text-right">Thao Tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentFloor.teams.map((team, idx) => {
                    const percent = ((team.actual / team.target) * 100).toFixed(1)
                    return (
                      <TableRow key={team.id} className="hover:bg-slate-50/70 transition-colors">
                        <TableCell>
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                            {team.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-slate-800 text-white text-[10px]">
                                {team.leaderAvatar}
                              </AvatarFallback>
                            </Avatar>
                            {team.leader}
                          </div>
                        </TableCell>
                        <TableCell className="text-center font-medium text-xs text-slate-700">
                          {team.membersCount} nhân sự
                        </TableCell>
                        <TableCell className="font-mono text-xs text-slate-600">
                          {formatBillion(team.target)}
                        </TableCell>
                        <TableCell className="font-mono text-xs font-bold text-indigo-700">
                          {formatBillion(team.actual)}
                        </TableCell>
                        <TableCell className="text-center font-bold text-xs text-slate-800">
                          {team.deals} deal
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-slate-900">{percent}%</span>
                              <Badge className={`text-[10px] px-1 py-0 ${
                                Number(percent) >= 100 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : Number(percent) >= 80
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {Number(percent) >= 100 ? 'Vượt Quota' : Number(percent) >= 80 ? 'Tiến Độ Tốt' : 'Cần Đẩy Mạnh'}
                              </Badge>
                            </div>
                            <Progress value={Math.min(100, Number(percent))} className="h-1.5 bg-slate-100" />
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs font-semibold text-emerald-700">
                          {formatBillion(team.commission)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            onClick={() => {
                              setQuotaTargetTeam(team.id)
                              setIsQuotaModalOpen(true)
                            }}
                            size="sm" 
                            variant="outline" 
                            className="text-xs h-7 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                          >
                            Giao Rổ Hàng
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-3 bg-slate-50/70 border-t flex items-center justify-between text-xs text-slate-500">
          <span>Chiến binh xếp hạng Top 1 tháng được thưởng nóng 5 triệu đồng và quyền ưu tiên tiếp cận khách VIP mới.</span>
          <Button 
            onClick={handleExportCSV}
            variant="ghost" 
            size="sm" 
            className="text-xs text-slate-700 hover:text-indigo-600 font-semibold"
          >
            <Download className="h-3.5 w-3.5 mr-1" /> Tải bảng điểm danh thi đua (.CSV)
          </Button>
        </CardFooter>
      </Card>

      {/* MODAL 1: PHÂN BỔ QUOTA & RỔ HÀNG ĐỘC QUYỀN */}
      <Dialog open={isQuotaModalOpen} onOpenChange={setIsQuotaModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-950 text-lg font-bold">
              <Layers className="h-5 w-5 text-indigo-600" />
              Phân Bổ Quota Doanh Thu & Rổ Hàng Ngoại Giao
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Chỉ định rổ hàng căn hoa hậu độc quyền và giao chỉ tiêu doanh số tuần/tháng cho từng nhóm kinh doanh.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Đội Nhóm Tiếp Nhận Quota</label>
              <Select value={quotaTargetTeam} onValueChange={(val) => setQuotaTargetTeam(val || 'team-diamond')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn nhóm kinh doanh" />
                </SelectTrigger>
                <SelectContent>
                  {currentFloor.teams.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name} (TP: {t.leader})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Dự Án Trọng Điểm</label>
                <Select value={quotaProject} onValueChange={(val) => setQuotaProject(val || 'p5')}>
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Số Căn Khóa Độc Quyền</label>
                <Input 
                  type="number"
                  value={quotaUnitsCount}
                  onChange={(e) => setQuotaUnitsCount(e.target.value)}
                  className="text-xs h-9"
                  placeholder="Ví dụ: 5 căn"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Chỉ Tiêu Doanh Số Phân Bổ (Tỷ VNĐ)</label>
              <div className="relative">
                <Input 
                  type="number"
                  value={quotaRevenueTarget}
                  onChange={(e) => setQuotaRevenueTarget(e.target.value)}
                  className="text-xs h-9 pr-12 font-bold font-mono"
                  placeholder="50"
                />
                <span className="absolute right-3 top-2 text-xs font-bold text-slate-400">Tỷ VNĐ</span>
              </div>
              <p className="text-[11px] text-slate-500">Thời hạn cam kết hấp thụ rổ hàng: 14 ngày kể từ ngày ban hành quyết định.</p>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Lưu ý điều phối rổ hàng:
              </div>
              <p className="text-[11px] text-amber-800">
                Các căn độc quyền nếu không phát sinh booking sau 7 ngày sẽ tự động hoàn trả về Rổ Hàng Chung toàn hệ thống.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsQuotaModalOpen(false)} className="text-xs">
              Hủy Bỏ
            </Button>
            <Button size="sm" onClick={handleSaveQuotaAllocation} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
              <Check className="h-3.5 w-3.5 mr-1" /> Xác Nhận Phân Bổ Quota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ĐIỀU PHỐI CHIA LEAD NÓNG ROUND-ROBIN */}
      <Dialog open={isLeadDispatchModalOpen} onOpenChange={setIsLeadDispatchModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-950 text-lg font-bold">
              <Share2 className="h-5 w-5 text-emerald-600" />
              Điều Phối Chia Lead Nóng Tự Động (Round-Robin)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Chia đều 12 khách hàng tiềm năng vừa đăng ký từ các kênh quảng cáo số cho nhân sự đang trực sàn.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Thuật Toán Phân Bổ</label>
              <Select value={leadDispatchMode} onValueChange={(val) => setLeadDispatchMode(val || 'round_robin')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn thuật toán chia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round_robin">Xoay Vòng Đều Đặn (Round-Robin công bằng)</SelectItem>
                  <SelectItem value="skill_performance">Ưu Tiên Chiến Binh Tỷ Lệ Chốt Cao (Top Performer)</SelectItem>
                  <SelectItem value="segment_match">Phân Bổ Theo Phân Khúc Giá Trị Bất Động Sản</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center justify-between">
                <span>Rổ Lead Nóng Sẵn Sàng: 12 Khách Hàng</span>
                <Badge className="bg-emerald-600 text-white text-[10px]">100% SĐT Hợp Lệ</Badge>
              </div>
              <p className="text-[11px] text-emerald-800">
                Bao gồm: 5 Lead đăng ký Aqua City, 4 Lead The Global City, 3 Lead Biệt Thự Biển Phan Thiết.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Nhân Sự Trực Sàn Tiếp Nhận Lead ({selectedAgentsForLead.length} người)
              </label>
              <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 border rounded-lg max-h-[140px] overflow-y-auto text-xs">
                {['Lê Hoàng Anh', 'Thanh Hà', 'Tuấn Tú', 'Nguyễn Mai', 'Minh Anh', 'Đặng Tuấn Kiệt'].map((agentName) => {
                  const isChecked = selectedAgentsForLead.includes(agentName)
                  return (
                    <label 
                      key={agentName} 
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-100 cursor-pointer"
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAgentsForLead([...selectedAgentsForLead, agentName])
                          } else {
                            setSelectedAgentsForLead(selectedAgentsForLead.filter(a => a !== agentName))
                          }
                        }}
                        className="rounded border-slate-300 text-emerald-600"
                      />
                      <span className="font-medium text-slate-800">{agentName}</span>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsLeadDispatchModalOpen(false)} className="text-xs">
              Hủy
            </Button>
            <Button 
              size="sm" 
              onClick={handleExecuteLeadDispatch} 
              disabled={selectedAgentsForLead.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              <Send className="h-3.5 w-3.5 mr-1" /> Kích Hoạt Phân Bổ Ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: KHEN THƯỞNG NÓNG CHIẾN BINH */}
      <Dialog open={isRewardModalOpen} onOpenChange={setIsRewardModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-950 text-lg font-bold">
              <Gift className="h-5 w-5 text-amber-600" />
              Khen Thưởng Nóng & Ghi Nhận Thành Tích Sàn
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Quyết định khen thưởng đột xuất nhằm khích lệ tinh thần các chiến binh có giao dịch đột phá.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Chiến Binh Được Khen Thưởng</label>
              <Select value={rewardAgentName} onValueChange={(val) => setRewardAgentName(val || 'Lê Hoàng Anh')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn chiến binh" />
                </SelectTrigger>
                <SelectContent>
                  {AGENT_LEADERBOARD_DATA.map(a => (
                    <SelectItem key={a.id} value={a.name}>{a.name} ({a.team})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Hình Thức Khen Thưởng</label>
              <Select value={rewardType} onValueChange={(val) => setRewardType(val || 'cash_5m')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash_5m">Thưởng nóng 5.000.000 VNĐ tiền mặt</SelectItem>
                  <SelectItem value="cash_10m">Thưởng nóng 10.000.000 VNĐ tiền mặt (Super Deal)</SelectItem>
                  <SelectItem value="voucher_trip">Voucher Kỳ Nghỉ Dưỡng Novaland 3N2Đ</SelectItem>
                  <SelectItem value="vip_leads">Đặc quyền phân bổ gói 10 Lead VVIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Lời Biểu Dương / Lý Do</label>
              <Input 
                value={rewardNote}
                onChange={(e) => setRewardNote(e.target.value)}
                className="text-xs h-9"
                placeholder="Nhập lý do khen thưởng..."
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsRewardModalOpen(false)} className="text-xs">
              Đóng
            </Button>
            <Button size="sm" onClick={handleGrantReward} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Ban Hành Quyết Định Thưởng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: CHI TIẾT HỒ SƠ PHÊ DUYỆT */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-900 text-white font-mono text-xs">
                  {selectedTicket.code}
                </Badge>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Thẩm Định Chi Tiết Hồ Sơ Giữ Chỗ & Cọc
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs text-slate-600">
                Kiểm tra thông tin pháp lý, chứng từ nộp cọc và lịch sử các bước phê duyệt.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Customer & Unit Details */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div>
                  <span className="text-slate-500 block">Khách hàng:</span>
                  <b className="text-slate-900 text-sm">{selectedTicket.customerName}</b>
                  <span className="text-slate-600 block mt-0.5">{selectedTicket.customerPhone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Căn Bất Động Sản:</span>
                  <b className="text-indigo-700 text-sm">{selectedTicket.unitCode}</b>
                  <span className="text-slate-600 block mt-0.5">{selectedTicket.projectName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Giá niêm yết:</span>
                  <b className="text-slate-900">{formatBillion(selectedTicket.price)}</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Số tiền cọc thực nộp:</span>
                  <b className="text-emerald-700">{formatBillion(selectedTicket.depositAmount)}</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Phương thức thanh toán:</span>
                  <span className="font-semibold text-slate-800">{selectedTicket.paymentMethod || 'Chuyển khoản ngân hàng'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Hạn SLA giữ chỗ:</span>
                  <span className="font-bold text-rose-600">{selectedTicket.expiresAt}</span>
                </div>
              </div>

              {/* Special proposal note */}
              {selectedTicket.notes && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                  <span className="font-bold block mb-1">Nội dung đề xuất thẩm định:</span>
                  <p className="text-slate-700">{selectedTicket.notes}</p>
                </div>
              )}

              {/* Approval History Timeline */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Lịch sử thẩm định các bước:</span>
                <div className="space-y-2 border-l-2 border-indigo-200 ml-2 pl-3">
                  {(selectedTicket.approvalHistory || []).map((h, i) => (
                    <div key={i} className="relative text-xs">
                      <div className="absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full bg-indigo-600"></div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{h.actor}</span>
                        <span className="text-slate-400 text-[11px]">{h.timestamp}</span>
                        <Badge variant="outline" className="text-[10px] py-0">
                          {h.action === 'approved' ? 'Đã duyệt' : h.action === 'created' ? 'Khởi tạo' : 'Yêu cầu'}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mt-0.5">{h.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleOpenReject(selectedTicket.id)}
                className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
              >
                <XCircle className="h-3.5 w-3.5 mr-1" /> Từ Chối
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleApproveTicket(selectedTicket)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Phê Duyệt Hồ Sơ Này
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* REJECT DIALOG MODAL */}
      <Dialog open={!!rejectTicketId} onOpenChange={(open) => !open && setRejectTicketId(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              Từ Chối Phê Duyệt Hồ Sơ
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Vui lòng nêu rõ lý do từ chối để chuyển trả hồ sơ về cho chuyên viên tư vấn hoàn thiện.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Lý do từ chối:</label>
              <Select value={rejectReason} onValueChange={(val) => setRejectReason(val || 'Lý do khác')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn lý do" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hồ sơ tài chính chưa đủ điều kiện cam kết thanh toán">
                    Hồ sơ tài chính chưa đủ điều kiện cam kết thanh toán
                  </SelectItem>
                  <SelectItem value="Vượt quá hạn mức chiết khấu tối đa được phân quyền (+1%)">
                    Vượt quá hạn mức chiết khấu tối đa được phân quyền (+1%)
                  </SelectItem>
                  <SelectItem value="Trùng booking ưu tiên số 1 của khách hàng khác">
                    Trùng booking ưu tiên số 1 của khách hàng khác
                  </SelectItem>
                  <SelectItem value="Thiếu ủy nhiệm chi (UNC) hoặc xác nhận số dư tài khoản">
                    Thiếu ủy nhiệm chi (UNC) hoặc xác nhận số dư tài khoản
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setRejectTicketId(null)} className="text-xs">
              Hủy Bỏ
            </Button>
            <Button 
              size="sm" 
              onClick={handleConfirmReject} 
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              Xác Nhận Từ Chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
