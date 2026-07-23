import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppDatabase, Customer, Project, InventoryItem, Contract, Campaign,
  Article, LandingPage, Review, SurveyCampaign, Voucher, LoyaltyTransaction,
  EventItem, CheckinLog, CallLog, TaskItem, DocumentFolder, DocumentFile,
  ChatChannel, ChatDM, ChatMessage, WorkflowItem, SyncTask, MobileNotification,
  HeatmapData, KnowledgeFile, AIChatMessage
} from '@/types';
// Dummy Initial Data
const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', code: 'KH-001', name: 'Nguyễn Văn A', phone: '0901234567', email: 'nguyenvana@email.com', rank: 'VVIP', revenue: 15000000000, assignedTo: 'Lê Hoàng Anh', status: 'Đã giao dịch', createdAt: '2023-01-15' },
  { id: 'c2', code: 'KH-002', name: 'Trần Thị B', phone: '0912345678', email: 'tranthib@email.com', rank: 'VIP', revenue: 8500000000, assignedTo: 'Nguyễn Mai', status: 'Đang tư vấn', createdAt: '2023-05-20' },
  { id: 'c3', code: 'KH-003', name: 'Lê Văn C', phone: '0987654321', email: 'levanc@email.com', rank: 'Tiềm Năng', revenue: 0, assignedTo: 'Trần Khoa', status: 'Đang chăm sóc', createdAt: '2023-11-10' }
];

const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'NovaWorld Phan Thiet', location: 'Phan Thiết, Bình Thuận', totalUnits: 10000, soldUnits: 6500, status: 'Đang mở bán', type: 'Biệt thự nghỉ dưỡng', revenue: 5000000000000, developer: 'Novaland', thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', launchDate: '2022-10-01', handoverDate: '2025-12-31', targetRevenue: 8000000000000, coordinates: [10.8711, 107.9942] },
  { id: 'p2', name: 'Aqua City', location: 'Biên Hòa, Đồng Nai', totalUnits: 15000, soldUnits: 12000, status: 'Đã bàn giao', type: 'Nhà phố thương mại', revenue: 12000000000000, developer: 'Novaland', thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', launchDate: '2020-05-15', handoverDate: '2023-12-01', targetRevenue: 15000000000000, coordinates: [10.9022, 106.8433] },
  { 
    id: 'p3', name: 'The Grand Manhattan', location: 'Quận 1, TP.HCM', totalUnits: 1000, soldUnits: 800, status: 'Sắp mở bán', type: 'Căn hộ cao cấp', revenue: 8000000000000, developer: 'Novaland', thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', launchDate: '2024-06-01', handoverDate: '2026-06-01', targetRevenue: 10000000000000, coordinates: [10.7626, 106.6952],
    aiAnalysis: {
      summary: "Dự án căn hộ hạng sang The Grand Manhattan tọa lạc tại quỹ đất vàng cuối cùng của trung tâm Quận 1 (Cô Giang - Cô Bắc). Được định vị là biểu tượng sống thượng lưu mới, dự án tích hợp khách sạn 5 sao quốc tế Avani ngay trong khuôn viên.",
      usps: ["Quỹ đất vàng Quận 1", "Khách sạn 5 sao Avani", "Tiềm năng cho thuê cao"],
      rating: "STRONG BUY",
      confidence: 92,
      paybackPeriod: "8.5 Năm",
      capitalGain: "+15 - 20% / năm",
      keyDrivers: [
        "Quỹ đất lõi trung tâm Quận 1 đã cạn kiệt, không cấp phép dự án cao tầng mới.",
        "Nhu cầu thuê căn hộ hạng sang từ các chuyên gia nước ngoài và CEO rất lớn.",
        "Tuyến Metro số 1 chuẩn bị khai thác."
      ],
      marketAverage: 180, // 180 Tr/m2
      macroForecast: "Lãi suất đang thấp, dòng tiền của tầng lớp tinh hoa có xu hướng tìm trú ẩn vào các bất động sản mang tính biểu tượng ở lõi trung tâm. Với việc quỹ đất trung tâm cạn kiệt, mặt bằng giá thứ cấp của các dự án tại khu vực này luôn giữ vững đà tăng tối thiểu 15%/năm bất chấp biến động chung.",
      risks: [
        { title: "Rủi ro dòng tiền", desc: "Ticket size lớn (từ 15 tỷ/căn), yêu cầu khách hàng phải có dòng tiền mạnh và ổn định. Không phù hợp với nhà đầu tư dùng đòn bẩy tài chính quá lớn." },
        { title: "Rủi ro pháp lý", desc: "Dự án đang trong quá trình hoàn thiện các thủ tục pháp lý cuối cùng để ký HĐMB. Tuy nhiên chủ đầu tư cam kết bảo lãnh tiến độ." }
      ]
    }
  }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  // Aqua City (p1) - Tower A
  { id: 'i1', code: 'A-01.01', projectId: 'p1', tower: 'Tòa A', floor: 1, type: 'Biệt thự biển', price: 25000000000, area: 250, status: 'Đã bán', customerId: 'c1', direction: 'Đông Nam', view: 'View Biển', bedrooms: 4, bathrooms: 4, handoverStandard: 'Full nội thất' },
  { id: 'i2', code: 'A-01.02', projectId: 'p1', tower: 'Tòa A', floor: 1, type: 'Biệt thự biển', price: 26000000000, area: 260, status: 'Trống', direction: 'Nam', view: 'View Biển', bedrooms: 4, bathrooms: 5, handoverStandard: 'Full nội thất' },
  { id: 'i2b', code: 'A-01.03', projectId: 'p1', tower: 'Tòa A', floor: 1, type: 'Biệt thự biển', price: 24000000000, area: 240, status: 'Booking', direction: 'Đông Bắc', view: 'Nội khu', bedrooms: 3, bathrooms: 4, handoverStandard: 'Full nội thất' },
  { id: 'i2c', code: 'A-02.01', projectId: 'p1', tower: 'Tòa A', floor: 2, type: 'Biệt thự biển', price: 27000000000, area: 250, status: 'Trống', direction: 'Đông Nam', view: 'View Biển', bedrooms: 4, bathrooms: 4, handoverStandard: 'Full nội thất' },
  { id: 'i2d', code: 'A-02.02', projectId: 'p1', tower: 'Tòa A', floor: 2, type: 'Biệt thự biển', price: 25500000000, area: 250, status: 'Đang khóa', direction: 'Nam', view: 'View Biển', bedrooms: 4, bathrooms: 4, handoverStandard: 'Full nội thất' },
  // Vinhomes (p2) - The Beverly
  { id: 'i3', code: 'BE1-05.01', projectId: 'p2', tower: 'The Beverly', floor: 5, type: 'Căn hộ 2PN', price: 5500000000, area: 75, status: 'Booking', customerId: 'c2', direction: 'Đông Tứ Trạch', view: 'Công viên 36ha', bedrooms: 2, bathrooms: 2, handoverStandard: 'Hoàn thiện cơ bản' },
  { id: 'i3b', code: 'BE1-05.02', projectId: 'p2', tower: 'The Beverly', floor: 5, type: 'Căn hộ 3PN', price: 8200000000, area: 105, status: 'Trống', direction: 'Tây Nam', view: 'Hồ bơi nước mặn', bedrooms: 3, bathrooms: 2, handoverStandard: 'Hoàn thiện cơ bản' },
  // Global City (p3)
  { id: 'i4', code: 'LK-10.05', projectId: 'p3', tower: 'Khu Soho', floor: 1, type: 'Nhà phố thương mại', price: 35000000000, area: 95, status: 'Trống', direction: 'Đông Nam', view: 'Trục đường chính', bedrooms: 4, bathrooms: 5, handoverStandard: 'Thô' }
];

