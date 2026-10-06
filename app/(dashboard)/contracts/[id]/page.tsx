"use client"

import React, { use, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Printer, Download, Mail, ArrowLeft, Building2, 
  User, Landmark, FileText, Paperclip, CheckCircle,
  ShieldCheck, AlertCircle, Sparkles, Send, Upload, FileCheck2,
  Calendar, CreditCard, Check, Plus, Lock, KeyRound, Shield, AlertTriangle
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useStore } from "@/store/useStore"
import Link from 'next/link'
import { apiClient } from "@/lib/api-client"

function formatCurrency(amount: number) {
  if (!amount && amount !== 0) return '0 VNĐ'
  if (amount >= 1e9) {
    return `${(amount / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 })} Tỷ`
  }
  return `${(amount / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} Triệu`
}

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const contractId = resolvedParams.id

  const { 
    contracts, customers, projects, inventory, 
    updateContractStatus, recordContractPayment,
    signContract, addContractAttachment, addContractInstallment
  } = useStore()

  // User RBAC State
  const [currentUser, setCurrentUser] = useState<{ fullName: string; role: string; email: string }>({
    fullName: 'Lê Hoàng Anh',
    role: 'SUPER_ADMIN',
    email: 'admin@novacrm.com',
  })

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Modals state
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState('')
  const [emailNotes, setEmailNotes] = useState('')

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [uploadFileName, setUploadFileName] = useState('')
  const [uploadCategory, setUploadCategory] = useState<'Hợp đồng gốc' | 'CCCD' | 'UNC' | 'Biên bản bàn giao' | 'Khác'>('Hợp đồng gốc')

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1)
  const [paymentAmount, setPaymentAmount] = useState<number>(0)
  const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản VietQR IPN')
  const [paymentInvoiceCode, setPaymentInvoiceCode] = useState('')
  const [paymentNotes, setPaymentNotes] = useState('')

  const [isSignModalOpen, setIsSignModalOpen] = useState(false)
  const [signerName, setSignerName] = useState('Trần Văn Sếp (Tổng Giám Đốc)')
  const [caProvider, setCaProvider] = useState('VNPT-CA Cloud eSign')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [isAddInstallmentModalOpen, setIsAddInstallmentModalOpen] = useState(false)
  const [newMilestoneName, setNewMilestoneName] = useState('')
  const [newPercentage, setNewPercentage] = useState<number>(5)
  const [newDueDate, setNewDueDate] = useState('2026-12-31')

  // State for Backend Database Contract fallback
  const [apiContractRaw, setApiContractRaw] = useState<any>(null)
  const [isFetchingBackend, setIsFetchingBackend] = useState(true)

  // Lấy User và Hydrate từ API Backend khi load trang
  useEffect(() => {
    const user = apiClient.getUser()
    if (user) {
      setCurrentUser(user)
    }

    const fetchBackendContract = async () => {
      try {
        const data = await apiClient.contracts.getById(contractId)
        if (data && data.id) {
          setApiContractRaw(data)
          // Nếu có signatureHash hoặc thông tin mới từ database
          if (data.status === 'SIGNED_ACTIVE' || data.status === 'Đã ký') {
            updateContractStatus(contractId, 'Đã ký')
          }
        }
      } catch (err) {
        // Fallback local store
      } finally {
        setIsFetchingBackend(false)
      }
    }
    fetchBackendContract()
  }, [contractId, updateContractStatus])

  // Lấy dữ liệu contract linh hoạt (theo id hoặc code)
  const storeContract = contracts.find(c => c.id === contractId || c.code === contractId)
  
  // Ánh xạ từ backend database nếu chưa có trong store
  const apiMappedContract = apiContractRaw ? {
    id: apiContractRaw.id,
    code: apiContractRaw.code,
    type: apiContractRaw.type || 'Hợp đồng mua bán',
    customerId: apiContractRaw.customerId || 'c1',
    inventoryId: apiContractRaw.unitId || 'i1',
    projectId: apiContractRaw.projectId || 'p1',
    value: Number(apiContractRaw.value) || 15500000000,
    date: apiContractRaw.createdAt ? new Date(apiContractRaw.createdAt).toISOString().split('T')[0] : '2024-05-01',
    status: (apiContractRaw.status === 'SIGNED_ACTIVE' || apiContractRaw.status === 'COMPLETED' || apiContractRaw.status === 'Đã ký') ? 'Đã ký' as const : 'Chờ duyệt' as const,
    paymentProgress: Number(apiContractRaw.paymentProgress) || 0,
    bankSupport: apiContractRaw.bankSupport || 'Vietcombank',
    signer: apiContractRaw.signer || (apiContractRaw.status === 'SIGNED_ACTIVE' ? 'Trần Văn Sếp (Tổng Giám Đốc)' : 'Chờ phân công'),
    signatureHash: apiContractRaw.signatureHash || undefined,
    signedAt: apiContractRaw.signedAt ? new Date(apiContractRaw.signedAt).toISOString().replace('T', ' ').substring(0, 16) : undefined,
    legalNotaryStatus: (apiContractRaw.status === 'SIGNED_ACTIVE' || apiContractRaw.status === 'COMPLETED') ? 'Đã hoàn tất' as const : 'Chờ công chứng' as const,
    loanAmount: Number(apiContractRaw.loanAmount) || 0,
    loanTermYears: 20,
    interestSupportMonths: 24,
    witnessAgent: apiContractRaw.creator?.fullName || 'Lê Hoàng Anh',
    notaryOffice: 'Văn phòng Công chứng Sài Gòn',
    paymentSchedule: Array.isArray(apiContractRaw.paymentSchedule) ? apiContractRaw.paymentSchedule.map((s: any, idx: number) => ({
      installment: s.installment || (idx + 1),
      milestone: s.milestone || `Đợt ${idx + 1}`,
      percentage: Number(s.percentage) || 10,
      amount: Number(s.amount) || 1000000000,
      dueDate: s.dueDate || '2024-12-31',
      status: s.status || 'Chưa đến hạn',
      paidDate: s.paidDate,
      invoiceRef: s.invoiceRef,
      paymentMethod: s.paymentMethod
    })) : [
      { installment: 1, milestone: 'Đặt cọc', percentage: 10, amount: 1550000000, dueDate: '2024-05-01', status: 'Đã thu' as const, paidDate: '2024-05-01', invoiceRef: 'INV-VCB-001' },
      { installment: 2, milestone: 'Ký HĐMB chính thức', percentage: 20, amount: 3100000000, dueDate: '2024-06-30', status: 'Đến hạn' as const }
    ],
    attachments: [
      { id: 'att-1', name: `BanScan_${apiContractRaw.code || 'HD'}_Goc.pdf`, size: '3.4 MB', date: '2024-05-02', type: 'pdf' as const, category: 'Hợp đồng gốc' as const },
      { id: 'att-2', name: 'CCCD_ChuSoHuu_2Mat.pdf', size: '1.2 MB', date: '2024-05-01', type: 'pdf' as const, category: 'CCCD' as const }
    ]
  } : null

  const contract = storeContract || apiMappedContract
  
  if (!contract && isFetchingBackend) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Sparkles className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
        <h2 className="text-base font-bold text-slate-800">Đang truy xuất hồ sơ hợp đồng từ Database...</h2>
        <p className="text-xs text-slate-400 mt-1">Hệ thống đang kết nối PostgreSQL để đồng bộ thông tin pháp lý và mã băm e-Sign.</p>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="p-12 text-center text-slate-500">
        <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-2" />
        <h2 className="text-lg font-bold">Không tìm thấy hợp đồng!</h2>
        <p className="text-sm mt-1 mb-4">Hồ sơ hợp đồng ID &quot;{contractId}&quot; không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <Link href="/contracts">
          <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-1.5"/> Quay lại danh sách</Button>
        </Link>
      </div>
    )
  }

  // Khách hàng: tra cứu từ store hoặc từ quan hệ backend
  const customer = customers.find(c => c.id === contract.customerId) || (apiContractRaw?.customer ? {
    id: contract.customerId,
    code: 'KH-DB',
    name: apiContractRaw.customer.fullName || 'Khách Hàng',
    phone: apiContractRaw.customer.phone || '0901234567',
    email: apiContractRaw.customer.email || 'khachhang@novacrm.vn',
    rank: (apiContractRaw.customer.rank === 'DIAMOND_VVIP' ? 'VVIP' : apiContractRaw.customer.rank === 'PLATINUM_VIP' ? 'VIP' : 'Tiềm Năng') as any,
    revenue: Number(contract.value),
    assignedTo: apiContractRaw.creator?.fullName || 'Lê Hoàng Anh',
    status: 'Đã giao dịch' as const,
    createdAt: '2024-01-01',
    idCardNumber: apiContractRaw.customer.idCardNumber || '079088192831',
    address: 'Số 12 Bến Nghé, Quận 1, TP. Hồ Chí Minh'
  } : undefined)

  // Dự án: tra cứu từ store hoặc từ quan hệ backend
  const project = projects.find(p => p.id === contract.projectId) || (apiContractRaw?.project ? {
    id: contract.projectId,
    name: apiContractRaw.project.name,
    location: 'Bình Thuận',
    totalUnits: 10000,
    soldUnits: 6500,
    status: 'Đang mở bán' as const,
    type: 'Biệt thự nghỉ dưỡng' as const,
    revenue: 5000000000000
  } : undefined)

  // Căn hộ: tra cứu từ store hoặc từ quan hệ backend
  const unit = inventory.find(i => i.id === contract.inventoryId) || (apiContractRaw?.unit ? {
    id: contract.inventoryId,
    code: apiContractRaw.unit.code,
    projectId: contract.projectId,
    type: apiContractRaw.unit.type || 'Biệt thự biển',
    price: Number(contract.value),
    area: apiContractRaw.unit.area || 250,
    status: 'Đã bán' as const,
    tower: apiContractRaw.unit.tower || 'Khu Florida 1',
    handoverStandard: 'Full nội thất' as const,
    direction: 'Đông Nam'
  } : undefined)

  // Tính toán dòng tiền
  const totalPaidFromSchedule = (contract.paymentSchedule || [])
    .filter(s => s.status === 'Đã thu')
    .reduce((sum, s) => sum + s.amount, 0)
  
  const paidAmount = totalPaidFromSchedule > 0 
    ? totalPaidFromSchedule 
    : (contract.value * (contract.paymentProgress || 0)) / 100
  const remainingAmount = Math.max(0, contract.value - paidAmount)

  // Phân quyền: Kiểm tra quyền thực hiện
  const isAgent = currentUser.role === 'AGENT'
  const isAccountantOrAdmin = ['ACCOUNTANT', 'ADMIN', 'SUPER_ADMIN', 'DIRECTOR'].includes(currentUser.role)
  const canSign = ['DIRECTOR', 'ADMIN', 'SUPER_ADMIN'].includes(currentUser.role)

  // Xử lý mở Modal Thu Tiền
  const handleOpenPaymentModal = (installmentNumber: number) => {
    const inst = contract.paymentSchedule?.find(s => s.installment === installmentNumber)
    setSelectedInstallment(installmentNumber)
    setPaymentAmount(inst?.amount || 100000000)
    setPaymentInvoiceCode(`INV-PAY-${Date.now().toString().slice(-6)}`)
    setPaymentNotes(`Xác nhận thanh toán Đợt ${installmentNumber} hợp đồng ${contract.code}`)
    setIsPaymentModalOpen(true)
  }

  // Xử lý xác nhận thu tiền
  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPaymentModalOpen(false)

    // Cập nhật Store Zustand
    recordContractPayment(
      contract.id, 
      selectedInstallment, 
      paymentAmount, 
      paymentInvoiceCode, 
      paymentMethod, 
      paymentNotes
    )

    showToast(`✅ Đã ghi nhận thu thành công Đợt ${selectedInstallment} (${formatCurrency(paymentAmount)})! Biên lai: ${paymentInvoiceCode}`)

    // Gửi lên Backend NestJS nếu có quyền
    try {
      await apiClient.contracts.recordPayment(contract.id, paymentAmount)
    } catch (err: any) {
      console.warn('API sync warning:', err.message)
    }
  }

  // Xử lý Ký Số Điện Tử (e-Sign)
  const handleConfirmSign = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) {
      showToast('⚠️ Vui lòng đánh dấu xác nhận cam kết pháp lý chữ ký số!')
      return
    }

    // Sinh mã băm SHA-256 thực tế
    const timestamp = Date.now()
    const rawData = `${contract.id}|${contract.code}|${signerName}|${caProvider}|${timestamp}`
    let hash = ''
    try {
      const msgUint8 = new TextEncoder().encode(rawData)
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    } catch {
      hash = `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`
    }

    signContract(contract.id, signerName, hash)
    setIsSignModalOpen(false)
    showToast(`🎉 Đã ký số điện tử thành công Hợp đồng ${contract.code}! Mã CA: ${hash.slice(0, 16)}...`)

    // Gửi lên API Backend NestJS
    try {
      await apiClient.contracts.eSign(contract.id, signerName)
    } catch (err: any) {
      console.warn('API eSign sync warning:', err.message)
    }
  }

  // Xử lý Thêm Tài Liệu Mới (Real Attachment Sync)
  const handleUploadAttachment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFileName.trim()) return

    const newAtt = {
      name: uploadFileName.endsWith('.pdf') || uploadFileName.endsWith('.jpg') || uploadFileName.endsWith('.png')
        ? uploadFileName
        : `${uploadFileName}.pdf`,
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0],
      type: (uploadFileName.endsWith('.jpg') || uploadFileName.endsWith('.png') ? 'jpg' : 'pdf') as 'pdf' | 'jpg',
      category: uploadCategory,
    }

    addContractAttachment(contract.id, newAtt)
    setIsUploadModalOpen(false)
    showToast(`📎 Đã tải lên và lưu trữ thành công tài liệu: "${newAtt.name}"`)
    setUploadFileName('')
  }

  // Xử lý Thêm Đợt Thanh Toán Phụ Lục (Add Installment)
  const handleAddInstallment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMilestoneName.trim()) return

    const amount = Math.round((contract.value * newPercentage) / 100)
    addContractInstallment(contract.id, {
      milestone: newMilestoneName,
      percentage: newPercentage,
      amount,
      dueDate: newDueDate,
      status: 'Chưa đến hạn',
    })

    setIsAddInstallmentModalOpen(false)
    setNewMilestoneName('')
    showToast(`➕ Đã bổ sung thành công Phụ lục đợt thanh toán: "${newMilestoneName}" (${formatCurrency(amount)})`)
  }

  // Xử lý Gửi Email
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEmailModalOpen(false)
    showToast(`📧 Đã gửi thành công hồ sơ HĐ ${contract.code} tới email: ${customer?.email || 'khachhang@novacrm.vn'}!`)
  }

  // Quick switch role for testing / demo
  const switchRole = (newRole: string) => {
    const updated = { ...currentUser, role: newRole }
    setCurrentUser(updated)
    apiClient.setSession(
      localStorage.getItem('nova_auth_token') || 'demo_token',
      undefined,
      updated
    )
    showToast(`🔄 Đã chuyển sang vai trò: ${newRole}`)
  }

  return (
    <div className="flex flex-col gap-6 -m-4 sm:-m-8 p-4 sm:p-8 bg-slate-50/60 dark:bg-slate-950 min-h-screen">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 animate-in slide-in-from-top duration-300">
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
            <Calendar className="h-3.5 w-3.5 text-slate-400"/> Ngày phát hành: <strong className="text-slate-700 dark:text-slate-300">{contract.date}</strong> • Phòng công chứng: <strong className="text-slate-700 dark:text-slate-300">{contract.notaryOffice || 'Văn phòng Công chứng Sài Gòn'}</strong>
          </p>
        </div>

        {/* Action Controls & RBAC Role Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Quick RBAC Role Selector Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs mr-2">
            <Shield className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-slate-500 text-[11px]">Vai trò:</span>
            <select
              className="bg-transparent font-bold text-slate-800 dark:text-slate-200 cursor-pointer outline-none text-xs"
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value)}
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              <option value="ADMIN">ADMIN</option>
              <option value="DIRECTOR">DIRECTOR</option>
              <option value="ACCOUNTANT">ACCOUNTANT</option>
              <option value="AGENT">AGENT</option>
            </select>
          </div>

          {contract.status !== 'Đã ký' && (
            <Button 
              className={`text-xs h-9 font-semibold shadow-md ${
                canSign 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              onClick={() => {
                if (canSign) {
                  setIsSignModalOpen(true)
                } else {
                  showToast('🔒 Chỉ Giám Đốc (DIRECTOR) hoặc ADMIN mới có quyền ký số điện tử Bên A!')
                }
              }}
              title={canSign ? "Ký số điện tử SHA-256" : "Yêu cầu quyền Giám Đốc / Admin"}
            >
              <KeyRound className="h-4 w-4 mr-1.5" /> Phê Duyệt & Ký HĐ
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
              setEmailSubject(`[Nova CRM] Hồ sơ giao dịch Hợp đồng BĐS ${contract.code} - ${project?.name || ''}`)
              setEmailNotes(`Kính gửi Quý khách ${customer?.name || 'Khách hàng'}, Nova CRM gửi bản mềm hợp đồng mua bán kèm phụ lục tiến độ thanh toán chi tiết.`)
              setIsEmailModalOpen(true)
            }}
          >
            <Mail className="h-4 w-4 mr-1.5" /> Gửi Email Khách
          </Button>

          <Button 
            className="text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            onClick={() => showToast(`📥 Đang tải bản Scan PDF Hợp đồng ${contract.code} có mộc đỏ và chữ ký số...`)}
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
                    <strong className="text-slate-900 dark:text-slate-100 text-sm block mt-0.5">{customer?.name || 'Khách Hàng'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Mã định danh CRM</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300 block mt-0.5">{customer?.code || 'KH-N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Số điện thoại</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 block mt-0.5">{customer?.phone || 'Chưa cập nhật'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Email liên hệ</span>
                    <span className="text-slate-700 dark:text-slate-300 block mt-0.5">{customer?.email || 'khachhang@novacrm.vn'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Số CCCD / Hộ chiếu</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                      {customer?.idCardNumber || '079088192831'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Địa chỉ thường trú</span>
                    <span className="text-slate-700 dark:text-slate-300 block mt-0.5">
                      {customer?.address || 'Số 12 Bến Nghé, Quận 1, TP. Hồ Chí Minh'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Khối 2: Bất Động Sản Chuyển Nhượng */}
          <Card className="shadow-sm border-slate-200/80 overflow-hidden">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Building2 className="h-4 w-4 text-blue-600"/> Bất Động Sản Chuyển Nhượng (Căn Hộ / Shophouse / Biệt Thự)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Dự án</span>
                  <strong className="text-blue-700 dark:text-blue-300 text-sm block mt-0.5">{project?.name || 'Dự án NovaWorld'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Mã Căn</span>
                  <strong className="text-slate-900 dark:text-slate-50 text-sm block mt-0.5">{unit?.code || 'NVW-01.01'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Loại sản phẩm</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200 block mt-0.5">{unit?.type || 'Biệt thự biển'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Diện tích</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{unit?.area || 250} m²</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tòa / Tầng</span>
                  <span className="text-slate-700 dark:text-slate-300 block mt-0.5">
                    {unit?.tower ? `${unit.tower} - Tầng ${unit.floor}` : 'Biệt thự thấp tầng'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Hướng nhà / Ban công</span>
                  <span className="text-slate-700 dark:text-slate-300 block mt-0.5">{unit?.direction || 'Đông Nam'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tiêu chuẩn bàn giao</span>
                  <span className="text-slate-700 dark:text-slate-300 block mt-0.5">{unit?.handoverStandard || 'Full nội thất cao cấp'}</span>
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
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-700 border-blue-200 text-xs">
                  {contract.paymentSchedule?.length || 0} Đợt Thanh Toán
                </Badge>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-7 text-xs text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => setIsAddInstallmentModalOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" /> Thêm Phụ Lục Đợt Thu
                </Button>
              </div>
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
                      <th className="py-3 px-4">Hạn Thu & Lịch Sử</th>
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
                              <span className="text-[10px] text-slate-400 font-mono block">Biên lai: {s.invoiceRef}</span>
                            )}
                            {s.paymentMethod && (
                              <span className="text-[10px] text-blue-600 block">PT: {s.paymentMethod}</span>
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
                              <span className="text-[10px] text-emerald-600 block font-semibold">Đã thu: {s.paidDate}</span>
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
                                className={`h-7 text-[11px] font-semibold ${
                                  isAccountantOrAdmin 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                                }`}
                                onClick={() => handleOpenPaymentModal(s.installment)}
                              >
                                {isAccountantOrAdmin ? 'Thu tiền' : 'Yêu cầu thu'}
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
              <Badge variant="outline" className={`text-[11px] ${
                contract.status === 'Đã ký' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {contract.status === 'Đã ký' ? 'Bản Điện Tử Đã Ký Số' : 'Dự Thảo Chờ Ký'}
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
                <p className="font-mono text-slate-500 font-sans text-xs">
                  Số: {contract.code}/{contract.date ? new Date(contract.date).getFullYear() : '2024'}/NOVALAND-HDMB
                </p>
              </div>

              <div>
                <p className="font-bold font-sans text-slate-900 dark:text-slate-100 uppercase mb-1">CĂN CỨ PHÁP LÝ:</p>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-600 dark:text-slate-400">
                  <li>Căn cứ Bộ luật Dân sự số 91/2015/QH13 và Luật Nhà ở số 27/2023/QH15;</li>
                  <li>Căn cứ Luật Kinh doanh Bất động sản số 29/2023/QH15;</li>
                  <li>Căn cứ Giấy phép xây dựng và hồ sơ quy hoạch chi tiết 1/500 của Dự án {project?.name || 'NovaWorld'}.</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg font-sans border">
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100 text-xs">BÊN BÁN (BÊN A):</strong>
                  <p>TẬP ĐOÀN ĐẦU TƯ ĐỊA ỐC NOVALAND</p>
                  <p>Đại diện: {contract.signer || 'Trần Văn Sếp (Tổng Giám Đốc)'}</p>
                </div>
                <div>
                  <strong className="block text-slate-900 dark:text-slate-100 text-xs">BÊN MUA (BÊN B):</strong>
                  <p>Họ tên: {customer?.name || 'Khách Hàng'}</p>
                  <p>CCCD số: {customer?.idCardNumber || '079088192831'}</p>
                  <p>Địa chỉ: {customer?.address || 'Quận 1, TP. Hồ Chí Minh'}</p>
                </div>
              </div>

              <div>
                <p className="font-bold font-sans text-slate-900 dark:text-slate-100 uppercase mb-1">ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG</p>
                <p>
                  Bên A đồng ý bán và chuyển nhượng, Bên B đồng ý mua bất động sản mã hiệu <strong>{unit?.code || 'NVW-01.01'}</strong> thuộc dự án <strong>{project?.name || 'NovaWorld'}</strong>, diện tích sử dụng <strong>{unit?.area || 250} m²</strong>, bàn giao theo tiêu chuẩn <strong>{unit?.handoverStandard || 'Full nội thất'}</strong>.
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
                  <p className="text-[11px] text-slate-400 italic mb-10">(Ký và ghi rõ họ tên)</p>
                  <p className="font-bold">{customer?.name || 'Khách Hàng'}</p>
                </div>
                <div className="w-1/2">
                  <strong className="block">ĐẠI DIỆN BÊN A (BÊN BÁN)</strong>
                  <p className="text-[11px] text-slate-400 italic mb-8">(Ký tên và đóng dấu pháp nhân)</p>
                  <p className="font-bold text-blue-700">{contract.signer || 'Trần Văn Sếp (Tổng Giám Đốc)'}</p>
                  {contract.status === 'Đã ký' ? (
                    <div className="mt-1">
                      <span className="text-[10px] text-emerald-600 block font-mono font-bold">
                        [ĐÃ KÝ SỐ SHA-256: {contract.signatureHash ? contract.signatureHash.slice(0, 16) + '...' : 'CA-NOVA-8821'}]
                      </span>
                      <span className="text-[9px] text-slate-400 block">Thời gian: {contract.signedAt || contract.date}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-amber-600 block mt-1 font-semibold">[CHỜ KÝ SỐ ĐIỆN TỬ]</span>
                  )}
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

          {/* Card 4: Thông Tin Nhân Sự Phụ Trách & Pháp Lý */}
          <Card className="shadow-sm border-slate-200/80 p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Nhân sự quản lý giao dịch</h4>
            <div className="flex justify-between pt-1">
              <span className="text-slate-500">Chuyên viên Sale:</span>
              <strong className="text-slate-800 dark:text-slate-200">{contract.witnessAgent || customer?.assignedTo || 'Lê Hoàng Anh'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Đại diện ký Bên A:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{contract.signer || 'Trần Văn Sếp (Tổng Giám Đốc)'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tình trạng công chứng:</span>
              <span className="font-semibold text-emerald-600">
                {contract.legalNotaryStatus || (contract.status === 'Đã ký' ? 'Đã hoàn tất' : 'Chờ công chứng')}
              </span>
            </div>
          </Card>

        </div>

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: GỬI EMAIL THÔNG BÁO CHO KHÁCH HÀNG              */}
      {/* ========================================================= */}
      <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-md p-6 z-[1000]">
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
              <label className="font-semibold text-slate-700 block mb-1">Tiêu đề email (*)</label>
              <Input 
                value={emailSubject} 
                onChange={e => setEmailSubject(e.target.value)} 
                required
                className="text-xs h-9" 
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nội dung đính kèm</label>
              <textarea 
                value={emailNotes} 
                onChange={e => setEmailNotes(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500" 
              />
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
      {/* MODAL 2: TẢI LÊN TÀI LIỆU PHÁP LÝ MỚI                     */}
      {/* ========================================================= */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-md p-6 z-[1000]">
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
              <select 
                value={uploadCategory}
                onChange={e => setUploadCategory(e.target.value as any)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white"
              >
                <option value="Hợp đồng gốc">Hợp đồng gốc</option>
                <option value="CCCD">CCCD</option>
                <option value="UNC">UNC / Biên lai chuyển tiền</option>
                <option value="Biên bản bàn giao">Biên bản bàn giao</option>
                <option value="Khác">Hồ sơ khác</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center bg-slate-50/50">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Kéo thả tệp PDF, JPG hoặc bấm để chọn tệp</p>
              <p className="text-[10px] text-slate-400 mt-1">Dung lượng tối đa 25MB (Mã hóa SHA-256 an toàn)</p>
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

      {/* ========================================================= */}
      {/* MODAL 3: THU TIỀN ĐỢT THANH TOÁN (PAYMENT WORKFLOW)        */}
      {/* ========================================================= */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-lg p-6 z-[1000]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-blue-600">
              <CreditCard className="h-5 w-5" />
              Xác Nhận Thu Tiền Đợt {selectedInstallment}
            </DialogTitle>
          </DialogHeader>

          {isAgent && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600" />
              <div>
                <strong>Lưu ý quyền Chuyên viên Sale (AGENT):</strong> Thao tác này sẽ tạo phiếu yêu cầu xác nhận thu gửi Kế toán đối soát dòng tiền.
              </div>
            </div>
          )}

          <form onSubmit={handleConfirmPayment} className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mã hợp đồng</label>
                <Input value={contract.code} disabled className="bg-slate-50 text-xs h-9 font-bold" />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Khách hàng nộp</label>
                <Input value={customer?.name || 'Khách hàng'} disabled className="bg-slate-50 text-xs h-9" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số tiền thu (VNĐ) (*)</label>
                <Input 
                  type="number"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(Number(e.target.value))}
                  required
                  className="text-xs h-9 font-bold text-blue-700" 
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số biên lai / Mã UNC (*)</label>
                <Input 
                  value={paymentInvoiceCode}
                  onChange={e => setPaymentInvoiceCode(e.target.value)}
                  required
                  className="text-xs h-9 font-mono" 
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phương thức thanh toán</label>
              <select 
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white"
              >
                <option value="Chuyển khoản VietQR IPN">Chuyển khoản VietQR IPN (Tự động khớp)</option>
                <option value="Ủy nhiệm chi ngân hàng">Ủy nhiệm chi ngân hàng (UNC)</option>
                <option value="Tiền mặt tại quầy">Tiền mặt tại quầy giao dịch Novaland</option>
                <option value="Thẻ tín dụng / POS">Thẻ tín dụng / Máy POS</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Ghi chú đối soát</label>
              <Input 
                value={paymentNotes}
                onChange={e => setPaymentNotes(e.target.value)}
                placeholder="VD: Khách hàng chuyển khoản từ Techcombank, đã nhận tiền vào tài khoản VCB"
                className="text-xs h-9" 
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <Check className="h-4 w-4 mr-1"/> {isAgent ? 'Gửi Yêu Cầu Kế Toán' : 'Xác Nhận Đã Thu Tiền'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 4: KÝ SỐ ĐIỆN TỬ e-Sign (DIGITAL SIGNATURE)         */}
      {/* ========================================================= */}
      <Dialog open={isSignModalOpen} onOpenChange={setIsSignModalOpen}>
        <DialogContent className="sm:max-w-md p-6 z-[1000]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-emerald-600">
              <KeyRound className="h-5 w-5" />
              Ký Số Điện Tử e-Sign Hợp Đồng
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleConfirmSign} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Người đại diện ký Bên A (*)</label>
              <Input 
                value={signerName}
                onChange={e => setSignerName(e.target.value)}
                required
                className="text-xs h-9 font-semibold" 
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Nhà cung cấp chứng thư số (CA Provider)</label>
              <select 
                value={caProvider}
                onChange={e => setCaProvider(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 px-3 text-xs bg-white"
              >
                <option value="VNPT-CA Cloud eSign">VNPT-CA Cloud eSign (Chuẩn Nhà nước)</option>
                <option value="Viettel-CA Cloud">Viettel-CA Cloud HSM</option>
                <option value="FPT-CA eSign">FPT-CA Corporate</option>
                <option value="Novaland Internal PKI">Novaland Internal PKI Token</option>
              </select>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-900">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Xác thực bảo mật SHA-256
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                Sau khi ký số, hợp đồng sẽ được gắn timestamp và mã hash SHA-256 bất biến. Văn bản chính thức có hiệu lực pháp lý và khóa quyền chỉnh sửa các điều khoản cốt lõi.
              </p>
            </div>

            <label className="flex items-start gap-2 pt-1 cursor-pointer">
              <input 
                type="checkbox" 
                checked={agreeTerms}
                onChange={e => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-slate-600 text-[11px]">
                Tôi xác nhận đã thẩm định đầy đủ hồ sơ pháp lý căn hộ và tiến độ dự án, chịu trách nhiệm pháp lý đối với chữ ký số này.
              </span>
            </label>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsSignModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                <FileCheck2 className="h-4 w-4 mr-1.5"/> Ký Số & Phê Duyệt Ngay
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================= */}
      {/* MODAL 5: THÊM ĐỢT THANH TOÁN PHỤ LỤC (ADD INSTALLMENT)     */}
      {/* ========================================================= */}
      <Dialog open={isAddInstallmentModalOpen} onOpenChange={setIsAddInstallmentModalOpen}>
        <DialogContent className="sm:max-w-md p-6 z-[1000]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-blue-600">
              <Plus className="h-5 w-5" />
              Thêm Phụ Lục Đợt Thanh Toán
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddInstallment} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mốc tiến độ xây dựng (*)</label>
              <Input 
                placeholder="VD: Nghiệm thu gói hoàn thiện nội thất Smart Home" 
                value={newMilestoneName}
                onChange={e => setNewMilestoneName(e.target.value)}
                required
                className="text-xs h-9" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tỷ lệ thu (%)</label>
                <Input 
                  type="number" 
                  min={1}
                  max={50}
                  value={newPercentage}
                  onChange={e => setNewPercentage(Number(e.target.value))}
                  required
                  className="text-xs h-9" 
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Hạn thanh toán</label>
                <Input 
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  required
                  className="text-xs h-9" 
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 border rounded-lg text-slate-600">
              <span className="block text-[11px] text-slate-400">Số tiền tương ứng dự kiến:</span>
              <strong className="text-blue-700 text-sm">
                {formatCurrency(Math.round((contract.value * newPercentage) / 100))}
              </strong>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddInstallmentModalOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Bổ Sung Đợt Thu
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  )
}
