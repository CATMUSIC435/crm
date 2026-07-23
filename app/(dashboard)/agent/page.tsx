"use client"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, CircleDashed, TrendingUp, DollarSign, Users, Briefcase, Phone, Mail, Calendar, ArrowRight, Target, Clock } from "lucide-react"
import { useStore } from '@/store/useStore'

const PERFORMANCE_DATA = [
  { name: 'T2', kpi: 200, actual: 150 },
  { name: 'T3', kpi: 200, actual: 280 },
  { name: 'T4', kpi: 200, actual: 180 },
  { name: 'T5', kpi: 200, actual: 350 },
  { name: 'T6', kpi: 200, actual: 420 },
  { name: 'T7', kpi: 200, actual: 500 },
  { name: 'CN', kpi: 200, actual: 100 },
]

const LEADS = [
  { id: 1, name: 'Trần Văn Mạnh', phone: '0988.xxx.123', interest: 'Biệt thự Aqua City', score: 95, status: 'Nóng' },
  { id: 2, name: 'Lê Minh Yến', phone: '0901.xxx.456', interest: 'CH Vinhomes Q9', score: 85, status: 'Ấm' },
  { id: 3, name: 'Đặng Tuấn Tài', phone: '0933.xxx.789', interest: 'Shophouse Global', score: 90, status: 'Nóng' },
  { id: 4, name: 'Hoàng Quốc Bảo', phone: '0912.xxx.222', interest: 'Nhà Phố Soho', score: 92, status: 'Nóng' },
]

