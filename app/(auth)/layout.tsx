import React from "react";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-slate-900 relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      
      {/* Left side: Branding / Marketing (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative z-10 border-r border-white/10 bg-slate-950/50 backdrop-blur-sm">
         <div>
            <div className="flex items-center gap-2 mb-12">
               <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <LayoutDashboard className="h-6 w-6 text-white" />
               </div>
               <span className="font-black text-2xl tracking-wide">NOVA<span className="text-indigo-400">CRM</span></span>
            </div>
            
            <h1 className="text-4xl font-bold leading-tight mb-6">
              Nền tảng Quản trị Bất Động Sản Toàn Diện Nhất
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Tối ưu hóa quy trình bán hàng, tự động hóa marketing, và nâng cao trải nghiệm khách hàng với hệ sinh thái AI thông minh.
            </p>
         </div>
         
         <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
            <span>© 2026 NOVACRM Inc.</span>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">Bảo mật</Link>
            <span>•</span>
            <Link href="#" className="hover:text-white transition-colors">Điều khoản</Link>
         </div>
      </div>

      {/* Right side: Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
         {children}
      </div>
    </div>
  );
}
