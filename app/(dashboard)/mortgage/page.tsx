"use client"
import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator, Landmark, Building, Calendar, PiggyBank, CircleDollarSign, Info } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts'
import { useStore } from '@/store/useStore'

const BANKS = [
  { id: 'vcb', name: 'Vietcombank', rate: 6.5, logo: 'VCB' },
  { id: 'tcb', name: 'Techcombank', rate: 7.0, logo: 'TCB' },
  { id: 'mbb', name: 'MBBank', rate: 7.5, logo: 'MBB' },
  { id: 'vib', name: 'VIB', rate: 8.0, logo: 'VIB' },
]

export default function MortgagePage() {
  const { inventory } = useStore()
  const availableInventory = inventory.filter(i => i.status === 'Trống' || i.status === 'Booking')

  const [propertyValue, setPropertyValue] = useState(3000000000)
  const [loanPercent, setLoanPercent] = useState(70)
  const [loanTerm, setLoanTerm] = useState(20)
  const [selectedBank, setSelectedBank] = useState(BANKS[0])
  const [selectedItem, setSelectedItem] = useState<string>("")

  const handleSelectProperty = (e: React.ChangeEvent<HTMLSelectElement>) => {
     const id = e.target.value
     setSelectedItem(id)
     if (id) {
        const item = availableInventory.find(i => i.id === id)
        if (item) {
           setPropertyValue(item.price)
        }
     }
  }

  // Lógica Tính toán
  const loanAmount = (propertyValue * loanPercent) / 100
  const totalMonths = loanTerm * 12
  const monthlyRate = (selectedBank.rate / 100) / 12
  const monthlyPrincipal = loanAmount / totalMonths

  // Generate Amortization Schedule (Dư nợ giảm dần)
  const schedule = useMemo(() => {
    let remaining = loanAmount
    const results = []
    
    for (let i = 1; i <= totalMonths; i++) {
      const interest = remaining * monthlyRate
      const totalPayment = monthlyPrincipal + interest
      remaining -= monthlyPrincipal
      
      results.push({
        month: i,
        principal: monthlyPrincipal,
        interest: interest,
        totalPayment: totalPayment,
        remaining: Math.max(0, remaining) // Prevent tiny negative numbers due to float logic
      })
    }
    return results
  }, [loanAmount, totalMonths, monthlyRate, monthlyPrincipal])

  // Formatters
  const formatVND = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value)
  }

  // Aggregate Data for Chart (Yearly)
  const chartData = useMemo(() => {
    const yearly = []
    for (let year = 1; year <= loanTerm; year++) {
      const startMonthIndex = (year - 1) * 12
      const monthData = schedule[startMonthIndex]
      if (monthData) {
        yearly.push({
          year: `Năm ${year}`,
          remaining: Math.round(monthData.remaining / 1000000), // Triệu VNĐ
          payment: Math.round((monthData.totalPayment * 12) / 1000000) // Triệu VNĐ
        })
      }
    }
    return yearly
  }, [schedule, loanTerm])

  const totalInterestPaid = schedule.reduce((sum, item) => sum + item.interest, 0)
  const firstMonthPayment = schedule[0]?.totalPayment || 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calculator className="h-8 w-8 text-indigo-500" />
            Công Cụ Tính Vay (Mortgage)
          </h1>
          <p className="text-muted-foreground mt-1">Phân tích dòng tiền trả nợ - Phương pháp dư nợ giảm dần.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PANEL TRÁI: Nhập Liệu & So Sánh Ngân Hàng */}
        <div className="lg:col-span-1 space-y-6">
           
           <Card className="shadow-md border-indigo-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Building className="h-24 w-24" />
             </div>
             <CardHeader className="bg-indigo-50/50 border-b pb-4">
               <CardTitle className="text-lg text-indigo-900">Liên Kết Giỏ Hàng</CardTitle>
               <CardDescription>Chọn sản phẩm tư vấn để tự động điền giá</CardDescription>
             </CardHeader>
             <CardContent className="pt-6">
                <select 
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg py-2.5 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  value={selectedItem}
                  onChange={handleSelectProperty}
                >
                  <option value="">-- Chọn Sản Phẩm Đang Mở Bán --</option>
                  {availableInventory.map(item => (
                     <option key={item.id} value={item.id}>
                        [{item.code}] {item.type} - {formatVND(item.price)}
                     </option>
                  ))}
                </select>
                {selectedItem && (
                   <div className="mt-3 text-xs flex items-start gap-1.5 text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100">
                      <Info className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Đã đồng bộ giá trị sản phẩm <strong>{availableInventory.find(i => i.id === selectedItem)?.code}</strong> vào công cụ tính toán.</span>
                   </div>
                )}
             </CardContent>
           </Card>

           <Card className="shadow-md border-slate-200">
             <CardHeader className="bg-slate-50/50 border-b pb-4">
               <CardTitle className="text-lg">Thông Số Khoản Vay</CardTitle>
             </CardHeader>
             <CardContent className="pt-6 space-y-5">
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex justify-between">
                    <span>Giá trị Bất Động Sản</span>
                    <span className="font-bold text-slate-800">{formatVND(propertyValue)}</span>
                  </Label>
                  <Input 
                    type="range" min={500000000} max={40000000000} step={100000000}
                    value={propertyValue} onChange={e => { setPropertyValue(Number(e.target.value)); setSelectedItem("") }}
                    className="accent-indigo-600"
                  />
                  {selectedItem && <p className="text-[10px] text-muted-foreground text-right">Kéo thanh trượt sẽ hủy liên kết sản phẩm.</p>}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-muted-foreground flex justify-between">
                    <span>Tỷ lệ vay (%)</span>
                    <span className="font-bold text-slate-800">{loanPercent}%</span>
                  </Label>
                  <Input 
                    type="range" min={10} max={90} step={5}
                    value={loanPercent} onChange={e => setLoanPercent(Number(e.target.value))}
                    className="accent-indigo-600"
                  />
                  <div className="text-sm font-medium pt-1">
                    Số tiền vay: <span className="text-red-500 font-bold">{formatVND(loanAmount)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground flex justify-between">
                    <span>Thời hạn vay (Năm)</span>
                    <span className="font-bold text-slate-800">{loanTerm} Năm</span>
                  </Label>
                  <Input 
                    type="range" min={5} max={35} step={1}
                    value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))}
                    className="accent-indigo-600"
                  />
                </div>
             </CardContent>
           </Card>

           <Card className="shadow-md">
             <CardHeader className="pb-4">
               <CardTitle className="text-lg flex items-center gap-2"><Landmark className="h-5 w-5 text-slate-600" /> So Sánh Ngân Hàng</CardTitle>
             </CardHeader>
             <CardContent className="p-0">
               <div className="divide-y">
                 {BANKS.map(bank => (
                   <div 
                     key={bank.id} 
                     onClick={() => setSelectedBank(bank)}
                     className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${selectedBank.id === bank.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-muted'}`}
                   >
                     <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${selectedBank.id === bank.id ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                           {bank.logo}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{bank.name}</div>
                          <div className="text-xs text-muted-foreground">Lãi suất ưu đãi năm đầu</div>
                        </div>
                     </div>
                     <div className={`font-bold text-lg ${selectedBank.id === bank.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                        {bank.rate.toFixed(1)}%
                     </div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
        </div>

        {/* PANEL PHẢI: Kết Quả & Biểu Đồ */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           
           {/* Highlight Metrics */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-none shadow-lg">
                <CardContent className="p-6">
                   <div className="text-indigo-100 font-medium mb-1 flex items-center gap-2"><Calendar className="h-4 w-4" /> Trả Tháng Đầu Tiên</div>
                   <div className="text-3xl font-bold">{formatVND(firstMonthPayment)}</div>
                   <div className="text-xs mt-2 text-indigo-200">Gốc: {formatVND(monthlyPrincipal)} | Lãi: {formatVND(schedule[0]?.interest || 0)}</div>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-md">
                <CardContent className="p-6">
                   <div className="text-muted-foreground font-medium mb-1 flex items-center gap-2"><PiggyBank className="h-4 w-4 text-emerald-500" /> Vốn Tự Có Cần Chuẩn Bị</div>
                   <div className="text-3xl font-bold text-slate-800">{formatVND(propertyValue - loanAmount)}</div>
                   <div className="text-xs mt-2 text-muted-foreground">Chiếm {100 - loanPercent}% giá trị BĐS</div>
                </CardContent>
              </Card>
              <Card className="bg-white border shadow-md">
                <CardContent className="p-6">
                   <div className="text-muted-foreground font-medium mb-1 flex items-center gap-2"><CircleDollarSign className="h-4 w-4 text-red-500" /> Tổng Lãi Phải Trả</div>
                   <div className="text-3xl font-bold text-red-600">{formatVND(totalInterestPaid)}</div>
                   <div className="text-xs mt-2 text-muted-foreground">Trong suốt {loanTerm} năm vay</div>
                </CardContent>
              </Card>
           </div>

           {/* Biểu Đồ */}
           <Card className="shadow-md flex-1">
             <CardHeader>
               <CardTitle>Biểu Đồ Dư Nợ Giảm Dần</CardTitle>
               <CardDescription>Mô phỏng dư nợ Gốc còn lại qua các năm (Đơn vị: Triệu VNĐ)</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="h-[300px] w-full mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorRemaining" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                         <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                     <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `${val} Tr`} />
                     <RechartsTooltip 
                        formatter={(value: any) => [`${new Intl.NumberFormat('vi-VN').format(value)} Triệu`, '']}
                        labelClassName="font-bold text-black"
                     />
                     <Legend />
                     <Area type="monotone" dataKey="remaining" name="Dư nợ gốc còn lại" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRemaining)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
             </CardContent>
           </Card>

           {/* Bảng Chi Tiết */}
           <Card className="shadow-md">
             <CardHeader>
               <CardTitle>Lịch Trả Nợ Chi Tiết</CardTitle>
               <CardDescription>Phân bổ Gốc và Lãi trong 12 tháng đầu tiên</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="overflow-x-auto pb-4">
                 <Table>
                   <TableHeader>
                     <TableRow className="bg-muted/50">
                       <TableHead className="w-20">Kỳ trả</TableHead>
                       <TableHead className="text-right">Tiền Gốc</TableHead>
                       <TableHead className="text-right">Tiền Lãi</TableHead>
                       <TableHead className="text-right font-bold text-indigo-700">Tổng Trả / Tháng</TableHead>
                       <TableHead className="text-right">Dư Nợ Còn Lại</TableHead>
                     </TableRow>
                   </TableHeader>
                   <TableBody>
                     {schedule.slice(0, 12).map((item) => (
                       <TableRow key={item.month} className="hover:bg-muted/50 transition-colors">
                         <TableCell className="font-medium text-center">{item.month}</TableCell>
                         <TableCell className="text-right">{formatVND(item.principal)}</TableCell>
                         <TableCell className="text-right text-red-500">{formatVND(item.interest)}</TableCell>
                         <TableCell className="text-right font-bold text-indigo-600">{formatVND(item.totalPayment)}</TableCell>
                         <TableCell className="text-right text-muted-foreground">{formatVND(item.remaining)}</TableCell>
                       </TableRow>
                     ))}
                   </TableBody>
                 </Table>
               </div>
               <div className="mt-4 text-center">
                 <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">Tải Về File Excel Bảng Tính Đầy Đủ ({totalMonths} Tháng)</Button>
               </div>
             </CardContent>
           </Card>

        </div>
      </div>
    </div>
  )
}
