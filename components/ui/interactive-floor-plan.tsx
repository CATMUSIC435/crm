"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Maximize, PlayCircle, Eye, TrendingUp, CheckSquare, Layers } from "lucide-react"

// Mock Unit Data
const units = [
  { id: 'Căn 01', points: "10,10 40,10 40,40 10,40", status: "Available", price: "5.2 Tỷ", view: "View Sông & Công viên", roi: "8.5%", panorama: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&q=80" },
  { id: 'Căn 02', points: "50,10 90,10 90,40 50,40", status: "Sold", price: "6.5 Tỷ", view: "View Nội khu", roi: "7.0%", panorama: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80" },
  { id: 'Căn 03', points: "10,50 40,50 40,90 10,90", status: "Booking", price: "4.8 Tỷ", view: "View Thành phố", roi: "9.2%", panorama: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&q=80" },
  { id: 'Căn 04', points: "50,50 90,50 90,90 50,90", status: "Available", price: "7.1 Tỷ", view: "Góc 2 mặt tiền", roi: "8.0%", panorama: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80" }
]

export function InteractiveFloorPlan() {
  const [selectedUnit, setSelectedUnit] = useState<any>(null)

  const getColor = (status: string) => {
    if (status === "Available") return "fill-green-500/40 hover:fill-green-500/60 stroke-green-600"
    if (status === "Sold") return "fill-red-500/40 hover:fill-red-500/60 stroke-red-600"
    if (status === "Booking") return "fill-orange-500/40 hover:fill-orange-500/60 stroke-orange-600"
    return "fill-gray-500/40 hover:fill-gray-500/60 stroke-gray-600"
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Legend */}
      <div className="flex gap-4 items-center mb-2">
        <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 bg-green-500/50 rounded"></div> Trống</div>
        <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 bg-orange-500/50 rounded"></div> Booking</div>
        <div className="flex items-center gap-2 text-sm"><div className="w-4 h-4 bg-red-500/50 rounded"></div> Đã bán</div>
      </div>

      {/* Floor Plan Image with SVG Overlay */}
      <div className="relative w-full aspect-video bg-muted rounded-xl overflow-hidden border">
        <img 
          src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80" 
          alt="Floor plan" 
          className="w-full h-full object-cover opacity-50" 
        />
        
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {units.map((unit) => (
            <polygon 
              key={unit.id}
              points={unit.points}
              className={`cursor-pointer transition-colors stroke-2 ${getColor(unit.status)}`}
              onClick={() => setSelectedUnit(unit)}
            />
          ))}
          {/* Text Labels */}
          {units.map((unit) => {
            const coords = unit.points.split(' ')[0].split(',') // getting first point for rough placing
            const x = parseInt(coords[0]) + 10
            const y = parseInt(coords[1]) + 15
            return (
              <text key={`text-${unit.id}`} x={x} y={y} fontSize="4" fill="white" fontWeight="bold" className="pointer-events-none drop-shadow-md">
                {unit.id}
              </text>
            )
          })}
        </svg>
      </div>

      <Dialog open={!!selectedUnit} onOpenChange={(open) => !open && setSelectedUnit(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-none shadow-2xl rounded-2xl sm:rounded-2xl">
          {selectedUnit && (
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Media Column */}
              <div className="relative h-64 md:h-full bg-black flex flex-col">
                 {/* Fake Panorama Image */}
                 <div className="flex-1 relative overflow-hidden group">
                   <img src={selectedUnit.panorama} className="w-full h-full object-cover transition-transform duration-[10s] group-hover:scale-125" alt="Panorama"/>
                   <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <Button variant="secondary" className="rounded-full shadow-xl bg-white/20 backdrop-blur-md text-white border-white/50 hover:bg-white/40">
                       <Maximize className="mr-2 h-4 w-4"/> Kéo xoay 360°
                     </Button>
                   </div>
                 </div>
                 {/* Fake Video Row */}
                 <div className="h-1/3 bg-gray-900 border-t border-gray-800 relative group flex items-center justify-center cursor-pointer overflow-hidden">
                    <img src={selectedUnit.panorama} className="w-full h-full object-cover opacity-40 blur-sm group-hover:scale-110 transition-transform duration-500" alt="Video thumbnail"/>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-white/80 group-hover:scale-110 transition-transform group-hover:text-white shadow-2xl rounded-full" />
                    </div>
                    <Badge className="absolute bottom-2 left-2 bg-black/60 text-white border-none">Video Tour 4K</Badge>
                 </div>
              </div>

              {/* Data Column */}
              <div className="p-6 flex flex-col h-full bg-card">
                <DialogHeader className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <DialogTitle className="text-3xl font-bold tracking-tight">{selectedUnit.id}</DialogTitle>
                      <DialogDescription className="text-base mt-1">Masterplan • Tầng 12A • Aqua City</DialogDescription>
                    </div>
                    <Badge className="text-sm px-3 py-1" variant={selectedUnit.status === "Available" ? "default" : (selectedUnit.status === "Booking" ? "secondary" : "destructive")}>
                      {selectedUnit.status === "Available" ? "Trống" : selectedUnit.status}
                    </Badge>
                  </div>
                </DialogHeader>

                <div className="space-y-6 flex-1">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-indigo-50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50">
                       <p className="text-sm font-medium text-indigo-600/70 dark:text-indigo-400/70 mb-1">Giá bán</p>
                       <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{selectedUnit.price}</p>
                     </div>
                     <div className="bg-muted/50 p-4 rounded-xl border">
                       <p className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1"><Eye className="h-4 w-4"/> Tầm nhìn</p>
                       <p className="font-semibold text-foreground text-lg">{selectedUnit.view}</p>
                     </div>
                  </div>

                  <div className="border rounded-xl p-5 bg-background shadow-sm">
                     <h4 className="font-semibold flex items-center gap-2 mb-4 text-lg">
                       <TrendingUp className="h-5 w-5 text-green-500" /> Phân tích ROI đầu tư
                     </h4>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm border-b pb-2">
                          <span className="text-muted-foreground">Tỷ suất sinh lời cho thuê:</span>
                          <Badge variant="outline" className="font-bold text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-900">{selectedUnit.roi} / năm</Badge>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b pb-2">
                          <span className="text-muted-foreground">Giá thuê dự kiến:</span>
                          <span className="font-semibold text-foreground">25 - 30 Triệu/tháng</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Tăng trưởng vốn (dự kiến):</span>
                          <span className="font-semibold text-blue-600">+12% sau 2 năm</span>
                        </div>
                     </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <Button className="flex-1 shadow-md hover:shadow-lg transition-all" size="lg" disabled={selectedUnit.status === "Sold"}>
                    <CheckSquare className="mr-2 h-5 w-5" /> Booking Ngay
                  </Button>
                  <Button variant="outline" className="flex-1" size="lg">
                    <Layers className="mr-2 h-5 w-5" /> So sánh căn
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
