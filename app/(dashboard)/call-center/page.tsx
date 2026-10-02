"use client"

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  PhoneCall, MicOff, Mic, PhoneForwarded, User, Clock, 
  Play, Pause, BrainCircuit, Smile, Meh, Frown, Sparkles, 
  PhoneMissed, CheckCircle2, ChevronRight, X, Phone,
  PhoneOff, Volume2, VolumeX, PauseCircle, Search, Filter,
  Download, ArrowRight, BookOpen, ShieldAlert, Award,
  Sparkle, Check, Copy, MessageSquare, UserPlus, Flame
} from 'lucide-react'
import { useStore } from '@/store/useStore'
import { CallLog } from '@/types'

// Helper for DTMF sound using Web Audio API
const playTone = (freq1: number, freq2: number) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const gain = ctx.createGain()

    osc1.frequency.value = freq1
    osc2.frequency.value = freq2
    gain.gain.value = 0.05 // low comfortable volume

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start()
    osc2.start()

    setTimeout(() => {
      osc1.stop()
      osc2.stop()
      ctx.close()
    }, 120)
  } catch (e) {
    // Ignore if audio context not permitted
  }
}

const DTMF_FREQS: Record<string, [number, number]> = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477],
}

export default function CallCenterPage() {
  const { customers, callLogs, makeCall, updateCallDisposition, addCustomer } = useStore()
  
  // Navigation tab
  const [activeMainTab, setActiveMainTab] = useState<'dialer' | 'history' | 'qa' | 'scripts'>('dialer')
  
  // Softphone state
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isCalling, setIsCalling] = useState(false)
  const [callTimer, setCallTimer] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isOnHold, setIsOnHold] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeInspectorTab, setActiveInspectorTab] = useState<'summary' | 'transcript'>('summary')
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)

  // Filters for History Table
  const [searchQuery, setSearchQuery] = useState('')
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dispositionFilter, setDispositionFilter] = useState('all')

  // Modals
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showDispositionModal, setShowDispositionModal] = useState(false)
  const [showScriptModal, setShowScriptModal] = useState(false)
  const [showQAModal, setShowQAModal] = useState(false)
  const [showNewContactModal, setShowNewContactModal] = useState(false)

  // Disposition Wrap-up Form State
  const [wrapDisposition, setWrapDisposition] = useState('Hẹn xem sa bàn')
  const [wrapNotes, setWrapNotes] = useState('')
  const [lastFinishedCallId, setLastFinishedCallId] = useState<string | null>(null)

  // Transfer Form State
  const [transferAgent, setTransferAgent] = useState('Lê Hoàng Anh (Ext 103)')
  const [transferNotes, setTransferNotes] = useState('Khách hỏi chi tiết căn Penthouse The Global City')

  // New Contact Form State
  const [newCustName, setNewCustName] = useState('')
  const [newCustPhone, setNewCustPhone] = useState('')
  const [newCustProject, setNewCustProject] = useState('The Grand Manhattan')

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Set default selected call on mount
  useEffect(() => {
    if (callLogs.length > 0 && !selectedCallId) {
      setSelectedCallId(callLogs[0].id)
    }
  }, [callLogs, selectedCallId])

  // Call timer effect
  useEffect(() => {
    if (isCalling) {
      timerRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
      setCallTimer(0)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isCalling])

  // Format timer
  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const secs = sec % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleKeypad = (num: string) => {
    if (DTMF_FREQS[num]) {
      playTone(DTMF_FREQS[num][0], DTMF_FREQS[num][1])
    }
    setPhoneNumber(prev => prev + num)
  }

  const handleStartCall = () => {
    if (!phoneNumber) return
    setIsCalling(true)
    setIsMuted(false)
    setIsOnHold(false)
    showToast(`Đang kết nối cuộc gọi VoIP WebRTC tới số ${phoneNumber}...`)
  }

  const handleEndCall = () => {
    if (!isCalling) return
    setIsCalling(false)
    
    // Save call to store
    makeCall(phoneNumber)
    
    // Select latest call
    setTimeout(() => {
      const latest = useStore.getState().callLogs[0]
      if (latest) {
        setSelectedCallId(latest.id)
        setLastFinishedCallId(latest.id)
        setShowDispositionModal(true)
      }
    }, 150)

    showToast("Cuộc gọi đã kết thúc. Vui lòng ghi chú kết quả cuộc gọi!")
  }

  const handleSaveDisposition = () => {
    if (lastFinishedCallId) {
      updateCallDisposition(lastFinishedCallId, wrapDisposition, wrapNotes)
      showToast(`Đã lưu kết quả cuộc gọi: "${wrapDisposition}"`)
    }
    setShowDispositionModal(false)
    setWrapNotes('')
    setPhoneNumber('')
  }

  const handleTransferSubmit = () => {
    showToast(`Đã chuyển cuộc gọi thành công sang máy lẻ ${transferAgent}!`)
    setShowTransferModal(false)
    setIsCalling(false)
  }

  const handleCreateCustomer = () => {
    if (!newCustName.trim() || !newCustPhone.trim()) {
      showToast("Vui lòng nhập Họ tên và Số điện thoại!")
      return
    }

    addCustomer({
      name: newCustName,
      phone: newCustPhone,
      email: `${newCustName.toLowerCase().replace(/\s/g, '')}@gmail.com`,
      rank: 'Tiềm Năng',
      revenue: 0,
      assignedTo: 'Tuấn Tú',
      status: 'Đang chăm sóc'
    })

    setShowNewContactModal(false)
    showToast(`Đã tạo hồ sơ khách hàng mới: ${newCustName}!`)
    setNewCustName('')
    setNewCustPhone('')
  }

  // Active Selected Call
  const activeCall = callLogs.find(c => c.id === selectedCallId) || callLogs[0]

  // KPI Calculations
  const totalCalls = callLogs.length || 1
  const successCalls = callLogs.filter(c => c.status === 'success').length
  const connectRate = Math.round((successCalls / totalCalls) * 100)
  const positiveSentimentCount = callLogs.filter(c => c.sentiment === 'positive').length
  const positiveRate = Math.round((positiveSentimentCount / totalCalls) * 100)

  // Filtered Calls for History Tab
  const filteredCalls = useMemo(() => {
    return callLogs.filter(c => {
      const matchSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery) ||
        (c.projectName && c.projectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.notes && c.notes.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchSentiment = sentimentFilter === 'all' || c.sentiment === sentimentFilter
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      const matchDisposition = dispositionFilter === 'all' || c.disposition === dispositionFilter

      return matchSearch && matchSentiment && matchStatus && matchDisposition
    })
  }, [callLogs, searchQuery, sentimentFilter, statusFilter, dispositionFilter])

  // Export CSV Function (UTF-8 BOM)
  const handleExportCSV = () => {
    const headers = ["Mã Cuộc Gọi", "Khách Hàng", "Số Điện Thoại", "Thời Gian", "Thời Lượng", "Trạng Thái", "Cảm Xúc AI", "Dự Án", "Kết Quả (Disposition)", "Điểm QA", "Chuyên Viên", "Ghi Chú"]
    const rows = callLogs.map(c => [
      `"${c.id}"`,
      `"${c.name.replace(/"/g, '""')}"`,
      `"${c.phone}"`,
      `"${c.time}"`,
      `"${c.duration}"`,
      `"${c.status === 'success' ? 'Thành công' : 'Cuộc gọi nhỡ'}"`,
      `"${c.sentiment === 'positive' ? 'Tích cực' : c.sentiment === 'negative' ? 'Tiêu cực' : 'Trung tính'}"`,
      `"${(c.projectName || 'The Grand Manhattan').replace(/"/g, '""')}"`,
      `"${(c.disposition || 'Đã tư vấn').replace(/"/g, '""')}"`,
      c.qaScore || 88,
      `"${(c.agentName || 'Tuấn Tú (Ext 101)').replace(/"/g, '""')}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`
    ])

    const csvContent = "\\uFEFF" + [headers.join(","), ...rows.map(row => row.join(","))].join("\\r\\n")
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `Lich_Su_Cuoc_Goi_VoIP_Cloud_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Đã tải xuống file CSV lịch sử cuộc gọi và bóc băng AI!")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <PhoneCall className="h-7 w-7" />
            </span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Tổng Đài Ảo VoIP Cloud & Trợ Lý Bóc Băng AI
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Softphone gọi trực tiếp qua WebRTC, ghi âm đám mây, AI phân tích cảm xúc (NLP Sentiment) và hỗ trợ kịch bản telesale thời gian thực.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Status Badge */}
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-emerald-200 font-bold text-xs shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ext 101: Sẵn Sàng (Available)</span>
          </div>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowScriptModal(true)}
            className="border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 font-semibold"
          >
            <BookOpen className="h-4 w-4 mr-1.5" /> Kịch Bản Xử Lý Từ Chối
          </Button>

          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowQAModal(true)}
            className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
          >
            <Award className="h-4 w-4 mr-1.5 text-amber-500" /> Bảng Điểm QA
          </Button>

          <Button 
            size="sm"
            onClick={handleExportCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm"
          >
            <Download className="h-4 w-4 mr-1.5" /> Xuất Nhật Ký CSV
          </Button>
        </div>
      </div>

      {/* TOP STRATEGY METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        
        {/* Card 1: Total Calls */}
        <Card className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng Cuộc Gọi Hôm Nay</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Hoạt Động</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-slate-900">{totalCalls} Cuộc</span>
              <span className="text-xs font-bold text-emerald-600">({successCalls} kết nối)</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Chỉ tiêu ngày: <strong className="text-slate-800">50 cuộc / chuyên viên</strong>.
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Average Handling Time (AHT) */}
        <Card className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thời Lượng Gọi TB (AHT)</span>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">Chuẩn 4-8 Phút</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-blue-600">07:25</span>
              <span className="text-xs font-bold text-slate-400">phút:giây</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Thời gian nói chuyện sâu đủ để truyền tải chính sách chiết khấu.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Connect Rate */}
        <Card className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ Lệ Bắt Máy (Connect)</span>
              <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">Mục Tiêu &gt;75%</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-indigo-600">{connectRate}%</span>
              <span className="text-xs font-semibold text-emerald-600">Đạt KPI</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Số cuộc gọi nhỡ: <strong className="text-rose-600">{totalCalls - successCalls} cuộc</strong> (Cần gọi lại).
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Positive Sentiment */}
        <Card className="shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cảm Xúc Tích Cực AI</span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200">Chất Lượng Cao</Badge>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-amber-600">{positiveRate}%</span>
              <span className="text-xs font-bold text-slate-500">({positiveSentimentCount}/{totalCalls})</span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Có <strong className="text-slate-800">4 cuộc hẹn</strong> xem sa bàn trực tiếp đã chốt.
            </p>
          </CardContent>
        </Card>

      </div>

      {/* MAIN NAVIGATION TABS */}
      <Tabs value={activeMainTab} onValueChange={(val: any) => setActiveMainTab(val)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-slate-100 border border-slate-200 rounded-xl">
          <TabsTrigger value="dialer" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <Phone className="h-4 w-4 text-emerald-600" /> Bàn Phím & Cuộc Gọi Trực Tiếp
          </TabsTrigger>
          <TabsTrigger value="history" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" /> Nhật Ký & Bóc Băng Hội Thoại
          </TabsTrigger>
          <TabsTrigger value="qa" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <Award className="h-4 w-4 text-amber-500" /> Chấm Điểm QA & Kỹ Năng Sale
          </TabsTrigger>
          <TabsTrigger value="scripts" className="py-2.5 font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-600" /> Kịch Bản Xử Lý Từ Chối
          </TabsTrigger>
        </TabsList>

        {/* ========================================================
            TAB 1: BÀN PHÍM & CUỘC GỌI TRỰC TIẾP (SOFTPHONE)
        ======================================================== */}
        <TabsContent value="dialer" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* CỘT TRÁI: SOFTPHONE DIALPAD (4/12) */}
            <div className="xl:col-span-4 space-y-5">
              <Card className="shadow-lg border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-50 border-b border-slate-100 p-3.5 flex justify-between items-center">
                  <Badge variant="outline" className="bg-white font-bold text-xs text-slate-700">
                    Máy lẻ: 101 - Tuấn Tú
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-medium">SIP / WebRTC Online</span>
                </div>

                <CardContent className="p-5 pt-4">
                  {/* Phone Screen / Display */}
                  <div className={`h-24 rounded-2xl mb-5 flex flex-col items-center justify-center border shadow-inner relative transition-colors ${isCalling ? 'bg-gradient-to-r from-emerald-900 to-slate-900 text-white border-emerald-600' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
                    
                    {isCalling ? (
                      <div className="text-center space-y-1 animate-in fade-in duration-300">
                        <div className="flex items-center justify-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                            {isOnHold ? 'Đang Tạm Giữ (On Hold)' : 'Đang Đàm Thoại'}
                          </span>
                        </div>
                        <div className="text-2xl font-black font-mono tracking-wider text-white">
                          {formatTimer(callTimer)}
                        </div>
                        <div className="text-xs font-medium text-emerald-200 font-mono">
                          {phoneNumber}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className={`text-2xl md:text-3xl font-black tracking-wider ${phoneNumber ? 'text-slate-900' : 'text-slate-300'}`}>
                          {phoneNumber || 'Nhập số điện thoại...'}
                        </div>
                        {phoneNumber && (
                          <div className="text-xs font-bold text-indigo-600 mt-1 uppercase flex items-center gap-1">
                            {customers.find(c => c.phone.replace(/\\s/g,'') === phoneNumber.replace(/\\s/g,''))?.name || 'Khách vãng lai'}
                          </div>
                        )}
                        {phoneNumber && (
                          <button 
                            type="button"
                            onClick={() => setPhoneNumber(prev => prev.slice(0, -1))}
                            className="absolute right-3 text-slate-400 hover:text-rose-500 p-1.5 transition-colors"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </>
                    )}
                  </div>

                  {/* Keypad Grid (3x4) */}
                  <div className="grid grid-cols-3 gap-2.5 mb-6 px-1">
                    {[
                      { num: '1', char: '' }, { num: '2', char: 'ABC' }, { num: '3', char: 'DEF' },
                      { num: '4', char: 'GHI' }, { num: '5', char: 'JKL' }, { num: '6', char: 'MNO' },
                      { num: '7', char: 'PQRS' }, { num: '8', char: 'TUV' }, { num: '9', char: 'WXYZ' },
                      { num: '*', char: '' }, { num: '0', char: '+' }, { num: '#', char: '' }
                    ].map((key, i) => (
                      <button 
                        key={i} 
                        type="button"
                        onClick={() => handleKeypad(key.num)}
                        disabled={isCalling}
                        className="h-14 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 active:scale-95 transition-all shadow-sm border border-slate-200 hover:border-indigo-300 disabled:opacity-50"
                      >
                        <span className="text-xl font-black text-slate-800">{key.num}</span>
                        <span className="text-[8px] font-bold text-slate-400 h-2.5 uppercase tracking-widest">{key.char}</span>
                      </button>
                    ))}
                  </div>

                  {/* Call Action Buttons */}
                  {isCalling ? (
                    <div className="flex justify-center items-center gap-4">
                      {/* Mute */}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          setIsMuted(!isMuted)
                          showToast(isMuted ? "Đã bật mic trở lại" : "Đã tắt mic (Muted)")
                        }}
                        className={`h-12 w-12 rounded-full border-slate-300 transition-all ${isMuted ? 'bg-amber-100 text-amber-700 border-amber-300' : 'text-slate-600 hover:bg-slate-100'}`}
                        title={isMuted ? "Bật Mic" : "Tắt Mic"}
                      >
                        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                      </Button>

                      {/* End Call Button */}
                      <Button 
                        size="icon" 
                        onClick={handleEndCall}
                        className="h-16 w-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl hover:scale-105 transition-all active:scale-95"
                        title="Kết thúc cuộc gọi"
                      >
                        <PhoneOff className="h-7 w-7 fill-current" />
                      </Button>

                      {/* Transfer */}
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setShowTransferModal(true)}
                        className="h-12 w-12 rounded-full border-slate-300 text-slate-600 hover:bg-slate-100 shadow-sm"
                        title="Chuyển cuộc gọi"
                      >
                        <PhoneForwarded className="h-5 w-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center gap-5">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          if (phoneNumber) {
                            setNewCustPhone(phoneNumber)
                            setShowNewContactModal(true)
                          } else {
                            showToast("Vui lòng nhập số điện thoại trước!")
                          }
                        }}
                        className="h-12 w-12 rounded-full border-slate-300 text-slate-500 hover:bg-slate-100"
                        title="Tạo nhanh khách hàng mới"
                      >
                        <UserPlus className="h-5 w-5" />
                      </Button>

                      {/* Start Call Button */}
                      <Button 
                        size="icon" 
                        onClick={handleStartCall}
                        disabled={!phoneNumber}
                        className={`h-16 w-16 rounded-full shadow-xl transition-all active:scale-95 ${phoneNumber ? 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-105' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        title="Bắt đầu gọi"
                      >
                        <Phone className="h-7 w-7 fill-current" />
                      </Button>

                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          setPhoneNumber('0909123456')
                          showToast("Đã điền số mẫu của khách VIP Nguyễn Văn A")
                        }}
                        className="h-12 w-12 rounded-full border-slate-300 text-slate-500 hover:bg-slate-100"
                        title="Thử số mẫu"
                      >
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                      </Button>
                    </div>
                  )}

                </CardContent>
              </Card>

              {/* Quick History List */}
              <Card className="shadow-sm border border-slate-200 rounded-xl overflow-hidden">
                <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold text-slate-700 uppercase">
                    Cuộc Gọi Gần Đây ({callLogs.length})
                  </CardTitle>
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => setActiveMainTab('history')}
                    className="text-xs text-blue-600 font-bold p-0 h-auto"
                  >
                    Xem tất cả &gt;
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex flex-col divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                    {callLogs.slice(0, 5).map((c) => {
                      const isSelected = selectedCallId === c.id

                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCallId(c.id)}
                          className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`p-2 rounded-full ${c.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {c.status === 'success' ? <PhoneCall className="h-3.5 w-3.5" /> : <PhoneMissed className="h-3.5 w-3.5" />}
                            </span>
                            <div>
                              <div className="font-bold text-xs text-slate-900">{c.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{c.phone}</div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-[11px] font-mono font-bold text-slate-700">{c.duration}</div>
                            <span className="text-[10px] text-slate-400">{c.time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* CỘT PHẢI: AI RECORDING INSPECTOR & TRANSCRIPT (8/12) */}
            {activeCall && (
              <div className="xl:col-span-8 space-y-6">
                
                {/* Audio Player Card */}
                <Card className="shadow-lg bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border-0 overflow-hidden relative rounded-2xl">
                  <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                    <BrainCircuit className="w-64 h-64 -mt-16 -mr-16 text-cyan-400" />
                  </div>

                  <CardContent className="p-5 md:p-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-5">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-white/20 text-white border-none font-bold text-[10px]">
                            {activeCall.status === 'success' ? '● Cuộc gọi thành công' : '✕ Cuộc gọi nhỡ'}
                          </Badge>
                          <Badge variant="outline" className="bg-white/10 text-cyan-200 border-white/20 text-[10px] font-bold">
                            {activeCall.projectName || 'The Grand Manhattan'}
                          </Badge>
                          {activeCall.disposition && (
                            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-bold">
                              {activeCall.disposition}
                            </Badge>
                          )}
                        </div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <User className="h-5 w-5 opacity-70" /> {activeCall.name}
                        </h2>
                        <p className="text-indigo-200 text-xs mt-1 font-mono">
                          {activeCall.phone} • Chuyên viên: <strong>{activeCall.agentName || 'Tuấn Tú'}</strong>
                        </p>
                      </div>

                      <div className="bg-black/40 rounded-xl p-3 backdrop-blur-md border border-white/10 text-center min-w-[120px]">
                        <div className="text-3xl font-mono font-black text-emerald-400">{activeCall.duration}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mt-0.5">Thời Lượng</div>
                      </div>
                    </div>

                    {/* Audio Waveform Player Bar */}
                    <div className="bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/10 space-y-3">
                      <div className="flex items-center gap-4">
                        <Button 
                          onClick={() => {
                            setIsPlaying(!isPlaying)
                            showToast(isPlaying ? "Đã tạm dừng phát ghi âm" : "Đang phát file ghi âm cuộc gọi...")
                          }}
                          size="icon" 
                          className="h-11 w-11 rounded-full bg-white text-indigo-900 hover:bg-indigo-50 shadow-md shrink-0 hover:scale-105 transition-transform"
                        >
                          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 ml-0.5 fill-current" />}
                        </Button>

                        <div className="flex-1 space-y-1.5">
                          <div className="flex justify-between text-xs font-mono font-bold text-indigo-200">
                            <span>{isPlaying ? '01:45' : '00:00'}</span>
                            <span>{activeCall.duration}</span>
                          </div>
                          
                          {/* Simulated Waveform Bars */}
                          <div className="h-8 flex items-end gap-1 cursor-pointer">
                            {[25, 45, 75, 30, 90, 60, 40, 80, 55, 35, 70, 85, 40, 65, 95, 80, 50, 60, 30, 45, 80, 90, 40, 70, 60, 35, 75, 85, 60, 45, 90, 70, 50, 40, 65, 80, 95, 60, 40, 20].map((height, i) => (
                              <div 
                                key={i}
                                className={`w-full rounded-t-sm transition-all duration-300 ${i < (isPlaying ? 16 : 0) ? 'bg-emerald-400' : 'bg-white/20 hover:bg-white/40'}`}
                                style={{ height: `${height}%` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-indigo-200 pt-1 border-t border-white/10">
                        <span>Định dạng: WAV 16kHz • Stereo (Sale L / Khách R)</span>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => showToast(`Đã gửi Zalo Sales Kit dự án ${activeCall.projectName || 'The Grand Manhattan'} cho khách!`)}
                            className="h-7 text-xs text-white hover:bg-white/10 font-bold"
                          >
                            <MessageSquare className="h-3.5 w-3.5 mr-1" /> Gửi Zalo Sales Kit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setWrapNotes(activeCall.notes || '')
                              setWrapDisposition(activeCall.disposition || 'Hẹn xem sa bàn')
                              setLastFinishedCallId(activeCall.id)
                              setShowDispositionModal(true)
                            }}
                            className="h-7 text-xs text-emerald-300 hover:bg-white/10 font-bold"
                          >
                            Phân Loại Lại
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Sentiment Analysis & Summary/Transcript Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* AI Sentiment Card */}
                  <Card className="shadow-sm border border-slate-200 rounded-2xl">
                    <CardHeader className="pb-3 border-b bg-slate-50/70">
                      <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-600" /> Phân Tích Cảm Xúc (NLP Sentiment)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-5">
                      {/* Donut Score Visual */}
                      <div className="flex justify-center">
                        <div className="relative w-36 h-36 flex items-center justify-center">
                          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path 
                              className={`${activeCall.sentiment === 'positive' ? 'text-emerald-500' : activeCall.sentiment === 'negative' ? 'text-rose-500' : 'text-amber-500'} transition-all duration-1000 ease-out`}
                              strokeWidth="4" 
                              strokeDasharray={`${Math.max(activeCall.scores.positive, activeCall.scores.neutral, activeCall.scores.negative)}, 100`} 
                              stroke="currentColor" 
                              fill="none" 
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className={`text-3xl font-black ${activeCall.sentiment === 'positive' ? 'text-emerald-600' : activeCall.sentiment === 'negative' ? 'text-rose-600' : 'text-amber-600'}`}>
                              {Math.max(activeCall.scores.positive, activeCall.scores.neutral, activeCall.scores.negative)}%
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">
                              {activeCall.sentiment === 'positive' ? 'Tích Cực' : activeCall.sentiment === 'negative' ? 'Tiêu Cực' : 'Trung Tính'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Score Bars */}
                      <div className="space-y-3 pt-2">
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <Smile className="h-4 w-4 text-emerald-500" /> Tích cực (Khen ngợi & Thích thú)
                            </span>
                            <span className="text-emerald-600">{activeCall.scores.positive}%</span>
                          </div>
                          <Progress value={activeCall.scores.positive} className="h-2 bg-slate-100 [&>div]:bg-emerald-500" />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <Meh className="h-4 w-4 text-amber-500" /> Trung tính (Hỏi thông tin cơ bản)
                            </span>
                            <span className="text-amber-600">{activeCall.scores.neutral}%</span>
                          </div>
                          <Progress value={activeCall.scores.neutral} className="h-2 bg-slate-100 [&>div]:bg-amber-500" />
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="flex items-center gap-1.5 text-slate-700">
                              <Frown className="h-4 w-4 text-rose-500" /> Tiêu cực (Khách bận / Phàn nàn)
                            </span>
                            <span className="text-rose-600">{activeCall.scores.negative}%</span>
                          </div>
                          <Progress value={activeCall.scores.negative} className="h-2 bg-slate-100 [&>div]:bg-rose-500" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary & Transcript Card */}
                  <Card className="shadow-sm border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
                    <CardHeader className="p-0 border-b bg-slate-50">
                      <div className="flex">
                        <button 
                          type="button"
                          className={`flex-1 py-3 font-bold text-xs border-b-2 transition-colors ${activeInspectorTab === 'summary' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                          onClick={() => setActiveInspectorTab('summary')}
                        >
                          Key Takeaways & AI Tóm Tắt
                        </button>
                        <button 
                          type="button"
                          className={`flex-1 py-3 font-bold text-xs border-b-2 transition-colors ${activeInspectorTab === 'transcript' ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}
                          onClick={() => setActiveInspectorTab('transcript')}
                        >
                          Bóc Băng Hội Thoại ({activeCall.transcript.length})
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 flex-1 bg-white">
                      {activeInspectorTab === 'summary' ? (
                        <div className="space-y-4">
                          <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2">
                            <h4 className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                              <CheckCircle2 className="h-4 w-4 text-blue-600" /> Nội Dung Then Chốt
                            </h4>
                            <ul className="space-y-2 text-xs text-slate-700 leading-relaxed font-medium">
                              {activeCall.takeaways.map((t, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                              <span className="text-[10px] text-slate-500 uppercase font-bold">Tỷ Lệ Sale Nói</span>
                              <div className="text-xl font-black text-indigo-600 mt-0.5">{activeCall.metrics.agentTalkRatio}</div>
                              <span className="text-[10px] text-slate-400 font-medium">Khuyến nghị 40-50%</span>
                            </div>

                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-center">
                              <span className="text-[10px] text-slate-500 uppercase font-bold">Tốc Độ Nói</span>
                              <div className="text-xl font-black text-emerald-600 mt-0.5">
                                {activeCall.metrics.speechRate} <span className="text-xs font-normal text-slate-400">từ/p</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">Chuẩn: 120-140 từ/phút</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-[280px] overflow-y-auto space-y-3 pr-1 text-xs">
                          {activeCall.transcript.map((msg, idx) => (
                            <div key={idx} className={`flex flex-col gap-1 ${msg.speaker === 'customer' ? 'items-end' : 'items-start'}`}>
                              <span className={`text-[10px] font-bold uppercase tracking-wider ${msg.speaker === 'agent' ? 'text-indigo-600' : 'text-emerald-600'}`}>
                                {msg.speaker === 'agent' ? `Sale ${activeCall.agentName || 'Tuấn Tú'}` : `Khách ${activeCall.name}`} ({msg.time})
                              </span>
                              <div className={`p-3 rounded-2xl max-w-[88%] leading-relaxed font-medium shadow-sm ${msg.speaker === 'agent' ? 'bg-slate-100 text-slate-800 rounded-tl-sm' : 'bg-emerald-50 text-emerald-950 border border-emerald-100 rounded-tr-sm'}`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                </div>

              </div>
            )}

          </div>
        </TabsContent>

        {/* ========================================================
            TAB 2: NHẬT KÝ & BÓC BĂNG TOÀN DIỆN (CALL RECORDS)
        ======================================================== */}
        <TabsContent value="history" className="space-y-5 mt-6">
          {/* Filters Bar */}
          <Card className="shadow-sm border border-slate-200">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
                {/* Search */}
                <div className="md:col-span-4 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Tìm theo tên khách, SĐT, dự án, ghi chú..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 text-sm"
                  />
                </div>

                {/* Sentiment Filter */}
                <div className="md:col-span-3">
                  <select 
                    value={sentimentFilter}
                    onChange={e => setSentimentFilter(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Cảm xúc: Tất cả</option>
                    <option value="positive">Tích cực (Khen & Chốt)</option>
                    <option value="neutral">Trung tính (Hỏi thông tin)</option>
                    <option value="negative">Tiêu cực (Bận / Phàn nàn)</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="md:col-span-2">
                  <select 
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Trạng thái: Tất cả</option>
                    <option value="success">Thành công</option>
                    <option value="missed">Cuộc gọi nhỡ</option>
                  </select>
                </div>

                {/* Disposition Filter */}
                <div className="md:col-span-3">
                  <select 
                    value={dispositionFilter}
                    onChange={e => setDispositionFilter(e.target.value)}
                    className="w-full h-10 px-3 text-xs font-semibold rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Kết quả: Tất cả</option>
                    <option value="Hẹn xem sa bàn">Hẹn xem sa bàn</option>
                    <option value="Khách quan tâm">Khách quan tâm</option>
                    <option value="Khách bận / Gọi lại sau">Khách bận / Gọi lại sau</option>
                    <option value="Tư vấn vay vốn">Tư vấn vay vốn</option>
                    <option value="Chốt cọc thành công">Chốt cọc thành công</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Records Table */}
          <Card className="shadow-sm border border-slate-200">
            <CardHeader className="py-3 px-5 border-b bg-slate-50/70 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-800">
                  Nhật Ký Cuộc Gọi Chi Tiết ({filteredCalls.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Dữ liệu ghi âm, bóc băng tự động và chấm điểm QA của toàn bộ đội ngũ Telesale.
                </CardDescription>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleExportCSV}
                className="font-bold text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1" /> Xuất File CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Khách Hàng / SĐT</th>
                      <th className="py-3 px-4">Dự Án</th>
                      <th className="py-3 px-4">Thời Lượng</th>
                      <th className="py-3 px-4">Cảm Xúc AI</th>
                      <th className="py-3 px-4">Kết Quả Cuộc Gọi</th>
                      <th className="py-3 px-4">Điểm QA</th>
                      <th className="py-3 px-4">Chuyên Viên</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCalls.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{c.name}</div>
                          <div className="font-mono text-slate-400">{c.phone}</div>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {c.projectName || 'The Grand Manhattan'}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {c.duration}
                          <div className="text-[10px] text-slate-400 font-normal">{c.time}</div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`text-[10px] font-bold ${c.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : c.sentiment === 'negative' ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
                            {c.sentiment === 'positive' ? 'Tích cực' : c.sentiment === 'negative' ? 'Tiêu cực' : 'Trung tính'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-white text-slate-700 font-bold text-[10px]">
                            {c.disposition || 'Đã liên hệ'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-black text-indigo-600">
                          {c.qaScore || 88}/100
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-600">
                          {c.agentName || 'Tuấn Tú (Ext 101)'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedCallId(c.id)
                              setActiveMainTab('dialer')
                            }}
                            className="font-bold text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            Chi tiết & Bóc băng &gt;
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ========================================================
            TAB 3: CHẤM ĐIỂM QA & KỸ NĂNG SALE (QUALITY AUDIT)
        ======================================================== */}
        <TabsContent value="qa" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Scorecard Overview - 7 cols */}
            <Card className="lg:col-span-7 shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-800">
                      Bộ Tiêu Chuẩn Đánh Giá Cuộc Gọi Telesale (AI Quality Scorecard)
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500">
                      AI tự động phân tích bóc băng và chấm điểm theo 5 tiêu chí nghiệp vụ BĐS.
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 font-black text-sm px-3 py-1">
                    Điểm TB: 91 / 100 (Hạng A)
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-5 space-y-4">
                {/* Criterion 1 */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>1. Chào hỏi đúng chuẩn nhận diện thương hiệu</span>
                    <span className="text-emerald-600">20 / 20 Điểm (100%)</span>
                  </div>
                  <Progress value={100} className="h-2 bg-slate-200 [&>div]:bg-emerald-500" />
                  <p className="text-[11px] text-slate-500">
                    Xưng danh đầy đủ tên chuyên viên, tên dự án và đại lý phân phối chính thức.
                  </p>
                </div>

                {/* Criterion 2 */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>2. Lắng nghe nhu cầu & Tỷ lệ nói (Talk Ratio)</span>
                    <span className="text-emerald-600">18 / 20 Điểm (90%)</span>
                  </div>
                  <Progress value={90} className="h-2 bg-slate-200 [&>div]:bg-emerald-500" />
                  <p className="text-[11px] text-slate-500">
                    Thời lượng Sale nói chiếm trung bình 45%, nhường không gian cho khách hàng chia sẻ ngân sách.
                  </p>
                </div>

                {/* Criterion 3 */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>3. Nắm vững bảng giá & Chính sách ngân hàng</span>
                    <span className="text-emerald-600">20 / 20 Điểm (100%)</span>
                  </div>
                  <Progress value={100} className="h-2 bg-slate-200 [&>div]:bg-emerald-500" />
                  <p className="text-[11px] text-slate-500">
                    Giải thích rõ ràng gói vay 70%, ân hạn nợ gốc 24 tháng và chiết khấu thanh toán sớm 8%.
                  </p>
                </div>

                {/* Criterion 4 */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>4. Kêu gọi hành động (Call To Action - Hẹn xem sa bàn)</span>
                    <span className="text-indigo-600">19 / 20 Điểm (95%)</span>
                  </div>
                  <Progress value={95} className="h-2 bg-slate-200 [&>div]:bg-indigo-500" />
                  <p className="text-[11px] text-slate-500">
                    Chốt thời gian cụ thể (sáng thứ Bảy/chiều Chủ Nhật) đón khách tại Sales Gallery.
                  </p>
                </div>

                {/* Criterion 5 */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>5. Thái độ nhã nhặn khi khách từ chối</span>
                    <span className="text-amber-600">14 / 20 Điểm (70%)</span>
                  </div>
                  <Progress value={70} className="h-2 bg-slate-200 [&>div]:bg-amber-500" />
                  <p className="text-[11px] text-slate-500">
                    Một số chuyên viên còn cúp máy vội khi khách báo bận, cần xin phép kết nối Zalo.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Coaching Tips - 5 cols */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="shadow-sm border border-indigo-200 bg-indigo-50/30">
                <CardHeader className="pb-3 border-b border-indigo-100">
                  <CardTitle className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" /> AI Huấn Luyện Kỹ Năng (Coaching Tips)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3 text-xs text-indigo-950 space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-indigo-100 space-y-1">
                    <strong className="text-indigo-900 font-bold block">1. Kỹ năng đặt câu hỏi mở:</strong>
                    <p className="leading-relaxed text-slate-600">
                      Thay vì hỏi *"Anh có mua căn 2PN không?"*, hãy hỏi *"Gia đình mình dự kiến mua để ở ngay hay đầu tư tích sản đón sóng hạ tầng ạ?"*.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-indigo-100 space-y-1">
                    <strong className="text-indigo-900 font-bold block">2. Nhịp độ nói chuyện:</strong>
                    <p className="leading-relaxed text-slate-600">
                      Giữ tốc độ từ <strong>120 - 130 từ/phút</strong>. Khi khách hỏi về giá tiền tỷ, hạ giọng nhẹ nhàng, tạo cảm giác an tâm và uy tín.
                    </p>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-indigo-100 space-y-1">
                    <strong className="text-indigo-900 font-bold block">3. Chốt hẹn kép (Alternative Choice):</strong>
                    <p className="leading-relaxed text-slate-600">
                      Đưa ra 2 lựa chọn: *"Thứ Bảy lúc 9h sáng hay Chủ Nhật 15h chiều thuận tiện cho anh hơn ạ?"*.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </TabsContent>

        {/* ========================================================
            TAB 4: KỊCH BẢN XỬ LÝ TỪ CHỐI (OBJECTION HANDLING)
        ======================================================== */}
        <TabsContent value="scripts" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Situation 1 */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Tình huống 1: Khách chê giá dự án cao hơn khu vực</span>
                  <Badge variant="outline" className="bg-white text-blue-600 font-bold text-[10px]">Thường Gặp Nhất</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="p-3 bg-rose-50 rounded-lg text-rose-900 font-medium">
                  <strong>Khách nói:</strong> "Dự án bên em giá 90 - 100 triệu/m2 chát quá, bên kia sông có 60 triệu à!"
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-950 font-medium space-y-1.5 leading-relaxed">
                  <strong className="text-emerald-900 font-bold block">Kịch bản Sale đối thoại:</strong>
                  <p>
                    "Dạ em rất hiểu băn khoăn của anh ạ. Mức giá 90 triệu/m2 bên em đã bao gồm tiêu chuẩn bàn giao full nội thất cao cấp nhập khẩu Kohler, kính Low-E 3 lớp cách âm và hệ sinh thái 36ha công viên mà không dự án nào cùng tầm có được."
                  </p>
                  <p>
                    "Thứ Bảy này em mời anh qua mục sở thị nhà mẫu để thấy sự khác biệt về chất lượng hoàn thiện anh nhé!"
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard?.writeText("Dạ em gửi anh bảng so sánh suất đầu tư The Grand Manhattan vs các dự án lân cận qua Zalo...")
                    showToast("Đã copy kịch bản mẫu vào clipboard!")
                  }}
                  className="w-full text-xs font-bold"
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Mẫu Tin Nhắn Zalo
                </Button>
              </CardContent>
            </Card>

            {/* Situation 2 */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Tình huống 2: Khách e ngại đường xa hoặc kẹt xe</span>
                  <Badge variant="outline" className="bg-white text-blue-600 font-bold text-[10px]">Hạ Tầng</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="p-3 bg-rose-50 rounded-lg text-rose-900 font-medium">
                  <strong>Khách nói:</strong> "Dự án Aqua City tận Đồng Nai xa quá em, đi lại bất tiện!"
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-950 font-medium space-y-1.5 leading-relaxed">
                  <strong className="text-emerald-900 font-bold block">Kịch bản Sale đối thoại:</strong>
                  <p>
                    "Dạ đúng là nếu đi đường cũ thì hơi xa ạ. Nhưng hiện cầu Vàm Cái Sứt và đường Hương Lộ 2 nối thẳng lên cao tốc Long Thành sắp thông xe kỹ thuật, từ trung tâm qua chỉ mất 20 phút chạy xe thôi ạ."
                  </p>
                  <p>
                    "Cuối tuần bên em có du thuyền đón anh chị từ bến Bạch Đằng qua dự án vừa ngắm sông vừa trải nghiệm, em xin phép đặt vé mời cho gia đình mình nhé!"
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard?.writeText("Cuối tuần bên em có du thuyền đón anh chị từ bến Bạch Đằng qua Aqua City...")
                    showToast("Đã copy kịch bản mẫu vào clipboard!")
                  }}
                  className="w-full text-xs font-bold"
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Mẫu Tin Nhắn Zalo
                </Button>
              </CardContent>
            </Card>

            {/* Situation 3 */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Tình huống 3: Khách báo bận họp, không có thời gian</span>
                  <Badge variant="outline" className="bg-white text-blue-600 font-bold text-[10px]">Thời Điểm</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="p-3 bg-rose-50 rounded-lg text-rose-900 font-medium">
                  <strong>Khách nói:</strong> "Anh đang họp bận lắm nhé, đừng gọi nữa phiền quá!"
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-950 font-medium space-y-1.5 leading-relaxed">
                  <strong className="text-emerald-900 font-bold block">Kịch bản Sale đối thoại:</strong>
                  <p>
                    "Dạ em xin lỗi đã làm phiền trong lúc anh đang bận ạ! Em xin phép kết nối qua Zalo gửi anh bản tóm tắt 3 trang ngắn gọn về bảng giá để anh xem lúc rảnh, em không gọi làm phiền nữa đâu ạ."
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard?.writeText("Dạ em Tuấn Tú vừa liên hệ, em xin gửi anh brochure tóm tắt qua Zalo...")
                    showToast("Đã copy kịch bản mẫu vào clipboard!")
                  }}
                  className="w-full text-xs font-bold"
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Mẫu Tin Nhắn Zalo
                </Button>
              </CardContent>
            </Card>

            {/* Situation 4 */}
            <Card className="shadow-sm border border-slate-200">
              <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Tình huống 4: Khách lo ngại lãi suất thả nổi sau ưu đãi</span>
                  <Badge variant="outline" className="bg-white text-blue-600 font-bold text-[10px]">Tài Chính</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="p-3 bg-rose-50 rounded-lg text-rose-900 font-medium">
                  <strong>Khách nói:</strong> "Hết 2 năm hỗ trợ lãi suất 0% thì ngân hàng thả nổi lên 13-14% sao gánh nổi em?"
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-950 font-medium space-y-1.5 leading-relaxed">
                  <strong className="text-emerald-900 font-bold block">Kịch bản Sale đối thoại:</strong>
                  <p>
                    "Dạ Vietcombank cam kết biên độ lãi suất sau ưu đãi chỉ cộng 3.5% trên lãi suất huy động 24 tháng, hiện rơi vào khoảng 8.5 - 9.5%/năm thôi ạ."
                  </p>
                  <p>
                    "Hơn nữa lúc đó dự án đã bàn giao, anh có thể khai thác cho thuê đạt dòng tiền 30 - 45 triệu/tháng để bù trừ trực tiếp vào tiền lãi ngân hàng."
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard?.writeText("Dạ em gửi anh bảng tính bài toán dòng tiền cho thuê bù lãi suất sau 2 năm...")
                    showToast("Đã copy kịch bản mẫu vào clipboard!")
                  }}
                  className="w-full text-xs font-bold"
                >
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Mẫu Tin Nhắn Zalo
                </Button>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

      </Tabs>

      {/* ========================================================
          MODAL 1: CHUYỂN CUỘC GỌI NỘI BỘ (CALL TRANSFER)
      ======================================================== */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PhoneForwarded className="h-5 w-5 text-indigo-600" /> Chuyển Cuộc Gọi Sang Máy Lẻ Nội Bộ
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Chuyển tiếp cuộc gọi cho chuyên viên phụ trách dự án hoặc bộ phận thẩm định pháp lý/tín dụng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3 text-xs">
            <div>
              <Label className="font-bold text-slate-700">Chọn máy lẻ chuyên viên nhận chuyển</Label>
              <select 
                value={transferAgent}
                onChange={e => setTransferAgent(e.target.value)}
                className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="Lê Hoàng Anh (Ext 103)">Lê Hoàng Anh (Ext 103) - Chuyên gia The Global City</option>
                <option value="Thanh Hà (Ext 102)">Thanh Hà (Ext 102) - Chuyên gia Novaworld Phan Thiết</option>
                <option value="Bảo Trần (Ext 104)">Bảo Trần (Ext 104) - Pháp lý & HĐMB</option>
                <option value="Phạm Thu Hà (Ext 105)">Phạm Thu Hà (Ext 105) - Hỗ trợ gói vay Vietcombank</option>
              </select>
            </div>

            <div>
              <Label className="font-bold text-slate-700">Ghi chú bối cảnh cuộc gọi cho chuyên viên nhận</Label>
              <Textarea 
                value={transferNotes}
                onChange={e => setTransferNotes(e.target.value)}
                rows={3}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setShowTransferModal(false)}>Hủy</Button>
            <Button size="sm" onClick={handleTransferSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Xác Nhận Chuyển Cuộc Gọi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 2: GHI CHÚ & PHÂN LOẠI KẾT QUẢ (DISPOSITION WRAP-UP)
      ======================================================== */}
      <Dialog open={showDispositionModal} onOpenChange={setShowDispositionModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Phân Loại Kết Quả Cuộc Gọi (Disposition)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Ghi nhận kết quả đàm thoại để hệ thống tự động lên lịch nhắc nhở follow-up trong CRM.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3 text-xs">
            <div>
              <Label className="font-bold text-slate-700">Kết quả đàm thoại *</Label>
              <select 
                value={wrapDisposition}
                onChange={e => setWrapDisposition(e.target.value)}
                className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white font-semibold"
              >
                <option value="Hẹn xem sa bàn">Hẹn xem sa bàn (Hot Deal) ⭐</option>
                <option value="Khách quan tâm">Khách quan tâm (Gửi thêm Sales Kit)</option>
                <option value="Khách bận / Gọi lại sau">Khách bận / Gọi lại sau</option>
                <option value="Tư vấn vay vốn">Tư vấn vay vốn ngân hàng</option>
                <option value="Khiếu nại tiến độ">Khiếu nại tiến độ bàn giao</option>
                <option value="Chốt cọc thành công">Chốt cọc thành công 🎉</option>
                <option value="Không nghe máy">Không nghe máy</option>
                <option value="Sai số / Không có nhu cầu">Sai số / Không có nhu cầu</option>
              </select>
            </div>

            <div>
              <Label className="font-bold text-slate-700">Ghi chú chi tiết cho cuộc gọi này</Label>
              <Textarea 
                value={wrapNotes}
                onChange={e => setWrapNotes(e.target.value)}
                placeholder="Ghi nhận căn hộ khách quan tâm, ngân sách, lịch hẹn..."
                rows={4}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button size="sm" onClick={handleSaveDisposition} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Lưu Kết Quả & Hoàn Tất Cuộc Gọi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 3: KỊCH BẢN XỬ LÝ TỪ CHỐI NHANH
      ======================================================== */}
      <Dialog open={showScriptModal} onOpenChange={setShowScriptModal}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" /> Cẩm Nang Xử Lý Từ Chối Trong Lúc Gọi
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Mẹo đối thoại nhanh dành cho chuyên viên khi khách đưa ra rào cản.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-3 text-xs max-h-[380px] overflow-y-auto">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-indigo-900 font-bold block">1. Khi khách bảo "Giá cao quá":</strong>
              <p className="text-slate-600 leading-relaxed">
                Nhấn mạnh suất đầu tư tính trên m2 thông thủy, gói hoàn thiện nội thất và chính sách thanh toán sớm 70% chiết khấu 8%.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-indigo-900 font-bold block">2. Khi khách bảo "Chưa có nhu cầu":</strong>
              <p className="text-slate-600 leading-relaxed">
                Xin phép kết bạn Zalo gửi bản tin phân tích xu hướng quy hoạch hạ tầng khu Đông TP.HCM để tham khảo trước.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <strong className="text-indigo-900 font-bold block">3. Khi khách hỏi pháp lý:</strong>
              <p className="text-slate-600 leading-relaxed">
                Khẳng định 100% rổ hàng ký quỹ đều có Giấy phép xây dựng, quy hoạch 1/500 và bảo lãnh tài chính ngân hàng loại 1.
              </p>
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button size="sm" onClick={() => setShowScriptModal(false)} className="w-full">
              Đóng Cẩm Nang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 4: BẢNG ĐIỂM QA AUDIT CHẤT LƯỢNG
      ======================================================== */}
      <Dialog open={showQAModal} onOpenChange={setShowQAModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" /> Bảng Điểm Kiểm Tra Chất Lượng (QA Audit)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Chi tiết đánh giá kỹ năng chuyên viên theo thang điểm 100 của Phòng Đào Tạo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-3 text-xs">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex justify-between items-center">
              <div>
                <strong className="text-amber-900 font-bold text-sm block">Tổng Điểm Chuyên Viên: 91 / 100</strong>
                <span className="text-amber-700">Phân loại: Chuyên viên Xuất Sắc (Cấp Senior)</span>
              </div>
              <Badge className="bg-amber-500 text-white font-black text-sm">Hạng A</Badge>
            </div>

            <div className="space-y-2 border-t pt-2 text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Tuân thủ kịch bản chào hỏi:</span>
                <strong className="text-slate-900">20 / 20</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Khả năng lắng nghe & nhịp điệu:</span>
                <strong className="text-slate-900">18 / 20</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Kiến thức sản phẩm & ngân hàng:</span>
                <strong className="text-slate-900">20 / 20</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Năng lực chốt lịch hẹn CTA:</span>
                <strong className="text-slate-900">19 / 20</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Xử lý tình huống từ chối:</span>
                <strong className="text-slate-900">14 / 20</strong>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button size="sm" onClick={() => setShowQAModal(false)} className="w-full">
              Đóng Bảng Điểm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================
          MODAL 5: TẠO NHANH HỒ SƠ KHÁCH HÀNG TỪ SỐ ĐT
      ======================================================== */}
      <Dialog open={showNewContactModal} onOpenChange={setShowNewContactModal}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-indigo-600" /> Tạo Nhanh Hồ Sơ Khách Hàng
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Lưu thông tin khách hàng tiềm năng vừa đàm thoại vào CRM.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-3 text-xs">
            <div>
              <Label className="font-bold text-slate-700">Họ và tên khách hàng *</Label>
              <Input 
                value={newCustName}
                onChange={e => setNewCustName(e.target.value)}
                placeholder="Ví dụ: Anh Nguyễn Hoàng Long"
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="font-bold text-slate-700">Số điện thoại *</Label>
              <Input 
                value={newCustPhone}
                onChange={e => setNewCustPhone(e.target.value)}
                className="mt-1 h-9 text-xs font-mono"
              />
            </div>

            <div>
              <Label className="font-bold text-slate-700">Dự án quan tâm</Label>
              <select 
                value={newCustProject}
                onChange={e => setNewCustProject(e.target.value)}
                className="w-full mt-1 h-9 px-3 text-xs rounded-md border border-slate-200 bg-white"
              >
                <option value="The Grand Manhattan">The Grand Manhattan (Quận 1)</option>
                <option value="Aqua City">Aqua City (Đồng Nai)</option>
                <option value="The Global City">The Global City (Thủ Đức)</option>
                <option value="Novaworld Phan Thiết">Novaworld Phan Thiết</option>
                <option value="Vinhomes Grand Park">Vinhomes Grand Park</option>
              </select>
            </div>
          </div>

          <DialogFooter className="border-t pt-3">
            <Button variant="outline" size="sm" onClick={() => setShowNewContactModal(false)}>Hủy</Button>
            <Button size="sm" onClick={handleCreateCustomer} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
              Lưu Khách Hàng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
