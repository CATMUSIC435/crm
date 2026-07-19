"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, Gem, Award, Gift, Clock, Star, 
  ArrowRight, ShieldCheck, Ticket, Plane, 
  Sofa, Coffee, CheckCircle2, QrCode
} from 'lucide-react'
import { useStore } from '@/store/useStore'

// Mock Data
const VOUCHERS = [
  { id: 1, title: 'Nghỉ dưỡng 2 Đêm tại Biệt thự Biển Novaworld', points: 50000, icon: <Plane className="h-8 w-8 text-blue-500"/>, color: 'bg-blue-50 border-blue-200' },
  { id: 2, title: 'Gói Nội Thất Cao Cấp (Trị giá 500 Triệu)', points: 150000, icon: <Sofa className="h-8 w-8 text-amber-500"/>, color: 'bg-amber-50 border-amber-200' },
  { id: 3, title: 'Đặc Quyền Phòng Chờ Thương Gia (Sân Bay)', points: 10000, icon: <Coffee className="h-8 w-8 text-purple-500"/>, color: 'bg-purple-50 border-purple-200' },
  { id: 4, title: 'Chiết khấu 2% Căn Hộ Dự Án Aqua City', points: 300000, icon: <ShieldCheck className="h-8 w-8 text-emerald-500"/>, color: 'bg-emerald-50 border-emerald-200' },
]

