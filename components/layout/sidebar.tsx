"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, PieChart, Briefcase, Contact, Building, Layers, Map, LineChart as LineChartIcon, Calculator, Megaphone, CheckCircle, FileSignature, ClipboardList, MessageCircle, PhoneCall, FolderOpen, ClipboardCheck, Gift, Crown, CalendarRange, BarChart4, Database, BrainCircuit, Workflow, Trophy, Store, Newspaper, Settings, Smartphone, Puzzle, ScanLine, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'

export const NAV_GROUPS = [
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
      { href: "/market-data", icon: Database, label: "Dữ Liệu Thị Trường" }
    ]
  },
  {
    title: "Marketing & CSKH",
    links: [
      { href: "/marketing", icon: Megaphone, label: "Automation" },
      { href: "/cms", icon: Newspaper, label: "CMS & SEO" },
      { href: "/surveys", icon: ClipboardCheck, label: "Khảo Sát & CSAT" },
      { href: "/loyalty", icon: Crown, label: "Khách Hàng Thân Thiết" },
      { href: "/events", icon: CalendarRange, label: "Sự Kiện & Check-in" },
      { href: "/call-center", icon: PhoneCall, label: "Tổng Đài AI" }
    ]
  },
  {
    title: "Tiện Ích & Vận Hành",
    links: [
      { href: "/tasks", icon: ClipboardList, label: "Công Việc & Lịch" },
      { href: "/documents", icon: FolderOpen, label: "Kho Tài Liệu" },
      { href: "/chat", icon: MessageCircle, label: "Nhắn Tin Nội Bộ" },
      { href: "/workflow", icon: Workflow, label: "Tự Động Hóa (Workflow)" },
      { href: "/mobile", icon: Smartphone, label: "Ứng Dụng Di Động" }
    ]
  },
  {
    title: "AI & Phân Tích",
    links: [
      { href: "/bi", icon: BarChart4, label: "Báo Cáo BI" },
      { href: "/ai-knowledge", icon: BrainCircuit, label: "Trợ Lý AI" },
      { href: "/document-ai", icon: ScanLine, label: "AI Nhận Diện Giấy Tờ" },
      { href: "/mortgage", icon: Calculator, label: "Công Cụ Tài Chính" },
      { href: "/portfolio", icon: LineChartIcon, label: "Quản Lý Đầu Tư" }
    ]
  },
  {
    title: "Kinh Doanh Mở Rộng",
    links: [
      { href: "/referral", icon: Gift, label: "Giới Thiệu (Hoa Hồng)" },
      { href: "/gamification", icon: Trophy, label: "Đua Top & Thành Tích" },
      { href: "/marketplace", icon: Store, label: "Chợ Liên Kết (B2B)" }
    ]
  },
  {
    title: "Quản Trị Hệ Thống",
    links: [
      { href: "/settings", icon: Settings, label: "Cài Đặt Hệ Thống" },
      { href: "/integrations", icon: Puzzle, label: "Chợ Ứng Dụng (Apps)" },
      { href: "/agent", icon: Users, label: "Role: Cá Nhân" },
      { href: "/manager", icon: Briefcase, label: "Role: Manager" },
      { href: "/director", icon: PieChart, label: "Role: Director" }
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Record<number, boolean>>({})

  const toggleGroup = (idx: number) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }))
  }

  return (
    <div className={`hidden relative border-r bg-slate-900 md:flex md:flex-col text-slate-300 transition-all duration-300 ease-in-out z-40 ${isCollapsed ? 'md:w-[80px]' : 'md:w-[280px]'}`}>
      
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 z-50 transition-transform shadow-sm"
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
           {NAV_GROUPS.map((group, idx) => {
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
      
      {/* Bottom Profile Area */}
      <div className={`p-4 border-t border-slate-800 bg-slate-950/50 overflow-hidden whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'flex justify-center px-0' : ''}`}>
         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="h-10 w-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-white shrink-0 cursor-pointer" title={isCollapsed ? "Admin User" : undefined}>
               AD
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                 <div className="text-sm font-bold text-white truncate">Admin User</div>
                 <div className="text-xs text-slate-500 truncate">Super Admin</div>
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
