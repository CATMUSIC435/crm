"use client"
import React, { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Html, Environment } from '@react-three/drei'
import { createXRStore, XR } from '@react-three/xr'
import * as THREE from 'three'
import { 
  Maximize, Ruler, Volume2, VolumeX, X, Play, Glasses, 
  Sparkles, Compass, Eye, MapPin, CheckCircle2, ChevronRight,
  Shield, Layers, ArrowRight, Info
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const store = createXRStore()

// Hotspot for room transition (portal)
function RoomPortalHotspot({ position, label, targetRoomId, onSelect }: { position: [number, number, number]; label: string; targetRoomId: string; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false)
  
  return (
    <mesh 
      position={position} 
      onClick={(e) => { e.stopPropagation(); onSelect(targetRoomId) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial 
        color={hovered ? '#6366f1' : '#38bdf8'} 
        emissive={hovered ? '#4338ca' : '#0284c7'} 
        emissiveIntensity={0.8}
        roughness={0.2}
      />
      <Html distanceFactor={14} center>
        <div 
          onClick={(e) => { e.stopPropagation(); onSelect(targetRoomId) }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-2xl transition-all cursor-pointer whitespace-nowrap transform -translate-y-8 select-none ${
            hovered 
              ? 'bg-indigo-600 text-white scale-110 shadow-indigo-500/50' 
              : 'bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 hover:bg-indigo-50 border border-indigo-200'
          }`}
        >
          <Compass className={`h-3.5 w-3.5 ${hovered ? 'animate-spin' : 'text-indigo-600'}`} />
          <span>{label}</span>
          <ChevronRight className="h-3 w-3 opacity-70" />
        </div>
      </Html>
    </mesh>
  )
}

// Hotspot for Handover Specifications (Material / Smart Home)
function SpecHotspot({ position, title, subtitle, specDetail, onOpenSpec }: { position: [number, number, number]; title: string; subtitle: string; specDetail: any; onOpenSpec: (spec: any) => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh 
      position={position} 
      onClick={(e) => { e.stopPropagation(); onOpenSpec({ title, subtitle, ...specDetail }) }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.9, 24, 24]} />
      <meshStandardMaterial 
        color={hovered ? '#10b981' : '#f59e0b'} 
        emissive={hovered ? '#059669' : '#d97706'} 
        emissiveIntensity={1}
      />
      <Html distanceFactor={12} center>
        <div 
          onClick={(e) => { e.stopPropagation(); onOpenSpec({ title, subtitle, ...specDetail }) }}
          className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-xl transition-all cursor-pointer whitespace-nowrap select-none ${
            hovered 
              ? 'bg-emerald-600 text-white scale-105' 
              : 'bg-slate-900/90 text-white backdrop-blur-md border border-amber-400/40'
          }`}
        >
          <Sparkles className="h-3 w-3 text-amber-400" />
          <span>{title}</span>
        </div>
      </Html>
    </mesh>
  )
}

// 3D Laser Measurement Lines
function LaserRuler3D({ width = '5.20m', height = '3.60m', area = '52.0 m²' }: { width?: string; height?: string; area?: string }) {
  return (
    <group position={[0, -2, -20]}>
      {/* Horizontal Width Line */}
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-10, 0, 0),
          new THREE.Vector3(10, 0, 0)
        ])} />
        <lineBasicMaterial attach="material" color="#38bdf8" linewidth={3} />
      </line>

      {/* Vertical Height Line */}
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-10, 0, 0),
          new THREE.Vector3(-10, 8, 0)
        ])} />
        <lineBasicMaterial attach="material" color="#38bdf8" linewidth={3} />
      </line>

      {/* Floating Laser Tags */}
      <Html position={[0, 0.6, 0]} center>
        <div className="bg-sky-500/95 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md shadow-lg border border-white/40 whitespace-nowrap">
          Bề Ngang: {width}
        </div>
      </Html>

      <Html position={[-11.5, 4, 0]} center>
        <div className="bg-sky-500/95 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md shadow-lg border border-white/40 whitespace-nowrap">
          Trần Cao: {height}
        </div>
      </Html>

      <Html position={[0, -1.2, 0]} center>
        <div className="bg-indigo-600/90 text-white font-bold text-[11px] px-2 py-0.5 rounded-full shadow-lg border border-indigo-300/40 whitespace-nowrap">
          Diện Tích Không Gian: {area}
        </div>
      </Html>
    </group>
  )
}

