"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  KeyRound, ShieldCheck, CheckCircle2, AlertTriangle, Clock, Calendar, 
  Search, Filter, Plus, Download, FileText, Check, X, RefreshCw, 
  Wrench, Building, Home, Users, Smartphone, Phone, Mail, Award,
  Sparkles, FileSignature, ArrowRight, Eye, Trash2, Printer, MapPin,
  ClipboardCheck, Droplets, Zap, Shield, ChevronRight, Lock, Key
} from 'lucide-react'
import { HandoverTicket, SnaggingDefectItem, HandoverStatus, DefectSeverity, DefectStatus, PinkBookStage } from '@/types'

// INITIAL MOCK DATA
const INITIAL_HANDOVERS: HandoverTicket[] = [
  {
    id: 'HO-2026-001',
    contractId: 'HD-928',
    propertyCode: 'NVW-01.01',
    projectId: 'p1',
    projectName: 'NovaWorld Phan Thiet',
    customerId: 'c1',
    customerName: 'Nguyễn Văn Tuấn',
    customerPhone: '0901234567',
    customerEmail: 'tuan.nguyen@investor.vn',
    propertyType: 'Biệt thự biển đơn lập',
    area: 250,
    scheduledDate: '24/07/2026',
    scheduledTime: '09:00 AM',
    assignedEngineer: 'KS. Trần Đình Trọng (Ban QLDA)',
    status: 'da_ban_giao',
    electricMeterIndex: 1240.5,
    waterMeterIndex: 48.2,
    keysHandedOverCount: 6,
    accessCardsCount: 4,
    signedDate: '19/07/2026',
    signedByCustomer: true,
    signedByStaff: true,
    warrantyExpiryDate: '19/07/2031',
    pinkBookStage: 'da_in_phoi_so',
    pinkBookNumber: 'CN-892147/BThuan',
    defectsCount: 0,
    notes: 'Khách hàng rất hài lòng về tiến độ và cảnh quan sân Golf PGA'
  },
  {
    id: 'HO-2026-002',
    contractId: 'HD-927',
    propertyCode: 'AQC-12A.01',
    projectId: 'p2',
    projectName: 'Aqua City',
    customerId: 'c7',
    customerName: 'Vũ Thu Trang',
    customerPhone: '0966554433',
    customerEmail: 'trang.vu@fashionvn.com',
    propertyType: 'Nhà phố đảo Phượng Hoàng',
    area: 160,
    scheduledDate: '25/07/2026',
    scheduledTime: '14:30 PM',
    assignedEngineer: 'KS. Nguyễn Văn Hải (Ban QLDA)',
    status: 'co_loi_can_sua',
    electricMeterIndex: 820.0,
    waterMeterIndex: 26.5,
    keysHandedOverCount: 4,
    accessCardsCount: 3,
    warrantyExpiryDate: '25/07/2028',
    pinkBookStage: 'tham_dinh_thue',
    defectsCount: 2,
    notes: 'Có 2 lỗi nhẹ ở ron gạch ban công và gioăng kính cửa lùa đang được Hòa Bình xử lý'
  },
  {
    id: 'HO-2026-003',
    contractId: 'HD-926',
    propertyCode: 'TGM-18.04',
    projectId: 'p3',
    projectName: 'The Grand Manhattan',
    customerId: 'c4',
    customerName: 'Phạm Minh Tuấn',
    customerPhone: '0912987654',
    customerEmail: 'minhtuan.pham@saigonres.com',
    propertyType: 'Căn hộ hạng sang 3PN',
    area: 115,
    scheduledDate: '26/07/2026',
    scheduledTime: '10:00 AM',
    assignedEngineer: 'KS. Lê Văn Nam (CBRE Property)',
    status: 'dang_nghiem_thu',
    electricMeterIndex: 450.2,
    waterMeterIndex: 14.8,
    keysHandedOverCount: 4,
    accessCardsCount: 4,
    warrantyExpiryDate: '26/07/2028',
    pinkBookStage: 'nop_so_tnmt',
    defectsCount: 1,
    notes: 'Chờ kiểm tra lại áp lực vòi sen tắm đứng phòng Master'
  },
  {
    id: 'HO-2026-004',
    contractId: 'HD-925',
    propertyCode: 'TGC-LK05',
    projectId: 'p5',
    projectName: 'The Global City',
    customerId: 'c2',
    customerName: 'Trần Thị Bích Ngọc',
    customerPhone: '0912345678',
    customerEmail: 'bichngoc.tran@vietcapital.vn',
    propertyType: 'Nhà phố thương mại Shophouse',
    area: 133,
    scheduledDate: '28/07/2026',
    scheduledTime: '08:30 AM',
    assignedEngineer: 'KS. Hoàng Minh Đức (Masterise Quality)',
    status: 'da_dat_lich',
    electricMeterIndex: 210.0,
    waterMeterIndex: 8.0,
    keysHandedOverCount: 8,
    accessCardsCount: 6,
    warrantyExpiryDate: '28/07/2029',
    pinkBookStage: 'tiep_nhan_ho_so',
    defectsCount: 0,
    notes: 'Chủ nhà yêu cầu kiểm tra kỹ hệ thống thang máy kính gia đình'
  },
  {
    id: 'HO-2026-005',
    contractId: 'HD-924',
    propertyCode: 'VGP-S5.02',
    projectId: 'p4',
    projectName: 'Vinhomes Grand Park',
    customerId: 'c5',
    customerName: 'Hoàng Thị Thảo',
    customerPhone: '0945678123',
    customerEmail: 'thaonhi.hoang@gmail.com',
    propertyType: 'Căn hộ cao cấp 2PN',
    area: 68,
    scheduledDate: '30/07/2026',
    scheduledTime: '15:00 PM',
    assignedEngineer: 'KS. Phạm Quốc Huy (Vinhomes Care)',
    status: 'cho_hen',
    electricMeterIndex: 120.0,
    waterMeterIndex: 5.5,
    keysHandedOverCount: 3,
    accessCardsCount: 2,
    warrantyExpiryDate: '30/07/2028',
    pinkBookStage: 'tiep_nhan_ho_so',
    defectsCount: 0,
    notes: 'CSKH đã liên hệ gửi thư mời bàn giao qua Email và bưu điện'
  }
]

