"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  FileSignature, Download, Printer, Share2, Search, Filter, 
  CheckCircle2, Clock, Landmark, User, FileText, ChevronRight, Eye
} from 'lucide-react'
import { useStore } from "@/store/useStore"
import Link from 'next/link'

function getStatusBadge(status: string) {
  switch (status) {
    case "Đã ký":
      return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-none flex items-center gap-1 w-max"><CheckCircle2 className="h-3 w-3"/> Đã ký</Badge>
    case "Chờ duyệt":
      return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-none flex items-center gap-1 w-max"><Clock className="h-3 w-3"/> Chờ duyệt</Badge>
    case "Hủy":
    case "Đã thanh lý":
      return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none flex items-center gap-1 w-max">Đã thanh lý</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function getTypeBadge(type: string | undefined) {
  if (!type) return null
  switch (type) {
    case "Hợp đồng mua bán":
      return <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50 font-normal">{type}</Badge>
    case "Hợp đồng đặt cọc":
      return <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50 font-normal">{type}</Badge>
    case "Thỏa thuận giữ chỗ":
      return <Badge variant="outline" className="border-orange-300 text-orange-700 bg-orange-50 font-normal">{type}</Badge>
    default:
      return <Badge variant="outline" className="font-normal">{type}</Badge>
  }
}

function formatCurrency(amount: number) {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} Tỷ`
  }
  return `${(amount / 1e6).toLocaleString()} Tr`
}

export default function ContractPage() {
  const { contracts, customers, projects, inventory } = useStore()
  const [searchTerm, setSearchTerm] = useState('')

  // Calculate KPIs
  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0)
  const signedCount = contracts.filter(c => c.status === 'Đã ký').length
  const pendingCount = contracts.filter(c => c.status === 'Chờ duyệt').length

  // Helper to lookup names
  const getCustomerName = (id: string) => customers.find(c => c.id === id)?.name || id
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || id
  const getUnitCode = (id: string) => inventory.find(i => i.id === id)?.code || id

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileSignature className="h-8 w-8 text-blue-600" />
            Hợp Đồng & Pháp Lý
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý hồ sơ pháp lý và tiến độ thanh toán của khách hàng.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Printer className="h-4 w-4 mr-2" /> In Ấn</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Download className="h-4 w-4 mr-2" /> Xuất Báo Cáo</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Landmark className="h-5 w-5" />
              <span className="font-semibold">Tổng Doanh Số Ký Kết</span>
            </div>
            <span className="text-4xl font-bold text-blue-900">{formatCurrency(totalValue)}</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-semibold">Đã Ký Chính Thức</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{signedCount}</span>
              <span className="text-sm text-muted-foreground">hợp đồng</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Đang Chờ Phê Duyệt</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">{pendingCount}</span>
              <span className="text-sm text-muted-foreground">hồ sơ</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[250px] relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Tìm theo Mã HĐ, Tên Khách Hàng, Mã Căn..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Loại Hợp Đồng" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả Loại HĐ</SelectItem>
              <SelectItem value="hđmb">Hợp đồng mua bán</SelectItem>
              <SelectItem value="hđđc">Hợp đồng đặt cọc</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Trạng thái" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả Trạng thái</SelectItem>
              <SelectItem value="signed">Đã ký</SelectItem>
              <SelectItem value="pending">Chờ duyệt</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary"><Filter className="h-4 w-4 mr-2" /> Bộ Lọc Nâng Cao</Button>
        </div>
      </Card>

      {/* Data Table */}
      <Card>
        <div className="overflow-x-auto w-full pb-4">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[120px]">Mã HĐ</TableHead>
                <TableHead>Khách Hàng</TableHead>
                <TableHead>Sản Phẩm</TableHead>
                <TableHead>Thông tin Pháp lý</TableHead>
                <TableHead className="w-[200px]">Tiến độ Thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id} className="group">
                  <TableCell>
                    <div className="font-bold text-slate-700">{contract.code}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {contract.date}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-semibold text-primary">{getCustomerName(contract.customerId)}</div>
                    <div className="text-xs text-muted-foreground mt-1">ID: {contract.customerId}</div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">{getProjectName(contract.projectId)}</div>
                    <div className="text-sm mt-0.5">Mã căn: <strong className="text-slate-700">{getUnitCode(contract.inventoryId)}</strong></div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="mb-1">{getTypeBadge(contract.type)}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Landmark className="h-3 w-3" /> Ngân hàng: <span className="font-medium text-slate-700">{contract.bankSupport || 'Không vay'}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="font-bold text-indigo-600">{formatCurrency(contract.value)}</span>
                      <span className="font-medium text-slate-500">{contract.paymentProgress || 0}%</span>
                    </div>
                    <Progress value={contract.paymentProgress || 0} className="h-2" />
                  </TableCell>
                  
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/contracts/${contract.id}`}>
                        <Button size="icon" variant="outline" className="h-8 w-8 text-slate-500 hover:text-blue-600">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/contracts/${contract.id}`}>
                        <Button size="sm" className="h-8 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none">
                          Chi tiết
                        </Button>
                      </Link>
                    </div>
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
