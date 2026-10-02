"use client"
import React, { useState, useRef, useEffect, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { SyncTask, MobileNotification, InventoryItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Smartphone, Wifi, WifiOff, MapPin, QrCode, PenTool, 
  Bell, Send, CheckCircle2, RotateCw, Fingerprint, Camera, 
  Radio, X, Download, ShieldCheck, Copy, Clock, Sparkles, 
  SlidersHorizontal, Check, RefreshCw, FileText, Search, 
  Lock, Mic, Volume2, Calendar, PhoneCall, ExternalLink,
  ChevronRight, Building, Layers, Eye, Trash2, ArrowUpRight
} from 'lucide-react'

export default function MobileHubPage() {
  const { 
    syncQueue, 
    mobileNotifications, 
    inventory, 
    projects, 
    customers,
    addSyncTask, 
    removeSyncTask,
    clearSyncQueue, 
    sendMobileNotification,
    markNotificationAsRead
  } = useStore()
  
  // Phone simulation states
  const [isOffline, setIsOffline] = useState(false)
  const [activeAppTab, setActiveAppTab] = useState<'inventory' | 'sign' | 'tools' | 'notifications'>('inventory')
  const [isSyncing, setIsSyncing] = useState(false)
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState(false)
  const [selectedPenColor, setSelectedPenColor] = useState<'#1e293b' | '#2563eb' | '#dc2626'>('#2563eb')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const [selectedMobileProject, setSelectedMobileProject] = useState('all')

  // Voice recording simulation state
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  // Push Notification state
  const [notifTitle, setNotifTitle] = useState('🔥 Bung Hàng Gấp: 5 Căn Biệt Thự Góc Aqua City!')
  const [notifMessage, setNotifMessage] = useState('Chủ đầu tư vừa mở khóa 5 căn góc Phoenix South view sông Đồng Nai, anh em chốt ngay khách VIP nhé!')
  const [notifType, setNotifType] = useState<MobileNotification['type']>('urgent')
  const [notifAudience, setNotifAudience] = useState('Toàn bộ Sales Chiến Binh')

  // Notification Toast in iPhone
  const [showIPhoneToast, setShowIPhoneToast] = useState(false)
  const [currentIPhoneToast, setCurrentIPhoneToast] = useState<{title: string, message: string} | null>(null)

  // Web Audio chime sound
  const playChimeSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(784, ctx.currentTime) // G5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.12) // C6
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.38)
    } catch (e) {
      // AudioContext blocked or not supported
    }
  }

  // Toast feedback for Manager actions
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // Modals state
  const [selectedContractToPreview, setSelectedContractToPreview] = useState<boolean>(false)
  const [showPwaInstallModal, setShowPwaInstallModal] = useState<boolean>(false)
  const [showScanIdModal, setShowScanIdModal] = useState<boolean>(false)
  const [selectedQueueItemModal, setSelectedQueueItemModal] = useState<SyncTask | null>(null)
  const [showScheduleNotifModal, setShowScheduleNotifModal] = useState<boolean>(false)

  // Scheduling state for Modal 5
  const [scheduledTime, setScheduledTime] = useState('2026-07-25T08:30')
  const [scheduledTitle, setScheduledTitle] = useState('⏰ Nhắc nhở: Lễ mở bán The Grand Manhattan bắt đầu sau 30 phút!')

  // Canvas ref for signature
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signatureSaved, setSignatureSaved] = useState(false)

  // Voice recording timer effect
  useEffect(() => {
    let interval: any
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingSeconds(0)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  // Toggle Network Online / Offline
  const toggleNetwork = (checked: boolean) => {
    setIsOffline(checked)
    if (!checked && syncQueue.length > 0) {
      // Switching from Offline to Online -> Auto Sync
      setIsSyncing(true)
      showToast(`Đã khôi phục kết nối! Tự động đồng bộ ${syncQueue.length} tác vụ ngoại tuyến lên Máy chủ...`)
      setTimeout(() => {
        clearSyncQueue()
        setIsSyncing(false)
        showToast('Đã hoàn tất đồng bộ toàn bộ dữ liệu thực địa lên Máy chủ!')
      }, 1800)
    } else if (checked) {
      showToast('Đã ngắt kết nối mạng! Ứng dụng PWA chuyển sang chế độ Offline-first (IndexedDB).')
    }
  }

  // Handle Save Action (Sign or GPS)
  const handleSaveAction = (taskName: string, type: SyncTask['type'] = 'signature', payload?: string, meta?: Partial<SyncTask>) => {
    if (isOffline) {
      addSyncTask(taskName, type, payload, meta)
      showToast(`[Offline] Đã lưu tạm tác vụ vào bộ nhớ máy: "${taskName}"`)
    } else {
      // Online -> sync immediately
      setIsSyncing(true)
      showToast(`[Online] Đang gửi ngay tác vụ lên máy chủ: "${taskName}"`)
      setTimeout(() => {
        setIsSyncing(false)
        showToast(`Đã xác nhận thành công: "${taskName}"`)
      }, 700)
    }
    
    // Clear canvas if signing
    if (type === 'signature' && canvasRef.current) {
      setSignatureSaved(true)
      setTimeout(() => {
        const ctx = canvasRef.current?.getContext('2d')
        ctx?.clearRect(0, 0, canvasRef.current?.width || 300, canvasRef.current?.height || 200)
        setSignatureSaved(false)
      }, 1200)
    }
  }

  // Canvas Drawing logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => setIsDrawing(false)

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let clientX, clientY
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.nativeEvent.clientX
      clientY = e.nativeEvent.clientY
    }

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = selectedPenColor

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  useEffect(() => {
    if (!isDrawing && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx?.beginPath()
    }
  }, [isDrawing])

  // Effect to show toast on iPhone when a new notification arrives
  useEffect(() => {
    if (mobileNotifications.length > 0) {
      const latestNotif = mobileNotifications[0]
      setCurrentIPhoneToast({ title: latestNotif.title, message: latestNotif.message })
      setShowIPhoneToast(true)
      playChimeSound()
      
      const timer = setTimeout(() => {
        setShowIPhoneToast(false)
      }, 5500)
      return () => clearTimeout(timer)
    }
  }, [mobileNotifications])

  // Handle Send Notification Broadcast
  const handleSendNotification = () => {
    if (!notifTitle.trim() || !notifMessage.trim()) return
    sendMobileNotification(notifTitle, notifMessage, notifType, notifAudience)
    showToast(`Đã bắn Push Notification broadcast đến: ${notifAudience}`)
  }

  // Force Push All Sync Tasks
  const handleForcePushAll = () => {
    if (syncQueue.length === 0) {
      showToast('Hàng đợi đồng bộ trống, tất cả dữ liệu đã ở trạng thái cập nhật nhất!')
      return
    }
    setIsSyncing(true)
    showToast(`Đang cưỡng bức đẩy ${syncQueue.length} gói tin ngoại tuyến lên Server...`)
    setTimeout(() => {
      clearSyncQueue()
      setIsSyncing(false)
      showToast('Đồng bộ thành công 100% dữ liệu thực địa!')
    }, 1500)
  }

  // Filter mobile inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchProject = selectedMobileProject === 'all' || item.projectId === selectedMobileProject
      const matchSearch = mobileSearchQuery === '' || 
        item.code.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(mobileSearchQuery.toLowerCase())
      return matchProject && matchSearch
    }).slice(0, 8)
  }, [inventory, selectedMobileProject, mobileSearchQuery])

  // Handle Export CSV
  const handleExportCSV = () => {
    const csvHeader = "\uFEFFMã Tác Vụ,Tên Tác Vụ,Thời Gian,Loại Tác Vụ,Tình Trạng,Số Lần Thử Lại,Dữ Liệu Payload,Khách Hàng,Vị Trí\n"
    const csvRows = syncQueue.map(item => {
      return `"${item.id}","${item.task}","${item.time}","${item.type || 'Chữ ký'}","${item.status || 'Chờ gửi'}","${item.retryCount || 0}","${(item.payload || '').replace(/"/g, '""')}","${item.customerName || 'N/A'}","${item.locationName || 'Công trường'}"`
    }).join("\n")

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `NhatKy_DongBo_ThucDia_PWA_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất thành công file kiểm toán nhật ký đồng bộ ngoại tuyến CSV!')
  }

  // Active agents in field
  const fieldAgents = [
    { id: 'fa1', name: 'Tuấn Tú', role: 'Chuyên viên VIP Q1', project: 'Aqua City (Phoenix Island)', battery: 88, status: 'Đang dẫn khách VIP', phone: '0901 888 123' },
    { id: 'fa2', name: 'Thanh Hà', role: 'Team Leader', project: 'The Grand Manhattan', battery: 92, status: 'Đang chuẩn bị ký cọc TGM-15.01', phone: '0912 333 456' },
    { id: 'fa3', name: 'Lê Hoàng Anh', role: 'Chuyên viên BĐS', project: 'NovaWorld Phan Thiết', battery: 64, status: 'Đang ở Bikini Beach thực địa', phone: '0909 999 888' },
    { id: 'fa4', name: 'Minh Anh', role: 'Admin Dự Án', project: 'The Global City', battery: 78, status: 'Trực Sa bàn Masterise Soho', phone: '0988 777 666' },
    { id: 'fa5', name: 'Phạm Thu Hà', role: 'Chuyên viên tư vấn', project: 'Vinhomes Grand Park', battery: 52, status: 'Tư vấn vay vốn The Beverly', phone: '0933 222 111' },
  ]

  return (
    <div className="flex flex-col gap-6">
      
      {/* Toast Notification Header */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[999] bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-semibold animate-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-fuchsia-100 dark:bg-fuchsia-950/60 text-fuchsia-600 rounded-xl">
              <Smartphone className="h-6 w-6" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Trạm Di Động PWA Đi Thị Trường (Field Hub)
            </h1>
            <Badge variant="outline" className="bg-fuchsia-50 dark:bg-fuchsia-950/40 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-200">
              PWA 2026 Ready
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Giả lập ứng dụng di động dành cho chuyên viên bán hàng đi thực địa: Công nghệ Offline-first, Ký hợp đồng điện tử, GPS Check-in & Thông báo đẩy tức thì.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowPwaInstallModal(true)}
            className="cursor-pointer text-xs"
          >
            <QrCode className="h-4 w-4 mr-1 text-fuchsia-600" />
            Cài Đặt PWA Mobile
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportCSV}
            className="cursor-pointer text-xs"
          >
            <Download className="h-4 w-4 mr-1 text-slate-600" />
            Xuất Nhật Ký (.CSV)
          </Button>
        </div>
      </div>

      {/* 4 MACRO KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Thiết Bị Kích Hoạt</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">142 Máy</h3>
              <p className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                <Check className="h-3 w-3" /> Service Worker hoạt động
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <Smartphone className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Hàng Đợi Chờ Gửi</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{syncQueue.length} Tác vụ</h3>
              <p className="text-[10px] text-amber-600 flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3" /> Lưu an toàn IndexedDB
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center">
              <RotateCw className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Tỷ Lệ Đồng Bộ</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-1">99.8%</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Không mất mát dữ liệu</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Thông Báo Đẩy Broadcast</p>
              <h3 className="text-xl font-bold text-fuchsia-600 mt-1">{mobileNotifications.length} Bản tin</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Bắn chuông Ting-ting tức thì</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/50 text-fuchsia-600 flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN LAYOUT: IPHONE 16 PRO MAX SIMULATOR + COMMAND CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: IPHONE 16 PRO MAX DEVICE SIMULATOR */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
            <span>Thiết Bị Thực Địa (iPhone 16 Pro Max • iOS 18)</span>
            {isOffline ? (
              <Badge variant="destructive" className="text-[10px] py-0">Offline Mode</Badge>
            ) : (
              <Badge className="bg-emerald-600 text-white text-[10px] py-0">Online 5G</Badge>
            )}
          </div>

          {/* IPHONE BODY */}
          <div className="relative w-[340px] h-[690px] bg-slate-900 rounded-[3.4rem] border-[10px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden shrink-0 ring-1 ring-slate-700 select-none">
            
            {/* HARDWARE BUTTONS (CLICKABLE) */}
            <div 
              onClick={() => showToast('Đã bấm phím Action Button (Gán phím nhanh: Mở nhanh Camera eKYC)')}
              className="absolute -left-[14px] top-28 w-[4px] h-8 bg-slate-700 hover:bg-fuchsia-500 rounded-l-md cursor-pointer transition-colors" 
              title="Action Button"
            />
            <div 
              onClick={() => showToast('Tăng âm lượng')}
              className="absolute -left-[14px] top-40 w-[4px] h-12 bg-slate-700 hover:bg-slate-500 rounded-l-md cursor-pointer transition-colors" 
              title="Volume Up"
            />
            <div 
              onClick={() => showToast('Giảm âm lượng')}
              className="absolute -left-[14px] top-56 w-[4px] h-12 bg-slate-700 hover:bg-slate-500 rounded-l-md cursor-pointer transition-colors" 
              title="Volume Down"
            />
            <div 
              onClick={() => showToast('Bật/Tắt màn hình iPhone')}
              className="absolute -right-[14px] top-36 w-[4px] h-16 bg-slate-700 hover:bg-slate-500 rounded-r-md cursor-pointer transition-colors" 
              title="Power Button"
            />

            {/* DYNAMIC ISLAND */}
            <div 
              onClick={() => setDynamicIslandExpanded(!dynamicIslandExpanded)}
              className={`absolute top-2 left-1/2 -translate-x-1/2 bg-black rounded-full z-50 cursor-pointer transition-all duration-300 flex items-center justify-between px-3
                ${dynamicIslandExpanded ? 'w-56 h-10 shadow-lg' : 'w-24 h-6'}
              `}
            >
              {dynamicIslandExpanded ? (
                <div className="flex items-center justify-between w-full text-[10px] text-white font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>{isOffline ? 'Chế độ Offline' : '5G Đang kết nối'}</span>
                  </div>
                  <span className="text-slate-400">Queue: {syncQueue.length}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full px-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                </div>
              )}
            </div>

            {/* SCREEN */}
            <div className="relative w-full h-full bg-slate-50 dark:bg-slate-950 flex flex-col overflow-hidden text-slate-900 dark:text-slate-100">
              
              {/* TOAST NOTIFICATION (iOS Dynamic Island Dropdown) */}
              <div 
                className={`absolute top-10 left-2.5 right-2.5 bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl z-50 transition-all duration-500 ease-out flex flex-col gap-1 cursor-pointer border border-slate-700
                  ${showIPhoneToast ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-28 opacity-0 scale-95 pointer-events-none'}
                `}
                onClick={() => {
                  setShowIPhoneToast(false)
                  setActiveAppTab('notifications')
                }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 bg-fuchsia-600 rounded-md flex items-center justify-center">
                      <Bell className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-[11px] font-bold">NOVA FIELD CRM</span>
                  </div>
                  <span className="text-[9px] opacity-60">Vừa xong</span>
                </div>
                <div className="font-bold text-xs mt-0.5 leading-snug line-clamp-1">{currentIPhoneToast?.title}</div>
                <div className="text-[11px] opacity-85 line-clamp-2 leading-relaxed">{currentIPhoneToast?.message}</div>
                <div className="w-8 h-1 bg-white/20 rounded-full self-center mt-1"></div>
              </div>

              {/* STATUS BAR (iOS 18) */}
              <div className={`h-11 flex justify-between items-end px-6 pb-1.5 text-[11px] font-bold transition-colors ${isOffline ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200'}`}>
                <div>09:41</div>
                <div className="flex items-center gap-1.5">
                  {isOffline ? (
                    <span className="flex items-center gap-1 text-[10px] text-white">
                      <WifiOff className="h-3 w-3" /> Mất sóng
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Wifi className="h-3 w-3" />
                      <span className="text-[10px]">5G</span>
                    </span>
                  )}
                  <div className="w-5 h-2.5 border border-current rounded-xs p-0.5 flex items-center">
                    <div className="h-full w-full bg-current rounded-xs"></div>
                  </div>
                </div>
              </div>

              {/* APP HEADER */}
              <div className={`px-4 py-2.5 flex items-center justify-between text-white ${isOffline ? 'bg-red-600' : 'bg-fuchsia-600'}`}>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Nova Field App</h3>
                  <p className="text-[10px] opacity-90">
                    {isOffline ? 'Mất mạng: Đang lưu tạm vào Queue' : 'Trực tuyến: Tự động sync'}
                  </p>
                </div>
                <Badge className="bg-white/20 text-white border-0 text-[10px]">
                  {syncQueue.length} Queue
                </Badge>
              </div>

              {/* BODY CONTENT - SWITCH TABS */}
              <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-900/60 p-3 relative flex flex-col">
                
                {/* 1. TAB: INVENTORY (RỔ HÀNG & KHÓA CĂN NHANH) */}
                {activeAppTab === 'inventory' && (
                  <div className="space-y-2.5 flex-1">
                    <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1.5 rounded-lg border text-xs">
                      <Search className="h-3.5 w-3.5 text-slate-400 ml-1" />
                      <input 
                        type="text" 
                        placeholder="Tìm mã căn, loại nhà..."
                        value={mobileSearchQuery}
                        onChange={(e) => setMobileSearchQuery(e.target.value)}
                        className="w-full bg-transparent outline-hidden text-[11px]"
                      />
                    </div>

                    <div className="flex gap-1 overflow-x-auto pb-1 text-[10px]">
                      <button 
                        onClick={() => setSelectedMobileProject('all')}
                        className={`px-2 py-1 rounded-full whitespace-nowrap cursor-pointer ${selectedMobileProject === 'all' ? 'bg-fuchsia-600 text-white font-bold' : 'bg-white dark:bg-slate-800 border'}`}
                      >
                        Tất cả ({inventory.length})
                      </button>
                      {projects.slice(0, 3).map(p => (
                        <button 
                          key={p.id}
                          onClick={() => setSelectedMobileProject(p.id)}
                          className={`px-2 py-1 rounded-full whitespace-nowrap cursor-pointer ${selectedMobileProject === p.id ? 'bg-fuchsia-600 text-white font-bold' : 'bg-white dark:bg-slate-800 border'}`}
                        >
                          {p.name.split(' - ')[0]}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5">
                      {filteredInventory.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border shadow-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-fuchsia-700 dark:text-fuchsia-400">{item.code}</span>
                            <Badge 
                              className={`text-[9px] py-0 ${
                                item.status === 'Trống' ? 'bg-emerald-600 text-white' :
                                item.status === 'Booking' ? 'bg-amber-500 text-white' : 'bg-slate-400 text-white'
                              }`}
                            >
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="text-[11px] text-slate-600 dark:text-slate-300">
                            {item.type} • {item.area} m² • {item.direction || 'Đông Nam'}
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              {(item.price / 1000000000).toFixed(2)} Tỷ
                            </span>
                            
                            {item.status === 'Trống' ? (
                              <Button 
                                size="sm" 
                                className="h-6 text-[10px] bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-2 cursor-pointer"
                                onClick={() => {
                                  handleSaveAction(`Khóa căn 15 phút: ${item.code}`, 'lock', `Căn ${item.code} giữ chỗ 15 phút cho khách thực địa`, { propertyCode: item.code })
                                }}
                              >
                                <Lock className="h-2.5 w-2.5 mr-1" /> Khóa 15p
                              </Button>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Đã có người giữ</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. TAB: E-SIGNATURE (KÝ HỢP ĐỒNG CỌC ĐIỆN TỬ) */}
                {activeAppTab === 'sign' && (
                  <div className="flex flex-col h-full bg-white dark:bg-slate-800 rounded-xl shadow-xs overflow-hidden border">
                    <div className="p-2.5 border-b bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-slate-800 dark:text-slate-200">HĐ Đặt Cọc #HD-928</div>
                        <div className="text-[10px] text-slate-500">Khách: Nguyễn Văn Tuấn • Căn: AQC-PH-102</div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-[10px] text-fuchsia-600 px-1.5 cursor-pointer"
                        onClick={() => setSelectedContractToPreview(true)}
                      >
                        <Eye className="h-3 w-3 mr-1" /> Xem HĐ
                      </Button>
                    </div>

                    {/* Pen Color selector */}
                    <div className="px-3 py-1.5 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[10px] border-b">
                      <span className="text-slate-500">Màu mực ký:</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedPenColor('#2563eb')}
                          className={`w-4 h-4 rounded-full bg-blue-600 cursor-pointer ${selectedPenColor === '#2563eb' ? 'ring-2 ring-blue-400' : ''}`}
                          title="Xanh CĐT"
                        />
                        <button 
                          onClick={() => setSelectedPenColor('#1e293b')}
                          className={`w-4 h-4 rounded-full bg-slate-800 cursor-pointer ${selectedPenColor === '#1e293b' ? 'ring-2 ring-slate-400' : ''}`}
                          title="Đen chuẩn"
                        />
                        <button 
                          onClick={() => setSelectedPenColor('#dc2626')}
                          className={`w-4 h-4 rounded-full bg-red-600 cursor-pointer ${selectedPenColor === '#dc2626' ? 'ring-2 ring-red-400' : ''}`}
                          title="Đỏ niêm phong"
                        />
                      </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 bg-[#fafafa] dark:bg-slate-950 relative min-h-[220px]">
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200 dark:text-slate-800 text-5xl font-black opacity-30 select-none pointer-events-none">
                        KÝ TÊN
                      </span>
                      <canvas 
                        ref={canvasRef}
                        width={300}
                        height={220}
                        className="w-full h-full cursor-crosshair touch-none"
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseOut={stopDrawing}
                        onTouchStart={startDrawing}
                        onTouchMove={draw}
                        onTouchEnd={stopDrawing}
                      />
                    </div>

                    <div className="p-2 border-t flex gap-1.5 bg-white dark:bg-slate-900">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-[11px] h-8 cursor-pointer" 
                        onClick={() => {
                          const ctx = canvasRef.current?.getContext('2d')
                          ctx?.clearRect(0, 0, 300, 220)
                          showToast('Đã xóa khung chữ ký')
                        }}
                      >
                        Xóa Lại
                      </Button>
                      <Button 
                        size="sm" 
                        className={`flex-1 text-[11px] h-8 text-white font-bold cursor-pointer ${isOffline ? 'bg-red-600 hover:bg-red-700' : 'bg-fuchsia-600 hover:bg-fuchsia-700'}`}
                        onClick={() => handleSaveAction(
                          'Chữ ký HĐ Cọc #HD-928 (Nguyễn Văn Tuấn)', 
                          'signature', 
                          'Căn AQC-PH-102 | Đặt cọc 200.000.000 VNĐ | Hash SHA-256', 
                          { customerName: 'Nguyễn Văn Tuấn', propertyCode: 'AQC-PH-102', locationName: 'Aqua City Phoenix' }
                        )}
                        disabled={isSyncing}
                      >
                        {isSyncing ? 'Đang gửi...' : (isOffline ? 'Lưu Offline' : 'Ký & Gửi')}
                      </Button>
                    </div>
                  </div>
                )}

                {/* 3. TAB: TOOLS (GPS, eKYC, VOICE RECORDER) */}
                {activeAppTab === 'tools' && (
                  <div className="space-y-3">
                    {/* GPS Check-in Card */}
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xs border space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-lg flex items-center justify-center">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">GPS Check-in Thực Địa</h4>
                          <p className="text-[10px] text-slate-500">Tọa độ: 10.8231° N, 106.6297° E</p>
                        </div>
                      </div>
                      <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg text-[10px] text-slate-600 dark:text-slate-400">
                        Bán kính Geofence: <b>12m</b> quanh khuôn viên Dự Án.
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full h-8 text-[11px] bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        onClick={() => handleSaveAction(
                          'GPS Check-in Thực Địa (10.8231 N, 106.6297 E)', 
                          'gps', 
                          'Vị trí: Showroom Aqua City Đảo Phượng Hoàng (Sai số 12m)', 
                          { locationName: 'Aqua City Phoenix' }
                        )}
                        disabled={isSyncing}
                      >
                        Ghi Nhận Check-in Vị Trí
                      </Button>
                    </div>

                    {/* eKYC QR & Camera Card */}
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xs border space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-lg flex items-center justify-center">
                          <QrCode className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Quét Thẻ CCCD eKYC</h4>
                          <p className="text-[10px] text-slate-500">Tự động trích xuất thông tin khách</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full h-8 text-[11px] bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                        onClick={() => setShowScanIdModal(true)}
                      >
                        <Camera className="h-3.5 w-3.5 mr-1" /> Bật Camera Quét CCCD
                      </Button>
                    </div>

                    {/* Voice Memo Recorder */}
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-xs border space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-purple-100 dark:bg-purple-950 text-purple-600 rounded-lg flex items-center justify-center">
                            <Mic className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">Ghi Âm Đàm Phán Thoại</h4>
                            <p className="text-[10px] text-slate-500">Lưu biên bản thỏa thuận giọng nói</p>
                          </div>
                        </div>
                        {isRecording && (
                          <span className="flex items-center gap-1 text-[10px] text-red-600 font-bold animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {!isRecording ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1 h-8 text-[11px] border-purple-200 text-purple-700 cursor-pointer"
                            onClick={() => {
                              setIsRecording(true)
                              showToast('Bắt đầu ghi âm cuộc đàm phán...')
                            }}
                          >
                            <Mic className="h-3 w-3 mr-1" /> Bắt Đầu Ghi
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="flex-1 h-8 text-[11px] bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                            onClick={() => {
                              setIsRecording(false)
                              handleSaveAction(
                                `Ghi âm thỏa thuận đặt cọc (Thời lượng: ${recordingSeconds}s)`, 
                                'voice', 
                                `Audio_Note_${Date.now()}.aac (Độ dài: ${recordingSeconds}s)`
                              )
                            }}
                          >
                            Dừng & Lưu File
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. TAB: NOTIFICATIONS (THÔNG BÁO PUSH) */}
                {activeAppTab === 'notifications' && (
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 pb-1">
                      <span>Bản tin sàn ({mobileNotifications.length})</span>
                      <button 
                        onClick={playChimeSound}
                        className="text-[10px] text-fuchsia-600 flex items-center gap-1 cursor-pointer hover:underline"
                      >
                        <Volume2 className="h-3 w-3" /> Thử Chuông
                      </button>
                    </div>

                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-0.5">
                      {mobileNotifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => markNotificationAsRead(notif.id)}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 transition-colors cursor-pointer ${
                            notif.read ? 'bg-white dark:bg-slate-800' : 'bg-fuchsia-50/60 dark:bg-fuchsia-950/40 border-fuchsia-200 dark:border-fuchsia-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] line-clamp-1">{notif.title}</span>
                            <span className="text-[9px] text-slate-400 shrink-0">{notif.time}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                          <div className="flex items-center justify-between text-[9px] pt-1 text-slate-400">
                            <span>Gửi tới: {notif.targetAudience || 'Toàn sàn'}</span>
                            {!notif.read && <span className="text-fuchsia-600 font-bold">Mới</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SYNCING SPINNER OVERLAY */}
                {isSyncing && (
                  <div className="absolute inset-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-4">
                    <RotateCw className="h-8 w-8 text-fuchsia-600 animate-spin mb-2" />
                    <div className="font-bold text-xs text-slate-900 dark:text-white">Đang đồng bộ dữ liệu...</div>
                    <div className="text-[10px] text-slate-500 mt-1">Đẩy {syncQueue.length} gói tin lên máy chủ</div>
                  </div>
                )}

              </div>

              {/* BOTTOM NAVIGATION (4 TABS) */}
              <div className="h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center text-[10px] font-medium text-slate-500 pb-2 px-1 shrink-0">
                <button 
                  onClick={() => setActiveAppTab('inventory')} 
                  className={`flex flex-col items-center p-1.5 transition-colors cursor-pointer ${activeAppTab === 'inventory' ? 'text-fuchsia-600 font-bold' : ''}`}
                >
                  <Building className="h-4 w-4 mb-0.5" /> Rổ Hàng
                </button>
                <button 
                  onClick={() => setActiveAppTab('sign')} 
                  className={`flex flex-col items-center p-1.5 transition-colors cursor-pointer ${activeAppTab === 'sign' ? 'text-fuchsia-600 font-bold' : ''}`}
                >
                  <PenTool className="h-4 w-4 mb-0.5" /> Ký HĐ Cọc
                </button>
                <button 
                  onClick={() => setActiveAppTab('tools')} 
                  className={`flex flex-col items-center p-1.5 transition-colors cursor-pointer ${activeAppTab === 'tools' ? 'text-fuchsia-600 font-bold' : ''}`}
                >
                  <Radio className="h-4 w-4 mb-0.5" /> Thực Địa
                </button>
                <button 
                  onClick={() => setActiveAppTab('notifications')} 
                  className={`flex flex-col items-center p-1.5 transition-colors cursor-pointer relative ${activeAppTab === 'notifications' ? 'text-fuchsia-600 font-bold' : ''}`}
                >
                  <Bell className="h-4 w-4 mb-0.5" /> Thông Báo
                  {mobileNotifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              </div>

              {/* HOME INDICATOR */}
              <div className="h-3 bg-white dark:bg-slate-900 flex justify-center items-center pb-1">
                <div className="w-24 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MANAGER COMMAND CENTER PANELS */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          
          {/* PANEL 1: OFFLINE-FIRST CONTROL & SYNC QUEUE */}
          <Card className="shadow-xs border-fuchsia-200 dark:border-fuchsia-900">
            <CardHeader className="bg-fuchsia-50/50 dark:bg-fuchsia-950/20 border-b pb-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-fuchsia-950 dark:text-fuchsia-200 text-base">
                    <WifiOff className="h-5 w-5 text-fuchsia-600" />
                    Bộ Điều Khiển Mạng Ngoại Tuyến (Offline-First Engine)
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Mô phỏng mất sóng 4G/Wifi tại tầng hầm hoặc công trường xa để kiểm thử cơ chế lưu tạm và Background Sync.
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {isOffline ? 'Chế độ: Offline' : 'Chế độ: Online'}
                  </span>
                  <div 
                    className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${isOffline ? 'bg-red-500 justify-end' : 'bg-emerald-500 justify-start'}`}
                    onClick={() => toggleNetwork(!isOffline)}
                  >
                    <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 border-b flex justify-between items-center text-xs">
                <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span>Hàng Đợi Chờ Đồng Bộ (Sync Queue)</span>
                  <Badge className={syncQueue.length > 0 ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-700'}>
                    {syncQueue.length} tác vụ
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-xs cursor-pointer"
                    onClick={clearSyncQueue}
                    disabled={syncQueue.length === 0}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Xóa Hết
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-7 text-xs bg-fuchsia-600 hover:bg-fuchsia-700 text-white cursor-pointer"
                    onClick={handleForcePushAll}
                    disabled={syncQueue.length === 0 || isSyncing}
                  >
                    <RotateCw className={`h-3 w-3 mr-1 ${isSyncing ? 'animate-spin' : ''}`} /> Đẩy Lên Server
                  </Button>
                </div>
              </div>

              <div className="p-4 min-h-[140px] max-h-[260px] overflow-y-auto space-y-2">
                {syncQueue.length === 0 ? (
                  <div className="text-center text-slate-400 text-xs py-8 flex flex-col items-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mb-2" />
                    <span>Tất cả dữ liệu thực địa đã được đồng bộ lên Máy chủ chính xác.</span>
                  </div>
                ) : (
                  syncQueue.map(item => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-center p-3 border rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-700 flex items-center justify-center shrink-0">
                          {item.type === 'signature' ? <PenTool className="h-4 w-4" /> :
                           item.type === 'gps' ? <MapPin className="h-4 w-4" /> :
                           item.type === 'kyc' ? <QrCode className="h-4 w-4" /> :
                           item.type === 'voice' ? <Mic className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span>{item.task}</span>
                            <Badge variant="outline" className="text-[9px] py-0">{item.time}</Badge>
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{item.payload}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs text-fuchsia-600 px-2 cursor-pointer"
                          onClick={() => setSelectedQueueItemModal(item)}
                        >
                          Payload JSON
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs text-red-500 px-2 cursor-pointer"
                          onClick={() => removeSyncTask(item.id)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* PANEL 2: PUSH NOTIFICATION BROADCASTER */}
          <Card className="shadow-xs border-slate-200 dark:border-slate-800">
            <CardHeader className="border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-5 w-5 text-amber-500" />
                  Trung Tâm Bắn Thông Báo Đẩy (Push Notification Broadcaster)
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowScheduleNotifModal(true)}
                  className="cursor-pointer text-xs h-7"
                >
                  <Calendar className="h-3.5 w-3.5 mr-1" /> Hẹn Giờ Bắn Tin
                </Button>
              </div>
              <CardDescription className="text-xs">
                Gửi thông báo broadcast kèm chuông cảnh báo Web Audio "Ting-ting" thẳng xuống màn hình điện thoại Sale.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 space-y-3.5">
              {/* Preset Quick Templates */}
              <div>
                <Label className="text-xs text-slate-500 mb-1.5 block">Chọn mẫu thông báo sự kiện nhanh:</Label>
                <div className="flex flex-wrap gap-1.5">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-[11px] cursor-pointer"
                    onClick={() => {
                      setNotifTitle('🔥 Bung Hàng Gấp: 5 Căn Biệt Thự Aqua City!')
                      setNotifMessage('Chủ đầu tư vừa mở khóa 5 căn góc Phoenix South view sông, ưu tiên chốt cọc trong 30 phút!')
                      setNotifType('urgent')
                    }}
                  >
                    🔥 Bung hàng gấp
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-[11px] cursor-pointer"
                    onClick={() => {
                      setNotifTitle('💰 Thưởng Nóng: 50 Triệu Đồng Căn Sky Villa!')
                      setNotifMessage('Chiến binh nào chốt căn Sky Villa Manhattan hôm nay nhận nóng 50 triệu và vé máy bay Thụy Sĩ!')
                      setNotifType('reward')
                    }}
                  >
                    💰 Thưởng nóng 50Tr
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-7 text-[11px] cursor-pointer"
                    onClick={() => {
                      setNotifTitle('📢 Xe Limousine Đi Thực Địa Khởi Hành!')
                      setNotifMessage('Xe VIP đưa đón khách tham quan NovaWorld Phan Thiết đã có mặt tại 65 Nguyễn Du lúc 14:00.')
                      setNotifType('event')
                    }}
                  >
                    📢 Lịch xe đưa đón
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Tiêu đề thông báo</Label>
                  <Input 
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Nhóm chuyên viên nhận tin</Label>
                  <select 
                    value={notifAudience} 
                    onChange={(e) => setNotifAudience(e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs"
                  >
                    <option value="Toàn bộ Sales Chiến Binh">Toàn bộ Sales Chiến Binh (142 người)</option>
                    <option value="Team Novaland Quận 1">Team Novaland Quận 1 (45 người)</option>
                    <option value="Team Aqua City Biên Hòa">Team Aqua City Biên Hòa (38 người)</option>
                    <option value="Team NovaWorld Phan Thiết">Team NovaWorld Phan Thiết (59 người)</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Nội dung chi tiết thông báo</Label>
                <Input 
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <Button 
                  className="flex-1 bg-slate-900 dark:bg-slate-100 dark:text-slate-900 text-white font-bold cursor-pointer text-xs h-9"
                  onClick={handleSendNotification}
                >
                  <Send className="h-3.5 w-3.5 mr-2" /> Bắn Thông Báo Ngay (Play Sound & Push)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* PANEL 3: LIVE FIELD AGENTS GPS MONITORING */}
          <Card className="shadow-xs border-slate-200 dark:border-slate-800">
            <CardHeader className="border-b pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Giám Sát Đội Ngũ Thực Địa (Live Field Agent Tracking)
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  5 Chuyên viên ngoài công trường
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Theo dõi tình trạng pin, dự án đang dẫn khách và liên lạc khẩn cấp với Sale tại thực địa.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y max-h-[220px] overflow-y-auto">
                {fieldAgents.map(ag => (
                  <div key={ag.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-fuchsia-600">
                        {ag.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span>{ag.name}</span>
                          <span className="text-[10px] text-slate-400">({ag.role})</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {ag.project} • <span className="text-emerald-600">{ag.status}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right text-[10px]">
                        <span className="text-slate-500">Pin: {ag.battery}%</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-[10px] px-2 cursor-pointer"
                        onClick={() => showToast(`Đang kết nối cuộc gọi VoIP tới ${ag.name} (${ag.phone})...`)}
                      >
                        <PhoneCall className="h-3 w-3 mr-1 text-emerald-600" /> Gọi
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* 5 COMPREHENSIVE INTERACTIVE MODALS */}

      {/* 1. MODAL 1: XEM HỢP ĐỒNG KÈM CHỮ KÝ ĐIỆN TỬ */}
      {selectedContractToPreview && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-fuchsia-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Thỏa Thuận Đặt Cọc Điện Tử #HD-928 (Bản Ký Số PWA)
                </h3>
              </div>
              <button onClick={() => setSelectedContractToPreview(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto text-xs bg-slate-50/50 dark:bg-slate-950">
              {/* Paper Layout */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm space-y-4 font-serif text-slate-800 dark:text-slate-200">
                <div className="text-center space-y-1">
                  <div className="font-bold uppercase text-xs">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="text-[10px] italic">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="w-24 h-0.5 bg-slate-300 mx-auto mt-1"></div>
                  <h4 className="font-bold text-sm uppercase mt-4 text-fuchsia-900 dark:text-fuchsia-300">
                    THỎA THUẬN ĐẶT CỌC NGUYÊN TẮC
                  </h4>
                  <div className="text-[10px] text-slate-500">Số: 928/2026/TTDC-NOVA</div>
                </div>

                <div className="space-y-2 text-[11px] leading-relaxed">
                  <p><b>BÊN BÁN (BÊN A):</b> CÔNG TY CỔ PHẦN TẬP ĐOÀN ĐẦU TƯ ĐỊA ỐC NOVALAND</p>
                  <p><b>BÊN MUA (BÊN B):</b> Ông NGUYỄN VĂN TUẤN • CCCD: 079188002931 cấp ngày 10/02/2021</p>
                  <p><b>BẤT ĐỘNG SẢN:</b> Căn hộ/Biệt thự mã hiệu <b>AQC-PH-102</b> thuộc Dự án Khu đô thị sinh thái Aqua City (Đảo Phượng Hoàng).</p>
                  <p><b>GIÁ TRỊ ĐẶT CỌC:</b> <b>200.000.000 VNĐ</b> (Hai trăm triệu đồng chẵn).</p>
                </div>

                {/* E-Signature Box */}
                <div className="grid grid-cols-2 gap-6 pt-4 border-t mt-4">
                  <div className="text-center space-y-1">
                    <p className="font-bold text-[11px]">ĐẠI DIỆN CHỦ ĐẦU TƯ</p>
                    <div className="h-16 flex items-center justify-center">
                      <div className="border border-red-500 text-red-600 rounded-full px-3 py-1 text-[10px] font-bold rotate-[-6deg]">
                        ĐÃ KÝ DUYỆT SỐ
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">Ban Pháp Chế Novaland</p>
                  </div>

                  <div className="text-center space-y-1">
                    <p className="font-bold text-[11px]">NGƯỜI ĐẶT CỌC (BÊN B)</p>
                    <div className="h-16 flex items-center justify-center">
                      <span className="font-script text-xl text-blue-700 font-bold italic rotate-[-4deg]">
                        Nguyễn Văn Tuấn
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500">Nguyễn Văn Tuấn (Ký điện tử)</p>
                  </div>
                </div>

                {/* Verification Meta */}
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border text-[10px] text-slate-500 space-y-1">
                  <div>Tọa độ GPS ký: <b>10.8231° N, 106.6297° E</b> (Xác thực thực địa)</div>
                  <div>Thời gian: <b>2026-07-20 09:15:32 ICT</b></div>
                  <div className="font-mono text-[9px] truncate">Mã SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setSelectedContractToPreview(false)} className="cursor-pointer">
                  Đóng
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setSelectedContractToPreview(false)
                    showToast('Đang tải xuống file HĐMB ký số `HopDong_Coc_HD928_Signed.pdf`!')
                  }}
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 mr-1" /> Tải Bản PDF Ký Số
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL 2: HƯỚNG DẪN CÀI ĐẶT PWA KHÔNG CẦN APP STORE */}
      {showPwaInstallModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-fuchsia-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cài Đặt PWA Field App</h3>
              </div>
              <button onClick={() => setShowPwaInstallModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="text-center space-y-2">
                <div className="w-36 h-36 mx-auto bg-white p-2 rounded-xl border shadow-sm flex items-center justify-center">
                  <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-slate-400 border border-dashed rounded-lg">
                    <QrCode className="h-20 w-20 text-fuchsia-600" />
                    <span className="text-[9px] mt-1 text-slate-500">Scan bằng Camera</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Quét mã QR bằng iPhone hoặc Android để mở trực tiếp ứng dụng PWA mà không cần tải từ App Store.
                </p>
              </div>

              <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                <div className="font-semibold text-slate-700 dark:text-slate-300">Hướng dẫn cài đặt nhanh:</div>
                <ol className="list-decimal pl-4 space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
                  <li>Mở link trên trình duyệt Safari (iOS) hoặc Chrome (Android).</li>
                  <li>Nhấp biểu tượng <b>Chia sẻ (Share)</b> ở thanh công cụ trình duyệt.</li>
                  <li>Chọn mục <b>"Thêm vào Màn hình chính (Add to Home Screen)"</b>.</li>
                  <li>Biểu tượng Nova Field App sẽ xuất hiện trên màn hình như app nguyên bản.</li>
                </ol>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowPwaInstallModal(false)} className="cursor-pointer">
                  Đóng
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setShowPwaInstallModal(false)
                    showToast('Đã sao chép link cài đặt PWA: https://crm.novaland.com.vn/field-app')
                  }}
                  className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" /> Sao Chép Đường Dẫn PWA
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL 3: QUÉT THẺ ĐỊNH DANH CCCD GẮN CHIP (eKYC SCANNER) */}
      {showScanIdModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ống Kính Quét CCCD Gắn Chip</h3>
              </div>
              <button onClick={() => setShowScanIdModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Simulated Camera Viewfinder with Laser */}
              <div className="relative h-44 bg-slate-950 rounded-xl overflow-hidden border-2 border-dashed border-emerald-500 flex items-center justify-center">
                <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-bounce top-1/3"></div>
                <div className="text-center space-y-1 text-slate-400 z-10">
                  <Camera className="h-8 w-8 mx-auto text-emerald-400 animate-pulse" />
                  <p className="text-[11px] text-white font-bold">Đặt mã QR trên thẻ CCCD vào trong khung</p>
                  <p className="text-[9px] text-slate-400">Tự động nhận diện dữ liệu OCR sau 2 giây</p>
                </div>
              </div>

              {/* Parsed eKYC Information */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border space-y-1.5 text-[11px]">
                <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Đã bóc tách thành công thông tin:
                </div>
                <div>Họ và tên: <b>TRẦN THỊ BÍCH NGỌC</b></div>
                <div>Số CCCD: <b>079198002931</b> • Giới tính: Nữ</div>
                <div>Ngày sinh: 14/08/1985 • Quốc tịch: Việt Nam</div>
                <div>Nơi thường trú: Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh</div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowScanIdModal(false)} className="cursor-pointer">
                  Hủy
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setShowScanIdModal(false)
                    handleSaveAction(
                      'eKYC Quét CCCD (Trần Thị Bích Ngọc)', 
                      'kyc', 
                      'CCCD 079198002931 | Thảo Điền, TP.Thủ Đức', 
                      { customerName: 'Trần Thị Bích Ngọc' }
                    )
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Nhập Vào Hồ Sơ Khách
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL 4: CHI TIẾT GÓI TIN HÀNG ĐỢI ĐỒNG BỘ (PAYLOAD JSON) */}
      {selectedQueueItemModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <RotateCw className="h-5 w-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Chi Tiết Gói Tin Hàng Đợi #{selectedQueueItemModal.id}
                </h3>
              </div>
              <button onClick={() => setSelectedQueueItemModal(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border text-[11px]">
                <div>Loại tác vụ: <b>{selectedQueueItemModal.type || 'Chữ ký'}</b></div>
                <div>Thời gian ghi: <b>{selectedQueueItemModal.time}</b></div>
                <div>Trạng thái: <Badge className="bg-amber-500 text-white text-[9px] py-0">{selectedQueueItemModal.status || 'Chờ gửi'}</Badge></div>
                <div>Số lần thử: <b>{selectedQueueItemModal.retryCount || 0} lần</b></div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Cấu trúc Payload JSON kỹ thuật (Offline Buffer):</Label>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto max-h-48 border">
{JSON.stringify({
  taskId: selectedQueueItemModal.id,
  taskName: selectedQueueItemModal.task,
  recordedAt: selectedQueueItemModal.time,
  type: selectedQueueItemModal.type,
  payload: selectedQueueItemModal.payload,
  customerName: selectedQueueItemModal.customerName,
  propertyCode: selectedQueueItemModal.propertyCode,
  location: selectedQueueItemModal.locationName || 'Công trường thực địa',
  networkStatus: isOffline ? 'offline_cached' : 'online_pending',
  syncRetryMax: 5
}, null, 2)}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-200 cursor-pointer text-xs"
                  onClick={() => {
                    removeSyncTask(selectedQueueItemModal.id)
                    setSelectedQueueItemModal(null)
                    showToast('Đã xóa tác vụ khỏi hàng đợi!')
                  }}
                >
                  <Trash2 className="h-3 w-3 mr-1" /> Xóa Khỏi Queue
                </Button>

                <Button 
                  size="sm" 
                  onClick={() => {
                    removeSyncTask(selectedQueueItemModal.id)
                    setSelectedQueueItemModal(null)
                    showToast(`Đã đồng bộ ngay tác vụ #${selectedQueueItemModal.id} lên Server thành công!`)
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer text-xs"
                >
                  <RotateCw className="h-3 w-3 mr-1" /> Ép Đồng Bộ Ngay
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL 5: HẸN GIỜ PHÁT SÓNG THÔNG BÁO TỰ ĐỘNG */}
      {showScheduleNotifModal && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Lập Lịch Hẹn Giờ Bắn Push Notification</h3>
              </div>
              <button onClick={() => setShowScheduleNotifModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <Label className="text-xs font-semibold mb-1 block">Thời điểm phát thông báo tự động</Label>
                <Input 
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Tiêu đề thông báo hẹn giờ</Label>
                <Input 
                  value={scheduledTitle}
                  onChange={(e) => setScheduledTitle(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200">
                Hệ thống cronjob sẽ tự động kích hoạt Push Notification xuống toàn bộ thiết bị môi giới vào thời điểm đã chọn.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowScheduleNotifModal(false)} className="cursor-pointer">
                  Hủy
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setShowScheduleNotifModal(false)
                    showToast(`Đã thiết lập lịch gửi thông báo tự động vào lúc ${scheduledTime}!`)
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Lưu Lịch Phát Sóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
