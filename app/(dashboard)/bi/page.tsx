"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart4, BrainCircuit, TrendingUp, TrendingDown, 
  Target, Filter, Download, Zap, PieChart, Activity,
  AlertTriangle
} from 'lucide-react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, Cell
} from 'recharts'
import { useStore } from '@/store/useStore'

// Mock Data cho Forecast
const FORECAST_DATA = [
  { month: 'T1', actual: 4000, forecast: null },
  { month: 'T2', actual: 3000, forecast: null },
  { month: 'T3', actual: 2000, forecast: null },
  { month: 'T4', actual: 2780, forecast: null },
  { month: 'T5', actual: 1890, forecast: null },
  { month: 'T6', actual: 2390, forecast: 2390 }, // Điểm nối
  { month: 'T7', actual: null, forecast: 3490 },
  { month: 'T8', actual: null, forecast: 4200 },
  { month: 'T9', actual: null, forecast: 3800 },
]

// Mock Data cho Funnel (Sử dụng BarChart nằm ngang mô phỏng Funnel)
const FUNNEL_DATA = [
  { step: '1. Khách Hàng Tiềm Năng (Leads)', value: 10000, fill: '#3b82f6' }, // blue-500
  { step: '2. Tương Tác / Gọi Điện', value: 4500, fill: '#0ea5e9' }, // sky-500
  { step: '3. Đi Xem Sa Bàn', value: 1200, fill: '#06b6d4' }, // cyan-500
  { step: '4. Đặt Cọc (Deposit)', value: 300, fill: '#14b8a6' }, // teal-500
  { step: '5. Ký HĐMB (Won)', value: 150, fill: '#10b981' }, // emerald-500
]

// Mock Data cho Heatmap (Thứ vs Giờ)
const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const HOURS = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
// Generate random heatmap data
const HEATMAP_DATA = DAYS.map(day => 
  HOURS.map(hour => ({
    day, hour, 
    value: Math.floor(Math.random() * 100)
  }))
).flat()

// Helper to get color based on value for heatmap
const getHeatmapColor = (value: number) => {
  if (value > 80) return 'bg-red-500'
  if (value > 60) return 'bg-orange-400'
  if (value > 40) return 'bg-amber-300'
  if (value > 20) return 'bg-yellow-200'
  return 'bg-slate-100'
}

