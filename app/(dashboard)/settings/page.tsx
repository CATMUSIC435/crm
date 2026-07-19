"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import { 
  Settings, Shield, Users, Building2, History, Webhook, DatabaseBackup, Save, 
  Key, Check, Plus, UploadCloud, RefreshCw, Server, AlertTriangle, MonitorStop, CheckCircle
} from 'lucide-react'

// MOCK DATA
const SETTINGS_MENU = [
  { id: 'rbac', label: 'Phân Quyền (RBAC)', icon: <Shield className="h-4 w-4" /> },
  { id: 'multitenant', label: 'Cấu Hình Đa Công Ty', icon: <Building2 className="h-4 w-4" /> },
  { id: 'audit', label: 'Nhật Ký (Audit Log)', icon: <History className="h-4 w-4" /> },
  { id: 'api', label: 'Tích Hợp API / Webhook', icon: <Webhook className="h-4 w-4" /> },
  { id: 'backup', label: 'Sao Lưu & Khôi Phục', icon: <DatabaseBackup className="h-4 w-4" /> },
]

const RBAC_PERMISSIONS = [
  { id: 1, name: 'Xem thông tin Khách hàng', admin: true, manager: true, agent: true, external: false },
  { id: 2, name: 'Sửa thông tin Hợp đồng', admin: true, manager: true, agent: false, external: false },
  { id: 3, name: 'Xuất (Export) Dữ liệu ra Excel', admin: true, manager: false, agent: false, external: false },
  { id: 4, name: 'Tạo Giỏ hàng bán chéo', admin: true, manager: true, agent: true, external: true },
  { id: 5, name: 'Đổi bảng giá dự án', admin: true, manager: false, agent: false, external: false },
]

