export interface Customer {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  rank: 'VVIP' | 'VIP' | 'Tiềm Năng' | 'Mới';
  revenue: number;
  assignedTo: string;
  status: 'Đang tư vấn' | 'Đã giao dịch' | 'Đang chăm sóc';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  soldUnits: number;
  status: 'Đang mở bán' | 'Sắp mở bán' | 'Đã bàn giao';
  type: 'Căn hộ cao cấp' | 'Biệt thự nghỉ dưỡng' | 'Nhà phố thương mại';
  revenue: number;
  developer?: string; // Chủ đầu tư
  thumbnail?: string; // Hình ảnh đại diện
  launchDate?: string; // Ngày mở bán
  handoverDate?: string; // Ngày bàn giao dự kiến
  targetRevenue?: number; // Doanh thu mục tiêu
  coordinates?: [number, number]; // [lat, lng]
  aiAnalysis?: {
    summary: string;
    usps: string[];
    rating: 'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL';
    confidence: number;
    paybackPeriod: string;
    capitalGain: string;
    keyDrivers: string[];
    marketAverage: number; // Triệu/m2
    macroForecast: string;
    risks: { title: string; desc: string }[];
  };
}

export interface InventoryItem {
  id: string;
  code: string; // e.g. A1-01
  projectId: string;
  type: string;
  price: number;
  area: number;
  status: 'Trống' | 'Booking' | 'Đã bán' | 'Đang khóa';
  customerId?: string; // Links to customer if booked/sold
  direction?: string; // Hướng nhà (VD: Đông Nam, Tây Bắc)
  view?: string; // Tầm nhìn (VD: View sông, View nội khu)
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  tower?: string;
  handoverStandard?: 'Thô' | 'Hoàn thiện cơ bản' | 'Full nội thất';
  balconyDirection?: string;
  discountPolicy?: string;
  holdingAgent?: string;
  bookingExpiresAt?: string;
}

export interface ContractPaymentSchedule {
  installment: number;
  milestone: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'Đã thu' | 'Đến hạn' | 'Chưa đến hạn' | 'Quá hạn';
  paidDate?: string;
  invoiceRef?: string;
}

export interface ContractAttachment {
  id: string;
  name: string;
  size: string;
  date: string;
  type: 'pdf' | 'jpg' | 'doc';
  category: 'Hợp đồng gốc' | 'CCCD' | 'UNC' | 'Biên bản bàn giao';
}

export interface Contract {
  id: string;
  code: string;
  customerId: string;
  inventoryId: string;
  projectId: string;
  value: number;
  date: string;
  status: 'Đã ký' | 'Chờ duyệt' | 'Hủy' | 'Đã thanh lý';
  type?: 'Thỏa thuận giữ chỗ' | 'Hợp đồng đặt cọc' | 'Hợp đồng mua bán';
  paymentProgress?: number; // 0 to 100
  bankSupport?: string; // Tên ngân hàng nếu có vay
  signer?: string;
  loanAmount?: number;
  loanTermYears?: number;
  interestSupportMonths?: number;
  witnessAgent?: string;
  notaryOffice?: string;
  notaryDate?: string;
  paymentSchedule?: ContractPaymentSchedule[];
  attachments?: ContractAttachment[];
}

export interface BookingTicket {
  id: string; // e.g. BK-1001
  code: string; // e.g. BK-1001
  customerId: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  projectId: string;
  projectName: string;
  unitId: string;
  unitCode: string;
  price: number;
  depositAmount: number;
  status: 'sale' | 'manager' | 'director' | 'payment' | 'done' | 'rejected';
  type: 'Giữ chỗ có hoàn lại' | 'Giữ chỗ không hoàn lại' | 'Ký HĐ Cọc';
  priority: 'normal' | 'high' | 'urgent';
  paymentMethod: 'Chuyển khoản' | 'Tiền mặt' | 'Thẻ tín dụng' | 'Ví điện tử';
  docs: string; // e.g. '3/4'
  agent: string;
  time: string;
  createdAt: string;
  expiresAt: string;
  remainingMinutes?: number;
  notes?: string;
  paymentProofUrl?: string;
  bankRef?: string;
  approvalHistory?: {
    step: string;
    actor: string;
    action: 'created' | 'approved' | 'rejected' | 'extended';
    timestamp: string;
    comment?: string;
  }[];
}

