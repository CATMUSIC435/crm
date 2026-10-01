"use client"

import React, { use, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  FileSignature, Printer, Download, Mail, ArrowLeft, Building2, 
  User, CheckCircle2, Clock, Landmark, FileText, Paperclip, CheckCircle,
  ShieldCheck, AlertCircle, Sparkles, Send, Upload, RefreshCw, FileCheck2,
  Calendar, CreditCard, ChevronRight, Check
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/useStore"
import Link from 'next/link'

function formatCurrency(amount: number) {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} Tỷ`
  }
  return `${(amount / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} Triệu`
}

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { 
    contracts, customers, projects, inventory, 
    updateContractStatus, recordContractPayment 
  } = useStore()

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Modals state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFileName, setUploadFileName] = useState('')
  const [uploadCategory, setUploadCategory] = useState('Hợp đồng gốc')

  // Lấy dữ liệu theo ID
  const contract = contracts.find(c => c.id === resolvedParams.id)
  
  if (!contract) {
    return (
      <div className="p-12 text-center text-slate-500">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold">Không tìm thấy hợp đồng!</h2>
        <p className="text-sm mt-1 mb-4">Hồ sơ hợp đồng này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <Link href="/contracts">
          <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-1.5"/> Quay lại danh sách</Button>
        </Link>
      </div>
    )
  }

  const customer = customers.find(c => c.id === contract.customerId)
  const project = projects.find(p => p.id === contract.projectId)
  const unit = inventory.find(i => i.id === contract.inventoryId)

  const paidAmount = (contract.value * (contract.paymentProgress || 0)) / 100
  const remainingAmount = contract.value - paidAmount

  // Handle Mark Installment Paid
  const handlePayInstallment = (installmentNumber: number, milestoneName: string) => {
    recordContractPayment(contract.id, installmentNumber, undefined, `INV-MANUAL-${installmentNumber}0${Date.now().toString().slice(-3)}`)
    showToast(`✅ Đã xác nhận thu thành công Đợt ${installmentNumber} (${milestoneName})!`)
  }

  // Handle Sign/Approve Contract
  const handleApproveContract = () => {
    updateContractStatus(contract.id, 'Đã ký')
    showToast(`🎉 Hợp đồng ${contract.code} đã được phê duyệt và chính thức có hiệu lực pháp lý!`)
  }

  // Handle Send Email
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailModalOpen(false)
    showToast(`📧 Đã gửi thành công hồ sơ HĐ ${contract.code} tới email ${customer?.email || 'khachhang@novacrm.vn'}!`)
  }

  // Handle Upload Attachment
  const handleUploadAttachment = (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploadModalOpen(false)
    showToast(`📎 Đã tải lên thành công tài liệu "${uploadFileName || 'TaiLieuPhapLy.pdf'}" vào hồ sơ hợp đồng!`)
    setUploadFileName('')
  }

  return (
    <div className="flex flex-col gap-6 -m-4 sm:-m-8 p-4 sm:p-8 bg-slate-50/60 dark:bg-slate-950 min-h-screen">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-300">
          <Sparkles className="h-5 w-5 text-amber-400 shrink-0" />
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
        <div>
          <Link href="/contracts" className="flex items-center text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" /> Quay lại danh sách Hợp đồng & Pháp lý
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
              Hợp Đồng: {contract.code}
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
              {contract.type || 'Hợp đồng mua bán'}
            </Badge>
            <Badge className={`border-none text-xs font-semibold ${
              contract.status === 'Đã ký' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {contract.status === 'Đã ký' ? 'Đã Ký Chính Thức' : 'Chờ Phê Duyệt'}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-slate-400"/> Ngày phát hành: <strong className="text-slate-700 dark:text-slate-300">{contract.date}</strong> • Phòng công chứng: <strong className="text-slate-700 dark:text-slate-300">{contract.notaryOffice || 'Văn phòng Công chứng TP.HCM'}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {contract.status === 'Chờ duyệt' && (
            <Button 
              className="text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-100"
              onClick={handleApproveContract}
            >
              <Check className="h-4 w-4 mr-1.5" /> Phê Duyệt & Ký HĐ
            </Button>
          )}

          <Button 
            variant="outline" 
            className="text-xs h-9 bg-white"
            onClick={() => {
              window.print()
              showToast('🖨️ Đang gửi lệnh in văn bản Hợp đồng tới máy in...')
            }}
          >
            <Printer className="h-4 w-4 mr-1.5" /> In Bản Cứng
          </Button>

          <Button 
            variant="outline" 
            className="text-xs h-9 bg-white"
            onClick={() => {
              setEmailSubject(`[Nova CRM] Thông báo Hợp đồng giao dịch BĐS ${contract.code}`)
              setIsEmailModalOpen(true)
            }}
          >
            <Mail className="h-4 w-4 mr-1.5" /> Gửi Email Khách
          </Button>

          <Button 
            className="text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => showToast('📥 Đang tải bản Scan PDF có mộc đỏ và chữ ký số...')}
          >
            <Download className="h-4 w-4 mr-1.5" /> Tải Scan PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ========================================================= */}
        {/* CỘT TRÁI: THÔNG TIN CHI TIẾT & BẢNG TIẾN ĐỘ THU TIỀN      */}
        {/* ========================================================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Khối 1: Bên B (Khách Hàng Mua) */}
          <Card className="shadow-sm border-slate-200/80 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b p-4">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <User className="h-4 w-4 text-blue-600"/> Bên Mua (Bên B) - Chủ Sở Hữu Hợp Pháp
                </span>
                {customer?.rank && (
                  <Badge className="bg-amber-100 text-amber-800 border-none font-bold text-xs">
                    {customer.rank}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-blue-200 text-base font-bold bg-blue-50 text-blue-700 shrink-0">
                  <AvatarFallback>{customer?.name?.substring(0, 2) || 'KH'}</AvatarFallback>
                </Avatar>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Họ và Tên</span>
                    <strong className="text-slate-900 dark:text-slate-100 text-sm block mt-0.5">{customer?.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Mã định danh CRM</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 block mt-0.5">{customer?.code}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Số điện thoại</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mt-0.5">{customer?.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Email liên hệ</span>
                    <span className="text-slate-700 dark:text-slate-300 block mt-0.5">{customer?.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Số CCCD / Hộ chiếu</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block mt-0.5">079088192831</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Địa chỉ thường trú</span>
                    <span className="text-slate-700 dark:text-slate-300 block mt-0.5">Quận 1, TP. Hồ Chí Minh</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Khối 2: Bất Động Sản Chuyển Nhượng */}
          <Card className="shadow-sm border-slate-200/80 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Building2 className="h-4 w-4 text-blue-600"/> Bất Động Sản Chuyển Nhượng (Căn Hộ / Shophouse)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Dự án</span>
                  <strong className="text-blue-700 dark:text-blue-300 text-sm block mt-0.5">{project?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Mã Căn</span>
                  <strong className="text-slate-900 dark:text-slate-50 text-sm block mt-0.5">{unit?.code}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Loại sản phẩm</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 block mt-0.5">{unit?.type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Diện tích</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{unit?.area} m²</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tòa / Tầng</span>
                  <span className="text-slate-700 dark:text-slate-300 block mt-0.5">{unit?.tower ? `${unit.tower} - Tầng ${unit.floor}` : 'Nhà thấp tầng'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Hướng nhà / Ban công</span>
                  <span className="text-slate-700 dark:text-slate-300 block mt-0.5">{unit?.direction || 'Đông Nam'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tiêu chuẩn bàn giao</span>
                  <span className="text-slate-700 dark:text-slate-300 block mt-0.5">{unit?.handoverStandard || 'Hoàn thiện cơ bản'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Giá niêm yết CĐT</span>
                  <strong className="text-slate-900 dark:text-slate-100 text-xs block mt-0.5">{formatCurrency(unit?.price || contract.value)}</strong>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Khối 3: Bảng Phụ Lục Tiến Độ Thanh Toán Chi Tiết */}
          <Card className="shadow-sm border-slate-200/80 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b p-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <CreditCard className="h-4 w-4 text-blue-600"/> Phụ Lục Kế Hoạch & Tiến Độ Thanh Toán Chi Tiết
                </CardTitle>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Lộ trình giải ngân theo tiến độ thi công thực tế tại công trường.
                </p>
              </div>
              <Badge variant="outline" className="text-blue-700 border-blue-200 text-xs">
                {contract.paymentSchedule?.length || 0} Đợt Thanh Toán
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/70 dark:bg-slate-800/60 border-b text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase">
                    <tr>
                      <th className="py-3 px-4 w-[70px]">Đợt</th>
                      <th className="py-3 px-4">Mốc Tiến Độ Xây Dựng</th>
                      <th className="py-3 px-3 text-center w-[80px]">Tỷ Lệ</th>
                      <th className="py-3 px-4 text-right">Số Tiền (VNĐ)</th>
                      <th className="py-3 px-4">Hạn Thu</th>
                      <th className="py-3 px-3 text-center">Trạng Thái</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {contract.paymentSchedule && contract.paymentSchedule.map((s) => {
                      const isPaid = s.status === 'Đã thu'
                      const isDue = s.status === 'Đến hạn'

                      return (
                        <tr key={s.installment} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                            Đợt {s.installment}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-900 dark:text-slate-100 block">{s.milestone}</span>
                            {s.invoiceRef && (
                              <span className="text-[10px] text-slate-400 font-mono">HĐ: {s.invoiceRef}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-blue-700 dark:text-blue-400">
                            {s.percentage}%
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                            {formatCurrency(s.amount)}
                          </td>
                          <td className="py-3 px-4 text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              <span>{s.dueDate}</span>
                            </div>
                            {s.paidDate && (
                              <span className="text-[10px] text-emerald-600 block">Đã thu: {s.paidDate}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {isPaid ? (
                              <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px] font-semibold py-0.5">
                                <Check className="h-2.5 w-2.5 mr-0.5"/> Đã thu
                              </Badge>
                            ) : isDue ? (
                              <Badge className="bg-amber-100 text-amber-800 border-none text-[10px] font-semibold py-0.5 animate-pulse">
                                Đến hạn
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-400 border-slate-200 text-[10px] py-0.5">
                                Chưa đến hạn
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {!isPaid ? (
                              <Button 
                                size="sm" 
                                className="h-7 text-[11px] bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                                onClick={() => handlePayInstallment(s.installment, s.milestone)}
                              >
                                Thu tiền
                              </Button>
                            ) : (
                              <span className="text-emerald-600 text-xs font-semibold flex items-center justify-end gap-1">
                                <CheckCircle className="h-3.5 w-3.5"/> Hoàn tất
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Khối 4: Xem Trước Bản Văn Bản Hợp Đồng (Mock Document Legal Viewer) */}
          <Card className="shadow-sm border-slate-200/80 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <FileText className="h-4 w-4 text-blue-600"/> Xem Trước Văn Bản Pháp Lý (Hợp Đồng Số {contract.code})
              </CardTitle>
              <Badge variant="outline" className="bg-white text-slate-600 text-[11px]">
                Bản Điện Tử Đã Ký Số
              </Badge>
            </CardHeader>
            <CardContent className="p-6 bg-white dark:bg-slate-900 text-xs font-serif leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 border-b">
              
              <div className="text-center space-y-1 pb-4 border-b">
                <p className="font-bold uppercase tracking-wider text-xs">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <p className="font-semibold text-xs italic">Độc lập - Tự do - Hạnh phúc</p>
                <div className="w-24 h-0.5 bg-slate-300 mx-auto my-2"></div>
                <h3 className="font-bold text-base font-sans uppercase pt-2 text-slate-900 dark:text-slate-100">
                  {contract.type?.toUpperCase() || 'HỢP ĐỒNG MUA BÁN BẤT ĐỘNG SẢN'}
                </h3>
                <p className="font-mono text-slate-500 font-sans text-xs">Số: {contract.code}/2024/NOVALAND-HDMB</p>
              </div>

              <div>
                <p className="font-bold font-sans text-slate-900 dark:text-slate-100 uppercase mb-1">CĂN CỨ PHÁP LÝ:</p>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-600 dark:text-slate-400">
                  <li>Căn cứ Bộ luật Dân sự số 91/2015/QH13 và Luật Nhà ở số 27/2023/QH15;</li>
                  <li>Căn cứ Luật Kinh doanh Bất động sản số 29/2023/QH15;</li>
                  <li>Căn cứ Giấy phép xây dựng và hồ sơ quy hoạch chi tiết 1/500 của Dự án {project?.name}.</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg font-sans border">
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100 text-xs">BÊN BÁN (BÊN A):</strong>
                  <p>TẬP ĐOÀN ĐẦU TƯ ĐỊA ỐC NOVALAND</p>
                  <p>Đại diện: {contract.signer || 'Trần Văn Sếp'}</p>
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100 text-xs">BÊN MUA (BÊN B):</strong>
                  <p>Họ tên: {customer?.name}</p>
                  <p>CCCD số: 079088192831</p>
                </div>
              </div>

              <div>
                <p className="font-bold font-sans text-slate-900 dark:text-slate-100 uppercase mb-1">ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG</p>
                <p>
                  Bên A đồng ý bán và chuyển nhượng, Bên B đồng ý mua bất động sản mã hiệu <strong>{unit?.code}</strong> thuộc dự án <strong>{project?.name}</strong>, diện tích sử dụng <strong>{unit?.area} m²</strong>, bàn giao theo tiêu chuẩn <strong>{unit?.handoverStandard || 'Hoàn thiện cơ bản'}</strong>.
                </p>
              </div>

              <div>
                <p className="font-bold font-sans text-slate-900 dark:text-slate-100 uppercase mb-1">ĐIỀU 2: GIÁ BÁN VÀ PHƯƠNG THỨC THANH TOÁN</p>
                <p>
                  Tổng giá trị giao dịch chuyển nhượng là <strong>{formatCurrency(contract.value)}</strong> (Đã bao gồm thuế GTGT và quỹ bảo trì nhà ở). Tiến độ thanh toán được thực hiện theo Phụ lục đính kèm hợp đồng này.
                </p>
              </div>

              <div className="pt-4 flex justify-between items-start font-sans text-center">
                <div className="w-1/2">
                  <strong className="block">ĐẠI DIỆN BÊN B (BÊN MUA)</strong>
                  <p className="text-[11px] text-slate-400 italic mb-12">(Ký và ghi rõ họ tên)</p>
                  <p className="font-bold">{customer?.name}</p>
                </div>
                <div className="w-1/2">
                  <strong className="block">ĐẠI DIỆN BÊN A (BÊN BÁN)</strong>
                  <p className="text-[11px] text-slate-400 italic mb-12">(Ký tên và đóng dấu pháp nhân)</p>
                  <p className="font-bold text-blue-700">{contract.signer || 'Trần Văn Sếp'}</p>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">[ĐÃ KÝ SỐ CA-NOVA-8821]</span>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* ========================================================= */}
        {/* CỘT PHẢI: DÒNG TIỀN, TÍN DỤNG & HỒ SƠ PHÁP LÝ             */}
        {/* ========================================================= */}
        <div className="space-y-6">
          
          {/* Card 1: Dòng tiền & Thu hồi vốn */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-slate-900 dark:to-slate-800 border-blue-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Landmark className="h-4 w-4 text-blue-600"/> Dòng Tiền Thu Hồi Hợp Đồng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block uppercase">Tổng Giá Trị Hợp Đồng</span>
                <div className="text-3xl font-black text-blue-900 dark:text-blue-200 mt-0.5">{formatCurrency(contract.value)}</div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-blue-700 dark:text-blue-300">Đã thu: {formatCurrency(paidAmount)} ({contract.paymentProgress || 0}%)</span>
                  <span className="text-slate-500">Còn lại: {formatCurrency(remainingAmount)}</span>
                </div>
                <Progress value={contract.paymentProgress || 0} className="h-2.5 bg-blue-100 dark:bg-slate-800" />
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tỷ lệ thu hồi:</span>
                  <strong className="text-emerald-600">{contract.paymentProgress || 0}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hạn thanh toán kế tiếp:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {contract.paymentSchedule?.find(s => s.status === 'Đến hạn')?.dueDate || 'Đã hoàn tất'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tiền đợt tới:</span>
                  <strong className="text-blue-700 dark:text-blue-300">
                    {formatCurrency(contract.paymentSchedule?.find(s => s.status === 'Đến hạn')?.amount || 0)}
                  </strong>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Gói Tín Dụng & Ngân Hàng Tài Trợ */}
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="pb-3 border-b bg-slate-50 dark:bg-slate-900 p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
                <ShieldCheck className="h-4 w-4 text-blue-600"/> Gói Vay Tín Dụng & Bảo Lãnh
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Ngân hàng tài trợ:</span>
                <Badge className="bg-blue-100 text-blue-800 border-none font-bold">
                  {contract.bankSupport || 'Vốn tự có'}
                </Badge>
              </div>

              {contract.loanAmount ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Số tiền vay giải ngân:</span>
                    <strong className="text-slate-900 dark:text-slate-100">{formatCurrency(contract.loanAmount)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời hạn vay vốn:</span>
                    <span className="font-semibold">{contract.loanTermYears || 20} năm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hỗ trợ lãi suất 0%:</span>
                    <span className="font-semibold text-emerald-600">{contract.interestSupportMonths || 24} tháng</span>
                  </div>
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-100 text-[11px] text-blue-800 dark:text-blue-300">
                    Chủ đầu tư hỗ trợ toàn bộ lãi suất và ân hạn nợ gốc cho đến khi nhận bàn giao nhà.
                  </div>
                </>
              ) : (
                <p className="text-slate-500 text-xs italic">
                  Khách hàng lựa chọn phương án thanh toán bằng vốn tự có theo tiến độ xây dựng chuẩn.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Hồ Sơ & Tài Liệu Pháp Lý Đính Kèm */}
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="pb-3 border-b bg-slate-50 dark:bg-slate-900 p-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-100">
                <Paperclip className="h-4 w-4 text-blue-600"/> Hồ Sơ Đính Kèm ({contract.attachments?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5">
              {contract.attachments && contract.attachments.map((att) => (
                <div 
                  key={att.id} 
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{att.name}</p>
                      <p className="text-[10px] text-slate-400">{att.category} • {att.size}</p>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-7 w-7 text-slate-400 hover:text-blue-600 shrink-0"
                    onClick={() => showToast(`📥 Đang tải xuống file "${att.name}"...`)}
                    title="Tải về"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}

              <Button 
                variant="outline" 
                className="w-full text-xs h-8 border-dashed text-blue-600 hover:bg-blue-50 mt-2"
                onClick={() => setIsUploadModalOpen(true)}
              >
                + Tải Lên Tài Liệu Mới
              </Button>
            </CardContent>
          </Card>

          {/* Card 4: Thông Tin Nhân Sự Phụ Trách */}
          <Card className="shadow-sm border-slate-200/80 p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Nhân sự quản lý giao dịch</h4>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Chuyên viên Sale:</span>
              <strong className="text-slate-800 dark:text-slate-200">{contract.witnessAgent || customer?.assignedTo || 'Lê Hoàng Anh'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Đại diện ký Bên A:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{contract.signer || 'Trần Văn Sếp'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tình trạng công chứng:</span>
              <span className="font-semibold text-emerald-600">Đã hoàn tất</span>
            </div>
          </Card>

        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: GỬI EMAIL THÔNG BÁO CHO KHÁCH HÀNG              */}
      {/* ========================================================= */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-blue-600">
              <Mail className="h-5 w-5" />
              Gửi Email Thông Báo Hợp Đồng
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSendEmail} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Người nhận</label>
              <Input value={customer?.email || 'khachhang@novacrm.vn'} disabled className="bg-slate-50 text-xs h-9" />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tiêu đề email</label>
              <Input 
                value={emailSubject} 
                onChange={e => setEmailSubject(e.target.value)} 
                className="text-xs h-9" 
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nội dung đính kèm</label>
              <div className="p-3 bg-slate-50 rounded-lg border text-slate-600 space-y-1">
                <p>Kính gửi Quý khách <strong>{customer?.name}</strong>,</p>
                <p>Nova CRM xin gửi bản mềm Hợp đồng mua bán căn hộ <strong>{unit?.code}</strong> thuộc dự án <strong>{project?.name}</strong> kèm phụ lục thanh toán chi tiết.</p>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEmailModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <Send className="h-3.5 w-3.5 mr-1.5"/> Gửi Ngay
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 2: TẢI LÊN TÀI LIỆU MỚI                            */}
      {/* ========================================================= */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-blue-600">
              <Upload className="h-5 w-5" />
              Đính Kèm Tài Liệu Pháp Lý Mới
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUploadAttachment} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tên tệp tài liệu (*)</label>
              <Input 
                placeholder="VD: BienBan_NghiemThu_Dot2.pdf" 
                value={uploadFileName}
                onChange={e => setUploadFileName(e.target.value)}
                required
                className="text-xs h-9" 
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phân loại hồ sơ</label>
              <Input 
                value={uploadCategory}
                onChange={e => setUploadCategory(e.target.value)}
                placeholder="VD: Hợp đồng gốc, CCCD, UNC, Biên bản bàn giao..."
                className="text-xs h-9" 
              />
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Kéo thả tệp PDF, JPG hoặc bấm để chọn tệp</p>
              <p className="text-[10px] text-slate-400 mt-1">Dung lượng tối đa 25MB (Mã hóa SSL 256-bit)</p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsUploadModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Xác Nhận Lưu
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
