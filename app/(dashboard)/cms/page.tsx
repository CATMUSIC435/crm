"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

import { 
  Newspaper, Edit, Search, FileText, Globe, 
  LayoutTemplate, Image as ImageIcon, Plus, 
  Trash2, Eye, Target, Calendar, CheckCircle2, XCircle, MousePointerClick
} from 'lucide-react'

// MOCK DATA
const ARTICLES = [
  { id: 1, title: 'Bảng giá Aqua City cập nhật tháng 7', category: 'Thị trường', status: 'published', views: 1250, seo: 95 },
  { id: 2, title: 'Lãi suất vay mua nhà giảm sâu năm 2026', category: 'Tài chính', status: 'published', views: 840, seo: 88 },
  { id: 3, title: 'Tiến độ thi công Vành Đai 3 - Q3/2026', category: 'Tiến độ dự án', status: 'draft', views: 0, seo: 45 },
]

const LANDING_PAGES = [
  { id: 1, name: 'LP_MoBan_AquaCity_T7', url: '/aqua-city-booking', visitors: 15400, leads: 320, conversion: 2.1, status: true },
  { id: 2, name: 'LP_TheGlobalCity_ThuThiem', url: '/global-city-vips', visitors: 5200, leads: 45, conversion: 0.8, status: false },
]

const BANNERS = [
  { id: 1, name: 'Banner Trang Chủ (PC)', type: 'Hero Banner', status: true, schedule: 'Không thời hạn' },
  { id: 2, name: 'Popup Voucher Sinh Nhật', type: 'Modal Popup', status: false, schedule: 'Tự động theo User' },
  { id: 3, name: 'Popup Mở Bán (Giảm 5%)', type: 'Exit Intent', status: true, schedule: '10/07/2026 - 15/07/2026' },
]

