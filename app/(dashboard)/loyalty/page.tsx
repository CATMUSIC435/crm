"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Crown, Gem, Award, Gift, Clock, Star, 
  ArrowRight, ShieldCheck, Ticket, Plane, 
  Sofa, Coffee, CheckCircle2, QrCode, Sparkles
} from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function LoyaltyPage() {
  const { customers, vouchers, myVouchers, loyaltyTransactions, loyaltyPoints, redeemVoucher } = useStore()
  const customerName = customers[0]?.name || 'Nguyễn Văn A'

  // Calculate Tier
  let tier = 'Silver'
  let nextTier = 'Gold'
  let tierIcon = <Star className="h-4 w-4 text-slate-400" />
  let nextTierPoints = 100000

  if (loyaltyPoints >= 500000) {
    tier = 'Signature'
    nextTier = 'Tối Đa'
    tierIcon = <Crown className="h-4 w-4 text-yellow-400" />
    nextTierPoints = loyaltyPoints
  } else if (loyaltyPoints >= 200000) {
    tier = 'Diamond'
    nextTier = 'Signature'
    tierIcon = <Gem className="h-4 w-4 text-cyan-400" />
    nextTierPoints = 500000
  } else if (loyaltyPoints >= 100000) {
    tier = 'Gold'
    nextTier = 'Diamond'
    tierIcon = <Award className="h-4 w-4 text-amber-400" />
    nextTierPoints = 200000
  }

  const progressPct = Math.min((loyaltyPoints / nextTierPoints) * 100, 100)
  const ptsNeeded = Math.max(nextTierPoints - loyaltyPoints, 0)

  // Map icon names to components
  const renderIcon = (name: string, className: string) => {
    switch (name) {
      case 'Plane': return <Plane className={className} />
      case 'Sofa': return <Sofa className={className} />
      case 'Coffee': return <Coffee className={className} />
      case 'ShieldCheck': return <ShieldCheck className={className} />
      default: return <Gift className={className} />
    }
  }

  const handleRedeem = (id: string) => {
    redeemVoucher(id)
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-slate-800 dark:text-slate-100">
            <Crown className="h-8 w-8 text-amber-400 fill-amber-400" />
            Đặc Quyền Hội Viên (Loyalty)
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý hạng thành viên, tích lũy NovaPoints và đổi ngàn quà tặng thượng lưu bằng điểm Real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* CỘT TRÁI: THẺ THÀNH VIÊN V.I.P */}
        <div className="xl:col-span-5 space-y-6 sticky top-4">
           
           {/* Digital Membership Card (Dynamic Tier) */}
           <div className="relative group perspective-1000">
              <div className={`w-full aspect-[1.6/1] rounded-2xl p-6 md:p-8 text-white shadow-2xl overflow-hidden relative transition-transform duration-500 hover:scale-[1.02] border
                ${tier === 'Diamond' ? 'bg-gradient-to-tr from-slate-900 via-slate-800 to-black border-slate-700/50' : 
                  tier === 'Signature' ? 'bg-gradient-to-tr from-yellow-900 via-amber-700 to-black border-amber-500/50' : 
                  'bg-gradient-to-tr from-slate-500 via-slate-400 to-slate-600 border-slate-300'}
              `}>
                 
                 {/* Shiny Background Effects */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-3xl -mr-10 -mt-10 animate-pulse"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-3xl -ml-10 -mb-10"></div>
                 
                 {/* Card Content */}
                 <div className="relative z-10 flex flex-col justify-between h-full">
                    
                    {/* Top Row: Logo & Tier */}
                    <div className="flex justify-between items-start">
                       <div>
                         <div className="text-xl font-bold tracking-widest text-slate-100">NOVA<span className="text-amber-400">LOYALTY</span></div>
                         <div className="text-[10px] uppercase tracking-[0.3em] text-slate-300 mt-1">Exclusive Member</div>
                       </div>
                       <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-slate-700/50 backdrop-blur-md">
                         {tierIcon}
                         <span className="text-xs font-bold uppercase tracking-wider text-white">{tier}</span>
                       </div>
                    </div>

                    {/* Middle Row: Points */}
                    <div className="mt-auto mb-4">
                       <div className="text-xs text-slate-300 uppercase tracking-widest mb-1 font-medium">Điểm Tích Lũy Khả Dụng</div>
                       <div className="flex items-end gap-2">
                          <span className="text-5xl md:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300">
                             {loyaltyPoints.toLocaleString()}
                          </span>
                          <span className="text-lg text-amber-200/80 font-bold mb-1.5">PTS</span>
                       </div>
                    </div>

                    {/* Bottom Row: Name & ID */}
                    <div className="flex justify-between items-end">
                       <div>
                         <div className="text-sm font-bold tracking-widest text-slate-100 uppercase">{customerName}</div>
                         <div className="text-xs font-mono text-slate-400 mt-0.5">ID: 8899 2233 4455 6677</div>
                       </div>
                       <QrCode className="h-8 w-8 text-slate-300 opacity-60 hover:opacity-100 transition-opacity cursor-pointer" />
                    </div>

                 </div>
              </div>
           </div>

           {/* Tier Progression */}
           <Card className="shadow-sm border-0 ring-1 ring-slate-200">
             <CardContent className="p-5 md:p-6 bg-slate-50/50 rounded-xl">
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Tiến Độ Thăng Hạng</h3>
                    {tier !== 'Signature' && (
                      <p className="text-xs text-muted-foreground mt-1 font-medium">Hạng tiếp theo: <strong className="text-purple-600">{nextTier}</strong></p>
                    )}
                  </div>
                  {tier !== 'Signature' && (
                    <div className="text-sm font-bold text-slate-700">{loyaltyPoints.toLocaleString()} / {nextTierPoints.toLocaleString()} PTS</div>
                  )}
                </div>
                
                {/* Progress Bar */}
                {tier !== 'Signature' ? (
                  <>
                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden mb-4 relative shadow-inner">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-1000" style={{ width: `${progressPct}%` }}></div>
                    </div>
                    
                    <p className="text-xs font-medium text-slate-700 bg-blue-50/80 p-3.5 rounded-lg border border-blue-100 flex items-start gap-2.5 shadow-sm">
                      <Sparkles className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <span>Chỉ cần tích lũy thêm <strong>{ptsNeeded.toLocaleString()} Điểm</strong> để mở khóa thẻ <strong>{nextTier}</strong> với ngàn đặc quyền thượng lưu!</span>
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-medium text-amber-700 bg-amber-50 p-3.5 rounded-lg border border-amber-200 flex items-start gap-2.5 shadow-sm mt-4">
                    <Crown className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>Chúc mừng! Bạn đã đạt mức thẻ cao nhất. Hãy sử dụng điểm để tận hưởng các đặc quyền xứng tầm.</span>
                  </p>
                )}
             </CardContent>
           </Card>

        </div>

        {/* CỘT PHẢI: CỬA HÀNG ĐẶC QUYỀN */}
        <div className="xl:col-span-7">
           
           <Tabs defaultValue="redeem" className="w-full">
             <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto md:h-12 mb-6 bg-slate-100 p-1.5 rounded-xl gap-2 md:gap-0">
               <TabsTrigger value="redeem" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold py-2"><Award className="h-4 w-4 mr-2 text-amber-500"/> Cửa Hàng Đổi Điểm</TabsTrigger>
               <TabsTrigger value="my-vouchers" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold py-2">
                 <Ticket className="h-4 w-4 mr-2 text-blue-500"/> Túi Đồ Của Tôi 
                 {myVouchers.length > 0 && <Badge className="ml-2 bg-red-500 hover:bg-red-600 border-none text-[10px]">{myVouchers.length}</Badge>}
               </TabsTrigger>
               <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold py-2"><Clock className="h-4 w-4 mr-2 text-slate-500"/> Lịch Sử Giao Dịch</TabsTrigger>
             </TabsList>

             {/* 1. REDEEM TAB (Cửa hàng) */}
             <TabsContent value="redeem" className="space-y-6">
                
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Gift className="h-5 w-5 text-indigo-500" />
                    Đặc Quyền Dành Cho Hạng <span className="text-cyan-600 uppercase">{tier}</span>
                  </h2>
                  <Button variant="link" className="text-blue-600 font-bold hidden sm:flex">Xem tất cả <ArrowRight className="h-4 w-4 ml-1"/></Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   {vouchers.map(v => {
                     const isAffordable = loyaltyPoints >= v.points
                     return (
                       <Card key={v.id} className={`shadow-sm overflow-hidden border ${v.color} hover:shadow-md transition-shadow group relative`}>
                          
                          {!isAffordable && (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <Badge variant="destructive" className="px-3 py-1.5 text-sm shadow-lg font-bold">Thiếu { (v.points - loyaltyPoints).toLocaleString() } Điểm</Badge>
                            </div>
                          )}
                          
                          <CardContent className="p-0">
                             <div className="p-5">
                               <div className="bg-white h-16 w-16 rounded-2xl shadow-sm flex items-center justify-center mb-4 ring-1 ring-black/5">
                                  {renderIcon(v.iconName, "h-8 w-8 opacity-80")}
                               </div>
                               <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[40px] mb-2 leading-snug text-lg">{v.title}</h3>
                               <p className="text-xs text-muted-foreground mb-4 font-medium">Áp dụng đến 31/12/2026. Hỗ trợ quy đổi thành tiền mặt (chiết khấu).</p>
                             </div>
                             
                             <div className="bg-white/60 border-t p-4 flex items-center justify-between">
                               <div className="flex flex-col">
                                 <span className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Giá Trị</span>
                                 <div className="flex items-center gap-1.5 font-black text-amber-600 text-lg">
                                    {v.points.toLocaleString()} PTS
                                 </div>
                               </div>
                               <Button 
                                 size="sm" 
                                 disabled={!isAffordable}
                                 onClick={() => handleRedeem(v.id)}
                                 className={`${!isAffordable ? 'bg-slate-300 text-slate-500' : 'bg-slate-900 hover:bg-slate-800 hover:scale-105 transition-transform shadow-md'} text-white font-bold rounded-full px-6 h-10`}
                               >
                                 {!isAffordable ? 'Chưa Đủ Điểm' : 'Đổi Quà Ngay'}
                               </Button>
                             </div>
                          </CardContent>
                       </Card>
                     )
                   })}
                </div>

             </TabsContent>

             {/* 2. MY VOUCHERS TAB */}
             <TabsContent value="my-vouchers" className="space-y-4">
                {myVouchers.length === 0 ? (
                  <Card className="shadow-sm border-dashed border-slate-300 bg-slate-50">
                    <CardContent className="p-16 flex flex-col items-center justify-center text-center">
                       <div className="h-20 w-20 bg-slate-200 rounded-full flex items-center justify-center mb-5 ring-4 ring-slate-100">
                         <Ticket className="h-10 w-10 text-slate-400" />
                       </div>
                       <h3 className="font-bold text-slate-700 text-xl mb-2">Túi Đồ Đang Trống</h3>
                       <p className="text-sm text-slate-500 max-w-sm font-medium leading-relaxed">Bạn chưa đổi bất kỳ món quà nào. Hãy dùng Điểm NovaPoints đang có để tận hưởng đặc quyền nhé!</p>
                       <Button className="mt-6 font-bold" variant="outline">Khám Phá Cửa Hàng</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {myVouchers.map((v, i) => (
                      <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border shadow-sm bg-white ${v.color}`}>
                         <div className="h-16 w-16 bg-white rounded-lg shadow-sm border flex items-center justify-center shrink-0">
                           {renderIcon(v.iconName, "h-8 w-8 opacity-80")}
                         </div>
                         <div className="flex-1">
                           <h4 className="font-bold text-slate-800 text-base mb-1">{v.title}</h4>
                           <p className="text-xs text-slate-500 font-medium">Hạn sử dụng: 31/12/2026</p>
                         </div>
                         <div className="shrink-0">
                           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm">Sử Dụng Mã</Button>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
             </TabsContent>

             {/* 3. HISTORY TAB */}
             <TabsContent value="history" className="space-y-4">
                <Card className="shadow-sm border-0 ring-1 ring-slate-200">
                  <CardHeader className="bg-slate-50/50 border-b pb-4 rounded-t-xl">
                    <CardTitle className="text-lg">Biến động số dư Điểm</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                       {loyaltyTransactions.map(t => (
                         <div key={t.id} className="p-4 md:p-5 flex justify-between items-center hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {t.type === 'earn' ? <CheckCircle2 className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-slate-800">{t.title}</div>
                                <div className="text-xs text-muted-foreground mt-1 font-medium">{t.date}</div>
                              </div>
                            </div>
                            <div className={`font-black text-lg ${t.type === 'earn' ? 'text-green-600' : 'text-red-500'}`}>
                              {t.type === 'earn' ? '+' : '-'}{t.points.toLocaleString()}
                            </div>
                         </div>
                       ))}
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