// 2D MiniMap Radar showing live camera FoV orientation
function MiniMapRadar({ roomName = "Phòng Khách" }: { roomName?: string }) {
  const { camera } = useThree()
  const [rotation, setRotation] = useState(0)

  useFrame(() => {
    // Calculate the azimuth angle of the camera
    const angle = Math.atan2(camera.position.x, camera.position.z)
    setRotation(angle)
  })

  return (
    <Html style={{ position: 'fixed', bottom: 24, left: 24, width: '130px', height: '130px', zIndex: 50 }}>
      <div className="bg-slate-900/85 backdrop-blur-md border border-white/20 p-2 rounded-2xl w-[130px] h-[130px] flex flex-col items-center justify-between relative overflow-hidden shadow-2xl">
        <div className="w-full flex items-center justify-between text-[10px] text-slate-300 font-semibold px-1 z-20">
          <span className="truncate max-w-[80px]">{roomName}</span>
          <span className="text-emerald-400 font-mono">360°</span>
        </div>

        {/* Floor plan SVG representation */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border border-slate-700 rounded-lg bg-slate-950/70 p-1 flex flex-col justify-between">
            <div className="w-full h-1/2 border-b border-dashed border-slate-700 flex">
              <div className="w-1/2 border-r border-slate-700"></div>
            </div>
          </div>
          
          {/* Rotating Camera FoV Radar Cone */}
          <div 
            className="w-full h-full rounded-full absolute transition-transform pointer-events-none"
            style={{ transform: `rotate(${rotation}rad)` }}
          >
            <div 
              className="w-10 h-10 bg-gradient-to-tr from-emerald-500/40 to-transparent rounded-tl-full origin-bottom-right"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
            ></div>
          </div>

          {/* Central Camera Pivot Dot */}
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399] z-10"></div>
        </div>

        <div className="text-[9px] text-slate-400 tracking-wider uppercase font-mono z-20">
          RADAR 2D
        </div>
      </div>
    </Html>
  )
}

