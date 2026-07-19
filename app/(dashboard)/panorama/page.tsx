"use client"
import dynamic from 'next/dynamic'
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

const PanoramaViewer = dynamic(() => import('@/components/3d/panorama-viewer').then(mod => mod.PanoramaViewer as any), { ssr: false })

export default function PanoramaPage() {
  const router = useRouter()
  return (
    <div className="fixed inset-0 z-[100] bg-black">
       <button 
         onClick={() => router.back()} 
         className="absolute top-6 left-6 z-[110] bg-black/50 hover:bg-black/80 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-xl"
       >
         <ArrowLeft className="w-4 h-4" /> Quay Lại CRM
       </button>
       
       <PanoramaViewer />
    </div>
  )
}
