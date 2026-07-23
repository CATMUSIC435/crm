"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Database, TrendingUp, MapPin, Search, Calendar, ChevronDown, 
  Building2, HardHat, Car, TreePine, GraduationCap, Stethoscope, 
  Briefcase, Activity, BarChart3, PieChart as PieChartIcon, ArrowRight, Sparkles
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend
} from 'recharts'
import { REGIONS, MARKET_DATA, RegionKey, MACRO_DATA } from './data'

export default function MarketDataPage() {
  const [region, setRegion] = useState<RegionKey>('thu_duc')
  
  const currentData = MARKET_DATA[region]

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-4 md:p-6 rounded-2xl shadow-lg text-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-8 w-8 text-cyan-400" />
            Market Intelligence
          </h1>
          <p className="text-slate-400 mt-1">Kho dữ liệu thị trường Bất Động Sản (Market Research & Insights).</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-xl border border-slate-700">
           <MapPin className="h-5 w-5 text-slate-400 ml-2" />
           <select 
             value={region}
             onChange={(e) => setRegion(e.target.value as RegionKey)}
             className="bg-transparent border-none text-white focus:ring-0 text-sm font-medium cursor-pointer min-w-[200px] outline-none"
           >
             {Object.entries(REGIONS).map(([key, label]) => (
               <option key={key} value={key} className="text-black">{label}</option>
             ))}
           </select>
           <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 transition-colors">Phân Tích</Button>
        </div>
      </div>

      <Tabs defaultValue="price" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 h-auto md:h-12 bg-slate-100">
          <TabsTrigger value="price" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white"><TrendingUp className="h-4 w-4 text-cyan-600"/> Biến Động Giá</TabsTrigger>
          <TabsTrigger value="infra" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white"><HardHat className="h-4 w-4 text-amber-600"/> Quy Hoạch Hạ Tầng</TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white"><PieChartIcon className="h-4 w-4 text-purple-600"/> Tiện Ích & Dân Cư</TabsTrigger>
          <TabsTrigger value="macro" className="flex items-center gap-2 py-2.5 data-[state=active]:bg-white"><Activity className="h-4 w-4 text-emerald-600"/> Vĩ Mô & Kinh Tế</TabsTrigger>
        </TabsList>

        {/* 1. TAB: GIÁ & GIAO DỊCH */}
        <TabsContent value="price" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
             <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100">
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-1">Giá Trung Bình (Căn Hộ)</div>
                 <div className="text-3xl font-bold text-cyan-700">{currentData.priceAvg} <span className="text-sm font-normal text-slate-500">Tr/m²</span></div>
                 <Badge className="mt-2 bg-green-500"><TrendingUp className="h-3 w-3 mr-1"/> {currentData.priceChange} so với 2025</Badge>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-1">Thanh Khoản (Giao Dịch/Tháng)</div>
                 <div className="text-3xl font-bold text-slate-800">{currentData.liquidity} <span className="text-sm font-normal text-slate-500">Căn</span></div>
                 <Badge variant="outline" className={`mt-2 ${currentData.liquidityChange.startsWith('+') ? 'text-green-500 border-green-200 bg-green-50' : 'text-red-500 border-red-200 bg-red-50'}`}>
                   {currentData.liquidityChange} so với 2025
                 </Badge>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-1">Tỷ Suất Cho Thuê (Rental Yield)</div>
                 <div className="text-3xl font-bold text-slate-800">{currentData.yield} <span className="text-sm font-normal text-slate-500">% / Năm</span></div>
                 <Badge variant="secondary" className="mt-2 text-slate-500 bg-slate-100">Khảo sát thị trường</Badge>
               </CardContent>
             </Card>
           </div>

           <Card className="shadow-sm border-0 ring-1 ring-slate-200">
             <CardHeader className="pb-0 border-b bg-slate-50/50 rounded-t-xl">
               <CardTitle className="text-lg text-slate-800">Biểu Đồ Tăng Trưởng Giá vs Khối Lượng Giao Dịch</CardTitle>
               <CardDescription>Cơ sở dữ liệu giá trị tại {REGIONS[region]}</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
               <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={currentData.priceTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                     {/* 2 Y-Axis for Price and Volume */}
                     <YAxis yAxisId="left" orientation="left" stroke="#06b6d4" axisLine={false} tickLine={false} />
                     <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" axisLine={false} tickLine={false} />
                     <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                     <Legend wrapperStyle={{paddingTop: '20px'}} />
                     <Area yAxisId="left" type="monotone" dataKey="price" name="Giá (Tr/m²)" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                     <Bar yAxisId="right" dataKey="volume" name="Khối lượng (Căn)" fill="#e2e8f0" barSize={30} radius={[4, 4, 0, 0]} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
               <div className="mt-4 p-4 bg-cyan-50 border border-cyan-100 rounded-xl text-sm text-cyan-900 leading-relaxed shadow-sm">
                  <strong><Sparkles className="h-4 w-4 inline-block mr-1 text-cyan-600" /> AI Nhận Định ({REGIONS[region]}):</strong> {currentData.aiInsight}
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* 2. TAB: QUY HOẠCH HẠ TẦNG */}
        <TabsContent value="infra" className="space-y-6">
           <Card className="shadow-sm overflow-hidden border-0 ring-1 ring-slate-200">
             {/* Map Placeholder */}
             <div className="h-[250px] bg-slate-200 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="text-center z-10 bg-white/80 backdrop-blur px-8 py-4 rounded-2xl shadow-sm">
                   <MapPin className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                   <h3 className="font-bold text-slate-800 text-lg">Bản Đồ Quy Hoạch GIS</h3>
                   <p className="text-sm text-slate-600">Đang hiển thị vùng: {REGIONS[region]}</p>
                </div>
             </div>
             
             <CardContent className="p-0">
               <div className="divide-y divide-slate-100">
                 {currentData.infras.map((infra, idx) => (
                   <div key={idx} className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col md:flex-row gap-6">
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-2">
                              {infra.progress > 80 && <Badge className="bg-red-500">Trọng Điểm</Badge>}
                              <h4 className="font-bold text-slate-800 text-lg">{infra.name}</h4>
                           </div>
                           <p className="text-sm text-slate-600 mb-4">{infra.desc}</p>
                           <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                             <span>Tiến độ thi công:</span>
                             <span className={infra.progress > 80 ? 'text-green-600' : 'text-amber-600'}>
                               {infra.progress}% ({infra.progress > 80 ? 'Hoàn thiện' : 'Đang thi công'})
                             </span>
                           </div>
                           <Progress value={infra.progress} className="h-2 bg-slate-200" />
                         </div>
                         <div className={`w-full md:w-[200px] rounded-xl border p-4 text-center flex flex-col justify-center ${infra.impact === 'Rất Lớn' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                            <div className="text-xs font-bold uppercase mb-1 opacity-80">Mức độ tác động</div>
                            <div className="text-2xl font-black">{infra.impact}</div>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* 3. TAB: DÂN CƯ & TIỆN ÍCH */}
        <TabsContent value="demo" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <Card className="shadow-sm border-0 ring-1 ring-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">Chấm Điểm Hệ Sinh Thái (Radar Score)</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center min-h-[350px]">
                   <div className="h-[300px] w-[100%] max-w-[400px]">
                     <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="70%" data={currentData.amenitiesRadar}>
                         <PolarGrid stroke="#e2e8f0" />
                         <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 12, fontWeight: 600}} />
                         <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                         <Radar name={REGIONS[region]} dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                         <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                       </RadarChart>
                     </ResponsiveContainer>
                   </div>
                </CardContent>
              </Card>

              <div className="space-y-6 flex flex-col justify-center">
                 <Card className="shadow-sm bg-blue-50/50 border-blue-100">
                   <CardHeader className="pb-3 border-b border-blue-100">
                     <CardTitle className="text-base flex items-center gap-2 text-blue-800"><GraduationCap className="h-5 w-5 text-blue-600"/> Hệ thống Giáo dục</CardTitle>
                   </CardHeader>
                   <CardContent className="pt-4 space-y-4 text-sm text-slate-700">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                        <span className="font-semibold text-slate-800">Mạng lưới trường Quốc tế</span>
                        <Badge variant="outline" className="text-blue-600 border-blue-200">{currentData.amenitiesRadar.find(r=>r.subject==='Giáo Dục')?.A} Điểm</Badge>
                      </div>
                      <p className="text-slate-500 px-1">Chất lượng giáo dục tại khu vực luôn là yếu tố được các gia đình ưu tiên hàng đầu khi quyết định mua nhà.</p>
                   </CardContent>
                 </Card>

                 <Card className="shadow-sm bg-emerald-50/50 border-emerald-100">
                   <CardHeader className="pb-3 border-b border-emerald-100">
                     <CardTitle className="text-base flex items-center gap-2 text-emerald-800"><TreePine className="h-5 w-5 text-emerald-600"/> Môi trường & Mảng xanh</CardTitle>
                   </CardHeader>
                   <CardContent className="pt-4 space-y-4 text-sm text-slate-700">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                        <span className="font-semibold text-slate-800">Chất lượng không khí</span>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-200">{currentData.amenitiesRadar.find(r=>r.subject==='Cây Xanh')?.A} Điểm</Badge>
                      </div>
                      <p className="text-slate-500 px-1">Tỷ lệ bao phủ cây xanh cao giúp tăng giá trị bất động sản sinh thái tại khu vực.</p>
                   </CardContent>
                 </Card>
              </div>

           </div>
        </TabsContent>

        {/* 4. TAB: KINH TẾ VĨ MÔ */}
        <TabsContent value="macro">
           <Card className="shadow-sm border-0 ring-1 ring-slate-200">
             <CardHeader className="pb-0 border-b bg-slate-50/50 rounded-t-xl">
               <CardTitle className="text-lg text-slate-800">Tương quan Lãi Suất, GDP và FDI (Tín hiệu Vĩ mô)</CardTitle>
               <CardDescription>Báo cáo áp dụng cho toàn quốc, ảnh hưởng mạnh đến dòng vốn đầu tư khu vực.</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
               <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={MACRO_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                     <XAxis dataKey="quarter" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                     <YAxis yAxisId="left" tickFormatter={(val) => `${val}%`} stroke="#f43f5e" axisLine={false} tickLine={false} />
                     <YAxis yAxisId="right" orientation="right" tickFormatter={(val) => `${val}%`} stroke="#10b981" axisLine={false} tickLine={false} />
                     <Tooltip formatter={(value: any) => `${value}%`} contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                     <Legend wrapperStyle={{paddingTop: '20px'}} />
                     <Line yAxisId="left" type="monotone" dataKey="rate" name="Lãi suất vay" stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                     <Line yAxisId="right" type="monotone" dataKey="gdp" name="Tăng trưởng GDP" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                     <Line yAxisId="right" type="monotone" dataKey="fdi" name="Vốn FDI Giải ngân" stroke="#3b82f6" strokeWidth={3} strokeDasharray="5 5" dot={{r: 4}} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="mt-6 flex flex-col md:flex-row items-start gap-4 p-5 bg-emerald-50 border border-emerald-200 rounded-xl shadow-inner">
                  <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 text-lg mb-1 flex items-center gap-2">Cơ Hội Vàng Để Đầu Tư <ArrowRight className="h-4 w-4"/></h4>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      Lãi suất vay đang có xu hướng giảm mạnh từ đỉnh 7.5% xuống mức 5.8% (Q2/2026), đồng thời GDP duy trì đà phục hồi ấn tượng (7.1%). 
                      Đặc biệt, dòng vốn FDI giải ngân tăng vọt (9.0%) sẽ kéo theo lượng lớn chuyên gia nước ngoài, đẩy mạnh nhu cầu thuê nhà tại các khu vực như <strong>{REGIONS[region]}</strong>. 
                      Đây là thời điểm tuyệt vời nhất để chốt Sale trước khi mặt bằng giá mới được thiết lập.
                    </p>
                  </div>
               </div>
             </CardContent>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
