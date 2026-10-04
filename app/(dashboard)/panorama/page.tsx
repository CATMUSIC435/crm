"use client"
import React, { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Eye, Maximize2, Minimize2, Ruler, Volume2, VolumeX, Moon, Sun, 
  RotateCw, Share2, Download, Video, PhoneCall, CheckCircle2, 
  Building2, Sparkles, X, ChevronRight, MapPin, Copy, Layers, 
  Compass, ArrowRight, ShieldCheck, Heart, User, Check
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import Link from 'next/link'

// Load 3D Viewer dynamically with SSR disabled
const DynamicPanorama = dynamic(
  () => import('@/components/3d/panorama-viewer').then(mod => mod.PanoramaViewer),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-950 text-white gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="font-bold text-sm tracking-wide">Đang khởi tạo Engine Thực tế Ảo Three.js & WebXR...</div>
        <div className="text-xs text-slate-400">Tải môi trường ánh sáng HDRI và ma trận điểm Hotspots 3D</div>
      </div>
    )
  }
)

// Mock VR Tour Project Data with Rooms, Specs & 3D Master Plan Zones
interface RoomData {
  id: string
  name: string
  thumbnail: string
  preset: string
  measurements: {
    width: string
    height: string
    area: string
  }
  portals: {
    position: [number, number, number]
    label: string
    targetRoomId: string
  }[]
  specs: {
    position: [number, number, number]
    title: string
    subtitle: string
    brand: string
    origin: string
    warranty: string
    description: string
  }[]
}

interface TourProject {
  id: string
  name: string
  developer: string
  unitCode: string
  unitTitle: string
  type: string
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  location: string
  rooms: RoomData[]
  zones: {
    id: string
    name: string
    totalUnits: number
    soldPercent: number
    priceFrom: string
    height: number
    color: string
    description: string
  }[]
}