export default function CMSPage() {
  const [seoScore, setSeoScore] = useState(85)

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Newspaper className="h-8 w-8 text-teal-600" />
            Quản Trị Nội Dung (CMS)
          </h1>
          <p className="text-slate-500 mt-1">Cỗ máy tạo Inbound Leads thông qua Blog, Landing Page và Tối ưu SEO.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-300">
             <Globe className="h-4 w-4 mr-2 text-blue-600" /> Xem Website
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700 text-white">
             <Plus className="h-4 w-4 mr-2" /> Tạo Bài Viết Mới
          </Button>
        </div>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mb-6">
          <TabsTrigger value="articles" className="flex items-center gap-2"><FileText className="h-4 w-4"/> Bài Viết & SEO</TabsTrigger>
          <TabsTrigger value="landing" className="flex items-center gap-2"><LayoutTemplate className="h-4 w-4"/> Landing Pages</TabsTrigger>
          <TabsTrigger value="banners" className="flex items-center gap-2"><ImageIcon className="h-4 w-4"/> Banners & Popups</TabsTrigger>
        </TabsList>

        {/* 1. TAB: BÀI VIẾT & SEO */}
        <TabsContent value="articles" className="space-y-6">
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Danh sách bài viết */}
              <div className="xl:col-span-8 flex flex-col gap-4">
                 <Card className="shadow-sm">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                       <CardTitle className="text-lg">Danh sách Bài Viết (Tin tức / Blog)</CardTitle>
                       <div className="relative w-64">
                         <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                         <Input placeholder="Tìm bài viết..." className="pl-8 h-9" />
                       </div>
                    </CardHeader>
                    <CardContent className="p-0">
                       <div className="divide-y">
                          {ARTICLES.map(post => (
                             <div key={post.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                                <div className="flex-1">
                                   <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-slate-800 text-base">{post.title}</h4>
                                      {post.status === 'published' 
                                        ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Đã xuất bản</Badge>
                                        : <Badge variant="outline" className="text-slate-500">Bản nháp</Badge>
                                      }
                                   </div>
                                   <div className="flex items-center gap-4 text-xs text-slate-500">
                                      <span>Chuyên mục: {post.category}</span>
                                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views} lượt xem</span>
                                      <span className="flex items-center gap-1"><Target className="h-3 w-3" /> SEO Score: <strong className={post.seo >= 80 ? 'text-green-600' : 'text-amber-600'}>{post.seo}/100</strong></span>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                   <Button variant="outline" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600"><Edit className="h-4 w-4"/></Button>
                                   <Button variant="outline" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                             </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>
              </div>

              {/* SEO SIMULATOR */}
              <div className="xl:col-span-4">
                 <Card className="shadow-sm border-teal-200 bg-teal-50/30">
                    <CardHeader className="pb-3 border-b bg-white">
                       <CardTitle className="text-lg flex items-center gap-2 text-teal-800">
                          <Globe className="h-5 w-5 text-teal-600" />
                          Trình Mô Phỏng SEO (Google SERP)
                       </CardTitle>
                       <CardDescription>Kiểm tra cách bài viết hiển thị trên Google Search trước khi đăng.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                       
                       {/* Google Search Mockup */}
                       <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 font-sans">
                          <div className="text-[14px] text-[#202124] flex items-center gap-2 mb-1">
                             <div className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold">L</div>
                             <div>
                                <span className="block leading-tight">Nova CRM Real Estate</span>
                                <span className="block text-[#4d5156] text-[12px] leading-tight">https://novacrm.vn › tin-tuc › bang-gia-aqua...</span>
                             </div>
                          </div>
                          <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer mb-1 leading-tight font-medium">Bảng giá Aqua City cập nhật mới nhất (Tháng 7/2026) - Chiết khấu 15%</h3>
                          <div className="text-[14px] text-[#4d5156] leading-snug">
                             Phân tích chi tiết bảng giá dự án Aqua City Đồng Nai. Hỗ trợ vay ngân hàng 0% lãi suất. Nhận ngay Voucher nội thất 300 triệu khi giữ chỗ...
                          </div>
                       </div>

                       {/* SEO Score & Checklist */}
                       <div className="space-y-4">
                          <div>
                             <div className="flex justify-between items-center mb-1 text-sm font-bold">
                                <span>Điểm tối ưu SEO (On-page)</span>
                                <span className="text-green-600">85 / 100 Tốt</span>
                             </div>
                             <Progress value={85} className="h-2 bg-slate-200" />
                          </div>
                          <ul className="space-y-2 text-sm">
                             <li className="flex items-start gap-2 text-green-700">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> Độ dài tiêu đề (Title) chuẩn (55-60 ký tự).
                             </li>
                             <li className="flex items-start gap-2 text-green-700">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> Từ khóa "Aqua City" xuất hiện trong Tiêu đề.
                             </li>
                             <li className="flex items-start gap-2 text-amber-600">
                                <XCircle className="h-4 w-4 mt-0.5 shrink-0" /> Thiếu từ khóa chính trong URL bài viết (Slug).
                             </li>
                          </ul>
                       </div>

                    </CardContent>
                 </Card>
              </div>

           </div>
        </TabsContent>

        {/* 2. TAB: LANDING PAGES */}
        <TabsContent value="landing">
           <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
                 <div>
                    <CardTitle className="text-lg">Quản lý Landing Pages</CardTitle>
                    <CardDescription>Các trang đích để chạy quảng cáo thu thập Leads.</CardDescription>
                 </div>
                 <Button className="bg-indigo-600 hover:bg-indigo-700 text-white"><LayoutTemplate className="h-4 w-4 mr-2"/> Tạo Landing Page Mẫu</Button>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {LANDING_PAGES.map(page => (
                       <div key={page.id} className={`border rounded-xl p-5 ${page.status ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'bg-slate-50 border-slate-200 grayscale-[0.5]'}`}>
                          <div className="flex justify-between items-start mb-4">
                             <div>
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                   {page.name}
                                   {page.status ? <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> : <span className="flex h-2 w-2 rounded-full bg-slate-400"></span>}
                                </h3>
                                <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1"><Globe className="h-3 w-3"/> novacrm.vn{page.url}</a>
                             </div>
                             {/* @ts-ignore */}
                             <div className={`w-8 h-4 rounded-full flex items-center p-0.5 ${page.status ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                                <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-100 my-4">
                             <div className="text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Truy cập</div>
                                <div className="text-xl font-black text-slate-800">{page.visitors.toLocaleString()}</div>
                             </div>
                             <div className="text-center border-l border-r border-slate-100">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Khách (Leads)</div>
                                <div className="text-xl font-black text-indigo-600">{page.leads}</div>
                             </div>
                             <div className="text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Chuyển đổi</div>
                                <div className={`text-xl font-black ${page.conversion >= 2 ? 'text-green-600' : 'text-red-500'}`}>{page.conversion}%</div>
                             </div>
                          </div>

                          <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500 flex items-center gap-1"><MousePointerClick className="h-4 w-4"/> Đang chạy chiến dịch A/B Testing</span>
                             <div className="flex gap-2">
                                <Button variant="outline" size="sm">Cài Đặt Form</Button>
                                <Button variant="secondary" size="sm" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Sửa UI</Button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

        {/* 3. TAB: BANNERS & POPUPS */}
        <TabsContent value="banners">
           <Card className="shadow-sm">
              <CardHeader className="border-b pb-4">
                 <CardTitle className="text-lg">Cấu hình Biển Bảng (Banner) & Popup</CardTitle>
                 <CardDescription>Thiết lập các chiến dịch hiển thị trên website chính thức.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y">
                    {BANNERS.map(banner => (
                       <div key={banner.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50">
                          <div className="flex items-center gap-4">
                             <div className="h-16 w-24 bg-slate-200 rounded-lg border flex items-center justify-center shrink-0">
                                <ImageIcon className="h-6 w-6 text-slate-400" />
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-800 text-base">{banner.name}</h4>
                                <div className="flex items-center gap-3 text-sm mt-1">
                                   <Badge variant="outline" className="bg-slate-100 text-slate-600">{banner.type}</Badge>
                                   <span className="text-slate-500 flex items-center gap-1"><Calendar className="h-3 w-3"/> {banner.schedule}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-4">
                             <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-500 mb-1">Trạng thái</span>
                                {/* @ts-ignore */}
                                <div className={`w-8 h-4 rounded-full flex items-center p-0.5 ${banner.status ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                                   <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                </div>
                             </div>
                             <Button variant="outline" size="icon"><Edit className="h-4 w-4"/></Button>
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="p-4 md:p-6 border-t bg-slate-50 text-center">
                    <Button variant="outline" className="border-dashed border-2 border-slate-300 text-slate-600 w-full md:w-auto">
                       <Plus className="h-4 w-4 mr-2" /> Thêm Banner / Popup mới
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
