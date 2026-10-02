"use client"
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Circle, LayerGroup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useStore } from '@/store/useStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// Fix default icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})
L.Marker.prototype.options.icon = DefaultIcon

// Helper to create distinct DivIcons for projects
function createProjectIcon(code: string, color: string) {
  return L.divIcon({
    className: 'custom-project-icon',
    html: `<div style="
      background: ${color}; 
      border: 3px solid white; 
      border-radius: 50%; 
      width: 36px; 
      height: 36px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.35); 
      color: white; 
      font-weight: 900; 
      font-size: 10px; 
      letter-spacing: -0.5px;
      cursor: pointer;
      transform: translate(-3px, -3px);
    ">${code}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  })
}

const PROJECT_ICONS: Record<string, L.DivIcon> = {
  p1: createProjectIcon('NVW', '#f59e0b'), // Gold
  p2: createProjectIcon('AQC', '#10b981'), // Emerald
  p3: createProjectIcon('TGM', '#6366f1'), // Indigo
  p4: createProjectIcon('VGP', '#0284c7'), // Sky Blue
  p5: createProjectIcon('TGC', '#8b5cf6'), // Purple
}

// Infrastructure data
const CENTER: [number, number] = [10.8000, 106.7500]

// 1. Metro Line 1 (Bến Thành - Suối Tiên)
const METRO_LINE_1: [number, number][] = [
  [10.7709, 106.6975], // Bến Thành
  [10.7761, 106.7025], // Nhà hát TP
  [10.7813, 106.7088], // Ba Son
  [10.7936, 106.7196], // Tân Cảng
  [10.8015, 106.7360], // Thảo Điền
  [10.8062, 106.7455], // An Phú
  [10.8170, 106.7620], // Rạch Chiếc
  [10.8250, 106.7720], // Phước Long
  [10.8350, 106.7820], // Bình Thái
  [10.8460, 106.7930], // Thủ Đức
  [10.8570, 106.8040], // Khu Công Nghệ Cao
  [10.8680, 106.8150], // Suối Tiên
  [10.8800, 106.8280], // Bến xe Miền Đông mới
]

// 2. Vành Đai 3 TP.HCM (Kết nối Thủ Đức, Nhơn Trạch, Long Thành)
const RING_ROAD_3: [number, number][] = [
  [10.7050, 106.8200], // Nhơn Trạch
  [10.7450, 106.8320], // Cầu Nhơn Trạch
  [10.8000, 106.8400], // Cao tốc Long Thành - Dầu Giây giao VĐ3
  [10.8444, 106.8375], // Vinhomes Grand Park
  [10.8800, 106.8250], // Nút giao Tân Vạn
  [10.9200, 106.7800], // Bình Dương
]

// 3. Cao tốc Dầu Giây - Phan Thiết (Kết nối NovaWorld)
const HIGHWAY_PHAN_THIET: [number, number][] = [
  [10.9300, 107.1200], // Dầu Giây
  [10.9500, 107.3800], // Long Khánh
  [10.9400, 107.6500], // Xuân Lộc
  [10.9000, 107.8500], // Hàm Tân
  [10.8711, 107.9942], // NovaWorld Phan Thiết
]

// 4. Sân Bay Quốc Tế Long Thành (Tâm điểm 5,000 ha)
const LONG_THANH_AIRPORT: [number, number] = [10.7780, 107.0180]

function MapController({ focusedCoords, zoomLevel, aiResults }: { focusedCoords?: [number, number] | null; zoomLevel?: number; aiResults?: any }) {
  const map = useMap()
  useEffect(() => {
    if (focusedCoords) {
      map.flyTo(focusedCoords, zoomLevel || 13, { duration: 1.5 })
    } else if (aiResults && aiResults.length > 0 && aiResults[0].coordinates) {
      map.flyTo(aiResults[0].coordinates as any, 13, { duration: 1.5 })
    }
  }, [focusedCoords, zoomLevel, aiResults, map])
  return null
}

function formatCurrency(amount: number) {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(1)} Nghìn Tỷ VNĐ`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)} Tỷ VNĐ`
  return `${(amount / 1e6).toLocaleString()} Tr VNĐ`
}

interface GISMapProps {
  activeLayers: Record<string, boolean>
  aiResults?: any
  focusedCoords?: [number, number] | null
  zoomLevel?: number
}

export default function GISMap({ activeLayers, aiResults, focusedCoords, zoomLevel }: GISMapProps) {
  const projects = useStore((state) => state.projects)
  const displayProjects = aiResults && aiResults.length > 0 ? aiResults : projects

  return (
    <MapContainer 
      center={CENTER} 
      zoom={11} 
      style={{ height: '100%', width: '100%', minHeight: '500px' }} 
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap & CartoDB'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      <MapController focusedCoords={focusedCoords} zoomLevel={zoomLevel} aiResults={aiResults} />

      {/* 1. Real Projects Layer */}
      <LayerGroup>
        {displayProjects.map((project: any) => {
          if (!project.coordinates) return null;
          const icon = PROJECT_ICONS[project.id] || DefaultIcon
          return (
            <Marker key={project.id} position={project.coordinates as any} icon={icon}>
              <Popup className="project-popup" maxWidth={320}>
                <div className="w-[280px] p-0 overflow-hidden flex flex-col gap-0 -m-3">
                  <div className="h-32 w-full relative">
                    <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge className="bg-slate-900/90 text-white font-mono text-[10px] shadow-sm">
                        {project.type}
                      </Badge>
                      <Badge className="bg-emerald-600 text-white text-[10px] shadow-sm">
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-white space-y-2">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-tight">{project.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{project.location}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <div>
                        <span className="block text-[10px] text-slate-400">Quy mô</span>
                        <span className="font-bold text-slate-800">{project.totalUnits?.toLocaleString()} căn</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">Đã bán</span>
                        <span className="font-bold text-emerald-700">{project.soldUnits?.toLocaleString()} căn</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">Doanh thu</span>
                        <span className="font-bold text-indigo-700">{formatCurrency(project.revenue)}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">AI Rating</span>
                        <span className="font-black text-purple-700">{project.aiAnalysis?.rating || 'BUY'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <Link href={`/inventory`}>
                        <Button variant="outline" size="sm" className="w-full text-xs h-7 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                          Rổ Hàng
                        </Button>
                      </Link>
                      <Link href={`/projects/${project.id}`}>
                        <Button size="sm" className="w-full text-xs h-7 bg-indigo-600 hover:bg-indigo-700 text-white">
                          Chi Tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </LayerGroup>

      {/* AI Search Radius Overlay */}
      {aiResults && aiResults.length > 0 && aiResults[0].coordinates && (
        <LayerGroup>
          <Circle 
            center={aiResults[0].coordinates as any} 
            radius={2500} 
            pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.15, weight: 2, dashArray: '6, 6' }}
          >
            <Popup>Bán kính 2.5km khảo sát quy hoạch hạ tầng quanh dự án</Popup>
          </Circle>
        </LayerGroup>
      )}

      {/* 2. Metro Line 1 Overlay */}
      {activeLayers['metro'] && (
        <LayerGroup>
          <Polyline 
            positions={METRO_LINE_1} 
            pathOptions={{ color: '#ef4444', weight: 5, dashArray: '8, 6', opacity: 0.85 }} 
          >
            <Popup>
              <div className="text-xs p-1">
                <b>Tuyến Metro Số 1 (Bến Thành - Suối Tiên)</b><br />
                Chiều dài: 19.7 km • 14 Nhà ga • Khai thác thương mại 2024
              </div>
            </Popup>
          </Polyline>
          {METRO_LINE_1.map((pos, i) => (
            <Circle key={i} center={pos} radius={120} pathOptions={{ color: '#b91c1c', fillColor: '#f87171', fillOpacity: 1 }}>
              <Popup>Ga Metro #{i + 1}</Popup>
            </Circle>
          ))}
        </LayerGroup>
      )}

      {/* 3. Vành Đai 3 TP.HCM Overlay */}
      {activeLayers['ringroad3'] && (
        <LayerGroup>
          <Polyline 
            positions={RING_ROAD_3} 
            pathOptions={{ color: '#f97316', weight: 6, opacity: 0.9 }} 
          >
            <Popup>
              <div className="text-xs p-1">
                <b>Đường Vành Đai 3 TP.HCM (76.3 km)</b><br />
                Kết nối TP.HCM - Đồng Nai - Bình Dương - Long An<br />
                Đi qua Vinhomes Grand Park & tiếp giáp Aqua City
              </div>
            </Popup>
          </Polyline>
        </LayerGroup>
      )}

      {/* 4. Cao tốc Dầu Giây - Phan Thiết Overlay */}
      {activeLayers['highway'] && (
        <LayerGroup>
          <Polyline 
            positions={HIGHWAY_PHAN_THIET} 
            pathOptions={{ color: '#10b981', weight: 5, opacity: 0.85 }} 
          >
            <Popup>
              <div className="text-xs p-1">
                <b>Cao Tốc Dầu Giây - Phan Thiết (99 km)</b><br />
                Rút ngắn thời gian từ TP.HCM đi NovaWorld Phan Thiết còn 1 giờ 45 phút
              </div>
            </Popup>
          </Polyline>
        </LayerGroup>
      )}

      {/* 5. Sân Bay Quốc Tế Long Thành */}
      {activeLayers['airport'] && (
        <LayerGroup>
          <Circle 
            center={LONG_THANH_AIRPORT} 
            radius={4500} 
            pathOptions={{ color: '#d97706', fillColor: '#f59e0b', fillOpacity: 0.25, weight: 2, dashArray: '8, 8' }} 
          >
            <Popup>
              <div className="text-xs p-1">
                <b>Cảng Hàng Không Quốc Tế Long Thành</b><br />
                Quy mô: 5,000 ha • Công suất: 100 triệu khách/năm<br />
                Cách Aqua City 15 phút di chuyển
              </div>
            </Popup>
          </Circle>
          <Marker position={LONG_THANH_AIRPORT} icon={createProjectIcon('✈️', '#d97706')}>
            <Popup>Tâm điểm Sân Bay Long Thành</Popup>
          </Marker>
        </LayerGroup>
      )}

      {/* 6. Bản Đồ Giá Đất Heatmap */}
      {activeLayers['landprice'] && (
        <LayerGroup>
          <Circle center={[10.7626, 106.6952]} radius={1500} pathOptions={{ color: 'none', fillColor: '#ef4444', fillOpacity: 0.35 }}>
            <Popup>Quận 1: 180 - 250 Tr/m²</Popup>
          </Circle>
          <Circle center={[10.7938, 106.7656]} radius={2000} pathOptions={{ color: 'none', fillColor: '#f97316', fillOpacity: 0.35 }}>
            <Popup>An Phú - Thủ Đức: 120 - 160 Tr/m²</Popup>
          </Circle>
          <Circle center={[10.9022, 106.8433]} radius={2500} pathOptions={{ color: 'none', fillColor: '#10b981', fillOpacity: 0.3 }}>
            <Popup>Aqua City Biên Hòa: 65 - 90 Tr/m²</Popup>
          </Circle>
        </LayerGroup>
      )}

      {/* 7. Ngập lụt & Triều Cường */}
      {activeLayers['flood'] && (
        <LayerGroup>
          <Polygon 
            positions={[[10.740, 106.670], [10.748, 106.680], [10.735, 106.690], [10.730, 106.675]]} 
            pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.4, weight: 1 }} 
          >
            <Popup>Khu vực triều cường trũng thấp ven rạch</Popup>
          </Polygon>
        </LayerGroup>
      )}
    </MapContainer>
  )
}
