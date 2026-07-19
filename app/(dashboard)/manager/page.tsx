"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Users, Target, Activity } from "lucide-react"
import { useStore } from '@/store/useStore'

export default function ManagerDashboard() {
  const { customers, projects, contracts } = useStore();
  const totalCustomers = customers.length;
  const totalContracts = contracts.length;
  const conversionRate = totalCustomers > 0 ? ((totalContracts / totalCustomers) * 100).toFixed(1) : "0.0";
  const topProject = projects.length > 0 ? projects[0].name : "N/A";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Manager</h2>
        <p className="text-muted-foreground">Quản lý hiệu suất toàn đội, tỷ lệ chuyển đổi và các dự án top đầu.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">KPI Toàn Team</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">+5% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ Lệ Chuyển Đổi</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-muted-foreground">Trung bình ngành: 8%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng Khách Hàng (Funnel)</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Khách hàng trong hệ thống</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Dự Án</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topProject}</div>
            <p className="text-xs text-muted-foreground">Dựa trên doanh số</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Top Sales (Leaderboard)</CardTitle>
            <CardDescription>Bảng xếp hạng nhân viên xuất sắc tháng này.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhân Viên</TableHead>
                    <TableHead>Doanh Số</TableHead>
                    <TableHead>Chuyển Đổi</TableHead>
                    <TableHead className="text-right">Giao Dịch</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Nguyễn Văn A</TableCell>
                    <TableCell>4.5 Tỷ</TableCell>
                    <TableCell>18%</TableCell>
                    <TableCell className="text-right">5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Trần Thị B</TableCell>
                    <TableCell>3.2 Tỷ</TableCell>
                    <TableCell>15%</TableCell>
                    <TableCell className="text-right">3</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Lê Văn C</TableCell>
                    <TableCell>2.8 Tỷ</TableCell>
                    <TableCell>12%</TableCell>
                    <TableCell className="text-right">2</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Heatmap Khách Hàng</CardTitle>
            <CardDescription>Khu vực tập trung nhiều lead nhất.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[250px] bg-muted/20 rounded-md border border-dashed">
            <div className="text-center text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Bản đồ Heatmap (Placeholder)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
