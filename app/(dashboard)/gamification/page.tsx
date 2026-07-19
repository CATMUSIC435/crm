"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Trophy, Medal, Target, Zap, Star, Crown, 
  Swords, Flame, ArrowUpCircle, Award, Crosshair
} from 'lucide-react'

// MOCK DATA
const LEADERBOARD = [
  { rank: 1, name: 'Nguyễn Trần Tuấn Tú', score: 98500, avatar: 'NT', deal: '25.5 Tỷ', trend: 'up' },
  { rank: 2, name: 'Lê Hoàng Anh', score: 82400, avatar: 'LA', deal: '21.0 Tỷ', trend: 'up' },
  { rank: 3, name: 'Phạm Thị Mai', score: 75100, avatar: 'PM', deal: '18.5 Tỷ', trend: 'down' },
  { rank: 4, name: 'Trần Văn Đạt', score: 64200, avatar: 'TD', deal: '15.2 Tỷ', trend: 'up' },
  { rank: 5, name: 'Hoàng Ngọc Ánh', score: 61000, avatar: 'HA', deal: '12.8 Tỷ', trend: 'down' },
]

const QUESTS = [
  { id: 1, title: 'Sát Thủ Cuộc Gọi', desc: 'Thực hiện 50 cuộc gọi Outbound', current: 45, max: 50, exp: '+500 EXP', icon: <Crosshair className="h-5 w-5 text-red-500" /> },
  { id: 2, title: 'Người Dẫn Đường', desc: 'Dẫn 5 khách hàng đi xem sa bàn', current: 2, max: 5, exp: '+1000 EXP', icon: <Target className="h-5 w-5 text-blue-500" /> },
  { id: 3, title: 'Cá Mập Cắn Câu', desc: 'Chốt thành công 1 Hợp đồng', current: 0, max: 1, exp: '+5000 EXP', icon: <Swords className="h-5 w-5 text-amber-500" /> },
]

const BADGES = [
  { id: 1, name: 'First Blood', desc: 'Chốt hợp đồng đầu tiên', icon: <Flame className="h-6 w-6 text-white" />, color: 'bg-red-500', unlocked: true },
  { id: 2, name: 'Sharpshooter', desc: 'Tỷ lệ chốt trên 20%', icon: <Crosshair className="h-6 w-6 text-white" />, color: 'bg-indigo-500', unlocked: true },
  { id: 3, name: 'Whale Hunter', desc: 'Bán biệt thự > 50 Tỷ', icon: <Crown className="h-6 w-6 text-white" />, color: 'bg-amber-500', unlocked: false },
  { id: 4, name: 'Marathon', desc: 'Gọi 1000 cuộc gọi', icon: <Zap className="h-6 w-6 text-white" />, color: 'bg-emerald-500', unlocked: true },
  { id: 5, name: 'MVP Tháng', desc: 'Top 1 doanh số tháng', icon: <Trophy className="h-6 w-6 text-white" />, color: 'bg-yellow-400', unlocked: false },
]

