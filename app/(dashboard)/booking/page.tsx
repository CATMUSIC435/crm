"use client"
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, ChevronRight, Check, User, Users, Briefcase, CreditCard, UserCircle2 } from 'lucide-react'
import { useStore } from '@/store/useStore'
// Define the steps in the workflow
const COLUMNS = [
  { id: 'sale', label: '1. Khởi Tạo (Sale)', icon: User, color: 'border-slate-300', bg: 'bg-slate-100' },
  { id: 'manager', label: '2. Quản Lý Duyệt', icon: Users, color: 'border-blue-300', bg: 'bg-blue-100' },
  { id: 'director', label: '3. GĐ Duyệt', icon: Briefcase, color: 'border-purple-300', bg: 'bg-purple-100' },
  { id: 'payment', label: '4. Chờ Thanh Toán', icon: CreditCard, color: 'border-orange-300', bg: 'bg-orange-100' },
  { id: 'done', label: '5. Hoàn Tất', icon: CheckCircle, color: 'border-green-400', bg: 'bg-green-100' },
]

export default function BookingWorkflowPage() {
  const { customers, projects, inventory } = useStore()

  const initialTickets = [
    { id: 'BK-1001', customer: customers[0]?.name || 'Nguyễn Văn A', unit: inventory[0]?.code || 'AQC-12A', price: inventory[0]?.price ? `${inventory[0].price / 1000000000} Tỷ` : '12.5 Tỷ', status: 'sale', time: '10 mins ago', agent: 'Thanh Hà' },
    { id: 'BK-1002', customer: customers[1]?.name || 'Trần Thị B', unit: inventory[1]?.code || 'VHM-8B', price: inventory[1]?.price ? `${inventory[1].price / 1000000000} Tỷ` : '4.2 Tỷ', status: 'manager', time: '2 hours ago', agent: 'Tuấn Tú' },
    { id: 'BK-1003', customer: customers[2]?.name || 'Lê Hoàng C', unit: 'TGC-SH05', price: '35 Tỷ', status: 'director', time: '1 day ago', agent: 'Minh Anh' },
    { id: 'BK-1004', customer: customers[3]?.name || 'Phạm Văn D', unit: 'AQC-15C', price: '15 Tỷ', status: 'payment', time: '2 days ago', agent: 'Thanh Hà' },
    { id: 'BK-1005', customer: customers[4]?.name || 'Hoàng Ngọc E', unit: 'AQC-01A', price: '22 Tỷ', status: 'done', time: '5 days ago', agent: 'Minh Anh' },
  ]

  const [tickets, setTickets] = useState(initialTickets)

  // Logic to move ticket to next step
  const handleMove = (ticketId: string, currentStatus: string) => {
    const currentIndex = COLUMNS.findIndex(col => col.id === currentStatus)
    if (currentIndex < COLUMNS.length - 1) {
      const nextStatus = COLUMNS[currentIndex + 1].id
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: nextStatus, time: 'Just now' } : t))
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-4 -m-4 sm:-m-8 p-4 sm:p-8 bg-muted/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CheckCircle className="h-8 w-8 text-indigo-500" />
            Booking Workflow (Phê Duyệt)
          </h1>
          <p className="text-muted-foreground mt-1">Hệ thống số hóa quy trình Giữ chỗ & Ký cọc.</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          + Tạo Yêu Cầu Booking Mới
        </Button>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px] h-full">
          {COLUMNS.map((column, index) => {
            const columnTickets = tickets.filter(t => t.status === column.id)
            const isLast = index === COLUMNS.length - 1

            return (
              <div key={column.id} className="flex-1 flex flex-col w-[300px] max-w-[350px]">
                {/* Column Header */}
                <div className={`p-3 rounded-t-xl border border-b-0 ${column.bg} ${column.color} flex items-center justify-between`}>
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <column.icon className="h-5 w-5" />
                    {column.label}
                  </div>
                  <Badge variant="secondary" className="bg-white/50">{columnTickets.length}</Badge>
                </div>
                
                {/* Column Body */}
                <div className={`flex-1 border border-t-0 rounded-b-xl p-3 bg-white/50 dark:bg-black/20 flex flex-col gap-3 overflow-y-auto ${column.color}`}>
                  {columnTickets.length === 0 ? (
                     <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg">Không có yêu cầu nào</div>
                  ) : (
                    columnTickets.map((ticket) => (
                      <Card key={ticket.id} className="shadow-sm hover:shadow-md transition-shadow border-slate-200">
                        <CardContent className="p-4 flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">{ticket.id}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> {ticket.time}</span>
                          </div>
                          
                          <div>
                            <h3 className="font-bold text-base">{ticket.customer}</h3>
                            <div className="flex justify-between text-sm mt-1">
                              <span className="text-muted-foreground">Mã căn: <strong className="text-foreground">{ticket.unit}</strong></span>
                              <span className="font-semibold text-green-600">{ticket.price}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between border-t pt-3 mt-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                               <UserCircle2 className="h-4 w-4" />
                               Sale: <span className="font-medium text-foreground">{ticket.agent}</span>
                            </div>
                            
                            {!isLast && (
                              <Button 
                                size="sm" 
                                className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                                onClick={() => handleMove(ticket.id, ticket.status)}
                              >
                                {column.id === 'payment' ? 'Xác Nhận Tiền' : 'Duyệt'} <ChevronRight className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                            {isLast && (
                               <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1"/> Đã xong</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
