"use client"
import React, { useState } from 'react'
import {
  RefreshCw, Home, Search, Filter, Plus, Calendar, Clock, Key,
  CheckCircle, FileText, ArrowRight, ShieldCheck, DollarSign,
  TrendingUp, Users, Eye, Sparkles, Send, Download, Phone,
  X, Check, AlertCircle, Building2, MapPin, BadgeCheck, Lock,
  ChevronRight, ArrowUpRight, Share2, Printer
} from 'lucide-react'
import {
  ResaleListingItem, ClientDemandItem, ShowingScheduleItem,
  ResaleClosingDealItem, ResaleListingType, ResaleListingStatus
} from '@/types'

// Mock Data Khởi Tạo Đầy Đủ
const initialListings: ResaleListingItem[] = [
  {
    id: 'resale-1',
    listingCode: 'KGB-TGM-1502',
    type: 'resale',
    projectName: 'The Grand Manhattan',
    propertyCode: 'TGM-15.02',
    propertyType: 'Căn hộ cao cấp',
    ownerName: 'Trần Văn Mạnh',
    ownerPhone: '0912.334.889',
    area: 96,
    bedrooms: 3,
    bathrooms: 2,
    direction: 'Đông Nam (View Bến Vân Đồn & Q1)',
    askingPrice: 18500000000,
    targetNetPrice: 18000000000,
    commissionRate: 1.5,
    commissionAmount: 277500000,
    legalStatus: 'Sổ hồng riêng',
    furnishedStatus: 'Full nội thất cao cấp 5★',
    keyStatus: 'Sàn giữ chìa Master',
    status: 'active',
    exclusiveContract: true,
    exclusiveEndDate: '2026-11-30',
    viewCount: 342,
    showingCount: 12,
    matchedLeadsCount: 8,
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-09-15'
  },
  {
    id: 'resale-2',
    listingCode: 'KGB-AQC-PH10',
    type: 'resale',
    projectName: 'Aqua City',
    propertyCode: 'AQC-PH-10',
    propertyType: 'Biệt thự song lập',
    ownerName: 'Nguyễn Thị Bích Phượng',
    ownerPhone: '0908.776.223',
    area: 240,
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Nam (View công viên ven sông)',
    askingPrice: 15800000000,
    targetNetPrice: 15300000000,
    commissionRate: 2.0,
    commissionAmount: 316000000,
    legalStatus: 'HĐMB công chứng',
    furnishedStatus: 'Nhà thô CĐT',
    keyStatus: 'Chủ giữ chìa (Hẹn trước)',
    status: 'active',
    exclusiveContract: true,
    exclusiveEndDate: '2026-12-15',
    viewCount: 520,
    showingCount: 18,
    matchedLeadsCount: 14,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-09-10'
  },
  {
    id: 'resale-3',
    listingCode: 'KGT-TGC-SH05',
    type: 'rental',
    projectName: 'The Global City',
    propertyCode: 'TGC-SOHO-05',
    propertyType: 'Nhà phố thương mại',
    ownerName: 'Lê Hoàng Nam',
    ownerPhone: '0933.889.001',
    area: 350,
    bedrooms: 5,
    bathrooms: 6,
    direction: 'Tây Bắc (Mặt tiền Đỗ Xuân Hợp)',
    askingPrice: 85000000,
    targetNetPrice: 85000000,
    commissionRate: 100, // 1 tháng tiền thuê
    commissionAmount: 85000000,
    legalStatus: 'HĐMB công chứng',
    furnishedStatus: 'Full nội thất cao cấp 5★',
    keyStatus: 'Smartlock Passcode',
    smartlockCode: '889912',
    status: 'active',
    exclusiveContract: true,
    exclusiveEndDate: '2026-11-20',
    viewCount: 610,
    showingCount: 22,
    matchedLeadsCount: 15,
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-09-18'
  },
  {
    id: 'resale-4',
    listingCode: 'KGT-TGM-0804',
    type: 'rental',
    projectName: 'The Grand Manhattan',
    propertyCode: 'TGM-08.04',
    propertyType: 'Căn hộ cao cấp',
    ownerName: 'Phạm Thu Hằng',
    ownerPhone: '0978.223.114',
    area: 72,
    bedrooms: 2,
    bathrooms: 2,
    direction: 'Đông (View Bitexco)',
    askingPrice: 32000000,
    targetNetPrice: 32000000,
    commissionRate: 100,
    commissionAmount: 32000000,
    legalStatus: 'Sổ hồng riêng',
    furnishedStatus: 'Full nội thất cao cấp 5★',
    keyStatus: 'Sàn giữ chìa Master',
    status: 'active',
    exclusiveContract: false,
    viewCount: 280,
    showingCount: 9,
    matchedLeadsCount: 11,
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-09-22'
  },
  {
    id: 'resale-5',
    listingCode: 'KGB-NVW-FL08',
    type: 'resale',
    projectName: 'NovaWorld Phan Thiết',
    propertyCode: 'NVW-FL-08',
    propertyType: 'Biệt thự song lập',
    ownerName: 'Võ Minh Trí',
    ownerPhone: '0989.445.667',
    area: 200,
    bedrooms: 3,
    bathrooms: 3,
    direction: 'Đông (Trực diện biển)',
    askingPrice: 9800000000,
    targetNetPrice: 9500000000,
    commissionRate: 2.0,
    commissionAmount: 196000000,
    legalStatus: 'Sổ hồng riêng',
    furnishedStatus: 'Full nội thất cao cấp 5★',
    keyStatus: 'Smartlock Passcode',
    smartlockCode: '445566',
    status: 'under_offer',
    exclusiveContract: true,
    exclusiveEndDate: '2026-10-31',
    viewCount: 410,
    showingCount: 14,
    matchedLeadsCount: 9,
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-09-05'
  },
  {
    id: 'resale-6',
    listingCode: 'KGB-EGS-1206',
    type: 'resale',
    projectName: 'Eco Green Saigon',
    propertyCode: 'EGS-HR2-12.06',
    propertyType: 'Căn hộ cao cấp',
    ownerName: 'Đặng Ngọc Quyên',
    ownerPhone: '0903.112.998',
    area: 65,
    bedrooms: 2,
    bathrooms: 2,
    direction: 'Tây Nam (View Công viên Hương Tràm)',
    askingPrice: 4850000000,
    targetNetPrice: 4700000000,
    commissionRate: 1.5,
    commissionAmount: 72750000,
    legalStatus: 'Sổ hồng riêng',
    furnishedStatus: 'Full nội thất cao cấp 5★',
    keyStatus: 'Sàn giữ chìa Master',
    status: 'active',
    exclusiveContract: false,
    viewCount: 190,
    showingCount: 7,
    matchedLeadsCount: 16,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
    createdAt: '2026-09-25'
  }
]