const INITIAL_DEFECTS: SnaggingDefectItem[] = [
  {
    id: 'DEF-801',
    handoverId: 'HO-2026-002',
    propertyCode: 'AQC-12A.01',
    location: 'Ban công tầng 2',
    category: 'Xây thô & Sơn bả',
    description: 'Ron gạch lát sàn bị hở 2mm gần phễu thoát sàn, cần dặm lại keo chống thấm',
    severity: 'Nhe',
    contractor: 'Hòa Bình Corp',
    status: 'Dang Xu Ly',
    reportedDate: '19/07/2026',
    targetResolutionDate: '22/07/2026',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'DEF-802',
    handoverId: 'HO-2026-002',
    propertyCode: 'AQC-12A.01',
    location: 'Cửa lùa phòng khách',
    category: 'Cửa & Khóa',
    description: 'Gioăng cao su mép cửa kính bị kẹt nhẹ khi kéo trượt ra sân vườn',
    severity: 'Trung Binh',
    contractor: 'Nhôm Kính Eurowindow / Hòa Bình',
    status: 'Cho Nghiem Thu',
    reportedDate: '19/07/2026',
    targetResolutionDate: '21/07/2026',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'DEF-803',
    handoverId: 'HO-2026-003',
    propertyCode: 'TGM-18.04',
    location: 'Phòng tắm Master',
    category: 'Thiết bị vệ sinh',
    description: 'Áp lực sen tắm đứng âm trần Grohe hơi yếu so với chuẩn kỹ thuật (cần xả bọt e khí van)',
    severity: 'Nhe',
    contractor: 'Coteccons M&E',
    status: 'Dang Xu Ly',
    reportedDate: '19/07/2026',
    targetResolutionDate: '23/07/2026'
  },
  {
    id: 'DEF-804',
    handoverId: 'HO-2026-001',
    propertyCode: 'NVW-01.01',
    location: 'Sơn tường phòng khách',
    category: 'Xây thô & Sơn bả',
    description: 'Vết xước nhỏ 5cm do chuyển sofa mẫu, đã dặm lại sơn Dulux cùng mã màu',
    severity: 'Nhe',
    contractor: 'Ricons',
    status: 'Da Khac Phuc',
    reportedDate: '15/07/2026',
    targetResolutionDate: '17/07/2026',
    resolvedDate: '17/07/2026'
  }
]

