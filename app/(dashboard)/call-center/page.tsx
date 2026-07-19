"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  PhoneCall, Mic, MicOff, PhoneOff, User, Clock, PhoneForwarded, 
  Play, Pause, BrainCircuit, Smile, Meh, Frown, Sparkles, 
  PhoneMissed, CheckCircle2, ChevronRight, X
} from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function CallCenterPage() {
  const { customers, projects, inventory } = useStore()

  const recentCalls = [
    { id: 1, name: customers[0]?.name || 'Nguyễn Văn A', phone: customers[0]?.phone || '0909 123 456', time: '14:30 Hôm nay', duration: '12:45', status: 'success', sentiment: 'positive' },
    { id: 2, name: customers[1]?.name || 'Trần Thị B', phone: customers[1]?.phone || '0988 765 432', time: '09:15 Hôm nay', duration: '05:20', status: 'success', sentiment: 'neutral' },
    { id: 3, name: customers[2]?.name || 'Lê Hoàng C', phone: customers[2]?.phone || '0933 444 555', time: '16:00 Hôm qua', duration: '00:00', status: 'missed', sentiment: 'none' },
    { id: 4, name: '0912 345 678', phone: '0912 345 678', time: '10:45 Hôm qua', duration: '08:10', status: 'success', sentiment: 'negative' },
  ]

  const [phoneNumber, setPhoneNumber] = useState(customers[0]?.phone || '0909 123 456')
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeTab, setActiveTab] = useState<'summary'|'transcript'>('summary')

  const handleKeypad = (num: string) => {
    setPhoneNumber(prev => prev + num)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PhoneCall className="h-8 w-8 text-green-500" />
            Tổng Đài AI & Telesale
          </h1>
          <p className="text-muted-foreground mt-1">Softphone gọi trực tiếp, phân tích cảm xúc (Sentiment) và Bóc băng tự động.</p>
        </div>
        <div className="flex items-center gap-3 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 font-medium text-sm shadow-sm">
           <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
           Trạng thái: Đang Trực (Available)
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI: SOFTPHONE & LỊCH SỬ (4/12) */}
        <div className="xl:col-span-4 space-y-6">
           
           {/* Softphone Keypad */}
           <Card className="shadow-lg border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
             <CardContent className="p-4 md:p-6">
                
                {/* Display */}
                <div className="bg-slate-100 dark:bg-black/50 h-20 rounded-xl mb-6 flex flex-col items-center justify-center border shadow-inner relative group">
                  <div className="text-3xl font-bold tracking-wider text-slate-800 dark:text-slate-100">{phoneNumber || 'Hiển thị số...'}</div>
                  <div className="text-xs text-muted-foreground mt-1">{customers[0]?.name || 'Nguyễn Văn A'} - Khách Hàng VIP</div>
                  {phoneNumber && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 text-slate-400 hover:text-slate-700 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setPhoneNumber(phoneNumber.slice(0, -1))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Keypad Grid */}
                <div className="grid grid-cols-3 gap-4 mb-8 px-4">
                  {[
                    { num: '1', char: '' }, { num: '2', char: 'ABC' }, { num: '3', char: 'DEF' },
                    { num: '4', char: 'GHI' }, { num: '5', char: 'JKL' }, { num: '6', char: 'MNO' },
                    { num: '7', char: 'PQRS' }, { num: '8', char: 'TUV' }, { num: '9', char: 'WXYZ' },
                    { num: '*', char: '' }, { num: '0', char: '+' }, { num: '#', char: '' }
                  ].map((key, i) => (
                    <button 
                      key={i} 
                      onClick={() => handleKeypad(key.num)}
                      className="h-16 rounded-full flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700 active:scale-95"
                    >
                      <span className="text-2xl font-semibold text-slate-700 dark:text-slate-200">{key.num}</span>
                      <span className="text-[9px] font-bold text-slate-400 h-3 uppercase">{key.char}</span>
                    </button>
                  ))}
                </div>

                {/* Call Actions */}
                <div className="flex justify-center items-center gap-6">
                  <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-slate-300 text-slate-500 hover:bg-slate-100 shadow-sm hover:text-slate-700">
                    <MicOff className="h-5 w-5" />
                  </Button>
                  <Button size="icon" className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-xl hover:scale-105 transition-transform">
                    <PhoneCall className="h-6 w-6" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-slate-300 text-slate-500 hover:bg-slate-100 shadow-sm hover:text-slate-700">
                    <PhoneForwarded className="h-5 w-5" />
                  </Button>
                </div>

             </CardContent>
           </Card>

           {/* Call History */}
           <Card className="shadow-md">
             <CardHeader className="pb-3 border-b">
               <CardTitle className="text-base flex items-center justify-between">
                 Lịch Sử Cuộc Gọi (Hôm nay)
                 <Badge variant="secondary">{recentCalls.length} Cuộc</Badge>
               </CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               <div className="flex flex-col">
                 {recentCalls.map(call => (
                   <div key={call.id} className="flex items-center justify-between p-4 border-b hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3">
                         <div className={`h-10 w-10 rounded-full flex items-center justify-center ${call.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {call.status === 'success' ? <PhoneCall className="h-4 w-4" /> : <PhoneMissed className="h-4 w-4" />}
                         </div>
                         <div>
                            <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{call.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> {call.time}</div>
                         </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                         <span className="text-xs font-mono font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{call.duration}</span>
                         {call.sentiment === 'positive' && <Smile className="h-3.5 w-3.5 text-green-500" />}
                         {call.sentiment === 'neutral' && <Meh className="h-3.5 w-3.5 text-orange-500" />}
                         {call.sentiment === 'negative' && <Frown className="h-3.5 w-3.5 text-red-500" />}
                      </div>
                   </div>
                 ))}
                 <Button variant="ghost" className="rounded-none text-blue-600 text-xs">Xem tất cả lịch sử <ChevronRight className="h-3 w-3 ml-1"/></Button>
               </div>
             </CardContent>
           </Card>

        </div>

        {/* CỘT PHẢI: AI ANALYSIS & RECORDING (8/12) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
           
           {/* Trình Phát Ghi Âm (Audio Player) */}
           <Card className="shadow-md bg-gradient-to-r from-slate-900 to-indigo-950 text-white border-0 overflow-hidden relative">
             {/* Decorative background element */}
             <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
               <BrainCircuit className="w-64 h-64 -mt-16 -mr-16" />
             </div>
             
             <CardContent className="p-4 md:p-6">
               <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                 <div>
                   <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 mb-2">Cuộc gọi ra (Outbound)</Badge>
                   <h2 className="text-2xl font-bold">Khách Hàng: {customers[0]?.name || 'Nguyễn Văn A'}</h2>
                   <p className="text-indigo-200 text-sm mt-1 flex items-center gap-2">
                     <User className="h-4 w-4" /> Phụ trách: Sale Tuấn Tú | 14:30, 19/07/2026
                   </p>
                 </div>
                 <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/10 text-center">
                   <div className="text-3xl font-mono font-bold text-green-400">12:45</div>
                   <div className="text-[10px] uppercase tracking-widest text-indigo-200 mt-1">Tổng Thời Lượng</div>
                 </div>
               </div>

               {/* Audio Player UI */}
               <div className="bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/10">
                  <div className="flex items-center gap-4">
                     <Button 
                       onClick={() => setIsPlaying(!isPlaying)}
                       size="icon" 
                       className="h-12 w-12 rounded-full bg-white text-indigo-900 hover:bg-slate-200 hover:scale-105 transition-all shadow-lg"
                     >
                       {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                     </Button>
                     <div className="flex-1 space-y-2">
                        <div className="flex justify-between text-xs font-mono text-indigo-200">
                           <span>04:15</span>
                           <span>12:45</span>
                        </div>
                        {/* Fake Waveform / Progress bar */}
                        <div className="h-2 bg-white/20 rounded-full overflow-hidden flex items-center relative cursor-pointer">
                           <div className="absolute h-full bg-gradient-to-r from-blue-400 to-green-400 w-1/3 rounded-full"></div>
                           <div className="absolute h-4 w-4 bg-white rounded-full shadow-md left-1/3 -ml-2 top-1/2 -mt-2"></div>
                        </div>
                     </div>
                  </div>
               </div>
             </CardContent>
           </Card>

           {/* KẾT QUẢ PHÂN TÍCH AI (AI Sentiment & Summary) */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* AI Sentiment (Phân Tích Cảm Xúc) */}
              <Card className="shadow-md">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-base flex items-center gap-2 text-indigo-600">
                    <Sparkles className="h-5 w-5" /> AI Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                   <div className="flex justify-center">
                      {/* Biểu đồ chấm điểm cảm xúc */}
                      <div className="relative w-40 h-40 flex items-center justify-center">
                         <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                           {/* Background Circle */}
                           <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                           {/* Negative */}
                           <path className="text-red-500" strokeWidth="4" strokeDasharray="100, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                           {/* Neutral */}
                           <path className="text-orange-400" strokeWidth="4" strokeDasharray="95, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                           {/* Positive */}
                           <path className="text-green-500 shadow-xl" strokeWidth="4" strokeDasharray="75, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                         </svg>
                         <div className="absolute flex flex-col items-center">
                           <span className="text-3xl font-bold text-green-600">75%</span>
                           <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tích cực</span>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-3">
                     <div>
                       <div className="flex justify-between text-sm mb-1">
                         <span className="flex items-center gap-1 font-medium text-slate-700"><Smile className="h-4 w-4 text-green-500"/> Tích cực (Hài lòng, Khen ngợi)</span>
                         <span className="font-bold text-green-600">75%</span>
                       </div>
                       <Progress value={75} className="h-2 bg-slate-100" />
                     </div>
                     <div>
                       <div className="flex justify-between text-sm mb-1">
                         <span className="flex items-center gap-1 font-medium text-slate-700"><Meh className="h-4 w-4 text-orange-400"/> Trung tính (Hỏi thông tin)</span>
                         <span className="font-bold text-orange-500">20%</span>
                       </div>
                       <Progress value={20} className="h-2 bg-slate-100" />
                     </div>
                     <div>
                       <div className="flex justify-between text-sm mb-1">
                         <span className="flex items-center gap-1 font-medium text-slate-700"><Frown className="h-4 w-4 text-red-500"/> Tiêu cực (Chê giá, Than phiền)</span>
                         <span className="font-bold text-red-600">5%</span>
                       </div>
                       <Progress value={5} className="h-2 bg-slate-100" />
                     </div>
                   </div>
                </CardContent>
              </Card>

              {/* AI Summary & Transcript */}
              <Card className="shadow-md flex flex-col">
                <CardHeader className="pb-0 border-b bg-slate-50">
                  <div className="flex gap-6">
                    <button 
                      className={`pb-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'summary' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      onClick={() => setActiveTab('summary')}
                    >
                      AI Tóm Tắt Giao Dịch
                    </button>
                    <button 
                      className={`pb-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'transcript' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                      onClick={() => setActiveTab('transcript')}
                    >
                      Bóc Băng (Transcript)
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex-1 bg-slate-50/50">
                   
                   {activeTab === 'summary' ? (
                     <div className="space-y-4">
                       <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                          <h4 className="font-bold text-blue-800 flex items-center gap-2 mb-3"><CheckCircle2 className="h-5 w-5"/> Key Takeaways</h4>
                          <ul className="space-y-3 text-sm text-blue-900 leading-relaxed">
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                              Khách hàng rất ưng ý với layout Căn Góc 3 Phòng ngủ view sông.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                              Khách chê mức giá 12.5 Tỷ hơi cao so với tài chính hiện tại (Giai đoạn cảm xúc đi xuống).
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                              Sale Tuấn Tú đã xử lý từ chối tốt bằng cách đưa ra gói Vay ân hạn nợ gốc 24 tháng.
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                              <strong>Next action:</strong> Đã chốt hẹn T7 tuần này Khách đưa vợ qua xem sa bàn để ký cọc.
                            </li>
                          </ul>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="bg-white border rounded-lg p-3 text-center shadow-sm">
                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Tỷ lệ Sale nói</div>
                            <div className="text-xl font-bold text-slate-700">45%</div>
                          </div>
                          <div className="bg-white border rounded-lg p-3 text-center shadow-sm">
                            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Tốc độ nói</div>
                            <div className="text-xl font-bold text-slate-700">120 <span className="text-xs font-normal">từ/phút</span></div>
                          </div>
                       </div>
                     </div>
                   ) : (
                     <div className="h-[320px] overflow-y-auto space-y-4 pr-2 text-sm">
                        
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-indigo-600">Sale Tuấn Tú (04:15)</span>
                          <div className="bg-white p-3 rounded-lg border shadow-sm">Dạ anh A ơi, với tài chính anh báo thì phương án thanh toán giãn 24 tháng không lãi suất bên em là hoàn hảo nhất luôn. Lãi suất 0% cho tới lúc nhận nhà. Anh thấy sao ạ?</div>
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                          <span className="text-xs font-bold text-green-600">Khách {customers[0]?.name || 'Nguyễn Văn A'} (04:32)</span>
                          <div className="bg-green-50 p-3 rounded-lg border border-green-100 shadow-sm">Ủa khoan, tức là 2 năm tới anh không phải đóng đồng nào cho ngân hàng đúng không em? Giá 12.5 Tỷ là cố định rồi hả?</div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-bold text-indigo-600">Sale Tuấn Tú (04:45)</span>
                          <div className="bg-white p-3 rounded-lg border shadow-sm">Dạ chính xác 100% anh ơi. Chỉ duy nhất đợt này CĐT mới ra chính sách ân hạn gốc lãi. Thứ 7 này anh chở chị nhà qua sa bàn tham quan thực tế rồi em hỗ trợ làm hồ sơ giữ chỗ luôn nhen anh. Rổ hàng căn góc này đẹp lắm, bay nhanh lắm anh.</div>
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                          <span className="text-xs font-bold text-green-600">Khách {customers[0]?.name || 'Nguyễn Văn A'} (05:10)</span>
                          <div className="bg-green-50 p-3 rounded-lg border border-green-100 shadow-sm">Ừ nghe cũng được đó. Thứ 7 tầm 9h sáng nha em, anh qua coi thử sao.</div>
                        </div>

                     </div>
                   )}
                   
                </CardContent>
              </Card>

           </div>
        </div>

      </div>
    </div>
  )
}
