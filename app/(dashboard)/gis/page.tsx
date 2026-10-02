"use client"
import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Map, MapPin, Train, Waves, CircleDollarSign, Sparkles, Loader2, X, Navigation, 
  Compass, Route, FileText, CheckCircle2, Building2, ShieldCheck, Eye, 
  ArrowUpRight, Download, ExternalLink, Filter, Layers, ChevronRight, 
  Info, AlertTriangle, ArrowRight, RotateCcw, Car, Clock, Check
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import Link from 'next/link'

// Load map component dynamically with SSR disabled
const DynamicMap = dynamic(() => import('@/components/map/gis-map'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/10 text-muted-foreground gap-3 min-h-[500px]">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <div className="font-semibold text-sm">Đang tải Động cơ Bản đồ GIS & Không gian Địa lý...</div>
      <div className="text-xs text-slate-500">Khởi tạo các lớp dữ liệu Leaflet, OSM & Hạ tầng liên vùng</div>
    </div>
  )
})

const LAYERS = [
  { id: 'metro', label: 'Tuyến Metro Số 1 (Bến Thành - Suối Tiên)', icon: Train, color: 'text-red-500', badge: '19.7 km' },
  { id: 'ringroad3', label: 'Tuyến Vành Đai 3 TP.HCM', icon: Navigation, color: 'text-orange-500', badge: '76.3 km' },
  { id: 'highway', label: 'Cao tốc Dầu Giây - Phan Thiết', icon: Route, color: 'text-emerald-500', badge: '99 km' },
  { id: 'airport', label: 'Quy hoạch Sân bay Quốc tế Long Thành', icon: Compass, color: 'text-amber-500', badge: '5.000 ha' },
  { id: 'landprice', label: 'Bản đồ Giá đất Heatmap', icon: CircleDollarSign, color: 'text-rose-500', badge: 'Realtime' },
  { id: 'flood', label: 'Cảnh báo Ngập lụt & Triều cường', icon: Waves, color: 'text-cyan-500', badge: 'Đô thị' },
]

// Mock Zoning 1/500 Detailed Data for Mega Projects
interface ZoningDetail {
  projectId: string
  projectName: string
  decisionNumber: string
  approvalDate: string
  issuingAuthority: string
  scale: string
  buildingDensity: string
  greenAndAmenityRatio: string
  farCoefficient: string
  maxFloors: string
  legalStatus: string
  landUseTerm: string
  infrastructureHighlights: string[]
  zoningClassification: string
}

