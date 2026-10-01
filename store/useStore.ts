import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  AppDatabase, Customer, Project, InventoryItem, Contract, BookingTicket, Campaign,
  Article, LandingPage, Review, SurveyCampaign, Voucher, LoyaltyTransaction,
  EventItem, CheckinLog, CallLog, TaskItem, DocumentFolder, DocumentFile,
  ChatChannel, ChatDM, ChatMessage, WorkflowItem, SyncTask, MobileNotification,
  HeatmapData, KnowledgeFile, AIChatMessage
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
      bookingTickets: INITIAL_BOOKING_TICKETS,
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
      })
    }),
    {
      name: 'novacrm-storage-v5', // name of item in local storage
    }
  )
);
