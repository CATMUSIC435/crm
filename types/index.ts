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
}

export interface AppDatabase {
  customers: Customer[];
  projects: Project[];
  inventory: InventoryItem[];
  contracts: Contract[];
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
}

export interface LandingPage {
  id: string;
  name: string;
  url: string;
  visitors: number;
  leads: number;
  conversion: number;
  status: boolean;
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
}

export interface SurveyCampaign {
  id: string;
  name: string;
  trigger: string;
  responses: number;
  conversion: string;
}

export interface Voucher {
  id: string;
  title: string;
  points: number;
  iconName: string;
  color: string;
}

export interface LoyaltyTransaction {
  id: string;
  title: string;
  date: string;
  points: number;
  type: 'earn' | 'redeem';
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
}

export interface CheckinLog {
  id: string;
  eventId: string;
  name: string;
  ticket: string;
  time: string;
  status: 'VIP' | 'Standard';
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
  type: 'pdf' | 'video' | 'vr' | '3d';
  name: string;
  size: string;
  date: string;
  tag: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  unread: number;
}

export interface ChatDM {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

export interface ChatMessage {
  id: string;
  threadId: string; // channel id or dm id
  senderId: string; // 'me' or other user id
  senderName: string;
  senderAvatar?: string;
  text: string;
  time: string;
  isFile?: boolean;
  fileName?: string;
  fileSize?: string;
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
}

export interface MobileNotification {
  id: number;
  title: string;
  message: string;
  time: string;
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
