import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Phone, Mail, MapPin, Briefcase, DollarSign, Building2, Landmark, Compass, 
  Crosshair, ThumbsUp, Globe, UserPlus, PhoneCall, Users, Eye, Bookmark, 
  CreditCard, FileSignature, Home, HeartHandshake, MessageSquare, 
  MessageCircle, FileText, Video, Camera, Glasses,
  BrainCircuit, Star, Zap, UserCheck, Activity, TrendingUp, PieChart, ListChecks, Filter, CheckCircle2,
  Clock, Calendar, AlertTriangle, QrCode, Share2
} from "lucide-react"
import { Timeline } from "@/components/ui/timeline"
import { AIAssistantDialog } from "@/components/ui/ai-assistant-dialog"
import { Progress } from "@/components/ui/progress"

export default async function Customer360Page({ params }: { params: Promise<{ id: string }> }) {
  // Mock fetching data based on params.id
  const { id } = await params
  
  return (
    <div className="flex flex-col gap-6">
      {/* Header Profile */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background p-4 sm:p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 ring-4 ring-primary/10">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${id}`} />
            <AvatarFallback>NT</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Nguyễn Văn Tuấn</h1>
              <Badge variant="destructive" className="mt-1">Investor</Badge>
            </div>
            <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-sm sm:text-base">
              <Briefcase className="h-4 w-4 shrink-0" /> Giám đốc tại Công ty Cổ phần Đầu tư XYZ
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex items-center gap-3 bg-muted/30 p-2 sm:p-3 rounded-xl border border-dashed shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
          <div className="bg-white p-1.5 rounded-lg shadow-sm border">
             <QrCode className="h-10 w-10 sm:h-12 sm:w-12 text-slate-800" />
          </div>
          <div className="flex flex-col">
            <p className="text-xs sm:text-sm font-semibold text-primary">Mã giới thiệu</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Quét để đăng ký</p>
            <div className="flex items-center gap-1 mt-1 text-blue-600 hover:text-blue-700 cursor-pointer">
              <Share2 className="h-3 w-3" />
              <span className="text-[10px] font-medium">Chia sẻ</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="flex overflow-x-auto pb-2 pt-2 px-2 scrollbar-hide border-b mb-6">
          <TabsList className="h-11 bg-transparent p-0 gap-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-5">Tổng Quan</TabsTrigger>
            <TabsTrigger value="finance" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-5">Tài Chính & Đầu Tư</TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-5">Sở Thích & Nhu Cầu</TabsTrigger>
            <TabsTrigger value="identity" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-5">Định Danh</TabsTrigger>
            <TabsTrigger value="journey" className="relative data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-5">
              Hành Trình
              <span className="absolute top-1 right-2 flex h-2 w-2 rounded-full bg-blue-500"></span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-5">Lịch Sử Tương Tác</TabsTrigger>
          </TabsList>
        </div>

        {/* 1. TỔNG QUAN */}
        <TabsContent value="overview" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Insights & Health Score */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <BrainCircuit className="h-5 w-5" />
                      Phân Tích AI CRM
                    </CardTitle>
                    <Badge variant="outline" className="bg-background text-indigo-600 border-indigo-200">Độ tin cậy: 92%</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2"><Star className="h-4 w-4"/> Chấm điểm Lead</p>
                    <div className="flex items-center gap-3">
                      <Progress value={85} className="h-2 w-full" />
                      <span className="font-bold text-lg">85</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2"><Zap className="h-4 w-4"/> Dự đoán khả năng chốt</p>
                    <p className="text-xl font-bold text-green-600">Cao (75%)</p>
                    <p className="text-xs text-muted-foreground mt-1">Dự kiến trong 2 tuần tới</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2"><Building2 className="h-4 w-4"/> Gợi ý sản phẩm</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-0">Biệt thự ven sông</Badge>
                      <Badge variant="secondary">Căn góc Aqua City</Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2"><UserCheck className="h-4 w-4"/> Gợi ý Sale phù hợp</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8"><AvatarImage src="https://i.pravatar.cc/150?u=sale1" /><AvatarFallback>M</AvatarFallback></Avatar>
                      <div>
                        <p className="text-sm font-medium">Minh Phương</p>
                        <p className="text-[10px] text-muted-foreground">Chuyên gia BĐS nghỉ dưỡng</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" /> Sức Khỏe Hồ Sơ (Health Score)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Năng lực tài chính</span>
                      <span className="font-bold text-green-600">Rất Tốt</span>
                    </div>
                    <Progress value={90} className="h-2 [&>div]:bg-green-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Mức độ quan tâm dự án</span>
                      <span className="font-bold text-blue-600">Cao</span>
                    </div>
                    <Progress value={75} className="h-2 [&>div]:bg-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Độ cấp thiết mua (Urgency)</span>
                      <span className="font-bold text-orange-500">Trung bình</span>
                    </div>
                    <Progress value={50} className="h-2 [&>div]:bg-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Contact & Summary */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Liên Hệ Nhanh</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Điện thoại</p>
                      <p className="font-semibold">090 123 4567</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-semibold break-all">tuan.nguyen@xyz.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Địa chỉ</p>
                      <p className="font-semibold">Quận 2, TP. Hồ Chí Minh</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 2. TÀI CHÍNH */}
        <TabsContent value="finance" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><PieChart className="h-5 w-5 text-blue-600" /> Phân Bổ Tài Sản</CardTitle>
                <CardDescription>Cơ cấu tài sản ước tính của khách hàng (20 Tỷ VNĐ)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Bất động sản</span>
                    <span className="font-bold">60%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-green-500"></div> Tiền mặt / Tiết kiệm</span>
                    <span className="font-bold">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Cổ phiếu / Khác</span>
                    <span className="font-bold">15%</span>
                  </div>
                  
                  {/* Mock Stacked Bar Chart */}
                  <div className="h-4 w-full flex rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                    <div className="h-full bg-green-500" style={{ width: '25%' }}></div>
                    <div className="h-full bg-orange-500" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-purple-600" /> Đánh Giá Tín Dụng (Credit Check)</CardTitle>
                <CardDescription>Luồng xét duyệt năng lực vay vốn ngân hàng</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">Hạn mức vay dự kiến</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">5.0 - 7.0 Tỷ</p>
                  </div>
                  <Badge className="bg-green-500">Điểm CIC: Hạng A</Badge>
                </div>

                <div className="relative border-l-2 border-muted ml-3 space-y-5">
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-background"></span>
                    <p className="font-medium text-sm">Cung cấp hồ sơ thu nhập</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Đã nộp sao kê lương & HĐLĐ</p>
                  </div>
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-background"></span>
                    <p className="font-medium text-sm">Kiểm tra CIC</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Không có nợ xấu trong 5 năm gần nhất</p>
                  </div>
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-background"></span>
                    <p className="font-medium text-sm">Thẩm định giá tài sản đảm bảo</p>
                    <p className="text-xs text-blue-600 mt-0.5">Đang xử lý (NH Vietcombank)</p>
                  </div>
                  <div className="relative pl-6">
                    <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-slate-300 ring-4 ring-background"></span>
                    <p className="font-medium text-sm text-muted-foreground">Phê duyệt giải ngân</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 3. SỞ THÍCH & NHU CẦU */}
        <TabsContent value="preferences" className="space-y-6 outline-none">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5 text-orange-500" /> Bảng Tiêu Chí Nhu Cầu</CardTitle>
              <CardDescription>Phân tích các yêu cầu của khách hàng đối với bất động sản để Sale tư vấn chính xác nhất.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Must-have */}
                <div className="bg-red-50 dark:bg-red-950/20 p-5 rounded-xl border border-red-100 dark:border-red-900/30">
                  <h3 className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
                    <AlertTriangle className="h-4 w-4" /> Tiêu chí Bắt Buộc (Must-have)
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Vị trí</p>
                        <p className="text-xs text-muted-foreground">Khu Đông (Quận 2, Quận 9) hoặc khu compound an ninh 24/7.</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Pháp lý</p>
                        <p className="text-xs text-muted-foreground">Phải có Sổ hồng sở hữu lâu dài hoặc HĐMB rõ ràng, dự án không vướng kiện tụng.</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-red-500 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Hướng cửa/Ban công</p>
                        <p className="text-xs text-muted-foreground">Hợp Đông Tứ Trạch (Ưu tiên hướng Nam, Đông Nam).</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Nice-to-have */}
                <div className="bg-blue-50 dark:bg-blue-950/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <h3 className="font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-4">
                    <Star className="h-4 w-4" /> Tiêu chí Nên Có (Nice-to-have)
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Tiện ích xung quanh</p>
                        <p className="text-xs text-muted-foreground">Gần trường học quốc tế cho con (bán kính 3km).</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Cảnh quan</p>
                        <p className="text-xs text-muted-foreground">View sông hoặc gần công viên lớn.</p>
                      </div>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="h-5 w-5 text-blue-400 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Chính sách thanh toán</p>
                        <p className="text-xs text-muted-foreground">Ưu tiên thanh toán giãn tiến độ 2-3 năm không lãi suất.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. ĐỊNH DANH (Already done in previous step) */}
        <TabsContent value="identity" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-green-600" />
                    Trạng Thái eKYC
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-medium">Mức độ hoàn thiện</span>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Đã xác minh</Badge>
                  </div>
                  <div className="relative border-l-2 border-muted ml-3 space-y-6 pb-2">
                    <div className="relative pl-6">
                      <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-background"></span>
                      <p className="font-medium text-sm">Cập nhật thông tin</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Hoàn tất lúc 10:30, 10/06/2026</p>
                    </div>
                    <div className="relative pl-6">
                      <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-background"></span>
                      <p className="font-medium text-sm">Tải lên giấy tờ (CCCD)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Hợp lệ (Độ tin cậy 98%)</p>
                    </div>
                    <div className="relative pl-6">
                      <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-background"></span>
                      <p className="font-medium text-sm">Nhận diện khuôn mặt (Liveness)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Trùng khớp 95%</p>
                    </div>
                    <div className="relative pl-6">
                      <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-background"></span>
                      <p className="font-medium text-sm text-green-600">Đã phê duyệt</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Bởi Admin - 11:00, 10/06/2026</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông Tin Chi Tiết (Theo CCCD)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Họ và Tên</p>
                      <p className="font-medium text-base uppercase">Nguyễn Văn Tuấn</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Số CCCD / CMND</p>
                      <p className="font-medium text-base font-mono tracking-wider">079012345678</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ngày sinh</p>
                      <p className="font-medium text-base">15/08/1985</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Giới tính</p>
                      <p className="font-medium text-base">Nam</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Quê quán</p>
                      <p className="font-medium text-base">Ba Đình, Hà Nội</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nơi thường trú</p>
                      <p className="font-medium text-base">Quận 2, TP. Hồ Chí Minh</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Ngày cấp</p>
                      <p className="font-medium text-base">10/10/2021</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Nơi cấp</p>
                      <p className="font-medium text-base">Cục Cảnh sát QLHC về TTXH</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tài Liệu Đính Kèm</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50">
                      <div className="w-full aspect-[1.6/1] bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center mb-3">
                        <CreditCard className="h-10 w-10 text-slate-400" />
                      </div>
                      <p className="font-medium text-sm">CCCD Mặt Trước</p>
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                         <UserCheck className="h-3 w-3" /> Hợp lệ
                      </p>
                    </div>
                    <div className="border rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50">
                      <div className="w-full aspect-[1.6/1] bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center mb-3">
                        <CreditCard className="h-10 w-10 text-slate-400" />
                      </div>
                      <p className="font-medium text-sm">CCCD Mặt Sau</p>
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                         <UserCheck className="h-3 w-3" /> Hợp lệ
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 5. HÀNH TRÌNH */}
        <TabsContent value="journey" className="space-y-6 outline-none">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-indigo-500" /> Phễu Bán Hàng (Sales Funnel)</CardTitle>
              <CardDescription>Tiến trình chinh phục khách hàng theo từng giai đoạn chuẩn hóa.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                {/* Funnel Steps */}
                <div className="bg-indigo-100 text-indigo-800 p-4 rounded-xl shadow-sm text-center font-bold text-lg border border-indigo-200">
                  <span className="block text-xs uppercase tracking-widest mb-1 opacity-70">Giai đoạn 1</span>
                  Nhận Thức & Tiếp Cận
                  <div className="text-sm font-normal mt-2 flex justify-center gap-4">
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Quảng cáo FB</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Để lại số ĐT</span>
                  </div>
                </div>
                
                <div className="flex justify-center"><div className="w-1 h-6 bg-border"></div></div>

                <div className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow-sm text-center font-bold text-lg border border-blue-200 mx-4">
                  <span className="block text-xs uppercase tracking-widest mb-1 opacity-70">Giai đoạn 2</span>
                  Cân Nhắc & Đánh Giá
                  <div className="text-sm font-normal mt-2 flex justify-center gap-4">
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Telesale</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Gặp mặt trực tiếp</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Tham quan nhà mẫu</span>
                  </div>
                </div>

                <div className="flex justify-center"><div className="w-1 h-6 bg-border"></div></div>

                <div className="bg-orange-100 text-orange-800 p-4 rounded-xl shadow-sm text-center font-bold text-lg border border-orange-200 mx-8 relative border-2 border-orange-400">
                  <Badge className="absolute -top-3 -right-3 bg-red-500 animate-pulse">Hiện tại</Badge>
                  <span className="block text-xs uppercase tracking-widest mb-1 opacity-70">Giai đoạn 3</span>
                  Quyết Định & Giao Dịch
                  <div className="text-sm font-normal mt-2 flex justify-center gap-4">
                    <span className="flex items-center gap-1 text-orange-700 font-bold"><Clock className="h-4 w-4"/> Đang Booking (50Tr)</span>
                  </div>
                </div>

                <div className="flex justify-center"><div className="w-1 h-6 bg-border"></div></div>

                <div className="bg-slate-100 text-slate-400 p-4 rounded-xl shadow-sm text-center font-bold text-lg border border-slate-200 mx-12 border-dashed">
                  <span className="block text-xs uppercase tracking-widest mb-1 opacity-70">Giai đoạn 4</span>
                  Chăm Sóc Hậu Mãi
                  <div className="text-sm font-normal mt-2 flex justify-center gap-4">
                    Ký HĐMB ➔ Bàn Giao ➔ Giới Thiệu
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. LỊCH SỬ TƯƠNG TÁC */}
        <TabsContent value="timeline" className="space-y-6 outline-none">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-teal-600" /> Nhật Ký Tương Tác</CardTitle>
                  <CardDescription className="mt-1">Chi tiết mọi điểm chạm với khách hàng.</CardDescription>
                </div>
                {/* Mock Filter UI */}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80 px-3 py-1 text-xs flex items-center gap-1"><Filter className="h-3 w-3"/> Tất cả</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary/20 px-3 py-1 text-xs">Cuộc gọi</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary/20 px-3 py-1 text-xs">Gặp mặt</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary/20 px-3 py-1 text-xs">Giao dịch</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-8 overflow-hidden pr-2 sm:pr-6">
              <Timeline 
                items={[
                  { title: "Giữ chỗ (Booking)", description: "Khách hàng đã chuyển khoản 50 triệu giữ chỗ căn góc Aqua City. Mã giao dịch: VN283991", status: "completed", time: "Hôm nay 15:00", icon: <Bookmark className="text-orange-500" /> },
                  { title: "Gửi VR", description: "Gửi link thực tế ảo 3D nhà mẫu căn góc qua Zalo.", status: "completed", time: "Hôm qua 16:30", icon: <Glasses /> },
                  { title: "Gửi Panorama", description: "Gửi ảnh Panorama 360 độ view nhìn từ tầng 20.", status: "completed", time: "Hôm qua 16:25", icon: <Camera /> },
                  { title: "Gửi bảng giá", description: "Gửi file PDF báo giá chi tiết 3 căn biệt thự ưu tiên.", status: "completed", time: "18/07/2026 14:00", icon: <FileText /> },
                  { title: "Gặp mặt (Meeting)", description: "Gặp mặt tại văn phòng công ty. Khách hàng đi cùng vợ, rất ưng ý thiết kế nội thất gỗ.", status: "completed", time: "15/07/2026 09:30", icon: <Users className="text-blue-500" /> },
                  { title: "Zalo", description: "Chat Zalo: Tư vấn thêm về phương thức thanh toán chuẩn và chiết khấu.", status: "completed", time: "12/07/2026 11:20", icon: <MessageCircle /> },
                  { title: "Cuộc gọi (Call)", description: "Cuộc gọi telesale (4 phút 20s). Khách quan tâm đầu tư trung hạn, tài chính khoảng 7 tỷ.", status: "completed", time: "11/07/2026 09:15", icon: <PhoneCall className="text-green-500" /> },
                  { title: "Facebook", description: "Khách hàng để lại comment số điện thoại trên bài đăng Fanpage sự kiện mở bán.", status: "completed", time: "10/07/2026 20:00", icon: <ThumbsUp /> },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AIAssistantDialog />
    </div>
  )
}