const TOUR_PROJECTS: Record<string, TourProject> = {
  p1: {
    id: 'p1',
    name: 'NovaWorld Phan Thiet',
    developer: 'Novaland',
    unitCode: 'NVW-01.01',
    unitTitle: 'Biệt Thự Đơn Lập Florida 01.01 Hướng Biển',
    type: 'Biệt thự biển đơn lập',
    price: 25000000000,
    area: 250,
    bedrooms: 4,
    bathrooms: 4,
    location: 'Tiến Thành, Phan Thiết, Bình Thuận',
    rooms: [
      {
        id: 'p1-living',
        name: 'Phòng Khách Panorama',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
        preset: 'apartment',
        measurements: { width: '6.20m', height: '3.60m', area: '58.0 m²' },
        portals: [
          { position: [25, 0, -20], label: 'Ra Ban Công View Biển', targetRoomId: 'p1-balcony' },
          { position: [-25, 0, 15], label: 'Vào Phòng Ngủ Master', targetRoomId: 'p1-master' }
        ],
        specs: [
          {
            position: [12, -2, -15],
            title: 'Sàn Đá Marble Tự Nhiên',
            subtitle: 'Carrara White Italy',
            brand: 'Carrara Marble Ý',
            origin: 'Nhập khẩu nguyên khối từ Ý',
            warranty: 'Bảo hành 10 năm',
            description: 'Đá Marble trắng Carrara vân mây tự nhiên, chống trầy xước và đánh bóng tiêu chuẩn khách sạn 5 sao.'
          },
          {
            position: [20, 5, -10],
            title: 'Kính Hộp Low-E 3 Lớp',
            subtitle: 'Eurowindow Guardian Glass',
            brand: 'Guardian Glass USA',
            origin: 'Hoa Kỳ',
            warranty: 'Bảo hành 15 năm',
            description: 'Kính cản nhiệt Low-E dày 28mm, ngăn 99% tia cực tím UV và cách âm tuyệt đối trước tiếng ồn bên ngoài.'
          }
        ]
      },
      {
        id: 'p1-balcony',
        name: 'Ban Công Hoàng Hôn Bikini Beach',
        thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
        preset: 'sunset',
        measurements: { width: '4.80m', height: 'Ngoài trời', area: '24.0 m²' },
        portals: [
          { position: [-25, 0, 10], label: 'Trở Về Phòng Khách', targetRoomId: 'p1-living' },
          { position: [20, -5, -20], label: 'Xuống Hồ Bơi Vô Cực', targetRoomId: 'p1-pool' }
        ],
        specs: [
          {
            position: [15, -4, -10],
            title: 'Lan Can Kính Cường Lực',
            subtitle: 'Kính tôi nhiệt 19mm',
            brand: 'Saint-Gobain Pháp',
            origin: 'Pháp',
            warranty: 'Bảo hành trọn đời',
            description: 'Lan can kính cường lực tràn viền không trụ chắn, mang lại tầm nhìn vô cực trực diện bãi biển Florida.'
          }
        ]
      },
      {
        id: 'p1-master',
        name: 'Phòng Ngủ Master King Suite',
        thumbnail: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&q=80',
        preset: 'lobby',
        measurements: { width: '5.50m', height: '3.40m', area: '38.0 m²' },
        portals: [
          { position: [25, 0, -10], label: 'Ra Phòng Khách', targetRoomId: 'p1-living' }
        ],
        specs: [
          {
            position: [-10, 2, -15],
            title: 'Hệ Thống Smart Home Lumi',
            subtitle: 'Điều khiển giọng nói & Kịch bản',
            brand: 'Lumi Vietnam & Apple HomeKit',
            origin: 'Việt Nam & EU',
            warranty: 'Bảo hành 5 năm',
            description: 'Tự động mở rèm đón bình minh, điều chỉnh ánh sáng 16 triệu màu và kiểm soát nhiệt độ phòng ngủ thông minh.'
          }
        ]
      },
      {
        id: 'p1-pool',
        name: 'Hồ Bơi Vô Cực & Vườn Riêng',
        thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80',
        preset: 'park',
        measurements: { width: '12.0m', height: 'Open Sky', area: '95.0 m²' },
        portals: [
          { position: [-20, 5, 20], label: 'Lên Ban Công', targetRoomId: 'p1-balcony' }
        ],
        specs: [
          {
            position: [10, -5, -15],
            title: 'Hệ Thống Lọc Điện Phân Muối',
            subtitle: 'Không hóa chất Clo',
            brand: 'AstralPool Tây Ban Nha',
            origin: 'Tây Ban Nha',
            warranty: 'Bảo hành 8 năm',
            description: 'Công nghệ điện phân muối khoáng tự nhiên, bảo vệ làn da và sức khỏe cho gia đình thượng lưu.'
          }
        ]
      }
    ],
    zones: [
      { id: 'z1', name: 'Phân khu Florida 1 (Biệt thự Mỹ)', totalUnits: 1200, soldPercent: 85, priceFrom: '16 Tỷ', height: 8, color: '#f59e0b', description: 'Phong cách kiến trúc Mỹ phóng khoáng liền kề bãi biển Bikini Beach.' },
      { id: 'z2', name: 'Phân khu Waikiki (Biệt thự đồi)', totalUnits: 270, soldPercent: 92, priceFrom: '22 Tỷ', height: 14, color: '#ec4899', description: 'Địa hình đồi giật cấp cao độ 80m view trọn vịnh Phan Thiết.' },
      { id: 'z3', name: 'Phân khu PGA Golf Villas', totalUnits: 500, soldPercent: 78, priceFrom: '19 Tỷ', height: 6, color: '#10b981', description: 'Nằm giữa lòng cụm sân golf 36 hố độc quyền chuẩn PGA quốc tế.' },
      { id: 'z4', name: 'Tổ hợp Giải trí Bikini Beach 16ha', totalUnits: 180, soldPercent: 100, priceFrom: 'Vận hành', height: 10, color: '#0284c7', description: 'Quảng trường biển, rạp xiếc Circus Land và chuỗi nhà hàng 5 sao.' }
    ]
  },
  p3: {
    id: 'p3',
    name: 'The Grand Manhattan',
    developer: 'Novaland',
    unitCode: 'TGM-38.01',
    unitTitle: 'Sky Mansion Penthouse Tầng 38 Tháp Manhattan',
    type: 'Căn hộ hạng sang',
    price: 32000000000,
    area: 165,
    bedrooms: 3,
    bathrooms: 3,
    location: 'Cô Giang - Cô Bắc, Quận 1, TP.HCM',
    rooms: [
      {
        id: 'p3-living',
        name: 'Đại Sảnh Phòng Khách Sky Mansion',
        thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80',
        preset: 'city',
        measurements: { width: '7.50m', height: '3.80m', area: '68.0 m²' },
        portals: [
          { position: [25, 0, -15], label: 'Ngắm Ban Công Triệu Đô Ban Đêm', targetRoomId: 'p3-night' },
          { position: [-25, 0, 15], label: 'Vào Phòng Ngủ Tổng Thống', targetRoomId: 'p3-master' }
        ],
        specs: [
          {
            position: [12, -2, -10],
            title: 'Khóa Cửa Thông Minh Hafele Smart Lock',
            subtitle: 'Nhận diện khuôn mặt FaceID 3D',
            brand: 'Hafele CHLB Đức',
            origin: 'Đức',
            warranty: 'Bảo hành 5 năm',
            description: 'Tích hợp nhận diện FaceID 3D, vân tay bán dẫn và cảnh báo chống đột nhập gửi về điện thoại.'
          }
        ]
      },
      {
        id: 'p3-night',
        name: 'Ban Công Triệu Đô Ban Đêm',
        thumbnail: 'https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=400&q=80',
        preset: 'night',
        measurements: { width: '5.00m', height: '3.80m', area: '22.0 m²' },
        portals: [
          { position: [-25, 0, 10], label: 'Vào Lại Phòng Khách', targetRoomId: 'p3-living' }
        ],
        specs: [
          {
            position: [15, 3, -15],
            title: 'Tầm View Triệu Đô Lõi Quận 1',
            subtitle: 'Bitexco • Landmark 81 • Bến Bạch Đằng',
            brand: 'View Panorama 360°',
            origin: 'Tọa độ kim cương Quận 1',
            warranty: 'Vĩnh viễn không bị che chắn',
            description: 'Tầm view trực diện tòa tháp biểu tượng Bitexco và sông Sài Gòn lung linh về đêm.'
          }
        ]
      },
      {
        id: 'p3-master',
        name: 'Phòng Ngủ Master Tổng Thống',
        thumbnail: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80',
        preset: 'lobby',
        measurements: { width: '6.00m', height: '3.60m', area: '42.0 m²' },
        portals: [
          { position: [25, 0, -10], label: 'Vào Phòng Khách', targetRoomId: 'p3-living' }
        ],
        specs: [
          {
            position: [-15, 0, -15],
            title: 'Thiết Bị Vệ Sinh Duravit Philippe Starck',
            subtitle: 'Bộ sưu tập thiết kế độc quyền',
            brand: 'Duravit CHLB Đức',
            origin: 'Đức',
            warranty: 'Bảo hành 10 năm',
            description: 'Thiết bị vệ sinh mạ PVD cao cấp, bồn cầu thông minh tự động xả và tráng men kháng khuẩn HygieneGlaze.'
          }
        ]
      }
    ],
    zones: [
      { id: 'tz1', name: 'Khối Khách Sạn 5* Avani Saigon', totalUnits: 150, soldPercent: 100, priceFrom: 'Thương mại', height: 10, color: '#6366f1', description: 'Tích hợp dịch vụ quản lý khách sạn chuẩn quốc tế tầng 1 - 7.' },
      { id: 'tz2', name: 'Tháp Căn Hộ Hạng Sang Manhattan 39 Tầng', totalUnits: 1000, soldPercent: 80, priceFrom: '15 Tỷ', height: 26, color: '#f59e0b', description: 'Căn hộ định danh tinh hoa với chỗ đậu xe hơi định danh riêng.' },
      { id: 'tz3', name: 'Tổ Hợp Tiện Ích Resort Tầng 3 (4.200m²)', totalUnits: 1, soldPercent: 100, priceFrom: 'Cư dân', height: 4, color: '#10b981', description: 'Hồ bơi tràn bờ, vườn thiền trên cao, quầy bar lounge thượng lưu.' },
      { id: 'tz4', name: 'Hầm Đỗ Xe Thông Minh 4 Tầng', totalUnits: 800, soldPercent: 95, priceFrom: 'Định danh', height: 3, color: '#64748b', description: 'Công nghệ dẫn đường đỗ xe tự động bằng thẻ từ RFID.' }
    ]
  },
  p2: {
    id: 'p2',
    name: 'Aqua City',
    developer: 'Novaland',
    unitCode: 'AQC-PH.08',
    unitTitle: 'Dinh Thự Đảo Phượng Hoàng (Phoenix South)',
    type: 'Dinh thự sinh thái ven sông',
    price: 28500000000,
    area: 350,
    bedrooms: 5,
    bathrooms: 6,
    location: 'Long Hưng, TP. Biên Hòa, Đồng Nai',
    rooms: [
      {
        id: 'p2-living',
        name: 'Phòng Khách Sinh Thái Tràn Kính',
        thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
        preset: 'forest',
        measurements: { width: '8.00m', height: '4.20m', area: '72.0 m²' },
        portals: [
          { position: [25, 0, -15], label: 'Ra Bến Du Thuyền Riêng', targetRoomId: 'p2-marina' }
        ],
        specs: [
          {
            position: [15, -2, -15],
            title: 'Hệ Năng Lượng Mặt Trời Solar Roof',
            subtitle: 'Tự cung cấp 60% điện năng',
            brand: 'SMA Solar Đức',
            origin: 'Đức',
            warranty: 'Bảo hành 25 năm',
            description: 'Hệ thống điện mặt trời áp mái thông minh, hòa lưới điện và tích trữ năng lượng xanh sạch.'
          }
        ]
      },
      {
        id: 'p2-marina',
        name: 'Bến Du Thuyền Riêng Tại Gia',
        thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
        preset: 'dawn',
        measurements: { width: '6.50m', height: 'Open Air', area: '45.0 m²' },
        portals: [
          { position: [-25, 0, 10], label: 'Vào Lại Phòng Khách', targetRoomId: 'p2-living' }
        ],
        specs: [
          {
            position: [12, -4, -12],
            title: 'Cầu Tàu Đón Du Thuyền Riêng',
            subtitle: 'Chuẩn du thuyền neo đậu 45ft',
            brand: 'Marinetek Phần Lan',
            origin: 'Phần Lan',
            warranty: 'Bảo hành 20 năm',
            description: 'Phao nổi bê tông cốt sợi chịu lực cao, cung cấp điện nước ngầm phục vụ du thuyền cá nhân.'
          }
        ]
      }
    ],
    zones: [
      { id: 'az1', name: 'Đảo Phượng Hoàng (Phoenix Island 286ha)', totalUnits: 2500, soldPercent: 88, priceFrom: '18 Tỷ', height: 9, color: '#10b981', description: 'Hòn đảo nguyên sinh biệt lập được bao bọc bởi 100% mặt nước.' },
      { id: 'az2', name: 'Quảng Trường Aqua Marina 5 Hecta', totalUnits: 120, soldPercent: 95, priceFrom: '35 Tỷ', height: 12, color: '#0ea5e9', description: 'Tổ hợp bến du thuyền chuẩn quốc tế, khán đài sự kiện âm nhạc ven sông.' },
      { id: 'az3', name: 'Khu Đô Thị Thương Mại The Sun', totalUnits: 1800, soldPercent: 90, priceFrom: '12 Tỷ', height: 7, color: '#f59e0b', description: 'Tâm điểm phố thương mại mua sắm nhộn nhịp ngày đêm.' }
    ]
  },
  p5: {
    id: 'p5',
    name: 'The Global City',
    developer: 'Masterise Homes',
    unitCode: 'TGC-SH.12',
    unitTitle: 'Shophouse SOHO Thương Mại 5 Tầng Phố Đi Bộ',
    type: 'Nhà phố thương mại',
    price: 38000000000,
    area: 380,
    bedrooms: 4,
    bathrooms: 5,
    location: 'An Phú, TP. Thủ Đức, TP.HCM',
    rooms: [
      {
        id: 'p5-living',
        name: 'Tầng Trệt Kinh Doanh Flagship',
        thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
        preset: 'city',
        measurements: { width: '5.50m', height: '4.50m', area: '85.0 m²' },
        portals: [
          { position: [25, 0, -15], label: 'Lên Rooftop Lounge Nhạc Nước', targetRoomId: 'p5-terrace' }
        ],
        specs: [
          {
            position: [15, -2, -15],
            title: 'Mặt Tiền Tràn Kính Foster + Partners',
            subtitle: 'Thiết kế bởi đơn vị hàng đầu Anh Quốc',
            brand: 'Foster + Partners UK',
            origin: 'Anh Quốc',
            warranty: 'Bảo hành 15 năm',
            description: 'Thiết kế tối ưu công năng kinh doanh đa ngành: F&B, thời trang cao cấp, spa và văn phòng đại diện.'
          }
        ]
      },
      {
        id: 'p5-terrace',
        name: 'Rooftop Lounge Kênh Đào Nhạc Nước',
        thumbnail: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&q=80',
        preset: 'sunset',
        measurements: { width: '6.00m', height: 'Skyline', area: '65.0 m²' },
        portals: [
          { position: [-25, 0, 10], label: 'Xuống Tầng Trệt', targetRoomId: 'p5-living' }
        ],
        specs: [
          {
            position: [15, 3, -15],
            title: 'View Trực Diện The Canal of Love',
            subtitle: 'Kênh đào biểu diễn nhạc nước lớn nhất ĐNÁ',
            brand: 'Water Show Technology Pháp',
            origin: 'Pháp',
            warranty: 'Vĩnh viễn',
            description: 'Thưởng thức đại tiệc âm thanh ánh sáng và pháo hoa mỗi cuối tuần ngay tại ban công nhà mình.'
          }
        ]
      }
    ],
    zones: [
      { id: 'gz1', name: 'Khu Shophouse SOHO (915 Căn)', totalUnits: 915, soldPercent: 92, priceFrom: '38 Tỷ', height: 11, color: '#8b5cf6', description: 'Trục phố thương mại đã bàn giao hoạt động sầm uất.' },
      { id: 'gz2', name: 'Kênh Đào Nhạc Nước The Canal of Love', totalUnits: 1, soldPercent: 100, priceFrom: 'Tiện ích', height: 5, color: '#06b6d4', description: 'Tâm điểm thu hút hàng chục ngàn du khách mỗi đêm.' },
      { id: 'gz3', name: 'Khu Căn Hộ Cao Tầng Foster + Partners', totalUnits: 8000, soldPercent: 75, priceFrom: '10 Tỷ', height: 28, color: '#3b82f6', description: 'Biểu tượng phong cách sống quốc tế mới của TP. Thủ Đức.' }
    ]
  }
}

