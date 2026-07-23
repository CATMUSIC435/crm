"use client"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeDollarSign, Wallet, FileText, Package, Megaphone, BrainCircuit, ArrowUpRight, ArrowDownRight, Building, Sparkles } from "lucide-react"
import { useStore } from '@/store/useStore'

const CASHFLOW_DATA = [
  { month: 'T1', in: 120, out: 85 },
  { month: 'T2', in: 145, out: 90 },
  { month: 'T3', in: 110, out: 95 },
  { month: 'T4', in: 180, out: 120 },
  { month: 'T5', in: 220, out: 130 },
  { month: 'T6', in: 250, out: 140 },
  { month: 'T7', in: 290, out: 160 },
]

const AI_FORECAST_DATA = [
  { month: 'Tháng 4', actual: 180, forecast: 180 },
  { month: 'Tháng 5', actual: 220, forecast: 220 },
  { month: 'Tháng 6', actual: 250, forecast: 250 },
  { month: 'Tháng 7', actual: 290, forecast: 290 },
  { month: 'Tháng 8 (Dự báo)', actual: null, forecast: 320 },
  { month: 'Tháng 9 (Dự báo)', actual: null, forecast: 380 },
  { month: 'Tháng 10 (Dự báo)', actual: null, forecast: 450 },
]

export default function DirectorDashboard() {
  const { contracts, inventory } = useStore();
  const totalRevenue = (contracts.reduce((sum, c) => sum + c.value, 0) / 1000000000).toFixed(1);
  const totalContracts = contracts.length;
  const totalInventory = inventory.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Director</h2>
        <p className="text-muted-foreground">Tổng quan tài chính, dòng tiền và AI dự báo doanh số.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-purple-100 bg-purple-50/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-purple-900">Tổng Doanh Thu (YTD)</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{totalRevenue} Tỷ ₫</div>
            <p className="text-xs font-bold text-green-600 mt-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> Tăng 24.5% so với cùng kỳ</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Dòng Tiền Thực Tế</CardTitle>
            <Wallet className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">+45.2 Tỷ ₫</div>
            <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/> An toàn tài chính mức A</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tổng Hợp Đồng Đã Ký</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{totalContracts}</div>
            <p className="text-xs text-slate-500 mt-1">Hợp đồng giao dịch thành công</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Tồn Kho (Giỏ Hàng)</CardTitle>
            <Building className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{totalInventory} SP</div>
            <p className="text-xs text-orange-600 font-bold mt-1 flex items-center"><ArrowDownRight className="h-3 w-3 mr-1"/> Tốc độ tiêu thụ: 15 căn/tuần</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 mt-2">
        {/* CASHFLOW CHART */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Dòng Tiền Thu Chi (Tỷ VNĐ)</CardTitle>
            <CardDescription>Biến động dòng tiền thực tế qua các tháng.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} cursor={{fill: 'transparent'}}/>
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                  <Bar dataKey="in" name="Thực Thu" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="out" name="Thực Chi" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI FORECAST CHART */}
        <Card className="shadow-sm border-indigo-100">
          <CardHeader className="bg-indigo-50/50 pb-4 border-b">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-indigo-600" />
              <CardTitle className="text-lg text-indigo-900">AI Dự Báo Doanh Số Quý Tới</CardTitle>
            </div>
            <CardDescription>Mô hình học máy dự báo xu hướng doanh thu dựa trên dữ liệu lịch sử và biến động thị trường (Đơn vị: Tỷ VNĐ).</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[285px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={AI_FORECAST_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                     <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                     </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                  <Area type="monotone" dataKey="actual" name="Doanh Thu Thực Tế" stroke="#3b82f6" strokeWidth={3} fillOpacity={0} />
                  <Area type="monotone" dataKey="forecast" name="AI Dự Báo (Tương Lai)" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorForecast)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
