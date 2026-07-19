"use client"
import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Map, MapPin, Train, Waves, CircleDollarSign, Sparkles, Loader2, X, Navigation } from 'lucide-react'

// Load map component dynamically with SSR disabled
const DynamicMap = dynamic(() => import('@/components/map/gis-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground animate-pulse">Đang tải Bản đồ GIS (Leaflet)...</div>
})

const LAYERS = [
  { id: 'planning', label: 'Quy hoạch', icon: Map, color: 'text-orange-500' },
  { id: 'metro', label: 'Metro', icon: Train, color: 'text-red-500' },
  { id: 'flood', label: 'Ngập lụt', icon: Waves, color: 'text-cyan-500' },
  { id: 'landprice', label: 'Bản đồ Giá đất', icon: CircleDollarSign, color: 'text-emerald-500' },
]

const MOCK_AI_RESULTS = [
  { id: 1, pos: [10.768, 106.695], title: "Căn hộ Vinhomes Center", price: "2.8 Tỷ", roi: "10.5%", distance: "450m" },
  { id: 2, pos: [10.772, 106.692], title: "Officetel The Sun", price: "2.5 Tỷ", roi: "11.2%", distance: "800m" },
  { id: 3, pos: [10.765, 106.700], title: "Studio Riverside", price: "2.9 Tỷ", roi: "12.0%", distance: "700m" },
]

export default function GISPage() {
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
    
    // Simulate AI NLP parsing time
    setTimeout(() => {
      setIsSearching(false)
      setAiResults(MOCK_AI_RESULTS)
    }, 2000)
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
           <p className="text-muted-foreground mt-1">Chat với bản đồ để khoanh vùng sản phẩm ngay lập tức.</p>
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
                   placeholder="Nhập yêu cầu: 'Tìm căn dưới 3 tỷ, gần Metro bán kính 1km, ROI > 10%'"
                   className="border-0 focus-visible:ring-0 shadow-none text-base bg-transparent flex-1"
                 />
                 {aiResults && (
                   <button type="button" onClick={clearAI} className="p-2 text-muted-foreground hover:text-foreground">
                     <X className="h-5 w-5" />
                   </button>
                 )}
                 <Button type="submit" disabled={isSearching} className="rounded-none rounded-r-full px-6 bg-indigo-600 hover:bg-indigo-700">
                    Tìm kiếm AI
                 </Button>
              </form>
              
              {/* AI NLP Status popup */}
              {isSearching && (
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 text-sm whitespace-nowrap animate-in slide-in-from-top-4">
                   <Sparkles className="h-4 w-4 animate-pulse" />
                   AI đang phân tích: {searchQuery}
                </div>
              )}
            </div>

            <DynamicMap activeLayers={activeLayers} aiResults={aiResults} />
            
            {/* Standard Layers Control Overlay (Moved to map corner) */}
            {!aiResults && (
              <div className="absolute top-24 left-4 z-[400] bg-white/95 dark:bg-gray-950/95 backdrop-blur-md p-3 rounded-xl shadow-lg border">
                 <h4 className="font-bold text-sm mb-2 px-1">Layers</h4>
                 <div className="flex flex-col gap-1">
                   {LAYERS.map(l => (
                     <label key={l.id} className="flex items-center gap-2 text-sm p-1.5 hover:bg-muted rounded cursor-pointer">
                       <input type="checkbox" checked={!!activeLayers[l.id]} onChange={() => toggleLayer(l.id)} />
                       <l.icon className={`h-4 w-4 ${l.color}`} />
                       <span>{l.label}</span>
                     </label>
                   ))}
                 </div>
              </div>
            )}
         </div>

         {/* AI Results Drawer (Right side) */}
         {aiResults && (
            <Card className="w-full md:w-80 lg:w-96 flex-shrink-0 flex flex-col overflow-hidden bg-background border shadow-xl animate-in slide-in-from-right-8">
               <div className="p-4 border-b bg-indigo-50 dark:bg-indigo-950/20">
                 <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 mb-1">
                   <Sparkles className="h-4 w-4" />
                   <h3 className="font-semibold">AI Match Results</h3>
                 </div>
                 <p className="text-xs font-medium opacity-80 mt-2">Tiêu chí: Giá &lt; 3 Tỷ • Gần Metro &lt; 1km • ROI &gt; 10%</p>
               </div>
               <div className="overflow-y-auto p-4 flex-1 space-y-3 bg-muted/20">
                  {aiResults.map((item: any) => (
                    <div key={item.id} className="bg-background p-4 rounded-xl border shadow-sm hover:border-indigo-300 transition-colors cursor-pointer group">
                       <div className="flex justify-between items-start mb-2">
                         <h4 className="font-bold group-hover:text-indigo-600 transition-colors">{item.title}</h4>
                         <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Match 98%</Badge>
                       </div>
                       <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground block text-xs">Giá bán</span>
                            <span className="font-bold text-indigo-600">{item.price}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-xs">ROI cam kết</span>
                            <span className="font-bold text-green-600">{item.roi}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted p-1.5 rounded-md w-fit">
                          <Navigation className="h-3 w-3" />
                          Cách Metro {item.distance}
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-4 border-t bg-background">
                 <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Lưu bộ lọc này</Button>
               </div>
            </Card>
         )}
      </div>
    </div>
  )
}
