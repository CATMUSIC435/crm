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
  Briefcase, Activity, BarChart3, PieChart as PieChartIcon
} from 'lucide-react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend
} from 'recharts'

// Mock Data
const PRICE_TREND_DATA = [
  { year: '2021', price: 65, volume: 120 },
  { year: '2022', price: 72, volume: 145 },
  { year: '2023', price: 70, volume: 90 }, // Thị trường chững lại
  { year: '2024', price: 85, volume: 160 }, // Khởi sắc
  { year: '2025', price: 105, volume: 210 }, // Đỉnh cao
  { year: '2026', price: 120, volume: 180 },
]

const AMENITIES_RADAR = [
  { subject: 'Giáo Dục', A: 90, fullMark: 100 },
  { subject: 'Y Tế', A: 85, fullMark: 100 },
  { subject: 'Mua Sắm', A: 95, fullMark: 100 },
  { subject: 'Giao Thông', A: 70, fullMark: 100 },
  { subject: 'Cây Xanh', A: 80, fullMark: 100 },
  { subject: 'An Ninh', A: 85, fullMark: 100 },
]

const MACRO_DATA = [
  { quarter: 'Q1/25', rate: 7.5, gdp: 5.2 },
  { quarter: 'Q2/25', rate: 7.2, gdp: 5.8 },
  { quarter: 'Q3/25', rate: 6.8, gdp: 6.1 },
  { quarter: 'Q4/25', rate: 6.5, gdp: 6.5 },
  { quarter: 'Q1/26', rate: 6.0, gdp: 6.8 }, // Lãi suất giảm, GDP tăng -> Tốt cho BĐS
  { quarter: 'Q2/26', rate: 5.8, gdp: 7.1 },
]