const ZONING_DATA: Record<string, ZoningDetail> = {
  p1: {
    projectId: 'p1',
    projectName: 'NovaWorld Phan Thiet',
    decisionNumber: 'QĐ số 1826/QĐ-UBND',
    approvalDate: '15/08/2021',
    issuingAuthority: 'UBND Tỉnh Bình Thuận',
    scale: '1.000 Hecta (Siêu thành phố Biển)',
    buildingDensity: '25.6%',
    greenAndAmenityRatio: '55.4% (Sân Golf PGA 36 hố, Công viên 16ha)',
    farCoefficient: '1.2 lần',
    maxFloors: 'Biệt thự 1 - 3 tầng, Khách sạn 5 - 10 tầng',
    legalStatus: 'Quy hoạch chi tiết 1/500 hoàn thiện, Sổ hồng từng phân khu biệt thự',
    landUseTerm: 'Đất thương mại dịch vụ 50 năm & Lâu dài theo quy hoạch',
    infrastructureHighlights: [
      'Đường Hàm Kiệm - Tiến Thành kết nối trực diện Cao tốc Dầu Giây - Phan Thiết',
      'Đường bờ biển 7km với đại lộ thương mại Bikini Beach',
      'Cảng du thuyền quốc tế và sân bay Phan Thiết (dự kiến hoàn thành)'
    ],
    zoningClassification: 'Đất dịch vụ du lịch thương mại & Đô thị nghỉ dưỡng sinh thái'
  },
  p2: {
    projectId: 'p2',
    projectName: 'Aqua City',
    decisionNumber: 'QĐ số 3671/QĐ-UBND',
    approvalDate: '22/11/2020',
    issuingAuthority: 'UBND Tỉnh Đồng Nai',
    scale: '1.000 Hecta (Đô thị sinh thái thông minh)',
    buildingDensity: '30.0%',
    greenAndAmenityRatio: '70.0% (32km bờ sông Đồng Nai bao bọc)',
    farCoefficient: '1.8 lần',
    maxFloors: 'Nhà phố, Biệt thự, Shophouse 1 trệt 2 - 3 lầu',
    legalStatus: 'Phê duyệt điều chỉnh tổng thể 1/500, ngân hàng VPBank & MBBank cam kết bảo lãnh',
    landUseTerm: 'Sở hữu lâu dài (Sổ hồng từng căn)',
    infrastructureHighlights: [
      'Trục Hương Lộ 2 (60m) kết nối trực tiếp Cao tốc TP.HCM - Long Thành',
      'Cầu Vàm Cái Sứt hoàn thiện kết nối giao thông huyết mạch liên vùng',
      'Cách sân bay Quốc tế Long Thành chỉ 15 phút di chuyển'
    ],
    zoningClassification: 'Đất ở đô thị sinh thái kết hợp thương mại dịch vụ ven sông'
  },
  p3: {
    projectId: 'p3',
    projectName: 'The Grand Manhattan',
    decisionNumber: 'QĐ số 4125/QĐ-UBND',
    approvalDate: '10/04/2019',
    issuingAuthority: 'UBND Quận 1 & Sở Xây Dựng TP.HCM',
    scale: '1.4 Hecta (Tổ hợp Tháp đôi Căn hộ & Khách sạn 5*)',
    buildingDensity: '49.7%',
    greenAndAmenityRatio: '4.200 m² Công viên nội khu & Tiện ích resort tầng 3',
    farCoefficient: '8.5 lần',
    maxFloors: '39 tầng nổi + 4 tầng hầm đỗ xe thông minh',
    legalStatus: 'Giấy phép xây dựng đầy đủ, Đủ điều kiện bán nhà ở hình thành trong tương lai',
    landUseTerm: 'Lâu dài với người Việt Nam, 50 năm với người nước ngoài',
    infrastructureHighlights: [
      'Tọa lạc 2 mặt tiền Cô Giang - Cô Bắc, lõi trung tâm Quận 1',
      'Cách Ga ngầm Bến Thành (Metro Số 1) chỉ 800m',
      'Liền kề đại lộ Võ Văn Kiệt và hầm Thủ Thiêm kết nối TP. Thủ Đức'
    ],
    zoningClassification: 'Đất ở hỗn hợp kết hợp dịch vụ thương mại cao cấp'
  },
  p4: {
    projectId: 'p4',
    projectName: 'Vinhomes Grand Park',
    decisionNumber: 'QĐ số 6398/QĐ-UBND',
    approvalDate: '06/07/2018',
    issuingAuthority: 'UBND TP.HCM',
    scale: '271 Hecta (Đại đô thị thông minh đẳng cấp quốc tế)',
    buildingDensity: '22.5%',
    greenAndAmenityRatio: 'Đại công viên 36ha quy mô hàng đầu Đông Nam Á',
    farCoefficient: '5.2 lần',
    maxFloors: '25 - 35 tầng (Phân khu căn hộ), Biệt thự Manhattan 3 - 5 tầng',
    legalStatus: 'Sổ hồng từng căn đã bàn giao hàng chục ngàn hộ dân',
    landUseTerm: 'Lâu dài (Người Việt Nam), 50 năm (Người nước ngoài)',
    infrastructureHighlights: [
      'Tuyến Đường Vành Đai 3 TP.HCM đi xuyên qua khuôn viên dự án',
      'Hệ thống xe buýt điện VinBus kết nối thẳng Ga Metro Suối Tiên',
      'TTTM Vincom Mega Mall lớn nhất miền Nam hoạt động'
    ],
    zoningClassification: 'Đô thị kiểu mẫu đa chức năng với hạ tầng thông minh'
  },
  p5: {
    projectId: 'p5',
    projectName: 'The Global City',
    decisionNumber: 'QĐ số 4958/QĐ-UBND',
    approvalDate: '12/10/2021',
    issuingAuthority: 'UBND TP.HCM',
    scale: '117.4 Hecta (Downtown mới của TP.HCM)',
    buildingDensity: '28.0%',
    greenAndAmenityRatio: 'Kênh đào The Canal of Love & Công viên nhạc nước lớn nhất ĐNÁ',
    farCoefficient: '3.5 lần',
    maxFloors: 'Shophouse SOHO 5 tầng, Căn hộ cao tầng 35 tầng thiết kế Foster + Partners',
    legalStatus: 'Phê duyệt 1/500 chuẩn quốc tế, đã bàn giao phân khu SOHO',
    landUseTerm: 'Lâu dài với người Việt Nam',
    infrastructureHighlights: [
      'Tiếp giáp nút giao Cao tốc TP.HCM - Long Thành & Mai Chí Thọ',
      'Đường Đỗ Xuân Hợp mở rộng 30m và trục đường Liên Phường thông xe',
      '10 phút đến KĐT Mới Thủ Thiêm và Trung tâm Quận 1'
    ],
    zoningClassification: 'Trung tâm phức hợp đô thị thương mại dịch vụ chuẩn quốc tế'
  }
}