const INITIAL_CONTRACTS: Contract[] = [
  { id: 'ct1', code: 'HD-921', customerId: 'c1', inventoryId: 'i1', projectId: 'p1', value: 25000000000, date: '2023-12-01', status: 'Đã ký', type: 'Hợp đồng mua bán', paymentProgress: 95, bankSupport: 'Vietcombank', signer: 'Trần Văn Sếp' },
  { id: 'ct2', code: 'DC-922', customerId: 'c2', inventoryId: 'i3', projectId: 'p2', value: 15000000000, date: '2024-01-15', status: 'Chờ duyệt', type: 'Hợp đồng đặt cọc', paymentProgress: 10, signer: 'Nguyễn Văn Quản' },
  { id: 'ct3', code: 'GC-923', customerId: 'c3', inventoryId: 'i4', projectId: 'p3', value: 12000000000, date: '2024-02-10', status: 'Đã ký', type: 'Thỏa thuận giữ chỗ', paymentProgress: 5, bankSupport: 'Techcombank' },
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Lead Gen - Grand Manhattan (T12)', platform: 'Facebook', status: 'Active', budget: 50000000, spent: 12500000, leads: 45, clicks: 1200, startDate: '2025-12-01' },
  { id: 'c2', name: 'Search Ads - Aqua City', platform: 'Google', status: 'Active', budget: 30000000, spent: 28000000, leads: 110, clicks: 3500, startDate: '2025-11-15' },
  { id: 'c3', name: 'Video Review - NovaWorld', platform: 'TikTok', status: 'Paused', budget: 15000000, spent: 15000000, leads: 320, clicks: 8000, startDate: '2025-10-01', endDate: '2025-10-31' },
  { id: 'c4', name: 'ZNS Chăm sóc Khách Cũ', platform: 'Zalo', status: 'Active', budget: 5000000, spent: 1200000, leads: 0, clicks: 200, startDate: '2025-12-10' },
];

