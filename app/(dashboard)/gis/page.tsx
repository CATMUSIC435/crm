"use client"
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Map, MapPin, Train, Waves, CircleDollarSign, Sparkles, Loader2, X, Navigation } from 'lucide-react'
import { useStore } from '@/store/useStore'
import Link from 'next/link'

// Load map component dynamically with SSR disabled
const DynamicMap = dynamic(() => import('@/components/map/gis-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground animate-pulse">Đang tải Bản đồ GIS (Leaflet)...</div>
})

const LAYERS = [
  { id: 'planning', label: 'Quy hoạch sử dụng đất', icon: Map, color: 'text-orange-500' },
  { id: 'metro', label: 'Hạ tầng giao thông (Metro)', icon: Train, color: 'text-red-500' },
  { id: 'flood', label: 'Cảnh báo ngập lụt', icon: Waves, color: 'text-cyan-500' },
  { id: 'landprice', label: 'Bản đồ Giá đất (Heatmap)', icon: CircleDollarSign, color: 'text-emerald-500' },
]

export default function GISPage() {
  const projects = useStore((state) => state.projects)
  
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    metro: true
  })
  
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [aiResults, setAiResults] = useState<any>(null)

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    setAiResults(null)
    
    // Simulate AI NLP parsing time, then return a matching real project (e.g., Grand Manhattan if in Q1, or Aqua City)
    setTimeout(() => {
      setIsSearching(false)
      const queryLower = searchQuery.toLowerCase()
      
      let matchedProjects = []
      if (queryLower.includes("quận 1") || queryLower.includes("trung tâm")) {
        matchedProjects = projects.filter(p => p.id === 'p3') // Grand Manhattan
      } else if (queryLower.includes("đồng nai") || queryLower.includes("sinh thái")) {
        matchedProjects = projects.filter(p => p.id === 'p2') // Aqua City
      } else {
        matchedProjects = projects.filter(p => p.id === 'p3') // Default match
      }
      
      setAiResults(matchedProjects)
    }, 1500)
  }

  const clearAI = () => {
    setAiResults(null)
    setSearchQuery("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] gap-4 -m-4 sm:-m-8 p-4 sm:p-8 bg-background">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
             <Map className="h-8 w-8 text-indigo-500" />
             Bản Đồ GIS & AI Search
           </h1>
           <p className="text-muted-foreground mt-1">Chat với bản đồ để tìm kiếm và khoanh vùng dự án phù hợp nhất.</p>
         </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 relative">
         {/* Map Area */}
         <div className="flex-1 rounded-xl overflow-hidden border shadow-sm relative min-h-[400px]">
            {/* AI Search Bar Overlay */}
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[400] w-[90%] max-w-2xl">
              <form onSubmit={handleAISearch} className="relative flex items-center shadow-2xl rounded-full bg-white dark:bg-gray-900 overflow-hidden border border-indigo-200 dark:border-indigo-800">
                 <div className="pl-4">
                   {isSearching ? <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" /> : <Sparkles className="h-5 w-5 text-indigo-500" />}
                 </div>
                 <Input 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   placeholder="Nhập yêu cầu: 'Tìm dự án Quận 1 gần Metro'"
                   className="border-0 focus-visible:ring-0 shadow-none text-base bg-transparent flex-1 h-12"
                 />
                 {aiResults && (
                   <button type="button" onClick={clearAI} className="p-2 text-muted-foreground hover:text-foreground mr-2">
                     <X className="h-5 w-5" />
                   </button>
                 )}
                 <Button type="submit" disabled={isSearching} className="h-12 rounded-none rounded-r-full px-8 bg-indigo-600 hover:bg-indigo-700 font-bold">
                    Tìm kiếm AI
                 </Button>
              </form>
              
              {/* AI NLP Status popup */}
              {isSearching && (
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-sm whitespace-nowrap animate-in slide-in-from-top-4">
                   <Sparkles className="h-4 w-4 animate-pulse" />
                   AI đang quét bản đồ: {searchQuery}...
                </div>
              )}
            </div>

            <DynamicMap activeLayers={activeLayers} aiResults={aiResults} />
            
            {/* Standard Layers Control Overlay */}
            <div className="absolute top-24 left-4 z-[400] bg-white/95 dark:bg-gray-950/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 min-w-[220px]">
               <h4 className="font-bold text-sm mb-3 px-1 text-gray-800 dark:text-gray-200 uppercase tracking-wider">Lớp dữ liệu (Layers)</h4>
               <div className="flex flex-col gap-1">
                 {LAYERS.map(l => (
                   <label key={l.id} className="flex items-center gap-3 text-sm p-2 hover:bg-muted rounded-lg cursor-pointer transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-800">
                     <input type="checkbox" checked={!!activeLayers[l.id]} onChange={() => toggleLayer(l.id)} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                     <l.icon className={`h-5 w-5 ${l.color}`} />
                     <span className="font-medium text-gray-700 dark:text-gray-300">{l.label}</span>
                   </label>
                 ))}
               </div>
            </div>
         </div>

         {/* AI Results Drawer (Right side) */}
         {aiResults && aiResults.length > 0 && (
            <Card className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col overflow-hidden bg-background border shadow-xl animate-in slide-in-from-right-8">
               <div className="p-4 border-b bg-indigo-50 dark:bg-indigo-950/20">
                 <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                   <Sparkles className="h-5 w-5" />
                   <h3 className="font-bold text-lg">AI Match Results</h3>
                 </div>
                 <p className="text-sm font-medium text-indigo-800/70 dark:text-indigo-300/70 mt-2">Tìm thấy {aiResults.length} kết quả phù hợp nhất</p>
               </div>
               <div className="overflow-y-auto p-4 flex-1 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                  {aiResults.map((project: any) => (
                    <div key={project.id} className="bg-white dark:bg-gray-950 rounded-xl border shadow-sm overflow-hidden hover:border-indigo-400 hover:shadow-md transition-all group">
                       <div className="h-32 w-full relative">
                         <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                         <Badge className="absolute top-2 left-2 bg-green-500 hover:bg-green-600">Phù hợp 98%</Badge>
                       </div>
                       <div className="p-4">
                         <h4 className="font-bold text-lg group-hover:text-indigo-600 transition-colors mb-1">{project.name}</h4>
                         <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                           <MapPin className="h-3 w-3" /> {project.location}
                         </p>
                         
                         <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                            <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded">
                              <span className="text-muted-foreground block text-xs">Loại hình</span>
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{project.type}</span>
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded">
                              <span className="text-indigo-600 dark:text-indigo-400 block text-xs">AI Rating</span>
                              <span className="font-bold text-indigo-700 dark:text-indigo-300">{project.aiAnalysis?.rating || 'BUY'}</span>
                            </div>
                         </div>
                         
                         <Link href={`/projects/${project.id}`}>
                           <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">Xem Chi Tiết</Button>
                         </Link>
                       </div>
                    </div>
                  ))}
               </div>
            </Card>
         )}
      </div>
    </div>
  )
}
