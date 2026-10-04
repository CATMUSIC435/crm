"use client"
import React, { useState, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { IntegrationApp, WebhookItem, ApiKeyItem, ApiAuditLog } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Blocks, Puzzle, MessageCircle, Briefcase, Layers, Server, 
  QrCode, CreditCard, ShieldCheck, PenTool, Phone, MapPin, 
  HardDrive, CheckCircle2, Plus, Search, Key, RefreshCw, 
  Play, Copy, ExternalLink, X, Download, AlertCircle, Check, 
  Activity, ArrowUpRight, Lock, Settings2, Send, Terminal, 
  FileCode, Trash2, Filter, Sparkles, Clock, Globe, Zap
} from 'lucide-react'

export default function IntegrationsPage() {
  const { 
    integrationApps, 
    webhooks, 
    apiKeys, 
    apiAuditLogs,
    toggleIntegrationConnection, 
    updateIntegrationConfig, 
    addApiKey, 
    revokeApiKey, 
    toggleWebhookStatus,
    addIntegrationApp
  } = useStore()

  // Tab & Filters
  const [activeTab, setActiveTab] = useState<'directory' | 'webhooks' | 'keys' | 'audit'>('directory')
  const [directoryCategory, setDirectoryCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [auditFilterStatus, setAuditFilterStatus] = useState<string>('all')

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // Modals state
  const [selectedAppForConfig, setSelectedAppForConfig] = useState<IntegrationApp | null>(null)
  const [showCreateKeyModal, setShowCreateKeyModal] = useState<boolean>(false)
  const [selectedWebhookPayloadModal, setSelectedWebhookPayloadModal] = useState<WebhookItem | null>(null)
  const [showRequestIntegrationModal, setShowRequestIntegrationModal] = useState<boolean>(false)
  const [showVietQrConfigModal, setShowVietQrConfigModal] = useState<boolean>(false)

  // Config Form State for Modal 1
  const [configEndpoint, setConfigEndpoint] = useState<string>('')
  const [configApiKey, setConfigApiKey] = useState<string>('')
  const [isTestingPing, setIsTestingPing] = useState<boolean>(false)
  const [pingResult, setPingResult] = useState<{ status: 'success' | 'error', latency: number, message: string } | null>(null)

  // Create Key Form State for Modal 2
  const [newKeyName, setNewKeyName] = useState<string>('Khóa Tích Hợp Landing Page Aqua City')
  const [newKeyPerms, setNewKeyPerms] = useState<ApiKeyItem['permissions']>('read_write')
  const [newKeyIp, setNewKeyIp] = useState<string>('14.161.22.88, 103.20.10.45')
  const [newKeyExpires, setNewKeyExpires] = useState<string>('2027-01-01')

  // Webhook Simulator State in Tab 2
  const [selectedSimEvent, setSelectedSimEvent] = useState<string>('booking.deposited')
  const [simTargetUrl, setSimTargetUrl] = useState<string>('https://accounting.novaland.com.vn/misa/sync-deposit')
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState<boolean>(false)
  const [simWebhookResponse, setSimWebhookResponse] = useState<{ status: number, latencyMs: number, body: string } | null>(null)

  // Request Integration Form State for Modal 4
  const [reqAppName, setReqAppName] = useState<string>('Phần Mềm Quản Trị Khách Sạn Opera Cloud')
  const [reqAppDesc, setReqAppDesc] = useState<string>('Tích hợp kiểm tra phòng trống và đồng bộ hóa đơn khách sạn Centara Mirage Phan Thiết.')
  const [reqPriority, setReqPriority] = useState<string>('high')

  // VietQR Form State for Modal 5
  const [vietQrBank, setVietQrBank] = useState<string>('Vietcombank - CN Tân Bình')
  const [vietQrAccNo, setVietQrAccNo] = useState<string>('0071009988776')
  const [vietQrAccName, setVietQrAccName] = useState<string>('CONG TY CP TAP DOAN NOVALAND')
  const [vietQrSyntax, setVietQrSyntax] = useState<string>('[MÃ CĂN] - [HỌ TÊN] - [ĐỢT N]')

  // Open config modal with current values
  const handleOpenConfig = (app: IntegrationApp) => {
    setSelectedAppForConfig(app)
    setConfigEndpoint(app.endpoint || `https://api.novacrm.vn/v1/${app.id}/endpoint`)
    setConfigApiKey(app.apiKey || `nova_sec_${app.id}_88f99a1`)
    setPingResult(null)
    setIsTestingPing(false)
  }

  // Handle Testing Ping Handshake
  const handleTestPing = () => {
    setIsTestingPing(true)
    setPingResult(null)
    setTimeout(() => {
      setIsTestingPing(false)
      const latency = Math.floor(Math.random() * 45) + 65
      setPingResult({
        status: 'success',
        latency,
        message: `HTTP 200 OK - Handshake thành công trong ${latency}ms (TLS 1.3 / OAuth 2.0)`
      })
      showToast(`Ping thành công! Độ trễ phản hồi: ${latency}ms`)
    }, 900)
  }

  // Save config
  const handleSaveConfig = () => {
    if (!selectedAppForConfig) return
    updateIntegrationConfig(selectedAppForConfig.id, configEndpoint, configApiKey)
    setSelectedAppForConfig(null)
    showToast(`Đã lưu cấu hình và kết nối thành công: ${selectedAppForConfig.name}!`)
  }

  // Handle Health Check All
  const handleHealthCheckAll = () => {
    showToast('Đang bắt đầu quét Ping kiểm tra toàn bộ 12 cổng kết nối...')
    setTimeout(() => {
      showToast('12/12 Cổng tích hợp trực tuyến! SLA 99.98% - Độ trễ TB: 112ms')
    }, 1200)
  }

  // Handle Simulate Webhook
  const handleSimulateWebhook = () => {
    setIsSimulatingWebhook(true)
    setSimWebhookResponse(null)
    setTimeout(() => {
      setIsSimulatingWebhook(false)
      const latencyMs = Math.floor(Math.random() * 50) + 75
      setSimWebhookResponse({
        status: 200,
        latencyMs,
        body: JSON.stringify({
          success: true,
          event: selectedSimEvent,
          deliveryId: `del_${Date.now()}`,
          timestamp: new Date().toISOString(),
          responseCode: "HTTP_200_OK",
          message: "Destination server successfully received and parsed webhook payload"
        }, null, 2)
      })
      showToast(`Đã phát sự kiện "${selectedSimEvent}" thành công (200 OK - ${latencyMs}ms)!`)
    }, 850)
  }

  // Handle Create API Key
  const handleCreateApiKey = () => {
    const randomHex = Math.random().toString(16).substring(2, 6)
    const randomEnd = Math.random().toString(16).substring(2, 6)
    const prefix = `nova_live_${randomHex}`
    const keyMasked = `${prefix}****************************${randomEnd}`

    addApiKey({
      name: newKeyName,
      prefix,
      keyMasked,
      permissions: newKeyPerms,
      ipWhitelist: newKeyIp || 'Any (*)',
      expiresAt: newKeyExpires,
      status: 'active'
    })

    setShowCreateKeyModal(false)
    showToast(`Đã tạo thành công API Key mới: "${newKeyName}"!`)
  }

  // Handle Export CSV
  const handleExportCSV = () => {
    const csvHeader = "\uFEFFMã Dịch Vụ,Tên Dịch Vụ,Phân Loại,Trạng Thái,Nhà Cung Cấp,Lượt Gọi 24h,Độ Trễ (ms),Lần Đồng Bộ Cuối\n"
    const csvRows = integrationApps.map(app => {
      return `"${app.id}","${app.name}","${app.category}","${app.connected ? 'Đã kết nối' : 'Chưa kết nối'}","${app.provider}","${app.requestCount24h || 0}","${app.latencyMs || 0}","${app.lastSync || 'N/A'}"`
    }).join("\n")

    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `BaoCao_TichHop_API_ERP_NovaCRM_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất thành công file báo cáo kiểm toán tích hợp hệ thống CSV!')
  }

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return integrationApps.filter(app => {
      const matchCat = directoryCategory === 'all' || app.category === directoryCategory
      const matchSearch = searchQuery === '' || 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.provider.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [integrationApps, directoryCategory, searchQuery])

  // Filtered Audit Logs
  const filteredAuditLogs = useMemo(() => {
    return apiAuditLogs.filter(log => {
      if (auditFilterStatus === '2xx') return log.statusCode >= 200 && log.statusCode < 300
      if (auditFilterStatus === '4xx') return log.statusCode >= 400
      return true
    })
  }, [apiAuditLogs, auditFilterStatus])

  // Macro Counters
  const connectedCount = integrationApps.filter(a => a.connected).length
  const activeWebhooksCount = webhooks.filter(w => w.active).length

  // Helper render App Icon
  const renderAppIcon = (iconName: string, className = "h-6 w-6") => {
    switch (iconName) {
      case 'MessageCircle': return <MessageCircle className={`${className} text-blue-500`} />
      case 'Briefcase': return <Briefcase className={`${className} text-emerald-600`} />
      case 'Layers': return <Layers className={`${className} text-indigo-500`} />
      case 'Server': return <Server className={`${className} text-blue-700`} />
      case 'QrCode': return <QrCode className={`${className} text-fuchsia-600`} />
      case 'CreditCard': return <CreditCard className={`${className} text-rose-500`} />
      case 'ShieldCheck': return <ShieldCheck className={`${className} text-teal-600`} />
      case 'PenTool': return <PenTool className={`${className} text-blue-600`} />
      case 'Phone': return <Phone className={`${className} text-green-500`} />
      case 'MapPin': return <MapPin className={`${className} text-red-500`} />
      case 'HardDrive': return <HardDrive className={`${className} text-amber-500`} />
      default: return <Puzzle className={`${className} text-indigo-600`} />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Toast Notification Header */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[999] bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-xs font-semibold animate-in slide-in-from-top-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER HERO SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-950 p-6 md:p-8 rounded-2xl shadow-xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none"></div>
        <div className="relative z-10 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="p-2 bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 rounded-xl">
              <Blocks className="h-6 w-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Cổng Tích Hợp API, Webhook & ERP Doanh Nghiệp
            </h1>
            <Badge className="bg-indigo-600 text-white text-xs border-0 py-0.5">
              OpenAPI 3.1 & OAuth 2.0
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Hạ tầng kết nối đồng bộ CRM với hệ thống ERP Kế toán (MISA, FAST, SAP), Cổng gạch nợ VietQR PRO 24/7, Cổng Zalo ZNS, Ký số VNPT SmartCA và Webhooks dữ liệu thời gian thực.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Button 
              size="sm"
              onClick={() => setShowCreateKeyModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer text-xs h-9"
            >
              <Key className="h-4 w-4 mr-1.5" /> Tạo Khóa API Mới
            </Button>

            <Button 
              size="sm"
              variant="outline"
              onClick={handleHealthCheckAll}
              className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white cursor-pointer text-xs h-9"
            >
              <Activity className="h-4 w-4 mr-1.5 text-emerald-400" /> Quét Ping Toàn Bộ Cổng
            </Button>

            <Button 
              size="sm"
              variant="outline"
              onClick={() => setShowVietQrConfigModal(true)}
              className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white cursor-pointer text-xs h-9"
            >
              <QrCode className="h-4 w-4 mr-1.5 text-fuchsia-400" /> Cấu Hình VietQR IPN
            </Button>

            <Button 
              size="sm"
              variant="outline"
              onClick={() => setShowRequestIntegrationModal(true)}
              className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-white cursor-pointer text-xs h-9"
            >
              <Plus className="h-4 w-4 mr-1.5 text-amber-400" /> Yêu Cầu Tích Hợp Mới
            </Button>

            <Button 
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
              className="border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 cursor-pointer text-xs h-9"
            >
              <Download className="h-4 w-4 mr-1.5" /> Xuất Báo Cáo (.CSV)
            </Button>
          </div>
        </div>
      </div>

      {/* 4 MACRO KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Cổng Đang Kết Nối</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {connectedCount} / {integrationApps.length} Dịch Vụ
              </h3>
              <p className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                <Check className="h-3 w-3" /> SLA Khả Dụng: 99.98%
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Lưu Lượng Gọi API (24h)</p>
              <h3 className="text-xl font-bold text-indigo-600 mt-1">48.250 Reqs</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Độ trễ TB: 112ms</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <Globe className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Trạm Webhooks Lắng Nghe</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {activeWebhooksCount} / {webhooks.length} Trạm
              </h3>
              <p className="text-[10px] text-emerald-600 flex items-center gap-1 mt-0.5">
                <Activity className="h-3 w-3" /> Tỷ lệ phân phối 99.9%
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-fuchsia-50 dark:bg-fuchsia-950/50 text-fuchsia-600 flex items-center justify-center">
              <Send className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-slate-200 dark:border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase">Tỷ Lệ Lỗi (Error Rate)</p>
              <h3 className="text-xl font-bold text-emerald-600 mt-1">0.02%</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Tự động retry 3 lần</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4 MAIN OPERATIONAL TABS */}
      <Tabs defaultValue="directory" value={activeTab} onValueChange={(val: any) => setActiveTab(val)} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
          <TabsTrigger value="directory" className="py-2 text-xs font-semibold cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-xs">
            <Blocks className="h-3.5 w-3.5 mr-1.5 text-indigo-600" /> Chợ Ứng Dụng (12)
          </TabsTrigger>
          <TabsTrigger value="webhooks" className="py-2 text-xs font-semibold cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-xs">
            <Send className="h-3.5 w-3.5 mr-1.5 text-fuchsia-600" /> Trạm Webhooks (6)
          </TabsTrigger>
          <TabsTrigger value="keys" className="py-2 text-xs font-semibold cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-xs">
            <Key className="h-3.5 w-3.5 mr-1.5 text-amber-500" /> Khóa API Keys (4)
          </TabsTrigger>
          <TabsTrigger value="audit" className="py-2 text-xs font-semibold cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:shadow-xs">
            <Terminal className="h-3.5 w-3.5 mr-1.5 text-emerald-600" /> Nhật Ký API Audit
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CHỢ KẾT NỐI ỨNG DỤNG (APP DIRECTORY) */}
        <TabsContent value="directory" className="space-y-4 pt-4 outline-hidden">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex flex-wrap gap-1.5 text-xs">
              <Button 
                size="sm" 
                variant={directoryCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setDirectoryCategory('all')}
                className={`h-7 text-[11px] cursor-pointer ${directoryCategory === 'all' ? 'bg-indigo-600 text-white' : ''}`}
              >
                Tất Cả ({integrationApps.length})
              </Button>
              <Button 
                size="sm" 
                variant={directoryCategory === 'communication' ? 'default' : 'outline'}
                onClick={() => setDirectoryCategory('communication')}
                className={`h-7 text-[11px] cursor-pointer ${directoryCategory === 'communication' ? 'bg-indigo-600 text-white' : ''}`}
              >
                Giao Tiếp & Chat
              </Button>
              <Button 
                size="sm" 
                variant={directoryCategory === 'finance' ? 'default' : 'outline'}
                onClick={() => setDirectoryCategory('finance')}
                className={`h-7 text-[11px] cursor-pointer ${directoryCategory === 'finance' ? 'bg-indigo-600 text-white' : ''}`}
              >
                Tài Chính & Kế Toán ERP
              </Button>
              <Button 
                size="sm" 
                variant={directoryCategory === 'payment' ? 'default' : 'outline'}
                onClick={() => setDirectoryCategory('payment')}
                className={`h-7 text-[11px] cursor-pointer ${directoryCategory === 'payment' ? 'bg-indigo-600 text-white' : ''}`}
              >
                Cổng Thanh Toán & VietQR
              </Button>
              <Button 
                size="sm" 
                variant={directoryCategory === 'legal' ? 'default' : 'outline'}
                onClick={() => setDirectoryCategory('legal')}
                className={`h-7 text-[11px] cursor-pointer ${directoryCategory === 'legal' ? 'bg-indigo-600 text-white' : ''}`}
              >
                Pháp Lý & Chữ Ký Số
              </Button>
              <Button 
                size="sm" 
                variant={directoryCategory === 'utilities' ? 'default' : 'outline'}
                onClick={() => setDirectoryCategory('utilities')}
                className={`h-7 text-[11px] cursor-pointer ${directoryCategory === 'utilities' ? 'bg-indigo-600 text-white' : ''}`}
              >
                Tiện Ích & Bản Đồ
              </Button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input 
                placeholder="Tìm dịch vụ, MISA, Zalo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs bg-slate-50 dark:bg-slate-950"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredApps.map(app => (
              <Card key={app.id} className="flex flex-col hover:shadow-md transition-all border-slate-200 dark:border-slate-800 group overflow-hidden">
                <CardContent className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header card */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-800 border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                        {renderAppIcon(app.iconName, "h-6 w-6")}
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        {app.connected ? (
                          <Badge className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Đã kết nối
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-slate-400 text-[10px] py-0.5">
                            Chưa kết nối
                          </Badge>
                        )}
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{app.category}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">{app.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">
                      {app.desc}
                    </p>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                    <div className="grid grid-cols-2 gap-2 text-slate-500">
                      <div>Nhà cung cấp: <b className="text-slate-700 dark:text-slate-300">{app.provider}</b></div>
                      <div>Độ trễ: <b className="text-emerald-600">{app.latencyMs || 100}ms</b></div>
                      <div>Lượt gọi 24h: <b className="text-slate-700 dark:text-slate-300">{app.requestCount24h?.toLocaleString() || 0}</b></div>
                      <div>Đồng bộ: <b className="text-slate-700 dark:text-slate-300">{app.lastSync || 'N/A'}</b></div>
                    </div>

                    <div className="flex items-center justify-between pt-2 gap-2">
                      <Button 
                        size="sm" 
                        variant={app.connected ? "outline" : "default"}
                        className={`text-xs h-8 cursor-pointer flex-1 ${app.connected ? 'border-slate-300' : 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold'}`}
                        onClick={() => handleOpenConfig(app)}
                      >
                        <Settings2 className="h-3.5 w-3.5 mr-1" />
                        {app.connected ? 'Cấu Hình & Test' : 'Kết Nối Ngay'}
                      </Button>

                      <div 
                        className={`w-11 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${app.connected ? 'bg-emerald-500 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                        onClick={() => {
                          toggleIntegrationConnection(app.id)
                          showToast(`${app.connected ? 'Đã ngắt kết nối' : 'Đã kích hoạt kết nối'}: ${app.name}`)
                        }}
                        title={app.connected ? 'Bấm để ngắt kết nối' : 'Bấm để kết nối nhanh'}
                      >
                        <div className="w-4 h-4 bg-white rounded-full shadow-md"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border">
              <Puzzle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">Không tìm thấy ứng dụng phù hợp</h4>
              <p className="text-xs text-slate-500 mt-1">Vui lòng thử từ khóa tìm kiếm khác hoặc nhấp nút "Yêu cầu tích hợp mới".</p>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: TRẠM GIÁM SÁT WEBHOOKS & TRÌNH BẮN THỬ PAYLOAD */}
        <TabsContent value="webhooks" className="space-y-6 pt-4 outline-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Webhook Live Simulator (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="shadow-xs border-fuchsia-200 dark:border-fuchsia-900">
                <CardHeader className="bg-fuchsia-50/50 dark:bg-fuchsia-950/20 border-b pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-2 text-fuchsia-950 dark:text-fuchsia-200">
                    <Send className="h-4 w-4 text-fuchsia-600" />
                    Trình Giả Lập Bắn Thử Webhook (Live Ping Simulator)
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Kiểm thử vòng lặp phát sự kiện ra hệ thống kế toán hoặc đối tác với payload chuẩn.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 space-y-3.5 text-xs">
                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Chọn loại sự kiện BĐS (Event Type)</Label>
                    <select 
                      value={selectedSimEvent}
                      onChange={e => {
                        const val = e.target.value
                        setSelectedSimEvent(val)
                        if (val === 'lead.created') setSimTargetUrl('https://api.marketing.novaland.com.vn/hooks/lead-inbound')
                        else if (val === 'booking.deposited') setSimTargetUrl('https://accounting.novaland.com.vn/misa/sync-deposit')
                        else if (val === 'contract.signed') setSimTargetUrl('https://legal.novaland.com.vn/smartca/contract-event')
                        else if (val === 'payment.vietqr_ipn') setSimTargetUrl('https://crm.novaland.com.vn/api/v1/payments/vietqr/ipn')
                      }}
                      className="w-full h-8 rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-xs"
                    >
                      <option value="booking.deposited">booking.deposited (Khách đặt cọc 200Tr)</option>
                      <option value="lead.created">lead.created (Lead khách VIP mới)</option>
                      <option value="contract.signed">contract.signed (Ký HĐMB số điện tử)</option>
                      <option value="payment.vietqr_ipn">payment.vietqr_ipn (Gạch nợ VietQR 24/7)</option>
                      <option value="property.emergency_locked">property.emergency_locked (Khóa căn khẩn cấp)</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold mb-1 block">URL Endpoint Đích (Webhook Destination)</Label>
                    <Input 
                      value={simTargetUrl}
                      onChange={e => setSimTargetUrl(e.target.value)}
                      className="text-xs h-8 font-mono bg-slate-50 dark:bg-slate-950"
                    />
                  </div>

                  <div>
                    <Label className="text-xs font-semibold mb-1 block">Xem trước Payload JSON sự kiện:</Label>
                    <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto max-h-36 border">
{JSON.stringify({
  event: selectedSimEvent,
  eventId: `evt_${Date.now()}`,
  timestamp: new Date().toISOString(),
  data: {
    propertyCode: "AQC-PH-102",
    projectName: "Aqua City Phoenix Island",
    customerName: "Nguyễn Văn Tuấn",
    depositAmount: 200000000,
    contractCode: "HD-928",
    status: "CONFIRMED"
  },
  signature: "sha256=9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
}, null, 2)}
                    </pre>
                  </div>

                  <Button 
                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold cursor-pointer text-xs h-8"
                    onClick={handleSimulateWebhook}
                    disabled={isSimulatingWebhook}
                  >
                    <Play className={`h-3.5 w-3.5 mr-1.5 ${isSimulatingWebhook ? 'animate-spin' : ''}`} />
                    {isSimulatingWebhook ? 'Đang gửi gói tin...' : '🚀 Bắn Thử Sự Kiện (Test Ping)'}
                  </Button>

                  {/* Result Box */}
                  {simWebhookResponse && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-1.5 animate-in fade-in-50">
                      <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4" /> Kết quả: HTTP {simWebhookResponse.status} OK
                        </span>
                        <span className="text-[11px] font-mono">{simWebhookResponse.latencyMs}ms</span>
                      </div>
                      <pre className="text-[9px] font-mono text-emerald-900 dark:text-emerald-200 overflow-x-auto p-1.5 bg-emerald-100/50 dark:bg-emerald-900/30 rounded">
                        {simWebhookResponse.body}
                      </pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Active Webhooks List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <Card className="shadow-xs border-slate-200 dark:border-slate-800">
                <CardHeader className="border-b pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold">Danh Sách Outbound Webhooks Đang Lắng Nghe</CardTitle>
                    <CardDescription className="text-xs">
                      Tự động streaming sự kiện từ CRM sang các hệ sinh thái bên ngoài với chữ ký HMAC-SHA256.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activeWebhooksCount} / {webhooks.length} Active
                  </Badge>
                </CardHeader>

                <CardContent className="p-0">
                  <div className="divide-y max-h-[460px] overflow-y-auto">
                    {webhooks.map(wh => (
                      <div key={wh.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 text-xs">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{wh.name}</span>
                            <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[9px] py-0">
                              {wh.event}
                            </Badge>
                            {wh.active ? (
                              <Badge className="bg-emerald-600 text-white text-[9px] py-0">Active</Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-400 text-[9px] py-0">Tạm dừng</Badge>
                            )}
                          </div>
                          
                          <div className="text-[11px] font-mono text-slate-500 truncate max-w-md">
                            {wh.targetUrl}
                          </div>

                          <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                            <span>Tỷ lệ thành công: <b className="text-emerald-600">{wh.successRate}%</b></span>
                            <span>Đã phát: <b>{wh.deliveriesCount.toLocaleString()}</b></span>
                            <span>Lần cuối: <b>{wh.lastTriggered}</b></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-7 text-[11px] px-2 cursor-pointer"
                            onClick={() => setSelectedWebhookPayloadModal(wh)}
                          >
                            <FileCode className="h-3 w-3 mr-1" /> Payload
                          </Button>

                          <div 
                            className={`w-9 h-5 rounded-full flex items-center p-0.5 cursor-pointer transition-colors ${wh.active ? 'bg-fuchsia-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}
                            onClick={() => {
                              toggleWebhookStatus(wh.id)
                              showToast(`${wh.active ? 'Đã tạm dừng' : 'Đã kích hoạt'}: ${wh.name}`)
                            }}
                            title="Bật/Tắt webhook"
                          >
                            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-md"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </TabsContent>

        {/* TAB 3: QUẢN LÝ API KEYS & BẢO MẬT (API KEYS) */}
        <TabsContent value="keys" className="space-y-4 pt-4 outline-hidden">
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Danh Sách API Keys Doanh Nghiệp</h3>
              <p className="text-xs text-slate-500">Mỗi đối tác hoặc ứng dụng nội bộ được cấp phát một cặp khóa riêng với IP Whitelist.</p>
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowCreateKeyModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer text-xs h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Tạo Khóa Mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {apiKeys.map(k => (
              <Card key={k.id} className="shadow-xs border-slate-200 dark:border-slate-800">
                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Key className="h-3.5 w-3.5 text-amber-500" />
                        {k.name}
                      </div>
                      <span className="text-[10px] text-slate-400">Tạo ngày: {k.createdAt} • Hết hạn: {k.expiresAt}</span>
                    </div>

                    <Badge 
                      className={`text-[9px] py-0 ${
                        k.status === 'active' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {k.status === 'active' ? 'Đang hoạt động' : 'Đã thu hồi'}
                    </Badge>
                  </div>

                  <div className="p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border flex items-center justify-between font-mono text-[11px]">
                    <span className="truncate mr-2 text-slate-700 dark:text-slate-300">{k.keyMasked}</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 text-slate-500 hover:text-slate-900 cursor-pointer"
                      onClick={() => {
                        navigator.clipboard?.writeText(k.keyMasked)
                        showToast(`Đã sao chép khóa: ${k.name}`)
                      }}
                      title="Sao chép Token"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1 border-t">
                    <div>Quyền hạn: <b className="text-slate-700 dark:text-slate-300 uppercase">{k.permissions}</b></div>
                    <div>IP Whitelist: <b className="text-slate-700 dark:text-slate-300">{k.ipWhitelist}</b></div>
                  </div>

                  {k.status === 'active' && (
                    <div className="flex justify-end pt-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-200 h-7 text-[10px] cursor-pointer"
                        onClick={() => {
                          revokeApiKey(k.id)
                          showToast(`Đã thu hồi quyền truy cập của: ${k.name}`)
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Thu Hồi Khóa
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Nguyên tắc an toàn thông tin doanh nghiệp (Security Best Practices):
            </div>
            <p className="text-[11px] leading-relaxed">
              Tuyệt đối không lưu trữ khóa Secret Token ở phía Client-side (Frontend JavaScript). Mọi cuộc gọi API cần đi qua máy chủ trung gian và áp dụng chữ ký xác thực HMAC-SHA256 kèm mã thời gian (Nonce & Timestamp) để chống tấn công phát lại (Replay Attacks).
            </p>
          </div>
        </TabsContent>

        {/* TAB 4: NHẬT KÝ TRUY XUẤT & KIỂM TOÁN API (AUDIT LOGS) */}
        <TabsContent value="audit" className="space-y-4 pt-4 outline-hidden">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-xl border shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Nhật Ký Lưu Lượng Truy Xuất API Thời Gian Thực</h3>
              <p className="text-xs text-slate-500">Giám sát mọi cuộc gọi Inbound/Outbound, mã HTTP status và độ trễ phản hồi.</p>
            </div>

            <div className="flex gap-2">
              <select 
                value={auditFilterStatus}
                onChange={e => setAuditFilterStatus(e.target.value)}
                className="h-8 rounded-md border border-input bg-transparent px-2.5 py-1 text-xs shadow-xs"
              >
                <option value="all">Tất cả HTTP Status</option>
                <option value="2xx">Chỉ 2xx Thành công</option>
                <option value="4xx">Chỉ 4xx/5xx Có lỗi</option>
              </select>
            </div>
          </div>

          <Card className="shadow-xs border-slate-200 dark:border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/60 text-xs">
                  <TableHead className="w-20">Giờ</TableHead>
                  <TableHead className="w-20">Method</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Dịch Vụ Gọi</TableHead>
                  <TableHead>Địa Chỉ IP</TableHead>
                  <TableHead className="w-24 text-center">Mã Status</TableHead>
                  <TableHead className="w-20 text-right">Độ Trễ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs divide-y">
                {filteredAuditLogs.map(log => (
                  <TableRow key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <TableCell className="font-mono text-slate-500 text-[11px]">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-[9px] font-mono py-0 ${
                          log.method === 'POST' ? 'bg-blue-600 text-white' :
                          log.method === 'GET' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                        }`}
                      >
                        {log.method}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-medium text-slate-800 dark:text-slate-200 text-[11px] truncate max-w-xs">
                      {log.endpoint}
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-300 font-medium">{log.service}</TableCell>
                    <TableCell className="font-mono text-slate-500 text-[11px]">{log.ip}</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        className={`text-[9px] py-0 ${
                          log.statusCode < 300 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {log.statusCode} {log.statusCode === 200 ? 'OK' : log.statusCode === 201 ? 'Created' : 'Unauthorized'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-500">{log.latencyMs}ms</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 5 COMPREHENSIVE INTERACTIVE MODALS */}

      {/* 1. MODAL 1: CẤU HÌNH & KIỂM TRA KẾT NỐI (PING TEST) */}
      {selectedAppForConfig && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border flex items-center justify-center shadow-xs">
                  {renderAppIcon(selectedAppForConfig.iconName, "h-4 w-4")}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Cấu Hình Tích Hợp: {selectedAppForConfig.name}
                  </h3>
                  <p className="text-[10px] text-slate-500">Đơn vị cung cấp: {selectedAppForConfig.provider}</p>
                </div>
              </div>
              <button onClick={() => setSelectedAppForConfig(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <Label className="text-xs font-semibold mb-1 block">API Endpoint URL</Label>
                <Input 
                  value={configEndpoint}
                  onChange={e => setConfigEndpoint(e.target.value)}
                  className="text-xs h-9 font-mono"
                  placeholder="https://api.partner.com/v1/endpoint"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Access Token / API Key Bí Mật</Label>
                <Input 
                  type="password"
                  value={configApiKey}
                  onChange={e => setConfigApiKey(e.target.value)}
                  className="text-xs h-9 font-mono"
                  placeholder="Nhập API Secret Key..."
                />
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Webhook Callback URL (Hệ thống CRM tiếp nhận)</Label>
                <div className="flex gap-2">
                  <Input 
                    value={`https://api.novacrm.vn/webhooks/v1/${selectedAppForConfig.id}`}
                    readOnly
                    className="text-xs h-9 font-mono bg-slate-50 dark:bg-slate-950 text-slate-500"
                  />
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-9 px-3 cursor-pointer shrink-0"
                    onClick={() => {
                      navigator.clipboard?.writeText(`https://api.novacrm.vn/webhooks/v1/${selectedAppForConfig.id}`)
                      showToast('Đã sao chép Webhook Callback URL!')
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Ping Test Button & Result */}
              <div className="pt-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="w-full text-xs h-8 border-indigo-200 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 cursor-pointer"
                  onClick={handleTestPing}
                  disabled={isTestingPing}
                >
                  <Activity className={`h-3.5 w-3.5 mr-1.5 ${isTestingPing ? 'animate-spin' : ''}`} />
                  {isTestingPing ? 'Đang thực hiện bắt tay mạng TLS 1.3...' : '🔌 Kiểm Tra Kết Nối (Ping Test)'}
                </Button>

                {pingResult && (
                  <div className="mt-2.5 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in-50">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{pingResult.message}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setSelectedAppForConfig(null)} className="cursor-pointer">
                  Hủy
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSaveConfig}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Lưu Cấu Hình & Kích Hoạt
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL 2: TẠO MỚI API KEY DOANH NGHIỆP */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cấp Phát API Key Doanh Nghiệp Mới</h3>
              </div>
              <button onClick={() => setShowCreateKeyModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <Label className="text-xs font-semibold mb-1 block">Tên ứng dụng / Mục đích sử dụng</Label>
                <Input 
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  className="text-xs h-9"
                  placeholder="VD: Web Landing Page, ERP MISA..."
                />
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Phạm vi quyền hạn (Scope)</Label>
                <select 
                  value={newKeyPerms}
                  onChange={(e: any) => setNewKeyPerms(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs"
                >
                  <option value="read">Chỉ đọc (Read-only) - Xem giỏ hàng, bảng giá</option>
                  <option value="read_write">Đọc & Ghi (Read-Write) - Nhận lead, tạo cọc</option>
                  <option value="admin">Toàn quyền (Admin Master) - Toàn bộ chức năng</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Địa chỉ IP Whitelist (Phân tách bởi dấu phẩy)</Label>
                <Input 
                  value={newKeyIp}
                  onChange={e => setNewKeyIp(e.target.value)}
                  className="text-xs h-9 font-mono"
                  placeholder="14.161.22.88 hoặc Any (*)"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Ngày hết hiệu lực</Label>
                <Input 
                  type="date"
                  value={newKeyExpires}
                  onChange={e => setNewKeyExpires(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowCreateKeyModal(false)} className="cursor-pointer">
                  Hủy
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleCreateApiKey}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Sinh Mã Khóa Mới
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MODAL 3: CHI TIẾT GÓI TIN WEBHOOK PAYLOAD */}
      {selectedWebhookPayloadModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-fuchsia-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Chi Tiết Webhook: {selectedWebhookPayloadModal.name}
                </h3>
              </div>
              <button onClick={() => setSelectedWebhookPayloadModal(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border text-[11px]">
                <div>Sự kiện: <b className="font-mono">{selectedWebhookPayloadModal.event}</b></div>
                <div>Lần phát cuối: <b>{selectedWebhookPayloadModal.lastTriggered}</b></div>
                <div>Đã gửi: <b>{selectedWebhookPayloadModal.deliveriesCount.toLocaleString()} lần</b></div>
                <div>Tỷ lệ 200 OK: <b className="text-emerald-600">{selectedWebhookPayloadModal.successRate}%</b></div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Request Headers chuẩn HMAC-SHA256:</Label>
                <pre className="p-2.5 bg-slate-900 text-slate-300 rounded-xl text-[10px] font-mono border">
{`POST ${selectedWebhookPayloadModal.targetUrl} HTTP/1.1
Host: partner-gateway.com
Content-Type: application/json
X-Nova-Event: ${selectedWebhookPayloadModal.event}
X-Nova-Delivery-Id: del_${Date.now()}
X-Nova-Signature: sha256=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`}
                </pre>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Request Body JSON Payload:</Label>
                <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-[10px] font-mono overflow-x-auto max-h-40 border">
{JSON.stringify({
  event: selectedWebhookPayloadModal.event,
  occurred_at: new Date().toISOString(),
  environment: "production",
  data: {
    contractId: "HD-928",
    customer: {
      name: "Nguyễn Văn Tuấn",
      phone: "0901234567",
      taxCode: "0312984920"
    },
    property: {
      code: "AQC-PH-102",
      project: "Aqua City Phoenix",
      price: 14500000000
    }
  }
}, null, 2)}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    showToast('Đang phát lại gói tin webhook (Replay delivery)...')
                    setTimeout(() => showToast('Replay thành công! HTTP 200 OK'), 700)
                  }}
                  className="cursor-pointer text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Gửi Lại Gói Tin (Replay)
                </Button>

                <Button size="sm" onClick={() => setSelectedWebhookPayloadModal(null)} className="cursor-pointer">
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL 4: YÊU CẦU TÍCH HỢP HỆ THỐNG MỚI */}
      {showRequestIntegrationModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Yêu Cầu Tích Hợp Hệ Thống Mới</h3>
              </div>
              <button onClick={() => setShowRequestIntegrationModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <Label className="text-xs font-semibold mb-1 block">Tên hệ thống / Phần mềm đối tác</Label>
                <Input 
                  value={reqAppName}
                  onChange={e => setReqAppName(e.target.value)}
                  className="text-xs h-9"
                  placeholder="VD: Oracle NetSuite, Tổng đài Callio..."
                />
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Mức độ ưu tiên</Label>
                <select 
                  value={reqPriority}
                  onChange={e => setReqPriority(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs"
                >
                  <option value="high">Ưu tiên cao (Dự án trọng điểm)</option>
                  <option value="medium">Bình thường</option>
                  <option value="low">Thử nghiệm tương lai</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Mô tả bài toán nghiệp vụ & luồng dữ liệu cần liên thông</Label>
                <textarea 
                  rows={3}
                  value={reqAppDesc}
                  onChange={e => setReqAppDesc(e.target.value)}
                  className="w-full rounded-md border border-input bg-transparent p-2 text-xs shadow-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowRequestIntegrationModal(false)} className="cursor-pointer">
                  Hủy
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    addIntegrationApp({
                      name: reqAppName,
                      category: 'utilities',
                      iconName: 'Puzzle',
                      desc: reqAppDesc,
                      connected: false,
                      provider: 'Yêu cầu mở rộng'
                    })
                    setShowRequestIntegrationModal(false)
                    showToast(`Đã gửi yêu cầu tích hợp "${reqAppName}" đến bộ phận Kỹ thuật!`)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Gửi Yêu Cầu Kỹ Thuật
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL 5: CẤU HÌNH GẠCH NỢ TỰ ĐỘNG VIETQR IPN */}
      {showVietQrConfigModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <QrCode className="h-5 w-5 text-fuchsia-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Cấu Hình Cổng VietQR PRO & Gạch Nợ Tự Động 24/7</h3>
              </div>
              <button onClick={() => setShowVietQrConfigModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Ngân hàng thụ hưởng</Label>
                  <Input 
                    value={vietQrBank}
                    onChange={e => setVietQrBank(e.target.value)}
                    className="text-xs h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold mb-1 block">Số tài khoản CĐT</Label>
                  <Input 
                    value={vietQrAccNo}
                    onChange={e => setVietQrAccNo(e.target.value)}
                    className="text-xs h-9 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Tên chủ tài khoản thụ hưởng</Label>
                <Input 
                  value={vietQrAccName}
                  onChange={e => setVietQrAccName(e.target.value)}
                  className="text-xs h-9"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold mb-1 block">Cú pháp ủy nhiệm chi nhận diện tự động</Label>
                <Input 
                  value={vietQrSyntax}
                  onChange={e => setVietQrSyntax(e.target.value)}
                  className="text-xs h-9 font-mono bg-slate-50 dark:bg-slate-950"
                />
              </div>

              <div className="p-3 bg-fuchsia-50 dark:bg-fuchsia-950/30 rounded-xl border border-fuchsia-200 dark:border-fuchsia-800 space-y-2">
                <div className="font-bold text-fuchsia-900 dark:text-fuchsia-200 flex items-center justify-between">
                  <span>Mô phỏng gạch nợ tiền cọc qua IPN Webhook:</span>
                  <Badge className="bg-fuchsia-600 text-white text-[9px]">Live Test</Badge>
                </div>
                <p className="text-[11px] text-fuchsia-800 dark:text-fuchsia-300">
                  Khi khách hàng quét mã chuyển 200.000.000 VNĐ, cổng NAPAS sẽ bắn gói tin IPN gạch nợ trực tiếp sau 3 giây.
                </p>
                <Button 
                  size="sm"
                  className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold cursor-pointer text-xs h-8"
                  onClick={() => {
                    showToast('Đang giả lập khách chuyển 200Tr qua VietQR...')
                    setTimeout(() => {
                      showToast('Khớp lệnh VietQR IPN thành công! Căn AQC-PH-102 đã chuyển sang "Đã cọc".')
                    }, 1200)
                  }}
                >
                  <Play className="h-3 w-3 mr-1" /> Bắn Thử Tiền Cọc 200 Triệu (Simulate IPN)
                </Button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowVietQrConfigModal(false)} className="cursor-pointer">
                  Đóng
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setShowVietQrConfigModal(false)
                    showToast('Đã lưu cấu hình tài khoản VietQR PRO thành công!')
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Lưu Cấu Hình VietQR
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
