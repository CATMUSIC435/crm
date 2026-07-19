"use client"
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import { 
  Puzzle, MessageCircle, Mail, Map as MapIcon, 
  HardDrive, Phone, Briefcase, CreditCard, PenTool, 
  CheckCircle2, Plus, Search, Blocks, Key, Server
} from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// MOCK DATA
const APPS = [
  { id: 'zalo', name: 'Zalo OA', category: 'communication', icon: <MessageCircle className="h-8 w-8 text-blue-500" />, desc: 'Gửi tin nhắn ZNS, chăm sóc khách hàng tự động qua Zalo.', connected: true },
  { id: 'fb', name: 'Facebook Messenger', category: 'communication', icon: <MessageCircle className="h-8 w-8 text-blue-600" />, desc: 'Kết nối Fanpage, đồng bộ tin nhắn khách hàng vào CRM.', connected: false },
  { id: 'telegram', name: 'Telegram Bot', category: 'communication', icon: <SendIcon className="h-8 w-8 text-sky-500" />, desc: 'Nhận thông báo booking, hợp đồng mới ngay trên Telegram.', connected: true },
  { id: 'slack', name: 'Slack', category: 'communication', icon: <HashIcon className="h-8 w-8 text-amber-600" />, desc: 'Tích hợp cảnh báo và báo cáo tự động vào kênh Slack.', connected: false },
  { id: 'teams', name: 'Microsoft Teams', category: 'communication', icon: <UsersIcon className="h-8 w-8 text-indigo-600" />, desc: 'Tổ chức họp trực tuyến, đồng bộ lịch họp với khách hàng.', connected: false },
  { id: 'voip', name: 'Tổng đài VoIP', category: 'communication', icon: <Phone className="h-8 w-8 text-green-500" />, desc: 'Gọi điện trực tiếp từ CRM, ghi âm và chuyển văn bản (Speech-to-text).', connected: true },
  
  { id: 'gdrive', name: 'Google Drive', category: 'storage', icon: <HardDrive className="h-8 w-8 text-yellow-500" />, desc: 'Lưu trữ tài liệu dự án, hồ sơ pháp lý, và xuất thư mục tự động.', connected: true },
  { id: 'onedrive', name: 'OneDrive', category: 'storage', icon: <HardDrive className="h-8 w-8 text-blue-500" />, desc: 'Đồng bộ tài liệu hợp đồng lên hệ sinh thái Microsoft 365.', connected: false },
  { id: 'dropbox', name: 'Dropbox', category: 'storage', icon: <HardDrive className="h-8 w-8 text-sky-600" />, desc: 'Lưu trữ không giới hạn các video, hình ảnh sa bàn 3D lớn.', connected: false },
  
  { id: 'gmaps', name: 'Google Maps', category: 'utilities', icon: <MapIcon className="h-8 w-8 text-red-500" />, desc: 'Định vị GPS hiện trường, tính khoảng cách từ khách đến dự án.', connected: true },
  { id: 'mapbox', name: 'Mapbox', category: 'utilities', icon: <MapIcon className="h-8 w-8 text-slate-800" />, desc: 'Bản đồ GIS nâng cao, phân tích mật độ dân cư và hạ tầng.', connected: false },
  { id: 'gcal', name: 'Google Calendar', category: 'utilities', icon: <CalendarIcon className="h-8 w-8 text-blue-500" />, desc: 'Tự động tạo sự kiện nhắc lịch hẹn đi xem sa bàn.', connected: true },
  { id: 'outlook', name: 'Outlook', category: 'utilities', icon: <Mail className="h-8 w-8 text-blue-600" />, desc: 'Đồng bộ email trao đổi với khách hàng vào thẻ Customer 360.', connected: false },
  
  { id: 'misa', name: 'Kế toán MISA', category: 'finance', icon: <Briefcase className="h-8 w-8 text-emerald-600" />, desc: 'Đồng bộ phiếu thu, phiếu chi, tự động tính hoa hồng xuất hóa đơn.', connected: false },
  { id: 'sap', name: 'SAP ERP', category: 'finance', icon: <Server className="h-8 w-8 text-blue-700" />, desc: 'Tích hợp hệ thống quản trị nguồn lực cấp tập đoàn.', connected: false },
  { id: 'vnpay', name: 'Cổng thanh toán VNPay', category: 'finance', icon: <CreditCard className="h-8 w-8 text-red-600" />, desc: 'Cho phép khách hàng quẹt thẻ/quét mã để cọc tiền giữ chỗ online.', connected: true },
  { id: 'vnpt', name: 'VNPT SmartCA', category: 'finance', icon: <PenTool className="h-8 w-8 text-blue-500" />, desc: 'Tích hợp Chữ ký số từ xa, ký Hợp đồng điện tử có giá trị pháp lý.', connected: false },
]

