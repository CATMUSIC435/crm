"use client"
import React, { useState, useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Store, Handshake, Share2, Star, 
  MapPin, Building, Plus, Search, Filter,
  Phone, Mail, CheckCircle2, DollarSign,
  TrendingUp, Users, Activity, PieChart,
  ShieldCheck, FileText, Check, AlertCircle,
  ExternalLink, Calendar, Sparkles, Building2,
  CheckCheck, Download, Award
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { MarketplaceListing, AgencyPartner } from '@/types'

const MARKET_STATS = [
  { month: 'T1', listings: 120, deals: 45, volume: 85 },
  { month: 'T2', listings: 150, deals: 55, volume: 110 },
  { month: 'T3', listings: 200, deals: 80, volume: 160 },
  { month: 'T4', listings: 280, deals: 110, volume: 215 },
  { month: 'T5', listings: 350, deals: 140, volume: 290 },
  { month: 'T6', listings: 420, deals: 180, volume: 380 },
  { month: 'T7', listings: 500, deals: 220, volume: 450 },
]

const SEGMENT_STATS = [
  { name: 'Biệt Thự / Dinh Thự', deals: 142, gmv: 2150 },
  { name: 'Căn Hộ Cao Cấp', deals: 185, gmv: 1280 },
  { name: 'Shophouse / Nhà Phố', deals: 68, gmv: 890 },
  { name: 'Cho Thuê VP / TM', deals: 25, gmv: 200 },
]

export default function MarketplacePage() {
  const { 
    marketplaceListings, 
    agencyPartners, 
    addMarketplaceListing, 
    requestDistributionRights,
    toggleDistributeListing 
  } = useStore()

  // State filters
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'Bán' | 'Cho Thuê'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [districtFilter, setDistrictFilter] = useState<string>('all')
  const [priceFilter, setPriceFilter] = useState<string>('all')

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDistributeModal, setShowDistributeModal] = useState<MarketplaceListing | null>(null)
  const [selectedListingModal, setSelectedListingModal] = useState<MarketplaceListing | null>(null)
  const [selectedAgencyInviteModal, setSelectedAgencyInviteModal] = useState<AgencyPartner | null>(null)

  // Agreement form state
  const [agreementForm, setAgreementForm] = useState({
    agencyName: 'Đại Lý BĐS Khang Điền Partner (F2)',
    representative: 'Nguyễn Tuấn Tú',
    phone: '0909 888 777',
    acceptedTerms: true
  })

  // Create listing form state
  const [newListingForm, setNewListingForm] = useState({
    title: '',
    price: '15 Tỷ',
    priceNumeric: 15000000000,
    commSplit: '50/50',
    f2Commission: '1.5%',
    f2CommissionRate: 1.5,
    type: 'Bán' as 'Bán' | 'Cho Thuê',
    propertyCategory: 'Biệt thự' as MarketplaceListing['propertyCategory'],
    location: 'Thảo Điền, TP. Thủ Đức',
    district: 'TP. Thủ Đức',
    ownerAgency: 'Sàn BĐS Novaland Master (F1)',
    area: 250,
    bedrooms: 4,
    legalStatus: 'HĐMB' as MarketplaceListing['legalStatus'],
    handoverStandard: 'Hoàn thiện cao cấp',
    description: '',
    phone: '0901 234 567'
  })

  // Agency invite form state
  const [inviteMessage, setInviteMessage] = useState('Kính mời Quý Đại lý liên kết cùng phân phối rổ hàng độc quyền phân khu Đảo Phượng Hoàng Aqua City. Hoa hồng F2 cam kết 1.5% giải ngân đúng hạn.')

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMsg({ message, type })
    setTimeout(() => setToastMsg(null), 3500)
  }

  // Filtered listings
  const filteredListings = useMemo(() => {
    return marketplaceListings.filter(item => {
      const matchSearch = !searchTerm || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ownerAgency.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchType = typeFilter === 'all' || item.type === typeFilter
      const matchCat = categoryFilter === 'all' || item.propertyCategory === categoryFilter
      const matchDistrict = districtFilter === 'all' || item.district === districtFilter

      let matchPrice = true
      if (priceFilter === 'under10') matchPrice = item.priceNumeric < 10000000000
      else if (priceFilter === '10to30') matchPrice = item.priceNumeric >= 10000000000 && item.priceNumeric <= 30000000000
      else if (priceFilter === 'above30') matchPrice = item.priceNumeric > 30000000000

      return matchSearch && matchType && matchCat && matchDistrict && matchPrice
    })
  }, [marketplaceListings, searchTerm, typeFilter, categoryFilter, districtFilter, priceFilter])

  // Distributed by me
  const myListings = useMemo(() => {
    return marketplaceListings.filter(l => l.distributedByMe)
  }, [marketplaceListings])

  // Handle Submit Distribution Agreement
  const handleConfirmDistribution = (e: React.FormEvent) => {
    e.preventDefault()
    if (!showDistributeModal) return

    requestDistributionRights(
      showDistributeModal.id,
      agreementForm.agencyName,
      agreementForm.representative
    )

    const listingTitle = showDistributeModal.title
    setShowDistributeModal(null)
    showToast(`Đã ký thỏa thuận phân phối thành công sản phẩm "${listingTitle}"! Thời hạn bảo vệ khách hàng 90 ngày.`, 'success')
  }

  // Handle Create New Listing
  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newListingForm.title.trim()) {
      showToast('Vui lòng nhập tên sản phẩm BĐS!', 'error')
      return
    }

    addMarketplaceListing({
      title: newListingForm.title,
      price: newListingForm.price,
      priceNumeric: Number(newListingForm.priceNumeric) || 10000000000,
      commSplit: newListingForm.commSplit,
      f2Commission: newListingForm.f2Commission,
      f2CommissionRate: Number(newListingForm.f2CommissionRate) || 1.5,
      type: newListingForm.type,
      propertyCategory: newListingForm.propertyCategory,
      location: newListingForm.location,
      district: newListingForm.district,
      ownerAgency: newListingForm.ownerAgency,
      ownerAvatar: 'F1',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      verified: true,
      legalStatus: newListingForm.legalStatus,
      area: Number(newListingForm.area) || 100,
      bedrooms: Number(newListingForm.bedrooms) || 3,
      handoverStandard: newListingForm.handoverStandard,
      distributedByMe: true,
      description: newListingForm.description || 'Sản phẩm giỏ hàng F1 độc quyền chia sẻ lên sàn liên kết.',
      phone: newListingForm.phone
    })

    setShowCreateModal(false)
    setNewListingForm({
      title: '',
      price: '15 Tỷ',
      priceNumeric: 15000000000,
      commSplit: '50/50',
      f2Commission: '1.5%',
      f2CommissionRate: 1.5,
      type: 'Bán',
      propertyCategory: 'Biệt thự',
      location: 'Thảo Điền, TP. Thủ Đức',
      district: 'TP. Thủ Đức',
      ownerAgency: 'Sàn BĐS Novaland Master (F1)',
      area: 250,
      bedrooms: 4,
      legalStatus: 'HĐMB',
      handoverStandard: 'Hoàn thiện cao cấp',
      description: '',
      phone: '0901 234 567'
    })
    showToast('Đã đăng sản phẩm mới lên sàn liên kết B2B thành công!', 'success')
  }

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã Căn', 'Tiêu Đề', 'Giá Niêm Yết', 'Loại Giao Dịch', 'Phân Khúc', 'Khu Vực', 'Đại Lý F1 Chủ Quản', 'Tỷ Lệ Chia Hoa Hồng', 'F2 Thực Nhận', 'Pháp Lý']
    const rows = marketplaceListings.map(item => [
      item.id,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.price}"`,
      item.type,
      item.propertyCategory,
      `"${item.location.replace(/"/g, '""')}"`,
      `"${item.ownerAgency.replace(/"/g, '""')}"`,
      item.commSplit,
      item.f2Commission,
      item.legalStatus
    ])
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `NovaB2B_Marketplace_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất báo cáo rổ hàng liên kết B2B thành công (UTF-8 CSV)!', 'success')
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Toast Feedback */}
      {toastMsg && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium text-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4 border ${
          toastMsg.type === 'error' ? 'bg-rose-600 border-rose-500 shadow-rose-900/30' :
          toastMsg.type === 'info' ? 'bg-sky-600 border-sky-500 shadow-sky-900/30' :
          'bg-emerald-600 border-emerald-500 shadow-emerald-900/30'
        }`}>
          {toastMsg.type === 'error' ? <AlertCircle className="h-5 w-5 shrink-0" /> :
           toastMsg.type === 'info' ? <Sparkles className="h-5 w-5 shrink-0" /> :
           <CheckCircle2 className="h-5 w-5 shrink-0" />}
          <span>{toastMsg.message}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-orange-100 text-orange-800 border-orange-300 text-xs font-semibold px-2.5 py-0.5">
              NovaExchange B2B Co-brokering v3.0
            </Badge>
            <span className="text-xs text-muted-foreground">• Sàn Giao Dịch Bán Chéo & Ký Quỹ Hoa Hồng F1 - F2</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2.5 text-slate-900">
            <Store className="h-8 w-8 text-orange-600 fill-orange-100" />
            Sàn Giao Dịch Bán Chéo F2 & Co-brokering
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl">
            Nền tảng chia sẻ rổ hàng thứ cấp & độc quyền F1, ký kết thỏa thuận bảo vệ khách hàng 90 ngày, đối soát hoa hồng minh bạch giữa các đại lý liên kết.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Đăng Nguồn Hàng Bán Chéo
          </Button>

          <Button 
            variant="outline"
            onClick={() => showToast('Đang kết nối hệ thống chia sẻ giỏ hàng B2B qua Zalo/Email cho 500+ đại lý...', 'info')}
            className="font-semibold text-sm border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Share2 className="h-4 w-4 text-blue-600" />
            Chia Sẻ Kho Hàng
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
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Tổng Sản Phẩm Bán Chéo</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                1,245 <span className="text-xs font-bold text-orange-600">Sản Phẩm</span>
              </h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" /> +15% rổ hàng mới trong tháng
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
              <Store className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Giao Dịch Chéo Thành Công</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2">
                <span>420</span>
                <span className="text-xs font-bold text-slate-500">Deals</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Tổng GMV chốt: <strong>4.520 Tỷ VNĐ</strong>
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Đại Lý F1 / F2 Tham Gia</p>
              <h3 className="text-2xl md:text-3xl font-black text-purple-600 mt-1">
                3,850+
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Gồm 12 Sàn Master F1 & 350 Sàn F2
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Hoa Hồng Đã Chia Sẻ (Escrow)</p>
              <h3 className="text-xl md:text-2xl font-black text-emerald-600 mt-1 flex items-center gap-1.5">
                <span>89.5 Tỷ</span>
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Cam kết 100% thanh toán đúng hạn
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Main Tabs Container */}
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1.5 mb-6 bg-slate-100 rounded-xl gap-1">
          <TabsTrigger value="listings" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
            <Building className="h-4 w-4 text-orange-600"/> Rổ Hàng Bán Chéo F1/F2
          </TabsTrigger>
          <TabsTrigger value="my-distributed" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600"/> Hàng Tôi Nhận Phân Phối
            {myListings.length > 0 && (
              <Badge className="ml-1 bg-emerald-600 text-white text-[10px] px-1.5 py-0">
                {myListings.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="agencies" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
            <Handshake className="h-4 w-4 text-blue-600"/> Mạng Lưới Sàn & Đại Lý
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-xs py-2.5 flex items-center gap-1.5">
            <PieChart className="h-4 w-4 text-purple-600"/> Phân Tích & GMV Chợ
          </TabsTrigger>
        </TabsList>

        {/* ================= TAB 1: RỔ HÀNG BÁN CHÉO ================= */}
        <TabsContent value="listings" className="space-y-6">
          
          {/* Multi-Dimensional Filter Bar */}
          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Tìm kiếm theo tên dự án, vị trí, đại lý chủ quản F1..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 text-xs h-9"
                />
              </div>
              {searchTerm && (
                <Button size="sm" variant="ghost" onClick={() => setSearchTerm('')} className="text-xs h-9">
                  Xóa tìm kiếm
                </Button>
              )}
            </div>

            {/* Filter Pills / Selects */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Hình Thức</label>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">Tất cả hình thức</option>
                  <option value="Bán">Bán đứt</option>
                  <option value="Cho Thuê">Cho thuê</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Phân Khúc</label>
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">Mọi phân khúc</option>
                  <option value="Căn hộ">Căn hộ cao cấp</option>
                  <option value="Biệt thự">Biệt thự / Villa</option>
                  <option value="Shophouse">Shophouse</option>
                  <option value="Dinh thự">Dinh thự</option>
                  <option value="Nhà phố">Nhà phố thương mại</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Khu Vực</label>
                <select 
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">Tất cả khu vực</option>
                  <option value="TP. Thủ Đức">TP. Thủ Đức</option>
                  <option value="Quận 1">Quận 1</option>
                  <option value="Đồng Nai">Đồng Nai</option>
                  <option value="Phan Thiết">Phan Thiết</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Khoảng Giá</label>
                <select 
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">Mọi mức giá</option>
                  <option value="under10">&lt; 10 Tỷ VNĐ</option>
                  <option value="10to30">10 Tỷ - 30 Tỷ VNĐ</option>
                  <option value="above30">&gt; 30 Tỷ VNĐ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredListings.map(item => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all group flex flex-col border border-slate-200 bg-white rounded-2xl">
                
                {/* Image Cover */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                    <Badge className="bg-slate-900/80 backdrop-blur-md text-white border-none text-[10px] font-bold">
                      {item.type}
                    </Badge>
                    <Badge className="bg-orange-600/90 text-white border-none text-[10px] font-bold">
                      {item.propertyCategory}
                    </Badge>
                  </div>
                  
                  {item.distributedByMe && (
                    <div className="absolute top-2.5 right-2.5">
                      <Badge className="bg-emerald-600 text-white border-none text-[10px] font-bold shadow-md flex items-center gap-1">
                        <Check className="h-3 w-3 stroke-[3]" /> Đã Nhận Phân Phối
                      </Badge>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3.5 pt-8">
                    <div className="flex items-center gap-1 text-slate-300 text-xs font-medium">
                      <MapPin className="h-3.5 w-3.5 text-orange-400 shrink-0" /> 
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug min-h-[38px] group-hover:text-orange-600 transition-colors">
                      {item.title}
                    </h3>

                    {/* Price & Specs */}
                    <div className="flex justify-between items-baseline mt-2">
                      <span className="text-xl font-black text-rose-600 font-mono">{item.price}</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {item.area} m² • {item.bedrooms ? `${item.bedrooms} PN` : item.legalStatus}
                      </span>
                    </div>
                  </div>

                  {/* Co-brokering Commission Box */}
                  <div className="bg-orange-50/80 border border-orange-200/80 rounded-xl p-3 space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[10px] text-orange-800 font-bold uppercase tracking-wider flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-orange-600" /> Tỷ lệ phân chia
                      </span>
                      <span className="text-[10px] font-bold bg-white text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">
                        {item.commSplit}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-xs text-slate-600 font-medium">Hoa hồng F2 thực nhận:</span>
                      <span className="font-black text-orange-600 text-sm">{item.f2Commission}</span>
                    </div>
                  </div>

                  {/* Owner & Action Bottom Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7 bg-slate-100 text-[11px] font-bold text-slate-700">
                        <AvatarFallback>{item.ownerAvatar}</AvatarFallback>
                      </Avatar>
                      <div className="max-w-[110px]">
                        <div className="text-[11px] font-bold text-slate-800 truncate">{item.ownerAgency}</div>
                        <div className="text-[9px] text-emerald-600 font-medium flex items-center">
                          <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> F1 Xác thực
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedListingModal(item)}
                        className="text-[11px] h-7 px-2 font-semibold border-slate-200 hover:bg-slate-50"
                      >
                        Chi Tiết
                      </Button>

                      {item.distributedByMe ? (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            toggleDistributeListing(item.id)
                            showToast(`Đã hủy nhận quyền phân phối "${item.title}"`, 'info')
                          }}
                          className="text-[11px] h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold"
                        >
                          Hủy
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => setShowDistributeModal(item)}
                          className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold h-7 px-2.5 rounded-lg shadow-sm"
                        >
                          Nhận Bán Chéo
                        </Button>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>

          {filteredListings.length === 0 && (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <Store className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 text-sm">Không tìm thấy sản phẩm bán chéo phù hợp</h4>
              <p className="text-xs text-slate-500 mt-1">Hãy thử xóa bộ lọc tìm kiếm hoặc mức giá.</p>
            </div>
          )}

        </TabsContent>

        {/* ================= TAB 2: HÀNG TÔI NHẬN PHÂN PHỐI ================= */}
        <TabsContent value="my-distributed" className="space-y-4">
          <Card className="shadow-sm border border-slate-200 bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Rổ Hàng Đang Được Bảo Vệ Phân Phối (F2 Agency Contract)
                </CardTitle>
                <CardDescription className="text-xs">
                  Bạn có 90 ngày bảo vệ độc quyền khách hàng và cam kết nhận hoa hồng qua hợp đồng Escrow
                </CardDescription>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-bold px-2.5 py-1">
                {myListings.length} Sản Phẩm Khả Dụng
              </Badge>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              {myListings.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-700 text-sm">Bạn chưa nhận phân phối sản phẩm nào</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Hãy duyệt tab <strong>Rổ Hàng Bán Chéo F1/F2</strong> và bấm "Nhận Bán Chéo" để bổ sung nguồn hàng vào giỏ hàng tiếp thị của đại lý.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myListings.map(item => (
                    <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <img src={item.image} alt={item.title} className="h-16 w-20 rounded-xl object-cover border shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-emerald-600 text-white text-[9px] font-bold">Hợp Đồng Active</Badge>
                            <span className="text-[11px] font-mono text-slate-400">ID: {item.id}</span>
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1">{item.title}</h4>
                          <div className="text-xs text-slate-600 mt-0.5">
                            Giá: <strong className="text-rose-600 font-mono">{item.price}</strong> • Hoa hồng F2: <strong className="text-orange-600 font-mono">{item.f2Commission}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => {
                            showToast(`Đang tải trọn bộ tài liệu bán hàng (Brochure, bảng giá, pháp lý) của ${item.title}...`, 'info')
                          }}
                          className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white h-8 px-3"
                        >
                          Tải Bảng Hàng
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedListingModal(item)}
                          className="text-xs font-semibold border-slate-300 h-8 px-3"
                        >
                          Xem Chi Tiết
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ================= TAB 3: MẠNG LƯỚI ĐẠI LÝ LIÊN KẾT ================= */}
        <TabsContent value="agencies" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agencyPartners.map(agency => (
              <Card key={agency.id} className="hover:border-orange-300 transition-all border border-slate-200 bg-white rounded-2xl shadow-sm">
                <CardContent className="p-5 md:p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center font-black text-xl text-slate-600 shrink-0 shadow-inner">
                      {agency.logo}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-base text-slate-900">{agency.name}</h3>
                          <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3" /> {agency.address}
                          </div>
                        </div>
                        <Badge variant="outline" className={`text-[10px] font-bold ${
                          agency.tier === 'Global Partner' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          agency.tier === 'F1 Master Partner' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {agency.tier}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-1 text-amber-500 font-bold">
                          <Star className="h-3.5 w-3.5 fill-amber-500" /> {agency.rating}
                        </div>
                        <div>•</div>
                        <div><strong>{agency.deals}</strong> Deal thành công</div>
                        <div>•</div>
                        <div><strong>{agency.activeListingsCount}</strong> Căn mở bán chéo</div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => showToast(`Đang kết nối tổng đài đối tác ${agency.name}: ${agency.phone}...`, 'info')}
                          className="flex-1 text-xs h-8 border-slate-200 font-semibold"
                        >
                          <Phone className="h-3.5 w-3.5 mr-1 text-slate-600"/> Gọi Hotline
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => showToast(`Đang mở hộp thư trao đổi với phòng B2B của ${agency.name}...`, 'info')}
                          className="flex-1 text-xs h-8 border-slate-200 font-semibold"
                        >
                          <Mail className="h-3.5 w-3.5 mr-1 text-slate-600"/> Nhắn Tin
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedAgencyInviteModal(agency)}
                          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold h-8"
                        >
                          <Handshake className="h-3.5 w-3.5 mr-1"/> Mời Hợp Tác
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Banner Đăng ký Đối Tác F1 */}
          <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-orange-500/30">
            <div className="space-y-1.5">
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/40 text-[11px] font-bold">
                Mở Rộng Kênh Phân Phối
              </Badge>
              <h2 className="text-xl md:text-2xl font-black">Bạn Có Giỏ Hàng Độc Quyền Cần Ra Hàng Nhanh?</h2>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                Trở thành Sàn Tổng F1 trên sàn NovaExchange để chia sẻ kho hàng tới 3.850+ môi giới liên kết F2 và đại lý tự do, cam kết bảo mật thông tin và giải ngân hoa hồng minh bạch.
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs h-11 px-6 rounded-xl shadow-lg shrink-0"
            >
              Đăng Ký Đăng Hàng F1 Ngay
            </Button>
          </div>
        </TabsContent>

        {/* ================= TAB 4: PHÂN TÍCH & THỐNG KÊ ================= */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* AreaChart: GMV growth */}
            <Card className="shadow-sm border border-slate-200 bg-white">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">
                  Tăng Trưởng Sản Phẩm & GMV Chợ B2B (YTD)
                </CardTitle>
                <CardDescription className="text-xs">
                  Số lượng sản phẩm đưa lên sàn và giá trị GMV chốt thành công qua các tháng (Tỷ VNĐ)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={MARKET_STATS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="left" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <YAxis yAxisId="right" orientation="right" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '12px' }} />
                      <Area yAxisId="left" type="monotone" dataKey="listings" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorListings)" name="Sản Phẩm Mới" />
                      <Area yAxisId="right" type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" name="GMV (Tỷ VNĐ)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* BarChart: Breakdown by segment */}
            <Card className="shadow-sm border border-slate-200 bg-white">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-base font-bold text-slate-900">
                  Cơ Cấu Giao Dịch Chéo Theo Phân Khúc BĐS
                </CardTitle>
                <CardDescription className="text-xs">
                  Phân bổ doanh số GMV thực tế của các sản phẩm co-brokering (Tỷ VNĐ)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={SEGMENT_STATS} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <YAxis tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '10px', border: 'none', fontSize: '12px' }} />
                      <Bar dataKey="gmv" fill="#f97316" radius={[6, 6, 0, 0]} name="GMV (Tỷ VNĐ)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

      </Tabs>

      {/* ================= MODAL 1: HỢP ĐỒNG KÝ KẾT BÁN CHÉO CO-BROKERING ================= */}
      {showDistributeModal && (
        <div 
          onClick={() => setShowDistributeModal(null)}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Thỏa Thuận Phân Phối Bán Chéo (Co-brokering Agreement)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Bảo vệ nguồn khách & ký quỹ hoa hồng tự động</p>
              </div>
              <button 
                onClick={() => setShowDistributeModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmDistribution} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-orange-50 rounded-2xl border border-orange-200 space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">{showDistributeModal.title}</div>
                <div className="flex justify-between text-slate-600">
                  <span>Giá niêm yết: <strong className="text-rose-600 font-mono">{showDistributeModal.price}</strong></span>
                  <span>Chủ nguồn F1: <strong>{showDistributeModal.ownerAgency}</strong></span>
                </div>
                <div className="flex justify-between text-slate-600 border-t border-orange-200/60 pt-1.5 mt-1">
                  <span>Tỷ lệ phân chia: <strong>{showDistributeModal.commSplit}</strong></span>
                  <span>F2 Thực nhận: <strong className="text-orange-600 font-bold">{showDistributeModal.f2Commission}</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  Đại Lý Đăng Ký Phân Phối (F2)
                </label>
                <Input 
                  value={agreementForm.agencyName}
                  onChange={(e) => setAgreementForm({ ...agreementForm, agencyName: e.target.value })}
                  className="text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Người Đại Diện Ký
                  </label>
                  <Input 
                    value={agreementForm.representative}
                    onChange={(e) => setAgreementForm({ ...agreementForm, representative: e.target.value })}
                    className="text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Số Điện Thoại Hotline
                  </label>
                  <Input 
                    value={agreementForm.phone}
                    onChange={(e) => setAgreementForm({ ...agreementForm, phone: e.target.value })}
                    className="font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 space-y-1 text-[11px] leading-relaxed">
                <div className="font-bold text-slate-800">Điều khoản cam kết nguyên tắc:</div>
                <p>1. Cam kết bảo vệ khách hàng 90 ngày kể từ khi F2 gửi thông tin khách hàng vào hệ thống.</p>
                <p>2. Tuyệt đối không luồn cò, không cắt cầu đại lý F1 chủ nguồn hàng dưới mọi hình thức.</p>
                <p>3. Hoa hồng được ký quỹ qua tài khoản Escrow và giải ngân 2 đợt (30% khi cọc, 70% khi giải ngân).</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={agreementForm.acceptedTerms}
                  onChange={(e) => setAgreementForm({ ...agreementForm, acceptedTerms: e.target.checked })}
                  className="rounded text-orange-600 focus:ring-orange-500"
                  required
                />
                <span className="text-[11px] text-slate-700 font-semibold">
                  Tôi đã đọc và đồng ý với Quy chế Bán Chéo B2B của NovaExchange.
                </span>
              </label>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowDistributeModal(null)}
                  className="text-xs font-semibold"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md"
                >
                  Ký Thỏa Thuận & Nhận Bảng Hàng
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ĐĂNG NGUỒN HÀNG BÁN CHÉO MỚI ================= */}
      {showCreateModal && (
        <div 
          onClick={() => setShowCreateModal(false)}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus className="h-5 w-5 text-orange-400" />
                  Đăng Nguồn Hàng Bán Chéo Lên Sàn B2B
                </h3>
                <p className="text-xs text-slate-400 mt-1">Tiếp cận 3.850+ môi giới và đại lý liên kết toàn quốc</p>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListingSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Tiêu Đề Sản Phẩm BĐS *
                </label>
                <Input 
                  value={newListingForm.title}
                  onChange={(e) => setNewListingForm({ ...newListingForm, title: e.target.value })}
                  placeholder="Ví dụ: Biệt thự đơn lập phân khu The Rivus Elie Saab"
                  className="text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Giá Bán / Cho Thuê *
                  </label>
                  <Input 
                    value={newListingForm.price}
                    onChange={(e) => setNewListingForm({ ...newListingForm, price: e.target.value })}
                    placeholder="Ví dụ: 35 Tỷ hoặc 80 Tr/Tháng"
                    className="font-mono text-xs font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Phân Khúc
                  </label>
                  <select 
                    value={newListingForm.propertyCategory}
                    onChange={(e) => setNewListingForm({ ...newListingForm, propertyCategory: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                  >
                    <option value="Biệt thự">Biệt thự / Villa</option>
                    <option value="Căn hộ">Căn hộ cao cấp</option>
                    <option value="Shophouse">Shophouse</option>
                    <option value="Dinh thự">Dinh thự</option>
                    <option value="Nhà phố">Nhà phố thương mại</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Tỷ Lệ Chia Hoa Hồng
                  </label>
                  <select 
                    value={newListingForm.commSplit}
                    onChange={(e) => setNewListingForm({ ...newListingForm, commSplit: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                  >
                    <option value="50/50">50/50 (Chuẩn thị trường)</option>
                    <option value="40/60">40/60 (F2 nhận 60%)</option>
                    <option value="60/40">60/40 (F1 nhận 60%)</option>
                    <option value="Chỉ nhận khách">Chỉ nhận khách (100% cho F2)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Hoa Hồng F2 Thực Nhận
                  </label>
                  <Input 
                    value={newListingForm.f2Commission}
                    onChange={(e) => setNewListingForm({ ...newListingForm, f2Commission: e.target.value })}
                    placeholder="Ví dụ: 1.5% hoặc 1.8%"
                    className="font-mono text-xs font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Diện Tích (m²)
                  </label>
                  <Input 
                    type="number"
                    value={newListingForm.area}
                    onChange={(e) => setNewListingForm({ ...newListingForm, area: Number(e.target.value) })}
                    className="font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Số Phòng Ngủ
                  </label>
                  <Input 
                    type="number"
                    value={newListingForm.bedrooms}
                    onChange={(e) => setNewListingForm({ ...newListingForm, bedrooms: Number(e.target.value) })}
                    className="font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Pháp Lý
                  </label>
                  <select 
                    value={newListingForm.legalStatus}
                    onChange={(e) => setNewListingForm({ ...newListingForm, legalStatus: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold"
                  >
                    <option value="HĐMB">HĐMB</option>
                    <option value="Sổ hồng lâu dài">Sổ hồng lâu dài</option>
                    <option value="HĐ cọc">HĐ cọc</option>
                    <option value="GPXD">GPXD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Vị Trí Cụ Thể (Địa Chỉ)
                </label>
                <Input 
                  value={newListingForm.location}
                  onChange={(e) => setNewListingForm({ ...newListingForm, location: e.target.value })}
                  placeholder="Ví dụ: Đường số 5, Khu Thảo Điền, TP. Thủ Đức"
                  className="text-xs"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="text-xs font-semibold"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md"
                >
                  Đăng Bán Chéo Ngay
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: CHI TIẾT SẢN PHẨM ================= */}
      {selectedListingModal && (
        <div 
          onClick={() => setSelectedListingModal(null)}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden text-xs"
          >
            <div className="relative h-48 bg-slate-900 overflow-hidden">
              <img src={selectedListingModal.image} alt={selectedListingModal.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setSelectedListingModal(null)}
                  className="bg-black/50 text-white hover:bg-black/70 p-1.5 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <Badge className="bg-orange-600 text-white border-none text-[10px] mb-1 font-bold">
                  {selectedListingModal.type} • {selectedListingModal.propertyCategory}
                </Badge>
                <h3 className="text-white font-black text-base line-clamp-1">{selectedListingModal.title}</h3>
                <div className="text-slate-300 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-orange-400" /> {selectedListingModal.location}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-baseline p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 font-medium">Giá niêm yết:</span>
                  <div className="text-xl font-black text-rose-600 font-mono mt-0.5">{selectedListingModal.price}</div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-medium">Hoa hồng F2 thực nhận:</span>
                  <div className="text-lg font-black text-orange-600 font-mono mt-0.5">{selectedListingModal.f2Commission}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-slate-400 block text-[10px]">Diện tích</span>
                  <span className="font-bold text-slate-800">{selectedListingModal.area} m²</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Phòng ngủ</span>
                  <span className="font-bold text-slate-800">{selectedListingModal.bedrooms || 'N/A'} PN</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Pháp lý</span>
                  <span className="font-bold text-slate-800">{selectedListingModal.legalStatus}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-1">Mô tả chi tiết & Tiêu chuẩn bàn giao:</span>
                <p className="p-3 bg-slate-50 rounded-xl text-slate-600 leading-relaxed text-[11px]">
                  {selectedListingModal.description || 'Sản phẩm giỏ hàng F1 độc quyền được phân phối chính thức qua sàn liên kết NovaExchange.'}
                </p>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50/60 rounded-xl border border-orange-200/80">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 bg-orange-100 text-xs font-bold text-orange-700">
                    <AvatarFallback>{selectedListingModal.ownerAvatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-slate-900">{selectedListingModal.ownerAgency}</div>
                    <div className="text-[10px] text-slate-500">Chủ nguồn hàng F1 • Đã kiểm toán pháp lý</div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => showToast(`Đang gọi tới hotline chủ nguồn hàng: ${selectedListingModal.phone || '0901 234 567'}`, 'info')}
                  className="text-xs h-8 border-orange-300 text-orange-800"
                >
                  <Phone className="h-3.5 w-3.5 mr-1" /> Gọi F1
                </Button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedListingModal(null)}
                  className="text-xs"
                >
                  Đóng
                </Button>
                {!selectedListingModal.distributedByMe && (
                  <Button 
                    onClick={() => {
                      const item = selectedListingModal
                      setSelectedListingModal(null)
                      setShowDistributeModal(item)
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
                  >
                    Ký Thỏa Thuận Bán Chéo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: GỬI LỜI MỜI HỢP TÁC ĐẠI LÝ ================= */}
      {selectedAgencyInviteModal && (
        <div 
          onClick={() => setSelectedAgencyInviteModal(null)}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden text-xs"
          >
            <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-orange-400" />
                  Mời Hợp Tác Đại Lý B2B
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Gửi lời mời liên kết bán chéo tới {selectedAgencyInviteModal.name}</p>
              </div>
              <button 
                onClick={() => setSelectedAgencyInviteModal(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">{selectedAgencyInviteModal.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Phân cấp: <strong className="text-orange-600">{selectedAgencyInviteModal.tier}</strong> • Đánh giá: <strong>{selectedAgencyInviteModal.rating} ⭐</strong>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Nội Dung Thư Mời Hợp Tác
                </label>
                <textarea 
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs min-h-[90px] focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedAgencyInviteModal(null)}
                  className="text-xs"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={() => {
                    showToast(`Đã gửi lời mời hợp tác phân phối chính thức tới ${selectedAgencyInviteModal.name}!`, 'success')
                    setSelectedAgencyInviteModal(null)
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
                >
                  Gửi Lời Mời Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
