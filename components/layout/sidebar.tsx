"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Users, PieChart, Briefcase, Contact, Building, Layers, Map, Eye, 
  LineChart as LineChartIcon, Calculator, Megaphone, CheckCircle, FileSignature, 
  ClipboardList, MessageCircle, PhoneCall, FolderOpen, ClipboardCheck, Gift, Crown, 
  CalendarRange, BarChart4, Database, BrainCircuit, Workflow, Trophy, Store, Newspaper, 
  Settings, Smartphone, Puzzle, ScanLine, ChevronLeft, ChevronRight, ChevronDown, 
  KeyRound, Gavel, Building2, RefreshCw, Shield 
} from 'lucide-react'
import { apiClient } from '@/lib/api-client'

export interface NavLinkItem {
  href: string
  icon: any
  label: string
  roles?: string[]
}

export interface NavGroupItem {
  title: string
  links: NavLinkItem[]
}

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Tổng Quản Trị',
  ADMIN: 'Quản Trị Viên',
  DIRECTOR: 'Giám Đốc Khối',
  TEAM_LEADER: 'Trưởng Phòng KD',
  ACCOUNTANT: 'Kế Toán Trưởng',
  AGENT: 'Chuyên Viên Sale',
}

export const NAV_GROUPS: NavGroupItem[] = [
  {
    title: "Tổng Quan & Bán Hàng",
    links: [
      { href: "/customers", icon: Contact, label: "Khách Hàng (360)" },
      { href: "/inventory", icon: Layers, label: "Rổ Hàng" },
      { href: "/booking", icon: CheckCircle, label: "Booking Workflow" },
      { href: "/contracts", icon: FileSignature, label: "Hợp Đồng & eSign" }
    ]
  },
  {
    title: "Dự Án & Bản Đồ",
    links: [
      { href: "/projects", icon: Building, label: "Kho Dự Án" },
      { href: "/gis", icon: Map, label: "Bản Đồ GIS" },
      { href: "/panorama", icon: Eye, label: "Sa Bàn & VR 360" },
      { href: "/market-data", icon: Database, label: "Dữ Liệu Thị Trường", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER', 'AGENT'] }
    ]
  },
  {
    title: "Marketing & CSKH",
    links: [
      { href: "/marketing", icon: Megaphone, label: "Automation", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER', 'AGENT'] },
      { href: "/cms", icon: Newspaper, label: "CMS & SEO", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER'] },
      { href: "/surveys", icon: ClipboardCheck, label: "Khảo Sát & CSAT", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER'] },
      { href: "/loyalty", icon: Crown, label: "Khách Hàng Thân Thiết" },
      { href: "/events", icon: CalendarRange, label: "Sự Kiện & Check-in" },
      { href: "/call-center", icon: PhoneCall, label: "Tổng Đài AI", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER', 'AGENT'] }
    ]
  },
  {
    title: "Tiện Ích & Vận Hành",
    links: [
      { href: "/tasks", icon: ClipboardList, label: "Công Việc & Lịch" },
      { href: "/handover", icon: KeyRound, label: "Bàn Giao & Nghiệm Thu", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER', 'ACCOUNTANT'] },
      { href: "/operations", icon: Building2, label: "Vận Hành & Cư Dân", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER'] },
      { href: "/documents", icon: FolderOpen, label: "Kho Tài Liệu" },
      { href: "/chat", icon: MessageCircle, label: "Nhắn Tin Nội Bộ" },
      { href: "/workflow", icon: Workflow, label: "Tự Động Hóa (Workflow)", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER'] },
      { href: "/mobile", icon: Smartphone, label: "Ứng Dụng Di Động" }
    ]
  },
  {
    title: "AI & Phân Tích",
    links: [
      { href: "/bi", icon: BarChart4, label: "Báo Cáo BI", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER', 'ACCOUNTANT'] },
      { href: "/ai-knowledge", icon: BrainCircuit, label: "Trợ Lý AI" },
      { href: "/document-ai", icon: ScanLine, label: "AI Nhận Diện Giấy Tờ" },
      { href: "/mortgage", icon: Calculator, label: "Công Cụ Tài Chính" },
      { href: "/portfolio", icon: LineChartIcon, label: "Quản Lý Đầu Tư", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR'] }
    ]
  },
  {
    title: "Kinh Doanh Mở Rộng",
    links: [
      { href: "/referral", icon: Gift, label: "Giới Thiệu (Hoa Hồng)" },
      { href: "/gamification", icon: Trophy, label: "Đua Top & Thành Tích" },
      { href: "/marketplace", icon: Store, label: "Chợ Liên Kết (B2B)" },
      { href: "/auction", icon: Gavel, label: "Đấu Giá BĐS (VIP)", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER'] },
      { href: "/resale", icon: RefreshCw, label: "Ký Gửi & Thứ Cấp" }
    ]
  },
  {
    title: "Quản Trị Hệ Thống",
    links: [
      { href: "/settings", icon: Settings, label: "Cài Đặt Hệ Thống", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR'] },
      { href: "/integrations", icon: Puzzle, label: "Chợ Ứng Dụng (Apps)", roles: ['SUPER_ADMIN', 'ADMIN'] },
      { href: "/agent", icon: Users, label: "Role: Cá Nhân" },
      { href: "/manager", icon: Briefcase, label: "Role: Manager", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR', 'TEAM_LEADER'] },
      { href: "/director", icon: PieChart, label: "Role: Director", roles: ['SUPER_ADMIN', 'ADMIN', 'DIRECTOR'] }
    ]
  }
]

export function getFilteredNavGroups(role: string = 'SUPER_ADMIN'): NavGroupItem[] {
  // SUPER_ADMIN has full permissions to all modules
  if (role === 'SUPER_ADMIN') {
    return NAV_GROUPS
  }

  return NAV_GROUPS.map(group => {
    const filteredLinks = group.links.filter(link => {
      if (!link.roles || link.roles.length === 0) return true
      return link.roles.includes(role)
    })
    return {
      ...group,
      links: filteredLinks
    }
  }).filter(group => group.links.length > 0)
}

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({})
  const [currentUser, setCurrentUser] = useState<any>({
    fullName: 'Lê Hoàng Anh',
    role: 'SUPER_ADMIN',
    email: 'admin@novacrm.com',
  })

  useEffect(() => {
    const user = apiClient.getUser()
    if (user) {
      setCurrentUser(user)
    }
  }, [])

  const currentRole = currentUser?.role || 'SUPER_ADMIN'
  const filteredNavGroups = getFilteredNavGroups(currentRole)

  const toggleGroup = (idx: number) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  // Get initials for profile avatar
  const getInitials = (name?: string) => {
    if (!name) return 'AD'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  return (
    <div className={`hidden relative border-r bg-slate-900 md:flex md:flex-col text-slate-300 transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'md:w-[80px]' : 'md:w-[280px]'}`}>
      
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 z-50 transition-transform shadow-sm"
        title={isCollapsed ? "Mở rộng menu" : "Thu gọn menu"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className={`flex h-16 shrink-0 items-center border-b border-slate-800 bg-slate-950 font-black text-xl text-white tracking-wide shadow-sm overflow-hidden ${isCollapsed ? 'px-0 justify-center' : 'px-6'}`}>
        <div className="flex items-center gap-2 min-w-max">
           <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <LayoutDashboard className="h-5 w-5 text-white" />
           </div>
           {!isCollapsed && <span>NOVA<span className="text-indigo-400">CRM</span></span>}
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
        <div className="space-y-6 px-3">
           {filteredNavGroups.map((group, idx) => {
              const isGroupCollapsed = collapsedGroups[idx]
              return (
                 <div key={idx}>
                    <h4 
                      onClick={() => !isCollapsed && toggleGroup(idx)}
                      className={`mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 overflow-hidden whitespace-nowrap transition-all duration-300 flex items-center justify-between ${isCollapsed ? 'text-center cursor-default' : 'px-1 cursor-pointer hover:text-slate-300'}`}
                    >
                       <span>{isCollapsed ? '•••' : group.title}</span>
                       {!isCollapsed && (
                         <ChevronDown className={`h-3 w-3 transition-transform ${isGroupCollapsed ? '-rotate-90' : ''}`} />
                       )}
                    </h4>
                    <div className={`overflow-hidden transition-all duration-300 ${isGroupCollapsed && !isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
                       <ul className="space-y-1">
                          {group.links.map((link, linkIdx) => {
                             const Icon = link.icon
                             const isActive = pathname === link.href
                             return (
                                <li key={linkIdx}>
                                   <Link 
                                      href={link.href} 
                                      title={isCollapsed ? link.label : undefined}
                                      className={`flex items-center rounded-lg py-2 transition-all duration-200 ${
                                         isCollapsed ? 'justify-center px-0' : 'gap-3 px-3 text-sm font-medium'
                                      } ${
                                         isActive 
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                                            : 'hover:bg-slate-800 hover:text-white text-slate-400'
                                      }`}
                                   >
                                      <Icon className={`shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                      {!isCollapsed && <span className="truncate">{link.label}</span>}
                                   </Link>
                                </li>
                             )
                          })}
                       </ul>
                    </div>
                 </div>
              )
           })}
        </div>
      </nav>
      
      {/* Bottom Profile Area with Active Role */}
      <div className={`p-4 border-t border-slate-800 bg-slate-950/70 overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'flex justify-center px-0' : ''}`}>
         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div 
              className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-700 to-indigo-500 border-2 border-indigo-400/40 flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-indigo-900/30" 
              title={isCollapsed ? `${currentUser?.fullName || 'Người Dùng'} (${currentRole})` : undefined}
            >
               {getInitials(currentUser?.fullName)}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden flex-1">
                 <div className="text-sm font-bold text-white truncate" title={currentUser?.fullName}>
                   {currentUser?.fullName || 'Lê Hoàng Anh'}
                 </div>
                 <div className="flex items-center gap-1.5 mt-0.5">
                   <Shield className="h-3 w-3 text-indigo-400 shrink-0" />
                   <span className="text-[11px] font-semibold text-indigo-300 truncate">
                     {ROLE_LABELS[currentRole] || currentRole}
                   </span>
                 </div>
              </div>
            )}
         </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #475569;
        }
      `}</style>
    </div>
  )
}
