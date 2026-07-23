"use client"
import React, { useEffect, useState } from 'react'
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

// Custom Project Marker Icon
const ProjectMarkerIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #4f46e5; border: 3px solid white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); color: white; font-weight: bold; font-size: 14px; transition: transform 0.2s;">P</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
})

// Mocks for Metro and Flood
const CENTER = [10.762622, 106.660172]
const METRO_BEN_THANH = [10.7709, 106.6975]
const MOCK_METRO: [number, number][] = [
  [10.7709, 106.6975], [10.7761, 106.7025], [10.7813, 106.7088], [10.7936, 106.7196], [10.7998, 106.7323],
]

function MapController({ aiResults }: { aiResults: any }) {
  const map = useMap()
  useEffect(() => {
    if (aiResults && aiResults.length > 0) {
      // Zoom to first result
      map.flyTo(aiResults[0].coordinates as any, 14, { duration: 1.5 })
    } else {
      map.flyTo(CENTER as any, 11, { duration: 1.5 })
    }
  }, [aiResults, map])
  return null
}

function formatCurrency(amount: number) {
  if (amount >= 1e12) return `${(amount / 1e12).toFixed(1)} Nghìn Tỷ VNĐ`
  if (amount >= 1e9) return `${(amount / 1e9).toFixed(1)} Tỷ VNĐ`
  return `${(amount / 1e6).toLocaleString()} Tr VNĐ`
}

export default function GISMap({ activeLayers, aiResults }: { activeLayers: Record<string, boolean>, aiResults: any }) {
  const projects = useStore((state) => state.projects)
  const displayProjects = aiResults || projects

  return (
    <MapContainer center={CENTER as any} zoom={11} style={{ height: '100%', width: '100%' }} zoomControl={true}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController aiResults={aiResults} />

      {/* Real Projects Layer */}
      <LayerGroup>
        {displayProjects.map((project: any) => {
          if (!project.coordinates) return null;
          return (
            <Marker key={project.id} position={project.coordinates as any} icon={ProjectMarkerIcon}>
              <Popup className="project-popup">
                <div className="w-[280px] p-0 overflow-hidden flex flex-col gap-0 -m-3">
                   <div className="h-32 w-full relative">
                     <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                     <div className="absolute top-2 left-2 flex gap-1">
                       <Badge className={`${project.status === 'Đang mở bán' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white border-none shadow-sm`}>{project.status}</Badge>
                     </div>
                   </div>
                   <div className="p-3 bg-white">
                     <h3 className="font-bold text-lg mb-1">{project.name}</h3>
                     <p className="text-sm text-gray-500 mb-2">{project.location}</p>
                     
                     <div className="grid grid-cols-2 gap-2 text-sm mb-3 bg-gray-50 p-2 rounded">
                        <div>
                          <span className="block text-xs text-gray-400">Quy mô</span>
                          <span className="font-semibold text-gray-800">{project.totalUnits.toLocaleString()} căn</span>
                        </div>
                        <div>
                          <span className="block text-xs text-gray-400">Dự thu</span>
                          <span className="font-semibold text-indigo-600">{formatCurrency(project.targetRevenue || project.revenue)}</span>
                        </div>
                     </div>
                     
                     <Link href={`/projects/${project.id}`}>
                       <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">Xem Chi Tiết</Button>
                     </Link>
                   </div>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </LayerGroup>

      {/* AI Search Radius Overlay */}
      {aiResults && aiResults.length > 0 && (
        <LayerGroup>
          <Circle center={aiResults[0].coordinates as any} radius={2000} pathOptions={{ color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.1, weight: 2, dashArray: '5, 5' }}>
             <Popup>Bán kính AI phân tích quanh dự án</Popup>
          </Circle>
        </LayerGroup>
      )}

      {/* 2. Metro */}
      {activeLayers['metro'] && (
        <LayerGroup>
           <Polyline positions={MOCK_METRO as any} pathOptions={{ color: 'red', weight: 5, dashArray: '10, 10' }}>
              <Popup>Tuyến Metro số 1 (Bến Thành - Suối Tiên)</Popup>
           </Polyline>
           {MOCK_METRO.map((pos, i) => (
             <Circle key={i} center={pos as any} radius={100} pathOptions={{ color: 'red', fillColor: 'red' }}>
                <Popup>Trạm Metro</Popup>
             </Circle>
           ))}
        </LayerGroup>
      )}
      
      {/* 4. Ngập lụt (Quy hoạch) */}
      {activeLayers['flood'] && (
        <LayerGroup>
           <Polygon positions={[[10.755, 106.65], [10.760, 106.65], [10.765, 106.66], [10.755, 106.66]]} pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.4, weight: 1 }} />
        </LayerGroup>
      )}

      {/* 13. Giá đất Heatmap mock */}
      {activeLayers['landprice'] && (
        <LayerGroup>
           <Circle center={[10.775, 106.705]} radius={1500} pathOptions={{ color: 'none', fillColor: '#ef4444', fillOpacity: 0.3 }} />
           <Circle center={[10.800, 106.720]} radius={2000} pathOptions={{ color: 'none', fillColor: '#f97316', fillOpacity: 0.3 }} />
        </LayerGroup>
      )}
    </MapContainer>
  )
}
