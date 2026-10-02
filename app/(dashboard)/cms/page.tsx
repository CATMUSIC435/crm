"use client"
import React, { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  Newspaper, Edit, Search, FileText, Globe, LayoutTemplate, 
  Image as ImageIcon, Plus, Trash2, Eye, Target, Calendar, 
  CheckCircle2, XCircle, MousePointerClick, TrendingUp, Sparkles, 
  Share2, Download, Zap, X, Check, ArrowRight, ExternalLink, 
  SlidersHorizontal, BarChart3, AlertCircle
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Article, LandingPage, BannerItem } from '@/types'

const INITIAL_BANNERS: BannerItem[] = [
  { 
    id: 1, 
    name: 'Banner Trang Chủ (PC) - Siêu Dự Án Aqua City', 
    type: 'Hero Banner', 
    status: true, 
    schedule: 'Không thời hạn', 
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    linkUrl: 'https://novacrm.vn/landing/aqua-city',
    clicks: 1420,
    impressions: 38500
  },
  { 
    id: 2, 
    name: 'Popup Voucher Sinh Nhật VVIP 500 Triệu', 
    type: 'Modal Popup', 
    status: false, 
    schedule: 'Tự động theo User', 
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: 'https://novacrm.vn/loyalty',
    clicks: 340,
    impressions: 4200
  },
  { 
    id: 3, 
    name: 'Popup Mở Bán Phân Khu Florida (Giảm 5%)', 
    type: 'Exit Intent', 
    status: true, 
    schedule: '10/07/2026 - 15/07/2026', 
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    linkUrl: 'https://novacrm.vn/landing/novaworld',
    clicks: 890,
    impressions: 16800
  },
]