const INITIAL_ARTICLES: Article[] = [
  { id: 'a1', title: 'Bảng giá Aqua City cập nhật tháng 7', slug: 'bang-gia-aqua-city-thang-7', excerpt: 'Phân tích chi tiết bảng giá dự án Aqua City Đồng Nai. Hỗ trợ vay ngân hàng 0% lãi suất.', category: 'Thị trường', status: 'published', views: 1250, seoScore: 95 },
  { id: 'a2', title: 'Lãi suất vay mua nhà giảm sâu năm 2026', slug: 'lai-suat-vay-mua-nha-giam-sau', excerpt: 'Tin vui cho nhà đầu tư khi loạt ngân hàng hạ lãi suất cho vay xuống dưới 6%.', category: 'Tài chính', status: 'published', views: 840, seoScore: 88 },
  { id: 'a3', title: 'Tiến độ thi công Vành Đai 3 - Q3/2026', slug: 'tien-do-thi-cong-vanh-dai-3', excerpt: 'Cập nhật hình ảnh thực tế tiến độ giải phóng mặt bằng đường Vành Đai 3.', category: 'Tiến độ dự án', status: 'draft', views: 0, seoScore: 45 },
];

const INITIAL_LANDING_PAGES: LandingPage[] = [
  { id: 'lp1', name: 'LP_MoBan_AquaCity_T7', url: '/aqua-city-booking', visitors: 15400, leads: 320, conversion: 2.1, status: true },
  { id: 'lp2', name: 'LP_TheGlobalCity_ThuThiem', url: '/global-city-vips', visitors: 5200, leads: 45, conversion: 0.8, status: false },
];

const INITIAL_REVIEWS: Review[] = [
  { id: 'r1', customerId: 'c1', customerName: 'Nguyễn Văn A', rating: 5, source: 'Post-Sale Form', text: 'Bạn Sale tư vấn rất nhiệt tình, thủ tục nhanh gọn. Tôi rất hài lòng.', date: '2026-07-19', sentiment: 'positive' },
  { id: 'r2', customerId: 'c2', customerName: 'Trần Thị B', rating: 4, source: 'Zalo ZNS', text: 'Dự án đẹp, nhưng đường vào sa bàn hơi khó đi.', date: '2026-07-18', sentiment: 'neutral' },
  { id: 'r3', customerId: 'c3', customerName: 'Lê Văn C', rating: 1, source: 'Google Review', text: 'Gọi Hotline 3 lần không ai bắt máy. Dịch vụ tệ!', date: '2026-07-15', sentiment: 'negative' },
];

const INITIAL_SURVEY_CAMPAIGNS: SurveyCampaign[] = [
  { id: 'sc1', name: 'Khảo sát Nóng (Sau khi xem Sa bàn)', trigger: 'Tự động gửi Zalo sau khi Check-in 1 tiếng', responses: 245, conversion: '32%' },
  { id: 'sc2', name: 'Đánh giá Sale (Sau khi Ký Cọc)', trigger: 'Gửi Email kèm HĐMB', responses: 89, conversion: '68%' },
  { id: 'sc3', name: 'Khảo sát Bàn giao nhà', trigger: 'Gửi Zalo khi trạng thái = Handover', responses: 12, conversion: '15%' },
];

const INITIAL_VOUCHERS: Voucher[] = [
  { id: 'v1', title: 'Nghỉ dưỡng 2 Đêm tại Biệt thự Biển Novaworld', points: 50000, iconName: 'Plane', color: 'bg-blue-50 border-blue-200' },
  { id: 'v2', title: 'Gói Nội Thất Cao Cấp (Trị giá 500 Triệu)', points: 150000, iconName: 'Sofa', color: 'bg-amber-50 border-amber-200' },
  { id: 'v3', title: 'Đặc Quyền Phòng Chờ Thương Gia (Sân Bay)', points: 10000, iconName: 'Coffee', color: 'bg-purple-50 border-purple-200' },
  { id: 'v4', title: 'Chiết khấu 2% Căn Hộ Dự Án Aqua City', points: 300000, iconName: 'ShieldCheck', color: 'bg-emerald-50 border-emerald-200' },
];

const INITIAL_LOYALTY_TRANSACTIONS: LoyaltyTransaction[] = [
  { id: 'lt1', title: 'Tích lũy từ Giao dịch Mua Aqua City (Mã: AQ-10294)', date: '2026-07-15', points: 150000, type: 'earn' },
  { id: 'lt2', title: 'Tích lũy từ Giao dịch Mua Novaworld (Mã: NV-33121)', date: '2025-02-02', points: 95000, type: 'earn' },
];