const AUDIT_LOGS = [
  { id: 1, time: '18:20 19/07/2026', user: 'Lê Hoàng Anh', ip: '192.168.1.45', action: 'EXPORT_CUSTOMERS', detail: 'Tải 500 records khách hàng', status: 'WARNING' },
  { id: 2, time: '17:45 19/07/2026', user: 'Trần Văn Đạt', ip: '113.190.22.1', action: 'UPDATE_CONTRACT', detail: 'Thay đổi giá trị HĐ #HD-928', status: 'SUCCESS' },
  { id: 3, time: '16:30 19/07/2026', user: 'System', ip: '127.0.0.1', action: 'AUTO_BACKUP', detail: 'Sao lưu DB tự động (2.4GB)', status: 'SUCCESS' },
  { id: 4, time: '14:15 19/07/2026', user: 'Nguyễn Tuấn Tú', ip: '14.232.11.89', action: 'FAILED_LOGIN', detail: 'Sai mật khẩu 5 lần', status: 'DANGER' },
]

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState('rbac')

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-4 md:p-6 rounded-2xl shadow-xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
           <Server className="h-48 w-48 text-blue-500 -mt-10 -mr-10" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-500" />
            Cài Đặt Hệ Thống Lõi (Core Settings)
          </h1>
          <p className="text-slate-400 mt-1">Bảng điều khiển tối cao dành cho Super Admin quản trị nền tảng Enterprise.</p>
        </div>
        <div className="flex gap-2 relative z-10">
          <Button variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-white">
             <MonitorStop className="h-4 w-4 mr-2" /> Bảo Trì Hệ Thống
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
             <Save className="h-4 w-4 mr-2" /> Lưu Cấu Hình
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         
         {/* LEFT SIDEBAR MENU */}
         <div className="lg:col-span-1">
            <Card className="shadow-sm sticky top-6">
               <CardContent className="p-4 flex flex-col gap-1">
                  {SETTINGS_MENU.map(menu => (
                     <button
                        key={menu.id}
                        onClick={() => setActiveTab(menu.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-colors text-left ${activeTab === menu.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-600'}`}
                     >
                        <span className={activeTab === menu.id ? 'text-blue-600' : 'text-slate-400'}>{menu.icon}</span>
                        {menu.label}
                     </button>
                  ))}
               </CardContent>
            </Card>
         </div>

         {/* RIGHT CONTENT AREA */}
         <div className="lg:col-span-3">
            
            {/* 1. RBAC */}
            {activeTab === 'rbac' && (
               <Card className="shadow-sm border-blue-200">
                  <CardHeader className="border-b bg-blue-50/50">
                     <CardTitle className="flex items-center gap-2 text-blue-900"><Shield className="h-5 w-5 text-blue-600" /> Ma Trận Phân Quyền (Role-Based Access Control)</CardTitle>
                     <CardDescription>Kiểm soát chặt chẽ ai được phép làm gì trên hệ thống.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 border-b">
                           <tr>
                              <th className="p-4 font-bold text-slate-800">Quyền Hạn (Permissions)</th>
                              <th className="p-4 text-center font-bold text-slate-800"><Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Super Admin</Badge></th>
                              <th className="p-4 text-center font-bold text-slate-800"><Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Manager</Badge></th>
                              <th className="p-4 text-center font-bold text-slate-800"><Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-none">Agent (Sale)</Badge></th>
                              <th className="p-4 text-center font-bold text-slate-800"><Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none">F2 Agency</Badge></th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {RBAC_PERMISSIONS.map(row => (
                              <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                                 <td className="p-4 text-slate-700 font-medium">{row.name}</td>
                                 <td className="p-4 text-center"><Checkbox checked={row.admin} /></td>
                                 <td className="p-4 text-center"><Checkbox checked={row.manager} /></td>
                                 <td className="p-4 text-center"><Checkbox checked={row.agent} /></td>
                                 <td className="p-4 text-center"><Checkbox checked={row.external} /></td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </CardContent>
               </Card>
            )}

            {/* 2. MULTI-TENANT */}
            {activeTab === 'multitenant' && (
               <Card className="shadow-sm">
                  <CardHeader className="border-b">
                     <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5 text-indigo-600" /> Cấu Hình Đa Công Ty (Multi-tenant White-label)</CardTitle>
                     <CardDescription>Biến CRM thành nền tảng SaaS cho thuê. Cài đặt Logo và Domain riêng cho các Sàn liên kết.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 space-y-8">
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Domain */}
                        <div className="space-y-4">
                           <h3 className="font-bold text-slate-800">Cấu hình Tên miền (Domain)</h3>
                           <div>
                              <label className="text-sm font-medium mb-1 block text-slate-600">Tên miền chính thức</label>
                              <Input defaultValue="crm.saigonland.com.vn" />
                              <p className="text-xs text-slate-400 mt-1">Trỏ CNAME về hệ thống máy chủ của chúng tôi.</p>
                           </div>
                           <div>
                              <label className="text-sm font-medium mb-1 block text-slate-600">Tên Sàn / Công Ty</label>
                              <Input defaultValue="Sài Gòn Land JSC" />
                           </div>
                        </div>

                        {/* Branding */}
                        <div className="space-y-4">
                           <h3 className="font-bold text-slate-800">Nhận diện thương hiệu (Branding)</h3>
                           <div>
                              <label className="text-sm font-medium mb-2 block text-slate-600">Logo hệ thống</label>
                              <div className="border-2 border-dashed rounded-lg p-4 md:p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-slate-500">
                                 <UploadCloud className="h-8 w-8 mb-2" />
                                 <span className="text-sm font-bold">Tải lên Logo (PNG/SVG)</span>
                              </div>
                           </div>
                           <div>
                              <label className="text-sm font-medium mb-1 block text-slate-600">Màu chủ đạo (Primary Color Hex)</label>
                              <div className="flex gap-2">
                                 <div className="h-10 w-10 rounded bg-[#4f46e5] border shadow-inner"></div>
                                 <Input defaultValue="#4f46e5" className="font-mono flex-1" />
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
                        <div>
                           <div className="font-bold text-indigo-900">Giấy phép Multi-tenant đang kích hoạt</div>
                           <div className="text-sm text-indigo-700">Bạn đang sử dụng gói Enterprise không giới hạn số lượng Công ty con.</div>
                        </div>
                        <Badge className="bg-indigo-600">Active</Badge>
                     </div>

                  </CardContent>
               </Card>
            )}

            {/* 3. AUDIT LOG */}
            {activeTab === 'audit' && (
               <Card className="shadow-sm">
                  <CardHeader className="border-b">
                     <CardTitle className="flex items-center gap-2"><History className="h-5 w-5 text-slate-800" /> Nhật Ký Hệ Thống (Audit Log)</CardTitle>
                     <CardDescription>Theo dõi mọi hoạt động nhạy cảm trên hệ thống theo thời gian thực.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                     <div className="divide-y">
                        {AUDIT_LOGS.map(log => (
                           <div key={log.id} className="p-4 hover:bg-slate-50 flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row">
                              <div className="flex items-start gap-3">
                                 <div className="mt-1">
                                    {log.status === 'WARNING' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                                    {log.status === 'DANGER' && <AlertTriangle className="h-5 w-5 text-red-500" />}
                                    {log.status === 'SUCCESS' && <CheckCircle className="h-5 w-5 text-green-500" />}
                                 </div>
                                 <div>
                                    <div className="flex items-center gap-2 mb-1">
                                       <span className="font-bold text-slate-800">{log.user}</span>
                                       <Badge variant="outline" className="text-[10px] font-mono">{log.action}</Badge>
                                    </div>
                                    <div className="text-sm text-slate-600">{log.detail}</div>
                                 </div>
                              </div>
                              <div className="text-right shrink-0 text-xs text-slate-500 font-mono">
                                 <div className="mb-1">{log.time}</div>
                                 <div>IP: {log.ip}</div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </CardContent>
                  <CardFooter className="p-4 border-t bg-slate-50 justify-center">
                     <Button variant="ghost" className="text-slate-500 text-sm">Tải thêm dữ liệu cũ...</Button>
                  </CardFooter>
               </Card>
            )}

            {/* 4. API & WEBHOOK */}
            {activeTab === 'api' && (
               <div className="space-y-6">
                  <Card className="shadow-sm">
                     <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-slate-700" /> API Keys</CardTitle>
                        <CardDescription>Tạo khóa bảo mật để kết nối CRM với hệ thống ERP / Kế toán bên thứ ba.</CardDescription>
                     </CardHeader>
                     <CardContent className="p-4 md:p-6">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50 mb-4">
                           <div>
                              <div className="font-bold text-slate-800 mb-1">Production API Key (Kế toán MISA)</div>
                              <div className="font-mono text-xs text-slate-500 blur-sm hover:blur-none transition-all cursor-pointer">sk_prod_89f3a...c9d2110ab</div>
                           </div>
                           <Button variant="outline" size="sm">Thu hồi khóa</Button>
                        </div>
                        <Button className="bg-slate-900 text-white"><Plus className="h-4 w-4 mr-2"/> Khởi tạo API Key Mới</Button>
                     </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm">
                     <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2"><Webhook className="h-5 w-5 text-purple-600" /> Webhooks</CardTitle>
                        <CardDescription>Bắn dữ liệu ra bên ngoài tự động khi có sự kiện (Ví dụ: Có Hợp đồng mới).</CardDescription>
                     </CardHeader>
                     <CardContent className="p-4 md:p-6">
                        <div className="border rounded-lg p-4 mb-4 border-purple-100 bg-purple-50/30">
                           <div className="flex items-center justify-between mb-2">
                              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none">contract.created</Badge>
                              <div className="flex items-center gap-1 text-xs text-green-600 font-bold"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div> Active</div>
                           </div>
                           <div className="text-sm font-mono text-slate-600">POST https://erp.saigonland.com/api/webhooks/crm</div>
                        </div>
                        <Button variant="outline"><Plus className="h-4 w-4 mr-2"/> Thêm Endpoint</Button>
                     </CardContent>
                  </Card>
               </div>
            )}

            {/* 5. BACKUP */}
            {activeTab === 'backup' && (
               <Card className="shadow-sm border-red-100">
                  <CardHeader className="border-b bg-red-50/30">
                     <CardTitle className="flex items-center gap-2 text-red-900"><DatabaseBackup className="h-5 w-5 text-red-600" /> Sao Lưu & Khôi Phục Dữ Liệu</CardTitle>
                     <CardDescription>Điểm lưu trữ an toàn (Snapshot) của toàn bộ Cơ sở dữ liệu Khách hàng và Giao dịch.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6">
                     <div className="flex flex-col md:flex-row gap-6 mb-8">
                        <div className="flex-1 p-4 md:p-6 border rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-center">
                           <DatabaseBackup className="h-10 w-10 text-slate-400 mb-2" />
                           <div className="text-sm text-slate-500 mb-1">Bản sao lưu gần nhất</div>
                           <div className="text-xl font-bold text-slate-800">19/07/2026 02:00 AM</div>
                        </div>
                        <div className="flex-1 p-4 md:p-6 border rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-center">
                           <Server className="h-10 w-10 text-slate-400 mb-2" />
                           <div className="text-sm text-slate-500 mb-1">Dung lượng Database</div>
                           <div className="text-xl font-bold text-slate-800">18.5 GB</div>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                           <div>
                              <div className="font-bold text-slate-800">Manual Backup (Trước khi nâng cấp hệ thống)</div>
                              <div className="text-sm text-slate-500">Dung lượng: 18.5GB • Ngày: 18/07/2026</div>
                           </div>
                           <Button variant="destructive" size="sm"><RefreshCw className="h-4 w-4 mr-2"/> Khôi phục</Button>
                        </div>
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                           <div>
                              <div className="font-bold text-slate-800">Auto Backup (Hàng đêm)</div>
                              <div className="text-sm text-slate-500">Dung lượng: 18.4GB • Ngày: 17/07/2026</div>
                           </div>
                           <Button variant="destructive" size="sm"><RefreshCw className="h-4 w-4 mr-2"/> Khôi phục</Button>
                        </div>
                     </div>

                     <div className="mt-8 pt-6 border-t flex justify-center">
                        <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold w-full md:w-auto shadow-lg shadow-red-600/30">
                           <Save className="h-5 w-5 mr-2" /> Tạo Bản Sao Lưu Ngay (Backup Now)
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            )}

         </div>
      </div>
    </div>
  )
}

// UI Checkbox component
function Checkbox({ checked }: { checked: boolean }) {
   if (checked) {
      return (
         <div className="inline-flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-white shadow">
            <Check className="h-3.5 w-3.5" />
         </div>
      )
   }
   return <div className="inline-block h-5 w-5 rounded border border-slate-300 bg-slate-50"></div>
}
