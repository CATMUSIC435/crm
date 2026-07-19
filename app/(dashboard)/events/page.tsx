"use client"
import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  CalendarRange, Ticket, QrCode, ScanLine, 
  Users, MapPin, Clock, CheckCircle2, MonitorPlay, 
  Presentation, ArrowRight, Play, Camera
} from 'lucide-react'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('scanner')
  const { customers, projects } = useStore()

  const projectName = projects[0]?.name || 'Aqua 2'
  
  const EVENTS = [
    { id: 1, title: `Lễ Mở Bán Phân Khu ${projectName}`, type: 'Open House', date: 'Thứ 7, 25/07/2026', time: '08:00 - 12:00', location: 'Sa bàn Novaworld', registered: customers.length > 0 ? customers.length * 10 : 450, capacity: 500, image: 'bg-indigo-600', icon: <Presentation className="h-6 w-6 text-white"/> },
    { id: 2, title: 'Webinar: Tiềm năng BĐS Nghỉ dưỡng 2026', type: 'Webinar', date: 'Thứ 5, 23/07/2026', time: '19:00 - 21:00', location: 'Zoom / Livestream', registered: 1200, capacity: 2000, image: 'bg-blue-500', icon: <MonitorPlay className="h-6 w-6 text-white"/> },
    { id: 3, title: 'Workshop: Phong thủy nhà ở cho Giới tinh hoa', type: 'Workshop', date: 'CN, 02/08/2026', time: '09:00 - 11:30', location: 'Khách sạn Caravelle', registered: 120, capacity: 150, image: 'bg-emerald-600', icon: <Users className="h-6 w-6 text-white"/> },
  ]

  const CHECKIN_LOG = [
    { id: 101, name: customers[0]?.name || 'Trần Đại Nghĩa', ticket: 'VIP-0992', time: 'Vừa xong', status: 'VIP' },
    { id: 102, name: customers[1]?.name || 'Lê Hoàng Yến', ticket: 'STD-1102', time: '2 phút trước', status: 'Standard' },
    { id: 103, name: customers[2]?.name || 'Phạm Quang Hùng', ticket: 'STD-1105', time: '5 phút trước', status: 'Standard' },
    { id: 104, name: 'Nguyễn Thị Kim', ticket: 'VIP-0911', time: '12 phút trước', status: 'VIP' },
  ]

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarRange className="h-8 w-8 text-indigo-500" />
            Sự Kiện & Check-in QR
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý Lễ mở bán, Workshop, Webinar và Trạm quét vé QR đón khách.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
           <Ticket className="h-4 w-4 mr-2" /> Tạo Sự Kiện Mới
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
          <TabsTrigger value="events" className="flex items-center gap-2"><CalendarRange className="h-4 w-4"/> Quản Lý Sự Kiện</TabsTrigger>
          <TabsTrigger value="scanner" className="flex items-center gap-2"><ScanLine className="h-4 w-4"/> Trạm Check-in QR</TabsTrigger>
        </TabsList>

        {/* 1. EVENTS MANAGEMENT TAB */}
        <TabsContent value="events" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
             <Card className="shadow-sm">
               <CardContent className="p-4 flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                   <CalendarRange className="h-6 w-6"/>
                 </div>
                 <div>
                   <div className="text-2xl font-bold">12</div>
                   <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sự kiện sắp tới</div>
                 </div>
               </CardContent>
             </Card>
             <Card className="shadow-sm">
               <CardContent className="p-4 flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                   <Users className="h-6 w-6"/>
                 </div>
                 <div>
                   <div className="text-2xl font-bold">1,770</div>
                   <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lượt đăng ký</div>
                 </div>
               </CardContent>
             </Card>
             <Card className="shadow-sm">
               <CardContent className="p-4 flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                   <CheckCircle2 className="h-6 w-6"/>
                 </div>
                 <div>
                   <div className="text-2xl font-bold">85%</div>
                   <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tỷ lệ Check-in TB</div>
                 </div>
               </CardContent>
             </Card>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {EVENTS.map(event => (
               <Card key={event.id} className="shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                 <div className={`h-24 ${event.image} relative flex items-center justify-center`}>
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                    <div className="relative z-10 flex flex-col items-center">
                       {event.icon}
                       <Badge variant="secondary" className="mt-2 bg-white/20 text-white hover:bg-white/30 border-0 shadow-sm">{event.type}</Badge>
                    </div>
                 </div>
                 <CardContent className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-2 mb-4 h-14">{event.title}</h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4 text-slate-400" /> {event.date} • {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" /> {event.location}
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                        <span>Đã đăng ký: {event.registered}</span>
                        <span>Sức chứa: {event.capacity}</span>
                      </div>
                      <Progress value={(event.registered / event.capacity) * 100} className="h-2 mb-4" />
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 border-slate-300">Sửa</Button>
                        <Button 
                          className="flex-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-bold"
                          onClick={() => setActiveTab('scanner')}
                        >
                          Check-in QR
                        </Button>
                      </div>
                    </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </TabsContent>

        {/* 2. QR SCANNER TAB */}
        <TabsContent value="scanner">
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[600px]">
              
              {/* Lễ Tân Scanner (Left) */}
              <Card className="xl:col-span-8 shadow-2xl border-slate-800 bg-slate-950 overflow-hidden relative flex flex-col">
                 <div className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10 relative">
                   <div className="flex items-center gap-3">
                     <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                     <span className="text-white font-bold tracking-wider">LIVE CAMERA FEED</span>
                   </div>
                   <Badge className="bg-indigo-500 hover:bg-indigo-600">Lễ Mở Bán Phân Khu Aqua 2</Badge>
                 </div>
                 
                 {/* Camera Viewfinder */}
                 <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                    {/* Simulated blurry background of a crowd */}
                    <div className="absolute inset-0 bg-slate-800 opacity-50"></div>
                    
                    {/* Focus Box */}
                    <div className="relative z-10 w-64 h-64 border-2 border-white/20 rounded-3xl overflow-hidden shadow-[0_0_0_4000px_rgba(0,0,0,0.6)]">
                       
                       {/* Scanner Corners */}
                       <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-2xl"></div>
                       <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-2xl"></div>
                       <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-2xl"></div>
                       <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-2xl"></div>
                       
                       {/* Animated Laser Line */}
                       <div className="w-full h-0.5 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] absolute left-0 animate-[scan_2s_ease-in-out_infinite]"></div>
                       
                       {/* Center target */}
                       <div className="absolute inset-0 flex items-center justify-center opacity-30">
                         <QrCode className="w-24 h-24 text-white" />
                       </div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="absolute bottom-8 left-0 right-0 text-center z-10">
                       <p className="text-white/70 font-mono text-sm tracking-widest bg-black/50 inline-block px-4 py-2 rounded-full backdrop-blur-sm">
                         HƯỚNG MÃ QR VÀO TRUNG TÂM KHUNG HÌNH
                       </p>
                    </div>
                 </div>

                 {/* Manual Input Fallback */}
                 <div className="p-4 bg-slate-900 border-t border-slate-800 z-10 relative flex gap-2">
                    <Input placeholder="Hoặc nhập mã vé thủ công (VD: VIP-0992)..." className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
                    <Button className="bg-slate-700 hover:bg-slate-600 text-white px-8">Nhập</Button>
                 </div>
              </Card>

              {/* Lịch Sử Check-in Realtime (Right) */}
              <Card className="xl:col-span-4 shadow-sm flex flex-col h-full border-l-4 border-l-indigo-500">
                 <CardHeader className="pb-3 border-b bg-slate-50">
                   <CardTitle className="text-lg flex justify-between items-center">
                     <span>Lịch Sử Đón Khách</span>
                     <Badge variant="outline" className="bg-white">450 / 500 Khách</Badge>
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0 flex-1 overflow-y-auto">
                    <div className="divide-y">
                       {/* Success flash effect for the newest entry */}
                       <div className="p-4 bg-green-50 animate-pulse border-l-4 border-green-500 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                           <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
                             <CheckCircle2 className="h-6 w-6" />
                           </div>
                           <div>
                             <div className="font-bold text-slate-800 flex items-center gap-2">{customers[0]?.name || 'Trần Đại Nghĩa'} <Badge className="bg-amber-500 text-[9px] px-1 h-4">VIP</Badge></div>
                             <div className="text-xs text-slate-500 font-mono mt-0.5">Vé: VIP-0992</div>
                           </div>
                         </div>
                         <div className="text-xs font-bold text-green-600">Vừa xong</div>
                       </div>
                       
                       {/* Older entries */}
                       {CHECKIN_LOG.slice(1).map(log => (
                         <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
                           <div className="flex items-center gap-3">
                             <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                               <CheckCircle2 className="h-5 w-5" />
                             </div>
                             <div>
                               <div className="font-bold text-slate-700 flex items-center gap-2">
                                 {log.name} 
                                 {log.status === 'VIP' && <Badge className="bg-amber-500 text-[9px] px-1 h-4">VIP</Badge>}
                               </div>
                               <div className="text-xs text-slate-400 font-mono mt-0.5">Vé: {log.ticket}</div>
                             </div>
                           </div>
                           <div className="text-xs font-medium text-slate-400">{log.time}</div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
                 <div className="p-3 border-t bg-slate-50 text-center">
                    <Button variant="link" className="text-indigo-600 text-sm h-auto p-0">Xem toàn bộ danh sách</Button>
                 </div>
              </Card>

           </div>
           
           {/* Thêm CSS Animation cho tia laser */}
           <style dangerouslySetInnerHTML={{__html: `
             @keyframes scan {
               0% { top: 0%; opacity: 0; }
               10% { opacity: 1; }
               90% { opacity: 1; }
               100% { top: 100%; opacity: 0; }
             }
           `}} />
        </TabsContent>

      </Tabs>
    </div>
  )
}