export interface AppDatabase {
  customers: Customer[];
  projects: Project[];
  inventory: InventoryItem[];
  contracts: Contract[];
  bookingTickets?: BookingTicket[];
  campaigns: Campaign[];
  articles: Article[];
  landingPages: LandingPage[];
  reviews: Review[];
  surveyCampaigns: SurveyCampaign[];
  vouchers: Voucher[];
  myVouchers: Voucher[];
  loyaltyTransactions: LoyaltyTransaction[];
  loyaltyPoints: number;
  events: EventItem[];
  checkinLogs: CheckinLog[];
  callLogs: CallLog[];
  tasks: TaskItem[];
  documentFolders: DocumentFolder[];
  documents: DocumentFile[];
  chatChannels: ChatChannel[];
  chatDMs: ChatDM[];
  chatMessages: ChatMessage[];
  workflows: WorkflowItem[];
  syncQueue: SyncTask[];
  mobileNotifications: MobileNotification[];
  biHeatmapData: HeatmapData[];
  knowledgeFiles: KnowledgeFile[];
  aiChatHistory: AIChatMessage[];
  referralLeads: ReferralLead[];
  commissionPayouts: CommissionPayout[];
  marketplaceListings: MarketplaceListing[];
  agencyPartners: AgencyPartner[];
  gamificationAgents: LeaderboardAgent[];
  gamificationQuests: GamificationQuest[];
  gamificationBadges: GamificationBadge[];
  gamificationRewards: RewardItem[];
  currentUserExp: number;
  currentUserLevel: number;
  savedMortgageSimulations: MortgageSimulation[];
  portfolioProperties: PortfolioProperty[];
  integrationApps?: IntegrationApp[];
  webhooks?: WebhookItem[];
  apiKeys?: ApiKeyItem[];
  apiAuditLogs?: ApiAuditLog[];
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'Facebook' | 'Google' | 'TikTok' | 'Zalo' | 'Email';
  status: 'Active' | 'Paused' | 'Completed';
  budget: number;
  spent: number;
  leads: number;
  clicks: number;
  startDate: string;
  endDate?: string;
  targetCPL?: number;
  routingRule?: 'round_robin' | 'top_seller' | 'by_project';
  assignedTeam?: string;
  projectId?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  status: 'published' | 'draft';
  views: number;
  seoScore: number;
  slug: string;
  excerpt: string;
  content?: string;
  author?: string;
  publishedDate?: string;
  thumbnail?: string;
  tags?: string[];
}

export interface LandingPage {
  id: string;
  name: string;
  url: string;
  visitors: number;
  leads: number;
  conversion: number;
  status: boolean;
  projectId?: string;
  createdAt?: string;
}

export interface BannerItem {
  id: number;
  name: string;
  type: 'Hero Banner' | 'Modal Popup' | 'Exit Intent' | 'Sidebar Banner';
  status: boolean;
  schedule: string;
  image: string;
  linkUrl?: string;
  clicks?: number;
  impressions?: number;
}

export interface Review {
  id: string;
  customerId: string; // Liên kết tới bảng Customer
  customerName: string;
  rating: number; // 1 - 5
  source: string;
  text: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  phone?: string;
  projectName?: string;
  channel?: 'Zalo ZNS' | 'Google Review' | 'Post-Sale Form' | 'Showroom Kiosk' | 'SMS Link' | string;
  resolutionStatus?: 'pending' | 'resolved' | 'escalated';
  resolutionNotes?: string;
  assignedStaff?: string;
  cesScore?: number; // Customer Effort Score 1-7
  npsScore?: number; // 0-10
}

export interface SurveyCampaign {
  id: string;
  name: string;
  trigger: string;
  responses: number;
  conversion: string;
  status?: 'active' | 'paused';
  channel?: string;
  targetAudience?: string;
  rewardPoints?: number;
  createdAt?: string;
  csatScore?: number;
  npsScore?: number;
  formUrl?: string;
}

