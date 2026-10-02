"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  Gavel, Flame, Timer, Trophy, ShieldCheck, Users, DollarSign, 
  ArrowUpRight, Clock, Plus, Download, CheckCircle2, AlertCircle, 
  Eye, FileText, Check, X, RefreshCw, Sparkles, Building, Video, 
  Volume2, Shield, ArrowRight, Play, History, Award, CheckCircle
} from 'lucide-react'
import { AuctionPropertyItem, AuctionBid, EscrowDepositItem, AuctionStatus } from '@/types'

// INITIAL MOCK DATA
const INITIAL_AUCTIONS: AuctionPropertyItem[] = [
  {
    id: 'AUC-101',
    code: 'NVW-01.01',
    title: 'Biệt Thự Biển Đơn Lập VIP Tổng Thống',
    projectName: 'NovaWorld Phan Thiet',
    projectId: 'p1',
    type: 'Biệt thự biển đơn lập',
    area: 250,
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Đông Nam',
    view: 'Trực diện Biển Bikini Beach',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    floorPrice: 25000000000,
    currentBid: 27800000000,
    reservePrice: 28500000000,
    bidStep: 100000000,
    depositRequired: 500000000,
    totalBids: 18,
    startTime: 'Hôm nay, 14:00',
    endTime: 'Hôm nay, 16:30',
    status: 'live',
    countdownSeconds: 274,
    hostName: 'Đấu Giá Viên: ThS. Luật Sư Lê Quang Hải',
    winnerName: 'Nguyễn V*** T*** (Mã BID: #9901)',
    winningAmount: 27800000000
  },
  {
    id: 'AUC-102',
    code: 'TGM-PH.01',
    title: 'Sky Penthouse Duplex Triệu Đô Lõi Quận 1',
    projectName: 'The Grand Manhattan',
    projectId: 'p3',
    type: 'Penthouse Duplex',
    area: 320,
    bedrooms: 4,
    bathrooms: 5,
    direction: 'Nam',
    view: 'Toàn cảnh Sông Sài Gòn & Bến Nhà Rồng',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    floorPrice: 45000000000,
    currentBid: 48600000000,
    reservePrice: 50000000000,
    bidStep: 200000000,
    depositRequired: 1000000000,
    totalBids: 12,
    startTime: 'Hôm nay, 15:00',
    endTime: 'Hôm nay, 17:00',
    status: 'live',
    countdownSeconds: 840,
    hostName: 'Đấu Giá Viên: Trần Quốc Bảo (Sở Tư Pháp)'
  },
  {
    id: 'AUC-103',
    code: 'TGC-DT08',
    title: 'Dinh Thự Ven Sông The Canal Walk',
    projectName: 'The Global City',
    projectId: 'p5',
    type: 'Dinh thự sinh thái',
    area: 450,
    bedrooms: 5,
    bathrooms: 6,
    direction: 'Đông',
    view: 'Kênh đào Nhạc nước lớn nhất Đông Nam Á',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    floorPrice: 68000000000,
    currentBid: 68000000000,
    reservePrice: 72000000000,
    bidStep: 500000000,
    depositRequired: 1000000000,
    totalBids: 4,
    startTime: 'Hôm nay, 16:00',
    endTime: 'Hôm nay, 18:00',
    status: 'live',
    countdownSeconds: 2400,
    hostName: 'Đấu Giá Viên: Nguyễn Mai Phương'
  },
  {
    id: 'AUC-104',
    code: 'AQC-PH.02',
    title: 'Biệt Thự Đảo Phượng Hoàng Phoenix South',
    projectName: 'Aqua City',
    projectId: 'p2',
    type: 'Biệt thự đảo sinh thái',
    area: 300,
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Đông Nam',
    view: 'Sông Đồng Nai uốn lượn',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    floorPrice: 32000000000,
    currentBid: 32000000000,
    reservePrice: 35000000000,
    bidStep: 100000000,
    depositRequired: 500000000,
    totalBids: 0,
    startTime: 'Ngày mai, 09:30 AM',
    endTime: 'Ngày mai, 11:30 AM',
    status: 'upcoming',
    countdownSeconds: 86400,
    hostName: 'Đấu Giá Viên: Vũ Quốc Hưng'
  },
  {
    id: 'AUC-100',
    code: 'VGP-V05',
    title: 'Dinh Thự The Manhattan Glory Bên Hồ Súng',
    projectName: 'Vinhomes Grand Park',
    projectId: 'p4',
    type: 'Dinh thự đơn lập',
    area: 380,
    bedrooms: 5,
    bathrooms: 5,
    direction: 'Đông Bắc',
    view: 'Đại công viên 36ha & Bến du thuyền VIP',
    imageUrl: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    floorPrice: 52000000000,
    currentBid: 58500000000,
    reservePrice: 55000000000,
    bidStep: 200000000,
    depositRequired: 1000000000,
    totalBids: 24,
    startTime: '15/07/2026',
    endTime: '15/07/2026',
    status: 'completed',
    countdownSeconds: 0,
    hostName: 'Đấu Giá Viên: ThS. Luật Sư Lê Quang Hải',
    winnerName: 'Trần T*** B*** (Mã BID: #8822)',
    winningAmount: 58500000000
  }
]

const INITIAL_BIDS: AuctionBid[] = [
  { id: 'bid-1', auctionId: 'AUC-101', bidderId: 'u-1', bidderNameMasked: 'Nguyễn V*** T***', bidderPhoneMasked: '0901***567', amount: 27800000000, timestamp: '14:26:15', isWinningBid: true },
  { id: 'bid-2', auctionId: 'AUC-101', bidderId: 'u-2', bidderNameMasked: 'Phạm M*** T***', bidderPhoneMasked: '0912***654', amount: 27700000000, timestamp: '14:25:50' },
  { id: 'bid-3', auctionId: 'AUC-101', bidderId: 'u-3', bidderNameMasked: 'Trần T*** B***', bidderPhoneMasked: '0912***678', amount: 27500000000, timestamp: '14:24:12' },
  { id: 'bid-4', auctionId: 'AUC-101', bidderId: 'u-4', bidderNameMasked: 'Vũ T*** T***', bidderPhoneMasked: '0966***433', amount: 27200000000, timestamp: '14:21:05' },
  { id: 'bid-5', auctionId: 'AUC-101', bidderId: 'u-5', bidderNameMasked: 'Đặng Q*** H***', bidderPhoneMasked: '0977***900', amount: 26800000000, timestamp: '14:15:30' },
  { id: 'bid-6', auctionId: 'AUC-101', bidderId: 'u-1', bidderNameMasked: 'Nguyễn V*** T***', bidderPhoneMasked: '0901***567', amount: 26500000000, timestamp: '14:10:00' },
]

