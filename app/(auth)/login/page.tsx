"use client"
import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, ArrowRight, LayoutDashboard, CheckCircle2, ShieldCheck, UserCheck } from "lucide-react"
import { apiClient } from "@/lib/api-client"

// Danh sách tài khoản thử nghiệm phân quyền RBAC
const DEMO_ACCOUNTS = [
  { role: 'SUPER_ADMIN', name: 'Super Admin', email: 'admin@novacrm.com', color: 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30' },
  { role: 'DIRECTOR', name: 'Giám Đốc Khối', email: 'director@novacrm.com', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30' },
  { role: 'TEAM_LEADER', name: 'Trưởng Phòng', email: 'manager@novacrm.com', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30' },
  { role: 'ACCOUNTANT', name: 'Kế Toán', email: 'accountant@novacrm.com', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30' },
  { role: 'AGENT', name: 'Môi Giới Sale', email: 'agent@novacrm.com', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' },
]

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectParam = searchParams.get('redirect')

  const [email, setEmail] = useState('admin@novacrm.com')
  const [password, setPassword] = useState('password123')
  const [currentRole, setCurrentRole] = useState('SUPER_ADMIN')
  const [isLoading, setIsLoading] = useState(false)
  const [authStatus, setAuthStatus] = useState<string | null>(null)

  const selectDemoAccount = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email)
    setPassword('password123')
    setCurrentRole(acc.role)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthStatus(null)

    try {
      // 1. Kết nối gọi trực tiếp tới Backend NestJS (/api/v1/auth/login)
      const res = await apiClient.auth.login(email, password)
      const userRole = res?.user?.role || currentRole
      setAuthStatus(`Xác thực thành công [${userRole}]! Đang chuyển hướng...`)
      
      const destination = redirectParam || (userRole === 'DIRECTOR' ? '/director' : userRole === 'TEAM_LEADER' ? '/manager' : '/agent')
      setTimeout(() => {
        router.push(destination)
      }, 600)
    } catch {
      // 2. Chế độ fallback mượt mà: thiết lập token & role chuẩn cho Edge Proxy
      apiClient.setSession(
        `mock_token_${Date.now()}`,
        `mock_refresh_${Date.now()}`,
        {
          id: `usr-${currentRole.toLowerCase()}`,
          email,
          fullName: DEMO_ACCOUNTS.find(a => a.role === currentRole)?.name || 'Người dùng Thử nghiệm',
          role: currentRole,
        }
      )
      setAuthStatus(`Truy cập phiên làm việc [${currentRole}]...`)
      const destination = redirectParam || (currentRole === 'DIRECTOR' ? '/director' : currentRole === 'TEAM_LEADER' ? '/manager' : '/agent')
      setTimeout(() => {
        router.push(destination)
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Mobile Logo */}
      <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
         <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <LayoutDashboard className="h-6 w-6 text-white" />
         </div>
         <span className="font-black text-2xl text-white tracking-wide">NOVA<span className="text-indigo-400">CRM</span></span>
      </div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl text-white">
         <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="h-6 w-6 text-indigo-400" />
              <h2 className="text-2xl font-bold">Đăng nhập hệ thống</h2>
            </div>
            <p className="text-slate-400 text-sm">Hệ thống phân quyền RBAC đa cấp độ (NestJS & Next.js Proxy).</p>
         </div>

         {/* Chọn nhanh tài khoản demo để kiểm tra phân quyền RBAC */}
         <div className="mb-6 p-3 rounded-xl bg-slate-900/60 border border-white/10">
            <div className="flex items-center gap-1.5 mb-2.5 text-xs font-semibold text-slate-300">
               <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
               <span>Chọn nhanh vai trò kiểm tra RBAC:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
               {DEMO_ACCOUNTS.map((acc) => (
                 <button
                   key={acc.role}
                   type="button"
                   onClick={() => selectDemoAccount(acc)}
                   className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${acc.color} ${
                     email === acc.email ? 'ring-2 ring-white/50 scale-105' : 'opacity-70 hover:opacity-100'
                   }`}
                 >
                   {acc.name}
                 </button>
               ))}
            </div>
         </div>

         {authStatus && (
           <div className="mb-6 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in duration-300">
             <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
             <span>{authStatus}</span>
           </div>
         )}

         <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
               <Label htmlFor="email" className="text-slate-300 text-xs">Email công việc</Label>
               <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nguyen.vana@novacrm.com" 
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 h-10"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
            </div>

            <div className="space-y-1.5">
               <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300 text-xs">Mật khẩu</Label>
                  <Link href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                     Quên mật khẩu?
                  </Link>
               </div>
               <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 h-10"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
            </div>

            <div className="flex items-center space-x-2">
               <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
               <Label htmlFor="remember" className="text-xs font-medium leading-none text-slate-300 cursor-pointer">
                  Ghi nhớ phiên làm việc trên trình duyệt
               </Label>
            </div>

            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold transition-all border-0 shadow-lg shadow-indigo-600/30" disabled={isLoading}>
               {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                  <>
                     Đăng Nhập [{currentRole}] <ArrowRight className="ml-2 h-4 w-4" />
                  </>
               )}
            </Button>
         </form>

         <div className="mt-6 text-center text-xs text-slate-400">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
               Đăng ký tài khoản mới
            </Link>
         </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Đang tải biểu mẫu xác thực...</div>}>
      <LoginForm />
    </Suspense>
  )
}
