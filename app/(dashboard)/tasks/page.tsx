"use client"

import React, { useState, useMemo } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import { 
  ClipboardList, Plus, Calendar as CalendarIcon, AlignLeft, 
  Columns, Clock, Flag, User2, MessageSquare, BarChartHorizontal,
  CheckCircle2, AlertTriangle, Search, Filter, Download, Share2,
  CalendarCheck, Car, Landmark, PhoneCall, FileText, Check,
  ChevronRight, MapPin, Eye, Trash2, Edit3, Sparkles, Building2,
  ExternalLink, Layers, ArrowUpRight
} from 'lucide-react'
import Link from 'next/link'

// Extended task item interface
interface ExtendedTask {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'high' | 'medium' | 'low'
  assignee: string
  assigneeAvatar: string
  due: string
  dueDate: string // YYYY-MM-DD for calendar mapping
  comments: number
  category: 'Dẫn khách xem dự án' | 'Hồ sơ vay ngân hàng' | 'Công chứng ký HĐMB' | 'Telesale & Chăm sóc' | 'Sự kiện mở bán' | 'Khác'
  customerName?: string
  projectName?: string
  location?: string
  description?: string
  subtasks?: { id: string; text: string; completed: boolean }[]
}

const INITIAL_EXTENDED_TASKS: ExtendedTask[] = [
  {
    id: 'TSK-101',
    title: 'Đón khách VIP Nguyễn Văn Tuấn xem sa bàn The Global City & căn Shophouse Soho',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Lê Hoàng Anh',
    assigneeAvatar: 'LHA',
    due: 'Hôm nay, 09:30',
    dueDate: '2026-07-20',
    comments: 4,
    category: 'Dẫn khách xem dự án',
    customerName: 'Nguyễn Văn Tuấn',
    projectName: 'The Global City',
    location: 'Novaland Gallery - 65 Nguyễn Du, Quận 1',
    description: 'Khách quan tâm căn Shophouse Soho trục nhạc nước, chuẩn bị sẵn tài liệu thiết kế Foster+Partners và bảng tính dòng tiền đợt 2.',
    subtasks: [
      { id: 'st1', text: 'Đặt phòng VIP đón tiếp tại Gallery', completed: true },
      { id: 'st2', text: 'In bảng tính dòng tiền phương án vay Techcombank', completed: true },
      { id: 'st3', text: 'Trải nghiệm kính thực tế ảo VR360', completed: false }
    ]
  },
  {
    id: 'TSK-102',
    title: 'Hoàn thiện hồ sơ thẩm định tài chính vay gói MBBank cho khách Trần Thị Bích Ngọc',
    status: 'todo',
    priority: 'high',
    assignee: 'Tuấn Tú',
    assigneeAvatar: 'TT',
    due: 'Hôm nay, 14:00',
    dueDate: '2026-07-20',
    comments: 2,
    category: 'Hồ sơ vay ngân hàng',
    customerName: 'Trần Thị Bích Ngọc',
    projectName: 'The Grand Manhattan',
    location: 'Chi nhánh MBBank Sài Gòn',
    description: 'Bổ sung sao kê tài khoản doanh nghiệp 6 tháng và giấy tờ bảo lãnh vốn đối ứng để kịp giải ngân đợt 2.',
    subtasks: [
      { id: 'st4', text: 'Scan CCCD gắn chip 2 mặt', completed: true },
      { id: 'st5', text: 'Ký thỏa thuận cam kết ân hạn nợ gốc 24 tháng', completed: false }
    ]
  },
  {
    id: 'TSK-103',
    title: 'Hỗ trợ khách Phạm Minh Tuấn ký HĐMB biệt thự ven sông tại Văn phòng Công chứng',
    status: 'todo',
    priority: 'high',
    assignee: 'Thanh Hà',
    assigneeAvatar: 'TH',
    due: 'Ngày mai, 10:00',
    dueDate: '2026-07-21',
    comments: 3,
    category: 'Công chứng ký HĐMB',
    customerName: 'Phạm Minh Tuấn',
    projectName: 'The Global City',
    location: 'Văn phòng Công chứng Bến Nghé, Quận 1',
    description: 'Thủ tục ký chính thức HĐMB căn Shophouse Soho TGC-SH06 giá 36 Tỷ. Cần kiểm tra đầy đủ biên lai thu tiền đợt 1.',
    subtasks: [
      { id: 'st6', text: 'Kiểm tra bản in HĐMB 4 liên', completed: true },
      { id: 'st7', text: 'Chuẩn bị quà tặng VIP tri ân của CĐT', completed: false }
    ]
  },
  {
    id: 'TSK-104',
    title: 'Gửi bảng tính dòng tiền & chính sách chiết khấu 10% thanh toán sớm cho chị Hoàng Thị Thảo',
    status: 'in_progress',
    priority: 'medium',
    assignee: 'Tuấn Tú',
    assigneeAvatar: 'TT',
    due: 'Ngày mai, 15:30',
    dueDate: '2026-07-21',
    comments: 5,
    category: 'Telesale & Chăm sóc',
    customerName: 'Hoàng Thị Thảo',
    projectName: 'NovaWorld Phan Thiet',
    location: 'Trao đổi qua Zalo / Cuộc gọi VoIP',
    description: 'Chị Thảo muốn tìm hiểu phương án thanh toán 95% nhận chiết khấu 10% + tặng gói hoàn thiện nội thất 300 triệu.',
    subtasks: [
      { id: 'st8', text: 'Lập bảng phân tích lợi nhuận cho thuê 12%/năm', completed: true },
      { id: 'st9', text: 'Gọi điện giải thích các mốc thanh toán', completed: false }
    ]
  },
  {
    id: 'TSK-105',
    title: 'Đối soát chứng từ ủy nhiệm chi (UNC) 200 triệu với Kế toán cho khách Đặng Quốc Huy',
    status: 'review',
    priority: 'medium',
    assignee: 'Minh Anh',
    assigneeAvatar: 'MA',
    due: '22/07, 11:00',
    dueDate: '2026-07-22',
    comments: 1,
    category: 'Hồ sơ vay ngân hàng',
    customerName: 'Đặng Quốc Huy',
    projectName: 'Aqua City',
    location: 'Phòng Kế toán Novaland',
    description: 'Khách nộp tiền cọc qua cổng chuyển khoản liên ngân hàng 24/7, chờ kế toán đối soát sao kê.',
    subtasks: [
      { id: 'st10', text: 'Nhận ảnh chụp UNC từ Zalo khách', completed: true },
      { id: 'st11', text: 'Xin dấu mộc Kế toán trưởng vào phiếu thu', completed: false }
    ]
  },
  {
    id: 'TSK-106',
    title: 'Khảo sát thực địa tiến độ thi công hạ tầng đường trục chính phân khu Sun Harbor',
    status: 'done',
    priority: 'low',
    assignee: 'Trần Khoa',
    assigneeAvatar: 'TK',
    due: '18/07, 16:00',
    dueDate: '2026-07-18',
    comments: 2,
    category: 'Dẫn khách xem dự án',
    projectName: 'Aqua City',
    location: 'Aqua City Đồng Nai',
    description: 'Chụp ảnh cập nhật tiến độ rải nhựa đường trục 60m và cảnh quan bến du thuyền Marina.',
    subtasks: [
      { id: 'st12', text: 'Bay Flycam ghi hình 4K', completed: true },
      { id: 'st13', text: 'Tải tài liệu lên Thư viện số nội bộ', completed: true }
    ]
  },
  {
    id: 'TSK-107',
    title: 'Gọi điện chúc mừng sinh nhật & gửi tặng voucher nghỉ dưỡng Novaland cho khách VVIP Vũ Thu Trang',
    status: 'todo',
    priority: 'medium',
    assignee: 'Lê Hoàng Anh',
    assigneeAvatar: 'LHA',
    due: '23/07, 09:00',
    dueDate: '2026-07-23',
    comments: 0,
    category: 'Telesale & Chăm sóc',
    customerName: 'Vũ Thu Trang',
    projectName: 'The Global City',
    location: 'Trực tuyến CRM',
    description: 'Chị Trang là khách hàng VVIP sở hữu 2 căn biệt thự Aqua City và shophouse Soho.',
    subtasks: [
      { id: 'st14', text: 'Xuất voucher điện tử 3N2Đ Phan Thiết', completed: false }
    ]
  },
  {
    id: 'TSK-108',
    title: 'Chuẩn bị tài liệu & slide thuyết trình cho Lễ mở bán Đợt 2 The Grand Manhattan',
    status: 'in_progress',
    priority: 'high',
    assignee: 'Thanh Hà',
    assigneeAvatar: 'TH',
    due: '24/07, 17:00',
    dueDate: '2026-07-24',
    comments: 8,
    category: 'Sự kiện mở bán',
    projectName: 'The Grand Manhattan',
    location: 'Hội trường Grand Ballroom Novaland',
    description: 'Cập nhật chính sách chiết khấu ngoại giao +1% và danh sách 50 khách hàng VIP tham dự sự kiện.',
    subtasks: [
      { id: 'st15', text: 'In ấn 100 bộ Brochure cao cấp', completed: true },
      { id: 'st16', text: 'Kiểm tra âm thanh ánh sáng hội trường', completed: false }
    ]
  },
  {
    id: 'TSK-109',
    title: 'Kiểm tra tiến độ cấp Giấy chứng nhận quyền sở hữu (Sổ hồng) cho cư dân phân khu Florida',
    status: 'done',
    priority: 'low',
    assignee: 'Bảo Trần',
    assigneeAvatar: 'BT',
    due: '17/07, 15:00',
    dueDate: '2026-07-17',
    comments: 0,
    category: 'Công chứng ký HĐMB',
    projectName: 'NovaWorld Phan Thiet',
    location: 'Sở Tài Nguyên & Môi Trường',
    description: 'Đã hoàn tất hồ sơ đo vẽ đợt 1 cho 120 căn biệt thự biển.',
    subtasks: [
      { id: 'st17', text: 'Nhận kết quả đo đạc địa chính', completed: true }
    ]
  },
  {
    id: 'TSK-110',
    title: 'Tổ chức xe Limousine đưa đoàn 6 nhà đầu tư Hà Nội tham quan đô thị sinh thái Aqua City',
    status: 'todo',
    priority: 'high',
    assignee: 'Trần Khoa',
    assigneeAvatar: 'TK',
    due: '25/07, 08:30',
    dueDate: '2026-07-25',
    comments: 6,
    category: 'Dẫn khách xem dự án',
    customerName: 'Đoàn Nhà Đầu Tư Hà Nội',
    projectName: 'Aqua City',
    location: 'Khởi hành: Khách sạn Caravelle Q1 ➔ Aqua City',
    description: 'Đoàn khách quan tâm biệt thự đảo Phượng Hoàng. Cần chuẩn bị cano đón tại bến du thuyền Novaland Gallery.',
    subtasks: [
      { id: 'st18', text: 'Xác nhận danh sách 6 khách VIP', completed: true },
      { id: 'st19', text: 'Điều phối xe Limousine 9 chỗ & Cano', completed: false },
      { id: 'st20', text: 'Đặt tiệc trà cao cấp tại Sales Gallery Aqua', completed: false }
    ]
  },
  {
    id: 'TSK-111',
    title: 'Nhắc hạn thanh toán đợt 3 HĐMB căn hộ BE1-0501 cho khách hàng Ngô Đức Thắng',
    status: 'todo',
    priority: 'medium',
    assignee: 'Thanh Hà',
    assigneeAvatar: 'TH',
    due: '26/07, 10:00',
    dueDate: '2026-07-26',
    comments: 1,
    category: 'Telesale & Chăm sóc',
    customerName: 'Ngô Đức Thắng',
    projectName: 'Vinhomes Grand Park',
    location: 'Nhắc qua SMS & Zalo ZNS',
    description: 'Đợt 3 thanh toán 15% tương đương 825 Triệu VNĐ đến hạn vào ngày 30/07/2026.',
    subtasks: [
      { id: 'st21', text: 'Soạn thông báo nộp tiền có mã QR Napas', completed: false }
    ]
  },
  {
    id: 'TSK-112',
    title: 'Đào tạo kỹ năng tư vấn kịch bản mở đầu và xử lý từ chối cho 8 chuyên viên tư vấn mới',
    status: 'done',
    priority: 'low',
    assignee: 'Tuấn Tú',
    assigneeAvatar: 'TT',
    due: '16/07, 14:00',
    dueDate: '2026-07-16',
    comments: 4,
    category: 'Khác',
    projectName: 'Toàn hệ thống',
    location: 'Phòng Đào Tạo Sàn Q1',
    description: 'Nội dung: Phân tích tâm lý nhà đầu tư thời kỳ lãi suất thấp và kỹ năng tư vấn sản phẩm Shophouse.',
    subtasks: [
      { id: 'st22', text: 'Thực hành Roleplay xử lý từ chối giá cao', completed: true }
    ]
  }
]

