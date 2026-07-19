"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight, LayoutDashboard, User, Phone } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push('/login')
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
            <h2 className="text-2xl font-bold mb-2">Tạo tài khoản mới</h2>
            <p className="text-slate-400">Vui lòng điền thông tin để bắt đầu trải nghiệm hệ sinh thái.</p>
         </div>

         <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
               <Label htmlFor="name" className="text-slate-300">Họ và Tên</Label>
               <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <Input 
                    id="name" 
                    type="text" 
                    placeholder="Nguyễn Văn A" 
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 h-11"
                    required
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <div className="relative">
                     <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                     <Input 
                       id="email" 
                       type="email" 
                       placeholder="Email" 
                       className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 h-11"
                       required
                     />
                  </div>
               </div>
               
               <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">Số điện thoại</Label>
                  <div className="relative">
                     <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                     <Input 
                       id="phone" 
                       type="tel" 
                       placeholder="0901234567" 
                       className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 h-11"
                       required
                     />
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="password" className="text-slate-300">Mật khẩu</Label>
               <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-slate-500 focus:border-indigo-500 h-11"
                    required
                  />
               </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-base font-semibold transition-all mt-4 border-0" disabled={isLoading}>
               {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                  "Đăng Ký Tài Khoản"
               )}
            </Button>
         </form>

         <div className="mt-8 text-center text-sm text-slate-400">
            Đã có tài khoản?{" "}
            <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
               Đăng nhập ngay
            </Link>
         </div>
      </div>
    </div>
  )
}
