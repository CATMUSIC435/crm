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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, Filter, Lock, CheckCircle2, Clock, CheckSquare, 
  LayoutGrid, List, BedDouble, Bath, ArrowUpRight, LockKeyhole
} from "lucide-react"
import { useStore } from "@/store/useStore"

function getStatusBadge(status: string) {
  switch (status) {
    case "Trống":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none flex items-center gap-1 w-max"><CheckCircle2 className="h-3 w-3"/> Trống</Badge>
    case "Booking":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none flex items-center gap-1 w-max"><Clock className="h-3 w-3"/> Booking</Badge>
    case "Đã bán":
      return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none flex items-center gap-1 w-max"><CheckSquare className="h-3 w-3"/> Đã bán</Badge>
    case "Đang khóa":
      return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none flex items-center gap-1 w-max"><LockKeyhole className="h-3 w-3"/> Đang khóa</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "Trống": return "bg-green-500 border-green-600 text-white"
    case "Booking": return "bg-yellow-400 border-yellow-500 text-yellow-950"
    case "Đã bán": return "bg-red-500 border-red-600 text-white opacity-80"
    case "Đang khóa": return "bg-slate-400 border-slate-500 text-white"
    default: return "bg-gray-200"
  }
}

function formatCurrency(amount: number) {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} Tỷ`
  }
  return `${(amount / 1e6).toLocaleString()} Tr`
}

export default function InventoryPage() {
  const inventory = useStore((state) => state.inventory)

  // Tính tổng giá trị rổ hàng (chỉ tính những căn trống hoặc đang booking/khóa)
  const totalValue = inventory
    .filter(i => i.status !== 'Đã bán')
    .reduce((sum, item) => sum + item.price, 0)

  // Group inventory cho Grid View
  const groupedInventory = inventory.reduce((acc, item) => {
    const tower = item.tower || 'Không xác định'
    const floor = item.floor || 0
    if (!acc[tower]) acc[tower] = {}
    if (!acc[tower][floor]) acc[tower][floor] = []
    acc[tower][floor].push(item)
    return acc
  }, {} as Record<string, Record<number, typeof inventory>>)

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
         <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-primary mb-1">Tổng giá trị (Còn lại)</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(totalValue)}</span>
          </CardContent>
        </Card>
         <Card>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-muted-foreground mb-1">Tổng sản phẩm</span>
            <span className="text-2xl font-bold">{inventory.length}</span>
          </CardContent>
        </Card>
        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Trống (Available)</span>
            <span className="text-2xl font-bold text-green-700 dark:text-green-400">
              {inventory.filter(i => i.status === 'Trống').length}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1">Booking / Giữ chỗ</span>
            <span className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
              {inventory.filter(i => i.status === 'Booking').length}
            </span>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Đã bán (Sold)</span>
            <span className="text-2xl font-bold text-red-700 dark:text-red-400">
              {inventory.filter(i => i.status === 'Đã bán').length}
            </span>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
          <TabsList className="bg-background border h-11 p-1">
            <TabsTrigger value="grid" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md"><LayoutGrid className="h-4 w-4"/> Sơ đồ phân lô</TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-md"><List className="h-4 w-4"/> Dạng bảng</TabsTrigger>
          </TabsList>

          {/* Inline Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Dự án" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả dự án</SelectItem>
                <SelectItem value="p1">Aqua City</SelectItem>
                <SelectItem value="p2">Vinhomes</SelectItem>
                <SelectItem value="p3">Global City</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="available">Trống</SelectItem>
                <SelectItem value="booking">Booking</SelectItem>
                <SelectItem value="sold">Đã bán</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="text" placeholder="Tìm mã căn..." className="pl-9" />
            </div>
          </div>
        </div>

        {/* VIEW LƯỚI (GRID MAP) */}
        <TabsContent value="grid" className="space-y-6 outline-none mt-2">
          {Object.entries(groupedInventory).map(([tower, floors]) => (
            <Card key={tower} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <CardTitle className="flex items-center justify-between">
                  <span>{tower}</span>
                  <div className="flex gap-4 text-xs font-normal">
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Trống</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Booking</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Đã bán</span>
                    <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-slate-400"></div> Đang khóa</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {Object.entries(floors).sort(([a], [b]) => Number(b) - Number(a)).map(([floor, items]) => (
                    <div key={floor} className="flex border-b last:border-0">
                      <div className="w-20 bg-muted/20 flex flex-col items-center justify-center font-bold text-muted-foreground border-r p-4 shrink-0">
                        <span className="text-xs uppercase">Tầng</span>
                        <span className="text-xl">{floor}</span>
                      </div>
                      <div className="p-4 flex-1 overflow-x-auto">
                        <div className="flex gap-3 min-w-max">
                          {items.map(item => (
                            <div 
                              key={item.id} 
                              className={`
                                relative p-3 rounded-lg border-2 min-w-[140px] cursor-pointer hover:scale-105 transition-transform shadow-sm
                                ${getStatusColor(item.status)}
                              `}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm tracking-tight drop-shadow-sm">{item.code}</span>
                                {item.status === 'Đã bán' && <Lock className="h-3 w-3" />}
                              </div>
                              <div className="text-[11px] opacity-90 font-medium">
                                {item.type}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] opacity-90 mt-1 mb-2">
                                <span className="flex items-center gap-0.5"><BedDouble className="h-3 w-3"/> {item.bedrooms || '-'}</span>
                                <span className="flex items-center gap-0.5"><Bath className="h-3 w-3"/> {item.bathrooms || '-'}</span>
                                <span>{item.area} m²</span>
                              </div>
                              <div className="font-bold drop-shadow-sm bg-black/10 inline-block px-1.5 py-0.5 rounded text-xs">
                                {formatCurrency(item.price)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* VIEW BẢNG (TABLE) */}
        <TabsContent value="list" className="outline-none mt-2">
          <Card>
            <div className="overflow-x-auto w-full pb-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Căn</TableHead>
                    <TableHead>Dự Án / Tòa</TableHead>
                    <TableHead>Loại SP</TableHead>
                    <TableHead>Thông số</TableHead>
                    <TableHead>Hướng & View</TableHead>
                    <TableHead>Giá Bán</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold text-primary">{item.code}</TableCell>
                      <TableCell>
                        <div className="font-medium">{item.projectId === 'p1' ? 'Aqua City' : item.projectId === 'p2' ? 'Vinhomes' : 'Global City'}</div>
                        <div className="text-xs text-muted-foreground">{item.tower} - Tầng {item.floor}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">{item.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">{item.area} m²</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          {item.bedrooms} PN <ArrowUpRight className="h-2 w-2"/> {item.bathrooms} WC
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{item.direction || '-'}</div>
                        <div className="text-xs text-muted-foreground">{item.view || '-'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-indigo-600 dark:text-indigo-400">{formatCurrency(item.price)}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">~ {Math.round(item.price / item.area / 1000000)} Tr/m²</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        {item.status === 'Trống' ? (
                          <Button size="sm" variant="default" className="w-full sm:w-auto h-8 text-xs">Giữ chỗ</Button>
                        ) : (
                          <Button size="sm" variant="secondary" className="w-full sm:w-auto h-8 text-xs" disabled>Đã chọn</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