const INITIAL_EVENTS: EventItem[] = [
  { id: 'e1', title: 'Lễ Mở Bán Phân Khu Aqua 2', type: 'Open House', date: 'Thứ 7, 25/07/2026', time: '08:00 - 12:00', location: 'Sa bàn Novaworld', registered: 450, checkedIn: 380, capacity: 500, image: 'bg-indigo-600', iconName: 'Presentation' },
  { id: 'e2', title: 'Webinar: Tiềm năng BĐS Nghỉ dưỡng 2026', type: 'Webinar', date: 'Thứ 5, 23/07/2026', time: '19:00 - 21:00', location: 'Zoom / Livestream', registered: 1200, checkedIn: 1050, capacity: 2000, image: 'bg-blue-500', iconName: 'MonitorPlay' },
  { id: 'e3', title: 'Workshop: Phong thủy nhà ở cho Giới tinh hoa', type: 'Workshop', date: 'CN, 02/08/2026', time: '09:00 - 11:30', location: 'Khách sạn Caravelle', registered: 120, checkedIn: 110, capacity: 150, image: 'bg-emerald-600', iconName: 'Users' },
];

const INITIAL_CHECKIN_LOGS: CheckinLog[] = [
  { id: 'cl1', eventId: 'e1', name: 'Trần Đại Nghĩa', ticket: 'VIP-0992', time: 'Vừa xong', status: 'VIP' },
  { id: 'cl2', eventId: 'e1', name: 'Lê Hoàng Yến', ticket: 'STD-1102', time: '2 phút trước', status: 'Standard' },
  { id: 'cl3', eventId: 'e1', name: 'Phạm Quang Hùng', ticket: 'STD-1105', time: '5 phút trước', status: 'Standard' },
  { id: 'cl4', eventId: 'e1', name: 'Nguyễn Thị Kim', ticket: 'VIP-0911', time: '12 phút trước', status: 'VIP' },
];

const INITIAL_CALL_LOGS: CallLog[] = [
  {
    id: 'call1', name: 'Nguyễn Văn A', phone: '0909 123 456', time: '14:30 Hôm nay', duration: '12:45', status: 'success', sentiment: 'positive',
    scores: { positive: 75, neutral: 20, negative: 5 },
    takeaways: ['Khách hàng ưng ý layout 3PN góc.', 'Khách chê giá hơi cao.', 'Đã hẹn T7 xem sa bàn.'],
    metrics: { agentTalkRatio: '45%', speechRate: '120' },
    transcript: [
      { speaker: 'agent', time: '04:15', text: 'Dạ anh A ơi, phương án thanh toán 24 tháng không lãi suất là tốt nhất hiện nay ạ.' },
      { speaker: 'customer', time: '04:32', text: 'Thế giá 12.5 Tỷ là cố định rồi hả em?' },
      { speaker: 'agent', time: '04:45', text: 'Dạ chính xác ạ. T7 này anh qua xem sa bàn nhé.' },
      { speaker: 'customer', time: '05:10', text: 'Ừ nghe cũng được, T7 9h sáng nha.' }
    ]
  },
  {
    id: 'call2', name: 'Trần Thị B', phone: '0988 765 432', time: '09:15 Hôm nay', duration: '05:20', status: 'success', sentiment: 'neutral',
    scores: { positive: 20, neutral: 60, negative: 20 },
    takeaways: ['Khách quan tâm tiến độ thi công.', 'Cần gửi thêm pháp lý qua Zalo.'],
    metrics: { agentTalkRatio: '60%', speechRate: '135' },
    transcript: [
      { speaker: 'customer', time: '01:10', text: 'Dự án xây tới đâu rồi em? Pháp lý ổn không?' },
      { speaker: 'agent', time: '01:25', text: 'Dạ dự án đã cất nóc, pháp lý GPXD đầy đủ. Lát em gửi Zalo cho chị xem nhé.' },
      { speaker: 'customer', time: '01:50', text: 'Ok, để chị xem rồi tính.' }
    ]
  }
];

const INITIAL_TASKS: TaskItem[] = [
  { id: 'TSK-01', title: 'Gọi nhắc lịch hẹn chị Lan Anh', status: 'todo', priority: 'high', assignee: 'Thanh Hà', due: 'Hôm nay', comments: 2 },
  { id: 'TSK-02', title: 'Chuẩn bị tài liệu mở bán Event', status: 'in_progress', priority: 'medium', assignee: 'Tuấn Tú', due: 'Ngày mai', comments: 5 },
  { id: 'TSK-03', title: 'Gửi báo giá Căn Góc cho anh Dũng', status: 'review', priority: 'high', assignee: 'Thanh Hà', due: '15/07', comments: 1 },
  { id: 'TSK-04', title: 'Setup chạy Ads Facebook tháng 7', status: 'in_progress', priority: 'high', assignee: 'Minh Quang', due: '20/07', comments: 12 },
  { id: 'TSK-05', title: 'Review HĐMB mẫu với Phòng Pháp lý', status: 'done', priority: 'low', assignee: 'Bảo Trần', due: '10/07', comments: 0 },
];