// 3D Digital Master Plan Representation with Zone Pins
function DigitalMasterPlan3D({ zones, onSelectZone }: { zones: any[]; onSelectZone: (zone: any) => void }) {
  return (
    <group position={[0, -2, 0]}>
      {/* Ground Landscaping Plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* Ocean / River Water Body */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 40]}>
        <planeGeometry args={[120, 40]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Central Boulevard Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <planeGeometry args={[12, 100]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* 3D Zone Blocks and Pins */}
      {zones.map((zone, idx) => {
        const posX = (idx % 2 === 0 ? -1 : 1) * 26
        const posZ = Math.floor(idx / 2) * 35 - 20
        const height = zone.height || 6

        return (
          <group key={zone.id} position={[posX, 0, posZ]}>
            {/* 3D Massing Building Block */}
            <mesh position={[0, height / 2, 0]} onClick={() => onSelectZone(zone)}>
              <boxGeometry args={[20, height, 22]} />
              <meshStandardMaterial 
                color={zone.color || '#6366f1'} 
                roughness={0.3} 
                metalness={0.2}
                transparent
                opacity={0.85}
              />
            </mesh>

            {/* Floating 3D Zone Pin */}
            <Html position={[0, height + 4, 0]} center>
              <div 
                onClick={() => onSelectZone(zone)}
                className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 rounded-xl shadow-2xl border border-indigo-200 dark:border-indigo-800 cursor-pointer hover:scale-105 transition-all w-48 text-center select-none"
              >
                <div className="flex items-center justify-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                  <span className="truncate">{zone.name}</span>
                </div>
                <div className="flex items-center justify-between gap-1 text-[10px] mt-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">{zone.totalUnits} căn</span>
                  <span className="font-bold text-emerald-600">Đã bán {zone.soldPercent}%</span>
                </div>
                <div className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
                  Giá từ: {zone.priceFrom}
                </div>
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

export interface PanoramaViewerProps {
  projectId: string
  selectedRoom: any
  onRoomSelect: (roomId: string) => void
  isAutoRotate: boolean
  showMeasurement: boolean
  showAnnotations: boolean
  isNightMode: boolean
  ambientAudio: boolean
  tourMode: 'tour' | 'masterplan'
  zones?: any[]
  onSelectZone?: (zone: any) => void
  onOpenVideo?: () => void
  onOpenSpec?: (spec: any) => void
}

export function PanoramaViewer({
  projectId,
  selectedRoom,
  onRoomSelect,
  isAutoRotate,
  showMeasurement,
  showAnnotations,
  isNightMode,
  ambientAudio,
  tourMode,
  zones = [],
  onSelectZone,
  onOpenVideo,
  onOpenSpec
}: PanoramaViewerProps) {
  // Web Audio Ambient Synthesizer Ref
  const audioCtxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (ambientAudio) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContextClass) {
          const ctx = new AudioContextClass()
          audioCtxRef.current = ctx

          // Generate gentle ambient ocean breeze / nature tone
          const bufferSize = ctx.sampleRate * 2
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
          const data = buffer.getChannelData(0)
          let b0 = 0, b1 = 0, b2 = 0
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            b0 = 0.99886 * b0 + white * 0.0555179
            b1 = 0.99332 * b1 + white * 0.0750759
            b2 = 0.96900 * b2 + white * 0.1538520
            data[i] = (b0 + b1 + b2) * 0.03
          }
          const noise = ctx.createBufferSource()
          noise.buffer = buffer
          noise.loop = true

          const gainNode = ctx.createGain()
          gainNode.gain.setValueAtTime(0.08, ctx.currentTime)
          noise.connect(gainNode)
          gainNode.connect(ctx.destination)
          noise.start()
        }
      } catch (err) {
        console.log("Ambient Audio initialized (mock mode)", err)
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
      }
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
        audioCtxRef.current = null
      }
    }
  }, [ambientAudio])

  // Determine Three.js environment preset
  const activePreset = isNightMode 
    ? 'night' 
    : (selectedRoom?.preset || 'apartment')

  return (
    <div className="w-full h-full relative bg-slate-950 overflow-hidden select-none">
      
      {/* Three.js R3F Canvas */}
      <Canvas 
        camera={
          tourMode === 'masterplan' 
            ? { position: [55, 45, 55], fov: 45 } 
            : { position: [0, 0, 0.1], fov: 75 }
        }
      >
        <XR store={store}>
          <Suspense fallback={
            <Html center>
              <div className="flex flex-col items-center justify-center gap-3 text-white">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="font-bold text-sm tracking-wide">Đang tải không gian 360° Three.js...</div>
              </div>
            </Html>
          }>
            {/* Dynamic Environment Lighting & Sky */}
            <Environment preset={activePreset} background />

            {tourMode === 'tour' ? (
              <>
                {/* 1. Interactive 3D Room Portals */}
                {selectedRoom?.portals?.map((portal: any, idx: number) => (
                  <RoomPortalHotspot
                    key={idx}
                    position={portal.position}
                    label={portal.label}
                    targetRoomId={portal.targetRoomId}
                    onSelect={onRoomSelect}
                  />
                ))}

                {/* 2. Interactive Handover Specs Hotspots */}
                {showAnnotations && selectedRoom?.specs?.map((spec: any, idx: number) => (
                  <SpecHotspot
                    key={idx}
                    position={spec.position}
                    title={spec.title}
                    subtitle={spec.subtitle}
                    specDetail={spec}
                    onOpenSpec={onOpenSpec || (() => {})}
                  />
                ))}

                {/* 3. Laser Measurement Dimensions */}
                {showMeasurement && (
                  <LaserRuler3D 
                    width={selectedRoom?.measurements?.width}
                    height={selectedRoom?.measurements?.height}
                    area={selectedRoom?.measurements?.area}
                  />
                )}

                {/* 4. 2D MiniMap Radar */}
                <MiniMapRadar roomName={selectedRoom?.name} />
              </>
            ) : (
              /* Digital Master Plan 3D Scene */
              <DigitalMasterPlan3D 
                zones={zones} 
                onSelectZone={onSelectZone || (() => {})} 
              />
            )}
          </Suspense>

          {/* Camera OrbitControls */}
          <OrbitControls 
            enableZoom={true}
            enablePan={tourMode === 'masterplan'}
            autoRotate={isAutoRotate}
            autoRotateSpeed={tourMode === 'masterplan' ? 0.6 : 0.8}
            reverseOrbit={tourMode === 'tour'}
            maxPolarAngle={tourMode === 'masterplan' ? Math.PI / 2.2 : Math.PI}
            minDistance={tourMode === 'masterplan' ? 20 : 0.1}
            maxDistance={tourMode === 'masterplan' ? 140 : 100}
          />
        </XR>
      </Canvas>
    </div>
  )
}
