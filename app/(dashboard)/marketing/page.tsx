"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  Megaphone, MessageSquare, Mail, Share2, Search, MonitorPlay, 
  LayoutTemplate, Image as ImageIcon, Copy, Link2, QrCode, Target,
  RefreshCcw, Code, Smartphone, Download, Plus, CheckCircle2
} from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function MarketingPage() {
  const { customers, projects, campaigns } = useStore()
  
  // States for UTM Generator
  const [utmUrl, setUtmUrl] = useState("https://aquacity.com.vn")
  const [utmSource, setUtmSource] = useState("facebook")
  const [utmMedium, setUtmMedium] = useState("cpc")
  const [utmName, setUtmName] = useState("sale_thang_12")
  const [copied, setCopied] = useState(false)

  // State for Landing Page Preview
  const [previewId, setPreviewId] = useState<number | null>(null)

  const generatedUrl = `${utmUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmName}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Megaphone className="h-8 w-8 text-pink-500" />
            Marketing Automation
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý đa kênh (Omnichannel), Tạo Landing Page và Tracking hiệu suất Ads.</p>
        </div>
        <Button className="bg-pink-600 hover:bg-pink-700 text-white font-bold h-11 px-6 shadow-sm">
          <Plus className="mr-2 h-5 w-5" /> Tạo Chiến Dịch Mới
        </Button>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px] mb-6 h-auto md:h-12 bg-slate-100">
          <TabsTrigger value="campaigns" className="py-2.5 font-semibold data-[state=active]:bg-white">Hiệu Suất Chiến Dịch</TabsTrigger>
          <TabsTrigger value="builders" className="py-2.5 font-semibold data-[state=active]:bg-white">Page & Email Builder</TabsTrigger>
          <TabsTrigger value="tracking" className="py-2.5 font-semibold data-[state=active]:bg-white">Tracking & UTM</TabsTrigger>
        </TabsList>

        {/* TAB 1: CAMPAIGNS & CHANNELS */}
        <TabsContent value="campaigns" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
             <Card className="bg-pink-50 border-pink-100">
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-pink-700 uppercase mb-1">Tổng Chiến Dịch</div>
                 <div className="text-3xl font-black text-pink-600">{campaigns.length}</div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-1">Tổng Ngân Sách (Đã Tiêu)</div>
                 <div className="text-2xl font-black text-slate-800">{formatCurrency(campaigns.reduce((sum, c) => sum + c.spent, 0))}</div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-1">Tổng Leads Thu Về</div>
                 <div className="text-3xl font-black text-green-600">{campaigns.reduce((sum, c) => sum + c.leads, 0)}</div>
               </CardContent>
             </Card>
             <Card>
               <CardContent className="p-4">
                 <div className="text-xs font-bold text-slate-500 uppercase mb-1">Chi Phí / Lead (CPL)</div>
                 <div className="text-2xl font-black text-indigo-600">
                   {formatCurrency(campaigns.reduce((sum, c) => sum + c.spent, 0) / (campaigns.reduce((sum, c) => sum + c.leads, 0) || 1))}
                 </div>
               </CardContent>
             </Card>
           </div>

           <h3 className="font-bold text-lg mb-4 mt-8 flex items-center gap-2"><Target className="h-5 w-5 text-indigo-500"/> Các chiến dịch đang chạy (Active Campaigns)</h3>
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {campaigns.map(camp => {
                const percentSpent = (camp.spent / camp.budget) * 100
                const isOverBudget = percentSpent >= 90
                
                let PlatformIcon = Share2
                let colorClass = "text-blue-600 bg-blue-100"
                if(camp.platform === 'Google') { PlatformIcon = Search; colorClass = "text-red-600 bg-red-100" }
                if(camp.platform === 'TikTok') { PlatformIcon = MonitorPlay; colorClass = "text-black bg-gray-200" }
                if(camp.platform === 'Zalo') { PlatformIcon = MessageSquare; colorClass = "text-blue-500 bg-blue-50" }

                return (
                  <Card key={camp.id} className="overflow-hidden shadow-sm border-slate-200 hover:border-indigo-300 transition-colors">
                    <CardHeader className="pb-3 border-b bg-slate-50">
                       <div className="flex justify-between items-start">
                         <div className="flex items-center gap-3">
                           <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                             <PlatformIcon className="h-5 w-5" />
                           </div>
                           <div>
                             <CardTitle className="text-base">{camp.name}</CardTitle>
                             <CardDescription className="text-xs mt-1">Bắt đầu: {camp.startDate}</CardDescription>
                           </div>
                         </div>
                         <Badge className={camp.status === 'Active' ? 'bg-green-500' : 'bg-slate-500'}>{camp.status}</Badge>
                       </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                       <div className="flex justify-between text-sm mb-1 font-medium">
                         <span>Tiến độ Ngân Sách</span>
                         <span className={isOverBudget ? "text-red-600" : ""}>{percentSpent.toFixed(1)}%</span>
                       </div>
                       <Progress value={percentSpent} className={`h-2 mb-2 ${isOverBudget ? 'bg-red-100 [&>div]:bg-red-500' : ''}`} />
                       <div className="flex justify-between text-xs text-muted-foreground mb-4">
                         <span>Đã tiêu: {formatCurrency(camp.spent)}</span>
                         <span>Tổng: {formatCurrency(camp.budget)}</span>
                       </div>
                       
                       <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 rounded-lg p-3 border border-slate-100">
                          <div>
                            <div className="text-xs text-muted-foreground font-semibold mb-1">Clicks</div>
                            <div className="font-black text-slate-800">{camp.clicks.toLocaleString()}</div>
                          </div>
                          <div className="border-x border-slate-200">
                            <div className="text-xs text-muted-foreground font-semibold mb-1">Leads</div>
                            <div className="font-black text-green-600">{camp.leads}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground font-semibold mb-1">CPL</div>
                            <div className="font-bold text-indigo-600">{formatCurrency(camp.spent / (camp.leads || 1))}</div>
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                )
              })}
           </div>
        </TabsContent>

        {/* TAB 2: BUILDERS */}
        <TabsContent value="builders" className="space-y-6">
           <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-xl border border-indigo-100">
             <div>
                <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-900"><LayoutTemplate className="h-5 w-5 text-indigo-600" /> Landing Page Templates</h2>
                <p className="text-sm text-indigo-700 mt-1">Khởi tạo nhanh Landing Page bán hàng tích hợp sẵn form đổ Lead về CRM.</p>
             </div>
             <Button variant="outline" className="bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold">Tạo Trang Trắng</Button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
               { id: 1, name: 'Mẫu Mở Bán Căn Hộ Cao Cấp', tag: 'Căn hộ', color: 'blue' },
               { id: 2, name: 'Mẫu Biệt Thự Nghỉ Dưỡng', tag: 'Biệt thự', color: 'green' },
               { id: 3, name: 'Mẫu Shophouse Thương Mại', tag: 'Shophouse', color: 'orange' },
             ].map(tpl => (
               <Card key={tpl.id} className="overflow-hidden group border shadow-sm hover:shadow-md transition-shadow">
                 <div className="h-40 bg-muted relative border-b overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                       <LayoutTemplate className="h-12 w-12 text-indigo-300" />
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <Button size="sm" variant="secondary" onClick={() => setPreviewId(tpl.id)} className="bg-white text-black hover:bg-gray-100">Xem Thử</Button>
                       <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">Dùng Mẫu Này</Button>
                    </div>
                 </div>
                 <CardContent className="p-4">
                   <div className="flex justify-between items-start mb-2">
                     <h3 className="font-bold text-sm leading-tight">{tpl.name}</h3>
                     <Badge variant="outline" className="text-[10px] uppercase">{tpl.tag}</Badge>
                   </div>
                   <p className="text-xs text-muted-foreground">Form thu thập thông tin khách hàng, Tích hợp sẵn mã Tracking Pixel, Nút gọi Zalo/Hotline nổi.</p>
                 </CardContent>
               </Card>
             ))}
           </div>
           
           <Dialog open={previewId !== null} onOpenChange={() => setPreviewId(null)}>
             <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col p-0">
                <DialogHeader className="p-4 border-b bg-slate-50">
                   <DialogTitle>Xem trước Template #{previewId}</DialogTitle>
                </DialogHeader>
                <div className="flex-1 bg-slate-200 overflow-y-auto p-8 flex items-start justify-center">
                   {/* Fake Website Mockup */}
                   <div className="w-[375px] h-[812px] bg-white shadow-2xl rounded-[3rem] border-8 border-slate-900 overflow-hidden relative">
                      <div className="absolute top-0 w-full h-6 bg-black text-white text-[10px] flex justify-between px-6 pt-1 font-mono">
                        <span>12:00</span>
                        <span>5G 🔋</span>
                      </div>
                      <div className="h-48 bg-indigo-600 mt-6 flex items-center justify-center text-white p-6 text-center flex-col">
                        <h1 className="text-2xl font-black mb-2">SIÊU DỰ ÁN 2026</h1>
                        <p className="text-xs">Đăng ký nhận bảng giá đợt 1</p>
                      </div>
                      <div className="p-6">
                        <div className="h-4 w-3/4 bg-slate-200 rounded mb-4"></div>
                        <div className="h-4 w-full bg-slate-200 rounded mb-4"></div>
                        <div className="h-4 w-5/6 bg-slate-200 rounded mb-8"></div>
                        
                        <div className="space-y-3 mb-6">
                          <div className="h-10 w-full bg-slate-100 rounded border border-slate-200 flex items-center px-3 text-sm text-slate-400">Họ và Tên *</div>
                          <div className="h-10 w-full bg-slate-100 rounded border border-slate-200 flex items-center px-3 text-sm text-slate-400">Số Điện Thoại *</div>
                        </div>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 text-lg">NHẬN BẢNG GIÁ NGAY</Button>
                      </div>
                   </div>
                </div>
             </DialogContent>
           </Dialog>

        </TabsContent>

        {/* TAB 3: TRACKING & UTM */}
        <TabsContent value="tracking" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Dynamic UTM Generator */}
              <Card className="shadow-md border-indigo-100">
                <CardHeader className="pb-4 bg-indigo-50/50 border-b">
                  <CardTitle className="flex items-center gap-2 text-lg text-indigo-900"><Link2 className="h-5 w-5 text-indigo-600" /> Trình Tạo UTM Động (Live Generator)</CardTitle>
                  <CardDescription>Gõ nội dung, link sẽ tự động được tạo ra ngay lập tức bên dưới.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">Link Gốc (URL Landing Page)</Label>
                    <Input value={utmUrl} onChange={e => setUtmUrl(e.target.value)} placeholder="Ví dụ: https://aquacity.com.vn" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Nguồn (utm_source)</Label>
                      <Input value={utmSource} onChange={e => setUtmSource(e.target.value)} placeholder="facebook, google, zalo" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Phương tiện (utm_medium)</Label>
                      <Input value={utmMedium} onChange={e => setUtmMedium(e.target.value)} placeholder="cpc, banner, email" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">Tên chiến dịch (utm_campaign)</Label>
                    <Input value={utmName} onChange={e => setUtmName(e.target.value)} placeholder="Ví dụ: sale_thang_12" />
                  </div>
                  
                  <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 mt-6 relative shadow-inner">
                    <Label className="text-xs font-bold text-indigo-900 uppercase mb-2 block flex items-center gap-2">
                       Kết Quả Link Của Bạn 
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                       </span>
                    </Label>
                    <div className="flex flex-col gap-3">
                       <code className="bg-white border border-indigo-200 p-3 rounded-lg text-sm text-indigo-700 break-all select-all font-mono font-medium shadow-sm">
                         {generatedUrl}
                       </code>
                       <Button onClick={copyToClipboard} variant={copied ? "default" : "secondary"} className={`w-full font-bold ${copied ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}>
                         {copied ? <><CheckCircle2 className="h-4 w-4 mr-2" /> Đã Copy</> : <><Copy className="h-4 w-4 mr-2" /> Sao Chép Link Này</>}
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-6">
                {/* QR Code Tracking */}
                <Card className="shadow-md flex-1">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg"><QrCode className="h-5 w-5 text-indigo-500" /> QR Code Tự Động Sinh Ra</CardTitle>
                    <CardDescription>Mã QR này chứa đúng URL bạn vừa tạo ở bên trái.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="h-32 w-32 border-2 border-indigo-100 rounded-xl p-2 bg-white flex-shrink-0 relative group">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/80 transition-opacity cursor-pointer z-10">
                         <span className="text-xs font-bold text-indigo-600 flex items-center"><Download className="h-4 w-4 mr-1"/> Tải Về</span>
                      </div>
                      <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                        {/* Mock QR Code Pattern */}
                        <path fill="currentColor" d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h10v10H40zM50 10h10v10H50zM40 20h20v10H40zM30 40h10v20H30zM40 50h20v10H40zM70 40h10v10H70zM80 50h20v10H80zM90 60h10v20H90zM70 80h20v20H70zM40 80h10v20H40zM50 70h20v10H50z" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-3">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold"><Download className="h-4 w-4 mr-2" /> In Mã Standee</Button>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Sử dụng mã QR này in lên tờ rơi hoặc Standee đặt tại sự kiện. Khách hàng quét mã sẽ được ghi nhận vào nguồn <strong>{utmSource}</strong>.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Pixel Config */}
                <Card className="shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg"><Code className="h-5 w-5 text-red-500" /> Cấu hình Tracking Pixels</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-between">
                        <span>Meta Pixel ID (Facebook)</span>
                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
                      </Label>
                      <Input defaultValue="123456789012345" />
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
