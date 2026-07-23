"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ClipboardCheck, Smile, Star, Target, Activity, 
  ThumbsUp, MessageSquare, Send, Link2, Eye, 
  BarChart2, Flame, Meh, Frown, Sparkles, Plus,
  MessageCircleQuestion
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Review } from '@/types'

export default function SurveysPage() {
  const { customers, reviews, surveyCampaigns, addReview } = useStore()

  // State for Review Simulator
  const [showSimModal, setShowSimModal] = useState(false)
  const [simName, setSimName] = useState("Khách Mới")
  const [simRating, setSimRating] = useState(5)
  const [simText, setSimText] = useState("")

  // Calculations
  const totalReviews = reviews.length || 1
  
  // CSAT = % of 4 and 5 star reviews
  const satisfiedReviews = reviews.filter(r => r.rating >= 4).length
  const csat = Math.round((satisfiedReviews / totalReviews) * 100)

  // NPS (1-5 scale mapped to 0-10): 5 = Promoter, 4 = Passive, 1-3 = Detractor
  const promoters = reviews.filter(r => r.rating === 5).length
  const passives = reviews.filter(r => r.rating === 4).length
  const detractors = reviews.filter(r => r.rating <= 3).length
  
  const pctPromoters = Math.round((promoters / totalReviews) * 100)
  const pctPassives = Math.round((passives / totalReviews) * 100)
  const pctDetractors = Math.round((detractors / totalReviews) * 100)
  const nps = pctPromoters - pctDetractors

  // Avg Rating
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)

  const handleSimulateSubmit = () => {
    if(!simText) return
    addReview({
      customerId: 'guest',
      customerName: simName || 'Ẩn Danh',
      rating: simRating,
      source: 'Mô Phỏng Trực Tiếp',
      text: simText
    })
    setShowSimModal(false)
    setSimText("")
    setSimRating(5)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8 text-amber-500" />
            Khảo Sát & Trải Nghiệm Khách Hàng
          </h1>
          <p className="text-slate-500 mt-1">Đo lường CSAT, NPS và quản lý phản hồi (Reviews) bằng Dữ Liệu Thực (Live Metrics).</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-300 text-slate-700 font-bold" onClick={() => setShowSimModal(true)}>
             <MessageCircleQuestion className="h-4 w-4 mr-2 text-indigo-600" /> Giả Lập Đánh Giá
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white font-bold h-10 px-6">
             <Plus className="h-4 w-4 mr-2" /> Tạo Form Mới
          </Button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CSAT Card */}
        <Card className={`shadow-sm relative overflow-hidden transition-all ${csat >= 80 ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
          <div className="absolute right-0 top-0 opacity-10"><Smile className={`w-32 h-32 -mt-4 -mr-4 ${csat >= 80 ? 'text-green-600' : 'text-amber-600'}`} /></div>
          <CardContent className="p-4 md:p-6 relative z-10">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">CSAT (Sự Hài Lòng)</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-black ${csat >= 80 ? 'text-green-600' : 'text-amber-600'}`}>{csat}%</span>
              {csat >= 80 ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Tốt</Badge> : <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Cảnh Báo</Badge>}
            </div>
            <p className="text-sm text-slate-600 mt-2 font-medium">Được tính từ {totalReviews} phản hồi gần nhất.</p>
          </CardContent>
        </Card>

        {/* NPS Card */}
        <Card className={`shadow-sm relative overflow-hidden transition-all ${nps >= 30 ? 'border-blue-200 bg-blue-50/30' : 'border-red-200 bg-red-50/30'}`}>
          <div className="absolute right-0 top-0 opacity-10"><Target className={`w-32 h-32 -mt-4 -mr-4 ${nps >= 30 ? 'text-blue-600' : 'text-red-600'}`} /></div>
          <CardContent className="p-4 md:p-6 relative z-10">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Chỉ Số NPS Tự Động</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-black ${nps >= 30 ? 'text-blue-600' : 'text-red-600'}`}>{nps > 0 ? `+${nps}` : nps}</span>
            </div>
            <div className="flex gap-1 mt-4 h-3 rounded-full overflow-hidden shadow-inner bg-slate-200">
              <div className="bg-green-500 transition-all duration-500" style={{ width: `${pctPromoters}%` }} title={`Promoters: ${pctPromoters}%`}></div>
              <div className="bg-slate-400 transition-all duration-500" style={{ width: `${pctPassives}%` }} title={`Passives: ${pctPassives}%`}></div>
              <div className="bg-red-500 transition-all duration-500" style={{ width: `${pctDetractors}%` }} title={`Detractors: ${pctDetractors}%`}></div>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Card */}
        <Card className="border-amber-200 shadow-sm relative overflow-hidden bg-amber-50/30">
          <div className="absolute right-0 top-0 opacity-10"><Star className="w-32 h-32 -mt-4 -mr-4 text-amber-500 fill-amber-500" /></div>
          <CardContent className="p-4 md:p-6 relative z-10">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Trung bình Sao (Stars)</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black text-amber-500">{avgRating}</span>
              <span className="text-xl font-bold text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {[1,2,3,4,5].map(i => <Star key={i} className={`h-5 w-5 ${i <= parseFloat(avgRating) ? 'text-amber-500 fill-amber-500' : 'text-amber-200 fill-amber-100'}`} />)}
              <span className="text-xs font-bold text-slate-500 ml-2">({totalReviews} Đánh giá)</span>
            </div>
          </CardContent>
        </Card>

      </div>

      <Tabs defaultValue="overview" className="w-full mt-2">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px] mb-6 h-auto md:h-12 bg-slate-100">
          <TabsTrigger value="overview" className="py-2.5 font-semibold data-[state=active]:bg-white flex items-center gap-2"><BarChart2 className="h-4 w-4"/> Tổng Quan Chỉ Số</TabsTrigger>
          <TabsTrigger value="reviews" className="py-2.5 font-semibold data-[state=active]:bg-white flex items-center gap-2 relative">
             <MessageSquare className="h-4 w-4"/> Feed Phản Hồi 
             <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="py-2.5 font-semibold data-[state=active]:bg-white flex items-center gap-2"><Send className="h-4 w-4"/> Chiến Dịch Khảo Sát</TabsTrigger>
        </TabsList>

        {/* 1. OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <Card className="shadow-sm border-0 ring-1 ring-slate-200">
                 <CardHeader className="bg-slate-50/50 border-b rounded-t-xl">
                   <CardTitle className="text-lg">Phân Tích NPS (Khách hàng trung thành)</CardTitle>
                 </CardHeader>
                 <CardContent className="pt-8">
                    <div className="flex items-center justify-between mb-8">
                       <div className="text-center group">
                         <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3 border border-green-100 group-hover:scale-110 transition-transform">
                           <Smile className="h-10 w-10 text-green-600" />
                         </div>
                         <div className="font-black text-2xl text-green-600">{pctPromoters}%</div>
                         <div className="text-xs font-bold text-slate-500 uppercase mt-1">Ủng hộ (5 Sao)</div>
                       </div>
                       <div className="text-3xl font-black text-slate-200">-</div>
                       <div className="text-center group opacity-80 hover:opacity-100 transition-opacity">
                         <div className="h-20 w-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 border border-slate-200 group-hover:scale-110 transition-transform">
                           <Meh className="h-10 w-10 text-slate-500" />
                         </div>
                         <div className="font-black text-2xl text-slate-600">{pctPassives}%</div>
                         <div className="text-xs font-bold text-slate-500 uppercase mt-1">Trung lập (4 Sao)</div>
                       </div>
                       <div className="text-3xl font-black text-slate-200">-</div>
                       <div className="text-center group">
                         <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3 border border-red-100 group-hover:scale-110 transition-transform">
                           <Frown className="h-10 w-10 text-red-600" />
                         </div>
                         <div className="font-black text-2xl text-red-600">{pctDetractors}%</div>
                         <div className="text-xs font-bold text-slate-500 uppercase mt-1">Chê bai (1-3 Sao)</div>
                       </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                       <div>
                         <div className="font-black text-blue-900 text-lg">Điểm NPS Hiện Tại = {nps}</div>
                         <div className="text-sm text-blue-700 mt-1 font-medium">Công thức: % Ủng Hộ - % Chê Bai ({pctPromoters}% - {pctDetractors}%)</div>
                       </div>
                       <Badge className="bg-blue-600 text-white hover:bg-blue-600 px-4 py-1.5 text-sm">{nps >= 30 ? 'TỐT' : 'CẦN CẢI THIỆN'}</Badge>
                    </div>
                 </CardContent>
              </Card>

              <Card className="shadow-lg bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-0">
                 <CardHeader className="border-b border-white/10">
                   <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-6 w-6 text-amber-400" /> AI Insights & Cảnh báo</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-5 pt-6">
                    <p className="text-sm text-indigo-100 leading-relaxed font-medium">
                      Dựa trên phân tích tự động ngôn ngữ (NLP) của {totalReviews} phản hồi hiện có, AI rút ra các kết luận sau:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/5">
                        <ThumbsUp className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-indigo-50"><strong>Điểm sáng:</strong> Đội ngũ Sale được đánh giá rất cao về thái độ nhiệt tình (Từ khóa "nhiệt tình" xuất hiện thường xuyên).</span>
                      </li>
                      <li className="flex items-start gap-3 bg-white/10 p-3.5 rounded-xl backdrop-blur-sm border border-white/5">
                        <Activity className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-indigo-50"><strong>Cải thiện:</strong> Khách hàng thường phàn nàn về hạ tầng tiếp cận dự án như "Đường vào sa bàn khó đi".</span>
                      </li>
                      <li className={`flex items-start gap-3 p-3.5 rounded-xl backdrop-blur-sm border ${pctDetractors > 20 ? 'bg-red-500/20 border-red-500/30' : 'bg-white/10 border-white/5'}`}>
                        <Frown className={`h-5 w-5 shrink-0 mt-0.5 ${pctDetractors > 20 ? 'text-red-400' : 'text-slate-300'}`} />
                        <span className="text-sm text-indigo-50">
                          <strong>Cảnh báo Dịch vụ:</strong> Tỷ lệ khách hàng không hài lòng hiện đang là {pctDetractors}%. 
                          {pctDetractors > 20 ? ' Đây là mức đáng báo động, cần rà soát lại khâu chăm sóc Hotline!' : ' Mức độ khiếu nại đang nằm trong ngưỡng an toàn.'}
                        </span>
                      </li>
                    </ul>
                 </CardContent>
              </Card>

           </div>
        </TabsContent>
        
        {/* 2. REVIEWS TAB */}
        <TabsContent value="reviews" className="space-y-4">
           <Card className="shadow-sm border-0 ring-1 ring-slate-200">
             <CardHeader className="pb-4 border-b bg-slate-50/50 rounded-t-xl flex flex-row items-center justify-between">
               <div>
                 <CardTitle className="text-lg">Dòng thời gian Phản Hồi (Live Feed)</CardTitle>
                 <CardDescription>Tất cả phản hồi từ đa kênh (Form, Zalo, Google) được AI tự động phân loại cảm xúc.</CardDescription>
               </div>
               <Button onClick={() => setShowSimModal(true)} variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-bold">Giả Lập Review Mới</Button>
             </CardHeader>
             <CardContent className="p-0">
               <div className="flex flex-col divide-y divide-slate-100">
                 {reviews.map(r => (
                   <div key={r.id} className="flex gap-4 p-5 md:p-6 hover:bg-slate-50 transition-colors">
                      <Avatar className="h-12 w-12 mt-1 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold">
                          {r.customerName.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                         <div className="flex justify-between items-start mb-1.5">
                            <div className="font-bold text-base text-slate-800">{r.customerName}</div>
                            <span className="text-xs text-muted-foreground font-medium bg-slate-100 px-2 py-1 rounded-full">{r.date}</span>
                         </div>
                         <div className="flex items-center gap-3 mb-3">
                            <div className="flex">
                              {[1,2,3,4,5].map(star => (
                                <Star key={star} className={`h-4 w-4 ${star <= r.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-100'}`} />
                              ))}
                            </div>
                            <Badge variant="outline" className="text-[10px] uppercase bg-white">{r.source}</Badge>
                         </div>
                         <div className={`p-4 rounded-xl text-sm border font-medium ${
                            r.sentiment === 'negative' ? 'bg-red-50 border-red-200 text-red-900 shadow-sm' : 
                            (r.sentiment === 'positive' ? 'bg-green-50/50 border-green-200 text-green-900' : 'bg-slate-50 border-slate-200 text-slate-800')
                         }`}>
                           "{r.text}"
                         </div>
                         {r.sentiment === 'negative' && (
                           <div className="mt-3 flex items-center gap-3">
                             <Button size="sm" variant="destructive" className="h-8 text-xs font-bold">Xử lý khiếu nại ngay</Button>
                             <span className="text-xs font-bold text-red-600 animate-pulse flex items-center"><Target className="h-3 w-3 mr-1"/> Cảnh báo đỏ từ AI Sentiment</span>
                           </div>
                         )}
                      </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* 3. CAMPAIGNS TAB */}
        <TabsContent value="campaigns" className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surveyCampaigns.map((c, i) => (
                <Card key={c.id} className="shadow-sm border-0 ring-1 ring-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-5 md:p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-slate-800 leading-tight">{c.name}</h3>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 mb-3 w-fit">Đang chạy Tự Động (Active)</Badge>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-5 font-medium bg-slate-50 p-2 rounded-md">
                       <Flame className="h-4 w-4 text-orange-500 shrink-0" /> {c.trigger}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-dashed border-slate-200 mt-2">
                       <div>
                         <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Số phản hồi nhận được</div>
                         <div className="text-2xl font-black text-indigo-600">{c.responses}</div>
                       </div>
                       <div className="border-l border-slate-100 pl-4">
                         <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Tỷ lệ điền form</div>
                         <div className="text-2xl font-black text-slate-800">{c.conversion}</div>
                       </div>
                    </div>
                    
                    <div className="flex gap-3 mt-5">
                      <Button variant="outline" className="flex-1 text-slate-600 border-slate-300 font-bold"><Link2 className="h-4 w-4 mr-2" /> Copy Link</Button>
                      <Button variant="secondary" className="flex-1 bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"><Eye className="h-4 w-4 mr-2" /> Báo cáo</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>

      </Tabs>

      {/* Simulator Modal */}
      <Dialog open={showSimModal} onOpenChange={setShowSimModal}>
         <DialogContent className="max-w-md bg-white">
            <DialogHeader className="border-b pb-4">
               <DialogTitle className="text-xl text-indigo-900 flex items-center gap-2"><MessageCircleQuestion className="h-5 w-5"/> Giả Lập Form Đánh Giá</DialogTitle>
               <DialogDescription>Mô phỏng 1 khách hàng điền Form. Đánh giá này sẽ lập tức làm thay đổi điểm CSAT và NPS của toàn bộ hệ thống ở bên ngoài.</DialogDescription>
            </DialogHeader>
            <div className="space-y-5 pt-4">
               <div className="space-y-2">
                 <Label className="font-bold text-slate-700">Tên khách giả định</Label>
                 <Input value={simName} onChange={e => setSimName(e.target.value)} />
               </div>
               <div className="space-y-2">
                 <Label className="font-bold text-slate-700">Chấm Sao (1-5)</Label>
                 <div className="flex gap-2">
                   {[1,2,3,4,5].map(star => (
                     <Star 
                       key={star} 
                       className={`h-8 w-8 cursor-pointer transition-colors ${star <= simRating ? 'text-amber-500 fill-amber-500 hover:text-amber-400' : 'text-slate-200 fill-slate-100 hover:text-amber-200'}`}
                       onClick={() => setSimRating(star)}
                     />
                   ))}
                 </div>
               </div>
               <div className="space-y-2">
                 <Label className="font-bold text-slate-700">Nội dung đánh giá</Label>
                 <Textarea 
                   value={simText} 
                   onChange={e => setSimText(e.target.value)} 
                   placeholder="Nhập nội dung khách chê hoặc khen..."
                   rows={4}
                 />
               </div>
               <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 text-lg" onClick={handleSimulateSubmit}>
                 Gửi Đánh Giá Mô Phỏng
               </Button>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  )
}
