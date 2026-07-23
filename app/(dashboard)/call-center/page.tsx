"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  PhoneCall, MicOff, PhoneForwarded, User, Clock, 
  Play, Pause, BrainCircuit, Smile, Meh, Frown, Sparkles, 
  PhoneMissed, CheckCircle2, ChevronRight, X, Phone
} from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function CallCenterPage() {
  const { customers, callLogs, makeCall } = useStore()
  
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'summary'|'transcript'>('summary')
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)
  
  // Set default selected call on mount
  useEffect(() => {
    if (callLogs.length > 0 && !selectedCallId) {
      setSelectedCallId(callLogs[0].id)
    }
  }, [callLogs])

  const handleKeypad = (num: string) => {
    setPhoneNumber(prev => prev + num)
  }

  const handleCall = () => {
    if (!phoneNumber) return;
    makeCall(phoneNumber);
    setPhoneNumber('');
    // The new call will be added to the top of callLogs. We select it.
    setTimeout(() => {
      const latestCall = useStore.getState().callLogs[0];
      if (latestCall) setSelectedCallId(latestCall.id);
    }, 100);
  }

  const activeCall = callLogs.find(c => c.id === selectedCallId) || callLogs[0]

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PhoneCall className="h-8 w-8 text-green-500" />
            Tổng Đài AI & Telesale
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">Softphone gọi trực tiếp, AI phân tích cảm xúc và Bóc băng tự động theo thời gian thực.</p>
        </div>
        <div className="flex items-center gap-3 bg-green-50 text-green-700 px-5 py-2.5 rounded-full border border-green-200 font-bold text-sm shadow-sm">
           <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
           Trạng thái: Đang Trực (Available)
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI: SOFTPHONE & LỊCH SỬ (4/12) */}
        <div className="xl:col-span-4 space-y-6">
           
           {/* Softphone Keypad */}
           <Card className="shadow-lg border-0 ring-1 ring-slate-200 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden">
             <div className="bg-slate-50 border-b p-3 text-center">
               <Badge variant="outline" className="bg-white">Extension: 101 - Tuấn Tú</Badge>
             </div>
             <CardContent className="p-4 md:p-6 pt-5">
                
                {/* Display */}
                <div className="bg-slate-100 dark:bg-black/50 h-24 rounded-xl mb-6 flex flex-col items-center justify-center border shadow-inner relative group">
                  <div className={`text-3xl font-black tracking-wider ${phoneNumber ? 'text-slate-800' : 'text-slate-300'} dark:text-slate-100 transition-colors`}>
                    {phoneNumber || 'Nhập số...'}
                  </div>
                  {/* Try to match customer */}
                  {phoneNumber && (
                    <div className="text-xs font-bold text-indigo-600 mt-1 uppercase">
                      {customers.find(c => c.phone.replace(/\\s/g,'') === phoneNumber.replace(/\\s/g,''))?.name || 'Khách vãng lai'}
                    </div>
                  )}
                  {phoneNumber && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 text-slate-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 transition-colors"
                      onClick={() => setPhoneNumber(phoneNumber.slice(0, -1))}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8 px-2 md:px-4">
                  {[
                    { num: '1', char: '' }, { num: '2', char: 'ABC' }, { num: '3', char: 'DEF' },
                    { num: '4', char: 'GHI' }, { num: '5', char: 'JKL' }, { num: '6', char: 'MNO' },
                    { num: '7', char: 'PQRS' }, { num: '8', char: 'TUV' }, { num: '9', char: 'WXYZ' },
                    { num: '*', char: '' }, { num: '0', char: '+' }, { num: '#', char: '' }
                  ].map((key, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleKeypad(key.num)}
                      className="h-14 md:h-16 rounded-full flex flex-col items-center justify-center bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95 hover:border-indigo-200"
                    >
                      <span className="text-2xl font-black text-slate-700 dark:text-slate-200">{key.num}</span>
                      <span className="text-[9px] font-bold text-slate-400 h-3 uppercase tracking-widest">{key.char}</span>
                    </button>
                  ))}
                </div>

                {/* Call Actions */}
                <div className="flex justify-center items-center gap-6">
                  <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-slate-300 text-slate-500 hover:bg-slate-100 shadow-sm hover:text-slate-700 transition-transform active:scale-90">
                    <MicOff className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="icon" 
                    onClick={handleCall}
                    disabled={!phoneNumber}
                    className={`h-16 w-16 rounded-full shadow-xl transition-all active:scale-90 ${phoneNumber ? 'bg-green-500 hover:bg-green-600 hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    <Phone className="h-6 w-6 fill-current" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-slate-300 text-slate-500 hover:bg-slate-100 shadow-sm hover:text-slate-700 transition-transform active:scale-90">
                    <PhoneForwarded className="h-5 w-5" />
                  </Button>
                </div>

             </CardContent>
           </Card>

           {/* Call History */}
           <Card className="shadow-sm border-0 ring-1 ring-slate-200 overflow-hidden rounded-xl">
             <CardHeader className="pb-3 border-b bg-slate-50/80">
               <CardTitle className="text-base flex items-center justify-between">
                 Lịch Sử Cuộc Gọi 
                 <Badge className="bg-indigo-100 text-indigo-700 border-none">{callLogs.length} Cuộc</Badge>
               </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               <div className="flex flex-col h-[380px] overflow-y-auto">
                 {callLogs.map((call, index) => {
                   const isSelected = selectedCallId === call.id;
                   return (
                     <div 
                       key={call.id} 
                       onClick={() => setSelectedCallId(call.id)}
                       className={`flex items-center justify-between p-4 border-b cursor-pointer transition-all duration-300 
                         ${isSelected ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                     >
                        <div className="flex items-center gap-3">
                           <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-sm 
                             ${call.status === 'success' ? (isSelected ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600') : 'bg-red-100 text-red-600'}`}>
                              {call.status === 'success' ? <PhoneCall className="h-4 w-4" /> : <PhoneMissed className="h-4 w-4" />}
                           </div>
                           <div>
                              <div className="font-bold text-sm text-slate-800 dark:text-slate-200 line-clamp-1">{call.name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium mt-0.5"><Clock className="h-3 w-3"/> {call.time}</div>
                           </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                           <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-white text-indigo-700 shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                             {call.duration}
                           </span>
                           {call.sentiment === 'positive' && <Smile className="h-4 w-4 text-green-500" />}
                           {call.sentiment === 'neutral' && <Meh className="h-4 w-4 text-amber-500" />}
                           {call.sentiment === 'negative' && <Frown className="h-4 w-4 text-red-500" />}
                        </div>
                     </div>
                   )
                 })}
               </div>
             </CardContent>
           </Card>

        </div>

        {/* CỘT PHẢI: AI ANALYSIS & RECORDING (8/12) */}
        {activeCall && (
          <div className="xl:col-span-8 flex flex-col gap-6">
             
             {/* Trình Phát Ghi Âm (Audio Player) */}
             <Card className="shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border-0 overflow-hidden relative rounded-2xl">
               {/* Decorative background element */}
               <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                 <BrainCircuit className="w-64 h-64 -mt-16 -mr-16" />
               </div>
               
               <CardContent className="p-5 md:p-6">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                   <div>
                     <Badge className="bg-white/10 text-indigo-100 hover:bg-white/20 border-white/20 mb-3 shadow-sm font-bold">Cuộc gọi {activeCall.status === 'success' ? 'thành công' : 'nhỡ'}</Badge>
                     <h2 className="text-2xl font-bold flex items-center gap-2"><User className="h-5 w-5 opacity-70"/> {activeCall.name}</h2>
                     <p className="text-indigo-200 text-sm mt-1.5 font-mono bg-white/5 inline-block px-2 py-1 rounded">
                       {activeCall.phone}
                     </p>
                   </div>
                   <div className="bg-black/30 rounded-xl p-3 backdrop-blur-md border border-white/10 text-center shadow-inner min-w-[120px]">
                     <div className="text-3xl font-mono font-bold text-green-400">{activeCall.duration}</div>
                     <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mt-1">Thời Lượng</div>
                   </div>
                 </div>

                 {/* Audio Player UI */}
                 <div className="bg-black/40 p-4 md:p-5 rounded-xl backdrop-blur-md border border-white/10 shadow-lg">
                    <div className="flex items-center gap-4">
                       <Button 
                         onClick={() => setIsPlaying(!isPlaying)}
                         size="icon" 
                         className="h-12 w-12 rounded-full bg-white text-indigo-900 hover:bg-indigo-50 hover:scale-105 transition-all shadow-lg shrink-0"
                       >
                         {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 ml-1 fill-current" />}
                       </Button>
                       <div className="flex-1 space-y-2">
                          <div className="flex justify-between text-xs font-mono font-bold text-indigo-200 mb-1">
                             <span>{isPlaying ? '00:12' : '00:00'}</span>
                             <span>{activeCall.duration}</span>
                          </div>
                          {/* Simulated Waveform */}
                          <div className="h-8 flex items-end gap-1 cursor-pointer group">
                             {[...Array(40)].map((_, i) => (
                               <div 
                                 key={i} 
                                 className={`w-full rounded-t-sm transition-all duration-300 ${i < (isPlaying ? 5 : 0) ? 'bg-green-400' : 'bg-white/20 group-hover:bg-white/30'}`}
                                 style={{ height: `${Math.random() * 100}%` }}
                               ></div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
               </CardContent>
             </Card>

             {/* KẾT QUẢ PHÂN TÍCH AI (AI Sentiment & Summary) */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* AI Sentiment (Phân Tích Cảm Xúc) */}
                <Card className="shadow-sm border-0 ring-1 ring-slate-200 rounded-2xl">
                  <CardHeader className="pb-2 border-b bg-slate-50/50 rounded-t-2xl">
                    <CardTitle className="text-base flex items-center gap-2 text-indigo-700">
                      <Sparkles className="h-5 w-5" /> Phân Tích Cảm Xúc (Sentiment)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                     <div className="flex justify-center">
                        {/* Biểu đồ chấm điểm cảm xúc */}
                        <div className="relative w-40 h-40 flex items-center justify-center">
                           <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                             {/* Background */}
                             <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                             
                             {/* Dynamic Stroke based on dominant sentiment */}
                             <path 
                               className={`${activeCall.sentiment === 'positive' ? 'text-green-500' : activeCall.sentiment === 'negative' ? 'text-red-500' : 'text-amber-500'} transition-all duration-1000 ease-out drop-shadow-md`}
                               strokeWidth="4" 
                               strokeDasharray={`${Math.max(activeCall.scores.positive, activeCall.scores.neutral, activeCall.scores.negative)}, 100`} 
                               stroke="currentColor" 
                               fill="none" 
                               d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                             />
                           </svg>
                           <div className="absolute flex flex-col items-center">
                             <span className={`text-3xl font-black ${activeCall.sentiment === 'positive' ? 'text-green-600' : activeCall.sentiment === 'negative' ? 'text-red-600' : 'text-amber-600'}`}>
                               {Math.max(activeCall.scores.positive, activeCall.scores.neutral, activeCall.scores.negative)}%
                             </span>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                               {activeCall.sentiment === 'positive' ? 'Tích cực' : activeCall.sentiment === 'negative' ? 'Tiêu cực' : 'Trung tính'}
                             </span>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-4">
                       <div>
                         <div className="flex justify-between text-xs font-bold mb-1.5">
                           <span className="flex items-center gap-1.5 text-slate-600"><Smile className="h-4 w-4 text-green-500"/> Tích cực</span>
                           <span className="text-green-600">{activeCall.scores.positive}%</span>
                         </div>
                         <Progress value={activeCall.scores.positive} className="h-2 bg-slate-100 [&>div]:bg-green-500" />
                       </div>
                       <div>
                         <div className="flex justify-between text-xs font-bold mb-1.5">
                           <span className="flex items-center gap-1.5 text-slate-600"><Meh className="h-4 w-4 text-amber-500"/> Trung tính</span>
                           <span className="text-amber-600">{activeCall.scores.neutral}%</span>
                         </div>
                         <Progress value={activeCall.scores.neutral} className="h-2 bg-slate-100 [&>div]:bg-amber-500" />
                       </div>
                       <div>
                         <div className="flex justify-between text-xs font-bold mb-1.5">
                           <span className="flex items-center gap-1.5 text-slate-600"><Frown className="h-4 w-4 text-red-500"/> Tiêu cực</span>
                           <span className="text-red-600">{activeCall.scores.negative}%</span>
                         </div>
                         <Progress value={activeCall.scores.negative} className="h-2 bg-slate-100 [&>div]:bg-red-500" />
                       </div>
                     </div>
                  </CardContent>
                </Card>

                {/* AI Summary & Transcript */}
                <Card className="shadow-sm border-0 ring-1 ring-slate-200 flex flex-col rounded-2xl overflow-hidden">
                  <CardHeader className="p-0 border-b bg-slate-50">
                    <div className="flex">
                      <button 
                        className={`flex-1 py-3.5 font-bold text-sm border-b-2 transition-colors ${activeTab === 'summary' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                        onClick={() => setActiveTab('summary')}
                      >
                        AI Tóm Tắt Giao Dịch
                      </button>
                      <button 
                        className={`flex-1 py-3.5 font-bold text-sm border-b-2 transition-colors ${activeTab === 'transcript' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                        onClick={() => setActiveTab('transcript')}
                      >
                        Bóc Băng Hội Thoại
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 flex-1 bg-white">
                     
                     {activeTab === 'summary' ? (
                       <div className="space-y-5">
                         <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                            <h4 className="font-bold text-blue-900 flex items-center gap-2 mb-3"><CheckCircle2 className="h-5 w-5 text-blue-500"/> Key Takeaways</h4>
                            <ul className="space-y-3 text-sm text-slate-700 font-medium leading-relaxed">
                              {activeCall.takeaways.map((t, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <span className="mt-1.5 h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                                  {t}
                                </li>
                              ))}
                            </ul>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 border rounded-xl p-3 text-center shadow-sm">
                              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Tỷ lệ Sale nói</div>
                              <div className="text-2xl font-black text-indigo-600">{activeCall.metrics.agentTalkRatio}</div>
                            </div>
                            <div className="bg-slate-50 border rounded-xl p-3 text-center shadow-sm">
                              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">Tốc độ nói</div>
                              <div className="text-2xl font-black text-emerald-600">{activeCall.metrics.speechRate} <span className="text-xs font-bold text-slate-400">từ/phút</span></div>
                            </div>
                         </div>
                       </div>
                     ) : (
                       <div className="h-[320px] overflow-y-auto space-y-4 pr-2 text-sm">
                          {activeCall.transcript.map((msg, i) => (
                            <div key={i} className={`flex flex-col gap-1 ${msg.speaker === 'customer' ? 'items-end' : 'items-start'}`}>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.speaker === 'agent' ? 'text-indigo-500' : 'text-emerald-600'}`}>
                                {msg.speaker === 'agent' ? 'Sale Tuấn Tú' : `Khách ${activeCall.name}`} ({msg.time})
                              </span>
                              <div className={`p-3.5 rounded-2xl max-w-[90%] shadow-sm font-medium leading-relaxed
                                ${msg.speaker === 'agent' 
                                  ? 'bg-slate-100 text-slate-700 rounded-tl-sm' 
                                  : 'bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-tr-sm'}
                              `}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                       </div>
                     )}
                     
                  </CardContent>
                </Card>
             </div>
          </div>
        )}

      </div>
    </div>
  )
}