export interface Voucher {
  id: string;
  title: string;
  points: number;
  iconName: string;
  color: string;
  category?: string;
  description?: string;
  expiryDate?: string;
  codePrefix?: string;
  stock?: number;
  terms?: string;
}

export interface LoyaltyTransaction {
  id: string;
  title: string;
  date: string;
  points: number;
  type: 'earn' | 'redeem';
  customerId?: string;
  customerName?: string;
  referenceCode?: string;
  status?: string;
}

export interface EventItem {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  location: string;
  registered: number;
  checkedIn: number;
  capacity: number;
  image: string;
  iconName: string;
  projectId?: string;
  description?: string;
  tablesCount?: number;
}

export interface CheckinLog {
  id: string;
  eventId: string;
  name: string;
  ticket: string;
  time: string;
  status: 'VIP' | 'Standard';
  tableNumber?: string;
  seatNumber?: string;
  phone?: string;
  assignedAgent?: string;
  giftReceived?: boolean;
}

export interface TranscriptMessage {
  speaker: 'agent' | 'customer';
  time: string;
  text: string;
}

export interface CallLog {
  id: string;
  name: string;
  phone: string;
  time: string;
  duration: string;
  status: 'success' | 'missed';
  sentiment: 'positive' | 'neutral' | 'negative' | 'none';
  scores: {
    positive: number;
    neutral: number;
    negative: number;
  };
  takeaways: string[];
  metrics: {
    agentTalkRatio: string;
    speechRate: string;
  };
  transcript: TranscriptMessage[];
  agentName?: string;
  projectName?: string;
  disposition?: 'Hẹn xem sa bàn' | 'Khách quan tâm' | 'Gọi lại sau' | 'Tư vấn vay vốn' | 'Khiếu nại tiến độ' | 'Chốt cọc thành công' | 'Không nghe máy' | 'Sai số' | string;
  qaScore?: number;
  notes?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  due: string;
  comments: number;
}

export interface DocumentFolder {
  id: string;
  name: string;
  projectId?: string;
  subFolders: string[];
}

export interface DocumentFile {
  id: string;
  folderId: string;
  type: 'pdf' | 'video' | 'vr' | '3d' | 'cad' | 'docx';
  name: string;
  size: string;
  date: string;
  tag: string;
  description?: string;
  version?: string;
  legalStatus?: 'Đã phê duyệt' | 'Hiệu lực thi hành' | 'Đang thẩm định' | 'Dự thảo nội bộ';
  downloadsCount?: number;
  signer?: string;
  downloadUrl?: string;
}

export interface ListingCardData {
  id: string;
  code: string;
  projectName: string;
  price: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  status: 'Còn trống' | 'Đang giữ chỗ' | 'Đã cọc';
  image: string;
  direction?: string;
  commission?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  unread: number;
  description?: string;
  category?: 'project' | 'department' | 'management';
  membersCount?: number;
  topic?: string;
  pinnedMsg?: string;
}

export interface ChatDM {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  type?: 'internal' | 'zalo' | 'livechat';
  phone?: string;
  email?: string;
  role?: string;
  projectName?: string;
  leadScore?: number;
  budget?: string;
  unread?: number;
  lastMessage?: string;
  lastTime?: string;
  statusBadge?: string;
}

export interface ChatMessage {
  id: string;
  threadId: string; // channel id or dm id
  senderId: string; // 'me' or other user id or 'customer' or 'system'
  senderName: string;
  senderAvatar?: string;
  text: string;
  time: string;
  isFile?: boolean;
  fileName?: string;
  fileSize?: string;
  msgType?: 'text' | 'file' | 'listing' | 'quick_reply' | 'system';
  listing?: ListingCardData;
  isRead?: boolean;
}

export interface WorkflowItem {
  id: number;
  name: string;
  type: string;
  active: boolean;
  runs: number;
}

export interface SyncTask {
  id: number;
  task: string;
  time: string;
  type?: 'signature' | 'gps' | 'kyc' | 'voice' | 'lock';
  status?: 'pending' | 'syncing' | 'synced' | 'failed';
  payload?: string;
  retryCount?: number;
  locationName?: string;
  customerName?: string;
  propertyCode?: string;
}

