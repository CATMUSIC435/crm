"use client"
import React, { useState, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FolderOpen, FileText, Video as VideoIcon, Box, Share2, 
  Eye, Download, Search, CloudDownload, HardDrive, 
  ChevronRight, Glasses, FileStack, LayoutGrid, List, CheckCircle2, Calendar as CalendarIcon
} from 'lucide-react'

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'grid'|'list'>('grid')
  const { documentFolders, documents } = useStore()
  
  // State for active folder selection
  const [activeFolderId, setActiveFolderId] = useState<string>(documentFolders[0]?.id || '')
  
  // State for Offline Sync Animation
  const [syncProgress, setSyncProgress] = useState(45)
  const [isSyncing, setIsSyncing] = useState(false)

  const handleSync = () => {
    if (isSyncing || syncProgress === 100) return
    setIsSyncing(true)
    
    // Simulate download progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSyncing(false)
          return 100
        }
        return prev + Math.floor(Math.random() * 15) + 5
      })
    }, 500)
  }

  const activeFolder = documentFolders.find(f => f.id === activeFolderId)
  const filteredDocs = documents.filter(doc => doc.folderId === activeFolderId)

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FolderOpen className="h-8 w-8 text-orange-500" />
            Kho Tài Liệu (Sales Kit)
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">Lưu trữ và phân phối tài liệu Bán hàng, Media, VR/3D cho toàn hệ thống.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-300 font-bold"><Search className="h-4 w-4 mr-2" /> Tìm Kiếm</Button>
          <Button onClick={handleSync} disabled={syncProgress === 100} className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-sm">
             {syncProgress === 100 ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <CloudDownload className="h-4 w-4 mr-2" />} 
             {syncProgress === 100 ? 'Đã Đồng Bộ' : 'Offline Sync'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* CỘT TRÁI: CÂY THƯ MỤC (3/12) */}
        <div className="md:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 pb-6">
           
           {/* Offline Download Banner */}
           <Card className="flex-shrink-0 bg-gradient-to-br from-orange-500 to-rose-500 text-white border-0 shadow-lg relative overflow-hidden rounded-2xl">
             <div className="absolute top-0 right-0 p-4 opacity-20"><CloudDownload className="w-24 h-24" /></div>
             <CardContent className="p-5 flex flex-col gap-4 relative z-10">
                <div className="flex items-start gap-3">
                   <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm shadow-inner"><HardDrive className="h-6 w-6" /></div>
                   <div>
                     <h3 className="font-bold text-lg">Offline Download</h3>
                     <p className="text-xs text-orange-100 mt-1 leading-relaxed font-medium">Tải Sales Kit về thiết bị để tư vấn không cần 3G/Wifi.</p>
                   </div>
                </div>
                
                <div className="bg-black/20 h-2.5 rounded-full overflow-hidden shadow-inner relative">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-500 ease-out relative"
                    style={{ width: `${Math.min(syncProgress, 100)}%` }}
                  >
                    {isSyncing && <div className="absolute inset-0 bg-white/50 animate-pulse"></div>}
                  </div>
                </div>
                
                <div className="flex justify-between text-xs font-bold text-orange-50">
                  <span>1.2 GB</span>
                  <span className={syncProgress === 100 ? 'text-green-300' : ''}>{Math.min(syncProgress, 100)}%</span>
                </div>
                
                <Button 
                  size="sm" 
                  onClick={handleSync}
                  disabled={syncProgress === 100 || isSyncing}
                  className={`font-black w-full mt-2 shadow-sm transition-all ${syncProgress === 100 ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-white text-orange-600 hover:bg-orange-50'}`}
                >
                  {syncProgress === 100 ? 'HOÀN TẤT ĐỒNG BỘ' : isSyncing ? 'ĐANG TẢI...' : 'TIẾP TỤC TẢI'}
                </Button>
             </CardContent>
           </Card>

           {/* Folders Tree */}
           <div className="space-y-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-1">
             <div className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4">Thư Mục Dự Án</div>
             {documentFolders.map(folder => {
               const isActive = activeFolderId === folder.id;
               return (
                 <div key={folder.id} className="space-y-1">
                    <div 
                      onClick={() => setActiveFolderId(folder.id)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all font-bold text-sm border border-transparent
                        ${isActive ? 'bg-orange-50 text-orange-700 border-orange-100 shadow-sm' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                      <FolderOpen className={`h-5 w-5 ${isActive ? 'fill-orange-200 text-orange-500' : 'text-slate-400'}`} />
                      <span className="flex-1 truncate leading-tight">{folder.name}</span>
                      <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </div>
                    
                    {/* Subfolders Dropdown */}
                    <div className={`overflow-hidden transition-all duration-300 ${isActive ? 'max-h-64 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                      {folder.subFolders.length > 0 ? (
                        <div className="ml-5 pl-4 border-l-2 border-orange-100 space-y-1.5 pb-2">
                          {folder.subFolders.map((sub, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-50 text-sm font-medium text-slate-600 transition-colors">
                               <FileStack className="h-4 w-4 text-slate-300" />
                               <span className="truncate">{sub}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-5 pl-4 pb-2 text-xs text-slate-400 font-medium italic">Không có thư mục con</div>
                      )}
                    </div>
                 </div>
               )
             })}
           </div>
        </div>

        {/* CỘT PHẢI: LƯỚI TÀI LIỆU (9/12) */}
        <div className="md:col-span-9 flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
           
           {/* Toolbar */}
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 flex-shrink-0">
             <div>
                <h2 className="text-xl font-bold text-slate-800">{activeFolder?.name}</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">Đang hiển thị {filteredDocs.length} tài liệu</p>
             </div>
             
             <div className="flex gap-4 items-center">
               <div className="flex gap-2">
                 <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-bold cursor-pointer">PDF</Badge>
                 <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-bold cursor-pointer">Media</Badge>
                 <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-bold cursor-pointer">VR/3D</Badge>
               </div>
               <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                  <Button 
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                    size="icon" className={`h-8 w-8 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                    size="icon" className={`h-8 w-8 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`} 
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
               </div>
             </div>
           </div>

           {/* Grid Content */}
           <div className="flex-1 overflow-y-auto pr-2">
             
             {filteredDocs.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <FolderOpen className="h-16 w-16 mb-4 text-slate-200" />
                  <p className="font-bold text-lg text-slate-500">Thư mục trống</p>
                  <p className="text-sm">Chưa có tài liệu nào trong dự án này.</p>
                </div>
             ) : (
                <div className={`grid gap-5 pb-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  
                  {filteredDocs.map(file => (
                    <Card key={file.id} className="group overflow-hidden border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                      
                      {/* Thumbnail Area */}
                      <div className="h-40 relative flex items-center justify-center border-b border-slate-100 overflow-hidden bg-slate-50">
                         {/* Dynamic Background */}
                         {file.type === 'pdf' && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-50 to-red-100/50"></div>}
                         {file.type === 'video' && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-50 to-indigo-100/50"></div>}
                         {file.type === 'vr' && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-50 to-fuchsia-100/50"></div>}
                         {file.type === '3d' && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-50 to-emerald-100/50"></div>}
                         
                         {/* Central Icon */}
                         <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                           {file.type === 'pdf' && <FileText className="h-16 w-16 text-red-500 drop-shadow-md" />}
                           {file.type === 'video' && (
                             <div className="bg-white p-3 rounded-full shadow-md text-indigo-600 ring-4 ring-indigo-50">
                               <VideoIcon className="h-10 w-10 fill-current opacity-80" />
                             </div>
                           )}
                           {file.type === 'vr' && <Glasses className="h-16 w-16 text-purple-600 drop-shadow-md" />}
                           {file.type === '3d' && <Box className="h-16 w-16 text-teal-600 drop-shadow-md" />}
                         </div>

                         {/* Top Right Tag */}
                         <div className="absolute top-3 right-3 z-10">
                           <Badge className={`uppercase text-[9px] font-black tracking-wider shadow-sm border-none
                             ${file.type === 'pdf' ? 'bg-red-100 text-red-700' : ''}
                             ${file.type === 'video' ? 'bg-indigo-100 text-indigo-700' : ''}
                             ${file.type === 'vr' ? 'bg-purple-100 text-purple-700' : ''}
                             ${file.type === '3d' ? 'bg-teal-100 text-teal-700' : ''}
                           `}>
                             {file.tag}
                           </Badge>
                         </div>

                         {/* Hover Overlay Actions */}
                         <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20 backdrop-blur-sm">
                            <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full hover:bg-orange-500 hover:text-white shadow-xl transition-colors border-0">
                              <Eye className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full hover:bg-orange-500 hover:text-white shadow-xl transition-colors border-0">
                              <Download className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="secondary" className="h-12 w-12 rounded-full hover:bg-orange-500 hover:text-white shadow-xl transition-colors border-0">
                              <Share2 className="h-5 w-5" />
                            </Button>
                         </div>
                      </div>

                      {/* Info Area */}
                      <CardContent className="p-4 sm:p-5 bg-white">
                         <h3 className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug mb-3 group-hover:text-orange-600 transition-colors" title={file.name}>
                           {file.name}
                         </h3>
                         <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                            <span className="flex items-center gap-1.5"><CalendarIcon className="h-3 w-3"/> {file.date}</span>
                            <span className="font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{file.size}</span>
                         </div>
                      </CardContent>
                    </Card>
                  ))}

                </div>
             )}
             
           </div>

        </div>
      </div>
    </div>
  )
}
