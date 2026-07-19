"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, ArrowRight, LayoutDashboard } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Giả lập delay mạng
    setTimeout(() => {
      setIsLoading(false)
      router.push('/agent') // Redirect vào trang Agent
    }, 1500)
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
         <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Đăng nhập hệ thống</h2>
            <p className="text-slate-400">Nhập email và mật khẩu của bạn để truy cập bảng điều khiển.</p>
         </div>

         <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
               <Label htmlFor="email" className="text-slate-300">Email công việc</Label>
               <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="nguyen.vana@novacrm.com" 
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 h-11"
                    required
                    defaultValue="admin@novacrm.com"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-300">Mật khẩu</Label>
                  <Link href="#" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                     Quên mật khẩu?
                  </Link>
               </div>
               <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 h-11"
                    required
                    defaultValue="password123"
                  />
               </div>
            </div>

            <div className="flex items-center space-x-2">
               <Checkbox id="remember" className="border-white/20 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600" />
               <Label htmlFor="remember" className="text-sm font-medium leading-none text-slate-300 cursor-pointer">
                  Ghi nhớ đăng nhập
               </Label>
            </div>

            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold transition-all border-0" disabled={isLoading}>
               {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                  <>
                     Đăng Nhập <ArrowRight className="ml-2 h-5 w-5" />
                  </>
               )}
            </Button>
         </form>

         <div className="mt-8 text-center text-sm text-slate-400">
            Chưa có tài khoản?{" "}
            <Link href="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
               Đăng ký ngay
            </Link>
         </div>
      </div>
    </div>
  )
}
