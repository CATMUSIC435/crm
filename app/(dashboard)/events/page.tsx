"use client"
import React, { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  CalendarRange, Ticket, QrCode, ScanLine, 
  Users, MapPin, Clock, CheckCircle2, MonitorPlay, 
  Presentation, Target, UserCheck
} from 'lucide-react'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState('scanner')
  const { events, checkinLogs, addCheckin } = useStore()
  
  // Scanner state
  const [scanCode, setScanCode] = useState("")
  const [scanFlash, setScanFlash] = useState(false)

  // Calculations
  const totalEvents = events.length
  const totalRegistered = events.reduce((sum, e) => sum + e.registered, 0)
  const totalCheckedIn = events.reduce((sum, e) => sum + e.checkedIn, 0)
  const avgCheckinRate = totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0

  // Focus event for Scanner (e1 is Aqua 2)
  const currentEvent = events.find(e => e.id === 'e1')

  const handleScan = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!scanCode.trim()) return

    addCheckin('e1', scanCode.trim())
    setScanCode("")
    
    // Trigger visual flash
    setScanFlash(true)
    setTimeout(() => setScanFlash(false), 1500)
  }

  const renderIcon = (name: string, className: string) => {
    switch(name) {
      case 'MonitorPlay': return <MonitorPlay className={className} />
      case 'Users': return <Users className={className} />
      case 'Presentation': default: return <Presentation className={className} />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CalendarRange className="h-8 w-8 text-indigo-500" />
            Sự Kiện & Check-in QR
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">Quản lý các sự kiện bán hàng và Trạm quét vé QR đón khách Live-Data.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-6">
           <Ticket className="h-4 w-4 mr-2" /> Tạo Sự Kiện Mới
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[500px] mb-6 h-auto md:h-12 bg-slate-100 p-1.5 rounded-xl">
          <TabsTrigger value="events" className="rounded-lg py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"><CalendarRange className="h-4 w-4 text-indigo-600"/> Quản Lý Sự Kiện</TabsTrigger>
          <TabsTrigger value="scanner" className="rounded-lg py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 relative">
             <ScanLine className="h-4 w-4 text-emerald-600"/> Trạm Check-in QR
             <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </TabsTrigger>
        </TabsList>

        {/* 1. EVENTS MANAGEMENT TAB */}
        <TabsContent value="events" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
             <Card className="shadow-sm border-0 ring-1 ring-slate-200 hover:ring-indigo-200 transition-all">
               <CardContent className="p-5 flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                   <CalendarRange className="h-7 w-7"/>
                 </div>
                 <div>
                   <div className="text-3xl font-black text-slate-800">{totalEvents}</div>
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Sự kiện đang chạy</div>
                 </div>
               </CardContent>
             </Card>
             <Card className="shadow-sm border-0 ring-1 ring-slate-200 hover:ring-emerald-200 transition-all">
               <CardContent className="p-5 flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                   <Users className="h-7 w-7"/>
                 </div>
                 <div>
                   <div className="text-3xl font-black text-slate-800">{totalRegistered.toLocaleString()}</div>
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Lượt khách đăng ký</div>
                 </div>
               </CardContent>
             </Card>
             <Card className="shadow-sm border-0 ring-1 ring-slate-200 hover:ring-blue-200 transition-all">
               <CardContent className="p-5 flex items-center gap-5">
                 <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
                   <CheckCircle2 className="h-7 w-7"/>
                 </div>
                 <div>
                   <div className="text-3xl font-black text-slate-800">{avgCheckinRate}%</div>
                   <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Tỷ lệ Check-in (Show-up)</div>
                 </div>
               </CardContent>
             </Card>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {events.map(event => {
               const checkinPct = Math.round((event.checkedIn / event.registered) * 100);
               return (
                 <Card key={event.id} className="shadow-sm border-0 ring-1 ring-slate-200 hover:shadow-lg transition-shadow overflow-hidden flex flex-col group">
                   <div className={`h-28 ${event.image} relative flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
                      <div className="relative z-10 flex flex-col items-center transform group-hover:scale-110 transition-transform duration-500">
                         {renderIcon(event.iconName, "h-8 w-8 text-white drop-shadow-md")}
                         <Badge variant="secondary" className="mt-2 bg-white/20 text-white hover:bg-white/30 border border-white/30 shadow-sm backdrop-blur-sm px-3">{event.type}</Badge>
                      </div>
                   </div>
                   <CardContent className="p-5 flex-1 flex flex-col bg-white">
                      <h3 className="font-bold text-lg text-slate-800 line-clamp-2 mb-4 leading-tight">{event.title}</h3>
                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 p-2 rounded-md">
                          <Clock className="h-4 w-4 text-indigo-500 shrink-0" /> {event.date} • {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 p-2 rounded-md">
                          <MapPin className="h-4 w-4 text-rose-500 shrink-0" /> {event.location}
                        </div>
                      </div>
                      
                      <div className="mt-auto border-t border-dashed pt-4">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Tiến độ Check-in</div>
                            <div className="text-sm font-black text-slate-700">{event.checkedIn} / {event.registered} Khách</div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700 border-none">{checkinPct}%</Badge>
                        </div>
                        <Progress value={checkinPct} className="h-2 mb-4 bg-slate-100 [&>div]:bg-emerald-500" />
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1 border-slate-300 text-slate-600 font-bold">Cài đặt</Button>
                          <Button 
                            className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700 font-bold shadow-sm"
                            onClick={() => setActiveTab('scanner')}
                          >
                            Mở Trạm Quét
                          </Button>
                        </div>
                      </div>
                   </CardContent>
                 </Card>
               )
             })}
           </div>
        </TabsContent>

        {/* 2. QR SCANNER TAB */}
        <TabsContent value="scanner">
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[650px]">
              
              {/* Lễ Tân Scanner (Left) */}
              <Card className="xl:col-span-8 shadow-2xl border-slate-800 bg-slate-950 overflow-hidden relative flex flex-col rounded-2xl">
                 <div className="p-4 md:p-5 bg-slate-900 border-b border-slate-800 flex justify-between items-center z-10 relative">
                   <div className="flex items-center gap-3">
                     <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                     <span className="text-white font-bold tracking-widest text-sm">LIVE CAMERA FEED</span>
                   </div>
                   <Badge className="bg-indigo-500 hover:bg-indigo-600 px-3 py-1 text-sm border-none shadow-md">{currentEvent?.title}</Badge>
                 </div>
                 
                 {/* Camera Viewfinder */}
                 <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[url('https://images.unsplash.com/photo-1557971370-e7298ee473fc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center">
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
                    
                    {/* Scanner Flash Effect */}
                    <div className={`absolute inset-0 bg-green-500 transition-opacity duration-300 z-50 pointer-events-none mix-blend-overlay ${scanFlash ? 'opacity-40' : 'opacity-0'}`}></div>
                    
                    {/* Focus Box */}
                    <div className={`relative z-10 w-72 h-72 border-2 ${scanFlash ? 'border-green-400' : 'border-white/20'} rounded-3xl overflow-hidden shadow-[0_0_0_4000px_rgba(15,23,42,0.85)] transition-colors`}>
                       
                       {/* Scanner Corners */}
                       <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-400 rounded-tl-2xl"></div>
                       <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-400 rounded-tr-2xl"></div>
                       <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-400 rounded-bl-2xl"></div>
                       <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-400 rounded-br-2xl"></div>
                       
                       {/* Animated Laser Line */}
                       <div className={`w-full h-1 bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)] absolute left-0 animate-[scan_2.5s_ease-in-out_infinite] ${scanFlash ? 'hidden' : 'block'}`}></div>
                       
                       {/* Center target */}
                       <div className="absolute inset-0 flex items-center justify-center opacity-40">
                         {scanFlash ? <CheckCircle2 className="w-24 h-24 text-green-400" /> : <QrCode className="w-24 h-24 text-white" />}
                       </div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="absolute bottom-10 left-0 right-0 text-center z-10">
                       <p className="text-white font-mono text-sm tracking-widest bg-black/60 inline-flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 shadow-xl">
                         <Target className="h-4 w-4 text-green-400" /> HƯỚNG MÃ QR VÀO KHUNG
                       </p>
                    </div>
                 </div>

                 {/* Manual Input Form */}
                 <div className="p-5 bg-slate-900 border-t border-slate-800 z-10 relative">
                    <form onSubmit={handleScan} className="flex gap-3">
                      <Input 
                        value={scanCode}
                        onChange={(e) => setScanCode(e.target.value)}
                        placeholder="Hoặc nhập tên/mã vé (VD: VIP-999, Trần Văn A)..." 
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 h-12 text-lg font-mono" 
                      />
                      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 h-12 font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)]">Quét Vé</Button>
                    </form>
                 </div>
              </Card>

              {/* Lịch Sử Check-in Realtime (Right) */}
              <Card className="xl:col-span-4 shadow-xl flex flex-col h-full border-0 ring-1 ring-slate-200 overflow-hidden rounded-2xl">
                 <CardHeader className="p-5 border-b bg-gradient-to-r from-slate-50 to-white">
                   <CardTitle className="text-lg flex flex-col gap-2">
                     <span className="font-bold flex items-center gap-2"><UserCheck className="h-5 w-5 text-indigo-500"/> Lịch Sử Đón Khách</span>
                     <div className="flex items-center justify-between mt-2">
                       <span className="text-xs font-bold text-slate-500 uppercase">Tiến độ</span>
                       <Badge variant="outline" className="bg-indigo-50 text-indigo-700 font-black border-indigo-200 shadow-sm px-3">{currentEvent?.checkedIn} / {currentEvent?.registered} Khách</Badge>
                     </div>
                     <Progress value={(currentEvent?.checkedIn || 0) / (currentEvent?.registered || 1) * 100} className="h-1.5 mt-1" />
                   </CardTitle>
                 </CardHeader>
                 <CardContent className="p-0 flex-1 overflow-y-auto bg-slate-50/30">
                    <div className="divide-y divide-slate-100">
                       {checkinLogs.filter(l => l.eventId === 'e1').map((log, index) => (
                         <div key={log.id} className={`p-4 md:p-5 transition-all duration-500 flex justify-between items-center bg-white ${index === 0 && scanFlash ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}>
                           <div className="flex items-center gap-3">
                             <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ring-1 ${index === 0 ? 'bg-green-100 text-green-600 ring-green-200' : 'bg-slate-50 text-slate-400 ring-slate-200'}`}>
                               <CheckCircle2 className={`h-6 w-6 ${index === 0 && scanFlash ? 'animate-bounce' : ''}`} />
                             </div>
                             <div>
                               <div className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                                 {log.name} 
                                 {log.status === 'VIP' && <Badge className="bg-amber-100 text-amber-700 border-none text-[9px] px-1.5 font-black uppercase shadow-sm">VIP</Badge>}
                               </div>
                               <div className="text-xs text-slate-500 font-mono mt-1 bg-slate-100 px-1.5 py-0.5 rounded w-fit text-[10px] tracking-wider">{log.ticket}</div>
                             </div>
                           </div>
                           <div className={`text-xs font-bold ${index === 0 ? 'text-green-600' : 'text-slate-400'}`}>{log.time}</div>
                         </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>

           </div>
           
           {/* CSS Animation cho tia laser */}
           <style dangerouslySetInnerHTML={{__html: `
             @keyframes scan {
               0% { top: 0%; opacity: 0; }
               15% { opacity: 1; }
               85% { opacity: 1; }
               100% { top: 100%; opacity: 0; }
             }
           `}} />
        </TabsContent>

      </Tabs>
    </div>
  )
}