const INITIAL_DOCUMENT_FOLDERS: DocumentFolder[] = [
  { id: 'folder1', name: 'Dự án Aqua City', projectId: 'proj1', subFolders: ['Chính sách bán hàng', 'Tài liệu pháp lý', 'Bảng giá', 'Flycam / Sa bàn'] },
  { id: 'folder2', name: 'Dự án Novaworld Phan Thiết', projectId: 'proj2', subFolders: ['Brochure', 'Tiến độ thi công'] },
  { id: 'folder3', name: 'Dự án Vinhomes Grand Park', projectId: 'proj3', subFolders: [] },
  { id: 'folder4', name: 'Cẩm Nang Đào Tạo (Sale)', subFolders: ['Kỹ năng chốt sale', 'Kịch bản Telesale'] },
];

const INITIAL_DOCUMENTS: DocumentFile[] = [
  { id: 'f1', folderId: 'folder1', type: 'pdf', name: 'Chinh_Sach_Ban_Hang_Thang7.pdf', size: '2.4 MB', date: '15/07/2026', tag: 'Chính sách' },
  { id: 'f2', folderId: 'folder1', type: 'video', name: 'TVC_AquaCity_RiverPark_4K.mp4', size: '250 MB', date: '10/07/2026', tag: 'Video' },
  { id: 'f3', folderId: 'folder1', type: 'vr', name: 'Trải Nghiệm Thực Tế Ảo (VR360) Căn Hộ Mẫu', size: 'Link Web', date: '05/07/2026', tag: 'VR' },
  { id: 'f4', folderId: 'folder1', type: '3d', name: 'Mô Hình Sa Bàn 3D Toàn Dự Án', size: 'App iOS/Android', date: '01/07/2026', tag: '3D' },
  { id: 'f5', folderId: 'folder1', type: 'pdf', name: 'Bang_Gia_Tham_Khao_V2.pdf', size: '1.1 MB', date: '18/07/2026', tag: 'Giá' },
  { id: 'f6', folderId: 'folder2', type: 'pdf', name: 'Broschure_SunHarbor.pdf', size: '15.6 MB', date: '12/07/2026', tag: 'Brochure' },
  { id: 'f7', folderId: 'folder2', type: 'video', name: 'TienDoThiCong_Thang6.mp4', size: '120 MB', date: '30/06/2026', tag: 'Video' },
  { id: 'f8', folderId: 'folder4', type: 'pdf', name: 'KichBan_XuLyTuChoi.pdf', size: '3 MB', date: '01/01/2026', tag: 'Sale' },
];

const INITIAL_CHAT_CHANNELS: ChatChannel[] = [
  { id: 'c1', name: 'dự-án-aqua-city', unread: 3 },
  { id: 'c2', name: 'team-sale-quận-1', unread: 0 },
  { id: 'c3', name: 'ban-giám-đốc', unread: 0 },
  { id: 'c4', name: 'hỗ-trợ-pháp-lý', unread: 5 },
];

const INITIAL_CHAT_DMS: ChatDM[] = [
  { id: 'u1', name: 'Thanh Hà (Marketing)', avatar: 'TH', online: true },
  { id: 'u2', name: 'Tuấn Tú (Pháp lý)', avatar: 'TT', online: true },
  { id: 'u3', name: 'Giám Đốc Hùng', avatar: 'GD', online: false },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  // Channel c1
  { id: 'm1', threadId: 'c1', senderId: 'u1', senderName: 'Thanh Hà', senderAvatar: 'TH', text: 'Sếp ơi, em vừa gửi Báo giá 3 căn Shophouse cho khách xong. Em đính kèm bản PDF ở đây sếp check nhé!', time: '09:15 AM', isFile: true, fileName: 'Bao_Gia_Shophouse.pdf', fileSize: '1.2 MB' },
  { id: 'm2', threadId: 'c1', senderId: 'me', senderName: 'Bạn', text: 'Tuyệt vời! File báo giá làm rất đẹp. Bạn chốt luôn lịch hẹn khách lên sa bàn cuối tuần này nhé. Có gì cần team hỗ trợ cứ hú lên đây.', time: '09:18 AM' },
  // DM u3 (Giám Đốc Hùng)
  { id: 'm3', threadId: 'u3', senderId: 'u3', senderName: 'Giám Đốc Hùng', senderAvatar: 'GD', text: 'Tháng này team Quận 1 cố gắng đạt target nhé. Có khó khăn gì cứ nhắn trực tiếp anh.', time: 'Hôm qua' },
];

