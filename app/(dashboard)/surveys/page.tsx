"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ClipboardCheck, Smile, Star, Target, Activity, 
  ThumbsUp, MessageSquare, Send, Link2, Eye, 
  BarChart2, Users, Flame, Meh, Frown, Sparkles
} from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function SurveysPage() {
  const { customers, projects, inventory } = useStore()

  const reviews = [
    { id: 1, name: customers[0]?.name || 'Nguyễn Văn A', rating: 5, source: 'Post-Sale Form', text: 'Bạn Sale Thanh Hà tư vấn rất nhiệt tình, thủ tục nhanh gọn. Tôi rất hài lòng.', date: '19/07/2026', sentiment: 'positive' },
    { id: 2, name: customers[1]?.name || 'Trần Thị B', rating: 4, source: 'Zalo ZNS', text: 'Dự án đẹp, nhưng đường vào sa bàn hơi khó đi.', date: '18/07/2026', sentiment: 'neutral' },
    { id: 3, name: customers[2]?.name || 'Lê Hoàng C', rating: 1, source: 'Google Review', text: 'Gọi Hotline 3 lần không ai bắt máy. Dịch vụ tệ!', date: '15/07/2026', sentiment: 'negative' },
    { id: 4, name: customers[3]?.name || 'Phạm D', rating: 5, source: 'Email Survey', text: 'Chính sách vay ngân hàng rất có lợi cho nhà đầu tư. Sẽ giới thiệu bạn bè.', date: '10/07/2026', sentiment: 'positive' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8 text-amber-500" />
            Khảo Sát & Trải Nghiệm Khách Hàng
          </h1>
          <p className="text-muted-foreground mt-1">Đo lường CSAT, NPS và quản lý phản hồi (Reviews) đa kênh.</p>
        </div>
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
           <PlusIcon className="h-4 w-4 mr-2" /> Tạo Form Mới
        </Button>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CSAT Card */}
        <Card className="border-green-200 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10"><Smile className="w-32 h-32 -mt-4 -mr-4 text-green-600" /></div>
          <CardContent className="p-4 md:p-6 relative z-10">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">CSAT (Sự Hài Lòng)</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-600">85%</span>
              <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">+5%</span>
            </div>
            <p className="text-sm text-slate-600 mt-2">Dựa trên 1,204 phản hồi tháng này.</p>
          </CardContent>
        </Card>

        {/* NPS Card */}
        <Card className="border-blue-200 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10"><Target className="w-32 h-32 -mt-4 -mr-4 text-blue-600" /></div>
          <CardContent className="p-4 md:p-6 relative z-10">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Chỉ Số NPS</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-blue-600">+42</span>
              <span className="text-sm font-medium text-slate-500">Tuyệt vời (Excellent)</span>
            </div>
            <div className="flex gap-1 mt-3 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 w-[55%]"></div> {/* Promoters */}
              <div className="bg-slate-300 w-[32%]"></div> {/* Passives */}
              <div className="bg-red-500 w-[13%]"></div> {/* Detractors */}
            </div>
          </CardContent>
        </Card>

        {/* Reviews Card */}
        <Card className="border-amber-200 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10"><Star className="w-32 h-32 -mt-4 -mr-4 text-amber-500 fill-amber-500" /></div>
          <CardContent className="p-4 md:p-6 relative z-10">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Đánh Giá (Reviews)</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-amber-500">4.6</span>
              <span className="text-xl font-bold text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[1,2,3,4].map(i => <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />)}
              <Star className="h-4 w-4 text-amber-500 fill-amber-500 opacity-50" />
              <span className="text-xs font-bold text-slate-500 ml-2">(342 Lượt)</span>
            </div>
          </CardContent>
        </Card>

      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[500px] mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2"><BarChart2 className="h-4 w-4"/> Tổng Quan</TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2"><Send className="h-4 w-4"/> Chiến Dịch</TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Phản Hồi</TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <Card className="shadow-sm">
                 <CardHeader>
                   <CardTitle className="text-lg">Phân Tích NPS (Khách hàng sẵn sàng giới thiệu)</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-center justify-between mb-8">
                       <div className="text-center">
                         <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                           <Smile className="h-8 w-8 text-green-600" />
                         </div>
                         <div className="font-bold text-xl text-green-600">55%</div>
                         <div className="text-xs font-bold text-muted-foreground uppercase">Promoters (9-10)</div>
                       </div>
                       <div className="text-2xl font-bold text-slate-300">-</div>
                       <div className="text-center opacity-60">
                         <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2">
                           <Meh className="h-8 w-8 text-slate-500" />
                         </div>
                         <div className="font-bold text-xl text-slate-600">32%</div>
                         <div className="text-xs font-bold text-muted-foreground uppercase">Passives (7-8)</div>
                       </div>
                       <div className="text-2xl font-bold text-slate-300">-</div>
                       <div className="text-center">
                         <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-2">
                           <Frown className="h-8 w-8 text-red-600" />
                         </div>
                         <div className="font-bold text-xl text-red-600">13%</div>
                         <div className="text-xs font-bold text-muted-foreground uppercase">Detractors (0-6)</div>
                       </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
                       <div>
                         <div className="font-bold text-blue-900">Điểm NPS Hiện Tại = 42</div>
                         <div className="text-xs text-blue-700 mt-1">NPS = % Promoters - % Detractors (55 - 13 = 42)</div>
                       </div>
                       <Badge className="bg-blue-600 text-white hover:bg-blue-600 px-3 py-1">TỐT</Badge>
                    </div>
                 </CardContent>
              </Card>

              <Card className="shadow-sm bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-0">
                 <CardHeader>
                   <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-amber-400" /> AI Insights</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <p className="text-sm text-indigo-100 leading-relaxed">
                      Dựa trên phân tích 342 phản hồi từ đầu tháng, Trí tuệ nhân tạo (AI) rút ra 3 kết luận quan trọng:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <ThumbsUp className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-indigo-50"><strong>Điểm sáng:</strong> Đội ngũ Sale được đánh giá rất cao về thái độ nhiệt tình (Nhắc đến trong 68% review 5 sao).</span>
                      </li>
                      <li className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <Activity className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-indigo-50"><strong>Cải thiện:</strong> Khách hàng thường phàn nàn về "Đường vào dự án/Sa bàn" (Nhắc đến 12 lần).</span>
                      </li>
                      <li className="flex items-start gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                        <Frown className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-indigo-50"><strong>Cảnh báo (Khủng hoảng nhẹ):</strong> Hotline bộ phận CSKH có tỷ lệ rớt cuộc gọi (Missed Call) cao vào cuối tuần. Cần tăng cường nhân sự.</span>
                      </li>
                    </ul>
                 </CardContent>
              </Card>

           </div>
        </TabsContent>

        {/* 2. CAMPAIGNS TAB */}
        <TabsContent value="campaigns" className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Khảo sát Nóng (Sau khi xem Sa bàn)', trigger: 'Tự động gửi Zalo sau khi Check-in 1 tiếng', responses: 245, conversion: '32%' },
                { name: 'Đánh giá Sale (Sau khi Ký Cọc)', trigger: 'Gửi Email kèm HĐMB', responses: 89, conversion: '68%' },
                { name: 'Khảo sát Bàn giao nhà', trigger: 'Gửi Zalo khi trạng thái = Handover', responses: 12, conversion: '15%' },
              ].map((c, i) => (
                <Card key={i} className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-indigo-700">{c.name}</h3>
                      <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">Đang chạy (Active)</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-4"><Flame className="h-3.5 w-3.5 text-orange-500" /> {c.trigger}</p>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dashed">
                       <div>
                         <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Số phản hồi</div>
                         <div className="text-xl font-bold">{c.responses}</div>
                       </div>
                       <div>
                         <div className="text-xs text-muted-foreground uppercase font-bold mb-1">Tỷ lệ điền form</div>
                         <div className="text-xl font-bold">{c.conversion}</div>
                       </div>
                    </div>
                    
                    <div className="flex gap-2 mt-5">
                      <Button variant="outline" className="flex-1"><Link2 className="h-4 w-4 mr-2" /> Copy Link Form</Button>
                      <Button variant="secondary" className="flex-1"><Eye className="h-4 w-4 mr-2" /> Xem kết quả</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>

        {/* 3. REVIEWS TAB */}
        <TabsContent value="reviews" className="space-y-4">
           <Card className="shadow-sm">
             <CardHeader className="pb-4 border-b">
               <CardTitle className="text-lg">Feed Phản Hồi Từ Khách Hàng</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               <div className="flex flex-col">
                 {reviews.map(r => (
                   <div key={r.id} className="flex gap-4 p-5 border-b hover:bg-slate-50 transition-colors">
                      <Avatar className="h-12 w-12 mt-1">
                        <AvatarFallback className="bg-slate-200 text-slate-700 font-bold">{r.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-1">
                            <div className="font-bold text-sm">{r.name}</div>
                            <span className="text-xs text-muted-foreground">{r.date}</span>
                         </div>
                         <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1,2,3,4,5].map(star => (
                                <Star key={star} className={`h-3.5 w-3.5 ${star <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-300 fill-slate-200'}`} />
                              ))}
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase">{r.source}</Badge>
                         </div>
                         <div className={`p-3 rounded-lg text-sm border ${r.sentiment === 'negative' ? 'bg-red-50 border-red-100 text-red-900' : (r.sentiment === 'positive' ? 'bg-green-50 border-green-100 text-green-900' : 'bg-slate-50 border-slate-200 text-slate-800')}`}>
                           "{r.text}"
                         </div>
                         {r.sentiment === 'negative' && (
                           <div className="mt-2">
                             <Button size="sm" variant="destructive" className="h-7 text-xs">Xử lý khiếu nại ngay</Button>
                           </div>
                         )}
                      </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
