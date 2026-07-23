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
  Columns, Clock, Flag, User2, MessageSquare, BarChartHorizontal,
  CheckCircle2
} from 'lucide-react'

export default function TasksPage() {
  const { tasks, addTask, updateTaskStatus } = useStore()
  const [activeTab, setActiveTab] = useState('kanban')

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId)
    const target = e.target as HTMLElement;
    target.style.opacity = '0.5';
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement;
    target.style.opacity = '1';
  }

  const handleDrop = (e: React.DragEvent, status: 'todo' | 'in_progress' | 'review' | 'done') => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      updateTaskStatus(taskId, status)
    }
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('bg-slate-200/50', 'ring-2', 'ring-indigo-400');
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  
  const handleDragEnter = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.add('bg-slate-200/50', 'ring-2', 'ring-indigo-400');
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('bg-slate-200/50', 'ring-2', 'ring-indigo-400');
  }

  const handleQuickAdd = () => {
    addTask('Nhiệm vụ mới từ phòng Sale', 'Tuấn Tú')
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-indigo-500" />
            Công Việc & Lịch Trình
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">Bảng Kanban Live-Data kéo thả, đồng bộ List, Calendar và Gantt Chart.</p>
        </div>
        <Button onClick={handleQuickAdd} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm h-10 px-6">
          <Plus className="h-4 w-4 mr-2" /> Tạo Công Việc Nhanh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[600px] mb-6 h-auto md:h-12 bg-slate-100 p-1.5 rounded-xl">
          <TabsTrigger value="kanban" className="rounded-lg py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"><Columns className="h-4 w-4 text-indigo-600"/> Kanban</TabsTrigger>
          <TabsTrigger value="list" className="rounded-lg py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"><AlignLeft className="h-4 w-4 text-emerald-600"/> List</TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-lg py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"><CalendarIcon className="h-4 w-4 text-amber-600"/> Calendar</TabsTrigger>
          <TabsTrigger value="gantt" className="rounded-lg py-2 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2"><BarChartHorizontal className="h-4 w-4 text-rose-600"/> Gantt</TabsTrigger>
        </TabsList>

        {/* 1. KANBAN VIEW */}
        <TabsContent value="kanban" className="space-y-4">
          <div className="flex gap-5 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
             {[
               { id: 'todo', title: 'TO DO (CẦN LÀM)', color: 'bg-slate-50 border-slate-200', text: 'text-slate-600', dot: 'bg-slate-400' },
               { id: 'in_progress', title: 'IN PROGRESS (ĐANG XỬ LÝ)', color: 'bg-blue-50/50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-500' },
               { id: 'review', title: 'IN REVIEW (CHỜ DUYỆT)', color: 'bg-amber-50/50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-500' },
               { id: 'done', title: 'DONE (HOÀN TẤT)', color: 'bg-emerald-50/50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' }
             ].map(col => (
               <div 
                 key={col.id} 
                 className={`w-[320px] flex-shrink-0 rounded-2xl border ${col.color} flex flex-col h-[650px] shadow-sm snap-center transition-all`}
                 onDrop={(e) => handleDrop(e, col.id as any)}
                 onDragOver={handleDragOver}
                 onDragEnter={handleDragEnter}
                 onDragLeave={handleDragLeave}
               >
                 <div className="p-4 border-b border-black/5 flex justify-between items-center bg-white/40 rounded-t-2xl">
                    <div className={`font-black text-sm flex items-center gap-2 ${col.text}`}>
                      <div className={`h-2 w-2 rounded-full ${col.dot}`}></div>
                      {col.title}
                    </div>
                    <Badge variant="secondary" className="bg-white shadow-sm font-black">{tasks.filter(t => t.status === col.id).length}</Badge>
                 </div>
                 
                 <div className="p-3 flex-1 overflow-y-auto flex flex-col gap-3 min-h-[100px]">
                    {tasks.filter(t => t.status === col.id).map(task => (
                      <Card 
                        key={task.id} 
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className="cursor-grab active:cursor-grabbing hover:shadow-lg transition-all border-0 ring-1 ring-slate-200 hover:ring-indigo-300 relative group bg-white"
                      >
                        <CardContent className="p-4 space-y-3 bg-white rounded-xl">
                           <div className="flex justify-between items-start">
                             <div className="flex gap-1">
                               {task.priority === 'high' && <Badge className="bg-red-50 text-red-700 border-red-200 px-2 uppercase text-[10px] font-black">High</Badge>}
                               {task.priority === 'medium' && <Badge className="bg-orange-50 text-orange-700 border-orange-200 px-2 uppercase text-[10px] font-black">Medium</Badge>}
                               {task.priority === 'low' && <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-2 uppercase text-[10px] font-black">Low</Badge>}
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{task.id}</span>
                           </div>
                           
                           <h4 className={`font-bold text-sm leading-snug ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                             {task.title}
                           </h4>
                           
                           <div className="flex justify-between items-center pt-3 mt-2 border-t border-dashed border-slate-100">
                             <div className="flex gap-3 text-xs font-bold text-slate-500">
                               <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md"><Clock className="h-3.5 w-3.5 text-indigo-400"/> {task.due}</span>
                               <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5 text-slate-400"/> {task.comments}</span>
                             </div>
                             <div className="h-7 w-7 rounded-full bg-indigo-100 border border-white shadow-sm flex items-center justify-center text-[10px] font-black text-indigo-700 ring-2 ring-indigo-50" title={task.assignee}>
                               {task.assignee.substring(0, 2).toUpperCase()}
                             </div>
                           </div>
                           
                           {/* Hover drag indicator */}
                           <div className="absolute top-0 right-0 bottom-0 w-1 bg-indigo-400 opacity-0 group-hover:opacity-100 rounded-r-xl transition-opacity pointer-events-none"></div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {tasks.filter(t => t.status === col.id).length === 0 && (
                      <div className="flex flex-col items-center justify-center h-24 text-slate-400 text-sm font-medium border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
                        Kéo thả vào đây
                      </div>
                    )}
                 </div>
               </div>
             ))}
          </div>
        </TabsContent>

        {/* 2. LIST VIEW */}
        <TabsContent value="list" className="space-y-4">
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="w-16 text-center font-bold">✓</TableHead>
                    <TableHead className="font-bold text-slate-700">Tên Công Việc</TableHead>
                    <TableHead className="font-bold text-slate-700">Mức Độ</TableHead>
                    <TableHead className="font-bold text-slate-700">Trạng Thái</TableHead>
                    <TableHead className="font-bold text-slate-700">Người Phụ Trách</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Hạn Chót</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map(task => (
                    <TableRow key={task.id} className="hover:bg-slate-50/80 transition-colors border-slate-100">
                      <TableCell className="text-center">
                        <Checkbox 
                          checked={task.status === 'done'} 
                          onCheckedChange={(checked) => updateTaskStatus(task.id, checked ? 'done' : 'todo')}
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800">
                        <span className={task.status === 'done' ? 'line-through text-slate-400 font-medium' : ''}>{task.title}</span>
                      </TableCell>
                      <TableCell>
                         {task.priority === 'high' && <Badge className="bg-red-50 text-red-700 border-none font-bold uppercase text-[10px]"><Flag className="h-3 w-3 mr-1"/> High</Badge>}
                         {task.priority === 'medium' && <Badge className="bg-orange-50 text-orange-700 border-none font-bold uppercase text-[10px]"><Flag className="h-3 w-3 mr-1"/> Med</Badge>}
                         {task.priority === 'low' && <Badge className="bg-blue-50 text-blue-700 border-none font-bold uppercase text-[10px]"><Flag className="h-3 w-3 mr-1"/> Low</Badge>}
                      </TableCell>
                      <TableCell>
                         {task.status === 'todo' && <Badge variant="outline" className="bg-slate-100 text-slate-600 border-transparent font-bold">Cần làm</Badge>}
                         {task.status === 'in_progress' && <Badge variant="outline" className="bg-blue-100 text-blue-700 border-transparent font-bold">Đang xử lý</Badge>}
                         {task.status === 'review' && <Badge variant="outline" className="bg-amber-100 text-amber-700 border-transparent font-bold">Chờ duyệt</Badge>}
                         {task.status === 'done' && <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-transparent font-bold">Hoàn tất</Badge>}
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                           <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] text-indigo-700">{task.assignee.substring(0,2).toUpperCase()}</div>
                           {task.assignee}
                         </div>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-500">
                        <div className="bg-slate-50 px-2 py-1 rounded inline-block">{task.due}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. CALENDAR VIEW (Static Render for Demo) */}
        <TabsContent value="calendar" className="space-y-4">
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden bg-white">
             <CardHeader className="flex flex-row items-center justify-between py-5 border-b bg-slate-50/80">
                <CardTitle className="text-xl font-bold flex items-center gap-2"><CalendarIcon className="h-5 w-5 text-amber-500"/> Tháng 7, 2026</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="font-bold">Hôm nay</Button>
                  <Button variant="outline" size="sm" className="font-bold">Tháng trước</Button>
                  <Button variant="outline" size="sm" className="font-bold">Tháng sau</Button>
                </div>
             </CardHeader>
             <CardContent className="p-4 bg-slate-50/30">
                <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-t-xl overflow-hidden">
                  {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                    <div key={day} className="bg-white py-3 text-center text-sm font-black text-slate-500">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-slate-200 border-x border-b border-slate-200 rounded-b-xl overflow-hidden">
                  {/* Empty slots for offset */}
                  <div className="bg-slate-50 min-h-[120px] p-2 text-slate-300 font-bold">29</div>
                  <div className="bg-slate-50 min-h-[120px] p-2 text-slate-300 font-bold">30</div>
                  {/* Real Days */}
                  {Array.from({length: 31}).map((_, i) => (
                    <div key={i} className={`bg-white min-h-[120px] p-2 relative group hover:bg-indigo-50/30 transition-colors ${i+1 === 19 ? 'bg-indigo-50/10' : ''}`}>
                       <div className={`text-sm font-black mb-2 ${i+1 === 19 ? 'bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-md' : 'text-slate-600'}`}>
                         {i + 1}
                       </div>
                       
                       {/* Mock Events derived from Tasks where possible */}
                       {(i + 1 === 19) && (
                         <>
                           <div className="text-[10px] bg-indigo-100 text-indigo-700 p-1.5 rounded-md mb-1.5 truncate font-bold shadow-sm">{tasks[0]?.title}</div>
                           <div className="text-[10px] bg-emerald-100 text-emerald-700 p-1.5 rounded-md mb-1.5 truncate font-bold shadow-sm">{tasks[1]?.title}</div>
                         </>
                       )}
                       {(i + 1 === 15) && (
                         <div className="text-[10px] bg-amber-100 text-amber-700 p-1.5 rounded-md mb-1.5 truncate font-bold shadow-sm">{tasks[2]?.title}</div>
                       )}
                       {(i + 1 === 20) && (
                         <div className="text-[10px] bg-red-100 text-red-700 p-1.5 rounded-md mb-1.5 truncate font-bold shadow-sm">{tasks[3]?.title}</div>
                       )}
                    </div>
                  ))}
                  {/* Fill empty */}
                  <div className="bg-slate-50 min-h-[120px] p-2 text-slate-300 font-bold">1</div>
                  <div className="bg-slate-50 min-h-[120px] p-2 text-slate-300 font-bold">2</div>
                </div>
             </CardContent>
          </Card>
        </TabsContent>

        {/* 4. GANTT CHART VIEW (Static Render for Demo) */}
        <TabsContent value="gantt" className="space-y-4">
          <Card className="border-0 shadow-sm ring-1 ring-slate-200 rounded-2xl overflow-hidden bg-white">
             <CardHeader className="py-5 border-b bg-slate-50/80">
                <CardTitle className="text-xl font-bold flex items-center gap-2"><BarChartHorizontal className="h-5 w-5 text-rose-500"/> Tiến Độ Dự Án (Timeline)</CardTitle>
             </CardHeader>
             <CardContent className="p-0 overflow-x-auto bg-white">
                <div className="min-w-[800px]">
                   <div className="flex border-b text-xs font-black text-slate-500 bg-slate-50">
                     <div className="w-[300px] p-4 border-r uppercase tracking-wider">Tên Hạng Mục</div>
                     {Array.from({length: 10}).map((_, i) => (
                       <div key={i} className="flex-1 p-4 text-center border-r uppercase tracking-wider">Ngày {15 + i}</div>
                     ))}
                   </div>

                   <div className="relative">
                      <div className="absolute inset-0 flex pointer-events-none">
                         <div className="w-[300px] border-r border-slate-200"></div>
                         {Array.from({length: 10}).map((_, i) => (
                           <div key={i} className="flex-1 border-r border-slate-100"></div>
                         ))}
                      </div>

                      {[
                        { title: tasks[2]?.title || 'Gửi báo giá', start: 0, duration: 2, color: 'bg-rose-500' },
                        { title: tasks[3]?.title || 'Setup chạy Ads', start: 1, duration: 4, color: 'bg-indigo-500' },
                        { title: 'Tối ưu Ads (Scale up)', start: 5, duration: 5, color: 'bg-purple-500' },
                        { title: tasks[1]?.title || 'Chuẩn bị tài liệu', start: 3, duration: 2, color: 'bg-emerald-500' },
                        { title: 'Chốt cọc 10 KH đầu tiên', start: 5, duration: 3, color: 'bg-amber-500' },
                      ].map((task, i) => (
                        <div key={i} className="flex border-b border-slate-100/50 relative group h-14 items-center hover:bg-slate-50/50">
                           <div className="w-[300px] px-4 font-bold text-sm text-slate-700 truncate z-10">{task.title}</div>
                           <div className="flex-1 relative h-full">
                              <div 
                                className={`absolute top-2.5 bottom-2.5 rounded-lg shadow-sm ${task.color} opacity-90 group-hover:opacity-100 flex items-center px-3 text-white text-xs font-bold overflow-hidden transition-all hover:brightness-110 cursor-pointer`}
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
