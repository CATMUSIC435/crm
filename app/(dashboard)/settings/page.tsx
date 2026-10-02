"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { 
  Settings, Shield, Users, Building2, History, DatabaseBackup, Save, 
  Key, Check, Plus, UploadCloud, RefreshCw, Server, AlertTriangle, MonitorStop, CheckCircle,
  Download, Trash2, Lock, Unlock, Globe, FileText, Smartphone, Mail, Bell, Sliders,
  Eye, Copy, FileSpreadsheet, Search, Filter, Sparkles, Clock, ArrowRight,
  Fingerprint, Laptop, Radio, HardDrive, Terminal, X, ShieldAlert, ShieldCheck, Activity
} from 'lucide-react'
import { 
  RbacPermissionItem, SystemAuditLogItem, BackupSnapshotItem, 
  SystemTenantConfig, SecurityPolicyConfig, NotificationRuleItem, TenantBranch
} from '@/types'

// INITIAL MOCK DATA
const INITIAL_RBAC_PERMISSIONS: RbacPermissionItem[] = [
  { id: 'perm-1', name: 'Xem hồ sơ & Thông tin Khách hàng', category: 'customers', description: 'Được phép xem danh sách, SĐT và lịch sử chăm sóc KH', super_admin: true, director: true, agent: true, f2_agency: false },
  { id: 'perm-2', name: 'Chỉnh sửa / Cập nhật Hợp đồng & Cọc', category: 'contracts', description: 'Điều chỉnh điều khoản hợp đồng cọc, giá bán và phụ lục', super_admin: true, director: true, agent: false, f2_agency: false },
  { id: 'perm-3', name: 'Xuất (Export) Dữ liệu ra Excel / CSV', category: 'system', description: 'Tải toàn bộ danh sách khách hàng và doanh số bán hàng', super_admin: true, director: false, agent: false, f2_agency: false },
  { id: 'perm-4', name: 'Khóa căn (Hold) & Tạo Giỏ hàng bán chéo', category: 'inventory', description: 'Giữ căn 15 phút và chia sẻ rổ hàng thứ cấp với đại lý F2', super_admin: true, director: true, agent: true, f2_agency: true },
  { id: 'perm-5', name: 'Điều chỉnh Bảng giá & Chiết khấu Dự án', category: 'finance', description: 'Ban hành bảng giá mới, điều chỉnh voucher và quà tặng mở bán', super_admin: true, director: true, agent: false, f2_agency: false },
  { id: 'perm-6', name: 'Phê duyệt Hợp đồng & Xác nhận Cọc', category: 'contracts', description: 'Ký duyệt số hợp đồng, đối soát tiền cọc vào tài khoản sàn', super_admin: true, director: true, agent: false, f2_agency: false },
  { id: 'perm-7', name: 'Xóa vĩnh viễn Dữ liệu (Hard Delete)', category: 'system', description: 'Xóa khách hàng, giao dịch, hồ sơ không thể khôi phục', super_admin: true, director: false, agent: false, f2_agency: false },
  { id: 'perm-8', name: 'Thiết lập Hoa hồng & Phân tầng Thưởng Sale', category: 'finance', description: 'Cấu hình % hoa hồng F1, F2 và cơ chế thưởng nóng giao dịch', super_admin: true, director: true, agent: false, f2_agency: false },
  { id: 'perm-9', name: 'Xem Báo cáo Doanh thu & Dòng tiền Sàn', category: 'finance', description: 'Truy cập báo cáo tài chính, dòng tiền hoa hồng và P&L sàn', super_admin: true, director: true, agent: false, f2_agency: false },
  { id: 'perm-10', name: 'Cấu hình KPI & Phân bổ Nguồn Lead tự động', category: 'customers', description: 'Chia lead marketing theo Round-Robin hoặc Top Performer', super_admin: true, director: true, agent: false, f2_agency: false },
  { id: 'perm-11', name: 'Gửi Thông báo Push & Chiến dịch Zalo ZNS', category: 'system', description: 'Gửi tin nhắn hàng loạt đến hàng nghìn khách hàng và môi giới', super_admin: true, director: true, agent: false, f2_agency: false },
  { id: 'perm-12', name: 'Cấu hình API Keys & Đấu nối ERP / Ngân hàng', category: 'system', description: 'Quản lý khóa bảo mật API MISA, VietQR, VNPT eKYC và webhook', super_admin: true, director: false, agent: false, f2_agency: false },
]

const INITIAL_AUDIT_LOGS: SystemAuditLogItem[] = [
  { 
    id: 'log-101', 
    time: '18:20 19/07/2026', 
    user: 'Lê Hoàng Anh', 
    role: 'Giám Đốc Kinh Doanh', 
    ip: '192.168.1.45', 
    action: 'EXPORT_CUSTOMERS', 
    detail: 'Tải 500 records khách hàng VVIP dự án NovaWorld Phan Thiet ra file Excel', 
    status: 'WARNING',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0',
    payloadJson: JSON.stringify({ action: "EXPORT", dataset: "CUSTOMERS_VVIP", recordCount: 500, format: "xlsx", encrypted: true, hash: "sha256:8f4c71e09" }, null, 2)
  },
  { 
    id: 'log-102', 
    time: '17:45 19/07/2026', 
    user: 'Trần Văn Đạt', 
    role: 'Trưởng Phòng Pháp Lý', 
    ip: '113.190.22.1', 
    action: 'UPDATE_CONTRACT', 
    detail: 'Thay đổi giá trị thanh toán đợt 2 HĐ #HD-928 (từ 3.2 Tỷ lên 3.5 Tỷ VNĐ)', 
    status: 'SUCCESS',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1',
    payloadJson: JSON.stringify({ contractId: "HD-928", changes: { installment2: { old: 3200000000, new: 3500000000 } }, reason: "Khách hàng nhận chiết khấu gói nội thất VIP" }, null, 2)
  },
  { 
    id: 'log-103', 
    time: '16:30 19/07/2026', 
    user: 'System Cron', 
    role: 'Hệ Thống Tự Động', 
    ip: '127.0.0.1', 
    action: 'AUTO_BACKUP', 
    detail: 'Sao lưu DB tự động snapshot 18.5GB lên AWS S3 (AP-Southeast-1)', 
    status: 'SUCCESS',
    userAgent: 'Go-http-client/1.1 (NovaCRM-Backup-Daemon)',
    payloadJson: JSON.stringify({ snapshotId: "snap-auto-20260719-0200", sizeBytes: 19864223744, destination: "s3://novacrm-backup-apac/snapshots/", compression: "gzip" }, null, 2)
  },
  { 
    id: 'log-104', 
    time: '14:15 19/07/2026', 
    user: 'Nguyễn Tuấn Tú', 
    role: 'Chuyên Viên Kinh Doanh', 
    ip: '14.232.11.89', 
    action: 'FAILED_LOGIN', 
    detail: 'Đăng nhập sai mật khẩu 5 lần liên tiếp từ IP lạ (Vũng Tàu)', 
    status: 'DANGER',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X)',
    payloadJson: JSON.stringify({ event: "BRUTE_FORCE_SUSPECT", attempts: 5, targetEmail: "tu.nguyen@novacrm.vn", ipGeo: "Vung Tau, VN", actionTaken: "ACCOUNT_TEMPORARILY_LOCKED_30MIN" }, null, 2)
  },
  { 
    id: 'log-105', 
    time: '12:00 19/07/2026', 
    user: 'Phạm Thị Mai', 
    role: 'Chuyên Viên CSKH', 
    ip: '118.69.112.55', 
    action: 'DELETE_CUSTOMER', 
    detail: 'Xóa hồ sơ khách hàng trùng lặp: Nguyễn Văn A (Mã KH: KH-9921)', 
    status: 'WARNING',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/126.0',
    payloadJson: JSON.stringify({ customerId: "KH-9921", name: "Nguyễn Văn A", phone: "0909***123", deletedBy: "mai.pham", mergedWith: "KH-0012" }, null, 2)
  },
  { 
    id: 'log-106', 
    time: '09:30 19/07/2026', 
    user: 'Lê Hoàng Anh', 
    role: 'Giám Đốc Kinh Doanh', 
    ip: '192.168.1.45', 
    action: 'APPROVE_DEAL', 
    detail: 'Phê duyệt giao dịch đặc cọc Biệt thự Biển NVW-01.01 (25 Tỷ VNĐ)', 
    status: 'SUCCESS',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0',
    payloadJson: JSON.stringify({ unitCode: "NVW-01.01", price: 25000000000, customerName: "Nguyễn Văn Tuấn", commissionAmount: 375000000, approvalStatus: "VERIFIED" }, null, 2)
  },
  { 
    id: 'log-107', 
    time: '08:15 19/07/2026', 
    user: 'Unknown Attacker', 
    role: 'Khách Vãng Lai', 
    ip: '45.122.19.2', 
    action: 'UNAUTHORIZED_API', 
    detail: 'Gửi request /api/v1/customers bằng Bearer Token đã bị thu hồi', 
    status: 'DANGER',
    userAgent: 'Python-requests/2.31.0',
    payloadJson: JSON.stringify({ endpoint: "/api/v1/customers", httpMethod: "GET", tokenPrefix: "sk_live_old_...", blockReason: "TOKEN_REVOKED_SOC2_VIOLATION", responseCode: 401 }, null, 2)
  },
  { 
    id: 'log-108', 
    time: '23:00 18/07/2026', 
    user: 'System Worker', 
    role: 'Hệ Thống Tự Động', 
    ip: '127.0.0.1', 
    action: 'SYNC_ERP', 
    detail: 'Đồng bộ tự động 120 đơn đặt cọc hợp lệ sang phần mềm kế toán MISA SME', 
    status: 'SUCCESS',
    userAgent: 'NovaCRM-ERP-SyncBot/2.4',
    payloadJson: JSON.stringify({ target: "MISA_SME_CLOUD", itemsSynced: 120, failedItems: 0, syncDurationMs: 4200 }, null, 2)
  }
]

