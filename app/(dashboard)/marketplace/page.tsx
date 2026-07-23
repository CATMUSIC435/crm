"use client"
import React, { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Store, Handshake, Share2, Upload, Star, 
  MapPin, Building, Plus, Search, Filter,
  Phone, Mail, CheckCircle2, DollarSign,
  TrendingUp, Users, Activity, PieChart
} from 'lucide-react'

// MOCK DATA
const LISTINGS = [
  { id: 1, title: 'Penthouse Aqua City - Đảo Phượng Hoàng', price: '45 Tỷ', comm_split: '50/50', my_comm: '1.5%', type: 'Bán', location: 'Biên Hòa, Đồng Nai', owner: 'Tuấn Tú', avatar: 'TT', image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80' },
  { id: 2, title: 'Biệt thự Đơn Lập The Global City', price: '72 Tỷ', comm_split: '40/60', my_comm: '1.2%', type: 'Bán', location: 'Q2, TP.HCM', owner: 'Thanh Hằng', avatar: 'TH', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=400&q=80' },
  { id: 3, title: 'Shophouse Sala Đại Quang Minh', price: '120 Triệu/Tháng', comm_split: '50/50', my_comm: '0.5 Tháng', type: 'Cho Thuê', location: 'Q2, TP.HCM', owner: 'Văn Đạt', avatar: 'VD', image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=400&q=80' },
  { id: 4, title: 'Căn hộ 3PN Vinhomes Grand Park', price: '5.2 Tỷ', comm_split: 'Chỉ nhận khách', my_comm: '1.0%', type: 'Bán', location: 'Q9, TP.HCM', owner: 'Minh Khang', avatar: 'MK', image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80' },
  { id: 5, title: 'Nhà Phố Soho - The Global City', price: '42 Tỷ', comm_split: '30/70', my_comm: '1.0%', type: 'Bán', location: 'Q2, TP.HCM', owner: 'Bích Ngọc', avatar: 'BN', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=400&q=80' },
  { id: 6, title: 'Biệt Thự Đảo Ecopark', price: '85 Tỷ', comm_split: '50/50', my_comm: '1.2%', type: 'Bán', location: 'Văn Giang, Hưng Yên', owner: 'Tiến Đạt', avatar: 'TD', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80' },
  { id: 7, title: 'Căn hộ Duplex Masteri Thảo Điền', price: '18 Tỷ', comm_split: '50/50', my_comm: '1.5%', type: 'Bán', location: 'Q2, TP.HCM', owner: 'Hải Yến', avatar: 'HY', image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=400&q=80' },
  { id: 8, title: 'Toà Nhà VP - Nam Kỳ Khởi Nghĩa', price: '500 Tr/Tháng', comm_split: '50/50', my_comm: '0.5 Tháng', type: 'Cho Thuê', location: 'Q3, TP.HCM', owner: 'Hoàng Vũ', avatar: 'HV', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80' },
  { id: 9, title: 'Sky Villa Landmark 81', price: '120 Tỷ', comm_split: '60/40', my_comm: '2.0%', type: 'Bán', location: 'Bình Thạnh, TP.HCM', owner: 'Quốc Bảo', avatar: 'QB', image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80' },
  { id: 10, title: 'Mặt Bằng KD Nguyễn Trãi', price: '250 Tr/Tháng', comm_split: '50/50', my_comm: '0.5 Tháng', type: 'Cho Thuê', location: 'Q1, TP.HCM', owner: 'Tuấn Minh', avatar: 'TM', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80' },
  { id: 11, title: 'Villa Biển NovaWorld Hồ Tràm', price: '35 Tỷ', comm_split: '50/50', my_comm: '1.5%', type: 'Bán', location: 'Xuyên Mộc, BR-VT', owner: 'Ngọc Lan', avatar: 'NL', image: 'https://images.unsplash.com/photo-1613490908571-9ce224a1dc1b?auto=format&fit=crop&w=400&q=80' },
  { id: 12, title: 'Nhà Xưởng KCN Sóng Thần', price: '800 Tr/Tháng', comm_split: 'Chỉ nhận khách', my_comm: '0.5 Tháng', type: 'Cho Thuê', location: 'Dĩ An, Bình Dương', owner: 'Đức Huy', avatar: 'ĐH', image: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=400&q=80' },
]

const AGENCIES = [
  { id: 1, name: 'Sàn Giao Dịch BĐS Khải Hoàn', tier: 'F1 Partner', rating: 4.9, deals: 124, logo: 'KH' },
  { id: 2, name: 'Đại Lý Rever Đông Sài Gòn', tier: 'F2 Partner', rating: 4.8, deals: 85, logo: 'RV' },
  { id: 3, name: 'SmartLand', tier: 'F1 Partner', rating: 4.7, deals: 210, logo: 'SL' },
  { id: 4, name: 'Cộng đồng Môi Giới Tự Do (Freelancers)', tier: 'Cộng Tác Viên', rating: 4.2, deals: 45, logo: 'FL' },
  { id: 5, name: 'Propzy Việt Nam', tier: 'F1 Partner', rating: 4.6, deals: 320, logo: 'PZ' },
  { id: 6, name: 'IQI Việt Nam', tier: 'Global Partner', rating: 4.9, deals: 410, logo: 'IQ' },
  { id: 7, name: 'Đại Lý Cenland', tier: 'F1 Partner', rating: 4.5, deals: 180, logo: 'CL' },
  { id: 8, name: 'Hội Môi Giới Khu Đông', tier: 'Cộng Tác Viên', rating: 4.3, deals: 65, logo: 'KĐ' },
  { id: 9, name: 'ERA Vietnam', tier: 'Global Partner', rating: 4.8, deals: 350, logo: 'ER' },
  { id: 10, name: 'Phú Hoàng Land', tier: 'F2 Partner', rating: 4.4, deals: 110, logo: 'PH' },
  { id: 11, name: 'DatXanh Miền Nam', tier: 'F1 Partner', rating: 4.7, deals: 450, logo: 'DX' },
  { id: 12, name: 'Savills Vietnam', tier: 'Global Partner', rating: 5.0, deals: 500, logo: 'SV' },
]

const MARKET_STATS = [
  { month: 'T1', listings: 120, deals: 45, volume: 85 },
  { month: 'T2', listings: 150, deals: 55, volume: 110 },
  { month: 'T3', listings: 200, deals: 80, volume: 160 },
  { month: 'T4', listings: 280, deals: 110, volume: 215 },
  { month: 'T5', listings: 350, deals: 140, volume: 290 },
  { month: 'T6', listings: 420, deals: 180, volume: 380 },
  { month: 'T7', listings: 500, deals: 220, volume: 450 },
]

export default function MarketplacePage() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Store className="h-8 w-8 text-orange-600" />
            Chợ Liên Kết B2B (Co-brokering)
          </h1>
          <p className="text-slate-500 mt-1">Nền tảng chia sẻ giỏ hàng, kết nối nguồn hàng thứ cấp và hợp tác môi giới.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-300">
             <Share2 className="h-4 w-4 mr-2 text-blue-600" /> Chia sẻ Kho Hàng
          </Button>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
             <Plus className="h-4 w-4 mr-2" /> Đăng Nguồn Hàng
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:w-[600px] h-auto md:h-10 mb-6 gap-2 md:gap-0">
          <TabsTrigger value="analytics" className="flex items-center gap-2"><PieChart className="h-4 w-4"/> Phân Tích & Thống Kê</TabsTrigger>
          <TabsTrigger value="listings" className="flex items-center gap-2"><Building className="h-4 w-4"/> Rổ Hàng Hợp Tác</TabsTrigger>
          <TabsTrigger value="agencies" className="flex items-center gap-2"><Handshake className="h-4 w-4"/> Mạng Lưới Đại Lý</TabsTrigger>
        </TabsList>

        {/* 0. TAB: PHÂN TÍCH & THỐNG KÊ */}
        <TabsContent value="analytics" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="shadow-sm border-slate-200">
                 <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium">
                       <Store className="h-4 w-4 text-orange-500" /> Tổng Sản Phẩm
                    </div>
                    <div className="text-3xl font-black text-slate-800">1,245</div>
                    <div className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> +15% so với tháng trước</div>
                 </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200">
                 <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium">
                       <Activity className="h-4 w-4 text-blue-500" /> Giao Dịch Chéo
                    </div>
                    <div className="text-3xl font-black text-slate-800">420</div>
                    <div className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> +8% so với tháng trước</div>
                 </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200">
                 <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium">
                       <Users className="h-4 w-4 text-purple-500" /> Môi Giới Tham Gia
                    </div>
                    <div className="text-3xl font-black text-slate-800">3,850</div>
                    <div className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> +210 thành viên mới</div>
                 </CardContent>
              </Card>
              <Card className="shadow-sm border-slate-200">
                 <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-slate-500 mb-2 font-medium">
                       <DollarSign className="h-4 w-4 text-green-500" /> Tổng GMV (Tỷ VNĐ)
                    </div>
                    <div className="text-3xl font-black text-slate-800">4,520</div>
                    <div className="text-xs font-bold text-green-500 mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3"/> +22% so với tháng trước</div>
                 </CardContent>
              </Card>
           </div>
           
           <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2 border-b">
                 <CardTitle className="text-lg">Tăng Trưởng Chợ Liên Kết (YTD)</CardTitle>
                 <CardDescription>Số lượng sản phẩm đăng bán và GMV giao dịch thành công (đơn vị: Tỷ VNĐ).</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={MARKET_STATS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                             <linearGradient id="colorListings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                             </linearGradient>
                             <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="left" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                          <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Area yAxisId="left" type="monotone" dataKey="listings" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorListings)" name="Sản Phẩm Mới" />
                          <Area yAxisId="right" type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" name="GMV (Tỷ VNĐ)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        {/* 1. TAB: RỔ HÀNG HỢP TÁC */}
        <TabsContent value="listings" className="space-y-6">
           
           {/* Filters */}
           <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                 <Input placeholder="Tìm kiếm dự án, khu vực, tên môi giới..." className="pl-9 h-10 bg-white" />
              </div>
              <Button variant="outline" className="bg-white"><Filter className="h-4 w-4 mr-2"/> Lọc (Quận, Giá, % Hoa Hồng)</Button>
           </div>

           {/* Grid Listings */}
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {LISTINGS.map(item => (
                 <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all group flex flex-col">
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                       <div className="absolute top-2 left-2 flex gap-1">
                          <Badge className="bg-black/60 backdrop-blur text-white border-none">{item.type}</Badge>
                       </div>
                       <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                          <h3 className="text-white font-bold text-lg line-clamp-1">{item.title}</h3>
                          <div className="flex items-center gap-1 text-slate-300 text-xs mt-1">
                             <MapPin className="h-3 w-3" /> {item.location}
                          </div>
                       </div>
                    </div>
                    
                    <CardContent className="p-4 flex-1 flex flex-col">
                       <div className="flex justify-between items-center mb-4">
                          <div className="text-xl font-black text-rose-600">{item.price}</div>
                       </div>
                       
                       {/* Commission Alert Box */}
                       <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                          <div className="text-xs text-orange-600 font-bold uppercase mb-1 flex items-center gap-1">
                             <DollarSign className="h-3 w-3" /> Chính sách chia sẻ
                          </div>
                          <div className="flex justify-between items-end">
                             <div className="text-sm text-slate-700">Tỉ lệ: <strong>{item.comm_split}</strong></div>
                             <div className="text-right">
                                <span className="text-[10px] text-slate-500 block">Thực nhận (F2)</span>
                                <span className="font-black text-orange-600">{item.my_comm}</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                             <Avatar className="h-8 w-8">
                               <AvatarFallback className="bg-slate-200 text-xs">{item.avatar}</AvatarFallback>
                             </Avatar>
                             <div>
                                <div className="text-xs font-bold text-slate-800">{item.owner}</div>
                                <div className="text-[10px] text-slate-500 flex items-center"><CheckCircle2 className="h-3 w-3 text-green-500 mr-0.5"/> Đã xác thực</div>
                             </div>
                          </div>
                          <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8">Nhận Bán Chéo</Button>
                       </div>
                    </CardContent>
                 </Card>
              ))}
           </div>
        </TabsContent>

        {/* 2. TAB: MẠNG LƯỚI ĐẠI LÝ */}
        <TabsContent value="agencies" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AGENCIES.map(agency => (
                 <Card key={agency.id} className="hover:border-orange-300 transition-colors">
                    <CardContent className="p-4 md:p-6">
                       <div className="flex items-start gap-4">
                          <div className="h-16 w-16 bg-slate-100 border rounded-xl flex items-center justify-center font-black text-xl text-slate-400 shrink-0">
                             {agency.logo}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-lg text-slate-800">{agency.name}</h3>
                                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">{agency.tier}</Badge>
                             </div>
                             
                             <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                <div className="flex items-center gap-1 text-amber-500 font-bold">
                                   <Star className="h-4 w-4 fill-amber-500" /> {agency.rating}
                                </div>
                                <div>•</div>
                                <div><strong>{agency.deals}</strong> Giao dịch thành công</div>
                             </div>

                             <div className="flex flex-col sm:flex-row gap-2">
                                <Button size="sm" variant="outline" className="flex-1 border-slate-300"><Phone className="h-4 w-4 mr-2"/> Gọi ĐT</Button>
                                <Button size="sm" variant="outline" className="flex-1 border-slate-300"><Mail className="h-4 w-4 mr-2"/> Nhắn Tin</Button>
                                <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"><Handshake className="h-4 w-4 mr-2"/> Gửi Lời Mời</Button>
                             </div>
                          </div>
                       </div>
                    </CardContent>
                 </Card>
              ))}
           </div>
           
           {/* Banner Đăng ký F2 */}
           <div className="mt-8 bg-gradient-to-r from-orange-900 to-rose-900 rounded-2xl p-4 md:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
              <div>
                 <h2 className="text-2xl font-bold mb-2">Bạn có Nguồn hàng độc quyền?</h2>
                 <p className="text-orange-200">Trở thành Đối tác chiến lược (F1 Partner) của chúng tôi để chia sẻ kho hàng lên nền tảng CRM và tiếp cận 1000+ Môi giới đang sẵn sàng bán hàng cho bạn.</p>
              </div>
              <Button size="lg" className="bg-white text-orange-900 hover:bg-slate-100 shrink-0 shadow-lg font-bold">Đăng Ký Trở Thành F1</Button>
           </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
