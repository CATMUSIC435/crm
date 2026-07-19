"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Megaphone, MessageSquare, Mail, Share2, Search, MonitorPlay, 
  LayoutTemplate, Image as ImageIcon, Copy, Link2, QrCode, Target,
  RefreshCcw, Code, Smartphone, Download
} from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function MarketingPage() {
  const { customers, projects, inventory } = useStore()

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
        <Button className="bg-pink-600 hover:bg-pink-700 text-white">
          + Tạo Chiến Dịch Mới
        </Button>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px] mb-6">
          <TabsTrigger value="channels">Đa Kênh & Ads</TabsTrigger>
          <TabsTrigger value="builders">Page & Email Builder</TabsTrigger>
          <TabsTrigger value="tracking">UTM, Pixel & QR</TabsTrigger>
        </TabsList>

        {/* TAB 1: CHANNELS */}
        <TabsContent value="channels" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {/* Zalo OA */}
             <Card className="border-green-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3">
                 <Badge className="bg-green-100 text-green-700 border-green-200">Đã kết nối</Badge>
               </div>
               <CardContent className="pt-6">
                 <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 border border-blue-200 shadow-sm">
                   <MessageSquare className="h-6 w-6" />
                 </div>
                 <h3 className="font-bold text-lg">Zalo OA (Official Account)</h3>
                 <p className="text-sm text-muted-foreground mt-1 h-10">Tự động gửi tin nhắn ZNS chăm sóc khách hàng, kịch bản Chatbot.</p>
                 <div className="mt-4 pt-4 border-t flex justify-between items-center">
                   <span className="text-xs font-semibold">{customers.length > 0 ? customers.length * 123 : '1,245'} Người theo dõi</span>
                   <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Cấu Hình</Button>
                 </div>
               </CardContent>
             </Card>

             {/* Facebook */}
             <Card className="border-blue-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3">
                 <Badge className="bg-green-100 text-green-700 border-green-200">Đã kết nối</Badge>
               </div>
               <CardContent className="pt-6">
                 <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4 border border-blue-700 shadow-sm">
                   <Share2 className="h-6 w-6" />
                 </div>
                 <h3 className="font-bold text-lg">Facebook Lead Ads</h3>
                 <p className="text-sm text-muted-foreground mt-1 h-10">Đổ Lead trực tiếp từ Facebook Form về CRM không cần API trung gian.</p>
                 <div className="mt-4 pt-4 border-t flex justify-between items-center">
                   <span className="text-xs font-semibold">3 Chiến dịch đang chạy</span>
                   <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Cấu Hình</Button>
                 </div>
               </CardContent>
             </Card>

             {/* Google Ads */}
             <Card className="border-red-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3">
                 <Badge variant="outline" className="text-muted-foreground">Chưa kết nối</Badge>
               </div>
               <CardContent className="pt-6">
                 <div className="h-12 w-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center mb-4 border border-red-200 shadow-sm">
                   <Search className="h-6 w-6" />
                 </div>
                 <h3 className="font-bold text-lg">Google Ads</h3>
                 <p className="text-sm text-muted-foreground mt-1 h-10">Đồng bộ dữ liệu chuyển đổi (Conversions) để tối ưu chiến dịch Tìm kiếm.</p>
                 <div className="mt-4 pt-4 border-t flex justify-between items-center">
                   <span className="text-xs font-semibold text-muted-foreground">Yêu cầu Google OAuth</span>
                   <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">Kết Nối Ngay</Button>
                 </div>
               </CardContent>
             </Card>

             {/* TikTok Ads */}
             <Card className="border-slate-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3">
                 <Badge className="bg-green-100 text-green-700 border-green-200">Đã kết nối</Badge>
               </div>
               <CardContent className="pt-6">
                 <div className="h-12 w-12 rounded-xl bg-black text-white flex items-center justify-center mb-4 shadow-sm">
                   <MonitorPlay className="h-6 w-6" />
                 </div>
                 <h3 className="font-bold text-lg">TikTok Lead Generation</h3>
                 <p className="text-sm text-muted-foreground mt-1 h-10">Thu thập form khách hàng từ các video ngắn và Livestream.</p>
                 <div className="mt-4 pt-4 border-t flex justify-between items-center">
                   <span className="text-xs font-semibold">1 Chiến dịch đang chạy</span>
                   <Button variant="outline" size="sm" className="text-slate-800 border-slate-300 hover:bg-slate-100">Cấu Hình</Button>
                 </div>
               </CardContent>
             </Card>

             {/* SMS Brandname */}
             <Card className="border-orange-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3">
                 <Badge className="bg-green-100 text-green-700 border-green-200">Đã kết nối</Badge>
               </div>
               <CardContent className="pt-6">
                 <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 border border-orange-200 shadow-sm">
                   <Smartphone className="h-6 w-6" />
                 </div>
                 <h3 className="font-bold text-lg">SMS Brandname</h3>
                 <p className="text-sm text-muted-foreground mt-1 h-10">Nhắn tin chăm sóc định kỳ hoặc gửi mã OTP Booking. Tên hiển thị: "AQUA CITY".</p>
                 <div className="mt-4 pt-4 border-t flex justify-between items-center">
                   <span className="text-xs font-semibold">Số dư: {customers.length > 0 ? customers.length * 540 : '5,400'} tin</span>
                   <Button variant="outline" size="sm" className="text-orange-600 border-orange-200 hover:bg-orange-50">Nạp Tiền</Button>
                 </div>
               </CardContent>
             </Card>

             {/* Email Marketing */}
             <Card className="border-purple-200 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-3">
                 <Badge className="bg-green-100 text-green-700 border-green-200">Đã kết nối</Badge>
               </div>
               <CardContent className="pt-6">
                 <div className="h-12 w-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 border border-purple-200 shadow-sm">
                   <Mail className="h-6 w-6" />
                 </div>
                 <h3 className="font-bold text-lg">Mass Email (Mailchimp)</h3>
                 <p className="text-sm text-muted-foreground mt-1 h-10">Hệ thống gửi Email hàng loạt với tính năng Auto-responder (Kịch bản tự động).</p>
                 <div className="mt-4 pt-4 border-t flex justify-between items-center">
                   <span className="text-xs font-semibold">Open Rate: {customers.length > 0 ? 24 + customers.length * 0.5 : 24.5}%</span>
                   <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">Cấu Hình</Button>
                 </div>
               </CardContent>
             </Card>
           </div>
        </TabsContent>

        {/* TAB 2: BUILDERS */}
        <TabsContent value="builders" className="space-y-6">
           <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold flex items-center gap-2"><LayoutTemplate className="h-5 w-5 text-indigo-500" /> Landing Page Templates</h2>
             <Button variant="outline" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">Tạo Trang Trắng (Blank)</Button>
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
                       <ImageIcon className="h-10 w-10 text-indigo-300" />
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <Button size="sm" className="bg-white text-black hover:bg-gray-100">Xem Thử</Button>
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

           <div className="flex justify-between items-center mt-8 pt-4 border-t">
             <h2 className="text-xl font-bold flex items-center gap-2"><Mail className="h-5 w-5 text-pink-500" /> Email Templates</h2>
             <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">Tạo Email Mới</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Thư Cảm Ơn Đặt Chỗ', 'Mời Tham Dự Sự Kiện', 'Cập Nhật Tiến Độ', 'Bảng Giá Tháng 12'].map((name, i) => (
                <Card key={i} className="border shadow-sm hover:border-pink-300 transition-colors cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="h-10 w-10 mx-auto bg-pink-50 text-pink-500 rounded-full flex items-center justify-center mb-3">
                      <Mail className="h-5 w-5" />
                    </div>
                    <h4 className="font-semibold text-sm">{name}</h4>
                  </CardContent>
                </Card>
              ))}
           </div>
        </TabsContent>

        {/* TAB 3: TRACKING & UTM */}
        <TabsContent value="tracking" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* UTM Generator */}
              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg"><Link2 className="h-5 w-5 text-blue-500" /> Trình Tạo UTM (UTM Generator)</CardTitle>
                  <CardDescription>Gắn mã theo dõi vào link để biết chính xác khách hàng click từ đâu.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">Link Gốc (URL)</Label>
                    <Input placeholder="Ví dụ: https://aquacity.com.vn" defaultValue="https://aquacity.com.vn" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Nguồn (utm_source)</Label>
                      <Input placeholder="facebook, google, zalo" defaultValue="facebook" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase">Phương tiện (utm_medium)</Label>
                      <Input placeholder="cpc, banner, email" defaultValue="cpc" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-muted-foreground uppercase">Tên chiến dịch (utm_campaign)</Label>
                    <Input placeholder="Ví dụ: sale_thang_12" defaultValue="sale_thang_12" />
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg border mt-2">
                    <Label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Link đã tạo:</Label>
                    <div className="flex gap-2">
                       <code className="flex-1 bg-background border p-2 rounded text-xs text-blue-600 break-all select-all font-mono">
                         https://aquacity.com.vn/?utm_source=facebook&utm_medium=cpc&utm_campaign=sale_thang_12
                       </code>
                       <Button variant="secondary" className="flex-shrink-0"><Copy className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-6">
                {/* QR Code Tracking */}
                <Card className="shadow-md flex-1">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg"><QrCode className="h-5 w-5 text-indigo-500" /> QR Code Tracing</CardTitle>
                    <CardDescription>Biến UTM Link thành QR Code để in ấn (Tờ rơi, Standee).</CardDescription>
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
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700"><RefreshCcw className="h-4 w-4 mr-2" /> Tạo QR Mới từ UTM</Button>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Khách hàng sử dụng Zalo hoặc Camera điện thoại quét mã này sẽ tự động được ghi nhận nguồn là <strong>"offline_standee"</strong> vào CRM.
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
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground uppercase flex items-center justify-between">
                        <span>TikTok Pixel ID</span>
                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
                      </Label>
                      <Input defaultValue="CCK9J3C3BQV7T29B123G" />
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