const initialDemands: ClientDemandItem[] = [
  {
    id: 'dem-1',
    clientName: 'Trần Đình Trọng',
    clientPhone: '0918.456.789',
    demandType: 'resale',
    targetProjects: ['The Grand Manhattan'],
    minPrice: 17000000000,
    maxPrice: 20000000000,
    bedrooms: 3,
    purpose: 'Ở thực',
    urgency: 'Cần gấp trong tuần 🔥',
    assignedAgent: 'Nguyễn Trần Tuấn Tú',
    matchingScore: 98,
    suggestedListingCode: 'KGB-TGM-1502',
    createdAt: '2026-09-28'
  },
  {
    id: 'dem-2',
    clientName: 'Hoàng Kim Ngân',
    clientPhone: '0903.882.119',
    demandType: 'rental',
    targetProjects: ['The Global City'],
    minPrice: 70000000,
    maxPrice: 90000000,
    bedrooms: 4,
    purpose: 'Kinh doanh văn phòng',
    urgency: 'Cần gấp trong tuần 🔥',
    assignedAgent: 'Lê Hoàng Anh',
    matchingScore: 95,
    suggestedListingCode: 'KGT-TGC-SH05',
    createdAt: '2026-09-27'
  },
  {
    id: 'dem-3',
    clientName: 'Vũ Đình Thục',
    clientPhone: '0982.334.556',
    demandType: 'resale',
    targetProjects: ['Aqua City', 'NovaWorld Phan Thiết'],
    minPrice: 14000000000,
    maxPrice: 16500000000,
    bedrooms: 4,
    purpose: 'Đầu tư cho thuê',
    urgency: 'Trong tháng này',
    assignedAgent: 'Phạm Thị Mai',
    matchingScore: 92,
    suggestedListingCode: 'KGB-AQC-PH10',
    createdAt: '2026-09-24'
  },
  {
    id: 'dem-4',
    clientName: 'David Zhang (Expat)',
    clientPhone: '0934.112.334',
    demandType: 'rental',
    targetProjects: ['The Grand Manhattan', 'Eco Green Saigon'],
    minPrice: 28000000,
    maxPrice: 35000000,
    bedrooms: 2,
    purpose: 'Ở thực',
    urgency: 'Trong tháng này',
    assignedAgent: 'Nguyễn Trần Tuấn Tú',
    matchingScore: 94,
    suggestedListingCode: 'KGT-TGM-0804',
    createdAt: '2026-09-26'
  }
]

const initialShowings: ShowingScheduleItem[] = [
  {
    id: 'shw-1',
    listingId: 'resale-1',
    propertyCode: 'TGM-15.02',
    projectName: 'The Grand Manhattan',
    clientName: 'Trần Đình Trọng',
    clientPhone: '0918.456.789',
    showingDate: '2026-10-02',
    showingTime: '15:30',
    assignedAgent: 'Nguyễn Trần Tuấn Tú',
    keyHolder: 'Sàn giữ chìa (Hộp Master 04)',
    clientFeedback: 'Khách đi cùng vợ, xem kỹ hướng ban công và pháp lý sổ hồng.',
    status: 'scheduled'
  },
  {
    id: 'shw-2',
    listingId: 'resale-3',
    propertyCode: 'TGC-SOHO-05',
    projectName: 'The Global City',
    clientName: 'Hoàng Kim Ngân',
    clientPhone: '0903.882.119',
    showingDate: '2026-10-02',
    showingTime: '17:00',
    assignedAgent: 'Lê Hoàng Anh',
    keyHolder: 'Passcode Smartlock 889912',
    clientFeedback: 'Khách kiểm tra độ rộng vỉa hè mở Cafe sang trọng.',
    status: 'scheduled'
  },
  {
    id: 'shw-3',
    listingId: 'resale-2',
    propertyCode: 'AQC-PH-10',
    projectName: 'Aqua City',
    clientName: 'Vũ Đình Thục',
    clientPhone: '0982.334.556',
    showingDate: '2026-10-01',
    showingTime: '10:00',
    assignedAgent: 'Phạm Thị Mai',
    keyHolder: 'Chủ nhà mở cửa đón tiếp',
    clientFeedback: 'Rất ưng view sông thoáng mát, đã trả giá 15.2 Tỷ VNĐ.',
    status: 'made_offer'
  },
  {
    id: 'shw-4',
    listingId: 'resale-4',
    propertyCode: 'TGM-08.04',
    projectName: 'The Grand Manhattan',
    clientName: 'David Zhang (Expat)',
    clientPhone: '0934.112.334',
    showingDate: '2026-09-30',
    showingTime: '14:00',
    assignedAgent: 'Nguyễn Trần Tuấn Tú',
    keyHolder: 'Sàn giữ chìa Master',
    clientFeedback: 'Hài lòng gói nội thất, xin dự thảo hợp đồng thuê song ngữ.',
    status: 'completed'
  }
]

const initialClosings: ResaleClosingDealItem[] = [
  {
    id: 'deal-1',
    dealCode: 'DEAL-TS-2026-08',
    listingId: 'resale-old-1',
    propertyCode: 'TGM-18.06',
    projectName: 'The Grand Manhattan',
    sellerName: 'Đỗ Minh Quân',
    sellerPhone: '0913.555.221',
    buyerName: 'Phạm Thu Hà',
    buyerPhone: '0988.667.123',
    dealType: 'resale',
    finalPrice: 17200000000,
    depositAmount: 500000000,
    commissionAmount: 258000000, // 1.5%
    commissionAgent: 129000000, // 50%
    commissionCompany: 129000000, // 50%
    depositDate: '2026-09-25',
    notaryDate: '2026-10-10',
    status: 'deposit_placed',
    notaryOffice: 'Văn phòng Công chứng Sài Gòn (Số 12 Lê Duẩn, Q1)'
  },
  {
    id: 'deal-2',
    dealCode: 'DEAL-TS-2026-09',
    listingId: 'resale-old-2',
    propertyCode: 'AQC-SH-02',
    projectName: 'Aqua City',
    sellerName: 'Nguyễn Thanh Sơn',
    sellerPhone: '0903.444.888',
    buyerName: 'Trương Quang Khải',
    buyerPhone: '0977.112.334',
    dealType: 'resale',
    finalPrice: 12500000000,
    depositAmount: 1000000000,
    commissionAmount: 250000000, // 2%
    commissionAgent: 125000000,
    commissionCompany: 125000000,
    depositDate: '2026-09-18',
    notaryDate: '2026-09-28',
    status: 'notarized',
    notaryOffice: 'Văn phòng Công chứng Biên Hòa (Đồng Nai)'
  },
  {
    id: 'deal-3',
    dealCode: 'DEAL-TS-2026-10',
    listingId: 'resale-old-3',
    propertyCode: 'TGC-LK-12',
    projectName: 'The Global City',
    sellerName: 'Lê Thị Cúc',
    sellerPhone: '0938.999.112',
    buyerName: 'Cty TNHH Apex Holdings',
    buyerPhone: '028.3822.9988',
    dealType: 'rental',
    finalPrice: 75000000,
    depositAmount: 225000000, // Cọc 3 tháng
    commissionAmount: 75000000, // 100% 1 tháng tiền thuê
    commissionAgent: 37500000,
    commissionCompany: 37500000,
    depositDate: '2026-09-22',
    notaryDate: '2026-09-22',
    status: 'completed',
    notaryOffice: 'Văn phòng Ban Quản Lý The Global City'
  }
]

