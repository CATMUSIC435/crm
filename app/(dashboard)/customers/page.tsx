"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useStore } from "@/store/useStore"

function getBadgeVariant(classification: string) {
  switch (classification) {
    case 'Tiềm Năng': return 'default'
    case 'Mới': return 'secondary'
    case 'VVIP': return 'destructive'
    case 'VIP': return 'default'
    default: return 'outline'
  }
}

export default function CustomerListPage() {
  const customers = useStore(state => state.customers)
  const uniqueClassifications = Array.from(new Set(customers.map(c => c.rank)))

  const getCount = (classification: string) => {
    if (classification === "Tất cả") return customers.length;
    return customers.filter(c => c.rank === classification).length;
  }

  const CustomerTable = ({ data }: { data: typeof customers }) => (
    <div className="overflow-x-auto pb-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã KH</TableHead>
            <TableHead>Họ Tên</TableHead>
            <TableHead>Số Điện Thoại</TableHead>
            <TableHead>Phân loại</TableHead>
            <TableHead>Trạng Thái</TableHead>
            <TableHead className="text-right">Hành Động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium text-slate-500">{c.code}</TableCell>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell>{c.phone}</TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(c.rank) as any}>{c.rank}</Badge>
              </TableCell>
              <TableCell>{c.status}</TableCell>
              <TableCell className="text-right">
                <Link href={`/customers/${c.id}`} className="text-sm text-primary hover:underline font-medium">
                  Xem CRM 360°
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-lg font-medium">Không có dữ liệu</span>
                  <span className="text-sm">Chưa có khách hàng nào trong phân loại này.</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Quản Lý Khách Hàng</h2>
        <p className="text-muted-foreground">Danh sách toàn bộ lead, prospect, customer và các đối tác.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Tabs defaultValue="Tất cả" className="w-full">
            <div className="flex overflow-x-auto pb-2 pt-2 px-2 scrollbar-hide border-b mb-4">
              <TabsList className="h-11 bg-transparent p-0 gap-2">
                <TabsTrigger 
                  value="Tất cả" 
                  className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 flex items-center gap-2"
                >
                  Tất cả
                  <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold">
                    {getCount("Tất cả")}
                  </span>
                </TabsTrigger>
                {uniqueClassifications.map(classification => (
                  <TabsTrigger 
                    key={classification} 
                    value={classification}
                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full px-4 flex items-center gap-2"
                  >
                    {classification}
                    <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      {getCount(classification)}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <div className="px-2">
              <TabsContent value="Tất cả" className="mt-0 outline-none">
                <CustomerTable data={customers} />
              </TabsContent>
              
              {uniqueClassifications.map(classification => (
                <TabsContent key={classification} value={classification} className="mt-0 outline-none">
                  <CustomerTable data={customers.filter(c => c.rank === classification)} />
                </TabsContent>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