const INITIAL_SNAPSHOTS: BackupSnapshotItem[] = [
  { id: 'snap-1', name: 'Auto_Daily_Nightly_Full_Snapshot', size: '18.5 GB', sizeBytes: 19864223744, createdAt: '19/07/2026 02:00 AM', type: 'auto', checksum: 'sha256:7e98a1f28b4c09d5', status: 'verified' },
  { id: 'snap-2', name: 'Manual_Pre_Release_v5.2_Migration', size: '18.4 GB', sizeBytes: 19756849152, createdAt: '18/07/2026 21:15 PM', type: 'manual', checksum: 'sha256:3a11dc9827fe55aa', status: 'verified' },
  { id: 'snap-3', name: 'Auto_Daily_Nightly_Full_Snapshot', size: '18.2 GB', sizeBytes: 19542097920, createdAt: '17/07/2026 02:00 AM', type: 'auto', checksum: 'sha256:09cb42e185f377cd', status: 'verified' },
]

const INITIAL_TENANT_CONFIG: SystemTenantConfig = {
  companyName: 'Tập Đoàn Bất Động Sản Nova Capital',
  customDomain: 'crm.novacapital.vn',
  primaryColor: '#4f46e5',
  accentColor: '#06b6d4',
  logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  brandTagline: 'Khởi Nguồn Thịnh Vượng - Vững Bước Tương Lai',
  licenseTier: 'Enterprise Unlimited Tenants (SOC-2 Type II)',
  watermarkContracts: true,
  autoLockSessionMinutes: 15,
  branches: [
    { id: 'b1', name: 'Hội Sở Chính - Nova Tower', address: 'Số 65 Nguyễn Du, Bến Nghé, Quận 1, TP.HCM', active: true, agentCount: 38 },
    { id: 'b2', name: 'Chi Nhánh Dự Án Phan Thiết', address: 'Đại Lộ Lạc Long Quân, Tiến Thành, Phan Thiết', active: true, agentCount: 18 },
    { id: 'b3', name: 'Chi Nhánh Phía Bắc - Hà Nội', address: 'Tầng 18 Keangnam Landmark 72, Nam Từ Liêm, Hà Nội', active: true, agentCount: 12 },
  ]
}

const INITIAL_SECURITY_POLICY: SecurityPolicyConfig = {
  enforce2FA: true,
  ipWhitelistEnabled: true,
  ipWhitelist: ['113.190.22.45 (Hội Sở TP.HCM)', '14.232.11.89 (VP Phan Thiết)', '125.235.4.12 (VPN Kế Toán)'],
  minPasswordLength: 12,
  passwordExpiryDays: 90,
  maxLoginAttempts: 5,
  sessionTimeoutMinutes: 15,
  biometricAllowed: true,
  preventDataExfiltration: true,
  maintenanceMode: false
}

const INITIAL_NOTIFICATION_RULES: NotificationRuleItem[] = [
  { id: 'rule-1', name: 'Giao dịch Bất Động Sản Siêu Lớn (> 20 Tỷ VNĐ)', description: 'Bắn tin nhắn SMS & Telegram ngay cho Tổng Giám Đốc khi có deal cọc VVIP', condition: 'deal_value > 20000000000', thresholdValue: '20,000,000,000 VNĐ', channels: ['sms', 'telegram'], recipients: ['ceo@novacrm.vn', '+84901234567'], active: true },
  { id: 'rule-2', name: 'Cảnh Báo Tấn Công Dò Mật Khẩu (Brute-Force)', description: 'Phát hiện tài khoản gõ sai mật khẩu > 5 lần từ dải IP bất thường', condition: 'failed_login_count >= 5', thresholdValue: '5 Lần / 10 Phút', channels: ['email', 'telegram'], recipients: ['security@novacrm.vn'], active: true },
  { id: 'rule-3', name: 'Tỷ Lệ Giữ Chỗ Dự Án Đạt Ngưỡng Cháy Hàng (> 90%)', description: 'Gửi thông báo Push đến toàn bộ Sale khi rổ hàng căn đẹp sắp hết', condition: 'project_sold_rate >= 90%', thresholdValue: '90% Tổng Căn', channels: ['zalo', 'email'], recipients: ['all-sales-managers@novacrm.vn'], active: true },
  { id: 'rule-4', name: 'Giữ Chỗ Khóa Căn (Holding 15p) Sắp Hết Hạn', description: 'Thông báo Zalo ZNS cảnh báo Sale trước 3 phút khi đồng hồ đếm ngược hết giờ', condition: 'holding_timer <= 180s', thresholdValue: '3 Phút Trước Khi Mở Khóa', channels: ['zalo', 'sms'], recipients: ['holding-agent@novacrm.vn'], active: true },
  { id: 'rule-5', name: 'Nhân Viên Tải Dữ Liệu Khách Hàng Bất Thường', description: 'Cảnh báo Data Leakage khi có thao tác xuất > 200 số điện thoại/ngày', condition: 'export_records_per_day > 200', thresholdValue: '200 Khách Hàng / Ngày', channels: ['email', 'telegram'], recipients: ['ciso@novacrm.vn', 'admin@novacrm.vn'], active: true },
]

const COLOR_PRESETS = [
  { name: 'Nova Indigo', primary: '#4f46e5', accent: '#06b6d4', desc: 'Thanh lịch & Công nghệ' },
  { name: 'Vinhomes Crimson', primary: '#dc2626', accent: '#f59e0b', desc: 'Uy quyền & Đẳng cấp' },
  { name: 'Masterise Luxury Gold', primary: '#b45309', accent: '#fbbf24', desc: 'Thượng lưu & Độc bản' },
  { name: 'Ecopark Emerald', primary: '#059669', accent: '#10b981', desc: 'Xanh sinh thái nghỉ dưỡng' },
  { name: 'SunGroup Sunset Ocean', primary: '#0284c7', accent: '#f97316', desc: 'Năng động & Biển xanh' },
  { name: 'Hưng Thịnh Modern Navy', primary: '#1e3a8a', accent: '#3b82f6', desc: 'Bền vững & Chuyên nghiệp' },
]