export default function ResalePage() {
  const [activeTab, setActiveTab] = useState<'listings' | 'demands' | 'showings' | 'closings'>('listings')
  const [listings, setListings] = useState<ResaleListingItem[]>(initialListings)
  const [demands, setDemands] = useState<ClientDemandItem[]>(initialDemands)
  const [showings, setShowings] = useState<ShowingScheduleItem[]>(initialShowings)
  const [closings, setClosings] = useState<ResaleClosingDealItem[]>(initialClosings)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'resale' | 'rental' | 'exclusive'>('all')
  const [projectFilter, setProjectFilter] = useState('all')

  // Modals state
  const [showConsignmentModal, setShowConsignmentModal] = useState(false)
  const [showDemandModal, setShowDemandModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedListingForSchedule, setSelectedListingForSchedule] = useState<ResaleListingItem | null>(null)
  const [selectedListingForAgreement, setSelectedListingForAgreement] = useState<ResaleListingItem | null>(null)
  const [selectedDealForDeposit, setSelectedDealForDeposit] = useState<ResaleClosingDealItem | null>(null)
  const [selectedMatchListing, setSelectedMatchListing] = useState<ResaleListingItem | null>(null)

  // Form States
  const [newListingForm, setNewListingForm] = useState({
    ownerName: '',
    ownerPhone: '',
    projectName: 'The Grand Manhattan',
    propertyCode: '',
    propertyType: 'Căn hộ cao cấp' as const,
    type: 'resale' as ResaleListingType,
    area: 85,
    bedrooms: 2,
    bathrooms: 2,
    direction: 'Đông Nam',
    askingPrice: 12000000000,
    targetNetPrice: 11800000000,
    commissionRate: 1.5,
    legalStatus: 'Sổ hồng riêng' as const,
    furnishedStatus: 'Full nội thất cao cấp 5★' as const,
    keyStatus: 'Sàn giữ chìa Master' as const,
    exclusiveContract: true
  })

  const [newDemandForm, setNewDemandForm] = useState({
    clientName: '',
    clientPhone: '',
    demandType: 'resale' as ResaleListingType,
    targetProject: 'The Grand Manhattan',
    minPrice: 10000000000,
    maxPrice: 15000000000,
    bedrooms: 2,
    purpose: 'Ở thực' as const,
    urgency: 'Cần gấp trong tuần 🔥' as const,
    assignedAgent: 'Nguyễn Trần Tuấn Tú'
  })

  const [newScheduleForm, setNewScheduleForm] = useState({
    clientName: '',
    clientPhone: '',
    showingDate: '2026-10-03',
    showingTime: '14:30',
    assignedAgent: 'Nguyễn Trần Tuấn Tú',
    notes: ''
  })

  // Format Helpers
  const formatVND = (num: number) => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)} Tỷ VNĐ`
    }
    return `${(num / 1000000).toLocaleString('vi-VN')} Triệu VNĐ`
  }

  // Filter listings
  const filteredListings = listings.filter(item => {
    const matchesSearch = item.listingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.propertyCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' ? true :
                        typeFilter === 'exclusive' ? item.exclusiveContract :
                        item.type === typeFilter
    const matchesProject = projectFilter === 'all' || item.projectName === projectFilter
    return matchesSearch && matchesType && matchesProject
  })

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = '\uFEFF' // UTF-8 BOM
    if (activeTab === 'listings') {
      csvContent += 'Mã Ký Gửi,Dự Án,Mã Căn,Loại Hình,Chủ Sở Hữu,SĐT,Diện Tích m2,Số PN,Giá Niêm Yết,Giá Thu Về Net,Hoa Hồng Sàn,Pháp Lý,Nội Thất,Chìa Khóa,Trạng Thái\n'
      filteredListings.forEach(l => {
        csvContent += `"${l.listingCode}","${l.projectName}","${l.propertyCode}","${l.type === 'resale' ? 'Bán Chuyển Nhượng' : 'Cho Thuê'}","${l.ownerName}","${l.ownerPhone}",${l.area},${l.bedrooms},"${l.askingPrice}","${l.targetNetPrice}","${l.commissionAmount}","${l.legalStatus}","${l.furnishedStatus}","${l.keyStatus}","${l.status}"\n`
      })
    } else if (activeTab === 'demands') {
      csvContent += 'Mã Nhu Cầu,Khách Hàng,Số Điện Thoại,Nhu Cầu,Dự Án,Ngân Sách Tối Thiểu,Ngân Sách Tối Đa,Số PN,Mục Đích,Độ Cấp Bách,Điểm Match AI,Sale Phụ Trách\n'
      demands.forEach(d => {
        csvContent += `"${d.id}","${d.clientName}","${d.clientPhone}","${d.demandType === 'resale' ? 'Mua' : 'Thuê'}","${d.targetProjects.join('; ')}",${d.minPrice},${d.maxPrice},${d.bedrooms},"${d.purpose}","${d.urgency}",${d.matchingScore}%,"${d.assignedAgent}"\n`
      })
    } else if (activeTab === 'showings') {
      csvContent += 'Mã Lịch,Căn Hộ,Dự Án,Khách Hàng,SĐT,Ngày Xem,Giờ Xem,Sale Dẫn Khách,Nguồn Chìa,Trạng Thái,Ghi Chú Phản Hồi\n'
      showings.forEach(s => {
        csvContent += `"${s.id}","${s.propertyCode}","${s.projectName}","${s.clientName}","${s.clientPhone}","${s.showingDate}","${s.showingTime}","${s.assignedAgent}","${s.keyHolder}","${s.status}","${s.clientFeedback || ''}"\n`
      })
    } else {
      csvContent += 'Mã Deal,Căn Hộ,Dự Án,Bên Bán,Bên Mua,Loại Giao Dịch,Giá Chốt,Tiền Đặt Cọc,Tổng Hoa Hồng,Sale Nhận (50%),Sàn Nhận (50%),Ngày Cọc,Ngày Công Chứng,Trạng Thái\n'
      closings.forEach(c => {
        csvContent += `"${c.dealCode}","${c.propertyCode}","${c.projectName}","${c.sellerName}","${c.buyerName}","${c.dealType === 'resale' ? 'Chuyển Nhượng' : 'Cho Thuê'}",${c.finalPrice},${c.depositAmount},${c.commissionAmount},${c.commissionAgent},${c.commissionCompany},"${c.depositDate}","${c.notaryDate}","${c.status}"\n`
      })
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `NovaCRM_So_Ky_Gui_Thu_Cap_${activeTab}_${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Handle Add Consignment
  const handleCreateConsignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListingForm.ownerName || !newListingForm.propertyCode) return
    const commAmt = newListingForm.type === 'resale'
      ? (newListingForm.askingPrice * newListingForm.commissionRate) / 100
      : newListingForm.askingPrice // 1 tháng tiền thuê
    const newListing: ResaleListingItem = {
      id: `resale-${Date.now()}`,
      listingCode: `KG${newListingForm.type === 'resale' ? 'B' : 'T'}-${newListingForm.propertyCode.replace(/[^a-zA-Z0-9]/g, '')}`,
      type: newListingForm.type,
      projectName: newListingForm.projectName,
      propertyCode: newListingForm.propertyCode,
      propertyType: newListingForm.propertyType,
      ownerName: newListingForm.ownerName,
      ownerPhone: newListingForm.ownerPhone,
      area: Number(newListingForm.area),
      bedrooms: Number(newListingForm.bedrooms),
      bathrooms: Number(newListingForm.bathrooms),
      direction: newListingForm.direction,
      askingPrice: Number(newListingForm.askingPrice),
      targetNetPrice: Number(newListingForm.targetNetPrice),
      commissionRate: Number(newListingForm.commissionRate),
      commissionAmount: commAmt,
      legalStatus: newListingForm.legalStatus,
      furnishedStatus: newListingForm.furnishedStatus,
      keyStatus: newListingForm.keyStatus,
      status: 'active',
      exclusiveContract: newListingForm.exclusiveContract,
      exclusiveEndDate: newListingForm.exclusiveContract ? '2026-12-31' : undefined,
      viewCount: 1,
      showingCount: 0,
      matchedLeadsCount: 3,
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60',
      createdAt: new Date().toISOString().slice(0, 10)
    }
    setListings([newListing, ...listings])
    setShowConsignmentModal(false)
    setNewListingForm({
      ownerName: '',
      ownerPhone: '',
      projectName: 'The Grand Manhattan',
      propertyCode: '',
      propertyType: 'Căn hộ cao cấp',
      type: 'resale',
      area: 85,
      bedrooms: 2,
      bathrooms: 2,
      direction: 'Đông Nam',
      askingPrice: 12000000000,
      targetNetPrice: 11800000000,
      commissionRate: 1.5,
      legalStatus: 'Sổ hồng riêng',
      furnishedStatus: 'Full nội thất cao cấp 5★',
      keyStatus: 'Sàn giữ chìa Master',
      exclusiveContract: true
    })
  }

  // Handle Add Demand
  const handleCreateDemand = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDemandForm.clientName || !newDemandForm.clientPhone) return
    const newDem: ClientDemandItem = {
      id: `dem-${Date.now()}`,
      clientName: newDemandForm.clientName,
      clientPhone: newDemandForm.clientPhone,
      demandType: newDemandForm.demandType,
      targetProjects: [newDemandForm.targetProject],
      minPrice: Number(newDemandForm.minPrice),
      maxPrice: Number(newDemandForm.maxPrice),
      bedrooms: Number(newDemandForm.bedrooms),
      purpose: newDemandForm.purpose,
      urgency: newDemandForm.urgency,
      assignedAgent: newDemandForm.assignedAgent,
      matchingScore: 96,
      suggestedListingCode: 'KGB-TGM-1502',
      createdAt: new Date().toISOString().slice(0, 10)
    }
    setDemands([newDem, ...demands])
    setShowDemandModal(false)
    setNewDemandForm({
      clientName: '',
      clientPhone: '',
      demandType: 'resale',
      targetProject: 'The Grand Manhattan',
      minPrice: 10000000000,
      maxPrice: 15000000000,
      bedrooms: 2,
      purpose: 'Ở thực',
      urgency: 'Cần gấp trong tuần 🔥',
      assignedAgent: 'Nguyễn Trần Tuấn Tú'
    })
  }

  // Handle Add Showing Schedule
  const handleCreateShowing = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedListingForSchedule || !newScheduleForm.clientName) return
    const newShw: ShowingScheduleItem = {
      id: `shw-${Date.now()}`,
      listingId: selectedListingForSchedule.id,
      propertyCode: selectedListingForSchedule.propertyCode,
      projectName: selectedListingForSchedule.projectName,
      clientName: newScheduleForm.clientName,
      clientPhone: newScheduleForm.clientPhone,
      showingDate: newScheduleForm.showingDate,
      showingTime: newScheduleForm.showingTime,
      assignedAgent: newScheduleForm.assignedAgent,
      keyHolder: selectedListingForSchedule.keyStatus,
      clientFeedback: newScheduleForm.notes || 'Hẹn xem nhà theo lịch đã xác nhận.',
      status: 'scheduled'
    }
    setShowings([newShw, ...showings])
    setShowScheduleModal(false)
    setSelectedListingForSchedule(null)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <RefreshCw className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sàn Ký Gửi & Thị Trường Thứ Cấp
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Chuyển Nhượng & Cho Thuê
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Trung tâm kết nối ký gửi độc quyền, thẩm định giá CMA, so khớp nhu cầu mua/thuê AI và quản lý chìa khóa xem nhà thực tế.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowDemandModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          >
            <Users className="h-4 w-4 text-indigo-500" />
            Thêm Nhu Cầu Mua/Thuê
          </button>

          <button
            onClick={() => setShowConsignmentModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Tiếp Nhận Ký Gửi Mới
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            title="Xuất Excel/CSV UTF-8 BOM"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            Xuất CSV
          </button>
        </div>
      </div>

      {/* 4 Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rổ Hàng Ký Gửi Đang Mở</span>
            <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <Home className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">156 Căn</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              62% Độc quyền
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Bán chuyển nhượng: 108 • Cho thuê: 48</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Giá Trị Ký Gửi (GMV)</span>
            <span className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">1,420 Tỷ VNĐ</span>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              +22.4% MoM
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Giá trị trung bình: 9.1 Tỷ / căn</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nhu Cầu Khách Đang Khớp</span>
            <span className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">84 Hồ Sơ</span>
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
              Tương thích 91.5%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">26 Khách cần mua/thuê gấp trong tuần</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Hoa Hồng Thứ Cấp Tháng Này</span>
            <span className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
              <DollarSign className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">1.85 Tỷ VNĐ</span>
            <span className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
              12 Deals chốt
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Chi trả Sale 50% • Quỹ sàn 50%</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'listings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className="h-4 w-4" />
          Nguồn Hàng Ký Gửi ({listings.length})
        </button>

        <button
          onClick={() => setActiveTab('demands')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'demands'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          Nhu Cầu Mua / Thuê & AI Match ({demands.length})
        </button>

        <button
          onClick={() => setActiveTab('showings')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'showings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Key className="h-4 w-4 text-emerald-500" />
          Sổ Chìa Khóa & Dẫn Khách ({showings.length})
        </button>

        <button
          onClick={() => setActiveTab('closings')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'closings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <CheckCircle className="h-4 w-4 text-indigo-500" />
          Chốt Deal & Hoa Hồng Thứ Cấp ({closings.length})
        </button>
      </div>

      {/* TAB 1: NGUỒN HÀNG KÝ GỬI */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm mã căn, mã ký gửi, tên chủ nhà, dự án..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Tất cả ({listings.length})
                </button>
                <button
                  onClick={() => setTypeFilter('resale')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'resale' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Bán Lại ({listings.filter(l => l.type === 'resale').length})
                </button>
                <button
                  onClick={() => setTypeFilter('rental')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'rental' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Cho Thuê ({listings.filter(l => l.type === 'rental').length})
                </button>
                <button
                  onClick={() => setTypeFilter('exclusive')}
                  className={`px-3 py-1.5 rounded-md transition-colors ${typeFilter === 'exclusive' ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs font-semibold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                  Độc Quyền ({listings.filter(l => l.exclusiveContract).length})
                </button>
              </div>

              <select
                value={projectFilter}
                onChange={e => setProjectFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="all">Tất cả dự án</option>
                <option value="The Grand Manhattan">The Grand Manhattan</option>
                <option value="Aqua City">Aqua City</option>
                <option value="The Global City">The Global City</option>
                <option value="NovaWorld Phan Thiết">NovaWorld Phan Thiết</option>
                <option value="Eco Green Saigon">Eco Green Saigon</option>
              </select>
            </div>
          </div>

          {/* Listings Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredListings.map(item => (
              <div
                key={item.id}
                className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 shadow-xs hover:shadow-md"
              >
                {/* Image & Badges */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.propertyCode}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg shadow-sm backdrop-blur-md ${
                      item.type === 'resale'
                        ? 'bg-indigo-600/90 text-white'
                        : 'bg-emerald-600/90 text-white'
                    }`}>
                      {item.type === 'resale' ? 'CHUYỂN NHƯỢNG' : 'CHO THUÊ'}
                    </span>
                    {item.exclusiveContract && (
                      <span className="px-2 py-1 text-xs font-bold rounded-lg bg-amber-500/90 text-white shadow-sm flex items-center gap-1">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        ĐỘC QUYỀN
                      </span>
                    )}
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg backdrop-blur-md ${
                      item.status === 'active'
                        ? 'bg-slate-900/70 text-emerald-400'
                        : 'bg-rose-900/80 text-rose-200'
                    }`}>
                      {item.status === 'active' ? 'Đang Mở Ký Gửi' : 'Đang Cọc / Tạm Khóa'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg">
                    <span className="font-semibold text-amber-300">{item.projectName}</span>
                    <span className="font-mono font-bold">{item.propertyCode}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Price and Commission */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-xs text-slate-500">Giá Niêm Yết:</span>
                        <div className="text-xl font-black text-rose-600 dark:text-rose-400">
                          {formatVND(item.askingPrice)}
                          {item.type === 'rental' && <span className="text-xs text-slate-500 font-normal"> /tháng</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500">Hoa hồng sàn:</span>
                        <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {item.type === 'resale' ? `${item.commissionRate}% (${formatVND(item.commissionAmount)})` : `1 Tháng (${formatVND(item.commissionAmount)})`}
                        </div>
                      </div>
                    </div>

                    {/* Specifications */}
                    <div className="mt-3 grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                      <div>
                        <span className="text-slate-400 block">Diện tích:</span>
                        <span className="font-semibold">{item.area} m²</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Phòng ngủ:</span>
                        <span className="font-semibold">{item.bedrooms} PN • {item.bathrooms} WC</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Hướng:</span>
                        <span className="font-semibold truncate block" title={item.direction}>{item.direction}</span>
                      </div>
                    </div>

                    {/* Owner & Legal */}
                    <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          Chủ nhà: <strong className="text-slate-800 dark:text-slate-200">{item.ownerName}</strong>
                        </span>
                        <span className="text-slate-400">{item.ownerPhone}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
                          Pháp lý: <strong className="text-slate-700 dark:text-slate-300">{item.legalStatus}</strong>
                        </span>
                        <span className="text-slate-400">{item.furnishedStatus}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Key className="h-3.5 w-3.5 text-amber-500" />
                          Chìa khóa: <strong className="text-slate-700 dark:text-slate-300">{item.keyStatus}</strong>
                        </span>
                        {item.smartlockCode && (
                          <span className="font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-600 px-1.5 py-0.5 rounded text-[11px]">
                            Mã: {item.smartlockCode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Smart Match Banner */}
                  <div className="flex items-center justify-between bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/40 px-3 py-2 rounded-lg text-xs">
                    <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-medium">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      {item.matchedLeadsCount} Khách mua/thuê đang khớp
                    </span>
                    <button
                      onClick={() => setSelectedMatchListing(item)}
                      className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                    >
                      Xem Khách <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedListingForAgreement(item)}
                      className="flex-1 py-1.5 px-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      HĐ Ký Gửi A4
                    </button>

                    <button
                      onClick={() => {
                        setSelectedListingForSchedule(item)
                        setShowScheduleModal(true)
                      }}
                      className="flex-1 py-1.5 px-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Lên Lịch Xem Nhà
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NHU CẦU MUA / THUÊ & AI MATCHING */}
      {activeTab === 'demands' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-amber-500/10 to-transparent border border-indigo-200 dark:border-indigo-800/40">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Bộ Máy So Khớp Tự Động AI Smart Matcher (CMA & Lead-to-Listing)
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
              Hệ thống tự động phân tích tầm tài chính, phân khúc, hướng ban công và mục đích sử dụng của khách hàng trong CRM để đề xuất ngay những bất động sản ký gửi thứ cấp phù hợp nhất với xác suất chốt cọc cao nhất.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Khách Hàng & Nhu Cầu</th>
                  <th className="px-4 py-3.5">Dự Án Nhắm Tới</th>
                  <th className="px-4 py-3.5">Khoảng Ngân Sách</th>
                  <th className="px-4 py-3.5">Cấu Hình Cần Mua/Thuê</th>
                  <th className="px-4 py-3.5">Độ Cấp Bách</th>
                  <th className="px-4 py-3.5 text-center">Độ Phù Hợp AI</th>
                  <th className="px-4 py-3.5 text-right">Tác Vụ Chuyên Viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {demands.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {d.clientName}
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                          d.demandType === 'resale' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        }`}>
                          {d.demandType === 'resale' ? 'Mua Lại' : 'Thuê Nhà'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <Phone className="h-3 w-3" /> {d.clientPhone} • Sale: {d.assignedAgent}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {d.targetProjects.join(', ')}
                    </td>
                    <td className="px-4 py-3.5 font-bold text-rose-600 dark:text-rose-400">
                      {formatVND(d.minPrice)} - {formatVND(d.maxPrice)}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                      <div><strong className="text-slate-800 dark:text-slate-200">{d.bedrooms} Phòng ngủ</strong></div>
                      <div>Mục đích: {d.purpose}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        d.urgency.includes('gấp')
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {d.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800/50">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        {d.matchingScore}%
                      </div>
                      {d.suggestedListingCode && (
                        <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono mt-1 font-semibold">
                          Khớp: {d.suggestedListingCode}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const found = listings.find(l => l.listingCode === d.suggestedListingCode)
                            if (found) {
                              setSelectedListingForSchedule(found)
                              setNewScheduleForm(prev => ({
                                ...prev,
                                clientName: d.clientName,
                                clientPhone: d.clientPhone,
                                assignedAgent: d.assignedAgent
                              }))
                              setShowScheduleModal(true)
                            }
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          Hẹn Xem Căn Này
                        </button>
                        <a
                          href={`https://zalo.me/${d.clientPhone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Send className="h-3.5 w-3.5 text-blue-500" />
                          Gửi Zalo
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SỔ QUẢN LÝ CHÌA KHÓA & DẪN KHÁCH XEM NHÀ */}
      {activeTab === 'showings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tủ Chìa Khóa Master Sàn</span>
                <span className="text-2xl font-bold text-amber-400 mt-1 block">18 Chìa</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Hộp chìa mã số an toàn tại Lễ tân</span>
              </div>
              <Key className="h-8 w-8 text-amber-400/80" />
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Mã Smartlock Khả Dụng</span>
                <span className="text-2xl font-bold text-emerald-400 mt-1 block">12 Căn</span>
                <span className="text-xs text-slate-400 mt-0.5 block">Passcode dùng 1 lần / theo ngày</span>
              </div>
              <Lock className="h-8 w-8 text-emerald-400/80" />
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Lịch Hẹn Hôm Nay</span>
                <span className="text-2xl font-bold text-indigo-400 mt-1 block">
                  {showings.filter(s => s.status === 'scheduled').length} Cuộc hẹn
                </span>
                <span className="text-xs text-slate-400 mt-0.5 block">Đã xác nhận với Chủ nhà & Khách</span>
              </div>
              <Calendar className="h-8 w-8 text-indigo-400/80" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Thời Gian Hẹn</th>
                  <th className="px-4 py-3.5">Căn Hộ & Dự Án</th>
                  <th className="px-4 py-3.5">Khách Hàng Xem Nhà</th>
                  <th className="px-4 py-3.5">Chuyên Viên Dẫn</th>
                  <th className="px-4 py-3.5">Cách Lấy Chìa Khóa</th>
                  <th className="px-4 py-3.5">Trạng Thái & Phản Hồi</th>
                  <th className="px-4 py-3.5 text-right">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {showings.map(shw => (
                  <tr key={shw.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                        {shw.showingTime}
                      </div>
                      <div className="text-xs text-slate-500">{shw.showingDate}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{shw.propertyCode}</div>
                      <div className="text-xs text-slate-500">{shw.projectName}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{shw.clientName}</div>
                      <div className="text-xs text-slate-500">{shw.clientPhone}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-700 dark:text-slate-300">
                      {shw.assignedAgent}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                        <Key className="h-3 w-3" />
                        {shw.keyHolder}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          shw.status === 'scheduled' ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400' :
                          shw.status === 'made_offer' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-300' :
                          'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                        }`}>
                          {shw.status === 'scheduled' ? 'Sắp Diễn Ra' :
                           shw.status === 'made_offer' ? 'Đã Trả Giá Đàm Phán' : 'Đã Xem Xong'}
                        </span>
                      </div>
                      {shw.clientFeedback && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs italic line-clamp-1">
                          "{shw.clientFeedback}"
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {shw.status === 'scheduled' ? (
                        <button
                          onClick={() => {
                            setShowings(showings.map(s => s.id === shw.id ? { ...s, status: 'completed', clientFeedback: 'Khách đã xem nhà xong, đánh giá cao nội thất.' } : s))
                          }}
                          className="px-2.5 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
                        >
                          Xác Nhận Đã Dẫn Xong
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">Hoàn tất</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CHỐT DEAL THỨ CẤP & HOA HỒNG */}
      {activeTab === 'closings' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Sổ Quyết Toán Giao Dịch Thứ Cấp & Phân Chia Hoa Hồng
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Cơ chế chia sẻ thù lao chuẩn mực: 50% Môi giới trực tiếp chốt • 50% Quỹ công ty & Sàn giao dịch. Khấu trừ thuế TNCN 10% tại nguồn.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Tổng thù lao đã chi:</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {formatVND(closings.reduce((sum, c) => sum + c.commissionAmount, 0))}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Mã Deal & Căn Hộ</th>
                  <th className="px-4 py-3.5">Bên Bán (Chủ Cũ)</th>
                  <th className="px-4 py-3.5">Bên Mua (Chủ Mới)</th>
                  <th className="px-4 py-3.5">Giá Trị Chốt & Tiền Cọc</th>
                  <th className="px-4 py-3.5">Phân Bổ Hoa Hồng (50/50)</th>
                  <th className="px-4 py-3.5">Tiến Trình Công Chứng</th>
                  <th className="px-4 py-3.5 text-right">Biên Bản A4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {closings.map(deal => (
                  <tr key={deal.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{deal.dealCode}</div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{deal.propertyCode} ({deal.projectName})</div>
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold mt-1 ${
                        deal.dealType === 'resale' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                      }`}>
                        {deal.dealType === 'resale' ? 'Chuyển Nhượng' : 'Cho Thuê'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{deal.sellerName}</div>
                      <div className="text-xs text-slate-500">{deal.sellerPhone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{deal.buyerName}</div>
                      <div className="text-xs text-slate-500">{deal.buyerPhone}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{formatVND(deal.finalPrice)}</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        Cọc: {formatVND(deal.depositAmount)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-rose-600 dark:text-rose-400">{formatVND(deal.commissionAmount)}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Sale: {formatVND(deal.commissionAgent)} • Sàn: {formatVND(deal.commissionCompany)}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                        deal.status === 'deposit_placed' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' :
                        deal.status === 'notarized' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' :
                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                      }`}>
                        {deal.status === 'deposit_placed' ? 'Đã Vào Cọc' :
                         deal.status === 'notarized' ? 'Đã Công Chứng Xong' : 'Hoàn Tất Sang Tên'}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-1">Hạn CC: {deal.notaryDate}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedDealForDeposit(deal)}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <FileText className="h-3.5 w-3.5 text-indigo-500" />
                        HĐ Cọc Ba Bên A4
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TIẾP NHẬN KÝ GỬI MỚI */}
      {/* ========================================================================= */}
      {showConsignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
            <button
              onClick={() => setShowConsignmentModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Plus className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Tiếp Nhận Ký Gửi Bất Động Sản Thứ Cấp
                </h2>
                <p className="text-xs text-slate-500">Ký hợp đồng môi giới và số hóa hồ sơ căn hộ vào rổ hàng</p>
              </div>
            </div>

            <form onSubmit={handleCreateConsignment} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hình thức ký gửi *
                  </label>
                  <select
                    value={newListingForm.type}
                    onChange={e => setNewListingForm({ ...newListingForm, type: e.target.value as ResaleListingType })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="resale">Bán Chuyển Nhượng (Resale)</option>
                    <option value="rental">Cho Thuê (Leasing)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Dự án bất động sản *
                  </label>
                  <select
                    value={newListingForm.projectName}
                    onChange={e => setNewListingForm({ ...newListingForm, projectName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="The Grand Manhattan">The Grand Manhattan (Quận 1)</option>
                    <option value="Aqua City">Aqua City (Đồng Nai)</option>
                    <option value="The Global City">The Global City (TP. Thủ Đức)</option>
                    <option value="NovaWorld Phan Thiết">NovaWorld Phan Thiết</option>
                    <option value="Eco Green Saigon">Eco Green Saigon (Quận 7)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mã căn hộ / Nhà phố *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: TGM-22.04"
                    value={newListingForm.propertyCode}
                    onChange={e => setNewListingForm({ ...newListingForm, propertyCode: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Họ tên chủ sở hữu *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn An"
                    value={newListingForm.ownerName}
                    onChange={e => setNewListingForm({ ...newListingForm, ownerName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Số điện thoại chủ nhà *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0912.888.999"
                    value={newListingForm.ownerPhone}
                    onChange={e => setNewListingForm({ ...newListingForm, ownerPhone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Giá niêm yết chào bán/thuê (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newListingForm.askingPrice}
                    onChange={e => setNewListingForm({ ...newListingForm, askingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-bold text-rose-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">{formatVND(newListingForm.askingPrice)}</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Diện tích thông thủy (m²)
                  </label>
                  <input
                    type="number"
                    value={newListingForm.area}
                    onChange={e => setNewListingForm({ ...newListingForm, area: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Pháp lý hồ sơ
                  </label>
                  <select
                    value={newListingForm.legalStatus}
                    onChange={e => setNewListingForm({ ...newListingForm, legalStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Sổ hồng riêng">Đã có Sổ hồng riêng</option>
                    <option value="HĐMB công chứng">Hợp đồng mua bán (HĐMB)</option>
                    <option value="Đang chờ cấp sổ">Đang nộp hồ sơ cấp sổ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hiện trạng giữ chìa khóa
                  </label>
                  <select
                    value={newListingForm.keyStatus}
                    onChange={e => setNewListingForm({ ...newListingForm, keyStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Sàn giữ chìa Master">Giao chìa Master cho Sàn giữ</option>
                    <option value="Chủ giữ chìa (Hẹn trước)">Chủ giữ chìa (Báo trước 2h)</option>
                    <option value="Smartlock Passcode">Cung cấp mật khẩu Smartlock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hoa hồng môi giới cam kết
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newListingForm.commissionRate}
                    onChange={e => setNewListingForm({ ...newListingForm, commissionRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {newListingForm.type === 'resale' ? `${newListingForm.commissionRate}% giá trị giao dịch` : '100% 1 tháng tiền thuê'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                    Ký thỏa thuận độc quyền 60 ngày (Bảo vệ giá & miễn phí quảng cáo VIP)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={newListingForm.exclusiveContract}
                  onChange={e => setNewListingForm({ ...newListingForm, exclusiveContract: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowConsignmentModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Xác Nhận Đưa Lên Sàn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: THÊM NHU CẦU MUA / THUÊ */}
      {/* ========================================================================= */}
      {showDemandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
            <button
              onClick={() => setShowDemandModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Đăng Ký Nhu Cầu Tìm Mua / Thuê Thứ Cấp
                </h2>
                <p className="text-xs text-slate-500">Kích hoạt AI Smart Matcher tìm nguồn hàng thích hợp ngay</p>
              </div>
            </div>

            <form onSubmit={handleCreateDemand} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tên khách hàng *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Trần Quốc Bảo"
                    value={newDemandForm.clientName}
                    onChange={e => setNewDemandForm({ ...newDemandForm, clientName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Số điện thoại liên hệ *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0909.123.456"
                    value={newDemandForm.clientPhone}
                    onChange={e => setNewDemandForm({ ...newDemandForm, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Loại nhu cầu
                    </label>
                    <select
                      value={newDemandForm.demandType}
                      onChange={e => setNewDemandForm({ ...newDemandForm, demandType: e.target.value as ResaleListingType })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="resale">Cần Mua Chuyển Nhượng</option>
                      <option value="rental">Cần Thuê Nhà / Shophouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Dự án mong muốn
                    </label>
                    <select
                      value={newDemandForm.targetProject}
                      onChange={e => setNewDemandForm({ ...newDemandForm, targetProject: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="The Grand Manhattan">The Grand Manhattan</option>
                      <option value="Aqua City">Aqua City</option>
                      <option value="The Global City">The Global City</option>
                      <option value="NovaWorld Phan Thiết">NovaWorld Phan Thiết</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Ngân sách từ (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={newDemandForm.minPrice}
                      onChange={e => setNewDemandForm({ ...newDemandForm, minPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Ngân sách tối đa (VNĐ)
                    </label>
                    <input
                      type="number"
                      value={newDemandForm.maxPrice}
                      onChange={e => setNewDemandForm({ ...newDemandForm, maxPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Số phòng ngủ
                    </label>
                    <select
                      value={newDemandForm.bedrooms}
                      onChange={e => setNewDemandForm({ ...newDemandForm, bedrooms: Number(e.target.value) })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value={1}>1 Phòng ngủ</option>
                      <option value={2}>2 Phòng ngủ</option>
                      <option value={3}>3 Phòng ngủ</option>
                      <option value={4}>4+ Phòng ngủ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mức độ cấp bách
                    </label>
                    <select
                      value={newDemandForm.urgency}
                      onChange={e => setNewDemandForm({ ...newDemandForm, urgency: e.target.value as any })}
                      className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    >
                      <option value="Cần gấp trong tuần 🔥">Cần gấp trong tuần 🔥</option>
                      <option value="Trong tháng này">Trong tháng này</option>
                      <option value="Tham khảo tìm hiểu">Tham khảo tìm hiểu</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDemandModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Lưu & Chạy AI So Khớp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ĐẶT LỊCH DẪN KHÁCH XEM NHÀ */}
      {/* ========================================================================= */}
      {showScheduleModal && selectedListingForSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
            <button
              onClick={() => {
                setShowScheduleModal(false)
                setSelectedListingForSchedule(null)
              }}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Calendar className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Lên Lịch Dẫn Khách Xem Nhà Thực Tế
                </h2>
                <p className="text-xs text-slate-500">
                  Căn {selectedListingForSchedule.propertyCode} ({selectedListingForSchedule.projectName})
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Chủ sở hữu:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedListingForSchedule.ownerName} ({selectedListingForSchedule.ownerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tình trạng chìa:</span>
                <span className="font-semibold text-amber-600">{selectedListingForSchedule.keyStatus}</span>
              </div>
              {selectedListingForSchedule.smartlockCode && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã Smartlock:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedListingForSchedule.smartlockCode}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleCreateShowing} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tên khách hàng xem nhà *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Anh Trần Đình Trọng"
                  value={newScheduleForm.clientName}
                  onChange={e => setNewScheduleForm({ ...newScheduleForm, clientName: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Số điện thoại khách hàng *
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: 0918.456.789"
                  value={newScheduleForm.clientPhone}
                  onChange={e => setNewScheduleForm({ ...newScheduleForm, clientPhone: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ngày xem nhà *
                  </label>
                  <input
                    type="date"
                    required
                    value={newScheduleForm.showingDate}
                    onChange={e => setNewScheduleForm({ ...newScheduleForm, showingDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Giờ hẹn *
                  </label>
                  <input
                    type="time"
                    required
                    value={newScheduleForm.showingTime}
                    onChange={e => setNewScheduleForm({ ...newScheduleForm, showingTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Chuyên viên dẫn khách
                </label>
                <input
                  type="text"
                  value={newScheduleForm.assignedAgent}
                  onChange={e => setNewScheduleForm({ ...newScheduleForm, assignedAgent: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ghi chú lưu ý khi xem
                </label>
                <textarea
                  rows={2}
                  placeholder="VD: Dẫn khách xem cùng vợ, chú ý bật sẵn đèn và máy lạnh..."
                  value={newScheduleForm.notes}
                  onChange={e => setNewScheduleForm({ ...newScheduleForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Lưu Lịch & Bắn SMS Nhắc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: HỢP ĐỒNG MÔI GIỚI KÝ GỬI ĐỘC QUYỀN MẪU A4 */}
      {/* ========================================================================= */}
      {selectedListingForAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 my-8 text-slate-900 dark:text-white">
            <button
              onClick={() => setSelectedListingForAgreement(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Mẫu Hợp Đồng A4 Chuẩn Pháp Chế */}
            <div className="border border-slate-300 dark:border-slate-700 p-8 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 space-y-6 shadow-sm">
              <div className="text-center space-y-1 border-b border-slate-300 dark:border-slate-700 pb-4">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div className="text-xs font-semibold text-slate-500">Độc lập - Tự do - Hạnh phúc</div>
                <div className="text-lg font-black uppercase text-indigo-700 dark:text-indigo-400 pt-2">
                  HỢP ĐỒNG DỊCH VỤ MÔI GIỚI KÝ GỬI BẤT ĐỘNG SẢN ĐỘC QUYỀN
                </div>
                <div className="text-xs text-slate-400">Số: {selectedListingForAgreement.listingCode}/2026/HĐMG-NOVA</div>
              </div>

              <div className="text-xs leading-relaxed space-y-3">
                <p>Hôm nay, ngày {selectedListingForAgreement.createdAt}, tại trụ sở Công ty Cổ phần Bất động sản Nova Capital, hai bên gồm có:</p>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <strong className="block text-slate-900 dark:text-white font-bold mb-1">BÊN A (BÊN KÝ GỬI / CHỦ SỞ HỮU):</strong>
                  <div>Họ và tên: <strong>{selectedListingForAgreement.ownerName}</strong> • Điện thoại: <strong>{selectedListingForAgreement.ownerPhone}</strong></div>
                  <div>Là chủ sở hữu hợp pháp căn hộ: <strong>{selectedListingForAgreement.propertyCode}</strong> thuộc dự án <strong>{selectedListingForAgreement.projectName}</strong>.</div>
                  <div>Tình trạng pháp lý: <strong>{selectedListingForAgreement.legalStatus}</strong> • Diện tích: <strong>{selectedListingForAgreement.area} m²</strong>.</div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <strong className="block text-slate-900 dark:text-white font-bold mb-1">BÊN B (BÊN MÔI GIỚI / SÀN GIAO DỊCH):</strong>
                  <div><strong>CÔNG TY CỔ PHẦN ĐỊA ỐC NOVA CAPITAL (HỆ THỐNG NOVA CRM)</strong></div>
                  <div>Địa chỉ: Số 65 Nguyễn Du, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</div>
                  <div>Đại diện: Ông Nguyễn Trần Tuấn Tú - Giám đốc Khối Kinh Doanh Thứ Cấp</div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="font-bold text-slate-900 dark:text-white">ĐIỀU 1: PHẠM VI DỊCH VỤ VÀ GIÁ KÝ GỬI</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Bên A đồng ý giao quyền môi giới {selectedListingForAgreement.exclusiveContract ? 'ĐỘC QUYỀN' : 'THƯỜNG'} cho Bên B tìm kiếm khách hàng {selectedListingForAgreement.type === 'resale' ? 'mua chuyển nhượng' : 'thuê'}.</li>
                    <li>Giá niêm yết chào bán/thuê: <strong className="text-rose-600 font-bold">{formatVND(selectedListingForAgreement.askingPrice)}</strong>.</li>
                    <li>Giá thực thu tối thiểu của Bên A (Net): <strong>{formatVND(selectedListingForAgreement.targetNetPrice)}</strong>.</li>
                    <li>Thời hạn độc quyền: <strong>60 ngày</strong> (Từ {selectedListingForAgreement.createdAt} đến {selectedListingForAgreement.exclusiveEndDate || '31/12/2026'}).</li>
                  </ul>

                  <div className="font-bold text-slate-900 dark:text-white pt-2">ĐIỀU 2: PHÍ MÔI GIỚI & PHƯƠNG THỨC THANH TOÁN</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Phí dịch vụ môi giới: <strong>{selectedListingForAgreement.commissionRate}%</strong> giá trị giao dịch thành công (Tương đương: <strong className="text-emerald-600">{formatVND(selectedListingForAgreement.commissionAmount)}</strong>).</li>
                    <li>Phí môi giới được Bên A thanh toán đầy đủ 100% cho Bên B ngay sau khi ký Hợp đồng đặt cọc hoặc Hợp đồng công chứng.</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-6 text-center text-xs">
                <div>
                  <div className="font-bold uppercase text-slate-700 dark:text-slate-300">ĐẠI DIỆN BÊN KÝ GỬI (BÊN A)</div>
                  <div className="text-slate-400 text-[11px] italic">(Ký và ghi rõ họ tên)</div>
                  <div className="h-16 flex items-center justify-center font-bold text-base text-slate-800 dark:text-slate-200 mt-2">
                    {selectedListingForAgreement.ownerName}
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-slate-700 dark:text-slate-300">ĐẠI DIỆN BÊN MÔI GIỚI (BÊN B)</div>
                  <div className="text-slate-400 text-[11px] italic">(Đã ký số SHA-256 e-Sign)</div>
                  <div className="h-16 flex items-center justify-center text-emerald-600 font-bold text-xs">
                    [NOVA CAPITAL E-SIGNED ✓]
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-slate-400">Văn bản pháp chế số hóa đạt chuẩn Luật Kinh doanh Bất động sản 2023</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="h-4 w-4" /> In A4
                </button>
                <button
                  onClick={() => setSelectedListingForAgreement(null)}
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: THỎA THUẬN ĐẶT CỌC BA BÊN MẪU A4 */}
      {/* ========================================================================= */}
      {selectedDealForDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 my-8 text-slate-900 dark:text-white">
            <button
              onClick={() => setSelectedDealForDeposit(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Mẫu Hợp Đồng Cọc Ba Bên A4 */}
            <div className="border border-slate-300 dark:border-slate-700 p-8 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 space-y-6 shadow-sm">
              <div className="text-center space-y-1 border-b border-slate-300 dark:border-slate-700 pb-4">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div className="text-xs font-semibold text-slate-500">Độc lập - Tự do - Hạnh phúc</div>
                <div className="text-lg font-black uppercase text-emerald-700 dark:text-emerald-400 pt-2">
                  VĂN BẢN THỎA THUẬN ĐẶT CỌC BA BÊN (CHUYỂN NHƯỢNG THỨ CẤP)
                </div>
                <div className="text-xs text-slate-400 font-mono">Mã giao dịch: {selectedDealForDeposit.dealCode}</div>
              </div>

              <div className="text-xs leading-relaxed space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <strong className="block text-slate-900 dark:text-white font-bold mb-1">BÊN A (BÊN BÁN):</strong>
                    <div>{selectedDealForDeposit.sellerName}</div>
                    <div className="text-slate-500">{selectedDealForDeposit.sellerPhone}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <strong className="block text-slate-900 dark:text-white font-bold mb-1">BÊN B (BÊN MUA):</strong>
                    <div>{selectedDealForDeposit.buyerName}</div>
                    <div className="text-slate-500">{selectedDealForDeposit.buyerPhone}</div>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <strong className="block text-slate-900 dark:text-white font-bold mb-1">BÊN C (TRUNG GIAN):</strong>
                    <div>Nova CRM Brokerage</div>
                    <div className="text-slate-500">Giữ cọc bảo đảm</div>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800/50 space-y-1">
                  <div className="flex justify-between">
                    <span>Bất động sản chuyển nhượng:</span>
                    <strong>{selectedDealForDeposit.propertyCode} ({selectedDealForDeposit.projectName})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng giá trị chốt bán:</span>
                    <strong className="text-rose-600 font-bold text-sm">{formatVND(selectedDealForDeposit.finalPrice)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Số tiền đặt cọc (Bên B chuyển Bên A):</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 font-bold">{formatVND(selectedDealForDeposit.depositAmount)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời hạn ra văn phòng công chứng:</span>
                    <strong>{selectedDealForDeposit.notaryDate} tại {selectedDealForDeposit.notaryOffice}</strong>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="font-bold text-slate-900 dark:text-white">NGHĨA VỤ THUẾ PHÍ & THÙ LAO MÔI GIỚI:</div>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                    <li>Thuế TNCN chuyển nhượng (2%): Bên Bán chịu trách nhiệm nộp vào Kho bạc Nhà nước.</li>
                    <li>Lệ phí trước bạ (0.5%): Bên Mua chịu trách nhiệm nộp khi làm thủ tục đăng bộ sang tên.</li>
                    <li>Thù lao môi giới Bên C nhận: <strong className="text-slate-900 dark:text-white">{formatVND(selectedDealForDeposit.commissionAmount)}</strong> ngay khi hai bên ký văn bản đặt cọc này.</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
                <div>
                  <div className="font-bold uppercase text-slate-700 dark:text-slate-300">BÊN BÁN (BÊN A)</div>
                  <div className="h-16 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200">
                    {selectedDealForDeposit.sellerName}
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-slate-700 dark:text-slate-300">BÊN MUA (BÊN B)</div>
                  <div className="h-16 flex items-center justify-center font-bold text-slate-800 dark:text-slate-200">
                    {selectedDealForDeposit.buyerName}
                  </div>
                </div>
                <div>
                  <div className="font-bold uppercase text-slate-700 dark:text-slate-300">ĐẠI DIỆN BÊN C</div>
                  <div className="h-16 flex items-center justify-center text-emerald-600 font-bold">
                    [ĐÃ XÁC THỰC CỌC ✓]
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <span className="text-xs text-slate-400">Tiền cọc được bảo chứng an toàn qua Escrow Vault</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="h-4 w-4" /> In Bản Thỏa Thuận
                </button>
                <button
                  onClick={() => setSelectedDealForDeposit(null)}
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* POPUP XEM KHÁCH PHÙ HỢP CỦA CĂN KÝ GỬI */}
      {/* ========================================================================= */}
      {selectedMatchListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 my-8">
            <button
              onClick={() => setSelectedMatchListing(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600">
                <Sparkles className="h-5 w-5 text-amber-500" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Khách Hàng Đang Khớp Với Căn {selectedMatchListing.propertyCode}
                </h2>
                <p className="text-xs text-slate-500">Giá: {formatVND(selectedMatchListing.askingPrice)} • {selectedMatchListing.projectName}</p>
              </div>
            </div>

            <div className="space-y-3">
              {demands.filter(d => d.targetProjects.includes(selectedMatchListing.projectName) || d.suggestedListingCode === selectedMatchListing.listingCode).length > 0 ? (
                demands.filter(d => d.targetProjects.includes(selectedMatchListing.projectName) || d.suggestedListingCode === selectedMatchListing.listingCode).map(match => (
                  <div key={match.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        {match.clientName}
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-300">
                          Match {match.matchingScore}%
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        SĐT: {match.clientPhone} • Ngân sách: {formatVND(match.maxPrice)}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMatchListing(null)
                        setSelectedListingForSchedule(selectedMatchListing)
                        setNewScheduleForm(prev => ({
                          ...prev,
                          clientName: match.clientName,
                          clientPhone: match.clientPhone,
                          assignedAgent: match.assignedAgent
                        }))
                        setShowScheduleModal(true)
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                    >
                      Dẫn Xem Ngay
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500">
                  Chưa có khách hàng khớp trực tiếp với dự án này. Hãy thêm nhu cầu mới!
                </div>
              )}
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedMatchListing(null)}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
