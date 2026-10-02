import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppDatabase, Customer, Project, InventoryItem, Contract, BookingTicket, Campaign,
  Article, LandingPage, Review, SurveyCampaign, Voucher, LoyaltyTransaction,
  EventItem, CheckinLog, CallLog, TaskItem, DocumentFolder, DocumentFile,
  ChatChannel, ChatDM, ChatMessage, ListingCardData, WorkflowItem, SyncTask, MobileNotification,
  HeatmapData, KnowledgeFile, AIChatMessage,
  ReferralLead, CommissionPayout,
  MarketplaceListing, AgencyPartner,
  LeaderboardAgent, GamificationQuest, GamificationBadge, RewardItem,
  MortgageSimulation,
  PortfolioProperty, PortfolioMilestone,
  IntegrationApp, WebhookItem, ApiKeyItem, ApiAuditLog
} from '@/types';
// Dummy Initial Data
const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'c1', code: 'KH-001', name: 'Nguyễn Văn Tuấn', phone: '0901234567', email: 'tuan.nguyen@investor.vn', rank: 'VVIP', revenue: 25000000000, assignedTo: 'Lê Hoàng Anh', status: 'Đã giao dịch', createdAt: '2023-01-15' },
  { id: 'c2', code: 'KH-002', name: 'Trần Thị Bích Ngọc', phone: '0912345678', email: 'bichngoc.tran@vietcapital.vn', rank: 'VIP', revenue: 15000000000, assignedTo: 'Nguyễn Mai', status: 'Đang tư vấn', createdAt: '2023-05-20' },
  { id: 'c3', code: 'KH-003', name: 'Lê Hoàng Cường', phone: '0987654321', email: 'cuong.le@techvina.com', rank: 'Tiềm Năng', revenue: 0, assignedTo: 'Trần Khoa', status: 'Đang chăm sóc', createdAt: '2023-11-10' },
  { id: 'c4', code: 'KH-004', name: 'Phạm Minh Tuấn', phone: '0912987654', email: 'minhtuan.pham@saigonres.com', rank: 'VVIP', revenue: 35000000000, assignedTo: 'Thanh Hà', status: 'Đã giao dịch', createdAt: '2023-08-14' },
  { id: 'c5', code: 'KH-005', name: 'Hoàng Thị Thảo', phone: '0945678123', email: 'thaonhi.hoang@gmail.com', rank: 'VIP', revenue: 8200000000, assignedTo: 'Tuấn Tú', status: 'Đang tư vấn', createdAt: '2024-01-22' },
  { id: 'c6', code: 'KH-006', name: 'Đặng Quốc Huy', phone: '0977889900', email: 'huy.dang@greenland.vn', rank: 'Tiềm Năng', revenue: 0, assignedTo: 'Minh Anh', status: 'Đang chăm sóc', createdAt: '2024-03-05' },
  { id: 'c7', code: 'KH-007', name: 'Vũ Thu Trang', phone: '0966554433', email: 'trang.vu@fashionvn.com', rank: 'VIP', revenue: 12000000000, assignedTo: 'Lê Hoàng Anh', status: 'Đã giao dịch', createdAt: '2024-04-18' },
  { id: 'c8', code: 'KH-008', name: 'Ngô Đức Thắng', phone: '0933221144', email: 'thang.ngo@logistics24.vn', rank: 'Mới', revenue: 0, assignedTo: 'Thanh Hà', status: 'Đang tư vấn', createdAt: '2024-06-30' }
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
  },
  { id: 'p4', name: 'Vinhomes Grand Park', location: 'TP. Thủ Đức, TP.HCM', totalUnits: 44000, soldUnits: 41000, status: 'Đang mở bán', type: 'Căn hộ cao cấp', revenue: 35000000000000, developer: 'Vingroup', thumbnail: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', launchDate: '2019-07-01', handoverDate: '2024-12-31', targetRevenue: 40000000000000, coordinates: [10.8444, 106.8375] },
  { id: 'p5', name: 'The Global City', location: 'An Phú, TP. Thủ Đức', totalUnits: 1800, soldUnits: 1400, status: 'Đang mở bán', type: 'Nhà phố thương mại', revenue: 22000000000000, developer: 'Masterise Homes', thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', launchDate: '2022-03-15', handoverDate: '2025-06-30', targetRevenue: 25000000000000, coordinates: [10.7938, 106.7656] }
];

const INITIAL_INVENTORY: InventoryItem[] = [
  // NovaWorld Phan Thiet (p1)
  { 
    id: 'i1', code: 'NVW-01.01', projectId: 'p1', tower: 'Khu Florida', floor: 1, 
    type: 'Biệt thự biển đơn lập', price: 25000000000, area: 250, status: 'Đã bán', 
    customerId: 'c1', direction: 'Đông Nam', view: 'Trực diện Biển', bedrooms: 4, bathrooms: 4, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Đông Nam', discountPolicy: 'Đã áp dụng Voucher VVIP 500Tr' 
  },
  { 
    id: 'i2', code: 'NVW-01.02', projectId: 'p1', tower: 'Khu Florida', floor: 1, 
    type: 'Biệt thự biển song lập', price: 18500000000, area: 200, status: 'Trống', 
    direction: 'Nam', view: 'View Biển & Hồ bơi', bedrooms: 3, bathrooms: 3, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Nam', discountPolicy: 'Chiết khấu 3% thanh toán sớm + Tặng 2 năm phí quản lý' 
  },
  { 
    id: 'i3', code: 'NVW-02.01', projectId: 'p1', tower: 'Khu Florida', floor: 2, 
    type: 'Shophouse biển', price: 16000000000, area: 120, status: 'Booking', 
    customerId: 'c5', direction: 'Đông Bắc', view: 'Mặt tiền Đại Lộ', bedrooms: 3, bathrooms: 4, 
    handoverStandard: 'Hoàn thiện cơ bản', balconyDirection: 'Đông Bắc', holdingAgent: 'Trần Thị Ánh', bookingExpiresAt: 'Hôm nay, 18:00' 
  },
  { 
    id: 'i4', code: 'NVW-02.02', projectId: 'p1', tower: 'Khu Florida', floor: 2, 
    type: 'Biệt thự đồi Golf', price: 28000000000, area: 300, status: 'Đang khóa', 
    direction: 'Tây Nam', view: 'Sân Golf PGA', bedrooms: 5, bathrooms: 5, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Tây Nam', discountPolicy: 'Đang khóa nội bộ chờ sự kiện mở bán VIP' 
  },
  { 
    id: 'i14', code: 'NVW-03.01', projectId: 'p1', tower: 'Khu Florida', floor: 3, 
    type: 'Shophouse biển', price: 14800000000, area: 110, status: 'Trống', 
    direction: 'Đông', view: 'Quảng trường Ánh Sáng', bedrooms: 3, bathrooms: 3, 
    handoverStandard: 'Hoàn thiện cơ bản', balconyDirection: 'Đông', discountPolicy: 'Hỗ trợ gói hoàn thiện kinh doanh 200 Triệu' 
  },
  { 
    id: 'i15', code: 'NVW-03.02', projectId: 'p1', tower: 'Khu Florida', floor: 3, 
    type: 'Biệt thự biển song lập', price: 21000000000, area: 220, status: 'Trống', 
    direction: 'Đông Nam', view: 'Công viên nước Bikini Beach', bedrooms: 4, bathrooms: 4, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Đông Nam', discountPolicy: 'Tặng thẻ thành viên Golf PGA 35 năm' 
  },

  // Aqua City (p2)
  { 
    id: 'i5', code: 'AQC-12A.01', projectId: 'p2', tower: 'The Suite', floor: 1, 
    type: 'Nhà phố đảo Phượng Hoàng', price: 12500000000, area: 160, status: 'Đã bán', 
    customerId: 'c7', direction: 'Đông Nam', view: 'Sông Đồng Nai', bedrooms: 4, bathrooms: 4, 
    handoverStandard: 'Hoàn thiện cơ bản', balconyDirection: 'Đông Nam' 
  },
  { 
    id: 'i6', code: 'AQC-12A.02', projectId: 'p2', tower: 'The Suite', floor: 1, 
    type: 'Biệt thự ven sông', price: 24000000000, area: 240, status: 'Trống', 
    direction: 'Nam', view: 'Công viên bờ sông', bedrooms: 4, bathrooms: 5, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Nam', discountPolicy: 'Chiết khấu 5% đợt 1 + Gói nội thất 300Tr' 
  },
  { 
    id: 'i16', code: 'AQC-12A.03', projectId: 'p2', tower: 'The Suite', floor: 1, 
    type: 'Nhà phố thương mại', price: 13800000000, area: 120, status: 'Trống', 
    direction: 'Bắc', view: 'Đại lộ xuyên tâm 30m', bedrooms: 3, bathrooms: 4, 
    handoverStandard: 'Thô', balconyDirection: 'Bắc', discountPolicy: 'Cam kết thuê lại 35 Triệu/tháng trong 2 năm' 
  },
  { 
    id: 'i7', code: 'AQC-15C.03', projectId: 'p2', tower: 'River Park', floor: 2, 
    type: 'Shophouse thương mại', price: 15000000000, area: 110, status: 'Booking', 
    customerId: 'c2', direction: 'Bắc', view: 'Đại lộ 45m', bedrooms: 3, bathrooms: 4, 
    handoverStandard: 'Thô', balconyDirection: 'Bắc', holdingAgent: 'Lê Hoàng Anh', bookingExpiresAt: 'Ngày mai, 12:00' 
  },
  { 
    id: 'i17', code: 'AQC-15C.04', projectId: 'p2', tower: 'River Park', floor: 2, 
    type: 'Biệt thự song lập', price: 19500000000, area: 200, status: 'Trống', 
    direction: 'Đông Nam', view: 'Bến du thuyền Aqua Marina', bedrooms: 4, bathrooms: 4, 
    handoverStandard: 'Hoàn thiện cơ bản', balconyDirection: 'Đông Nam', discountPolicy: 'Thanh toán 30% nhận nhà ngay' 
  },
  { 
    id: 'i18', code: 'AQC-18B.01', projectId: 'p2', tower: 'The Sun Harbor', floor: 3, 
    type: 'Dinh thự ven sông', price: 42000000000, area: 350, status: 'Đang khóa', 
    direction: 'Đông Nam', view: 'Trực diện Bến du thuyền 5 sao', bedrooms: 5, bathrooms: 6, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Đông Nam', discountPolicy: 'Giữ căn riêng cho cổ đông chiến lược' 
  },

  // The Grand Manhattan (p3)
  { 
    id: 'i8', code: 'TGM-28.01', projectId: 'p3', tower: 'Tháp Manhattan', floor: 28, 
    type: 'Căn hộ Sky Villa', price: 32000000000, area: 145, status: 'Đã bán', 
    customerId: 'c4', direction: 'Đông Nam', view: 'Toàn cảnh Sông Sài Gòn & Bến Nhà Rồng', bedrooms: 3, bathrooms: 3, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Đông Nam' 
  },
  { 
    id: 'i9', code: 'TGM-15.06', projectId: 'p3', tower: 'Tháp Manhattan', floor: 15, 
    type: 'Căn hộ 2PN Hạng Sang', price: 14500000000, area: 78, status: 'Trống', 
    direction: 'Tây Bắc', view: 'Trung tâm Quận 1 & Bitexco', bedrooms: 2, bathrooms: 2, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Tây Bắc', discountPolicy: 'Tặng gói Smart Home 150Tr + Chỗ đậu xe định danh' 
  },
  { 
    id: 'i19', code: 'TGM-15.07', projectId: 'p3', tower: 'Tháp Manhattan', floor: 15, 
    type: 'Căn hộ 3PN Góc', price: 21000000000, area: 112, status: 'Trống', 
    direction: 'Đông Bắc', view: 'Công viên 23/9 & Chợ Bến Thành', bedrooms: 3, bathrooms: 3, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Đông Bắc', discountPolicy: 'Chiết khấu 8% thanh toán sớm 70%' 
  },
  { 
    id: 'i20', code: 'TGM-08.02', projectId: 'p3', tower: 'Tháp Manhattan', floor: 8, 
    type: 'Căn hộ 1PN Suite', price: 9800000000, area: 52, status: 'Booking', 
    customerId: 'c6', direction: 'Tây Nam', view: 'Hồ bơi vô cực tầng 7', bedrooms: 1, bathrooms: 1, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Tây Nam', holdingAgent: 'Phạm Thu Hà', bookingExpiresAt: 'Hôm nay, 17:30' 
  },
  { 
    id: 'i21', code: 'TGM-08.03', projectId: 'p3', tower: 'Tháp Manhattan', floor: 8, 
    type: 'Căn hộ 2PN Executive', price: 15200000000, area: 80, status: 'Trống', 
    direction: 'Đông', view: 'Phố đi bộ Nguyễn Huệ & Sông Sài Gòn', bedrooms: 2, bathrooms: 2, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Đông', discountPolicy: 'Hỗ trợ lãi suất 0% trong 18 tháng' 
  },

  // Vinhomes Grand Park (p4)
  { 
    id: 'i10', code: 'BE1-05.01', projectId: 'p4', tower: 'The Beverly', floor: 5, 
    type: 'Căn hộ Luxury 2PN', price: 5500000000, area: 75, status: 'Đã bán', 
    customerId: 'c2', direction: 'Đông Tứ Trạch', view: 'Công viên ánh sáng 36ha', bedrooms: 2, bathrooms: 2, 
    handoverStandard: 'Hoàn thiện cơ bản', balconyDirection: 'Đông' 
  },
  { 
    id: 'i11', code: 'BE1-05.02', projectId: 'p4', tower: 'The Beverly', floor: 5, 
    type: 'Căn hộ 3PN Góc', price: 8200000000, area: 105, status: 'Trống', 
    direction: 'Tây Nam', view: 'Hồ bơi nước mặn Marina', bedrooms: 3, bathrooms: 2, 
    handoverStandard: 'Hoàn thiện cơ bản', balconyDirection: 'Tây Nam', discountPolicy: 'Ân hạn nợ gốc và 0% lãi suất 24 tháng' 
  },
  { 
    id: 'i22', code: 'BE1-12.08', projectId: 'p4', tower: 'The Beverly', floor: 12, 
    type: 'Căn hộ 2PN Plus', price: 6100000000, area: 82, status: 'Trống', 
    direction: 'Đông Nam', view: 'Sông Tắc & VinWonders', bedrooms: 2, bathrooms: 2, 
    handoverStandard: 'Hoàn thiện cơ bản', balconyDirection: 'Đông Nam', discountPolicy: 'Tặng voucher xe điện VinFast 150 Triệu' 
  },
  { 
    id: 'i23', code: 'BE1-12.09', projectId: 'p4', tower: 'The Beverly', floor: 12, 
    type: 'Căn hộ Studio Luxury', price: 2800000000, area: 36, status: 'Booking', 
    customerId: 'c3', direction: 'Bắc', view: 'Nội khu phong cách Beverly Hills', bedrooms: 1, bathrooms: 1, 
    handoverStandard: 'Full nội thất', balconyDirection: 'Bắc', holdingAgent: 'Nguyễn Tuấn Tú', bookingExpiresAt: 'Ngày mai, 10:00' 
  },

  // The Global City (p5)
  { 
    id: 'i12', code: 'TGC-SH05', projectId: 'p5', tower: 'Khu Soho', floor: 1, 
    type: 'Nhà phố Soho thương mại', price: 35000000000, area: 95, status: 'Đã bán', 
    customerId: 'c4', direction: 'Đông Nam', view: 'Kênh đào Nhạc nước', bedrooms: 4, bathrooms: 5, 
    handoverStandard: 'Thô', balconyDirection: 'Đông Nam' 
  },
  { 
    id: 'i13', code: 'TGC-SH06', projectId: 'p5', tower: 'Khu Soho', floor: 1, 
    type: 'Nhà phố Soho thương mại', price: 36000000000, area: 95, status: 'Booking', 
    customerId: 'c1', direction: 'Đông Nam', view: 'Kênh đào Nhạc nước', bedrooms: 4, bathrooms: 5, 
    handoverStandard: 'Thô', balconyDirection: 'Đông Nam', holdingAgent: 'Lê Hoàng Anh', bookingExpiresAt: 'Hôm nay, 20:00' 
  },
  { 
    id: 'i24', code: 'TGC-SH07', projectId: 'p5', tower: 'Khu Soho', floor: 2, 
    type: 'Nhà phố Soho thương mại', price: 37500000000, area: 100, status: 'Trống', 
    direction: 'Đông Bắc', view: 'Đại lộ Festivity & TTTM 123.000m2', bedrooms: 4, bathrooms: 5, 
    handoverStandard: 'Thô', balconyDirection: 'Đông Bắc', discountPolicy: 'Chiết khấu 10% thanh toán sớm 95% + Gói tư vấn Foster+Partners' 
  }
];

const INITIAL_CONTRACTS: Contract[] = [
  { 
    id: 'ct1', code: 'HD-921', customerId: 'c1', inventoryId: 'i1', projectId: 'p1', 
    value: 25000000000, date: '2023-12-01', status: 'Đã ký', type: 'Hợp đồng mua bán', 
    paymentProgress: 95, bankSupport: 'Vietcombank', signer: 'Trần Văn Sếp (Tổng Giám Đốc)',
    loanAmount: 15000000000, loanTermYears: 20, interestSupportMonths: 24, witnessAgent: 'Lê Hoàng Anh',
    notaryOffice: 'Văn phòng Công chứng Sài Gòn', notaryDate: '2023-12-05',
    paymentSchedule: [
      { installment: 1, milestone: 'Ký Thỏa thuận đặt cọc', percentage: 10, amount: 2500000000, dueDate: '2023-12-01', status: 'Đã thu', paidDate: '2023-12-01', invoiceRef: 'INV-VCB-001' },
      { installment: 2, milestone: 'Ký HĐMB - Hoàn thành phần móng', percentage: 15, amount: 3750000000, dueDate: '2024-02-15', status: 'Đã thu', paidDate: '2024-02-14', invoiceRef: 'INV-VCB-042' },
      { installment: 3, milestone: 'Đổ sàn tầng 2 khu biệt thự', percentage: 20, amount: 5000000000, dueDate: '2024-05-20', status: 'Đã thu', paidDate: '2024-05-18', invoiceRef: 'INV-VCB-119' },
      { installment: 4, milestone: 'Cất nóc & hoàn thiện thô', percentage: 25, amount: 6250000000, dueDate: '2024-09-30', status: 'Đã thu', paidDate: '2024-09-28', invoiceRef: 'INV-VCB-205' },
      { installment: 5, milestone: 'Bàn giao chìa khóa & nội thất', percentage: 25, amount: 6250000000, dueDate: '2025-01-15', status: 'Đã thu', paidDate: '2025-01-12', invoiceRef: 'INV-VCB-310' },
      { installment: 6, milestone: 'Bàn giao Giấy chứng nhận quyền sở hữu (Sổ hồng)', percentage: 5, amount: 1250000000, dueDate: '2025-08-30', status: 'Chưa đến hạn' }
    ],
    attachments: [
      { id: 'att1', name: 'BanScan_HDMB_NVW0101_Full.pdf', size: '4.8 MB', date: '2023-12-02', type: 'pdf', category: 'Hợp đồng gốc' },
      { id: 'att2', name: 'CCCD_NguyenVanTuan_2Mat.pdf', size: '1.2 MB', date: '2023-11-28', type: 'pdf', category: 'CCCD' },
      { id: 'att3', name: 'CamKetBaoLanh_Vietcombank.pdf', size: '2.1 MB', date: '2023-12-05', type: 'pdf', category: 'UNC' },
      { id: 'att4', name: 'BienBanNghiemThu_BanGiaoThucTe.pdf', size: '3.5 MB', date: '2025-01-15', type: 'pdf', category: 'Biên bản bàn giao' }
    ]
  },
  { 
    id: 'ct2', code: 'DC-922', customerId: 'c2', inventoryId: 'i10', projectId: 'p4', 
    value: 5500000000, date: '2024-01-15', status: 'Chờ duyệt', type: 'Hợp đồng đặt cọc', 
    paymentProgress: 15, bankSupport: 'Techcombank', signer: 'Nguyễn Văn Quản (Phó Giám Đốc)',
    loanAmount: 3850000000, loanTermYears: 25, interestSupportMonths: 18, witnessAgent: 'Tuấn Tú',
    notaryOffice: 'Văn phòng Công chứng Thủ Đức',
    paymentSchedule: [
      { installment: 1, milestone: 'Đặt cọc thiện chí giữ chỗ', percentage: 2, amount: 100000000, dueDate: '2024-01-10', status: 'Đã thu', paidDate: '2024-01-10', invoiceRef: 'INV-TCB-008' },
      { installment: 2, milestone: 'Ký Hợp đồng đặt cọc (Đủ 15%)', percentage: 13, amount: 725000000, dueDate: '2024-01-20', status: 'Đã thu', paidDate: '2024-01-18', invoiceRef: 'INV-TCB-021' },
      { installment: 3, milestone: 'Ký HĐMB chính thức', percentage: 15, amount: 825000000, dueDate: '2024-04-15', status: 'Đến hạn' },
      { installment: 4, milestone: 'Ngân hàng Techcombank giải ngân gói vay', percentage: 65, amount: 3575000000, dueDate: '2024-08-30', status: 'Chưa đến hạn' },
      { installment: 5, milestone: 'Nhận bàn giao sổ hồng', percentage: 5, amount: 275000000, dueDate: '2025-06-30', status: 'Chưa đến hạn' }
    ],
    attachments: [
      { id: 'att5', name: 'HopDongDatCoc_BE1_0501.pdf', size: '3.2 MB', date: '2024-01-15', type: 'pdf', category: 'Hợp đồng gốc' },
      { id: 'att6', name: 'CCCD_TranThiBichNgoc.jpg', size: '950 KB', date: '2024-01-12', type: 'jpg', category: 'CCCD' },
      { id: 'att7', name: 'PhieuThu_TienCoc_100Tr.pdf', size: '780 KB', date: '2024-01-10', type: 'pdf', category: 'UNC' }
    ]
  },
  { 
    id: 'ct3', code: 'GC-923', customerId: 'c5', inventoryId: 'i3', projectId: 'p1', 
    value: 16000000000, date: '2024-02-10', status: 'Đã ký', type: 'Thỏa thuận giữ chỗ', 
    paymentProgress: 10, bankSupport: 'Techcombank', signer: 'Trần Văn Sếp',
    loanAmount: 11200000000, loanTermYears: 20, interestSupportMonths: 24, witnessAgent: 'Tuấn Tú',
    paymentSchedule: [
      { installment: 1, milestone: 'Thỏa thuận giữ chỗ Shophouse biển', percentage: 10, amount: 1600000000, dueDate: '2024-02-10', status: 'Đã thu', paidDate: '2024-02-10', invoiceRef: 'INV-TCB-088' },
      { installment: 2, milestone: 'Ký Hợp đồng mua bán chính thức', percentage: 15, amount: 2400000000, dueDate: '2024-04-10', status: 'Đến hạn' },
      { installment: 3, milestone: 'Xong kết cấu sàn tầng 1', percentage: 15, amount: 2400000000, dueDate: '2024-07-30', status: 'Chưa đến hạn' },
      { installment: 4, milestone: 'Cất nóc phân khu Shophouse', percentage: 30, amount: 4800000000, dueDate: '2024-11-30', status: 'Chưa đến hạn' },
      { installment: 5, milestone: 'Bàn giao kinh doanh thương mại', percentage: 25, amount: 4000000000, dueDate: '2025-04-30', status: 'Chưa đến hạn' },
      { installment: 6, milestone: 'Bàn giao Giấy chứng nhận quyền sở hữu', percentage: 5, amount: 800000000, dueDate: '2025-10-30', status: 'Chưa đến hạn' }
    ],
    attachments: [
      { id: 'att8', name: 'ThoaThuanGiuCho_NVW_0201.pdf', size: '2.9 MB', date: '2024-02-10', type: 'pdf', category: 'Hợp đồng gốc' },
      { id: 'att9', name: 'PhieuThu_DatCoc_GiuCho.pdf', size: '620 KB', date: '2024-02-10', type: 'pdf', category: 'UNC' }
    ]
  },
  { 
    id: 'ct4', code: 'HD-924', customerId: 'c4', inventoryId: 'i8', projectId: 'p3', 
    value: 32000000000, date: '2024-03-20', status: 'Đã ký', type: 'Hợp đồng mua bán', 
    paymentProgress: 80, bankSupport: 'MB Bank', signer: 'Trần Văn Sếp',
    loanAmount: 20000000000, loanTermYears: 15, interestSupportMonths: 24, witnessAgent: 'Thanh Hà',
    notaryOffice: 'Văn phòng Công chứng Bến Thành', notaryDate: '2024-03-25',
    paymentSchedule: [
      { installment: 1, milestone: 'Ký HĐMB căn hộ hạng sang Grand Manhattan', percentage: 20, amount: 6400000000, dueDate: '2024-03-20', status: 'Đã thu', paidDate: '2024-03-20', invoiceRef: 'INV-MBB-101' },
      { installment: 2, milestone: 'Hoàn thành thi công phần ngầm', percentage: 15, amount: 4800000000, dueDate: '2024-06-15', status: 'Đã thu', paidDate: '2024-06-12', invoiceRef: 'INV-MBB-215' },
      { installment: 3, milestone: 'Cất nóc tháp căn hộ', percentage: 25, amount: 8000000000, dueDate: '2024-09-30', status: 'Đã thu', paidDate: '2024-09-25', invoiceRef: 'INV-MBB-340' },
      { installment: 4, milestone: 'Hoàn thiện mặt ngoài kính Low-E', percentage: 20, amount: 6400000000, dueDate: '2024-12-30', status: 'Đã thu', paidDate: '2024-12-28', invoiceRef: 'INV-MBB-450' },
      { installment: 5, milestone: 'Thông báo nhận bàn giao căn hộ VIP', percentage: 15, amount: 4800000000, dueDate: '2025-05-15', status: 'Đến hạn' },
      { installment: 6, milestone: 'Bàn giao sổ hồng chủ quyền', percentage: 5, amount: 1600000000, dueDate: '2025-11-30', status: 'Chưa đến hạn' }
    ],
    attachments: [
      { id: 'att10', name: 'HDMB_TheGrandManhattan_TGM1501.pdf', size: '6.4 MB', date: '2024-03-22', type: 'pdf', category: 'Hợp đồng gốc' },
      { id: 'att11', name: 'HoSoVay_MBBank_PheDuyet.pdf', size: '3.8 MB', date: '2024-03-18', type: 'pdf', category: 'UNC' },
      { id: 'att12', name: 'BienBanNghiemThu_MatNgoai.pdf', size: '1.9 MB', date: '2024-12-29', type: 'pdf', category: 'Biên bản bàn giao' }
    ]
  },
  { 
    id: 'ct5', code: 'HD-925', customerId: 'c7', inventoryId: 'i5', projectId: 'p2', 
    value: 12500000000, date: '2024-04-12', status: 'Đã ký', type: 'Hợp đồng mua bán', 
    paymentProgress: 100, bankSupport: 'VietinBank', signer: 'Lê Hoàng Anh', witnessAgent: 'Lê Hoàng Anh',
    notaryOffice: 'Văn phòng Công chứng Biên Hòa', notaryDate: '2024-04-18',
    paymentSchedule: [
      { installment: 1, milestone: 'Ký HĐMB nhà phố đảo Phượng Hoàng', percentage: 30, amount: 3750000000, dueDate: '2024-04-12', status: 'Đã thu', paidDate: '2024-04-12', invoiceRef: 'INV-VTB-019' },
      { installment: 2, milestone: 'Cất nóc thô nhà phố ven sông', percentage: 40, amount: 5000000000, dueDate: '2024-07-20', status: 'Đã thu', paidDate: '2024-07-18', invoiceRef: 'INV-VTB-088' },
      { installment: 3, milestone: 'Nhận bàn giao nhà hoàn thiện', percentage: 25, amount: 3125000000, dueDate: '2024-11-15', status: 'Đã thu', paidDate: '2024-11-10', invoiceRef: 'INV-VTB-155' },
      { installment: 4, milestone: 'Bàn giao sổ hồng chính thức', percentage: 5, amount: 625000000, dueDate: '2025-03-30', status: 'Đã thu', paidDate: '2025-03-25', invoiceRef: 'INV-VTB-201' }
    ],
    attachments: [
      { id: 'att13', name: 'HDMB_AquaCity_AQC12A01.pdf', size: '5.1 MB', date: '2024-04-14', type: 'pdf', category: 'Hợp đồng gốc' },
      { id: 'att14', name: 'GiayChungNhan_SoHong_Scan.pdf', size: '4.2 MB', date: '2025-03-26', type: 'pdf', category: 'Biên bản bàn giao' },
      { id: 'att15', name: 'HoaDonDienTu_ThanhToan100.pdf', size: '1.1 MB', date: '2025-03-26', type: 'pdf', category: 'UNC' }
    ]
  },
  { 
    id: 'ct6', code: 'DC-926', customerId: 'c4', inventoryId: 'i12', projectId: 'p5', 
    value: 35000000000, date: '2024-05-08', status: 'Đã ký', type: 'Hợp đồng đặt cọc', 
    paymentProgress: 30, bankSupport: 'Techcombank', signer: 'Trần Văn Sếp', witnessAgent: 'Thanh Hà',
    paymentSchedule: [
      { installment: 1, milestone: 'Ký thỏa thuận đặt cọc Shophouse Soho', percentage: 10, amount: 3500000000, dueDate: '2024-05-08', status: 'Đã thu', paidDate: '2024-05-08', invoiceRef: 'INV-TCB-501' },
      { installment: 2, milestone: 'Bổ sung vốn đối ứng cọc đợt 2', percentage: 20, amount: 7000000000, dueDate: '2024-06-08', status: 'Đã thu', paidDate: '2024-06-05', invoiceRef: 'INV-TCB-582' },
      { installment: 3, milestone: 'Ký HĐMB chính thức', percentage: 20, amount: 7000000000, dueDate: '2024-09-15', status: 'Đến hạn' },
      { installment: 4, milestone: 'Cất nóc phân khu Soho', percentage: 20, amount: 7000000000, dueDate: '2024-12-30', status: 'Chưa đến hạn' },
      { installment: 5, milestone: 'Bàn giao hoàn thiện mặt ngoài', percentage: 25, amount: 8750000000, dueDate: '2025-05-30', status: 'Chưa đến hạn' },
      { installment: 6, milestone: 'Bàn giao sổ hồng', percentage: 5, amount: 1750000000, dueDate: '2025-11-30', status: 'Chưa đến hạn' }
    ],
    attachments: [
      { id: 'att16', name: 'HD_DatCoc_TGC_SH05.pdf', size: '4.1 MB', date: '2024-05-09', type: 'pdf', category: 'Hợp đồng gốc' },
      { id: 'att17', name: 'UNC_NopTien_Dot1_Dot2.pdf', size: '1.5 MB', date: '2024-06-06', type: 'pdf', category: 'UNC' }
    ]
  },
  { 
    id: 'ct7', code: 'HD-927', customerId: 'c8', inventoryId: 'i6', projectId: 'p2', 
    value: 24000000000, date: '2024-06-15', status: 'Đã ký', type: 'Hợp đồng mua bán', 
    paymentProgress: 50, bankSupport: 'Vietcombank', signer: 'Trần Văn Sếp',
    loanAmount: 16800000000, loanTermYears: 20, interestSupportMonths: 24, witnessAgent: 'Thanh Hà',
    paymentSchedule: [
      { installment: 1, milestone: 'Ký HĐMB biệt thự ven sông The Suite', percentage: 20, amount: 4800000000, dueDate: '2024-06-15', status: 'Đã thu', paidDate: '2024-06-15', invoiceRef: 'INV-VCB-601' },
      { installment: 2, milestone: 'Đổ sàn tầng 2 khu biệt thự', percentage: 15, amount: 3600000000, dueDate: '2024-08-15', status: 'Đã thu', paidDate: '2024-08-12', invoiceRef: 'INV-VCB-688' },
      { installment: 3, milestone: 'Cất nóc công trình', percentage: 15, amount: 3600000000, dueDate: '2024-10-30', status: 'Đã thu', paidDate: '2024-10-28', invoiceRef: 'INV-VCB-755' },
      { installment: 4, milestone: 'Hoàn thiện hệ thống hạ tầng cảnh quan', percentage: 20, amount: 4800000000, dueDate: '2025-01-30', status: 'Đến hạn' },
      { installment: 5, milestone: 'Bàn giao chìa khóa trao tay', percentage: 25, amount: 6000000000, dueDate: '2025-06-30', status: 'Chưa đến hạn' },
      { installment: 6, milestone: 'Bàn giao sổ hồng', percentage: 5, amount: 1200000000, dueDate: '2025-12-30', status: 'Chưa đến hạn' }
    ],
    attachments: [
      { id: 'att18', name: 'HDMB_BietThuVenSong_AQC.pdf', size: '5.5 MB', date: '2024-06-16', type: 'pdf', category: 'Hợp đồng gốc' },
      { id: 'att19', name: 'CamKetBaoLanh_Vietcombank.pdf', size: '2.0 MB', date: '2024-06-15', type: 'pdf', category: 'UNC' }
    ]
  },
  { 
    id: 'ct8', code: 'GC-928', customerId: 'c3', inventoryId: 'i23', projectId: 'p4', 
    value: 2800000000, date: '2024-07-01', status: 'Chờ duyệt', type: 'Thỏa thuận giữ chỗ', 
    paymentProgress: 10, bankSupport: 'Không vay', signer: 'Nguyễn Văn Quản', witnessAgent: 'Trần Khoa',
    paymentSchedule: [
      { installment: 1, milestone: 'Ký thỏa thuận giữ chỗ căn Studio Beverly', percentage: 2, amount: 50000000, dueDate: '2024-07-01', status: 'Đã thu', paidDate: '2024-07-01', invoiceRef: 'INV-VGP-001' },
      { installment: 2, milestone: 'Bổ sung đủ 10% giá trị căn hộ', percentage: 8, amount: 230000000, dueDate: '2024-07-15', status: 'Đã thu', paidDate: '2024-07-12', invoiceRef: 'INV-VGP-015' },
      { installment: 3, milestone: 'Ký HĐMB chính thức', percentage: 15, amount: 420000000, dueDate: '2024-09-30', status: 'Đến hạn' },
      { installment: 4, milestone: 'Thanh toán các đợt tiếp theo (10 đợt)', percentage: 50, amount: 1400000000, dueDate: '2025-05-30', status: 'Chưa đến hạn' },
      { installment: 5, milestone: 'Nhận bàn giao căn hộ', percentage: 25, amount: 700000000, dueDate: '2025-09-30', status: 'Chưa đến hạn' }
    ],
    attachments: [
      { id: 'att20', name: 'TT_GiuCho_BE1_1209.pdf', size: '2.2 MB', date: '2024-07-02', type: 'pdf', category: 'Hợp đồng gốc' },
      { id: 'att21', name: 'CCCD_LeHoangCuong.jpg', size: '800 KB', date: '2024-07-01', type: 'jpg', category: 'CCCD' }
    ]
  }
];

export const INITIAL_BOOKING_TICKETS: BookingTicket[] = [
  {
    id: 'BK-1001',
    code: 'BK-1001',
    customerId: 'c1',
    customerName: 'Nguyễn Văn Tuấn',
    customerPhone: '0901234567',
    customerEmail: 'tuan.nguyen@investor.vn',
    projectId: 'p2',
    projectName: 'Aqua City',
    unitId: 'i5',
    unitCode: 'AQC-12A.01',
    price: 12500000000,
    depositAmount: 100000000,
    status: 'sale',
    type: 'Giữ chỗ có hoàn lại',
    priority: 'normal',
    paymentMethod: 'Chuyển khoản',
    docs: '2/4',
    agent: 'Lê Hoàng Anh',
    time: '15 phút trước',
    createdAt: '2026-07-20 09:30',
    expiresAt: 'Còn 45 phút',
    remainingMinutes: 45,
    bankRef: 'VCB-8839210492',
    notes: 'Khách hàng quan tâm phân khu đảo Phượng Hoàng, đã chuyển khoản giữ chỗ 100 triệu qua Vietcombank QR.',
    approvalHistory: [
      { step: 'sale', actor: 'Lê Hoàng Anh', action: 'created', timestamp: '09:30 20/07', comment: 'Khởi tạo phiếu booking giữ chỗ có hoàn lại.' }
    ]
  },
  {
    id: 'BK-1002',
    code: 'BK-1002',
    customerId: 'c2',
    customerName: 'Trần Thị Bích Ngọc',
    customerPhone: '0912345678',
    customerEmail: 'bichngoc.tran@vietcapital.vn',
    projectId: 'p1',
    projectName: 'NovaWorld Phan Thiet',
    unitId: 'i2',
    unitCode: 'NVW-01.02',
    price: 18500000000,
    depositAmount: 200000000,
    status: 'manager',
    type: 'Giữ chỗ không hoàn lại',
    priority: 'high',
    paymentMethod: 'Chuyển khoản',
    docs: '3/3',
    agent: 'Nguyễn Mai',
    time: '1 giờ trước',
    createdAt: '2026-07-20 08:45',
    expiresAt: 'Còn 30 phút',
    remainingMinutes: 30,
    bankRef: 'TCB-902188231',
    notes: 'Khách hàng VIP yêu cầu áp dụng chiết khấu 3% thanh toán sớm + Tặng 2 năm phí quản lý.',
    approvalHistory: [
      { step: 'sale', actor: 'Nguyễn Mai', action: 'created', timestamp: '08:45 20/07', comment: 'Tạo phiếu giữ chỗ ưu tiên song lập Florida.' },
      { step: 'manager', actor: 'Nguyễn Mai', action: 'approved', timestamp: '09:10 20/07', comment: 'Trình quản lý sàn duyệt mức chiết khấu bổ sung.' }
    ]
  },
  {
    id: 'BK-1003',
    code: 'BK-1003',
    customerId: 'c4',
    customerName: 'Phạm Minh Tuấn',
    customerPhone: '0912987654',
    customerEmail: 'minhtuan.pham@saigonres.com',
    projectId: 'p5',
    projectName: 'The Global City',
    unitId: 'i13',
    unitCode: 'TGC-SH06',
    price: 36000000000,
    depositAmount: 500000000,
    status: 'director',
    type: 'Ký HĐ Cọc',
    priority: 'urgent',
    paymentMethod: 'Chuyển khoản',
    docs: '4/4',
    agent: 'Thanh Hà',
    time: '2 giờ trước',
    createdAt: '2026-07-20 07:30',
    expiresAt: 'Còn 10 phút',
    remainingMinutes: 10,
    bankRef: 'MBB-554432109',
    notes: 'Căn Shophouse Soho trục chính kênh đào. Cần Giám đốc khối ký duyệt phân bổ giỏ hàng ngoại giao.',
    approvalHistory: [
      { step: 'sale', actor: 'Thanh Hà', action: 'created', timestamp: '07:30 20/07', comment: 'Lập phiếu cọc chính thức shophouse Soho.' },
      { step: 'manager', actor: 'Trần Khoa (Trưởng phòng)', action: 'approved', timestamp: '08:00 20/07', comment: 'Đã thẩm định hồ sơ tài chính khách VVIP.' },
      { step: 'director', actor: 'Trần Khoa', action: 'approved', timestamp: '08:15 20/07', comment: 'Trình GĐ Khối ký duyệt lock căn trực tiếp.' }
    ]
  },
  {
    id: 'BK-1004',
    code: 'BK-1004',
    customerId: 'c5',
    customerName: 'Hoàng Thị Thảo',
    customerPhone: '0945678123',
    customerEmail: 'thaonhi.hoang@gmail.com',
    projectId: 'p1',
    projectName: 'NovaWorld Phan Thiet',
    unitId: 'i3',
    unitCode: 'NVW-02.01',
    price: 16000000000,
    depositAmount: 150000000,
    status: 'payment',
    type: 'Giữ chỗ có hoàn lại',
    priority: 'normal',
    paymentMethod: 'Thẻ tín dụng',
    docs: '4/4',
    agent: 'Tuấn Tú',
    time: '3 giờ trước',
    createdAt: '2026-07-20 06:15',
    expiresAt: 'Còn 1 giờ 15 phút',
    remainingMinutes: 75,
    bankRef: 'POS-SAC-9921',
    notes: 'Khách quẹt thẻ tín dụng Sacombank tại VP giao dịch. Chờ Kế toán đối soát sao kê ngân hàng.',
    approvalHistory: [
      { step: 'sale', actor: 'Tuấn Tú', action: 'created', timestamp: '06:15 20/07', comment: 'Khởi tạo booking shophouse biển.' },
      { step: 'manager', actor: 'Trần Khoa', action: 'approved', timestamp: '07:00 20/07', comment: 'Quản lý duyệt.' },
      { step: 'director', actor: 'Giám Đốc Hùng', action: 'approved', timestamp: '07:30 20/07', comment: 'GĐ Khối duyệt phân bổ căn.' }
    ]
  },
  {
    id: 'BK-1005',
    code: 'BK-1005',
    customerId: 'c7',
    customerName: 'Vũ Thu Trang',
    customerPhone: '0966554433',
    customerEmail: 'trang.vu@fashionvn.com',
    projectId: 'p2',
    projectName: 'Aqua City',
    unitId: 'i7',
    unitCode: 'AQC-08B.01',
    price: 9800000000,
    depositAmount: 100000000,
    status: 'done',
    type: 'Ký HĐ Cọc',
    priority: 'normal',
    paymentMethod: 'Chuyển khoản',
    docs: '4/4',
    agent: 'Lê Hoàng Anh',
    time: 'Hôm qua',
    createdAt: '2026-07-19 14:00',
    expiresAt: 'Hoàn tất',
    remainingMinutes: 0,
    bankRef: 'VCB-11029482',
    notes: 'Đã hoàn tất xác nhận tiền vào TK chủ đầu tư. Đã phát hành Phiếu Đặt Cọc điện tử và gửi email khách hàng.',
    approvalHistory: [
      { step: 'sale', actor: 'Lê Hoàng Anh', action: 'created', timestamp: '14:00 19/07', comment: 'Tạo phiếu cọc căn 1PN Suite.' },
      { step: 'manager', actor: 'Trần Khoa', action: 'approved', timestamp: '14:30 19/07', comment: 'Duyệt hồ sơ hợp lệ.' },
      { step: 'director', actor: 'Giám Đốc Hùng', action: 'approved', timestamp: '15:10 19/07', comment: 'Ký duyệt số phiếu cọc.' },
      { step: 'payment', actor: 'Kế Toán Phương', action: 'approved', timestamp: '16:00 19/07', comment: 'Khớp tiền 100.000.000 VNĐ vào tài khoản Novaland.' }
    ]
  },
  {
    id: 'BK-1006',
    code: 'BK-1006',
    customerId: 'c3',
    customerName: 'Lê Hoàng Cường',
    customerPhone: '0987654321',
    customerEmail: 'cuong.le@techvina.com',
    projectId: 'p4',
    projectName: 'Vinhomes Grand Park',
    unitId: 'i23',
    unitCode: 'BE1-12.09',
    price: 2800000000,
    depositAmount: 50000000,
    status: 'sale',
    type: 'Giữ chỗ có hoàn lại',
    priority: 'normal',
    paymentMethod: 'Chuyển khoản',
    docs: '2/3',
    agent: 'Trần Khoa',
    time: '35 phút trước',
    createdAt: '2026-07-20 09:10',
    expiresAt: 'Còn 1 giờ',
    remainingMinutes: 60,
    bankRef: 'TCB-44102941',
    notes: 'Khách hàng trẻ mua studio đầu tư cho thuê, đang chờ gửi ảnh CCCD 2 mặt để hoàn tất hồ sơ.',
    approvalHistory: [
      { step: 'sale', actor: 'Trần Khoa', action: 'created', timestamp: '09:10 20/07', comment: 'Tạo phiếu giữ chỗ căn studio Beverly.' }
    ]
  },
  {
    id: 'BK-1007',
    code: 'BK-1007',
    customerId: 'c6',
    customerName: 'Đặng Quốc Huy',
    customerPhone: '0977889900',
    customerEmail: 'huy.dang@greenland.vn',
    projectId: 'p3',
    projectName: 'The Grand Manhattan',
    unitId: 'i8',
    unitCode: 'TGM-15.01',
    price: 15200000000,
    depositAmount: 200000000,
    status: 'payment',
    type: 'Giữ chỗ không hoàn lại',
    priority: 'high',
    paymentMethod: 'Tiền mặt',
    docs: '3/4',
    agent: 'Minh Anh',
    time: '4 giờ trước',
    createdAt: '2026-07-20 05:30',
    expiresAt: 'Còn 20 phút',
    remainingMinutes: 20,
    bankRef: 'PT-NOVA-8821',
    notes: 'Khách hàng nộp 200 triệu tiền mặt tại quỹ Novaland Cô Giang, thủ quỹ đang lập biên bản niêm phong nộp ngân hàng.',
    approvalHistory: [
      { step: 'sale', actor: 'Minh Anh', action: 'created', timestamp: '05:30 20/07', comment: 'Khởi tạo booking căn hộ hạng sang Q1.' },
      { step: 'manager', actor: 'Trần Khoa', action: 'approved', timestamp: '06:15 20/07', comment: 'Quản lý duyệt.' },
      { step: 'director', actor: 'Giám Đốc Hùng', action: 'approved', timestamp: '06:45 20/07', comment: 'GĐ duyệt.' }
    ]
  },
  {
    id: 'BK-1008',
    code: 'BK-1008',
    customerId: 'c8',
    customerName: 'Ngô Đức Thắng',
    customerPhone: '0933221144',
    customerEmail: 'thang.ngo@logistics24.vn',
    projectId: 'p2',
    projectName: 'Aqua City',
    unitId: 'i6',
    unitCode: 'AQC-12A.02',
    price: 24000000000,
    depositAmount: 200000000,
    status: 'done',
    type: 'Ký HĐ Cọc',
    priority: 'normal',
    paymentMethod: 'Chuyển khoản',
    docs: '4/4',
    agent: 'Thanh Hà',
    time: '2 ngày trước',
    createdAt: '2026-07-18 10:00',
    expiresAt: 'Hoàn tất',
    remainingMinutes: 0,
    bankRef: 'BIDV-9938217',
    notes: 'Hoàn tất cọc căn biệt thự ven sông The Suite, chuẩn bị ký HĐMB vào ngày 25/07.',
    approvalHistory: [
      { step: 'sale', actor: 'Thanh Hà', action: 'created', timestamp: '10:00 18/07', comment: 'Tạo phiếu cọc.' },
      { step: 'manager', actor: 'Trần Khoa', action: 'approved', timestamp: '11:00 18/07', comment: 'Quản lý sàn duyệt.' },
      { step: 'director', actor: 'Giám Đốc Hùng', action: 'approved', timestamp: '14:00 18/07', comment: 'GĐ duyệt.' },
      { step: 'payment', actor: 'Kế Toán Phương', action: 'approved', timestamp: '16:30 18/07', comment: 'Đã khớp tiền 200 triệu.' }
    ]
  }
];

const INITIAL_CAMPAIGNS: Campaign[] = [
  { id: 'c1', name: 'Lead Gen - Grand Manhattan (T12)', platform: 'Facebook', status: 'Active', budget: 50000000, spent: 12500000, leads: 45, clicks: 1200, startDate: '2025-12-01', targetCPL: 300000, routingRule: 'top_seller', assignedTeam: 'Team Luxury Alpha', projectId: 'p3' },
  { id: 'c2', name: 'Search Ads - Aqua City', platform: 'Google', status: 'Active', budget: 30000000, spent: 28000000, leads: 110, clicks: 3500, startDate: '2025-11-15', targetCPL: 250000, routingRule: 'round_robin', assignedTeam: 'Team Đảo Phượng Hoàng', projectId: 'p2' },
  { id: 'c3', name: 'Video Review - NovaWorld Phan Thiết', platform: 'TikTok', status: 'Paused', budget: 15000000, spent: 15000000, leads: 320, clicks: 8000, startDate: '2025-10-01', endDate: '2025-10-31', targetCPL: 50000, routingRule: 'round_robin', assignedTeam: 'Team Duyên Hải', projectId: 'p1' },
  { id: 'c4', name: 'ZNS Chăm sóc Khách Cũ Tái Đầu Tư', platform: 'Zalo', status: 'Active', budget: 5000000, spent: 1200000, leads: 28, clicks: 450, startDate: '2025-12-10', targetCPL: 45000, routingRule: 'top_seller', assignedTeam: 'Team CSKH VIP', projectId: 'p5' },
];

const INITIAL_ARTICLES: Article[] = [
  { 
    id: 'a1', 
    title: 'Bảng giá Aqua City cập nhật mới nhất (Tháng 7/2026) - Chiết khấu 15%', 
    slug: 'bang-gia-aqua-city-thang-7', 
    excerpt: 'Phân tích chi tiết bảng giá dự án Aqua City Đồng Nai. Hỗ trợ vay ngân hàng 0% lãi suất. Nhận ngay Voucher nội thất 300 triệu khi giữ chỗ.', 
    category: 'Thị trường', 
    status: 'published', 
    views: 4250, 
    seoScore: 95,
    author: 'Trần Minh Chiến (Trưởng ban Phân Tích)',
    publishedDate: '2026-07-15',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Aqua City', 'Bảng Giá', 'Chiết Khấu', 'Novaland']
  },
  { 
    id: 'a2', 
    title: 'Lãi suất vay mua nhà giảm sâu năm 2026: Cơ hội vàng cho nhà đầu tư', 
    slug: 'lai-suat-vay-mua-nha-giam-sau', 
    excerpt: 'Tin vui cho nhà đầu tư khi loạt ngân hàng Big4 và TMCP hạ lãi suất cho vay xuống dưới 6%, cùng chính sách ân hạn gốc 24 tháng từ chủ đầu tư.', 
    category: 'Tài chính', 
    status: 'published', 
    views: 2840, 
    seoScore: 88,
    author: 'Lê Hoàng Anh',
    publishedDate: '2026-07-10',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Lãi Suất', 'Tài Chính BĐS', 'Vay Ngân Hàng']
  },
  { 
    id: 'a3', 
    title: 'Tiến độ thi công Vành Đai 3 - Q3/2026: Cú hích cho BĐS Đông Sài Gòn', 
    slug: 'tien-do-thi-cong-vanh-dai-3', 
    excerpt: 'Cập nhật hình ảnh thực tế tiến độ giải phóng mặt bằng và thi công cầu cạn đường Vành Đai 3 kết nối TP. Thủ Đức và Nhơn Trạch.', 
    category: 'Tiến độ dự án', 
    status: 'draft', 
    views: 120, 
    seoScore: 65,
    author: 'Nguyễn Mai',
    publishedDate: '2026-07-18',
    thumbnail: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Vành Đai 3', 'Hạ Tầng', 'Quy Hoạch']
  },
  { 
    id: 'a4', 
    title: 'Top 5 lý do The Grand Manhattan là bảo vật truyền đời tại lõi Quận 1', 
    slug: 'ly-do-so-huu-the-grand-manhattan', 
    excerpt: 'Khám phá quỹ đất vàng hiếm hoi tại trung tâm Cô Giang - Cô Bắc, tích hợp khách sạn 5 sao Avani và tiềm năng tăng giá bền vững vượt thời gian.', 
    category: 'Cẩm nang đầu tư', 
    status: 'published', 
    views: 3100, 
    seoScore: 92,
    author: 'Trần Khoa',
    publishedDate: '2026-07-05',
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Grand Manhattan', 'Căn Hộ Hạng Sang', 'Quận 1']
  },
  { 
    id: 'a5', 
    title: 'NovaWorld Phan Thiết đón đầu làn sóng du lịch quốc tế sau cao tốc', 
    slug: 'novaworld-phan-thiet-du-lich-bien', 
    excerpt: 'Đại đô thị biển 1.000 ha ghi nhận công suất phòng đạt 88% trong mùa cao điểm, hệ sinh thái sân Golf PGA và công viên giải trí hoạt động hết công suất.', 
    category: 'Thị trường', 
    status: 'published', 
    views: 1950, 
    seoScore: 84,
    author: 'Thanh Hà',
    publishedDate: '2026-06-28',
    thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['NovaWorld Phan Thiet', 'BĐS Nghỉ Dưỡng', 'Golf PGA']
  }
];

const INITIAL_LANDING_PAGES: LandingPage[] = [
  { id: 'lp1', name: 'LP_MoBan_AquaCity_T7', url: '/aqua-city-booking', visitors: 15400, leads: 320, conversion: 2.1, status: true },
  { id: 'lp2', name: 'LP_TheGlobalCity_ThuThiem', url: '/global-city-vips', visitors: 5200, leads: 45, conversion: 0.8, status: false },
];

const INITIAL_REVIEWS: Review[] = [
  { 
    id: 'r1', 
    customerId: 'c1', 
    customerName: 'Nguyễn Văn A', 
    rating: 5, 
    source: 'Post-Sale Form', 
    text: 'Bạn Sale tư vấn rất nhiệt tình, thủ tục ký cọc nhanh gọn. Căn hộ The Grand Manhattan view Bitexco đẹp xuất sắc. Rất hài lòng!', 
    date: '2026-07-19', 
    sentiment: 'positive',
    phone: '0908123456',
    projectName: 'The Grand Manhattan',
    channel: 'Post-Sale Form',
    resolutionStatus: 'resolved',
    assignedStaff: 'Trần Minh Quân',
    npsScore: 10,
    cesScore: 7
  },
  { 
    id: 'r2', 
    customerId: 'c2', 
    customerName: 'Trần Thị B', 
    rating: 4, 
    source: 'Zalo ZNS', 
    text: 'Khu đô thị Aqua City thoáng mát và nhiều mảng xanh, nhưng đoạn đường Hương Lộ 2 vào sa bàn đang hoàn thiện nên hơi bụi và khó đi.', 
    date: '2026-07-18', 
    sentiment: 'neutral',
    phone: '0912345678',
    projectName: 'Aqua City',
    channel: 'Zalo ZNS',
    resolutionStatus: 'resolved',
    assignedStaff: 'Lê Hoàng Yến',
    npsScore: 8,
    cesScore: 5
  },
  { 
    id: 'r3', 
    customerId: 'c3', 
    customerName: 'Lê Văn C', 
    rating: 1, 
    source: 'Google Review', 
    text: 'Gọi Hotline chăm sóc khách hàng 3 lần trong giờ hành chính không ai bắt máy. Hỏi thủ tục giải ngân ngân hàng chậm trễ làm tôi bị phạt hạn hợp đồng!', 
    date: '2026-07-15', 
    sentiment: 'negative',
    phone: '0987654321',
    projectName: 'Vinhomes Grand Park',
    channel: 'Google Review',
    resolutionStatus: 'pending',
    assignedStaff: 'Nguyễn Thu Hà',
    resolutionNotes: 'Đã liên hệ xin lỗi trực tiếp, chuyển hồ sơ giải ngân ưu tiên cho Techcombank chi nhánh Q9 trong ngày.',
    npsScore: 1,
    cesScore: 2
  },
  { 
    id: 'r4', 
    customerId: 'c4', 
    customerName: 'Hoàng Minh Tuấn', 
    rating: 5, 
    source: 'Showroom Kiosk', 
    text: 'Trải nghiệm kính thực tế ảo VR xem căn hộ Penthouse The Global City cực kỳ ấn tượng. Đội ngũ lễ tân tiếp đón chu đáo, cà phê và bánh teabreak ngon.', 
    date: '2026-07-14', 
    sentiment: 'positive',
    phone: '0934567890',
    projectName: 'The Global City',
    channel: 'Showroom Kiosk',
    resolutionStatus: 'resolved',
    assignedStaff: 'Phạm Hồng Ngọc',
    npsScore: 10,
    cesScore: 7
  },
  { 
    id: 'r5', 
    customerId: 'c5', 
    customerName: 'Đặng Bích Phương', 
    rating: 5, 
    source: 'Post-Sale Form', 
    text: 'Hồ sơ bảo lãnh ngân hàng Vietcombank được bạn chuyên viên hỗ trợ thẩm định siêu tốc chỉ 48 tiếng là có chứng thư. Rất an tâm khi giao dịch!', 
    date: '2026-07-12', 
    sentiment: 'positive',
    phone: '0971234890',
    projectName: 'Eco Green Saigon',
    channel: 'Post-Sale Form',
    resolutionStatus: 'resolved',
    assignedStaff: 'Võ Quốc Bảo',
    npsScore: 9,
    cesScore: 6
  },
  { 
    id: 'r6', 
    customerId: 'c6', 
    customerName: 'Vũ Đình Trọng', 
    rating: 2, 
    source: 'Zalo ZNS', 
    text: 'Chất lượng hoàn thiện căn Shophouse lúc nhận bàn giao còn nhiều lỗi sơn nước và nẹp chân tường lỏng lẻo. Báo bảo hành 2 tuần rồi chưa có thợ xử lý!', 
    date: '2026-07-10', 
    sentiment: 'negative',
    phone: '0945678901',
    projectName: 'Novaworld Phan Thiết',
    channel: 'Zalo ZNS',
    resolutionStatus: 'escalated',
    assignedStaff: 'Đỗ Tuấn Kiệt',
    resolutionNotes: 'Đã đôn đốc chỉ huy trưởng nhà thầu Delta tới căn dặm vá sơn và thay mới nẹp inox trước ngày 22/07.',
    npsScore: 2,
    cesScore: 3
  },
  { 
    id: 'r7', 
    customerId: 'c7', 
    customerName: 'Phan Thu Trang', 
    rating: 4, 
    source: 'SMS Link', 
    text: 'Căn hộ The Beverly 2PN bố trí công năng hợp lý, view sông Đồng Nai mát mẻ. Tuy nhiên mức phí giữ xe ô tô tầng hầm hơi cao so với khu vực.', 
    date: '2026-07-08', 
    sentiment: 'neutral',
    phone: '0967890123',
    projectName: 'Vinhomes Grand Park',
    channel: 'SMS Link',
    resolutionStatus: 'resolved',
    assignedStaff: 'Bùi Thị Mai',
    npsScore: 7,
    cesScore: 5
  },
  { 
    id: 'r8', 
    customerId: 'c8', 
    customerName: 'Ngô Thanh Tùng', 
    rating: 5, 
    source: 'Google Review', 
    text: 'Lễ hội nhạc nước The Global City tối thứ 7 quá hoành tráng! Nhân viên tư vấn Shophouse Soho giải thích rõ ràng lộ trình tăng giá, gia đình đã cọc thành công.', 
    date: '2026-07-05', 
    sentiment: 'positive',
    phone: '0909876543',
    projectName: 'The Global City',
    channel: 'Google Review',
    resolutionStatus: 'resolved',
    assignedStaff: 'Trần Minh Quân',
    npsScore: 10,
    cesScore: 7
  }
];

const INITIAL_SURVEY_CAMPAIGNS: SurveyCampaign[] = [
  { 
    id: 'sc1', 
    name: 'Khảo sát Tức Thì Sau Tham Quan Sa Bàn & Nhà Mẫu', 
    trigger: 'Tự động gửi Zalo ZNS sau khi Check-in Sự Kiện 1 giờ', 
    responses: 342, 
    conversion: '46.8%',
    status: 'active',
    channel: 'Zalo ZNS',
    targetAudience: 'Khách tham quan sự kiện mở bán & Showroom',
    rewardPoints: 200,
    createdAt: '2026-06-01',
    csatScore: 94,
    npsScore: 62,
    formUrl: 'https://crm.proptech.vn/s/saban-exp'
  },
  { 
    id: 'sc2', 
    name: 'Đánh Giá Chất Lượng Tư Vấn Của Chuyên Viên Sale', 
    trigger: 'Tự động gửi Email & SMS ngay sau khi Ký Thỏa Thuận Đặt Cọc', 
    responses: 128, 
    conversion: '71.5%',
    status: 'active',
    channel: 'SMS & Email',
    targetAudience: 'Khách hàng vừa chốt cọc thành công',
    rewardPoints: 500,
    createdAt: '2026-05-15',
    csatScore: 96,
    npsScore: 78,
    formUrl: 'https://crm.proptech.vn/s/sale-consulting'
  },
  { 
    id: 'sc3', 
    name: 'Khảo Sát Thủ Tục Thẩm Định Hồ Sơ Vay Ngân Hàng', 
    trigger: 'Gửi Zalo ZNS sau khi Ngân hàng phát hành Thư bảo lãnh giải ngân', 
    responses: 64, 
    conversion: '52.0%',
    status: 'active',
    channel: 'Zalo ZNS',
    targetAudience: 'Khách mua qua đòn bẩy tài chính ngân hàng',
    rewardPoints: 300,
    createdAt: '2026-06-20',
    csatScore: 88,
    npsScore: 45,
    formUrl: 'https://crm.proptech.vn/s/mortgage-loan'
  },
  { 
    id: 'sc4', 
    name: 'Khảo Sát Nghiệm Thu & Nhận Bàn Giao Chìa Khóa Nhà', 
    trigger: 'Kích hoạt trên App Cư Dân sau khi ký Biên bản Bàn giao căn hộ', 
    responses: 45, 
    conversion: '83.3%',
    status: 'active',
    channel: 'App Cư Dân',
    targetAudience: 'Khách hàng nhận bàn giao nhà thực tế',
    rewardPoints: 1000,
    createdAt: '2026-04-10',
    csatScore: 82,
    npsScore: 38,
    formUrl: 'https://crm.proptech.vn/s/home-handover'
  },
  { 
    id: 'sc5', 
    name: 'Khảo Sát Đo Lường NPS Định Kỳ Cư Dân 6 Tháng', 
    trigger: 'Gửi hàng loạt qua Zalo OA vào ngày 15 của tháng 6 và tháng 12', 
    responses: 215, 
    conversion: '39.2%',
    status: 'paused',
    channel: 'Zalo OA Broadcast',
    targetAudience: 'Toàn bộ cư dân đã về ở từ 6 tháng trở lên',
    rewardPoints: 500,
    createdAt: '2026-01-01',
    csatScore: 86,
    npsScore: 50,
    formUrl: 'https://crm.proptech.vn/s/resident-nps-h1'
  }
];

const INITIAL_VOUCHERS: Voucher[] = [
  { 
    id: 'v1', 
    title: 'Nghỉ dưỡng 2 Đêm tại Biệt thự Biển Novaworld Phan Thiết', 
    points: 50000, 
    iconName: 'Plane', 
    color: 'bg-blue-50 border-blue-200',
    category: 'Nghỉ dưỡng',
    description: 'Bao gồm ăn sáng buffet 5 sao, đưa đón limousine sân bay Cam Ranh/Tân Sơn Nhất, miễn phí vé Bikini Beach.',
    expiryDate: '2026-12-31',
    codePrefix: 'NVW-VILLA',
    stock: 15,
    terms: 'Đặt phòng trước tối thiểu 7 ngày. Áp dụng cho tối đa 4 người lớn và 2 trẻ em.'
  },
  { 
    id: 'v2', 
    title: 'Gói Thiết Kế & Thi Công Nội Thất Cao Cấp Foster (Trị giá 500 Triệu)', 
    points: 150000, 
    iconName: 'Sofa', 
    color: 'bg-amber-50 border-amber-200',
    category: 'Nội thất',
    description: 'Trừ trực tiếp vào tổng gói hoàn thiện nội thất nhà phố/biệt thự phân khu The Beverly hoặc The Global City.',
    expiryDate: '2027-06-30',
    codePrefix: 'FST-DECOR',
    stock: 8,
    terms: 'Không quy đổi thành tiền mặt. Áp dụng đồng thời cùng chính sách bán hàng dự án.'
  },
  { 
    id: 'v3', 
    title: 'Thẻ Đặc Quyền Phòng Chờ Thương Gia Sân Bay Quốc Tế 1 Năm', 
    points: 10000, 
    iconName: 'Coffee', 
    color: 'bg-purple-50 border-purple-200',
    category: 'Hàng không',
    description: 'Sử dụng không giới hạn hệ thống phòng chờ thương gia Le Saigonnais, Lotus Lounge, Song Hong Lounge tại VN và quốc tế.',
    expiryDate: '2026-12-31',
    codePrefix: 'VIP-LOUNGE',
    stock: 50,
    terms: 'Xuất trình mã QR và thẻ căn cước tại quầy lễ tân phòng chờ.'
  },
  { 
    id: 'v4', 
    title: 'Voucher Chiết Khấu Trực Tiếp 2% Cho Giao Dịch BĐS Kế Tiếp', 
    points: 300000, 
    iconName: 'ShieldCheck', 
    color: 'bg-emerald-50 border-emerald-200',
    category: 'Chiết khấu BĐS',
    description: 'Được giảm trừ trực tiếp vào giá trị hợp đồng mua bán trước VAT cho các sản phẩm tại Aqua City & Novaworld.',
    expiryDate: '2027-12-31',
    codePrefix: 'RE-DISC2PCT',
    stock: 5,
    terms: 'Chỉ áp dụng cho chủ thẻ hoặc người thân đứng tên đồng sở hữu.'
  },
  { 
    id: 'v5', 
    title: 'Thẻ Thành Viên Nova Golf PGA 36 Hố Không Giới Hạn 1 Năm', 
    points: 80000, 
    iconName: 'Award', 
    color: 'bg-green-50 border-green-200',
    category: 'Golf & Thể thao',
    description: 'Miễn phí green fee, tặng 12 buổi caddie VIP và ưu tiên tee-time giờ vàng ngày cuối tuần tại sân PGA Ocean & Desert.',
    expiryDate: '2026-12-31',
    codePrefix: 'PGA-GOLF36',
    stock: 12,
    terms: 'Kích hoạt thẻ trong vòng 60 ngày kể từ ngày đổi.'
  },
  { 
    id: 'v6', 
    title: 'Tiệc Du Thuyền Riêng Ngắm Hoàng Hôn Aqua Marina 4 Giờ', 
    points: 120000, 
    iconName: 'Sparkles', 
    color: 'bg-sky-50 border-sky-200',
    category: 'Nghỉ dưỡng',
    description: 'Trải nghiệm du thuyền chuẩn 5 sao 60ft lướt sóng sông Đồng Nai, bao gồm tiệc rượu vang hảo hạng và set menu 6 món cao cấp.',
    expiryDate: '2026-11-30',
    codePrefix: 'YACHT-AQM',
    stock: 6,
    terms: 'Bao gồm tối đa 10 hành khách. Cần đặt trước lịch khởi hành 5 ngày.'
  },
  { 
    id: 'v7', 
    title: 'Gói Chăm Sóc Sức Khỏe Toàn Diện Gia Đình NovaMed Platinum', 
    points: 65000, 
    iconName: 'ShieldCheck', 
    color: 'bg-rose-50 border-rose-200',
    category: 'Sức khỏe',
    description: 'Gói khám tầm soát chuyên sâu tại Bệnh viện đa khoa quốc tế NovaMed, bao gồm chụp MRI, xét nghiệm gen và bác sĩ gia đình riêng.',
    expiryDate: '2027-03-31',
    codePrefix: 'MED-PLAT',
    stock: 20,
    terms: 'Áp dụng cho gia đình 4 thành viên (2 người lớn, 2 trẻ em).'
  },
  { 
    id: 'v8', 
    title: 'Thẻ VIP Xem Nhạc Nước The Global City Trọn Đời (Ghế Hạng Nhất)', 
    points: 35000, 
    iconName: 'Ticket', 
    color: 'bg-indigo-50 border-indigo-200',
    category: 'Giải trí',
    description: 'Lối đi VIP riêng không xếp hàng, miễn phí đồ uống và chỗ ngồi khán đài trung tâm mỗi tuần tại show nhạc nước lớn nhất ĐNA.',
    expiryDate: '2028-12-31',
    codePrefix: 'TGC-WATER',
    stock: 30,
    terms: 'Được bảo lưu quyền lợi và chuyển nhượng cho gia đình.'
  }
];

const INITIAL_LOYALTY_TRANSACTIONS: LoyaltyTransaction[] = [
  { id: 'lt1', title: 'Tích lũy từ Giao dịch Mua Biệt thự Aqua City (Mã: AQ-10294)', date: '2026-07-15', points: 150000, type: 'earn', customerId: 'c1', customerName: 'Nguyễn Văn Tuấn', referenceCode: 'TX-AQ10294', status: 'Đã duyệt' },
  { id: 'lt2', title: 'Tích lũy từ Giao dịch Mua Shophouse Novaworld (Mã: NV-33121)', date: '2025-02-02', points: 95000, type: 'earn', customerId: 'c1', customerName: 'Nguyễn Văn Tuấn', referenceCode: 'TX-NV33121', status: 'Đã duyệt' },
  { id: 'lt3', title: 'Thưởng Giới Thiệu Bạn Bè Mua The Global City (Ref: TGC-VIP)', date: '2025-11-20', points: 25000, type: 'earn', customerId: 'c1', customerName: 'Nguyễn Văn Tuấn', referenceCode: 'REF-88210', status: 'Đã duyệt' },
  { id: 'lt4', title: 'Đổi Quà: Thẻ Đặc Quyền Phòng Chờ Thương Gia Sân Bay', date: '2026-01-10', points: 10000, type: 'redeem', customerId: 'c1', customerName: 'Nguyễn Văn Tuấn', referenceCode: 'RDM-VIP991', status: 'Thành công' },
  { id: 'lt5', title: 'Tích lũy từ Ký HĐMB Căn hộ Vinhomes Grand Park BE1-05.01', date: '2026-06-08', points: 55000, type: 'earn', customerId: 'c2', customerName: 'Trần Thị Bích Ngọc', referenceCode: 'TX-VGP0501', status: 'Đã duyệt' },
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
    id: 'call1', 
    name: 'Nguyễn Văn A', 
    phone: '0909 123 456', 
    time: '14:30 Hôm nay', 
    duration: '12:45', 
    status: 'success', 
    sentiment: 'positive',
    agentName: 'Tuấn Tú (Ext 101)',
    projectName: 'The Grand Manhattan',
    disposition: 'Hẹn xem sa bàn',
    qaScore: 94,
    notes: 'Khách hàng ưng ý căn hộ 3PN góc view Bitexco. Đã hẹn 9h sáng thứ Bảy.',
    scores: { positive: 75, neutral: 20, negative: 5 },
    takeaways: ['Khách hàng ưng ý layout 3PN góc view Bitexco.', 'Quan tâm gói chiết khấu 8% thanh toán sớm.', 'Đã chốt lịch hẹn 09:00 sáng Thứ Bảy này xem sa bàn thực tế.'],
    metrics: { agentTalkRatio: '45%', speechRate: '120' },
    transcript: [
      { speaker: 'agent', time: '00:05', text: 'Dạ alo, em Tuấn Tú bên dự án The Grand Manhattan Quận 1 xin chào anh Nguyễn Văn A ạ!' },
      { speaker: 'customer', time: '00:15', text: 'Chào em, anh vừa xem thông tin căn 3PN bên em gửi qua Zalo.' },
      { speaker: 'agent', time: '00:35', text: 'Dạ anh A ơi, căn 3PN góc Tháp Manhattan tầng 15 đang có chính sách tặng gói Smart Home 150 triệu và chỗ đậu xe định danh ạ.' },
      { speaker: 'customer', time: '01:20', text: 'Thế giá 18.5 Tỷ là đã gồm VAT và kinh phí bảo trì chưa em?' },
      { speaker: 'agent', time: '01:45', text: 'Dạ chính xác ạ. Nếu anh thanh toán sớm 70% sẽ được chiết khấu thêm 8%. Sáng Thứ Bảy 9h em mời anh ghé Showroom sa bàn nhé!' },
      { speaker: 'customer', time: '02:10', text: 'Ừ nghe cũng hấp dẫn đấy, Thứ Bảy 9h sáng anh ghé qua.' }
    ]
  },
  {
    id: 'call2', 
    name: 'Trần Thị B', 
    phone: '0988 765 432', 
    time: '09:15 Hôm nay', 
    duration: '05:20', 
    status: 'success', 
    sentiment: 'neutral',
    agentName: 'Tuấn Tú (Ext 101)',
    projectName: 'Aqua City',
    disposition: 'Khách quan tâm',
    qaScore: 85,
    notes: 'Khách hỏi tiến độ đường Hương Lộ 2. Cần gửi bản đồ quy hoạch 1/500.',
    scores: { positive: 20, neutral: 60, negative: 20 },
    takeaways: ['Khách quan tâm tiến độ thi công hạ tầng đường Hương Lộ 2.', 'Đã gửi file GPXD và quy hoạch 1/500 qua Zalo.'],
    metrics: { agentTalkRatio: '60%', speechRate: '135' },
    transcript: [
      { speaker: 'customer', time: '00:10', text: 'Dự án Aqua City Đảo Phượng Hoàng xây tới đâu rồi em? Pháp lý ổn không?' },
      { speaker: 'agent', time: '00:25', text: 'Dạ dự án đã hoàn thành san lấp và hạ tầng giao thông chính, pháp lý GPXD đầy đủ. Lát em gửi Zalo cho chị xem nhé.' },
      { speaker: 'customer', time: '01:10', text: 'Ok em gửi đi, xem xong chị báo lại.' }
    ]
  },
  {
    id: 'call3', 
    name: 'Lê Văn C', 
    phone: '0912 345 678', 
    time: 'Hôm qua, 16:45', 
    duration: '01:15', 
    status: 'missed', 
    sentiment: 'negative',
    agentName: 'Thanh Hà (Ext 102)',
    projectName: 'Novaworld Phan Thiết',
    disposition: 'Khách bận / Gọi lại sau',
    qaScore: 70,
    notes: 'Khách đang bận họp, nhắc không gọi giờ hành chính. Hẹn gọi lại tối mai.',
    scores: { positive: 5, neutral: 25, negative: 70 },
    takeaways: ['Khách đang họp, yêu cầu không gọi trong giờ hành chính.', 'Cần gọi lại sau 19:30 tối mai.'],
    metrics: { agentTalkRatio: '30%', speechRate: '145' },
    transcript: [
      { speaker: 'agent', time: '00:05', text: 'Dạ em chào anh C, em Thanh Hà gọi từ Novaworld Phan Thiết...' },
      { speaker: 'customer', time: '00:12', text: 'Anh đang họp bận lắm nhé, đừng gọi giờ này phiền quá!' },
      { speaker: 'agent', time: '00:20', text: 'Dạ em xin lỗi đã làm phiền anh, em xin phép liên hệ lại vào buổi tối ạ.' }
    ]
  },
  {
    id: 'call4', 
    name: 'Hoàng Minh Tuấn', 
    phone: '0934 567 890', 
    time: 'Hôm qua, 11:20', 
    duration: '08:35', 
    status: 'success', 
    sentiment: 'positive',
    agentName: 'Lê Hoàng Anh (Ext 103)',
    projectName: 'The Global City',
    disposition: 'Hẹn xem sa bàn',
    qaScore: 96,
    notes: 'Khách rất thích Shophouse Soho, hẹn Chủ Nhật 15:00 xem nhạc nước và sa bàn.',
    scores: { positive: 85, neutral: 12, negative: 3 },
    takeaways: ['Khách tìm hiểu Shophouse Soho mặt tiền Đỗ Xuân Hợp.', 'Hào hứng với tiện ích kênh đào nhạc nước.', 'Hẹn chiều Chủ Nhật 15:00 gặp tại Sales Gallery.'],
    metrics: { agentTalkRatio: '42%', speechRate: '118' },
    transcript: [
      { speaker: 'agent', time: '00:08', text: 'Dạ em chào anh Tuấn! Shophouse Soho đợt này CĐT Masterise đang có gói cam kết tiền thuê 100 triệu/tháng trong 2 năm đầu ạ.' },
      { speaker: 'customer', time: '00:30', text: 'Ồ chính sách thuê tốt vậy hả em? Căn đó bao nhiêu m2 sàn?' },
      { speaker: 'agent', time: '00:55', text: 'Dạ diện tích sàn 350m2, thiết kế 1 trệt 4 lầu có sẵn ô thang máy. Chủ Nhật này 15:00 em đón anh xem thực tế nhé!' },
      { speaker: 'customer', time: '01:40', text: 'Được đấy, chiều Chủ Nhật anh và bà xã qua.' }
    ]
  },
  {
    id: 'call5', 
    name: 'Đặng Bích Phương', 
    phone: '0971 234 890', 
    time: '18/07/2026', 
    duration: '06:40', 
    status: 'success', 
    sentiment: 'positive',
    agentName: 'Tuấn Tú (Ext 101)',
    projectName: 'Eco Green Saigon',
    disposition: 'Tư vấn vay vốn',
    qaScore: 90,
    notes: 'Khách muốn thẩm định hồ sơ Vietcombank gói vay 70%, ân hạn gốc lãi 24 tháng.',
    scores: { positive: 68, neutral: 25, negative: 7 },
    takeaways: ['Khách muốn vay 70% giá trị căn hộ qua Vietcombank.', 'Hỏi chi tiết về thời hạn ân hạn nợ gốc 24 tháng.'],
    metrics: { agentTalkRatio: '52%', speechRate: '122' },
    transcript: [
      { speaker: 'customer', time: '00:15', text: 'Em ơi chị có lương chuyển khoản 80 triệu/tháng thì vay được 5 tỷ không?' },
      { speaker: 'agent', time: '00:35', text: 'Dạ mức thu nhập của chị hoàn toàn đủ điều kiện vay gói ân hạn nợ gốc 24 tháng tại Vietcombank chi nhánh Q7 ạ.' }
    ]
  },
  {
    id: 'call6', 
    name: 'Vũ Đình Trọng', 
    phone: '0945 678 901', 
    time: '17/07/2026', 
    duration: '03:10', 
    status: 'success', 
    sentiment: 'negative',
    agentName: 'Bảo Trần (Ext 104)',
    projectName: 'Novaworld Phan Thiết',
    disposition: 'Khiếu nại tiến độ',
    qaScore: 78,
    notes: 'Khách phàn nàn chưa nhận được thông báo bàn giao. Đã chuyển CSKH xử lý gấp.',
    scores: { positive: 10, neutral: 20, negative: 70 },
    takeaways: ['Khách phàn nàn về việc chưa nhận được thông báo bàn giao đợt 2.', 'Đã chuyển thông tin sang phòng Chăm sóc khách hàng VIP để gọi lại trong 2 giờ.'],
    metrics: { agentTalkRatio: '38%', speechRate: '140' },
    transcript: [
      { speaker: 'customer', time: '00:10', text: 'Alo, căn Shophouse Florida của tôi hẹn tháng 6 bàn giao mà nay giữa tháng 7 chưa thấy ai báo gì cả?' },
      { speaker: 'agent', time: '00:30', text: 'Dạ em rất xin lỗi anh Trọng về sự chậm trễ này. Em xin ghi nhận mã căn và chuyển ngay cho Trưởng phòng CSKH liên hệ lại xử lý ngay trong 2 tiếng ạ.' }
    ]
  },
  {
    id: 'call7', 
    name: 'Phan Thu Trang', 
    phone: '0967 890 123', 
    time: '16/07/2026', 
    duration: '09:12', 
    status: 'success', 
    sentiment: 'neutral',
    agentName: 'Tuấn Tú (Ext 101)',
    projectName: 'Vinhomes Grand Park',
    disposition: 'Khách quan tâm',
    qaScore: 88,
    notes: 'Khách so sánh The Beverly và Masteri Centre Point. Đã gửi bảng phân tích dòng tiền.',
    scores: { positive: 35, neutral: 55, negative: 10 },
    takeaways: ['Khách so sánh giá phân khu The Beverly với Masteri Centre Point.', 'Yêu cầu bảng so sánh diện tích và suất đầu tư cho thuê.'],
    metrics: { agentTalkRatio: '58%', speechRate: '128' },
    transcript: [
      { speaker: 'customer', time: '00:20', text: 'Chị đang phân vân giữa Beverly view công viên 36ha với bên Masteri, em so sánh hộ chị được không?' },
      { speaker: 'agent', time: '00:45', text: 'Dạ vâng, The Beverly có ưu thế vượt trội về hồ bơi nước mặn phong cách Beverly Hills và mật độ căn hộ trên sàn thấp hơn ạ.' }
    ]
  },
  {
    id: 'call8', 
    name: 'Ngô Thanh Tùng', 
    phone: '0909 876 543', 
    time: '15/07/2026', 
    duration: '14:20', 
    status: 'success', 
    sentiment: 'positive',
    agentName: 'Lê Hoàng Anh (Ext 103)',
    projectName: 'The Global City',
    disposition: 'Chốt cọc thành công',
    qaScore: 98,
    notes: 'Khách xác nhận đã chuyển cọc 200 triệu cho căn Shophouse LK-08. Kế toán đã có UNC.',
    scores: { positive: 90, neutral: 8, negative: 2 },
    takeaways: ['Khách xác nhận chuyển cọc 200 triệu cho căn Shophouse LK-08.', 'Kế toán đã nhận được ủy nhiệm chi.'],
    metrics: { agentTalkRatio: '40%', speechRate: '115' },
    transcript: [
      { speaker: 'customer', time: '00:15', text: 'Anh vừa chuyển khoản 200 triệu cọc giữ chỗ căn LK-08 rồi em nhé, kiểm tra giúp anh.' },
      { speaker: 'agent', time: '00:35', text: 'Dạ tuyệt vời quá anh Tùng ơi! Kế toán vừa báo em tiền đã vào tài khoản CĐT. Em chúc mừng anh đã sở hữu căn shophouse vị trí đắc địa nhất dự án ạ!' }
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
  { id: 'folder1', name: 'Dự án Aqua City', projectId: 'p2', subFolders: ['Tài liệu pháp lý 1/500', 'Chính sách bán hàng & Chiết khấu', 'Bản vẽ mặt bằng CAD', 'Media & Sa bàn ảo 3D'] },
  { id: 'folder2', name: 'Dự án Novaworld Phan Thiết', projectId: 'p1', subFolders: ['Quy hoạch & Giấy phép xây dựng', 'Brochure phân khu Florida', 'Tiến độ thi công 4K', 'Cam kết ủy thác cho thuê'] },
  { id: 'folder3', name: 'Dự án The Grand Manhattan', projectId: 'p3', subFolders: ['Pháp lý Sở Xây Dựng Q1', 'Bảo lãnh tài chính MBBank', 'Quy chuẩn bàn giao Kohler & Hafele'] },
  { id: 'folder4', name: 'Dự án The Global City', projectId: 'p5', subFolders: ['Thiết kế kiến trúc Foster+Partners', 'Hợp đồng mua bán mẫu', 'Chính sách vay Techcombank'] },
  { id: 'folder5', name: 'Dự án Vinhomes Grand Park', projectId: 'p4', subFolders: ['Phê duyệt 1/500 Masterise & Vingroup', 'Sổ hồng phân khu The Origami'] },
  { id: 'folder6', name: 'Cẩm Nang Đào Tạo & Biểu Mẫu Chuẩn', subFolders: ['Kịch bản Telesale & Xử lý từ chối', 'Mẫu Thỏa thuận giữ chỗ', 'Biểu mẫu xin đặc cách CĐT'] },
];

const INITIAL_DOCUMENTS: DocumentFile[] = [
  // Aqua City (folder1)
  { 
    id: 'f1', folderId: 'folder1', type: 'pdf', 
    name: 'QuyetDinh_PheDuyet_QuyHoach_1_500_DaoPhuongHoang.pdf', 
    size: '14.8 MB', date: '2026-07-15', tag: 'Pháp lý 1/500', 
    description: 'Quyết định số 2845/QĐ-UBND của UBND Tỉnh Đồng Nai phê duyệt quy hoạch chi tiết 1/500 Phân khu Phoenix Island.',
    version: 'v3.2', legalStatus: 'Hiệu lực thi hành', downloadsCount: 342, signer: 'UBND Tỉnh Đồng Nai'
  },
  { 
    id: 'f2', folderId: 'folder1', type: 'pdf', 
    name: 'Chinh_Sach_Ban_Hang_Dot3_UuDai_14Pct.pdf', 
    size: '3.2 MB', date: '2026-07-18', tag: 'Chính sách', 
    description: 'Chính sách bán hàng đợt 3: Chiết khấu thanh toán sớm 14%, cam kết thuê lại 45Tr/tháng trong 2 năm và tặng thẻ du thuyền.',
    version: 'v2.1', legalStatus: 'Đã phê duyệt', downloadsCount: 518, signer: 'Khối Kinh Doanh Tập Đoàn'
  },
  { 
    id: 'f3', folderId: 'folder1', type: 'cad', 
    name: 'BanVe_KienTruc_CAD_BietThuSongLap_Phoenix.dwg', 
    size: '48.5 MB', date: '2026-06-25', tag: 'Bản vẽ CAD', 
    description: 'Bản vẽ mặt bằng kết cấu và chi tiết kiến trúc AutoCad 2026 Biệt thự song lập 10x20m Phoenix Island.',
    version: 'v1.0', legalStatus: 'Hiệu lực thi hành', downloadsCount: 129, signer: 'Viện Quy Hoạch Kiến Trúc Palm'
  },
  { 
    id: 'f4', folderId: 'folder1', type: 'video', 
    name: 'TVC_AquaCity_Flycam_TienDo_Thang7_4K.mp4', 
    size: '420 MB', date: '2026-07-20', tag: 'Media TVC', 
    description: 'Video TVC 4K góc quay toàn cảnh Flycam phân khu Đảo Phượng Hoàng và Quảng trường bến du thuyền Aqua Marina.',
    version: '4K Pro', legalStatus: 'Hiệu lực thi hành', downloadsCount: 680
  },
  { 
    id: 'f5', folderId: 'folder1', type: 'vr', 
    name: 'Virtual_Tour_VR360_BietThuMau_PhoenixSouth.html', 
    size: 'Web Link', date: '2026-07-10', tag: 'VR 360', 
    description: 'Không gian thực tế ảo WebXR tương tác 360 độ căn biệt thự mẫu Đảo Phượng Hoàng tích hợp thước đo laser.',
    version: 'WebXR 2.0', legalStatus: 'Hiệu lực thi hành', downloadsCount: 924
  },
  { 
    id: 'f6', folderId: 'folder1', type: 'docx', 
    name: 'Mau_HopDong_MuaBan_BietThu_AquaCity_Chuan.docx', 
    size: '1.8 MB', date: '2026-07-12', tag: 'Mẫu HĐMB', 
    description: 'Mẫu Hợp Đồng Mua Bán Nhà Ở Hình Thành Trong Tương Lai kèm phụ lục vật liệu xây dựng bàn giao tiêu chuẩn.',
    version: 'v4.0', legalStatus: 'Đã phê duyệt', downloadsCount: 412, signer: 'Ban Pháp Chế Tập Đoàn'
  },

  // Novaworld Phan Thiết (folder2)
  { 
    id: 'f7', folderId: 'folder2', type: 'pdf', 
    name: 'GiayPhep_XayDung_So108_KhuFlorida.pdf', 
    size: '8.4 MB', date: '2026-05-30', tag: 'GPXD', 
    description: 'Giấy phép xây dựng số 108/GPXD-SXD Sở Xây dựng Bình Thuận cấp cho cụm biệt thự biển Florida 1 & 2.',
    version: 'v1.0', legalStatus: 'Hiệu lực thi hành', downloadsCount: 285, signer: 'Sở Xây Dựng Bình Thuận'
  },
  { 
    id: 'f8', folderId: 'folder2', type: 'pdf', 
    name: 'Brochure_CaoCap_PGA_Golf_Villas.pdf', 
    size: '32.6 MB', date: '2026-06-15', tag: 'Brochure', 
    description: 'Brochure giới thiệu đặc quyền sân Golf chuẩn PGA 36 hố độc quyền duy nhất tại Việt Nam do Greg Norman thiết kế.',
    version: 'v2.0', legalStatus: 'Đã phê duyệt', downloadsCount: 460, signer: 'Phòng Marketing Quốc Tế'
  },
  { 
    id: 'f9', folderId: 'folder2', type: 'video', 
    name: 'TVC_Novaworld_BikiniBeach_AmThuc_Festival.mp4', 
    size: '310 MB', date: '2026-07-02', tag: 'Media TVC', 
    description: 'Video toàn cảnh lễ hội âm nhạc và ẩm thực mùa hè tại Bikini Beach 16ha quy mô 20,000 khán giả.',
    version: '1080p HD', legalStatus: 'Hiệu lực thi hành', downloadsCount: 512
  },

  // The Grand Manhattan (folder3)
  { 
    id: 'f10', folderId: 'folder3', type: 'pdf', 
    name: 'VanBan_SoXayDung_DuDieuKien_BanNha_HinhThanhTuongLai.pdf', 
    size: '5.6 MB', date: '2026-06-20', tag: 'Đủ điều kiện bán', 
    description: 'Văn bản số 5412/SXD-PTĐT của Sở Xây Dựng TP.HCM xác nhận dự án The Grand Manhattan đủ điều kiện mở bán.',
    version: 'v1.0', legalStatus: 'Hiệu lực thi hành', downloadsCount: 620, signer: 'Sở Xây Dựng TP.HCM'
  },
  { 
    id: 'f11', folderId: 'folder3', type: 'pdf', 
    name: 'ChungThu_BaoLanh_DuAn_MBBank.pdf', 
    size: '4.2 MB', date: '2026-06-22', tag: 'Bảo lãnh NH', 
    description: 'Chứng thư cam kết phát hành bảo lãnh nghĩa vụ tài chính của Chủ Đầu Tư đối với người mua nhà từ MBBank.',
    version: 'v1.1', legalStatus: 'Hiệu lực thi hành', downloadsCount: 475, signer: 'Ngân Hàng TMCP Quân Đội (MBBank)'
  },
  { 
    id: 'f12', folderId: 'folder3', type: '3d', 
    name: 'SaBan_So_3D_TheGrandManhattan_VR.glb', 
    size: '65 MB', date: '2026-07-01', tag: 'Sa bàn 3D', 
    description: 'File mô hình 3D Mesh GLB toàn tháp đôi 39 tầng căn hộ hạng sang Grand Manhattan phục vụ ứng dụng sa bàn.',
    version: 'v2.5', legalStatus: 'Đã phê duyệt', downloadsCount: 180
  },

  // The Global City (folder4)
  { 
    id: 'f13', folderId: 'folder4', type: 'pdf', 
    name: 'HoSo_KienTruc_FosterAndPartners_Masterplan.pdf', 
    size: '28.4 MB', date: '2026-05-18', tag: 'Kiến trúc', 
    description: 'Hồ sơ thiết kế ý tưởng và quy hoạch kiến trúc đại đô thị biểu tượng Đông Nam Á do Foster+Partners (Anh Quốc) thiết kế.',
    version: 'v1.0', legalStatus: 'Hiệu lực thi hành', downloadsCount: 390, signer: 'Foster + Partners London'
  },
  { 
    id: 'f14', folderId: 'folder4', type: 'pdf', 
    name: 'ThoaThuan_HopTac_TinDung_Techcombank_0Pct.pdf', 
    size: '3.9 MB', date: '2026-06-10', tag: 'Tín dụng NH', 
    description: 'Gói hỗ trợ tài chính đặc quyền từ Techcombank: Cho vay 80%, 0% lãi suất và ân hạn gốc lên đến 24 tháng.',
    version: 'v2.0', legalStatus: 'Đã phê duyệt', downloadsCount: 580, signer: 'Khối KHDN Techcombank'
  },

  // Cẩm nang đào tạo (folder6)
  { 
    id: 'f15', folderId: 'folder6', type: 'pdf', 
    name: 'KichBan_Telesale_ChotCoc_BDS_TrieuDo_2026.pdf', 
    size: '6.8 MB', date: '2026-07-01', tag: 'Đào tạo Sale', 
    description: 'Bộ kịch bản 15 tình huống xử lý từ chối kinh điển khi tư vấn bất động sản hạng sang cho giới tinh hoa.',
    version: 'v5.0', legalStatus: 'Dự thảo nội bộ', downloadsCount: 890, signer: 'Nova Academy'
  }
];

const INITIAL_CHAT_CHANNELS: ChatChannel[] = [
  { 
    id: 'c1', 
    name: 'dự-án-aqua-city', 
    unread: 2, 
    description: 'Phân phối phân khu Đảo Phượng Hoàng & Sun Harbor', 
    category: 'project', 
    membersCount: 24, 
    topic: 'Mở bán 30 căn Biệt thự song lập view sông',
    pinnedMsg: 'Bảng giá đợt 3 áp dụng chiết khấu 14% thanh toán nhanh đến hết 31/07.'
  },
  { 
    id: 'c2', 
    name: 'team-sale-quận-1', 
    unread: 0, 
    description: 'Chiến binh sàn Novaland Gallery Q1 - Chạy chỉ tiêu Q3/2026', 
    category: 'department', 
    membersCount: 18, 
    topic: 'Chạy đua nước rút chốt deal đạt 150 tỷ Quota tháng 7',
    pinnedMsg: 'Giao ban đầu ngày lúc 08:30 tại phòng họp Diamond.'
  },
  { 
    id: 'c3', 
    name: 'ban-giám-đốc', 
    unread: 0, 
    description: 'BOD & Điều hành phê duyệt cấp cao', 
    category: 'management', 
    membersCount: 6, 
    topic: 'Xét duyệt chính sách chiết khấu ngoại giao & hồ sơ thanh toán',
    pinnedMsg: 'Chỉ duyệt ngoại giao tối đa 3% cho giỏ hàng The Grand Manhattan.'
  },
  { 
    id: 'c4', 
    name: 'hỗ-trợ-pháp-lý', 
    unread: 3, 
    description: 'Thẩm định hồ sơ HĐMB, cọc & thủ tục ngân hàng bảo lãnh', 
    category: 'department', 
    membersCount: 10, 
    topic: 'Hỗ trợ thẩm định hồ sơ vay Vietcombank & MBBank 0% lãi suất',
    pinnedMsg: 'Checklist hồ sơ vay mua BĐS gồm CCCD, Sao kê lương 6 tháng và HĐ LĐ.'
  },
  { 
    id: 'c5', 
    name: 'chiến-dịch-novaworld', 
    unread: 1, 
    description: 'Mở bán phân khu Florida & PGA Golf Villas Phan Thiết', 
    category: 'project', 
    membersCount: 32, 
    topic: 'Flash deal chiết khấu 12% cho 5 booking đầu tuần',
    pinnedMsg: 'Xe bus đưa đón khách hàng trải nghiệm thực địa xuất phát lúc 7:00 sáng Thứ 7.'
  },
];

const INITIAL_CHAT_DMS: ChatDM[] = [
  // Đồng nghiệp nội bộ
  { 
    id: 'u1', 
    name: 'Thanh Hà (Marketing)', 
    avatar: 'TH', 
    online: true, 
    type: 'internal', 
    role: 'Trưởng nhóm Marketing', 
    phone: '0901 888 123', 
    unread: 0,
    lastMessage: 'Đã gửi file brochure mới nhất dự án Aqua City.', 
    lastTime: '10:15 AM',
    statusBadge: 'Chạy Ads Aqua City' 
  },
  { 
    id: 'u2', 
    name: 'Tuấn Tú (Pháp lý)', 
    avatar: 'TT', 
    online: true, 
    type: 'internal', 
    role: 'Chuyên viên Pháp chế', 
    phone: '0912 333 456', 
    unread: 1,
    lastMessage: 'Hồ sơ căn BE1-12.08 đã đủ điều kiện ký HĐMB em nhé.', 
    lastTime: '09:50 AM',
    statusBadge: 'Trực thẩm định HĐ' 
  },
  { 
    id: 'u3', 
    name: 'Giám Đốc Hùng', 
    avatar: 'GD', 
    online: false, 
    type: 'internal', 
    role: 'Giám đốc Khối Kinh Doanh', 
    phone: '0909 999 888', 
    unread: 0,
    lastMessage: 'Tháng này team Quận 1 cố gắng đạt target nhé.', 
    lastTime: 'Hôm qua',
    statusBadge: 'Họp giao ban BOD' 
  },
  { 
    id: 'u4', 
    name: 'Minh Anh (Admin Sàn)', 
    avatar: 'MA', 
    online: true, 
    type: 'internal', 
    role: 'Admin Quản trị Rổ hàng', 
    phone: '0933 111 222', 
    unread: 0,
    lastMessage: 'Vừa unlock căn TGM-15.01, em báo khách đặt cọc gấp.', 
    lastTime: '08:45 AM',
    statusBadge: 'Khóa căn online' 
  },
  { 
    id: 'u5', 
    name: 'Kế Toán Phương', 
    avatar: 'KP', 
    online: true, 
    type: 'internal', 
    role: 'Kế toán đối soát dòng tiền', 
    phone: '0944 555 666', 
    unread: 0,
    lastMessage: 'Đã khớp tiền 200tr cọc cho khách Đặng Quốc Huy.', 
    lastTime: '08:20 AM',
    statusBadge: 'Khớp tiền UNC' 
  },

  // Khách hàng Zalo OA & LiveChat Omnichannel
  { 
    id: 'z1', 
    name: 'Nguyễn Văn A (Zalo OA)', 
    avatar: 'VA', 
    online: true, 
    type: 'zalo', 
    role: 'Khách hàng VIP Diamond', 
    phone: '0903 123 456', 
    projectName: 'Aqua City', 
    leadScore: 96, 
    budget: '12 - 15 Tỷ', 
    unread: 2, 
    lastMessage: 'Báo giá căn biệt thự song lập Phoenix giúp anh nhé.', 
    lastTime: '10:24 AM', 
    statusBadge: 'Cần báo giá gấp' 
  },
  { 
    id: 'z2', 
    name: 'Trần Thị Mai (Zalo OA)', 
    avatar: 'TM', 
    online: true, 
    type: 'zalo', 
    role: 'Khách hàng VIP Gold', 
    phone: '0918 888 999', 
    projectName: 'The Grand Manhattan', 
    leadScore: 92, 
    budget: '15 - 20 Tỷ', 
    unread: 1, 
    lastMessage: 'Thứ 7 này 9h sáng bạn đón chị lên sa bàn Cô Giang nhé.', 
    lastTime: '09:45 AM', 
    statusBadge: 'Hẹn xem sa bàn' 
  },
  { 
    id: 'z3', 
    name: 'Lê Hoàng Cường (LiveChat)', 
    avatar: 'LC', 
    online: false, 
    type: 'livechat', 
    role: 'Khách hàng Web Portal', 
    phone: '0987 654 321', 
    projectName: 'The Beverly - Vinhomes', 
    leadScore: 82, 
    budget: '3 - 5 Tỷ', 
    unread: 0, 
    lastMessage: 'Chính sách vay ngân hàng 0% được ân hạn gốc bao lâu em?', 
    lastTime: 'Hôm qua', 
    statusBadge: 'Quan tâm vay' 
  },
  { 
    id: 'z4', 
    name: 'Đặng Quốc Huy (Zalo OA)', 
    avatar: 'QH', 
    online: true, 
    type: 'zalo', 
    role: 'Khách VIP đã cọc', 
    phone: '0977 889 900', 
    projectName: 'The Grand Manhattan', 
    leadScore: 98, 
    budget: '15.2 Tỷ', 
    unread: 0, 
    lastMessage: 'Anh vừa chuyển tiền cọc 200tr, em kiểm tra kế toán nhé.', 
    lastTime: '08:30 AM', 
    statusBadge: 'Chờ đối soát cọc' 
  },
];

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  // Channel c1: dự-án-aqua-city
  { 
    id: 'm1', 
    threadId: 'c1', 
    senderId: 'u1', 
    senderName: 'Thanh Hà', 
    senderAvatar: 'TH', 
    text: 'Sếp ơi, em vừa gửi Báo giá 3 căn Biệt thự Đảo Phượng Hoàng cho khách VIP xong. Em đính kèm bản PDF ở đây sếp check nhé!', 
    time: '09:15 AM', 
    isFile: true, 
    fileName: 'Bao_Gia_AquaCity_Phoenix_Island.pdf', 
    fileSize: '2.4 MB',
    msgType: 'file',
    isRead: true 
  },
  { 
    id: 'm2', 
    threadId: 'c1', 
    senderId: 'me', 
    senderName: 'Bạn', 
    text: 'Tuyệt vời! File báo giá làm rất đẹp và chi tiết. Bạn chốt luôn lịch hẹn khách lên sa bàn Novaland Gallery cuối tuần này nhé. Cần xe đưa đón cứ báo admin.', 
    time: '09:18 AM',
    msgType: 'text',
    isRead: true 
  },
  { 
    id: 'm3', 
    threadId: 'c1', 
    senderId: 'u4', 
    senderName: 'Minh Anh', 
    senderAvatar: 'MA', 
    text: 'Căn AQC-PH-102 vừa có khách trả cọc do trùng căn, admin đã unlock vào giỏ hàng chung cho cả sàn nhé!', 
    time: '10:05 AM',
    msgType: 'listing',
    listing: {
      id: 'i1',
      code: 'AQC-PH-102',
      projectName: 'Aqua City - Đảo Phượng Hoàng',
      price: '14.500.000.000 VNĐ',
      area: '220 m²',
      bedrooms: 4,
      bathrooms: 4,
      status: 'Còn trống',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      direction: 'Đông Nam view sông',
      commission: 'Hoa hồng 3.0% (435 Triệu)'
    },
    isRead: true
  },
  { 
    id: 'm4', 
    threadId: 'c1', 
    senderId: 'u1', 
    senderName: 'Thanh Hà', 
    senderAvatar: 'TH', 
    text: 'Dạ vâng căn này đẹp nhất dãy ven sông, để em gửi cho anh Nguyễn Văn A bên Zalo OA liền!', 
    time: '10:08 AM',
    msgType: 'text',
    isRead: false 
  },

  // Channel c4: hỗ-trợ-pháp-lý
  {
    id: 'm4_1',
    threadId: 'c4',
    senderId: 'u2',
    senderName: 'Tuấn Tú',
    senderAvatar: 'TT',
    text: 'Thông báo: Ngân hàng Vietcombank chi nhánh Đông Sài Gòn vừa cập nhật gói lãi suất ưu đãi 5.5% cố định 24 tháng cho khách mua The Grand Manhattan & Aqua City.',
    time: '08:30 AM',
    isFile: true,
    fileName: 'Chinh_Sach_Uu_Dai_Lai_Suat_VCB_T7.pdf',
    fileSize: '1.9 MB',
    msgType: 'file',
    isRead: true
  },
  {
    id: 'm4_2',
    threadId: 'c4',
    senderId: 'me',
    senderName: 'Bạn',
    text: 'Cảm ơn anh Tú! Gói này khách cọc căn 2PN The Grand Manhattan có được áp dụng ân hạn nợ gốc 24 tháng luôn không anh?',
    time: '08:42 AM',
    msgType: 'text',
    isRead: true
  },
  {
    id: 'm4_3',
    threadId: 'c4',
    senderId: 'u2',
    senderName: 'Tuấn Tú',
    senderAvatar: 'TT',
    text: 'Được em nhé! Ân hạn gốc 24 tháng hoặc đến khi nhận bàn giao nhà, miễn phí trả nợ trước hạn từ năm thứ 3.',
    time: '08:50 AM',
    msgType: 'text',
    isRead: true
  },

  // DM u1: Thanh Hà
  { 
    id: 'm10', 
    threadId: 'u1', 
    senderId: 'u1', 
    senderName: 'Thanh Hà', 
    senderAvatar: 'TH', 
    text: 'Anh Tuấn Tú ơi, chiến dịch Facebook Ads Aqua City tuần này lead về chất lượng lắm, có 4 khách nét muốn xem sa bàn Thứ 7 này.', 
    time: '09:30 AM', 
    msgType: 'text',
    isRead: true 
  },
  { 
    id: 'm11', 
    threadId: 'u1', 
    senderId: 'me', 
    senderName: 'Bạn', 
    text: 'Ok Hà, anh đang chuẩn bị kịch bản sa bàn với bảng chiết khấu 14% rồi. Cứ book phòng VIP tiếp khách tầng 2 nhé.', 
    time: '09:35 AM', 
    msgType: 'text',
    isRead: true 
  },
  { 
    id: 'm12', 
    threadId: 'u1', 
    senderId: 'u1', 
    senderName: 'Thanh Hà', 
    senderAvatar: 'TH', 
    text: 'Em vừa gửi thêm file tổng hợp số lượng đăng ký tham dự lễ mở bán, anh xem qua nhé!', 
    time: '10:15 AM', 
    isFile: true,
    fileName: 'Danh_Sach_Khach_Mo_Ban_T7.xlsx',
    fileSize: '850 KB',
    msgType: 'file',
    isRead: true 
  },

  // DM u2: Tuấn Tú (Pháp lý)
  { 
    id: 'm20', 
    threadId: 'u2', 
    senderId: 'me', 
    senderName: 'Bạn', 
    text: 'Chào anh Tú, nhờ anh thẩm định gấp phụ lục thanh toán đợt 3 của khách căn TGM-15.01 giúp em với.', 
    time: '09:10 AM', 
    msgType: 'text',
    isRead: true 
  },
  { 
    id: 'm21', 
    threadId: 'u2', 
    senderId: 'u2', 
    senderName: 'Tuấn Tú', 
    senderAvatar: 'TT', 
    text: 'Anh xem rồi nhé, điều khoản thanh toán giãn tiến độ 18 tháng hoàn toàn hợp lệ theo chính sách của CĐT Novaland. Hồ sơ căn BE1-12.08 đã đủ điều kiện ký HĐMB em nhé.', 
    time: '09:50 AM', 
    isFile: true,
    fileName: 'Bien_Ban_Tham_Dinh_Phap_Ly_TGM.pdf',
    fileSize: '3.1 MB',
    msgType: 'file',
    isRead: false 
  },

  // DM u3: Giám Đốc Hùng
  { 
    id: 'm30', 
    threadId: 'u3', 
    senderId: 'u3', 
    senderName: 'Giám Đốc Hùng', 
    senderAvatar: 'GD', 
    text: 'Tháng này team Quận 1 cố gắng đạt target 150 tỷ nhé. Có ca nào cần hỗ trợ cơ chế ngoại giao cứ nhắn trực tiếp anh duyệt nhanh.', 
    time: 'Hôm qua 16:40', 
    msgType: 'text',
    isRead: true 
  },
  { 
    id: 'm31', 
    threadId: 'u3', 
    senderId: 'me', 
    senderName: 'Bạn', 
    text: 'Dạ vâng anh, hiện team đang theo sát 2 căn biệt thự biển Novaworld và 3 căn Aqua City, tuần này quyết tâm chốt ít nhất 3 cọc ạ!', 
    time: 'Hôm qua 17:05', 
    msgType: 'text',
    isRead: true 
  },

  // Customer Zalo OA z1: Nguyễn Văn A
  { 
    id: 'm40', 
    threadId: 'z1', 
    senderId: 'system', 
    senderName: 'Hệ thống Zalo OA', 
    text: 'Khách hàng Nguyễn Văn A vừa bấm quan tâm Zalo Official Account từ chiến dịch Facebook Ads Aqua City.', 
    time: '10:00 AM', 
    msgType: 'system' 
  },
  { 
    id: 'm41', 
    threadId: 'z1', 
    senderId: 'customer', 
    senderName: 'Nguyễn Văn A', 
    senderAvatar: 'VA', 
    text: 'Chào em, anh đang tìm hiểu căn Biệt thự song lập bên Đảo Phượng Hoàng Aqua City. Em tư vấn giúp anh căn nào tầm 12 đến 15 tỷ view thoáng nhé?', 
    time: '10:05 AM', 
    msgType: 'text',
    isRead: true 
  },
  { 
    id: 'm42', 
    threadId: 'z1', 
    senderId: 'me', 
    senderName: 'Chuyên viên Lê Hoàng Anh', 
    text: 'Dạ em chào anh An ạ! Em là Hoàng Anh phụ trách dòng sản phẩm Biệt thự Aqua City. Hiện tại phân khu Phoenix Island vừa unlock 1 căn hoa hậu cực đẹp đúng tầm tài chính của anh:', 
    time: '10:12 AM', 
    msgType: 'text',
    isRead: true 
  },
  { 
    id: 'm43', 
    threadId: 'z1', 
    senderId: 'me', 
    senderName: 'Chuyên viên Lê Hoàng Anh', 
    text: 'Em gửi anh thông tin chi tiết căn AQC-PH-102 view sông trực diện, hướng Đông Nam mát mẻ cả ngày:', 
    time: '10:14 AM', 
    msgType: 'listing',
    listing: {
      id: 'i1',
      code: 'AQC-PH-102',
      projectName: 'Aqua City - Đảo Phượng Hoàng',
      price: '14.500.000.000 VNĐ',
      area: '220 m²',
      bedrooms: 4,
      bathrooms: 4,
      status: 'Còn trống',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      direction: 'Đông Nam view sông',
      commission: 'Chiết khấu sớm 14%'
    },
    isRead: true 
  },
  { 
    id: 'm44', 
    threadId: 'z1', 
    senderId: 'customer', 
    senderName: 'Nguyễn Văn A', 
    senderAvatar: 'VA', 
    text: 'Căn này nhìn đẹp đấy em. Em gửi bảng tính dòng tiền thanh toán và chính sách chiết khấu 14% cụ thể qua đây giúp anh nhé.', 
    time: '10:24 AM', 
    msgType: 'text',
    isRead: false 
  },

  // Customer Zalo OA z2: Trần Thị Mai
  { 
    id: 'm50', 
    threadId: 'z2', 
    senderId: 'customer', 
    senderName: 'Trần Thị Mai', 
    senderAvatar: 'TM', 
    text: 'Em ơi, chị đã nhận được bản vẽ mặt bằng căn 2PN The Grand Manhattan rồi nhé.', 
    time: '09:20 AM', 
    msgType: 'text',
    isRead: true 
  },
  { 
    id: 'm51', 
    threadId: 'z2', 
    senderId: 'me', 
    senderName: 'Chuyên viên Lê Hoàng Anh', 
    text: 'Dạ chị Mai ơi, căn TGM-15.01 này view trọn vẹn công viên 23/9 và Quận 1 lung linh về đêm. Thứ 7 này chị có tiện ghé sa bàn Novaland Gallery 65 Nguyễn Du để trải nghiệm thực tế không chị?', 
    time: '09:30 AM', 
    msgType: 'text',
    isRead: true 
  },
  { 
    id: 'm52', 
    threadId: 'z2', 
    senderId: 'customer', 
    senderName: 'Trần Thị Mai', 
    senderAvatar: 'TM', 
    text: 'Thứ 7 này 9h sáng bạn đón chị lên sa bàn Cô Giang nhé. Đi cùng chồng chị nên chuẩn bị thêm hợp đồng mẫu để anh xem luôn.', 
    time: '09:45 AM', 
    msgType: 'text',
    isRead: false 
  },

  // Customer Zalo OA z4: Đặng Quốc Huy
  { 
    id: 'm60', 
    threadId: 'z4', 
    senderId: 'customer', 
    senderName: 'Đặng Quốc Huy', 
    senderAvatar: 'QH', 
    text: 'Anh vừa chuyển tiền cọc 200tr vào tài khoản Novaland rồi, em kiểm tra kế toán xác nhận giúp anh nhé.', 
    time: '08:25 AM', 
    isFile: true,
    fileName: 'UNC_Coc_200tr_VCB.jpg',
    fileSize: '1.5 MB',
    msgType: 'file',
    isRead: true 
  },
  { 
    id: 'm61', 
    threadId: 'z4', 
    senderId: 'me', 
    senderName: 'Chuyên viên Lê Hoàng Anh', 
    text: 'Dạ em cảm ơn anh Huy! Em đã nhận được ảnh UNC, kế toán Phương vừa khớp lệnh thành công. Em xin gửi anh Phiếu Giữ Chỗ Điện Tử có đóng dấu đỏ của CĐT ạ!', 
    time: '08:30 AM', 
    msgType: 'text',
    isRead: true 
  }
];

const INITIAL_WORKFLOWS: WorkflowItem[] = [
  { id: 1, name: 'Nhắc Nợ Tự Động (Trước 3 Ngày)', type: 'payment', active: true, runs: 1245 },
  { id: 2, name: 'Chia Lead Mới Tự Động (Round-Robin)', type: 'lead', active: true, runs: 8520 },
  { id: 3, name: 'Chúc Mừng Sinh Nhật Khách Hàng', type: 'marketing', active: true, runs: 430 },
  { id: 4, name: 'Khách Bỏ Rơi 7 Ngày -> Báo Quản Lý', type: 'care', active: false, runs: 120 },
  { id: 5, name: 'Booking Thành Công -> Đẩy Sang Hợp Đồng', type: 'deal', active: true, runs: 85 },
];

const INITIAL_SYNC_QUEUE: SyncTask[] = [
  { 
    id: 17189001, 
    task: 'Chữ ký HĐ Cọc #HD-928', 
    time: '09:15', 
    type: 'signature', 
    status: 'pending', 
    retryCount: 0, 
    customerName: 'Nguyễn Văn Tuấn', 
    propertyCode: 'AQC-PH-102', 
    locationName: 'Showroom Đảo Phượng Hoàng',
    payload: 'Căn AQC-PH-102 | Đặt cọc 200.000.000 VNĐ | Hash: e3b0c44298fc1c149afbf4c8996fb924' 
  },
  { 
    id: 17189002, 
    task: 'GPS Check-in Nhà Mẫu Florida', 
    time: '09:28', 
    type: 'gps', 
    status: 'pending', 
    retryCount: 0, 
    locationName: 'NovaWorld Phan Thiết (Phân khu Florida 1)',
    payload: 'Tọa độ: 10.8231 N, 106.6297 E | Bán kính hợp lệ: 12m' 
  },
  { 
    id: 17189003, 
    task: 'eKYC Quét CCCD Khách VVIP', 
    time: '09:42', 
    type: 'kyc', 
    status: 'pending', 
    retryCount: 0, 
    customerName: 'Trần Thị Bích Ngọc', 
    payload: 'CCCD số 079198002931 | Thường trú: TP.Thủ Đức, TP.HCM' 
  }
];

const INITIAL_MOBILE_NOTIFICATIONS: MobileNotification[] = [
  { 
    id: 1, 
    title: '🔥 Bung Hàng Gấp: 5 Căn Biệt Thự Góc Aqua City!', 
    message: 'Chủ đầu tư vừa mở khóa 5 căn góc Phoenix South view sông Đồng Nai, anh em chốt ngay khách VIP nhé!', 
    time: '09:05', 
    type: 'urgent',
    targetAudience: 'Toàn bộ Sales Chiến Binh',
    read: false
  },
  { 
    id: 2, 
    title: '💰 Thưởng Nóng: 50 Triệu Đồng Căn Sky Villa!', 
    message: 'Chiến binh nào chốt thành công căn hộ Sky Villa The Grand Manhattan trong hôm nay nhận thưởng nóng ngay.', 
    time: '09:30', 
    type: 'reward',
    targetAudience: 'Team Novaland Quận 1',
    read: true
  },
  { 
    id: 3, 
    title: '📢 Lịch Xe Limousine Tham Quan Thực Địa', 
    message: 'Xe Limousine VIP đưa đón đoàn khách tham quan NovaWorld Phan Thiết xuất phát lúc 14:00 tại 65 Nguyễn Du.', 
    time: '10:00', 
    type: 'event',
    targetAudience: 'Toàn bộ sàn',
    read: true
  }
];

const INITIAL_INTEGRATION_APPS: IntegrationApp[] = [
  {
    id: 'zalo',
    name: 'Zalo Cloud & ZNS',
    category: 'communication',
    iconName: 'MessageCircle',
    desc: 'Gửi tin nhắn ZNS xác nhận booking, nhắc lịch đóng tiền tự động qua Zalo OA với tỷ lệ mở 98%.',
    connected: true,
    lastSync: '10 phút trước',
    requestCount24h: 18420,
    endpoint: 'https://openapi.zalo.me/v3.0/oa/message/template',
    apiKey: 'zns_live_sec_8921a998bce',
    latencyMs: 112,
    provider: 'VNG Corporation'
  },
  {
    id: 'misa',
    name: 'Kế Toán MISA AMIS',
    category: 'finance',
    iconName: 'Briefcase',
    desc: 'Tự động hạch toán phiếu thu cọc, hợp đồng mua bán và tính toán hoa hồng phân phối môi giới F1/F2.',
    connected: true,
    lastSync: '5 phút trước',
    requestCount24h: 4520,
    endpoint: 'https://api.amis.misa.vn/v1/accounting/vouchers',
    apiKey: 'misa_prod_key_77192a88ef',
    latencyMs: 165,
    provider: 'MISA Joint Stock Company'
  },
  {
    id: 'fast',
    name: 'FAST Accounting ERP',
    category: 'finance',
    iconName: 'Layers',
    desc: 'Xuất hóa đơn điện tử E-Invoice chuẩn Thông tư 78/2021/TT-BTC và đồng bộ công nợ khách hàng.',
    connected: false,
    lastSync: 'Chưa kết nối',
    requestCount24h: 0,
    endpoint: 'https://api.fast.com.vn/v2/invoice',
    apiKey: '',
    latencyMs: 190,
    provider: 'FAST Software Company'
  },
  {
    id: 'sap',
    name: 'SAP S/4HANA ERP',
    category: 'finance',
    iconName: 'Server',
    desc: 'Hệ thống quản trị nguồn lực tổng thể cấp Tập Đoàn, kiểm soát kế hoạch dòng tiền các phân khu BĐS.',
    connected: false,
    lastSync: 'Chưa kết nối',
    requestCount24h: 0,
    endpoint: 'https://sap-gateway.novaland.com.vn/sap/opu/odata',
    apiKey: '',
    latencyMs: 240,
    provider: 'SAP SE Enterprise'
  },
  {
    id: 'vietqr',
    name: 'Cổng VietQR PRO & NAPAS',
    category: 'payment',
    iconName: 'QrCode',
    desc: 'Tạo mã VietQR động gạch nợ tự động 24/7 tức thì qua IPN Webhook khi khách hàng chuyển tiền cọc.',
    connected: true,
    lastSync: 'Vừa xong',
    requestCount24h: 6890,
    endpoint: 'https://api.vietqr.io/v2/generate',
    apiKey: 'vietqr_live_token_44921b9',
    latencyMs: 85,
    provider: 'VietQR / NAPAS 247'
  },
  {
    id: 'vnpay',
    name: 'Cổng Thanh Toán VNPay',
    category: 'payment',
    iconName: 'CreditCard',
    desc: 'Quẹt thẻ thanh toán POS và cổng thanh toán trực tuyến cho khách hàng nộp tiền booking tại Event.',
    connected: true,
    lastSync: '25 phút trước',
    requestCount24h: 3210,
    endpoint: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    apiKey: 'vnpay_tmn_code_882910',
    latencyMs: 95,
    provider: 'VNPAY Vietnam'
  },
  {
    id: 'momo',
    name: 'Ví Điện Tử MoMo Business',
    category: 'payment',
    iconName: 'CreditCard',
    desc: 'Hỗ trợ thanh toán tiện ích, giữ chỗ đặt cọc BĐS qua mã QR đa năng MoMo Merchant.',
    connected: false,
    lastSync: 'Chưa kết nối',
    requestCount24h: 0,
    endpoint: 'https://payment.momo.vn/v2/gateway/api/create',
    apiKey: '',
    latencyMs: 110,
    provider: 'M-Service Joint Stock Co'
  },
  {
    id: 'vnpt_ekyc',
    name: 'VNPT eKYC Định Danh Số',
    category: 'legal',
    iconName: 'ShieldCheck',
    desc: 'Xác thực sinh trắc học khuôn mặt và bóc tách OCR thông tin thẻ CCCD gắn chip của khách hàng mua nhà.',
    connected: true,
    lastSync: '15 phút trước',
    requestCount24h: 1450,
    endpoint: 'https://api.idcheck.vnpt.vn/v1/card-reader',
    apiKey: 'vnpt_ekyc_token_55129c8',
    latencyMs: 180,
    provider: 'VNPT Information Technology'
  },
  {
    id: 'vnpt_smartca',
    name: 'VNPT SmartCA Ký Số Từ Xa',
    category: 'legal',
    iconName: 'PenTool',
    desc: 'Tích hợp chữ ký số từ xa có chứng thư số pháp lý, ký kết Hợp Đồng Mua Bán điện tử hợp chuẩn.',
    connected: true,
    lastSync: '1 giờ trước',
    requestCount24h: 890,
    endpoint: 'https://smartca-api.vnpt.vn/v1/signing',
    apiKey: 'smartca_client_id_9921',
    latencyMs: 210,
    provider: 'VNPT SmartCA'
  },
  {
    id: 'voip',
    name: 'Tổng Đài Ảo Stringee PBX',
    category: 'communication',
    iconName: 'Phone',
    desc: 'Click-to-Call trực tiếp từ CRM, ghi âm cuộc gọi tư vấn và tự động phân tích Speech-to-Text bằng AI.',
    connected: true,
    lastSync: 'Vừa xong',
    requestCount24h: 12850,
    endpoint: 'https://api.stringee.com/v1/call/outbound',
    apiKey: 'stringee_key_sec_110294',
    latencyMs: 75,
    provider: 'Stringee Communication'
  },
  {
    id: 'gmaps',
    name: 'Google Maps & Places API',
    category: 'utilities',
    iconName: 'MapPin',
    desc: 'Định vị GPS thực địa, tính toán khoảng cách hạ tầng liên vùng và hiển thị tiện ích ngoại khu dự án.',
    connected: true,
    lastSync: '40 phút trước',
    requestCount24h: 8920,
    endpoint: 'https://maps.googleapis.com/maps/api/distancematrix/json',
    apiKey: 'AIzaSyA889102-gmaps-prod',
    latencyMs: 65,
    provider: 'Google Cloud Platform'
  },
  {
    id: 'gdrive',
    name: 'Google Workspace & Drive',
    category: 'utilities',
    iconName: 'HardDrive',
    desc: 'Tự động tạo thư mục lưu trữ hồ sơ khách hàng, phân quyền xem bản vẽ CAD và hồ sơ pháp lý 1/500.',
    connected: false,
    lastSync: 'Chưa kết nối',
    requestCount24h: 0,
    endpoint: 'https://www.googleapis.com/drive/v3/files',
    apiKey: '',
    latencyMs: 140,
    provider: 'Google Cloud Platform'
  }
];

const INITIAL_WEBHOOKS: WebhookItem[] = [
  {
    id: 'wh-1',
    name: 'Lead Khách Hàng Mới (Inbound Lead)',
    event: 'lead.created',
    targetUrl: 'https://api.marketing.novaland.com.vn/hooks/lead-inbound',
    active: true,
    successRate: 99.9,
    lastTriggered: '2 phút trước',
    deliveriesCount: 1240,
    secretKey: 'whsec_99182a88bc'
  },
  {
    id: 'wh-2',
    name: 'Đặt Cọc Giữ Chỗ (Booking Deposited)',
    event: 'booking.deposited',
    targetUrl: 'https://accounting.novaland.com.vn/misa/sync-deposit',
    active: true,
    successRate: 99.8,
    lastTriggered: '18 phút trước',
    deliveriesCount: 480,
    secretKey: 'whsec_441209b88e'
  },
  {
    id: 'wh-3',
    name: 'Ký Hợp Đồng Mua Bán (Contract Signed)',
    event: 'contract.signed',
    targetUrl: 'https://legal.novaland.com.vn/smartca/contract-event',
    active: true,
    successRate: 100.0,
    lastTriggered: '1 giờ trước',
    deliveriesCount: 215,
    secretKey: 'whsec_110294cc77'
  },
  {
    id: 'wh-4',
    name: 'Gạch Nợ Tự Động VietQR IPN',
    event: 'payment.vietqr_ipn',
    targetUrl: 'https://crm.novaland.com.vn/api/v1/payments/vietqr/ipn',
    active: true,
    successRate: 100.0,
    lastTriggered: '5 phút trước',
    deliveriesCount: 3420,
    secretKey: 'whsec_vietqr_napas_247'
  },
  {
    id: 'wh-5',
    name: 'Xác Thực Định Danh eKYC (KYC Verified)',
    event: 'kyc.verified',
    targetUrl: 'https://ekyc.novaland.com.vn/audit/sync',
    active: true,
    successRate: 99.5,
    lastTriggered: '35 phút trước',
    deliveriesCount: 890,
    secretKey: 'whsec_ekyc_audit_99'
  },
  {
    id: 'wh-6',
    name: 'Khóa Căn Khẩn Cấp Thực Địa (Unit Locked)',
    event: 'property.emergency_locked',
    targetUrl: 'https://inventory.novaland.com.vn/realtime/broadcast',
    active: true,
    successRate: 100.0,
    lastTriggered: '12 phút trước',
    deliveriesCount: 610,
    secretKey: 'whsec_unit_lock_fast'
  }
];

const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: 'key-1',
    name: 'Khóa Master Production Backend',
    prefix: 'nova_live_sec_88f2',
    keyMasked: 'nova_live_sec_88f2****************************99a1',
    permissions: 'admin',
    ipWhitelist: '14.161.22.88, 103.20.10.45',
    createdAt: '2026-01-10',
    expiresAt: '2027-01-10',
    status: 'active'
  },
  {
    id: 'key-2',
    name: 'Khóa Tích Hợp Kế Toán MISA ERP',
    prefix: 'nova_live_sec_44b1',
    keyMasked: 'nova_live_sec_44b1****************************11e2',
    permissions: 'read_write',
    ipWhitelist: '118.69.182.20',
    createdAt: '2026-03-15',
    expiresAt: '2026-12-31',
    status: 'active'
  },
  {
    id: 'key-3',
    name: 'Khóa Tích Hợp Web Landing Pages',
    prefix: 'nova_pub_key_99d4',
    keyMasked: 'nova_pub_key_99d4****************************77c3',
    permissions: 'read',
    ipWhitelist: 'Any (*)',
    createdAt: '2026-04-01',
    expiresAt: 'Không thời hạn',
    status: 'active'
  },
  {
    id: 'key-4',
    name: 'Khóa Thử Nghiệm Sandbox Staging',
    prefix: 'nova_test_sec_11a3',
    keyMasked: 'nova_test_sec_11a3****************************33d4',
    permissions: 'admin',
    ipWhitelist: '127.0.0.1, 192.168.1.0/24',
    createdAt: '2026-05-20',
    expiresAt: '2026-08-20',
    status: 'active'
  }
];