export default function PanoramaPage() {
  const customers = useStore(state => state.customers)
  const addBookingTicket = useStore(state => state.addBookingTicket)

  // Current Tour selection
  const [selectedProjectId, setSelectedProjectId] = useState<string>('p1')
  const project = TOUR_PROJECTS[selectedProjectId] || TOUR_PROJECTS['p1']
  
  const [selectedRoomId, setSelectedRoomId] = useState<string>(project.rooms[0]?.id || '')
  
  // Update selected room when project changes
  const activeRoom = useMemo(() => {
    const found = project.rooms.find(r => r.id === selectedRoomId)
    return found || project.rooms[0]
  }, [project, selectedRoomId])

  // Modes & Viewer Toggles
  const [tourMode, setTourMode] = useState<'tour' | 'masterplan'>('tour')
  const [isAutoRotate, setIsAutoRotate] = useState(false)
  const [showMeasurement, setShowMeasurement] = useState(false)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [isNightMode, setIsNightMode] = useState(false)
  const [ambientAudio, setAmbientAudio] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Interactive Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [specModalOpen, setSpecModalOpen] = useState(false)
  const [selectedSpec, setSelectedSpec] = useState<any>(null)
  const [videoCallModalOpen, setVideoCallModalOpen] = useState(false)
  const [selectedZoneInfo, setSelectedZoneInfo] = useState<any>(null)

  // Feedback states
  const [copySuccess, setCopySuccess] = useState(false)
  const [bookingSuccessToast, setBookingSuccessToast] = useState(false)
  const [floorPlanDownloadToast, setFloorPlanDownloadToast] = useState(false)

  // Booking Form State
  const [bookingCustomerId, setBookingCustomerId] = useState<string>(customers[0]?.id || 'c1')
  const [depositAmount, setDepositAmount] = useState<number>(100000000)

  const handleProjectChange = (projId: string) => {
    setSelectedProjectId(projId)
    const newProj = TOUR_PROJECTS[projId]
    if (newProj && newProj.rooms.length > 0) {
      setSelectedRoomId(newProj.rooms[0].id)
    }
  }

  const handleRoomSelect = (roomId: string) => {
    setSelectedRoomId(roomId)
  }

  const handleOpenSpec = (spec: any) => {
    setSelectedSpec(spec)
    setSpecModalOpen(true)
  }

  const handleSelectZone = (zone: any) => {
    setSelectedZoneInfo(zone)
  }

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 3000)
  }

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    const customer = customers.find(c => c.id === bookingCustomerId)
    
    // Create new booking ticket in Zustand
    addBookingTicket({
      customerId: bookingCustomerId,
      customerName: customer ? customer.name : 'Khách Hàng VIP',
      customerPhone: customer ? customer.phone : '0901234567',
      projectId: project.id,
      projectName: project.name,
      unitId: project.unitCode,
      unitCode: project.unitCode,
      price: project.price,
      depositAmount: depositAmount,
      status: 'sale',
      type: 'Giữ chỗ có hoàn lại',
      priority: 'high',
      paymentMethod: 'Chuyển khoản',
      docs: '2/4',
      agent: 'Lê Hoàng Anh',
      time: 'Vừa xong',
      expiresAt: '24 giờ tiếp theo',
      notes: `Booking trực tiếp từ Virtual Tour 360 căn ${project.unitCode}.`
    })

    setBookingModalOpen(false)
    setBookingSuccessToast(true)
    setTimeout(() => setBookingSuccessToast(false), 5000)
  }

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `${(val / 1e9).toFixed(1)} Tỷ VNĐ`
    return `${val.toLocaleString()} VNĐ`
  }

  return (
    <div className={`flex flex-col gap-4 bg-slate-900 text-white min-h-[calc(100vh-4rem)] -m-4 sm:-m-8 p-4 sm:p-6 select-none ${
      isFullscreen ? 'fixed inset-0 z-[100] m-0 p-4 h-screen' : ''
    }`}>
      
      {/* 1. Top Command Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                Virtual Tour 360° & Sa Bàn Số 3D
              </h1>
              <Badge className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono">
                WebXR / Three.js
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Khám phá không gian căn hộ mẫu thực tế ảo 360°, thước đo ảo laser, sa bàn số 3D & kết nối booking tức thì.
            </p>
          </div>
        </div>

        {/* Project Selector Pills & Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {/* Project Picker */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {Object.values(TOUR_PROJECTS).map((proj) => (
              <button
                key={proj.id}
                onClick={() => handleProjectChange(proj.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedProjectId === proj.id 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {proj.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTourMode('tour')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tourMode === 'tour' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              Căn Hộ Mẫu 360°
            </button>
            <button
              onClick={() => setTourMode('masterplan')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                tourMode === 'masterplan' 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Sa Bàn Ảo 3D
            </button>
          </div>

          {/* Action Modals Triggers */}
          <Button 
            size="sm"
            onClick={() => setBookingModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-600/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Giữ Căn Ngay ({project.unitCode})
          </Button>

          <Button 
            size="sm"
            variant="outline"
            onClick={() => setVideoCallModalOpen(true)}
            className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-white text-xs gap-1.5 font-semibold"
          >
            <PhoneCall className="h-3.5 w-3.5 text-indigo-400" />
            Gọi Video 1-1
          </Button>

          <Button 
            size="sm"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-slate-400 hover:text-white p-2"
            title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* 2. Main 3D Experience Viewport */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl relative min-h-[540px] flex flex-col bg-slate-950">
        
        {/* Top Info HUD Bar (Project & Unit Specs) */}
        <div className="absolute top-4 left-4 z-40 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl max-w-md pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
              {project.unitCode}
            </span>
            <span className="font-bold text-sm text-white truncate">{project.unitTitle}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
            <span>DT: <b className="text-white">{project.area} m²</b></span>
            <span>•</span>
            <span>Giá: <b className="text-emerald-400 font-mono">{formatCurrency(project.price)}</b></span>
            <span>•</span>
            <span>Hiện tại: <b className="text-indigo-400">{tourMode === 'tour' ? activeRoom.name : 'Sa bàn tổng thể 3D'}</b></span>
          </div>
        </div>

        {/* Top-Right Quick Utilities (Share, Download, Video) */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2 pointer-events-auto">
          <button 
            onClick={() => setShareModalOpen(true)}
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl transition-all"
            title="Chia sẻ mã QR & Link VR360 cho khách"
          >
            <Share2 className="h-4 w-4" />
          </button>
          <button 
            onClick={() => {
              setFloorPlanDownloadToast(true)
              setTimeout(() => setFloorPlanDownloadToast(false), 3500)
            }}
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:bg-slate-800 shadow-xl transition-all"
            title="Tải Mặt Bằng 2D/3D (PDF)"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>

        {/* Three.js R3F Canvas Container */}
        <div className="flex-1 w-full h-full relative">
          <DynamicPanorama
            projectId={project.id}
            selectedRoom={activeRoom}
            onRoomSelect={handleRoomSelect}
            isAutoRotate={isAutoRotate}
            showMeasurement={showMeasurement}
            showAnnotations={showAnnotations}
            isNightMode={isNightMode}
            ambientAudio={ambientAudio}
            tourMode={tourMode}
            zones={project.zones}
            onSelectZone={handleSelectZone}
            onOpenSpec={handleOpenSpec}
          />
        </div>

        {/* 3. Floating Bottom Toolbar & Room Selector (When in Tour Mode) */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-40 w-[94%] max-w-4xl flex flex-col gap-2 pointer-events-none">
          
          {/* Room Thumbnails Ribbon (Only when in 360 Tour Mode) */}
          {tourMode === 'tour' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-center pointer-events-auto">
              {project.rooms.map((room) => {
                const isActive = room.id === activeRoom.id
                return (
                  <button
                    key={room.id}
                    onClick={() => handleRoomSelect(room.id)}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border backdrop-blur-md transition-all cursor-pointer flex-shrink-0 ${
                      isActive 
                        ? 'bg-indigo-600/90 text-white border-indigo-400 shadow-lg scale-105' 
                        : 'bg-slate-950/75 text-slate-300 border-white/10 hover:bg-slate-900/90 hover:text-white'
                    }`}
                  >
                    <img 
                      src={room.thumbnail} 
                      alt={room.name} 
                      className="w-8 h-8 rounded-lg object-cover border border-white/20" 
                    />
                    <span className="text-xs font-semibold whitespace-nowrap">{room.name}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Master Plan Zones Ribbon (When in Master Plan Mode) */}
          {tourMode === 'masterplan' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar justify-center pointer-events-auto">
              {project.zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneInfo(zone)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer flex-shrink-0 ${
                    selectedZoneInfo?.id === zone.id 
                      ? 'bg-amber-600/90 text-white border-amber-400 shadow-lg scale-105' 
                      : 'bg-slate-950/75 text-slate-300 border-white/10 hover:bg-slate-900/90 hover:text-white'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-xs font-semibold whitespace-nowrap">{zone.name}</span>
                  <Badge className="text-[10px] py-0 px-1 bg-slate-800 text-slate-300 border border-slate-700">
                    Đã bán {zone.soldPercent}%
                  </Badge>
                </button>
              ))}
            </div>
          )}

          {/* Interactive Tools Controller Bar */}
          <div className="bg-slate-950/85 backdrop-blur-md border border-white/15 p-2 rounded-2xl shadow-2xl flex items-center justify-between pointer-events-auto">
            
            {/* Left Controls: Measurements & Annotations */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setShowMeasurement(!showMeasurement)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  showMeasurement 
                    ? 'bg-sky-500 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Bật/Tắt Thước đo Laser 3D"
              >
                <Ruler className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Thước Đo Laser</span>
              </button>

              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  showAnnotations 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Xem Ghi chú Vật liệu Bàn giao"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Vật Liệu Bàn Giao</span>
              </button>
            </div>

            {/* Right Controls: Night mode, Sound, Auto-rotate */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsNightMode(!isNightMode)}
                className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isNightMode 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={isNightMode ? "Chuyển sang Ban ngày" : "Chuyển sang Ban đêm (Sunset / Night)"}
              >
                {isNightMode ? <Sun className="h-4 w-4 text-amber-300" /> : <Moon className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setAmbientAudio(!ambientAudio)}
                className={`p-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  ambientAudio 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={ambientAudio ? "Tắt âm thanh môi trường" : "Bật âm thanh thiên nhiên (Sóng biển / Gió)"}
              >
                {ambientAudio ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isAutoRotate 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title="Tự động xoay góc nhìn 360°"
              >
                <RotateCw className={`h-3.5 w-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Tự Động Quay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Feedback Banners */}
      {bookingSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[700] p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div className="text-xs">
            <div className="font-bold">Đã tạo phiếu Booking giữ chỗ thành công!</div>
            <div className="opacity-90">Mã căn {project.unitCode} đã được chuyển sang trạng thái khóa căn trong rổ hàng.</div>
          </div>
          <Link href="/booking">
            <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-8">
              Xem Booking
            </Button>
          </Link>
        </div>
      )}

      {floorPlanDownloadToast && (
        <div className="fixed bottom-6 right-6 z-[700] p-4 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <Download className="h-5 w-5 flex-shrink-0" />
          <div className="text-xs">
            <div className="font-bold">Đang tải bản vẽ mặt bằng kiến trúc 2D/3D!</div>
            <div className="opacity-90">File: `{project.unitCode}_FloorPlan_Architectural_100.pdf`</div>
          </div>
        </div>
      )}

      {/* 4. MODAL 1: Đặt Cọc Giữ Chỗ Nhanh (Instant Booking) */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col text-slate-200">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Giữ Căn & Khóa Chỗ Tức Thì</h3>
                  <p className="text-xs text-slate-400">Khóa căn trực tiếp từ màn hình Virtual Tour 360°</p>
                </div>
              </div>
              <button onClick={() => setBookingModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Bất động sản:</span>
                  <span className="font-bold text-white">{project.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Mã căn hộ:</span>
                  <span className="font-mono font-bold text-amber-400">{project.unitCode}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Loại hình & Diện tích:</span>
                  <span className="font-semibold text-slate-300">{project.type} ({project.area} m²)</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Giá niêm yết:</span>
                  <span className="font-bold text-emerald-400 text-sm">{formatCurrency(project.price)}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Chọn Khách Hàng Giữ Chỗ (Từ CRM):</label>
                <select
                  value={bookingCustomerId}
                  onChange={(e) => setBookingCustomerId(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:ring-1 focus:ring-emerald-500"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone}) - {c.rank}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Số Tiền Cọc Thiện Chí (VNĐ):</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDepositAmount(100000000)}
                    className={`py-2 rounded-xl font-bold border text-xs cursor-pointer ${
                      depositAmount === 100000000 
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    100.000.000 VNĐ
                  </button>
                  <button
                    type="button"
                    onClick={() => setDepositAmount(200000000)}
                    className={`py-2 rounded-xl font-bold border text-xs cursor-pointer ${
                      depositAmount === 200000000 
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    200.000.000 VNĐ
                  </button>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] leading-relaxed">
                Khóa căn tạm thời trong 24 giờ. Hệ thống sẽ tự động cập nhật giỏ hàng sang trạng thái "Booking" và thông báo đến Trưởng phòng duyệt.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBookingModalOpen(false)}
                  className="border-slate-700 bg-slate-800 text-slate-300"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Xác Nhận Giữ Chỗ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL 2: Chia Sẻ VR Tour (QR Code & Social Link) */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col text-slate-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-base text-white">Chia Sẻ Trải Nghiệm VR 360°</h3>
              </div>
              <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-center">
              {/* Simulated High Quality QR Code */}
              <div className="p-4 bg-white rounded-2xl inline-block shadow-xl mx-auto">
                <div className="w-44 h-44 border-4 border-slate-900 rounded-xl p-2 flex flex-col justify-between items-center relative">
                  <div className="w-full flex justify-between">
                    <div className="w-10 h-10 border-4 border-black bg-black flex items-center justify-center">
                      <div className="w-4 h-4 bg-white"></div>
                    </div>
                    <div className="w-10 h-10 border-4 border-black bg-black flex items-center justify-center">
                      <div className="w-4 h-4 bg-white"></div>
                    </div>
                  </div>
                  <div className="p-1 bg-indigo-600 text-white text-[9px] font-bold rounded">
                    VR 360°
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-10 h-10 border-4 border-black bg-black flex items-center justify-center">
                      <div className="w-4 h-4 bg-white"></div>
                    </div>
                    <div className="w-6 h-6 border-2 border-black bg-black"></div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Quét mã QR bằng Camera điện thoại để trải nghiệm VR 360 xoay chuyển con quay hồi chuyển (Gyroscope).
              </div>

              <div className="flex items-center gap-2">
                <Input 
                  readOnly 
                  value={`https://crm.proptech.vn/vr360?unit=${project.unitCode}&ref=sale_anh`} 
                  className="bg-slate-950 border-slate-800 text-xs text-slate-300 font-mono h-10"
                />
                <Button 
                  size="sm"
                  onClick={handleCopyLink}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-3 font-semibold gap-1"
                >
                  {copySuccess ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copySuccess ? 'Đã sao chép' : 'Copy'}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button 
                  variant="outline"
                  onClick={() => alert("Đã mở ứng dụng Zalo gửi link trực tiếp đến khách hàng!")}
                  className="border-blue-600/40 text-blue-400 hover:bg-blue-600/10 text-xs"
                >
                  Gửi Qua Zalo VIP
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => alert("Đã tạo tin nhắn SMS Brandname kèm link VR!")}
                  className="border-emerald-600/40 text-emerald-400 hover:bg-emerald-600/10 text-xs"
                >
                  Gửi SMS Brandname
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL 3: Chi Tiết Vật Liệu Bàn Giao (Spec Sheet) */}
      {specModalOpen && selectedSpec && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col text-slate-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedSpec.title}</h3>
                  <p className="text-xs text-slate-400">{selectedSpec.subtitle}</p>
                </div>
              </div>
              <button onClick={() => setSpecModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Thương hiệu:</span>
                  <span className="font-bold text-white">{selectedSpec.brand}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Xuất xứ:</span>
                  <span className="font-semibold text-slate-300">{selectedSpec.origin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Chính sách bảo hành:</span>
                  <span className="font-bold text-emerald-400">{selectedSpec.warranty}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-semibold">Mô tả quy chuẩn bàn giao:</span>
                <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                  {selectedSpec.description}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <Button 
                  size="sm"
                  onClick={() => setSpecModalOpen(false)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Đã Hiểu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL 4: Video Call Tư Vấn Trực Tiếp 1-1 (Co-Browsing) */}
      {videoCallModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col text-slate-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-600 text-white rounded-xl">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Tư Vấn Trực Tuyến 1-1 & Co-Browsing VR</h3>
                  <p className="text-xs text-slate-400">Đồng bộ góc quay 360° theo thời gian thực giữa Sale và Khách Hàng</p>
                </div>
              </div>
              <button onClick={() => setVideoCallModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {/* Agent Camera View */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80" 
                    alt="Agent" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[11px] font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                    Chuyên Viên: Lê Hoàng Anh
                  </div>
                </div>

                {/* Customer Camera View */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-slate-500">
                  <User className="h-12 w-12 text-slate-600 mb-2" />
                  <span className="text-xs font-semibold">Khách Hàng: {customers[0]?.name}</span>
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[11px] font-bold text-emerald-400">
                    Đã Kết Nối WebRTC HD
                  </div>
                </div>
              </div>

              <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                <span>
                  Chế độ Co-Browsing đang bật: Mọi thao tác xoay camera, đổi phòng hay đo laser của bạn sẽ được hiển thị đồng bộ trên màn hình khách hàng!
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setVideoCallModalOpen(false)}
                  className="border-slate-700 bg-slate-800 text-slate-300"
                >
                  Kết Thúc Cuộc Gọi
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    alert("Đã gửi lời mời điều khiển VR tour cho khách hàng!")
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                >
                  Trao Quyền Điều Khiển Cho Khách
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL 5: Chi Tiết Phân Khu Sa Bàn Số 3D */}
      {selectedZoneInfo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col text-slate-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">{selectedZoneInfo.name}</h3>
                  <p className="text-xs text-slate-400">{project.name}</p>
                </div>
              </div>
              <button onClick={() => setSelectedZoneInfo(null)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Tổng Quy Mô</span>
                  <span className="font-bold text-sm text-white">{selectedZoneInfo.totalUnits} căn</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Tỷ Lệ Tiêu Thụ</span>
                  <span className="font-bold text-sm text-emerald-400">Đã bán {selectedZoneInfo.soldPercent}%</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Đặc điểm phân khu:</span>
                <p className="text-slate-300 leading-relaxed">{selectedZoneInfo.description}</p>
                <div className="pt-2 text-amber-400 font-mono font-bold">
                  Mức giá rumor: {selectedZoneInfo.priceFrom}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedZoneInfo(null)}
                  className="border-slate-700 bg-slate-800 text-slate-300"
                >
                  Đóng
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    setSelectedZoneInfo(null)
                    setTourMode('tour')
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Khám Phá Căn Hộ Mẫu VR 360°
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
