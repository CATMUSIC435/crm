"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Menu, X, LayoutDashboard, LogOut, User, Settings as SettingsIcon } from "lucide-react"
import { NAV_GROUPS } from './sidebar' // Import config from sidebar to reuse

export function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()

  const closeMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8 shadow-sm z-[999] relative">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu (Mobile Only) */}
          <button 
             onClick={() => setIsMobileMenuOpen(true)}
             className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
             <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800">
             {/* Show title conditionally based on screen size to save space */}
             <span className="hidden md:inline">Dashboard Overview</span>
             <span className="md:hidden font-black text-indigo-600">NOVA<span className="text-slate-800">CRM</span></span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 md:gap-5">
          {/* Invisible overlay to catch clicks outside dropdowns */}
          {(isNotifOpen || isProfileOpen) && (
             <div 
                className="fixed inset-0 z-40" 
                onClick={() => { setIsNotifOpen(false); setIsProfileOpen(false); }}
             ></div>
          )}

          <div className="relative z-50">
            <button 
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileOpen(false); }}
              className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors outline-none"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-3 border-b border-slate-100 font-bold text-sm text-slate-800 bg-slate-50">
                  Thông báo mới (3)
                </div>
                <div className="flex flex-col max-h-[300px] overflow-y-auto">
                  <div className="flex flex-col items-start gap-1 p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                    <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-sm text-slate-800">Có Khách hàng mới</span>
                        <span className="text-xs text-slate-400 font-medium">Vừa xong</span>
                    </div>
                    <span className="text-xs text-slate-500">Đại lý F2 vừa đẩy khách Nguyễn Văn A.</span>
                  </div>
                  <div className="flex flex-col items-start gap-1 p-3 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-sm text-slate-800">Hợp đồng #HD921</span>
                        <span className="text-xs text-slate-400 font-medium">1 giờ trước</span>
                    </div>
                    <span className="text-xs text-slate-500">Giám đốc đã ký duyệt. Vui lòng kiểm tra.</span>
                  </div>
                </div>
                <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
                  <button className="text-indigo-600 text-sm font-bold hover:underline">
                    Xem tất cả
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden md:block"></div>
          
          <div className="relative z-50">
            <div 
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotifOpen(false); }}
              className="flex items-center gap-3 cursor-pointer outline-none hover:bg-slate-50 p-1.5 pr-2 rounded-full transition-colors"
            >
               <div className="hidden md:block text-right">
                  <div className="text-sm font-bold text-slate-800">Lê Hoàng Anh</div>
                  <div className="text-xs text-slate-500">Giám đốc (Super Admin)</div>
               </div>
               <Avatar className="h-9 w-9 ring-2 ring-indigo-100 ring-offset-2">
                 <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                 <AvatarFallback className="bg-indigo-600 text-white font-bold">AD</AvatarFallback>
               </Avatar>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-3 border-b border-slate-100 font-bold text-sm text-slate-800 bg-slate-50">
                  Tài khoản của tôi
                </div>
                <div className="p-1 flex flex-col">
                  <button className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md text-sm text-slate-700 w-full text-left font-medium">
                    <User className="h-4 w-4 text-slate-500" /> Hồ sơ cá nhân
                  </button>
                  <button className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-md text-sm text-slate-700 w-full text-left font-medium">
                    <SettingsIcon className="h-4 w-4 text-slate-500" /> Cài đặt hệ thống
                  </button>
                </div>
                <div className="p-1 border-t border-slate-100">
                  <button className="flex items-center gap-2 p-2 hover:bg-red-50 hover:text-red-700 rounded-md text-sm text-red-600 font-bold w-full text-left transition-colors">
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
           {/* Backdrop */}
           <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
              onClick={closeMenu}
           ></div>
           
           {/* Sidebar Panel */}
           <div className="relative flex w-[85%] max-w-[320px] flex-col bg-slate-900 text-slate-300 shadow-2xl h-full animate-in slide-in-from-left duration-300">
              
              {/* Mobile Header */}
              <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6 bg-slate-950">
                <div className="flex items-center gap-2 font-black text-xl text-white tracking-wide">
                   <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                      <LayoutDashboard className="h-5 w-5 text-white" />
                   </div>
                   NOVA<span className="text-indigo-400">CRM</span>
                </div>
                <button onClick={closeMenu} className="p-2 -mr-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
                   <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                 <div className="space-y-8">
                    {NAV_GROUPS.map((group, idx) => (
                       <div key={idx}>
                          <h4 className="px-3 mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                             {group.title}
                          </h4>
                          <ul className="space-y-1.5">
                             {group.links.map((link, linkIdx) => {
                                const Icon = link.icon
                                const isActive = pathname === link.href
                                return (
                                   <li key={linkIdx}>
                                      <Link 
                                         href={link.href} 
                                         onClick={closeMenu}
                                         className={`flex items-center gap-4 rounded-xl px-4 py-3 text-[15px] font-medium transition-all ${
                                            isActive 
                                               ? 'bg-indigo-600 text-white shadow-md' 
                                               : 'hover:bg-slate-800 hover:text-white text-slate-400'
                                         }`}
                                      >
                                         <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                                         {link.label}
                                      </Link>
                                   </li>
                                )
                             })}
                          </ul>
                       </div>
                    ))}
                 </div>
              </nav>
           </div>
        </div>
      )}
    </>
  )
}