const INITIAL_API_AUDIT_LOGS: ApiAuditLog[] = [
  {
    id: 'log-101',
    timestamp: '10:35:12',
    method: 'POST',
    endpoint: '/api/v1/payments/vietqr/ipn',
    service: 'VietQR NAPAS',
    ip: '118.69.182.10',
    statusCode: 200,
    latencyMs: 82,
    payloadSnippet: '{"refNo": "TX-9921", "amount": 200000000, "status": "SUCCESS"}'
  },
  {
    id: 'log-102',
    timestamp: '10:32:45',
    method: 'POST',
    endpoint: '/api/v1/leads/inbound',
    service: 'Facebook Ads Webhook',
    ip: '31.13.127.1',
    statusCode: 201,
    latencyMs: 115,
    payloadSnippet: '{"leadId": "fb_88291", "name": "Đặng Minh Tâm", "phone": "0909112233"}'
  },
  {
    id: 'log-103',
    timestamp: '10:28:10',
    method: 'GET',
    endpoint: '/api/v1/inventory/available',
    service: 'MISA AMIS Sync',
    ip: '118.69.182.20',
    statusCode: 200,
    latencyMs: 145,
    payloadSnippet: '{"filter": "status=Trong", "limit": 50}'
  },
  {
    id: 'log-104',
    timestamp: '10:22:05',
    method: 'POST',
    endpoint: '/api/v1/zalo/zns/send',
    service: 'Zalo Cloud OA',
    ip: '120.72.119.5',
    statusCode: 200,
    latencyMs: 98,
    payloadSnippet: '{"templateId": "ZNS_DEPOSIT_CONFIRM", "phone": "84901234567"}'
  },
  {
    id: 'log-105',
    timestamp: '10:15:30',
    method: 'POST',
    endpoint: '/api/v1/contracts/sign/ekyc',
    service: 'VNPT eKYC Gateway',
    ip: '113.161.72.3',
    statusCode: 200,
    latencyMs: 195,
    payloadSnippet: '{"idCard": "079198002931", "liveness": 0.99, "matchScore": 98.5}'
  },
  {
    id: 'log-106',
    timestamp: '09:58:14',
    method: 'GET',
    endpoint: '/api/v1/reports/commission',
    service: 'External Affiliate F1',
    ip: '14.161.22.99',
    statusCode: 401,
    latencyMs: 45,
    payloadSnippet: '{"error": "Unauthorized: API Key expired"}'
  },
  {
    id: 'log-107',
    timestamp: '09:45:00',
    method: 'POST',
    endpoint: '/api/v1/inventory/lock',
    service: 'Nova Field Mobile PWA',
    ip: '171.244.15.8',
    statusCode: 200,
    latencyMs: 65,
    payloadSnippet: '{"unitCode": "AQC-PH-102", "duration": 900, "agent": "Tuấn Tú"}'
  },
  {
    id: 'log-108',
    timestamp: '09:30:22',
    method: 'PUT',
    endpoint: '/api/v1/customers/c1/preferences',
    service: 'Novaland Web Portal',
    ip: '27.72.60.14',
    statusCode: 200,
    latencyMs: 120,
    payloadSnippet: '{"favoriteProject": "The Grand Manhattan", "budget": "20B"}'
  }
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

const INITIAL_REFERRAL_LEADS: ReferralLead[] = [
  { 
    id: 'ref-1', 
    name: 'Lê Viết Dũng', 
    phone: '0901 888 123', 
    email: 'dung.le@vietcapital.vn',
    date: '2026-07-19', 
    status: 'Đã giải ngân', 
    projectId: 'p2', 
    projectName: 'Aqua City', 
    propertyCode: 'AQC-DL-02',
    dealValue: 5000000000, 
    commissionRate: 1.5, 
    commissionAmount: 75000000, 
    payStatus: 'Đã thanh toán',
    affiliateCode: 'TUANTU99',
    assignedAgent: 'Trần Thanh Hà',
    notes: 'Khách hàng VIP mua biệt thự ven sông'
  },
  { 
    id: 'ref-2', 
    name: 'Nguyễn Thị Hoa', 
    phone: '0988 555 456', 
    email: 'hoa.nguyen@vinachem.com',
    date: '2026-07-15', 
    status: 'Đã đặt cọc', 
    projectId: 'p2', 
    projectName: 'Aqua City', 
    propertyCode: 'AQC-RP-045',
    dealValue: 5000000000, 
    commissionRate: 1.5, 
    commissionAmount: 75000000, 
    payStatus: 'Chờ giải ngân',
    affiliateCode: 'TUANTU99',
    assignedAgent: 'Trần Thanh Hà',
    notes: 'Đã nộp cọc 100tr, đang thẩm định hồ sơ vay MBBank'
  },
  { 
    id: 'ref-3', 
    name: 'Trần Văn Mạnh', 
    phone: '0933 222 789', 
    email: 'manh.tran@techgroup.vn',
    date: '2026-07-12', 
    status: 'Đang tư vấn', 
    projectId: 'p4', 
    projectName: 'The Beverly - Vinhomes Grand Park', 
    propertyCode: 'BE1-05.01',
    dealValue: 3300000000, 
    commissionRate: 1.5, 
    commissionAmount: 49500000, 
    payStatus: 'Chưa phát sinh',
    affiliateCode: 'TUANTU99',
    assignedAgent: 'Lê Hoàng Anh',
    notes: 'Đã xem căn hộ mẫu 360, hẹn T7 xem thực địa'
  },
  { 
    id: 'ref-4', 
    name: 'Phạm Minh Tuấn', 
    phone: '0912 333 345', 
    email: 'tuan.pham@fpt.com',
    date: '2026-07-10', 
    status: 'Đã giải ngân', 
    projectId: 'p1', 
    projectName: 'NovaWorld Phan Thiet', 
    propertyCode: 'NVW-FL-102',
    dealValue: 8000000000, 
    commissionRate: 1.5, 
    commissionAmount: 120000000, 
    payStatus: 'Đã thanh toán',
    affiliateCode: 'TUANTU99',
    assignedAgent: 'Nguyễn Tuấn Tú',
    notes: 'Shophouse mặt biển, thanh toán nhanh 95%'
  },
  { 
    id: 'ref-5', 
    name: 'Hoàng Tú Anh', 
    phone: '0945 777 678', 
    email: 'tuanh.hoang@gmail.com',
    date: '2026-07-08', 
    status: 'Đang tư vấn', 
    projectId: 'p2', 
    projectName: 'Aqua City', 
    propertyCode: 'AQC-NV-01',
    dealValue: 5000000000, 
    commissionRate: 1.5, 
    commissionAmount: 75000000, 
    payStatus: 'Chưa phát sinh',
    affiliateCode: 'TUANTU99',
    assignedAgent: 'Trần Thanh Hà',
    notes: 'Đang so sánh với SwanBay'
  },
  { 
    id: 'ref-6', 
    name: 'Đặng Thùy Trâm', 
    phone: '0977 444 890', 
    email: 'tram.dang@ssi.com.vn',
    date: '2026-07-05', 
    status: 'Đã giải ngân', 
    projectId: 'p4', 
    projectName: 'The Beverly - Vinhomes Grand Park', 
    propertyCode: 'BE1-12.08',
    dealValue: 3350000000, 
    commissionRate: 1.5, 
    commissionAmount: 50250000, 
    payStatus: 'Đã thanh toán',
    affiliateCode: 'TUANTU99',
    assignedAgent: 'Lê Hoàng Anh',
    notes: 'Khách đầu tư căn 2PN view công viên'
  },
  { 
    id: 'ref-7', 
    name: 'Vũ Đức Hải', 
    phone: '0966 999 222', 
    email: 'hai.vu@honda.vn',
    date: '2026-07-01', 
    status: 'Đã đặt cọc', 
    projectId: 'p5', 
    projectName: 'The Global City', 
    propertyCode: 'TGC-SH05',
    dealValue: 35000000000, 
    commissionRate: 1.2, 
    commissionAmount: 420000000, 
    payStatus: 'Chờ giải ngân',
    affiliateCode: 'TUANTU99',
    assignedAgent: 'Lê Hoàng Anh',
    notes: 'Nhà phố Soho khu kênh đào nhạc nước'
  }
];

const INITIAL_COMMISSION_PAYOUTS: CommissionPayout[] = [
  {
    id: 'po-1',
    amount: 120000000,
    date: '2026-07-12',
    bankName: 'Vietcombank',
    accountNumber: '0071001234567',
    accountHolder: 'NGUYEN TUAN TU',
    status: 'Đã chi trả',
    referenceCode: 'UNC-VCB-77210',
    note: 'Chi trả hoa hồng deal Shophouse NVW-FL-102 (Phạm Minh Tuấn)'
  },
  {
    id: 'po-2',
    amount: 125000000,
    date: '2026-07-20',
    bankName: 'Vietcombank',
    accountNumber: '0071001234567',
    accountHolder: 'NGUYEN TUAN TU',
    status: 'Đã chi trả',
    referenceCode: 'UNC-VCB-88341',
    note: 'Chi trả hoa hồng deal Aqua City (Lê Viết Dũng) & The Beverly (Đặng Thùy Trâm)'
  },
  {
    id: 'po-3',
    amount: 75000000,
    date: '2026-07-28',
    bankName: 'Vietcombank',
    accountNumber: '0071001234567',
    accountHolder: 'NGUYEN TUAN TU',
    status: 'Đang xử lý',
    referenceCode: 'REQ-PO-99120',
    note: 'Yêu cầu rút hoa hồng đợt cuối tháng 7'
  }
];

const INITIAL_MARKETPLACE_LISTINGS: MarketplaceListing[] = [
  { 
    id: 'm1', 
    title: 'Penthouse Aqua City - Đảo Phượng Hoàng Phoenix', 
    price: '45 Tỷ', 
    priceNumeric: 45000000000, 
    commSplit: '50/50', 
    f2Commission: '1.5%', 
    f2CommissionRate: 1.5, 
    type: 'Bán', 
    propertyCategory: 'Căn hộ', 
    location: 'Biên Hòa, Đồng Nai', 
    district: 'Đồng Nai', 
    ownerAgency: 'Khải Hoàn Land (F1)', 
    ownerAvatar: 'KH', 
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    verified: true,
    legalStatus: 'HĐMB',
    area: 380,
    bedrooms: 4,
    bathrooms: 4,
    handoverStandard: 'Hoàn thiện cao cấp nhập khẩu Ý',
    distributedByMe: true,
    description: 'Penthouse tầng cao nhất phân khu Đảo Phượng Hoàng, view trực diện sông Đồng Nai 360 độ, có hồ bơi riêng.',
    phone: '0909 111 222'
  },
  { 
    id: 'm2', 
    title: 'Biệt Thự Đơn Lập The Global City - Khu Kênh Đào', 
    price: '72 Tỷ', 
    priceNumeric: 72000000000, 
    commSplit: '40/60', 
    f2Commission: '1.2%', 
    f2CommissionRate: 1.2, 
    type: 'Bán', 
    propertyCategory: 'Biệt thự', 
    location: 'An Phú, TP. Thủ Đức', 
    district: 'TP. Thủ Đức', 
    ownerAgency: 'Masterise Master Agent', 
    ownerAvatar: 'MS', 
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    verified: true,
    legalStatus: 'HĐMB',
    area: 450,
    bedrooms: 5,
    bathrooms: 6,
    handoverStandard: 'Xây thô hoàn thiện mặt ngoài chuẩn Foster+Partners',
    distributedByMe: false,
    description: 'Biệt thự siêu VIP trục đường kênh đào nhạc nước lớn nhất Đông Nam Á, vị trí kinh doanh và hưởng thụ đắc địa.',
    phone: '0912 333 444'
  },
  { 
    id: 'm3', 
    title: 'Shophouse Sala Đại Quang Minh - Mặt Tiền Mai Chí Thọ', 
    price: '120 Tr/Tháng', 
    priceNumeric: 120000000, 
    commSplit: '50/50', 
    f2Commission: '0.5 Tháng', 
    f2CommissionRate: 0.5, 
    type: 'Cho Thuê', 
    propertyCategory: 'Shophouse', 
    location: 'Thủ Thiêm, TP. Thủ Đức', 
    district: 'TP. Thủ Đức', 
    ownerAgency: 'Savills Vietnam', 
    ownerAvatar: 'SV', 
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    verified: true,
    legalStatus: 'Sổ hồng lâu dài',
    area: 168,
    bedrooms: 4,
    handoverStandard: 'Full nội thất văn phòng cao cấp',
    distributedByMe: true,
    description: 'Vị trí đắc địa trục đại lộ Mai Chí Thọ, thích hợp mở ngân hàng, showroom nội thất hoặc trụ sở công ty.',
    phone: '0933 555 777'
  },
  { 
    id: 'm4', 
    title: 'Căn Hộ 3PN Góc The Beverly - Vinhomes Grand Park', 
    price: '5.2 Tỷ', 
    priceNumeric: 5200000000, 
    commSplit: '50/50', 
    f2Commission: '1.5%', 
    f2CommissionRate: 1.5, 
    type: 'Bán', 
    propertyCategory: 'Căn hộ', 
    location: 'Long Thạnh Mỹ, TP. Thủ Đức', 
    district: 'TP. Thủ Đức', 
    ownerAgency: 'SmartLand', 
    ownerAvatar: 'SL', 
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    verified: true,
    legalStatus: 'HĐMB',
    area: 95,
    bedrooms: 3,
    bathrooms: 2,
    handoverStandard: 'Hoàn thiện cơ bản liền tường Kohler',
    distributedByMe: false,
    description: 'Căn góc tầng đẹp view trực diện công viên Ánh Sáng 36ha và VinWonders, hỗ trợ vay 80% ân hạn nợ gốc.',
    phone: '0988 777 666'
  },
  { 
    id: 'm5', 
    title: 'Nhà Phố Thương Mại Soho - The Global City', 
    price: '42 Tỷ', 
    priceNumeric: 42000000000, 
    commSplit: '30/70', 
    f2Commission: '1.2%', 
    f2CommissionRate: 1.2, 
    type: 'Bán', 
    propertyCategory: 'Nhà phố', 
    location: 'An Phú, TP. Thủ Đức', 
    district: 'TP. Thủ Đức', 
    ownerAgency: 'Rever Đông Sài Gòn', 
    ownerAvatar: 'RV', 
    image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80',
    verified: true,
    legalStatus: 'HĐMB',
    area: 95,
    bedrooms: 4,
    bathrooms: 5,
    handoverStandard: 'Xây dựng 1 trệt 4 lầu có hố chờ thang máy',
    distributedByMe: false,
    description: 'Dãy LK2 đã cất nóc, bàn giao quý 4/2026, tiềm năng khai thác kinh doanh ẩm thực cao cấp F&B và văn phòng sáng tạo.',
    phone: '0977 444 333'
  },
  { 
    id: 'm6', 
    title: 'Biệt Thự Sân Golf PGA NovaWorld Phan Thiết', 
    price: '28 Tỷ', 
    priceNumeric: 28000000000, 
    commSplit: '50/50', 
    f2Commission: '1.5%', 
    f2CommissionRate: 1.5, 
    type: 'Bán', 
    propertyCategory: 'Biệt thự', 
    location: 'Tiến Thành, Phan Thiết', 
    district: 'Phan Thiết', 
    ownerAgency: 'Novaland Sàn Chính', 
    ownerAvatar: 'NV', 
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    verified: true,
    legalStatus: 'HĐMB',
    area: 320,
    bedrooms: 4,
    bathrooms: 4,
    handoverStandard: 'Full nội thất phong cách Địa Trung Hải',
    distributedByMe: true,
    description: 'Biệt thự đồi view sân golf chuẩn PGA độc quyền, tặng thẻ golf trọn đời và gói cam kết cho thuê 80 triệu/tháng.',
    phone: '0945 666 888'
  },
  { 
    id: 'm7', 
    title: 'Căn Hộ Duplex Masteri Thảo Điền Đã Có Sổ Hồng', 
    price: '18 Tỷ', 
    priceNumeric: 18000000000, 
    commSplit: '50/50', 
    f2Commission: '1.5%', 
    f2CommissionRate: 1.5, 
    type: 'Bán', 
    propertyCategory: 'Căn hộ', 
    location: 'Thảo Điền, TP. Thủ Đức', 
    district: 'TP. Thủ Đức', 
    ownerAgency: 'IQI Việt Nam', 
    ownerAvatar: 'IQ', 
    image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    verified: true,
    legalStatus: 'Sổ hồng lâu dài',
    area: 175,
    bedrooms: 3,
    bathrooms: 3,
    handoverStandard: 'Nội thất nhập khẩu cao cấp',
    distributedByMe: false,
    description: 'Duplex thông tầng trần cao 6m, view ngắm trọn sông Sài Gòn và Landmark 81, chủ nhà thiện chí để lại toàn bộ decor.',
    phone: '0966 222 111'
  },
  { 
    id: 'm8', 
    title: 'Dinh Thự Grand Manhattan Quận 1 - Sky Mansion', 
    price: '120 Tỷ', 
    priceNumeric: 120000000000, 
    commSplit: '60/40', 
    f2Commission: '2.0%', 
    f2CommissionRate: 2.0, 
    type: 'Bán', 
    propertyCategory: 'Dinh thự', 
    location: 'Cô Giang, Quận 1', 
    district: 'Quận 1', 
    ownerAgency: 'ERA Vietnam', 
    ownerAvatar: 'ER', 
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    verified: true,
    legalStatus: 'HĐMB',
    area: 520,
    bedrooms: 5,
    bathrooms: 6,
    handoverStandard: 'Bàn giao thô có thang máy riêng',
    distributedByMe: false,
    description: 'Suất ngoại giao độc bản tầng thượng, view toàn cảnh trung tâm tài chính Bến Thành - Ba Son, tặng chỗ đỗ xe định danh.',
    phone: '0901 999 888'
  }
];

const INITIAL_AGENCY_PARTNERS: AgencyPartner[] = [
  { id: 'ap1', name: 'Sàn Giao Dịch BĐS Khải Hoàn Land', tier: 'F1 Master Partner', rating: 4.9, deals: 124, logo: 'KH', phone: '0903 123 456', email: 'b2b@khaihoanland.vn', address: 'Quận 7, TP.HCM', verified: true, activeListingsCount: 45 },
  { id: 'ap2', name: 'Đại Lý Rever Đông Sài Gòn', tier: 'F2 Affiliate Agency', rating: 4.8, deals: 85, logo: 'RV', phone: '0918 789 012', email: 'partner@rever.vn', address: 'TP. Thủ Đức', verified: true, activeListingsCount: 32 },
  { id: 'ap3', name: 'SmartLand Bất Động Sản', tier: 'F1 Master Partner', rating: 4.7, deals: 210, logo: 'SL', phone: '0909 345 678', email: 'lienket@smartland.vn', address: 'Bình Thạnh, TP.HCM', verified: true, activeListingsCount: 68 },
  { id: 'ap4', name: 'Savills Vietnam B2B Co-brokering', tier: 'Global Partner', rating: 5.0, deals: 500, logo: 'SV', phone: '028 3823 9200', email: 'agency@savills.com.vn', address: 'Quận 1, TP.HCM', verified: true, activeListingsCount: 95 },
  { id: 'ap5', name: 'ERA Vietnam Real Estate', tier: 'Global Partner', rating: 4.8, deals: 350, logo: 'ER', phone: '0902 456 789', email: 'network@eravn.vn', address: 'Quận 2, TP.HCM', verified: true, activeListingsCount: 80 },
  { id: 'ap6', name: 'Đất Xanh Miền Nam Master Agency', tier: 'F1 Master Partner', rating: 4.7, deals: 450, logo: 'DX', phone: '0938 111 222', email: 'f1@datxanhmiennam.com.vn', address: 'Bình Thạnh, TP.HCM', verified: true, activeListingsCount: 110 },
  { id: 'ap7', name: 'IQI Global Vietnam Branch', tier: 'Global Partner', rating: 4.9, deals: 410, logo: 'IQ', phone: '0969 888 777', email: 'vietnam@iqiglobal.com', address: 'Quận 1, TP.HCM', verified: true, activeListingsCount: 75 },
  { id: 'ap8', name: 'Phú Hoàng Land', tier: 'F2 Affiliate Agency', rating: 4.4, deals: 110, logo: 'PH', phone: '0944 555 666', email: 'sales@phuhoangland.vn', address: 'Quận 3, TP.HCM', verified: true, activeListingsCount: 28 }
];

const INITIAL_LEADERBOARD_AGENTS: LeaderboardAgent[] = [
  { rank: 1, id: 'ag-1', name: 'Nguyễn Trần Tuấn Tú', avatar: 'TT', team: 'Sàn Novaland Gallery Q1', revenue: 25500000000, revenueDisplay: '25.5 Tỷ', dealsCount: 6, exp: 98500, level: 28, title: 'Chiến Thần Chốt Cọc', trend: 'up', streakWeeks: 5, mvp: true },
  { rank: 2, id: 'ag-2', name: 'Lê Hoàng Anh', avatar: 'LA', team: 'Sàn Masterise Thủ Đức', revenue: 21000000000, revenueDisplay: '21.0 Tỷ', dealsCount: 5, exp: 82400, level: 26, title: 'Đại Sứ Penthouse', trend: 'up', streakWeeks: 4 },
  { rank: 3, id: 'ag-3', name: 'Phạm Thị Mai', avatar: 'PM', team: 'Sàn Aqua City Đồng Nai', revenue: 18500000000, revenueDisplay: '18.5 Tỷ', dealsCount: 4, exp: 75100, level: 25, title: 'Thợ Săn Biệt Thự Biển', trend: 'down', streakWeeks: 3 },
  { rank: 4, id: 'ag-4', name: 'Trần Văn Đạt', avatar: 'TD', team: 'Sàn Novaland Gallery Q1', revenue: 15200000000, revenueDisplay: '15.2 Tỷ', dealsCount: 3, exp: 64200, level: 23, title: 'Chiến Binh Quả Cảm', trend: 'up', streakWeeks: 2 },
  { rank: 5, id: 'ag-5', name: 'Hoàng Ngọc Ánh', avatar: 'HA', team: 'Sàn Masterise Thủ Đức', revenue: 12800000000, revenueDisplay: '12.8 Tỷ', dealsCount: 3, exp: 61000, level: 22, title: 'Chuyên Viên Tinh Anh', trend: 'down', streakWeeks: 1 },
  { rank: 6, id: 'ag-6', name: 'Đỗ Văn Cường', avatar: 'DC', team: 'Sàn Aqua City Đồng Nai', revenue: 10500000000, revenueDisplay: '10.5 Tỷ', dealsCount: 2, exp: 58000, level: 20, title: 'Bậc Thầy Đàm Phán', trend: 'up', streakWeeks: 2 },
  { rank: 7, id: 'ag-7', name: 'Vũ Thanh Hằng', avatar: 'VH', team: 'Sàn Novaland Gallery Q1', revenue: 9200000000, revenueDisplay: '9.2 Tỷ', dealsCount: 2, exp: 54300, level: 19, title: 'Chiến Tướng Sa Bàn', trend: 'down', streakWeeks: 0 },
  { rank: 8, id: 'ag-8', name: 'Phan Minh Khôi', avatar: 'PK', team: 'Sàn Masterise Thủ Đức', revenue: 8000000000, revenueDisplay: '8.0 Tỷ', dealsCount: 2, exp: 51200, level: 18, title: 'Ngôi Sao Triển Vọng', trend: 'up', streakWeeks: 1 },
  { rank: 9, id: 'ag-9', name: 'Lý Tiểu Long', avatar: 'LL', team: 'Sàn Aqua City Đồng Nai', revenue: 7500000000, revenueDisplay: '7.5 Tỷ', dealsCount: 1, exp: 48900, level: 17, title: 'Tân Binh Xuất Sắc', trend: 'down', streakWeeks: 0 },
  { rank: 10, id: 'ag-10', name: 'Đinh Tuấn Tài', avatar: 'DT', team: 'Sàn Novaland Gallery Q1', revenue: 5400000000, revenueDisplay: '5.4 Tỷ', dealsCount: 1, exp: 45000, level: 16, title: 'Tia Chớp Chốt Cọc', trend: 'up', streakWeeks: 1 }
];

const INITIAL_GAMIFICATION_QUESTS: GamificationQuest[] = [
  { id: 1, title: 'Sát Thủ Cuộc Gọi', desc: 'Thực hiện 50 cuộc gọi Outbound telesale tư vấn dự án', current: 45, max: 50, exp: 500, category: 'weekly', rewardClaimed: false, iconName: 'PhoneCall' },
  { id: 2, title: 'Người Dẫn Đường', desc: 'Dẫn 5 lượt khách hàng đi tham quan trải nghiệm sa bàn VIP', current: 4, max: 5, exp: 1000, category: 'weekly', rewardClaimed: false, iconName: 'Compass' },
  { id: 3, title: 'Khai Hỏa Mở Hàng', desc: 'Chốt thành công 1 Booking/Cọc căn hộ trong tuần', current: 1, max: 1, exp: 5000, category: 'weekly', rewardClaimed: true, iconName: 'Flame' },
  { id: 4, title: 'Bậc Thầy Chăm Khách', desc: 'Gửi 15 Báo giá kèm bảng tính chiết khấu thanh toán nhanh', current: 15, max: 15, exp: 800, category: 'daily', rewardClaimed: false, iconName: 'Send' },
  { id: 5, title: 'Chiến Dịch Săn Boss', desc: 'Đội nhóm chốt 10 Căn Aqua City trong tuần để mở rương Boss 50 triệu', current: 7, max: 10, exp: 10000, category: 'special', rewardClaimed: false, iconName: 'Crown' }
];

const INITIAL_GAMIFICATION_BADGES: GamificationBadge[] = [
  { id: 1, name: 'First Blood', desc: 'Chốt thành công giao dịch đầu tiên tại công ty', category: 'deal', color: 'bg-rose-500', unlocked: true, unlockedDate: '15/01/2026', bonusExp: 1000, rarity: 'Phổ biến' },
  { id: 2, name: 'Sharpshooter', desc: 'Tỷ lệ chốt deal trên 25% tổng số leads phụ trách', category: 'skill', color: 'bg-indigo-500', unlocked: true, unlockedDate: '20/03/2026', bonusExp: 2500, rarity: 'Hiếm' },
  { id: 3, name: 'Whale Hunter', desc: 'Chốt thành công biệt thự hoặc dinh thự trên 30 Tỷ', category: 'deal', color: 'bg-amber-500', unlocked: true, unlockedDate: '02/06/2026', bonusExp: 5000, rarity: 'Sử thi' },
  { id: 4, name: 'Centurion', desc: 'Thực hiện tích lũy trên 1,000 cuộc gọi kết nối thành công', category: 'activity', color: 'bg-emerald-500', unlocked: true, unlockedDate: '10/05/2026', bonusExp: 1500, rarity: 'Phổ biến' },
  { id: 5, name: 'MVP Tháng', desc: 'Đạt Quán quân Doanh số cao nhất sàn trong tháng', category: 'glory', color: 'bg-yellow-400', unlocked: true, unlockedDate: '30/06/2026', bonusExp: 10000, rarity: 'Huyền thoại' },
  { id: 6, name: 'Sa Bàn Master', desc: 'Đón tiếp và thuyết minh cho 50 lượt khách xem sa bàn', category: 'activity', color: 'bg-blue-500', unlocked: true, unlockedDate: '18/07/2026', bonusExp: 2000, rarity: 'Hiếm' },
  { id: 7, name: 'King of Q1', desc: 'Chốt 5 căn The Grand Manhattan lõi trung tâm Quận 1', category: 'project', color: 'bg-purple-600', unlocked: false, bonusExp: 8000, rarity: 'Sử thi' },
  { id: 8, name: 'Million Dollar', desc: 'Tích lũy doanh số giao dịch cá nhân vượt mốc 100 Tỷ', category: 'glory', color: 'bg-gradient-to-r from-amber-400 to-yellow-600', unlocked: false, bonusExp: 20000, rarity: 'Huyền thoại' }
];

const INITIAL_REWARD_ITEMS: RewardItem[] = [
  { id: 'rw-1', title: 'Gói 50 Hot Leads Độc Quyền VIP', costExp: 2500, category: 'leads', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80', description: 'Leads chất lượng cao đã qua sàng lọc ngân sách > 10 tỷ từ phòng Marketing', quantityRemaining: 15 },
  { id: 'rw-2', title: 'Voucher Nghỉ Dưỡng 3N2Đ Centara Mirage', costExp: 5000, category: 'vacation', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=400&q=80', description: 'Nghỉ dưỡng tiêu chuẩn 5 sao tại NovaWorld Phan Thiết dành cho 2 người', quantityRemaining: 8 },
  { id: 'rw-3', title: 'iPad Pro 13 inch M4 Khắc Tên', costExp: 15000, category: 'gadget', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80', description: 'Trang bị công nghệ tối tân phục vụ thuyết trình sa bàn và hợp đồng điện tử', quantityRemaining: 3 },
  { id: 'rw-4', title: 'Thưởng Nóng 10.000.000 VNĐ Tiền Mặt', costExp: 20000, category: 'cash', image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80', description: 'Chuyển khoản trực tiếp vào tài khoản hoa hồng ngay sau khi phê duyệt', quantityRemaining: 10 },
  { id: 'rw-5', title: 'Thẻ VIP CLB Golf PGA Ocean 1 Năm', costExp: 35000, category: 'membership', image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&w=400&q=80', description: 'Đặc quyền giao lưu kết nối mạng lưới khách hàng tinh hoa tại sân golf 36 hố', quantityRemaining: 2 },
  { id: 'rw-6', title: 'Chuyến Du Lịch Thuỵ Sĩ 8N7Đ Mùa Thu', costExp: 50000, category: 'vacation', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80', description: 'Trải nghiệm thiên đường kiến trúc và học hỏi các mô hình bất động sản thế giới', quantityRemaining: 1 }
];

const INITIAL_SAVED_MORTGAGE_SIMULATIONS: MortgageSimulation[] = [
  {
    id: 'SIM-001',
    customerId: 'c1',
    customerName: 'Nguyễn Văn Tuấn',
    propertyCode: 'AQC-PH-102',
    propertyValue: 14500000000,
    loanPercent: 70,
    loanAmount: 10150000000,
    loanTermYears: 25,
    bankId: 'mbb',
    bankName: 'MBBank',
    repaymentMethod: 'reducing',
    enableGracePeriod: true,
    graceMonths: 24,
    monthlyIncome: 180000000,
    dtiRatio: 26.5,
    totalInterest: 11245000000,
    firstMonthlyPayment: 47680000,
    createdAt: '2026-07-19 14:30'
  },
  {
    id: 'SIM-002',
    customerId: 'c6',
    customerName: 'Đặng Quốc Huy',
    propertyCode: 'TGM-15.01',
    propertyValue: 15200000000,
    loanPercent: 70,
    loanAmount: 10640000000,
    loanTermYears: 20,
    bankId: 'vcb',
    bankName: 'Vietcombank',
    repaymentMethod: 'reducing',
    enableGracePeriod: true,
    graceMonths: 12,
    monthlyIncome: 250000000,
    dtiRatio: 24.8,
    totalInterest: 9480000000,
    firstMonthlyPayment: 62050000,
    createdAt: '2026-07-20 09:15'
  },
  {
    id: 'SIM-003',
    customerId: 'c3',
    customerName: 'Lê Hoàng Cường',
    propertyCode: 'BE1-12.08',
    propertyValue: 3350000000,
    loanPercent: 70,
    loanAmount: 2345000000,
    loanTermYears: 25,
    bankId: 'vpb',
    bankName: 'VPBank',
    repaymentMethod: 'linear',
    enableGracePeriod: true,
    graceMonths: 18,
    monthlyIncome: 65000000,
    dtiRatio: 30.2,
    totalInterest: 2650000000,
    firstMonthlyPayment: 19650000,
    createdAt: '2026-07-18 16:45'
  }
];

const INITIAL_PORTFOLIO_PROPERTIES: PortfolioProperty[] = [
  {
    id: 'port-1',
    code: 'NVW-01.01',
    title: 'Biệt Thự Đơn Lập View Biển Trực Diện',
    projectName: 'NovaWorld Phan Thiet',
    projectId: 'p1',
    customerId: 'c1',
    customerName: 'Nguyễn Văn Tuấn',
    customerPhone: '0901234567',
    propertyType: 'Biệt thự biển',
    area: 250,
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Đông Nam',
    view: 'Trực diện biển & Hồ bơi riêng',
    buyPrice: 25000000000,
    currentValuation: 31500000000,
    purchaseDate: '2023-12-01',
    handoverDate: '2025-01-15',
    constructionProgress: 100,
    constructionStatus: 'Đã bàn giao',
    rentalStatus: 'Đang cho thuê',
    monthlyRent: 65000000,
    tenantName: 'Centara Mirage Resort (Ủy thác)',
    leaseEndDate: '2027-01-15',
    annualNetRental: 702000000,
    contractCode: 'HD-921',
    legalStatus: 'HĐMB công chứng',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    aiRecommendation: 'Tiếp tục giữ tích sản',
    aiScore: 94,
    nextMilestone: {
      batch: 'Đợt 6 (Cuối) - Nhận Giấy Chứng Nhận Quyền Sở Hữu (Sổ Hồng)',
      percentage: 5,
      amount: 1250000000,
      dueDate: '2026-11-30',
      status: 'pending',
      accountBank: 'Vietcombank - CN TP.HCM',
      accountNumber: '0071009988776',
      accountName: 'CONG TY CP TAP DOAN NOVALAND',
      transferSyntax: 'NVW-01.01 - NGUYEN VAN TUAN - DOT 6 SO HONG',
      description: 'Thanh toán 5% giá trị hợp đồng khi bàn giao sổ hồng chính thức'
    }
  },
  {
    id: 'port-2',
    code: 'AQC-12A.01',
    title: 'Nhà Phố Thương Mại Đảo Phượng Hoàng Ven Sông',
    projectName: 'Aqua City',
    projectId: 'p2',
    customerId: 'c1',
    customerName: 'Nguyễn Văn Tuấn',
    customerPhone: '0901234567',
    propertyType: 'Nhà phố',
    area: 160,
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Đông Nam',
    view: 'Sông Đồng Nai & Đường dạo bộ ven sông',
    buyPrice: 12500000000,
    currentValuation: 15800000000,
    purchaseDate: '2024-04-12',
    handoverDate: '2024-11-15',
    constructionProgress: 100,
    constructionStatus: 'Đã có sổ hồng',
    rentalStatus: 'Đang cho thuê',
    monthlyRent: 42000000,
    tenantName: 'Công ty CP Kiến Trúc Palm Archi',
    leaseEndDate: '2026-12-31',
    annualNetRental: 453600000,
    contractCode: 'HD-925',
    legalStatus: 'Sổ hồng lâu dài',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    aiRecommendation: 'Tối ưu hóa giá thuê',
    aiScore: 89
  },
  {
    id: 'port-3',
    code: 'TGM-28.01',
    title: 'Sky Villa Penthouse Tháp Manhattan Lõi Quận 1',
    projectName: 'The Grand Manhattan',
    projectId: 'p3',
    customerId: 'c4',
    customerName: 'Phạm Minh Tuấn',
    customerPhone: '0912987654',
    propertyType: 'Căn hộ Sky Villa',
    area: 145,
    bedrooms: 3,
    bathrooms: 3,
    direction: 'Đông Nam',
    view: 'Toàn cảnh Sông Sài Gòn, Bitexco & Bến Nhà Rồng',
    buyPrice: 32000000000,
    currentValuation: 39500000000,
    purchaseDate: '2024-03-20',
    handoverDate: '2026-10-30',
    constructionProgress: 90,
    constructionStatus: 'Đã cất nóc',
    rentalStatus: 'Chờ nhận nhà',
    monthlyRent: 110000000,
    annualNetRental: 1188000000,
    contractCode: 'HD-924',
    legalStatus: 'HĐMB công chứng',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    aiRecommendation: 'Chốt lời tái đầu tư',
    aiScore: 96,
    nextMilestone: {
      batch: 'Đợt 5 - Thông Báo Nhận Bàn Giao Căn Hộ & Chìa Khóa VIP',
      percentage: 15,
      amount: 4800000000,
      dueDate: '2026-10-15',
      status: 'pending',
      accountBank: 'MBBank - CN Sở Giao Dịch',
      accountNumber: '111999888666',
      accountName: 'CONG TY CP PHAT TRIEN DAT VIET',
      transferSyntax: 'TGM-28.01 - PHAM MINH TUAN - DOT 5 BAN GIAO',
      description: 'Thanh toán đợt nhận bàn giao căn hộ Sky Villa và gói nội thất tiêu chuẩn quốc tế'
    }
  },
  {
    id: 'port-4',
    code: 'TGC-SH05',
    title: 'Nhà Phố Thương Mại Soho Trung Tâm Sôi Động',
    projectName: 'The Global City',
    projectId: 'p5',
    customerId: 'c4',
    customerName: 'Phạm Minh Tuấn',
    customerPhone: '0912987654',
    propertyType: 'Nhà phố Soho',
    area: 95,
    bedrooms: 4,
    bathrooms: 5,
    direction: 'Đông Nam',
    view: 'Kênh đào Nhạc nước lớn nhất Đông Nam Á',
    buyPrice: 35000000000,
    currentValuation: 42000000000,
    purchaseDate: '2024-05-08',
    handoverDate: '2026-12-15',
    constructionProgress: 75,
    constructionStatus: 'Đang xây thô',
    rentalStatus: 'Chờ nhận nhà',
    monthlyRent: 95000000,
    annualNetRental: 1026000000,
    contractCode: 'DC-926',
    legalStatus: 'HĐ Đặt cọc',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    aiRecommendation: 'Tiếp tục giữ tích sản',
    aiScore: 92,
    nextMilestone: {
      batch: 'Đợt 3 - Cất Nóc Phân Khu Soho & Ký HĐMB Chính Thức',
      percentage: 20,
      amount: 7000000000,
      dueDate: '2026-11-10',
      status: 'pending',
      accountBank: 'Techcombank - CN Hội Sở',
      accountNumber: '190333888555',
      accountName: 'CONG TY CP MASTERISE HOMES',
      transferSyntax: 'TGC-SH05 - PHAM MINH TUAN - DOT 3 CAT NOC',
      description: 'Thanh toán đủ 50% để ký Hợp Đồng Mua Bán chính thức'
    }
  },
  {
    id: 'port-5',
    code: 'BE1-05.01',
    title: 'Căn Hộ 3PN Góc The Beverly View Công Viên 36ha',
    projectName: 'Vinhomes Grand Park',
    projectId: 'p4',
    customerId: 'c2',
    customerName: 'Trần Thị Bích Ngọc',
    customerPhone: '0912345678',
    propertyType: 'Căn hộ',
    area: 95,
    bedrooms: 3,
    bathrooms: 2,
    direction: 'Đông Nam',
    view: 'Trực diện Công viên Ánh sáng 36ha & VinWonders',
    buyPrice: 5500000000,
    currentValuation: 6800000000,
    purchaseDate: '2024-01-15',
    handoverDate: '2024-12-20',
    constructionProgress: 100,
    constructionStatus: 'Đã bàn giao',
    rentalStatus: 'Đang cho thuê',
    monthlyRent: 22000000,
    tenantName: 'Gia đình chuyên gia kỹ thuật cao Intel',
    leaseEndDate: '2026-11-30',
    annualNetRental: 237600000,
    contractCode: 'DC-922',
    legalStatus: 'HĐ Đặt cọc',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    aiRecommendation: 'Tiếp tục giữ tích sản',
    aiScore: 88
  },
  {
    id: 'port-6',
    code: 'AQC-15C.04',
    title: 'Biệt Thự Song Lập River Park View Bến Du Thuyền',
    projectName: 'Aqua City',
    projectId: 'p2',
    customerId: 'c7',
    customerName: 'Vũ Thu Trang',
    customerPhone: '0966554433',
    propertyType: 'Biệt thự song lập',
    area: 200,
    bedrooms: 4,
    bathrooms: 4,
    direction: 'Đông Nam',
    view: 'Bến du thuyền Aqua Marina 5 sao',
    buyPrice: 19500000000,
    currentValuation: 24200000000,
    purchaseDate: '2024-04-18',
    handoverDate: '2025-02-28',
    constructionProgress: 100,
    constructionStatus: 'Đã có sổ hồng',
    rentalStatus: 'Tự khai thác',
    monthlyRent: 55000000,
    annualNetRental: 594000000,
    contractCode: 'HD-925',
    legalStatus: 'Sổ hồng lâu dài',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    aiRecommendation: 'Cơ cấu danh mục',
    aiScore: 85
  }
];

interface AppState extends AppDatabase {
  // Actions for Documents & Sales Kit Vault
  addDocumentFile: (file: Omit<DocumentFile, 'id'>) => void;
  deleteDocumentFile: (id: string) => void;
  incrementDocumentDownload: (id: string) => void;

  // Actions for Wealth & Portfolio Management
  addPortfolioProperty: (property: Omit<PortfolioProperty, 'id'>) => void;
  updatePortfolioProperty: (id: string, updates: Partial<PortfolioProperty>) => void;
  deletePortfolioProperty: (id: string) => void;
  payPortfolioMilestone: (id: string) => void;

  // Actions for Projects
  addProject: (project: Omit<Project, 'id'>) => void;

  // Actions for Customers
  addCustomer: (customer: Omit<Customer, 'id' | 'code' | 'createdAt'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  
  // Actions for Inventory
  updateInventoryStatus: (id: string, status: InventoryItem['status'], customerId?: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  
  // Actions for Booking Workflow
  bookingTickets: BookingTicket[];
  addBookingTicket: (ticket: Omit<BookingTicket, 'id' | 'code' | 'createdAt'>) => void;
  updateBookingTicketStatus: (id: string, nextStatus: BookingTicket['status'], note?: string, actor?: string) => void;
  rejectBookingTicket: (id: string, reason?: string, actor?: string) => void;
  extendBookingSLA: (id: string, minutes: number, reason?: string) => void;

  // Actions for Contracts
  addContract: (contract: Omit<Contract, 'id' | 'code' | 'date'>) => void;
  updateContractStatus: (id: string, status: Contract['status']) => void;
  recordContractPayment: (contractId: string, installmentNumber: number, paidAmount?: number, invoiceRef?: string) => void;
  
  // Actions for Surveys
  addReview: (review: Omit<Review, 'id' | 'date' | 'sentiment'> & { sentiment?: Review['sentiment'] }) => void;
  resolveComplaint: (id: string, notes: string, staffName: string) => void;
  addSurveyCampaign: (campaign: Omit<SurveyCampaign, 'id' | 'responses' | 'conversion'>) => void;
  toggleSurveyCampaignStatus: (id: string) => void;
  
  // Actions for Loyalty
  redeemVoucher: (voucherId: string) => void;
  earnLoyaltyPoints: (points: number, title: string, referenceCode?: string, customerId?: string, customerName?: string) => void;
  addVoucher: (voucher: Voucher) => void;
  setLoyaltyPoints: (points: number) => void;
  
  // Actions for Events
  addCheckin: (eventId: string, ticketCode: string, guestName?: string, isVip?: boolean, table?: string, seat?: string, assignedAgent?: string) => void;
  addEvent: (event: Omit<EventItem, 'id'>) => void;
  
  // Actions for Call Center
  makeCall: (phone: string, customerName?: string, projectName?: string) => void;
  updateCallDisposition: (id: string, disposition: string, notes?: string) => void;
  
  // Actions for Tasks
  addTask: (title: string, assignee: string) => void;
  updateTaskStatus: (taskId: string, status: TaskItem['status']) => void;
  
  // Actions for Chat
  sendMessage: (
    threadId: string, 
    text: string, 
    options?: { 
      isFile?: boolean; 
      fileName?: string; 
      fileSize?: string; 
      msgType?: 'text' | 'file' | 'listing' | 'quick_reply' | 'system'; 
      listing?: ListingCardData 
    }
  ) => void;
  addChatChannel: (channel: { name: string; description?: string; category?: 'project' | 'department' | 'management'; topic?: string }) => void;
  markThreadRead: (threadId: string) => void;
  simulateCustomerReply: (threadId: string, text?: string) => void;
  
  // Actions for Workflows
  toggleWorkflow: (id: number) => void;
  runWorkflow: (id: number) => void;
  
  // Actions for Mobile Hub
  addSyncTask: (taskName: string, type?: SyncTask['type'], payload?: string, meta?: Partial<SyncTask>) => void;
  removeSyncTask: (id: number) => void;
  clearSyncQueue: () => void;
  sendMobileNotification: (title: string, message: string, type?: MobileNotification['type'], targetAudience?: string) => void;
  markNotificationAsRead: (id: number) => void;
  
  // Actions for AI Knowledge
  addKnowledgeFile: (file: KnowledgeFile) => void;
  updateKnowledgeFileStatus: (id: number, status: KnowledgeFile['status']) => void;
  addAIChatMessage: (message: Omit<AIChatMessage, 'id'>) => void;

  // Actions for BI & Analytics
  refreshHeatmapData: () => void;

  // Actions for Marketing Campaigns
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaignStatus: (id: string, status: Campaign['status']) => void;
  addLeadToCampaign: (campaignId: string, leadCount?: number) => void;

  // Actions for CMS & Articles
  addArticle: (article: Omit<Article, 'id'>) => void;
  updateArticle: (id: string, data: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  addLandingPage: (page: Omit<LandingPage, 'id'>) => void;
  toggleLandingPageStatus: (id: string) => void;

  // Actions for Referral & Affiliate
  addReferralLead: (lead: Omit<ReferralLead, 'id'>) => void;
  updateReferralLeadStatus: (id: string, status: ReferralLead['status'], payStatus: ReferralLead['payStatus']) => void;
  requestCommissionPayout: (amount: number, bankName: string, accountNumber: string, accountHolder: string, note?: string) => void;

  // Actions for Marketplace B2B
  addMarketplaceListing: (listing: Omit<MarketplaceListing, 'id'>) => void;
  requestDistributionRights: (listingId: string, agencyName?: string, representative?: string, note?: string) => void;
  toggleDistributeListing: (listingId: string) => void;

  // Actions for Gamification & Sales Arena
  claimQuestReward: (questId: number) => void;
  redeemReward: (rewardId: string) => void;
  sendKudos: (agentId: string, message: string) => void;
  createChallenge: (opponentId: string, goal: string, betExp: number) => void;
  checkinDailyExp: () => void;

  // Actions for Mortgage & Financial Calculations
  saveMortgageSimulation: (sim: Omit<MortgageSimulation, 'id' | 'createdAt'>) => void;
  deleteMortgageSimulation: (id: string) => void;

  // Actions for Integrations & Developer Hub
  integrationApps: IntegrationApp[];
  webhooks: WebhookItem[];
  apiKeys: ApiKeyItem[];
  apiAuditLogs: ApiAuditLog[];
  toggleIntegrationConnection: (id: string) => void;
  updateIntegrationConfig: (id: string, endpoint: string, apiKey: string) => void;
  addApiKey: (key: Omit<ApiKeyItem, 'id' | 'createdAt'>) => void;
  revokeApiKey: (id: string) => void;
  toggleWebhookStatus: (id: string) => void;
  addIntegrationApp: (app: Omit<IntegrationApp, 'id'>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      customers: INITIAL_CUSTOMERS,
      projects: INITIAL_PROJECTS,
      inventory: INITIAL_INVENTORY,
      contracts: INITIAL_CONTRACTS,
      bookingTickets: INITIAL_BOOKING_TICKETS,
      campaigns: INITIAL_CAMPAIGNS,
      articles: INITIAL_ARTICLES,
      landingPages: INITIAL_LANDING_PAGES,
      reviews: INITIAL_REVIEWS,
      surveyCampaigns: INITIAL_SURVEY_CAMPAIGNS,
      vouchers: INITIAL_VOUCHERS,
      referralLeads: INITIAL_REFERRAL_LEADS,
      commissionPayouts: INITIAL_COMMISSION_PAYOUTS,
      marketplaceListings: INITIAL_MARKETPLACE_LISTINGS,
      agencyPartners: INITIAL_AGENCY_PARTNERS,
      gamificationAgents: INITIAL_LEADERBOARD_AGENTS,
      gamificationQuests: INITIAL_GAMIFICATION_QUESTS,
      gamificationBadges: INITIAL_GAMIFICATION_BADGES,
      gamificationRewards: INITIAL_REWARD_ITEMS,
      currentUserExp: 98500,
      currentUserLevel: 28,
      savedMortgageSimulations: INITIAL_SAVED_MORTGAGE_SIMULATIONS,
      portfolioProperties: INITIAL_PORTFOLIO_PROPERTIES,
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
      syncQueue: INITIAL_SYNC_QUEUE,
      mobileNotifications: INITIAL_MOBILE_NOTIFICATIONS,
      integrationApps: INITIAL_INTEGRATION_APPS,
      webhooks: INITIAL_WEBHOOKS,
      apiKeys: INITIAL_API_KEYS,
      apiAuditLogs: INITIAL_API_AUDIT_LOGS,
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

      refreshHeatmapData: () => set(() => ({
        biHeatmapData: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => 
          ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'].map(hour => ({
            day, 
            hour, 
            value: Math.floor(Math.random() * 85) + 15
          }))
        ).flat()
      })),

      addCampaign: (data) => set((state) => {
        const nextId = `c${state.campaigns.length + 1}`;
        const newCampaign: Campaign = {
          ...data,
          id: nextId
        };
        return { campaigns: [newCampaign, ...state.campaigns] };
      }),

      updateCampaignStatus: (id, status) => set((state) => ({
        campaigns: state.campaigns.map(c => c.id === id ? { ...c, status } : c)
      })),

      addLeadToCampaign: (campaignId, leadCount = 1) => set((state) => ({
        campaigns: state.campaigns.map(c => c.id === campaignId ? { ...c, leads: c.leads + leadCount } : c)
      })),

      addArticle: (data) => set((state) => {
        const nextId = `a${state.articles.length + 1}`;
        const newArticle: Article = {
          ...data,
          id: nextId
        };
        return { articles: [newArticle, ...state.articles] };
      }),

      updateArticle: (id, data) => set((state) => ({
        articles: state.articles.map(a => a.id === id ? { ...a, ...data } : a)
      })),

      deleteArticle: (id) => set((state) => ({
        articles: state.articles.filter(a => a.id !== id)
      })),

      addLandingPage: (data) => set((state) => {
        const nextId = `lp${state.landingPages.length + 1}`;
        const newPage: LandingPage = {
          ...data,
          id: nextId
        };
        return { landingPages: [newPage, ...state.landingPages] };
      }),

      toggleLandingPageStatus: (id) => set((state) => ({
        landingPages: state.landingPages.map(lp => lp.id === id ? { ...lp, status: !lp.status } : lp)
      })),

      addSyncTask: (taskName, type = 'signature', payload, meta) => set((state) => {
        const newTask: SyncTask = {
          id: Date.now(),
          task: taskName,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type,
          status: 'pending',
          retryCount: 0,
          payload: payload || 'Dữ liệu tác nghiệp thực địa PWA (Offline Storage)',
          ...meta
        };
        return { syncQueue: [newTask, ...state.syncQueue] };
      }),
      
      removeSyncTask: (id) => set((state) => ({
        syncQueue: state.syncQueue.filter(t => t.id !== id)
      })),

      clearSyncQueue: () => set({ syncQueue: [] }),
      
      sendMobileNotification: (title, message, type = 'urgent', targetAudience = 'Toàn bộ sàn') => set((state) => {
        const newNotif: MobileNotification = {
          id: Date.now(),
          title,
          message,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type,
          targetAudience,
          read: false
        };
        return { mobileNotifications: [newNotif, ...state.mobileNotifications] };
      }),

      markNotificationAsRead: (id) => set((state) => ({
        mobileNotifications: state.mobileNotifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),

      toggleWorkflow: (id) => set((state) => ({
        workflows: state.workflows.map(wf => wf.id === id ? { ...wf, active: !wf.active } : wf)
      })),
      
      runWorkflow: (id) => set((state) => ({
        workflows: state.workflows.map(wf => wf.id === id ? { ...wf, runs: wf.runs + 1 } : wf)
      })),

      sendMessage: (threadId, text, options) => set((state) => {
        const newMessage: ChatMessage = {
          id: `m_${Date.now()}`,
          threadId,
          senderId: 'me',
          senderName: 'Bạn',
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isFile: options?.isFile,
          fileName: options?.fileName,
          fileSize: options?.fileSize,
          msgType: options?.msgType || (options?.isFile ? 'file' : options?.listing ? 'listing' : 'text'),
          listing: options?.listing,
          isRead: true
        };
        const updatedDMs = state.chatDMs.map(dm =>
          dm.id === threadId ? { ...dm, lastMessage: text, lastTime: newMessage.time } : dm
        );
        return { 
          chatMessages: [...state.chatMessages, newMessage],
          chatDMs: updatedDMs
        };
      }),

      addChatChannel: (channel) => set((state) => {
        const newChan: ChatChannel = {
          id: `c_${Date.now()}`,
          name: channel.name.replace(/^#/, '').toLowerCase().trim().replace(/\s+/g, '-'),
          unread: 0,
          description: channel.description || 'Kênh trao đổi dự án & phòng ban',
          category: channel.category || 'project',
          membersCount: 1,
          topic: channel.topic || 'Kênh mới khởi tạo'
        };
        return { chatChannels: [...state.chatChannels, newChan] };
      }),

      markThreadRead: (threadId) => set((state) => ({
        chatChannels: state.chatChannels.map(c => c.id === threadId ? { ...c, unread: 0 } : c),
        chatDMs: state.chatDMs.map(d => d.id === threadId ? { ...d, unread: 0 } : d),
        chatMessages: state.chatMessages.map(m => m.threadId === threadId ? { ...m, isRead: true } : m)
      })),

      simulateCustomerReply: (threadId, text) => set((state) => {
        const dm = state.chatDMs.find(d => d.id === threadId);
        const replyText = text || (dm?.type === 'zalo' 
          ? 'Cảm ơn em đã tư vấn nhiệt tình! Anh/Chị đang xem qua bảng giá và sẽ báo lại em để chốt lịch hẹn nhé.' 
          : 'Nhất trí nhé! Team cứ triển khai theo đúng phương án đã thống nhất.');
        
        const newMessage: ChatMessage = {
          id: `m_${Date.now()}`,
          threadId,
          senderId: dm?.type === 'zalo' ? 'customer' : (dm?.id || 'other'),
          senderName: dm?.name || 'Khách hàng',
          senderAvatar: dm?.avatar || 'KH',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          msgType: 'text',
          isRead: false
        };

        const updatedDMs = state.chatDMs.map(d => 
          d.id === threadId ? { ...d, lastMessage: replyText, lastTime: newMessage.time, unread: (d.unread || 0) + 1 } : d
        );

        return {
          chatMessages: [...state.chatMessages, newMessage],
          chatDMs: updatedDMs
        };
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

      makeCall: (phone, customerName, projectName) => set((state) => {
        // Find if it belongs to a customer
        const customer = state.customers.find(c => c.phone.replace(/\s/g, '') === phone.replace(/\s/g, ''));
        const name = customerName || (customer ? customer.name : 'Khách vãng lai');
        
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
          agentName: 'Tuấn Tú (Ext 101)',
          projectName: projectName || 'The Grand Manhattan',
          disposition: randomSentiment === 'positive' ? 'Hẹn xem sa bàn' : randomSentiment === 'negative' ? 'Khách bận / Gọi lại sau' : 'Khách quan tâm',
          qaScore: randomSentiment === 'positive' ? 95 : randomSentiment === 'negative' ? 72 : 86,
          notes: 'Cuộc gọi trực tiếp qua Softphone WebRTC được AI ghi âm & bóc băng.',
          scores: { positive: pos, neutral: neu, negative: neg },
          takeaways: [
            `Khách hàng ${name} trao đổi về dự án ${projectName || 'The Grand Manhattan'}.`,
            `Cảm xúc phân loại AI: ${randomSentiment === 'positive' ? 'Tích cực (Khen & Hào hứng)' : randomSentiment === 'negative' ? 'Tiêu cực (Khách bận/Phàn nàn)' : 'Trung tính (Hỏi thông tin cơ bản)'}.`,
            `Đã lên lịch nhắc nhở follow-up trong hệ thống CRM.`
          ],
          metrics: { agentTalkRatio: `${Math.floor(Math.random() * 25) + 40}%`, speechRate: `${Math.floor(Math.random() * 20) + 115}` },
          transcript: [
            { speaker: 'agent', time: '00:05', text: `Dạ alo, em Tuấn Tú bên sàn BĐS xin chào ${name ? name : 'anh/chị'} ạ!` },
            { speaker: 'customer', time: '00:15', text: randomSentiment === 'positive' ? 'Chào em, căn hộ bên em giá và chính sách đợt này thế nào?' : randomSentiment === 'negative' ? 'Alo, anh đang bận họp nhé, gọi lại sau.' : 'Chào em, có thông tin gì mới không?' },
            { speaker: 'agent', time: '00:30', text: 'Dạ em xin phép gửi bảng tính chiết khấu và mặt bằng 3D qua Zalo để anh/chị tiện tham khảo nhé ạ.' }
          ]
        };

        return { callLogs: [newLog, ...state.callLogs] };
      }),

      updateCallDisposition: (id, disposition, notes) => set((state) => ({
        callLogs: state.callLogs.map(c => 
          c.id === id ? { ...c, disposition, notes: notes || c.notes } : c
        )
      })),

      addEvent: (data) => set((state) => {
        const nextId = `e${state.events.length + 1}`;
        const newEvent: EventItem = {
          ...data,
          id: nextId
        };
        return { events: [newEvent, ...state.events] };
      }),

      addCheckin: (eventId, ticketCode, guestName, isVip, table, seat, assignedAgent) => set((state) => {
        // Find the event to increment check-in count
        const eventIndex = state.events.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return state;

        const updatedEvents = [...state.events];
        updatedEvents[eventIndex] = {
          ...updatedEvents[eventIndex],
          checkedIn: updatedEvents[eventIndex].checkedIn + 1
        };

        const codeUpper = ticketCode.toUpperCase();
        const determinedVip = isVip ?? (codeUpper.startsWith('VIP') || codeUpper.startsWith('VVIP'));
        const name = guestName || (determinedVip ? 'Khách Hàng VVIP' : 'Khách Mời Tiêu Chuẩn');

        const newLog: CheckinLog = {
          id: `cl${state.checkinLogs.length + 1}`,
          eventId,
          name,
          ticket: codeUpper,
          time: 'Vừa xong',
          status: determinedVip ? 'VIP' : 'Standard',
          tableNumber: table || (determinedVip ? 'Bàn VVIP 01' : 'Bàn Standard 04'),
          seatNumber: seat || 'Ghế A-01',
          assignedAgent: assignedAgent || 'Lê Hoàng Anh',
          giftReceived: determinedVip
        };

        // If ticket matches a customer name directly
        if (!ticketCode.includes('-')) {
            newLog.name = ticketCode;
            newLog.ticket = `TKT-${Math.floor(Math.random() * 9000) + 1000}`;
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
          type: 'redeem',
          referenceCode: `RDM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          status: 'Thành công'
        };

        return {
          loyaltyPoints: state.loyaltyPoints - voucher.points,
          myVouchers: [voucher, ...state.myVouchers],
          loyaltyTransactions: [newTransaction, ...state.loyaltyTransactions]
        };
      }),

      earnLoyaltyPoints: (points, title, referenceCode, customerId, customerName) => set((state) => {
        const newTransaction: LoyaltyTransaction = {
          id: `lt${state.loyaltyTransactions.length + 1}`,
          title: title || 'Tích lũy điểm giao dịch BĐS',
          date: new Date().toISOString().split('T')[0],
          points,
          type: 'earn',
          referenceCode: referenceCode || `TX-${Math.floor(100000 + Math.random() * 900000)}`,
          customerId,
          customerName,
          status: 'Đã duyệt'
        };

        return {
          loyaltyPoints: state.loyaltyPoints + points,
          loyaltyTransactions: [newTransaction, ...state.loyaltyTransactions]
        };
      }),

      addVoucher: (voucher) => set((state) => ({
        vouchers: [voucher, ...state.vouchers]
      })),

      setLoyaltyPoints: (points) => set(() => ({
        loyaltyPoints: points
      })),

      addReview: (data) => set((state) => {
        const newId = `r${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];
        
        let sentiment: 'positive' | 'neutral' | 'negative' = data.sentiment || 'neutral';
        if (!data.sentiment) {
          if (data.rating >= 4) sentiment = 'positive';
          else if (data.rating <= 2) sentiment = 'negative';
        }

        const newReview: Review = {
          ...data,
          id: newId,
          date,
          sentiment,
          resolutionStatus: sentiment === 'negative' ? 'pending' : 'resolved'
        };
        return { reviews: [newReview, ...state.reviews] };
      }),

      resolveComplaint: (id, notes, staffName) => set((state) => ({
        reviews: state.reviews.map((r) =>
          r.id === id
            ? { ...r, resolutionStatus: 'resolved', resolutionNotes: notes, assignedStaff: staffName }
            : r
        )
      })),

      addSurveyCampaign: (data) => set((state) => {
        const newId = `sc${Date.now()}`;
        const newCampaign: SurveyCampaign = {
          ...data,
          id: newId,
          responses: 0,
          conversion: '0%',
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0],
          csatScore: 100,
          npsScore: 50,
          formUrl: `https://crm.proptech.vn/s/${newId}`
        };
        return { surveyCampaigns: [newCampaign, ...state.surveyCampaigns] };
      }),

      toggleSurveyCampaignStatus: (id) => set((state) => ({
        surveyCampaigns: state.surveyCampaigns.map((c) =>
          c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c
        )
      })),

      addProject: (data) => set((state) => {
        const newId = `p${state.projects.length + 1}`;
        const newProject: Project = { ...data, id: newId };
        return { projects: [newProject, ...state.projects] };
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

      addInventoryItem: (item) => set((state) => {
        const newId = 'i_' + Date.now();
        return { inventory: [{ ...item, id: newId }, ...state.inventory] };
      }),

      addBookingTicket: (data) => set((state) => {
        const currentList = state.bookingTickets || INITIAL_BOOKING_TICKETS;
        const nextNum = currentList.length + 1001;
        const newId = `BK-${nextNum}`;
        const newTicket: BookingTicket = {
          ...data,
          id: newId,
          code: newId,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          approvalHistory: [
            {
              step: 'sale',
              actor: data.agent || 'Sale Agent',
              action: 'created',
              timestamp: 'Vừa xong',
              comment: data.notes || 'Khởi tạo phiếu booking giữ chỗ mới.'
            }
          ]
        };

        // Update inventory item status to 'Booking'
        const updatedInventory = state.inventory.map(i =>
          i.id === data.unitId ? {
            ...i,
            status: 'Booking' as const,
            customerId: data.customerId,
            holdingAgent: data.agent,
            bookingExpiresAt: data.expiresAt
          } : i
        );

        return {
          bookingTickets: [newTicket, ...currentList],
          inventory: updatedInventory
        };
      }),

      updateBookingTicketStatus: (id, nextStatus, note, actor = 'Hệ thống') => set((state) => {
        const currentList = state.bookingTickets || INITIAL_BOOKING_TICKETS;
        const updatedTickets = currentList.map(t => {
          if (t.id !== id) return t;
          const historyItem = {
            step: nextStatus,
            actor,
            action: 'approved' as const,
            timestamp: 'Vừa xong',
            comment: note || `Chuyển trạng thái sang ${nextStatus}.`
          };
          return {
            ...t,
            status: nextStatus,
            time: 'Vừa xong',
            priority: 'normal' as const,
            approvalHistory: [...(t.approvalHistory || []), historyItem]
          };
        });

        return { bookingTickets: updatedTickets };
      }),

      rejectBookingTicket: (id, reason = 'Từ chối duyệt, trả về Sale hoàn thiện hồ sơ', actor = 'Quản lý') => set((state) => {
        const currentList = state.bookingTickets || INITIAL_BOOKING_TICKETS;
        const updatedTickets = currentList.map(t => {
          if (t.id !== id) return t;
          const historyItem = {
            step: 'sale',
            actor,
            action: 'rejected' as const,
            timestamp: 'Vừa xong',
            comment: reason
          };
          return {
            ...t,
            status: 'sale' as const,
            time: 'Vừa xong',
            priority: 'high' as const,
            notes: `[Từ chối bởi ${actor}]: ${reason}`,
            approvalHistory: [...(t.approvalHistory || []), historyItem]
          };
        });

        return { bookingTickets: updatedTickets };
      }),

      extendBookingSLA: (id, minutes, reason = 'Khách xin thêm thời gian thu xếp tài chính') => set((state) => {
        const currentList = state.bookingTickets || INITIAL_BOOKING_TICKETS;
        const updatedTickets = currentList.map(t => {
          if (t.id !== id) return t;
          const newMinutes = (t.remainingMinutes || 30) + minutes;
          const historyItem = {
            step: t.status,
            actor: 'Quản trị viên',
            action: 'extended' as const,
            timestamp: 'Vừa xong',
            comment: `Gia hạn thêm ${minutes} phút. Lý do: ${reason}`
          };
          return {
            ...t,
            remainingMinutes: newMinutes,
            expiresAt: `Gia hạn +${minutes}p (${newMinutes} phút còn lại)`,
            approvalHistory: [...(t.approvalHistory || []), historyItem]
          };
        });

        return { bookingTickets: updatedTickets };
      }),

      updateContractStatus: (id, status) => set((state) => ({
        contracts: state.contracts.map(c => c.id === id ? { ...c, status } : c)
      })),

      recordContractPayment: (contractId, installmentNumber, paidAmount, invoiceRef) => set((state) => {
        const contract = state.contracts.find(c => c.id === contractId);
        if (!contract || !contract.paymentSchedule) return state;

        const updatedSchedule = contract.paymentSchedule.map(s => {
          if (s.installment === installmentNumber) {
            return {
              ...s,
              status: 'Đã thu' as const,
              paidDate: new Date().toISOString().split('T')[0],
              invoiceRef: invoiceRef || `INV-AUTO-${Date.now().toString().slice(-4)}`
            };
          }
          return s;
        });

        const totalPaid = updatedSchedule
          .filter(s => s.status === 'Đã thu')
          .reduce((sum, s) => sum + s.amount, 0);

        const newPaymentProgress = Math.min(100, Math.round((totalPaid / contract.value) * 100));

        return {
          contracts: state.contracts.map(c => c.id === contractId ? {
            ...c,
            paymentProgress: newPaymentProgress,
            paymentSchedule: updatedSchedule
          } : c)
        };
      }),

      addContract: (data) => set((state) => {
        const newId = `ct${state.contracts.length + 1}`;
        const newCode = `HD-${String(state.contracts.length + 922).padStart(3, '0')}`;
        
        // Generate default 5-installment schedule if none provided
        const defaultSchedule = data.paymentSchedule || [
          { installment: 1, milestone: 'Ký thỏa thuận đặt cọc', percentage: 15, amount: Math.round(data.value * 0.15), dueDate: new Date().toISOString().split('T')[0], status: 'Đã thu' as const, paidDate: new Date().toISOString().split('T')[0], invoiceRef: `INV-INIT-${Date.now().toString().slice(-4)}` },
          { installment: 2, milestone: 'Ký HĐMB - Hoàn thành móng', percentage: 15, amount: Math.round(data.value * 0.15), dueDate: '2024-09-30', status: 'Đến hạn' as const },
          { installment: 3, milestone: 'Cất nóc công trình', percentage: 20, amount: Math.round(data.value * 0.20), dueDate: '2024-12-30', status: 'Chưa đến hạn' as const },
          { installment: 4, milestone: 'Thông báo nhận bàn giao nhà', percentage: 45, amount: Math.round(data.value * 0.45), dueDate: '2025-06-30', status: 'Chưa đến hạn' as const },
          { installment: 5, milestone: 'Bàn giao Giấy chứng nhận quyền sở hữu', percentage: 5, amount: Math.round(data.value * 0.05), dueDate: '2025-12-30', status: 'Chưa đến hạn' as const }
        ];

        const newContract: Contract = {
          ...data,
          id: newId,
          code: newCode,
          date: new Date().toISOString().split('T')[0],
          paymentProgress: data.paymentProgress || 15,
          paymentSchedule: defaultSchedule,
          attachments: [
            { id: `att_${Date.now()}_1`, name: `BanScan_${newCode}_Full.pdf`, size: '3.4 MB', date: new Date().toISOString().split('T')[0], type: 'pdf', category: 'Hợp đồng gốc' },
            { id: `att_${Date.now()}_2`, name: 'GiayXacNhanThanhToan_Dot1.pdf', size: '820 KB', date: new Date().toISOString().split('T')[0], type: 'pdf', category: 'UNC' }
          ]
        };
        
        // Also update inventory status automatically
        const updatedInventory = state.inventory.map(i => 
          i.id === data.inventoryId ? { ...i, status: 'Đã bán' as const, customerId: data.customerId } : i
        );

        return { 
          contracts: [newContract, ...state.contracts],
          inventory: updatedInventory
        };
      }),

      addReferralLead: (lead) => set((state) => {
        const newLead: ReferralLead = {
          ...lead,
          id: `ref-${state.referralLeads.length + 1}`
        };
        // Also sync to customers list if not present
        const newCustomer: Customer = {
          id: `c${state.customers.length + 1}`,
          code: `KH-${100 + state.customers.length + 1}`,
          name: lead.name,
          phone: lead.phone,
          email: lead.email || `${lead.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          rank: 'Tiềm Năng',
          revenue: 0,
          assignedTo: lead.assignedAgent || 'Tuấn Tú (CTV)',
          status: 'Đang tư vấn',
          createdAt: new Date().toISOString().split('T')[0]
        };
        return {
          referralLeads: [newLead, ...state.referralLeads],
          customers: [newCustomer, ...state.customers]
        };
      }),

      updateReferralLeadStatus: (id, status, payStatus) => set((state) => ({
        referralLeads: state.referralLeads.map(l => l.id === id ? { ...l, status, payStatus } : l)
      })),

      requestCommissionPayout: (amount, bankName, accountNumber, accountHolder, note) => set((state) => {
        const newPayout: CommissionPayout = {
          id: `po-${state.commissionPayouts.length + 1}`,
          amount,
          date: new Date().toISOString().split('T')[0],
          bankName,
          accountNumber,
          accountHolder,
          status: 'Đang xử lý',
          referenceCode: `REQ-PO-${Math.floor(100000 + Math.random() * 900000)}`,
          note
        };
        return {
          commissionPayouts: [newPayout, ...state.commissionPayouts]
        };
      }),

      addMarketplaceListing: (listing) => set((state) => ({
        marketplaceListings: [
          {
            ...listing,
            id: `m${state.marketplaceListings.length + 1}`
          },
          ...state.marketplaceListings
        ]
      })),

      requestDistributionRights: (listingId, agencyName, representative, note) => set((state) => ({
        marketplaceListings: state.marketplaceListings.map(l => 
          l.id === listingId ? { ...l, distributedByMe: true } : l
        )
      })),

      toggleDistributeListing: (listingId) => set((state) => ({
        marketplaceListings: state.marketplaceListings.map(l => 
          l.id === listingId ? { ...l, distributedByMe: !l.distributedByMe } : l
        )
      })),

      claimQuestReward: (questId) => set((state) => {
        const quest = state.gamificationQuests.find(q => q.id === questId);
        if (!quest || quest.rewardClaimed) return state;
        const gainedExp = quest.exp;
        const updatedQuests = state.gamificationQuests.map(q =>
          q.id === questId ? { ...q, rewardClaimed: true } : q
        );
        const newExp = state.currentUserExp + gainedExp;
        const newLevel = Math.floor(newExp / 3500) + 1;
        return {
          gamificationQuests: updatedQuests,
          currentUserExp: newExp,
          currentUserLevel: newLevel
        };
      }),

      redeemReward: (rewardId) => set((state) => {
        const reward = state.gamificationRewards.find(r => r.id === rewardId);
        if (!reward || state.currentUserExp < reward.costExp || reward.quantityRemaining <= 0) return state;
        const updatedRewards = state.gamificationRewards.map(r =>
          r.id === rewardId ? { ...r, quantityRemaining: r.quantityRemaining - 1 } : r
        );
        return {
          gamificationRewards: updatedRewards,
          currentUserExp: state.currentUserExp - reward.costExp
        };
      }),

      sendKudos: (agentId, message) => set((state) => {
        const updatedAgents = state.gamificationAgents.map(ag =>
          ag.id === agentId ? { ...ag, exp: ag.exp + 100 } : ag
        );
        return { gamificationAgents: updatedAgents };
      }),

      createChallenge: (opponentId, goal, betExp) => set((state) => ({
        currentUserExp: Math.max(0, state.currentUserExp - betExp)
      })),

      checkinDailyExp: () => set((state) => ({
        currentUserExp: state.currentUserExp + 200
      })),

      saveMortgageSimulation: (sim) => set((state) => {
        const newSim: MortgageSimulation = {
          ...sim,
          id: `SIM-${String(state.savedMortgageSimulations.length + 1).padStart(3, '0')}`,
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        };
        return { savedMortgageSimulations: [newSim, ...state.savedMortgageSimulations] };
      }),

      deleteMortgageSimulation: (id) => set((state) => ({
        savedMortgageSimulations: state.savedMortgageSimulations.filter(s => s.id !== id)
      })),

      addPortfolioProperty: (property) => set((state) => {
        const newProperty: PortfolioProperty = {
          ...property,
          id: `port-${Date.now()}`
        };
        return { portfolioProperties: [newProperty, ...state.portfolioProperties] };
      }),

      updatePortfolioProperty: (id, updates) => set((state) => ({
        portfolioProperties: state.portfolioProperties.map(p =>
          p.id === id ? { ...p, ...updates } : p
        )
      })),

      deletePortfolioProperty: (id) => set((state) => ({
        portfolioProperties: state.portfolioProperties.filter(p => p.id !== id)
      })),

      payPortfolioMilestone: (id) => set((state) => ({
        portfolioProperties: state.portfolioProperties.map(p => {
          if (p.id === id && p.nextMilestone) {
            return {
              ...p,
              nextMilestone: {
                ...p.nextMilestone,
                status: 'paid'
              }
            };
          }
          return p;
        })
      })),

      addDocumentFile: (file) => set((state) => {
        const newDoc: DocumentFile = {
          ...file,
          id: `doc-${Date.now()}`,
          downloadsCount: 0
        };
        return { documents: [newDoc, ...state.documents] };
      }),

      deleteDocumentFile: (id) => set((state) => ({
        documents: state.documents.filter(d => d.id !== id)
      })),

      incrementDocumentDownload: (id) => set((state) => ({
        documents: state.documents.map(d =>
          d.id === id ? { ...d, downloadsCount: (d.downloadsCount || 0) + 1 } : d
        )
      })),

      toggleIntegrationConnection: (id) => set((state) => ({
        integrationApps: state.integrationApps.map(app => 
          app.id === id ? { 
            ...app, 
            connected: !app.connected, 
            lastSync: app.connected ? 'Vừa ngắt kết nối' : 'Vừa kết nối thành công' 
          } : app
        )
      })),

      updateIntegrationConfig: (id, endpoint, apiKey) => set((state) => ({
        integrationApps: state.integrationApps.map(app =>
          app.id === id ? { 
            ...app, 
            endpoint, 
            apiKey, 
            connected: true, 
            lastSync: 'Vừa cấu hình & kiểm tra thành công' 
          } : app
        )
      })),

      addApiKey: (keyData) => set((state) => {
        const newKey: ApiKeyItem = {
          ...keyData,
          id: `key-${Date.now()}`,
          createdAt: new Date().toISOString().slice(0, 10)
        };
        return { apiKeys: [newKey, ...state.apiKeys] };
      }),

      revokeApiKey: (id) => set((state) => ({
        apiKeys: state.apiKeys.map(k => k.id === id ? { ...k, status: 'revoked' } : k)
      })),

      toggleWebhookStatus: (id) => set((state) => ({
        webhooks: state.webhooks.map(wh => wh.id === id ? { ...wh, active: !wh.active } : wh)
      })),

      addIntegrationApp: (appData) => set((state) => {
        const newApp: IntegrationApp = {
          ...appData,
          id: `app_${Date.now()}`,
          connected: true,
          lastSync: 'Vừa kích hoạt',
          requestCount24h: 0
        };
        return { integrationApps: [...state.integrationApps, newApp] };
      })
    }),
    {
      name: 'novacrm-storage-v5', // name of item in local storage
    }
  )
);