export default function AgentDashboard() {
  const { contracts, customers } = useStore();
  const personalRevenue = contracts.reduce((sum, c) => sum + c.value, 0);
  const commission = personalRevenue * 0.03; // 3% commission
  const totalCustomers = customers.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
           <Avatar className="h-16 w-16 border-2 border-indigo-100">
              <AvatarImage src="https://i.pravatar.cc/150?img=11" />
              <AvatarFallback>TT</AvatarFallback>
           </Avatar>
           <div>
             <h1 className="text-2xl font-bold tracking-tight text-slate-800">Xin chào, Tuấn Tú 👋</h1>
             <p className="text-slate-500">Chuyên viên tư vấn • Phòng Kinh Doanh 1</p>
           </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
              <Calendar className="h-4 w-4 mr-2" /> Điểm danh (Check-in)
           </Button>
           <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Target className="h-4 w-4 mr-2" /> Đăng ký KPI Tháng
           </Button>
        </div>
      </div>

      <Tabs defaultValue="day" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="day">Hôm nay</TabsTrigger>
          <TabsTrigger value="week">Tuần này</TabsTrigger>
          <TabsTrigger value="month">Tháng này</TabsTrigger>
        </TabsList>
        <TabsContent value="day" className="space-y-6">
          
          {/* KPI Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh Số</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personalRevenue.toLocaleString('vi-VN')} ₫</div>
                <p className="text-xs text-muted-foreground">+20% so với hôm qua</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoa Hồng (Dự kiến)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{commission.toLocaleString('vi-VN')} ₫</div>
                <p className="text-xs text-muted-foreground">Tạm tính (3%)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khách Cần Chăm Sóc</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers} Khách</div>
                <p className="text-xs text-muted-foreground">Theo danh sách phụ trách</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lịch Hẹn Hôm Nay</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4 Lịch</div>
                <p className="text-xs text-muted-foreground">Sắp tới: 14:00 - Xem nhà mẫu</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 xl:grid-cols-12">
            
            {/* CỘT TRÁI (8/12) */}
            <div className="xl:col-span-8 flex flex-col gap-4">
               {/* Chart */}
               <Card className="shadow-sm">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-lg">Tiến Độ Đạt KPI Trong Tuần</CardTitle>
                   <CardDescription>Doanh số thực tế so với chỉ tiêu KPI hàng ngày (Triệu VNĐ).</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="h-[300px] w-full mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                         <XAxis dataKey="name" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                         <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                         <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: 'transparent'}}/>
                         <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                         <Bar dataKey="kpi" name="Chỉ Tiêu KPI" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={20} />
                         <Bar dataKey="actual" name="Thực Tế" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={20} />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
               </Card>

               {/* Top Leads */}
               <Card className="shadow-sm">
                 <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                   <div>
                     <CardTitle className="text-lg">Khách Hàng Tiềm Năng Bậc Cao</CardTitle>
                     <CardDescription>Danh sách ưu tiên cần chăm sóc gấp hôm nay.</CardDescription>
                   </div>
                   <Button variant="ghost" size="sm" className="text-indigo-600">Xem tất cả <ArrowRight className="h-4 w-4 ml-1"/></Button>
                 </CardHeader>
                 <CardContent className="p-0">
                   <div className="divide-y divide-slate-100">
                     {LEADS.map(lead => (
                        <div key={lead.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-4">
                           <div className="flex items-center gap-4">
                              <Avatar className="h-10 w-10">
                                 <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">{lead.name.substring(0, 1)}</AvatarFallback>
                              </Avatar>
                              <div>
                                 <div className="font-bold text-slate-800 flex items-center gap-2">
                                    {lead.name}
                                    <Badge className={lead.status === 'Nóng' ? 'bg-red-100 text-red-700 hover:bg-red-100 border-none' : 'bg-orange-100 text-orange-700 hover:bg-orange-100 border-none'}>{lead.status}</Badge>
                                 </div>
                                 <div className="text-xs text-slate-500">Quan tâm: {lead.interest}</div>
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="text-center hidden sm:block">
                                 <div className="text-xs text-slate-400 font-bold uppercase tracking-wide">Điểm Nhiệt</div>
                                 <div className="font-black text-indigo-600">{lead.score} / 100</div>
                              </div>
                              <div className="flex gap-2">
                                 <Button size="icon" variant="outline" className="rounded-full h-8 w-8 text-green-600 border-green-200 hover:bg-green-50"><Phone className="h-4 w-4"/></Button>
                                 <Button size="icon" variant="outline" className="rounded-full h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"><Mail className="h-4 w-4"/></Button>
                              </div>
                           </div>
                        </div>
                     ))}
                   </div>
                 </CardContent>
               </Card>
            </div>

            {/* CỘT PHẢI (4/12) */}
            <div className="xl:col-span-4 flex flex-col gap-4">
               {/* Tasks */}
               <Card className="shadow-sm border-indigo-100 bg-indigo-50/30">
                 <CardHeader className="pb-2">
                   <CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-indigo-600"/> Cần Hoàn Thành</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <div className="space-y-3">
                     <div className="flex items-start gap-3 rounded-lg bg-white border p-3 shadow-sm">
                       <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                       <div>
                         <p className="font-bold text-sm line-through text-slate-400">Gọi điện cho anh Tuấn - Dự án Vinhomes</p>
                         <p className="text-xs text-slate-400">Hoàn thành lúc 09:30 AM</p>
                       </div>
                     </div>
                     <div className="flex items-start gap-3 rounded-lg bg-white border p-3 shadow-sm border-indigo-200">
                       <CircleDashed className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                       <div>
                         <p className="font-bold text-sm text-slate-800">Gửi báo giá chi tiết cho chị Lan</p>
                         <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1"><Clock className="h-3 w-3"/> Deadline: 14:00 PM</p>
                       </div>
                     </div>
                     <div className="flex items-start gap-3 rounded-lg bg-white border p-3 shadow-sm">
                       <CircleDashed className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                       <div>
                         <p className="font-bold text-sm text-slate-800">Dẫn khách Trần Văn Mạnh xem nhà mẫu</p>
                         <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="h-3 w-3"/> Deadline: 16:00 PM</p>
                       </div>
                     </div>
                     <div className="flex items-start gap-3 rounded-lg bg-white border p-3 shadow-sm">
                       <CircleDashed className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                       <div>
                         <p className="font-bold text-sm text-slate-800">Cập nhật hồ sơ vay vốn Ngân hàng cho KH</p>
                         <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="h-3 w-3"/> Deadline: 18:00 PM</p>
                       </div>
                     </div>
                   </div>
                   <Button className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">Xem Tất Cả Nhiệm Vụ</Button>
                 </CardContent>
               </Card>

               {/* Calendar Summary */}
               <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                     <CardTitle className="text-lg flex items-center gap-2"><Calendar className="h-5 w-5 text-slate-600"/> Lịch Hẹn Tuần Này</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center p-2 rounded bg-slate-50">
                           <div className="font-bold text-sm">T.Hai (19/07)</div>
                           <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">2 Lịch hẹn</Badge>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded hover:bg-slate-50">
                           <div className="font-bold text-sm">T.Ba (20/07)</div>
                           <div className="text-sm text-slate-400">Trống</div>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded hover:bg-slate-50">
                           <div className="font-bold text-sm">T.Tư (21/07)</div>
                           <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">1 Cuộc họp</Badge>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
