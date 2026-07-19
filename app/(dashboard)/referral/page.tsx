"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Gift, Link as LinkIcon, QrCode, Copy, Users, 
  CheckCircle, Wallet, Trophy, Plane, Smartphone, 
  Medal, ArrowRight, Share2
} from 'lucide-react'

// Mock Data
const REFERRED_CUSTOMERS = [
  { id: 1, name: 'Lê Viết Dũng', phone: '0901***123', date: '19/07/2026', status: 'Đã giải ngân', project: 'Aqua City', commission: '75,000,000', payStatus: 'Đã thanh toán' },
  { id: 2, name: 'Nguyễn Thị Hoa', phone: '0988***456', date: '15/07/2026', status: 'Đã đặt cọc', project: 'Aqua City', commission: '75,000,000', payStatus: 'Chờ giải ngân' },
  { id: 3, name: 'Trần Văn Mạnh', phone: '0933***789', date: '12/07/2026', status: 'Đang tư vấn', project: 'Vinhomes Grand Park', commission: '50,000,000', payStatus: 'Chưa phát sinh' },
]

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const affiliateLink = "https://crm.novaland.com/ref/TUANTU99"

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Gift className="h-8 w-8 text-fuchsia-500" />
            Giới Thiệu & Hoa Hồng
          </h1>
          <p className="text-muted-foreground mt-1">Hệ thống Affiliate, theo dõi khách hàng và nhận thưởng không giới hạn.</p>
        </div>
        <Button className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white">
           <Share2 className="h-4 w-4 mr-2" /> Mời Bạn Bè Tham Gia
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* CỘT TRÁI: AFFILIATE LINK & METRICS (4/12) */}
        <div className="xl:col-span-4 space-y-6">
           
           {/* Link Generator */}
           <Card className="shadow-lg border-fuchsia-200 relative overflow-hidden bg-white dark:bg-slate-900">
             <div className="absolute top-0 right-0 p-4 opacity-10"><QrCode className="h-32 w-32 -mr-8 -mt-8 text-fuchsia-600" /></div>
             <CardContent className="p-4 md:p-6 relative z-10">
                <Badge className="bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-100 mb-4 border-fuchsia-200">Mã Số CTV: TUANTU99</Badge>
                <h3 className="text-xl font-bold mb-2">Chia sẻ Link Giới Thiệu</h3>
                <p className="text-sm text-muted-foreground mb-6">Gửi link này cho bạn bè hoặc khách hàng. Mỗi giao dịch thành công bạn sẽ nhận 1.5% Hoa hồng.</p>
                
                <div className="flex items-center gap-2 mb-6">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input 
                      readOnly 
                      value={affiliateLink} 
                      className="pl-9 bg-slate-50 border-slate-200 font-mono text-sm text-slate-700" 
                    />
                  </div>
                  <Button onClick={handleCopy} className={`${copied ? 'bg-green-500 hover:bg-green-600' : 'bg-fuchsia-500 hover:bg-fuchsia-600'} text-white transition-colors`}>
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1 border-slate-300"><QrCode className="h-4 w-4 mr-2" /> Tải Mã QR</Button>
                  <Button variant="outline" className="flex-1 border-slate-300"><Share2 className="h-4 w-4 mr-2" /> Share Zalo</Button>
                </div>
             </CardContent>
           </Card>

           {/* Metrics */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Tổng Click</span>
                  </div>
                  <div className="text-2xl font-bold">1,204</div>
                  <div className="text-xs text-green-500 font-medium mt-1">+12 hôm nay</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Đã Chốt</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">2 <span className="text-sm font-normal text-slate-500">Giao dịch</span></div>
                  <div className="text-xs text-muted-foreground font-medium mt-1">Tỷ lệ chuyển đổi: 0.16%</div>
                </CardContent>
              </Card>
           </div>

           <Card className="shadow-sm bg-gradient-to-r from-fuchsia-600 to-purple-700 text-white border-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 text-fuchsia-100 mb-2">
                  <Wallet className="h-5 w-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Tổng Hoa Hồng (Tạm tính)</span>
                </div>
                <div className="text-4xl font-bold tracking-tight mb-1">
                  150.000.000 <span className="text-xl font-medium text-fuchsia-200">VNĐ</span>
                </div>
                <div className="text-sm text-fuchsia-100 mb-4">
                  Thực nhận đợt 1: <strong className="text-white">75.000.000 VNĐ</strong>
                </div>
                <Button className="w-full bg-white text-fuchsia-700 hover:bg-slate-100 font-bold">
                  Yêu Cầu Rút Tiền (Withdraw)
                </Button>
              </CardContent>
           </Card>

        </div>

        {/* CỘT PHẢI: TRACKING & BẢNG KHÁCH HÀNG (8/12) */}
        <div className="xl:col-span-8 flex flex-col gap-6">
           
           {/* Gamification / Bonus Milestones */}
           <Card className="shadow-sm border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
             <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-500" /> Đường Đua Doanh Số (Tháng 7)
                  </h3>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">2/5 Khách hàng</Badge>
                </div>
                
                <div className="relative pt-8 pb-4 px-4">
                  {/* Progress Line */}
                  <div className="absolute top-[42px] left-8 right-8 h-2 bg-amber-200 rounded-full"></div>
                  <div className="absolute top-[42px] left-8 h-2 bg-amber-500 rounded-full transition-all duration-1000" style={{ width: '40%' }}></div>
                  
                  {/* Milestones */}
                  <div className="relative flex justify-between">
                     
                     {/* Milestone 1 (Achieved) */}
                     <div className="flex flex-col items-center gap-2 relative">
                        <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center z-10 shadow-md ring-4 ring-amber-50">
                          <Medal className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-sm text-amber-900">1 Khách</div>
                          <div className="text-xs text-amber-700">Voucher 5 Tr</div>
                        </div>
                     </div>

                     {/* Milestone 2 (Current) */}
                     <div className="flex flex-col items-center gap-2 relative">
                        <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center z-10 shadow-md ring-4 ring-amber-50">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-sm text-amber-900">3 Khách</div>
                          <div className="text-xs text-amber-700">iPhone 15 Pro</div>
                        </div>
                     </div>

                     {/* Milestone 3 (Target) */}
                     <div className="flex flex-col items-center gap-2 relative">
                        <div className="h-10 w-10 rounded-full bg-white border-2 border-amber-300 text-amber-300 flex items-center justify-center z-10 shadow-sm">
                          <Plane className="h-5 w-5" />
                        </div>
                        <div className="text-center opacity-50">
                          <div className="font-bold text-sm text-amber-900">5 Khách</div>
                          <div className="text-xs text-amber-700">Tour Maldives</div>
                        </div>
                     </div>

                  </div>
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm font-medium text-amber-800">Chỉ cần giới thiệu 1 khách hàng nữa để nhận <strong className="text-amber-600">iPhone 15 Pro Max</strong>! Cố lên!</p>
                </div>
             </CardContent>
           </Card>

           {/* Referrals List Table */}
           <Card className="shadow-sm flex-1">
             <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
               <CardTitle className="text-lg">Danh Sách Khách Hàng Được Giới Thiệu</CardTitle>
               <Button variant="outline" size="sm">Xuất Excel</Button>
             </CardHeader>
             <CardContent className="p-0">
               <div className="overflow-x-auto pb-4">
                 <Table>
                 <TableHeader className="bg-slate-50">
                   <TableRow>
                     <TableHead className="font-bold">Khách Hàng</TableHead>
                     <TableHead className="font-bold">Dự Án</TableHead>
                     <TableHead className="font-bold">Trạng Thái Deal</TableHead>
                     <TableHead className="font-bold text-right">Hoa Hồng (VNĐ)</TableHead>
                     <TableHead className="font-bold">Thanh Toán</TableHead>
                   </TableRow>
                 </TableHeader>
                 <TableBody>
                   {REFERRED_CUSTOMERS.map((row) => (
                     <TableRow key={row.id} className="hover:bg-slate-50">
                       <TableCell>
                         <div className="font-bold">{row.name}</div>
                         <div className="text-xs text-muted-foreground">{row.phone}</div>
                       </TableCell>
                       <TableCell className="text-sm">{row.project}</TableCell>
                       <TableCell>
                         <Badge variant="outline" className={`
                           ${row.status === 'Đã giải ngân' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                           ${row.status === 'Đã đặt cọc' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                           ${row.status === 'Đang tư vấn' ? 'bg-orange-50 text-orange-700 border-orange-200' : ''}
                         `}>
                           {row.status}
                         </Badge>
                       </TableCell>
                       <TableCell className="text-right font-mono font-bold text-slate-700">
                         {row.commission}
                       </TableCell>
                       <TableCell>
                         {row.payStatus === 'Đã thanh toán' && <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Đã trả</Badge>}
                         {row.payStatus === 'Chờ giải ngân' && <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">Chờ ngân hàng</Badge>}
                         {row.payStatus === 'Chưa phát sinh' && <span className="text-xs text-slate-400 font-medium">Chưa phát sinh</span>}
                       </TableCell>
                     </TableRow>
                   ))}
                 </TableBody>
               </Table>
               </div>
             </CardContent>
           </Card>

        </div>
      </div>
    </div>
  )
}