export interface MobileNotification {
  id: number;
  title: string;
  message: string;
  time: string;
  type?: 'urgent' | 'reward' | 'event' | 'deal' | 'system';
  targetAudience?: string;
  read?: boolean;
}

export interface IntegrationApp {
  id: string;
  name: string;
  category: 'communication' | 'finance' | 'payment' | 'legal' | 'utilities';
  iconName: string;
  desc: string;
  connected: boolean;
  lastSync?: string;
  requestCount24h?: number;
  endpoint?: string;
  apiKey?: string;
  latencyMs?: number;
  provider: string;
}

export interface WebhookItem {
  id: string;
  name: string;
  event: string;
  targetUrl: string;
  active: boolean;
  successRate: number;
  lastTriggered: string;
  deliveriesCount: number;
  secretKey?: string;
}

export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  keyMasked: string;
  permissions: 'read' | 'read_write' | 'admin';
  ipWhitelist: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'revoked' | 'expired';
}

export interface ApiAuditLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  service: string;
  ip: string;
  statusCode: number;
  latencyMs: number;
  payloadSnippet: string;
}

export interface HeatmapData {
  day: string;
  hour: string;
  value: number;
}

export interface KnowledgeFile {
  id: number;
  name: string;
  type: 'policy' | 'brochure' | 'price' | 'law' | 'faq' | 'planning' | 'other';
  status: 'learned' | 'learning' | 'error';
  size: string;
  date: string;
}

export interface AIChatMessage {
  id: number;
  role: 'user' | 'ai';
  content: string;
  citations?: string[];
  time: string;
}

export interface ReferralLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  status: 'Đang tư vấn' | 'Đã đặt cọc' | 'Đã giải ngân' | 'Hủy giao dịch';
  projectId: string;
  projectName: string;
  propertyCode?: string;
  dealValue: number;
  commissionRate: number; // e.g. 1.5
  commissionAmount: number;
  payStatus: 'Đã thanh toán' | 'Chờ giải ngân' | 'Chưa phát sinh';
  affiliateCode: string;
  assignedAgent?: string;
  notes?: string;
}

export interface CommissionPayout {
  id: string;
  amount: number;
  date: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: 'Đã chi trả' | 'Đang xử lý' | 'Chờ duyệt kế toán';
  referenceCode: string;
  note?: string;
}

export interface MarketplaceListing {
  id: string;
  title: string;
  price: string;
  priceNumeric: number;
  commSplit: string; // e.g. '50/50' | '40/60' | '60/40' | 'Chỉ nhận khách'
  f2Commission: string; // e.g. '1.5%' | '2.0%' | '0.5 Tháng'
  f2CommissionRate: number; // e.g. 1.5
  type: 'Bán' | 'Cho Thuê';
  propertyCategory: 'Căn hộ' | 'Biệt thự' | 'Shophouse' | 'Dinh thự' | 'Tòa nhà VP' | 'Nhà phố';
  location: string;
  district: string;
  ownerAgency: string;
  ownerAvatar: string;
  image: string;
  verified: boolean;
  legalStatus: 'Sổ hồng lâu dài' | 'HĐMB' | 'HĐ cọc' | 'GPXD';
  area: number; // m2
  bedrooms?: number;
  bathrooms?: number;
  handoverStandard?: string;
  distributedByMe?: boolean;
  description?: string;
  phone?: string;
}

export interface AgencyPartner {
  id: string;
  name: string;
  tier: 'F1 Master Partner' | 'F2 Affiliate Agency' | 'Global Partner' | 'Cộng Tác Viên';
  rating: number;
  deals: number;
  logo: string;
  phone: string;
  email: string;
  address: string;
  verified: boolean;
  activeListingsCount: number;
}

export interface LeaderboardAgent {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  team: string;
  revenue: number;
  revenueDisplay: string;
  dealsCount: number;
  exp: number;
  level: number;
  title: string;
  trend: 'up' | 'down' | 'same';
  streakWeeks: number;
  mvp?: boolean;
}

