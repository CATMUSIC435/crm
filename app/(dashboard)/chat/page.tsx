"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '@/store/useStore'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Hash, Plus, MessageCircle, MoreVertical, 
  Phone, Video, Paperclip, Mic, Smile, Send, 
  FileText, Download, X, VideoOff, MicOff, Maximize, Share2
} from 'lucide-react'

const DMS = [
  { id: 'u1', name: 'Thanh Hà (Marketing)', online: true, avatar: 'TH' },
  { id: 'u2', name: 'Tuấn Tú (Pháp lý)', online: true, avatar: 'TT' },
  { id: 'u3', name: 'Giám Đốc Hùng', online: false, avatar: 'GD' },
]

export default function ChatPage() {
  const { customers, projects } = useStore()
  const projectName = projects[0]?.name || 'Aqua City'
  const customerName = customers[0]?.name || 'anh Dũng'

  const CHANNELS = [
    { id: 'c1', name: `dự-án-${projectName.toLowerCase().replace(/\s+/g, '-')}`, unread: 3 },
    { id: 'c2', name: 'team-sale-quận-1', unread: 0 },
    { id: 'c3', name: 'ban-giám-đốc', unread: 0 },
    { id: 'c4', name: 'hỗ-trợ-pháp-lý', unread: 5 },
  ]

  const [activeChat, setActiveChat] = useState(`# dự-án-${projectName.toLowerCase().replace(/\s+/g, '-')}`)
  const [message, setMessage] = useState('')
  const [showVideoCall, setShowVideoCall] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [message])

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-4 sm:-m-8 border rounded-xl overflow-hidden shadow-sm bg-background">
      
      {/* CỘT TRÁI: DANH SÁCH KÊNH & NGƯỜI DÙNG */}
      <div className="hidden md:flex w-64 sm:w-80 bg-slate-50 dark:bg-slate-900/50 border-r flex-col flex-shrink-0">
        
        {/* Header (Search) */}
        <div className="p-4 border-b">
           <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
             <MessageCircle className="h-6 w-6" /> Chat Nội Bộ
           </h2>
           <div className="relative">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Tìm kiếm tin nhắn..." className="pl-9 bg-white dark:bg-black/20 border-slate-200" />
           </div>
        </div>

        {/* Danh sách */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
           
           {/* Channels */}
           <div>
             <div className="flex items-center justify-between px-2 mb-2">
               <span className="text-xs font-bold text-slate-500 uppercase">Kênh Nhóm (Channels)</span>
               <Button variant="ghost" size="icon" className="h-4 w-4"><Plus className="h-4 w-4" /></Button>
             </div>
             <div className="space-y-0.5">
               {CHANNELS.map(ch => (
                 <div 
                   key={ch.id} 
                   onClick={() => setActiveChat('# ' + ch.name)}
                   className={`flex justify-between items-center px-3 py-2 rounded-md cursor-pointer transition-colors ${activeChat === '# ' + ch.name ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-slate-200/50 text-slate-700'}`}
                 >
                   <div className="flex items-center gap-2 text-sm truncate">
                     <Hash className="h-4 w-4 opacity-50" />
                     <span className="truncate">{ch.name}</span>
                   </div>
                   {ch.unread > 0 && <Badge className="bg-indigo-500 h-5 px-1.5">{ch.unread}</Badge>}
                 </div>
               ))}
             </div>
           </div>

           {/* Direct Messages */}
           <div>
             <div className="flex items-center justify-between px-2 mb-2">
               <span className="text-xs font-bold text-slate-500 uppercase">Chat Cá Nhân (DM)</span>
               <Button variant="ghost" size="icon" className="h-4 w-4"><Plus className="h-4 w-4" /></Button>
             </div>
             <div className="space-y-0.5">
               {DMS.map(dm => (
                 <div 
                   key={dm.id} 
                   onClick={() => setActiveChat(dm.name)}
                   className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${activeChat === dm.name ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-slate-200/50 text-slate-700'}`}
                 >
                   <div className="relative">
                     <Avatar className="h-8 w-8 rounded-md">
                        <AvatarFallback className="bg-slate-300 text-slate-700 rounded-md text-xs">{dm.avatar}</AvatarFallback>
                     </Avatar>
                     {dm.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                     {!dm.online && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-slate-400 rounded-full border-2 border-white"></div>}
                   </div>
                   <span className="text-sm truncate">{dm.name}</span>
                 </div>
               ))}
             </div>
           </div>

        </div>
      </div>

      {/* CỘT PHẢI: KHUNG CHAT CHÍNH */}
      <div className="flex-1 flex flex-col bg-white dark:bg-black relative">
        
        {/* Chat Header */}
        <div className="h-16 border-b flex justify-between items-center px-4 md:px-6 flex-shrink-0 bg-slate-50/50">
           <div className="flex flex-col">
             <h3 className="font-bold text-lg flex items-center gap-2">
               {activeChat.startsWith('#') ? <Hash className="h-5 w-5 text-slate-400"/> : null}
               {activeChat}
             </h3>
             {activeChat.startsWith('#') && <span className="text-xs text-muted-foreground">12 thành viên đang theo dõi</span>}
           </div>
           
           <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-full h-10 w-10">
                <Phone className="h-5 w-5" />
              </Button>
              <Button 
                onClick={() => setShowVideoCall(true)}
                variant="ghost" size="icon" className="text-pink-600 bg-pink-50 hover:bg-pink-100 rounded-full h-10 w-10"
              >
                <Video className="h-5 w-5" />
              </Button>
              <div className="w-px h-6 bg-border mx-2"></div>
              <Button variant="ghost" size="icon" className="text-slate-500 rounded-full"><Search className="h-5 w-5" /></Button>
              <Button variant="ghost" size="icon" className="text-slate-500 rounded-full"><MoreVertical className="h-5 w-5" /></Button>
           </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/30">
          
          <div className="text-center my-6">
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Hôm nay, 19 Tháng 7</span>
          </div>

          {/* Tin nhắn từ người khác */}
          <div className="flex gap-4 max-w-[80%]">
             <Avatar className="h-10 w-10">
               <AvatarFallback className="bg-indigo-100 text-indigo-700">TH</AvatarFallback>
             </Avatar>
             <div>
               <div className="flex items-baseline gap-2 mb-1">
                 <span className="font-bold text-sm">Thanh Hà</span>
                 <span className="text-xs text-muted-foreground">09:15 AM</span>
               </div>
               <div className="bg-white border p-3 rounded-2xl rounded-tl-sm text-sm shadow-sm">
                 Sếp ơi, em vừa gửi Báo giá 3 căn Shophouse cho {customerName} xong. Em đính kèm bản PDF ở đây sếp check nhé!
               </div>
             </div>
          </div>

          {/* Tin nhắn Đính kèm File */}
          <div className="flex gap-4 max-w-[80%]">
             <Avatar className="h-10 w-10 opacity-0"></Avatar> {/* Spacer */}
             <div className="w-full">
               <div className="bg-white border p-3 rounded-2xl rounded-tl-sm shadow-sm w-72">
                 <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="font-bold text-sm truncate">Bao_Gia_Shophouse.pdf</div>
                      <div className="text-xs text-muted-foreground">1.2 MB</div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500"><Download className="h-4 w-4"/></Button>
                 </div>
               </div>
             </div>
          </div>

          {/* Tin nhắn của mình */}
          <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
             <Avatar className="h-10 w-10">
               <AvatarFallback className="bg-blue-600 text-white">ME</AvatarFallback>
             </Avatar>
             <div className="flex flex-col items-end">
               <div className="flex items-baseline gap-2 mb-1 flex-row-reverse">
                 <span className="font-bold text-sm">Bạn</span>
                 <span className="text-xs text-muted-foreground">09:18 AM</span>
               </div>
               <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-sm">
                 Tuyệt vời! File báo giá làm rất đẹp. Bạn chốt luôn lịch hẹn khách lên sa bàn cuối tuần này nhé. Có gì cần team hỗ trợ cứ hú lên đây.
               </div>
             </div>
          </div>

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Footer (Input) */}
        <div className="p-4 bg-white border-t">
          <div className="flex flex-col border border-slate-300 rounded-xl bg-slate-50 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all overflow-hidden shadow-sm">
            <textarea 
              rows={2}
              placeholder="Nhập tin nhắn..." 
              className="w-full bg-transparent p-3 outline-none resize-none text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between items-center p-2 bg-white border-t">
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"><Plus className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"><Paperclip className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"><Mic className="h-4 w-4"/></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"><Smile className="h-4 w-4"/></Button>
              </div>
              <Button 
                size="sm" 
                className={`h-8 px-4 rounded-lg font-bold transition-colors ${message.trim() ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Gửi <Send className="h-3 w-3 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* MOCK VIDEO CALL POPUP */}
      {showVideoCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
           <div className="relative w-full max-w-4xl aspect-video bg-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-700">
             
             {/* Main Video (Other person) */}
             <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 to-indigo-900">
                <Avatar className="h-40 w-40 border-4 border-slate-700 shadow-2xl">
                  <AvatarFallback className="bg-indigo-600 text-white text-5xl">TH</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-6 left-6 text-white font-bold text-xl drop-shadow-md">
                  Đang gọi: Thanh Hà (Marketing)...
                </div>
             </div>

             {/* Picture in Picture (Me) */}
             <div className="absolute top-6 right-6 w-48 h-32 bg-slate-900 rounded-lg border-2 border-slate-600 overflow-hidden shadow-lg flex items-center justify-center">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-blue-600 text-white text-xl">ME</AvatarFallback>
                </Avatar>
             </div>

             {/* Top Actions */}
             <Button variant="ghost" className="absolute top-6 left-6 text-white hover:bg-white/20"><Maximize className="h-5 w-5 mr-2" /> Toàn màn hình</Button>

             {/* Control Bar (Bottom) */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700/50">
               <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
                 <MicOff className="h-5 w-5" />
               </Button>
               <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
                 <VideoOff className="h-5 w-5" />
               </Button>
               <Button 
                 onClick={() => setShowVideoCall(false)}
                 variant="destructive" size="icon" className="rounded-full h-14 w-14 shadow-lg hover:scale-105 transition-transform"
               >
                 <Phone className="h-6 w-6 rotate-[135deg]" />
               </Button>
               <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
                 <Share2 className="h-5 w-5" />
               </Button>
               <Button variant="outline" size="icon" className="rounded-full h-12 w-12 border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
                 <MoreVertical className="h-5 w-5" />
               </Button>
             </div>
           </div>
        </div>
      )}

    </div>
  )
}
