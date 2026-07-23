"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  Newspaper, Edit, Search, FileText, Globe, 
  LayoutTemplate, Image as ImageIcon, Plus, 
  Trash2, Eye, Target, Calendar, CheckCircle2, XCircle, MousePointerClick
} from 'lucide-react'
import { useStore } from '@/store/useStore'

const BANNERS = [
  { id: 1, name: 'Banner Trang Chủ (PC)', type: 'Hero Banner', status: true, schedule: 'Không thời hạn', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
  { id: 2, name: 'Popup Voucher Sinh Nhật', type: 'Modal Popup', status: false, schedule: 'Tự động theo User', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Popup Mở Bán (Giảm 5%)', type: 'Exit Intent', status: true, schedule: '10/07/2026 - 15/07/2026', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
]

export default function CMSPage() {
  const { articles, landingPages } = useStore()
  
  // Real-time SEO Editor States
  const [title, setTitle] = useState("Bảng giá Aqua City cập nhật mới nhất (Tháng 7/2026) - Chiết khấu 15%")
  const [excerpt, setExcerpt] = useState("Phân tích chi tiết bảng giá dự án Aqua City Đồng Nai. Hỗ trợ vay ngân hàng 0% lãi suất. Nhận ngay Voucher nội thất 300 triệu khi giữ chỗ...")
  const [seoScore, setSeoScore] = useState(85)
  const [titleCheck, setTitleCheck] = useState(true)
  const [excerptCheck, setExcerptCheck] = useState(true)
  
  // Banner Preview Modal
  const [previewBanner, setPreviewBanner] = useState<string | null>(null)

  useEffect(() => {
    // Calculate SEO Score dynamically
    let score = 50
    let isTitleGood = false
    let isExcerptGood = false
    
    // Title length optimal: 50-60
    if (title.length >= 50 && title.length <= 65) {
      score += 25
      isTitleGood = true
    } else if (title.length > 0) {
      score += 10
    }
    
    // Excerpt length optimal: 120-160
    if (excerpt.length >= 120 && excerpt.length <= 160) {
      score += 25
      isExcerptGood = true
    } else if (excerpt.length > 0) {
      score += 10
    }
    
    setSeoScore(score)
    setTitleCheck(isTitleGood)
    setExcerptCheck(isExcerptGood)
  }, [title, excerpt])

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
          <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold h-10 px-6">
             <Plus className="h-4 w-4 mr-2" /> Tạo Bài Viết Mới
          </Button>
        </div>
      </div>

      <Tabs defaultValue="articles" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mb-6 h-auto md:h-12 bg-slate-100">
          <TabsTrigger value="articles" className="py-2.5 font-semibold data-[state=active]:bg-white flex items-center gap-2"><FileText className="h-4 w-4 text-teal-600"/> Bài Viết & SEO</TabsTrigger>
          <TabsTrigger value="landing" className="py-2.5 font-semibold data-[state=active]:bg-white flex items-center gap-2"><LayoutTemplate className="h-4 w-4 text-indigo-600"/> Landing Pages</TabsTrigger>
          <TabsTrigger value="banners" className="py-2.5 font-semibold data-[state=active]:bg-white flex items-center gap-2"><ImageIcon className="h-4 w-4 text-pink-600"/> Banners & Popups</TabsTrigger>
        </TabsList>

        {/* 1. TAB: BÀI VIẾT & SEO */}
        <TabsContent value="articles" className="space-y-6">
           <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Danh sách bài viết */}
              <div className="xl:col-span-8 flex flex-col gap-4">
                 <Card className="shadow-sm border-0 ring-1 ring-slate-200">
                    <CardHeader className="pb-3 border-b bg-slate-50/50 rounded-t-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <CardTitle className="text-lg">Kho Bài Viết (Tin tức / Blog)</CardTitle>
                       <div className="relative w-full md:w-72">
                         <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                         <Input placeholder="Tìm kiếm tựa đề bài viết..." className="pl-9 bg-white border-slate-200" />
                       </div>
                    </CardHeader>
                    <CardContent className="p-0">
                       <div className="divide-y divide-slate-100">
                          {articles.map(post => (
                             <div key={post.id} className="p-4 md:p-5 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
                                <div className="flex-1">
                                   <div className="flex items-center gap-3 mb-2">
                                      <h4 className="font-bold text-slate-800 text-lg hover:text-teal-600 cursor-pointer">{post.title}</h4>
                                      {post.status === 'published' 
                                        ? <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Đã xuất bản</Badge>
                                        : <Badge variant="outline" className="text-slate-500 bg-white">Bản nháp</Badge>
                                      }
                                   </div>
                                   <p className="text-sm text-slate-500 mb-2 line-clamp-1">{post.excerpt}</p>
                                   <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                                      <span className="bg-slate-100 px-2 py-1 rounded">Chuyên mục: {post.category}</span>
                                      <span className="flex items-center gap-1"><Eye className="h-4 w-4 text-blue-500" /> {post.views.toLocaleString()} lượt xem</span>
                                      <span className="flex items-center gap-1">
                                        <Target className="h-4 w-4 text-teal-500" /> SEO Score: 
                                        <strong className={post.seoScore >= 80 ? 'text-green-600' : 'text-amber-600'}>{post.seoScore}/100</strong>
                                      </span>
                                   </div>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                   <Button variant="outline" size="sm" className="text-slate-600 hover:text-blue-600"><Edit className="h-4 w-4 mr-2"/> Sửa</Button>
                                   <Button variant="outline" size="icon" className="text-slate-400 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                             </div>
                          ))}
                       </div>
                    </CardContent>
                 </Card>
              </div>

              {/* SEO SIMULATOR */}
              <div className="xl:col-span-4">
                 <Card className="shadow-md border-teal-200 bg-gradient-to-b from-teal-50/50 to-white sticky top-4">
                    <CardHeader className="pb-4 border-b bg-teal-50/80 rounded-t-xl">
                       <CardTitle className="text-lg flex items-center gap-2 text-teal-900">
                          <Globe className="h-5 w-5 text-teal-600" />
                          Trình Mô Phỏng Google SEO
                       </CardTitle>
                       <CardDescription className="text-teal-700/80">Chỉnh sửa Tiêu đề và Mô tả để xem kết quả Real-time trên Google.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5">
                       
                       <div className="space-y-4 mb-6">
                         <div className="space-y-1.5">
                           <Label className="text-xs font-bold text-slate-700 uppercase flex justify-between">
                             <span>Tiêu đề bài viết (Title Tag)</span>
                             <span className={titleCheck ? 'text-green-600' : 'text-amber-500'}>{title.length}/60 ký tự</span>
                           </Label>
                           <Input value={title} onChange={(e) => setTitle(e.target.value)} className="border-teal-200 focus-visible:ring-teal-500 font-medium" />
                         </div>
                         <div className="space-y-1.5">
                           <Label className="text-xs font-bold text-slate-700 uppercase flex justify-between">
                             <span>Mô tả ngắn (Meta Description)</span>
                             <span className={excerptCheck ? 'text-green-600' : 'text-amber-500'}>{excerpt.length}/160 ký tự</span>
                           </Label>
                           <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="border-teal-200 focus-visible:ring-teal-500 text-sm resize-none" />
                         </div>
                       </div>

                       {/* Google Search Mockup */}
                       <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 font-sans">
                          <div className="text-[12px] text-[#4d5156] uppercase font-bold mb-3 flex items-center gap-1"><Globe className="h-3 w-3"/> Bản Xem Trước Mạng Tìm Kiếm</div>
                          <div className="text-[14px] text-[#202124] flex items-center gap-2 mb-1">
                             <div className="h-6 w-6 bg-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold">N</div>
                             <div>
                                <span className="block leading-tight font-medium">Nova CRM Real Estate</span>
                                <span className="block text-[#4d5156] text-[12px] leading-tight">https://novacrm.vn › tin-tuc › chi-tiet...</span>
                             </div>
                          </div>
                          <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer mb-1 leading-tight font-medium line-clamp-1 break-all">
                             {title || "Chưa nhập tiêu đề bài viết"}
                          </h3>
                          <div className="text-[14px] text-[#4d5156] leading-snug line-clamp-2 break-all">
                             {excerpt || "Chưa nhập mô tả nội dung cho bài viết này."}
                          </div>
                       </div>

                       {/* SEO Score & Checklist */}
                       <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <div>
                             <div className="flex justify-between items-center mb-1 text-sm font-bold">
                                <span>Điểm Tối Ưu (SEO Score)</span>
                                <span className={seoScore >= 80 ? 'text-green-600' : seoScore >= 50 ? 'text-amber-500' : 'text-red-500'}>
                                  {seoScore} / 100 {seoScore >= 80 ? 'Tốt' : 'Cần cải thiện'}
                                </span>
                             </div>
                             <Progress value={seoScore} className={`h-2 ${seoScore >= 80 ? '[&>div]:bg-green-500' : seoScore >= 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'}`} />
                          </div>
                          <ul className="space-y-2 text-sm mt-3">
                             <li className={`flex items-start gap-2 ${titleCheck ? 'text-green-700' : 'text-amber-600'}`}>
                                {titleCheck ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 mt-0.5 shrink-0" />} 
                                {titleCheck ? 'Độ dài tiêu đề tối ưu (50-60 ký tự).' : 'Tiêu đề nên dài từ 50-60 ký tự để không bị cắt xén.'}
                             </li>
                             <li className={`flex items-start gap-2 ${excerptCheck ? 'text-green-700' : 'text-amber-600'}`}>
                                {excerptCheck ? <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" /> : <XCircle className="h-4 w-4 mt-0.5 shrink-0" />} 
                                {excerptCheck ? 'Độ dài thẻ mô tả tối ưu (120-160 ký tự).' : 'Thẻ Meta Description nên dài từ 120-160 ký tự.'}
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
           <Card className="shadow-sm border-0 ring-1 ring-slate-200">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 bg-slate-50/50 rounded-t-xl gap-4">
                 <div>
                    <CardTitle className="text-lg">Quản lý Landing Pages (Trang Đích)</CardTitle>
                    <CardDescription>Các trang thiết kế đặc biệt để chạy quảng cáo thu thập Leads đổ về Kho Khách Hàng.</CardDescription>
                 </div>
                 <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm">
                    <LayoutTemplate className="h-4 w-4 mr-2"/> Tạo Landing Page
                 </Button>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {landingPages.map(page => (
                       <div key={page.id} className={`border rounded-xl p-5 md:p-6 transition-all ${page.status ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50 hover:shadow-lg' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                          <div className="flex justify-between items-start mb-5">
                             <div>
                                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                   {page.name}
                                   {page.status ? <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span> : <span className="flex h-2 w-2 rounded-full bg-slate-400"></span>}
                                </h3>
                                <a href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1 font-medium"><Globe className="h-3.5 w-3.5"/> novacrm.vn{page.url}</a>
                             </div>
                             <Badge variant={page.status ? "default" : "secondary"} className={page.status ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : ""}>
                               {page.status ? 'Đang chạy (Live)' : 'Đang tắt'}
                             </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-slate-100 my-4 bg-slate-50/50 rounded-lg">
                             <div className="text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Lượt truy cập</div>
                                <div className="text-2xl font-black text-slate-800">{page.visitors.toLocaleString()}</div>
                             </div>
                             <div className="text-center border-l border-r border-slate-200">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Khách (Leads)</div>
                                <div className="text-2xl font-black text-indigo-600">{page.leads}</div>
                             </div>
                             <div className="text-center">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Chuyển đổi</div>
                                <div className={`text-2xl font-black ${page.conversion >= 2 ? 'text-green-600' : 'text-amber-500'}`}>{page.conversion}%</div>
                             </div>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm gap-4 mt-2">
                             <span className="text-slate-500 flex items-center gap-1 font-medium bg-slate-100 px-2 py-1 rounded w-fit">
                                <MousePointerClick className="h-4 w-4 text-blue-500"/> Gắn mã Facebook Pixel & UTM
                             </span>
                             <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold">Cài Đặt Form</Button>
                                <Button variant="secondary" size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold">Sửa Giao Diện</Button>
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
           <Card className="shadow-sm border-0 ring-1 ring-slate-200">
              <CardHeader className="border-b pb-4 bg-slate-50/50 rounded-t-xl">
                 <CardTitle className="text-lg">Cấu hình Biển Bảng (Banner) & Popup</CardTitle>
                 <CardDescription>Quản lý các ấn phẩm quảng cáo hiển thị trên website chính thức để hút khách hàng.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-slate-100">
                    {BANNERS.map(banner => (
                       <div key={banner.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                          <div className="flex items-center gap-4">
                             <div 
                               className="h-16 w-24 bg-slate-200 rounded-lg border flex items-center justify-center shrink-0 overflow-hidden relative cursor-pointer"
                               onClick={() => setPreviewBanner(banner.image)}
                             >
                                <img src={banner.image} alt={banner.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="h-5 w-5 text-white" />
                                </div>
                             </div>
                             <div>
                                <h4 className="font-bold text-slate-800 text-base mb-1">{banner.name}</h4>
                                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm">
                                   <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">{banner.type}</Badge>
                                   <span className="text-slate-500 flex items-center gap-1 text-xs"><Calendar className="h-3.5 w-3.5 text-blue-500"/> {banner.schedule}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0">
                             <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${banner.status ? 'text-green-600' : 'text-slate-400'}`}>
                                  {banner.status ? 'Đang bật' : 'Đang tắt'}
                                </span>
                                {/* @ts-ignore */}
                                <div className={`w-10 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${banner.status ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                                   <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                </div>
                             </div>
                             <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setPreviewBanner(banner.image)}>Xem Trước</Button>
                                <Button variant="outline" size="icon" className="text-slate-500 hover:text-blue-600"><Edit className="h-4 w-4"/></Button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="p-6 border-t bg-slate-50 text-center rounded-b-xl">
                    <Button variant="outline" className="border-dashed border-2 border-slate-300 text-slate-600 font-bold bg-white w-full md:w-auto h-12 px-8">
                       <Plus className="h-4 w-4 mr-2" /> Thêm Banner / Popup Mới
                    </Button>
                 </div>
              </CardContent>
           </Card>

           {/* Banner Preview Modal */}
           <Dialog open={previewBanner !== null} onOpenChange={() => setPreviewBanner(null)}>
             <DialogContent className="max-w-3xl overflow-hidden p-0 bg-black/95 border-slate-800">
                <DialogHeader className="p-4 border-b border-slate-800 text-white flex flex-row items-center justify-between">
                   <DialogTitle>Xem Trước Banner Thực Tế</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center p-4 min-h-[400px]">
                   {previewBanner && (
                     <img src={previewBanner} alt="Banner Preview" className="max-w-full max-h-[70vh] rounded-lg shadow-2xl object-contain border border-slate-700" />
                   )}
                </div>
             </DialogContent>
           </Dialog>

        </TabsContent>

      </Tabs>
    </div>
  )
}
