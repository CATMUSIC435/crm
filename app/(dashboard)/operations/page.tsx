"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  Building2, Users, Receipt, Wrench, ShieldAlert, Sparkles, Clock, 
  Calendar, CheckCircle2, AlertTriangle, Plus, Download, Search, 
  Filter, Check, X, Phone, Mail, FileText, QrCode, Home, Droplets, 
  Zap, Car, Flame, CheckCircle, RefreshCw, Send, ShieldCheck
} from 'lucide-react'
import { OperationBillItem, FitoutPermitItem, AmenityBookingItem, ResidentTicketItem, BillStatus, FitoutStatus, TicketPriority } from '@/types'

// INITIAL MOCK DATA
const INITIAL_BILLS: OperationBillItem[] = [
  {
    id: 'INV-2026-0701',
    month: '07/2026',
    propertyCode: 'NVW-01.01',
    projectName: 'NovaWorld Phan Thiet',
    residentName: 'Nguyễn Văn Tuấn',
    residentPhone: '0901234567',
    managementFee: 4500000,
    parkingFee: 2400000,
    utilitiesFee: 1850000,
    totalAmount: 8750000,
    status: 'da_thanh_toan',
    dueDate: '25/07/2026',
    paidDate: '19/07/2026',
    paymentMethod: 'VietQR Pro 24/7'
  },
  {
    id: 'INV-2026-0702',
    month: '07/2026',
    propertyCode: 'AQC-12A.01',
    projectName: 'Aqua City',
    residentName: 'Vũ Thu Trang',
    residentPhone: '0966554433',
    managementFee: 2880000,
    parkingFee: 1200000,
    utilitiesFee: 950000,
    totalAmount: 5030000,
    status: 'cho_thanh_toan',
    dueDate: '25/07/2026'
  },
  {
    id: 'INV-2026-0703',
    month: '07/2026',
    propertyCode: 'TGM-18.04',
    projectName: 'The Grand Manhattan',
    residentName: 'Phạm Minh Tuấn',
    residentPhone: '0912987654',
    managementFee: 2070000,
    parkingFee: 2500000,
    utilitiesFee: 1420000,
    totalAmount: 5990000,
    status: 'da_thanh_toan',
    dueDate: '25/07/2026',
    paidDate: '18/07/2026',
    paymentMethod: 'Chuyển khoản VCB'
  },
  {
    id: 'INV-2026-0704',
    month: '07/2026',
    propertyCode: 'TGC-LK05',
    projectName: 'The Global City',
    residentName: 'Trần Thị Bích Ngọc',
    residentPhone: '0912345678',
    managementFee: 2394000,
    parkingFee: 1200000,
    utilitiesFee: 850000,
    totalAmount: 4444000,
    status: 'cho_thanh_toan',
    dueDate: '25/07/2026'
  },
  {
    id: 'INV-2026-0689',
    month: '06/2026',
    propertyCode: 'VGP-S5.02',
    projectName: 'Vinhomes Grand Park',
    residentName: 'Hoàng Thị Thảo',
    residentPhone: '0945678123',
    managementFee: 1224000,
    parkingFee: 600000,
    utilitiesFee: 650000,
    totalAmount: 2474000,
    status: 'qua_han',
    dueDate: '25/06/2026'
  }
]

const INITIAL_FITOUTS: FitoutPermitItem[] = [
  {
    id: 'FIT-2026-01',
    propertyCode: 'TGM-18.04',
    residentName: 'Phạm Minh Tuấn',
    contractorName: 'Công Ty CP Nội Thất Thái Công VIP',
    contractorPhone: '0908889999',
    workersCount: 8,
    startDate: '15/07/2026',
    endDate: '30/09/2026',
    depositAmount: 50000000,
    status: 'dang_thi_cong',
    depositRefunded: false,
    notes: 'Đã bọc màng bảo vệ thang máy hàng, kiểm tra bình PCCC đạt chuẩn'
  },
  {
    id: 'FIT-2026-02',
    propertyCode: 'NVW-01.01',
    residentName: 'Nguyễn Văn Tuấn',
    contractorName: 'EuroDesign Luxury Interiors',
    contractorPhone: '0918776655',
    workersCount: 12,
    startDate: '01/08/2026',
    endDate: '15/10/2026',
    depositAmount: 100000000,
    status: 'cho_duyet',
    depositRefunded: false,
    notes: 'Đang chờ thẩm duyệt bản vẽ cải tạo hồ bơi sân sau'
  },
  {
    id: 'FIT-2026-03',
    propertyCode: 'AQC-12A.01',
    residentName: 'Vũ Thu Trang',
    contractorName: 'An Cường Home Furnishing',
    contractorPhone: '0933221100',
    workersCount: 6,
    startDate: '01/06/2026',
    endDate: '10/07/2026',
    depositAmount: 50000000,
    status: 'cho_nghiem_thu',
    depositRefunded: false,
    notes: 'Đã hoàn tất lắp ráp nội thất gỗ, đề nghị Ban Quản Lý nghiệm thu hoàn cọc'
  }
]

const INITIAL_BOOKINGS: AmenityBookingItem[] = [
  {
    id: 'BKG-01',
    amenityType: 'Sân Pickleball VIP',
    propertyCode: 'NVW-01.01',
    residentName: 'Nguyễn Văn Tuấn',
    residentPhone: '0901234567',
    bookingDate: 'Hôm nay, 17:30',
    timeSlot: '17:30 - 19:30',
    guestsCount: 4,
    fee: 0,
    status: 'da_checkin'
  },
  {
    id: 'BKG-02',
    amenityType: 'Khu Tiệc Nướng BBQ Ngoài Trời',
    propertyCode: 'AQC-12A.01',
    residentName: 'Vũ Thu Trang',
    residentPhone: '0966554433',
    bookingDate: 'Hôm nay, 18:00',
    timeSlot: '18:00 - 21:30',
    guestsCount: 12,
    fee: 300000,
    status: 'da_xac_nhan'
  },
  {
    id: 'BKG-03',
    amenityType: 'Phòng Tiệc Cigar & Lounge',
    propertyCode: 'TGM-18.04',
    residentName: 'Phạm Minh Tuấn',
    residentPhone: '0912987654',
    bookingDate: 'Ngày mai, 19:00',
    timeSlot: '19:00 - 23:00',
    guestsCount: 8,
    fee: 1500000,
    status: 'da_xac_nhan'
  }
]

