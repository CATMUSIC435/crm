"use client"
import React from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { FileSignature, Download, Printer, Share2 } from 'lucide-react'
import { useStore } from "@/store/useStore"

export default function ContractPage() {
  const contracts = useStore((state) => state.contracts)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileSignature className="h-8 w-8 text-blue-600" />
            Hợp Đồng & Pháp Lý
          </h1>
          <p className="text-muted-foreground mt-1">Danh sách hợp đồng và trạng thái.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Printer className="h-4 w-4 mr-2" /> In Ấn</Button>
          <Button variant="outline"><Share2 className="h-4 w-4 mr-2" /> Chia Sẻ</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Download className="h-4 w-4 mr-2" /> Xuất Excel</Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto w-full pb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Inventory ID</TableHead>
                <TableHead>Project ID</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-semibold">{contract.id}</TableCell>
                  <TableCell>{contract.code}</TableCell>
                  <TableCell>{contract.customerId}</TableCell>
                  <TableCell>{contract.inventoryId}</TableCell>
                  <TableCell>{contract.projectId}</TableCell>
                  <TableCell className="font-medium text-indigo-600 dark:text-indigo-400">{contract.value}</TableCell>
                  <TableCell>{contract.date}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{contract.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="default" className="w-full sm:w-auto">Chi tiết</Button>
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

