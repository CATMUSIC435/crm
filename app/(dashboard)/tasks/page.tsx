"use client"
import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  ClipboardList, Plus, Calendar as CalendarIcon, AlignLeft, 
  Columns, GitPullRequestDraft, Clock, Flag, User2, MessageSquare, Paperclip, BarChartHorizontal
} from 'lucide-react'

export default function TasksPage() {
  const { customers } = useStore()
  
  const customer1 = customers[0]?.name || 'chị Lan Anh'
  const customer2 = customers[1]?.name || 'anh Dũng'

  const TASKS = [
    { id: 'TSK-01', title: `Gọi nhắc lịch hẹn ${customer1}`, status: 'todo', priority: 'high', assignee: 'Thanh Hà', due: 'Hôm nay', comments: 2 },
    { id: 'TSK-02', title: 'Chuẩn bị tài liệu mở bán Event', status: 'in_progress', priority: 'medium', assignee: 'Tuấn Tú', due: 'Ngày mai', comments: 5 },
    { id: 'TSK-03', title: `Gửi báo giá Căn Góc cho ${customer2}`, status: 'review', priority: 'high', assignee: 'Thanh Hà', due: '15/07', comments: 1 },
    { id: 'TSK-04', title: 'Setup chạy Ads Facebook tháng 7', status: 'in_progress', priority: 'high', assignee: 'Minh Quang', due: '20/07', comments: 12 },
    { id: 'TSK-05', title: 'Review HĐMB mẫu với Phòng Pháp lý', status: 'done', priority: 'low', assignee: 'Bảo Trần', due: '10/07', comments: 0 },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-teal-600" />
            Công Việc & Lịch Trình
          </h1>
          <p className="text-muted-foreground mt-1">Quản lý dự án, Sprint, Checklist và Gantt Chart.</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> Tạo Công Việc Mới
        </Button>
      </div>

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[600px] mb-6">
          <TabsTrigger value="kanban" className="flex items-center gap-1"><Columns className="h-4 w-4"/> Kanban</TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-1"><AlignLeft className="h-4 w-4"/> List</TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-1"><CalendarIcon className="h-4 w-4"/> Calendar</TabsTrigger>
          <TabsTrigger value="gantt" className="flex items-center gap-1"><BarChartHorizontal className="h-4 w-4"/> Gantt</TabsTrigger>
        </TabsList>

        {/* 1. KANBAN VIEW */}
        <TabsContent value="kanban" className="space-y-4">
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
             {[
               { id: 'todo', title: 'TO DO (CẦN LÀM)', color: 'bg-slate-100 border-slate-200' },
               { id: 'in_progress', title: 'IN PROGRESS (ĐANG XỬ LÝ)', color: 'bg-blue-50 border-blue-200' },
               { id: 'review', title: 'IN REVIEW (CHỜ DUYỆT)', color: 'bg-purple-50 border-purple-200' },
               { id: 'done', title: 'DONE (HOÀN TẤT)', color: 'bg-green-50 border-green-200' }
             ].map(col => (
               <div key={col.id} className={`w-[320px] flex-shrink-0 rounded-xl border ${col.color} flex flex-col h-[650px]`}>
                 <div className="p-3 font-bold text-sm text-slate-700 border-b border-black/5 flex justify-between items-center">
                    {col.title}
                    <Badge variant="secondary" className="bg-white/60">{TASKS.filter(t => t.status === col.id).length}</Badge>
                 </div>
                 <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3">
                    {TASKS.filter(t => t.status === col.id).map(task => (
                      <Card key={task.id} className="cursor-grab hover:shadow-md transition-shadow">
                        <CardContent className="p-4 space-y-3">
                           <div className="flex justify-between items-start">
                             <div className="flex gap-1">
                               {task.priority === 'high' && <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100">High</Badge>}
                               {task.priority === 'medium' && <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100">Medium</Badge>}
                               {task.priority === 'low' && <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">Low</Badge>}
                             </div>
                             <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
                           </div>
                           <h4 className="font-semibold text-sm leading-snug">{task.title}</h4>
                           <div className="flex justify-between items-center text-muted-foreground pt-2">
                             <div className="flex gap-3 text-xs font-medium">
                               <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5"/> {task.due}</span>
                               <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5"/> {task.comments}</span>
                             </div>
                             <div className="h-6 w-6 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-slate-600" title={task.assignee}>
                               {task.assignee.substring(0, 2).toUpperCase()}
                             </div>
                           </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button variant="ghost" className="w-full text-muted-foreground text-sm border border-dashed border-slate-300 hover:bg-slate-200/50">+ Add Task</Button>
                 </div>
               </div>
             ))}
          </div>
        </TabsContent>

        {/* 2. LIST VIEW */}
        <TabsContent value="list" className="space-y-4">
          <Card className="border shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto pb-4">
                <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-12 text-center">✓</TableHead>
                    <TableHead>Tên Công Việc (Task Name)</TableHead>
                    <TableHead>Mức Độ</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead>Người Phụ Trách</TableHead>
                    <TableHead className="text-right">Hạn Chót (Due Date)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TASKS.map(task => (
                    <TableRow key={task.id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="text-center">
                        <Checkbox checked={task.status === 'done'} />
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className={task.status === 'done' ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
                      </TableCell>
                      <TableCell>
                         {task.priority === 'high' && <Badge className="bg-red-100 text-red-700 border-none"><Flag className="h-3 w-3 mr-1"/> High</Badge>}
                         {task.priority === 'medium' && <Badge className="bg-orange-100 text-orange-700 border-none"><Flag className="h-3 w-3 mr-1"/> Med</Badge>}
                         {task.priority === 'low' && <Badge className="bg-blue-100 text-blue-700 border-none"><Flag className="h-3 w-3 mr-1"/> Low</Badge>}
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className="capitalize">{task.status.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2 text-sm">
                           <User2 className="h-4 w-4 text-slate-400" />
                           {task.assignee}
                         </div>
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-600">{task.due}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. CALENDAR VIEW */}
        <TabsContent value="calendar" className="space-y-4">
          <Card className="border shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between py-4 border-b bg-slate-50/50">
                <CardTitle className="text-lg">Tháng 7, 2026</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Hôm nay</Button>
                  <Button variant="outline" size="sm">Tháng trước</Button>
                  <Button variant="outline" size="sm">Tháng sau</Button>
                </div>
             </CardHeader>
             <CardContent className="p-4">
                {/* Lưới Thứ trong tuần */}
                <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-t-lg">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                    <div key={day} className="bg-slate-100 py-2 text-center text-sm font-bold text-slate-600">{day}</div>
                  ))}
                </div>
                {/* Lưới Ngày trong tháng (Mock layout) */}
                <div className="grid grid-cols-7 gap-px bg-slate-200 border-x border-b border-slate-200 rounded-b-lg">
                  {/* Empty slots for offset */}
                  <div className="bg-white min-h-[120px] p-2 text-slate-400">29</div>
                  <div className="bg-white min-h-[120px] p-2 text-slate-400">30</div>
                  {/* Real Days */}
                  {Array.from({length: 31}).map((_, i) => (
                    <div key={i} className={`bg-white min-h-[120px] p-2 relative group hover:bg-slate-50 transition-colors ${i+1 === 19 ? 'bg-blue-50/30' : ''}`}>
                       <div className={`text-sm font-semibold mb-1 ${i+1 === 19 ? 'bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>
                         {i + 1}
                       </div>
                       
                       {/* Mock Events */}
                       {(i + 1 === 5) && (
                         <div className="text-[10px] bg-red-100 text-red-700 p-1 rounded mb-1 truncate font-medium">Event Mở Bán</div>
                       )}
                       {(i + 1 === 12) && (
                         <div className="text-[10px] bg-purple-100 text-purple-700 p-1 rounded mb-1 truncate font-medium">Ký HĐMB {customer2}</div>
                       )}
                       {(i + 1 === 19) && (
                         <>
                           <div className="text-[10px] bg-teal-100 text-teal-700 p-1 rounded mb-1 truncate font-medium">Gọi nhắc {customer1}</div>
                           <div className="text-[10px] bg-orange-100 text-orange-700 p-1 rounded truncate font-medium">Họp team tuần</div>
                         </>
                       )}
                    </div>
                  ))}
                  {/* Fill empty */}
                  <div className="bg-white min-h-[120px] p-2 text-slate-400">1</div>
                  <div className="bg-white min-h-[120px] p-2 text-slate-400">2</div>
                </div>
             </CardContent>
          </Card>
        </TabsContent>

        {/* 4. GANTT CHART VIEW */}
        <TabsContent value="gantt" className="space-y-4">
          <Card className="border shadow-sm overflow-hidden">
             <CardHeader className="py-4 border-b bg-slate-50/50">
                <CardTitle className="text-lg">Tiến Độ Dự Án (Timeline)</CardTitle>
             </CardHeader>
             <CardContent className="p-0 overflow-x-auto">
                <div className="min-w-[800px]">
                   {/* Timeline Header */}
                   <div className="flex border-b text-xs font-bold text-slate-500 bg-slate-50">
                     <div className="w-[250px] p-3 border-r">Tên Hạng Mục</div>
                     {Array.from({length: 10}).map((_, i) => (
                       <div key={i} className="flex-1 p-3 text-center border-r">Ngày {15 + i}</div>
                     ))}
                   </div>

                   {/* Timeline Rows */}
                   <div className="relative">
                      {/* Grid lines */}
                      <div className="absolute inset-0 flex pointer-events-none">
                         <div className="w-[250px] border-r border-slate-200"></div>
                         {Array.from({length: 10}).map((_, i) => (
                           <div key={i} className="flex-1 border-r border-slate-100"></div>
                         ))}
                      </div>

                      {/* Tasks */}
                      {[
                        { title: 'Thiết kế Landing Page', start: 0, duration: 2, color: 'bg-blue-500' },
                        { title: 'Chạy Ads Facebook (Test)', start: 1, duration: 4, color: 'bg-indigo-500' },
                        { title: 'Tối ưu Ads (Scale up)', start: 5, duration: 5, color: 'bg-purple-500' },
                        { title: 'Event Mở Bán Offline', start: 3, duration: 2, color: 'bg-red-500' },
                        { title: 'Chốt cọc 10 KH đầu tiên', start: 5, duration: 3, color: 'bg-green-500' },
                      ].map((task, i) => (
                        <div key={i} className="flex border-b border-slate-100 relative group h-12 items-center hover:bg-slate-50">
                           <div className="w-[250px] px-3 font-medium text-sm text-slate-700 truncate z-10">{task.title}</div>
                           <div className="flex-1 relative h-full">
                              {/* The Gantt Bar */}
                              <div 
                                className={`absolute top-2 bottom-2 rounded-md shadow-sm ${task.color} opacity-90 group-hover:opacity-100 flex items-center px-2 text-white text-xs font-bold overflow-hidden transition-all hover:brightness-110 cursor-pointer`}
                                style={{
                                  left: `${task.start * 10}%`,
                                  width: `${task.duration * 10}%`
                                }}
                              >
                                {task.title}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