// Transit routing data from Ben Thanh (Q1)
interface TransitRoute {
  projectId: string
  name: string
  distanceKm: number
  travelTime: string
  mainRoads: string[]
  keyMilestones: string[]
  transitRating: string
  tollFee: string
}

const TRANSIT_ROUTES: Record<string, TransitRoute> = {
  p1: {
    projectId: 'p1',
    name: 'NovaWorld Phan Thiet',
    distanceKm: 165,
    travelTime: '1 giờ 45 phút',
    mainRoads: ['Hầm Thủ Thiêm', 'Cao tốc TP.HCM - Long Thành', 'Cao tốc Dầu Giây - Phan Thiết', 'Đường Tiến Thành'],
    keyMilestones: ['Nút giao An Phú', 'Trạm dừng Long Thành', 'Nút giao Ba Bàu', 'Bikini Beach Novaworld'],
    transitRating: 'Rất thuận lợi qua Cao tốc liên tỉnh',
    tollFee: '150.000 VNĐ (ePass/VETC)'
  },
  p2: {
    projectId: 'p2',
    name: 'Aqua City',
    distanceKm: 28,
    travelTime: '35 phút',
    mainRoads: ['Đại lộ Mai Chí Thọ', 'Cao tốc TP.HCM - Long Thành', 'Đường Hương Lộ 2 (60m)', 'Cầu Vàm Cái Sứt'],
    keyMilestones: ['Hầm Thủ Thiêm', 'Nút giao Vành Đai 2', 'Nút giao Hương Lộ 2', 'Quảng trường Aqua Marina'],
    transitRating: 'Tối ưu khi hoàn thành Hương Lộ 2 & VĐ3',
    tollFee: '40.000 VNĐ'
  },
  p3: {
    projectId: 'p3',
    name: 'The Grand Manhattan',
    distanceKm: 1.2,
    travelTime: '5 phút',
    mainRoads: ['Trần Hưng Đạo', 'Cô Bắc', 'Cô Giang', 'Đại lộ Võ Văn Kiệt'],
    keyMilestones: ['Chợ Bến Thành', 'Bảo tàng Mỹ thuật', 'Cầu Ông Lãnh'],
    transitRating: 'Vị trí lõi nội đô Quận 1 - Đi bộ tới Ga Metro',
    tollFee: '0 VNĐ'
  },
  p4: {
    projectId: 'p4',
    name: 'Vinhomes Grand Park',
    distanceKm: 18.5,
    travelTime: '28 phút',
    mainRoads: ['Mai Chí Thọ', 'Xa Lộ Hà Nội / Song Hành', 'Đỗ Xuân Hợp', 'Đường Nguyễn Xiển / Vành Đai 3'],
    keyMilestones: ['Cầu Sài Gòn', 'Khu Công Nghệ Cao TP.HCM', 'Công viên Ánh Sáng 36ha'],
    transitRating: 'Kết nối trực tiếp trục Vành Đai 3 & Tuyến VinBus',
    tollFee: '0 VNĐ'
  },
  p5: {
    projectId: 'p5',
    name: 'The Global City',
    distanceKm: 9.8,
    travelTime: '15 phút',
    mainRoads: ['Hầm Thủ Thiêm', 'Đại lộ Mai Chí Thọ', 'Đường Đỗ Xuân Hợp (An Phú)', 'Đường Liên Phường'],
    keyMilestones: ['Khu Đô Thị Mới Thủ Thiêm', 'Nút giao An Phú 3 tầng', 'Kênh đào Nhạc Nước'],
    transitRating: 'Kết nối cao tốc và các tuyến huyết mạch Thủ Đức',
    tollFee: '0 VNĐ'
  }
}

