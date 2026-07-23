"use client"
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, MapPin, Tag, Search, Filter, LayoutGrid, List, Eye } from "lucide-react"
import Link from "next/link"
import { useStore } from "@/store/useStore"

function formatCurrency(amount: number | undefined) {
  if (!amount) return '0'
  if (amount >= 1e12) {
    return `${(amount / 1e12).toFixed(1)} Nghìn Tỷ`
  }
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} Tỷ`
  }
  return `${(amount / 1e6).toLocaleString()} Tr`
}

function getStatusColor(status: string) {
  switch (status) {
    case "Đang mở bán":
      return "bg-green-500 hover:bg-green-600 text-white border-none"
    case "Sắp mở bán":
      return "bg-yellow-500 hover:bg-yellow-600 text-white border-none"
    case "Đã bàn giao":
      return "bg-blue-500 hover:bg-blue-600 text-white border-none"
    default:
      return "bg-slate-500 hover:bg-slate-600 text-white border-none"
  }
}

export default function ProjectsPage() {
  const projects = useStore((state) => state.projects)
  const [searchTerm, setSearchTerm] = useState('')

  // Lọc dự án đơn giản theo tên
  const filteredProjects = projects.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Building className="h-8 w-8 text-indigo-600" /> Kho Dự Án
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý rổ hàng tổng và theo dõi tiến độ bán hàng từng dự án.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white"><Filter className="h-4 w-4 mr-2" /> Bộ Lọc Nâng Cao</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">+ Thêm Dự Án Mới</Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        {/* Filter Bar & Tabs List */}
        <Card className="mb-6">
          <div className="p-4 flex flex-wrap items-center gap-4 justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1 min-w-[200px] max-w-sm relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Tìm kiếm dự án theo tên..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Tình trạng" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả Tình trạng</SelectItem>
                  <SelectItem value="selling">Đang mở bán</SelectItem>
                  <SelectItem value="upcoming">Sắp mở bán</SelectItem>
                  <SelectItem value="done">Đã bàn giao</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]"><SelectValue placeholder="Chủ đầu tư" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả CĐT</SelectItem>
                  <SelectItem value="novaland">Novaland</SelectItem>
                  <SelectItem value="masterise">Masterise Homes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <TabsList className="bg-muted border h-11 p-1">
              <TabsTrigger value="list" className="flex items-center gap-2 px-4 py-2"><List className="h-4 w-4"/> Dạng Bảng</TabsTrigger>
              <TabsTrigger value="grid" className="flex items-center gap-2 px-4 py-2"><LayoutGrid className="h-4 w-4"/> Lưới Hình Ảnh</TabsTrigger>
            </TabsList>
          </div>
        </Card>

        {/* BẢNG DỮ LIỆU (TABLE VIEW) */}
        <TabsContent value="list" className="outline-none mt-0">
          <Card>
            <div className="overflow-x-auto w-full pb-4">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Tên Dự Án</TableHead>
                    <TableHead>Chủ Đầu Tư</TableHead>
                    <TableHead>Loại & Vị trí</TableHead>
                    <TableHead className="w-[200px]">Tiến độ Bán Hàng</TableHead>
                    <TableHead>Doanh thu / Mục tiêu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const progressPercent = Math.round((project.soldUnits / project.totalUnits) * 100) || 0;
                    return (
                      <TableRow key={project.id} className="group">
                        <TableCell>
                          <div className="font-bold text-slate-700 flex items-center gap-3">
                            {project.thumbnail ? (
                              <img src={project.thumbnail} className="w-10 h-10 rounded object-cover shadow-sm" alt="thumb"/>
                            ) : (
                              <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                                <Building className="h-5 w-5 text-slate-300"/>
                              </div>
                            )}
                            <div>
                              <Link href={`/projects/${project.id}`} className="hover:text-indigo-600 transition-colors">
                                {project.name}
                              </Link>
                              <div className="text-xs text-muted-foreground mt-0.5">ID: {project.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium">{project.developer || '-'}</span>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">{project.type}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {project.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-semibold text-slate-700">{progressPercent}%</span>
                            <span className="text-xs text-slate-500">{project.soldUnits} / {project.totalUnits}</span>
                          </div>
                          <Progress value={progressPercent} className="h-2 bg-slate-100" />
                        </TableCell>
                        <TableCell>
                          <div className="font-bold text-indigo-600">{formatCurrency(project.revenue)}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">Mục tiêu: {formatCurrency(project.targetRevenue)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/projects/${project.id}`}>
                            <Button size="sm" variant="outline" className="h-8 hover:bg-indigo-50 hover:text-indigo-600 border-indigo-100">
                              <Eye className="h-4 w-4 mr-1" /> Xem
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* LƯỚI HÌNH ẢNH (GRID VIEW) */}
        <TabsContent value="grid" className="outline-none mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProjects.map((project) => {
              const progressPercent = Math.round((project.soldUnits / project.totalUnits) * 100) || 0;

              return (
                <Link href={`/projects/${project.id}`} key={project.id}>
                  <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-muted group cursor-pointer h-full flex flex-col bg-white">
                    
                    {/* Thumbnail Area */}
                    <div className="relative h-48 overflow-hidden bg-slate-100">
                      {project.thumbnail ? (
                        <img 
                          src={project.thumbnail} 
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building className="h-12 w-12 text-slate-300" />
                        </div>
                      )}
                      {/* Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                      
                      {/* Badges on Thumbnail */}
                      <Badge className={`absolute top-3 left-3 shadow-md ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                      
                      {/* Developer Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-white/80">Chủ Đầu Tư</span>
                          <span className="font-bold drop-shadow-md">{project.developer || 'Đang cập nhật'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Area */}
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1" title={project.name}>
                        {project.name}
                      </h3>
                      
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 line-clamp-1" title={project.location}>
                        <MapPin className="h-3.5 w-3.5 shrink-0" /> {project.location}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mt-1 mb-4">
                        <Tag className="h-3.5 w-3.5 shrink-0" /> {project.type}
                      </div>

                      {/* Financials */}
                      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border mb-4 mt-auto">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase">Doanh thu</span>
                          <span className="font-bold text-indigo-700">{formatCurrency(project.revenue)}</span>
                        </div>
                        <div className="flex flex-col border-l pl-2">
                          <span className="text-[10px] text-muted-foreground uppercase">Mục tiêu</span>
                          <span className="font-semibold text-slate-700">{formatCurrency(project.targetRevenue)}</span>
                        </div>
                      </div>

                      {/* Sales Progress */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-medium text-slate-600">Tiến độ bán hàng</span>
                          <span className="text-sm font-bold text-indigo-600">{progressPercent}%</span>
                        </div>
                        <Progress value={progressPercent} className="h-2 bg-slate-100" />
                        <div className="flex justify-between text-[10px] text-muted-foreground pt-0.5">
                          <span>Đã bán: <strong className="text-slate-700">{project.soldUnits.toLocaleString()}</strong></span>
                          <span>Tổng: <strong className="text-slate-700">{project.totalUnits.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