export interface GamificationQuest {
  id: number;
  title: string;
  desc: string;
  current: number;
  max: number;
  exp: number;
  category: 'daily' | 'weekly' | 'special';
  rewardClaimed: boolean;
  iconName: string;
}

export interface GamificationBadge {
  id: number;
  name: string;
  desc: string;
  category: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
  bonusExp: number;
  rarity: 'Phổ biến' | 'Hiếm' | 'Sử thi' | 'Huyền thoại';
}

export interface RewardItem {
  id: string;
  title: string;
  costExp: number;
  category: 'leads' | 'vacation' | 'gadget' | 'cash' | 'membership';
  image: string;
  description: string;
  quantityRemaining: number;
}

export interface MortgageSimulation {
  id: string;
  customerId?: string;
  customerName?: string;
  propertyCode?: string;
  propertyValue: number;
  loanPercent: number;
  loanAmount: number;
  loanTermYears: number;
  bankId: string;
  bankName: string;
  repaymentMethod: 'reducing' | 'linear';
  enableGracePeriod: boolean;
  graceMonths: number;
  monthlyIncome: number;
  dtiRatio: number;
  totalInterest: number;
  firstMonthlyPayment: number;
  createdAt: string;
}

export interface PortfolioMilestone {
  batch: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  accountBank: string;
  accountNumber: string;
  accountName: string;
  transferSyntax: string;
  description: string;
}

export interface PortfolioProperty {
  id: string;
  code: string;
  title: string;
  projectName: string;
  projectId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  propertyType: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  direction: string;
  view: string;
  buyPrice: number;
  currentValuation: number;
  purchaseDate: string;
  handoverDate: string;
  constructionProgress: number; // 0 - 100%
  constructionStatus: 'Đang móng cọc' | 'Đang xây thô' | 'Đã cất nóc' | 'Đã bàn giao' | 'Đã có sổ hồng';
  rentalStatus: 'Đang cho thuê' | 'Tự khai thác' | 'Đang tìm khách' | 'Chờ nhận nhà';
  monthlyRent: number;
  tenantName?: string;
  leaseEndDate?: string;
  annualNetRental: number;
  contractCode: string;
  legalStatus: string;
  image: string;
  aiRecommendation: 'Tiếp tục giữ tích sản' | 'Chốt lời tái đầu tư' | 'Tối ưu hóa giá thuê' | 'Cơ cấu danh mục';
  aiScore: number; // 0 - 100
  nextMilestone?: PortfolioMilestone;
}

export type RbacRole = 'super_admin' | 'director' | 'agent' | 'f2_agency';

export interface RbacPermissionItem {
  id: string;
  name: string;
  category: 'customers' | 'contracts' | 'inventory' | 'finance' | 'system';
  description: string;
  super_admin: boolean;
  director: boolean;
  agent: boolean;
  f2_agency: boolean;
}

export interface SystemAuditLogItem {
  id: string;
  time: string;
  user: string;
  role: string;
  ip: string;
  action: string;
  detail: string;
  status: 'SUCCESS' | 'WARNING' | 'DANGER';
  userAgent?: string;
  payloadJson?: string;
}

export interface BackupSnapshotItem {
  id: string;
  name: string;
  size: string;
  sizeBytes: number;
  createdAt: string;
  type: 'auto' | 'manual';
  checksum: string;
  status: 'completed' | 'restoring' | 'verified';
}

export interface TenantBranch {
  id: string;
  name: string;
  address: string;
  active: boolean;
  agentCount: number;
}

export interface SystemTenantConfig {
  companyName: string;
  customDomain: string;
  primaryColor: string;
  accentColor: string;
  logoUrl: string;
  brandTagline: string;
  licenseTier: string;
  watermarkContracts: boolean;
  autoLockSessionMinutes: number;
  branches: TenantBranch[];
}

export interface SecurityPolicyConfig {
  enforce2FA: boolean;
  ipWhitelistEnabled: boolean;
  ipWhitelist: string[];
  minPasswordLength: number;
  passwordExpiryDays: number;
  maxLoginAttempts: number;
  sessionTimeoutMinutes: number;
  biometricAllowed: boolean;
  preventDataExfiltration: boolean;
  maintenanceMode: boolean;
}

