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
  BrainCircuit, Star, Zap, UserCheck
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
      <div className="flex flex-col items-start gap-4 bg-background p-4 sm:p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 ring-4 ring-primary/10">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${id}`} />
            <AvatarFallback>NT</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Nguyễn Văn Tuấn</h1>
              <Badge variant="destructive" className="mt-1">Investor</Badge>
            </div>
            <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2 text-sm sm:text-base">
              <Briefcase className="h-4 w-4 shrink-0" /> Giám đốc tại Công ty Cổ phần Đầu tư XYZ
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        {/* Make TabsList horizontally scrollable to prevent breaking on mobile */}
        <div className="w-full overflow-x-auto pb-3 -mx-2 px-2 sm:mx-0 sm:px-0">
          <TabsList className="inline-flex w-max min-w-full bg-background border p-1 rounded-lg h-auto justify-start">
            <TabsTrigger value="overview" className="py-2.5 px-4 whitespace-nowrap">Tổng Quan</TabsTrigger>
            <TabsTrigger value="finance" className="py-2.5 px-4 whitespace-nowrap">Tài Chính & Đầu Tư</TabsTrigger>
            <TabsTrigger value="preferences" className="py-2.5 px-4 whitespace-nowrap">Sở Thích & Nhu Cầu</TabsTrigger>
            <TabsTrigger value="identity" className="py-2.5 px-4 whitespace-nowrap">Định Danh</TabsTrigger>
            <TabsTrigger value="journey" className="py-2.5 px-6 relative whitespace-nowrap">
               Hành Trình
               <span className="absolute top-1 right-2 flex h-2 w-2 rounded-full bg-blue-500"></span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="py-2.5 px-4 whitespace-nowrap">Lịch Sử Tương Tác</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <BrainCircuit className="h-5 w-5" />
                  Phân Tích AI CRM (Insights)
                </CardTitle>
                <Badge variant="outline" className="bg-background text-indigo-600 border-indigo-200 self-start sm:self-auto">Độ tin cậy: 92%</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Điện thoại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">090 123 4567</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold break-all">tuan.nguyen@xyz.com</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Địa chỉ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">Quận 2, TP. Hồ Chí Minh</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hồ Sơ Tài Chính</CardTitle>
              <CardDescription>Thông tin về thu nhập, tài sản và các khoản vay.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Thu Nhập (Tháng)</p>
                  <p className="font-medium text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-green-600 shrink-0"/> &gt; 100 Triệu VNĐ</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tổng Tài Sản Ước Tính</p>
                  <p className="font-medium text-lg flex items-center gap-2"><Landmark className="h-5 w-5 text-primary shrink-0"/> ~ 20 Tỷ VNĐ</p>
                </div>
                <Separator className="md:col-span-2 my-2 hidden md:block" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mức Vay Mong Muốn</p>
                  <p className="font-medium text-lg text-orange-600">5 - 7 Tỷ VNĐ</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Điểm Tín Dụng (CIC)</p>
                  <Badge variant="outline" className="text-green-600 border-green-600 font-semibold px-3 py-1">Hạng A (Rất Tốt)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Khẩu Vị & Mục Tiêu Đầu Tư</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Mục Tiêu Đầu Tư</p>
                  <p className="font-medium text-lg flex flex-wrap items-center gap-2"><Crosshair className="h-5 w-5 text-blue-500 shrink-0"/> Tích lũy tài sản & Lãi vốn</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Khẩu Vị Rủi Ro</p>
                  <p className="font-medium text-lg">Trung bình / Cao</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
           <Card>
            <CardHeader>
              <CardTitle>Sở Thích & Nhu Cầu Bất Động Sản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Khu Vực Yêu Thích</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="px-3 py-1">Quận 2 (Thủ Đức)</Badge>
                    <Badge variant="secondary" className="px-3 py-1">Quận 9</Badge>
                    <Badge variant="secondary" className="px-3 py-1">Ven sông Sài Gòn</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Loại Sản Phẩm Yêu Thích</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="px-3 py-1">Biệt thự compound</Badge>
                    <Badge variant="outline" className="px-3 py-1">Shophouse khối đế</Badge>
                  </div>
                </div>
                <Separator className="md:col-span-2 hidden md:block" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Hướng Nhà Ưu Tiên</p>
                  <p className="font-medium text-lg flex items-center gap-2 mt-1"><Compass className="h-5 w-5 text-primary shrink-0" /> Đông Nam, Nam</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Phong Thủy</p>
                  <p className="font-medium text-[15px] mt-1 leading-relaxed text-muted-foreground">Mệnh Hỏa (Tránh các căn có thủy khí quá vượng, hồ bơi lớn án ngữ trước mặt)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Định Danh</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Số CMND / CCCD</p>
                  <p className="font-medium text-lg font-mono tracking-wider break-all">079012345678</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nghề Nghiệp</p>
                  <p className="font-medium text-lg">Chủ doanh nghiệp (Sản xuất)</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Công Ty Hiện Tại</p>
                  <p className="font-medium text-lg flex items-center gap-2 mt-1"><Building2 className="h-5 w-5 text-primary shrink-0" /> Công ty Cổ phần Đầu tư XYZ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journey" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hành Trình Khách Hàng (Customer Journey)</CardTitle>
              <CardDescription>Tiến trình 12 bước từ khi tiếp cận đến khi bàn giao và giới thiệu.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-8 overflow-hidden pr-2 sm:pr-6">
              <Timeline 
                items={[
                  { title: "Facebook", description: "Tương tác với quảng cáo dự án Aqua City.", status: "completed", time: "10/06/2026 14:30", icon: <ThumbsUp /> },
                  { title: "Landing Page", description: "Truy cập trang đích và xem thông tin chi tiết.", status: "completed", time: "10/06/2026 14:35", icon: <Globe /> },
                  { title: "Lead", description: "Điền form đăng ký nhận tư vấn.", status: "completed", time: "10/06/2026 14:40", icon: <UserPlus /> },
                  { title: "Call", description: "Sale gọi điện tư vấn lần 1, đánh giá nhu cầu.", status: "completed", time: "11/06/2026 09:15", icon: <PhoneCall /> },
                  { title: "Meeting", description: "Gặp mặt trực tiếp tại quán cafe, trình bày giải pháp.", status: "completed", time: "15/06/2026 10:00", icon: <Users /> },
                  { title: "Site Tour", description: "Dẫn khách đi xem nhà mẫu và thực tế dự án.", status: "completed", time: "20/06/2026 08:30", icon: <Eye /> },
                  { title: "Booking", description: "Giữ chỗ (Booking có hoàn lại) 50 triệu VNĐ.", status: "current", time: "Hôm nay 15:00", icon: <Bookmark /> },
                  { title: "Deposit", description: "Chuyển cọc chính thức (Ký quỹ).", status: "pending", icon: <CreditCard /> },
                  { title: "Contract", description: "Ký Hợp đồng Mua bán (HĐMB).", status: "pending", icon: <FileSignature /> },
                  { title: "Mortgage", description: "Làm thủ tục vay vốn ngân hàng (Nếu có).", status: "pending", icon: <Landmark /> },
                  { title: "Handover", description: "Bàn giao nhà / Nhận sổ hồng.", status: "pending", icon: <Home /> },
                  { title: "Referral", description: "Khách hàng giới thiệu khách mới.", status: "pending", icon: <HeartHandshake /> },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch Sử Tương Tác</CardTitle>
              <CardDescription>Nhật ký toàn bộ các điểm chạm, trao đổi và giao dịch với khách hàng.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-8 overflow-hidden pr-2 sm:pr-6">
              <Timeline 
                items={[
                  { title: "Hợp đồng", description: "Khách hàng đã ký HĐMB dự án Aqua City. Giá trị: 15.4 Tỷ VNĐ.", status: "completed", time: "Hôm nay 09:00", icon: <FileSignature /> },
                  { title: "Gửi VR", description: "Gửi link thực tế ảo 3D nhà mẫu căn góc.", status: "completed", time: "Hôm qua 16:30", icon: <Glasses /> },
                  { title: "Gửi Panorama", description: "Gửi ảnh Panorama 360 độ view nhìn từ tầng 20.", status: "completed", time: "Hôm qua 16:25", icon: <Camera /> },
                  { title: "Gửi video", description: "Gửi video tiến độ dự án quay bằng flycam tháng này.", status: "completed", time: "Hôm qua 10:15", icon: <Video /> },
                  { title: "Gửi bảng giá", description: "Gửi file PDF báo giá chi tiết 3 căn biệt thự ưu tiên.", status: "completed", time: "18/07/2026 14:00", icon: <FileText /> },
                  { title: "Meeting", description: "Gặp mặt tại văn phòng công ty. Khách hàng đi cùng vợ, rất ưng ý thiết kế.", status: "completed", time: "15/07/2026 09:30", icon: <Users /> },
                  { title: "Zalo", description: "Chat Zalo: Tư vấn thêm về phương thức thanh toán chuẩn.", status: "completed", time: "12/07/2026 11:20", icon: <MessageCircle /> },
                  { title: "Email", description: "Gửi email brochure dự án và thư ngỏ.", status: "completed", time: "11/07/2026 15:45", icon: <Mail /> },
                  { title: "SMS", description: "Gửi tin nhắn xác nhận lịch hẹn tư vấn dự án.", status: "completed", time: "11/07/2026 09:20", icon: <MessageSquare /> },
                  { title: "Call", description: "Cuộc gọi telesale (4 phút 20s). Khách quan tâm đầu tư trung hạn.", status: "completed", time: "11/07/2026 09:15", icon: <PhoneCall /> },
                  { title: "Facebook", description: "Khách hàng để lại comment số điện thoại trên bài đăng Fanpage.", status: "completed", time: "10/07/2026 20:00", icon: <ThumbsUp /> },
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
