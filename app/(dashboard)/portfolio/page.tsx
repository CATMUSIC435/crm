"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts'
import { Wallet, TrendingUp, DollarSign, Percent, ArrowUpRight, Briefcase } from "lucide-react"
import { useStore } from '@/store/useStore'

// Mock Data
const PORTFOLIO_DATA = [
  { id: "AQC-S1-12A", project: "Aqua City", type: "Nhà phố", buyPrice: 12.5, currentPrice: 15.2, rentYearly: 0.48, taxYearly: 0.05, roi: "21.6%", cagr: "10.2%" },
  { id: "VHM-L81-45", project: "Landmark 81", type: "Căn hộ", buyPrice: 8.2, currentPrice: 9.5, rentYearly: 0.36, taxYearly: 0.04, roi: "15.8%", cagr: "7.6%" },
  { id: "TGC-SH-05", project: "The Global City", type: "Shophouse", buyPrice: 35.0, currentPrice: 42.0, rentYearly: 1.2, taxYearly: 0.15, roi: "20.0%", cagr: "9.5%" },
]

const ASSET_GROWTH_DATA = [
  { year: '2020', value: 25.0, invested: 25.0 },
  { year: '2021', value: 28.5, invested: 25.0 },
  { year: '2022', value: 33.2, invested: 33.2 }, // Bought new property
  { year: '2023', value: 45.0, invested: 45.0 }, // Bought another
  { year: '2024', value: 55.7, invested: 55.7 },
  { year: '2025', value: 66.7, invested: 55.7 }, // Current Value
]

const CASHFLOW_DATA = [
  { year: '2020', rent: 0.5, tax: 0.05 },
  { year: '2021', rent: 0.6, tax: 0.06 },
  { year: '2022', rent: 0.8, tax: 0.08 },
  { year: '2023', rent: 1.2, tax: 0.12 },
  { year: '2024', rent: 1.8, tax: 0.18 },
  { year: '2025', rent: 2.04, tax: 0.24 },
]

export default function PortfolioPage() {
  const { contracts } = useStore();
  const totalInvestment = contracts.reduce((sum, c) => sum + c.value, 0) / 1000000000;
  const currentValuation = totalInvestment * 1.197;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Gia Sản (Wealth Management)</h1>
          <p className="text-muted-foreground mt-1">Phân tích hiệu quả đầu tư và dòng tiền danh mục Bất động sản.</p>
        </div>
        <Badge className="bg-amber-500 hover:bg-amber-600 px-4 py-1.5 text-sm uppercase tracking-wider text-white border-none shadow-sm">VIP Investor Mode</Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-indigo-100 font-medium">Tổng Vốn Đầu Tư</span>
              <Wallet className="h-5 w-5 text-indigo-200" />
            </div>
            <div className="text-3xl font-bold">{totalInvestment.toFixed(1)} Tỷ</div>
            <p className="text-sm text-indigo-200 mt-1 flex items-center gap-1">
              Giá gốc mua vào
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-emerald-100 font-medium">Định Giá Hiện Tại</span>
              <TrendingUp className="h-5 w-5 text-emerald-200" />
            </div>
            <div className="text-3xl font-bold">{currentValuation.toFixed(1)} Tỷ</div>
            <p className="text-sm text-emerald-100 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4" /> +19.7% ({(currentValuation - totalInvestment).toFixed(1)} Tỷ lãi vốn)
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-amber-100 font-medium">Dòng Tiền Thuê (Năm)</span>
              <DollarSign className="h-5 w-5 text-amber-200" />
            </div>
            <div className="text-3xl font-bold">2.04 Tỷ</div>
            <p className="text-sm text-amber-100 mt-1 flex items-center gap-1">
              Sau khi trừ 240Tr thuế phí
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-purple-100 font-medium">NPV & IRR</span>
              <Percent className="h-5 w-5 text-purple-200" />
            </div>
            <div className="text-3xl font-bold">14.2%</div>
            <p className="text-sm text-purple-100 mt-1 flex items-center gap-1">
              IRR trung bình toàn danh mục
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
           <CardHeader>
             <CardTitle>Tăng Trưởng Giá Trị Tài Sản (Asset Value)</CardTitle>
             <CardDescription>So sánh giữa Vốn đầu tư (Invested) và Giá trị thị trường (Market Value)</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={ASSET_GROWTH_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                     </linearGradient>
                     <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                   <XAxis dataKey="year" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}T`} />
                   <Tooltip formatter={(value: any) => [`${value} Tỷ VNĐ`, '']} labelClassName="text-black font-bold" />
                   <Legend />
                   <Area type="monotone" dataKey="value" name="Giá trị Thị trường" stroke="#10b981" fillOpacity={1} fill="url(#colorValue)" />
                   <Area type="monotone" dataKey="invested" name="Vốn Đầu Tư" stroke="#6366f1" fillOpacity={1} fill="url(#colorInvested)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </CardContent>
         </Card>

         <Card>
           <CardHeader>
             <CardTitle>Phân Tích Dòng Tiền Thuê (Cash Flow)</CardTitle>
             <CardDescription>Doanh thu cho thuê gộp (Gross Rent) và Thuế phí (Taxes)</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={CASHFLOW_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                   <XAxis dataKey="year" axisLine={false} tickLine={false} />
                   <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}T`} />
                   <Tooltip formatter={(value: any) => [`${value} Tỷ VNĐ`, '']} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
                   <Legend />
                   <Bar dataKey="rent" name="Doanh thu Thuê" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                   <Bar dataKey="tax" name="Thuế phí" fill="#ef4444" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
             </div>
           </CardContent>
         </Card>
      </div>

      {/* Portfolio Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Danh Mục Bất Động Sản (Properties)</CardTitle>
              <CardDescription>Chi tiết hiệu quả đầu tư từng tài sản độc lập.</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm font-normal text-muted-foreground"><Briefcase className="h-4 w-4 mr-1"/> 3 Tài sản</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã / Dự Án</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead className="text-right">Giá Mua</TableHead>
                  <TableHead className="text-right">Giá Hiện Tại</TableHead>
                  <TableHead className="text-right">Biến động (Capital Gain)</TableHead>
                  <TableHead className="text-right">Dòng tiền Thuê (Năm)</TableHead>
                  <TableHead className="text-right">Thuế (Năm)</TableHead>
                  <TableHead className="text-right font-bold text-indigo-600 dark:text-indigo-400">ROI Tổng</TableHead>
                  <TableHead className="text-right font-bold text-green-600 dark:text-green-400">CAGR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PORTFOLIO_DATA.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-semibold text-base">{item.id}</div>
                      <div className="text-xs text-muted-foreground">{item.project}</div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{item.type}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{item.buyPrice.toFixed(1)} Tỷ</TableCell>
                    <TableCell className="text-right font-bold text-emerald-600 dark:text-emerald-400">{item.currentPrice.toFixed(1)} Tỷ</TableCell>
                    <TableCell className="text-right text-emerald-500 text-sm">
                      <div className="flex items-center justify-end gap-1">
                        <ArrowUpRight className="h-3 w-3" /> 
                        {((item.currentPrice - item.buyPrice)/item.buyPrice * 100).toFixed(1)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-blue-600 dark:text-blue-400 font-medium">{item.rentYearly} Tỷ</TableCell>
                    <TableCell className="text-right text-red-500 font-medium">-{item.taxYearly} Tỷ</TableCell>
                    <TableCell className="text-right font-bold text-indigo-600 dark:text-indigo-400">{item.roi}</TableCell>
                    <TableCell className="text-right font-bold text-green-600 dark:text-green-400">{item.cagr}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