export default function BIPage() {
  const { contracts, customers } = useStore();
  const totalRevenue = (contracts.reduce((sum, c) => sum + c.value, 0) / 1000000000).toLocaleString('en-US');
  const totalCustomers = customers.length.toLocaleString('en-US');

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart4 className="h-8 w-8 text-blue-600" />
            Báo Cáo BI & Phân Tích Dữ Liệu
          </h1>
          <p className="text-muted-foreground mt-1">Hệ thống phân tích kinh doanh thông minh với trí tuệ nhân tạo (AI Insights).</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-300"><Filter className="h-4 w-4 mr-2" /> Bộ Lọc</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
             <Download className="h-4 w-4 mr-2" /> Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* AI INSIGHTS BANNER (CỰC KỲ QUAN TRỌNG) */}
      <Card className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white border-0 shadow-lg overflow-hidden relative">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
           <BrainCircuit className="h-64 w-64 -mt-16 -mr-16" />
        </div>
        <CardContent className="p-6 md:p-8 relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="shrink-0 flex flex-col items-center justify-center p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <BrainCircuit className="h-12 w-12 text-cyan-400 mb-2" />
              <div className="font-bold tracking-widest uppercase text-xs text-indigo-200">AI Data Analyst</div>
           </div>
           
           <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                 <Zap className="h-5 w-5 text-amber-400 fill-amber-400" /> Tóm tắt Báo Cáo Điều Hành
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-black/20 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                   <TrendingUp className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                   <div>
                     <strong className="text-green-400 block mb-1">Dự Báo Lạc Quan:</strong>
                     <span className="text-sm text-indigo-100 leading-relaxed">Doanh thu tháng 7 và 8 dự kiến tăng vọt lên mức 4,200 Tỷ VNĐ nhờ hiệu ứng từ Lễ Mở bán Phân khu Aqua 2.</span>
                   </div>
                 </div>
                 <div className="bg-red-500/20 p-4 rounded-xl border border-red-500/30 flex items-start gap-3">
                   <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                   <div>
                     <strong className="text-red-400 block mb-1">Cảnh Báo Nút Thắt (Bottleneck):</strong>
                     <span className="text-sm text-indigo-100 leading-relaxed">Tỷ lệ rớt khách từ bước "Đi xem sa bàn" sang "Đặt Cọc" đang ở mức báo động (Rớt 75%). Cần rà soát lại khâu chốt Sale trực tiếp.</span>
                   </div>
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {[
           { title: 'TỔNG DOANH THU', value: `${totalRevenue} TỶ`, trend: '+12.5%', isUp: true },
           { title: 'TỔNG SỐ KHÁCH HÀNG', value: totalCustomers, trend: '+5.2%', isUp: true },
           { title: 'TỶ LỆ CHUYỂN ĐỔI', value: '1.5%', trend: '-0.3%', isUp: false },
           { title: 'CHI PHÍ / LEAD (CPL)', value: '1.2 TR', trend: '-10%', isUp: true }, // Giảm chi phí là tốt
         ].map((kpi, i) => (
           <Card key={i} className="shadow-sm">
             <CardContent className="p-5">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{kpi.title}</div>
                <div className="text-2xl font-bold text-slate-800 mb-1">{kpi.value}</div>
                <div className={`text-xs font-bold flex items-center gap-1 ${kpi.isUp ? 'text-green-600' : 'text-red-600'}`}>
                   {kpi.isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                   {kpi.trend} so với tháng trước
                </div>
             </CardContent>
           </Card>
         ))}
      </div>

      {/* MAIN CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Phễu Bán Hàng (Sales Funnel) */}
         <Card className="shadow-sm flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                 Phễu Bán Hàng (Sales Funnel)
                 <Badge variant="outline" className="bg-slate-50">YTD 2026</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center min-h-[350px]">
               <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart
                     layout="vertical"
                     data={FUNNEL_DATA}
                     margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                     barSize={40}
                   >
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="step" type="category" width={180} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                     
                     <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                       {FUNNEL_DATA.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.fill} />
                       ))}
                     </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               
               {/* Insight Note for Funnel */}
               <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-800 leading-relaxed font-medium">
                    Có sự sụt giảm nghiêm trọng (Tỷ lệ chuyển đổi chỉ đạt 25%) từ bước "Đi Xem Sa Bàn" (1,200) sang "Đặt Cọc" (300).
                  </p>
               </div>
            </CardContent>
         </Card>

         {/* Dự Báo Doanh Thu (Revenue Forecast) */}
         <Card className="shadow-sm flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                 Dự Báo Doanh Thu (Revenue Forecast)
                 <div className="flex items-center gap-4 text-xs font-normal">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded-sm"></div> Thực tế</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 border-2 border-dashed border-blue-400 rounded-sm"></div> AI Dự báo</span>
                 </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center min-h-[350px]">
               <div className="h-[300px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart
                     data={FORECAST_DATA}
                     margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                   >
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis dataKey="month" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                     <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                     <Tooltip 
                       contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                       formatter={(value: any) => [`${value} Tỷ`, 'Doanh Thu']}
                     />
                     <Line type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                     <Line type="monotone" dataKey="forecast" stroke="#60a5fa" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4, fill: '#fff'}} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    Mô hình dự báo ARIMA cho thấy Doanh thu tháng 8 có thể chạm đỉnh 4,200 Tỷ. Độ tin cậy (Confidence Interval): 85%.
                  </p>
               </div>
            </CardContent>
         </Card>

      </div>

      {/* HEATMAP */}
      <Card className="shadow-sm">
         <CardHeader>
           <CardTitle className="text-lg">Bản Đồ Nhiệt Tương Tác Khách Hàng (Heatmap)</CardTitle>
           <CardDescription>Màu càng đậm thể hiện lưu lượng khách hàng tương tác trên CRM (Nghe gọi, nhắn tin, đặt lịch) càng cao.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="overflow-x-auto">
               <div className="min-w-[600px]">
                  {/* Heatmap Grid Header (Hours) */}
                  <div className="flex ml-12 mb-2">
                     {HOURS.map(hour => (
                       <div key={hour} className="flex-1 text-center text-xs font-bold text-slate-400">{hour}</div>
                     ))}
                  </div>
                  
                  {/* Heatmap Rows (Days) */}
                  <div className="flex flex-col gap-1">
                     {DAYS.map(day => (
                       <div key={day} className="flex items-center">
                          <div className="w-12 text-xs font-bold text-slate-500">{day}</div>
                          <div className="flex-1 flex gap-1">
                             {HEATMAP_DATA.filter(d => d.day === day).map((cell, idx) => (
                               <div 
                                 key={idx} 
                                 className={`flex-1 h-8 rounded-sm ${getHeatmapColor(cell.value)} hover:ring-2 ring-slate-400 cursor-pointer transition-all`}
                                 title={`${cell.day} lúc ${cell.hour}: ${cell.value} tương tác`}
                               ></div>
                             ))}
                          </div>
                       </div>
                     ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-end gap-2 mt-6">
                     <span className="text-xs text-slate-500">Thấp</span>
                     <div className="flex gap-1">
                       <div className="w-4 h-4 bg-slate-100 rounded-sm"></div>
                       <div className="w-4 h-4 bg-yellow-200 rounded-sm"></div>
                       <div className="w-4 h-4 bg-amber-300 rounded-sm"></div>
                       <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
                       <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                     </div>
                     <span className="text-xs text-slate-500">Cao</span>
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>

    </div>
  )
}