function SendIcon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg> }
function HashIcon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/></svg> }
function UsersIcon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> }
function CalendarIcon({ className }: { className?: string }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> }


export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredApps = APPS.filter(app => {
     if (activeTab !== 'all' && app.category !== activeTab) return false;
     if (searchQuery && !app.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
     return true;
  })

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10 w-full">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Blocks className="h-8 w-8 text-indigo-400" />
            Chợ Ứng Dụng (App Store)
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">Mở rộng không giới hạn sức mạnh CRM bằng cách tích hợp với hàng trăm dịch vụ bên thứ ba hàng đầu thế giới.</p>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-4 w-full max-w-xl">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                   placeholder="Tìm kiếm ứng dụng (Ví dụ: Zalo, MISA...)" 
                   className="pl-9 h-11 bg-slate-800/50 border-slate-700 text-white focus:bg-slate-800"
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                />
             </div>
             <Button className="h-11 bg-indigo-600 hover:bg-indigo-700 font-bold shrink-0">
                <Plus className="h-4 w-4 mr-2"/> Yêu Cầu Tích Hợp
             </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent justify-start mb-6">
          <TabsTrigger value="all" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white bg-white border shadow-sm">Tất Cả Ứng Dụng</TabsTrigger>
          <TabsTrigger value="communication" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white bg-white border shadow-sm">Giao Tiếp & Chat</TabsTrigger>
          <TabsTrigger value="storage" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white bg-white border shadow-sm">Lưu Trữ Đám Mây</TabsTrigger>
          <TabsTrigger value="utilities" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white bg-white border shadow-sm">Tiện Ích & Bản Đồ</TabsTrigger>
          <TabsTrigger value="finance" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white bg-white border shadow-sm">Tài Chính & Kế Toán</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0 outline-none">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredApps.map(app => (
                 <Card key={app.id} className="flex flex-col hover:shadow-lg hover:border-indigo-200 transition-all group overflow-hidden">
                    <CardContent className="p-4 md:p-6 flex-1 flex flex-col relative">
                       {/* Connection Status Badge */}
                       {app.connected && (
                          <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full border border-green-200">
                             <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div> Đã kết nối
                          </div>
                       )}

                       <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border shadow-sm mb-4 group-hover:scale-110 transition-transform">
                          {app.icon}
                       </div>
                       <h3 className="font-bold text-lg text-slate-800 mb-2">{app.name}</h3>
                       <p className="text-sm text-slate-500 flex-1 leading-relaxed">{app.desc}</p>
                       
                       <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{app.category}</span>
                          
                          <Dialog>
                             {/* @ts-ignore */}
                             <DialogTrigger asChild>
                                <Button 
                                   variant={app.connected ? "outline" : "default"} 
                                   size="sm" 
                                   className={app.connected ? 'border-slate-300' : 'bg-slate-900 text-white'}
                                >
                                   {app.connected ? 'Cấu Hình' : 'Cài Đặt'}
                                </Button>
                             </DialogTrigger>
                             <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                   <DialogTitle className="flex items-center gap-3">
                                      <div className="p-2 bg-slate-100 rounded-lg">{app.icon}</div>
                                      Kết nối {app.name}
                                   </DialogTitle>
                                   <DialogDescription>
                                      Nhập thông tin API Key để cấp quyền truy cập cho hệ thống.
                                   </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                   <div className="flex flex-col gap-2">
                                      <label className="text-sm font-bold">Access Token</label>
                                      <Input type="password" placeholder="Nhập Token của bạn..." />
                                   </div>
                                   <div className="flex flex-col gap-2">
                                      <label className="text-sm font-bold">Webhook URL (Nhận dữ liệu)</label>
                                      <div className="flex gap-2">
                                         <Input value={`https://api.novacrm.vn/webhooks/${app.id}`} readOnly className="bg-slate-50 text-slate-500 font-mono text-xs" />
                                         <Button variant="outline" size="icon"><Key className="h-4 w-4"/></Button>
                                      </div>
                                   </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                   <Button variant="outline">Hủy</Button>
                                   <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Xác Nhận Kết Nối</Button>
                                </div>
                             </DialogContent>
                          </Dialog>
                       </div>
                    </CardContent>
                 </Card>
              ))}
           </div>
           
           {filteredApps.length === 0 && (
              <div className="text-center py-20">
                 <Puzzle className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-slate-400">Không tìm thấy ứng dụng nào</h3>
                 <p className="text-slate-500 mt-2">Thử một từ khóa khác hoặc gửi Yêu cầu tích hợp cho chúng tôi.</p>
              </div>
           )}
        </TabsContent>

      </Tabs>
    </div>
  )
}
