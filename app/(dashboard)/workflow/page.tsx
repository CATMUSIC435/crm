"use client"

import React, { useState, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { 
  Workflow, Play, Zap, MessageSquare, Mail, Bell, 
  Plus, Power, Copy, Trash2, GitMerge, Clock, CheckCircle2,
  ShieldCheck, AlertTriangle, FileText, Check, XCircle, 
  RotateCcw, ArrowRight, UserCheck, ChevronRight, Eye,
  Download, Send, Sparkles, Building2, Flame, Layers, Search
} from 'lucide-react'
import Link from 'next/link'

// Approval Ticket Interface
interface ApprovalTicket {
  id: string
  code: string
  title: string
  category: 'Chiết khấu ngoại giao' | 'Gia hạn thanh toán SLA' | 'Hoàn tiền cọc thiện chí' | 'Đổi căn / Chuyển nhượng' | 'Duyệt rổ hàng VIP'
  customerName: string
  unitCode: string
  projectName: string
  dealValue: number // VNĐ
  requestDiscount?: string
  sender: string
  senderRole: string
  currentLevel: 1 | 2 | 3 | 4 // 1: TPKD, 2: GĐ Sàn, 3: Kế Toán / GĐ Khối, 4: Tổng Giám Đốc
  currentApprover: string
  status: 'pending' | 'approved' | 'returned' | 'rejected'
  submittedAt: string
  expiresAt: string
  remainingMinutes: number
  reason: string
  history: {
    level: number
    role: string
    approver: string
    action: 'approved' | 'rejected' | 'returned' | 'pending'
    timestamp: string
    comment: string
  }[]
}

const INITIAL_APPROVAL_TICKETS: ApprovalTicket[] = [
  {
    id: 'wf-1',
    code: 'WF-901',
    title: 'Xin chiết khấu ngoại giao +2.0% cho khách VVIP mua Shophouse Soho The Global City',
    category: 'Chiết khấu ngoại giao',
    customerName: 'Nguyễn Văn Tuấn',
    unitCode: 'TGC-SH06',
    projectName: 'The Global City',
    dealValue: 36000000000,
    requestDiscount: '+2.0% (720 Triệu ₫)',
    sender: 'Lê Hoàng Anh',
    senderRole: 'Senior Property Advisor',
    currentLevel: 3,
    currentApprover: 'Nguyễn Văn Quản (Giám Đốc Khối)',
    status: 'pending',
    submittedAt: '08:30 20/07',
    expiresAt: 'Còn 15 phút (Khẩn cấp)',
    remainingMinutes: 15,
    reason: 'Khách hàng VVIP đã sở hữu 2 căn Novaland, cam kết thanh toán sớm 95% vốn tự có trong vòng 7 ngày làm việc.',
    history: [
      { level: 1, role: 'Trưởng Phòng KD', approver: 'Trần Khoa', action: 'approved', timestamp: '08:45 20/07', comment: 'Đã thẩm định hồ sơ tài chính khách VVIP, đủ điều kiện đề xuất.' },
      { level: 2, role: 'Giám Đốc Sàn', approver: 'Lê Nam', action: 'approved', timestamp: '09:15 20/07', comment: 'Đồng ý trình GĐ Khối phê duyệt mức chiết khấu vượt thẩm quyền sàn.' },
      { level: 3, role: 'Giám Đốc Khối', approver: 'Nguyễn Văn Quản', action: 'pending', timestamp: 'Đang thẩm định', comment: 'Chờ đối soát biên lai đặt cọc 500 triệu.' }
    ]
  },
  {
    id: 'wf-2',
    code: 'WF-902',
    title: 'Đề xuất gia hạn thêm 48 giờ thanh toán đợt 1 cọc HĐMB biệt thự biển Florida',
    category: 'Gia hạn thanh toán SLA',
    customerName: 'Trần Thị Bích Ngọc',
    unitCode: 'NVW-01.02',
    projectName: 'NovaWorld Phan Thiet',
    dealValue: 18500000000,
    sender: 'Tuấn Tú',
    senderRole: 'Investment Consultant',
    currentLevel: 2,
    currentApprover: 'Trần Khoa (Giám Đốc Sàn)',
    status: 'pending',
    submittedAt: '09:10 20/07',
    expiresAt: 'Còn 45 phút',
    remainingMinutes: 45,
    reason: 'Doanh nghiệp của khách đang chờ nguồn tiền kiều hối từ Singapore về Vietcombank, xin gia hạn để không bị hủy lock căn.',
    history: [
      { level: 1, role: 'Trưởng Phòng KD', approver: 'Lê Nam', action: 'approved', timestamp: '09:30 20/07', comment: 'Xác nhận khách có điện chuyển tiền Swift Code hợp lệ.' },
      { level: 2, role: 'Giám Đốc Sàn', approver: 'Trần Khoa', action: 'pending', timestamp: 'Đang thẩm định', comment: 'Đang kiểm tra rổ hàng ưu tiên.' }
    ]
  },
  {
    id: 'wf-3',
    code: 'WF-903',
    title: 'Thủ tục hoàn trả 100% tiền giữ chỗ thiện chí 100 triệu do khách đổi kế hoạch tài chính',
    category: 'Hoàn tiền cọc thiện chí',
    customerName: 'Đặng Quốc Huy',
    unitCode: 'AQC-12A.01',
    projectName: 'Aqua City',
    dealValue: 12500000000,
    sender: 'Minh Anh',
    senderRole: 'Sales Specialist',
    currentLevel: 3,
    currentApprover: 'Phạm Thị Lan (Kế Toán Trưởng)',
    status: 'pending',
    submittedAt: '10:00 20/07',
    expiresAt: 'Còn 2 giờ',
    remainingMinutes: 120,
    reason: 'Khách hàng có booking ưu tiên số 2 nhưng không khớp căn đợt mở bán, yêu cầu hoàn cọc theo đúng Thỏa Thuận Giữ Chỗ.',
    history: [
      { level: 1, role: 'Trưởng Phòng KD', approver: 'Trần Khoa', action: 'approved', timestamp: '10:15 20/07', comment: 'Đủ điều kiện hoàn cọc theo điều khoản hợp đồng.' },
      { level: 2, role: 'Giám Đốc Sàn', approver: 'Minh Hùng', action: 'approved', timestamp: '10:45 20/07', comment: 'Ký xác nhận không phát sinh khiếu nại.' },
      { level: 3, role: 'Kế Toán Trưởng', approver: 'Phạm Thị Lan', action: 'pending', timestamp: 'Đang thẩm định', comment: 'Chờ Ủy nhiệm chi hoàn tiền qua Techcombank.' }
    ]
  },
  {
    id: 'wf-4',
    code: 'WF-904',
    title: 'Đổi căn từ Căn hộ cao cấp sang Shophouse thương mại phân khu Soho',
    category: 'Đổi căn / Chuyển nhượng',
    customerName: 'Phạm Minh Tuấn',
    unitCode: 'TGC-SH05',
    projectName: 'The Global City',
    dealValue: 35000000000,
    sender: 'Thanh Hà',
    senderRole: 'Luxury Advisor',
    currentLevel: 4,
    currentApprover: 'Bùi Thành Nhơn (Tổng Giám Đốc)',
    status: 'pending',
    submittedAt: '07:30 20/07',
    expiresAt: 'Còn 4 giờ',
    remainingMinutes: 240,
    reason: 'Khách muốn nâng cấp quy mô đầu tư sang trục shophouse để kinh doanh F&B, xin chuyển toàn bộ 3.5 Tỷ tiền cọc cũ sang hợp đồng mới.',
    history: [
      { level: 1, role: 'Trưởng Phòng KD', approver: 'Bảo Trâm', action: 'approved', timestamp: '08:00 20/07', comment: 'Hồ sơ nâng hạng deal hợp lệ.' },
      { level: 2, role: 'Giám Đốc Sàn', approver: 'Trần Khoa', action: 'approved', timestamp: '08:30 20/07', comment: 'Đã khóa căn mới trên hệ thống kho hàng.' },
      { level: 3, role: 'GĐ Khối Tài Chính', approver: 'Nguyễn Văn Quản', action: 'approved', timestamp: '09:00 20/07', comment: 'Đã khấu trừ phí chuyển nhượng 0% cho khách VVIP.' },
      { level: 4, role: 'Tổng Giám Đốc', approver: 'Bùi Thành Nhơn', action: 'pending', timestamp: 'Chờ phê chuẩn', comment: 'Trình Tổng Giám Đốc ban hành lệnh ký HĐMB mới.' }
    ]
  },
  {
    id: 'wf-5',
    code: 'WF-905',
    title: 'Đăng ký rổ hàng ngoại giao 3 căn góc view kênh đào cho đoàn khách VIP Hà Nội',
    category: 'Duyệt rổ hàng VIP',
    customerName: 'Đoàn Nhà Đầu Tư Hà Nội',
    unitCode: 'TGC-SH07, SH08, SH09',
    projectName: 'The Global City',
    dealValue: 110000000000,
    sender: 'Trần Khoa',
    senderRole: 'Giám Đốc Sàn Q1',
    currentLevel: 4,
    currentApprover: 'Bùi Thành Nhơn (Tổng Giám Đốc)',
    status: 'approved',
    submittedAt: '18/07 14:00',
    expiresAt: 'Đã hoàn tất',
    remainingMinutes: 0,
    reason: 'Đoàn 3 nhà đầu tư mua sỉ cùng lúc 3 căn shophouse liền kề để làm chuỗi nhà hàng cao cấp.',
    history: [
      { level: 1, role: 'Trưởng Phòng KD', approver: 'Trần Khoa', action: 'approved', timestamp: '18/07 14:15', comment: 'Đề xuất giỏ hàng ngoại giao.' },
      { level: 2, role: 'Giám Đốc Sàn', approver: 'Trần Khoa', action: 'approved', timestamp: '18/07 14:30', comment: 'Ký duyệt mở rổ hàng.' },
      { level: 3, role: 'GĐ Khối Bán Hàng', approver: 'Nguyễn Văn Quản', action: 'approved', timestamp: '18/07 15:00', comment: 'Đã thẩm tra nguồn vốn cọc 15 Tỷ.' },
      { level: 4, role: 'Tổng Giám Đốc', approver: 'Bùi Thành Nhơn', action: 'approved', timestamp: '18/07 16:30', comment: 'Phê chuẩn phân bổ rổ hàng ngoại giao đặc cách.' }
    ]
  },
  {
    id: 'wf-6',
    code: 'WF-906',
    title: 'Xin chiết khấu đặc cách 3% cho khách hàng sở hữu thẻ Novaland Diamond Pass',
    category: 'Chiết khấu ngoại giao',
    customerName: 'Hoàng Thị Thảo',
    unitCode: 'NVW-02.01',
    projectName: 'NovaWorld Phan Thiet',
    dealValue: 16000000000,
    requestDiscount: '+3.0% (480 Triệu ₫)',
    sender: 'Tuấn Tú',
    senderRole: 'Investment Consultant',
    currentLevel: 2,
    currentApprover: 'Lê Nam (Giám Đốc Sàn)',
    status: 'returned',
    submittedAt: '19/07 09:00',
    expiresAt: 'Yêu cầu bổ sung',
    remainingMinutes: 0,
    reason: 'Khách hàng có thẻ Diamond Pass nhưng chưa nộp ảnh chụp thẻ và số hợp đồng cũ để đối soát.',
    history: [
      { level: 1, role: 'Trưởng Phòng KD', approver: 'Lê Nam', action: 'approved', timestamp: '19/07 09:30', comment: 'Đồng ý tiếp nhận.' },
      { level: 2, role: 'Giám Đốc Sàn', approver: 'Lê Nam', action: 'returned', timestamp: '19/07 10:15', comment: 'Yêu cầu Sale bổ sung bản scan thẻ thành viên Diamond Pass còn hiệu lực.' }
    ]
  }
]

export default function WorkflowPage() {
  const { workflows, toggleWorkflow, runWorkflow, customers, projects } = useStore()
  
  // Tab state
  const [activeMainTab, setActiveMainTab] = useState<'approvals' | 'diagram' | 'automation'>('approvals')
  
  // Ticket list state
  const [tickets, setTickets] = useState<ApprovalTicket[]>(INITIAL_APPROVAL_TICKETS)
  const [selectedTicket, setSelectedTicket] = useState<ApprovalTicket | null>(null)
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Modals state
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<ApprovalTicket['category']>('Chiết khấu ngoại giao')
  const [newCustomer, setNewCustomer] = useState('c1')
  const [newProject, setNewProject] = useState('p5')
  const [newUnitCode, setNewUnitCode] = useState('TGC-SH06')
  const [newDealValue, setNewDealValue] = useState('36000000000')
  const [newRequestDiscount, setNewRequestDiscount] = useState('+1.5%')
  const [newReason, setNewReason] = useState('')

  // Approval action comment
  const [approvalComment, setApprovalComment] = useState('')

  // Automation state
  const [activeWorkflowId, setActiveWorkflowId] = useState<number>(workflows[0]?.id || 1)
  const activeWorkflow = workflows.find(wf => wf.id === activeWorkflowId)

  // Handlers
  const handleApproveTicket = (ticket: ApprovalTicket) => {
    let nextLevel = ticket.currentLevel + 1
    let nextStatus: ApprovalTicket['status'] = 'pending'
    let nextApprover = 'Nguyễn Văn Quản (GĐ Khối)'

    if (ticket.currentLevel === 1) {
      nextApprover = 'Lê Nam (GĐ Sàn)'
    } else if (ticket.currentLevel === 2) {
      nextApprover = 'Phạm Thị Lan (Kế Toán Trưởng)'
    } else if (ticket.currentLevel === 3) {
      nextApprover = 'Bùi Thành Nhơn (Tổng Giám Đốc)'
    } else if (ticket.currentLevel >= 4) {
      nextStatus = 'approved'
      nextLevel = 4
      nextApprover = 'Đã Phê Chuẩn Toàn Cấp'
    }

    const newHistoryItem = {
      level: ticket.currentLevel,
      role: ticket.currentLevel === 1 ? 'Trưởng Phòng KD' : ticket.currentLevel === 2 ? 'Giám Đốc Sàn' : ticket.currentLevel === 3 ? 'Kế Toán / GĐ Khối' : 'Tổng Giám Đốc',
      approver: 'Cấp Quản Lý',
      action: 'approved' as const,
      timestamp: 'Vừa xong',
      comment: approvalComment || 'Đã thẩm tra hồ sơ, đủ điều kiện phê duyệt chuyển cấp tiếp theo.'
    }

    setTickets(prev => prev.map(t => {
      if (t.id !== ticket.id) return t
      return {
        ...t,
        currentLevel: (nextLevel as any),
        status: nextStatus,
        currentApprover: nextApprover,
        history: [...t.history, newHistoryItem]
      }
    }))

    setSelectedTicket(null)
    setApprovalComment('')
    showToast(`Đã phê duyệt hồ sơ ${ticket.code} chuyển lên Cấp ${nextLevel} thành công!`)
  }

  const handleReturnTicket = (ticket: ApprovalTicket) => {
    const newHistoryItem = {
      level: ticket.currentLevel,
      role: 'Cấp Quản Lý',
      approver: ticket.currentApprover,
      action: 'returned' as const,
      timestamp: 'Vừa xong',
      comment: approvalComment || 'Yêu cầu Sale bổ sung thêm chứng từ pháp lý và xác nhận chuyển tiền.'
    }

    setTickets(prev => prev.map(t => {
      if (t.id !== ticket.id) return t
      return {
        ...t,
        status: 'returned',
        history: [...t.history, newHistoryItem]
      }
    }))

    setSelectedTicket(null)
    setApprovalComment('')
    showToast(`Đã trả về hồ sơ ${ticket.code} yêu cầu chuyên viên bổ sung chứng từ!`)
  }

  const handleRejectTicket = (ticket: ApprovalTicket) => {
    const newHistoryItem = {
      level: ticket.currentLevel,
      role: 'Cấp Quản Lý',
      approver: ticket.currentApprover,
      action: 'rejected' as const,
      timestamp: 'Vừa xong',
      comment: approvalComment || 'Không đồng ý phê duyệt do vượt quá thẩm quyền và chính sách giá tập đoàn.'
    }

    setTickets(prev => prev.map(t => {
      if (t.id !== ticket.id) return t
      return {
        ...t,
        status: 'rejected',
        history: [...t.history, newHistoryItem]
      }
    }))

    setSelectedTicket(null)
    setApprovalComment('')
    showToast(`Đã từ chối tờ trình ${ticket.code} theo quy định!`)
  }

  const handleCreateTicket = () => {
    if (!newTitle.trim()) {
      showToast('Vui lòng nhập tiêu đề tờ trình!')
      return
    }

    const customerObj = customers.find(c => c.id === newCustomer)
    const projectObj = projects.find(p => p.id === newProject)

    const newTicket: ApprovalTicket = {
      id: `wf-${tickets.length + 1}`,
      code: `WF-${tickets.length + 901}`,
      title: newTitle,
      category: newCategory,
      customerName: customerObj?.name || 'Khách hàng VIP',
      unitCode: newUnitCode,
      projectName: projectObj?.name || 'The Global City',
      dealValue: Number(newDealValue) || 20000000000,
      requestDiscount: newCategory === 'Chiết khấu ngoại giao' ? newRequestDiscount : undefined,
      sender: 'Lê Hoàng Anh',
      senderRole: 'Senior Property Advisor',
      currentLevel: 1,
      currentApprover: 'Trần Khoa (Trưởng Phòng KD)',
      status: 'pending',
      submittedAt: 'Vừa xong',
      expiresAt: 'Còn 60 phút',
      remainingMinutes: 60,
      reason: newReason || 'Tờ trình xin phê duyệt chính sách bán hàng đặc cách theo quy trình.',
      history: [
        {
          level: 1,
          role: 'Chuyên Viên Kinh Doanh',
          approver: 'Lê Hoàng Anh',
          action: 'pending',
          timestamp: 'Vừa xong',
          comment: 'Khởi tạo tờ trình và chuyển tiếp cấp quản lý.'
        }
      ]
    }

    setTickets([newTicket, ...tickets])
    setIsCreateTicketModalOpen(false)
    setNewTitle('')
    setNewReason('')
    showToast(`Đã tạo thành công phiếu trình duyệt ${newTicket.code}!`)
  }

  const handleExportCSV = () => {
    const headers = ['Mã Phiếu,Tiêu Đề,Loại Quy Trình,Khách Hàng,Căn Hộ,Dự Án,Giá Trị (VNĐ),Cấp Duyệt Hiện Tại,Người Đang Duyệt,Trạng Thái,Thời Gian Gửi']
    const rows = filteredTickets.map(t => 
      `"${t.code}","${t.title}","${t.category}","${t.customerName}","${t.unitCode}","${t.projectName}",${t.dealValue},${t.currentLevel},"${t.currentApprover}","${t.status}","${t.submittedAt}"`
    )
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `So_Theo_Doi_Phe_Duyet_Quy_Trinh_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất Sổ Theo Dõi Phê Duyệt (.CSV) thành công!')
  }

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchCode = t.code.toLowerCase().includes(q)
        const matchTitle = t.title.toLowerCase().includes(q)
        const matchCustomer = t.customerName.toLowerCase().includes(q)
        const matchUnit = t.unitCode.toLowerCase().includes(q)
        if (!matchCode && !matchTitle && !matchCustomer && !matchUnit) return false
      }
      if (filterCategory !== 'all' && t.category !== filterCategory) return false
      if (filterLevel !== 'all' && String(t.currentLevel) !== filterLevel) return false
      if (filterStatus !== 'all' && t.status !== filterStatus) return false
      return true
    })
  }, [tickets, searchQuery, filterCategory, filterLevel, filterStatus])

  // KPIs
  const totalTickets = tickets.length
  const pendingTickets = tickets.filter(t => t.status === 'pending').length
  const urgentTickets = tickets.filter(t => t.status === 'pending' && t.remainingMinutes <= 30).length
  const totalValueBillions = (tickets.reduce((sum, t) => sum + t.dealValue, 0) / 1000000000).toFixed(1)
  const approvedTickets = tickets.filter(t => t.status === 'approved').length
  const approvalRate = totalTickets > 0 ? ((approvedTickets / totalTickets) * 100).toFixed(1) : '0.0'

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2 pb-16">
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="h-8 w-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/30 px-3 py-1 font-semibold text-xs tracking-wider uppercase">
              <Workflow className="h-3.5 w-3.5 mr-1 text-rose-400 inline" /> Quy Trình Phê Duyệt Đa Cấp
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-700 bg-slate-800/40 text-xs">
              <ShieldCheck className="h-3 w-3 mr-1 inline text-emerald-400" /> Chuẩn Hóa 4 Cấp Duyệt
            </Badge>
            <Badge variant="outline" className="text-amber-300 border-amber-500/30 bg-amber-500/10 text-xs">
              <Clock className="h-3 w-3 mr-1 inline text-amber-400" /> SLA Bình Quân: 18.5 Phút
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Quy Trình Phê Duyệt Đa Cấp & Tự Động Hóa
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl">
            Thẩm định chính sách chiết khấu ngoại giao, đổi căn, hoàn tiền cọc thiện chí và gia hạn SLA: Trưởng nhóm ➔ Giám đốc sàn ➔ Kế toán trưởng / GĐ Khối ➔ Tổng Giám Đốc.
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            onClick={() => setIsCreateTicketModalOpen(true)}
            size="sm" 
            className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold h-9 shadow-md"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Tạo Phiếu Trình Duyệt
          </Button>

          <Button 
            onClick={handleExportCSV}
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs h-9"
          >
            <Download className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Xuất Sổ Phê Duyệt (.CSV)
          </Button>
        </div>
      </div>

      {/* 5 OPERATIONAL KPI CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1: Tổng Phiếu */}
        <Card className="shadow-sm border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Tổng Phiếu Trình Tháng
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <FileText className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {totalTickets} <span className="text-sm font-normal text-slate-600">phiếu</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Đã thông qua:</span>
                <span className="font-bold text-blue-700">{approvedTickets} phiếu ({approvalRate}%)</span>
              </div>
              <Progress value={Number(approvalRate)} className="h-2 bg-blue-100" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600 shrink-0" />
              100% tuân thủ quy chế thẩm quyền
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Chờ Phê Duyệt */}
        <Card className="shadow-sm border-amber-200/80 bg-gradient-to-br from-amber-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Đang Chờ Thẩm Định
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-amber-800 flex items-center gap-2">
              {pendingTickets} <span className="text-sm font-normal text-slate-600">hồ sơ</span>
              {urgentTickets > 0 && (
                <Badge className="bg-rose-500 text-white text-[10px] animate-pulse">
                  {urgentTickets} Gấp 🔥
                </Badge>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Thời gian chờ TB:</span>
                <span className="font-bold text-amber-900">18.5 phút</span>
              </div>
              <Progress value={pendingTickets * 20} className="h-2 bg-amber-100" />
            </div>
            <p className="text-[11px] text-slate-600 pt-0.5">
              Hạn SLA cảnh báo: 60 phút
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Giá Trị Bất Động Sản */}
        <Card className="shadow-sm border-purple-200/80 bg-gradient-to-br from-purple-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Giá Trị BĐS Đang Duyệt
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Building2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {totalValueBillions} <span className="text-sm font-normal text-slate-600">Tỷ ₫</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Quy mô giao dịch:</span>
                <span className="font-bold text-purple-700">5 dự án</span>
              </div>
              <Progress value={75} className="h-2 bg-purple-100" />
            </div>
            <p className="text-[11px] text-slate-600 pt-0.5">
              Bao gồm Shophouse & Biệt thự biển
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Tỷ Lệ Thông Qua */}
        <Card className="shadow-sm border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Tỷ Lệ Phê Duyệt
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-emerald-700">
              87.5%
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Số phiếu trả về / từ chối:</span>
                <span className="font-bold text-slate-700">2 phiếu</span>
              </div>
              <Progress value={87.5} className="h-2 bg-emerald-100" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              Hạn chế tối đa rủi ro pháp lý
            </p>
          </CardContent>
        </Card>

        {/* KPI 5: Tự Động Hóa Kịch Bản */}
        <Card className="shadow-sm border-rose-200/80 bg-gradient-to-br from-rose-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Kịch Bản Tự Động Hóa
            </CardTitle>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <Zap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-rose-700">
              {workflows.filter(w => w.active).length} / {workflows.length} <span className="text-sm font-normal text-slate-600">active</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Tổng lượt chạy:</span>
                <span className="font-bold text-rose-800">
                  {workflows.reduce((s, w) => s + w.runs, 0).toLocaleString()} lần
                </span>
              </div>
              <Progress value={80} className="h-2 bg-rose-100" />
            </div>
            <p className="text-[11px] text-slate-600 pt-0.5">
              Zalo ZNS, Email, Ping Sale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3 MAIN TABS */}
      <Tabs value={activeMainTab} onValueChange={(val: any) => setActiveMainTab(val)} className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2">
          <TabsList className="bg-slate-100 p-1 rounded-xl h-10">
            <TabsTrigger value="approvals" className="text-xs font-bold flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-rose-600" /> Sổ Trình Duyệt ({filteredTickets.length})
            </TabsTrigger>
            <TabsTrigger value="diagram" className="text-xs font-bold flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
              <GitMerge className="h-3.5 w-3.5 text-indigo-600" /> Sơ Đồ Luồng 4 Cấp (Visual Diagram)
            </TabsTrigger>
            <TabsTrigger value="automation" className="text-xs font-bold flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
              <Zap className="h-3.5 w-3.5 text-amber-600" /> Kịch Bản Tự Động Hóa (Canvas)
            </TabsTrigger>
          </TabsList>

          <span className="text-xs text-slate-500 font-medium">
            Chuẩn hóa quy chế phân quyền Quyết định số 18/2026/QĐ-HĐQT
          </span>
        </div>

        {/* TAB 1: APPROVAL TICKETS CENTER */}
        <TabsContent value="approvals" className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Tìm theo mã phiếu, khách hàng, căn hộ hoặc tiêu đề..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="w-[180px]">
              <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val || 'all')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Loại quy trình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại quy trình</SelectItem>
                  <SelectItem value="Chiết khấu ngoại giao">Chiết khấu ngoại giao</SelectItem>
                  <SelectItem value="Gia hạn thanh toán SLA">Gia hạn thanh toán SLA</SelectItem>
                  <SelectItem value="Hoàn tiền cọc thiện chí">Hoàn tiền cọc thiện chí</SelectItem>
                  <SelectItem value="Đổi căn / Chuyển nhượng">Đổi căn / Chuyển nhượng</SelectItem>
                  <SelectItem value="Duyệt rổ hàng VIP">Duyệt rổ hàng VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[160px]">
              <Select value={filterLevel} onValueChange={(val) => setFilterLevel(val || 'all')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Cấp duyệt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả cấp duyệt</SelectItem>
                  <SelectItem value="1">Cấp 1: Trưởng Phòng</SelectItem>
                  <SelectItem value="2">Cấp 2: Giám Đốc Sàn</SelectItem>
                  <SelectItem value="3">Cấp 3: Kế Toán / GĐ Khối</SelectItem>
                  <SelectItem value="4">Cấp 4: Tổng Giám Đốc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[150px]">
              <Select value={filterStatus} onValueChange={(val) => setFilterStatus(val || 'all')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="pending">Chờ phê duyệt</SelectItem>
                  <SelectItem value="approved">Đã thông qua</SelectItem>
                  <SelectItem value="returned">Yêu cầu bổ sung</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tickets Table */}
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="w-24 font-bold text-xs text-slate-700">Mã Phiếu</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Tờ Trình / Yêu Cầu</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Khách Hàng / Căn</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Giá Trị BĐS</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Cấp Duyệt Hiện Tại</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Người Đang Giữ Quyền</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Trạng Thái / SLA</TableHead>
                      <TableHead className="text-right font-bold text-xs text-slate-700">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map(ticket => (
                      <TableRow key={ticket.id} className="hover:bg-slate-50/70 transition-colors">
                        <TableCell>
                          <Badge className="bg-slate-900 text-white font-mono text-xs">
                            {ticket.code}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            <span 
                              onClick={() => setSelectedTicket(ticket)}
                              className="font-bold text-xs text-slate-900 cursor-pointer hover:text-rose-600 block line-clamp-2"
                            >
                              {ticket.title}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <Badge variant="outline" className="text-[10px] text-rose-700 bg-rose-50 border-rose-200">
                                {ticket.category}
                              </Badge>
                              {ticket.requestDiscount && (
                                <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">
                                  {ticket.requestDiscount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-xs">
                            <span className="font-bold text-slate-900 block">{ticket.customerName}</span>
                            <span className="text-slate-500">{ticket.projectName} • Căn <b className="text-indigo-700">{ticket.unitCode}</b></span>
                          </div>
                        </TableCell>

                        <TableCell className="font-mono text-xs font-bold text-purple-900">
                          {(ticket.dealValue / 1000000000).toFixed(1)} Tỷ ₫
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-800">Cấp {ticket.currentLevel}/4:</span>
                            <Badge className={`text-[10px] ${
                              ticket.currentLevel === 1 ? 'bg-blue-100 text-blue-800' :
                              ticket.currentLevel === 2 ? 'bg-indigo-100 text-indigo-800' :
                              ticket.currentLevel === 3 ? 'bg-purple-100 text-purple-800' :
                              'bg-rose-100 text-rose-800'
                            }`}>
                              {ticket.currentLevel === 1 ? 'Trưởng Phòng' : ticket.currentLevel === 2 ? 'GĐ Sàn' : ticket.currentLevel === 3 ? 'GĐ Khối' : 'Tổng GĐ'}
                            </Badge>
                          </div>
                        </TableCell>

                        <TableCell className="text-xs font-medium text-slate-700">
                          {ticket.currentApprover}
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1">
                            {ticket.status === 'pending' && (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">
                                Đang chờ thẩm định
                              </Badge>
                            )}
                            {ticket.status === 'approved' && (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">
                                Đã phê chuẩn
                              </Badge>
                            )}
                            {ticket.status === 'returned' && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px]">
                                Yêu cầu bổ sung
                              </Badge>
                            )}
                            {ticket.status === 'rejected' && (
                              <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px]">
                                Bác bỏ
                              </Badge>
                            )}
                            <span className="text-[10px] text-slate-500 block">{ticket.expiresAt}</span>
                          </div>
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              onClick={() => setSelectedTicket(ticket)}
                              size="sm" 
                              variant="outline" 
                              className="text-xs h-7 px-2 text-rose-700 border-rose-200 hover:bg-rose-50"
                            >
                              <Eye className="h-3.5 w-3.5 mr-1" /> Thẩm Định
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: VISUAL 4-LEVEL WORKFLOW DIAGRAM */}
        <TabsContent value="diagram" className="space-y-4">
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="border-b bg-slate-50/70 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GitMerge className="h-4 w-4 text-indigo-600" />
                    Sơ Đồ Luồng Duyệt Chuẩn Hóa 4 Cấp Của Tập Đoàn
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Phân quyền tự động kích hoạt cấp tiếp theo dựa trên hạn mức chiết khấu và giá trị giao dịch
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs text-indigo-700 bg-indigo-50 border-indigo-200">
                  Phân Quyền Ma Trận RACI
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Level 1 Node */}
                <div className="p-4 rounded-xl border-2 border-blue-200 bg-blue-50/30 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-600 text-white text-[10px]">CẤP 1</Badge>
                    <span className="text-[10px] text-slate-500 font-bold">SLA: 30 phút</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Trưởng Phòng Kinh Doanh</h4>
                  <p className="text-xs text-slate-600">Thẩm tra hồ sơ khách hàng, tính xác thực của đề xuất và chứng từ nộp cọc.</p>
                  <div className="text-[11px] text-blue-900 font-semibold bg-white p-2 rounded border border-blue-100">
                    Hạn mức ủy quyền: Chiết khấu &le; 1.0%
                  </div>
                </div>

                {/* Level 2 Node */}
                <div className="p-4 rounded-xl border-2 border-indigo-200 bg-indigo-50/30 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-indigo-600 text-white text-[10px]">CẤP 2</Badge>
                    <span className="text-[10px] text-slate-500 font-bold">SLA: 45 phút</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Giám Đốc Sàn Giao Dịch</h4>
                  <p className="text-xs text-slate-600">Kiểm tra quota giỏ hàng căn độc quyền, cân đối doanh số toàn sàn.</p>
                  <div className="text-[11px] text-indigo-900 font-semibold bg-white p-2 rounded border border-indigo-100">
                    Hạn mức ủy quyền: Chiết khấu &le; 1.5%, Gia hạn SLA &le; 24h
                  </div>
                </div>

                {/* Level 3 Node */}
                <div className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50/30 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-600 text-white text-[10px]">CẤP 3</Badge>
                    <span className="text-[10px] text-slate-500 font-bold">SLA: 60 phút</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Kế Toán Trưởng & GĐ Khối</h4>
                  <p className="text-xs text-slate-600">Kiểm tra dòng tiền, sao kê tài khoản ngân hàng và chính sách tài chính.</p>
                  <div className="text-[11px] text-purple-900 font-semibold bg-white p-2 rounded border border-purple-100">
                    Hạn mức ủy quyền: Chiết khấu &le; 2.5%, Hoàn cọc &le; 500Tr
                  </div>
                </div>

                {/* Level 4 Node */}
                <div className="p-4 rounded-xl border-2 border-rose-300 bg-rose-50/40 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-rose-600 text-white text-[10px]">CẤP 4 (CAO NHẤT)</Badge>
                    <span className="text-[10px] text-slate-500 font-bold">SLA: 120 phút</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">Tổng Giám Đốc / HĐQT</h4>
                  <p className="text-xs text-slate-600">Phê chuẩn ngoại lệ đặc cách, mở giỏ hàng ngoại giao sỉ &gt; 50 Tỷ.</p>
                  <div className="text-[11px] text-rose-900 font-semibold bg-white p-2 rounded border border-rose-100">
                    Quyền hạn tối cao: Phê chuẩn mọi trường hợp ngoại lệ
                  </div>
                </div>
              </div>

              {/* Threshold Rule Alert */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  Quy Tắc Rẽ Nhánh Tự Động (Auto Threshold Routing):
                </div>
                <p className="text-amber-900 leading-relaxed">
                  Nếu giá trị giao dịch <b>&gt; 25 Tỷ VNĐ</b> hoặc đề xuất chiết khấu <b>&gt; 2.0%</b>, hệ thống sẽ tự động bypass các bước trung gian không cần thiết và gửi cảnh báo khẩn cấp trực tiếp lên Cấp 4 (Tổng Giám Đốc).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: TRIGGER & AUTOMATION ENGINE (CANVAS) */}
        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            {/* Left list */}
            <div className="xl:col-span-4 space-y-3">
              <Card className="shadow-sm">
                <CardHeader className="pb-3 border-b bg-slate-50">
                  <CardTitle className="text-sm font-bold">Thư Viện Kịch Bản Tự Động</CardTitle>
                </CardHeader>
                <CardContent className="p-0 divide-y">
                  {workflows.map((wf) => (
                    <div 
                      key={wf.id} 
                      onClick={() => setActiveWorkflowId(wf.id)}
                      className={`p-3.5 transition-colors cursor-pointer border-l-4 ${
                        activeWorkflowId === wf.id ? 'bg-rose-50/50 border-rose-500' : 'hover:bg-slate-50 border-transparent'
                      } ${!wf.active ? 'opacity-60' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <h4 className={`font-bold text-xs ${activeWorkflowId === wf.id ? 'text-rose-700' : 'text-slate-800'}`}>
                          {wf.name}
                        </h4>
                        <div 
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleWorkflow(wf.id)
                          }}
                          className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${
                            wf.active ? 'bg-rose-500 justify-end' : 'bg-slate-300 justify-start'
                          }`}
                        >
                          <div className="w-3 h-3 bg-white rounded-full shadow-xs"></div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Zap className={`h-3 w-3 ${wf.active ? 'text-amber-500' : 'text-slate-400'}`} /> 
                          Đã chạy: {wf.runs.toLocaleString()} lần
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {wf.active ? 'Bật' : 'Tắt'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right Canvas */}
            <div className="xl:col-span-8">
              <Card className="shadow-sm relative overflow-hidden bg-slate-50 p-6 min-h-[450px]">
                <div className="flex items-center justify-between mb-6 pb-3 border-b">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white text-slate-800 border-slate-300 shadow-xs text-xs">
                      Kịch bản: {activeWorkflow?.name}
                    </Badge>
                    <Badge className={`text-xs ${activeWorkflow?.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {activeWorkflow?.active ? 'Đang Hoạt Động' : 'Đã Tạm Dừng'}
                    </Badge>
                  </div>

                  <Button 
                    onClick={() => {
                      if (activeWorkflow) {
                        runWorkflow(activeWorkflow.id)
                        showToast(`Đã kích hoạt chạy thử kịch bản "${activeWorkflow.name}" thành công!`)
                      }
                    }}
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold h-8"
                  >
                    <Play className="h-3.5 w-3.5 mr-1" /> Chạy Thử (Test)
                  </Button>
                </div>

                {/* Nodes representation */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-[280px] bg-white border-2 border-rose-200 rounded-xl shadow-xs p-3 text-xs">
                    <div className="font-bold text-rose-700 uppercase text-[10px] flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3" /> Trigger (Kích Hoạt)
                    </div>
                    <div className="font-bold text-slate-800">
                      {activeWorkflow?.type === 'lead' ? 'Có Lead Mới Bổ Sung' : activeWorkflow?.type === 'marketing' ? 'Đến Ngày Sinh Nhật' : activeWorkflow?.type === 'deal' ? 'Trạng Thái Booking' : 'Đến Hạn Thanh Toán Đợt'}
                    </div>
                  </div>

                  <div className="h-6 w-0.5 bg-slate-300"></div>

                  <div className="w-[280px] bg-white border-2 border-amber-200 rounded-xl shadow-xs p-3 text-xs">
                    <div className="font-bold text-amber-700 uppercase text-[10px] flex items-center gap-1 mb-1">
                      <GitMerge className="h-3 w-3" /> Condition (Điều Kiện)
                    </div>
                    <div className="font-bold text-slate-800">Khách Hàng Hạng VIP / VVIP</div>
                  </div>

                  <div className="h-6 w-0.5 bg-slate-300"></div>

                  <div className="w-[280px] bg-white border-2 border-emerald-200 rounded-xl shadow-xs p-3 text-xs">
                    <div className="font-bold text-emerald-700 uppercase text-[10px] flex items-center gap-1 mb-1">
                      <MessageSquare className="h-3 w-3" /> Action (Hành Động)
                    </div>
                    <div className="font-bold text-slate-800">Bắn Tin Nhắn Zalo ZNS & Ping Sale</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* MODAL 1: TẠO PHIẾU TRÌNH DUYỆT NGOẠI LỆ MỚI */}
      <Dialog open={isCreateTicketModalOpen} onOpenChange={setIsCreateTicketModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-950 text-lg font-bold">
              <Plus className="h-5 w-5 text-rose-600" />
              Lập Phiếu Trình Duyệt Chính Sách Đặc Cách
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Trình cấp quản lý thẩm định mức chiết khấu ngoại giao, hoàn cọc hoặc đổi căn cho khách hàng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tiêu Đề Tờ Trình</label>
              <Input 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Xin chiết khấu ngoại giao +2.0% cho khách VVIP..."
                className="text-xs h-9 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Loại Quy Trình</label>
                <Select value={newCategory} onValueChange={(val) => setNewCategory(val as any)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Chọn loại quy trình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chiết khấu ngoại giao">Chiết khấu ngoại giao</SelectItem>
                    <SelectItem value="Gia hạn thanh toán SLA">Gia hạn thanh toán SLA</SelectItem>
                    <SelectItem value="Hoàn tiền cọc thiện chí">Hoàn tiền cọc thiện chí</SelectItem>
                    <SelectItem value="Đổi căn / Chuyển nhượng">Đổi căn / Chuyển nhượng</SelectItem>
                    <SelectItem value="Duyệt rổ hàng VIP">Duyệt rổ hàng VIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mức Chiết Khấu Đề Xuất</label>
                <Input 
                  value={newRequestDiscount}
                  onChange={(e) => setNewRequestDiscount(e.target.value)}
                  placeholder="+1.5%"
                  className="text-xs h-9 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khách Hàng</label>
                <Select value={newCustomer} onValueChange={(val) => setNewCustomer(val || 'c1')}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Dự Án</label>
                <Select value={newProject} onValueChange={(val) => setNewProject(val || 'p5')}>
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mã Căn Hộ / Shophouse</label>
                <Input 
                  value={newUnitCode}
                  onChange={(e) => setNewUnitCode(e.target.value)}
                  className="text-xs h-9 font-mono font-bold"
                  placeholder="TGC-SH06"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tổng Giá Trị Giao Dịch (VNĐ)</label>
                <Input 
                  value={newDealValue}
                  onChange={(e) => setNewDealValue(e.target.value)}
                  className="text-xs h-9 font-mono font-bold"
                  placeholder="36000000000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Lý Do Đề Xuất & Cam Kết Của Khách Hàng</label>
              <Textarea 
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="Nhập lý do chi tiết (ví dụ: Khách thanh toán 95% vốn tự có trong 7 ngày, khách sở hữu nhiều BĐS...)"
                className="text-xs min-h-[70px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsCreateTicketModalOpen(false)} className="text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleCreateTicket} className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold">
              <Send className="h-3.5 w-3.5 mr-1" /> Chuyển Cấp Quản Lý Thẩm Định
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: THẨM ĐỊNH & PHÊ DUYỆT CHI TIẾT */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-[620px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-900 text-white font-mono text-xs">
                  {selectedTicket.code}
                </Badge>
                <Badge variant="outline" className="text-xs text-rose-700 bg-rose-50 border-rose-200">
                  {selectedTicket.category}
                </Badge>
                <Badge className="bg-amber-100 text-amber-800 text-[10px]">
                  Cấp {selectedTicket.currentLevel}/4: {selectedTicket.currentApprover}
                </Badge>
              </div>
              <DialogTitle className="text-base font-bold text-slate-900 mt-1">
                {selectedTicket.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Primary Data */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div>
                  <span className="text-slate-500 block">Khách hàng:</span>
                  <b className="text-slate-900">{selectedTicket.customerName}</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Bất động sản:</span>
                  <b className="text-indigo-700">{selectedTicket.projectName} • Căn {selectedTicket.unitCode}</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Giá trị giao dịch:</span>
                  <b className="text-purple-900 font-mono">{(selectedTicket.dealValue / 1000000000).toFixed(1)} Tỷ VNĐ</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Chiết khấu xin duyệt:</span>
                  <b className="text-rose-700 font-mono">{selectedTicket.requestDiscount || 'Theo điều khoản'}</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Người lập tờ trình:</span>
                  <span className="font-semibold text-slate-800">{selectedTicket.sender} ({selectedTicket.senderRole})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Hạn SLA phê duyệt:</span>
                  <span className="font-bold text-rose-600">{selectedTicket.expiresAt}</span>
                </div>
              </div>

              {/* Reason */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-950">
                <span className="font-bold block mb-1">Nội dung tờ trình chi tiết:</span>
                <p className="leading-relaxed text-slate-700">{selectedTicket.reason}</p>
              </div>

              {/* Approval History Timeline */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Nhật ký thẩm định các cấp:</span>
                <div className="space-y-2 border-l-2 border-rose-200 ml-2 pl-3">
                  {selectedTicket.history.map((h, i) => (
                    <div key={i} className="relative text-xs">
                      <div className={`absolute -left-[19px] top-1 h-2.5 w-2.5 rounded-full ${
                        h.action === 'approved' ? 'bg-emerald-600' : h.action === 'returned' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">Cấp {h.level}: {h.role} ({h.approver})</span>
                        <span className="text-slate-400 text-[11px]">{h.timestamp}</span>
                        <Badge variant="outline" className="text-[10px] py-0">
                          {h.action === 'approved' ? 'Đã duyệt' : h.action === 'returned' ? 'Trả về' : 'Chờ duyệt'}
                        </Badge>
                      </div>
                      <p className="text-slate-600 mt-0.5">{h.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Input comment */}
              <div className="space-y-1.5 pt-2 border-t">
                <label className="text-xs font-bold text-slate-700">Ý Kiến Phê Duyệt / Nhận Xét Của Cấp Thẩm Quyền:</label>
                <Input 
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="Ghi rõ ý kiến chỉ đạo hoặc yêu cầu bổ sung..."
                  className="text-xs h-9"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleRejectTicket(selectedTicket)}
                className="text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
              >
                <XCircle className="h-3.5 w-3.5 mr-1" /> Từ Chối
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleReturnTicket(selectedTicket)}
                className="text-xs text-amber-700 border-amber-300 hover:bg-amber-50"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Trả Về Bổ Sung
              </Button>
              <Button 
                size="sm" 
                onClick={() => handleApproveTicket(selectedTicket)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Phê Duyệt Thông Qua
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