const INITIAL_TICKETS: ResidentTicketItem[] = [
  {
    id: 'TCK-501',
    propertyCode: 'NVW-01.01',
    residentName: 'Nguyễn Văn Tuấn',
    residentPhone: '0901234567',
    category: 'Điện nước',
    title: 'Áp lực nước tưới sân vườn tự động hơi yếu vào khung giờ 16:00',
    description: 'Hệ thống van tự động mở nhưng lưu lượng nước giảm do bơm tăng áp khu vực',
    priority: 'Trung Binh',
    status: 'Dang Xu Ly',
    assignedStaff: 'KTV. Đỗ Thành Đạt (Savills)',
    createdAt: '14:20 Hôm nay',
    slaMinutes: 60
  },
  {
    id: 'TCK-502',
    propertyCode: 'TGM-18.04',
    residentName: 'Phạm Minh Tuấn',
    residentPhone: '0912987654',
    category: 'Thang máy',
    title: 'Thẻ từ thang máy tầng 18 đôi khi quét nhận chậm 3 giây',
    description: 'Đầu đọc thẻ thang số 02 cần được kỹ thuật hiệu chỉnh cảm ứng',
    priority: 'Binh Thuong',
    status: 'Dang Xu Ly',
    assignedStaff: 'KTV. Nguyễn Minh Nhật',
    createdAt: '11:15 Hôm nay',
    slaMinutes: 120
  },
  {
    id: 'TCK-503',
    propertyCode: 'AQC-12A.01',
    residentName: 'Vũ Thu Trang',
    residentPhone: '0966554433',
    category: 'An ninh trật tự',
    title: 'Xe giao hàng vật liệu thi công đỗ lấn lối đi dạo bộ',
    description: 'Đội bảo vệ đã nhắc nhở và điều phối xe vào khu tập kết ngầm',
    priority: 'Khan Cap',
    status: 'Da Xu Ly Xong',
    assignedStaff: 'Đội An Ninh Ca Ngày',
    createdAt: '09:00 Hôm nay',
    resolvedAt: '09:25 Hôm nay',
    slaMinutes: 30
  }
]