export interface NotificationRuleItem {
  id: string;
  name: string;
  description: string;
  condition: string;
  thresholdValue: string;
  channels: ('email' | 'sms' | 'zalo' | 'telegram')[];
  recipients: string[];
  active: boolean;
}

// Handover, Snagging & Warranty Management (Chức năng 33)
export type HandoverStatus = 'cho_hen' | 'da_dat_lich' | 'dang_nghiem_thu' | 'da_ban_giao' | 'co_loi_can_sua';
export type DefectSeverity = 'Nhe' | 'Trung Binh' | 'Khan Cap';
export type DefectStatus = 'Dang Xu Ly' | 'Cho Nghiem Thu' | 'Da Khac Phuc';
export type PinkBookStage = 'tiep_nhan_ho_so' | 'nop_so_tnmt' | 'tham_dinh_thue' | 'da_in_phoi_so' | 'da_trao_so';

export interface SnaggingDefectItem {
  id: string;
  handoverId: string;
  propertyCode: string;
  location: string;
  category: 'Xây thô & Sơn bả' | 'Sàn & Trần' | 'Cơ điện (M&E)' | 'Thiết bị vệ sinh' | 'Cửa & Khóa';
  description: string;
  severity: DefectSeverity;
  contractor: string;
  status: DefectStatus;
  reportedDate: string;
  targetResolutionDate: string;
  resolvedDate?: string;
  imageUrl?: string;
}

export interface HandoverTicket {
  id: string;
  contractId: string;
  propertyCode: string;
  projectId: string;
  projectName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  propertyType: string;
  area: number;
  scheduledDate: string;
  scheduledTime: string;
  assignedEngineer: string;
  status: HandoverStatus;
  electricMeterIndex: number;
  waterMeterIndex: number;
  keysHandedOverCount: number;
  accessCardsCount: number;
  signedDate?: string;
  signedByCustomer?: boolean;
  signedByStaff?: boolean;
  warrantyExpiryDate: string;
  pinkBookStage: PinkBookStage;
  pinkBookNumber?: string;
  defectsCount: number;
  notes?: string;
}

// Property Auction & E-Bidding Management (Chức năng 34)
export type AuctionStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderNameMasked: string;
  bidderPhoneMasked: string;
  amount: number;
  timestamp: string;
  isWinningBid?: boolean;
}

export interface AuctionPropertyItem {
  id: string;
  code: string;
  title: string;
  projectName: string;
  projectId: string;
  type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  direction: string;
  view: string;
  imageUrl: string;
  floorPrice: number;
  currentBid: number;
  reservePrice: number;
  bidStep: number;
  depositRequired: number;
  totalBids: number;
  startTime: string;
  endTime: string;
  status: AuctionStatus;
  winnerName?: string;
  winningAmount?: number;
  countdownSeconds: number;
  hostName: string;
  livestreamUrl?: string;
}

export interface EscrowDepositItem {
  id: string;
  auctionId: string;
  propertyCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  paymentMethod: 'VietQR Pro' | 'Chuyển khoản VCB' | 'Thẻ tín dụng Quốc tế';
  status: 'da_ky_quy' | 'da_hoan_coc' | 'chuyen_thanh_tien_coc';
  transactionCode: string;
  depositedAt: string;
  refundedAt?: string;
}

// Property Operations & Resident Services (Chức năng 35)
export type BillStatus = 'da_thanh_toan' | 'cho_thanh_toan' | 'qua_han';
export type FitoutStatus = 'cho_duyet' | 'dang_thi_cong' | 'cho_nghiem_thu' | 'da_hoan_thanh';
export type AmenityBookingStatus = 'da_xac_nhan' | 'da_checkin' | 'da_huy';
export type TicketPriority = 'Khan Cap' | 'Trung Binh' | 'Binh Thuong';
export type TicketStatus = 'Moi Tiep Nhan' | 'Dang Xu Ly' | 'Da Xu Ly Xong';

export interface OperationBillItem {
  id: string;
  month: string;
  propertyCode: string;
  projectName: string;
  residentName: string;
  residentPhone: string;
  managementFee: number;
  parkingFee: number;
  utilitiesFee: number;
  totalAmount: number;
  status: BillStatus;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
}

