import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  MapPin, Tag, Sparkles, Percent, CalendarClock, Scale, 
  Image as ImageIcon, Video, Plane, Box, Glasses, MonitorPlay,
  Layers, Map, Grip, LayoutDashboard, Component,
  FileText, Landmark, HelpCircle, FileCheck, Download,
  Brain, Target, TrendingUp, LineChart as LineChartIcon, AlertTriangle
} from "lucide-react"
import { InteractiveFloorPlan } from "@/components/ui/interactive-floor-plan"
import Link from "next/link"

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Mock data
  const { id } = await params
  
  return (
    <div className="flex flex-col gap-6">
      {/* Header Profile */}
      <div className="relative overflow-hidden rounded-xl border shadow-sm bg-background">
        <div className="h-48 md:h-64 overflow-hidden relative">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" 
            alt="Project Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-6 text-white w-full">
             <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className="bg-green-500 hover:bg-green-600 text-white border-none">Đang mở bán</Badge>
              <Badge variant="outline" className="text-white border-white/50 bg-black/20 backdrop-blur-md">Khu đô thị sinh thái</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Aqua City</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-200">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Biên Hòa, Đồng Nai</span>
              <span className="flex items-center gap-1 font-semibold text-white"><Tag className="h-4 w-4" /> 10 - 50 Tỷ VNĐ</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="w-full overflow-x-auto pb-3 -mx-2 px-2 sm:mx-0 sm:px-0">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 h-auto md:h-10">
            <TabsTrigger value="overview">Tổng Quan & AI Summary</TabsTrigger>
            <TabsTrigger value="media">Sa bàn & Thư viện 3D</TabsTrigger>
            <TabsTrigger value="layout">Mặt Bằng & Thiết Kế</TabsTrigger>
            <TabsTrigger value="saleskit">Tài liệu Bán hàng (Sales Kit)</TabsTrigger>
            <TabsTrigger value="ai-investment" className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-950/50 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-colors border border-indigo-100 dark:border-indigo-900">
              <Brain className="h-4 w-4 mr-2" />
              AI Phân Tích
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Tổng Quan & AI */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-5 w-5" />
                AI Project Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
               <p className="text-sm leading-relaxed mb-4">
                 Dự án Aqua City là khu đô thị sinh thái thông minh quy mô lớn nhất miền Nam (1000ha), bao bọc bởi 32km đường sông. 
                 Điểm nhấn (USPs): Môi trường sống xanh chuẩn resort, tiện ích nội khu đẳng cấp (Bến du thuyền, Aqua Arena). 
                 <br/><br/>
                 <strong>Cơ hội bán hàng hiện tại:</strong> Phân khu Sun Harbor 1 đang mở bán với chính sách thanh toán giãn 3 năm, hỗ trợ lãi suất 0% đến khi nhận nhà.
               </p>
               <div className="flex flex-wrap gap-2 mt-4">
                 <Badge variant="secondary">Sinh thái</Badge>
                 <Badge variant="secondary">Bến du thuyền</Badge>
                 <Badge variant="secondary">Đầu tư dài hạn</Badge>
               </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Percent className="h-4 w-4" /> Chính sách chiết khấu
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg">Giảm 5% thanh toán nhanh</p>
                <p className="text-sm text-muted-foreground mt-1">Tặng gói nội thất 1 Tỷ cho biệt thự đơn lập.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" /> Tiến độ xây dựng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg text-blue-600">Đạt 70% tổng khu</p>
                <p className="text-sm text-muted-foreground mt-1">Phân khu River Park 1 đã cất nóc. Bàn giao 12/2026.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Sa Bàn & Media */}
        <TabsContent value="media" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="font-medium text-sm">Hình Ảnh</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed">
              <Video className="h-8 w-8 text-muted-foreground" />
              <span className="font-medium text-sm">Video</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed bg-blue-50 dark:bg-blue-950/20">
              <Plane className="h-8 w-8 text-blue-500" />
              <span className="font-medium text-sm text-blue-600 dark:text-blue-400">Flycam 360°</span>
            </Card>
            <Link href="/panorama" className="block">
              <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed bg-purple-50 dark:bg-purple-950/20 h-full">
                <Glasses className="h-8 w-8 text-purple-500" />
                <span className="font-medium text-sm text-purple-600 dark:text-purple-400">Tour VR</span>
              </Card>
            </Link>
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed">
              <Box className="h-8 w-8 text-muted-foreground" />
              <span className="font-medium text-sm">Sa bàn 3D</span>
            </Card>
            <Card className="flex flex-col items-center justify-center p-6 gap-3 cursor-pointer hover:bg-muted transition-colors border-dashed">
              <MonitorPlay className="h-8 w-8 text-muted-foreground" />
              <span className="font-medium text-sm">TVC</span>
            </Card>
          </div>
          
          <Card className="overflow-hidden border-none shadow-none bg-muted/30">
            <div className="h-[400px] flex items-center justify-center flex-col gap-4 text-muted-foreground">
               <Plane className="h-16 w-16 opacity-20" />
               <p>Khu vực nhúng iframe Panorama 360 / VR Tour</p>
               <Button variant="outline">Mở Toàn Màn Hình</Button>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Layout */}
        <TabsContent value="layout" className="space-y-4">
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
        <TabsContent value="saleskit" className="space-y-4">
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
        <TabsContent value="ai-investment" className="space-y-4">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
             <div>
               <h2 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="h-6 w-6 text-yellow-400" /> AI Đánh Giá Khả Thi</h2>
               <p className="text-indigo-200 mt-2">Báo cáo được tổng hợp từ dữ liệu lịch sử giá, quy hoạch hạ tầng và xu hướng dòng tiền.</p>
             </div>
             <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-center flex-shrink-0 min-w-[200px]">
               <div className="text-sm text-indigo-100 font-medium mb-1">Khuyến nghị</div>
               <div className="text-3xl font-extrabold text-green-400 drop-shadow-md">STRONG BUY</div>
               <div className="text-sm font-bold mt-1 text-yellow-300">Độ tin cậy: 88/100</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* 2. Thời gian hoàn vốn */}
             <Card>
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-blue-500" /> Điểm hòa vốn & Thu hồi vốn</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">6.5 Năm</div>
                 <p className="text-sm text-muted-foreground mb-4">Dựa trên kịch bản cho thuê 25tr/tháng và tỷ lệ lấp đầy 85%.</p>
                 <div className="w-full bg-muted rounded-full h-3">
                   <div className="bg-blue-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                 </div>
                 <div className="flex justify-between text-xs mt-1 font-medium text-muted-foreground">
                   <span>Hiện tại</span>
                   <span>Năm thứ 3</span>
                   <span>Năm thứ 6.5 (Hoàn vốn)</span>
                 </div>
               </CardContent>
             </Card>

             {/* 3. Khả năng tăng giá */}
             <Card>
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-green-500" /> Khả năng tăng giá (Capital Gain)</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">+12 - 15% / năm</div>
                 <p className="text-sm text-muted-foreground">Động lực tăng giá chính (Key Drivers):</p>
                 <ul className="mt-2 space-y-1 text-sm font-medium">
                   <li className="flex items-center gap-2">✅ Tuyến Metro số 1 đi vào hoạt động (Cách 500m)</li>
                   <li className="flex items-center gap-2">✅ Vành đai 3 dự kiến thông xe 2026</li>
                   <li className="flex items-center gap-2">✅ Nguồn cung căn hộ trung tâm khan hiếm</li>
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
                       <span className="font-bold">85 Tr/m²</span>
                     </div>
                     <div className="w-full bg-muted rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: '70%' }}></div></div>
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span className="text-muted-foreground">Trung bình khu vực</span>
                       <span className="font-bold">95 Tr/m²</span>
                     </div>
                     <div className="w-full bg-muted rounded-full h-2"><div className="bg-gray-400 h-2 rounded-full" style={{ width: '85%' }}></div></div>
                   </div>
                   <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">→ Thấp hơn thị trường 10.5%. Dư địa tăng giá còn rất tốt.</p>
                 </div>
               </CardContent>
             </Card>

             {/* 5. Dự báo thị trường */}
             <Card className="md:col-span-2">
               <CardHeader className="pb-2">
                 <CardTitle className="text-lg flex items-center gap-2"><LineChartIcon className="h-5 w-5 text-purple-500" /> Dự Báo Vĩ Mô 2026 - 2028</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/50">
                    <p className="text-sm leading-relaxed text-foreground">
                      Lãi suất cho vay đang ở mức đáy (6.5% - 7.5% cố định 2 năm đầu), kích thích dòng tiền dịch chuyển từ tiết kiệm sang BĐS thực. 
                      Đồng thời, Luật Đất Đai sửa đổi có hiệu lực sẽ đẩy chi phí đền bù giải phóng mặt bằng tăng cao, khiến mặt bằng giá sơ cấp khó có thể giảm. 
                      <strong className="text-purple-700 dark:text-purple-400"> Chu kỳ sóng tăng mới dự kiến bắt đầu bùng nổ từ Quý 2/2026. Mua vào thời điểm này là đón đúng chân sóng.</strong>
                    </p>
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* 6. Phân tích rủi ro */}
          <div className="border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 rounded-xl p-6">
             <h3 className="text-red-600 dark:text-red-400 font-bold flex items-center gap-2 text-lg mb-3">
               <AlertTriangle className="h-5 w-5" /> Cảnh Báo Rủi Ro (Risk Assessment)
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-black p-4 rounded-lg shadow-sm border border-red-100 dark:border-red-900/50">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">1. Rủi ro thanh khoản ngắn hạn</h4>
                  <p className="text-xs text-muted-foreground mt-1">Dự án thuộc phân khúc cao cấp (ticket size lớn &gt; 5 tỷ), sẽ khó sang tay lướt sóng trong thời gian dưới 6 tháng. Phù hợp đầu tư trung - dài hạn (từ 2 năm trở lên).</p>
                </div>
                <div className="bg-white dark:bg-black p-4 rounded-lg shadow-sm border border-red-100 dark:border-red-900/50">
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">2. Rủi ro pháp lý chờ sổ</h4>
                  <p className="text-xs text-muted-foreground mt-1">Dự án dự kiến bàn giao GCNQSDĐ (Sổ hồng) sau 12 - 18 tháng kể từ ngày nhận nhà. Trong thời gian này việc chuyển nhượng phải thực hiện qua HĐMB.</p>
                </div>
             </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