const INITIAL_ESCROWS: EscrowDepositItem[] = [
  { id: 'esc-01', auctionId: 'AUC-101', propertyCode: 'NVW-01.01', customerId: 'c1', customerName: 'Nguyễn Văn Tuấn', customerPhone: '0901234567', amount: 500000000, paymentMethod: 'VietQR Pro', status: 'da_ky_quy', transactionCode: 'TXN-98214710', depositedAt: '19/07/2026 10:15' },
  { id: 'esc-02', auctionId: 'AUC-101', propertyCode: 'NVW-01.01', customerId: 'c4', customerName: 'Phạm Minh Tuấn', customerPhone: '0912987654', amount: 500000000, paymentMethod: 'Chuyển khoản VCB', status: 'da_ky_quy', transactionCode: 'TXN-88129301', depositedAt: '19/07/2026 11:30' },
  { id: 'esc-03', auctionId: 'AUC-102', propertyCode: 'TGM-PH.01', customerId: 'c2', customerName: 'Trần Thị Bích Ngọc', customerPhone: '0912345678', amount: 1000000000, paymentMethod: 'VietQR Pro', status: 'da_ky_quy', transactionCode: 'TXN-77382109', depositedAt: '19/07/2026 09:00' },
  { id: 'esc-04', auctionId: 'AUC-103', propertyCode: 'TGC-DT08', customerId: 'c7', customerName: 'Vũ Thu Trang', customerPhone: '0966554433', amount: 1000000000, paymentMethod: 'Chuyển khoản VCB', status: 'da_ky_quy', transactionCode: 'TXN-66481023', depositedAt: '18/07/2026 16:45' },
  { id: 'esc-05', auctionId: 'AUC-100', propertyCode: 'VGP-V05', customerId: 'c2', customerName: 'Trần Thị Bích Ngọc', customerPhone: '0912345678', amount: 1000000000, paymentMethod: 'VietQR Pro', status: 'chuyen_thanh_tien_coc', transactionCode: 'TXN-55102948', depositedAt: '14/07/2026 14:00' },
  { id: 'esc-06', auctionId: 'AUC-100', propertyCode: 'VGP-V05', customerId: 'c6', customerName: 'Đặng Quốc Huy', customerPhone: '0977889900', amount: 1000000000, paymentMethod: 'Chuyển khoản VCB', status: 'da_hoan_coc', transactionCode: 'TXN-44910283', depositedAt: '14/07/2026 15:30', refundedAt: '16/07/2026 10:00' },
]