export default function LoyaltyPage() {
  const { customers, projects, inventory } = useStore()
  const customerName = customers[0]?.name || 'Nguyễn Văn A'

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Crown className="h-8 w-8 text-amber-400 fill-amber-400" />
            Đặc Quyền Hội Viên (Loyalty)
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý hạng thành viên, tích lũy NovaPoints và đổi ngàn quà tặng thượng lưu.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* CỘT TRÁI: THẺ THÀNH VIÊN V.I.P (5/12) */}
        <div className="xl:col-span-5 space-y-6">
           
           {/* Digital Membership Card (Diamond Tier) */}
           <div className="relative group perspective-1000">
              <div className="w-full aspect-[1.6/1] rounded-2xl p-6 md:p-8 text-white shadow-2xl overflow-hidden relative transition-transform duration-500 hover:scale-[1.02] 
                              bg-gradient-to-tr from-slate-900 via-slate-800 to-black border border-slate-700/50">
                 
                 {/* Shiny Background Effects */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-3xl -mr-10 -mt-10"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl -ml-10 -mb-10"></div>
                 
                 {/* Card Content */}
                 <div className="relative z-10 flex flex-col justify-between h-full">
                    
                    {/* Top Row: Logo & Tier */}
                    <div className="flex justify-between items-start">
                       <div>
                         <div className="text-xl font-bold tracking-widest text-slate-300">NOVA<span className="text-amber-400">LOYALTY</span></div>
                         <div className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-1">Exclusive Member</div>
                       </div>
                       <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-md">
                         <Gem className="h-4 w-4 text-cyan-400" />
                         <span className="text-xs font-bold uppercase tracking-wider text-cyan-50">Diamond</span>
                       </div>
                    </div>

                    {/* Middle Row: Points */}
                    <div className="mt-auto mb-4">
                       <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Điểm Tích Lũy Khả Dụng</div>
                       <div className="flex items-end gap-2">
                          <span className="text-5xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300">
                             245,000
                          </span>
                          <span className="text-lg text-amber-200/80 font-medium mb-1.5">PTS</span>
                       </div>
                    </div>

                    {/* Bottom Row: Name & ID */}
                    <div className="flex justify-between items-end">
                       <div>
                         <div className="text-sm font-bold tracking-widest text-slate-200 uppercase">{customerName}</div>
                         <div className="text-xs font-mono text-slate-500 mt-0.5">ID: 8899 2233 4455 6677</div>
                       </div>
                       <QrCode className="h-8 w-8 text-slate-400 opacity-50" />
                    </div>

                 </div>
              </div>
           </div>

           {/* Tier Progression */}
           <Card className="shadow-sm border-slate-200">
             <CardContent className="p-4 md:p-6">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Tiến Độ Thăng Hạng</h3>
                    <p className="text-xs text-muted-foreground mt-1">Hạng tiếp theo: <strong className="text-purple-600">SIGNATURE (Thượng Đỉnh)</strong></p>
                  </div>
                  <div className="text-sm font-bold text-slate-700">245k / 500k PTS</div>
                </div>
                
                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-3 relative">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full w-[49%]"></div>
                </div>
                
                <p className="text-xs font-medium text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                  <Star className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  Chỉ cần tích lũy thêm 255,000 Điểm (Tương đương 1 giao dịch Biệt thự) để mở khóa thẻ SIGNATURE với Đặc quyền Đưa đón bằng Trực thăng!
                </p>
             </CardContent>
           </Card>

           {/* Quick Actions */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 font-bold border-slate-300 hover:bg-slate-50"><QrCode className="h-5 w-5 mr-2 text-slate-600"/> Mã Tích Điểm</Button>
              <Button variant="outline" className="h-14 font-bold border-slate-300 hover:bg-slate-50"><Gift className="h-5 w-5 mr-2 text-slate-600"/> Tặng Điểm</Button>
           </div>

        </div>

        {/* CỘT PHẢI: CỬA HÀNG ĐẶC QUYỀN (7/12) */}
        <div className="xl:col-span-7">
           
           <Tabs defaultValue="redeem" className="w-full">
             <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-10 mb-6 bg-slate-100 p-1 rounded-xl gap-2 md:gap-0">
               <TabsTrigger value="redeem" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Award className="h-4 w-4 mr-2"/> Cửa Hàng Đổi Điểm</TabsTrigger>
               <TabsTrigger value="my-vouchers" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Ticket className="h-4 w-4 mr-2"/> Voucher Của Tôi <Badge className="ml-2 bg-red-500 text-[10px]">2</Badge></TabsTrigger>
               <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"><Clock className="h-4 w-4 mr-2"/> Lịch Sử</TabsTrigger>
             </TabsList>

             {/* 1. REDEEM TAB (Cửa hàng) */}
             <TabsContent value="redeem" className="space-y-6">
                
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">Đặc Quyền Dành Cho Hạng <span className="text-cyan-600">Diamond</span></h2>
                  <Button variant="link" className="text-blue-600">Xem tất cả <ArrowRight className="h-4 w-4 ml-1"/></Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {VOUCHERS.map(v => (
                     <Card key={v.id} className={`shadow-sm overflow-hidden border ${v.color} hover:shadow-md transition-shadow group relative`}>
                        {/* If Not enough points, make it slightly opaque, but for this mock user has 245,000 pts. 
                            Voucher 4 needs 300,000 so we mock that one as disabled/locked. */}
                        {v.points > 245000 && (
                          <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <Badge variant="destructive" className="px-3 py-1 text-sm shadow-lg">Thiếu điểm</Badge>
                          </div>
                        )}
                        
                        <CardContent className="p-0">
                           <div className="p-5">
                             <div className="bg-white h-16 w-16 rounded-2xl shadow-sm flex items-center justify-center mb-4">
                                {v.icon}
                             </div>
                             <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[40px] mb-2">{v.title}</h3>
                             <p className="text-xs text-muted-foreground mb-4">Áp dụng đến 31/12/2026. Hỗ trợ quy đổi thành tiền mặt (chiết khấu).</p>
                           </div>
                           
                           <div className="bg-white/50 border-t p-4 flex items-center justify-between">
                             <div className="flex items-center gap-1 font-bold text-amber-600">
                                <Award className="h-4 w-4" />
                                {v.points.toLocaleString()} PTS
                             </div>
                             <Button 
                               size="sm" 
                               disabled={v.points > 245000}
                               className={`${v.points > 245000 ? 'bg-slate-300' : 'bg-slate-900 hover:bg-slate-800'} text-white font-bold rounded-full px-6`}
                             >
                               {v.points > 245000 ? 'Chưa Đủ Điểm' : 'Đổi Ngay'}
                             </Button>
                           </div>
                        </CardContent>
                     </Card>
                   ))}
                </div>

             </TabsContent>

             {/* 2. MY VOUCHERS TAB */}
             <TabsContent value="my-vouchers" className="space-y-4">
                <Card className="shadow-sm border-dashed border-slate-300 bg-slate-50">
                  <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                     <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                       <Ticket className="h-8 w-8 text-slate-400" />
                     </div>
                     <h3 className="font-bold text-slate-700 text-lg mb-1">Chưa có Voucher nào</h3>
                     <p className="text-sm text-slate-500 max-w-sm">Bạn chưa đổi bất kỳ Voucher nào. Hãy dạo quanh Cửa hàng để sử dụng điểm thưởng của mình nhé!</p>
                  </CardContent>
                </Card>
             </TabsContent>

             {/* 3. HISTORY TAB */}
             <TabsContent value="history" className="space-y-4">
                <Card className="shadow-sm">
                  <CardContent className="p-0">
                    <div className="divide-y">
                       <div className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-slate-800">Tích lũy từ Giao dịch Mua Aqua City</div>
                              <div className="text-xs text-muted-foreground mt-0.5">15/07/2026 - Mã GD: AQ-10294</div>
                            </div>
                          </div>
                          <div className="font-bold text-green-600">+150,000 PTS</div>
                       </div>
                       <div className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-slate-800">Tích lũy từ Giao dịch Mua Novaworld</div>
                              <div className="text-xs text-muted-foreground mt-0.5">02/02/2025 - Mã GD: NV-33121</div>
                            </div>
                          </div>
                          <div className="font-bold text-green-600">+95,000 PTS</div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
             </TabsContent>

           </Tabs>
        </div>

      </div>
    </div>
  )
}
