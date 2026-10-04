"use client"
import React, { useState, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { DocumentFile, DocumentFolder } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  FolderOpen, FileText, Video as VideoIcon, Box, Share2, 
  Eye, Download, Search, CloudDownload, HardDrive, 
  ChevronRight, Glasses, FileStack, LayoutGrid, List, CheckCircle2, 
  Calendar as CalendarIcon, Upload, X, ShieldCheck, QrCode, Copy, 
  Trash2, Clock, Sparkles, Filter, FileSpreadsheet, ExternalLink, 
  RefreshCw, FileArchive, Check, Layers, AlertCircle, FileCode, CheckCheck
} from 'lucide-react'

export default function DocumentsPage() {
  const { 
    documentFolders, 
    documents, 
    addDocumentFile, 
    deleteDocumentFile, 
    incrementDocumentDownload 
  } = useStore()
  
  // States
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeFolderId, setActiveFolderId] = useState<string>('all')
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Offline Sync State
  const [syncProgress, setSyncProgress] = useState(65)
  const [isSyncing, setIsSyncing] = useState(false)

  // Modals State
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentFile | null>(null)
  const [selectedDocForShare, setSelectedDocForShare] = useState<DocumentFile | null>(null)
  const [selectedDocForAudit, setSelectedDocForAudit] = useState<DocumentFile | null>(null)
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false)
  const [showBatchDownloadModal, setShowBatchDownloadModal] = useState<boolean>(false)

  // Upload Form State
  const [uploadFolderId, setUploadFolderId] = useState<string>(documentFolders[0]?.id || 'folder1')
  const [uploadName, setUploadName] = useState<string>('Thong_Bao_Ban_Giao_Dot4_AquaCity.pdf')
  const [uploadType, setUploadType] = useState<'pdf' | 'cad' | 'video' | 'vr' | '3d' | 'docx'>('pdf')
  const [uploadTag, setUploadTag] = useState<string>('Thông báo')
  const [uploadSize, setUploadSize] = useState<string>('4.5 MB')
  const [uploadStatus, setUploadStatus] = useState<'Đã phê duyệt' | 'Hiệu lực thi hành' | 'Đang thẩm định' | 'Dự thảo nội bộ'>('Hiệu lực thi hành')
  const [uploadSigner, setUploadSigner] = useState<string>('Ban Pháp Chế Tập Đoàn')
  const [uploadDesc, setUploadDesc] = useState<string>('Thông báo chính thức về tiến độ bàn giao nhà cho cư dân đợt 4.')

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 2800)
  }

  // Handle Offline Sync Action
  const handleSync = () => {
    if (isSyncing || syncProgress === 100) return
    setIsSyncing(true)
    showToast('Đang bắt đầu tải gói Sales Kit offline về bộ nhớ đệm trình duyệt...')
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsSyncing(false)
          showToast('Đã hoàn tất đồng bộ 1.25 GB Sales Kit offline!')
          return 100
        }
        return prev + Math.floor(Math.random() * 15) + 8
      })
    }, 450)
  }

  // Filtered documents list
  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchFolder = activeFolderId === 'all' || doc.folderId === activeFolderId
      const matchType = selectedTypeFilter === 'all' || doc.type === selectedTypeFilter
      const matchSearch = searchQuery === '' || 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.signer && doc.signer.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchFolder && matchType && matchSearch
    })
  }, [documents, activeFolderId, selectedTypeFilter, searchQuery])

  // Macro Metrics
  const totalFilesCount = documents.length
  const legalApprovedCount = documents.filter(d => d.legalStatus === 'Hiệu lực thi hành' || d.legalStatus === 'Đã phê duyệt').length
  const totalDownloads = documents.reduce((sum, d) => sum + (d.downloadsCount || 0), 0)

  const activeFolder = documentFolders.find(f => f.id === activeFolderId)

  // Handle Download File with counter increment
  const handleDownload = (doc: DocumentFile) => {
    incrementDocumentDownload(doc.id)
    showToast(`Đang tải xuống tệp: ${doc.name} (${doc.size})`)
    
    // Create simulated file download
    const dummyContent = `NOVA CRM DIGITAL REPOSITORY\nDocument: ${doc.name}\nLegal Status: ${doc.legalStatus || 'Approved'}\nVersion: ${doc.version || '1.0'}\nSigner: ${doc.signer || 'Nova Legal Office'}\nDownloaded at: ${new Date().toISOString()}`
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = doc.name.endsWith('.pdf') || doc.name.endsWith('.dwg') || doc.name.endsWith('.mp4') ? doc.name : `${doc.name}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Submit Upload File
  const handleConfirmUpload = () => {
    addDocumentFile({
      folderId: uploadFolderId,
      name: uploadName,
      type: uploadType,
      size: uploadSize,
      date: new Date().toISOString().slice(0, 10),
      tag: uploadTag,
      description: uploadDesc,
      version: 'v1.0',
      legalStatus: uploadStatus,
      signer: uploadSigner
    })

    setShowUploadModal(false)
    showToast(`Đã xuất bản tài liệu mới: "${uploadName}" vào kho dự án!`)
  }

  // Export repository audit to UTF-8 BOM CSV
  const handleExportCSV = () => {
    const headers = [
      'ID Tệp',
      'Tên Tài Liệu / Biểu Mẫu',
      'Thư Mục Dự Án',
      'Định Dạng',
      'Dung Lượng',
      'Ngày Cập Nhật',
      'Phân Loại Tag',
      'Tình Trạng Pháp Lý',
      'Cơ Quan / Đơn Vị Ban Hành',
      'Phiên Bản',
      'Lượt Tải Toàn Hệ Thống'
    ]

    const rows = filteredDocs.map(d => {
      const folder = documentFolders.find(f => f.id === d.folderId)
      return [
        d.id,
        `"${d.name.replace(/"/g, '""')}"`,
        `"${(folder?.name || 'Chung').replace(/"/g, '""')}"`,
        d.type.toUpperCase(),
        d.size,
        d.date,
        d.tag,
        d.legalStatus || 'Đã phê duyệt',
        `"${(d.signer || 'Tập đoàn').replace(/"/g, '""')}"`,
        d.version || 'v1.0',
        d.downloadsCount || 0
      ]
    })

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `So_Kiem_Toan_Tai_Lieu_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã tải xuống sổ kiểm toán kho tài liệu pháp lý (UTF-8 BOM CSV)!')
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      
      {/* 1. Header with Global Action Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="p-2 bg-orange-50 dark:bg-orange-950/60 rounded-xl text-orange-600 dark:text-orange-400">
              <FolderOpen className="h-6 w-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Kho Tài Liệu Pháp Lý & Biểu Mẫu Dự Án (Sales Kit Vault)
            </h1>
            <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold uppercase tracking-wider">
              100% Pháp Lý Thẩm Định
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Lưu trữ số hóa bản scan quy hoạch 1/500, giấy phép xây dựng, mẫu HĐMB, bản vẽ CAD và trọn bộ Sales Kit cho toàn bộ sàn phân phối.
          </p>
        </div>

        {/* Global Toolbar */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Kiểm Toán CSV
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowBatchDownloadModal(true)}
            className="flex-1 sm:flex-initial border-orange-200 text-orange-700 hover:bg-orange-50 font-semibold gap-1.5 cursor-pointer"
          >
            <FileArchive className="h-4 w-4" />
            Tải Gói ZIP Dự Án
          </Button>

          <Button 
            size="sm"
            onClick={() => setShowUploadModal(true)}
            className="flex-1 sm:flex-initial bg-orange-600 hover:bg-orange-700 text-white font-semibold gap-1.5 shadow-sm cursor-pointer"
          >
            <Upload className="h-4 w-4" />
            Đăng Tải Tài Liệu
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Macro Documentation KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tổng Số Tài Liệu Số Hóa</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalFilesCount} Tệp Tin</div>
            <p className="text-xs text-orange-600 flex items-center gap-1 font-medium">
              <FolderOpen className="h-3.5 w-3.5" /> 6 Thư mục dự án trọng điểm
            </p>
          </div>
          <div className="p-3 bg-orange-50 dark:bg-orange-950/50 text-orange-600 rounded-2xl">
            <FileStack className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pháp Lý Đã Phê Duyệt</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{legalApprovedCount} / {totalFilesCount} Tệp</div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              Quy hoạch 1/500 & GPXD hợp lệ
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-2xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Lượt Tải Sales Kit</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalDownloads.toLocaleString()} Lượt</div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              Toàn hệ thống đại lý F1 & F2
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-2xl">
            <Download className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Dung Lượng Lưu Trữ</span>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400">1.28 GB Data</div>
            <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
              Bản vẽ CAD, TVC 4K & VR360
            </p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-2xl">
            <HardDrive className="h-6 w-6" />
          </div>
        </Card>
      </div>

      {/* 3. Main Workspace: Folder Tree (Left 3 cols) vs Document Explorer (Right 9 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        
        {/* LEFT COLUMN: OFFLINE SYNC & FOLDERS TREE (3/12) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Offline Sync Card */}
          <Card className="bg-gradient-to-br from-orange-600 to-rose-600 text-white border-0 shadow-md rounded-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <CloudDownload className="w-24 h-24" />
            </div>
            <CardContent className="p-5 flex flex-col gap-3 relative z-10 text-xs">
              <div className="flex items-start gap-3">
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-xs">
                  <HardDrive className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Offline Sales Kit Sync</h3>
                  <p className="text-[11px] text-orange-100 mt-0.5 leading-relaxed font-normal">
                    Tải trước tài liệu dự án về máy để tư vấn khách tại công trường khi mất sóng 4G/Wifi.
                  </p>
                </div>
              </div>

              <div className="bg-black/20 h-2 rounded-full overflow-hidden relative mt-1">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(syncProgress, 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] font-bold text-orange-50">
                <span>Dung lượng: 1.25 GB</span>
                <span className={syncProgress === 100 ? 'text-green-300' : ''}>{Math.min(syncProgress, 100)}%</span>
              </div>

              <Button 
                size="sm" 
                onClick={handleSync}
                disabled={syncProgress === 100 || isSyncing}
                className={`font-bold w-full mt-1 cursor-pointer transition-all ${
                  syncProgress === 100 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-white text-orange-600 hover:bg-orange-50'
                }`}
              >
                {syncProgress === 100 ? (
                  <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> ĐÃ ĐỒNG BỘ OFFLINE</span>
                ) : isSyncing ? (
                  <span className="flex items-center gap-1.5"><RefreshCw className="h-4 w-4 animate-spin" /> ĐANG TẢI...</span>
                ) : (
                  <span className="flex items-center gap-1.5"><CloudDownload className="h-4 w-4" /> ĐỒNG BỘ NGAY</span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Project Folders Tree */}
          <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs p-3 space-y-1">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thư Mục Dự Án</span>
              <button 
                onClick={() => {
                  setActiveFolderId('all')
                  showToast('Đang hiển thị toàn bộ tài liệu các dự án')
                }}
                className={`text-[11px] font-semibold cursor-pointer ${
                  activeFolderId === 'all' ? 'text-orange-600 underline font-bold' : 'text-slate-500 hover:underline'
                }`}
              >
                Xem tất cả ({documents.length})
              </button>
            </div>

            <div className="space-y-1">
              {documentFolders.map(folder => {
                const isActive = activeFolderId === folder.id
                const docsCountInFolder = documents.filter(d => d.folderId === folder.id).length

                return (
                  <div key={folder.id} className="space-y-1">
                    <div 
                      onClick={() => {
                        setActiveFolderId(folder.id)
                        showToast(`Đã chuyển sang thư mục: ${folder.name}`)
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all text-xs font-bold border ${
                        isActive 
                          ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 shadow-xs' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FolderOpen className={`h-4 w-4 shrink-0 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                        <span className="truncate">{folder.name}</span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${isActive ? 'bg-orange-600 text-white border-orange-600' : 'text-slate-500'}`}>
                        {docsCountInFolder}
                      </Badge>
                    </div>

                    {/* Subfolders Dropdown Preview */}
                    {isActive && folder.subFolders.length > 0 && (
                      <div className="ml-4 pl-3 border-l-2 border-orange-200 dark:border-orange-800/60 space-y-1 py-1">
                        {folder.subFolders.map((sub, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                              setSearchQuery(sub)
                              showToast(`Lọc theo tiểu mục: ${sub}`)
                            }}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400"
                          >
                            <FileStack className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{sub}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: DOCUMENT EXPLORER (9/12) */}
        <div className="lg:col-span-9 flex flex-col gap-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
          
          {/* Top Explorer Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {activeFolderId === 'all' ? 'Tất Cả Tài Liệu & Biểu Mẫu' : activeFolder?.name}
                <Badge variant="outline" className="text-xs text-orange-600 border-orange-200 font-bold">
                  {filteredDocs.length} Tệp tin
                </Badge>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeFolderId === 'all' ? 'Tra cứu toàn bộ hồ sơ pháp lý, biểu mẫu và media trên toàn hệ thống' : `Các hồ sơ pháp lý và tài liệu thuộc ${activeFolder?.name}`}
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                <Input 
                  placeholder="Tìm theo tên file, tag, cơ quan..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl bg-slate-50 dark:bg-slate-950"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                    viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-orange-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Format Type Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="font-semibold text-slate-500 text-[11px] shrink-0 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Định dạng:
            </span>
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'pdf', label: 'PDF Pháp Lý' },
              { id: 'cad', label: 'Bản Vẽ CAD (.DWG)' },
              { id: 'video', label: 'Video 4K' },
              { id: 'vr', label: 'VR 360 / 3D' },
              { id: 'docx', label: 'Hợp Đồng (.DOCX)' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedTypeFilter(type.id)}
                className={`px-3 py-1 rounded-lg font-bold border transition-all cursor-pointer shrink-0 text-xs ${
                  selectedTypeFilter === type.id
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Empty State */}
          {filteredDocs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 space-y-2">
              <FolderOpen className="h-16 w-16 text-slate-300" />
              <div className="font-bold text-base text-slate-600 dark:text-slate-300">Không tìm thấy tài liệu phù hợp</div>
              <p className="text-xs">Hãy thử đổi từ khóa tìm kiếm hoặc chọn định dạng khác.</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('')
                  setSelectedTypeFilter('all')
                  setActiveFolderId('all')
                }}
                className="mt-2 text-xs"
              >
                Xóa Bộ Lọc
              </Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              
              {/* GRID VIEW MODE */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
                  {filteredDocs.map(file => {
                    const isPdf = file.type === 'pdf'
                    const isVideo = file.type === 'video'
                    const isVr = file.type === 'vr' || file.type === '3d'
                    const isCad = file.type === 'cad'
                    const isDocx = file.type === 'docx'

                    return (
                      <Card 
                        key={file.id} 
                        className="group overflow-hidden border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all rounded-2xl flex flex-col justify-between bg-white dark:bg-slate-900"
                      >
                        <div>
                          {/* Visual Thumbnail Area */}
                          <div className={`h-36 relative flex items-center justify-center border-b overflow-hidden ${
                            isPdf ? 'bg-red-50/50 dark:bg-red-950/20' :
                            isVideo ? 'bg-blue-50/50 dark:bg-blue-950/20' :
                            isVr ? 'bg-purple-50/50 dark:bg-purple-950/20' :
                            isCad ? 'bg-teal-50/50 dark:bg-teal-950/20' :
                            'bg-indigo-50/50 dark:bg-indigo-950/20'
                          }`}>
                            {/* Format Icon */}
                            <div className="transform group-hover:scale-110 transition-transform duration-300">
                              {isPdf && <FileText className="h-14 w-14 text-red-500 drop-shadow-sm" />}
                              {isVideo && <VideoIcon className="h-14 w-14 text-blue-500 drop-shadow-sm" />}
                              {isVr && <Glasses className="h-14 w-14 text-purple-600 drop-shadow-sm" />}
                              {isCad && <FileCode className="h-14 w-14 text-teal-600 drop-shadow-sm" />}
                              {isDocx && <FileText className="h-14 w-14 text-indigo-600 drop-shadow-sm" />}
                            </div>

                            {/* Tag Badge Top-Right */}
                            <div className="absolute top-2.5 right-2.5">
                              <Badge className={`text-[10px] font-bold border-none uppercase ${
                                isPdf ? 'bg-red-100 text-red-700' :
                                isVideo ? 'bg-blue-100 text-blue-700' :
                                isVr ? 'bg-purple-100 text-purple-700' :
                                isCad ? 'bg-teal-100 text-teal-700' :
                                'bg-indigo-100 text-indigo-700'
                              }`}>
                                {file.tag}
                              </Badge>
                            </div>

                            {/* Legal Status Badge Top-Left */}
                            <div className="absolute top-2.5 left-2.5">
                              <Badge className="bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-semibold">
                                {file.legalStatus || 'Hiệu lực'}
                              </Badge>
                            </div>

                            {/* Hover Overlay Action Bar */}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-xs">
                              <Button 
                                size="icon" 
                                variant="secondary" 
                                onClick={() => setSelectedDocForPreview(file)}
                                className="h-10 w-10 rounded-full bg-white hover:bg-orange-500 hover:text-white shadow-md border-0 cursor-pointer"
                                title="Xem trước tài liệu"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button 
                                size="icon" 
                                variant="secondary" 
                                onClick={() => handleDownload(file)}
                                className="h-10 w-10 rounded-full bg-white hover:bg-orange-500 hover:text-white shadow-md border-0 cursor-pointer"
                                title="Tải xuống tài liệu"
                              >
                                <Download className="h-4 w-4" />
                              </Button>

                              <Button 
                                size="icon" 
                                variant="secondary" 
                                onClick={() => setSelectedDocForShare(file)}
                                className="h-10 w-10 rounded-full bg-white hover:bg-orange-500 hover:text-white shadow-md border-0 cursor-pointer"
                                title="Chia sẻ qua Zalo"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Card Text Content */}
                          <CardContent className="p-4 space-y-2 text-xs">
                            <h3 
                              className="font-bold text-xs text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors cursor-pointer"
                              onClick={() => setSelectedDocForPreview(file)}
                              title={file.name}
                            >
                              {file.name}
                            </h3>

                            {file.description && (
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {file.description}
                              </p>
                            )}

                            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t">
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" /> {file.date}
                              </span>
                              <span className="font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                                {file.size}
                              </span>
                            </div>
                          </CardContent>
                        </div>

                        {/* Card Footer Bottom Bar */}
                        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-t flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 flex items-center gap-1">
                            <Download className="h-3 w-3 text-indigo-600" />
                            <b>{file.downloadsCount || 0}</b> lượt tải
                          </span>

                          <button
                            onClick={() => setSelectedDocForAudit(file)}
                            className="text-orange-600 dark:text-orange-400 hover:underline font-semibold cursor-pointer"
                          >
                            Kiểm toán &rarr;
                          </button>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* LIST VIEW MODE */}
              {viewMode === 'list' && (
                <div className="overflow-x-auto pb-4">
                  <Table className="text-xs">
                    <TableHeader>
                      <TableRow className="bg-slate-50 dark:bg-slate-800/60">
                        <TableHead className="w-12 text-center">Loại</TableHead>
                        <TableHead>Tên Tài Liệu & Diễn Giải</TableHead>
                        <TableHead className="w-28">Tag</TableHead>
                        <TableHead className="w-32">Tình Trạng</TableHead>
                        <TableHead className="w-24 text-right">Dung Lượng</TableHead>
                        <TableHead className="w-24 text-center">Lượt Tải</TableHead>
                        <TableHead className="w-28 text-center">Thao Tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y">
                      {filteredDocs.map(file => (
                        <TableRow key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <TableCell className="text-center">
                            {file.type === 'pdf' && <FileText className="h-5 w-5 text-red-500 mx-auto" />}
                            {file.type === 'video' && <VideoIcon className="h-5 w-5 text-blue-500 mx-auto" />}
                            {file.type === 'vr' && <Glasses className="h-5 w-5 text-purple-600 mx-auto" />}
                            {file.type === '3d' && <Box className="h-5 w-5 text-teal-600 mx-auto" />}
                            {file.type === 'cad' && <FileCode className="h-5 w-5 text-teal-600 mx-auto" />}
                            {file.type === 'docx' && <FileText className="h-5 w-5 text-indigo-600 mx-auto" />}
                          </TableCell>

                          <TableCell>
                            <div 
                              onClick={() => setSelectedDocForPreview(file)}
                              className="font-bold text-slate-800 dark:text-slate-100 hover:text-orange-600 cursor-pointer"
                            >
                              {file.name}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1">{file.description || 'Không có mô tả'}</div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="secondary" className="text-[10px] font-semibold">{file.tag}</Badge>
                          </TableCell>

                          <TableCell>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              {file.legalStatus || 'Hiệu lực'}
                            </span>
                          </TableCell>

                          <TableCell className="text-right font-mono text-slate-600 dark:text-slate-300">
                            {file.size}
                          </TableCell>

                          <TableCell className="text-center font-bold text-indigo-600">
                            {file.downloadsCount || 0}
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => setSelectedDocForPreview(file)}
                                className="h-7 w-7 text-slate-600 hover:text-orange-600 cursor-pointer"
                                title="Xem trước"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>

                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => handleDownload(file)}
                                className="h-7 w-7 text-slate-600 hover:text-orange-600 cursor-pointer"
                                title="Tải xuống"
                              >
                                <Download className="h-4 w-4" />
                              </Button>

                              <Button 
                                size="icon" 
                                variant="ghost" 
                                onClick={() => setSelectedDocForShare(file)}
                                className="h-7 w-7 text-slate-600 hover:text-orange-600 cursor-pointer"
                                title="Chia sẻ Zalo"
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[700] p-4 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <div className="text-xs font-semibold">{toastMessage}</div>
        </div>
      )}

      {/* 4. MODAL 1: XEM TRƯỚC TÀI LIỆU SỐ HÓA (AUDIT VIEWER) */}
      {selectedDocForPreview && (
        <div 
          onClick={() => setSelectedDocForPreview(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    Trình Đọc Văn Bản & Kiểm Tra Thẩm Quyền: {selectedDocForPreview.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pháp lý: {selectedDocForPreview.legalStatus} • Cơ quan: {selectedDocForPreview.signer || 'UBND / Sở Xây Dựng'}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedDocForPreview(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              {/* Document Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                  <span className="text-slate-400 block text-[10px]">Định Dạng</span>
                  <span className="font-bold text-slate-900 dark:text-white uppercase">{selectedDocForPreview.type}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                  <span className="text-slate-400 block text-[10px]">Dung Lượng</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedDocForPreview.size}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                  <span className="text-slate-400 block text-[10px]">Phiên Bản</span>
                  <span className="font-bold text-indigo-600">{selectedDocForPreview.version || 'v1.0'}</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                  <span className="text-slate-400 block text-[10px]">Lượt Tải Về</span>
                  <span className="font-bold text-emerald-600">{selectedDocForPreview.downloadsCount || 0} lượt</span>
                </div>
              </div>

              {/* Simulated Paper Document Viewer */}
              <div className="p-6 bg-slate-100 dark:bg-slate-950 rounded-2xl border space-y-3 font-mono text-[11px] leading-relaxed text-slate-800 dark:text-slate-200 shadow-inner">
                <div className="text-center font-bold pb-3 border-b text-xs">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br />
                  Độc lập - Tự do - Hạnh phúc<br />
                  -----------------------------------
                </div>

                <div className="font-bold text-center text-sm text-indigo-900 dark:text-indigo-300">
                  {selectedDocForPreview.name.replace(/_/g, ' ').toUpperCase()}
                </div>

                <p>
                  <b>1. Căn cứ ban hành:</b> Căn cứ Luật Đất Đai số 31/2024/QH15, Luật Nhà Ở số 27/2023/QH15 và Luật Kinh Doanh Bất Động Sản số 29/2023/QH15 có hiệu lực từ ngày 01/08/2024.
                </p>

                <p>
                  <b>2. Nội dung quyết định & thẩm định:</b> {selectedDocForPreview.description || 'Hồ sơ pháp lý hợp lệ đã được thẩm định đầy đủ bởi các sở ngành và phê duyệt triển khai mở bán chính thức.'}
                </p>

                <p>
                  <b>3. Cam kết trách nhiệm:</b> Chủ đầu tư cam kết bảo lãnh tiến độ thi công, an toàn chất lượng xây dựng và thực hiện thủ tục cấp Giấy chứng nhận quyền sở hữu nhà ở (Sổ hồng) cho cư dân theo đúng quy định.
                </p>

                <div className="pt-4 flex justify-between items-center text-xs">
                  <div>
                    Mã xác thực số: <b>SHA-256: 8a9f...3c21</b><br />
                    Tình trạng: <span className="text-emerald-600 font-bold">{selectedDocForPreview.legalStatus}</span>
                  </div>
                  <div className="text-right">
                    <b>ĐẠI DIỆN CƠ QUAN THẨM QUYỀN</b><br />
                    <span className="text-indigo-600 font-bold">{selectedDocForPreview.signer || 'Đã ký số dấu đỏ'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    deleteDocumentFile(selectedDocForPreview.id)
                    setSelectedDocForPreview(null)
                    showToast('Đã xóa tài liệu khỏi kho số hóa!')
                  }}
                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs cursor-pointer gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Xóa Tài Liệu
                </Button>

                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedDocForShare(selectedDocForPreview)
                      setSelectedDocForPreview(null)
                    }}
                    className="gap-1 cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" /> Chia Sẻ Zalo
                  </Button>

                  <Button 
                    size="sm" 
                    onClick={() => handleDownload(selectedDocForPreview)}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold gap-1 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" /> Tải Xuất Bản File
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL 2: CHIA SẺ TÀI LIỆU QUA ZALO & MÃ QR 1-CHẠM */}
      {selectedDocForShare && (
        <div 
          onClick={() => setSelectedDocForShare(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-orange-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Gửi Tài Liệu Sales Kit Cho Khách Hàng VIP</h3>
              </div>
              <button onClick={() => setSelectedDocForShare(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* QR Code and link sharing box */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-36 h-36 bg-white p-2 rounded-xl shadow-xs border flex items-center justify-center">
                  <div className="w-full h-full border-2 border-dashed border-orange-400 flex flex-col items-center justify-center text-orange-600">
                    <QrCode className="h-16 w-16" />
                    <span className="text-[9px] font-mono mt-1 font-bold">Quét Để Đọc Ngay</span>
                  </div>
                </div>

                <div className="space-y-1 w-full text-left font-mono text-[11px] bg-white dark:bg-slate-900 p-3 rounded-xl border">
                  <div>Tài liệu: <b>{selectedDocForShare.name}</b></div>
                  <div>Dung lượng: <b>{selectedDocForShare.size}</b></div>
                  <div className="text-indigo-600 truncate">Link: https://crm.novaland.vn/saleskit/share/{selectedDocForShare.id}</div>
                </div>
              </div>

              {/* Message Script for Zalo */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                [KÍNH GỬI QUÝ KHÁCH HÀNG VIP - TÀI LIỆU BẢO CHỨNG PHÁP LÝ]<br />
                • Dự án: {documentFolders.find(f => f.id === selectedDocForShare.folderId)?.name || 'Nova Real Estate'}<br />
                • Tên văn bản: {selectedDocForShare.name}<br />
                • Cơ quan thẩm duyệt: {selectedDocForShare.signer || 'Cơ quan có thẩm quyền'}<br />
                • Trạng thái: {selectedDocForShare.legalStatus || 'Đã có hiệu lực'}<br />
                👉 Quý khách có thể tải xem trực tiếp tại: https://crm.novaland.vn/saleskit/share/{selectedDocForShare.id}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <a 
                  href="https://chat.zalo.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-orange-600 hover:underline flex items-center gap-1 font-semibold mr-auto"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Mở Zalo Web
                </a>

                <Button 
                  size="sm"
                  onClick={() => {
                    const text = `[KÍNH GỬI QUÝ KHÁCH HÀNG VIP - TÀI LIỆU BẢO CHỨNG PHÁP LÝ]\n• Văn bản: ${selectedDocForShare.name}\n• Trạng thái: ${selectedDocForShare.legalStatus}\n• Tải xem tại: https://crm.novaland.vn/saleskit/share/${selectedDocForShare.id}`
                    navigator.clipboard.writeText(text)
                    showToast('Đã sao chép nội dung tin nhắn Zalo kèm link tải vào bộ nhớ tạm!')
                    setTimeout(() => setSelectedDocForShare(null), 1200)
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold gap-1 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" /> Sao Chép Để Gửi Zalo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL 3: ĐĂNG TẢI TÀI LIỆU MỚI (UPLOAD MODAL) */}
      {showUploadModal && (
        <div 
          onClick={() => setShowUploadModal(false)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-orange-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Xuất Bản & Đăng Tải Tài Liệu Mới Vào Kho</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Thư mục dự án tiếp nhận:</Label>
                <select
                  value={uploadFolderId}
                  onChange={e => setUploadFolderId(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold cursor-pointer"
                >
                  {documentFolders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Tên tệp tin (File name):</Label>
                <Input 
                  value={uploadName} 
                  onChange={e => setUploadName(e.target.value)} 
                  className="h-9 text-xs" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Định dạng file:</Label>
                  <select
                    value={uploadType}
                    onChange={e => setUploadType(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    <option value="pdf">PDF Pháp Lý / Chính Sách</option>
                    <option value="cad">Bản Vẽ CAD (.DWG)</option>
                    <option value="video">Video TVC 4K</option>
                    <option value="vr">VR 360 WebXR</option>
                    <option value="3d">Mô Hình Sa Bàn 3D</option>
                    <option value="docx">Hợp Đồng Mẫu (.DOCX)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Dung lượng ước tính:</Label>
                  <Input 
                    value={uploadSize} 
                    onChange={e => setUploadSize(e.target.value)} 
                    className="h-9 text-xs" 
                    placeholder="VD: 5.4 MB" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Tình trạng pháp lý:</Label>
                  <select
                    value={uploadStatus}
                    onChange={e => setUploadStatus(e.target.value as any)}
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-semibold cursor-pointer"
                  >
                    <option value="Hiệu lực thi hành">Hiệu lực thi hành</option>
                    <option value="Đã phê duyệt">Đã phê duyệt</option>
                    <option value="Đang thẩm định">Đang thẩm định</option>
                    <option value="Dự thảo nội bộ">Dự thảo nội bộ</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Cơ quan ban hành / Ký duyệt:</Label>
                  <Input 
                    value={uploadSigner} 
                    onChange={e => setUploadSigner(e.target.value)} 
                    className="h-9 text-xs" 
                    placeholder="VD: Sở Xây Dựng" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 dark:text-slate-300 font-semibold text-xs">Diễn giải tóm tắt tài liệu:</Label>
                <Input 
                  value={uploadDesc} 
                  onChange={e => setUploadDesc(e.target.value)} 
                  className="h-9 text-xs" 
                  placeholder="Nhập nội dung chính..." 
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowUploadModal(false)} className="cursor-pointer">
                  Hủy
                </Button>
                <Button 
                  size="sm"
                  onClick={handleConfirmUpload}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer"
                >
                  Xuất Bản Vào Kho Dữ Liệu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL 4: KIỂM TOÁN PHÁP LÝ & LỊCH SỬ PHIÊN BẢN (AUDIT TRAIL) */}
      {selectedDocForAudit && (
        <div 
          onClick={() => setSelectedDocForAudit(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Lịch Sử Phiên Bản & Kiểm Toán Pháp Lý</h3>
              </div>
              <button onClick={() => setSelectedDocForAudit(null)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border space-y-1">
                <div className="font-bold text-slate-800 dark:text-slate-200">{selectedDocForAudit.name}</div>
                <div className="text-slate-500">Mã kiểm định: <b>AUDIT-{selectedDocForAudit.id.toUpperCase()}-2026</b></div>
              </div>

              {/* Version History Timeline */}
              <div className="space-y-3">
                <div className="font-bold text-slate-700 dark:text-slate-300">Tiến Trình Cập Nhật Phiên Bản:</div>
                <div className="space-y-2 border-l-2 border-indigo-200 dark:border-indigo-900/60 ml-2 pl-3">
                  <div className="relative space-y-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 absolute -left-[17px] top-1"></span>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Phiên bản hiện tại: {selectedDocForAudit.version || 'v2.1'}
                      <Badge className="bg-emerald-600 text-white text-[9px] py-0">Hiệu lực</Badge>
                    </div>
                    <div className="text-[11px] text-slate-500">Ký duyệt bởi: {selectedDocForAudit.signer || 'Ban Pháp Chế'} ({selectedDocForAudit.date})</div>
                  </div>

                  <div className="relative space-y-0.5 pt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300 absolute -left-[17px] top-3"></span>
                    <div className="font-semibold text-slate-700 dark:text-slate-300">Phiên bản v1.0 (Khởi tạo)</div>
                    <div className="text-[11px] text-slate-500">Dự thảo mở bán ban đầu • 15/06/2026</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button size="sm" onClick={() => setSelectedDocForAudit(null)} className="cursor-pointer">
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL 5: TẢI TRỌN GÓI SALES KIT (BATCH DOWNLOAD MODAL) */}
      {showBatchDownloadModal && (
        <div 
          onClick={() => setShowBatchDownloadModal(false)}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in-50"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <FileArchive className="h-5 w-5 text-orange-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tải Xuất Trọn Bộ Sales Kit (File ZIP)</h3>
              </div>
              <button onClick={() => setShowBatchDownloadModal(false)} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-2">
                <Label className="font-semibold text-slate-700 dark:text-slate-300">Chọn danh mục tài liệu cần đóng gói:</Label>
                <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-orange-600 cursor-pointer" />
                    <span>Hồ sơ quy hoạch 1/500 & Giấy phép xây dựng (PDF)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-orange-600 cursor-pointer" />
                    <span>Chính sách bán hàng & Bảng chiết khấu đợt 3 (PDF)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-orange-600 cursor-pointer" />
                    <span>Mẫu Hợp Đồng Mua Bán chuẩn CĐT (.DOCX)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-orange-600 cursor-pointer" />
                    <span>Bản vẽ mặt bằng kết cấu AutoCad (.DWG)</span>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-200 dark:border-orange-800 text-[11px] text-orange-800 dark:text-orange-200">
                Ước tính kích thước file nén: <b>85.4 MB</b> • Hệ thống sẽ nén và bắt đầu tải xuống trong giây lát.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={() => setShowBatchDownloadModal(false)} className="cursor-pointer">
                  Hủy
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    setShowBatchDownloadModal(false)
                    showToast('Đã bắt đầu tải xuống file nén `SalesKit_TronBo_Novaland_2026.zip`!')
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 mr-1" /> Bắt Đầu Tải ZIP
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