export default function GISPage() {
  const projects = useStore((state) => state.projects)
  
  // Layer states
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    metro: true,
    ringroad3: true,
    highway: true,
    airport: true,
    landprice: false,
    flood: false
  })
  
  // AI NLP Search states
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [aiResults, setAiResults] = useState<any>(null)
  
  // Map Controller focus
  const [focusedCoords, setFocusedCoords] = useState<[number, number] | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(11)

  // Modals state
  const [zoningModalOpen, setZoningModalOpen] = useState(false)
  const [selectedZoningProject, setSelectedZoningProject] = useState<string>('p2')
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false)

  const [transitModalOpen, setTransitModalOpen] = useState(false)
  const [selectedTransitProject, setSelectedTransitProject] = useState<string>('p2')
  const [navActiveToast, setNavActiveToast] = useState(false)

  // Region filter for project explorer sidebar
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'HCM' | 'DONGNAI' | 'BINHTHUAN'>('ALL')

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAllLayers = (enable: boolean) => {
    const updated: Record<string, boolean> = {}
    LAYERS.forEach(l => {
      updated[l.id] = enable
    })
    setActiveLayers(updated)
  }

  // Quick query chips
  const quickChips = [
    { label: "Quận 1 gần Metro", query: "Quận 1 gần tuyến Metro" },
    { label: "Aqua City ven sông", query: "Dự án sinh thái ven sông Đồng Nai" },
    { label: "Nghỉ dưỡng Phan Thiết", query: "Biệt thự biển NovaWorld Phan Thiết cao tốc" },
    { label: "Vinhomes Grand Park", query: "Đại đô thị Vinhomes Thủ Đức Vành Đai 3" },
    { label: "The Global City", query: "Trung tâm mới The Global City Masterise" }
  ]

  const handleAISearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault()
    const query = customQuery || searchQuery
    if (!query.trim()) return
    
    setIsSearching(true)
    setAiResults(null)
    if (customQuery) setSearchQuery(customQuery)
    
    // Simulate AI Spatial NLP engine processing
    setTimeout(() => {
      setIsSearching(false)
      const q = query.toLowerCase()
      
      let matched = []
      if (q.includes("quận 1") || q.includes("trung tâm") || q.includes("manhattan") || q.includes("cô bắc")) {
        matched = projects.filter(p => p.id === 'p3')
      } else if (q.includes("đồng nai") || q.includes("aqua") || q.includes("sinh thái") || q.includes("ven sông")) {
        matched = projects.filter(p => p.id === 'p2')
      } else if (q.includes("phan thiết") || q.includes("biển") || q.includes("novaworld") || q.includes("nghỉ dưỡng")) {
        matched = projects.filter(p => p.id === 'p1')
      } else if (q.includes("thủ đức") || q.includes("vinhomes") || q.includes("grand park") || q.includes("công viên 36ha")) {
        matched = projects.filter(p => p.id === 'p4')
      } else if (q.includes("global city") || q.includes("an phú") || q.includes("nhạc nước") || q.includes("masterise")) {
        matched = projects.filter(p => p.id === 'p5')
      } else {
        matched = projects.filter(p => p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
        if (matched.length === 0) matched = [projects[1]] // Fallback to Aqua City
      }
      
      setAiResults(matched)
      if (matched.length > 0 && matched[0].coordinates) {
        setFocusedCoords(matched[0].coordinates as [number, number])
        setZoomLevel(13)
      }
    }, 1000)
  }

  const clearAI = () => {
    setAiResults(null)
    setSearchQuery("")
  }

  const resetMapView = () => {
    setFocusedCoords([10.8000, 106.7500])
    setZoomLevel(10)
    setAiResults(null)
  }

  const handleFlyToProject = (project: any) => {
    if (project.coordinates) {
      setFocusedCoords(project.coordinates as [number, number])
      setZoomLevel(14)
      setAiResults([project])
    }
  }

  // Filter projects by region
  const filteredProjects = useMemo(() => {
    if (regionFilter === 'HCM') return projects.filter(p => p.location.includes('TP.HCM') || p.location.includes('Thủ Đức') || p.location.includes('Quận 1'))
    if (regionFilter === 'DONGNAI') return projects.filter(p => p.location.includes('Đồng Nai'))
    if (regionFilter === 'BINHTHUAN') return projects.filter(p => p.location.includes('Bình Thuận'))
    return projects
  }, [projects, regionFilter])

  const selectedZoning = ZONING_DATA[selectedZoningProject] || ZONING_DATA['p2']
  const selectedTransit = TRANSIT_ROUTES[selectedTransitProject] || TRANSIT_ROUTES['p2']

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      {/* 1. Header with Title & Quick Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Map className="h-6 w-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Bản Đồ Số Quy Hoạch BĐS & Không Gian Địa Lý (GIS)
            </h1>
            <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs">
              Leaflet 1.9 Engine Active
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hệ thống GIS liên kết dữ liệu quy hoạch 1/500, mạng lưới hạ tầng giao thông 2026-2030, heatmap giá đất & NLP Spatial Search.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setZoningModalOpen(true)}
            className="flex-1 sm:flex-initial border-indigo-200 text-indigo-700 dark:border-indigo-800 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 font-semibold gap-1.5"
          >
            <FileText className="h-4 w-4" />
            Tra Cứu Quy Hoạch 1/500
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setTransitModalOpen(true)}
            className="flex-1 sm:flex-initial border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold gap-1.5"
          >
            <Route className="h-4 w-4" />
            Lộ Trình Di Chuyển
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={resetMapView}
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 gap-1 text-xs"
            title="Khôi phục góc nhìn toàn cảnh Đông Nam Bộ"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Toàn Cảnh
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Strategic GIS KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Đại Dự Án Trọng Điểm</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">5 Siêu Dự Án</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> 100% Khớp tọa độ GPS thực tế
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-2xl">
            <Building2 className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hạ Tầng Giao Thông</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">4 Trục Đột Phá</div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              Metro 1 • Vành Đai 3 • Cao Tốc • Sân Bay
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-2xl">
            <Train className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Sân Bay Long Thành</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">5.000 Hecta</div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
              Công suất 100 Tr Khách/Năm
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-2xl">
            <Compass className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Biên Độ Tăng Giá 2026-30</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">+35% / Năm</div>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
              AI Forecast mô hình giá đất liên vùng
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-2xl">
            <CircleDollarSign className="h-6 w-6" />
          </div>
        </Card>
      </div>

      {/* 3. Main GIS Layout: Interactive Map + Left/Right Control Overlays */}
      <div className="flex-1 flex flex-col xl:flex-row gap-5 min-h-[640px]">
        {/* Left Column: Interactive Leaflet Map Container */}
        <div className="flex-1 rounded-2xl overflow-hidden border shadow-md relative min-h-[580px] bg-slate-950 flex flex-col">
          
          {/* Top AI NLP Spatial Search Bar Overlay */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[400] w-[94%] max-w-2xl">
            <form onSubmit={handleAISearch} className="relative flex items-center shadow-2xl rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md overflow-hidden border border-indigo-200 dark:border-indigo-800/80 p-1">
              <div className="pl-3.5 pr-2">
                {isSearching ? <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" /> : <Sparkles className="h-5 w-5 text-indigo-600" />}
              </div>
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Chat tìm kiếm không gian: 'Dự án ven sông Đồng Nai gần Vành Đai 3'..."
                className="border-0 focus-visible:ring-0 shadow-none text-sm bg-transparent flex-1 h-11 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button type="button" onClick={clearAI} className="p-1.5 text-slate-400 hover:text-slate-700 mr-1.5 rounded-lg hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              )}
              <Button type="submit" disabled={isSearching} className="h-10 rounded-xl px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm">
                Quét AI
              </Button>
            </form>

            {/* Quick Query Filter Chips */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar justify-center sm:justify-start">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAISearch(undefined, chip.query)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 hover:text-indigo-600 backdrop-blur-xs transition-all whitespace-nowrap cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
            
            {/* AI Searching Status Popup */}
            {isSearching && (
              <div className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-xl flex items-center justify-center gap-2 text-xs font-medium animate-in slide-in-from-top-2 mx-auto max-w-md">
                <Sparkles className="h-4 w-4 animate-pulse" />
                AI Spatial đang phân tích tọa độ & bán kính quy hoạch: "{searchQuery}"...
              </div>
            )}
          </div>

          {/* Leaflet Map Component */}
          <div className="flex-1 w-full h-full relative">
            <DynamicMap 
              activeLayers={activeLayers} 
              aiResults={aiResults} 
              focusedCoords={focusedCoords} 
              zoomLevel={zoomLevel} 
            />
          </div>

          {/* Floating Infrastructure Layer Controls (Bottom-Left) */}
          <div className="absolute bottom-5 left-4 z-[400] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-[300px] w-full">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">Lớp Hạ Tầng GIS</span>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => toggleAllLayers(true)} 
                  className="text-[10px] text-indigo-600 hover:underline font-semibold"
                >
                  Bật hết
                </button>
                <span className="text-[10px] text-slate-300">•</span>
                <button 
                  onClick={() => toggleAllLayers(false)} 
                  className="text-[10px] text-slate-500 hover:underline"
                >
                  Tắt
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {LAYERS.map(l => (
                <label 
                  key={l.id} 
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100/80 dark:hover:bg-slate-800/80 cursor-pointer text-xs transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <input 
                      type="checkbox" 
                      checked={!!activeLayers[l.id]} 
                      onChange={() => toggleLayer(l.id)} 
                      className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" 
                    />
                    <l.icon className={`h-4 w-4 ${l.color}`} />
                    <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] leading-tight">{l.label}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] font-mono py-0 px-1 border-slate-200 dark:border-slate-700">
                    {l.badge}
                  </Badge>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Project Explorer Directory & AI Search Matches */}
        <div className="w-full xl:w-96 flex flex-col gap-4 flex-shrink-0">
          
          {/* AI Search Matched Drawer if present */}
          {aiResults && aiResults.length > 0 && (
            <Card className="p-4 bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 shadow-sm animate-in fade-in-50">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-indigo-200/60 dark:border-indigo-800/60">
                <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-bold text-xs uppercase tracking-wide">Kết Quả Phù Hợp AI ({aiResults.length})</span>
                </div>
                <button onClick={clearAI} className="text-slate-400 hover:text-slate-700 p-1">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {aiResults.map((project: any) => (
                <div key={project.id} className="bg-white dark:bg-slate-900 rounded-xl p-3 border shadow-xs space-y-2.5">
                  <div className="h-28 w-full relative rounded-lg overflow-hidden">
                    <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px]">
                      Phù hợp 98%
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{project.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3 text-indigo-500" /> {project.location}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Loại hình</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{project.type}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">AI Rating</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{project.aiAnalysis?.rating || 'BUY'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <Button 
                      size="sm" 
                      onClick={() => handleFlyToProject(project)}
                      className="text-xs h-8 bg-indigo-600 hover:bg-indigo-700 text-white gap-1"
                    >
                      <Navigation className="h-3 w-3" />
                      Định Vị Lại
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedZoningProject(project.id)
                        setZoningModalOpen(true)
                      }}
                      className="text-xs h-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                      Hồ Sơ 1/500
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* Project Directory Card with Regional Filtering */}
          <Card className="flex-1 p-4 bg-white dark:bg-slate-900 border shadow-xs flex flex-col min-h-[460px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  Danh Mục Siêu Dự Án
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Click để di chuyển ống kính bản đồ đến vị trí thực</p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">{filteredProjects.length} / {projects.length}</Badge>
            </div>

            {/* Region Filter Tabs */}
            <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 no-scrollbar">
              <button 
                onClick={() => setRegionFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${regionFilter === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Tất Cả
              </button>
              <button 
                onClick={() => setRegionFilter('HCM')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${regionFilter === 'HCM' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                TP.HCM
              </button>
              <button 
                onClick={() => setRegionFilter('DONGNAI')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${regionFilter === 'DONGNAI' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Đồng Nai
              </button>
              <button 
                onClick={() => setRegionFilter('BINHTHUAN')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${regionFilter === 'BINHTHUAN' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Phan Thiết
              </button>
            </div>

            {/* Project Cards List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[520px]">
              {filteredProjects.map((p) => (
                <div 
                  key={p.id} 
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-800/80 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <img 
                      src={p.thumbnail} 
                      alt={p.name} 
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                          {p.name}
                        </h4>
                        <Badge className="text-[9px] py-0 px-1 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border">
                          {p.type.split(' ')[0]}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 text-slate-400 flex-shrink-0" />
                        {p.location}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-600 dark:text-slate-400">
                        <span>Quy mô: <b>{p.totalUnits?.toLocaleString()}</b> căn</span>
                        <span>Đã bán: <b className="text-emerald-600">{Math.round((p.soldUnits / p.totalUnits) * 100)}%</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for each project card */}
                  <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleFlyToProject(p)}
                      className="h-7 text-[10px] px-1 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-semibold gap-1"
                    >
                      <Navigation className="h-3 w-3" />
                      Định vị
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setSelectedZoningProject(p.id)
                        setZoningModalOpen(true)
                      }}
                      className="h-7 text-[10px] px-1 border-slate-200 text-slate-700 hover:bg-slate-100 gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      Quy hoạch
                    </Button>
                    <Link href={`/projects/${p.id}`} className="w-full">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="w-full h-7 text-[10px] px-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 4. MODAL 1: Tra Cứu Quy Hoạch Đất Đai 1/500 */}
      {zoningModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Hồ Sơ Quy Hoạch Chi Tiết 1/500 & Pháp Lý Đất Đai
                  </h3>
                  <p className="text-xs text-slate-500">Tra cứu chỉ tiêu quy hoạch, mật độ xây dựng, hệ số FAR & văn bản phê duyệt</p>
                </div>
              </div>
              <button 
                onClick={() => setZoningModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              
              {/* Project Selector Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Chọn dự án khảo sát quy hoạch:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => setSelectedZoningProject(proj.id)}
                      className={`p-2 rounded-xl text-left border text-xs font-semibold cursor-pointer transition-all ${
                        selectedZoningProject === proj.id 
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold truncate">{proj.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">{proj.location.split(',')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Zoning Details Sheet */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <h4 className="font-bold text-base text-indigo-700 dark:text-indigo-400">
                      {selectedZoning.projectName}
                    </h4>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      {selectedZoning.decisionNumber} • Ban hành bởi: {selectedZoning.issuingAuthority}
                    </p>
                  </div>
                  <Badge className="bg-emerald-600 text-white text-xs">
                    Đã Phê Duyệt 1/500
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border shadow-2xs">
                    <span className="text-slate-400 block text-[11px]">Quy mô quy hoạch</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{selectedZoning.scale}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border shadow-2xs">
                    <span className="text-slate-400 block text-[11px]">Mật độ xây dựng thuần</span>
                    <span className="font-bold text-emerald-600 text-sm">{selectedZoning.buildingDensity}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border shadow-2xs">
                    <span className="text-slate-400 block text-[11px]">Hệ số sử dụng đất (FAR)</span>
                    <span className="font-bold text-indigo-600 text-sm">{selectedZoning.farCoefficient}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border shadow-2xs">
                    <span className="text-slate-400 block text-[11px]">Đất cây xanh, mặt nước & tiện ích</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedZoning.greenAndAmenityRatio}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border shadow-2xs">
                    <span className="text-slate-400 block text-[11px]">Tầng cao công trình cho phép</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 mt-1">{selectedZoning.maxFloors}</span>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border shadow-2xs text-xs space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Hiện trạng pháp lý & Sổ hồng</span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    {selectedZoning.legalStatus} • Thời hạn: <span className="text-emerald-700 font-bold">{selectedZoning.landUseTerm}</span>
                  </p>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border shadow-2xs text-xs space-y-1.5">
                  <span className="text-slate-400 font-semibold block text-[11px]">Điểm nhấn kết nối quy hoạch hạ tầng giao thông</span>
                  <ul className="space-y-1">
                    {selectedZoning.infrastructureHighlights.map((hl, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Check className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Toast Feedback */}
              {downloadSuccessToast && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 rounded-xl text-xs flex items-center justify-between animate-in slide-in-from-top-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Đã tạo liên kết tải file CAD/PDF Quy Hoạch 1/500 dự án {selectedZoning.projectName}!</span>
                  </div>
                  <button onClick={() => setDownloadSuccessToast(false)} className="text-emerald-600 hover:text-emerald-900">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-500">
                Phê duyệt quy hoạch có giá trị pháp lý cập nhật đến 2026.
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setZoningModalOpen(false)}
                  className="flex-1 sm:flex-initial"
                >
                  Đóng
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    setDownloadSuccessToast(true)
                    setTimeout(() => setDownloadSuccessToast(false), 4000)
                  }}
                  className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1.5"
                >
                  <Download className="h-4 w-4" />
                  Tải Bản Đồ 1/500 (PDF/CAD)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL 2: Đo Khoảng Cách & Lộ Trình Di Chuyển (Transit Routing) */}
      {transitModalOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-600 text-white rounded-xl">
                  <Route className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Tính Toán Khoảng Cách & Lộ Trình Di Chuyển
                  </h3>
                  <p className="text-xs text-slate-500">Mô phỏng thời gian di chuyển từ Lõi Trung Tâm Bến Thành (Quận 1) đến các dự án</p>
                </div>
              </div>
              <button 
                onClick={() => setTransitModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto space-y-4">
              
              {/* Origin Marker */}
              <div className="flex items-center gap-3 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border">
                <div className="p-2 bg-red-600 text-white rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Điểm xuất phát (Cột mốc số 0):</span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    Chợ Bến Thành, Công trường Quách Thị Trang, Quận 1, TP.HCM
                  </div>
                </div>
              </div>

              {/* Destination Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Chọn điểm đến dự án:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(TRANSIT_ROUTES).map(([key, route]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTransitProject(key)}
                      className={`p-2.5 rounded-xl text-left border text-xs font-semibold cursor-pointer transition-all ${
                        selectedTransitProject === key 
                          ? 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="font-bold truncate">{route.name}</div>
                      <div className="text-[11px] text-amber-700 dark:text-amber-400 font-mono mt-0.5">{route.distanceKm} km • {route.travelTime}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Routing Metrics */}
              <div className="bg-amber-50/50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200/80 dark:border-amber-800/80 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-amber-800/60">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Lộ trình đến {selectedTransit.name}</h4>
                    <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">{selectedTransit.transitRating}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-700 dark:text-amber-400">{selectedTransit.travelTime}</span>
                    <span className="block text-[11px] text-slate-500 font-mono">{selectedTransit.distanceKm} km</span>
                  </div>
                </div>

                {/* Key Highways & Streets */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Trục giao thông chính qua:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTransit.mainRoads.map((road, idx) => (
                      <span key={idx} className="flex items-center gap-1 bg-white dark:bg-slate-900 border px-2 py-1 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300">
                        <Car className="h-3 w-3 text-amber-600" />
                        {road}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold block text-[11px]">Các nút giao chiến lược:</span>
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {selectedTransit.keyMilestones.map((m, idx) => (
                      <React.Fragment key={idx}>
                        <span className="font-medium bg-white dark:bg-slate-900 border px-2 py-0.5 rounded text-[11px]">{m}</span>
                        {idx < selectedTransit.keyMilestones.length - 1 && <ArrowRight className="h-3 w-3 text-slate-400" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-200/60 dark:border-amber-800/60">
                  <span className="text-slate-500">Phí cầu đường dự tính:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{selectedTransit.tollFee}</span>
                </div>
              </div>

              {navActiveToast && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-300 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Đã kích hoạt chế độ dẫn đường GPS đến {selectedTransit.name}!</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setTransitModalOpen(false)}
              >
                Đóng
              </Button>
              <Button 
                size="sm"
                onClick={() => {
                  setNavActiveToast(true)
                  const targetProj = projects.find(p => p.id === selectedTransitProject)
                  if (targetProj && targetProj.coordinates) {
                    setFocusedCoords(targetProj.coordinates as [number, number])
                    setZoomLevel(13)
                  }
                  setTimeout(() => {
                    setNavActiveToast(false)
                    setTransitModalOpen(false)
                  }, 1200)
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1.5"
              >
                <Navigation className="h-4 w-4" />
                Định Vị Tuyến Trên Bản Đồ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