export default function CMSPage() {
  const { 
    articles, landingPages, projects, 
    addArticle, updateArticle, deleteArticle, 
    addLandingPage, toggleLandingPageStatus 
  } = useStore()
  
  // Tab control
  const [activeTab, setActiveTab] = useState('articles')

  // Search & Filter for Articles
  const [articleSearch, setArticleSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // SEO Simulator States (linked to selected or active article)
  const [selectedArticleId, setSelectedArticleId] = useState<string>('a1')
  const [title, setTitle] = useState("Bảng giá Aqua City cập nhật mới nhất (Tháng 7/2026) - Chiết khấu 15%")
  const [excerpt, setExcerpt] = useState("Phân tích chi tiết bảng giá dự án Aqua City Đồng Nai. Hỗ trợ vay ngân hàng 0% lãi suất. Nhận ngay Voucher nội thất 300 triệu khi giữ chỗ...")
  const [seoScore, setSeoScore] = useState(85)
  const [titleCheck, setTitleCheck] = useState(true)
  const [excerptCheck, setExcerptCheck] = useState(true)

  // Banners List State
  const [bannersList, setBannersList] = useState<BannerItem[]>(INITIAL_BANNERS)
  const [previewBanner, setPreviewBanner] = useState<string | null>(null)

  // Modals State
  const [isNewArticleOpen, setIsNewArticleOpen] = useState(false)
  const [isEditArticleOpen, setIsEditArticleOpen] = useState(false)
  const [isArticleReaderOpen, setIsArticleReaderOpen] = useState(false)
  const [isNewBannerOpen, setIsNewBannerOpen] = useState(false)
  const [isNewLandingOpen, setIsNewLandingOpen] = useState(false)
  const [activeArticleForAction, setActiveArticleForAction] = useState<Article | null>(null)

  // New Article Form
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Thị trường')
  const [newExcerpt, setNewExcerpt] = useState('')
  const [newAuthor, setNewAuthor] = useState('Ban Biên Tập BĐS')
  const [newThumbnail, setNewThumbnail] = useState('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
  const [newStatus, setNewStatus] = useState<'published' | 'draft'>('published')

  // New Banner Form
  const [newBannerName, setNewBannerName] = useState('')
  const [newBannerType, setNewBannerType] = useState<BannerItem['type']>('Hero Banner')
  const [newBannerSchedule, setNewBannerSchedule] = useState('Từ nay đến 31/12/2026')
  const [newBannerImage, setNewBannerImage] = useState('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')
  const [newBannerLink, setNewBannerLink] = useState('https://novacrm.vn/landing/the-global-city')

  // New Landing Page Form
  const [newLPName, setNewLPName] = useState('')
  const [newLPUrl, setNewLPUrl] = useState('/global-city-soho')
  const [newLPProject, setNewLPProject] = useState('p5')

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 4000)
  }

  // Sync active article into SEO simulator
  const handleSelectArticleForSEO = (post: Article) => {
    setSelectedArticleId(post.id)
    setTitle(post.title)
    setExcerpt(post.excerpt)
    showToast(`Đã nạp bài viết "${post.title.substring(0, 35)}..." vào trình mô phỏng SEO.`)
  }

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchSearch = a.title.toLowerCase().includes(articleSearch.toLowerCase().trim()) ||
                          a.excerpt.toLowerCase().includes(articleSearch.toLowerCase().trim()) ||
                          a.category.toLowerCase().includes(articleSearch.toLowerCase().trim())
      const matchCategory = categoryFilter === 'all' || a.category === categoryFilter
      const matchStatus = statusFilter === 'all' || a.status === statusFilter
      return matchSearch && matchCategory && matchStatus
    })
  }, [articles, articleSearch, categoryFilter, statusFilter])

  // Total KPIs
  const totalViews = useMemo(() => articles.reduce((acc, a) => acc + (a.views || 0), 0), [articles])
  const publishedCount = useMemo(() => articles.filter(a => a.status === 'published').length, [articles])
  const draftCount = useMemo(() => articles.filter(a => a.status === 'draft').length, [articles])
  const avgSeo = useMemo(() => articles.length > 0 ? Math.round(articles.reduce((acc, a) => acc + a.seoScore, 0) / articles.length) : 0, [articles])
  const totalLeadsFromLP = useMemo(() => landingPages.reduce((acc, lp) => acc + lp.leads, 0), [landingPages])

  // Toggle Banner Status
  const toggleBannerStatus = (id: number) => {
    setBannersList(prev => prev.map(b => {
      if (b.id === id) {
        const nextStatus = !b.status
        showToast(`Đã ${nextStatus ? 'BẬT' : 'TẮT'} banner "${b.name}".`)
        return { ...b, status: nextStatus }
      }
      return b
    }))
  }

  // Dynamic SEO Score calculation
  useEffect(() => {
    let score = 50
    let isTitleGood = false
    let isExcerptGood = false
    
    // Title length optimal: 50-65
    if (title.length >= 50 && title.length <= 65) {
      score += 25
      isTitleGood = true
    } else if (title.length > 0) {
      score += 10
    }
    
    // Excerpt length optimal: 120-160
    if (excerpt.length >= 120 && excerpt.length <= 165) {
      score += 25
      isExcerptGood = true
    } else if (excerpt.length > 0) {
      score += 10
    }
    
    setSeoScore(score)
    setTitleCheck(isTitleGood)
    setExcerptCheck(isExcerptGood)
  }, [title, excerpt])

  // Save Quick SEO updates back to store
  const handleSaveQuickSEO = () => {
    if (!selectedArticleId) return
    updateArticle(selectedArticleId, {
      title,
      excerpt,
      seoScore
    })
    showToast(`✅ Đã lưu cấu hình SEO mới cho bài viết (Điểm SEO: ${seoScore}/100).`)
  }

  // Create Article
  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const slug = newTitle.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    addArticle({
      title: newTitle,
      slug: slug || `bai-viet-${Date.now()}`,
      category: newCategory,
      excerpt: newExcerpt || newTitle,
      views: 0,
      seoScore: Math.min(100, Math.max(70, Math.floor(Math.random() * 20) + 80)),
      status: newStatus,
      author: newAuthor,
      publishedDate: new Date().toISOString().split('T')[0],
      thumbnail: newThumbnail,
      tags: [newCategory, 'Novaland', 'Bất Động Sản']
    })

    setIsNewArticleOpen(false)
    setNewTitle('')
    setNewExcerpt('')
    showToast(`📰 Đã xuất bản thành công bài viết "${newTitle}" lên cổng tin tức CMS!`)
  }

  // Edit Article
  const handleSaveEditArticle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeArticleForAction) return

    updateArticle(activeArticleForAction.id, {
      title: activeArticleForAction.title,
      category: activeArticleForAction.category,
      excerpt: activeArticleForAction.excerpt,
      status: activeArticleForAction.status,
      author: activeArticleForAction.author
    })

    setIsEditArticleOpen(false)
    showToast(`Đã cập nhật bài viết "${activeArticleForAction.title}".`)
    setActiveArticleForAction(null)
  }

  // Delete Article
  const handleDeleteArticle = (id: string, postTitle: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${postTitle}" không?`)) {
      deleteArticle(id)
      showToast(`Đã xóa bài viết "${postTitle}".`)
    }
  }

  // Create Banner
  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBannerName.trim()) return

    const nextId = bannersList.length + 1
    const newBanner: BannerItem = {
      id: nextId,
      name: newBannerName,
      type: newBannerType,
      status: true,
      schedule: newBannerSchedule,
      image: newBannerImage,
      linkUrl: newBannerLink,
      clicks: 0,
      impressions: 0
    }

    setBannersList([newBanner, ...bannersList])
    setIsNewBannerOpen(false)
    setNewBannerName('')
    showToast(`🖼️ Đã tạo và kích hoạt ấn phẩm Banner mới: "${newBannerName}"!`)
  }

  // Create Landing Page
  const handleCreateLandingPage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLPName.trim()) return

    addLandingPage({
      name: newLPName,
      url: newLPUrl.startsWith('/') ? newLPUrl : `/${newLPUrl}`,
      visitors: 0,
      leads: 0,
      conversion: 0,
      status: true,
      projectId: newLPProject,
      createdAt: new Date().toISOString().split('T')[0]
    })

    setIsNewLandingOpen(false)
    setNewLPName('')
    showToast(`🚀 Đã khởi tạo thành công Landing Page: ${newLPName} (${newLPUrl})!`)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Mã Bài Viết", "Tiêu Đề", "Chuyên Mục", "Trạng Thái", "Lượt Xem", "Điểm SEO", "Tác Giả", "Ngày Đăng"]
    const rows = articles.map(a => [
      a.id,
      `"${a.title.replace(/"/g, '""')}"`,
      a.category,
      a.status === 'published' ? 'Đã xuất bản' : 'Bản nháp',
      a.views,
      a.seoScore,
      `"${a.author || 'Ban Biên Tập'}"`,
      a.publishedDate || '2026-07-01'
    ])
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `CMS_DanhSach_BaiViet_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('📥 Đã tải xuống file CSV danh mục bài viết và kiểm toán SEO.')
  }

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
          <Zap className="h-5 w-5 text-teal-400 shrink-0 animate-bounce" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Điều Hành */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800 text-white">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1.5">
              <Newspaper className="h-3.5 w-3.5" /> Content Management & SEO Engine
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-xs font-bold">
              Google Core Web Vitals Ready
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Hệ Thống Quản Trị Nội Dung (CMS) & Tối Ưu SEO
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-3xl">
            Xuất bản tin tức thị trường BĐS, cẩm nang đầu tư, tối ưu hóa công cụ tìm kiếm Google Search và quản lý các trang đích thu hút Lead hữu cơ (Inbound Leads).
          </p>
        </div>

        {/* Action Buttons Header */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <Button 
            onClick={() => {
              if (articles[0]) {
                setActiveArticleForAction(articles[0])
                setIsArticleReaderOpen(true)
              }
            }}
            variant="outline"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-bold text-xs md:text-sm h-10 px-4"
          >
            <Globe className="mr-2 h-4 w-4 text-teal-400" /> Xem Trang Báo Chí
          </Button>

          <Button 
            onClick={handleExportCSV}
            variant="outline"
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 font-bold text-xs md:text-sm h-10 px-3.5"
            title="Xuất CSV Danh Mục"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button 
            onClick={() => setIsNewArticleOpen(true)}
            className="bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-500 hover:to-indigo-500 text-white font-bold text-xs md:text-sm h-10 px-5 shadow-lg shadow-teal-600/25"
          >
            <Plus className="mr-1.5 h-5 w-5" /> Soạn Thảo Bài Viết Mới
          </Button>
        </div>
      </div>

      {/* 4 Thẻ KPI Chiến Lược */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Kho Bài Viết BĐS</span>
              <span className="p-2 rounded-lg bg-teal-50 text-teal-600"><FileText className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-slate-900">{articles.length} Bài Viết</div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span className="text-emerald-700 font-semibold">{publishedCount} Đã Xuất Bản</span>
              <span className="text-amber-700 font-semibold">{draftCount} Bản Nháp</span>
            </div>
            <Progress value={(publishedCount / (articles.length || 1)) * 100} className="h-1.5 mt-2 bg-slate-100 [&>div]:bg-teal-600" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Tổng Lượt Đọc (Traffic)</span>
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600"><Eye className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-blue-600">{totalViews.toLocaleString()} Views</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5"/> +24.8% Organic Search
              </span>
              <span className="text-slate-500">Từ Google</span>
            </div>
            <div className="h-1.5 mt-2 rounded-full bg-blue-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '82%' }}></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Điểm SEO Onpage TB</span>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Target className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-emerald-600">{avgSeo} / 100</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-emerald-700 font-semibold">Tối Ưu Thẻ Meta & Snippet</span>
              <span className="text-slate-500">Rank Top 3 Google</span>
            </div>
            <Progress value={avgSeo} className="h-1.5 mt-2 bg-emerald-100 [&>div]:bg-emerald-600" />
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase text-slate-500">Leads Từ Landing Page</span>
              <span className="p-2 rounded-lg bg-pink-50 text-pink-600"><LayoutTemplate className="h-4 w-4"/></span>
            </div>
            <div className="text-2xl font-black text-pink-600">{totalLeadsFromLP} Leads</div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">{landingPages.filter(lp => lp.status).length} Landing Live</span>
              <span className="text-indigo-600 font-bold">{bannersList.filter(b => b.status).length} Banners Bật</span>
            </div>
            <div className="h-1.5 mt-2 rounded-full bg-pink-100 overflow-hidden">
              <div className="h-full bg-pink-500 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Điều Hướng */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-[620px] mb-6 h-auto md:h-12 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="articles" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4 mr-2 text-teal-600" /> Bài Viết & SEO Simulator
          </TabsTrigger>
          <TabsTrigger value="landing" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <LayoutTemplate className="h-4 w-4 mr-2 text-indigo-600" /> Trang Đích (Landing Pages)
          </TabsTrigger>
          <TabsTrigger value="banners" className="py-2.5 font-bold text-xs md:text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <ImageIcon className="h-4 w-4 mr-2 text-pink-600" /> Biển Bảng & Popups
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: BÀI VIẾT & TRÌNH MÔ PHỎNG GOOGLE SEO */}
        <TabsContent value="articles" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            
            {/* Cột trái: Danh sách bài viết & Bộ lọc (8 Cols) */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              
              {/* Thanh tìm kiếm & lọc */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                      placeholder="Tìm bài viết theo tiêu đề, chuyên mục, từ khóa..." 
                      className="pl-9 bg-slate-50 border-slate-200 text-sm" 
                      value={articleSearch}
                      onChange={e => setArticleSearch(e.target.value)}
                    />
                  </div>

                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value="all">Tất cả Chuyên mục</option>
                    <option value="Thị trường">Thị trường</option>
                    <option value="Tài chính">Tài chính</option>
                    <option value="Tiến độ dự án">Tiến độ dự án</option>
                    <option value="Cẩm nang đầu tư">Cẩm nang đầu tư</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none"
                  >
                    <option value="all">Tất cả Trạng thái</option>
                    <option value="published">Đã xuất bản</option>
                    <option value="draft">Bản nháp</option>
                  </select>
                </div>

                <div className="text-xs text-slate-500 font-semibold flex items-center justify-between md:justify-end gap-2">
                  <span><strong>{filteredArticles.length}</strong> bài viết</span>
                  {(articleSearch || categoryFilter !== 'all' || statusFilter !== 'all') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => { setArticleSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                      className="text-xs text-teal-600 hover:text-teal-700 p-0 h-auto font-bold"
                    >
                      Xóa lọc
                    </Button>
                  )}
                </div>
              </div>

              {/* Danh sách bài viết */}
              <Card className="shadow-sm border-slate-200 overflow-hidden">
                <CardHeader className="py-3 px-5 border-b bg-slate-50/70 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-slate-800">Kho Tin Tức & Cẩm Nang Bất Động Sản</CardTitle>
                  <Button 
                    size="sm" 
                    onClick={() => setIsNewArticleOpen(true)}
                    className="h-8 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Thêm Bài Mới
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100">
                    {filteredArticles.length === 0 ? (
                      <div className="p-12 text-center text-slate-400">
                        Không tìm thấy bài viết nào phù hợp với bộ lọc hiện tại.
                      </div>
                    ) : (
                      filteredArticles.map(post => {
                        const isCurrentInSEO = selectedArticleId === post.id
                        return (
                          <div 
                            key={post.id} 
                            className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                              isCurrentInSEO ? 'bg-teal-50/50 border-l-4 border-teal-500' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start gap-4 flex-1">
                              {/* Thumbnail */}
                              <div className="h-20 w-28 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative group cursor-pointer"
                                onClick={() => {
                                  setActiveArticleForAction(post)
                                  setIsArticleReaderOpen(true)
                                }}
                              >
                                <img 
                                  src={post.thumbnail || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                                  alt={post.title} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="h-5 w-5 text-white" />
                                </div>
                              </div>

                              {/* Info */}
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                                    {post.category}
                                  </Badge>
                                  {post.status === 'published' ? (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-none font-bold text-[10px]">
                                      Đã xuất bản
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-slate-600 bg-white text-[10px]">
                                      Bản nháp
                                    </Badge>
                                  )}
                                  <span className="text-[11px] text-slate-400">• {post.publishedDate || '15/07/2026'}</span>
                                  {post.author && <span className="text-[11px] text-slate-500 font-medium">Bởi: {post.author}</span>}
                                </div>

                                <h4 
                                  onClick={() => {
                                    setActiveArticleForAction(post)
                                    setIsArticleReaderOpen(true)
                                  }}
                                  className="font-bold text-slate-900 text-base hover:text-teal-600 cursor-pointer leading-snug line-clamp-1"
                                >
                                  {post.title}
                                </h4>

                                <p className="text-xs text-slate-500 line-clamp-1">{post.excerpt}</p>

                                <div className="flex items-center gap-4 text-xs pt-1">
                                  <span className="flex items-center gap-1 text-slate-600 font-medium">
                                    <Eye className="h-3.5 w-3.5 text-blue-500" /> {post.views.toLocaleString()} lượt xem
                                  </span>
                                  <span className="flex items-center gap-1 font-semibold">
                                    <Target className="h-3.5 w-3.5 text-teal-600" /> SEO: 
                                    <strong className={post.seoScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}>
                                      {post.seoScore}/100
                                    </strong>
                                  </span>
                                  <button
                                    onClick={() => handleSelectArticleForSEO(post)}
                                    className="text-[11px] text-teal-600 hover:underline font-bold"
                                  >
                                    Nạp vào SEO Simulator →
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 shrink-0 justify-end">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setActiveArticleForAction(post)
                                  setIsArticleReaderOpen(true)
                                }}
                                className="h-8 text-xs font-bold text-slate-700"
                                title="Xem nội dung báo chí"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1 text-blue-600" /> Đọc
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                  setActiveArticleForAction(post)
                                  setIsEditArticleOpen(true)
                                }}
                                className="h-8 text-xs font-bold text-slate-700 hover:text-teal-600"
                                title="Sửa bài viết"
                              >
                                <Edit className="h-3.5 w-3.5 mr-1" /> Sửa
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDeleteArticle(post.id, post.title)}
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                title="Xóa bài viết"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cột phải: Google SEO Simulator (4 Cols) */}
            <div className="xl:col-span-4">
              <Card className="shadow-md border-teal-200 bg-gradient-to-b from-teal-50/40 to-white sticky top-4">
                <CardHeader className="pb-3 border-b bg-teal-50/70 rounded-t-xl flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2 text-teal-950 font-bold">
                      <Globe className="h-5 w-5 text-teal-600" />
                      Trình Mô Phỏng Google SERP
                    </CardTitle>
                    <CardDescription className="text-xs text-teal-800">Kiểm tra hiển thị Snippet trên kết quả tìm kiếm Google.</CardDescription>
                  </div>
                  <Badge className="bg-teal-600 text-white font-bold text-xs">Live</Badge>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                  
                  {/* Inputs */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-slate-700 uppercase flex justify-between">
                        <span>Tiêu đề bài viết (Title Tag)</span>
                        <span className={titleCheck ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                          {title.length}/60 ký tự
                        </span>
                      </Label>
                      <Input 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="border-teal-200 focus-visible:ring-teal-500 font-medium text-xs md:text-sm" 
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-bold text-slate-700 uppercase flex justify-between">
                        <span>Mô tả ngắn (Meta Description)</span>
                        <span className={excerptCheck ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                          {excerpt.length}/160 ký tự
                        </span>
                      </Label>
                      <Textarea 
                        value={excerpt} 
                        onChange={(e) => setExcerpt(e.target.value)} 
                        rows={3} 
                        className="border-teal-200 focus-visible:ring-teal-500 text-xs resize-none" 
                      />
                    </div>
                  </div>

                  {/* Google Search Mockup Box */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs font-sans space-y-1.5">
                    <div className="text-[11px] text-[#4d5156] uppercase font-bold mb-2 flex items-center gap-1">
                      <Globe className="h-3 w-3 text-blue-500"/> Google Search Snippet Preview
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 bg-teal-600 text-white rounded-full flex items-center justify-center text-[10px] font-black">N</div>
                      <div className="text-xs leading-tight">
                        <span className="font-semibold text-slate-800">Nova CRM Real Estate</span>
                        <span className="text-[#4d5156] block text-[11px]">https://novacrm.vn › tin-tuc › thi-truong</span>
                      </div>
                    </div>

                    <h3 className="text-[17px] text-[#1a0dab] hover:underline cursor-pointer leading-snug font-medium line-clamp-1 break-all">
                      {title || "Chưa nhập tiêu đề bài viết"}
                    </h3>

                    <div className="text-[12px] text-[#4d5156] leading-relaxed line-clamp-2 break-all">
                      {excerpt || "Chưa nhập mô tả nội dung cho bài viết này."}
                    </div>
                  </div>

                  {/* SEO Score & Audit Checklist */}
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div>
                      <div className="flex justify-between items-center mb-1 text-xs font-bold">
                        <span className="text-slate-800">Điểm Đánh Giá Tối Ưu (SEO Score)</span>
                        <span className={seoScore >= 80 ? 'text-emerald-600' : seoScore >= 50 ? 'text-amber-500' : 'text-red-500'}>
                          {seoScore} / 100 {seoScore >= 80 ? '• Xuất sắc' : '• Cần cải thiện'}
                        </span>
                      </div>
                      <Progress 
                        value={seoScore} 
                        className={`h-2 ${seoScore >= 80 ? '[&>div]:bg-emerald-500' : '[&>div]:bg-amber-500'}`} 
                      />
                    </div>

                    <ul className="space-y-1.5 text-xs">
                      <li className={`flex items-start gap-1.5 ${titleCheck ? 'text-emerald-700 font-semibold' : 'text-amber-700'}`}>
                        {titleCheck ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />} 
                        {titleCheck ? 'Độ dài tiêu đề tối ưu (50 - 65 ký tự).' : 'Tiêu đề cần đạt 50 - 65 ký tự để tránh bị cắt xén.'}
                      </li>
                      <li className={`flex items-start gap-1.5 ${excerptCheck ? 'text-emerald-700 font-semibold' : 'text-amber-700'}`}>
                        {excerptCheck ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" /> : <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />} 
                        {excerptCheck ? 'Thẻ Meta Description tối ưu (120 - 165 ký tự).' : 'Meta Description nên dài từ 120 - 165 ký tự.'}
                      </li>
                      <li className="flex items-start gap-1.5 text-emerald-700 font-semibold">
                        <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        URL thân thiện SEO (Friendly Slug không dấu).
                      </li>
                    </ul>

                    <Button 
                      onClick={handleSaveQuickSEO} 
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs h-9 mt-1"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Lưu Thiết Lập SEO Vào Bài Viết
                    </Button>
                  </div>

                </CardContent>
              </Card>
            </div>

          </div>
        </TabsContent>

        {/* TAB 2: QUẢN LÝ LANDING PAGES */}
        <TabsContent value="landing" className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 bg-slate-50/70 gap-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Quản Lý Landing Pages (Inbound Leads Magnet)</CardTitle>
                <CardDescription className="text-xs">Các trang đích thiết kế chuyên sâu cho sự kiện mở bán và chiến dịch quảng cáo thu thập data khách hàng.</CardDescription>
              </div>
              <Button 
                onClick={() => setIsNewLandingOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5"/> Khởi Tạo Trang Đích Mới
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {landingPages.map(page => (
                  <div key={page.id} className={`border rounded-2xl p-5 md:p-6 transition-all ${page.status ? 'bg-white border-indigo-200 shadow-md ring-1 ring-indigo-50 hover:shadow-lg' : 'bg-slate-50 border-slate-200 opacity-80'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                          {page.name}
                          {page.status ? (
                            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                          ) : (
                            <span className="flex h-2 w-2 rounded-full bg-slate-400"></span>
                          )}
                        </h3>
                        <a 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault()
                            showToast(`Đang mở xem thử trang đích: novacrm.vn${page.url}`)
                          }}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 font-mono font-medium"
                        >
                          <Globe className="h-3 w-3"/> novacrm.vn{page.url}
                        </a>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={page.status ? "bg-emerald-100 text-emerald-800 border-none font-bold text-[10px]" : "bg-slate-200 text-slate-700 text-[10px]"}>
                          {page.status ? 'Đang chạy (Live)' : 'Đang tạm tắt'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleLandingPageStatus(page.id)}
                          className="h-7 text-[10px] font-bold px-2"
                        >
                          {page.status ? 'Tắt' : 'Bật'}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Thống kê hiệu suất */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 my-3 bg-slate-50/70 rounded-xl">
                      <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Lượt truy cập</div>
                        <div className="text-xl font-black text-slate-800">{page.visitors.toLocaleString()}</div>
                      </div>
                      <div className="text-center border-x border-slate-200">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Leads Thu Về</div>
                        <div className="text-xl font-black text-indigo-600">{page.leads}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Chuyển Đổi (CVR)</div>
                        <div className={`text-xl font-black ${page.conversion >= 2 ? 'text-emerald-600' : 'text-amber-500'}`}>{page.conversion}%</div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs gap-3 mt-3">
                      <span className="text-slate-500 flex items-center gap-1 font-medium bg-slate-100 px-2 py-1 rounded w-fit">
                        <MousePointerClick className="h-3.5 w-3.5 text-blue-500"/> Gắn mã Meta Pixel & CAPI
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => showToast(`Cấu hình form thu thập Lead cho Landing Page ${page.name}.`)}
                          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold text-xs h-8"
                        >
                          Cài Đặt Form
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => showToast(`Mở trình biên tập Drag & Drop cho Landing Page ${page.name}.`)}
                          className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs h-8"
                        >
                          Sửa Giao Diện
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: BIỂN BẢNG & POPUPS */}
        <TabsContent value="banners" className="space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 bg-slate-50/70 gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Quản Lý Banner Trang Chủ & Popups Quảng Cáo</CardTitle>
                <CardDescription className="text-xs">Cấu hình các ấn phẩm banner trượt, popup kích hoạt sự kiện mở bán và ưu đãi độc quyền.</CardDescription>
              </div>
              <Button 
                onClick={() => setIsNewBannerOpen(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs h-9 shadow-sm"
              >
                <Plus className="h-4 w-4 mr-1.5" /> Thêm Banner / Popup Mới
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {bannersList.map(banner => (
                  <div key={banner.id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      {/* Image Thumbnail */}
                      <div 
                        className="h-16 w-28 bg-slate-200 rounded-xl border flex items-center justify-center shrink-0 overflow-hidden relative cursor-pointer group"
                        onClick={() => setPreviewBanner(banner.image)}
                      >
                        <img src={banner.image} alt={banner.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="h-5 w-5 text-white" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 text-sm md:text-base mb-1">{banner.name}</h4>
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs">
                          <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200 font-bold text-[10px]">
                            {banner.type}
                          </Badge>
                          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                            <Calendar className="h-3 w-3 text-blue-500"/> {banner.schedule}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-600 font-medium text-[11px]">
                            Clicks: <strong>{banner.clicks?.toLocaleString() || 0}</strong> / Imp: <strong>{banner.impressions?.toLocaleString() || 0}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto mt-2 md:mt-0">
                      {/* Công tắc Bật/Tắt */}
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${banner.status ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {banner.status ? 'Đang bật' : 'Đang tắt'}
                        </span>
                        <div 
                          onClick={() => toggleBannerStatus(banner.id)}
                          className={`w-10 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${banner.status ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                        >
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setPreviewBanner(banner.image)}
                          className="h-8 text-xs font-bold"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Xem Thử
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => showToast(`Chỉnh sửa liên kết và thời gian hiển thị cho banner ${banner.name}.`)}
                          className="h-8 text-xs font-bold text-slate-700"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" /> Sửa
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL 1: SOẠN THẢO BÀI VIẾT MỚI */}
      <Dialog open={isNewArticleOpen} onOpenChange={setIsNewArticleOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-teal-600" /> Soạn Thảo & Đăng Bài Viết Mới
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Nhập thông tin bài viết để xuất bản lên cổng tin tức và tối ưu hóa SEO tự động.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateArticle} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Tiêu Đề Bài Viết *</Label>
              <Input 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                placeholder="Ví dụ: Phân tích tiềm năng sinh lời Biệt thự Florida NovaWorld Phan Thiết 2026" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Chuyên Mục</Label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  <option value="Thị trường">Thị trường</option>
                  <option value="Tài chính">Tài chính</option>
                  <option value="Tiến độ dự án">Tiến độ dự án</option>
                  <option value="Cẩm nang đầu tư">Cẩm nang đầu tư</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Tác Giả</Label>
                <Input 
                  value={newAuthor} 
                  onChange={e => setNewAuthor(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Đường Dẫn Ảnh Bìa (Thumbnail URL)</Label>
              <Input 
                value={newThumbnail} 
                onChange={e => setNewThumbnail(e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Đoạn Tóm Tắt (Meta Description)</Label>
              <Textarea 
                value={newExcerpt} 
                onChange={e => setNewExcerpt(e.target.value)} 
                rows={3} 
                placeholder="Tóm tắt ngắn gọn 120-160 ký tự để hiển thị trên Google..."
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Trạng Thái Xuất Bản</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input 
                    type="radio" 
                    name="pubStatus" 
                    checked={newStatus === 'published'} 
                    onChange={() => setNewStatus('published')} 
                  /> 
                  <span>Xuất bản ngay (Published)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input 
                    type="radio" 
                    name="pubStatus" 
                    checked={newStatus === 'draft'} 
                    onChange={() => setNewStatus('draft')} 
                  /> 
                  <span>Lưu bản nháp (Draft)</span>
                </label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsNewArticleOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                Xuất Bản Bài Viết
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CHỈNH SỬA BÀI VIẾT */}
      <Dialog open={isEditArticleOpen} onOpenChange={setIsEditArticleOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Edit className="h-5 w-5 text-teal-600" /> Chỉnh Sửa Bài Viết
            </DialogTitle>
          </DialogHeader>

          {activeArticleForAction && (
            <form onSubmit={handleSaveEditArticle} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Tiêu Đề</Label>
                <Input 
                  value={activeArticleForAction.title} 
                  onChange={e => setActiveArticleForAction({ ...activeArticleForAction, title: e.target.value })} 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Chuyên Mục</Label>
                  <select
                    value={activeArticleForAction.category}
                    onChange={e => setActiveArticleForAction({ ...activeArticleForAction, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                  >
                    <option value="Thị trường">Thị trường</option>
                    <option value="Tài chính">Tài chính</option>
                    <option value="Tiến độ dự án">Tiến độ dự án</option>
                    <option value="Cẩm nang đầu tư">Cẩm nang đầu tư</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Trạng Thái</Label>
                  <select
                    value={activeArticleForAction.status}
                    onChange={e => setActiveArticleForAction({ ...activeArticleForAction, status: e.target.value as any })}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                  >
                    <option value="published">Đã xuất bản (Live)</option>
                    <option value="draft">Bản nháp (Draft)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Mô Tả Meta</Label>
                <Textarea 
                  value={activeArticleForAction.excerpt} 
                  onChange={e => setActiveArticleForAction({ ...activeArticleForAction, excerpt: e.target.value })} 
                  rows={3} 
                />
              </div>

              <DialogFooter className="pt-4 border-t">
                <Button type="button" variant="outline" onClick={() => setIsEditArticleOpen(false)}>Hủy</Button>
                <Button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold">
                  Lưu Thay Đổi
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* MODAL 3: BẢN XEM TRƯỚC BÀI VIẾT CHUẨN BÁO CHÍ BĐS */}
      <Dialog open={isArticleReaderOpen} onOpenChange={setIsArticleReaderOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden flex flex-col">
          <DialogHeader className="p-4 border-b bg-slate-50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-teal-600 text-white font-bold text-xs">{activeArticleForAction?.category || 'Tin Thị Trường'}</Badge>
              <span className="text-xs text-slate-500 font-mono">novacrm.vn/tin-tuc/{activeArticleForAction?.slug}</span>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setIsArticleReaderOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-white">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {activeArticleForAction?.title}
            </h1>

            <div className="flex items-center justify-between py-3 border-y border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center">
                  {activeArticleForAction?.author?.charAt(0) || 'B'}
                </div>
                <div>
                  <div className="font-bold text-slate-800">{activeArticleForAction?.author || 'Ban Phân Tích BĐS Nova CRM'}</div>
                  <div className="text-[11px]">Cập nhật: {activeArticleForAction?.publishedDate || '15/07/2026'} • 5 phút đọc</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Eye className="h-4 w-4 text-blue-500" /> {activeArticleForAction?.views.toLocaleString()} lượt xem
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600">
                  <Target className="h-4 w-4" /> SEO: {activeArticleForAction?.seoScore}/100
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <img 
                src={activeArticleForAction?.thumbnail || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                alt="Article Featured" 
                className="w-full h-72 md:h-96 object-cover" 
              />
              <div className="p-2.5 bg-slate-50 text-[11px] text-slate-500 text-center italic">
                Hình ảnh thực tế dự án đang thu hút sự quan tâm lớn của giới đầu tư trong quý 3/2026.
              </div>
            </div>

            {/* Sapo / Lead text */}
            <p className="text-base font-bold text-slate-800 leading-relaxed border-l-4 border-teal-500 pl-4 py-1 italic bg-teal-50/30 rounded-r-xl">
              {activeArticleForAction?.excerpt}
            </p>

            {/* Content mockup */}
            <div className="prose prose-slate max-w-none space-y-4 text-slate-700 text-sm leading-relaxed">
              <p>
                Thị trường bất động sản phía Nam đang chứng kiến sự trỗi dậy mạnh mẽ của các đại đô thị vệ tinh được quy hoạch bài bản. Với việc các tuyến cao tốc huyết mạch và đường Vành Đai 3 chuẩn bị thông xe kỹ thuật, bài toán kết nối giao thông giữa trung tâm TP.HCM và các vùng kinh tế trọng điểm đã được giải quyết triệt để.
              </p>
              <p>
                Theo khảo sát độc quyền từ sàn giao dịch Nova CRM, tỷ lệ hấp thụ tại phân khúc nhà phố và biệt thự biển trong tháng qua đạt tới <strong>78.5%</strong>. Khách hàng đặc biệt ưa chuộng các gói giải pháp tài chính hỗ trợ <strong>0% lãi suất trong 24 tháng</strong> kết hợp cam kết cho thuê sinh lời bền vững.
              </p>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-2">Đăng Ký Nhận Trọn Bộ Bảng Giá & Phân Tích Dòng Tiền:</div>
                <div className="flex gap-2">
                  <Input placeholder="Nhập số điện thoại Zalo của bạn..." className="text-xs h-9 bg-white" />
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs h-9 px-4 shrink-0">
                    Gửi Ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 border-t bg-slate-50 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setIsArticleReaderOpen(false)
                if (activeArticleForAction) handleSelectArticleForSEO(activeArticleForAction)
              }}
              className="text-xs font-bold text-teal-700 border-teal-200"
            >
              Chỉnh Sửa SEO Cho Bài Này
            </Button>
            <Button size="sm" onClick={() => setIsArticleReaderOpen(false)} className="bg-slate-800 text-white font-bold text-xs">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: THÊM BANNER MỚI */}
      <Dialog open={isNewBannerOpen} onOpenChange={setIsNewBannerOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-pink-600" /> Thêm Biển Bảng (Banner) Hoặc Popup Mới
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateBanner} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Tên Ấn Phẩm Quảng Cáo *</Label>
              <Input 
                value={newBannerName} 
                onChange={e => setNewBannerName(e.target.value)} 
                placeholder="Ví dụ: Banner Popup Mở Bán Phân Khu Mới" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Loại Banner</Label>
                <select
                  value={newBannerType}
                  onChange={e => setNewBannerType(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
                >
                  <option value="Hero Banner">Hero Banner (Trang chủ)</option>
                  <option value="Modal Popup">Modal Popup (Tự động)</option>
                  <option value="Exit Intent">Exit Intent (Khi rời trang)</option>
                  <option value="Sidebar Banner">Sidebar Banner (Cột bên)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700 uppercase">Lịch Trình Hiển Thị</Label>
                <Input 
                  value={newBannerSchedule} 
                  onChange={e => setNewBannerSchedule(e.target.value)} 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Link Ảnh Banner</Label>
              <Input 
                value={newBannerImage} 
                onChange={e => setNewBannerImage(e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Đường Link Đích Khi Click</Label>
              <Input 
                value={newBannerLink} 
                onChange={e => setNewBannerLink(e.target.value)} 
              />
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsNewBannerOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white font-bold">
                Kích Hoạt Banner
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: KHỞI TẠO LANDING PAGE MỚI */}
      <Dialog open={isNewLandingOpen} onOpenChange={setIsNewLandingOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-600" /> Khởi Tạo Trang Đích (Landing Page) Mới
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateLandingPage} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Tên Landing Page *</Label>
              <Input 
                value={newLPName} 
                onChange={e => setNewLPName(e.target.value)} 
                placeholder="Ví dụ: LP_MoBan_TheGlobalCity_Soho" 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Đường Dẫn URL Slug *</Label>
              <Input 
                value={newLPUrl} 
                onChange={e => setNewLPUrl(e.target.value)} 
                placeholder="/global-city-vips" 
                required 
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase">Dự Án Trọng Điểm</Label>
              <select
                value={newLPProject}
                onChange={e => setNewLPProject(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium outline-none"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsNewLandingOpen(false)}>Hủy</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Tạo Trang Đích
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Banner Preview Modal */}
      <Dialog open={previewBanner !== null} onOpenChange={() => setPreviewBanner(null)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0 bg-black/95 border-slate-800">
          <DialogHeader className="p-4 border-b border-slate-800 text-white flex flex-row items-center justify-between">
            <DialogTitle className="text-sm font-bold">Xem Trước Ấn Phẩm Banner</DialogTitle>
            <Button size="sm" variant="ghost" onClick={() => setPreviewBanner(null)} className="text-white hover:bg-slate-800">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="flex items-center justify-center p-6 min-h-[350px]">
            {previewBanner && (
              <img src={previewBanner} alt="Banner Preview" className="max-w-full max-h-[70vh] rounded-xl shadow-2xl object-contain border border-slate-700" />
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
