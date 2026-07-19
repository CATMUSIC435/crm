"use client"
import React, { Suspense, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, useTexture, Sphere } from '@react-three/drei'
import { VRButton, XR } from '@react-three/xr'
import * as THREE from 'three'
import { Maximize, Ruler, Volume2, VolumeX, X, Play } from 'lucide-react'

// Texture wrapper
function PanoramaSphere({ url }: { url: string }) {
  const texture = useTexture(url)
  return (
    <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
  )
}

function Hotspot({ position, label, onClick }: any) {
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color="hotpink" />
      <Html distanceFactor={15}>
        <div className="bg-white/90 px-2 py-1 rounded shadow-lg text-sm font-bold cursor-pointer whitespace-nowrap transform -translate-x-1/2 -translate-y-[200%] pointer-events-none text-black">
          {label}
        </div>
      </Html>
    </mesh>
  )
}

function MiniMap() {
  const { camera } = useThree()
  const [rotation, setRotation] = useState(0)

  useFrame(() => {
    // Calculate the azimuth angle of the camera
    const angle = Math.atan2(camera.position.x, camera.position.z)
    setRotation(angle)
  })

  return (
    <Html style={{ position: 'fixed', bottom: 20, left: 20, width: '150px', height: '150px' }}>
       <div className="bg-black/50 backdrop-blur-md border border-white/20 p-2 rounded-full w-[150px] h-[150px] flex items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80')] bg-cover opacity-50 rounded-full mix-blend-screen"></div>
          {/* Radar Scanner */}
          <div 
            className="w-full h-full rounded-full border-2 border-green-500/50 absolute transition-transform"
            style={{ transform: `rotate(${rotation}rad)` }}
          >
             <div className="w-1/2 h-1/2 bg-green-500/30 rounded-tl-full origin-bottom-right"></div>
          </div>
          <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red] z-10"></div>
       </div>
    </Html>
  )
}

export function PanoramaViewer() {
  const [showVideo, setShowVideo] = useState(false)
  const [showMeasurement, setShowMeasurement] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  
  // Audio mock
  useEffect(() => {
    if (audioEnabled) {
      console.log("Audio playing (mock)")
    } else {
      console.log("Audio paused (mock)")
    }
  }, [audioEnabled])

  return (
    <div className="w-full h-screen relative bg-black">
      {/* @ts-ignore - store is required in newer xr versions but this is a mock UI */}
      <VRButton className="absolute bottom-6 right-6 z-50 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg text-white hover:bg-white/20 font-medium" />
      
      {/* UI Overlay Tools */}
      <div className="absolute top-20 right-6 z-50 flex flex-col gap-3">
        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/20 shadow-xl transition-all flex items-center justify-center" onClick={() => setAudioEnabled(!audioEnabled)} title="Âm thanh Môi trường">
          {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-full text-white border border-white/20 shadow-xl transition-all flex items-center justify-center" onClick={() => setShowMeasurement(!showMeasurement)} title="Công cụ Đo đạc">
          <Ruler size={20} />
        </button>
      </div>
      
      {/* Video Modal Overlay */}
      {showVideo && (
        <div className="absolute inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="w-full max-w-4xl bg-black border border-gray-800 rounded-xl overflow-hidden shadow-2xl relative">
             <button className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/50 p-2 rounded-full" onClick={() => setShowVideo(false)}>
               <X size={24} />
             </button>
             <div className="aspect-video relative flex items-center justify-center bg-gray-900">
                <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?w=1200&q=80" className="w-full h-full object-cover opacity-60" alt="Video Mock"/>
                <Play className="absolute h-20 w-20 text-white/90 drop-shadow-2xl cursor-pointer hover:scale-110 transition-transform" />
             </div>
             <div className="p-4 bg-gray-900 text-white border-t border-gray-800">
               <h3 className="text-xl font-bold">Giới thiệu Phân khu Aqua Marina</h3>
               <p className="text-gray-400 text-sm mt-1">Khám phá tổ hợp Quảng trường và Bến du thuyền đẳng cấp với công nghệ VR360.</p>
             </div>
           </div>
        </div>
      )}

      {/* Measurement Mock Overlay */}
      {showMeasurement && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_blue]"></div>
             <div className="h-0.5 w-64 bg-blue-500 shadow-[0_0_10px_blue] relative">
               <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-bold shadow-md">
                 4.20m
               </div>
             </div>
             <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_blue]"></div>
           </div>
        </div>
      )}

      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        {/* @ts-ignore - store required in new xr versions but using mock */}
        <XR>
          <Suspense fallback={<Html center><div className="text-white font-bold text-xl animate-pulse">Đang tải môi trường 360°...</div></Html>}>
            {/* Equirectangular Panorama */}
            <PanoramaSphere url="https://upload.wikimedia.org/wikipedia/commons/4/4c/Equirectangular_panorama_of_a_park_in_Stockholm.jpg" />
            
            {/* 3D Hotspots */}
            <Hotspot 
              position={[-40, 0, -30]} 
              label="▶ Xem Video Sa Bàn" 
              onClick={(e: any) => { e.stopPropagation(); setShowVideo(true) }} 
            />
            <Hotspot 
              position={[40, 10, -20]} 
              label="Phòng Khách (Living Room)" 
              onClick={(e: any) => { e.stopPropagation(); alert("Ghi chú (Annotation):\nDiện tích: 45m2\nLát sàn gỗ An Cường 12mm.") }} 
            />
            <Hotspot 
              position={[10, -5, 40]} 
              label="Ban Công (Balcony)" 
              onClick={(e: any) => { e.stopPropagation(); alert("Hướng Đông Nam, view nhìn thẳng ra công viên trung tâm.") }} 
            />
            
            <MiniMap />
          </Suspense>
          
          <OrbitControls 
             enableZoom={true} 
             enablePan={false}
             maxDistance={100} 
             minDistance={10} 
             reverseOrbit={true} // Reverse drag direction because we are INSIDE the sphere
          />
        </XR>
      </Canvas>
    </div>
  )
}