export default function PropertyAuctionPage() {
  const [activeTab, setActiveTab] = useState<'live_auctions' | 'catalog' | 'escrow' | 'history'>('live_auctions')
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Data States
  const [auctions, setAuctions] = useState<AuctionPropertyItem[]>(INITIAL_AUCTIONS)
  const [bids, setBids] = useState<AuctionBid[]>(INITIAL_BIDS)
  const [escrows, setEscrows] = useState<EscrowDepositItem[]>(INITIAL_ESCROWS)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Modals States (5 Modals)
  const [showRegisterBidderModal, setShowRegisterBidderModal] = useState(false)
  const [showCreateAuctionModal, setShowCreateAuctionModal] = useState(false)
  const [selectedLiveRoom, setSelectedLiveRoom] = useState<AuctionPropertyItem | null>(null)
  const [selectedWinnerModal, setSelectedWinnerModal] = useState<AuctionPropertyItem | null>(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [selectedEscrowForRefund, setSelectedEscrowForRefund] = useState<EscrowDepositItem | null>(null)

  // Live Room State
  const [liveCurrentBid, setLiveCurrentBid] = useState(27800000000)
  const [liveTimer, setLiveTimer] = useState(274)
  const [liveBidsList, setLiveBidsList] = useState<AuctionBid[]>(INITIAL_BIDS)
  const [customBidInput, setCustomBidInput] = useState('')

  // Modal 1 Form: Ký quỹ
  const [regAuctionId, setRegAuctionId] = useState('AUC-101')
  const [regCustomerName, setRegCustomerName] = useState('Lê Hoàng Cường')
  const [regCustomerPhone, setRegCustomerPhone] = useState('0987654321')
  const [regPaymentMethod, setRegPaymentMethod] = useState<'VietQR Pro' | 'Chuyển khoản VCB'>('VietQR Pro')

  // Modal 2 Form: Khởi tạo phiên
  const [newPropCode, setNewPropCode] = useState('AQC-12A.01')
  const [newPropTitle, setNewPropTitle] = useState('Nhà Phố Đảo Phượng Hoàng View Kênh Sông')
  const [newPropFloorPrice, setNewPropFloorPrice] = useState('16500000000')
  const [newPropBidStep, setNewPropBidStep] = useState('100000000')
  const [newPropDeposit, setNewPropDeposit] = useState('500000000')
  const [newHostName, setNewHostName] = useState('Đấu Giá Viên: ThS. Luật Sư Lê Quang Hải')

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  // Native Web Audio Gavel Sound (Synthesized knock)
  const playGavelSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140, audioCtx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12)
      gain.gain.setValueAtTime(1, audioCtx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start()
      osc.stop(audioCtx.currentTime + 0.15)
    } catch {
      // Audio fallback
    }
  }

  // Timer Effect for Live Room
  useEffect(() => {
    if (!selectedLiveRoom) return
    const interval = setInterval(() => {
      setLiveTimer(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [selectedLiveRoom])

  // Action: Đặt giá trong phòng Live
  const handlePlaceBid = (addAmount: number) => {
    playGavelSound()
    const nextAmount = liveCurrentBid + addAmount
    setLiveCurrentBid(nextAmount)
    setLiveTimer(300) // Reset 5 minutes on new bid
    
    const newBid: AuctionBid = {
      id: `bid-${Date.now()}`,
      auctionId: selectedLiveRoom?.id || 'AUC-101',
      bidderId: 'me-vip',
      bidderNameMasked: 'Bạn (VIP #007)',
      bidderPhoneMasked: '0909***999',
      amount: nextAmount,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isWinningBid: true
    }

    setLiveBidsList(prev => [newBid, ...prev.map(b => ({ ...b, isWinningBid: false }))])
    showToast(`Đã gõ búa đặt giá thành công: ${(nextAmount / 1000000000).toFixed(2)} Tỷ VNĐ!`)
  }

  // Action: Submit Modal 1 (Ký Quỹ)
  const handleRegisterEscrow = (e: React.FormEvent) => {
    e.preventDefault()
    const matchedAuc = auctions.find(a => a.id === regAuctionId)
    const newEscrow: EscrowDepositItem = {
      id: `esc-${Date.now()}`,
      auctionId: regAuctionId,
      propertyCode: matchedAuc?.code || 'NVW-01.01',
      customerId: `c-${Date.now()}`,
      customerName: regCustomerName,
      customerPhone: regCustomerPhone,
      amount: matchedAuc?.depositRequired || 500000000,
      paymentMethod: regPaymentMethod,
      status: 'da_ky_quy',
      transactionCode: `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      depositedAt: `Hôm nay, ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`
    }

    setEscrows(prev => [newEscrow, ...prev])
    setShowRegisterBidderModal(false)
    showToast(`Ký quỹ thành công ${(newEscrow.amount / 1000000).toLocaleString()} Tr VNĐ cho phiên [${newEscrow.propertyCode}]! Mã số thẻ BID đã được kích hoạt.`)
  }

  // Action: Submit Modal 2 (Tạo Phiên Mới)
  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault()
    const newAuc: AuctionPropertyItem = {
      id: `AUC-${Math.floor(200 + Math.random() * 800)}`,
      code: newPropCode,
      title: newPropTitle,
      projectName: 'Aqua City',
      projectId: 'p2',
      type: 'Nhà phố thương mại',
      area: 160,
      bedrooms: 4,
      bathrooms: 4,
      direction: 'Đông Nam',
      view: 'Kênh sông Phượng Hoàng',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      floorPrice: Number(newPropFloorPrice),
      currentBid: Number(newPropFloorPrice),
      reservePrice: Number(newPropFloorPrice) * 1.15,
      bidStep: Number(newPropBidStep),
      depositRequired: Number(newPropDeposit),
      totalBids: 0,
      startTime: 'Ngày mai, 14:00',
      endTime: 'Ngày mai, 16:00',
      status: 'upcoming',
      countdownSeconds: 86400,
      hostName: newHostName
    }

    setAuctions(prev => [newAuc, ...prev])
    setShowCreateAuctionModal(false)
    showToast(`Đã ban hành phiên đấu giá mới [${newAuc.code}] thành công với giá khởi điểm ${(newAuc.floorPrice / 1000000000).toFixed(2)} Tỷ VNĐ!`)
  }

  // Action: Hoàn tiền ký quỹ
  const handleConfirmRefund = () => {
    if (!selectedEscrowForRefund) return
    setEscrows(prev => prev.map(item => item.id === selectedEscrowForRefund.id ? { ...item, status: 'da_hoan_coc', refundedAt: new Date().toLocaleDateString('vi-VN') } : item))
    setShowRefundModal(false)
    showToast(`Đã hoàn tất lệnh chuyển khoản hoàn trả 100% tiền ký quỹ cho khách hàng [${selectedEscrowForRefund.customerName}]!`)
  }

  // Action: Xuất CSV UTF-8 BOM
  const handleExportCSV = () => {
    let csv = '\uFEFF'
    csv += 'SO THEO DOI PHIEN DAU GIA BAT DONG SAN (AUCTION REGISTRY)\r\n'
    csv += 'Mã Phiên,Mã Căn,Tên Tài Sản,Dự Án,Giá Khởi Điểm,Giá Cao Nhất Hiện Tại,Bước Giá,Tiền Ký Quỹ,Lượt Bid,Trạng Thái\r\n'
    auctions.forEach(a => {
      csv += `"${a.id}","${a.code}","${a.title}","${a.projectName}","${a.floorPrice}","${a.currentBid}","${a.bidStep}","${a.depositRequired}","${a.totalBids}","${a.status}"\r\n`
    })

    csv += '\r\n\r\nNHAT KY KY QUY DAT COC (ESCROW DEPOSITS)\r\n'
    csv += 'Mã Ký Quỹ,Phiên Đấu Giá,Mã Căn,Nhà Đầu Tư,Số Điện Thoại,Số Tiền Ký Quỹ,Phương Thức,Trạng Thái,Mã Giao Dịch,Thời Gian\r\n'
    escrows.forEach(e => {
      csv += `"${e.id}","${e.auctionId}","${e.propertyCode}","${e.customerName}","${e.customerPhone}","${e.amount}","${e.paymentMethod}","${e.status}","${e.transactionCode}","${e.depositedAt}"\r\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `NovaCRM_Auction_Escrow_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Đã xuất báo cáo Phiên đấu giá & Sổ ký quỹ (CSV UTF-8 BOM) thành công!")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Gavel className="h-64 w-64 text-amber-400 -mt-10 -mr-10" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-amber-600 text-white border-none font-bold text-xs uppercase tracking-wider px-3 py-1 flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 animate-pulse" /> Phân Hệ 34 / 34 • E-Auction & VIP Bidding Floor
            </Badge>
            <Badge variant="outline" className="border-amber-400/40 text-amber-300 font-mono text-xs flex items-center gap-1.5 bg-amber-500/10">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
              Sàn Đấu Giá Minh Bạch Chuẩn Pháp Luật 2024
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
            <Gavel className="h-8 w-8 text-amber-400" />
            Sàn Đấu Giá Bất Động Sản Trực Tuyến & Phòng Bidding VIP
          </h1>
          <p className="text-slate-300 mt-2 text-sm leading-relaxed">
            Đấu giá trực tiếp các siêu phẩm bất động sản độc bản: Dinh thự ven sông, Penthouse lõi trung tâm và Shophouse đại lộ biển. 
            Cơ chế khớp lệnh thời gian thực, quản lý ký quỹ tự động và hợp đồng trúng đấu giá ký số điện tử.
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
            onClick={() => setShowRegisterBidderModal(true)}
          >
            <ShieldCheck className="h-4 w-4 mr-1.5 text-amber-400" /> 
            Ký Quỹ Đấu Giá
          </Button>

          <Button 
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30"
            onClick={() => setShowCreateAuctionModal(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" /> 
            Khởi Tạo Phiên Mới
          </Button>
        </div>
      </div>

      {/* 4 MACRO KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tổng Phiên Đấu Giá</div>
              <div className="text-2xl font-black text-slate-900">12 Phiên</div>
              <div className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 animate-pulse" /> 3 Phiên Đang Live Trực Tiếp
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Gavel className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Khách Đã Ký Quỹ Đấu Giá</div>
              <div className="text-2xl font-black text-blue-600">{escrows.filter(e => e.status === 'da_ky_quy').length} Nhà Đầu Tư</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Tổng quỹ giữ: <strong>36.5 Tỷ VNĐ</strong>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Lượt Đặt Giá Trong Ngày</div>
              <div className="text-2xl font-black text-emerald-600">86 Lượt BID</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Tăng trưởng +35% thanh khoản
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ArrowUpRight className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tổng Giá Trị Khớp Lệnh</div>
              <div className="text-2xl font-black text-purple-700">385.5 Tỷ VNĐ</div>
              <div className="text-xs text-emerald-600 font-medium mt-1">
                Thặng dư: <strong>+18.2%</strong> so với giá sàn
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Trophy className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-xs overflow-x-auto gap-1">
        {[
          { id: 'live_auctions', label: 'Sàn Đấu Giá Trực Tiếp (Live)', icon: <Flame className="h-4 w-4" />, count: auctions.filter(a => a.status === 'live').length },
          { id: 'catalog', label: 'Danh Mục Tài Sản Đấu Giá', icon: <Building className="h-4 w-4" />, count: auctions.length },
          { id: 'escrow', label: 'Sổ Ký Quỹ Đặt Cọc (Escrow Vault)', icon: <ShieldCheck className="h-4 w-4" />, count: escrows.length },
          { id: 'history', label: 'Lịch Sử Khớp Lệnh & Hợp Đồng', icon: <History className="h-4 w-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === tab.id ? 'bg-white text-amber-700' : 'bg-slate-200 text-slate-600'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* =========================================================================
          TAB 1: SÀN ĐẤU GIÁ TRỰC TIẾP (LIVE AUCTIONS)
         ========================================================================= */}
      {activeTab === 'live_auctions' && (
        <div className="space-y-6">
          {/* HERO LIVE AUCTION CARD */}
          {auctions.find(a => a.id === 'AUC-101') && (() => {
            const hero = auctions.find(a => a.id === 'AUC-101')!
            return (
              <Card className="border-amber-300 shadow-xl overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white relative">
                <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  {/* Left: Image & Badge */}
                  <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 group">
                    <img 
                      src={hero.imageUrl} 
                      alt={hero.title} 
                      className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-rose-600 text-white font-bold text-xs uppercase px-2.5 py-1 flex items-center gap-1.5 animate-pulse shadow-lg">
                        <Flame className="h-3.5 w-3.5" /> LIVE BIDDING
                      </Badge>
                      <Badge className="bg-black/70 backdrop-blur-md text-amber-300 font-mono text-xs border border-amber-400/30">
                        {hero.code}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-xs flex justify-between items-center">
                      <span className="text-slate-300">{hero.projectName}</span>
                      <span className="font-bold text-amber-400">{hero.area} m² • {hero.bedrooms}PN</span>
                    </div>
                  </div>

                  {/* Right: Bidding Details & Action */}
                  <div className="lg:col-span-7 space-y-5">
                    <div>
                      <span className="text-amber-400 font-semibold text-xs uppercase tracking-wider">Phiên Đấu Giá Siêu Phẩm Biển Độc Bản</span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 leading-tight">{hero.title}</h2>
                      <p className="text-slate-300 text-xs mt-1.5">{hero.view} • {hero.direction} • Bàn giao full nội thất cao cấp</p>
                    </div>

                    {/* Price & Timer Box */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                      <div>
                        <div className="text-xs text-slate-400 font-medium">Giá Cao Nhất Hiện Tại (Current Bid)</div>
                        <div className="text-3xl font-black text-amber-400 mt-1">
                          {(hero.currentBid / 1000000000).toFixed(2)} Tỷ VNĐ
                        </div>
                        <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                          <ArrowUpRight className="h-3.5 w-3.5" /> +{((hero.currentBid - hero.floorPrice) / 1000000000).toFixed(1)} Tỷ so với giá sàn
                        </div>
                      </div>

                      <div className="border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-4 pt-3 sm:pt-0">
                        <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                          <Timer className="h-3.5 w-3.5 text-rose-400" /> Đếm Ngược Khớp Lệnh
                        </div>
                        <div className="text-3xl font-mono font-bold text-rose-400 mt-1">
                          00:04:32
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          Bước giá: <strong>+{(hero.bidStep / 1000000).toLocaleString()} Tr</strong> • Ký quỹ: 500Tr
                        </div>
                      </div>
                    </div>

                    {/* Host & Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-slate-400">
                        <div>Điều hành: <strong className="text-slate-200">{hero.hostName}</strong></div>
                        <div>Đang dẫn đầu: <strong className="text-amber-300">{hero.winnerName}</strong></div>
                      </div>

                      <Button 
                        size="lg" 
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm px-6 py-6 rounded-xl shadow-lg shadow-amber-500/20 w-full sm:w-auto"
                        onClick={() => {
                          setSelectedLiveRoom(hero)
                          setLiveCurrentBid(hero.currentBid)
                          setLiveTimer(hero.countdownSeconds)
                        }}
                      >
                        <Gavel className="h-5 w-5 mr-2" /> VÀO PHÒNG ĐẤU GIÁ VIP
                      </Button>
                    </div>

                  </div>
                </div>
              </Card>
            )
          })()}

          {/* GRID OF OTHER LIVE & UPCOMING SESSIONS */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Các Phiên Đấu Giá Khác Đang Diễn Ra & Sắp Mở</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {auctions.filter(a => a.id !== 'AUC-101' && a.status !== 'completed').map(auc => (
                <Card key={auc.id} className="shadow-sm border-slate-200 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img src={auc.imageUrl} alt={auc.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 left-2.5 flex gap-1.5">
                        {auc.status === 'live' ? (
                          <Badge className="bg-rose-600 text-white text-[10px] font-bold uppercase animate-pulse">LIVE</Badge>
                        ) : (
                          <Badge className="bg-blue-600 text-white text-[10px] font-bold uppercase">SẮP MỞ</Badge>
                        )}
                        <Badge className="bg-black/60 text-white text-[10px] font-mono">{auc.code}</Badge>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-md">
                        Ký quỹ: {(auc.depositRequired / 1000000).toLocaleString()} Tr
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-2">
                      <div className="text-[11px] font-semibold text-slate-500">{auc.projectName}</div>
                      <div className="font-bold text-sm text-slate-900 leading-tight">{auc.title}</div>
                      <div className="text-xs text-slate-500">{auc.area} m² • {auc.direction} • {auc.view}</div>

                      <div className="p-2.5 bg-slate-50 rounded-lg border flex justify-between items-center text-xs mt-3">
                        <div>
                          <div className="text-[10px] text-slate-400">Giá hiện tại</div>
                          <div className="font-black text-amber-700 text-base">
                            {(auc.currentBid / 1000000000).toFixed(2)} Tỷ
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Lượt bid</div>
                          <div className="font-bold text-slate-800">{auc.totalBids} lượt</div>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="p-4 pt-0 border-t mt-3 flex justify-between items-center text-xs">
                    <span className="text-[11px] text-slate-500">{auc.startTime}</span>
                    <Button 
                      size="sm" 
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                      onClick={() => {
                        setSelectedLiveRoom(auc)
                        setLiveCurrentBid(auc.currentBid)
                        setLiveTimer(auc.countdownSeconds)
                      }}
                    >
                      {auc.status === 'live' ? 'Vào Phòng Bid' : 'Xem Chi Tiết'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: DANH MỤC TÀI SẢN ĐẤU GIÁ (CATALOG)
         ========================================================================= */}
      {activeTab === 'catalog' && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-gradient-to-r from-amber-50/50 to-white pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <Building className="h-5 w-5 text-amber-600" />
                  Danh Mục Siêu Phẩm Bất Động Sản Đấu Giá
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-1">
                  Thông số quy hoạch 1/500, hồ sơ pháp lý minh bạch và điều kiện tham gia đấu giá của từng tài sản.
                </CardDescription>
              </div>
              <Button 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                onClick={() => setShowRegisterBidderModal(true)}
              >
                <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Đăng Ký Ký Quỹ
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3.5 font-bold">Mã Căn & Siêu Phẩm</th>
                  <th className="p-3.5 font-bold">Dự Án & Loại BĐS</th>
                  <th className="p-3.5 font-bold">Giá Khởi Điểm (Floor)</th>
                  <th className="p-3.5 font-bold">Giá Hiện Tại / Giá Khớp</th>
                  <th className="p-3.5 font-bold">Tiền Ký Quỹ (Escrow)</th>
                  <th className="p-3.5 font-bold text-center">Trạng Thái</th>
                  <th className="p-3.5 font-bold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auctions.map(auc => (
                  <tr key={auc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-sm text-amber-800">{auc.code}</div>
                      <div className="text-[11px] text-slate-700 font-medium">{auc.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{auc.area} m² • {auc.view}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{auc.projectName}</div>
                      <div className="text-[11px] text-slate-500">{auc.type}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-800">
                      {(auc.floorPrice / 1000000000).toFixed(2)} Tỷ
                    </td>
                    <td className="p-3.5 font-mono font-black text-amber-600">
                      {(auc.currentBid / 1000000000).toFixed(2)} Tỷ
                      <div className="text-[10px] font-normal text-slate-400">{auc.totalBids} lượt trả giá</div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-700">
                      {(auc.depositRequired / 1000000).toLocaleString()} Tr VNĐ
                    </td>
                    <td className="p-3.5 text-center">
                      {auc.status === 'live' && <Badge className="bg-rose-100 text-rose-800 border-none font-bold text-[10px]">Đang Live</Badge>}
                      {auc.status === 'upcoming' && <Badge className="bg-blue-100 text-blue-800 border-none font-bold text-[10px]">Sắp Mở</Badge>}
                      {auc.status === 'completed' && <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-[10px]">Đã Chốt Búa</Badge>}
                    </td>
                    <td className="p-3.5 text-right space-y-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7"
                        onClick={() => {
                          setSelectedLiveRoom(auc)
                          setLiveCurrentBid(auc.currentBid)
                          setLiveTimer(auc.countdownSeconds)
                        }}
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> Chi Tiết
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 3: SỔ KÝ QUỸ ĐẶT CỌC (ESCROW VAULT)
         ========================================================================= */}
      {activeTab === 'escrow' && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-white pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                  Sổ Ký Quỹ Tài Khoản Phong Tỏa (Escrow Vault)
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-1">
                  Đảm bảo năng lực tài chính của nhà đầu tư. Tiền ký quỹ được hoàn trả 100% trong 24h nếu không trúng đấu giá.
                </CardDescription>
              </div>
              <Button 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                onClick={() => setShowRegisterBidderModal(true)}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Thêm Lệnh Ký Quỹ
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700">
                <tr>
                  <th className="p-3.5 font-bold">Mã Giao Dịch & Thời Gian</th>
                  <th className="p-3.5 font-bold">Nhà Đầu Tư VIP</th>
                  <th className="p-3.5 font-bold">Căn Hộ Đấu Giá</th>
                  <th className="p-3.5 font-bold">Số Tiền Ký Quỹ</th>
                  <th className="p-3.5 font-bold">Phương Thức</th>
                  <th className="p-3.5 font-bold text-center">Trạng Thái Ký Quỹ</th>
                  <th className="p-3.5 font-bold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {escrows.map(esc => (
                  <tr key={esc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-slate-800">{esc.transactionCode}</div>
                      <div className="text-[10px] text-slate-400">{esc.depositedAt}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{esc.customerName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{esc.customerPhone}</div>
                    </td>
                    <td className="p-3.5">
                      <Badge variant="outline" className="font-mono text-amber-700 font-bold">{esc.propertyCode}</Badge>
                    </td>
                    <td className="p-3.5 font-mono font-black text-slate-800">
                      {(esc.amount / 1000000).toLocaleString()} Triệu VNĐ
                    </td>
                    <td className="p-3.5 font-semibold text-slate-600">
                      {esc.paymentMethod}
                    </td>
                    <td className="p-3.5 text-center">
                      {esc.status === 'da_ky_quy' && <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-[10px]">Đang Ký Quỹ (Active)</Badge>}
                      {esc.status === 'chuyen_thanh_tien_coc' && <Badge className="bg-purple-100 text-purple-800 border-none font-bold text-[10px]">Đã Chuyển Tiền Cọc</Badge>}
                      {esc.status === 'da_hoan_coc' && <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[10px]">Đã Hoàn Cọc</Badge>}
                    </td>
                    <td className="p-3.5 text-right">
                      {esc.status === 'da_ky_quy' ? (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-7 text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                          onClick={() => {
                            setSelectedEscrowForRefund(esc)
                            setShowRefundModal(true)
                          }}
                        >
                          Hoàn Cọc
                        </Button>
                      ) : (
                        <span className="text-[11px] text-slate-400">Đã quyết toán</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          TAB 4: LỊCH SỬ KHỚP LỆNH & HỢP ĐỒNG (HISTORY & CONTRACTS)
         ========================================================================= */}
      {activeTab === 'history' && (
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50/50 to-white pb-4">
            <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
              <Trophy className="h-5 w-5 text-purple-600" />
              Sổ Kết Quả Trúng Đấu Giá & Hợp Đồng Bàn Giao
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs mt-1">
              Biên bản đấu giá hợp pháp, có giá trị chuyển nhượng ngay sang Hợp đồng đặt cọc chính thức.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {auctions.filter(a => a.status === 'completed' || a.winnerName).map(auc => (
              <div key={auc.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/60 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{auc.code} • {auc.title}</span>
                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold">Đã Khớp Lệnh Thành Công</Badge>
                  </div>
                  <div className="text-xs text-slate-600">
                    Người trúng đấu giá: <strong className="text-slate-900">{auc.winnerName}</strong>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-3">
                    <span>Giá sàn: <strong>{(auc.floorPrice / 1000000000).toFixed(2)} Tỷ</strong></span>
                    <span>➔</span>
                    <span>Giá trúng búa: <strong className="text-amber-700 text-sm font-black font-mono">{((auc.winningAmount || auc.currentBid) / 1000000000).toFixed(2)} Tỷ VNĐ</strong></span>
                    <span>(Thặng dư: +{(((auc.winningAmount || auc.currentBid) - auc.floorPrice) / 1000000000).toFixed(2)} Tỷ)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => setSelectedWinnerModal(auc)}
                  >
                    <FileText className="h-3.5 w-3.5 mr-1 text-purple-600" /> Xem Biên Bản A4
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* =========================================================================
          5 INTERACTIVE MODALS
         ========================================================================= */}

      {/* MODAL 1: Đăng Ký Ký Quỹ Đấu Giá */}
      <Dialog open={showRegisterBidderModal} onOpenChange={setShowRegisterBidderModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-950">
              <ShieldCheck className="h-5 w-5 text-amber-600" />
              Đăng Ký Tham Gia & Ký Quỹ Đấu Giá VIP
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Ký quỹ tài khoản phong tỏa an toàn để nhận Mã Định Danh BID tham gia trả giá.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegisterEscrow} className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Chọn Phiên Đấu Giá *</label>
              <select 
                value={regAuctionId}
                onChange={(e) => setRegAuctionId(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
              >
                {auctions.filter(a => a.status !== 'completed').map(a => (
                  <option key={a.id} value={a.id}>{a.code} — {a.title} (Ký quỹ: {(a.depositRequired / 1000000).toLocaleString()} Tr)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Họ và Tên Nhà Đầu Tư VIP *</label>
              <Input 
                value={regCustomerName}
                onChange={(e) => setRegCustomerName(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Số Điện Thoại Xác Thực OTP *</label>
              <Input 
                value={regCustomerPhone}
                onChange={(e) => setRegCustomerPhone(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Phương Thức Thanh Toán Ký Quỹ</label>
              <select 
                value={regPaymentMethod}
                onChange={(e) => setRegPaymentMethod(e.target.value as any)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
              >
                <option value="VietQR Pro">VietQR Pro 24/7 (Gạch nợ tức thì)</option>
                <option value="Chuyển khoản VCB">Chuyển khoản Vietcombank Hội Sở</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
              <strong>Cam kết pháp lý:</strong> Tiền ký quỹ sẽ được phong tỏa tại Ngân hàng bảo lãnh. 
              Nếu không trúng đấu giá, hệ thống tự động hoàn trả 100% về tài khoản gốc trong vòng 24 giờ làm việc.
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowRegisterBidderModal(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                Xác Nhận Ký Quỹ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Khởi Tạo Phiên Mới */}
      <Dialog open={showCreateAuctionModal} onOpenChange={setShowCreateAuctionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Plus className="h-5 w-5 text-amber-600" />
              Khởi Tạo Phiên Đấu Giá Bất Động Sản Mới
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Ban hành tài sản và mở đăng ký tham gia đấu giá cho nhà đầu tư.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAuction} className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Mã Căn Hộ *</label>
                <Input value={newPropCode} onChange={(e) => setNewPropCode(e.target.value)} className="text-xs" required />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Giá Khởi Điểm (VNĐ) *</label>
                <Input value={newPropFloorPrice} onChange={(e) => setNewPropFloorPrice(e.target.value)} className="text-xs font-mono" required />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Tiêu Đề Siêu Phẩm *</label>
              <Input value={newPropTitle} onChange={(e) => setNewPropTitle(e.target.value)} className="text-xs" required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Bước Giá Tối Thiểu (VNĐ)</label>
                <Input value={newPropBidStep} onChange={(e) => setNewPropBidStep(e.target.value)} className="text-xs font-mono" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 mb-1 block">Tiền Ký Quỹ (VNĐ)</label>
                <Input value={newPropDeposit} onChange={(e) => setNewPropDeposit(e.target.value)} className="text-xs font-mono" />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Đấu Giá Viên Chủ Tọa</label>
              <Input value={newHostName} onChange={(e) => setNewHostName(e.target.value)} className="text-xs" />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateAuctionModal(false)}>
                Hủy
              </Button>
              <Button type="submit" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                Kích Hoạt Phiên Đấu Giá
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: PHÒNG ĐẤU GIÁ TRỰC TIẾP SIÊU THỰC TẾ (LIVE ROOM) */}
      <Dialog open={!!selectedLiveRoom} onOpenChange={() => setSelectedLiveRoom(null)}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-950 text-white border-amber-500/40 p-6">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="bg-rose-600 text-white text-xs font-bold uppercase animate-pulse flex items-center gap-1">
                  <Flame className="h-3 w-3" /> LIVE ROOM
                </Badge>
                <DialogTitle className="text-lg font-black text-amber-400">
                  {selectedLiveRoom?.title} ({selectedLiveRoom?.code})
                </DialogTitle>
              </div>
              <Badge variant="outline" className="border-amber-400/40 text-amber-300 font-mono text-xs">
                Mã BID: #VIP-007
              </Badge>
            </div>
            <DialogDescription className="text-xs text-slate-400">
              Chủ tọa: {selectedLiveRoom?.hostName} • Dự án: {selectedLiveRoom?.projectName}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-3">
            {/* Left: Stream image & timer */}
            <div className="md:col-span-7 space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img src={selectedLiveRoom?.imageUrl} alt="Asset" className="w-full h-56 object-cover" />
                <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg text-xs flex items-center gap-2">
                  <Video className="h-3.5 w-3.5 text-rose-500 animate-pulse" /> Live Streaming HD
                </div>
              </div>

              {/* Price Display */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Mức Giá Cao Nhất Hiện Tại</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mt-0.5">
                    {(liveCurrentBid / 1000000000).toFixed(2)} Tỷ VNĐ
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-rose-400 flex items-center justify-end gap-1">
                    <Timer className="h-3.5 w-3.5" /> Đồng Hồ Búa Gõ
                  </div>
                  <div className="text-2xl font-mono font-bold text-rose-400">
                    {Math.floor(liveTimer / 60).toString().padStart(2, '0')}:{(liveTimer % 60).toString().padStart(2, '0')}
                  </div>
                </div>
              </div>

              {/* Step buttons */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Chọn Bước Giá Tăng Nhanh:</div>
                <div className="grid grid-cols-4 gap-2">
                  {[50000000, 100000000, 200000000, 500000000].map(step => (
                    <Button 
                      key={step} 
                      size="sm" 
                      variant="outline" 
                      className="text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black font-bold"
                      onClick={() => handlePlaceBid(step)}
                    >
                      +{(step / 1000000).toLocaleString()} Tr
                    </Button>
                  ))}
                </div>
              </div>

              {/* Hammer action button */}
              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base py-6 rounded-xl shadow-xl shadow-amber-500/20"
                onClick={() => handlePlaceBid(selectedLiveRoom?.bidStep || 100000000)}
              >
                <Gavel className="h-5 w-5 mr-2" />
                GÕ BÚA ĐẶT GIÁ: {((liveCurrentBid + (selectedLiveRoom?.bidStep || 100000000)) / 1000000000).toFixed(2)} TỶ
              </Button>
            </div>

            {/* Right: Live Bids Feed */}
            <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5" /> Lịch Sử Trả Giá Trực Tiếp
                  </span>
                  <Badge variant="outline" className="text-[10px] text-slate-400">{liveBidsList.length} Lượt Bid</Badge>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {liveBidsList.map((bid, idx) => (
                    <div 
                      key={bid.id} 
                      className={`p-2.5 rounded-xl border text-xs flex justify-between items-center transition-all ${
                        idx === 0 
                          ? 'bg-amber-500/20 border-amber-500/60 shadow-xs' 
                          : 'bg-white/5 border-white/5 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className={`font-bold ${idx === 0 ? 'text-amber-300' : 'text-slate-300'}`}>
                          {bid.bidderNameMasked}
                        </div>
                        <div className="text-[10px] text-slate-500">{bid.timestamp}</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-black ${idx === 0 ? 'text-amber-400 text-sm' : 'text-slate-300'}`}>
                          {(bid.amount / 1000000000).toFixed(2)} Tỷ
                        </div>
                        {idx === 0 && <span className="text-[9px] text-emerald-400 font-bold uppercase">Dẫn đầu</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-[10px] text-slate-400 text-center">
                Mỗi lượt bid đều được mã hóa bằng chứng thực thời gian thực SHA-256.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSelectedLiveRoom(null)} className="border-slate-700 text-slate-300">
              Rời Phòng Đấu Giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: BIÊN BẢN XÁC NHẬN TRÚNG ĐẤU GIÁ A4 */}
      <Dialog open={!!selectedWinnerModal} onOpenChange={() => setSelectedWinnerModal(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Award className="h-5 w-5 text-amber-600" />
              Biên Bản Xác Nhận Kết Quả Trúng Đấu Giá (Mẫu A4)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Văn bản pháp lý xác nhận kết quả đấu giá công khai và chuyển tiếp sang Hợp đồng đặt cọc chính thức.
            </DialogDescription>
          </DialogHeader>

          {selectedWinnerModal && (
            <div className="p-6 bg-white border rounded-xl shadow-xs space-y-5 text-xs text-slate-800 font-serif">
              {/* Header A4 */}
              <div className="text-center space-y-1 border-b pb-4">
                <div className="font-bold text-xs uppercase tracking-widest text-slate-900">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="text-[11px] underline">Độc lập - Tự do - Hạnh phúc</div>
                <div className="text-base font-bold uppercase tracking-wider text-slate-950 pt-3">
                  BIÊN BẢN XÁC NHẬN KẾT QUẢ ĐẤU GIÁ BẤT ĐỘNG SẢN
                </div>
                <div className="text-[10px] text-slate-500 font-sans">
                  Số: {selectedWinnerModal.id}/BBTDG-{selectedWinnerModal.code} • Ngày: {selectedWinnerModal.endTime}
                </div>
              </div>

              {/* Parties */}
              <div className="space-y-3 font-sans text-xs">
                <div>
                  <strong className="text-amber-900">ĐƠN VỊ TỔ CHỨC ĐẤU GIÁ:</strong>
                  <div className="text-slate-600 mt-0.5">Hội Đồng Đấu Giá Bất Động Sản Cao Cấp — Dự án {selectedWinnerModal.projectName}</div>
                  <div className="text-slate-600">Đấu giá viên chủ trì: <strong>{selectedWinnerModal.hostName}</strong></div>
                </div>

                <div>
                  <strong className="text-amber-900">NGƯỜI TRÚNG ĐẤU GIÁ:</strong>
                  <div className="text-slate-600 mt-0.5">Khách hàng: <strong>{selectedWinnerModal.winnerName}</strong></div>
                </div>

                <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 space-y-1.5">
                  <div className="font-bold text-slate-800">THÔNG TIN TÀI SẢN & KẾT QUẢ KHỚP LỆNH:</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>• Mã căn hộ: <strong>{selectedWinnerModal.code}</strong></div>
                    <div>• Diện tích: <strong>{selectedWinnerModal.area} m²</strong></div>
                    <div>• Giá khởi điểm: <strong>{(selectedWinnerModal.floorPrice / 1000000000).toFixed(2)} Tỷ VNĐ</strong></div>
                    <div>• Giá trúng đấu giá: <strong className="text-amber-800 text-sm font-black font-mono">{((selectedWinnerModal.winningAmount || selectedWinnerModal.currentBid) / 1000000000).toFixed(2)} Tỷ VNĐ</strong></div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 italic">
                  Hai bên thống nhất: Số tiền ký quỹ 500,000,000 VNĐ đã nộp sẽ được khấu trừ trực tiếp vào đợt thanh toán đầu tiên của Hợp đồng đặt cọc. 
                  Người trúng đấu giá cam kết hoàn tất thủ tục ký kết hợp đồng trong vòng 03 ngày làm việc.
                </p>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t font-sans text-center">
                <div>
                  <div className="font-bold text-slate-900">ĐẤU GIÁ VIÊN CHỦ TRÌ</div>
                  <div className="text-[10px] text-slate-400 mb-8">(Ký, ghi rõ họ tên và đóng dấu)</div>
                  <div className="font-bold text-amber-800">{selectedWinnerModal.hostName}</div>
                  <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-700 border-amber-200 mt-1">
                    Đã Ký Số SHA-256
                  </Badge>
                </div>

                <div>
                  <div className="font-bold text-slate-900">NGƯỜI TRÚNG ĐẤU GIÁ</div>
                  <div className="text-[10px] text-slate-400 mb-8">(Ký và ghi rõ họ tên)</div>
                  <div className="font-bold text-slate-800">{selectedWinnerModal.winnerName}</div>
                  <Badge variant="outline" className="text-[9px] bg-emerald-50 text-emerald-700 border-emerald-200 mt-1">
                    Xác Thực OTP Điện Tử
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" onClick={() => setSelectedWinnerModal(null)}>
              Đóng Cửa Sổ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: XÁC NHẬN HOÀN TIỀN KÝ QUỸ */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-950">
              <RefreshCw className="h-5 w-5 text-rose-600" />
              Lệnh Hoàn Trả Tiền Ký Quỹ Đấu Giá
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Hoàn trả 100% tiền phong tỏa cho nhà đầu tư không trúng đấu giá.
            </DialogDescription>
          </DialogHeader>

          {selectedEscrowForRefund && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border space-y-1 text-slate-700">
                <div>Nhà đầu tư: <strong>{selectedEscrowForRefund.customerName}</strong></div>
                <div>Số điện thoại: <strong>{selectedEscrowForRefund.customerPhone}</strong></div>
                <div>Phiên đấu giá: <strong>{selectedEscrowForRefund.propertyCode}</strong></div>
                <div>Số tiền hoàn cọc: <strong className="text-rose-600 font-mono text-sm font-bold">{(selectedEscrowForRefund.amount / 1000000).toLocaleString()} Triệu VNĐ</strong></div>
              </div>

              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 text-[11px]">
                Lệnh chuyển khoản tự động sẽ giải phóng số dư tài khoản phong tỏa của khách hàng thông qua cổng kết nối ngân hàng Vietcombank / VietQR.
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowRefundModal(false)}>
              Hủy
            </Button>
            <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white font-bold" onClick={handleConfirmRefund}>
              Xác Nhận Chuyển Khoản Hoàn Cọc
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
