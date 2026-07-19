"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Search, Filter, Lock, CheckCircle2, Clock, CheckSquare } from "lucide-react"
import { useStore } from "@/store/useStore"

function getStatusBadge(status: string) {
  switch (status) {
    case "Trống":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Trống</Badge>
    case "Booking":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none flex items-center gap-1"><CheckSquare className="h-3 w-3"/> Booking</Badge>
    case "Đã bán":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none flex items-center gap-1"><Lock className="h-3 w-3"/> Đã bán</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

export default function InventoryPage() {
  const inventory = useStore((state) => state.inventory)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rổ Hàng (Inventory)</h1>
          <p className="text-muted-foreground mt-1">Tìm kiếm và quản lý trạng thái sản phẩm theo thời gian thực.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Bộ lọc nâng cao
          </Button>
          <Button>Xuất Excel</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-muted-foreground mb-1">Tổng sản phẩm</span>
            <span className="text-3xl font-bold">1,250</span>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Trống (Available)</span>
            <span className="text-3xl font-bold text-green-700 dark:text-green-400">432</span>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1">Booking / Giữ chỗ</span>
            <span className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">125</span>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Đã bán (Sold)</span>
            <span className="text-3xl font-bold text-red-700 dark:text-red-400">693</span>
          </CardContent>
        </Card>
      </div>

      {/* Hierarchical Filters */}
      <Card>
        <CardContent className="p-4">
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">1. Dự Án</label>
                <Select defaultValue="all">
                  <SelectTrigger><SelectValue placeholder="Chọn dự án" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả dự án</SelectItem>
                    <SelectItem value="aqc">Aqua City</SelectItem>
                    <SelectItem value="vhm">Vinhomes Grand Park</SelectItem>
                    <SelectItem value="tgc">The Global City</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">2. Phân khu / Tower</label>
                <Select disabled>
                  <SelectTrigger><SelectValue placeholder="Chọn Tower" /></SelectTrigger>
                  <SelectContent>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">3. Tầng (Floor)</label>
                <Select disabled>
                  <SelectTrigger><SelectValue placeholder="Chọn Tầng" /></SelectTrigger>
                  <SelectContent>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Tình trạng</label>
                <Select defaultValue="all">
                  <SelectTrigger><SelectValue placeholder="Tình trạng" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="available">Trống</SelectItem>
                    <SelectItem value="holding">Giữ chỗ / Booking</SelectItem>
                    <SelectItem value="sold">Đã bán</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                 <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="text" placeholder="Tìm mã căn..." className="pl-9" />
                 </div>
              </div>
           </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto w-full pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Project ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-semibold">{item.id}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.projectId}</TableCell>
                  <TableCell><Badge variant="outline">{item.type}</Badge></TableCell>
                  <TableCell className="font-medium text-indigo-600 dark:text-indigo-400">{item.price}</TableCell>
                  <TableCell>{item.area} m²</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell className="text-right">
                    {item.status === 'Trống' ? (
                      <Button size="sm" variant="default" className="w-full sm:w-auto">Giữ chỗ</Button>
                    ) : (
                      <Button size="sm" variant="secondary" className="w-full sm:w-auto" disabled>Chi tiết</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