const INITIAL_WORKFLOWS: WorkflowItem[] = [
  { id: 1, name: 'Nhắc Nợ Tự Động (Trước 3 Ngày)', type: 'payment', active: true, runs: 1245 },
  { id: 2, name: 'Chia Lead Mới Tự Động (Round-Robin)', type: 'lead', active: true, runs: 8520 },
  { id: 3, name: 'Chúc Mừng Sinh Nhật Khách Hàng', type: 'marketing', active: true, runs: 430 },
  { id: 4, name: 'Khách Bỏ Rơi 7 Ngày -> Báo Quản Lý', type: 'care', active: false, runs: 120 },
  { id: 5, name: 'Booking Thành Công -> Đẩy Sang Hợp Đồng', type: 'deal', active: true, runs: 85 },
];

const INITIAL_HEATMAP_DATA: HeatmapData[] = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => 
  ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map(hour => ({
    day, hour, 
    value: Math.floor(Math.random() * 100)
  }))
).flat();

const INITIAL_KNOWLEDGE_FILES: KnowledgeFile[] = [
  { id: 1, name: 'Chinh_Sach_Ban_Hang_Aqua_T7.pdf', type: 'policy', status: 'learned', size: '2.4 MB', date: 'Hôm nay' },
  { id: 2, name: 'Brochure_Du_An_AquaCity_2026.pdf', type: 'brochure', status: 'learned', size: '15.1 MB', date: 'Hôm qua' },
  { id: 3, name: 'Bang_Gia_Tham_Khao_PhanKhu2.xlsx', type: 'price', status: 'learned', size: '1.1 MB', date: '15/07' },
  { id: 4, name: 'Luat_Kinh_Doanh_BDS_SuaDoi.pdf', type: 'law', status: 'learning', size: '5.2 MB', date: 'Vừa tải lên' },
  { id: 5, name: 'FAQ_Cau_Hoi_Thuong_Gap_Cho_Sale.docx', type: 'faq', status: 'learned', size: '0.8 MB', date: '10/07' },
  { id: 6, name: 'Quy_Hoach_1_500_Dong_Nai.zip', type: 'planning', status: 'error', size: '120 MB', date: '05/07' },
];

const INITIAL_AI_CHAT_HISTORY: AIChatMessage[] = [
  {
    id: 1,
    role: 'user',
    content: 'Khách hàng mua căn 3PN Aqua City, nếu thanh toán nhanh 95% trong đợt này thì được chiết khấu tổng cộng bao nhiêu trợ lý ơi?',
    time: '14:30'
  },
  {
    id: 2,
    role: 'ai',
    content: 'Chào bạn, dựa trên các tài liệu hiện hành, đối với căn hộ 3 Phòng ngủ tại Aqua City khi khách hàng chọn phương thức thanh toán nhanh 95%, mức chiết khấu được áp dụng như sau:\n\n- Chiết khấu thanh toán nhanh 95%: **12%** trực tiếp vào giá bán.\n- Ưu đãi Booking sớm (Trong tháng 7): **2%**\n- Gói quà tặng nội thất (Quy đổi): Trừ **300 triệu VNĐ**.\n\n**Tổng cộng:** Khách hàng sẽ được chiết khấu **14%** tổng giá trị căn hộ và trừ thêm **300 triệu VNĐ**.',
    citations: ['Chinh_Sach_Ban_Hang_Aqua_T7.pdf', 'FAQ_Cau_Hoi_Thuong_Gap.docx'],
    time: '14:31'
  }
];

interface AppState extends AppDatabase {
  // Actions for Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'code' | 'createdAt'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  
  // Actions for Inventory
  updateInventoryStatus: (id: string, status: InventoryItem['status'], customerId?: string) => void;
  
  // Actions for Contracts
  addContract: (contract: Omit<Contract, 'id' | 'code' | 'date'>) => void;
  
  // Actions for Surveys
  addReview: (review: Omit<Review, 'id' | 'date' | 'sentiment'>) => void;
  
  // Actions for Loyalty
  redeemVoucher: (voucherId: string) => void;
  
  // Actions for Events
  addCheckin: (eventId: string, ticketCode: string) => void;
  
  // Actions for Call Center
  makeCall: (phone: string) => void;
  
  // Actions for Tasks
  addTask: (title: string, assignee: string) => void;
  updateTaskStatus: (taskId: string, status: TaskItem['status']) => void;
  
  // Actions for Chat
  sendMessage: (threadId: string, text: string) => void;
  
  // Actions for Workflows
  toggleWorkflow: (id: number) => void;
  runWorkflow: (id: number) => void;
  
  // Actions for Mobile Hub
  addSyncTask: (taskName: string) => void;
  clearSyncQueue: () => void;
  sendMobileNotification: (title: string, message: string) => void;
  