export default function MarketDataPage() {
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
           <select className="bg-transparent border-none text-white focus:ring-0 text-sm font-medium cursor-pointer w-[200px] outline-none">
             <option>Thành phố Thủ Đức (Q2, Q9)</option>
             <option>Quận 7, Nam Sài Gòn</option>
             <option>Khu vực vệ tinh (Đồng Nai)</option>
           </select>
           <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6">Phân Tích</Button>
        </div>
      </div>

      <Tabs defaultValue="price" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
          <TabsTrigger value="price" className="flex items-center gap-2"><TrendingUp className="h-4 w-4"/> Biến Động Giá</TabsTrigger>
          <TabsTrigger value="infra" className="flex items-center gap-2"><HardHat className="h-4 w-4"/> Quy Hoạch Hạ Tầng</TabsTrigger>
          <TabsTrigger value="demo" className="flex items-center gap-2"><PieChartIcon className="h-4 w-4"/> Tiện Ích & Dân Cư</TabsTrigger>
          <TabsTrigger value="macro" className="flex items-center gap-2"><Activity className="h-4 w-4"/> Vĩ Mô & Kinh Tế</TabsTrigger>
        </TabsList>

        {/* 1. TAB: GIÁ & GIAO DỊCH */}
        <TabsContent value="price" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
             <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-100">
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-1">Giá Trung Bình (Căn Hộ)</div>
                 <div className="text-3xl font-bold text-cyan-700">120 <span className="text-sm font-normal text-slate-500">Tr/m²</span></div>
                 <Badge className="mt-2 bg-green-500"><TrendingUp className="h-3 w-3 mr-1"/> +15% so với 2025</Badge>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-1">Thanh Khoản (Giao Dịch/Tháng)</div>
                 <div className="text-3xl font-bold text-slate-800">180 <span className="text-sm font-normal text-slate-500">Căn</span></div>
                 <Badge variant="outline" className="mt-2 text-red-500 border-red-200 bg-red-50">-14% (Dấu hiệu tạo đỉnh)</Badge>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-1">Tỷ Suất Cho Thuê (Rental Yield)</div>
                 <div className="text-3xl font-bold text-slate-800">4.5 <span className="text-sm font-normal text-slate-500">% / Năm</span></div>
                 <Badge variant="secondary" className="mt-2 text-slate-500">Ổn định</Badge>
               </CardContent>
             </Card>
           </div>

           <Card className="shadow-sm">
             <CardHeader className="pb-0 border-b">
               <CardTitle className="text-lg">Biểu Đồ Tăng Trưởng Giá vs Khối Lượng Giao Dịch (2021-2026)</CardTitle>
               <CardDescription>Cơ sở dữ liệu giá (Đơn vị: Triệu VNĐ/m²)</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
               <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={PRICE_TREND_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="year" />
                     {/* 2 Y-Axis for Price and Volume */}
                     <YAxis yAxisId="left" orientation="left" stroke="#06b6d4" />
                     <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                     <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                     <Legend />
                     <Area yAxisId="left" type="monotone" dataKey="price" name="Giá (Tr/m²)" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                     <Bar yAxisId="right" dataKey="volume" name="Khối lượng (Căn)" fill="#e2e8f0" barSize={30} radius={[4, 4, 0, 0]} />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
               <div className="mt-4 p-4 bg-slate-50 border rounded-lg text-sm text-slate-600">
                  <strong>AI Nhận Định:</strong> Giá khu vực Thủ Đức liên tục phá đỉnh từ 2024 nhờ lực đẩy từ hạ tầng Vành đai 3. Tuy nhiên, khối lượng giao dịch năm 2026 đang có dấu hiệu chững lại, cho thấy thị trường đang thiết lập mặt bằng giá mới, kén người mua hơn.
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* 2. TAB: QUY HOẠCH HẠ TẦNG */}
        <TabsContent value="infra" className="space-y-6">
           <Card className="shadow-sm overflow-hidden">
             {/* Map Placeholder */}
             <div className="h-[300px] bg-slate-200 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <div className="text-center z-10">
                   <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                   <h3 className="font-bold text-slate-700 text-lg">Bản Đồ Quy Hoạch GIS</h3>
                   <p className="text-sm text-slate-500">Tích hợp dữ liệu quy hoạch sử dụng đất (Quy hoạch 1/500)</p>
                </div>
             </div>
             
             <CardContent className="p-0">
               <div className="divide-y">
                 
                 <div className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="flex-1">
                         <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-red-500">Trọng Điểm</Badge>
                            <h4 className="font-bold text-slate-800 text-lg">Tuyến Metro Số 1 (Bến Thành - Suối Tiên)</h4>
                         </div>
                         <p className="text-sm text-slate-600 mb-4">Kết nối trực tiếp vào các dự án dọc Xa lộ Hà Nội. Dự kiến khai thác thương mại vào Quý 4/2026. Sẽ tạo cú hích tăng giá từ 5-10% cho các dự án bán kính 1km.</p>
                         <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                           <span>Tiến độ thi công:</span>
                           <span className="text-green-600">98% (Hoàn thiện nội thất)</span>
                         </div>
                         <Progress value={98} className="h-2 bg-slate-200" />
                       </div>
                       <div className="w-full md:w-[200px] bg-green-50 rounded-xl border border-green-100 p-4 text-center flex flex-col justify-center">
                          <div className="text-xs text-green-700 font-bold uppercase mb-1">Mức độ tác động</div>
                          <div className="text-3xl font-black text-green-600">Rất Lớn</div>
                       </div>
                    </div>
                 </div>

                 <div className="p-4 md:p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="flex-1">
                         <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-slate-800 text-lg">Đường Vành Đai 3 - Đoạn TP.Thủ Đức</h4>
                         </div>
                         <p className="text-sm text-slate-600 mb-4">Giao cắt với cao tốc Long Thành - Dầu Giây. Hút lượng lớn cư dân từ nội thành di chuyển ra vùng ven, giảm ùn tắc giao thông cục bộ.</p>
                         <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
                           <span>Tiến độ thi công:</span>
                           <span className="text-amber-600">45% (Đang giải phóng mặt bằng)</span>
                         </div>
                         <Progress value={45} className="h-2 bg-slate-200" />
                       </div>
                       <div className="w-full md:w-[200px] bg-amber-50 rounded-xl border border-amber-100 p-4 text-center flex flex-col justify-center">
                          <div className="text-xs text-amber-700 font-bold uppercase mb-1">Mức độ tác động</div>
                          <div className="text-3xl font-black text-amber-600">Trung Bình</div>
                       </div>
                    </div>
                 </div>

               </div>
             </CardContent>
           </Card>
        </TabsContent>

        {/* 3. TAB: DÂN CƯ & TIỆN ÍCH */}
        <TabsContent value="demo" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Chấm Điểm Hệ Sinh Thái (Radar Score)</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center min-h-[350px]">
                   <div className="h-[300px] w-[100%] max-w-[400px]">
                     <ResponsiveContainer width="100%" height="100%">
                       <RadarChart cx="50%" cy="50%" outerRadius="70%" data={AMENITIES_RADAR}>
                         <PolarGrid />
                         <PolarAngleAxis dataKey="subject" tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                         <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                         <Radar name="Khu Vực 2" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                         <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                       </RadarChart>
                     </ResponsiveContainer>
                   </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                 <Card className="shadow-sm">
                   <CardHeader className="pb-3 border-b">
                     <CardTitle className="text-base flex items-center gap-2"><GraduationCap className="h-5 w-5 text-blue-500"/> Cơ Sở Giáo Dục Nổi Bật</CardTitle>
                   </CardHeader>
                   <CardContent className="pt-4 space-y-4 text-sm text-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Trường Quốc tế TAS</span>
                        <span className="text-slate-400">Cách 2.5km</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Đại học Fulbright VN</span>
                        <span className="text-slate-400">Cách 4.0km</span>
                      </div>
                   </CardContent>
                 </Card>

                 <Card className="shadow-sm">
                   <CardHeader className="pb-3 border-b">
                     <CardTitle className="text-base flex items-center gap-2"><Stethoscope className="h-5 w-5 text-red-500"/> Cơ Sở Y Tế Tuyến Đầu</CardTitle>
                   </CardHeader>
                   <CardContent className="pt-4 space-y-4 text-sm text-slate-700">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Bệnh viện Quốc tế AIH</span>
                        <span className="text-slate-400">Cách 1.2km</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Bệnh viện Lê Văn Thịnh</span>
                        <span className="text-slate-400">Cách 3.5km</span>
                      </div>
                   </CardContent>
                 </Card>
              </div>

           </div>
        </TabsContent>

        {/* 4. TAB: KINH TẾ VĨ MÔ */}
        <TabsContent value="macro">
           <Card className="shadow-sm">
             <CardHeader className="pb-0 border-b">
               <CardTitle className="text-lg">Tương quan Lãi Suất Vay và Tăng Trưởng GDP (Tín hiệu Mua)</CardTitle>
               <CardDescription>Lãi suất giảm thường kích thích dòng tiền chảy vào Bất động sản.</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
               <div className="h-[400px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={MACRO_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                     <XAxis dataKey="quarter" />
                     <YAxis yAxisId="left" tickFormatter={(val) => `${val}%`} stroke="#f43f5e" />
                     <YAxis yAxisId="right" orientation="right" tickFormatter={(val) => `${val}%`} stroke="#10b981" />
                     <Tooltip formatter={(value: any) => `${value}%`} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                     <Legend />
                     <Line yAxisId="left" type="monotone" dataKey="rate" name="Lãi suất vay (Trung bình)" stroke="#f43f5e" strokeWidth={3} dot={{r: 4}} />
                     <Line yAxisId="right" type="monotone" dataKey="gdp" name="Tăng trưởng GDP" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
               
               <div className="mt-6 flex flex-col md:flex-row items-start gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 mb-1">Cơ Hội Vàng Để Đầu Tư</h4>
                    <p className="text-sm text-emerald-700">Lãi suất vay đang có xu hướng giảm mạnh từ đỉnh 7.5% xuống mức 5.8% (Q2/2026), đồng thời GDP duy trì đà phục hồi ấn tượng (7.1%). Đây là thời điểm tuyệt vời nhất để tư vấn khách hàng sử dụng đòn bẩy tài chính mua nhà dự án trước khi mặt bằng giá mới được thiết lập.</p>
                  </div>
               </div>
             </CardContent>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
