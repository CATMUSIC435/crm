"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useStore } from "@/store/useStore"

function getBadgeVariant(rank: string) {
  switch (rank) {
    case 'Tiềm Năng': return 'default'
    case 'Mới': return 'secondary'
    case 'VVIP': return 'destructive'
    case 'VIP': return 'default'
    default: return 'outline'
  }
}

export default function CustomerListPage() {
  const customers = useStore(state => state.customers)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Quản Lý Khách Hàng</h2>
        <p className="text-muted-foreground">Danh sách toàn bộ lead, prospect, customer và các đối tác.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Khách Hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã KH</TableHead>
                <TableHead>Họ Tên</TableHead>
                <TableHead>Số Điện Thoại</TableHead>
                <TableHead>Xếp Hạng</TableHead>
                <TableHead>Trạng Thái</TableHead>
                <TableHead className="text-right">Hành Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c) => (
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
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
