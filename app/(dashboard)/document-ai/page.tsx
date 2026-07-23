"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ScanLine, UploadCloud, Sparkles, CheckCircle2, 
  RefreshCcw, Save, FileText, ChevronRight
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Customer, Contract } from '@/types'

// Mock Image URL for CCCD (Can be any placeholder or realistic mock)
// We use a generic vector/illustration of an ID card
const ID_CARD_IMAGE = "https://t3.ftcdn.net/jpg/04/23/34/83/360_F_423348301_lH2o0iO0w4qP4C7z724vU8qgVpG7VbY4.jpg"

export default function DocumentAIPage() {
  const { addCustomer, addContract, customers } = useStore()
  
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'completed'>('idle')
  const [formData, setFormData] = useState({
     fullName: '',
     idNumber: '',
     dob: '',
     gender: '',
     address: '',
     issueDate: ''
  })
  
  // Progress animation state
  const [progress, setProgress] = useState(0)
  
  // Feedback states
  const [isSaved, setIsSaved] = useState(false)
  const [isContractCreated, setIsContractCreated] = useState(false)

  const handleUploadClick = () => {
     setScanStatus('scanning')
     setFormData({ fullName: '', idNumber: '', dob: '', gender: '', address: '', issueDate: '' })
     setProgress(0)
     setIsSaved(false)
     setIsContractCreated(false)
  }

  const handleReset = () => {
     setScanStatus('idle')
     setFormData({ fullName: '', idNumber: '', dob: '', gender: '', address: '', issueDate: '' })
     setProgress(0)
     setIsSaved(false)
     setIsContractCreated(false)
  }

  useEffect(() => {
     if (scanStatus === 'scanning') {
        const interval = setInterval(() => {
           setProgress(prev => {
              if (prev >= 100) {
                 clearInterval(interval)
                 setScanStatus('completed')
                 // Auto-fill form magically
                 setFormData({
                    fullName: 'NGUYỄN VĂN A',
                    idNumber: '079090123456',
                    dob: '15/08/1990',
                    gender: 'Nam',
                    address: 'Số 10, Phường Bến Nghé, Quận 1, TP.HCM',
                    issueDate: '20/10/2021'
                 })
                 return 100
              }
              return prev + 2
           })
        }, 50)
        return () => clearInterval(interval)
     }
  }, [scanStatus])

  const handleSaveCustomer = () => {
     addCustomer({
        name: formData.fullName,
        phone: '09' + Math.floor(Math.random() * 100000000),
        email: 'khachhang_ai@email.com',
        rank: 'Tiềm Năng' as any,
        revenue: 0,
        assignedTo: 'Bạn',
        status: 'Khách mới' as any
     })
     setIsSaved(true)
  }

  const handleCreateContract = () => {
     // If not saved yet, save customer first
     if (!isSaved) {
       handleSaveCustomer()
     }
     
     // Generate a fake contract
     addContract({
        customerId: `c${customers.length + 1}`, // Assuming this is the newly created customer's ID
        inventoryId: 'i2b', // A dummy empty inventory ID
        projectId: 'p1',
        value: 12500000000,
        status: 'Chờ duyệt',
        type: 'Hợp đồng đặt cọc',
        paymentProgress: 0,
        signer: formData.fullName
     })
     setIsContractCreated(true)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-emerald-500/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <ScanLine className="h-8 w-8 text-emerald-400" />
            Nhận Diện Giấy Tờ AI (OCR)
          </h1>
          <p className="text-slate-400 mt-2 max-w-2xl">Trích xuất tự động thông tin từ Căn Cước Công Dân (CCCD), Sổ Đỏ, Giấy phép ĐKKD siêu tốc chỉ trong 3 giây.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* LEFT: SCANNER ZONE */}
         <Card className="shadow-lg border-emerald-100 bg-white overflow-hidden flex flex-col h-[600px]">
            <CardHeader className="bg-emerald-50/50 border-b pb-4">
               <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                  <UploadCloud className="h-5 w-5 text-emerald-600" /> Tải Lên Giấy Tờ
               </CardTitle>
               <CardDescription>Hỗ trợ định dạng JPG, PNG, PDF. (Tối đa 5MB)</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 flex-1 flex flex-col items-center justify-center relative bg-slate-100">
               
               {scanStatus === 'idle' && (
                  <div 
                     onClick={handleUploadClick}
                     className="w-full h-full border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50/30 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors"
                  >
                     <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <UploadCloud className="h-10 w-10 text-emerald-500" />
                     </div>
                     <h3 className="font-bold text-slate-800 text-lg">Kéo thả ảnh CCCD vào đây</h3>
                     <p className="text-slate-500 text-sm mt-1">Hoặc nhấp để chọn file từ máy tính</p>
                     
                     <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
                        <Badge variant="outline" className="bg-white">CCCD / CMND</Badge>
                        <Badge variant="outline" className="bg-white">Hộ Chiếu</Badge>
                        <Badge variant="outline" className="bg-white">Sổ Đỏ (GCNQSDĐ)</Badge>
                     </div>
                  </div>
               )}

               {(scanStatus === 'scanning' || scanStatus === 'completed') && (
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                     
                     {/* The ID Card Image */}
                     <div className="relative w-full max-w-[400px] rounded-xl overflow-hidden shadow-2xl ring-4 ring-slate-900 bg-white">
                        <img 
                           src={ID_CARD_IMAGE} 
                           alt="ID Card Mockup" 
                           className={`w-full h-auto object-cover transition-all duration-1000 ${scanStatus === 'completed' ? 'brightness-110 contrast-125' : 'brightness-90 grayscale'}`} 
                        />
                        
                        {/* LASER SCANNER ANIMATION */}
                        {scanStatus === 'scanning' && (
                           <>
                              <div 
                                 className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_5px_rgba(52,211,153,0.6)] z-20"
                                 style={{ top: `${progress}%` }}
                              ></div>
                              <div 
                                 className="absolute left-0 w-full bg-gradient-to-t from-emerald-500/30 to-transparent z-10"
                                 style={{ top: 0, height: `${progress}%` }}
                              ></div>
                              
                              {/* Glowing bounding boxes appearing during scan */}
                              {progress > 20 && <div className="absolute top-[30%] right-[10%] w-[40%] h-[10%] border-2 border-emerald-400 bg-emerald-400/20 rounded animate-pulse"></div>}
                              {progress > 50 && <div className="absolute top-[45%] right-[10%] w-[50%] h-[8%] border-2 border-emerald-400 bg-emerald-400/20 rounded animate-pulse"></div>}
                              {progress > 80 && <div className="absolute top-[70%] right-[10%] w-[60%] h-[15%] border-2 border-emerald-400 bg-emerald-400/20 rounded animate-pulse"></div>}
                           </>
                        )}

                        {/* COMPLETED BOUNDING BOXES (Yellow/Green outlines) */}
                        {scanStatus === 'completed' && (
                           <>
                              <div className="absolute top-[30%] right-[10%] w-[40%] h-[10%] border-[3px] border-amber-400 rounded flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                                 <span className="absolute -top-6 right-0 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded">NAME (99%)</span>
                              </div>
                              <div className="absolute top-[45%] right-[10%] w-[50%] h-[8%] border-[3px] border-amber-400 rounded flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                                 <span className="absolute -top-6 right-0 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded">DOB (98%)</span>
                              </div>
                              <div className="absolute top-[70%] right-[10%] w-[60%] h-[15%] border-[3px] border-amber-400 rounded flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                                 <span className="absolute -top-6 right-0 bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.5 rounded">ADDRESS (95%)</span>
                              </div>
                           </>
                        )}
                     </div>

                     {/* Progress Text overlay */}
                     {scanStatus === 'scanning' && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur text-white px-4 py-2 rounded-full font-mono text-sm shadow-xl flex items-center gap-2">
                           <RefreshCcw className="h-4 w-4 animate-spin text-emerald-400" />
                           Analyzing: {progress}%
                        </div>
                     )}
                  </div>
               )}
            </CardContent>
         </Card>

         {/* RIGHT: AUTO-FILL FORM ZONE */}
         <Card className="shadow-lg h-[600px] flex flex-col relative overflow-hidden">
            {scanStatus === 'completed' && (
               <div className="absolute top-0 right-0 p-4 z-10 pointer-events-none">
                  <div className="animate-bounce bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 flex items-center gap-1 shadow-md">
                     <Sparkles className="h-3 w-3" /> Trích xuất thành công
                  </div>
               </div>
            )}
            
            <CardHeader className="border-b pb-4">
               <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                  <FileText className="h-5 w-5 text-indigo-600" /> Dữ Liệu Bóc Tách
               </CardTitle>
               <CardDescription>Kết quả sẽ tự động điền vào Form dưới đây.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 flex-1 overflow-y-auto space-y-5 relative">
               
               {scanStatus === 'idle' && (
                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                     <div className="text-slate-400 font-medium text-sm flex flex-col items-center gap-2">
                        <ScanLine className="h-8 w-8 text-slate-300" />
                        Đang chờ kết quả nhận diện...
                     </div>
                  </div>
               )}

               <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Họ và Tên</label>
                        <Input 
                           readOnly 
                           value={formData.fullName} 
                           className={`font-bold transition-all duration-700 ${scanStatus === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900 ring-2 ring-emerald-100' : 'bg-slate-50'}`} 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Số CCCD</label>
                        <Input 
                           readOnly 
                           value={formData.idNumber} 
                           className={`font-mono transition-all duration-700 delay-100 ${scanStatus === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900 ring-2 ring-emerald-100' : 'bg-slate-50'}`} 
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Ngày sinh</label>
                        <Input 
                           readOnly 
                           value={formData.dob} 
                           className={`transition-all duration-700 delay-200 ${scanStatus === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900 ring-2 ring-emerald-100' : 'bg-slate-50'}`} 
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Giới tính</label>
                        <Input 
                           readOnly 
                           value={formData.gender} 
                           className={`transition-all duration-700 delay-300 ${scanStatus === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900 ring-2 ring-emerald-100' : 'bg-slate-50'}`} 
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase">Nơi Thường Trú</label>
                     <Input 
                        readOnly 
                        value={formData.address} 
                        className={`transition-all duration-700 delay-500 ${scanStatus === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900 ring-2 ring-emerald-100' : 'bg-slate-50'}`} 
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase">Ngày Cấp</label>
                     <Input 
                        readOnly 
                        value={formData.issueDate} 
                        className={`transition-all duration-700 delay-[600ms] ${scanStatus === 'completed' ? 'bg-emerald-50 border-emerald-200 text-emerald-900 ring-2 ring-emerald-100' : 'bg-slate-50'}`} 
                     />
                  </div>
               </div>

               {scanStatus === 'completed' && (
                  <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                     <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                     <div className="text-sm text-amber-800">
                        <strong>Xác thực thành công.</strong> Dữ liệu đã được bóc tách với độ chính xác 99%. Bạn có thể lưu vào hệ thống hoặc tạo hợp đồng ngay bây giờ.
                     </div>
                  </div>
               )}

            </CardContent>
            
            <div className="p-4 border-t bg-slate-50 flex flex-col md:flex-row justify-end gap-3 shrink-0">
               <Button variant="outline" onClick={handleReset} disabled={scanStatus === 'scanning'}>Làm Lại</Button>
               
               <Button 
                 className={`${isSaved ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-lg`} 
                 disabled={scanStatus !== 'completed' || isSaved}
                 onClick={handleSaveCustomer}
               >
                  {isSaved ? <CheckCircle2 className="h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  {isSaved ? 'Đã Lưu Khách Hàng' : 'Lưu Hồ Sơ Khách Hàng'}
               </Button>
               
               <Button 
                 className={`${isContractCreated ? 'bg-green-600 hover:bg-green-700' : 'bg-emerald-600 hover:bg-emerald-700'} text-white shadow-lg`} 
                 disabled={scanStatus !== 'completed' || isContractCreated}
                 onClick={handleCreateContract}
               >
                  {isContractCreated ? 'Đã Tạo Hợp Đồng' : 'Tạo Hợp Đồng Tự Động'} 
                  {!isContractCreated && <ChevronRight className="h-4 w-4 ml-2" />}
               </Button>
            </div>
         </Card>

      </div>
    </div>
  )
}
