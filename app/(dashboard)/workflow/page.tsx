"use client"
import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Workflow, Play, Zap, 
  MessageSquare, Mail, Bell, 
  Plus, Power, Copy, Trash2, GitMerge,
  Clock
} from 'lucide-react'

export default function WorkflowPage() {
  const { workflows, toggleWorkflow, runWorkflow } = useStore()
  
  const [activeWorkflowId, setActiveWorkflowId] = useState<number>(workflows[0]?.id || 1)
  
  const activeWorkflow = workflows.find(wf => wf.id === activeWorkflowId)

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
          <Button 
            variant="outline" 
            className="border-slate-300 bg-white"
            onClick={() => activeWorkflow && runWorkflow(activeWorkflow.id)}
          >
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
                   {workflows.map((wf) => (
                     <div 
                        key={wf.id} 
                        onClick={() => setActiveWorkflowId(wf.id)}
                        className={`p-4 transition-colors cursor-pointer border-l-4 ${activeWorkflowId === wf.id ? 'bg-rose-50/50 border-rose-500' : 'hover:bg-slate-50 border-transparent'} ${!wf.active ? 'opacity-60' : ''}`}
                     >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-bold text-sm ${activeWorkflowId === wf.id ? 'text-rose-700' : 'text-slate-800'}`}>{wf.name}</h4>
                          <div 
                             onClick={(e) => {
                               e.stopPropagation()
                               toggleWorkflow(wf.id)
                             }}
                             className={`w-8 h-4 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${wf.active ? 'bg-rose-500 justify-end' : 'bg-slate-300 justify-start'}`}
                          >
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500">
                           <div className="flex items-center gap-1">
                             <Zap className={`h-3 w-3 ${wf.active ? 'text-amber-500' : 'text-slate-400'}`} /> Đã chạy: {wf.runs.toLocaleString()} lần
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
           <Card className={`shadow-sm flex-1 flex flex-col min-h-0 relative overflow-hidden bg-slate-50 transition-all ${activeWorkflow?.active ? '' : 'grayscale-[50%] opacity-80'}`}>
              
              {/* Toolbar */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                 <Badge className="bg-white text-slate-700 hover:bg-white border-slate-200 shadow-sm px-3 py-1 text-sm font-medium">Kịch bản: {activeWorkflow?.name}</Badge>
                 {activeWorkflow?.active ? (
                   <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 flex items-center gap-1 shadow-sm">
                     <Power className="h-3 w-3"/> Đang Bật
                   </Badge>
                 ) : (
                   <Badge className="bg-slate-200 text-slate-600 hover:bg-slate-200 border-slate-300 flex items-center gap-1 shadow-sm">
                     <Power className="h-3 w-3"/> Đang Tắt
                   </Badge>
                 )}
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
                         <div className="font-bold text-slate-800 text-sm mb-1">
                           {activeWorkflow?.type === 'lead' ? 'Có Lead Mới Bổ Sung' : activeWorkflow?.type === 'marketing' ? 'Đến Ngày Sinh Nhật' : activeWorkflow?.type === 'care' ? 'Không Có Tương Tác' : activeWorkflow?.type === 'deal' ? 'Trạng Thái Booking' : 'Đến Hạn Thanh Toán'}
                         </div>
                         <div className="text-xs text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded inline-flex mt-1">
                           {activeWorkflow?.type === 'payment' ? (
                             <>Trước <strong className="text-slate-800">3 Ngày</strong></>
                           ) : activeWorkflow?.type === 'care' ? (
                             <>Sau <strong className="text-slate-800">7 Ngày</strong></>
                           ) : (
                             <strong className="text-slate-800">Tự Động (Auto)</strong>
                           )}
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
                         <div className="font-bold text-slate-800 text-sm">Phân loại Đối tượng</div>
                         <div className="text-xs text-slate-500 mt-1">Kiểm tra điều kiện rẽ nhánh kịch bản</div>
                       </div>
                    </div>
                 </div>

                 {/* BRANCHING PATHS */}
                 <div className="flex w-[600px] mt-0 relative z-0 justify-between">
                    
                    {/* Left Branch Line */}
                    <div className="w-[50%] h-12 border-t-2 border-l-2 border-slate-300 rounded-tl-xl relative">
                       <div className="absolute top-0 left-1/2 -ml-6 -mt-3 bg-white px-2 text-xs font-bold text-green-600 border border-slate-200 rounded shadow-sm">Có (Yes)</div>
                       <div className="absolute bottom-0 left-[-1px] border-4 border-transparent border-t-slate-300"></div>
                    </div>
                    
                    {/* Right Branch Line */}
                    <div className="w-[50%] h-12 border-t-2 border-r-2 border-slate-300 rounded-tr-xl relative">
                       <div className="absolute top-0 left-1/2 -ml-8 -mt-3 bg-white px-2 text-xs font-bold text-slate-500 border border-slate-200 rounded shadow-sm">Không (No)</div>
                       <div className="absolute bottom-0 right-[-1px] border-4 border-transparent border-t-slate-300"></div>
                    </div>
                 </div>

                 {/* BRANCH ACTIONS */}
                 <div className="flex w-[600px] justify-between relative z-10 -mt-1">
                    
                    {/* Left Action */}
                    <div className="w-[280px]">
                       <div className="bg-white border-2 border-green-200 rounded-xl shadow-lg hover:border-green-400 transition-colors cursor-pointer overflow-hidden">
                          <div className="bg-green-50 px-4 py-2 border-b border-green-100 flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-green-500 flex items-center justify-center text-white">
                              <Mail className="h-3 w-3" />
                            </div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Action (Hành Động)</span>
                          </div>
                          <div className="p-4">
                            <div className="font-bold text-slate-800 text-sm mb-1">Gửi Email</div>
                            <div className="text-xs text-slate-500 line-clamp-2">Gửi kịch bản Email theo template dựng sẵn.</div>
                          </div>
                       </div>
                    </div>

                    {/* Right Action */}
                    <div className="w-[280px] flex flex-col items-center">
                       <div className="bg-white border-2 border-green-200 rounded-xl shadow-lg hover:border-green-400 transition-colors cursor-pointer overflow-hidden w-full">
                          <div className="bg-green-50 px-4 py-2 border-b border-green-100 flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-green-500 flex items-center justify-center text-white">
                              <MessageSquare className="h-3 w-3" />
                            </div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Action (Hành Động)</span>
                          </div>
                          <div className="p-4">
                            <div className="font-bold text-slate-800 text-sm mb-1">Gửi Zalo ZNS</div>
                            <div className="text-xs text-slate-500 line-clamp-2">Gửi tin nhắn tự động qua Zalo ZNS cho Khách hàng.</div>
                          </div>
                       </div>
                       
                       {/* Arrow Down for Chained Action */}
                       <div className="h-8 w-0.5 bg-slate-300 relative z-0">
                          <div className="absolute bottom-0 left-1/2 -ml-1 border-4 border-transparent border-t-slate-300"></div>
                       </div>

                       {/* Chained Action */}
                       <div className="bg-white border-2 border-green-200 rounded-xl shadow-lg hover:border-green-400 transition-colors cursor-pointer overflow-hidden w-full">
                          <div className="bg-green-50 px-4 py-2 border-b border-green-100 flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-green-500 flex items-center justify-center text-white">
                              <Bell className="h-3 w-3" />
                            </div>
                            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Action (Hành Động)</span>
                          </div>
                          <div className="p-4">
                            <div className="font-bold text-slate-800 text-sm mb-1">Ping Báo Sale Phụ Trách</div>
                            <div className="text-xs text-slate-500">Đẩy Notification nhắc Sale xử lý.</div>
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
