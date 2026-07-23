"use client"
import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { 
  CheckCircle, Clock, ChevronRight, Check, User, Users, Briefcase, 
  CreditCard, UserCircle2, XCircle, AlertTriangle, Paperclip, Filter, Search
} from 'lucide-react'
import { useStore } from '@/store/useStore'

// Define the steps in the workflow
const COLUMNS = [
  { id: 'sale', label: '1. Khởi Tạo (Sale)', icon: User, color: 'border-slate-300', bg: 'bg-slate-100', text: 'text-slate-700' },
  { id: 'manager', label: '2. Quản Lý Duyệt', icon: Users, color: 'border-blue-300', bg: 'bg-blue-100', text: 'text-blue-700' },
  { id: 'director', label: '3. GĐ Duyệt', icon: Briefcase, color: 'border-purple-300', bg: 'bg-purple-100', text: 'text-purple-700' },
  { id: 'payment', label: '4. Chờ Thanh Toán', icon: CreditCard, color: 'border-orange-300', bg: 'bg-orange-100', text: 'text-orange-700' },
  { id: 'done', label: '5. Hoàn Tất', icon: CheckCircle, color: 'border-green-400', bg: 'bg-green-100', text: 'text-green-700' },
]

export default function BookingWorkflowPage() {
  const { customers, projects, inventory } = useStore()

  // Enhanced initial tickets with type, priority, and docs
  const initialTickets = [
    { 
      id: 'BK-1001', customer: customers[0]?.name || 'Nguyễn Văn A', unit: inventory[0]?.code || 'AQC-12A', project: 'Aqua City',
      price: inventory[0]?.price ? `${inventory[0].price / 1000000000} Tỷ` : '12.5 Tỷ', 
      status: 'sale', time: '10 mins ago', agent: 'Thanh Hà',
      type: 'Giữ chỗ có hoàn lại', priority: 'normal', docs: '2/4', paymentMethod: 'Chuyển khoản'
    },
    { 
      id: 'BK-1002', customer: customers[1]?.name || 'Trần Thị B', unit: inventory[1]?.code || 'VHM-8B', project: 'Vinhomes',
      price: inventory[1]?.price ? `${inventory[1].price / 1000000000} Tỷ` : '4.2 Tỷ', 
      status: 'manager', time: '2 hours ago', agent: 'Tuấn Tú',
      type: 'Giữ chỗ không hoàn lại', priority: 'high', docs: '3/3', paymentMethod: 'Tiền mặt'
    },
    { 
      id: 'BK-1003', customer: customers[2]?.name || 'Lê Hoàng C', unit: 'TGC-SH05', project: 'Global City',
      price: '35 Tỷ', status: 'director', time: '1 day ago', agent: 'Minh Anh',
      type: 'Ký HĐ Cọc', priority: 'urgent', docs: '4/4', paymentMethod: 'Chuyển khoản'
    },
    { 
      id: 'BK-1004', customer: customers[3]?.name || 'Phạm Văn D', unit: 'AQC-15C', project: 'Aqua City',
      price: '15 Tỷ', status: 'payment', time: '2 days ago', agent: 'Thanh Hà',
      type: 'Giữ chỗ có hoàn lại', priority: 'normal', docs: '4/4', paymentMethod: 'Thẻ tín dụng'
    },
    { 
      id: 'BK-1005', customer: customers[4]?.name || 'Hoàng Ngọc E', unit: 'AQC-01A', project: 'Aqua City',
      price: '22 Tỷ', status: 'done', time: '5 days ago', agent: 'Minh Anh',
      type: 'Ký HĐ Cọc', priority: 'normal', docs: '4/4', paymentMethod: 'Chuyển khoản'
    },
  ]

  const [tickets, setTickets] = useState(initialTickets)

  // Logic to move ticket to next step
  const handleApprove = (ticketId: string, currentStatus: string) => {
    const currentIndex = COLUMNS.findIndex(col => col.id === currentStatus)
    if (currentIndex < COLUMNS.length - 1) {
      const nextStatus = COLUMNS[currentIndex + 1].id
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: nextStatus, time: 'Just now', priority: 'normal' } : t))
    }
  }

  // Logic to reject ticket (move back to sale)
  const handleReject = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'sale', time: 'Just now', priority: 'high' } : t))
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === 'urgent') return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-none"><AlertTriangle className="h-3 w-3 mr-1"/> SLA: Quá hạn</Badge>
    if (priority === 'high') return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none"><Clock className="h-3 w-3 mr-1"/> Cần xử lý gấp</Badge>
    return null
  }

  const getTypeBadge = (type: string) => {
    if (type.includes('Ký HĐ')) return <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50">{type}</Badge>
    if (type.includes('không hoàn lại')) return <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50">{type}</Badge>
    return <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">{type}</Badge>
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-4 -m-4 sm:-m-8 p-4 sm:p-8 bg-muted/30">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CheckCircle className="h-8 w-8 text-indigo-500" />
            Booking Workflow (Phê Duyệt)
          </h1>
          <p className="text-muted-foreground mt-1">Hệ thống số hóa quy trình Giữ chỗ & Ký cọc với cảnh báo SLA.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white"><Filter className="h-4 w-4 mr-2"/> Lọc kết quả</Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            + Tạo Yêu Cầu Booking
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border shadow-sm">
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Dự án" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả dự án</SelectItem>
            <SelectItem value="aqc">Aqua City</SelectItem>
            <SelectItem value="vhm">Vinhomes</SelectItem>
            <SelectItem value="tgc">Global City</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Nhân viên Sale" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả Sale</SelectItem>
            <SelectItem value="th">Thanh Hà</SelectItem>
            <SelectItem value="tt">Tuấn Tú</SelectItem>
            <SelectItem value="ma">Minh Anh</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Tìm theo tên khách hàng hoặc mã căn..." className="pl-9" />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1500px] h-full">
          {COLUMNS.map((column, index) => {
            const columnTickets = tickets.filter(t => t.status === column.id)
            const isLast = index === COLUMNS.length - 1

            return (
              <div key={column.id} className="flex-1 flex flex-col w-[350px] max-w-[400px]">
                {/* Column Header */}
                <div className={`p-3 rounded-t-xl border border-b-0 ${column.bg} ${column.color} flex items-center justify-between`}>
                  <div className={`flex items-center gap-2 font-bold ${column.text}`}>
                    <column.icon className="h-5 w-5" />
                    {column.label}
                  </div>
                  <Badge variant="secondary" className="bg-white/70 text-slate-800">{columnTickets.length}</Badge>
                </div>
                
                {/* Column Body */}
                <div className={`flex-1 border border-t-0 rounded-b-xl p-3 bg-white/50 dark:bg-black/20 flex flex-col gap-3 overflow-y-auto ${column.color}`}>
                  {columnTickets.length === 0 ? (
                     <div className="text-center p-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-white/40">Chưa có yêu cầu nào</div>
                  ) : (
                    columnTickets.map((ticket) => (
                      <Card key={ticket.id} className={`shrink-0 shadow-sm hover:shadow-md transition-shadow border-slate-200 ${ticket.priority === 'urgent' ? 'ring-1 ring-red-400' : ''}`}>
                        <CardContent className="p-4 flex flex-col gap-3">
                          {/* Header of Card */}
                          <div className="flex justify-between items-start gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                               <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 font-mono">{ticket.id}</Badge>
                               {getTypeBadge(ticket.type)}
                            </div>
                            <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> {ticket.time}</span>
                          </div>

                          {/* Priority Warning */}
                          {getPriorityBadge(ticket.priority)}
                          
                          {/* Main Info */}
                          <div>
                            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{ticket.customer}</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm mt-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Mã Căn</span>
                                <span className="font-semibold">{ticket.unit}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Giá Trị</span>
                                <span className="font-semibold text-green-600">{ticket.price}</span>
                              </div>
                            </div>
                          </div>

                          {/* Meta Data */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                               <Paperclip className="h-3 w-3" /> Hồ sơ: {ticket.docs}
                            </div>
                            <div className="flex items-center gap-1">
                               <CreditCard className="h-3 w-3" /> {ticket.paymentMethod}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between border-t pt-3 mt-1">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                               <UserCircle2 className="h-4 w-4 text-slate-400" />
                               <span className="font-medium text-foreground">{ticket.agent}</span>
                            </div>
                            
                            <div className="flex gap-2">
                              {!isLast && column.id !== 'sale' && (
                                <Button 
                                  size="icon" variant="outline"
                                  className="h-7 w-7 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                  title="Từ chối"
                                  onClick={() => handleReject(ticket.id)}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {!isLast && (
                                <Button 
                                  size="sm" 
                                  className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                                  onClick={() => handleApprove(ticket.id, ticket.status)}
                                >
                                  {column.id === 'payment' ? 'Xác Nhận Tiền' : 'Duyệt'} <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                              )}
                              {isLast && (
                                <Badge className="bg-green-500 hover:bg-green-600"><Check className="h-3 w-3 mr-1"/> Đã xong</Badge>
                              )}
                            </div>
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
