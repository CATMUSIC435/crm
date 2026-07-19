"use client"
import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Workflow, Play, Clock, Zap, Filter, 
  MessageSquare, Mail, Bell, ArrowDown, 
  ChevronRight, Plus, Power, Copy, Trash2, GitMerge,
  CalendarDays, Users
} from 'lucide-react'

// Mock Data cho Workflows
const WORKFLOWS = [
  { id: 1, name: 'Nhắc Nợ Tự Động (Trước 3 Ngày)', type: 'payment', active: true, runs: 1245 },
  { id: 2, name: 'Chia Lead Mới Tự Động (Round-Robin)', type: 'lead', active: true, runs: 8520 },
  { id: 3, name: 'Chúc Mừng Sinh Nhật Khách Hàng', type: 'marketing', active: true, runs: 430 },
  { id: 4, name: 'Khách Bỏ Rơi 7 Ngày -> Báo Quản Lý', type: 'care', active: false, runs: 120 },
  { id: 5, name: 'Booking Thành Công -> Đẩy Sang Hợp Đồng', type: 'deal', active: true, runs: 85 },
]

export default function WorkflowPage() {
  const { customers, projects } = useStore()
  
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Workflow className="h-8 w-8 text-rose-500" />
            Tự Động Hóa (Workflow Engine)
          </h1>
          <p className="text-muted-foreground mt-1">Xây dựng kịch bản tự động, giải phóng sức lao động con người.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-300 bg-white">
             <Play className="h-4 w-4 mr-2 text-green-500" /> Chạy Thử (Test)
          </Button>
          <Button className="bg-rose-500 hover:bg-rose-600 text-white">
             <Plus className="h-4 w-4 mr-2" /> Tạo Workflow Mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* CỘT TRÁI: DANH SÁCH WORKFLOW (4/12) */}
        <div className="xl:col-span-4 flex flex-col gap-4 min-h-0">
           <Card className="shadow-sm flex-1 flex flex-col min-h-0">
             <CardHeader className="pb-3 border-b shrink-0 bg-slate-50">
               <CardTitle className="text-lg">Thư Viện Kịch Bản</CardTitle>
             </CardHeader>
             <CardContent className="p-0 overflow-y-auto flex-1">
                <div className="divide-y">
                   {WORKFLOWS.map((wf, idx) => (
                     <div key={wf.id} className={`p-4 transition-colors cursor-pointer border-l-4 ${idx === 0 ? 'bg-rose-50/50 border-rose-500' : 'hover:bg-slate-50 border-transparent'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold text-sm ${idx === 0 ? 'text-rose-700' : 'text-slate-800'}`}>{wf.name}</h4>
                          <div className={`w-8 h-4 rounded-full flex items-center p-0.5 ${wf.active ? 'bg-rose-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                           <div className="flex items-center gap-1">
                             <Zap className="h-3 w-3 text-amber-500" /> Đã chạy: {wf.runs.toLocaleString()} lần
                           </div>
                           <div className="flex gap-2">
                              <Copy className="h-3.5 w-3.5 hover:text-slate-800" />
                              <Trash2 className="h-3.5 w-3.5 hover:text-red-500" />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </CardContent>
           </Card>
        </div>

        {/* CỘT PHẢI: VISUAL WORKFLOW BUILDER (8/12) */}
        <div className="xl:col-span-8 flex flex-col min-h-0">
           <Card className="shadow-sm flex-1 flex flex-col min-h-0 relative overflow-hidden bg-slate-50">
              
              {/* Toolbar */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                 <Badge className="bg-white text-slate-700 hover:bg-white border-slate-200 shadow-sm px-3 py-1 text-sm font-medium">Kịch bản: Nhắc Nợ Tự Động</Badge>
                 <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1 shadow-sm"><Power className="h-3 w-3"/> Đang Bật</Badge>
              </div>

              {/* Dotted Background for Canvas */}
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* CANVAS AREA (The Node Flow) */}
              <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center pt-20 pb-20">
                 
                 {/* 1. TRIGGER NODE (Đỏ) */}
                 <div className="relative group z-10">
                    <div className="bg-white border-2 border-rose-200 rounded-xl shadow-lg w-[300px] hover:border-rose-400 transition-colors cursor-pointer overflow-hidden">
                       <div className="bg-rose-50 px-4 py-2 border-b border-rose-100 flex items-center gap-2">
                         <div className="h-6 w-6 rounded bg-rose-500 flex items-center justify-center text-white">
                           <Clock className="h-3 w-3" />
                         </div>
                         <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Trigger (Kích Hoạt)</span>
                       </div>
                       <div className="p-4">
                         <div className="font-bold text-slate-800 text-sm mb-1">Đến hạn thanh toán hợp đồng</div>
                         <div className="text-xs text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded inline-flex">
                           Trước <strong className="text-slate-800">3 Ngày</strong>
                         </div>
                       </div>
                    </div>
                    {/* Add node button */}
                    <div className="absolute -bottom-10 left-1/2 -ml-3 h-6 w-6 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-slate-100 hover:text-slate-700 shadow-sm z-20 cursor-pointer">
                      <Plus className="h-3 w-3" />
                    </div>
                 </div>

                 {/* Arrow Down */}
                 <div className="h-12 w-0.5 bg-slate-300 relative z-0">
                    <div className="absolute bottom-0 left-1/2 -ml-1 border-4 border-transparent border-t-slate-300"></div>
                 </div>

                 {/* 2. CONDITION NODE (Vàng) */}
                 <div className="relative group z-10">
                    <div className="bg-white border-2 border-amber-200 rounded-xl shadow-lg w-[300px] hover:border-amber-400 transition-colors cursor-pointer overflow-hidden">
                       <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center gap-2">
                         <div className="h-6 w-6 rounded bg-amber-500 flex items-center justify-center text-white">
                           <GitMerge className="h-3 w-3" />
                         </div>
                         <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Condition (Rẽ Nhánh)</span>
                       </div>
                       <div className="p-4">
                         <div className="font-bold text-slate-800 text-sm">Phân loại Khách hàng</div>
                         <div className="text-xs text-slate-500 mt-1">Kiểm tra hạng thành viên (Loyalty Tier)</div>
                       </div>
                    </div>
                 </div>

                 {/* BRANCHING PATHS */}
                 <div className="flex w-[600px] mt-0 relative z-0 justify-between">
                    
                    {/* Left Branch Line (V.I.P) */}
                    <div className="w-[50%] h-12 border-t-2 border-l-2 border-slate-300 rounded-tl-xl relative">
                       <div className="absolute top-0 left-1/2 -ml-6 -mt-3 bg-white px-2 text-xs font-bold text-green-600 border border-slate-200 rounded shadow-sm">Là V.I.P</div>
                       <div className="absolute bottom-0 left-[-1px] border-4 border-transparent border-t-slate-300"></div>
                    </div>
                    
                    {/* Right Branch Line (Khách Thường) */}
                    <div className="w-[50%] h-12 border-t-2 border-r-2 border-slate-300 rounded-tr-xl relative">
                       <div className="absolute top-0 left-1/2 -ml-8 -mt-3 bg-white px-2 text-xs font-bold text-slate-500 border border-slate-200 rounded shadow-sm">Khách Thường</div>
                       <div className="absolute bottom-0 right-[-1px] border-4 border-transparent border-t-slate-300"></div>
                    </div>
                 </div>

                 {/* BRANCH ACTIONS */}
                 <div className="flex w-[600px] justify-between relative z-10 -mt-1">
                    
                    {/* Left Action (V.I.P) */}
                    <div className="w-[280px]">
                       <div className="bg-white border-2 border-green-200 rounded-xl shadow-lg hover:border-green-400 transition-colors cursor-pointer overflow-hidden">
                          <div className="bg-green-50 px-4 py-2 border-b border-green-100 flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-green-500 flex items-center justify-center text-white">
                              <Mail className="h-3 w-3" />
                            </div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Action (Hành Động)</span>
                          </div>
                          <div className="p-4">
                            <div className="font-bold text-slate-800 text-sm mb-1">Gửi Email Lịch Sự</div>
                            <div className="text-xs text-slate-500 line-clamp-2">"Kính gửi Anh/Chị, Hệ thống xin phép nhắc nhẹ lịch thanh toán đợt tới..."</div>
                          </div>
                       </div>
                    </div>

                    {/* Right Action (Standard) */}
                    <div className="w-[280px] flex flex-col items-center">
                       <div className="bg-white border-2 border-green-200 rounded-xl shadow-lg hover:border-green-400 transition-colors cursor-pointer overflow-hidden w-full">
                          <div className="bg-green-50 px-4 py-2 border-b border-green-100 flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-green-500 flex items-center justify-center text-white">
                              <MessageSquare className="h-3 w-3" />
                            </div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Action (Hành Động)</span>
                          </div>
                          <div className="p-4">
                            <div className="font-bold text-slate-800 text-sm mb-1">Gửi Zalo ZNS + Mã QR</div>
                            <div className="text-xs text-slate-500 line-clamp-2">Gửi trực tiếp tin nhắn Zalo kèm mã QR chuyển khoản chính xác số tiền cần đóng.</div>
                          </div>
                       </div>
                       
                       {/* Arrow Down for Chained Action */}
                       <div className="h-8 w-0.5 bg-slate-300 relative z-0">
                          <div className="absolute bottom-0 left-1/2 -ml-1 border-4 border-transparent border-t-slate-300"></div>
                       </div>

                       {/* Chained Action (Standard) */}
                       <div className="bg-white border-2 border-green-200 rounded-xl shadow-lg hover:border-green-400 transition-colors cursor-pointer overflow-hidden w-full">
                          <div className="bg-green-50 px-4 py-2 border-b border-green-100 flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-green-500 flex items-center justify-center text-white">
                              <Bell className="h-3 w-3" />
                            </div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Action (Hành Động)</span>
                          </div>
                          <div className="p-4">
                            <div className="font-bold text-slate-800 text-sm mb-1">Ping Báo Sale Phụ Trách</div>
                            <div className="text-xs text-slate-500">Đẩy Notification nhắc Sale gọi điện hối thúc khách hàng.</div>
                          </div>
                       </div>

                    </div>
                 </div>

              </div>
           </Card>
        </div>

      </div>
    </div>
  )
}
