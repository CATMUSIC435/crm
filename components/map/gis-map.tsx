"use client"
import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Circle, LayerGroup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default icons
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})
L.Marker.prototype.options.icon = DefaultIcon

// Custom AI Marker Icon (Gold/Star)
const AiMarkerIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #fbbf24; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px #fbbf24; color: black; font-weight: bold; font-size: 12px;">★</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

// Mocks
const CENTER = [10.762622, 106.660172]
const METRO_BEN_THANH = [10.7709, 106.6975]
const MOCK_METRO: [number, number][] = [
  [10.7709, 106.6975], [10.7761, 106.7025], [10.7813, 106.7088], [10.7936, 106.7196], [10.7998, 106.7323],
]

function MapController({ aiResults }: { aiResults: any }) {
  const map = useMap()
  useEffect(() => {
    if (aiResults) {
      // Zoom to Ben Thanh Metro when AI searches
      map.flyTo(METRO_BEN_THANH as any, 15, { duration: 1.5 })
    } else {
      map.flyTo(CENTER as any, 13, { duration: 1.5 })
    }
  }, [aiResults, map])
  return null
}

export default function GISMap({ activeLayers, aiResults }: { activeLayers: Record<string, boolean>, aiResults: any }) {
  return (
    <MapContainer center={CENTER as any} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={true}>
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController aiResults={aiResults} />

      {/* AI Search Overlay layer */}
      {aiResults && (
        <LayerGroup>
          {/* 1km Radius Circle around Metro */}
          <Circle center={METRO_BEN_THANH as any} radius={1000} pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.1, weight: 2, dashArray: '5, 5' }}>
             <Popup>Bán kính 1km quanh trạm Metro Bến Thành</Popup>
          </Circle>
          
          {/* AI Result Markers */}
          {aiResults.map((item: any) => (
             <Marker key={item.id} position={item.pos} icon={AiMarkerIcon}>
               <Popup>
                 <div className="font-bold text-base">{item.title}</div>
                 <div className="text-indigo-600 font-bold">{item.price}</div>
                 <div>ROI: <span className="text-green-600 font-bold">{item.roi}</span></div>
                 <div className="text-xs text-gray-500">{item.distance} tới Metro</div>
               </Popup>
             </Marker>
          ))}
        </LayerGroup>
      )}

      {/* 2. Metro (Always show Metro if AI is active or layer is active) */}
      {(activeLayers['metro'] || aiResults) && (
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
      
      {/* 4. Ngập */}
      {activeLayers['flood'] && !aiResults && (
        <LayerGroup>
           <Polygon positions={[[10.755, 106.65], [10.760, 106.65], [10.765, 106.66], [10.755, 106.66]]} pathOptions={{ color: '#0055ff', fillColor: '#0055ff', fillOpacity: 0.5 }} />
        </LayerGroup>
      )}

      {/* 13. Giá đất Heatmap mock */}
      {activeLayers['landprice'] && !aiResults && (
        <LayerGroup>
           <Circle center={[10.775, 106.705]} radius={1500} pathOptions={{ color: 'none', fillColor: 'red', fillOpacity: 0.3 }} />
        </LayerGroup>
      )}
    </MapContainer>
  )
}
