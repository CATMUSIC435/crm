"use client"
import React, { use } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  MapPin, Tag, Sparkles, Percent, CalendarClock, Scale, 
  Image as ImageIcon, Video, Plane, Box, Glasses, MonitorPlay,
  Layers, Map, Grip, LayoutDashboard, Component,
  FileText, Landmark, HelpCircle, FileCheck, Download,
  Brain, Target, TrendingUp, LineChart as LineChartIcon, AlertTriangle
} from "lucide-react"
import { InteractiveFloorPlan } from "@/components/ui/interactive-floor-plan"
import Link from "next/link"
import { useStore } from "@/store/useStore"

function formatCurrency(amount: number) {
  if (amount >= 1e12) {
    return `${(amount / 1e12).toFixed(1)} Nghìn Tỷ VNĐ`
  }
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} Tỷ VNĐ`
  }
  return `${(amount / 1e6).toLocaleString()} Tr VNĐ`
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const projects = useStore((state) => state.projects)
  
  // Find project by ID
  const project = projects.find(p => p.id === resolvedParams.id)

  if (!project) {
    return <div className="p-8 text-center text-muted-foreground">Không tìm thấy dự án.</div>
  }

  // Fallback AI Analysis Data if not provided in the store
  const aiData = project.aiAnalysis || {
    summary: `Dự án ${project.name} là một trong những điểm sáng của thị trường khu vực ${project.location}. Với quy mô ${project.totalUnits} sản phẩm, dự án đang thu hút sự quan tâm lớn.`,
    usps: ["Vị trí đắc địa", "Tiện ích đẳng cấp", "Thiết kế hiện đại"],
    rating: "BUY",
    confidence: 85,
    paybackPeriod: "7 Năm",
    capitalGain: "+10 - 12% / năm",
    keyDrivers: [
      "Hạ tầng giao thông đang hoàn thiện.",
      "Nhu cầu ở thực tăng cao.",
      "Chính sách bán hàng hấp dẫn."
    ],
    marketAverage: 80,
    macroForecast: "Thị trường đang trong giai đoạn phục hồi tốt, mặt bằng giá dự kiến tăng ổn định trong 2-3 năm tới.",
    risks: [
      { title: "Rủi ro thanh khoản", desc: "Cần thời gian để thị trường hấp thụ hết nguồn cung." }
    ]
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Profile */}
      <div className="relative overflow-hidden rounded-xl border shadow-sm bg-background">
        <div className="h-48 md:h-64 overflow-hidden relative">
          <img 
            src={project.thumbnail || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
             <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className={`${project.status === 'Đang mở bán' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white border-none shadow-sm`}>
                {project.status}
              </Badge>
              <Badge variant="outline" className="text-white border-white/50 bg-black/20 backdrop-blur-md">
                {project.type}
              </Badge>
              {project.developer && (
                <Badge variant="outline" className="text-amber-300 border-amber-300/50 bg-black/20 backdrop-blur-md">
                  CĐT: {project.developer}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 drop-shadow-md">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
              <span className="flex items-center gap-1 drop-shadow"><MapPin className="h-4 w-4" /> {project.location}</span>
              <span className="flex items-center gap-1 font-semibold text-white drop-shadow"><Tag className="h-4 w-4" /> DT Dự kiến: {formatCurrency(project.targetRevenue || project.revenue)}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full overflow-x-auto pb-3 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-hide">
          <TabsList className="flex w-max min-w-full md:grid md:w-full md:grid-cols-5 h-auto md:h-10">
            <TabsTrigger value="overview">Tổng Quan</TabsTrigger>
            <TabsTrigger value="media">Sa bàn & Media</TabsTrigger>
            <TabsTrigger value="layout">Mặt Bằng</TabsTrigger>
            <TabsTrigger value="saleskit">Sales Kit</TabsTrigger>
            <TabsTrigger value="ai-investment" className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-colors border border-indigo-100 dark:border-indigo-900">
              <Brain className="h-4 w-4 mr-2" />
              AI Phân Tích
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Tổng Quan */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <Card className="bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-background border-indigo-100 dark:border-indigo-900/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                <Sparkles className="h-5 w-5" />
                AI Project Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm leading-relaxed mb-4 text-slate-700 dark:text-slate-300">
                 {aiData.summary}
               </p>
               <div className="flex flex-wrap gap-2 mt-4">
                 {aiData.usps.map((usp, idx) => (
                   <Badge key={idx} variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-200 border-none">
                     {usp}
                   </Badge>
                 ))}
               </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Percent className="h-4 w-4" /> Chính sách ưu đãi (Giả định)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-lg text-slate-800">Chiết khấu thanh toán nhanh</p>
                <p className="text-sm text-muted-foreground mt-1">Hỗ trợ lãi suất 0% đến khi nhận nhà.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" /> Tiến độ dự án
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-bold text-lg text-blue-600">Đã bán: {project.soldUnits} / {project.totalUnits} căn</p>
                <p className="text-sm text-muted-foreground mt-1">Mở bán: {project.launchDate || 'Đang cập nhật'} - Bàn giao: {project.handoverDate || 'Đang cập nhật'}</p>
              </CardContent>
            </Card>
            <Card className="sm:col-span-2 lg:col-span-1 bg-slate-50 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Hiệu suất Bán hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-end mb-2">
                   <span className="font-bold text-2xl text-slate-800">{Math.round((project.soldUnits / project.totalUnits) * 100)}%</span>
                   <span className="text-xs text-muted-foreground mb-1">Tỷ lệ lấp đầy rổ hàng</span>
                </div>
                <Progress value={(project.soldUnits / project.totalUnits) * 100} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Sa Bàn & Media */}
        <TabsContent value="media" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="font-medium text-sm text-center">Hình Ảnh</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed">
              <Video className="h-8 w-8 text-muted-foreground" />
              <span className="font-medium text-sm text-center">Video</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed bg-blue-50 dark:bg-blue-950/20">
              <Plane className="h-8 w-8 text-blue-500" />
              <span className="font-medium text-sm text-center text-blue-600 dark:text-blue-400">Flycam 360°</span>
            </Card>
            <Link href="/panorama" className="block">
              <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed bg-purple-50 dark:bg-purple-950/20 h-full">
                <Glasses className="h-8 w-8 text-purple-500" />
                <span className="font-medium text-sm text-center text-purple-600 dark:text-purple-400">Tour VR</span>
              </Card>
            </Link>
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed">
              <Box className="h-8 w-8 text-muted-foreground" />
              <span className="font-medium text-sm text-center">Sa bàn 3D</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed">
              <MonitorPlay className="h-8 w-8 text-muted-foreground" />
              <span className="font-medium text-sm text-center">TVC</span>
            </Card>
          </div>
          
          <Card className="overflow-hidden border-none shadow-none bg-muted/30">
            <div className="h-[400px] flex items-center justify-center flex-col gap-4 text-muted-foreground">
               <Plane className="h-16 w-16 opacity-20" />
               <p>Khu vực nhúng iframe Panorama 360 / VR Tour của {project.name}</p>
               <Button variant="outline">Mở Toàn Màn Hình</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Layout */}
        <TabsContent value="layout" className="space-y-4 mt-4">
           <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:border-primary transition-colors">
              <Map className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm">Masterplan</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:border-primary transition-colors">
              <LayoutDashboard className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium text-sm">Siteplan</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:border-primary transition-colors">
              <Grip className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium text-sm">Block</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:border-primary transition-colors">
              <Layers className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium text-sm">Floor</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4 gap-2 cursor-pointer hover:border-primary transition-colors">
              <Component className="h-6 w-6 text-muted-foreground" />
              <span className="font-medium text-sm">Layout Căn</span>
            </Card>
          </div>
          <Card className="p-4 border-none shadow-none bg-transparent">
             <InteractiveFloorPlan />
          </Card>
        </TabsContent>

        {/* Tab 4: Sales Kit */}
        <TabsContent value="saleskit" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
             <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" /> Brochure Dự Án
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">PDF • 15 MB</span>
                <Button size="sm" variant="secondary"><Download className="h-4 w-4 mr-2"/> Tải về</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-green-500" /> CSBH & Ngân Hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">PDF • 2 MB</span>
                <Button size="sm" variant="secondary"><Download className="h-4 w-4 mr-2"/> Tải về</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="h-5 w-5 text-orange-500" /> Hồ Sơ Pháp Lý
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Zip • 50 MB</span>
                <Button size="sm" variant="secondary"><Download className="h-4 w-4 mr-2"/> Tải về</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-purple-500" /> Bộ câu hỏi Q&A
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Word • 1 MB</span>
                <Button size="sm" variant="secondary"><Download className="h-4 w-4 mr-2"/> Tải về</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-red-500" /> Hợp Đồng Mẫu
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">PDF • 5 MB</span>
                <Button size="sm" variant="secondary"><Download className="h-4 w-4 mr-2"/> Tải về</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 5: AI INVESTMENT */}
        <TabsContent value="ai-investment" className="space-y-4 mt-4">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
             <div>
               <h2 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-yellow-400" /> AI Đánh Giá Khả Thi</h2>
               <p className="text-indigo-200 mt-2">Báo cáo được tổng hợp từ dữ liệu lịch sử giá, quy hoạch hạ tầng và xu hướng dòng tiền cho <strong>{project.name}</strong>.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center flex-shrink-0 min-w-[200px]">
               <div className="text-sm text-indigo-100 font-medium mb-1">Khuyến nghị</div>
               <div className={`text-3xl font-extrabold drop-shadow-md ${aiData.rating === 'STRONG BUY' ? 'text-green-400' : 'text-yellow-400'}`}>
                 {aiData.rating}
               </div>
               <div className="text-sm font-bold mt-1 text-yellow-300">Độ tin cậy: {aiData.confidence}/100</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* 2. Thời gian hoàn vốn */}
             <Card>
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-blue-500" /> Điểm hòa vốn & Thu hồi vốn</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{aiData.paybackPeriod}</div>
                 <p className="text-sm text-muted-foreground mb-4">Ước tính dựa trên giá trị bất động sản và dòng tiền cho thuê kỳ vọng.</p>
                 <div className="w-full bg-muted rounded-full h-3">
                   <div className="bg-blue-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                 </div>
                 <div className="flex justify-between text-xs mt-1 font-medium text-muted-foreground">
                   <span>Hiện tại</span>
                   <span>Giữa kỳ</span>
                   <span>Hoàn vốn</span>
                 </div>
               </CardContent>
             </Card>

             {/* 3. Khả năng tăng giá */}
             <Card>
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /> Khả năng tăng giá (Capital Gain)</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{aiData.capitalGain}</div>
                 <p className="text-sm text-muted-foreground">Động lực tăng giá chính (Key Drivers):</p>
                 <ul className="mt-2 space-y-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                   {aiData.keyDrivers.map((driver, idx) => (
                     <li key={idx} className="flex items-start gap-2">
                       <span className="mt-0.5 text-green-500">✅</span> <span>{driver}</span>
                     </li>
                   ))}
                 </ul>
               </CardContent>
             </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* 4. So sánh khu vực */}
             <Card className="md:col-span-1">
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center gap-2"><Scale className="h-5 w-5 text-amber-500" /> Định Giá Cạnh Tranh</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4 mt-2">
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="font-semibold text-primary">Giá dự án này</span>
                       <span className="font-bold">{aiData.marketAverage * 0.9} Tr/m²</span>
                     </div>
                     <div className="w-full bg-muted rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: '70%' }}></div></div>
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-muted-foreground">Trung bình khu vực</span>
                       <span className="font-bold">{aiData.marketAverage} Tr/m²</span>
                     </div>
                     <div className="w-full bg-muted rounded-full h-2"><div className="bg-gray-400 h-2 rounded-full" style={{ width: '85%' }}></div></div>
                   </div>
                   <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">→ Thấp hơn thị trường khu vực. Dư địa tăng giá còn tốt.</p>
                 </div>
               </CardContent>
             </Card>

             {/* 5. Dự báo thị trường */}
             <Card className="md:col-span-2">
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center gap-2"><LineChartIcon className="h-5 w-5 text-purple-500" /> Dự Báo Vĩ Mô</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                    <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                      {aiData.macroForecast}
                    </p>
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* 6. Phân tích rủi ro */}
          <div className="border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/10 rounded-xl p-6 mt-2">
             <h3 className="text-red-600 dark:text-red-400 font-bold flex items-center gap-2 text-lg mb-4">
               <AlertTriangle className="h-5 w-5" /> Cảnh Báo Rủi Ro (Risk Assessment)
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiData.risks.map((risk, idx) => (
                  <div key={idx} className="bg-white dark:bg-black p-4 rounded-lg shadow-sm border border-red-100 dark:border-red-900/30">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{idx + 1}. {risk.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{risk.desc}</p>
                  </div>
                ))}
             </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
