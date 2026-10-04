"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ScanLine, UploadCloud, Sparkles, CheckCircle2, 
  RefreshCcw, Save, FileText, ChevronRight, FileCheck,
  ShieldCheck, ArrowRight, Eye, Copy, Check, Download,
  ExternalLink, Layers, Clock, AlertTriangle, Building2,
  FileCode, Cpu, User, MapPin, X
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { Customer, Contract } from '@/types'
import Link from 'next/link'

// Document Sample Presets
interface DocumentSample {
  id: string
  title: string
  docType: 'cccd' | 'redbook' | 'passport'
  categoryName: string
  imageUrl: string
  fields: Record<string, string>
  confidences: Record<string, string>
}

const DOCUMENT_SAMPLES: Record<string, DocumentSample> = {
  sample1: {
    id: 'sample1',
    title: 'CCCD Gắn Chip - Nguyễn Văn Tuấn (VVIP)',
    docType: 'cccd',
    categoryName: 'Căn Cước Công Dân Gắn Chip (12 số)',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80',
    fields: {
      fullName: 'NGUYỄN VĂN TUẤN',
      idNumber: '079085012345',
      dob: '15/01/1985',
      gender: 'Nam',
      nationality: 'Việt Nam',
      origin: 'Hoài Nhơn, Bình Định',
      address: 'Số 215 Điện Biên Phủ, Phường Đa Kao, Quận 1, TP.HCM',
      issueDate: '12/04/2021',
      issuePlace: 'Cục Cảnh sát QLHC về TTXH',
      expireDate: '15/01/2045'
    },
    confidences: {
      fullName: '99.8%',
      idNumber: '99.9%',
      dob: '99.5%',
      gender: '99.7%',
      address: '98.9%',
      issueDate: '99.4%'
    }
  },
  sample2: {
    id: 'sample2',
    title: 'CCCD Gắn Chip - Trần Thị Bích Ngọc (VIP)',
    docType: 'cccd',
    categoryName: 'Căn Cước Công Dân Gắn Chip (12 số)',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    fields: {
      fullName: 'TRẦN THỊ BÍCH NGỌC',
      idNumber: '079192009876',
      dob: '20/05/1992',
      gender: 'Nữ',
      nationality: 'Việt Nam',
      origin: 'TP. Biên Hòa, Đồng Nai',
      address: 'Biệt Thự Shophouse Aqua Marina, Long Hưng, Biên Hòa, Đồng Nai',
      issueDate: '05/08/2022',
      issuePlace: 'Cục Cảnh sát QLHC về TTXH',
      expireDate: '20/05/2032'
    },
    confidences: {
      fullName: '99.7%',
      idNumber: '99.8%',
      dob: '99.6%',
      gender: '99.9%',
      address: '99.1%',
      issueDate: '99.3%'
    }
  },
  sample3: {
    id: 'sample3',
    title: 'Sổ Hồng (GCNQSDĐ) - Biệt Thự Florida NovaWorld',
    docType: 'redbook',
    categoryName: 'Giấy Chứng Nhận Quyền Sử Dụng Đất',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
    fields: {
      serialNumber: 'CP 892341 (Phôi đỏ có mã QR bảo mật)',
      plotNumber: 'Thửa đất số 128',
      mapSheetNumber: 'Tờ bản đồ số 42',
      landAddress: 'Phân khu Florida 1, Xã Tiến Thành, TP. Phan Thiết, Bình Thuận',
      area: '250.0 m² (Sử dụng riêng: 250 m²)',
      purpose: 'Đất ở tại đô thị kết hợp thương mại dịch vụ',
      term: 'Lâu dài (Người Việt Nam) / 50 năm',
      origin: 'Nhà nước giao đất có thu tiền sử dụng đất',
      ownerName: 'CÔNG TY CP ĐẦU TƯ ĐỊA ỐC NOVALAND',
      signDate: '15/10/2023',
      signAuthority: 'Sở Tài Nguyên & Môi Trường Bình Thuận'
    },
    confidences: {
      serialNumber: '99.6%',
      plotNumber: '99.9%',
      mapSheetNumber: '99.8%',
      landAddress: '98.7%',
      area: '99.9%',
      purpose: '99.2%'
    }
  },
  sample4: {
    id: 'sample4',
    title: 'Hộ Chiếu Quốc Tế - Michael Chen (Nhà Đầu Tư Nước Ngoài)',
    docType: 'passport',
    categoryName: 'Hộ Chiếu Quốc Tế (Passport)',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    fields: {
      fullName: 'MICHAEL CHEN',
      idNumber: 'E89214501',
      dob: '18/09/1980',
      gender: 'Male',
      nationality: 'SINGAPORE (SGP)',
      origin: 'Singapore',
      address: 'Marina Bay Financial Tower 1, Singapore',
      issueDate: '18/09/2020',
      issuePlace: 'Immigration & Checkpoints Authority Singapore',
      expireDate: '18/09/2030'
    },
    confidences: {
      fullName: '99.9%',
      idNumber: '99.9%',
      dob: '99.7%',
      nationality: '99.9%',
      expireDate: '99.8%'
    }
  }
}

