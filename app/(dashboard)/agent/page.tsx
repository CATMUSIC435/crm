"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, CircleDashed, TrendingUp, DollarSign, Users, Briefcase } from "lucide-react"
import { useStore } from '@/store/useStore'

export default function AgentDashboard() {
  const { contracts, customers } = useStore();
  const personalRevenue = contracts.reduce((sum, c) => sum + c.value, 0);
  const commission = personalRevenue * 0.03; // 3% commission
  const totalCustomers = customers.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Cá Nhân</h2>
        <p className="text-muted-foreground">Theo dõi hiệu suất, công việc và mục tiêu của bạn.</p>
      </div>

      <Tabs defaultValue="day" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="day">Hôm nay</TabsTrigger>
          <TabsTrigger value="week">Tuần này</TabsTrigger>
          <TabsTrigger value="month">Tháng này</TabsTrigger>
        </TabsList>
        <TabsContent value="day" className="space-y-6">
          
          {/* KPI Cards */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Doanh Số</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{personalRevenue.toLocaleString('vi-VN')} ₫</div>
                <p className="text-xs text-muted-foreground">+20% so với hôm qua</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoa Hồng (Dự kiến)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{commission.toLocaleString('vi-VN')} ₫</div>
                <p className="text-xs text-muted-foreground">Tạm tính (3%)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Khách Cần Chăm Sóc</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCustomers} Khách</div>
                <p className="text-xs text-muted-foreground">Theo danh sách phụ trách</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lịch Hẹn Hôm Nay</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4 Lịch</div>
                <p className="text-xs text-muted-foreground">Sắp tới: 14:00 - Xem nhà mẫu</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            {/* Tasks & News */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Công Việc Hôm Nay</CardTitle>
                <CardDescription>Bạn có 5 công việc cần hoàn thành.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-sm">Gọi điện cho anh Tuấn - Dự án Vinhomes</p>
                      <p className="text-xs text-muted-foreground">Đã hoàn thành lúc 09:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-3">
                    <CircleDashed className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Gửi báo giá cho chị Lan</p>
                      <p className="text-xs text-muted-foreground">Deadline: 14:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-3">
                    <CircleDashed className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Dẫn khách xem nhà mẫu Aqua City</p>
                      <p className="text-xs text-muted-foreground">Deadline: 16:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calendar Widget */}
            <Card className="lg:col-span-3 flex flex-col items-center justify-center p-4 md:p-6">
               <h3 className="font-semibold w-full mb-4">Lịch Công Việc</h3>
               <div className="border rounded-md p-2 w-full">
                  <div className="text-center font-medium py-4 text-muted-foreground">
                    <p>Hôm nay: 19/07/2026</p>
                  </div>
               </div>
               
               <div className="w-full mt-6">
                 <h4 className="text-sm font-semibold mb-2">Tin tức thị trường</h4>
                 <ul className="text-sm space-y-2 text-muted-foreground">
                   <li>• Lãi suất vay mua nhà giảm thêm 0.5%</li>
                   <li>• Dự án mới mở bán tại Quận 9 thu hút sự chú ý</li>
                 </ul>
               </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
