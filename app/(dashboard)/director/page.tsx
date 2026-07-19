"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeDollarSign, Wallet, FileText, Package, Megaphone, BrainCircuit } from "lucide-react"
import { useStore } from '@/store/useStore'

export default function DirectorDashboard() {
  const { contracts, inventory } = useStore();
  const totalRevenue = (contracts.reduce((sum, c) => sum + c.value, 0) / 1000000000).toFixed(1);
  const totalContracts = contracts.length;
  const totalInventory = inventory.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Director</h2>
        <p className="text-muted-foreground">Tổng quan tài chính, dòng tiền và AI dự báo doanh số.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Doanh Thu (YTD)</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{totalRevenue} Tỷ ₫</div>
            <p className="text-xs text-muted-foreground mt-1">+12.5% so với cùng kỳ năm ngoái</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Realtime</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.filter(i => i.status === 'Booking').length} Booking</div>
            <p className="text-xs text-muted-foreground text-green-600 font-medium mt-1">Đang chờ xử lý trong 24h qua</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dòng Tiền (Tháng này)</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+ 18.5 Tỷ ₫</div>
            <p className="text-xs text-muted-foreground mt-1">Dự kiến thu thêm 5 Tỷ tuần tới</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hợp Đồng Chờ Ký</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">Hợp đồng đã chốt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tồn Kho (Giỏ hàng)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInventory} Căn</div>
            <p className="text-xs text-muted-foreground mt-1">Tốc độ tiêu thụ: 15 căn/tuần</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hiệu Quả Marketing (ROI)</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245%</div>
            <p className="text-xs text-muted-foreground mt-1">Chi phí / Lead: 150.000 ₫</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-indigo-500" />
            <CardTitle>AI Dự Báo Doanh Số</CardTitle>
          </div>
          <CardDescription>Mô hình học máy dự báo xu hướng doanh thu quý tới dựa trên dữ liệu lịch sử và biến động thị trường.</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] w-full flex items-center justify-center bg-muted/10 border rounded-md">
           <div className="text-center text-muted-foreground max-w-sm">
              <p className="font-medium">Biểu đồ Dự Báo AI (Sẽ tích hợp Recharts)</p>
              <p className="text-xs mt-2">Đang xử lý dữ liệu từ Vercel AI SDK để render biểu đồ dự báo 3 tháng tới...</p>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