export default function GamificationPage() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Đua Top & Thành Tích
          </h1>
          <p className="text-muted-foreground mt-1">Hệ thống Gamification: Nhiệm vụ, cấp độ và bảng vinh danh chiến binh.</p>
        </div>
      </div>

      {/* PLAYER PROFILE CARD (THẺ NHÂN VẬT) */}
      <Card className="bg-slate-900 border-0 shadow-xl overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-indigo-600/30 to-transparent pointer-events-none"></div>
        <div className="absolute -right-20 -top-20 opacity-20 pointer-events-none">
           <Trophy className="h-96 w-96 text-yellow-500" />
        </div>
        <CardContent className="p-4 md:p-8 relative z-10">
           <div className="flex flex-col md:flex-row items-center gap-8">
              
              {/* Avatar & Level */}
              <div className="relative shrink-0">
                 <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-600 blur-md opacity-50 animate-pulse"></div>
                 <div className="h-32 w-32 rounded-full border-4 border-slate-800 bg-slate-100 flex items-center justify-center relative z-10 overflow-hidden">
                    <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="h-full w-full object-cover" />
                 </div>
                 <div className="absolute -bottom-4 left-1/2 -ml-8 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black px-4 py-1 rounded-full border-2 border-slate-900 z-20 shadow-lg text-sm">
                    LV 25
                 </div>
              </div>

              {/* Info & EXP */}
              <div className="flex-1 text-center md:text-left w-full">
                 <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight mb-1">Nguyễn Trần Tuấn Tú</h2>
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30">Phòng Kinh Doanh 1</Badge>
                        <Badge className="bg-amber-500 text-amber-950 hover:bg-amber-400 font-bold border-0 shadow-[0_0_15px_rgba(245,158,11,0.5)] flex items-center gap-1">
                           <Swords className="h-3 w-3" /> Chiến Thần Chốt Cọc
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                       <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Tổng Điểm Tích Lũy</div>
                       <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500">98,500 <span className="text-sm text-amber-500">EXP</span></div>
                    </div>
                 </div>

                 {/* EXP Bar */}
                 <div className="space-y-2 mt-6">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Tiến trình thăng cấp (Level 26)</span>
                      <span>7,500 / 10,000 EXP</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                       <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-[75%] relative">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-30 animate-[slide_1s_linear_infinite]"></div>
                       </div>
                    </div>
                    <p className="text-xs text-slate-400">Còn <strong className="text-indigo-400">2,500 EXP</strong> nữa để đạt danh hiệu <strong className="text-amber-400">"Lãnh Chúa Bất Động Sản"</strong></p>
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
         
         {/* CỘT TRÁI: QUESTS & BADGES (7/12) */}
         <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* THỬ THÁCH HÀNG TUẦN (WEEKLY QUESTS) */}
            <Card className="shadow-sm border-slate-200">
               <CardHeader className="pb-3 border-b">
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    Thử Thách Tuần (Weekly Quests)
                 </CardTitle>
                 <CardDescription>Hoàn thành nhiệm vụ để nhận lượng lớn EXP.</CardDescription>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y">
                     {QUESTS.map(quest => {
                        const progress = (quest.current / quest.max) * 100;
                        const isDone = progress >= 100;
                        return (
                           <div key={quest.id} className="p-5 hover:bg-slate-50 transition-colors">
                              <div className="flex items-start gap-4">
                                 <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border shadow-sm">
                                    {quest.icon}
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                       <h4 className={`font-bold text-base ${isDone ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{quest.title}</h4>
                                       <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-black">{quest.exp}</Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 mb-3">{quest.desc}</p>
                                    
                                    <div className="flex items-center gap-3">
                                       <Progress value={progress} className={`h-2 flex-1 ${isDone ? 'opacity-50' : ''}`} />
                                       <span className="text-xs font-bold text-slate-600 w-12 text-right">{quest.current} / {quest.max}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               </CardContent>
            </Card>

            {/* BỘ SƯU TẬP HUY HIỆU (BADGES) */}
            <Card className="shadow-sm border-slate-200 bg-slate-50">
               <CardHeader className="pb-2 border-b bg-white">
                 <CardTitle className="text-lg flex items-center gap-2">
                    <Medal className="h-5 w-5 text-amber-500" />
                    Tủ Kính Huy Hiệu (Badges)
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                     {BADGES.map(badge => (
                        <div key={badge.id} className={`flex flex-col items-center text-center group ${!badge.unlocked ? 'opacity-40 grayscale' : ''}`}>
                           <div className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg mb-3 transition-transform group-hover:scale-110 ${badge.color}`}>
                              {badge.icon}
                           </div>
                           <div className="font-bold text-xs text-slate-800 mb-1">{badge.name}</div>
                           <div className="text-[10px] text-slate-500 leading-tight">{badge.desc}</div>
                           {!badge.unlocked && <div className="mt-2 text-[10px] font-bold text-slate-400 flex items-center gap-1"><Badge variant="outline" className="text-[9px] px-1 py-0 h-4">Đã Khóa</Badge></div>}
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

         </div>

         {/* CỘT PHẢI: BẢNG XẾP HẠNG (5/12) */}
         <div className="lg:col-span-5">
            <Card className="shadow-lg border-amber-200 relative overflow-hidden flex flex-col h-full">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600"></div>
               
               <CardHeader className="pb-4 bg-amber-50/50">
                 <CardTitle className="text-xl flex justify-between items-center text-amber-900">
                    <span className="flex items-center gap-2"><Trophy className="h-6 w-6 text-amber-500" /> Bảng Xếp Hạng Tháng</span>
                 </CardTitle>
                 <CardDescription>Top chiến thần doanh số toàn công ty.</CardDescription>
               </CardHeader>
               
               <CardContent className="p-0 flex-1">
                  <div className="divide-y divide-amber-100">
                     {LEADERBOARD.map((user, idx) => {
                        const isTop1 = idx === 0;
                        const isTop2 = idx === 1;
                        const isTop3 = idx === 2;
                        
                        let rankColor = 'bg-slate-100 text-slate-500';
                        if (isTop1) rankColor = 'bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-950 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
                        if (isTop2) rankColor = 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 shadow-sm';
                        if (isTop3) rankColor = 'bg-gradient-to-br from-orange-300 to-orange-500 text-orange-950 shadow-sm';

                        return (
                           <div key={user.rank} className={`p-4 flex items-center gap-4 transition-colors ${isTop1 ? 'bg-amber-50/50' : 'hover:bg-slate-50'}`}>
                              
                              {/* Rank Number */}
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${rankColor}`}>
                                 {isTop1 ? <Crown className="h-4 w-4" /> : user.rank}
                              </div>

                              {/* Avatar */}
                              <Avatar className={`h-10 w-10 border-2 ${isTop1 ? 'border-amber-400' : 'border-transparent'}`}>
                                <AvatarFallback className={`${isTop1 ? 'bg-amber-100 text-amber-700' : ''}`}>{user.avatar}</AvatarFallback>
                              </Avatar>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                 <h4 className={`font-bold text-sm truncate ${isTop1 ? 'text-amber-900' : 'text-slate-800'}`}>
                                    {user.name} {isTop1 && <span className="ml-1 text-[10px] bg-red-500 text-white px-1 py-0.5 rounded uppercase">MVP</span>}
                                 </h4>
                                 <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <Star className={`h-3 w-3 ${isTop1 ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}`} />
                                    {user.score.toLocaleString()} EXP
                                 </div>
                              </div>

                              {/* Deal Info */}
                              <div className="text-right shrink-0">
                                 <div className={`font-black text-lg ${isTop1 ? 'text-amber-600' : 'text-slate-700'}`}>{user.deal}</div>
                                 <div className="text-[10px] font-bold text-green-500 flex items-center justify-end gap-0.5">
                                    <ArrowUpCircle className="h-3 w-3" /> Tăng hạng
                                 </div>
                              </div>

                           </div>
                        )
                     })}
                  </div>
               </CardContent>
               
               <div className="p-4 bg-slate-900 text-center shrink-0">
                  <p className="text-xs text-slate-400">Bạn đang đứng thứ <strong className="text-white">#1</strong> trong bảng xếp hạng. Hãy tiếp tục duy trì phong độ!</p>
               </div>
            </Card>
         </div>

      </div>
    </div>
  )
}