export default function DocumentAIPage() {
  const { addCustomer, addContract, customers, projects } = useStore()
  
  // Selected sample
  const [selectedSampleKey, setSelectedSampleKey] = useState<string>('sample1')
  const currentSample = DOCUMENT_SAMPLES[selectedSampleKey]

  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'completed'>('idle')
  const [progress, setProgress] = useState(0)

  // Extracted Editable Form Data
  const [formData, setFormData] = useState<Record<string, string>>({})
  
  // Feedback states
  const [isSaved, setIsSaved] = useState(false)
  const [isContractCreated, setIsContractCreated] = useState(false)
  const [customerSuccessToast, setCustomerSuccessToast] = useState(false)
  const [contractSuccessToast, setContractSuccessToast] = useState(false)

  // Modals
  const [contractModalOpen, setContractModalOpen] = useState(false)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)
  const [jsonCopied, setJsonCopied] = useState(false)

  // Contract form inside modal
  const [selectedProjectForContract, setSelectedProjectForContract] = useState('p1')
  const [contractValue, setContractValue] = useState(18500000000)
  const [contractType, setContractType] = useState<Contract['type']>('Hợp đồng đặt cọc')

  // Load sample into form
  const handleSelectSample = (sampleKey: string) => {
    setSelectedSampleKey(sampleKey)
    setScanStatus('idle')
    setProgress(0)
    setIsSaved(false)
    setIsContractCreated(false)
    setFormData({})
  }

  // Trigger OCR Scanning Pipeline
  const handleStartScan = () => {
    setScanStatus('scanning')
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
            // Auto-fill form from selected sample
            setFormData({ ...currentSample.fields })
            return 100
          }
          return prev + 4
        })
      }, 40)
      return () => clearInterval(interval)
    }
  }, [scanStatus, currentSample])

  // Save as new Customer in CRM
  const handleSaveCustomer = () => {
    const name = formData.fullName || currentSample.fields.fullName || 'Khách Hàng Mới'
    addCustomer({
      name,
      phone: '090' + Math.floor(Math.random() * 9000000 + 1000000),
      email: `${name.toLowerCase().replace(/\s+/g, '.') || 'khachhang'}@investor.vn`,
      rank: 'VIP' as any,
      revenue: 0,
      assignedTo: 'Lê Hoàng Anh',
      status: 'Tiềm Năng' as any
    })
    setIsSaved(true)
    setCustomerSuccessToast(true)
    setTimeout(() => setCustomerSuccessToast(false), 4000)
  }

  // Open Contract Creation Modal
  const handleOpenContractModal = () => {
    setContractModalOpen(true)
  }

  // Confirm Contract Creation
  const handleConfirmContract = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Auto save customer first if not saved
    if (!isSaved) {
      handleSaveCustomer()
    }

    const latestCustomer = customers[0]
    const targetProject = projects.find(p => p.id === selectedProjectForContract)

    addContract({
      customerId: latestCustomer ? latestCustomer.id : 'c1',
      inventoryId: 'NVW-01.02',
      projectId: selectedProjectForContract,
      value: contractValue,
      status: 'Chờ duyệt',
      type: contractType,
      paymentProgress: 15,
      signer: formData.fullName || currentSample.fields.fullName || 'Người Mua'
    })

    setContractModalOpen(false)
    setIsContractCreated(true)
    setContractSuccessToast(true)
    setTimeout(() => setContractSuccessToast(false), 5000)
  }

  const handleCopyJSON = () => {
    const payload = JSON.stringify({
      documentType: currentSample.docType,
      category: currentSample.categoryName,
      extractedData: formData,
      confidences: currentSample.confidences,
      engine: 'Google Document AI Vision v2.4 (Enterprise)',
      processedAt: new Date().toISOString()
    }, null, 2)
    navigator.clipboard.writeText(payload)
    setJsonCopied(true)
    setTimeout(() => setJsonCopied(false), 3000)
  }

  const formatCurrency = (val: number) => {
    if (val >= 1e9) return `${(val / 1e9).toFixed(1)} Tỷ VNĐ`
    return `${val.toLocaleString()} VNĐ`
  }

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">
      
      {/* 1. Header with Strategic Document AI Metrics */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl text-emerald-600 dark:text-emerald-400">
              <ScanLine className="h-6 w-6" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Nhận Diện Giấy Tờ & OCR Thông Minh (Document AI)
            </h1>
            <Badge className="bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs">
              Vision AI Engine 99.4%
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Tự động bóc tách thông tin từ CCCD gắn chip, Hộ chiếu, Sổ hồng (GCNQSDĐ) và tự động điền form hợp đồng, loại trừ 100% lỗi gõ tay.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setJsonModalOpen(true)}
            className="flex-1 sm:flex-initial border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-semibold gap-1.5"
          >
            <FileCode className="h-4 w-4" />
            Xem JSON Schema
          </Button>

          <Button 
            size="sm"
            onClick={handleStartScan}
            disabled={scanStatus === 'scanning'}
            className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            {scanStatus === 'scanning' ? 'Đang Phân Tích...' : 'Quét OCR Ngay'}
          </Button>
        </div>
      </div>

      {/* 2. Top 4 Operational Document AI KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Giấy Tờ Đã Xử Lý</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">1.840 Hồ Sơ</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> CCCD, Sổ Hồng, Passport
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-2xl">
            <FileCheck className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Độ Chính Xác OCR</span>
            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">99.4% Chuẩn Xác</div>
            <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
              Đối soát cấu trúc ký tự chuẩn
            </p>
          </div>
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-2xl">
            <Cpu className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Thời Gian Xử Lý</span>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">2.1 Giây</div>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">
              Trích xuất song song Bounding Box
            </p>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-2xl">
            <Clock className="h-6 w-6" />
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Loại Bỏ Sai Sót</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">0 Lỗi Hợp Đồng</div>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              Không nhầm lẫn số CCCD / Sổ Hồng
            </p>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-2xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </Card>
      </div>

      {/* 3. Document Preset Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap mr-1">Mẫu tài liệu thực tế:</span>
        {Object.entries(DOCUMENT_SAMPLES).map(([key, sample]) => (
          <button
            key={key}
            onClick={() => handleSelectSample(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              selectedSampleKey === key 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-400'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{sample.title}</span>
          </button>
        ))}
      </div>

      {/* 4. Main Two-Column Side-by-Side Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        
        {/* LEFT COLUMN: SCANNER VIEWPORT & BOUNDING BOX OVERLAY (5/12) */}
        <Card className="lg:col-span-5 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col bg-slate-950 text-white">
          <CardHeader className="bg-slate-900/80 p-4 border-b border-slate-800 flex flex-row items-center justify-between shrink-0">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                <ScanLine className="h-4 w-4 text-emerald-400" />
                Vùng Quét Giấy Tờ (Document Viewport)
              </CardTitle>
              <CardDescription className="text-slate-400 text-xs mt-0.5">
                {currentSample.categoryName}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 font-mono text-[10px]">
              {scanStatus === 'completed' ? 'OCR 100%' : scanStatus === 'scanning' ? `Scanning ${progress}%` : 'Sẵn Sàng'}
            </Badge>
          </CardHeader>

          <CardContent className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center relative bg-slate-900/60 overflow-hidden min-h-[460px]">
            
            {/* ID / Sổ Hồng Card Visual Viewport */}
            <div className="relative w-full max-w-[420px] rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-900">
              <img 
                src={currentSample.imageUrl} 
                alt={currentSample.title}
                className={`w-full h-64 sm:h-72 object-cover transition-all duration-700 ${
                  scanStatus === 'completed' ? 'brightness-105 contrast-110' : scanStatus === 'scanning' ? 'brightness-90 filter grayscale' : 'opacity-80'
                }`}
              />

              {/* LASER SCANNING BEAM ANIMATION */}
              {scanStatus === 'scanning' && (
                <>
                  <div 
                    className="absolute left-0 w-full h-1 bg-emerald-400 shadow-[0_0_20px_6px_rgba(52,211,153,0.8)] z-30 transition-all duration-75"
                    style={{ top: `${progress}%` }}
                  ></div>
                  <div 
                    className="absolute left-0 w-full bg-gradient-to-t from-emerald-500/30 via-emerald-500/10 to-transparent z-20 pointer-events-none transition-all duration-75"
                    style={{ top: 0, height: `${progress}%` }}
                  ></div>

                  {/* Pulsing Bounding Boxes Appearing during Scan */}
                  {progress > 25 && <div className="absolute top-[28%] left-[25%] w-[55%] h-[12%] border-2 border-emerald-400 bg-emerald-400/20 rounded-md animate-pulse"></div>}
                  {progress > 55 && <div className="absolute top-[45%] left-[25%] w-[65%] h-[10%] border-2 border-emerald-400 bg-emerald-400/20 rounded-md animate-pulse"></div>}
                  {progress > 80 && <div className="absolute top-[62%] left-[25%] w-[70%] h-[16%] border-2 border-emerald-400 bg-emerald-400/20 rounded-md animate-pulse"></div>}
                </>
              )}

              {/* COMPLETED BOUNDING BOXES OVERLAY (Yellow/Green Outlines) */}
              {scanStatus === 'completed' && (
                <>
                  {currentSample.docType === 'cccd' && (
                    <>
                      <div className="absolute top-[26%] left-[32%] w-[60%] h-[12%] border-2 border-amber-400 rounded-md flex items-center justify-end px-1 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded shadow-sm">NAME 99.8%</span>
                      </div>
                      <div className="absolute top-[42%] left-[32%] w-[60%] h-[10%] border-2 border-amber-400 rounded-md flex items-center justify-end px-1 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded shadow-sm">ID NO 99.9%</span>
                      </div>
                      <div className="absolute top-[58%] left-[32%] w-[64%] h-[18%] border-2 border-emerald-400 rounded-md flex items-center justify-end px-1 shadow-[0_0_10px_rgba(52,211,153,0.6)]">
                        <span className="bg-emerald-500 text-white text-[9px] font-black px-1 rounded shadow-sm">ADDRESS 98.9%</span>
                      </div>
                    </>
                  )}

                  {currentSample.docType === 'redbook' && (
                    <>
                      <div className="absolute top-[18%] left-[10%] w-[80%] h-[14%] border-2 border-amber-400 rounded-md flex items-center justify-end px-1 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded shadow-sm">SERIAL NO 99.6%</span>
                      </div>
                      <div className="absolute top-[38%] left-[10%] w-[80%] h-[16%] border-2 border-emerald-400 rounded-md flex items-center justify-end px-1 shadow-[0_0_10px_rgba(52,211,153,0.6)]">
                        <span className="bg-emerald-500 text-white text-[9px] font-black px-1 rounded shadow-sm">PLOT & MAP 99.9%</span>
                      </div>
                      <div className="absolute top-[60%] left-[10%] w-[80%] h-[22%] border-2 border-amber-400 rounded-md flex items-center justify-end px-1 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded shadow-sm">AREA 250m² 99.9%</span>
                      </div>
                    </>
                  )}

                  {currentSample.docType === 'passport' && (
                    <>
                      <div className="absolute top-[25%] left-[20%] w-[70%] h-[15%] border-2 border-amber-400 rounded-md flex items-center justify-end px-1 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                        <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded shadow-sm">PASSPORT 99.9%</span>
                      </div>
                      <div className="absolute top-[48%] left-[20%] w-[70%] h-[15%] border-2 border-emerald-400 rounded-md flex items-center justify-end px-1 shadow-[0_0_10px_rgba(52,211,153,0.6)]">
                        <span className="bg-emerald-500 text-white text-[9px] font-black px-1 rounded shadow-sm">NATIONALITY 99.9%</span>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Status Control Button */}
            <div className="mt-5 w-full flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {scanStatus === 'completed' ? 'Đã bóc tách hoàn tất 100%' : 'Bấm nút để kích hoạt AI Vision'}
              </span>
              <Button 
                size="sm"
                onClick={handleStartScan}
                disabled={scanStatus === 'scanning'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-8 text-xs gap-1"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {scanStatus === 'completed' ? 'Quét Lại' : 'Bắt Đầu Quét OCR'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: STANDARDIZED AUTO-FILL DATA FORM (7/12) */}
        <Card className="lg:col-span-7 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col bg-white dark:bg-slate-900">
          <CardHeader className="p-4 pb-3 border-b flex flex-row items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <FileCheck className="h-4 w-4 text-indigo-600" />
                Dữ Liệu Trích Xuất Chuẩn Hóa (Standardized Extraction)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Cho phép kiểm tra và chỉnh sửa trước khi tự động sinh hợp đồng hoặc lưu CRM
              </CardDescription>
            </div>
            
            {scanStatus === 'completed' && (
              <Badge className="bg-emerald-600 text-white text-xs gap-1 shadow-sm">
                <CheckCircle2 className="h-3 w-3" /> Bóc tách thành công
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
            
            {scanStatus === 'idle' && (
              <div className="p-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
                <ScanLine className="h-12 w-12 text-slate-300 dark:text-slate-700 animate-pulse" />
                <div>
                  <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Chưa có dữ liệu trích xuất</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Vui lòng bấm nút "Bắt Đầu Quét OCR" ở cột bên trái để AI tự động điền form.</p>
                </div>
                <Button size="sm" onClick={handleStartScan} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1">
                  <Sparkles className="h-3.5 w-3.5" /> Quét Ngay
                </Button>
              </div>
            )}

            {scanStatus === 'scanning' && (
              <div className="p-12 flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
                <RefreshCcw className="h-10 w-10 text-emerald-600 animate-spin" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">AI Đang Phân Tích Hình Ảnh...</h4>
                  <p className="text-xs text-slate-500">Bóc tách các trường họ tên, số định danh, tọa độ thửa đất ({progress}%)</p>
                </div>
              </div>
            )}

            {scanStatus === 'completed' && (
              <div className="space-y-4 animate-in fade-in-50 text-xs">
                
                {/* 1. Nếu là CCCD hoặc Hộ chiếu */}
                {(currentSample.docType === 'cccd' || currentSample.docType === 'passport') && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 text-[11px] uppercase">Họ và Tên</label>
                          <span className="text-[10px] text-emerald-600 font-bold">{currentSample.confidences.fullName}</span>
                        </div>
                        <Input 
                          value={formData.fullName || ''} 
                          onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                          className="font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <label className="font-bold text-slate-500 text-[11px] uppercase">Số CCCD / Hộ Chiếu</label>
                          <span className="text-[10px] text-emerald-600 font-bold">{currentSample.confidences.idNumber}</span>
                        </div>
                        <Input 
                          value={formData.idNumber || ''} 
                          onChange={e => setFormData({ ...formData, idNumber: e.target.value })}
                          className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Ngày Sinh</label>
                        <Input 
                          value={formData.dob || ''} 
                          onChange={e => setFormData({ ...formData, dob: e.target.value })}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Giới Tính</label>
                        <Input 
                          value={formData.gender || ''} 
                          onChange={e => setFormData({ ...formData, gender: e.target.value })}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Quốc Tịch</label>
                        <Input 
                          value={formData.nationality || 'Việt Nam'} 
                          onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Nơi Thường Trú</label>
                        <span className="text-[10px] text-emerald-600 font-bold">{currentSample.confidences.address || '99%'}</span>
                      </div>
                      <Input 
                        value={formData.address || ''} 
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Ngày Cấp</label>
                        <Input 
                          value={formData.issueDate || ''} 
                          onChange={e => setFormData({ ...formData, issueDate: e.target.value })}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Có Giá Trị Đến</label>
                        <Input 
                          value={formData.expireDate || ''} 
                          onChange={e => setFormData({ ...formData, expireDate: e.target.value })}
                          className="bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 h-9"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Nếu là Sổ Hồng GCNQSDĐ */}
                {currentSample.docType === 'redbook' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Số Seri Phôi Sổ</label>
                        <Input 
                          value={formData.serialNumber || ''} 
                          onChange={e => setFormData({ ...formData, serialNumber: e.target.value })}
                          className="font-mono font-bold text-amber-600 bg-slate-50 dark:bg-slate-950 h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Thửa Đất Số</label>
                        <Input 
                          value={formData.plotNumber || ''} 
                          onChange={e => setFormData({ ...formData, plotNumber: e.target.value })}
                          className="font-bold bg-slate-50 dark:bg-slate-950 h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Tờ Bản Đồ Số</label>
                        <Input 
                          value={formData.mapSheetNumber || ''} 
                          onChange={e => setFormData({ ...formData, mapSheetNumber: e.target.value })}
                          className="font-bold bg-slate-50 dark:bg-slate-950 h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-500 text-[11px] uppercase">Địa Chỉ Thửa Đất</label>
                      <Input 
                        value={formData.landAddress || ''} 
                        onChange={e => setFormData({ ...formData, landAddress: e.target.value })}
                        className="bg-slate-50 dark:bg-slate-950 h-9"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Diện Tích Đất</label>
                        <Input 
                          value={formData.area || ''} 
                          onChange={e => setFormData({ ...formData, area: e.target.value })}
                          className="font-bold text-emerald-600 bg-slate-50 dark:bg-slate-950 h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-slate-500 text-[11px] uppercase">Mục Đích Sử Dụng</label>
                        <Input 
                          value={formData.purpose || ''} 
                          onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                          className="bg-slate-50 dark:bg-slate-950 h-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-500 text-[11px] uppercase">Chủ Sử Dụng Đất</label>
                      <Input 
                        value={formData.ownerName || ''} 
                        onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                        className="font-bold bg-slate-50 dark:bg-slate-950 h-9"
                      />
                    </div>
                  </div>
                )}

                {/* Validation Passed Card */}
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                    <span>Dữ liệu đã qua kiểm chứng đối soát OCR độ chính xác 99.4%. Sẵn sàng lưu CRM hoặc tạo hợp đồng.</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Action Footer (Zero Dead Buttons) */}
          <div className="p-4 border-t bg-slate-50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSelectSample(selectedSampleKey)}
              disabled={scanStatus === 'scanning'}
              className="w-full sm:w-auto text-xs"
            >
              Làm Lại
            </Button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button 
                size="sm"
                onClick={handleSaveCustomer}
                disabled={scanStatus !== 'completed' || isSaved}
                className={`${isSaved ? 'bg-slate-800 text-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 text-white'} text-xs font-semibold gap-1.5 shadow-sm flex-1 sm:flex-initial`}
              >
                {isSaved ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Save className="h-3.5 w-3.5" />}
                {isSaved ? 'Đã Lưu Khách Hàng' : 'Lưu Hồ Sơ Khách Hàng'}
              </Button>

              <Button 
                size="sm"
                onClick={handleOpenContractModal}
                disabled={scanStatus !== 'completed'}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1.5 shadow-sm flex-1 sm:flex-initial"
              >
                <FileCheck className="h-3.5 w-3.5" />
                {isContractCreated ? 'Tạo Thêm HĐ' : 'Tạo Hợp Đồng Tự Động'}
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>

      </div>

      {/* 5. Recent Scan Audit Logs Table */}
      <Card className="shadow-xs border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
        <CardHeader className="p-4 pb-3 border-b flex flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
              <Clock className="h-4 w-4 text-indigo-600" />
              Nhật Ký Quét Giấy Tờ Gần Đây (OCR Audit Logs)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Lịch sử phiên trích xuất tài liệu phục vụ đối soát kiểm toán
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-mono text-xs">5 Giao Dịch</Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b">
              <tr>
                <th className="py-2.5 px-4">Mã Giao Dịch</th>
                <th className="py-2.5 px-4">Loại Giấy Tờ</th>
                <th className="py-2.5 px-4">Chủ Thể / Tài Sản</th>
                <th className="py-2.5 px-4">Độ Chính Xác</th>
                <th className="py-2.5 px-4">Thời Gian</th>
                <th className="py-2.5 px-4">Trạng Thái</th>
                <th className="py-2.5 px-4 text-right">Tác Vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { code: 'OCR-9821', type: 'CCCD Gắn Chip', target: 'NGUYỄN VĂN TUẤN', score: '99.8%', time: '5 phút trước', status: 'Đã nhập hợp đồng' },
                { code: 'OCR-9820', type: 'Sổ Hồng GCNQSDĐ', target: 'Thửa đất 128 - Florida', score: '99.6%', time: '22 phút trước', status: 'Đã lưu tài sản' },
                { code: 'OCR-9819', type: 'CCCD Gắn Chip', target: 'TRẦN THỊ BÍCH NGỌC', score: '99.7%', time: '1 giờ trước', status: 'Đã lưu khách hàng' },
                { code: 'OCR-9818', type: 'Hộ Chiếu (Passport)', target: 'MICHAEL CHEN', score: '99.9%', time: '3 giờ trước', status: 'Đã tạo Booking' },
                { code: 'OCR-9817', type: 'Sổ Hồng GCNQSDĐ', target: 'Thửa đất 86 - Aqua City', score: '99.4%', time: 'Hôm qua', status: 'Đã bàn giao' }
              ].map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">{log.code}</td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{log.type}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{log.target}</td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {log.score}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{log.time}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className="text-[10px] text-indigo-700 border-indigo-200 bg-indigo-50/50">
                      {log.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button 
                      onClick={() => handleSelectSample(idx % 2 === 0 ? 'sample1' : 'sample3')}
                      className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline cursor-pointer"
                    >
                      Xem lại
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Toast Feedbacks */}
      {customerSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[700] p-4 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <div className="text-xs">
            <div className="font-bold">Đã lưu hồ sơ khách hàng thành công!</div>
            <div className="opacity-90">Họ tên: {formData.fullName || currentSample.fields.fullName} đã được thêm vào CRM.</div>
          </div>
          <Link href="/customers">
            <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-8">
              Xem Danh Bạ
            </Button>
          </Link>
        </div>
      )}

      {contractSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[700] p-4 bg-indigo-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <FileCheck className="h-5 w-5 flex-shrink-0" />
          <div className="text-xs">
            <div className="font-bold">Đã tạo Hợp Đồng Tự Động thành công!</div>
            <div className="opacity-90">Hợp đồng đã liên kết dữ liệu bóc tách CCCD của {formData.fullName || currentSample.fields.fullName}.</div>
          </div>
          <Link href="/contracts">
            <Button size="sm" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs h-8">
              Mở Hợp Đồng
            </Button>
          </Link>
        </div>
      )}

      {/* 6. MODAL 1: Cấu Hình & Tạo Hợp Đồng Tự Động */}
      {contractModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border shadow-2xl overflow-hidden flex flex-col text-slate-800 dark:text-slate-200">
            <div className="p-4 sm:p-5 border-b flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/30">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-600 text-white rounded-xl">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Tạo Hợp Đồng Tự Động từ Dữ Liệu OCR</h3>
                  <p className="text-xs text-slate-500">Tự động điền Bên Mua (Bên B) từ giấy tờ vừa bóc tách</p>
                </div>
              </div>
              <button onClick={() => setContractModalOpen(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmContract} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bên Mua (Bên B):</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formData.fullName || currentSample.fields.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số CCCD / Hộ chiếu:</span>
                  <span className="font-mono font-bold text-indigo-600">{formData.idNumber || currentSample.fields.idNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Địa chỉ thường trú:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs">{formData.address || currentSample.fields.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Chọn Dự Án:</label>
                  <select 
                    value={selectedProjectForContract}
                    onChange={(e) => setSelectedProjectForContract(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Loại Hợp Đồng:</label>
                  <select 
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs"
                  >
                    <option value="Hợp đồng đặt cọc">Hợp đồng đặt cọc</option>
                    <option value="Thỏa thuận giữ chỗ">Thỏa thuận giữ chỗ</option>
                    <option value="Hợp đồng mua bán">Hợp đồng mua bán</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Giá Trị Hợp Đồng (VNĐ):</label>
                <Input 
                  type="number" 
                  value={contractValue}
                  onChange={(e) => setContractValue(Number(e.target.value))}
                  className="font-mono font-bold text-sm h-10"
                />
                <span className="text-[11px] text-emerald-600 font-semibold">{formatCurrency(contractValue)}</span>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 rounded-xl text-amber-800 dark:text-amber-200 text-[11px]">
                Hệ thống sẽ tự động sinh mã Hợp đồng (HD-xxx), lập phụ lục 5 đợt thanh toán và chuyển tiếp sang phân hệ Quản Lý Hợp Đồng.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => setContractModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Xác Nhận Tạo Hợp Đồng
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL 2: Trích Xuất JSON Schema RESTful API */}
      {jsonModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="bg-slate-950 rounded-2xl max-w-2xl w-full border border-slate-800 shadow-2xl overflow-hidden flex flex-col text-slate-200">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <div className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Document AI OCR - JSON Response Payload</h3>
              </div>
              <button onClick={() => setJsonModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800">
                {JSON.stringify({
                  status: 'SUCCESS',
                  code: 200,
                  engine: 'Google Document AI Vision v2.4 (Enterprise)',
                  documentType: currentSample.docType,
                  category: currentSample.categoryName,
                  extractedEntities: formData,
                  confidences: currentSample.confidences,
                  metadata: {
                    latencyMs: 2150,
                    imageResolution: '1920x1080',
                    orientationCorrected: true,
                    barcodeDetected: currentSample.docType === 'cccd' ? 'QR_CODE_CHIP_ENCRYPTED' : 'NONE'
                  }
                }, null, 2)}
              </pre>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Chuẩn dữ liệu RESTful API Webhook Ready</span>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm"
                  onClick={handleCopyJSON}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold gap-1 text-xs"
                >
                  {jsonCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {jsonCopied ? 'Đã Sao Chép' : 'Sao Chép JSON'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setJsonModalOpen(false)}
                  className="border-slate-700 text-slate-300"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
