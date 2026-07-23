"use client"
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Target, Activity, TrendingUp, DollarSign, Award, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from '@/store/useStore'

const REVENUE_DATA = [
  { month: 'T1', target: 50, actual: 45 },
  { month: 'T2', target: 50, actual: 52 },
  { month: 'T3', target: 60, actual: 58 },
  { month: 'T4', target: 60, actual: 70 },
  { month: 'T5', target: 70, actual: 85 },
  { month: 'T6', target: 70, actual: 95 },
  { month: 'T7', target: 80, actual: 110 },
]

const PROJECT_DISTRIBUTION = [
  { name: 'Vinhomes GP', value: 45, color: '#3b82f6' },
  { name: 'Aqua City', value: 25, color: '#f97316' },
  { name: 'Global City', value: 20, color: '#8b5cf6' },
  { name: 'Khác', value: 10, color: '#94a3b8' },
]

const TOP_SALES = [
  { id: 1, name: 'Nguyễn Văn A', avatar: 'NA', revenue: '45.5 Tỷ', conversion: '18.5%', deals: 12, trend: 'up' },
  { id: 2, name: 'Trần Thị B', avatar: 'TB', revenue: '32.0 Tỷ', conversion: '15.2%', deals: 8, trend: 'up' },
  { id: 3, name: 'Lê Văn C', avatar: 'LC', revenue: '28.4 Tỷ', conversion: '12.8%', deals: 7, trend: 'down' },
  { id: 4, name: 'Phạm Minh D', avatar: 'PD', revenue: '25.1 Tỷ', conversion: '14.0%', deals: 6, trend: 'up' },
  { id: 5, name: 'Hoàng Thị E', avatar: 'HE', revenue: '19.8 Tỷ', conversion: '11.5%', deals: 5, trend: 'down' },
  { id: 6, name: 'Đặng Tuấn F', avatar: 'DF', revenue: '15.2 Tỷ', conversion: '9.2%', deals: 4, trend: 'up' },
]

export default function ManagerDashboard() {
  const { customers, projects, contracts } = useStore();
  const totalCustomers = customers.length;
  const totalContracts = contracts.length;
  const conversionRate = totalCustomers > 0 ? ((totalContracts / totalCustomers) * 100).toFixed(1) : "0.0";
  const topProject = projects.length > 0 ? projects[0].name : "N/A";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Manager</h2>
        <p className="text-muted-foreground">Quản lý hiệu suất toàn đội, tỷ lệ chuyển đổi và các dự án top đầu.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-blue-100 bg-blue-50/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-blue-800">Doanh Thu Đội Bán Hàng</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">515 Tỷ</div>
            <p className="text-xs font-bold text-green-600 mt-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> Đạt 110% KPI Quý</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tỷ Lệ Chuyển Đổi</CardTitle>
            <Activity className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{conversionRate}%</div>
            <p className="text-xs font-bold text-green-600 mt-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> Cao hơn 4% so với T6</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Quy Mô Phễu (Funnel)</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{totalCustomers}</div>
            <p className="text-xs text-slate-500 mt-1">Khách hàng tiềm năng mới</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Dự Án Trọng Điểm</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{topProject}</div>
            <p className="text-xs text-slate-500 mt-1">Đóng góp 45% doanh số</p>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
         <Card className="lg:col-span-5 shadow-sm">
            <CardHeader className="pb-2">
               <CardTitle className="text-lg">Tăng Trưởng Doanh Thu (Tỷ VNĐ)</CardTitle>
               <CardDescription>So sánh doanh thu thực tế và chỉ tiêu KPI theo tháng.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                           <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                           </linearGradient>
                           <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                        <Area type="monotone" dataKey="target" name="Chỉ Tiêu KPI" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" />
                        <Area type="monotone" dataKey="actual" name="Thực Tế" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>
         <Card className="lg:col-span-2 shadow-sm flex flex-col">
            <CardHeader className="pb-2">
               <CardTitle className="text-lg">Cơ Cấu Dự Án</CardTitle>
               <CardDescription>Tỷ trọng doanh thu.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pb-6">
               <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie data={PROJECT_DISTRIBUTION} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                           {PROJECT_DISTRIBUTION.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} formatter={(value: any) => `${value}%`} />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
               <div className="w-full space-y-2 mt-4 px-4">
                  {PROJECT_DISTRIBUTION.map((item, i) => (
                     <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                           <div className="h-3 w-3 rounded-full" style={{backgroundColor: item.color}}></div>
                           <span className="text-slate-600 font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold">{item.value}%</span>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>

      {/* LEADERBOARD */}
      <Card className="shadow-sm">
         <CardHeader className="border-b">
            <CardTitle className="text-lg">Bảng Xếp Hạng Nhân Viên Xuất Sắc (Top Sales)</CardTitle>
            <CardDescription>Cập nhật theo thời gian thực dựa trên hợp đồng đã ký trong tháng này.</CardDescription>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <Table>
                  <TableHeader className="bg-slate-50">
                     <TableRow>
                        <TableHead className="w-16 text-center">Hạng</TableHead>
                        <TableHead>Nhân Viên (Agent)</TableHead>
                        <TableHead>Doanh Số (VNĐ)</TableHead>
                        <TableHead>Tỷ Lệ Chuyển Đổi</TableHead>
                        <TableHead className="text-center">Số Giao Dịch</TableHead>
                        <TableHead className="text-right">Xu Hướng</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {TOP_SALES.map((sale, index) => (
                        <TableRow key={sale.id} className="hover:bg-slate-50/50">
                           <TableCell className="text-center font-bold">
                              {index === 0 ? <span className="text-yellow-500 text-lg">🥇</span> : index === 1 ? <span className="text-slate-400 text-lg">🥈</span> : index === 2 ? <span className="text-amber-600 text-lg">🥉</span> : <span className="text-slate-500">{index + 1}</span>}
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-3">
                                 <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">{sale.avatar}</AvatarFallback>
                                 </Avatar>
                                 <div className="font-bold text-slate-800">{sale.name}</div>
                              </div>
                           </TableCell>
                           <TableCell>
                              <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 border-indigo-200">{sale.revenue}</Badge>
                           </TableCell>
                           <TableCell className="font-medium text-slate-600">{sale.conversion}</TableCell>
                           <TableCell className="text-center font-bold text-slate-700">{sale.deals}</TableCell>
                           <TableCell className="text-right">
                              {sale.trend === 'up' ? (
                                 <ArrowUpRight className="h-4 w-4 text-green-500 inline-block" />
                              ) : (
                                 <ArrowDownRight className="h-4 w-4 text-red-500 inline-block" />
                              )}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </CardContent>
         <CardFooter className="p-4 border-t bg-slate-50 justify-center">
            <Button variant="ghost" className="text-slate-500 text-sm">Xem toàn bộ bảng xếp hạng</Button>
         </CardFooter>
      </Card>
    </div>
  )
}
