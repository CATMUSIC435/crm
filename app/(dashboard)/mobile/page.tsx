"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import { 
  Smartphone, Wifi, WifiOff, MapPin, QrCode, PenTool, 
  Bell, Send, CheckCircle2, RotateCw, Fingerprint, Camera, Radio, X
} from 'lucide-react'

export default function MobileHubPage() {
  const { syncQueue, mobileNotifications, addSyncTask, clearSyncQueue, sendMobileNotification } = useStore()
  
  const [isOffline, setIsOffline] = useState(false)
  const [activeAppTab, setActiveAppTab] = useState('sign')
  const [isSyncing, setIsSyncing] = useState(false)

  // Push Notification state
  const [notifTitle, setNotifTitle] = useState('🔥 Khẩn cấp: Bảng hàng Aqua City vừa mở!')
  const [notifMessage, setNotifMessage] = useState('Có 5 căn Biệt thự góc vừa bung ra, anh em chốt ngay khách VIP nhé!')
  const [showToast, setShowToast] = useState(false)
  const [currentToast, setCurrentToast] = useState<{title: string, message: string} | null>(null)

  // Canvas ref for signature
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // Toggle Network
  const toggleNetwork = (checked: boolean) => {
     setIsOffline(checked)
     if (!checked && syncQueue.length > 0) {
        // Turning online -> auto sync
        setIsSyncing(true)
        setTimeout(() => {
           clearSyncQueue()
           setIsSyncing(false)
        }, 2000)
     }
  }

  // Handle Save Action (Sign or GPS)
  const handleSaveAction = (taskName: string) => {
     if (isOffline) {
        addSyncTask(taskName)
     } else {
        // Online -> sync immediately
        setIsSyncing(true)
        setTimeout(() => setIsSyncing(false), 800)
     }
     
     // Clear canvas if signing
     if (taskName === 'Chữ ký hợp đồng' && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
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

    // Setup coordinates for mouse and touch
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
    ctx.strokeStyle = '#1e293b'

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  // Effect to reset path when stop drawing
  useEffect(() => {
     if (!isDrawing && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d')
        ctx?.beginPath()
     }
  }, [isDrawing])

  // Effect to show toast when a new notification arrives
  useEffect(() => {
    if (mobileNotifications.length > 0) {
      const latestNotif = mobileNotifications[mobileNotifications.length - 1]
      setCurrentToast({ title: latestNotif.title, message: latestNotif.message })
      setShowToast(true)
      
      const timer = setTimeout(() => {
        setShowToast(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [mobileNotifications])

  const handleSendNotification = () => {
    if (!notifTitle.trim() || !notifMessage.trim()) return
    sendMobileNotification(notifTitle, notifMessage)
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Smartphone className="h-8 w-8 text-fuchsia-600" />
            Trạm Di Động & PWA
          </h1>
          <p className="text-slate-500 mt-1">Giả lập ứng dụng Field App cho Sale đi thị trường (Offline-first, GPS, E-Signature).</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">
         
         {/* IPHONE SIMULATOR */}
         <div className="relative mx-auto lg:mx-0 w-[320px] h-[650px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl overflow-hidden shrink-0 ring-1 ring-slate-800">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50"></div>
            
            {/* SCREEN */}
            <div className="relative w-full h-full bg-slate-50 flex flex-col overflow-hidden">
               
               {/* Toast Notification (iOS Style) */}
               <div 
                 className={`absolute top-10 left-2 right-2 bg-slate-800/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl z-50 transition-all duration-500 ease-out flex flex-col gap-1 cursor-pointer
                   ${showToast ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-24 opacity-0 scale-95 pointer-events-none'}
                 `}
                 onClick={() => setShowToast(false)}
               >
                 <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                     <div className="w-5 h-5 bg-fuchsia-500 rounded flex items-center justify-center">
                       <Bell className="h-3 w-3 text-white" />
                     </div>
                     <span className="text-xs font-bold opacity-80">NOVA CRM</span>
                   </div>
                   <span className="text-[10px] opacity-60">bây giờ</span>
                 </div>
                 <div className="font-bold text-sm mt-1 leading-tight">{currentToast?.title}</div>
                 <div className="text-xs opacity-90 line-clamp-2 leading-relaxed">{currentToast?.message}</div>
                 <div className="w-8 h-1 bg-white/20 rounded-full self-center mt-1"></div>
               </div>

               {/* Status Bar */}
               <div className={`h-12 flex justify-between items-end px-6 pb-2 text-xs font-bold transition-colors ${isOffline ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
                  <div>09:41</div>
                  <div className="flex items-center gap-1.5">
                     {isOffline ? <WifiOff className="h-3 w-3" /> : <Wifi className="h-3 w-3" />}
                     <div className="h-2 w-4 bg-current rounded-sm"></div>
                  </div>
               </div>

               {/* App Content */}
               <div className="flex-1 flex flex-col">
                  {/* Header */}
                  <div className={`p-4 ${isOffline ? 'bg-red-500 text-white' : 'bg-fuchsia-600 text-white'}`}>
                     <h3 className="font-bold text-lg mb-1">Nova CRM Field</h3>
                     {isOffline ? (
                        <div className="text-xs flex items-center gap-1 opacity-90"><WifiOff className="h-3 w-3"/> Mất kết nối. Đang lưu Offline.</div>
                     ) : (
                        <div className="text-xs flex items-center gap-1 opacity-90"><Wifi className="h-3 w-3"/> Đang trực tuyến</div>
                     )}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 overflow-y-auto bg-slate-100 p-4 relative">
                     
                     {/* TAB: SIGNATURE */}
                     {activeAppTab === 'sign' && (
                        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden border">
                           <div className="p-3 border-b text-center font-bold text-slate-700">Chữ Ký Khách Hàng</div>
                           <div className="p-3 text-xs text-slate-500 text-center">Yêu cầu khách hàng ký tên vào khung dưới đây để xác nhận Hợp Đồng #HD-928.</div>
                           <div className="flex-1 bg-[#f8fafc] border-y relative">
                              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-200 text-4xl font-black opacity-30 select-none pointer-events-none">X</span>
                              <canvas 
                                 ref={canvasRef}
                                 width={280}
                                 height={240}
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
                           <div className="p-3 flex gap-2">
                              <Button 
                                 variant="outline" 
                                 className="flex-1 text-xs h-9" 
                                 onClick={() => {
                                    const ctx = canvasRef.current?.getContext('2d')
                                    ctx?.clearRect(0, 0, 300, 300)
                                 }}
                              >Xóa Lại</Button>
                              <Button 
                                 className={`flex-1 text-xs h-9 ${isOffline ? 'bg-red-600 hover:bg-red-700' : 'bg-fuchsia-600 hover:bg-fuchsia-700'}`}
                                 onClick={() => handleSaveAction('Chữ ký hợp đồng')}
                                 disabled={isSyncing}
                              >
                                 {isSyncing ? 'Đang gửi...' : (isOffline ? 'Lưu Tạm' : 'Ký & Gửi')}
                              </Button>
                           </div>
                        </div>
                     )}

                     {/* TAB: TOOLS (GPS/QR) */}
                     {activeAppTab === 'tools' && (
                        <div className="space-y-4">
                           {/* GPS Card */}
                           <div className="bg-white p-4 rounded-xl shadow-sm border">
                              <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                 <MapPin className="h-5 w-5" />
                              </div>
                              <h4 className="font-bold text-slate-800 mb-1">Check-in Vị Trí</h4>
                              <p className="text-xs text-slate-500 mb-3">Đánh dấu tọa độ khi dẫn khách đi xem dự án thực tế.</p>
                              <Button 
                                 className="w-full h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                                 onClick={() => handleSaveAction('GPS Check-in (Kinh độ: 106.7, Vĩ độ: 10.7)')}
                                 disabled={isSyncing}
                              >
                                 Ghi nhận tọa độ
                              </Button>
                           </div>
                           
                           {/* QR Card */}
                           <div className="bg-white p-4 rounded-xl shadow-sm border">
                              <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-3">
                                 <QrCode className="h-5 w-5" />
                              </div>
                              <h4 className="font-bold text-slate-800 mb-1">Quét Thẻ Định Danh</h4>
                              <p className="text-xs text-slate-500 mb-3">Bật Camera để quét QR Code trên CCCD của khách.</p>
                              <Button className="w-full h-9 text-xs bg-slate-900 text-white" disabled>
                                 <Camera className="h-3 w-3 mr-2" /> Bật Camera
                              </Button>
                           </div>
                        </div>
                     )}
                     
                     {/* Syncing Overlay */}
                     {isSyncing && (
                        <div className="absolute inset-0 z-40 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                           <RotateCw className="h-8 w-8 text-fuchsia-600 animate-spin mb-2" />
                           <div className="font-bold text-slate-800">Đang đồng bộ...</div>
                        </div>
                     )}

                  </div>

                  {/* Bottom Navigation */}
                  <div className="h-16 bg-white border-t flex justify-around items-center text-[10px] font-medium text-slate-500 pb-2 px-2 shrink-0">
                     <button onClick={() => setActiveAppTab('tools')} className={`flex flex-col items-center p-2 transition-colors ${activeAppTab === 'tools' ? 'text-fuchsia-600' : ''}`}>
                        <Radio className="h-5 w-5 mb-1" /> Công cụ
                     </button>
                     <button onClick={() => setActiveAppTab('sign')} className={`flex flex-col items-center p-2 transition-colors ${activeAppTab === 'sign' ? 'text-fuchsia-600' : ''}`}>
                        <PenTool className="h-5 w-5 mb-1" /> Ký Hợp Đồng
                     </button>
                     <button className="flex flex-col items-center p-2 opacity-50 cursor-not-allowed">
                        <Fingerprint className="h-5 w-5 mb-1" /> Vân Tay
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* RIGHT CONFIG PANELS */}
         <div className="flex-1 flex flex-col gap-6 w-full lg:max-w-xl">
            
            {/* Offline Control */}
            <Card className="shadow-sm border-fuchsia-200">
               <CardHeader className="bg-fuchsia-50/50 border-b pb-4">
                  <div className="flex justify-between items-center">
                     <div>
                        <CardTitle className="flex items-center gap-2 text-fuchsia-900"><WifiOff className="h-5 w-5 text-fuchsia-600" /> Giả Lập Mất Mạng (Offline-First)</CardTitle>
                        <CardDescription className="mt-1">Tắt kết nối để xem dữ liệu được lưu tạm Queue.</CardDescription>
                     </div>
                     {/* @ts-ignore */}
                     <div 
                        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${isOffline ? 'bg-red-500 justify-end' : 'bg-green-500 justify-start'}`}
                        onClick={() => toggleNetwork(!isOffline)}
                     >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="bg-slate-50 p-3 border-b text-xs font-bold text-slate-500 flex justify-between">
                     <span>Hàng đợi chờ đồng bộ (Sync Queue)</span>
                     <Badge className={syncQueue.length > 0 ? 'bg-orange-500' : 'bg-slate-300'}>{syncQueue.length} tác vụ</Badge>
                  </div>
                  <div className="p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
                     {syncQueue.length === 0 ? (
                        <div className="text-center text-slate-400 text-sm py-4 italic flex flex-col items-center">
                           <CheckCircle2 className="h-6 w-6 text-green-300 mb-2" />
                           Tất cả dữ liệu đã được đẩy lên Máy chủ (Synced).
                        </div>
                     ) : (
                        <div className="space-y-2">
                           {syncQueue.map(item => (
                              <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg bg-orange-50 border-orange-200 text-sm">
                                 <div className="flex items-center gap-2">
                                    <RotateCw className="h-4 w-4 text-orange-500" />
                                    <span className="font-medium text-slate-800">{item.task}</span>
                                 </div>
                                 <span className="text-xs text-slate-500">{item.time}</span>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Push Notification */}
            <Card className="shadow-sm">
               <CardHeader className="border-b pb-4">
                  <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-amber-500" /> Bắn Thông Báo (Push Notification)</CardTitle>
                  <CardDescription>Gửi Notification "Ting ting" thẳng xuống màn hình điện thoại Sale.</CardDescription>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  <div>
                     <label className="text-sm font-medium mb-1 block">Tiêu đề thông báo</label>
                     <Input 
                       value={notifTitle}
                       onChange={(e) => setNotifTitle(e.target.value)}
                     />
                  </div>
                  <div>
                     <label className="text-sm font-medium mb-1 block">Nội dung</label>
                     <Input 
                       value={notifMessage}
                       onChange={(e) => setNotifMessage(e.target.value)}
                     />
                  </div>
                  <Button 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold"
                    onClick={handleSendNotification}
                  >
                     <Send className="h-4 w-4 mr-2" /> Bắn thông báo Broadcast
                  </Button>
               </CardContent>
            </Card>

         </div>

      </div>
    </div>
  )
}
