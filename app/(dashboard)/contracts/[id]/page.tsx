"use client"
import React, { use } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  FileSignature, Printer, Download, Mail, ArrowLeft, Building2, 
  User, CheckCircle2, Clock, Landmark, FileText, Paperclip, CheckCircle
} from 'lucide-react'
import { useStore } from "@/store/useStore"
import Link from 'next/link'
import { Timeline } from '@/components/ui/timeline'

function formatCurrency(amount: number) {
  if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(1)} Tỷ`
  }
  return `${(amount / 1e6).toLocaleString()} Tr`
}

export default function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const { contracts, customers, projects, inventory } = useStore()

  // Lấy dữ liệu theo ID
  const contract = contracts.find(c => c.id === resolvedParams.id)
  
  if (!contract) {
    return <div className="p-8 text-center text-muted-foreground">Không tìm thấy hợp đồng.</div>
  }

  const customer = customers.find(c => c.id === contract.customerId)
  const project = projects.find(p => p.id === contract.projectId)
  const unit = inventory.find(i => i.id === contract.inventoryId)

  const paidAmount = (contract.value * (contract.paymentProgress || 0)) / 100
  const remainingAmount = contract.value - paidAmount

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/contracts" className="flex items-center text-sm text-muted-foreground hover:text-blue-600 mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại danh sách Hợp đồng
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Hợp Đồng: {contract.code}</h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-sm">
              {contract.type || 'Hợp đồng mua bán'}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Clock className="h-4 w-4"/> Ngày ký: {contract.date} • Trạng thái: 
            <span className={`font-semibold ${contract.status === 'Đã ký' ? 'text-green-600' : 'text-yellow-600'}`}>
              {contract.status}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="bg-white"><Printer className="h-4 w-4 mr-2" /> In HĐ</Button>
          <Button variant="outline" className="bg-white"><Mail className="h-4 w-4 mr-2" /> Gửi Email</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white"><Download className="h-4 w-4 mr-2" /> Tải bản Scan PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Thông tin Khách hàng */}
          <Card>
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5 text-blue-600"/> Bên B (Khách Hàng Mua)</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarFallback>{customer?.name?.substring(0, 2) || 'KH'}</AvatarFallback>
                </Avatar>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 flex-1">
                  <div>
                    <p className="text-sm text-muted-foreground">Họ và Tên</p>
                    <p className="font-semibold text-lg">{customer?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mã định danh</p>
                    <p className="font-medium">{customer?.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{customer?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{customer?.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin Sản phẩm (BĐS) */}
          <Card>
            <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5 text-blue-600"/> Thông Tin Bất Động Sản</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-sm text-muted-foreground">Dự án</p>
                  <p className="font-semibold text-lg text-primary">{project?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mã Căn (Unit Code)</p>
                  <p className="font-semibold text-lg">{unit?.code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại sản phẩm</p>
                  <p className="font-medium">{unit?.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diện tích</p>
                  <p className="font-medium">{unit?.area} m²</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vị trí</p>
                  <p className="font-medium">{unit?.tower ? `${unit.tower} - Tầng ${unit.floor}` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tiêu chuẩn bàn giao</p>
                  <p className="font-medium">{unit?.handoverStandard || 'Hoàn thiện cơ bản'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin Hợp đồng / Pháp lý */}
          <Card>
             <CardHeader className="border-b bg-muted/20 pb-4">
              <CardTitle className="text-lg flex items-center gap-2"><FileSignature className="h-5 w-5 text-blue-600"/> Thông Tin Pháp Lý</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                 <div>
                  <p className="text-sm text-muted-foreground">Người phụ trách (Bên A)</p>
                  <p className="font-medium">{contract.signer || 'Nguyễn Đại Diện'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nhân viên môi giới (Sale)</p>
                  <p className="font-medium">{customer?.assignedTo || 'Chưa gắn'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hỗ trợ ngân hàng</p>
                  <p className="font-medium">{contract.bankSupport || 'Thanh toán theo tiến độ (Vốn tự có)'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tình trạng công chứng</p>
                  <p className="font-medium text-green-600">Đã hoàn tất</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CỘT PHẢI: TÀI CHÍNH & TÀI LIỆU */}
        <div className="space-y-6">
          
          {/* Thanh toán & Tiến độ */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border-blue-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tiến Độ Thanh Toán</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-1">Tổng Giá Trị Hợp Đồng</p>
                <p className="text-3xl font-bold text-blue-900">{formatCurrency(contract.value)}</p>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-blue-700">Đã thanh toán ({contract.paymentProgress || 0}%)</span>
                  <span className="text-slate-600">Còn lại</span>
                </div>
                <Progress value={contract.paymentProgress || 0} className="h-3 bg-blue-100" />
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-blue-700">{formatCurrency(paidAmount)}</span>
                  <span className="font-medium text-slate-500">{formatCurrency(remainingAmount)}</span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border shadow-sm">
                <h4 className="font-semibold text-sm mb-4">Lịch sử giao dịch</h4>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-green-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <CheckCircle className="w-3 h-3" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded border shadow-sm flex flex-col">
                          <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-sm text-slate-900">Tiền cọc</div>
                          </div>
                          <div className="text-xs text-slate-500">Đã nhận 100 Tr (CK)</div>
                      </div>
                    </div>
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-green-500 text-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <CheckCircle className="w-3 h-3" />
                      </div>
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded border shadow-sm flex flex-col">
                          <div className="flex items-center justify-between space-x-2 mb-1">
                              <div className="font-bold text-sm text-slate-900">Đợt 1</div>
                          </div>
                          <div className="text-xs text-slate-500">Đã nhận 10%</div>
                      </div>
                    </div>
                    {contract.paymentProgress && contract.paymentProgress < 100 && (
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                            <Clock className="w-3 h-3" />
                        </div>
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-50 p-3 rounded border border-dashed flex flex-col">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-sm text-slate-600">Đợt 2</div>
                            </div>
                            <div className="text-xs text-slate-400">Dự kiến 15%</div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hồ sơ đính kèm */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Paperclip className="h-5 w-5"/> Hồ Sơ Đính Kèm (4)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded text-red-600"><FileText className="h-4 w-4"/></div>
                    <div>
                      <p className="text-sm font-medium">BanScan_HopDong.pdf</p>
                      <p className="text-xs text-muted-foreground">2.4 MB • 2 ngày trước</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded text-blue-600"><FileText className="h-4 w-4"/></div>
                    <div>
                      <p className="text-sm font-medium">CCCD_KhachHang.jpg</p>
                      <p className="text-xs text-muted-foreground">1.1 MB • 5 ngày trước</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded text-green-600"><FileText className="h-4 w-4"/></div>
                    <div>
                      <p className="text-sm font-medium">UyNhiemChi_Coc.pdf</p>
                      <p className="text-xs text-muted-foreground">800 KB • 1 tuần trước</p>
                    </div>
                  </div>
                  <Download className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 border-dashed text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                + Tải lên tài liệu mới
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