export default function TasksPage() {
  const { customers, projects } = useStore()

  // Task list state
  const [taskList, setTaskList] = useState<ExtendedTask[]>(INITIAL_EXTENDED_TASKS)
  const [activeTab, setActiveTab] = useState('kanban')

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterAssignee, setFilterAssignee] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<ExtendedTask['category']>('Dẫn khách xem dự án')
  const [newPriority, setNewPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [newAssignee, setNewAssignee] = useState('Lê Hoàng Anh')
  const [newCustomer, setNewCustomer] = useState('c1')
  const [newProject, setNewProject] = useState('p5')
  const [newDue, setNewDue] = useState('Hôm nay, 16:30')
  const [newDueDate, setNewDueDate] = useState('2026-07-20')
  const [newLocation, setNewLocation] = useState('Novaland Gallery 65 Nguyễn Du, Q1')
  const [newDescription, setNewDescription] = useState('')

  // View detail modal
  const [selectedTask, setSelectedTask] = useState<ExtendedTask | null>(null)

  // Site Tour Bus Booking Modal
  const [isSiteTourModalOpen, setIsSiteTourModalOpen] = useState(false)
  const [tourProject, setTourProject] = useState('Aqua City (Biên Hòa, Đồng Nai)')
  const [tourDate, setTourDate] = useState('Thứ Bảy, 25/07/2026')
  const [tourGuestsCount, setTourGuestsCount] = useState('4')
  const [tourVehicle, setTourVehicle] = useState('Limousine VIP 9 Chỗ')

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId)
    const target = e.target as HTMLElement
    target.style.opacity = '0.5'
  }

  const handleDragEnd = (e: React.DragEvent) => {
    const target = e.target as HTMLElement
    target.style.opacity = '1'
  }

  const handleDrop = (e: React.DragEvent, status: 'todo' | 'in_progress' | 'review' | 'done') => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('taskId')
    if (taskId) {
      setTaskList(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))
      showToast(`Đã cập nhật trạng thái nhiệm vụ ${taskId} sang "${status.toUpperCase()}"!`)
    }
    const target = e.currentTarget as HTMLElement
    target.classList.remove('bg-slate-200/50', 'ring-2', 'ring-indigo-400')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  
  const handleDragEnter = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.classList.add('bg-slate-200/50', 'ring-2', 'ring-indigo-400')
  }
  
  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.classList.remove('bg-slate-200/50', 'ring-2', 'ring-indigo-400')
  }

  // Toggle complete task
  const handleToggleTaskStatus = (taskId: string) => {
    setTaskList(prev => prev.map(t => {
      if (t.id !== taskId) return t
      const nextStatus = t.status === 'done' ? 'todo' : 'done'
      return { ...t, status: nextStatus }
    }))
    const task = taskList.find(t => t.id === taskId)
    showToast(task?.status === 'done' ? `Đã mở lại công việc ${taskId}` : `Đã hoàn tất công việc: ${task?.title}`)
  }

  // Toggle subtask
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTaskList(prev => prev.map(t => {
      if (t.id !== taskId || !t.subtasks) return t
      const updatedSubtasks = t.subtasks.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
      return { ...t, subtasks: updatedSubtasks }
    }))

    if (selectedTask && selectedTask.id === taskId && selectedTask.subtasks) {
      setSelectedTask({
        ...selectedTask,
        subtasks: selectedTask.subtasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
      })
    }
  }

  // Create new task
  const handleCreateTask = () => {
    if (!newTitle.trim()) {
      showToast('Vui lòng nhập tiêu đề công việc!')
      return
    }

    const customerObj = customers.find(c => c.id === newCustomer)
    const projectObj = projects.find(p => p.id === newProject)

    const newTask: ExtendedTask = {
      id: `TSK-${taskList.length + 101}`,
      title: newTitle,
      status: 'todo',
      priority: newPriority,
      assignee: newAssignee,
      assigneeAvatar: newAssignee.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase(),
      due: newDue,
      dueDate: newDueDate,
      comments: 0,
      category: newCategory,
      customerName: customerObj?.name || 'Khách tiềm năng mới',
      projectName: projectObj?.name || 'The Global City',
      location: newLocation,
      description: newDescription || 'Nhiệm vụ tác nghiệp được khởi tạo trực tiếp từ hệ thống.',
      subtasks: [
        { id: `st_${Date.now()}_1`, text: 'Liên hệ xác nhận với khách hàng', completed: false },
        { id: `st_${Date.now()}_2`, text: 'Chuẩn bị tài liệu & hồ sơ liên quan', completed: false }
      ]
    }

    setTaskList([newTask, ...taskList])
    setIsCreateModalOpen(false)
    setNewTitle('')
    setNewDescription('')
    showToast(`Đã tạo thành công nhiệm vụ ${newTask.id}: "${newTask.title}"!`)
  }

  // Site Tour Booking confirmation
  const handleConfirmSiteTour = () => {
    setIsSiteTourModalOpen(false)
    showToast(`Đã xác nhận đặt xe ${tourVehicle} đưa ${tourGuestsCount} khách tham quan ${tourProject} vào ${tourDate}!`)
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã NV,Tiêu Đề Công Việc,Trạng Thái,Mức Độ,Người Phụ Trách,Hạn Chót,Phân Loại,Khách Hàng,Dự Án,Địa Điểm']
    const rows = filteredTasks.map(t => 
      `"${t.id}","${t.title}","${t.status}","${t.priority}","${t.assignee}","${t.due}","${t.category}","${t.customerName || ''}","${t.projectName || ''}","${t.location || ''}"`
    )
    const csvContent = '\uFEFF' + [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Lich_Trinh_Cong_Viec_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Đã xuất file lịch trình công việc (.CSV) thành công!')
  }

  // Filtered task list
  const filteredTasks = useMemo(() => {
    return taskList.filter(t => {
      // Keyword search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchTitle = t.title.toLowerCase().includes(query)
        const matchCustomer = t.customerName?.toLowerCase().includes(query)
        const matchProject = t.projectName?.toLowerCase().includes(query)
        const matchAssignee = t.assignee.toLowerCase().includes(query)
        if (!matchTitle && !matchCustomer && !matchProject && !matchAssignee) return false
      }

      // Assignee filter
      if (filterAssignee !== 'all' && t.assignee !== filterAssignee) return false

      // Priority filter
      if (filterPriority !== 'all' && t.priority !== filterPriority) return false

      // Category filter
      if (filterCategory !== 'all' && t.category !== filterCategory) return false

      return true
    })
  }, [taskList, searchQuery, filterAssignee, filterPriority, filterCategory])

  // Top Metrics
  const totalTasksCount = taskList.length
  const highPriorityCount = taskList.filter(t => t.priority === 'high' && t.status !== 'done').length
  const siteToursCount = taskList.filter(t => t.category === 'Dẫn khách xem dự án').length
  const legalBankingCount = taskList.filter(t => t.category === 'Hồ sơ vay ngân hàng' || t.category === 'Công chứng ký HĐMB').length
  const doneTasksCount = taskList.filter(t => t.status === 'done').length
  const completionRate = totalTasksCount > 0 ? ((doneTasksCount / totalTasksCount) * 100).toFixed(1) : '0.0'

  return (
    <div className="flex flex-col gap-6 p-1 md:p-2 pb-16">
      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Check className="h-4 w-4 stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 px-3 py-1 font-semibold text-xs tracking-wider uppercase">
              <CalendarCheck className="h-3.5 w-3.5 mr-1 text-indigo-400 inline" /> Quản Trị Tác Nghiệp & Lịch Trình
            </Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-700 bg-slate-800/40 text-xs">
              <Clock className="h-3 w-3 mr-1 inline text-amber-400" /> Đồng bộ Live Kanban & Gantt
            </Badge>
            <Badge variant="outline" className="text-emerald-300 border-emerald-500/30 bg-emerald-500/10 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1 inline text-emerald-400" /> Đúng hạn SLA: {completionRate}%
            </Badge>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Quản Lý Công Việc & Lịch Hẹn Khách Hàng
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl">
            Lên lịch dẫn khách xem sa bàn 3D, chuẩn bị hồ sơ vay ngân hàng, công chứng hợp đồng mua bán và điều phối xe Limousine tham quan dự án.
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            size="sm" 
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-9 shadow-md"
          >
            <Plus className="h-4 w-4 mr-1.5" /> Tạo Nhiệm Vụ Mới
          </Button>

          <Button 
            onClick={() => setIsSiteTourModalOpen(true)}
            size="sm" 
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold h-9 shadow-md"
          >
            <Car className="h-4 w-4 mr-1.5" /> Đặt Xe Dẫn Khách
          </Button>

          <Button 
            onClick={handleExportCSV}
            variant="outline" 
            size="sm" 
            className="border-slate-700 bg-slate-800/70 hover:bg-slate-700 text-slate-200 text-xs h-9"
          >
            <Download className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Xuất Lịch (.CSV)
          </Button>
        </div>
      </div>

      {/* 5 OPERATIONAL KPI CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {/* KPI 1: Tổng Công Việc */}
        <Card className="shadow-sm border-blue-200/80 bg-gradient-to-br from-blue-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              Tổng Nhiệm Vụ Tháng
            </CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <ClipboardList className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {totalTasksCount} <span className="text-sm font-normal text-slate-600">công việc</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Đã hoàn tất:</span>
                <span className="font-bold text-blue-700">{doneTasksCount} / {totalTasksCount}</span>
              </div>
              <Progress value={Number(completionRate)} className="h-2 bg-blue-100" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              <ArrowUpRight className="h-3 w-3 mr-0.5 text-emerald-600 shrink-0" />
              Tỷ lệ hoàn thành: {completionRate}%
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Khẩn Cấp / Quá Hạn */}
        <Card className="shadow-sm border-rose-200/80 bg-gradient-to-br from-rose-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Khẩn Cấp Cần Xử Lý
            </CardTitle>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-rose-700 flex items-center gap-2">
              {highPriorityCount} <span className="text-sm font-normal text-slate-600">việc gấp</span>
              {highPriorityCount > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hạn chót trong 24h:</span>
                <span className="font-bold text-rose-700">3 việc</span>
              </div>
              <Progress value={highPriorityCount * 25} className="h-2 bg-rose-100" />
            </div>
            <p className="text-[11px] text-rose-700 font-semibold pt-0.5">
              Ưu tiên duyệt tiền cọc & công chứng
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Lịch Dẫn Khách Xem Sa Bàn */}
        <Card className="shadow-sm border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Lịch Dẫn Khách (Tours)
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Car className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {siteToursCount} <span className="text-sm font-normal text-slate-600">cuộc hẹn</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Đã điều xe Limousine:</span>
                <span className="font-bold text-emerald-700">4 chuyến</span>
              </div>
              <Progress value={75} className="h-2 bg-emerald-100" />
            </div>
            <p className="text-[11px] text-slate-600 pt-0.5 flex items-center justify-between">
              <span>Gallery Q1 & Aqua City</span>
              <button 
                onClick={() => setIsSiteTourModalOpen(true)}
                className="text-emerald-700 font-bold hover:underline"
              >
                + Đặt xe
              </button>
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: Hồ Sơ Vay & Ký HĐMB */}
        <Card className="shadow-sm border-purple-200/80 bg-gradient-to-br from-purple-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Hồ Sơ Vay & Ký HĐMB
            </CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Landmark className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-slate-900">
              {legalBankingCount} <span className="text-sm font-normal text-slate-600">hồ sơ</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Ngân hàng tham gia:</span>
                <span className="font-bold text-purple-700">MBB, TCB, VCB</span>
              </div>
              <Progress value={65} className="h-2 bg-purple-100" />
            </div>
            <p className="text-[11px] text-slate-600 pt-0.5">
              Hỗ trợ thủ tục công chứng tận nơi
            </p>
          </CardContent>
        </Card>

        {/* KPI 5: Tỷ Lệ Hoàn Thành SLA */}
        <Card className="shadow-sm border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Hiệu Suất Thực Thi
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-black text-indigo-700">
              93.8%
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">So với tuần trước:</span>
                <span className="font-bold text-emerald-700">+4.2%</span>
              </div>
              <Progress value={93.8} className="h-2 bg-indigo-100" />
            </div>
            <p className="text-[11px] font-semibold text-emerald-700 flex items-center pt-0.5">
              <ArrowUpRight className="h-3 w-3 mr-0.5 text-emerald-600 shrink-0" />
              Đạt chuẩn vận hành ISO 9001
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FILTER TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Tìm theo tiêu đề, khách hàng, dự án hoặc chuyên viên..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Assignee Filter */}
        <div className="w-[170px]">
          <Select value={filterAssignee} onValueChange={(val) => setFilterAssignee(val || 'all')}>
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Người phụ trách" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nhân sự</SelectItem>
              <SelectItem value="Lê Hoàng Anh">Lê Hoàng Anh</SelectItem>
              <SelectItem value="Thanh Hà">Thanh Hà</SelectItem>
              <SelectItem value="Tuấn Tú">Tuấn Tú</SelectItem>
              <SelectItem value="Trần Khoa">Trần Khoa</SelectItem>
              <SelectItem value="Minh Anh">Minh Anh</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="w-[150px]">
          <Select value={filterPriority} onValueChange={(val) => setFilterPriority(val || 'all')}>
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Mức độ ưu tiên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả mức độ</SelectItem>
              <SelectItem value="high">Khẩn cấp (High 🔥)</SelectItem>
              <SelectItem value="medium">Trung bình (Medium)</SelectItem>
              <SelectItem value="low">Tiêu chuẩn (Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category Filter */}
        <div className="w-[180px]">
          <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val || 'all')}>
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder="Nghiệp vụ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nghiệp vụ</SelectItem>
              <SelectItem value="Dẫn khách xem dự án">Dẫn khách xem dự án</SelectItem>
              <SelectItem value="Hồ sơ vay ngân hàng">Hồ sơ vay ngân hàng</SelectItem>
              <SelectItem value="Công chứng ký HĐMB">Công chứng ký HĐMB</SelectItem>
              <SelectItem value="Telesale & Chăm sóc">Telesale & Chăm sóc</SelectItem>
              <SelectItem value="Sự kiện mở bán">Sự kiện mở bán</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(searchQuery || filterAssignee !== 'all' || filterPriority !== 'all' || filterCategory !== 'all') && (
          <Button 
            onClick={() => {
              setSearchQuery('')
              setFilterAssignee('all')
              setFilterPriority('all')
              setFilterCategory('all')
            }}
            variant="ghost" 
            size="sm" 
            className="text-xs h-9 text-slate-500 hover:text-slate-900"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* 4 VIEW MODES (TABS) */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2">
          <TabsList className="bg-slate-100 p-1 rounded-xl h-10">
            <TabsTrigger value="kanban" className="text-xs font-bold flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
              <Columns className="h-3.5 w-3.5 text-indigo-600" /> Bảng Kanban
            </TabsTrigger>
            <TabsTrigger value="list" className="text-xs font-bold flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
              <AlignLeft className="h-3.5 w-3.5 text-emerald-600" /> Danh Sách ({filteredTasks.length})
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs font-bold flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
              <CalendarIcon className="h-3.5 w-3.5 text-amber-600" /> Lịch Tháng (Calendar)
            </TabsTrigger>
            <TabsTrigger value="gantt" className="text-xs font-bold flex items-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-xs">
              <BarChartHorizontal className="h-3.5 w-3.5 text-purple-600" /> Sơ Đồ Gantt
            </TabsTrigger>
          </TabsList>

          <div className="text-xs text-slate-500 font-medium">
            Hiển thị <b>{filteredTasks.length}</b> / {taskList.length} đầu việc được phân bổ
          </div>
        </div>

        {/* 1. KANBAN BOARD */}
        <TabsContent value="kanban" className="space-y-4">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {[
              { id: 'todo', title: 'CẦN LÀM (TO DO)', color: 'bg-slate-50/70 border-slate-200', text: 'text-slate-800', dot: 'bg-slate-400', badgeColor: 'bg-slate-100 text-slate-700' },
              { id: 'in_progress', title: 'ĐANG XỬ LÝ (IN PROGRESS)', color: 'bg-blue-50/40 border-blue-200', text: 'text-blue-800', dot: 'bg-blue-500', badgeColor: 'bg-blue-100 text-blue-800' },
              { id: 'review', title: 'CHỜ DUYỆT (IN REVIEW)', color: 'bg-amber-50/40 border-amber-200', text: 'text-amber-800', dot: 'bg-amber-500', badgeColor: 'bg-amber-100 text-amber-800' },
              { id: 'done', title: 'HOÀN TẤT (DONE)', color: 'bg-emerald-50/40 border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500', badgeColor: 'bg-emerald-100 text-emerald-800' }
            ].map(col => {
              const columnTasks = filteredTasks.filter(t => t.status === col.id)
              return (
                <div 
                  key={col.id} 
                  className={`w-[320px] flex-shrink-0 rounded-xl border ${col.color} flex flex-col h-[680px] shadow-xs snap-center transition-all bg-white/60`}
                  onDrop={(e) => handleDrop(e, col.id as any)}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                >
                  <div className="p-3 border-b flex justify-between items-center bg-white rounded-t-xl">
                    <div className={`font-bold text-xs flex items-center gap-2 ${col.text}`}>
                      <div className={`h-2 w-2 rounded-full ${col.dot}`}></div>
                      {col.title}
                    </div>
                    <Badge className={`font-bold text-xs px-2 py-0.5 ${col.badgeColor}`}>
                      {columnTasks.length}
                    </Badge>
                  </div>
                  
                  <div className="p-2.5 flex-1 overflow-y-auto flex flex-col gap-2.5 min-h-[100px]">
                    {columnTasks.map(task => (
                      <Card 
                        key={task.id} 
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all border border-slate-200 relative group bg-white rounded-xl"
                      >
                        <CardContent className="p-3.5 space-y-2.5">
                          {/* Priority & ID */}
                          <div className="flex justify-between items-start">
                            <div className="flex flex-wrap gap-1">
                              <Badge className={`text-[10px] px-1.5 py-0 font-bold uppercase ${
                                task.priority === 'high' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                                task.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {task.priority === 'high' ? 'High 🔥' : task.priority === 'medium' ? 'Medium' : 'Low'}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] text-indigo-700 bg-indigo-50 border-indigo-200 px-1 py-0">
                                {task.category}
                              </Badge>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-400">{task.id}</span>
                          </div>
                          
                          {/* Title */}
                          <h4 
                            onClick={() => setSelectedTask(task)}
                            className={`font-bold text-xs leading-snug hover:text-indigo-600 cursor-pointer transition-colors ${
                              task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {task.title}
                          </h4>

                          {/* Related Customer & Project Tags */}
                          {(task.customerName || task.projectName) && (
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                              {task.customerName && (
                                <span className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded font-medium text-slate-700">
                                  KH: {task.customerName}
                                </span>
                              )}
                              {task.projectName && (
                                <span className="bg-purple-50 text-purple-800 border border-purple-100 px-1.5 py-0.5 rounded font-medium text-[10px]">
                                  {task.projectName}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Bottom info: Due, Assignee, Actions */}
                          <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                            <span className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                              <Clock className="h-3 w-3 text-slate-400" /> {task.due}
                            </span>
                            
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleToggleTaskStatus(task.id)}
                                title={task.status === 'done' ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn tất'}
                                className={`h-6 w-6 rounded-full flex items-center justify-center transition-colors ${
                                  task.status === 'done' ? 'bg-emerald-500 text-white' : 'border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-slate-400'
                                }`}
                              >
                                <Check className="h-3 w-3 stroke-[3]" />
                              </button>

                              <div 
                                className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs" 
                                title={task.assignee}
                              >
                                {task.assigneeAvatar}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {columnTasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-28 text-slate-400 text-xs font-medium border-2 border-dashed border-slate-200 rounded-xl bg-white/40">
                        Kéo thả nhiệm vụ vào đây
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* 2. LIST VIEW */}
        <TabsContent value="list" className="space-y-4">
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow>
                      <TableHead className="w-12 text-center font-bold text-xs text-slate-700">✓</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Mã / Tiêu Đề Nhiệm Vụ</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Nghiệp Vụ</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Mức Độ</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Trạng Thái</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Khách Hàng / Dự Án</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Phụ Trách</TableHead>
                      <TableHead className="font-bold text-xs text-slate-700">Hạn Chót</TableHead>
                      <TableHead className="text-right font-bold text-xs text-slate-700">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map(task => (
                      <TableRow key={task.id} className="hover:bg-slate-50/70 transition-colors">
                        <TableCell className="text-center">
                          <Checkbox 
                            checked={task.status === 'done'} 
                            onCheckedChange={() => handleToggleTaskStatus(task.id)}
                          />
                        </TableCell>

                        <TableCell>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono text-slate-400 block">{task.id}</span>
                            <span 
                              onClick={() => setSelectedTask(task)}
                              className={`font-bold text-xs cursor-pointer hover:text-indigo-600 ${
                                task.status === 'done' ? 'line-through text-slate-400 font-medium' : 'text-slate-900'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline" className="text-[10px] text-indigo-700 bg-indigo-50 border-indigo-200">
                            {task.category}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          {task.priority === 'high' && (
                            <Badge className="bg-rose-100 text-rose-800 border-rose-200 text-[10px] font-bold">
                              High 🔥
                            </Badge>
                          )}
                          {task.priority === 'medium' && (
                            <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px] font-bold">
                              Med
                            </Badge>
                          )}
                          {task.priority === 'low' && (
                            <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px] font-bold">
                              Low
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell>
                          {task.status === 'todo' && <Badge variant="outline" className="bg-slate-100 text-slate-700 text-[10px]">Cần làm</Badge>}
                          {task.status === 'in_progress' && <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-[10px]">Đang xử lý</Badge>}
                          {task.status === 'review' && <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-[10px]">Chờ duyệt</Badge>}
                          {task.status === 'done' && <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-[10px]">Hoàn tất</Badge>}
                        </TableCell>

                        <TableCell>
                          <div className="text-xs">
                            <span className="font-medium text-slate-800 block">{task.customerName || '—'}</span>
                            <span className="text-[11px] text-slate-500">{task.projectName || '—'}</span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                            <div className="h-5 w-5 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                              {task.assigneeAvatar}
                            </div>
                            {task.assignee}
                          </div>
                        </TableCell>

                        <TableCell className="text-xs text-slate-600 font-medium">
                          {task.due}
                        </TableCell>

                        <TableCell className="text-right">
                          <Button 
                            onClick={() => setSelectedTask(task)}
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-7 px-2 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Eye className="h-3.5 w-3.5 mr-1" /> Chi Tiết
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. CALENDAR VIEW */}
        <TabsContent value="calendar" className="space-y-4">
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="flex flex-row items-center justify-between py-4 border-b bg-slate-50/70">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-base font-bold text-slate-900">
                  Lịch Hoạt Động & Lịch Hẹn Khách Hàng (Tháng 7, 2026)
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs h-8 font-semibold">Hôm nay</Button>
                <Button variant="outline" size="sm" className="text-xs h-8">Tháng trước</Button>
                <Button variant="outline" size="sm" className="text-xs h-8">Tháng sau</Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 bg-slate-50/20">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-t-xl overflow-hidden text-center text-xs font-bold text-slate-600">
                <div className="bg-white py-2.5">Thứ Hai</div>
                <div className="bg-white py-2.5">Thứ Ba</div>
                <div className="bg-white py-2.5">Thứ Tư</div>
                <div className="bg-white py-2.5">Thứ Năm</div>
                <div className="bg-white py-2.5">Thứ Sáu</div>
                <div className="bg-white py-2.5">Thứ Bảy</div>
                <div className="bg-white py-2.5 text-rose-600">Chủ Nhật</div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-slate-200 border-x border-b border-slate-200 rounded-b-xl overflow-hidden">
                {/* Offset padding */}
                <div className="bg-slate-50 min-h-[110px] p-2 text-slate-300 font-bold text-xs">29</div>
                <div className="bg-slate-50 min-h-[110px] p-2 text-slate-300 font-bold text-xs">30</div>

                {/* Days of Month (1 - 31) */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const dayNum = i + 1
                  const dateStr = `2026-07-${String(dayNum).padStart(2, '0')}`
                  const dayTasks = taskList.filter(t => t.dueDate === dateStr)
                  const isToday = dayNum === 20

                  return (
                    <div 
                      key={dayNum} 
                      className={`bg-white min-h-[110px] p-2 relative group hover:bg-indigo-50/30 transition-colors ${
                        isToday ? 'bg-indigo-50/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-black ${
                          isToday ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-xs' : 'text-slate-700'
                        }`}>
                          {dayNum}
                        </span>
                        {dayTasks.length > 0 && (
                          <span className="text-[10px] font-bold text-indigo-600">{dayTasks.length} việc</span>
                        )}
                      </div>

                      {/* Task Badges on Day */}
                      <div className="space-y-1 overflow-hidden">
                        {dayTasks.slice(0, 2).map(dt => (
                          <div 
                            key={dt.id}
                            onClick={() => setSelectedTask(dt)}
                            className={`text-[10px] p-1 rounded font-medium truncate cursor-pointer shadow-2xs hover:brightness-95 ${
                              dt.priority === 'high' ? 'bg-rose-100 text-rose-900 border border-rose-200' :
                              dt.category === 'Dẫn khách xem dự án' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                              'bg-indigo-100 text-indigo-900 border border-indigo-200'
                            }`}
                            title={dt.title}
                          >
                            {dt.title}
                          </div>
                        ))}
                        {dayTasks.length > 2 && (
                          <span className="text-[9px] text-slate-400 font-bold block">
                            +{dayTasks.length - 2} nhiệm vụ khác
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}

                {/* Trailing padding */}
                <div className="bg-slate-50 min-h-[110px] p-2 text-slate-300 font-bold text-xs">1</div>
                <div className="bg-slate-50 min-h-[110px] p-2 text-slate-300 font-bold text-xs">2</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. GANTT TIMELINE VIEW */}
        <TabsContent value="gantt" className="space-y-4">
          <Card className="shadow-sm border-slate-200 bg-white">
            <CardHeader className="py-4 border-b bg-slate-50/70">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChartHorizontal className="h-4 w-4 text-purple-600" />
                    Sơ Đồ Gantt Tiến Độ Chiến Dịch & Tác Nghiệp BĐS
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Phân bổ thời gian thực hiện các mốc dẫn khách, mở bán và đối soát thanh toán
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-xs text-purple-700 bg-purple-50 border-purple-200">
                  Chu kỳ 10 ngày tới
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <div className="min-w-[850px]">
                <div className="flex border-b text-xs font-bold text-slate-600 bg-slate-50">
                  <div className="w-[320px] p-3 border-r uppercase tracking-wider">Hạng Mục Tác Nghiệp</div>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex-1 p-3 text-center border-r uppercase tracking-wider text-[11px]">
                      {20 + i}/07
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex pointer-events-none">
                    <div className="w-[320px] border-r border-slate-200"></div>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex-1 border-r border-slate-100"></div>
                    ))}
                  </div>

                  {[
                    { title: 'Đón đoàn 6 KH Hà Nội xem sa bàn Soho', start: 0, duration: 2, color: 'bg-emerald-600', assignee: 'Lê Hoàng Anh' },
                    { title: 'Thẩm định hồ sơ bảo lãnh vay MBBank', start: 1, duration: 3, color: 'bg-indigo-600', assignee: 'Tuấn Tú' },
                    { title: 'Ký công chứng HĐMB 4 căn biệt thự', start: 3, duration: 2, color: 'bg-purple-600', assignee: 'Thanh Hà' },
                    { title: 'Chuẩn bị sự kiện mở bán Đợt 2 Grand Manhattan', start: 4, duration: 4, color: 'bg-amber-600', assignee: 'Thanh Hà' },
                    { title: 'Chạy chiến dịch tiếp thị số Facebook Ads T7', start: 2, duration: 6, color: 'bg-blue-600', assignee: 'Marketing Hub' },
                    { title: 'Khảo sát thực địa bến du thuyền Aqua City', start: 6, duration: 3, color: 'bg-rose-600', assignee: 'Trần Khoa' },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex border-b border-slate-100 relative h-12 items-center hover:bg-slate-50/60 transition-colors">
                      <div className="w-[320px] px-3 font-semibold text-xs text-slate-800 truncate z-10">
                        {bar.title}
                        <span className="text-[10px] text-slate-400 block font-normal">Phụ trách: {bar.assignee}</span>
                      </div>
                      <div className="flex-1 relative h-full">
                        <div 
                          className={`absolute top-2 bottom-2 rounded-lg shadow-xs ${bar.color} opacity-90 hover:opacity-100 flex items-center px-3 text-white text-[11px] font-semibold overflow-hidden transition-all hover:scale-[1.01] cursor-pointer`}
                          style={{
                            left: `${bar.start * 10}%`,
                            width: `${bar.duration * 10}%`
                          }}
                        >
                          <span className="truncate">{bar.title}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* MODAL 1: TẠO CÔNG VIỆC / LỊCH HẸN MỚI */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-950 text-lg font-bold">
              <Plus className="h-5 w-5 text-indigo-600" />
              Khởi Tạo Nhiệm Vụ & Lịch Hẹn Khách Hàng
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Lên kế hoạch dẫn khách xem sa bàn, thẩm định hồ sơ vay hoặc công chứng ký kết hợp đồng.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tiêu Đề Công Việc / Lịch Hẹn</label>
              <Input 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ví dụ: Đón khách VVIP xem sa bàn The Global City..."
                className="text-xs h-9 font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Loại Hình Nghiệp Vụ</label>
                <Select value={newCategory} onValueChange={(val) => setNewCategory(val as any)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Chọn loại nghiệp vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dẫn khách xem dự án">Dẫn khách xem dự án</SelectItem>
                    <SelectItem value="Hồ sơ vay ngân hàng">Hồ sơ vay ngân hàng</SelectItem>
                    <SelectItem value="Công chứng ký HĐMB">Công chứng ký HĐMB</SelectItem>
                    <SelectItem value="Telesale & Chăm sóc">Telesale & Chăm sóc</SelectItem>
                    <SelectItem value="Sự kiện mở bán">Sự kiện mở bán</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mức Độ Ưu Tiên</label>
                <Select value={newPriority} onValueChange={(val) => setNewPriority(val as any)}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">Khẩn cấp (High 🔥)</SelectItem>
                    <SelectItem value="medium">Trung bình (Medium)</SelectItem>
                    <SelectItem value="low">Tiêu chuẩn (Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Người Phụ Trách</label>
                <Select value={newAssignee} onValueChange={(val) => setNewAssignee(val || 'Lê Hoàng Anh')}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Chọn chuyên viên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lê Hoàng Anh">Lê Hoàng Anh</SelectItem>
                    <SelectItem value="Thanh Hà">Thanh Hà</SelectItem>
                    <SelectItem value="Tuấn Tú">Tuấn Tú</SelectItem>
                    <SelectItem value="Minh Anh">Minh Anh</SelectItem>
                    <SelectItem value="Trần Khoa">Trần Khoa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Khách Hàng Liên Quan</label>
                <Select value={newCustomer} onValueChange={(val) => setNewCustomer(val || 'c1')}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Chọn khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name} ({c.phone})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Dự Án Trọng Điểm</label>
                <Select value={newProject} onValueChange={(val) => setNewProject(val || 'p5')}>
                  <SelectTrigger className="text-xs h-9">
                    <SelectValue placeholder="Chọn dự án" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hạn Chót & Giờ Hẹn</label>
                <Input 
                  value={newDue}
                  onChange={(e) => setNewDue(e.target.value)}
                  placeholder="Ví dụ: Hôm nay, 16:30"
                  className="text-xs h-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Địa Điểm Gặp Gỡ / Văn Phòng</label>
              <Input 
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Novaland Gallery - 65 Nguyễn Du, Quận 1"
                className="text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)} className="text-xs">
              Hủy Bỏ
            </Button>
            <Button size="sm" onClick={handleCreateTask} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold">
              <Check className="h-3.5 w-3.5 mr-1" /> Lưu & Lên Lịch Tác Nghiệp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CHI TIẾT NHIỆM VỤ & SUBTASKS CHECKLIST */}
      {selectedTask && (
        <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-900 text-white font-mono text-xs">
                  {selectedTask.id}
                </Badge>
                <Badge variant="outline" className="text-xs text-indigo-700 bg-indigo-50 border-indigo-200">
                  {selectedTask.category}
                </Badge>
              </div>
              <DialogTitle className="text-base font-bold text-slate-900 mt-1">
                {selectedTask.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border">
                <div>
                  <span className="text-slate-500 block">Người phụ trách:</span>
                  <b className="text-slate-900">{selectedTask.assignee}</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Thời gian:</span>
                  <b className="text-indigo-700">{selectedTask.due}</b>
                </div>
                <div>
                  <span className="text-slate-500 block">Khách hàng liên quan:</span>
                  <span className="font-semibold text-slate-800">{selectedTask.customerName || 'Không có'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Dự án:</span>
                  <span className="font-semibold text-purple-800">{selectedTask.projectName || 'Không có'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block">Địa điểm:</span>
                  <span className="text-slate-700 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    {selectedTask.location || 'Novaland Gallery'}
                  </span>
                </div>
              </div>

              {selectedTask.description && (
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 block">Ghi chú chi tiết:</span>
                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border leading-relaxed">
                    {selectedTask.description}
                  </p>
                </div>
              )}

              {/* Subtasks Checklist */}
              {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block">Danh mục đầu việc con (Subtasks):</span>
                  <div className="space-y-1.5">
                    {selectedTask.subtasks.map(st => (
                      <label 
                        key={st.id} 
                        className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 border border-slate-100 cursor-pointer"
                      >
                        <Checkbox 
                          checked={st.completed}
                          onCheckedChange={() => handleToggleSubtask(selectedTask.id, st.id)}
                        />
                        <span className={`text-xs ${st.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                          {st.text}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" size="sm" onClick={() => setSelectedTask(null)} className="text-xs">
                Đóng
              </Button>
              <Button 
                size="sm" 
                onClick={() => {
                  handleToggleTaskStatus(selectedTask.id)
                  setSelectedTask(null)
                }} 
                className={`text-xs font-semibold ${
                  selectedTask.status === 'done' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                {selectedTask.status === 'done' ? 'Mở Lại Công Việc' : 'Đánh Dấu Hoàn Tất'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* MODAL 3: ĐẶT XE DẪN KHÁCH XEM THỰC ĐỊA DỰ ÁN */}
      <Dialog open={isSiteTourModalOpen} onOpenChange={setIsSiteTourModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-950 text-base font-bold">
              <Car className="h-5 w-5 text-emerald-600" />
              Điều Phối Xe Đón Khách Tham Quan Dự Án
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Dịch vụ xe Limousine và cano cao tốc đưa đón nhà đầu tư VIP trải nghiệm thực tế công trình.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Dự Án Điểm Đến</label>
              <Select value={tourProject} onValueChange={(val) => setTourProject(val || 'Aqua City (Biên Hòa, Đồng Nai)')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn dự án" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aqua City (Biên Hòa, Đồng Nai)">Đô thị sinh thái Aqua City (Đồng Nai)</SelectItem>
                  <SelectItem value="The Global City (TP. Thủ Đức)">The Global City (TP. Thủ Đức)</SelectItem>
                  <SelectItem value="NovaWorld Phan Thiet (Bình Thuận)">NovaWorld Phan Thiết (Bình Thuận)</SelectItem>
                  <SelectItem value="The Grand Manhattan (Quận 1)">The Grand Manhattan (Cô Giang, Q1)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Thời Gian Khởi Hành</label>
                <Input 
                  value={tourDate}
                  onChange={(e) => setTourDate(e.target.value)}
                  className="text-xs h-9"
                  placeholder="Thứ Bảy, 25/07/2026"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Số Lượng Khách VIP</label>
                <Input 
                  type="number"
                  value={tourGuestsCount}
                  onChange={(e) => setTourGuestsCount(e.target.value)}
                  className="text-xs h-9 font-bold"
                  placeholder="4"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Phương Tiện Đưa Đón</label>
              <Select value={tourVehicle} onValueChange={(val) => setTourVehicle(val || 'Limousine VIP 9 Chỗ')}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue placeholder="Chọn phương tiện" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Limousine VIP 9 Chỗ">Xe Limousine Dcar VIP 9 Chỗ</SelectItem>
                  <SelectItem value="Cano Cao Tốc Novaland">Cano Cao Tốc Novaland (Đón tại Bến Bạch Đằng)</SelectItem>
                  <SelectItem value="Xe Điện Buggy Nội Khu">Xe Điện Buggy Tham Quan Nội Khu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" /> Tiêu chuẩn dịch vụ đón tiếp VIP:
              </div>
              <p className="text-[11px] text-emerald-800">
                Bao gồm tài xế riêng, nước suối yến sào cao cấp, khăn lạnh và tiệc trà canape tại Sales Gallery.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setIsSiteTourModalOpen(false)} className="text-xs">
              Hủy
            </Button>
            <Button size="sm" onClick={handleConfirmSiteTour} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold">
              <Check className="h-3.5 w-3.5 mr-1" /> Xác Nhận Đặt Lịch Xe
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