export default function SystemSettingsPage() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'rbac' | 'multitenant' | 'security' | 'audit' | 'backup' | 'notifications'>('rbac')
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  
  // Data States
  const [permissions, setPermissions] = useState<RbacPermissionItem[]>(INITIAL_RBAC_PERMISSIONS)
  const [rbacSearch, setRbacSearch] = useState('')
  const [rbacCategoryFilter, setRbacCategoryFilter] = useState<string>('ALL')
  
  const [tenantConfig, setTenantConfig] = useState<SystemTenantConfig>(INITIAL_TENANT_CONFIG)
  const [dnsStatus, setDnsStatus] = useState<'idle' | 'checking' | 'verified'>('verified')
  
  const [securityPolicy, setSecurityPolicy] = useState<SecurityPolicyConfig>(INITIAL_SECURITY_POLICY)
  const [newIpInput, setNewIpInput] = useState('')
  const [newIpLabel, setNewIpLabel] = useState('')

  const [auditLogs, setAuditLogs] = useState<SystemAuditLogItem[]>(INITIAL_AUDIT_LOGS)
  const [auditSearch, setAuditSearch] = useState('')
  const [auditStatusFilter, setAuditStatusFilter] = useState<string>('ALL')
  
  const [snapshots, setSnapshots] = useState<BackupSnapshotItem[]>(INITIAL_SNAPSHOTS)
  const [notificationRules, setNotificationRules] = useState<NotificationRuleItem[]>(INITIAL_NOTIFICATION_RULES)

  // Macro KPI States
  const [totalUsers, setTotalUsers] = useState(68)
  const [pendingUsers, setPendingUsers] = useState(4)

  // Modals States (5 Modals)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showCreateBackupModal, setShowCreateBackupModal] = useState(false)
  const [selectedBackupToRestore, setSelectedBackupToRestore] = useState<BackupSnapshotItem | null>(null)
  const [restoreConfirmText, setRestoreConfirmText] = useState('')
  const [isRestoring, setIsRestoring] = useState(false)
  const [selectedAuditLogModal, setSelectedAuditLogModal] = useState<SystemAuditLogItem | null>(null)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [maintenanceTimeSelect, setMaintenanceTimeSelect] = useState('30 phút')
  const [maintenanceCustomMsg, setMaintenanceCustomMsg] = useState('Hệ thống đang tiến hành nâng cấp lõi cơ sở dữ liệu định kỳ. Vui lòng quay lại sau ít phút.')

  // Modal 1: Form state for Add User
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPhone, setNewUserPhone] = useState('')
  const [newUserRole, setNewUserRole] = useState<'super_admin' | 'director' | 'agent' | 'f2_agency'>('agent')
  const [newUserBranch, setNewUserBranch] = useState('Hội Sở Chính - Nova Tower')
  const [newUserSendPass, setNewUserSendPass] = useState(true)

  // Modal 2: Form state for Backup creation
  const [backupNameInput, setBackupNameInput] = useState(`Manual_Hotfix_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`)
  const [backupScope, setBackupScope] = useState('FULL')
  const [backupProgress, setBackupProgress] = useState(0)
  const [isBackingUp, setIsBackingUp] = useState(false)

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3500)
  }

  // RBAC Actions
  const togglePermission = (id: string, role: 'super_admin' | 'director' | 'agent' | 'f2_agency') => {
    setPermissions(prev => prev.map(p => p.id === id ? { ...p, [role]: !p[role] } : p))
  }

  const handleSelectAllRole = (role: 'super_admin' | 'director' | 'agent' | 'f2_agency', value: boolean) => {
    setPermissions(prev => prev.map(p => ({ ...p, [role]: value })))
    showToast(`Đã ${value ? 'cấp toàn bộ' : 'thu hồi toàn bộ'} quyền hạn cho vai trò ${role.toUpperCase()}!`)
  }

  const handleResetRbacDefaults = () => {
    setPermissions(INITIAL_RBAC_PERMISSIONS)
    showToast("Đã khôi phục ma trận phân quyền RBAC về cấu hình mặc định ban đầu!")
  }

  // Filtered RBAC Permissions
  const filteredPermissions = permissions.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(rbacSearch.toLowerCase()) || 
                        p.description.toLowerCase().includes(rbacSearch.toLowerCase())
    const matchCat = rbacCategoryFilter === 'ALL' || p.category === rbacCategoryFilter
    return matchSearch && matchCat
  })

  // Multi-tenant DNS Check
  const handleCheckDNS = () => {
    setDnsStatus('checking')
    setTimeout(() => {
      setDnsStatus('verified')
      showToast(`Tên miền ${tenantConfig.customDomain} đã được cấu hình CNAME hợp lệ và SSL TLS 1.3 kích hoạt!`)
    }, 1200)
  }

  // IP Whitelist Actions
  const handleAddIp = () => {
    if (!newIpInput.trim()) {
      showToast("Vui lòng nhập địa chỉ IP hợp lệ!")
      return
    }
    const label = newIpLabel.trim() ? ` (${newIpLabel.trim()})` : ''
    const formatted = `${newIpInput.trim()}${label}`
    setSecurityPolicy(prev => ({
      ...prev,
      ipWhitelist: [...prev.ipWhitelist, formatted]
    }))
    setNewIpInput('')
    setNewIpLabel('')
    showToast(`Đã thêm IP ${formatted} vào danh sách cho phép (Whitelist)!`)
  }

  const handleRemoveIp = (ipStr: string) => {
    setSecurityPolicy(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter(item => item !== ipStr)
    }))
    showToast(`Đã xóa IP ${ipStr} khỏi danh sách Whitelist!`)
  }

  // Audit Log Filter
  const filteredAuditLogs = auditLogs.filter(log => {
    const matchSearch = log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
                        log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
                        log.ip.toLowerCase().includes(auditSearch.toLowerCase()) ||
                        log.detail.toLowerCase().includes(auditSearch.toLowerCase())
    const matchStatus = auditStatusFilter === 'ALL' || log.status === auditStatusFilter
    return matchSearch && matchStatus
  })

  // Backup & Restore Actions
  const handleStartBackup = () => {
    setIsBackingUp(true)
    setBackupProgress(10)
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          setShowCreateBackupModal(false)
          
          const newSnap: BackupSnapshotItem = {
            id: `snap-${Date.now()}`,
            name: backupNameInput.trim() || 'Manual_Snapshot_Emergency',
            size: backupScope === 'FULL' ? '18.5 GB' : '4.2 GB',
            sizeBytes: backupScope === 'FULL' ? 19864223744 : 4509715660,
            createdAt: `Hôm nay, ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
            type: 'manual',
            checksum: `sha256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
            status: 'verified'
          }
          setSnapshots(prev => [newSnap, ...prev])
          showToast(`Tạo bản sao lưu "${newSnap.name}" thành công! Checksum: ${newSnap.checksum.substring(0, 15)}...`)
          return 100
        }
        return prev + 25
      })
    }, 350)
  }

  const handleExecuteRestore = () => {
    if (restoreConfirmText.trim().toUpperCase() !== 'CONFIRM') {
      showToast("Vui lòng nhập chính xác chữ 'CONFIRM' để xác nhận khôi phục an toàn!")
      return
    }
    setIsRestoring(true)
    setTimeout(() => {
      setIsRestoring(false)
      const restoredName = selectedBackupToRestore?.name || 'Snapshot'
      setSelectedBackupToRestore(null)
      setRestoreConfirmText('')
      showToast(`Hệ thống đã phục hồi toàn vẹn từ bản sao lưu [${restoredName}]! Không phát sinh lỗi dữ liệu.`)
    }, 1800)
  }

  const handleDeleteSnapshot = (id: string, name: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id))
    showToast(`Đã xóa vĩnh viễn bản sao lưu [${name}] khỏi máy chủ!`)
  }

  // Notification Rules Action
  const toggleNotificationRule = (id: string) => {
    setNotificationRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r))
    showToast("Đã cập nhật trạng thái quy tắc cảnh báo leo thang!")
  }

  // Modal 1: Add User Submit
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast("Vui lòng nhập đầy đủ Tên và Email tài khoản!")
      return
    }
    setTotalUsers(prev => prev + 1)
    setShowAddUserModal(false)
    showToast(`Đã tạo và cấp quyền thành công cho tài khoản [${newUserName}] (${newUserEmail})!`)
    setNewUserName('')
    setNewUserEmail('')
    setNewUserPhone('')
  }

  // Modal 5: Toggle Maintenance
  const handleToggleMaintenance = () => {
    const nextState = !securityPolicy.maintenanceMode
    setSecurityPolicy(prev => ({ ...prev, maintenanceMode: nextState }))
    setShowMaintenanceModal(false)
    if (nextState) {
      showToast(`Hệ thống ĐÃ BẬT Chế độ bảo trì trong ${maintenanceTimeSelect}. Người dùng ngoài Admin sẽ bị chặn.`)
    } else {
      showToast("Hệ thống ĐÃ MỞ LẠI bình thường cho tất cả chuyên viên và đại lý đối tác!")
    }
  }

  // UTF-8 BOM CSV Export
  const handleExportCSV = () => {
    let csv = '\uFEFF' // BOM UTF-8 for Excel Vietnamese support
    csv += 'MA TRAN PHAN QUYEN RBAC (ROLE-BASED ACCESS CONTROL)\r\n'
    csv += 'Mã Quyền,Tên Quyền Hạn,Danh Mục,Mô Tả,Super Admin,Giám Đốc,Chuyên Viên Sale,Đại Lý F2\r\n'
    permissions.forEach(p => {
      csv += `"${p.id}","${p.name}","${p.category}","${p.description}","${p.super_admin ? 'CÓ' : 'KHÔNG'}","${p.director ? 'CÓ' : 'KHÔNG'}","${p.agent ? 'CÓ' : 'KHÔNG'}","${p.f2_agency ? 'CÓ' : 'KHÔNG'}"\r\n`
    })

    csv += '\r\n\r\nNHAT KY GIAM SAT AN NINH (SECURITY AUDIT LOGS)\r\n'
    csv += 'Mã Log,Thời Gian,Người Dùng,Vai Trò,Địa Chỉ IP,Hành Động,Chi Tiết,Trạng Thái\r\n'
    auditLogs.forEach(l => {
      csv += `"${l.id}","${l.time}","${l.user}","${l.role}","${l.ip}","${l.action}","${l.detail.replace(/"/g, '""')}","${l.status}"\r\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `NovaCRM_System_Settings_RBAC_Audit_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast("Đã xuất báo cáo Ma trận Phân quyền & Audit Log (CSV UTF-8 BOM) thành công!")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-top-4">
          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Maintenance Mode Top Banner */}
      {securityPolicy.maintenanceMode && (
        <div className="bg-amber-500 text-slate-950 px-6 py-3 rounded-xl shadow-md flex items-center justify-between border border-amber-600 font-medium animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-slate-950 font-bold" />
            <span><strong>CẢNH BÁO HỆ THỐNG:</strong> Chế độ bảo trì toàn sàn đang BẬT. Chỉ Super Admin có thể đăng nhập. Thời gian dự kiến: {maintenanceTimeSelect}.</span>
          </div>
          <Button size="sm" variant="outline" className="bg-slate-950 text-white hover:bg-slate-800 border-none text-xs font-bold" onClick={() => setShowMaintenanceModal(true)}>
            Cấu hình bảo trì
          </Button>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Server className="h-64 w-64 text-indigo-500 -mt-10 -mr-10" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-indigo-600 text-white border-none font-bold text-xs uppercase tracking-wider px-3 py-1">
              Phân Hệ 32 / 32 • Enterprise Core
            </Badge>
            <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 font-mono text-xs flex items-center gap-1.5 bg-emerald-500/10">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {securityPolicy.maintenanceMode ? 'Đang Bảo Trì' : 'Hệ Thống Trực Tuyến (SLA 99.98%)'}
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
            <Settings className="h-8 w-8 text-indigo-400" />
            Cài Đặt Hệ Thống & Phân Quyền RBAC
          </h1>
          <p className="text-slate-300 mt-2 text-sm leading-relaxed">
            Trung tâm kiểm soát an ninh tối cao, thiết lập ma trận phân quyền vai trò (Role-Based Access Control), 
            nhận diện thương hiệu đa sàn Multi-tenant White-label và giám sát an toàn thông tin SOC-2 Type II.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <Button 
            variant="outline" 
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            onClick={() => setShowMaintenanceModal(true)}
          >
            <MonitorStop className="h-4 w-4 mr-1.5 text-amber-400" /> 
            {securityPolicy.maintenanceMode ? 'Tắt Bảo Trì' : 'Chế Độ Bảo Trì'}
          </Button>

          <Button 
            variant="outline" 
            className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4 mr-1.5 text-cyan-400" /> 
            Xuất Báo Cáo (CSV)
          </Button>

          <Button 
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
            onClick={() => setShowAddUserModal(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" /> 
            Thêm Tài Khoản / Vai Trò
          </Button>

          <Button 
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
            onClick={() => showToast("Đã ghi nhận và đồng bộ toàn bộ thiết lập hệ thống trên tất cả máy chủ!")}
          >
            <Save className="h-4 w-4 mr-1.5" /> 
            Lưu Cấu Hình
          </Button>
        </div>
      </div>

      {/* 4 MACRO KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tài Khoản Kích Hoạt</div>
              <div className="text-2xl font-black text-slate-900">{totalUsers} Users</div>
              <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> +{pendingUsers} tài khoản chờ cấp quyền
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cấp Bậc Vai Trò RBAC</div>
              <div className="text-2xl font-black text-purple-700">4 Phân Tầng</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Admin (3) • Quản Lý (8) • Sale (45) • F2 (12)
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Shield className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Điểm Tuân Thủ Bảo Mật</div>
              <div className="text-2xl font-black text-emerald-600">98 / 100</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                SOC-2 Type II • 2FA Enforce • IP Whitelist
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Key className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Dung Lượng Snapshot DB</div>
              <div className="text-2xl font-black text-amber-600">18.5 GB</div>
              <div className="text-xs text-slate-600 font-medium mt-1">
                Tự động sao lưu 02:00 AM • AWS S3 APAC
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <DatabaseBackup className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN LAYOUT: LEFT SIDEBAR TABS + RIGHT CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="lg:col-span-1">
          <Card className="shadow-sm border-slate-200 sticky top-6 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mục Cấu Hình Hệ Thống</span>
              <Badge variant="outline" className="text-[10px] bg-white font-mono">v5.2.0</Badge>
            </div>
            <CardContent className="p-2 flex flex-col gap-1">
              {[
                { id: 'rbac', label: 'Ma Trận Phân Quyền (RBAC)', icon: <Shield className="h-4 w-4" />, badge: `${permissions.length} Quyền` },
                { id: 'multitenant', label: 'Cấu Hình Đa Sàn (White-label)', icon: <Building2 className="h-4 w-4" />, badge: 'Active' },
                { id: 'security', label: 'Chính Sách An Ninh & SOC-2', icon: <Key className="h-4 w-4" />, badge: '98/100' },
                { id: 'audit', label: 'Nhật Ký Giám Sát (Audit Log)', icon: <History className="h-4 w-4" />, badge: `${auditLogs.length} Events` },
                { id: 'backup', label: 'Sao Lưu & Phục Hồi Thảm Họa', icon: <DatabaseBackup className="h-4 w-4" />, badge: '18.5GB' },
                { id: 'notifications', label: 'Quy Tắc Cảnh Báo Leo Thang', icon: <Bell className="h-4 w-4" />, badge: '5 Rules' },
              ].map(menu => {
                const isActive = activeTab === menu.id
                return (
                  <button
                    key={menu.id}
                    onClick={() => setActiveTab(menu.id as any)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl font-medium text-xs sm:text-sm transition-all text-left ${
                      isActive 
                        ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/80 shadow-xs' 
                        : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>{menu.icon}</span>
                      <span>{menu.label}</span>
                    </div>
                    {menu.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {menu.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </CardContent>
            <div className="p-4 bg-slate-50/60 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <div className="flex justify-between items-center">
                <span>Trạng thái phân vùng:</span>
                <span className="font-semibold text-emerald-600">Ổn định 100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tenant ID:</span>
                <span className="font-mono text-[11px] text-slate-700">nova-tenant-vn-01</span>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT CONTENT DISPLAY */}
        <div className="lg:col-span-3 space-y-6">

          {/* =========================================================================
              TAB 1: RBAC MATRIX
             ========================================================================= */}
          {activeTab === 'rbac' && (
            <Card className="shadow-sm border-indigo-100">
              <CardHeader className="border-b bg-gradient-to-r from-indigo-50/60 to-white pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-indigo-950 text-lg">
                      <Shield className="h-5 w-5 text-indigo-600" />
                      Ma Trận Phân Quyền Vai Trò (Role-Based Access Control)
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-xs mt-1">
                      Kiểm soát chặt chẽ từng hành vi dữ liệu cho 4 cấp bậc tài khoản trong doanh nghiệp.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      onClick={handleResetRbacDefaults}
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1 text-slate-500" /> Khôi Phục Mặc Định
                    </Button>
                    <Button 
                      size="sm" 
                      className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                      onClick={() => showToast("Đã lưu ma trận phân quyền RBAC thành công trên toàn bộ phân hệ!")}
                    >
                      <Save className="h-3.5 w-3.5 mr-1" /> Lưu Ma Trận
                    </Button>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="mt-4 pt-3 border-t border-indigo-100/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input 
                      placeholder="Tìm kiếm quyền hạn, mô tả..." 
                      className="pl-9 h-9 text-xs bg-white"
                      value={rbacSearch}
                      onChange={(e) => setRbacSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                    {[
                      { id: 'ALL', label: 'Tất Cả' },
                      { id: 'customers', label: 'Khách Hàng' },
                      { id: 'contracts', label: 'Hợp Đồng' },
                      { id: 'inventory', label: 'Giỏ Hàng' },
                      { id: 'finance', label: 'Tài Chính' },
                      { id: 'system', label: 'Hệ Thống' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setRbacCategoryFilter(f.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                          rbacCategoryFilter === f.id
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              {/* RBAC Table */}
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700">
                    <tr>
                      <th className="p-3.5 font-bold">Hành Vi / Quyền Hạn Dữ Liệu</th>
                      <th className="p-3.5 text-center font-bold">
                        <div className="flex flex-col items-center">
                          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100 border-none font-bold text-[11px] mb-1">
                            Super Admin
                          </Badge>
                          <button 
                            onClick={() => handleSelectAllRole('super_admin', true)}
                            className="text-[10px] text-slate-400 hover:text-indigo-600 underline font-normal"
                          >
                            Tất cả
                          </button>
                        </div>
                      </th>
                      <th className="p-3.5 text-center font-bold">
                        <div className="flex flex-col items-center">
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-none font-bold text-[11px] mb-1">
                            Giám Đốc / QL
                          </Badge>
                          <button 
                            onClick={() => handleSelectAllRole('director', true)}
                            className="text-[10px] text-slate-400 hover:text-indigo-600 underline font-normal"
                          >
                            Tất cả
                          </button>
                        </div>
                      </th>
                      <th className="p-3.5 text-center font-bold">
                        <div className="flex flex-col items-center">
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none font-bold text-[11px] mb-1">
                            Chuyên Viên Sale
                          </Badge>
                          <button 
                            onClick={() => handleSelectAllRole('agent', true)}
                            className="text-[10px] text-slate-400 hover:text-indigo-600 underline font-normal"
                          >
                            Tất cả
                          </button>
                        </div>
                      </th>
                      <th className="p-3.5 text-center font-bold">
                        <div className="flex flex-col items-center">
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-none font-bold text-[11px] mb-1">
                            Đại Lý F2
                          </Badge>
                          <button 
                            onClick={() => handleSelectAllRole('f2_agency', false)}
                            className="text-[10px] text-slate-400 hover:text-rose-600 underline font-normal"
                          >
                            Bỏ chọn
                          </button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPermissions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400">
                          Không tìm thấy quyền hạn nào phù hợp với từ khóa & bộ lọc.
                        </td>
                      </tr>
                    ) : (
                      filteredPermissions.map(row => (
                        <tr key={row.id} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="p-3.5">
                            <div className="font-semibold text-slate-800">{row.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{row.description}</div>
                            <div className="mt-1">
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                                {row.category}
                              </span>
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={row.super_admin} 
                                onCheckedChange={() => togglePermission(row.id, 'super_admin')} 
                              />
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={row.director} 
                                onCheckedChange={() => togglePermission(row.id, 'director')} 
                              />
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={row.agent} 
                                onCheckedChange={() => togglePermission(row.id, 'agent')} 
                              />
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <div className="flex justify-center">
                              <Checkbox 
                                checked={row.f2_agency} 
                                onCheckedChange={() => togglePermission(row.id, 'f2_agency')} 
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>

              {/* RBAC Footer Summary */}
              <CardFooter className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600">
                <div className="flex items-center gap-4 flex-wrap">
                  <span><strong>Super Admin:</strong> {permissions.filter(p => p.super_admin).length}/{permissions.length} quyền</span>
                  <span><strong>Giám Đốc:</strong> {permissions.filter(p => p.director).length}/{permissions.length} quyền</span>
                  <span><strong>Sale:</strong> {permissions.filter(p => p.agent).length}/{permissions.length} quyền</span>
                  <span><strong>Đại Lý F2:</strong> {permissions.filter(p => p.f2_agency).length}/{permissions.length} quyền</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Cơ chế RBAC kiểm tra quyền hạn cấp máy chủ (Server-side Middleware Guard)
                </div>
              </CardFooter>
            </Card>
          )}

          {/* =========================================================================
              TAB 2: MULTI-TENANT WHITE-LABEL
             ========================================================================= */}
          {activeTab === 'multitenant' && (
            <div className="space-y-6">
              <Card className="shadow-sm border-slate-200">
                <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-indigo-900 text-lg">
                        <Building2 className="h-5 w-5 text-indigo-600" />
                        Cấu Hình Đa Sàn Doanh Nghiệp (Multi-tenant White-label)
                      </CardTitle>
                      <CardDescription className="text-slate-500 text-xs mt-1">
                        Tùy biến tên miền CNAME riêng, nhận diện thương hiệu độc quyền và biểu tượng cho các sàn liên kết.
                      </CardDescription>
                    </div>
                    <Badge className="bg-indigo-600 text-white font-bold">
                      {tenantConfig.licenseTier}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  
                  {/* Domain & Legal */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Globe className="h-4 w-4 text-indigo-600" /> Tên Miền Độc Quyền (Custom CNAME)
                      </h4>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Tên miền hệ thống</label>
                        <div className="flex gap-2">
                          <Input 
                            value={tenantConfig.customDomain}
                            onChange={(e) => setTenantConfig({ ...tenantConfig, customDomain: e.target.value })}
                            className="font-mono text-xs" 
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCheckDNS}
                            className="text-xs shrink-0"
                            disabled={dnsStatus === 'checking'}
                          >
                            {dnsStatus === 'checking' ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Kiểm tra DNS'}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {dnsStatus === 'verified' && (
                            <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                              <CheckCircle className="h-3.5 w-3.5" /> DNS CNAME hợp lệ • Chứng chỉ SSL Let's Encrypt Wildcard Active
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Tên Pháp Nhân / Thương Hiệu</label>
                        <Input 
                          value={tenantConfig.companyName}
                          onChange={(e) => setTenantConfig({ ...tenantConfig, companyName: e.target.value })}
                          className="text-xs" 
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Slogan Thương Hiệu</label>
                        <Input 
                          value={tenantConfig.brandTagline}
                          onChange={(e) => setTenantConfig({ ...tenantConfig, brandTagline: e.target.value })}
                          className="text-xs" 
                        />
                      </div>
                    </div>

                    {/* Logo & Colors */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-indigo-600" /> Nhận Diện Màu Sắc & Thương Hiệu
                      </h4>

                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1 block">Bộ Màu Chủ Đạo (Primary / Accent)</label>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              value={tenantConfig.primaryColor}
                              onChange={(e) => setTenantConfig({ ...tenantConfig, primaryColor: e.target.value })}
                              className="h-9 w-9 rounded-lg border cursor-pointer"
                            />
                            <Input 
                              value={tenantConfig.primaryColor}
                              onChange={(e) => setTenantConfig({ ...tenantConfig, primaryColor: e.target.value })}
                              className="w-24 font-mono text-xs uppercase" 
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <input 
                              type="color" 
                              value={tenantConfig.accentColor}
                              onChange={(e) => setTenantConfig({ ...tenantConfig, accentColor: e.target.value })}
                              className="h-9 w-9 rounded-lg border cursor-pointer"
                            />
                            <Input 
                              value={tenantConfig.accentColor}
                              onChange={(e) => setTenantConfig({ ...tenantConfig, accentColor: e.target.value })}
                              className="w-24 font-mono text-xs uppercase" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Presets */}
                      <div>
                        <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Theme Mẫu Có Sẵn (Presets)</label>
                        <div className="grid grid-cols-2 gap-2">
                          {COLOR_PRESETS.map((preset, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setTenantConfig(prev => ({ ...prev, primaryColor: preset.primary, accentColor: preset.accent }))
                                showToast(`Đã áp dụng bảng màu phong cách [${preset.name}]!`)
                              }}
                              className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:border-indigo-400 bg-white text-left transition-all hover:shadow-xs"
                            >
                              <div className="flex items-center gap-1 shrink-0">
                                <div className="h-4 w-4 rounded-full border shadow-xs" style={{ backgroundColor: preset.primary }} />
                                <div className="h-4 w-4 rounded-full border shadow-xs" style={{ backgroundColor: preset.accent }} />
                              </div>
                              <div className="overflow-hidden">
                                <div className="text-[11px] font-bold text-slate-800 truncate">{preset.name}</div>
                                <div className="text-[9px] text-slate-400 truncate">{preset.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Watermark Toggle */}
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-slate-800">Đóng Dấu Chìm Watermark Hợp Đồng</div>
                          <div className="text-[11px] text-slate-500">Tự động in mờ SĐT & Email nhân viên lên file PDF để chống rò rỉ.</div>
                        </div>
                        <Checkbox 
                          checked={tenantConfig.watermarkContracts}
                          onCheckedChange={(val) => setTenantConfig(prev => ({ ...prev, watermarkContracts: !!val }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Branches / Multi-tenant list */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-800 text-sm">Chi Nhánh & Sàn Trực Thuộc Đang Quản Lý</h4>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => showToast("Mở biểu mẫu đăng ký thêm chi nhánh / sàn đối tác F2!")}
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Thêm Chi Nhánh
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {tenantConfig.branches.map(branch => (
                        <div key={branch.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2">
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-xs text-slate-800">{branch.name}</span>
                            <Badge variant={branch.active ? 'default' : 'secondary'} className={`text-[10px] ${branch.active ? 'bg-emerald-600' : 'bg-slate-400'}`}>
                              {branch.active ? 'Active' : 'Paused'}
                            </Badge>
                          </div>
                          <div className="text-[11px] text-slate-500 leading-tight">{branch.address}</div>
                          <div className="text-[11px] font-semibold text-indigo-600 pt-1 border-t border-slate-200/60 flex justify-between">
                            <span>Quy mô: {branch.agentCount} chuyên viên</span>
                            <button 
                              onClick={() => {
                                setTenantConfig(prev => ({
                                  ...prev,
                                  branches: prev.branches.map(b => b.id === branch.id ? { ...b, active: !b.active } : b)
                                }))
                                showToast(`Đã chuyển đổi trạng thái hoạt động của [${branch.name}]!`)
                              }}
                              className="text-[10px] text-slate-400 hover:text-indigo-600 underline"
                            >
                              Đổi trạng thái
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </CardContent>
                <CardFooter className="p-4 bg-slate-50 border-t justify-end">
                  <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
                    onClick={() => showToast("Đã cập nhật cấu hình thương hiệu Multi-tenant White-label!")}
                  >
                    <Save className="h-4 w-4 mr-1.5" /> Lưu Cấu Hình Nhận Diện
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* =========================================================================
              TAB 3: SECURITY & SOC-2
             ========================================================================= */}
          {activeTab === 'security' && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50/50 to-white">
                <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Chính Sách An Ninh & Tiêu Chuẩn SOC-2 Type II
                </CardTitle>
                <CardDescription className="text-slate-500 text-xs mt-1">
                  Kiểm soát xác thực đa yếu tố, tường lửa IP Whitelist và quy tắc chống rò rỉ dữ liệu khách hàng.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* 4 Security Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 2FA Toggle */}
                  <div className="p-4 border rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                        <Lock className="h-4 w-4 text-emerald-600" /> Bắt Buộc Xác Thực 2 Yếu Tố (2FA)
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Yêu cầu Google Authenticator hoặc OTP khi đăng nhập.</div>
                    </div>
                    <button
                      onClick={() => {
                        setSecurityPolicy(prev => ({ ...prev, enforce2FA: !prev.enforce2FA }))
                        showToast(`Đã ${!securityPolicy.enforce2FA ? 'KÍCH HOẠT' : 'TẮT'} bắt buộc 2FA toàn hệ thống!`)
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        securityPolicy.enforce2FA ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        securityPolicy.enforce2FA ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* IP Whitelist Toggle */}
                  <div className="p-4 border rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-blue-600" /> Tường Lửa IP Whitelist Nội Bộ
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Chỉ cho phép truy cập từ dải mạng văn phòng được cấp phép.</div>
                    </div>
                    <button
                      onClick={() => {
                        setSecurityPolicy(prev => ({ ...prev, ipWhitelistEnabled: !prev.ipWhitelistEnabled }))
                        showToast(`Đã ${!securityPolicy.ipWhitelistEnabled ? 'BẬT' : 'TẮT'} tường lửa IP Whitelist!`)
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        securityPolicy.ipWhitelistEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        securityPolicy.ipWhitelistEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* DLP Toggle */}
                  <div className="p-4 border rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4 text-amber-600" /> Chống Rò Rỉ Dữ Liệu (DLP Protection)
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Chặn và cảnh báo khi tài khoản tải vượt 100 số ĐT/ngày.</div>
                    </div>
                    <button
                      onClick={() => {
                        setSecurityPolicy(prev => ({ ...prev, preventDataExfiltration: !prev.preventDataExfiltration }))
                        showToast(`Đã ${!securityPolicy.preventDataExfiltration ? 'BẬT' : 'TẮT'} bộ lọc chống rò rỉ DLP!`)
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        securityPolicy.preventDataExfiltration ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        securityPolicy.preventDataExfiltration ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>

                  {/* Biometric Toggle */}
                  <div className="p-4 border rounded-xl hover:bg-slate-50 transition-all flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                        <Fingerprint className="h-4 w-4 text-indigo-600" /> Xác Thực Sinh Trắc Học WebAuthn
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Cho phép TouchID / FaceID khi dùng Mobile PWA đi thị trường.</div>
                    </div>
                    <button
                      onClick={() => {
                        setSecurityPolicy(prev => ({ ...prev, biometricAllowed: !prev.biometricAllowed }))
                        showToast(`Đã ${!securityPolicy.biometricAllowed ? 'CHO PHÉP' : 'CHẶN'} đăng nhập FaceID / TouchID!`)
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                        securityPolicy.biometricAllowed ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        securityPolicy.biometricAllowed ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                </div>

                {/* IP Whitelist Management Table */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">Danh Sách Địa Chỉ IP Được Phép (IP Whitelist)</h4>
                      <p className="text-xs text-slate-500">Chỉ các thiết bị thuộc dải mạng này mới có thể truy cập cổng quản trị.</p>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">{securityPolicy.ipWhitelist.length} IPs Đã Duyệt</Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input 
                      placeholder="Nhập địa chỉ IP (vd: 118.69.112.55)" 
                      value={newIpInput}
                      onChange={(e) => setNewIpInput(e.target.value)}
                      className="text-xs font-mono"
                    />
                    <Input 
                      placeholder="Mô tả văn phòng (vd: VP Quận 2)" 
                      value={newIpLabel}
                      onChange={(e) => setNewIpLabel(e.target.value)}
                      className="text-xs sm:w-48"
                    />
                    <Button 
                      size="sm" 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs shrink-0"
                      onClick={handleAddIp}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" /> Thêm IP Mới
                    </Button>
                  </div>

                  <div className="divide-y border rounded-xl overflow-hidden bg-white">
                    {securityPolicy.ipWhitelist.map((ipStr, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2">
                          <Radio className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="font-mono font-semibold text-slate-800">{ipStr}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs px-2"
                          onClick={() => handleRemoveIp(ipStr)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" /> Xóa
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Password Policies */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-800">Chính Sách Mật Khẩu & Khóa Phiên</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Độ dài tối thiểu</label>
                      <Input 
                        type="number" 
                        value={securityPolicy.minPasswordLength}
                        onChange={(e) => setSecurityPolicy({ ...securityPolicy, minPasswordLength: Number(e.target.value) })}
                        className="text-xs font-mono" 
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Khuyến nghị: Tối thiểu 12 ký tự</span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Chu kỳ đổi pass (Ngày)</label>
                      <Input 
                        type="number" 
                        value={securityPolicy.passwordExpiryDays}
                        onChange={(e) => setSecurityPolicy({ ...securityPolicy, passwordExpiryDays: Number(e.target.value) })}
                        className="text-xs font-mono" 
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Mặc định tiêu chuẩn: 90 ngày</span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Số lần thử tối đa</label>
                      <Input 
                        type="number" 
                        value={securityPolicy.maxLoginAttempts}
                        onChange={(e) => setSecurityPolicy({ ...securityPolicy, maxLoginAttempts: Number(e.target.value) })}
                        className="text-xs font-mono" 
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Khóa tạm 30p nếu sai quá 5 lần</span>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Khóa phiên tự động (Phút)</label>
                      <Input 
                        type="number" 
                        value={securityPolicy.sessionTimeoutMinutes}
                        onChange={(e) => setSecurityPolicy({ ...securityPolicy, sessionTimeoutMinutes: Number(e.target.value) })}
                        className="text-xs font-mono" 
                      />
                      <span className="text-[10px] text-slate-400 mt-1 block">Tự động lock nếu không thao tác</span>
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="p-4 bg-slate-50 border-t justify-end">
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                  onClick={() => showToast("Đã lưu chính sách bảo mật SOC-2 thành công!")}
                >
                  <Save className="h-4 w-4 mr-1.5" /> Lưu Thiết Lập Bảo Mật
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* =========================================================================
              TAB 4: AUDIT LOG
             ========================================================================= */}
          {activeTab === 'audit' && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-white pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                      <History className="h-5 w-5 text-slate-800" />
                      Nhật Ký Giám Sát An Ninh (Security Audit Log)
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-xs mt-1">
                      Ghi nhận chi tiết mọi hành vi nhạy cảm: Xuất dữ liệu, xóa khách hàng, phân quyền và kết nối API.
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportCSV}
                    className="text-xs shrink-0"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" /> Xuất Log (CSV)
                  </Button>
                </div>

                {/* Filter and Search Bar */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
                    <Input 
                      placeholder="Lọc theo tên, hành động, IP..." 
                      className="pl-9 h-9 text-xs"
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                    {[
                      { id: 'ALL', label: 'Tất Cả' },
                      { id: 'SUCCESS', label: 'Thành Công' },
                      { id: 'WARNING', label: 'Cảnh Báo' },
                      { id: 'DANGER', label: 'Nguy Cấp' },
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => setAuditStatusFilter(st.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                          auditStatusFilter === st.id
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>

              {/* Log List */}
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {filteredAuditLogs.map(log => (
                    <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 shrink-0">
                          {log.status === 'WARNING' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                          {log.status === 'DANGER' && <ShieldAlert className="h-5 w-5 text-rose-500 animate-pulse" />}
                          {log.status === 'SUCCESS' && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">{log.user}</span>
                            <Badge variant="outline" className="text-[10px] font-normal text-slate-500">{log.role}</Badge>
                            <Badge variant="outline" className={`text-[10px] font-mono font-bold ${
                              log.status === 'DANGER' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                              log.status === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {log.action}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-600 leading-relaxed">{log.detail}</div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-1">
                            <span>IP: {log.ip}</span>
                            <span>•</span>
                            <span className="truncate max-w-xs">{log.userAgent}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-2">
                        <div className="text-right text-xs text-slate-500 font-mono">
                          {log.time}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2"
                          onClick={() => setSelectedAuditLogModal(log)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Xem Payload
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-4 border-t bg-slate-50/60 justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-slate-500 hover:text-slate-800"
                  onClick={() => showToast("Đã tải thêm 20 bản ghi lưu trữ lịch sử 30 ngày trước!")}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Tải thêm dữ liệu lưu trữ cũ hơn...
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* =========================================================================
              TAB 5: BACKUP & RESTORE
             ========================================================================= */}
          {activeTab === 'backup' && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b bg-gradient-to-r from-amber-50/50 to-white">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                      <DatabaseBackup className="h-5 w-5 text-amber-600" />
                      Sao Lưu & Phục Hồi Thảm Họa (Disaster Recovery & Snapshots)
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-xs mt-1">
                      Bảo vệ an toàn dữ liệu khách hàng và hợp đồng với cơ chế Snapshot định kỳ & mã hóa AES-256.
                    </CardDescription>
                  </div>
                  <Button 
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/20"
                    onClick={() => setShowCreateBackupModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-1.5" /> Tạo Bản Sao Lưu Ngay
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">

                {/* Storage Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <Clock className="h-8 w-8 text-indigo-500 shrink-0" />
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Snapshot Gần Nhất</div>
                      <div className="text-sm font-bold text-slate-800">{snapshots[0]?.createdAt || 'Chưa có'}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <HardDrive className="h-8 w-8 text-emerald-500 shrink-0" />
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Dung Lượng Database</div>
                      <div className="text-sm font-bold text-slate-800">18.5 GB (PostgreSQL 16)</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                    <Server className="h-8 w-8 text-cyan-500 shrink-0" />
                    <div>
                      <div className="text-[11px] font-semibold text-slate-500 uppercase">Vị Trí Đám Mây</div>
                      <div className="text-sm font-bold text-slate-800">AWS S3 AP-Southeast-1</div>
                    </div>
                  </div>
                </div>

                {/* Snapshots Table */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-800">Lịch Sử Các Điểm Khôi Phục (Snapshots List)</h4>
                    <span className="text-xs text-slate-500">Giữ lưu trữ 30 ngày (Retention Policy)</span>
                  </div>

                  <div className="border rounded-xl divide-y bg-white overflow-hidden">
                    {snapshots.map(snap => (
                      <div key={snap.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-2 rounded-lg bg-slate-100 text-slate-600 shrink-0">
                            <DatabaseBackup className="h-4 w-4 text-amber-600" />
                          </div>
                          <div>
                            <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                              {snap.name}
                              <Badge variant="outline" className={`text-[10px] ${snap.type === 'auto' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                                {snap.type === 'auto' ? 'Tự Động' : 'Thủ Công'}
                              </Badge>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              Dung lượng: <strong>{snap.size}</strong> • Thời gian: {snap.createdAt}
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-1">
                              Checksum: {snap.checksum}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs text-slate-700 hover:bg-slate-100"
                            onClick={() => showToast(`Bắt đầu tải xuống file nén ${snap.name}.sql.gz...`)}
                          >
                            <Download className="h-3.5 w-3.5 mr-1" /> Tải File
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            className="text-xs font-semibold"
                            onClick={() => {
                              setSelectedBackupToRestore(snap)
                              setRestoreConfirmText('')
                            }}
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1" /> Khôi Phục
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs text-slate-400 hover:text-rose-600"
                            onClick={() => handleDeleteSnapshot(snap.id, snap.name)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

          {/* =========================================================================
              TAB 6: NOTIFICATIONS & ESCALATION RULES
             ========================================================================= */}
          {activeTab === 'notifications' && (
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="border-b bg-gradient-to-r from-purple-50/50 to-white pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-slate-900 text-lg">
                      <Bell className="h-5 w-5 text-purple-600" />
                      Quy Tắc Cảnh Báo & Leo Thang Tự Động (Escalation Rules)
                    </CardTitle>
                    <CardDescription className="text-slate-500 text-xs mt-1">
                      Thiết lập kịch bản gửi SMS Brandname, Telegram Bot, Zalo ZNS và Email khi phát sinh sự kiện quan trọng.
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
                    onClick={() => showToast("Đã mở trình tạo quy tắc cảnh báo leo thang mới!")}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Thêm Quy Tắc Cảnh Báo
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {notificationRules.map(rule => (
                  <div key={rule.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/60 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">{rule.name}</span>
                        <Badge variant="outline" className="text-[10px] font-mono bg-purple-50 text-purple-700 border-purple-200">
                          {rule.thresholdValue}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600">{rule.description}</p>
                      
                      {/* Channels & Recipients */}
                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        <span className="text-[11px] font-semibold text-slate-500">Kênh phát:</span>
                        {rule.channels.map(ch => (
                          <Badge key={ch} variant="secondary" className="text-[10px] uppercase font-bold px-2 py-0.5">
                            {ch}
                          </Badge>
                        ))}
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] text-slate-500">Nhận tin: {rule.recipients.join(', ')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-slate-700">{rule.active ? 'Đang Hoạt Động' : 'Đã Tạm Dừng'}</div>
                        <div className="text-[10px] text-slate-400">{rule.active ? 'Tự động kích hoạt' : 'Không gửi tin'}</div>
                      </div>
                      <button
                        onClick={() => toggleNotificationRule(rule.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          rule.active ? 'bg-purple-600' : 'bg-slate-300'
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          rule.active ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="p-4 bg-slate-50 border-t justify-end">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs"
                  onClick={() => showToast("Đã lưu các quy tắc cảnh báo leo thang thành công!")}
                >
                  <Save className="h-4 w-4 mr-1.5" /> Lưu Quy Tắc Cảnh Báo
                </Button>
              </CardFooter>
            </Card>
          )}

        </div>
      </div>

      {/* =========================================================================
          5 INTERACTIVE MODALS
         ========================================================================= */}

      {/* MODAL 1: Thêm Tài Khoản / Phân Vai Trò Mới */}
      <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-indigo-950">
              <Users className="h-5 w-5 text-indigo-600" />
              Thêm Tài Khoản & Phân Vai Trò Mới
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Cấp tài khoản đăng nhập nội bộ và gắn vai trò RBAC tương ứng.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateUser} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Họ và Tên Nhân Viên *</label>
              <Input 
                placeholder="Ví dụ: Hoàng Minh Đức" 
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Email Công Ty *</label>
                <Input 
                  type="email"
                  placeholder="duc.hoang@novacrm.vn" 
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="text-xs"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Số Điện Thoại</label>
                <Input 
                  placeholder="0912 345 678" 
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Vai Trò (Role RBAC)</label>
                <select 
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as any)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  <option value="agent">Chuyên Viên Sale</option>
                  <option value="director">Giám Đốc / Quản Lý</option>
                  <option value="f2_agency">Đại Lý F2 Partner</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1 block">Chi Nhánh Công Tác</label>
                <select 
                  value={newUserBranch}
                  onChange={(e) => setNewUserBranch(e.target.value)}
                  className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
                >
                  <option value="Hội Sở Chính - Nova Tower">Hội Sở Chính - Nova Tower</option>
                  <option value="Chi Nhánh Dự Án Phan Thiết">Chi Nhánh Phan Thiết</option>
                  <option value="Chi Nhánh Phía Bắc - Hà Nội">Chi Nhánh Hà Nội</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between text-xs text-slate-600">
              <div>
                <div className="font-semibold text-slate-800">Gửi Mật Khẩu Khởi Tạo Qua Email</div>
                <div className="text-[11px] text-slate-500">Yêu cầu đổi mật khẩu trong lần đăng nhập đầu tiên.</div>
              </div>
              <Checkbox 
                checked={newUserSendPass}
                onCheckedChange={(v) => setNewUserSendPass(!!v)}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddUserModal(false)}>
                Hủy Bỏ
              </Button>
              <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Xác Nhận Tạo Tài Khoản
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Tạo Bản Sao Lưu Database Khẩn Cấp */}
      <Dialog open={showCreateBackupModal} onOpenChange={setShowCreateBackupModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-950">
              <DatabaseBackup className="h-5 w-5 text-amber-600" />
              Tạo Bản Sao Lưu Cơ Sở Dữ Liệu Ngay (Snapshot)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Trích xuất toàn bộ dữ liệu giao dịch và khách hàng lên bộ nhớ đám mây an toàn.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Tên Bản Sao Lưu</label>
              <Input 
                value={backupNameInput}
                onChange={(e) => setBackupNameInput(e.target.value)}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Phạm Vi Dữ Liệu</label>
              <select 
                value={backupScope}
                onChange={(e) => setBackupScope(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
              >
                <option value="FULL">Toàn Bộ Cơ Sở Dữ Liệu (Full Database 18.5 GB)</option>
                <option value="CONTRACTS_ONLY">Chỉ Hợp Đồng & Giỏ Hàng Dự Án (4.2 GB)</option>
                <option value="CUSTOMERS_ONLY">Chỉ Hồ Sơ Khách Hàng & Lead (1.8 GB)</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-900">
              <div className="font-bold flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-amber-700" /> Tiêu chuẩn bảo mật Snapshot:
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                <li>Mã hóa đầu cuối AES-256 GCM</li>
                <li>Nén tệp tin định dạng gzip (.sql.gz)</li>
                <li>Lưu trữ phân tán Multi-Region AWS S3 & Cloudflare R2</li>
              </ul>
            </div>

            {isBackingUp && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Đang sao lưu và mã hóa dữ liệu...</span>
                  <span>{backupProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-amber-600 h-2.5 rounded-full transition-all duration-300" 
                    style={{ width: `${backupProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCreateBackupModal(false)} disabled={isBackingUp}>
              Hủy Bỏ
            </Button>
            <Button 
              size="sm" 
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
              onClick={handleStartBackup}
              disabled={isBackingUp}
            >
              {isBackingUp ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Đang Tiến Hành...
                </>
              ) : (
                'Bắt Đầu Sao Lưu'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Xác Nhận Khôi Phục Dữ Liệu Từ Snapshot */}
      <Dialog open={!!selectedBackupToRestore} onOpenChange={() => setSelectedBackupToRestore(null)}>
        <DialogContent className="max-w-md border-rose-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-900">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              Cảnh Báo: Khôi Phục Dữ Liệu Hệ Thống
            </DialogTitle>
            <DialogDescription className="text-xs text-rose-700">
              Hành động này sẽ ghi đè toàn bộ dữ liệu hiện tại về mốc thời gian của Snapshot đã chọn!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3 bg-slate-50 border rounded-xl space-y-1 text-xs text-slate-700">
              <div><strong>Bản snapshot:</strong> {selectedBackupToRestore?.name}</div>
              <div><strong>Dung lượng:</strong> {selectedBackupToRestore?.size}</div>
              <div><strong>Thời gian tạo:</strong> {selectedBackupToRestore?.createdAt}</div>
              <div className="font-mono text-[11px] text-slate-500">Checksum: {selectedBackupToRestore?.checksum}</div>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 leading-relaxed">
              Các giao dịch cọc hoặc thay đổi phát sinh sau thời điểm bản sao lưu này sẽ bị hoàn tác.
              Vui lòng gõ chữ <strong>CONFIRM</strong> vào ô bên dưới để xác nhận thực hiện.
            </div>

            <div>
              <Input 
                placeholder="Nhập CONFIRM để tiếp tục" 
                value={restoreConfirmText}
                onChange={(e) => setRestoreConfirmText(e.target.value)}
                className="text-xs font-mono font-bold text-center tracking-widest border-rose-300 uppercase"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setSelectedBackupToRestore(null)} disabled={isRestoring}>
              Hủy Thao Tác
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              className="font-bold bg-rose-600 hover:bg-rose-700"
              onClick={handleExecuteRestore}
              disabled={isRestoring || restoreConfirmText.trim().toUpperCase() !== 'CONFIRM'}
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Đang Phục Hồi...
                </>
              ) : (
                'Xác Nhận Khôi Phục'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Chi Tiết Sự Kiện Audit Log Nhạy Cảm */}
      <Dialog open={!!selectedAuditLogModal} onOpenChange={() => setSelectedAuditLogModal(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-900">
              <Terminal className="h-5 w-5 text-indigo-600" />
              Chi Tiết Sự Kiện An Ninh (Audit Payload)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Mã sự kiện: <strong className="font-mono">{selectedAuditLogModal?.id}</strong> • Thời gian: {selectedAuditLogModal?.time}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border">
              <div>
                <span className="text-slate-500 block">Người thực hiện:</span>
                <span className="font-bold text-slate-800">{selectedAuditLogModal?.user}</span>
                <span className="text-slate-500 block text-[11px] mt-0.5">({selectedAuditLogModal?.role})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Hành động:</span>
                <Badge variant="outline" className="font-mono font-bold mt-0.5">{selectedAuditLogModal?.action}</Badge>
              </div>
              <div>
                <span className="text-slate-500 block">Địa chỉ IP:</span>
                <span className="font-mono text-slate-800">{selectedAuditLogModal?.ip}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Trạng thái rủi ro:</span>
                <Badge className={`text-[10px] mt-0.5 ${
                  selectedAuditLogModal?.status === 'DANGER' ? 'bg-rose-600' :
                  selectedAuditLogModal?.status === 'WARNING' ? 'bg-amber-600' : 'bg-emerald-600'
                }`}>
                  {selectedAuditLogModal?.status}
                </Badge>
              </div>
            </div>

            <div>
              <span className="text-slate-600 font-semibold mb-1 block">Chi tiết sự kiện:</span>
              <p className="p-2.5 bg-slate-50 rounded-lg border text-slate-700 leading-relaxed">
                {selectedAuditLogModal?.detail}
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-600 font-semibold">Dữ liệu Payload JSON (Request Body / Diff):</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-[11px] text-indigo-600 hover:text-indigo-700 p-1"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedAuditLogModal?.payloadJson || '{}')
                    showToast("Đã sao chép Payload JSON vào Clipboard!")
                  }}
                >
                  <Copy className="h-3 w-3 mr-1" /> Sao Chép
                </Button>
              </div>
              <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl font-mono text-[11px] max-h-48 overflow-y-auto">
                {selectedAuditLogModal?.payloadJson || '{}'}
              </pre>
            </div>
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setSelectedAuditLogModal(null)}>
              Đóng Cửa Sổ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: Chế Độ Bảo Trì Hệ Thống Toàn Sàn */}
      <Dialog open={showMaintenanceModal} onOpenChange={setShowMaintenanceModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-950">
              <MonitorStop className="h-5 w-5 text-amber-600" />
              Thiết Lập Chế Độ Bảo Trì Hệ Thống (Maintenance Mode)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Kiểm soát quyền truy cập toàn sàn khi nâng cấp cơ sở dữ liệu hoặc triển khai phiên bản mới.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-amber-900 leading-relaxed">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-700" /> Lưu ý quan trọng khi bật:
              </div>
              <p className="text-[11px]">
                Tất cả chuyên viên kinh doanh (Sale) và Đại lý F2 sẽ bị tự động đăng xuất và chuyển hướng đến màn hình bảo trì. 
                Chỉ tài khoản cấp <strong>Super Admin</strong> mới có thể đăng nhập.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Thời Gian Bảo Trì Dự Kiến</label>
              <select 
                value={maintenanceTimeSelect}
                onChange={(e) => setMaintenanceTimeSelect(e.target.value)}
                className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800"
              >
                <option value="15 phút">15 phút (Hotfix cấp tốc)</option>
                <option value="30 phút">30 phút (Nâng cấp định kỳ)</option>
                <option value="1 giờ">1 giờ (Đồng bộ lại cơ sở dữ liệu lớn)</option>
                <option value="2 giờ">2 giờ (Chuyển đổi hạ tầng Cloud)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">Thông Điệp Hiển Thị Cho Khách / Nhân Viên</label>
              <textarea 
                rows={3}
                value={maintenanceCustomMsg}
                onChange={(e) => setMaintenanceCustomMsg(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-indigo-500"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowMaintenanceModal(false)}>
              Hủy
            </Button>
            <Button 
              size="sm" 
              className={securityPolicy.maintenanceMode ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold" : "bg-amber-600 hover:bg-amber-700 text-white font-bold"}
              onClick={handleToggleMaintenance}
            >
              {securityPolicy.maintenanceMode ? 'Tắt Chế Độ Bảo Trì' : 'Kích Hoạt Bảo Trì Ngay'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  )
}
