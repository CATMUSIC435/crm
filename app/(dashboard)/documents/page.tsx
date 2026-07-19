"use client"
import React, { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  FolderOpen, FileText, Video as VideoIcon, Box, Share2, 
  Eye, Download, Search, CloudDownload, HardDrive, Filter, 
  ChevronRight, Glasses, FileStack, LayoutGrid, List
} from 'lucide-react'

const FILES = [
  { id: 'f1', type: 'pdf', name: 'Chinh_Sach_Ban_Hang_Thang7.pdf', size: '2.4 MB', date: '15/07/2026', tag: 'Chính sách' },
  { id: 'f2', type: 'video', name: 'TVC_AquaCity_RiverPark_4K.mp4', size: '250 MB', date: '10/07/2026', tag: 'Video' },
  { id: 'f3', type: 'vr', name: 'Trải Nghiệm Thực Tế Ảo (VR360) Căn Hộ Mẫu', size: 'Link Web', date: '05/07/2026', tag: 'VR' },
  { id: 'f4', type: '3d', name: 'Mô Hình Sa Bàn 3D Toàn Dự Án', size: 'App iOS/Android', date: '01/07/2026', tag: '3D' },
  { id: 'f5', type: 'pdf', name: 'Broschure_SunHarbor.pdf', size: '15.6 MB', date: '12/07/2026', tag: 'Brochure' },
  { id: 'f6', type: 'pdf', name: 'Bang_Gia_Tham_Khao_V2.pdf', size: '1.1 MB', date: '18/07/2026', tag: 'Giá' },
]

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid')
  const { projects } = useStore()
  
  const FOLDERS = [
    { id: 1, name: `Dự án ${projects[0]?.name || 'Aqua City'}`, active: true, sub: ['Chính sách bán hàng', 'Tài liệu pháp lý', 'Bảng giá (Cập nhật)', 'Hình ảnh thiết kế', 'Flycam / Sa bàn'] },
    { id: 2, name: `Dự án ${projects[1]?.name || 'Novaworld Phan Thiết'}`, active: false, sub: [] },
    { id: 3, name: `Dự án ${projects[2]?.name || 'Vinhomes Grand Park'}`, active: false, sub: [] },
    { id: 4, name: 'Cẩm Nang Đào Tạo (Sale)', active: false, sub: [] },
  ]

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FolderOpen className="h-8 w-8 text-orange-500" />
            Kho Tài Liệu (Sales Kit)
          </h1>
          <p className="text-muted-foreground mt-1">Lưu trữ và phân phối tài liệu Bán hàng, Media, VR/3D cho toàn hệ thống.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-300"><Search className="h-4 w-4 mr-2" /> Tìm Kiếm</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
             <CloudDownload className="h-4 w-4 mr-2" /> Offline Sync
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* CỘT TRÁI: CÂY THƯ MỤC (3/12) */}
        <div className="md:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
           
           {/* Offline Download Banner */}
           <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0 shadow-md">
             <CardContent className="p-5 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                   <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><HardDrive className="h-6 w-6" /></div>
                   <div>
                     <h3 className="font-bold">Offline Download</h3>
                     <p className="text-xs text-orange-100 mt-1 leading-relaxed">Tải toàn bộ Sales Kit của Dự Án này về iPad để tư vấn khi không có 3G/Wifi.</p>
                   </div>
                </div>
                <div className="bg-black/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[45%] rounded-full"></div>
                </div>
                <div className="flex justify-between text-xs font-bold text-orange-100">
                  <span>Dung lượng: 1.2 GB</span>
                  <span>Đã tải: 45%</span>
                </div>
                <Button size="sm" className="bg-white text-orange-600 hover:bg-slate-100 font-bold w-full mt-2">
                  Tiếp Tục Tải / Cập Nhật
                </Button>
             </CardContent>
           </Card>

           {/* Folders Tree */}
           <div className="space-y-1">
             <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 mb-3">Thư Mục Dự Án</div>
             {FOLDERS.map(folder => (
               <div key={folder.id} className="space-y-1">
                  <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors font-medium text-sm ${folder.active ? 'bg-orange-100 text-orange-700' : 'hover:bg-slate-100 text-slate-700'}`}>
                    <FolderOpen className={`h-4 w-4 ${folder.active ? 'fill-orange-200' : ''}`} />
                    <span className="flex-1 truncate">{folder.name}</span>
                    <ChevronRight className={`h-4 w-4 transition-transform ${folder.active ? 'rotate-90' : ''}`} />
                  </div>
                  {folder.active && folder.sub.length > 0 && (
                    <div className="ml-5 pl-4 border-l border-orange-200 space-y-1 mt-1">
                      {folder.sub.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer hover:bg-slate-100 text-sm text-slate-600 transition-colors">
                           <FileStack className="h-3.5 w-3.5 opacity-50" />
                           <span className="truncate">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
             ))}
           </div>
        </div>

        {/* CỘT PHẢI: LƯỚI TÀI LIỆU (9/12) */}
        <div className="md:col-span-9 flex flex-col min-h-0 bg-slate-50/50 rounded-2xl border p-4 sm:p-6 shadow-inner">
           
           {/* Toolbar */}
           <div className="flex justify-between items-center mb-6 flex-shrink-0">
             <div className="flex gap-2">
               <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700">Tất cả File (124)</Badge>
               <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700">PDF</Badge>
               <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700">Media</Badge>
               <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700">VR/3D</Badge>
             </div>
             <div className="flex gap-1 bg-white border p-1 rounded-lg">
                <Button 
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                  size="icon" className="h-8 w-8" onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                  size="icon" className="h-8 w-8" onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
             </div>
           </div>

           {/* Grid Content */}
           <div className="flex-1 overflow-y-auto">
             <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
               
               {FILES.map(file => (
                 <Card key={file.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-orange-300">
                   
                   {/* Thumbnail Area */}
                   <div className="h-36 bg-slate-100 relative flex items-center justify-center border-b">
                      {/* Gradient Overlays for aesthetics */}
                      {file.type === 'pdf' && <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>}
                      {file.type === 'video' && <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"></div>}
                      {file.type === 'vr' && <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-fuchsia-100"></div>}
                      {file.type === '3d' && <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-emerald-100"></div>}
                      
                      {/* Central Icon */}
                      <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-300">
                        {file.type === 'pdf' && <FileText className="h-14 w-14 text-red-500 drop-shadow-sm" />}
                        {file.type === 'video' && (
                          <div className="bg-black/10 p-3 rounded-full backdrop-blur-sm border border-black/10">
                            <VideoIcon className="h-10 w-10 text-indigo-600" />
                          </div>
                        )}
                        {file.type === 'vr' && <Glasses className="h-14 w-14 text-purple-600 drop-shadow-sm" />}
                        {file.type === '3d' && <Box className="h-14 w-14 text-teal-600 drop-shadow-sm" />}
                      </div>

                      {/* Top Right Tag */}
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className={`uppercase text-[9px] font-bold shadow-sm
                          ${file.type === 'pdf' ? 'bg-red-500 hover:bg-red-600' : ''}
                          ${file.type === 'video' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}
                          ${file.type === 'vr' ? 'bg-purple-500 hover:bg-purple-600' : ''}
                          ${file.type === '3d' ? 'bg-teal-500 hover:bg-teal-600' : ''}
                        `}>
                          {file.tag}
                        </Badge>
                      </div>

                      {/* Hover Actions (Desktop) */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-20 backdrop-blur-[2px]">
                         <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full hover:bg-white hover:text-orange-600">
                           <Eye className="h-4 w-4" />
                         </Button>
                         <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full hover:bg-white hover:text-orange-600">
                           <Download className="h-4 w-4" />
                         </Button>
                         <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full hover:bg-white hover:text-orange-600">
                           <Share2 className="h-4 w-4" />
                         </Button>
                      </div>
                   </div>

                   {/* Info Area */}
                   <CardContent className="p-4">
                      <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug mb-2" title={file.name}>
                        {file.name}
                      </h3>
                      <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                         <span>{file.date}</span>
                         <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{file.size}</span>
                      </div>
                   </CardContent>
                 </Card>
               ))}

             </div>
           </div>

        </div>
      </div>
    </div>
  )
}