  // Actions for AI Knowledge
  addKnowledgeFile: (file: KnowledgeFile) => void;
  updateKnowledgeFileStatus: (id: number, status: KnowledgeFile['status']) => void;
  addAIChatMessage: (message: Omit<AIChatMessage, 'id'>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      customers: INITIAL_CUSTOMERS,
      projects: INITIAL_PROJECTS,
      inventory: INITIAL_INVENTORY,
      contracts: INITIAL_CONTRACTS,
      campaigns: INITIAL_CAMPAIGNS,
      articles: INITIAL_ARTICLES,
      landingPages: INITIAL_LANDING_PAGES,
      reviews: INITIAL_REVIEWS,
      surveyCampaigns: INITIAL_SURVEY_CAMPAIGNS,
      vouchers: INITIAL_VOUCHERS,
      myVouchers: [],
      loyaltyTransactions: INITIAL_LOYALTY_TRANSACTIONS,
      loyaltyPoints: 245000,
      events: INITIAL_EVENTS,
      checkinLogs: INITIAL_CHECKIN_LOGS,
      callLogs: INITIAL_CALL_LOGS,
      tasks: INITIAL_TASKS,
      documentFolders: INITIAL_DOCUMENT_FOLDERS,
      documents: INITIAL_DOCUMENTS,
      chatChannels: INITIAL_CHAT_CHANNELS,
      chatDMs: INITIAL_CHAT_DMS,
      chatMessages: INITIAL_CHAT_MESSAGES,
      workflows: INITIAL_WORKFLOWS,
      syncQueue: [],
      mobileNotifications: [],
      biHeatmapData: INITIAL_HEATMAP_DATA,
      knowledgeFiles: INITIAL_KNOWLEDGE_FILES,
      aiChatHistory: INITIAL_AI_CHAT_HISTORY,

      addKnowledgeFile: (file) => set((state) => ({ knowledgeFiles: [file, ...state.knowledgeFiles] })),
      updateKnowledgeFileStatus: (id, status) => set((state) => ({
        knowledgeFiles: state.knowledgeFiles.map(f => f.id === id ? { ...f, status } : f)
      })),
      addAIChatMessage: (msg) => set((state) => ({
        aiChatHistory: [...state.aiChatHistory, { ...msg, id: Date.now() }]
      })),

      addSyncTask: (taskName) => set((state) => {
        const newTask: SyncTask = {
          id: Date.now(),
          task: taskName,
          time: new Date().toLocaleTimeString()
        };
        return { syncQueue: [...state.syncQueue, newTask] };
      }),
      
      clearSyncQueue: () => set({ syncQueue: [] }),
      
      sendMobileNotification: (title, message) => set((state) => {
        const newNotif: MobileNotification = {
          id: Date.now(),
          title,
          message,
          time: new Date().toLocaleTimeString()
        };
        return { mobileNotifications: [...state.mobileNotifications, newNotif] };
      }),

      toggleWorkflow: (id) => set((state) => ({
        workflows: state.workflows.map(wf => wf.id === id ? { ...wf, active: !wf.active } : wf)
      })),
      
      runWorkflow: (id) => set((state) => ({
        workflows: state.workflows.map(wf => wf.id === id ? { ...wf, runs: wf.runs + 1 } : wf)
      })),

      sendMessage: (threadId, text) => set((state) => {
        const newMessage: ChatMessage = {
          id: `m_${Date.now()}`,
          threadId,
          senderId: 'me',
          senderName: 'Bạn',
          text,
          time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        return { chatMessages: [...state.chatMessages, newMessage] };
      }),

      addTask: (title, assignee) => set((state) => {
        const newTask: TaskItem = {
          id: `TSK-0${state.tasks.length + 1}`,
          title,
          status: 'todo',
          priority: 'medium',
          assignee,
          due: 'Hôm nay',
          comments: 0
        };
        return { tasks: [newTask, ...state.tasks] };
      }),

      updateTaskStatus: (taskId, status) => set((state) => {
        return {
          tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
        };
      }),

      makeCall: (phone) => set((state) => {
        // Find if it belongs to a customer
        const customer = state.customers.find(c => c.phone === phone);
        const name = customer ? customer.name : 'Khách vãng lai';
        
        // Randomly generate sentiment
        const sentiments: Array<'positive' | 'neutral' | 'negative'> = ['positive', 'neutral', 'negative'];
        const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
        
        // Generate mock scores based on sentiment
        let pos = 10, neu = 10, neg = 10;
        if (randomSentiment === 'positive') { pos = 80; neu = 15; neg = 5; }
        else if (randomSentiment === 'negative') { pos = 5; neu = 25; neg = 70; }
        else { pos = 20; neu = 70; neg = 10; }

        const newLog: CallLog = {
          id: `call_${Date.now()}`,
          name,
          phone,
          time: 'Vừa xong',
          duration: `0${Math.floor(Math.random() * 5) + 1}:${Math.floor(Math.random() * 50) + 10}`,
          status: 'success',
          sentiment: randomSentiment,
          scores: { positive: pos, neutral: neu, negative: neg },
          takeaways: [
            `Mô phỏng bóc băng tự động bởi AI.`,
            `Khách hàng có thái độ ${randomSentiment === 'positive' ? 'tốt' : randomSentiment === 'negative' ? 'không hài lòng' : 'bình thường'}.`,
            `Cần follow-up vào ngày mai.`
          ],
          metrics: { agentTalkRatio: `${Math.floor(Math.random() * 30) + 40}%`, speechRate: `${Math.floor(Math.random() * 30) + 110}` },
          transcript: [
            { speaker: 'agent', time: '00:05', text: `Dạ alo, em chào ${name ? 'anh/chị' : 'anh/chị'} ạ. Em gọi từ phòng CSKH.` },
            { speaker: 'customer', time: '00:15', text: randomSentiment === 'positive' ? 'Chào em, dự án sao rồi em?' : randomSentiment === 'negative' ? 'Chị bận lắm đừng gọi nữa nha.' : 'Có chuyện gì không em?' },
            { speaker: 'agent', time: '00:30', text: 'Dạ vâng, em xin ghi nhận thông tin ạ.' }
          ]
        };

        return { callLogs: [newLog, ...state.callLogs] };
      }),

      addCheckin: (eventId, ticketCode) => set((state) => {
        // Find the event to increment check-in count
        const eventIndex = state.events.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return state;

        const updatedEvents = [...state.events];
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          checkedIn: updatedEvents[eventIndex].checkedIn + 1
        };

        const newLog: CheckinLog = {
          id: `cl${state.checkinLogs.length + 1}`,
          eventId,
          name: ticketCode.toUpperCase().startsWith('VIP') ? 'Khách hàng VIP' : 'Khách vãng lai',
          ticket: ticketCode.toUpperCase(),
          time: 'Vừa xong',
          status: ticketCode.toUpperCase().startsWith('VIP') ? 'VIP' : 'Standard'
        };

        // If ticket matches a customer name, we could theoretically map it, but we'll use a generic fallback for simplicity
        if (!ticketCode.includes('-')) {
            newLog.name = ticketCode; // If user typed a name directly instead of ticket
            newLog.ticket = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
            newLog.status = 'Standard';
        }

        return {
          events: updatedEvents,
          checkinLogs: [newLog, ...state.checkinLogs]
        };
      }),

      redeemVoucher: (voucherId) => set((state) => {
        const voucher = state.vouchers.find(v => v.id === voucherId);
        if (!voucher || state.loyaltyPoints < voucher.points) return state;

        const newTransaction: LoyaltyTransaction = {
          id: `lt${state.loyaltyTransactions.length + 1}`,
          title: `Đổi Quà: ${voucher.title}`,
          date: new Date().toISOString().split('T')[0],
          points: voucher.points,
          type: 'redeem'
        };

        return {
          loyaltyPoints: state.loyaltyPoints - voucher.points,
          myVouchers: [voucher, ...state.myVouchers],
          loyaltyTransactions: [newTransaction, ...state.loyaltyTransactions]
        };
      }),

      addReview: (data) => set((state) => {
        const newId = `r${state.reviews.length + 1}`;
        const date = new Date().toISOString().split('T')[0];
        
        let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
        if (data.rating >= 4) sentiment = 'positive';
        else if (data.rating <= 2) sentiment = 'negative';

        const newReview: Review = { ...data, id: newId, date, sentiment };
        return { reviews: [newReview, ...state.reviews] };
      }),

      addCustomer: (data) => set((state) => {
        const newId = `c${state.customers.length + 1}`;
        const newCode = `KH-${String(state.customers.length + 1).padStart(3, '0')}`;
        const newCustomer: Customer = {
          ...data,
          id: newId,
          code: newCode,
          createdAt: new Date().toISOString().split('T')[0]
        };
        return { customers: [newCustomer, ...state.customers] };
      }),

      updateCustomer: (id, data) => set((state) => ({
        customers: state.customers.map(c => c.id === id ? { ...c, ...data } : c)
      })),

      updateInventoryStatus: (id, status, customerId) => set((state) => ({
        inventory: state.inventory.map(i => i.id === id ? { ...i, status, customerId } : i)
      })),

      addContract: (data) => set((state) => {
        const newId = `ct${state.contracts.length + 1}`;
        const newCode = `HD-${String(state.contracts.length + 922).padStart(3, '0')}`;
        const newContract: Contract = {
          ...data,
          id: newId,
          code: newCode,
          date: new Date().toISOString().split('T')[0]
        };
        
        // Also update inventory status automatically
        const updatedInventory = state.inventory.map(i => 
          i.id === data.inventoryId ? { ...i, status: 'Đã bán' as const, customerId: data.customerId } : i
        );

        return { 
          contracts: [newContract, ...state.contracts],
          inventory: updatedInventory
        };
      })
    }),
    {
      name: 'novacrm-storage', // name of item in local storage
    }
  )
);