export interface FitoutPermitItem {
  id: string;
  propertyCode: string;
  residentName: string;
  contractorName: string;
  contractorPhone: string;
  workersCount: number;
  startDate: string;
  endDate: string;
  depositAmount: number;
  status: FitoutStatus;
  depositRefunded: boolean;
  notes: string;
}

export interface AmenityBookingItem {
  id: string;
  amenityType: 'Sân Pickleball VIP' | 'Khu Tiệc Nướng BBQ Ngoài Trời' | 'Hồ Bơi Chân Mây' | 'Phòng Tiệc Cigar & Lounge';
  propertyCode: string;
  residentName: string;
  residentPhone: string;
  bookingDate: string;
  timeSlot: string;
  guestsCount: number;
  fee: number;
  status: AmenityBookingStatus;
}

export interface ResidentTicketItem {
  id: string;
  propertyCode: string;
  residentName: string;
  residentPhone: string;
  category: 'Điện nước' | 'Thang máy' | 'Vệ sinh môi trường' | 'An ninh trật tự' | 'Tiếng ồn';
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedStaff: string;
  createdAt: string;
  resolvedAt?: string;
  slaMinutes: number;
}

export type ResaleListingType = 'resale' | 'rental';
export type ResaleListingStatus = 'active' | 'under_offer' | 'closed' | 'expired';
export type ShowingStatus = 'scheduled' | 'completed' | 'cancelled' | 'made_offer';
export type ResaleDealStatus = 'deposit_placed' | 'notarized' | 'completed';

export interface ResaleListingItem {
  id: string;
  listingCode: string;
  type: ResaleListingType;
  projectName: string;
  propertyCode: string;
  propertyType: 'Căn hộ cao cấp' | 'Biệt thự song lập' | 'Nhà phố thương mại' | 'Sky Villa / Penthouse';
  ownerName: string;
  ownerPhone: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  direction: string;
  askingPrice: number;
  targetNetPrice: number;
  commissionRate: number;
  commissionAmount: number;
  legalStatus: 'Sổ hồng riêng' | 'HĐMB công chứng' | 'Đang chờ cấp sổ';
  furnishedStatus: 'Full nội thất cao cấp 5★' | 'Nhà thô CĐT' | 'Nội thất cơ bản';
  keyStatus: 'Sàn giữ chìa Master' | 'Chủ giữ chìa (Hẹn trước)' | 'Smartlock Passcode';
  smartlockCode?: string;
  status: ResaleListingStatus;
  exclusiveContract: boolean;
  exclusiveEndDate?: string;
  viewCount: number;
  showingCount: number;
  matchedLeadsCount: number;
  imageUrl: string;
  createdAt: string;
}

export interface ClientDemandItem {
  id: string;
  clientName: string;
  clientPhone: string;
  demandType: ResaleListingType;
  targetProjects: string[];
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  purpose: 'Ở thực' | 'Đầu tư cho thuê' | 'Kinh doanh văn phòng';
  urgency: 'Cần gấp trong tuần 🔥' | 'Trong tháng này' | 'Tham khảo tìm hiểu';
  assignedAgent: string;
  matchingScore: number;
  suggestedListingCode?: string;
  createdAt: string;
}

export interface ShowingScheduleItem {
  id: string;
  listingId: string;
  propertyCode: string;
  projectName: string;
  clientName: string;
  clientPhone: string;
  showingDate: string;
  showingTime: string;
  assignedAgent: string;
  keyHolder: string;
  clientFeedback?: string;
  status: ShowingStatus;
}

export interface ResaleClosingDealItem {
  id: string;
  dealCode: string;
  listingId: string;
  propertyCode: string;
  projectName: string;
  sellerName: string;
  sellerPhone: string;
  buyerName: string;
  buyerPhone: string;
  dealType: ResaleListingType;
  finalPrice: number;
  depositAmount: number;
  commissionAmount: number;
  commissionAgent: number;
  commissionCompany: number;
  depositDate: string;
  notaryDate: string;
  status: ResaleDealStatus;
  notaryOffice: string;
}