export default function PropertyHandoverPage() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'handover_list' | 'snagging' | 'warranty' | 'pink_book'>('handover_list')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Data States
  const [handovers, setHandovers] = useState<HandoverTicket[]>(INITIAL_HANDOVERS)
  const [defects, setDefects] = useState<SnaggingDefectItem[]>(INITIAL_DEFECTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [projectFilter, setProjectFilter] = useState<string>('ALL')

  // Modals States (5 Modals)
  const [showAppointmentModal, setShowAppointmentModal] = useState(false)
  const [showAddDefectModal, setShowAddDefectModal] = useState(false)
  const [selectedHandoverForSign, setSelectedHandoverForSign] = useState<HandoverTicket | null>(null)
  const [selectedPinkBookDetail, setSelectedPinkBookDetail] = useState<HandoverTicket | null>(null)
  const [showKeyHandoverModal, setShowKeyHandoverModal] = useState(false)
  const [selectedHandoverForKeys, setSelectedHandoverForKeys] = useState<HandoverTicket | null>(null)

  // Modal 1 Form: Appointment
  const [appPropertyCode, setAppPropertyCode] = useState('VGP-S5.02')
  const [appCustomerName, setAppCustomerName] = useState('Hoàng Thị Thảo')
  const [appDate, setAppDate] = useState('2026-08-05')
  const [appTime, setAppTime] = useState('09:30')
  const [appEngineer, setAppEngineer] = useState('KS. Nguyễn Văn Hải (Ban QLDA)')
  const [appNotes, setAppNotes] = useState('Khách hàng yêu cầu kiểm tra kỹ điện nước trước khi ký')

  // Modal 2 Form: Snagging Defect
  const [defectProperty, setDefectProperty] = useState('AQC-12A.01')
  const [defectLocation, setDefectLocation] = useState('Phòng ngủ nhỏ tầng 2')
  const [defectCategory, setDefectCategory] = useState<SnaggingDefectItem['category']>('Sàn & Trần')
  const [defectDesc, setDefectDesc] = useState('Len chân tường gỗ công nghiệp An Cường bị hở góc 3mm')
  const [defectSeverity, setDefectSeverity] = useState<DefectSeverity>('Nhe')
  const [defectContractor, setDefectContractor] = useState('Hòa Bình Corp')
  const [defectDaysSLA, setDefectDaysSLA] = useState('3')

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  // Filtered Handovers
  const filteredHandovers = handovers.filter(h => {
    const matchSearch = h.propertyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        h.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        h.customerPhone.includes(searchQuery) ||
                        h.contractId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === 'ALL' || h.status === statusFilter
    const matchProj = projectFilter === 'ALL' || h.projectId === projectFilter
    return matchSearch && matchStatus && matchProj
  })

  // Submit Modal 1: Lập Lịch Hẹn
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    setHandovers(prev => prev.map(h => {
      if (h.propertyCode === appPropertyCode) {
        return {
          ...h,
          scheduledDate: appDate.split('-').reverse().join('/'),
          scheduledTime: appTime,
          assignedEngineer: appEngineer,
          status: 'da_dat_lich' as HandoverStatus,
          notes: appNotes
        }
      }
      return h
    }))
    setShowAppointmentModal(false)
    showToast(`Đã thiết lập lịch hẹn bàn giao thành công cho căn [${appPropertyCode}] vào ngày ${appDate}!`)
  }

  // Submit Modal 2: Báo Lỗi Snagging
  const handleCreateDefect = (e: React.FormEvent) => {
    e.preventDefault()
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + Number(defectDaysSLA))
    
    const newDefect: SnaggingDefectItem = {
      id: `DEF-${Math.floor(100 + Math.random() * 900)}`,
      handoverId: handovers.find(h => h.propertyCode === defectProperty)?.id || 'HO-NEW',
      propertyCode: defectProperty,
      location: defectLocation,
      category: defectCategory,
      description: defectDesc,
      severity: defectSeverity,
      contractor: defectContractor,
      status: 'Dang Xu Ly',
      reportedDate: new Date().toLocaleDateString('vi-VN'),
      targetResolutionDate: targetDate.toLocaleDateString('vi-VN')
    }

    setDefects(prev => [newDefect, ...prev])
    setHandovers(prev => prev.map(h => h.propertyCode === defectProperty ? { ...h, status: 'co_loi_can_sua', defectsCount: h.defectsCount + 1 } : h))
    setShowAddDefectModal(false)
    showToast(`Đã ghi nhận lỗi khiếm khuyết [${newDefect.id}] và phân công cho tổng thầu ${defectContractor}!`)
  }

  // Action: Đánh dấu lỗi đã khắc phục
  const handleResolveDefect = (id: string) => {
    setDefects(prev => prev.map(d => d.id === id ? { ...d, status: 'Da Khac Phuc', resolvedDate: new Date().toLocaleDateString('vi-VN') } : d))
    showToast(`Đã nghiệm thu đạt chuẩn cho lỗi [${id}]!`)
  }

  // Action: Ký Biên Bản Bàn Giao
  const handleSignHandover = () => {
    if (!selectedHandoverForSign) return
    const id = selectedHandoverForSign.id
    setHandovers(prev => prev.map(h => {
      if (h.id === id) {
        return {
          ...h,
          status: 'da_ban_giao' as HandoverStatus,
          signedDate: new Date().toLocaleDateString('vi-VN'),
          signedByCustomer: true,
          signedByStaff: true,
          defectsCount: 0
        }
      }
      return h
    }))
    setSelectedHandoverForSign(null)
    showToast(`Biên bản bàn giao căn hộ [${selectedHandoverForSign.propertyCode}] đã được ký số và đóng dấu pháp lý thành công!`)
  }

  // Export CSV UTF-8 BOM
  const handleExportCSV = () => {
    let csv = '\uFEFF'
    csv += 'DANH SACH QUAN LY BAN GIAO BAT DONG SAN (HANDOVER REPORT)\r\n'
    csv += 'Mã Vé,Mã Căn,Dự Án,Khách Hàng,Số Điện Thoại,Ngày Hẹn,Kỹ Sư Nghiệm Thu,Trạng Thái,Số Lỗi,Tiến Độ Sổ Hồng\r\n'
    handovers.forEach(h => {
      csv += `"${h.id}","${h.propertyCode}","${h.projectName}","${h.customerName}","${h.customerPhone}","${h.scheduledDate} ${h.scheduledTime}","${h.assignedEngineer}","${h.status}","${h.defectsCount}","${h.pinkBookStage}"\r\n`
    })

    csv += '\r\n\r\nNHAT KY KHIEM KHUYET VA LOI NGHIEM THU (SNAGGING DEFECTS)\r\n'
    csv += 'Mã Lỗi,Mã Căn,Vị Trí,Hạng Mục,Mô Tả Khiếm Khuyết,Mức Độ,Tổng Thầu,Trạng Thái,Ngày Báo Cáo,Hạn Xử Lý\r\n'
    defects.forEach(d => {
      csv += `"${d.id}","${d.propertyCode}","${d.location}","${d.category}","${d.description.replace(/"/g, '""')}","${d.severity}","${d.contractor}","${d.status}","${d.reportedDate}","${d.targetResolutionDate}"\r\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `NovaCRM_Handover_Snagging_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Đã xuất báo cáo Bàn giao & Nghiệm thu khiếm khuyết (CSV UTF-8 BOM) thành công!")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <KeyRound className="h-64 w-64 text-teal-400 -mt-10 -mr-10" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-teal-600 text-white border-none font-bold text-xs uppercase tracking-wider px-3 py-1">
              Phân Hệ 33 / 33 • Property Handover & Snagging Hub
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center gap-1.5 bg-emerald-500/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Chuẩn Nghiệm Thu Quốc Tế ISO 9001
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
            <KeyRound className="h-8 w-8 text-teal-400" />
            Bàn Giao Bất Động Sản & Quản Lý Nghiệm Thu Khiếm Khuyết
          </h1>
          <p className="text-slate-300 mt-2 text-sm leading-relaxed">
            Quy trình số hóa bàn giao căn hộ, kiểm định 50+ chỉ tiêu kỹ thuật nghiệm thu, ký số biên bản nhận nhà, 
            điều phối tổng thầu sửa chữa bảo hành và theo dõi lộ trình cấp Giấy chứng nhận quyền sở hữu (Sổ hồng).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <Button 
            variant="outline" 
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4 mr-1.5 text-cyan-400" /> 
            Xuất Báo Cáo (CSV)
          </Button>

          <Button 
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30"
            onClick={() => setShowAddDefectModal(true)}
          >
            <Wrench className="h-4 w-4 mr-1.5" /> 
            Khai Báo Lỗi Snagging
          </Button>

          <Button 
            className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30"
            onClick={() => setShowAppointmentModal(true)}
          >
            <Calendar className="h-4 w-4 mr-1.5" /> 
            Lập Lịch Hẹn Bàn Giao
          </Button>
        </div>
      </div>

      {/* 4 MACRO KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Căn Đủ Chuẩn Bàn Giao</div>
              <div className="text-2xl font-black text-slate-900">42 Căn Hộ</div>
              <div className="text-xs text-teal-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> 85.2% Hoàn công 5 đại dự án
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Building className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Đã Hoàn Tất Bàn Giao</div>
              <div className="text-2xl font-black text-emerald-600">128 Căn</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Chỉ số hài lòng CSAT: <strong>98.4%</strong>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Khiếm Khuyết Đang Xử Lý</div>
              <div className="text-2xl font-black text-amber-600">{defects.filter(d => d.status !== 'Da Khac Phuc').length} Lỗi</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                SLA nhà thầu xử lý: <strong>3.2 Ngày</strong>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Wrench className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sổ Hồng Đã Trao Tay</div>
              <div className="text-2xl font-black text-purple-700">86 Sổ Hồng</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Sở TN&MT thẩm định 100%
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Award className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-xs overflow-x-auto gap-1">
        {[
          { id: 'handover_list', label: 'Sổ Bàn Giao & Lịch Hẹn', icon: <ClipboardCheck className="h-4 w-4" />, count: handovers.length },
          { id: 'snagging', label: 'Nghiệm Thu Khiếm Khuyết (Snagging)', icon: <Wrench className="h-4 w-4" />, count: defects.length },
          { id: 'warranty', label: 'Bảo Hành & Bàn Giao Chìa Khóa', icon: <ShieldCheck className="h-4 w-4" /> },
          { id: 'pink_book', label: 'Tiến Trình Cấp Sổ Hồng', icon: <Award className="h-4 w-4" />, count: handovers.filter(h => h.pinkBookStage === 'da_trao_so').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white text-teal-700' : 'bg-slate-200 text-slate-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: SỔ BÀN GIAO & LỊCH HẸN (HANDOVER LIST)
         ========================================================================= */}
      {activeTab === 'handover_list' && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-gradient-to-r from-teal-50/50 to-white pb-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-teal-950 text-lg">
                  <ClipboardCheck className="h-5 w-5 text-teal-600" />
                  Danh Sách Căn Hộ Đến Hạn Bàn Giao & Đặt Lịch
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-1">
                  Quản lý toàn bộ tiến trình từ gửi thư mời, đặt lịch hẹn, nghiệm thu kỹ thuật đến ký biên bản bàn giao chính thức.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold"
                  onClick={() => setShowAppointmentModal(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Đặt Lịch Hẹn Mới
                </Button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <Input 
                  placeholder="Tìm theo mã căn, khách hàng, SĐT, HĐ..." 
                  className="pl-9 h-9 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto text-xs">
                {/* Status Filter */}
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  <option value="ALL">Tất Cả Trạng Thái</option>
                  <option value="cho_hen">Chờ Hẹn Ngày</option>
                  <option value="da_dat_lich">Đã Đặt Lịch</option>
                  <option value="dang_nghiem_thu">Đang Nghiệm Thu</option>
                  <option value="co_loi_can_sua">Có Lỗi Cần Sửa</option>
                  <option value="da_ban_giao">Đã Bàn Giao</option>
                </select>

                {/* Project Filter */}
                <select 
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                  className="h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  <option value="ALL">Tất Cả Dự Án</option>
                  <option value="p1">NovaWorld Phan Thiet</option>
                  <option value="p2">Aqua City</option>
                  <option value="p3">The Grand Manhattan</option>
                  <option value="p4">Vinhomes Grand Park</option>
                  <option value="p5">The Global City</option>
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3.5 font-bold">Mã Căn & Dự Án</th>
                  <th className="p-3.5 font-bold">Chủ Sở Hữu (Khách Hàng)</th>
                  <th className="p-3.5 font-bold">Lịch Hẹn & Kỹ Sư Phụ Trách</th>
                  <th className="p-3.5 font-bold">Chỉ Số Bàn Giao</th>
                  <th className="p-3.5 font-bold text-center">Trạng Thái</th>
                  <th className="p-3.5 font-bold text-right">Thao Tác Tác Nghiệp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHandovers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Không tìm thấy hồ sơ bàn giao nào phù hợp với bộ lọc tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredHandovers.map(ticket => (
                    <tr key={ticket.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Property */}
                      <td className="p-3.5">
                        <div className="font-bold text-sm text-teal-700">{ticket.propertyCode}</div>
                        <div className="text-[11px] text-slate-600 font-medium">{ticket.projectName}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{ticket.propertyType} • {ticket.area} m²</div>
                        <div className="font-mono text-[10px] text-slate-400">HĐ: {ticket.contractId}</div>
                      </td>

                      {/* Customer */}
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{ticket.customerName}</div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                          <Phone className="h-3 w-3 text-slate-400" /> {ticket.customerPhone}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-xs">{ticket.customerEmail}</div>
                      </td>

                      {/* Schedule & Engineer */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Clock className="h-3.5 w-3.5 text-teal-600" />
                          <span>{ticket.scheduledDate} ({ticket.scheduledTime})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                          <Users className="h-3 w-3 text-slate-400" /> {ticket.assignedEngineer}
                        </div>
                      </td>

                      {/* Meter & Handover specs */}
                      <td className="p-3.5 font-mono text-[11px] text-slate-600 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" /> Điện: <strong>{ticket.electricMeterIndex} kWh</strong>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-3 w-3 text-blue-500" /> Nước: <strong>{ticket.waterMeterIndex} m³</strong>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Key className="h-3 w-3" /> {ticket.keysHandedOverCount} Chìa • {ticket.accessCardsCount} Thẻ
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3.5 text-center">
                        {ticket.status === 'da_ban_giao' && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-[10px]">
                            Đã Bàn Giao
                          </Badge>
                        )}
                        {ticket.status === 'co_loi_can_sua' && (
                          <Badge className="bg-amber-100 text-amber-800 border-none font-bold text-[10px]">
                            {ticket.defectsCount} Lỗi Đang Sửa
                          </Badge>
                        )}
                        {ticket.status === 'dang_nghiem_thu' && (
                          <Badge className="bg-blue-100 text-blue-800 border-none font-bold text-[10px]">
                            Đang Nghiệm Thu
                          </Badge>
                        )}
                        {ticket.status === 'da_dat_lich' && (
                          <Badge className="bg-purple-100 text-purple-800 border-none font-bold text-[10px]">
                            Đã Đặt Lịch
                          </Badge>
                        )}
                        {ticket.status === 'cho_hen' && (
                          <Badge variant="outline" className="text-slate-500 font-bold text-[10px]">
                            Chờ Hẹn Ngày
                          </Badge>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-y-1">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs border-teal-200 text-teal-700 hover:bg-teal-50"
                            onClick={() => setSelectedHandoverForSign(ticket)}
                          >
                            <FileSignature className="h-3.5 w-3.5 mr-1" /> Biên Bản A4
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                            onClick={() => setSelectedPinkBookDetail(ticket)}
                          >
                            <Award className="h-3.5 w-3.5 mr-1" /> Sổ Hồng
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-7 text-xs text-slate-500 hover:text-slate-900"
                            onClick={() => {
                              setSelectedHandoverForKeys(ticket)
                              setShowKeyHandoverModal(true)
                            }}
                          >
                            <Key className="h-3.5 w-3.5 mr-1" /> Chìa Khóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
          <CardFooter className="p-3 bg-slate-50 border-t flex justify-between items-center text-xs text-slate-500">
            <span>Hiển thị <strong>{filteredHandovers.length}</strong> / {handovers.length} căn hộ</span>
            <span>Tiêu chuẩn hoàn thiện: Cam kết nguyên bản theo phụ lục hợp đồng mua bán</span>
          </CardFooter>
        </Card>
      )}

      {/* =========================================================================
          TAB 2: NGHIỆM THU KHIẾM KHUYẾT (SNAGGING DEFECTS)
         ========================================================================= */}
      {activeTab === 'snagging' && (
        <div className="space-y-6">
          {/* 5 Categories Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { title: 'Xây Thô & Sơn Bả', count: 12, passed: '98%', icon: <Building className="h-4 w-4" /> },
              { title: 'Sàn Gỗ & Trần', count: 8, passed: '99%', icon: <Home className="h-4 w-4" /> },
              { title: 'Hệ Thống Cơ Điện (M&E)', count: 6, passed: '97%', icon: <Zap className="h-4 w-4" /> },
              { title: 'Thiết Bị Vệ Sinh', count: 4, passed: '99%', icon: <Droplets className="h-4 w-4" /> },
              { title: 'Cửa & Smartlock', count: 5, passed: '100%', icon: <Lock className="h-4 w-4" /> },
            ].map((cat, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border bg-white shadow-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span className="font-semibold truncate">{cat.title}</span>
                  {cat.icon}
                </div>
                <div className="text-xl font-bold text-slate-900">{cat.passed}</div>
                <div className="text-[10px] text-emerald-600 font-medium">Đạt chuẩn nghiệm thu</div>
              </div>
            ))}
          </div>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b bg-gradient-to-r from-amber-50/50 to-white pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                    <Wrench className="h-5 w-5 text-amber-600" />
                    Sổ Nhật Ký Nghiệm Thu Khiếm Khuyết (Snagging Defect Log)
                  </CardTitle>
                  <CardDescription className="text-slate-500 text-xs mt-1">
                    Ghi nhận và giao việc cho Tổng thầu xây dựng sửa chữa trước khi khách hàng nhận chìa khóa chính thức.
                  </CardDescription>
                </div>
                <Button 
                  size="sm" 
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                  onClick={() => setShowAddDefectModal(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Thêm Lỗi Khiếm Khuyết
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {defects.map(defect => (
                  <div key={defect.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
                        <Wrench className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{defect.id} • Căn {defect.propertyCode}</span>
                          <Badge variant="outline" className="text-[10px] font-mono bg-slate-50">{defect.category}</Badge>
                          <Badge className={`text-[10px] border-none ${
                            defect.severity === 'Khan Cap' ? 'bg-rose-100 text-rose-800' :
                            defect.severity === 'Trung Binh' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {defect.severity === 'Khan Cap' ? '🔥 Khẩn Cấp' : defect.severity === 'Trung Binh' ? 'Trung Bình' : 'Nhẹ'}
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-700 font-medium">
                          Vị trí: <strong className="text-slate-900">{defect.location}</strong> — {defect.description}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>Tổng thầu: <strong>{defect.contractor}</strong></span>
                          <span>•</span>
                          <span>Báo ngày: {defect.reportedDate}</span>
                          <span>•</span>
                          <span>Hạn xử lý (SLA): <strong className="text-amber-700">{defect.targetResolutionDate}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <Badge className={`text-xs ${
                        defect.status === 'Da Khac Phuc' ? 'bg-emerald-600 text-white' :
                        defect.status === 'Cho Nghiem Thu' ? 'bg-blue-600 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        {defect.status === 'Da Khac Phuc' ? 'Đã Khắc Phục Xong' : defect.status === 'Cho Nghiem Thu' ? 'Chờ Nghiệm Thu Lại' : 'Đang Sửa Chữa'}
                      </Badge>

                      {defect.status !== 'Da Khac Phuc' ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 text-xs font-semibold text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                          onClick={() => handleResolveDefect(defect.id)}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" /> Nghiệm Thu Đạt
                        </Button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Xong ngày {defect.resolvedDate}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 3: BẢO HÀNH & BÀN GIAO CHÌA KHÓA (WARRANTY & KEYS)
         ========================================================================= */}
      {activeTab === 'warranty' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Warranty Card 1 */}
            <Card className="border-teal-200 shadow-sm bg-gradient-to-b from-teal-50/40 to-white">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-2">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <CardTitle className="text-base text-teal-950">Bảo Hành Kết Cấu Xây Dựng</CardTitle>
                <CardDescription className="text-xs">Móng cọc, khung dầm, sàn bê tông chịu lực</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-600">
                <div className="text-2xl font-black text-teal-700">60 Tháng (5 Năm)</div>
                <p className="leading-relaxed">Cam kết toàn vẹn kết cấu kiến trúc bởi Tổng thầu Coteccons & Hòa Bình Corp theo Nghị định 06/2021/NĐ-CP.</p>
              </CardContent>
            </Card>

            {/* Warranty Card 2 */}
            <Card className="border-blue-200 shadow-sm bg-gradient-to-b from-blue-50/40 to-white">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                  <Droplets className="h-5 w-5" />
                </div>
                <CardTitle className="text-base text-blue-950">Chống Thấm Dột & Cơ Điện M&E</CardTitle>
                <CardDescription className="text-xs">Ban công, mái lộ thiên, hộp kỹ thuật</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-600">
                <div className="text-2xl font-black text-blue-700">24 Tháng (2 Năm)</div>
                <p className="leading-relaxed">Bảo hành hệ thống đường ống cấp thoát nước âm tường, chống thấm dột bề mặt và tủ điện trung tâm.</p>
              </CardContent>
            </Card>

            {/* Warranty Card 3 */}
            <Card className="border-purple-200 shadow-sm bg-gradient-to-b from-purple-50/40 to-white">
              <CardHeader className="pb-2">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                  <Lock className="h-5 w-5" />
                </div>
                <CardTitle className="text-base text-purple-950">Thiết Bị Hoàn Thiện & Smartlock</CardTitle>
                <CardDescription className="text-xs">Khóa từ vân tay, thiết bị vệ sinh cao cấp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-slate-600">
                <div className="text-2xl font-black text-purple-700">12 Tháng (1 Năm)</div>
                <p className="leading-relaxed">Hỗ trợ 1 đổi 1 từ nhà cung cấp Hafele, Grohe, Kohler, Daikin khi phát sinh lỗi kỹ thuật của nhà sản xuất.</p>
              </CardContent>
            </Card>
          </div>

          {/* Key handover package */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Key className="h-4 w-4 text-teal-600" />
                Gói Bàn Giao Thiết Bị Truy Cập & Hồ Sơ Hoàn Công Tiêu Chuẩn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Danh Mục Chìa Khóa & Thẻ Thông Minh</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <span><strong>03 Bộ chìa khóa cơ Master:</strong> Cửa chính, cửa phòng ngủ, cửa ban công.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <span><strong>04 Thẻ từ thang máy phân tầng:</strong> Tích hợp thẻ căn hộ và ra vào cổng an ninh 24/7.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <span><strong>02 Thẻ đỗ xe định danh:</strong> Đã kích hoạt vị trí đỗ ô tô thông minh tại tầng hầm B1/B2.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" />
                    <span><strong>Mã PIN Master Smartlock:</strong> Mã quản trị viên khóa cửa vân tay Hafele/Yale.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Danh Bạ Hỗ Trợ Kỹ Thuật 24/7</h4>
                <div className="p-4 bg-slate-50 rounded-xl border space-y-2">
                  <div className="flex justify-between">
                    <span>Đơn vị Quản lý vận hành:</span>
                    <strong className="text-slate-800">Savills Property Management</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotline Trực Ban Kỹ Thuật:</span>
                    <strong className="text-teal-700 font-mono">1900 6868 (Phím 1)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Tiếp Nhận Bảo Hành:</span>
                    <strong className="text-slate-800">cskh@novacrm.vn</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian phản hồi khiếu nại:</span>
                    <strong className="text-emerald-600 font-bold">&lt; 30 Phút</strong>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* =========================================================================
          TAB 4: TIẾN TRÌNH CẤP SỔ HỒNG (PINK BOOK TRACKER)
         ========================================================================= */}
      {activeTab === 'pink_book' && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50/50 to-white pb-4">
            <CardTitle className="flex items-center gap-2 text-purple-950 text-lg">
              <Award className="h-5 w-5 text-purple-600" />
              Tiến Trình Cấp Giấy Chứng Nhận Quyền Sở Hữu (Sổ Hồng)
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs mt-1">
              Theo dõi minh bạch 5 giai đoạn pháp lý từ tiếp nhận hồ sơ đến bàn giao phôi sổ hồng có dấu đỏ cho cư dân.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">

            {/* Stepper overview */}
            <div className="p-4 bg-slate-50 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              {[
                { step: '1', title: 'Tiếp Nhận Hồ Sơ', desc: 'Kiểm tra HĐMB & TT đợt cuối' },
                { step: '2', title: 'Nộp Sở TN&MT', desc: 'Thẩm định trích đo địa chính' },
                { step: '3', title: 'Thẩm Định Thuế', desc: 'Đóng thuế trước bạ 0.5%' },
                { step: '4', title: 'Đã In Phôi Sổ', desc: 'Ký duyệt số seri phôi' },
                { step: '5', title: 'Trao Sổ Tận Tay', desc: 'Lễ bàn giao long trọng' },
              ].map((st, i) => (
                <div key={i} className="flex items-center gap-3 flex-1">
                  <div className="h-8 w-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">
                    {st.step}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{st.title}</div>
                    <div className="text-[10px] text-slate-400">{st.desc}</div>
                  </div>
                  {i < 4 && <ChevronRight className="h-4 w-4 text-slate-300 hidden md:block ml-auto" />}
                </div>
              ))}
            </div>

            {/* Pink book tracking list */}
            <div className="divide-y border rounded-xl overflow-hidden bg-white">
              {handovers.map(ticket => (
                <div key={ticket.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">{ticket.propertyCode}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700">{ticket.customerName}</span>
                      <Badge variant="outline" className="text-[10px]">{ticket.projectName}</Badge>
                    </div>
                    <div className="text-slate-500">
                      Mã số phôi: <strong className="font-mono text-purple-700">{ticket.pinkBookNumber || 'Đang chờ cấp số seri...'}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <Badge className={`text-[10px] ${
                        ticket.pinkBookStage === 'da_trao_so' ? 'bg-emerald-600 text-white' :
                        ticket.pinkBookStage === 'da_in_phoi_so' ? 'bg-purple-600 text-white' :
                        ticket.pinkBookStage === 'tham_dinh_thue' ? 'bg-blue-600 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                        {ticket.pinkBookStage === 'da_trao_so' ? '5. Đã Trao Sổ Hồng' :
                         ticket.pinkBookStage === 'da_in_phoi_so' ? '4. Đã In Phôi Sổ' :
                         ticket.pinkBookStage === 'tham_dinh_thue' ? '3. Thẩm Định Thuế' :
                         ticket.pinkBookStage === 'nop_so_tnmt' ? '2. Đang Nộp Sở TN&MT' : '1. Tiếp Nhận Hồ Sơ'}
                      </Badge>
                      <div className="text-[10px] text-slate-400 mt-1">Dự kiến hoàn tất Q4/2026</div>
                    </div>

                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs"
                      onClick={() => setSelectedPinkBookDetail(ticket)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Chi Tiết Hồ Sơ
                    </Button>
                  </div>
                </div>
              ))}
            </div>

          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          5 INTERACTIVE MODALS
         ========================================================================= */}

      {/* MODAL 1: Lập Lịch Hẹn Bàn Giao */}
      <Dialog open={showAppointmentModal} onOpenChange={setShowAppointmentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-950">
              <Calendar className="h-5 w-5 text-teal-600" />
              Lập Lịch Hẹn Bàn Giao Nhà Cho Cư Dân
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Điều phối thời gian và kỹ sư Ban QLDA đi cùng khách hàng trong ngày nhận nhà.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAppointment} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Chọn Căn Hộ Bàn Giao *</label>
              <select 
                value={appPropertyCode}
                onChange={(e) => {
                  setAppPropertyCode(e.target.value)
                  const match = handovers.find(h => h.propertyCode === e.target.value)
                  if (match) setAppCustomerName(match.customerName)
                }}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
              >
                {handovers.map(h => (
                  <option key={h.id} value={h.propertyCode}>{h.propertyCode} — {h.projectName} ({h.customerName})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Ngày Hẹn Bàn Giao *</label>
                <Input 
                  type="date"
                  value={appDate}
                  onChange={(e) => setAppDate(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Giờ Hẹn *</label>
                <Input 
                  type="time"
                  value={appTime}
                  onChange={(e) => setAppTime(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Kỹ Sư Ban QLDA Phụ Trách</label>
              <select 
                value={appEngineer}
                onChange={(e) => setAppEngineer(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
              >
                <option value="KS. Trần Đình Trọng (Ban QLDA)">KS. Trần Đình Trọng (Ban QLDA)</option>
                <option value="KS. Nguyễn Văn Hải (Ban QLDA)">KS. Nguyễn Văn Hải (Ban QLDA)</option>
                <option value="KS. Lê Văn Nam (CBRE Property)">KS. Lê Văn Nam (CBRE Property)</option>
                <option value="KS. Hoàng Minh Đức (Masterise Quality)">KS. Hoàng Minh Đức (Masterise Quality)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Ghi Chú Yêu Cầu Của Khách Hàng</label>
              <Input 
                value={appNotes}
                onChange={(e) => setAppNotes(e.target.value)}
                className="text-xs"
                placeholder="VD: Kiểm tra kỹ áp lực nước, yêu cầu bọc sàn..."
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAppointmentModal(false)}>
                Hủy Bỏ
              </Button>
              <Button type="submit" size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                Xác Nhận Đặt Lịch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Báo Lỗi Nghiệm Thu Snagging */}
      <Dialog open={showAddDefectModal} onOpenChange={setShowAddDefectModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-950">
              <Wrench className="h-5 w-5 text-amber-600" />
              Khai Báo Lỗi Khiếm Khuyết (Snagging Defect)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Giao việc sửa chữa cho Tổng thầu xây dựng kèm thời hạn cam kết SLA.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDefect} className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Mã Căn Hộ *</label>
                <select 
                  value={defectProperty}
                  onChange={(e) => setDefectProperty(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  {handovers.map(h => (
                    <option key={h.id} value={h.propertyCode}>{h.propertyCode}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Hạng Mục Lỗi</label>
                <select 
                  value={defectCategory}
                  onChange={(e) => setDefectCategory(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  <option value="Xây thô & Sơn bả">Xây thô & Sơn bả</option>
                  <option value="Sàn & Trần">Sàn & Trần</option>
                  <option value="Cơ điện (M&E)">Cơ điện (M&E)</option>
                  <option value="Thiết bị vệ sinh">Thiết bị vệ sinh</option>
                  <option value="Cửa & Khóa">Cửa & Khóa</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Vị Trí Cụ Thể Trong Căn *</label>
              <Input 
                value={defectLocation}
                onChange={(e) => setDefectLocation(e.target.value)}
                placeholder="VD: Phòng khách, Ban công sau, WC Master..."
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Mô Tả Chi Tiết Khiếm Khuyết *</label>
              <textarea 
                rows={2}
                value={defectDesc}
                onChange={(e) => setDefectDesc(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-teal-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Tổng Thầu Chịu Trách Nhiệm</label>
                <select 
                  value={defectContractor}
                  onChange={(e) => setDefectContractor(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  <option value="Hòa Bình Corp">Hòa Bình Corp</option>
                  <option value="Coteccons">Coteccons</option>
                  <option value="Ricons">Ricons</option>
                  <option value="Nhôm Kính Eurowindow">Nhôm Kính Eurowindow</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Mức Độ Nghiêm Trọng</label>
                <select 
                  value={defectSeverity}
                  onChange={(e) => setDefectSeverity(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  <option value="Nhe">Nhẹ (Thẩm mỹ)</option>
                  <option value="Trung Binh">Trung Bình (Cơ khí/lắp đặt)</option>
                  <option value="Khan Cap">🔥 Khẩn Cấp (Thấm dột, điện)</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddDefectModal(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                Xác Nhận Khai Báo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Ký Số Biên Bản Bàn Giao A4 */}
      <Dialog open={!!selectedHandoverForSign} onOpenChange={() => setSelectedHandoverForSign(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-950">
              <FileSignature className="h-5 w-5 text-teal-600" />
              Biên Bản Bàn Giao Bất Động Sản (Mẫu A4 Số Hóa)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Văn bản pháp lý xác nhận hoàn tất nghiệm thu và chuyển giao quyền sử dụng nhà ở.
            </DialogDescription>
          </DialogHeader>

          {selectedHandoverForSign && (
            <div className="p-6 bg-white border rounded-xl shadow-xs space-y-5 text-xs text-slate-800 font-serif">
              {/* Header A4 */}
              <div className="text-center space-y-1 border-b pb-4">
                <div className="font-bold text-xs uppercase tracking-widest text-slate-900">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="text-[11px] underline">Độc lập - Tự do - Hạnh phúc</div>
                <div className="text-base font-bold uppercase tracking-wider text-slate-950 pt-3">
                  BIÊN BẢN BÀN GIAO CĂN HỘ / NHÀ Ở
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Số: {selectedHandoverForSign.id}/BBBG-{selectedHandoverForSign.propertyCode} • Ngày: {selectedHandoverForSign.scheduledDate}
                </div>
              </div>

              {/* Parties */}
              <div className="space-y-3 font-sans text-xs">
                <div>
                  <strong className="text-teal-900">BÊN GIAO (CHỦ ĐẦU TƯ / BAN QUẢN LÝ DỰ ÁN):</strong>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-slate-600">
                    <div>Đại diện: <strong>{selectedHandoverForSign.assignedEngineer}</strong></div>
                    <div>Dự án: <strong>{selectedHandoverForSign.projectName}</strong></div>
                  </div>
                </div>

                <div>
                  <strong className="text-teal-900">BÊN NHẬN (KHÁCH HÀNG / BÊN MUA):</strong>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-slate-600">
                    <div>Họ và tên: <strong>{selectedHandoverForSign.customerName}</strong></div>
                    <div>Số điện thoại: <strong>{selectedHandoverForSign.customerPhone}</strong></div>
                    <div>Hợp đồng mua bán: <strong>{selectedHandoverForSign.contractId}</strong></div>
                    <div>Mã căn hộ: <strong className="text-teal-700">{selectedHandoverForSign.propertyCode}</strong> ({selectedHandoverForSign.area} m²)</div>
                  </div>
                </div>

                {/* Handover specs */}
                <div className="p-3 bg-slate-50 rounded-lg border space-y-1">
                  <div className="font-bold text-slate-800">THÔNG SỐ BÀN GIAO THỰC ĐỊA:</div>
                  <div className="grid grid-cols-3 gap-2 text-slate-600">
                    <div>• Chỉ số điện kế: <strong>{selectedHandoverForSign.electricMeterIndex} kWh</strong></div>
                    <div>• Chỉ số đồng hồ nước: <strong>{selectedHandoverForSign.waterMeterIndex} m³</strong></div>
                    <div>• Chìa khóa & thẻ từ: <strong>{selectedHandoverForSign.keysHandedOverCount} Chìa, {selectedHandoverForSign.accessCardsCount} Thẻ</strong></div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Hai bên đã cùng nhau kiểm tra toàn bộ hiện trạng căn hộ theo Phụ lục vật liệu bàn giao. 
                  Bên Mua xác nhận đã nhận bàn giao căn hộ đúng quy cách và được kích hoạt quyền bảo hành kể từ ngày ký biên bản này.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t font-sans text-center">
                <div>
                  <div className="font-bold text-slate-900">ĐẠI DIỆN CHỦ ĐẦU TƯ</div>
                  <div className="text-[10px] text-slate-400 mb-10">(Ký, ghi rõ họ tên và đóng dấu)</div>
                  <div className="font-bold text-teal-700">{selectedHandoverForSign.assignedEngineer}</div>
                  <Badge variant="outline" className="text-[9px] bg-teal-50 text-teal-700 border-teal-200 mt-1">
                    Đã Ký Số SHA-256
                  </Badge>
                </div>

                <div>
                  <div className="font-bold text-slate-900">ĐẠI DIỆN KHÁCH HÀNG</div>
                  <div className="text-[10px] text-slate-400 mb-10">(Ký và ghi rõ họ tên)</div>
                  <div className="font-bold text-slate-800">{selectedHandoverForSign.customerName}</div>
                  <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200 mt-1">
                    Xác Thực OTP Khách Hàng
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedHandoverForSign(null)}>
              Đóng Lại
            </Button>
            <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white font-bold" onClick={handleSignHandover}>
              <Check className="h-4 w-4 mr-1.5" /> Ký Duyệt & Bàn Giao Ngay
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Chi Tiết Hồ Sơ Cấp Sổ Hồng */}
      <Dialog open={!!selectedPinkBookDetail} onOpenChange={() => setSelectedPinkBookDetail(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-purple-950">
              <Award className="h-5 w-5 text-purple-600" />
              Chi Tiết Tiến Trình Cấp Sổ Hồng
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Căn hộ: <strong className="font-mono text-purple-700">{selectedPinkBookDetail?.propertyCode}</strong> • Chủ hộ: {selectedPinkBookDetail?.customerName}
            </DialogDescription>
          </DialogHeader>

          {selectedPinkBookDetail && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 space-y-1">
                <div><strong>Mã số hợp đồng:</strong> {selectedPinkBookDetail.contractId}</div>
                <div><strong>Dự án:</strong> {selectedPinkBookDetail.projectName}</div>
                <div><strong>Số phôi sổ hồng:</strong> <span className="font-mono text-purple-700 font-bold">{selectedPinkBookDetail.pinkBookNumber || 'Đang thẩm định phôi'}</span></div>
                <div><strong>Cơ quan cấp:</strong> Sở Tài Nguyên và Môi Trường Tỉnh/TP</div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-800">Checklist Hồ Sơ Pháp Lý Đã Nộp:</span>
                <div className="space-y-1 text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Bản gốc Hợp đồng mua bán đã công chứng
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Biên bản nghiệm thu bàn giao nhà có chữ ký 2 bên
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Bản vẽ trích lục sơ đồ mặt bằng căn hộ 1/500
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Hóa đơn GTGT và xác nhận hoàn tất 100% nghĩa vụ tài chính
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" onClick={() => setSelectedPinkBookDetail(null)}>
              Đóng Cửa Sổ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: Bàn Giao Chùm Chìa Khóa Smartkey */}
      <Dialog open={showKeyHandoverModal} onOpenChange={setShowKeyHandoverModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-950">
              <Key className="h-5 w-5 text-teal-600" />
              Biên Nhận Bàn Giao Chùm Chìa Khóa & Thẻ Cư Dân
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Căn hộ: <strong className="text-teal-700">{selectedHandoverForKeys?.propertyCode}</strong> • {selectedHandoverForKeys?.customerName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 space-y-2">
              <div className="font-bold text-teal-900">Chi tiết bàn giao vật tư:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-700">
                <li>03 Chìa khóa cơ Hafele nguyên niêm phong</li>
                <li>04 Thẻ từ thang máy phân tầng thông minh</li>
                <li>02 Thẻ đỗ xe ô tô tầng hầm B1</li>
                <li>Tài liệu hướng dẫn đổi mã PIN Master khóa cửa</li>
              </ul>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-xl bg-slate-50">
              <div>
                <div className="font-bold text-slate-800">Đã Kích Hoạt Quyền Cư Dân Ứng Dụng Mobile</div>
                <div className="text-[11px] text-slate-500">Tài khoản cư dân liên kết SĐT: {selectedHandoverForKeys?.customerPhone}</div>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowKeyHandoverModal(false)}>
              Đóng
            </Button>
            <Button 
              size="sm" 
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold"
              onClick={() => {
                setShowKeyHandoverModal(false)
                showToast(`Đã ghi nhận bàn giao trọn bộ chìa khóa & thẻ từ cho cư dân ${selectedHandoverForKeys?.customerName}!`)
              }}
            >
              Xác Nhận Đã Trao Chìa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