export default function PropertyOperationsPage() {
  const [activeTab, setActiveTab] = useState<'service_fees' | 'fitout' | 'amenities' | 'helpdesk'>('service_fees')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Data States
  const [bills, setBills] = useState<OperationBillItem[]>(INITIAL_BILLS)
  const [fitouts, setFitouts] = useState<FitoutPermitItem[]>(INITIAL_FITOUTS)
  const [bookings, setBookings] = useState<AmenityBookingItem[]>(INITIAL_BOOKINGS)
  const [tickets, setTickets] = useState<ResidentTicketItem[]>(INITIAL_TICKETS)
  const [searchQuery, setSearchQuery] = useState('')
  const [billStatusFilter, setBillStatusFilter] = useState<string>('ALL')
  const [isLiveConnected, setIsLiveConnected] = useState(false)

  React.useEffect(() => {
    async function loadBackendOperations() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('nova_auth_token') || '' : ''
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

        // Fetch bills
        const resBills = await fetch('/backend-api/operations/bills', { headers })
        if (resBills.ok) {
          const jsonBills = await resBills.json()
          if (jsonBills.data && Array.isArray(jsonBills.data) && jsonBills.data.length > 0) {
            setBills(jsonBills.data.map((b: any) => ({
              id: b.billCode || b.id,
              month: b.month,
              propertyCode: b.propertyCode,
              projectName: b.projectName,
              residentName: b.residentName,
              residentPhone: b.residentPhone || '0901234567',
              managementFee: Number(b.managementFee) || 0,
              parkingFee: Number(b.parkingFee) || 0,
              utilitiesFee: Number(b.utilitiesFee) || 0,
              totalAmount: Number(b.totalAmount) || 0,
              status: b.status,
              dueDate: b.dueDate,
              paidDate: b.paidDate,
              paymentMethod: b.paymentMethod,
            })))
            setIsLiveConnected(true)
          }
        }

        // Fetch permits
        const resPermits = await fetch('/backend-api/operations/permits', { headers })
        if (resPermits.ok) {
          const jsonPermits = await resPermits.json()
          if (jsonPermits.data && Array.isArray(jsonPermits.data) && jsonPermits.data.length > 0) {
            setFitouts(jsonPermits.data.map((p: any) => ({
              id: p.id,
              propertyCode: p.propertyCode,
              residentName: p.residentName,
              contractorName: p.contractorName,
              contractorPhone: p.contractorPhone || '0988776655',
              workersCount: p.workersCount || 1,
              startDate: p.startDate,
              endDate: p.endDate,
              depositAmount: Number(p.depositAmount) || 0,
              status: p.status,
              depositRefunded: p.depositRefunded || false,
              notes: p.notes || '',
            })))
          }
        }

        // Fetch bookings
        const resBookings = await fetch('/backend-api/operations/amenities/bookings', { headers })
        if (resBookings.ok) {
          const jsonBookings = await resBookings.json()
          if (jsonBookings.data && Array.isArray(jsonBookings.data) && jsonBookings.data.length > 0) {
            setBookings(jsonBookings.data.map((bk: any) => ({
              id: bk.id,
              amenityType: bk.amenityType,
              propertyCode: bk.propertyCode,
              residentName: bk.residentName,
              residentPhone: bk.residentPhone || '0901234567',
              bookingDate: bk.bookingDate,
              timeSlot: bk.timeSlot,
              guestsCount: bk.guestsCount || 1,
              fee: 0,
              status: bk.status,
            })))
          }
        }
      } catch (e) {
        // Fallback silently
      }
    }
    loadBackendOperations()
  }, [])

  // Modals States (5 Modals)
  const [showCreateBillModal, setShowCreateBillModal] = useState(false)
  const [showFitoutModal, setShowFitoutModal] = useState(false)
  const [showBookAmenityModal, setShowBookAmenityModal] = useState(false)
  const [showAddTicketModal, setShowAddTicketModal] = useState(false)
  const [selectedBillForReceipt, setSelectedBillForReceipt] = useState<OperationBillItem | null>(null)

  // Form states
  const [newBillProp, setNewBillProp] = useState('NVW-01.01')
  const [newBillResident, setNewBillResident] = useState('Nguyễn Văn Tuấn')
  const [newBillArea, setNewBillArea] = useState('250')
  const [newBillParkings, setNewBillParkings] = useState('2') // 2 ô tô
  const [newBillUtilities, setNewBillUtilities] = useState('1500000')

  const [newFitProp, setNewFitProp] = useState('TGC-LK05')
  const [newFitResident, setNewFitResident] = useState('Trần Thị Bích Ngọc')
  const [newFitContractor, setNewFitContractor] = useState('Nhà Thầu Mộc Decor')
  const [newFitWorkers, setNewFitWorkers] = useState('6')
  const [newFitDays, setNewFitDays] = useState('45')

  const [newAmenityType, setNewAmenityType] = useState<AmenityBookingItem['amenityType']>('Sân Pickleball VIP')
  const [newAmenityProp, setNewAmenityProp] = useState('NVW-01.01')
  const [newAmenityResident, setNewAmenityResident] = useState('Nguyễn Văn Tuấn')
  const [newAmenitySlot, setNewAmenitySlot] = useState('18:00 - 20:00')
  const [newAmenityGuests, setNewAmenityGuests] = useState('4')

  const [newTicketProp, setNewTicketProp] = useState('TGM-18.04')
  const [newTicketResident, setNewTicketResident] = useState('Phạm Minh Tuấn')
  const [newTicketCat, setNewTicketCat] = useState<ResidentTicketItem['category']>('Điện nước')
  const [newTicketTitle, setNewTicketTitle] = useState('Cần hỗ trợ kiểm tra aptomat máy lạnh')
  const [newTicketDesc, setNewTicketDesc] = useState('Máy lạnh phòng khách tự ngắt sau 30 phút hoạt động')
  const [newTicketPriority, setNewTicketPriority] = useState<TicketPriority>('Trung Binh')

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  // Filtered Bills
  const filteredBills = bills.filter(b => {
    const matchSearch = b.propertyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        b.residentPhone.includes(searchQuery)
    const matchStatus = billStatusFilter === 'ALL' || b.status === billStatusFilter
    return matchSearch && matchStatus
  })

  // Action: Pay Bill
  const handlePayBill = (id: string) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, status: 'da_thanh_toan', paidDate: new Date().toLocaleDateString('vi-VN'), paymentMethod: 'VietQR Pro 24/7' } : b))
    showToast(`Đã gạch nợ thành công hóa đơn [${id}] qua cổng VietQR!`)
  }

  // Action: Send Bill Reminder
  const handleSendReminder = (bill: OperationBillItem) => {
    showToast(`Đã gửi thông báo thu phí dịch vụ tháng ${bill.month} đến Zalo & SĐT [${bill.residentPhone}] của cư dân ${bill.residentName}!`)
  }

  // Action: Submit Create Bill
  const handleCreateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mgmtFee = Number(newBillArea) * 18000
    const parkFee = Number(newBillParkings) * 1200000
    const utilFee = Number(newBillUtilities)
    const total = mgmtFee + parkFee + utilFee

    const newBill: OperationBillItem = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      month: '07/2026',
      propertyCode: newBillProp,
      projectName: 'NovaWorld Phan Thiet',
      residentName: newBillResident,
      residentPhone: '0901234567',
      managementFee: mgmtFee,
      parkingFee: parkFee,
      utilitiesFee: utilFee,
      totalAmount: total,
      status: 'cho_thanh_toan',
      dueDate: '25/07/2026'
    }

    setBills(prev => [newBill, ...prev])
    setShowCreateBillModal(false)
    showToast(`Đã lập hóa đơn tháng 07/2026 cho căn [${newBillProp}] với tổng tiền ${(total / 1000000).toFixed(2)} Tr VNĐ!`)
  }

  // Action: Submit Fitout Permit
  const handleFitoutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newFit: FitoutPermitItem = {
      id: `FIT-2026-${Math.floor(10 + Math.random() * 90)}`,
      propertyCode: newFitProp,
      residentName: newFitResident,
      contractorName: newFitContractor,
      contractorPhone: '0908889999',
      workersCount: Number(newFitWorkers),
      startDate: new Date().toLocaleDateString('vi-VN'),
      endDate: '30/09/2026',
      depositAmount: 50000000,
      status: 'dang_thi_cong',
      depositRefunded: false,
      notes: 'Đã hoàn tất nộp ký quỹ PCCC 50,000,000đ và cam kết giờ giấc thi công chống ồn'
    }

    setFitouts(prev => [newFit, ...prev])
    setShowFitoutModal(false)
    showToast(`Đã cấp phép thi công nội thất cho căn [${newFitProp}] thành công!`)
  }

  // Action: Submit Amenity Booking
  const handleBookAmenitySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newBkg: AmenityBookingItem = {
      id: `BKG-${Math.floor(10 + Math.random() * 90)}`,
      amenityType: newAmenityType,
      propertyCode: newAmenityProp,
      residentName: newAmenityResident,
      residentPhone: '0901234567',
      bookingDate: 'Hôm nay',
      timeSlot: newAmenitySlot,
      guestsCount: Number(newAmenityGuests),
      fee: newAmenityType === 'Phòng Tiệc Cigar & Lounge' ? 1500000 : 0,
      status: 'da_xac_nhan'
    }

    setBookings(prev => [newBkg, ...prev])
    setShowBookAmenityModal(false)
    showToast(`Đã xác nhận đặt chỗ [${newAmenityType}] cho căn ${newAmenityProp} (${newAmenitySlot})!`)
  }

  // Action: Submit Ticket
  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTck: ResidentTicketItem = {
      id: `TCK-${Math.floor(600 + Math.random() * 400)}`,
      propertyCode: newTicketProp,
      residentName: newTicketResident,
      residentPhone: '0912987654',
      category: newTicketCat,
      title: newTicketTitle,
      description: newTicketDesc,
      priority: newTicketPriority,
      status: 'Moi Tiep Nhan',
      assignedStaff: 'KTV Trực Ban Kỹ Thuật (Savills)',
      createdAt: 'Vừa xong',
      slaMinutes: newTicketPriority === 'Khan Cap' ? 30 : 60
    }

    setTickets(prev => [newTck, ...prev])
    setShowAddTicketModal(false)
    showToast(`Đã tiếp nhận sự cố kỹ thuật [${newTck.id}] và phân công kỹ sư trực ban!`)
  }

  // Action: Resolve Ticket
  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Da Xu Ly Xong', resolvedAt: 'Vừa xong' } : t))
    showToast(`Đã ghi nhận khắc phục thành công sự cố [${id}]!`)
  }

  // CSV Export UTF-8 BOM
  const handleExportCSV = () => {
    let csv = '\uFEFF'
    csv += 'SO THEO DOI PHI QUAN LY VA HOA DON DICH VU (BILLING LEDGER)\r\n'
    csv += 'Mã Hóa Đơn,Tháng,Mã Căn,Dự Án,Cư Dân,Số Điện Thoại,Phí Quản Lý,Phí Gửi Xe,Tiền Điện Nước,Tổng Tiền,Trạng Thái,Hạn Đóng\r\n'
    bills.forEach(b => {
      csv += `"${b.id}","${b.month}","${b.propertyCode}","${b.projectName}","${b.residentName}","${b.residentPhone}","${b.managementFee}","${b.parkingFee}","${b.utilitiesFee}","${b.totalAmount}","${b.status}","${b.dueDate}"\r\n`
    })

    csv += '\r\n\r\nNHAT KY SU CO KY THUAT VA TICKET CU DAN (RESIDENT HELPDESK)\r\n'
    csv += 'Mã Ticket,Mã Căn,Cư Dân,Phân Loại,Tiêu Đề Sự Cố,Mức Độ,Trạng Thái,Nhân Viên Xử Lý,Thời Gian Tạo\r\n'
    tickets.forEach(t => {
      csv += `"${t.id}","${t.propertyCode}","${t.residentName}","${t.category}","${t.title.replace(/"/g, '""')}","${t.priority}","${t.status}","${t.assignedStaff}","${t.createdAt}"\r\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `NovaCRM_Building_Operations_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Đã xuất báo cáo Vận hành Tòa nhà & Sự cố cư dân (CSV UTF-8 BOM) thành công!")
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Building2 className="h-64 w-64 text-blue-400 -mt-10 -mr-10" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-blue-600 text-white border-none font-bold text-xs uppercase tracking-wider px-3 py-1 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" /> Phân Hệ 35 / 35 • Building Operations & Resident Services
            </Badge>
            <Badge variant="outline" className="border-emerald-400/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5 bg-emerald-500/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Ban Quản Lý Savills / CBRE Active 24/7 (SLA 99.8%)
            </Badge>
            {isLiveConnected && (
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Live PostgreSQL Engine
              </Badge>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
            <Building2 className="h-8 w-8 text-blue-400" />
            Quản Trị Vận Hành Bất Động Sản & Dịch Vụ Cư Dân
          </h1>
          <p className="text-slate-300 mt-2 text-sm leading-relaxed">
            Trung tâm điều hành tòa nhà, thu phí quản lý định kỳ qua VietQR Pro tự động, cấp phép thi công nội thất, 
            đặt lịch tiện ích Clubhouse 5 sao đặc quyền và tiếp nhận xử lý sự cố kỹ thuật 24/7 cho toàn thể cư dân.
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
            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700"
            onClick={() => setShowFitoutModal(true)}
          >
            <Wrench className="h-4 w-4 mr-1.5 text-amber-400" /> 
            Cấp Phép Thi Công
          </Button>

          <Button 
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30"
            onClick={() => setShowCreateBillModal(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" /> 
            Lập Hóa Đơn Phí
          </Button>
        </div>
      </div>

      {/* 4 MACRO KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Căn Hộ Đang Vận Hành</div>
              <div className="text-2xl font-black text-slate-900">1,248 Căn</div>
              <div className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                <Home className="h-3.5 w-3.5" /> Tỷ lệ lấp đầy: <strong>88.5%</strong>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Thu Phí Dịch Vụ Tháng</div>
              <div className="text-2xl font-black text-emerald-600">3.85 Tỷ VNĐ</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Tỷ lệ thu đúng hạn: <strong>96.2%</strong>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Receipt className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Sự Cố Kỹ Thuật Đang Xử Lý</div>
              <div className="text-2xl font-black text-amber-600">{tickets.filter(t => t.status !== 'Da Xu Ly Xong').length} Sự Cố</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                SLA xử lý trung bình: <strong>45 Phút</strong>
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
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Lượt Đặt Tiện Ích Tuần</div>
              <div className="text-2xl font-black text-purple-700">142 Lượt</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Pickleball, BBQ, Hồ bơi, Lounge
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-xs overflow-x-auto gap-1">
        {[
          { id: 'service_fees', label: 'Hóa Đơn & Thu Phí Dịch Vụ', icon: <Receipt className="h-4 w-4" />, count: bills.length },
          { id: 'fitout', label: 'Cấp Phép Thi Công Nội Thất', icon: <Wrench className="h-4 w-4" />, count: fitouts.length },
          { id: 'amenities', label: 'Đặt Chỗ Tiện Ích Clubhouse', icon: <Sparkles className="h-4 w-4" />, count: bookings.length },
          { id: 'helpdesk', label: 'Tiếp Nhận Sự Cố Cư Dân 24/7', icon: <ShieldAlert className="h-4 w-4" />, count: tickets.filter(t => t.status !== 'Da Xu Ly Xong').length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: HÓA ĐƠN & THU PHÍ DỊCH VỤ (SERVICE FEES & BILLING)
         ========================================================================= */}
      {activeTab === 'service_fees' && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-white pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <Receipt className="h-5 w-5 text-blue-600" />
                  Sổ Hóa Đơn & Thu Phí Quản Lý Tòa Nhà (Tháng 07/2026)
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-1">
                  Biểu phí quản lý (18.000đ/m²), phí trông giữ phương tiện và điện nước theo chỉ số công tơ.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                  onClick={() => setShowCreateBillModal(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Lập Hóa Đơn Mới
                </Button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <Input 
                  placeholder="Tìm theo mã căn, tên cư dân, SĐT..." 
                  className="pl-9 h-9 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                {[
                  { id: 'ALL', label: 'Tất Cả' },
                  { id: 'cho_thanh_toan', label: 'Chờ Thanh Toán' },
                  { id: 'da_thanh_toan', label: 'Đã Đóng Phí' },
                  { id: 'qua_han', label: 'Quá Hạn' }
                ].map(st => (
                  <button
                    key={st.id}
                    onClick={() => setBillStatusFilter(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      billStatusFilter === st.id
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3.5 font-bold">Mã Hóa Đơn & Căn Hộ</th>
                  <th className="p-3.5 font-bold">Chủ Hộ / Cư Dân</th>
                  <th className="p-3.5 font-bold">Chi Tiết Biểu Phí</th>
                  <th className="p-3.5 font-bold">Tổng Tiền (VNĐ)</th>
                  <th className="p-3.5 font-bold text-center">Trạng Thái</th>
                  <th className="p-3.5 font-bold text-right">Thao Tác Thu Phí</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBills.map(bill => (
                  <tr key={bill.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-sm text-blue-700">{bill.propertyCode}</div>
                      <div className="text-[10px] text-slate-500">{bill.projectName}</div>
                      <div className="font-mono text-[10px] text-slate-400 mt-0.5">Số: {bill.id}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{bill.residentName}</div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3 text-slate-400" /> {bill.residentPhone}
                      </div>
                    </td>

                    <td className="p-3.5 space-y-0.5 text-slate-600 font-mono text-[11px]">
                      <div>• Phí QL: <strong>{(bill.managementFee).toLocaleString()}đ</strong></div>
                      <div>• Gửi xe: <strong>{(bill.parkingFee).toLocaleString()}đ</strong></div>
                      <div>• Tiện ích: <strong>{(bill.utilitiesFee).toLocaleString()}đ</strong></div>
                    </td>

                    <td className="p-3.5 font-mono">
                      <div className="font-black text-sm text-slate-900">{(bill.totalAmount).toLocaleString()} VNĐ</div>
                      <div className="text-[10px] text-slate-400">Hạn: {bill.dueDate}</div>
                    </td>

                    <td className="p-3.5 text-center">
                      {bill.status === 'da_thanh_toan' && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-[10px]">
                          Đã Đóng Phí
                        </Badge>
                      )}
                      {bill.status === 'cho_thanh_toan' && (
                        <Badge className="bg-amber-100 text-amber-800 border-none font-bold text-[10px]">
                          Chờ Thanh Toán
                        </Badge>
                      )}
                      {bill.status === 'qua_han' && (
                        <Badge className="bg-rose-100 text-rose-800 border-none font-bold text-[10px]">
                          Quá Hạn Đóng
                        </Badge>
                      )}
                    </td>

                    <td className="p-3.5 text-right space-y-1">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs"
                          onClick={() => setSelectedBillForReceipt(bill)}
                        >
                          <FileText className="h-3.5 w-3.5 mr-1 text-blue-600" /> Biên Lai A4
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs text-slate-500 hover:text-slate-900"
                          onClick={() => handleSendReminder(bill)}
                        >
                          <Send className="h-3.5 w-3.5 mr-1" /> Nhắc Phí
                        </Button>
                        {bill.status !== 'da_thanh_toan' && (
                          <Button 
                            size="sm" 
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            onClick={() => handlePayBill(bill.id)}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Gạch Nợ
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 2: CẤP PHÉP THI CÔNG NỘI THẤT (FITOUT PERMITS)
         ========================================================================= */}
      {activeTab === 'fitout' && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-gradient-to-r from-amber-50/50 to-white pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <Wrench className="h-5 w-5 text-amber-600" />
                  Sổ Cấp Phép Thi Công Nội Thất & Cải Tạo Căn Hộ
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-1">
                  Kiểm soát an toàn PCCC, giờ giấc thi công chống ồn và tiền ký quỹ bảo đảm hoàn trả mặt bằng.
                </CardDescription>
              </div>
              <Button 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                onClick={() => setShowFitoutModal(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Cấp Phép Thi Công Mới
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {fitouts.map(fit => (
              <div key={fit.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/70 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{fit.propertyCode} • {fit.residentName}</span>
                    <Badge className={`text-[10px] ${
                      fit.status === 'dang_thi_cong' ? 'bg-amber-500 text-white' :
                      fit.status === 'cho_duyet' ? 'bg-blue-600 text-white' :
                      fit.status === 'cho_nghiem_thu' ? 'bg-purple-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {fit.status === 'dang_thi_cong' ? 'Đang Thi Công' :
                       fit.status === 'cho_duyet' ? 'Chờ Duyệt Bản Vẽ' :
                       fit.status === 'cho_nghiem_thu' ? 'Chờ Nghiệm Thu' : 'Đã Hoàn Thành'}
                    </Badge>
                  </div>
                  <div className="text-slate-600 font-medium">
                    Nhà thầu: <strong className="text-slate-900">{fit.contractorName}</strong> ({fit.workersCount} công nhân) • SĐT: {fit.contractorPhone}
                  </div>
                  <div className="text-slate-500 flex items-center gap-3">
                    <span>Thời hạn: <strong>{fit.startDate} ➔ {fit.endDate}</strong></span>
                    <span>•</span>
                    <span>Ký quỹ PCCC: <strong className="text-amber-700 font-mono font-bold">{(fit.depositAmount / 1000000).toLocaleString()} Triệu VNĐ</strong></span>
                  </div>
                  <div className="text-[11px] text-slate-400 italic mt-1">{fit.notes}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {fit.status === 'cho_duyet' && (
                    <Button 
                      size="sm" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                      onClick={() => {
                        setFitouts(prev => prev.map(f => f.id === fit.id ? { ...f, status: 'dang_thi_cong' } : f))
                        showToast(`Đã duyệt bản vẽ và phát thẻ thi công cho căn [${fit.propertyCode}]!`)
                      }}
                    >
                      Duyệt Giấy Phép
                    </Button>
                  )}
                  {fit.status === 'cho_nghiem_thu' && (
                    <Button 
                      size="sm" 
                      className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                      onClick={() => {
                        setFitouts(prev => prev.map(f => f.id === fit.id ? { ...f, status: 'da_hoan_thanh', depositRefunded: true } : f))
                        showToast(`Nghiệm thu đạt chuẩn! Đã làm lệnh hoàn trả 50,000,000đ tiền ký quỹ cho căn [${fit.propertyCode}].`)
                      }}
                    >
                      Nghiệm Thu & Hoàn Cọc
                    </Button>
                  )}
                  {fit.status === 'da_hoan_thanh' && (
                    <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" /> Đã hoàn cọc 100%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 3: ĐẶT CHỖ TIỆN ÍCH CLUBHOUSE (AMENITIES)
         ========================================================================= */}
      {activeTab === 'amenities' && (
        <div className="space-y-6">
          {/* Amenity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { name: 'Sân Pickleball VIP', desc: '2 Sân tiêu chuẩn thi đấu quốc tế', hours: '06:00 - 22:00', icon: <Sparkles className="h-5 w-5 text-blue-600" /> },
              { name: 'Tiệc Nướng BBQ Ven Hồ', desc: '6 Chòi nướng ngoài trời sang trọng', hours: '17:00 - 22:00', icon: <Flame className="h-5 w-5 text-amber-600" /> },
              { name: 'Hồ Bơi Chân Mây', desc: 'Hồ bơi tràn viền tầm view 360°', hours: '05:30 - 21:00', icon: <Droplets className="h-5 w-5 text-cyan-600" /> },
              { name: 'Cigar & Lounge VIP', desc: 'Phòng tiếp khách thượng lưu riêng tư', hours: '12:00 - 23:30', icon: <Users className="h-5 w-5 text-purple-600" /> },
            ].map((am, idx) => (
              <Card key={idx} className="shadow-xs border-slate-200 hover:shadow-md transition-all">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-800">{am.name}</span>
                    {am.icon}
                  </div>
                  <p className="text-xs text-slate-500 leading-tight">{am.desc}</p>
                  <div className="text-[11px] font-mono text-slate-600 pt-2 border-t flex justify-between">
                    <span>Mở cửa:</span>
                    <strong>{am.hours}</strong>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-sm border-slate-200">
            <CardHeader className="border-b bg-slate-50 flex flex-row items-center justify-between py-3">
              <CardTitle className="text-sm font-bold text-slate-800">
                Lịch Đặt Chỗ Tiện Ích Hôm Nay & Ngày Mai
              </CardTitle>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                onClick={() => setShowBookAmenityModal(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Đặt Tiện Ích Mới
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y text-xs">
                {bookings.map(bkg => (
                  <div key={bkg.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-bold text-blue-700 bg-blue-50 border-blue-200">
                          {bkg.amenityType}
                        </Badge>
                        <span className="font-bold text-slate-900">{bkg.propertyCode} ({bkg.residentName})</span>
                      </div>
                      <div className="text-slate-500">
                        Khung giờ: <strong className="text-slate-800 font-mono">{bkg.bookingDate} ({bkg.timeSlot})</strong> • Số lượng: {bkg.guestsCount} khách
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={bkg.status === 'da_checkin' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}>
                        {bkg.status === 'da_checkin' ? 'Đã Check-in Sử Dụng' : 'Đã Xác Nhận Slot'}
                      </Badge>
                      {bkg.status !== 'da_checkin' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs h-7"
                          onClick={() => {
                            setBookings(prev => prev.map(b => b.id === bkg.id ? { ...b, status: 'da_checkin' } : b))
                            showToast(`Đã quét QR check-in thành công cho cư dân [${bkg.residentName}]!`)
                          }}
                        >
                          Check-in
                        </Button>
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
          TAB 4: TIẾP NHẬN SỰ CỐ CƯ DÂN 24/7 (RESIDENT HELPDESK)
         ========================================================================= */}
      {activeTab === 'helpdesk' && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-gradient-to-r from-rose-50/50 to-white pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <ShieldAlert className="h-5 w-5 text-rose-600" />
                  Tổng Đài Tiếp Nhận Sự Cố Kỹ Thuật Cư Dân 24/7
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-1">
                  Đồng hồ SLA cam kết xử lý sự cố trong vòng 30 – 120 phút bởi đội ngũ kỹ sư tòa nhà Savills / CBRE.
                </CardDescription>
              </div>
              <Button 
                size="sm" 
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                onClick={() => setShowAddTicketModal(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Khai Báo Sự Cố Mới
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y text-xs">
              {tickets.map(ticket => (
                <div key={ticket.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900 text-sm">{ticket.id} • Căn {ticket.propertyCode}</span>
                      <Badge variant="outline" className="text-[10px] bg-slate-50">{ticket.category}</Badge>
                      <Badge className={`text-[10px] border-none ${
                        ticket.priority === 'Khan Cap' ? 'bg-rose-100 text-rose-800' :
                        ticket.priority === 'Trung Binh' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ticket.priority === 'Khan Cap' ? '🔥 Khẩn Cấp' : ticket.priority}
                      </Badge>
                    </div>
                    <div className="font-semibold text-slate-800">{ticket.title}</div>
                    <div className="text-slate-500">{ticket.description}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>Cư dân: <strong>{ticket.residentName}</strong> ({ticket.residentPhone})</span>
                      <span>•</span>
                      <span>Phân công: <strong>{ticket.assignedStaff}</strong></span>
                      <span>•</span>
                      <span>Thời gian: {ticket.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge className={ticket.status === 'Da Xu Ly Xong' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}>
                      {ticket.status === 'Da Xu Ly Xong' ? 'Đã Xử Lý Xong' : 'Đang Xử Lý (Active)'}
                    </Badge>

                    {ticket.status !== 'Da Xu Ly Xong' ? (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 text-xs font-semibold text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                        onClick={() => handleResolveTicket(ticket.id)}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Hoàn Tất Xử Lý
                      </Button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Khắc phục xong lúc {ticket.resolvedAt}
                      </span>
                    )}
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

      {/* MODAL 1: Lập Hóa Đơn Phí Quản Lý */}
      <Dialog open={showCreateBillModal} onOpenChange={setShowCreateBillModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Receipt className="h-5 w-5 text-blue-600" />
              Lập Hóa Đơn Phí Quản Lý Tòa Nhà Mới
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Tự động tính toán theo đơn giá diện tích thông thủy và số lượng phương tiện.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBillSubmit} className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Mã Căn Hộ *</label>
                <select 
                  value={newBillProp}
                  onChange={(e) => setNewBillProp(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  <option value="NVW-01.01">NVW-01.01 (250m²)</option>
                  <option value="AQC-12A.01">AQC-12A.01 (160m²)</option>
                  <option value="TGM-18.04">TGM-18.04 (115m²)</option>
                  <option value="TGC-LK05">TGC-LK05 (133m²)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Diện Tích Thông Thủy (m²)</label>
                <Input value={newBillArea} onChange={(e) => setNewBillArea(e.target.value)} className="text-xs font-mono" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Tên Cư Dân / Chủ Hộ</label>
              <Input value={newBillResident} onChange={(e) => setNewBillResident(e.target.value)} className="text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Số Xe Ô Tô Đỗ Hầm</label>
                <Input value={newBillParkings} onChange={(e) => setNewBillParkings(e.target.value)} className="text-xs font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Tiền Nước & Rác (VNĐ)</label>
                <Input value={newBillUtilities} onChange={(e) => setNewBillUtilities(e.target.value)} className="text-xs font-mono" />
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border text-[11px] text-blue-900 space-y-1">
              <div>• Đơn giá phí quản lý: <strong>18.000 VNĐ / m² / tháng</strong></div>
              <div>• Phí trông giữ ô tô: <strong>1.200.000 VNĐ / xe / tháng</strong></div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateBillModal(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Tạo Hóa Đơn & Sinh Mã QR
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Đăng Ký Cấp Phép Thi Công Nội Thất */}
      <Dialog open={showFitoutModal} onOpenChange={setShowFitoutModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Wrench className="h-5 w-5 text-amber-600" />
              Đăng Ký Cấp Phép Thi Công Nội Thất
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kiểm tra hồ sơ an toàn PCCC và thu tiền ký quỹ bảo đảm thi công.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFitoutSubmit} className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Mã Căn Hộ *</label>
                <Input value={newFitProp} onChange={(e) => setNewFitProp(e.target.value)} className="text-xs" required />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Chủ Căn Hộ</label>
                <Input value={newFitResident} onChange={(e) => setNewFitResident(e.target.value)} className="text-xs" required />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Tên Đơn Vị Thi Công Nội Thất *</label>
              <Input value={newFitContractor} onChange={(e) => setNewFitContractor(e.target.value)} className="text-xs" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Số Lượng Công Nhân</label>
                <Input value={newFitWorkers} onChange={(e) => setNewFitWorkers(e.target.value)} className="text-xs font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Thời Gian Thi Công (Ngày)</label>
                <Input value={newFitDays} onChange={(e) => setNewFitDays(e.target.value)} className="text-xs font-mono" />
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              Tiền ký quỹ PCCC và vệ sinh hành lang: <strong>50,000,000 VNĐ</strong> (Được hoàn trả 100% sau khi hoàn công và nghiệm thu không gây hư hại kết cấu tòa nhà).
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowFitoutModal(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                Xác Nhận Cấp Phép
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Đặt Tiện Ích Clubhouse */}
      <Dialog open={showBookAmenityModal} onOpenChange={setShowBookAmenityModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Đặt Chỗ Tiện Ích Clubhouse Đặc Quyền
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Dành riêng cho cư dân chính thức tại các đại đô thị Nova CRM.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBookAmenitySubmit} className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Chọn Tiện Ích *</label>
              <select 
                value={newAmenityType}
                onChange={(e) => setNewAmenityType(e.target.value as any)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
              >
                <option value="Sân Pickleball VIP">Sân Pickleball VIP (Miễn phí cư dân)</option>
                <option value="Khu Tiệc Nướng BBQ Ngoài Trời">Khu Tiệc Nướng BBQ Ngoài Trời (Phụ phí dọn dẹp 300K)</option>
                <option value="Hồ Bơi Chân Mây">Hồ Bơi Chân Mây Tầng Thượng (Miễn phí)</option>
                <option value="Phòng Tiệc Cigar & Lounge">Phòng Tiệc Cigar & Lounge VIP (1.5 Triệu/4h)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Mã Căn Hộ *</label>
                <Input value={newAmenityProp} onChange={(e) => setNewAmenityProp(e.target.value)} className="text-xs" required />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Số Lượng Khách</label>
                <Input value={newAmenityGuests} onChange={(e) => setNewAmenityGuests(e.target.value)} className="text-xs font-mono" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Khung Giờ Đặt Chỗ *</label>
              <select 
                value={newAmenitySlot}
                onChange={(e) => setNewAmenitySlot(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
              >
                <option value="08:00 - 10:00">08:00 - 10:00</option>
                <option value="16:00 - 18:00">16:00 - 18:00</option>
                <option value="18:00 - 20:00">18:00 - 20:00</option>
                <option value="20:00 - 22:00">20:00 - 22:00</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowBookAmenityModal(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Xác Nhận Giữ Chỗ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Khai Báo Sự Cố Kỹ Thuật 24/7 */}
      <Dialog open={showAddTicketModal} onOpenChange={setShowAddTicketModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-950">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              Khai Báo Sự Cố Kỹ Thuật Cư Dân (Helpdesk Ticket)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Điều phối kỹ sư trực ban Savills/CBRE xử lý với cam kết thời gian SLA.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTicketSubmit} className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Mã Căn Hộ *</label>
                <Input value={newTicketProp} onChange={(e) => setNewTicketProp(e.target.value)} className="text-xs" required />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Nhóm Sự Cố</label>
                <select 
                  value={newTicketCat}
                  onChange={(e) => setNewTicketCat(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  <option value="Điện nước">Điện nước</option>
                  <option value="Thang máy">Thang máy</option>
                  <option value="Vệ sinh môi trường">Vệ sinh môi trường</option>
                  <option value="An ninh trật tự">An ninh trật tự</option>
                  <option value="Tiếng ồn">Tiếng ồn</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Tiêu Đề Sự Cố *</label>
              <Input value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} className="text-xs" required />
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Mô Tả Hiện Trạng Chi Tiết</label>
              <textarea 
                rows={2}
                value={newTicketDesc}
                onChange={(e) => setNewTicketDesc(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Mức Độ Khẩn Cấp</label>
              <select 
                value={newTicketPriority}
                onChange={(e) => setNewTicketPriority(e.target.value as any)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
              >
                <option value="Binh Thuong">Bình Thường (Xử lý trong 120 phút)</option>
                <option value="Trung Binh">Trung Bình (Xử lý trong 60 phút)</option>
                <option value="Khan Cap">🔥 Khẩn Cấp (Xử lý ngay trong 30 phút)</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddTicketModal(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-bold">
                Phát Lệnh Điều Phối Kỹ Sư
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: BIÊN LAI THU TIỀN ĐIỆN TỬ MẪU A4 */}
      <Dialog open={!!selectedBillForReceipt} onOpenChange={() => setSelectedBillForReceipt(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Receipt className="h-5 w-5 text-blue-600" />
              Phiếu Thu & Hóa Đơn Dịch Vụ Điện Tử (Mẫu A4)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Tra cứu thông tin hóa đơn giá trị gia tăng điện tử hợp lệ.
            </DialogDescription>
          </DialogHeader>

          {selectedBillForReceipt && (
            <div className="p-5 bg-white border rounded-xl shadow-xs space-y-4 text-xs font-serif">
              <div className="text-center border-b pb-3 space-y-1">
                <div className="font-bold text-xs uppercase text-slate-900">BAN QUẢN LÝ TÒA NHÀ NOVA PROPERTY</div>
                <div className="text-[10px] text-slate-500 font-sans">MST: 0312984572 • Hotline: 1900 6868</div>
                <div className="text-sm font-bold uppercase tracking-wider text-blue-950 pt-2 font-sans">
                  HÓA ĐƠN THU PHÍ DỊCH VỤ THÁNG {selectedBillForReceipt.month}
                </div>
                <div className="font-mono text-[10px] text-slate-400">Số HĐ: {selectedBillForReceipt.id}</div>
              </div>

              <div className="space-y-2 font-sans text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Căn hộ:</span>
                  <strong className="text-blue-700">{selectedBillForReceipt.propertyCode} ({selectedBillForReceipt.projectName})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ hộ:</span>
                  <strong>{selectedBillForReceipt.residentName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số điện thoại:</span>
                  <span className="font-mono">{selectedBillForReceipt.residentPhone}</span>
                </div>

                <div className="pt-2 border-t space-y-1 font-mono">
                  <div className="flex justify-between">
                    <span>1. Phí quản lý vận hành:</span>
                    <span>{(selectedBillForReceipt.managementFee).toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2. Phí trông giữ phương tiện:</span>
                    <span>{(selectedBillForReceipt.parkingFee).toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3. Tiền nước & xử lý rác:</span>
                    <span>{(selectedBillForReceipt.utilitiesFee).toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-black text-sm text-slate-900">
                    <span>TỔNG THANH TOÁN:</span>
                    <span className="text-blue-700">{(selectedBillForReceipt.totalAmount).toLocaleString()} VNĐ</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border flex items-center justify-between mt-3 font-sans">
                  <div>
                    <div className="text-[10px] text-slate-400">Trạng thái thanh toán:</div>
                    <div className="font-bold text-emerald-600">
                      {selectedBillForReceipt.status === 'da_thanh_toan' ? 'ĐÃ THANH TOÁN THÀNH CÔNG' : 'CHỜ THANH TOÁN'}
                    </div>
                    {selectedBillForReceipt.paidDate && (
                      <div className="text-[10px] text-slate-500">Ngày TT: {selectedBillForReceipt.paidDate} ({selectedBillForReceipt.paymentMethod})</div>
                    )}
                  </div>
                  <div className="h-10 w-10 bg-white border rounded flex items-center justify-center">
                    <QrCode className="h-8 w-8 text-slate-800" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" onClick={() => setSelectedBillForReceipt(null)}>
              Đóng Cửa Sổ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
